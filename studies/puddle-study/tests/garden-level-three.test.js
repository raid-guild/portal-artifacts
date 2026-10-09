import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {PuddleSimulation} from '../src/simulation.js';
import {GARDEN_LEVELS,PASSAGE_GARDEN,arrivalPosition,gardenColliders} from '../src/garden-level.js';
import {groundAt,resolveParticle,segmentBlockedBySolid} from '../src/colliders.js';
import {createWeightGardenView} from '../src/weight-garden-view.js';
import {ParticleFluid} from '../src/particle-fluid.js';

const run=(s,n,input={})=>{for(let i=0;i<n;i++)s.step(input);};
const third=()=>{const s=new PuddleSimulation();s.startGarden(3);run(s,100);return s;};
function go(s,x,z){for(let i=0;i<1100;i++){
  if(s.garden.phase!=='playing')return;
  const dx=x-s.brain.x,dz=z-s.brain.z,d=Math.hypot(dx,dz);
  if(d<.11){run(s,30);return;}
  s.step({x:dx/d,z:dz/d});
}assert.fail(`Could not reach ${x},${z}; brain at ${s.brain.x},${s.brain.z}`);}
function gem(s){run(s,220,{contract:true});run(s,60);}

test('three authored levels validate IDs and preserve independent results through both descents',()=>{
  const s=new PuddleSimulation();assert.equal(GARDEN_LEVELS.length,7);
  assert.equal(s.startGarden(0),false);assert.equal(s.startGarden(7),false);assert.equal(s.startGarden(1.5),false);
  s.startGarden(1);s.garden.phase='complete';s.garden.goldCount=11;s.garden.gemCount=2;
  assert.equal(s.continueGarden(),true);assert.equal(s.gardenLevelId,2);assert.equal(s.descending,true);
  s.garden.phase='complete';s.garden.goldCount=13;s.garden.gemCount=1;
  assert.equal(s.continueGarden(),true);assert.equal(s.gardenLevelId,3);assert.equal(s.descending,true);
  assert.deepEqual(s.completedLevels[1],{gems:2,gold:11,totalGold:17,totalGems:3});
  assert.deepEqual(s.completedLevels[2],{gems:1,gold:13,totalGold:17,totalGems:3});
  assert.equal(s.fluid.particles.length,297);assert.equal(s.fluid.particles.filter(p=>!p.feedstock).length,65);
  const shown=arrivalPosition(s.brain,s.fluid.brainIndex,0,PASSAGE_GARDEN,s.fluid.coatIndices);
  assert.ok(shown.y>s.brain.y+2);assert.ok(Math.abs(shown.z-PASSAGE_GARDEN.start.z)<.1);
  const before={x:s.brain.x,y:s.brain.y,z:s.brain.z};run(s,20,{x:-1,z:1,shed:true,contract:true});
  assert.deepEqual({x:s.brain.x,y:s.brain.y,z:s.brain.z},before);assert.equal(s.pressure.shed,0);
  run(s,80,{x:-1,z:1,shed:true,contract:true});assert.equal(s.pressure.shed,0);
  s.restartGarden();assert.equal(s.gardenLevelId,3);assert.deepEqual(Object.keys(s.completedLevels),['1','2']);
  s.startGarden(1,{newGame:true});assert.deepEqual(s.completedLevels,{});
});

test('Passage Garden terrain and elevated gate use the authored heights and closed solids',()=>{
  const level=PASSAGE_GARDEN,c=gardenColliders(level),t=level.terrain;
  assert.equal(groundAt(level.start.x,level.start.z,c).height,2.16);
  assert.equal(groundAt(level.basin.x,level.basin.z,c).height,1.08-level.basin.depth);
  assert.equal(groundAt(level.exit.x,level.exit.z,c).height,-level.exit.depth);
  assert.equal(groundAt(-4,.45,c).height,1.08);assert.equal(groundAt(0,3.55,c).height,0);
  for(const [split,low] of [[t.frontZ,t.middleHeight],[t.rearZ,0]]){
    const p={x:0,z:split+.08,pz:split-.08,y:low+.08,px:0,py:low+.08,vx:0,vy:0,vz:0};
    resolveParticle(p,.067,[t]);assert.ok(p.z>=split+.066);assert.ok(p.y<low+.3);
  }
  const g=level.gate;
  assert.equal(segmentBlockedBySolid({x:g.x-.6,y:g.base+.2,z:.45},{x:g.x+.6,y:g.base+.2,z:.45},c),true);
  const r=level.passage;
  assert.equal(segmentBlockedBySolid({x:r.maxX+.5,y:.65,z:3.55},{x:r.minX-.5,y:.65,z:3.55},c),true);
  assert.equal(segmentBlockedBySolid({x:r.maxX+.5,y:.16,z:3.55},{x:r.minX-.5,y:.16,z:3.55},c),false);
});

