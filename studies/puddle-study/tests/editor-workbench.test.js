import test from 'node:test';
import assert from 'node:assert/strict';
import {GARDEN_LEVELS,gardenColliders} from '../src/garden-level.js';
import {gardenCanCast} from '../src/garden-level.js';
import {PuddleSimulation} from '../src/simulation.js';
import {groundAt,supportedGroundAt,resolveParticle,pointInsideSolid} from '../src/colliders.js';
import {createBlankDraft,draftFromPreset,compileDraft,validateDraft,exportDraft,importDraft,
  DraftHistory,addDraftObject,moveDraftObject,duplicateDraftObject,WorkbenchSimulation} from '../src/editor-workbench.js';
import {rotateDraftObject,deleteDraftObject} from '../src/editor-workbench.js';
import {resetDraftPaint,placedObjectDefaults} from '../src/editor-workbench.js';
import * as THREE from 'three';
import {createEditorStageView} from '../src/editor-stage-view.js';

const fresh=()=>createBlankDraft();
test('a blank editable garden is safe with zero collectibles and its real particle budget',()=>{
  const d=fresh(),l=compileDraft(d),s=new WorkbenchSimulation(d);
  assert.deepEqual(validateDraft(d).errors,[]);
  assert.equal(l.gems.length,0);assert.equal(l.gold.length,0);assert.equal(l.pools.length,0);
  assert.equal(s.fluid.particles.length,65);assert.equal(s.activeColliders().length,3);
  s.garden.phase='playing';for(let i=0;i<20;i++)s.step({});
  assert.ok(Number.isFinite(s.brain.x+s.brain.y+s.brain.z));
});
test('all seven independently editable presets preserve campaign fixtures and collectible placement',()=>{
  for(const level of GARDEN_LEVELS){const d=draftFromPreset(level.id),compiled=compileDraft(d);
    assert.deepEqual(validateDraft(d).errors,[],`level ${level.id}`);
    if(level.id<=5)assert.deepEqual(gardenColliders(compiled),gardenColliders(level),`level ${level.id}`);
    else{
      assert.equal(gardenColliders(compiled).length,gardenColliders(level).length);
      assert.deepEqual(compiled.poolCounts,level.poolCounts);
      assert.equal(compiled.start.y,level.start.y);
      assert.equal(compiled.editorFixtures.filter(c=>c.type==='sticky-wall').length,3);
      assert.equal(compiled.editorFixtures.filter(c=>c.type==='slip').length,level.id===6?2:0);
      if(level.id===7){assert.equal(compiled.pits.length,2);assert.deepEqual(compiled.editorFixtures.filter(c=>c.type==='lava').map(c=>c.sourceId).sort(),['ember-ground-lava','ember-raised-lava','ember-underbridge-lava']);}
    }
    assert.deepEqual(compiled.pools,level.pools);assert.deepEqual(compiled.gold,level.gold);
    const fixture=d.objects.find(o=>o.kind==='pillar'||o.kind==='legacy-roof'||o.kind==='legacy-passage'||o.kind==='grip');
    if(fixture){const before=gardenColliders(compiled);moveDraftObject(d,fixture.id,1.25,1.5);
      assert.notDeepEqual(gardenColliders(compileDraft(d)),before,`level ${level.id} fixture is independently movable`);}
  }
});
test('pool weights redistribute every loose particle without a no-spare placement trap',()=>{
  const d=fresh();d.totalFlesh=100;d.startingFlesh=28;
  const a=addDraftObject(d,'flesh',{x:2,z:1,weight:1});addDraftObject(d,'flesh',{x:0,z:1,weight:3});
  assert.deepEqual(compileDraft(d).poolCounts,[18,54]);
  const duplicate=duplicateDraftObject(d,a.id);assert.notEqual(duplicate.id,a.id);
  assert.equal(compileDraft(d).poolCounts.reduce((x,y)=>x+y,0),72);
  assert.equal(new Set(d.objects.map(o=>o.id)).size,d.objects.length);
});
test('v2 exports preserve unfinished drafts and v1 migration retains authored values',()=>{
  const d=fresh();d.objects=d.objects.filter(o=>o.kind!=='exit');
  assert.ok(validateDraft(d).errors.length);assert.deepEqual(importDraft(exportDraft(d)),d);
  const legacy=structuredClone(GARDEN_LEVELS[2]);legacy.name='Altered passage';legacy.pools[0][0]=4.22;
  const migrated=importDraft(JSON.stringify({format:'puddle-level',version:1,level:legacy}));
  assert.equal(migrated.name,'Altered passage');assert.equal(compileDraft(migrated).pools[0][0],4.22);
  assert.deepEqual(gardenColliders(compileDraft(migrated)),gardenColliders(legacy));
  const oldRoof=structuredClone(GARDEN_LEVELS[0]);oldRoof.roof.minX+=.2;oldRoof.roof.maxX+=.2;
  const migratedRoof=importDraft(JSON.stringify({format:'puddle-level',version:1,level:oldRoof}));
  assert.equal(migratedRoof.objects.filter(o=>o.role==='roof-support').length,2);
  assert.equal(compileDraft(migratedRoof).roofSupports[0].minX,oldRoof.roof.minX-.1);
  assert.throws(()=>importDraft('{bad'),SyntaxError);
});
test('malformed imported terrain is rejected before simulation samples nested stairs',()=>{
  for(const id of [1,2,5]){
    const d=draftFromPreset(id);
    if(id===1)delete d.terrain.stairs.minX;
    else delete d.terrain.leftStairs.steps;
    assert.match(validateDraft(d).errors.join(' '),/stair|terrace/i);
    assert.throws(()=>importDraft(exportDraft(d)),/stair|terrace/i);
    assert.throws(()=>new WorkbenchSimulation(d),/stair|terrace/i);
  }
  const unfinished=fresh();unfinished.objects=unfinished.objects.filter(o=>o.kind!=='exit');
  assert.deepEqual(importDraft(exportDraft(unfinished)),unfinished,'safe unfinished work remains importable');
});
test('vertical slippery paint is rejected instead of becoming a floor slip patch',()=>{
  const d=fresh();addDraftObject(d,'block',{minX:-1,maxX:1,minZ:-1,maxZ:1,minY:0,maxY:1});
  addDraftObject(d,'paint',{surface:'slippery',face:'east',minX:.9,maxX:1.1,minZ:-.5,maxZ:.5,base:0});
  assert.match(validateDraft(d).errors.join(' '),/Slippery paint belongs on walkable floors/i);
});
test('raised blocks cannot silently swallow basin or exit funnels',()=>{
  const d=fresh();addDraftObject(d,'block',{minX:-1,maxX:1,minZ:-1,maxZ:1,minY:0,maxY:1});
  addDraftObject(d,'basin',{x:1.4,z:0,radius:.85,bottomRadius:.45,depth:.32});
  assert.match(validateDraft(d).errors.join(' '),/open terrain/i);
  assert.throws(()=>importDraft(exportDraft(d)),/open terrain/i);
  d.objects.find(o=>o.kind==='basin').x=3;
  assert.deepEqual(validateDraft(d).errors,[]);
  const exit=d.objects.find(o=>o.kind==='exit');exit.x=0;exit.z=0;
  assert.match(validateDraft(d).errors.join(' '),/open terrain/i);
  const grip=draftFromPreset(5),gripExit=grip.objects.find(o=>o.kind==='exit');
  gripExit.x=.55;gripExit.z=0;
  assert.match(validateDraft(grip).errors.join(' '),/open terrain/i);
  assert.throws(()=>importDraft(exportDraft(grip)),/open terrain/i);
});
test('authored terrace floor leaves physical funnels visibly open and pickable around their rims',()=>{
  for(const id of [1,2,4,5]){
    const level=compileDraft(draftFromPreset(id)),scene=new THREE.Scene(),view=createEditorStageView(scene,level),
      cuts=[...(level.channels||[]),...(level.basin?[level.basin]:[]),level.exit],ray=new THREE.Raycaster();
    for(const cut of cuts){
      const at=(x,z)=>{ray.set(new THREE.Vector3(x,8,z),new THREE.Vector3(0,-1,0));
        return ray.intersectObjects(view.group.children,true).filter(hit=>hit.object.userData.pickableTerrain&&
          hit.object.material?.color?.getHex()===0xe4d3bd);};
      assert.equal(at(cut.x,cut.z).length,0,`level ${id} funnel center cannot have a floor cap`);
      assert.ok(at(cut.x+cut.radius+.04,cut.z).length>0,`level ${id} rim has a nearby floor`);
    }
    view.dispose();
  }
});
test('import repairs missing or colliding object counters without duplicate IDs',()=>{
  for(const broken of [undefined,NaN,0,1]){
    const d=fresh();if(broken===undefined)delete d.nextObjectId;else d.nextObjectId=broken;
    const loaded=importDraft(exportDraft(d));
    const a=addDraftObject(loaded,'gold',{x:0,z:0});
    const b=addDraftObject(loaded,'gold',{x:1,z:0});
    assert.notEqual(a.id,b.id);assert.equal(new Set(loaded.objects.map(o=>o.id)).size,loaded.objects.length);
    assert.deepEqual(validateDraft(loaded).errors,[]);
  }
});
test('undo restores edits and play uses the exact current draft',()=>{
  const d=fresh(),h=new DraftHistory(d);addDraftObject(d,'gem',{x:0,z:0});h.commit(d);
  const old=h.undo();assert.equal(old.objects.filter(o=>o.kind==='gem').length,0);
  const again=h.redo();assert.equal(new WorkbenchSimulation(again).garden.gems.length,1);
});
test('stacked blocks and four authored steps have top support without lifting from below',()=>{
  const d=fresh();addDraftObject(d,'block',{minX:-1,maxX:1,minZ:-1,maxZ:1,minY:0,maxY:.7});
  addDraftObject(d,'block',{minX:-.5,maxX:.5,minZ:-.5,maxZ:.5,minY:.7,maxY:1.4});
  addDraftObject(d,'stairs',{x:2,z:0,axis:'x',run:1.4,width:1.2,rise:1.08,steps:4,base:0});
  const c=gardenColliders(compileDraft(d));
  assert.equal(c.filter(o=>o.walkableTop).length,2);
  assert.equal(c.filter(o=>o.type==='editor-stairs').length,1);
  assert.equal(supportedGroundAt({x:0,y:.2,z:0},.067,c),0);
  assert.equal(supportedGroundAt({x:0,y:1.47,z:0},.067,c),1.4);
  const stair=c.find(o=>o.type==='editor-stairs');
  assert.equal(groundAt(stair.minX,0,c).height,0);
  assert.equal(Number(groundAt(2,0,c).height.toFixed(2)),.54);
  assert.equal(Number(groundAt(stair.maxX,0,c).height.toFixed(2)),1.08);
  const p={x:0,y:.2,z:-1.2,px:0,py:.2,pz:-1.2,vx:0,vy:0,vz:0};
  p.z=0;resolveParticle(p,.067,c);
  assert.ok(p.z<-.99,'wall must block low-side entry');
  assert.ok(pointInsideSolid(0,.5,0,c));
});
test('a terrace block can span the full authored board width or depth',()=>{
  const d=fresh(),b=d.boundary;
  addDraftObject(d,'block',{minX:b.minX,maxX:b.maxX,minZ:-1,maxZ:0,minY:0,maxY:1});
  addDraftObject(d,'block',{minX:-.5,maxX:.5,minZ:b.minZ,maxZ:b.maxZ,minY:0,maxY:1});
  assert.deepEqual(validateDraft(d).errors,[]);
  d.objects.find(o=>o.kind==='block').maxX=b.maxX+.1;
  assert.match(validateDraft(d).errors.join(' '),/fit inside the playable board/);
});

