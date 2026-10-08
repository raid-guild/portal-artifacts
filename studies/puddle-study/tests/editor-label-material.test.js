import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createBlankDraft,addDraftObject,compileDraft,validateDraft,exportDraft,importDraft,
  DraftHistory,moveDraftObject} from '../src/editor-workbench.js';
import {createEditorStageView} from '../src/editor-stage-view.js';
import {gardenColliders} from '../src/garden-level.js';
import {createPrintedMaterialLibrary} from '../src/printed-material.js';

test('a label survives export, move, and undo without adding a collider',()=>{
  const draft=createBlankDraft(),before=gardenColliders(compileDraft(draft));
  const label=addDraftObject(draft,'label',{text:'A quiet passage',x:0,z:0,base:1,offset:.45});
  assert.deepEqual(validateDraft(draft).errors,[]);
  assert.deepEqual(gardenColliders(compileDraft(draft)),before);
  const history=new DraftHistory(draft);
  moveDraftObject(draft,label.id,2,1);history.commit(draft);
  assert.equal(compileDraft(draft).labels[0].x,2);
  assert.equal(compileDraft(history.undo()).labels[0].x,0);
  assert.equal(importDraft(exportDraft(draft)).objects.find(o=>o.id===label.id).text,'A quiet passage');
  label.text='x'.repeat(121);
  assert.match(validateDraft(draft).errors.join(' '),/Labels need text/);
});

test('labels are projected in the easel, hidden when offscreen, and removed on disposal',()=>{
  const oldDocument=globalThis.document,nodes=[];
  const root={getBoundingClientRect:()=>({width:800,height:600}),append(node){nodes.push(node);}};
  globalThis.document={createElement:()=>({style:{},hidden:true,remove(){this.removed=true;}}),querySelector:()=>null};
  try{
    const draft=createBlankDraft(),text='<img src=x onerror=alert(1)>';
    addDraftObject(draft,'label',{text,x:0,z:0,base:0,offset:.45});
    const scene=new THREE.Scene(),level=compileDraft(draft);
    const view=createEditorStageView(scene,level,{printLibrary:{decorate:material=>material},labelRoot:root});
    const camera=new THREE.PerspectiveCamera(50,4/3,.1,100);camera.position.set(0,8,12);camera.lookAt(0,0,0);camera.updateMatrixWorld();
    const sim={garden:{phase:'playing',gems:[],gold:[]},fluid:{particles:[]},pressure:{opening:0}};
    view.setEditing(true);view.update(sim,camera);
    assert.equal(nodes.length,1);assert.equal(nodes[0].textContent,text);
    assert.equal(nodes[0].hidden,false);assert.ok(parseFloat(nodes[0].style.left)>0);
    camera.position.set(0,8,-12);camera.lookAt(0,0,-30);camera.updateMatrixWorld();view.update(sim,camera);
    assert.equal(nodes[0].hidden,true);
    view.dispose();assert.equal(nodes[0].removed,true);
  }finally{globalThis.document=oldDocument;}
});

test('authored block, terrain, pillar and pickups share printed material roles',()=>{
  const draft=createBlankDraft();addDraftObject(draft,'block',{minX:-1,maxX:1,minZ:-1,maxZ:1,minY:0,maxY:1});
  addDraftObject(draft,'pillar',{x:2,z:0,base:0,radius:.42,height:.75});
  addDraftObject(draft,'gem',{x:3,z:0});addDraftObject(draft,'gold',{x:4,z:0});
  const library=createPrintedMaterialLibrary(),scene=new THREE.Scene();
  for(let i=0;i<2;i++){
    const view=createEditorStageView(scene,compileDraft(draft),{printLibrary:library});
    const roles=new Set(view.group.children.map(mesh=>mesh.material?.userData?.printRole).filter(Boolean));
    for(const role of ['floor','wall','gem','gold'])assert.ok(roles.has(role),`missing ${role}`);
    view.dispose();
  }
  const reusable=new THREE.MeshBasicMaterial({color:0xffffff});
  assert.equal(library.decorate(reusable,'wall').userData.printRole,'wall');
  reusable.dispose();library.dispose();
});
