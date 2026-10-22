import test from 'node:test';
import assert from 'node:assert/strict';
import * as CANNON from 'cannon-es';
import { campaignPointAllowed, getCampaignLevel, createCampaign, stepCampaign } from './campaign.js';
import {createEntityRuntime,entityAcceleration,releaseEntityHold,stepEntityRuntime,holdsCampaignLight} from './entity-runtime.js';
import {BLOB_RADIUS,SPEED_CAP,mazeAcceleration,capVelocity,sweptGoal} from './level.js';
import {STEP} from './physics.js';
import {createSoundGates,stepSoundGates} from './sound-gates.js';

test('Chapter Four keeps three optional gates, paired returns, and sealed routes', () => {
  for (const id of [10, 11, 12]) {
    const demo = getCampaignLevel(id);
    const portals = demo.entities.filter(entity => entity.type === 'portal');
    const pairs = new Map();
    for (const portal of portals) pairs.set(portal.pairId, (pairs.get(portal.pairId) || 0) + 1);
    assert.equal(pairs.size, id === 11 ? 4 : id === 12 ? 3 : 2);
    assert.ok([...pairs.values()].every(count => count === 2));
    assert.deepEqual(demo.soundGates.map(gate => gate.id), [0, 1, 2]);
    assert.equal(demo.settings.randomRecharge, false);
    assert.equal(createCampaign(428, demo.settings).pickups.length, 0);
    assert.ok(demo.entities.filter(entity => entity.type === 'lightPickup').length >= 3);
  }
  const final = getCampaignLevel(12);
  assert.equal(final.level.walls.filter(wall => wall.id.startsWith('divide-')).length, 3);
  assert.equal(final.level.walls.filter(wall => wall.id.includes('-door-')).length, 6);
  assert.ok(final.entities.filter(entity => entity.type === 'ember' && entity.motion === 'orbit').length >= 5);
});
function fly(id, waits = {}, steer = { x: 123, y: -5, duration: 1.7 }) {
 const demo=getCampaignLevel(id), runtime=createEntityRuntime(demo.entities);
 const world=new CANNON.World({gravity:new CANNON.Vec3(0,0,0),allowSleep:false});
 const blobMaterial=new CANNON.Material('blob'),wallMaterial=new CANNON.Material('wall');
 world.addContactMaterial(new CANNON.ContactMaterial(blobMaterial,wallMaterial,{friction:0,restitution:.1}));
 const body=new CANNON.Body({mass:1,shape:new CANNON.Sphere(BLOB_RADIUS),material:blobMaterial,linearDamping:0,angularDamping:0,fixedRotation:true});
 body.position.set(demo.level.spawn.x,demo.level.spawn.y,0); body.velocity.set(demo.level.spawn.vx,demo.level.spawn.vy,0); world.addBody(body);
 for(const rect of demo.level.walls){const wall=new CANNON.Body({mass:0,material:wallMaterial,shape:new CANNON.Box(new CANNON.Vec3(rect.w/2,rect.h/2,.7))});wall.position.set(rect.x,rect.y,0);world.addBody(wall)}
 let campaign=createCampaign(428,demo.settings), sound=createSoundGates(), released=new Set(), portals=[], captures=[], capturedAt={}, outcome='timeout', t=0, activeWell = null, wellPlacedAt = -1; 
 for(let tick=0;tick<65/STEP;tick++){
  t=tick*STEP;
  if(runtime.held && !released.has(runtime.held.id) && t-(capturedAt[runtime.held.id]??t)>=(waits[runtime.held.id]??0)){
    if (id === 12 && runtime.held.id === 'third-wait' && steer) {
      assert.ok(campaignPointAllowed(steer, demo.level));
      activeWell = { id: 1, x: steer.x, y: steer.y, strength: demo.settings.wellStrength, lifetime: demo.settings.wellLifetime, createdAt: t };
      wellPlacedAt = t;
    }
    released.add(runtime.held.id);releaseEntityHold(runtime,body,t)
  }
  if (activeWell && t - wellPlacedAt >= steer.duration) activeWell = null;
  const before={x:body.position.x,y:body.position.y}; const a=mazeAcceleration(body.position,activeWell ? [activeWell] : [],t,'fade',demo.level), extra=entityAcceleration(body.position,demo.entities,runtime);body.applyForce(new CANNON.Vec3(a.x+extra.x,a.y+extra.y,0));world.step(STEP);body.position.z=0;body.velocity.z=0;capVelocity(body.velocity,Math.max(SPEED_CAP,...demo.entities.filter(x=>x.type==='impulse').map(x=>x.speed)));
  const physicalEnd={x:body.position.x,y:body.position.y};const result=stepEntityRuntime(runtime,demo.entities,before,body,t,STEP,demo.level.bounds);
  if(result.died){outcome='ember:'+result.fatalEmber.id;break}
  if(runtime.held&&!captures.includes(runtime.held.id)){captures.push(runtime.held.id);capturedAt[runtime.held.id]=t;}
  if(result.teleported)portals.push([t.toFixed(1),body.position.x.toFixed(1),body.position.y.toFixed(1)]);
  sound=stepSoundGates(sound,demo.soundGates,before,result.teleported?physicalEnd:body.position,t,result.teleported?body.position:null).state;
  const campBefore=result.teleported?{x:body.position.x,y:body.position.y}:before;
  campaign=stepCampaign(campaign,{before:campBefore,hero:body.position,dt:STEP,time:t,level:demo.level,config:demo.settings,extraEnergy:result.energyDelta,lightPaused:holdsCampaignLight(runtime)}).state;
  if(campaign.failed){outcome='darkness';break}
  if(sweptGoal(campBefore,body.position,demo.level.goal)!==null){outcome='goal';break}
 }
 return { id, outcome, time: t, portals, captures, energy: campaign.energy, gates: sound.mask, endPosition: [body.position.x, body.position.y] };
}

