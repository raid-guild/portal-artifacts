import test from 'node:test';
import assert from 'node:assert/strict';
import {PuddleSimulation} from '../src/simulation.js';
import {GARDEN,WEIGHT_GARDEN,arrivalPosition,updateGarden} from '../src/garden-level.js';
import {groundAt,resolveParticle,segmentBlockedBySolid} from '../src/colliders.js';
import {createWeightGardenView} from '../src/weight-garden-view.js';
import * as THREE from 'three';

const run=(s,n,input={})=>{for(let i=0;i<n;i++)s.step(input);};
const second=()=>{const s=new PuddleSimulation();s.startGarden(2);run(s,100);return s;};
function go(s,x,z){for(let i=0;i<1000;i++){
  if(s.garden.phase!=='playing')return;
  const dx=x-s.brain.x,dz=z-s.brain.z,d=Math.hypot(dx,dz);
  if(d<.11){run(s,30);return;}
  s.step({x:dx/d,z:dz/d});
}assert.fail(`Could not reach ${x},${z}; brain at ${s.brain.x},${s.brain.z}`);}
function gem(s){run(s,220,{contract:true});run(s,60);}

test('continue preserves Level 1 results, resets body and pickups, and pours only living flesh',()=>{
  const s=new PuddleSimulation();s.selectTest('garden');s.garden.phase='complete';
  s.garden.gemCount=2;s.garden.goldCount=11;
  assert.equal(s.continueGarden(),true);assert.equal(s.gardenLevelId,2);
  assert.deepEqual(s.completedLevels[1],{gems:2,gold:11,totalGold:17});
  assert.equal(s.fluid.particles.length,297);assert.equal(s.fluid.particles.filter(p=>!p.feedstock).length,65);
  assert.equal(s.garden.gemCount,0);assert.equal(s.garden.goldCount,0);
  const before={...s.brain};run(s,20,{x:-1,contract:true,shed:true});assert.deepEqual(s.brain,before);
  assert.equal(s.pressure.shed,0);
  const shown=arrivalPosition(s.brain,s.fluid.brainIndex,s.garden.arrivalTime,WEIGHT_GARDEN,s.fluid.coatIndices);
  assert.ok(shown.y>s.brain.y+1);
  assert.ok(Math.abs(shown.z-WEIGHT_GARDEN.start.z)<.1,'pink arrival passes vertically through the new high-start chute');
  assert.equal(groundAt(WEIGHT_GARDEN.start.x,WEIGHT_GARDEN.start.z,s.activeColliders()).height,2.16);
  run(s,50,{x:-1,shed:true});assert.equal(s.garden.phase,'settling');
  run(s,30,{x:-1,shed:true});assert.equal(s.garden.phase,'playing');assert.equal(s.pressure.shed,0);
  s.restartGarden();assert.equal(s.gardenLevelId,2);assert.equal(s.garden.phase,'arriving');
  assert.equal(s.garden.goldCount,0);assert.deepEqual(s.completedLevels[1],{gems:2,gold:11,totalGold:17});
  s.startGarden(1,{newGame:true});assert.deepEqual(s.completedLevels,{});assert.equal(s.gardenLevelId,1);
});

test('three terrace heights, stair ramps, and low-side corner blocking match the authored path',()=>{
  const s=second(),c=s.activeColliders(),t=WEIGHT_GARDEN.terrain;
  const h=(x,z)=>groundAt(x,z,c).height;
  assert.equal(h(7.6,-2.8),2.16);assert.equal(h(-5,.35),1.08);assert.equal(h(-3.5,3.6),0);
  assert.ok(Math.abs(h(-7.5,-.95)-1.89)<1e-9);assert.ok(Math.abs(h(7.5,2.35)-.81)<1e-9);
  assert.ok(Math.abs(h(t.leftStairs.minX+.5,t.leftStairs.endZ)-1.08)<1e-9);
  assert.ok(Math.abs(h(t.rightStairs.minX+.5,t.rightStairs.endZ))<1e-9);
  for(const [split,low,xs] of [[t.frontZ,t.middleHeight,[0,t.leftStairs.minX-.05,t.leftStairs.maxX+.05]],
    [t.rearZ,0,[0,t.rightStairs.minX-.05,t.rightStairs.maxX+.05]]]){
    for(const x of xs){const p={x,z:split+.08,pz:split-.08,y:low+.08,px:x,py:low+.08,vx:0,vy:0,vz:0};
      resolveParticle(p,.067,[t]);assert.ok(p.z>=split+.067-.001);assert.ok(p.y<low+.3);}
  }
  const drop={x:0,z:t.frontZ+.08,pz:t.frontZ-.08,y:t.frontHeight+.18,px:0,py:t.frontHeight+.18,vx:0,vy:0,vz:0};
  resolveParticle(drop,.067,[t]);assert.ok(drop.z>t.frontZ);
});

