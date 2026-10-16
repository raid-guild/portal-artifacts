import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {PuddleSimulation} from '../src/simulation.js';
import {ParticleFluid} from '../src/particle-fluid.js';
import {GARDEN_LEVELS,REACH_GARDEN,gardenColliders,arrivalPosition,gardenWorldOffset,gardenFixtureHeight} from '../src/garden-level.js';
import {groundAt,segmentBlockedBySolid,pointInsideSolid} from '../src/colliders.js';
import {closeTablet} from '../src/memory-tablets.js';
import {createEditorStageView} from '../src/editor-stage-view.js';

const tick=(s,input={})=>{s.step(input);if(s.garden?.phase==='reading'){closeTablet(s);s.step({});}};
const run=(s,n,input={})=>{for(let i=0;i<n;i++)tick(s,input);};
const fourth=()=>{const s=new PuddleSimulation();s.tabletStorage=null;s.startGarden(4);run(s,100);return s;};
function go(s,x,z){for(let i=0;i<1800;i++){
  if(s.garden.phase!=='playing'){
    if(s.garden.phase==='draining'&&x===REACH_GARDEN.exit.x&&z===REACH_GARDEN.exit.z)return;
    assert.fail(`Stopped at ${s.garden.phase} before ${x},${z}`);
  }
  const dx=x-s.brain.x,dz=z-s.brain.z,d=Math.hypot(dx,dz);
  if(d<.12){run(s,35);return;}
  tick(s,{x:dx/d,z:dz/d});
}assert.fail(`Could not reach ${x},${z}; brain at ${s.brain.x},${s.brain.z}`);}
const route=(s,points)=>{for(const p of points)go(s,...p);};
const gem=s=>{run(s,220,{contract:true});run(s,60);};
const claimWells=s=>{
  route(s,[[5.3,-3.2],[4.6,-3.2],[3.6,-3.2],[.7,-3.65]]);
  for(const [x,z] of [[2.7,-4.9],[-1.8,-4.8],[-2,-2.35]]){
    assert.equal(s.castTendril({x,z,y:2}),true,`cast to ${x},${z}`);run(s,100);
  }
  assert.equal(s.tendril.recovered,174);
  assert.equal(s.tendril.count,3);
  s.step({recallToggle:true});run(s,380);
  assert.equal(s.tendril.count,0);
  assert.equal(s.fluid.attachedCount,296);
};

test('The Threadworks keeps the descent, preserves previous results, and guards arrival input',()=>{
  const s=new PuddleSimulation();assert.equal(GARDEN_LEVELS.length,7);
  assert.equal(s.startGarden(GARDEN_LEVELS.length+1),false);s.startGarden(3);s.garden.phase='complete';
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
  s.step({});assert.equal(s.gardenInputArmed,true);
  s.garden.phase='complete';assert.equal(s.continueGarden(),true);assert.equal(s.gardenLevelId,5);
  s.startGarden(4);s.restartGarden();assert.equal(s.gardenLevelId,4);assert.equal(s.garden.phase,'arriving');
});

test('three high wells, a clear casting fan, a raised shuttle, and lower folds have real collision',()=>{
  const level=REACH_GARDEN,c=gardenColliders(level);
  assert.equal(level.name,'The Threadworks');assert.equal(level.contentRevision,'threadworks-1');
  assert.equal(c.filter(x=>x.type==='funnel').length,4);
  assert.equal(groundAt(level.start.x,level.start.z,c).height,2.16);
  for(const channel of level.channels){
    assert.ok(Math.abs(groundAt(channel.x,channel.z,c).height-1.84)<1e-9);
    assert.equal(groundAt(channel.x+channel.radius+.1,channel.z,c).height,2.16);
  }
  assert.equal(gardenFixtureHeight(level,0,.4),1.76);
  assert.equal(gardenFixtureHeight(level,4.05,.35),1.76);
  assert.equal(groundAt(0,3.55,c).height,0);
  assert.equal(gardenFixtureHeight(level,4.05,.35,1.76),1.76);
  assert.equal(segmentBlockedBySolid({x:-3.2,y:2.02,z:.4},{x:-2.2,y:2.02,z:.4},c),false);
  assert.equal(segmentBlockedBySolid({x:-3.2,y:2.02,z:-.4},{x:-2.2,y:2.02,z:-.4},c),true);
  assert.equal(segmentBlockedBySolid({x:2.2,y:.17,z:4.1},{x:3,y:.17,z:4.1},c),false);
  assert.equal(segmentBlockedBySolid({x:2.2,y:.65,z:4.1},{x:3,y:.65,z:4.1},c),true);
  assert.equal(level.tablets.length,5);assert.equal(level.gems.length,3);assert.equal(level.gold.length,17);
});

