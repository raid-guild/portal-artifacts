import test from 'node:test';
import assert from 'node:assert/strict';
import {createGameProgress,completionPercent,meetsUnlockThreshold,PROGRESS_KEY} from '../src/game-progress.js';
import {PuddleSimulation} from '../src/simulation.js';
import {PUDDLE_LEVELS} from '../src/ranked-content.js';

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

test('Level 5 unlocks Hollow Crown and the final floor saves its best result',()=>{
  const storage=memoryStorage(),progress=createGameProgress({storage});
  for(let id=1;id<=5;id++)progress.recordCompletion(id,{gold:12,gems:2});
  assert.deepEqual(progress.snapshot().unlocked,[1,2,3,4,5,6]);
  assert.equal(progress.getBest(5).percent,70);
  progress.recordCompletion(5,{gold:17,gems:3});
  assert.equal(createGameProgress({storage}).getBest(5).percent,100);
  assert.equal(progress.recordCompletion(6,{gold:18,gems:3}),true);
  assert.equal(progress.getBest(6).percent,50);
  assert.equal(progress.recordCompletion(6,{gold:36,gems:6}),true);
  assert.equal(createGameProgress({storage}).getBest(6).percent,100);
  assert.equal(progress.isUnlocked(7),true);
  assert.equal(progress.recordCompletion(7,{gold:28,gems:4}),true);
  assert.equal(progress.recordCompletion(8,{gold:36,gems:6}),false);
  const simulation=new PuddleSimulation();
  assert.equal(simulation.startGarden(5),true,'simulation remains independent of saved access');
});

test('malformed, unknown, and unavailable storage safely degrade to memory',()=>{
  const storage=memoryStorage();storage.values.set(PROGRESS_KEY,'{bad json');
  let progress=createGameProgress({storage});assert.deepEqual(progress.snapshot().unlocked,[1]);
  storage.values.set(PROGRESS_KEY,JSON.stringify({version:1,best:{1:{gold:99,gems:1},2:{gold:9,gems:1}},unlocked:[2,999,'3']}));
  progress=createGameProgress({storage});
  assert.equal(progress.getBest(1),null);assert.equal(progress.getBest(2),null,'old cistern result is retired');
  assert.deepEqual(progress.snapshot().unlocked,[1,3],'a qualifying Level 2 result unlocks 3 without forging access to 2');
  storage.values.set(PROGRESS_KEY,JSON.stringify({version:1,best:{},unlocked:[2,3,4,5]}));
  progress=createGameProgress({storage});
  assert.deepEqual(progress.snapshot().unlocked,[1],'persisted IDs without qualifying results cannot bypass production access');
  const denied={getItem(){throw Error('denied');},setItem(){throw Error('denied');}};
  progress=createGameProgress({storage:denied});progress.recordCompletion(1,{gold:9,gems:1});
  assert.equal(progress.isUnlocked(2),true);
  assert.equal(progress.getBest(1).percent,50);
});

test('completed older courses retire the three changed PBs while preserving earned access',()=>{
  const storage=memoryStorage();storage.values.set(PROGRESS_KEY,JSON.stringify({version:3,
    best:{1:{gold:17,gems:3,elapsed:22},2:{gold:12,gems:2,elapsed:65},3:{gold:10,gems:2,elapsed:44}},
    bestCollection:{1:{gold:17,gems:3},2:{gold:12,gems:2},3:{gold:10,gems:2}},unlocked:[1,2,3,4]}));
  const progress=createGameProgress({storage});
  assert.equal(progress.getBest(1),null,'the new nursery begins with a clean personal best');
  assert.equal(progress.getBest(2),null,'the new cistern begins with a clean personal best');
  assert.equal(progress.getBest(3),null,'the new silt loom begins with a clean personal best');
  assert.deepEqual(progress.snapshot().unlocked,[1,2,3,4]);
  progress.recordCompletion(1,{gold:9,gems:1,elapsed:29});
  assert.equal(progress.getBest(1).contentId,PUDDLE_LEVELS[1].contentId);
  progress.recordCompletion(2,{gold:10,gems:2,elapsed:44});
  assert.equal(progress.getBest(2).contentId,PUDDLE_LEVELS[2].contentId);
  const restored=createGameProgress({storage});
  assert.deepEqual(restored.snapshot().unlocked,[1,2,3,4]);
  assert.equal(restored.getBest(2).gold,10);
  assert.equal(restored.getBest(3),null);
  assert.equal(restored.snapshot().version,5);
});

