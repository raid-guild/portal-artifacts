const assert = require('node:assert/strict');
const fs = require('node:fs');
const crypto = require('node:crypto');
const ts = require('typescript');
const Module = require('node:module');
Module._extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const result = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } });
  module._compile(result.outputText, filename);
};
const { createPuzzle, playTurn, isSpecial, coinReward, legalMove, resolveFinaleRefill } = require('../src/game/core.ts');
const { LEVELS, LEVEL_ORDER, nextLevel } = require('../src/game/levels.ts');
const { completeLevel, EMPTY_SAVE, readSave, advanceTransition, advanceChapterTransition, normalizeSave } = require('../src/game/save.ts');
const { beamTravelDelay } = require('../src/game/timing.ts');
const { planFinale } = require('../src/game/finale.ts');
const oasisBaseline = require('./oasis-board-baseline.json');
const priorBoards = require('./pre-gatehouse-board-baseline.json');
const { startAttempt, appendTurn, finishAttempt, addAttempt, emptyArchive, archiveCsv, archiveJson, readArchive, PLAYTEST_KEY, MAX_ATTEMPTS } = require('../src/game/playtest.ts');
const { applyStartingBoosters, boosterCost } = require('../src/game/boosters.ts');

for (const [index, id] of LEVEL_ORDER.entries()) {
  const level = LEVELS[id];
  const puzzle = createPuzzle(level);
  if (index < 20) assert.equal(crypto.createHash('sha256').update(JSON.stringify(puzzle.board)).digest('hex'), priorBoards[id], `${id}: first twenty opening boards unchanged`);
  if (index < 11) assert.equal(crypto.createHash('sha256').update(JSON.stringify(puzzle.board)).digest('hex'), oasisBaseline[id], `${id}: existing seeded board unchanged`);
  const goalProgression = { pumpHouse: [36,36], primePump: [40,40], prismTower: [44,44], oasisRelay: [48,48], palmIntake: [48,48], irrigationChannels: [56,52], twinTanks: [56,52], pressureManifold: [56,52], aqueductRise: [71,67], openWaterway: [98,90], caravanPennants: [24,0], pennantLine:[30,0],walkersFoot:[36,0],caravanLaunch:[42,0],saltSealedIntake:[0,0],cisternFlush:[30,0],saltwindCrossing:[0,0],twinReservoirs:[36,0],beaconAscent:[0,0],lightTheRoute:[42,0] };
  if (index < 20) assert.deepEqual([puzzle.goals.water, puzzle.goals.leaf], goalProgression[id], `${id}: goals`);
  else assert.deepEqual(puzzle.goals, level.goals, `${id}: authored goals`);
  assert.equal(puzzle.board.length, 9);
  assert.equal(puzzle.board.flat().length, 81);
  assert.equal(puzzle.crust.flat().filter(Boolean).length, level.crust?.length ?? 0, `${id}: authored crust count`);
  assert.equal(puzzle.goals.crust ?? 0, level.crust?.length ?? 0, `${id}: salt goal count`);
  if (index >= 10 && index < 20) {
    assert.deepEqual(puzzle.symbols, ['water','gear','leaf','pennant']);
    assert.equal(puzzle.chargeSymbol, 'pennant');
    assert.equal(puzzle.grantedPower, 'flywheels');
  }
  if (index >= 20) { assert.deepEqual(puzzle.symbols, ['water','gear','leaf','pennant','key']); assert.equal(puzzle.chargeSymbol,'key'); assert.equal(puzzle.grantedPower,'prism'); assert.equal(puzzle.grantCount,1); }
  for (let row = 0; row < 9; row++) for (let col = 0; col < 9; col++) {
    assert.ok(!puzzle.crust[row][col] || (puzzle.mask[row][col] && !puzzle.board[row][col]), `${id}: crust is a solid occupied cell`);
    const tile = puzzle.board[row][col];
    if (!tile || isSpecial(tile)) continue;
    if (col < 7) assert.ok(!(puzzle.board[row][col + 1]?.kind === tile.kind && !isSpecial(puzzle.board[row][col + 1]) && puzzle.board[row][col + 2]?.kind === tile.kind && !isSpecial(puzzle.board[row][col + 2])), `${id}: no horizontal prematch`);
    if (row < 7) assert.ok(!(puzzle.board[row + 1][col]?.kind === tile.kind && !isSpecial(puzzle.board[row + 1][col]) && puzzle.board[row + 2][col]?.kind === tile.kind && !isSpecial(puzzle.board[row + 2][col])), `${id}: no vertical prematch`);
  }
  if (level.lesson === 'practice') {
    assert.equal(puzzle.opening, undefined, `${id}: unguided`);
    assert.ok(legalMove(puzzle.board), `${id}: legal opening`);
    const expected = (level.boardShape === "clippedCorners" ? 77 : level.boardShape === "twinChambers" ? 63 : level.boardShape === "steppedBasin" ? 69 : 81) - (level.crust?.length ?? 0);
    assert.equal(puzzle.board.flat().filter(Boolean).length, expected, `${id}: playable cells`);
    assert.equal(puzzle.keeperTarget, level.keeperTarget ?? 9, `${id}: Keeper requirement`);
    const gaps = [];
    for (let row = 0; row < 9; row++) for (let col = 0; col < 9; col++) if (!puzzle.mask[row][col]) gaps.push({row,col});
    for (const gap of gaps) {
      assert.equal(puzzle.board[gap.row][gap.col], null);
      const neighbor = [{row:gap.row,col:gap.col+1},{row:gap.row,col:gap.col-1},{row:gap.row+1,col:gap.col},{row:gap.row-1,col:gap.col}]
        .find(cell => cell.row>=0&&cell.row<9&&cell.col>=0&&cell.col<9&&puzzle.mask[cell.row][cell.col]);
      if (neighbor) assert.equal(playTurn(puzzle, gap, neighbor).valid, false, `${id}: cannot swap into a gap`);
    }
    const [from, to] = legalMove(puzzle.board);
    const turn = playTurn(puzzle, from, to);
    assert.ok(turn.valid, `${id}: valid move`);
    for (const step of turn.steps) for (const gap of gaps)
      assert.equal(step.board[gap.row][gap.col], null, `${id}: ${step.kind} preserves missing cell`);
    const finaleBoard = turn.state.board.map(row => row.map(tile => tile && { ...tile }));
    for (const cell of [{row:4,col:1},{row:4,col:4},{row:8,col:7}]) finaleBoard[cell.row][cell.col] = null;
    const refill = resolveFinaleRefill(turn.state, finaleBoard);
    assert.equal(refill.board.flat().filter(Boolean).length, puzzle.mask.flat().filter(Boolean).length - turn.state.crust.flat().filter(Boolean).length, `${id}: finale keeps the mask and current blockers`);
    for (const step of refill.steps) for (const gap of gaps)
      assert.equal(step.board[gap.row][gap.col], null, `${id}: finale ${step.kind} preserves missing cell`);
  } else {
    assert.ok(puzzle.opening, `${id}: opening`);
    const [from, to] = puzzle.opening;
    const turn = playTurn(puzzle, from, to);
    assert.ok(turn.valid, `${id}: valid opening`);
    assert.equal(turn.state.moves, level.moves - 1);
    assert.ok(turn.steps.find(step => step.kind === 'clear'));
    if (id === 'saltboundHinges') { assert.ok(turn.stats.saltHits > 0, 'two-hit salt lesson makes visible damage'); }
    else if (id === 'gatehouseApproach') { assert.ok(turn.stats.symbolsCleared.key > 0, 'first gatehouse move clears keys'); }
    else if (id === 'saltSealedIntake') {
      assert.ok(turn.state.goals.crust < 12, 'first salt lesson move cracks adjacent crust');
      assert.ok(turn.steps.some(step => step.crustHits?.length), 'salt lesson emits a damage snapshot');
    } else if (id !== 'oasisRelay' && id !== 'caravanPennants') {
      assert.ok(turn.powersCreated.some(created => created.power === level.lesson), `${id}: lesson power created`);
      const created = turn.powersCreated.find(created => created.power === level.lesson);
      const clearBoard = turn.steps.find(step => step.kind === 'clear').board;
      const createdId = clearBoard[created.cell.row][created.cell.col]?.id;
      const tile = turn.state.board.flat().find(tile => tile?.id === createdId);
      assert.ok(tile && isSpecial(tile), `${id}: new power survives its creation turn`);
    } else if (id === 'oasisRelay') {
      const clear = turn.steps.find(step => step.kind === 'clear');
      assert.ok(clear.effects?.some(effect => effect.power === 'flywheel' && effect.targets.length >= 40), 'relay combo fires three rows and columns');
    } else {
      assert.equal(puzzle.goals.pennant, 18, 'desert goal');
      assert.deepEqual(puzzle.symbols, ['water', 'gear', 'leaf', 'pennant']);
      assert.ok(turn.state.goals.pennant < 18, 'guided pennant swap credits goal');
      assert.equal(turn.state.moves, 27);
    }
  }
  const completed = LEVEL_ORDER.slice(0, index + 1);
  assert.equal(nextLevel(completed), LEVEL_ORDER[index + 1] ?? null);
}

