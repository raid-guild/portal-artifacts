const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const route=require('./fixtures/condensation-winning-route.json');
const url=process.env.DUNE_TEST_URL||'http://127.0.0.1:3101/dune-relay/condensation/?playtest=1';
const keys=['dune-relay-campaign-v5','dune-relay-playtest-v1','dune-relay-playtest-wallet-v1'];
async function tap(page,cell){const box=await page.locator('canvas').boundingBox();assert(box);const s=box.height/540;await page.mouse.click(box.x+box.width/2+(330+cell.col*50+25-480)*s,box.y+(45+cell.row*50+25)*s);}
async function ready(page){await page.locator('canvas[data-play-ready="true"]').waitFor({timeout:60000});}
async function turn(page,from,to){await page.locator('canvas').evaluate(c=>delete c.dataset.waterRemaining);if(from.row===to.row&&from.col===to.col){await tap(page,from);await tap(page,to);}else{await tap(page,from);await tap(page,to);}await page.locator('canvas[data-water-remaining="0"]').waitFor({timeout:60000});}
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--disable-dev-shm-usage']});try{
 for(const mobile of [false,true]){
  const context=await browser.newContext({viewport:mobile?{width:844,height:390}:{width:1180,height:660},isMobile:mobile,hasTouch:mobile,reducedMotion:'reduce'});const page=await context.newPage();const errors=[],calls=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.url().includes('/leaderboard-api/'))calls.push(r.url());});await page.addInitScript(keys=>{for(const k of keys)localStorage.setItem(k,'condensation-sentinel');},keys);
  await page.goto(url);await page.getByRole('button',{name:'Test Condensation →',exact:true}).click();await ready(page);assert.equal(await page.locator('canvas').getAttribute('data-condensation-wet'),'3');await page.screenshot({path:'/tmp/condensation-'+(mobile?'mobile':'desktop')+'.png'});console.log(mobile?'Mobile ready':'Desktop ready');
  await turn(page,{row:4,col:3},{row:4,col:4});assert(Number(await page.locator('canvas').getAttribute('data-condensation-wet'))>3,'wet opening visibly spreads');await page.screenshot({path:'/tmp/condensation-'+(mobile?'mobile':'desktop')+'-spread.png'});
  await page.getByRole('button',{name:'Retry',exact:true}).click();await ready(page);assert.equal(await page.locator('canvas').getAttribute('data-condensation-wet'),'3');
  if(!mobile){for(const [index,[from,to]] of route.entries()){await turn(page,from,to);console.log('Turn',index+1,'wet',await page.locator('canvas').getAttribute('data-condensation-wet'));}await page.getByRole('heading',{name:'All collectors filled!'}).waitFor({timeout:60000});assert.equal(await page.locator('canvas').getAttribute('data-condensation-wet'),'25');assert.equal(await page.locator('.skip-reveal').count(),0);console.log('Completion passed');}
  assert.deepEqual(await page.evaluate(keys=>keys.map(k=>localStorage.getItem(k)),keys),keys.map(()=> 'condensation-sentinel'));assert.deepEqual(calls,[]);assert.deepEqual(errors,[]);await context.close();
 }
 const context=await browser.newContext();const page=await context.newPage();await page.goto(url.replace('?playtest=1',''));await page.waitForTimeout(500);assert.equal(await page.locator('canvas').count(),0,'query gate');await context.close();
 if(process.env.DUNE_PUBLIC_TEST_URL){const publicContext=await browser.newContext();const publicPage=await publicContext.newPage();await publicPage.goto(process.env.DUNE_PUBLIC_TEST_URL);await publicPage.getByText('Condensation is available only in the local playtest preview.').waitFor({timeout:30000});assert.equal(await publicPage.locator('canvas').count(),0,'public build does not mount the board');await publicContext.close();}
 console.log('Condensation preview browser checks passed.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
