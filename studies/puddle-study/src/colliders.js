import {runtimeSolid,solidInside,solidClosest,solidRay} from './editor-solid-physics.js';

export const GAP = {
  roof: { type:'roof', minX:-0.35, maxX:0.35, minZ:-2.3, maxZ:2.3, bottom:0.32, top:1.35 },
  leftWall: { type:'box', minX:-0.42,maxX:0.42,minY:0,maxY:1.3,minZ:-3.2,maxZ:-2.3 },
  rightWall: { type:'box', minX:-0.42,maxX:0.42,minY:0,maxY:1.3,minZ:2.3,maxZ:3.2 },
};
export const GAP_COLLIDERS=[GAP.roof,GAP.leftWall,GAP.rightWall];
export const TERRACE_BOUNDARY={type:'boundary',minX:-7.45,maxX:7.45,minZ:-4.15,maxZ:4.15};
// A depression in the terrace, with a flat collecting floor and conical sides.
export const FUNNEL={type:'funnel',x:-2.5,z:0,radius:1.5,bottomRadius:.62,depth:.85};
export function groundAt(x,z,colliders=[]){
  let base=0,dxBase=0,dzBase=0;
  const terrain=colliders.find(c=>c.type==='terraces');
  if(terrain){base=terrain.height;for(const step of terrain.steps){
    const t=Math.max(0,Math.min(1,(x-step.x)/step.width));base-=step.drop*t;
    if(t>0&&t<1)dxBase-=step.drop/step.width;
  }}
  const switchback=colliders.find(c=>c.type==='switchback');
  if(switchback){
    const stairs=switchback.stairs;
    if(z<=switchback.frontZ)base=switchback.upperHeight;
    else if(x>=stairs.minX&&x<=stairs.maxX&&z<stairs.endZ){
      base=switchback.upperHeight;
      for(const step of stairs.steps){
        const t=Math.max(0,Math.min(1,(z-step.z)/step.width));base-=step.drop*t;
        if(t>0&&t<1)dzBase-=step.drop/step.width;
      }
    }
    const tier=switchback.startTier;
    if(tier&&x>=tier.minX&&x<=tier.maxX&&z>=tier.minZ&&z<=tier.maxZ){
      for(const step of tier.steps){
        const t=Math.max(0,Math.min(1,(x-step.x)/step.width));base+=step.rise*t;
        if(t>0&&t<1)dxBase+=step.rise/step.width;
      }
    }
  }
  const depth=colliders.find(c=>c.type==='depth-terraces');
  if(depth){
    const dir=depth.descendZ??-1,u=dir*z;
    base=u<=dir*depth.frontZ?depth.frontHeight:u<=dir*depth.rearZ?depth.middleHeight:0;
    for(const [stairs,top] of [[depth.leftStairs,depth.frontHeight],[depth.rightStairs,depth.middleHeight]]){
      if(x<stairs.minX||x>stairs.maxX||u<dir*stairs.startZ||u>dir*stairs.endZ)continue;
      base=top;dzBase=0;
      for(const step of stairs.steps){
        const t=clamp((u-dir*step.z)/step.width,0,1);base-=step.drop*t;
        if(t>0&&t<1)dzBase-=dir*step.drop/step.width;
      }
      break;
    }
  }
  const gripRamp=depth&&colliders.find(c=>c.type==='grip-ramp'&&x>=c.minX&&x<=c.maxX&&z>=c.minZ&&z<=c.maxZ);
  if(gripRamp){
    if(gripRamp.axis==='x'){
      const slope=(gripRamp.maxHeight-gripRamp.minHeight)/(gripRamp.maxX-gripRamp.minX);
      base=gripRamp.minHeight+slope*(x-gripRamp.minX);dxBase=slope;dzBase=0;
    }else{
      const slope=(gripRamp.southHeight-gripRamp.northHeight)/(gripRamp.maxZ-gripRamp.minZ);
      base=gripRamp.northHeight+slope*(z-gripRamp.minZ);dxBase=0;dzBase=slope;
    }
  }
  for(const stair of colliders){
    if(stair.type!=='editor-stairs'||x<stair.minX||x>stair.maxX||z<stair.minZ||z>stair.maxZ)continue;
    const span=stair.axis==='x'?stair.maxX-stair.minX:stair.maxZ-stair.minZ;
    let progress=stair.axis==='x'?(x-stair.minX)/span:(z-stair.minZ)/span;
    if(stair.reverse)progress=1-progress;
    const height=stair.base+stair.rise*progress;
    if(height>base){base=height;dxBase=stair.axis==='x'?(stair.reverse?-1:1)*stair.rise/span:0;
      dzBase=stair.axis==='z'?(stair.reverse?-1:1)*stair.rise/span:0;}
  }
  for(const c of colliders){
    if(c.type==='pit'&&Math.hypot(x-c.x,z-c.z)<c.radius)
      return {height:base-8,dx:0,dz:0};
    if(c.type!=='funnel'||c.raised)continue;
    const dx=x-c.x,dz=z-c.z,d=Math.hypot(dx,dz);
    if(d>=c.radius)continue;
    if(d<=c.bottomRadius)return {height:base-c.depth,dx:dxBase,dz:dzBase};
    const slope=c.depth/(c.radius-c.bottomRadius);
    return {height:base-c.depth+(d-c.bottomRadius)*slope,dx:dxBase+slope*dx/d,dz:dzBase+slope*dz/d};
  }
  return {height:base,dx:dxBase,dz:dzBase};
}
// Raised authored surfaces support a body only after it has reached their top.
// A body below a box still sees the lower floor, preventing target forces from
// lifting it through stone before physical contact carries it over an edge.
export function contactingCommittedTop(p,r,c,tolerance=.06){
  if(c.type!=='editor-solid-mesh')return null;
  const hit=solidRay(c,{x:p.x,y:p.y+r+.06,z:p.z},{x:0,y:-1,z:0},40);
  return hit&&hit.normal?.y>.35&&Math.abs(p.y-hit.y-r)<=tolerance?hit.y:null;
}
export function supportedGroundAt(p,r,colliders=[]){
  let height=groundAt(p.x,p.z,colliders).height;
  for(const c of colliders){
    if(c.csgControl)continue;
    if(c.type==='editor-solid-mesh'){
      const hit=solidRay(c,{x:p.x,y:p.y+r+.06,z:p.z},{x:0,y:-1,z:0},40);
      if(hit&&hit.normal?.y>.35&&p.y>=hit.y+r-.06)height=Math.max(height,hit.y);
      continue;
    }
    if(!(c.gripPlatform||c.walkableTop)||p.y<c.maxY+r-.06)continue;
    if(p.x<c.minX+r||p.x>c.maxX-r||p.z<c.minZ+r||p.z>c.maxZ-r)continue;
    height=Math.max(height,c.maxY);
  }
  return height;
}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
// Segment/solid visibility for forces that reach farther than particle contacts.
// The boundary contains the scene and does not hide one particle from another.
export function segmentBlockedBySolid(a,b,colliders,clearance=0){
  const interval=(p,d,lo,hi,span)=>{
    if(Math.abs(d)<1e-9)return p>lo&&p<hi?span:null;
    const t0=(lo-p)/d,t1=(hi-p)/d;
    const next=[Math.max(span[0],Math.min(t0,t1)),Math.min(span[1],Math.max(t0,t1))];
    return next[0]<next[1]?next:null;
  };
  const dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z;
  for(const c of colliders){
    if(c.type==='boundary')continue;
    if(c.type==='editor-solid-mesh'){
      const bounds=runtimeSolid(c)?.bounds;
      if(!bounds||Math.max(a.x,b.x)<bounds.min.x-clearance||Math.min(a.x,b.x)>bounds.max.x+clearance||
        Math.max(a.y,b.y)<bounds.min.y-clearance||Math.min(a.y,b.y)>bounds.max.y+clearance||
        Math.max(a.z,b.z)<bounds.min.z-clearance||Math.min(a.z,b.z)>bounds.max.z+clearance)continue;
      const length=Math.hypot(dx,dy,dz);
      const hit=length>1e-8?solidRay(c,a,{x:dx,y:dy,z:dz},length+clearance):null;
      if(hit&&hit.distance>1e-4||solidInside(c,a.x,a.y,a.z)||solidInside(c,b.x,b.y,b.z))return true;
      continue;
    }
    if(c.type==='terraces'||c.type==='switchback'||c.type==='depth-terraces'||c.type==='grip-ramp'||c.type==='editor-stairs'){
      const steps=Math.max(2,Math.ceil(Math.hypot(dx,dy,dz)/.08));
      for(let i=0;i<=steps;i++){const t=i/steps;if(a.y+dy*t<groundAt(a.x+dx*t,a.z+dz*t,colliders).height+clearance)return true;}
      continue;
    }
    if(c.type==='funnel'){
      if(c.raised)continue;
      // Only below-floor segments can intersect the basin wall.
      const rim=groundAt(c.x+c.radius,c.z,colliders).height;
      if(Math.min(a.y,b.y)>=rim+clearance)continue;
      const steps=Math.max(2,Math.ceil(Math.hypot(dx,dy,dz)/.06));
      for(let i=0;i<=steps;i++){
        const t=i/steps,x=a.x+dx*t,z=a.z+dz*t;
        // Multiple funnels share one playable floor. Testing this funnel in
        // isolation would treat the interior of another basin as solid.
        if(a.y+dy*t<groundAt(x,z,colliders).height+clearance)return true;
      }
      continue;
    }
    if(c.type==='box'||c.type==='roof'){
      let span=[0,1];
      span=interval(a.x,dx,c.minX-clearance,c.maxX+clearance,span);
      if(!span)continue;
      span=interval(a.y,dy,(c.type==='roof'?c.bottom:c.minY)-clearance,
        (c.type==='roof'?c.top:c.maxY)+clearance,span);
      if(!span)continue;
      span=interval(a.z,dz,c.minZ-clearance,c.maxZ+clearance,span);
      if(span)return true;
    }else if(c.type==='cylinder'){
      const x=a.x-c.x,z=a.z-c.z,rad=c.radius+clearance;
      const A=dx*dx+dz*dz,B=2*(x*dx+z*dz),C=x*x+z*z-rad*rad;
      let span;
      if(A<1e-9){if(C>=0)continue;span=[0,1];}
      else{
        const disc=B*B-4*A*C;if(disc<=0)continue;
        const root=Math.sqrt(disc),t0=(-B-root)/(2*A),t1=(-B+root)/(2*A);
        span=[Math.max(0,t0),Math.min(1,t1)];if(span[0]>=span[1])continue;
      }
      if(interval(a.y,dy,(c.base??0)-clearance,c.height+clearance,span))return true;
    }else if(c.type==='slip'){
      continue;
    }
  }
  return false;
}

