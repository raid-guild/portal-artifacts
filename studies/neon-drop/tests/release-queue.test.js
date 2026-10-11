import test from 'node:test';
import assert from 'node:assert/strict';
import {ReleaseQueue,cancelForRoundChoice} from '../src/release-queue.js';

test('rapid requests release in order when spacing and chute clearance allow',()=>{
  const queue=new ReleaseQueue(.22),released=[];
  for(const type of ['chrome','rubber','heavy'])queue.enqueue(type);
  const release=item=>{released.push(item.type);return true;};
  assert.equal(queue.flush(0,()=>true,release)?.type,'chrome');
  assert.equal(queue.flush(.21,()=>true,release),null);
  assert.equal(queue.flush(.23,()=>false,release),null);
  assert.equal(queue.flush(.30,()=>true,release)?.type,'rubber');
  assert.equal(queue.flush(.53,()=>true,release)?.type,'heavy');
  assert.deepEqual(released,['chrome','rubber','heavy']);
  assert.equal(queue.length,0);
});

test('echo waits for simulation time and cancellation returns only unreleased requests',()=>{
  const queue=new ReleaseQueue(.22);
  queue.enqueue('chrome',true,.42);
  assert.equal(queue.flush(.4,()=>true,()=>true),null);
  assert.equal(queue.flush(.42,()=>true,()=>true)?.free,true);
  queue.enqueue('rubber',false,.42);queue.enqueue('chrome',true,.84);
  assert.equal(queue.flush(.65,()=>true,()=>false),null,'failed spawn remains queued');
  assert.deepEqual(queue.clear().map(item=>item.free),[false,true]);
  assert.equal(queue.length,0);
});

test('clearing a round refunds reserved paid balls once and cannot release them after choosing',()=>{
  const queue=new ReleaseQueue(.22),released=[];
  queue.enqueue('chrome',false,0);
  queue.enqueue('rubber',false,0);
  queue.enqueue('chrome',true,.42);
  assert.equal(queue.flush(0,()=>true,item=>{released.push(item.type);return true;})?.type,'chrome');
  assert.equal(cancelForRoundChoice(queue,'playing','playing'),0);
  assert.equal(cancelForRoundChoice(queue,'playing','choose'),1);
  assert.equal(cancelForRoundChoice(queue,'playing','choose'),0,'a repeated scoring callback cannot refund again');
  assert.equal(queue.flush(1,()=>true,item=>{released.push(item.type);return true;}),null);
  assert.deepEqual(released,['chrome']);
});
