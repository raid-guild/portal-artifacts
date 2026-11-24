const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const levels=require('../../../services/leaderboards/src/dune-content.json').levels.map(level=>level.id);
const url=process.env.DUNE_TEST_URL||'http://127.0.0.1:3186/';
const base={version:5,coins:910,companions:['keeper','wayfinder','gatewright','fieldkeeper','towncrier'],oasisTransition:'ready',transition:null,gatehouseReady:true,farmlandReady:true,townReady:true,castleReady:true,activeCompanion:'keeper',demoEnding:'done',farmlandEnding:'done',townEnding:'done',castleEnding:'done'};
const entitlements={accountId:'42',farmland:{unlocked:true,eligible:true,unlockedAt:'2026-11-21T00:00:00.000Z'},campaignPass:{state:'active',unlocked:true,unlockedAt:'2026-11-21T00:00:00.000Z',checkedAt:'2026-11-21T00:00:01.000Z',storeUrl:'https://store.example.test/products/dune-relay-pass'}};
async function fixture(browser,save){
  const context=await browser.newContext({viewport:{width:1180,height:660},reducedMotion:'reduce'});
  const page=await context.newPage(),writes=[];
  await page.route('**/leaderboard-api/dune-relay/**',route=>{
    const request=route.request(),path=new URL(request.url()).pathname;
    if(request.method()!=='GET'&&request.method()!=='HEAD')writes.push(path);
    const body=path.endsWith('/session')?{accountId:'42',displayName:'River tester',contentVersion:'chapter-7-3'}:path.endsWith('/campaign')?{accountId:'42',hasCampaign:true,profile:{revision:20,imported:true,campaign:save}}:path.endsWith('/entitlements')?entitlements:{ok:true};
    return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});
  });
  await page.goto(url);
  return {context,page,writes};
}
async function tap(page,x,y){const canvas=page.locator('canvas').first();await canvas.waitFor({state:'visible',timeout:30000});const box=await canvas.boundingBox();assert(box);const scale=box.width/960,top=540-box.height/scale;await page.mouse.click(box.x+x*scale,box.y+(y-top)*scale);}
async function main(){
  assert.equal(levels.length,70);
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE||'/usr/bin/google-chrome',args:['--no-sandbox','--disable-dev-shm-usage']});
  try{
    const legacy=await fixture(browser,{...base,completed:levels.slice(0,60),region:'castle'});
    try{
      const {page}=legacy;
      await page.getByRole('button',{name:/Enter Castle Island/}).click();
      await page.getByRole('button',{name:'Kingdom Map'}).click();
      await page.getByRole('button',{name:/RIVER JOURNEY/}).click();
      await page.locator('.awning-wipe').waitFor({state:'detached',timeout:30000});
      await page.locator('.game-canvas[aria-label="Walkable river boat"]').waitFor({timeout:30000});
      await tap(page,555,400);
      await page.getByText('SKIFF · RIVER PILOT').waitFor();
      console.log('Legacy Castle completion boards River and meets Skiff without replay.');
    }finally{await legacy.context.close();}
    const tutorialContext=await browser.newContext({viewport:{width:1180,height:660},reducedMotion:'reduce'});
    try{
      const page=await tutorialContext.newPage();
      await page.route('**/leaderboard-api/dune-relay/**',route=>route.fulfill({status:401,contentType:'application/json',body:'{}'}));
      await page.goto(new URL('?playtest=1',url).href);
      await page.getByRole('button',{name:/Enter the oasis/}).click();
      await page.getByRole('button',{name:'Settings'}).click();
      await page.getByRole('button',{name:/Preview Castle → River story/}).click();
      await page.getByRole('button',{name:/Open the kingdom map/}).click();
      await page.getByRole('button',{name:/Board the river boat/}).click();
      await page.locator('.awning-wipe').waitFor({state:'detached',timeout:30000});
      await tap(page,555,400);
      await page.getByRole('button',{name:/Take the helm/}).click();
      await page.getByRole('button',{name:/Start level/}).click();
      await page.getByRole('dialog',{name:'River Current lesson'}).waitFor({timeout:30000});
      await page.getByRole('button',{name:'Skip lesson'}).click();
      await page.locator('.game-canvas[aria-label="RIVER BEND puzzle"]').waitFor({timeout:30000});
      console.log('River Bend playtest tutorial opens before the first board.');
    }finally{await tutorialContext.close();}
    const complete=await fixture(browser,{...base,completed:levels,region:'river',riverReady:true,riverEnding:'done'});
    try{
      const {page}=complete;
      await page.getByRole('button',{name:/Board the river boat/}).click();
      await page.locator('.game-canvas[aria-label="Walkable river boat"]').waitFor({timeout:30000});
      await page.getByRole('button',{name:'Raid Party'}).click();
      await page.getByText('Skiff · NPC').waitFor();
      assert.equal(await page.locator('.party-member.npc').filter({hasText:'Skiff'}).getByRole('button',{name:/Make active/}).count(),0);
      await page.getByRole('button',{name:/Close|Back/}).last().click();
      await page.getByRole('button',{name:'Kingdom Map'}).click();
      await page.getByText('WATER COLLECTION STATION').waitFor();
      await page.getByText('Coming soon',{exact:true}).waitFor();
      assert.deepEqual(complete.writes,[],'read-only return and map visit do not write rewards');
      console.log('Completed River shows Skiff as NPC and the Water Collection Station teaser.');
    }finally{await complete.context.close();}
  }finally{await browser.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
