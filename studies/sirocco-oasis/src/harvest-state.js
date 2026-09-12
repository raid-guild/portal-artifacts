export const QUOTA=1000;
export const STEPS=[
 {label:'Open intake',machine:'INTAKE',seconds:8,detail:'Opening sluice · equalizing lake pressure'},
 {label:'Prime lines',machine:'PRIME',seconds:12,detail:'Bleeding air · charging the suction lines'},
 {label:'Fill reservoirs',machine:'PUMP',seconds:60,detail:'Drawing water · monitoring lift cells'},
 {label:'Seal & test',machine:'SEAL',seconds:15,detail:'Closing valves · holding proof pressure'},
 {label:'File dispatch',machine:'DISPATCH',seconds:10,detail:'Weighing manifest · awaiting departure clearance'}
];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,Number(v)||0));
export function createHarvestState(saved={}){
 const state={step:Math.floor(clamp(saved.step,0,4)),elapsed:clamp(saved.elapsed,0,60),fill:clamp(saved.fill,0,1),running:!!saved.running,rate:clamp(saved.rate||1,.5,1.5),delivered:Math.floor(clamp(saved.delivered,0,QUOTA)),flights:[]};
 state.flights=(Array.isArray(saved.flights)?saved.flights:[]).slice(0,9).map(f=>({slot:Math.floor(clamp(f.slot,0,2)),age:clamp(f.age,-2,32),duration:26+Math.floor(clamp(f.slot,0,2))*1.4})).slice(0,QUOTA-state.delivered);
 if(state.delivered===QUOTA){state.running=false;state.fill=0;}
 return Object.defineProperties(state,Object.getOwnPropertyDescriptors({
  get pumping(){return this.running&&this.step===2;},
  get remaining(){return Math.max(0,QUOTA-this.delivered-this.flights.length);},
  get canRun(){return this.remaining>0&&(this.step!==4||this.flights.length<=6);},
  toggle(){if(this.running){this.running=false;return true;}if(!this.canRun)return false;this.running=true;return true;},
  setRate(v){this.rate=clamp(v,.5,1.5);},
  tick(dt){
   dt=Math.max(0,Number(dt)||0);const arrived=[];
   for(const f of this.flights){f.age+=dt;if(f.age>=f.duration)arrived.push(f);}
   this.flights=this.flights.filter(f=>f.age<f.duration);this.delivered=Math.min(QUOTA,this.delivered+arrived.length);
   if(this.running){const duration=STEPS[this.step].seconds;this.elapsed=Math.min(duration,this.elapsed+dt*(this.step===2?this.rate:1));if(this.step===2)this.fill=this.elapsed/duration;
    if(this.elapsed>=duration){this.running=false;this.elapsed=0;if(this.step===4){const n=Math.min(3,this.remaining);for(let i=0;i<n;i++)this.flights.push({slot:i,age:-i*.8,duration:26+i*1.4});this.step=0;this.fill=0;}else this.step++;}
   }return arrived;
  },
  snapshot(){return {version:2,step:this.step,elapsed:this.elapsed,fill:this.fill,running:this.running,rate:this.rate,delivered:this.delivered,flights:this.flights.map(({slot,age,duration})=>({slot,age,duration}))};}
 }));
}
