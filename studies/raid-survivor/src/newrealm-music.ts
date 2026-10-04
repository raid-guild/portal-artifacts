export type MusicLevel='training'|'forest'|'desert'|'ice';
export type NewRealm=Exclude<MusicLevel,'training'>;
export type Stem='drums'|'bass'|'arp'|'lead'|'air';
export const REALM_TRACKS={
  training:{title:'Vault Runner',bpm:130,key:'D minor',acts:['Entrance','Pursuit','Deeper Vault','Return']},
  forest:{title:'Thornlight Pursuit',bpm:126,key:'E minor',acts:['Entrance','Pursuit','Sparse Canopy','Full Return']},
  desert:{title:'Sunken Caravan',bpm:132,key:'E Phrygian dominant',acts:['Dunes','Caravan','Sunken Court','Return']},
  ice:{title:'Shards of Dawn',bpm:128,key:'B minor',acts:['Opening','Shards','Bridge','Return']},
} as const;
export const LOOP_STEPS=64*16;
type Event={stem:Stem;kind:'note'|'kick'|'snare'|'hat';pitch?:number;duration?:number;volume?:number;wave?:OscillatorType;cutoff?:number;pan?:number;send?:number};
const e=(stem:Stem,kind:Event['kind'],pitch?:number,duration?:number,volume?:number,wave?:OscillatorType,cutoff?:number,pan?:number,send?:number):Event=>({stem,kind,pitch,duration,volume,wave,cutoff,pan,send});
const FOREST=[
 {root:40,chord:[64,67,71]},{root:36,chord:[60,64,67]},{root:40,chord:[64,67,71]},{root:45,chord:[57,60,64]},
 {root:36,chord:[60,64,67]},{root:47,chord:[59,62,66]},{root:40,chord:[64,67,71]},{root:47,chord:[59,62,66]},
];
const DESERT=[
 {root:40,chord:[64,68,71]},{root:41,chord:[65,69,72]},{root:40,chord:[64,68,71]},{root:38,chord:[62,65,69]},
 {root:45,chord:[69,72,76]},{root:41,chord:[65,69,72]},{root:40,chord:[64,68,71]},{root:40,chord:[64,68,71]},
];
const ICE=[
 {root:35,chord:[59,62,66]},{root:43,chord:[55,59,62]},{root:38,chord:[62,66,69]},{root:45,chord:[57,62,64]},
 {root:35,chord:[59,62,66]},{root:43,chord:[55,59,62]},{root:38,chord:[62,66,69]},{root:45,chord:[57,62,64]},
];
const FOREST_LEAD=[
 [76,null,79,78,null,76,74,null],[79,null,83,null,81,79,null,76],
 [76,null,74,71,null,74,76,null],[72,null,76,74,72,null,69,null],
 [76,null,79,81,null,79,76,null],[78,null,81,83,81,null,78,null],
 [83,null,81,79,null,76,74,null],[78,null,76,74,71,null,74,null],
];
const DESERT_LEAD=[
 [76,77,null,80,77,null,76,null],[77,null,80,81,null,80,77,null],
 [76,80,null,77,76,null,74,null],[74,null,77,80,77,null,74,null],
 [81,80,null,77,76,null,73,null],[77,null,80,84,null,81,80,null],
 [76,77,80,null,77,76,null,74],[80,null,77,76,73,null,76,null],
];
const ICE_LEAD=[
 [83,null,81,null,78,null,74,null],[81,null,78,null,74,null,71,null],
 [78,null,76,null,74,null,69,null],[76,null,74,null,71,null,69,null],
 [83,null,86,null,83,null,78,null],[81,null,83,null,81,null,74,null],
 [78,null,74,null,71,null,69,null],[76,null,74,null,71,null,66,null],
];

