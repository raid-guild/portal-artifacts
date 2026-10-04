import { RAID_VERSION, LEGACY_RAID_VERSION, LEVELS, HERO_IDS, lavaBossSchedule } from './raid-rules.js';
export { RAID_VERSION };
const bad = () => Object.assign(new Error('This run does not match the scoring rules.'), { status: 400 });
// Casual leaderboard plausibility checks. The game can reach high spawn and XP rates.
// Score is always derived from canonical telemetry, never accepted from the client.
function validateFinish(body, wallMs, maxMs, rulesVersion) {
  const { version, character, durationMs, stats, level } = body ?? {};
  const levels=rulesVersion===LEGACY_RAID_VERSION?['training','forest','desert','ice']:Object.keys(LEVELS);
  const heroes=rulesVersion===LEGACY_RAID_VERSION?['ranger','wizard','dwarf']:HERO_IDS;
  if (version !== rulesVersion || !heroes.includes(character) ||
      !levels.includes(level) ||
      !Number.isInteger(durationMs) || durationMs < 0 || durationMs > maxMs || durationMs > wallMs + 2000 ||
      !stats || typeof stats !== 'object' || Array.isArray(stats)) throw bad();
  const fields = ['kills', 'elites', 'bosses', 'chests', 'level'];
  if (fields.some(key => !Number.isSafeInteger(stats[key]) || stats[key] < 0)) throw bad();
  const seconds = durationMs / 1000;
  // Initial 22 enemies; up to 8 more on each 60 Hz simulation tick. Allow extra
  // boss and chest-guardian spawns. Shrine XP can raise level before the first kill.
  const maxKills = 22 + Math.ceil(seconds * 480) + Math.ceil(seconds / 90) + Math.ceil(seconds / 36) + 2;
  const lava=rulesVersion===RAID_VERSION&&level==='lava';
  const maxBosses = lava?lavaBossSchedule(seconds).maxAdmitted:
    Math.floor((seconds + 0.1) / 90) + (rulesVersion===RAID_VERSION&&seconds>=660?1:0);
  const maxChests = lava?2+Math.floor(seconds/45)+maxBosses:2+Math.floor(seconds / 30);
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
export function validateRaidFinish(body,wallMs,maxMs=2*60*60*1000){return validateFinish(body,wallMs,maxMs,RAID_VERSION);}
export function validateV2RaidFinish(body,wallMs,maxMs=2*60*60*1000){return validateFinish(body,wallMs,maxMs,LEGACY_RAID_VERSION);}

// Existing v1 runs can complete during a coordinated v2 API rollout. No new v1
// run starts are accepted; their scores stay on the legacy board.
export function validateLegacyRaidFinish(body,wallMs,maxMs=2*60*60*1000){
  if(body?.version!=='1')throw bad();
  const result=validateV2RaidFinish({...body,version:LEGACY_RAID_VERSION,level:'training'},wallMs,maxMs);
  const {realm,...details}=result.details;
  return {...result,details};
}
