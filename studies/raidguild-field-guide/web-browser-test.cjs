const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '../../public/raidguild-field-guide');
const origin = 'https://guide.test/raidguild-field-guide/';
const shotDir = process.env.FIELD_GUIDE_SCREENSHOTS;
const mime = { '.html':'text/html','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.png':'image/png','.json':'application/json','.glb':'model/gltf-binary' };
async function serve(context) {
  await context.route('https://guide.test/**', async (route) => {
    const relative = new URL(route.request().url()).pathname.replace('/raidguild-field-guide/','') || 'index.html';
    try { await route.fulfill({ body: await fs.readFile(path.join(root,relative)), contentType:mime[path.extname(relative)] }); }
    catch { await route.fulfill({status:404,body:''}); }
  });
}
async function screenshot(page,name) { if (shotDir) { await fs.mkdir(shotDir,{recursive:true}); await page.screenshot({path:path.join(shotDir,name)}); } }
(async () => {
  const browser = await chromium.launch({args:['--no-sandbox']});
  try {
    const desktop = await browser.newContext({viewport:{width:1440,height:900}}); await serve(desktop);
    const page = await desktop.newPage();
    const errors=[]; page.on('pageerror',(error)=>errors.push(error.message));
    await page.goto(origin);
    assert.equal(await page.locator('html').getAttribute('data-route'),'web');
    assert.equal(await page.locator('#web-guide').isVisible(),true);
    assert.equal(await page.locator('#book').isVisible(),false);
    await screenshot(page,'raidguild-web-hero-v19.png');
    assert.equal(await page.locator('#web-guide .web-class-roster a').count(),14);
    assert.equal(await page.locator('#web-guide .web-path-list>div').count(),42);
    assert.equal(await page.locator('#web-guide .web-credits li').count(),145);
    assert.equal(await page.locator('#web-guide form').count(),0);
    assert.doesNotMatch(await page.locator('#web-guide').innerText(),/Class labels follow the supplied Portal export|Field Guide class · Forward Deployed Engineer/);
    const history = page.locator('#web-section-history');
    assert.equal(await history.locator('.web-history-hero h2').textContent(),'The Guild we build together.');
    assert.equal(await history.locator('.web-history-era').count(),3);
    assert.match(await history.locator('.web-history-era').first().innerText(),/RaidGuild took shape in 2019 from Odyssy/);
    assert.match(await history.locator('.web-history-era').first().innerText(),/James Waugh and Cooper Turley/);
    if (shotDir) await history.locator('.web-history-hero').screenshot({path:path.join(shotDir,'raidguild-history-web-hero-v21.png')});
    await page.locator('.web-hero a[href="#longform-world"]').click();
    assert.equal(new URL(page.url()).hash,'#longform-world');
    const spot=page.locator('#web-section-world .web-pin[data-web-item="workshop"]');
    await spot.click();
    assert.equal(new URL(page.url()).hash,'#longform-world-workshop-note');
    assert.equal(await page.locator('#web-section-world .web-active-note:not([hidden]) h3').textContent(),'Workshop');
    await page.goBack();
    assert.equal(new URL(page.url()).hash,'#longform-world');
    await page.waitForFunction(()=>document.querySelector('#web-section-world .web-active-note:not([hidden]) h3')?.textContent==='Gathering Hall');
    await page.goForward();
    await page.waitForFunction(()=>document.querySelector('#web-section-world .web-active-note:not([hidden]) h3')?.textContent==='Workshop');
    await page.goto(origin+'#longform-airship-agreements-note');
    assert.equal(await page.locator('html').getAttribute('data-route'),'web');
    assert.equal(await page.locator('#web-section-airship .web-active-note:not([hidden]) h3').textContent(),'Make the engagement clear');
    await screenshot(page,'raidguild-web-diagram-v19.png');
    await page.goto(origin+'#longform-classes');
    await page.locator('.web-class-roster a[data-web-class-link="warlock"]').click();
    assert.equal(new URL(page.url()).hash,'#longform-class-warlock');
    assert.equal(await page.locator('.web-class-panel:not([hidden]) h3').textContent(),'Warlock');
    assert.equal(await page.locator('.web-class-panel:not([hidden]) .web-path-list>div').count(),3);
    await page.evaluate(()=>window.scrollTo({top:document.querySelector('.web-class-explorer').getBoundingClientRect().top+scrollY-74,behavior:'instant'}));
    await screenshot(page,'raidguild-web-classes-v19.png');
    await page.goBack();
    assert.equal(new URL(page.url()).hash,'#longform-classes');
    await page.waitForFunction(()=>document.querySelector('.web-class-panel:not([hidden]) h3')?.textContent==='Cleric');
    await page.goto(origin+'#longform-sidequests');
    const webCan = page.locator('#web-section-sidequests [data-brood-can]');
    await webCan.locator('[data-brood-explore]').click();
    await page.waitForFunction(()=>document.querySelector('#web-section-sidequests [data-brood-can]')?.dataset.active==='true');
    assert.equal(await webCan.locator('canvas').count(),1);
    await page.goto(origin+'#book-cover');
    assert.equal(await page.locator('#book').isVisible(),true);
    assert.equal(await page.locator('#page1').isVisible(),true);
    assert.equal(await webCan.locator('canvas').count(),0);
    await page.locator('.book-global-nav a[href="#longform"]').click();
    await page.waitForFunction(()=>document.documentElement.dataset.route==='web');
    assert.equal(await page.locator('#web-guide').isVisible(),true);
    assert.deepEqual(errors,[]);
    await desktop.close();
    const mobile=await browser.newContext({viewport:{width:390,height:844}}); await serve(mobile);
    const phone=await mobile.newPage();
    for(const hash of ['', '#longform-world','#longform-classes','#longform-airship-agreements-note','#longform-sidequests']) {
      await phone.goto(origin+hash);
      assert.equal(await phone.locator('html').getAttribute('data-route'),'web');
      assert.equal(await phone.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+1),true,`overflow at ${hash}`);
    }
    await phone.goto(origin+'#longform-class-artificer');
    assert.equal(await phone.locator('.web-class-panel:not([hidden]) h3').textContent(),'Artificer');
    assert.equal(await phone.locator('.web-class-roster a[aria-current="true"]').getAttribute('data-web-class-link'),'artificer');
    assert.equal(await phone.evaluate(()=>{const roster=document.querySelector('.web-class-roster').getBoundingClientRect();const selected=document.querySelector('.web-class-roster a[aria-current="true"]').getBoundingClientRect();return selected.left>=roster.left-1&&selected.right<=roster.right+1}),true);
    await screenshot(phone,'raidguild-web-mobile-v19.png');
    await phone.goto(origin+'#longform-history');
    assert.equal(await phone.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+1),true,'overflow in mobile history');
    if (shotDir) await phone.locator('.web-history-hero').screenshot({path:path.join(shotDir,'raidguild-history-web-mobile-v21.png')});
    await mobile.close();
    const fallback=await browser.newContext({viewport:{width:390,height:844},javaScriptEnabled:false}); await serve(fallback);
    const noJs=await fallback.newPage();
    await noJs.goto(origin+'#longform-airship-agreements-note');
    assert.equal(await noJs.locator('#web-guide').isVisible(),true);
    assert.equal(await noJs.locator('#web-section-airship .web-active-note').count(),7);
    assert.equal(await noJs.locator('#web-section-airship .web-active-note').first().isVisible(),true);
    assert.equal(await noJs.locator('#book').isVisible(),false);
    await fallback.close();
    console.log('Web default, illustrations, class selection, deep links, book switch, and mobile fit passed.');
  } finally { await browser.close(); }
})().catch((error)=>{console.error(error);process.exitCode=1});
