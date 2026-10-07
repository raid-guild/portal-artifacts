export const MOTIF=[62,69,70,64,62];
export const MODES={
  explore:{name:'Exploring',description:'A hollow little phrase, suspended over breath and scattered wooden taps.',timing:[0,2,2.5,4.25,5.5],decay:1,wet:.36},
  contract:{name:'Contracting',description:'The same five notes draw closer, their resonances gathering into a compact pulse.',timing:[0,1.4,1.75,2.8,3.6],decay:1.2,wet:.29},
  grow:{name:'Growing',description:'A lower voice joins the signature. More warmth and weight, with room left around it.',timing:[0,2,2.5,4.25,5.5],decay:1.15,wet:.4},
  shed:{name:'Shedding',description:'The descending answer breaks away, returning as a small, distant echo.',timing:[0,2,2.5,4.5,6],decay:.85,wet:.45}
};
export const frequency=midi=>440*2**((midi-69)/12);
export function random(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
export const LAYERS={
  theme:{name:'Creature theme',detail:'The five-note voice',level:.95},
  counter:{name:'Counter-melody',detail:'A second voice answers',level:.8},
  voice:{name:'Wordless voice',detail:'A mouth that changes shape',level:.88},
  guitar:{name:'Bent guitar',detail:'Singing strings, small interruptions',level:.82},
  motion:{name:'Rolling figures',detail:'Bright, interlocking FM notes',level:.65},
  bass:{name:'Bass line',detail:'Weight and forward motion',level:.85},
  rhythm:{name:'Percussion',detail:'Wood, metal, soft impact',level:.72},
  air:{name:'Air & harmony',detail:'Breathing space between phrases',level:.65}
};
export const SECTIONS=[
  {name:'Awakening',beat:0,length:8},
  {name:'First steps',beat:8,length:24},
  {name:'Countercurrent',beat:32,length:24},
  {name:'Suspended',beat:56,length:16},
  {name:'Return',beat:72,length:32},
  {name:'Settling',beat:104,length:24}
];
export function makeScore({mode='explore',tempo=88,hook=false}={}){
  const config=MODES[mode],beat=60/tempo,events=[];
  const add=(layer,type,b,note,amp,pan=0,dur=1,extra={})=>events.push({layer,type,time:b*beat,note,amp,pan,duration:dur*beat,...extra});
  const theme=(start,scale=1,octave=0)=>MOTIF.forEach((note,i)=>{
    const pan=mode==='shed'&&i>=3?.48:(i-2)*.065;
    const duration=[2.65,1.4,1.2,1.8,3.6][i]*config.decay;
    add('theme','ceramic',start+config.timing[i],note+octave,.26*scale*(i===2?.78:1),pan,duration,{noteIndex:i});
    if(mode==='grow'&&[0,3,4].includes(i))add('theme','ceramic',start+config.timing[i]+.035,note+octave-12,.09*scale,-.18,duration*1.15);
    if(mode==='shed'&&i>=3)add('theme','ceramic',start+config.timing[i]+3,note+octave,.075*scale,.8,duration*1.15,{noteIndex:i,echo:true});
  });
  if(hook){
    theme(0);
    return {events:events.sort((a,b)=>a.time-b.time),duration:Math.max(...events.map(e=>e.time+e.duration))+3.2,beat,mode,hook,sections:[]};
  }
  // An original 32-bar miniature: A theme, contrasting B melody, a suspended
  // bridge, a fuller return and a coda that leads back to the opening.
  theme(8);theme(24,.92);theme(72,1.06);theme(88,.9,12);theme(112,.78);
  const melody=(layer,start,notes,times,amp=.17,type='reed',dur=.9)=>notes.forEach((note,i)=>
    add(layer,type,start+times[i],note,amp*(i%3===0?1:.83),layer==='counter'?.27:-.1,dur+(i===notes.length-1?.9:0)));
  melody('theme',16,[65,64,62,57,60,64,62],[0,1,1.75,3,4,5.25,6.5],.19,'ceramic');
  melody('theme',80,[65,69,67,64,65,64,62],[0,.75,1.75,3,4.25,5.25,6.5],.19,'ceramic');
  const replies=[
    [12,[57,60,64,65],[.25,1.25,2,3],.12],
    [20,[62,60,57,55],[.25,1,2.25,3],.13],
    [28,[57,60,61],[.5,1.5,3],.12],
    [32,[65,67,69,75,74,70,67,64],[0,.75,1.5,2.75,3.5,4.5,5.25,6.5],.2],
    [40,[67,70,69,65,64,62,61,64],[0,.75,1.5,2.5,3.25,4.5,5.25,6.5],.2],
    [48,[69,70,73,76,74,70,69,61],[0,1,1.75,2.5,3.5,4.5,5.25,6.5],.19],
    [76,[69,67,65,64],[.5,1.5,2.25,3],.14],
    [84,[70,69,65,64],[.25,1,2.25,3],.14],
    [92,[65,67,69,65],[.25,1,2.25,3],.14]
  ];
  for(const [start,notes,times,amp] of replies)melody('counter',start,notes,times,amp);
  // The bridge gives the wordless singer space; ceramic answers in its gaps.
  for(const [b,n,d,vowel] of [[56.5,62,2.4,0],[59.5,69,2.1,1],[62,70,1.7,2],[64.5,64,2.8,0],[68,65,1.2,1],[69.5,62,2,2]])
    add('voice','vowel',b,n,.31,b<64?-.16:.16,d,{vowel});
  melody('theme',60.5,[57,64],[0,6.5],.085,'ceramic',1.5);
  add('voice','vowel',109,57,.17,-.28,2.3,{vowel:2});
  add('voice','vowel',119,64,.16,.25,3.4,{vowel:0});
  // Brief off-centre fills precede an eight-beat solo. Its bent semitones
  // borrow the hook's tension, but the rhythm and contour belong to the guitar.
  const guitar=(b,n,d,amp=.22,bend=0,pan=.12)=>add('guitar','guitar',b,n,amp,pan,d,{bend});
  guitar(22.5,64,.45,.17,-45);guitar(23.25,65,.65,.18,0);
  guitar(30,69,.65,.17,0);guitar(30.85,70,1,.21,-100);
  guitar(54.25,73,.6,.19,-55);guitar(55,69,1.2,.18,0);
  for(const [b,n,d,bend] of [[96,69,1.3,100],[97.5,73,.35,0],[98,76,.6,-65],[98.75,74,.55,0],[99.5,70,.55,0],[100.25,69,1.05,-100],[101.5,64,.5,0],[102.25,61,.55,0],[103,62,2.15,-60]])
    guitar(b,n,d,.25,bend);
  // A quiet reverse swell and distant reply make the solo feel suspended.
  add('guitar','guitar',95.1,69,.095,-.55,.85,{reverse:true});
  guitar(104.25,74,1.4,.075,0,-.6);
  melody('counter',105,[69,65,64,62],[0,1.5,3,5],.13,'reed',1.4);
  add('theme','ceramic',124,62,.16,0,3.6,{noteIndex:4});
  const chords=[
    [50,57,60,64],[50,57,60,64],[46,53,57,64],[43,50,57,58],
    [51,58,62,69],[43,50,58,64],[45,52,58,61],[46,53,57,62],
    [43,50,57,58],[50,57,60,64],[46,53,57,64],[43,50,57,58],
    [45,52,58,61],[50,57,60,64],[50,57,60,64],[50,57,64,69]
  ];
  for(let phrase=0;phrase<16;phrase++){
    const start=phrase*8,chord=chords[phrase];
    const intro=start<8,bridge=start>=56&&start<72,coda=start>=104;
    const returnPart=start>=72&&start<104,density=intro?.5:bridge?.25:coda?.45:1;
    chord.slice(0,3).forEach((note,i)=>add('air','air',start+i*.06,note,.052*(mode==='grow'?1.15:1),[-.65,.65,0][i],8.3));
    if(bridge){
      add('air','breath',start+.5,72,.09,phrase%2?.6:-.6,6);
      add('bass','bass',start,chord[0]-12,.17,0,5.8);
    }else{
      const offsets=intro?[0,4.5]:coda?[0,3.5,6]:[0,1.5,3,4,5.5,6.75];
      offsets.forEach((at,i)=>{
        const note=i===2?chord[1]-12:i===4?chord[0]:i===5?chord[0]-10:chord[0]-12;
        add('bass','pluckBass',start+at,note,.21*(i%3===0?1:.76),-.08,i%3===0?1.1:.7);
      });
    }
    const roll=[0,2,1,3,2,1,3,1],times=[.25,1,1.75,2.5,3.5,4.75,5.5,6.75];
    for(let i=0;i<roll.length;i++){
      if((intro&&i<4)||(bridge&&i%3)||(coda&&i%2))continue;
      add('motion','glass',start+times[i],chord[roll[(i+phrase%2)%8]]+12,.115*density*(returnPart?1.1:1)*(start===96?.3:1),i%2?.4:-.4,.7);
    }
    if(!bridge&&start<120){
      for(let bar=0;bar<2;bar++){
        const at=start+bar*4;
        for(const t of [0,2.5])add('rhythm','kick',at+t,38,.22*density,0,.38);
        for(const [i,t] of [1.5,3,3.75].entries())add('rhythm','wood',at+t,[62,69,65][i],.105*density,i%2?.33:-.33,.33);
        for(const t of [.5,1,2,3.5])add('rhythm','tick',at+t,80,.072*density,t<2?-.5:.5,.13);
        if(returnPart||mode==='contract')add('rhythm','wood',at+2.75,74,.06,.2,.24);
      }
    }
    if(start===24||start===48||start===96)for(let i=0;i<4;i++)add('rhythm','glass',start+7+i*.22,74+i*2,.06,-.4+i*.25,.45);
  }
  events.sort((a,b)=>a.time-b.time);
  return {events,duration:128*beat,beat,mode,hook,sections:SECTIONS.map(s=>({...s,time:s.beat*beat,duration:s.length*beat}))};
}

// Every voice and the room are synthesized here. There are no audio samples.
export class Instrument{
  constructor(context,{mode='explore',volume=.55,analyse=false,layers={}}={}){
    this.ctx=context;this.nodes=new Set();this.wet=MODES[mode].wet;
    this.input=context.createGain();this.master=context.createGain();
    this.master.gain.value=volume*.95;
    this.layerGains=Object.fromEntries(Object.entries(LAYERS).map(([key,layer])=>{
      const gain=context.createGain();gain.gain.value=layers[key]??layer.level;gain.connect(this.input);return [key,gain];
    }));
    const compressor=context.createDynamicsCompressor();
    compressor.threshold.value=-14;compressor.knee.value=16;compressor.ratio.value=4;
    compressor.attack.value=.012;compressor.release.value=.24;
    const dry=context.createGain();dry.gain.value=.85;
    const room=context.createConvolver(),wet=context.createGain();wet.gain.value=this.wet;this.reverbGain=wet;
    const length=Math.floor(context.sampleRate*3.1),impulse=context.createBuffer(2,length,context.sampleRate),rand=random(137);
    for(let ch=0;ch<2;ch++){
      const data=impulse.getChannelData(ch);let previous=0;
      for(let i=0;i<length;i++){
        previous=previous*.42+(rand()*2-1)*.58;
        data[i]=previous*Math.exp(-i/context.sampleRate*2.6)*(i<context.sampleRate*.02?i/(context.sampleRate*.02):1);
      }
    }
    room.buffer=impulse;
    this.input.connect(dry).connect(compressor);
    this.input.connect(room).connect(wet).connect(compressor);
    compressor.connect(this.master);
    this.analyser=analyse?context.createAnalyser():null;
    if(this.analyser){this.analyser.fftSize=512;this.master.connect(this.analyser).connect(context.destination);}
    else this.master.connect(context.destination);
    this.graph=[...Object.values(this.layerGains),this.input,this.master,compressor,dry,room,wet,this.analyser].filter(Boolean);
    this.noise=context.createBuffer(1,context.sampleRate*4,context.sampleRate);
    const noise=this.noise.getChannelData(0),noiseRand=random(613);let pink=0;
    for(let i=0;i<noise.length;i++){pink=.93*pink+.07*(noiseRand()*2-1);noise[i]=pink*3;}
  }
  setVolume(value){this.master.gain.setTargetAtTime(value*.95,this.ctx.currentTime,.025);}
  setLayers(levels){for(const [key,gain] of Object.entries(this.layerGains))gain.gain.setTargetAtTime(levels[key]??LAYERS[key].level,this.ctx.currentTime,.04);}
  setMode(mode){this.reverbGain.gain.setTargetAtTime(MODES[mode].wet,this.ctx.currentTime,.25);}
  voice(event,time){
    const c=this.ctx,f=frequency(event.note),duration=event.duration;
    const pan=c.createStereoPanner();pan.pan.value=event.pan;
    const envelope=c.createGain();envelope.connect(pan).connect(this.layerGains[event.layer]||this.input);
    const group=[pan,envelope],sources=[];
    const osc=(type,hz,gain,decay=duration,bend=0)=>{
      const node=c.createOscillator(),level=c.createGain();node.type=type;
      node.frequency.setValueAtTime(hz,time);
      if(bend){node.detune.setValueAtTime(bend,time);node.detune.exponentialRampToValueAtTime(.01,time+.27);}
      level.gain.setValueAtTime(gain,time);level.gain.exponentialRampToValueAtTime(.00001,time+Math.max(.06,decay));
      node.connect(level).connect(envelope);node.start(time);node.stop(time+duration+.08);
      group.push(node,level);sources.push(node);this.nodes.add(node);return node;
    };
    envelope.gain.setValueAtTime(0,time);
    if(event.type==='ceramic'){
      envelope.gain.linearRampToValueAtTime(event.amp,time+.007);
      envelope.gain.setTargetAtTime(.00001,time+duration*.72,Math.max(.05,duration*.11));
      osc('sine',f,1,duration,18);osc('sine',f*2.756,.27,duration*.23,31);
      osc('sine',f*5.404,.06,duration*.095,12);osc('sine',f*.997,.14,duration*.8);
    }else if(event.type==='reed'||event.type==='glass'||event.type==='pluckBass'){
      const reed=event.type==='reed',bass=event.type==='pluckBass';
      const attack=reed?.025:bass?.009:.004;
      envelope.gain.linearRampToValueAtTime(event.amp,time+attack);
      envelope.gain.setTargetAtTime(.00001,time+Math.max(attack+.015,duration*(reed?.62:.32)),Math.max(.025,duration*.12));
      const carrier=osc('sine',f,1,duration*(reed?5:2));
      const modulator=c.createOscillator(),depth=c.createGain();
      modulator.frequency.value=f*(reed?2:bass?1:3.005);
      depth.gain.setValueAtTime(f*(reed?.7:bass?1.2:1.65),time);
      depth.gain.exponentialRampToValueAtTime(f*.025,time+duration*(reed?.8:.5));
      modulator.connect(depth).connect(carrier.frequency);
      modulator.start(time);modulator.stop(time+duration+.08);
      group.push(modulator,depth);sources.push(modulator);this.nodes.add(modulator);
      if(reed)osc('sine',f*.998,.2,duration*3);
      if(bass)osc('sine',f,.32,duration*1.5);
    }else if(event.type==='vowel'){
      const mouth=c.createOscillator(),vibrato=c.createOscillator(),depth=c.createGain();
      mouth.type='sawtooth';mouth.frequency.value=f;
      mouth.detune.setValueAtTime(-38,time);mouth.detune.linearRampToValueAtTime(0,time+Math.min(.28,duration*.2));
      vibrato.frequency.value=4.7;depth.gain.setValueAtTime(0,time);
      depth.gain.linearRampToValueAtTime(13,time+duration*.4);
      vibrato.connect(depth).connect(mouth.detune);
      // Parallel formants morph between oo, ah and ee over each held syllable.
      const vowels=[[350,850,2400],[750,1250,2700],[320,2150,2900]];
      const from=vowels[event.vowel??0],to=vowels[((event.vowel??0)+1)%3];
      for(let i=0;i<3;i++){
        const formant=c.createBiquadFilter(),gain=c.createGain();
        formant.type='bandpass';formant.Q.value=[5,6,8][i];gain.gain.value=[3.4,2.8,1.3][i];
        formant.frequency.setValueAtTime(from[i],time);
        formant.frequency.exponentialRampToValueAtTime(to[i],time+duration*.72);
        mouth.connect(formant).connect(gain).connect(envelope);group.push(formant,gain);
      }
      const breath=c.createBufferSource(),airFilter=c.createBiquadFilter(),airLevel=c.createGain();
      breath.buffer=this.noise;breath.loop=true;airFilter.type='bandpass';airFilter.frequency.value=2600;airFilter.Q.value=.6;airLevel.gain.value=.13;
      breath.connect(airFilter).connect(airLevel).connect(envelope);
      envelope.gain.linearRampToValueAtTime(event.amp,time+Math.min(.2,duration*.22));
      envelope.gain.linearRampToValueAtTime(event.amp*.85,time+duration*.68);
      envelope.gain.linearRampToValueAtTime(0,time+duration);
      for(const source of [mouth,vibrato,breath]){source.start(time);source.stop(time+duration+.08);sources.push(source);this.nodes.add(source);}
      group.push(mouth,vibrato,depth,breath,airFilter,airLevel);
    }else if(event.type==='guitar'){
      // A plucked delay line (Karplus–Strong), then overdrive and a dark cabinet.
      const period=Math.max(8,Math.round(c.sampleRate/f-.5)),line=new Float32Array(period),rand=random(199+event.note*73);
      for(let i=0;i<period;i++)line[i]=rand()*2-1;
      const buffer=c.createBuffer(1,Math.ceil((duration+.35)*c.sampleRate),c.sampleRate),data=buffer.getChannelData(0);
      let previous=0,peak=0;
      for(let i=0;i<data.length;i++){
        const at=i%period,current=line[at],next=.9982*(current+previous)*.5;
        previous=current;line[at]=next;data[i]=current;peak=Math.max(peak,Math.abs(current));
      }
      for(let i=0;i<data.length;i++)data[i]*=.85/Math.max(.01,peak);
      if(event.reverse)data.reverse();
      const string=c.createBufferSource(),drive=c.createWaveShaper(),cabinet=c.createBiquadFilter(),vibrato=c.createOscillator(),depth=c.createGain();
      string.buffer=buffer;string.playbackRate.value=f*(period+.5)/c.sampleRate;
      string.detune.setValueAtTime(event.bend<0?event.bend:0,time);
      string.detune.linearRampToValueAtTime(event.bend>0?event.bend:0,time+Math.min(.32,duration*.45));
      string.detune.linearRampToValueAtTime(0,time+duration*.86);
      const curve=new Float32Array(2048);for(let i=0;i<curve.length;i++)curve[i]=Math.tanh((i/(curve.length-1)*2-1)*3.8)*.8;
      drive.curve=curve;drive.oversample='2x';cabinet.type='lowpass';cabinet.frequency.value=2600;cabinet.Q.value=.55;
      string.connect(drive).connect(cabinet).connect(envelope);
      vibrato.frequency.value=5.2;depth.gain.setValueAtTime(0,time);depth.gain.linearRampToValueAtTime(16,time+duration*.55);
      vibrato.connect(depth).connect(string.detune);
      envelope.gain.linearRampToValueAtTime(event.amp,time+(event.reverse?duration*.7:.008));
      envelope.gain.linearRampToValueAtTime(event.amp*.65,time+duration*.8);
      envelope.gain.linearRampToValueAtTime(0,time+duration);
      for(const source of [string,vibrato]){source.start(time);source.stop(time+duration+.08);sources.push(source);this.nodes.add(source);}
      group.push(string,drive,cabinet,vibrato,depth);
    }else if(event.type==='kick'){
      envelope.gain.linearRampToValueAtTime(event.amp,time+.005);
      const kick=osc('sine',110,1,.2);
      kick.frequency.exponentialRampToValueAtTime(46,time+.11);
    }else if(event.type==='tick'){
      const noise=c.createBufferSource(),filter=c.createBiquadFilter();noise.buffer=this.noise;
      filter.type='highpass';filter.frequency.value=3700;
      envelope.gain.linearRampToValueAtTime(event.amp,time+.002);
      envelope.gain.exponentialRampToValueAtTime(.00001,time+.09);
      noise.connect(filter).connect(envelope);noise.start(time);noise.stop(time+duration+.08);
      group.push(noise,filter);sources.push(noise);this.nodes.add(noise);
    }else if(event.type==='wood'){
      envelope.gain.linearRampToValueAtTime(event.amp,time+.003);
      osc('sine',f,1,.065,65);osc('sine',f*1.63,.45,.036);
    }else if(event.type==='bass'){
      envelope.gain.linearRampToValueAtTime(event.amp,time+.085);
      osc('sine',f,1,duration*.7);osc('sine',f*2,.15,duration*.55);
    }else if(event.type==='air'){
      envelope.gain.linearRampToValueAtTime(event.amp,time+duration*.3);
      envelope.gain.linearRampToValueAtTime(event.amp*.75,time+duration*.6);
      envelope.gain.linearRampToValueAtTime(0,time+duration);
      // Slow detuning gives the sustained reeds a living, slightly unstable edge.
      osc('sine',f*.998,1,duration*4);osc('sine',f*2.002,.23,duration*3);
      osc('sine',f*3.001,.09,duration*2);
    }else{
      const source=c.createBufferSource(),filter=c.createBiquadFilter();source.buffer=this.noise;source.loop=true;
      filter.type='bandpass';filter.Q.value=1.9;filter.frequency.setValueAtTime(1300,time);
      filter.frequency.linearRampToValueAtTime(700,time+duration);
      envelope.gain.linearRampToValueAtTime(event.amp,time+duration*.35);
      envelope.gain.linearRampToValueAtTime(0,time+duration);
      source.connect(filter).connect(envelope);source.start(time);source.stop(time+duration+.08);
      group.push(source,filter);sources.push(source);this.nodes.add(source);
    }
    let ended=0;
    for(const source of sources)source.onended=()=>{
      this.nodes.delete(source);if(++ended===sources.length)group.forEach(n=>n.disconnect());
    };
  }
  stop(){
    const now=this.ctx.currentTime;this.master.gain.cancelScheduledValues(now);
    this.master.gain.setTargetAtTime(0,now,.025);
    for(const node of this.nodes){try{node.stop(now+.12);}catch{}}
    setTimeout(()=>this.graph.forEach(n=>n.disconnect()),180);
  }
}

export function encodeWav(buffer){
  const frames=buffer.length,channels=buffer.numberOfChannels,bytes=frames*channels*2;
  const out=new ArrayBuffer(44+bytes),view=new DataView(out);
  const text=(at,s)=>{for(let i=0;i<s.length;i++)view.setUint8(at+i,s.charCodeAt(i));};
  text(0,'RIFF');view.setUint32(4,36+bytes,true);text(8,'WAVE');text(12,'fmt ');
  view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,channels,true);
  view.setUint32(24,buffer.sampleRate,true);view.setUint32(28,buffer.sampleRate*channels*2,true);
  view.setUint16(32,channels*2,true);view.setUint16(34,16,true);text(36,'data');view.setUint32(40,bytes,true);
  const data=Array.from({length:channels},(_,i)=>buffer.getChannelData(i));
  for(let i=0;i<frames;i++)for(let ch=0;ch<channels;ch++){
    const value=Math.max(-1,Math.min(1,data[ch][i]));view.setInt16(44+(i*channels+ch)*2,Math.round(value*(value<0?32768:32767)),true);
  }
  return out;
}
