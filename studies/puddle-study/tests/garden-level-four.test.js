import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {PuddleSimulation} from '../src/simulation.js';
import {GARDEN_LEVELS,REACH_GARDEN,gardenColliders,arrivalPosition} from '../src/garden-level.js';
import {groundAt} from '../src/colliders.js';
import {createWeightGardenView} from '../src/weight-garden-view.js';

const run=(s,n,input={})=>{for(let i=0;i<n;i++)s.step(input);};
const fourth=()=>{const s=new PuddleSimulation();s.startGarden(4);run(s,100);return s;};
function go(s,x,z){for(let i=0;i<1100;i++){
  if(s.garden.phase!=='playing')return;
  const dx=x-s.brain.x,dz=z-s.brain.z,d=Math.hypot(dx,dz);
  if(d<.11){run(s,25);return;}
  s.step({x:dx/d,z:dz/d});
}assert.fail(`Could not reach ${x},${z}; brain at ${s.brain.x},${s.brain.z}`);}
const gem=s=>{run(s,220,{contract:true});run(s,60);};

test('Level 4 continues downward with independent results and guarded arrival input',()=>{
  const s=new PuddleSimulation();assert.equal(GARDEN_LEVELS.length,7);
  assert.equal(s.startGarden(7),false);s.startGarden(3);s.garden.phase='complete';
  s.garden.goldCount=15;s.garden.gemCount=2;
  assert.equal(s.continueGarden(),true);assert.equal(s.gardenLevelId,4);assert.equal(s.descending,true);
  assert.deepEqual(s.completedLevels[3],{gems:2,gold:15,totalGold:17,totalGems:3});
  assert.equal(s.fluid.particles.length,297);assert.equal(s.castTendril({x:5,z:-3.2}),false);
  const original=[s.brain.x,s.brain.y,s.brain.z];run(s,20,{x:-1,contract:true,recallToggle:true});
  assert.deepEqual([s.brain.x,s.brain.y,s.brain.z],original);
  const shown=arrivalPosition(s.brain,s.fluid.brainIndex,0,REACH_GARDEN,s.fluid.coatIndices);
  assert.ok(shown.y>s.brain.y+2);assert.ok(Math.abs(shown.z-REACH_GARDEN.start.z)<.1);
  run(s,80,{x:-1,contract:true,recallToggle:true});
  assert.equal(s.garden.phase,'playing');assert.equal(s.gardenInputArmed,false);
  assert.equal(s.castTendril({x:5,z:-3.2}),false);
  s.step({});assert.equal(s.gardenInputArmed,true);
  s.garden.phase='complete';assert.equal(s.continueGarden(),true);assert.equal(s.gardenLevelId,5);
  s.startGarden(4);
  s.restartGarden();assert.equal(s.gardenLevelId,4);assert.equal(s.garden.phase,'arriving');
  s.startGarden(1,{newGame:true});assert.deepEqual(s.completedLevels,{});
});

test('three shallow high channels and a clear middle return retain finite physical floor and supply',()=>{
  const level=REACH_GARDEN,c=gardenColliders(level);
  assert.equal(c.filter(x=>x.type==='funnel').length,4);
  assert.equal(c.some(x=>x.type==='roof'),false);
  assert.equal(groundAt(level.start.x,level.start.z,c).height,2.16);
  for(const channel of level.channels){
    assert.ok(Math.abs(groundAt(channel.x,channel.z,c).height-1.84)<1e-9);
    assert.equal(groundAt(channel.x+channel.radius+.1,channel.z,c).height,2.16);
  }
  assert.equal(groundAt(0,.45,c).height,1.08);assert.equal(groundAt(0,3.55,c).height,0);
  const s=fourth();assert.equal(s.fluid.particles.length,297);
  assert.equal(s.fluid.particles.filter(p=>p.feedstock).length,232);
  run(s,30,{shed:true});assert.equal(s.pressure.shed,0,'F cannot shed in Reach Garden');
  for(const id of [1,2,3]){s.startGarden(id);run(s,100);
    assert.equal(s.castTendril({x:s.brain.x+1.5,z:s.brain.z}),true,
      `ordinary garden ${id} now supports the shared cast control`);}
});

