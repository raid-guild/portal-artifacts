import * as THREE from 'three';
import { addImpactVelocity, advanceSquash, eventVariant, JellySlosh, JellyWaves, responseFor } from './jelly-response.js';

export const FIXED_DT = 1 / 60;
const clamp = THREE.MathUtils.clamp;

export function makeShell(radius, detail = 2) {
  const source = new THREE.IcosahedronGeometry(radius, detail);
  const attr = source.attributes.position;
  const points = [], triangles = [], lookup = new Map();
  for (let i = 0; i < attr.count; i++) {
    const xyz = [attr.getX(i), attr.getY(i), attr.getZ(i)];
    const key = xyz.map(v => Math.round(v * 1e5)).join(',');
    if (!lookup.has(key)) {
      lookup.set(key, points.length / 3);
      points.push(...xyz);
    }
    triangles.push(lookup.get(key));
  }
  source.dispose();
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
  geometry.setIndex(triangles);
  geometry.computeVertexNormals();
  return geometry;
}

// Loop subdivision is used only for the rendered surface. Its stencils always read
// the small, simulated cage; it introduces no extra particles into the solver.
export class SmoothSkin {
  constructor(shell) {
    this.shell = shell;
    const count = shell.rest.length / 3;
    const neighbors = Array.from({ length: count }, () => new Set());
    const edges = new Map();
    const indices = shell.geometry.index.array;
    const addEdge = (a, b, opposite) => {
      neighbors[a].add(b); neighbors[b].add(a);
      const key = a < b ? `${a}:${b}` : `${b}:${a}`;
      if (!edges.has(key)) edges.set(key, { a: Math.min(a,b), b: Math.max(a,b), opposite: [] });
      edges.get(key).opposite.push(opposite);
    };
    for (let i = 0; i < indices.length; i += 3) {
      const [a,b,c] = [indices[i],indices[i+1],indices[i+2]];
      addEdge(a,b,c); addEdge(b,c,a); addEdge(c,a,b);
    }
    this.stencils = neighbors.map((set, i) => {
      const n = set.size;
      const beta = (5/8 - (3/8 + Math.cos(2*Math.PI/n)/4)**2) / n;
      return [[i, 1-n*beta], ...[...set].map(j => [j,beta])];
    });
    const edgeIds = new Map();
    for (const [key, edge] of edges) {
      edgeIds.set(key, this.stencils.length);
      const [a,b] = [edge.a,edge.b];
      this.stencils.push(edge.opposite.length === 2
        ? [[a,.375],[b,.375],[edge.opposite[0],.125],[edge.opposite[1],.125]]
        : [[a,.5],[b,.5]]);
    }
    const midpoint = (a,b) => edgeIds.get(a < b ? `${a}:${b}` : `${b}:${a}`);
    const fine = [];
    for (let i=0;i<indices.length;i+=3) {
      const a=indices[i],b=indices[i+1],c=indices[i+2];
      const ab=midpoint(a,b),bc=midpoint(b,c),ca=midpoint(c,a);
      fine.push(a,ab,ca,b,bc,ab,c,ca,bc,ab,bc,ca);
    }
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.stencils.length*3),3));
    this.geometry.setIndex(fine);
    this.update();
  }
  update(source=this.shell.positions,recompute=true) {
    const target=this.geometry.attributes.position.array;
    for(let i=0;i<this.stencils.length;i++) {
      let x=0,y=0,z=0;
      for(const [j,w] of this.stencils[i]) {const k=j*3;x+=source[k]*w;y+=source[k+1]*w;z+=source[k+2]*w;}
      target[i*3]=x;target[i*3+1]=y;target[i*3+2]=z;
    }
    if(recompute){this.geometry.attributes.position.needsUpdate=true;this.geometry.computeVertexNormals();this.geometry.computeBoundingSphere()}
  }
}

