import * as THREE from 'three';
import { FIXED_DT } from './physics.js';
import { addImpactVelocity, advanceSquash, eventVariant, JellySlosh, JellyWaves, responseFor } from './jelly-response.js';

const clamp=THREE.MathUtils.clamp;
const GAUSSIAN_MAX_GRADIENT=Math.exp(-.5);

export function restAnchorFromHit(restGeometry,renderGeometry,faceIndex,hitLocal){
  const rest=restGeometry.attributes.position,render=renderGeometry.attributes.position;
  const index=restGeometry.index?.array;
  const ids=[0,1,2].map(k=>index?index[faceIndex*3+k]:faceIndex*3+k);
  const point=i=>new THREE.Vector3().fromBufferAttribute(render,i);
  const bary=new THREE.Vector3();
  THREE.Triangle.getBarycoord(hitLocal,point(ids[0]),point(ids[1]),point(ids[2]),bary);
  if(!Number.isFinite(bary.x))return new THREE.Vector3().fromBufferAttribute(rest,ids[0]);
  return new THREE.Vector3()
    .addScaledVector(new THREE.Vector3().fromBufferAttribute(rest,ids[0]),bary.x)
    .addScaledVector(new THREE.Vector3().fromBufferAttribute(rest,ids[1]),bary.y)
    .addScaledVector(new THREE.Vector3().fromBufferAttribute(rest,ids[2]),bary.z);
}

