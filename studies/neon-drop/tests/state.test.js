import test from 'node:test';
import assert from 'node:assert/strict';
import { loadMeta, saveMeta, idleEarnings, newRun, payout, applyScore, addUpgrade, finishRun, targetFor, buyCosmetic, equipCosmetic } from '../src/state.js';

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
  assert.ok(after.chips>=20);assert.equal(after.wins,1);assert.equal(after.idleRate,2);assert.equal(after.idleAt,2000);
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
