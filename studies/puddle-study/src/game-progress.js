import {GARDEN_LEVELS} from './garden-level.js';
import {scoreRun,betterRun,CAMPAIGN_TARGETS} from './game-score.js';

export const PROGRESS_KEY='puddle.progress.v1';
const known=new Map(GARDEN_LEVELS.map(level=>[level.id,{gold:level.gold.length,gems:level.gems.length}]));
const validCount=(value,max)=>Number.isInteger(value)&&value>=0&&value<=max;
const storageDefault=()=>{try{return globalThis.localStorage;}catch{return null;}};

export function completionPercent(levelId,result){
  const totals=known.get(levelId);
  if(!totals||!validCount(result?.gold,totals.gold)||!validCount(result?.gems,totals.gems))return null;
  return scoreRun({...result,totalGold:totals.gold,totalGems:totals.gems,
    target:result.target===undefined?(result.elapsed===undefined?undefined:CAMPAIGN_TARGETS[levelId-1]):result.target})?.percent??null;
}
export function meetsUnlockThreshold(levelId,result){
  const totals=known.get(levelId);
  return !!totals&&validCount(result?.gold,totals.gold)&&validCount(result?.gems,totals.gems)&&
    2*(result.gold+result.gems)>=totals.gold+totals.gems;
}

export function createGameProgress({storage=storageDefault(),key=PROGRESS_KEY}={}){
  const best={},bestCollection={},unlocked=new Set([GARDEN_LEVELS[0].id]);
  let lastSaved='';
  try{
    const raw=storage?.getItem(key),data=raw&&JSON.parse(raw);
    if([1,2].includes(data?.version)&&data.best&&typeof data.best==='object'&&!Array.isArray(data.best)){
      for(const level of GARDEN_LEVELS){const value=data.best[level.id];
        if(completionPercent(level.id,value)!==null)best[level.id]={gold:value.gold,gems:value.gems,
          ...(Number.isFinite(value.elapsed)&&value.elapsed>=0?{elapsed:value.elapsed,target:CAMPAIGN_TARGETS[level.id-1]}:{})};}
      for(const level of GARDEN_LEVELS){const value=data.bestCollection?.[level.id];
        if(completionPercent(level.id,value)!==null)bestCollection[level.id]={gold:value.gold,gems:value.gems};
        else if(best[level.id])bestCollection[level.id]={gold:best[level.id].gold,gems:best[level.id].gems};}
      for(const level of GARDEN_LEVELS.slice(0,-1))if(meetsUnlockThreshold(level.id,bestCollection[level.id]))unlocked.add(level.id+1);
    }
  }catch{/* Private browsing and malformed storage fall back to memory. */}
  const serialize=()=>JSON.stringify({version:2,best,bestCollection,unlocked:[...unlocked].sort((a,b)=>a-b)});
  lastSaved=serialize();
  const persist=()=>{const next=serialize();if(next===lastSaved)return;lastSaved=next;
    try{storage?.setItem(key,next);}catch{/* Keep the in-memory result. */}};
  return {
    getBest(id){const totals=known.get(id);return best[id]?{...best[id],...scoreRun({...best[id],totalGold:totals.gold,totalGems:totals.gems})}:null;},
    isUnlocked(id){return known.has(id)&&unlocked.has(id);},
    recordCompletion(id,result){
      const score=completionPercent(id,result);if(score===null)return false;
      let changed=false;
      const previous=best[id];
      const candidate={gold:result.gold,gems:result.gems,
        ...(Number.isFinite(result.elapsed)&&result.elapsed>=0?{elapsed:result.elapsed,target:CAMPAIGN_TARGETS[id-1]}:{})};
      const totals=known.get(id);
      if(betterRun({...candidate,totalGold:totals.gold,totalGems:totals.gems},
        previous&&{...previous,totalGold:totals.gold,totalGems:totals.gems})){
        best[id]=candidate;changed=true;
      }
      const collection=bestCollection[id];
      if(!collection||result.gold+result.gems>collection.gold+collection.gems){
        bestCollection[id]={gold:result.gold,gems:result.gems};changed=true;
      }
      if(meetsUnlockThreshold(id,result)&&known.has(id+1)&&!unlocked.has(id+1)){unlocked.add(id+1);changed=true;}
      if(changed)persist();return changed;
    },
    snapshot(){return {version:2,best:Object.fromEntries(Object.entries(best).map(([id,value])=>[id,{...value}])),
      bestCollection:Object.fromEntries(Object.entries(bestCollection).map(([id,value])=>[id,{...value}])),
      unlocked:[...unlocked].sort((a,b)=>a-b)};}
  };
}
