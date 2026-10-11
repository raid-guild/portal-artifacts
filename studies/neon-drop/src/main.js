import {newChallenge,resolveChallenge,VERSION} from './challenge.js';
import {rankedClient} from './ranked-client.js';
import {ReleaseQueue,cancelForRoundChoice} from './release-queue.js';
import {ArcadeRadio} from './arcade-radio.js';
import {RADIO_STATIONS,RADIO_BY_ID} from './radio-stations.js';
import './style.css';
import { NeonMachine } from './game.js';
import { BALLS, UPGRADES, ROUND_TARGETS, COSMETICS, buyCosmetic, equipCosmetic, buyRadio, equipRadio, loadMeta, saveMeta, idleEarnings, newRun, targetFor, applyScore, addUpgrade, finishRun, randomCards } from './state.js';

const $=s=>document.querySelector(s);
const app=$('#app');
app.innerHTML=`<div class="shell">
  <div id="viewport" aria-label="3D arcade cabinet"></div>
  <div class="vignette"></div>
  <div class="topline"><div class="brand"><span class="brand-mark">◈</span><span>NEON<span class="brand-light">DROP</span></span><small>ARCADE ROGUELITE / 01</small></div><div class="top-actions"><span class="live-dot"></span><button id="challengeBtn" class="text-btn">ARCADE CHALLENGE</button><button id="settingsBtn" class="icon-btn" title="Settings" aria-label="Settings">⚙</button></div></div>
  <aside class="left-panel"><div class="eyebrow">RUN PROGRESS <span class="tiny-line"></span> <span id="roundTag">ROUND 01 / 04</span></div><div class="target-row"><div><span class="metric-label">ROUND TICKETS</span><div class="big-number" id="roundTickets">0</div></div><div class="target-text">TARGET <b id="target">180</b></div></div><div class="progress"><span id="progressBar"></span></div><div class="info-grid"><div><span class="metric-label">DROPS LEFT</span><b id="dropsLeft">12</b></div><div><span class="metric-label">JACKPOT</span><b class="gold" id="jackpot">150</b></div></div><div class="streak"><span class="streak-icon">✦</span><div><span class="metric-label">CURRENT BUILD</span><p id="buildText">Pure physics. Pure potential.</p></div></div></aside>
  <aside class="right-panel"><div class="eyebrow">THE MACHINE <span class="tiny-line"></span> LIVE</div><div class="mini-title">Rotating prize deck</div><p>Time your release. Let gravity write the story.</p><div class="legend"><div><span class="legend-dot cyan"></span> TICKETS <b>10–100</b></div><div><span class="legend-dot pink"></span> FREE DROP <b>+2</b></div><div><span class="legend-dot amber"></span> JACKPOT <b id="legendJackpot">150</b></div></div><div class="camera-control"><span class="metric-label">CAMERA</span><div class="segmented"><button id="camCabinet" class="active">CABINET</button><button id="camFollow">BALL FOLLOW</button></div></div><div class="machine-note"><span>✧</span><span>Watch the return lift carry every ball back to the top.</span></div>
  <section id="radioFace" class="radio-face" aria-label="Arcade Radio"><div class="radio-head"><span>◈ ARCADE RADIO</span><span id="radioSignal">87.9 FM</span></div><div class="radio-display"><div><strong id="radioStation">CIRCUIT FM</strong><small id="radioStatus" aria-live="polite">PRESS PLAY TO TUNE IN</small></div><div class="radio-eq" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div><div class="radio-controls"><button id="radioPlay" aria-label="Play Arcade Radio" aria-pressed="false">▶ PLAY</button><button id="radioNext" aria-label="Next owned radio station">NEXT ↗</button><button id="radioShop">STATIONS</button></div><label class="radio-volume">MUSIC <input id="radioVolume" type="range" min="0" max="100" value="45" aria-label="Arcade Radio music volume"></label></section></aside>
  <div class="bottom-bar"><div class="ball-pick"><span class="metric-label">LOADED BALL</span><div id="ballOptions" class="ball-options"></div></div><div class="drop-area"><button id="dropBtn" class="drop-btn"><span class="drop-glyph">↓</span><span>DROP BALL</span><small>SPACE</small></button><div class="drop-hint" id="dropHint">WAIT FOR YOUR MOMENT</div></div><div class="utility"><button id="autoBtn" class="text-btn">AUTO DROP <span id="autoState">OFF</span></button><button id="workshopBtn" class="text-btn">◈ WORKSHOP <span id="chips">0</span></button></div></div>
  <div id="toast" class="toast" role="status"></div><div id="fxPreview" class="fx-preview hidden"><div><small>WORKSHOP PREVIEW</small><strong id="fxPreviewName"></strong><span>Visual sample only · no tickets or drops spent</span></div><button id="fxPreviewBack">← BACK TO WORKSHOP</button></div><a class="guild-credit" href="https://raidguild.org/" target="_blank" rel="noopener noreferrer"><img src="${import.meta.env.BASE_URL}assets/raidguild-stamp.svg" alt="RaidGuild brand stamp"><span>Built by <b>RaidGuild</b></span></a><div class="footer-note">NO REAL MONEY</div>
  <div id="modalBackdrop" class="modal-backdrop hidden"><div class="modal" id="modal"></div></div>
</div>`;

