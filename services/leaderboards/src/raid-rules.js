import {RAID_VERSION,LEGACY_RAID_VERSION,LEVELS,CHECKPOINTS,HERO_IDS,STARTER_HERO_IDS,SKILLS,PERKS,perkFor,LAVA_BOSS_SCHEDULE,lavaBossSchedule} from './raid-content.js';
export {RAID_VERSION,LEGACY_RAID_VERSION,LEVELS,CHECKPOINTS,HERO_IDS,STARTER_HERO_IDS,SKILLS,PERKS,perkFor,LAVA_BOSS_SCHEDULE,lavaBossSchedule};
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
  tosculi: Object.freeze({ realm:'lava', tokenId:3015, name:'Tosculi Hive-Queen The Swarm of Tiny Undead of The Dungeon', size:'Tiny', alignment:'Neutral Evil', actions:'Flame Breath, Breath Weapon', ability:'Sure-Footed', weakness:'Freeze', locomotion:'Leap', language:'Dragon, Abberation, Merfolk, Simian' }),
  seahag: Object.freeze({ realm:'lava', tokenId:5413, name:'Sea Hag The Kryt of The Desert', size:'Stout', alignment:'Lawful Neutral', actions:'Poison Breath, Flame Breath', ability:'Sure-Footed', weakness:'Freeze', locomotion:'Leap', language:'Bearfolk, Beast, Burrowling, Telepathy' }),
  hezrou: Object.freeze({ realm:'lava', tokenId:3112, name:'Hezrou The Fiend of The Dungeon', size:'Colossal', alignment:'Lawful Good', actions:'Fiery Greatsword, Devour', ability:'Hellish Rejuvenation', weakness:'Light', locomotion:'Slither', language:"Can't understand language at all" }),
});
const bad = (message = 'Invalid progression request.') => Object.assign(new Error(message), { status: 400 });
const conflict = () => Object.assign(new Error('Profile changed. Reload and try again.'), { status: 409 });
const levels = Object.keys(LEVELS);
const emptyRanks = () => ({vitality:0,agility:0,bombRecharge:0});
export const emptyProfile = () => ({
  schemaVersion:3,revision:0,unlocked:['training'],unlockedHeroes:[...STARTER_HERO_IDS],
  checkpoints:Object.fromEntries(levels.map(level=>[level,Object.fromEntries(HERO_IDS.map(hero=>[hero,[]]))])),
  milestones:Object.fromEntries(levels.map(level=>[level,{}])),
  skills:Object.fromEntries(HERO_IDS.map(hero=>[hero,emptyRanks()])),
  perks:Object.fromEntries(HERO_IDS.map(hero=>[hero,[]])),
  equippedPerk:Object.fromEntries(HERO_IDS.map(hero=>[hero,null])),
  realmMastery:Object.fromEntries(HERO_IDS.map(hero=>[hero,[]])),classMastery:[],
  purchases:[],equips:[],
  monsters:Object.fromEntries(Object.keys(MONSTERS).map(kind=>[kind,{encountered:0,kills:0,counterKills:0}])),
});
const validRequestId = value => typeof value==='string' && /^[a-zA-Z0-9_-]{8,100}$/.test(value);
function deriveUnlocks(profile,oldUnlocked=[]) {
  const unlocked=new Set(['training']);
  for(const level of oldUnlocked)if(LEVELS[level])unlocked.add(level);
  const heroes=new Set(STARTER_HERO_IDS);
  const reached=(level,seconds)=>HERO_IDS.some(hero=>profile.checkpoints[level][hero].includes(`${level}-${seconds}`));
  if(reached('training',180))unlocked.add('forest');
  if(reached('training',300))heroes.add('warrior');
  if(reached('forest',300)){unlocked.add('desert');heroes.add('rogue');}
  if(reached('forest',420))heroes.add('tavern-keeper');
  if(reached('desert',420))unlocked.add('ice');
  if(reached('ice',540))unlocked.add('lava');
  profile.unlocked=levels.filter(level=>unlocked.has(level));
  profile.unlockedHeroes=HERO_IDS.filter(hero=>heroes.has(hero));
  for(const hero of HERO_IDS)profile.realmMastery[hero]=levels.filter(level=>profile.checkpoints[level][hero].includes(`${level}-720`));
  profile.classMastery=HERO_IDS.filter(hero=>profile.realmMastery[hero].includes('lava'));
  for(const level of levels)for(const hero of HERO_IDS)if(profile.checkpoints[level][hero].includes(CHECKPOINTS[level][0].checkpointId))profile.milestones[level][hero]=true;
}
export function normalizeProfile(value) {
  const result=emptyProfile();
  if(!value || typeof value!=='object' || ![2,3].includes(value.schemaVersion))return result;
  result.revision=Number.isSafeInteger(value.revision)&&value.revision>=0?value.revision:0;
  for(const level of levels)for(const hero of HERO_IDS){
    if(value.schemaVersion===2&&!['ranger','wizard','dwarf'].includes(hero))continue;
    const valid=new Set(CHECKPOINTS[level].map(row=>row.checkpointId));
    if(value.schemaVersion===3 && Array.isArray(value.checkpoints?.[level]?.[hero]))
      result.checkpoints[level][hero]=[...new Set(value.checkpoints[level][hero].filter(id=>valid.has(id)))];
    if(value.milestones?.[level]?.[hero] && !result.checkpoints[level][hero].includes(CHECKPOINTS[level][0].checkpointId))
      result.checkpoints[level][hero].unshift(CHECKPOINTS[level][0].checkpointId);
  }
  for(const hero of HERO_IDS)for(const skill of SKILLS){
    if(value.schemaVersion===2&&!['ranger','wizard','dwarf'].includes(hero))continue;
    const rank=value.skills?.[hero]?.[skill];
    result.skills[hero][skill]=Number.isSafeInteger(rank)&&rank>=0&&rank<=2?rank:0;
  }
  if(value.schemaVersion===3)for(const hero of HERO_IDS){
    const owned=value.perks?.[hero];
    if(Array.isArray(owned))result.perks[hero]=[...new Set(owned.filter(id=>!!perkFor(hero,id)))];
    const selected=value.equippedPerk?.[hero];
    if(result.perks[hero].includes(selected))result.equippedPerk[hero]=selected;
  }
  if(Array.isArray(value.purchases))result.purchases=value.purchases.filter(row=>
    HERO_IDS.includes(row?.hero)&&(value.schemaVersion===3||['ranger','wizard','dwarf'].includes(row?.hero))&&Number.isSafeInteger(row?.expectedRevision)&&row.expectedRevision>=0&&
    ((SKILLS.includes(row.skill)&&[1,2].includes(row.rank))||!!perkFor(row.hero,row.perkId))
  ).slice(-128).map(row=>({...row}));
  if(Array.isArray(value.equips))result.equips=value.equips.filter(row=>
    HERO_IDS.includes(row?.hero)&&validRequestId(row?.requestId)&&
    (row.perkId===null||!!perkFor(row.hero,row.perkId))
  ).slice(-128).map(row=>({...row}));
  for(const kind of Object.keys(MONSTERS))for(const field of ['encountered','kills','counterKills']){
    const n=value.monsters?.[kind]?.[field];result.monsters[kind][field]=Number.isSafeInteger(n)&&n>=0?n:0;
  }
  deriveUnlocks(result,Array.isArray(value.unlocked)?value.unlocked:[]);
  if(value.schemaVersion===3 && Array.isArray(value.unlockedHeroes))
    result.unlockedHeroes=HERO_IDS.filter(hero=>result.unlockedHeroes.includes(hero)||value.unlockedHeroes.includes(hero));
  return result;
}
export function credits(profile,hero){
  if(!HERO_IDS.includes(hero))return 0;
  const earned=levels.reduce((sum,level)=>sum+(profile.checkpoints?.[level]?.[hero]?.length||0),0);
  const spent=SKILLS.reduce((sum,skill)=>sum+(profile.skills?.[hero]?.[skill]||0),0)+3*(profile.perks?.[hero]?.length||0);
  return earned-spent;
}
export function nextCheckpoint(profile,hero,level){
  if(!HERO_IDS.includes(hero)||!LEVELS[level])return null;
  const claimed=new Set(profile.checkpoints?.[level]?.[hero]||[]);
  const next=CHECKPOINTS[level].find(item=>!claimed.has(item.checkpointId));
  return next?{...next}:null;
}
export function purchase(profile,hero,skill,expectedRevision,rank,requestId){
  if(!HERO_IDS.includes(hero)||!SKILLS.includes(skill)||!Number.isSafeInteger(expectedRevision)||expectedRevision<0||requestId!==undefined&&!validRequestId(requestId))throw bad();
  const prior=profile.purchases?.find(row=>requestId?row.requestId===requestId:row.hero===hero&&row.skill===skill&&row.rank===rank&&row.expectedRevision===expectedRevision);
  if(prior){if(prior.hero!==hero||prior.skill!==skill||rank!==undefined&&prior.rank!==rank||prior.expectedRevision!==expectedRevision)throw conflict();return normalizeProfile(profile);}
  if(profile.revision!==expectedRevision)throw conflict();
  const desiredRank=rank??profile.skills[hero][skill]+1;
  if(![1,2].includes(desiredRank)||profile.skills[hero][skill]!==desiredRank-1||credits(profile,hero)<1)throw bad('Earn a checkpoint credit before buying this skill.');
  const next=normalizeProfile(profile);next.skills[hero][skill]=desiredRank;
  next.purchases.push({hero,skill,rank:desiredRank,expectedRevision,...(requestId?{requestId}:{})});next.purchases=next.purchases.slice(-128);next.revision++;
  return next;
}
export function purchasePerk(profile,hero,perkId,expectedRevision,requestId){
  if(!HERO_IDS.includes(hero)||!perkFor(hero,perkId)||!Number.isSafeInteger(expectedRevision)||!validRequestId(requestId))throw bad();
  const prior=profile.purchases?.find(row=>row.requestId===requestId);
  if(prior){if(prior.hero!==hero||prior.perkId!==perkId||prior.expectedRevision!==expectedRevision)throw conflict();return normalizeProfile(profile);}
  if(profile.revision!==expectedRevision)throw conflict();
  if(profile.perks[hero].includes(perkId)||credits(profile,hero)<3)throw bad('Earn three checkpoint credits before buying this perk.');
  const next=normalizeProfile(profile);next.perks[hero].push(perkId);
  next.purchases.push({hero,perkId,expectedRevision,requestId,cost:3});next.purchases=next.purchases.slice(-128);next.revision++;
  return next;
}
export function equipPerk(profile,hero,perkId,expectedRevision,requestId){
  if(!HERO_IDS.includes(hero)||perkId!==null&&!perkFor(hero,perkId)||!Number.isSafeInteger(expectedRevision)||!validRequestId(requestId))throw bad();
  const prior=profile.equips?.find(row=>row.requestId===requestId);
  if(prior){if(prior.hero!==hero||prior.perkId!==perkId||prior.expectedRevision!==expectedRevision)throw conflict();return normalizeProfile(profile);}
  if(profile.revision!==expectedRevision)throw conflict();
  if(perkId!==null&&!profile.perks[hero].includes(perkId))throw bad('Buy the perk before equipping it.');
  const next=normalizeProfile(profile);next.equippedPerk[hero]=perkId;next.equips.push({hero,perkId,expectedRevision,requestId});next.equips=next.equips.slice(-128);next.revision++;
  return next;
}
export function monsterStage(record) {
  if (!record?.encountered) return 0;
  if (record.kills >= 25 && record.counterKills >= 1) return 4;
  if (record.counterKills >= 1) return 3;
  if (record.kills >= 5) return 2;
  return 1;
}
export function validateRunConfig(body,profile){
  if(body?.version!==RAID_VERSION||!HERO_IDS.includes(body.character)||!LEVELS[body.level]||
    !profile.unlocked.includes(body.level)||!profile.unlockedHeroes.includes(body.character))throw bad('Select an unlocked level and class.');
  const hero=body.character,selected=profile.equippedPerk[hero];
  return {version:RAID_VERSION,character:hero,level:body.level,skills:{...profile.skills[hero]},equippedPerk:selected||null,target:nextCheckpoint(profile,hero,body.level)};
}
export function validateMonsterProgress(value,previous={}){
  if(!value||typeof value!=='object'||Array.isArray(value))throw bad();
  const result={};
  for(const kind of Object.keys(MONSTERS)){
    const next=value[kind]??{encountered:0,kills:0,counterKills:0};
    const old=previous[kind]??{encountered:0,kills:0,counterKills:0};
    for(const field of ['encountered','kills','counterKills'])
      if(!Number.isSafeInteger(next[field])||next[field]<(old[field]||0)||next[field]>1000000)throw bad();
    if(next.counterKills>next.kills||next.kills>next.encountered)throw bad();
    result[kind]={encountered:next.encountered,kills:next.kills,counterKills:next.counterKills};
  }
  return result;
}
export function applyProgress(profile,config,progress,previous={}){
  if(!Number.isSafeInteger(progress?.durationMs)||progress.durationMs<(previous.durationMs||0))throw bad();
  const monsters=validateMonsterProgress(progress.monsters,previous.monsters);
  const allowed=config.level==='lava'?new Set(['forest','desert','ice','lava']):new Set([config.level]);
  if(Object.entries(monsters).some(([kind,row])=>!allowed.has(MONSTERS[kind].realm)&&(row.encountered||row.kills||row.counterKills)))throw bad();
  const kills=Object.values(monsters).reduce((n,row)=>n+row.kills,0);
  if(!Number.isSafeInteger(progress.kills)||progress.kills<(previous.kills||0)||kills>progress.kills)throw bad();
  const seconds=progress.durationMs/1000,maxKills=22+Math.ceil(seconds*480)+Math.ceil(seconds/90)+Math.ceil(seconds/36)+2+(config.version===RAID_VERSION&&seconds>=660?1:0);
  if(progress.kills>maxKills||Object.values(monsters).reduce((n,row)=>n+row.encountered,0)>maxKills+50)throw bad();
  const next=normalizeProfile(profile);
  const target=config.version===LEGACY_RAID_VERSION?CHECKPOINTS[config.level]?.[0]:config.target;
  if(target){
    const matching=CHECKPOINTS[config.level]?.find(item=>item.checkpointId===target.checkpointId&&item.thresholdMs===target.thresholdMs);
    if(!matching)throw bad('Invalid run checkpoint.');
    const claimed=next.checkpoints[config.level][config.character];
    if(progress.durationMs>=target.thresholdMs&&!claimed.includes(target.checkpointId)){
      claimed.push(target.checkpointId);next.revision++;deriveUnlocks(next,next.unlocked);
    }
  }
  for(const kind of Object.keys(MONSTERS))for(const field of ['encountered','kills','counterKills'])
    next.monsters[kind][field]+=monsters[kind][field]-(previous.monsters?.[kind]?.[field]||0);
  return {profile:next,progress:{durationMs:progress.durationMs,kills:progress.kills,monsters}};
}
