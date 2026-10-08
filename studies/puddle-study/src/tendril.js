import {groundAt,segmentBlockedBySolid} from './colliders.js';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);

// The strand is a temporary muscle arrangement of existing fluid particles.
// It never creates mass or moves the brain; collisions still solve each particle.
export class Tendril {
  constructor(fluid){this.fluid=fluid;this.state='ready';this.indices=[];this.members=new Set();this.cargo=new Set();this.length=0;this.recovered=0;this.strain=0;}
  get active(){return this.indices.length>0;}
  cast(aim,colliders,reserved=new Set()){
    if(this.active)return false;
    const f=this.fluid,b=f.brain,dx=aim.x-b.x,dz=aim.z-b.z,d=Math.hypot(dx,dz);
    if(!Number.isFinite(d)||d<.45)return false;
    f.samplePairs();f.updateComponents(colliders);
    const candidates=f.particles.map((p,i)=>({p,i})).filter(({p,i})=>
      i!==f.brainIndex&&!f.coatIndices.includes(i)&&!reserved.has(i)&&!p.feedstock&&p.component===b.component&&distance(p,b)<1.55*f.size);
    if(candidates.length<12){this.state='need flesh';return false;}
    this.ux=dx/d;this.uz=dz/d;
    const count=Math.min(candidates.length-4,40,Math.max(12,Math.ceil(d/.14)+3));
    this.reach=Math.min(d,4.8*f.size,(count-2)*.15*f.size);
    candidates.sort((a,c)=>{
      const score=p=>Math.abs((p.x-b.x)*this.uz-(p.z-b.z)*this.ux)+Math.abs(p.y-b.y)*.4;
      return score(a.p)-score(c.p);
    });
    this.indices=candidates.slice(0,count).sort((a,c)=>
      (a.p.x-c.p.x)*this.ux+(a.p.z-c.p.z)*this.uz).map(q=>q.i);
    this.members=new Set(this.indices);this.cargo.clear();
    this.length=Math.min(.8*f.size,this.reach);this.state='casting';this.strain=0;this.recovered=0;this.age=0;
    this.target={x:b.x+this.ux*this.reach,z:b.z+this.uz*this.reach};
    this.brainAnchor={x:b.x,z:b.z};
    return true;
  }
  release(state='ready'){
    this.indices=[];this.members.clear();this.cargo.clear();this.state=state;this.strain=0;
  }
  prepare(dt,pulling,colliders,moving=false){
    if(!this.active)return;
    this.age+=dt;this.pulling=pulling;
    const b=this.fluid.brain;
    if(moving)this.brainAnchor={x:b.x,z:b.z};
    // Once thrown, the end stays in world space. Walking away spends stretch.
    const span=Math.hypot(this.target.x-b.x,this.target.z-b.z);
    if(span>this.reach+1.1*this.fluid.size){this.release('broken');return;}
    this.ux=(this.target.x-b.x)/(span||1);this.uz=(this.target.z-b.z)/(span||1);
    if(pulling){this.state='retrieving';this.length=Math.max(.15,this.length-dt*.8);
      this.target={x:b.x+this.ux*this.length,z:b.z+this.uz*this.length};}
    else{this.length=Math.min(span,this.length+dt*4.2);this.state=this.length<span-.05?'casting':this.cargo.size?'contact':'extended';}
    this.colliders=colliders;
    if(pulling&&this.length<.3&&[...this.cargo].every(p=>distance(p,b)<.8))this.release();
  }
  controls(i){return this.active&&(this.members.has(i)||this.cargo.has(this.fluid.particles[i]));}
  guide(t){
    const f=this.fluid,b=f.brain,x=b.x+this.ux*this.length*t,z=b.z+this.uz*this.length*t;
    const floor=groundAt(x,z,this.colliders).height+f.radius+.055;
    return {x,z,y:Math.max(floor,b.y+(floor-b.y)*Math.min(1,this.length*t/.8))};
  }
  forces(p,i,h){
    if(!this.active)return;
    let target;
    if(this.members.has(i))target=this.guide((this.indices.indexOf(i)+1)/this.indices.length);
    else if(this.cargo.has(p)){
      if(!this.pulling){p.vx*=.9;p.vz*=.9;return;}
      const b=this.fluid.brain,along=(p.x-b.x)*this.ux+(p.z-b.z)*this.uz;
      target=this.guide(clamp((along-.35)/Math.max(.1,this.length),0,1));
    }else return;
    const gain=this.members.has(i)?85:65;
    p.vx+=clamp((target.x-p.x)*gain-p.vx*11,-42,42)*h;
    p.vy+=(clamp((target.y-p.y)*gain-p.vy*11,-32,42)+7.2)*h;
    p.vz+=clamp((target.z-p.z)*gain-p.vz*11,-42,42)*h;
  }
  solve(){
    if(!this.active)return;
    const f=this.fluid;
    // Neighbor constraints hold a thin, elastic stream, with bounded corrections.
    for(let j=0;j<this.indices.length;j++){
      const a=j?f.particles[this.indices[j-1]]:f.brain,b=f.particles[this.indices[j]],d=distance(a,b);
      const limit=j?.23*f.size:.3*f.size;
      if(d<=limit||segmentBlockedBySolid(a,b,this.colliders,f.radius*.3))continue;
      const correction=Math.min(.035,(d-limit)*.4),share=j?.5:0;
      const dx=(b.x-a.x)/d*correction,dy=(b.y-a.y)/d*correction,dz=(b.z-a.z)/d*correction;
      if(j){a.x+=dx*share;a.y+=dy*share;a.z+=dz*share;}
      b.x-=dx*(1-share);b.y-=dy*(1-share);b.z-=dz*(1-share);
    }
  }
  finish(dt,colliders){
    if(!this.active)return;
    const f=this.fluid,b=f.brain;
    for(const p of this.cargo)if(p.feedstock||distance(p,b)<.45)this.cargo.delete(p);
    let broken=this.age>1.4&&distance(f.particles[this.indices.at(-1)],this.guide(1))>.75*f.size;
    for(let j=0;j<this.indices.length;j++){
      const p=f.particles[this.indices[j]],previous=j?f.particles[this.indices[j-1]]:b;
      if(p.feedstock||distance(p,previous)>.5*f.size||segmentBlockedBySolid(p,previous,colliders,f.radius*.3))broken=true;
    }
    this.strain=broken?this.strain+dt:Math.max(0,this.strain-dt*2);
    if(this.age>.7&&this.strain>.4)this.release('broken');
  }
}