let meta=loadMeta(), run=newRun(), machine=null, toastTimer=null, modalKind=null, autoTimer=0, ended=false, settledAt=0, workshopTab="power";
const radio=new ArcadeRadio();radio.configure(meta.audio);
const releases=new ReleaseQueue();
const ranked=rankedClient();let mode='casual',generation=0,challengeStarted=0,rankedRun=null,challengeDone=false;
const now=Date.now();const idle=idleEarnings(meta,now);if(idle){meta.totalTickets+=idle;meta.chips+=Math.floor(idle/200);}meta.idleAt=now;saveMeta(meta);
function touchIdle(){meta.idleAt=Date.now();saveMeta(meta);}
function creditIdle(){const time=Date.now(),earned=idleEarnings(meta,time);if(earned){meta.totalTickets+=earned;meta.chips+=Math.floor(earned/200);toast(`EXHIBITION EARNED ${earned} TICKETS WHILE AWAY`,'gold');sync();}meta.idleAt=time;saveMeta(meta);}

function toast(message,tone='cyan'){const el=$('#toast');el.textContent=message;el.className=`toast show ${tone}`;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2600);}
function saveAudioPrefs(){meta.audio={...meta.audio,station:radio.station,musicVolume:radio.musicVolume,effectsVolume:radio.effectsVolume,playing:radio.wanted,muted:radio.muted};saveMeta(meta);}
function syncRadioUI(){
  const station=RADIO_BY_ID[radio.station];
  $('#radioStation').textContent=station.name.toUpperCase();
  $('#radioSignal').textContent=`${(87.9+RADIO_STATIONS.indexOf(station)*2.2).toFixed(1)} FM`;
  $('#radioFace').style.setProperty('--radio-color',station.color);
  $('#radioFace').classList.toggle('on-air',radio.playing&&!radio.muted);
  $('#radioFace').classList.toggle('reduced',!!machine?.reducedEffects);
  $('#radioStatus').textContent=radio.muted?'MUTED':radio.musicVolume===0?'MUSIC VOLUME ZERO':radio.auditionState?'WORKSHOP LISTEN':radio.playing?'ON AIR':radio.hidden&&radio.wanted?'PAUSED IN BACKGROUND':radio.wanted?'TAP PLAY TO START':'PRESS PLAY TO TUNE IN';
  $('#radioPlay').textContent=radio.playing?'Ⅱ PAUSE':'▶ PLAY';
  $('#radioPlay').setAttribute('aria-label',radio.playing?'Pause Arcade Radio':'Play Arcade Radio');
  $('#radioPlay').setAttribute('aria-pressed',radio.playing?'true':'false');
  $('#radioVolume').value=Math.round(radio.musicVolume*100);
  const mobileStation=$('#mobileRadioStation');
  if(mobileStation){
    mobileStation.textContent=station.name;
    $('#mobileRadioStatus').textContent=$('#radioStatus').textContent;
    $('#mobileRadioPlay').textContent=radio.playing?'Ⅱ Pause':'▶ Play';
    $('#mobileRadioPlay').setAttribute('aria-pressed',radio.playing?'true':'false');
    $('#mobileMusicVolume').value=Math.round(radio.musicVolume*100);
  }
}
function syncDropStatus(){
  $('#dropsLeft').textContent=run.drops;
  $('#dropBtn').disabled=run.status!=='playing'||run.drops<=0;
  $('#dropHint').textContent=releases.length?`${releases.length} BALL${releases.length===1?'':'S'} IN RELEASE QUEUE`:run.status==='playing'?(run.drops?'WAIT FOR YOUR MOMENT':'LAST BALL IN PLAY'):run.status==='choose'?'CHOOSE YOUR NEXT UPGRADE':'RUN COMPLETE';
}
function sync(){
  if(mode==='challenge'){syncChallenge();return;}
  $('#roundTag').textContent=`ROUND ${String(Math.min(run.round+1,4)).padStart(2,'0')} / 04`;
  $('#roundTickets').textContent=run.roundTickets.toLocaleString();$('#target').textContent=targetFor(run).toLocaleString();$('#progressBar').style.width=`${Math.min(100,run.roundTickets/targetFor(run)*100)}%`;
  syncDropStatus();$('#jackpot').textContent=run.jackpot;$('#legendJackpot').textContent=run.jackpot;$('#chips').textContent=meta.chips;
  $('#buildText').textContent=run.upgrades.length?run.upgrades.map(id=>UPGRADES.find(u=>u.id===id)?.title).join(' · '):'Pure physics. Pure potential.';
  $('#autoState').textContent=meta.purchased.includes('auto')?(run.auto?'ON':'OFF'):'LOCKED';$('#autoBtn').classList.toggle('active',run.auto);
  if($('#mobileAuto'))$('#mobileAuto').textContent=`AUTO DROP · ${meta.purchased.includes('auto')?(run.auto?'ON':'OFF'):'LOCKED'}`;
  $('#ballOptions').innerHTML=Object.entries(BALLS).map(([id,b])=>`<button class="ball-option ${run.ball===id?'selected':''} ${meta.unlocked.includes(id)?'':'locked'}" data-ball="${id}" title="${b.desc}${meta.unlocked.includes(id)?'':` — unlock for ${b.cost} chips`}"><span class="ball-icon" style="--ball:${b.glow}"></span><span>${b.name}</span>${!meta.unlocked.includes(id)?'<span class="lock">⌁</span>':''}</button>`).join('');
  document.querySelectorAll('[data-ball]').forEach(b=>b.onclick=()=>{const id=b.dataset.ball;if(meta.unlocked.includes(id)){run.ball=id;sync();toast(`${BALLS[id].name} ball loaded`)}else openWorkshop();});
}
function spendDrop(free){if(mode==='challenge'){run={...run,drops:run.drops-1,dropped:run.dropped+1};sync();return;}if(!free){run.dropped++;if(run.upgrades.includes('double')&&run.dropped%4===0)releases.enqueue('chrome',true,machine.playTime+.42);}syncDropStatus();}
function refundDrop(free=false){if(mode==='challenge'){challengeOutcome('miss');return;}if(run.status==='playing'&&!free){run.drops++;toast('BALL RECYCLED • DROP REFUNDED');syncDropStatus();}}
function cancelPending(){const canceled=releases.clear();const paid=canceled.filter(item=>!item.free).length;if(paid){run.drops+=paid;syncDropStatus();}}
function processReleases(){if(!machine||mode!=='casual'||document.hidden||modalKind||run.status!=='playing')return;const released=releases.flush(machine.playTime,()=>machine.canDrop(),item=>machine.drop(item.type,item.free));if(released)syncDropStatus();}
function drop(free=false,ball=run.ball){if(mode==='challenge'){if(!modalKind&&run.status==='playing'&&run.drops>0&&!machine.active.length)machine.drop('chrome');return;}if(run.status!=='playing'||modalKind||!machine)return;if(!free){if(run.drops<=0)return;run.drops--;}releases.enqueue(ball,free,machine.playTime);syncDropStatus();processReleases();}
function score(hole,ball,rimHits){if(mode==='challenge'){challengeOutcome(hole.id);return;}if(run.status!=='playing'&&run.status!=='choose')return;const previousStatus=run.status;run=applyScore(run,hole,ball,rimHits);run.drops+=cancelForRoundChoice(releases,previousStatus,run.status);machine.setRun(run);const reward=run.lastScore;
  if(hole.kind==='jackpot'){toast(`JACKPOT! +${reward.amount} TICKETS`,'gold');machine.shake=machine.reducedEffects?0:.24;if(!machine.reducedEffects){document.body.classList.add('jackpot-flash');setTimeout(()=>document.body.classList.remove('jackpot-flash'),650)}}
  else if(hole.kind==='free')toast('+2 FREE DROPS','pink');else toast(`+${reward.amount} TICKETS`);
  sync();
}
function endRun(){if(ended)return;ended=true;run.status=run.status==='won'?'won':'lost';meta=finishRun(run,meta);saveMeta(meta);sync();const earned=Math.max(1,Math.floor(run.totalTickets/175)+run.round*3+(run.status==='won'?12:0));openModal(`<div class="modal-eyebrow">${run.status==='won'?'MACHINE MASTERED':'RUN COMPLETE'}</div><h2>${run.status==='won'?'You beat the cabinet.':'The lights fade. The build remains.'}</h2><p>Round ${Math.min(run.round+1,4)} · ${run.totalTickets.toLocaleString()} tickets collected</p><div class="reward-row"><span>◈</span><strong>+${earned}</strong><small>CIRCUIT CHIPS</small></div><p class="modal-note">Spend chips in the Workshop to unlock new balls, automation, and cabinet styles. Your exhibition machine also earns while you are away.</p><div class="modal-actions"><button class="primary" id="retryBtn">NEW RUN →</button><button class="secondary" id="endShopBtn">OPEN WORKSHOP</button></div>`,'end');$('#retryBtn').onclick=()=>startRun();$('#endShopBtn').onclick=()=>openWorkshop();}
function startRun(){generation++;ranked.cancel();cancelPending();mode='casual';rankedRun=null;challengeDone=false;machine.resetSimulation();run=newRun();ended=false;machine.setRun(run);closeModal();sync();toast('NEW RUN • ROUND 01');}
function openModal(html,kind){if(radio.auditionState&&kind!=='workshop'){radio.endAudition();syncRadioUI();}radio.setWorkshopMode(kind==='workshop');if(modalKind==='preview'){machine.clearPreview();$('#fxPreview').classList.add('hidden');}if(modalKind==='challenge'&&kind!=='challenge'){generation++;ranked.cancel();}modalKind=kind;$('#modal').innerHTML=html;$('#modalBackdrop').classList.remove('hidden');}
function closeModal(){if(modalKind==='workshop'&&radio.auditionState){radio.endAudition();syncRadioUI();}radio.setWorkshopMode(false);modalKind=null;$('#modalBackdrop').classList.add('hidden');}
function openUpgrade(){const cards=randomCards(run);openModal(`<div class="modal-eyebrow">ROUND ${String(run.round+1).padStart(2,'0')} CLEARED</div><h2>Choose your next mutation.</h2><p>Your machine is learning. Pick one upgrade for this run.</p><div class="upgrade-grid">${cards.map(c=>`<button class="upgrade-card" data-upgrade="${c.id}" style="--accent:${c.color}"><span class="upgrade-icon">${c.icon}</span><small>${c.tier}</small><strong>${c.title}</strong><span>${c.description}</span><em>ADD TO BUILD →</em></button>`).join('')}</div><div class="modal-foot">NEXT ROUND · TARGET ${ROUND_TARGETS[Math.min(run.round+1,3)].toLocaleString()} TICKETS</div>`,'upgrade');document.querySelectorAll('[data-upgrade]').forEach(b=>b.onclick=()=>{run=addUpgrade(run,b.dataset.upgrade);machine.setRun(run);closeModal();sync();if(run.status==='won')endRun();else toast(`ROUND ${run.round+1} • ${UPGRADES.find(u=>u.id===b.dataset.upgrade).title} installed`);});}
const SHOP_POWER=[
  {id:'rubber',icon:'●',name:'Rubber ball',desc:'Higher bounce, rewards rim hits.',cost:4},
  {id:'heavy',icon:'●',name:'Heavy Core',desc:'Quick landings, 40% larger scores.',cost:7},
  {id:'auto',icon:'↻',name:'Auto drop',desc:'An exhibition assistant drops balls for you.',cost:8}
];
const SHOP_CABINET=[
  {id:'cyan',icon:'✦',name:'Electric cyan',desc:'The original cabinet trim.',cost:0},
  {id:'magenta',icon:'✦',name:'Pink current',desc:'Magenta cabinet trim and interface accent.',cost:3},
  {id:'gold',icon:'✦',name:'Golden hour',desc:'Warm gold cabinet trim and interface accent.',cost:6}
];
function shopCard(o,category){
  const power=category==='power',cabinet=category==='cabinet';
  const owned=power?(o.id==='rubber'||o.id==='heavy'?meta.unlocked.includes(o.id):meta.purchased.includes(o.id)):cabinet?(o.id==='cyan'||meta.purchased.includes(o.id)):(o.id==='default'||meta.cosmetics.includes(o.id));
  const equipped=cabinet?meta.style===o.id:!power&&meta.equipped[category]===o.id;
  return `<div class="shop-item ${equipped?'equipped':''}"><span class="shop-icon">${o.icon}</span><span class="shop-copy"><strong>${o.name}</strong><small>${o.desc}</small></span><div class="shop-controls">${!power&&!cabinet?`<button data-preview="${o.id}" data-category="${category}">PREVIEW</button>`:''}${equipped?'<span class="shop-price equipped-label">EQUIPPED</span>':owned?(power?'<span class="shop-price">OWNED</span>':`<button data-equip="${o.id}" data-category="${category}">EQUIP</button>`):`<button data-buy="${o.id}" data-category="${category}" ${meta.chips<o.cost?'disabled':''}>◈ ${o.cost}</button>`}</div></div>`;
}
function radioCard(station){
  const owned=meta.audio.owned.includes(station.id),equipped=meta.audio.station===station.id;
  const listening=radio.auditionState&&radio.station===station.id;
  return `<div class="shop-item radio-item ${equipped?'equipped':''}" style="--station:${station.color}"><span class="shop-icon">♫</span><span class="shop-copy"><strong>${station.name}</strong><small>${station.subtitle} · ${station.bpm} BPM · 16 bars</small></span><div class="shop-controls"><button data-listen="${station.id}" ${radio.muted&&!listening?'disabled title="Unmute in settings to listen"':''}>${listening?'STOP':radio.muted?'MUTED':'LISTEN'}</button>${equipped?'<span class="shop-price equipped-label">TUNED</span>':owned?`<button data-equip="${station.id}" data-category="radio">TUNE IN</button>`:`<button data-buy="${station.id}" data-category="radio" ${meta.chips<station.cost?'disabled':''}>◈ ${station.cost}</button>`}</div></div>`;
}
function openWorkshop(tab=workshopTab){if(mode==='challenge'&&tab==='power')tab='trail';
  if(tab!=='radio'&&radio.auditionState){radio.endAudition();syncRadioUI();}
  workshopTab=tab;
  const categories=[...(mode==='challenge'?[]:[['power','POWER']]),['trail','TRAILS'],['impact','IMPACTS'],['jackpot','JACKPOTS'],['radio','RADIO'],['cabinet','CABINET']];
  const options=tab==='power'?SHOP_POWER:tab==='cabinet'?SHOP_CABINET:tab==='radio'?RADIO_STATIONS:COSMETICS.filter(c=>c.category===tab);
  const cards=tab==='trail'||tab==='impact'||tab==='jackpot'?[{id:'default',icon:'○',name:'Classic',desc:'The original clean effect.',cost:0},...options]:options;
  openModal(`<div class="modal-eyebrow">PERMANENT PROGRESSION</div><h2>The Workshop</h2><p id="workshopIntro" aria-live="polite">${tab==='radio'?'Hear each station before tuning in. Listening never spends circuits.':'Collect visual effects and equip a look for each part of the machine.'}</p><div class="bank"><span>AVAILABLE CIRCUITS</span><strong>◈ ${meta.chips}</strong></div><div class="shop-tabs">${categories.map(([id,name])=>`<button data-tab="${id}" class="${id===tab?'active':''}">${name}</button>`).join('')}</div><div class="shop-list">${cards.map(o=>tab==='radio'?radioCard(o):shopCard(o,tab)).join('')}</div><div class="modal-actions"><button class="primary" id="shopClose">BACK TO MACHINE →</button></div>`,'workshop');
  $('#shopClose').onclick=()=>{if(ended)openEndAgain();else closeModal();};
  document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>openWorkshop(b.dataset.tab));
  document.querySelectorAll('[data-listen]').forEach(b=>b.onclick=async()=>{if(radio.auditionState&&radio.station===b.dataset.listen){radio.endAudition();syncRadioUI();openWorkshop('radio');return;}const started=await radio.audition(b.dataset.listen);syncRadioUI();if(modalKind==='workshop'&&workshopTab==='radio'){if(started)openWorkshop('radio');else $('#workshopIntro').textContent='Audio unavailable. The station preview did not start; your tuned station and play setting are unchanged.';}});
  document.querySelectorAll('[data-preview]').forEach(b=>b.onclick=()=>startPreview(b.dataset.category,b.dataset.preview));
  document.querySelectorAll('[data-equip]').forEach(b=>b.onclick=()=>{
    const id=b.dataset.equip,category=b.dataset.category;
    if(category==='radio'){radio.endAudition();meta=equipRadio(meta,id);radio.setStation(meta.audio.station);syncRadioUI();}
    else if(category==='cabinet'){if(id!=='cyan'&&!meta.purchased.includes(id))return;meta={...meta,style:id};applyStyle();}
    else meta=equipCosmetic(meta,id,category);
    machine.setCosmetics(meta.equipped);saveMeta(meta);openWorkshop(category);toast(`${id==='default'?'Classic':COSMETICS.find(c=>c.id===id)?.name||RADIO_BY_ID[id]?.name||SHOP_CABINET.find(c=>c.id===id)?.name} equipped`);
  });
  document.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>{
    const id=b.dataset.buy,category=b.dataset.category;if(mode==='challenge'&&category==='power')return;
    if(category==='radio'){radio.endAudition();const next=buyRadio(meta,id);if(next===meta)return;meta=next;radio.setStation(id);syncRadioUI();}
    else if(category==='trail'||category==='impact'||category==='jackpot'){
      const next=buyCosmetic(meta,id);if(next===meta)return;meta=next;machine.setCosmetics(meta.equipped);
    }else{
      const o=(category==='power'?SHOP_POWER:SHOP_CABINET).find(o=>o.id===id);
      if(!o||meta.chips<o.cost)return;
      if(category==='power'?(o.id==='rubber'||o.id==='heavy'?meta.unlocked.includes(id):meta.purchased.includes(id)):meta.purchased.includes(id))return;
      meta.chips-=o.cost;if(o.id==='rubber'||o.id==='heavy')meta.unlocked.push(id);else meta.purchased.push(id);
      if(category==='cabinet'){meta.style=id;applyStyle();}
    }
    saveMeta(meta);openWorkshop(category);sync();toast(`${RADIO_BY_ID[id]?.name||COSMETICS.find(c=>c.id===id)?.name||SHOP_POWER.find(c=>c.id===id)?.name||SHOP_CABINET.find(c=>c.id===id)?.name} unlocked!`,'gold');
  });
}
function startPreview(category,id){
  cancelPending();
  closeModal();modalKind='preview';$('#fxPreviewName').textContent=id==='default'?'Classic':COSMETICS.find(c=>c.id===id)?.name||id;
  $('#fxPreview').classList.remove('hidden');machine.previewCosmetic(category,id);
}
function stopPreview(){machine.clearPreview();$('#fxPreview').classList.add('hidden');openWorkshop();}
$('#fxPreviewBack').onclick=stopPreview;
function openEndAgain(){closeModal();openModal(`<div class="modal-eyebrow">RUN COMPLETE</div><h2>Ready for another drop?</h2><p>Your machine is waiting.</p><div class="modal-actions"><button class="primary" id="retryBtn">NEW RUN →</button><button class="secondary" id="endShopBtn">OPEN WORKSHOP</button></div>`,'end');$('#retryBtn').onclick=startRun;$('#endShopBtn').onclick=()=>openWorkshop();}
function applyStyle(){document.documentElement.dataset.style=meta.style;machine?.setCabinetStyle(meta.style);}
async function toggleRadio(){if(radio.playing){radio.pause();saveAudioPrefs();syncRadioUI();return;}const started=await radio.playFromGesture();if(started){saveAudioPrefs();syncRadioUI();}else{syncRadioUI();$('#radioStatus').textContent='AUDIO UNAVAILABLE';if($('#mobileRadioStatus'))$('#mobileRadioStatus').textContent='AUDIO UNAVAILABLE';}}
function nextRadio(){const owned=RADIO_STATIONS.filter(station=>meta.audio.owned.includes(station.id));const current=owned.findIndex(station=>station.id===meta.audio.station);const next=owned[(current+1)%owned.length];meta=equipRadio(meta,next.id);radio.setStation(meta.audio.station);saveMeta(meta);syncRadioUI();toast(`${next.name.toUpperCase()} TUNED`);}
$('#radioPlay').onclick=toggleRadio;
$('#radioNext').onclick=nextRadio;
$('#radioShop').onclick=()=>openWorkshop('radio');
$('#radioVolume').oninput=e=>{radio.setMusicVolume(Number(e.target.value)/100);saveAudioPrefs();syncRadioUI();};
function openSettings(){
  const build=mode==='challenge'?'Arcade Challenge · Chrome only':run.upgrades.length?run.upgrades.map(id=>UPGRADES.find(u=>u.id===id)?.title).join(' · '):'Pure physics. Pure potential.';
  openModal(`<div class="modal-eyebrow">CABINET OPTIONS</div><h2>Machine menu</h2><p>Controls, music, and the details behind this run.</p>
    <section class="mobile-settings-only mobile-home" aria-label="Game menu">
      <div class="mobile-home-title">ARCADE RADIO <span id="mobileRadioStatus" aria-live="polite"></span></div>
      <strong id="mobileRadioStation"></strong>
      <div class="mobile-home-actions"><button id="mobileRadioPlay" aria-pressed="false">▶ Play</button><button id="mobileRadioNext">NEXT STATION</button><button id="mobileStations">BROWSE STATIONS</button></div>
      <label class="mobile-music-volume">MUSIC VOLUME <input id="mobileMusicVolume" type="range" min="0" max="100" aria-label="Music volume"></label>
      <div class="mobile-home-actions secondary-actions"><button id="mobileAuto">AUTO DROP</button><button id="mobileChallenge">ARCADE CHALLENGE</button></div>
      <div class="mobile-run-info"><b>CURRENT BUILD</b><span>${build}</span><b>PRIZE DECK</b><span>Tickets 10–100 · Free drop +2 · Jackpot ${run.jackpot}</span></div>
      <a class="mobile-guild" href="https://raidguild.org/" target="_blank" rel="noopener noreferrer"><img src="${import.meta.env.BASE_URL}assets/raidguild-stamp.svg" alt="RaidGuild brand stamp"><span>Built by RaidGuild ↗</span></a>
    </section>
    <div class="settings-list"><label><span>Visual bloom <small>Glowing cabinet lights</small></span><input type="checkbox" id="bloomToggle" ${machine.bloomOn?'checked':''}></label><label><span>Reduced effects <small>Fewer particles, no trails, flash, or shake</small></span><input type="checkbox" id="effectsToggle" ${machine.reducedEffects?'checked':''}></label><label><span>Arcade tones <small>Effects volume, separate from music</small></span><input type="range" id="effectsVolume" min="0" max="100" value="${Math.round(radio.effectsVolume*100)}" aria-label="Arcade effects volume"></label><label><span>Mute sounds <small>Disable music and arcade tones</small></span><input type="checkbox" id="muteToggle" ${machine.muted?'checked':''}></label><label><span>Camera <small>Track a ball through the machine</small></span><select id="cameraSelect"><option value="cabinet">Cabinet</option><option value="follow" ${machine.view==='follow'?'selected':''}>Ball follow</option></select></label></div><div class="modal-actions"><button class="primary" id="settingsClose">DONE →</button></div>`,'settings');
  $('#settingsClose').onclick=()=>ended?openEndAgain():closeModal();
  $('#bloomToggle').onchange=e=>machine.setEffects(e.target.checked);
  $('#effectsToggle').onchange=e=>{machine.setReducedEffects(e.target.checked);syncRadioUI();};
  $('#effectsVolume').oninput=e=>{radio.setEffectsVolume(Number(e.target.value)/100);saveAudioPrefs();};
  $('#muteToggle').onchange=e=>{machine.muted=e.target.checked;radio.setMuted(e.target.checked);saveAudioPrefs();syncRadioUI();};
  $('#cameraSelect').onchange=e=>setCamera(e.target.value);
  $('#mobileRadioPlay').onclick=toggleRadio;
  $('#mobileRadioNext').onclick=nextRadio;
  $('#mobileMusicVolume').oninput=e=>{radio.setMusicVolume(Number(e.target.value)/100);saveAudioPrefs();syncRadioUI();};
  $('#mobileStations').onclick=()=>openWorkshop('radio');
  $('#mobileAuto').onclick=toggleAuto;
  $('#mobileChallenge').onclick=openChallenge;
  $('#mobileAuto').textContent=`AUTO DROP · ${mode==='challenge'?'DISABLED':meta.purchased.includes('auto')?(run.auto?'ON':'OFF'):'LOCKED'}`;
  syncRadioUI();
}

