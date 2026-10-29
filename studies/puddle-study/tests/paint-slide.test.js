import test from 'node:test';
import assert from 'node:assert/strict';
import {createBlankDraft,addDraftObject,compileDraft,importDraft,exportDraft,resizeDraftFootprint} from '../src/editor-workbench.js';
import {reconcileAttachedPaint,paintFaceForHit,paintArea} from '../src/editor-paint.js';
import {validatePublishedLevel} from '../src/published-level-schema.js';
import {gardenColliders} from '../src/garden-level.js';
import {groundAt} from '../src/colliders.js';
import {floorPaintApplies,paintSurfaceSlope} from '../src/surface-paint.js';
import {ParticleFluid} from '../src/particle-fluid.js';

test('a stale wall patch is clipped to its attached face for import, export and host edits',()=>{
  const draft=createBlankDraft();
  const block=addDraftObject(draft,'block',{minX:-3.25,maxX:-2.75,minZ:-1,maxZ:1,minY:0,maxY:2});
  const coat=addDraftObject(draft,'paint',{surface:'sticky',face:'west',targetId:block.id,
    base:0,minY:0,maxY:4,minX:-3.265,maxX:-3.235,minZ:-1,maxZ:1});
  const raw={format:'puddle-level',version:3,draft};
  assert.throws(()=>validatePublishedLevel(raw),/Wall paint must fit/);
  const restored=importDraft(JSON.stringify(raw));
  assert.equal(restored.objects.find(o=>o.id===coat.id).maxY,2);
  validatePublishedLevel(JSON.parse(exportDraft(restored)));
  const lowered=restored.objects.find(o=>o.id===block.id);lowered.maxY=1.3;
  reconcileAttachedPaint(restored);
  assert.equal(restored.objects.find(o=>o.id===coat.id).maxY,1.3);
  assert.equal(importDraft(exportDraft(restored)).objects.find(o=>o.id===coat.id).maxY,1.3);
  const once=JSON.stringify(restored);reconcileAttachedPaint(restored);
  assert.equal(JSON.stringify(restored),once,'repair is idempotent');
});

test('missing hosts and fully disjoint coats remain visible as publication errors',()=>{
  const draft=createBlankDraft();
  const block=addDraftObject(draft,'block',{minX:-1,maxX:1,minZ:-1,maxZ:1,minY:0,maxY:2});
  const missing=addDraftObject(draft,'paint',{surface:'slippery',face:'floor',targetId:'absent',base:0,
    minX:-1,maxX:1,minZ:-1,maxZ:1});
  reconcileAttachedPaint(draft);
  assert.throws(()=>validatePublishedLevel(JSON.parse(exportDraft(draft))),/missing support/);
  draft.objects=draft.objects.filter(o=>o!==missing);
  addDraftObject(draft,'paint',{surface:'sticky',face:'floor',targetId:block.id,base:2,
    minX:3,maxX:4,minZ:3,maxZ:4});
  reconcileAttachedPaint(draft);
  assert.throws(()=>validatePublishedLevel(JSON.parse(exportDraft(draft))),/attached surface/);
});

test('grip platform wall paint stays on its authored platform through repair and resize',()=>{
  for(const face of ['west','east','north','south']){
    const draft=createBlankDraft();
    const grip={id:'test-grip',kind:'grip',climbHeight:2,
      platform:{type:'box',minX:-2,maxX:2,minZ:-1,maxZ:1,minY:0,maxY:2},
      ramp:{type:'grip-ramp',axis:'x',minX:-4,maxX:-2,minZ:-1,maxZ:1,minHeight:0,maxHeight:2}};
    draft.objects.push(grip);
    const x=face==='west'?-2:face==='east'?2:0,z=face==='north'?-1:face==='south'?1:0;
    const selected=paintFaceForHit(draft,{targetId:grip.id,face,x,y:1,z});
    assert.equal(selected.error,undefined);
    const coat=addDraftObject(draft,'paint',{...paintArea(selected,null,null,'fill'),surface:'sticky'});
    const authored={...coat};
    reconcileAttachedPaint(draft);
    assert.deepEqual(coat,authored,'wall is never reassigned to the adjacent slope');
    const restored=importDraft(exportDraft(draft));
    validatePublishedLevel(JSON.parse(exportDraft(restored)));
    assert.deepEqual(restored.objects.find(o=>o.id===coat.id),authored);
    resizeDraftFootprint(restored,grip.id,'depth',4);
    const resized=restored.objects.find(o=>o.id===coat.id);
    if(face==='west'||face==='east')assert.deepEqual([resized.minZ,resized.maxZ],[-2,2]);
    else assert.ok(Math.abs((resized.minZ+resized.maxZ)/2-(face==='north'?-2:2))<1e-9);
    validatePublishedLevel(JSON.parse(exportDraft(restored)));
  }
});

