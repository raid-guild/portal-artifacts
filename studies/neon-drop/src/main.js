import {newChallenge,resolveChallenge,VERSION} from './challenge.js';
import {rankedClient} from './ranked-client.js';
import './style.css';
import { NeonMachine } from './game.js';
import { BALLS, UPGRADES, ROUND_TARGETS, COSMETICS, buyCosmetic, equipCosmetic, loadMeta, saveMeta, idleEarnings, newRun, targetFor, applyScore, addUpgrade, finishRun, randomCards } from './state.js';

const $=s=>document.querySelector(s);
const app=$('#app');
app.innerHTML=`<div class="shell">
  <div id="viewport" aria-label="3D arcade cabinet"></div>
  <div class="vignette"></div>
  <div class="topline"><div class="brand"><span class="brand-mark">◈</span><span>NEON<span class="brand-light">DROP</span></span><small>ARCADE ROGUELITE / 01</small></div><div class="top-actions"><span class="live-dot"></span><button id="challengeBtn" class="text-btn">ARCADE CHALLENGE</button><button id="settingsBtn" class="icon-btn" title="Settings" aria-label="Settings">⚙</button></div></div>
  <aside class="left-panel"><div class="eyebrow">RUN PROGRESS <span class="tiny-line"></span> <span id="roundTag">ROUND 01 / 04</span></div><div class="target-row"><div><span class="metric-label">ROUND TICKETS</span><div class="big-number" id="roundTickets">0</div></div><div class="target-text">TARGET <b id="target">180</b></div></div><div class="progress"><span id="progressBar"></span></div><div class="info-grid"><div><span class="metric-label">DROPS LEFT</span><b id="dropsLeft">12</b></div><div><span class="metric-label">JACKPOT</span><b class="gold" id="jackpot">150</b></div></div><div class="streak"><span class="streak-icon">✦</span><div><span class="metric-label">CURRENT BUILD</span><p id="buildText">Pure physics. Pure potential.</p></div></div></aside>
  <aside class="right-panel"><div class="eyebrow">THE MACHINE <span class="tiny-line"></span> LIVE</div><div class="mini-title">Rotating prize deck</div><p>Time your release. Let gravity write the story.</p><div class="legend"><div><span class="legend-dot cyan"></span> TICKETS <b>10–100</b></div><div><span class="legend-dot pink"></span> FREE DROP <b>+2</b></div><div><span class="legend-dot amber"></span> JACKPOT <b id="legendJackpot">150</b></div></div><div class="camera-control"><span class="metric-label">CAMERA</span><div class="segmented"><button id="camCabinet" class="active">CABINET</button><button id="camFollow">BALL FOLLOW</button></div></div><div class="machine-note"><span>✧</span><span>Watch the return lift carry every ball back to the top.</span></div></aside>
  <div class="bottom-bar"><div class="ball-pick"><span class="metric-label">LOADED BALL</span><div id="ballOptions" class="ball-options"></div></div><div class="drop-area"><button id="dropBtn" class="drop-btn"><span class="drop-glyph">↓</span><span>DROP BALL</span><small>SPACE</small></button><div class="drop-hint" id="dropHint">WAIT FOR YOUR MOMENT</div></div><div class="utility"><button id="autoBtn" class="text-btn">AUTO DROP <span id="autoState">OFF</span></button><button id="workshopBtn" class="text-btn">◈ WORKSHOP <span id="chips">0</span></button></div></div>
  <div id="toast" class="toast" role="status"></div><div id="fxPreview" class="fx-preview hidden"><div><small>WORKSHOP PREVIEW</small><strong id="fxPreviewName"></strong><span>Visual sample only · no tickets or drops spent</span></div><button id="fxPreviewBack">← BACK TO WORKSHOP</button></div><a class="guild-credit" href="https://raidguild.org/" target="_blank" rel="noopener noreferrer"><img src="${import.meta.env.BASE_URL}assets/raidguild-stamp.svg" alt="RaidGuild brand stamp"><span>Built by <b>RaidGuild</b></span></a><div class="footer-note">NO REAL MONEY</div>
  <div id="modalBackdrop" class="modal-backdrop hidden"><div class="modal" id="modal"></div></div>
</div>`;

