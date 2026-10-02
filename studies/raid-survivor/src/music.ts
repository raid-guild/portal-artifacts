// Vault Runner's composition and synth are extracted from the approved public/music-test.html.
// Keep changes to progression, scheduling and instrument values in sync with that source.
const STEPS=64*16, BPM=130, SIXTEENTH=60/BPM/4;
type Stem = 'drums' | 'bass' | 'arp' | 'lead' | 'air';
const stems: Record<Stem, boolean>={drums:true,bass:true,arp:true,lead:true,air:true};
const freq=(m:number)=>440*Math.pow(2,(m-69)/12);
const progression=[{root:38,chord:[62,65,69],name:'Dm'},{root:34,chord:[58,62,65],name:'Bb'},{root:41,chord:[60,65,69],name:'F'},{root:36,chord:[60,64,67],name:'C'}, {root:43,chord:[62,67,70],name:'Gm'},{root:34,chord:[62,65,70],name:'Bb'},{root:38,chord:[62,65,69],name:'Dm'},{root:33,chord:[61,64,69],name:'A'}];
const melodies=[
[74,null,77,76,74,null,69,72], [74,null,77,79,77,74,72,null],
[77,null,81,79,77,76,74,null], [76,null,79,77,76,72,69,null],
[79,null,82,81,79,77,74,null], [77,74,null,77,82,81,77,null],
[81,77,74,null,77,76,74,72], [73,null,76,81,79,76,73,null]
];
export function makeVaultRunnerEngine(context: BaseAudioContext, volume=38, enabled: Record<Stem, boolean> = stems){
 const master=context.createGain(),compressor=context.createDynamicsCompressor(),out=context.createGain();
 compressor.threshold.value=-15;compressor.knee.value=16;compressor.ratio.value=5;compressor.attack.value=.004;compressor.release.value=.17;
 master.connect(compressor);compressor.connect(out);out.connect(context.destination);out.gain.value=volume/100*.72;
 const buses={} as Record<Stem, GainNode>;for(const key of Object.keys(stems) as Stem[]){buses[key]=context.createGain();buses[key].gain.value=enabled[key]?1:0;buses[key].connect(master);}
 const delay=context.createDelay(1);delay.delayTime.value=60/BPM*.75;const feedback=context.createGain();feedback.gain.value=.24;const delayTone=context.createBiquadFilter();delayTone.type='lowpass';delayTone.frequency.value=2900;const wet=context.createGain();wet.gain.value=.18;delay.connect(delayTone);delayTone.connect(feedback);feedback.connect(delay);delayTone.connect(wet);wet.connect(master);
 const reverb=context.createConvolver(),verbGain=context.createGain();verbGain.gain.value=.12;const impulse=context.createBuffer(2,context.sampleRate*1.6,context.sampleRate);let seed=93;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};for(let c=0;c<2;c++){const data=impulse.getChannelData(c);for(let i=0;i<data.length;i++)data[i]=(random()*2-1)*Math.pow(1-i/data.length,3.2);}reverb.buffer=impulse;reverb.connect(verbGain);verbGain.connect(master);
 const noise=context.createBuffer(1,context.sampleRate,context.sampleRate);const samples=noise.getChannelData(0);for(let i=0;i<samples.length;i++)samples[i]=random()*2-1;
 const nodes=new Set<AudioScheduledSourceNode>();
 function track(node: AudioScheduledSourceNode,t:number,d:number){nodes.add(node);node.onended=()=>{nodes.delete(node);node.disconnect();};node.start(t);node.stop(t+d);}
 function note(m:number,t:number,d:number,type:OscillatorType,vol:number,stem:Stem,cutoff=2800,pan=0,send=.0,attack=.007){
  const osc=context.createOscillator(),filter=context.createBiquadFilter(),gain=context.createGain(),stereo=context.createStereoPanner();osc.type=type;osc.frequency.setValueAtTime(freq(m),t);filter.type='lowpass';filter.frequency.setValueAtTime(cutoff,t);filter.frequency.exponentialRampToValueAtTime(Math.max(160,cutoff*.45),t+d);filter.Q.value=type==='sawtooth'?1.8:.6;stereo.pan.value=pan;
  gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(vol,t+attack);gain.gain.exponentialRampToValueAtTime(.0001,t+d);
  osc.connect(filter);filter.connect(gain);gain.connect(stereo);stereo.connect(buses[stem]);
  if(send&&enabled[stem]){const s=context.createGain();s.gain.value=send;stereo.connect(s);s.connect(delay);s.connect(reverb);}
  track(osc,t,d+.02);
 }
 function hiss(t:number,d:number,vol:number,cutoff:number,pan=0){const source=context.createBufferSource(),filter=context.createBiquadFilter(),gain=context.createGain(),stereo=context.createStereoPanner();source.buffer=noise;filter.type='highpass';filter.frequency.value=cutoff;stereo.pan.value=pan;gain.gain.setValueAtTime(vol,t);gain.gain.exponentialRampToValueAtTime(.0001,t+d);source.connect(filter);filter.connect(gain);gain.connect(stereo);stereo.connect(buses.drums);track(source,t,d+.01);}
 function kick(t:number,accent=1){const osc=context.createOscillator(),gain=context.createGain();osc.frequency.setValueAtTime(142,t);osc.frequency.exponentialRampToValueAtTime(47,t+.055);osc.frequency.exponentialRampToValueAtTime(38,t+.28);gain.gain.setValueAtTime(.56*accent,t);gain.gain.exponentialRampToValueAtTime(.0001,t+.31);osc.connect(gain);gain.connect(buses.drums);track(osc,t,.33);}
 function snare(t:number,accent=1){hiss(t,.14,.18*accent,1400,-.06);note(50,t,.09,'triangle',.11*accent,'drums',2100);}
 function bell(m:number,t:number){note(m,t,.9,'sine',.075,'air',7000,-.3,.45,.003);note(m+19,t,.42,'sine',.021,'air',8500,.3,.25,.003);}
 function schedule(n:number,t:number){const bar=Math.floor(n/16),s=n%16,section=Math.floor(bar/16),partBar=bar%16,c=progression[Math.floor(partBar/2)],root=c.root,beat=s%4===0;
  // Four acts: entrance, pursuit, deeper vault, return. Constant rhythm keeps the loop playable.
  const sparse=section===2&&partBar<8,full=section===1||section===3;
  if(s===0||s===8||full&&s===6||full&&s===14)kick(t,s===6||s===14?.68:1);
  if(s===4||s===12)snare(t,s===12?1:.92);
  if(s%2===0)hiss(t,s===14?.12:.035,s%4===2?.075:.045,6500,s%4===2?.25:-.2);
  if(full&&s%2===1&&s!==15)hiss(t,.022,.024,7800,s%4<2?-.35:.35);
  if(partBar%4===3&&s===15){snare(t,.33);hiss(t+.045,.035,.033,6000);}
  const bassPattern=[0,null,0,12,null,null,7,null,0,null,0,null,12,null,7,null];
  if(bassPattern[s]!==null){const d=s===0||s===8?.18:.12;note(root+bassPattern[s],t,d,'sawtooth',.095,'bass',620+(s%4)*170);note(root+bassPattern[s]-12,t,d+.03,'sine',.075,'bass',160);}
  if(!sparse||s%2===0){const arpIndex=[0,1,2,1,0,2,1,2,0,1,2,1,2,1,0,2][s];const oct=(s===7||s===15)?12:0;note(c.chord[arpIndex]+oct,t,.12,'triangle',s%4===0?.055:.036,'arp',3700,s%2?-.32:.32,.3);}
  if(s%2===0&&((section!==0||partBar>=4)&&!sparse)){
   const phrase=melodies[Math.floor(partBar/2)],m=phrase[s/2];
   if(m!==null&&!(partBar%2===0&&s===14)){note(m+(section===3&&partBar>=8?12:0),t,s===0?.29:.21,'square',full?.036:.028,'lead',2200,.08,.44);}
  }
  if(s===0){for(let i=0;i<c.chord.length;i++)note(c.chord[i]-12,t,60/BPM*4*.97,'triangle',.029,'air',900,(i-1)*.55,.3,.2);if(partBar%4===0)bell(c.chord[0]+12,t);}
  if(section===2&&partBar<8&&s===10&&partBar%2===1)bell(c.chord[2],t);
 }
 return {schedule,out,buses,stop(){out.gain.cancelScheduledValues(context.currentTime);out.gain.setTargetAtTime(0,context.currentTime,.025);for(const node of nodes){try{node.stop(context.currentTime+.12);}catch{}}}};
}


