// Deliberately driven by the foreground game tick so hidden tabs and cutscenes
// cannot consume a choice or leave an old timeout behind.
export class FlowCountdown {
  constructor(seconds=10){this.seconds=seconds;this.cancel();}
  start(kind,options,onChoose){this.cancel();this.kind=kind;this.options=[...options];this.onChoose=onChoose;this.remaining=this.seconds;return this.token;}
  cancel(){this.token=(this.token||0)+1;this.kind=null;this.options=[];this.onChoose=null;this.remaining=0;}
  choose(value,token=this.token){
    if(token!==this.token||!this.onChoose||!this.options.includes(value))return false;
    const callback=this.onChoose;this.cancel();callback(value);return true;
  }
  tick(seconds,foreground=true,random=Math.random){
    if(!foreground||!this.onChoose)return false;
    this.remaining=Math.max(0,this.remaining-seconds);
    if(this.remaining>0)return false;
    const index=Math.min(this.options.length-1,Math.floor(Math.max(0,Math.min(.999999,random()))*this.options.length));
    return this.choose(this.options[index]);
  }
}

export function canSkipRound(run,{mode='casual',modal=false,show=false,blocked=false}={}){
  return mode==='casual'&&run.status==='choose'&&!modal&&!show&&!blocked;
}

export function preserveEncoreOnSkip(run,queued=[],active=[]){
  const unscored=[...queued,...active].filter(item=>!item.free&&item.encore).length;
  return unscored?{...run,encoreAvailable:(run.encoreAvailable||0)+unscored}:run;
}