function setup(first, second) {
  const puzzle = createPuzzle(51);
  puzzle.board[4][4] = { ...puzzle.board[4][4], ...first };
  puzzle.board[4][5] = { ...puzzle.board[4][5], ...second };
  return playTurn(puzzle, { row: 4, col: 4 }, { row: 4, col: 5 });
}
const cross = setup({ jet: 'row' }, { jet: 'row' });
assert.ok(cross.valid);
assert.equal(cross.stats.combinations['jet+jet'],1);assert.equal(cross.stats.powersActivated.jet,2,'combo participants counted once each');
assert.deepEqual(new Set(cross.steps.find(step => step.kind === 'clear').jets.map(jet => jet.direction)), new Set(['row', 'column']));
const wheel = setup({ power: 'flywheel' }, { power: 'flywheel' });
assert.equal(wheel.steps.find(step => step.kind === 'clear').effects[0].targets.length, 25);
const prism = setup({ power: 'prism' }, { kind: 'water' });
const prismEffect = prism.steps.find(step => step.kind === 'clear').effects.find(effect => effect.power === 'prism');
assert.equal(prismEffect.selected, 'water');
assert.ok(prismEffect.targets.length > 0);
assert.equal(prism.stats.powersActivated.prism,1);
const doublePrism = setup({ power: 'prism' }, { power: 'prism' });
assert.equal(doublePrism.steps.find(step => step.kind === 'clear').effects[0].targets.length, 81);
function checkPrismCombination(power, order, kind) {
  const puzzle = createPuzzle(51);
  puzzle.goals = { water: 100, leaf: 100 };
  const from = { row: 4, col: 4 }, to = { row: 4, col: 5 };
  const source = order === 'prismFirst' ? from : to;
  const partner = order === 'prismFirst' ? to : from;
  puzzle.board[source.row][source.col] = { ...puzzle.board[source.row][source.col], power: 'prism' };
  puzzle.board[partner.row][partner.col] = { ...puzzle.board[partner.row][partner.col], kind,
    ...(power === 'flywheel' ? { power: 'flywheel' } : { jet: power }) };
  // An older special with the selected kind remains a power, rather than
  // becoming another copy or counting as a newly collected symbol.
  puzzle.board[0][0] = { ...puzzle.board[0][0], kind, jet: 'column' };
  const originals = puzzle.board.flat().filter(tile => tile && !isSpecial(tile) && tile.kind === kind);
  const originalIds = new Set(originals.map(tile => tile.id));
  const turn = playTurn(puzzle, from, to);
  assert.ok(turn.valid);
  const converted = turn.steps.find(step => step.kind === 'convert');
  const clear = turn.steps.find(step => step.kind === 'clear');
  assert.ok(converted && clear, `${power}: conversion precedes clear`);
  assert.ok(turn.steps.indexOf(converted) < turn.steps.indexOf(clear));
  assert.equal(converted.effects[0].selected, kind, 'partner original kind selects color');
  assert.equal(converted.cells.length, originals.length, 'all matching normal tiles convert');
  assert.deepEqual(new Set(converted.cells.map(cell => converted.board[cell.row][cell.col].id)), originalIds);
  for (const cell of converted.cells) {
    const tile = converted.board[cell.row][cell.col];
    assert.equal(tile.kind, kind);
    assert.equal(power === 'flywheel' ? tile.power : tile.jet, power, 'copy has partner power');
  }
  assert.equal(converted.board[0][0].jet, 'column', 'older power is unchanged');
  const fired = power === 'flywheel' ? clear.effects.filter(effect => effect.power === 'flywheel') : clear.jets.filter(jet => jet.direction === power);
  assert.ok(fired.length >= originals.length + 1, 'every copy and the original partner fires');
  assert.equal(new Set(fired.map(effect => `${effect.cell.row},${effect.cell.col}`)).size, fired.length, 'no copy fires twice');
  if (kind !== 'gear') {
    const remaining = kind === 'leaf' ? turn.state.goals.leaf : turn.state.goals.water;
    assert.equal(remaining, 100 - originals.length, 'converted normal symbols count toward goals once');
  }
  if (kind === 'leaf') assert.equal(turn.state.keeperCharge, turn.keeperJets.length ? 0 : originals.length, 'reeds charge Keeper once and reset after a gift');
  return turn;
}
for (const order of ['prismFirst', 'partnerFirst']) {
  for (const power of ['row', 'column']) checkPrismCombination(power, order, 'water');
  checkPrismCombination('flywheel', order, 'leaf');
}
const kindCounts = Object.fromEntries(['water', 'gear', 'leaf'].map(kind => [kind, createPuzzle(51).board.flat().filter(tile => tile.kind === kind).length]));
const minority = Object.keys(kindCounts).reduce((best, kind) => kindCounts[kind] < kindCounts[best] ? kind : best);
const prismJet = checkPrismCombination('row', 'prismFirst', minority);
assert.equal(prismJet.steps.find(step => step.kind === 'convert').effects[0].selected, minority, 'partner color wins even if another symbol is more numerous');
const noTargets = createPuzzle(51);
noTargets.board[4][4] = { ...noTargets.board[4][4], power: 'prism' };
noTargets.board[4][5] = { ...noTargets.board[4][5], kind: 'gear', jet: 'row' };
for (const row of noTargets.board) for (const tile of row) if (tile && !isSpecial(tile) && tile.kind === 'gear') tile.kind = 'water';
const emptyCombo = playTurn(noTargets, { row: 4, col: 4 }, { row: 4, col: 5 });
assert.equal(emptyCombo.steps.find(step => step.kind === 'convert').cells.length, 0, 'empty target has no conversions');
assert.ok(emptyCombo.steps.find(step => step.kind === 'clear').jets.length, 'partner still fires with no targets');
const combo = setup({ jet: 'column' }, { power: 'flywheel' });
assert.ok(combo.steps.find(step => step.kind === 'clear').effects[0].targets.length >= 40);
const wheelChainPuzzle = createPuzzle(51);
wheelChainPuzzle.board[4][4] = { ...wheelChainPuzzle.board[4][4], power: 'flywheel' };
wheelChainPuzzle.board[4][5] = { ...wheelChainPuzzle.board[4][5], jet: 'column' };
const wheelChain = playTurn(wheelChainPuzzle, { row: 4, col: 4 }, { row: 4, col: 4 });
assert.deepEqual(wheelChain.steps.find(step => step.kind === 'clear').sequence.slice(0, 2).map(item => item.kind), ['effect', 'jet'], 'flywheel impact triggers jet after spin');
const chainPuzzle = createPuzzle(51);
chainPuzzle.board[4][4] = { ...chainPuzzle.board[4][4], jet: 'row' };
chainPuzzle.board[4][7] = { ...chainPuzzle.board[4][7], jet: 'column' };
const chain = playTurn(chainPuzzle, { row: 4, col: 4 }, { row: 4, col: 4 });
assert.equal(chain.steps.find(step => step.kind === 'clear').jets.length, 2, 'hit jet joins chain once');
assert.deepEqual(chain.steps.find(step => step.kind === 'clear').sequence.map(item => item.kind), ['jet', 'jet'], 'jet chain stays contiguous for impact timing');
const masked = createPuzzle(LEVELS.palmIntake);
masked.board[4][4] = { ...masked.board[4][4], power: 'prism' };
masked.board[4][5] = { ...masked.board[4][5], power: 'prism' };
const maskedPrisms = playTurn(masked, {row:4,col:4},{row:4,col:5});
assert.equal(maskedPrisms.steps.find(step => step.kind === 'clear').effects[0].targets.length, 77, 'double Prism hits only playable cells');
const maskedKeeper = createPuzzle(LEVELS.palmIntake);
maskedKeeper.keeperCharge = 9;
const [keeperFrom, keeperTo] = legalMove(maskedKeeper.board);
const keeperTurn = playTurn(maskedKeeper, keeperFrom, keeperTo);
assert.ok(keeperTurn.keeperJets.length === 2, 'Keeper places two Jets on valid cells');
for (const cell of keeperTurn.keeperJets) assert.equal(maskedKeeper.mask[cell.row][cell.col], true);
for (const id of ['twinTanks','pressureManifold','aqueductRise','openWaterway','caravanPennants']) {
  const puzzle = createPuzzle(LEVELS[id]);
  const expected = id === 'twinTanks' || id === 'pressureManifold' ? 63 : id === 'caravanPennants' ? 81 : 69;
  puzzle.board[4][4] = { ...puzzle.board[4][4], power: 'prism' };
  puzzle.board[4][5] = { ...puzzle.board[4][5], power: 'prism' };
  const turn = playTurn(puzzle, {row:4,col:4}, {row:4,col:5});
  assert.equal(turn.steps.find(step => step.kind === 'clear').effects[0].targets.length, expected, `${id}: double Prism clips to mask`);
}
const chambers = createPuzzle(LEVELS.twinTanks);
chambers.board[0][2] = { ...chambers.board[0][2], jet: 'row' };
const acrossGap = playTurn(chambers, {row:0,col:2}, {row:0,col:2});
assert.ok(acrossGap.cleared.some(cell => cell.row === 0 && cell.col === 6), 'Jet reaches the other chamber across absent cells');
assert.ok(!acrossGap.cleared.some(cell => cell.row === 0 && cell.col === 4), 'Jet does not clear an absent bridge cell');
const edgeWheel = createPuzzle(LEVELS.twinTanks);
edgeWheel.board[3][3] = { ...edgeWheel.board[3][3], power: 'flywheel' };
const edgeBlast = playTurn(edgeWheel, {row:3,col:3}, {row:3,col:3});
const edgeTargets = edgeBlast.steps.find(step => step.kind === 'clear').effects[0].targets;
assert.ok(edgeTargets.length < 9 && edgeTargets.every(cell => edgeWheel.mask[cell.row][cell.col]), 'Flywheel blast clips at bridge edge');
const manifold = createPuzzle(LEVELS.pressureManifold);
assert.equal(manifold.keeperTarget, 12);
const below = { ...manifold, keeperCharge: 0 };
const lowMove = legalMove(below.board);
const lowTurn = playTurn(below, ...lowMove);
assert.ok(lowTurn.state.keeperCharge < 12 && lowTurn.keeperJets.length === 0, 'below twelve reeds gives no Jets');
const ready = { ...manifold, keeperCharge: 12 };
const readyTurn = playTurn(ready, ...legalMove(ready.board));
assert.equal(readyTurn.keeperJets.length, 2, 'twelve reeds grants two Jets');
assert.equal(readyTurn.state.keeperCharge, 0, 'Keeper resets to zero after a successful gift');
for (const cell of readyTurn.keeperJets) assert.ok(manifold.mask[cell.row][cell.col], 'Keeper uses playable cells');
const oldSix = {version:2, completed:LEVEL_ORDER.slice(0,6), coins:481};
const saved = readSave({getItem:key => key==='dune-relay-campaign-v2' ? JSON.stringify(oldSix) : null, setItem:()=>{}});
assert.equal(nextLevel(saved.completed), 'twinTanks', 'existing six-level save advances to level seven');
assert.equal(saved.coins, 481);
assert.equal(nextLevel(LEVEL_ORDER), null, 'all available clears complete');
for (const id of ['palmIntake','irrigationChannels','twinTanks','pressureManifold','aqueductRise','openWaterway',...LEVEL_ORDER.slice(10)]) {
  let puzzle = createPuzzle(LEVELS[id]);
  let opening = puzzle.opening;
  while (puzzle.status === 'playing') {
    let chosen = null, best = -Infinity;
    for (let row = 0; row < 9; row++) for (let col = 0; col < 9; col++) {
      const from = {row,col};
      for (const to of [{row,col:col+1},{row:row+1,col}, ...(isSpecial(puzzle.board[row][col]) ? [from] : [])]) {
        if (to.row >= 9 || to.col >= 9) continue;
        const turn = playTurn(puzzle, from, to);
        if (!turn.valid) continue;
        const value = Object.keys(puzzle.goals).reduce((score, kind) => score + (puzzle.goals[kind] - turn.state.goals[kind]) * (kind === 'crust' ? 3 : 1), 0) + turn.powersCreated.length * 2 + turn.keeperJets.length * 2;
        if (opening && from.row === opening[0].row && from.col === opening[0].col && to.row === opening[1].row && to.col === opening[1].col) { chosen = turn.state; best = Infinity; }
        if (value > best) {best = value; chosen = turn.state;}
      }
    }
    assert.ok(chosen, `${id}: legal move exists`);
    puzzle = chosen;
    opening = undefined;
    for (let row = 0; row < 9; row++) for (let col = 0; col < 9; col++) if (!puzzle.mask[row][col]) assert.equal(puzzle.board[row][col], null, `${id}: gap stays empty`);
    for (let row = 0; row < 9; row++) for (let col = 0; col < 9; col++) assert.ok(!puzzle.crust[row][col] || !puzzle.board[row][col], `${id}: crust remains solid`);
  }
  assert.equal(puzzle.status, 'won', `${id}: seeded goal-aware playthrough is winnable`);
  console.log(`${id}: goal-aware victory with ${puzzle.moves} moves left`);
}
function freshPowerBesideOldPower(oldPower, five = false, reversed = false) {
  const puzzle = createPuzzle(51);
  const kinds = ['water', 'gear', 'leaf'];
  for (let row = 0; row < 9; row++) for (let col = 0; col < 9; col++)
    puzzle.board[row][col].kind = kinds[(row + col) % 3];
  puzzle.unlocked = ['flywheel', 'prism'];
  const old = puzzle.board[4][4];
  if (oldPower === 'prism') old.power = 'prism';
  else old.jet = 'column';
  puzzle.board[3][4].kind = 'water';
  for (const col of five ? [2, 3, 5, 6] : [2, 3, 5]) puzzle.board[4][col].kind = 'water';
  const newPowerId = puzzle.board[3][4].id;
  const from = reversed ? { row: 3, col: 4 } : { row: 4, col: 4 };
  const to = reversed ? { row: 4, col: 4 } : { row: 3, col: 4 };
  const turn = playTurn(puzzle, from, to);
  assert.ok(turn.valid, 'existing power swap creates a match');
  const firstClear = turn.steps.find(step => step.kind === 'clear');
  const newPower = firstClear.board[4][4];
  assert.equal(newPower.id, newPowerId, 'created power stays on the matched tile');
  assert.equal(five ? newPower.power : newPower.jet, five ? 'prism' : 'row');
  assert.ok(turn.state.board.flat().some(tile => tile?.id === newPowerId && isSpecial(tile)), 'fresh power remains available after the turn');
  assert.equal(turn.steps.some(step => step.kind === 'convert'), false, 'new power cannot turn the swap into a Prism combo');
  if (oldPower === 'jet') {
    assert.deepEqual(firstClear.jets.map(jet => jet.direction), ['column'], 'only the existing Jet fires');
  } else {
    assert.deepEqual(firstClear.effects.map(effect => effect.power), ['prism'], 'only the existing Prism fires');
    assert.equal(firstClear.effects[0].selected, 'water', 'Prism uses the swapped normal symbol even when it becomes a power');
  }
}
for (const reversed of [false, true]) {
  freshPowerBesideOldPower('jet', false, reversed);
  freshPowerBesideOldPower('prism', false, reversed);
  freshPowerBesideOldPower('prism', true, reversed);
}

