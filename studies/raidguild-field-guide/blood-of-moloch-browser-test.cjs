const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const {chromium} = require('playwright');
const output = path.resolve(__dirname, '../../public/raidguild-field-guide');
const origin = 'https://field-guide.test/raidguild-field-guide/';
const types = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.png':'image/png','.glb':'model/gltf-binary'};
async function site(context, missingModel = false) {
  await context.route('https://field-guide.test/**', async route => {
    const pathname = new URL(route.request().url()).pathname.replace(/^\/raidguild-field-guide\//, '');
    const relative = pathname || 'index.html';
    if (missingModel && relative.endsWith('.glb')) return route.fulfill({status:404, body:'Missing model'});
    const file = path.resolve(output, relative);
    if (!file.startsWith(output + path.sep)) return route.fulfill({status:404, body:'Not found'});
    try { await route.fulfill({status:200, contentType:types[path.extname(file)] || 'application/octet-stream', body:await fs.readFile(file)}); }
    catch { await route.fulfill({status:404, body:'Not found'}); }
  });
}
(async () => {
  const browser = await chromium.launch({headless:true, args:['--no-sandbox', '--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader']});
  try {
    const context = await browser.newContext({viewport:{width:1200,height:900}});
    await site(context);
    const page = await context.newPage();
    const errors=[]; page.on('pageerror', error=>errors.push(error.message));
    await page.goto(origin + '#page26');
    assert.equal(await page.locator('#page26 .brood-can-poster').evaluate(img=>img.complete && img.naturalWidth===1400), true);
    assert.equal(await page.locator('#page26 .brood-canvas canvas').count(),0);
    await page.locator('#page26 [data-brood-explore]').click();
    await page.waitForFunction(()=>document.querySelector('#page26 [data-brood-can]')?.dataset.active==='true',{timeout:12000});
    assert.equal(await page.locator('#page26 .brood-canvas canvas').count(),1);
    assert.equal(await page.locator('#page26 [data-brood-right]').isVisible(),true);
    await page.locator('#page26 [data-brood-right]').click();
    await page.locator('#page26 [data-brood-left]').click();
    await page.locator('#page26 [data-brood-reset]').click();
    await page.locator('#page26 .workbook-page-foot a').click();
    await page.waitForFunction(()=>location.hash==='#page27');
    await page.locator('#page27 .workbook-page-foot a').click();
    await page.waitForFunction(()=>location.hash==='#page28' && document.querySelector('#book-progress')?.textContent===`Spread 15 of ${document.querySelectorAll('.book-spread').length}`);
    await page.waitForFunction(()=>document.querySelectorAll('#page26 .brood-canvas canvas').length===0);
    assert.equal(await page.locator('#page26 .brood-canvas canvas').count(),0);
    assert.equal(await page.locator('#page26 .brood-can-poster').evaluate(img=>getComputedStyle(img).visibility), 'visible');
    assert.deepEqual(errors,[]);
    await context.close();
    const fallback=await browser.newContext(); await site(fallback,true);
    const failed=await fallback.newPage(); await failed.goto(origin+'#page26');
    await failed.locator('#page26 [data-brood-explore]').click();
    await failed.waitForFunction(()=>document.querySelector('#page26 .brood-model-status')?.textContent.includes('unavailable'),{timeout:12000});
    assert.equal(await failed.locator('#page26 .brood-can-poster').isVisible(),true);
    await fallback.close();
    console.log('RaidBrood can: poster, WebGL orbit controls, navigation cleanup, and fallback passed.');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1});
