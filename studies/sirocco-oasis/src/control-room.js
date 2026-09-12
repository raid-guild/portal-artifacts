import * as THREE from 'three';
import {STEPS,QUOTA} from './harvest-state.js';
import {createShipRadio} from './ship-radio.js';
export function createControlRoom({root,model,state,act,setRate}){
 const room=new THREE.Group();room.position.set(-2.05,.82,0);room.rotation.y=-Math.PI/2;root.add(room);room.visible=false;
 const interior=model.clone(true);interior.rotation.y=Math.PI;room.add(interior);
 const radio=createShipRadio(),targets=[],buttons=[],labels=[];
 const cream=new THREE.MeshToonMaterial({color:'#dfc493'}),iron=new THREE.MeshToonMaterial({color:'#284653'});
 function screen(w,h,x,y,z,width=768,height=192){const c=document.createElement('canvas');c.width=width;c.height=height;const tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tx}));mesh.position.set(x,y,z);room.add(mesh);return {mesh,c,ctx:c.getContext('2d'),tx};}
 function print(s,lines,color='#e4c992'){const c=s.ctx;c.fillStyle='#1b3035';c.fillRect(0,0,s.c.width,s.c.height);c.textAlign='center';c.fillStyle=color;lines.forEach((t,i)=>{c.font=(lines.length===1?'bold 54':'34')+'px monospace';c.fillText(t,s.c.width/2,(i+.8)*s.c.height/lines.length);});s.tx.needsUpdate=true;}
 for(let i=0;i<5;i++){const x=(i-2)*.31;const m=new THREE.Mesh(new THREE.CylinderGeometry(.078,.086,.045,24),cream.clone());m.rotation.x=Math.PI/2;m.position.set(x,.87,.33);room.add(m);buttons.push(m);targets.push({mesh:m,run:()=>act(i)});const label=screen(.28,.085,x,1.015,.293);print(label,[`0${i+1} ${STEPS[i].machine}`]);labels.push(label);}
 const readout=screen(.89,.19,-.22,1.26,.13);const rateLabel=screen(.39,.065,-.46,.56,.3);const stopLabel=screen(.4,.075,.19,.57,.3);print(stopLabel,['PAUSE / RESUME']);
 const rate=new THREE.Mesh(new THREE.CylinderGeometry(.08,.085,.06,24),cream);rate.rotation.x=Math.PI/2;rate.position.set(-.46,.71,.34);room.add(rate);targets.push({mesh:rate,run:()=>setRate(state.rate>=1.5?.5:Math.round((state.rate+.1)*10)/10)});
 const needle=new THREE.Mesh(new THREE.BoxGeometry(.014,.055,.007),iron);needle.position.set(0,.025,.036);const pivot=new THREE.Group();pivot.position.set(-.46,.71,.373);pivot.add(needle);room.add(pivot);
 const stop=new THREE.Mesh(new THREE.BoxGeometry(.15,.08,.05),new THREE.MeshToonMaterial({color:'#aa6854'}));stop.position.set(.19,.72,.33);room.add(stop);targets.push({mesh:stop,run:()=>act(state.step)});
 const radioFace=screen(.29,.20,.52,1.25,.146,512,320);targets.push({mesh:radioFace.mesh,run:hit=>{if(hit.uv.y>.35)radio.tune();else radio.adjust(hit.uv.x<.5?-10:10);}});
 let view='vista',signature='';
 function hit(ray){const candidates=view==='room'?targets:[];const hits=ray.intersectObjects(candidates.map(t=>t.mesh));if(!hits.length)return false;const h=hits[0];candidates.find(t=>t.mesh===h.object).run(h);return true;}
 return {room,radio,hit,setView(v,transition=false){view=v;room.visible=v==='room';root.traverse(o=>{if(o.userData.cabinShell)o.visible=v!=='room'&&!transition;});radio.setInside(v==='room');},pose(){root.updateMatrixWorld(true);const mobile=innerWidth<700;return {position:room.localToWorld(new THREE.Vector3(0,1.46,mobile?3.1:2.1)),target:room.localToWorld(new THREE.Vector3(0,mobile?1.18:1.10,0))};},update(){
  for(let i=0;i<5;i++){const active=i===state.step&&state.canRun;buttons[i].material.color.set(active?'#b5edd6':i<state.step?'#7ba399':'#8e846a');buttons[i].position.z=state.running&&active?.307:.33;}
  pivot.rotation.z=-(state.rate-.5)*Math.PI*1.5;
  const sig=[state.step,state.running,Math.floor(state.elapsed),Math.round(state.fill*100),state.rate,state.delivered,radio.text,radio.volume].join('|');if(sig===signature)return;signature=sig;
  print(readout,[state.delivered===QUOTA?'AIRSHIP RESERVES COMPLETE':`0${state.step+1} / ${STEPS[state.step].machine} ${state.running?'ACTIVE':'AWAITING'}`,`${String(state.delivered).padStart(4,'0')} / 1000  ·  WATER ${Math.round(state.fill*100)}%`],'#b9efce');
  print(rateLabel,[`RATE ${state.rate.toFixed(1)}x`]);print(radioFace,[radio.text.replace(' · ',' / '),radio.volume?`−  VOL ${radio.volume}  +`:'−     OFF     +']);
 }};
}
