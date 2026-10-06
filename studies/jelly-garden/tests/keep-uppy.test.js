import test from 'node:test';
import assert from 'node:assert/strict';
import {KeepUppy,SCORE_KEY,formatTime} from '../src/keep-uppy.js';
import {BounceMotion} from '../src/motion.js';

const makeStorage=()=>{const data=new Map();return {data,getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,value)}};
const airborne=()=>({grounded:false,contactSequence:0,clearance:.2});
const tick=(round,dt=1/60)=>round.tick(dt,p=>p.clearance);

test('a team round arms after every body clears, counts accepted bounces, and ends on any contact',()=>{
  const store=makeStorage(),round=new KeepUppy(store),team=[airborne(),airborne(),airborne()];
  team[1].clearance=0;
  round.start('garden',team);
  assert.equal(round.bounce(team[0]),true);
  assert.equal(round.bounce(airborne()),false);
  tick(round);assert.equal(round.phase,'armed');assert.equal(round.time,0);
  team[1].clearance=.03;tick(round);assert.equal(round.phase,'running');assert.equal(round.time,0);
  for(let i=0;i<60;i++)tick(round);
  assert.ok(Math.abs(round.time-1)<1e-10);
  team[2].contactSequence++;
  const loss=tick(round);
  assert.equal(loss.landed,team[2]);assert.equal(loss.result.clicks,1);
  assert.ok(Math.abs(loss.result.time-1)<1e-10);
  assert.equal(round.time,0);assert.equal(round.clicks,0);
  assert.equal(tick(round),null);assert.equal(round.bounce(team[0]),false);
  assert.deepEqual(round.best.garden,loss.result);
  assert.equal(JSON.parse(store.data.get(SCORE_KEY)).version,1);
});

test('tiny touchdown is scored even when the visible bounce threshold is not reached',()=>{
  const motion=new BounceMotion(.99,1),round=new KeepUppy();
  motion.grounded=false;motion.comVelocity=-.001;
  round.start('raidguild',[motion]);
  round.tick(1/60,()=>.2);
  assert.equal(round.phase,'running');
  const impact=motion.beforeShape(1,0,0,1,0);
  assert.ok(impact<.001);
  assert.equal(motion.touchdowns,0);
  assert.equal(motion.contactSequence,1);
  assert.equal(round.tick(1/60,()=>0).landed,motion);
});

test('cancel, pause, mode scores, restart, and corrupt persistence remain independent',()=>{
  const store=makeStorage(),round=new KeepUppy(store),logo=airborne();
  round.start('raidguild',[logo]);tick(round);
  for(let i=0;i<120;i++)tick(round);
  assert.ok(Math.abs(round.time-2)<1e-10);
  // Pausing means the render loop does not call tick.
  assert.ok(Math.abs(round.time-2)<1e-10);
  logo.contactSequence++;tick(round);
  const best=round.best.raidguild;
  assert.ok(best.time>1.9);
  round.start('garden',[airborne(),airborne(),airborne()]);
  assert.equal(round.time,0);assert.equal(round.clicks,0);
  round.cancel();assert.equal(round.phase,'idle');assert.deepEqual(round.best.raidguild,best);
  const reloaded=new KeepUppy(store);assert.deepEqual(reloaded.best.raidguild,best);assert.equal(reloaded.best.garden,null);
  store.data.set(SCORE_KEY,'{"version":1,"raidguild":{"time":-1,"clicks":9},"garden":{"time":3,"clicks":-1}}');
  const corrupt=new KeepUppy(store);assert.equal(corrupt.best.raidguild,null);assert.equal(corrupt.best.garden,null);
  const blocked=new KeepUppy({getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}});
  blocked.start('raidguild',[logo]);assert.equal(blocked.phase,'armed');
  assert.equal(formatTime(62.34),'1:02.3');
});
