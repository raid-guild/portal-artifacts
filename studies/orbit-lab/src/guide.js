import * as CANNON from 'cannon-es';
// Counter-clockwise convex silhouette: a smooth arch above a solid flat base.
export function guideProfile(){const points=[{x:-4,y:-5},{x:4,y:-5}];for(let i=40;i>=0;i--){const t=i/40;points.push({x:-4+8*t,y:-3+2*Math.sin(Math.PI*t)});}return points;}
export function guideShape(points){
 const n=points.length,vertices=[...points.map(p=>new CANNON.Vec3(p.x,p.y,-1)),...points.map(p=>new CANNON.Vec3(p.x,p.y,3))];
 const faces=[Array.from({length:n},(_,i)=>n-1-i),Array.from({length:n},(_,i)=>n+i)];
 for(let i=0;i<n;i++){const j=(i+1)%n;faces.push([i,j,n+j,n+i]);}
 return new CANNON.ConvexPolyhedron({vertices,faces});
}
export function profileContains(p,points,radius=0){
 for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length],dx=b.x-a.x,dy=b.y-a.y;if(dx*(p.y-a.y)-dy*(p.x-a.x)<-radius*Math.hypot(dx,dy))return false;}return true;
}
export function profileImpact(from,to,points,radius=0){
 let enter=0,exit=1;
 for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length],dx=b.x-a.x,dy=b.y-a.y,start=dx*(from.y-a.y)-dy*(from.x-a.x)+radius*Math.hypot(dx,dy),delta=dx*(to.y-from.y)-dy*(to.x-from.x);if(Math.abs(delta)<1e-10){if(start<0)return null;}else{const t=-start/delta;if(delta>0)enter=Math.max(enter,t);else exit=Math.min(exit,t);if(enter>exit)return null;}}return enter;
}

export const CHANNEL = { amplitude:2.8, period:12, halfWidth:2.2 };
export function channelY(x,c=CHANNEL){return c.amplitude*Math.sin(Math.PI*x/c.period);}
export function channelFrame(point,c=CHANNEL){
 let x=Math.max(-16,Math.min(16,point.x));
 for(let i=0;i<10;i++){
  const k=Math.PI/c.period,y=channelY(x,c),s=c.amplitude*k*Math.cos(k*x),second=-c.amplitude*k*k*Math.sin(k*x);
  x=Math.max(-16,Math.min(16,x-((x-point.x)+(y-point.y)*s)/Math.max(.25,1+s*s+(y-point.y)*second)));
 }
 const y=channelY(x,c),s=c.amplitude*Math.PI/c.period*Math.cos(Math.PI*x/c.period),length=Math.hypot(1,s),nx=-s/length,ny=1/length;
 return {x,y,nx,ny,tx:1/length,ty:s/length,distance:(point.x-x)*nx+(point.y-y)*ny};
}
export function constrainChannel(position,velocity,c=CHANNEL,radius=.31){
 const f=channelFrame(position,c),limit=c.halfWidth-radius;
 if(Math.abs(f.distance)<=limit)return false;
 const side=Math.sign(f.distance);position.x=f.x+f.nx*side*limit;position.y=f.y+f.ny*side*limit;
 const outward=(velocity.x*f.nx+velocity.y*f.ny)*side;
 if(outward>0){velocity.x-=f.nx*side*outward;velocity.y-=f.ny*side*outward;}
 return true;
}
export function channelWalls(c=CHANNEL){
 const upper=[],lower=[];
 for(let i=0;i<=160;i++){const x=-17+i*34/160,y=channelY(x,c),s=c.amplitude*Math.PI/c.period*Math.cos(Math.PI*x/c.period),l=Math.hypot(1,s);upper.push({x:x-s/l*c.halfWidth,y:y+c.halfWidth/l});lower.push({x:x+s/l*c.halfWidth,y:y-c.halfWidth/l});}
 return [[...upper,{x:18,y:10},{x:-18,y:10}],[{x:-18,y:-10},{x:18,y:-10},...lower.reverse()]];
}
