import * as T from './assets/three.module.js';

// Low-poly, solid-color hardware: broad silhouettes first, readable ink seams second.
function strut(w,parent,a,b,r,color){
 const from=new T.Vector3(...a),to=new T.Vector3(...b),delta=to.clone().sub(from);
 const m=w.mesh(new T.CylinderGeometry(r,r,delta.length(),6),color,parent);
 m.position.copy(from.add(to).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());return m;
}
function drum(w,parent,x,y,z,r,h,color,axis='y'){
 const m=w.mesh(new T.CylinderGeometry(r,r,h,12),color,parent);m.position.set(x,y,z);
 if(axis==='x')m.rotation.z=Math.PI/2;if(axis==='z')m.rotation.x=Math.PI/2;return m;
}
export function solarArray(w,parent,x,z){
 const c=w.palette,g=new T.Group();parent.add(g);g.position.set(x,0,z);
 for(const sx of [-2,2]){
  w.box(sx,.05,0,1.1,.18,2.2,c.purple,g);
  strut(w,g,[sx,.15,-.8],[sx,2.6,0],.12,c.cream);
  strut(w,g,[sx,.15,.8],[sx,2.6,0],.12,c.cream);
 }
 drum(w,g,0,2.65,0,.2,4.5,c.coral,'x');
 const face=new T.Group();face.position.y=2.8;face.rotation.x=.32;g.add(face);
 w.box(0,0,0,6.2,.2,5.2,c.cream,face);
 // Four replaceable modules, each with cell seams. All seams share the tilt.
 for(const sx of [-1.5,1.5])for(const sz of [-1.25,1.25]){
  w.box(sx,.13,sz,2.82,.09,2.3,c.teal,face);
  for(let i=-1;i<=1;i++)w.box(sx+i*.7,.183,sz,.025,.012,2.25,0x84b7ab,face);
  for(const k of [-.56,0,.56])w.box(sx,.184,sz+k,2.78,.012,.025,0x84b7ab,face);
 }
 w.box(0,.2,0,.1,.12,5.2,c.cream,face);w.box(0,.2,0,6.2,.12,.1,c.cream,face);
 w.box(0,1.1,.45,.7,.8,.4,c.coral,g);
 strut(w,g,[0,1.1,.7],[0,.15,1.2],.045,c.dark);
}
export function stationDetails(w){
 const c=w.palette,p=w.station;
 // Raised pressure door, landing and an exterior stair on the near facade.
 w.box(-12,1.8,15.65,3.15,3.1,.5,c.teal);
 w.box(-12,1.9,15.96,2.55,2.6,.2,c.dark);
 w.box(-12,1.9,16.1,2.12,2.28,.16,c.cream);
 w.box(-12,1.9,16.2,.07,2.22,.035,c.purple);
 w.box(-12,2.43,16.22,1.4,.55,.05,c.teal);
 w.box(-10.1,2.25,15.64,.5,.7,.18,c.dark);
 w.box(-10.1,2.35,15.75,.25,.18,.05,c.coral);
 w.box(-12,3.55,16.15,3.75,.22,1.55,c.cream);
 w.box(-12,.75,17.1,4,.3,2.5,c.purple);
 for(let i=0;i<3;i++)w.box(-12,.15+i*.2,19-i*.55,3,.3+i*.4,.58,c.cream);
 for(const x of [-13.8,-10.2]){
  for(const z of [16.4,18.1])strut(w,p,[x,.8,z],[x,2,z],.055,c.dark);
  strut(w,p,[x,2,16.4],[x,2,18.1],.065,c.cream);
 }
 // Habitation glazing and raised service cladding on the rail-facing wall.
 for(const z of [6.7,9,11.3,13.6]){
  w.box(-8.43,2.55,z,.16,1.25,1.8,c.teal);
  w.box(-8.32,2.6,z,.08,.85,1.45,c.dark);
  w.box(-8.26,2.6,z,.04,.85,.06,c.cream);
  w.box(-8.39,.9,z,.14,.7,1.85,c.purple);
 }
 for(const x of [-16.4,-14.1]){
  w.box(x,2.6,15.57,1.65,1.2,.15,c.teal);
  w.box(x,2.63,15.68,1.3,.83,.08,c.dark);
  w.box(x,2.63,15.74,.07,.85,.04,c.cream);
 }
 // Control cabin gets wraparound glazing and a light roof overhang.
 w.box(-11,6.25,11.54,2.65,1.25,.12,c.dark);
 w.box(-9.46,6.25,10,.12,1.25,2.65,c.dark);
 for(const x of [-11.9,-11,-10.1])w.box(x,6.25,11.64,.09,1.3,.07,c.cream);
 for(const z of [9.1,10,10.9])w.box(-9.36,6.25,z,.07,1.3,.09,c.cream);
 w.box(-11,5.45,11.6,3.15,.18,.22,c.coral);
 // Rooftop heat exchanger, ribbed vents, access hatch and communications dish.
 w.box(-15.1,4.65,7.4,2.4,.6,2.4,c.cream);
 for(let i=0;i<6;i++)w.box(-15.1,4.98,6.5+i*.35,2,.07,.14,c.dark);
 w.box(-14.8,4.6,12.8,2.6,.25,2.3,c.teal);
 for(const x of [-16.8,-15.9]){
  strut(w,p,[x,.2,4.35],[x,3.6,4.35],.18,c.coral);
  strut(w,p,[x,3.6,4.35],[x,3.6,5.5],.18,c.coral);
 }
 strut(w,p,[-15,4.5,10],[-15,6.5,10],.1,c.dark);
 const dish=w.mesh(new T.ConeGeometry(1.25,.55,12,1,true),c.cream);dish.position.set(-15,6.7,10);dish.rotation.z=-.65;
 strut(w,p,[-15,6.7,10],[-15.8,7.6,10],.065,c.coral);
 // Rail control equipment: louvers, warning stripes, doors and roof cooling fins.
 w.box(0,2.1,22.56,2,2.2,.16,c.cream);
 w.box(0,2.2,22.67,1.4,1.6,.1,c.dark);
 for(const x of [-2.5,2.5]){
  w.box(x,2.2,22.6,1.1,1.4,.16,c.purple);
  for(let i=0;i<4;i++)w.box(x,1.8+i*.25,22.71,.9,.08,.05,c.dark);
 }
 for(let i=0;i<6;i++)w.box(-1.8+i*.7,4.18,19,.18,.3,3,c.teal);
 for(const x of [-2.5,2.5])w.box(x,.9,22.65,.8,.3,.1,c.coral);
 // Supply tanks have bands, valve wheels and a shared utility manifold.
 for(let i=0;i<3;i++){
  const x=-11+i*3.4;
  for(const y of [.6,2.65])drum(w,p,x,y,-4,1.34,.16,c.teal);
  drum(w,p,x,3.65,-4,.3,.35,c.dark);
  strut(w,p,[x,.65,-2.8],[x,.65,-1.8],.12,c.coral);
  const valve=w.mesh(new T.TorusGeometry(.27,.06,5,10),c.coral);valve.position.set(x,1.3,-2.68);
 }
 strut(w,p,[-11,.65,-1.8],[-4.2,.65,-1.8],.13,c.cream);
 // Cargo straps read clearly without textures or tiny surface noise.
 for(let i=0;i<7;i++){
  const x=-20+(i%3)*2,z=17+Math.floor(i/3)*2;
  w.box(x,1.38,z,.18,.05,1.54,c.cream);w.box(x,.7,z+.77,.18,1.3,.05,c.cream);
 }
}
export function buildRover(w){
 const c=w.palette,g=new T.Group();w.station.add(g);
 w.box(0,1,0,3.15,.5,5.7,c.dark,g);
 w.box(0,1.42,0,3.3,.45,5.7,c.coral,g);
 // Chamfered pressure cabin, with broad glazed facets and visible mullions.
 const shape=new T.Shape();shape.moveTo(-1.5,0);shape.lineTo(1.5,0);shape.lineTo(1.5,1.1);shape.lineTo(1.15,1.8);shape.lineTo(-1.15,1.8);shape.lineTo(-1.5,1.1);shape.closePath();
 const cab=w.mesh(new T.ExtrudeGeometry(shape,{depth:2.4,bevelEnabled:false}),c.cream,g);cab.position.set(0,1.5,.15);
 w.box(0,2.48,2.59,2.72,.87,.1,c.dark,g);
 w.box(0,2.48,2.66,.1,.9,.05,c.cream,g);
 for(const x of [-1.54,1.54]){
  w.box(x,2.4,1.35,.08,.8,1.8,c.teal,g);
  w.box(x,2.4,1.4,.12,.82,.08,c.cream,g);
  w.box(x,1.81,1.15,.12,.08,.5,c.dark,g);
  strut(w,g,[x,1.4,.3],[x,1.4,2.5],.1,c.cream);
 }
 w.box(0,3.36,1.3,2.4,.16,2.4,c.coral,g);
 w.box(0,1.6,-1.5,2.8,.25,2.6,c.cream,g);
 for(const x of [-1.5,1.5])w.box(x,1.95,-1.45,.18,.6,2.8,c.coral,g);
 w.box(0,1.95,-2.8,3,.6,.18,c.coral,g);
 for(const x of [-.7,.7]){w.box(x,2,-1.35,1.1,.65,1.5,c.teal,g);w.box(x,2.35,-1.35,.14,.06,1.52,c.cream,g)}
 for(const x of [-1.8,1.8])for(const z of [-2,0,2]){
  drum(w,g,x,.8,z,.78,.55,c.dark,'x');drum(w,g,x+Math.sign(x)*.29,.8,z,.43,.08,c.purple,'x');drum(w,g,x+Math.sign(x)*.35,.8,z,.2,.1,c.cream,'x');
  w.box(x,1.68,z,.78,.18,1.25,c.cream,g);
 }
 for(const x of [-1.1,1.1]){w.box(x,1.67,2.92,.5,.35,.18,c.cream,g);w.box(x,1.57,-2.96,.35,.22,.12,c.coral,g)}
 w.box(0,1.02,3.05,3.45,.25,.3,c.purple,g);
 strut(w,g,[-.9,3.4,.5],[-.9,4.3,.5],.04,c.dark);
 drum(w,g,.75,3.55,.6,.18,.3,c.coral);
 w.batch(g);g.position.set(9,0,13);return g;
}