test('three disjoint real strands claim remote channels, reject a fourth, then recall without losing the coating',()=>{
  const s=fourth();go(s,5.3,-3.2);go(s,.7,-3.65);
  const coat=new Set(s.fluid.coatIndices);
  for(const [x,z] of [[2.7,-4.9],[-1.8,-4.8],[-2,-2.35]]){
    assert.equal(s.castTendril({x,z}),true);run(s,100);
  }
  assert.equal(s.tendril.count,3);assert.equal(s.tendril.recovered,174);
  const indices=s.tendril.indices;
  assert.equal(new Set(indices).size,indices.length);
  assert.ok(indices.every(i=>i!==s.fluid.brainIndex&&!coat.has(i)));
  assert.equal(s.castTendril({x:-4,z:-4}),false);
  assert.match(s.tendril.feedback,/Three tendrils/);
  s.step({recallToggle:true});assert.equal(s.tendril.recalling,true);run(s,100);
  s.step({recallToggle:true});assert.equal(s.tendril.recalling,false);
  run(s,100);s.step({recallToggle:true});run(s,250);
  assert.equal(s.tendril.count,0);assert.equal(s.tendril.recovered,174);
  assert.equal(s.fluid.attachedCount,296);assert.equal(s.fluid.particles.length,297);
  assert.ok(s.fluid.coatContacts(s.activeColliders()).length>=8);
});

test('the entire Reach Garden route collects all three gems and 17 gold with conserved flesh',()=>{
  const s=fourth();
  go(s,5.3,-3.2);go(s,3.6,-3.2);go(s,.7,-3.65);go(s,2.7,-4.9);go(s,-1.8,-4.8);go(s,-2,-2.35);
  go(s,-4.8,-3.5);gem(s);go(s,-6,-3.5);go(s,-7.5,-3.5);go(s,-7.5,-.95);go(s,-7.5,-.25);go(s,-7.5,.45);
  go(s,-5,.45);go(s,0,.45);go(s,4.2,.45);gem(s);go(s,7.5,.45);go(s,7.5,2.7);go(s,7.5,3.55);
  go(s,3.5,3.55);go(s,-3.8,3.55);gem(s);
  assert.equal(s.garden.gemCount,3);assert.equal(s.garden.goldCount,17);
  go(s,-7.6,3.65);run(s,180);
  assert.equal(s.garden.phase,'complete');assert.equal(s.fluid.particles.length,297);
  assert.ok(s.fluid.particles.every(p=>Number.isFinite(p.x+p.y+p.z)));
  assert.ok(s.fluid.coatContacts(s.activeColliders()).length>=8);
});

test('the optional ledge shortcut reaches the exit while missing collectibles',()=>{
  const s=fourth();go(s,7.6,-.5);go(s,7.5,2.7);go(s,7.5,3.55);go(s,-7.6,3.65);run(s,180);
  assert.equal(s.garden.phase,'complete');assert.ok(s.garden.goldCount<17);assert.ok(s.garden.gemCount<3);
});

test('Reach Garden view cuts three channels into the high floor at world Y -21.6 without a gate',()=>{
  const previous=globalThis.document;
  globalThis.document={createElement:()=>({style:{},remove(){}}),querySelector:()=>({append(){}})};
  try{const view=createWeightGardenView(new THREE.Scene(),{level:REACH_GARDEN});
    assert.equal(view.group.position.y,-21.6);
    const floors=view.group.children.filter(o=>o.userData.weightFloor);
    assert.ok(floors.some(o=>o.userData.weightFloor==='high'));
    assert.ok(view.group.children.filter(o=>o.userData.pickableTerrain).length>=6);
    assert.ok(view.group.children.some(o=>Math.abs(o.position.x-REACH_GARDEN.castingBank.x)<.01&&
      Math.abs(o.position.z-REACH_GARDEN.castingBank.z)<.01));
    view.dispose();
  }finally{globalThis.document=previous;}
});
