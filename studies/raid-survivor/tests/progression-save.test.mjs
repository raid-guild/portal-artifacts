import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';

const result=await build({entryPoints:['src/progression-save.ts'],bundle:true,platform:'node',format:'esm',write:false,absWorkingDir:process.cwd()});
const {CheckpointSender,canApplyAccountProfile,newerProfile,guestProfileState,portalProfileResponse}=await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
const snapshot=durationMs=>({durationMs,kills:0,monsters:{}});
const okay=data=>new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}});

test('temporary 503, 429, and network errors retry one cumulative checkpoint until acknowledged',async()=>{
  let calls=0;const acks=[];const states=[];
  const sender=new CheckpointSender(async body=>{calls++;if(calls===1)throw Error('offline');if(calls===2)return new Response('',{status:503});if(calls===3)return new Response('',{status:429});return okay({profile:{revision:1},progress:body});},data=>acks.push(data.progress.durationMs),state=>states.push(state),async()=>{});
  await sender.offer(snapshot(180000));
  assert.equal(sender.acknowledgedMs,0);assert.equal(sender.status,'retrying');
  await sender.offer(snapshot(180001));
  assert.equal(sender.acknowledgedMs,180001);assert.deepEqual(acks,[180001]);assert.equal(calls,4);
  assert.ok(states.includes('retrying'));
});

test('checkpoint sender coalesces newer progress while a prior save is in flight',async()=>{
  let release;const posts=[];const acks=[];
  const sender=new CheckpointSender(async body=>{posts.push(body.durationMs);if(posts.length===1)await new Promise(resolve=>{release=resolve;});return okay({profile:{revision:1},progress:body});},data=>acks.push(data.progress.durationMs));
  const first=sender.offer(snapshot(15000));sender.offer(snapshot(20000));sender.offer(snapshot(30000));release();await first;
  assert.deepEqual(posts,[15000,30000]);assert.deepEqual(acks,[15000,30000]);assert.equal(sender.acknowledgedMs,30000);
});

test('a finish can recover a failed milestone checkpoint without an app reload',async()=>{
  let calls=0,profile={revision:0,unlocked:['training']};
  const sender=new CheckpointSender(async body=>{calls++;if(calls<=3)return new Response('',{status:503});profile={revision:1,unlocked:['training','forest']};return okay({profile,progress:body});},data=>{profile=data.profile;},()=>{},async()=>{});
  await sender.offer(snapshot(180000));assert.equal(sender.acknowledgedMs,0);
  await sender.offer(snapshot(181000));assert.equal(sender.acknowledgedMs,181000);assert.deepEqual(profile.unlocked,['training','forest']);
});

test('account isolation, stale profile protection, and guest separation',()=>{
  assert.equal(canApplyAccountProfile('7','8',true),false);assert.equal(canApplyAccountProfile('7','7',false),false);assert.equal(canApplyAccountProfile('7','7',true),true);
  const known={revision:2,monsters:{rageipede:{kills:25,encountered:30,counterKills:2}}};
  assert.equal(newerProfile(known,{revision:1,monsters:{rageipede:{kills:0,encountered:0,counterKills:0}}}),known);
  const next=newerProfile(known,{revision:2,monsters:{rageipede:{kills:24,encountered:29,counterKills:1}}});
  assert.equal(next.monsters.rageipede.kills,25);
});

test('stopped run ignores a late checkpoint response after account or run change',async()=>{
  let release;let applied=false;
  const sender=new CheckpointSender(async body=>{await new Promise(resolve=>{release=resolve;});return okay({profile:{revision:1},progress:body});},()=>{applied=true;});
  const pending=sender.offer(snapshot(180000));sender.stop();release();await pending;
  assert.equal(applied,false);assert.equal(sender.acknowledgedMs,0);
});

test('late mastery reply from a previous Portal account cannot replace the active account profile',async()=>{
  const oldAccount='7',activeAccount='8';
  const active={revision:3,monsters:{rageipede:{kills:20}}};
  const oldReply={revision:9,monsters:{rageipede:{kills:100}}};
  const applied=portalProfileResponse(oldAccount,activeAccount,true,activeAccount,active,oldReply);
  assert.equal(applied,null);
  assert.equal(active.revision,3);
});

test('guest fallback clears Portal association before relinking the same account',()=>{
  const guest={revision:8,monsters:{rageipede:{kills:8}}};
  const state=guestProfileState(guest);
  assert.equal(state.profileAccountId,null);assert.equal(state.profileReady,false);
  const server={revision:2,monsters:{rageipede:{kills:2}}};
  const relinked=portalProfileResponse('7','7',true,state.profileAccountId,state.profile,server);
  assert.deepEqual(relinked.profile,server,'the guest revision must not override the server account');
});
