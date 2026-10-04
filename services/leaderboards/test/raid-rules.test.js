import {test} from 'node:test';
import assert from 'node:assert/strict';
import {emptyProfile,normalizeProfile,validateRunConfig,applyProgress,purchase,purchasePerk,equipPerk,credits,nextCheckpoint,monsterStage,MONSTERS,LEVELS,CHECKPOINTS,HERO_IDS,PERKS} from '../src/raid-rules.js';
const monsters=()=>Object.fromEntries(Object.keys(MONSTERS).map(kind=>[kind,{encountered:0,kills:0,counterKills:0}]));
const start=(profile,hero='ranger',level='training')=>validateRunConfig({version:'3',character:hero,level},profile);
const step=(profile,config,ms,previous={})=>applyProgress(profile,config,{durationMs:ms,kills:0,monsters:monsters()},previous);
test('five per-hero ladders hold fifteen immutable checkpoint opportunities',()=>{
  assert.deepEqual(Object.keys(LEVELS),['training','forest','desert','ice','lava']);
  assert.deepEqual(Object.values(CHECKPOINTS).map(rows=>rows.length),[5,4,3,2,1]);
  assert.deepEqual(HERO_IDS,['ranger','wizard','dwarf','warrior','tavern-keeper']);
  assert.equal(Object.values(CHECKPOINTS).flat().length,15);
  assert.equal(Object.values(PERKS).every(rows=>rows.length===3&&rows.every(row=>row.cost===3)),true);
});
test('one run grants its saved target once even after later milestones and a retry',()=>{
  let profile=emptyProfile();const first=start(profile);
  assert.deepEqual(first.target,{checkpointId:'training-180',thresholdMs:180000});
  const near=step(profile,first,179999);assert.equal(credits(near.profile,'ranger'),0);
  const reached=step(near.profile,first,180000,near.progress);profile=reached.profile;
  assert.deepEqual(profile.unlocked,['training','forest']);assert.equal(credits(profile,'ranger'),1);
  const continued=step(profile,first,720000,reached.progress);
  assert.deepEqual(continued.profile.checkpoints.training.ranger,['training-180']);
  assert.equal(continued.profile.revision,profile.revision);
  assert.deepEqual(nextCheckpoint(continued.profile,'ranger','training'),{checkpointId:'training-300',thresholdMs:300000});
  const second=start(continued.profile);assert.equal(second.target.checkpointId,'training-300');
  const oldRetry=step(continued.profile,first,720000,reached.progress);
  assert.deepEqual(oldRetry.profile.checkpoints.training.ranger,['training-180']);
});
test('account unlocks follow any hero, with 12-minute realm and Lava class mastery',()=>{
  let profile=emptyProfile();
  const grant=(hero,level,threshold)=>{
    const target=CHECKPOINTS[level].find(row=>row.thresholdMs===threshold);
    profile.checkpoints[level][hero].push(target.checkpointId);profile=normalizeProfile(profile);
  };
  grant('wizard','training',180000);assert.ok(profile.unlocked.includes('forest'));
  grant('wizard','training',300000);assert.ok(profile.unlockedHeroes.includes('warrior'));
  grant('warrior','forest',300000);assert.ok(profile.unlocked.includes('desert'));
  grant('warrior','forest',420000);assert.ok(profile.unlockedHeroes.includes('tavern-keeper'));
  grant('dwarf','desert',420000);assert.ok(profile.unlocked.includes('ice'));
  grant('ranger','ice',540000);assert.ok(profile.unlocked.includes('lava'));
  grant('tavern-keeper','lava',720000);assert.ok(profile.classMastery.includes('tavern-keeper'));
  grant('ranger','training',720000);assert.ok(profile.realmMastery.ranger.includes('training'));
});
test('v2 migration preserves original credits, skills, purchases, monsters, unlocks, and revision',()=>{
  const old={schemaVersion:2,revision:7,unlocked:['training','forest','desert','ice'],milestones:{training:{ranger:true},forest:{ranger:true},desert:{ranger:true},ice:{ranger:true}},skills:{ranger:{vitality:2,agility:1,bombRecharge:0}},purchases:[{hero:'ranger',skill:'vitality',rank:1,expectedRevision:1}],monsters:{chuul:{encountered:9,kills:5,counterKills:1}}};
  const profile=normalizeProfile(old);
  assert.equal(profile.schemaVersion,3);assert.equal(profile.revision,7);
  assert.deepEqual(profile.checkpoints.training.ranger,['training-180']);
  assert.deepEqual(profile.checkpoints.ice.ranger,['ice-540']);
  assert.equal(credits(profile,'ranger'),1);assert.equal(profile.skills.ranger.vitality,2);
  assert.equal(profile.purchases.length,1);assert.deepEqual(profile.monsters.chuul,{encountered:9,kills:5,counterKills:1});
  assert.ok(profile.unlocked.includes('lava'));assert.deepEqual(normalizeProfile(profile),profile);
});
test('fifteen credits fund six capped ranks and three owned perks, only one equipped',()=>{
  let profile=emptyProfile();for(const level of Object.keys(CHECKPOINTS))profile.checkpoints[level].ranger=CHECKPOINTS[level].map(row=>row.checkpointId);profile=normalizeProfile(profile);
  assert.equal(credits(profile,'ranger'),15);
  let sequence=0;for(const skill of ['vitality','agility','bombRecharge'])for(const rank of [1,2])profile=purchase(profile,'ranger',skill,profile.revision,rank,`rank-${++sequence}-ranger`);
  assert.equal(credits(profile,'ranger'),9);
  for(const perk of PERKS.ranger)profile=purchasePerk(profile,'ranger',perk.id,profile.revision,`perk-${++sequence}-ranger`);
  assert.equal(credits(profile,'ranger'),0);assert.equal(profile.perks.ranger.length,3);
  profile=equipPerk(profile,'ranger',PERKS.ranger[1].id,profile.revision,`equip-${++sequence}-ranger`);
  assert.equal(profile.equippedPerk.ranger,PERKS.ranger[1].id);
  const prior=profile;
  profile=equipPerk(profile,'ranger',PERKS.ranger[2].id,profile.revision,`equip-${++sequence}-ranger`);
  assert.equal(profile.equippedPerk.ranger,PERKS.ranger[2].id);
  assert.equal(credits(profile,'ranger'),0);
  assert.throws(()=>purchasePerk(profile,'ranger',PERKS.wizard[0].id,profile.revision,'wrong-hero-perk'));
  assert.equal(normalizeProfile(prior).equippedPerk.ranger,PERKS.ranger[1].id);
});
test('idempotent requests preserve revisions and conflict on reused IDs or stale revisions',()=>{
  let profile=emptyProfile();profile.checkpoints.training.ranger=['training-180','training-300','training-420'];profile=normalizeProfile(profile);
  const first=purchase(profile,'ranger','vitality',0,1,'purchase-00001');
  assert.equal(purchase(first,'ranger','vitality',0,1,'purchase-00001').revision,1);
  assert.throws(()=>purchase(first,'ranger','agility',0,1,'purchase-00001'),{status:409});
  assert.throws(()=>purchase(first,'ranger','agility',0,1,'purchase-00002'),{status:409});
  const perk=purchasePerk(profile,'ranger',PERKS.ranger[0].id,0,'perk-0000001');
  assert.equal(purchasePerk(perk,'ranger',PERKS.ranger[0].id,0,'perk-0000001').revision,1);
  const equipped=equipPerk(perk,'ranger',PERKS.ranger[0].id,1,'equip-000001');
  assert.equal(equipPerk(equipped,'ranger',PERKS.ranger[0].id,1,'equip-000001').revision,2);
  assert.throws(()=>equipPerk(equipped,'ranger',null,1,'equip-000001'),{status:409});
});
test('locked hero and realm cannot start; forged target and perk effects are ignored',()=>{
  const profile=emptyProfile();
  assert.throws(()=>start(profile,'warrior'));
  assert.throws(()=>start(profile,'ranger','lava'));
  const config=validateRunConfig({version:'3',character:'ranger',level:'training',target:{checkpointId:'training-720',thresholdMs:1},equippedPerk:'wizard-wide-nova',perkEffects:{bombHeal:999}},profile);
  assert.equal(config.target.checkpointId,'training-180');assert.equal(config.equippedPerk,null);
  assert.throws(()=>validateRunConfig({version:'2',character:'ranger',level:'training'},profile));
});
test('in-flight v2 progress earns only the original first milestone after migration',()=>{
  const config={version:'2',character:'ranger',level:'training',skills:{vitality:0,agility:0,bombRecharge:0}};
  const reached=step(emptyProfile(),config,720000);
  assert.deepEqual(reached.profile.checkpoints.training.ranger,['training-180']);
  assert.equal(credits(reached.profile,'ranger'),1);
});
test('Lava accepts native forest, desert, and ice monster records, but other realms stay scoped',()=>{
  const rows=monsters();rows.rageipede={encountered:1,kills:1,counterKills:0};rows.deathwisp={encountered:1,kills:1,counterKills:0};rows.chuul={encountered:1,kills:1,counterKills:0};
  const progress={durationMs:1000,kills:3,monsters:rows};
  assert.doesNotThrow(()=>applyProgress(emptyProfile(),{version:'3',character:'ranger',level:'lava',target:null},progress));
  assert.throws(()=>applyProgress(emptyProfile(),{version:'3',character:'ranger',level:'desert',target:null},progress));
});
test('monster discovery still uses observed kills and elemental counter kills',()=>{
  assert.equal(monsterStage({encountered:1,kills:0,counterKills:0}),1);
  assert.equal(monsterStage({encountered:5,kills:5,counterKills:0}),2);
  assert.equal(monsterStage({encountered:5,kills:5,counterKills:1}),3);
  assert.equal(monsterStage({encountered:25,kills:25,counterKills:1}),4);
});