function setCamera(view){machine.setView(view);$('#camCabinet').classList.toggle('active',view==='cabinet');$('#camFollow').classList.toggle('active',view==='follow');}
$('#dropBtn').onclick=()=>{radio.unlockFromGesture().then(syncRadioUI).catch(()=>{});drop();};$('#camCabinet').onclick=()=>setCamera('cabinet');$('#camFollow').onclick=()=>setCamera('follow');$('#settingsBtn').onclick=openSettings;$('#challengeBtn').onclick=openChallenge;$('#workshopBtn').onclick=()=>openWorkshop();
function toggleAuto(){if(mode==='challenge'){toast('AUTOMATION DISABLED IN CHALLENGE');return;}if(!meta.purchased.includes('auto')){openWorkshop('power');return;}run.auto=!run.auto;sync();toast(run.auto?'AUTO DROP ENGAGED':'AUTO DROP PAUSED');}
$('#autoBtn').onclick=toggleAuto;
document.addEventListener('keydown',e=>{if(e.repeat)return;if(e.code==='Space'&&!modalKind){e.preventDefault();radio.unlockFromGesture().then(syncRadioUI).catch(()=>{});drop();}if(e.key==='Escape'&&modalKind==='preview'){stopPreview();return;}if(e.key==='Escape'&&['workshop','settings'].includes(modalKind)){if(ended)openEndAgain();else closeModal();}if(e.key.toLowerCase()==='c'&&!modalKind)setCamera(machine.view==='cabinet'?'follow':'cabinet');});
document.addEventListener('visibilitychange',()=>{radio.setHidden(document.hidden);syncRadioUI();if(document.hidden)touchIdle();else creditIdle();});
window.addEventListener('pagehide',()=>{if(!document.hidden)touchIdle();});
setInterval(()=>{if(!document.hidden)touchIdle();},20000);

