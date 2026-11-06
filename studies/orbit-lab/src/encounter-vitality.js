import { CAMPAIGN, campaignPointAllowed, createCampaign, stepCampaign } from './campaign.js';
import { ENCOUNTER } from './encounter.js';
import { BLOB_RADIUS } from './level.js';

export const ENCOUNTER_VITALITY = Object.freeze({ ...CAMPAIGN, startLight: .6, burnRate: .01,
  graceSeconds: 8, randomRecharge: false });
export const MINE_BURN_RATE = .42;

export function createEncounterVitality(seed = 2819, duel = null) {
  const heroConfig = { ...ENCOUNTER_VITALITY, startLight: duel?.heroLight ?? ENCOUNTER_VITALITY.startLight,
    burnRate: duel?.burnRate ?? ENCOUNTER_VITALITY.burnRate };
  const bossConfig = { ...ENCOUNTER_VITALITY, startLight: duel?.bossLight ?? ENCOUNTER_VITALITY.startLight,
    burnRate: duel?.bossBurnRate ?? duel?.burnRate ?? ENCOUNTER_VITALITY.burnRate };
  return { hero: createCampaign(seed, heroConfig), boss: createCampaign(seed + 1, bossConfig),
    pickups: duel?.pickups ? structuredClone(duel.pickups) : [{ x: -8, y: 3.5, id: 1, createdAt: 0 }, { x: 4, y: -3.5, id: 2, createdAt: 0 }],
    nextId: 3, nextSpawnAt: 7, seed, tieOwner: 'hero' };
}

function sweptFirst(before, after, point, radius) {
  const x = before.x - point.x, y = before.y - point.y;
  const dx = after.x - before.x, dy = after.y - before.y;
  const c = x * x + y * y - radius * radius;
  if (c <= 0) return 0;
  const a = dx * dx + dy * dy;
  if (a < 1e-12) return null;
  const b = 2 * (x * dx + y * dy), det = b * b - 4 * a * c;
  if (det < 0) return null;
  const t = (-b - Math.sqrt(det)) / (2 * a);
  return t >= 0 && t <= 1 ? t : null;
}

function random(seed) {
  const next = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return { seed: next, value: next / 4294967296 };
}

function spawnShared(state, hero, boss, level, hazards, time) {
  const dangerLevel = { ...level, dangers: [...(level.dangers || []),
    ...hazards.map(hazard => ({ x: hazard.x, y: hazard.y, radius: ENCOUNTER.burstRadius }))] };
  let seed = state.seed;
  for (let i = 0; i < 40; i++) {
    let sample = random(seed); seed = sample.seed;
    const anchor = i % 3 === 0 ? { x: (hero.x + boss.x) / 2, y: (hero.y + boss.y) / 2 } : i % 2 ? hero : boss;
    const angle = sample.value * Math.PI * 2;
    sample = random(seed); seed = sample.seed;
    const radius = 3.5 + sample.value * 4;
    const point = { x: anchor.x + Math.cos(angle) * radius, y: anchor.y + Math.sin(angle) * radius };
    if (!campaignPointAllowed(point, dangerLevel, 1) ||
        Math.hypot(point.x - hero.x, point.y - hero.y) < 2.5 ||
        Math.hypot(point.x - boss.x, point.y - boss.y) < 2.5 ||
        state.pickups.some(pickup => Math.hypot(point.x - pickup.x, point.y - pickup.y) < 2.5)) continue;
    return { point: { ...point, id: state.nextId, createdAt: time }, seed };
  }
  return { point: null, seed };
}

// One shared pickup pool is adjudicated by first swept contact. Each actor's
// private campaign timer then receives exactly one energy delta for the tick.
export function stepEncounterVitality(state, { heroBefore, hero, arrival = null, bossBefore, boss, dt, time, level,
  hazards = [], heroExposureSeconds = 0, bossExposureSeconds = 0, costs = { hero: 0, boss: 0 }, lightPaused = false,
  heroLightPaused = lightPaused, bossLightPaused = lightPaused, duel = null }) {
  const next = { ...state, pickups: state.pickups.filter(pickup => time - pickup.createdAt < CAMPAIGN.pickupLife) };
  const collected = { hero: 0, boss: 0 };
  next.pickups = next.pickups.filter(pickup => {
    const physicalAt = sweptFirst(heroBefore, hero, pickup, CAMPAIGN.pickupRadius + BLOB_RADIUS);
    const arrivalAt = arrival && Math.hypot(arrival.x - pickup.x, arrival.y - pickup.y) <= CAMPAIGN.pickupRadius + BLOB_RADIUS ? 1 : null;
    const heroAt = physicalAt ?? arrivalAt;
    const bossAt = sweptFirst(bossBefore, boss, pickup, CAMPAIGN.pickupRadius + ENCOUNTER.bossRadius);
    if (heroAt === null && bossAt === null) return true;
    const owner = heroAt === null ? 'boss' : bossAt === null ? 'hero' :
      Math.abs(heroAt - bossAt) < 1e-8 ? next.tieOwner : heroAt < bossAt ? 'hero' : 'boss';
    collected[owner]++;
    if (heroAt !== null && bossAt !== null && Math.abs(heroAt - bossAt) < 1e-8) next.tieOwner = owner === 'hero' ? 'boss' : 'hero';
    return false;
  });
  if (time >= state.nextSpawnAt) {
    const spawned = spawnShared(next, hero, boss, level, hazards, time);
    next.seed = spawned.seed;
    if (spawned.point) { next.pickups.push(spawned.point); next.nextId++; }
    next.nextSpawnAt = time + (spawned.point ? 7 : 2);
  }
  const emptyLevel = { ...level, dangers: [...(level.dangers || []),
    ...hazards.map(hazard => ({ x: hazard.x, y: hazard.y, radius: ENCOUNTER.burstRadius }))] };
  const heroStep = stepCampaign(state.hero, { before: heroBefore, hero, dt, time, level: emptyLevel,
    config: { ...ENCOUNTER_VITALITY, burnRate: duel?.burnRate ?? ENCOUNTER_VITALITY.burnRate }, extraEnergy: collected.hero * CAMPAIGN.pickupGain - costs.hero - Math.min(dt, heroExposureSeconds) * MINE_BURN_RATE, lightPaused: heroLightPaused });
  const bossStep = stepCampaign(state.boss, { before: bossBefore, hero: boss, dt, time, level: emptyLevel,
    config: { ...ENCOUNTER_VITALITY, burnRate: duel?.bossBurnRate ?? duel?.burnRate ?? ENCOUNTER_VITALITY.burnRate }, extraEnergy: collected.boss * CAMPAIGN.pickupGain - costs.boss - Math.min(dt, bossExposureSeconds) * MINE_BURN_RATE, lightPaused: bossLightPaused });
  next.hero = heroStep.state; next.boss = bossStep.state;
  return { state: next, collected, heartbeat: heroStep.heartbeat,
    heroFailed: heroStep.failed, bossFailed: bossStep.failed,
    result: heroStep.state.failed && bossStep.state.failed ? 'draw' : heroStep.state.failed ? 'hero' : bossStep.state.failed ? 'boss' : null };
}
