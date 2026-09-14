export const facesLiftDoors=(yaw,pitch=0)=>-Math.cos(yaw)>.97&&Math.abs(pitch)<.45;
export const insideCab=(x,z)=>Math.abs(x)<1.05&&z> -1.1&&z<.65;
export class ElevatorState{
 constructor(arrival=false){this.phase=arrival?'arrival':'closed';this.open=0;this.time=0;this.arrival=arrival;}
 prompt(x,z,facingDoor=true){if(this.phase==='closed'&&Math.abs(x)<2.3&&z>1.6&&z<4)return 'Call elevator';if(this.phase==='open'&&insideCab(x,z)&&!this.arrival&&facingDoor)return 'Close doors · Descend';return null;}
 interact(x,z,facingDoor=true){if(!this.prompt(x,z,facingDoor))return false;this.phase=this.phase==='closed'?'opening':'ready';this.time=0;return true;}
 update(dt){this.time+=dt;let descend=false;
 if(this.phase==='opening'||this.phase==='arrival'){if(this.phase==='arrival'&&this.time<1)return false;this.open=Math.min(1,this.open+dt*.65);if(this.open===1)this.phase='open';}
 if(this.phase==='ready'&&this.time>=.8){this.phase='closing';this.time=0;}
 if(this.phase==='closing'){this.open=Math.max(0,this.open-dt*.36);if(this.open===0){this.phase='travel';this.time=0;}}
 if(this.phase==='travel'&&this.time>3){this.phase='departed';descend=true;}return descend;
 }
 get locked(){return ['ready','closing','travel','departed','arrival'].includes(this.phase);}
 get reveal(){return this.phase==='closing'&&this.open<.4&&this.open>.08;}
 canWalk(x,z){if(Math.abs(x)<1.8&&Math.abs(z)<1.8){if(Math.abs(x)>1.24||z< -1.24)return false;if(z>1.24&&(Math.abs(x)>.85||this.open<.95))return false;}return true;}
}
