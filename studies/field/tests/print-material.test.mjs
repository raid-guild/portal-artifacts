import assert from 'node:assert/strict';
import {register} from 'node:module';
import * as THREE from '../dist/vendor/three.module.js';
import {preparePortrait} from '../dist/meeting.js';
const url=new URL('../dist/vendor/three.module.js',import.meta.url).href;
register('data:text/javascript,'+encodeURIComponent(`export async function resolve(s,c,n){return s==='three'?{url:${JSON.stringify(url)},shortCircuit:true}:n(s,c)}`),import.meta.url);
const {EndlessMaze}=await import('../dist/maze.js');
const props=new THREE.Group();
for(const name of ['ExcellencePoster','BoardroomPoster']){
 const group=new THREE.Group();group.name=name;
 group.add(new THREE.Mesh(new THREE.PlaneGeometry(),new THREE.MeshStandardMaterial({map:new THREE.Texture()})));
 group.add(new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial()));props.add(group);
}
preparePortrait(props);
for(const group of props.children){
 const print=group.children[0].material,frame=group.children[1].material;
 assert.equal(frame.userData.portraitPrint,undefined,'Frame is not exposure corrected');
 const batch=EndlessMaze.prototype.batch(group);
 const rendered=batch.children.find(o=>o.material.map);
 assert.equal(rendered.material,print,'Instancing retains the print shader callback');
 assert.equal(rendered.material.emissiveIntensity,0);assert.equal(rendered.material.fog,true);
 const shader={fragmentShader:'#include <map_fragment>'};rendered.material.onBeforeCompile(shader);
 assert.ok(shader.fragmentShader.includes('pow(max(diffuseColor.rgb'));
 assert.ok(shader.fragmentShader.includes('#include <map_fragment>'),'Texture sampling preserved');
}
console.log('PASS: photo correction survives instancing, excludes frames, preserves fog and adds no emission.');