export function resolveParticle(p,r,colliders){
  let hits=0;
  // Discontinuous terrace faces must stop a particle from the low side before
  // floor projection can lift it onto the upper board. Crossing from above is
  // allowed, so the exposed edge remains a real shortcut down.
  const switchback=colliders.find(c=>c.type==='switchback');
  if(switchback){
    const s=switchback.stairs,front=switchback.frontZ,upper=switchback.upperHeight;
    const tier=switchback.startTier;
    if(tier&&p.x>=tier.minX&&p.x<=tier.maxX){
      const top=groundAt(p.x,(tier.minZ+tier.maxZ)/2,[switchback]).height;
      if(p.pz>tier.maxZ-r&&p.z<tier.maxZ+r&&p.y+r<top-.02){p.z=tier.maxZ+r;hits++;}
      if(p.pz<tier.minZ+r&&p.z>tier.minZ-r&&p.y+r<top-.02){p.z=tier.minZ-r;hits++;}
    }
    // The opening uses the actual corridor bounds. Expanding it by the
    // particle radius leaves a low-side route through each front corner.
    const outsideStairs=p.x<s.minX||p.x>s.maxX;
    if(outsideStairs&&p.pz>=front-r&&p.z<front+r&&p.y+r<upper-.02){p.z=front+r;hits++;}
    if(p.z>front-r&&p.z<s.endZ+r){
      const stairHeight=groundAt((s.minX+s.maxX)/2,p.z,[switchback]).height;
      if(p.px>=s.maxX-r&&p.x<s.maxX+r&&p.y+r<stairHeight-.02){p.x=s.maxX+r;hits++;}
      if(p.px<=s.minX+r&&p.x>s.minX-r&&p.y+r<stairHeight-.02){p.x=s.minX-r;hits++;}
    }
  }
  const depth=colliders.find(c=>c.type==='depth-terraces');
  if(depth){
    const dir=depth.descendZ??-1,oldU=dir*p.pz;
    for(const [stairs,split,top] of [[depth.leftStairs,depth.frontZ,depth.frontHeight],
      [depth.rightStairs,depth.rearZ,depth.middleHeight]]){
      const outside=p.x<stairs.minX||p.x>stairs.maxX;
      const splitU=dir*split,u=dir*p.z;
      if(outside&&oldU>=splitU&&u<splitU+r&&p.y+r<top-.02){p.z=dir*(splitU+r);hits++;}
      if(dir*p.z>dir*stairs.startZ-r&&dir*p.z<dir*stairs.endZ+r){
        const stairHeight=groundAt((stairs.minX+stairs.maxX)/2,p.z,[depth]).height;
        if(p.px>=stairs.maxX-r&&p.x<stairs.maxX+r&&p.y+r<stairHeight-.02){p.x=stairs.maxX+r;hits++;}
        if(p.px<=stairs.minX+r&&p.x>stairs.minX-r&&p.y+r<stairHeight-.02){p.x=stairs.minX-r;hits++;}
      }
    }
  }
  for(const stair of colliders){
    if(stair.type!=='editor-stairs')continue;
    const xInside=p.x>stair.minX-r&&p.x<stair.maxX+r,zInside=p.z>stair.minZ-r&&p.z<stair.maxZ+r;
    if(!xInside||!zInside)continue;
    const slopeHeight=groundAt(Math.max(stair.minX,Math.min(stair.maxX,p.x)),
      Math.max(stair.minZ,Math.min(stair.maxZ,p.z)),[stair]).height;
    if(p.y+r>=slopeHeight-.02)continue;
    if(stair.axis==='x'){
      if(p.pz<stair.minZ-r&&p.z>stair.minZ-r){p.z=stair.minZ-r;hits++;}
      if(p.pz>stair.maxZ+r&&p.z<stair.maxZ+r){p.z=stair.maxZ+r;hits++;}
      const high=stair.reverse?stair.minX:stair.maxX;
      if(stair.reverse&&p.px<high-r&&p.x>high-r){p.x=high-r;hits++;}
      if(!stair.reverse&&p.px>high+r&&p.x<high+r){p.x=high+r;hits++;}
    }else{
      if(p.px<stair.minX-r&&p.x>stair.minX-r){p.x=stair.minX-r;hits++;}
      if(p.px>stair.maxX+r&&p.x<stair.maxX+r){p.x=stair.maxX+r;hits++;}
      const high=stair.reverse?stair.minZ:stair.maxZ;
      if(stair.reverse&&p.pz<high-r&&p.z>high-r){p.z=high-r;hits++;}
      if(!stair.reverse&&p.pz>high+r&&p.z<high+r){p.z=high+r;hits++;}
    }
  }
  for(let pass=0;pass<3;pass++){
    const g=groundAt(p.x,p.z,colliders),norm2=1+g.dx*g.dx+g.dz*g.dz;
    const penetration=g.height+r*Math.sqrt(norm2)+.008-p.y;
    if(penetration<=0)break;
    const correction=penetration/norm2;
    p.x-=g.dx*correction;p.z-=g.dz*correction;p.y+=correction;
    if(norm2===1&&p.vy<0)p.vy=0;
    hits++;
  }
  for(const c of colliders){
    if(c.type==='pit'){
      const dx=p.x-c.x,dz=p.z-c.z,d=Math.hypot(dx,dz),rim=c.rimHeight??
        groundAt(c.x+c.radius+.01,c.z,colliders).height;
      if(p.y<rim-r*.5&&d>c.radius-r&&d<c.radius+r){
        const limit=c.radius-r-.003;p.x=c.x+dx/d*limit;p.z=c.z+dz/d*limit;hits++;
      }
      continue;
    }
    if(c.type==='boundary'){
      const x=clamp(p.x,c.minX+r,c.maxX-r),z=clamp(p.z,c.minZ+r,c.maxZ-r);
      if(x!==p.x||z!==p.z){p.x=x;p.z=z;hits++;}
      continue;
    }
    if(c.type==='editor-solid-mesh'){
      const bounds=runtimeSolid(c)?.bounds;
      if(!bounds||Math.max(p.x,p.px)<bounds.min.x-r||Math.min(p.x,p.px)>bounds.max.x+r||
        Math.max(p.y,p.py)<bounds.min.y-r||Math.min(p.y,p.py)>bounds.max.y+r||
        Math.max(p.z,p.pz)<bounds.min.z-r||Math.min(p.z,p.pz)>bounds.max.z+r)continue;
      const dx=p.x-p.px,dy=p.y-p.py,dz=p.z-p.pz,length=Math.hypot(dx,dy,dz),
        swept=length>1e-6&&!solidInside(c,p.px,p.py,p.pz)?
          solidRay(c,{x:p.px,y:p.py,z:p.pz},{x:dx,y:dy,z:dz},length):null;
      if(swept&&swept.distance>1e-4){const n=swept.normal;
        p.x=swept.x+(n?.x??0)*(r+.003);p.y=swept.y+(n?.y??1)*(r+.003);
        p.z=swept.z+(n?.z??0)*(r+.003);if(n?.y>.35&&p.vy<0)p.vy=0;hits++;}
      // A center ray can fit through a hole narrower than the particle. Sweep
      // the sphere along the accepted substep so a fast particle cannot pass
      // through an oblique thin wall or an undersized tunnel.
      else if(!swept&&length>r*.5){
        const steps=Math.min(200,Math.ceil(length/(r*.45)));
        for(let i=1;i<=steps;i++){
          const t=i/steps,x=p.px+dx*t,y=p.py+dy*t,z=p.pz+dz*t;
          const near=solidClosest(c,x,y,z,r+.003);
          if(!near||near.distance>=r||solidInside(c,x,y,z))continue;
          const safe=(i-1)/steps;
          p.x=p.px+dx*safe;p.y=p.py+dy*safe;p.z=p.pz+dz*safe;
          hits++;break;
        }
      }
      let nearest=solidClosest(c,p.x,p.y,p.z,r+.01);
      const inside=solidInside(c,p.x,p.y,p.z);
      if(inside&&!nearest)nearest=solidClosest(c,p.x,p.y,p.z);
      if(nearest&&(inside||nearest.distance<r)){
        let nx=p.x-nearest.x,ny=p.y-nearest.y,nz=p.z-nearest.z;
        if(inside){nx=-nx;ny=-ny;nz=-nz;}
        const d=Math.hypot(nx,ny,nz)||1;nx/=d;ny/=d;nz/=d;
        p.x=nearest.x+nx*(r+.003);p.y=nearest.y+ny*(r+.003);p.z=nearest.z+nz*(r+.003);
        if(ny>.35&&p.vy<0)p.vy=0;hits++;
      }
      continue;
    }
    if(c.type==='cylinder'){
      const dx=p.x-c.x,dz=p.z-c.z,d=Math.hypot(dx,dz),rad=c.radius+r;
      if(d>=rad||p.y-r>=c.height||p.y+r<=(c.base??0))continue;
      if(p.py-r>=c.height-.035){p.y=c.height+r+.003;if(p.vy<0)p.vy=0;}
      else{p.x=c.x+(d?dx/d*rad:rad);p.z=c.z+(d?dz/d*rad:0);}
      hits++;continue;
    }
    if(c.type!=='roof'&&c.type!=='box')continue;
    const loX=c.minX-r,hiX=c.maxX+r,loY=(c.type==='roof'?c.bottom:c.minY)-r,
      hiY=(c.type==='roof'?c.top:c.maxY)+r,loZ=c.minZ-r,hiZ=c.maxZ+r;
    if(p.x<=loX||p.x>=hiX||p.y<=loY||p.y>=hiY||p.z<=loZ||p.z>=hiZ)continue;
    const choices=[['x',loX,p.x-loX],['x',hiX,hiX-p.x],['y',loY,p.y-loY],['y',hiY,hiY-p.y],
      ['z',loZ,p.z-loZ],['z',hiZ,hiZ-p.z]];
    // Prefer the face from which this particle entered. This keeps a high
    // particle at the roof entrance from being pulled underneath by a corner.
    let entry=null;
    if(p.px<=loX+.02)entry=choices[0];else if(p.px>=hiX-.02)entry=choices[1];
    else if(p.py<=loY+.02)entry=choices[2];else if(p.py>=hiY-.02)entry=choices[3];
    else if(p.pz<=loZ+.02)entry=choices[4];else if(p.pz>=hiZ-.02)entry=choices[5];
    const face=entry||choices.reduce((a,b)=>a[2]<b[2]?a:b);
    p[face[0]]=face[1];
    if(face[0]==='y'&&p.vy<0&&face[1]===hiY)p.vy=0;
    hits++;
  }
  return hits;
}