const idlePrismPuzzle = createPuzzle(51);
idlePrismPuzzle.board[4][4].jet = 'row';
idlePrismPuzzle.board[4][2].power = 'prism';
const idlePrismId = idlePrismPuzzle.board[4][2].id;
const jetThroughPrism = playTurn(idlePrismPuzzle, { row: 4, col: 4 }, { row: 4, col: 4 });
assert.ok(jetThroughPrism.valid, 'double-tapped Jet fires');
assert.ok(jetThroughPrism.state.board.flat().some(tile => tile?.id === idlePrismId && tile.power === 'prism'), 'Jet passes over an idle Prism');
assert.equal(jetThroughPrism.stats.powersActivated.prism, 0, 'idle Prism does not chain fire');
const prismComboPuzzle = createPuzzle(51);
prismComboPuzzle.board[4][4].power = prismComboPuzzle.board[4][5].power = prismComboPuzzle.board[4][7].power = 'prism';
const thirdPrismId = prismComboPuzzle.board[4][7].id;
const prismCombo = playTurn(prismComboPuzzle, { row: 4, col: 4 }, { row: 4, col: 5 });
assert.ok(prismCombo.state.board.flat().some(tile => tile?.id === thirdPrismId && tile.power === 'prism'), 'third Prism survives an explicit Prism combo');
assert.equal(prismCombo.stats.powersActivated.prism, 2, 'only selected Prism pair activates');
const finalePuzzle = createPuzzle(51);
finalePuzzle.moves = 3;
finalePuzzle.board[4][2].power = 'prism';
finalePuzzle.board[4][4].jet = 'row';
const finalePrismId = finalePuzzle.board[4][2].id;
const originalFinale = JSON.stringify(finalePuzzle);
const finalePlan = planFinale(finalePuzzle);
assert.equal(JSON.stringify(finalePuzzle), originalFinale, 'finale planning does not mutate puzzle');
assert.deepEqual(planFinale(finalePuzzle), finalePlan, 'watched and skipped finale use the same deterministic plan');
assert.ok(finalePlan.board.flat().some(tile => tile?.id === finalePrismId && tile.power === 'prism'), 'idle Prism survives finale waves and refill');
assert.ok(finalePlan.waves.every(wave => !wave.removed.some(cell => wave.before[cell.row][cell.col]?.id === finalePrismId)), 'finale never reveals a coin by consuming idle Prism');

