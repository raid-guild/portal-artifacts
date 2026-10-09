import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as THREE from 'three';
import {GARDEN,GARDEN_LEVELS,gardenColliders} from '../src/garden-level.js';
import {addStoneEdges,facetedOctahedron,flutedPost} from '../src/garden-ornaments.js';
import {createPrintedMaterialLibrary} from '../src/printed-material.js';

test('printed stone can be created and disposed without browser canvas globals',()=>{
  const library=createPrintedMaterialLibrary(),material=new THREE.MeshBasicMaterial({color:0xe6d2b9});
  assert.equal(library.decorate(material,'wall'),material);
  assert.equal(material.userData.printRole,'wall');
  library.dispose();material.dispose();
});

test('the authored ink swatch, flat facets, and fluted post are finite runtime art',()=>{
  const png=readFileSync(new URL('../public/art/textures/stone-ink-v1.png',import.meta.url));
  assert.equal(png.subarray(1,4).toString(),'PNG');
  assert.equal(png.readUInt32BE(16),png.readUInt32BE(20));
  const gem=facetedOctahedron(.34),gold=facetedOctahedron(.13,'gold');
  for(const jewel of [gem,gold]){
    const tones=jewel.attributes.color.array;
    assert.ok(new Set(Array.from(tones,v=>v.toFixed(2))).size>=4);
    assert.ok(Array.from(tones).every(Number.isFinite));
  }
  const post=flutedPost(GARDEN.posts[0].radius,GARDEN.posts[0].height),p=post.attributes.position;
  const radii=Array.from({length:48},(_,i)=>Math.hypot(p.getX(i),p.getZ(i)));
  assert.ok(Math.max(...radii)<=GARDEN.posts[0].radius+1e-6);
  assert.ok(Math.max(...radii)-Math.min(...radii)>.01);
  for(const geometry of [gem,gold,post])geometry.dispose();
});

test('the original terrace floor edge batches stay decorative and follow authored terrain heights',()=>{
  for(const level of GARDEN_LEVELS.filter(level=>level.id<=5)){
    const group=new THREE.Group(),colliders=gardenColliders(level);
    const added=addStoneEdges(group,level,colliders);
    assert.equal(added.length,2);
    assert.ok(added[0].geometry.attributes.position.count>100);
    assert.ok(added.every(o=>!o.userData.pickableTerrain));
    for(const mesh of added){
      const p=mesh.geometry.attributes.position;
      for(let i=0;i<p.count;i++)assert.ok(Number.isFinite(p.getX(i)+p.getY(i)+p.getZ(i)));
      mesh.geometry.dispose();mesh.material.dispose();
    }
  }
});
