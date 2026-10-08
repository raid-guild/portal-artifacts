import test from 'node:test';
import assert from 'node:assert/strict';
import {ParticleFluid} from '../src/particle-fluid.js';

const DT=1/60;
function drive(size,count,push){
  const f=new ParticleFluid({x:0,z:0,size,seedCount:count,massReferenceCount:297});
  let minAttached=Infinity,minCoat=Infinity,straightX=0;
  for(let frame=0;frame<480;frame++){
    const input=frame<240?{x:1,z:0}:frame<330?{x:0,z:1}:frame<420?{x:-1,z:0}:{x:0,z:0};
    f.step(DT,{...input,push,puddle:true,growth:false},[]);
    minAttached=Math.min(minAttached,f.attachedCount);
    minCoat=Math.min(minCoat,f.coatContacts([]).length);
    if(frame===239)straightX=f.brain.x;
  }
  return {f,minAttached,minCoat,straightX};
}

test('faster walking and Run retain the real body through a turn, reversal, and brake',()=>{
  for(const size of [1,1.4])for(const count of [65,297]){
    const walk=drive(size,count,false),run=drive(size,count,true);
    for(const [name,result] of [['walk',walk],['run',run]]){
      assert.equal(result.f.particles.length,count,`${name} conserves particles at size ${size}`);
      assert.equal(result.minAttached,count-1,`${name} keeps all ${count} particles connected at size ${size}`);
      assert.ok(result.minCoat>=8,`${name} keeps a living coat at size ${size}`);
      assert.ok(result.f.particles.every(p=>Number.isFinite(p.x+p.y+p.z+p.vx+p.vy+p.vz)));
    }
    assert.ok(run.straightX>walk.straightX*1.15,`Run is faster at size ${size} with ${count} particles`);
  }
});
