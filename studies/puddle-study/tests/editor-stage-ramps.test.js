import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createEditorStageView} from '../src/editor-stage-view.js';
import {createBlankDraft,compileDraft} from '../src/editor-workbench.js';
import {EMBER_CASCADE} from '../src/garden-level.js';

const ray=new THREE.Raycaster();
function visibleHeight(mesh,x,z){
  mesh.updateWorldMatrix(true,false);
  ray.set(new THREE.Vector3(x,15,z),new THREE.Vector3(0,-1,0));
  return ray.intersectObject(mesh,false)[0]?.point.y;
}
function assertSlopeEnds(mesh,fixture,heights){
  const axis=fixture.axis==='x'?'x':'z',min=axis==='x'?fixture.minX:fixture.minZ,
    max=axis==='x'?fixture.maxX:fixture.maxZ;
  for(const fraction of [.025,.5,.975]){
    const position=min+(max-min)*fraction,x=axis==='x'?position:(fixture.minX+fixture.maxX)/2,
      z=axis==='z'?position:(fixture.minZ+fixture.maxZ)/2,
      expected=heights[0]+(heights[1]-heights[0])*fraction,actual=visibleHeight(mesh,x,z);
    assert.ok(Number.isFinite(actual),`${fixture.sourceId||fixture.editorId} is drawn at ${axis} fraction ${fraction}`);
    assert.ok(Math.abs(actual-expected)<.08,
      `${fixture.sourceId||fixture.editorId} visible height ${actual} follows its physical slope ${expected}`);
  }
}

test('editor stairs and grip ramps span both physical handoffs on each axis and slope direction',()=>{
  const level=compileDraft(createBlankDraft());
  level.editorFixtures=[
    {type:'editor-stairs',sourceId:'z-down',axis:'z',reverse:true,steps:8,minX:-7,maxX:-5,minZ:-3,maxZ:-1,base:0,rise:1.8},
    {type:'editor-stairs',sourceId:'z-up',axis:'z',reverse:false,steps:8,minX:-4,maxX:-2,minZ:-3,maxZ:-1,base:0,rise:1.8},
    {type:'editor-stairs',sourceId:'x-down',axis:'x',reverse:true,steps:8,minX:-1,maxX:1,minZ:-3,maxZ:-1,base:0,rise:1.8},
    {type:'editor-stairs',sourceId:'x-up',axis:'x',reverse:false,steps:8,minX:2,maxX:4,minZ:-3,maxZ:-1,base:0,rise:1.8},
    {type:'grip-ramp',editorId:'grip-x',axis:'x',minX:5,maxX:7,minZ:-3,maxZ:-1,minHeight:1,maxHeight:2.8},
    {type:'grip-ramp',editorId:'grip-z',minX:-7,maxX:-5,minZ:1,maxZ:3,northHeight:2.8,southHeight:1},
  ];
  const view=createEditorStageView(new THREE.Scene(),level);
  try{
    for(const fixture of level.editorFixtures){
      const id=fixture.sourceId||fixture.editorId,mesh=view.group.children.find(o=>o.userData.editorId===id);
      assert.ok(mesh,`${id} has a rendered ramp mesh`);
      const heights=fixture.type==='editor-stairs'?
        fixture.reverse?[fixture.base+fixture.rise,fixture.base]:[fixture.base,fixture.base+fixture.rise]:
        fixture.axis==='x'?[fixture.minHeight,fixture.maxHeight]:[fixture.northHeight,fixture.southHeight];
      assertSlopeEnds(mesh,fixture,heights);
    }
  }finally{view.dispose();}
});

test('all three Ember Cascade slopes visibly reach their trimmed landings and stair coins',()=>{
  const view=createEditorStageView(new THREE.Scene(),EMBER_CASCADE);
  try{
    for(const id of ['ember-west-descent','ember-east-descent','ember-final-descent']){
      const fixture=EMBER_CASCADE.editorFixtures.find(o=>o.sourceId===id),
        mesh=view.group.children.find(o=>o.userData.editorId===id);
      assert.ok(mesh,`${id} has a rendered ramp mesh`);
      assertSlopeEnds(mesh,fixture,[fixture.base+fixture.rise,fixture.base]);
      for(const coin of EMBER_CASCADE.gold.filter(g=>g[1]>fixture.minZ&&g[1]<fixture.maxZ&&
        g[0]>(fixture.minX-.2)&&g[0]<(fixture.maxX+.2)&&g[2]>fixture.base-.01&&g[2]<fixture.base+fixture.rise+.01)){
        assert.ok(Math.abs(visibleHeight(mesh,coin[0],coin[1])-coin[2])<.08,
          `${id} visible slope supports the coin at ${coin[1]}`);
      }
    }
  }finally{view.dispose();}
});
