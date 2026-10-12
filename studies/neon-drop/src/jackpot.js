import {targetFor} from './state.js';

export const CINEMATIC_JACKPOTS = new Set(['mega-party','void-breaker']);
const PRIZES = [
  {kind:'tickets',fraction:.05,weight:35,name:'TICKET BURST',icon:'✦'},
  {kind:'tickets',fraction:.1,weight:30,name:'GOLD RUSH',icon:'◈'},
  {kind:'tickets',fraction:.2,weight:10,name:'MEGA STACK',icon:'✹'},
  {kind:'drops',amount:1,weight:15,name:'ENCORE BALL',icon:'●'},
  {kind:'charge',fraction:.1,weight:10,name:'REACTOR CHARGE',icon:'ϟ'},
];
// Three independent, positive draws. Cosmetic selection never enters the roll.
// At most +60% tickets, three drops, or +30% charge from one jackpot.
export function rollJackpotBonus(base,random=Math.random){
  const amount=Math.max(0,Math.floor(base));
  const cards=Array.from({length:3},()=>{
    let roll=Math.max(0,Math.min(.999999,random()))*100;
    const prize=PRIZES.find(p=>(roll-=p.weight)<0)||PRIZES.at(-1);
    return {kind:prize.kind,name:prize.name,icon:prize.icon,amount:prize.amount||Math.max(1,Math.floor(amount*prize.fraction))};
  });
  return {base:amount,cards,tickets:cards.filter(c=>c.kind==='tickets').reduce((sum,c)=>sum+c.amount,0),drops:cards.filter(c=>c.kind==='drops').reduce((sum,c)=>sum+c.amount,0),charge:cards.filter(c=>c.kind==='charge').reduce((sum,c)=>sum+c.amount,0)};
}
export function applyJackpotBonus(run,bonus){
  if(run.challenge||!run.lastScore?.jackpot||run.jackpotBonusScore===run.scores)return run;
  const next={...run,jackpotBonusScore:run.scores,lastJackpotBonus:bonus,
    roundTickets:run.roundTickets+bonus.tickets,totalTickets:run.totalTickets+bonus.tickets,
    drops:run.drops+bonus.drops,encoreAvailable:(run.encoreAvailable||0)+bonus.drops,jackpot:run.jackpot+bonus.charge};
  if(next.roundTickets>=targetFor(next))next.status='choose';
  return next;
}
export function reservePaidDrop(run){
  if(run.drops<=0)return null;
  const encore=(run.encoreAvailable||0)>0;
  return {run:{...run,drops:run.drops-1,encoreAvailable:(run.encoreAvailable||0)-Number(encore)},encore};
}
export function refundPaidDrops(run,items){
  const paid=items.filter(item=>!item.free);
  return {...run,drops:run.drops+paid.length,encoreAvailable:(run.encoreAvailable||0)+paid.filter(item=>item.encore).length};
}
export const DEMO_JACKPOT={base:450,tickets:135,drops:1,charge:0,cards:[
  {kind:'tickets',name:'GOLD RUSH',icon:'◈',amount:45},
  {kind:'drops',name:'ENCORE BALL',icon:'●',amount:1},
  {kind:'tickets',name:'MEGA STACK',icon:'✹',amount:90},
]};

