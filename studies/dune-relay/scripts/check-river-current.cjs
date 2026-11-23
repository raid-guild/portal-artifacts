const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const Module = require('node:module');
Module._extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  module._compile(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, filename);
};

const { advanceCurrent, createPuzzle, playTurn } = require('../src/game/core.ts');
const { RIVER_BEND, RIVER_CURRENT } = require('../src/game/riverPrototype.ts');

const puzzle = createPuzzle(RIVER_BEND);
assert.deepEqual(puzzle.current, RIVER_CURRENT);
assert.equal(puzzle.board.length, 9);
assert.equal(puzzle.board.flat().length, 81);
assert.equal(puzzle.symbols.length, 5);
assert.deepEqual(puzzle.opening, RIVER_BEND.opening);

// The current permutes complete tile objects simultaneously. It cannot clone a
// power or touch cells outside the route.
const marked = puzzle.board.map(row => row.map(tile => tile && { ...tile }));
marked[4][3].jet = 'row';
const advanced = advanceCurrent(marked, RIVER_CURRENT);
for (let i = 0; i < RIVER_CURRENT.length; i++) {
  const source = RIVER_CURRENT[i], destination = RIVER_CURRENT[(i + 1) % RIVER_CURRENT.length];
  assert.deepEqual(advanced[destination.row][destination.col], marked[source.row][source.col]);
}
assert.equal(advanced[3][3].jet, 'row');
assert.deepEqual(advanced[0][0], marked[0][0]);
assert.notEqual(advanced[0][0], marked[0][0], 'result does not alias input tiles');
assert.equal(new Set(advanced.flat().map(tile => tile.id)).size, 81);

for (const bad of [
  [RIVER_CURRENT[0], RIVER_CURRENT[0], ...RIVER_CURRENT.slice(2)],
  [{ row: -1, col: 3 }, ...RIVER_CURRENT.slice(1)],
  [RIVER_CURRENT[0], RIVER_CURRENT[2], RIVER_CURRENT[1], ...RIVER_CURRENT.slice(3)],
]) assert.throws(() => createPuzzle({ ...RIVER_BEND, current: bad }), /Current must/);

const untouched = JSON.stringify(puzzle);
const badSwap = playTurn(puzzle, { row: 0, col: 0 }, { row: 8, col: 8 });
assert.equal(badSwap.valid, false);
assert.equal(badSwap.steps.length, 0);
assert.equal(badSwap.state, puzzle);
assert.equal(JSON.stringify(puzzle), untouched);

const turn = playTurn(puzzle, ...RIVER_BEND.opening);
assert.equal(turn.valid, true);
assert.equal(turn.state.moves, 25);
assert.equal(turn.steps.filter(step => step.kind === 'current').length, 1);
const currentAt = turn.steps.findIndex(step => step.kind === 'current');
assert.equal(turn.steps[currentAt].cells.length, 8);
assert.equal(turn.steps.slice(0, currentAt).some(step => step.kind === 'clear'), true);
assert.equal(turn.steps.slice(currentAt + 1).some(step => step.kind === 'clear'), true, 'opening move creates a post-current match');
assert.equal(turn.steps[currentAt].goals.water, 24);
assert.equal(turn.state.goals.water, 21, 'post-current clear credits water goals');
assert.equal(JSON.stringify(puzzle), untouched, 'turn is immutable');
assert.deepEqual(playTurn(createPuzzle(RIVER_BEND), ...RIVER_BEND.opening).steps, turn.steps, 'same seed produces same current sequence');

const waterSwap = playTurn(puzzle, { row: 3, col: 4 }, { row: 3, col: 5 });
assert.equal(waterSwap.valid, true, 'water cells accept normal adjacent swaps');
assert.equal(waterSwap.steps.filter(step => step.kind === 'current').length, 1);

const directPuzzle = createPuzzle(RIVER_BEND);
directPuzzle.board[3][3].jet = 'row';
const direct = playTurn(directPuzzle, { row: 3, col: 3 }, { row: 3, col: 3 });
assert.equal(direct.valid, true);
assert.equal(direct.steps.filter(step => step.kind === 'current').length, 1, 'direct activation advances exactly once');

const carrying = createPuzzle(RIVER_BEND);
carrying.board[4][3].power = 'prism';
const carried = playTurn(carrying, ...RIVER_BEND.opening);
assert.equal(carried.stats.powersActivated.prism, 0, 'the current does not activate a carried power');
assert.equal(carried.state.board[3][3].power, 'prism');

const newborn = playTurn(createPuzzle(RIVER_BEND), { row: 4, col: 6 }, { row: 5, col: 6 });
assert.equal(newborn.valid, true);
assert.equal(newborn.powersCreated.length, 2);
assert.deepEqual(newborn.stats.powersActivated, { jet: 0, flywheel: 0, prism: 0 }, 'new powers remain protected through current cascades');
assert.equal(newborn.state.board.flat().filter(tile => tile?.jet || tile?.power).length, 2);
assert.equal(newborn.steps.filter(step => step.kind === 'current').length, 1);

const lastMove = createPuzzle(RIVER_BEND);
lastMove.moves = 1;
lastMove.goals = { water: 3, leaf: 0 };
lastMove.keeperTarget = 3;
lastMove.chargeSymbol = 'water';
const won = playTurn(lastMove, ...RIVER_BEND.opening);
assert.equal(won.state.status, 'won', 'the current can finish a level on the last move');
assert.equal(won.state.goals.water, 0);
assert.equal(won.stats.companionGrants, 1, 'post-current clears charge companion power');
assert.equal(won.steps.filter(step => step.kind === 'current').length, 1);

console.log('River current checks passed: route, swaps, single advance, carried/new powers, current goals and last-move win.');
