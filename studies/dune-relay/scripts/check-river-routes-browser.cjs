const assert=require('node:assert/strict');
const fs=require('node:fs');
const ts=require('typescript');
const Module=require('node:module');
const {chromium}=require('playwright');

// Keep this check tied to the authored levels rather than hard-coding tile positions.
Module._extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true,resolveJsonModule:true}}).outputText,filename);
const {createPuzzle,playTurn}=require('../src/game/core.ts');
const {LEVELS}=require('../src/game/levels.ts');
const {castleLevelForCompanion,companionSnapshot}=require('../src/game/companionAbilities.ts');
const url=process.env.DUNE_TEST_URL||'http://127.0.0.1:3186/';

function firstFlowMove(id){
  const puzzle=createPuzzle(castleLevelForCompanion(LEVELS[id],companionSnapshot('keeper')));
  for(let row=0;row<9;row++)for(let col=0;col<9;col++)for(const to of [{row,col:col+1},{row:row+1,col}]){
    if(to.row>=9||to.col>=9)continue;
    const from={row,col},turn=playTurn(puzzle,from,to);
    if(turn.valid&&turn.steps.some(step=>step.kind==='current'))return {from,to,turn};
  }
  throw Error(`No current-producing move in ${id}`);
}
async function tap(page,cell){
  const box=await page.locator('canvas').first().boundingBox();assert(box);
  const scale=box.width/960,top=540-box.height/scale;
  const x=330+cell.col*50+25,y=45+cell.row*50+25;
  await page.mouse.click(box.x+x*scale,box.y+(y-top)*scale);
}
async function runLevel(browser,number,id,expected){
  const context=await browser.newContext({viewport:{width:1180,height:660},reducedMotion:'reduce'});
  const page=await context.newPage();
  try{
    await page.route('**/leaderboard-api/dune-relay/**',route=>route.fulfill({status:401,contentType:'application/json',body:'{}'}));
    await page.goto(new URL('?playtest=1',url).href);
    await page.getByRole('button',{name:/Enter the oasis/}).click();
    await page.getByRole('button',{name:'Settings'}).click();
    await page.getByRole('button',{name:new RegExp(`Replay 7\\.${number} ·`)}).click();
    await page.getByRole('button',{name:/Start level/}).click();
    if(number===3||number===5){
      await page.getByRole('dialog',{name:/lesson/}).waitFor({timeout:30000});
      await page.getByRole('button',{name:'Skip lesson'}).click();
    }
    const canvas=page.locator('canvas[data-current-route-count]');
    await canvas.waitFor({timeout:30000});
    assert.equal(await canvas.getAttribute('data-current-route-count'),String(expected.routes),`${id} route count`);
    const frozen=(await canvas.getAttribute('data-current-frozen-routes')||'').split(',').filter(Boolean);
    const active=(await canvas.getAttribute('data-current-active-routes')||'').split(',').filter(Boolean);
    assert.equal(frozen.length,expected.frozen,`${id} frozen route count`);
    assert.equal(active.length,expected.routes-expected.frozen,`${id} flowing route count`);
    if(expected.exits!==undefined)assert.equal(await canvas.getAttribute('data-crate-exit-count'),String(expected.exits),`${id} marked exits`);
    let wraps=0;
    if(expected.move){
      await page.waitForFunction(()=>document.querySelector('canvas[data-current-route-count]')?.dataset.introPhase==='ready',null,{timeout:30000});
      const {from,to,turn}=firstFlowMove(id);
      await tap(page,from);await tap(page,to);
      await page.waitForFunction(()=>Number(document.querySelector('canvas[data-current-route-count]')?.dataset.currentSteps||0)>0,null,{timeout:30000});
      wraps=Number(await canvas.getAttribute('data-current-wraps')||0);
      const expectedWraps=turn.steps.flatMap(step=>step.currentMotions||[]).filter(motion=>motion.wrap).length;
      assert.equal(wraps,expectedWraps,`${id} edge wrap flights`);
    }
    console.log(`${id}: ${active.length} active / ${frozen.length} frozen routes, ${wraps} wrapped flights, ${expected.exits??0} exits`);
  }finally{await context.close();}
}
async function main(){
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE||'/usr/bin/google-chrome',args:['--no-sandbox','--disable-dev-shm-usage']});
  try{
    await runLevel(browser,3,'broadwaterTurn',{routes:1,frozen:0,move:true});
    await runLevel(browser,5,'clearingTheBend',{routes:2,frozen:1,move:true});
    await runLevel(browser,8,'splitwaterCargo',{routes:2,frozen:0,exits:9,move:true});
    await runLevel(browser,10,'openTheCollectionRoute',{routes:2,frozen:2,move:true});
  }finally{await browser.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
