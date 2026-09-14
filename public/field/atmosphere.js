import {isMusicRoom} from './maze-core.js';
// Original user track leaks from a fixed point just behind selected room walls.
export function wallMusicMix(model,player,yaw){
 let best={gain:0,pan:0,cutoff:420};if(!model)return best;
 for(const [index,chunk] of model.chunks){
  if(!isMusicRoom(index,chunk.room))continue;
  const dx=model.offset.x+chunk.room.w/2+.35-player.x,dz=model.worldZ(index)+1-player.z,d=Math.hypot(dx,dz);
  const gain=.8*Math.pow(Math.max(0,1-d/16),1.25);
  if(gain>best.gain)best={gain,pan:Math.max(-.9,Math.min(.9,(dx*Math.cos(yaw)-dz*Math.sin(yaw))/Math.max(1,d))),cutoff:1000+3200*Math.max(0,1-d/12)};
 }return best;
}
export class Atmosphere {
 constructor(context,output){
  this.ctx=context;this.output=output;this.nextImpact=0;this.lastImpact=-10;
  const c=context;
  this.noise=c.createBuffer(1,c.sampleRate*4,c.sampleRate);
  const data=this.noise.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;
  const source=c.createBufferSource();source.buffer=this.noise;source.loop=true;
  const low=c.createBiquadFilter();low.type='lowpass';low.frequency.value=850;
  this.air=c.createGain();this.air.gain.value=.045;source.connect(low);low.connect(this.air);this.air.connect(output);source.start();
  this.buzz=c.createGain();this.buzz.gain.value=.008;this.buzz.connect(output);
  for(const [frequency,type] of [[60,'sine'],[120,'triangle'],[240,'sine']]){const o=c.createOscillator();o.type=type;o.frequency.value=frequency;o.connect(this.buzz);o.start();}
  const hiss=c.createBiquadFilter();hiss.type='bandpass';hiss.frequency.value=2300;hiss.Q.value=1.2;
  this.hiss=c.createGain();this.hiss.gain.value=.007;source.connect(hiss);hiss.connect(this.hiss);this.hiss.connect(output);
 }
 initMusic(){
  if(this.music)return;const c=this.ctx;
  this.music=new Audio('./assets/office-doom.mp3');this.music.loop=true;this.music.preload='none';
  const source=c.createMediaElementSource(this.music);this.musicLow=c.createBiquadFilter();this.musicLow.type='lowpass';this.musicLow.frequency.value=420;
  const high=c.createBiquadFilter();high.type='highpass';high.frequency.value=45;
  this.musicPan=c.createStereoPanner();this.musicGain=c.createGain();this.musicGain.gain.value=0;
  source.connect(high);high.connect(this.musicLow);this.musicLow.connect(this.musicPan);this.musicPan.connect(this.musicGain);this.musicGain.connect(this.output);
 }
 setMusicActive(active){if(!this.music)return;if(active)this.music.play().then(()=>{this.musicBlocked=false;}).catch(()=>{this.musicBlocked=true;});else this.music.pause();}
 update({stage,anomaly,depth,room,index,time,active,model,player,yaw=0}){
  const c=this.ctx,t=c.currentTime;let musicPresence=0;
  if(this.musicGain){const mix=active&&player?wallMusicMix(model,player,yaw):{gain:0,pan:0,cutoff:420};musicPresence=Math.min(1,mix.gain/.5);this.musicGain.gain.setTargetAtTime(mix.gain,t,.6);this.musicPan.pan.setTargetAtTime(mix.pan,t,.12);this.musicLow.frequency.setTargetAtTime(mix.cutoff,t,.4);}
  const tension=Math.min(1,anomaly/48),occupied=stage>=2;
  this.air.gain.setTargetAtTime(active?((occupied?.04:.015)+tension*.025)*(1-musicPresence*.65):0,t,.7);
  const flicker=depth>=2&&Math.sin(time*.65+index*1.7)>.87?(Math.sin(time*8.3+index)>.2?.18:.75):1;
  this.buzz.gain.setTargetAtTime(active&&occupied?(room==='empty'?.003:.012)*flicker*(1-musicPresence*.5):0,t,.04);
  this.hiss.gain.setTargetAtTime(active&&occupied?(.004+tension*.009)*(1-musicPresence*.65):0,t,.3);
  if(!active){this.nextImpact=t+8;return;}
  if(stage>=4&&t>=this.nextImpact){this.impact();this.nextImpact=t+12+Math.random()*22;}
 }
 impact(){
  const c=this.ctx,t=c.currentTime;if(t-this.lastImpact<4)return;this.lastImpact=t;
  const pan=c.createStereoPanner();pan.pan.value=(Math.random()>.5?1:-1)*(.35+Math.random()*.5);
  const low=c.createBiquadFilter();low.type='lowpass';low.frequency.value=450+Math.random()*450;low.connect(pan);pan.connect(this.output);
  // Inharmonic metal resonances, softened by distance, with a quieter second knock.
  const nodes=[low,pan];let remaining=0;
  const done=()=>{if(--remaining===0)for(const n of nodes)n.disconnect();};
  for(const delay of [0,.23+Math.random()*.25]){
   for(const f of [47,113,281,467]){const o=c.createOscillator(),g=c.createGain();o.frequency.value=f*(.8+Math.random()*.3);const start=t+delay;
    g.gain.setValueAtTime(0,start);g.gain.linearRampToValueAtTime((delay?.018:.045)*(f>200?.35:1),start+.012);g.gain.exponentialRampToValueAtTime(.0001,start+1.8);
    o.connect(g);g.connect(low);nodes.push(o,g);remaining++;o.onended=done;o.start(start);o.stop(start+2);
   }
  }
  const hit=c.createBufferSource(),env=c.createGain();hit.buffer=this.noise;env.gain.setValueAtTime(.07,t);env.gain.exponentialRampToValueAtTime(.0001,t+.16);hit.connect(env);env.connect(low);nodes.push(hit,env);remaining++;hit.onended=done;hit.start(t);hit.stop(t+.2);
 }
}
