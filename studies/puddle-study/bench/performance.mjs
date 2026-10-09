import {performance} from 'node:perf_hooks';
import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
import * as THREE from 'three';
import {PuddleSimulation,DT} from '../src/simulation.js';
import {createParticleSurface} from '../src/particle-surface.js';
import {ParticleFluid} from '../src/particle-fluid.js';
import {PASSAGE_GARDEN,gardenColliders} from '../src/garden-level.js';

const frames=45;
const fullMask=process.argv.includes('--full-mask');
const surface=material=>createParticleSurface(material,48,{filterColliders:!fullMask});
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
  const material=new THREE.MeshBasicMaterial(),body=surface(material);
  const ids=[...new Set(sim.fluid.particles.filter(p=>p.feedstock&&p.patchId!==undefined).map(p=>p.patchId))];
  const supply=ids.map(id=>({id,surface:surface(material)}));
  if(sim.selectedTest==='pressure')supply.push({id:null,surface:surface(material)});
  const shed=sim.selectedTest==='garden'&&sim.gardenLevel.gate?surface(material):null;
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
function shedSurfaceLoad(scattered){
  const sim=new PuddleSimulation();sim.startGarden(6);
  const colliders=sim.activeColliders(),material=new THREE.MeshBasicMaterial();
  const body=surface(material),shed=surface(material),particles=Array.from({length:297},(_,i)=>{
    const angle=i*2.399963229728653,r=scattered?.3+Math.sqrt(i/297)*7:.11+Math.sqrt(i/297)*.55;
    return {x:(scattered?0:6.8)+Math.cos(angle)*r,
      y:scattered?.14+(i%11)*.08:5.8+(i%11)*.065,
      z:(scattered?0:-4.5)+Math.sin(angle)*r};
  });
  const bodyTimes=[],shedTimes=[];
  for(let frame=0;frame<18;frame++){
    for(const p of particles)p.x+=.001;
    let start=performance.now();body.update(particles.slice(0,221),colliders,sim.fluid.radius);
    bodyTimes.push(performance.now()-start);
    start=performance.now();shed.update(particles.slice(221),colliders,sim.fluid.radius);
    shedTimes.push(performance.now()-start);
  }
  const result={body:summary(bodyTimes),shed:summary(shedTimes),particleCount:particles.length,
    shedCount:76,surfaceHashes:[hashSurface(body),hashSurface(shed)]};
  body.mesh.geometry.dispose();shed.mesh.geometry.dispose();return result;
}
const result={field:run('field'),pressure:run('pressure'),garden1:run('garden1'),garden3:run('garden3'),
  passage:passage(),denseShed:shedSurfaceLoad(false),scatteredShed:shedSurfaceLoad(true)};
const option=process.argv.find(arg=>arg==='--save'||arg==='--compare');
const file=option&&process.argv[process.argv.indexOf(option)+1];
if(option==='--save')writeFileSync(file,JSON.stringify(result));
if(option==='--compare'){
  const old=JSON.parse(readFileSync(file,'utf8'));
  for(const key of Object.keys(result)){
    if(!old[key])continue;
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
  body:value.body,shed:value.shed,attached:value.attached,coat:value.coat,shedCount:value.shedCount}));
