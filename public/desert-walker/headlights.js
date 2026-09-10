window.createWalkerHeadlights = function (model) {
  const group=new THREE.Group();group.name="Walker_Headlights";model.add(group);
  const slider=document.querySelector("#headlight-intensity"),output=document.querySelector("#headlight-value");
  const brass=new THREE.MeshStandardMaterial({color:0x63533b,roughness:.72,metalness:.4});
  const glass=new THREE.MeshStandardMaterial({color:0xe5d1a1,emissive:0xffd69a,emissiveIntensity:0,roughness:.3});
  const lights=[];
  for(const side of [-1,1]){
    const origin=new THREE.Vector3(-4.08,3.06,side*.63),end=new THREE.Vector3(-17,.2,side*2);
    const direction=end.clone().sub(origin),length=direction.length();direction.normalize();
    const mount=new THREE.Mesh(new THREE.CylinderGeometry(.145,.17,.16,16),brass);
    mount.position.copy(origin);mount.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),direction);group.add(mount);
    const lens=new THREE.Mesh(new THREE.SphereGeometry(.12,16,8),glass);lens.scale.y=.35;lens.quaternion.copy(mount.quaternion);lens.position.copy(origin).addScaledVector(direction,.1);group.add(lens);
    const light=new THREE.SpotLight(0xffdfac,0,75,.27,.65,1);
    light.position.copy(origin).addScaledVector(direction,.18);light.target.position.copy(end);
    light.castShadow=true;light.shadow.mapSize.set(512,512);light.shadow.bias=-.0003;
    group.add(light,light.target);
    const material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,
      uniforms:{strength:{value:0}},
      vertexShader:`varying vec3 world;varying vec3 normalView;varying vec3 viewDirection;varying float along;
        void main(){world=(modelMatrix*vec4(position,1.)).xyz;vec4 v=modelViewMatrix*vec4(position,1.);normalView=normalize(normalMatrix*normal);viewDirection=normalize(-v.xyz);along=uv.y;gl_Position=projectionMatrix*v;}`,
      fragmentShader:`uniform float strength;varying vec3 world;varying vec3 normalView;varying vec3 viewDirection;varying float along;
        void main(){float h=sin(world.x*.035+.8)*1.3+cos(world.z*.044)*1.05+sin((world.x+world.z)*.082)*.32+cos((world.x-world.z)*.061)*.24-exp(-(world.x*world.x+world.z*world.z)/680.)*1.7-1.3;
        if(world.y<h+.04)discard;
        float edge=pow(abs(dot(normalize(normalView),normalize(viewDirection))),1.6);
        float fade=smoothstep(0.,.12,along)*(1.-along)*(1.-along);
        gl_FragColor=vec4(vec3(1.,.76,.42),strength*edge*fade);}`
    });
    const beam=new THREE.Mesh(new THREE.CylinderGeometry(.08,3.4,length,32,1,true),material);
    // Cylinder top is at the lamp; its broad end follows the spotlight direction.
    beam.quaternion.setFromUnitVectors(new THREE.Vector3(0,-1,0),direction);
    beam.position.copy(origin).addScaledVector(direction,length*.5);beam.renderOrder=1;group.add(beam);
    lights.push({light,beam});
  }
  function label(){const value=Number(slider.value)/100;output.textContent=value>0?slider.value+"%":"Off";glass.emissiveIntensity=value*2.5;lights.forEach(({light,beam})=>{light.intensity=value*6;light.visible=value>0;beam.visible=value>0;});}
  slider.addEventListener("input",label);label();
  return {update(storm,hour){
    const brightness=Number(slider.value)/100,night=hour<7 || hour>18;
    glass.emissiveIntensity=brightness*2.5;
    lights.forEach(({light,beam})=>{
      light.intensity=brightness*6;light.visible=brightness>0;
      beam.visible=brightness>0;beam.material.uniforms.strength.value=brightness*((night?.11:.025)+storm*.2);
    });
  }};
};
