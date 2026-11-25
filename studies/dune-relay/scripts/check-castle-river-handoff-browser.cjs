const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const fs=require('node:fs'),ts=require('typescript'),Module=require('node:module');
Module._extensions['.ts']=(module,file)=>module._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true,resolveJsonModule:true}}).outputText,file);
const {createPuzzle,legalMove}=require('../src/game/core.ts');
const {LEVELS}=require('../src/game/levels.ts');
const levels=require('../../../services/leaderboards/src/dune-content.json').levels.map(level=>level.id);
const abilities=require('../../../services/leaderboards/src/dune-companions.json');
const url=process.env.DUNE_TEST_URL||'http://127.0.0.1:3102/dune-relay/';

const base={version:5,completed:levels.slice(0,60),coins:3577,region:'castle',companions:['keeper','wayfinder','gatewright','fieldkeeper','towncrier'],oasisTransition:'ready',transition:null,gatehouseReady:true,farmlandReady:true,townReady:true,castleReady:true,riverReady:false,activeCompanion:'keeper',demoEnding:'done',farmlandEnding:'done',townEnding:'done',castleEnding:'thanks',riverEnding:'locked'};
const handoff={...base,castleEnding:'done',transition:{from:'castle',to:'river',stage:'handoff'}};
const atlas={...handoff,transition:{...handoff.transition,stage:'atlas'}};
const arrival={...atlas,region:'river',transition:{...handoff.transition,stage:'arrival'}};
const ready={...arrival,riverReady:true,transition:null};
const inventory={jet:1,flywheel:2,prism:1,tileBomb:1,freeSwap:1};
const ids=['10000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000004'];
const pending=[handoff,atlas,arrival,ready].map((campaign,index)=>({kind:'checkpoint',requestId:ids[index],campaign,campaignGeneration:2}));
const initial={revision:219,campaignGeneration:2,imported:true,campaign:base,inventory,rewardClaims:{fieldToolkitV1:"2026-11-21T00:00:00.000Z"},dailyVisit:null};
const pass={accountId:'42',farmland:{unlocked:true,eligible:true,unlockedAt:'2026-11-21T00:00:00.000Z'},campaignPass:{state:'active',unlocked:true,unlockedAt:'2026-11-21T00:00:00.000Z',checkedAt:'2026-11-21T00:00:00.000Z',storeUrl:'https://store.example.test/products/dune-relay-pass'}};
async function tapRiverPilot(page){await page.locator('.awning-wipe').waitFor({state:'detached',timeout:30000});const canvas=page.locator('canvas').first();await canvas.waitFor({state:'visible'});const box=await canvas.boundingBox();assert(box);const scale=box.width/960,top=540-box.height/scale;await page.mouse.click(box.x+555*scale,box.y+(400-top)*scale);}
async function tapTile(page,tile){const box=await page.locator('canvas').first().boundingBox();assert(box);const scale=box.width/960,top=540-box.height/scale;await page.mouse.click(box.x+(355+tile.col*50)*scale,box.y+(70+tile.row*50-top)*scale);}

