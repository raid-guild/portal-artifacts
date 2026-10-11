import test from 'node:test';
import assert from 'node:assert/strict';
import { loadMeta, saveMeta, idleEarnings, newRun, payout, applyScore, addUpgrade, finishRun, targetFor, buyCosmetic, equipCosmetic, buyRadio, equipRadio, buyPower, POWER_UPGRADES, chipsForRun, jackpotBase } from '../src/state.js';
import {newChallenge,resolveChallenge} from '../src/challenge.js';

test('payouts retain physical outcome and apply selected build effects', () => {
  const run = newRun();
  const hole = { kind:'score', value:40, label:'40' };
  assert.equal(payout(run,hole,'chrome').amount,40);
  assert.equal(payout(run,hole,'heavy').amount,56);
  assert.equal(payout(run,hole,'rubber',5).amount,54);
  run.upgrades=['rim','lucky'];
  assert.equal(payout(run,hole,'chrome',5).amount,70);
  assert.equal(payout(run,{kind:'jackpot',label:'JP'},'chrome').amount,150);
});

test('free pockets grant exactly two drops and jackpot resets', () => {
  let run = newRun();run.drops=0;
  run=applyScore(run,{kind:'free',label:'+2'},'chrome');
  assert.equal(run.drops,2);assert.equal(run.totalTickets,0);
  run.jackpot=238;
  run=applyScore(run,{kind:'jackpot',label:'JP'},'chrome');
  assert.equal(run.totalTickets,238);assert.equal(run.jackpot,150);
  assert.equal(run.status,'choose');
});

test('round transition gives intended reserve and preserves total', () => {
  let run=newRun();run.totalTickets=500;run.status='choose';
  run=addUpgrade(run,'reserve');
  assert.equal(run.round,1);assert.equal(run.drops,16);assert.equal(run.totalTickets,500);assert.equal(run.roundTickets,0);assert.equal(targetFor(run),540);
  run=addUpgrade(run,'lucky');assert.equal(run.drops,16);
});

test('malformed save is sanitized and idle rewards are capped', () => {
  const storage={getItem:()=>JSON.stringify({chips:'oops',totalTickets:-20,bestRound:800,idleRate:100,style:'spoof',unlocked:['heavy','invalid'],purchased:['auto','oops'],idleAt:0})};
  const meta=loadMeta(storage,10*60*60*1000);
  assert.equal(meta.chips,0);assert.equal(meta.totalTickets,0);assert.equal(meta.bestRound,4);assert.equal(meta.idleRate,18);assert.equal(meta.style,'cyan');assert.deepEqual(meta.unlocked,['chrome','heavy']);
  assert.equal(idleEarnings(meta,10*60*60*1000),4*60*18);
});

test('completed run awards permanent chips and offline production', () => {
  const run=newRun();run.totalTickets=2500;run.round=3;run.status='won';
  const before=loadMeta({getItem:()=>null},1000);
  const after=finishRun(run,before,2000);
  assert.equal(after.chips,chipsForRun(run));assert.equal(after.wins,1);assert.equal(after.idleRate,2);assert.equal(after.idleAt,2000);assert.equal(after.bestRound,4);
});

test('legacy power levels default to zero and malformed levels are bounded',()=>{
  const legacy=loadMeta({getItem:()=>JSON.stringify({chips:42,unlocked:['heavy']})},1000);
  assert.deepEqual(legacy.powerLevels,{amplifier:0,reserve:0,jackpot:0});
  assert.equal(legacy.chips,42);assert.deepEqual(legacy.unlocked,['chrome','heavy']);
  const corrupt=loadMeta({getItem:()=>JSON.stringify({powerLevels:{amplifier:999,reserve:-4,jackpot:'6',injected:100}})},1000);
  assert.deepEqual(corrupt.powerLevels,{amplifier:8,reserve:0,jackpot:0});
});

test('permanent power has escalating prices, affordability and a hard cap',()=>{
  let meta={...loadMeta({getItem:()=>null},1000),chips:30};
  assert.equal(buyPower(meta,'reserve'),meta);
  assert.equal(buyPower(meta,'invalid'),meta);
  meta=buyPower(meta,'amplifier');assert.equal(meta.chips,0);assert.equal(meta.powerLevels.amplifier,1);
  assert.equal(buyPower(meta,'amplifier'),meta);
  meta={...meta,chips:2000};
  for(let i=1;i<8;i++)meta=buyPower(meta,'amplifier');
  assert.equal(meta.powerLevels.amplifier,8);assert.equal(meta.chips,2000-POWER_UPGRADES[0].costs.slice(1).reduce((sum,cost)=>sum+cost,0));
  assert.equal(buyPower(meta,'amplifier'),meta);
});

test('purchased levels apply only to a new run and add to reserve mutation',()=>{
  let meta={...loadMeta({getItem:()=>null},1000),chips:300};
  const active=newRun(meta);
  meta=buyPower(meta,'reserve');meta=buyPower(meta,'amplifier');meta=buyPower(meta,'jackpot');
  assert.deepEqual(active.powerLevels,{amplifier:0,reserve:0,jackpot:0});assert.equal(active.drops,12);assert.equal(active.jackpot,150);
  const next=newRun(meta);
  assert.deepEqual(next.powerLevels,{amplifier:1,reserve:1,jackpot:1});assert.equal(next.drops,13);assert.equal(next.jackpot,160);
  const second=addUpgrade({...next,status:'choose'},'reserve');
  assert.equal(second.drops,17);assert.equal(second.round,1);assert.equal(second.jackpot,260);
  assert.equal(addUpgrade({...second,status:'choose'},'lucky').drops,17);
});

