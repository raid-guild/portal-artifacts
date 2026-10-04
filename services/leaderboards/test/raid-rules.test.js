import {test} from 'node:test';
import assert from 'node:assert/strict';
import {emptyProfile,normalizeProfile,validateRunConfig,applyProgress,purchase,credits,monsterStage,MONSTERS,LEVELS} from '../src/raid-rules.js';
const monsters=()=>Object.fromEntries(Object.keys(MONSTERS).map(kind=>[kind,{encountered:0,kills:0,counterKills:0}]));
const step=(profile,config,ms,previous={})=>applyProgress(profile,config,{durationMs:ms,kills:0,monsters:monsters()},previous);
test('Training and Forest grant first completion credits at exact active thresholds',()=>{
  const base=emptyProfile(),training=validateRunConfig({version:'2',character:'ranger',level:'training'},base);
  const before=step(base,training,179999);assert.equal(before.profile.unlocked.includes('forest'),false);assert.equal(credits(before.profile,'ranger'),0);
  const reached=step(before.profile,training,180000,before.progress);assert.deepEqual(reached.profile.unlocked,['training','forest']);assert.equal(credits(reached.profile,'ranger'),1);
  const repeat=step(reached.profile,training,180000,reached.progress);assert.equal(repeat.profile.revision,reached.profile.revision);assert.equal(credits(repeat.profile,'ranger'),1);
  const forest=validateRunConfig({version:'2',character:'ranger',level:'forest'},reached.profile);
  const near=step(reached.profile,forest,299999);assert.equal(near.profile.milestones.forest.ranger,undefined);
  const final=step(near.profile,forest,300000,near.progress);assert.equal(credits(final.profile,'ranger'),2);assert.equal(credits(final.profile,'wizard'),0);
});
test('class skills are one rank each, captured at run start, and repeated purchase is idempotent',()=>{
  const base=emptyProfile();base.milestones.training.ranger=true;base.unlocked.push('forest');base.revision=1;
  const config=validateRunConfig({version:'2',character:'ranger',level:'training'},base);
  const purchased=purchase(base,'ranger','vitality',1);assert.equal(purchased.skills.ranger.vitality,1);assert.equal(config.skills.vitality,0);
  assert.equal(purchase(purchased,'ranger','vitality',1).revision,purchased.revision);
  assert.throws(()=>purchase(purchased,'ranger','agility',1));
  assert.throws(()=>purchase(purchased,'ranger','vitality',2));
  assert.equal(normalizeProfile({...base,schemaVersion:1}).revision,0);
});
test('monster discovery advances with observed kills and elemental counter kills',()=>{
  assert.equal(monsterStage({encountered:1,kills:0,counterKills:0}),1);
  assert.equal(monsterStage({encountered:5,kills:5,counterKills:0}),2);
  assert.equal(monsterStage({encountered:5,kills:5,counterKills:1}),3);
  assert.equal(monsterStage({encountered:25,kills:25,counterKills:1}),4);
});
test('a completed Forest profile upgrades additively and unlocks Desert without another credit',()=>{
  const old=emptyProfile();delete old.milestones.desert;delete old.milestones.ice;delete old.monsters.chuul;delete old.monsters.buraq;
  old.milestones.training.ranger=true;old.milestones.forest.ranger=true;old.skills.ranger.vitality=1;old.revision=3;old.unlocked=['training','forest'];
  const migrated=normalizeProfile(old);
  assert.deepEqual(migrated.unlocked,['training','forest','desert']);assert.equal(credits(migrated,'ranger'),1);
  assert.deepEqual(migrated.monsters.chuul,{encountered:0,kills:0,counterKills:0});
  assert.throws(()=>validateRunConfig({version:'2',character:'ranger',level:'ice'},migrated));
});
test('Desert and Ice thresholds grant distinct credits and unlock the next realm exactly once',()=>{
  let profile=emptyProfile();profile.milestones.training.ranger=true;profile.milestones.forest.ranger=true;profile=normalizeProfile(profile);
  const desert=validateRunConfig({version:'2',character:'ranger',level:'desert'},profile);
  const before=step(profile,desert,419999);assert.equal(before.profile.unlocked.includes('ice'),false);
  const reached=step(before.profile,desert,420000,before.progress);assert.equal(credits(reached.profile,'ranger'),3);assert.equal(reached.profile.unlocked.includes('ice'),true);
  const again=step(reached.profile,desert,420000,reached.progress);assert.equal(again.profile.revision,reached.profile.revision);
  const ice=validateRunConfig({version:'2',character:'ranger',level:'ice'},reached.profile);
  const iceBefore=step(reached.profile,ice,539999);assert.equal(credits(iceBefore.profile,'ranger'),3);
  const iceDone=step(iceBefore.profile,ice,540000,iceBefore.progress);assert.equal(credits(iceDone.profile,'ranger'),4);
  assert.deepEqual(Object.keys(LEVELS),['training','forest','desert','ice']);
});
test('rank two purchases replay only their exact request tuple',()=>{
  let profile=emptyProfile();for(const level of Object.keys(LEVELS))profile.milestones[level].ranger=true;profile=normalizeProfile(profile);profile.revision=4;
  profile=purchase(profile,'ranger','vitality',4,1);assert.equal(profile.skills.ranger.vitality,1);
  const first=profile;profile=purchase(profile,'ranger','vitality',5,2);assert.equal(profile.skills.ranger.vitality,2);assert.equal(credits(profile,'ranger'),2);
  assert.equal(purchase(profile,'ranger','vitality',5,2).revision,6);
  assert.equal(purchase(profile,'ranger','vitality',4,1).revision,6);
  assert.throws(()=>purchase(profile,'ranger','agility',5,1));
  assert.throws(()=>purchase(first,'ranger','vitality',5,3));
});
test('monster progress is scoped to its realm while all records remain in each tally',()=>{
  let profile=emptyProfile();profile.milestones.training.ranger=true;profile.milestones.forest.ranger=true;profile=normalizeProfile(profile);
  const desert=validateRunConfig({version:'2',character:'ranger',level:'desert'},profile);
  const rows=monsters();rows.deathwisp={encountered:1,kills:1,counterKills:1};
  const allowed=applyProgress(profile,desert,{durationMs:1000,kills:1,monsters:rows});assert.equal(allowed.profile.monsters.deathwisp.counterKills,1);
  rows.chuul={encountered:1,kills:0,counterKills:0};assert.throws(()=>applyProgress(profile,desert,{durationMs:1000,kills:1,monsters:rows}));
});
