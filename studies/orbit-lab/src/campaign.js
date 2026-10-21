import { BLOB_RADIUS, canPlaceWell } from './level.js';
import { segmentDistance } from './studies.js';
import levelOne from './levels/campaign-1.json' with { type: 'json' };
import levelTwo from './levels/campaign-2.json' with { type: 'json' };
import { compileLevelDocument } from './level-document.js';

export const CAMPAIGN = {
  startLight: .6, burnRate: .018, pickupGain: .3, graceSeconds: 8,
  maxActiveWells: 2, maxTotalWells: null, pickupLife: 18, pickupRadius: .65,
};

const compiled = [levelOne, levelTwo].map(compileLevelDocument);
export const CAMPAIGN_LEVELS = compiled.map((item, index) => ({
  id: index + 1, title: item.document.title, color: index ? '#ffb365' : '#b9fff0',
  objective: index ? 'Gather pale moons. Their orbits catch light as you curve around the giant ember.' : 'Keep your light alive. Cross the open chamber to the far portal.',
  mechanic: 'campaign', heroGravity: 0, moons: [],
  document: item.document, entities: item.entities, settings: item.settings,
  soundGates: item.entities.filter(entity => entity.type === 'soundGate').map(entity => ({ id: entity.slot, x: entity.x, y: entity.y, radius: entity.radius })),
  giant: index ? { x: 28, y: 0, radius: 4, strength: 70 } : undefined,
  level: item.level,
}));
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

export function createCampaign(seed = 428, config = CAMPAIGN) {
  return {
    energy: config.startLight, graceLeft: config.graceSeconds, graceDuration: config.graceSeconds,
    pickups: config.randomRecharge === false ? [] : [{ x: 6, y: 2.5, id: 1, createdAt: 0 }, { x: 15, y: -3, id: 2, createdAt: 0 }],
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
export function stepCampaign(state, { before, hero, collectors = [], dt, time, level = CAMPAIGN_DEMO.level, config = CAMPAIGN, extraEnergy = 0, availableCompanions = 0 }) {
  if (state.failed) return { state, collected: 0, heartbeat: [], failed: false };
  const next = { ...state, pickups: state.pickups.filter(pickup => time - pickup.createdAt < CAMPAIGN.pickupLife) };
  next.energy = Math.max(0, state.energy - config.burnRate * dt);
  let collected = 0;
  next.pickups = next.pickups.filter(pickup => {
    const heroHit = segmentDistance(before, hero, pickup) <= CAMPAIGN.pickupRadius + BLOB_RADIUS;
    const moonHit = collectors.some(({ from, to, radius = .16 }) => segmentDistance(from, to, pickup) <= CAMPAIGN.pickupRadius + radius);
    if (!heroHit && !moonHit) return true;
    collected++;
    return false;
  });
  next.energy = Math.max(0, Math.min(1, next.energy + collected * CAMPAIGN.pickupGain + extraEnergy));
  if (config.randomRecharge !== false && time >= next.nextSpawnAt) {
    const spawned = spawnCampaignPickup(hero, next, level);
    next.seed = spawned.seed;
    if (spawned.point) next.pickups.push({ ...spawned.point, id: next.nextId++, createdAt: time });
    next.nextSpawnAt = time + (spawned.point ? 7 : 2);
  }
  const heartbeat = [];
  let consumedCompanion = false;
  if (next.energy > 0) {
    next.graceLeft = config.graceSeconds;
    next.graceDuration = config.graceSeconds;
    next.beatPhase = 0;
  } else {
    next.graceLeft = Math.max(0, state.graceLeft - dt);
    if (next.graceLeft <= 0 && availableCompanions > 0) {
      consumedCompanion = true;
      next.graceLeft = 4;
      next.graceDuration = 4;
      next.beatPhase = 0;
      next.failed = false;
    } else next.failed = next.graceLeft <= 0;
    if (!next.failed) {
      const duration = next.graceDuration || config.graceSeconds;
      const urgency = duration > 0 ? 1 - next.graceLeft / duration : 1;
      const advance = dt * (60 + 80 * urgency) / 60;
      const from = state.energy > 0 ? 0 : state.beatPhase;
      if (state.energy > 0 && !consumedCompanion) heartbeat.push({ part: 'lub', urgency });
      const to = from + advance;
      if (!consumedCompanion) {
        for (let cycle = Math.floor(from); cycle <= Math.floor(to); cycle++) {
          if (from < cycle + .22 && to >= cycle + .22) heartbeat.push({ part: 'dub', urgency });
          if (cycle > 0 && from < cycle && to >= cycle) heartbeat.push({ part: 'lub', urgency });
        }
        next.beatPhase = to % 1;
      }
    }
  }
  return { state: next, collected, heartbeat, consumedCompanion, failed: next.failed && !state.failed };
}
