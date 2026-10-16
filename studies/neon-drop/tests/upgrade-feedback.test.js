import test from 'node:test';
import assert from 'node:assert/strict';
import {newRun,payout,UPGRADES} from '../src/state.js';
import {newChallenge} from '../src/challenge.js';
import {ordinaryAttribution,upgradeValue,newFeedbackStats,recordOrdinary,recordEcho,FeedbackBatcher,feedbackLines} from '../src/upgrade-feedback.js';
import {newSwitchboard} from '../src/switchboard.js';
import {ReleaseQueue} from '../src/release-queue.js';

test('every offered mutation shows concrete next-round values without changing the run',()=>{
  const run={...newRun(),status:'choose',encoreAvailable:3,powerLevels:{amplifier:0,reserve:2,jackpot:0}};
  const before=structuredClone(run);
  const expected={rim:'0% → +8%',capacitor:'+0 → +8',double:'0 → 1 EVERY 4',speed:'4 → 3.08s · LIFT 3.4 → 2.5s',lucky:'×1 → ×1.25',brake:'0.58 → 0.22',spark:'ORDINARY ×1 → ×2',reserve:'17 → 21', 'od-gain':'×1 → ×1.2','od-bank':'+0 → +15','od-reserve':'17 → 19'};
  for(const [id,text] of Object.entries(expected))assert.ok(upgradeValue(run,id).includes(text),`${id}: ${upgradeValue(run,id)}`);
  const withCap={...run,upgrades:['capacitor','od-bank','od-bank','od-reserve','od-gain','od-gain']};
  assert.ok(upgradeValue(withCap,'od-bank').includes('+38 → +53'));
  assert.ok(upgradeValue(withCap,'od-reserve').includes('19 → 21'));
  assert.ok(upgradeValue(withCap,'od-gain').includes('×1.4 → ×1.6'));
  assert.deepEqual(run,before);
});

test('Switchboard card values honor stack caps and show no value for an unavailable card',()=>{
  const board={...newRun(),cabinet:'switchboard',switchboard:newSwitchboard(),overdrive:true,status:'choose'};
  assert.ok(upgradeValue(board,'sw-fuse').includes('8 → 10s'));
  assert.ok(upgradeValue(board,'sw-overload').includes('4 → 5s'));
  assert.ok(upgradeValue(board,'sw-coil').includes('+3 → +4 pp'));
  for(const [id,cap] of [['sw-fuse',4],['sw-overload',4],['sw-coil',3]]){
    const near={...board,upgrades:Array(cap-1).fill(id)};
    assert.ok(upgradeValue(near,id));
    assert.equal(upgradeValue({...board,upgrades:Array(cap).fill(id)},id),'');
  }
  assert.equal(upgradeValue(newRun(),'sw-fuse'),'');
});

test('rounded ticket attribution telescopes to actual production payout across ball, power and cabinet multipliers',()=>{
  const hole={id:'inner-3',kind:'score',value:100,label:'100',charged:true};
  const run={...newRun(),cabinet:'double',powerLevels:{amplifier:4,reserve:0,jackpot:0},scores:4,upgrades:['rim','lucky','spark','od-gain','od-gain','capacitor','od-bank']};
  const before=structuredClone(run),result=ordinaryAttribution(run,hole,'rubber',7,12),actual=payout(run,hole,'rubber',7,12).amount;
  assert.equal(result.actual,actual);
  assert.equal(result.baseline+result.contributions.reduce((sum,item)=>sum+item.tickets,0),actual);
  assert.deepEqual(result.contributions.map(item=>item.id),['rim','lucky','spark','od-gain']);
  assert.equal(result.charge,23);
  assert.deepEqual(run,before);
  const heavy=ordinaryAttribution(run,hole,'heavy',0,12);assert.equal(heavy.actual,payout(run,hole,'heavy',0,12).amount);
  assert.equal(heavy.contributions.find(item=>item.id==='rim').tickets,0);
});

