import * as THREE from 'three';

// Radial texture is DOM-free so visuals can also be constructed in Node tests.
function glowTexture() {
 const size=64,data=new Uint8Array(size*size*4);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const r=Math.hypot((x-31.5)/31.5,(y-31.5)/31.5),i=(y*size+x)*4;
  data[i]=data[i+1]=data[i+2]=255;data[i+3]=Math.round(Math.max(0,1-r)**3*255);
 }
 const texture=new THREE.DataTexture(data,size,size);texture.magFilter=THREE.LinearFilter;texture.minFilter=THREE.LinearFilter;texture.needsUpdate=true;return texture;
}
const glow=glowTexture();
export function createStudyVisual(radius,color,portal=false) {
 const group=new THREE.Group();
 const core=new THREE.Mesh(portal?new THREE.CircleGeometry(radius*.64,48):new THREE.SphereGeometry(radius,20,12),new THREE.MeshBasicMaterial({color:portal?0x061d26:color,toneMapped:false}));if(portal)core.position.z=.06;group.add(core);
 const aura=new THREE.Sprite(new THREE.SpriteMaterial({map:glow,color,transparent:true,opacity:.8,depthWrite:false,blending:THREE.AdditiveBlending}));aura.scale.setScalar(radius*(portal?5:6));aura.position.z=portal?0:radius+.03;group.add(aura);
 if(portal)for(let i=0;i<3;i++){
  const ring=new THREE.Mesh(new THREE.RingGeometry(radius*(.65+i*.16)-.012,radius*(.65+i*.16)+.012,64),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.85-i*.18}));ring.position.z=.08+i*.02;group.add(ring);
 }
 const light=new THREE.PointLight(color,portal?6:2,radius*(portal?6:8),2);light.position.z=.1;group.add(light);
 const positions=new Float32Array(24*3),heat=new Float32Array(24),geometry=new THREE.BufferGeometry();
 geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setAttribute('heat',new THREE.BufferAttribute(heat,1));
 const sparkMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
  uniforms:{tint:{value:new THREE.Color(color)},pixelRatio:{value:1},fade:{value:1}},
  vertexShader:'attribute float heat; varying float vHeat; uniform float pixelRatio; void main(){vHeat=heat;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_PointSize=(3.+heat*6.)*pixelRatio;}',
  fragmentShader:'uniform float fade; uniform vec3 tint; varying float vHeat; void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;gl_FragColor=vec4(mix(tint,vec3(1.),vHeat*.5),pow(1.-r,2.)*vHeat*.8*fade);}'
 });
 const sparks=new THREE.Points(geometry,sparkMaterial);sparks.frustumCulled=false;group.add(sparks);
 group.userData.fade=1;
 group.userData.setFade=fade=>{
  const value=Math.max(0,Math.min(1,fade));
  group.userData.fade=value;group.visible=value>0;
  core.material.transparent=true;core.material.opacity=value;
  aura.material.opacity=(.7+Math.sin(group.userData.pulseTime||0)*.08)*value;
  sparkMaterial.uniforms.fade.value=value;
  light.intensity=(portal?6:2)*value;
  if(portal)for(const ring of group.children.filter(child=>child.material?.isMeshBasicMaterial&&child!==core))
   ring.material.opacity=(ring.userData.baseOpacity??=ring.material.opacity)*value;
 };
 group.userData.coreRadius=radius;
 group.userData.animate=(time,pixelRatio=1)=>{
  sparkMaterial.uniforms.pixelRatio.value=pixelRatio;
  group.userData.pulseTime=time*3;
  aura.material.opacity=(.7+Math.sin(time*3)*.08)*group.userData.fade;
  for(let i=0;i<24;i++){
   const age=(time*(portal?.5:.8)+i/24)%1,angle=i*2.39996+age*.8;
   const d=portal?radius*(.8+age*.8):radius+age*(.45+radius*.8);
   positions.set([Math.cos(angle)*d,Math.sin(angle)*d,portal?.12:radius*.5],i*3);heat[i]=(1-age)**2;
  }
  geometry.attributes.position.needsUpdate=true;geometry.attributes.heat.needsUpdate=true;
 };
 return group;
}

export function createEclipseVisual(radius) {
 const group=new THREE.Group();
 const halo=new THREE.Sprite(new THREE.SpriteMaterial({map:glow,color:0x7866a4,transparent:true,opacity:.18,depthWrite:false,blending:THREE.AdditiveBlending}));
 halo.scale.setScalar(radius*3.1);group.add(halo);
 const core=new THREE.Mesh(new THREE.CircleGeometry(radius*.72,48),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:1,depthTest:false,depthWrite:false,toneMapped:false}));core.position.z=.12;core.renderOrder=1000;group.add(core);
 for(const [factor,opacity] of [[.86,.58],[1,.34]]){
  const ring=new THREE.Mesh(new THREE.RingGeometry(radius*factor-.018,radius*factor+.018,72),new THREE.MeshBasicMaterial({color:0x8a78b8,transparent:true,opacity,side:THREE.DoubleSide,depthWrite:false}));ring.position.z=.14;group.add(ring);
 }
 group.userData.coreRadius=radius*.72;
 group.userData.animate=time=>{halo.material.opacity=.14+.04*Math.sin(time*2.4);};
 group.userData.setFade=fade=>{group.visible=fade>0;};
 return group;
}

export function createDimmerVisual(radius=.22) {
 const group=new THREE.Group();
 const aura=new THREE.Sprite(new THREE.SpriteMaterial({map:glow,color:0x8964b0,transparent:true,opacity:.27,depthWrite:false,blending:THREE.AdditiveBlending}));
 aura.scale.setScalar(radius*4.2);group.add(aura);
 const core=new THREE.Mesh(new THREE.SphereGeometry(radius,18,12),new THREE.MeshBasicMaterial({color:0x5a3a79,toneMapped:false}));core.position.z=.04;group.add(core);
 const points=[];for(let i=0;i<=64;i++){const theta=i/64*Math.PI*2,irregular=1+.07*Math.sin(theta*7)+.04*Math.cos(theta*11);points.push(new THREE.Vector3(Math.cos(theta)*radius*1.75*irregular,Math.sin(theta)*radius*1.75*irregular,.08));}
 const corona=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:0x9a71bd,transparent:true,opacity:.55,depthWrite:false}));group.add(corona);
 const positions=new Float32Array(9*3),geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3).setUsage(THREE.DynamicDrawUsage));
 const sparks=new THREE.Points(geometry,new THREE.PointsMaterial({color:0xb784d7,size:.055,transparent:true,opacity:.45,depthWrite:false}));group.add(sparks);
 group.userData.coreRadius=radius;
 group.userData.animate=time=>{corona.rotation.z=time*.25;aura.material.opacity=.22+.045*Math.sin(time*2.2);for(let i=0;i<9;i++){const age=(time*.24+i/9)%1,theta=i*2.39996+time*.12,radiusFromCore=radius*(1.25+age*2);positions.set([Math.cos(theta)*radiusFromCore,Math.sin(theta)*radiusFromCore,.08],i*3);}geometry.attributes.position.needsUpdate=true;};
 group.userData.setFade=fade=>{group.visible=fade>0;core.material.opacity=fade;core.material.transparent=true;corona.material.opacity=.55*fade;sparks.material.opacity=.45*fade;};
 return group;
}