async function boot(){try{machine=new NeonMachine($('#viewport'),{onDrop:spendDrop,onScore:score,onRefund:refundDrop});await machine.init();machine.setAudioEngine(radio);machine.muted=radio.muted;machine.setRun(run);machine.setCosmetics(meta.equipped);applyStyle();sync();syncRadioUI();if(idle)toast(`EXHIBITION EARNED ${idle} TICKETS WHILE AWAY`,'gold');setInterval(processReleases,50);setInterval(()=>{if(document.hidden||modalKind==='preview')return;if(mode==='challenge'){sync();if(!challengeDone&&run.drops===0&&machine.active.length===0)completeChallenge();return;}if(run.status==='playing'){if(run.auto&&meta.purchased.includes('auto')&&run.drops>0){autoTimer+=.25;const delay=run.upgrades.includes('speed')?4/1.3:4;if(autoTimer>=delay){autoTimer-=delay;drop();}}if(run.drops===0&&releases.length===0&&machine.active.length===0){settledAt+=.25;if(settledAt>=2)endRun();}else settledAt=0;}else if(run.status==='choose'&&releases.length===0&&machine.active.length===0&&!modalKind){openUpgrade();}},250);}
catch(err){console.error(err);$('#viewport').innerHTML='<div class="fatal"><b>MACHINE OFFLINE</b><span>WebGL or physics could not start. Try a current desktop browser.</span></div>';}}
boot();

