import test from 'node:test';
import assert from 'node:assert/strict';
import {PuddleSimulation} from '../src/simulation.js';
import {HOLLOW_CROWN,GARDEN_LEVELS,createGarden,gardenColliders,updateGarden} from '../src/garden-level.js';
import {draftFromPreset,compileDraft,validateDraft,exportDraft,importDraft} from '../src/editor-workbench.js';

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
  assert.equal(level.start.y,5.8);
  assert.equal(level.editorFixtures.filter(c=>c.type==='sticky-wall').length,3);
  assert.equal(level.editorFixtures.filter(c=>c.type==='slip').length,2);
  assert.equal(gardenColliders(level).length,gardenColliders(HOLLOW_CROWN).length);
  const authoredRoofs=HOLLOW_CROWN.editorFixtures.filter(c=>c.type==='roof');
  const importedRoofs=level.editorFixtures.filter(c=>c.type==='roof');
  assert.deepEqual(importedRoofs.map(c=>!!c.approachBothSides),authoredRoofs.map(c=>!!c.approachBothSides));
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
  for(const [x,z] of [[7,.7],[7,4.4],[5.6,4.5],[.1,4.5],[-.75,3.6]])move(sim,x,z);
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

test('a fall can be recovered up both painted walls to the crown',()=>{
  const sim=playing();
  for(const [x,z] of [[8.6,-4.5],[8.6,4.5],[5.6,4.5],[-4.7,4.05],
    [-6.2,4.5],[-6.2,1.55],[-5,1.55]])move(sim,x,z);
  assert.ok(sim.brain.y<.5,'the shortcut lands on the lower court');
  for(let i=0;i<380&&!(sim.brain.y>3.35&&sim.brain.x<-5.7);i++)sim.step({x:-1,z:0,push:true});
  assert.ok(sim.brain.y>3.35,'the western grip reaches the middle deck');
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
