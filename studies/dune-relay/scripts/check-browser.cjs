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
const { LEVELS } = require('../src/game/levels.ts');

const baseUrl = process.env.DUNE_TEST_URL || 'http://127.0.0.1:3000/';
const chrome = process.env.CHROMIUM_EXECUTABLE || (fs.existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined);
const results = path.resolve(process.env.DUNE_TEST_RESULTS_DIR || 'test-results');
fs.mkdirSync(results, { recursive: true });
const args = ['--no-sandbox', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader'];
const url = (playtest = false) => { const target = new URL(baseUrl); if (playtest) target.searchParams.set('playtest', '1'); return target.href; };

async function boardPosition(page, cell) {
  const box = await page.locator('canvas').first().boundingBox();
  assert(box, 'Phaser canvas has a box');
  return { x: box.x + (330 + (cell.col + .5) * 50) * box.width / 960,
    y: box.y + (45 + (cell.row + .5) * 50) * box.height / 540 };
}
async function tapMap(page, x, y) {
  const box = await page.locator('canvas').first().boundingBox();
  await page.mouse.click(box.x + x / 960 * box.width, box.y + y / 540 * box.height);
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
      if (await page.locator('[data-moves="24"]').count()) break;
      await tapMap(page, x, y);
      await page.waitForTimeout(450);
    }
    await page.locator('[data-moves="24"]').waitFor();
    // The save-mode scene has no playtest archive. Wait until its intro banner
    // completes so a move cannot be lost while Phaser is still busy.
    await page.waitForTimeout(8000);
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
    const save = await page.evaluate(() => JSON.parse(localStorage.getItem('dune-relay-campaign-v4')));
    assert.equal(save.coins, expected, 'reward awarded exactly once');
    assert.equal(save.completed.filter(id => id === 'pumpHouse').length, 1, 'level completion saved once');
    assert.equal((await page.locator('.coin-pill').innerText()).replace(/\D/g, ''), String(expected));
    await page.waitForTimeout(300);
    assert.equal(await page.locator('canvas').first().getAttribute('data-reveal-phase'), 'complete', 'no late finale phase');
    await page.locator('.result-overlay').evaluate(element => { element.style.visibility = 'hidden'; });
    const box = await page.locator('canvas').first().boundingBox();
    const board = await page.screenshot({ clip: {
      x: box.x + 330 / 960 * box.width, y: box.y + 45 / 540 * box.height,
      width: 450 / 960 * box.width, height: 450 / 540 * box.height,
    } });
    await page.locator('.result-overlay').evaluate(element => { element.style.visibility = ''; });
    await page.getByRole('button', { name: /Follow the water/ }).click();
    await page.locator('.awning-wipe').waitFor({ state: 'detached' });
    await page.reload();
    await page.getByRole('button', { name: /Enter the oasis/ }).waitFor();
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('dune-relay-campaign-v4')).coins), expected, 'reward remains single after reload');
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
    await page.evaluate(() => { window.__oldGameCanvas = document.querySelector('canvas'); });
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

(async () => {
  const browser = await chromium.launch({ executablePath: chrome, args });
  try {
    const scope = process.env.DUNE_TEST_SCOPE || 'all';
    if (scope === 'all' || scope === 'input') await checkInput(browser);
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
    console.log('Browser checks passed');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