export function resolveMaterialPoint(n,colliders) {
  let contacts=0;
  if(n.y<0.035){n.y=0.035;if(n.vy<0)n.vy=0;contacts++;}
  for(const c of colliders){
    if(c.type==='editor-solid-mesh'){
      if(solidInside(c,n.x,n.y,n.z)){
        const hit=solidClosest(c,n.x,n.y,n.z);
        if(hit){n.x=hit.x;n.y=hit.y;n.z=hit.z;contacts++;}
      }
      continue;
    }
    if(c.type==='roof'){
      if(n.x>c.minX&&n.x<c.maxX&&n.z>c.minZ&&n.z<c.maxZ){
        if(n.y>c.bottom-.012&&n.y<c.top){
          if(n.py>c.top+.02)n.y=c.top+.035;
          else n.y=c.bottom-.012;
          n.vy=Math.min(0,n.vy);contacts++;
        }
      }
    }else if(c.type==='cylinder'){
      const dx=n.x-c.x,dz=n.z-c.z,d=Math.hypot(dx,dz);
      if(d<c.radius&&n.y>=(c.base??0)){
        if(n.y>=c.height-.01&&n.py>=c.height-.08){n.y=Math.max(n.y,c.height+.035);contacts++;}
        else if(n.y<c.height+.035){
          const s=c.radius/(d||1);n.x=c.x+(d?dx*s:0);n.z=c.z+(d?dz*s:c.radius);contacts++;
        }
      }
    }else if(c.type==='box'){
      if(n.x>c.minX&&n.x<c.maxX&&n.y>c.minY&&n.y<c.maxY&&n.z>c.minZ&&n.z<c.maxZ){
        const faces=[['x',c.minX,n.x-c.minX],['x',c.maxX,c.maxX-n.x],['z',c.minZ,n.z-c.minZ],['z',c.maxZ,c.maxZ-n.z],['y',c.maxY,c.maxY-n.y]];
        faces.sort((a,b)=>a[2]-b[2]);n[faces[0][0]]=faces[0][1];contacts++;
      }
    }else if(c.type==='boundary'){
      const x=clamp(n.x,c.minX,c.maxX),z=clamp(n.z,c.minZ,c.maxZ);
      if(x!==n.x||z!==n.z){n.x=x;n.z=z;contacts++;}
    }
  }
  return contacts;
}

