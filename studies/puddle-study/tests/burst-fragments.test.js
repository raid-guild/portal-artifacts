import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createBurstFragments,isBurstFragment} from '../src/burst-fragments.js';

test('all dispersed fragments remain represented without a shared surface sampling domain',()=>{
  const scene=new THREE.Scene(),source=new THREE.MeshBasicMaterial({color:0x86a398,transparent:true,opacity:.8});
  const view=createBurstFragments(scene,source);
  const particles=Array.from({length:300},(_,i)=>({x:i*2,y:1,z:i%3,feedstock:true,burstGroup:i%10}));
  const living={x:0,y:1,z:0},supply={x:1,y:1,z:0,feedstock:true};
  view.update([...particles,living,supply],.067,{offsetY:5});
  assert.equal(view.mesh.count,300);assert.equal(view.mesh.position.y,5);assert.equal(view.mesh.frustumCulled,false);
  assert.equal(view.mesh.material.transparent,false);
  const matrix=new THREE.Matrix4(),position=new THREE.Vector3(),rotation=new THREE.Quaternion(),scale=new THREE.Vector3();
  for(const i of [0,150,299]){
    view.mesh.getMatrixAt(i,matrix);matrix.decompose(position,rotation,scale);
    assert.equal(position.x,particles[i].x);assert.ok(scale.x>=.09,'even isolated remnants have a visible silhouette');
  }
  particles[0].feedstock=false;view.update(particles,.067);assert.equal(view.mesh.count,299,'reclaimed flesh switches back to the body renderer');
  view.update(particles,.067,{active:false});assert.equal(view.mesh.count,0);
  assert.equal(isBurstFragment(living),false);assert.equal(isBurstFragment(supply),false);
  view.dispose();assert.equal(scene.children.length,0);assert.equal(source.opacity,.8);source.dispose();
});