test('ordinary green supply cannot substitute for a real shed deposit',()=>{
  const s=third(),basin=PASSAGE_GARDEN.basin;
  for(const p of s.fluid.particles.filter(p=>p.feedstock).slice(0,80)){
    p.x=basin.x;p.z=basin.z;p.y=groundAt(basin.x,basin.z,s.activeColliders()).height+s.fluid.radius+.01;
  }
  s.updatePressure(1/60);
  assert.equal(s.pressure.weight,0);assert.equal(s.pressure.opening,0);
});

test('full Passage Garden route deposits 64 particles, regathers, crosses the low roof, and earns 100%',()=>{
  const s=third(),g=PASSAGE_GARDEN.gate;
  go(s,5.1,-3.2);go(s,2.2,-3.2);go(s,-2,-3.2);gem(s);
  go(s,-5.5,-3.2);go(s,-7.5,-3.2);go(s,-7.5,-.95);go(s,-7.5,-.25);go(s,-7.5,.45);
  go(s,-5.2,.45);go(s,-3.7,1.55);go(s,-3.65,.45);
  let shedSteps=0;while(s.pressure.weight<80&&shedSteps++<400)s.step({shed:true});
  run(s,60);
  assert.ok(s.pressure.weight>=g.threshold,`deposited ${s.pressure.weight} of ${g.threshold}`);
  assert.equal(s.pressure.opening,g.opening);
  go(s,-3.65,1.7);go(s,-1.1,1.7);go(s,.5,.45);go(s,2.5,.45);
  go(s,3.1,.45);go(s,4.3,.45);gem(s);go(s,7.5,.45);go(s,7.5,2.7);go(s,7.5,3.55);
  go(s,5.2,3.55);assert.ok(s.fluid.attachedCount>100,'the body regathers after shedding');
  go(s,0,3.55);assert.ok(s.brain.y<PASSAGE_GARDEN.passage.bottom-.105,'the brain fits under the passage');
  go(s,-4.3,3.55);gem(s);
  assert.equal(s.garden.gemCount,3);assert.equal(s.garden.goldCount,17);
  go(s,-7.6,3.65);run(s,180);
  assert.equal(s.garden.phase,'complete');assert.equal(s.fluid.particles.length,297);
  assert.ok(s.fluid.particles.every(p=>Number.isFinite(p.x+p.y+p.z)));
  assert.ok(s.fluid.coatContacts(s.activeColliders()).length>=8);
});

test('Level 3 view keeps separate high, middle, and low bands at the third storey offset',()=>{
  const previous=globalThis.document;
  globalThis.document={createElement:()=>({style:{},remove(){}}),querySelector:()=>({append(){}})};
  try{const view=createWeightGardenView(new THREE.Scene(),{level:PASSAGE_GARDEN});
    assert.equal(view.group.position.y,-14.4);
    const floors=view.group.children.filter(o=>o.userData.weightFloor);
    for(const [region,height] of [['high',2.16],['middle',1.08],['low',0]]){
      const mesh=floors.find(o=>o.userData.weightFloor===region);assert.ok(mesh);
      assert.ok(Array.from({length:mesh.geometry.attributes.position.count},(_,i)=>mesh.geometry.attributes.position.getY(i)).every(y=>Math.abs(y-height)<1e-6));
    }
    view.dispose();
  }finally{globalThis.document=previous;}
});

test('small and full-size real particle bodies cross the long passage both ways with their brain coating',()=>{
  const colliders=gardenColliders(PASSAGE_GARDEN,PASSAGE_GARDEN.gate.opening);
  for(const size of [.8,1.4])for(const direction of [-1,1]){
    const fluid=new ParticleFluid({x:direction<0?3:-3,z:3.55,size});
    const count=fluid.particles.length;
    let crossed=false;
    for(let i=0;i<450;i++){
      fluid.step(1/60,{x:direction,z:0,puddle:true,growth:true},colliders);
      if(direction*fluid.brain.x>2){crossed=true;break;}
    }
    assert.ok(crossed,`size ${size}, direction ${direction}: brain at ${fluid.brain.x}`);
    assert.equal(fluid.particles.length,count);
    assert.ok(fluid.particles.every(p=>Number.isFinite(p.x+p.y+p.z)));
    assert.ok(fluid.coatContacts(colliders).length>=8);
  }
});

test('an exposed ledge shortcut can finish Passage Garden while missing pickups',()=>{
  const s=third();go(s,7.6,-.5);go(s,7.5,2.7);go(s,7.5,3.55);
  go(s,0,3.55);go(s,-7.6,3.65);run(s,180);
  assert.equal(s.garden.phase,'complete');assert.ok(s.garden.goldCount<17);assert.ok(s.garden.gemCount<3);
});
