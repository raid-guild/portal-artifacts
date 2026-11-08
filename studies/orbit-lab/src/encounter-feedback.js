const fade = (age, duration) => Number.isFinite(age) ? Math.max(0, 1 - age / duration) : 0;
const advanceAge = (age, dt) => Number.isFinite(age) ? age + dt : Infinity;

export function createEncounterFeedback() {
  return { heroRamAge: Infinity, bossRamAge: Infinity, heroSizzleAge: Infinity, bossSizzleAge: Infinity,
    resolutionAge: null, lastHeroCue: -Infinity, lastBossCue: -Infinity };
}

// Only physical ram and exposure events drive this presentation state. Passive
// drain, mine placement costs, and resource pickups cannot trigger a hit cue.
export function recordEncounterFeedback(state, { ram = false, heroExposureSeconds = 0, bossExposureSeconds = 0,
  bossDefeated = false, time = 0 } = {}) {
  const next = { ...state }, cues = [];
  if (ram) { next.heroRamAge = 0; next.bossRamAge = 0; cues.push('ram'); }
  if (heroExposureSeconds > 0) {
    next.heroSizzleAge = 0;
    if (time - next.lastHeroCue >= .2) { cues.push('heroSizzle'); next.lastHeroCue = time; }
  }
  if (bossExposureSeconds > 0) {
    next.bossSizzleAge = 0;
    if (time - next.lastBossCue >= .2) { cues.push('bossSizzle'); next.lastBossCue = time; }
  }
  if (bossDefeated && next.resolutionAge === null) { next.resolutionAge = 0; cues.push('bossDefeat'); }
  return { state: next, cues };
}

export function stepEncounterFeedback(state, elapsed, reducedMotion = false) {
  const dt = Number.isFinite(elapsed) ? Math.max(0, elapsed) : 0;
  const next = { ...state,
    heroRamAge: advanceAge(state.heroRamAge, dt), bossRamAge: advanceAge(state.bossRamAge, dt),
    heroSizzleAge: advanceAge(state.heroSizzleAge, dt), bossSizzleAge: advanceAge(state.bossSizzleAge, dt),
    resolutionAge: state.resolutionAge === null ? null : Math.min(1.8, state.resolutionAge + dt) };
  const heroRam = fade(next.heroRamAge, .34), heroSizzle = fade(next.heroSizzleAge, .27);
  const bossRam = fade(next.bossRamAge, .48), bossSizzle = fade(next.bossSizzleAge, .28);
  const r = next.resolutionAge;
  const contract = r === null ? 0 : Math.min(1, r / .25);
  const flare = r === null ? 0 : r < .25 ? 0 : r < .6 ? (r - .25) / .35 : Math.max(0, 1 - (r - .6) / 1.05);
  const ring = r === null || r < .35 ? 0 : Math.max(0, 1 - (r - .35) / 1.2);
  return { state: next, visual: {
    heroEdge: Math.min(.16, heroRam * .15 + heroSizzle * .09),
    shakePx: reducedMotion ? 0 : Math.min(4, heroRam * 3.2 + heroSizzle * 1.4),
    bossBloom: Math.min(1, bossRam * .72 + bossSizzle * .4),
    bossScale: reducedMotion ? 1 : r === null ? 1 : r < .25 ? 1 - contract * .3 : .7 + flare * .85,
    bossOpacity: r === null ? 1 : reducedMotion ? Math.max(0, 1 - r / 1.8) : r < .25 ? 1 : Math.max(0, 1 - (r - .25) / 1.3),
    ringOpacity: reducedMotion ? 0 : ring * .65,
    ringScale: reducedMotion ? 1 : r === null ? 1 : 1 + Math.max(0, r - .35) * 5,
    spark: reducedMotion ? 0 : Math.max(bossRam, ring),
    resolutionAge: r,
  } };
}
