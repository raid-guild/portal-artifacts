const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const levels=require('../../../services/leaderboards/src/dune-content.json').levels.map(level=>level.id);
const url=process.env.DUNE_TEST_URL||'http://127.0.0.1:3186/';
const allSave=(region,completed)=>({version:5,completed,coins:911,region,companions:['keeper','wayfinder','gatewright','fieldkeeper','towncrier'],oasisTransition:'ready',transition:null,gatehouseReady:true,farmlandReady:true,townReady:true,castleReady:true,activeCompanion:'keeper',demoEnding:'done',farmlandEnding:'done',townEnding:'done',castleEnding:'done'});
const entitlement=state=>({accountId:'42',farmland:{unlocked:true,eligible:true,unlockedAt:'2026-11-21T00:00:00.000Z'},campaignPass:{state,unlocked:state==='active',unlockedAt:state==='active'?'2026-11-21T00:00:00.000Z':null,checkedAt:'2026-11-21T00:00:01.000Z',storeUrl:'https://store.example.test/products/dune-relay-pass'}});
async function tap(page,x,y){const box=await page.locator('canvas').first().boundingBox();assert(box);const scale=box.width/960,top=540-box.height/scale;await page.mouse.click(box.x+x*scale,box.y+(y-top)*scale);}
async function openPicker(page,region){await page.locator('.awning-wipe').waitFor({state:'detached',timeout:30000});await page.locator(`.game-canvas[data-replay-destinations*="${region==='castle'?'openTheUpstreamRoute':'openWaterway'}"] canvas`).waitFor({timeout:30000});await tap(page,...(region==='castle'?[870,295]:[485,350]));await page.getByRole('dialog',{name:'Choose a level to replay'}).waitFor({timeout:20000});assert.equal(await page.getByRole('button',{name:'Watch chapter finale'}).count(),0,'no chapter-wide film action');}
async function selectFinale(page,name){
  await page.getByRole('button',{name:name==='oasis-awakens'?/1\.10 · OPEN THE WATERWAY/:/6\.10 · OPEN THE UPSTREAM ROUTE/}).click();
  await page.getByRole('dialog',{name:'Replay chapter finale'}).waitFor();
  await page.getByRole('button',{name:'Watch cutscene'}).waitFor();
}
async function filmReplay(page,name,mode='skip'){
  await selectFinale(page,name);
  await page.getByRole('button',{name:'Watch cutscene'}).click();
  const video=page.locator('.film-screen video[src]');
  await video.waitFor({timeout:30000});
  await page.locator('.awning-wipe').waitFor({state:'detached',timeout:30000});
  assert.match(await video.getAttribute('src'),new RegExp(name));
  assert.equal(await page.locator('canvas').count(),0,'renderer released while video plays');
  if(mode==='end')await video.evaluate(element=>{element.dispatchEvent(new Event('ended'));element.dispatchEvent(new Event('ended'));});
  else await page.getByRole('button',{name:/Skip scene/}).click();
  await page.getByRole('dialog',{name:'Choose a level to replay'}).waitFor({timeout:30000});
  assert.equal(await page.locator('.film-screen').count(),0);
  assert.equal(await page.getByRole('heading',{name:/coming soon|upstream route is open/i}).count(),0,'replay did not invoke first-time celebration');
}
async function guest(browser){
  const context=await browser.newContext({viewport:{width:1100,height:650},reducedMotion:'reduce'});
  const save=allSave('oasis',levels.slice(0,10));
  await context.addInitScript(value=>localStorage.setItem('dune-relay-campaign-v5',JSON.stringify(value)),save);
  const page=await context.newPage(),writes=[];
  await page.route('**/leaderboard-api/dune-relay/**',route=>{if(route.request().method()!=='GET')writes.push(route.request().url());return route.fulfill({status:401,contentType:'application/json',body:'{}'});});
  try{
    await page.goto(url);await page.getByRole('button',{name:/Enter the oasis/}).click();await page.locator('.awning-wipe').waitFor({state:'detached'});
    await openPicker(page,'oasis');
    const before=await page.evaluate(()=>localStorage.getItem('dune-relay-campaign-v5'));
    await filmReplay(page,'oasis-awakens','skip');
    await filmReplay(page,'oasis-awakens','end');
    await page.route('**/cinematics/oasis-awakens.mp4',route=>route.abort());
    await selectFinale(page,'oasis-awakens');
    await page.getByRole('button',{name:'Watch cutscene'}).click();
    await page.getByRole('button',{name:/Play scene/}).waitFor({timeout:30000});
    await page.locator('.awning-wipe').waitFor({state:'detached',timeout:30000});
    await page.getByRole('button',{name:/Skip scene/}).click();
    await page.getByRole('dialog',{name:'Choose a level to replay'}).waitFor();
    assert.equal(await page.evaluate(()=>localStorage.getItem('dune-relay-campaign-v5')),before,'guest campaign unchanged');
    assert.deepEqual(writes,[]);
    await page.reload();await page.getByRole('button',{name:/Enter the oasis/}).click();await page.locator('.awning-wipe').waitFor({state:'detached'});
    await openPicker(page,'oasis');
  }finally{await context.close();}
}
async function portal(browser){
  const context=await browser.newContext({viewport:{width:1100,height:650},reducedMotion:'reduce'});
  const page=await context.newPage(),writes=[];
  const campaign=allSave('castle',levels.slice(0,60));
  await page.route('**/leaderboard-api/dune-relay/**',route=>{
    const request=route.request(),path=new URL(request.url()).pathname;
    if(request.method()!=='GET'&&request.method()!=='HEAD'&&!path.endsWith('/rewards/visit'))writes.push(path);
    const body=path.endsWith('/session')?{accountId:'42',displayName:'Castle tester',contentVersion:'chapter-6-1'}:path.endsWith('/campaign')?{accountId:'42',hasCampaign:true,profile:{revision:20,imported:true,campaign,rewardClaims:{fieldToolkitV1:"2026-11-21T00:00:00.000Z"}}}:path.endsWith('/entitlements')?entitlement('active'):{ok:true};
    return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});
  });
  try{
    await page.goto(url);await page.getByRole('button',{name:/Enter Castle Island/}).click();await page.locator('.awning-wipe').waitFor({state:'detached'});
    await openPicker(page,'castle');
    await filmReplay(page,'castle-upstream-departure','skip');
    await filmReplay(page,'castle-upstream-departure','end');
    await selectFinale(page,'castle-upstream-departure');
    await page.getByRole('button',{name:'Back'}).click();
    await page.getByRole('button',{name:'Back to chapter'}).click();
    await page.getByRole('button',{name:'Kingdom Map'}).click();
    assert(await page.getByText('RIVER JOURNEY').isVisible());
    assert.equal(await page.getByText('Coming soon',{exact:true}).count(),0,'River is now playable');
    assert(await page.getByRole('button',{name:/RIVER JOURNEY/}).isVisible());
    assert.deepEqual(writes,[],'film replay and map do not write campaign APIs');
  }finally{await context.close();}
}
async function deniedPortal(browser,partial=false){
  const context=await browser.newContext({viewport:{width:1100,height:650},reducedMotion:'reduce'});
  const page=await context.newPage(),writes=[];
  const campaign=allSave('castle',partial?levels.slice(0,59):levels.slice(0,60));
  let entitlementReads=0;
  await page.route('**/leaderboard-api/dune-relay/**',route=>{
    const request=route.request(),path=new URL(request.url()).pathname;
    if(request.method()!=='GET'&&request.method()!=='HEAD'&&!path.endsWith('/rewards/visit'))writes.push(path);
    const state=path.endsWith('/entitlements')&&++entitlementReads===1?'active':'locked';
    const body=path.endsWith('/session')?{accountId:'42',displayName:'Castle tester',contentVersion:'chapter-6-1'}:path.endsWith('/campaign')?{accountId:'42',hasCampaign:true,profile:{revision:20,imported:true,campaign,rewardClaims:{fieldToolkitV1:"2026-11-21T00:00:00.000Z"}}}:path.endsWith('/entitlements')?entitlement(partial?'active':state):{ok:true};
    return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});
  });
  try{
    await page.goto(url);await page.getByRole('button',{name:/Enter Castle Island/}).click();await page.locator('.awning-wipe').waitFor({state:'detached'});
    if(partial){
      await page.getByRole('button',{name:'Kingdom Map'}).click();
      assert.equal(await page.getByText('RIVER JOURNEY').count(),0,'River preview hidden before all Castle levels complete');
      assert.equal(await page.getByRole('button',{name:/Watch cutscene/}).count(),0);
    }else{
      await openPicker(page,'castle');
      await selectFinale(page,'castle-upstream-departure');
      await page.getByRole('button',{name:'Watch cutscene'}).click();
      await page.getByText(/Claim the Dune Pass to replay this chapter/).waitFor();
      assert.equal(await page.locator('.film-screen').count(),0,'revoked Dune Pass cannot start finale');
    }
    assert.deepEqual(writes,[]);
  }finally{await context.close();}
}
async function recentlyVerifiedReplay(browser){
  const context=await browser.newContext({viewport:{width:1100,height:650},reducedMotion:'reduce'});
  const page=await context.newPage();
  const campaign=allSave('castle',levels.slice(0,60));
  let forced=0,reads=0;
  await page.route('**/leaderboard-api/dune-relay/**',route=>{
    const target=new URL(route.request().url()),path=target.pathname;
    let status=200,body={ok:true};
    if(path.endsWith('/session'))body={accountId:'42',displayName:'Replay tester',contentVersion:'chapter-7-6'};
    else if(path.endsWith('/campaign'))body={accountId:'42',hasCampaign:true,profile:{revision:20,imported:true,campaign,rewardClaims:{fieldToolkitV1:"2026-11-21T00:00:00.000Z"}}};
    else if(path.endsWith('/entitlements')){
      reads++;
      if(target.searchParams.get('refresh')==='1' && ++forced>1){status=429;body={message:'Refresh is cooling down.'};}
      else body=entitlement('active');
    }
    return route.fulfill({status,contentType:'application/json',body:JSON.stringify(body)});
  });
  try{
    await page.goto(url);await page.getByRole('button',{name:/Enter Castle Island/}).click();
    await page.getByRole('button',{name:'Kingdom Map'}).click();
    await page.getByRole('button',{name:/CASTLE ISLAND/}).click();
    await page.locator('.atlas-screen').waitFor({state:'detached',timeout:30000});
    await openPicker(page,'castle');
    await selectFinale(page,'castle-upstream-departure');
    await page.getByRole('button',{name:'Watch cutscene'}).click();
    await page.locator('.film-screen video[src]').waitFor({timeout:30000});
    assert.equal(forced,1,'recently verified replay does not force another commerce refresh');
    assert(reads>=2,'replay still reads authoritative server access');
    await page.getByRole('button',{name:/Skip scene/}).click();
  }finally{await context.close();}
}
async function cancelledPortal(browser,action){
  const context=await browser.newContext({viewport:{width:1100,height:650},reducedMotion:'reduce'});
  const page=await context.newPage(),writes=[];
  const campaign=allSave('castle',levels.slice(0,60));
  let reads=0,release,notify;
  const verificationStarted=new Promise(resolve=>{notify=resolve;});
  await page.route('**/leaderboard-api/dune-relay/**',async route=>{
    const request=route.request(),path=new URL(request.url()).pathname;
    if(request.method()!=='GET'&&request.method()!=='HEAD'&&!path.endsWith('/rewards/visit'))writes.push(path);
    if(path.endsWith('/entitlements')&&++reads===2){notify();await new Promise(resolve=>{release=resolve;});}
    const body=path.endsWith('/session')?{accountId:'42',displayName:'Castle tester',contentVersion:'chapter-6-1'}:path.endsWith('/campaign')?{accountId:'42',hasCampaign:true,profile:{revision:20,imported:true,campaign,rewardClaims:{fieldToolkitV1:"2026-11-21T00:00:00.000Z"}}}:path.endsWith('/entitlements')?entitlement('active'):{ok:true};
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});
  });
  try{
    await page.goto(url);await page.getByRole('button',{name:/Enter Castle Island/}).click();await page.locator('.awning-wipe').waitFor({state:'detached'});
    await openPicker(page,'castle');
    await selectFinale(page,'castle-upstream-departure');
    await page.getByRole('button',{name:'Watch cutscene'}).click();
    await verificationStarted;
    await page.getByRole('button',{name:'Back'}).click();
    if(action==='level') { await page.getByRole('button',{name:/6\.10 · OPEN THE UPSTREAM ROUTE/i}).click(); await page.getByRole('button',{name:'Play level'}).click(); }
    else await page.getByRole('button',{name:'Back to chapter'}).click();
    release();
    await page.waitForTimeout(500);
    assert.equal(await page.locator('.film-screen').count(),0,`late entitlement cannot open a finale after ${action}`);
    assert.equal(await page.getByRole('dialog',{name:'Choose a level to replay'}).count(),0);
    if(action==='level')await page.locator('.game-canvas[aria-label=\"OPEN THE UPSTREAM ROUTE puzzle\"]').waitFor({timeout:30000});
    assert.deepEqual(writes,[]);
  }finally{release?.();await context.close();}
}
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE||'/usr/bin/google-chrome',args:['--no-sandbox','--disable-dev-shm-usage']});try{if(process.env.DUNE_FINALE_ACCESS_ONLY){await deniedPortal(browser);await deniedPortal(browser,true);await recentlyVerifiedReplay(browser);await cancelledPortal(browser,'back');await cancelledPortal(browser,'level');console.log('Paid finale access, cooldown, revocation, and cancellation checks passed.');return;}await guest(browser);await portal(browser);await deniedPortal(browser);await deniedPortal(browser,true);await recentlyVerifiedReplay(browser);await cancelledPortal(browser,'back');await cancelledPortal(browser,'level');console.log('Completed Oasis and Castle finales replay read-only; recent checks avoid 429, revoked/incomplete/cancelled access remain safe; River becomes playable after Castle completion.');}finally{await browser.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
