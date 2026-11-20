const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const path = require('node:path');
const fs = require('node:fs');
const ts = require('typescript');
require('node:module')._extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,filename);
const {createPuzzle} = require('../src/game/core.ts');
const {LEVELS} = require('../src/game/levels.ts');
const url = process.env.DUNE_TEST_URL || 'http://127.0.0.1:3000/';
const guestKey = 'dune-relay-campaign-stats-guest-v1';
const accountKey = id => `dune-relay-campaign-stats-account-${id}-v1`;
const empty = {version:5,completed:[],coins:0,region:'oasis',companions:[],oasisTransition:'locked',transition:null,gatehouseReady:false,demoEnding:'locked'};
async function exportStats(page, format) {
  await page.getByRole('button', {name:'Settings'}).click();
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', {name:`Export level stats (${format.toUpperCase()})`}).click()]);
  const content = require('node:fs').readFileSync(await download.path(), 'utf8');
  await page.getByRole('button', {name:'Close', exact:true}).click();
  return {content, filename:download.suggestedFilename()};
}
async function checkLayout(page, label) {
  const boxes = await page.evaluate(() => {
    const box = selector => { const r=document.querySelector(selector).getBoundingClientRect(); return {left:r.left,right:r.right,top:r.top,bottom:r.bottom}; };
    return {hud:box('.save-hud'),coin:box('.coin-pill'),cloud:box('.cloud-pill'),actions:box('.top-actions'),frame:box('.frame')};
  });
  assert(boxes.cloud.top < boxes.frame.top + boxes.frame.bottom * .15, `${label}: status stays in top row`);
  assert(boxes.coin.right <= boxes.cloud.left + 1 || boxes.coin.bottom <= boxes.cloud.top, `${label}: coin and badge do not overlap`);
  assert(boxes.hud.right <= boxes.actions.left + 2, `${label}: HUD and controls do not overlap`);
  assert(boxes.cloud.bottom < boxes.frame.top + boxes.frame.bottom * .17, `${label}: badge clears the map title`);
}
async function tapMap(page, x, y) {
  const box=await page.locator('canvas').first().boundingBox();
  const scale=box.width/960, top=540-box.height/scale;
  await page.mouse.click(box.x+x*scale,box.y+(y-top)*scale);
}
async function playOpening(page) {
  const [from,to]=createPuzzle(LEVELS.pumpHouse).opening;
  const box=await page.locator('canvas').first().boundingBox();
  const point=cell=>({x:box.x+box.width/2+(330+(cell.col+.5)*50-480)*box.height/540,y:box.y+(45+(cell.row+.5)*50)*box.height/540});
  const a=point(from),b=point(to);
  await page.mouse.move(a.x,a.y);await page.mouse.down();await page.mouse.move(b.x,b.y,{steps:4});await page.mouse.up();
}
(async () => {
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE || '/usr/bin/google-chrome',args:['--no-sandbox','--disable-dev-shm-usage']});
  try {
    for (const viewport of [{width:1100,height:650},{width:844,height:390},{width:667,height:375}]) {
      const context=await browser.newContext({viewport,reducedMotion:'reduce',acceptDownloads:true});
      await context.addInitScript(save=>localStorage.setItem('dune-relay-campaign-v5',JSON.stringify(save)),{...empty,coins:99999999,completed:['pumpHouse'],companions:['keeper']});
      const page=await context.newPage();
      await page.route('**/leaderboard-api/dune-relay/**',route=>route.fulfill({status:401,contentType:'application/json',body:'{}'}));
      await page.goto(url); await page.getByRole('button',{name:/Enter the oasis/}).click();
      await page.locator('.awning-wipe').waitFor({state:'detached'});
      await checkLayout(page,`map ${viewport.width}`);
      await page.screenshot({path:path.join(__dirname,'../test-results',`stats-hud-map-${viewport.width}x${viewport.height}.png`)});
      const json=await exportStats(page,'json');
      assert.equal(json.filename.startsWith('dune-relay-campaign-'),true);
      assert.equal(JSON.parse(json.content).attempts.length,0);
      const csv=await exportStats(page,'csv'); assert(csv.content.includes('levelId'));
      await context.close();
    }
    for (const viewport of [{width:1100,height:650},{width:844,height:390},{width:667,height:375}]) {
      const context=await browser.newContext({viewport,reducedMotion:'reduce'});
      await context.addInitScript(save=>localStorage.setItem('dune-relay-campaign-v5',JSON.stringify(save)),{...empty,coins:99999999});
      const page=await context.newPage();
      await page.route('**/leaderboard-api/dune-relay/**',route=>route.fulfill({status:401,contentType:'application/json',body:'{}'}));
      await page.goto(url);await page.getByRole('button',{name:/Enter the oasis/}).click();await page.locator('.awning-wipe').waitFor({state:'detached'});
      await tapMap(page,447,375);await page.getByRole('button',{name:/Let's do it/}).click();await page.locator('.awning-wipe').waitFor({state:'detached'});
      for (const [x,y] of [[756,289],[730,310],[756,356]]) { if (await page.locator('.booster-shop').count()) break; await tapMap(page,x,y);await page.waitForTimeout(300); }
      await page.locator('.booster-shop').waitFor();await page.getByRole('button',{name:/Start level/}).click();
      await page.locator('canvas[data-play-ready="true"]').waitFor({timeout:30000});
      await checkLayout(page,`board ${viewport.width}`);
      const position=await page.evaluate(()=>{ const frame=document.querySelector('.frame').getBoundingClientRect(),hud=document.querySelector('.save-hud').getBoundingClientRect();return {hudRight:hud.right,boardLeft:frame.left+frame.width/2-150*frame.height/540}; });
      assert(position.hudRight<=position.boardLeft+1,`board ${viewport.width}: HUD clears first column`);
      await page.screenshot({path:path.join(__dirname,'../test-results',`stats-hud-board-${viewport.width}x${viewport.height}.png`)});
      const attempt=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).attempts.at(-1),guestKey);
      assert.equal(attempt.outcome,'playing');assert.equal(attempt.boosterMode,'campaign');
      await playOpening(page);
      await page.waitForFunction(key=>JSON.parse(localStorage.getItem(key)).attempts.at(-1)?.movesUsed===1,guestKey);
      const moved=JSON.parse((await exportStats(page,'json')).content).attempts.at(-1);
      assert.equal(moved.movesUsed,1);assert.equal(moved.moves.length,1);
      await page.reload();
      await page.waitForFunction(key=>JSON.parse(localStorage.getItem(key)).attempts.at(-1).outcome==='abandoned',guestKey);
      assert.equal(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).attempts.at(-1).outcome,guestKey),'abandoned','reload marks unfinished guest attempt abandoned');
      await context.close();
    }
    const context=await browser.newContext({viewport:{width:1100,height:650},reducedMotion:'reduce',acceptDownloads:true});
    const page=await context.newPage();let account='101';
    await page.route('**/leaderboard-api/dune-relay/**',route=>{
      const path=new URL(route.request().url()).pathname.split('/dune-relay')[1];
      const body=path==='/session'?{accountId:account,displayName:'Long Portal Account Name For Layout',contentVersion:'chapter-3-3'}:path==='/campaign'?{accountId:account,hasCampaign:true,profile:{revision:1,campaign:empty,imported:false}}:path==='/entitlements'?{accountId:account,farmland:{eligible:false,unlocked:false,unlockedAt:null}}:{ok:true};
      return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});
    });
    await page.goto(url); await page.getByText('Saved to Portal').waitFor();
    await page.getByRole('button',{name:/Enter the oasis/}).click(); await page.locator('.awning-wipe').waitFor({state:'detached'});
    await checkLayout(page,'account map');
    const stats=await exportStats(page,'json'); assert.equal(JSON.parse(stats.content).attempts.length,0);
    assert(!stats.content.includes('101'));assert(!stats.content.includes('Long Portal'));
    assert.equal(await page.evaluate(key=>localStorage.getItem(key) !== null,accountKey(account)),true);
    await tapMap(page,447,375);await page.getByRole('button',{name:/Let's do it/}).click();await page.locator('.awning-wipe').waitFor({state:'detached'});
    for (const [x,y] of [[756,289],[730,310],[756,356]]) { if (await page.locator('.booster-shop').count()) break; await tapMap(page,x,y);await page.waitForTimeout(300); }
    await page.locator('.booster-shop').waitFor();await page.getByRole('button',{name:/Start level/}).click();
    await page.locator('canvas[data-play-ready="true"]').waitFor({timeout:30000});
    await checkLayout(page,'account board');
    await page.screenshot({path:path.join(__dirname,'../test-results','stats-hud-account-board-1100x650.png')});
    await playOpening(page);
    await page.waitForFunction(key=>JSON.parse(localStorage.getItem(key)).attempts.at(-1)?.movesUsed===1,accountKey(account));
    const accountStats=await exportStats(page,'json');
    assert.equal(JSON.parse(accountStats.content).attempts.at(-1).movesUsed,1);
    assert(!accountStats.content.includes('101'));assert(!accountStats.content.includes('Long Portal'));
    await page.getByRole('button',{name:'Settings'}).click();await page.getByRole('button',{name:'Sign out of Portal'}).click();
    assert.equal(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).attempts.at(-1).outcome,accountKey(account)),'abandoned');
    assert.equal(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).attempts.length,guestKey),0,'account history stays out of guest archive');
    account='202';await page.reload();await page.getByText('Saved to Portal').waitFor();
    assert.equal(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).attempts.length,accountKey(account)),0);
    await context.close();
    console.log('Stats and HUD browser checks passed.');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
