import * as T from './assets/three.module.js';

function cylinder(w,p,x,y,z,r,h,color){const m=w.mesh(new T.CylinderGeometry(r,r,h,12),color,p);m.position.set(x,y,z);return m}
function beam(w,p,a,b,r,color){const v=new T.Vector3(...a),d=new T.Vector3(...b).sub(v),m=w.mesh(new T.CylinderGeometry(r,r,d.length(),6),color,p);m.position.copy(v.addScaledVector(d,.5));m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());return m}
export function buildingDetails(w,{x,z,h,i,destroyed,enemy,neutral}){
 const p=w.city,c=w.palette,accent=enemy?c.coral:c.teal;
 if(destroyed){
  for(let k=0;k<3;k++){const rubble=w.box(x+(k-1)*.7,h*.5,z+(k%2?1:-1),.8,h+.3,.9,k%2?c.purple:0xb29d8d,p);rubble.rotation.z=(k-1)*.22}
  return;
 }
 // Panel joints, inset doors, side glazing and deeper cornices break up the blocks.
 w.box(x,.8,z+2.02,.65,1.5,.12,c.dark,p);
 w.box(x,1.62,z+2.16,1.05,.16,.5,accent,p);
 for(let floor=1;floor<h-1;floor+=2){
  w.box(x+1.28,floor+.35,z,.08,.5,2.8,c.dark,p);
  for(const sz of [-.85,0,.85])w.box(x+1.34,floor+.35,z+sz,.05,.52,.065,c.cream,p);
  if(neutral||i%3===0)w.box(x,floor+.85,z+2.05,2.65,.12,.35,accent,p);
 }
 if(i%3===0){
  cylinder(w,p,x,h+.95,z,.65,1.3,c.cream);
  cylinder(w,p,x,h+1.6,z,.7,.12,accent);
 }else if(i%3===1){
  w.box(x,h+.75,z,1.6,.7,2,c.cream,p);
  for(let k=0;k<4;k++)w.box(x,h+1.12,z-.65+k*.43,1.35,.06,.13,c.dark,p);
 }else{
  w.box(x,h+.7,z,1.8,.4,2.5,accent,p);
  w.box(x,h+.93,z,1.5,.06,2.1,0x86b7b0,p);
 }
 if(enemy&&i%7===0){
  cylinder(w,p,x+.7,h+1.6,z-.8,.24,2.6,c.purple);
  cylinder(w,p,x+.7,h+2.8,z-.8,.3,.2,c.dark);
 }
 if(neutral&&i%4===0){
  w.box(x,h+.5,z+1.5,2.8,.15,.65,c.cream,p);
  for(const sx of [-1,1])w.box(x+sx,h+1,z+1.7,.08,1,.08,accent,p);
  w.box(x,h+1.5,z+1.7,2.1,.08,.08,accent,p);
 }
}
function crane(w,p,x,z,color){
 const c=w.palette;
 for(const sx of [-2.4,2.4]){
  w.box(x+sx,3,z,.35,6,1.2,color,p);w.box(x+sx,.1,z,1.1,.35,2,c.dark,p);
 }
 w.box(x,6.2,z,6,.45,1.1,c.cream,p);
 w.box(x+2,6.5,z+2,1,.4,6.5,color,p);
 beam(w,p,[x+2,6.5,z-1],[x+2,7.9,z+1],.07,c.dark);
 beam(w,p,[x+2,7.9,z+1],[x+2,6.5,z+5],.07,c.dark);
 beam(w,p,[x+2,6.5,z+4.5],[x+2,2.7,z+4.5],.045,c.dark);
 w.box(x+2,2.6,z+4.5,.65,.25,.5,c.dark,p);
 w.box(x+.4,5.45,z,1.8,1.1,1.7,color,p);w.box(x+.4,5.55,z+.89,1.4,.6,.06,c.dark,p);
}
function containers(w,p,x,z,count){const c=w.palette;for(let i=0;i<count;i++){
 const cx=x+(i%3)*3.5,cz=z+Math.floor(i/3)*2.4,color=i%2?c.teal:c.coral;
 w.box(cx,.8,cz,3,1.5,1.9,color,p);
 for(let k=0;k<6;k++)w.box(cx-1.2+k*.48,.8,cz+1,.06,1.3,.07,c.cream,p);
 }}
