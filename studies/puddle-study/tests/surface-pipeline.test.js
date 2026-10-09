import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createParticleSurface} from '../src/particle-surface.js';
import {buildSurfaceJob} from '../src/particle-surface-worker.js';
import {createSurfacePipeline} from '../src/surface-pipeline.js';
import {GARDEN,HOLLOW_CROWN,gardenColliders} from '../src/garden-level.js';
import {commitEditorSolid} from '../src/editor-solid.js';

const particles=[
  {x:1.1,y:2.24,z:-2.5},{x:1.19,y:2.25,z:-2.48},{x:1.08,y:2.29,z:-2.43},
  {x:1.3,y:2.23,z:-2.55},{x:1.35,y:2.27,z:-2.51}
];
const coords=ps=>Float64Array.from(ps.flatMap(p=>[p.x,p.y,p.z]));
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));

test('bounded collider masks produce the same field and mesh as the full collider path',()=>{
  const near=(x,y,z)=>[0,.055,-.055].flatMap(dx=>[0,.055,-.055].map(dz=>
    ({x:x+dx,y:y+dx*.2,z:z+dz})));
  const roof={type:'roof',minX:-.3,maxX:.3,minZ:-.5,maxZ:.5,bottom:.1,top:.75};
  const box={type:'box',minX:-.2,maxX:.25,minY:0,maxY:.55,minZ:-.25,maxZ:.25};
  const cylinder={type:'cylinder',x:0,z:0,radius:.22,base:0,height:.7};
  const far=[{...roof,minX:10,maxX:11},{...box,minX:10,maxX:11},
    {...cylinder,x:10}];
  const stairs=[{type:'editor-stairs',minX:-.5,maxX:.5,minZ:-.5,maxZ:.5,axis:'x',
    base:.15,rise:.45},{type:'editor-stairs',minX:-.3,maxX:.3,minZ:-.3,maxZ:.3,
    axis:'z',reverse:true,base:.25,rise:.35}];
  const solid=commitEditorSolid([{type:'box',minX:-.24,maxX:.24,minY:0,maxY:.7,
    minZ:-.24,maxZ:.24}],[{shape:'cylinder',x:0,y:.35,z:0,radius:.08,height:.8}]);
  const cases=[
    ['mixed and distant primitives',near(0,.48,0),[...far,roof,box,cylinder]],
    ['raised geometry',near(0,1.5,0),[{...box,minY:1.2,maxY:1.8},
      {...cylinder,base:1.2,height:1.8}]],
    ['funnels, terraces and overlapping stairs',near(0,.38,0),[
      {type:'terraces',height:.6,steps:[{x:-.5,width:.6,drop:.3}]},...stairs,
      {type:'funnel',x:0,z:0,radius:.7,bottomRadius:.2,depth:.3},
      {type:'funnel',x:.1,z:.1,radius:.6,bottomRadius:.2,depth:.2}]],
    ['bounds touching primitives',near(.25,.35,.2),[box,cylinder,
      {...box,minX:.5,maxX:.8},{...roof,minZ:.5,maxZ:.8}]],
    ['empty colliders',near(0,.3,0),[]],
    ['committed solid',near(0,.35,0),[...far,solid]],
    ['campaign level six',near(6.8,5.8,-4.5),gardenColliders(HOLLOW_CROWN)],
  ];
  for(const [name,particles,colliders] of cases)for(const maskTerrain of [true,false]){
    const filtered=createParticleSurface(new THREE.MeshBasicMaterial(),28);
    const full=createParticleSurface(new THREE.MeshBasicMaterial(),28,{filterColliders:false});
    filtered.update(particles,colliders,.067,{maskTerrain});
    full.update(particles,colliders,.067,{maskTerrain});
    assert.deepEqual(Array.from(filtered.mesh.field),Array.from(full.mesh.field),`${name} field; terrain=${maskTerrain}`);
    assert.equal(filtered.mesh.count,full.mesh.count,`${name} count`);
    assert.deepEqual(filtered.mesh.position.toArray(),full.mesh.position.toArray(),`${name} position`);
    assert.deepEqual(filtered.mesh.scale.toArray(),full.mesh.scale.toArray(),`${name} scale`);
    for(const attr of ['position','normal'])assert.deepEqual(
      Array.from(filtered.mesh.geometry.attributes[attr].array.slice(0,filtered.mesh.count*3)),
      Array.from(full.mesh.geometry.attributes[attr].array.slice(0,full.mesh.count*3)),`${name} ${attr}`);
    filtered.mesh.geometry.dispose();full.mesh.geometry.dispose();
  }
});

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
