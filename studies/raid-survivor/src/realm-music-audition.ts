import {makeVaultRunnerEngine,vaultRunnerMusic} from './music';
import {makeRealmMusicEngine,REALM_TRACKS,LOOP_STEPS,type MusicLevel} from './newrealm-music';

const select=document.querySelector<HTMLSelectElement>('#realm')!;
const title=document.querySelector<HTMLElement>('#title')!,metadata=document.querySelector<HTMLElement>('#metadata')!;
const status=document.querySelector<HTMLElement>('#status')!,result=document.querySelector<HTMLElement>('#loopResult')!;
const play=document.querySelector<HTMLButtonElement>('#play')!,stop=document.querySelector<HTMLButtonElement>('#stop')!,mute=document.querySelector<HTMLButtonElement>('#mute')!,check=document.querySelector<HTMLButtonElement>('#check')!;
const volume=document.querySelector<HTMLInputElement>('#volume')!,volumeValue=document.querySelector<HTMLOutputElement>('#volumeValue')!;

function refresh(){const level=select.value as MusicLevel,track=REALM_TRACKS[level],snapshot=vaultRunnerMusic.snapshot();title.textContent=track.title;metadata.textContent=`${track.bpm} BPM · ${track.key} · 64 bars · ${track.acts.join(' / ')}`;status.textContent=snapshot.playing?`Playing ${snapshot.track} · bar ${Math.floor(snapshot.step/16)+1} / 64`:'Stopped. Press Play to start audio.';mute.textContent=snapshot.muted?'Unmute':'Mute';volume.value=String(snapshot.volume);volumeValue.value=`${Math.round(snapshot.volume)}%`;}
select.onchange=()=>{void vaultRunnerMusic.selectLevel(select.value as MusicLevel).then(refresh);refresh();};
play.onclick=async()=>{const selection=vaultRunnerMusic.selectLevel(select.value as MusicLevel),started=vaultRunnerMusic.start();await Promise.all([selection,started]);refresh();};
stop.onclick=async()=>{stop.disabled=true;await vaultRunnerMusic.stop();stop.disabled=false;refresh();};
mute.onclick=()=>{vaultRunnerMusic.toggleMuted();refresh();};
volume.oninput=()=>{vaultRunnerMusic.setVolume(Number(volume.value));refresh();};
setInterval(()=>{if(vaultRunnerMusic.snapshot().playing)refresh();},250);
refresh();

check.onclick=async()=>{
  check.disabled=true;result.textContent='Rendering the four-bar boundary excerpt offline…';
  try{
    const level=select.value as MusicLevel,bpm=REALM_TRACKS[level].bpm,sixteenth=60/bpm/4,rate=22050;
    const seam=.1+32*sixteenth,length=.1+64*sixteenth+2;
    const context=new OfflineAudioContext(2,Math.ceil(length*rate),rate);
    const engine=level==='training'?makeVaultRunnerEngine(context,38):makeRealmMusicEngine(context,level,38);
    for(let i=0;i<64;i++)engine.schedule((LOOP_STEPS-32+i)%LOOP_STEPS,.1+i*sixteenth);
    const rendered=await context.startRendering();let sum=0,peak=0,finite=true,count=0,before=0,after=0,windowCount=0;
    const edge=Math.floor(seam*rate),window=Math.floor(.2*rate);
    for(let channel=0;channel<rendered.numberOfChannels;channel++){
      const data=rendered.getChannelData(channel);
      for(let i=0;i<data.length;i++){const value=data[i];if(!Number.isFinite(value)){finite=false;continue;}sum+=value*value;peak=Math.max(peak,Math.abs(value));count++;if(i>=edge-window&&i<edge){before+=value*value;windowCount++;}if(i>=edge&&i<edge+window)after+=value*value;}
    }
    const rms=Math.sqrt(sum/Math.max(1,count)),edgeBefore=Math.sqrt(before/Math.max(1,windowCount)),edgeAfter=Math.sqrt(after/Math.max(1,windowCount));
    result.textContent=`${REALM_TRACKS[level].title}: ${finite?'finite':'NON-FINITE'} · peak ${peak.toFixed(3)} · RMS ${rms.toFixed(3)}\nBoundary window RMS: before ${edgeBefore.toFixed(3)} / after ${edgeAfter.toFixed(3)} · last 2 bars → first 2 bars.`;
    void engine.stop();
  }catch(error){result.textContent=`Loop check could not render: ${error instanceof Error?error.message:String(error)}`;}
  finally{check.disabled=false;}
};