export class TendrilGroup {
  constructor(fluid){this.fluid=fluid;this.strands=[];this.recalling=false;this.lastState='ready';this.feedback='';this.feedbackUntil=0;this.recovered=0;}
  get active(){return this.strands.some(s=>s.active);}
  get count(){return this.strands.filter(s=>s.active).length;}
  get indices(){return this.strands.flatMap(s=>s.indices);}
  get length(){return this.strands.reduce((sum,s)=>sum+s.length,0);}
  get state(){return this.active?(this.recalling?'retrieving':this.strands.some(s=>s.state==='casting')?'casting':this.strands.some(s=>s.cargo.size)?'contact':'extended'):this.lastState;}
  reject(message){this.feedback=message;this.feedbackUntil=this.fluid.time+2;return false;}
  cast(aim,colliders){
    if(this.count>=3)return this.reject('Three tendrils out — recall to free one');
    const reserved=new Set(this.indices);
    this.strands.forEach(s=>s.cargo.forEach(p=>reserved.add(this.fluid.particles.indexOf(p))));
    const strand=new Tendril(this.fluid);
    if(!strand.cast(aim,colliders,reserved)){
      if(!this.active)this.lastState=strand.state;
      return this.reject(strand.state==='need flesh'?'Not enough flesh — gather or recall':'Aim farther from the body');
    }
    if(!this.active)this.brainAnchor={x:this.fluid.brain.x,z:this.fluid.brain.z};
    this.strands.push(strand);this.recalling=false;this.feedback='';this.lastState='ready';return true;
  }
  toggleRecall(){if(this.active)this.recalling=!this.recalling;}
  release(state='ready'){this.strands.forEach(s=>s.release(state));this.strands=[];this.recalling=false;this.lastState=state;this.feedback='';}
  controls(i){return this.strands.some(s=>s.controls(i));}
  prepare(dt,contracting,colliders,moving=false){
    if(!this.active)return;
    if(contracting)this.recalling=true;
    if(moving)this.brainAnchor={x:this.fluid.brain.x,z:this.fluid.brain.z};
    this.wasLoose=new Set(this.fluid.particles.filter(p=>p.feedstock));
    this.strands.forEach(s=>s.prepare(dt,this.recalling,colliders,moving));
  }
  forces(p,i,h){const strand=this.strands.find(s=>s.controls(i));strand?.forces(p,i,h);}
  solve(){this.strands.forEach(s=>s.solve());}
  finish(dt,colliders){
    const f=this.fluid,b=f.brain,active=this.strands.filter(s=>s.active);
    // Each newly connected particle has exactly one owner, even where streams meet.
    for(const p of this.wasLoose||[]){
      if(p.feedstock||p.component!==b.component||distance(p,b)<.45||active.some(s=>s.cargo.has(p)))continue;
      let nearest=null,best=Infinity;
      for(const s of active)for(const i of s.indices){const d=distance(p,f.particles[i]);if(d<best){best=d;nearest=s;}}
      if(nearest){nearest.cargo.add(p);nearest.recovered++;this.recovered++;}
    }
    this.strands.forEach(s=>s.finish(dt,colliders));
    const ended=this.strands.filter(s=>!s.active);
    if(ended.some(s=>s.state==='broken')){this.lastState='broken';this.reject(this.active?'A tendril broke — the others are still available':'Tendril broke — gather flesh and cast again');}
    else if(ended.length)this.lastState='ready';
    this.strands=this.strands.filter(s=>s.active);
    if(!this.active)this.recalling=false;
    this.wasLoose=null;
  }
}
