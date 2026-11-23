const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const levels=require('../../../services/leaderboards/src/dune-content.json').levels.map(level=>level.id);
const url=process.env.DUNE_TEST_URL||'http://127.0.0.1:3186/dune-relay/';
const campaign={version:5,completed:levels.slice(0,40),coins:500,region:'farmland',companions:['keeper','wayfinder','gatewright','fieldkeeper'],oasisTransition:'ready',transition:null,gatehouseReady:true,farmlandReady:true,townReady:false,castleReady:false,demoEnding:'done',farmlandEnding:'done',townEnding:'locked',castleEnding:'locked'};
const status=state=>({accountId:'42',farmland:{unlocked:true,eligible:true,unlockedAt:'2026-11-21T00:00:00.000Z'},campaignPass:{state,unlocked:state==='active',unlockedAt:state==='active'?'2026-11-21T00:00:00.000Z':null,checkedAt:'2026-11-21T00:00:01.000Z',storeUrl:'https://store.example.test/products/dune-relay-pass'}});

async function scenario(browser,staleResult){
  const context=await browser.newContext({viewport:{width:1100,height:650},reducedMotion:'reduce'});
  const page=await context.newPage(),writes=[];
  let releaseB,releaseC,seenB,seenC,notifyB,notifyC,checks=0;
  seenB=new Promise(resolve=>{notifyB=resolve;});seenC=new Promise(resolve=>{notifyC=resolve;});
  await page.route('**/leaderboard-api/dune-relay/**',async route=>{
    const request=route.request(),path=new URL(request.url()).pathname;
    if(request.method()!=='GET'&&request.method()!=='HEAD')writes.push(path);
    let body;
    if(path.endsWith('/session'))body={accountId:'42',displayName:'Verification tester',contentVersion:'chapter-6-1'};
    else if(path.endsWith('/campaign'))body={accountId:'42',hasCampaign:true,profile:{revision:20,imported:true,campaign}};
    else if(path.endsWith('/entitlements')){
      checks++;
      if(checks===2){notifyB();await new Promise(resolve=>{releaseB=resolve;});if(staleResult==='error')return route.fulfill({status:503,contentType:'application/json',body:'{"message":"Temporary failure"}'});body=status('locked');}
      else if(checks===3){notifyC();await new Promise(resolve=>{releaseC=resolve;});body=status('active');}
      else body=status('active');
    }else body={ok:true};
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});
  });
  try{
    await page.goto(url);
    await page.getByRole('button',{name:/Enter the fields/}).click();
    await page.locator('.awning-wipe').waitFor({state:'detached'});
    await page.getByRole('button',{name:'Kingdom Map'}).click();
    const town=page.getByRole('button',{name:/TOWN ON THE HILL/});
    await town.click();await seenB;
    await town.click();await seenC;
    releaseB();
    await page.waitForTimeout(250);
    assert.deepEqual(writes,[],`stale ${staleResult} verification must not create a transition checkpoint while newer verification is pending`);
    assert.equal(await page.getByText('A NEW ROUTE OPENS').count(),0,`stale ${staleResult} verification must not enter the chapter handoff`);
    console.log(`Cached active pass did not authorize stale ${staleResult} verification.`);
  }finally{releaseB?.();releaseC?.();await context.close();}
}
async function main(){const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE||'/usr/bin/google-chrome',args:['--no-sandbox','--disable-dev-shm-usage']});try{await scenario(browser,'locked');await scenario(browser,'error');}finally{await browser.close();}}
main().catch(error=>{console.error(error);process.exitCode=1;});