function stripedPrismPuzzle() {
  const puzzle = createPuzzle(51);
  const symbols = ['water', 'gear', 'leaf'];
  for (let row = 0; row < 9; row++) for (let col = 0; col < 9; col++)
    puzzle.board[row][col].kind = symbols[(row + col) % symbols.length];
  puzzle.unlocked = ['flywheel', 'prism'];
  return puzzle;
}
for (const axis of ['horizontal', 'vertical']) for (const reversed of [false, true]) {
  const puzzle = stripedPrismPuzzle();
  const center = { row: 4, col: 4 };
  const other = axis === 'horizontal' ? { row: 3, col: 4 } : { row: 4, col: 3 };
  for (const n of [2, 3, 5, 6]) puzzle.board[axis === 'horizontal' ? 4 : n][axis === 'horizontal' ? n : 4].kind = 'water';
  puzzle.board[other.row][other.col].kind = 'water';
  puzzle.board[4][4].kind = 'gear';
  const swappedId = puzzle.board[other.row][other.col].id;
  const turn = playTurn(puzzle, ...(reversed ? [center, other] : [other, center]));
  assert.ok(turn.valid, `${axis} five match works in ${reversed ? 'reverse' : 'forward'} swap order`);
  assert.deepEqual(turn.powersCreated[0], { cell: center, power: 'prism' }, 'first-wave Prism anchors to the matched swapped tile');
  const firstClear = turn.steps.find(step => step.kind === 'clear');
  assert.equal(firstClear.board[4][4]?.id, swappedId, 'Prism keeps the swapped tile identity');
  assert.equal(firstClear.board[4][4]?.power, 'prism', 'Prism appears at the swap location before gravity');
}
const cascadeAnchor = stripedPrismPuzzle();
for (const col of [2, 3, 5, 6]) cascadeAnchor.board[7][col].kind = 'water';
cascadeAnchor.board[7][4].kind = 'gear';
cascadeAnchor.board[6][4].kind = 'gear';
cascadeAnchor.board[5][4].kind = 'water';
cascadeAnchor.board[5][3].kind = 'gear';
cascadeAnchor.board[4][4].kind = 'water';
cascadeAnchor.board[6][3].kind = 'leaf'; // Prevent an unrelated first-wave match.
const cascadingPrism = playTurn(cascadeAnchor, { row: 5, col: 3 }, { row: 5, col: 4 });
assert.ok(cascadingPrism.valid);
assert.deepEqual(cascadingPrism.powersCreated[0], { cell: { row: 7, col: 4 }, power: 'prism' }, 'later cascade anchors at line center, away from stale swap coordinates');
const cascadeClears = cascadingPrism.steps.filter(step => step.kind === 'clear');
assert.equal(cascadeClears[0].board[7][4], null, 'Prism does not exist in first clear');
assert.equal(cascadeClears[1].board[7][4]?.power, 'prism', 'cascade Prism appears in second clear snapshot');
const cascadeSalt = { ...cascadeAnchor, board: cascadeAnchor.board.map(row=>row.map(tile=>tile&&{...tile})), crust:cascadeAnchor.crust.map(row=>[...row]), goals:{water:0,leaf:0,crust:1} };
cascadeSalt.board[8][4]=null; cascadeSalt.crust[8][4]=2;
const cascadeSaltTurn=playTurn(cascadeSalt,{row:5,col:3},{row:5,col:4});
const cascadeSaltClears=cascadeSaltTurn.steps.filter(step=>step.kind==='clear');
assert.deepEqual(cascadeSaltTurn.powersCreated[0],{cell:{row:7,col:4},power:'prism'});
assert.equal(cascadeSaltClears[0].crust[8][4],1,'first wave damages salt before the new power appears');
assert.equal(cascadeSaltClears[1].crust[8][4],0,'cascade-created retained Prism origin damages adjacent salt');
assert.ok(!cascadeSaltClears[1].cells.some(cell=>cell.row===7&&cell.col===4),'retained origin is not collected');
assert.equal(cascadeSaltTurn.stats.powersActivated.prism,0,'cascade-created Prism stays idle');

