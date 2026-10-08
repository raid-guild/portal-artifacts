import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {createGardenScenery,disposeGraph,setGardenStoreyVisibility} from '../src/garden-scenery.js';
import {GARDEN_LEVELS,gardenColliders} from '../src/garden-level.js';
import {resolveParticle} from '../src/colliders.js';

const root=new URL('../public/art/tower/',import.meta.url);
const files=['tower-spine-v2.glb','storey-facade-v2.glb','switchback-trim-v2.glb','exit-collar-v2.glb'];

test('garden tower runtime exports are self-contained Y-up glTF assets',()=>{
  for(const file of files){
    const data=readFileSync(new URL(file,root));
    assert.equal(data.toString('ascii',0,4),'glTF',`${file} is a binary glTF`);
    assert.equal(data.readUInt32LE(8),data.length,`${file} has complete bytes`);
    const jsonLength=data.readUInt32LE(12),doc=JSON.parse(data.toString('utf8',20,20+jsonLength));
    assert.equal(doc.asset.version,'2.0');
    assert.ok(doc.meshes.length>0&&doc.materials.length>0);
    assert.ok(doc.materials.every(m=>m.extensions?.KHR_materials_unlit),`${file} keeps flat authored colors`);
    assert.ok((doc.buffers||[]).every(b=>!b.uri),`${file} has no external buffer`);
    assert.ok((doc.images||[]).every(i=>!i.uri),`${file} has no external image`);
  }
  const sky=readFileSync(new URL('../public/art/tower-sky-v3.png',import.meta.url));
  assert.equal(sky.readUInt32BE(16),1536);assert.equal(sky.readUInt32BE(20),1024);
});

test('modeled v3 spine and alternate arcades have distinct bounded, unlit exports',()=>{
  const names=['tower-spine-v3.glb','storey-facade-a-v3.glb','storey-facade-b-v3.glb'];
  const hashes=[];
  for(const name of names){
    const data=readFileSync(new URL(name,root));
    assert.equal(data.toString('ascii',0,4),'glTF');
    assert.equal(data.readUInt32LE(8),data.length);
    const length=data.readUInt32LE(12),doc=JSON.parse(data.toString('utf8',20,20+length));
    const positions=doc.meshes.flatMap(mesh=>mesh.primitives.map(p=>doc.accessors[p.attributes.POSITION]));
    const triangles=doc.meshes.flatMap(mesh=>mesh.primitives).reduce((n,p)=>n+doc.accessors[p.indices].count/3,0);
    assert.ok(triangles>1000&&triangles<(name.includes('spine')?45000:15000));
    assert.ok(doc.materials.every(m=>m.extensions?.KHR_materials_unlit));
    assert.ok((doc.buffers||[]).every(b=>!b.uri));
    assert.ok((doc.images||[]).every(i=>!i.uri));
    assert.ok(positions.every(a=>a.min.every(Number.isFinite)&&a.max.every(Number.isFinite)));
    assert.ok(doc.meshes.every(mesh=>!/preview|deck|collectible/i.test(mesh.name||'')));
    const minY=Math.min(...positions.map(a=>a.min[1])),maxY=Math.max(...positions.map(a=>a.max[1]));
    if(name.includes('spine'))assert.ok(minY<-35&&maxY>9);
    else assert.ok(minY<-7.1&&maxY<.1);
    hashes.push(createHash('sha256').update(data).digest('hex'));
  }
  assert.notEqual(hashes[1],hashes[2],'alternate arcades have different authored geometry');
});

test('v3 GLBs load with finite normals and shared clone resources dispose once',async()=>{
  const loader=new GLTFLoader(),scenes=[];
  for(const name of ['tower-spine-v3.glb','storey-facade-a-v3.glb','storey-facade-b-v3.glb']){
    const data=readFileSync(new URL(name,root));
    const gltf=await new Promise((resolve,reject)=>loader.parse(
      data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength),'',resolve,reject));
    let meshes=0;
    gltf.scene.traverse(object=>{if(!object.isMesh)return;meshes++;
      const position=object.geometry.attributes.position,normal=object.geometry.attributes.normal;
      assert.equal(position.count,normal.count);
      assert.ok(Array.from(normal.array).every(Number.isFinite));
      assert.ok(object.material.name.length>0);
    });
    assert.ok(meshes>=3);scenes.push(gltf.scene);
  }
  const group=new THREE.Group(),source=scenes[0],clone=source.clone(true);
  group.add(source,clone,...scenes.slice(1));
  let geometry=null,material=null;
  source.traverse(o=>{if(o.isMesh&&!geometry){geometry=o.geometry;material=o.material;}});
  let disposedGeometry=0,disposedMaterial=0;
  geometry.addEventListener('dispose',()=>disposedGeometry++);
  material.addEventListener('dispose',()=>disposedMaterial++);
  disposeGraph(group);
  assert.equal(disposedGeometry,1);
  assert.equal(disposedMaterial,1);
});

