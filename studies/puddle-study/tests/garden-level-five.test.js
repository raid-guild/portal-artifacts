import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {PuddleSimulation} from '../src/simulation.js';
import {ParticleFluid} from '../src/particle-fluid.js';
import {GRIP_GARDEN,GARDEN_LEVELS,gardenColliders,gardenFixtureHeight,arrivalPosition,looseGardenParticles,gardenHint} from '../src/garden-level.js';
import {groundAt,resolveParticle,supportedGroundAt} from '../src/colliders.js';
import {createWeightGardenView} from '../src/weight-garden-view.js';
import {createParticleSurface} from '../src/particle-surface.js';

const run=(s,n,input={})=>{for(let i=0;i<n;i++)s.step(input);};
const fifth=()=>{const s=new PuddleSimulation();assert.equal(s.startGarden(5),true);run(s,100);return s;};
function go(s,x,z){for(let i=0;i<1400;i++){
  if(s.garden.phase!=='playing')return;
  const dx=x-s.brain.x,dz=z-s.brain.z,d=Math.hypot(dx,dz);
  if(d<.14){run(s,25);return;}
  s.step({x:dx/d,z:dz/d});
}assert.fail(`Could not reach ${x},${z}; brain at ${s.brain.x},${s.brain.y},${s.brain.z}`);}
const gem=s=>{run(s,250,{contract:true});run(s,60);};
test('Grip hints cover the high gem and both marked approaches',()=>{
  const s=new PuddleSimulation();s.startGarden(5);s.garden.phase='playing';s.garden.moved=1;s.brain.x=0;
  for(const [x,title,direction] of [[.55,'SURROUND THE HIGH GEM',null],[-.85,'03 / FIND THE GRIP','D'],[1.95,'03 / FIND THE GRIP','A']]){
    s.brain.x=x;s.brain.z=-.05;const [actual,copy]=gardenHint(s);
    assert.equal(actual,title,`hint at x=${x}`);
    if(direction)assert.match(copy,new RegExp(`press ${direction}`,'i'));
  }
});
function atFace(s,side='west'){
  const p=GRIP_GARDEN.grip.platform,x=side==='west'?p.minX-.3:p.maxX+.3,z=-.05;
  const dx=x-s.brain.x,dz=z-s.brain.z,dy=groundAt(x,z,s.activeColliders()).height-s.brain.y+.25;
  for(const p of s.fluid.particles){if(p.feedstock)continue;
    p.x+=dx;p.px=p.x;p.z+=dz;p.pz=p.z;p.y+=dy;p.py=p.y;p.vx=p.vy=p.vz=0;}
  s.fluid.samplePairs();s.fluid.updateComponents(s.activeColliders());
}

test('fifth authored garden continues from Reach, locks arrival controls, and is the final result',()=>{
  const s=new PuddleSimulation();assert.equal(GARDEN_LEVELS.length,5);
  assert.equal(s.startGarden(6),false);assert.equal(s.startGarden(1.5),false);
  s.startGarden(4);s.garden.phase='complete';s.garden.goldCount=15;s.garden.gemCount=2;
  assert.equal(s.continueGarden(),true);assert.equal(s.gardenLevelId,5);assert.equal(s.descending,true);
  assert.deepEqual(s.completedLevels[4],{gems:2,gold:15,totalGold:17});
  assert.equal(s.fluid.particles.length,297);assert.equal(s.castTendril({x:0,z:0}),false);
  const original=[s.brain.x,s.brain.y,s.brain.z];run(s,20,{x:-1,z:1,shed:true,contract:true});
  assert.deepEqual([s.brain.x,s.brain.y,s.brain.z],original);
  const shown=arrivalPosition(s.brain,s.fluid.brainIndex,0,GRIP_GARDEN,s.fluid.coatIndices);
  assert.ok(shown.y>s.brain.y+2);
  run(s,80,{x:-1,z:1,shed:true,contract:true});assert.equal(s.garden.phase,'playing');
  assert.equal(s.gardenInputArmed,false);s.step({});assert.equal(s.gardenInputArmed,true);
  run(s,60,{shed:true});assert.equal(s.pressure.shed,0);
  s.garden.phase='complete';assert.equal(s.continueGarden(),false);
  s.restartGarden();assert.equal(s.gardenLevelId,5);assert.equal(s.garden.phase,'arriving');
  s.startGarden(1,{newGame:true});assert.deepEqual(s.completedLevels,{});
});