export class SoftShell {
  constructor(radius, detail = 2) {
    this.radius=radius;
    this.geometry=makeShell(radius,detail);
    this.rest=Float32Array.from(this.geometry.attributes.position.array);
    this.positions=Float32Array.from(this.rest);
    this.previous=Float32Array.from(this.rest);
    this.base=Float32Array.from(this.rest);
    this.basePrevious=Float32Array.from(this.rest);
    this.unwaved=Float32Array.from(this.rest);
    this.safe=Float32Array.from(this.rest);
    this.eventCount=0;this.eventSeed=radius*3.71;
    this.waves=new JellyWaves(this.rest,Float32Array.from(this.geometry.attributes.normal.array),radius,{seed:this.eventSeed});
    this.slosh=new JellySlosh(radius);
    this.edges=[];
    this.grab=null;
    this.grabIndex=-1;
    this.grabTarget=new THREE.Vector3();
    this.squash=1;
    this.squashVelocity=0;
    this.contactStrength=0;
    const seen=new Set(),ix=this.geometry.index.array;
    for(let t=0;t<ix.length;t+=3) for(const [a,b] of [[ix[t],ix[t+1]],[ix[t+1],ix[t+2]],[ix[t+2],ix[t]]]) {
      const key=a<b?`${a}:${b}`:`${b}:${a}`;
      if(seen.has(key))continue;
      seen.add(key);
      this.edges.push([a,b,Math.hypot(this.rest[a*3]-this.rest[b*3],this.rest[a*3+1]-this.rest[b*3+1],this.rest[a*3+2]-this.rest[b*3+2])]);
    }
    this.triangles=[];
    for(let t=0;t<ix.length;t+=3){
      const a=ix[t]*3,b=ix[t+1]*3,c=ix[t+2]*3;
      const orientation=this.orientedVolume(this.rest,a,b,c);
      this.triangles.push([a,b,c,Math.sign(orientation)||1,Math.abs(orientation)]);
    }
  }

  orientedVolume(p,a,b,c,centerY=0){
    const abx=p[b]-p[a],aby=p[b+1]-p[a+1],abz=p[b+2]-p[a+2];
    const acx=p[c]-p[a],acy=p[c+1]-p[a+1],acz=p[c+2]-p[a+2];
    const nx=aby*acz-abz*acy,ny=abz*acx-abx*acz,nz=abx*acy-aby*acx;
    return (nx*(p[a]+p[b]+p[c])+ny*(p[a+1]+p[b+1]+p[c+1]-3*centerY)+nz*(p[a+2]+p[b+2]+p[c+2]))/3;
  }
  nearest(point){let best=Infinity,index=0;for(let i=0;i<this.positions.length;i+=3){const d=(this.positions[i]-point.x)**2+(this.positions[i+1]-point.y)**2+(this.positions[i+2]-point.z)**2;if(d<best){best=d;index=i/3}}return index}
  minimumY(){let min=Infinity;for(let i=1;i<this.positions.length;i+=3)min=Math.min(min,this.positions[i]);return min}

  beginGrab(point){
    const origin=point.clone(),normal=origin.clone().normalize();
    if(normal.lengthSq()<.1)normal.set(0,0,1);
    this.grabIndex=this.nearest(origin);
    this.grabTarget.copy(origin);
    const radius=this.radius,weights=[];
    for(let i=0;i<this.rest.length;i+=3){
      const d=Math.hypot(this.rest[i]-origin.x,this.rest[i+1]-origin.y,this.rest[i+2]-origin.z);
      const w=Math.exp(-.5*(d/(radius*.64))**2);
      if(w>.015)weights.push([i,w]);
    }
    this.grab={origin,normal,weights,base:Float32Array.from(this.base),desired:new THREE.Vector3(),smoothed:new THREE.Vector3()};
  }
  updateGrab(point){
    if(!this.grab)return;
    const {origin,normal,desired}=this.grab;
    const delta=point.clone().sub(origin);
    const radial=clamp(delta.dot(normal),-.25*this.radius,.9*this.radius);
    const tangent=delta.addScaledVector(normal,-delta.dot(normal));
    if(tangent.length()>.65*this.radius)tangent.setLength(.65*this.radius);
    desired.copy(tangent).addScaledVector(normal,radial);
    this.grabTarget.copy(origin).add(desired);
  }
  endGrab(){if(this.grab&&this.grab.desired.lengthSq()>.01){this.eventCount++;this.waves.setEvent(this.eventCount);this.slosh.excite(this.grab.desired,Math.min(1.5,this.grab.desired.length()/this.radius))}this.grab=null;this.grabIndex=-1}

  impact(speed){
    this.squashVelocity=addImpactVelocity(this.squashVelocity,speed,this.radius);
    if(speed>.003){this.eventCount++;this.waves.setEvent(this.eventCount);const angle=eventVariant(this.eventSeed,this.eventCount).angle;this.slosh.excite(new THREE.Vector3(Math.cos(angle),0,Math.sin(angle)),Math.min(1.5,speed/.045))}
  }
  addWave(anchor,strength=1){this.waves.add(anchor,strength)}
  validBase(p=this.base){
    for(const v of p)if(!Number.isFinite(v))return false;
    for(const [a,b,length] of this.edges){const ai=a*3,bi=b*3;const dx=p[ai]-p[bi],dy=p[ai+1]-p[bi+1],dz=p[ai+2]-p[bi+2];const ratio=Math.hypot(dx,dy,dz)/length;if(ratio<.42||ratio>1.85)return false}
    for(const [a,b,c,sign,rest] of this.triangles)if(this.orientedVolume(p,a,b,c)*sign<rest*.035)return false;
    return true;
  }
  valid(){
    if(!this.validBase())return false;
    for(const v of this.positions)if(!Number.isFinite(v))return false;
    const centerY=-this.radius*(1-this.squash);
    for(const [a,b,c,sign] of this.triangles)if(this.orientedVolume(this.positions,a,b,c,centerY)*sign<=0)return false;
    return true;
  }
  reset(){this.grab=null;this.grabIndex=-1;this.positions.set(this.rest);this.previous.set(this.rest);this.base.set(this.rest);this.basePrevious.set(this.rest);this.unwaved.set(this.rest);this.safe.set(this.rest);this.squash=1;this.squashVelocity=0;this.contactStrength=0;this.eventCount=0;this.waves.reset();this.slosh.reset();this.updateGeometry()}
  updateGeometry(){this.geometry.attributes.position.array.set(this.positions);this.geometry.attributes.position.needsUpdate=true}

