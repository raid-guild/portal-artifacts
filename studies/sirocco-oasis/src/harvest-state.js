// A bounded batch: pumping, ready, then an independently flying delivery.
export function createHarvestState(){
 const state={fill:0,pumping:false,rate:1,delivered:0,flights:[]};
 return Object.assign(state,{
  toggle(){if(this.fill<1)this.pumping=!this.pumping;},
  tick(dt){if(this.pumping){this.fill=Math.min(1,this.fill+dt*this.rate/18);if(this.fill===1)this.pumping=false;}for(const f of this.flights)f.age+=dt;const arrived=this.flights.filter(f=>f.age>=f.duration);this.delivered+=arrived.length;this.flights=this.flights.filter(f=>f.age<f.duration);return arrived;},
  release(){if(this.fill<1||this.flights.length>6)return false;for(let i=0;i<3;i++)this.flights.push({slot:i,age:-i*.8,duration:26+i*1.4});this.fill=0;this.pumping=false;return true;}
 });
}
