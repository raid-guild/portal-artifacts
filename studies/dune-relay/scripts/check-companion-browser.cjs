const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const fs = require('node:fs');
const base = process.env.DUNE_TEST_URL || 'http://127.0.0.1:3000/';
const chrome = process.env.CHROMIUM_EXECUTABLE || (fs.existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined);

async function tapMap(page, x, y) {
  const box = await page.locator('canvas').first().boundingBox();
  assert(box, 'map canvas is visible');
  const scale = box.width / 960, top = 540 - box.height / scale;
  await page.mouse.click(box.x + x * scale, box.y + (y - top) * scale);
}
async function untilMap(page) {
  await page.locator('.awning-wipe').waitFor({ state: 'detached', timeout: 30000 });
  await page.locator('.frame[data-mode="map"] canvas').waitFor();
}
async function replayToMap(page, title) {
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByRole('button', { name: `Replay ${title}`, exact: true }).click();
  await page.getByRole('button', { name: 'Start level' }).click();
  await page.locator('canvas[data-play-ready="true"]').waitFor({ timeout: 30000 });
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByRole('button', { name: /Return to story/ }).click();
  await untilMap(page);
}
async function checkChat(page, x, y, name) {
  const before = await page.evaluate(() => ({ save: localStorage.getItem('dune-relay-campaign-v5'), wallet: localStorage.getItem('dune-relay-playtest-wallet-v1'), archive: localStorage.getItem('dune-relay-playtest-v1') }));
  await tapMap(page, x, y);
  const dialog = page.getByRole('dialog', { name: `Talk to ${name}` });
  await dialog.waitFor({ timeout: 15000 });
  const first = await dialog.locator('p').innerText();
  const source = dialog.locator('a.handbook-source');
  if (await source.count()) assert.equal(await source.getAttribute('rel'), 'noopener noreferrer');
  await dialog.getByRole('button', { name: 'Close' }).click();
  await dialog.waitFor({ state: 'detached' });
  await page.locator('canvas').waitFor();
  await tapMap(page, x, y);
  await dialog.waitFor({ timeout: 15000 });
  const second = await dialog.locator('p').innerText();
  assert.notEqual(first, second, `${name} gives another note`);
  await dialog.getByRole('button', { name: 'Close' }).click();
  await dialog.waitFor({ state: 'detached' });
  const after = await page.evaluate(() => ({ save: localStorage.getItem('dune-relay-campaign-v5'), wallet: localStorage.getItem('dune-relay-playtest-wallet-v1'), archive: localStorage.getItem('dune-relay-playtest-v1') }));
  assert.deepEqual(after, before, `${name} chat does not mutate progress, wallet, or stats`);
  return [first, second];
}

(async () => {
  const browser = await chromium.launch({ executablePath: chrome, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage({ viewport: { width: 1100, height: 650 }, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  try {
    await page.goto(new URL('?playtest=1', base).href);
    await page.getByRole('button', { name: /Enter the oasis/ }).click();
    await untilMap(page);
    await tapMap(page, 447, 370);
    await page.getByRole('button', { name: /Let's do it/ }).waitFor({ timeout: 15000 });
    await page.getByRole('button', { name: /Let's do it/ }).click();
    await untilMap(page);
    await checkChat(page, 447, 370, 'The Keeper');
    await replayToMap(page, 'WINDWARD TRAIL');
    await checkChat(page, 677, 388, 'The Wayfinder');
    await replayToMap(page, 'GATEHOUSE APPROACH');
    await checkChat(page, 520, 407, 'The Gatewright');
    await replayToMap(page, 'SEED STORE');
    await checkChat(page, 540, 390, 'The Fieldkeeper');
    await replayToMap(page, 'OPEN THE WATERWAY');
    await checkChat(page, 447, 370, 'The Keeper');
    await tapMap(page, 485, 350);
    await page.getByRole('button', { name: 'Start level' }).waitFor({ timeout: 15000 });
    assert((await page.locator('.dialog-card').innerText()).includes('OPEN THE WATERWAY'));
    await page.goto(new URL('?playtest=1', base).href);
    await page.getByRole('button', { name: /Enter the oasis/ }).click();
    await untilMap(page);
    await replayToMap(page, 'CARAVAN LAUNCH');
    await checkChat(page, 677, 420, 'The Wayfinder');
    await tapMap(page, 650, 350); // Inside both the route and Wayfinder hit zones.
    await page.getByRole('button', { name: 'Start level' }).waitFor({ timeout: 15000 });
    assert((await page.locator('.dialog-card').innerText()).includes('CARAVAN LAUNCH'));
    await page.goto(new URL('?playtest=1', base).href);
    await page.getByRole('button', { name: /Enter the oasis/ }).click();
    await untilMap(page);
    await replayToMap(page, 'WINDWARD TRAIL');
    await tapMap(page, 705, 260);
    await page.getByRole('button', { name: 'Start level' }).waitFor({ timeout: 15000 });
    assert((await page.locator('.dialog-card').innerText()).includes('WINDWARD TRAIL'), 'returning to a chapter first level opens briefing, not intro');
    assert.deepEqual(errors, [], 'no browser errors');
    console.log('All four companion chats, nonmutating close, overlapping destinations, and first-level return passed.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
