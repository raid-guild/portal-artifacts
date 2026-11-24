const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const url=process.env.DUNE_TEST_URL||'http://127.0.0.1:3101/dune-relay/?playtest=1';
const publicUrl=process.env.DUNE_PUBLIC_URL||'http://127.0.0.1:3102/dune-relay/';
const keys=['dune-relay-campaign-v5','dune-relay-playtest-wallet-v1','dune-relay-cloud-777-v1','dune-relay-last-portal-account-v1'];
async function unchangedState(page){return page.evaluate(keys=>Object.fromEntries(keys.map(key=>[key,localStorage.getItem(key)])),keys);}
async function fits(page,dialog,label){
 const frame=await page.locator('.frame').boundingBox();assert(frame);
 const body=dialog.locator('.tool-lesson-body,.tool-gift-body');const targets=[dialog,dialog.locator('h2'),body,...await dialog.getByRole('button').all()];
 for(const target of targets){const b=await target.boundingBox();assert(b,`${label}: visible box`);assert(b.x>=frame.x-1&&b.y>=frame.y-1&&b.x+b.width<=frame.x+frame.width+1&&b.y+b.height<=frame.y+frame.height+1,`${label}: ${await target.getAttribute('class')} stays in the game frame (${JSON.stringify(b)} vs ${JSON.stringify(frame)})`);}
 assert.equal(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth+1),true,`${label}: no horizontal overflow`);assert.equal(await body.evaluate(el=>el.scrollWidth<=el.clientWidth+1),true,`${label}: body has no horizontal overflow`);
}
async function runViewport(browser,viewport,touch=false){
 const context=await browser.newContext({viewport,hasTouch:touch,isMobile:touch,reducedMotion:'reduce'});
 await context.addInitScript(()=>{
  localStorage.setItem('dune-relay-campaign-v5',JSON.stringify({version:5,completed:['pumpHouse'],coins:77,region:'oasis',companions:['keeper'],oasisTransition:'locked',transition:null,gatehouseReady:false,farmlandReady:false,demoEnding:'locked'}));
  localStorage.setItem('dune-relay-playtest-wallet-v1',JSON.stringify({version:1,coins:600}));
  localStorage.setItem('dune-relay-cloud-777-v1',JSON.stringify({profile:{revision:3,campaign:{version:5,completed:['pumpHouse'],coins:99},inventory:{tileBomb:9}},pending:[]}));
  localStorage.setItem('dune-relay-last-portal-account-v1','777');
 });
 const page=await context.newPage();let requests=0;const errors=[];page.on('pageerror',error=>errors.push(error.message));await page.route('**/leaderboard-api/dune-relay/**',route=>{requests++;return route.fulfill({status:401,contentType:'application/json',body:'{}'});});
 await page.goto(url);await page.getByRole('button',{name:/^Enter /}).click();await page.locator('.awning-wipe').waitFor({state:'detached'});const before=await unchangedState(page);
 await page.getByRole('button',{name:'Settings',exact:true}).click();await page.getByRole('button',{name:'How to play',exact:true}).click();
 for(const name of ['Tile Bomb','Free Swap']){
  await page.getByRole('dialog',{name:'How to play',exact:true}).getByRole('button',{name:new RegExp(`^${name}`)}).click();const lesson=page.getByRole('dialog',{name:`${name} lesson`,exact:true});await fits(page,lesson,`${viewport.width} ${name}`);await page.screenshot({path:`/tmp/tool-lesson-${name.replace(' ','-')}-${viewport.width}.png`});await lesson.getByRole('button',{name:'Done',exact:true}).click();
 }
 await page.getByRole('button',{name:'Back to Settings',exact:true}).click();await page.getByRole('button',{name:'Preview Fieldkeeper gift',exact:true}).click();let gift=page.getByRole('dialog',{name:"Fieldkeeper's toolkit",exact:true});await fits(page,gift,`${viewport.width} gift`);await page.screenshot({path:`/tmp/tool-gift-${viewport.width}.png`});await gift.getByRole('button',{name:'Maybe later',exact:true}).click();
 await page.getByRole('button',{name:'Settings',exact:true}).click();await page.getByText('Tile Bomb × 2',{exact:true}).waitFor();await page.getByText('Free Swap × 2',{exact:true}).waitFor();await page.getByRole('button',{name:'Preview Fieldkeeper gift',exact:true}).click();gift=page.getByRole('dialog',{name:"Fieldkeeper's toolkit",exact:true});await gift.getByRole('button',{name:'Take the toolkit →',exact:true}).click();
 await page.getByRole('button',{name:'Settings',exact:true}).click();await page.getByText('Tile Bomb × 3',{exact:true}).waitFor();await page.getByText('Free Swap × 3',{exact:true}).waitFor();await page.getByRole('button',{name:'Preview Fieldkeeper gift',exact:true}).click();await page.getByRole('button',{name:'Take the toolkit →',exact:true}).click();await page.getByRole('button',{name:'Settings',exact:true}).click();await page.getByText('Tile Bomb × 4',{exact:true}).waitFor();await page.getByText('Free Swap × 4',{exact:true}).waitFor();
 assert.deepEqual(await unchangedState(page),before,'preview gift leaves campaign, test wallet, and Portal cache untouched');assert.equal(requests,0,'sandbox gift never calls account APIs');assert.deepEqual(errors,[]);await context.close();console.log(`Tool lesson and gift layout passed at ${viewport.width}x${viewport.height}${touch?' touch':''}.`);
}
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE||'/usr/bin/google-chrome',args:['--no-sandbox','--disable-dev-shm-usage']});try{for(const [viewport,touch]of [[{width:648,height:666},false],[{width:844,height:390},true],[{width:667,height:375},true],[{width:960,height:540},false]])await runViewport(browser,viewport,touch);const context=await browser.newContext({viewport:{width:844,height:390}});const page=await context.newPage();await page.route('**/leaderboard-api/dune-relay/**',r=>r.fulfill({status:401,contentType:'application/json',body:'{}'}));await page.goto(publicUrl+'?playtest=1');await page.getByRole('button',{name:/^Enter /}).click();await page.getByRole('button',{name:'Settings',exact:true}).click();assert.equal(await page.getByRole('button',{name:'Preview Fieldkeeper gift',exact:true}).count(),0,'public build never exposes preview gift');await context.close();console.log('Production gift-preview guard passed.');}finally{await browser.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
