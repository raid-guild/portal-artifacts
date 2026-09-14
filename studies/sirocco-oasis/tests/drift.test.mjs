import {chromium,expect} from '@playwright/test';
const browser=await chromium.launch({headless:true,channel:'chrome',args:['--no-sandbox','--use-angle=swiftshader']});
try{
 // Suppress ambient boat bob and entry fly-ins so movement assertions isolate Drift.
 const page=await browser.newPage({reducedMotion:'reduce',viewport:{width:640,height:700}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.OASIS_TEST_URL||'http://localhost:5174/sirocco-oasis/');await expect(page.locator('#ship-view')).toBeEnabled({timeout:30000});
 const stats=()=>page.evaluate(()=>window.__oasis.getStats());const distance=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
 for(const view of ['vista','ship','room']){
  if(view==='ship')await page.locator('#ship-view').click();if(view==='room')await page.locator('#room-view').click();
  await expect.poll(async()=>(await stats()).transitioning,{timeout:20000}).toBe(false);
  const before=await stats();await page.locator('#tour').click();
  expect((await stats()).view).toBe(view);await expect(page.locator('#tour')).toHaveAttribute('aria-pressed','true');
  await expect.poll(async()=>(await stats()).time-before.time,{timeout:30000}).toBeGreaterThan(.8);
  const during=await stats();expect(during.view).toBe(view);expect(distance(during[view==='room'?'target':'camera'],before[view==='room'?'target':'camera'])).toBeGreaterThan(.003);
  if(view==='room')expect(distance(during.camera,before.camera)).toBeLessThan(.1);
  await page.locator('#tour').click();expect((await stats()).view).toBe(view);expect((await stats()).drifting).toBe(false);
  console.log(`PASS ${view}: drift stays in perspective, camera moves appropriately, stops without changing view.`);
 }
 if(errors.length)throw new Error(errors.join('\n'));
}finally{await browser.close();}
