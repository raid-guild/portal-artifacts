const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const url = process.env.DUNE_TEST_URL || 'http://127.0.0.1:3102/dune-relay/';
const chapterThree = require('../../../services/leaderboards/src/dune-content.json').levels.slice(0, 30).map(level => level.id);

async function main() {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_EXECUTABLE || '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  try {
    for (const query of ['?playtest=1', '?playtest=1&playtest=0', '?x=playtest=1']) {
      const context = await browser.newContext({ viewport: { width: 1100, height: 650 }, reducedMotion: 'reduce' });
      await context.addInitScript(() => {
        localStorage.setItem('dune-relay-playtest-wallet-v1', JSON.stringify({ version: 1, coins: 9999 }));
        localStorage.setItem('dune-relay-playtest-v1', JSON.stringify({ schema: 1, attempts: [] }));
      });
      const page = await context.newPage();
      const errors = []; page.on('pageerror', error => errors.push(error.message));
      await page.goto(new URL(query, url).href);
      await page.locator('.coin-pill').waitFor();
      assert.match(await page.locator('.cloud-pill').innerText(), /Guest/);
      assert.match(await page.locator('.coin-pill').innerText(), /^0$/);
      assert.equal(await page.getByRole('button', { name: /Playtest levels/ }).count(), 0);
      await page.getByRole('button', { name: /Enter the oasis/ }).click();
      await page.locator('.awning-wipe').waitFor({ state: 'detached' });
      await page.getByRole('button', { name: 'Settings' }).click();
      assert.equal(await page.getByRole('button', { name: /Replay |Preview |Restart sequence|Return to campaign/ }).count(), 0);
      assert.equal(await page.locator('.farmland-entry').count(), 0);
      assert.equal(await page.getByRole('button', { name: /Export level stats \(JSON\)/ }).count(), 1);
      assert.deepEqual(errors, []);
      await context.close();
    }

    const context = await browser.newContext({ viewport: { width: 1100, height: 650 }, reducedMotion: 'reduce' });
    await context.addInitScript(completed => {
      localStorage.setItem('dune-relay-campaign-v5', JSON.stringify({
        version: 5, completed, coins: 444, region: 'gatehouse', companions: ['keeper','wayfinder','gatewright'],
        oasisTransition: 'ready', transition: null, gatehouseReady: true, farmlandReady: false, demoEnding: 'done', farmlandEnding: 'locked',
      }));
      localStorage.setItem('dune-relay-playtest-wallet-v1', JSON.stringify({ version: 1, coins: 9999 }));
    }, chapterThree);
    const page = await context.newPage();
    await page.goto(new URL('?playtest=1', url).href);
    assert.match(await page.locator('.coin-pill').innerText(), /^444$/);
    assert.equal(await page.locator('.farmland-entry').count(), 0);
    await page.getByRole('button', { name: /Enter the gatehouse/ }).click();
    await page.getByRole('button', { name: /Kingdom Map/ }).click();
    await page.getByRole('button', { name: /FARMLAND.*locked/ }).click();
    await page.getByRole('link', { name: /Sign in to unlock Farmland/ }).waitFor();
    assert.equal(await page.getByRole('button', { name: /Preview Farmland/ }).count(), 0);
    await context.close();
    console.log('Public artifact keeps sandbox disabled, campaign stats available, and Farmland access on the locked kingdom map.');
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
