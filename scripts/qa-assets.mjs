import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import {chromium} from '@playwright/test';
import {productionBasePath} from '../src/lib/base-path.mjs';

const url = process.env.QA_URL || `http://localhost:3002${productionBasePath}/`;
const production = new URL(url).pathname.startsWith(`${productionBasePath}/`);
const prefix = production ? productionBasePath : '';
const files = dir => fs.readdirSync(dir, {withFileTypes:true}).flatMap(entry =>
  entry.isDirectory() ? files(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);

// Exercise the actual helper in both build modes, including boundary cases.
const compiled = ts.transpileModule(fs.readFileSync('src/lib/asset.ts', 'utf8'), {
  compilerOptions:{module:ts.ModuleKind.CommonJS},
}).outputText;
for (const basePath of ['', productionBasePath]) {
  const context = {exports:{}, require:() => ({basePath})};
  vm.runInNewContext(compiled, context);
  const {asset} = context.exports;
  for (const file of ['hero/hero.mp4', '/Resume.pdf', '/og.jpg?v=2#preview']) {
    assert.equal(asset(file), basePath + (file.startsWith('/') ? file : `/${file}`));
    assert.equal(asset(asset(file)), asset(file));
  }
  for (const unchanged of ['', '#about', '?v=2', 'https://example.com/image.png',
    '//example.com/image.png', 'data:image/svg+xml,test', 'blob:example']) {
    assert.equal(asset(unchanged), unchanged);
  }
  if (basePath) {
    assert.equal(asset(`${basePath}?v=2`), `${basePath}?v=2`);
    assert.equal(asset(`${basePath}#top`), `${basePath}#top`);
    assert.equal(asset(`${basePath}-other/test.svg`), `${basePath}${basePath}-other/test.svg`);
  }
}

const browser = await chromium.launch({channel:'chrome', headless:true});
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {if (message.type() === 'error') errors.push(message.text());});
  page.on('response', response => {
    if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  });
  page.on('requestfailed', request => {
    if (request.failure()?.errorText !== 'net::ERR_ABORTED') errors.push(request.url());
  });
  await page.goto(url, {waitUntil:'networkidle'});
  // Check every public file, even formats not chosen by this browser.
  const publicFiles = files('public');
  for (const file of publicFiles) {
    const relative = path.relative('public', file).split(path.sep).join('/');
    const response = await page.request.get(new URL(`${prefix}/${relative}`, url).href);
    assert.equal(response.status(), 200, relative);
    assert.deepEqual(await response.body(), fs.readFileSync(file), relative);
    if (production) assert.deepEqual(fs.readFileSync(path.join('out', relative)), fs.readFileSync(file));
  }
  for (const tile of await page.locator('.element').all()) {
    await tile.focus();
    await page.waitForFunction(() => [...document.images].every(img => img.complete && img.naturalWidth > 0));
  }
  await page.locator('#top').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('video').readyState >= 2);
  const media = await page.locator('video').evaluate(video => ({
    error:video.error?.message, currentSrc:video.currentSrc, duration:video.duration,
    autoplay:video.autoplay, loop:video.loop, playsInline:video.playsInline, preload:video.preload,
  }));
  assert.equal(media.error, undefined);
  assert.ok(media.duration > 0);
  assert.ok(new URL(media.currentSrc).pathname.startsWith(`${prefix}/hero/`));
  assert.ok(media.autoplay && media.loop && media.playsInline);
  assert.equal(media.preload, 'auto');
  const formats = await page.evaluate(async prefix => {
    const results = [];
    for (const format of ['mp4', 'webm']) {
      const video = document.createElement('video');
      video.muted = true;
      video.src = `${prefix}/hero/hero.${format}`;
      try {
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error(`${format} load timed out`)), 10000);
          video.onloadeddata = () => {clearTimeout(timeout); resolve();};
          video.onerror = () => {clearTimeout(timeout); reject(new Error(video.error?.message));};
          video.load();
        });
        await video.play();
        results.push({format, duration:video.duration, playing:!video.paused});
      } finally {
        video.pause();
        video.removeAttribute('src');
        video.load();
      }
    }
    return results;
  }, prefix);
  assert.ok(formats.every(format => format.playing && format.duration > 0));
  const before = await page.locator('video').evaluate(video => video.muted);
  await page.locator('.sound').click({force:true});
  assert.notEqual(await page.locator('video').evaluate(video => video.muted), before);
  const downloadPromise = page.waitForEvent('download');
  await page.locator('a[download]').first().click();
  assert.equal((await downloadPromise).suggestedFilename(), 'Resume.pdf');
  const assets = await page.evaluate(async () => {
    await document.fonts.ready;
    return {
      urls:[...document.querySelectorAll('img,source,video[poster],link[href],a[download]')].flatMap(el =>
        ['src','poster','href'].map(attr => el.getAttribute(attr)).filter(Boolean)),
      fonts:[...document.fonts].map(font => ({family:font.family,status:font.status})),
      loadedFonts:performance.getEntriesByType('resource').filter(entry => entry.name.includes('.woff')).map(entry => entry.name),
      og:document.querySelector('meta[property="og:image"]')?.content,
    };
  });
  for (const value of assets.urls) {
    if (value.startsWith('/') && !value.startsWith('//')) assert.ok(value.startsWith(`${prefix}/`), value);
    assert.ok(!value.includes(`${productionBasePath}${productionBasePath}/`), value);
  }
  assert.equal(assets.loadedFonts.length, 4);
  for (const font of assets.urls.filter(value => value.includes('.woff'))) {
    const response = await page.request.get(new URL(font, url).href);
    assert.equal(response.status(), 200, font);
  }
  assert.ok(assets.fonts.some(font => font.status === 'loaded'));
  if (assets.og) assert.equal(new URL(assets.og).pathname, `${prefix}/og.jpg`);
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({url, publicFiles:publicFiles.length, media, formats, ...assets, errors}, null, 2));
} finally {
  await browser.close();
}