export function expansionDetails(w,parent,levels){
 const c=w.palette;
 for(let i=0;i<levels.production;i++){
  const x=-21-i*7;
  w.box(x,1.6,-10.42,2.65,2.9,.18,c.teal,parent);
  w.box(x,1.6,-10.29,2.15,2.5,.12,c.dark,parent);
  for(let k=0;k<6;k++)w.box(x,.6+k*.38,-10.2,2.05,.07,.06,c.cream,parent);
  for(const z of [-15.5,-12.5]){w.box(x+2.56,2.8,z,.15,1.1,1.6,c.dark,parent);w.box(x+2.65,2.8,z,.08,1.12,.08,c.cream,parent)}
  w.box(x,4.8,-14,3,.4,3,c.cream,parent);
  for(let k=0;k<5;k++)w.box(x,5.03,-15+k*.5,2.6,.08,.15,c.dark,parent);
 }
 for(let i=0;i<levels.battery;i++){
  const x=-8+i*4;
  for(const y of [.65,3.3])drum(w,parent,x,y,-10,1.64,.2,c.teal);
  w.box(x,2,-8.37,.8,1.2,.15,c.dark,parent);
  w.box(x,2.2,-8.26,.45,.25,.06,c.coral,parent);
  drum(w,parent,x,4.2,-10,.45,.4,c.purple);
 }
}