const VOLUME_KEY='raid-music-volume';
const MUTE_KEY='raid-music-muted';
function storedVolume():number{
 try { const raw=localStorage.getItem(VOLUME_KEY); if(raw===null)return 38; const value=Number(raw); return Number.isFinite(value)?Math.min(100,Math.max(0,value)):38; } catch {return 38;}
}
function storedMute():boolean{try{return localStorage.getItem(MUTE_KEY)==='true';}catch{return false;}}
export type MusicSnapshot={activated:boolean,playing:boolean,contextState:AudioContextState|'none',timerCount:number,step:number,volume:number,muted:boolean,creationCount:number};
export class VaultRunnerMusic {
 private context:AudioContext|null=null;
 private engine:ReturnType<typeof makeVaultRunnerEngine>|null=null;
 private timer:ReturnType<typeof setInterval>|null=null;
 private pending:Promise<void>|null=null;
 private generation=0;
 private step=0;
 private nextTime=0;
 private activated=false;
 private disposed=false;
 private creationCount=0;
 volume=storedVolume();
 muted=storedMute();
 private readonly onVisibility=()=>{if(document.hidden){this.pauseForHidden();}else if(this.activated){void this.start();}};
 private readonly onPageHide=()=>{void this.release();};
 private readonly onPageShow=()=>{if(this.activated&&!document.hidden)void this.start();};
 constructor(){document.addEventListener('visibilitychange',this.onVisibility);window.addEventListener('pagehide',this.onPageHide);window.addEventListener('pageshow',this.onPageShow);}
 snapshot():MusicSnapshot{return {activated:this.activated,playing:!!this.timer,contextState:this.context?.state??'none',timerCount:this.timer?1:0,step:this.step,volume:this.volume,muted:this.muted,creationCount:this.creationCount};}
 setVolume(value:number){this.volume=Number.isFinite(value)?Math.min(100,Math.max(0,value)):38;try{localStorage.setItem(VOLUME_KEY,String(this.volume));}catch{}this.applyGain();}
 setMuted(value:boolean){this.muted=value;try{localStorage.setItem(MUTE_KEY,String(value));}catch{}this.applyGain();}
 toggleMuted(){this.setMuted(!this.muted);}
 private applyGain(){if(this.engine&&this.context)this.engine.out.gain.setTargetAtTime(this.muted?0:this.volume/100*.72,this.context.currentTime,.03);}
 // Call directly from a player gesture. Repeated starts share one initialization.
 start():Promise<void>{
  if(this.disposed)return Promise.resolve();
  this.activated=true;
  if(document.hidden)return Promise.resolve();
  if(this.timer&&this.context?.state==='running')return Promise.resolve();
  if(this.pending)return this.pending;
  const generation=++this.generation;
  let context:AudioContext;
  try{context=this.context??new AudioContext();}catch{return Promise.resolve();}
  if(!this.context){this.context=context;this.creationCount++;}
  let resume:Promise<void>;
  try {resume=context.resume();}catch{return Promise.resolve();}
  const pending=resume.then(()=>{
   if(this.disposed||generation!==this.generation||document.hidden||context.state!=='running'){
    if(document.hidden&&context===this.context&&context.state==='running')void this.suspendAfterHide(context);
    return;
   }
   if(!this.engine){this.engine=makeVaultRunnerEngine(context,this.muted?0:this.volume);this.nextTime=context.currentTime+.06;}
   else this.nextTime=Math.max(this.nextTime,context.currentTime+.06);
   this.schedule();
   if(!this.timer)this.timer=setInterval(()=>this.schedule(),25);
  }).catch(()=>{/* Browser may block resume; a later gesture can retry. */}).finally(()=>{if(this.pending===pending)this.pending=null;});
  this.pending=pending;
  return pending;
 }
 private schedule(){
  const context=this.context,engine=this.engine;
  if(!context||!engine||context.state!=='running'||document.hidden||this.disposed)return;
  this.nextTime=Math.max(this.nextTime,context.currentTime+.01);
  while(this.nextTime<context.currentTime+.16){engine.schedule(this.step,this.nextTime);this.step=(this.step+1)%STEPS;this.nextTime+=SIXTEENTH;}
 }
 private async suspendAfterHide(context:AudioContext){
  try{await context.suspend();}catch{return;}
  // A new visible-tab resume can finish before an earlier suspend. Restore it once
  // that resume settles, without scheduling notes while the tab is hidden.
  if(this.disposed||document.hidden||context!==this.context)return;
  const pending=this.pending;
  if(pending)await pending;
  if(this.disposed||document.hidden||context!==this.context||context.state!=='suspended')return;
  if(this.timer){clearInterval(this.timer);this.timer=null;}
  void this.start();
 }
 private pauseForHidden(){
  this.generation++;
  const wasPending=!!this.pending;
  this.pending=null;
  if(this.timer){clearInterval(this.timer);this.timer=null;}
  const context=this.context;
  if(context&&(context.state==='running'||wasPending))void this.suspendAfterHide(context);
 }
 private async release(){this.generation++;if(this.timer){clearInterval(this.timer);this.timer=null;}const context=this.context;this.context=null;this.engine?.stop();this.engine=null;this.pending=null;if(context&&context.state!=='closed')try{await context.close();}catch{}}
 dispose(){if(this.disposed)return;this.disposed=true;document.removeEventListener('visibilitychange',this.onVisibility);window.removeEventListener('pagehide',this.onPageHide);window.removeEventListener('pageshow',this.onPageShow);void this.release();}
}
export const vaultRunnerMusic=new VaultRunnerMusic();
