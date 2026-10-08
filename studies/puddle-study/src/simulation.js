import {GARDEN,GARDEN_LEVELS,createGarden,seedGarden,gardenColliders,gardenCanCast,updateGarden} from './garden-level.js';
import {TendrilGroup} from './tendril.js';
import {ParticleFluid} from './particle-fluid.js';
import {GAP,GAP_COLLIDERS,TERRACE_BOUNDARY,FUNNEL,groundAt} from './colliders.js';

export const DT=1/60;
export const GROWTH={startX:-2.4,spoutX:2.4,spoutZ:0,spoutY:1.3,seedCount:17,capacity:297,interval:.5,perDrip:4,goal:120};
export const PUDDLE_FIELD={startX:-6.4,startZ:0,seedCount:17,capacity:297,
  patches:[[-4.6,-2.7],[-4.6,0],[-4.6,2.7],[-1.05,-2.7],[-1.05,0],[-1.05,2.7],
    [2.5,-2.7],[2.5,0],[2.5,2.7],[6.05,-2.7],[6.05,0],[6.05,2.7]]};
export const PRESSURE={startX:-4.8,rate:42,threshold:48,releaseThreshold:36,
  gateX:1.5,gateWidth:.42,gateHeight:1.3,opening:.58};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

export class PuddleSimulation {
  constructor({size=1}={}){this.selectedTest='puddle';this.gardenLevelId=1;this.completedLevels={};this.practiceLevel=false;this.reset(size);}
  get body(){return this.fluid.centroid();}
  get brain(){return this.fluid.brain;}
  get gardenLevel(){return this.localRun?.level||GARDEN_LEVELS[this.gardenLevelId-1]||null;}
  get isLocalGarden(){return !!this.localRun;}
  startGarden(levelId=1,{newGame=false,practice=false}={}){
    if(!Number.isInteger(levelId)||!GARDEN_LEVELS[levelId-1])return false;
    this.localRun=null;
    if(newGame){this.completedLevels={};this.practiceLevel=practice;}
    this.selectedTest='garden';this.gardenLevelId=levelId;this.descending=false;this.reset(1);
    this.gardenInputArmed=false;
    this.garden.phase='arriving';this.garden.arrivalTime=0;
    return true;
  }
  startLocalGarden(level,{id,revision}={}){
    if(!level?.start||!level?.exit||!id||!Number.isInteger(revision)||revision<1)return false;
    this.localRun={id,revision,level};this.selectedTest='garden';this.gardenLevelId=1;
    this.practiceLevel=false;this.descending=false;this.reset(1);
    this.gardenInputArmed=false;this.garden.phase='arriving';this.garden.arrivalTime=0;return true;
  }
  restartGarden(){if(this.localRun)return this.startLocalGarden(this.localRun.level,this.localRun);
    return this.startGarden(this.gardenLevelId);}
  continueGarden(){if(this.localRun||this.gardenLevelId>=GARDEN_LEVELS.length||this.garden.phase!=='complete')return false;
    const next=this.gardenLevelId+1;
    this.completedLevels[this.gardenLevelId]={gems:this.garden.gemCount,gold:this.garden.goldCount,totalGold:this.garden.gold.length};
    this.startGarden(next);this.descending=true;return true;}
  reset(size=this.size){
    this.size=size;
    this.gardenInputArmed=true;
    const x=this.selectedTest==='garden'?this.gardenLevel.start.x:this.selectedTest==='field'?PUDDLE_FIELD.startX:this.selectedTest==='growth'?GROWTH.startX:
      this.selectedTest==='pressure'?PRESSURE.startX:this.selectedTest==='gap'?-2.1*size:0;
    const supply=this.selectedTest==='garden'?this.gardenLevel:this.selectedTest==='field'?PUDDLE_FIELD:this.selectedTest==='growth'?GROWTH:null;
    this.fluid=new ParticleFluid({x,z:this.selectedTest==='garden'?this.gardenLevel.start.z:0,size,
      ...(supply?{seedCount:supply.seedCount,massReferenceCount:supply.capacity}:{})});
    this.tendril=new TendrilGroup(this.fluid);
    this.gardenTendrilUsed=false;
    this.growth={elapsed:0,emitted:0,absorbed:0,complete:false};
    this.field={absorbed:0,loose:PUDDLE_FIELD.capacity-PUDDLE_FIELD.seedCount};
    this.pressure={shed:0,credit:0,weight:0,active:false,opening:0,complete:false};
    this.oozeForward=false;this.materialState='oozing';this.relaxTime=0;
    this.fleshThrough=0;this.brainThrough=false;this.gapStage='approach';
    if(this.selectedTest==='field')this.seedField();
    if(this.selectedTest==='garden'){this.garden=createGarden(this.gardenLevel);seedGarden(this.fluid,this.gardenLevel);}
  }
  selectTest(test){if(!['field','growth','gap','pressure','puddle','garden'].includes(test))return false;
    this.retrievalSetup=false;this.selectedTest=test;this.reset(test==='gap'?this.size:1);return true;}
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
  setupRetrieval(){
    this.selectTest('pressure');
    const f=this.fluid,dx=2.6-f.brain.x;
    for(const p of f.particles){p.x+=dx;p.px=p.x;}
    const supply=f.particles.map((p,i)=>({p,i})).filter(({i})=>i!==f.brainIndex&&!f.coatIndices.includes(i))
      .sort((a,b)=>Math.hypot(b.p.x-f.brain.x,b.p.z)-Math.hypot(a.p.x-f.brain.x,a.p.z)).slice(0,145);
    supply.forEach(({p},i)=>{
      const a=i*2.39996323,r=.5*Math.sqrt((i%49)/48);
      p.x=FUNNEL.x+Math.cos(a)*r;p.z=FUNNEL.z+Math.sin(a)*r;p.y=-FUNNEL.depth+f.radius+.02+Math.floor(i/49)*.13;
      p.px=p.x;p.py=p.y;p.pz=p.z;p.vx=p.vy=p.vz=0;p.feedstock=true;
    });
    f.samplePairs();f.updateComponents(this.activeColliders());this.updatePressure(1);this.retrievalSetup=true;
  }
  castTendril(aim){
    if(!aim||!(this.selectedTest==='pressure'||this.selectedTest==='garden'&&gardenCanCast(this.gardenLevel)&&
      this.garden.phase==='playing'&&this.gardenInputArmed))return false;
    const cast=this.tendril.cast(aim,this.activeColliders());
    if(cast&&this.selectedTest==='garden')this.gardenTendrilUsed=true;
    return cast;
  }
  shed(dt){
    const cfg=this.selectedTest==='garden'?this.gardenLevel.gate||PRESSURE:PRESSURE;
    this.pressure.credit+=dt*cfg.rate;
    const f=this.fluid,b=f.brain;
    const candidates=f.particles.map((p,i)=>({p,i})).filter(({p,i})=>
      i!==f.brainIndex&&!f.coatIndices.includes(i)&&!p.feedstock&&p.component===b.component)
      // Release the low, outer flesh first, wherever the player stands.
      .sort((a,c)=>(a.p.y-Math.hypot(a.p.x-b.x,a.p.z-b.z)*.35)-
        (c.p.y-Math.hypot(c.p.x-b.x,c.p.z-b.z)*.35));
    const count=Math.min(Math.floor(this.pressure.credit),candidates.length);
    for(let i=0;i<count;i++){
      const p=candidates[i].p;p.feedstock=true;p.shedLocked=true;p.shedAt=f.time;
      delete p.patchId;this.pressure.shed++;
    }
    this.pressure.credit-=count;
    if(!candidates.length)this.pressure.credit=0;
  }
  updatePressure(dt){
    const state=this.pressure,r=this.fluid.radius,cfg=this.selectedTest==='garden'?this.gardenLevel.gate:PRESSURE,
      basin=this.selectedTest==='garden'?this.gardenLevel.basin:FUNNEL;
    const plateHeight=groundAt(basin.x,basin.z,this.activeColliders()).height;
    state.weight=this.fluid.particles.filter(p=>
      (this.selectedTest!=='garden'||p.feedstock&&p.shedAt!==undefined)&&
      Math.hypot(p.x-basin.x,p.z-basin.z)<basin.bottomRadius+.04&&
      p.y<plateHeight+r+.23).length;
    if(state.weight>=cfg.threshold)state.active=true;
    else if(state.weight<cfg.releaseThreshold)state.active=false;
    let target=state.active?cfg.opening:0;
    // Pause a closing gate while flesh occupies the passage.
    if(target<state.opening&&this.fluid.particles.some(p=>
      Math.abs(p.x-(cfg.gateX??cfg.x))<(cfg.gateWidth??cfg.width)/2+r+.05&&
      p.z>(cfg.minZ??-2.3)-r&&p.z<(cfg.maxZ??2.3)+r&&
      p.y+r>(cfg.base??0)+target&&p.y-r<(cfg.base??0)+state.opening))target=state.opening;
    state.opening+=clamp(target-state.opening,-dt*.65,dt*.65);
    state.complete=this.selectedTest==='garden'?this.brain.x>cfg.x+.8:this.brain.x>PRESSURE.gateX+.8;
  }
  activeColliders(){
    if(this.selectedTest==='garden')return gardenColliders(this.gardenLevel,this.pressure.opening);
    if(this.selectedTest==='pressure')return [TERRACE_BOUNDARY,FUNNEL,
      {type:'roof',minX:PRESSURE.gateX-PRESSURE.gateWidth/2,maxX:PRESSURE.gateX+PRESSURE.gateWidth/2,
        minZ:-2.3,maxZ:2.3,bottom:this.pressure.opening,top:this.pressure.opening+PRESSURE.gateHeight},
      ...[-1,1].map(sign=>({type:'box',minX:1.25,maxX:1.75,minY:0,maxY:1.3,
        minZ:sign<0?-4.3:2.3,maxZ:sign<0?-2.3:4.3}))];
    return this.selectedTest==='gap'?[TERRACE_BOUNDARY,...GAP_COLLIDERS]:[TERRACE_BOUNDARY];}
  step(input={},dt=DT){
    if(!(dt>0))return this;
    if(this.selectedTest==='garden'&&!['playing','draining','arriving','settling'].includes(this.garden.phase))return this;
    dt=clamp(dt,0,DT);
    if(this.selectedTest==='garden'&&this.garden.phase==='arriving'){updateGarden(this,dt);return this;}
    if(this.selectedTest==='garden'&&this.garden.phase==='draining'){updateGarden(this,dt);return this;}
    const settling=this.selectedTest==='garden'&&this.garden.phase==='settling';
    if(settling)input={};
    if(this.selectedTest==='garden'&&!settling&&!this.gardenInputArmed){
      if(input.x||input.z||input.contract||input.shed||input.push||input.recallToggle)input={};
      else this.gardenInputArmed=true;
    }
    const gatedGarden=this.selectedTest==='garden'&&!!this.gardenLevel.gate;
    const editorShed=this.selectedTest==='garden'&&!!this.gardenLevel.editorCanShed;
    const shedding=(this.selectedTest==='pressure'||gatedGarden||editorShed)&&!!input.shed;
    if(shedding){if(this.tendril.active)this.tendril.release('released');this.shed(dt);}else this.pressure.credit=0;
    if(input.recallToggle&&!shedding&&(this.selectedTest==='pressure'||this.selectedTest==='garden'&&gardenCanCast(this.gardenLevel)))this.tendril.toggleRecall();
    const contracting=!!input.contract&&!shedding;
    const colliders=this.activeColliders();
    const source=this.selectedTest==='gap'&&this.oozeForward?{x:1,z:0}:input;
    const speed=Math.hypot(source.x||0,source.z||0);
    this.tendril.prepare(dt,contracting,colliders,speed>0);
    this.emitGrowth(dt);
    if(contracting){this.materialState='contracting';this.relaxTime=1.5;}
    else if(this.relaxTime>0){this.relaxTime=Math.max(0,this.relaxTime-dt);this.materialState='relaxing';}
    else this.materialState='oozing';
    this.fluid.step(dt,{x:speed?(source.x||0)/speed:0,z:speed?(source.z||0)/speed:0,
      holdPosition:this.tendril.active?this.tendril.brainAnchor:null,push:!!input.push,shed:shedding,expireFragments:this.selectedTest==='pressure'||gatedGarden||editorShed||this.selectedTest==='garden'&&!!(this.gardenLevel.tendrils||this.gardenLevel.grip||this.gardenTendrilUsed),puddle:true,growth:this.selectedTest!=='gap',contract:contracting},colliders,this.tendril.active?{
        controls:i=>this.tendril.controls(i),forces:(p,i,h)=>this.tendril.forces(p,i,h),solve:()=>this.tendril.solve()}:{});
    this.tendril.finish(dt,colliders);
    if(this.selectedTest==='pressure'||gatedGarden)this.updatePressure(dt);
    if(shedding)this.materialState='shedding';
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
    if(this.selectedTest==='garden')updateGarden(this,dt);
    return this;
  }
}
