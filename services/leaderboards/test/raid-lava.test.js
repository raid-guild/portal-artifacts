import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {MONSTERS,emptyProfile,normalizeProfile,validateMonsterProgress,applyProgress,lavaBossSchedule} from '../src/raid-rules.js';
import {validateRaidFinish,validateV2RaidFinish} from '../src/raid-score.js';
const rows=()=>Object.fromEntries(Object.keys(MONSTERS).map(kind=>[kind,{encountered:0,kills:0,counterKills:0}]));
const config=level=>({version:'3',character:'ranger',level,target:null});
test('Lava NFT records match the selected cached chain export sheets exactly',()=>{
  assert.deepEqual(MONSTERS.tosculi,{realm:'lava',tokenId:3015,name:'Tosculi Hive-Queen The Swarm of Tiny Undead of The Dungeon',size:'Tiny',alignment:'Neutral Evil',actions:'Flame Breath, Breath Weapon',ability:'Sure-Footed',weakness:'Freeze',locomotion:'Leap',language:'Dragon, Abberation, Merfolk, Simian'});
  assert.deepEqual(MONSTERS.seahag,{realm:'lava',tokenId:5413,name:'Sea Hag The Kryt of The Desert',size:'Stout',alignment:'Lawful Neutral',actions:'Poison Breath, Flame Breath',ability:'Sure-Footed',weakness:'Freeze',locomotion:'Leap',language:'Bearfolk, Beast, Burrowling, Telepathy'});
  assert.deepEqual(MONSTERS.hezrou,{realm:'lava',tokenId:3112,name:'Hezrou The Fiend of The Dungeon',size:'Colossal',alignment:'Lawful Good',actions:'Fiery Greatsword, Devour',ability:'Hellish Rejuvenation',weakness:'Light',locomotion:'Slither',language:"Can't understand language at all"});
});
test('published provenance sheet lines agree with every shared Lava monster field',async()=>{
  const document=JSON.parse(await readFile(new URL('../../../studies/raid-survivor/public/lava-monstermaps-sheets.json',import.meta.url),'utf8'));
  assert.equal(document.chainId,1);assert.equal(document.blockNumber,26114270);
  assert.equal(document.contract,'0xecb9b2ea457740fbde58c758e4c574834224413e');
  for(const [kind,tokenId] of [['tosculi',3015],['seahag',5413],['hezrou',3112]]){
    const monster=MONSTERS[kind],sheet=document.monsters.find(row=>row.tokenId===tokenId);
    assert.ok(sheet,kind);
    assert.deepEqual(sheet.lines,[monster.name,`Size: ${monster.size}`,`Alignment: ${monster.alignment}`,
      `Actions: ${monster.actions}`,`Special Ability: ${monster.ability}`,`Weakness: ${monster.weakness}`,
      `Locomotion: ${monster.locomotion}`,`Language: ${monster.language}`]);
  }
});
test('new profiles zero Lava tallies; older profiles and payloads missing the new keys normalize safely',()=>{
  const profile=emptyProfile();for(const kind of ['tosculi','seahag','hezrou'])assert.deepEqual(profile.monsters[kind],{encountered:0,kills:0,counterKills:0});
  const old=structuredClone(profile);for(const kind of ['tosculi','seahag','hezrou'])delete old.monsters[kind];
  const migrated=normalizeProfile(old);for(const kind of ['tosculi','seahag','hezrou'])assert.deepEqual(migrated.monsters[kind],{encountered:0,kills:0,counterKills:0});
  const payload=rows();for(const kind of ['tosculi','seahag','hezrou'])delete payload[kind];
  const accepted=validateMonsterProgress(payload);for(const kind of ['tosculi','seahag','hezrou'])assert.deepEqual(accepted[kind],{encountered:0,kills:0,counterKills:0});
  payload.rageipede={encountered:2,kills:1,counterKills:0};
  const prior={durationMs:1000,kills:1,monsters:structuredClone(payload)};
  const continued=applyProgress(migrated,config('lava'),{durationMs:2000,kills:1,monsters:payload},prior);
  assert.equal(continued.profile.monsters.rageipede.kills,0,'unchanged prior tally is not added again');
  for(const kind of ['tosculi','seahag','hezrou'])assert.deepEqual(continued.progress.monsters[kind],{encountered:0,kills:0,counterKills:0});
});
test('Lava-native records are accepted only in Lava; existing imported records stay valid there',()=>{
  for(const kind of ['tosculi','seahag','hezrou']){
    const monsters=rows();monsters[kind]={encountered:1,kills:1,counterKills:0};
    assert.doesNotThrow(()=>applyProgress(emptyProfile(),config('lava'),{durationMs:1000,kills:1,monsters}));
    for(const level of ['training','forest','desert','ice'])assert.throws(()=>applyProgress(emptyProfile(),config(level),{durationMs:1000,kills:1,monsters}),{status:400});
  }
  const monsters=rows();for(const kind of ['rageipede','deathwisp','chuul'])monsters[kind]={encountered:1,kills:1,counterKills:0};
  assert.doesNotThrow(()=>applyProgress(emptyProfile(),config('lava'),{durationMs:1000,kills:3,monsters}));
});
test('pure Lava boss schedule includes four timed waves and repeating endless waves',()=>{
  for(const [seconds,expected] of [
    [0,[0,0,0,0]],[299.999,[0,0,0,0]],[300,[1,1,1,1]],[479.999,[1,1,1,1]],
    [480,[2,2,2,3]],[600,[3,2,2,5]],[659.999,[3,2,2,5]],
    [660,[4,3,3,8]],[779.999,[4,3,3,8]],[780,[5,3,3,11]],
    [900,[6,3,3,14]],[1020,[7,3,3,17]],
  ]){
    const stage=lavaBossSchedule(seconds);
    assert.deepEqual([stage.wave,stage.desiredAlive,stage.tier,stage.maxAdmitted],expected,`${seconds}s`);
  }
});
test('Lava scoring accepts legal 8, 11, 13, 17 boss kills and conservative boss chests',()=>{
  for(const [seconds,bosses] of [[660,8],[780,11],[900,13],[1020,17]]){
    const maxBosses=lavaBossSchedule(seconds).maxAdmitted;
    const chests=2+Math.floor(seconds/45)+maxBosses;
    const body={version:'3',character:'ranger',level:'lava',durationMs:seconds*1000,stats:{kills:bosses,elites:0,bosses,chests,level:1}};
    assert.doesNotThrow(()=>validateRaidFinish(body,seconds*1000),`${seconds}s legal bosses/chests`);
    assert.throws(()=>validateRaidFinish({...body,stats:{...body.stats,bosses:maxBosses+1,kills:maxBosses+1}},seconds*1000),{status:400});
    assert.throws(()=>validateRaidFinish({...body,stats:{...body.stats,chests:chests+1}},seconds*1000),{status:400});
  }
  const early={version:'3',character:'ranger',level:'lava',durationMs:659999,stats:{kills:8,elites:0,bosses:8,chests:0,level:1}};
  assert.throws(()=>validateRaidFinish(early,660000),{status:400});
});
test('existing realm and v2 boss/chest validation remains unchanged',()=>{
  const base={version:'3',character:'ranger',level:'ice',durationMs:660000,stats:{kills:8,elites:0,bosses:8,chests:25,level:1}};
  assert.throws(()=>validateRaidFinish(base,660000),{status:400});
  assert.doesNotThrow(()=>validateRaidFinish({...base,stats:{...base.stats,chests:24}},660000));
  assert.throws(()=>validateV2RaidFinish({...base,version:'2',stats:{...base.stats,chests:24}},660000),{status:400});
});
