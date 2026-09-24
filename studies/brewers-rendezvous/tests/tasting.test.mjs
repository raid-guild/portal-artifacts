import test from 'node:test';
import assert from 'node:assert/strict';
import {createPourSession,samplePour,pourDuration,boothStatus,servicePoint} from '../dist/js/tasting.js';
import {stops,breweryStops} from '../dist/js/content.js';
import {localToWorld,worldToLocal,insideBooth} from '../dist/js/layout.js';
test('readiness belongs to each beer booth, including manual arrival',()=>{
  assert.equal(breweryStops.length,6);
  for(const stop of breweryStops){
    const point=servicePoint(stop);
    const expected=localToWorld(stop,0,2.55);
    assert.ok(Math.abs(point.x-expected.x)<1e-9&&Math.abs(point.z-expected.z)<1e-9);
    assert.equal(insideBooth(stop,point.x,point.z),false);
    assert.equal(insideBooth(stop,...Object.values(localToWorld(stop,0,-1))),true);
    const local=worldToLocal(stop,point.x,point.z);
    assert.ok(Math.abs(local.x)<1e-9&&Math.abs(local.z-2.55)<1e-9);
    assert.equal(boothStatus({x:0,z:0},stop),'far');
    assert.equal(boothStatus({x:0,z:0},stop,true),'approaching');
    assert.equal(boothStatus(point,stop),'ready');
    assert.equal(boothStatus({x:point.x+.2,z:point.z},stop),'ready');
    for(const other of breweryStops.filter(s=>s.id!==stop.id))assert.equal(boothStatus(servicePoint(other),stop),'far');
  }
  const story=stops.find(s=>s.type==='story');
  assert.equal(servicePoint(story),null);
  assert.equal(boothStatus({x:story.x,z:story.z},story,true),'far');
});
test('starting twice is ignored; only completion collects; replay is idempotent',()=>{
  const s=createPourSession(),journal=new Set();let completed=0;
  const callbacks={onComplete:()=>{completed++;journal.add('liquid');}};
  assert.equal(s.start(callbacks),true);assert.equal(s.start(callbacks),false);assert.equal(journal.size,0);
  s.update(pourDuration);s.update(100);assert.equal(completed,1);assert.equal(journal.size,1);
  s.start(callbacks);s.update(pourDuration);assert.equal(completed,2);assert.equal(journal.size,1);
});
test('cancel before completion invalidates a run, resets once, and allows retry',()=>{
  const s=createPourSession();let complete=0,cancel=0;
  const callbacks={onComplete:()=>complete++,onCancel:()=>cancel++};
  s.start(callbacks);s.update(1);s.cancel();s.cancel();s.update(10);
  assert.equal(complete,0);assert.equal(cancel,1);assert.equal(s.active,false);
  s.start(callbacks);s.update(pourDuration);assert.equal(complete,1);
});
test('switching booths during a pour leaves only the completed booth stamped',()=>{
  const session=createPourSession(),journal=new Set();
  const start=id=>session.start({onComplete:()=>journal.add(id)});
  assert.equal(start('liquid'),true);
  session.update(1.5);
  assert.equal(session.cancel(),true);
  assert.equal(start('seedstock'),true);
  session.update(pourDuration);
  assert.deepEqual([...journal],['seedstock']);
  assert.equal(start('fournoses'),true);
  session.update(pourDuration);
  assert.deepEqual([...journal],['seedstock','fournoses']);
  assert.equal(start('seedstock'),true);
  session.update(pourDuration);
  assert.equal(journal.size,2);
});
test('reduced motion completes directly, and switching midway completes once',()=>{
  const s=createPourSession();let complete=0,last;
  const callbacks={onComplete:()=>complete++,onFrame:sample=>last=sample};
  s.start({...callbacks,reduced:true});assert.equal(complete,1);assert.equal(s.active,false);assert.equal(last.fill,1);
  s.start(callbacks);s.update(.4);s.finish();s.finish();s.update(10);assert.equal(complete,2);assert.equal(last.stream,false);
});
test('animation starts empty, pours during filling, and ends filled without a stream',()=>{
  assert.equal(samplePour(0).fill,0);assert.equal(samplePour(0).stream,false);
  const middle=samplePour(1.4);assert.ok(middle.fill>0&&middle.fill<1);assert.equal(middle.stream,true);
  const end=samplePour(pourDuration);assert.equal(end.fill,1);assert.equal(end.stream,false);assert.equal(end.reach,0);
});
