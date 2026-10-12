import test from 'node:test';
import assert from 'node:assert/strict';
import {loadMeta,saveMeta,buyCabinet,buyPower,bankRun,newRun} from '../src/state.js';

function memoryStorage(initial=null){
  let value=initial;
  return {getItem:()=>value,setItem:(_,next)=>{value=next;},raw:()=>value};
}

test('legacy saves begin at revision zero and ordinary writes advance it',()=>{
  const storage=memoryStorage(JSON.stringify({chips:250,cabinets:['classic']}));
  let meta=loadMeta(storage,1000);
  assert.equal(meta.revision,0);assert.equal(meta.chips,250);
  let result=saveMeta(buyCabinet(meta,'double'),storage);
  assert.equal(result.ok,true);meta=result.meta;
  assert.equal(meta.revision,1);assert.equal(meta.chips,50);
  assert.deepEqual(loadMeta(storage,1000).cabinets,['classic','double']);
  result=saveMeta({...meta,idleAt:1100},storage);
  assert.equal(result.ok,true);assert.equal(result.meta.revision,2);
  assert.equal(loadMeta(storage,1200).revision,2);
});

test('a stale tab cannot overwrite a cabinet purchase or bank its old run',()=>{
  const storage=memoryStorage(JSON.stringify({chips:220,cabinets:['classic']}));
  const newer=loadMeta(storage,1000),stale=loadMeta(storage,1000);
  const purchased=saveMeta(buyCabinet(newer,'double'),storage);
  assert.equal(purchased.ok,true);assert.equal(purchased.meta.chips,20);
  const run=newRun(stale);run.totalTickets=1750;run.round=3;
  const proposed=bankRun(run,stale,1100);
  const rejected=saveMeta(proposed.meta,storage);
  assert.equal(rejected.ok,false);assert.equal(rejected.reason,'conflict');
  assert.equal(rejected.meta.revision,1);assert.equal(rejected.meta.chips,20);
  assert.equal(run.bankedChips,0,'bank markers remain untouched if the save is rejected');
  const persisted=loadMeta(storage,1200);
  assert.equal(persisted.chips,20);assert.equal(persisted.totalTickets,0);
  assert.deepEqual(persisted.cabinets,['classic','double']);
});

test('stale spending is rejected, while a reload can make legitimate successive writes',()=>{
  const storage=memoryStorage(JSON.stringify({chips:300}));
  const first=loadMeta(storage,1000),second=loadMeta(storage,1000);
  const bought=saveMeta(buyPower(first,'amplifier'),storage);
  assert.equal(bought.ok,true);
  const staleAttempt=saveMeta(buyCabinet(second,'double'),storage);
  assert.equal(staleAttempt.reason,'conflict');
  assert.equal(loadMeta(storage,1000).chips,270);
  const refreshed=loadMeta(storage,1000);
  const next=saveMeta(buyCabinet(refreshed,'double'),storage);
  assert.equal(next.ok,true);assert.equal(next.meta.chips,70);assert.equal(next.meta.revision,2);
  const run=newRun(next.meta);run.totalTickets=350;
  const banked=bankRun(run,next.meta,1100);
  const committed=saveMeta(banked.meta,storage);
  assert.equal(committed.ok,true);assert.equal(committed.meta.totalTickets,350);
  assert.equal(committed.meta.revision,3);
  const repeated=bankRun(banked.run,committed.meta,1200);
  assert.equal(repeated.meta.chips,committed.meta.chips,'banking the same run again cannot award twice');
});

test('storage failures and malformed stored data are distinct from revision conflicts',()=>{
  const meta=loadMeta(memoryStorage(),1000);
  const unavailable={getItem:()=>{throw new Error('denied');},setItem:()=>{}};
  assert.deepEqual(saveMeta(meta,unavailable),{ok:false,reason:'storage',meta});
  const full={getItem:()=>null,setItem:()=>{throw new Error('quota');}};
  assert.deepEqual(saveMeta(meta,full),{ok:false,reason:'storage',meta});
  const malformed=memoryStorage('{invalid');
  assert.deepEqual(saveMeta(meta,malformed),{ok:false,reason:'storage',meta});
  assert.equal(malformed.raw(),'{invalid');
  assert.equal(saveMeta(meta,memoryStorage('null')).reason,'storage');
  assert.equal(loadMeta(memoryStorage(JSON.stringify({revision:-9})),1000).revision,0);
});
