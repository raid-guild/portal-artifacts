import test from 'node:test';
import assert from 'node:assert/strict';
import {PuddleSimulation} from '../src/simulation.js';
import {HOLLOW_CROWN,GARDEN_LEVELS,createGarden,gardenColliders,updateGarden} from '../src/garden-level.js';
import {draftFromPreset,compileDraft,validateDraft,exportDraft,importDraft} from '../src/editor-workbench.js';
import {groundAt} from '../src/colliders.js';
import {createEditorStageView} from '../src/editor-stage-view.js';
import * as THREE from 'three';

function playing(){
  const sim=new PuddleSimulation();
  assert.equal(sim.startGarden(6),true);
  sim.garden.phase='playing';sim.gardenInputArmed=true;
  return sim;
}
function move(sim,x,z,max=450){
  for(let i=0;i<max&&sim.garden.phase==='playing';i++){
    const dx=x-sim.brain.x,dz=z-sim.brain.z;
    if(Math.hypot(dx,dz)<.16)return;
    sim.step({x:dx,z:dz,push:true});
  }
}

test('Hollow Crown is a roundtrippable six-gem, 297-particle campaign preset',()=>{
  assert.equal(GARDEN_LEVELS.length,7);
  assert.equal(HOLLOW_CROWN.gems.length,6);
  assert.equal(HOLLOW_CROWN.gold.length,36);
  assert.equal(HOLLOW_CROWN.seedCount+HOLLOW_CROWN.poolCounts.reduce((a,b)=>a+b,0),297);
  const draft=draftFromPreset(6),restored=importDraft(exportDraft(draft)),level=compileDraft(restored);
  assert.deepEqual(validateDraft(restored).errors,[]);
  assert.deepEqual(level.pools,HOLLOW_CROWN.pools);
  assert.deepEqual(level.gold,HOLLOW_CROWN.gold);
  assert.deepEqual(level.pits,HOLLOW_CROWN.pits);
  assert.equal(level.pits.length,1);
  assert.equal(level.pits[0].sourceId,'vault-reset-pit');
  assert.equal(groundAt(level.pits[0].x,level.pits[0].z,gardenColliders(level)).height,-8);
  const view=createEditorStageView(new THREE.Scene(),level),ray=new THREE.Raycaster();
  try{
    assert.ok(view.group.children.some(o=>o.material?.color?.getHex?.()===0x172026&&
      Math.abs(o.position.x-level.pits[0].x)<.01&&Math.abs(o.position.z-level.pits[0].z)<.01),
    'the vault pit has visible dark interior walls');
    ray.set(new THREE.Vector3(level.pits[0].x,3,level.pits[0].z),new THREE.Vector3(0,-1,0));
    assert.equal(ray.intersectObjects(view.group.children,true).filter(hit=>hit.object.userData.pickableTerrain).length,0,
      'the pit is cut through the floor rather than capped by a terrain tile');
  }finally{view.dispose();}
  assert.equal(level.start.y,5.8);
  assert.equal(level.editorFixtures.filter(c=>c.type==='sticky-wall').length,3);
  assert.equal(level.editorFixtures.filter(c=>c.type==='slip').length,2);
  assert.equal(gardenColliders(level).length,gardenColliders(HOLLOW_CROWN).length);
  const authoredRoofs=HOLLOW_CROWN.editorFixtures.filter(c=>c.type==='roof');
  const importedRoofs=level.editorFixtures.filter(c=>c.type==='roof');
  assert.deepEqual(importedRoofs.map(c=>!!c.approachBothSides),authoredRoofs.map(c=>!!c.approachBothSides));
  assert.equal(HOLLOW_CROWN.contentRevision,'hollow-crown-1');
});

test('the painted spire can carry the body to a fully encapsulated high gem',()=>{
  const sim=playing();
  for(const [x,z] of [[6.1,-4.5],[0,-4.5],[-6.7,-4.5],[-7,.6],[2,.7]])move(sim,x,z);
  assert.ok(sim.brain.y>3.2&&sim.brain.y<3.8);
  for(let i=0;i<175;i++)sim.step({x:0,z:-1,push:true});
  assert.ok(sim.brain.y>5&&sim.brain.z<-1,'the body physically climbs the ribbed face');
  for(let i=0;i<240&&!sim.garden.gems[2].collected;i++)
    sim.step({x:2.05-sim.brain.x,z:-1.5-sim.brain.z,contract:true});
  assert.ok(sim.garden.gems[2].collected,'living flesh surrounds the gem for the full absorption hold');
});

test('stacked pickups retain authored heights and the exit rejects overflight',()=>{
  const sim=playing(),state=createGarden(HOLLOW_CROWN);
  assert.ok(state.gems[0].y>5.8&&state.gems[4].y<.5);
  assert.ok(state.gold.some(g=>g.y>5.8));
  assert.ok(state.gold.some(g=>g.y<.5));
  sim.brain.x=HOLLOW_CROWN.exit.x;sim.brain.z=HOLLOW_CROWN.exit.z;
  sim.brain.y=3.3;updateGarden(sim,1/60);
  assert.equal(sim.garden.phase,'playing','crossing above the bowl cannot drain');
  sim.brain.y=.2;updateGarden(sim,1/60);
  assert.equal(sim.garden.phase,'draining');
});

