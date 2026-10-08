import test from 'node:test';
import assert from 'node:assert/strict';
import {createBlankDraft,addDraftObject,clearDraftObjects,compileDraft,resetDraftPaint,validateDraft,
  DraftHistory,exportDraft,importDraft} from '../src/editor-workbench.js';
import {paintFaceForHit,paintArea,movePaintWithinFace} from '../src/editor-paint.js';

const setup=()=>{const draft=createBlankDraft();
  const block=addDraftObject(draft,'block',{minX:-2,maxX:2,minZ:-1,maxZ:1,minY:0,maxY:2});
  return {draft,block};};

test('fill selects the owner face, while a click in rectangle mode makes no mark',()=>{
  const {draft,block}=setup(),face=paintFaceForHit(draft,{targetId:block.id,face:'floor',x:0,y:2,z:0});
  assert.equal(face.error,undefined);assert.equal(face.targetId,block.id);
  assert.deepEqual([face.minX,face.maxX,face.minZ,face.maxZ],[-2,2,-1,1]);
  assert.equal(paintArea(face,{x:0,z:0},{x:0,z:0},'rectangle'),null);
  assert.equal(paintArea(face,null,null,'fill').maxX,2);
  assert.match(paintFaceForHit(draft,{targetId:block.id,face:'floor',x:0,y:1.3,z:0}).error,/outside top/i);
  assert.match(paintFaceForHit(draft,{targetId:block.id,face:'west',x:-1,y:1,z:0}).error,/outside wall/i);
  assert.match(paintFaceForHit(draft,{targetId:block.id,face:'north',x:0,y:1,z:-1}).error||'',/^$/);
  assert.match(paintFaceForHit(draft,{targetId:block.id,face:'floor',x:0,y:2,z:0}).error||'',/^$/);
});

test('vertical rectangle uses wall plane Y and compiles the same physical climb span',()=>{
  const {draft,block}=setup(),face=paintFaceForHit(draft,{targetId:block.id,face:'west',x:-2,y:.6,z:0});
  const area=paintArea(face,{x:-2,y:.5,z:-.8},{x:-2,y:1.25,z:.4},'rectangle');
  assert.ok(area);assert.deepEqual([area.minY,area.maxY],[.5,1.25]);
  const coat=addDraftObject(draft,'paint',{...area,surface:'sticky'});
  assert.deepEqual(validateDraft(draft).errors,[]);
  const wall=compileDraft(draft).editorFixtures.find(c=>c.type==='sticky-wall'&&c.sourceId===coat.id);
  assert.ok(wall);assert.deepEqual([wall.minY,wall.maxY],[.5,1.25]);
  assert.equal(wall.minZ,-.8);assert.equal(wall.maxZ,.4);
  assert.ok(wall.maxX-wall.minX<.04);
});

test('new paint replaces only overlap on same face; Normal clears a partial vertical region',()=>{
  const {draft,block}=setup(),face=paintFaceForHit(draft,{targetId:block.id,face:'west',x:-2,y:1,z:0});
  const full=paintArea(face,null,null,'fill');
  addDraftObject(draft,'paint',{...full,surface:'sticky'});
  const area=paintArea(face,{x:-2,y:.6,z:-.5},{x:-2,y:1.4,z:.5},'rectangle');
  resetDraftPaint(draft,area);addDraftObject(draft,'paint',{...area,surface:'slippery'});
  const sticky=draft.objects.filter(o=>o.kind==='paint'&&o.surface==='sticky');
  assert.equal(sticky.length,4);assert.ok(sticky.every(o=>o.maxY<=.6||o.minY>=1.4||o.maxZ<=-.5||o.minZ>=.5));
  resetDraftPaint(draft,area);
  assert.equal(draft.objects.filter(o=>o.kind==='paint'&&o.surface==='slippery').length,0);
  assert.equal(draft.objects.filter(o=>o.kind==='paint'&&o.surface==='sticky').length,4);
});

test('selected patch movement stays on its owner face',()=>{
  const {draft,block}=setup(),face=paintFaceForHit(draft,{targetId:block.id,face:'west',x:-2,y:1,z:0});
  const patch=addDraftObject(draft,'paint',{...paintArea(face,{x:-2,y:.5,z:-.5},{x:-2,y:1,z:0},'rectangle'),surface:'sticky'});
  assert.equal(movePaintWithinFace(draft,patch,5,8,5),true);
  assert.equal(patch.maxZ,1);assert.equal(patch.maxY,2);
  assert.ok(Math.abs(patch.minX+2.015)<.001,'the wall plane does not drift');
});

test('clear all removes every object in one undoable edit without resetting board settings',()=>{
  const {draft}=setup();draft.name='My climb';draft.totalFlesh=72;
  const prior=exportDraft(draft),history=new DraftHistory(draft),count=clearDraftObjects(draft);
  assert.equal(count,3);history.commit(draft);
  assert.equal(draft.objects.length,0);assert.equal(draft.name,'My climb');assert.equal(draft.totalFlesh,72);
  assert.equal(compileDraft(draft).start,null);assert.equal(compileDraft(draft).exit,null);
  assert.match(validateDraft(draft).errors.join(' '),/start point/i);
  assert.match(validateDraft(draft).errors.join(' '),/exit/i);
  assert.deepEqual(history.undo(),importDraft(prior));
});
