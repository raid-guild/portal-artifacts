import * as THREE from 'three';

// Art-directed impact phases, not a fluid solver. Fixed pools bound rapid-tap cost.
const CAPACITY = 5;
const DROPS = 25;
const LIFE = 2.8;
function sheetGeometry() {
  const segments = 80, rows = 10, positions = [], uvs = [], indices = [];
  for (let j = 0; j <= rows; j++) for (let i = 0; i <= segments; i++) {
    positions.push(0, 0, 0); uvs.push(i / segments, j / rows);
  }
  for (let j = 0; j < rows; j++) for (let i = 0; i < segments; i++) {
    const a = j * (segments + 1) + i, b = a + segments + 1;
    indices.push(a, b, a + 1, b, b + 1, a + 1);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  // The shader deforms the zeroed geometry; supply a conservative culling bound.
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 3, 0), 10);
  return geometry;
}
const vertexShader = `
uniform float uAge,uPower,uKind;
varying vec2 vUv;varying vec3 vNormal,vView;varying vec3 vWorld;
void main(){
 vUv=uv;float a=uv.x*6.2831853,t=uv.y,r,h;
 if(uKind<.5){
  float life=clamp(uAge/1.15,0.,1.);
  float rise=pow(max(0.,sin(life*3.14159265)),.78);
  float fingers=pow(.5+.5*cos(a*12.),5.);
  r=(.42+life*1.75+pow(t,1.6)*(.35+life*.5))*uPower;
  h=t*rise*(1.25+.7*pow(t,5.)*fingers)*uPower;
 }else{
  float life=clamp((uAge-.62)/1.45,0.,1.);
  float rise=pow(max(0.,sin(life*3.14159265)),1.25);
  r=(.48*pow(1.-t,2.6)+.095+.06*pow(sin(t*3.14159),2.))*rise*uPower;
  h=t*rise*4.5*uPower;
 }
 vec3 p=vec3(cos(a)*r,h,sin(a)*r);
 vNormal=normalize(normalMatrix*vec3(cos(a),uKind<.5?-.28:.2,sin(a)));
 vec4 mv=modelViewMatrix*vec4(p,1.);vView=-mv.xyz;vWorld=(modelMatrix*vec4(p,1.)).xyz;
 gl_Position=projectionMatrix*mv;
}`;
const fragmentShader = `
uniform float uAge,uKind,uDay;uniform vec2 uCenter;uniform vec3 uFog;uniform float uFogNear,uFogFar;
varying vec2 vUv;varying vec3 vNormal,vView,vWorld;
void main(){
 // Clip the effect to the actual irregular shoreline, including impacts near the edge.
 vec2 p=vWorld.xz;float a=atan(-p.y/8.,p.x/12.);float edge=length(p/vec2(12.,8.))/(1.+.035*sin(a*5.)+.018*cos(a*9.));if(edge>.998)discard;
 float phase=uKind<.5?uAge/1.15:(uAge-.62)/1.45;
 if(phase<=0.||phase>=1.)discard;
 float fresnel=pow(1.-abs(dot(normalize(vNormal),normalize(vView))),2.);
 float crest=smoothstep(.91,.995,vUv.y);
 float glint=pow(.5+.5*sin(vUv.x*75.+vUv.y*8.),16.);
 vec3 c=mix(vec3(.08,.55,.57),vec3(.58,.91,.86),fresnel*.8+vUv.y*.18);
 c=mix(c,vec3(.89,1.,.96),max(crest*.92,glint*.28));c*=.2+.8*uDay;
 float opacity=(.68+fresnel*.24+crest*.08)*(1.-smoothstep(.65,1.,phase));
 c=mix(c,uFog,smoothstep(uFogNear,uFogFar,length(vView)));
 gl_FragColor=vec4(c,opacity);
 #include <colorspace_fragment>
}`;
export function createSplashSystem({ scene, daylight, reduced, onReturn }) {
  const geometry = sheetGeometry();
  const slots = [];
  const dropletMaterial = new THREE.MeshToonMaterial({ color: '#b5fff1' });
  const droplets = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), dropletMaterial, CAPACITY * DROPS);
  droplets.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  droplets.frustumCulled = false;
  scene.add(droplets);
  const dummy = new THREE.Object3D();
  const velocity = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  for (let i = 0; i < CAPACITY; i++) {
    const group = new THREE.Group(); group.visible = false; scene.add(group);
    const age = { value: 10 }, power = { value: 1 };
    for (const kind of [0, 1]) {
      const material = new THREE.ShaderMaterial({
        transparent: true, side: THREE.DoubleSide, depthWrite: false,
        uniforms: { uAge: age, uPower: power, uKind: { value: kind }, uDay: daylight,
          uCenter: { value: new THREE.Vector2() }, uFog: { value: scene.fog.color },
          uFogNear: { value: scene.fog.near }, uFogFar: { value: scene.fog.far } },
        vertexShader, fragmentShader,
      });
      const mesh = new THREE.Mesh(geometry, material);mesh.renderOrder=2;group.add(mesh);
    }
    slots.push({ group, age, power, born: -100, active: false, returned: false, x: 0, z: 0 });
  }
  let next = 0;
  function inside(x,z){const a=Math.atan2(-z/8,x/12);return Math.hypot(x/12,z/8)<.98*(1+.035*Math.sin(a*5)+.018*Math.cos(a*9));}
  return {
    spawn(x, z, time, strength) {
      if (reduced || strength <= 0) return;
      const slot = slots[next]; next = (next + 1) % CAPACITY;
      Object.assign(slot, { born: time, x, z, active: true, returned: false });
      slot.age.value = 0;slot.power.value = Math.sqrt(strength);
      slot.group.position.set(x, .08, z);slot.group.visible=true;
    },
    update(time) {
      let active = false;
      for (let i = 0; i < CAPACITY; i++) {
        const slot = slots[i], age = time - slot.born, power=slot.power.value;
        slot.age.value=age;slot.active=age>=0&&age<LIFE;slot.group.visible=slot.active;
        active ||= slot.active;
        for(const mesh of slot.group.children){mesh.material.uniforms.uFogNear.value=scene.fog.near;mesh.material.uniforms.uFogFar.value=scene.fog.far;}
        if(slot.active&&!slot.returned&&age>1.95){slot.returned=true;onReturn(slot.x,slot.z,.65);}
        for(let j=0;j<DROPS;j++){
          let x=slot.x,z=slot.z,y=-10,size=0;
          if(slot.active){
            if(j<24){
              const a=j/24*Math.PI*2, flight=age-.26;
              if(flight>=0){const speed=(1.4+(j%3)*.28)*power;const r=.95*power+speed*flight;
                x+=Math.cos(a)*r;z+=Math.sin(a)*r;y=.8*power+(3.4+(j%4)*.35)*power*flight-5.5*flight*flight;
                velocity.set(Math.cos(a)*speed,(3.4+(j%4)*.35)*power-11*flight,Math.sin(a)*speed);
                size=(.07+(j%3)*.025)*power;
              }
            }else{
              const flight=age-1.23;
              if(flight>=0){y=4.35*power+1.5*power*flight-5.5*flight*flight;size=.19*power;velocity.set(.1,1.5*power-11*flight,0);}
            }
          }
          if(y<.1||!inside(x,z))size=0;
          dummy.position.set(x,Math.max(.08,y),z);dummy.scale.set(size,size*(j===24?1.35:1.65),size);
          if(size>0)dummy.quaternion.setFromUnitVectors(up,velocity.normalize());
          dummy.updateMatrix();droplets.setMatrixAt(i*DROPS+j,dummy.matrix);
        }
      }
      droplets.visible=active;droplets.instanceMatrix.needsUpdate=true;
    },
  };
}
