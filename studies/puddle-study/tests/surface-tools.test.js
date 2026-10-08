import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createBlankDraft,addDraftObject,compileDraft,validateDraft,snapDraftObjectToHighest,
  highestDraftSupport,moveDraftObject,rotateDraftObject,duplicateDraftObject,resetDraftPaint,
  resizeDraftFootprint,alignAttachedBasinHeight,deleteDraftObject,
  DraftHistory} from '../src/editor-workbench.js';
import {gardenColliders} from '../src/garden-level.js';
import {groundAt,supportedGroundAt} from '../src/colliders.js';
import {solidInside} from '../src/editor-solid-physics.js';
import {floorPaintApplies,paintSurfaceHeight} from '../src/surface-paint.js';
import {createEditorStageView,editorStageHitInfo} from '../src/editor-stage-view.js';

const raised=()=>{const draft=createBlankDraft();
  const block=addDraftObject(draft,'block',{minX:-2,maxX:2,minZ:-2,maxZ:2,minY:0,maxY:2.2});
  const basin=addDraftObject(draft,'basin',{x:0,z:0,radius:.85,bottomRadius:.36,depth:.7,base:2.2,targetId:block.id});
  return {draft,block,basin};};

test('a raised basin cuts the real block, with a supported clay floor and open mouth',()=>{
  const {draft}=raised(),level=compileDraft(draft),colliders=gardenColliders(level);
  assert.deepEqual(validateDraft(draft).errors,[]);
  assert.equal(groundAt(0,0,colliders).height,0,'terrain remains beneath the raised structure');
  assert.ok(!solidInside(level.csgSolid,0,2,0),'the mouth is open');
  assert.ok(solidInside(level.csgSolid,0,1.43,0),'the block supports the bowl floor');
  assert.ok(Math.abs(supportedGroundAt({x:0,y:1.85,z:0},.067,colliders)-1.5)<.02);
  const scene=new THREE.Scene(),view=createEditorStageView(scene,level),ray=new THREE.Raycaster();
  ray.set(new THREE.Vector3(0,8,0),new THREE.Vector3(0,-1,0));
  const hits=ray.intersectObjects(view.group.children,true).filter(h=>h.object.userData.pickableTerrain);
  assert.ok(hits.length>0);
  assert.ok(Math.abs(hits[0].point.y-1.5)<.03,'no visual cap remains at the old block top');
  view.dispose();
});

test('raised basin validates full rim, clay thickness and an uncut support',()=>{
  const {draft,basin}=raised();
  basin.x=1.7;assert.match(validateDraft(draft).errors.join(' '),/full solid rim/i);
  basin.x=0;draft.objects.find(o=>o.kind==='block').maxY=.25;basin.base=.25;
  assert.match(validateDraft(draft).errors.join(' '),/thickness/i);
  draft.objects.find(o=>o.kind==='block').maxY=2.2;basin.base=2.2;
  addDraftObject(draft,'cutter',{shape:'cylinder',x:0,y:1.3,z:0,radius:.5,height:3,
    rotation:{x:0,y:0,z:0}});
  assert.ok(validateDraft(draft).errors.length,'a through-cut must not silently lose the floor');
});

test('slippery tiles face upward; ramp paint follows its physical owner under CSG',()=>{
  const draft=createBlankDraft(),block=addDraftObject(draft,'block',{minX:-1,maxX:3,minZ:-1,maxZ:1,minY:0,maxY:2});
  const ramp=addDraftObject(draft,'stairs',{x:-2,z:0,axis:'x',reverse:false,run:2,width:1,rise:2,steps:4,base:0});
  addDraftObject(draft,'basin',{x:1,z:0,radius:.45,bottomRadius:.2,depth:.35,base:2,targetId:block.id});
  const paint=addDraftObject(draft,'paint',{surface:'slippery',face:'floor',targetId:ramp.id,
    minX:-2.7,maxX:-1.3,minZ:-.4,maxZ:.4,base:1});
  const level=compileDraft(draft),colliders=gardenColliders(level),coating=level.editorFixtures.find(c=>c.type==='slip');
  assert.deepEqual(validateDraft(draft).errors,[]);
  assert.ok(Math.abs(paintSurfaceHeight(coating,-2,0,colliders)-1)<.01);
  assert.equal(floorPaintApplies(coating,{x:-2,y:1.1,z:0},.067,colliders),true);
  assert.equal(floorPaintApplies(coating,{x:-2,y:.1,z:0},.067,colliders),false);
  const scene=new THREE.Scene(),view=createEditorStageView(scene,level);
  const tiles=view.group.children.find(o=>o.material?.color?.getHex()===0x76c6cf);
  assert.ok(tiles?.geometry.attributes.position.count>0);
  const n=tiles.geometry.attributes.normal;assert.ok(n.getY(0)>0,'the visible face points upward');
  view.dispose();
  const history=new DraftHistory(draft);
  moveDraftObject(draft,ramp.id,-3,0);history.commit(draft);
  assert.ok(Math.abs(paint.minX-(-3.7))<.01);
  rotateDraftObject(draft,ramp.id);history.commit(draft);
  assert.equal(draft.objects.find(o=>o.id===paint.id).targetId,ramp.id);
  const duplicate=duplicateDraftObject(draft,ramp.id);
  assert.equal(draft.objects.filter(o=>o.kind==='paint'&&o.targetId===duplicate.id).length,1);
  resetDraftPaint(draft,{minX:-4,maxX:-2,minZ:-1,maxZ:1,base:0,face:'floor',targetId:ramp.id});
  assert.ok(draft.objects.filter(o=>o.kind==='paint'&&o.targetId===ramp.id).length===0);
  assert.ok(history.undo().objects.some(o=>o.id===paint.id));
});

