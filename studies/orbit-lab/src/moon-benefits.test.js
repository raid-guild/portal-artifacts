import test from 'node:test';
import assert from 'node:assert/strict';
import { getCampaignLevel } from './campaign.js';
import { oldestOwnedMoon, safeHeroPoint, rescuePosition, rescueVelocity, RESCUE_SPEED } from './moon-benefits.js';

const demo = getCampaignLevel(2);
const ember = demo.entities.find(entity => entity.id === 'giant');
test('oldest living owned moon is spent even if hot; loose and burned moons are ineligible', () => {
  const entries = [{ id: 1 }, { id: 2, companionState: { owned: true }, heat: { heat: .8, burned: false } }, { id: 3, companionState: { owned: true }, heat: { burned: false } }];
  assert.equal(oldestOwnedMoon(entries).id, 2);
  entries[1].heat.burned = true;
  assert.equal(oldestOwnedMoon(entries).id, 3);
  assert.equal(oldestOwnedMoon(entries.slice(0, 1)), null);
});

test('recovery prefers prior safe point, then projects outside the ember and walls', () => {
  const input = { before: { x: 28, y: 0 }, lastSafe: { x: 20, y: 0 }, ember, level: demo.level, entities: demo.entities };
  assert.deepEqual(rescuePosition(input), input.lastSafe);
  const projected = rescuePosition({ ...input, lastSafe: null });
  assert.equal(safeHeroPoint(projected, demo.level, demo.entities), true);
  assert.ok(Math.hypot(projected.x - ember.x, projected.y - ember.y) > ember.radius + .31);
  const velocity = rescueVelocity(projected, ember);
  assert.ok(Math.hypot(velocity.x, velocity.y) > RESCUE_SPEED);
  assert.ok((projected.x - ember.x) * velocity.x + (projected.y - ember.y) * velocity.y > 0);
});
