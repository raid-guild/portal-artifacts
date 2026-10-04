import './style.css';
import { Game, HEROES, WEAPONS, type Hero, type Reward, type Weapon, type LevelId } from './game';
import { RAID_VERSION, LEVELS, MONSTERS, emptyProfile, normalizeProfile, credits, purchase, applyProgress, monsterStage } from '../../../services/leaderboards/src/raid-rules.js';
import { GameRenderer } from './render';
import { vaultRunnerMusic } from './music';
import { TouchJoystick } from './touch-input';
import { graphicsMode, RenderCadence } from './render-policy';
import { rankedStartConfig } from './start-config';
import { boardTabs } from './board-tabs';

type Score = { handle: string; character: Hero; level: LevelId; score: number; kills: number; seconds: number; at: string };
const API = '/leaderboard-api/raid-survivor';
const VERSION = RAID_VERSION;
const embedded = window.self !== window.top;
const launchFailed = new URL(location.href).searchParams.get('ranked') === 'launch-failed';
const storage = { getItem(key:string){try{return localStorage.getItem(key);}catch{return null;}}, setItem(key:string,value:string){try{localStorage.setItem(key,value);}catch{/* sandboxed or private storage */}}, removeItem(key:string){try{localStorage.removeItem(key);}catch{/* sandboxed or private storage */}}};
async function timedFetch(url:string, init:RequestInit = {}, ms=4000) { const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),ms);try{return await fetch(url,{...init,signal:controller.signal,credentials:'same-origin'});}finally{clearTimeout(timeout);} }
async function apiPost(url:string,body:unknown){return timedFetch(API+url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});}
const app = document.querySelector<HTMLDivElement>('#app')!;
const heroes = Object.keys(HEROES) as Hero[];
const icon = (name: Hero) => `${import.meta.env.BASE_URL}characters/${name}-preview.png`;
const escapeHtml = (s: string) => s.replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c]!);
const fmt = (n: number) => `${Math.floor(n / 60).toString().padStart(2,'0')}:${Math.floor(n % 60).toString().padStart(2,'0')}`;
let game: Game | null = null, view: GameRenderer | null = null, selected: Hero = 'ranger', selectedLevel: LevelId = 'training', frame = 0, last = 0, accumulator = 0, raf = 0, clearShown = false;
let runId: string | null = null, portal = false, handle = 'Guest', accountId: string | null = null, runAccountId: string | null = null, scoreSent = false, panel: 'none' | 'settings' | 'leaderboard' | 'backpack' | 'mastery' | 'book' = 'none';
let soundOn = storage.getItem('raid-sound') !== 'off', reducedMotion = storage.getItem('raid-motion') === 'reduced', manualAim = storage.getItem('raid-manual-aim') === 'on';
let graphics = graphicsMode(storage.getItem('raid-graphics'));
const renderCadence = new RenderCadence();
let scoreList: Score[] = [];
let profile = (()=>{try{return normalizeProfile(JSON.parse(storage.getItem('raid-profile-v2')||'null'));}catch{return emptyProfile();}})();
let runProgress: any = null, checkpointAt = 0, milestoneCheckpointSent=false, checkpointQueue: Promise<void> = Promise.resolve();
let runHadMilestone=false;
const levelChoices=Object.keys(LEVELS) as LevelId[];
const realmSymbols:Record<LevelId,string>={training:'⚔',forest:'✦',desert:'☀',ice:'❄'};
const predecessor=(level:LevelId)=>levelChoices.find(candidate=>LEVELS[candidate].unlocks===level);
const progressFor = (g:Game) => ({ durationMs: Math.round(g.elapsed*1000), kills:g.stats.kills, monsters: structuredClone(g.monsters) });
const selectedConfig = (g:Game) => ({version:VERSION,character:g.hero,level:g.level,skills:{...g.mastery}});
function persistGuestProfile(){if(!portal)storage.setItem('raid-profile-v2',JSON.stringify(profile));}
type OutboxItem={runId:string;body:unknown};
const outboxKey=(id:string)=>`raid-finish-outbox-v2:${id}`;
function readOutbox(id:string):OutboxItem[]{try{const rows=JSON.parse(storage.getItem(outboxKey(id))||'[]');return Array.isArray(rows)?rows.filter(row=>typeof row?.runId==='string'&&row.body).slice(-20):[];}catch{return [];}}
function queueFinish(id:string,item:OutboxItem){const rows=readOutbox(id).filter(row=>row.runId!==item.runId);rows.push(item);storage.setItem(outboxKey(id),JSON.stringify(rows.slice(-20)));}
let outboxFlight:Promise<void>|null=null;
const outboxStatus=new Map<string,'saved'|'rejected'>();
function flushOutbox(){if(!portal||!accountId)return Promise.resolve();if(outboxFlight)return outboxFlight;const id=accountId;outboxFlight=(async()=>{for(const item of readOutbox(id)){if(!portal||accountId!==id)break;let discard=false,saved=false;for(let attempt=0;attempt<3;attempt++){try{const response=await apiPost(`/runs/${item.runId}/finish`,item.body);if(response.ok){saved=true;break;}if([400,404,409,410].includes(response.status)){discard=true;break;}if(response.status===401)break;}catch{/* retry transient failure */}if(attempt<2)await new Promise(resolve=>setTimeout(resolve,350*(attempt+1)));}if(saved||discard){outboxStatus.set(item.runId,saved?'saved':'rejected');storage.setItem(outboxKey(id),JSON.stringify(readOutbox(id).filter(row=>row.runId!==item.runId)));}else break;}})().finally(()=>{outboxFlight=null;});return outboxFlight;}
async function fetchProfile(){if(!portal)return;try{const res=await timedFetch(API+'/profile');if(!res.ok)throw Error('Profile unavailable');const data=await res.json();profile=normalizeProfile(data.profile);}catch{profile=emptyProfile();rankedMessage='Portal profile unavailable; Training play is ready.';}if(!profile.unlocked.includes(selectedLevel))selectedLevel='training';if(!startPending)renderMenu();}
function checkpoint(force=false){const g=game,id=runId,generation=runGeneration;if(!g||!g.rankable||g.dead&&!force)return;const current=progressFor(g),threshold=LEVELS[g.level].milestoneMs,crossed=current.durationMs>=threshold&&!milestoneCheckpointSent;if(!force&&g.elapsed<checkpointAt+15&&!crossed)return;checkpointAt=g.elapsed;if(crossed)milestoneCheckpointSent=true;
  if(!id){if(portal)return;try{const applied=applyProgress(profile,selectedConfig(g),current,runProgress||{});profile=applied.profile;runProgress=applied.progress;persistGuestProfile();}catch{/* local run may have debug telemetry */}return;}
  checkpointQueue=checkpointQueue.then(async()=>{if(generation!==runGeneration)return;for(let attempt=0;attempt<3;attempt++){try{const res=await apiPost(`/runs/${id}/progress`,current);if(!res.ok)break;const data=await res.json();if(generation===runGeneration){profile=normalizeProfile(data.profile);runProgress=data.progress;}return;}catch{if(attempt===2)return;await new Promise(resolve=>setTimeout(resolve,300*(attempt+1)));}}});
}
let sessionStatus: 'pending' | 'linked' | 'guest' | 'unavailable' = embedded ? 'guest' : 'pending';
let initialSessionReady: Promise<void>, startPending = false, runUnavailable = false, runHandle = 'Guest';
let rankedMessage = 'Local scores saved on this device.';
let rewardChoices: Reward[] = [];
const keys = new Set<string>();
const mouse = { down: false, x: 0, y: 0 };
const touch = { aim: { id: -1, x: 0, y: 0, dx: 0, dy: 0 } };
const joystick = new TouchJoystick();
let audio: AudioContext | null = null;
function unlockSoundEffects(){
  if(!soundOn)return;
  try{audio ||= new AudioContext();if(audio.state==='suspended')void audio.resume().catch(()=>{});}catch{/* audio is optional */}
}
function beginDeathPresentation(){
  resetInput();clearCasino();panel='none';
  document.querySelector<HTMLElement>('#overlay-root')!.innerHTML='';
  document.querySelector('.game-shell')?.classList.add('is-dead');
  document.querySelectorAll<HTMLButtonElement>('.hud button').forEach(button=>button.disabled=true);
  updateHud();playDeathSound();
}
let deathSoundCount = 0;
let runGeneration = 0;
const deathSoundNodes = new Set<{source: AudioScheduledSourceNode; gain: GainNode}>();
function stopDeathSound(){for(const node of deathSoundNodes){try{node.source.stop();}catch{/* already stopped */}node.source.disconnect();node.gain.disconnect();}deathSoundNodes.clear();}
function playDeathSound(){
  if(!soundOn)return;
  try{
    audio ||= new AudioContext();if(audio.state==='suspended')void audio.resume().catch(()=>{});
    const context=audio,now=context.currentTime;
    const connect=(source:AudioScheduledSourceNode,volume:number,duration:number)=>{
      const gain=context.createGain();gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(volume,now+.025);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
      source.connect(gain).connect(context.destination);
      const node={source,gain};deathSoundNodes.add(node);
      source.onended=()=>{deathSoundNodes.delete(node);source.disconnect();gain.disconnect();};
      source.start(now);source.stop(now+duration+.01);
    };
    const impact=context.createOscillator();impact.type='triangle';impact.frequency.setValueAtTime(155,now);impact.frequency.exponentialRampToValueAtTime(62,now+.24);connect(impact,.085,.28);
    const fall=context.createOscillator();fall.type='sawtooth';fall.frequency.setValueAtTime(430,now);fall.frequency.exponentialRampToValueAtTime(70,now+.72);connect(fall,.022,.76);
    const noise=context.createBuffer(1,Math.ceil(context.sampleRate*.85),context.sampleRate),data=noise.getChannelData(0);
    let seed=1979;for(let i=0;i<data.length;i++){seed=(seed*1664525+1013904223)>>>0;data[i]=((seed/4294967296)*2-1)*(1-i/data.length);}
    const fizzle=context.createBufferSource();fizzle.buffer=noise;connect(fizzle,.028,.82);
    deathSoundCount++;
  }catch{/* audio is optional */}
}
let casinoSession = 0;
let casinoTimers: ReturnType<typeof setTimeout>[] = [];
let casinoInterval: ReturnType<typeof setInterval> | null = null;
function clearCasino(){casinoSession++;for(const timer of casinoTimers)clearTimeout(timer);casinoTimers=[];if(casinoInterval)clearInterval(casinoInterval);casinoInterval=null;}

