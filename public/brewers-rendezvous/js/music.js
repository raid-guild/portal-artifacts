// One user-started looping track; visual performance follows actual media events.
export function createStageMusic(audio, onChange = () => {}) {
  let playing=false, pending=false, started=false, error='', intent=false, revision=0, disposed=false;
  audio.loop=true;
  const listeners=[];
  const snapshot=()=>({playing,pending,started,error,ended:audio.ended,muted:audio.muted,volume:audio.volume});
  const emit=()=>{if(!disposed)onChange(snapshot());};
  const on=(event,handler)=>{audio.addEventListener(event,handler);listeners.push([event,handler]);};
  on('playing',()=>{if(!intent){audio.pause();return;}playing=true;pending=false;started=true;error='';emit();});
  on('waiting',()=>{playing=false;pending=intent;emit();});
  on('pause',()=>{playing=false;pending=false;emit();});
  on('ended',()=>{intent=false;playing=false;pending=false;emit();});
  on('error',()=>{intent=false;playing=false;pending=false;error='The song could not load. Please try again.';emit();});
  on('volumechange',emit);
  function stop(){revision++;intent=false;pending=false;playing=false;error='';audio.pause();audio.currentTime=0;emit();}
  function start(){
    if(disposed)return;
    const attempt=++revision;intent=true;pending=true;error='';
    if(audio.error)audio.load();
    if(audio.ended)audio.currentTime=0;
    // Keep play() inside the caller's click handler for browser permission.
    let result;
    try {result=audio.play();} catch(err){result=Promise.reject(err);}
    emit();
    Promise.resolve(result).then(()=>{if(disposed||attempt!==revision){if(!intent)audio.pause();}}).catch(()=>{
      if(disposed||attempt!==revision)return;
      intent=false;playing=false;pending=false;error='Playback did not start. Tap Start to try again.';emit();
    });
  }
  return {start,stop,snapshot,toggle:()=>playing||pending?stop():start(),mute:()=>{audio.muted=!audio.muted;},setVolume:value=>{audio.volume=Math.max(0,Math.min(1,Number(value)));},dispose(){stop();disposed=true;for(const [event,handler] of listeners)audio.removeEventListener(event,handler);}};
}
