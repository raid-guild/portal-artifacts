import {groundAt} from './colliders.js';
import {floorPaintApplies} from './surface-paint.js';

// Called after physics and strand constraints, before pickups and the exit.
export function updateHazards(sim,dt,colliders=sim.activeColliders()){
  if(sim.garden?.phase!=='playing')return false;
  const fluid=sim.fluid,brain=fluid.brain,r=fluid.radius;
  // The renderer consumes only confirmed, post-grace burn sites. Reset every
  // physics step so contact that has ended cannot leave a stale heat flash.
  sim.garden.burnSites=[];
  const pits=colliders.filter(c=>c.type==='pit').map(pit=>({pit,
    rim:pit.rimHeight??groundAt(pit.x+pit.radius+.02,pit.z,colliders).height}));
  const lava=colliders.filter(c=>c.type==='lava');
  if(!pits.length&&!lava.length)return false;
  for(const {pit,rim} of pits){
    if(Math.hypot(brain.x-pit.x,brain.z-pit.z)<pit.radius&&brain.y<rim-1.6){
      sim.respawnGarden('pit');return true;
    }
  }
  const doomed=[],burning=[];
  for(let i=0;i<fluid.particles.length;i++){
    if(i===fluid.brainIndex)continue;
    const p=fluid.particles[i];
    const falling=pits.some(({pit,rim})=>Math.hypot(p.x-pit.x,p.z-pit.z)<pit.radius&&p.y<rim-1.6);
    if(falling){doomed.push(i);continue;}
    const contact=lava.some(c=>floorPaintApplies(c,p,r,colliders,fluid.size));
    p.burnTime=contact?(p.burnTime||0)+dt:0;
    if(!contact||p.burnTime<.2)continue;
    if(p.feedstock){
      if(sim.garden.burnSites.length<12)sim.garden.burnSites.push({x:p.x,y:p.y,z:p.z});
      doomed.push(i);continue;
    }
    burning.push(i);
  }
  if(burning.length){
    const stride=Math.max(1,Math.ceil(burning.length/12));
    for(let n=0;n<burning.length&&sim.garden.burnSites.length<12;n+=stride){
      const p=fluid.particles[burning[n]];
      sim.garden.burnSites.push({x:p.x,y:p.y,z:p.z});
    }
    sim.garden.burnCredit=(sim.garden.burnCredit||0)+dt*36;
    const ordinary=burning.filter(i=>!fluid.coatIndices.includes(i));
    const eligible=ordinary.length?ordinary:burning;
    const count=Math.min(eligible.length,Math.floor(sim.garden.burnCredit));
    doomed.push(...eligible.slice(0,count));sim.garden.burnCredit-=count;
  }else sim.garden.burnCredit=0;
  const heatRemoved=burning.some(i=>doomed.includes(i)&&fluid.particles[i].component===brain.component);
  if(doomed.length){const map=fluid.removeParticles(doomed,colliders);sim.tendril.remapParticles(map);}
  // Heat can strip the body down to its reserved coating while the core sits
  // just outside the painted edge. Such a remnant has negligible brain power
  // and cannot reliably reach fresh flesh. Finish that burn after a brief cue,
  // including if contact ends before the coating itself catches fire.
  if(heatRemoved&&fluid.attachedCount<=20)sim.garden.criticalBurnLatched=true;
  if(sim.garden.criticalBurnLatched&&fluid.attachedCount<=20){
    if(sim.garden.burnSites.length<12)sim.garden.burnSites.push({x:brain.x,y:brain.y,z:brain.z});
    sim.garden.criticalBurn=(sim.garden.criticalBurn||0)+dt;
    if(sim.garden.criticalBurn>=.35){sim.respawnGarden('lava');return true;}
  }else{sim.garden.criticalBurn=0;sim.garden.criticalBurnLatched=false;}
  const brainContact=lava.some(c=>floorPaintApplies(c,brain,r,colliders,fluid.size));
  const protectedCore=fluid.coatContacts(colliders).length>=4;
  sim.garden.coreBurn=brainContact&&!protectedCore?(sim.garden.coreBurn||0)+dt:0;
  if(sim.garden.coreBurn>=.35){sim.respawnGarden('lava');return true;}
  return false;
}
