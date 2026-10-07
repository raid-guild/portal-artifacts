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
  for(const c of colliders){
    if(c.type!=='funnel')continue;
    const dx=x-c.x,dz=z-c.z,d=Math.hypot(dx,dz);
    if(d>=c.radius)continue;
    if(d<=c.bottomRadius)return {height:-c.depth,dx:0,dz:0};
    const slope=c.depth/(c.radius-c.bottomRadius);
    return {height:-c.depth+(d-c.bottomRadius)*slope,dx:slope*dx/d,dz:slope*dz/d};
  }
  return {height:0,dx:0,dz:0};
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
    if(c.type==='funnel'){
      // Only below-floor segments can intersect the basin wall.
      if(Math.min(a.y,b.y)>=clearance)continue;
      const steps=Math.max(2,Math.ceil(Math.hypot(dx,dy,dz)/.06));
      for(let i=0;i<=steps;i++){
        const t=i/steps,x=a.x+dx*t,z=a.z+dz*t;
        if(a.y+dy*t<groundAt(x,z,[c]).height+clearance)return true;
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
      if(interval(a.y,dy,-clearance,c.height+clearance,span))return true;
    }
  }
  return false;
}

export function resolveParticle(p,r,colliders){
  let hits=0;
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
    if(c.type==='boundary'){
      const x=clamp(p.x,c.minX+r,c.maxX-r),z=clamp(p.z,c.minZ+r,c.maxZ-r);
      if(x!==p.x||z!==p.z){p.x=x;p.z=z;hits++;}
      continue;
    }
    if(c.type==='cylinder'){
      const dx=p.x-c.x,dz=p.z-c.z,d=Math.hypot(dx,dz),rad=c.radius+r;
      if(d>=rad||p.y-r>=c.height||p.y+r<=0)continue;
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
      if(d<c.radius){
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
    if(c.type==='roof' && x>c.minX+epsilon&&x<c.maxX-epsilon&&z>c.minZ+epsilon&&z<c.maxZ-epsilon&&y>c.bottom+epsilon&&y<c.top-epsilon)return true;
    if(c.type==='cylinder' && y<c.height-epsilon&&Math.hypot(x-c.x,z-c.z)<c.radius-epsilon)return true;
    if(c.type==='box' && x>c.minX+epsilon&&x<c.maxX-epsilon&&z>c.minZ+epsilon&&z<c.maxZ-epsilon&&y>c.minY+epsilon&&y<c.maxY-epsilon)return true;
  }
  return false;
}
