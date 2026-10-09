import test from 'node:test';
import assert from 'node:assert/strict';
import {PuddleSimulation,DT} from '../src/simulation.js';
import {draftFromPreset,createBlankDraft,addDraftObject,compileDraft,validateDraft,exportDraft,importDraft} from '../src/editor-workbench.js';
import {scoreRun} from '../src/game-score.js';
import {groundAt} from '../src/colliders.js';
import {createGameProgress} from '../src/game-progress.js';
import {createLocalLevelLibrary} from '../src/local-levels.js';
import {floorPaintApplies} from '../src/surface-paint.js';
import {createParticleSurface} from '../src/particle-surface.js';
import {createEditorStageView} from '../src/editor-stage-view.js';
import * as THREE from 'three';

const storage=()=>{const values=new Map();return {getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)};};

test('pit is a real terrain opening and falling respawns with collected items and clock',()=>{
  const level=compileDraft(draftFromPreset('hazards')),sim=new PuddleSimulation();
  assert.ok(sim.startLocalGarden(level,{id:'hazards',revision:1}));
  const pit=level.pits[0];assert.equal(groundAt(pit.x,pit.z,sim.activeColliders()).height,-8);
  sim.garden.phase='playing';sim.gardenInputArmed=true;sim.garden.playElapsed=11;
  sim.garden.gold[0].collected=true;sim.garden.goldCount=1;
  for(const p of sim.fluid.particles){p.x-=7;p.px=p.x;}
  for(let i=0;i<120&&sim.garden.deaths===0;i++)sim.step({},DT);
  assert.equal(sim.garden.deaths,1);assert.equal(sim.garden.phase,'arriving');
  assert.equal(sim.garden.goldCount,1);assert.ok(sim.garden.playElapsed>=11);
  assert.equal(sim.fluid.particles.length,level.capacity);
  assert.equal(sim.localRun.id,'hazards');
  sim.restartGarden();assert.equal(sim.garden.deaths,0);assert.equal(sim.garden.goldCount,0);
  assert.equal(sim.garden.playElapsed,0);
});

test('lava burns contacting material after grace, and escaping clears burn progress',()=>{
  const level=compileDraft(draftFromPreset('hazards')),sim=new PuddleSimulation();
  sim.startLocalGarden(level,{id:'hazards',revision:1});sim.garden.phase='playing';sim.gardenInputArmed=true;
  const dx=-4-sim.brain.x,dz=-1-sim.brain.z;
  for(const p of sim.fluid.particles){p.x+=dx;p.px=p.x;p.z+=dz;p.pz=p.z;}
  const original=sim.fluid.particles.length;
  for(let i=0;i<10;i++)sim.step({},DT);
  assert.equal(sim.fluid.particles.length,original,'contact grace prevents immediate depletion');
  assert.equal(sim.garden.burnSites.length,0,'the visual cue respects contact grace');
  for(let i=0;i<40;i++)sim.step({},DT);
  assert.ok(sim.fluid.particles.length<original,'contact removes flesh');
  assert.ok(sim.garden.burnSites.length<=12,'burn feedback has a fixed source budget');
  assert.equal(sim.garden.deaths,0,'coating protects the brain initially');
  for(const p of sim.fluid.particles){p.x+=7;p.px=p.x;p.z+=3;p.pz=p.z;}
  sim.step({},DT);assert.equal(sim.garden.coreBurn,0);
  assert.equal(sim.garden.burnSites.length,0,'heat flashes stop after escape');
  assert.ok(sim.fluid.particles.every((p,i)=>i===sim.fluid.brainIndex||p.burnTime===0));
});

test('continued lava exposure reaches the uncoated core and respawns',()=>{
  const level=compileDraft(draftFromPreset('hazards')),sim=new PuddleSimulation();
  sim.startLocalGarden(level,{id:'hazards',revision:1});sim.garden.phase='playing';sim.gardenInputArmed=true;
  const dx=-4-sim.brain.x,dz=-1-sim.brain.z;
  for(const p of sim.fluid.particles){p.x+=dx;p.px=p.x;p.z+=dz;p.pz=p.z;}
  for(let i=0;i<240&&sim.garden.deaths===0;i++)sim.step({},DT);
  assert.equal(sim.garden.deaths,1);assert.equal(sim.garden.phase,'arriving');
  assert.equal(sim.fluid.particles.length,level.capacity,'respawn restores the original supply');
});