function playSound(type: 'kill' | 'hurt' | 'shoot' | 'level' | 'chest' | 'boss' | 'dash') {
  if (!soundOn) return;
  try { audio ||= new AudioContext(); if (audio.state === 'suspended') void audio.resume().catch(()=>{}); const osc = audio.createOscillator(), gain = audio.createGain(); const now = audio.currentTime; const config = { kill:[280,90,.06,'triangle'], hurt:[160,48,.2,'sawtooth'], shoot:[480,230,.045,'square'], level:[520,900,.3,'sine'], chest:[380,1140,.5,'triangle'], boss:[190,56,.55,'sawtooth'], dash:[420,160,.12,'triangle'] }[type] as [number,number,number,OscillatorType]; osc.type=config[3]; osc.frequency.setValueAtTime(config[0],now); osc.frequency.exponentialRampToValueAtTime(config[1],now+config[2]); gain.gain.setValueAtTime(type==='shoot'?.025:.07,now); gain.gain.exponentialRampToValueAtTime(.001,now+config[2]); osc.connect(gain).connect(audio.destination); osc.start(); osc.stop(now+config[2]); } catch { /* audio is optional */ }
}

async function fetchSession() { if(embedded){portal=false;handle='Guest';accountId=null;sessionStatus='guest';rankedMessage='Embedded guest play';updateIdentity();return;} try { const res = await timedFetch(API+'/session'); if (res.ok) { const data = await res.json(); portal = true; handle = data.displayName || 'Portal player'; accountId=typeof data.accountId==='string'?data.accountId:null; sessionStatus='linked'; rankedMessage='Portal ranked play ready.'; await fetchProfile();void flushOutbox(); } else if(res.status===401){portal=false;handle='Guest';accountId=null;sessionStatus='guest';rankedMessage='Launch from Portal for ranked play.';} else {portal=false;handle='Guest';accountId=null;sessionStatus='unavailable';rankedMessage='Ranked service unavailable; local play is ready.';} } catch { portal=false; handle='Guest';accountId=null; sessionStatus='unavailable'; rankedMessage='Ranked service unavailable; local play is ready.'; } updateIdentity(); }
function updateIdentity() { const el = document.querySelector<HTMLElement>('#identity'); if (el) el.textContent = portal ? `✦ ${handle} · PORTAL LINKED` : sessionStatus==='pending' ? '◇ CHECKING PORTAL SESSION…' : sessionStatus==='unavailable' ? '◇ RANKED SERVICE UNAVAILABLE · LOCAL PLAY READY' : launchFailed ? '◇ PORTAL LAUNCH FAILED · GUEST PLAY READY' : '◇ GUEST RUN · LOCAL SCORES'; }
async function fetchScores(level='all') { if(embedded)return false; try { const res = await timedFetch(API+'/leaderboard?level='+encodeURIComponent(level)); if (res.ok) { const data=await res.json(); scoreList=(data.entries||[]).map((item:{displayName:string;character:Hero;level:LevelId;score:number;kills:number;durationMs:number})=>({handle:item.displayName,character:item.character,level:item.level||'training',score:item.score,kills:item.kills,seconds:Math.floor(item.durationMs/1000),at:''}));return true; } } catch { /* local scores remain available */ } return false; }
function localScores(level='all'): Score[] { try { const list:Score[]=JSON.parse(storage.getItem(level==='legacy'?'raid-local-scores':'raid-local-scores-v2') || '[]');return level==='all'||level==='legacy'?list:list.filter(s=>s.level===level); } catch { return []; } }
function saveLocalScore(entry: Score) { const all = [...localScores(),entry].sort((a,b)=>b.score-a.score).slice(0,40); storage.setItem('raid-local-scores-v2',JSON.stringify(all)); }
function menuHtml() { return `<div class="menu-backdrop"><div class="menu-vignette"></div><div class="menu-rune rune-one">✧</div><div class="menu-rune rune-two">✧</div><header class="menu-top"><div class="brand"><span class="brand-mark">✦</span> RAID GUILD <span class="brand-separator">/</span> ARCADE</div><div id="identity" class="identity"></div></header><main class="menu-main"><div class="eyebrow"><span class="line"></span> FOUR REALMS AWAIT <span class="line"></span></div><h1>RAID<br/><em>SURVIVOR</em></h1><p class="subtitle">One hero. A thousand foes. Whatever you carry out is yours.</p><div class="ornament">✦ <span></span> ✦</div><div class="select-label">CHOOSE YOUR REALM</div><div class="realm-grid">${levelChoices.map(level=>`<button class="realm-card ${selectedLevel===level?'selected':''}" data-realm="${level}" ${profile.unlocked.includes(level)?'':'disabled'}><b>${realmSymbols[level]} ${LEVELS[level].name.toUpperCase()}</b><small>${LEVELS[level].unlocks?`Survive ${fmt(LEVELS[level].milestoneMs/1000)} to unlock ${LEVELS[LEVELS[level].unlocks as LevelId].name}`:`Survive ${fmt(LEVELS[level].milestoneMs/1000)} for a class skill credit`}</small><span>${profile.unlocked.includes(level)?selectedLevel===level?'SELECTED':'SELECT':`LOCKED · ${LEVELS[predecessor(level)!].name.toUpperCase()} ${fmt(LEVELS[predecessor(level)!].milestoneMs/1000)}`}</span></button>`).join('')}</div><div class="select-label">CHOOSE YOUR CHAMPION <small>01 / 03</small></div><div class="hero-grid">${heroes.map(hero => { const h=HEROES[hero]; return `<button class="hero-card ${hero===selected?'selected':''}" data-hero="${hero}"><span class="hero-glow"></span><span class="hero-number">0${heroes.indexOf(hero)+1}</span><img src="${icon(hero)}" alt="${h.name}"/><span class="hero-name">${h.name}</span><span class="hero-role">${h.role}</span><span class="hero-copy">${h.copy}</span><span class="hero-pick">${hero===selected?'✦ SELECTED':'SELECT HERO'}</span></button>`; }).join('')}</div><div class="progress-strip"><span>${credits(profile,selected)} SKILL CREDIT${credits(profile,selected)===1?'':'S'} · ${HEROES[selected].name}</span><button id="masteryMenu">PERMANENT SKILLS</button><button id="bookMenu">MONSTER BOOK</button></div><button id="start" class="gold-button"><span>ENTER ${LEVELS[selectedLevel].name.toUpperCase()}</span><b>➜</b></button><div class="menu-actions"><button id="leaderMenu">♛ LEADERBOARDS</button><span>✦</span><button id="settingsMenu">⚙ SETTINGS</button></div><a class="portal-link" href="https://portal.raidguild.org/modules/raid-survivor" target="_blank" rel="noopener noreferrer">${portal?'Portal profile linked · progress saved across devices':'Guest progress is saved on this device. Portal uses a separate profile; guest progress is not imported. Connect for cloud progression and ranked scores ↗'}</a></main><footer class="menu-footer"><span>WASD / DRAG & HOLD · SPACE DASH</span><span>DESKTOP + TOUCH READY</span></footer></div><div id="modal-root"></div>`; }
function renderMenu() { resetInput();runGeneration++;startPending=false;stopDeathSound();clearCasino();cancelAnimationFrame(raf); game=null; view?.dispose(); view=null; app.innerHTML=menuHtml(); updateIdentity(); bindMenu(); }
function resetInput() {
  keys.clear(); mouse.down=false;
  const stage=document.querySelector<HTMLElement>('#stage');
  const dragId=joystick.id;joystick.reset();if(game){game.move.x=game.move.y=0;game.firing=false;}
  if(dragId>=0&&stage?.hasPointerCapture(dragId))stage.releasePointerCapture(dragId);
  const aim=document.querySelector<HTMLElement>('#aimStick');
  const aimId=touch.aim.id;touch.aim.id=-1;touch.aim.dx=touch.aim.dy=0;
  if(aimId>=0&&aim?.hasPointerCapture(aimId))aim.releasePointerCapture(aimId);
  aim?.classList.remove('active');const knob=aim?.querySelector<HTMLElement>('.stick-knob');if(knob)knob.style.transform='';
}
function bindMenu() { document.querySelectorAll<HTMLButtonElement>('[data-hero]').forEach(button=>button.onclick=()=>{selected=button.dataset.hero as Hero; renderMenu();});document.querySelectorAll<HTMLButtonElement>('[data-realm]').forEach(button=>button.onclick=()=>{selectedLevel=button.dataset.realm as LevelId;void vaultRunnerMusic.selectLevel(selectedLevel);renderMenu();}); document.querySelector<HTMLButtonElement>('#start')!.onclick=()=>start(); document.querySelector<HTMLButtonElement>('#leaderMenu')!.onclick=()=>showLeaderboard(); document.querySelector<HTMLButtonElement>('#settingsMenu')!.onclick=()=>showSettings();document.querySelector<HTMLButtonElement>('#masteryMenu')!.onclick=()=>showMastery();document.querySelector<HTMLButtonElement>('#bookMenu')!.onclick=()=>showBook(); }
const SKILL_LABELS={vitality:['Vitality','+5% starting health'],agility:['Agility','+3% movement speed'],bombRecharge:['Bomb Dynamo','Bomb recharges 5% faster']} as const;
async function showMastery(){const generation=runGeneration;panel='mastery';const available=credits(profile,selected);const root=overlay(`<div class="modal-scrim"><div class="modal-card leader-modal"><div class="modal-eyebrow">PERMANENT CLASS SKILLS</div><h2>${HEROES[selected].name.toUpperCase()} MASTERY</h2><p>${available} credit${available===1?'':'s'} available. First completion of each realm milestone earns one credit for this class. Each skill has two ranks. Skills apply to your next run.</p><div class="mastery-list">${Object.entries(SKILL_LABELS).map(([id,[name,detail]])=>`<button class="mastery-choice" data-skill="${id}" ${!available||profile.skills[selected][id]>=2?'disabled':''}><b>${name}</b><small>${detail}</small><span>${profile.skills[selected][id]>=2?'MAX RANK':available?`RANK ${profile.skills[selected][id]+1} · 1 CREDIT`:'NEED A CREDIT'}</span></button>`).join('')}</div><div id="masteryStatus" class="result-caption" role="status">${portal?'Portal progression':'Saved on this device · Portal profile is separate'}</div><button id="masteryClose" class="gold-button small">DONE</button></div></div>`);root.querySelectorAll<HTMLButtonElement>('[data-skill]').forEach(button=>button.onclick=async()=>{const skill=button.dataset.skill!,rank=profile.skills[selected][skill]+1;button.disabled=true;try{if(portal){const res=await apiPost('/profile/mastery',{character:selected,skill,rank,expectedRevision:profile.revision});if(!res.ok)throw Error('Could not save the skill.');profile=normalizeProfile((await res.json()).profile);}else{profile=purchase(profile,selected,skill,profile.revision,rank);persistGuestProfile();}if(generation===runGeneration&&panel==='mastery')showMastery();}catch{root.querySelector<HTMLElement>('#masteryStatus')!.textContent='Save failed. Reopen the menu and try again.';}});root.querySelector<HTMLButtonElement>('#masteryClose')!.onclick=()=>{panel='none';renderMenu();};}
const GAME_BEHAVIOR={rageipede:'Game adaptation: a pack hunter that pauses before hopping at you.',xorn:'Game adaptation: a shadow stalker that reveals before a talon lunge.',efreeti:'Game adaptation: an airborne brute that absorbs magic briefly, then fires a burst.',deathwisp:'Game adaptation: an evasive desert pouncer with a marked charge.',buraq:'Game adaptation: a hovering giant that warns before a poison fan.',chuul:'Game adaptation: a swarm shown as one foe that marks an ethereal step.',dogmole:'Game adaptation: a burrowing brute that marks a groundbreaking blast.'} as const;
function showBook(){panel='book';const root=overlay(`<div class="modal-scrim"><div class="modal-card leader-modal book-modal"><div class="modal-eyebrow">MONSTERMAPS · ETHEREUM MAINNET</div><h2>MONSTER BOOK</h2><p>Encounter, defeat, and discover counters to reveal original on-chain sheets. Game attacks are adaptations of the source traits.</p><div class="book-list">${Object.entries(MONSTERS).map(([kind,monster])=>{const row=profile.monsters[kind],stage=monsterStage(row);return `<article class="book-entry"><img src="${import.meta.env.BASE_URL}sprites/monsters/${kind}-${monster.tokenId}.png" alt="" loading="lazy"/><div><b>${stage?escapeHtml(monster.name):'UNDISCOVERED CREATURE'}</b><small>${stage?`SHEET #${monster.tokenId} · ${row.kills} DEFEATED · ${row.counterKills} COUNTER KILLS`:`Find this creature in ${LEVELS[monster.realm].name}`}</small>${stage?`<p>${GAME_BEHAVIOR[kind as keyof typeof GAME_BEHAVIOR]}</p>`:''}${stage>=2?`<p>Original Actions: ${escapeHtml(monster.actions)} · Special Ability: ${escapeHtml(monster.ability)}</p>`:''}${stage>=3?`<p>Weakness: ${escapeHtml(monster.weakness)}</p>`:''}${stage>=4?`<p>ORIGINAL SHEET<br/>Size: ${escapeHtml(monster.size)} · Alignment: ${escapeHtml(monster.alignment)}<br/>Locomotion: ${escapeHtml(monster.locomotion)} · Language: ${escapeHtml(monster.language)}</p>`:''}<small>${stage===0?'Encounter to reveal':stage===1?'Defeat 5 to reveal actions':stage===2?'Defeat one with its counter to reveal weakness':stage===3?'Defeat 25 and use its counter to master':'MASTERED'}</small></div></article>`;}).join('')}</div><a class="portal-link" href="https://etherscan.io/address/0xecb9b2ea457740fbde58c758e4c574834224413e" target="_blank" rel="noopener noreferrer">Explore the original Monsters collection ↗</a><button id="bookClose" class="gold-button small">CLOSE BOOK</button></div></div>`);root.querySelector<HTMLButtonElement>('#bookClose')!.onclick=()=>{panel='none';closePanel();};}

