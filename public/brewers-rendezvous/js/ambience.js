import * as THREE from 'three';
import { breweryStops } from './content.js';
import { insideBooth } from './layout.js';

const TREE_LEAVES = new Set([
  'cottonwood deep green combined', 'cottonwood lime tips combined',
  'cottonwood summer green combined', 'cottonwood sunlit leaves combined'
]);

function rng(seed) {
  let value = seed >>> 0;
  return () => { value ^= value << 13; value ^= value >>> 17; value ^= value << 5; return (value >>> 0) / 4294967296; };
}

const waterVertex = /* glsl */`
  varying vec2 vPlace;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vPlace = world.xz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;
const waterFragment = /* glsl */`
  uniform float uTime;
  varying vec2 vPlace;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float rockWake(vec2 p, vec2 rock) {
    vec2 d = p - rock;
    float nearRock = exp(-2.9 * abs(length(d * vec2(0.92, 1.14)) - 0.88));
    float upstream = 1.0 - smoothstep(-0.16, 0.28, d.x);
    float ring = nearRock * upstream * (0.65 + 0.35 * sin(d.y * 8.0 - uTime * 1.1));
    float downstream = smoothstep(0.05, 0.5, d.x) * (1.0 - smoothstep(4.8, 7.4, d.x));
    float spread = 0.24 + d.x * 0.19;
    float sides = exp(-5.0 * abs(abs(d.y) - spread));
    float broken = smoothstep(0.15, 0.82, sin(d.x * 7.4 + d.y * 3.8 - uTime * 3.2));
    return clamp(ring * 0.56 + downstream * sides * broken * 0.48, 0.0, 1.0);
  }
  void main() {
    vec2 p = vPlace;
    float flow = p.x - uTime * 1.15;
    float meander = sin(p.y * 2.5 + flow * 0.23) * 0.5 + sin(p.y * 5.3 - flow * 0.11) * 0.24;
    float broad = 0.5 + 0.5 * sin(p.y * 2.2 + flow * 0.36 + meander);
    vec3 color = mix(vec3(0.22, 0.42, 0.43), vec3(0.39, 0.64, 0.65), broad * 0.68);
    float sky = exp(-pow((p.y + 12.05 + meander * 0.14) * 0.9, 2.0));
    color += vec3(0.16, 0.19, 0.14) * sky * (0.53 + 0.47 * sin(flow * 0.38));
    // Soft canopy color broken by the moving surface; an illustrative reflection.
    float canopy = exp(-pow((p.x + 16.0 + sin(flow * 0.18) * 0.7) * 0.18, 2.0));
    canopy += exp(-pow((p.x - 1.0 + sin(flow * 0.23) * 0.7) * 0.23, 2.0));
    canopy += exp(-pow((p.x - 20.0 + sin(flow * 0.15) * 0.7) * 0.22, 2.0));
    canopy *= 0.56 + 0.44 * sin(p.y * 4.3 + flow * 0.5);
    color = mix(color, vec3(0.22, 0.45, 0.39), clamp(canopy * 0.29, 0.0, 0.32));
    float line = sin(flow * 7.3 + sin(p.y * 5.2) * 1.8 + uTime * 0.47);
    float broken = step(0.43, hash(floor(vec2(flow * 0.7, p.y * 3.8))));
    float ripple = smoothstep(0.86, 0.98, line) * broken;
    color += vec3(0.18, 0.23, 0.20) * ripple * 0.53;
    float foam = max(rockWake(p, vec2(14.0, -11.6)), rockWake(p, vec2(21.0, -12.7)));
    color = mix(color, vec3(0.85, 0.91, 0.83), foam * 0.72);
    gl_FragColor = vec4(color, 1.0);
  }
