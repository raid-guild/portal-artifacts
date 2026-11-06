import { BLOB_RADIUS, circleHitsRect } from './level.js';
import { stepChaser } from './chaser.js';

export const ENCOUNTER = Object.freeze({
  bossRadius: .85, speed: 2.1, acceleration: 2,
  ramCooldown: .65, rearmClearance: .6, escapeDuration: .6,
  firstDrop: 3, dropInterval: 2.5, dropBehind: 1.3, mineCost: .08, ramCost: .12,
  maxMinesPerOwner: 2, burstRadius: 1.3, warnDuration: 1.4, activeDuration: 1.2, fadeDuration: .3,
  finishDuration: 1.8, intentDuration: 3, minIntentDwell: 1,
});
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

export function createEncounterState(boss = { x: 0, y: 0 }) {
  return { phase: 'flee', phaseTime: 0, boss: { x: boss.x, y: boss.y, vx: 0, vy: 0, rounding: null },
    intent: 'flee', intentTime: 0, hits: 0, ramCooldown: 0, ramArmed: true, escapeTime: 0,
    hazards: [], nextDropIn: { hero: 0, boss: ENCOUNTER.firstDrop }, nextHazardId: 1,
    complete: false };
}

export function hazardPhase(age, config = ENCOUNTER) {
  if (age < config.warnDuration) return 'warning';
  if (age < config.warnDuration + config.activeDuration) return 'active';
  if (age < config.warnDuration + config.activeDuration + config.fadeDuration) return 'fading';
  return 'expired';
}

export function sweptRamHit(heroBefore, heroAfter, bossBefore, bossAfter, radius = ENCOUNTER.bossRadius + BLOB_RADIUS) {
  const x = heroBefore.x - bossBefore.x, y = heroBefore.y - bossBefore.y;
  const dx = (heroAfter.x - heroBefore.x) - (bossAfter.x - bossBefore.x);
  const dy = (heroAfter.y - heroBefore.y) - (bossAfter.y - bossBefore.y);
  const c = x * x + y * y - radius * radius;
  if (c <= 0) return 0;
  const a = dx * dx + dy * dy;
  if (a < 1e-12) return null;
  const b = 2 * (x * dx + y * dy);
  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) return null;
  const t = (-b - Math.sqrt(discriminant)) / (2 * a);
  return t >= 0 && t <= 1 ? t : null;
}

function diskSweepInterval(before, after, center, radius) {
  const x = before.x - center.x, y = before.y - center.y;
  const dx = after.x - before.x, dy = after.y - before.y;
  const a = dx * dx + dy * dy;
  const c = x * x + y * y - radius * radius;
  if (a < 1e-12) return c <= 0 ? [0, 1] : null;
  const b = 2 * (x * dx + y * dy), discriminant = b * b - 4 * a * c;
  if (discriminant < 0) return null;
  const root = Math.sqrt(discriminant);
  const from = Math.max(0, (-b - root) / (2 * a));
  const to = Math.min(1, (-b + root) / (2 * a));
  return from < to ? [from, to] : null;
}

export function mineExposureSeconds(before, after, hazards, dt, config = ENCOUNTER, target = 'hero') {
  if (dt <= 0) return 0;
  const intervals = [];
  for (const hazard of hazards) {
    if (hazard.owner === target) continue;
    const activeFrom = Math.max(0, (config.warnDuration - hazard.age) / dt);
    const activeTo = Math.min(1, (config.warnDuration + config.activeDuration - hazard.age) / dt);
    if (activeFrom >= activeTo) continue;
    const radius = config.burstRadius + (target === 'boss' ? config.bossRadius : BLOB_RADIUS);
    const inside = diskSweepInterval(before, after, hazard, radius);
    if (!inside) continue;
    const from = Math.max(activeFrom, inside[0]), to = Math.min(activeTo, inside[1]);
    if (from < to) intervals.push([from, to]);
  }
  intervals.sort((a, b) => a[0] - b[0]);
  let total = 0, from = 0, to = 0;
  for (const interval of intervals) {
    if (interval[0] > to) { total += to - from; [from, to] = interval; }
    else to = Math.max(to, interval[1]);
  }
  return Math.min(dt, (total + to - from) * dt);
}

export function sweptBurstHit(before, hero, center, oldAge, newAge, config = ENCOUNTER) {
  return mineExposureSeconds(before, hero, [{ ...center, age: oldAge }], newAge - oldAge, config) > 0;
}

