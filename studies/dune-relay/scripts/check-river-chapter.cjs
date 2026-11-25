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
assert.equal(TUTORIAL_BY_LEVEL.broadwaterTurn.id,'wrapCurrent');
assert.equal(TUTORIAL_BY_LEVEL.clearingTheBend.id,'frozenCurrent');
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

const currentStep = result => result.steps.find(step=>step.kind==='current');
const routeFrozen = (puzzle, route) => route.cells.some(cell=>puzzle.crust[cell.row][cell.col]>0);
const openingTurn = level => {
  const puzzle=createPuzzle(level);
  for(let row=0;row<9;row++) for(let col=0;col<9;col++) {
    for(const to of [{row,col:col+1},{row:row+1,col}]) {
      if(to.row>=9||to.col>=9) continue;
      const result=playTurn(puzzle,{row,col},to);
      if(result.valid) return result;
    }
  }
  throw new Error(`No opening move for ${level.id}`);
};
for (const id of ids) {
  const level=LEVELS[id], puzzle=createPuzzle(level);
  assert.equal(puzzle.currents.length,level.currents?.length??1,`${id} route count`);
  if(level.boardLayout) {
    assert.equal(level.boardLayout.length,9);
    assert.deepEqual(puzzle.mask.map(row=>row.map(Boolean)),level.boardLayout.map(row=>[...row].map(c=>c==='#')));
  }
  for(const route of puzzle.currents) {
    assert.equal(new Set(route.cells.map(cell=>`${cell.row},${cell.col}`)).size,route.cells.length,`${id} route unique cells`);
  }
}
for (const [id, saltCount, playableCount, frozenCount] of [
  ['splitwaterCargo', 4, 79, 1],
  ['saltwindMooring', 5, 73, 1],
  ['openTheCollectionRoute', 6, 79, 2],
]) {
  const puzzle=createPuzzle(LEVELS[id]);
  assert.equal(LEVELS[id].crust.length,saltCount,`${id} authored salt count`);
  assert.equal(puzzle.goals.crust,saltCount,`${id} salt collection target`);
  assert.equal(puzzle.mask.flat().filter(Boolean).length,playableCount,`${id} playable cells`);
  assert.equal(puzzle.currents.filter(route=>routeFrozen(puzzle,route)).length,frozenCount,`${id} frozen routes`);
  for(let col=0;col<9;col++) {
    assert.equal(puzzle.mask[8][col],true,`${id} every exit stays on the bottom edge`);
    let seenPlayable=false;
    for(let row=0;row<9;row++){
      if(puzzle.mask[row][col])seenPlayable=true;
      else assert.equal(seenPlayable,false,`${id} no internal exit in column ${col}`);
    }
  }
}
const twin=openingTurn(LEVELS.saltlockedEddy);
assert.deepEqual(currentStep(twin).currentRouteIds,['west-eddy','east-eddy'],'both opposing routes move in one current phase');
assert.equal(currentStep(twin).currentMotions.length,24);
const opposing=openingTurn(LEVELS.driftingCargo);
assert.deepEqual(currentStep(opposing).currentRouteIds,['eastbound','westbound'],'adjacent opposing lanes advance together');
assert.equal(currentStep(opposing).currentMotions.filter(motion=>motion.wrap).length,2,'both opposite lanes wrap at their own edge');
const movedIds=currentStep(opposing).board.flat().filter(Boolean).map(tile=>tile.id);
assert.equal(new Set(movedIds).size,movedIds.length,'counterflow never clones a tile');
const nested=openingTurn(LEVELS.splitwaterCargo);
assert.deepEqual(currentStep(nested).currentRouteIds,['inner-whirlpool'],'salt freezes only the outer nested loop');
assert.equal(LEVELS.openTheCollectionRoute.currents.length,2,'finale retains two separate whirlpools');
const frozen=openingTurn(LEVELS.clearingTheBend);
assert.deepEqual(currentStep(frozen).currentRouteIds,['east-eddy'],'salt freezes only its route');
const wrapping=openingTurn(LEVELS.broadwaterTurn);
const wrapMotion=currentStep(wrapping).currentMotions.filter(motion=>motion.wrap);
assert.equal(wrapMotion.length,1,'one closing jump wraps');
assert.deepEqual(wrapMotion[0].wrap,{entry:'left',exit:'right'});
assert.equal(wrapMotion[0].from.col,8);
assert.equal(wrapMotion[0].to.col,0);
assert.equal(currentStep(wrapping).board[wrapMotion[0].to.row][wrapMotion[0].to.col].id,wrapMotion[0].tileId,'wrap preserves tile identity');
const wrapLevel=LEVELS.broadwaterTurn, left=wrapLevel.currents[0];
for (const bad of [
  [{...left,id:''}],
  [{...left,exit:'left'}],
  [{...left,closure:'portal'}],
  [{...left,entry:undefined}],
  [{...left,exit:undefined}],
  [{...left,entry:'toString'}],
  [{...left,exit:'toString'}],
  [{...left,cells:[{row:4,col:1},...left.cells.slice(1)]}],
  [{...left,cells:[...left.cells.slice(0,-1),{row:3,col:8}]}],
  [left,left],
  [left,{...left,id:'other'}],
  [left,{...left,id:'other',cells:[{row:1,col:1},{row:1,col:2},{row:2,col:2},{row:2,col:1}]},{...left,id:'third'}],
]) assert.throws(()=>createPuzzle({...wrapLevel,currents:bad}),/Current/,'invalid route is rejected');
assert.throws(()=>createPuzzle({...wrapLevel,boardLayout:['#########']}),/Board layout/);
assert.throws(()=>createPuzzle({...wrapLevel,boardShape:'clippedCorners'}),/board layout or shape/);
assert.throws(()=>createPuzzle({...wrapLevel,current:route}),/legacy current or named currents/);
let upwardCargo=0, deliveredAfterUpward=new Set();
for (const witness of witnesses) {
  const level = LEVELS[witness.levelId];
  assert.equal(level.chapter, 'river');
  let puzzle = createPuzzle(castleLevelForCompanion(level, companionSnapshot(witness.companionId)));
  const seenUpward = new Set();
  for (const move of witness.moves) {
    const frozenBefore=(puzzle.currents??[]).filter(route=>routeFrozen(puzzle,route)).map(route=>route.id);
    const result = playTurn(puzzle, move.from, move.to);
    assert.equal(result.valid, true, `${witness.levelId}/${witness.companionId} valid move`);
    // A post-current match can break another seal; that route starts next turn.
    const current=result.steps.find(step=>step.kind==='current');
    const currentCrust=current?.crust??result.state.crust;
    const active=(puzzle.currents??[]).filter(route=>!routeFrozen({...puzzle,crust:currentCrust},route)).map(route=>route.id);
    assert.equal(result.steps.filter(step=>step.kind==='current').length,active.length?1:0,
      `${witness.levelId}/${witness.companionId} one current step only when a route is active`);
    if(active.length) assert.deepEqual(currentStep(result).currentRouteIds,active,'active route IDs match salt state after ordinary resolution');
    for(const id of frozenBefore) {
      if(active.includes(id)) assert(currentStep(result).currentRouteIds.includes(id),'last salt break releases route that turn');
    }
    if(witness.levelId==='splitwaterCargo'&&witness.companionId==='keeper') {
      for(const motion of currentStep(result)?.currentMotions??[]) if(motion.from.row>motion.to.row) {
        const tile=puzzle.board.flat().find(tile=>tile?.id===motion.tileId);
        if(tile?.kind==='crate') { seenUpward.add(motion.tileId);upwardCargo++; }
      }
      for(const step of result.steps) for(const delivery of step.deliveries??[]) if(seenUpward.has(delivery.id)) deliveredAfterUpward.add(delivery.id);
    }
    puzzle = result.state;
  }
  assert.equal(puzzle.status, 'won', `${witness.levelId}/${witness.companionId} wins without purchased powers`);
  assert.equal(puzzle.moves, witness.movesRemaining);
}
assert(upwardCargo>0,'7.8 winning path carries a crate upward in a current');
assert(deliveredAfterUpward.size>0,'7.8 winning path later delivers a crate carried upward');
const oldCastle = normalizeSave({ ...EMPTY_SAVE, completed: LEVEL_ORDER.slice(0,60), region:'castle', castleReady:true, castleEnding:'done', activeCompanion:'keeper', oasisTransition:'ready', gatehouseReady:true, farmlandReady:true, townReady:true });
assert.equal(oldCastle.riverReady, false, 'new explicit riverReady:false follows the transition');
const { riverReady: ignored, ...oldPayload } = oldCastle;
const legacy = normalizeSave(oldPayload);
assert.equal(legacy.riverReady, true, 'legacy completed Castle save can board River without replay');
const atCastle = normalizeSave({ ...oldCastle, riverReady:false });
assert.equal(atCastle.riverReady, false, 'new Castle completion waits for handoff');
const withRiver = completeLevel(normalizeSave({ ...legacy, region:'river', riverReady:true, castleEnding:'done', completed:LEVEL_ORDER.slice(0,69) }), 'openTheCollectionRoute', 99);
assert.equal(withRiver.riverEnding,'film');
assert.equal(withRiver.completed.length,70);
console.log('River chapter checks passed: 50 winning routes, progression, and legacy Castle save.');