test('pierced side parapets stay outside the playable X boundary and follow each terrace band',async()=>{
  const loader=new GLTFLoader();
  for(const [name,bands] of [
    ['side-parapet-l1-v3.glb',[[-2,1.62],[2,0]]],
    ['side-parapet-depth-v3.glb',[[-4,2.16],[.4,1.08],[3.7,0]]],
    ['side-parapet-grip-v3.glb',[[-4,2.16],[.4,1.08],[3.7,0]]],
  ]){
    const data=readFileSync(new URL(name,root));
    const scene=(await new Promise((resolve,reject)=>loader.parse(
      data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength),'',resolve,reject))).scene;
    const vertices=[];scene.updateMatrixWorld(true);
    scene.traverse(o=>{if(!o.isMesh)return;
      const positions=o.geometry.attributes.position,normals=o.geometry.attributes.normal;
      assert.equal(positions.count,normals.count);
      assert.ok(Array.from(normals.array).every(Number.isFinite));
      for(let i=0;i<positions.count;i++)vertices.push(new THREE.Vector3().fromBufferAttribute(positions,i).applyMatrix4(o.matrixWorld));
    });
    assert.ok(vertices.length>100);
    assert.ok(vertices.every(v=>Math.abs(v.x)>=8.99&&Math.abs(v.x)<9.5),`${name}: no side wall enters the field`);
    assert.ok(vertices.some(v=>v.x<0)&&vertices.some(v=>v.x>0));
    for(const [z,height] of bands){
      const local=vertices.filter(v=>Math.abs(v.z-z)<.3);
      assert.ok(local.length>10,`${name}: authored band at ${z}`);
      assert.ok(Math.max(...local.map(v=>v.y))>height+.3&&Math.max(...local.map(v=>v.y))<height+.5,
        `${name}: top follows ${height}-metre terrace`);
    }
    disposeGraph(scene);
  }
});

test('rear wings are bounded pierced architecture on the active or predecessor storey',async()=>{
  const loader=new GLTFLoader();
  for(const [name,rear] of [['rear-arch-wings-l1-v3.glb',-5.2],['rear-arch-wings-v3.glb',-6.4]]){
    const data=readFileSync(new URL(name,root));
    const length=data.readUInt32LE(12),doc=JSON.parse(data.toString('utf8',20,20+length));
    const triangles=doc.meshes.flatMap(m=>m.primitives).reduce((n,p)=>n+doc.accessors[p.indices].count/3,0);
    assert.ok(triangles>2000&&triangles<8500);
    assert.ok(doc.materials.every(m=>m.extensions?.KHR_materials_unlit));
    const gltf=await new Promise((resolve,reject)=>loader.parse(
      data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength),'',resolve,reject));
    let minZ=Infinity,maxZ=-Infinity;
    gltf.scene.updateMatrixWorld(true);
    gltf.scene.traverse(o=>{if(!o.isMesh)return;
      const positions=o.geometry.attributes.position,normals=o.geometry.attributes.normal;
      assert.equal(positions.count,normals.count);
      assert.ok(Array.from(normals.array).every(Number.isFinite));
      for(let i=0;i<positions.count;i++){
        const v=new THREE.Vector3().fromBufferAttribute(positions,i).applyMatrix4(o.matrixWorld);
        minZ=Math.min(minZ,v.z);maxZ=Math.max(maxZ,v.z);
      }
    });
    assert.ok(minZ<rear-.2&&maxZ>rear+.3&&maxZ<rear+1,`${name}: roots join rear deck`);
    disposeGraph(gltf.scene);
  }
  const groups=Array.from({length:5},()=>({visible:false})),loaded=new Map();
  for(let active=1;active<=5;active++){
    setGardenStoreyVisibility(groups[0],groups[1],loaded,active,true,groups[2],groups[3],groups[4]);
    for(let i=0;i<5;i++)assert.equal(groups[i].visible,i===active-1||i===active-2,
      `storey ${i+1} visibility during level ${active}`);
  }
});

