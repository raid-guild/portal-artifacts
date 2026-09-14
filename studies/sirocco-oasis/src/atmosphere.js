import * as THREE from 'three';
export const defaults=Object.freeze({hour:17.5,storm:0,wind:35,grain:12,ripple:100});
export const settings={...defaults};
export const environmentUniforms={daylight:{value:1},wind:{value:1},grain:{value:.12},ripple:{value:1},skyLow:{value:new THREE.Color(1,.65,.4)},skyMid:{value:new THREE.Color(.65,.51,.65)},skyHigh:{value:new THREE.Color(.2,.37,.61)}};
export function bindAtmosphereControls(){
 const panel=document.querySelector('#atmosphere');panel.open=!matchMedia('(max-width:600px)').matches;
 for(const input of panel.querySelectorAll('input')){
  const sync=()=>{const value=Number(input.value);settings[input.name]=value;const label=input.name==='hour'?`${String(Math.floor(value)%24).padStart(2,'0')}:${String(Math.round(value%1*60)).padStart(2,'0')}`:`${value}%`;document.querySelector(`#${input.id}-value`).textContent=label;input.setAttribute('aria-valuetext',label);input.style.setProperty('--fill',`${(value-input.min)/(input.max-input.min)*100}%`);};
  input.value=defaults[input.name];input.addEventListener('input',sync);sync();
 }
 document.querySelector('#restore-atmosphere').onclick=()=>{for(const input of panel.querySelectorAll('input')){input.value=defaults[input.name];input.dispatchEvent(new Event('input'));}};
}
// Continuous light palettes, with the original sunset at 17:30.
const palettes=[
 [0,'#171e39','#111b37','#070e21','#19253c','#8193c7',.22,.55],
 [5,'#403654','#272b4d','#132440','#49425c','#a4a8ce',.26,.65],
 [6.5,'#ffc08a','#bb91a6','#466eac','#bea0a8','#ffd4b4',.8,1.35],
 [12,'#c6e4e7','#81b8d6','#3677ba','#bbcace','#fff3da',1.15,1.8],
 [17.5,'#ffa666','#a682a6','#335e9c','#c29aa3','#ffd0a0',1,1.65],
 [19,'#b76672','#674b7c','#283957','#765b79','#ec9b8e',.43,.85],
 [21,'#252b48','#1b2544','#101a32','#2a334d','#8e9bc5',.23,.55],
 [24,'#171e39','#111b37','#070e21','#19253c','#8193c7',.22,.55],
];
const noiseGLSL=`float hash(vec2 p){vec3 p3=fract(vec3(p.xyx)*.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<3;i++){v+=a*noise(p);p=p*2.03+17.1;a*=.5;}return v;}`;
export function createAtmosphere({scene,camera,hemi,sunLight,sun,sunHalo,clouds,shared,reduced}){
 camera.layers.enable(1);
 const sheets=[],storm={value:0},drift={value:0};
 for(let i=0;i<6;i++){
  const height=13+i%3*5;
  const material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,
   uniforms:{uStorm:storm,uDrift:drift,uPhase:{value:i*13.7},uDay:environmentUniforms.daylight},
   vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
   fragmentShader:`${noiseGLSL}varying vec2 vUv;uniform float uStorm,uDrift,uPhase,uDay;
   void main(){vec2 p=vUv;vec2 q=p*vec2(5.,3.)+vec2(uPhase-uDrift*.065,0.);float curl=fbm(q+vec2(0.,uDrift*.025));float density=fbm(q+vec2(curl*1.8,-curl+uDrift*.035));float ceiling=.47+.19*sin(p.x*17.+uPhase)+.22*density;float shape=smoothstep(0.,.12,p.x)*(1.-smoothstep(.84,1.,p.x));shape*=smoothstep(0.,.12,p.y)*(1.-smoothstep(ceiling-.23,ceiling+.12,p.y));float body=smoothstep(.19,.68,density)*shape;vec3 light=mix(vec3(.77,.44,.29),vec3(1.,.76,.48),density+curl*.25);light=mix(vec3(.14,.19,.29),light,clamp(uDay,0.,1.));gl_FragColor=vec4(light,body*(.035+uStorm*.78));}`});
  const sheet=new THREE.Mesh(new THREE.PlaneGeometry(75+i%3*14,height),material);sheet.position.set(-70+i*21,height*.5,-70+i*18);sheet.userData={height,offset:i*29};sheet.layers.set(1);sheet.visible=false;scene.add(sheet);sheets.push(sheet);
 }
 // One transparent screen-space pass; no additional render target.
 const grainScene=new THREE.Scene(),grainCamera=new THREE.Camera();
 grainScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),new THREE.ShaderMaterial({transparent:true,depthTest:false,depthWrite:false,uniforms:{uGrain:environmentUniforms.grain},vertexShader:'void main(){gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:`${noiseGLSL}uniform float uGrain;void main(){float n=hash(gl_FragCoord.xy);gl_FragColor=vec4(vec3(step(.5,n)),abs(n-.5)*uGrain*.32);}`})));
 let hour=defaults.hour,wind=defaults.wind/35,amount=0;const aColor=new THREE.Color(),bColor=new THREE.Color(),sandTint=new THREE.Color('#bf9675');
 const tint=(target,a,b,t,raw=false)=>{aColor.set(a);bColor.set(b);target.copy(aColor).lerp(bColor,t);if(raw)target.convertLinearToSRGB();};
 return{
  update(dt){
   hour=settings.hour;wind=settings.wind/35;amount=settings.storm/100;storm.value=amount;
   environmentUniforms.wind.value=reduced?0:wind;environmentUniforms.grain.value=settings.grain/100;environmentUniforms.ripple.value=settings.ripple/100;
   if(!reduced)drift.value+=dt*wind*(1+shared.gust.value*.35);
   let k=palettes.findIndex(p=>p[0]>=hour);k=Math.max(1,k);const a=palettes[k-1],b=palettes[k],t=(hour-a[0])/(b[0]-a[0]);
   tint(environmentUniforms.skyLow.value,a[1],b[1],t,true);tint(environmentUniforms.skyMid.value,a[2],b[2],t,true);tint(environmentUniforms.skyHigh.value,a[3],b[3],t,true);tint(scene.fog.color,a[4],b[4],t);scene.fog.color.lerp(sandTint,amount*.45);scene.fog.near=THREE.MathUtils.lerp(65,12,amount);scene.fog.far=THREE.MathUtils.lerp(250,105,amount);
   const day=THREE.MathUtils.lerp(a[6],b[6],t);environmentUniforms.daylight.value=day;hemi.intensity=THREE.MathUtils.lerp(a[7],b[7],t)*(1-amount*.18);sunLight.intensity=day*2*(1-amount*.55);tint(sunLight.color,a[5],b[5],t);
   const arc=(hour-6)/12*Math.PI,daytime=hour>5.8&&hour<18.7;sun.visible=daytime;sunHalo.visible=daytime;sun.position.set(67*Math.cos(arc),2+Math.max(0,Math.sin(arc))*61,-125);sun.lookAt(camera.position);sunHalo.position.copy(sun.position);sunHalo.position.z-=1;sunHalo.lookAt(camera.position);sunLight.position.set(daytime?Math.cos(arc)*40:-30,daytime?20+Math.max(0,Math.sin(arc))*55:35,25);
   clouds.forEach(({mesh})=>mesh.material.color.setRGB(.35+day*.65,.4+day*.6,.6+day*.4));
   sheets.forEach((sheet,i)=>{sheet.visible=amount>.001;sheet.position.x=((drift.value*(1.2+i*.08)+sheet.userData.offset)%230)-115;sheet.scale.y=.35+amount*1.05;sheet.position.y=sheet.userData.height*sheet.scale.y*.5;sheet.rotation.y=Math.atan2(camera.position.x-sheet.position.x,camera.position.z-sheet.position.z);});
  },
  renderGrain(renderer){if(settings.grain===0)return;renderer.autoClear=false;renderer.render(grainScene,grainCamera);renderer.autoClear=true;},
 };
}