function targetFromVector(boss, dx, dy, bounds, config) {
  const margin = config.bossRadius + 2.2;
  const left = bounds.minX + margin, right = bounds.maxX - margin;
  const bottom = bounds.minY + margin, top = bounds.maxY - margin;
  if (boss.x < left + .8 && dx < 0) dx = 1;
  if (boss.x > right - .8 && dx > 0) dx = -1;
  if (boss.y < bottom + .8 && dy < 0) dy = 1;
  if (boss.y > top - .8 && dy > 0) dy = -1;
  const mag = Math.hypot(dx, dy) || 1;
  return { x: clamp(boss.x + dx / mag * 8, left, right), y: clamp(boss.y + dy / mag * 8, bottom, top) };
}

function aiTarget(boss, hero, velocity, pickups, intent, bounds, config) {
  if (intent === 'recharge' && pickups.length) {
    return pickups.reduce((best, pickup) => distance(boss, pickup) < distance(boss, best) ? pickup : best, pickups[0]);
  }
  const predicted = { x: hero.x + velocity.x * .5, y: hero.y + velocity.y * .5 };
  let dx = predicted.x - boss.x, dy = predicted.y - boss.y;
  if (intent === 'flee') {
    const separation = distance(boss, predicted);
    if (separation > 14) [dx, dy] = [dx * .7 - dy * .3, dy * .7 + dx * .3];
    else { dx = -dx; dy = -dy; if (separation > 8) [dx, dy] = [-dy, dx]; }
  }
  return targetFromVector(boss, dx, dy, bounds, config);
}

export function chooseBossIntent(state, heroEnergy, bossEnergy, pickups, behavior = 'adaptive', config = ENCOUNTER) {
  if (config.bossSeeksLight === false) {
    if (behavior === 'flee') return 'flee';
    if (behavior === 'chase') return 'chase';
  }
  if (state.intent === 'recharge' && (!pickups.length || bossEnergy >= .45)) return 'flee';
  if (config.bossSeeksLight !== false && bossEnergy < (config.rechargeThreshold ?? .30) && pickups.length) return 'recharge';
  if (state.intent === 'recharge' && bossEnergy < .45 && pickups.length) return 'recharge';
  if (state.intentTime < config.minIntentDwell) return state.intent;
  if (behavior === 'chase') return 'chase';
  if (behavior === 'flee') return 'flee';
  if (state.intentTime >= config.intentDuration) return state.intent === 'chase' ? 'flee' : 'chase';
  if (state.intent === 'flee' && heroEnergy < bossEnergy - .15) return 'chase';
  return state.intent;
}

export function mineAvailability(state, { owner, actor, opponent, bounds, walls = [], energy, time, config = ENCOUNTER, placement = 'wake' }) {
  if (energy < config.mineCost) return { available: false, reason: 'light', remaining: 0 };
  const remaining = Math.max(0, (state.nextDropIn[owner] || 0) - time);
  if (remaining > 0) return { available: false, reason: 'cooldown', remaining };
  if (state.hazards.filter(hazard => hazard.owner === owner).length >= config.maxMinesPerOwner) return { available: false, reason: 'capacity', remaining: 0 };
  const speed = Math.hypot(actor.vx, actor.vy);
  if (placement !== 'actor' && speed < .4) return { available: false, reason: 'speed', remaining: 0 };
  const spot = placement === 'actor' ? { x: actor.x, y: actor.y } :
    { x: actor.x - actor.vx / speed * config.dropBehind, y: actor.y - actor.vy / speed * config.dropBehind };
  const r = config.burstRadius;
  if (spot.x - r <= bounds.minX || spot.x + r >= bounds.maxX || spot.y - r <= bounds.minY || spot.y + r >= bounds.maxY ||
      distance(spot, opponent) <= r + 1 || walls.some(wall => circleHitsRect(spot, r, wall)))
    return { available: false, reason: 'space', remaining: 0 };
  return { available: true, reason: null, remaining: 0, spot };
}

export function tryDropMine(state, input) {
  const { owner, time, config = ENCOUNTER } = input;
  const availability = mineAvailability(state, input);
  if (!availability.available) return { state, dropped: false, reason: availability.reason, remaining: availability.remaining };
  const spot = availability.spot;
  return { state: { ...state, hazards: [...state.hazards, { ...spot, id: state.nextHazardId, age: 0, owner }],
    nextHazardId: state.nextHazardId + 1, nextDropIn: { ...state.nextDropIn, [owner]: time + config.dropInterval } }, dropped: true, cost: config.mineCost };
}