const independent = createPuzzle(51);
const kinds = ['water', 'gear', 'leaf'];
for (let row = 0; row < 9; row++) for (let col = 0; col < 9; col++) independent.board[row][col].kind = kinds[(row + col) % 3];
for (let col = 0; col < 4; col++) independent.board[1][col].kind = 'water';
for (let col = 5; col < 9; col++) independent.board[7][col].kind = 'leaf';
independent.board[4][4].jet = 'column';
const independentTurn = playTurn(independent, { row: 4, col: 4 }, { row: 3, col: 4 });
assert.ok(independentTurn.powersCreated.length >= 2, 'separate matches may each create a power');
const replay = completeLevel(completeLevel(EMPTY_SAVE, 'pumpHouse', 30), 'pumpHouse', 30);
assert.equal(replay.coins, 30, 'replays do not farm coins');
assert.equal(coinReward(2), 26);
const v2AllOasis = { version: 2, completed: LEVEL_ORDER.slice(0, 10), coins: 456 };
const memory = new Map([['dune-relay-campaign-v2', JSON.stringify(v2AllOasis)]]);
const storage = { getItem: key => memory.get(key) ?? null, setItem: (key, value) => memory.set(key, value) };
let migrated = readSave(storage);
assert.equal(migrated.version, 5);
assert.equal(migrated.coins, 456);
assert.equal(migrated.oasisTransition, 'film', 'ten-cleared v2 save resumes with film');
assert.equal(readSave(storage).oasisTransition, 'film', 'migration is persisted');
for (const [from, to] of [['film', 'keeper'], ['keeper', 'atlas'], ['atlas', 'arrival'], ['arrival', 'ready']]) {
  const next = advanceTransition(migrated, from, to);
  assert.equal(next.oasisTransition, to);
  assert.equal(advanceTransition(next, from, to), next, 'checkpoint is idempotent');
  migrated = next;
  storage.setItem('dune-relay-campaign-v5', JSON.stringify(next));
  assert.equal(readSave(storage).oasisTransition, to, 'reload resumes checkpoint');
}
assert.deepEqual(migrated.companions, ['keeper', 'wayfinder']);
assert.equal(migrated.region, 'caravan');
const oasisVisit = normalizeSave({ ...migrated, region: 'oasis' });
assert.equal(oasisVisit.region, 'oasis', 'completed oasis visit survives reload');
const desertVictory = completeLevel(migrated, 'caravanPennants', 31);
assert.equal(completeLevel(desertVictory, 'caravanPennants', 31).coins, desertVictory.coins, 'desert replay reward is idempotent');
const desert = createPuzzle(LEVELS.caravanPennants);
assert.equal(desert.keeperTarget, 9);
assert.equal(desert.chargeSymbol, 'pennant');
assert.equal(desert.grantedPower, 'flywheels');
const charged = { ...desert, keeperCharge: 9 };
const chargedTurn = playTurn(charged, ...desert.opening);
assert.equal(chargedTurn.keeperJets.length, 2, 'Wayfinder grants two powers');
for (const cell of chargedTurn.keeperJets) assert.equal(chargedTurn.state.board[cell.row][cell.col]?.power, 'flywheel', 'Wayfinder grants Flywheels');
assert.equal(chargedTurn.state.keeperCharge, 0, 'Wayfinder resets to zero after a successful gift');
const pennantPrism = createPuzzle(LEVELS.caravanPennants);
pennantPrism.board[4][4].power = 'prism';
pennantPrism.board[4][5].kind = 'pennant';
const pennantTurn = playTurn(pennantPrism, { row: 4, col: 4 }, { row: 4, col: 5 });
assert.equal(pennantTurn.steps.find(step => step.kind === 'clear').effects[0].selected, 'pennant', 'Prism targets new symbol');
assert.ok(pennantTurn.state.goals.pennant < 18, 'Prism credits pennant goal');

