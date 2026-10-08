import {performance} from 'node:perf_hooks';
import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
import * as THREE from 'three';
import {PuddleSimulation,DT} from '../src/simulation.js';
import {createParticleSurface} from '../src/particle-surface.js';
import {ParticleFluid} from '../src/particle-fluid.js';
import {PASSAGE_GARDEN,gardenColliders} from '../src/garden-level.js';

const frames=45;
const summary=a=>{const sorted=[...a].sort((x,y)=>x-y);return {mean:+(a.reduce((x,y)=>x+y,0)/a.length).toFixed(3),p95:+sorted[Math.min(sorted.length-1,Math.ceil(sorted.length*.95)-1)].toFixed(3)};};
const hashData=a=>createHash('sha256').update(Buffer.from(a.buffer,a.byteOffset,a.byteLength)).digest('hex');
const hashSurface=s=>({field:hashData(s.mesh.field),position:hashData(s.mesh.geometry.attributes.position.array),
  transform:[...s.mesh.position.toArray(),...s.mesh.scale.toArray()]});
function make(name){
  const sim=new PuddleSimulation();
  if(name==='field')sim.selectTest('field');
  else if(name==='pressure'){sim.setupRetrieval();}
  else {sim.startGarden(name==='garden3'?3:1);for(let i=0;i<100;i++)sim.step();}
  return sim;
}
function surfacesFor(sim){
  const material=new THREE.MeshBasicMaterial(),body=createParticleSurface(material,48);
  const ids=[...new Set(sim.fluid.particles.filter(p=>p.feedstock&&p.patchId!==undefined).map(p=>p.patchId))];
  const supply=ids.map(id=>({id,surface:createParticleSurface(material,48)}));
  if(sim.selectedTest==='pressure')supply.push({id:null,surface:createParticleSurface(material,48)});
  const shed=sim.selectedTest==='garden'&&sim.gardenLevel.gate?createParticleSurface(material,48):null;
  return {body,supply,shed};
}
function run(name){
  const sim=make(name),surfaces=surfacesFor(sim),physics=[],surface=[];
  for(let frame=0;frame<frames;frame++){
    const phase=frame%45,input={x:phase<25?1:-.4,z:Math.sin(frame*.11)*.55,
      contract:frame>=16&&frame<29,shed:name==='garden3'&&frame>=34&&frame<42};
    const start=performance.now();sim.step(input,DT);physics.push(performance.now()-start);
    if(frame%3===0){const begin=performance.now(),colliders=sim.activeColliders(),particles=sim.fluid.particles;
      surfaces.body.update(particles.filter(p=>!p.feedstock),colliders,sim.fluid.radius);
      for(const {id,surface:part} of surfaces.supply)part.update(particles.filter(p=>p.feedstock&&(id===null||p.patchId===id)),colliders,sim.fluid.radius);
      if(surfaces.shed)surfaces.shed.update(particles.filter(p=>p.feedstock&&p.patchId===undefined),colliders,sim.fluid.radius);
      surface.push(performance.now()-begin);
    }
  }
  const particles=sim.fluid.particles;
  const shedCount=particles.filter(p=>p.feedstock&&p.patchId===undefined).length;
  if(name==='garden3'&&shedCount===0)throw new Error('Level 3 benchmark did not exercise shed surface');
  return {physics:summary(physics),surface:summary(surface),trace:particles.map(p=>[p.x,p.y,p.z,p.vx,p.vy,p.vz,p.component,!!p.feedstock]),
    brainIndex:sim.fluid.brainIndex,attached:sim.fluid.attachedCount,pressure:{...sim.pressure},
    shedCount,surfaceHashes:[hashSurface(surfaces.body),...surfaces.supply.map(({surface:s})=>hashSurface(s)),
      ...(surfaces.shed?[hashSurface(surfaces.shed)]:[])]};
}
function passage(){
  const fluid=new ParticleFluid({x:3,z:3.55,size:1}),colliders=gardenColliders(PASSAGE_GARDEN,.58),physics=[];
  for(let i=0;i<220;i++){const start=performance.now();fluid.step(DT,{x:-1,z:0,contract:i>85&&i<115,puddle:true,growth:true},colliders);physics.push(performance.now()-start);}
  return {physics:summary(physics),trace:fluid.particles.map(p=>[p.x,p.y,p.z,p.vx,p.vy,p.vz,p.component,!!p.feedstock]),
    brainIndex:fluid.brainIndex,attached:fluid.attachedCount,coat:fluid.coatContacts(colliders).length};
}
const result={field:run('field'),pressure:run('pressure'),garden1:run('garden1'),garden3:run('garden3'),passage:passage()};
const option=process.argv[2],file=process.argv[3];
if(option==='--save')writeFileSync(file,JSON.stringify(result));
if(option==='--compare'){
  const old=JSON.parse(readFileSync(file,'utf8'));
  for(const key of Object.keys(result)){
    for(const prop of ['trace','brainIndex','attached','surfaceHashes','pressure','coat']){
      const before=old[key][prop],after=result[key][prop];
      const comparable=prop==='surfaceHashes'&&Array.isArray(before)&&before.length<after?.length?
        after.slice(0,before.length):after;
      if(before!==undefined&&JSON.stringify(before)!==JSON.stringify(comparable)){
        console.error(`DIFFERENCE ${key}.${prop}`);process.exitCode=1;
      }
    }
  }
}
for(const [key,value] of Object.entries(result))console.log(key,JSON.stringify({physics:value.physics,surface:value.surface,
  attached:value.attached,coat:value.coat,shedCount:value.shedCount}));
