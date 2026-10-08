import test from 'node:test';
import assert from 'node:assert/strict';
import {createLocalLevelLibrary,createLocalLevelProgress,LOCAL_LEVELS_KEY} from '../src/local-levels.js';
import {createBlankDraft,addDraftObject,compileDraft} from '../src/editor-workbench.js';
import {PuddleSimulation} from '../src/simulation.js';

const memory=()=>{const data=new Map();return {getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),data};};
const doc=(name='Garden',gold=0)=>JSON.stringify({format:'puddle-level',version:3,draft:{name,objects:[{kind:'gold',x:gold,z:0}]}});
test('named saves update exact IDs, while Save as new allows duplicate names and independent revisions',()=>{
  const storage=memory(),ids=['one','two'],library=createLocalLevelLibrary({storage,idFactory:()=>ids.shift(),now:()=>100});
  const first=library.save(doc());assert.equal(first.id,'one');assert.equal(first.revision,1);
  const renamed=library.save(doc('Renamed'),{id:'one'});assert.equal(renamed.revision,1);
  const edited=library.save(doc('Renamed',1),{id:'one'});assert.equal(edited.revision,2);
  const second=library.save(doc('Renamed',1),{id:'one',asNew:true});assert.equal(second.id,'two');
  assert.equal(second.revision,1);assert.equal(library.list().length,2);
  assert.throws(()=>library.save(doc(),{id:'missing'}),/no longer exists/);
  assert.equal(createLocalLevelLibrary({storage}).get('one').revision,2);
});
test('revising presentation labels preserves a local level score revision',()=>{
  const storage=memory(),library=createLocalLevelLibrary({storage,idFactory:()=> 'signed-level'});
  const draft=createBlankDraft(),label=addDraftObject(draft,'label',{x:0,z:0,base:0,offset:.45,text:'FLOW UNDER'});
  const first=library.save(JSON.stringify({format:'puddle-level',version:3,draft}));
  label.text='A quiet passage';label.x=1;draft.nextObjectId+=9;
  const second=library.save(JSON.stringify({format:'puddle-level',version:3,draft}),{id:first.id});
  assert.equal(second.revision,first.revision);
  addDraftObject(draft,'gem',{x:2,z:0});
  const changed=library.save(JSON.stringify({format:'puddle-level',version:3,draft}),{id:first.id});
  assert.equal(changed.revision,first.revision+1);
});
test('old autosaved draft migrates once without deleting it or clobbering other levels',()=>{
  const storage=memory();storage.setItem('puddle-level-workshop-v3',doc('Older'));
  let counter=0;const make=()=>createLocalLevelLibrary({storage,idFactory:()=>`local-${++counter}`});
  assert.equal(make().list()[0].name,'Older');assert.ok(storage.getItem('puddle-level-workshop-v3'));
  assert.equal(make().list().length,1);assert.ok(storage.getItem(LOCAL_LEVELS_KEY));
});
test('local best is revision scoped, uses authored totals, and zero collectibles finish at 100%',()=>{
  const storage=memory(),progress=createLocalLevelProgress({storage});
  assert.equal(progress.getBest('a',1),null);
  assert.ok(progress.recordCompletion('a',1,{gold:0,gems:0,totalGold:0,totalGems:0}));
  assert.equal(progress.getBest('a',1).percent,100);assert.equal(progress.getBest('a',2),null);
  assert.ok(progress.recordCompletion('a',2,{gold:1,gems:0,totalGold:3,totalGems:1}));
  assert.equal(progress.getBest('a',2).percent,25);
  assert.equal(progress.recordCompletion('a',2,{gold:0,gems:0,totalGold:3,totalGems:1}),false);
  assert.equal(createLocalLevelProgress({storage}).getBest('a',2).percent,25);
});
test('a failed score write keeps only an explicitly marked session result',()=>{
  const storage={getItem:()=>null,setItem(){throw new Error('quota denied');}};
  const progress=createLocalLevelProgress({storage});
  assert.equal(progress.recordCompletion('a',1,{gold:1,gems:0,totalGold:1,totalGems:0}),false);
  assert.equal(progress.saveFailed,true);
  assert.equal(progress.getBest('a',1).percent,100);
  assert.equal(createLocalLevelProgress({storage}).getBest('a',1),null,'the result was never persisted');
});
test('local runs use frozen authored identity, real supply count, and restart without changing campaign scores',()=>{
  const draft=createBlankDraft();addDraftObject(draft,'flesh',{x:2,z:1,weight:1});
  addDraftObject(draft,'flesh',{x:3,z:1,weight:1});
  const level=compileDraft(draft),sim=new PuddleSimulation();
  sim.completedLevels={1:{gems:2,gold:9,totalGold:17}};
  assert.ok(sim.startLocalGarden(level,{id:'my-level',revision:4}));
  assert.equal(sim.isLocalGarden,true);assert.equal(sim.gardenLevel,level);
  assert.equal(sim.fluid.particles.length,draft.totalFlesh);
  assert.equal(sim.fluid.particles.filter(p=>p.feedstock&&p.patchId===1).length,level.poolCounts[1]);
  assert.deepEqual(sim.completedLevels,{1:{gems:2,gold:9,totalGold:17}});
  assert.equal(sim.continueGarden(),false);
  sim.restartGarden();assert.equal(sim.localRun.revision,4);assert.equal(sim.garden.phase,'arriving');
  sim.startGarden(1);assert.equal(sim.isLocalGarden,false);
});