test('a stale Silt Loom score retires without relocking Level 4 or changing other floors',()=>{
  const storage=memoryStorage();storage.values.set(PROGRESS_KEY,JSON.stringify({version:5,
    best:{1:{gold:12,gems:2,contentId:PUDDLE_LEVELS[1].contentId},
      2:{gold:12,gems:2,contentId:PUDDLE_LEVELS[2].contentId},
      3:{gold:17,gems:3,contentId:'2fc182ca57392100'},
      4:{gold:12,gems:2,contentId:PUDDLE_LEVELS[4].contentId},
      5:{gold:12,gems:2,contentId:PUDDLE_LEVELS[5].contentId}},
    bestCollection:{3:{gold:17,gems:3,contentId:'2fc182ca57392100'}},unlocked:[1,2,3,4,5,6]}));
  const progress=createGameProgress({storage});
  assert.equal(progress.getBest(1)?.gold,12);assert.equal(progress.getBest(2)?.gold,12);
  assert.equal(progress.getBest(3),null);assert.equal(progress.getBest(4)?.gold,12);
  assert.equal(progress.getBest(5)?.gold,12);assert.equal(progress.isUnlocked(4),true);
  progress.recordCompletion(3,{gold:10,gems:1,elapsed:55});
  const saved=createGameProgress({storage});
  assert.equal(saved.getBest(3)?.contentId,PUDDLE_LEVELS[3].contentId);
  assert.equal(saved.isUnlocked(4),true);
});

test('a stale Reach Garden record retires on The Threadworks while earned Level 5 stays open',()=>{
  const storage=memoryStorage();storage.values.set(PROGRESS_KEY,JSON.stringify({version:5,
    best:{3:{gold:13,gems:2,contentId:PUDDLE_LEVELS[3].contentId},
      4:{gold:17,gems:3,elapsed:50,contentId:'retired-reach-garden'},
      5:{gold:10,gems:2,contentId:PUDDLE_LEVELS[5].contentId}},
    bestCollection:{4:{gold:17,gems:3,contentId:'retired-reach-garden'}},unlocked:[1,2,3,4,5,6]}));
  const progress=createGameProgress({storage});
  assert.equal(progress.getBest(4),null);
  assert.equal(progress.getBest(3)?.gold,13);assert.equal(progress.getBest(5)?.gold,10);
  assert.equal(progress.isUnlocked(5),true);
  progress.recordCompletion(4,{gold:11,gems:2,elapsed:55});
  const restored=createGameProgress({storage});
  assert.equal(restored.getBest(4)?.contentId,PUDDLE_LEVELS[4].contentId);
  assert.equal(restored.isUnlocked(5),true);
});

test('a stale Grip Garden record retires on Rootwell Gallery while earned Level 6 stays open',()=>{
  const storage=memoryStorage();storage.values.set(PROGRESS_KEY,JSON.stringify({version:5,
    best:{4:{gold:13,gems:2,contentId:PUDDLE_LEVELS[4].contentId},
      5:{gold:17,gems:3,elapsed:50,contentId:'retired-grip-garden'},
      6:{gold:18,gems:3,contentId:PUDDLE_LEVELS[6].contentId}},
    bestCollection:{5:{gold:17,gems:3,contentId:'retired-grip-garden'}},unlocked:[1,2,3,4,5,6,7]}));
  const progress=createGameProgress({storage});
  assert.equal(progress.getBest(5),null);
  assert.equal(progress.getBest(4)?.gold,13);assert.equal(progress.getBest(6)?.gold,18);
  assert.equal(progress.isUnlocked(6),true);
  progress.recordCompletion(5,{gold:11,gems:2,elapsed:55});
  const restored=createGameProgress({storage});
  assert.equal(restored.getBest(5)?.contentId,PUDDLE_LEVELS[5].contentId);
  assert.equal(restored.isUnlocked(6),true);
});