test('amplifier pays ordinary pockets once after run modifiers, leaving free and jackpot distinct',()=>{
  const run=newRun({powerLevels:{amplifier:2,reserve:0,jackpot:1}});
  run.upgrades=['rim','lucky','spark'];run.scores=4;
  assert.equal(payout(run,{kind:'score',value:40},'heavy',5).amount,204);
  assert.deepEqual(payout(run,{kind:'free',label:'+2'},'chrome'),{amount:0,free:2,jackpot:false});
  assert.equal(payout(run,{kind:'jackpot',label:'JP'},'chrome').amount,160);
});

test('round jackpot base rises, carries a charged jackpot, and resets with permanent coil',()=>{
  let run=newRun({powerLevels:{amplifier:0,reserve:0,jackpot:2}});
  assert.equal(jackpotBase(run),170);
  run={...run,jackpot:225,status:'choose'};run=addUpgrade(run,'capacitor');
  assert.equal(run.jackpot,270);
  run=applyScore(run,{kind:'score',value:25,label:'25'},'chrome');assert.equal(run.jackpot,278);
  run=applyScore(run,{kind:'jackpot',label:'JP'},'chrome');assert.equal(run.jackpot,270);
  run={...run,jackpot:650,status:'choose'};run=addUpgrade(run,'rim');assert.equal(run.jackpot,650);
});

test('Arcade Challenge remains fixed regardless of permanent progression',()=>{
  const casual=newRun({powerLevels:{amplifier:8,reserve:3,jackpot:6}});
  assert.equal(casual.drops,15);assert.equal(casual.jackpot,210);
  let challenge=newChallenge();assert.equal(challenge.drops,12);assert.equal(challenge.jackpot,150);
  challenge={...challenge,drops:challenge.drops-1,dropped:1};
  challenge=resolveChallenge(challenge,'inner-3');assert.equal(challenge.totalTickets,100);
});

test('old saves keep purchases while cosmetic equipment is validated', () => {
  const storage={getItem:()=>JSON.stringify({chips:22,purchased:['auto','magenta'],unlocked:['rubber'],style:'magenta',cosmetics:['ion','echo','invalid'],equipped:{trail:'ion',impact:'ion',jackpot:'supernova'}})};
  const meta=loadMeta(storage,1000);
  assert.equal(meta.chips,22);assert.deepEqual(meta.purchased,['auto','magenta']);assert.deepEqual(meta.unlocked,['chrome','rubber']);
  assert.equal(meta.style,'magenta');assert.deepEqual(meta.cosmetics,['ion','echo']);
  assert.deepEqual(meta.equipped,{trail:'ion',impact:'default',jackpot:'default'});
});

test('cosmetics can be bought and equipped only when owned and affordable', () => {
  let saved=null;const storage={getItem:()=>saved,setItem:(_,value)=>{saved=value;}};
  let meta={...loadMeta(storage,1000),chips:70};
  assert.equal(equipCosmetic(meta,'helix','trail'),meta);
  assert.equal(buyCosmetic(meta,'supernova'),meta);
  meta=buyCosmetic(meta,'ion');assert.equal(meta.chips,58);assert.deepEqual(meta.cosmetics,['ion']);assert.equal(meta.equipped.trail,'ion');
  assert.equal(buyCosmetic(meta,'ion'),meta);
  meta=buyCosmetic(meta,'helix');assert.equal(meta.chips,3);assert.equal(meta.equipped.trail,'helix');
  assert.equal(equipCosmetic(meta,'helix','impact'),meta);
  meta=equipCosmetic(meta,'ion','trail');assert.equal(meta.equipped.trail,'ion');
  meta=equipCosmetic(meta,'default','trail');assert.equal(meta.equipped.trail,'default');
  saveMeta(meta,storage);assert.deepEqual(loadMeta(storage,1000).cosmetics,['ion','helix']);
});

test('legacy saves gain a free station without changing chips or cosmetics',()=>{
  const meta=loadMeta({getItem:()=>JSON.stringify({chips:22,cosmetics:['ion'],audio:{station:'starlight',owned:['spoof'],volume:8,playing:'yes'}})},1000);
  assert.equal(meta.chips,22);assert.deepEqual(meta.cosmetics,['ion']);
  assert.deepEqual(meta.audio,{station:'circuit',owned:['circuit'],musicVolume:1,effectsVolume:1,playing:false,muted:false});
});

test('old master volume migrates to two independent persisted controls',()=>{
  const storage={getItem:()=>JSON.stringify({audio:{volume:.3,station:'circuit',playing:true}})};
  const migrated=loadMeta(storage,1000);
  assert.equal(migrated.audio.musicVolume,.3);assert.equal(migrated.audio.effectsVolume,.3);
  assert.equal(migrated.audio.playing,true);
  const modern=loadMeta({getItem:()=>JSON.stringify({audio:{volume:.3,musicVolume:.8,effectsVolume:.1}})},1000);
  assert.equal(modern.audio.musicVolume,.8);assert.equal(modern.audio.effectsVolume,.1);
});

test('radio purchase and tuning require ownership and persist independent of effects',()=>{
  let saved=null;const storage={getItem:()=>saved,setItem:(_,value)=>{saved=value;}};
  let meta={...loadMeta(storage,1000),chips:60};
  assert.equal(equipRadio(meta,'glass'),meta);
  assert.equal(buyRadio(meta,'afterburn'),meta);
  meta=buyRadio(meta,'glass');assert.equal(meta.chips,15);assert.equal(meta.audio.station,'glass');
  assert.equal(buyRadio(meta,'glass'),meta);
  meta=equipRadio(meta,'circuit');assert.equal(meta.audio.station,'circuit');
  saveMeta(meta,storage);assert.equal(loadMeta(storage,1000).audio.station,'circuit');
});
