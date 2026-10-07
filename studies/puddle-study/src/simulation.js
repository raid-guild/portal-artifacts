import {ParticleFluid} from './particle-fluid.js';
import {GAP,GAP_COLLIDERS,TERRACE_BOUNDARY} from './colliders.js';

export const DT=1/60;
export const GROWTH={startX:-2.4,spoutX:2.4,spoutZ:0,spoutY:1.3,seedCount:17,capacity:297,interval:.5,perDrip:4,goal:120};
export const PUDDLE_FIELD={startX:-6.4,startZ:0,seedCount:17,capacity:297,
  patches:[[-4.6,-2.7],[-4.6,0],[-4.6,2.7],[-1.05,-2.7],[-1.05,0],[-1.05,2.7],
    [2.5,-2.7],[2.5,0],[2.5,2.7],[6.05,-2.7],[6.05,0],[6.05,2.7]]};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

export class PuddleSimulation {
  constructor({size=1}={}){this.selectedTest='puddle';this.reset(size);}
  get body(){return this.fluid.centroid();}
  get brain(){return this.fluid.brain;}
  reset(size=this.size){
    this.size=size;
    const x=this.selectedTest==='field'?PUDDLE_FIELD.startX:this.selectedTest==='growth'?GROWTH.startX:
      this.selectedTest==='gap'?-2.1*size:0;
    const supply=this.selectedTest==='field'?PUDDLE_FIELD:this.selectedTest==='growth'?GROWTH:null;
    this.fluid=new ParticleFluid({x,z:0,size,
      ...(supply?{seedCount:supply.seedCount,massReferenceCount:supply.capacity}:{})});
    this.growth={elapsed:0,emitted:0,absorbed:0,complete:false};
    this.field={absorbed:0,loose:PUDDLE_FIELD.capacity-PUDDLE_FIELD.seedCount};
    this.oozeForward=false;this.materialState='oozing';this.relaxTime=0;
    this.fleshThrough=0;this.brainThrough=false;this.gapStage='approach';
    if(this.selectedTest==='field')this.seedField();
  }
  selectTest(test){if(!['field','growth','gap','puddle'].includes(test))return false;
    this.selectedTest=test;this.reset(test==='gap'?this.size:1);return true;}
  seedField(){
    PUDDLE_FIELD.patches.forEach(([x,z],patchId)=>{
      const count=23+(patchId<4?1:0);
      for(let i=0;i<count;i++){
        const ring=i===0?0:i<=8?1:2,index=ring===1?i-1:i-9,slots=ring===1?8:count-9;
        const angle=ring===0?0:2*Math.PI*(index+(ring===2?.25:0))/slots;
        const radius=ring===0?0:ring===1?.18:.37;
        const p=this.fluid.addParticle({x:x+Math.cos(angle)*radius,
          y:this.fluid.radius+.013,z:z+Math.sin(angle)*radius},{feedstock:true});
        p.patchId=patchId;
      }
    });
    this.fluid.samplePairs();this.fluid.updateComponents(this.activeColliders());
  }
  emitGrowth(dt){
    if(this.selectedTest!=='growth'||this.growth.emitted>=GROWTH.capacity-GROWTH.seedCount)return;
    this.growth.elapsed+=dt;
    while(this.growth.elapsed>=GROWTH.interval&&this.growth.emitted<GROWTH.capacity-GROWTH.seedCount){
      this.growth.elapsed-=GROWTH.interval;
      for(let i=0;i<GROWTH.perDrip&&this.growth.emitted<GROWTH.capacity-GROWTH.seedCount;i++){
        const n=this.growth.emitted++,a=n*2.39996323;
        this.fluid.addParticle({x:GROWTH.spoutX+Math.cos(a)*(.035+.034*(n%3)),
          y:GROWTH.spoutY+(i%2)*.12,z:GROWTH.spoutZ+Math.sin(a)*(.035+.034*(n%3))},{feedstock:true});
      }
    }
  }
  activeColliders(){return this.selectedTest==='gap'?[TERRACE_BOUNDARY,...GAP_COLLIDERS]:[TERRACE_BOUNDARY];}
  step(input={},dt=DT){
    if(!(dt>0))return this;
    dt=clamp(dt,0,DT);
    const colliders=this.activeColliders();
    const source=this.selectedTest==='gap'&&this.oozeForward?{x:1,z:0}:input;
    const speed=Math.hypot(source.x||0,source.z||0);
    this.emitGrowth(dt);
    if(input.contract){this.materialState='contracting';this.relaxTime=1.5;}
    else if(this.relaxTime>0){this.relaxTime=Math.max(0,this.relaxTime-dt);this.materialState='relaxing';}
    else this.materialState='oozing';
    this.fluid.step(dt,{x:speed?(source.x||0)/speed:0,z:speed?(source.z||0)/speed:0,
      push:!!input.push,puddle:true,growth:this.selectedTest!=='gap',contract:!!input.contract},colliders);
    if(this.selectedTest==='growth'){
      this.growth.absorbed=Math.max(0,this.fluid.attachedCount-(GROWTH.seedCount-1));
      this.growth.complete=this.fluid.attachedCount>=GROWTH.goal;
    }
    if(this.selectedTest==='field'){
      this.field.absorbed=Math.max(0,this.fluid.attachedCount-(PUDDLE_FIELD.seedCount-1));
      this.field.loose=this.fluid.particles.filter(p=>p.feedstock).length;
    }
    if(this.selectedTest==='gap'){
      const exit=GAP.roof.maxX+this.fluid.radius+.04;
      this.brainThrough=this.brain.x>exit;
      this.fleshThrough=this.fluid.particles.filter((p,i)=>i!==this.fluid.brainIndex&&p.x>exit).length/
        Math.max(1,this.fluid.particles.length-1);
      this.gapStage=this.brainThrough&&this.fleshThrough>=.9?'through':this.brain.x>GAP.roof.minX-this.fluid.radius?'under':'approach';
      if(this.gapStage==='through')this.oozeForward=false;
    }
    return this;
  }
}