export function destinationDetails(w,enemy,neutral,ds){
 const c=w.palette,p=w.city;
 // Street furniture adds a human scale without hiding the target and damage markers.
 for(const x of [-30,-16,16,30])for(const z of [-10,10]){
  cylinder(w,p,x,1.6,z,.07,3.5,c.dark);w.box(x,3.35,z,.85,.18,.5,c.cream,p);
 }
 if(neutral){
  // Civic terraces and a glazed council rotunda belong to a plateau, not a seaport.
  for(let k=0;k<4;k++)w.box(0,.25+k*.45,25-k*.7,15-k*1.4,.5+k*.9,8-k*.6,c.cream,p);
  w.box(0,3,23,9,2.6,5,c.teal,p);
  for(let x=-3;x<=3;x+=1.5){w.box(x,3.35,25.56,1.1,1.4,.12,c.dark,p);w.box(x,3.35,25.68,.07,1.5,.06,c.cream,p)}
  w.box(0,4.5,23,10,.35,6,c.coral,p);
  const dome=w.mesh(new T.SphereGeometry(3,16,8,0,Math.PI*2,0,Math.PI/2),c.cream,p);dome.position.set(0,4.7,23);
  cylinder(w,p,0,5,23,3.1,.35,c.teal);
  for(const x of [-23,23]){
   w.box(x,.1,24,8,.4,6,c.purple,p);w.box(x,1.1,24,6,1.8,4,c.cream,p);
   for(const sx of [-2.6,2.6])w.box(x+sx,2.2,24,.12,3.5,.12,c.dark,p);
   const canopy=w.box(x,4,24,6.6,.15,5,c.teal,p);canopy.rotation.z=x<0?.08:-.08;
  }
  containers(w,p,-25,20,3);return;
 }
 if(!enemy){
  w.box(0,-.05,24,68,.7,10,c.purple,p);
  for(const x of [-24,-8,10,26]){crane(w,p,x,23,c.coral);cylinder(w,p,x,0,29,.3,.7,c.dark)}
  containers(w,p,-27,18,9);containers(w,p,14,18,6);
  // Small freight lighter beside the quay.
  w.box(7,0,35,12,.9,4.5,c.dark,p);w.box(7,.55,35,11,.25,4,c.cream,p);
  w.box(11,1.7,35,2.6,2.2,3.3,c.teal,p);w.box(11,2,36.7,2,.8,.08,c.dark,p);
  containers(w,p,3,34.7,2);
  return;
 }
 // District landmarks follow the same permanent integrity state as the skyline.
 for(const [district,x] of [['shipyards',-22],['command',0],['harbor',22]]){
  const hp=ds[district],z=district==='command'?-23:23;
  w.box(x,-.05,z,13,.7,9,c.purple,p);
  if(hp===0){
   for(let i=0;i<7;i++){const r=w.box(x+(i%4-1.5)*2.4,.4+(i%2)*.3,z+(Math.floor(i/4)-.5)*3,1.8,1+i%2,2.2,0x9c8c89,p);r.rotation.z=(i%3-1)*.3}
   continue;
  }
  if(district==='shipyards'){
   crane(w,p,x,23,c.coral);
   w.box(x,1,22,7,1.5,4,c.dark,p);
   for(let k=0;k<5;k++)w.box(x-2.6+k*1.3,1.9,22,.2,1.3,3.6,c.cream,p);
  }else if(district==='command'){
   w.box(x,3,z,10,6,7,c.cream,p);w.box(x,6.3,z,11,.6,8,c.coral,p);
   w.box(x,5,z+3.55,8.5,1.1,.12,c.dark,p);
   for(let k=-4;k<=4;k+=2)w.box(x+k,5,z+3.65,.12,1.2,.08,c.cream,p);
   cylinder(w,p,x,7.5,z,2,2,c.teal);
   const radar=w.mesh(new T.SphereGeometry(2.4,12,8,0,Math.PI*2,0,Math.PI/2),c.cream,p);radar.position.set(x,8.5,z);
   beam(w,p,[x+4,6.6,z],[x+4,12,z],.08,c.dark);
  }else{
   for(const sx of [-3,0,3]){cylinder(w,p,x+sx,2.3,z,1.3,4.6,c.cream);for(const y of [1,3.6])cylinder(w,p,x+sx,y,z,1.35,.2,c.coral)}
   beam(w,p,[x-3,.9,z+1.4],[x+3,.9,z+1.4],.15,c.teal);
  }
  if(hp<100){w.box(x-3,.4,z+3,3,.6,2,0x79777a,p);w.box(x+2,.7,z-2,1.3,1.8,1.6,0x9c8c89,p)}
 }
}
