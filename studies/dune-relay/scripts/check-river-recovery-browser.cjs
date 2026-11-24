const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const levels=require('../../../services/leaderboards/src/dune-content.json').levels.map(item=>item.id);
const abilities=require('../../../services/leaderboards/src/dune-companions.json');
const url=process.env.DUNE_TEST_URL||'http://127.0.0.1:3186/';
const snapshot={id:'wayfinder',...abilities.wayfinder};
const campaign={version:5,completed:levels.slice(0,60),coins:910,region:'river',companions:['keeper','wayfinder','gatewright','fieldkeeper','towncrier'],oasisTransition:'ready',transition:null,gatehouseReady:true,farmlandReady:true,townReady:true,castleReady:true,riverReady:true,activeCompanion:'keeper',demoEnding:'done',farmlandEnding:'done',townEnding:'done',castleEnding:'done',riverEnding:'locked'};
const entitlement={accountId:'42',farmland:{unlocked:true,eligible:true,unlockedAt:'2026-11-21T00:00:00.000Z'},campaignPass:{state:'active',unlocked:true,unlockedAt:'2026-11-21T00:00:00.000Z',checkedAt:'2026-11-21T00:00:01.000Z',storeUrl:'https://store.example.test/products/dune-relay-pass'}};
async function tap(page,x,y){const canvas=page.locator('canvas').first();await canvas.waitFor({state:'visible',timeout:30000});const box=await canvas.boundingBox();assert(box);const scale=box.width/960,top=540-box.height/scale;await page.mouse.click(box.x+x*scale,box.y+(y-top)*scale);}
async function caseFor(browser,boosters){
  const context=await browser.newContext({viewport:{width:1180,height:660},reducedMotion:'reduce'});
  const attemptId=boosters.length?'river-paid-recovery':'river-free-recovery';
  const cache={profile:{revision:20,imported:true,campaign},localSave:campaign,pending:[],purchase:{attemptId,levelId:'riverBend',boosters,companionSnapshot:snapshot}};
  await context.addInitScript(value=>{
    localStorage.setItem('dune-relay-last-portal-account-v1','42');
    localStorage.setItem('dune-relay-cloud-42-v1',JSON.stringify(value));
    localStorage.setItem('dune-relay-tutorials-v1:account:42',JSON.stringify({version:1,seen:['current']}));
  },cache);
  const page=await context.newPage(),prepared=[],activated=[],errors=[];
  page.on('pageerror',error=>errors.push(String(error)));
  page.on('crash',()=>errors.push('page crash'));
  const profile={revision:20,imported:true,campaign};
  await page.route('**/leaderboard-api/dune-relay/**',async route=>{
    const request=route.request(),path=new URL(request.url()).pathname;
    let body={ok:true};
    if(path.endsWith('/session'))body={accountId:'42',displayName:'River tester',contentVersion:'chapter-7-3'};
    else if(path.endsWith('/campaign'))body={accountId:'42',hasCampaign:true,profile};
    else if(path.endsWith('/entitlements'))body=entitlement;
    else if(path.endsWith('/attempts')&&request.method()==='POST') { prepared.push(request.postDataJSON());body={profile,companionSnapshot:snapshot}; }
    else if(path.endsWith(`/attempts/${attemptId}/activate`)) { activated.push(request.postDataJSON());body={profile:{...profile,revision:21,campaign:{...campaign,coins:campaign.coins-(boosters.length?300:0)}},status:'active',companionSnapshot:snapshot}; }
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});
  });
  try{
    await page.goto(url);
    await page.getByRole('button',{name:/Board the river boat/}).click();
    await page.locator('.awning-wipe').waitFor({state:'detached',timeout:30000});
    await tap(page,555,400);
    await page.getByRole('button',{name:/Take the helm/}).click();
    await page.locator('.booster-shop').waitFor({timeout:15000});
    const selected=await page.getByRole('button',{name:/Water Jet/}).getAttribute('aria-pressed');
    assert.equal(selected,boosters.length?'true':'false','recovered booster choice survives reload');
    assert.equal(await page.locator('.shop-total').innerText(),`Total: ${boosters.length?300:0} coins`,'recovered loadout retains its cost');
    await page.getByRole('button',{name:boosters.length?/Retry purchase/:/^Start level/}).click();
    await page.locator('.game-canvas[aria-label="RIVER BEND puzzle"]').waitFor({timeout:30000});
    try { await page.locator('canvas[data-play-ready="true"]').waitFor({timeout:30000}); }
    catch(error) {
      const state=await page.evaluate(()=>({canvas:[...document.querySelectorAll('canvas')].map(node=>({...node.dataset})),frame:document.querySelector('.frame')?.getAttribute('data-overlay'),issue:document.querySelector('.scene-issue')?.textContent,shop:document.querySelector('.booster-shop')?.textContent}));
      console.error('River recovery scene state', {boosters,prepared,activated,errors,state});
      await page.screenshot({path:`/tmp/dune-river-recovery-${boosters.length?'paid':'free'}.png`});
      throw error;
    }
    assert.equal(prepared.length,1);
    assert.equal(prepared[0].attemptId,attemptId,'retry keeps server attempt ID');
    assert.equal(prepared[0].companionId,'wayfinder','retry uses frozen companion even if current leader differs');
    assert.deepEqual(prepared[0].boosters,boosters);
    assert.equal(activated.length,1);
    const cached=await page.evaluate(()=>JSON.parse(localStorage.getItem('dune-relay-cloud-42-v1')));
    assert.equal(cached.purchase.companionSnapshot.id,'wayfinder');
    assert.deepEqual(cached.purchase.boosters,boosters);
  }finally{await context.close();}
}
async function main(){
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE||'/usr/bin/google-chrome',args:['--no-sandbox','--disable-dev-shm-usage']});
  try{if(process.env.RIVER_PAID_ONLY!=='1')await caseFor(browser,[]);await caseFor(browser,['jet']);console.log('River free and bought attempt recovery retained booster cost and frozen companion.');}
  finally{await browser.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