test('failed side and rear GLBs retain independent fallback after facade load, and late callbacks dispose',()=>{
  const scene=new THREE.Scene(),requests=new Map();
  const scenery=createGardenScenery(scene,{
    loadAsset:(url,onLoad,onError)=>requests.set(url.split('/').pop(),{onLoad,onError}),
    loadSky:()=>{},
  });
  const fallback=(kind,id)=>scene.getObjectByName(`fallback-${kind}-${id}`);
  for(let id=1;id<=5;id++)assert.ok(fallback('side',id)?.visible&&fallback('rear',id)?.visible);
  for(const file of ['storey-facade-a-v3.glb','storey-facade-b-v3.glb'])
    requests.get(file).onLoad({scene:new THREE.Group()});
  assert.equal(scene.getObjectByName('fallback-arcade-1').visible,false);
  requests.get('side-parapet-l1-v3.glb').onError(new Error('missing side'));
  requests.get('rear-arch-wings-l1-v3.glb').onError(new Error('missing rear'));
  assert.equal(fallback('side',1).visible,true);
  assert.equal(fallback('rear',1).visible,true);
  for(const file of ['side-parapet-depth-v3.glb','rear-arch-wings-v3.glb'])
    requests.get(file).onLoad({scene:new THREE.Group()});
  for(let id=2;id<=4;id++)assert.equal(fallback('side',id).visible,false);
  for(let id=2;id<=5;id++)assert.equal(fallback('rear',id).visible,false);
  assert.equal(fallback('side',5).visible,true,'Grip-specific side fallback lasts until its own asset loads');
  scenery.dispose();
  const geometry=new THREE.BoxGeometry(1,1,1),material=new THREE.MeshBasicMaterial();
  let disposedGeometry=0,disposedMaterial=0;
  geometry.addEventListener('dispose',()=>disposedGeometry++);
  material.addEventListener('dispose',()=>disposedMaterial++);
  const late=new THREE.Group();late.add(new THREE.Mesh(geometry,material));
  requests.get('side-parapet-grip-v3.glb').onLoad({scene:late});
  assert.equal(disposedGeometry,1);assert.equal(disposedMaterial,1);
});

test('all five front crests visibly meet the physical boundary through asset load and fallback',()=>{
  const scene=new THREE.Scene(),requests=new Map();
  const scenery=createGardenScenery(scene,{
    loadAsset:(url,onLoad,onError)=>requests.set(url.split('/').pop(),{onLoad,onError}),
    loadSky:()=>{},
  });
  const check=(id)=>{
    scene.updateMatrixWorld(true);
    const level=GARDEN_LEVELS[id-1],crest=scene.getObjectByName(`front-boundary-crest-${id}`);
    const stone=scene.getObjectByName(`front-boundary-stone-${id}`);
    assert.ok(crest&&stone&&scene.getObjectByName(`front-boundary-ink-${id}`));
    assert.equal(crest.userData.playableBoundaryZ,level.boundary.maxZ);
    const box=new THREE.Box3().setFromObject(stone),offset=-(id-1)*7.2;
    assert.ok(Math.abs(box.min.x-(level.boundary.minX-.4))<1e-6);
    assert.ok(Math.abs(box.max.x-(level.boundary.maxX+.4))<1e-6);
    assert.ok(Math.abs(box.min.z-level.boundary.maxZ)<1e-6);
    assert.ok(Math.abs(box.max.z-(level.boundary.maxZ+.4))<1e-6);
    assert.ok(Math.abs(box.min.y-(offset-.16))<1e-6);
    assert.ok(Math.abs(box.max.y-(offset+.16))<1e-6);
    const p={x:2.4,y:.3,z:5,px:2.4,py:.3,pz:4.7,vx:0,vy:0,vz:0};
    resolveParticle(p,.067,gardenColliders(level));
    assert.ok(Math.abs(p.z+.067-level.boundary.maxZ)<1e-6,'particle front surface reaches the crest inner face');
  };
  for(let id=1;id<=5;id++)check(id);
  for(const file of ['storey-facade-a-v3.glb','storey-facade-b-v3.glb'])
    requests.get(file).onLoad({scene:new THREE.Group()});
  requests.get('side-parapet-l1-v3.glb').onError(new Error('missing side'));
  for(let id=1;id<=5;id++){
    scenery.update(true,1280,720,id,false);
    const crest=scene.getObjectByName(`front-boundary-crest-${id}`);
    assert.ok(crest.visible&&crest.parent.visible,`active storey ${id} retains its crest`);
    check(id);
  }
  assert.equal(scene.getObjectByName('fallback-arcade-1').visible,false);
  assert.equal(scene.getObjectByName('front-boundary-crest-1').visible,true);
  scenery.dispose();
});
