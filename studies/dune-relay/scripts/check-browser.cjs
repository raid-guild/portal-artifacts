/** Browser interaction regression suite. Run against `npm run dev` or a static artifact URL. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const Module = require('node:module');
const { chromium } = require('playwright');
Module._extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, filename);
const { createPuzzle, playTurn, isSpecial, coinReward } = require('../src/game/core.ts');
const { LEVELS, LEVEL_ORDER } = require('../src/game/levels.ts');

const baseUrl = process.env.DUNE_TEST_URL || 'http://127.0.0.1:3000/';
const chrome = process.env.CHROMIUM_EXECUTABLE || (fs.existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined);
const results = path.resolve(process.env.DUNE_TEST_RESULTS_DIR || 'test-results');
fs.mkdirSync(results, { recursive: true });
const args = ['--no-sandbox', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader'];
const url = (playtest = false) => { const target = new URL(baseUrl); if (playtest) target.searchParams.set('playtest', '1'); return target.href; };

async function boardPosition(page, cell) {
  const box = await page.locator('canvas').first().boundingBox();
  assert(box, 'Phaser canvas has a box');
  return { x: box.x + box.width / 2 + (330 + (cell.col + .5) * 50 - 480) * box.height / 540,
    y: box.y + (45 + (cell.row + .5) * 50) * box.height / 540 };
}
async function tapMap(page, x, y) {
  const box = await page.locator('canvas').first().boundingBox();
  const scale = box.width / 960, top = 540 - box.height / scale;
  await page.mouse.click(box.x + x * scale, box.y + (y - top) * scale);
}
async function move(page, from, to) {
  const a = await boardPosition(page, from), b = await boardPosition(page, to);
  if (from.row === to.row && from.col === to.col) {
    await page.mouse.click(a.x, a.y); await page.mouse.click(a.x, a.y);
  } else {
    await page.mouse.move(a.x, a.y); await page.mouse.down();
    await page.mouse.move(b.x, b.y, { steps: 4 }); await page.mouse.up();
  }
}
async function flick(page, cdp, from, to, overshoot = 1) {
  const a = await boardPosition(page, from), b = await boardPosition(page, to);
  const end = { x: a.x + (b.x - a.x) * overshoot, y: a.y + (b.y - a.y) * overshoot };
  const time = Date.now() / 1000;
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...a, id: 1 }], timestamp: time });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ ...end, id: 1 }], timestamp: time + .006 });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [], timestamp: time + .012 });
}
async function openIntro(page) {
  await page.goto(url());
  await page.getByRole('button', { name: /Enter the oasis/ }).click();
  await page.locator('.awning-wipe').waitFor({ state: 'detached' });
}
async function waitForNewAttempt(page, previous) {
  await page.waitForFunction(old => {
    const attempts = JSON.parse(localStorage.getItem('dune-relay-playtest-v1') || '{"attempts":[]}').attempts;
    const latest = attempts.at(-1);
    return latest && latest.id !== old && latest.outcome === 'playing' && latest.levelId === 'pumpHouse';
  }, previous, { timeout: 30000 });
}
async function checkInput(browser) {
  const desktop = await browser.newContext({ viewport: { width: 1100, height: 650 }, reducedMotion: 'reduce' });
  const desktopPage = await desktop.newPage();
  await openIntro(desktopPage);
  assert.equal(await desktopPage.evaluate(() => Boolean(document.fullscreenElement)), false, 'desktop remains windowed');
  await desktop.close();

  const context = await browser.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const cdp = await context.newCDPSession(page);
  try {
    await page.goto(url(true));
    await page.getByRole('button', { name: /Enter the oasis/ }).click();
    await page.locator('.awning-wipe').waitFor({ state: 'detached' });
    async function replay() {
      const old = await page.evaluate(() => (JSON.parse(localStorage.getItem('dune-relay-playtest-v1') || '{"attempts":[]}').attempts.at(-1)?.id || null));
      await page.getByRole('button', { name: 'Settings' }).click();
      await page.getByRole('button', { name: 'Replay PUMP HOUSE', exact: true }).click();
      await page.getByRole('button', { name: /Start level/ }).click();
      await waitForNewAttempt(page, old);
      await page.locator('[data-moves="24"]').waitFor();
      return createPuzzle(LEVELS.pumpHouse);
    }
    let puzzle = await replay();
    let [a, b] = puzzle.opening;
    await flick(page, cdp, a, b);
    await page.locator('[data-moves="23"]').waitFor({ timeout: 30000 });
    console.log('Quick horizontal swipe passed');
    puzzle = await replay(); [a, b] = puzzle.opening;
    await flick(page, cdp, b, a);
    await page.locator('[data-moves="23"]').waitFor({ timeout: 30000 });
    console.log('Reverse horizontal swipe passed');
    puzzle = await replay();
    let vertical;
    for (let row = 0; row < 8 && !vertical; row++) for (let col = 0; col < 9 && !vertical; col++) {
      const from = { row, col }, to = { row: row + 1, col };
      if (playTurn(puzzle, from, to).valid) vertical = [from, to];
    }
    assert(vertical, 'there is a valid vertical move');
    await flick(page, cdp, ...vertical);
    await page.locator('[data-moves="23"]').waitFor({ timeout: 30000 });
    console.log('Quick vertical swipe passed');
    puzzle = await replay(); [a, b] = puzzle.opening;
    await flick(page, cdp, a, b, 2.2);
    await page.locator('[data-moves="23"]').waitFor({ timeout: 30000 });
    console.log('Overshoot swipe passed');
    puzzle = await replay(); [a, b] = puzzle.opening;
    let start = await boardPosition(page, a), time = Date.now() / 1000;
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...start, id: 1 }], timestamp: time });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [], timestamp: time + .006 });
    await flick(page, cdp, a, b);
    await page.locator('[data-moves="23"]').waitFor({ timeout: 30000 });
    console.log('Pointer cancellation recovery passed');
    puzzle = await replay(); [a, b] = puzzle.opening;
    await page.evaluate(() => {
      window.__capturedPointer = null;
      document.querySelector('canvas').addEventListener('pointerdown', event => { window.__capturedPointer = event.pointerId; }, { once: true });
    });
    start = await boardPosition(page, a); time = Date.now() / 1000;
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...start, id: 1 }], timestamp: time });
    await page.waitForFunction(() => window.__capturedPointer !== null);
    await page.evaluate(() => document.querySelector('canvas').releasePointerCapture(window.__capturedPointer));
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [], timestamp: time + .006 });
    await flick(page, cdp, a, b);
    await page.locator('[data-moves="23"]').waitFor({ timeout: 30000 });
    console.log('Pointer capture loss recovery passed');
    puzzle = await replay(); [a, b] = puzzle.opening;
    const pa = await boardPosition(page, a), pb = await boardPosition(page, b);
    await page.touchscreen.tap(pa.x, pa.y);
    assert.equal(await page.locator('.frame').getAttribute('data-moves'), '24', 'first tap selects');
    await page.touchscreen.tap(pb.x, pb.y);
    await page.locator('[data-moves="23"]').waitFor({ timeout: 30000 });
    const turn = playTurn(puzzle, a, b);
    let power;
    for (let row = 0; row < 9; row++) for (let col = 0; col < 9; col++) if (isSpecial(turn.state.board[row][col])) power = { row, col };
    assert(power, 'opening creates a power');
    const pp = await boardPosition(page, power);
    await page.touchscreen.tap(pp.x, pp.y);
    await page.touchscreen.tap(pp.x, pp.y);
    await page.locator('[data-moves="22"]').waitFor({ timeout: 30000 });
    console.log('Tap-select and double-tap power passed');
    const supported = await page.evaluate(() => document.fullscreenEnabled && Boolean(document.documentElement.requestFullscreen));
    if (supported) {
      await page.evaluate(async () => { if (document.fullscreenElement) await document.exitFullscreen(); });
      const button = page.getByRole('button', { name: /Full screen/i });
      await button.waitFor();
      const before = await page.locator('.frame').getAttribute('data-moves');
      await button.click();
      await page.waitForFunction(() => Boolean(document.fullscreenElement));
      assert.equal(await page.locator('.frame').getAttribute('data-moves'), before);
      await page.evaluate(() => document.exitFullscreen());
      await button.waitFor();
      await page.getByRole('button', { name: 'Settings' }).click();
      await button.click();
      await page.waitForFunction(() => Boolean(document.fullscreenElement));
      assert.equal(await page.locator('.frame').getAttribute('data-moves'), before);
      console.log('Fullscreen exit/reentry with overlay passed');
    }
    assert.deepEqual(errors, [], 'no browser errors during input test');
  } catch (error) {
    await page.screenshot({ path: path.join(results, 'input-failed.png') }).catch(() => {});
    throw error;
  } finally { await context.close(); }
}

async function checkFarmland(browser) {
  const context = await browser.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  try {
    await page.goto(url(true));
    await page.getByRole('button', { name: /Enter the oasis/ }).click();
    await page.locator('.awning-wipe').waitFor({ state: 'detached' });
    await page.getByRole('button', { name: 'Settings' }).click();
    await page.getByRole('button', { name: 'Replay SEED STORE', exact: true }).click();
    await page.getByRole('button', { name: /Start level/ }).click();
    await page.locator('[data-moves="28"]').waitFor({ timeout: 30000 });
    await page.locator('canvas[data-play-ready="true"]').waitFor({ timeout: 30000 });
    assert.equal(await page.locator('.demo-ending').count(), 0, 'Farmland replay does not show the demo ending over the board');
    const puzzle = createPuzzle(LEVELS.seedStore);
    assert(puzzle.opening, 'Seed Store has a guided opening');
    const first = playTurn(puzzle, ...puzzle.opening);
    assert(first.valid && first.stats.seedpodHits > 0, 'guided opening cracks a pod');
    await move(page, ...puzzle.opening);
    await page.locator('[data-moves="27"]').waitFor({ timeout: 30000 });
    await page.waitForFunction(() => {
      const moves = JSON.parse(localStorage.getItem('dune-relay-playtest-v1') || '{"attempts":[]}').attempts.at(-1)?.moves;
      return moves?.length === 1 && moves[0].seedpodHits > 0;
    }, { timeout: 30000 });
    assert.equal(await page.locator('.demo-ending').count(), 0, 'no demo ending appears after the pod hit');
    await page.screenshot({ path: path.join(results, 'farmland-seed-store-mobile.png') });
    await page.getByRole('button', { name: 'Settings' }).click();
    await page.getByRole('button', { name: /Return to story/ }).click();
    await page.locator('.awning-wipe').waitFor({ state: 'detached' });
    await page.locator('[data-mode="map"]').waitFor();
    assert.deepEqual(errors, [], 'no browser errors in Farmland entry, move, and exit');
    console.log('Farmland mobile entry, pod hit, stats, and story exit passed');
  } catch (error) {
    await page.screenshot({ path: path.join(results, 'farmland-failed.png') }).catch(() => {});
    throw error;
  } finally { await context.close(); }
}

async function checkPortalFarmland(browser) {
  const context = await browser.newContext({ viewport: { width: 1100, height: 650 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [], checkpoints = [];
  page.on('pageerror', error => errors.push(error.message));
  let grant = false;
  let profile = { revision: 7, imported: true, campaign: {
    version: 5, completed: LEVEL_ORDER.slice(0, 30), coins: 600, region: 'gatehouse',
    companions: ['keeper', 'wayfinder', 'gatewright'], oasisTransition: 'ready', transition: null,
    gatehouseReady: true, farmlandReady: false, demoEnding: 'thanks',
  } };
  await page.route('**/leaderboard-api/dune-relay/**', async route => {
    const request = route.request(), path = new URL(request.url()).pathname, body = request.method() === 'POST' ? request.postDataJSON() : null;
    let result;
    if (path.endsWith('/session')) result = { accountId: '42', displayName: 'Farmer', contentVersion: 'chapter-4-1' };
    else if (path.endsWith('/campaign') && request.method() === 'GET') result = { accountId: '42', hasCampaign: true, profile };
    else if (path.endsWith('/entitlements')) result = { accountId: '42', farmland: { eligible: true, unlocked: grant, unlockedAt: grant ? '2026-11-20T12:00:00.000Z' : null } };
    else if (path.endsWith('/entitlements/farmland/claim')) { grant = true; result = { accountId: '42', farmland: { eligible: true, unlocked: true, unlockedAt: '2026-11-20T12:00:00.000Z' } }; }
    else if (path.endsWith('/campaign/checkpoint')) {
      checkpoints.push({ ending: body.campaign.demoEnding, stage: body.campaign.transition?.stage ?? (body.campaign.farmlandReady ? 'ready' : null) });
      if (body.expectedRevision !== profile.revision) return route.fulfill({ status: 409, contentType: 'application/json', body: '{"message":"Stale revision"}' });
      profile = { ...profile, revision: profile.revision + 1, campaign: body.campaign };
      result = { profile };
    } else if (path.endsWith('/attempts') && request.method() === 'POST') result = { profile };
    else if (path.endsWith('/activate')) result = { profile, status: 'active' };
    else result = { ready: true };
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(result) });
  });
  try {
    await page.goto(url());
    await page.getByRole('button', { name: /Enter the gatehouse/ }).click();
    await page.getByRole('button', { name: /Unlock Farmland/ }).click();
    await page.getByRole('button', { name: /Travel to Farmland/ }).click();
    await page.getByRole('button', { name: /Open the kingdom map/ }).click();
    await page.getByRole('button', { name: /Cross into Farmland/ }).click();
    await page.locator('[data-mode="map"]').waitFor({ timeout: 30000 });
    await page.locator('.awning-wipe').waitFor({ state: 'detached' });
    await tapMap(page, 540, 389);
    await page.getByRole('button', { name: /Open the seed store/ }).click();
    await page.getByRole('button', { name: /Start level/ }).click();
    await page.locator('canvas[data-play-ready="true"]').waitFor({ timeout: 30000 });
    assert.deepEqual(checkpoints.map(item => item.stage), [null, 'handoff', 'atlas', 'arrival', 'ready'], 'Portal story checkpoints keep demo acknowledgment separate and enter Farmland in order');
    assert.equal(profile.campaign.farmlandReady, true);
    assert.equal(await page.locator('.demo-ending').count(), 0);
    assert.deepEqual(errors, [], 'no browser errors in Portal Farmland handoff');
    console.log('Portal Farmland claim, travel checkpoints, and first level passed');
  } catch (error) {
    await page.screenshot({ path: path.join(results, 'portal-farmland-failed.png') }).catch(() => {});
    throw error;
  } finally { await context.close(); }
}

function bestMove(puzzle) {
  let best, score = -Infinity;
  for (let row = 0; row < 9; row++) for (let col = 0; col < 9; col++) {
    const from = { row, col };
    for (const to of [{ row, col: col + 1 }, { row: row + 1, col }, ...(isSpecial(puzzle.board[row][col]) ? [from] : [])]) {
      if (to.row >= 9 || to.col >= 9) continue;
      const turn = playTurn(puzzle, from, to);
      if (!turn.valid) continue;
      const value = Object.keys(puzzle.goals).reduce((sum, kind) => sum + puzzle.goals[kind] - (turn.state.goals[kind] || 0), 0) + 2 * turn.powersCreated.length + 2 * turn.keeperJets.length;
      if (value > score) { score = value; best = { from, to, turn }; }
    }
  }
  assert(best, 'a legal move is available');
  return best;
}
async function armPhaseSkip(page, phase) {
  await page.evaluate(target => {
    window.__phaseResult = null;
    const check = () => {
      const canvas = document.querySelector('canvas');
      const button = [...document.querySelectorAll('button')].find(item => /Skip reveal/i.test(item.textContent || ''));
      if (canvas?.dataset.revealPhase === target && button) {
        window.__phaseResult = target;
        button.click(); button.click();
        observer.disconnect();
      }
    };
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, childList: true, subtree: true, attributeFilter: ['data-reveal-phase'] });
    check();
  }, phase);
}
async function checkRevealCase(browser, phase) {
  const context = await browser.newContext({ viewport: { width: 1100, height: 650 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const label = phase || 'normal';
  try {
    await page.addInitScript(() => {
      if (!localStorage.getItem('dune-relay-campaign-v4')) localStorage.setItem('dune-relay-campaign-v4', JSON.stringify({
        version: 4, completed: [], coins: 600, region: 'oasis', companions: [], oasisTransition: 'locked', transition: null, gatehouseReady: false,
      }));
    });
    await openIntro(page);
    await tapMap(page, 447, 375);
    await page.getByRole('button', { name: /Let's do it/ }).click();
    await page.locator('.awning-wipe').waitFor({ state: 'visible', timeout: 2000 }).catch(() => {});
    await page.locator('.awning-wipe').waitFor({ state: 'detached' });
    // The walkable map can take a frame after its awning transition to accept
    // input. Try the marker and its visible label before treating it as stuck.
    for (const [x, y] of [[756, 289], [730, 310], [756, 356]]) {
      if (await page.locator('.booster-shop').count()) break;
      await tapMap(page, x, y);
      await page.waitForTimeout(450);
    }
    await page.locator('.booster-shop').waitFor();
    await page.getByRole('button', { name: /Start level/ }).click();
    await page.locator('[data-moves="24"]').waitFor();
    // Wait for the goal banner to release input; fixed sleeps race on SwiftShader.
    await page.locator('canvas[data-play-ready="true"]').waitFor({ timeout: 30000 });
    let puzzle = createPuzzle(LEVELS.pumpHouse);
    let first = true;
    while (puzzle.status === 'playing') {
      const chosen = first && puzzle.opening ? { from: puzzle.opening[0], to: puzzle.opening[1], turn: playTurn(puzzle, ...puzzle.opening) } : bestMove(puzzle);
      first = false;
      if (chosen.turn.state.status === 'won') {
        await page.getByRole('button', { name: 'Settings' }).click();
        await page.getByRole('button', { name: /Reduced motion/ }).click();
        await page.getByRole('button', { name: 'Close', exact: true }).click();
        if (phase) await armPhaseSkip(page, phase);
      }
      await move(page, chosen.from, chosen.to);
      puzzle = chosen.turn.state;
      await page.locator(`[data-moves="${puzzle.moves}"]`).waitFor({ timeout: 30000 });
    }
    await page.locator('.result-card').waitFor({ timeout: 60000 });
    if (phase) assert.equal(await page.evaluate(() => window.__phaseResult), phase, `Skip fired in ${phase} phase`);
    const expected = 600 + coinReward(puzzle.moves);
    const save = await page.evaluate(() => JSON.parse(localStorage.getItem('dune-relay-campaign-v5')));
    assert.equal(save.coins, expected, 'reward awarded exactly once');
    assert.equal(save.completed.filter(id => id === 'pumpHouse').length, 1, 'level completion saved once');
    assert.equal((await page.locator('.coin-pill').innerText()).replace(/\D/g, ''), String(expected));
    await page.waitForTimeout(300);
    assert.equal(await page.locator('canvas').first().getAttribute('data-reveal-phase'), 'complete', 'no late finale phase');
    await page.locator('.result-overlay').evaluate(element => { element.style.visibility = 'hidden'; });
    const box = await page.locator('canvas').first().boundingBox();
    const board = await page.screenshot({ clip: {
      x: box.x + box.width / 2 + (330 - 480) * box.height / 540, y: box.y + 45 / 540 * box.height,
      width: 450 / 540 * box.height, height: 450 / 540 * box.height,
    } });
    await page.locator('.result-overlay').evaluate(element => { element.style.visibility = ''; });
    await page.getByRole('button', { name: /Follow the water/ }).click();
    await page.locator('.awning-wipe').waitFor({ state: 'detached' });
    await page.reload();
    await page.getByRole('button', { name: /Enter the oasis/ }).waitFor();
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('dune-relay-campaign-v5')).coins), expected, 'reward remains single after reload');
    assert.deepEqual(errors, [], 'no browser errors during reveal');
    console.log(`Reveal ${label} passed: ${expected} coins`);
    return { label, coins: expected, board };
  } catch (error) {
    await page.screenshot({ path: path.join(results, `reveal-${label}-failed.png`) }).catch(() => {});
    throw error;
  } finally { await context.close(); }
}

async function checkLifecycle(browser) {
  const context = await browser.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  try {
    await page.goto(url(true));
    await page.getByRole('button', { name: /Enter the oasis/ }).click();
    await page.locator('.awning-wipe').waitFor({ state: 'detached' });
    await page.waitForFunction(() => document.querySelector('canvas')?.width > 0);
    const pixels = await page.locator('canvas').first().evaluate(canvas => canvas.width * canvas.height);
    assert(pixels <= 2_000_000, `mobile DPR3 backing buffer capped: ${pixels}`);
    await page.evaluate(() => {
      window.__oldGameCanvas = document.querySelector('canvas');
      window.__oldGameGl = window.__oldGameCanvas.getContext('webgl') || window.__oldGameCanvas.getContext('webgl2');
      window.__canReleaseGl = Boolean(window.__oldGameGl?.getExtension('WEBGL_lose_context'));
    });
    await page.getByRole('button', { name: 'Settings' }).click();
    await page.getByRole('button', { name: /Preview desert → gatehouse transition/ }).click();
    await page.locator('.film-screen').waitFor({ timeout: 30000 });
    await page.waitForFunction(() => document.querySelector('video')?.currentSrc && !document.querySelector('canvas'), { timeout: 30000 });
    const entries = await page.evaluate(() => JSON.parse(localStorage.getItem('dune-relay-diagnostics-v1') || '[]'));
    const destroy = entries.findLastIndex(entry => entry.event === 'game-destroy');
    const source = entries.findLastIndex(entry => entry.event === 'film-source-attached');
    assert(destroy >= 0 && source > destroy, 'film source attaches only after Phaser destroy');
    const oldCanvasSize = await page.evaluate(() => [window.__oldGameCanvas.width, window.__oldGameCanvas.height]);
    assert.deepEqual(oldCanvasSize, [1, 1], 'detached Phaser canvas drawing buffer released before film');
    if (await page.evaluate(() => window.__canReleaseGl))
      assert.equal(await page.evaluate(() => window.__oldGameGl.isContextLost()), true, 'retained old WebGL context explicitly released before film');
    await page.locator('.awning-wipe').waitFor({ state: 'detached' });
    await page.waitForFunction(() => JSON.parse(localStorage.getItem('dune-relay-diagnostics-v1') || '[]').some(entry => entry.event === 'film-playing'));
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    assert.equal(await page.locator('video').evaluate(video => video.paused), true, 'hidden film pauses');
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.waitForFunction(() => JSON.parse(localStorage.getItem('dune-relay-diagnostics-v1') || '[]').some(entry => entry.event === 'film-resume-visible'));
    await page.getByRole('button', { name: /Skip scene/ }).click();
    await page.getByRole('button', { name: /Open the kingdom map/ }).waitFor();
    await page.waitForFunction(() => !document.querySelector('video'));
    assert.deepEqual(errors, [], 'no browser errors during film teardown');
    console.log('DPR3 canvas budget and renderer/video handoff passed');
  } catch (error) {
    await page.screenshot({ path: path.join(results, 'lifecycle-failed.png') }).catch(() => {});
    throw error;
  } finally { await context.close(); }
}

async function checkDemo(browser) {
  const context = await browser.newContext({ viewport: { width: 1100, height: 650 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  try {
    await page.addInitScript(() => { if (!localStorage.getItem('dune-relay-campaign-v5')) localStorage.setItem('dune-relay-campaign-v5', JSON.stringify({ version:5, completed:[], coins:600, region:'oasis', companions:[], oasisTransition:'locked', transition:null, gatehouseReady:false, demoEnding:'locked' })); });
    await page.goto(url());
    await page.getByRole('button', { name: /Enter the oasis/ }).click();
    await page.locator('.awning-wipe').waitFor({ state:'detached' });
    await tapMap(page,447,375);
    await page.getByRole('button', { name:/Let's do it/ }).click();
    await page.locator('.awning-wipe').waitFor({ state:'detached' });
    await tapMap(page,756,289);
    await page.getByText('PUMP HOUSE · STARTING BOOSTERS').waitFor();
    await page.getByRole('button',{name:'Cancel'}).click();
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('dune-relay-campaign-v5')).coins),600,'cancel costs nothing');
    await page.locator('.awning-wipe').waitFor({ state:'detached' });
    await tapMap(page,756,289);
    await page.getByRole('button',{name:/Water Jet/}).click();
    await page.getByRole('button',{name:/Start level/}).click();
    await page.locator('[data-moves="24"]').waitFor();
    await page.waitForFunction(() => JSON.parse(localStorage.getItem('dune-relay-campaign-v5')).coins === 300);
    await page.reload();
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('dune-relay-campaign-v5')).coins),300,'reload does not repay or refund consumed booster');
    await context.close();
    const endingContext = await browser.newContext({ viewport: { width:1100,height:650 }, reducedMotion:'reduce' });
    const endingPage = await endingContext.newPage();
    try {
      const fixture = {version:4,completed:LEVEL_ORDER,coins:777,region:'gatehouse',companions:['keeper','wayfinder','gatewright'],oasisTransition:'ready',transition:null,gatehouseReady:true};
      await endingPage.addInitScript(value => localStorage.setItem('dune-relay-campaign-v4',JSON.stringify(value)),fixture);
      await endingPage.goto(url());
      await endingPage.getByRole('button',{name:/Enter the gatehouse/}).click();
      await endingPage.locator('.film-screen').waitFor({timeout:30000});
      await endingPage.waitForFunction(() => document.querySelector('video')?.currentSrc.includes('gatehouse-crossing.mp4') && !document.querySelector('canvas'));
      assert.equal(await endingPage.evaluate(() => JSON.parse(localStorage.getItem('dune-relay-campaign-v5')).demoEnding),'film');
      await endingPage.getByRole('button',{name:/Skip scene/}).click();
      await endingPage.getByText(/Unlock Farmland, Chapter 4, as a Portal login bonus/).waitFor();
      await endingPage.reload();
      await endingPage.getByRole('button',{name:/Enter the gatehouse/}).click();
      await endingPage.getByText(/Unlock Farmland, Chapter 4, as a Portal login bonus/).waitFor();
      await endingPage.getByRole('button',{name:/Explore the kingdom/}).click();
      assert.equal(await endingPage.evaluate(() => JSON.parse(localStorage.getItem('dune-relay-campaign-v5')).demoEnding),'done');
      await endingPage.getByRole('button',{name:/Return to the path/}).click();
      await endingPage.getByRole('button',{name:'Settings'}).click();
      await endingPage.getByRole('button',{name:'Playtest levels',exact:true}).click();
      await endingPage.waitForURL(/playtest=1/);
      await endingPage.getByRole('button',{name:/Enter the oasis/}).click();
      await endingPage.getByRole('button',{name:'Settings'}).click();
      await endingPage.getByRole('button',{name:'Return to campaign'}).click();
      await endingPage.waitForURL(target => !target.searchParams.has('playtest'));
      assert.equal(await endingPage.evaluate(() => JSON.parse(localStorage.getItem('dune-relay-campaign-v5')).coins),777,'sandbox navigation preserves campaign currency');
    } finally { await endingContext.close(); }
    assert.deepEqual(errors,[],'no browser errors during demo flow');
  } finally { if (!context.pages().every(page => page.isClosed())) await context.close(); }
}

async function checkFullscreen(browser) {
  const desktop = await browser.newContext({ viewport: { width: 1100, height: 650 }, reducedMotion: 'reduce' });
  const desktopPage = await desktop.newPage();
  await openIntro(desktopPage);
  assert.equal(await desktopPage.evaluate(() => Boolean(document.fullscreenElement)), false, 'desktop entry stays windowed');
  await desktopPage.getByRole('button', { name: /Full screen/ }).click();
  await desktopPage.waitForFunction(() => Boolean(document.fullscreenElement));
  await desktop.close();

  const mobile = await browser.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const mobilePage = await mobile.newPage();
  await mobilePage.goto(url());
  await mobilePage.getByRole('button', { name: /Enter the oasis/ }).tap();
  await mobilePage.locator('.awning-wipe').waitFor({ state: 'detached' });
  await mobilePage.waitForFunction(() => Boolean(document.fullscreenElement));
  await mobilePage.evaluate(() => document.exitFullscreen());
  const returnButton = mobilePage.getByRole('button', { name: /Full screen/ });
  await returnButton.waitFor();
  await mobilePage.getByRole('button', { name: 'Settings' }).tap();
  await returnButton.tap();
  await mobilePage.waitForFunction(() => Boolean(document.fullscreenElement));
  await mobile.close();

  const fine = await browser.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const finePage = await fine.newPage();
  await finePage.addInitScript(() => {
    const original = window.matchMedia.bind(window);
    window.matchMedia = query => query === '(pointer: coarse) and (hover: none)' ? original('(pointer: fine) and (hover: hover)') : original(query);
  });
  await finePage.goto(url());
  await finePage.getByRole('button', { name: /Enter the oasis/ }).tap();
  await finePage.locator('.awning-wipe').waitFor({ state: 'detached' });
  assert.equal(await finePage.evaluate(() => Boolean(document.fullscreenElement)), false, 'fine input does not request fullscreen automatically');
  await finePage.getByRole('button', { name: /Full screen/ }).tap();
  await finePage.waitForFunction(() => Boolean(document.fullscreenElement));
  await fine.close();

  const rejected = await browser.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const rejectedPage = await rejected.newPage();
  await rejectedPage.addInitScript(() => {
    const original = Element.prototype.requestFullscreen;
    let first = true;
    Element.prototype.requestFullscreen = function (...options) {
      if (first) { first = false; return Promise.reject(new DOMException('Simulated browser rejection', 'NotAllowedError')); }
      return original.apply(this, options);
    };
  });
  await rejectedPage.goto(url());
  await rejectedPage.getByRole('button', { name: /Enter the oasis/ }).tap();
  await rejectedPage.locator('.awning-wipe').waitFor({ state: 'detached' });
  await rejectedPage.getByRole('status').getByText(/Fullscreen couldn't open/).waitFor();
  assert.equal(await rejectedPage.evaluate(() => JSON.parse(localStorage.getItem('dune-relay-diagnostics-v1')).some(entry => entry.event === 'fullscreen-failed' && entry.details.name === 'NotAllowedError')), true);
  await rejectedPage.getByRole('button', { name: /Full screen/ }).tap();
  await rejectedPage.waitForFunction(() => Boolean(document.fullscreenElement));
  await rejected.close();

  const stalled = await browser.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const stalledPage = await stalled.newPage();
  await stalledPage.addInitScript(() => {
    const original = Element.prototype.requestFullscreen;
    let first = true;
    Element.prototype.requestFullscreen = function (...options) {
      if (first) { first = false; window.__settleFirstFullscreen = () => {}; return new Promise(resolve => { window.__settleFirstFullscreen = resolve; }); }
      return original.apply(this, options);
    };
  });
  await stalledPage.goto(url());
  await stalledPage.getByRole('button', { name: /Enter the oasis/ }).tap();
  await stalledPage.locator('.awning-wipe').waitFor({ state: 'detached' });
  await stalledPage.getByRole('status').getByText(/Opening fullscreen/).waitFor();
  await stalledPage.getByRole('status').getByText(/didn't open/).waitFor({ timeout: 10_000 });
  assert.equal(await stalledPage.evaluate(() => JSON.parse(localStorage.getItem('dune-relay-diagnostics-v1')).some(entry => entry.event === 'fullscreen-timeout')), true);
  await stalledPage.getByRole('button', { name: /Full screen/ }).tap();
  await stalledPage.waitForFunction(() => Boolean(document.fullscreenElement));
  await stalledPage.evaluate(() => window.__settleFirstFullscreen());
  await stalledPage.evaluate(() => document.exitFullscreen());
  await stalledPage.getByRole('button', { name: /Full screen/ }).waitFor();
  await stalled.close();

  const falseSuccess = await browser.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const falseSuccessPage = await falseSuccess.newPage();
  await falseSuccessPage.addInitScript(() => {
    const original = Element.prototype.requestFullscreen;
    let first = true;
    Element.prototype.requestFullscreen = function (...options) {
      if (first) { first = false; return Promise.resolve(); }
      return original.apply(this, options);
    };
  });
  await falseSuccessPage.goto(url());
  await falseSuccessPage.getByRole('button', { name: /Enter the oasis/ }).tap();
  await falseSuccessPage.locator('.awning-wipe').waitFor({ state: 'detached' });
  await falseSuccessPage.getByRole('status').getByText(/didn't open/).waitFor();
  assert.equal(await falseSuccessPage.evaluate(() => Boolean(document.fullscreenElement)), false);
  await falseSuccessPage.getByRole('button', { name: /Full screen/ }).tap();
  await falseSuccessPage.waitForFunction(() => Boolean(document.fullscreenElement));
  await falseSuccess.close();

  const lateSuccess = await browser.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const latePage = await lateSuccess.newPage();
  await latePage.addInitScript(() => {
    const original = Element.prototype.requestFullscreen;
    let first = true;
    Element.prototype.requestFullscreen = function (...options) {
      if (!first) return original.apply(this, options);
      first = false;
      const entered = original.apply(this, options);
      return entered.then(() => new Promise(resolve => { window.__settleLateFullscreen = resolve; }));
    };
  });
  await latePage.goto(url());
  await latePage.getByRole('button', { name: /Enter the oasis/ }).tap();
  await latePage.waitForFunction(() => Boolean(document.fullscreenElement));
  await latePage.evaluate(() => document.exitFullscreen());
  await latePage.getByRole('button', { name: /Full screen/ }).waitFor();
  await latePage.evaluate(() => window.__settleLateFullscreen());
  await latePage.waitForTimeout(100);
  assert.equal(await latePage.getByRole('button', { name: /Full screen/ }).isVisible(), true, 'late success cannot hide the retry button after exit');
  await lateSuccess.close();
  console.log('Fullscreen desktop/manual, mobile/reentry, fine-input, and rejected-request checks passed');
}

(async () => {
  const browser = await chromium.launch({ executablePath: chrome, args });
  try {
    const scope = process.env.DUNE_TEST_SCOPE || 'all';
    if (scope === 'all' || scope === 'input') await checkInput(browser);
    if (scope === 'all' || scope === 'farmland') await checkFarmland(browser);
    if (scope === 'all' || scope === 'portal-farmland') await checkPortalFarmland(browser);
    if (scope === 'all' || scope === 'fullscreen') await checkFullscreen(browser);
    if (scope === 'all' || scope === 'reveal') {
      const phases = process.env.DUNE_TEST_PHASE ? [process.env.DUNE_TEST_PHASE === 'normal' ? null : process.env.DUNE_TEST_PHASE] : [null, 'banner', 'conversion', 'chain', 'refill'];
      let watched;
      for (const phase of phases) {
        const result = await checkRevealCase(browser, phase);
        if (!watched) watched = result;
        else {
          assert.equal(result.coins, watched.coins, `${result.label}: same reward as watched finale`);
          assert.deepEqual(result.board, watched.board, `${result.label}: same settled board image as watched finale`);
        }
      }
    }
    if (scope === 'all' || scope === 'lifecycle') await checkLifecycle(browser);
    if (scope === 'all' || scope === 'demo') await checkDemo(browser);
    console.log('Browser checks passed');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
