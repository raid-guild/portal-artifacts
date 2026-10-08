import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {setGardenStoreyVisibility} from '../src/garden-scenery.js';
import {startPointerControl} from '../src/game-input.js';

test('upper arcade group, trim and collar leave the lower view while the shared spine remains',()=>{
  const upper=new THREE.Group(),lower=new THREE.Group();
  const loaded=new Map(['trim','collar','spine'].map(key=>[key,new THREE.Group()]));
  setGardenStoreyVisibility(upper,lower,loaded,1);
  assert.equal(upper.visible,true);assert.equal(lower.visible,false);
  assert.ok(['trim','collar','spine'].every(key=>loaded.get(key).visible));
  setGardenStoreyVisibility(upper,lower,loaded,2,true);
  assert.equal(upper.visible,true);assert.equal(lower.visible,true);
  setGardenStoreyVisibility(upper,lower,loaded,2,false);
  assert.equal(upper.visible,false);assert.equal(lower.visible,true);
  assert.ok(['trim','collar'].every(key=>!loaded.get(key).visible));
  assert.equal(loaded.get('spine').visible,true,'shared stationary spine stays visible');
  setGardenStoreyVisibility(upper,lower,loaded,1);
  assert.equal(upper.visible,true);assert.equal(lower.visible,false);
});

test('pointer press during arrival or settlement cannot latch a control after play starts',()=>{
  const sim={selectedTest:'garden',garden:{phase:'arriving'}};
  let starts=0,captured=false;const press={pointerId:7};
  const attempt=()=>startPointerControl(sim,press,()=>{starts++;captured=true;});
  assert.equal(attempt(),false);assert.equal(starts,0);
  sim.garden.phase='settling';assert.equal(attempt(),false);assert.equal(captured,false);
  sim.garden.phase='playing';assert.equal(starts,0,'a held earlier press does not replay');
  assert.equal(attempt(),true);assert.equal(starts,1);
  sim.garden.phase='paused';assert.equal(attempt(),false);
  sim.selectedTest='pressure';assert.equal(attempt(),true,'study controls remain immediate');
});

test('third-storey descent retains only its immediate predecessor and the shared spine',()=>{
  const upper=new THREE.Group(),middle=new THREE.Group(),third=new THREE.Group();
  const loaded=new Map(['trim','collar','spine'].map(key=>[key,new THREE.Group()]));
  setGardenStoreyVisibility(upper,middle,loaded,3,true,third);
  assert.equal(upper.visible,false);assert.equal(middle.visible,true);assert.equal(third.visible,true);
  assert.equal(loaded.get('trim').visible,false);assert.equal(loaded.get('spine').visible,true);
  setGardenStoreyVisibility(upper,middle,loaded,3,false,third);
  assert.equal(upper.visible,false);assert.equal(middle.visible,false);assert.equal(third.visible,true);
});

test('fourth-storey descent keeps the third facade briefly without re-showing older floors',()=>{
  const upper=new THREE.Group(),second=new THREE.Group(),third=new THREE.Group(),fourth=new THREE.Group();
  const loaded=new Map(['trim','collar','spine'].map(key=>[key,new THREE.Group()]));
  setGardenStoreyVisibility(upper,second,loaded,4,true,third,fourth);
  assert.equal(upper.visible,false);assert.equal(second.visible,false);
  assert.equal(third.visible,true);assert.equal(fourth.visible,true);
  assert.equal(loaded.get('trim').visible,false);assert.equal(loaded.get('spine').visible,true);
  setGardenStoreyVisibility(upper,second,loaded,4,false,third,fourth);
  assert.equal(upper.visible,false);assert.equal(second.visible,false);
  assert.equal(third.visible,false);assert.equal(fourth.visible,true);
});

test('fifth-storey descent retains only Grip Garden and its immediate Reach predecessor',()=>{
  const upper=new THREE.Group(),second=new THREE.Group(),third=new THREE.Group(),fourth=new THREE.Group(),fifth=new THREE.Group();
  const loaded=new Map(['trim','collar','spine'].map(key=>[key,new THREE.Group()]));
  setGardenStoreyVisibility(upper,second,loaded,5,true,third,fourth,fifth);
  assert.equal(upper.visible,false);assert.equal(second.visible,false);assert.equal(third.visible,false);
  assert.equal(fourth.visible,true);assert.equal(fifth.visible,true);
  assert.equal(loaded.get('spine').visible,true);
  setGardenStoreyVisibility(upper,second,loaded,5,false,third,fourth,fifth);
  assert.equal(fourth.visible,false);assert.equal(fifth.visible,true);
});