/** Pure 64-bar arrangements; each realm authors its own harmony, rhythm and rests. */
export function realmPattern(level:NewRealm,n:number):Event[]{
  const step=((n%LOOP_STEPS)+LOOP_STEPS)%LOOP_STEPS,bar=Math.floor(step/16),s=step%16,act=Math.floor(bar/16),b=bar%16,full=act===1||act===3;
  const result:Event[]=[];
  if(level==='forest'){
    const c=FOREST[Math.floor(b/2)],sparse=act===2&&b<8;
    if(s===0||s===8||full&&(s===6||s===14))result.push(e('drums','kick',undefined,undefined,s===6||s===14?.67:1));
    if(s===4||s===12)result.push(e('drums','snare',undefined,undefined,sparse?.65:1));
    if([0,3,6,10,13].includes(s))result.push(e('drums','hat',undefined,undefined,sparse?.025:.044));
    if([0,3,7,10,14].includes(s)&&(!sparse||s===0||s===10))result.push(e('bass','note',c.root+([7,14].includes(s)?7:0),s===0?.25:.17,.084,'sawtooth',690,0,.13));
    if([0,2,5,7,9,12,14].includes(s)&&(!sparse||s%2===0))result.push(e('arp','note',c.chord[(s+b)%3]+(s===14?12:0),.16,.036,'triangle',3500,s%2?-.27:.27,.28));
    if(s%2===0&&b>= (act===0?4:0)&&!sparse){const m=FOREST_LEAD[Math.floor(b/2)][s/2];if(m!==null&&![2,12].includes(s))result.push(e('lead','note',m, s===0?.35:.23,full?.037:.027,'square',2300,.08,.38));}
    if(s===0){for(let i=0;i<3;i++)result.push(e('air','note',c.chord[i]-12,1.65,.022,'triangle',900,(i-1)*.45,.2));}
    if(s===12&&b%4===2)result.push(e('air','note',c.chord[2]+12,.85,.049,'sine',6800,-.2,.34));
  }else if(level==='desert'){
    const c=DESERT[Math.floor(b/2)],sparse=act===2&&b<8;
    if(s===0||s===8||full&&s===14)result.push(e('drums','kick',undefined,undefined,s===14?.62:1));
    if(s===4||s===12)result.push(e('drums','snare',undefined,undefined,s===12?.8:.65));
    if([0,6,12].includes(s))result.push(e('drums','note',45+(s===12?3:0),.13,s===0?.07:.048,'triangle',1100));
    if([2,5,9,13].includes(s))result.push(e('drums','hat',undefined,undefined,.032));
    if([0,3,6,10,13].includes(s)&&(!sparse||s===0||s===10))result.push(e('bass','note',c.root+(s===6?12:s===13?7:0),s===0?.22:.15,.096,'sawtooth',800,0,.045));
    if([0,3,5,8,11,14].includes(s)&&(!sparse||s%2===0))result.push(e('arp','note',c.chord[(s+b)%3]+(s===14?12:0),.095,.041,'square',2900,s%2?-.24:.24,.055));
    if([0,3,7,10,14].includes(s)&&b>=(act===0?2:0)&&!sparse){const m=DESERT_LEAD[Math.floor(b/2)][Math.floor(s/2)];if(m!==null)result.push(e('lead','note',m,s===0?.31:.16,full?.044:.033,'triangle',2600,.15,.075));}
    if(s===0&&b%2===0)result.push(e('air','note',c.chord[0]-12,.9,.016,'triangle',1250,-.3,.055));
    if(s===14&&b%4===3)result.push(e('air','note',c.chord[1]+12,.38,.027,'sine',6100,.3,.08));
  }else{
    const c=ICE[Math.floor(b/2)],bridge=act===2&&b<8;
    if(s===0||s===8||full&&s===6)result.push(e('drums','kick',undefined,undefined,s===6?.62:.86));
    if(s===4||s===12)result.push(e('drums','snare',undefined,undefined,bridge?.52:.78));
    if(s%2===0)result.push(e('drums','hat',undefined,undefined,bridge?.021:.036));
    if([0,4,8,12].includes(s)&&(!bridge||s===0||s===8))result.push(e('bass','note',c.root+(s===12?7:0),.31,.078,'triangle',720,0,.16));
    if(s%2===0&&(!bridge||s%4===0))result.push(e('arp','note',c.chord[(s/2+b)%3]+(s===14?12:0),.23,.041,'sine',6100,s%4===0?-.3:.3,.37));
    if([0,6,12].includes(s)&&b>=(act===0?4:0)&&!bridge){const m=ICE_LEAD[Math.floor(b/2)][s===0?0:s===6?2:4];if(m!==null)result.push(e('lead','note',m,s===0?.66:.45,full?.037:.027,'triangle',3400,.06,.31));}
    if(s===0){for(let i=0;i<3;i++)result.push(e('air','note',c.chord[i]-12,1.7,.019,'sine',4800,(i-1)*.5,.25));}
    if(s===8&&b%2===0)result.push(e('air','note',c.chord[2]+12,.95,.051,'sine',7600,.28,.38));
  }
  return result;
}

