const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const Module = require('node:module');
const { chromium } = require('playwright');
Module._extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, filename);
const { createPuzzle, playTurn } = require('../src/game/core.ts');
const { LEVELS } = require('../src/game/levels.ts');

const base = process.env.DUNE_TEST_URL || 'http://127.0.0.1:3000/';
const chrome = process.env.CHROMIUM_EXECUTABLE || (fs.existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined);
const results = path.resolve(process.env.DUNE_TEST_RESULTS_DIR || 'test-results');
fs.mkdirSync(results, { recursive: true });

async function replay(page, level, moves) {
  await page.goto(`${base}?playtest=1`);
  await page.getByRole('button', { name: /Enter the oasis/ }).click();
  await page.locator('.awning-wipe').waitFor({ state: 'detached' });
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByRole('button', { name: `Replay ${level}`, exact: true }).click();
  await page.getByRole('button', { name: /Start level/ }).click();
  await page.locator(`[data-moves="${moves}"]`).waitFor({ timeout: 30000 });
  await page.locator('canvas[data-play-ready="true"]').waitFor({ timeout: 30000 });
}

async function swap(page, from, to) {
  const box = await page.locator('canvas').boundingBox();
  const at = cell => ({
    x: box.x + box.width / 2 + (330 + (cell.col + .5) * 50 - 480) * box.height / 540,
    y: box.y + (45 + (cell.row + .5) * 50) * box.height / 540,
  });
  const a = at(from), b = at(to);
  await page.mouse.move(a.x, a.y);
  await page.mouse.down();
  await page.mouse.move(b.x, b.y, { steps: 4 });
  await page.mouse.up();
}

(async () => {
  const browser = await chromium.launch({ executablePath: chrome, args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, reducedMotion: 'no-preference' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await replay(page, 'PUMP HOUSE', 24);
    const puzzle = createPuzzle(LEVELS.pumpHouse);
    const turn = playTurn(puzzle, ...puzzle.opening);
    assert(turn.steps.some(step => step.collections?.length), 'opening has credited goal tiles');
    await swap(page, ...puzzle.opening);
    await page.locator('canvas[data-collection-phase="flight"]').waitFor({ timeout: 30000 });
    await page.screenshot({ path: path.join(results, 'collect-flight-desktop.png') });
    await page.locator('canvas[data-collection-phase="flight"]').waitFor({ state: 'hidden', timeout: 30000 });
    await page.locator('[data-moves="23"]').waitFor({ timeout: 30000 });
    assert.deepEqual(errors, [], 'collection flights have no browser errors');
    console.log('Non-reduced-motion collection flight and goal turn passed');
    await page.close();
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
