import {addUpgrade,payout} from './state.js';
import {expireSwitchboard} from './switchboard.js';

const count=(run,id)=>run.upgrades.filter(value=>value===id).length;
const nextBudget=run=>12+(run.powerLevels?.reserve||0)+(run.upgrades.includes('reserve')?4:0)+(run.encoreAvailable||0)+2*count(run,'od-reserve');
const charge=run=>(run.upgrades.includes('capacitor')?8:0)+15*count(run,'od-bank');
const pretty=value=>Number.isInteger(value)?String(value):value.toFixed(2).replace(/0$/,'');

// Values are read from the current build and the production round transition.
export function upgradeValue(run,id){
  const after=addUpgrade(run,id),beforeCount=count(run,id),afterCount=count(after,id);
  if(after===run)return '';
  switch(id){
    case 'rim':return 'RIM HIT BONUS 0% → +8% EACH · CAP +80%';
    case 'capacitor':return `NEXT JP CHARGE +${charge(run)} → +${charge(after)} / SCORE`;
    case 'double':return 'FREE ECHO 0 → 1 EVERY 4 PAID RELEASES';
    case 'speed':return `AUTO WHEN UNLOCKED ${pretty(4)} → ${pretty(4/1.3)}s · LIFT 3.4 → 2.5s`;
    case 'lucky':return 'ORDINARY POCKET ×1 → ×1.25';
    case 'brake':return 'BOARD SPIN 0.58 → 0.22 RAD/s · 2s';
    case 'spark':return 'EVERY FIFTH RESULT · ORDINARY ×1 → ×2';
    case 'reserve':return `NEXT ROUND DROPS ${nextBudget(run)} → ${after.drops} · +4`;
    case 'od-gain':return `ORDINARY PAYOUT ×${pretty(1+.2*beforeCount)} → ×${pretty(1+.2*afterCount)}`;
    case 'od-bank':return `NEXT JP CHARGE +${charge(run)} → +${charge(after)} / SCORE`;
    case 'od-reserve':return `NEXT ROUND DROPS ${nextBudget(run)} → ${after.drops} · +2`;
    case 'sw-fuse':return `CHANNEL ${Math.min(16,8+2*beforeCount)} → ${Math.min(16,8+2*afterCount)}s`;
    case 'sw-overload':return `OVERLOAD ${Math.min(8,4+beforeCount)} → ${Math.min(8,4+afterCount)}s`;
    case 'sw-coil':return `REACTOR +${Math.min(6,3+beforeCount)} → +${Math.min(6,3+afterCount)} pp / HIT`;
    default:return '';
  }
}

const GROUPS=[['rim','CHARGED RIMS'],['lucky','LUCKY POCKETS'],['spark','LIGHT SHOW'],['od-gain','VOLTAGE AMPLIFIER']];
export function ordinaryAttribution(run,hole,ball,rimHits=0,now=0){
  if(hole.kind!=='score'||run.challenge)return null;
  run=expireSwitchboard(run,now);
  const stripped=run.upgrades.filter(id=>!GROUPS.some(([group])=>group===id));
  const staged={...run,upgrades:stripped};
  let previous=payout(staged,hole,ball,rimHits,now).amount;
  const baseline=previous,contributions=[];
  for(const [id,label] of GROUPS){
    const stacks=count(run,id);if(!stacks)continue;
    staged.upgrades=[...staged.upgrades,...Array(stacks).fill(id)];
    const current=payout(staged,hole,ball,rimHits,now).amount;
    contributions.push({id,label,tickets:current-previous});previous=current;
  }
  return {baseline,contributions,actual:previous,charge:charge(run)};
}

export const newFeedbackStats=()=>({tickets:{rim:0,lucky:0,spark:0,'od-gain':0},chargeAdded:0,echoesReleased:0});
export function recordOrdinary(stats,result){
  if(!result)return stats;
  const tickets={...stats.tickets};for(const item of result.contributions)tickets[item.id]+=item.tickets;
  return {...stats,tickets,chargeAdded:stats.chargeAdded+result.charge};
}
export function recordEcho(stats){return {...stats,echoesReleased:stats.echoesReleased+1};}

export class FeedbackBatcher {
  constructor(onFlush,delay=140,schedule=(callback,ms)=>globalThis.setTimeout(callback,ms),cancel=handle=>globalThis.clearTimeout(handle)){this.onFlush=onFlush;this.delay=delay;this.schedule=schedule;this.cancelTimer=cancel;this.pending=null;this.timer=null;}
  push({tickets=0,contributions=[],charge=0,echoes=0}){
    const batch=this.pending||{tickets:0,labels:new Map(),charge:0,echoes:0};batch.tickets+=tickets;batch.charge+=charge;batch.echoes+=echoes;
    for(const item of contributions)if(item.tickets>0)batch.labels.set(item.label,(batch.labels.get(item.label)||0)+item.tickets);
    this.pending=batch;if(this.timer!==null)return;
    const schedule=this.schedule;
    this.timer=schedule(()=>{this.timer=null;const ready=this.pending;this.pending=null;if(ready)this.onFlush(ready);},this.delay);
  }
  reset(){if(this.timer!==null){const cancel=this.cancelTimer;cancel(this.timer);}this.timer=null;this.pending=null;}
}

export function feedbackLines(batch){
  const lines=[];if(batch.tickets)lines.push(`+${batch.tickets.toLocaleString()} TICKETS`);else if(batch.echoes)lines.push(`+${batch.echoes} ECHO RELEASED`);else if(batch.charge)lines.push(`+${batch.charge} NEXT JP`);
  const ranked=[...batch.labels].sort((a,b)=>b[1]-a[1]);
  lines.push(...ranked.slice(0,2).map(([label,value])=>`${label} +${value}`));
  const extras=[],remaining=ranked.slice(2).reduce((sum,[,value])=>sum+value,0);
  if(remaining)extras.push(`+${remaining} BUILD BONUS TIX`);if(batch.charge)extras.push(`+${batch.charge} NEXT JP`);if(batch.echoes&&batch.tickets)extras.push(`+${batch.echoes} ECHO`);
  if(extras.length)lines[2]=[lines[2],...extras].filter(Boolean).join(' · ');
  return lines.slice(0,3);
}
