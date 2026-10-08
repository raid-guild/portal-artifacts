import test from 'node:test';
import assert from 'node:assert/strict';
import {ParticleFluid} from '../src/particle-fluid.js';

function referencePairs(particles,h){
  const grid=new Map(),key=(x,y,z)=>`${x},${y},${z}`;
  for(let i=0;i<particles.length;i++){
    const p=particles[i],k=key(Math.floor(p.x/h),Math.floor(p.y/h),Math.floor(p.z/h));
    if(!grid.has(k))grid.set(k,[]);grid.get(k).push(i);
  }
  const pairs=[];
  for(let i=0;i<particles.length;i++){
    const a=particles[i],cx=Math.floor(a.x/h),cy=Math.floor(a.y/h),cz=Math.floor(a.z/h);
    for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++)for(let dz=-1;dz<=1;dz++){
      const cell=grid.get(key(cx+dx,cy+dy,cz+dz));if(!cell)continue;
      for(const j of cell){if(j<=i)continue;const b=particles[j],d=Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);
        if(d<h)pairs.push([i,j,d]);}
    }
  }
  return pairs;
}

test('dense grid reuses storage without changing ordered neighbor pairs',()=>{
  const fluid=new ParticleFluid({seedCount:65});
  for(let pass=0;pass<4;pass++){
    fluid.particles.forEach((p,i)=>{p.x=Math.sin(i*11+pass)*.8;p.y=.2+(i%5)*.09;p.z=Math.cos(i*7-pass)*.75;});
    assert.deepEqual(fluid.samplePairs(),referencePairs(fluid.particles,fluid.range));
  }
});

test('large sparse bounds use fallback and keep the same pair order',()=>{
  const fluid=new ParticleFluid({seedCount:17});
  fluid.particles.at(-1).x=1000;
  assert.deepEqual(fluid.samplePairs(),referencePairs(fluid.particles,fluid.range));
});