export function resolveSurfaceEdges(nodes,edges,colliders){
  // Midpoints prevent a wide surface triangle edge from passing through a thin wall.
  for(const [ia,ib] of edges){
    const a=nodes[ia],b=nodes[ib];
    const mid={x:(a.x+b.x)/2,y:(a.y+b.y)/2,z:(a.z+b.z)/2,
      px:(a.px+b.px)/2,py:(a.py+b.py)/2,pz:(a.pz+b.pz)/2,vx:0,vy:0,vz:0};
    if(resolveMaterialPoint(mid,colliders)){
      const dx=mid.x-(a.x+b.x)/2,dy=mid.y-(a.y+b.y)/2,dz=mid.z-(a.z+b.z)/2;
      a.x+=dx;a.y+=dy;a.z+=dz;b.x+=dx;b.y+=dy;b.z+=dz;
    }
  }
}

export function pointInsideSolid(x,y,z,colliders,epsilon=0){
  for(const c of colliders){
    if(c.type==='editor-solid-mesh'&&solidInside(c,x,y,z)&&
      (!epsilon||solidClosest(c,x,y,z)?.distance>epsilon))return true;
    if(c.type==='roof' && x>c.minX+epsilon&&x<c.maxX-epsilon&&z>c.minZ+epsilon&&z<c.maxZ-epsilon&&y>c.bottom+epsilon&&y<c.top-epsilon)return true;
    if(c.type==='cylinder' && y>(c.base??0)+epsilon&&y<c.height-epsilon&&Math.hypot(x-c.x,z-c.z)<c.radius-epsilon)return true;
    if(c.type==='box' && x>c.minX+epsilon&&x<c.maxX-epsilon&&z>c.minZ+epsilon&&z<c.maxZ-epsilon&&y>c.minY+epsilon&&y<c.maxY-epsilon)return true;
  }
  return false;
}