test('Switchboard expiry normalization, free pockets and jackpots keep attribution exact',()=>{
  const board={...newRun(),cabinet:'switchboard',switchboard:{...newSwitchboard(),channels:[20,20,20],levels:[2,2,2],overloadUntil:10},upgrades:['lucky']};
  const hole={id:'outer-0',kind:'score',value:25,label:'25'};
  const at=ordinaryAttribution(board,hole,'chrome',0,11);
  assert.equal(at.actual,Math.round(25*1.25));
  assert.equal(at.actual,at.baseline+at.contributions.reduce((sum,item)=>sum+item.tickets,0));
  assert.equal(ordinaryAttribution(board,{kind:'free'},'chrome'),null);
  assert.equal(ordinaryAttribution(board,{kind:'jackpot'},'chrome'),null);
  assert.equal(ordinaryAttribution(newChallenge(),hole,'chrome'),null);
});

test('stats record only actual ordinary contributions and successful echo releases',()=>{
  let stats=newFeedbackStats();const run={...newRun(),upgrades:['rim','lucky','capacitor']},hole={id:'outer-0',kind:'score',value:25};
  const result=ordinaryAttribution(run,hole,'chrome',2,1);
  stats=recordOrdinary(stats,result);assert.equal(stats.chargeAdded,8);
  assert.equal(Object.values(stats.tickets).reduce((sum,value)=>sum+value,0),result.actual-result.baseline);
  const queue=new ReleaseQueue();queue.enqueue('chrome',true,.42,false,'echo');
  assert.equal(queue.flush(.42,()=>true,()=>false),null);assert.equal(stats.echoesReleased,0);
  const released=queue.flush(.42,()=>true,()=>true);if(released.source==='echo')stats=recordEcho(stats);
  assert.equal(stats.echoesReleased,1);
  assert.equal(recordOrdinary(stats,null),stats);
  assert.equal(UPGRADES.find(u=>u.id==='double').title,'Echo chamber');
});

test('reset cancels a pending batch and a new award still flushes; extra labels sum tickets',()=>{
  const tasks=new Map(),shown=[];let next=1;
  const schedule=fn=>{const id=next++;tasks.set(id,fn);return id;},cancel=id=>tasks.delete(id);
  const batcher=new FeedbackBatcher(batch=>shown.push(feedbackLines(batch)),140,schedule,cancel);
  batcher.push({tickets:10});assert.equal(tasks.size,1);
  batcher.reset();assert.equal(tasks.size,0);
  batcher.push({tickets:100,charge:8,contributions:[{label:'RIMS',tickets:5},{label:'LUCKY',tickets:10},{label:'SPARK',tickets:20},{label:'GAIN',tickets:30}]});
  batcher.push({tickets:25,echoes:1});assert.equal(tasks.size,1);
  for(const fn of tasks.values())fn();tasks.clear();
  assert.equal(shown.length,1);
  assert.match(shown[0][0],/125 TICKETS/);
  assert.match(shown[0][1],/GAIN \+30/);
  assert.match(shown[0][2],/SPARK \+20/);
  assert.match(shown[0][2],/\+15 BUILD BONUS TIX/);
  assert.match(shown[0][2],/\+8 NEXT JP/);
  assert.match(shown[0][2],/\+1 ECHO/);
});

test('timer adapters are invoked without a FeedbackBatcher receiver',()=>{
  const tasks=new Map();let next=1;
  const schedule=function(fn){assert.equal(this,undefined);const id=next++;tasks.set(id,fn);return id;};
  const cancel=function(id){assert.equal(this,undefined);tasks.delete(id);};
  const batcher=new FeedbackBatcher(()=>{},140,schedule,cancel);
  batcher.push({tickets:1});assert.equal(tasks.size,1);
  batcher.reset();assert.equal(tasks.size,0);
});