test('four stair directions have continuous physical rise and no lateral corner lift',()=>{
  for(const [axis,reverse] of [['x',false],['z',false],['x',true],['z',true]]){
    const d=fresh();d.objects.find(o=>o.kind==='start').x=-2;d.objects.find(o=>o.kind==='start').z=0;
    addDraftObject(d,'stairs',{x:0,z:0,axis,reverse,run:1.4,width:1.5,rise:1.08,steps:4,base:0});
    const c=gardenColliders(compileDraft(d)),stair=c.find(o=>o.type==='editor-stairs');
    const low=axis==='x'?{x:reverse?stair.maxX:stair.minX,z:0}:{x:0,z:reverse?stair.maxZ:stair.minZ};
    const high=axis==='x'?{x:reverse?stair.minX:stair.maxX,z:0}:{x:0,z:reverse?stair.minZ:stair.maxZ};
    assert.equal(groundAt(low.x,low.z,c).height,0);
    assert.ok(Math.abs(groundAt(high.x,high.z,c).height-1.08)<1e-9);
    const mid=axis==='x'?{x:0,z:0}:{x:0,z:0};
    assert.ok(Math.abs(groundAt(mid.x,mid.z,c).height-.54)<1e-9);
    const p=axis==='x'?{x:0,y:.2,z:-.9,px:0,py:.2,pz:-.9,vx:0,vy:0,vz:0}:
      {x:-.9,y:.2,z:0,px:-.9,py:.2,pz:0,vx:0,vy:0,vz:0};
    if(axis==='x')p.z=0;else p.x=0;
    resolveParticle(p,.067,c);
    assert.ok(axis==='x'?p.z<-.7:p.x<-.7,'low-side stair flank must block');
  }
  const d=fresh();d.objects.find(o=>o.kind==='start').x=-2;d.objects.find(o=>o.kind==='start').z=0;
  addDraftObject(d,'stairs',{x:0,z:0,axis:'x',run:1.4,width:1.5,rise:1.08,steps:4,base:0});
  const s=new WorkbenchSimulation(d);s.garden.phase='playing';
  let reached=false;for(let i=0;i<180;i++){s.step({x:1});if(s.brain.x>.55&&s.brain.y>.9)reached=true;}
  assert.ok(reached,'the real 65-particle body can ascend the authored stairs');
});

