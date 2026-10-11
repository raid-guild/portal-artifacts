import {DEFAULT_RADIO,RADIO_BY_ID,eventsForStep,midiToHz} from './radio-stations.js';

const MAX_VOICES=64;
const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));

export class ArcadeRadio {
  constructor({contextFactory=()=>new (window.AudioContext||window.webkitAudioContext)(),setTimer=(fn,delay)=>globalThis.setInterval(fn,delay),clearTimer=id=>globalThis.clearInterval(id)}={}){
    this.contextFactory=contextFactory;this.setTimer=setTimer;this.clearTimer=clearTimer;
    this.ctx=null;this.station=DEFAULT_RADIO;this.musicVolume=.45;this.effectsVolume=.45;this.muted=false;
    this.wanted=false;this.hidden=false;this.activity=0;this.timer=null;this.workshopMode=false;
    this.nextStep=0;this.nextTime=0;this.voices=new Set();this.auditionState=null;
  }
  configure(audio){
    this.station=RADIO_BY_ID[audio?.station]?audio.station:DEFAULT_RADIO;
    const previous=Number.isFinite(audio?.volume)?clamp(audio.volume,0,1):.45;
    this.musicVolume=Number.isFinite(audio?.musicVolume)?clamp(audio.musicVolume,0,1):previous;
    this.effectsVolume=Number.isFinite(audio?.effectsVolume)?clamp(audio.effectsVolume,0,1):previous;
    this.muted=!!audio?.muted;this.wanted=!!audio?.playing;
    this.updateLevels();
  }
  ensureContext(){
    if(this.ctx)return this.ctx;
    const ctx=this.contextFactory();this.ctx=ctx;
    this.master=ctx.createGain();this.music=ctx.createGain();this.effects=ctx.createGain();this.duck=ctx.createGain();
    this.duck.gain.value=1;
    this.music.connect(this.duck);this.duck.connect(this.master);this.effects.connect(this.master);this.master.connect(ctx.destination);
    const delay=ctx.createDelay(.5),feedback=ctx.createGain(),wet=ctx.createGain();
    delay.delayTime.value=.24;feedback.gain.value=.17;wet.gain.value=.09;
    this.music.connect(delay);delay.connect(feedback);feedback.connect(delay);delay.connect(wet);wet.connect(this.duck);
    this.updateLevels();
    return ctx;
  }
  updateLevels(){if(this.master)this.master.gain.value=this.muted?0:1;if(this.music)this.music.gain.value=.34*this.musicVolume;if(this.effects)this.effects.gain.value=.58*this.effectsVolume;}
  setMusicVolume(value){this.musicVolume=clamp(Number(value)||0,0,1);this.updateLevels();}
  setEffectsVolume(value){this.effectsVolume=clamp(Number(value)||0,0,1);this.updateLevels();}
  setMuted(value){this.muted=!!value;this.updateLevels();}
  setWorkshopMode(value){const next=!!value;if(next===this.workshopMode)return;this.workshopMode=next;this.stopMusicVoices();this.nextStep=0;if(this.ctx)this.nextTime=this.ctx.currentTime+.04;}
  setActivity(count){this.activity=clamp(count|0,0,9);}
  get playing(){return !!(this.wanted&&!this.hidden&&this.ctx?.state==='running'&&this.timer!==null);}
  async unlockFromGesture(){
    const ctx=this.ensureContext();
    if(ctx.state!=='running')await ctx.resume();
    if(this.wanted&&!this.hidden)this.startLoop();
    return ctx.state==='running';
  }
  async playFromGesture(){const previous=this.wanted;this.wanted=true;try{const started=await this.unlockFromGesture();if(started)return true;}catch{}this.wanted=previous;if(!previous)this.stopLoop();return false;}
  pause(){this.wanted=false;this.stopLoop();}
  setHidden(hidden){
    this.hidden=!!hidden;
    if(this.hidden)this.stopLoop();
    else if(this.wanted&&this.ctx){this.ctx.resume().then(()=>{if(this.wanted&&!this.hidden)this.startLoop();}).catch(()=>{});}
  }
  setStation(id){
    if(!RADIO_BY_ID[id]||id===this.station)return;
    this.station=id;this.stopMusicVoices();this.nextStep=0;this.nextTime=this.ctx?this.ctx.currentTime+.05:0;
  }
  async audition(id){
    if(!RADIO_BY_ID[id])return false;
    if(!this.auditionState)this.auditionState={station:this.station,wanted:this.wanted};
    this.setStation(id);const started=await this.playFromGesture();if(!started)this.endAudition();return started;
  }
  endAudition(){
    const previous=this.auditionState;if(!previous)return;
    this.auditionState=null;this.setStation(previous.station);
    if(!previous.wanted)this.pause();
    else {this.wanted=true;if(!this.hidden&&this.ctx?.state==='running')this.startLoop();}
  }
  startLoop(){
    if(this.timer!==null||!this.wanted||this.hidden||this.ctx?.state!=='running')return;
    this.nextTime=this.ctx.currentTime+.045;this.nextStep=0;
    this.timer=this.setTimer(()=>this.tick(),65);
    this.tick();
  }
  stopLoop(){
    if(this.timer!==null){this.clearTimer(this.timer);this.timer=null;}
    this.stopMusicVoices();
  }
  stopMusicVoices(){for(const voice of [...this.voices])if(voice.music){try{voice.source.stop(this.ctx.currentTime);}catch{}this.voices.delete(voice);}}
  tick(){
    if(!this.playing)return;
    const now=this.ctx.currentTime;
    if(this.nextTime<now-.22)this.nextTime=now+.035;
    const station=RADIO_BY_ID[this.station],stepDuration=60/station.bpm/4;
    let scheduled=0;
    while(this.nextTime<now+.15&&scheduled++<4){
      for(const event of eventsForStep(this.station,this.nextStep,this.activity))this.scheduleEvent(event,this.nextTime,station);
      this.nextStep=(this.nextStep+1)%256;this.nextTime+=stepDuration;
    }
  }
  voice(source,gain,time,duration,music=true){
    if(this.voices.size>=MAX_VOICES)return false;
    gain.connect(music?this.music:this.effects);
    const record={source,music};this.voices.add(record);
    source.onended=()=>this.voices.delete(record);
    source.start(time);source.stop(time+duration+.03);
    return true;
  }
  tone(midi,time,duration,{wave='sine',level=.035,attack=.012,release=.13,music=true,slide=0}={}){
    if(this.voices.size>=MAX_VOICES)return;
    const ctx=this.ctx,osc=ctx.createOscillator(),gain=ctx.createGain(),frequency=midiToHz(midi);
    osc.type=wave;osc.frequency.setValueAtTime(frequency,time);
    if(slide)osc.frequency.exponentialRampToValueAtTime(Math.max(25,frequency*slide),time+duration);
    gain.gain.setValueAtTime(.0001,time);
    gain.gain.linearRampToValueAtTime(level,time+attack);
    gain.gain.setValueAtTime(level*.72,time+Math.max(attack,duration*.65));
    gain.gain.exponentialRampToValueAtTime(.0001,time+duration+release);
    osc.connect(gain);this.voice(osc,gain,time,duration+release,music);
  }
  noise(time,duration,{level=.025,filter='highpass',frequency=4500,music=true}={}){
    if(this.voices.size>=MAX_VOICES)return;
    const ctx=this.ctx;
    if(!this.noiseBuffer){
      const buffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*.5),ctx.sampleRate),data=buffer.getChannelData(0);
      for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;
      this.noiseBuffer=buffer;
    }
    const source=ctx.createBufferSource(),biquad=ctx.createBiquadFilter(),gain=ctx.createGain();
    source.buffer=this.noiseBuffer;biquad.type=filter;biquad.frequency.value=frequency;
    gain.gain.setValueAtTime(level,time);gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
    source.connect(biquad);biquad.connect(gain);this.voice(source,gain,time,duration,music);
  }
  scheduleEvent(event,time,station){
    const quiet=this.workshopMode&&!this.auditionState;
    if(quiet&&event.kind!=='chord')return;
    switch(event.kind){
      case 'chord':for(const note of event.notes)this.tone(note,time,event.duration,{wave:station.wave,level:quiet?.007:station.id==='afterburn'?.009:.014,attack:station.id==='glass'?.28:.09,release:.34});break;
      case 'bass':this.tone(event.note,time,event.duration,{wave:station.id==='afterburn'?'sawtooth':'triangle',level:.064,attack:.008,release:.08});break;
      case 'lead':this.tone(event.note,time,event.duration,{wave:station.leadWave,level:station.id==='glass'?.038:.055,attack:.013,release:station.id==='glass'?.38:.1});break;
      case 'accent':this.tone(event.note,time,event.duration,{wave:'sine',level:.025,attack:.008,release:.12});break;
      case 'kick':this.tone(38,time,.17,{wave:'sine',level:.18,attack:.003,release:.06,slide:.42});break;
      case 'snare':this.noise(time,.11,{level:.055,filter:'bandpass',frequency:1800});break;
      case 'hat':this.noise(time,.045,{level:station.id==='afterburn'?.022:.014});break;
    }
  }
  sfx(kind){
    if(!this.ctx||this.ctx.state!=='running'||this.muted)return;
    const config={drop:[67,.12,.065,.48],bounce:[53,.12,.045,1.9],clack:[83,.07,.033,.5],score:[73,.22,.072,1.7],free:[76,.27,.075,1.8],jackpot:[57,.6,.095,3.2]}[kind];
    if(!config)return;
    const [midi,duration,level,slide]=config,time=this.ctx.currentTime;
    this.tone(midi,time,duration,{wave:kind==='clack'?'square':'sine',level,attack:.004,release:.06,music:false,slide});
    if(kind==='clack')this.noise(time,.035,{level:.017,frequency:3400,music:false});
    if(kind==='jackpot')for(const [offset,delay] of [[7,.08],[12,.17],[19,.29]])this.tone(midi+offset,time+delay,.3,{wave:'triangle',level:.038,release:.16,music:false});
  }
  duckForJackpot(){
    if(!this.duck||!this.ctx||!this.playing)return;
    const t=this.ctx.currentTime,gain=this.duck.gain;
    gain.cancelScheduledValues(t);gain.setValueAtTime(gain.value,t);
    gain.linearRampToValueAtTime(.22,t+.06);
    gain.linearRampToValueAtTime(1,t+1.5);
  }
  async dispose(){this.pause();for(const voice of [...this.voices]){try{voice.source.stop(this.ctx.currentTime);}catch{}}this.voices.clear();if(this.ctx)await this.ctx.close();this.ctx=null;}
}
