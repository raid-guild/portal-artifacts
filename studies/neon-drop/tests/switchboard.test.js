import test from 'node:test';
import assert from 'node:assert/strict';
import * as RAPIER from '@dimforge/rapier3d-compat/rapier.es.js';
import {CABINETS,UPGRADES,SWITCH_UPGRADES,loadMeta,newRun,buyCabinet,applyScore,addUpgrade,payout,randomCards} from '../src/state.js';
import {createSwitchBumper,ballColliderDesc,DECK_Y} from '../src/game.js';
import {SWITCH_POSITIONS,newSwitchboard,hitSwitch,expireSwitchboard,pocketChannel,switchMultiplier} from '../src/switchboard.js';
import {rollJackpotBonus} from '../src/jackpot.js';
import {newChallenge} from '../src/challenge.js';

const meta=()=>({...loadMeta({getItem:()=>null},1000),chips:1500});
const run=()=>newRun({...meta(),cabinets:['classic','switchboard'],selectedCabinet:'switchboard'});

test('catalog and legacy save sanitize ownership and selection',()=>{
  assert.equal(CABINETS.find(c=>c.id==='switchboard').cost,1200);
  const bought=buyCabinet(meta(),'switchboard');assert.equal(bought.chips,300);assert.equal(bought.selectedCabinet,'switchboard');
  const stored=loadMeta({getItem:()=>JSON.stringify(bought)},1000);assert.equal(stored.selectedCabinet,'switchboard');assert.ok(stored.cabinets.includes('switchboard'));
  const forged=loadMeta({getItem:()=>JSON.stringify({selectedCabinet:'switchboard'})},1000);assert.equal(forged.selectedCabinet,'classic');
  assert.equal(newRun(forged).cabinet,'classic');
});

test('three collision starts charge channels, gate repeats, and cap reactor',()=>{
  let r=run();const first=hitSwitch(r,0,11,1);assert.equal(first.hit,true);r=first.run;
  assert.equal(r.switchboard.reactor,3);assert.equal(switchMultiplier(r,{kind:'score',id:'outer-0'},1.01),1.5);
  assert.equal(hitSwitch(r,0,11,1.2).hit,false,'same ball/switch cooldown');
  assert.equal(hitSwitch(r,0,12,1.05).hit,false,'switchwide cooldown');
  r=hitSwitch(r,0,12,1.2).run;assert.equal(switchMultiplier(r,{kind:'score',id:'outer-0'},1.21),2);
  r=hitSwitch(r,1,13,1.4).run;const completed=hitSwitch(r,2,14,1.6);r=completed.run;
  assert.equal(completed.overload,true);assert.equal(switchMultiplier(r,{kind:'score',id:'outer-0'},1.61),4);
  const until=r.switchboard.overloadUntil;r=hitSwitch(r,0,15,1.8).run;assert.equal(r.switchboard.overloadUntil,until,'hits cannot extend overload');
  assert.equal(expireSwitchboard(r,until).switchboard.channels.every(x=>x===0),true);
  for(let i=0;i<30;i++)r=hitSwitch(r,i%3,100+i,10+i*.2).run;
  assert.equal(r.switchboard.reactor,50);
  assert.equal(pocketChannel('inner-5'),2);assert.equal(pocketChannel('jackpot'),-1);
});

test('switchboard mutations cap, round clears buffs, reactor survives until one jackpot',()=>{
  let r=run();r=hitSwitch(r,0,1,1).run;r=hitSwitch(r,1,2,1.2).run;r=hitSwitch(r,2,3,1.4).run;
  const before=r.switchboard.reactor;
  r=addUpgrade({...r,status:'choose'},'sw-fuse');
  assert.deepEqual(r.switchboard.channels,[0,0,0]);assert.equal(r.switchboard.reactor,before);
  assert.equal(r.upgrades.includes('sw-fuse'),true);
  const regular=randomCards(r,()=>.5);assert.ok(!regular.some(c=>c.id==='sw-fuse'));
  assert.ok(SWITCH_UPGRADES.every(u=>u.max<=6));
  r={...r,overdrive:true,upgrades:[...UPGRADES.map(u=>u.id),...SWITCH_UPGRADES.map(u=>u.id)]};assert.ok(randomCards(r,()=>.5).some(c=>c.id==='sw-fuse'));
  const capped={...r,upgrades:[...r.upgrades,'sw-coil','sw-coil']};assert.equal(addUpgrade(capped,'sw-coil'),capped);
  r=hitSwitch(r,0,4,2).run;
  const jackpot=payout(r,{kind:'jackpot',id:'jackpot'},'chrome',0,2.1);
  assert.equal(jackpot.baseJackpot,r.jackpot);assert.equal(jackpot.reactorBoost,Math.round(r.jackpot*r.switchboard.reactor/100));
  const bonus=rollJackpotBonus(jackpot.amount,()=>.66);assert.equal(bonus.base,jackpot.amount);
  const scored=applyScore(r,{kind:'jackpot',id:'jackpot',label:'JP'},'chrome',0,2.1);
  assert.equal(scored.switchboard.reactor,0);assert.equal(scored.lastScore.amount,jackpot.amount);
  assert.equal(applyScore(scored,{kind:'jackpot',id:'jackpot',label:'JP'},'chrome',0,2.2).lastScore.reactorBoost,0);
  assert.equal(newRun({...meta(),cabinets:['classic','switchboard'],selectedCabinet:'switchboard'}).switchboard.reactor,0);
});

test('fixed challenge and other cabinets never receive switchboard scoring',()=>{
  const challenge=newChallenge(),ordinary=newRun();
  assert.equal(hitSwitch(challenge,0,1,1).hit,false);
  assert.equal(hitSwitch(ordinary,0,1,1).hit,false);
  assert.equal(switchMultiplier(ordinary,{kind:'score',id:'outer-0'},1),1);
  assert.equal(challenge.totalTickets,0);
});

test('production Rapier bumper produces a start event once and disables outside Switchboard',async()=>{
  await RAPIER.init();const p=SWITCH_POSITIONS[0],world=new RAPIER.World({x:0,y:0,z:0});world.timestep=1/120;
  const bumper=createSwitchBumper(world,0),events=new RAPIER.EventQueue(true);
  const body=world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(p.x+1,DECK_Y+.6,p.z).setLinvel(-6,0,0).setCcdEnabled(true));
  const ball=world.createCollider(ballColliderDesc('chrome'),body);let starts=0;
  for(let i=0;i<100;i++){world.step(events);events.drainCollisionEvents((a,b,started)=>{if(started&&[a,b].includes(bumper.collider.handle)&&[a,b].includes(ball.handle))starts++;});}
  assert.equal(starts,1,'contact start, not continuous resting force');
  bumper.body.setEnabled(false);body.setTranslation({x:p.x+1,y:DECK_Y+.6,z:p.z},true);body.setLinvel({x:-6,y:0,z:0},true);
  for(let i=0;i<100;i++){world.step(events);events.drainCollisionEvents((a,b,started)=>{if(started&&[a,b].includes(bumper.collider.handle))starts++;});}
  assert.equal(starts,1,'other cabinets have no active bumper contacts');world.free();events.free();
});
