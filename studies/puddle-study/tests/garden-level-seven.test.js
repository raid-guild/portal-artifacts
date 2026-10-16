import test from 'node:test';
import assert from 'node:assert/strict';
import {PuddleSimulation} from '../src/simulation.js';
import {EMBER_CASCADE,GARDEN_LEVELS,gardenColliders,gardenWorldOffset} from '../src/garden-level.js';
import {draftFromPreset,compileDraft,validateDraft,exportDraft,importDraft} from '../src/editor-workbench.js';
import {groundAt} from '../src/colliders.js';
import {floorPaintApplies} from '../src/surface-paint.js';

const playing=()=>{const sim=new PuddleSimulation();assert.equal(sim.startGarden(7),true);
  sim.garden.phase='playing';sim.gardenInputArmed=true;return sim;};
function move(sim,x,z,{max=450,contract=false}={}){
  let frames=0;
  for(;frames<max&&sim.garden.phase==='playing';frames++){
    const dx=x-sim.brain.x,dz=z-sim.brain.z;
    if(Math.hypot(dx,dz)<.19)break;
    sim.step({x:dx,z:dz,push:!contract,contract});
  }
  assert.ok(frames<max,`route reaches ${x}, ${z} (brain ${sim.brain.x.toFixed(2)}, ${sim.brain.z.toFixed(2)}, y ${sim.brain.y.toFixed(2)}, deaths ${sim.garden.deaths})`);
  return frames;
}
function takeGem(sim,index){const gem=sim.garden.gems[index];
  move(sim,gem.x,gem.z,{max:350,contract:true});
  for(let i=0;i<280&&!gem.collected;i++)sim.step({x:gem.x-sim.brain.x,z:gem.z-sim.brain.z,contract:true});
  assert.ok(gem.collected,`gem ${index+1} is surrounded by living flesh`);
}
function takeStairGold(sim,x,zs){
  for(const z of zs)move(sim,x,z);
  for(const z of zs)assert.ok(sim.garden.gold.find(g=>Math.abs(g.x-x)<.06&&Math.abs(g.z-z)<1e-9)?.collected,
    `attached flesh collects the stair coin at ${x}, ${z}`);
}

test('Ember Cascade roundtrips as a seven-gem 297-particle campaign floor with owned lava',()=>{
  assert.equal(GARDEN_LEVELS.length,7);
  assert.equal(EMBER_CASCADE.gems.length,7);
  assert.ok(EMBER_CASCADE.gold.length>=50&&EMBER_CASCADE.gold.length<=60);
  assert.equal(EMBER_CASCADE.seedCount+EMBER_CASCADE.poolCounts.reduce((a,b)=>a+b,0),297);
  assert.equal(EMBER_CASCADE.targetTime,135);
  assert.equal(gardenWorldOffset(6),-36);assert.equal(gardenWorldOffset(7),-45);
  const draft=importDraft(exportDraft(draftFromPreset(7))),level=compileDraft(draft);
  assert.deepEqual(validateDraft(draft).errors,[]);
  assert.deepEqual(level.pools,EMBER_CASCADE.pools);
  assert.deepEqual(level.gold,EMBER_CASCADE.gold);
  assert.deepEqual(level.gems,EMBER_CASCADE.gems);
  assert.deepEqual(level.pits,EMBER_CASCADE.pits);
  assert.equal(level.editorFixtures.length,EMBER_CASCADE.editorFixtures.length);
  assert.equal(level.pits.length,4);
  assert.equal(level.editorFixtures.filter(c=>c.type==='lava').length,3);
  const colliders=gardenColliders(level);
  for(const pit of level.pits)assert.equal(groundAt(pit.x,pit.z,colliders).height,-8);
  for(const [sourceId,maxZ] of [['ember-upper-west',-4.8],['ember-middle-east',-1.1],['ember-lower-west',2.7]])
    assert.equal(level.editorFixtures.find(c=>c.sourceId===sourceId).maxZ,maxZ);
  for(const [sourceId,range] of [['ember-west-descent',[-4.45,-4.05,-3.65,-3.25,-2.85]],
    ['ember-east-descent',[-1,-.65,-.2,.25,.7,1.1]],
    ['ember-final-descent',[3.15,3.65,4.15,4.65,5.1]]]){
    const stair=level.editorFixtures.find(c=>c.sourceId===sourceId),x=sourceId==='ember-east-descent'?7:sourceId==='ember-final-descent'?-7:-7.05;
    for(const z of range){
      const gold=level.gold.find(g=>g[0]===x&&g[1]===z);
      assert.ok(gold,`${sourceId} has a coin at ${z}`);
      const expected=stair.base+stair.rise*(1-(z-stair.minZ)/(stair.maxZ-stair.minZ));
      assert.ok(Math.abs(gold[2]-expected)<1e-9,`${sourceId} coin at ${z} matches its ramp`);
    }
  }
  assert.equal(EMBER_CASCADE.contentRevision,'ember-cascade-1');
  const raised=level.editorFixtures.find(c=>c.sourceId==='ember-raised-lava');
  assert.equal(raised.targetId,'ember-first-shoulder');
  assert.equal(floorPaintApplies(raised,{x:0,y:.067,z:-5},.067,colliders),false);
  assert.equal(floorPaintApplies(raised,{x:0,y:6.667,z:-5},.067,colliders),true);
  const below=level.editorFixtures.find(c=>c.sourceId==='ember-underbridge-lava');
  assert.equal(below.base,0);
  assert.equal(floorPaintApplies(below,{x:0,y:.067,z:-1.8},.067,colliders),true);
  assert.equal(floorPaintApplies(below,{x:0,y:4.467,z:-1.8},.067,colliders),false);
});

