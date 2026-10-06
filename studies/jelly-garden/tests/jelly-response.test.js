import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import { DOMParser } from '@xmldom/xmldom';
import { SoftShell, SmoothSkin } from '../src/physics.js';
import { LogoField } from '../src/logo-physics.js';
import { buildLogoGeometry } from '../src/logo-geometry.js';
import { JellyWaves } from '../src/jelly-response.js';

globalThis.DOMParser=DOMParser;
const logoGeometry=buildLogoGeometry(readFileSync(new URL('../public/assets/raidguild-stamp.svg',import.meta.url),'utf8'));
const makers=[['garden',()=>new SoftShell(1,2)],['mark',()=>new LogoField(logoGeometry)]];

for(const [name,make] of makers){
  test(`${name} softness changes actual compression and sustained recovery`,()=>{
    const results=[];
    for(const softness of [0,.65,1]){
      const body=make();body.impact(.035,softness);
      const heights=[];
      for(let frame=0;frame<240;frame++){
        body.step({softness,damping:.38,centerY:3,gravity:0,floorAt:()=>-100});
        heights.push(body.squash);
        assert.ok(body.valid(),`invalid ${softness} at ${frame}`);
      }
      const minimum=Math.min(...heights);
      const largestStep=Math.max(...heights.slice(1).map((height,index)=>Math.abs(height-heights[index])));
      assert.ok(largestStep<.045,`abrupt squash step ${largestStep}`);
      results.push({minimum,final:heights.at(-1)});
    }
    assert.ok(results[0].minimum>.87&&results[0].minimum<.94);
    assert.ok(results[1].minimum>.77&&results[1].minimum<.86);
    assert.ok(results[2].minimum>.64&&results[2].minimum<.75);
    assert.ok(results[0].minimum-results[1].minimum>.06);
    assert.ok(results[1].minimum-results[2].minimum>.1);
    assert.ok(results.every(result=>Math.abs(result.final-1)<.02));
  });

  test(`${name} wave displaces real geometry and remains bounded with a pull`,()=>{
    const withWave=make(),withoutWave=make();
    const anchor=name==='garden'?new THREE.Vector3(0,0,1):new THREE.Vector3(.2,.2,.19);
    withWave.addWave(anchor,1);
    let largest=0;
    for(let frame=0;frame<90;frame++){
      if(frame===12){withWave.beginGrab(anchor,anchor);withoutWave.beginGrab(anchor,anchor);withWave.updateGrab(anchor.clone().add(new THREE.Vector3(.5,.2,.2)));withoutWave.updateGrab(anchor.clone().add(new THREE.Vector3(.5,.2,.2)))}
      withWave.step({softness:1,damping:.38,centerY:3,gravity:0,floorAt:()=>-100});
      withoutWave.step({softness:1,damping:.38,centerY:3,gravity:0,floorAt:()=>-100});
      for(let i=0;i<withWave.positions.length;i++)largest=Math.max(largest,Math.abs(withWave.positions[i]-withoutWave.positions[i]));
      assert.ok(withWave.valid(),`invalid wave frame ${frame}`);
      assert.ok(withWave.positions.every(Number.isFinite));
    }
    assert.ok(largest>.025&&largest<.12,`wave movement ${largest}`);
  });

  test(`${name} repeated impact waves and extreme drag keep the surface outward`,()=>{
    const body=make();
    const anchor=name==='garden'?new THREE.Vector3(0,0,1):new THREE.Vector3(.2,.2,.19);
    body.beginGrab(anchor,anchor);
    body.updateGrab(anchor.clone().add(new THREE.Vector3(3,-3,3)));
    for(let frame=0;frame<180;frame++){
      if(frame%28===0){body.impact(.055,1);body.addWave(anchor,1)}
      body.step({softness:1,damping:0,centerY:3,gravity:0,floorAt:()=>-100});
      assert.ok(body.valid(),`invalid combined event at ${frame}`);
      assert.ok(body.positions.every(Number.isFinite));
    }
  });

  test(`${name} impact excites delayed opposite-side slosh beyond global squash`,()=>{
    const body=make(),withoutSlosh=make();
    body.impact(.035,1);withoutSlosh.impact(.035,1);withoutSlosh.slosh.reset();
    let top=0,bottom=0;
    for(let i=3;i<body.rest.length;i+=3){if(body.rest[i+1]>body.rest[top+1])top=i;if(body.rest[i+1]<body.rest[bottom+1])bottom=i}
    for(let frame=0;frame<9;frame++){
      body.step({softness:1,damping:.38,centerY:3,gravity:0,floorAt:()=>-100});
      withoutSlosh.step({softness:1,damping:.38,centerY:3,gravity:0,floorAt:()=>-100});
    }
    const topShift=body.positions[top]-withoutSlosh.positions[top];
    const bottomShift=body.positions[bottom]-withoutSlosh.positions[bottom];
    assert.ok(topShift*bottomShift<0,`both ends moved together: ${topShift}, ${bottomShift}`);
    assert.ok(Math.abs(topShift-bottomShift)>.02);
    assert.ok(body.valid());
  });
}

