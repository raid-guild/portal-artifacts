import test from 'node:test';
import assert from 'node:assert/strict';
import {scoreRun} from '../src/game-score.js';
import {createGameProgress,PROGRESS_KEY} from '../src/game-progress.js';
import {createLocalLevelProgress,LOCAL_PROGRESS_KEY} from '../src/local-levels.js';
const memory=()=>{const entries=new Map();return {getItem:k=>entries.get(k)||null,setItem:(k,v)=>entries.set(k,v)};};
const counts={gold:9,gems:1,totalGold:17,totalGems:3};
test('malformed timers cannot become legacy scores or unlock levels',()=>{
  for(const elapsed of [-1,null,NaN,Infinity]){
    assert.equal(scoreRun({...counts,elapsed,target:30}),null);
    const progress=createGameProgress({storage:memory()});
    assert.equal(progress.recordCompletion(1,{gold:9,gems:1,elapsed}),false);
    assert.equal(progress.isUnlocked(2),false);
    const local=createLocalLevelProgress({storage:memory()});
    assert.equal(local.recordCompletion('level',1,{...counts,elapsed,target:30}),false);
  }
  for(const target of [0,-1,null,NaN,Infinity]){
    assert.equal(createLocalLevelProgress({storage:memory()}).recordCompletion('level',1,
      {...counts,elapsed:10,target}),false);
  }
});
test('invalid persisted timers are discarded while genuine legacy results remain',()=>{
  for(const elapsed of [-1,null]){
    const store=memory();store.setItem(PROGRESS_KEY,JSON.stringify({version:2,best:{1:{gold:9,gems:1,elapsed,target:30}}}));
    assert.equal(createGameProgress({storage:store}).getBest(1),null);
    store.setItem(LOCAL_PROGRESS_KEY,JSON.stringify({version:2,best:{'level:1':{...counts,elapsed,target:30}}}));
    assert.equal(createLocalLevelProgress({storage:store}).getBest('level',1),null);
  }
  const store=memory();store.setItem(PROGRESS_KEY,JSON.stringify({version:1,best:{1:{gold:9,gems:1}}}));
  const progress=createGameProgress({storage:store});assert.equal(progress.getBest(1),null,'retired nursery PB is archived');
  assert.equal(progress.isUnlocked(2),true);
  assert.equal(scoreRun(counts).percent,50);
});
test('old blended campaign scores retain collection and unlocks without a retroactive time bonus',()=>{
  const store=memory();store.setItem(PROGRESS_KEY,JSON.stringify({version:2,
    best:{1:{gold:8,gems:1,elapsed:12,target:30}},
    bestCollection:{1:{gold:9,gems:1}}}));
  const progress=createGameProgress({storage:store});
  assert.equal(progress.getBest(1),null,'the revised course needs a fresh result');
  assert.equal(progress.isUnlocked(2),true);
  progress.recordCompletion(1,{gold:17,gems:3,elapsed:20});
  assert.equal(progress.getBest(1).percent,100);
  assert.equal(progress.getBest(1).points,1100);
});