async function start() {
  if(startPending)return;
  startPending=true;
  unlockSoundEffects();
  void vaultRunnerMusic.selectLevel(selectedLevel);
  void vaultRunnerMusic.start();
  runGeneration++;const startingGeneration=runGeneration;stopDeathSound();
  const startButton=document.querySelector<HTMLButtonElement>('#start');
  if(startButton){startButton.disabled=true;startButton.querySelector('span')!.textContent='CHECKING PORTAL SESSION…';}
  await initialSessionReady;
  if(startingGeneration!==runGeneration)return;
  const rankedEligible=portal&&!embedded;runUnavailable=sessionStatus==='unavailable';runHandle=rankedEligible?handle:'Guest';
  const startingHero=selected,startingLevel=selectedLevel;
  let preparedId:string|null=null,preparedMastery={...profile.skills[startingHero]};
  // Freeze the previous run while the server captures the new run's mastery.
  cancelAnimationFrame(raf);if(game)game.paused=true;
  if(rankedEligible){
    if(startButton)startButton.querySelector('span')!.textContent='PREPARING PORTAL RUN…';
    try{const res=await apiPost('/runs',{version:VERSION,character:startingHero,level:startingLevel});
      if(res.ok){const data=await res.json();const prepared=rankedStartConfig(data,startingHero,startingLevel);preparedId=prepared.runId;preparedMastery=prepared.mastery;profile=normalizeProfile(data.profile);}
      else{runUnavailable=true;rankedMessage='Ranked start unavailable; local score will be saved.';}
    }catch{runUnavailable=true;rankedMessage='Ranked start unavailable; local score will be saved.';}
  }
  if(startingGeneration!==runGeneration)return;
  clearCasino();cancelAnimationFrame(raf); view?.dispose(); view=null; resetInput(); panel='none';
  runHadMilestone=!!profile.milestones[startingLevel]?.[startingHero];game = new Game(startingHero,startingLevel,preparedMastery);void vaultRunnerMusic.selectLevel(game.level); scoreSent=false; clearShown=false; runId=preparedId;runAccountId=preparedId?accountId:null;runProgress=null;checkpointAt=0;milestoneCheckpointSent=false;checkpointQueue=Promise.resolve();
  app.innerHTML=`<div class="game-shell"><div id="stage" class="stage"></div><div class="hud top-left"><div class="hud-row"><span class="hud-brand">✦ RAID SURVIVOR</span></div><div class="health-track"><div id="health-fill"></div><span id="health-label">100 / 100</span></div><div class="xp-track"><div id="xp-fill"></div></div><div class="hud-under"><span id="level">LVL 01</span><span id="kills">0 KILLS</span><span id="combo"></span><span id="runMode">${rankedEligible?'PREPARING RANKED…':'LOCAL RUN'}</span></div></div><div class="hud survival-timer" aria-live="off"><span class="timer-label">SURVIVED</span><span id="time" class="timer">00:00</span><span id="timeMode" class="timer-mode">12:00 TO CLEAR</span></div><div class="hud top-right"><div class="score-title">VAULT SCORE</div><div id="score" class="score">000000</div><canvas id="minimap" width="118" height="118"></canvas><button id="pauseButton" class="hud-icon" aria-label="Pause">Ⅱ</button></div><div class="hud bottom-left"><div id="weapons" class="weapons"></div><div class="game-tip">WASD MOVE · HOLD MOUSE TO AIM · Q BOMB · SPACE DASH · B BACKPACK${selectedLevel==='desert'?' · OASIS WATER BLOCKS GROUND MOVEMENT; SHOTS PASS OVER':selectedLevel==='ice'?' · ICE WALLS BLOCK MOVEMENT AND SHOTS; BOMBS AND FALLING STARS IGNORE COVER':''}</div></div><div class="hud bottom-right"><button id="bombButton" class="bomb-button" aria-label="Bomb ready" aria-keyshortcuts="Q" title="Press Q to use bomb"><span>✷</span><small id="bombStatus">READY</small><div id="bombMeter"></div><kbd class="bomb-key" aria-hidden="true">Q</kbd></button><button id="dashButton" class="dash-button"><span>↗</span><small>DASH</small><div id="dashMeter"></div></button><button id="bagButton" class="bag-button">▣ BACKPACK</button></div><div id="bossBanner" class="boss-banner"></div><div id="playerJoystick" class="player-joystick" aria-hidden="true"><div class="player-joystick-knob"></div></div><div id="touchHint" class="touch-hint">DRAG & HOLD TO MOVE</div><div id="touchControls" class="touch-controls ${manualAim?'manual-aim':''}"><div id="aimStick" class="stick aim-stick"><div class="stick-knob"></div><span>AIM</span></div></div><div id="overlay-root"></div></div>`;
  const stage = document.querySelector<HTMLElement>('#stage')!, mini = document.querySelector<HTMLCanvasElement>('#minimap')!;
  view = new GameRenderer(stage, game, mini, graphics);
  game.onReward=(rewards,chest)=>chest?showRewardCasino(rewards):showReward(rewards,false);
  game.onEvent=event=>{if(event==='death'){beginDeathPresentation();return;}if(event==='bossDead')playSound('level');else if(event==='bomb')playSound('boss');else if(event==='heal')playSound('level');else playSound(event);if(event==='boss'){const banner=document.querySelector<HTMLElement>('#bossBanner')!;banner.textContent='⚔ MOLOCH RISES ⚔';banner.classList.add('visible');setTimeout(()=>banner.classList.remove('visible'),2700);}if(event==='bossDead'){const banner=document.querySelector<HTMLElement>('#bossBanner')!;banner.textContent='✦ MOLOCH FALLS ✦';banner.classList.add('visible');setTimeout(()=>banner.classList.remove('visible'),2700);}};
  document.querySelector<HTMLButtonElement>('#pauseButton')!.onclick=()=>togglePause();
  document.querySelector<HTMLButtonElement>('#bagButton')!.onclick=()=>showBackpack();
  document.querySelector<HTMLButtonElement>('#dashButton')!.onclick=()=>game?.dash();
  document.querySelector<HTMLButtonElement>('#bombButton')!.onclick=()=>game?.bomb();
  setupInput(stage); updateHud();
  if(startingGeneration!==runGeneration)return;document.querySelector<HTMLElement>('#runMode')!.textContent=runId?'PORTAL RANKED':runUnavailable?'LOCAL · RANKED UNAVAILABLE':'LOCAL RUN';last=performance.now(); accumulator=0;renderCadence.reset(); frame=0; raf=requestAnimationFrame(loop);startPending=false;
  if(game.level!=='training'){game.awaitingReward=true;showReward(game.rollRewards(false),false);}
}

