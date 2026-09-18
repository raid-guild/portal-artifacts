const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
  const base = (process.env.ARTIFACT_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');
  const origin = new URL(base).origin;
  const csp = fs.readFileSync(path.join(__dirname, '../../Caddyfile'), 'utf8').match(/Content-Security-Policy "([^"]+)"/)[1];
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const unexpected = [], errors = [];
    await context.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.origin !== origin || !['/jev-memory-lab/', '/__embed-test'].some(p => url.pathname.startsWith(p))) {
        unexpected.push(url.href);
        return route.abort();
      }
      if (url.pathname === '/__embed-test') {
        return route.fulfill({ contentType: 'text/html', body: '<iframe title="demo" sandbox="allow-scripts" src="/jev-memory-lab/?demo=0" style="width:100%;height:800px"></iframe>' });
      }
      const response = await route.fetch();
      await route.fulfill({ response, headers: { ...response.headers(), 'content-security-policy': csp } });
    });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base + '/jev-memory-lab/');
    assert.equal(await page.locator('#film').isVisible(), true);
    await page.locator('#film-pause').click();
    const paused = await page.locator('#processed').innerText();
    await page.waitForTimeout(350);
    assert.equal(await page.locator('#processed').innerText(), paused);
    await page.locator('#film-pause').click();
    await page.waitForFunction(() => document.getElementById('stream-state').textContent === 'COMPLETE', { timeout: 22000 });
    for (const [id, value] of Object.entries({ processed: '85 / 85', retained: '60', withheld: '25', owners: '28' })) {
      assert.equal(await page.locator('#' + id).innerText(), value);
    }
    await page.locator('#film-restart').click();
    assert.equal(await page.locator('#processed').innerText(), '0 / 85');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#film').isVisible(), false);
    await page.selectOption('#filter', 'all');
    assert.equal(await page.locator('.case').count(), 85);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('#play-video').click();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.goto(base + '/__embed-test');
    const frame = page.frameLocator('iframe');
    await frame.locator('#play-video').click();
    assert.equal(await frame.locator('#film').isVisible(), true);
    await frame.locator('#film-pause').click();
    assert.deepEqual(unexpected, []);
    assert.deepEqual(errors, []);
    console.log('PASS: full batch, exact totals, pause, restart, close, 85 explorer cases, mobile, sandboxed iframe, current CSP, no external requests or JS errors.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
