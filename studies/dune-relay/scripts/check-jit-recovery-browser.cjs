const assert=require('node:assert/strict');
const fs=require('node:fs');
const Module=require('node:module');
const ts=require('typescript');
const {chromium}=require('playwright');
Module._extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText,filename);
const {createPuzzle,resolveAction,playTurn,BOARD_SIZE}=require('../src/game/core.ts');
const {LEVELS,LEVEL_ORDER}=require('../src/game/levels.ts');
const {EMPTY_SAVE,normalizeSave}=require('../src/game/save.ts');
const {contentVersion}=require('../src/game/cloud.ts');
const url=process.env.DUNE_TEST_URL||'http://127.0.0.1:3101/dune-relay/';
const clone=value=>JSON.parse(JSON.stringify(value));
const attemptId='123e4567-e89b-42d3-a456-426614174001';
const cacheKey='dune-relay-cloud-42-v1';
const campaign=normalizeSave({...EMPTY_SAVE,completed:LEVEL_ORDER.slice(0,30),coins:1800,region:'farmland',companions:['keeper','wayfinder','gatewright','fieldkeeper'],oasisTransition:'ready',transition:null,gatehouseReady:true,farmlandReady:true,demoEnding:'done'});
const initial=createPuzzle(LEVELS.seedStore),action={kind:'tileBomb',target:{row:4,col:4}};
const first=resolveAction(initial,action).state;
const second=resolveAction(first,action).state;
const profile=(revision=6,count=1)=>({revision,campaign:clone(campaign),imported:true,inventory:{tileBomb:count,freeSwap:1,jet:0,flywheel:0,prism:0},rewardClaims:{fieldToolkitV1:'2026-11-24T00:00:00Z'}});
const journal=(phase='applied')=>({accountId:'42',attemptId,levelId:'seedStore',requestId:'123e4567-e89b-42d3-a456-426614174002',expectedRevision:5,toolSequence:1,kind:'tileBomb',action,stateFingerprint:'a'.repeat(64),movesRemaining:initial.moves,contentVersion,before:clone(initial),after:clone(first),phase});
const entitlement={accountId:'42',farmland:{unlocked:true,eligible:true,unlockedAt:'2026-11-24T00:00:00Z'},campaignPass:{state:'active',unlocked:true,unlockedAt:'2026-11-24T00:00:00Z',checkedAt:'2026-11-24T00:00:00Z',storeUrl:null}};
async function seed(context,cache){await context.addInitScript(({cache,cacheKey})=>{if(localStorage.getItem('jit-recovery-seeded'))return;localStorage.setItem('jit-recovery-seeded','1');localStorage.setItem('dune-relay-last-portal-account-v1','42');localStorage.setItem(cacheKey,JSON.stringify(cache));localStorage.setItem('dune-relay:tool-lesson:v1:dune-relay-tutorials-v1:account:42:tileBomb','seen');},{cache,cacheKey});}
async function stored(page){return page.evaluate(key=>JSON.parse(localStorage.getItem(key)),cacheKey);}
async function tap(page,cell){const b=await page.locator('canvas').boundingBox();assert(b);const scale=b.width/960,top=540-b.height/scale;await page.mouse.click(b.x+(355+cell.col*50)*scale,b.y+(70+cell.row*50-top)*scale);}
async function ready(page){await page.locator('canvas[data-play-ready="true"]').waitFor({timeout:30000});}
async function routeCloud(page,handler,current){await page.route('**/leaderboard-api/dune-relay/**',async route=>{const request=route.request(),path=new URL(request.url()).pathname.split('/dune-relay')[1];if(await handler(route,path))return;const body=path==='/session'?{accountId:'42',displayName:'Tester',contentVersion}:path==='/campaign'?{accountId:'42',hasCampaign:true,profile:current()}:path.startsWith('/entitlements')?entitlement:path==='/logout'?{ok:true}:{profile:current()};await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});});}
async function uncertainUse(browser,commitBeforeAbort,advanceOnRetry=false){
 const context=await browser.newContext({viewport:{width:844,height:390},reducedMotion:'reduce'});await seed(context,{profile:profile(),localSave:campaign,pending:[],toolJournal:journal()});const page=await context.newPage();let server=profile(),calls=0,debits=0,operationId;
 await routeCloud(page,async(route,path)=>{if(!path.endsWith('/tools'))return false;calls++;const body=route.request().postDataJSON();if(calls===1){operationId=body.requestId;if(commitBeforeAbort){server=profile(7,0);debits++;}await route.abort();}else{assert.equal(body.requestId,operationId,'retry keeps the exact operation ID');if(!debits){server=profile(7,0);debits++;}const receipt=server;if(advanceOnRetry)server={...profile(8,0),campaign:normalizeSave({...campaign,completed:LEVEL_ORDER.slice(0,31)})};await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({profile:receipt,toolSequence:2})});}return true;},()=>server);
 await page.goto(url);await ready(page);await page.getByRole('button',{name:'Tile Bomb, 1 owned',exact:true}).click();await tap(page,action.target);await page.getByRole('button',{name:'Retry pending tool action',exact:true}).waitFor({timeout:15000});const pending=await stored(page);assert.equal(pending.toolJournal.phase,'pending');assert.deepEqual(pending.toolJournal.before,clone(first));
 const cancel=page.getByRole('button',{name:'Cancel',exact:true});assert.ok(!(await cancel.count())||await cancel.isDisabled(),'pending tool cannot be cancelled into ordinary input');
 let move;for(let row=0;row<BOARD_SIZE&&!move;row++)for(let col=0;col<BOARD_SIZE-1&&!move;col++){const from={row,col},to={row,col:col+1};if(playTurn(first,from,to).valid)move={from,to};}assert(move);await tap(page,move.from);await tap(page,move.to);
 assert.equal((await stored(page)).toolJournal.phase,'pending','ordinary input cannot rewrite an uncertain tool as applied');assert.deepEqual((await stored(page)).toolJournal.before,clone(first));assert.equal(calls,1);
 await page.getByRole('button',{name:'Retry pending tool action',exact:true}).click();if(advanceOnRetry){await page.locator('.frame[data-mode="map"]').waitFor({timeout:15000});const refreshed=await stored(page);assert(refreshed.localSave.completed.includes('seedStore'));assert.equal(refreshed.profile.revision,8,'old receipt cannot overwrite fresh cross-device progress');assert(!refreshed.toolJournal);await context.close();return;}await page.getByRole('button',{name:'Tile Bomb, 0 owned',exact:true}).waitFor({timeout:15000});await ready(page);const applied=await stored(page);assert.notEqual(applied.toolJournal.phase,'pending');assert.deepEqual(applied.toolJournal.after,clone(second));assert.equal(debits,1);
 await page.reload();await ready(page);await page.getByRole('button',{name:'Tile Bomb, 0 owned',exact:true}).waitFor();assert.equal(calls,2,'reload does not spend confirmed tool again');assert.deepEqual((await stored(page)).toolJournal.after,clone(second));await context.close();
}
async function rejectedCached(browser,kind,advanced=false){
 const context=await browser.newContext({viewport:{width:844,height:390},reducedMotion:'reduce'});const cache={profile:profile(5,2),localSave:campaign,pending:[],...(kind==='consume'?{toolJournal:journal('pending')}:{purchaseTool:{requestId:'123e4567-e89b-42d3-a456-426614174003',kind:'tileBomb',accountId:'42',attemptId,expectedRevision:5}})};await seed(context,cache);const page=await context.newPage();let calls=0,server=profile(6,2);
 await routeCloud(page,async(route,path)=>{if((kind==='consume'&&path.endsWith('/tools'))||(kind==='purchase'&&path==='/inventory/purchase')){calls++;if(advanced)server={...profile(7,2),campaign:normalizeSave({...campaign,completed:LEVEL_ORDER.slice(0,31)})};await route.fulfill({status:409,contentType:'application/json',body:JSON.stringify({message:'Campaign changed. Reload your save.'})});return true;}return false;},()=>server);
 await page.goto(url);await page.waitForFunction(({cacheKey,field})=>{const value=JSON.parse(localStorage.getItem(cacheKey)||'null');return value&&!value[field];},{cacheKey,field:kind==='consume'?'toolJournal':'purchaseTool'},{timeout:15000});assert.equal(calls,1);if(advanced){await page.waitForFunction(key=>JSON.parse(localStorage.getItem(key)||'null')?.localSave.completed.includes('seedStore'),cacheKey,{timeout:15000});await page.locator('.frame[data-mode="map"]').waitFor();}await page.reload();await page.waitForFunction(()=>document.querySelector('.cloud-pill')?.textContent.includes('Saved to Portal'));assert.equal(calls,1,'definitively rejected request is not replayed on reload');
 const enter=page.getByRole('button',{name:/^Enter /});if(await enter.isVisible().catch(()=>false))await enter.click();await page.getByRole('button',{name:'Settings',exact:true}).click();const logout=page.getByRole('button',{name:'Sign out of Portal',exact:true});assert.equal(await logout.isEnabled(),true);await logout.click();await page.getByText('Saved on this device',{exact:true}).waitFor();await context.close();
}
async function cachedReceiptRace(browser,kind){
 const context=await browser.newContext({viewport:{width:844,height:390},reducedMotion:'reduce'});
 const cache={profile:profile(5,2),localSave:campaign,pending:[],...(kind==='consume'?{toolJournal:journal('pending')}:{purchaseTool:{requestId:'123e4567-e89b-42d3-a456-426614174003',kind:'tileBomb',accountId:'42',attemptId,expectedRevision:5}})};
 await seed(context,cache);const page=await context.newPage();let server=profile(6,2),calls=0;
 await routeCloud(page,async(route,path)=>{if((kind==='consume'&&path.endsWith('/tools'))||(kind==='purchase'&&path==='/inventory/purchase')){calls++;const receipt=profile(7,kind==='consume'?1:3);server={...profile(8,0),campaign:normalizeSave({...campaign,completed:LEVEL_ORDER.slice(0,31),coins:800})};await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({profile:receipt,toolSequence:1,kind:'tileBomb'})});return true;}return false;},()=>server);
 await page.goto(url);await page.waitForFunction(key=>{const c=JSON.parse(localStorage.getItem(key)||'null');return c?.profile.revision===8&&c.localSave.completed.includes('seedStore');},cacheKey,{timeout:15000});const saved=await stored(page);assert.equal(saved.profile.inventory.tileBomb,0);assert.equal(saved.localSave.coins,800);assert(!saved.toolJournal);assert(!saved.purchaseTool);assert.equal(calls,1);
 assert.equal(await page.locator('.frame[data-mode="puzzle"]').count(),0,'stale receipt cannot restore old level');await page.reload();await page.waitForFunction(()=>document.querySelector('.cloud-pill')?.textContent.includes('Saved to Portal'));assert.equal(calls,1);await context.close();
}
async function previousContentToolRecovery(browser,phase,version){
 const context=await browser.newContext({viewport:{width:844,height:390},reducedMotion:'reduce'});
 const oldJournal={...journal(phase),contentVersion:version};
 let server=profile(phase==='pending'?5:6,phase==='pending'?1:0),calls=0;
 await seed(context,{profile:server,localSave:campaign,pending:[],toolJournal:oldJournal});
 const page=await context.newPage();
 await routeCloud(page,async(route,path)=>{
  if(!path.endsWith('/tools'))return false;
  calls++;
  assert.equal(phase,'pending','already confirmed tools are never charged again');
  assert.equal(route.request().postDataJSON().requestId,oldJournal.requestId,'old pending tool keeps its request ID');
  server=profile(6,0);
  await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({profile:server,toolSequence:2})});
  return true;
 },()=>server);
 await page.goto(url);await ready(page);
 await page.locator('.frame[data-mode="puzzle"]').waitFor({timeout:15000});
 await page.getByRole('button',{name:'Tile Bomb, 0 owned',exact:true}).waitFor({timeout:15000});
 const recovered=await stored(page);
 assert.equal(recovered.toolJournal?.contentVersion,version,'recovered journal retains its authored version');
 assert.equal(recovered.toolJournal?.requestId,oldJournal.requestId);
 assert.deepEqual(recovered.toolJournal?.after,oldJournal.after,'the committed board is restored');
 assert.equal(recovered.profile.inventory.tileBomb,0,'inventory is debited once');
 assert.equal(calls,phase==='pending'?1:0);
 await page.reload();await ready(page);
 await page.locator('.frame[data-mode="puzzle"]').waitFor({timeout:15000});
 assert.equal((await stored(page)).profile.inventory.tileBomb,0);
 assert.equal(calls,phase==='pending'?1:0,'reload does not spend the recovered tool again');
 await context.close();
}
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE||'/usr/bin/google-chrome',args:['--no-sandbox','--disable-dev-shm-usage']});try{if(process.env.DUNE_LEGACY_TOOL_ONLY){for(const version of ['chapter-7-5','chapter-7-4']){await previousContentToolRecovery(browser,'pending',version);await previousContentToolRecovery(browser,'applied',version);}console.log('Previous-content tool recovery browser checks passed.');return;}await uncertainUse(browser,true);await uncertainUse(browser,false);await uncertainUse(browser,true,true);await rejectedCached(browser,'consume');await rejectedCached(browser,'purchase');await rejectedCached(browser,'consume',true);await cachedReceiptRace(browser,'consume');await cachedReceiptRace(browser,'purchase');for(const version of ['chapter-7-5','chapter-7-4']){await previousContentToolRecovery(browser,'pending',version);await previousContentToolRecovery(browser,'applied',version);}console.log('JIT recovery browser checks passed: uncertain before/after commit, blocked input, exact retry, reload, deterministic rejection, sign-out, cross-device progress, stale receipt races, and previous-content recovery.');}finally{await browser.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
