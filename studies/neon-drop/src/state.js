import {RADIO_BY_ID,DEFAULT_RADIO} from './radio-stations.js';

export const BALLS = {
  chrome: { name: 'Chrome', color: '#d9edff', glow: '#49dfff', restitution: .96, density: 1.2, cost: 0, desc: 'High bounces and reliable handling.' },
  rubber: { name: 'Rubber', color: '#ff53cc', glow: '#ff319a', restitution: .99, density: .65, cost: 4, desc: 'Wild rebounds. Rewards rim hits.' },
  heavy: { name: 'Heavy Core', color: '#ffcd61', glow: '#ff9d18', restitution: .65, density: 2.8, cost: 7, desc: 'Lower bounce, 40% larger scores.' },
};

export const UPGRADES = [
  { id:'rim', title:'Charged rims', icon:'✦', tier:'IMPACT', description:'Every rim hit adds +8% to the next score.', color:'#50dcfa' },
  { id:'capacitor', title:'Jackpot capacitor', icon:'◈', tier:'JACKPOT', description:'Every normal score adds 8 to the jackpot.', color:'#ffd36f' },
  { id:'double', title:'Echo chamber', icon:'◎', tier:'MULTIBALL', description:'Every fourth drop sends a free echo ball.', color:'#fa67d8' },
  { id:'speed', title:'Conveyor overdrive', icon:'↗', tier:'AUTOMATION', description:'The return lift and auto drop run 30% faster.', color:'#57f4bd' },
  { id:'lucky', title:'Lucky pockets', icon:'✳', tier:'PAYOUT', description:'All ticket pockets pay 25% more.', color:'#c9a9ff' },
  { id:'brake', title:'Precision brake', icon:'▣', tier:'CONTROL', description:'Slows the platform for two seconds after each drop.', color:'#ffab83' },
  { id:'spark', title:'Light show', icon:'❋', tier:'PAYOUT', description:'Every fifth score doubles its payout.', color:'#f6e675' },
  { id:'reserve', title:'Extra reserve', icon:'⊕', tier:'ENDURANCE', description:'Gain four drops now and at the start of each round.', color:'#8babff' },
];

