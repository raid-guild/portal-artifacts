// Manual production-preview check: start Vite preview, then set GAME_URL and
// run this with a Playwright installation available via PLAYWRIGHT_MODULE.
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const url = process.env.GAME_URL || 'http://127.0.0.1:4186/raid-survivor/';
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const browser = await chromium.launch({ headless:true, args:['--no-sandbox','--enable-unsafe-swiftshader','--renderer-process-limit=1'] });
try {
  async function scenario(name, session, expectMode, options={}) {
    const context=await browser.newContext({viewport:{width:1280,height:820}}),page=await context.newPage();
    page.setDefaultTimeout(12000);const errors=[];let runs=0;
    page.on('pageerror',error=>errors.push(String(error)));
    await page.route('**/leaderboard-api/raid-survivor/session',async route=>{
      if(session.delay)await delay(session.delay);
      if(session.error){try{await route.abort('failed')}catch{/* request may have timed out */}return;}
      try{await route.fulfill({status:session.status,contentType:'application/json',body:session.status===200?JSON.stringify({displayName:'Raida Tester'}):'{}'});}catch{/* request may have timed out */}
    });
    await page.route('**/leaderboard-api/raid-survivor/runs',async route=>{runs++;await route.fulfill({status:201,contentType:'application/json',body:'{"runId":"test-run"}'});});
    await page.goto(url,{waitUntil:'domcontentloaded'});
    if(options.waitForIdentity){await page.getByText('Raida Tester · PORTAL LINKED').waitFor();}
    await page.locator('#start').click();
    if(session.delay && !options.waitForIdentity)assert.equal(await page.locator('#start').isDisabled(),true);
    if(options.supersede){
      await page.locator('[data-hero="wizard"]').click();
      await page.locator('#start').click();
    }else if(options.doubleClick){await page.locator('#start').dispatchEvent('click');}
    await page.waitForFunction(mode=>document.querySelector('#runMode')?.textContent===mode,expectMode);
    assert.equal(await page.locator('#runMode').textContent(),expectMode);
    assert.equal(runs,expectMode==='PORTAL RANKED'?1:0,`${name}: run tickets`);
    assert.deepEqual(errors,[],`${name}: browser errors`);
    await context.close();console.log(`PASS ${name}`);
  }
  await scenario('healthy linked identity',{status:200},'PORTAL RANKED',{waitForIdentity:true});
  await scenario('delayed authenticated immediate start and duplicate click',{status:200,delay:700},'PORTAL RANKED',{doubleClick:true});
  await scenario('delayed authenticated superseded start',{status:200,delay:700},'PORTAL RANKED',{supersede:true});
  await scenario('delayed 401 guest fallback',{status:401,delay:700},'LOCAL RUN');
  await scenario('503 service unavailable',{status:503,delay:300},'LOCAL · RANKED UNAVAILABLE');
  await scenario('network failure service unavailable',{error:true,delay:300},'LOCAL · RANKED UNAVAILABLE');
  await scenario('session timeout service unavailable',{status:200,delay:5000},'LOCAL · RANKED UNAVAILABLE');
} finally { await browser.close(); }
