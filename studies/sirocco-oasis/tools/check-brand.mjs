import {chromium,expect} from '@playwright/test';
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--use-angle=swiftshader']});
try{
 const page=await browser.newPage({reducedMotion:'reduce'}), errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 for(const [name,width,height] of [['desktop',1200,800],['mobile',390,844]]){
  await page.setViewportSize({width,height});
  await page.goto('http://localhost:5174/sirocco-oasis/');
  await page.waitForFunction(()=>window.__oasis?.getStats().ready);
  const credit=page.locator('.builder-credit');
  await expect(credit).toBeVisible();
  await expect(credit).toHaveAttribute('href','https://raidguild.org/');
  expect(await credit.locator('img').evaluate(i=>i.complete&&i.naturalWidth>0)).toBe(true);
  const box=await credit.boundingBox();expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(width);
  await page.screenshot({path:`work/sirocco-brand-${name}.png`});
  await page.locator('#hide').click();
  await expect(credit).toBeHidden();
  console.log(`PASS ${name}: stamp loads, link visible and fits, hides with UI.`);
 }
 expect(errors).toEqual([]);
}finally{await browser.close();}