export class LogoField {
  constructor(geometry,{sigma=.78}={}){
    this.restGeometry=geometry;
    // Double precision preserves the very narrow bevel triangles while solving.
    // The render buffer is converted to Float32 only after a valid pose is found.
    this.rest=Float64Array.from(geometry.attributes.position.array);
    this.positions=Float64Array.from(this.rest);
    this.previous=Float64Array.from(this.rest);
    this.unwaved=Float64Array.from(this.rest);
    this.bottomRest=Infinity;
    for(let i=1;i<this.rest.length;i+=3)this.bottomRest=Math.min(this.bottomRest,this.rest[i]);
    this.sigma=sigma;
    // A single depth direction avoids creasing the logo's very thin beveled cutouts.
    this.eventCount=0;this.eventSeed=3.41;
    this.waves=new JellyWaves(this.rest,Float64Array.from(geometry.attributes.normal.array),1.34,{direction:'z',width:.52,seed:this.eventSeed});
    this.slosh=new JellySlosh(1.34);
    this.modes=[];this.active=null;this.grabTarget=new THREE.Vector3();
    this.squash=1;this.squashVelocity=0;
    this.triangles=[];
    const index=geometry.index?.array;
    const count=index?index.length:this.rest.length/3;
    for(let t=0;t<count;t+=3){
      const ids=[0,1,2].map(k=>index?index[t+k]:t+k);
      const i=ids[0]*3,j=ids[1]*3,k=ids[2]*3,p=this.rest;
      const ax=p[j]-p[i],ay=p[j+1]-p[i+1],az=p[j+2]-p[i+2];
      const bx=p[k]-p[i],by=p[k+1]-p[i+1],bz=p[k+2]-p[i+2];
      const nx=ay*bz-az*by,ny=az*bx-ax*bz,nz=ax*by-ay*bx;
      const length2=nx*nx+ny*ny+nz*nz;
      if(length2>1e-12)this.triangles.push([i,j,k,nx,ny,nz,length2]);
    }
    // Extruded SVG bevels contain very long, paper-thin sliver triangles.
    // Their vertex samples can reverse under a smooth injective bend; guard
    // the substantial cap/side triangles and use the field gradient bound for
    // the continuous surface between those samples.
    this.guardTriangles=this.triangles.filter(triangle=>triangle[6]>=1e-6);
  }
  minimumY(){let min=Infinity;for(let i=1;i<this.positions.length;i+=3)min=Math.min(min,this.positions[i]);return min}
  get maxDisplacement(){return .4*this.sigma/GAUSSIAN_MAX_GRADIENT}
  beginGrab(anchor,hitPoint=anchor){
    this.endGrab();
    this.modes=this.modes.filter(mode=>!mode.released||mode.displacement.lengthSq()>.000009||mode.velocity.lengthSq()>.0004);
    if(this.modes.length>=3)return false;
    const weights=new Float64Array(this.rest.length/3),variance=2*this.sigma*this.sigma;
    for(let i=0;i<weights.length;i++){
      const j=i*3,dx=this.rest[j]-anchor.x,dy=this.rest[j+1]-anchor.y,dz=this.rest[j+2]-anchor.z;
      weights[i]=Math.exp(-(dx*dx+dy*dy+dz*dz)/variance);
    }
    const mode={anchor:anchor.clone(),pointerStart:hitPoint.clone(),displacement:new THREE.Vector3(),velocity:new THREE.Vector3(),target:new THREE.Vector3(),weights,released:false};
    this.modes.push(mode);this.active=mode;this.grabTarget.copy(anchor);
    return true;
  }
  updateGrab(point){
    if(!this.active)return;
    const mode=this.active;
    mode.target.copy(point).sub(mode.pointerStart);
    const other=this.modes.reduce((sum,item)=>sum+(item===mode?0:item.displacement.length()),0);
    const available=Math.max(0,this.maxDisplacement-other);
    if(mode.target.length()>available)mode.target.setLength(available);
    this.grabTarget.copy(mode.anchor).add(mode.target);
  }
  endGrab(){if(this.active){if(this.active.displacement.lengthSq()>.01){this.eventCount++;this.waves.setEvent(this.eventCount);this.slosh.excite(this.active.displacement,Math.min(1.5,this.active.displacement.length()))}this.active.released=true;this.active.target.set(0,0,0);this.active=null}}
  impact(speed){
    this.squashVelocity=addImpactVelocity(this.squashVelocity,speed,-this.bottomRest);
    if(speed>.003){this.eventCount++;this.waves.setEvent(this.eventCount);const angle=eventVariant(this.eventSeed,this.eventCount).angle;this.slosh.excite(new THREE.Vector3(Math.cos(angle),0,Math.sin(angle)),Math.min(1.5,speed/.045))}
  }
  addWave(anchor,strength=1){this.waves.add(anchor,strength)}
  reset(){this.positions.set(this.rest);this.previous.set(this.rest);this.unwaved.set(this.rest);this.modes=[];this.active=null;this.grabTarget.set(0,0,0);this.squash=1;this.squashVelocity=0;this.eventCount=0;this.waves.reset();this.slosh.reset()}
  evaluate(softness=.65,damping=.38,sloshScale=1){
    const p=this.positions,r=this.rest,base=this.unwaved,sy=this.squash,sx=Math.min(responseFor(softness,damping).lateralLimit,1/Math.sqrt(sy));
    for(let i=0;i<p.length;i+=3){
      let x=r[i],y=r[i+1],z=r[i+2];
      for(const mode of this.modes){const w=mode.weights[i/3];x+=mode.displacement.x*w;y+=mode.displacement.y*w;z+=mode.displacement.z*w}
      base[i]=x;base[i+1]=y;base[i+2]=z;
    }
    this.slosh.apply(base,r,sloshScale);
    for(let i=0;i<p.length;i+=3){
      // Squash toward the contact edge. Scaling about the mark's center would
      // lift its bottom, forcing the root to jump down to remain on the pad.
      p[i]=base[i]*sx;p[i+1]=this.bottomRest+(base[i+1]-this.bottomRest)*sy;p[i+2]=base[i+2]*sx;
    }
  }
  valid(){
    for(const v of this.positions)if(!Number.isFinite(v))return false;
    for(const [i,j,k,nx,ny,nz,length2] of this.guardTriangles){
      const p=this.positions,ax=p[j]-p[i],ay=p[j+1]-p[i+1],az=p[j+2]-p[i+2];
      const bx=p[k]-p[i],by=p[k+1]-p[i+1],bz=p[k+2]-p[i+2];
      const dot=(ay*bz-az*by)*nx+(az*bx-ax*bz)*ny+(ax*by-ay*bx)*nz;
      if(dot<length2*.06)return false;
    }
    return true;
  }
  step({softness=.65,damping=.38,contactLoad=0}={}){
    this.previous.set(this.positions);
    if(this.modes.length===0&&contactLoad===0&&this.squash===1&&this.squashVelocity===0&&!this.waves.packets.length&&this.slosh.offset.lengthSq()===0&&this.slosh.velocity.lengthSq()===0)return;
    const oldSquash=this.squash;
    const oldModes=this.modes.map(mode=>({mode,displacement:mode.displacement.clone(),velocity:mode.velocity.clone()}));
    advanceSquash(this,softness,damping,contactLoad,-this.bottomRest);
    this.slosh.step(softness,damping);
    const omega=responseFor(softness,damping).grabFrequency,friction=.4+damping*.55;
    for(const mode of this.modes){
      mode.velocity.addScaledVector(mode.target.clone().sub(mode.displacement),omega*omega*FIXED_DT);
      mode.velocity.addScaledVector(mode.velocity,-2*friction*omega*FIXED_DT);
      mode.displacement.addScaledVector(mode.velocity,FIXED_DT);
    }
    const total=this.modes.reduce((sum,mode)=>sum+mode.displacement.length(),0);
    if(total>this.maxDisplacement){
      const scale=this.maxDisplacement/total;
      for(const mode of this.modes){mode.displacement.multiplyScalar(scale);mode.velocity.multiplyScalar(scale)}
    }
    this.evaluate(softness,damping);
    if(!this.valid())this.evaluate(softness,damping,0);
    if(!this.valid()){
      let accepted=false;
      const attempted=this.modes.map(mode=>mode.displacement.clone()),attemptedSquash=this.squash;
      for(let alpha=.5;alpha>=1/1024;alpha*=.5){
        this.squash=oldSquash+(attemptedSquash-oldSquash)*alpha;
        this.modes.forEach((mode,i)=>mode.displacement.copy(oldModes[i].displacement).lerp(attempted[i],alpha));
        this.evaluate(softness,damping,0);
        if(this.valid()){accepted=true;break}
      }
      if(!accepted){this.squash=oldSquash;this.positions.set(this.previous);this.modes.forEach((mode,i)=>mode.displacement.copy(oldModes[i].displacement))}
      this.squashVelocity=0;for(const mode of this.modes)mode.velocity.set(0,0,0);
    }
    this.waves.step();
    if(this.waves.packets.length){
      const base=Float64Array.from(this.positions);
      for(const scale of [1,.5,.25,0]){
        this.positions.set(base);this.waves.apply(this.positions,softness,damping,scale);
        if(this.valid())break;
      }
    }
    this.modes=this.modes.filter(mode=>!mode.released||mode.displacement.lengthSq()>.000009||mode.velocity.lengthSq()>.0004);
  }
}