function saltFixture(blocks) {
  const puzzle = createPuzzle(51);
  const symbols = ['water','gear','leaf'];
  for (let row = 0; row < 9; row++) for (let col = 0; col < 9; col++) {
    puzzle.board[row][col].kind = symbols[(row + col) % 3];
    delete puzzle.board[row][col].jet; delete puzzle.board[row][col].power;
  }
  puzzle.goals = { water: 0, leaf: 0, crust: blocks.length };
  for (const {row,col,hp} of blocks) { puzzle.board[row][col] = null; puzzle.crust[row][col] = hp; }
  return puzzle;
}
function firstClear(turn) { return turn.steps.find(step => step.kind === 'clear'); }
const adjacent = saltFixture([{row:4,col:4,hp:5}]);
adjacent.board[3][3].kind = 'water'; adjacent.board[3][4].kind = 'gear'; adjacent.board[3][5].kind = 'water'; adjacent.board[3][6].kind = 'gear'; adjacent.board[2][4].kind = 'water';
const adjacentTurn = playTurn(adjacent,{row:2,col:4},{row:3,col:4});
assert.ok(adjacentTurn.valid, 'adjacent salt match is playable');
assert.equal(firstClear(adjacentTurn).crust[4][4], 4, 'connected match damages the block once despite multiple cleared tiles');
assert.equal(firstClear(adjacentTurn).goals.crust, 1, 'salt goal counts broken blocks, not lost HP');
assert.equal(adjacent.crust[4][4], 5, 'old state remains immutable');
assert.equal(firstClear(adjacentTurn).crustEvents.length, 1, 'one match makes one salt damage event');
const diagonal = saltFixture([{row:4,col:6,hp:5}]);
diagonal.board[3][3].kind = 'water'; diagonal.board[3][4].kind = 'gear'; diagonal.board[3][5].kind = 'water'; diagonal.board[3][6].kind = 'gear'; diagonal.board[2][4].kind = 'water';
const diagonalTurn = playTurn(diagonal,{row:2,col:4},{row:3,col:4});
assert.equal(firstClear(diagonalTurn).crust[4][6], 5, 'diagonal match does not damage salt');
assert.equal(playTurn(diagonal,{row:4,col:6},{row:4,col:5}).valid, false, 'salt cannot be swapped');
const directSalt = saltFixture([{row:4,col:4,hp:5}]);
directSalt.board[4][2].jet = 'row';
const directTurn = playTurn(directSalt,{row:4,col:2},{row:4,col:2});
assert.equal(firstClear(directTurn).crust[4][4], 4, 'Jet passes through and directly damages salt');
assert.ok(directTurn.cleared.some(cell => cell.row === 4 && cell.col === 7), 'Jet continues beyond salt');
assert.equal(firstClear(directTurn).crustEvents[0].hits[0].hp, 4, 'salt event exposes intermediate HP for FX');
const offRowSalt = saltFixture([{row:5,col:4,hp:5}]);
offRowSalt.board[4][2].jet = 'row';
const offRowTurn = playTurn(offRowSalt,{row:4,col:2},{row:4,col:2});
assert.ok(firstClear(offRowTurn).cells.some(cell => cell.row === 4 && cell.col === 4), 'Jet clears normal beside off-row salt');
assert.equal(firstClear(offRowTurn).crust[5][4], 5, 'Jet must hit salt directly, not through adjacent cleared normals');
const outsideWheelSalt = saltFixture([{row:6,col:4,hp:5}]);
outsideWheelSalt.board[4][4].power = 'flywheel';
const outsideWheelTurn = playTurn(outsideWheelSalt,{row:4,col:4},{row:4,col:4});
assert.ok(firstClear(outsideWheelTurn).cells.some(cell => cell.row === 5 && cell.col === 4), 'Flywheel clears normal next to outside salt');
assert.equal(firstClear(outsideWheelTurn).crust[6][4], 5, 'Flywheel damages salt within its blast only');
const adjacentPrismSalt = saltFixture([{row:4,col:4,hp:5}]);
adjacentPrismSalt.board[1][1].power = 'prism';
adjacentPrismSalt.board[1][2].kind = 'water';
adjacentPrismSalt.board[3][4].kind = 'water';
const adjacentPrismTurn = playTurn(adjacentPrismSalt,{row:1,col:1},{row:1,col:2});
assert.ok(firstClear(adjacentPrismTurn).cells.some(cell => cell.row === 3 && cell.col === 4), 'Prism clears selected normal beside salt');
assert.equal(firstClear(adjacentPrismTurn).crust[4][4], 4, 'Prism-cleared normal tile cracks adjacent salt');
const thinPrismSalt = saltFixture([{row:4,col:4,hp:1}]);
thinPrismSalt.board[1][1].power = 'prism'; thinPrismSalt.board[1][2].kind = 'water'; thinPrismSalt.board[3][4].kind = 'water';
const thinPrismTurn = playTurn(thinPrismSalt,{row:1,col:1},{row:1,col:2});
assert.equal(firstClear(thinPrismTurn).crust[4][4], 0, 'Prism-adjacent clear breaks one-hit salt');
assert.equal(firstClear(thinPrismTurn).goals.crust, 0, 'Prism-adjacent break counts toward salt goal');
const multiSidePrismSalt = saltFixture([{row:4,col:4,hp:2}]);
multiSidePrismSalt.board[1][1].power = 'prism'; multiSidePrismSalt.board[1][2].kind = 'water';
for (const [row,col] of [[3,4],[4,3],[4,5],[5,4]]) multiSidePrismSalt.board[row][col].kind = 'water';
const multiSidePrismTurn = playTurn(multiSidePrismSalt,{row:1,col:1},{row:1,col:2});
assert.equal(firstClear(multiSidePrismTurn).crust[4][4], 1, 'one Prism clear event damages two-hit salt once despite four neighboring tiles');
assert.equal(firstClear(multiSidePrismTurn).crustEvents.length, 1, 'one Prism clear yields one atomic salt damage event');
const comboSalt = saltFixture([{row:4,col:4,hp:5}]);
comboSalt.board[4][5].jet = 'row'; comboSalt.board[4][6].jet = 'column';
const comboTurn = playTurn(comboSalt,{row:4,col:5},{row:4,col:6});
assert.equal(firstClear(comboTurn).crust[4][4], 4, 'Jet combo cross is one power event');
assert.equal(firstClear(comboTurn).crustEvents.length, 1, 'overlapping combo rays do not double damage');
const twoMatches = saltFixture([{row:4,col:4,hp:5}]);
for (const row of [3,5]) { for (const col of [3,4,5]) twoMatches.board[row][col].kind='water'; twoMatches.board[row][6].kind='gear'; }
twoMatches.board[4][5].kind='gear';
twoMatches.board[0][0].jet='row';
const twoMatchTurn = playTurn(twoMatches,{row:0,col:0},{row:0,col:0});
assert.equal(firstClear(twoMatchTurn).crust[4][4], 3, 'two disconnected matches each damage shared crust');
assert.equal(firstClear(twoMatchTurn).crustEvents.filter(event=>event.after===-1).length, 2, 'disconnected matches keep separate events');
const chainSalt = saltFixture([{row:4,col:4,hp:5}]);
chainSalt.board[4][2].jet = 'row'; chainSalt.board[4][6].jet = 'row';
const chainTurn = playTurn(chainSalt,{row:4,col:2},{row:4,col:2});
assert.equal(firstClear(chainTurn).crust[4][4], 3, 'two chained power activations each damage salt');
assert.deepEqual(firstClear(chainTurn).crustEvents.map(event => event.hits[0].hp), [4,3], 'chain exposes damage in activation order');
const firstJet = {row:4,col:2}, chainedJet = {row:4,col:6}, saltCell = {row:4,col:4};
const firstCrack = beamTravelDelay(firstJet,'row',saltCell);
const nextJetStarts = beamTravelDelay(firstJet,'row',chainedJet);
const secondCrack = nextJetStarts + beamTravelDelay(chainedJet,'row',saltCell);
assert.ok(firstCrack > 0 && firstCrack < nextJetStarts && nextJetStarts < secondCrack, 'salt feedback follows each traveling beam in chain order');
const wheelSalt = saltFixture([{row:4,col:4,hp:5}]);
wheelSalt.board[4][5].power = 'flywheel';
const wheelTurn = playTurn(wheelSalt,{row:4,col:5},{row:4,col:5});
assert.equal(firstClear(wheelTurn).crust[4][4], 4, 'Flywheel directly hits salt');
const prismSalt = saltFixture([{row:4,col:4,hp:5}]);
prismSalt.board[4][5].power = 'prism'; prismSalt.board[4][6].power = 'prism';
const prismSaltTurn = playTurn(prismSalt,{row:4,col:5},{row:4,col:6});
assert.equal(firstClear(prismSaltTurn).crust[4][4], 4, 'Prism plus Prism board clear is one event');
const prismPartner = saltFixture([{row:4,col:4,hp:5}]);
prismPartner.board[4][5].power = 'prism'; prismPartner.board[4][6].jet = 'row';
const prismPartnerTurn = playTurn(prismPartner,{row:4,col:5},{row:4,col:6});
assert.ok(prismPartnerTurn.steps.some(step => step.kind === 'convert'));
assert.equal(firstClear(prismPartnerTurn).crustEvents[0]?.hits[0]?.hp, 4, 'Prism conversion origin does not add extra damage');
assert.ok(firstClear(prismPartnerTurn).crustEvents.every(event => firstClear(prismPartnerTurn).sequence[event.after]?.kind === 'jet'), 'Prism + Jet conversion damages salt only through its copied direct-hit Jets');
assert.ok(firstClear(prismPartnerTurn).crust[4][4] < 5, 'copied powers can damage salt');
const segment = saltFixture([{row:4,col:4,hp:1}]);
const lowerIds = [5,6,7,8].map(row => segment.board[row][4].id);
segment.board[2][2].jet = 'row';
const segmentTurn = playTurn(segment,{row:2,col:2},{row:2,col:2});
assert.deepEqual([5,6,7,8].map(row => segmentTurn.steps.find(step=>step.kind==='fall').board[row][4]?.id), lowerIds, 'gravity does not pull lower tiles through intact salt');
assert.equal(segmentTurn.steps.find(step=>step.kind==='refill').board[4][4], null, 'refill leaves intact salt occupied');
const opened = saltFixture([{row:4,col:4,hp:1}]);
opened.board[3][4].jet = 'column';
const openedTurn = playTurn(opened,{row:3,col:4},{row:3,col:4});
assert.equal(firstClear(openedTurn).crust[4][4], 0, 'direct Jet opens a blocked column');
assert.ok(openedTurn.state.board[4][4], 'a broken block refills permanently');
const lastMove = saltFixture([{row:4,col:4,hp:1}]);
lastMove.moves = 1; lastMove.board[4][2].jet = 'row';
const lastMoveTurn = playTurn(lastMove,{row:4,col:2},{row:4,col:2});
assert.equal(lastMoveTurn.state.status, 'won', 'breaking final salt on last move wins before loss check');
const newPowerSalt = saltFixture([{row:5,col:4,hp:5}]);
newPowerSalt.board[4][2].kind='water'; newPowerSalt.board[4][3].kind='water'; newPowerSalt.board[4][4].kind='gear'; newPowerSalt.board[4][5].kind='water'; newPowerSalt.board[4][6].kind='gear'; newPowerSalt.board[3][4].kind='water';
const newPowerTurn = playTurn(newPowerSalt,{row:3,col:4},{row:4,col:4});
assert.ok(newPowerTurn.powersCreated.some(power=>power.power==='jet'), 'four in a row creates Jet');
assert.equal(firstClear(newPowerTurn).crust[5][4], 4, 'fresh retained power origin damages adjacent salt without firing');
assert.equal(newPowerTurn.stats.powersActivated.jet, 0, 'new Jet does not fire on creation');
assert.equal(newPowerTurn.steps[0].kind, 'swap');
assert.equal(newPowerTurn.state.board[4][4]?.jet, 'row', 'new Jet remains on board');
assert.equal(newPowerTurn.stats.saltHits, 1, 'one matched component causes one salt hit');
const prismOriginSalt = saltFixture([{row:5,col:4,hp:2}]); prismOriginSalt.unlocked=['flywheel','prism'];
for (const col of [2,3,5,6]) prismOriginSalt.board[4][col].kind='water';
prismOriginSalt.board[4][4].kind='gear'; prismOriginSalt.board[3][4].kind='water';
const prismOriginTurn=playTurn(prismOriginSalt,{row:3,col:4},{row:4,col:4});
assert.equal(prismOriginTurn.powersCreated[0].power,'prism');
assert.equal(firstClear(prismOriginTurn).crust[5][4],1,'retained new Prism origin damages neighboring salt');
assert.equal(prismOriginTurn.stats.powersActivated.prism,0,'new Prism stays idle');
const wheelOriginSalt=saltFixture([{row:4,col:5,hp:1}]); wheelOriginSalt.unlocked=['flywheel','prism'];
for(const col of [2,3]) wheelOriginSalt.board[4][col].kind='water';
for(const row of [5,6]) wheelOriginSalt.board[row][4].kind='water';
wheelOriginSalt.board[4][4].kind='gear'; wheelOriginSalt.board[3][4].kind='water';
const wheelOriginTurn=playTurn(wheelOriginSalt,{row:3,col:4},{row:4,col:4});
assert.equal(wheelOriginTurn.powersCreated[0].power,'flywheel');
assert.equal(firstClear(wheelOriginTurn).crust[4][5],0,'retained new Flywheel origin breaks adjacent salt');
assert.equal(wheelOriginTurn.stats.powersActivated.flywheel,0,'new Flywheel stays idle');
for (const invalidHp of [0, 1.5, 6, NaN]) assert.throws(() => createPuzzle({ ...LEVELS.pennantLine, goals:{water:0,leaf:0,crust:1}, crust:[{row:4,col:4,hp:invalidHp}] }), 'invalid crust HP rejected');
for (let hp=1; hp<=5; hp++) {
  const layered = saltFixture([{row:4,col:4,hp}]); layered.board[4][2].jet='row';
  const hit = playTurn(layered,{row:4,col:2},{row:4,col:2});
  assert.equal(firstClear(hit).crust[4][4], hp-1, `HP ${hp} loses exactly one`);
  assert.equal(firstClear(hit).goals.crust, hp===1 ? 0 : 1, `HP ${hp} only decrements goal on destruction`);
}
for (const step of segmentTurn.steps) for (let row = 0; row < 9; row++) for (let col = 0; col < 9; col++)
  assert.ok(!step.crust[row][col] || !step.board[row][col], 'every snapshot keeps intact salt empty');