function lowMotion(){return reducedMotion||window.matchMedia('(prefers-reduced-motion: reduce)').matches;}
function loop(now:number){ if(!game||!view)return;const dt=Math.min(.1,(now-last)/1000);last=now;accumulator+=dt;applyInput();while(accumulator>=1/60){game.update(1/60);accumulator-=1/60;}checkpoint();const motion=lowMotion();if(game.dead&&game.deathReason==='combat'&&!document.hidden)game.deathProgress=Math.min(1,game.deathProgress+dt/(motion?.25:1.3));const renderDt=renderCadence.advance(dt);if(renderDt!==null){view.render(renderDt,motion);updatePlayerJoystick();if(++frame%6===0)updateHud();}if(game.cleared&&!clearShown){clearShown=true;showClear();}if(game.dead&&!scoreSent&&(game.deathReason!=='combat'||game.deathProgress>=1)){scoreSent=true;void finish();}raf=requestAnimationFrame(loop); }
function updatePlayerJoystick(){
  if(!game||!view)return;
  const ring=document.querySelector<HTMLElement>('#playerJoystick');if(!ring)return;
  const point=view.screen(game.player.x,game.player.y);
  ring.style.left=`${point.x}px`;ring.style.top=`${point.y}px`;
  ring.classList.toggle('active',joystick.id>=0);
  ring.classList.toggle('unavailable',game.dead||game.paused||game.awaitingReward);
  const knob=ring.firstElementChild as HTMLElement;
  knob.style.transform=`translate(${joystick.direction.x*32}px,${-joystick.direction.y*32}px)`;
}
function applyInput(){if(!game||!view||game.dead)return;const mx=(keys.has('d')||keys.has('ArrowRight')?1:0)-(keys.has('a')||keys.has('ArrowLeft')?1:0),my=(keys.has('w')||keys.has('ArrowUp')?1:0)-(keys.has('s')||keys.has('ArrowDown')?1:0);game.move.x=joystick.id>=0?joystick.direction.x:mx;game.move.y=joystick.id>=0?joystick.direction.y:my;if(manualAim&&touch.aim.id>=0&&Math.hypot(touch.aim.dx,touch.aim.dy)>.15){game.aim.x=touch.aim.dx;game.aim.y=touch.aim.dy;game.firing=true;}else if(mouse.down){const world=view.world(mouse.x,mouse.y);const dx=world.x-game.player.x,dy=world.y-game.player.y;const d=Math.hypot(dx,dy)||1;game.aim.x=dx/d;game.aim.y=dy/d;game.firing=true;}else game.firing=false;}
function setupInput(stage:HTMLElement){
  stage.onpointerdown=e=>{
    if(!game||game.dead||game.paused||game.awaitingReward||game.cleared)return;
    if(e.pointerType==='mouse'){mouse.down=true;mouse.x=e.clientX;mouse.y=e.clientY;return;}
    if(joystick.begin(e.pointerId,e.clientX,e.clientY)){
      e.preventDefault();stage.setPointerCapture(e.pointerId);
      document.querySelector('#touchHint')?.classList.add('used');
    }
  };
  stage.onpointermove=e=>{
    if(e.pointerType==='mouse'){mouse.x=e.clientX;mouse.y=e.clientY;return;}
    joystick.move(e.pointerId,e.clientX,e.clientY);
  };
  const endDrag=(e:PointerEvent)=>{if(joystick.end(e.pointerId)&&game){game.move.x=game.move.y=0;}};
  stage.onpointerup=endDrag;stage.onpointercancel=endDrag;stage.onlostpointercapture=endDrag;
  window.onpointerup=e=>{if(e.pointerType==='mouse')mouse.down=false;};
  window.onpointercancel=e=>{if(e.pointerType==='mouse')mouse.down=false;};
  const element=document.querySelector<HTMLElement>('#aimStick')!;
  element.onpointerdown=e=>{if(!game||game.dead||game.paused||game.awaitingReward||game.cleared||touch.aim.id>=0)return;e.preventDefault();element.setPointerCapture(e.pointerId);const stick=touch.aim;stick.id=e.pointerId;stick.x=e.clientX;stick.y=e.clientY;stick.dx=stick.dy=0;element.classList.add('active');};
  element.onpointermove=e=>{const stick=touch.aim;if(stick.id!==e.pointerId)return;const dx=e.clientX-stick.x,dy=e.clientY-stick.y,d=Math.max(1,Math.hypot(dx,dy)),limit=48;stick.dx=Math.abs(dx)>3?dx/Math.max(d,limit):0;stick.dy=Math.abs(dy)>3?-dy/Math.max(d,limit):0;element.querySelector<HTMLElement>('.stick-knob')!.style.transform=`translate(${dx/d*Math.min(d,limit)}px, ${dy/d*Math.min(d,limit)}px)`;};
  const endAim=(e:PointerEvent)=>{const stick=touch.aim;if(stick.id===e.pointerId){stick.id=-1;stick.dx=stick.dy=0;element.classList.remove('active');element.querySelector<HTMLElement>('.stick-knob')!.style.transform='';}};
  element.onpointerup=endAim;element.onpointercancel=endAim;element.onlostpointercapture=endAim;
}
window.addEventListener('keydown',e=>{if(game?.dead)return;if(e.key==='Escape'&&!e.repeat){if(panel!=='none')closePanel();else togglePause();return;}if(e.code==='KeyQ'&&!e.repeat&&!e.ctrlKey&&!e.altKey&&!e.metaKey&&game&&!game.paused&&!game.awaitingReward&&!game.cleared&&panel==='none'&&!(e.target instanceof HTMLElement&&e.target.closest('input, textarea, select, [contenteditable]'))){e.preventDefault();game.bomb();return;}if(e.target instanceof HTMLElement&&e.target.closest('input, textarea, select, button, [contenteditable]'))return;if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();keys.add(e.key.toLowerCase());keys.add(e.key);if(e.code==='Space'&&!e.repeat)game?.dash();if(e.key.toLowerCase()==='b'&&!e.repeat&&game)showBackpack();});
window.addEventListener('keyup',e=>{keys.delete(e.key.toLowerCase());keys.delete(e.key);});
window.addEventListener('blur',()=>{resetInput();if(game&&!game.dead&&!game.awaitingReward)game.paused=true;});
window.addEventListener('resize',resetInput);
document.addEventListener('visibilitychange',()=>{if(document.hidden){resetInput();if(game&&!game.dead&&!game.awaitingReward)game.paused=true;}});

