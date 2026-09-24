import {neighbors,stageTrack} from './neighbors.js';
import {createStageMusic} from './music.js';

export function createNeighborUI({getPark,beforeVisit,isFallback}) {
  const $=id=>document.getElementById(id);
  const dialog=document.createElement('dialog');
  dialog.className='neighbor-dialog';dialog.setAttribute('aria-labelledby','neighbor-title');
  dialog.innerHTML=`<div class="neighbor-dialog-head"><span class="eyebrow">AROUND THE PARK</span><button type="button" class="neighbor-close" aria-label="Close conversation">×</button></div><h2 id="neighbor-title"></h2><div id="neighbor-dialog-body"></div><p class="neighbor-fiction">These animal hosts are fictional. Their local-history stories link to real sources.</p>`;
  document.body.append(dialog);
  const dock=document.createElement('section');dock.className='neighbor-dock';dock.hidden=true;dock.setAttribute('aria-label','Meet a neighbor');
  dock.innerHTML='<div><strong id="neighbor-dock-name"></strong><p id="neighbor-status" role="status"></p></div><button id="neighbor-talk" class="primary-button" type="button"></button><button id="neighbor-cancel" type="button" aria-label="Cancel visit">×</button>';
  $('experience').append(dock);
  const musicPanel=document.createElement('section');musicPanel.className='stage-player';musicPanel.hidden=true;musicPanel.setAttribute('aria-label','Stage music');
  musicPanel.innerHTML='<div><strong>♫ Beer Crossing</strong><span id="music-status" role="status"></span></div><button id="music-toggle" type="button">Start</button><button id="music-mute" type="button" aria-pressed="false">Mute</button><label>Volume <input id="music-volume" type="range" min="0" max="1" step="0.05" value="0.55"></label>';
  $('experience').append(musicPanel);
  const audio=new Audio(stageTrack.src);audio.preload='none';audio.volume=.55;
  let selected=null,previousFocus=null,dialogMode=null;
  function renderMusic(state){
    musicPanel.hidden=!(state.started||state.pending||state.error);
    $('music-status').textContent=state.error|| (state.pending?'Loading…':state.playing?'Looping at the riverside stage':'Stopped');
    $('music-toggle').textContent=state.playing||state.pending?'Stop':'Start';
    $('music-mute').textContent=state.muted?'Unmute':'Mute';$('music-mute').setAttribute('aria-pressed',String(state.muted));
    $('music-volume').value=state.volume;
    const playButton=dialog.querySelector('[data-stage-play]');
    if(playButton)playButton.textContent=state.playing||state.pending?'Stop music':`Start ${stageTrack.title}`;
    const message=dialog.querySelector('[data-stage-status]');if(message)message.textContent=state.error|| (state.pending?'Getting the keys ready…':state.playing?'We’ll keep playing until you ask us to stop. Wander while you listen!':'Press Start and we’ll keep the song on a loop until you press Stop.');
    getPark()?.setBandPlaying(state.playing);
  }
  const music=createStageMusic(audio,renderMusic);
  $('music-toggle').addEventListener('click',music.toggle);
  $('music-mute').addEventListener('click',music.mute);
  $('music-volume').addEventListener('input',event=>music.setVolume(event.target.value));
  function status(){return isFallback()?'ready':getPark()?.getNeighborStatus(selected?.id)??'far';}
  function renderDock(){
    dock.hidden=!selected;
    if(!selected)return;
    $('story-card').hidden=true;
    const value=status();
    $('neighbor-dock-name').textContent=selected.name;
    $('neighbor-status').textContent=value==='approaching'?'Walking over…':value==='ready'?selected.kind==='music'?'The band is ready for a request.':'You’re close enough for a chat.':'Walk over to say hello.';
    $('neighbor-talk').disabled=value==='approaching';
    $('neighbor-talk').textContent=value==='ready'?(selected.kind==='music'?'Request a song':`Talk to ${selected.name}`):'Walk over';
  }
  function restoreFocus(){const focus=previousFocus?.isConnected&&previousFocus.getClientRects().length?previousFocus:$('neighbors-toggle');focus?.focus();}
  function closeDialog(){if(!dialog.open)return;const mode=dialogMode;dialogMode=null;dialog.close();if(mode==='chat'){selected=null;dock.hidden=true;$('story-card').hidden=false;}restoreFocus();}
  function dismiss(){closeDialog();selected=null;dock.hidden=true;$('story-card').hidden=false;getPark()?.cancelApproach();}
  function openDialog(mode,title){
    previousFocus=document.activeElement;dialogMode=mode;
    $('neighbor-title').textContent=title;$('neighbor-dialog-body').replaceChildren();
    if(!dialog.open)dialog.showModal();dialog.querySelector('.neighbor-close').focus();
    getPark()?.cancelApproach();getPark()?.clearMovement();
  }
  dialog.querySelector('.neighbor-close').addEventListener('click',closeDialog);
  dialog.addEventListener('cancel',event=>{event.preventDefault();closeDialog();});
  function visit(id){
    const next=neighbors.find(n=>n.id===id);if(!next)return;
    closeDialog();beforeVisit();selected=next;
    if(status()==='ready'){renderDock();talk();return;}
    getPark()?.goToNeighbor(id);renderDock();
  }
  function sourceLink(label,url){const link=document.createElement('a');link.textContent=`${label} ↗`;link.href=url;link.target='_blank';link.rel='noopener noreferrer';return link;}
  function talk(){
    if(!selected)return;
    if(status()!=='ready'){getPark()?.goToNeighbor(selected.id);renderDock();return;}
    const person=selected;openDialog('chat',person.name);
    const body=$('neighbor-dialog-body');const intro=document.createElement('p');intro.textContent=person.intro;body.append(intro);
    if(person.kind==='music'){
      const credit=document.createElement('p');credit.className='neighbor-credit';credit.textContent=stageTrack.credit;
      const button=document.createElement('button');button.type='button';button.className='primary-button';button.dataset.stagePlay='';button.addEventListener('click',()=>music.toggle());
      const message=document.createElement('p');message.dataset.stageStatus='';message.setAttribute('role','status');
      body.append(credit,button,message);renderMusic(music.snapshot());
    }else{
      const topics=document.createElement('div');topics.className='neighbor-topics';const reply=document.createElement('div');reply.className='neighbor-reply';reply.setAttribute('aria-live','polite');
      person.topics.forEach(topic=>{
        const button=document.createElement('button');button.type='button';button.textContent=topic.question;button.setAttribute('aria-pressed','false');
        button.addEventListener('click',()=>{
          topics.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
          reply.replaceChildren();const text=document.createElement('p');text.textContent=topic.text;reply.append(text,sourceLink(topic.sourceLabel,topic.sourceUrl));
          for(const source of topic.sources||[])reply.append(sourceLink(source.label,source.url));
        });topics.append(button);
      });body.append(topics,reply);
    }
  }
  function discover(){
    beforeVisit();dismiss();openDialog('discovery','Meet the neighbors');
    const body=$('neighbor-dialog-body');const intro=document.createElement('p');intro.textContent='A little local history, a river story, or a song from the stage. Choose someone to walk over to.';body.append(intro);
    const list=document.createElement('div');list.className='neighbor-list';
    for(const n of neighbors){const button=document.createElement('button');button.type='button';button.textContent=`${n.name} · ${n.kind==='music'?'Riverside stage':n.id==='mabel'?'Salida stories':n.id==='juniper'?'River stories':'Festival stories'}`;button.addEventListener('click',()=>visit(n.id));list.append(button);}body.append(list);
  }
  $('neighbors-toggle').addEventListener('click',discover);
  $('neighbor-talk').addEventListener('click',talk);
  $('neighbor-cancel').addEventListener('click',dismiss);
  return {visit,update:renderDock,dismiss,discovery:discover,dispose(){music.dispose();dialog.remove();dock.remove();musicPanel.remove();}};
}
