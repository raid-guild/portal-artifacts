import test from 'node:test';
import assert from 'node:assert/strict';
import { collectCompanionLight, commitCompanionCaptures, createEntityRuntime, entityAcceleration, holdsCampaignLight, releaseEntityHold, stepEntityRuntime } from './entity-runtime.js';
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

test('ember immunity skips lethal ember contact and reports the collided ember otherwise', () => {
  const entities = [base('giant', 'ember', 0, 0, { radius: 4, lethal: true, motion: 'fixed' })];
  const runtime = createEntityRuntime(entities);
  const hit = stepEntityRuntime(runtime, entities, { x: -5, y: 0 }, body(0, 0), 0, 1 / 120);
  assert.equal(hit.died, true);
  assert.deepEqual(hit.fatalEmber, { id: 'giant', x: 0, y: 0, radius: 4 });
  const protectedStep = stepEntityRuntime(runtime, entities, { x: -5, y: 0 }, body(0, 0), 0, 1 / 120, null, { emberImmune: true });
  assert.equal(protectedStep.died, false);
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

test('multiple companion influence rings collect on swept entry once and reset with runtime', () => {
  const entities = [
    base('moon-a','companion',6,1.5,{radius:.16,captureRadius:2.8}),
    base('moon-b','companion',15,-2,{radius:.16,captureRadius:2.8}),
  ];
  const state = createEntityRuntime(entities), b = body(9,0);
  assert.deepEqual(stepEntityRuntime(state,entities,{x:1,y:0},b,1,1/120).companions,['moon-a']);
  assert.deepEqual(commitCompanionCaptures(state,['moon-a']),[{id:'moon-a',x:6,y:1.5}]);
  assert.deepEqual(commitCompanionCaptures(state,['moon-a']),[]);
  b.position.x = 18;
  assert.deepEqual(stepEntityRuntime(state,entities,{x:9,y:0},b,2,1/120).companions,['moon-b']);
  assert.equal(state.items['moon-b'].used,false);
  assert.deepEqual(commitCompanionCaptures(state,['moon-b']),[{id:'moon-b',x:15,y:-2}]);
  assert.deepEqual(stepEntityRuntime(createEntityRuntime(entities),entities,{x:1,y:0},body(9,0),1,1/120).companions,['moon-a']);
});

test('lethal contact takes precedence over a pending companion capture', () => {
  const entities = [base('moon','companion',6,0,{radius:.16,captureRadius:2.8}),base('fire','ember',6,0,{radius:1,gravity:0,lethal:true,motion:'fixed'})];
  const state = createEntityRuntime(entities);
  const result = stepEntityRuntime(state,entities,{x:3,y:0},body(6,0),1,1/120);
  assert.equal(result.died,true);
  assert.deepEqual(result.companions,['moon']); // Caller discards pending captures on death.
  assert.equal(state.items.moon.used,false);
});

test('two companion sweeps collect each authored light once and ignore all other entities', () => {
  const entities = [
    base('light','lightPickup',2,0,{amount:.27,reusable:false,cooldown:0}),
    base('dark','dimmer',2,0,{amount:.3,reusable:false,cooldown:0}),
    base('gate','soundGate',2,0,{slot:0}),
    base('other-moon','companion',2,0,{captureRadius:1.5}),
  ];
  const state = createEntityRuntime(entities);
  const sweeps = [{ from: { x: 0, y: 0 }, to: { x: 4, y: 0 }, radius: .16 },
    { from: { x: 4, y: 0 }, to: { x: 0, y: 0 }, radius: .16 }];
  assert.deepEqual(collectCompanionLight(state, entities, sweeps, 1), { energyDelta: .27, collected: 1 });
  assert.deepEqual(collectCompanionLight(state, entities, sweeps, 2), { energyDelta: 0, collected: 0 });
  assert.equal(state.items.dark.used, false);
  assert.equal(state.items.gate.used, false);
  assert.equal(state.items['other-moon'].used, false);
});

test('authored reusable light needs the entire hero and moon group to leave before another collection', () => {
  const entities = [base('light','lightPickup',0,0,{amount:.2,reusable:true,cooldown:1})];
  const state = createEntityRuntime(entities);
  const moon = (from, to) => [{ from: { x: from, y: 0 }, to: { x: to, y: 0 }, radius: .16 }];
  const hero = body(4, 0);
  assert.deepEqual(collectCompanionLight(state, entities, moon(-3, 0), 0), { energyDelta: .2, collected: 1 });
  assert.equal(stepEntityRuntime(state, entities, { x: 4, y: 0 }, body(0, 0), 2, 1/120).energyDelta, 0);
  assert.deepEqual(collectCompanionLight(state, entities, moon(0, 0), 2), { energyDelta: 0, collected: 0 });
  stepEntityRuntime(state, entities, { x: 4, y: 0 }, hero, 2.1, 1/120);
  collectCompanionLight(state, entities, moon(0, 3), 2.1);
  assert.equal(stepEntityRuntime(state, entities, { x: 3, y: 0 }, body(0, 0), 2.2, 1/120).energyDelta, .2);
  assert.deepEqual(collectCompanionLight(state, entities, moon(3, 0), 2.2), { energyDelta: 0, collected: 0 });
});

test('a held hero does not stop a companion from collecting nearby authored light', () => {
  const entities = [base('hold','stillness',10,0,{captureTime:3}), base('light','lightPickup',0,0,{amount:.25,reusable:false,cooldown:0})];
  const state = createEntityRuntime(entities), hero = body(10,0);
  stepEntityRuntime(state,entities,{x:9,y:0},hero,0,1/120);
  assert.ok(state.held);
  stepEntityRuntime(state,entities,{x:10,y:0},hero,1,1/120);
  assert.deepEqual(collectCompanionLight(state,entities,[{from:{x:-2,y:0},to:{x:1,y:0},radius:.16}],1),{energyDelta:.25,collected:1});
});

test('manual stillness holds beyond captureTime while orbit moves, then explicit release restores velocity', () => {
  const entities = [base('wait','stillness',0,0,{captureTime:.5,manualRelease:true}),
    base('orb','ember',10,0,{radius:.3,gravity:0,lethal:false,motion:'orbit',speed:2,orbitRadius:2,phase:0})];
  const runtime = createEntityRuntime(entities), hero = body(0, 0, 3, 1);
  stepEntityRuntime(runtime, entities, { x: -2, y: 0 }, hero, 0, 1 / 120);
  assert.equal(runtime.held.manualRelease, true);
  assert.equal(holdsCampaignLight(runtime), true);
  const orbitStart = { ...runtime.items.orb };
  hero.position.x = 4; hero.velocity.x = 10;
  stepEntityRuntime(runtime, entities, { x: 0, y: 0 }, hero, 3, 1 / 120);
  assert.deepEqual([hero.position.x, hero.position.y, hero.velocity.x, hero.velocity.y], [0, 0, 0, 0]);
  assert.notEqual(runtime.items.orb.y, orbitStart.y);
  assert.equal(releaseEntityHold(runtime, hero, 3), true);
  assert.equal(holdsCampaignLight(runtime), false);
  assert.deepEqual([hero.velocity.x, hero.velocity.y], [3, 1]);
  assert.equal(runtime.items.wait.until, 3.8);
  const legacy = [base('old','stillness',0,0,{captureTime:.5})], legacyRuntime = createEntityRuntime(legacy), other = body(0,0,2,0);
  stepEntityRuntime(legacyRuntime, legacy, { x:-2,y:0 }, other, 0, 1/120);
  stepEntityRuntime(legacyRuntime, legacy, { x:0,y:0 }, other, 1, 1/120);
  assert.equal(legacyRuntime.held, null);
  assert.equal(other.velocity.x, 2);
  const eclipse = createEntityRuntime([base('shade','eclipse',0,0,{captureTime:1,fadeTime:1,manualRelease:true})]);
  stepEntityRuntime(eclipse, [base('shade','eclipse',0,0,{captureTime:1,fadeTime:1,manualRelease:true})], { x:-2,y:0 }, body(0,0), 0, 1/120);
  assert.equal(holdsCampaignLight(eclipse), true);
});

test('eclipse stays held and fully dark while orbital danger continues moving and stays lethal', () => {
  const shade = base('shade','eclipse',0,0,{captureTime:.3,fadeTime:1,manualRelease:true});
  const orbit = base('orb','ember',4,0,{motion:'orbit',orbitRadius:1,speed:1,phase:0,radius:.2,lethal:true,gravity:0});
  const entities = [shade, orbit], runtime = createEntityRuntime(entities), hero = body(0,0,3,0);
  stepEntityRuntime(runtime, entities, {x:-2,y:0}, hero, 0, 1/120);
  const start = { ...runtime.items.orb };
  stepEntityRuntime(runtime, entities, {x:0,y:0}, hero, 2, 1);
  assert.ok(runtime.held);
  assert.equal(runtime.eclipseMultiplier,0);
  assert.notEqual(runtime.items.orb.y,start.y);
  assert.equal(releaseEntityHold(runtime,hero,2),true);
  assert.equal(runtime.eclipseMultiplier,0);
  stepEntityRuntime(runtime, entities, {x:0,y:0}, hero, 2.5, .5);
  assert.equal(runtime.eclipseMultiplier,.5);
  assert.equal(hero.velocity.x,3);
  const danger = base('close','ember',0,0,{motion:'fixed',radius:.2,lethal:true,gravity:0});
  const trapped = createEntityRuntime([shade,danger]), target=body(0,0,3,0);
  stepEntityRuntime(trapped,[shade],{x:-2,y:0},target,0,1/120);
  assert.equal(stepEntityRuntime(trapped,[shade,danger],{x:0,y:0},target,1,1/120).died,true);
});

test('directed manual and timed holds keep arrival speed and preserve legacy and zero-speed behavior', () => {
  for (const [direction, expected] of [[0, [5, 0]], [90, [0, 5]], [180, [-5, 0]], [270, [0, -5]]]) {
    const node = base('node','stillness',0,0,{captureTime:.5,manualRelease:true,releaseDirection:direction});
    const runtime = createEntityRuntime([node]), hero = body(0,0,3,4);
    stepEntityRuntime(runtime,[node],{x:-2,y:0},hero,0,1/120);
    assert.equal(runtime.held.releaseDirection, direction);
    assert.equal(releaseEntityHold(runtime,hero,2),true);
    assert.ok(Math.abs(hero.velocity.x-expected[0])<1e-12);
    assert.ok(Math.abs(hero.velocity.y-expected[1])<1e-12);
    assert.equal(Math.hypot(hero.velocity.x,hero.velocity.y),5);
  }
  const timed = base('timed','eclipse',0,0,{captureTime:.5,fadeTime:1,releaseDirection:270});
  const timedRuntime = createEntityRuntime([timed]), timedHero = body(0,0,3,4);
  stepEntityRuntime(timedRuntime,[timed],{x:-2,y:0},timedHero,0,1/120);
  stepEntityRuntime(timedRuntime,[timed],{x:0,y:0},timedHero,1,1/120);
  assert.equal(timedRuntime.held,null);
  assert.ok(Math.abs(timedHero.velocity.x)<1e-12);
  assert.equal(timedHero.velocity.y,-5);
  const legacy = base('legacy','stillness',0,0,{captureTime:1});
  const legacyRuntime = createEntityRuntime([legacy]), legacyHero = body(0,0,3,4);
  stepEntityRuntime(legacyRuntime,[legacy],{x:-2,y:0},legacyHero,0,1/120);
  releaseEntityHold(legacyRuntime,legacyHero,1);
  assert.deepEqual([legacyHero.velocity.x,legacyHero.velocity.y],[3,4]);
  const stopped = base('stopped','stillness',0,0,{captureTime:1,releaseDirection:270});
  const stoppedRuntime = createEntityRuntime([stopped]), stoppedHero = body(0,0,0,0);
  stepEntityRuntime(stoppedRuntime,[stopped],{x:-2,y:0},stoppedHero,0,1/120);
  releaseEntityHold(stoppedRuntime,stoppedHero,1);
  assert.equal(Math.hypot(stoppedHero.velocity.x,stoppedHero.velocity.y),0);
});