test('ramp and platform are distinct physical surfaces; a low side entry never teleports upward',()=>{
  const c=gardenColliders(GRIP_GARDEN),r=GRIP_GARDEN.grip.ramp,p=GRIP_GARDEN.grip.platform;
  assert.equal(groundAt(GRIP_GARDEN.start.x,GRIP_GARDEN.start.z,c).height,2.16);
  assert.ok(Math.abs(groundAt(r.minX,0,c).height-r.minHeight)<1e-9);
  assert.ok(Math.abs(groundAt(r.maxX,0,c).height-r.maxHeight)<1e-9);
  assert.ok(groundAt((r.minX+r.maxX)/2,0,c).dx>0);
  assert.equal(groundAt(r.minX-.01,0,c).height,1.08);
  assert.equal(gardenFixtureHeight(GRIP_GARDEN,.55,-.05),p.maxY);
  assert.equal(groundAt(0,3.55,c).height,0);
  const low={x:-.85,z:-.05,y:1.55,px:-.85,pz:-.05,py:1.55,vx:0,vy:0,vz:0};
  for(let i=0;i<25;i++){low.px=low.x;low.py=low.y;low.x+=.015;resolveParticle(low,.067,c);}
  assert.ok(low.x<=p.minX-.067+.01);assert.ok(low.y<p.maxY-.2);
});

test('legacy Z-axis grip levels still slope and climb without an axis field',()=>{
  const legacy={...GRIP_GARDEN,grip:{
    ramp:{type:'grip-ramp',minX:-1.3,maxX:1.3,minZ:.25,maxZ:1.35,northHeight:1.44,southHeight:1.08},
    platform:{type:'box',gripPlatform:true,minX:-1.9,maxX:1.9,minZ:-1.95,maxZ:.25,minY:1.08,maxY:1.98}}};
  const c=gardenColliders(legacy);
  assert.ok(Math.abs(groundAt(0,.25,c).height-1.44)<1e-9);
  assert.ok(Math.abs(groundAt(0,1.35,c).height-1.08)<1e-9);
  assert.ok(groundAt(0,.8,c).dz<0);
  const f=new ParticleFluid({x:0,z:.55,seedCount:65,massReferenceCount:297});
  for(const p of f.particles){p.y+=groundAt(p.x,p.z,c).height;p.py=p.y;}
  f.samplePairs();f.updateComponents(c);
  for(let i=0;i<50;i++)f.step(1/60,{x:0,z:-1,puddle:true,growth:false},c);
  assert.ok(f.brain.y>1.8&&f.coatContacts(c).length>=8);
});

test('only the marked face lifts a coated brain with real connected followers, then releases to sag',()=>{
  const marked=fifth();atFace(marked);
  for(let i=0;i<150&&marked.brain.y<=1.8;i++)marked.step({x:1});
  const high=marked.brain.y;
  assert.ok(high>1.8,`marked height ${high}`);assert.ok(marked.brain.x>-.9);
  assert.ok(marked.fluid.coatContacts(marked.activeColliders()).length>=8);
  run(marked,130);assert.ok(marked.brain.y<high-.15,'releasing grip slowly lowers the core');
  assert.ok(marked.brain.y>GRIP_GARDEN.terrain.middleHeight+.15);
  assert.ok(marked.fluid.attachedCount>=50);
  const plain=fifth();atFace(plain);
  const withoutMark=plain.activeColliders().filter(c=>c.type!=='grip-ramp');
  plain.activeColliders=()=>withoutMark;
  run(plain,330,{x:1});assert.ok(plain.brain.y<1.5,'an unmarked wall refuses the climb');
  assert.ok(plain.brain.x<=GRIP_GARDEN.grip.platform.minX-plain.fluid.radius+.01);
  const unsupported=fifth(),dx=-.85-unsupported.brain.x,dz=-.05-unsupported.brain.z,dy=1.08-unsupported.brain.y+.23;
  for(let i=0;i<unsupported.fluid.particles.length;i++){
    const p=unsupported.fluid.particles[i];if(p.feedstock)continue;
    p.x+=dx;p.px=p.x;p.y+=dy;p.py=p.y;p.z+=dz;p.pz=p.z;
    if(i!==unsupported.fluid.brainIndex&&!unsupported.fluid.coatIndices.includes(i))p.feedstock=true;
  }
  unsupported.fluid.samplePairs();unsupported.fluid.updateComponents(unsupported.activeColliders());
  for(let i=0;i<90;i++)unsupported.fluid.step(1/60,{x:1,z:0,puddle:true,growth:false},unsupported.activeColliders());
  assert.equal(unsupported.fluid.gripClimbing,false);
  assert.ok(unsupported.brain.y<1.7,'a coated brain alone cannot climb');
  const transfer=fifth();atFace(transfer);
  for(let i=0;i<450&&transfer.brain.x<=.55;i++)transfer.step({x:1});
  assert.ok(transfer.brain.x>.55&&transfer.brain.y>GRIP_GARDEN.grip.platform.maxY);
  assert.ok(transfer.fluid.attachedCount>=50,'the body follows over the top');
  assert.ok(transfer.fluid.coatContacts(transfer.activeColliders()).length>=8);
});

