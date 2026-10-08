import * as THREE from 'three';
import {GARDEN_LEVELS,arrivalPosition,drainPosition} from './garden-level.js';

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const AZIMUTH=Math.hypot(5,26);
export const GARDEN_FORWARD=Object.freeze({x:-5/AZIMUTH,z:-26/AZIMUTH});
export const GARDEN_RIGHT=Object.freeze({x:26/AZIMUTH,z:-5/AZIMUTH});
const DOWN_ANGLE=55*Math.PI/180;

// Fixed world-space input basis: toggling or easing the camera cannot rotate
// an already-held movement direction.
export function gardenMovementBasis(){return {right:GARDEN_RIGHT,forward:GARDEN_FORWARD};}
export function cameraShortcutAction(event,selectedTest){
  if(selectedTest!=='garden'||event.code!=='KeyC'||
    event.target?.closest?.('input,select,textarea,[contenteditable="true"]'))return null;
  return event.repeat?'ignore':'toggle';
}
export function cameraPointVisible(projected,margin=.96){
  return Number.isFinite(projected.x+projected.y+projected.z)&&
    projected.z>=-1&&projected.z<=1&&Math.abs(projected.x)<margin&&Math.abs(projected.y)<margin;
}

export function sampleGardenCameraFrame(sim){
  const fluid=sim.fluid,brain=fluid.brain,level=sim.gardenLevel,phase=sim.garden.phase;
  const worldY=-(sim.gardenLevelId-1)*7.2;
  const presented=(p,index)=>phase==='arriving'?arrivalPosition(p,index,sim.garden.arrivalTime,level,fluid.coatIndices):
    phase==='draining'?drainPosition(p,sim.garden.drainTime,level):p;
  const shownBrain=presented(brain,fluid.brainIndex);
  const body={x:0,y:0,z:0,count:0};
  let horizontal=0,vertical=0;
  // One traversal computes the living connected centroid and bounds. Tendril
  // members and cargo affect framing even before they join that component.
  for(let i=0;i<fluid.particles.length;i++){
    const p=fluid.particles[i],connected=!p.feedstock&&p.component===brain.component;
    const strand=sim.tendril?.strands?.some(s=>s.active&&(s.members.has(i)||s.cargo.has(p)))||false;
    if(!connected&&!strand)continue;
    const q=presented(p,i),y=q.y+worldY;
    if(connected){body.x+=q.x;body.y+=y;body.z+=q.z;body.count++;}
    horizontal=Math.max(horizontal,Math.hypot(q.x-shownBrain.x,q.z-shownBrain.z));
    vertical=Math.max(vertical,Math.abs(y-shownBrain.y-worldY));
  }
  const count=Math.max(1,body.count),centroid={x:body.count?body.x/count:shownBrain.x,
    y:body.count?body.y/count:shownBrain.y+worldY,z:body.count?body.z/count:shownBrain.z};
  const acceptedSpeed=Math.hypot(brain.vx||0,brain.vz||0),lead=acceptedSpeed?Math.min(1.2,acceptedSpeed*.28)/acceptedSpeed:0;
  const target={x:shownBrain.x*.65+centroid.x*.35+(brain.vx||0)*lead,
    y:(shownBrain.y+worldY)*.65+centroid.y*.35,
    z:shownBrain.z*.65+centroid.z*.35+(brain.vz||0)*lead};
  // The next garden may start across the tower from this exit. During the
  // visible drain, ease the aim halfway toward that arrival and fit both
  // endpoints. This gives the follow camera time to widen before Continue,
  // preserving its state without an arrival-time position snap.
  let futureDistance=0;
  const next=sim.isLocalGarden?null:GARDEN_LEVELS[sim.gardenLevelId];
  if(next&&(phase==='draining'||phase==='complete')){
    const transfer=phase==='complete'?1:clamp((sim.garden.drainTime-1.45)/1.35,0,1);
    target.x+=(next.start.x-target.x)*.5*transfer;
    target.z+=(next.start.z-target.z)*.5*transfer;
    futureDistance=Math.hypot(next.start.x-target.x,next.start.z-target.z)*transfer+fluid.size*.25;
  }
  // The one-pass extent is brain-relative. The weighted centroid and accepted
  // velocity can put the camera aim ahead of the brain, so include that shift
  // conservatively before fitting the actual projected body and cargo.
  horizontal+=Math.hypot(target.x-shownBrain.x,target.z-shownBrain.z);
  vertical+=Math.abs(target.y-shownBrain.y-worldY);
  horizontal=Math.max(horizontal,futureDistance);
  return {target,brain:{x:shownBrain.x,y:shownBrain.y+worldY,z:shownBrain.z},
    centroid,extent:{horizontal:horizontal+fluid.size*.25,vertical:vertical+fluid.size*.25},
    connectedCount:body.count,worldY,phase};
}