function updateHud(){if(!game)return;const p=game.player;const set=(id:string,value:string)=>{const el=document.querySelector<HTMLElement>(id);if(el&&el.textContent!==value)el.textContent=value;};set('#time',fmt(game.elapsed));set('#timeMode',game.endless?'ENDLESS':profile.milestones[game.level]?.[game.hero]?'12:00 TO CLEAR':`${fmt(LEVELS[game.level].milestoneMs/1000)} TO ${LEVELS[game.level].unlocks?LEVELS[LEVELS[game.level].unlocks as LevelId].name.toUpperCase():'MASTERY'}`);set('#health-label',`${Math.ceil(p.health)} / ${p.maxHealth}`);set('#level',`LVL ${String(game.stats.level).padStart(2,'0')}`);set('#kills',`${game.stats.kills} KILLS`);set('#combo',game.combo>=4?`${game.combo}× CHAIN`:'');set('#score',String(game.score).padStart(6,'0'));document.querySelector<HTMLElement>('#health-fill')!.style.width=`${p.health/p.maxHealth*100}%`;document.querySelector<HTMLElement>('#xp-fill')!.style.width=`${game.xp/game.xpNeeded*100}%`;document.querySelector<HTMLElement>('#dashMeter')!.style.height=`${Math.min(100,(1-p.dashCooldown/3.5)*100)}%`;document.querySelector<HTMLElement>('#bombMeter')!.style.height=`${Math.min(100,game.bombCharge/game.bombRecharge*100)}%`;const bomb=document.querySelector<HTMLButtonElement>('#bombButton')!;bomb.classList.toggle('ready',game.bombCharge>=game.bombRecharge);const bombName={ranger:'BRIAR BARRAGE',wizard:'ARC NOVA',dwarf:'MOUNTAIN BREAKER'}[game.hero];const remaining=Math.ceil(game.bombRecharge-game.bombCharge);bomb.setAttribute('aria-label',game.bombCharge>=game.bombRecharge?`${bombName} ready`:`${bombName} charging, ${remaining} seconds`);bomb.setAttribute('data-name',bombName);document.querySelector<HTMLElement>('#bombStatus')!.textContent=game.bombCharge>=game.bombRecharge?'READY':`${remaining}s`;const weapons=document.querySelector<HTMLElement>('#weapons')!;const loadout=game.slots.map(w=>w+':'+game!.weapons[w]).join('|');if(weapons.dataset.loadout===loadout)return;weapons.dataset.loadout=loadout;weapons.innerHTML=game.slots.map((w,i)=>`<div class="weapon-slot" style="--weapon-color:${'#'+WEAPONS[w].color.toString(16)}"><span class="slot-num">0${i+1}</span><span class="weapon-icon">${WEAPONS[w].icon}</span><span class="weapon-label">${WEAPONS[w].name}<small>RANK ${game!.weapons[w]}</small></span></div>`).join('');}