test('one physical route descends all three stairs, climbs the Lookout, gathers seven gems, and drains',()=>{
  const sim=playing();
  for(const p of [[4,-5.8],[0,-5.9],[-4,-5.8]])move(sim,...p);
  takeGem(sim,0);
  move(sim,-7,-4.95);
  takeStairGold(sim,-7,[-4.45,-4.05,-3.65,-3.25,-2.85]);
  move(sim,-7,-2.3);
  takeGem(sim,1);
  assert.ok(sim.brain.y>4.3&&sim.brain.y<5.4,'west stair reaches the middle deck');
  move(sim,0,-1.8);
  for(let i=0;i<110;i++)sim.step({x:0,z:-1,push:true});
  assert.ok(sim.brain.y>5.6,'the painted south face lifts the body onto the Lookout');
  takeGem(sim,2);
  move(sim,0,-1.8);move(sim,7,-1.8);takeGem(sim,3);
  takeStairGold(sim,7,[-1,-.65,-.2,.25,.7,1.1]);
  move(sim,7,1.7);move(sim,7,2);
  move(sim,3,2);
  assert.ok(sim.brain.y>2.1&&sim.brain.y<3.2,'east stair reaches the lower deck');
  for(const p of [[0,2],[-4,2]])move(sim,...p);
  takeGem(sim,4);
  move(sim,-7,3);
  takeStairGold(sim,-7,[3.15,3.65,4.15,4.65,5.1]);
  move(sim,-7,5.2);move(sim,-7,5.5);move(sim,-5.7,5.5);move(sim,-5,5.5);
  assert.ok(sim.brain.y<1,'final stair reaches the court');
  takeGem(sim,5);
  move(sim,-4.7,6.15);move(sim,4.8,6.15);takeGem(sim,6);
  assert.equal(sim.garden.gemCount,7);
  assert.ok(sim.garden.goldCount>=35,'the main route collects most of its gold; the rest marks detours');
  assert.equal(sim.garden.deaths,0);
  assert.ok(sim.garden.playElapsed<EMBER_CASCADE.targetTime,'the measured collection route fits 135 seconds');
  move(sim,7.2,5.5);
  assert.equal(sim.garden.phase,'draining');
});

test('a fallen body can skirt the lava in the east side corridor and climb back',()=>{
  const sim=playing();
  for(const p of [[7.7,-5.5],[7.7,-3.1]])move(sim,...p);
  for(let i=0;i<100;i++)sim.step({});
  assert.ok(sim.brain.y<.5,'the body falls into the open court');
  for(const p of [[8.7,-3.1],[8.7,4.1],[5.1,4.1],[5.1,3.2]])move(sim,...p);
  assert.ok(sim.brain.x>4.9&&sim.brain.x<5.5&&sim.brain.y<.5,'the outer corridor reaches the cool recovery face');
  for(let i=0;i<300&&sim.brain.y<2.3;i++)sim.step({x:1,z:0,push:true});
  assert.ok(sim.brain.y>=2.3,'the body climbs from ground to the lower deck');
  assert.equal(sim.garden.deaths,0);
});

test('the front-court pit physically resets the body without erasing a collected reward',()=>{
  const sim=playing(),start=sim.brain,pit=EMBER_CASCADE.pits.find(p=>p.sourceId==='ember-front-pit');
  const dx=-.1-start.x,dy=.3-start.y,dz=2.85-start.z;
  for(const p of sim.fluid.particles)if(!p.feedstock){
    p.x+=dx;p.px+=dx;p.y+=dy;p.py+=dy;p.z+=dz;p.pz+=dz;
  }
  sim.garden.gold[0].collected=true;sim.garden.goldCount=1;sim.garden.playElapsed=13;
  move(sim,pit.x,pit.z,{max:200});
  for(let i=0;i<180&&sim.garden.deaths===0;i++)sim.step({x:pit.x-sim.brain.x,z:pit.z-sim.brain.z,push:true});
  assert.equal(sim.garden.deaths,1);
  assert.equal(sim.garden.phase,'arriving');
  assert.equal(sim.garden.goldCount,1);
  assert.ok(sim.garden.playElapsed>=13);
  assert.equal(sim.fluid.particles.length,EMBER_CASCADE.capacity);
});
