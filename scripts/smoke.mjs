import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:3002',{waitUntil:'networkidle'});
 await page.screenshot({path:'qa/390-top.png'});
 const desktop=await browser.newPage({viewport:{width:1440,height:900}});
 await desktop.goto('http://127.0.0.1:3002',{waitUntil:'networkidle'});
 await desktop.screenshot({path:'qa/1440-top.png'});await desktop.close();
 const before=await page.locator('video').evaluate(v=>v.muted);
 await page.locator('.sound').tap({force:true});
 const after=await page.locator('video').evaluate(v=>v.muted);assert.notEqual(before,after);
 await page.locator('#about').evaluate(e=>e.scrollIntoView());
 await page.locator('.id-card').tap({force:true});assert.equal(await page.locator('.id-card').getAttribute('aria-pressed'),'true');
 await page.locator('.next-stop').evaluate(e=>e.scrollIntoView());await page.waitForTimeout(1000);
 await page.locator('.next-stop a').click();
 await page.waitForFunction(()=>document.getElementById('contact').getBoundingClientRect().top<innerHeight,undefined,{timeout:5000});
 assert.deepEqual(errors,[]);
 const result={touchSoundToggle:true,touchCardFlip:true,timelineSmoothAnchor:true,errors};
 fs.writeFileSync('qa/final-smoke.json',JSON.stringify(result,null,2));console.log(result);
}finally{await browser.close();}
