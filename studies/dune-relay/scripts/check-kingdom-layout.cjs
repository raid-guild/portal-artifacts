const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const url = process.env.DUNE_TEST_URL || 'http://127.0.0.1:3186/dune-relay/?playtest=1';
const selectors = ['.atlas-stamp','.atlas-active','.atlas-gatehouse','.atlas-farmland','.atlas-dune-pass','.atlas-castle'];
const intersects = (a,b) => Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x)>2 && Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y)>2;
(async () => {
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE||'/usr/bin/google-chrome',args:['--no-sandbox','--disable-dev-shm-usage']});
  try {
    for (const {width,height,touch} of [{width:667,height:375,touch:true},{width:844,height:300,touch:true},{width:1100,height:650,touch:false}]) {
      const context=await browser.newContext({viewport:{width,height},isMobile:touch,hasTouch:touch,reducedMotion:'reduce'});
      const page=await context.newPage();
      await page.goto(url);
      await page.getByRole('button',{name:/Enter the oasis/}).click();
      await page.locator('.awning-wipe').waitFor({state:'detached',timeout:30000});
      await page.getByRole('button',{name:'Settings',exact:true}).click();
      await page.getByRole('button',{name:'Preview Castle → upstream ending',exact:true}).click();
      await page.locator('.awning-wipe').waitFor({state:'detached',timeout:30000});
      await page.getByRole('button',{name:'Kingdom Map',exact:true}).last().click();
      const plane=await page.locator('.atlas-plane').boundingBox();
      assert(plane);
      const boxes=[];
      for (const selector of selectors) {
        const box=await page.locator(selector).boundingBox();
        assert(box,`${selector} visible at ${width}×${height}`);
        assert(box.x>=plane.x-1 && box.y>=plane.y-1 && box.x+box.width<=plane.x+plane.width+1 && box.y+box.height<=plane.y+plane.height+1,`${selector} lies inside map at ${width}×${height}`);
        boxes.push(box);
      }
      for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++)assert(!intersects(boxes[i],boxes[j]),`${selectors[i]} overlaps ${selectors[j]} at ${width}×${height}`);
      const title=await page.locator('.atlas-heading').boundingBox(), action=await page.locator('.atlas-action').boundingBox();
      assert(title && action && !intersects(title,action),'heading and return button do not overlap');
      await context.close();
    }
    console.log('Six map landmarks stay visible and separate on short mobile, standard mobile, and desktop screens.');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