  step({softness=.65,damping=.38,gravity=.55,contactLoad=0,centerY=1,floorAt=()=>.08,collisions=[]}={}){
    this.previous.set(this.positions);
    advanceSquash(this,softness,damping,contactLoad,this.radius);
    this.safe.set(this.base);
    const p=this.base,old=this.basePrevious,retention=.995-damping*.095;
    for(let i=0;i<p.length;i+=3){for(let k=0;k<3;k++){const v=clamp((p[i+k]-old[i+k])*retention,-.10,.10);old[i+k]=p[i+k];p[i+k]+=v}}
    for(let iteration=0;iteration<7;iteration++){
      const strength=.75-softness*.3;
      for(const [a,b,target] of this.edges){
        const ai=a*3,bi=b*3,dx=p[bi]-p[ai],dy=p[bi+1]-p[ai+1],dz=p[bi+2]-p[ai+2],dist=Math.hypot(dx,dy,dz)||1;
        const desired=clamp(dist,target*.52,target*1.55);
        const amount=(dist-desired+(desired-target)*strength)/dist*.5;
        p[ai]+=dx*amount;p[ai+1]+=dy*amount;p[ai+2]+=dz*amount;
        p[bi]-=dx*amount;p[bi+1]-=dy*amount;p[bi+2]-=dz*amount;
      }
      const shape=.027-softness*.011;
      for(let i=0;i<p.length;i+=3){
        p[i]+=(this.rest[i]-p[i])*shape;p[i+1]+=(this.rest[i+1]-p[i+1])*shape;p[i+2]+=(this.rest[i+2]-p[i+2])*shape;
        for(const o of collisions){const dx=p[i]-o.x,dy=p[i+1]-o.y,dz=p[i+2]-o.z,dist=Math.hypot(dx,dy,dz)||1;if(dist<o.radius){const push=(o.radius-dist)/dist*.4;p[i]+=dx*push;p[i+1]+=dy*push;p[i+2]+=dz*push;old[i]+=dx*push;old[i+1]+=dy*push;old[i+2]+=dz*push}}
      }
      if(this.grab){const g=this.grab;g.smoothed.lerp(g.desired,1-Math.exp(-responseFor(softness,damping).grabFrequency*FIXED_DT));for(const [i,w] of g.weights){const gain=.18*w;for(let k=0;k<3;k++)p[i+k]+=(g.base[i+k]+g.smoothed.getComponent(k)*w-p[i+k])*gain}}
    }
    if(!this.validBase()){
      const candidate=Float32Array.from(p);let accepted=false;
      for(let alpha=.5;alpha>=1/1024;alpha*=.5){for(let i=0;i<p.length;i++)p[i]=this.safe[i]+(candidate[i]-this.safe[i])*alpha;if(this.validBase()){accepted=true;break}}
      if(!accepted)p.set(this.safe);
      old.set(p); // rejected motion cannot reappear as Verlet velocity
    }
    this.slosh.step(softness,damping);
    this.waves.step();
    const sx=Math.min(responseFor(softness,damping).lateralLimit,1/Math.sqrt(this.squash));
    for(const sloshScale of [1,.5,0]){
      this.unwaved.set(p);this.slosh.apply(this.unwaved,this.rest,sloshScale);
      for(let i=0;i<p.length;i+=3){this.positions[i]=this.unwaved[i]*sx;this.positions[i+1]=-this.radius+(this.unwaved[i+1]+this.radius)*this.squash;this.positions[i+2]=this.unwaved[i+2]*sx}
      if(this.valid())break;
    }
    this.unwaved.set(this.positions);
    if(this.waves.packets.length){
      this.safe.set(this.positions);
      for(const scale of [1,.5,.25,0]){
        this.positions.set(this.safe);this.waves.apply(this.positions,softness,damping,scale);
        if(this.valid())break;
      }
    }
    this.updateGeometry();
  }
}
