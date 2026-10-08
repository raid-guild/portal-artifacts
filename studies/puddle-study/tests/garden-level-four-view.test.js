import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {PuddleSimulation} from '../src/simulation.js';
import {REACH_GARDEN} from '../src/garden-level.js';
import {createWeightGardenView} from '../src/weight-garden-view.js';

test('Reach Garden hides collected pieces and becomes invisible outside its active storey',()=>{
  const previousDocument=globalThis.document,previousWidth=globalThis.innerWidth,previousHeight=globalThis.innerHeight;
  globalThis.document={createElement:()=>({style:{},remove(){}}),querySelector:()=>({append(){}})};
  globalThis.innerWidth=1200;globalThis.innerHeight=800;
  try{
    const scene=new THREE.Scene(),view=createWeightGardenView(scene,{level:REACH_GARDEN});
    const sim=new PuddleSimulation();sim.startGarden(4);sim.garden.phase='playing';
    const camera=new THREE.OrthographicCamera(-12,12,8,-8,.1,100);
    camera.position.set(5,18-21.6,26);camera.lookAt(0,.6-21.6,0);camera.updateMatrixWorld();
    const gold=view.group.children.find(o=>o.geometry?.type==='OctahedronGeometry'&&
      Math.abs(o.position.x-REACH_GARDEN.gold[0][0])<.01&&Math.abs(o.position.z-REACH_GARDEN.gold[0][1])<.01);
    assert.ok(gold);view.update(sim,camera);assert.equal(view.group.visible,true);assert.equal(gold.visible,true);
    sim.garden.gold[0].collected=true;sim.garden.gold[0].collectedAt=0;
    view.update(sim,camera);assert.equal(gold.visible,false);
    sim.gardenLevelId=3;sim.descending=false;view.update(sim,camera);assert.equal(view.group.visible,false);
    view.dispose();
  }finally{
    globalThis.document=previousDocument;globalThis.innerWidth=previousWidth;globalThis.innerHeight=previousHeight;
  }
});