test('Chapter Four is traversable with real contacts, portals, releases, and authored light', () => {
  for (const [id, waits, portalCount] of [[10, {}, 2], [11, {}, 2], [12, { 'first-wait': 1, 'second-wait': 1.5 }, 3]]) {
    const result = fly(id, waits);
    assert.equal(result.outcome, 'goal', `level ${id}: ${JSON.stringify(result)}`);
    assert.equal(result.portals.length, portalCount);
    assert.ok(result.energy > 0);
    assert.equal(result.gates, 0, 'the required route leaves all three gates optional');
  }
});

test('the final crossing asks for orbital timing rather than a constant safe launch', () => {
  assert.match(fly(12, { 'first-wait': 0 }).outcome, /^ember:/);
  assert.match(fly(12, { 'first-wait': 1, 'second-wait': 0 }).outcome, /^ember:/);
  for (const [firstWait, secondWait] of [[.9, 1.6], [1, 1.5], [1, 1.6], [1.1, 1.4], [1.1, 1.5]]) {
    const result = fly(12, { 'first-wait': firstWait, 'second-wait': secondWait });
    assert.equal(result.outcome, 'goal', `safe timing ${firstWait}/${secondWait}: ${JSON.stringify(result)}`);
  }
  assert.notEqual(fly(12, { 'first-wait': 1, 'second-wait': 1.5 }, null).outcome, 'goal',
    'the final offset door requires a placed well');
});

function flyRewardSpoke(start, velocity) {
  const demo = getCampaignLevel(11), runtime = createEntityRuntime(demo.entities);
  const world = new CANNON.World({ gravity: new CANNON.Vec3(0, 0, 0), allowSleep: false });
  const blobMaterial = new CANNON.Material('blob'), wallMaterial = new CANNON.Material('wall');
  world.addContactMaterial(new CANNON.ContactMaterial(blobMaterial, wallMaterial, { friction: 0, restitution: .1 }));
  const body = new CANNON.Body({ mass: 1, shape: new CANNON.Sphere(BLOB_RADIUS), material: blobMaterial, linearDamping: 0, angularDamping: 0, fixedRotation: true });
  body.position.set(start.x, start.y, 0); body.velocity.set(velocity.x, velocity.y, 0); world.addBody(body);
  for (const rect of demo.level.walls) {
    const wall = new CANNON.Body({ mass: 0, material: wallMaterial, shape: new CANNON.Box(new CANNON.Vec3(rect.w / 2, rect.h / 2, .7)) });
    wall.position.set(rect.x, rect.y, 0); world.addBody(wall);
  }
  const visited = [], acquired = new Set(), companions = new Set();
  let sound = createSoundGates();
  for (let tick = 0; tick < 30 / STEP; tick++) {
    const time = tick * STEP, before = { x: body.position.x, y: body.position.y };
    const force = mazeAcceleration(body.position, [], time, 'fade', demo.level), pull = entityAcceleration(body.position, demo.entities, runtime);
    body.applyForce(new CANNON.Vec3(force.x + pull.x, force.y + pull.y, 0)); world.step(STEP);
    body.position.z = 0; body.velocity.z = 0; capVelocity(body.velocity, SPEED_CAP);
    const physicalEnd = { x: body.position.x, y: body.position.y };
    const result = stepEntityRuntime(runtime, demo.entities, before, body, time, STEP, demo.level.bounds);
    if (result.died) return { visited, acquired, companions, died: result.fatalEmber.id };
    for (const id of result.companions) companions.add(id);
    if (result.teleported) visited.push({ x: body.position.x, y: body.position.y });
    const gateStep = stepSoundGates(sound, demo.soundGates, before,
      result.teleported ? physicalEnd : body.position, time, result.teleported ? body.position : null);
    sound = gateStep.state;
    for (const id of gateStep.acquired) acquired.add(id);
    if (visited.length === 2) break;
  }
  return { visited, acquired, companions, died: null };
}

test('both hub spokes carry a physical trip to a reward and back', () => {
  const lower = flyRewardSpoke({ x: 48, y: -2 }, { x: 0, y: -4 });
  const upper = flyRewardSpoke({ x: 59, y: 14 }, { x: 0, y: 4 });
  for (const [result, slot] of [[lower, 0], [upper, 1]]) {
    assert.equal(result.died, null);
    assert.equal(result.visited.length, 2, JSON.stringify(result));
    assert.ok(result.acquired.has(slot), `spoke ${slot} misses its reward gate`);
    assert.equal(result.companions.size, 1, `spoke ${slot} misses its companion`);
  }
  assert.ok(lower.visited[0].y < -22 && lower.visited[1].y > -22);
  assert.ok(upper.visited[0].y > 25 && upper.visited[1].y < 25);
});
