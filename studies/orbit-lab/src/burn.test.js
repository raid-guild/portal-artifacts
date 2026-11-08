import test from 'node:test';
import assert from 'node:assert/strict';
import { burnStep, BURN_ACCELERATION, BURN_LIGHT_RATE } from './burn.js';
import { createBurnInput } from './burn-input.js';
import { createCampaign, stepCampaign } from './campaign.js';
import { createEncounterVitality, stepEncounterVitality } from './encounter-vitality.js';
import { createBurnout, stepBurnout } from './burnout.js';

test('Burn accelerates only along motion and costs exactly once at each time step', () => {
  const dt = 1 / 120, burn = burnStep({ vx: 3, vy: 4, dt, availableEnergy: .6 });
  assert.equal(burn.active, true);
  assert.ok(Math.abs(burn.ax - BURN_ACCELERATION * .6) < 1e-9);
  assert.ok(Math.abs(burn.ay - BURN_ACCELERATION * .8) < 1e-9);
  assert.ok(Math.abs(burn.cost - BURN_LIGHT_RATE * dt) < 1e-9);
  const campaign = { ...createCampaign(), energy: .6, pickups: [], nextSpawnAt: 100 };
  const stepped = stepCampaign(campaign, { before: {x:0,y:0}, hero: {x:0,y:0}, dt, time:0, extraEnergy: -burn.cost });
  assert.ok(Math.abs(stepped.state.energy - (.6 - .018 * dt - burn.cost)) < 1e-9);
});

test('Burn cannot launch at rest, spend at cap, or reverse direction', () => {
  for (const [vx, vy] of [[0,0],[10,0],[12,0]]) assert.deepEqual(burnStep({vx,vy,dt:.25,availableEnergy:1}), {ax:0,ay:0,cost:0,active:false});
  const west = burnStep({vx:-4,vy:0,dt:.1,availableEnergy:1});
  assert.ok(west.ax < 0); assert.equal(west.ay, 0);
});

test('Burn caps speed and spends only available partial light', () => {
  const cap = burnStep({vx:9.8,vy:0,dt:.2,availableEnergy:1});
  assert.ok(Math.abs(cap.ax * .2 - .2) < 1e-9);
  assert.ok(Math.abs(cap.cost - .0025) < 1e-9);
  const partial = burnStep({vx:3,vy:0,dt:1,availableEnergy:.01});
  assert.ok(Math.abs(partial.ax - .8) < 1e-9);
  assert.ok(Math.abs(partial.cost - .01) < 1e-9);
  assert.equal(burnStep({vx:3,vy:0,dt:1,availableEnergy:0}).active,false);
});

test('Shift keys and Burn thumb are independent, and invalid presses need release', () => {
  const input = createBurnInput();
  assert.equal(input.press('ShiftLeft', null), null);
  assert.equal(input.press('ShiftLeft', 'burn'), null);
  assert.equal(input.active, false);
  input.release('ShiftLeft');
  assert.equal(input.press('ShiftLeft', 'burn'), 'burn');
  assert.equal(input.press('ShiftRight', 'burn'), 'burn');
  assert.equal(input.press('burnPointer', 'burn'), 'burn');
  input.release('ShiftLeft'); assert.equal(input.active, true);
  input.release('burnPointer'); assert.equal(input.active, true);
  input.release('ShiftRight'); assert.equal(input.active, false);
  input.press('burnPointer', 'burn'); input.clear(); assert.equal(input.active, false);
});

test('encounter Burn is a separate hero light cost, not ram or mine damage', () => {
  const level={bounds:{minX:-20,maxX:20,minY:-12,maxY:12},walls:[],dangers:[],goal:{x:18,y:0}};
  const base=createEncounterVitality(); base.pickups=[]; base.nextSpawnAt=100;
  const at={x:0,y:0};
  const args={heroBefore:at,hero:at,bossBefore:{x:10,y:0},boss:{x:10,y:0},dt:.1,time:.1,level,heroBurnCost:.005};
  const result=stepEncounterVitality(base,args);
  assert.ok(Math.abs(result.state.hero.energy - (base.hero.energy - .001 - .005)) < 1e-9);
  assert.ok(Math.abs(result.state.boss.energy - (base.boss.energy - .001)) < 1e-9);
});

test('burnout study retains its light floor after Burn', () => {
  const state={...createBurnout(),energy:.061,nextSpawnAt:100};
  const level={bounds:{minX:-20,maxX:20,minY:-12,maxY:12},walls:[],dangers:[]};
  const result=stepBurnout(state,{before:{x:0,y:0},hero:{x:0,y:0},level,dt:.1,time:0,extraEnergy:-.005});
  assert.equal(result.state.energy,.06);
});
