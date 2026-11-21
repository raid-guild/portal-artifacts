const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const devUrl=process.env.DUNE_TEST_URL || 'http://127.0.0.1:3101/dune-relay/?playtest=1';
const publicUrl=process.env.DUNE_PUBLIC_URL || 'http://127.0.0.1:3102/dune-relay/';
async function main(){
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE || '/usr/bin/google-chrome',args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  const context=await browser.newContext({viewport:{width:844,height:390},reducedMotion:'reduce'});
  await context.addInitScript(()=>localStorage.setItem('dune-relay-playtest-wallet-v1',JSON.stringify({version:1,coins:600})));
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(devUrl);await page.getByRole('button',{name:/Enter the oasis/}).click();
  await page.getByRole('button',{name:'Settings'}).click();await page.getByRole('button',{name:'Replay PUMP HOUSE',exact:true}).click();
  await page.getByRole('button',{name:/Water Jet.*300 coins/}).click();
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.getByRole('button',{name:/Start level/}).click();
  const intro=page.locator('[data-tutorial="jet"]');await intro.waitFor();
  assert.equal(await page.locator('.coin-pill').innerText(),'600','tutorial opens before purchase');
  assert.equal(await page.locator('[data-mode="map"]').count(),1,'tutorial opens before board');
  assert.equal(await page.getByRole('button',{name:'Skip lesson'}).count(),1,'skip available immediately');
  const before=Number(await intro.getAttribute('data-stage'));
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});
  await page.waitForTimeout(1900);
  assert.equal(Number(await intro.getAttribute('data-stage')),before,'hidden tab pauses scripted lesson');
  assert.equal(await intro.getAttribute('data-hidden'),'true');
  assert.equal(await intro.locator('.tutorial-motion').evaluate(el=>getComputedStyle(el).animationPlayState),'paused','hidden tab pauses sprite motion');
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});document.dispatchEvent(new Event('visibilitychange'));});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.getByRole('button',{name:'Skip lesson'}).click();
  await page.locator('[data-mode="puzzle"]').waitFor();
  await page.locator('canvas[data-play-ready="true"]').waitFor({timeout:30000});
  assert.equal(await page.locator('.coin-pill').innerText(),'300','one booster charged only after skip launches');
  assert.equal(await page.locator('[data-moves="24"]').count(),1);
  await page.getByRole('button',{name:'Settings'}).click();await page.getByRole('button',{name:/How to play/}).click();
  const snapshot=await page.evaluate(()=>({wallet:localStorage.getItem('dune-relay-playtest-wallet-v1'),archive:localStorage.getItem('dune-relay-playtest-v1')}));
  await page.getByRole('button',{name:/Pressure Jet/}).click();
  const replay=page.locator('[data-tutorial="jet"]');await replay.waitFor();
  assert.equal(await replay.locator('.tutorial-board').getAttribute('data-reduced'),'true');
  await page.getByRole('button',{name:'Watch again'}).click();
  assert.equal(await replay.getAttribute('data-stage'),'0');
  await page.getByRole('button',{name:'Back to lessons'}).first().click();
  await page.getByRole('button',{name:/Pressure Jet/}).waitFor();
  assert.equal(await page.evaluate(()=>document.activeElement?.getAttribute('data-tutorial-item')),'jet','replay returns focus to the matching lesson');
  const after=await page.evaluate(()=>({wallet:localStorage.getItem('dune-relay-playtest-wallet-v1'),archive:localStorage.getItem('dune-relay-playtest-v1')}));
  assert.deepEqual(after,snapshot,'lesson replay leaves wallet and attempt unchanged');
  await page.getByRole('button',{name:/Seedpod/}).click();
  await page.locator('[data-tutorial="seedpod"]').waitFor();
  await page.locator('[data-stage="2"]').waitFor({timeout:7000});
  assert.equal(await page.locator('.tutorial-motion.is-fall').count(),1,'cracked pod visibly falls');
  await page.getByRole('button',{name:'Back to lessons'}).first().click();
  await page.getByRole('button',{name:/^Prism / }).click();
  await page.locator('[data-stage="2"]').waitFor({timeout:7000});
  assert.equal(await page.locator('.tutorial-beam-rainbow').count(),1,'Prism has rainbow action');
  assert.deepEqual(errors,[]);await context.close();

  const narrow=await browser.newContext({viewport:{width:667,height:375},reducedMotion:'reduce'});
  const n=await narrow.newPage();await n.goto(devUrl);await n.getByRole('button',{name:/Enter the oasis/}).click();await n.getByRole('button',{name:'Settings'}).click();await n.getByRole('button',{name:/How to play/}).click();await n.getByRole('button',{name:/^Prism / }).click();
  const box=await n.locator('.tutorial-card').boundingBox();assert.ok(box&&box.x>=0&&box.y>=0&&box.x+box.width<=667&&box.y+box.height<=375,'small landscape lesson fits viewport');
  assert.equal(await n.locator('.tutorial-card img').first().evaluate(el=>el.complete&&el.naturalWidth>0),true,'portrait sprite loads');await narrow.close();

  const publicContext=await browser.newContext({viewport:{width:844,height:390}});
  await publicContext.addInitScript(()=>localStorage.setItem('dune-relay-tutorials-v1:guest',JSON.stringify({version:1,seen:['seedpod']})));
  const pub=await publicContext.newPage();await pub.goto(publicUrl);await pub.getByRole('button',{name:/Enter the oasis/}).click();await pub.getByRole('button',{name:'Settings'}).click();await pub.getByRole('button',{name:/How to play/}).click();
  assert.equal(await pub.getByRole('button',{name:/Seedpod/}).count(),0,'guest preference does not unlock Farmland lesson');
  assert.equal(await pub.getByRole('button',{name:/Pressure Jet/}).count(),1,'current introductory lesson is available');
  await publicContext.close();
  console.log('Tutorial browser flow: pre-charge gate, skip once, replay purity, hidden pause, small landscape, Prism/pod motion, and public Farmland gate passed.');
 }finally{await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1});