export class JackpotShow {
  constructor(machine,audio){
    this.machine=machine;this.audio=audio;this.active=false;
    this.el=document.createElement('section');this.el.className='jackpot-show hidden';
    this.el.setAttribute('role','dialog');this.el.setAttribute('aria-modal','true');this.el.setAttribute('aria-label','Jackpot celebration');
    document.querySelector('.shell').append(this.el);
  }
  start(bonus,style,{preview=false,onFinish=()=>{}}={}){
    this.cancel();this.active=true;this.bonus=bonus;this.onFinish=onFinish;this.age=0;this.revealed=0;this.last=null;
    this.compact=this.machine.reducedEffects||matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.duration=this.compact?1.4:7.2;
    this.previousFocus=document.activeElement;
    this.inerted=[...document.querySelector('.shell').children].filter(child=>child!==this.el).map(child=>[child,child.inert]);
    for(const [child] of this.inerted)child.inert=true;
    this.onKey=e=>{if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();this.finish();}else if(e.key==='Tab'){e.preventDefault();this.el.querySelector('.jp-skip').focus();}};
    document.addEventListener('keydown',this.onKey,true);
    this.el.className=`jackpot-show ${style==='void-breaker'?'void-breaker':'mega-party'}${this.compact?' compact':''}`;
    this.el.innerHTML=`<div class="jp-letterbox"></div><div class="jp-streaks" aria-hidden="true"></div><div class="jp-header"><span>${preview?'WORKSHOP DEMO · NO REWARDS':'JACKPOT SECURED · GAMEPLAY PAUSED'}</span><button class="jp-skip">SKIP →</button></div><div class="jp-title"><small>${style==='void-breaker'?'LIMIT BREAK / 01':'SUPER MEGA'}</small><h2>${style==='void-breaker'?'VOID BREAKER':'FUN TIME!'}</h2><p>THE JACKPOT IS JUST THE BEGINNING.</p></div><div class="jp-payout"><small>${preview?'DEMO JACKPOT':'BASE JACKPOT BANKED'}</small><strong>${bonus.base.toLocaleString()} <em>TIX</em></strong></div><div class="jp-bottom"><div class="jp-cards">${bonus.cards.map((c,i)=>`<div class="jp-card" data-card="${i}"><span class="jp-card-back">✦<small>BONUS ${i+1}</small></span><span class="jp-card-front"><i>${c.icon}</i><small>${c.name}</small><b>+${c.amount.toLocaleString()} ${c.kind==='tickets'?'TIX':c.kind==='drops'?'DROP':'NEXT JP'}</b></span></div>`).join('')}</div><div class="jp-total" role="status" aria-live="polite"></div><span class="jp-note">${preview?'Visual sample only · outcomes shown are examples':'Bonuses already awarded · skipping keeps every reward'}</span></div>`;
    this.el.querySelector('.jp-skip').onclick=()=>this.finish();
    this.el.querySelector('.jp-skip').focus({preventScroll:true});
    this.machine.startJackpotCinematic(style,!this.compact);
    this.audio?.duckForJackpot();
    const tick=now=>{
      if(!this.active)return;
      const dt=this.last===null||document.hidden?0:Math.min((now-this.last)/1000,.05);this.last=now;this.age+=dt;
      const count=this.compact?3:Math.max(0,Math.min(3,Math.floor((this.age-2)/1.05)+1));
      if(count>this.revealed){
        for(let i=this.revealed;i<count;i++)this.el.querySelector(`[data-card="${i}"]`).classList.add('revealed');
        if(!preview&&!this.compact)this.audio?.sfx(count===3?'jackpot':bonus.cards[count-1].kind==='drops'?'free':'score');
        this.revealed=count;
        const total=bonus.base+bonus.cards.slice(0,count).filter(c=>c.kind==='tickets').reduce((n,c)=>n+c.amount,0);
        this.el.querySelector('.jp-total').textContent=`${total.toLocaleString()} TICKETS ${count===3?'SECURED':'AND COUNTING'}`;
      }
      this.el.classList.toggle('jp-finale',this.age>4.4&&!this.compact);
      this.el.style.setProperty('--jp-progress',Math.min(1,this.age/this.duration));
      if(this.age>=this.duration)this.finish();else this.frame=requestAnimationFrame(tick);
    };
    this.frame=requestAnimationFrame(tick);
  }
  finish(){if(!this.active)return;const callback=this.onFinish;this.cancel();callback();}
  cancel(){
    if(!this.active)return;this.active=false;cancelAnimationFrame(this.frame);this.machine.stopJackpotCinematic();
    document.removeEventListener('keydown',this.onKey,true);
    for(const [child,wasInert] of this.inerted)child.inert=wasInert;
    this.el.classList.add('hidden');if(this.previousFocus?.isConnected)this.previousFocus.focus({preventScroll:true});
  }
}