const frequency=(pitch:number)=>440*Math.pow(2,(pitch-69)/12);
export function makeRealmMusicEngine(context:BaseAudioContext,level:NewRealm,volume=38){
  const bpm=REALM_TRACKS[level].bpm,master=context.createGain(),compressor=context.createDynamicsCompressor(),out=context.createGain();
  compressor.threshold.value=-15;compressor.knee.value=16;compressor.ratio.value=5;compressor.attack.value=.004;compressor.release.value=.17;
  master.connect(compressor);compressor.connect(out);out.connect(context.destination);out.gain.value=volume/100*.72;
  const buses={} as Record<Stem,GainNode>;for(const stem of ['drums','bass','arp','lead','air'] as Stem[]){buses[stem]=context.createGain();buses[stem].connect(master);}
  const delay=context.createDelay(1),tone=context.createBiquadFilter(),feedback=context.createGain(),wet=context.createGain();
  delay.delayTime.value=60/bpm*(level==='desert'?.5:.75);tone.type='lowpass';tone.frequency.value=level==='ice'?4200:2800;feedback.gain.value=level==='desert'?.13:.21;wet.gain.value=level==='desert'?.07:.16;
  delay.connect(tone);tone.connect(feedback);feedback.connect(delay);tone.connect(wet);wet.connect(master);
  const reverb=context.createConvolver(),verbGain=context.createGain();verbGain.gain.value=level==='desert'?.055:.11;
  const impulse=context.createBuffer(2,Math.floor(context.sampleRate*1.5),context.sampleRate);let seed=level==='forest'?12693:level==='desert'?13293:12893;
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  for(let c=0;c<2;c++){const data=impulse.getChannelData(c);for(let i=0;i<data.length;i++)data[i]=(random()*2-1)*Math.pow(1-i/data.length,3.3);}
  reverb.buffer=impulse;reverb.connect(verbGain);verbGain.connect(master);
  const noise=context.createBuffer(1,context.sampleRate,context.sampleRate);
  const samples=noise.getChannelData(0);for(let i=0;i<samples.length;i++)samples[i]=random()*2-1;
  const voices=new Set<AudioScheduledSourceNode>(),voiceNodes=new Set<AudioNode>();let stopped=false,stopPromise:Promise<void>|null=null;
  function track(source:AudioScheduledSourceNode,t:number,d:number,chain:AudioNode[]){
    voices.add(source);for(const node of chain)voiceNodes.add(node);
    source.onended=()=>{voices.delete(source);for(const node of chain){node.disconnect();voiceNodes.delete(node);}};
    source.start(t);source.stop(t+d);
  }
  function note(event:Event,t:number){
    const pitch=event.pitch??60,d=event.duration??.18,volume=event.volume??.04,wave=event.wave??'triangle';
    const oscillator=context.createOscillator(),filter=context.createBiquadFilter(),gain=context.createGain(),pan=context.createStereoPanner(),chain:AudioNode[]=[oscillator,filter,gain,pan];
    oscillator.type=wave;oscillator.frequency.setValueAtTime(frequency(pitch),t);filter.type='lowpass';filter.frequency.setValueAtTime(event.cutoff??2800,t);filter.frequency.exponentialRampToValueAtTime(Math.max(180,(event.cutoff??2800)*.52),t+d);filter.Q.value=wave==='sawtooth'?1.3:.5;pan.pan.value=event.pan??0;
    gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(volume,t+Math.min(.12,d*.25));gain.gain.exponentialRampToValueAtTime(.0001,t+d);
    oscillator.connect(filter);filter.connect(gain);gain.connect(pan);pan.connect(buses[event.stem]);
    if(event.send){const send=context.createGain();send.gain.value=event.send;pan.connect(send);send.connect(delay);send.connect(reverb);chain.push(send);}
    track(oscillator,t,d+.02,chain);
  }
  function hiss(t:number,d:number,volume:number,cutoff:number){
    const source=context.createBufferSource(),filter=context.createBiquadFilter(),gain=context.createGain(),chain:AudioNode[]=[source,filter,gain];source.buffer=noise;filter.type='highpass';filter.frequency.value=cutoff;gain.gain.setValueAtTime(volume,t);gain.gain.exponentialRampToValueAtTime(.0001,t+d);
    source.connect(filter);filter.connect(gain);gain.connect(buses.drums);track(source,t,d+.01,chain);
  }
  function kick(t:number,accent:number){
    const source=context.createOscillator(),gain=context.createGain();source.frequency.setValueAtTime(level==='ice'?125:145,t);source.frequency.exponentialRampToValueAtTime(43,t+.07);source.frequency.exponentialRampToValueAtTime(37,t+.27);gain.gain.setValueAtTime(.48*accent,t);gain.gain.exponentialRampToValueAtTime(.0001,t+.29);source.connect(gain);gain.connect(buses.drums);track(source,t,.31,[source,gain]);
  }
  function schedule(step:number,t:number){
    if(stopped)throw new Error('Music engine stopped');
    for(const event of realmPattern(level,step)){
      if(event.kind==='note')note(event,t);
      else if(event.kind==='kick')kick(t,event.volume??1);
      else if(event.kind==='snare'){hiss(t,.13,.15*(event.volume??1),1500);note(e('drums','note',50,.08,.08*(event.volume??1),'triangle',1900),t);}
      else hiss(t,.035,event.volume??.035,level==='ice'?7900:6500);
    }
  }
  function stop():Promise<void>{
    if(stopPromise)return stopPromise;stopped=true;const now=context.currentTime;
    out.gain.cancelScheduledValues(now);out.gain.setTargetAtTime(0,now,.025);
    for(const source of voices)try{source.stop(now+.12);}catch{}
    stopPromise=new Promise(resolve=>setTimeout(()=>{for(const node of voiceNodes)node.disconnect();voiceNodes.clear();voices.clear();for(const bus of Object.values(buses))bus.disconnect();for(const node of [delay,tone,feedback,wet,reverb,verbGain,master,compressor,out])node.disconnect();resolve();},160));
    return stopPromise;
  }
  return {schedule,stop,out,buses,voiceCount:()=>voices.size};
}
