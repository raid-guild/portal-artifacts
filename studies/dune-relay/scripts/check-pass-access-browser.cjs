const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const levels = require('../../../services/leaderboards/src/dune-content.json').levels.map(level => level.id);
const url = process.env.DUNE_TEST_URL || 'http://127.0.0.1:3103/dune-relay/';
const campaign = { version:5,completed:levels.slice(0,40),coins:500,region:'farmland',companions:['keeper','wayfinder','gatewright','fieldkeeper'],oasisTransition:'ready',transition:null,gatehouseReady:true,farmlandReady:true,townReady:false,castleReady:false,demoEnding:'done',farmlandEnding:'done',townEnding:'locked',castleEnding:'locked' };
const status = state => ({ accountId:'42',farmland:{unlocked:true,eligible:true,unlockedAt:'2026-11-21T00:00:00.000Z'},campaignPass:{state,unlocked:state==='active',unlockedAt:state==='active'?'2026-11-21T00:00:00.000Z':null,checkedAt:'2026-11-21T00:00:01.000Z',storeUrl:'https://store.example.test/products/dune-relay-pass'} });

async function main() {
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE||'/usr/bin/google-chrome',args:['--no-sandbox','--disable-dev-shm-usage']});
  const context=await browser.newContext({viewport:{width:1100,height:650},reducedMotion:'reduce'});
  let releaseFirst,releaseThird,firstSeen,firstRequest,thirdSeen,thirdRequest;
  firstSeen=new Promise(resolve=>{firstRequest=resolve;});
  thirdSeen=new Promise(resolve=>{thirdRequest=resolve;});
  await context.addInitScript(value=>localStorage.setItem('dune-relay-campaign-v5',JSON.stringify(value)),campaign);
  const page=await context.newPage();
  let checks=0;
  await page.route('**/leaderboard-api/dune-relay/**',async route=>{
    const path=new URL(route.request().url()).pathname;
    let body;
    if(path.endsWith('/session')) body={accountId:'42',displayName:'Pass tester',contentVersion:'chapter-4-2'};
    else if(path.endsWith('/campaign')) body={accountId:'42',hasCampaign:true,profile:{revision:20,imported:true,campaign}};
    else if(path.endsWith('/entitlements')) {
      checks++;
      if(checks===1) { firstRequest(); await new Promise(resolve=>{releaseFirst=resolve;}); body=status('locked'); }
      else if(checks===3) { thirdRequest();await new Promise(resolve=>{releaseThird=resolve;});body=status('active'); }
      else body=status('active');
    } else body={ok:true};
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});
  });
  try {
    await page.goto(url);
    await firstSeen;
    await page.getByRole('button',{name:/Enter the fields|Continue the journey/}).click();
    await page.locator('.awning-wipe').waitFor({state:'detached'});
    await page.getByRole('button',{name:'Kingdom Map'}).click();
    await page.getByRole('button',{name:/TOWN ON THE HILL/}).click();
    await page.getByRole('button',{name:/Travel to Town on the Hill/}).waitFor();
    releaseFirst();
    await page.waitForTimeout(200);
    assert.equal(await page.getByRole('button',{name:/Travel to Town on the Hill/}).count(),1,'older ordinary entitlement response cannot replace newer pass result');
    assert.equal(await page.getByRole('link',{name:/Open the Dune Pass store/}).count(),0,'older locked result did not replace active access');
    await page.getByRole('button',{name:/Travel to Town on the Hill/}).click();
    await thirdSeen;
    await page.getByRole('button',{name:'Back to the kingdom map'}).click();
    await page.getByRole('button',{name:'Return to the path'}).click();
    await page.getByRole('button',{name:'Settings'}).click();
    await page.evaluate(value=>localStorage.setItem('dune-relay-campaign-v5',JSON.stringify(value)),campaign);
    await page.getByRole('button',{name:'Sign out of Portal'}).click();
    releaseThird();
    await page.getByRole('button',{name:/Enter the fields|Continue the journey/}).click();
    await page.locator('.awning-wipe').waitFor({state:'detached'});
    await page.getByRole('button',{name:'Kingdom Map'}).click();
    assert.match(await page.getByRole('button',{name:/TOWN ON THE HILL/}).innerText(),/🔒/,'late account response cannot unlock the guest map badge');
    console.log('Pass status keeps the latest account result when a slower Farmland read resolves afterward.');
    console.log('A late pass response cannot restore the signed-out account badge.');
  } finally { releaseFirst?.();releaseThird?.();await context.close();await browser.close(); }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
