const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const levels=require('../../../services/leaderboards/src/dune-content.json').levels.map(level=>level.id);
const url=process.env.DUNE_TEST_URL||'http://127.0.0.1:3186/dune-relay/';
const castle=levels.slice(50,60);
const allSave=(region='castle',completed=levels.slice(0,60))=>({version:5,completed,coins:911,region,companions:['keeper','wayfinder','gatewright','fieldkeeper','towncrier'],oasisTransition:'ready',transition:null,gatehouseReady:true,farmlandReady:true,townReady:true,castleReady:true,activeCompanion:'keeper',demoEnding:'done',farmlandEnding:'done',townEnding:'done',castleEnding:'done'});
const entitlement=state=>({accountId:'42',farmland:{unlocked:true,eligible:true,unlockedAt:'2026-11-21T00:00:00.000Z'},campaignPass:{state,unlocked:state==='active',unlockedAt:state==='active'?'2026-11-21T00:00:00.000Z':null,checkedAt:'2026-11-21T00:00:01.000Z',storeUrl:'https://store.example.test/products/dune-relay-pass'}});

async function fixture(browser,{region='castle',completed=levels.slice(0,60),pass='active',holdFirst=false}={}){
  const context=await browser.newContext({viewport:{width:1100,height:650},reducedMotion:'reduce'});
  const page=await context.newPage(),writes=[];
  const save=allSave(region,completed);
  let releaseFirst,firstSeen,notifyFirst,checks=0;
  firstSeen=new Promise(resolve=>{notifyFirst=resolve;});
  await page.route('**/leaderboard-api/dune-relay/**',async route=>{
    const request=route.request(),path=new URL(request.url()).pathname;
    if(request.method()!=='GET'&&request.method()!=='HEAD')writes.push(path);
    let body;
    if(path.endsWith('/session'))body={accountId:'42',displayName:'Castle tester',contentVersion:'chapter-6-1'};
    else if(path.endsWith('/campaign'))body={accountId:'42',hasCampaign:true,profile:{revision:20,imported:true,campaign:save}};
    else if(path.endsWith('/entitlements')){checks++;if(checks===1){notifyFirst();if(holdFirst)await new Promise(resolve=>{releaseFirst=resolve;});}body=entitlement(pass);}
    else body={ok:true};
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});
  });
  await page.goto(url);
  await page.getByRole('button',{name:/Enter Castle Island|Enter the town/}).click();
  await page.locator('.awning-wipe').waitFor({state:'detached'});
  return {context,page,writes,save,firstSeen,releaseFirst:()=>releaseFirst?.(),checks:()=>checks};
}
async function tap(page,x,y){const box=await page.locator('canvas').first().boundingBox();assert(box);const scale=box.width/960,top=540-box.height/scale;await page.mouse.click(box.x+x*scale,box.y+(y-top)*scale);}
async function replayFirst(f){
  await tap(f.page,220,335);
  await f.page.locator('.replay-dialog').waitFor({timeout:15000});
  await f.page.getByRole('button',{name:/RECEIVING DOCK · 6\.1/i}).click();
  await f.page.getByRole('dialog',{name:'Replay level'}).waitFor();
  await f.page.getByRole('button',{name:/Replay level/}).click();
  await f.page.locator('canvas[data-play-ready="true"]').waitFor({timeout:30000});
  assert.match(await f.page.locator('.game-canvas').getAttribute('aria-label'),/RECEIVING DOCK puzzle/);
  await f.page.getByRole('button',{name:'Settings'}).click();
  await f.page.getByRole('button',{name:/Return to story/}).click();
  await f.page.locator('.awning-wipe').waitFor({state:'detached'});
}
async function main(){
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE||'/usr/bin/google-chrome',args:['--no-sandbox','--disable-dev-shm-usage']});
  try{
    const cold=await fixture(browser);
    try{
      await replayFirst(cold);
      await cold.page.getByRole('button',{name:'Kingdom Map'}).click();
      await cold.page.getByRole('button',{name:/CASTLE ISLAND/}).click();
      await cold.page.locator('.atlas-screen').waitFor({state:'detached'});
      await cold.page.locator('.awning-wipe').waitFor({state:'detached'});
      await cold.page.locator('.game-canvas[aria-label="Walkable Castle Island"]').waitFor();
      await replayFirst(cold);
      await cold.page.reload();
      await cold.page.getByRole('button',{name:/Enter Castle Island/}).click();
      await cold.page.locator('.awning-wipe').waitFor({state:'detached'});
      await replayFirst(cold);
      assert.equal(await cold.page.locator('.coin-pill').innerText(),'911');
      assert.deepEqual(cold.writes,[],'Castle replay must not write finish, checkpoint, or booster purchase APIs');
      assert.equal(cold.save.coins,911,'fixture campaign coins stay unchanged');
      console.log('Cold all-60 Portal restore, Castle map visit, and repeat read-only replay passed.');
    }finally{await cold.context.close();}

    const delayed=await fixture(browser,{holdFirst:true});
    try{
      await delayed.firstSeen;
      await tap(delayed.page,220,335);
      assert.equal(await delayed.page.locator('.replay-dialog').count(),0,'no replay marker before entitlement arrives');
      delayed.releaseFirst();
      await delayed.page.getByText('Saved to Portal').waitFor();
      await delayed.page.waitForTimeout(300);
      await tap(delayed.page,220,335);
      await delayed.page.locator('.replay-dialog').waitFor({timeout:15000});
      console.log('Delayed entitlement adds Castle replay marker after map mount.');
    }finally{delayed.releaseFirst();await delayed.context.close();}

    const fromTown=await fixture(browser,{region:'town',holdFirst:true});
    try{
      await fromTown.firstSeen;
      await fromTown.page.getByRole('button',{name:'Kingdom Map'}).click();
      await fromTown.page.getByRole('button',{name:/CASTLE ISLAND/}).click();
      await fromTown.page.locator('.atlas-screen').waitFor({state:'detached'});
      await fromTown.page.locator('.awning-wipe').waitFor({state:'detached'});
      await fromTown.page.locator('.game-canvas[aria-label="Walkable Castle Island"]').waitFor();
      await tap(fromTown.page,220,335);
      await fromTown.page.locator('.replay-dialog').waitFor({timeout:15000});
      console.log('First Castle map click verifies previously unknown access and opens replay.');
    }finally{fromTown.releaseFirst();await fromTown.context.close();}

    for(const [name,options] of [['partial',{completed:levels.filter(id=>id!==castle[9])}],['locked',{pass:'locked'}]]){
      const f=await fixture(browser,options);
      try{await f.firstSeen;await f.page.waitForTimeout(250);await tap(f.page,220,335);assert.equal(await f.page.locator('.replay-dialog').count(),0,`${name} campaign must not expose Castle replay`);assert.deepEqual(f.writes,[]);console.log(`${name} Castle replay remains unavailable.`);}finally{await f.context.close();}
    }
  }finally{await browser.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