test('revised Hollow Crown and Ember Cascade retire only their old scores while preserving earned access',()=>{
  const storage=memoryStorage();storage.values.set(PROGRESS_KEY,JSON.stringify({version:5,
    best:{5:{gold:17,gems:3,contentId:PUDDLE_LEVELS[5].contentId},
      6:{gold:36,gems:6,contentId:'86cfe9443f906f77'},
      7:{gold:55,gems:7,contentId:'75312851bc01c136'}},
    bestCollection:{6:{gold:36,gems:6,contentId:'86cfe9443f906f77'},
      7:{gold:55,gems:7,contentId:'75312851bc01c136'}},unlocked:[1,2,3,4,5,6,7]}));
  const progress=createGameProgress({storage});
  assert.equal(progress.getBest(5)?.gold,17);
  assert.equal(progress.getBest(6),null);
  assert.equal(progress.getBest(7),null);
  assert.equal(progress.isUnlocked(7),true);
  progress.recordCompletion(6,{gold:26,gems:4,elapsed:80});
  assert.equal(createGameProgress({storage}).getBest(6)?.contentId,PUDDLE_LEVELS[6].contentId);
});

test('version 4 keeps current nursery and later records while retiring only the old cistern',()=>{
  const storage=memoryStorage();storage.values.set(PROGRESS_KEY,JSON.stringify({version:4,
    best:{1:{gold:17,gems:3,elapsed:28,contentId:PUDDLE_LEVELS[1].contentId},
      2:{gold:17,gems:3,elapsed:40,contentId:'62c72bfba949027f'},
      3:{gold:10,gems:2,elapsed:45,contentId:PUDDLE_LEVELS[3].contentId}},
    bestCollection:{1:{gold:17,gems:3,contentId:PUDDLE_LEVELS[1].contentId},
      2:{gold:17,gems:3,contentId:'62c72bfba949027f'},
      3:{gold:10,gems:2,contentId:PUDDLE_LEVELS[3].contentId}},
    unlocked:[1,2,3,4,999,'5']}));
  const progress=createGameProgress({storage});
  assert.equal(progress.getBest(1).gold,17);
  assert.equal(progress.getBest(2),null);
  assert.equal(progress.getBest(3).gold,10);
  assert.deepEqual(progress.snapshot().unlocked,[1,2,3,4]);
  progress.recordCompletion(2,{gold:9,gems:1,elapsed:45});
  const restored=createGameProgress({storage});
  assert.equal(restored.getBest(1).gold,17);
  assert.equal(restored.getBest(2).contentId,PUDDLE_LEVELS[2].contentId);
  assert.equal(restored.getBest(3).gold,10);
});

test('a fast partial high score does not replace the largest collection',()=>{
  const storage=memoryStorage(),progress=createGameProgress({storage});
  progress.recordCompletion(1,{gold:17,gems:3,elapsed:120});
  progress.recordCompletion(1,{gold:16,gems:2,elapsed:1});
  const best=progress.getBest(1);
  assert.equal(best.collectionPercent,100);
  assert.deepEqual(best.bestCollection,{gold:17,gems:3,contentId:progress.snapshot().bestCollection[1].contentId});
  assert.equal(best.points,1190);
  assert.equal(best.bestPointsRun.percent,90);
  assert.equal(best.bestPointsRun.elapsed,1);
  const restored=createGameProgress({storage}).getBest(1);
  assert.deepEqual(restored.bestCollection,best.bestCollection);
  assert.deepEqual(restored.bestPointsRun,best.bestPointsRun);
});
