import test from 'node:test';
import assert from 'node:assert/strict';
import {GARDEN_LEVELS} from '../src/garden-level.js';
import {normalizePreset,validateLevel,exportLevel,importLevel,moveObject,position,setTerrain,History,EditorSimulation} from '../src/editor-model.js';

test('all four editor presets round-trip without changing campaign definitions',()=>{
  const before=JSON.stringify(GARDEN_LEVELS);
  for(const id of [2,3,4,5]){const l=normalizePreset(id);assert.deepEqual(validateLevel(l).errors,[],String(id));assert.deepEqual(importLevel(exportLevel(l)),l);}
  assert.equal(JSON.stringify(GARDEN_LEVELS),before);
});
test('terrain edits retain stair continuity and pressure base alignment',()=>{
  const l=normalizePreset(2);setTerrain(l,{frontHeight:2.7,middleHeight:1.35,frontZ:-1.5});
  assert.equal(l.gate.base,1.35);assert.equal(l.terrain.leftStairs.startZ,-1.5);
  assert.equal(l.terrain.leftStairs.steps.reduce((a,c)=>a+c.drop,0),1.35);
  assert.equal(l.terrain.rightStairs.steps.reduce((a,c)=>a+c.drop,0),1.35);
  assert.deepEqual(validateLevel(l).errors,[]);
});
test('moving grip moves ramp and platform together without changing heights',()=>{
  const l=normalizePreset(5),old=l.grip.ramp.minX,start=position(l,{kind:'grip'});
  moveObject(l,{kind:'grip'},start.x+.5,start.z+.25);
  assert.equal(l.grip.ramp.minX,old+.5);assert.equal(l.grip.ramp.maxX,l.grip.platform.minX);
  assert.equal(l.grip.platform.maxY,3.78);
  l.grip.ramp.maxHeight=1.38;l.grip.platform.maxY=2.82;
  setTerrain(l,{middleHeight:1.2});
  assert.ok(Math.abs(l.grip.ramp.maxHeight-1.5)<1e-9);
  assert.ok(Math.abs(l.grip.platform.maxY-2.94)<1e-9);
  const tall=normalizePreset(5);
  assert.deepEqual(validateLevel(tall).errors,[],'an authored Grip platform may rise above the high starting terrace');
  tall.grip.platform.maxY=tall.terrain.middleHeight+3.01;
  assert.match(validateLevel(tall).errors.join(' '),/no more than 3 units/);
});
test('legacy Z-axis grip export remains valid and height normalization keeps its slope',()=>{
  const l=normalizePreset(5);
  l.grip.ramp={type:'grip-ramp',minX:-1.3,maxX:1.3,minZ:.25,maxZ:1.35,northHeight:1.44,southHeight:1.08};
  l.grip.platform={type:'box',gripPlatform:true,minX:-1.9,maxX:1.9,minZ:-1.95,maxZ:.25,minY:1.08,maxY:1.98};
  assert.deepEqual(validateLevel(l).errors,[]);
  const loaded=importLevel(exportLevel(l));
  assert.equal(loaded.grip.ramp.axis,undefined);
  setTerrain(loaded,{middleHeight:1.2});
  assert.ok(Math.abs(loaded.grip.ramp.southHeight-1.2)<1e-9);
  assert.ok(Math.abs(loaded.grip.ramp.northHeight-1.56)<1e-9);
});
test('an isolated custom play test moves on edited terrain with conserved particles',()=>{
  const l=normalizePreset(4);setTerrain(l,{frontHeight:2.7});l.gold=[[6.9,-3.2]];
  const sim=new EditorSimulation(l);sim.garden.phase='playing';sim.gardenInputArmed=true;
  const start=sim.brain.x;for(let i=0;i<45;i++)sim.step({x:-1,z:0});
  assert.ok(sim.brain.x<start-.2);
  assert.equal(sim.fluid.particles.length,l.seedCount+l.poolCounts.reduce((a,c)=>a+c,0));
  assert.ok(sim.fluid.particles.every(p=>Number.isFinite(p.x+p.y+p.z)));
  assert.equal(sim.garden.gold.length,1);assert.equal(sim.gardenLevel.terrain.frontHeight,2.7);
});
test('invalid imports and impossible spawn/budget configurations cannot be tested',()=>{
  let l=normalizePreset(4);l.poolCounts[0]=200;assert.match(validateLevel(l).errors.join(' '),/budget/);
  l=normalizePreset(4);l.start.z=3;assert.match(validateLevel(l).errors.join(' '),/start/i);
  l=normalizePreset(4);l.channels[1]={...l.channels[0]};assert.match(validateLevel(l).errors.join(' '),/overlap/);
  l=normalizePreset(5);l.pools[0]=[0,-.85];assert.match(validateLevel(l).errors.join(' '),/inside an obstacle/);
  l=normalizePreset(2);l.gate.width='0.5';assert.throws(()=>importLevel(exportLevel(l)),/numbers/);
  assert.throws(()=>importLevel('{"format":"puddle-level","version":2}'),/version 1/);
});
test('undo/redo snapshots survive branching and play tests own their custom definition',()=>{
  const l=normalizePreset(4),h=new History(l);l.name='A';h.commit(l);l.name='B';h.commit(l);
  assert.equal(h.undo().name,'A');assert.equal(h.redo().name,'B');h.undo();const c=h.undo();c.name='C';h.commit(c);assert.equal(h.redo().name,'C');
  const custom=normalizePreset(4);custom.name='Test garden';custom.start.x=6.8;custom.gold=[[6.8,-3.2]];
  const before=JSON.stringify(GARDEN_LEVELS),sim=new EditorSimulation(custom);
  assert.equal(sim.gardenLevel.name,'Test garden');assert.equal(sim.brain.x,6.8);assert.equal(sim.garden.gold.length,1);
  custom.start.x=0;assert.equal(sim.gardenLevel.start.x,6.8);
  sim.restartGarden();assert.equal(sim.brain.x,6.8);sim.garden.phase='complete';assert.equal(sim.continueGarden(),false);
  assert.equal(JSON.stringify(GARDEN_LEVELS),before);
});
