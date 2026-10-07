import {MODES,LAYERS,SECTIONS,makeScore,Instrument,encodeWav} from './score.js';
const $=id=>document.getElementById(id);
let context=null,instrument=null,score=null,playing=false,hookOnly=false,mode='explore',timer=null,start=0,index=0,cycle=0,request=0,offset=0;
let exportBusy=false,solo=null;
const mix=Object.fromEntries(Object.entries(LAYERS).map(([key,layer])=>[key,{level:layer.level,muted:false}]));
const levels=(hook=false)=>Object.fromEntries(Object.keys(LAYERS).map(key=>[key,hook?(key==='theme'?1:0):mix[key].muted||(solo&&solo!==key)?0:mix[key].level]));
const options=()=>({mode,tempo:Number($('tempo').value)});
const format=time=>`${String(Math.floor(time/60)).padStart(2,'0')}:${String(Math.floor(time%60)).padStart(2,'0')}`;
const getPosition=()=>playing?Math.max(0,context.currentTime-start)%score.duration:offset;
function status(text){$('status').textContent=text;}
function showPosition(position=offset,currentScore=makeScore(options())){
  $('clock').textContent=`${format(position)} / ${format(currentScore.duration)}`;
  if(currentScore.hook){$('section-now').textContent='Creature theme · isolated';return;}
  const section=[...currentScore.sections].reverse().find(s=>position>=s.time)||currentScore.sections[0];
  $('section-now').textContent=`${section.name} · bar ${Math.min(32,Math.floor(position/currentScore.beat/4)+1)} / 32`;
  document.querySelectorAll('[data-section]').forEach(b=>b.setAttribute('aria-current',String(Number(b.dataset.section)===section.beat)));
  const progress=position/currentScore.duration*100;$('song-progress').style.width=`${progress}%`;
  $('song-progress').parentElement.setAttribute('aria-valuenow',String(Math.round(progress)));
}
function halt({rewind=false}={}){
  if(playing&&!hookOnly)offset=getPosition();
  if(rewind)offset=0;
  request++;playing=false;clearInterval(timer);instrument?.stop();instrument=null;
  $('play').innerHTML=offset?'Resume song <span>↗</span>':'Play song <span>↗</span>';$('hook').textContent='Hear the hook';
  status('Paused');document.querySelectorAll('[data-note]').forEach(n=>n.classList.remove('active'));
  $('level').style.height='2px';$('organism').style.transform='';
  showPosition();
}
function locateNext(){
  const elapsed=Math.max(0,context.currentTime-start);
  cycle=hookOnly?0:Math.floor(elapsed/score.duration);
  const position=hookOnly?elapsed:elapsed%score.duration;
  index=score.events.findIndex(e=>e.time>=position+.15);
  if(index<0){index=score.events.length;}
}
function schedule(){
  if(!playing||context.state!=='running')return;
  const elapsed=context.currentTime-start;
  if(!hookOnly&&elapsed>cycle*score.duration+score.duration+.2){cycle=Math.floor(elapsed/score.duration);index=0;}
  while(playing){
    if(index>=score.events.length){if(hookOnly)break;cycle++;index=0;}
    const event=score.events[index],at=start+cycle*score.duration+event.time;
    if(at>context.currentTime+.15)break;
    if(at>=context.currentTime-.04)instrument.voice(event,Math.max(context.currentTime+.002,at));
    index++;
  }
  if(hookOnly&&elapsed>=score.duration){halt();status('Hook finished · song position kept');}
}
async function play(hook=false,from=null){
  halt();if(from!==null)offset=from;const token=request;
  try{
    const Audio=window.AudioContext||window.webkitAudioContext;
    if(!Audio)throw new Error('This browser does not support audio synthesis.');
    context??=new Audio();await context.resume();if(token!==request)return;
    hookOnly=hook;score=makeScore({...options(),hook});
    instrument=new Instrument(context,{mode,volume:Number($('volume').value)/100,analyse:true,layers:levels(hook)});
    const position=hook?0:offset%score.duration;
    start=context.currentTime+.08-position;cycle=0;index=score.events.findIndex(e=>e.time>=position);if(index<0)index=score.events.length;
    // Restore any harmony already sounding at a paused or selected position.
    if(position>0)for(const event of score.events){
      if(['air','vowel','guitar'].includes(event.type)&&event.time<position&&event.time+event.duration>position+.4)
        instrument.voice({...event,duration:event.time+event.duration-position},context.currentTime+.08);
    }
    playing=true;$('play').innerHTML='Pause <span>Ⅱ</span>';$('hook').textContent=hook?'Playing the hook…':'Hear the hook';
    status(hook?'Signature only':solo?`Solo · ${LAYERS[solo].name}`:'Song playing · live mix');schedule();timer=setInterval(schedule,30);
  }catch(error){halt();status(error.message||'Audio could not start. Try Play again.');}
}
$('play').addEventListener('click',()=>playing?halt():play(false));
$('hook').addEventListener('click',()=>play(true));
$('restart').addEventListener('click',()=>play(false,0));
$('sections').innerHTML=SECTIONS.map(s=>`<button data-section="${s.beat}" aria-label="Play ${s.name} section">${s.name}</button>`).join('');
for(const button of document.querySelectorAll('[data-section]'))button.addEventListener('click',()=>play(false,Number(button.dataset.section)*60/Number($('tempo').value)));
for(const button of document.querySelectorAll('[data-passage]'))button.addEventListener('click',()=>play(false,Number(button.dataset.passage)*60/Number($('tempo').value)));
for(const button of document.querySelectorAll('[data-mode]'))button.addEventListener('click',()=>{
  mode=button.dataset.mode;
  document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  $('mode-description').textContent=MODES[mode].description;$('scene-name').textContent=MODES[mode].name.toUpperCase();
  if(playing){
    if(hookOnly)play(true);
    else{score=makeScore(options());instrument.setMode(mode);locateNext();status(`${MODES[mode].name} · upcoming phrases`);}
  }
});
$('layer-mixer').innerHTML=Object.entries(LAYERS).map(([key,layer])=>`<div class="stem" data-stem="${key}">
  <div class="stem-head"><h3>${layer.name}</h3><output id="${key}-value">${Math.round(layer.level*100)}%</output></div><p>${layer.detail}</p>
  <input type="range" id="${key}-gain" aria-label="${layer.name} level" min="0" max="120" step="1" value="${Math.round(layer.level*100)}">
  <div class="stem-actions"><button data-mute="${key}" aria-label="Mute ${layer.name}" aria-pressed="false">Mute</button><button class="solo" data-solo="${key}" aria-label="Solo ${layer.name}" aria-pressed="false">Solo</button></div></div>`).join('');
