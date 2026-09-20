'use strict';
const $=id=>document.getElementById(id), room=$('room');
let still=matchMedia('(prefers-reduced-motion: reduce)').matches, focused=false;
function setMotion(){room.classList.toggle('still',still);$('motion').textContent=still?'Resume motion':'Pause motion';$('motion').setAttribute('aria-pressed',String(still));if(typeof wakeScene==='function')wakeScene();}
setMotion();$('motion').onclick=()=>{still=!still;setMotion()};
function focusRoom(v){focused=v;room.classList.toggle('focused',v);(v?$('restore'):$('focus')).focus()}
$('focus').onclick=()=>focusRoom(true);$('restore').onclick=()=>focusRoom(false);
document.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='h'&&!['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName))focusRoom(!focused);if(e.key==='Escape'&&focused)focusRoom(false)});
$('full').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await room.requestFullscreen()}catch{$('notice').textContent='Fullscreen is not available in this browser.';setTimeout(()=>$('notice').textContent='',4500)}};
document.addEventListener('fullscreenchange',()=>{$('full').setAttribute('aria-label',document.fullscreenElement?'Exit fullscreen':'Enter fullscreen')});
const tracks=window.WALKER_TRACKS;
tracks.forEach((track,i)=>{const option=document.createElement('option');option.value=i;option.textContent=track.title;$('trackSelect').append(option)});
let ac,cabinGain,windFilter,playing=false,busy=false,index=0,active=0,fade=null;
const decks=[new Audio(),new Audio()];let gains=[];
decks.forEach(d=>{d.preload='auto';d.volume=1});
function loadDeck(slot,n){decks[slot].src=tracks[n].src;decks[slot].load()}
loadDeck(0,0);loadDeck(1,1);
function init(){ac=new (window.AudioContext||window.webkitAudioContext)();gains=decks.map(d=>{const gain=ac.createGain();gain.gain.value=0;ac.createMediaElementSource(d).connect(gain).connect(ac.destination);return gain});cabinGain=ac.createGain();cabinGain.connect(ac.destination);const noise=ac.createBuffer(1,ac.sampleRate*6,ac.sampleRate),data=noise.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;const source=ac.createBufferSource();source.buffer=noise;source.loop=true;windFilter=ac.createBiquadFilter();windFilter.type='lowpass';windFilter.frequency.value=420;source.connect(windFilter).connect(cabinGain);source.start();const engine=ac.createOscillator(),engineGain=ac.createGain(),lfo=ac.createOscillator(),lfoGain=ac.createGain();engine.frequency.value=48;engineGain.gain.value=.15;lfo.frequency.value=.19;lfoGain.gain.value=.025;lfo.connect(lfoGain).connect(engineGain.gain);engine.connect(engineGain).connect(cabinGain);engine.start();lfo.start();volumes()}
function volumes(){if(!ac)return;const volume=+$('music').value/100*.8;let mix=fade?Math.min(1,(ac.currentTime-fade.start)/fade.duration):0;gains[active].gain.setTargetAtTime(volume*(fade?Math.cos(mix*Math.PI/2):1),ac.currentTime,.04);gains[1-active].gain.setTargetAtTime(volume*(fade?Math.sin(mix*Math.PI/2):0),ac.currentTime,.04);cabinGain.gain.setTargetAtTime(+$('weather').value/100*.15,ac.currentTime,.2);windFilter.frequency.setTargetAtTime($('conditions').value==='rain'?1800:$('conditions').value==='dust'?700:320,ac.currentTime,.5)}
function update(){ $('startOverlay').hidden=playing;$('startListening').textContent='▶ Start listening';$('startListening').disabled=false;room.classList.toggle('playing',playing);$('playIcon').textContent=playing?'Ⅱ':'▶';$('play').setAttribute('aria-label',playing?'Pause sound':'Play sound');$('play').setAttribute('aria-pressed',String(playing));$('status').textContent=playing?'RECEIVING · REPEAT ALL':'RADIO STANDBY';$('trackSelect').value=index;$('trackNote').textContent=`${index+1} / ${tracks.length} · Repeat all`}
function finishFade(){if(!fade)return;decks[active].pause();active=1-active;index=(index+1)%tracks.length;fade=null;loadDeck(1-active,(index+1)%tracks.length);volumes();update()}
async function transition(duration){if(fade||busy||!playing)return;busy=true;try{await decks[1-active].play();fade={start:ac.currentTime,duration};if(duration===0)finishFade()}catch{$('notice').textContent='The next song could not load. Use Next to retry.'}finally{busy=false}}
setInterval(()=>{if(!playing||!ac)return;if(fade){if(ac.currentTime-fade.start>=fade.duration)finishFade();else volumes()}else{const d=decks[active],remaining=d.duration-d.currentTime;if(Number.isFinite(remaining)&&remaining<=3&&remaining>0&&decks[1-active].readyState>=3)transition(Math.max(.1,remaining))}},80);
decks.forEach((d,i)=>{d.addEventListener('ended',()=>{if(i===active&&playing){if(fade)finishFade();else transition(0)}});d.addEventListener('error',()=>{if(i===active)$('notice').textContent='This song could not load. Choose another song or press Next.'})});
$('play').onclick=async()=>{if(busy)return;busy=true;$('startListening').disabled=true;$('startListening').textContent='Starting…';try{if(!ac)init();if(playing){decks.forEach(d=>d.pause());await ac.suspend();playing=false}else{await ac.resume();await decks[active].play();if(fade)await decks[1-active].play();playing=true;volumes()}$('notice').textContent='';update()}catch{decks.forEach(d=>d.pause());if(ac)await ac.suspend();playing=false;update();$('notice').textContent='Playback could not start. Press Play to try again.'}finally{busy=false}};
async function choose(n){if(busy)return;busy=true;try{decks.forEach(d=>d.pause());fade=null;index=n;loadDeck(active,index);loadDeck(1-active,(index+1)%tracks.length);if(playing){await ac.resume();await decks[active].play()}volumes();$('notice').textContent='';update()}catch{playing=false;if(ac)await ac.suspend();update();$('notice').textContent='This song could not start. Press Play to retry.'}finally{busy=false}}
$('next').onclick=()=>choose((index+1)%tracks.length);$('trackSelect').onchange=()=>choose(+$('trackSelect').value);$('music').oninput=volumes;$('weather').oninput=volumes;
const canvas=$('rain'),g=canvas.getContext('2d');
let w=0,h=0,last=null,elapsed=0,cycle=0,nightLevel=1,frame=null;
const art=document.querySelector('.art');
const scene=WalkerScene.create();
function resize(){w=innerWidth;h=room.clientHeight;const d=Math.min(devicePixelRatio,2);canvas.width=w*d;canvas.height=h*d;g.setTransform(d,0,0,d,0,0);wakeScene()}
addEventListener('resize',resize);new ResizeObserver(resize).observe(room);resize();
function light(){const mode=$('daytime').value;let night=mode==='night'?1:0,dusk=mode==='dusk'?1:0;if(mode==='auto'){night=(1-Math.cos(cycle/360*Math.PI*2))/2;dusk=Math.pow(Math.sin(cycle/360*Math.PI*2),6)*.65}nightLevel=night;room.style.setProperty('--night',night);room.style.setProperty('--dusk',dusk);room.style.setProperty('--scene-brightness',1-night*.65);room.style.setProperty('--scene-saturation',1-night*.32);room.style.setProperty('--scene-sepia',dusk*.36);$('clock').textContent=mode==='auto'?'DAY / NIGHT · 6 MIN CYCLE':mode.toUpperCase()+' / '+$('conditions').selectedOptions[0].textContent.toUpperCase()}
$('daytime').onchange=()=>{cycle=0;light();wakeScene()};
$('conditions').onchange=()=>{room.dataset.weather=$('conditions').value;volumes();light();wakeScene()};light();
function wakeScene(){
  // setMotion runs before the scene is initialized on first load.
  if(typeof sceneReady==='undefined'||!sceneReady)return;
  if(frame===null&&!document.hidden)frame=requestAnimationFrame(draw);
}
function draw(t){
  frame=null;
  const dt=last===null?0:Math.min((t-last)/1000,.05);last=t;
  if(!still&&!document.hidden){elapsed+=dt;cycle=(cycle+dt)%360;if($('daytime').value==='auto')light()}
  scene.render(g,art,{width:w,height:h,time:elapsed,night:nightLevel,weather:$('conditions').value,motion:!still});
  if(!still&&!document.hidden)frame=requestAnimationFrame(draw);
}
var sceneReady=true;
document.addEventListener('visibilitychange',()=>{last=null;if(document.hidden&&frame!==null){cancelAnimationFrame(frame);frame=null}else wakeScene()});
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',e=>{still=e.matches;setMotion()});
wakeScene();

$('startListening').onclick=()=> $('play').onclick();
