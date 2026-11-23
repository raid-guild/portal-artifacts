const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const Module = require('node:module');
Module._extensions['.ts'] = (module, filename) => {
  module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true, resolveJsonModule: true }
  }).outputText, filename);
};
const { LEVELS, LEVEL_ORDER } = require('../src/game/levels.ts');
const { advanceCurrent, createPuzzle, playTurn } = require('../src/game/core.ts');
const { castleLevelForCompanion, companionSnapshot } = require('../src/game/companionAbilities.ts');
const { normalizeSave, EMPTY_SAVE, completeLevel } = require('../src/game/save.ts');
const { TUTORIAL_BY_LEVEL } = require('../src/game/tutorials.ts');
const witnesses = require('./fixtures/river-winning-routes.json');
const ids = LEVEL_ORDER.slice(60);
assert.deepEqual(ids, ['riverBend','reedwaterReach','broadwaterTurn','saltlockedEddy','clearingTheBend','driftingCargo','reedbankDeliveries','splitwaterCargo','saltwindMooring','openTheCollectionRoute']);
assert.equal(witnesses.length, 50);
assert.equal(TUTORIAL_BY_LEVEL.riverBend.id,'current');
assert.equal(TUTORIAL_BY_LEVEL.saltlockedEddy.id,'frozenCurrent');
assert.equal(TUTORIAL_BY_LEVEL.riverBend.speaker,'skiff');
const offPath=createPuzzle(LEVELS.riverBend);
offPath.crust[0][0]=1;
const offPathTurn=playTurn(offPath,...LEVELS.riverBend.opening);
assert.equal(offPathTurn.steps.filter(step=>step.kind==='current').length,1,'off-route salt does not freeze the loop');

const river=LEVELS.riverBend, route=river.current;
const opening=createPuzzle(river);
const marked=opening.board.map(row=>row.map(tile=>tile&&{...tile}));
marked[4][3].jet='row';
const shifted=advanceCurrent(marked,route);
for(let index=0;index<route.length;index++) {
  const source=route[index],destination=route[(index+1)%route.length];
  assert.deepEqual(shifted[destination.row][destination.col],marked[source.row][source.col],'current moves full tile objects simultaneously');
}
assert.equal(new Set(shifted.flat().map(tile=>tile.id)).size,81,'current never clones a tile');
assert.deepEqual(shifted[0][0],marked[0][0],'off-route tiles remain unchanged');
for (const bad of [
  [route[0],route[0],...route.slice(2)],
  [{row:-1,col:3},...route.slice(1)],
  [route[0],route[2],route[1],...route.slice(3)],
]) assert.throws(()=>createPuzzle({...river,current:bad}),/Current must/);
const unchanged=JSON.stringify(opening);
const invalid=playTurn(opening,{row:0,col:0},{row:8,col:8});
assert.equal(invalid.valid,false);
assert.equal(invalid.steps.length,0);
assert.equal(JSON.stringify(opening),unchanged);
const first=playTurn(opening,...river.opening);
assert.equal(first.valid,true);
assert.equal(first.state.moves,river.moves-1);
const currentIndex=first.steps.findIndex(step=>step.kind==='current');
assert(currentIndex>0);
assert(first.steps.slice(0,currentIndex).some(step=>step.kind==='clear'));
assert(first.steps.slice(currentIndex+1).some(step=>step.kind==='clear'),'post-current match animates as a later clear');
assert.equal(first.steps[currentIndex].cells.length,route.length);
assert.deepEqual(playTurn(createPuzzle(river),...river.opening).steps,first.steps,'authored seed replays deterministically');
const waterSwap=playTurn(opening,{row:3,col:4},{row:3,col:5});
assert.equal(waterSwap.valid,true,'water tiles support normal swaps');
const direct=createPuzzle(river);direct.board[3][3].jet='row';
assert.equal(playTurn(direct,{row:3,col:3},{row:3,col:3}).steps.filter(step=>step.kind==='current').length,1);
const carried=createPuzzle(river);carried.board[4][3].power='prism';
const carriedTurn=playTurn(carried,...river.opening);
assert.equal(carriedTurn.stats.powersActivated.prism,0,'carried prism remains inert');
assert.equal(carriedTurn.state.board[3][3].power,'prism');
const newborn=playTurn(createPuzzle(river),{row:4,col:6},{row:5,col:6});
assert.equal(newborn.valid,true);
assert(newborn.powersCreated.length>0);
assert.deepEqual(newborn.stats.powersActivated,{jet:0,flywheel:0,prism:0},'new powers remain protected across current cascades');
const last=createPuzzle(river);last.moves=1;last.goals={water:3,leaf:0};last.keeperTarget=3;last.chargeSymbol='water';
const lastTurn=playTurn(last,...river.opening);
assert.equal(lastTurn.state.status,'won');
assert.equal(lastTurn.stats.companionGrants,1,'post-current clear charges companion');

for (const witness of witnesses) {
  const level = LEVELS[witness.levelId];
  assert.equal(level.chapter, 'river');
  let puzzle = createPuzzle(castleLevelForCompanion(level, companionSnapshot(witness.companionId)));
  for (const move of witness.moves) {
    const frozenBefore=level.current?.some(cell=>puzzle.crust[cell.row][cell.col]>0);
    const result = playTurn(puzzle, move.from, move.to);
    assert.equal(result.valid, true, `${witness.levelId}/${witness.companionId} valid move`);
    if (level.crust?.length) {
      const frozenAfter=level.current.some(cell=>result.state.crust[cell.row][cell.col]>0);
      assert.equal(result.steps.filter(step=>step.kind==='current').length, frozenAfter?0:1,
        `${witness.levelId}/${witness.companionId} current is frozen exactly while route salt remains`);
      if(frozenBefore && !frozenAfter) assert(result.steps.some(step=>step.kind==='current'),'last salt break frees the current that turn');
    }
    puzzle = result.state;
  }
  assert.equal(puzzle.status, 'won', `${witness.levelId}/${witness.companionId} wins without purchased powers`);
  assert.equal(puzzle.moves, witness.movesRemaining);
}
const oldCastle = normalizeSave({ ...EMPTY_SAVE, completed: LEVEL_ORDER.slice(0,60), region:'castle', castleReady:true, castleEnding:'done', activeCompanion:'keeper', oasisTransition:'ready', gatehouseReady:true, farmlandReady:true, townReady:true });
assert.equal(oldCastle.riverReady, false, 'new explicit riverReady:false follows the transition');
const { riverReady: ignored, ...oldPayload } = oldCastle;
const legacy = normalizeSave(oldPayload);
assert.equal(legacy.riverReady, true, 'legacy completed Castle save can board River without replay');
const atCastle = normalizeSave({ ...oldCastle, riverReady:false });
assert.equal(atCastle.riverReady, false, 'new Castle completion waits for handoff');
const withRiver = completeLevel(normalizeSave({ ...legacy, region:'river', riverReady:true, castleEnding:'done', completed:LEVEL_ORDER.slice(0,69) }), 'openTheCollectionRoute', 99);
assert.equal(withRiver.riverEnding,'thanks');
assert.equal(withRiver.completed.length,70);
console.log('River chapter checks passed: 50 winning routes, progression, and legacy Castle save.');
