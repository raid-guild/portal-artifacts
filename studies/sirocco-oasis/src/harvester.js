import * as THREE from 'three';
import {createMachineryAudio} from './machinery-audio.js';
import {createControlRoom} from './control-room.js';
import {createHarvestState,STEPS,QUOTA} from './harvest-state.js';

export function createHarvester({scene,hull,balloon,roomModel,emitWave,reduced,camera}){
 const root=hull.clone(true);root.position.set(3,.09,-2);root.scale.setScalar(.34);scene.add(root);
 let saved={};try{saved=JSON.parse(localStorage.getItem('sirocco.morrow.v2'))||{};}catch{}
 const state=createHarvestState(saved), anchors=[], skins=[];
 function save(){try{localStorage.setItem('sirocco.morrow.v2',JSON.stringify(state.snapshot()));document.querySelector('#save-status').textContent='SHIFT SAVED ON THIS BROWSER';}catch{document.querySelector('#save-status').textContent='STORAGE UNAVAILABLE · SESSION ONLY';}}
 addEventListener('pagehide',save);document.addEventListener('visibilitychange',()=>{if(document.hidden)save();});
 for(const a of [-5*Math.PI/12,0,5*Math.PI/12]){
  const anchor=new THREE.Group();anchor.position.set(Math.cos(a)*2.9,1.12,-Math.sin(a)*2.9);root.add(anchor);anchors.push(anchor);
  const skin=balloon.clone(true);anchor.add(skin);skins.push(skin);
 }
 const pump=document.querySelector('#pump'),status=document.querySelector('#harvest-status'),meter=document.querySelector('#harvest-fill'),percent=document.querySelector('#harvest-percent'),delivered=document.querySelector('#delivered');
 const stepButtons=[...document.querySelectorAll('[data-step]')];
 const sound=createMachineryAudio({state,root,camera});
 function act(step){if(step!==state.step)return;state.toggle();void sound.arm();save();}
 function setRate(v){state.setRate(v);document.querySelector('#pump-rate').value=String(state.rate);document.querySelector('#pump-rate-value').textContent=state.rate.toFixed(1)+'×';save();}
 pump.onclick=()=>act(state.step);stepButtons.forEach((b,i)=>b.onclick=()=>act(i));
 document.querySelector('#pump-rate').oninput=e=>setRate(e.target.value);document.querySelector('#pump-rate').value=String(state.rate);document.querySelector('#pump-rate-value').textContent=state.rate.toFixed(1)+'×';
 const cockpit=createControlRoom({root,model:roomModel,state,act,setRate});
 function attachFlights(){root.updateMatrixWorld(true);for(const f of state.flights.filter(f=>!f.mesh)){f.mesh=balloon.clone(true);f.mesh.scale.setScalar(.34);f.start=anchors[f.slot].getWorldPosition(new THREE.Vector3());f.mesh.position.copy(f.start);scene.add(f.mesh);}}
 attachFlights();save();
 const glow=new THREE.Mesh(new THREE.TorusGeometry(1.36,.028,6,64),new THREE.MeshBasicMaterial({color:'#c1fbe3',transparent:true,opacity:.2,depthWrite:false}));glow.rotation.x=Math.PI/2;glow.position.y=.045;root.add(glow);
 const rings=new THREE.Group();root.add(rings);for(let i=0;i<3;i++){const m=new THREE.Mesh(new THREE.TorusGeometry(.6+i*.23,.016,4,48),glow.material);m.rotation.x=Math.PI/2;m.position.y=.015;rings.add(m);}
 let lastWave=-10,lastText='',lastSave=0,lastUI=-1;let priorStep=state.step,priorDelivered=state.delivered;
 return {root,state,cockpit,sound,update(dt,time,airship){
  for(const f of state.tick(dt))scene.remove(f.mesh);attachFlights();if(time-lastSave>5||state.step!==priorStep||state.delivered!==priorDelivered){save();lastSave=time;priorStep=state.step;priorDelivered=state.delivered;}cockpit.update();sound.update();
  if(!reduced){root.position.y=.09+Math.sin(time*1.3)*.018;root.rotation.z=Math.sin(time*.7)*.007;root.rotation.x=Math.sin(time*.9)*.006;}
  skins.forEach((m,i)=>{m.scale.set(.48+state.fill*.52,.17+state.fill*.83,.48+state.fill*.52);m.rotation.z=reduced?0:Math.sin(time*1.8+i)*.015*state.fill;});
  glow.material.opacity=state.pumping?.5+Math.sin(time*5)*.2:.15;
  rings.scale.setScalar(state.pumping?.9+Math.sin(time*3)*.09:1);
  if(state.pumping&&time-lastWave>.65){emitWave(root.position.x,root.position.z,.09);lastWave=time;}
  for(const f of state.flights){if(!f.mesh)continue;const t=Math.max(0,f.age)/f.duration;const lift=Math.min(1,t/.23);const travel=THREE.MathUtils.smoothstep(t,.18,1);f.mesh.position.lerpVectors(f.start,airship.position,travel);f.mesh.position.y+=Math.sin(lift*Math.PI/2)*4.2*(1-travel);f.mesh.position.x+=Math.sin(t*Math.PI)*(.7+f.slot*.6);f.mesh.rotation.z=Math.sin(time*1.2+f.slot)*.045;f.mesh.scale.setScalar(.34*(1-THREE.MathUtils.smoothstep(t,.92,1)*.8));}
  if(time-lastUI<.2)return;lastUI=time;
  const n=Math.round(state.fill*100);meter.value=n;percent.textContent=n+'%';delivered.textContent=String(state.delivered);
  const full=state.delivered===QUOTA;const waiting=state.remaining===0&&!full;
  pump.textContent=full?'Quota fulfilled':waiting?'Awaiting final deliveries':state.running?'Pause operation':state.elapsed>0?'Resume operation':STEPS[state.step].label;pump.disabled=!state.running&&!state.canRun;
  stepButtons.forEach((b,i)=>{b.disabled=i!==state.step||!state.canRun;b.classList.toggle('current',i===state.step&&!full);b.classList.toggle('complete',i<state.step||full);b.setAttribute('aria-current',i===state.step?'step':'false');});
  const duration=STEPS[state.step].seconds;document.querySelector('#operation-progress').value=state.elapsed/duration*100;
  document.querySelector('#operation-clock').textContent=full?'SHIFT COMPLETE':`${String(state.step+1).padStart(2,'0')} / 05 · ${Math.ceil((duration-state.elapsed)/(state.step===2?state.rate:1))}s ${state.running?'remaining':'on start'}`;
  document.querySelector('#flight-status').textContent=`${state.flights.length} in transit`;
  const text=full?'The airship is full. Shift complete.':waiting?'Final consignment en route · awaiting receipt':state.running?STEPS[state.step].detail:state.elapsed>0?'Operation paused · pressure held':`Awaiting operator · ${STEPS[state.step].label.toLowerCase()}`;if(text!==lastText){status.textContent=text;lastText=text;}
 }};
}
