import { BLOB_RADIUS, canPlaceWell } from './level.js';
import { segmentDistance } from './studies.js';

export const CAMPAIGN = {
  startLight: .6, burnRate: .018, pickupGain: .3, graceSeconds: 8,
  maxActiveWells: 2, maxTotalWells: null, pickupLife: 18, pickupRadius: .65,
};

const chamber = {
  bounds: { minX: -20, maxX: 76, minY: -27, maxY: 27 },
  spawn: { x: 0, y: 0, vx: 1.8, vy: 0 },
  goal: { x: 50, y: 0, radius: 1.5 },
  walls: [
    { x: -20.25, y: 0, w: .5, h: 54.5 }, { x: 76.25, y: 0, w: .5, h: 54.5 },
    { x: 28, y: 27.25, w: 96.5, h: .5 }, { x: 28, y: -27.25, w: 96.5, h: .5 },
  ], spikes: [], dangers: [],
};

export const CAMPAIGN_LEVELS = [
  { id: 1, title: 'The long crossing', color: '#b9fff0',
  objective: 'Keep your light alive. Cross the open chamber to the far portal.',
  mechanic: 'campaign', heroGravity: 0, moons: [],
  level: chamber },
  { id: 2, title: 'The heavy neighbor', color: '#ffb365',
    objective: 'Curve around the giant ember. Its gravity reaches beyond its fire.',
    mechanic: 'giant', heroGravity: 0, moons: [],
    giant: { x: 28, y: 0, radius: 4, strength: 70 },
    level: { ...chamber, dangers: [{ x: 28, y: 0, radius: 4, strength: 70 }] },
  },
];
export const CAMPAIGN_DEMO = CAMPAIGN_LEVELS[0];
export function getCampaignLevel(id) { return CAMPAIGN_LEVELS.find(level => level.id === Number(id)) || CAMPAIGN_DEMO; }
export function nextCampaignLevel(id) { return CAMPAIGN_LEVELS.find(level => level.id === Number(id) + 1) || null; }

export function campaignPointAllowed(point, level = CAMPAIGN_DEMO.level, clearance = .47) {
  return canPlaceWell(point, level) && !(level.dangers || []).some(danger => Math.hypot(point.x - danger.x, point.y - danger.y) < danger.radius + clearance);
}

export function canPlaceCampaignWell(wellsUsed, maxTotal = CAMPAIGN.maxTotalWells) {
  return maxTotal === null || wellsUsed < maxTotal;
}

function random(seed) {
  const next = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return { seed: next, value: next / 4294967296 };
}

export function createCampaign(seed = 428) {
  return {
    energy: CAMPAIGN.startLight, graceLeft: CAMPAIGN.graceSeconds,
    pickups: [{ x: 6, y: 2.5, id: 1, createdAt: 0 }, { x: 15, y: -3, id: 2, createdAt: 0 }],
    nextId: 3, nextSpawnAt: 7, seed, beatPhase: 0, failed: false,
  };
}

export function spawnCampaignPickup(hero, state, level = CAMPAIGN_DEMO.level) {
  let seed = state.seed;
  for (let i = 0; i < 32; i++) {
    let sample = random(seed); seed = sample.seed;
    const angle = (sample.value - .5) * Math.PI * 1.5;
    sample = random(seed); seed = sample.seed;
    const distance = 4 + sample.value * 5;
    const point = { x: hero.x + Math.cos(angle) * distance, y: hero.y + Math.sin(angle) * distance };
    if (!campaignPointAllowed(point, level, CAMPAIGN.pickupRadius + BLOB_RADIUS)) continue;
    if (Math.hypot(point.x - level.goal.x, point.y - level.goal.y) < level.goal.radius + 1.3) continue;
    if (state.pickups.some(pickup => Math.hypot(point.x - pickup.x, point.y - pickup.y) < 2.5)) continue;
    return { point, seed };
  }
  return { point: null, seed };
}

// Only call this from the fixed simulation step. A pickup is swept before darkness expires.
export function stepCampaign(state, { before, hero, dt, time, level = CAMPAIGN_DEMO.level }) {
  if (state.failed) return { state, collected: 0, heartbeat: [], failed: false };
  const next = { ...state, pickups: state.pickups.filter(pickup => time - pickup.createdAt < CAMPAIGN.pickupLife) };
  next.energy = Math.max(0, state.energy - CAMPAIGN.burnRate * dt);
  let collected = 0;
  next.pickups = next.pickups.filter(pickup => {
    if (segmentDistance(before, hero, pickup) > CAMPAIGN.pickupRadius + BLOB_RADIUS) return true;
    collected++;
    return false;
  });
  next.energy = Math.min(1, next.energy + collected * CAMPAIGN.pickupGain);
  if (time >= next.nextSpawnAt) {
    const spawned = spawnCampaignPickup(hero, next, level);
    next.seed = spawned.seed;
    if (spawned.point) next.pickups.push({ ...spawned.point, id: next.nextId++, createdAt: time });
    next.nextSpawnAt = time + (spawned.point ? 7 : 2);
  }
  const heartbeat = [];
  if (next.energy > 0) {
    next.graceLeft = CAMPAIGN.graceSeconds;
    next.beatPhase = 0;
  } else {
    next.graceLeft = Math.max(0, state.graceLeft - dt);
    next.failed = next.graceLeft <= 0;
    if (!next.failed) {
      const urgency = 1 - next.graceLeft / CAMPAIGN.graceSeconds;
      const advance = dt * (60 + 80 * urgency) / 60;
      const from = state.energy > 0 ? 0 : state.beatPhase;
      if (state.energy > 0) heartbeat.push({ part: 'lub', urgency });
      const to = from + advance;
      for (let cycle = Math.floor(from); cycle <= Math.floor(to); cycle++) {
        if (from < cycle + .22 && to >= cycle + .22) heartbeat.push({ part: 'dub', urgency });
        if (cycle > 0 && from < cycle && to >= cycle) heartbeat.push({ part: 'lub', urgency });
      }
      next.beatPhase = to % 1;
    }
  }
  return { state: next, collected, heartbeat, failed: next.failed && !state.failed };
}
