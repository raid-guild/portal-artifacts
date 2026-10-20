import test from 'node:test';
import assert from 'node:assert/strict';
import { createEntityRuntime, entityAcceleration, releaseEntityHold, stepEntityRuntime } from './entity-runtime.js';
const body = (x, y, vx = 2, vy = 0) => ({ position: { x, y }, velocity: { x: vx, y: vy } });
const base = (id, type, x, y, extras = {}) => ({ id, type, x, y, radius: .8, ...extras });

test('mixed entities apply impulse, energy, capture, and portal without duplicate pickup', () => {
  const entities = [base('boost','impulse',1,0,{direction:90,speed:8}),base('light','lightPickup',4,0,{amount:.3,reusable:false,cooldown:0}),base('hold','stillness',7,0,{captureTime:1}),base('a','portal',12,0,{pairId:'p',exitDirection:0}),base('b','portal',20,0,{pairId:'p',exitDirection:90})];
  const state = createEntityRuntime(entities), b = body(2,0);
  let result = stepEntityRuntime(state,entities,{x:0,y:0},b,0,1/120);
  assert.equal(Math.round(b.velocity.y),8);
  b.position.x=5; result=stepEntityRuntime(state,entities,{x:3,y:0},b,1,1/120);
  assert.equal(result.energyDelta,.3);
  result=stepEntityRuntime(state,entities,{x:3,y:0},b,1.1,1/120);
  assert.equal(result.energyDelta,0);
  b.position.x=8; result=stepEntityRuntime(state,entities,{x:6,y:0},b,2,1/120);
  assert.ok(state.held); assert.equal(b.velocity.x,0);
  assert.equal(releaseEntityHold(state,b,2.1),true);
  b.position.x=13; result=stepEntityRuntime(state,entities,{x:11,y:0},b,3,1/120);
  assert.equal(result.teleported,true); assert.ok(b.position.y>1); assert.ok(Math.abs(Math.hypot(b.velocity.x,b.velocity.y)-8)<1e-8);
});

test('moving lethal ember and gravity keep bounded state and swept collision', () => {
  const entities=[base('orb','ember',0,0,{radius:1,gravity:70,lethal:true,motion:'orbit',speed:1,orbitRadius:4,phase:0}),base('chase','ember',8,0,{radius:.5,gravity:0,lethal:true,motion:'chaser',speed:1,orbitRadius:0,phase:0})];
  const state=createEntityRuntime(entities);
  assert.equal(state.items.orb.x,4);
  assert.ok(entityAcceleration({x:6,y:2},entities,state).x<0);
  const b=body(5,0);
  assert.equal(stepEntityRuntime(state,entities,{x:3,y:0},b,0,1/120,{minX:-10,maxX:10,minY:-10,maxY:10}).died,true);
  b.position={x:0,y:8};
  for(let i=0;i<200;i++) stepEntityRuntime(state,entities,b.position,b,i/120,1/120,{minX:-10,maxX:10,minY:-10,maxY:10});
  assert.ok(state.items.chase.x<=9.5 && state.items.chase.y<=9.5);
});

test('reusable light collects on entry after cooldown, not while continuously touching', () => {
  const entities=[base('light','lightPickup',0,0,{amount:.2,reusable:true,cooldown:1})],state=createEntityRuntime(entities),b=body(0,0);
  assert.equal(stepEntityRuntime(state,entities,{x:-2,y:0},b,0,1/120).energyDelta,.2);
  assert.equal(stepEntityRuntime(state,entities,{x:0,y:0},b,2,1/120).energyDelta,0);
  b.position.x=3;stepEntityRuntime(state,entities,{x:3,y:0},b,2.1,1/120);
  b.position.x=0;assert.equal(stepEntityRuntime(state,entities,{x:3,y:0},b,2.2,1/120).energyDelta,.2);
});

test('clockwise orbit reverses motion without changing start or angular period',()=>{
  const ccw=base('ccw','ember',0,0,{radius:.35,gravity:0,lethal:false,motion:'orbit',speed:Math.PI,orbitRadius:2,phase:0});
  const cw={...ccw,id:'cw',orbitDirection:'clockwise'};
  const state=createEntityRuntime([ccw,cw]);assert.equal(state.items.ccw.x,2);assert.equal(state.items.cw.x,2);
  const b=body(20,20);stepEntityRuntime(state,[ccw,cw],b.position,b,.5,1/120);
  assert.ok(state.items.ccw.y>1.4);assert.ok(state.items.cw.y< -1.4);
});
