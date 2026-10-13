export const SWITCH_COLORS=[0x44eaff,0xff58bc,0xffcd65];
export const SWITCH_POSITIONS=Array.from({length:3},(_,i)=>({x:Math.cos(-Math.PI/2+i*Math.PI*2/3)*1.6,z:Math.sin(-Math.PI/2+i*Math.PI*2/3)*1.6}));
export const newSwitchboard=()=>({channels:[0,0,0],levels:[0,0,0],overloadUntil:0,reactor:0,ballHits:{},switchHits:[-1,-1,-1]});
const count=(run,id)=>run.upgrades?.filter(x=>x===id).length||0;
export function expireSwitchboard(run,now){
  if(run.cabinet!=='switchboard'||!run.switchboard)return run;
  const s=run.switchboard;
  if(s.overloadUntil>0&&now>=s.overloadUntil)return {...run,switchboard:{...s,channels:[0,0,0],levels:[0,0,0],overloadUntil:0}};
  if(s.channels.every(t=>t===0||t>now))return run;
  return {...run,switchboard:{...s,channels:s.channels.map(t=>t>now?t:0),levels:s.levels.map((level,i)=>s.channels[i]>now?level:0)}};
}
export function hitSwitch(run,switchIndex,ballId,now){
  if(run.cabinet!=='switchboard'||run.challenge||!run.switchboard||switchIndex<0||switchIndex>2)return {run,hit:false};
  run=expireSwitchboard(run,now);
  const s=run.switchboard,key=`${ballId}:${switchIndex}`;
  if(now-(s.ballHits[key]??-1)<.4||now-(s.switchHits[switchIndex]??-1)<.1)return {run,hit:false};
  const channels=[...s.channels],levels=[...s.levels];levels[switchIndex]=Math.min(2,levels[switchIndex]+1);channels[switchIndex]=now+Math.min(16,8+2*count(run,'sw-fuse'));
  let overloadUntil=s.overloadUntil;
  if(overloadUntil<=now&&channels.every(t=>t>now))overloadUntil=now+Math.min(8,4+count(run,'sw-overload'));
  const reactor=Math.min(50,s.reactor+Math.min(6,3+count(run,'sw-coil')));
  const next={...s,channels,levels,overloadUntil,reactor,ballHits:{...s.ballHits,[key]:now},switchHits:s.switchHits.map((t,i)=>i===switchIndex?now:t)};
  return {run:{...run,switchboard:next},hit:true,reactor,overload:overloadUntil>now&&s.overloadUntil<=now};
}
export function pocketChannel(id){
  const match=/^(outer|inner)-(\d+)$/.exec(id||'');
  return match?Number(match[2])%3:-1;
}
export function switchMultiplier(run,hole,now){
  if(run.cabinet!=='switchboard'||hole.kind!=='score')return 1;
  const s=run.switchboard;if(!s)return 1;
  const channel=pocketChannel(hole.id);
  if(channel<0)return 1;
  const powered=s.channels[channel]>now?(s.levels[channel]>=2?2:1.5):1;
  return Math.min(4,(s.overloadUntil>now?2:1)*powered);
}
export function consumeReactor(run){
  if(run.cabinet!=='switchboard'||!run.switchboard)return {run,boost:0};
  const boost=Math.round(run.jackpot*run.switchboard.reactor/100);
  return {run:{...run,switchboard:{...run.switchboard,reactor:0}},boost};
}
export function nextSwitchRound(run){
  if(run.cabinet!=='switchboard'||!run.switchboard)return run;
  return {...run,switchboard:{...run.switchboard,channels:[0,0,0],levels:[0,0,0],overloadUntil:0,ballHits:{},switchHits:[-1,-1,-1]}};
}
export function forgetSwitchBall(run,ballId){
  if(run.cabinet!=='switchboard'||!run.switchboard)return run;
  const ballHits=Object.fromEntries(Object.entries(run.switchboard.ballHits).filter(([key])=>!key.startsWith(`${ballId}:`)));
  return {...run,switchboard:{...run.switchboard,ballHits}};
}
