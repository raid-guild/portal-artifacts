import test from 'node:test';
import assert from 'node:assert/strict';
import { createEncounterState, stepEncounter, sweptRamHit, mineExposureSeconds, hazardPhase,
  chooseBossIntent, mineAvailability, tryDropMine, ENCOUNTER } from './encounter.js';

const bounds = { minX: -16, maxX: 16, minY: -9, maxY: 9 };
const step = (state, before, hero, options = {}) => stepEncounter(state, { before, hero, dt: 1 / 120,
  bounds, time: 3, ...options });

test('relative sweep catches fast rams and a moving boss, but cooldown and separation prevent farming', () => {
  assert.notEqual(sweptRamHit({x:-4,y:0},{x:4,y:0},{x:0,y:0},{x:0,y:0}),null);
  assert.notEqual(sweptRamHit({x:-4,y:0},{x:-4,y:0},{x:0,y:0},{x:-5,y:0}),null);
  assert.equal(sweptRamHit({x:-4,y:3},{x:4,y:3},{x:0,y:0},{x:0,y:0}),null);
  let state=createEncounterState();
  let result=step(state,{x:1.1,y:0},{x:1.1,y:0});
  assert.equal(result.state.hits,1);
  assert.deepEqual(result.costs,{hero:.12,boss:.12});
  state=result.state;
  for(let i=0;i<100;i++) state=step(state,{x:state.boss.x+1,y:state.boss.y},{x:state.boss.x+1,y:state.boss.y}).state;
  assert.equal(state.hits,1);
  const far={x:state.boss.x+3,y:state.boss.y};
  result=step(state,far,far);
  assert.equal(result.state.hits,1);
  assert.equal(result.state.ramArmed,true);
  result=step(result.state,far,{x:result.state.boss.x+1,y:result.state.boss.y});
  assert.equal(result.state.hits,2);
});

test('owner-filtered delayed mines expose only the opponent, with exact bounded active overlap',()=>{
  assert.equal(hazardPhase(0),'warning');
  assert.equal(hazardPhase(ENCOUNTER.warnDuration),'active');
  assert.equal(hazardPhase(ENCOUNTER.warnDuration+ENCOUNTER.activeDuration),'fading');
  const heroMine={id:1,x:0,y:0,age:1.5,owner:'hero'};
  const bossMine={id:2,x:0,y:0,age:1.5,owner:'boss'};
  assert.equal(mineExposureSeconds({x:0,y:0},{x:0,y:0},[heroMine],.2,ENCOUNTER,'hero'),0);
  assert.ok(Math.abs(mineExposureSeconds({x:0,y:0},{x:0,y:0},[heroMine],.2,ENCOUNTER,'boss')-.2)<1e-9);
  assert.ok(Math.abs(mineExposureSeconds({x:0,y:0},{x:0,y:0},[bossMine,bossMine],.2,ENCOUNTER,'hero')-.2)<1e-9);
  assert.equal(mineExposureSeconds({x:0,y:0},{x:0,y:0},[{...bossMine,age:.2}],.2),0);
  const expiry=mineExposureSeconds({x:0,y:0},{x:0,y:0},[{...bossMine,age:2.55}],.1);
  assert.ok(expiry>0 && expiry<.1);
  const graze=mineExposureSeconds({x:-4,y:0},{x:4,y:0},[bossMine],.2);
  assert.ok(graze>0 && graze<.2);
});

test('same mine helper rejects cost-free invalid drops and caps both owners separately',()=>{
  const state=createEncounterState();
  const input={owner:'hero',actor:{x:-5,y:0,vx:3,vy:0},opponent:{x:0,y:0},bounds,time:3,energy:.6};
  let result=tryDropMine(state,input);
  assert.equal(mineAvailability(state,input).available,true);
  assert.equal(result.dropped,true); assert.equal(result.cost,.08);
  assert.equal(result.state.hazards[0].owner,'hero');
  assert.equal(mineAvailability(state,{...input,energy:.05}).reason,'light');
  assert.equal(tryDropMine(state,{...input,energy:.05}).dropped,false);
  assert.equal(mineAvailability(state,{...input,actor:{...input.actor,x:-15}}).reason,'space');
  assert.equal(tryDropMine(state,{...input,actor:{...input.actor,x:-15}}).dropped,false);
  assert.equal(mineAvailability(result.state,{...input,time:3.1}).reason,'cooldown');
  assert.ok(mineAvailability(result.state,{...input,time:3.1}).remaining>0);
  assert.equal(tryDropMine(result.state,{...input,time:3.1}).dropped,false);
  assert.equal(mineAvailability(state,{...input,actor:{...input.actor,vx:0,vy:0}}).reason,'speed');
  const full={...state,hazards:[1,2].map(id=>({id,x:id,y:3,age:0,owner:'hero'}))};
  assert.equal(mineAvailability(full,input).reason,'capacity');
  assert.equal(tryDropMine(full,input).reason,'capacity');
  assert.equal(tryDropMine(full,{...input,owner:'boss',actor:{x:5,y:0,vx:-3,vy:0},opponent:input.actor}).dropped,true);
});

test('ram precedence suppresses both mine exposure but keeps paid mines alive',()=>{
  const state={...createEncounterState(),hazards:[{id:1,x:1,y:0,age:1.5,owner:'boss'}]};
  const result=step(state,{x:1,y:0},{x:1,y:0});
  assert.ok(result.events.includes('hit'));
  assert.equal(result.heroExposureSeconds,0);
  assert.equal(result.bossExposureSeconds,0);
  assert.equal(result.state.hazards.length,1);
});

test('adaptive boss alternates pursuit and escape, seeks light with hysteresis, and abandons vanished target',()=>{
  const state={...createEncounterState(),intentTime:4};
  assert.equal(chooseBossIntent(state,.6,.6,[]),'chase');
  assert.equal(chooseBossIntent({...state,intent:'chase'},.6,.6,[]),'flee');
  const pickups=[{x:3,y:0}];
  assert.equal(chooseBossIntent(state,.6,.2,pickups),'recharge');
  assert.equal(chooseBossIntent({...state,intent:'recharge',intentTime:.5},.6,.4,pickups),'recharge');
  assert.equal(chooseBossIntent({...state,intent:'recharge'},.6,.5,pickups),'flee');
  assert.equal(chooseBossIntent({...state,intent:'recharge'},.6,.2,[]),'flee');
  assert.equal(chooseBossIntent({...state,intent:'flee'},.6,.6,[],'chase'),'chase');
});