test('two slippery patches affect only their own contact level',()=>{
  const d=fresh();addDraftObject(d,'paint',{surface:'slippery',face:'floor',minX:-3,maxX:-1,minZ:-1,maxZ:1,base:0});
  addDraftObject(d,'paint',{surface:'slippery',face:'floor',minX:1,maxX:3,minZ:-1,maxZ:1,base:0});
  const s=new WorkbenchSimulation(d),f=s.fluid,colliders=s.activeColliders();
  const p=[-2,2,4].map(x=>{const q=f.addParticle({x,y:f.radius,z:0},{feedstock:true});q.vx=1;return q;});
  f.step(1/60,{puddle:true},colliders);
  assert.ok(Math.abs(p[0].vx-p[1].vx)<1e-6);
  assert.ok(p[0].vx>p[2].vx+.1);
  const raised=f.addParticle({x:-2,y:f.radius,z:2},{feedstock:true});raised.vx=1;
  // Same footprint, but at a different authored support height: no slip leak.
  const highPaint={type:'slip',minX:-3,maxX:-1,minZ:1,maxZ:3,base:1.08};
  f.step(1/60,{puddle:true},[...colliders,highPaint]);
  assert.ok(raised.vx<.9);
});

test('normal brush subtracts paint without deleting the support or unrelated marks',()=>{
  const d=fresh();const block=addDraftObject(d,'block',{minX:-1,maxX:1,minZ:-1,maxZ:1,minY:0,maxY:.8});
  addDraftObject(d,'paint',{surface:'slippery',face:'floor',minX:-1,maxX:1,minZ:-1,maxZ:1,base:.8});
  const remote=addDraftObject(d,'paint',{surface:'sticky',face:'floor',minX:3,maxX:4,minZ:3,maxZ:4,base:0});
  resetDraftPaint(d,{minX:-.2,maxX:.2,minZ:-.2,maxZ:.2,base:.8,face:'floor'});
  assert.ok(d.objects.some(o=>o.id===block.id));assert.ok(d.objects.some(o=>o.id===remote.id));
  const pieces=d.objects.filter(o=>o.kind==='paint'&&o.surface==='slippery');
  assert.equal(pieces.length,4);assert.equal(new Set(d.objects.map(o=>o.id)).size,d.objects.length);
  assert.ok(pieces.every(o=>o.minX>=-1&&o.maxX<=1&&o.minZ>=-1&&o.maxZ<=1));
});