let meta=loadMeta(), run=newRun(), machine=null, toastTimer=null, modalKind=null, autoTimer=0, ended=false, settledAt=0, workshopTab="power";
const ranked=rankedClient();let mode='casual',generation=0,challengeStarted=0,rankedRun=null,challengeDone=false;
const now=Date.now();const idle=idleEarnings(meta,now);if(idle){meta.totalTickets+=idle;meta.chips+=Math.floor(idle/200);}meta.idleAt=now;saveMeta(meta);
function touchIdle(){meta.idleAt=Date.now();saveMeta(meta);}
function creditIdle(){const time=Date.now(),earned=idleEarnings(meta,time);if(earned){meta.totalTickets+=earned;meta.chips+=Math.floor(earned/200);toast(`EXHIBITION EARNED ${earned} TICKETS WHILE AWAY`,'gold');sync();}meta.idleAt=time;saveMeta(meta);}

function toast(message,tone='cyan'){const el=$('#toast');el.textContent=message;el.className=`toast show ${tone}`;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2600);}
function sync(){
  if(mode==='challenge'){syncChallenge();return;}
  $('#roundTag').textContent=`ROUND ${String(Math.min(run.round+1,4)).padStart(2,'0')} / 04`;
  $('#roundTickets').textContent=run.roundTickets.toLocaleString();$('#target').textContent=targetFor(run).toLocaleString();$('#progressBar').style.width=`${Math.min(100,run.roundTickets/targetFor(run)*100)}%`;
  $('#dropsLeft').textContent=run.drops;$('#jackpot').textContent=run.jackpot;$('#legendJackpot').textContent=run.jackpot;$('#chips').textContent=meta.chips;
  $('#buildText').textContent=run.upgrades.length?run.upgrades.map(id=>UPGRADES.find(u=>u.id===id)?.title).join(' · '):'Pure physics. Pure potential.';
  $('#dropBtn').disabled=run.status!=='playing'||run.drops<=0;$('#dropHint').textContent=run.status==='playing'?(run.drops?'WAIT FOR YOUR MOMENT':'LAST BALL IN PLAY'):run.status==='choose'?'CHOOSE YOUR NEXT UPGRADE':'RUN COMPLETE';
  $('#autoState').textContent=meta.purchased.includes('auto')?(run.auto?'ON':'OFF'):'LOCKED';$('#autoBtn').classList.toggle('active',run.auto);
  $('#ballOptions').innerHTML=Object.entries(BALLS).map(([id,b])=>`<button class="ball-option ${run.ball===id?'selected':''} ${meta.unlocked.includes(id)?'':'locked'}" data-ball="${id}" title="${b.desc}${meta.unlocked.includes(id)?'':` — unlock for ${b.cost} chips`}"><span class="ball-icon" style="--ball:${b.glow}"></span><span>${b.name}</span>${!meta.unlocked.includes(id)?'<span class="lock">⌁</span>':''}</button>`).join('');
  document.querySelectorAll('[data-ball]').forEach(b=>b.onclick=()=>{const id=b.dataset.ball;if(meta.unlocked.includes(id)){run.ball=id;sync();toast(`${BALLS[id].name} ball loaded`)}else openWorkshop();});
}
function spendDrop(free){if(mode==='challenge'){run={...run,drops:run.drops-1,dropped:run.dropped+1};sync();return;}if(!free){run.drops=Math.max(0,run.drops-1);run.dropped++;}sync();}
function refundDrop(){if(mode==='challenge'){challengeOutcome('miss');return;}if(run.status==='playing'){run.drops++;toast('BALL RECYCLED • DROP REFUNDED');sync();}}
function drop(free=false,ball=run.ball){if(mode==='challenge'){if(!modalKind&&run.status==='playing'&&run.drops>0&&!machine.active.length)machine.drop('chrome');return;}if(run.status!=='playing'||modalKind==='preview')return;if(!free&&run.drops<=0)return;if(machine?.drop(ball,free)){if(run.upgrades.includes('double')&&!free&&run.dropped%4===0){const echoGeneration=generation;setTimeout(()=>{if(mode==='casual'&&echoGeneration===generation&&run.status==='playing'&&modalKind!=='preview')machine.drop('chrome',true)},420);}}}
function score(hole,ball,rimHits){if(mode==='challenge'){challengeOutcome(hole.id);return;}if(run.status!=='playing'&&run.status!=='choose')return;run=applyScore(run,hole,ball,rimHits);machine.setRun(run);const reward=run.lastScore;
  if(hole.kind==='jackpot'){toast(`JACKPOT! +${reward.amount} TICKETS`,'gold');machine.shake=machine.reducedEffects?0:.24;if(!machine.reducedEffects){document.body.classList.add('jackpot-flash');setTimeout(()=>document.body.classList.remove('jackpot-flash'),650)}}
  else if(hole.kind==='free')toast('+2 FREE DROPS','pink');else toast(`+${reward.amount} TICKETS`);
  sync();
}
function endRun(){if(ended)return;ended=true;run.status=run.status==='won'?'won':'lost';meta=finishRun(run,meta);saveMeta(meta);sync();const earned=Math.max(1,Math.floor(run.totalTickets/175)+run.round*3+(run.status==='won'?12:0));openModal(`<div class="modal-eyebrow">${run.status==='won'?'MACHINE MASTERED':'RUN COMPLETE'}</div><h2>${run.status==='won'?'You beat the cabinet.':'The lights fade. The build remains.'}</h2><p>Round ${Math.min(run.round+1,4)} · ${run.totalTickets.toLocaleString()} tickets collected</p><div class="reward-row"><span>◈</span><strong>+${earned}</strong><small>CIRCUIT CHIPS</small></div><p class="modal-note">Spend chips in the Workshop to unlock new balls, automation, and cabinet styles. Your exhibition machine also earns while you are away.</p><div class="modal-actions"><button class="primary" id="retryBtn">NEW RUN →</button><button class="secondary" id="endShopBtn">OPEN WORKSHOP</button></div>`,'end');$('#retryBtn').onclick=()=>startRun();$('#endShopBtn').onclick=()=>openWorkshop();}
function startRun(){generation++;ranked.cancel();mode='casual';rankedRun=null;challengeDone=false;machine.resetSimulation();run=newRun();ended=false;machine.setRun(run);closeModal();sync();toast('NEW RUN • ROUND 01');}
function openModal(html,kind){if(modalKind==='challenge'&&kind!=='challenge'){generation++;ranked.cancel();}modalKind=kind;$('#modal').innerHTML=html;$('#modalBackdrop').classList.remove('hidden');}
function closeModal(){modalKind=null;$('#modalBackdrop').classList.add('hidden');}
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
function openWorkshop(tab=workshopTab){if(mode==='challenge'&&tab==='power')tab='trail';
  workshopTab=tab;
  const categories=[...(mode==='challenge'?[]:[['power','POWER']]),['trail','TRAILS'],['impact','IMPACTS'],['jackpot','JACKPOTS'],['cabinet','CABINET']];
  const options=tab==='power'?SHOP_POWER:tab==='cabinet'?SHOP_CABINET:COSMETICS.filter(c=>c.category===tab);
  const cards=tab==='trail'||tab==='impact'||tab==='jackpot'?[{id:'default',icon:'○',name:'Classic',desc:'The original clean effect.',cost:0},...options]:options;
  openModal(`<div class="modal-eyebrow">PERMANENT PROGRESSION</div><h2>The Workshop</h2><p>Collect visual effects and equip a look for each part of the machine.</p><div class="bank"><span>AVAILABLE CIRCUITS</span><strong>◈ ${meta.chips}</strong></div><div class="shop-tabs">${categories.map(([id,name])=>`<button data-tab="${id}" class="${id===tab?'active':''}">${name}</button>`).join('')}</div><div class="shop-list">${cards.map(o=>shopCard(o,tab)).join('')}</div><div class="modal-actions"><button class="primary" id="shopClose">BACK TO MACHINE →</button></div>`,'workshop');
  $('#shopClose').onclick=()=>{if(ended)openEndAgain();else closeModal();};
  document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>openWorkshop(b.dataset.tab));
  document.querySelectorAll('[data-preview]').forEach(b=>b.onclick=()=>startPreview(b.dataset.category,b.dataset.preview));
  document.querySelectorAll('[data-equip]').forEach(b=>b.onclick=()=>{
    const id=b.dataset.equip,category=b.dataset.category;
    if(category==='cabinet'){if(id!=='cyan'&&!meta.purchased.includes(id))return;meta={...meta,style:id};applyStyle();}
    else meta=equipCosmetic(meta,id,category);
    machine.setCosmetics(meta.equipped);saveMeta(meta);openWorkshop(category);toast(`${id==='default'?'Classic':COSMETICS.find(c=>c.id===id)?.name||SHOP_CABINET.find(c=>c.id===id)?.name} equipped`);
  });
  document.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>{
    const id=b.dataset.buy,category=b.dataset.category;if(mode==='challenge'&&category==='power')return;
    if(category==='trail'||category==='impact'||category==='jackpot'){
      const next=buyCosmetic(meta,id);if(next===meta)return;meta=next;machine.setCosmetics(meta.equipped);
    }else{
      const o=(category==='power'?SHOP_POWER:SHOP_CABINET).find(o=>o.id===id);
      if(!o||meta.chips<o.cost)return;
      if(category==='power'?(o.id==='rubber'||o.id==='heavy'?meta.unlocked.includes(id):meta.purchased.includes(id)):meta.purchased.includes(id))return;
      meta.chips-=o.cost;if(o.id==='rubber'||o.id==='heavy')meta.unlocked.push(id);else meta.purchased.push(id);
      if(category==='cabinet'){meta.style=id;applyStyle();}
    }
    saveMeta(meta);openWorkshop(category);sync();toast(`${COSMETICS.find(c=>c.id===id)?.name||SHOP_POWER.find(c=>c.id===id)?.name||SHOP_CABINET.find(c=>c.id===id)?.name} unlocked!`,'gold');
  });
}
function startPreview(category,id){
  closeModal();modalKind='preview';$('#fxPreviewName').textContent=id==='default'?'Classic':COSMETICS.find(c=>c.id===id)?.name||id;
  $('#fxPreview').classList.remove('hidden');machine.previewCosmetic(category,id);
}
function stopPreview(){machine.clearPreview();$('#fxPreview').classList.add('hidden');openWorkshop();}
$('#fxPreviewBack').onclick=stopPreview;
function openEndAgain(){closeModal();openModal(`<div class="modal-eyebrow">RUN COMPLETE</div><h2>Ready for another drop?</h2><p>Your machine is waiting.</p><div class="modal-actions"><button class="primary" id="retryBtn">NEW RUN →</button><button class="secondary" id="endShopBtn">OPEN WORKSHOP</button></div>`,'end');$('#retryBtn').onclick=startRun;$('#endShopBtn').onclick=()=>openWorkshop();}
function applyStyle(){document.documentElement.dataset.style=meta.style;machine?.setCabinetStyle(meta.style);}
function openSettings(){openModal(`<div class="modal-eyebrow">CABINET OPTIONS</div><h2>Make it yours.</h2><p>Keep the spectacle at your own pace.</p><div class="settings-list"><label><span>Visual bloom <small>Glowing cabinet lights</small></span><input type="checkbox" id="bloomToggle" ${machine.bloomOn?'checked':''}></label><label><span>Reduced effects <small>Fewer particles, no trails, flash, or shake</small></span><input type="checkbox" id="effectsToggle" ${machine.reducedEffects?'checked':''}></label><label><span>Mute sounds <small>Disable arcade tones</small></span><input type="checkbox" id="muteToggle" ${machine.muted?'checked':''}></label><label><span>Camera <small>Track a ball through the machine</small></span><select id="cameraSelect"><option value="cabinet">Cabinet</option><option value="follow" ${machine.view==='follow'?'selected':''}>Ball follow</option></select></label></div><div class="modal-actions"><button class="primary" id="settingsClose">DONE →</button></div>`,'settings');$('#settingsClose').onclick=()=>ended?openEndAgain():closeModal();$('#bloomToggle').onchange=e=>machine.setEffects(e.target.checked);$('#effectsToggle').onchange=e=>machine.setReducedEffects(e.target.checked);$('#muteToggle').onchange=e=>machine.muted=e.target.checked;$('#cameraSelect').onchange=e=>setCamera(e.target.value);}
function setCamera(view){machine.setView(view);$('#camCabinet').classList.toggle('active',view==='cabinet');$('#camFollow').classList.toggle('active',view==='follow');}
$('#dropBtn').onclick=()=>drop();$('#camCabinet').onclick=()=>setCamera('cabinet');$('#camFollow').onclick=()=>setCamera('follow');$('#settingsBtn').onclick=openSettings;$('#challengeBtn').onclick=openChallenge;$('#workshopBtn').onclick=()=>openWorkshop();
$('#autoBtn').onclick=()=>{if(mode==='challenge'){toast('AUTOMATION DISABLED IN CHALLENGE');return;}if(!meta.purchased.includes('auto')){openWorkshop();return;}run.auto=!run.auto;sync();toast(run.auto?'AUTO DROP ENGAGED':'AUTO DROP PAUSED');};
document.addEventListener('keydown',e=>{if(e.repeat)return;if(e.code==='Space'&&!modalKind){e.preventDefault();drop();}if(e.key==='Escape'&&modalKind==='preview'){stopPreview();return;}if(e.key==='Escape'&&['workshop','settings'].includes(modalKind)){if(ended)openEndAgain();else closeModal();}if(e.key.toLowerCase()==='c'&&!modalKind)setCamera(machine.view==='cabinet'?'follow':'cabinet');});
document.addEventListener('visibilitychange',()=>{if(document.hidden)touchIdle();else creditIdle();});
window.addEventListener('pagehide',()=>{if(!document.hidden)touchIdle();});
setInterval(()=>{if(!document.hidden)touchIdle();},20000);

