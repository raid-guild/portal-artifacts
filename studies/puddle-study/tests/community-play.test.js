import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createBlankDraft,exportDraft} from '../src/editor-workbench.js';
import {prepareCommunityLevel,progressForLocalRun} from '../src/community-play.js';
import {pinnedCommunityFromSearch,fetchPinnedCommunity} from '../src/community-client.js';
import {PuddleSimulation} from '../src/simulation.js';
import {createLocalLevelProgress} from '../src/local-levels.js';
import {tabletScope} from '../src/memory-tablets.js';
import {createRankedClient} from '../src/ranked-client.js';

const document=JSON.parse(exportDraft(createBlankDraft()));
const entry={id:'c4ebaa2d-1d51-439b-8137-8f5007504d1e',version:2};
const deferred=()=>{let resolve;const promise=new Promise(done=>{resolve=done;});return {promise,resolve};};
const workbench={importDraft:()=>createBlankDraft(),validateDraft:()=>({errors:[]}),compileDraft:()=>({start:{x:0,z:0},exit:{x:1,z:1}})};
test('shared links fetch the exact requested version and reject an invalid explicit version',async()=>{
  const id=entry.id,calls=[],client={latest:async()=>{calls.push('latest');return {version:3};},
    version:async(_id,version)=>{calls.push(version);return {version};}};
  const exact=pinnedCommunityFromSearch(`?community=${id}&version=2`);
  assert.equal((await fetchPinnedCommunity(exact,client)).version,2);
  const unversioned=pinnedCommunityFromSearch(`?community=${id}`);
  assert.equal((await fetchPinnedCommunity(unversioned,client)).version,3);
  for(const bad of ['', '0', 'abc', '2.5', '1000001']){
    const pinned=pinnedCommunityFromSearch(`?community=${id}&version=${bad}`);
    assert.throws(()=>fetchPinnedCommunity(pinned,client),/Invalid community version/);
  }
  assert.deepEqual(calls,[2,'latest']);
});
test('community score storage failures select the community result warning source',()=>{
  const local=createLocalLevelProgress({storage:{getItem:()=>null,setItem(){}}});
  const community=createLocalLevelProgress({storage:{getItem:()=>null,setItem(){throw new Error('denied');}},
    key:'puddle.community-progress.v1'});
  const sim={localRun:{community:{id:entry.id,version:2}}};
  const selected=progressForLocalRun(sim,local,community);
  assert.equal(selected,community);
  selected.recordCompletion(`community:${entry.id}`,2,
    {gold:1,gems:0,totalGold:1,totalGems:0,elapsed:20,target:30});
  assert.equal(selected.saveFailed,true);
  assert.equal(local.saveFailed,false);
});
test('community preparation discards a stale fetch or compilation before starting play',async()=>{
  const fetch=deferred(),ready=[];let current=true;
  const run=prepareCommunityLevel(entry,{client:{version:()=>fetch.promise},isCurrent:()=>current,
    loadWorkbench:async()=>workbench,onReady:async()=>ready.push('started'),yieldFrame:async()=>{}});
  current=false;fetch.resolve({document});assert.equal(await run,null);assert.deepEqual(ready,[]);
  const frame=deferred();current=true;
  const compiling=prepareCommunityLevel(entry,{client:{version:async()=>({document})},isCurrent:()=>current,
    loadWorkbench:async()=>workbench,onReady:async()=>ready.push('started'),yieldFrame:()=>frame.promise});
  await Promise.resolve();current=false;frame.resolve();assert.equal(await compiling,null);assert.deepEqual(ready,[]);
});
test('community run scopes results and tablet reads by exact version',()=>{
  const level={...workbench.compileDraft(),id:1,name:'Shared garden',gold:[],gems:[],seedCount:17,capacity:17,
    targetTime:30,terrain:{type:'flat',height:0},boundary:{minX:-9,maxX:9,minZ:-6,maxZ:4.8},
    editorCustom:true};
  const sim=new PuddleSimulation();
  assert.equal(sim.startLocalGarden(level,{id:`community:${entry.id}`,revision:2,community:{...entry,author:'Builder'}}),true);
  assert.equal(tabletScope(sim.gardenLevel),`community:${entry.id}:2`);
  assert.equal(sim.isLocalGarden,true);
  let rankedPosts=0;const ranked=createRankedClient({fetcher:async(_url,options)=>{
    if(options.method==='POST')rankedPosts++;return {ok:true,json:async()=>({displayName:'Builder'})};}});
  return ranked.sessionPromise.then(()=>{
    assert.equal(ranked.begin(sim),false);assert.equal(rankedPosts,0);
  const data=new Map(),storage={getItem:key=>data.get(key)||null,setItem:(key,value)=>data.set(key,value)};
  const progress=createLocalLevelProgress({storage,key:'puddle.community-progress.v1'});
  progress.recordCompletion(`community:${entry.id}`,2,{gold:0,gems:0,totalGold:0,totalGems:0,elapsed:20,target:30});
  assert.ok(progress.getBest(`community:${entry.id}`,2));
  assert.equal(progress.getBest(`community:${entry.id}`,3),null);
  });
});