const KEY = 'neon-drop-save-v2';
export const COSMETICS = [
  {id:'singularity',category:'trail',name:'Singularity Wake',cost:600,icon:'◉',desc:'Accretion arcs and orbiting rainbow fragments.'},
  {id:'resonance',category:'impact',name:'Resonance Storm',cost:800,icon:'ϟ',desc:'Layered shock rings and branching glass lightning.'},
  {id:'ascension',category:'jackpot',name:'Celestial Ascension',cost:1200,icon:'✺',desc:'A rising energy column, orbital rings, and cascading fireworks.'},
  {id:'ion',category:'trail',name:'Ion Comet',cost:12,icon:'☄',desc:'A tapered electric tail with drifting sparks.'},
  {id:'helix',category:'trail',name:'Twin Helix',cost:55,icon:'∞',desc:'Two luminous strands orbit every ball.'},
  {id:'prism',category:'trail',name:'Prism Wake',cost:180,icon:'◇',desc:'A shifting rainbow ribbon follows the drop.'},
  {id:'echo',category:'impact',name:'Echo Rings',cost:16,icon:'◎',desc:'Concentric rings spread from every collision.'},
  {id:'voltage',category:'impact',name:'Voltage',cost:70,icon:'ϟ',desc:'Forked arcs crackle at each impact.'},
  {id:'blossom',category:'impact',name:'Glass Blossom',cost:220,icon:'✳',desc:'Crystal petals burst across the tube.'},
  {id:'fountain',category:'jackpot',name:'Gold Fountain',cost:24,icon:'✦',desc:'A bright spray of golden particles.'},
  {id:'halo',category:'jackpot',name:'Orbital Halo',cost:90,icon:'◉',desc:'Stacked rings sweep around the cabinet.'},
  {id:'supernova',category:'jackpot',name:'Supernova',cost:320,icon:'✹',desc:'A radiant starburst crowns the win.'},
];
export const DEFAULT_EQUIPPED = {trail:'default',impact:'default',jackpot:'default'};
export const DEFAULT_AUDIO = {station:DEFAULT_RADIO,owned:[DEFAULT_RADIO],musicVolume:.45,effectsVolume:.45,playing:false,muted:false};
export const POWER_UPGRADES = [
  {id:'amplifier',icon:'✳',name:'Ticket amplifier',description:'Ordinary pockets pay +2% per level.',perLevel:2,unit:'%',costs:[30,50,80,120,180,260,360,500]},
  {id:'reserve',icon:'⊕',name:'Drop reserve',description:'Start each round with +1 drop per level.',perLevel:1,unit:' drop',costs:[120,260,500]},
  {id:'jackpot',icon:'◈',name:'Jackpot coil',description:'Jackpot base and reset gain +10 per level.',perLevel:10,unit:' tickets',costs:[45,75,120,180,270,400]},
];
export const DEFAULT_POWER_LEVELS = {amplifier:0,reserve:0,jackpot:0};
const powerLevel=(levels,id)=>{
  const value=levels?.[id],maximum=POWER_UPGRADES.find(power=>power.id===id).costs.length;
  return Number.isFinite(value)?Math.max(0,Math.min(maximum,Math.floor(value))):0;
};
export function buyPower(meta,id){
  const upgrade=POWER_UPGRADES.find(power=>power.id===id);
  if(!upgrade)return meta;
  const level=powerLevel(meta.powerLevels,id),cost=upgrade.costs[level];
  if(cost===undefined||meta.chips<cost)return meta;
  return {...meta,chips:meta.chips-cost,powerLevels:{...meta.powerLevels,[id]:level+1}};
}
export function buyRadio(meta,id){
  const station=RADIO_BY_ID[id];
  if(!station||meta.audio?.owned?.includes(id)||meta.chips<station.cost)return meta;
  return {...meta,chips:meta.chips-station.cost,audio:{...meta.audio,owned:[...meta.audio.owned,id],station:id}};
}
export function equipRadio(meta,id){
  if(!meta.audio?.owned?.includes(id)||!RADIO_BY_ID[id])return meta;
  return {...meta,audio:{...meta.audio,station:id}};
}
const COSMETIC_IDS = new Set(COSMETICS.map(c=>c.id));
export function buyCosmetic(meta,id){
  const item=COSMETICS.find(c=>c.id===id);
  if(!item||meta.cosmetics?.includes(id)||meta.chips<item.cost)return meta;
  return {...meta,chips:meta.chips-item.cost,cosmetics:[...meta.cosmetics,id],equipped:{...meta.equipped,[item.category]:id}};
}
export function equipCosmetic(meta,id,category){
  if(!Object.hasOwn(DEFAULT_EQUIPPED,category))return meta;
  const item=COSMETICS.find(c=>c.id===id);
  if(id!=='default'&&(!item||item.category!==category||!meta.cosmetics?.includes(id)))return meta;
  return {...meta,equipped:{...meta.equipped,[category]:id}};
}
export const ROUND_TARGETS = [180, 540, 1000, 1800];
export const CABINETS = [
  {id:'classic',name:'Neon Classic',cost:0,description:'The original spinning prize deck. Four rounds, then endless Overdrive.'},
  {id:'double',name:'Double Trouble',cost:200,description:'A counter-rotating upper deck feeds the prize deck. The gold center gate charges a ball for +25% ordinary tickets.'},
];
export const OVERDRIVE_UPGRADES = [
  {id:'od-gain',title:'Voltage amplifier',icon:'ϟ',tier:'OVERDRIVE · STACKS',color:'#55ffc0',description:'+20% ordinary payouts per stack for this run.'},
  {id:'od-bank',title:'Reactor charge',icon:'◈',tier:'OVERDRIVE · STACKS',color:'#ffbd50',description:'Ordinary scores charge the jackpot by +15 per stack.'},
  {id:'od-reserve',title:'Overflow hopper',icon:'⊕',tier:'OVERDRIVE · STACKS',color:'#fe45bc',description:'+2 starting drops each round per stack.'},
];
export function buyCabinet(meta,id){
  const cabinet=CABINETS.find(c=>c.id===id);
  if(!cabinet||meta.cabinets?.includes(id)||meta.chips<cabinet.cost)return meta;
  return {...meta,chips:meta.chips-cabinet.cost,cabinets:[...(meta.cabinets||['classic']),id],selectedCabinet:id};
}
export function selectCabinet(meta,id){return meta.cabinets?.includes(id)?{...meta,selectedCabinet:id}:meta;}
export const DEFAULT_META = { revision:0, cabinets:['classic'], selectedCabinet:'classic', records:{}, chips:0, totalTickets:0, bestRound:0, unlocked:['chrome'], purchased:[], powerLevels:{...DEFAULT_POWER_LEVELS}, style:'cyan', cosmetics:[], equipped:{...DEFAULT_EQUIPPED}, audio:{...DEFAULT_AUDIO,owned:[DEFAULT_RADIO]}, idleAt:Date.now(), idleRate:0, wins:0 };
const revisionOf=value=>Number.isSafeInteger(value)&&value>=0?value:0;

