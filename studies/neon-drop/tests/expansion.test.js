import test from 'node:test';
import assert from 'node:assert/strict';
import {loadMeta,newRun,buyCabinet,selectCabinet,completeCabinet,enterOverdrive,addUpgrade,targetFor,randomCards,payout,applyScore,bankRun,finishRun} from '../src/state.js';
import {newChallenge} from '../src/challenge.js';
const meta=()=>loadMeta({getItem:()=>null},1000);
const cleared=()=>completeCabinet({...newRun(),round:3,status:'choose',totalTickets:3520,roundTickets:1800});
test('cabinet unlock purchase is permanent, affordable, and applies next run',()=>{
 let save={...meta(),chips:199};const active=newRun(save);
 assert.equal(buyCabinet(save,'double'),save);assert.equal(buyCabinet(save,'bogus'),save);
 save=buyCabinet({...save,chips:200},'double');assert.equal(save.chips,0);
 assert.deepEqual(save.cabinets,['classic','double']);assert.equal(active.cabinet,'classic');assert.equal(newRun(save).cabinet,'double');
 assert.equal(buyCabinet(save,'double'),save);assert.equal(newRun(selectCabinet(save,'classic')).cabinet,'classic');
 const reload=loadMeta({getItem:()=>JSON.stringify(save)},1000);assert.equal(reload.selectedCabinet,'double');
 const bad=loadMeta({getItem:()=>JSON.stringify({cabinets:['unknown'],selectedCabinet:'double',records:{classic:{tickets:-1,round:'bad'}}})},1000);
 assert.equal(bad.selectedCabinet,'classic');assert.deepEqual(bad.records.classic,{tickets:0,round:0});
});
test('fourth clear becomes a checkpoint, with explicit safe continuation',()=>{
 const run=cleared();assert.equal(run.status,'checkpoint');assert.equal(run.mastered,true);
 assert.equal(completeCabinet({...newRun(),status:'choose'}).mastered,false);
 assert.equal(enterOverdrive(newRun()).overdrive,false);
 const od=addUpgrade(enterOverdrive(run),'od-gain');assert.equal(od.round,4);assert.equal(od.status,'playing');assert.equal(targetFor(od),2250);
 assert.equal(targetFor({...od,round:5}),2813);
 for(let round=4;round<40;round++)assert.ok(targetFor({...od,round:round+1})>targetFor({...od,round}));
});
test('checkpoint and Overdrive banking pay differences and record a win once',()=>{
 let {run,meta:save}=bankRun(cleared(),meta(),1000);const chips=save.chips,tickets=save.totalTickets;
 assert.equal(save.wins,1);assert.equal(save.records.classic.round,4);
 ({run,meta:save}=bankRun(run,save,1000));assert.equal(save.chips,chips);assert.equal(save.totalTickets,tickets);assert.equal(save.wins,1);
 run=addUpgrade(enterOverdrive(run),'od-bank');run=applyScore(run,{kind:'score',value:100},'chrome');
 ({run,meta:save}=bankRun(run,save,1000));assert.equal(save.totalTickets,tickets+100);assert.equal(save.wins,1);
 const ended=finishRun({...run,status:'lost'},save,1000);assert.equal(ended.chips,save.chips);assert.equal(ended.totalTickets,save.totalTickets);assert.equal(ended.wins,1);
 const double=bankRun({...newRun(),cabinet:'double',totalTickets:999,status:'lost'},save).meta;
 assert.equal(double.records.double.tickets,999);assert.equal(double.records.classic.tickets,tickets+100);
});
test('repeatable Overdrive cards never exhaust and stack only for this run',()=>{
 let run=enterOverdrive(cleared());
 for(let i=0;i<30;i++)run=addUpgrade(run,['od-gain','od-bank','od-reserve'][i%3]);
 assert.equal(run.status,'playing');assert.equal(randomCards(run,()=>.5).length,3);
 assert.equal(run.drops,32);assert.equal(payout(run,{kind:'score',value:100},'chrome').amount,300);
 const score=applyScore(run,{kind:'score',value:10},'chrome');assert.equal(score.jackpot-run.jackpot,150);
 assert.equal(payout(newRun(),{kind:'score',value:100},'chrome').amount,100);
 assert.equal(newChallenge().drops,12);
});
test('Double Trouble charge boosts ordinary tickets only, Classic and free pockets remain unchanged',()=>{
 const run={...newRun(),cabinet:'double'};
 assert.equal(payout(run,{kind:'score',value:40,charged:true},'chrome').amount,50);
 assert.equal(payout(run,{kind:'score',value:40},'chrome').amount,40);
 assert.equal(payout(newRun(),{kind:'score',value:40,charged:true},'chrome').amount,40);
 assert.deepEqual(payout(run,{kind:'free',charged:true},'chrome'),{amount:0,free:2,jackpot:false});
 assert.equal(payout(run,{kind:'jackpot',charged:true},'chrome').amount,150);
});
