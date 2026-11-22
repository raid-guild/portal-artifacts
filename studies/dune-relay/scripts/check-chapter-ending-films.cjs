const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const url = process.env.DUNE_TEST_URL || 'http://127.0.0.1:3186/dune-relay/?playtest=1';

async function preview(browser, chapter, finishMode) {
  const context = await browser.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    window.__filmReleases = 0;
    const original = HTMLMediaElement.prototype.load;
    HTMLMediaElement.prototype.load = function (...args) {
      if (this.tagName === 'VIDEO' && !this.hasAttribute('src')) window.__filmReleases++;
      return original.apply(this, args);
    };
  });
  const film = chapter === 'Town' ? 'town-market-opens' : 'castle-upstream-departure';
  const expected = chapter === 'Town' ? /market is open/i : /more levels coming soon/i;
  try {
    if (finishMode === 'blocked') await page.route(`**/cinematics/${film}.mp4`, route => route.abort());
    await page.goto(url);
    await page.getByRole('button', { name: /Enter the oasis/ }).click();
    await page.locator('.awning-wipe').waitFor({ state: 'detached' });
    await page.getByRole('button', { name: 'Settings', exact: true }).click();
    await page.getByRole('button', { name: chapter === 'Town' ? 'Preview Town finale' : 'Preview Castle → upstream ending', exact: true }).click();
    await page.locator('.film-screen video[src]').waitFor({ timeout: 30000 });
    assert.equal(await page.locator('canvas').count(), 0, `${chapter}: board renderer is released during film`);
    assert.match(await page.locator('.film-screen video').getAttribute('poster'), new RegExp(`${film}-poster`));
    assert.match(await page.locator('.film-screen video').getAttribute('src'), new RegExp(`${film}\\.mp4`));
    if (finishMode === 'blocked') await page.getByRole('button', { name: /Play scene/ }).waitFor({ timeout: 30000 });
    if (finishMode === 'natural') await page.locator('.film-screen video').evaluate(video => { video.dispatchEvent(new Event('ended')); video.dispatchEvent(new Event('ended')); });
    else await page.getByRole('button', { name: /Skip scene/ }).click();
    await page.getByRole('heading', { name: expected }).waitFor();
    assert.equal(await page.locator('.film-screen').count(), 0);
    assert.ok(await page.evaluate(() => window.__filmReleases), `${chapter}: decoder source is released`);
    assert.deepEqual(errors, [], `${chapter}: no browser errors`);
  } finally { await context.close(); }
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE || '/usr/bin/google-chrome', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  try {
    await preview(browser, 'Town', 'skip');
    await preview(browser, 'Town', 'blocked');
    await preview(browser, 'Castle', 'natural');
    console.log('Town and Castle films load, release the renderer, survive blocked playback, skip or end into the correct dialogue, and release their decoder.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
