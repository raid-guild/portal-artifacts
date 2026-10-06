export const SCORE_KEY='jelly-garden.keep-uppy.v1';
const validScore=value=>value&&Number.isFinite(value.time)&&value.time>=0&&value.time<86400&&Number.isSafeInteger(value.clicks)&&value.clicks>=0;
const modes=['raidguild','garden'];

export class KeepUppy{
  constructor(storage=null){
    this.storage=storage;this.best={raidguild:null,garden:null};
    try {
      const saved=JSON.parse(storage?.getItem(SCORE_KEY)??'null');
      if(saved?.version===1)for(const mode of modes)if(validScore(saved[mode]))this.best[mode]={time:saved[mode].time,clicks:saved[mode].clicks};
    } catch { /* Private browsing and malformed storage leave in-memory scores usable. */ }
    this.cancel();
  }
  cancel(){this.phase='idle';this.mode=null;this.participants=[];this.contacts=new Map();this.time=0;this.clicks=0;this.last=null;this.landed=null}
  start(mode,participants){
    if(!modes.includes(mode)||!participants.length)throw new Error('A ready study mode is required');
    this.cancel();this.phase='armed';this.mode=mode;this.participants=[...participants];
    for(const participant of participants)this.contacts.set(participant,participant.contactSequence);
  }
  bounce(participant){
    if((this.phase==='armed'||this.phase==='running')&&this.participants.includes(participant)){this.clicks++;return true}
    return false;
  }
  tick(dt,clearance){
    if(this.phase==='armed'){
      if(this.participants.every(participant=>!participant.grounded&&clearance(participant)>0.015)){
        this.phase='running';
        for(const participant of this.participants)this.contacts.set(participant,participant.contactSequence);
      }
      return null;
    }
    if(this.phase!=='running')return null;
    const landed=this.participants.find(participant=>participant.contactSequence!==this.contacts.get(participant));
    if(landed){
      const result={time:this.time,clicks:this.clicks};
      this.last=result;this.landed=landed;this.phase='ended';this.time=0;this.clicks=0;
      const prior=this.best[this.mode];
      if(!prior||result.time>prior.time||result.time===prior.time&&result.clicks<prior.clicks){
        this.best[this.mode]=result;
        try {this.storage?.setItem(SCORE_KEY,JSON.stringify({version:1,...this.best}))} catch { /* Keep the round usable without persistence. */ }
      }
      return {landed,result};
    }
    this.time+=dt;
    return null;
  }
}

export function formatTime(seconds){return `${Math.floor(seconds/60)}:${(seconds%60).toFixed(1).padStart(4,'0')}`}
