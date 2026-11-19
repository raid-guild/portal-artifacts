const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const Module = require('node:module');
Module._extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, filename);
const { reserveGame, enqueueGameWork, waitForGameIdle } = require('../src/game/gameLifecycle.ts');

(async () => {
  const releaseOld = reserveGame();
  let finishDestroy;
  const oldDestroy = enqueueGameWork(() => new Promise(resolve => { finishDestroy = resolve; }));
  const releaseNew = reserveGame();
  let newCreated = false;
  const nextCreate = enqueueGameWork(() => { newCreated = true; });
  await Promise.resolve();
  assert.equal(newCreated, false, 'next game waits for old asynchronous destroy');
  finishDestroy();
  await oldDestroy;
  releaseOld();
  await nextCreate;
  assert.equal(newCreated, true);
  releaseNew();
  await waitForGameIdle();

  const releaseCancelled = reserveGame();
  let cancelled = true, created = false;
  await enqueueGameWork(() => { if (!cancelled) created = true; });
  releaseCancelled();
  await waitForGameIdle();
  assert.equal(created, false, 'disposed effect does not construct queued game');

  await assert.rejects(enqueueGameWork(() => { throw new Error('scene creation failed'); }));
  assert.equal(await enqueueGameWork(() => 'next scene'), 'next scene', 'one failure does not poison lifecycle queue');
  console.log('Lifecycle queue checks passed.');
})().catch(error => { console.error(error); process.exitCode = 1; });
