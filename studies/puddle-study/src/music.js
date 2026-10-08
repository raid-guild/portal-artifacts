// One persistent soundtrack player: changing a physics setup never restarts it.
export function setupMusic(){
  const audio=document.querySelector('#soundtrack'),button=document.querySelector('#music-toggle');
  const volume=document.querySelector('#music-volume'),status=document.querySelector('#music-status');
  audio.src=`${import.meta.env?.BASE_URL??'/'}audio/soft-signal.mp3`;
  audio.volume=Number(volume.value)/100;
  let enabled=false,request=0,userChose=false;
  function render(message){
    button.textContent=enabled?'MUSIC ON':'MUSIC OFF';
    button.setAttribute('aria-pressed',String(enabled));
    status.textContent=message||(enabled?'Soft Signal · playing':'Soft Signal · tap to listen');
  }
  async function play(){
    const token=++request;render('Soft Signal · loading');
    try{
      if(audio.error)audio.load();
      await audio.play();
      if(token!==request){if(!enabled||document.hidden)audio.pause();return;}
      render();
    }catch{
      if(token!==request)return;
      enabled=false;audio.pause();render('Tap Music to retry playback');
    }
  }
  function toggle(){
    userChose=true;enabled=!enabled;
    if(enabled)void play();else{request++;audio.pause();render();}
  }
  function changeVolume(){audio.volume=Number(volume.value)/100;}
  function visibility(){
    if(document.hidden){request++;audio.pause();if(enabled)render('Soft Signal · paused while away');}
    else if(enabled)void play();
  }
  function failure(){request++;enabled=false;audio.pause();render('Music unavailable · tap to retry');}
  button.addEventListener('click',toggle);volume.addEventListener('input',changeVolume);
  document.addEventListener('visibilitychange',visibility);audio.addEventListener('error',failure);
  render();
  const dispose=()=>{request++;enabled=false;audio.pause();button.removeEventListener('click',toggle);
    volume.removeEventListener('input',changeVolume);document.removeEventListener('visibilitychange',visibility);audio.removeEventListener('error',failure);};
  dispose.begin=()=>{if(!userChose)enabled=true;if(enabled&&audio.paused)void play();};
  return dispose;
}
