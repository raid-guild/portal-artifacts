const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const Module = require('node:module');
Module._extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, filename);
const { eligibleCompanionLines, selectCompanionLine } = require('../src/game/companionDialogue.ts');

const cases = [
  ['oasis', 'pumpHouse'], ['caravan', 'caravanPennants'],
  ['gatehouse', 'gatehouseApproach'], ['farmland', 'seedStore'],
];
for (const [region, first] of cases) {
  const lines = eligibleCompanionLines(region, first);
  assert(lines.length >= 7, `${region} has a varied conversation pool`);
  assert.equal(lines.filter(line => line.kind === 'handbook').length, 3);
  assert(lines.filter(line => line.kind === 'handbook').every(line => line.source?.startsWith('https://handbook.raidguild.org/')));
  for (let visit = 1; visit < lines.length * 2; visit++) {
    assert.notEqual(selectCompanionLine(region, first, visit).id, selectCompanionLine(region, first, visit - 1).id);
  }
  assert(eligibleCompanionLines(region, null).every(line => line.kind !== 'tip'), `${region} completed chapter has no stale tips`);
}
assert(!eligibleCompanionLines('oasis', 'pumpHouse').some(line => /Prism|Flywheel/.test(line.text)), 'first lesson only mentions Jets');
assert(!eligibleCompanionLines('oasis', 'primePump').some(line => /Prism/.test(line.text)), 'second lesson does not reveal Prism');
assert(eligibleCompanionLines('oasis', 'pressureManifold').some(line => /Clear 12 reeds/.test(line.text)), 'late oasis charge target follows level');
assert(eligibleCompanionLines('farmland', 'seedStore').some(line => /Clear 12 reeds/.test(line.text)), 'farmland charge follows level');
assert(eligibleCompanionLines('caravan', 'saltSealedIntake').some(line => /salt/.test(line.text)), 'salt tip appears only where present');
assert(eligibleCompanionLines('farmland', 'seedStore').some(line => /Seedpods/.test(line.text)), 'pod tip appears where present');
assert(eligibleCompanionLines('oasis', 'caravanPennants').every(line => line.kind !== 'tip'), 'old region ignores another chapter’s pending level');
console.log('Companion dialogue checks passed.');