test('a lava-stripped body finishes burning after leaving the patch edge',()=>{
  const level=compileDraft(draftFromPreset('hazards')),sim=new PuddleSimulation();
  sim.startLocalGarden(level,{id:'hazards',revision:1});sim.garden.phase='playing';sim.gardenInputArmed=true;
  sim.garden.playElapsed=11;sim.garden.gold[0].collected=true;sim.garden.goldCount=1;
  const dx=-4-sim.brain.x,dz=-1-sim.brain.z;
  for(const p of sim.fluid.particles){p.x+=dx;p.px=p.x;p.z+=dz;p.pz=p.z;}
  for(let i=0;i<120&&!sim.garden.criticalBurnLatched;i++)sim.step({},DT);
  assert.equal(sim.garden.criticalBurnLatched,true,'real heat loss reaches the nonviable body threshold');
  assert.ok(sim.fluid.attachedCount<=20);
  // The core is pulled off the patch before direct core contact can finish it.
  for(const p of sim.fluid.particles){p.x+=7;p.px=p.x;p.z+=3;p.pz=p.z;}
  sim.step({},DT);
  assert.ok(sim.garden.burnSites.length>0,'critical burn remains visible just off the lava edge');
  for(let i=0;i<30&&sim.garden.deaths===0;i++)sim.step({},DT);
  assert.equal(sim.garden.deaths,1,'the stranded remnant cannot softlock the run');
  assert.equal(sim.garden.phase,'arriving');
  assert.equal(sim.garden.goldCount,1);
  assert.ok(sim.garden.playElapsed>=11);
});

test('remote burning flesh cannot condemn a small safe connected body',()=>{
  const level=compileDraft(draftFromPreset('hazards')),sim=new PuddleSimulation();
  sim.startLocalGarden(level,{id:'hazards',revision:1});sim.garden.phase='playing';sim.gardenInputArmed=true;
  const core=sim.brain,coat=new Set(sim.fluid.coatIndices);
  for(let i=0;i<sim.fluid.particles.length;i++){
    if(i===sim.fluid.brainIndex||coat.has(i))continue;
    const p=sim.fluid.particles[i];if(p.feedstock)continue;
    p.x=-4;p.px=p.x;p.z=-1;p.pz=p.z;
  }
  sim.fluid.samplePairs();sim.fluid.updateComponents(sim.activeColliders());
  assert.ok(sim.fluid.attachedCount<=20);
  for(let i=0;i<45;i++)sim.step({},DT);
  assert.equal(sim.brain,core);
  assert.equal(sim.garden.criticalBurnLatched,false);
  assert.equal(sim.garden.deaths,0);
});

test('raised lava affects its owner top, never flesh passing below it',()=>{
  const draft=createBlankDraft(),block=addDraftObject(draft,'block',
    {minX:-1,maxX:1,minZ:-1,maxZ:1,minY:1,maxY:2});
  addDraftObject(draft,'paint',{surface:'lava',face:'floor',targetId:block.id,
    minX:-.8,maxX:.8,minZ:-.8,maxZ:.8,base:2});
  const level=compileDraft(draft),colliders=[level.terrain,...level.editorFixtures],lava=level.editorFixtures.find(c=>c.type==='lava');
  assert.equal(floorPaintApplies(lava,{x:0,y:.067,z:0},.067,colliders),false);
  assert.equal(floorPaintApplies(lava,{x:0,y:2.067,z:0},.067,colliders),true);
});

test('particle removal remaps brain, coat, and strand indices safely',()=>{
  const sim=new PuddleSimulation(),fluid=sim.fluid;
  const oldBrain=fluid.brain,oldLength=fluid.particles.length;
  const removed=[0,3,oldLength-1].filter(i=>i!==fluid.brainIndex&&!fluid.coatIndices.includes(i));
  const map=fluid.removeParticles(removed,sim.activeColliders());sim.tendril.remapParticles(map);
  assert.equal(fluid.brain,oldBrain);assert.equal(fluid.particles.length,oldLength-removed.length);
  assert.ok(fluid.coatIndices.every(i=>i>=0&&i<fluid.particles.length));
  assert.ok(fluid.pairs.every(([i,j])=>i<fluid.particles.length&&j<fluid.particles.length));
  assert.ok(fluid.components.flat().every(i=>i<fluid.particles.length));
});