const oldEleven = normalizeSave({ ...EMPTY_SAVE, completed: LEVEL_ORDER.slice(0,11), coins: 539, region:'caravan', oasisTransition:'ready', companions:['keeper','wayfinder'] });
assert.equal(nextLevel(oldEleven.completed), 'pennantLine', 'old level-eleven save resumes at level twelve');
assert.equal(oldEleven.coins, 539);
assert.equal(oldEleven.region, 'caravan');
assert.deepEqual(oldEleven.companions, ['keeper','wayfinder']);
const fullDesert = completeLevel(normalizeSave({ ...oldEleven, completed: LEVEL_ORDER.slice(0,19) }), 'lightTheRoute', 71);
assert.equal(nextLevel(fullDesert.completed), 'gatehouseApproach', 'level twenty opens Gatehouse');
assert.deepEqual(fullDesert.transition, {from:'caravan',to:'gatehouse',stage:'film'});
assert.equal(completeLevel(fullDesert,'lightTheRoute',71), fullDesert, 'final reward is idempotent');
const gate = createPuzzle(LEVELS.gatehouseApproach);
const gateCharged = { ...gate, keeperCharge: 9 };
const gateGift = playTurn(gateCharged, ...gate.opening);
assert.equal(gateGift.keeperJets.length,1,'Gatewright grants one power');
for(const cell of gateGift.keeperJets) assert.equal(gateGift.state.board[cell.row][cell.col]?.power,'prism');
const saltLesson = createPuzzle(LEVELS.saltboundHinges);
const saltHit = playTurn(saltLesson,...saltLesson.opening);
assert.equal(saltLesson.crust[1][6],2,'guided crust is layered');
assert.equal(saltHit.state.crust[1][6],1,'first hit cracks layered salt');
assert.equal(saltHit.stats.saltBlocksBroken,0,'first hit does not count block broken');
assert.equal(saltHit.stats.saltHits, saltHit.steps.reduce((n,step)=>n+(step.crustEvents?.reduce((x,event)=>x+event.hits.length,0)??0),0));
let attempt=startAttempt(LEVELS.gatehouseApproach,gate);
assert.equal(attempt.rulesVersion, 'gatehouse-3', 'playtest exports distinguish the updated match-origin salt rules');
attempt=appendTurn(attempt,playTurn(gate,...gate.opening),...gate.opening);
assert.equal(attempt.movesUsed,1);assert.equal(attempt.totals.tilesCleared,attempt.moves[0].tilesCleared);
assert.equal(attempt.moves[0].action,'swap');
const directPuzzle=createPuzzle(LEVELS.gatehouseApproach);directPuzzle.board[4][4].jet='row';
const statsDirectCell={row:4,col:4};const statsDirectTurn=playTurn(directPuzzle,statsDirectCell,statsDirectCell);
assert.equal(appendTurn(startAttempt(LEVELS.gatehouseApproach,directPuzzle),statsDirectTurn,statsDirectCell,statsDirectCell).moves[0].action,'directPower');
attempt=finishAttempt(attempt,'abandoned','test');assert.equal(finishAttempt(attempt,'won','late'),attempt);
const archive=addAttempt(emptyArchive(),attempt);assert.equal(JSON.parse(archiveJson(archive)).attempts[0].levelId,'gatehouseApproach');assert.ok(archiveCsv(archive).includes('gatehouseApproach'));
const tunedAttempt=startAttempt(LEVELS.irrigationChannels,createPuzzle(LEVELS.irrigationChannels));
assert.equal(tunedAttempt.initialMoves,23,'new attempt exports the tuned board budget');
assert.equal(tunedAttempt.contentVersion,'chapter-3-2','tuned attempts carry a distinct content version');
const olderAttempt={...tunedAttempt,id:'older-content',contentVersion:'chapter-3-1'};
const olderRestored=readArchive({getItem:key=>key===PLAYTEST_KEY?archiveJson(addAttempt(emptyArchive(),olderAttempt)):null,setItem:()=>{}});
assert.equal(olderRestored.attempts[0].contentVersion,'chapter-3-1','old exports keep their authored content version');
const secondAttempt=startAttempt(LEVELS.gatewrightWorkshop,createPuzzle(LEVELS.gatewrightWorkshop));
const both=addAttempt(archive,secondAttempt);assert.equal(both.attempts.length,2,'a second level records a separate attempt');
const restored=readArchive({getItem:key=>key===PLAYTEST_KEY?archiveJson(both):null,setItem:()=>{}});
assert.equal(restored.attempts[1].outcome,'abandoned','interrupted open attempt is retained and marked abandoned');
assert.equal(restored.attempts[1].terminationReason,'interrupted');
let bounded=emptyArchive();for(let index=0;index<MAX_ATTEMPTS+3;index++)bounded=addAttempt(bounded,{...attempt,id:`attempt-${index}`});
assert.equal(bounded.attempts.length,MAX_ATTEMPTS);assert.equal(bounded.droppedAttempts,3);
const allTwenty=normalizeSave({...EMPTY_SAVE,completed:LEVEL_ORDER.slice(0,20),oasisTransition:'ready',companions:['keeper','wayfinder'],region:'caravan'});
assert.deepEqual(allTwenty.transition,{from:'caravan',to:'gatehouse',stage:'film'},'v3 full campaign resumes departure');
const filmDone=advanceChapterTransition(allTwenty,'film','handoff');
const handoffDone=advanceChapterTransition(filmDone,'handoff','atlas');
const atlasDone=advanceChapterTransition(handoffDone,'atlas','arrival');
assert.equal(atlasDone.region,'gatehouse');assert.equal(atlasDone.gatehouseReady,false);
const arrivalDone=advanceChapterTransition(atlasDone,'arrival','ready');
assert.equal(arrivalDone.gatehouseReady,true);assert.equal(arrivalDone.transition,null);assert.ok(arrivalDone.companions.includes('gatewright'));
assert.equal(advanceChapterTransition(arrivalDone,'arrival','ready'),arrivalDone,'arrival checkpoint idempotent');
assert.equal(boosterCost(['jet','flywheel','prism']), 1100);
assert.throws(() => boosterCost(['jet','jet']));
for (const id of LEVEL_ORDER) {
  const plain = createPuzzle(LEVELS[id]); const frozen = JSON.stringify(plain);
  for (const loadout of [[],['jet'],['flywheel'],['prism'],['jet','flywheel','prism']]) {
    const boosted = applyStartingBoosters(plain,loadout);
    assert.equal(JSON.stringify(plain),frozen,`${id} ${loadout}: source is immutable`);
    assert.equal(boosted.seed,plain.seed); assert.equal(boosted.nextId,plain.nextId);
    assert.deepEqual(boosted.goals,plain.goals); assert.deepEqual(boosted.crust,plain.crust);
    assert.equal(boosted.board.flat().filter(tile=>tile && isSpecial(tile)).length,plain.board.flat().filter(tile=>tile && isSpecial(tile)).length+loadout.length);
    if (boosted.opening) assert.ok(playTurn(boosted,...boosted.opening).valid,`${id} ${loadout}: guided opening remains valid`);
    assert.deepEqual(applyStartingBoosters(plain,loadout).board,boosted.board,`${id} ${loadout}: placements deterministic`);
  }
}
const finalV4 = { ...arrivalDone, version:4, completed:[...LEVEL_ORDER], coins:1299 };
const migrationMemory = new Map([['dune-relay-campaign-v4',JSON.stringify(finalV4)]]);
const migratedFinal = readSave({getItem:key=>migrationMemory.get(key)??null,setItem:(key,value)=>migrationMemory.set(key,value)});
assert.equal(migratedFinal.demoEnding,'gate','completed v4 campaign resumes demo ending once');
assert.equal(migratedFinal.region,'gatehouse');
assert.equal(migratedFinal.coins,1299); assert.deepEqual(migratedFinal.completed,LEVEL_ORDER);
for (const stage of ['gate','film','thanks','done']) assert.equal(normalizeSave({...migratedFinal,demoEnding:stage}).demoEnding,stage);
const oasisOriginV4={...finalV4,region:'oasis'};
const migratedOasisOrigin=normalizeSave(oasisOriginV4);
assert.equal(migratedOasisOrigin.region,'gatehouse','pre-ack ending resumes at the gate even if last visited Oasis');
assert.equal(normalizeSave({...migratedOasisOrigin,demoEnding:'done',region:'oasis'}).region,'oasis','after acknowledgement visitor can revisit Oasis');
assert.equal(normalizeSave({...migratedFinal,demoEnding:'done'}).coins,1299);
console.log('Core checks passed: 30 levels, preserved boards, salt HP, Gatewright grant, saves, and playtest aggregation.');

// Opaque-origin Portal embeds may deny the localStorage getter itself.
const storageDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
try {
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new DOMException('Storage denied', 'SecurityError'); } });
  assert.deepEqual(readSave(), EMPTY_SAVE, 'denied storage allows guest campaign');
  assert.deepEqual(readArchive(), emptyArchive(), 'denied storage allows playtest in memory');
  assert.doesNotThrow(() => require('../src/game/save.ts').writeSave(EMPTY_SAVE));
  assert.doesNotThrow(() => require('../src/game/playtest.ts').writeArchive(emptyArchive()));
} finally {
  if (storageDescriptor) Object.defineProperty(globalThis, 'localStorage', storageDescriptor);
  else delete globalThis.localStorage;
}
