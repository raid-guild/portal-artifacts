const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const url = process.env.DUNE_TEST_URL || 'http://127.0.0.1:3186/?playtest=1';
const chrome = process.env.CHROMIUM_EXECUTABLE || '/usr/bin/google-chrome';

async function position(page, cell) {
  const box = await page.locator('canvas').boundingBox();
  assert(box, 'puzzle canvas is visible');
  return {
    x: box.x + box.width / 2 + (330 + (cell.col + .5) * 50 - 480) * box.height / 540,
    y: box.y + (45 + (cell.row + .5) * 50) * box.height / 540,
  };
}
async function touchSwipe(page, from, to) {
  const session = await page.context().newCDPSession(page);
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: from.x, y: from.y, id: 1 }] });
  await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: to.x, y: to.y, id: 1 }] });
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await session.detach();
}
async function snapshot(page) {
  return page.evaluate(() => Object.fromEntries(['dune-relay-campaign-v5', 'dune-relay-playtest-wallet-v1', 'dune-relay-playtest-v1', 'dune-relay-campaign-stats-guest-v1'].map(key => [key, localStorage.getItem(key)])));
}

(async () => {
  const browser = await chromium.launch({ executablePath: chrome, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  try {
    const page = await browser.newPage({ viewport: { width: 667, height: 375 }, hasTouch: true, isMobile: true });
    await page.addInitScript(() => localStorage.setItem('dune-relay-tutorials-v1:sandbox', JSON.stringify({ version: 1, seen: ['jet'] })));
    const errors = [], writes = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('crash', () => errors.push('Chrome page crashed'));
    browser.on('disconnected', () => errors.push('Chrome browser disconnected'));
    page.on('request', request => { if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method()) && /(?:\/api\/|\/leaderboard-api\/dune-relay)/.test(request.url())) writes.push(`${request.method()} ${request.url()}`); });
    await page.goto(url);
    await page.getByRole('button', { name: /Enter the oasis/ }).click();
    await page.locator('.awning-wipe').waitFor({ state: 'detached', timeout: 30000 });
    const before = await snapshot(page);
    async function enterRiver() {
      await page.getByRole('button', { name: 'Settings' }).click();
      await page.getByRole('button', { name: 'Preview River currents' }).click();
      await page.getByRole('dialog', { name: 'River current preview' }).getByRole('button', { name: /Try the current/ }).click();
      await page.locator('canvas[data-play-ready="true"][data-current-cells="8"]').waitFor({ timeout: 30000 });
      await page.locator('.awning-wipe').waitFor({ state: 'detached', timeout: 30000 });
      assert.equal(await page.locator('canvas').count(), 1, 'one Phaser canvas');
      assert.match(await page.locator('.level-pill').innerText(), /7\.1.*PREVIEW/);
    }
    await enterRiver();
    await page.getByRole('button', { name: 'Settings' }).click();
    assert.equal(await page.getByRole('button', { name: /^Replay PUMP HOUSE$/ }).count(), 0, 'campaign navigation is hidden during the preview');
    await page.getByRole('button', { name: 'Close' }).click();
    await touchSwipe(page, await position(page, { row: 2, col: 4 }), await position(page, { row: 2, col: 5 }));
    await page.locator('canvas[data-current-steps="1"][data-water-remaining="21"]').waitFor({ timeout: 30000 });
    assert.equal(await page.locator('.frame').getAttribute('data-moves'), '25');
    await page.getByRole('button', { name: 'Settings' }).click();
    await page.getByRole('button', { name: 'Retry River Bend' }).click();
    await page.locator('.frame[data-moves="26"]').waitFor({ timeout: 30000 });
    await page.locator('canvas[data-play-ready="true"][data-current-cells="8"]').waitFor({ timeout: 30000 });
    await page.locator('.awning-wipe').waitFor({ state: 'detached', timeout: 30000 });
    assert.equal(await page.locator('canvas').count(), 1, 'retry keeps one Phaser canvas');
    assert.equal(await page.locator('.frame').getAttribute('data-moves'), '26');
    await page.getByRole('button', { name: 'Settings' }).click();
    await page.getByRole('button', { name: /Return to story/ }).click();
    await page.locator('.frame[data-mode="map"] canvas').waitFor({ timeout: 30000 });
    await page.locator('.awning-wipe').waitFor({ state: 'detached', timeout: 30000 });
    assert.equal(await page.locator('canvas').count(), 1, 'return keeps one Phaser canvas');
    assert.deepEqual(await snapshot(page), before, 'River preview leaves save, wallet, and stats untouched');
    assert.deepEqual(writes, [], 'River preview sends no cloud mutation');
    await page.getByRole('button', { name: 'Settings' }).click();
    await page.getByRole('button', { name: 'Replay PUMP HOUSE', exact: true }).click();
    await page.getByRole('button', { name: /^Start level/ }).click();
    await page.locator('canvas[data-play-ready="true"]:not([data-current-cells])').waitFor({ timeout: 30000 });
    await page.locator('.awning-wipe').waitFor({ state: 'detached', timeout: 30000 });
    assert.equal(await page.locator('canvas').count(), 1, 'normal campaign preview mounts one canvas');
    assert.equal(await page.locator('canvas').getAttribute('data-current-cells'), null, 'normal level has no current');
    assert.doesNotMatch(await page.locator('.level-pill').innerText(), /PREVIEW/);
    await page.getByRole('button', { name: 'Settings' }).click();
    assert.equal(await page.getByRole('button', { name: 'Preview River currents' }).count(), 0, 'River entry is absent on an active campaign board');
    assert.deepEqual(errors, [], 'no page exceptions');
    console.log('River preview touch, current, retry, return, and normal replay passed without save or cloud mutation.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
