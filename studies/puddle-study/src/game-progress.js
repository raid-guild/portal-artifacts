import {GARDEN_LEVELS} from './garden-level.js';

export const PROGRESS_KEY='puddle.progress.v1';
const known=new Map(GARDEN_LEVELS.map(level=>[level.id,{gold:level.gold.length,gems:level.gems.length}]));
const validCount=(value,max)=>Number.isInteger(value)&&value>=0&&value<=max;
const storageDefault=()=>{try{return globalThis.localStorage;}catch{return null;}};

export function completionPercent(levelId,result){
  const totals=known.get(levelId);
  if(!totals||!validCount(result?.gold,totals.gold)||!validCount(result?.gems,totals.gems))return null;
  return Math.round((result.gold+result.gems)/(totals.gold+totals.gems)*100);
}
export function meetsUnlockThreshold(levelId,result){
  const totals=known.get(levelId);
  return !!totals&&validCount(result?.gold,totals.gold)&&validCount(result?.gems,totals.gems)&&
    2*(result.gold+result.gems)>=totals.gold+totals.gems;
}

export function createGameProgress({storage=storageDefault(),key=PROGRESS_KEY}={}){
  const best={},unlocked=new Set([GARDEN_LEVELS[0].id]);
  let lastSaved='';
  try{
    const raw=storage?.getItem(key),data=raw&&JSON.parse(raw);
    if(data?.version===1&&data.best&&typeof data.best==='object'&&!Array.isArray(data.best)){
      for(const level of GARDEN_LEVELS){const value=data.best[level.id];
        if(completionPercent(level.id,value)!==null)best[level.id]={gold:value.gold,gems:value.gems};}
      for(const level of GARDEN_LEVELS.slice(0,-1))if(meetsUnlockThreshold(level.id,best[level.id]))unlocked.add(level.id+1);
    }
  }catch{/* Private browsing and malformed storage fall back to memory. */}
  const serialize=()=>JSON.stringify({version:1,best,unlocked:[...unlocked].sort((a,b)=>a-b)});
  lastSaved=serialize();
  const persist=()=>{const next=serialize();if(next===lastSaved)return;lastSaved=next;
    try{storage?.setItem(key,next);}catch{/* Keep the in-memory result. */}};
  return {
    getBest(id){return best[id]?{...best[id],percent:completionPercent(id,best[id])}:null;},
    isUnlocked(id){return known.has(id)&&unlocked.has(id);},
    recordCompletion(id,result){
      const score=completionPercent(id,result);if(score===null)return false;
      let changed=false;
      const previous=best[id];
      if(!previous||result.gold+result.gems>previous.gold+previous.gems||
        result.gold+result.gems===previous.gold+previous.gems&&result.gems>previous.gems){
        best[id]={gold:result.gold,gems:result.gems};changed=true;
      }
      if(meetsUnlockThreshold(id,result)&&known.has(id+1)&&!unlocked.has(id+1)){unlocked.add(id+1);changed=true;}
      if(changed)persist();return changed;
    },
    snapshot(){return {version:1,best:Object.fromEntries(Object.entries(best).map(([id,value])=>[id,{...value}])),unlocked:[...unlocked].sort((a,b)=>a-b)};}
  };
}
