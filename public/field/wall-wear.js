import * as THREE from 'three';
import {rng,cellKey,supportsWall,floorHeight} from './maze-core.js';
// One alphabet, repeated across rooms: a fork, barred eye, broken gate and ladder.
const glyphs=[[[0,-1],[0,1],[-.6,.3],[0,-.1],[.6,.3]], [[-.7,0],[0,-.7],[.7,0],[0,.7],[-.7,0],[.7,0]], [[-.6,1],[-.6,-1],[.6,-1],[.6,.3]], [[-.5,-1],[-.5,1],[.5,.5],[-.5,0],[.5,-.5],[.5,1]]];
export function wearPlacements(chunk,seed,floor){
 if(floor!==-1)return[];
 const r=chunk.room,random=rng(seed^Math.imul(r.index+211,1597334677)),candidates=[];
 for(const key of chunk.cells){const [x,z]=key.split(',').map(Number);
  // Leave established hallway posters and branch-office artwork unobscured.
  if((z>=-19&&z<=-17)||(z>=-31&&z<=-29)||(r.branch&&((z>=-23&&z<=-21)||(z>=-27&&z<=-25))))continue;
  if(z>=-r.d/2&&z<r.d/2&&(['gallery','nursery'].includes(r.kind)||z<2))continue;
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   if(chunk.cells.has(cellKey(x+dx,z+dz))||(z===5&&dz===1)||(z===-58&&dz===-1))continue;
   if(r.kind==='pit'&&Math.abs(x+dx+.5)<2&&Math.abs(z+dz+.5)<2)continue;
   if(r.deadEnd&&r.pitEnd&&z===-31&&dz===-1)continue;
   const px=x+.5+dx*.43,pz=z+.5+dz*.43,rotation=Math.atan2(-dx,-dz);
   if(supportsWall(chunk.cells,px,pz,rotation,.47))candidates.push({x:px,z:pz,rotation,y:floorHeight(r,pz)+1.5});
  }
 }
 for(let i=candidates.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[candidates[i],candidates[j]]=[candidates[j],candidates[i]];}
 const count=3+Math.min(10,Math.floor(Math.abs(r.index)*.8)),chosen=[];
 for(const p of candidates){if(chosen.some(q=>Math.hypot(p.x-q.x,p.z-q.z)<2.1))continue;chosen.push({...p,kind:chosen.length%3,variant:Math.floor(random()*3)});if(chosen.length>=count)break;}
 return chosen;
}
function texture(kind,variant){
 const c=document.createElement('canvas');c.width=512;c.height=768;const ctx=c.getContext('2d'),random=rng(7103+kind*53+variant*419);
 const stroke=(points,color,width)=>{ctx.beginPath();points.forEach(([x,y],i)=>{if(!i){ctx.moveTo(x,y);return;}const [px,py]=points[i-1],steps=Math.ceil(Math.hypot(x-px,y-py)/7);for(let j=1;j<=steps;j++)ctx.lineTo(px+(x-px)*j/steps+(random()-.5)*2.8,py+(y-py)*j/steps+(random()-.5)*2.8);});ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();};
 const sigil=(x,y,size,g,color='#aaa27a')=>{const points=glyphs[g%4].map(([a,b])=>[x+a*size,y+b*size]);stroke(points,color,9);for(let i=0;i<170;i++){const a=Math.floor(random()*(points.length-1)),t=random(),p=[points[a][0]*(1-t)+points[a+1][0]*t,points[a][1]*(1-t)+points[a+1][1]*t];ctx.fillStyle=color;ctx.globalAlpha=random()*.2;ctx.fillRect(p[0]+(random()-.5)*24,p[1]+(random()-.5)*24,1+random()*3,1+random()*3);}ctx.globalAlpha=1;};
 if(kind===0){
  // Repeated symbol: overpainted, crossed out, then redrawn in brighter chalk.
  sigil(256,240,115,1,variant===2?'#c0b78d':'#777553');
  if(variant===0){ctx.fillStyle='#645948';ctx.globalAlpha=.87;for(let i=0;i<10;i++)ctx.fillRect(125+random()*14,130+i*25,245+random()*20,19+random()*8);ctx.globalAlpha=1;}
  if(variant===1){stroke([[100,110],[400,395]],'#262a22',17);stroke([[380,100],[115,390]],'#262a22',13);}
  for(let i=0;i<4;i++)sigil(82+i*116,540+(random()-.5)*30,37,(i+variant)%4,'#a29b72');
  for(let i=0;i<5;i++)stroke([[160+i*47,610],[153+i*47,651+random()*50]],'#726a4f',3);
 }else if(kind===1){
  for(let i=0;i<210;i++){const x=260+(random()+random()-1)*205,y=310+(random()+random()-1)*200,rad=i<12?15+random()*35:1+random()*7;ctx.fillStyle=['#493323','#33372a','#695230'][i%3];ctx.globalAlpha=.35+random()*.5;ctx.beginPath();for(let k=0;k<17;k++){const angle=k/16*Math.PI*2,r=rad*(.6+random()*.5),px=x+Math.cos(angle)*r,py=y+Math.sin(angle)*r*(.5+random()*.4);k?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();ctx.fill();if(i%13===0)stroke([[x,y],[x-5+random()*10,y+60+random()*190]],'#493a27',1+random()*4);}
  ctx.globalAlpha=1;
 }else{
  ctx.beginPath();ctx.moveTo(170,45);for(let y=50;y<700;y+=35)ctx.lineTo(110+random()*65,y);for(let y=700;y>40;y-=35)ctx.lineTo(350+random()*60,y);ctx.closePath();ctx.fillStyle='#77786b';ctx.fill();ctx.save();ctx.clip();
  for(let i=0;i<9000;i++){ctx.fillStyle=random()>.5?'#4b5048':'#a09f88';ctx.globalAlpha=random()*.35;ctx.fillRect(random()*512,random()*768,2+random()*4,2+random()*4);}ctx.globalAlpha=1;
  for(let x=100;x<440;x+=29)stroke([[x,0],[x-12,768]],'#686453',2);
  sigil(260,470,100,1,'#494b3b');stroke([[225,120],[275,270],[233,340],[292,530]],'#454b44',3);ctx.restore();
 }
 // Scuffed paint lets the original wallpaper show through.
 ctx.globalCompositeOperation='destination-out';for(let i=0;i<6000;i++){ctx.globalAlpha=random()*.45;ctx.fillRect(random()*512,random()*768,1+random()*3,1+random()*5);}ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=2;return t;
}
export class WallWear{
 constructor(){this.geometry=new THREE.PlaneGeometry(.9,1.8);this.materials=[];this.textures=[];for(let kind=0;kind<3;kind++)for(let variant=0;variant<3;variant++){const map=texture(kind,variant);this.textures.push(map);this.materials.push(new THREE.MeshStandardMaterial({map,transparent:true,depthWrite:false,roughness:1,side:THREE.FrontSide,polygonOffset:true,polygonOffsetFactor:-1}));}
 // A curled lip catches the flashlight along the exposed wallpaper edge.
 const vertices=[],indices=[];for(let i=0;i<=12;i++){const t=i/12,x=-.28+t*.20,y=.55-t*.8,z=.018+Math.sin(t*Math.PI)*.12,w=.065+Math.sin(i*3.1)*.018;vertices.push(x-w,y,z,x+w,y,z);if(i<12){const a=i*2;indices.push(a,a+1,a+2,a+1,a+3,a+2);}}
 this.curl=new THREE.BufferGeometry();this.curl.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));this.curl.setIndex(indices);this.curl.computeVertexNormals();this.paper=new THREE.MeshStandardMaterial({color:0x989071,roughness:1,side:THREE.DoubleSide});
 }
 build(chunk,seed,floor){const group=new THREE.Group();for(const p of wearPlacements(chunk,seed,floor)){const surface=new THREE.Group();surface.position.set(p.x,p.y,p.z);surface.rotation.y=p.rotation;const print=new THREE.Mesh(this.geometry,this.materials[p.kind*3+p.variant]);print.receiveShadow=true;surface.add(print);if(p.kind===2){const lip=new THREE.Mesh(this.curl,this.paper);lip.castShadow=true;surface.add(lip);}group.add(surface);}return group;}
 dispose(){this.geometry.dispose();this.curl.dispose();this.paper.dispose();for(const m of this.materials)m.dispose();for(const t of this.textures)t.dispose();}
}
