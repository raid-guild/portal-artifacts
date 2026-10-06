import * as THREE from 'three';

const clamp=THREE.MathUtils.clamp;
const FIXED_DT=1/60;
const fraction=value=>value-Math.floor(value);
export function eventVariant(seed,index){
  const a=fraction(Math.sin(seed*12.9898+index*78.233)*43758.5453);
  const b=fraction(Math.sin(seed*43.719+index*19.197)*12741.173);
  return {angle:a*Math.PI*2,speed:.88+.24*a,width:.88+.24*b,phase:(b-.5)*.32};
}

export function responseFor(softness=.65,damping=.38){
  const s=clamp(softness,0,1),d=clamp(damping,0,1);
  return {
    frequency:11.5-8.3*s,
    grabFrequency:17-12.5*s,
    dampingRatio:.18+.28*d+.24*d**3,
    lateralLimit:1.6,
    waveAmplitude:.045+.045*s,
    waveSpeed:2.6-1.2*s,
    waveDecay:3.8-2*s+2*d,
  };
}

export function addImpactVelocity(current,speed,effectiveHeight=1){
  // speed is world units per fixed step; contact converts root momentum into
  // compression velocity without a minimum impulse or saturation plateau.
  return current-speed/(FIXED_DT*Math.max(.2,effectiveHeight));
}

export function advanceSquash(shell,softness=.65,damping=.38,contactLoad=0,effectiveHeight=1){
  const {frequency:omega,dampingRatio:zeta}=responseFor(softness,damping);
  const substep=FIXED_DT/4;
  for(let i=0;i<4;i++){
    const compression=1-shell.squash;
    const acceleration=omega*omega*(compression+20*compression**3)-2*zeta*omega*shell.squashVelocity-contactLoad/effectiveHeight;
    shell.squashVelocity+=acceleration*substep;
    shell.squash+=shell.squashVelocity*substep;
    // Numerical emergency bounds only; ordinary contacts never target them.
    if(shell.squash<.16){shell.squash=.16;if(shell.squashVelocity<0)shell.squashVelocity=0}
    if(shell.squash>1.24){shell.squash=1.24;if(shell.squashVelocity>0)shell.squashVelocity=0}
  }
}

export class JellyWaves{
  constructor(rest,normals,radius,{direction='normal',width=.32,seed=radius}={}){
    this.rest=rest;this.normals=normals;this.radius=radius;this.direction=direction;this.width=width;this.seed=seed;this.event=0;this.packets=[];
  }
  reset(){this.packets.length=0;this.event=0}
  setEvent(index){this.event=index}
  add(anchor,strength=1){
    if(this.packets.length>=4){
      const weakest=this.packets.reduce((best,packet,index)=>packet.strength*Math.exp(-2*packet.age)<this.packets[best].strength*Math.exp(-2*this.packets[best].age)?index:best,0);
      if(this.packets[weakest].strength*Math.exp(-2*this.packets[weakest].age)>.16)return;
      this.packets.splice(weakest,1);
    }
    this.packets.push({anchor:anchor.clone(),age:0,strength:clamp(strength,.05,1.5),variant:eventVariant(this.seed,this.event)});
  }
  step(){
    for(const packet of this.packets)packet.age+=FIXED_DT;
    this.packets=this.packets.filter(packet=>packet.age<1.8);
  }
  apply(out,softness=.65,damping=.38,scale=1){this.applyTo(out,this.rest,this.normals,softness,damping,scale)}
  applyTo(out,rest,normals,softness=.65,damping=.38,scale=1){
    if(!this.packets.length)return;
    const tuning=responseFor(softness,damping),width=this.radius*this.width;
    for(let i=0;i<out.length;i+=3){
      let height=0;
      for(const packet of this.packets){
        const distance=Math.hypot(rest[i]-packet.anchor.x,rest[i+1]-packet.anchor.y,rest[i+2]-packet.anchor.z);
        const packetWidth=width*packet.variant.width;
        const phase=distance-tuning.waveSpeed*packet.variant.speed*packet.age;
        const envelope=Math.exp(-.5*(phase/packetWidth)**2);
        const t=clamp(packet.age/.065,0,1),attack=t*t*(3-2*t);
        const retire=clamp((1.8-packet.age)/.25,0,1);
        height+=packet.strength*tuning.waveAmplitude*attack*retire*Math.exp(-tuning.waveDecay*packet.age)*envelope*Math.cos(phase/packetWidth*1.8+packet.variant.phase);
      }
      height=clamp(height,-.12,.12)*scale;
      if(this.direction==='z')out[i+2]+=height;
      else{out[i]+=normals[i]*height;out[i+1]+=normals[i+1]*height;out[i+2]+=normals[i+2]*height}
    }
  }
}

// A delayed, low-order shape mode. It shears upper and lower regions in
// opposite directions and bulges one side while its opposite side catches up.
export class JellySlosh{
  constructor(radius){this.radius=radius;this.offset=new THREE.Vector3();this.velocity=new THREE.Vector3()}
  reset(){this.offset.set(0,0,0);this.velocity.set(0,0,0)}
  excite(direction,strength=1){
    const axis=direction.clone();if(axis.lengthSq()<.001)axis.set(1,0,.35);
    axis.normalize();
    this.velocity.addScaledVector(axis,clamp(strength,0,1.5)*3.2);
    if(this.velocity.length()>5.2)this.velocity.setLength(5.2);
  }
  step(softness=.65,damping=.38){
    const s=clamp(softness,0,1),d=clamp(damping,0,1),omega=9-5.2*s,zeta=.46+.3*d;
    this.velocity.addScaledVector(this.offset,-omega*omega*FIXED_DT);
    this.velocity.addScaledVector(this.velocity,-2*zeta*omega*FIXED_DT);
    this.offset.addScaledVector(this.velocity,FIXED_DT);
    const limit=this.radius*(.055+.12*s);
    if(this.offset.length()>limit){this.offset.setLength(limit);this.velocity.multiplyScalar(.8)}
    if(this.offset.lengthSq()<1e-7&&this.velocity.lengthSq()<1e-5)this.reset();
  }
  apply(out,rest,scale=1){
    const r=this.radius,q=this.offset;
    if(q.lengthSq()===0)return;
    for(let i=0;i<out.length;i+=3){
      const x=rest[i]/r,y=rest[i+1]/r,z=rest[i+2]/r;
      const upper=clamp(y,-1,1),middle=Math.max(0,1-upper*upper);
      out[i]+=q.x*scale*(upper*.7+middle*(x*x-z*z)*.55);
      out[i+1]+=q.y*scale*middle*(x*x-z*z)*.45;
      out[i+2]+=q.z*scale*(upper*.7+middle*(z*z-x*x)*.55);
    }
  }
}
