const channels=[['Walker Radio','walker-radio.mp3'],['Orbital Rad','orbital-rad.mp3'],['Docking Lights','docking-lights.mp3']];
export function createShipRadio(){
 const audio=new Audio();audio.id='field-radio-audio';audio.hidden=true;audio.preload='none';audio.loop=true;document.body.append(audio);
 const channel=document.querySelector('#radio-channel'),volume=document.querySelector('#radio-volume'),status=document.querySelector('#radio-status'),level=document.querySelector('#radio-volume-value');
 let inside=false,current=0,request=0;
 function sync(){const id=++request;const c=Number(channel.value)-1;if(c!==current||!audio.src){current=c;audio.src='/desert-walker/assets/'+channels[c][1];}audio.volume=Number(volume.value)/100;level.textContent=volume.value==='0'?'Off':volume.value+'%';status.textContent=`CH 0${c+1} · ${channels[c][0]}`;
  if(!inside||document.hidden||audio.volume===0){audio.pause();return;}audio.play().catch(e=>{if(id!==request||e.name==='AbortError')return;status.textContent='Reception unavailable · raise volume to retry';});
 }
 channel.oninput=sync;volume.oninput=sync;document.addEventListener('visibilitychange',sync);sync();
 return {setInside(v){inside=v;sync();},get text(){return status.textContent;},get volume(){return Number(volume.value);},tune(){channel.value=String(Number(channel.value)%3+1);sync();},adjust(delta){volume.value=String(Math.max(0,Math.min(100,Number(volume.value)+delta)));sync();}};
}