async function main(){
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE||'/usr/bin/google-chrome',args:['--no-sandbox','--disable-dev-shm-usage']});
  const context=await browser.newContext({viewport:{width:1180,height:660},reducedMotion:'reduce'});
  try{
    await context.addInitScript(cache=>{
      localStorage.setItem('dune-relay-last-portal-account-v1','42');
      localStorage.setItem('dune-relay-cloud-42-v1',JSON.stringify(cache));
    },{profile:initial,localSave:ready,pending});
    const page=await context.newPage();
    const calls=[];let profile=initial,refuseOnce=true;
    const pageErrors=[];page.on('pageerror',error=>pageErrors.push(String(error)));
    await page.route('**/leaderboard-api/dune-relay/**',async route=>{
      const request=route.request(),path=new URL(request.url()).pathname;
      let body={ok:true},status=200;
      if(path.endsWith('/session'))body={accountId:'42',displayName:'Checkpoint tester',contentVersion:'chapter-7-6'};
      else if(path.endsWith('/campaign'))body={accountId:'42',hasCampaign:true,profile};
      else if(path.endsWith('/entitlements'))body=pass;
      else if(path.endsWith('/campaign/checkpoint')){
        const operation=request.postDataJSON();calls.push(operation);
        if(refuseOnce){refuseOnce=false;status=400;body={message:'Finish Castle before travelling to the River.'};}
        else{assert.equal(operation.expectedRevision,profile.revision);profile={...profile,revision:profile.revision+1,campaign:operation.campaign};body={profile};}
      }
      else if(path.endsWith('/attempts')&&request.method()==='POST')body={profile,companionSnapshot:{id:'keeper',...abilities.keeper},boosterFunding:{owned:[],purchased:[],coinCost:0}};
      else if(/\/attempts\/[^/]+\/activate$/.test(path)){profile={...profile,revision:profile.revision+1};body={profile,status:'active',companionSnapshot:{id:'keeper',...abilities.keeper}};}
      await route.fulfill({status,contentType:'application/json',body:JSON.stringify(body)});
    });
    await page.goto(url);
    await page.getByRole('button',{name:/^(Enter |Board the river boat|Continue the journey)/}).click();
    await page.getByRole('button',{name:'Settings',exact:true}).click();
    const retry=page.getByRole('button',{name:'Retry sync',exact:true});
    await retry.waitFor({timeout:30000});await retry.click();
    await page.waitForFunction(()=>{
      const cache=JSON.parse(localStorage.getItem('dune-relay-cloud-42-v1')||'null');
      return cache?.pending?.length===0&&cache?.profile?.campaign?.riverReady===true;
    },null,{timeout:30000});
    const cache=await page.evaluate(()=>JSON.parse(localStorage.getItem('dune-relay-cloud-42-v1')));
    assert.deepEqual(calls.map(call=>call.requestId),[ids[0],...ids]);
    assert.equal(cache.profile.revision,223);
    assert.equal(cache.profile.campaignGeneration,2);
    assert.equal(cache.profile.campaign.coins,3577);
    assert.deepEqual(cache.profile.campaign.completed,levels.slice(0,60));
    assert.deepEqual(cache.profile.inventory,inventory);
    assert.equal(cache.profile.campaign.region,'river');
    assert.deepEqual(pageErrors,[]);
    await page.getByRole('button',{name:'Close',exact:true}).click();
    await tapRiverPilot(page);
    await page.getByRole('button',{name:/Take the helm/}).click();
    await page.locator('.booster-shop').waitFor({timeout:30000});
    await page.getByRole('button',{name:/^Start level/}).click();
    const skip=page.getByRole('button',{name:'Skip lesson',exact:true});
    if(await skip.isVisible().catch(()=>false))await skip.click();
    await page.locator('canvas[data-play-ready="true"]').waitFor({timeout:30000});
    assert.equal(await page.locator('.level-pill').innerText(),'7.1');
    console.log('Castle → River rejected checkpoint retried with original IDs and drained; level 7.1 started.');
  }finally{await context.close();}

  // A temporary entitlement failure must not tell the player their pass is gone.
  const accessContext=await browser.newContext({viewport:{width:844,height:390},reducedMotion:'reduce'});
  try{
    const accessProfile={...initial,revision:223,campaign:ready};
    await accessContext.addInitScript(cache=>{localStorage.setItem('dune-relay-last-portal-account-v1','42');localStorage.setItem('dune-relay-cloud-42-v1',JSON.stringify(cache));},{profile:accessProfile,localSave:ready,pending:[]});
    const page=await accessContext.newPage();
    await page.route('**/leaderboard-api/dune-relay/**',async route=>{
      const path=new URL(route.request().url()).pathname;
      let status=200,body={ok:true};
      if(path.endsWith('/session'))body={accountId:'42',displayName:'Access tester',contentVersion:'chapter-7-6'};
      else if(path.endsWith('/campaign'))body={accountId:'42',hasCampaign:true,profile:accessProfile};
      else if(path.endsWith('/entitlements')){status=429;body={message:'Access check is rate limited. Try again shortly.'};}
      await route.fulfill({status,contentType:'application/json',body:JSON.stringify(body)});
    });
    await page.goto(url);
    await page.getByRole('button',{name:/^(Enter |Board the river boat|Continue the journey)/}).click();
    await tapRiverPilot(page);
    await page.getByRole('button',{name:/Take the helm/}).click();
    await page.locator('.booster-shop').waitFor({timeout:30000});
    await page.getByRole('button',{name:/^Start level/}).click();
    const accessSkip=page.getByRole('button',{name:'Skip lesson',exact:true});if(await accessSkip.isVisible().catch(()=>false))await accessSkip.click();
    await page.getByText(/Dune Pass access could not be checked/, {exact:false}).waitFor();
    assert.equal(await page.getByText(/Sign in and activate the Dune Pass/).count(),0);
    await page.getByRole('button',{name:'Back',exact:true}).click();
    await page.locator('.booster-shop').waitFor({state:'detached'});await page.locator('.awning-wipe').waitFor({state:'detached'});
    assert.equal(await page.locator('.booster-shop').count(),0);
    assert.equal(await page.locator('.dialog-card').count(),0,'Back leaves the booster screen for the walkable river');
    console.log('Mobile unavailable-pass message and booster Back exit passed.');
  }finally{await accessContext.close();}

  for(const [label,viewport] of [['mobile',{width:844,height:390}],['desktop',{width:1180,height:660}]]){
    const mapContext=await browser.newContext({viewport,reducedMotion:'reduce'});
    try{
      let profile={...initial,revision:221,campaign:atlas};const mapCalls=[];
      await mapContext.addInitScript(cache=>{localStorage.setItem('dune-relay-last-portal-account-v1','42');localStorage.setItem('dune-relay-cloud-42-v1',JSON.stringify(cache));},{profile,localSave:atlas,pending:[]});
      const page=await mapContext.newPage();
      await page.route('**/leaderboard-api/dune-relay/**',async route=>{
        const path=new URL(route.request().url()).pathname;let body={ok:true};
        if(path.endsWith('/session'))body={accountId:'42',displayName:'Map tester',contentVersion:'chapter-7-6'};
        else if(path.endsWith('/campaign'))body={accountId:'42',hasCampaign:true,profile};
        else if(path.endsWith('/entitlements'))body=pass;
        else if(path.endsWith('/campaign/checkpoint')){const operation=route.request().postDataJSON();mapCalls.push(operation);profile={...profile,revision:profile.revision+1,campaign:operation.campaign};body={profile};}
        await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});
      });
      await page.goto(url);await page.getByRole('button',{name:/^(Enter |Board the river boat|Continue the journey)/}).click();
      await page.locator('.atlas-river').waitFor({timeout:30000});
      await page.locator('.awning-wipe').waitFor({state:'detached'});await page.screenshot({path:`/tmp/dune-kingdom-river-${label}.png`});
      await page.locator('.atlas-river').click();
      await page.waitForFunction(()=>JSON.parse(localStorage.getItem('dune-relay-cloud-42-v1')||'null')?.localSave?.transition?.stage==='arrival',null,{timeout:30000});
      assert.equal(mapCalls.length,1,`${label}: map destination goes directly to arrival`);
      assert.equal(mapCalls[0].campaign.transition.stage,'arrival');
      await page.locator('.atlas-screen').waitFor({state:'detached',timeout:30000});
      console.log(`${label}: River map node traveled to the arrival scene in one tap.`);
    }finally{await mapContext.close();}
  }

  const jitContext=await browser.newContext({viewport:{width:844,height:390},reducedMotion:'no-preference'});
  try{
    const page=await jitContext.newPage();
    await page.route('**/leaderboard-api/dune-relay/**',route=>route.fulfill({status:401,contentType:'application/json',body:'{}'}));
    await page.goto(process.env.DUNE_SANDBOX_URL||'http://127.0.0.1:3101/dune-relay/?playtest=1');
    await page.getByRole('button',{name:/Enter the oasis/}).click();
    await page.getByRole('button',{name:'Settings',exact:true}).click();
    await page.getByRole('button',{name:/Replay 4\.1 ·/}).click();
    await page.getByRole('button',{name:/^Start level/}).click();
    const skip=page.getByRole('button',{name:'Skip lesson',exact:true});if(await skip.isVisible().catch(()=>false))await skip.click();
    await page.locator('canvas[data-play-ready="true"]').waitFor({timeout:30000});
    const move=legalMove(createPuzzle(LEVELS.seedStore).board);assert(move,'seed store has a valid opening move');
    await page.evaluate(()=>{
      const bar=document.querySelector('.jit-tools');if(!bar)throw Error('JIT tools missing at level start');
      window.__jitWatch={removed:false,sawDisabled:false};
      const observer=new MutationObserver(()=>{
        if(!bar.isConnected)window.__jitWatch.removed=true;
        if([...bar.querySelectorAll('button.jit-tool')].every(button=>button.disabled))window.__jitWatch.sawDisabled=true;
      });observer.observe(document.querySelector('.frame'),{subtree:true,childList:true,attributes:true,attributeFilter:['disabled']});
    });
    await tapTile(page,move[0]);await tapTile(page,move[1]);
    await page.locator(`[data-moves="${LEVELS.seedStore.moves-1}"]`).waitFor({timeout:30000});
    await page.waitForFunction(()=>[...document.querySelectorAll('.jit-tool')].every(button=>!button.disabled),null,{timeout:30000});
    const watch=await page.evaluate(()=>window.__jitWatch);
    assert.equal(watch.removed,false,'JIT tools remain mounted through the cascade');
    assert.equal(watch.sawDisabled,true,'JIT tools disable while the board settles');
    assert.equal(await page.locator('.jit-tool').count(),2);
    console.log('Mobile JIT tools stayed mounted, disabled during the turn, and re-enabled after refill.');
  }finally{await jitContext.close();await browser.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
