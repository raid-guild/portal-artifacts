import test from 'node:test';
import assert from 'node:assert/strict';
import { createMoonHeat, moonEmberContact, stepMoonHeat, sweptCircleFraction, MOON_BURN_SECONDS } from './moon-heat.js';
import { getCampaignLevel } from './campaign.js';

const dt = 1 / 120;
const giant = { id: 'giant', type: 'ember', motion: 'fixed', lethal: true, burnsCompanions: true, x: 0, y: 0, radius: 4 };
function advance(state, contact, seconds) {
  let next = state, burned = false, ignitions = 0;
  for (let i = 0; i < Math.round(seconds / dt); i++) {
    const result = stepMoonHeat(next, contact, dt);
    next = result.state; burned ||= result.burned; ignitions += Number(result.ignited);
  }
  return { state: next, burned, ignitions };
}

test('a brief graze smolders, suppresses gathering, and fully cools in two seconds', () => {
  assert.equal(MOON_BURN_SECONDS, 1);
  const hot = advance(createMoonHeat(), 1, .4);
  assert.equal(hot.burned, false);
  assert.equal(hot.state.smoldering, true);
  assert.equal(hot.ignitions, 1);
  const cool = advance(hot.state, 0, 2);
  assert.equal(cool.state.heat, 0);
  assert.equal(cool.state.smoldering, false);
  assert.equal(cool.state.burned, false);
});

test('sustained and repeated contact burns only the exposed companion', () => {
  let first = advance(createMoonHeat(), 1, .8).state;
  first = advance(first, 0, .2).state;
  const final = advance(first, 1, .9);
  assert.equal(final.burned, true);
  assert.equal(final.state.burned, true);
  assert.equal(stepMoonHeat(final.state, 0, dt).state.burned, true);
  const other = advance(createMoonHeat(), 0, 3);
  assert.equal(other.state.burned, false);
});

test('swept contact counts fast crossings and avoids tangential misses', () => {
  const through = sweptCircleFraction({ x: -10, y: 0 }, { x: 10, y: 0 }, giant, 4.16);
  assert.ok(through > .4 && through < .42);
  assert.equal(sweptCircleFraction({ x: -10, y: 4.17 }, { x: 10, y: 4.17 }, giant, 4.16), 0);
  assert.equal(sweptCircleFraction({ x: -10, y: 4.16 }, { x: 10, y: 4.16 }, giant, 4.16), 0);
  assert.equal(sweptCircleFraction({ x: 0, y: 0 }, { x: 0, y: 0 }, giant, 4.16), 1);
});

test('overlapping eligible embers count one physical contact interval', () => {
  const second = { ...giant, id: 'second', x: 2 };
  const fraction = moonEmberContact({ x: -10, y: 0 }, { x: 10, y: 0 }, .16, [giant, second]);
  assert.ok(fraction > .5 && fraction < .53, `union fraction ${fraction}`);
});

test('only the campaign 2 giant burns moons; small and moving embers do not', () => {
  const level = getCampaignLevel(2);
  assert.equal(level.entities.filter(e => e.burnsCompanions).length, 1);
  assert.equal(level.entities.find(e => e.id === 'giant').burnsCompanions, true);
  const path = [{ x: -10, y: 0 }, { x: 10, y: 0 }, .16];
  assert.ok(moonEmberContact(path[0], path[1], path[2], [giant]) > 0);
  for (const override of [{ burnsCompanions: false }, { motion: 'orbit' }, { motion: 'chaser' }, { lethal: false }]) {
    assert.equal(moonEmberContact(path[0], path[1], path[2], [{ ...giant, ...override }]), 0);
  }
});