test('three real casts claim 174 well particles and recall them with a connected coating',()=>{
  const s=fourth(),coat=new Set(s.fluid.coatIndices);claimWells(s);
  assert.equal(new Set(s.tendril.indices).size,s.tendril.indices.length);
  assert.ok(s.tendril.indices.every(i=>i!==s.fluid.brainIndex&&!coat.has(i)));
  assert.equal(s.fluid.particles.length,297);
  assert.ok(s.fluid.coatContacts(s.activeColliders()).length>=8);
});

test('the upper wells can be visited and gathered on foot without casting',()=>{
  const s=fourth();route(s,[[5.3,-3.2],[3.6,-3.2],[2.7,-4.9],[.7,-3.65],
    [-1.8,-4.8],[-2,-2.35]]);
  run(s,180);
  assert.equal(s.tendril.recovered,0);
  assert.ok(s.fluid.particles.filter(p=>p.feedstock).length<35,
    'walking through the wells gathers the loose flesh');
  assert.ok(s.fluid.coatContacts(s.activeColliders()).length>=8);
});

test('the raised shuttle moves at least 95% of the campaign body; an oversized core still crosses',()=>{
  const c=gardenColliders(REACH_GARDEN);
  for(const size of [1,1.4]){
    const f=new ParticleFluid({x:-5.8,z:.4,size,seedCount:size===1?null:65});
    for(const p of f.particles){p.y+=1.08;p.py=p.y;}
    let reached=false;
    for(let i=0;i<2400;i++){
      const dx=4.05-f.brain.x,dz=.35-f.brain.z,d=Math.hypot(dx,dz);
      if(d<.12){reached=true;break;}
      f.step(1/60,{x:dx/d,z:dz/d,puddle:true,growth:true},c);
    }
    assert.ok(reached,`size ${size}: core at ${f.brain.x},${f.brain.z}`);
    for(let i=0;i<(size===1?600:120);i++)f.step(1/60,{x:0,z:0,puddle:true,growth:true},c);
    if(size===1)assert.ok(f.attachedCount>=Math.ceil((f.particles.length-1)*.95),
      `campaign body: ${f.attachedCount}/${f.particles.length-1} reached landing`);
    assert.ok(f.coatContacts(c).length>=8);
    assert.ok(f.particles.every(p=>Number.isFinite(p.x+p.y+p.z)&&!pointInsideSolid(p.x,p.y,p.z,c,.03)));
  }
});

test('lower turns and covered lintel deliver the whole 297-particle body',()=>{
  const c=gardenColliders(REACH_GARDEN),f=new ParticleFluid({x:6.5,z:4.1,size:1});
  let passedUnder=false;
  for(const [x,z] of [[4.5,4.1],[4.5,2.6],[2.5,2.6],[2.5,4.15],[.55,4.15],
    [.55,2.6],[-1,2.6],[-3.8,3.55]]){
    let reached=false;
    for(let i=0;i<850;i++){
      const dx=x-f.brain.x,dz=z-f.brain.z,d=Math.hypot(dx,dz);
      if(d<.12){reached=true;break;}
      f.step(1/60,{x:dx/d,z:dz/d,puddle:true,growth:true},c);
      if(f.brain.x>1.78&&f.brain.x<2.78&&f.brain.z>3.05&&f.brain.z<4.65&&
        f.brain.y<REACH_GARDEN.editorFixtures.find(q=>q.sourceId==='thread-lower-lintel').bottom-.07)
        passedUnder=true;
    }
    assert.ok(reached,`lower route stalled before ${x},${z}`);
    for(let i=0;i<35;i++)f.step(1/60,{x:0,z:0,puddle:true,growth:true},c);
    assert.ok(f.attachedCount>=Math.ceil(296*.95),`only ${f.attachedCount} flesh followed to ${x},${z}`);
  }
  assert.ok(passedUnder,'the body travels beneath the lintel');
  assert.ok(f.coatContacts(c).length>=8);
  assert.ok(f.particles.every(p=>Number.isFinite(p.x+p.y+p.z)&&!pointInsideSolid(p.x,p.y,p.z,c,.03)));
});