test('two funnels share visibility and the elevated gate blocks until a real deposit opens it',()=>{
  const s=second(),c=s.activeColliders(),basin=WEIGHT_GARDEN.basin,g=WEIGHT_GARDEN.gate;
  const a={x:basin.x,y:.4,z:basin.z},b={x:basin.x+.1,y:.42,z:basin.z};
  assert.equal(segmentBlockedBySolid(a,b,c),false);
  assert.equal(segmentBlockedBySolid({x:g.x-.6,y:1.28,z:.35},{x:g.x+.6,y:1.28,z:.35},c),true);
  s.brain.x=g.x;s.brain.z=.35;s.brain.y=g.base+.2;
  s.pressure.opening=g.opening;s.updatePressure(1/60);
  assert.equal(s.pressure.opening,g.opening,'occupied passage cannot close onto the brain');
});

test('Level 2 follows both stair turns, deposits real weight, and earns all collectibles',()=>{
  const s=second(),g=WEIGHT_GARDEN.gate;
  go(s,5.3,-2.8);go(s,2.6,-2.8);go(s,-1.5,-2.8);gem(s);
  assert.equal(s.garden.gemCount,1);
  go(s,-6,-2.8);go(s,-7.5,-2.8);go(s,-7.5,-.95);go(s,-7.5,-.25);go(s,-7.5,.35);
  assert.ok(s.brain.y<1.5&&s.brain.y>1,'the first stair turn reaches the middle terrace');
  go(s,-5.4,.35);go(s,-4.2,1.45);go(s,-3.75,.35);run(s,240,{shed:true});
  assert.ok(s.pressure.weight>=g.threshold,`deposited ${s.pressure.weight} of ${g.threshold}`);
  assert.equal(s.pressure.opening,g.opening);assert.equal(s.fluid.particles.length,297);
  go(s,-3.75,1.7);go(s,-1.3,1.7);go(s,.4,.35);go(s,2.3,.35);
  assert.ok(s.brain.x>g.x+.5,'the brain passed through the raised middle gate');
  go(s,4,.35);gem(s);go(s,7.5,.35);go(s,7.5,2.7);go(s,7.5,3.6);
  assert.ok(s.brain.y<.5,'the second stair turn reaches the rear floor');
  go(s,5.1,3.6);go(s,-3.5,3.6);gem(s);
  assert.equal(s.garden.gemCount,3);assert.equal(s.garden.goldCount,17);
  go(s,-7.6,3.65);run(s,180);
  assert.equal(s.garden.phase,'complete');assert.equal(s.fluid.particles.length,297);
  assert.ok(s.fluid.particles.every(p=>Number.isFinite(p.x+p.y+p.z)));
  assert.ok(s.fluid.coatContacts(s.activeColliders()).length>=8);
});


test('rendered Level 2 bands and stair surfaces follow the physical heights',()=>{
  const previous=globalThis.document;
  globalThis.document={createElement:()=>({style:{},remove(){}}),querySelector:()=>({append(){}})};
  try{
    const view=createWeightGardenView(new THREE.Scene());
    const floors=view.group.children.filter(o=>o.userData.weightFloor);
    for(const [region,height] of [['high',2.16],['middle',1.08],['low',0]]){
      const mesh=floors.find(o=>o.userData.weightFloor===region);assert.ok(mesh,region);
      const pos=mesh.geometry.attributes.position;
      assert.ok(Array.from({length:pos.count},(_,i)=>pos.getY(i)).every(y=>Math.abs(y-height)<1e-6),region);
    }
    for(const region of ['left-stairs','right-stairs']){
      const meshes=floors.filter(o=>o.userData.weightFloor===region);assert.ok(meshes.length>=8);
      const heights=meshes.flatMap(o=>Array.from({length:o.geometry.attributes.position.count},(_,i)=>o.geometry.attributes.position.getY(i)));
      assert.ok(Math.max(...heights)-Math.min(...heights)>1,region);
    }
    view.dispose();
  }finally{globalThis.document=previous;}
});

test('an early front ledge drop reaches the rear exit with missed optional points',()=>{
  const s=second();go(s,7.6,-.5);
  for(let i=0;i<180&&s.brain.y>=1.5;i++)s.step({});
  assert.ok(s.brain.y<1.5);
  go(s,7.5,2.7);go(s,7.5,3.6);go(s,-7.6,3.65);run(s,180);
  assert.equal(s.garden.phase,'complete');assert.ok(s.garden.goldCount<17);assert.ok(s.garden.gemCount<3);
});
