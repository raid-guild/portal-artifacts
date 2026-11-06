import test from 'node:test';
import assert from 'node:assert/strict';
import * as CANNON from 'cannon-es';
import { getCampaignLevel } from './campaign.js';
import { createEntityRuntime, stepEntityRuntime } from './entity-runtime.js';
import { BLOB_RADIUS, SPEED_CAP, capVelocity, sweptGoal } from './level.js';
import { STEP } from './physics.js';
import { createPhraseState, stepPhrase, phrasePulsePoint, PHRASE_GATES, phraseForLevel } from './phrase.js';

function fly(start, velocity, limitSeconds = 40, levelId = 1) {
  const demo = getCampaignLevel(levelId), runtime = createEntityRuntime(demo.entities), phraseDefinition = phraseForLevel(levelId);
  const world = new CANNON.World({ gravity: new CANNON.Vec3(0, 0, 0), allowSleep: false });
  const blobMaterial = new CANNON.Material('blob'), wallMaterial = new CANNON.Material('wall');
  world.addContactMaterial(new CANNON.ContactMaterial(blobMaterial, wallMaterial, { friction: 0, restitution: .1 }));
  const body = new CANNON.Body({ mass: 1, shape: new CANNON.Sphere(BLOB_RADIUS), material: blobMaterial, linearDamping: 0, angularDamping: 0, fixedRotation: true });
  body.position.set(start.x, start.y, 0); body.velocity.set(velocity.x, velocity.y, 0); world.addBody(body);
  for (const rect of demo.level.walls) {
    const wall = new CANNON.Body({ mass: 0, material: wallMaterial, shape: new CANNON.Box(new CANNON.Vec3(rect.w / 2, rect.h / 2, .7)) });
    wall.position.set(rect.x, rect.y, 0);
    if (rect.angle) wall.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), rect.angle);
    world.addBody(wall);
  }
  let phrase = createPhraseState(), goal = false, ticks = 0, teleports = 0;
  for (; ticks < limitSeconds / STEP; ticks++) {
    const before = { x: body.position.x, y: body.position.y };
    world.step(STEP);
    body.position.z = 0; body.velocity.z = 0;
    capVelocity(body.velocity, Math.max(SPEED_CAP, ...demo.entities.filter(entity => entity.type === 'impulse').map(entity => entity.speed)));
    const physicalEnd = { x: body.position.x, y: body.position.y };
    const result = stepEntityRuntime(runtime, demo.entities, before, body, ticks * STEP, STEP, demo.level.bounds, { walls: demo.level.walls });
    assert.equal(result.died, false);
    if (result.teleported) teleports++;
    phrase = stepPhrase(phrase, before, result.teleported ? physicalEnd : body.position, result.teleported ? body.position : null, phraseDefinition).state;
    if (sweptGoal(before, body.position, demo.level.goal) !== null) goal = true;
    if (phrase.complete || goal) break;
  }
  return { phrase, goal, seconds: ticks * STEP, teleports, end: { x: body.position.x, y: body.position.y } };
}

test('the authored channel carries a dot through all eight phrase notes with real Cannon walls and impulses', () => {
  const result = fly({ x: -13, y: 22 }, { x: 4, y: 0 }, 20);
  assert.equal(result.phrase.next, PHRASE_GATES.length, JSON.stringify({ seconds: result.seconds, end: result.end, next: result.phrase.next }));
  assert.equal(result.phrase.complete, true);
  assert.ok(result.seconds < 12);
});

test('the original straight release still crosses to the portal without entering the hidden passage', () => {
  const result = fly({ x: 0, y: 0 }, { x: 1.8, y: 0 }, 40);
  assert.equal(result.goal, true, JSON.stringify(result));
  assert.equal(result.phrase.next, 0);
});

for (const [levelId, start, velocity] of [
  [4, { x: 29, y: 19 }, { x: 4, y: 0 }],
  [7, { x: 29, y: -19 }, { x: 4, y: 0 }],
  [11, { x: 45, y: -6 }, { x: 4, y: 0 }],
  [14, { x: -12, y: 19 }, { x: 4, y: 0 }],
]) test(`Level ${levelId} optional entrance performs eight notes through actual geometry`, () => {
  const result = fly(start, velocity, 16, levelId);
  assert.equal(result.phrase.next, 8, JSON.stringify(result));
  assert.ok(result.seconds < 12);
  if (levelId === 11) {
    assert.equal(result.teleports, 1);
    assert.ok(result.phrase.breakIndices.length > 0);
    for (let i = 1; i < result.phrase.path.length; i++) {
      const a = result.phrase.path[i - 1], b = result.phrase.path[i];
      if (Math.hypot(a.x - b.x, a.y - b.y) > 5) assert.ok(result.phrase.breakIndices.includes(i), 'teleport chord must have an explicit break');
    }
    for (let t = 0; t <= 4; t += .01) {
      const point = phrasePulsePoint(result.phrase, t);
      assert.ok(point.y < -31 || point.y > -12, JSON.stringify({ t, point }));
    }
  }
});
