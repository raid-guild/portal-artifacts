import test from 'node:test';
import assert from 'node:assert/strict';
import {PullGesture} from '../src/pull-gesture.js';
test('tap toggles once; holding and releasing never toggles',()=>{
  let taps=0;const g=new PullGesture(()=>taps++);
  g.down('key',0);g.down('key',50);g.up('key',100);g.up('key',101);assert.equal(taps,1);
  g.down('key',200);assert.equal(g.update(419),false);assert.equal(g.update(420),true);
  g.up('key',500);assert.equal(taps,1);assert.equal(g.update(600),false);
  g.down('key',700);g.up('key',1000);assert.equal(taps,1);
});
test('cancel never taps and mixed sources finish only on final release',()=>{
  let taps=0;const g=new PullGesture(()=>taps++);
  g.down('key',0);g.cancel();g.up('key',100);assert.equal(taps,0);
  g.down('key',200);g.down('pointer',210);g.up('key',250);assert.equal(taps,0);
  g.up('pointer',300);assert.equal(taps,1);
});
test('canceling one pointer preserves a keyboard hold without recalling',()=>{
  let taps=0;const g=new PullGesture(()=>taps++);
  g.down('keyboard',0);g.down('pointer-4',10);g.cancelSource('pointer-4');
  assert.equal(g.sources.has('keyboard'),true);assert.equal(taps,0);
  assert.equal(g.update(230),true);g.up('keyboard',250);assert.equal(taps,0);
  g.down('pointer-5',300);g.cancelSource('pointer-5');g.up('pointer-5',350);assert.equal(taps,0);
});
