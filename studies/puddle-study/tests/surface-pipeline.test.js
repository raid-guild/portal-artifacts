import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createParticleSurface} from '../src/particle-surface.js';
import {buildSurfaceJob} from '../src/particle-surface-worker.js';
import {createSurfacePipeline} from '../src/surface-pipeline.js';
import {GARDEN,gardenColliders} from '../src/garden-level.js';
import {commitEditorSolid} from '../src/editor-solid.js';

const particles=[
  {x:1.1,y:2.24,z:-2.5},{x:1.19,y:2.25,z:-2.48},{x:1.08,y:2.29,z:-2.43},
  {x:1.3,y:2.23,z:-2.55},{x:1.35,y:2.27,z:-2.51}
];
const coords=ps=>Float64Array.from(ps.flatMap(p=>[p.x,p.y,p.z]));
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));

test('worker field and used geometry match synchronous marching cubes at both resolutions',()=>{
  for(const resolution of [28,48])for(const maskTerrain of [true,false]){
    const colliders=gardenColliders(GARDEN),reference=createParticleSurface(new THREE.MeshBasicMaterial(),resolution);
    reference.update(particles,colliders,.067,{maskTerrain});
    const cache=new Map();
    const result=buildSurfaceJob({id:1,generation:0,surfaceId:1,resolution,coords:coords(particles),colliders,radius:.067,maskTerrain},cache);
    const actual=cache.get(resolution).mesh,expected=reference.mesh;
    assert.deepEqual(Array.from(actual.field),Array.from(expected.field));
    assert.equal(result.count,expected.count);
    assert.deepEqual(result.position,expected.position.toArray());
    assert.deepEqual(result.scale,expected.scale.toArray());
    assert.deepEqual(Array.from(result.positions),Array.from(expected.geometry.attributes.position.array.slice(0,result.count*3)));
    assert.deepEqual(Array.from(result.normals),Array.from(expected.geometry.attributes.normal.array.slice(0,result.count*3)));
    expected.geometry.dispose();actual.geometry.dispose();
  }
});

class FakeWorker{
  constructor({fail=false,replyError=false}={}){this.fail=fail;this.replyError=replyError;this.terminated=false;
    this.cache=new Map();this.solids=new Map();this.registrations=0;}
  postMessage(job){
    if(this.fail)throw Error('worker unavailable');
    if(job.type==='clear-solids'){this.solids.clear();return;}
    if(job.type==='register-solid'){this.solids.set(job.revision,{type:'editor-solid-mesh',revision:job.revision,
      vertices:job.vertices,indices:job.indices});this.registrations++;return;}
    setTimeout(()=>{if(!this.terminated)this.onmessage?.({data:this.replyError?
      {id:job.id,generation:job.generation,surfaceId:job.surfaceId,error:'worker build failed'}:
      buildSurfaceJob({...job,colliders:job.colliders.map(c=>c.type==='editor-solid-mesh'?
        this.solids.get(c.revision):c)},this.cache)});},8);
  }
  terminate(){this.terminated=true;}
}

test('one-flight queue drops stale generations and keeps latest completed mesh',async()=>{
  const worker=new FakeWorker(),pipeline=createSurfacePipeline({createWorker:()=>worker});
  const surface=pipeline.create(new THREE.MeshBasicMaterial(),28,{priority:0});
  surface.update(particles,[],.067);
  pipeline.invalidate();
  const moved=particles.map(p=>({...p,x:p.x+.5}));
  surface.update(moved,[],.067);
  await sleep(100);
  const expected=createParticleSurface(new THREE.MeshBasicMaterial(),28);
  expected.update(moved,[],.067);
  assert.equal(pipeline.stats.discarded,1);
  assert.equal(pipeline.stats.completed,1);
  assert.equal(surface.mesh.count,expected.mesh.count);
  assert.deepEqual(Array.from(surface.mesh.geometry.attributes.position.array.slice(0,surface.mesh.count*3)),
    Array.from(expected.mesh.geometry.attributes.position.array.slice(0,expected.mesh.count*3)));
  pipeline.dispose();expected.mesh.geometry.dispose();
  assert.equal(worker.terminated,true);
});

