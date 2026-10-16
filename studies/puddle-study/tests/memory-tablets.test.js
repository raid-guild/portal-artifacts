import test from 'node:test';
import assert from 'node:assert/strict';
import {PuddleSimulation} from '../src/simulation.js';
import {GARDEN,updateGarden} from '../src/garden-level.js';
import {tabletCoverage,nearbyTablet,openTablet,closeTablet,tabletScope} from '../src/memory-tablets.js';
import {createBlankDraft,addDraftObject,WorkbenchSimulation,exportDraft,importDraft,validateDraft} from '../src/editor-workbench.js';

const storage=()=>{const m=new Map();return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v),m};};
const fake=(tablet,brain,colliders=[])=>({garden:{phase:'playing',tablets:[tablet]},brain,
  activeColliders:()=>colliders});

test('reading requires several connected flesh samples on the correct side of stone',()=>{
  const t={x:1,z:0,y:.15},owned=Array.from({length:5},(_,i)=>({x:1+i*.025,y:.22,z:0}));
  assert.equal(tabletCoverage(t,owned,[],.067),true);
  assert.equal(tabletCoverage(t,owned.slice(0,4),[],.067),false);
  const wall=[{type:'box',minX:.75,maxX:.8,minY:0,maxY:1,minZ:-.5,maxZ:.5}];
  const behindWall=owned.map(p=>({...p,x:.6}));
  assert.equal(tabletCoverage(t,behindWall,[],.067),true,'samples are within coverage range');
  assert.equal(tabletCoverage(t,behindWall,wall,.067),false,'solid stone occludes flesh');
  assert.equal(tabletCoverage({...t,y:1.15},owned,[],.067),false,'flesh below the platform cannot read');
});

test('feedstock and disconnected flesh cannot absorb a tablet for the brain',()=>{
  const s=new PuddleSimulation();s.tabletStorage=null;s.selectTest('garden');s.garden.phase='playing';
  const tablet={...s.garden.tablets[0],id:'isolated',x:-4,z:3.5,y:.15,read:false,progress:0};
  s.garden.tablets=[tablet];
  const feed=s.fluid.particles.filter(p=>p.feedstock).slice(0,5);
  for(const p of feed)Object.assign(p,{x:-4,y:.2,z:3.5});
  for(let i=0;i<25;i++)updateGarden(s,1/60);
  assert.equal(s.garden.phase,'playing');
  const disconnected=s.fluid.particles.filter(p=>!p.feedstock&&p!==s.brain).slice(0,5);
  for(const p of disconnected)Object.assign(p,{x:-4,y:.2,z:3.5,component:999});
  for(let i=0;i<25;i++)updateGarden(s,1/60);
  assert.equal(s.garden.phase,'playing');
  for(const p of disconnected)p.component=s.brain.component;
  for(let i=0;i<25;i++)updateGarden(s,1/60);
  assert.equal(s.garden.phase,'reading');
});

test('manual reread cannot reach through a wall or from below a platform',()=>{
  const tablet={id:'note',x:1,z:0,y:.15,read:true};
  const wall=[{type:'box',minX:.45,maxX:.55,minY:0,maxY:1,minZ:-.5,maxZ:.5}];
  assert.equal(nearbyTablet(fake(tablet,{x:0,y:.1,z:0},wall)),null);
  assert.equal(nearbyTablet(fake({...tablet,y:1.15},{x:1,y:.1,z:0})),null);
  assert.equal(nearbyTablet(fake(tablet,{x:.5,y:.1,z:0})),tablet);
});

test('tablet reading freezes physics, clears on close, and persists across respawn',()=>{
  const s=new PuddleSimulation(),store=storage();s.tabletStorage=store;s.selectTest('garden');s.garden.phase='playing';
  const first=s.garden.tablets[0],before={...s.brain};
  assert.equal(openTablet(s,first),true);assert.equal(s.garden.phase,'reading');
  for(let i=0;i<30;i++)s.step({x:1,contract:true});assert.deepEqual(s.brain,before);
  assert.equal(s.garden.goldCount,0);assert.equal(closeTablet(s),true);
  assert.equal(s.gardenInputArmed,false);
  s.respawnGarden();assert.equal(s.garden.tablets[0].read,true);
  const other=new PuddleSimulation();other.tabletStorage=store;other.selectTest('garden');
  assert.equal(other.garden.tablets[0].read,true);
  assert.ok([...store.m.keys()].some(k=>k.includes(tabletScope(GARDEN))));
});

test('reading time is excluded from the active timed attempt',()=>{
  const s=new PuddleSimulation();s.tabletStorage=null;s.selectTest('garden');s.garden.phase='playing';
  s.enableWallClock();let now=1000;const sync=s.syncGardenClock.bind(s);
  s.syncGardenClock=()=>sync(now,false);s.syncGardenClock();
  now=1500;openTablet(s,s.garden.tablets[0]);
  now=11500;closeTablet(s);
  now=12000;s.syncGardenClock();
  assert.equal(s.garden.playElapsed,1);
  assert.equal(s.gardenClock.excludedMs,10000);
});

test('memory-only attempts and editor drafts cannot contaminate campaign reads',()=>{
  const store=storage(),s=new PuddleSimulation();s.tabletStorage=null;s.selectTest('garden');s.garden.phase='playing';
  openTablet(s,s.garden.tablets[0]);assert.equal(store.m.size,0);
  const fresh=new PuddleSimulation();fresh.tabletStorage=store;fresh.selectTest('garden');
  assert.equal(fresh.garden.tablets[0].read,false);
  const a=createBlankDraft();addDraftObject(a,'tablet',{x:1,z:0,base:0,category:'story',title:'One',text:'A note.',hint:'none'});
  const b=importDraft(exportDraft(a));b.objects.find(o=>o.kind==='tablet').text='Another note.';
  assert.deepEqual(validateDraft(a).errors,[]);
  const ea=new WorkbenchSimulation(a,{tabletStorage:store}),eb=new WorkbenchSimulation(b,{tabletStorage:store});
  assert.notEqual(ea.gardenLevel.tabletScope,eb.gardenLevel.tabletScope);
  ea.garden.phase='playing';openTablet(ea,ea.garden.tablets[0]);
  const reopened=new WorkbenchSimulation(a,{tabletStorage:store});
  assert.equal(reopened.garden.tablets[0].read,true);
  assert.equal(eb.garden.tablets[0].read,false);
  assert.equal(fresh.garden.tablets[0].read,false);
});
