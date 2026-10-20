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