function syncChallenge(){
 $('#roundTag').textContent='ARCADE CHALLENGE';$('#roundTickets').textContent=run.totalTickets.toLocaleString();$('#target').textContent='12 + 6 MAX';$('#progressBar').style.width=`${run.outcomes.length/18*100}%`;
 $('#dropsLeft').textContent=run.drops;$('#jackpot').textContent='150';$('#legendJackpot').textContent='150';$('#chips').textContent=meta.chips;
 $('#buildText').textContent=`${rankedRun?'PORTAL CASUAL BOARD':'LOCAL PRACTICE'} · ${run.bonus}/6 bonus drops · Chrome only`;
 $('#dropBtn').disabled=run.status!=='playing'||run.drops<=0||machine.active.length>0;$('#dropHint').textContent=machine.active.length?'BALL IN PLAY':run.drops?'TIME YOUR RELEASE':'CHALLENGE COMPLETE';
 $('#autoState').textContent='DISABLED';$('#ballOptions').innerHTML='<span class="ball-option selected">CHROME · FIXED RULES</span>';
}
function openChallenge(){
 generation++;ranked.cancel();
 openModal(`<div class="modal-eyebrow">ONE CABINET. EQUAL RULES.</div><h2>Arcade Challenge</h2><p>12 Chrome drops. Printed tickets are points. Jackpot: 150. Free pockets add +2 drops, up to six bonus drops. No power upgrades or idle bonuses. Your best completed run counts. Scores are client-reported: rules are checked, physical play is unverified.</p><p>Starting replaces your current run. Cosmetics stay equipped. Guest practice works without login; launch this game from Portal for the casual scoreboard. Challenge runs award no chips; cosmetic purchases remain available.</p><p id="rankedStatus">Checking Portal session…</p><div id="boardEntries"></div><div class="modal-actions"><button class="primary" id="challengeStart">START CHALLENGE →</button><button class="secondary" id="challengeBack">BACK</button>${mode==='challenge'?'<button class="secondary" id="challengeExit">ROGUELITE MODE</button>':''}</div>${ranked.embedded?'<p><a href="https://portal.raidguild.org/" target="_blank" rel="noopener noreferrer">Open Portal for a standalone scoreboard launch ↗</a></p>':''}`,'challenge');
 $('#challengeBack').onclick=()=>{generation++;ranked.cancel();closeModal();};$('#challengeStart').onclick=beginChallenge;if($('#challengeExit'))$('#challengeExit').onclick=startRun;
 const current=generation;ranked.session().then(session=>{if(current!==generation||modalKind!=='challenge')return;$('#rankedStatus').textContent=session?`Portal linked: ${session.displayName} · casual, client-reported scores`:'Local practice · optional Portal scoreboard unavailable';});
 ranked.board().then(board=>{if(current!==generation||modalKind!=='challenge')return;const el=$('#boardEntries');if(!board){el.textContent='Leaderboard offline · local best: '+localBest();return;}const title=document.createElement('p');title.textContent='BEST RUNS · RULES V1';el.append(title);for(const [i,row] of board.entries.entries()){const item=document.createElement('div');item.textContent=`${i+1}. ${row.displayName} — ${row.score} points`;el.append(item);}});
}
function localBest(){try{return Math.max(0,Number(localStorage.getItem('neon-drop-challenge-best-v1'))||0);}catch{return 0;}}
async function beginChallenge(){
 const current=++generation;$('#challengeStart').disabled=true;$('#rankedStatus').textContent='Preparing challenge…';
 const session=await ranked.session();if(current!==generation||modalKind!=='challenge')return;const remote=session?await ranked.start():null;if(current!==generation||modalKind!=='challenge')return;
 cancelPending();rankedRun=remote;mode='challenge';challengeDone=false;ended=false;settledAt=0;machine.resetSimulation();run=newChallenge();machine.setRun(run);challengeStarted=performance.now();closeModal();sync();toast(remote?'PORTAL CHALLENGE · CASUAL SCOREBOARD':'LOCAL PRACTICE CHALLENGE');
}
function challengeOutcome(id){if(challengeDone||run.status!=='playing')return;run=resolveChallenge(run,id);machine.setRun(run);toast(id==='miss'?'BALL RECYCLED · ZERO POINTS':`${run.totalTickets} CHALLENGE POINTS`);sync();}
async function completeChallenge(){
 challengeDone=true;run.status='complete';sync();const score=run.totalTickets,best=Math.max(localBest(),score);try{localStorage.setItem('neon-drop-challenge-best-v1',String(best));}catch{}
 const current=generation,submission=rankedRun;openModal(`<div class="modal-eyebrow">CHALLENGE COMPLETE</div><h2>${score.toLocaleString()} points</h2><p>Local best: ${best.toLocaleString()} · ${run.outcomes.length} drops resolved</p><p id="submitStatus">${submission?'Saving Portal score…':'Local practice saved. Launch from Portal to submit casual scoreboard results.'}</p><div class="modal-actions"><button class="primary" id="challengeAgain">PLAY AGAIN</button><button class="secondary" id="casualReturn">ROGUELITE MODE</button></div>`,'challenge-end');$('#challengeAgain').onclick=openChallenge;$('#casualReturn').onclick=startRun;
 if(submission){try{const result=await ranked.finish(submission.runId,{version:VERSION,outcomes:[...run.outcomes],durationMs:Math.round(performance.now()-challengeStarted)});if(current===generation&&modalKind==='challenge-end')$('#submitStatus').textContent=result?'Portal casual scoreboard result saved · physical play unverified.':'Score remains local.';}catch{if(current===generation&&modalKind==='challenge-end')$('#submitStatus').textContent='Submission unavailable. Your local best is saved.';}}
}
