export const RAID_VERSION = '2';
export const LEVELS = Object.freeze({
  training: Object.freeze({ id: 'training', name: 'Guild Training', milestoneMs: 180000, unlocks: 'forest', scoreMultiplier: 1 }),
  forest: Object.freeze({ id: 'forest', name: 'Haunted Forest', milestoneMs: 300000, unlocks: 'desert', scoreMultiplier: 1 }),
  desert: Object.freeze({ id: 'desert', name: 'Desert Oasis', milestoneMs: 420000, unlocks: 'ice', scoreMultiplier: 1 }),
  ice: Object.freeze({ id: 'ice', name: 'Frozen Highlands', milestoneMs: 540000, unlocks: null, scoreMultiplier: 1 }),
});
export const HERO_IDS = Object.freeze(['ranger', 'wizard', 'dwarf']);
export const SKILLS = Object.freeze(['vitality', 'agility', 'bombRecharge']);
export const MONSTERS_CHAIN_ID = 1;
export const MONSTERS_CONTRACT = '0xecb9b2ea457740fbde58c758e4c574834224413e';
export const MONSTERS = Object.freeze({
  rageipede: Object.freeze({ realm:'forest', tokenId: 315, name: 'Rageipede The Goblin of The Forest', size: 'Tiny', alignment: 'Chaotic', actions: 'Multiattack, Fey Charm', ability: 'Sneak Attack', weakness: 'Light', locomotion: 'Hop', language: 'Elf, Elemental, Lizardfolk, Plant, Trollkin, Orc' }),
  xorn: Object.freeze({ realm:'forest', tokenId: 3421, name: 'Xorn The Fiend of The Forest', size: 'Gigantic', alignment: 'Neutral Evil', actions: 'Club, Talons', ability: 'Shadow Stealth', weakness: 'Freeze', locomotion: 'Prowl', language: "Understands all but can't speak" }),
  efreeti: Object.freeze({ realm:'forest', tokenId: 8883, name: 'Efreeti The Aberration of The Forest', size: 'Gigantic', alignment: 'Neutral Evil', actions: 'Multiattack, Tail', ability: 'Ingest Magic', weakness: 'Freeze', locomotion: 'Fly', language: 'Elf, Elemental, Lizardfolk, Plant, Trollkin, Orc' }),
  deathwisp: Object.freeze({ realm:'desert', tokenId:1201, name:'Deathwisp The Fey of The Desert', size:'Scrawny', alignment:'Neutral', actions:'Absorb, Charge', ability:'Evasive', weakness:'Light', locomotion:'Hop', language:"Understands all but can't speak" }),
  buraq: Object.freeze({ realm:'desert', tokenId:83, name:'Buraq The Noctiny of The Desert', size:'Gigantic', alignment:'Lawful Neutral', actions:'Poison Breath, Magical Burble', ability:'Resize', weakness:'Noise', locomotion:'Fly', language:'Dwarf, Giant, Titan' }),
  chuul: Object.freeze({ realm:'ice', tokenId:9189, name:'Chuul The Swarm of Tiny Monstrosities of The Mountains', size:'Stout', alignment:'Neutral', actions:'Club, Thorny Lash', ability:'Ethereal Jaunt', weakness:'Flames', locomotion:'Pound', language:'Dwarf, Giant, Titan' }),
  dogmole: Object.freeze({ realm:'ice', tokenId:8965, name:'Dogmole The Demon of The Mountains', size:'Gigantic', alignment:'Lawful Evil', actions:'Club, Fist', ability:'Groundbreaker', weakness:'Physical Damage', locomotion:'Gallop', language:'Bearfolk, Beast, Burrowling, Telepathy' }),
});
const bad = (message = 'Invalid progression request.') => Object.assign(new Error(message), { status: 400 });
export const emptyProfile = () => ({ schemaVersion: 2, revision: 0, unlocked: ['training'], milestones: Object.fromEntries(Object.keys(LEVELS).map(level=>[level,{}])), skills: Object.fromEntries(HERO_IDS.map(hero => [hero, { vitality: 0, agility: 0, bombRecharge: 0 }])), purchases: [], monsters: Object.fromEntries(Object.keys(MONSTERS).map(kind => [kind, { encountered: 0, kills: 0, counterKills: 0 }])) });
export function normalizeProfile(value) {
  const result = emptyProfile();
  if (!value || typeof value !== 'object' || value.schemaVersion!==2) return result;
  result.revision = Number.isSafeInteger(value.revision)&&value.revision>=0?value.revision:0;
  for (const level of Object.keys(LEVELS)) for (const hero of HERO_IDS) if (value.milestones?.[level]?.[hero]) result.milestones[level][hero] = true;
  for (const level of Object.values(LEVELS)) if (level.unlocks && Object.keys(result.milestones[level.id]).length) result.unlocked.push(level.unlocks);
  for (const hero of HERO_IDS) for (const skill of SKILLS) { const rank=value.skills?.[hero]?.[skill];result.skills[hero][skill]=Number.isSafeInteger(rank)&&rank>=0&&rank<=2?rank:0; }
  if(Array.isArray(value.purchases))result.purchases=value.purchases.filter(row=>HERO_IDS.includes(row?.hero)&&SKILLS.includes(row?.skill)&&[1,2].includes(row?.rank)&&Number.isSafeInteger(row?.expectedRevision)&&row.expectedRevision>=0).slice(-24).map(row=>({hero:row.hero,skill:row.skill,rank:row.rank,expectedRevision:row.expectedRevision}));
  for (const kind of Object.keys(MONSTERS)) for (const field of ['encountered', 'kills', 'counterKills']) { const n=value.monsters?.[kind]?.[field];result.monsters[kind][field]=Number.isSafeInteger(n)&&n>=0?n:0; }
  return result;
}
export function credits(profile, hero) {
  return Object.values(LEVELS).reduce((n, level) => n + (profile.milestones[level.id]?.[hero] ? 1 : 0), 0) - SKILLS.reduce((n, skill) => n + profile.skills[hero][skill], 0);
}
export function purchase(profile, hero, skill, expectedRevision, rank) {
  if (!HERO_IDS.includes(hero) || !SKILLS.includes(skill) || !Number.isInteger(expectedRevision)) throw bad();
  const desiredRank=rank??(profile.skills[hero][skill]===1&&expectedRevision===profile.revision-1?1:profile.skills[hero][skill]+1);
  if(![1,2].includes(desiredRank))throw bad();
  if(profile.purchases?.some(row=>row.hero===hero&&row.skill===skill&&row.rank===desiredRank&&row.expectedRevision===expectedRevision))return normalizeProfile(profile);
  if (profile.revision !== expectedRevision) throw Object.assign(new Error('Profile changed. Reload and try again.'), { status: 409 });
  if (profile.skills[hero][skill] !== desiredRank-1 || credits(profile, hero) < 1) throw bad('Earn a milestone credit before buying this skill.');
  const next = normalizeProfile(profile); next.skills[hero][skill]=desiredRank;next.purchases.push({hero,skill,rank:desiredRank,expectedRevision});next.purchases=next.purchases.slice(-24); next.revision++; return next;
}
export function monsterStage(record) {
  if (!record?.encountered) return 0;
  if (record.kills >= 25 && record.counterKills >= 1) return 4;
  if (record.counterKills >= 1) return 3;
  if (record.kills >= 5) return 2;
  return 1;
}
export function validateRunConfig(body, profile) {
  if (body?.version !== RAID_VERSION || !HERO_IDS.includes(body.character) || !LEVELS[body.level] || !profile.unlocked.includes(body.level)) throw bad('Select an unlocked level and class.');
  return { version: RAID_VERSION, character: body.character, level: body.level, skills: { ...profile.skills[body.character] } };
}
export function validateMonsterProgress(value, previous = {}) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw bad();
  const result = {};
  for (const kind of Object.keys(MONSTERS)) {
    const next = value[kind] ?? { encountered: 0, kills: 0, counterKills: 0 };
    const old = previous[kind] ?? { encountered: 0, kills: 0, counterKills: 0 };
    for (const field of ['encountered', 'kills', 'counterKills']) if (!Number.isSafeInteger(next[field]) || next[field] < (old[field] || 0) || next[field] > 1000000) throw bad();
    if (next.counterKills > next.kills || next.kills > next.encountered) throw bad();
    result[kind] = { encountered: next.encountered, kills: next.kills, counterKills: next.counterKills };
  }
  return result;
}
export function applyProgress(profile, config, progress, previous = {}) {
  if (!Number.isSafeInteger(progress?.durationMs) || progress.durationMs < (previous.durationMs || 0)) throw bad();
  const monsters = validateMonsterProgress(progress.monsters, previous.monsters);
  if(Object.entries(monsters).some(([kind,row])=>MONSTERS[kind].realm!==config.level&&(row.encountered||row.kills||row.counterKills)))throw bad();
  const kills = Object.values(monsters).reduce((n, row) => n + row.kills, 0);
  if (!Number.isSafeInteger(progress.kills) || progress.kills < (previous.kills || 0) || kills > progress.kills) throw bad();
  const seconds=progress.durationMs/1000,maxKills=22+Math.ceil(seconds*480)+Math.ceil(seconds/90)+Math.ceil(seconds/36)+2;
  if(progress.kills>maxKills||Object.values(monsters).reduce((n,row)=>n+row.encountered,0)>maxKills+50)throw bad();
  const next = normalizeProfile(profile), milestone = LEVELS[config.level].milestoneMs;
  if (progress.durationMs >= milestone && !next.milestones[config.level][config.character]) { next.milestones[config.level][config.character] = true; next.revision++; }
  const unlock=LEVELS[config.level].unlocks;
  if (unlock && progress.durationMs >= milestone && !next.unlocked.includes(unlock)) next.unlocked.push(unlock);
  for (const kind of Object.keys(MONSTERS)) for (const field of ['encountered', 'kills', 'counterKills']) next.monsters[kind][field] += monsters[kind][field] - (previous.monsters?.[kind]?.[field] || 0);
  return { profile: next, progress: { durationMs: progress.durationMs, kills: progress.kills, monsters } };
}
