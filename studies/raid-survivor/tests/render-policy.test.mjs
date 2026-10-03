import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { InstancedMesh, PlaneGeometry, MeshBasicMaterial, Color } from 'three';

const result=await build({entryPoints:['src/render-policy.ts'],bundle:true,platform:'node',format:'esm',write:false,absWorkingDir:process.cwd()});
const {graphicsMode,graphicsProfile,RenderCadence,uploadVisibleInstances}=await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);

test('mobile auto bounds both raster surfaces; explicit full and performance override',()=>{
  assert.deepEqual(graphicsProfile('auto',true,3),{lean:true,webglRatio:1,effectsRatio:1});
  assert.deepEqual(graphicsProfile('auto',false,3),{lean:false,webglRatio:1.7,effectsRatio:2});
  assert.deepEqual(graphicsProfile('full',true,3),{lean:false,webglRatio:1.7,effectsRatio:2});
  assert.equal(graphicsProfile('performance',false,3).lean,true);
  assert.equal(graphicsProfile('auto',true,.8).effectsRatio,.8);
  assert.equal(graphicsMode('bad-preference'),'auto');
});

test('60Hz drawing ceiling preserves elapsed presentation time across refresh rates',()=>{
  for(const hz of [30,60,90,120,144]){
    const cadence=new RenderCadence();let count=0,elapsed=0;
    for(let frame=0;frame<hz*4;frame++){
      const dt=cadence.advance(1/hz);
      if(dt!==null){count++;elapsed+=dt;}
    }
    assert.equal(count,Math.min(hz,60)*4,`${hz}Hz draw count`);
    assert.ok(Math.abs(elapsed-4)<1e-8,`${hz}Hz presentation clock`);
    cadence.reset();assert.equal(cadence.advance(1/120),null);
  }
});

test('GPU transfers only populated instance prefixes after shrinking and growing',()=>{
  const mesh=new InstancedMesh(new PlaneGeometry(1,1),new MeshBasicMaterial(),2400);
  mesh.setColorAt(0,new Color());
  for(const count of [300,40,0,1600]){
    const oldVersion=mesh.instanceMatrix.version;
    uploadVisibleInstances(mesh,count);
    assert.equal(mesh.count,count);
    assert.deepEqual(mesh.instanceMatrix.updateRanges,count?[{start:0,count:count*16}]:[]);
    assert.deepEqual(mesh.instanceColor.updateRanges,count?[{start:0,count:count*3}]:[]);
    assert.equal(mesh.instanceMatrix.version,oldVersion+(count?1:0));
  }
  assert.equal(mesh.instanceMatrix.count,2400,'enemy capacity unchanged');
  mesh.geometry.dispose();mesh.material.dispose();
});