function updateMix(){
  const gains=levels();
  for(const key of Object.keys(LAYERS)){
    const card=document.querySelector(`[data-stem="${key}"]`);
    card.classList.toggle('is-muted',gains[key]===0);card.classList.toggle('is-solo',solo===key);
    card.querySelector('[data-mute]').setAttribute('aria-pressed',String(mix[key].muted));
    card.querySelector('[data-solo]').setAttribute('aria-pressed',String(solo===key));
    $(`${key}-value`).textContent=`${Math.round(mix[key].level*100)}%`;
  }
  instrument?.setLayers(levels(hookOnly));
  if(playing&&!hookOnly)status(solo?`Solo · ${LAYERS[solo].name}`:'Song playing · live mix');
}
for(const key of Object.keys(LAYERS)){
  $(`${key}-gain`).addEventListener('input',()=>{mix[key].level=Number($(`${key}-gain`).value)/100;updateMix();});
  document.querySelector(`[data-mute="${key}"]`).addEventListener('click',()=>{mix[key].muted=!mix[key].muted;updateMix();});
  document.querySelector(`[data-solo="${key}"]`).addEventListener('click',()=>{solo=solo===key?null:key;if(solo)mix[key].muted=false;updateMix();});
}
$('reset-mix').addEventListener('click',()=>{
  solo=null;for(const [key,layer] of Object.entries(LAYERS)){mix[key]={level:layer.level,muted:false};$(`${key}-gain`).value=layer.level*100;}updateMix();
});
$('tempo').addEventListener('input',()=>{$('tempo-value').textContent=`${$('tempo').value} BPM`;});
$('tempo').addEventListener('change',()=>{
  if(playing){const wasHook=hookOnly,beat=wasHook?0:getPosition()/score.beat;play(wasHook,beat*60/Number($('tempo').value));}
  else{offset=0;showPosition();}
});
$('volume').addEventListener('input',()=>{$('volume-value').textContent=`${$('volume').value}%`;instrument?.setVolume(Number($('volume').value)/100);});
// Avoid announcing changing levels or the transport clock every animation frame.
for(const output of document.querySelectorAll('output'))output.setAttribute('aria-live','off');
document.addEventListener('keydown',e=>{
  if(e.code==='Space'&&!['INPUT','BUTTON','SELECT','TEXTAREA'].includes(e.target.tagName)){
    e.preventDefault();playing?halt():play(false);
  }
});
window.addEventListener('pagehide',()=>{halt();context?.close();context=null;});
const samples=new Float32Array(512),reduced=matchMedia('(prefers-reduced-motion: reduce)');
function frame(){
  if(playing&&instrument){
    const position=getPosition();showPosition(position,score);
    instrument.analyser.getFloatTimeDomainData(samples);
    const rms=Math.sqrt(samples.reduce((sum,v)=>sum+v*v,0)/samples.length);
    $('level').style.height=`${Math.min(16,2+rms*250)}px`;
    $('level').parentElement.setAttribute('aria-label',`Audio level ${rms>.00001?Math.round(20*Math.log10(rms)):'−∞'} dB`);
    const gains=levels(hookOnly);
    document.querySelectorAll('[data-note]').forEach(n=>n.classList.toggle('active',gains.theme>0&&score.events.some(e=>e.noteIndex===Number(n.dataset.note)&&position>=e.time&&position<e.time+.42)));
    if(!reduced.matches){
      const pulse=Math.min(.12,rms*1.2),stretch=mode==='contract'?-.12:mode==='grow'?.05:0;
      $('organism').style.transform=`scale(${1+stretch+pulse},${1-stretch*1.4-pulse*.6})`;
    }
  }
  requestAnimationFrame(frame);
}
showPosition();frame();
$('export').addEventListener('click',async()=>{
  if(exportBusy)return;exportBusy=true;$('export').disabled=true;$('export').textContent='Rendering audio…';
  const settings=options(),exportLayers=levels(),stem=solo?`-${solo}`:'';
  try{
    const Offline=window.OfflineAudioContext||window.webkitOfflineAudioContext;
    if(!Offline)throw new Error('WAV export is unavailable in this browser.');
    const composition=makeScore(settings),rate=44100,frames=Math.round(composition.duration*rate),duration=frames/rate;
    const offline=new Offline(2,frames*2,rate);
    const synth=new Instrument(offline,{mode:settings.mode,volume:.8,layers:exportLayers});
    for(let c=0;c<2;c++)for(const event of composition.events)if(exportLayers[event.layer]>0)synth.voice(event,c*duration+event.time);
    const rendered=await offline.startRendering();
    const loop={length:frames,numberOfChannels:2,sampleRate:rate,getChannelData:ch=>rendered.getChannelData(ch).subarray(frames,frames*2)};
    const blob=new Blob([encodeWav(loop)],{type:'audio/wav'}),url=URL.createObjectURL(blob),link=document.createElement('a');
    link.href=url;link.download=`soft-signal-surreal-${settings.mode}${stem}-${settings.tempo}bpm.wav`;link.click();
    setTimeout(()=>URL.revokeObjectURL(url),60000);$('export').textContent='WAV exported ✓';
  }catch(error){status(error.message||'Export failed. Please try again.');$('export').textContent='Export song .wav ↓';}
  finally{exportBusy=false;$('export').disabled=false;}
});
