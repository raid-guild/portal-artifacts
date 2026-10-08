import * as THREE from 'three';
import {groundAt} from './colliders.js';

// One flat color per triangular plane keeps the jewels legible as little cut
// solids even after the shared print texture and a live collection tint.
export function facetedOctahedron(radius,kind='gem'){
  const source=new THREE.OctahedronGeometry(radius,0),geometry=source.index?source.toNonIndexed():source;
  if(source!==geometry)source.dispose();
  const position=geometry.attributes.position,colors=new Float32Array(position.count*3);
  const a=new THREE.Vector3(),b=new THREE.Vector3(),c=new THREE.Vector3(),normal=new THREE.Vector3();
  for(let i=0;i<position.count;i+=3){
    a.fromBufferAttribute(position,i);b.fromBufferAttribute(position,i+1);c.fromBufferAttribute(position,i+2);
    normal.subVectors(b,a).cross(new THREE.Vector3().subVectors(c,a)).normalize();
    const side=.83+.08*Math.sin(i*2.17),tone=normal.y>.4?1.08:normal.y<-.4?.7:side;
    const tint=kind==='gem'?[tone*.97,tone*.98,Math.min(1.18,tone*1.08)]:
      [Math.min(1.2,tone*1.09),tone*.97,tone*.68];
    for(let j=0;j<3;j++)colors.set(tint,i*3+j*3);
  }
  geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
  return geometry;
}

export function flutedPost(radius,height){
  const geometry=new THREE.CylinderGeometry(radius,radius,height,48,1,false),p=geometry.attributes.position;
  const colors=new Float32Array(p.count*3);
  for(let i=0;i<p.count;i++){
    const x=p.getX(i),z=p.getZ(i),angle=Math.atan2(z,x);
    const groove=.5+.5*Math.cos(angle*12),radial=1-.047*groove;
    p.setXYZ(i,x*radial,p.getY(i),z*radial);
    const cap=i>=98,tone=cap?1.08:.82+.15*(1-groove);
    colors.set([tone,tone,tone],i*3);
  }
  geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
  geometry.computeVertexNormals();return geometry;
}

// Ink and minute chipped wedges are merged per storey. They read from the
// authored terrain descriptor and never become colliders or raycast targets.
export function addStoneEdges(group,level,colliders){
  const line=[],chips=[],ink=0x51635d;
  const segment=(a,b)=>line.push(...a,...b);
  const path=(a,b,n)=>{
    for(let i=0;i<n;i++){
      if(i%7===4)continue;
      const at=t=>a.map((v,k)=>v+(b[k]-v)*t);
      const u=at((i+.06)/n),v=at((i+.72)/n);segment(u,v);
      if(i%6===0){const m=at((i+.45)/n);
        chips.push(...m,m[0]+.025,m[1]-.016,m[2]-.022,m[0]+.061,m[1]-.003,m[2]+.014);
      }
    }
  };
  const t=level.terrain,b=level.boundary,front=t.frontZ;
  const high=t.upperHeight??t.frontHeight,stairs=t.stairs??t.leftStairs;
  const yAt=(x,z)=>groundAt(x,z,colliders).height+.025;
  for(const [x0,x1] of [[b.minX,stairs.minX],[stairs.maxX,b.maxX]])
    path([x0,high+.025,front],[x1,high+.025,front],Math.ceil((x1-x0)*3));
  for(const step of stairs.steps){const z=step.z+step.width,y=yAt((stairs.minX+stairs.maxX)/2,z);
    path([stairs.minX,y,z],[stairs.maxX,y,z],10);}
  if(t.startTier)for(const step of t.startTier.steps){const x=step.x+step.width,y=yAt(x,(t.startTier.minZ+t.startTier.maxZ)/2);
    path([x,y,t.startTier.minZ],[x,y,t.startTier.maxZ],12);}
  if(t.rightStairs){
    const s=t.rightStairs;
    for(const [x0,x1] of [[b.minX,s.minX],[s.maxX,b.maxX]])path([x0,t.middleHeight+.025,t.rearZ],[x1,t.middleHeight+.025,t.rearZ],Math.ceil((x1-x0)*3));
    for(const step of s.steps){const z=step.z+step.width,y=yAt((s.minX+s.maxX)/2,z);
      path([s.minX,y,z],[s.maxX,y,z],10);}
  }
  if(level.grip){const p=level.grip.platform,y=p.maxY+.024;
    path([p.minX,y,p.minZ],[p.maxX,y,p.minZ],14);path([p.minX,y,p.maxZ],[p.maxX,y,p.maxZ],14);
  }
  // A few joined, branching fractures echo the printed stone. Vary their
  // heading so the hand-drawn marks do not become rows of horizontal dashes.
  let seed=level.id*19753+421;
  const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
  for(let i=0;i<20;i++){
    const x=b.minX+.5+random()*(b.maxX-b.minX-1),z=b.minZ+.5+random()*(b.maxZ-b.minZ-1);
    if(Math.hypot(x-level.exit.x,z-level.exit.z)<1.3)continue;
    const len=.25+random()*.36,angle=random()*Math.PI*2,dx=Math.cos(angle),dz=Math.sin(angle);
    const joint=[x+len*.56*dx,z+len*.56*dz],end=[x+len*dx-.045*dz,z+len*dz+.045*dx];
    const h0=yAt(x,z),h1=yAt(...joint),h2=yAt(...end);
    if(Math.max(Math.abs(h1-h0),Math.abs(h2-h0))>.09)continue;
    const a=[x,h0+.003,z],m=[joint[0],h1+.003,joint[1]];
    segment(a,m);segment(m,[end[0],h2+.003,end[1]]);
    if(i%3===0){
      const bx=joint[0]+len*.32*(dx*.4-dz*.92),bz=joint[1]+len*.32*(dz*.4+dx*.92),bh=yAt(bx,bz);
      if(Math.abs(bh-h1)<.09)segment(m,[bx,bh+.003,bz]);
    }
  }
  const lines=new THREE.BufferGeometry();lines.setAttribute('position',new THREE.Float32BufferAttribute(line,3));
  const inkMesh=new THREE.LineSegments(lines,new THREE.LineBasicMaterial({color:ink,transparent:true,opacity:.43,depthWrite:false}));
  inkMesh.userData.stoneEdges=level.id;group.add(inkMesh);
  const wedges=new THREE.BufferGeometry();wedges.setAttribute('position',new THREE.Float32BufferAttribute(chips,3));wedges.computeVertexNormals();
  const chipMesh=new THREE.Mesh(wedges,new THREE.MeshBasicMaterial({color:0x9e9588,side:THREE.DoubleSide,transparent:true,opacity:.33}));
  chipMesh.userData.stoneChips=level.id;group.add(chipMesh);
  return [inkMesh,chipMesh];
}