test('3D support hits stack new pieces and wall paint stays on the clicked block',()=>{
  const d=fresh(),first=addDraftObject(d,'block',placedObjectDefaults('block',{x:0,y:0,z:0})),
    second=addDraftObject(d,'block',placedObjectDefaults('block',{x:0,y:first.maxY,z:0}));
  assert.equal(first.maxY,second.minY);assert.equal(second.maxY,2);
  assert.equal(placedObjectDefaults('pillar',{x:0,y:2,z:0}).base,2);
  assert.equal(placedObjectDefaults('stairs',{x:0,y:2,z:0}).base,2);
  assert.equal(placedObjectDefaults('lowgap',{x:0,y:2,z:0}).bottom,2.35);
  addDraftObject(d,'paint',{surface:'sticky',face:'west',targetId:second.id,
    minX:-.6,maxX:-.4,minZ:-.5,maxZ:.5,base:1});
  const c=compileDraft(d).editorFixtures,wall=c.find(o=>o.type==='sticky-wall');
  assert.equal(wall.sourceId,d.objects.at(-1).id);assert.equal(wall.minY,1);assert.equal(wall.maxY,2);
  assert.equal(c.filter(o=>o.type==='sticky-wall').length,1);
  const s=new WorkbenchSimulation(d);assert.equal(s.fluid.particles.length,65);
  assert.equal(supportedGroundAt({x:0,y:.2,z:0},s.fluid.radius,s.activeColliders()),0);
  assert.equal(supportedGroundAt({x:0,y:2.07,z:0},s.fluid.radius,s.activeColliders()),2);
});
test('painted block moves, rotates, duplicates, deletes and undoes as one authored fixture',()=>{
  const d=fresh(),block=addDraftObject(d,'block',{minX:-1,maxX:1,minZ:-.5,maxZ:.5,minY:0,maxY:1}),
    coat=addDraftObject(d,'paint',{surface:'sticky',face:'west',targetId:block.id,
      minX:-1.1,maxX:-.9,minZ:-.3,maxZ:.3,base:0});
  const walls=()=>compileDraft(d).editorFixtures.filter(c=>c.type==='sticky-wall');
  assert.equal(walls().length,1);
  moveDraftObject(d,block.id,3,1);
  assert.equal(coat.minX,1.9);assert.equal(walls().length,1);
  rotateDraftObject(d,block.id);
  assert.equal(coat.face,'north');assert.equal(walls().length,1);
  const clone=duplicateDraftObject(d,block.id),clonePaint=d.objects.find(o=>o.targetId===clone.id);
  assert.ok(clonePaint);assert.equal(clonePaint.face,'north');assert.equal(walls().length,2);
  const history=new DraftHistory(d);deleteDraftObject(d,block.id);history.commit(d);
  assert.equal(d.objects.some(o=>o.id===coat.id),false);assert.equal(walls().length,1);
  const restored=history.undo();assert.equal(restored.objects.some(o=>o.id===coat.id),true);
  assert.equal(compileDraft(restored).editorFixtures.filter(c=>c.type==='sticky-wall').length,2);
  assert.deepEqual(validateDraft(restored).errors,[]);
});

