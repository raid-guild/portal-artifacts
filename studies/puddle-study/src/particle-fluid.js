import {resolveParticle,segmentBlockedBySolid} from './colliders.js';

const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const key=(x,y,z)=>`${x},${y},${z}`;

export class ParticleFluid {
  constructor({x=-2.1,z=0,size=1,seedCount=null,massReferenceCount=null}={}){
    this.size=size;this.radius=.067*size;this.range=.35*size;
    this.particles=[];
    const spacing=.155*size;
    for(let iy=0;iy<3;iy++)for(let iz=-5;iz<=5;iz++)for(let ix=-6;ix<=6;ix++){
      const nx=ix/6,nz=iz/5;
      if(nx*nx+nz*nz>1.04)continue;
      const height=.105+.08*(1-nx*nx)*(1-nz*nz);
      const px=x+ix*spacing,pz=z+iz*spacing;
      const py=(this.radius+.012)+iy*height*size;
      this.particles.push({x:px,y:py,z:pz,px,py,pz,vx:0,vy:0,vz:0,component:0,lastMain:0,lastBrain:0});
    }
    // The stable control point remains a real, colliding particle.
    this.brainIndex=this.particles.findIndex(p=>Math.abs(p.x-x)<1e-6&&Math.abs(p.z-z)<1e-6&&p.y>this.radius+.1*size);
    if(this.brainIndex<0)this.brainIndex=Math.floor(this.particles.length/2);
    const fullCount=this.particles.length;
    if(seedCount!==null&&seedCount<fullCount){
      const core=this.particles[this.brainIndex];
      const selected=this.particles.map((p,i)=>({p,i,d:Math.hypot(p.x-core.x,p.y-core.y,p.z-core.z)}))
        .sort((a,b)=>a.d-b.d).slice(0,Math.max(17,seedCount));
      this.brainIndex=selected.findIndex(q=>q.i===this.brainIndex);
      this.particles=selected.map(q=>q.p);
    }
    this.initialCount=this.particles.length;
    this.massReferenceCount=massReferenceCount??this.initialCount;
    this.coatIndices=this.particles.map((p,i)=>({i,d:Math.hypot(p.x-this.brain.x,p.y-this.brain.y,p.z-this.brain.z)}))
      .filter(q=>q.i!==this.brainIndex).sort((a,b)=>a.d-b.d).slice(0,16).map(q=>q.i);
    this.coatReach=.25*size;
    this.attachedCount=0;this.attachedMass=0;this.brainPower=0;
    this.restDensity=0;
    this.time=0;this.contacts=0;this.mainComponent=0;
    this.contractAnchor=null;this.brainDrive={x:0,z:0};
    this.components=[];this.pairs=[];
    this.cohesion=.16;this.viscosity=.22;
    this.edgeReach=size>=1.2?2.9:2.4;
    this.edgeStrength=.012*size;
    this.samplePairs();
    const density=new Float32Array(this.particles.length);
    for(const [i,j,d] of this.pairs){const q=1-d/this.range;density[i]+=q*q;density[j]+=q*q;}
    const sorted=[...density].sort((a,b)=>a-b);
    this.restDensity=sorted[Math.floor(sorted.length*.55)];
    this.updateComponents();
  }
  centroid(){let x=0,y=0,z=0;for(const p of this.particles){x+=p.x;y+=p.y;z+=p.z;}
    const n=this.particles.length||1;return{x:x/n,y:y/n,z:z/n};}
  get brain(){return this.particles[this.brainIndex];}
  addParticle(position,{feedstock=false}={}){
    const p={...position,px:position.x,py:position.y,pz:position.z,
      vx:0,vy:0,vz:0,component:-1,lastMain:-Infinity,lastBrain:-Infinity,feedstock};
    this.particles.push(p);
    return p;
  }
  field(distance,soft=1.9*this.size){
    const q=distance/soft;
    return 1/(1+q*q);
  }
  coatContacts(colliders=[]){
    const b=this.brain,limit=this.coatReach+1e-5;
    return this.coatIndices.filter(i=>{
      const p=this.particles[i];
      return Math.hypot(p.x-b.x,p.y-b.y,p.z-b.z)<=limit&&
        !segmentBlockedBySolid(b,p,colliders,this.radius*.35);
    });
  }
  constrainCoat(colliders){
    const b=this.brain,reach=this.coatReach*.9;
    // Leave a small contact margin: resolving the next tether can move the core.
    // Reconcile solid contact and tethers together before accepting this step.
    for(let pass=0;pass<8;pass++){
    for(const i of this.coatIndices){
      const p=this.particles[i],dx=p.x-b.x,dy=p.y-b.y,dz=p.z-b.z,d=Math.hypot(dx,dy,dz);
      // A forced, already remote fragment cannot tug the core across space.
      // Nearby coating still gets corrected if a collision briefly breaks graph contact.
      if(p.component!==b.component&&d>2*reach)continue;
      if(d<=reach||d<1e-8)continue;
      const excess=Math.min(d-reach,.035*this.size),coreShare=.05;
      b.x+=dx/d*excess*coreShare;b.y+=dy/d*excess*coreShare;b.z+=dz/d*excess*coreShare;
      p.x-=dx/d*excess*(1-coreShare);p.y-=dy/d*excess*(1-coreShare);p.z-=dz/d*excess*(1-coreShare);
      this.contacts+=resolveParticle(b,this.radius,colliders)+resolveParticle(p,this.radius,colliders);
    }
    if(this.coatContacts(colliders).length>=8)break;
    }
  }
  startContract(colliders=[]){
    this.samplePairs();this.updateComponents(colliders);
    const points=(this.components.find(c=>c.includes(this.brainIndex))||[]).filter(i=>i!==this.brainIndex);
    const n=points.length||1;
    this.contractAnchor={x:points.length?points.reduce((s,i)=>s+this.particles[i].x,0)/n:this.brain.x,
      z:points.length?points.reduce((s,i)=>s+this.particles[i].z,0)/n:this.brain.z};
  }
  moveBrain(h,input,colliders){
    const p=this.brain,s=this.size,anchor=this.contractAnchor;
    const speed=Math.hypot(input.x||0,input.z||0),ux=speed?(input.x||0)/speed:0,uz=speed?(input.z||0)/speed:0;
    const centering=anchor&&Math.hypot(anchor.x-p.x,anchor.z-p.z)>.08*s;
    const power=this.brainPower,maxSpeed=(input.push?3.6:2.4)*Math.max(s,1)*power,accel=24*Math.max(s,1)*power;
    const approach=(v,target,delta)=>v+clamp(target-v,-delta,delta);
    this.brainDrive.x=power?approach(this.brainDrive.x,centering?0:ux*maxSpeed,accel*h):0;
    this.brainDrive.z=power?approach(this.brainDrive.z,centering?0:uz*maxSpeed,accel*h):0;
    const toward=anchor?{x:anchor.x-p.x,z:anchor.z-p.z}:{x:0,z:0};
    const horizontal={x:this.brainDrive.x+clamp(toward.x*3.3,-1.8*s,1.8*s)*power,
      z:this.brainDrive.z+clamp(toward.z*3.3,-1.8*s,1.8*s)*power};
    const attachedFraction=Math.min(1,this.attachedCount/Math.max(1,this.massReferenceCount-1));
    let targetY=anchor?this.radius+.16*s+(1.25*s-this.radius-.16*s)*Math.cbrt(attachedFraction):this.radius+.16*s;
    if(anchor){
      // The core can rise only as the body below it rises. Reserved coat
      // particles alone cannot support a hovering brain above a flat pool.
      const support=this.particles.filter((q,i)=>i!==this.brainIndex&&!this.coatIndices.includes(i)&&
        !q.feedstock&&q.component===p.component&&Math.hypot(q.x-anchor.x,q.z-anchor.z)<.53*s)
        .map(q=>q.y).sort((a,b)=>a-b);
      const supported=support.length>=8?support[Math.floor(support.length*.65)]+.23*s:this.radius+.18*s;
      targetY=Math.min(targetY,supported);
    }
    const roof=colliders.find(c=>c.type==='roof');
    let under=0;
    if(roof&&Math.abs(p.z)<roof.maxZ+.2){
      // Lower the core before it reaches the entrance. Its rendered radius is
      // .105*size, so the complete visible brain must fit below the roof.
      const start=roof.minX-1.8*s,end=roof.minX-.55*s;
      const entering=clamp((p.x-start)/(end-start),0,1);
      const leaving=clamp((roof.maxX+.75*s-p.x)/(.5*s),0,1);
      under=entering*leaving;
      const low=Math.max(this.radius+.018,Math.min(this.radius+.025,roof.bottom-.105*s-.012));
      targetY=targetY*(1-under)+low*under;
    }
    const vertical=clamp((targetY-p.y)*(under?6:3.2),-1.8*s,1.8*s)*power;
    const old={x:p.x,y:p.y,z:p.z};
    // Small resolved increments keep thin solids from being crossed by the controller.
    const steps=Math.max(1,Math.ceil(Math.hypot(horizontal.x,vertical,horizontal.z)*h/(this.radius*.45)));
    for(let k=0;k<steps;k++){
      p.px=p.x;p.py=p.y;p.pz=p.z;
      p.x+=horizontal.x*h/steps;p.y+=vertical*h/steps;p.z+=horizontal.z*h/steps;
      this.contacts+=resolveParticle(p,this.radius,colliders);
    }
    p.px=old.x;p.py=old.y;p.pz=old.z;
    p.vx=(p.x-old.x)/h;p.vy=(p.y-old.y)/h;p.vz=(p.z-old.z)/h;
    if(anchor&&speed&&!centering){
      const accepted=clamp((p.x-old.x)*ux+(p.z-old.z)*uz,0,maxSpeed*h);
      anchor.x+=ux*accepted;anchor.z+=uz*accepted;
    }
    if(Math.abs(p.x-old.x)<Math.abs(horizontal.x*h)*.3)this.brainDrive.x=0;
    if(Math.abs(p.z-old.z)<Math.abs(horizontal.z*h)*.3)this.brainDrive.z=0;
  }
  samplePairs(){
    const h=this.range,grid=new Map(),particles=this.particles;
    for(let i=0;i<particles.length;i++){
      const p=particles[i],cx=Math.floor(p.x/h),cy=Math.floor(p.y/h),cz=Math.floor(p.z/h);
      const k=key(cx,cy,cz);if(!grid.has(k))grid.set(k,[]);grid.get(k).push(i);
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
    this.pairs=pairs;return pairs;
  }
  updateComponents(colliders=[]){
    const n=this.particles.length,parent=Array.from({length:n},(_,i)=>i);
    const find=i=>{while(parent[i]!==i){parent[i]=parent[parent[i]];i=parent[i];}return i;};
    for(const [i,j,d] of this.pairs)if(d<this.range*.84&&
      !!this.particles[i].feedstock===!!this.particles[j].feedstock&&
      (!colliders.length||!segmentBlockedBySolid(this.particles[i],this.particles[j],colliders,this.radius*.35))){
      const a=find(i),b=find(j);if(a!==b)parent[b]=a;}
    const map=new Map();for(let i=0;i<n;i++){const root=find(i);if(!map.has(root))map.set(root,[]);map.get(root).push(i);}
    this.components=[...map.values()].sort((a,b)=>b.length-a.length);
    const main=new Set(this.components[0]||[]);
    const brainRoot=this.components.findIndex(c=>c.includes(this.brainIndex));
    for(let i=0;i<n;i++){this.particles[i].component=this.components.findIndex(c=>c.includes(i));
      if(main.has(i))this.particles[i].lastMain=this.time;
      if(this.particles[i].component===brainRoot)this.particles[i].lastBrain=this.time;}
    this.mainComponent=this.components[0]?.length||0;
    this.attachedCount=Math.max(0,(this.components[brainRoot]?.length||1)-1);
    this.attachedMass=this.attachedCount*this.size**3/Math.max(1,this.massReferenceCount-1);
    this.brainPower=this.attachedMass/(this.attachedMass+.35);
    return this.components;
  }
  attractExposedEdges(h,colliders,controlledBrain=false){
    if(this.cohesion<=0||this.edgeReach<=0||this.edgeStrength<=0)return;
    const particles=this.particles,n=particles.length,range=this.range;
    const sx=new Float32Array(n),sz=new Float32Array(n),weight=new Float32Array(n);
    for(const [i,j,d] of this.pairs){
      if(controlledBrain&&(i===this.brainIndex||j===this.brainIndex))continue;
      if(controlledBrain&&!!particles[i].feedstock!==!!particles[j].feedstock)continue;
      const a=particles[i],b=particles[j],dx=b.x-a.x,dz=b.z-a.z,flat=Math.hypot(dx,dz);
      if(flat<.045*this.size)continue;
      const w=1-d/range,ux=dx/flat,uz=dz/flat;
      sx[i]+=ux*w;sz[i]+=uz*w;sx[j]-=ux*w;sz[j]-=uz*w;
      weight[i]+=w;weight[j]+=w;
    }
    const exposed=[];
    for(let i=0;i<n;i++){
      if(weight[i]<.35)continue; // isolated particles have no reliable edge normal
      const imbalance=Math.hypot(sx[i],sz[i])/weight[i];
      if(imbalance<.38)continue;
      const length=Math.hypot(sx[i],sz[i]);
      exposed.push({i,nx:-sx[i]/length,nz:-sz[i]/length});
    }
    const candidates=[];
    const minDist=Math.max(range*1.25,.44*this.size),reach=this.edgeReach;
    for(let a=0;a<exposed.length;a++)for(let b=a+1;b<exposed.length;b++){
      const ea=exposed[a],eb=exposed[b],pa=particles[ea.i],pb=particles[eb.i];
      // Scattered supply starts as separate pools. Their exposed rims may
      // cohere locally, but should not bridge the lanes before the player
      // reaches them. Growth drops have no patch identity and are unchanged.
      if(pa.feedstock&&pb.feedstock&&pa.patchId!==pb.patchId)continue;
      const dx=pb.x-pa.x,dz=pb.z-pa.z,d=Math.hypot(dx,dz);
      if(d<minDist||d>reach||Math.abs(pb.y-pa.y)>.36*this.size)continue;
      const ux=dx/d,uz=dz/d;
      if(ea.nx*ux+ea.nz*uz<.65||eb.nx*ux+eb.nz*uz>-.65)continue;
      candidates.push({i:ea.i,j:eb.i,d,ux,uz});
    }
    candidates.sort((a,b)=>a.d-b.d);
    const degree=new Uint8Array(n),spent=new Float32Array(n),scale=(h*60)*this.cohesion/.16;
    for(const pair of candidates){
      const {i,j,d,ux,uz}=pair;
      if(degree[i]>=2||degree[j]>=2||controlledBrain&&(i===this.brainIndex||j===this.brainIndex))continue;
      if(controlledBrain&&!!particles[i].feedstock!==!!particles[j].feedstock)continue;
      if(segmentBlockedBySolid(particles[i],particles[j],colliders,this.radius*.35))continue;
      const base=Math.min((.45+.55*(1-d/reach))*this.edgeStrength,
        this.edgeStrength-spent[i],this.edgeStrength-spent[j]);
      if(base<=0)continue;
      degree[i]++;degree[j]++;spent[i]+=base;spent[j]+=base;
      const correction=base*scale;
      particles[i].x+=ux*correction;particles[i].z+=uz*correction;
      particles[j].x-=ux*correction;particles[j].z-=uz*correction;
    }
  }
  step(dt,input,colliders,hooks={}){
    if(!(dt>0))return;
    const substeps=1,h=dt/substeps,particles=this.particles,r=this.radius;
    this.contacts=0;
    if(input.puddle){
      if(input.contract&&!this.contractAnchor)this.startContract(colliders);
      if(!input.contract)this.contractAnchor=null;
    }
    for(let sub=0;sub<substeps;sub++){
      this.time+=h;
      if(input.puddle)this.moveBrain(h,input,colliders);
      const center=input.puddle?this.brain:this.centroid(),speed=Math.hypot(input.x||0,input.z||0);
      // Keep a real basal layer on the ground while the remaining owned
      // particles stack. Recompute from current heights so the layer can flow.
      const base=new Set();
      if(input.puddle&&input.contract){
        const candidates=particles.map((p,i)=>({p,i})).filter(({p,i})=>
          i!==this.brainIndex&&!this.coatIndices.includes(i)&&!p.feedstock&&p.component===this.brain.component)
          .sort((a,b)=>a.p.y-b.p.y);
        for(let i=0;i<Math.ceil(candidates.length*.25);i++)base.add(candidates[i].i);
      }
      const ux=speed?(input.x||0)/speed:0,uz=speed?(input.z||0)/speed:0;
      for(let i=0;i<particles.length;i++){
        const p=particles[i];
        if(input.puddle&&i===this.brainIndex)continue;
        p.px=p.x;p.py=p.y;p.pz=p.z;
        const recentlyMain=this.time-p.lastMain<2.5;
        const brainComponent=this.brain.component;
        const canDrive=input.puddle?
          p.component===brainComponent:
          p.component===0||recentlyMain&&this.components[p.component]?.length>this.initialCount*.1;
        const along=((p.x-center.x)*ux+(p.z-center.z)*uz)/this.size;
        const lead=clamp(1+.10*along,.82,1.14);
        if(canDrive&&!input.puddle){const drive=input.push?6:1;p.vx+=ux*7.5*speed*lead*drive*h;p.vz+=uz*7.5*speed*lead*drive*h;}
        if(input.puddle&&!p.feedstock&&!input.contract){
          const dx=center.x-p.x,dz=center.z-p.z,d=Math.hypot(dx,dz),dead=.19*this.size;
          if(d>dead){
            const spatial=Math.hypot(dx,center.y-p.y,dz);
            const near=clamp((d-dead)/(.4*this.size),0,1),attached=p.component===brainComponent;
            const falloff=this.field(spatial),gain=(attached?12:8)*this.brainPower*falloff*near;
            p.vx+=(dx/d*gain-p.vx*.8*falloff)*h;
            p.vz+=(dz/d*gain-p.vz*.8*falloff)*h;
          }
        }
        if(input.contract&&!p.feedstock&&i!==this.brainIndex){
          const attached=p.component===brainComponent;
          const target=attached?(this.contractAnchor||center):center;
          const dx=target.x-p.x,dz=target.z-p.z,d=Math.hypot(dx,dz);
          const dead=.12*this.size;
          if(d>dead){
            const falloff=this.field(Math.hypot(dx,center.y-p.y,dz));
            const ramp=clamp((d-dead)/(.5*this.size),0,1);
            const strength=(attached?48:52)*this.brainPower*falloff*ramp;
            p.vx+=(dx/d*strength-p.vx*3.2*falloff)*h;
            p.vz+=(dz/d*strength-p.vz*3.2*falloff)*h;
          }
          if(input.puddle&&attached&&!this.coatIndices.includes(i)&&!base.has(i)&&this.contractAnchor){
            // Draw the owned fluid into a three-dimensional mound. The force
            // acts on existing particles and fades at its rim; loose supply
            // and distant fragments remain grounded until they join.
            const radial=Math.hypot(p.x-target.x,p.z-target.z);
            const fullness=Math.min(1,this.attachedCount/Math.max(1,this.massReferenceCount-1));
            const rim=(.62+.34*Math.cbrt(fullness))*this.size;
            const profile=clamp(1-radial/rim,0,1);
            const desired=this.radius+.014*this.size+profile*(.16+.9*Math.cbrt(fullness))*this.size;
            if(profile>0){
              const lift=clamp((desired-p.y)*48-p.vy*4,-12*this.size,24*this.size);
              p.vy+=lift*h;
            }
          }
        }
        p.vy-=7.2*h;
        const floor=p.y<=r+.02;
        const drag=floor?.968:.993;
        p.vx*=drag;p.vy*=.995;p.vz*=drag;
        if(floor&&!speed){p.vx*=.88;p.vz*=.88;}
        p.x+=p.vx*h;p.y+=p.vy*h;p.z+=p.vz*h;
      }
      hooks.preSubstep?.(h,particles);
      this.samplePairs();this.attractExposedEdges(h,colliders,input.puddle);
      for(let iter=0;iter<(input.contract?4:2);iter++){
        this.samplePairs();
        const rho=new Float32Array(particles.length),near=new Float32Array(particles.length);
        for(const [i,j,d] of this.pairs){const q=1-d/this.range,q2=q*q,q3=q2*q;
          rho[i]+=q2;rho[j]+=q2;near[i]+=q3;near[j]+=q3;}
        for(const [i,j,d] of this.pairs){
          const a=particles[i],b=particles[j],q=1-d/this.range;
          const nx=(b.x-a.x)/(d||1),ny=(b.y-a.y)/(d||1),nz=(b.z-a.z)/(d||1);
          const pressureA=Math.max(-.004,(rho[i]-this.restDensity)*.0037);
          const pressureB=Math.max(-.004,(rho[j]-this.restDensity)*.0037);
          const nearPressure=(near[i]+near[j])*.0026;
          let shift=((pressureA+pressureB)*q+nearPressure*q*q)*.5;
          if(d<r*1.78)shift+=Math.min(.006,(r*1.78-d)*.06);
          if(d>r*2.45)shift-=this.cohesion*.02*q;
          shift=clamp(shift,-.005,.007);
          if(input.puddle&&i===this.brainIndex){b.x+=nx*shift*2;b.y+=ny*shift*2;b.z+=nz*shift*2;}
          else if(input.puddle&&j===this.brainIndex){a.x-=nx*shift*2;a.y-=ny*shift*2;a.z-=nz*shift*2;}
          else{a.x-=nx*shift;a.y-=ny*shift;a.z-=nz*shift;
            b.x+=nx*shift;b.y+=ny*shift;b.z+=nz*shift;}
        }
        hooks.solve?.(h,particles);
        for(const p of particles)this.contacts+=resolveParticle(p,r,colliders);
        if(input.puddle)this.constrainCoat(colliders);
      }
      this.samplePairs();
      for(const p of particles){p.vx=clamp((p.x-p.px)/h,-5,5);p.vy=clamp((p.y-p.py)/h,-5,5);p.vz=clamp((p.z-p.pz)/h,-5,5);}
      for(const [i,j,d] of this.pairs){
        if(input.puddle&&(i===this.brainIndex||j===this.brainIndex))continue;
        const a=particles[i],b=particles[j],blend=this.viscosity*(1-d/this.range)*.045;
        const dx=(b.vx-a.vx)*blend,dy=(b.vy-a.vy)*blend,dz=(b.vz-a.vz)*blend;
        a.vx+=dx;a.vy+=dy;a.vz+=dz;b.vx-=dx;b.vy-=dy;b.vz-=dz;
      }
      hooks.postSubstep?.(h,particles);
    }
    this.samplePairs();
    if(input.puddle&&input.growth){
      // Ownership for the claim uses this frame's actual solid-clear graph.
      // A fragment that just broke away cannot collect a drop on behalf of the brain.
      this.updateComponents(colliders);
      this.claimFeedstock(colliders);
    }
    this.updateComponents(input.puddle?colliders:[]);
  }
  claimFeedstock(colliders){
    // Contact with brain-connected flesh, rather than the distant attraction field,
    // transfers actual material from the independent supply to the body.
    const owned=this.particles.filter(p=>!p.feedstock&&p.component===this.brain.component);
    if(!owned.length)return;
    const reach=this.range*.75;
    for(const p of this.particles){
      if(!p.feedstock)continue;
      if(owned.some(q=>Math.hypot(q.x-p.x,q.y-p.y,q.z-p.z)<reach&&
        !segmentBlockedBySolid(q,p,colliders,this.radius*.35)))p.feedstock=false;
    }
  }
}