test('west and east grip faces both carry real flesh over the lip, with no lift from below',()=>{
  const c=gardenColliders(GRIP_GARDEN),platform=GRIP_GARDEN.grip.platform;
  assert.equal(supportedGroundAt({x:.55,y:1.35,z:-.05},.067,c),1.08);
  assert.equal(supportedGroundAt({x:.55,y:platform.maxY+.1,z:-.05},.067,c),platform.maxY);
  for(const [side,direction,inside] of [['west',1,.2],['east',-1,.8]]){
    const s=fifth();atFace(s,side);
    for(let i=0;i<300&&(direction>0?s.brain.x<inside:s.brain.x>inside);i++)s.step({x:direction});
    assert.ok(direction>0?s.brain.x>=inside:s.brain.x<=inside,`${side} face transfers across the lip`);
    assert.ok(s.brain.y>platform.maxY,`${side} face keeps the core above the platform`);
    assert.ok(s.fluid.attachedCount>=50&&s.fluid.coatContacts(s.activeColliders()).length>=8);
  }
});

test('a fully connected body physically surrounds and collects the raised gem from the west face',()=>{
  for(const offset of [0,.25]){
    const s=fifth(),colliders=s.activeColliders();
    s.fluid=new ParticleFluid({x:-1.4+offset,z:-.05,seedCount:297,massReferenceCount:297});
    for(const p of s.fluid.particles){p.y+=groundAt(p.x,p.z,colliders).height;p.py=p.y;}
    s.fluid.samplePairs();s.fluid.updateComponents(colliders);
    for(let i=0;i<420&&!s.garden.gems[1].collected;i++)s.step(s.brain.x<.55?{x:1}:{contract:true});
    assert.equal(s.garden.gems[1].collected,true,`offset ${offset}: real full body covers the top gem`);
    assert.equal(s.fluid.particles.length,297);
    assert.ok(s.fluid.attachedCount>=285&&s.fluid.coatContacts(colliders).length>=8);
    assert.ok(s.fluid.particles.every(p=>Number.isFinite(p.x+p.y+p.z)));
  }
});

test('more real connected mass climbs more slowly, and smooth stone carries released momentum',()=>{
  const c=gardenColliders(GRIP_GARDEN),height=[];
  for(const count of [65,297]){
    const f=new ParticleFluid({x:-.85,z:-.05,seedCount:count,massReferenceCount:297});
    for(const p of f.particles){p.y+=groundAt(p.x,p.z,c).height;p.py=p.y;}
    f.samplePairs();f.updateComponents(c);
    for(let i=0;i<30;i++)f.step(1/60,{x:1,z:0,puddle:true,growth:false},c);
    height.push(f.brain.y);assert.ok(f.coatContacts(c).length>=8);
  }
  assert.ok(height[0]>height[1]+.02,`early grip ascent: light ${height[0]}, heavy ${height[1]}`);
  function slide(withSlip){
    const s=fifth(),dx=4.2-s.brain.x,dz=1.12-s.brain.z,dy=1.08-s.brain.y+.24;
    for(const p of s.fluid.particles){if(p.feedstock)continue;
      p.x+=dx;p.px=p.x;p.z+=dz;p.pz=p.z;p.y+=dy;p.py=p.y;p.vx=0;p.vy=0;p.vz=1.8;}
    s.fluid.brainDrive.z=1.8;s.fluid.samplePairs();s.fluid.updateComponents(s.activeColliders());
    if(!withSlip){const plain=s.activeColliders().filter(c=>c.type!=='slip');s.activeColliders=()=>plain;}
    run(s,30);const z30=s.brain.z;run(s,90);return {z30,y120:s.brain.y};
  }
  const smooth=slide(true),plain=slide(false);
  assert.ok(smooth.z30>plain.z30+.45);
  assert.ok(smooth.y120<.65,'momentum carries the body over the exposed edge before it lands');
  assert.ok(plain.y120>1.2,'plain floor brings the body to rest');
});

