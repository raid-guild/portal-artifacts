import test from 'node:test';
import assert from 'node:assert/strict';
import {rollJackpotBonus,applyJackpotBonus,reservePaidDrop,refundPaidDrops,DEMO_JACKPOT,CINEMATIC_JACKPOTS} from '../src/jackpot.js';
import {newRun,applyScore,addUpgrade,loadMeta,buyCosmetic,equipCosmetic,bankRun,COSMETICS} from '../src/state.js';
import {newChallenge} from '../src/challenge.js';
import {ReleaseQueue} from '../src/release-queue.js';
import {NeonMachine} from '../src/game.js';

test('each casual jackpot gets three positive bounded rolls independent of its look',()=>{
  const stack=rollJackpotBonus(1000,()=>.66);
  assert.equal(stack.cards.length,3);assert.equal(stack.tickets,600);assert.equal(stack.drops,0);
  const encore=rollJackpotBonus(1000,()=>.8);assert.equal(encore.drops,3);assert.equal(encore.tickets,0);
  const charge=rollJackpotBonus(1000,()=>.95);assert.equal(charge.charge,300);
  for(const look of ['default',...CINEMATIC_JACKPOTS]){
    const run=applyScore(newRun(),{kind:'jackpot',label:'JP'},'chrome');
    const applied=applyJackpotBonus({...run,look},stack);
    assert.equal(applied.totalTickets,750);assert.equal(applied.roundTickets,750);
    assert.equal(applyJackpotBonus(applied,stack),applied,'one scoring event cannot award twice');
  }
});

test('jackpot tickets and chips bank once, and a cosmetic demo cannot mutate a run',()=>{
  const base=applyScore(newRun(),{kind:'jackpot',label:'JP'},'chrome');
  const bonus=rollJackpotBonus(1000,()=>.66);
  const awarded=applyJackpotBonus(base,bonus);
  const before=loadMeta({getItem:()=>null},1000);
  const first=bankRun(awarded,before,1100),second=bankRun(first.run,first.meta,1200);
  assert.equal(first.meta.totalTickets,750);assert.equal(second.meta.totalTickets,750);
  assert.equal(first.meta.chips,second.meta.chips);
  assert.deepEqual(DEMO_JACKPOT.cards.map(card=>card.amount),[45,1,90]);
  assert.equal(base.totalTickets,150,'preview data is separate from the saved run');
});

test('bonus drop reservations, queued refunds and round carry conserve encore balls',()=>{
  const bonus=rollJackpotBonus(150,()=>.8);
  let run=applyJackpotBonus(applyScore(newRun(),{kind:'jackpot',label:'JP'},'chrome'),bonus);
  assert.equal(run.encoreAvailable,3);assert.equal(run.drops,15);
  const queue=new ReleaseQueue();
  for(let i=0;i<2;i++){const reserved=reservePaidDrop(run);run=reserved.run;queue.enqueue('chrome',false,0,reserved.encore);}
  assert.equal(run.encoreAvailable,1);assert.equal(run.drops,13);
  const released=queue.flush(0,()=>true,()=>true);
  run=refundPaidDrops(run,[released]);assert.equal(run.encoreAvailable,2);assert.equal(run.drops,14,'physical miss restores the tagged encore');
  run=refundPaidDrops(run,queue.clear());assert.equal(run.encoreAvailable,3);assert.equal(run.drops,15,'queued cancellation restores its tag');
  assert.equal(queue.clear().length,0,'cancellation cannot refund twice');
  run={...run,status:'choose'};run=addUpgrade(run,'lucky');
  assert.equal(run.encoreAvailable,3);assert.equal(run.drops,15,'unspent encore carries into next round');
  const spent=reservePaidDrop(run);assert.equal(spent.encore,true);assert.equal(spent.run.encoreAvailable,2);
});

test('challenge rewards and fixed rules never enter the casual bonus path',()=>{
  const challenge=newChallenge();
  assert.equal(applyJackpotBonus({...challenge,lastScore:{jackpot:true},scores:1},rollJackpotBonus(150,()=>.66)).totalTickets,0);
  assert.equal(challenge.jackpot,150);assert.equal(challenge.drops,12);
});

test('an in-flight encore missed after round clear is restored before the next round',()=>{
  let run=applyJackpotBonus(applyScore(newRun(),{kind:'jackpot',label:'JP'},'chrome'),rollJackpotBonus(150,()=>.8));
  const reserved=reservePaidDrop(run);run=reserved.run;
  assert.equal(reserved.encore,true);assert.equal(run.encoreAvailable,2);
  run=applyScore(run,{kind:'score',value:50,label:'50'},'chrome');
  assert.equal(run.status,'choose');
  run=refundPaidDrops(run,[{free:false,encore:reserved.encore}]);
  assert.equal(run.encoreAvailable,3);
  run=addUpgrade(run,'lucky');
  assert.equal(run.drops,15);assert.equal(run.encoreAvailable,3);
});

test('two super looks unlock as ordinary cosmetics with no scoring effect',()=>{
  let meta={...loadMeta({getItem:()=>null},1000),chips:4000};
  assert.equal(COSMETICS.find(item=>item.id==='mega-party').cost,1600);
  assert.equal(COSMETICS.find(item=>item.id==='void-breaker').cost,2400);
  meta=buyCosmetic(meta,'mega-party');assert.equal(meta.equipped.jackpot,'mega-party');
  meta=buyCosmetic(meta,'void-breaker');assert.equal(meta.equipped.jackpot,'void-breaker');assert.equal(meta.chips,0);
  meta=equipCosmetic(meta,'mega-party','jackpot');assert.equal(meta.equipped.jackpot,'mega-party');
  assert.equal(loadMeta({getItem:()=>JSON.stringify({...meta,jackpotCinematics:false})},1000).jackpotCinematics,false);
});

test('cinematic renderer freezes game time and disposes its separate geometry',()=>{
  const machine=Object.create(NeonMachine.prototype);
  let renders=0;machine.container={clientWidth:900,clientHeight:600};machine.accumulator=.4;machine.playTime=12;machine.rotation=2;
  machine.renderer={render:()=>{renders++;}};machine.clock={getDelta:()=>0};
  machine.startJackpotCinematic('void-breaker',true);
  assert.equal(machine.accumulator,0);assert.ok(machine.jackpotCinematic);
  machine.step(.25);assert.equal(renders,1);assert.equal(machine.playTime,12);assert.equal(machine.rotation,2);
  machine.stopJackpotCinematic();assert.equal(machine.jackpotCinematic,null);assert.equal(machine.accumulator,0);
});