export function followFitDistance(extent,aspect,phase='playing',descending=false){
  const safeAspect=Math.max(.35,aspect),halfAngle=Math.tan(20*Math.PI/180);
  const portrait=15*Math.max(1,Math.sqrt(.78/safeAspect));
  const width=extent.horizontal/(halfAngle*safeAspect*.72);
  const height=(extent.horizontal*Math.sin(DOWN_ANGLE)+extent.vertical*Math.cos(DOWN_ANGLE))/
    (halfAngle*.68);
  const strandRoom=15+Math.max(0,extent.horizontal-2)*1.5;
  const base=Math.max(15,portrait,width,height,strandRoom);
  const phaseScale=phase==='complete'?1.28:phase==='draining'?1.2:
    phase==='arriving'&&descending?1.16:phase==='arriving'?1.08:phase==='settling'?1.04:1;
  return clamp(base*phaseScale,14,96);
}

export class FollowGardenCamera{
  constructor(camera=new THREE.PerspectiveCamera(40,1,.1,160)){
    this.camera=camera;this.target=new THREE.Vector3();this.distance=15;this.initialized=false;
  }
  resize(aspect){this.camera.aspect=Math.max(.35,aspect);this.camera.updateProjectionMatrix();}
  place(){
    const horizontal=this.distance*Math.cos(DOWN_ANGLE),vertical=this.distance*Math.sin(DOWN_ANGLE);
    this.camera.position.set(this.target.x-GARDEN_FORWARD.x*horizontal,
      this.target.y+vertical,this.target.z-GARDEN_FORWARD.z*horizontal);
    this.camera.lookAt(this.target);this.camera.updateMatrixWorld(true);
    return this.camera;
  }
  reset(sim,aspect=this.camera.aspect){
    this.resize(aspect);
    const sample=sampleGardenCameraFrame(sim);
    this.target.set(sample.target.x,sample.target.y,sample.target.z);
    this.distance=followFitDistance(sample.extent,aspect,sample.phase,sim.descending);
    this.initialized=true;return this.place();
  }
  update(sim,dt,aspect=this.camera.aspect){
    this.resize(aspect);
    if(!this.initialized)return this.reset(sim,aspect);
    if(sim.garden.phase==='paused')return this.camera;
    const sample=sampleGardenCameraFrame(sim),goal=sample.target;
    const xy=1-Math.exp(-Math.max(0,dt)/.22),up=1-Math.exp(-Math.max(0,dt)/.12);
    this.target.x+=(goal.x-this.target.x)*xy;
    this.target.z+=(goal.z-this.target.z)*xy;
    this.target.y+=(goal.y-this.target.y)*up;
    const desired=followFitDistance({
      horizontal:sample.extent.horizontal+Math.hypot(goal.x-this.target.x,goal.z-this.target.z),
      vertical:sample.extent.vertical+Math.abs(goal.y-this.target.y),
    },aspect,sample.phase,sim.descending);
    const span=desired>this.distance?.15:.7;
    this.distance+=(desired-this.distance)*(1-Math.exp(-Math.max(0,dt)/span));
    return this.place();
  }
}