const slope={type:'editor-stairs',axis:'z',reverse:true,minX:-1,maxX:1,minZ:-2,maxZ:2,base:0,rise:4};
const flat={type:'flat'};
const world=painted=>[{type:'boundary',minX:-7,maxX:7,minZ:-7,maxZ:7},flat,slope,
  ...(painted?[{type:'slip',face:'floor',targetId:'ramp',minX:-1,maxX:1,minZ:-2,maxZ:2,owner:slope}]:[])];
const runSlide=(colliders,frames=120)=>{
  const fluid=new ParticleFluid({x:0,z:-.5,size:.7,seedCount:70});
  for(const p of fluid.particles){const y=groundAt(p.x,p.z,[flat,slope]).height;p.y+=y;p.py+=y;}
  fluid.samplePairs();fluid.updateComponents(colliders);
  let contacts=0;
  for(let i=0;i<frames;i++){fluid.step(1/60,{puddle:true,x:0,z:0},colliders);
    if(fluid.brainSlipping)contacts++;}
  return {fluid,contacts};
};

test('slippery ramp carries the brain and connected flesh downhill without input',()=>{
  const dry=runSlide(world(false)),wet=runSlide(world(true));
  assert.ok(wet.contacts>50,'core actually contacts the painted top');
  assert.ok(wet.fluid.brain.z>dry.fluid.brain.z+.35,'brain slides beyond ordinary body settling');
  assert.ok(wet.fluid.centroid().z>dry.fluid.centroid().z+.25,'body follows the slide');
});

test('sliding survives a committed solid and respects the owner slope on both axes',()=>{
  const draft=createBlankDraft();
  const ramp=addDraftObject(draft,'stairs',{x:0,z:0,axis:'z',reverse:true,run:4,width:2,rise:4,steps:10,base:0});
  addDraftObject(draft,'paint',{surface:'slippery',face:'floor',targetId:ramp.id,base:2,
    minX:-1,maxX:1,minZ:-2,maxZ:2});
  addDraftObject(draft,'cutter',{x:5,z:0,y:1,height:1,shape:'box',width:1,depth:1,
    rotation:{x:0,y:0,z:0}});
  const level=compileDraft(draft),colliders=gardenColliders(level),slide=runSlide(colliders);
  assert.ok(level.csgSolid);
  assert.ok(slide.contacts>30);
  assert.ok(slide.fluid.brain.z>0,'the core runs toward the low end of the ramp');
  assert.deepEqual(paintSurfaceSlope({owner:slope},0,-.5),{dx:0,dz:-1});
  assert.deepEqual(paintSurfaceSlope({owner:{...slope,axis:'x',reverse:false}},0,-.5),{dx:2,dz:0});
});

test('a painted slope does not act through a different support or in the air',()=>{
  const paint=world(true).at(-1),colliders=world(true),r=.05;
  assert.equal(floorPaintApplies(paint,{x:0,z:-.5,y:5},r,colliders),false);
  assert.equal(floorPaintApplies(paint,{x:0,z:4,y:.1},r,colliders),false);
  assert.equal(floorPaintApplies(paint,{x:0,z:-.5,y:.1},r,colliders),false);
  assert.deepEqual(paintSurfaceSlope({owner:{type:'box',maxY:2}},0,0),{dx:0,dz:0});
});
