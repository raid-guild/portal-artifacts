import { BLOB_RADIUS } from './level.js';
import { SOFTENING } from './physics.js';
import { segmentDistance } from './studies.js';
import { orbitPosition } from './orbit.js';

const radians = degrees => degrees * Math.PI / 180;
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

export function createEntityRuntime(entities) {
  return { items: Object.fromEntries(entities.map(entity => {
    const initial = entity.type === 'ember' && entity.motion === 'orbit' ? orbitPosition(entity, 0) : entity;
    return [entity.id, { x: initial.x, y: initial.y, vx: 0, vy: 0, used: false, until: -1, inside: false }];
  })), held: null, teleportUntil: -1, eclipseMultiplier: 1 };
}
export function releaseEntityHold(runtime, body, time) {
  if (!runtime?.held) return false;
  const held = runtime.held;
  body.velocity.x = held.vx; body.velocity.y = held.vy;
  runtime.items[held.id].until = time + .8;
  runtime.held = null; runtime.eclipseMultiplier = 1;
  return true;
}
export function entityAcceleration(position, entities, runtime) {
  let x = 0, y = 0;
  for (const entity of entities) if (entity.type === 'ember' && entity.gravity > 0) {
    const item = runtime.items[entity.id];
    const dx = item.x - position.x, dy = item.y - position.y;
    const squared = dx * dx + dy * dy + SOFTENING * SOFTENING;
    const pull = entity.gravity / (squared * Math.sqrt(squared));
    x += dx * pull; y += dy * pull;
  }
  return { x, y };
}

// Fixed-step state. The caller applies energyDelta before resource expiry and splits the trail on teleport.
export function stepEntityRuntime(runtime, entities, before, body, time, dt, bounds = null) {
  const result = { died: false, teleported: false, energyDelta: 0, tones: [] };
  let captured = false;
  if (runtime.held) {
    const held = runtime.held;
    if (time < held.until) {
      body.position.x = held.x; body.position.y = held.y;
      body.velocity.x = 0; body.velocity.y = 0;
      runtime.eclipseMultiplier = held.eclipse ? Math.max(.025, 1 - (time - held.started) / held.fadeTime) : 1;
      captured = true;
    } else {
      releaseEntityHold(runtime, body, time);
    }
  }
  for (const entity of entities) {
    const item = runtime.items[entity.id];
    if (!item || entity.type === 'soundGate') continue;
    const prior = { x: item.x, y: item.y };
    if (entity.type === 'ember') {
      if (entity.motion === 'orbit') Object.assign(item, orbitPosition(entity, time));
      if (entity.motion === 'chaser') {
        const dx = body.position.x - item.x, dy = body.position.y - item.y, len = Math.hypot(dx, dy) || 1;
        item.vx = (item.vx + dx / len * dt * 2) * .995;
        item.vy = (item.vy + dy / len * dt * 2) * .995;
        const velocity = Math.hypot(item.vx, item.vy);
        if (velocity > entity.speed) { item.vx *= entity.speed / velocity; item.vy *= entity.speed / velocity; }
        item.x += item.vx * dt; item.y += item.vy * dt;
        if (bounds) {
          item.x = Math.max(bounds.minX + entity.radius, Math.min(bounds.maxX - entity.radius, item.x));
          item.y = Math.max(bounds.minY + entity.radius, Math.min(bounds.maxY - entity.radius, item.y));
        }
      }
      if (entity.lethal) {
        const relativeFrom = { x: before.x - prior.x, y: before.y - prior.y };
        const relativeTo = { x: body.position.x - item.x, y: body.position.y - item.y };
        if (segmentDistance(relativeFrom, relativeTo, { x: 0, y: 0 }) <= entity.radius + BLOB_RADIUS) { result.died = true; return result; }
      }
      continue;
    }
    if (captured) continue;
    const hit = segmentDistance(before, body.position, item) <= entity.radius + BLOB_RADIUS;
    const insideNow = distance(body.position, item) <= entity.radius + BLOB_RADIUS;
    const entering = hit && !item.inside;
    item.inside = insideNow;
    if (!entering || item.used || time < item.until) continue;
    if (entity.type === 'impulse') {
      body.velocity.x = Math.cos(radians(entity.direction)) * entity.speed;
      body.velocity.y = Math.sin(radians(entity.direction)) * entity.speed;
      item.until = time + .5; result.tones.push('impulse');
    } else if (entity.type === 'stillness' || entity.type === 'eclipse') {
      runtime.held = { id: entity.id, x: entity.x, y: entity.y, vx: body.velocity.x, vy: body.velocity.y, started: time, until: time + entity.captureTime, eclipse: entity.type === 'eclipse', fadeTime: entity.fadeTime || 1 };
      body.position.x = entity.x; body.position.y = entity.y;
      body.velocity.x = 0; body.velocity.y = 0;
      result.tones.push('capture'); return result;
    } else if (entity.type === 'lightPickup' || entity.type === 'dimmer') {
      result.energyDelta += (entity.type === 'lightPickup' ? 1 : -1) * entity.amount;
      if (!entity.reusable) item.used = true;
      item.until = time + entity.cooldown; result.tones.push(entity.type);
    } else if (entity.type === 'portal' && time >= runtime.teleportUntil) {
      const target = entities.find(other => other.type === 'portal' && other.pairId === entity.pairId && other.id !== entity.id);
      if (!target) continue;
      const angle = radians(target.exitDirection), speed = Math.hypot(body.velocity.x, body.velocity.y);
      body.position.x = target.x + Math.cos(angle) * (target.radius + BLOB_RADIUS + .2);
      body.position.y = target.y + Math.sin(angle) * (target.radius + BLOB_RADIUS + .2);
      body.velocity.x = Math.cos(angle) * speed; body.velocity.y = Math.sin(angle) * speed;
      runtime.teleportUntil = time + .8;
      runtime.items[target.id].inside = true;
      result.teleported = true; result.tones.push('portal'); return result;
    }
  }
  return result;
}
