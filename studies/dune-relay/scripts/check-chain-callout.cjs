const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const target = process.env.DUNE_TEST_URL || 'http://127.0.0.1:3101/dune-relay/?playtest=1';
const screenshot = process.env.DUNE_CHAIN_SCREENSHOT;

async function boardPosition(page, cell) {
  const box = await page.locator('canvas').first().boundingBox();
  assert.ok(box);
  return {
    x: box.x + box.width / 2 + (330 + (cell.col + .5) * 50 - 480) * box.height / 540,
    y: box.y + (45 + (cell.row + .5) * 50) * box.height / 540,
  };
}

async function run() {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  try {
    const context = await browser.newContext({ viewport: { width: 667, height: 375 }, reducedMotion: 'no-preference' });
    await context.addInitScript(() => localStorage.setItem('dune-relay-tutorials-v1:sandbox', JSON.stringify({ version: 1, seen: ['jet'] })));
    const page = await context.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(target);
    await page.getByRole('button', { name: /Enter the oasis/ }).click();
    await page.getByRole('button', { name: 'Settings', exact: true }).click();
    await page.getByRole('button', { name: 'Replay PUMP HOUSE', exact: true }).click();
    await page.getByRole('button', { name: /^Start level/ }).click();
    await page.locator('canvas[data-play-ready="true"]').waitFor({ timeout: 30000 });
    assert.equal(await page.locator('.chain-callout').count(), 0, 'no callout before a cascade');
    // This authored opening move produces four clear waves, including the first match.
    const from = await boardPosition(page, { row: 1, col: 3 });
    const to = await boardPosition(page, { row: 1, col: 4 });
    await page.mouse.move(from.x, from.y);
    await page.mouse.down();
    await page.mouse.move(to.x, to.y, { steps: 4 });
    await page.mouse.up();
    const callout = page.locator('.chain-callout');
    await page.waitForFunction(() => {
      const element = document.querySelector('.chain-callout');
      if (!element || Number(getComputedStyle(element).opacity) < .8) return false;
      element.style.animationPlayState = 'paused';
      return true;
    }, undefined, { timeout: 30000 });
    assert.equal(await callout.innerText(), 'NICE');
    const appearance = await callout.evaluate(element => {
      const style = getComputedStyle(element), rect = element.getBoundingClientRect(), frame = element.parentElement.getBoundingClientRect();
      return { fontFamily: style.fontFamily, fontStyle: style.fontStyle, stroke: style.webkitTextStrokeWidth,
        pointerEvents: style.pointerEvents, zIndex: Number(style.zIndex), duration: style.animationDuration,
        centerX: rect.x + rect.width / 2, centerY: rect.y + rect.height / 2,
        boardX: frame.x + frame.width / 2 + 75 * frame.height / 540, boardY: frame.y + frame.height / 2 };
    });
    assert.match(appearance.fontFamily, /Archivo/);
    assert.equal(appearance.fontStyle, 'italic');
    assert.notEqual(appearance.stroke, '0px');
    assert.equal(appearance.pointerEvents, 'none');
    assert.ok(appearance.zIndex >= 20);
    assert.equal(appearance.duration, '1s');
    assert.ok(Math.abs(appearance.centerX - appearance.boardX) < 12 && Math.abs(appearance.centerY - appearance.boardY) < 12, 'callout centered on the tile grid');
    assert.equal(await page.evaluate(() => document.fonts.check('italic 900 40px Archivo')), true, 'Archivo Italic is loaded when shown');
    if (screenshot) await page.screenshot({ path: screenshot });
    await callout.evaluate(element => { element.style.animationPlayState = 'running'; });
    await callout.waitFor({ state: 'detached', timeout: 2500 });
    assert.equal(await page.locator('.chain-callout').count(), 0);
    assert.deepEqual(errors, []);
    await context.close();
    console.log('Four-wave callout appears centered in outlined Archivo Italic and clears after one second.');
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
