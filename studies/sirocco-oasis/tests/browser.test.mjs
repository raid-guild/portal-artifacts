import {chromium,expect} from '@playwright/test';
const browser=await chromium.launch({headless:true,channel:'chrome',args:['--no-sandbox','--use-angle=swiftshader']});
try{
 const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.addInitScript(()=>{if(!localStorage.getItem('test.seeded')){localStorage.setItem('test.seeded','1');localStorage.setItem('sirocco.morrow.v2',JSON.stringify({version:2,step:2,elapsed:25.2,fill:.42,running:false,rate:1.2,delivered:123,flights:[]}));}});
 await page.goto(process.env.OASIS_TEST_URL||'http://localhost:5174/sirocco-oasis/');await expect(page.locator('#ship-view')).toBeEnabled({timeout:30000});await page.locator('#ship-view').click();
 await expect(page.locator('#delivered')).toHaveText('123');await expect(page.locator('#harvest-percent')).toHaveText('42%');await expect(page.locator('[data-step="4"]')).toBeDisabled();
 await page.locator('#room-view').click();await expect(page.locator('#operator-panel')).not.toHaveAttribute('open');await page.locator('#operator-panel>summary').click();
 await page.locator('#radio-volume').focus();await page.locator('#radio-volume').press('ArrowRight');
 await expect.poll(()=>page.locator('#field-radio-audio').evaluate(a=>!a.paused&&a.readyState>=2),{timeout:20000}).toBe(true);
 await page.locator('#deck-view').click();await expect(page.locator('#ship-radio')).toBeHidden();await expect.poll(()=>page.locator('#field-radio-audio').evaluate(a=>a.paused)).toBe(true);
 await page.reload();await expect(page.locator('#ship-view')).toBeEnabled({timeout:30000});await page.locator('#ship-view').click();await expect(page.locator('#delivered')).toHaveText('123');await expect(page.locator('#harvest-percent')).toHaveText('42%');
 await expect.poll(()=>page.locator('#field-radio-audio').evaluate(a=>a.paused)).toBe(true);
 if(errors.length)throw new Error(errors.join('\n'));
 console.log('PASS: saved quota and paused fill restored, dispatch gate, radio playback in room, silent outside, silent on reload, no browser or shader errors.');
}finally{await browser.close();}
