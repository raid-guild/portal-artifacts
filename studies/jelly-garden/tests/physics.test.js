import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { SoftShell, SmoothSkin, FIXED_DT } from '../src/physics.js';
import { BounceMotion, interpolateBuffer } from '../src/motion.js';

const remoteFloor = () => -100;
const avg = (array, axis) => {
  let total=0;
  for(let i=axis;i<array.length;i+=3)total+=array[i];
  return total/(array.length/3);
};
const triangleSign = (points, a, b, c) => {
  const i=a*3,j=b*3,k=c*3;
  const u=[points[j]-points[i],points[j+1]-points[i+1],points[j+2]-points[i+2]];
  const v=[points[k]-points[i],points[k+1]-points[i+1],points[k+2]-points[i+2]];
  const normal=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
  const center=[(points[i]+points[j]+points[k])/3,(points[i+1]+points[j+1]+points[k+1])/3,(points[i+2]+points[j+2]+points[k+2])/3];
  return normal[0]*center[0]+normal[1]*center[1]+normal[2]*center[2];
};
const assertOutwardTriangles = shell => {
  const indices=shell.geometry.index.array;
  for(let i=0;i<indices.length;i+=3){
    const a=indices[i],b=indices[i+1],c=indices[i+2];
    assert.ok(triangleSign(shell.positions,a,b,c)*triangleSign(shell.rest,a,b,c)>0,`folded triangle ${i/3}`);
  }
};

test('the welded cage and Loop render skin have valid topology', () => {
  const shell=new SoftShell(1,1),skin=new SmoothSkin(shell);
  assert.ok(shell.valid());
  assert.ok(shell.edges.length>0);
  assert.ok(skin.geometry.attributes.position.count>shell.positions.length/3);
  for(const [, , length] of shell.edges)assert.ok(length>0&&Number.isFinite(length));
  shell.impact(.08);skin.update();
  assert.ok([...skin.geometry.attributes.position.array].every(Number.isFinite));
});

test('an extreme inward pull cannot turn the shell inside out', () => {
  const shell=new SoftShell(1,1),origin=new THREE.Vector3(0,0,1);
  shell.beginGrab(origin);shell.updateGrab(new THREE.Vector3(0,0,-3));
  for(let frame=0;frame<120;frame++){
    shell.step({centerY:3,gravity:0,floorAt:remoteFloor,softness:1});
    assert.ok(shell.valid(),`invalid shell on frame ${frame}`);
    assertOutwardTriangles(shell);
  }
  assert.ok(shell.grab.desired.z>=-.251);
  assert.ok(shell.positions.every(Number.isFinite));
});

test('far tangential and outward pulls remain bounded, affect neighbors, then recover', () => {
  const shell=new SoftShell(1,1),origin=new THREE.Vector3(0,0,1);
  shell.beginGrab(origin);shell.updateGrab(new THREE.Vector3(4,0,4));
  for(let frame=0;frame<80;frame++){
    shell.step({centerY:3,gravity:0,floorAt:remoteFloor,softness:1});
    assert.ok(shell.valid(),`invalid shell on frame ${frame}`);
    assertOutwardTriangles(shell);
  }
  const displacement=Math.max(...shell.positions.map((v,i)=>Math.abs(v-shell.rest[i])));
  assert.ok(displacement>.2&&displacement<1.1);
  assert.ok(shell.grab.desired.x<=.651&&shell.grab.desired.z<=.901);
  shell.endGrab();
  for(let frame=0;frame<240;frame++)shell.step({centerY:3,gravity:0,floorAt:remoteFloor});
  const recovered=Math.max(...shell.positions.map((v,i)=>Math.abs(v-shell.rest[i])));
  assert.ok(recovered<displacement*.4);
  assert.ok(shell.valid());
});

test('impact compresses height, expands width, and rebounds without inverted faces', () => {
  const shell=new SoftShell(1,1);
  const originalWidth=Math.max(...shell.positions.filter((_,i)=>i%3===0));
  const originalHeight=-shell.minimumY();
  shell.impact(.09);
  assert.equal(shell.squash,1);
  assert.deepEqual([...shell.positions],[...shell.rest]);
  const scales=[];let widest=originalWidth,shortest=originalHeight;
  for(let frame=0;frame<240;frame++){
    shell.step({centerY:3,gravity:0,floorAt:remoteFloor});
    scales.push(shell.squash);
    widest=Math.max(widest,...shell.positions.filter((_,i)=>i%3===0));
    shortest=Math.min(shortest,-shell.minimumY());
    assert.ok(shell.valid(),`invalid rebound on frame ${frame}`);
  }
  assert.ok(scales[0]<1&&scales[0]>.9);
  assert.ok(scales.indexOf(Math.min(...scales))>=3);
  assert.ok(Math.min(...scales)<.84);
  assert.ok(shortest<originalHeight*.85);
  assert.ok(widest>originalWidth*1.08);
  assert.ok(-shell.minimumY()>originalHeight*.95);
  assert.ok(Math.max(...shell.positions.filter((_,i)=>i%3===0))>=originalWidth*.95);
  assert.ok(Math.abs(shell.squash-1)<.02);
});

function simulateLanding(frames=300) {
  const shell=new SoftShell(1.11),motion=new BounceMotion(1.8),samples=[];
  const support=()=>.24-shell.minimumY();
  for(let frame=0;frame<frames;frame++){
    const impact=motion.beforeShape(support(),.55,.38);
    if(impact>.006)shell.impact(impact);
    shell.step({softness:.65,damping:.38,gravity:.55,centerY:motion.y,floorAt:()=>.24});
    motion.afterShape(support(),shell.squash,shell.squashVelocity,.38);
    samples.push({y:motion.y,squash:shell.squash,impact,grounded:motion.grounded});
  }
  return {shell,motion,samples};
}