test('height snap stacks a full block and finds the original top under its own basin',()=>{
  const {draft,block,basin}=raised();
  const upper=addDraftObject(draft,'block',{minX:1,maxX:2,minZ:-.5,maxZ:.5,minY:0,maxY:.5});
  const result=snapDraftObjectToHighest(draft,upper.id);
  assert.equal(result.ok,true);assert.ok(Math.abs(upper.minY-2.2)<.01);
  assert.ok(Math.abs(upper.maxY-2.7)<.01,'thickness is preserved');
  const support=highestDraftSupport(draft,basin.x,basin.z,basin.id);
  assert.equal(support.targetId,block.id);assert.ok(Math.abs(support.height-2.2)<.01);
  basin.base=0;assert.ok(snapDraftObjectToHighest(draft,basin.id).ok);
  assert.ok(Math.abs(basin.base-2.2)<.01);
});

test('resizing a ramp or block carries its paint; a raised basin follows its owner',()=>{
  const {draft,block,basin}=raised();
  basin.x=.5;
  const coat=addDraftObject(draft,'paint',{surface:'slippery',face:'floor',targetId:block.id,
    minX:-1,maxX:0,minZ:-.5,maxZ:.5,base:2.2});
  resizeDraftFootprint(draft,block.id,'width',6);
  assert.ok(Math.abs(coat.minX+1.5)<.001);
  assert.ok(Math.abs(basin.x-.75)<.001);
  moveDraftObject(draft,block.id,1,0);
  assert.ok(Math.abs(basin.x-1.75)<.001);
  rotateDraftObject(draft,block.id);
  assert.deepEqual(validateDraft(draft).errors,[]);
  const copy=duplicateDraftObject(draft,block.id);
  assert.equal(draft.objects.filter(o=>o.kind==='paint'&&o.targetId===copy.id).length,1);
  assert.equal(draft.objects.filter(o=>o.kind==='basin'&&o.targetId===copy.id).length,1);
  assert.deepEqual(validateDraft(draft).errors,[],'a copied block and basin remain playable');
  block.maxY=2.7;alignAttachedBasinHeight(draft,block.id,2.7);
  assert.equal(basin.base,2.7);
  deleteDraftObject(draft,copy.id);
  assert.equal(draft.objects.filter(o=>o.targetId===copy.id).length,0);
  const ramp=addDraftObject(draft,'stairs',{x:-5,z:0,axis:'x',reverse:false,run:2,width:1,rise:2,steps:4,base:0});
  const rampCoat=addDraftObject(draft,'paint',{surface:'slippery',face:'floor',targetId:ramp.id,
    minX:-5.5,maxX:-4.5,minZ:-.25,maxZ:.25,base:1});
  resizeDraftFootprint(draft,ramp.id,'run',4);
  assert.ok(Math.abs(rampCoat.minX+6)<.001);
  assert.ok(Math.abs(rampCoat.maxX+4)<.001);
});

test('duplicating a centered 4-by-4 basin assembly avoids overlapping the original',()=>{
  const {draft,block}=raised();const copy=duplicateDraftObject(draft,block.id);
  assert.ok(copy);
  assert.ok(copy.minX>=block.maxX+.2);
  assert.deepEqual(validateDraft(draft).errors,[]);
});

test('pillar top stays pickable and identifies the selected source',()=>{
  const draft=createBlankDraft(),post=addDraftObject(draft,'pillar',{x:0,z:0,radius:.42,height:1,base:0});
  const view=createEditorStageView(new THREE.Scene(),compileDraft(draft)),ray=new THREE.Raycaster();
  ray.set(new THREE.Vector3(0,4,0),new THREE.Vector3(0,-1,0));
  const hit=ray.intersectObjects(view.group.children,true).find(h=>h.object.userData.pickableTerrain);
  assert.ok(hit);assert.equal(editorStageHitInfo(hit).targetId,post.id);
  view.dispose();
});