`;

function makeGrassTexture() {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 256;
  const context = canvas.getContext('2d');
  context.fillStyle = '#a4b68c';context.fillRect(0,0,256,256);
  const random = rng(5049);
  for(let i=0;i<1700;i++){
    const x=random()*256,y=random()*256;
    context.fillStyle = i%4===0 ? 'rgba(228,229,181,.36)' : i%3===0 ? 'rgba(47,91,59,.18)' : 'rgba(77,126,72,.17)';
    context.fillRect(x,y,.6+random()*1.4,.7+random()*2.4);
  }
  const texture=new THREE.CanvasTexture(canvas);
  texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
  texture.repeat.set(8,5);
  texture.colorSpace=THREE.SRGBColorSpace;
  texture.anisotropy=4;
  return texture;
}

function allowedTuft(x,z) {
  if(z < -8.8 || z > 14.8 || x < -25.5 || x > 25.5) return false;
  if(z > 14.7) return false;
  if(x > -25 && x < 19 && Math.abs(z-5.1)<1.28) return false;
  if(x > 10.8 && x < 22 && Math.abs(z-4.3)<1.47) return false;
  if(breweryStops.some(stop=>insideBooth(stop,x,z))) return false;
  if(x>11.5&&x<15.5&&z>-.1&&z<2.4) return false;
  if(x>13.2&&x<21.2&&z>-7.3&&z<-3) return false;
  if([[-23,-6.6],[-16,-7.8],[-8,-8.1],[1,-7.9],[10,-8.1],[23,-7.2],[-24,6.3],[23,4.6]].some(([tx,tz])=>Math.hypot(x-tx,z-tz)<1.18)) return false;
  return true;
}

function createTufts(scene, owned) {
  const count=760, random=rng(73649);
  const geo=new THREE.ConeGeometry(.055,.19,3,1), material=new THREE.MeshStandardMaterial({color:'#ffffff',roughness:1,flatShading:true,side:THREE.DoubleSide});
  const instanced=new THREE.InstancedMesh(geo,material,count);
  instanced.castShadow=false;instanced.receiveShadow=false;
  const dummy=new THREE.Object3D(),color=new THREE.Color();
  let placed=0, attempts=0;
  while(placed<count&&attempts<count*14){
    attempts++;
    const x=-25.3+random()*50.6,z=-8.7+random()*23.4;
    if(!allowedTuft(x,z))continue;
    const size=.48+random()*.72;
    dummy.position.set(x,-.065+size*.095,z);
    dummy.rotation.y=random()*Math.PI*2;
    dummy.scale.set(.7+random()*.75,size,.7+random()*.75);
    dummy.updateMatrix();instanced.setMatrixAt(placed,dummy.matrix);
    color.set(random()<.45?'#72956a':random()<.7?'#8cac79':'#b6bf80');
    instanced.setColorAt(placed,color);placed++;
  }
  instanced.count=placed;instanced.instanceMatrix.needsUpdate=true;
  scene.add(instanced);owned.push(instanced);
}

function makeRock(scene,x,z,scale,owned) {
  const base=new THREE.Mesh(new THREE.DodecahedronGeometry(.74,0),new THREE.MeshStandardMaterial({color:'#445a55',roughness:.9,flatShading:true}));
  base.position.set(x,.12,z);base.scale.set(scale,.52*scale,.78*scale);base.rotation.y=x*.25;base.castShadow=true;scene.add(base);owned.push(base);
  const top=new THREE.Mesh(new THREE.DodecahedronGeometry(.64,0),new THREE.MeshStandardMaterial({color:'#b6ab8b',roughness:1,flatShading:true}));
  top.position.set(x-.05,.34*scale,z-.04);top.scale.set(scale,.53*scale,.8*scale);top.rotation.y=x*.25;top.castShadow=true;scene.add(top);owned.push(top);
}

export function createAmbience(scene,ground) {
  const owned=[];
  const grassTexture=makeGrassTexture();
  const grassMaterial=new THREE.MeshStandardMaterial({map:grassTexture,roughness:1,flatShading:true});
  ground.material=grassMaterial;
  createTufts(scene,owned);
  const waterUniforms={uTime:{value:0}};
  const waterMaterial=new THREE.ShaderMaterial({uniforms:waterUniforms,vertexShader:waterVertex,fragmentShader:waterFragment,side:THREE.DoubleSide});
  const water=new THREE.Mesh(new THREE.PlaneGeometry(53,4),waterMaterial);
  water.rotation.x=-Math.PI/2;water.position.set(0,.143,-12.22);water.receiveShadow=false;water.castShadow=false;scene.add(water);owned.push(water);
  makeRock(scene,14,-11.6,1.04,owned);makeRock(scene,21,-12.7,.78,owned);
  const leafMeshes=[];
  let time=0,lastTree=0,reduced=false;
  function attachTrees(trees){
    trees.forEach((tree,treeIndex)=>{
      let leafIndex=0;
      tree.traverse(node=>{
        if(!node.isMesh || !TREE_LEAVES.has(node.name)) return;
        // The GLB merges each leaf color into one mesh. Moving only these four
        // meshes keeps bark fixed and avoids CPU vertex uploads or torn facets.
        leafMeshes.push({node,original:node.position.clone(),treeIndex,leafIndex:leafIndex++});
      });
    });
  }
  function update(dt){
    if(reduced)return;
    time+=dt;waterUniforms.uTime.value=time;
    if(time-lastTree<1/30)return;
    lastTree=time;
    for(const entry of leafMeshes){
      const {node,original,treeIndex,leafIndex}=entry;
      const phase=treeIndex*1.07;
      const driftX=Math.sin(time*.51+phase)*.13;
      const driftZ=Math.cos(time*.43+phase*.91)*.11;
      const driftY=Math.sin(time*.65+phase*.73)*.026;
      const flutter=Math.sin(time*1.32+leafIndex*1.19+phase)*.018;
      node.position.set(original.x+driftX+flutter,original.y+driftY+flutter*.4,original.z+driftZ-flutter*.72);
    }
  }
  function setReduced(value){reduced=value;}
  function dispose(){
    for(const object of owned){scene.remove(object);object.geometry.dispose();object.material.dispose();}
    for(const entry of leafMeshes)entry.node.position.copy(entry.original);
    grassTexture.dispose();grassMaterial.dispose();
  }
  return {attachTrees,update,setReduced,dispose};
}
