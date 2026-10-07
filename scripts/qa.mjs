import {chromium} from '@playwright/test';
import fs from 'node:fs';
fs.mkdirSync('qa',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[];
for(const [width,height] of [[1440,900],[390,844],[360,800],[1920,1080]]){
 const context=await browser.newContext({viewport:{width,height},permissions:['clipboard-read','clipboard-write']});
 console.log("Viewport",width);const page=await context.newPage();page.setDefaultTimeout(10000);const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.goto((process.env.QA_URL || 'http://localhost:3000'),{waitUntil:'networkidle'});await page.waitForTimeout(1500);
 const overflow=[];
 for(const section of ['top','about','skills','work','experience','contact']){
  await page.locator(`#${section}`).scrollIntoViewIfNeeded();await page.waitForTimeout(700);
  const dimensions=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
  if(dimensions.width!==dimensions.scroll)overflow.push({section,...dimensions});
  if([1440,390].includes(width))await page.screenshot({path:`qa/${width}-${section}.png`});
 }
 await page.locator('#top').scrollIntoViewIfNeeded();await page.waitForTimeout(700);
 await page.locator('.sound').click({force:true});await page.waitForTimeout(300);
 const heroPlaying=await page.locator('video').evaluate(v=>!v.paused);
 await page.locator('#skills').scrollIntoViewIfNeeded();await page.waitForTimeout(700);
 const heroPaused=await page.locator('video').evaluate(v=>v.paused);
 await page.locator('#top').scrollIntoViewIfNeeded();await page.waitForTimeout(700);
 const heroResumed=await page.locator('video').evaluate(v=>!v.paused);
 await page.locator('#about').evaluate(e=>e.scrollIntoView());await page.locator('.id-card').focus();await page.keyboard.press('Enter');
 const cardFlipped=await page.locator('.id-card').getAttribute('aria-pressed')==='true';
 await page.locator('.element').filter({hasText:'Python'}).focus();const inspector=await page.locator('.inspector-content h3').innerText();
 await page.locator('.project-spine').nth(1).click({force:true});const projectExpanded=await page.locator('.project-spine').nth(1).getAttribute('aria-expanded')==='true';
 if(width<700){await page.locator('.menu-toggle').click({force:true});await page.keyboard.press('Escape');if(await page.locator('.mobile-overlay').count())errors.push('Menu Escape failed');}
 await page.getByRole('button',{name:'Copy email address'}).click({force:true});await page.waitForTimeout(200);const copied=await page.getByRole('button',{name:'Copy email address'}).innerText();
 results.push({width,height,overflow,errors,heroPlaying,heroPaused,heroResumed,cardFlipped,inspector,projectExpanded,copied});await context.close();
}
const reduced=await browser.newContext({reducedMotion:'reduce',viewport:{width:390,height:844}});const rp=await reduced.newPage();await rp.goto((process.env.QA_URL || 'http://localhost:3000'));await rp.locator('#skills').scrollIntoViewIfNeeded();results.push({reducedMotion:await rp.locator('.element').first().evaluate(e=>getComputedStyle(e).opacity)});
fs.writeFileSync('qa/results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));await browser.close();