export function stepEncounter(state, { before, hero, heroVelocity = { x: 0, y: 0 }, dt, time = 0, bounds, walls = [],
  heroEnergy = 1, bossEnergy = 1, pickups = [], dropMine = false, behavior = 'adaptive', config = ENCOUNTER }) {
  if (state.complete) return { state, events: [], heroExposureSeconds: 0, bossExposureSeconds: 0, costs: { hero: 0, boss: 0 } };
  let next = { ...state, boss: { ...state.boss, rounding: state.boss.rounding ? structuredClone(state.boss.rounding) : null },
    hazards: state.hazards.map(hazard => ({ ...hazard, age: hazard.age + dt })),
    phaseTime: state.phaseTime + dt, intentTime: state.intentTime + dt,
    ramCooldown: Math.max(0, state.ramCooldown - dt), escapeTime: Math.max(0, state.escapeTime - dt) };
  const events = [], costs = { hero: 0, boss: 0 };
  const bossBefore = { x: state.boss.x, y: state.boss.y };
  if (state.phase === 'resolved') {
    if (next.phaseTime >= config.finishDuration) { next.complete = true; events.push('complete'); }
    return { state: next, events, heroExposureSeconds: 0, bossExposureSeconds: 0, costs };
  }
  const intent = chooseBossIntent(next, heroEnergy, bossEnergy, pickups, behavior, config);
  if (intent !== state.intent) { next.intent = intent; next.intentTime = 0; }
  stepChaser(next.boss, { radius: config.bossRadius, speed: config.speed * (next.escapeTime > 0 ? 1.5 : 1),
    acceleration: config.acceleration * (next.escapeTime > 0 ? 1.8 : 1) },
  aiTarget(next.boss, hero, heroVelocity, pickups, intent, bounds, config), dt, bounds, walls);
  const contactRadius = config.bossRadius + BLOB_RADIUS;
  if (!next.ramArmed && next.ramCooldown === 0 && distance(hero, next.boss) > contactRadius + config.rearmClearance) next.ramArmed = true;
  const impact = sweptRamHit(before, hero, bossBefore, next.boss, contactRadius);
  if (state.ramArmed && next.ramCooldown === 0 && impact !== null) {
    next.hits++; next.ramArmed = false; next.ramCooldown = config.ramCooldown; next.escapeTime = config.escapeDuration;
    next.phaseTime = 0; costs.hero += config.ramCost; costs.boss += config.ramCost;
    const dx = next.boss.x - hero.x, dy = next.boss.y - hero.y;
    const length = Math.hypot(dx, dy) || 1;
    const normal = { x: dx / length, y: dy / length };
    next.boss.vx = normal.x * config.speed; next.boss.vy = normal.y * config.speed;
    events.push('hit');
    return { state: next, events, knockback: { x: -normal.x * 2.4, y: -normal.y * 2.4 },
      heroExposureSeconds: 0, bossExposureSeconds: 0, costs };
  }
  const heroExposureSeconds = mineExposureSeconds(before, hero, state.hazards, dt, config, 'hero');
  const bossExposureSeconds = mineExposureSeconds(bossBefore, next.boss, state.hazards, dt, config, 'boss');
  for (const hazard of next.hazards) {
    if (state.hazards.some(old => old.id === hazard.id && old.age < config.warnDuration && hazard.age >= config.warnDuration)) events.push('burst');
  }
  next.hazards = next.hazards.filter(hazard => hazardPhase(hazard.age, config) !== 'expired');
  if (dropMine) {
    const result = tryDropMine(next, { owner: 'hero', actor: { ...hero, vx: heroVelocity.x, vy: heroVelocity.y },
      opponent: next.boss, bounds, walls, energy: heroEnergy, time, config, placement: 'actor' });
    if (result.dropped) { next = result.state; costs.hero += result.cost; events.push('heroDrop'); }
    else events.push(`heroDropRejected:${result.reason}`);
  }
  const bossSpeed = Math.hypot(next.boss.vx, next.boss.vy);
  const behind = bossSpeed > .4 && ((hero.x - next.boss.x) * next.boss.vx + (hero.y - next.boss.y) * next.boss.vy) < 0;
  if (config.bossMines !== false && behind && distance(hero, next.boss) < 8 && bossEnergy >= config.mineCost + .15) {
    const result = tryDropMine(next, { owner: 'boss', actor: next.boss, opponent: hero,
      bounds, walls, energy: bossEnergy, time, config });
    if (result.dropped) { next = result.state; costs.boss += result.cost; events.push('bossDrop'); }
  }
  return { state: next, events, heroExposureSeconds, bossExposureSeconds, costs };
}
