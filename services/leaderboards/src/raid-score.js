import { RAID_VERSION, LEVELS } from './raid-rules.js';
export { RAID_VERSION };
const bad = () => Object.assign(new Error('This run does not match the scoring rules.'), { status: 400 });
// Casual leaderboard plausibility checks. The game can reach high spawn and XP rates.
// Score is always derived from canonical telemetry, never accepted from the client.
export function validateRaidFinish(body, wallMs, maxMs = 2 * 60 * 60 * 1000) {
  const { version, character, durationMs, stats, level } = body ?? {};
  if (version !== RAID_VERSION || !['ranger', 'wizard', 'dwarf'].includes(character) ||
      !LEVELS[level] ||
      !Number.isInteger(durationMs) || durationMs < 0 || durationMs > maxMs || durationMs > wallMs + 2000 ||
      !stats || typeof stats !== 'object' || Array.isArray(stats)) throw bad();
  const fields = ['kills', 'elites', 'bosses', 'chests', 'level'];
  if (fields.some(key => !Number.isSafeInteger(stats[key]) || stats[key] < 0)) throw bad();
  const seconds = durationMs / 1000;
  // Initial 22 enemies; up to 8 more on each 60 Hz simulation tick. Allow extra
  // boss and chest-guardian spawns. Shrine XP can raise level before the first kill.
  const maxKills = 22 + Math.ceil(seconds * 480) + Math.ceil(seconds / 90) + Math.ceil(seconds / 36) + 2;
  const maxBosses = Math.floor((seconds + 0.1) / 90);
  const maxChests = 2 + Math.floor(seconds / 30);
  const maxLevel = 1 + Math.floor((stats.kills * 15 + stats.bosses * 88 + 12 * 18) / 14);
  if (stats.level < 1 || stats.kills > maxKills || stats.elites + stats.bosses > stats.kills ||
      stats.bosses > maxBosses || stats.chests > maxChests || stats.level > maxLevel) throw bad();
  const details = { character, realm: level, kills: stats.kills, elites: stats.elites, bosses: stats.bosses,
    chests: stats.chests, level: stats.level };
  const baseScore = (stats.kills - stats.elites - stats.bosses) * 10 + stats.elites * 75 +
    stats.bosses * 600 + stats.chests * 120 + (stats.level - 1) * 40 + Math.floor(seconds) * 2;
  const score = Math.floor(baseScore * LEVELS[level].scoreMultiplier);
  if (!Number.isSafeInteger(score) || score > 2147483647) throw bad();
  return { score, wave: null, durationMs, details };
}

// Existing v1 runs can complete during a coordinated v2 API rollout. No new v1
// run starts are accepted; their scores stay on the legacy board.
export function validateLegacyRaidFinish(body,wallMs,maxMs=2*60*60*1000){
  if(body?.version!=='1')throw bad();
  const result=validateRaidFinish({...body,version:RAID_VERSION,level:'training'},wallMs,maxMs);
  const {realm,...details}=result.details;
  return {...result,details};
}
