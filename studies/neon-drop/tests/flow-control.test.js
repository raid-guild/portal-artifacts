import test from 'node:test';
import assert from 'node:assert/strict';
import {FlowCountdown,canSkipRound,preserveEncoreOnSkip} from '../src/flow-control.js';
import {newRun,loadMeta,applyScore} from '../src/state.js';
import {newChallenge} from '../src/challenge.js';

test('foreground countdown chooses one of exactly the offered cards once',()=>{
  const chosen=[],clock=new FlowCountdown(10),token=clock.start('upgrade',['rim','lucky','reserve'],id=>chosen.push(id));
  for(let i=0;i<80;i++)clock.tick(.25,false,()=>.99);
  assert.equal(clock.remaining,10);
  clock.tick(9.75,true,()=>.99);assert.equal(chosen.length,0);
  clock.tick(.25,true,()=>.99);assert.deepEqual(chosen,['reserve']);
  assert.equal(clock.choose('rim',token),false);
  clock.tick(20,true,()=>0);assert.deepEqual(chosen,['reserve']);
});

test('manual choice and cancellation reject stale or unoffered choices',()=>{
  const chosen=[],clock=new FlowCountdown();
  const old=clock.start('upgrade',['rim','lucky'],id=>chosen.push(id));
  assert.equal(clock.choose('speed',old),false);
  clock.cancel();assert.equal(clock.choose('rim',old),false);
  const fresh=clock.start('checkpoint',['enter'],id=>chosen.push(id));
  assert.equal(clock.choose('enter',old),false);
  assert.equal(clock.choose('enter',fresh),true);
  assert.deepEqual(chosen,['enter']);
});

test('owned auto starts each casual run enabled; challenge and manual run toggles stay separate',()=>{
  const meta=loadMeta({getItem:()=>JSON.stringify({purchased:['auto']})},1000);
  const run=newRun(meta);assert.equal(run.auto,true);
  run.auto=false;assert.equal(run.auto,false);
  assert.equal(newRun(meta).auto,true);
  assert.equal(newRun().auto,false);
  assert.equal(newChallenge().auto,false);
});

test('round skip eligibility never changes tickets, drops or encore rewards',()=>{
  const scored=applyScore(newRun(),{kind:'score',value:200,label:'200'},'chrome');
  const run={...scored,encoreAvailable:2,drops:7};
  assert.equal(canSkipRound(run),true);
  assert.equal(canSkipRound(run,{show:true}),false);
  assert.equal(canSkipRound(run,{modal:true}),false);
  assert.equal(canSkipRound(run,{blocked:true}),false);
  assert.equal(canSkipRound(run,{mode:'challenge'}),false);
  assert.deepEqual([run.roundTickets,run.totalTickets,run.drops,run.encoreAvailable],[200,200,7,2]);
  const kept=preserveEncoreOnSkip(run,[{free:false,encore:true},{free:false,encore:false}],[{free:false,encore:true},{free:true,encore:false}]);
  assert.deepEqual([kept.roundTickets,kept.totalTickets,kept.drops,kept.encoreAvailable],[200,200,7,4]);
});
