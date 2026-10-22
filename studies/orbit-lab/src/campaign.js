import { BLOB_RADIUS, canPlaceWell } from './level.js';
import { segmentDistance } from './studies.js';
import levelOne from './levels/campaign-1.json' with { type: 'json' };
import levelTwo from './levels/campaign-2.json' with { type: 'json' };
import levelThree from './levels/campaign-3.json' with { type: 'json' };
import levelFour from './levels/campaign-4.json' with { type: 'json' };
import levelFive from './levels/campaign-5.json' with { type: 'json' };
import levelSix from './levels/campaign-6.json' with { type: 'json' };
import levelSeven from './levels/campaign-7.json' with { type: 'json' };
import levelEight from './levels/campaign-8.json' with { type: 'json' };
import levelNine from './levels/campaign-9.json' with { type: 'json' };
import { compileLevelDocument } from './level-document.js';

export const CAMPAIGN = {
  startLight: .6, burnRate: .018, pickupGain: .3, graceSeconds: 8,
  maxActiveWells: 2, maxTotalWells: null, pickupLife: 18, pickupRadius: .65,
};

const compiled = [levelOne, levelTwo, levelThree, levelFour, levelFive, levelSix, levelSeven, levelEight, levelNine].map(compileLevelDocument);
export const CAMPAIGN_LEVELS = compiled.map((item, index) => ({
  id: index + 1, chapter: Math.floor(index / 3) + 1, title: item.document.title, color: ['#b9fff0', '#ffb365', '#bdb3ff', '#a6e9ff', '#ffd58e', '#ffae82', '#acbaff', '#c9a9ff', '#a2d4ff'][index],
  kicker: ['LIGHT & DISTANCE', 'GRAVITY & DANGER', 'WALLS & ORBITS', 'FINDING THE FREQUENCY', 'FOLLOWING THE SIGNAL', 'AN ANSWER TAKES SHAPE', 'A LIGHT REMEMBERED', 'BETWEEN THE PULSES', 'CARRY THE SILENCE'][index],
  summary: ['A clear chamber. Keep the fire alive to reach the far portal.', 'Gather two pale moons before facing the giant ember.', 'Weave between offset walls and two orbiting embers.', 'Wait for the orbiting pair to open a path, then release.', 'Follow the echo through winding chambers. Keep its rhythm and your light alive.', 'Find your moment between moving lights, and carry an answer into the dark.', 'Hold inside an eclipse and remember the moving danger before crossing.', 'Follow the echo through offset passages. Bend your route, then accelerate between the pulses.', 'Carry the signal through a winding dark maze. Remember the openings and conserve your light.'][index],
  objective: ['Keep your light alive. Cross the open chamber to the far portal.', 'Gather pale moons. Their orbits catch light as you curve around the giant ember.', 'Carry light through the broad S and time the orbiting embers.', 'Enter the waiting place. Hold still as the orbiting embers move, then press Space to release through the opening.', 'Follow the echo through the chambers. Cross the sound gates and keep your light alive.', 'Watch the moving lights, then release in time. Carry your gathered notes to the portal.', 'Study the embers, enter the eclipse, and release when you remember an opening.', 'Steer between the three offset openings. Launch through two moving pairs, then bend below the last wall.', 'Thread four offset openings. Use each burst of speed, but steer early enough to meet the next passage.'][index],
  mechanic: 'campaign', heroGravity: 0, moons: [],
  document: item.document, entities: item.entities, settings: item.settings,
  soundGates: item.entities.filter(entity => entity.type === 'soundGate').map(entity => ({ id: entity.slot, x: entity.x, y: entity.y, radius: entity.radius })),
  giant: index === 1 ? { x: 28, y: 0, radius: 4, strength: 70 } : undefined,
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
export function stepCampaign(state, { before, hero, collectors = [], dt, time, level = CAMPAIGN_DEMO.level, config = CAMPAIGN, extraEnergy = 0, availableCompanions = 0, lightPaused = false }) {
  if (state.failed) return { state, collected: 0, heartbeat: [], failed: false };
  const next = { ...state, pickups: state.pickups.filter(pickup => time - pickup.createdAt < CAMPAIGN.pickupLife) };
  next.energy = Math.max(0, state.energy - (lightPaused ? 0 : config.burnRate * dt));
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
  } else if (lightPaused) {
    next.graceLeft = state.graceLeft;
    next.graceDuration = state.graceDuration;
    next.beatPhase = state.beatPhase;
    next.failed = false;
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