function overlay(html:string){resetInput();clearCasino();const root=document.querySelector<HTMLElement>(game?'#overlay-root':'#modal-root')!;root.innerHTML=html;return root;}
function closePanel(){clearCasino();panel='none';const root=document.querySelector<HTMLElement>(game?'#overlay-root':'#modal-root');if(root)root.innerHTML='';if(game&&!game.awaitingReward&&!game.dead)game.paused=false;}
function togglePause(){if(!game||game.dead||game.cleared||game.awaitingReward)return;if(panel!=='none'){closePanel();return;}game.paused=!game.paused;if(game.paused){resetInput();panel='settings';showSettings(true);}else closePanel();}
function showSettings(inGame=false){panel='settings';if(game)game.paused=true;const root=overlay(`<div class="modal-scrim"><div class="modal-card narrow"><div class="modal-eyebrow">THE VAULT CAN WAIT</div><h2>${inGame?'PAUSED':'SETTINGS'}</h2><div class="setting-row"><span>Sound effects<small>Arcade synth cues</small></span><button id="soundToggle" class="toggle">${soundOn?'ON':'OFF'}</button></div><div class="setting-row"><span>Music<small>${vaultRunnerMusic.snapshot().track}</small></span><button id="musicToggle" class="toggle" type="button" aria-label="Mute music" aria-pressed="${vaultRunnerMusic.muted}">${vaultRunnerMusic.muted?'OFF':'ON'}</button></div><div class="setting-row music-volume-row"><label for="musicVolume">Music volume</label><input id="musicVolume" type="range" min="0" max="100" value="${vaultRunnerMusic.volume}" aria-label="Music volume"/><output id="musicVolumeValue" for="musicVolume">${Math.round(vaultRunnerMusic.volume)}%</output></div><div class="setting-row graphics-row"><span>Graphics<small>Auto uses lighter effects on touch screens</small></span><button id="graphicsToggle" class="toggle" aria-label="Graphics quality: ${graphics}">${graphics.toUpperCase()}</button></div><div class="setting-row"><span>Reduced motion<small>Short blessing reveal</small></span><button id="motionToggle" class="toggle">${reducedMotion?'ON':'OFF'}</button></div><div class="setting-row"><span>Manual touch aim<small>Show an aim control for precise firing</small></span><button id="aimToggle" class="toggle">${manualAim?'ON':'OFF'}</button></div><div class="controls-note"><div>MOVE <b>WASD / DRAG & HOLD</b></div><div>AUTO FIRE <b>NEAREST FOE</b></div><div>MANUAL AIM <b>HOLD MOUSE / OPTIONAL RIGHT STICK</b></div><div>BOMB <b>Q / BOMB BUTTON</b></div><div>DASH <b>SPACE / DASH BUTTON</b></div><div>BACKPACK <b>B</b></div></div><button id="resume" class="gold-button small">${game?'RESUME RUN':'DONE'}</button>${game?'<button id="abandon" class="text-button">END RUN</button>':''}</div></div>`);root.querySelector<HTMLButtonElement>('#soundToggle')!.onclick=()=>{soundOn=!soundOn;if(soundOn)unlockSoundEffects();else stopDeathSound();storage.setItem('raid-sound',soundOn?'on':'off');showSettings(inGame);};root.querySelector<HTMLButtonElement>('#musicToggle')!.onclick=()=>{void vaultRunnerMusic.start();vaultRunnerMusic.toggleMuted();const button=root.querySelector<HTMLButtonElement>('#musicToggle')!;button.textContent=vaultRunnerMusic.muted?'OFF':'ON';button.setAttribute('aria-pressed',String(vaultRunnerMusic.muted));};root.querySelector<HTMLInputElement>('#musicVolume')!.oninput=e=>{void vaultRunnerMusic.start();const value=Number((e.target as HTMLInputElement).value);vaultRunnerMusic.setVolume(value);root.querySelector<HTMLOutputElement>('#musicVolumeValue')!.value=`${Math.round(vaultRunnerMusic.volume)}%`;};root.querySelector<HTMLButtonElement>('#graphicsToggle')!.onclick=()=>{graphics=graphics==='auto'?'performance':graphics==='performance'?'full':'auto';storage.setItem('raid-graphics',graphics);view?.setGraphics(graphics);showSettings(inGame);};root.querySelector<HTMLButtonElement>('#motionToggle')!.onclick=()=>{reducedMotion=!reducedMotion;storage.setItem('raid-motion',reducedMotion?'reduced':'full');showSettings(inGame);};root.querySelector<HTMLButtonElement>('#aimToggle')!.onclick=()=>{manualAim=!manualAim;storage.setItem('raid-manual-aim',manualAim?'on':'off');document.querySelector('#touchControls')?.classList.toggle('manual-aim',manualAim);resetInput();showSettings(inGame);};root.querySelector<HTMLButtonElement>('#resume')!.onclick=()=>closePanel();const abandon=root.querySelector<HTMLButtonElement>('#abandon');if(abandon)abandon.onclick=()=>{if(game){game.die('abandon');closePanel();}};}
function showBackpack(){if(!game||game.dead||game.cleared||game.awaitingReward)return;panel='backpack';game.paused=true;const choices=game.slots.map((w,i)=>`<button class="bag-item active" data-slot="${i}"><b>${WEAPONS[w].icon}</b><span>${WEAPONS[w].name}<small>RANK ${game!.weapons[w]}</small></span></button>`).join('');const reserves=game.backpack.map((w,i)=>`<button class="bag-item" data-bag="${i}"><b>${WEAPONS[w].icon}</b><span>${WEAPONS[w].name}<small>RANK ${game!.weapons[w]}</small></span></button>`).join('')||'<div class="empty-bag">Reserve weapons found in the vault appear here.</div>';const root=overlay(`<div class="modal-scrim"><div class="modal-card bag-modal"><div class="modal-eyebrow">YOUR LOADOUT</div><h2>BACKPACK</h2><p>Three weapons can fire at once. Tap a reserve weapon, then an active slot to swap.</p><div class="bag-columns"><div><h3>ACTIVE · 3 SLOTS</h3>${choices}</div><div><h3>RESERVE · 3 SLOTS</h3>${reserves}</div></div><button id="bagClose" class="gold-button small">RETURN TO VAULT</button></div></div>`);let bagIndex=-1;root.querySelectorAll<HTMLButtonElement>('[data-bag]').forEach(b=>b.onclick=()=>{bagIndex=Number(b.dataset.bag);root.querySelectorAll('[data-bag]').forEach(x=>x.classList.remove('chosen'));b.classList.add('chosen');});root.querySelectorAll<HTMLButtonElement>('[data-slot]').forEach(b=>b.onclick=()=>{if(bagIndex>=0){game?.swapBackpack(bagIndex,Number(b.dataset.slot));showBackpack();}});root.querySelector<HTMLButtonElement>('#bagClose')!.onclick=()=>closePanel();}
function showReward(rewards:Reward[],chest:boolean){if(!game)return;rewardChoices=rewards;panel='none';const root=overlay(`<div class="reward-scrim ${chest?'chest-reward':''}"><div class="reward-stage"><div class="reward-rays">✦</div><div class="modal-eyebrow">${chest?'AN ANCIENT CHEST OPENS':'YOUR LEGEND GROWS'}</div><h2>${chest?'VAULT BLESSING':'LEVEL '+String(game.stats.level).padStart(2,'0')}</h2><p>${chest?'The reels are turning in your favor. Choose your prize.':'Choose one power to carry deeper into the vault.'}</p><div class="reward-cards">${rewards.map((r,i)=>`<button class="reward-card ${r.rarity} ${chest&&!reducedMotion?'concealed':''}" data-reward="${i}"><span class="reward-rarity">${r.rarity.toUpperCase()}</span><span class="reward-icon">${r.icon}</span><span class="reward-name">${r.name}</span><span class="reward-detail">${r.detail}</span><span class="reward-take">CLAIM POWER ➜</span></button>`).join('')}</div>${chest?'<button id="skipReveal" class="text-button">SKIP REVEAL</button>':''}</div></div>`);const reveal=()=>root.querySelectorAll('.reward-card').forEach((card,i)=>setTimeout(()=>card.classList.remove('concealed'),reducedMotion?0:i*320));if(chest&&!reducedMotion){setTimeout(reveal,780);root.querySelector<HTMLButtonElement>('#skipReveal')!.onclick=()=>{reveal();};}else reveal();root.querySelectorAll<HTMLButtonElement>('[data-reward]').forEach(button=>button.onclick=()=>{const reward=rewardChoices[Number(button.dataset.reward)];game?.chooseReward(reward);root.innerHTML='';panel='none';});}
function reelTick(pitch:number){if(!soundOn)return;try{audio ||= new AudioContext();if(audio.state==='suspended')void audio.resume().catch(()=>{});const osc=audio.createOscillator(),gain=audio.createGain(),now=audio.currentTime;osc.type='triangle';osc.frequency.setValueAtTime(pitch,now);osc.frequency.exponentialRampToValueAtTime(pitch*1.25,now+.055);gain.gain.setValueAtTime(.035,now);gain.gain.exponentialRampToValueAtTime(.001,now+.07);osc.connect(gain).connect(audio.destination);osc.start();osc.stop(now+.075);}catch{/* optional audio */}}
function showRewardCasino(rewards:Reward[]){
  if(!game)return;
  rewardChoices=rewards;panel='none';
  const lowMotion=reducedMotion||window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const symbols=['✦','ϟ','☄','◈','♥','✧'];
  const intensity=rewards.some(r=>r.rarity==='epic')?'epic':rewards.some(r=>r.rarity==='rare')?'rare':'common';
  const pieces=intensity==='epic'?105:intensity==='rare'?70:48;
  const confetti=Array.from({length:pieces},(_,i)=>`<span class='${i%4===0?'coin':'streamer'}' style='--x:${Math.round(Math.random()*100)}%;--delay:${(Math.random()*.8).toFixed(2)}s;--spin:${Math.round(Math.random()*1080-540)}deg;--hue:${i%3===0?'42':i%3===1?'330':'175'}'></span>`).join('');
  const root=overlay(`<div class='reward-scrim chest-reward rarity-${intensity} ${lowMotion?'low-motion':''}'>${lowMotion?'':"<div class='spotlight spotlight-left'></div><div class='spotlight spotlight-right'></div>"}${lowMotion?'':`<div class='confetti' id='confetti'>${confetti}</div>`}<div class='reward-stage'>${lowMotion?'':"<div class='reward-rays'>✦</div>"}<div class='modal-eyebrow'>AN ANCIENT CHEST OPENS</div><h2>VAULT BLESSING</h2><div id='reel' class='reel'><div class='reel-symbol'>✦</div><div class='reel-symbol'>ϟ</div><div class='reel-symbol'>◈</div></div><div id='reelStatus' class='reel-status' aria-live='polite'>FORTUNE IS TURNING</div><div class='reward-cards'>${rewards.map((r,i)=>`<button class='reward-card ${r.rarity} concealed' data-reward='${i}' disabled><span class='reward-rarity'>${r.rarity.toUpperCase()}</span><span class='reward-icon'>${r.icon}</span><span class='reward-name'>${r.name}</span><span class='reward-detail'>${r.detail}</span><span class='reward-take'>CLAIM POWER ➜</span></button>`).join('')}</div><button id='skipReveal' class='text-button'>SKIP REVEAL</button></div></div>`);
  const session=casinoSession;
  const schedule=(callback:()=>void,delay:number)=>casinoTimers.push(setTimeout(()=>{if(session===casinoSession&&root.isConnected)callback();},delay));
  let revealed=false;
  const reveal=(skipped=false)=>{
    if(revealed||session!==casinoSession)return;
    revealed=true;
    if(skipped)root.querySelector('.reward-scrim')?.classList.add('reveal-skipped');
    if(casinoInterval)clearInterval(casinoInterval);casinoInterval=null;
    for(const timer of casinoTimers)clearTimeout(timer);casinoTimers=[];
    root.querySelector('#reel')?.classList.add('stopped');
    root.querySelector<HTMLElement>('#reelStatus')!.textContent=intensity==='epic'?'JACKPOT · CHOOSE YOUR FORTUNE':'CHOOSE YOUR FORTUNE';
    if(!skipped&&!lowMotion)root.querySelector('#confetti')?.classList.add('burst');
    root.querySelector('#skipReveal')?.remove();
    const cards=[...root.querySelectorAll<HTMLButtonElement>('.reward-card')];
    if(skipped||lowMotion)cards.forEach(card=>{card.classList.remove('concealed');card.disabled=false;});
    else cards.forEach((card,i)=>schedule(()=>{card.classList.remove('concealed');card.disabled=false;reelTick(600+i*150);},i*240));
    if(!skipped&&!lowMotion){playSound('level');schedule(()=>playSound('chest'),200);}
  };
  root.querySelector<HTMLButtonElement>('#skipReveal')!.onclick=()=>reveal(true);
  if(lowMotion)reveal(true);
  else {
    let ticks=0;
    casinoInterval=setInterval(()=>{
      if(session!==casinoSession||!root.isConnected){clearCasino();return;}
      ticks++;
      root.querySelectorAll<HTMLElement>('.reel-symbol').forEach((el,i)=>el.textContent=symbols[(ticks+i*2+Math.floor(Math.random()*symbols.length))%symbols.length]);
      if(ticks%2===0)reelTick(230+ticks*13);
    },95);
    schedule(()=>{root.querySelector<HTMLElement>('#reelStatus')!.textContent='THE REELS ARE SLOWING';root.querySelector('#reel')?.classList.add('slowing');},1850);
    schedule(()=>{root.querySelector<HTMLElement>('#reelStatus')!.textContent='ONE FINAL TURN...';root.querySelector('#reel')?.classList.add('final-turn');},2900);
    schedule(()=>reveal(),3700);
  }
  root.querySelectorAll<HTMLButtonElement>('[data-reward]').forEach(button=>button.onclick=()=>{if(!revealed||button.disabled)return;game?.chooseReward(rewardChoices[Number(button.dataset.reward)]);clearCasino();root.innerHTML='';panel='none';});
}
function showClear(){if(!game)return;game.paused=true;const root=overlay(`<div class='modal-scrim result-scrim'><div class='modal-card result-modal'><div class='modal-eyebrow'>THE TWELFTH BELL HAS TOLLED</div><h2>VAULT CLEARED</h2><p>You survived twelve minutes beneath the guildhall. Bank this legend, or stay and challenge the endless vault.</p><div class='result-grid'><div><strong>${game.stats.kills}</strong><span>DEFEATED</span></div><div><strong>${game.stats.bosses}</strong><span>MOLOCHS DEFEATED</span></div><div><strong>${game.stats.level}</strong><span>LEVEL</span></div><div><strong>${game.score.toLocaleString()}</strong><span>SCORE</span></div></div><button id='bankRun' class='gold-button small'>BANK THIS RUN</button><button id='endlessRun' class='text-button'>ENTER ENDLESS MODE ➜</button></div></div>`);root.querySelector<HTMLButtonElement>('#bankRun')!.onclick=()=>{if(game){game.die('bank');root.innerHTML='';}};root.querySelector<HTMLButtonElement>('#endlessRun')!.onclick=()=>{if(game){game.endless=true;game.cleared=false;game.paused=false;root.innerHTML='';}};}
function scoreFor(g:Game){const stats=g.stats;return (stats.kills-stats.elites-stats.bosses)*10+stats.elites*75+stats.bosses*600+stats.chests*120+(stats.level-1)*40+Math.floor(Math.round(g.elapsed*1000)/1000)*2;}
async function finish(){if(!game)return;const g=game,generation=runGeneration,id=runId;g.paused=true;
  checkpoint(true);await checkpointQueue;
  const entry:Score={handle:runHandle,character:g.hero,level:g.level,score:scoreFor(g),kills:g.stats.kills,seconds:Math.floor(g.elapsed),at:new Date().toISOString()};
  if(g.rankable)saveLocalScore(entry);
  const initial = !g.rankable?'UNRANKED TEST RUN':id?'LOCAL SCORE SAVED · SAVING RANKED RUN…':runUnavailable?'LOCAL SCORE SAVED · RANKED SERVICE UNAVAILABLE':'LOCAL SCORE SAVED';
  const earnedNow=g.rankable&&!runHadMilestone&&g.elapsed*1000>=LEVELS[g.level].milestoneMs&&profile.milestones[g.level]?.[g.hero];
  const root=overlay(`<div class="modal-scrim result-scrim"><div class="modal-card result-modal"><div class="modal-eyebrow">${LEVELS[g.level].name.toUpperCase()} · THE VAULT REMEMBERS</div><h2>${g.cleared?'VAULT CONQUERED':'YOUR RUN ENDS'}</h2><div class="result-score">${entry.score.toLocaleString()}</div><div id="resultStatus" class="result-caption" role="status">${initial}</div><div class="result-grid"><div><strong>${fmt(g.elapsed)}</strong><span>SURVIVED</span></div><div><strong>${g.stats.kills}</strong><span>DEFEATED</span></div><div><strong>${g.stats.level}</strong><span>LEVEL</span></div><div><strong>${g.stats.bosses}</strong><span>MOLOCHS DEFEATED</span></div></div>${earnedNow?'<p>New milestone earned · check permanent skills in the menu.</p>':''}<button id="retry" class="gold-button small">TRY AGAIN ➜</button><button id="returnMenu" class="text-button">RETURN TO CHAMPIONS</button></div></div>`);
  root.querySelector<HTMLButtonElement>('#retry')!.onclick=()=>start();root.querySelector<HTMLButtonElement>('#returnMenu')!.onclick=()=>renderMenu();
  if(!g.rankable||!id||!runAccountId)return;
  queueFinish(runAccountId,{runId:id,body:{version:VERSION,character:g.hero,level:g.level,durationMs:Math.round(g.elapsed*1000),stats:{...g.stats},progress:progressFor(g)}});
  if(runAccountId===accountId){await flushOutbox();if(readOutbox(runAccountId).some(row=>row.runId===id))await flushOutbox();}
  if(g!==game||generation!==runGeneration)return;
  const status=root.querySelector<HTMLElement>('#resultStatus');if(!status)return;
  const result=outboxStatus.get(id);
  status.textContent=result==='saved'?'LOCAL + PORTAL RANKED SCORE SAVED':result==='rejected'?'LOCAL SCORE SAVED · PORTAL REJECTED THIS RUN':'LOCAL SCORE SAVED · PORTAL SUBMISSION QUEUED FOR RETRY';
  if(result==='saved')void fetchScores();
}
async function showLeaderboard(){const generation=runGeneration;panel='leaderboard';let level='all',source=portal?'portal':'local',rankedAvailable=false;const root=overlay(`<div class="modal-scrim"><div class="modal-card leader-modal"><div class="modal-eyebrow">ONE RUN · ONE SCORE</div><h2>LEADERBOARDS</h2><div class="leader-tabs">${boardTabs()}</div><div class="leader-tabs"><button id="localTab">LOCAL</button><button id="portalTab">PORTAL</button></div><div id="leaderStatus" class="result-caption" role="status"></div><div id="leaderRows"></div><button id="leaderClose" class="gold-button small">CLOSE</button></div></div>`);
  const draw=()=>{const data=source==='portal'&&rankedAvailable?scoreList:source==='local'?localScores(level):[];root.querySelector<HTMLElement>('#leaderRows')!.innerHTML=data.length?data.slice(0,10).map((s,i)=>`<div class="leader-row"><span class="rank">${String(i+1).padStart(2,'0')}</span><img src="${icon(heroes.includes(s.character)?s.character:'ranger')}" alt=""/><span class="leader-name">${escapeHtml(s.handle)}<small>${level==='all'?escapeHtml(LEVELS[s.level]?.name||'Guild Training'):''}</small></span><span class="leader-kills">${s.kills} KILLS</span><b>${s.score.toLocaleString()}</b></div>`).join(''):'<div class="empty-leader">No scores on this board yet.</div>';root.querySelector<HTMLElement>('#leaderStatus')!.textContent=source==='portal'?(rankedAvailable?'Portal scores · best single run per player':'Portal board unavailable'):(level==='legacy'?'Original local scores before the expansion':'Scores saved on this device');root.querySelector('#localTab')?.classList.toggle('active',source==='local');root.querySelector('#portalTab')?.classList.toggle('active',source==='portal');};
  const load=async()=>{if(source==='portal'){rankedAvailable=await fetchScores(level);if(generation!==runGeneration||panel!=='leaderboard')return;}draw();};
  root.querySelectorAll<HTMLButtonElement>('[data-board]').forEach(button=>button.onclick=()=>{level=button.dataset.board!;root.querySelectorAll('[data-board]').forEach(x=>x.classList.toggle('active',x===button));void load();});root.querySelector<HTMLButtonElement>('#localTab')!.onclick=()=>{source='local';draw();};root.querySelector<HTMLButtonElement>('#portalTab')!.onclick=()=>{source='portal';void load();};root.querySelector<HTMLButtonElement>('#leaderClose')!.onclick=()=>closePanel();await load();}

