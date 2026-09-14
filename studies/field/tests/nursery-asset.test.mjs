import fs from 'node:fs';import assert from 'node:assert/strict';import {register} from 'node:module';
import * as THREE from '../dist/vendor/three.module.js';
register('data:text/javascript,'+encodeURIComponent(`export async function resolve(s,c,n){return s==='three'?{url:${JSON.stringify(new URL('../dist/vendor/three.module.js',import.meta.url).href)},shortCircuit:true}:n(s,c)}`),import.meta.url);
const {GLTFLoader}=await import('../dist/vendor/addons/loaders/GLTFLoader.js');
const {EndlessMaze}=await import('../dist/maze.js');
const original=fs.readFileSync(new URL('../dist/assets/nursery-kit.glb',import.meta.url));const length=original.readUInt32LE(12),doc=JSON.parse(original.subarray(20,20+length));assert.equal(doc.images.length,1);assert.ok(doc.materials.some(m=>m.pbrMetallicRoughness?.baseColorTexture));
// Node geometry checks omit image decoding; the exported asset keeps its packed photograph.
for(const material of doc.materials)if(material.pbrMetallicRoughness)delete material.pbrMetallicRoughness.baseColorTexture;
delete doc.images;delete doc.textures;const text=Buffer.from(JSON.stringify(doc)),padded=Math.ceil(text.length/4)*4,bin=original.subarray(20+length),buffer=Buffer.alloc(20+padded+bin.length,32);buffer.writeUInt32LE(0x46546c67,0);buffer.writeUInt32LE(2,4);buffer.writeUInt32LE(buffer.length,8);buffer.writeUInt32LE(padded,12);buffer.writeUInt32LE(0x4e4f534a,16);text.copy(buffer,20);bin.copy(buffer,20+padded);
const gltf=await new GLTFLoader().parseAsync(buffer.buffer.slice(buffer.byteOffset,buffer.byteOffset+buffer.byteLength),'');
const props=gltf.scene,kit=new THREE.Group();
for(const name of ['MeetingTable','ExcellencePoster','ObservationPoster','AttendancePoster','LegacyPoster','Wall','Floor','Ceiling','Fixture','DoorFrame','Outlet','Desk','Chair','Cabinet','IncidentPoster','WellnessPoster','DirectionPoster','Portrait','Door','CameraHead']){const m=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial());m.name=name;kit.add(m);props.add(m.clone());}
const turf=props.getObjectByName('NurseryGround');const size=new THREE.Box3().setFromObject(turf).getSize(new THREE.Vector3());assert.ok(Math.abs(size.x-10)<.01&&Math.abs(size.z-10)<.01);let colored=false;turf.traverse(o=>{if(o.isMesh)colored=!!o.geometry.attributes.color});assert.ok(colored,'Grass and dirt colors exported');
const scene=new THREE.Scene(),maze=new EndlessMaze(scene,kit,props,0);maze.model.ensure(8);maze.sync();const group=maze.groups.get(8);assert.ok(group.children.length>0);let vertices=0;group.traverse(o=>{if(o.isInstancedMesh)vertices+=o.geometry.attributes.position.count*o.count});assert.ok(vertices>10000,'Full nursery assets survive runtime batching');
for(const name of ['NurseryCrib','NurseryRecliner']){const s=new THREE.Box3().setFromObject(props.getObjectByName(name)).getSize(new THREE.Vector3());console.log(name,'bounds',s.toArray().map(v=>v.toFixed(2)));}
maze.dispose();console.log('PASS: packed photos, 10m turf, exported grass colors and nursery render assembly.');
