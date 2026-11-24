const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const url=process.env.DUNE_TEST_URL||'http://127.0.0.1:3101/dune-relay/?playtest=1';
async function ready(page){const skip=page.getByRole('button',{name:'Skip lesson',exact:true});if(await skip.isVisible().catch(()=>false))await skip.click();await page.locator('canvas[data-play-ready="true"]').waitFor({timeout:30000});}
async function tap(page,row,col){const b=await page.locator('canvas').boundingBox();assert(b);const scale=b.width/960,top=540-b.height/scale;await page.mouse.click(b.x+(355+col*50)*scale,b.y+(70+row*50-top)*scale);}
async function open(browser,coins=0,viewport={width:844,height:390}){
 const context=await browser.newContext({viewport,reducedMotion:'reduce'});
 await context.addInitScript(value=>localStorage.setItem('dune-relay-playtest-wallet-v1',JSON.stringify({version:1,coins:value})),coins);
 const page=await context.newPage();await page.route('**/leaderboard-api/dune-relay/**',r=>r.fulfill({status:401,contentType:'application/json',body:'{}'}));await page.goto(url);await page.getByRole('button',{name:/Enter the oasis/}).click();await page.getByRole('button',{name:'Settings',exact:true}).click();await page.getByRole('button',{name:/Replay 4\.1 ·/}).click();return{context,page};
}
async function choose(page,name,count){await page.getByRole('button',{name:`${name}, ${count} owned`,exact:true}).click();const lesson=page.getByRole('dialog',{name:`${name} lesson`,exact:true});if(await lesson.isVisible().catch(()=>false))await page.getByRole('button',{name:'Use tool →',exact:true}).click();}
async function waitCount(page,name,count){await page.getByRole('button',{name:`${name}, ${count} owned`,exact:true}).waitFor({timeout:15000});}
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE||'/usr/bin/google-chrome',args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  const {context,page}=await open(browser,1200);const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.getByRole('button',{name:/^Start level/}).click();await ready(page);
  await page.screenshot({path:'/tmp/jit-mobile-board.png'});
  await choose(page,'Tile Bomb',2);await page.getByRole('button',{name:'Cancel',exact:true}).click();assert.equal(await page.getByRole('button',{name:'Tile Bomb, 2 owned',exact:true}).getAttribute('aria-pressed'),'false','cancel preserves stock');
  await choose(page,'Tile Bomb',2);await tap(page,4,4);await waitCount(page,'Tile Bomb',1);
  await choose(page,'Tile Bomb',1);await tap(page,4,4);await waitCount(page,'Tile Bomb',0);
  await choose(page,'Free Swap',2);await tap(page,0,0);await tap(page,0,1);await waitCount(page,'Free Swap',1);
  const record=await page.evaluate(()=>JSON.parse(localStorage.getItem('dune-relay-playtest-v1')).attempts[0]);assert.equal(record.movesUsed,0,'tools are excluded from ordinary move count');assert.equal(record.movesRemaining,record.initialMoves);assert.deepEqual(record.moves.map(move=>move.action),['tileBomb','tileBomb','freeSwap']);
  await page.getByRole('button',{name:'Tile Bomb, 0 owned',exact:true}).click();const purchase=page.getByRole('dialog',{name:'Buy Tile Bomb',exact:true});await purchase.waitFor();assert.match(await purchase.innerText(),/600 coins/);await purchase.getByRole('button',{name:'Cancel',exact:true}).click();assert.equal(await page.locator('.coin-pill').innerText(),'1,200','cancel does not charge');
  await page.getByRole('button',{name:'Tile Bomb, 0 owned',exact:true}).click();await purchase.getByRole('button',{name:'Buy · 600 coins',exact:true}).click();await waitCount(page,'Tile Bomb',1);assert.equal(await page.locator('.coin-pill').innerText(),'600','purchase deducts exactly600');await page.getByRole('button',{name:'Cancel',exact:true}).click();await waitCount(page,'Tile Bomb',1);
  await page.screenshot({path:'/tmp/jit-mobile-after-tools.png'});assert.deepEqual(errors,[]);await context.close();
  const owned=await open(browser,0,{width:667,height:375});const jet=owned.page.getByRole('button',{name:/Water Jet/});assert.match(await jet.innerText(),/Owned: 1/);assert.equal(await jet.isEnabled(),true,'owned booster can be selected with zero coins');await jet.click();await owned.page.getByRole('button',{name:/^Start level/}).click();await ready(owned.page);assert.equal(await owned.page.locator('.coin-pill').innerText(),'0');await owned.page.getByRole('button',{name:'Settings',exact:true}).click();await owned.page.getByText('Water Jet × 0',{exact:true}).waitFor();await owned.context.close();
  console.log('JIT mobile checks passed: lessons, cancel, Bomb/Swap, no move use, stats, 600-coin purchase and zero-coin owned starting booster.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
