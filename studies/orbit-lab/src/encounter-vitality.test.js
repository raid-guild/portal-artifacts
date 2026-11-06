import test from 'node:test';
import assert from 'node:assert/strict';
import { getDemo } from './demos.js';
import { createEncounterVitality, stepEncounterVitality, MINE_BURN_RATE } from './encounter-vitality.js';

const level=getDemo('encounter').level;
const far={x:-13,y:6}, bossFar={x:13,y:-6};
const advance=(state,options={})=>stepEncounterVitality(state,{heroBefore:far,hero:far,bossBefore:bossFar,boss:bossFar,dt:1,time:1,level,...options});

test('two private 60% timers share a single contested pickup pool',()=>{
  const state=createEncounterVitality();
  assert.equal(state.hero.energy,.6); assert.equal(state.boss.energy,.6);
  assert.equal(state.hero.pickups.length,0); assert.equal(state.boss.pickups.length,0);
  assert.equal(state.pickups.length,2);
  const pickup={x:0,y:0,id:8,createdAt:0};
  const contested={...state,pickups:[pickup],nextSpawnAt:99};
  let result=advance(contested,{heroBefore:pickup,hero:pickup,bossBefore:pickup,boss:pickup});
  assert.deepEqual(result.collected,{hero:1,boss:0});
  assert.ok(result.state.hero.energy>result.state.boss.energy);
  result=advance({...contested,tieOwner:'boss'},{heroBefore:pickup,hero:pickup,bossBefore:pickup,boss:pickup});
  assert.deepEqual(result.collected,{hero:0,boss:1});
});

test('both burn, spend costs once, and mines sizzle without instant death',()=>{
  const state=createEncounterVitality();
  const normal=advance(state).state;
  assert.ok(Math.abs(normal.hero.energy-.59)<1e-9);
  assert.ok(Math.abs(normal.boss.energy-.59)<1e-9);
  const result=advance(state,{heroExposureSeconds:.7,bossExposureSeconds:.2,costs:{hero:.08,boss:.12}}).state;
  assert.ok(Math.abs(result.hero.energy-(.6-.01-.08-.7*MINE_BURN_RATE))<1e-9);
  assert.ok(Math.abs(result.boss.energy-(.6-.01-.12-.2*MINE_BURN_RATE))<1e-9);
  assert.equal(result.hero.failed,false); assert.equal(result.boss.failed,false);
});

test('shared recharge rescues either side before grace expiry; simultaneous expiry draws',()=>{
  let state=createEncounterVitality();
  state={...state,hero:{...state.hero,energy:0,graceLeft:.05},boss:{...state.boss,energy:0,graceLeft:.05},
    pickups:[{x:0,y:0,id:9,createdAt:0}],nextSpawnAt:99};
  const rescued=advance(state,{heroBefore:{x:-2,y:0},hero:{x:2,y:0},dt:.1,time:.1});
  assert.equal(rescued.collected.hero,1);
  assert.ok(rescued.state.hero.energy>=.3);
  assert.equal(rescued.state.hero.graceLeft,8);
  assert.equal(rescued.result,'boss');
  const draw=advance({...state,pickups:[]},{dt:.1,time:.1});
  assert.equal(draw.result,'draw');
});

test('pause freezes both grace clocks and mine-aware spawns never mutate level',()=>{
  let state=createEncounterVitality();
  state={...state,hero:{...state.hero,energy:0,graceLeft:4},boss:{...state.boss,energy:0,graceLeft:4},pickups:[],nextSpawnAt:99};
  const paused=advance(state,{lightPaused:true});
  assert.equal(paused.state.hero.graceLeft,4); assert.equal(paused.state.boss.graceLeft,4);
  const hazards=[{x:5,y:3,age:1.5,owner:'boss'}];
  advance(createEncounterVitality(),{hazards});
  assert.equal(level.dangers,undefined);
});

test('teleport collects at the exit but not along the jump between rooms',()=>{
  const state={...createEncounterVitality(),pickups:[
    {x:0,y:0,id:4,createdAt:0},{x:8,y:0,id:5,createdAt:0}],nextSpawnAt:99};
  const result=stepEncounterVitality(state,{heroBefore:{x:-8,y:0},hero:{x:-6,y:0},arrival:{x:8,y:0},
    bossBefore:{x:13,y:7},boss:{x:13,y:7},dt:1/120,time:1,level});
  assert.equal(result.collected.hero,1);
  assert.deepEqual(result.state.pickups.map(pickup=>pickup.id),[4]);
});
