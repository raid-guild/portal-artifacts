const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const levels=require('../../../services/leaderboards/src/dune-content.json').levels.map(level=>level.id);
const url=process.env.DUNE_TEST_URL||'http://127.0.0.1:3101/dune-relay/';
const campaign=ending=>({version:5,completed:levels,coins:911,region:'river',companions:['keeper','wayfinder','gatewright','fieldkeeper','towncrier'],oasisTransition:'ready',transition:null,gatehouseReady:true,farmlandReady:true,townReady:true,castleReady:true,riverReady:true,activeCompanion:'keeper',demoEnding:'done',farmlandEnding:'done',townEnding:'done',castleEnding:'done',riverEnding:ending});
const entitlement=state=>({accountId:'42',farmland:{unlocked:true,eligible:true,unlockedAt:'2026-11-21T00:00:00.000Z'},campaignPass:{state,unlocked:state==='active',unlockedAt:state==='active'?'2026-11-21T00:00:00.000Z':null,checkedAt:'2026-11-21T00:00:01.000Z',storeUrl:'https://store.example.test/products/dune-relay-pass'}});
async function fixture(browser,ending,options={}){
  const context=await browser.newContext({viewport:{width:1180,height:660},reducedMotion:'reduce'});
  const page=await context.newPage(),writes=[];
  await page.addInitScript(()=>{window.__filmReleases=0;const load=HTMLMediaElement.prototype.load;HTMLMediaElement.prototype.load=function(...args){if(this.tagName==='VIDEO'&&!this.hasAttribute('src'))window.__filmReleases++;return load.apply(this,args);};});
  let entitlementReads=0;
  await page.route('**/leaderboard-api/dune-relay/**',route=>{
    const request=route.request(),path=new URL(request.url()).pathname;
    if(request.method()!=='GET'&&request.method()!=='HEAD')writes.push({path,body:request.postDataJSON()});
    const state=options.revokeOnReplay&&path.endsWith('/entitlements')&&++entitlementReads>1?'locked':'active';
    const body=path.endsWith('/session')?{accountId:'42',displayName:'River tester',contentVersion:'chapter-7-2'}:path.endsWith('/campaign')?{accountId:'42',hasCampaign:true,profile:{revision:20,imported:true,campaign:campaign(ending)}}:path.endsWith('/entitlements')?entitlement(state):{ok:true};
    return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});
  });
  if(options.blockMedia)await page.route('**/cinematics/river-upstream-journey.mp4',route=>route.abort());
  await page.goto(url);
  await page.getByRole('button',{name:/Board the river boat/}).click();
  return {context,page,writes};
}
async function filmReady(page){
  const video=page.locator('.film-screen video[src]');
  await video.waitFor({timeout:30000});
  await page.locator('.awning-wipe').waitFor({state:'detached',timeout:30000});
  assert.match(await video.getAttribute('src'),/river-upstream-journey\.mp4/);
  assert.match(await video.getAttribute('poster'),/river-upstream-journey-poster\.webp/);
  assert.equal(await page.locator('canvas').count(),0,'game renderer is released while River film plays');
  return video;
}
async function tap(page,x,y){
  const canvas=page.locator('canvas').first();await canvas.waitFor({state:'visible',timeout:30000});
  const box=await canvas.boundingBox();assert(box);const scale=box.width/960,top=540-box.height/scale;
  await page.mouse.click(box.x+x*scale,box.y+(y-top)*scale);
}
async function replayChoice(page){
  await page.locator('.game-canvas[data-replay-destinations*="riverChart"] canvas').waitFor({timeout:30000});
  await page.locator('.awning-wipe').waitFor({state:'detached',timeout:30000});
  await tap(page,474,350);
  await page.getByRole('dialog',{name:'Choose a level to replay'}).waitFor({timeout:30000});
  await page.getByRole('button',{name:/7\.10 · OPEN THE COLLECTION ROUTE/}).click();
  await page.getByRole('dialog',{name:'Replay chapter finale'}).waitFor();
}
async function firstCompletion(browser,mode){
  const {context,page,writes}=await fixture(browser,'film',{blockMedia:mode==='blocked'});
  try{
    const video=await filmReady(page);
    if(mode==='blocked')await page.getByRole('button',{name:/Play scene/}).waitFor({timeout:30000});
    if(mode==='natural')await video.evaluate(element=>{element.dispatchEvent(new Event('ended'));element.dispatchEvent(new Event('ended'));});
    else await page.getByRole('button',{name:/Skip scene/}).click();
    await page.getByRole('heading',{name:/THE RIVER ROUTE IS OPEN/}).waitFor({timeout:30000});
    assert.equal(await page.locator('.film-screen').count(),0);
    assert.ok(await page.evaluate(()=>window.__filmReleases),'video source unloaded after completion');
    await page.waitForTimeout(100);
    assert.ok(writes.some(write=>JSON.stringify(write.body).includes('"riverEnding":"thanks"')),'River thanks checkpoint requested');
  }finally{await context.close();}
}
async function reloadAtFilm(browser){
  const {context,page}=await fixture(browser,'film');
  try{
    await filmReady(page);await page.reload();
    await page.getByRole('button',{name:/Board the river boat/}).click();
    await filmReady(page);
    await page.getByRole('button',{name:/Skip scene/}).click();
    await page.getByRole('heading',{name:/THE RIVER ROUTE IS OPEN/}).waitFor({timeout:30000});
  }finally{await context.close();}
}
async function replay(browser,revoked){
  const {context,page,writes}=await fixture(browser,'done',{revokeOnReplay:revoked});
  try{
    await replayChoice(page);
    const before=writes.length;
    await page.getByRole('button',{name:'Watch cutscene'}).click();
    if(revoked){
      await page.getByText(/chapter is not available for replay/).waitFor({timeout:30000});
      assert.equal(await page.locator('.film-screen').count(),0);
    }else{
      await filmReady(page);
      await page.getByRole('button',{name:/Skip scene/}).click();
      await page.getByRole('dialog',{name:'Choose a level to replay'}).waitFor({timeout:30000});
      assert.equal(await page.getByRole('heading',{name:/THE RIVER ROUTE IS OPEN/}).count(),0,'replay skips first-time celebration');
    }
    assert.equal(writes.length,before,'replay does not change campaign or coins');
  }finally{await context.close();}
}
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE||'/usr/bin/google-chrome',args:['--no-sandbox','--disable-dev-shm-usage']});try{
  await firstCompletion(browser,'natural');await firstCompletion(browser,'skip');await firstCompletion(browser,'blocked');
  await reloadAtFilm(browser);await replay(browser,false);await replay(browser,true);
  console.log('River finale film: end, skip, blocked media, reload, active/revoked final-level replay, and decoder cleanup passed.');
}finally{await browser.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
