import test from 'node:test';
import assert from 'node:assert/strict';
import {createGameProgress,completionPercent,meetsUnlockThreshold,PROGRESS_KEY} from '../src/game-progress.js';
import {PuddleSimulation} from '../src/simulation.js';

function memoryStorage(){const values=new Map();let writes=0;return {
  getItem:key=>values.get(key)??null,
  setItem(key,value){writes++;values.set(key,value);},
  get writes(){return writes;},values
};}

test('the exact half-collectible threshold unlocks the next garden permanently',()=>{
  const storage=memoryStorage(),progress=createGameProgress({storage});
  assert.equal(progress.isUnlocked(1),true);assert.equal(progress.isUnlocked(2),false);
  assert.equal(completionPercent(1,{gold:8,gems:1}),45);
  assert.equal(meetsUnlockThreshold(1,{gold:8,gems:1}),false);
  progress.recordCompletion(1,{gold:8,gems:1});
  assert.equal(progress.getBest(1).percent,45);assert.equal(progress.isUnlocked(2),false);
  assert.equal(meetsUnlockThreshold(1,{gold:9,gems:1}),true);
  progress.recordCompletion(1,{gold:9,gems:1});
  assert.equal(progress.getBest(1).percent,50);assert.equal(progress.isUnlocked(2),true);
  const writes=storage.writes;
  assert.equal(progress.recordCompletion(1,{gold:7,gems:1}),false);
  assert.equal(storage.writes,writes,'unchanged or worse results do not write storage');
  assert.equal(createGameProgress({storage}).isUnlocked(2),true,'unlock survives reload');
});

test('every known completed level saves its best result, including the final floor',()=>{
  const storage=memoryStorage(),progress=createGameProgress({storage});
  for(let id=1;id<=5;id++)progress.recordCompletion(id,{gold:12,gems:2});
  assert.deepEqual(progress.snapshot().unlocked,[1,2,3,4,5]);
  assert.equal(progress.getBest(5).percent,70);
  progress.recordCompletion(5,{gold:17,gems:3});
  assert.equal(createGameProgress({storage}).getBest(5).percent,100);
  assert.equal(progress.recordCompletion(6,{gold:17,gems:3}),false);
  const simulation=new PuddleSimulation();
  assert.equal(simulation.startGarden(5),true,'simulation remains independent of saved access');
});

test('malformed, unknown, and unavailable storage safely degrade to memory',()=>{
  const storage=memoryStorage();storage.values.set(PROGRESS_KEY,'{bad json');
  let progress=createGameProgress({storage});assert.deepEqual(progress.snapshot().unlocked,[1]);
  storage.values.set(PROGRESS_KEY,JSON.stringify({version:1,best:{1:{gold:99,gems:1},2:{gold:9,gems:1}},unlocked:[2,999,'3']}));
  progress=createGameProgress({storage});
  assert.equal(progress.getBest(1),null);assert.equal(progress.getBest(2).percent,50);
  assert.deepEqual(progress.snapshot().unlocked,[1,3],'a qualifying Level 2 result unlocks 3 without forging access to 2');
  storage.values.set(PROGRESS_KEY,JSON.stringify({version:1,best:{},unlocked:[2,3,4,5]}));
  progress=createGameProgress({storage});
  assert.deepEqual(progress.snapshot().unlocked,[1],'persisted IDs without qualifying results cannot bypass production access');
  const denied={getItem(){throw Error('denied');},setItem(){throw Error('denied');}};
  progress=createGameProgress({storage:denied});progress.recordCompletion(1,{gold:9,gems:1});
  assert.equal(progress.isUnlocked(2),true);
  assert.equal(progress.getBest(1).percent,50);
});
