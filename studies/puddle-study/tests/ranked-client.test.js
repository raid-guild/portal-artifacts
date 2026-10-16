import test from 'node:test';
import assert from 'node:assert/strict';
import {createRankedClient} from '../src/ranked-client.js';
import {PuddleSimulation} from '../src/simulation.js';

const response=(body,status=200)=>({ok:status>=200&&status<300,status,json:async()=>body});
const deferred=()=>{let resolve;const promise=new Promise(done=>{resolve=done;});return {promise,resolve};};
const tick=()=>new Promise(resolve=>setImmediate(resolve));

test('finish queues behind run start and keeps the first exit snapshot',async()=>{
  const pending=deferred(),requests=[];
  const fetcher=(url,options={})=>{requests.push({url,options});
    if(url.endsWith('/session'))return Promise.resolve(response({displayName:'Maker',version:'1'}));
    if(url.endsWith('/runs'))return pending.promise;
    return Promise.resolve(response({saved:true,score:1100}));};
  const client=createRankedClient({fetcher});await client.sessionPromise;
  const sim=new PuddleSimulation();sim.startGarden(1);assert.equal(client.begin(sim),true);
  sim.garden.goldCount=17;sim.garden.gemCount=3;sim.garden.finishElapsed=20;sim.garden.excludedMs=1500;
  client.finish(sim);sim.garden.goldCount=0;client.finish(sim);
  pending.resolve(response({runId:'run-one'},201));await tick();await tick();
  const finishes=requests.filter(entry=>entry.url.endsWith('/finish'));
  assert.equal(finishes.length,1);const body=JSON.parse(finishes[0].options.body);
  assert.equal(body.gold,17);assert.equal(body.gems,3);assert.equal(body.durationMs,20000);
  assert.equal(client.lastResult.score,1100);
});

test('restart ignores a stale run start and guest mode never starts a run',async()=>{
  const pending=deferred(),requests=[];
  const fetcher=(url,options={})=>{requests.push({url,options});
    if(url.endsWith('/session'))return Promise.resolve(response({displayName:'Maker',version:'1'}));
    return pending.promise;};
  const client=createRankedClient({fetcher});await client.sessionPromise;
  const sim=new PuddleSimulation();sim.startGarden(1);client.begin(sim);
  sim.restartGarden();client.begin(sim,{eligible:false});
  pending.resolve(response({runId:'stale'},201));await tick();
  sim.garden.finishElapsed=20;client.finish(sim);
  assert.equal(requests.filter(entry=>entry.url.endsWith('/finish')).length,0);
  const guest=createRankedClient({fetcher:()=>Promise.resolve(response({},401))});await guest.sessionPromise;
  assert.equal(guest.begin(sim),false);
});

test('a late finish cannot overwrite a newer run status',async()=>{
  const pending=deferred(),requests=[];
  const fetcher=(url,options={})=>{requests.push({url,options});
    if(url.endsWith('/session'))return Promise.resolve(response({displayName:'Maker',version:'1'}));
    if(url.endsWith('/runs'))return Promise.resolve(response({runId:'run-'+requests.length},201));
    if(url.includes('run-2'))return pending.promise;
    return Promise.resolve(response({saved:true,score:900}));};
  const client=createRankedClient({fetcher});await client.sessionPromise;
  const sim=new PuddleSimulation();sim.startGarden(1);client.begin(sim);await tick();
  sim.garden.finishElapsed=20;client.finish(sim);await tick();
  sim.restartGarden();client.begin(sim);await tick();
  assert.equal(client.lastResult,null);
  pending.resolve(response({saved:true,score:1100}));await tick();
  assert.equal(client.lastResult,null);
});

test('a transient finish failure retries the identical snapshot once',async()=>{
  const bodies=[];let finishCount=0;
  const fetcher=(url,options={})=>{
    if(url.endsWith('/session'))return Promise.resolve(response({displayName:'Maker',version:'1'}));
    if(url.endsWith('/runs'))return Promise.resolve(response({runId:'retry-run'},201));
    bodies.push(options.body);finishCount++;
    return Promise.resolve(finishCount===1?response({message:'Try later'},503):response({saved:true,score:1100}));};
  const client=createRankedClient({fetcher,retryDelayMs:0});await client.sessionPromise;
  const sim=new PuddleSimulation();sim.startGarden(1);client.begin(sim);await tick();
  sim.garden.goldCount=17;sim.garden.gemCount=3;sim.garden.finishElapsed=20;client.finish(sim);
  await new Promise(resolve=>setTimeout(resolve,20));
  assert.equal(finishCount,2);assert.equal(bodies[0],bodies[1]);assert.equal(client.lastResult.score,1100);
});

test('wall clock excludes first arrival, pauses and hidden time but counts a respawn',()=>{
  const sim=new PuddleSimulation();sim.enableWallClock();sim.startGarden(1);
  sim.syncGardenClock(0,false);assert.equal(sim.gardenClock,null);
  sim.garden.phase='playing';sim.syncGardenClock(1000,false);sim.syncGardenClock(3000,false);
  assert.equal(sim.garden.playElapsed,2);
  sim.syncGardenClock(5000,false);sim.garden.phase='paused';
  sim.syncGardenClock(8000,false);sim.garden.phase='playing';sim.syncGardenClock(10000,false);
  sim.syncGardenClock(12000,true);
  assert.equal(sim.garden.playElapsed,6);assert.equal(sim.gardenClock.excludedMs,5000);
  sim.respawnGarden();sim.syncGardenClock(12000,false);
  assert.equal(sim.garden.playElapsed,6);
  sim.garden.phase='playing';sim.syncGardenClock(13000,false);sim.finishGardenClock(14000);
  assert.equal(sim.garden.finishElapsed,8);
  sim.syncGardenClock(20000,false);assert.equal(sim.garden.finishElapsed,8);
});

test('session and board requests time out even when fetch ignores AbortSignal',async()=>{
  const client=createRankedClient({fetcher:()=>new Promise(()=>{}),requestTimeoutMs:5});
  await client.sessionPromise;
  assert.equal(client.sessionChecked,true);
  assert.equal(client.session,null);
  await assert.rejects(client.board(1),/timed out/);
});

test('timed-out run start reports failure and a timed-out finish retries once',async()=>{
  const sim=new PuddleSimulation();sim.startGarden(1);
  const client=createRankedClient({fetcher:url=>url.endsWith('/session')?
    Promise.resolve(response({displayName:'Maker',version:'1'})):new Promise(()=>{}),requestTimeoutMs:5});
  await client.sessionPromise;client.begin(sim);
  await new Promise(resolve=>setTimeout(resolve,20));
  assert.match(client.lastResult.message,/timed out/);

  let finishes=0;
  const finishing=createRankedClient({fetcher:url=>{
    if(url.endsWith('/session'))return Promise.resolve(response({displayName:'Maker',version:'1'}));
    if(url.endsWith('/runs'))return Promise.resolve(response({runId:'timeout-run'},201));
    finishes++;return new Promise(()=>{});
  },requestTimeoutMs:5,retryDelayMs:0});
  await finishing.sessionPromise;sim.restartGarden();finishing.begin(sim);await tick();
  sim.garden.finishElapsed=20;finishing.finish(sim);
  await new Promise(resolve=>setTimeout(resolve,35));
  assert.equal(finishes,2);
  assert.match(finishing.lastResult.message,/timed out/);
});
