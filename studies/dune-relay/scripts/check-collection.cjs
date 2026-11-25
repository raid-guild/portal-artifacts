const assert=require('node:assert/strict');
const fs=require('node:fs');
const ts=require('typescript');
const Module=require('node:module');
Module._extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true,resolveJsonModule:true}}).outputText,filename);
const {LEVELS,LEVEL_ORDER,MAP_DESTINATIONS}=require('../src/game/levels.ts');
const {createPuzzle,playTurn}=require('../src/game/core.ts');
const {castleLevelForCompanion,companionSnapshot}=require('../src/game/companionAbilities.ts');
const cloud=require('../../../services/leaderboards/src/dune-content.json');
const frozen=require('../../../services/leaderboards/src/dune-legacy-moves.json')['chapter-7-7'];
const witnesses=require('./fixtures/collection-winning-routes.json');
const ids=['firstDew','meshWalk','pairedCollectors','reservoirGlass','saltedFittings','supplyGantry','condensingBanks','collectionTwinTanks','recirculationDeck','openTheSkyRoute'];
const companions=['keeper','wayfinder','gatewright','fieldkeeper','towncrier','artificer'];
const counts=[25,30,24,36,30,35,40,36,35,49],wets=[3,4,4,4,4,5,5,4,5,7];
const cellKey=({row,col})=>`${row},${col}`;
const countTrue=grid=>grid.flat().filter(Boolean).length;
assert.deepEqual(LEVEL_ORDER.slice(70),ids);
assert.deepEqual(LEVEL_ORDER.slice(0,70),Object.keys(frozen),'Chapter 7 order remains frozen');
assert.deepEqual(cloud.levels.map(({id,moves,chapter})=>({id,moves,chapter})),LEVEL_ORDER.map(id=>({id,moves:LEVELS[id].moves,chapter:LEVELS[id].chapter??'oasis'})));
assert.equal(witnesses.length,60,'ten levels have six companion witnesses each');
assert.equal(new Set(witnesses.map(w=>`${w.levelId}/${w.companionId}`)).size,60,'one unique witness per level and companion');
assert.equal(new Set(ids.map(id=>LEVELS[id].destination)).size,10,'all ten destinations are unique');
for(const id of ids)assert.ok(MAP_DESTINATIONS[id],`${id} has a map destination`);
for(let index=0;index<ids.length;index++){
  const id=ids[index],level=LEVELS[id],puzzle=createPuzzle(level);
  assert.equal(level.chapter,'collection');
  assert.deepEqual(level.symbols,['water','gear','leaf','pennant','key'],'no sixth symbol');
  assert.equal(countTrue(puzzle.condensation.collectors),counts[index],`${id} collector count`);
  assert.equal(countTrue(puzzle.condensation.wet),wets[index],`${id} wet seed count`);
  assert.equal(puzzle.goals.condensation,counts[index]-wets[index],`${id} dry collector goal`);
  for(let row=0;row<9;row++)for(let col=0;col<9;col++){
    assert.ok(!puzzle.condensation.collectors[row][col]||puzzle.mask[row][col],`${id} collector is playable`);
    assert.ok(!puzzle.condensation.wet[row][col]||puzzle.condensation.collectors[row][col],`${id} wet terrain has collector`);
  }
  // Every disconnected bank has its own wet origin, so it can spread without
  // relying on a power-up from another bank.
  const unseen=new Set(level.condensation.collectors.map(cellKey));
  while(unseen.size){
    const component=[],queue=[unseen.values().next().value];
    while(queue.length){const key=queue.pop();if(!unseen.delete(key))continue;component.push(key);
      const [row,col]=key.split(',').map(Number);for(const next of [`${row-1},${col}`,`${row+1},${col}`,`${row},${col-1}`,`${row},${col+1}`])if(unseen.has(next))queue.push(next);
    }
    assert.ok(component.some(key=>{const [row,col]=key.split(',').map(Number);return puzzle.condensation.wet[row][col];}),`${id} disconnected bank starts wet`);
  }
  assert.equal(puzzle.goals.crust??0,level.crust?.length??0,`${id} salt goal`);
  if(index>=6){
    assert.equal(level.crust.length,[6,2,3,4][index-6],`${id} salt-sealed net count`);
    for(const salt of level.crust){
      assert.equal(puzzle.condensation.collectors[salt.row][salt.col],true,`${id} salt seals a collector`);
      assert.equal(puzzle.condensation.wet[salt.row][salt.col],false,`${id} salt-sealed collector starts dry`);
    }
  }
  assert.equal(puzzle.goals.crate??0,level.crates?.length??0,`${id} crate goal`);
  if(level.crates?.length){
    for(let col=0;col<9;col++)assert.equal(puzzle.mask[8][col],true,`${id} bottom exit remains open`);
    for(const crate of level.crates)for(let row=crate.row;row<9;row++)assert.equal(puzzle.mask[row][crate.col],true,`${id} crate has a straight exit path`);
  }
  if(id==='recirculationDeck'){
    assert.equal(puzzle.currents.length,1);
    for(const route of puzzle.currents)for(const cell of route.cells)assert.equal(puzzle.mask[cell.row][cell.col],true,'current runs on playable board');
  }
}
const summaries=[];
for(const id of ids){
  const remaining=[];
  for(const companionId of companions){
    const witness=witnesses.find(w=>w.levelId===id&&w.companionId===companionId);
    assert.ok(witness,`${id}/${companionId} route exists`);
    let puzzle=createPuzzle(castleLevelForCompanion(LEVELS[id],companionSnapshot(companionId)));
    const fixedCollectors=JSON.stringify(puzzle.condensation.collectors);
    const initialRemaining=puzzle.goals.condensation;
    for(const [turnIndex,move] of witness.moves.entries()){
      assert.ok(puzzle.moves>0,`${id}/${companionId} route stays within budget`);
      const beforeWet=countTrue(puzzle.condensation.wet);
      const turn=playTurn(puzzle,move.from,move.to);
      assert.equal(turn.valid,true,`${id}/${companionId} move ${turnIndex+1} valid`);
      puzzle=turn.state;
      assert.equal(JSON.stringify(puzzle.condensation.collectors),fixedCollectors,`${id} terrain stays fixed after swap, fall and current`);
      assert.ok(countTrue(puzzle.condensation.wet)>=beforeWet,`${id} wet terrain never dries`);
      for(let row=0;row<9;row++)for(let col=0;col<9;col++)assert.ok(!puzzle.condensation.wet[row][col]||puzzle.condensation.collectors[row][col],`${id} only collectors become wet`);
    }
    assert.equal(puzzle.status,'won',`${id}/${companionId} wins without boosters or JIT tools`);
    assert.equal(puzzle.goals.condensation,0);
    assert.equal(countTrue(puzzle.condensation.wet)-countTrue(createPuzzle(LEVELS[id]).condensation.wet),initialRemaining);
    assert.equal(puzzle.moves,witness.movesRemaining);
    remaining.push(puzzle.moves);
  }
  summaries.push(`${id}: ${remaining.join(',')} moves left`);
}
console.log(`Collection checks passed: ${ids.length} levels, ${witnesses.length} no-booster winning routes, stable terrain, goals, exits, and map destinations.`);
console.log(summaries.join('\n'));
