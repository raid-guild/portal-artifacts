import { BLOB_RADIUS, circleHitsRect } from './level.js';
import { channelFrame, profileContains } from './guide.js';

export const RESCUE_SPEED = 6;
export const EMBER_IMMUNITY = 1.25;

export function oldestOwnedMoon(entries) {
  return entries.find(entry => entry.companionState?.owned && !entry.heat?.burned) || null;
}

export function safeHeroPoint(point, level, entities = [], runtime = null) {
  if (!point) return false;
  const margin = BLOB_RADIUS + .2;
  if (point.x < level.bounds.minX + margin || point.x > level.bounds.maxX - margin ||
      point.y < level.bounds.minY + margin || point.y > level.bounds.maxY - margin) return false;
  if (level.walls.some(wall => circleHitsRect(point, BLOB_RADIUS + .12, wall))) return false;
  if ((level.guides || []).some(profile => profileContains(point, profile, BLOB_RADIUS + .12))) return false;
  if (level.channel && Math.abs(channelFrame(point, level.channel).distance) > level.channel.halfWidth - BLOB_RADIUS - .12) return false;
  return !entities.some(entity => {
    if (entity.type !== 'ember' || !entity.lethal) return false;
    const position = runtime?.items?.[entity.id] || entity;
    return Math.hypot(point.x - position.x, point.y - position.y) <= entity.radius + BLOB_RADIUS + .3;
  });
}

export function rescuePosition({ before, lastSafe, ember, level, entities = [], runtime = null }) {
  const valid = point => safeHeroPoint(point, level, entities, runtime);
  if (valid(lastSafe)) return { x: lastSafe.x, y: lastSafe.y };
  if (valid(before)) return { x: before.x, y: before.y };
  const angle = Math.atan2((before?.y ?? 0) - ember.y, (before?.x ?? 0) - ember.x);
  const reach = ember.radius + BLOB_RADIUS + .6;
  for (let i = 0; i < 16; i++) {
    const offset = i === 0 ? 0 : Math.ceil(i / 2) * Math.PI / 8 * (i % 2 ? 1 : -1);
    const candidate = { x: ember.x + Math.cos(angle + offset) * reach, y: ember.y + Math.sin(angle + offset) * reach };
    if (valid(candidate)) return candidate;
  }
  return null;
}

export function rescueVelocity(position, ember) {
  const dx = position.x - ember.x, dy = position.y - ember.y;
  const distance = Math.hypot(dx, dy) || 1;
  const nx = dx / distance, ny = dy / distance;
  return { x: nx * RESCUE_SPEED - ny * .75, y: ny * RESCUE_SPEED + nx * .75 };
}