test('surface wave reaches nearby vertices before distant ones',()=>{
  const rest=new Float32Array([.2,0,0,.8,0,0]),normals=new Float32Array([0,0,1,0,0,1]);
  const waves=new JellyWaves(rest,normals,1);waves.add(new THREE.Vector3());
  const peaks=[{height:0,frame:0},{height:0,frame:0}];
  for(let frame=0;frame<60;frame++){
    waves.step();const output=Float32Array.from(rest);waves.apply(output,1,.2);
    for(let i=0;i<2;i++)if(Math.abs(output[i*3+2])>peaks[i].height)peaks[i]={height:Math.abs(output[i*3+2]),frame};
  }
  assert.ok(peaks[0].height>.04&&peaks[1].height>.015);
  assert.ok(peaks[0].frame+10<peaks[1].frame);
});

test('traveling wave has a crest and a following trough',()=>{
  const rest=new Float32Array([0,0,0,.35,0,0,.7,0,0]);
  const normals=new Float32Array([0,0,1,0,0,1,0,0,1]);
  const waves=new JellyWaves(rest,normals,1);waves.add(new THREE.Vector3());
  for(let frame=0;frame<9;frame++)waves.step();
  const output=Float32Array.from(rest);waves.apply(output,1,.2);
  assert.ok(output[5]>.02,`crest ${output[5]}`);
  assert.ok(output[8]<-.01,`trough ${output[8]}`);
});

test('full wave pool never drops a strong packet in one frame',()=>{
  const rest=new Float32Array([0,0,0]),normals=new Float32Array([0,0,1]);
  const waves=new JellyWaves(rest,normals,1);
  for(let i=0;i<4;i++)waves.add(new THREE.Vector3(i,0,0),1);
  const retained=waves.packets.map(packet=>packet.anchor.x);
  waves.add(new THREE.Vector3(4,0,0),1);
  assert.deepEqual(waves.packets.map(packet=>packet.anchor.x),retained);
  for(let i=0;i<90;i++)waves.step();
  waves.add(new THREE.Vector3(4,0,0),1);
  assert.ok(waves.packets.some(packet=>packet.anchor.x===4));
  assert.equal(waves.packets.length,4);
});

test('traveling deformation is sampled on the denser rendered garden skin',()=>{
  const shell=new SoftShell(1,2),skin=new SmoothSkin(shell);
  const rest=Float32Array.from(skin.geometry.attributes.position.array);
  const normals=Float32Array.from(skin.geometry.attributes.normal.array);
  shell.addWave(new THREE.Vector3(0,0,1),1);
  for(let frame=0;frame<7;frame++)shell.step({softness:1,gravity:0,centerY:3,floorAt:()=>-100});
  skin.update(shell.unwaved,false);
  const before=Float32Array.from(skin.geometry.attributes.position.array);
  const rendered=skin.geometry.attributes.position.array;
  shell.waves.applyTo(rendered,rest,normals,1,.38);
  const movement=Math.max(...rendered.map((value,index)=>Math.abs(value-before[index])));
  assert.ok(rest.length>shell.positions.length*2);
  assert.ok(movement>.03&&movement<.12,`fine wave ${movement}`);
});