export function loadMeta(storage = globalThis.localStorage, now = Date.now()) {
  try {
    const raw = storage?.getItem(KEY);
    const saved = raw ? JSON.parse(raw) : {};
    const number = (value, fallback, max=1e9) => Number.isFinite(value) ? Math.max(0, Math.min(max, Math.floor(value))) : fallback;
    const cosmetics=[...new Set(Array.isArray(saved.cosmetics)?saved.cosmetics.filter(id=>COSMETIC_IDS.has(id)):[])];
    const equipped=Object.fromEntries(Object.keys(DEFAULT_EQUIPPED).map(category=>{
      const id=saved.equipped?.[category];const item=COSMETICS.find(c=>c.id===id);
      return [category,item?.category===category&&cosmetics.includes(id)?id:'default'];
    }));
    const owned=[DEFAULT_RADIO,...new Set(Array.isArray(saved.audio?.owned)?saved.audio.owned.filter(id=>id!==DEFAULT_RADIO&&RADIO_BY_ID[id]):[])];
    const station=owned.includes(saved.audio?.station)?saved.audio.station:DEFAULT_RADIO;
    const oldVolume=Number.isFinite(saved.audio?.volume)?Math.max(0,Math.min(1,saved.audio.volume)):.45;
    const musicVolume=Number.isFinite(saved.audio?.musicVolume)?Math.max(0,Math.min(1,saved.audio.musicVolume)):oldVolume;
    const effectsVolume=Number.isFinite(saved.audio?.effectsVolume)?Math.max(0,Math.min(1,saved.audio.effectsVolume)):oldVolume;
    return {
      revision:revisionOf(saved.revision),
      cabinets:['classic',...(Array.isArray(saved.cabinets)&&saved.cabinets.includes('double')?['double']:[])],
      selectedCabinet:saved.selectedCabinet==='double'&&Array.isArray(saved.cabinets)&&saved.cabinets.includes('double')?'double':'classic',
      records:Object.fromEntries(CABINETS.map(c=>[c.id,{tickets:number(saved.records?.[c.id]?.tickets,0),round:number(saved.records?.[c.id]?.round,0,10000)}])),
      chips:number(saved.chips,0), totalTickets:number(saved.totalTickets,0), bestRound:number(saved.bestRound,0,ROUND_TARGETS.length),
      unlocked:['chrome', ...new Set(Array.isArray(saved.unlocked) ? saved.unlocked.filter(x=>x==='rubber'||x==='heavy') : [])],
      purchased:[...new Set(Array.isArray(saved.purchased) ? saved.purchased.filter(x=>['auto','magenta','gold'].includes(x)) : [])],
      powerLevels:Object.fromEntries(POWER_UPGRADES.map(power=>[power.id,powerLevel(saved.powerLevels,power.id)])),
      style:['cyan','magenta','gold'].includes(saved.style) ? saved.style : 'cyan',
      cosmetics,equipped,audio:{station,owned,musicVolume,effectsVolume,playing:saved.audio?.playing===true,muted:saved.audio?.muted===true},
      idleAt:Number.isFinite(saved.idleAt) ? Math.min(saved.idleAt,now) : now,
      idleRate:number(saved.idleRate,0,18), wins:number(saved.wins,0)
    };
  } catch { return { ...DEFAULT_META, idleAt:now }; }
}
// The caller must adopt the returned meta on success. A stale tab may never
// retry its old balance or run bank markers against the newer save.
export function saveMeta(meta, storage = globalThis.localStorage) {
  try {
    if(!storage?.getItem||!storage?.setItem)return {ok:false,reason:'storage',meta};
    const raw=storage.getItem(KEY);
    const stored=raw===null?null:JSON.parse(raw);
    if(raw!==null&&(!stored||typeof stored!=='object'||Array.isArray(stored)))return {ok:false,reason:'storage',meta};
    const expected=revisionOf(meta.revision),current=revisionOf(stored?.revision);
    if(current!==expected)return {ok:false,reason:'conflict',meta:loadMeta(storage)};
    if(current>=Number.MAX_SAFE_INTEGER)return {ok:false,reason:'storage',meta};
    const next={...meta,revision:current+1};
    storage.setItem(KEY,JSON.stringify(next));
    return {ok:true,meta:next};
  } catch { return {ok:false,reason:'storage',meta}; }
}
export function idleEarnings(meta, now = Date.now()) {
  const elapsed = Math.max(0, Math.min(now - meta.idleAt, 4 * 60 * 60 * 1000));
  return Math.floor(elapsed / 60000 * Math.max(0, meta.idleRate));
}
export function jackpotBase(run){return 150+run.round*100+powerLevel(run.powerLevels,'jackpot')*10;}
export function newRun(meta=DEFAULT_META) {
  const powerLevels=Object.fromEntries(POWER_UPGRADES.map(power=>[power.id,powerLevel(meta.powerLevels,power.id)]));
  return {cabinet:meta.cabinets?.includes(meta.selectedCabinet)?meta.selectedCabinet:'classic',overdrive:false,mastered:false,bankedChips:0,bankedTickets:0,winBanked:false,round:0,roundTickets:0,totalTickets:0,drops:12+powerLevels.reserve,dropped:0,scores:0,jackpot:150+powerLevels.jackpot*10,powerLevels,upgrades:[],ball:'chrome',auto:false,status:'playing',lastScore:null};
}
export function targetFor(run) { return run.round<4?ROUND_TARGETS[run.round]:Math.round(1800*Math.pow(1.25,Math.min(run.round-3,80))); }
export function payout(run, hole, ball, rimHits=0) {
  if (hole.kind === 'free') return { amount:0, free:2, jackpot:false };
  if (hole.kind === 'jackpot') return { amount:run.jackpot, free:0, jackpot:true };
  let amount = hole.value;
  if (ball === 'heavy') amount *= 1.4;
  if (ball === 'rubber') amount *= 1 + Math.min(rimHits, 8) * .07;
  if (run.upgrades.includes('rim')) amount *= 1 + Math.min(rimHits, 10) * .08;
  if (run.upgrades.includes('lucky')) amount *= 1.25;
  if (run.upgrades.includes('spark') && (run.scores + 1) % 5 === 0) amount *= 2;
  if(run.cabinet==='double'&&hole.charged)amount*=1.25;
  amount *= 1+run.upgrades.filter(id=>id==='od-gain').length*.2;
  amount *= 1+powerLevel(run.powerLevels,'amplifier')*.02;
  return { amount:Math.round(amount), free:0, jackpot:false };
}
export function applyScore(run, hole, ball, rimHits=0) {
  const reward = payout(run, hole, ball, rimHits);
  const next = { ...run, scores:run.scores + 1, drops:run.drops + reward.free, lastScore:{...reward, label:hole.label} };
  if (reward.jackpot) next.jackpot = jackpotBase(next);
  else if (hole.kind !== 'free' && next.upgrades.includes('capacitor')) next.jackpot += 8;
  if(hole.kind==='score')next.jackpot+=15*next.upgrades.filter(id=>id==='od-bank').length;
  next.roundTickets += reward.amount;
  next.totalTickets += reward.amount;
  if (next.roundTickets >= targetFor(next)) next.status = 'choose';
  return next;
}
export function addUpgrade(run, upgradeId) {
  const next = { ...run, upgrades:[...run.upgrades, upgradeId], round:run.round+1, roundTickets:0, drops:12 + powerLevel(run.powerLevels,'reserve') + (run.upgrades.includes('reserve') || upgradeId === 'reserve' ? 4 : 0), status:'playing' };
  next.drops+=2*next.upgrades.filter(id=>id==='od-reserve').length;
  next.jackpot=Math.max(next.jackpot,jackpotBase(next));
  if (next.round >= ROUND_TARGETS.length&&!next.overdrive) next.status = 'won';
  return next;
}
export function completeCabinet(run){
  return run.round===3&&run.status==='choose'&&!run.overdrive?{...run,mastered:true,status:'checkpoint'}:run;
}
export function enterOverdrive(run){return run.status==='checkpoint'?{...run,overdrive:true,status:'choose'}:run;}
export function chipsForRun(run){
  const cleared=run.mastered?Math.max(4,run.round):run.round;
  return Math.max(1,Math.floor(run.totalTickets/175)+cleared*3+(run.mastered||run.status==='won'?12:0));
}
// Checkpoints pay only the difference; repeated calls cannot pay the same tickets or win twice.
export function bankRun(run,meta,now=Date.now()){
  const earned=chipsForRun(run),chips=Math.max(0,earned-(run.bankedChips||0));
  const tickets=Math.max(0,run.totalTickets-(run.bankedTickets||0));
  const won=(run.mastered||run.status==='won')&&!run.winBanked;
  const cabinet=run.cabinet||'classic',old=meta.records?.[cabinet]||{tickets:0,round:0};
  const reached=run.round+1;
  return {run:{...run,bankedChips:earned,bankedTickets:run.totalTickets,winBanked:run.winBanked||won},meta:{...meta,
    chips:meta.chips+chips,totalTickets:meta.totalTickets+tickets,
    bestRound:Math.max(meta.bestRound,Math.min(4,reached)),
    records:{...meta.records,[cabinet]:{tickets:Math.max(old.tickets,run.totalTickets),round:Math.max(old.round,reached)}},
    idleRate:Math.max(meta.idleRate,Math.min(18,Math.floor((meta.totalTickets+tickets)/1200))),idleAt:now,wins:meta.wins+Number(won)}};
}
export function finishRun(run,meta,now=Date.now()){return bankRun(run,meta,now).meta;}
export function randomCards(run, random=Math.random) {
  const available = [...UPGRADES.filter(u => !run.upgrades.includes(u.id)),...(run.overdrive?OVERDRIVE_UPGRADES:[])];
  return available.sort(() => random()-.5).slice(0,3);
}