test('rapid updates coalesce to the newest pending particle snapshot',async()=>{
  const pipeline=createSurfacePipeline({createWorker:()=>new FakeWorker()});
  const surface=pipeline.create(new THREE.MeshBasicMaterial(),28,{priority:0});
  surface.update(particles,[],.067);
  const moved=particles.map(p=>({...p,x:p.x+.2}));
  const newest=particles.map(p=>({...p,x:p.x+.4}));
  surface.update(moved,[],.067);
  surface.update(newest,[],.067);
  await sleep(100);
  const expected=createParticleSurface(new THREE.MeshBasicMaterial(),28);
  expected.update(newest,[],.067);
  assert.equal(pipeline.stats.completed,2);
  assert.equal(surface.mesh.count,expected.mesh.count);
  assert.deepEqual(Array.from(surface.mesh.geometry.attributes.position.array.slice(0,surface.mesh.count*3)),
    Array.from(expected.mesh.geometry.attributes.position.array.slice(0,expected.mesh.count*3)));
  pipeline.dispose();expected.mesh.geometry.dispose();
});

test('worker post failure computes in-flight geometry synchronously',()=>{
  const pipeline=createSurfacePipeline({createWorker:()=>new FakeWorker({fail:true})});
  const surface=pipeline.create(new THREE.MeshBasicMaterial(),28);
  surface.update(particles,[],.067);
  const expected=createParticleSurface(new THREE.MeshBasicMaterial(),28);
  expected.update(particles,[],.067);
  assert.equal(pipeline.workerEnabled,false);
  assert.equal(surface.mesh.count,expected.mesh.count);
  pipeline.dispose();expected.mesh.geometry.dispose();
});

test('worker build error rebuilds the in-flight snapshot with no pending update',async()=>{
  const pipeline=createSurfacePipeline({createWorker:()=>new FakeWorker({replyError:true})});
  const surface=pipeline.create(new THREE.MeshBasicMaterial(),28);
  surface.update(particles,[],.067);
  await sleep(40);
  const expected=createParticleSurface(new THREE.MeshBasicMaterial(),28);
  expected.update(particles,[],.067);
  assert.equal(pipeline.workerEnabled,false);
  assert.equal(pipeline.stats.failed,1);
  assert.equal(surface.mesh.count,expected.mesh.count);
  assert.deepEqual(Array.from(surface.mesh.geometry.attributes.position.array.slice(0,surface.mesh.count*3)),
    Array.from(expected.mesh.geometry.attributes.position.array.slice(0,expected.mesh.count*3)));
  pipeline.dispose();expected.mesh.geometry.dispose();
});

test('committed collider is registered once and worker output matches synchronous masked geometry',async()=>{
  const solid=commitEditorSolid([{type:'box',minX:0,maxX:2,minY:0,maxY:3,minZ:-3,maxZ:-1}],
    [{shape:'cylinder',x:1,y:2,z:-2,radius:.35,height:2,
      rotation:{x:17,y:0,z:43}}]);
  const worker=new FakeWorker(),pipeline=createSurfacePipeline({createWorker:()=>worker});
  const surface=pipeline.create(new THREE.MeshBasicMaterial(),28);
  surface.update(particles,[solid],.067);
  await sleep(40);
  assert.equal(worker.registrations,1);
  const shifted=particles.map(p=>({...p,x:p.x+.03}));
  surface.update(shifted,[solid],.067);await sleep(40);
  assert.equal(worker.registrations,1);
  const reference=createParticleSurface(new THREE.MeshBasicMaterial(),28);
  reference.update(shifted,[solid],.067);
  assert.equal(surface.mesh.count,reference.mesh.count);
  assert.deepEqual(Array.from(surface.mesh.geometry.attributes.position.array.slice(0,surface.mesh.count*3)),
    Array.from(reference.mesh.geometry.attributes.position.array.slice(0,reference.mesh.count*3)));
  pipeline.dispose();reference.mesh.geometry.dispose();
});

test('stale worker error skips old generation and rebuilds the latest pending snapshot',async()=>{
  const pipeline=createSurfacePipeline({createWorker:()=>new FakeWorker({replyError:true})});
  const surface=pipeline.create(new THREE.MeshBasicMaterial(),28);
  surface.update(particles,[],.067);
  pipeline.invalidate();
  const newest=particles.map(p=>({...p,x:p.x+.5}));
  surface.update(newest,[],.067);
  await sleep(40);
  const expected=createParticleSurface(new THREE.MeshBasicMaterial(),28);
  expected.update(newest,[],.067);
  assert.equal(pipeline.workerEnabled,false);
  assert.equal(surface.mesh.count,expected.mesh.count);
  assert.deepEqual(Array.from(surface.mesh.geometry.attributes.position.array.slice(0,surface.mesh.count*3)),
    Array.from(expected.mesh.geometry.attributes.position.array.slice(0,expected.mesh.count*3)));
  pipeline.dispose();expected.mesh.geometry.dispose();
});