test('a painted real block face climbs with coat and followers; plain wall does not',()=>{
  const make=painted=>{const d=fresh();d.objects.find(o=>o.kind==='start').x=-.65;d.objects.find(o=>o.kind==='start').z=0;
    addDraftObject(d,'block',{minX:-.2,maxX:.8,minZ:-1,maxZ:1,minY:0,maxY:1.3});
    if(painted)addDraftObject(d,'paint',{surface:'sticky',face:'west',minX:-.3,maxX:.2,minZ:-.9,maxZ:.9,base:0});
    return d;};
  const plain=new WorkbenchSimulation(make(false)),grip=new WorkbenchSimulation(make(true));
  for(const s of [plain,grip])s.garden.phase='playing';
  let climbed=false;for(let i=0;i<180;i++){plain.step({x:1});grip.step({x:1});
    if(grip.brain.y>1.38&&grip.brain.x>0)climbed=true;}
  assert.ok(plain.brain.y<.5&&plain.brain.x<-.2);
  assert.ok(climbed,'painted exterior face must carry the brain and living body onto the top');
  assert.equal(grip.fluid.particles.length,65);
  assert.ok(grip.fluid.attachedCount>=30);
  const bad=make(false);addDraftObject(bad,'paint',{surface:'sticky',face:'west',minX:3,maxX:4,minZ:2,maxZ:3,base:0});
  assert.ok(validateDraft(bad).errors.some(e=>e.includes('real block face')));
});

test('editor play enables real tendril casting without replacing fixtures on all seven presets',()=>{
  for(const id of [1,2,3,4,5,6,7]){const d=draftFromPreset(id),s=new WorkbenchSimulation(d);
    s.garden.phase='playing';s.gardenInputArmed=true;
    assert.deepEqual(gardenColliders(compileDraft(d)).length,gardenColliders(GARDEN_LEVELS[id-1]).length);
    assert.equal(s.castTendril({x:s.brain.x+1.5,z:s.brain.z}),true,`preset ${id}`);
    assert.equal(s.tendril.count,1);
    assert.equal(s.fluid.particles.length,297);
  }
});

test('casting is a campaign-wide garden control, while F shedding stays an editor capability without a gate',()=>{
  for(const id of [1,2,3,4,5]){
    const sim=new PuddleSimulation();sim.startGarden(id);sim.garden.phase='playing';sim.gardenInputArmed=true;
    assert.equal(gardenCanCast(sim.gardenLevel),true);
    assert.equal(sim.castTendril({x:sim.brain.x+1.5,z:sim.brain.z}),true,`campaign ${id}`);
    assert.equal(sim.tendril.count,1);
    sim.step({recallToggle:true});assert.equal(sim.tendril.recalling,true);
  }
  const editor=new WorkbenchSimulation(fresh());editor.garden.phase='playing';
  for(let i=0;i<8;i++)editor.step({shed:true});
  assert.ok(editor.fluid.particles.some(p=>p.feedstock&&p.patchId===undefined));
  assert.equal(editor.fluid.particles.length,65);
  assert.ok(editor.fluid.coatContacts(editor.activeColliders()).length>=8);
});