test('a separated Grip Garden fragment expires into visible unpatched green flesh',()=>{
  const s=fifth(),p=s.fluid.particles.find((q,i)=>i!==s.fluid.brainIndex&&!s.fluid.coatIndices.includes(i)&&!q.feedstock);
  p.x=-8;p.z=3.5;p.y=.15;p.px=p.x;p.pz=p.z;p.py=p.y;
  run(s,220);
  assert.equal(p.feedstock,true);assert.equal(p.patchId,undefined);
  const loose=looseGardenParticles(s.fluid.particles);
  assert.ok(loose.includes(p));
  const surface=createParticleSurface(new THREE.MeshBasicMaterial(),28);
  surface.update(loose,s.activeColliders(),s.fluid.radius);
  assert.ok(surface.mesh.geometry.drawRange.count>0,'the detached flesh has a rendered surface');
  surface.mesh.geometry.dispose();surface.mesh.material.dispose();
});

test('Grip Garden view places the raised gem and face at the fifth storey without altering the earlier views',()=>{
  const previous=globalThis.document;
  globalThis.document={createElement:()=>({style:{},remove(){}}),querySelector:()=>({append(){}})};
  try{const view=createWeightGardenView(new THREE.Scene(),{level:GRIP_GARDEN});
    assert.equal(view.group.position.y,-28.8);
    const gem=view.group.children.find(o=>o.isMesh&&Math.abs(o.position.x-.55)<.01&&Math.abs(o.position.z+.05)<.01&&Math.abs(o.position.y-(GRIP_GARDEN.grip.platform.maxY+.34))<.01);
    assert.ok(gem,'platform gem uses the actual elevated surface');
    assert.ok(view.group.children.some(o=>o.userData.pickableTerrain&&o.geometry?.attributes?.position));
    view.dispose();
  }finally{globalThis.document=previous;}
});

test('full Grip Garden route climbs the platform, surrounds all gems and collects all 17 gold',()=>{
  const s=fifth();
  go(s,5.3,-3.2);go(s,3.8,-3.2);go(s,2.7,-3.2);go(s,-.5,-3.2);go(s,-3.8,-3.2);gem(s);
  go(s,-6,-3.2);go(s,-7.5,-3.2);go(s,-7.5,-.95);go(s,-7.5,-.25);go(s,-7.5,.55);go(s,-4.8,.55);
  go(s,-2.4,-.05);go(s,-1.4,-.05);go(s,-.75,-.05);go(s,.55,-.05);
  assert.ok(s.brain.y>GRIP_GARDEN.grip.platform.maxY);gem(s);
  go(s,1.8,-.05);go(s,2.3,1.15);go(s,4.2,1.15);go(s,7.5,1.15);go(s,7.5,2.7);go(s,7.5,3.55);
  go(s,5.2,3.55);go(s,-3.8,3.55);gem(s);
  assert.equal(s.garden.gemCount,3);assert.equal(s.garden.goldCount,17);
  go(s,-7.6,3.65);run(s,180);
  assert.equal(s.garden.phase,'complete');assert.equal(s.fluid.particles.length,297);
  assert.ok(s.fluid.particles.every(p=>Number.isFinite(p.x+p.y+p.z)));
  assert.ok(s.fluid.coatContacts(s.activeColliders()).length>=8);
});

test('an open ledge shortcut finishes while visibly missing full-route points',()=>{
  const s=fifth();go(s,7.5,-.95);go(s,7.5,2.7);go(s,7.5,3.55);go(s,-7.6,3.65);run(s,180);
  assert.equal(s.garden.phase,'complete');assert.ok(s.garden.goldCount<17);assert.ok(s.garden.gemCount<3);
});