test('removing a live strand member breaks only its strand and leaves no stale indices',()=>{
  const sim=new PuddleSimulation();sim.selectedTest='pressure';
  assert.equal(sim.castTendril({x:sim.brain.x+2,z:sim.brain.z}),true);
  const member=sim.tendril.indices[0],map=sim.fluid.removeParticles([member],sim.activeColliders());
  sim.tendril.remapParticles(map);
  assert.equal(sim.tendril.active,false);
  assert.equal(sim.tendril.indices.length,0);
  assert.ok(sim.fluid.coatIndices.every(i=>i>=0&&i<sim.fluid.particles.length));
});

test('pit opening matches surface masking and leaves no terrain cap',()=>{
  const level=compileDraft(draftFromPreset('hazards')),colliders=[level.boundary,level.terrain,...level.pits];
  const particles=[{x:.1,y:-.35,z:-2.3},{x:-.1,y:-.37,z:-2.3},{x:0,y:-.2,z:-2.15}];
  const fast=createParticleSurface(new THREE.MeshBasicMaterial(),28),full=createParticleSurface(new THREE.MeshBasicMaterial(),28,{filterColliders:false});
  fast.update(particles,colliders,.067);full.update(particles,colliders,.067);
  assert.equal(fast.mesh.count,full.mesh.count);
  assert.deepEqual(Array.from(fast.mesh.geometry.attributes.position.array.slice(0,fast.mesh.count*3)),
    Array.from(full.mesh.geometry.attributes.position.array.slice(0,full.mesh.count*3)));
  const scene=new THREE.Scene(),view=createEditorStageView(scene,level),ray=new THREE.Raycaster();
  ray.set(new THREE.Vector3(0,5,-2.3),new THREE.Vector3(0,-1,0));
  assert.equal(ray.intersectObjects(view.group.children,true).filter(hit=>hit.object.userData.pickableTerrain).length,0);
  view.dispose();fast.mesh.geometry.dispose();full.mesh.geometry.dispose();
});

test('clock counts playing only and score bonus has an exact target boundary',()=>{
  const sim=new PuddleSimulation();sim.startGarden(1);const start=sim.garden.playElapsed;
  sim.step({},DT);assert.equal(sim.garden.playElapsed,start);
  sim.garden.phase='settling';sim.step({},DT);assert.equal(sim.garden.playElapsed,start);
  sim.garden.phase='playing';sim.gardenInputArmed=true;sim.step({},DT);
  assert.equal(sim.garden.playElapsed,DT);
  sim.garden.phase='paused';sim.step({},DT);assert.equal(sim.garden.playElapsed,DT);
  sim.garden.phase='draining';sim.garden.finishElapsed=DT;sim.step({},DT);
  assert.equal(sim.garden.playElapsed,DT);assert.equal(sim.garden.finishElapsed,DT);
  const counts={gold:1,gems:0,totalGold:2,totalGems:0,target:30};
  assert.equal(scoreRun({...counts,elapsed:30}).percent,60);
  assert.equal(scoreRun({...counts,elapsed:30+DT}).percent,40);
});

test('pit/lava schema roundtrips, keeps old revision at default target, and changes on gameplay edits',()=>{
  const draft=draftFromPreset('hazards'),level=compileDraft(importDraft(exportDraft(draft)));
  assert.deepEqual(validateDraft(draft).errors,[]);
  assert.equal(level.pits.length,1);assert.equal(level.editorFixtures.filter(c=>c.type==='lava').length,1);
  const store=storage(),library=createLocalLevelLibrary({storage:store,idFactory:()=> 'hazards'});
  const old=createBlankDraft();delete old.targetTime;
  const first=library.save(exportDraft(old));old.targetTime=30;
  assert.equal(library.save(exportDraft(old),{id:first.id}).revision,1);
  old.targetTime=31;
  assert.equal(library.save(exportDraft(old),{id:first.id}).revision,2);
  const invalid=createBlankDraft();addDraftObject(invalid,'pit',{x:8.7,z:0,radius:.8});
  assert.match(validateDraft(invalid).errors.join(' '),/pit fully inside/);
});

test('unlock follows collectible record when a faster lower-collection run becomes score best',()=>{
  const store=storage(),progress=createGameProgress({storage:store});
  progress.recordCompletion(1,{gold:9,gems:1,elapsed:60});
  progress.recordCompletion(1,{gold:7,gems:1,elapsed:20});
  assert.equal(progress.getBest(1).percent,52);
  assert.equal(createGameProgress({storage:store}).isUnlocked(2),true);
});
