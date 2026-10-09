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
  const progress=createGameProgress({storage:store});assert.equal(progress.getBest(1).percent,50);
  assert.equal(progress.isUnlocked(2),true);
  assert.equal(scoreRun(counts).percent,50);
});