test('the sky route, low bridge tunnel, shutter vault, and exit form a physical run',()=>{
  const sim=playing();
  for(const [x,z] of [[6.1,-4.5],[0,-4.5],[-6.7,-4.5],[-7,.6]])move(sim,x,z);
  assert.ok(sim.brain.y>3.5&&sim.brain.y<4.3,'west descent reaches the middle height');
  move(sim,0,.7);
  assert.ok(sim.brain.y>3.2&&sim.brain.y<3.7,'the living body passes under the return bridge tunnel');
  for(const [x,z] of [[7,.7],[7,4.4],[7,5.15],[5.2,5.15],[.1,5.15],[.1,4.4],[-.75,3.6]])move(sim,x,z);
  assert.ok(sim.brain.y<.5,'east descent reaches the lower court');
  for(let i=0;i<180&&sim.pressure.weight<32;i++)sim.step({shed:true});
  assert.ok(sim.pressure.active,'shed flesh lifts the shutter');
  for(const [x,z] of [[-.75,2.3],[.5,2.5],[1.9,3.35],[3.7,3.4]])move(sim,x,z);
  assert.ok(sim.brain.x>1.6,'the brain and body physically cross the opened gate');
  for(let i=0;i<260&&!sim.garden.gems[5].collected;i++)
    sim.step({x:3.7-sim.brain.x,z:3.4-sim.brain.z,contract:true});
  assert.ok(sim.garden.gems[5].collected,'the vault inclusion can be fully encapsulated');
  assert.ok(sim.pressure.active,'the vault stays open after its timed loose flesh expires');
  for(const [x,z] of [[1.9,3.4],[.45,2.5],[-.75,3.4],[-.75,4.5],[-5.8,4.5],[-7.45,3.55]])move(sim,x,z,500);
  assert.equal(sim.garden.phase,'draining','the full living body reaches the exit');
});

test('the enclosed vault pit resets one physical fall while retaining rewards and time',()=>{
  const sim=playing(),pit=HOLLOW_CROWN.pits[0],start=sim.brain;
  const dx=.1-start.x,dy=.28-start.y,dz=3.4-start.z;
  for(const p of sim.fluid.particles)if(!p.feedstock){
    p.x+=dx;p.px+=dx;p.y+=dy;p.py+=dy;p.z+=dz;p.pz+=dz;
  }
  sim.garden.gold[0].collected=true;sim.garden.goldCount=1;sim.garden.playElapsed=11;
  for(let i=0;i<180&&!sim.pressure.active;i++)sim.step({shed:true});
  assert.equal(sim.pressure.active,true,'real basin deposits open the vault shutter');
  for(let i=0;i<100;i++)sim.step({});
  for(const [x,z] of [[-.75,2.3],[.5,2.5],[1.9,3.35],[3.4,3.4]])move(sim,x,z);
  assert.ok(sim.brain.x>1.7&&sim.garden.deaths===0,
    `the body enters the enclosed vault safely (brain ${sim.brain.x.toFixed(2)}, ${sim.brain.z.toFixed(2)}, opening ${sim.pressure.opening.toFixed(2)})`);
  const beforeGold=sim.garden.goldCount,beforeGems=sim.garden.gemCount,
    collectedGoldIds=sim.garden.gold.filter(g=>g.collected).map(g=>g.id),
    collectedGemIds=sim.garden.gems.filter(g=>g.collected).map(g=>g.id);
  move(sim,pit.x,pit.z,300);
  for(let i=0;i<180&&sim.garden.deaths===0;i++)sim.step({x:pit.x-sim.brain.x,z:pit.z-sim.brain.z,push:true});
  assert.equal(sim.garden.deaths,1,'falling into the vault pit respawns exactly once');
  assert.equal(sim.garden.phase,'arriving');
  assert.ok(sim.garden.goldCount>=beforeGold);
  assert.ok(sim.garden.gemCount>=beforeGems);
  assert.ok(collectedGoldIds.every(id=>sim.garden.gold.find(g=>g.id===id)?.collected));
  assert.ok(collectedGemIds.every(id=>sim.garden.gems.find(g=>g.id===id)?.collected));
  assert.ok(sim.garden.playElapsed>=11);
  assert.equal(sim.fluid.particles.length,HOLLOW_CROWN.capacity);
});

test('a fall can be recovered up both painted walls to the crown',()=>{
  const sim=playing();
  for(const [x,z] of [[8.6,-4.5],[8.6,4.5],[7.2,5.15],[5.2,5.15],[-4.7,5.15],
    [-6.2,4.5],[-6.2,1.55],[-5,1.55]])move(sim,x,z);
  assert.ok(sim.brain.y<.5,'the shortcut lands on the lower court');
  assert.ok(sim.brain.x<-5,'the southern bypass reaches the western recovery face');
  for(let i=0;i<380&&!(sim.brain.y>3.35&&sim.brain.x<-5.7);i++)sim.step({x:-1,z:0,push:true});
  assert.ok(sim.brain.y>3.35,
    `the western grip reaches the middle deck (brain ${sim.brain.x.toFixed(2)}, ${sim.brain.z.toFixed(2)}, y ${sim.brain.y.toFixed(2)})`);
  move(sim,-5.85,.05);
  for(let i=0;i<320&&sim.brain.y<5.8;i++)sim.step({x:0,z:-1,push:true});
  assert.ok(sim.brain.y>5.8,'the second grip returns to the upper crown');
});

test('a tendril cast at the raised shelf reaches its separated flesh',()=>{
  const sim=playing();
  for(const [x,z] of [[0,-4.5],[0,-4.04]])move(sim,x,z);
  assert.ok(sim.brain.y>5.8);
  assert.equal(sim.castTendril({x:0,z:-2.6,y:5.32}),true);
  for(let i=0;i<45;i++)sim.step({});
  assert.equal(sim.tendril.recovered,28,'the strand reaches all shelf particles');
  assert.equal(sim.fluid.particles.filter(p=>p.feedstock&&p.patchId===6).length,0);
});