async function boot(){try{machine=new NeonMachine($('#viewport'),{onDrop:spendDrop,onScore:score,onRefund:refundDrop});await machine.init();machine.setRun(run);machine.setCosmetics(meta.equipped);applyStyle();sync();if(idle)toast(`EXHIBITION EARNED ${idle} TICKETS WHILE AWAY`,'gold');setInterval(()=>{if(document.hidden||modalKind==='preview')return;if(mode==='challenge'){sync();if(!challengeDone&&run.drops===0&&machine.active.length===0)completeChallenge();return;}if(run.status==='playing'){if(run.auto&&meta.purchased.includes('auto')&&run.drops>0){autoTimer+=.25;const delay=run.upgrades.includes('speed')?4/1.3:4;if(autoTimer>=delay){autoTimer-=delay;drop();}}if(run.drops===0&&machine.active.length===0){settledAt+=.25;if(settledAt>=2)endRun();}else settledAt=0;}else if(run.status==='choose'&&machine.active.length===0&&!modalKind){openUpgrade();}},250);}
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
 rankedRun=remote;mode='challenge';challengeDone=false;ended=false;settledAt=0;machine.resetSimulation();run=newChallenge();machine.setRun(run);challengeStarted=performance.now();closeModal();sync();toast(remote?'PORTAL CHALLENGE · CASUAL SCOREBOARD':'LOCAL PRACTICE CHALLENGE');
}
function challengeOutcome(id){if(challengeDone||run.status!=='playing')return;run=resolveChallenge(run,id);machine.setRun(run);toast(id==='miss'?'BALL RECYCLED · ZERO POINTS':`${run.totalTickets} CHALLENGE POINTS`);sync();}
async function completeChallenge(){
 challengeDone=true;run.status='complete';sync();const score=run.totalTickets,best=Math.max(localBest(),score);try{localStorage.setItem('neon-drop-challenge-best-v1',String(best));}catch{}
 const current=generation,submission=rankedRun;openModal(`<div class="modal-eyebrow">CHALLENGE COMPLETE</div><h2>${score.toLocaleString()} points</h2><p>Local best: ${best.toLocaleString()} · ${run.outcomes.length} drops resolved</p><p id="submitStatus">${submission?'Saving Portal score…':'Local practice saved. Launch from Portal to submit casual scoreboard results.'}</p><div class="modal-actions"><button class="primary" id="challengeAgain">PLAY AGAIN</button><button class="secondary" id="casualReturn">ROGUELITE MODE</button></div>`,'challenge-end');$('#challengeAgain').onclick=openChallenge;$('#casualReturn').onclick=startRun;
 if(submission){try{const result=await ranked.finish(submission.runId,{version:VERSION,outcomes:[...run.outcomes],durationMs:Math.round(performance.now()-challengeStarted)});if(current===generation&&modalKind==='challenge-end')$('#submitStatus').textContent=result?'Portal casual scoreboard result saved · physical play unverified.':'Score remains local.';}catch{if(current===generation&&modalKind==='challenge-end')$('#submitStatus').textContent='Submission unavailable. Your local best is saved.';}}
}
