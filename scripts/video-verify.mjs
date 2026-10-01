import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const base=process.env.BASE_URL || 'http://127.0.0.1:4180';
await mkdir('qa/video',{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
try {
  for(const [name,width,height] of [['desktop',1440,900],['mobile',390,844]]) {
    const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce',hasTouch:name==='mobile'});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(base,{waitUntil:'networkidle'});
    await page.waitForTimeout(700);
    assert(await page.locator('video').evaluate(v=>v.paused&&v.currentTime<.2),'do not consume opening behind cookie dialog');
    await page.getByRole('button',{name:'Endast nödvändiga'}).click();
    await page.waitForFunction(()=>{const v=document.querySelector('video');return !v.paused&&v.currentTime>.2});
    await page.screenshot({path:`qa/video/${name}-playing.png`});
    const surface=page.locator('.hero-art-video');
    await surface.focus();await page.keyboard.press('Space');
    assert(await page.locator('video').evaluate(v=>v.paused),'keyboard pause without toolbar');
    const frozen=await page.locator('video').evaluate(v=>v.currentTime);
    await page.waitForTimeout(400);
    assert.equal(await page.locator('video').evaluate(v=>v.currentTime),frozen,'pause remains paused');
    await page.keyboard.press('Enter');
    await page.waitForFunction(()=>!document.querySelector('video').paused);
    await page.evaluate(()=>scrollTo(0,1900));
    await page.waitForFunction(()=>document.querySelector('video').paused);
    const offscreen=await page.locator('video').evaluate(v=>v.currentTime);
    await page.waitForTimeout(500);
    assert.equal(await page.locator('video').evaluate(v=>v.currentTime),offscreen,'offscreen pause');
    await page.evaluate(()=>scrollTo(0,0));
    await page.waitForFunction(()=>{const v=document.querySelector('video');return v.paused&&v.currentTime>=3});
    await page.screenshot({path:`qa/video/${name}-open.png`});
    await surface.click({position:{x:100,y:80}});
    await page.waitForFunction(()=>{const v=document.querySelector('video');return !v.paused&&v.currentTime>.15&&v.currentTime<2});
    assert(await page.locator('video').evaluate(v=>v.muted&&!v.controls&&!v.loop),'silent bounded playback');
    assert.equal(await page.locator('.hero-art button, .hero-art-top').count(),0);
    assert.deepEqual(errors,[]);await page.close();
    console.log(`${name}: reduced-motion autoplay, cookie wait, pause, replay, offscreen pause and freeze passed`);
  }
  const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
  await page.addInitScript(()=>{localStorage.setItem('webbsmedjan-cookie-choice-v1',JSON.stringify({necessary:true,statistics:false,marketing:false}));document.addEventListener('DOMContentLoaded',()=>scrollTo(0,1900));});
  await page.goto(base,{waitUntil:'networkidle'});await page.waitForTimeout(700);
  assert(await page.locator('video').evaluate(v=>v.getBoundingClientRect().bottom<0&&v.paused&&v.currentTime<.2),'restored scroll does not consume opening');
  await page.evaluate(()=>scrollTo(0,0));
  await page.waitForFunction(()=>{const v=document.querySelector('video');return !v.paused&&v.currentTime>.15});
  await page.close();console.log('Restored-scroll first-view autoplay passed. No emails sent.');
} finally { await browser.close(); }
