import {resolveParticle,segmentBlockedBySolid,groundAt,supportedGroundAt,contactingCommittedTop} from './colliders.js';
import {floorPaintApplies} from './surface-paint.js';
import {gripAxis} from './grip-ramp.js';
import {solidInside} from './editor-solid-physics.js';

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
    this.brainAirborne=false;
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
  removeParticles(indices,colliders=[]){
    const removed=new Set(indices),map=new Int32Array(this.particles.length).fill(-1);
    if(removed.has(this.brainIndex))throw new Error('The brain must respawn before particle removal.');
    const kept=[];
    this.particles.forEach((p,i)=>{if(!removed.has(i)){map[i]=kept.length;kept.push(p);}});
    this.particles=kept;this.brainIndex=map[this.brainIndex];
    this.coatIndices=this.coatIndices.map(i=>map[i]).filter(i=>i>=0);
    this.pairs=[];this.components=[];this.contractAnchor=null;
    this.samplePairs();this.updateComponents(colliders);
    return map;
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
  startContract(colliders=[],controlled=()=>false){
    this.samplePairs();this.updateComponents(colliders);
    const points=(this.components.find(c=>c.includes(this.brainIndex))||[]).filter(i=>i!==this.brainIndex&&!controlled(i));
    const n=points.length||1;
    this.contractAnchor={x:points.length?points.reduce((s,i)=>s+this.particles[i].x,0)/n:this.brain.x,
      z:points.length?points.reduce((s,i)=>s+this.particles[i].z,0)/n:this.brain.z};
  }
  moveBrain(h,input,colliders){
    const p=this.brain,s=this.size,anchor=this.contractAnchor;
    const speed=Math.hypot(input.x||0,input.z||0),ux=speed?(input.x||0)/speed:0,uz=speed?(input.z||0)/speed:0;
    const centering=anchor&&Math.hypot(anchor.x-p.x,anchor.z-p.z)>.08*s;
    const power=this.brainPower,maxSpeed=(input.push?4.8:3.6)*Math.max(s,1)*power,accel=24*Math.max(s,1)*power;
    const approach=(v,target,delta)=>v+clamp(target-v,-delta,delta);
    const brainSupport=supportedGroundAt(p,this.radius,colliders);
    const slip=colliders.find(c=>c.type==='slip'&&floorPaintApplies(c,p,this.radius,colliders,s,brainSupport));
    const stickyFloor=colliders.find(c=>c.type==='sticky-paint'&&
      floorPaintApplies(c,p,this.radius,colliders,s,brainSupport));
    this.brainSlipping=!!slip;
    const steering=slip?accel*.12:stickyFloor?accel*.65:accel,
      surfaceSpeed=stickyFloor?maxSpeed*.78:maxSpeed;
    this.brainDrive.x=power?approach(this.brainDrive.x,centering?0:ux*surfaceSpeed,steering*h):0;
    this.brainDrive.z=power?approach(this.brainDrive.z,centering?0:uz*surfaceSpeed,steering*h):0;
    const hold=anchor||input.holdPosition;
    const toward=hold?{x:hold.x-p.x,z:hold.z-p.z}:{x:0,z:0};
    const horizontal={x:this.brainDrive.x+clamp(toward.x*3.3,-1.8*s,1.8*s)*power,
      z:this.brainDrive.z+clamp(toward.z*3.3,-1.8*s,1.8*s)*power};
    const attachedFraction=Math.min(1,this.attachedCount/Math.max(1,this.massReferenceCount-1));
    const ground=supportedGroundAt(p,this.radius,colliders);
    let targetY=ground+(anchor?this.radius+.16*s+(1.25*s-this.radius-.16*s)*Math.cbrt(attachedFraction):this.radius+.16*s);
    if(anchor){
      // The core can rise only as the body below it rises. Reserved coat
      // particles alone cannot support a hovering brain above a flat pool.
      const support=this.particles.filter((q,i)=>i!==this.brainIndex&&!this.coatIndices.includes(i)&&
        !q.feedstock&&q.component===p.component&&Math.hypot(q.x-anchor.x,q.z-anchor.z)<.53*s)
        .map(q=>q.y).sort((a,b)=>a-b);
      const supported=support.length>=8?support[Math.floor(support.length*.65)]+.23*s:ground+this.radius+.18*s;
      targetY=Math.min(targetY,supported);
    }
    const roofs=colliders.filter(c=>c.type==='roof'&&p.z>c.minZ-.2&&p.z<c.maxZ+.2);
    const roof=roofs.reduce((best,c)=>{
      const distance=Math.max(c.minX-p.x,0,p.x-c.maxX);
      const bestDistance=best?Math.max(best.minX-p.x,0,p.x-best.maxX):Infinity;
      return distance<bestDistance?c:best;
    },null);
    let under=0;
    if(roof){
      // Lower the core before it reaches the entrance. Its rendered radius is
      // .105*size, so the complete visible brain must fit below the roof.
      const entering=clamp((p.x-(roof.minX-1.8*s))/(1.25*s),0,1);
      const leaving=roof.approachBothSides?
        clamp(((roof.maxX+1.8*s)-p.x)/(1.25*s),0,1):
        clamp((roof.maxX+.75*s-p.x)/(.5*s),0,1);
      under=entering*leaving;
      const low=ground+Math.max(this.radius+.018,Math.min(this.radius+.025,roof.bottom-ground-.105*s-.022));
      targetY=targetY*(1-under)+low*under;
    }
    const ramp=colliders.find(c=>c.type==='grip-ramp'||c.type==='grip-ramp-control');
    const authoredPlatform=colliders.find(c=>c.gripPlatform&&ramp);
    const cutSolid=colliders.find(c=>c.type==='editor-solid-mesh');
    const paintedWall=colliders.filter(c=>c.type==='sticky-wall').find(c=>{
      const coordinate=c.face==='west'?c.minX:c.face==='east'?c.maxX:c.face==='north'?c.minZ:c.maxZ;
      const normal=c.face==='west'||c.face==='north'?-1:1;
      const along=['west','east'].includes(c.face)?p.x:p.z;
      const across=['west','east'].includes(c.face)?p.z:p.x;
      const lo=['west','east'].includes(c.face)?c.minZ:c.minX,hi=['west','east'].includes(c.face)?c.maxZ:c.maxX;
      const interior=coordinate-normal*.035;
      if(cutSolid&&!solidInside(cutSolid,['west','east'].includes(c.face)?interior:p.x,
        clamp(p.y,c.minY+.04,c.maxY-.04),['north','south'].includes(c.face)?interior:p.z))return false;
      return (along-coordinate)*normal>=this.radius-.08&&(along-coordinate)*normal<.75*s&&
        across>=lo+this.radius&&across<=hi-this.radius&&p.y>=c.minY+this.radius-.12&&p.y<c.maxY+this.radius+.1;
    });
    const platform=paintedWall||authoredPlatform;
    const axis=paintedWall?paintedWall.axis:gripAxis(ramp),along=axis==='x'?p.x:p.z,drive=axis==='x'?ux:uz;
    const minFace=platform?.[axis==='x'?'minX':'minZ'],maxFace=platform?.[axis==='x'?'maxX':'maxZ'];
    const exteriorFace=platform&&(along<minFace||along>maxFace)?
      {coordinate:along<minFace?minFace:maxFace,normal:along<minFace?-1:1}:null;
    const face=paintedWall?{coordinate:paintedWall.face==='west'||paintedWall.face==='north'?minFace:maxFace,
      normal:paintedWall.face==='west'||paintedWall.face==='north'?-1:1}:
      exteriorFace||(platform&&Math.abs(drive)>.4?
      {coordinate:drive<0?maxFace:minFace,normal:drive<0?1:-1}:null);
    const exterior=face?(along-face.coordinate)*face.normal:Infinity;
    const withinCross=platform&&(axis==='x'?p.z>=platform.minZ+this.radius&&p.z<=platform.maxZ-this.radius:
      p.x>=platform.minX+this.radius&&p.x<=platform.maxX-this.radius);
    const faceStillSolid=!cutSolid||!platform?.csgControl||!face||
      solidInside(cutSolid,axis==='x'?face.coordinate-face.normal*.035:p.x,
        clamp(p.y,platform.minY+.04,platform.maxY-.04),axis==='z'?face.coordinate-face.normal*.035:p.z);
    const atFace=face&&withinCross&&faceStillSolid&&
      exterior>=this.radius-.03&&exterior<=.62*s&&
      p.y>=platform.minY+this.radius-.12&&p.y<platform.maxY+this.radius+.1;
    const supports=atFace?this.particles.filter((q,i)=>i!==this.brainIndex&&!this.coatIndices.includes(i)&&
      !q.feedstock&&q.component===p.component&&
      (axis==='x'?q.z>=platform.minZ&&q.z<=platform.maxZ:q.x>=platform.minX&&q.x<=platform.maxX)&&
      ((axis==='x'?q.x:q.z)-face.coordinate)*face.normal>=-this.radius&&
      ((axis==='x'?q.x:q.z)-face.coordinate)*face.normal<=.58*s&&Math.abs(q.y-p.y)<.55*s).length:0;
    const gripping=!!(atFace&&drive*face.normal<-.4&&!anchor&&supports>=6&&this.coatContacts(colliders).length>=8);
    const transferring=!!(face&&Math.abs(drive)>.4&&!anchor&&p.x>=platform.minX&&p.x<=platform.maxX&&
      p.z>=platform.minZ&&p.z<=platform.maxZ&&p.y>=platform.maxY+this.radius-.04);
    this.gripClimbing=gripping||transferring;
    this.gripFace=this.gripClimbing?{...face,axis,minY:platform.minY}:null;
    // A terrain height is an eligible landing surface, not proof that the
    // core is standing on it. Once the connected body leaves a ledge, the
    // core must fall with the same gravity as its flesh. A basal layer that
    // is actually touching terrain (or a solid top) can still carry it.
    const rooted=q=>{
      const floor=supportedGroundAt(q,this.radius,colliders);
      if(q.y<=floor+this.radius+.065*s)return true;
      for(const c of colliders){
        if(c.type==='editor-solid-mesh'&&contactingCommittedTop(q,this.radius,c,.065*s)!==null)return true;
        let top=null,inside=false;
        if(c.type==='cylinder'){
          top=c.height;inside=Math.hypot(q.x-c.x,q.z-c.z)<=c.radius+this.radius;
        }else if(c.type==='box'||c.type==='roof'){
          top=c.type==='roof'?c.top:c.maxY;
          inside=q.x>=c.minX-this.radius&&q.x<=c.maxX+this.radius&&
            q.z>=c.minZ-this.radius&&q.z<=c.maxZ+this.radius;
        }
        if(inside&&Math.abs(q.y-top-this.radius)<.065*s)return true;
      }
      return false;
    };
    const directSupport=p.y<=ground+this.radius+.24*s||rooted(p);
    let basalSupport=0;
    if(!directSupport)for(let i=0;i<this.particles.length;i++){
      if(i===this.brainIndex||this.coatIndices.includes(i))continue;
      const q=this.particles[i];
      if(q.feedstock||q.component!==p.component||
        q.y>p.y-.04*s||p.y-q.y>1.05*s||
        Math.hypot(q.x-p.x,q.z-p.z)>.78*s||!rooted(q))continue;
      if(++basalSupport>=4)break;
    }
    const stickySupported=atFace&&supports>=6&&this.coatContacts(colliders).length>=8;
    this.brainAirborne=!directSupport&&basalSupport<4&&!stickySupported&&!transferring;
    let vertical=clamp((targetY-p.y)*(under?6:3.2),-1.8*s,1.8*s)*power;
    if(this.brainAirborne){
      vertical=clamp((p.vy-7.2*h)*.995,-5,5);
    }else if(gripping){
      const mass=this.attachedCount/Math.max(1,this.massReferenceCount-1);
      vertical=(3.6/(1+3*mass))*s*power;
    }else if(atFace&&p.y>targetY)vertical=Math.max(vertical,-.42*s);
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
    const h=this.range,particles=this.particles;
    let minX=Infinity,minY=Infinity,minZ=Infinity,maxX=-Infinity,maxY=-Infinity,maxZ=-Infinity;
    for(const p of particles){
      const cx=Math.floor(p.x/h),cy=Math.floor(p.y/h),cz=Math.floor(p.z/h);
      minX=Math.min(minX,cx);minY=Math.min(minY,cy);minZ=Math.min(minZ,cz);
      maxX=Math.max(maxX,cx);maxY=Math.max(maxY,cy);maxZ=Math.max(maxZ,cz);
    }
    minX--;minY--;minZ--;maxX++;maxY++;maxZ++;
    const spanY=maxY-minY+1,spanZ=maxZ-minZ+1;
    const volume=(maxX-minX+1)*spanY*spanZ;
    const numeric=Number.isSafeInteger(volume);
    const dense=numeric&&volume<=250000;
    const cellKey=numeric?(x,y,z)=>(x-minX)*spanY*spanZ+(y-minY)*spanZ+(z-minZ):key;
    let head,tail,next,grid;
    if(dense){
      const storage=this._pairGrid||{};
      if(!storage.head||storage.head.length<volume){storage.head=new Int32Array(volume);storage.tail=new Int32Array(volume);}
      if(!storage.next||storage.next.length<particles.length)storage.next=new Int32Array(particles.length);
      this._pairGrid=storage;
      head=storage.head;tail=storage.tail;next=storage.next;
      head.fill(-1,0,volume);tail.fill(-1,0,volume);
    }else grid=new Map();
    for(let i=0;i<particles.length;i++){
      const p=particles[i],cx=Math.floor(p.x/h),cy=Math.floor(p.y/h),cz=Math.floor(p.z/h);
      const k=cellKey(cx,cy,cz);
      if(dense){next[i]=-1;if(head[k]===-1)head[k]=i;else next[tail[k]]=i;tail[k]=i;}
      else{if(!grid.has(k))grid.set(k,[]);grid.get(k).push(i);}
    }
    const pairs=[];
    for(let i=0;i<particles.length;i++){
      const a=particles[i],cx=Math.floor(a.x/h),cy=Math.floor(a.y/h),cz=Math.floor(a.z/h);
      for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++)for(let dz=-1;dz<=1;dz++){
        const nx=cx+dx,ny=cy+dy,nz=cz+dz;
        if(numeric&&(nx<minX||nx>maxX||ny<minY||ny>maxY||nz<minZ||nz>maxZ))continue;
        const k=cellKey(nx,ny,nz);
        if(dense){
          for(let j=head[k];j!==-1;j=next[j]){if(j<=i)continue;const b=particles[j],d=Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);
            if(d<h)pairs.push([i,j,d]);}
        }else{
          const cell=grid.get(k);if(!cell)continue;
          for(const j of cell){if(j<=i)continue;const b=particles[j],d=Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);
            if(d<h)pairs.push([i,j,d]);}
        }
      }
    }
    this.pairs=pairs;return pairs;
  }
  updateComponents(colliders=[]){
    const n=this.particles.length,parent=Array.from({length:n},(_,i)=>i);
    const find=i=>{while(parent[i]!==i){parent[i]=parent[parent[i]];i=parent[i];}return i;};
    for(const [i,j,d] of this.pairs)if(d<this.range*.84&&
      !!this.particles[i].feedstock===!!this.particles[j].feedstock){
      const a=find(i),b=find(j);
      if(a!==b&&(!colliders.length||!segmentBlockedBySolid(this.particles[i],this.particles[j],colliders,this.radius*.35)))parent[b]=a;
    }
    const roots=new Int32Array(n),map=new Map();for(let i=0;i<n;i++){const root=find(i);roots[i]=root;if(!map.has(root))map.set(root,[]);map.get(root).push(i);}
    this.components=[...map.values()].sort((a,b)=>b.length-a.length);
    const componentIndex=new Int32Array(n);
    for(let c=0;c<this.components.length;c++)componentIndex[roots[this.components[c][0]]]=c;
    const brainRoot=componentIndex[roots[this.brainIndex]];
    for(let i=0;i<n;i++){const component=componentIndex[roots[i]];this.particles[i].component=component;
      if(component===0)this.particles[i].lastMain=this.time;
      if(component===brainRoot)this.particles[i].lastBrain=this.time;}
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
    const slipColliders=colliders.filter(c=>c.type==='slip'),stickyFloors=colliders.filter(c=>c.type==='sticky-paint'&&c.face==='floor');
    this.contacts=0;
    if(input.puddle){
      if(input.contract&&!this.contractAnchor)this.startContract(colliders,hooks.controls);
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
          i!==this.brainIndex&&!this.coatIndices.includes(i)&&!p.feedstock&&p.component===this.brain.component&&!hooks.controls?.(i))
          .sort((a,b)=>a.p.y-b.p.y);
        for(let i=0;i<Math.ceil(candidates.length*.25);i++)base.add(candidates[i].i);
      }
      const ux=speed?(input.x||0)/speed:0,uz=speed?(input.z||0)/speed:0;
      for(let i=0;i<particles.length;i++){
        const p=particles[i];
        if(input.puddle&&i===this.brainIndex)continue;
        p.px=p.x;p.py=p.y;p.pz=p.z;
        const floorHeight=supportedGroundAt(p,r,colliders);
        const recentlyMain=this.time-p.lastMain<2.5;
        const brainComponent=this.brain.component;
        const canDrive=input.puddle?
          p.component===brainComponent:
          p.component===0||recentlyMain&&this.components[p.component]?.length>this.initialCount*.1;
        const along=((p.x-center.x)*ux+(p.z-center.z)*uz)/this.size;
        const lead=clamp(1+.10*along,.82,1.14);
        if(canDrive&&!input.puddle){const drive=input.push?6:1;p.vx+=ux*7.5*speed*lead*drive*h;p.vz+=uz*7.5*speed*lead*drive*h;}
        if(input.puddle&&!p.feedstock&&!input.contract&&!hooks.controls?.(i)){
          const dx=center.x-p.x,dz=center.z-p.z,d=Math.hypot(dx,dz),dead=.19*this.size;
          const spatial=Math.hypot(dx,center.y-p.y,dz),attached=p.component===brainComponent;
          const falloff=this.field(spatial);
          if(d>dead){
            const near=clamp((d-dead)/(.4*this.size),0,1);
            const gain=(attached?12:8)*this.brainPower*falloff*near;
            p.vx+=(dx/d*gain-p.vx*.8*falloff)*h;
            p.vz+=(dz/d*gain-p.vz*.8*falloff)*h;
          }
          const onSlip=slipColliders.some(c=>floorPaintApplies(c,p,r,colliders,this.size,floorHeight));
          if(speed&&dx*ux+dz*uz>-.08*this.size&&attached&&!input.holdPosition&&!this.gripClimbing&&!this.brainSlipping&&!onSlip&&
            spatial<2.4*this.size&&(!colliders.length||!segmentBlockedBySolid(p,center,colliders,r*.35))){
            // Match the brain's accepted motion, not requested input. Local,
            // connected flesh can keep pace through a turn without pulling a
            // remote fragment through stone or overriding grip/slip behavior.
            const gain=12*this.brainPower*falloff,cap=24*Math.max(this.size,1)*this.brainPower;
            p.vx+=clamp((center.vx-p.vx)*gain,-cap,cap)*h;
            p.vz+=clamp((center.vz-p.vz)*gain,-cap,cap)*h;
          }
        }
        if(this.gripClimbing&&!p.feedstock&&p.component===brainComponent&&!this.coatIndices.includes(i)&&
          Math.abs(this.gripFace.axis==='x'?p.z-center.z:p.x-center.x)<.9*this.size&&
          ((this.gripFace.axis==='x'?p.x:p.z)-this.gripFace.coordinate)*this.gripFace.normal>-.45*this.size&&
          ((this.gripFace.axis==='x'?p.x:p.z)-this.gripFace.coordinate)*this.gripFace.normal<.9*this.size&&p.y>this.gripFace.minY-.2*this.size&&
          p.y<center.y+.6*this.size){
          p.vy+=clamp((center.y+.18*this.size-p.y)*54-p.vy*2,-4,42)*h;
        }
        if(input.contract&&!p.feedstock&&i!==this.brainIndex&&!hooks.controls?.(i)){
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
          if(input.puddle&&!this.brainAirborne&&attached&&!this.coatIndices.includes(i)&&!base.has(i)&&this.contractAnchor){
            // Draw the owned fluid into a three-dimensional mound. The force
            // acts on existing particles and fades at its rim; loose supply
            // and distant fragments remain grounded until they join.
            const radial=Math.hypot(p.x-target.x,p.z-target.z);
            const fullness=Math.min(1,this.attachedCount/Math.max(1,this.massReferenceCount-1));
            const rim=(.62+.34*Math.cbrt(fullness))*this.size;
            const profile=clamp(1-radial/rim,0,1);
            const desired=supportedGroundAt({x:target.x,y:center.y,z:target.z},this.radius,colliders)+
              this.radius+.014*this.size+profile*(.16+.9*Math.cbrt(fullness))*this.size;
            if(profile>0){
              const lift=clamp((desired-p.y)*48-p.vy*4,-12*this.size,24*this.size);
              p.vy+=lift*h;
            }
          }
        }
        hooks.forces?.(p,i,h);
        p.vy-=7.2*h;
        const floor=p.y<=floorHeight+r+.02;
        const slip=slipColliders.some(c=>floorPaintApplies(c,p,r,colliders,this.size,floorHeight));
        const sticky=stickyFloors.some(c=>floorPaintApplies(c,p,r,colliders,this.size,floorHeight));
        const drag=floor?(slip?.994:sticky?.94:.968):.993;
        p.vx*=drag;p.vy*=.995;p.vz*=drag;
        if(floor&&!speed){p.vx*=slip?.99:sticky?.68:.88;p.vz*=slip?.99:sticky?.68:.88;}
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
      const horizontalLimit=input.puddle?5*Math.max(this.size,1):5;
      for(const p of particles){p.vx=clamp((p.x-p.px)/h,-horizontalLimit,horizontalLimit);p.vy=clamp((p.y-p.py)/h,-5,5);p.vz=clamp((p.z-p.pz)/h,-horizontalLimit,horizontalLimit);}
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
      const ownership=particles.map(p=>!!p.feedstock);
      if(input.expireFragments)this.expireFragments();
      if(!input.shed)this.claimFeedstock(colliders);
      if(ownership.some((owned,i)=>owned!==!!particles[i].feedstock))this.updateComponents(colliders);
    }else{
      this.updateComponents(input.puddle?colliders:[]);
    }
  }
  expireFragments(grace=2.5){
    // A broken living piece gets a chance to reconnect before becoming inert.
    for(let i=0;i<this.particles.length;i++){
      const p=this.particles[i];
      if(i===this.brainIndex||this.coatIndices.includes(i)||p.feedstock||p.component===this.brain.component)continue;
      if(this.time-p.lastBrain>=grace){p.feedstock=true;p.shedLocked=false;}
    }
  }
  claimFeedstock(colliders){
    // Contact with brain-connected flesh, rather than the distant attraction field,
    // transfers actual material from the independent supply to the body.
    const owned=this.particles.filter(p=>!p.feedstock&&p.component===this.brain.component);
    if(!owned.length)return;
    const reach=this.range*.75;
    const holdingBasin=colliders.find(c=>c.type==='funnel'&&c.holdsFeedstock);
    const holdingFloor=holdingBasin?groundAt(holdingBasin.x,holdingBasin.z,colliders).height:0;
    for(const p of this.particles){
      if(!p.feedstock)continue;
      if(holdingBasin&&p.shedAt!==undefined&&
        Math.hypot(p.x-holdingBasin.x,p.z-holdingBasin.z)<holdingBasin.bottomRadius+.04&&
        p.y<holdingFloor+this.radius+.23)continue;
      // Give a release time to peel away. A failed release touching the body
      // can rejoin after the grace period; holding Shed pauses all absorption.
      if(p.shedLocked){
        const separated=!this.particles.some(q=>!q.feedstock&&Math.hypot(q.x-p.x,q.y-p.y,q.z-p.z)<this.range);
        if(!separated&&this.time-(p.shedAt??this.time)<1.2)continue;
        p.shedLocked=false;
        if(separated)continue;
      }
      if(owned.some(q=>Math.hypot(q.x-p.x,q.y-p.y,q.z-p.z)<reach&&
        !segmentBlockedBySolid(q,p,colliders,this.radius*.35)))p.feedstock=false;
    }
  }
}
