import * as THREE from 'three';
import {createHarvestState} from './harvest-state.js';

export function createHarvester({scene,hull,balloon,emitWave,reduced}){
 const root=hull.clone(true);root.position.set(3,.09,-2);root.scale.setScalar(.34);scene.add(root);
 const state=createHarvestState(), anchors=[], skins=[];
 for(const a of [-5*Math.PI/12,0,5*Math.PI/12]){
  const anchor=new THREE.Group();anchor.position.set(Math.cos(a)*2.9,1.12,-Math.sin(a)*2.9);root.add(anchor);anchors.push(anchor);
  const skin=balloon.clone(true);anchor.add(skin);skins.push(skin);
 }
 const pump=document.querySelector('#pump'),release=document.querySelector('#release'),status=document.querySelector('#harvest-status'),meter=document.querySelector('#harvest-fill'),percent=document.querySelector('#harvest-percent'),delivered=document.querySelector('#delivered');
 pump.onclick=()=>state.toggle();
 release.onclick=()=>{root.updateMatrixWorld(true);if(!state.release())return;for(const f of state.flights.filter(f=>!f.mesh)){f.mesh=balloon.clone(true);f.mesh.scale.setScalar(.34);f.start=anchors[f.slot].getWorldPosition(new THREE.Vector3());f.mesh.position.copy(f.start);scene.add(f.mesh);}};
 document.querySelector('#pump-rate').oninput=e=>{state.rate=Number(e.target.value);document.querySelector('#pump-rate-value').textContent=state.rate.toFixed(1)+'×';};
 const glow=new THREE.Mesh(new THREE.TorusGeometry(1.36,.028,6,64),new THREE.MeshBasicMaterial({color:'#c1fbe3',transparent:true,opacity:.2,depthWrite:false}));glow.rotation.x=Math.PI/2;glow.position.y=.045;root.add(glow);
 const rings=new THREE.Group();root.add(rings);for(let i=0;i<3;i++){const m=new THREE.Mesh(new THREE.TorusGeometry(.6+i*.23,.016,4,48),glow.material);m.rotation.x=Math.PI/2;m.position.y=.015;rings.add(m);}
 let lastWave=-10,lastText='';
 return {root,state,update(dt,time,airship){
  for(const f of state.tick(dt))scene.remove(f.mesh);
  if(!reduced){root.position.y=.09+Math.sin(time*1.3)*.018;root.rotation.z=Math.sin(time*.7)*.007;root.rotation.x=Math.sin(time*.9)*.006;}
  skins.forEach((m,i)=>{m.scale.set(.48+state.fill*.52,.17+state.fill*.83,.48+state.fill*.52);m.rotation.z=reduced?0:Math.sin(time*1.8+i)*.015*state.fill;});
  glow.material.opacity=state.pumping?.5+Math.sin(time*5)*.2:.15;
  rings.scale.setScalar(state.pumping?.9+Math.sin(time*3)*.09:1);
  if(state.pumping&&time-lastWave>.65){emitWave(root.position.x,root.position.z,.09);lastWave=time;}
  for(const f of state.flights){if(!f.mesh)continue;const t=Math.max(0,f.age)/f.duration;const lift=Math.min(1,t/.23);const travel=THREE.MathUtils.smoothstep(t,.18,1);f.mesh.position.lerpVectors(f.start,airship.position,travel);f.mesh.position.y+=Math.sin(lift*Math.PI/2)*4.2*(1-travel);f.mesh.position.x+=Math.sin(t*Math.PI)*(.7+f.slot*.6);f.mesh.rotation.z=Math.sin(time*1.2+f.slot)*.045;f.mesh.scale.setScalar(.34*(1-THREE.MathUtils.smoothstep(t,.92,1)*.8));}
  const n=Math.round(state.fill*100);meter.value=n;percent.textContent=n+'%';delivered.textContent=String(state.delivered);
  pump.textContent=state.pumping?'Pause pumps':state.fill===1?'Reservoirs full':state.fill>0?'Resume pumps':'Start pumps';pump.disabled=state.fill===1;release.disabled=state.fill<1||state.flights.length>6;
  const text=state.pumping?'Drawing water · lift cells charging':state.fill===1?(state.flights.length>6?'Waiting for the flight corridor':'Three vessels ready for departure'):state.flights.length?`${state.flights.length} vessels en route to the airship`:state.fill>0?'Pumps paused · water held in reserve':'Intakes idle · the lake is waiting';if(text!==lastText){status.textContent=text;lastText=text;}
 }};
}