test('default landing compresses over several steps, rebounds once, then settles', () => {
  const {shell,motion,samples}=simulateLanding();
  const first=samples.findIndex(s=>s.impact>.006);
  const compression=samples.slice(first,first+30).map(s=>s.squash);
  const peakIndex=compression.indexOf(Math.min(...compression));
  assert.ok(first>10);
  assert.ok(peakIndex>=3&&peakIndex<=15);
  assert.ok(Math.min(...compression)<.84);
  assert.equal(motion.touchdowns,1);
  assert.equal(motion.launches,1);
  assert.ok(samples.at(-1).grounded&&Math.abs(samples.at(-1).squash-1)<.002);
  let largest=0;
  for(let i=1;i<samples.length;i++)largest=Math.max(largest,Math.abs(samples[i].squash-samples[i-1].squash));
  assert.ok(largest<.09);
  assert.ok(shell.valid());
});

test('default detail-2 shell and spring pad settle without hidden floor jitter', () => {
  const shell=new SoftShell(1.11),motion=new BounceMotion(1.8);
  let padOffset=0,padVelocity=0,largestLateMotion=0;
  const previous=Float32Array.from(shell.positions);
  const surface=(x,z)=>Math.hypot(x,z)<1.16?.24+padOffset:.09;
  const support=()=>{
    let needed=-Infinity;
    for(let i=0;i<shell.positions.length;i+=3)needed=Math.max(needed,surface(shell.positions[i],shell.positions[i+2])-shell.positions[i+1]);
    return needed;
  };
  for(let frame=0;frame<900;frame++){
    padVelocity+=-padOffset*.12;padVelocity*=.82;
    padOffset=Math.max(-.1,Math.min(.015,padOffset+padVelocity));
    const impact=motion.beforeShape(support(),.55,.38);
    if(impact>.006){
      shell.impact(impact);
      if(impact>.015){padVelocity-=impact*.38;padOffset=Math.max(-.1,Math.min(.015,padOffset+padVelocity*.35));}
    }
    shell.step({softness:.65,damping:.38,gravity:.55,centerY:motion.y,floorAt:surface});
    motion.afterShape(support(),shell.squash,shell.squashVelocity,.38);
    let energy=0;
    for(let i=0;i<shell.positions.length;i++)energy+=(shell.positions[i]-previous[i])**2;
    const rms=Math.sqrt(energy/shell.positions.length);
    if(frame>300)largestLateMotion=Math.max(largestLateMotion,rms);
    previous.set(shell.positions);
  }
  assert.equal(motion.touchdowns,1);
  assert.equal(motion.launches,1);
  assert.ok(largestLateMotion<.0002);
  assert.ok(shell.valid());
});

test('interpolation preserves sample times at 30, 60, and 120 Hz', () => {
  const {samples}=simulateLanding(180);
  const states=[{y:1.8,squash:1},...samples];
  const sample=time=>{
    const tick=Math.min(Math.floor(time/FIXED_DT),states.length-1);
    const alpha=(time-tick*FIXED_DT)/FIXED_DT;
    const a=states[Math.max(0,tick-1)],b=states[tick];
    return interpolateBuffer(new Float32Array(2),new Float32Array([a.y,a.squash]),new Float32Array([b.y,b.squash]),alpha);
  };
  for(const rate of [30,60,120]){
    const points=[];for(let frame=0;frame<=rate*2;frame++)points.push(sample(frame/rate));
    assert.ok(points.every(p=>[...p].every(Number.isFinite)));
    assert.ok(Math.abs(points[rate][0]-sample(1)[0])<1e-6);
    assert.ok(Math.abs(points[rate*2][1]-sample(2)[1])<1e-6);
  }
  const tick=40,mid=sample((tick+.5)*FIXED_DT),left=states[tick-1],right=states[tick];
  assert.ok(Math.abs(mid[1]-(left.squash+right.squash)/2)<1e-5);
});

test('floor contact, gravity, reset, and long rest stay stable', () => {
  const free=new SoftShell(1,1),falling=new SoftShell(1,1);
  for(let frame=0;frame<20;frame++){
    free.step({centerY:3,gravity:0,floorAt:remoteFloor});
    falling.step({centerY:3,gravity:1,floorAt:remoteFloor});
  }
  assert.ok(avg(falling.positions,1)<avg(free.positions,1)-.003);
  const shell=new SoftShell(1,1);
  for(let frame=0;frame<1800;frame++)shell.step({centerY:1.1,floorAt:()=>.08});
  for(let i=1;i<shell.positions.length;i+=3)assert.ok(shell.positions[i]>=-1.0201);
  assert.ok(shell.valid());
  let speed=0;for(let i=0;i<shell.positions.length;i++)speed=Math.max(speed,Math.abs(shell.positions[i]-shell.previous[i]));
  assert.ok(speed<.002);
  shell.reset();
  assert.deepEqual([...shell.positions],[...shell.rest]);
  assert.deepEqual([...shell.previous],[...shell.rest]);
});

test('impact and extreme grab together remain above ground at maximum damping', () => {
  const shell=new SoftShell(1,1);
  shell.impact(.1);
  shell.beginGrab(new THREE.Vector3(0,0,1));
  shell.updateGrab(new THREE.Vector3(-4,-3,-3));
  for(let frame=0;frame<180;frame++){
    shell.step({centerY:1.2,gravity:1,damping:1,softness:1,floorAt:()=>.1});
    assert.ok(shell.minimumY()+1.2>=.0999);
    assertOutwardTriangles(shell);
  }
});
