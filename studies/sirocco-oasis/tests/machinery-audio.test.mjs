import {chromium,expect} from '@playwright/test';
const browser=await chromium.launch({headless:true,channel:'chrome',args:['--no-sandbox','--use-angle=swiftshader']});
try{
 for(let step=Number(process.env.MACHINERY_STAGE||0);step<Number(process.env.MACHINERY_END||5);step++){
  const context=await browser.newContext({viewport:{width:1280,height:900}}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.addInitScript(s=>localStorage.setItem('sirocco.morrow.v2',JSON.stringify({step:s,elapsed:0,fill:s>2?1:0,running:false,rate:1,delivered:0,flights:[]})),step);
  await page.goto(process.env.OASIS_TEST_URL||'http://localhost:5174/sirocco-oasis/');await expect(page.locator('#ship-view')).toBeEnabled({timeout:30000});
  const stats=()=>page.evaluate(()=>window.__oasis.getStats().machinery);
  expect((await stats()).context).toBe('uninitialized');
  await page.locator('#ship-view').click();await page.locator('#pump').click();
  await expect.poll(async()=>(await stats()).loaded,{timeout:20000}).toBe(5);await expect.poll(async()=>(await stats()).rms,{timeout:10000}).toBeGreaterThan(.001);
  expect((await stats()).stage).toBe(step);expect((await stats()).loops).toBe(2);expect((await stats()).voices).toBeLessThanOrEqual(12);
  if(step===2){for(let i=0;i<16;i++){await page.locator('#pump').click();await page.waitForTimeout(70);}await expect.poll(async()=>(await stats()).loops).toBe(2);expect((await stats()).voices).toBeLessThanOrEqual(12);console.log('PASS: rapid start/stop presses retain the running engine layers.');}
  await page.locator('#pump').click();await expect.poll(async()=>(await stats()).loops).toBe(0);
  await page.locator('#machinery-volume').focus();await page.locator('#machinery-volume').press('Home');
  await expect.poll(async()=>(await stats()).rms,{timeout:5000}).toBeLessThan(.0001);
  await page.locator('#pump').click();await page.waitForTimeout(500);expect((await stats()).loops).toBe(0);
  await page.locator('#machinery-volume').focus();await page.locator('#machinery-volume').press('End');await expect.poll(async()=>(await stats()).loops).toBe(2);
  await page.locator('#room-view').click();await expect.poll(async()=>(await stats()).view,{timeout:15000}).toBe('room').catch(async e=>{console.log(await page.evaluate(()=>({body:document.body.className,room:document.querySelector('#room-view').getAttribute('aria-pressed'),hidden:document.hidden,stats:window.__oasis.getStats().machinery})));throw e;});
  await page.locator('#ship-view').click();await expect.poll(async()=>(await stats()).view).toBe('vista');
  if(errors.length)throw new Error(errors.join('\n'));console.log(`PASS stage ${step+1}: actual audible recording, two bounded loops, pause, mute, unmute, cabin/vista mix, no errors.`);await context.close();
 }
}finally{await browser.close();}
