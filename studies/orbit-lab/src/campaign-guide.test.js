import test from 'node:test';
import assert from 'node:assert/strict';
import { campaignGuideTarget, projectCampaignGuide } from './campaign-guide.js';
import { SOUND_GATE_COLORS } from './sound-gates.js';

const gates = [
  { id: 2, x: 30, y: 0, radius: .9 },
  { id: 0, x: 10, y: 0, radius: .9 },
  { id: 1, x: 20, y: 0, radius: .9 },
];
const exit = { x: 40, y: 0, radius: 1.5 };

test('guide follows the lowest unclaimed gate regardless of storage order or pickup order', () => {
  assert.deepEqual(campaignGuideTarget(gates, 0, exit), { kind: 'gate', id: 0, x: 10, y: 0, radius: .9, label: 'GATE 1', color: SOUND_GATE_COLORS[0] });
  assert.equal(campaignGuideTarget(gates, 0b010, exit).id, 0);
  assert.equal(campaignGuideTarget(gates, 0b001, exit).id, 1);
  assert.equal(campaignGuideTarget(gates, 0b011, exit).id, 2);
  assert.deepEqual(campaignGuideTarget(gates, 0b111, exit), { kind: 'exit', x: 40, y: 0, radius: 1.5, label: 'EXIT', color: '#bfa5ff' });
});

test('missing gates are skipped and invalid destinations never render', () => {
  assert.equal(campaignGuideTarget([{ id: 2, x: 5, y: 4 }], 0, exit).id, 2);
  assert.equal(campaignGuideTarget([{ id: 1, x: NaN, y: 4 }], 0, exit).kind, 'exit');
  assert.equal(campaignGuideTarget([], 0, null), null);
});

const camera = { x: 0, y: 0, left: -10, right: 10, top: 5, bottom: -5 };
test('projection hides any target whose disc intersects the viewport', () => {
  const viewport = { width: 800, height: 400 };
  assert.equal(projectCampaignGuide({ x: 0, y: 0, radius: 1 }, camera, viewport), null);
  assert.equal(projectCampaignGuide({ x: 10.5, y: 0, radius: 1 }, camera, viewport), null);
  assert.ok(projectCampaignGuide({ x: 14, y: 0, radius: 1 }, camera, viewport));
});

test('landscape and portrait projections stay inside safe edges and avoid HUD and thumb corners', () => {
  for (const viewport of [{ width: 800, height: 400 }, { width: 340, height: 650 }]) {
    const blocked = [
      { left: 0, right: viewport.width, top: 0, bottom: 85 },
      { left: 0, right: 145, top: viewport.height - 125, bottom: viewport.height },
      { left: viewport.width - 105, right: viewport.width, top: viewport.height - 110, bottom: viewport.height },
    ];
    for (const [x, y] of [[-30, 0], [30, 0], [0, 20], [0, -20], [-30, -20], [30, -20], [-30, 20], [30, 20]]) {
      const point = projectCampaignGuide({ x, y, radius: 0 }, camera, viewport,
        { left: 35, right: 35, top: 25, bottom: 35 }, blocked);
      assert.ok(point.x >= 35 && point.x <= viewport.width - 35);
      assert.ok(point.y >= 25 && point.y <= viewport.height - 35);
      assert.ok(blocked.every(rect => point.x < rect.left || point.x > rect.right || point.y < rect.top || point.y > rect.bottom), `${viewport.width}x${viewport.height}: ${x},${y} => ${point.x},${point.y}`);
      assert.ok(Number.isFinite(point.angle));
    }
  }
});