if(new URL(location.href).searchParams.has('ranked'))history.replaceState(null,'',location.pathname+location.hash);
renderMenu();initialSessionReady=fetchSession();
if(import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEBUG==='true'){
  (window as Window & {__raidDebug?:unknown}).__raidDebug={
    music:()=>vaultRunnerMusic.snapshot(),
    snapshot:()=>game?{elapsed:game.elapsed,enemies:game.enemies.length,projectiles:game.projectiles.length,enemyShots:game.enemyShots.length,strikes:game.strikes.length,pickups:game.pickups.length,effects:game.effects.length,hazards:game.hazards.map(h=>({...h})),specials:game.enemies.filter(e=>e.special||e.kind==='boss').map(e=>({id:e.id,kind:e.kind,special:e.special,state:e.specialState,timer:e.specialTimer,tier:e.tier,cast:e.bossCastTimer,attackPhase:e.attackPhase})),stats:{...game.stats},health:game.player.health,paused:game.paused,awaitingReward:game.awaitingReward,rankable:game.rankable,slots:[...game.slots],backpack:[...game.backpack],facing:game.facing,bombCharge:game.bombCharge,bombRecharge:game.bombRecharge,bombWave:game.bombWave?{age:game.bombWave.age,radius:game.bombWave.radius}:null,death:{active:game.dead&&game.deathReason==='combat',reason:game.deathReason,progress:game.deathProgress,reducedMotion:lowMotion(),complete:scoreSent},deathSoundCount,activeDeathSounds:deathSoundNodes.size,manualAim,activeTouches:{move:joystick.id,aim:touch.aim.id},moveDirection:{...joystick.direction},bosses:game.enemies.filter(e=>e.kind==='boss').map(e=>({id:e.id,health:e.hp,facing:e.facing})),drawCalls:view?.renderer.info.render.calls,triangles:view?.renderer.info.render.triangles}:null,
    setupLateEncounter:(kind:'juggernaut'|'hexcaster'|'ascended'|'unbound')=>{if(!game)return null;const enemy=game.demoEncounter(kind);updateHud();view?.render(0,lowMotion());return enemy?{id:enemy.id,kind:enemy.kind,special:enemy.special,tier:enemy.tier}:null;},
    stepDemo:(seconds:number)=>{if(!game)return;game.advanceDemo(seconds);updateHud();view?.render(0,lowMotion());},
    spawnHorde:(count:number)=>game?.stress(count),
    grantXP:(amount=100)=>{if(game){game.rankable=false;game.xp+=Math.max(0,Math.min(10000,amount));}},
    reward:(chest=true)=>{if(game){game.rankable=false;game.awaitingReward=true;const rewards=game.rollRewards(chest);chest?showRewardCasino(rewards):showReward(rewards,false);}},
    killPlayer:()=>{if(game){game.rankable=false;game.die();}},
    advanceToClear:()=>{if(game){game.rankable=false;game.elapsed=719.99;game.paused=false;}},
    spawnMoloch:()=>{if(game){game.rankable=false;game.spawnEnemy('boss');const boss=game.enemies.at(-1);if(boss){boss.x=Math.min(177,game.player.x+7);boss.y=Math.min(177,game.player.y+3);}game.onEvent?.('boss');}},
    defeatMoloch:()=>game?.defeatBossDebug(),
    bombReady:()=>{if(game){game.rankable=false;game.bombCharge=game.bombRecharge;}},
    healDemo:()=>{if(game){game.rankable=false;game.player.health=Math.max(1,game.player.health-35);game.pickups.push({x:game.player.x+3,y:game.player.y,kind:'heart',value:18,life:30});const shrine=game.shrines.find(s=>s.active);if(shrine){shrine.x=game.player.x+6;shrine.y=game.player.y;}}},
    face:(direction:-1|1)=>{if(game){game.rankable=false;game.facing=direction<0?-1:1;}},
    start:(hero:Hero='ranger')=>{selected=heroes.includes(hero)?hero:'ranger';void start();},
  };
}

window.addEventListener('pagehide',stopDeathSound);
if(import.meta.hot)import.meta.hot.dispose(()=>{stopDeathSound();vaultRunnerMusic.dispose();});