test('the full Threadworks route collects wells, raised gem, lower rewards, and five memories',()=>{
  const s=fourth();claimWells(s);
  route(s,[[-3.25,-3.55],[-4.8,-3.55],[-5.4,-3.55]]);gem(s);
  route(s,[[-7.5,-.95],[-7.5,-.25],[-6.6,.45],[-5.8,.4],[-4.2,.4],[-3.4,.4],[-2.25,.4],[-1.6,.4],
    [-.2,.4],[.25,.4],[1.3,.4],[2.8,.4],[4.05,.35]]);gem(s);
  assert.equal(s.garden.gemCount,2,'raised landing has enough space to enclose its gem');
  assert.ok(s.fluid.attachedCount>=Math.ceil(296*.95),'bridge keeps nearly all living flesh');
  route(s,[[6,.4],[7.5,.4],[7.5,2.7],[6.5,3.55],[6.5,4.1],[4.5,4.1],
    [4.5,2.6],[2.5,2.6],[2.5,3.55],[2.5,4.15],[.55,4.15],[.55,2.6],
    [-1,2.6],[-2,2.6],[-3.8,3.55]]);gem(s);
  assert.equal(s.garden.gemCount,3);assert.equal(s.garden.goldCount,17);
  assert.ok(s.garden.tablets.every(t=>t.read));
  if(s.garden.phase==='playing')go(s,-7.6,3.65);
  run(s,180);
  assert.equal(s.garden.phase,'complete');assert.equal(s.fluid.particles.length,297);
  assert.ok(s.fluid.particles.every(p=>Number.isFinite(p.x+p.y+p.z)));
  assert.ok(s.fluid.coatContacts(s.activeColliders()).length>=8);
});

test('falling from the high entrance reaches the lower drain while missing raised rewards',()=>{
  const s=fourth();route(s,[[7.6,-.5],[7.5,2.7],[6.5,3.55],[6.5,4.1],[4.5,4.1],
    [4.5,2.6],[2.5,2.6],[2.5,3.55],[2.5,4.15],[.55,4.15],[.55,2.6],
    [-1,2.6],[-2,2.6],[-3.8,3.55]]);
  if(s.garden.phase==='playing')go(s,-7.6,3.65);
  run(s,180);
  assert.equal(s.garden.phase,'complete');assert.ok(s.garden.goldCount<17);assert.ok(s.garden.gemCount<3);
});

test('Level 4 game view renders its blocks, five memory stones, and pickable high floor',()=>{
  const view=createEditorStageView(new THREE.Scene(),REACH_GARDEN);
  try{
    view.group.position.y=gardenWorldOffset(4);view.setPlaying(true);
    assert.equal(view.group.position.y,-21.6);
    const meshes=[];view.group.traverse(o=>{if(o.isMesh)meshes.push(o);});
    for(const fixture of REACH_GARDEN.editorFixtures)
      assert.ok(meshes.some(o=>o.userData.editorId===fixture.sourceId),fixture.sourceId);
    assert.ok(view.group.children.filter(o=>o.userData.pickableTerrain).length>=6);
    assert.ok(meshes.every(o=>Number.isFinite(o.position.x+o.position.y+o.position.z)));
  }finally{view.dispose();}
});
