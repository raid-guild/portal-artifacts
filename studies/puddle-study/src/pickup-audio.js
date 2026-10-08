// Small synthesized motifs related to Soft Signal's D–A–B-flat–E–D hook.
// No audio context is created before a user gesture.
export function setupPickupAudio(){
  let context=null,master=null,enabled=true,garden=null,heard=new Set();
  const button=document.createElement('button');button.id='effects-toggle';button.title='Pickup sounds';button.textContent='SOUND ON';button.setAttribute('aria-pressed','true');
  document.querySelector('.music-controls').append(button);
  function unlock(){
    const Audio=window.AudioContext||window.webkitAudioContext;
    if(!Audio)return;
    if(!context){context=new Audio();master=context.createGain();master.gain.value=enabled?1:0;master.connect(context.destination);}
    if(context.state==='suspended')void context.resume().catch(()=>{});
  }
  function toggle(){enabled=!enabled;button.textContent=enabled?'SOUND ON':'SOUND OFF';button.setAttribute('aria-pressed',String(enabled));if(enabled)unlock();if(master)master.gain.setValueAtTime(enabled?1:0,context.currentTime);}
  button.addEventListener('click',toggle);
  function tone(frequency,time,length,gain,bend=1){
    const oscillator=context.createOscillator(),envelope=context.createGain();
    oscillator.type='sine';oscillator.frequency.setValueAtTime(frequency*bend,time);oscillator.frequency.exponentialRampToValueAtTime(frequency,time+.065);
    envelope.gain.setValueAtTime(0,time);envelope.gain.linearRampToValueAtTime(gain,time+.012);envelope.gain.exponentialRampToValueAtTime(.0001,time+length);
    oscillator.connect(envelope);envelope.connect(master);oscillator.start(time);oscillator.stop(time+length+.025);
    oscillator.onended=()=>{oscillator.disconnect();envelope.disconnect();};
  }
  function sound(kind,id,delay){
    if(!enabled||!context||context.state!=='running'||document.hidden)return;
    const t=context.currentTime+delay,notes=[587.33,880,932.33,659.25,587.33];
    if(kind==='gold'){
      const note=notes[id%notes.length];tone(note,t,.2,.045,1.18);tone(note/2,t,.12,.022,.7);
    }else{
      [293.66,440,466.16,659.25,587.33].forEach((note,i)=>tone(note,t+i*.065,.55,.04,1.025));
      tone(146.83,t,.42,.035,.65);
    }
  }
  return {unlock,update(next){
    if(next!==garden){garden=next;heard=new Set();}
    if(!next)return;
    let delay=0;
    for(const [kind,items] of [['gold',next.gold],['gem',next.gems]])for(const item of items){
      const key=`${kind}-${item.id}`;
      if(item.collected&&!heard.has(key)){heard.add(key);if(next.elapsed-item.collectedAt<.3){sound(kind,item.id,delay);delay+=.035;}}
    }
  },dispose(){button.removeEventListener('click',toggle);button.remove();if(context)void context.close();}};
}
