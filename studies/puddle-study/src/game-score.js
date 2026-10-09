export const DEFAULT_TARGET_TIME=30;
export const CAMPAIGN_TARGETS=Object.freeze([30,45,50,55,60,90,135]);

export function scoreRun(result){
  const {gold,gems,totalGold,totalGems,elapsed,target}=result||{};
  if(![gold,gems,totalGold,totalGems].every(n=>Number.isInteger(n)&&n>=0)||
    gold>totalGold||gems>totalGems)return null;
  // Only records without either time field are legacy scores. Invalid or
  // incomplete timed records must not silently gain collectible-only scoring.
  const hasElapsed=elapsed!==undefined,hasTarget=target!==undefined;
  if(hasElapsed!==hasTarget||hasElapsed&&(!Number.isFinite(elapsed)||elapsed<0||
    !Number.isFinite(target)||target<=0)||result?.version===2&&!hasElapsed)return null;
  const collection=(totalGold+totalGems)?(gold+gems)/(totalGold+totalGems):1;
  const timed=Number.isFinite(elapsed)&&elapsed>=0&&Number.isFinite(target)&&target>0;
  const timePoints=timed&&elapsed<=target?20:0;
  const collectionPoints=collection*(timed?80:100);
  return {collection,collectionPercent:Math.round(collection*100),collectionPoints,
    timePoints,percent:Math.round(collectionPoints+timePoints),elapsed:timed?elapsed:null,
    target:timed?target:null,version:timed?2:1};
}

export function betterRun(candidate,prior){
  const a=scoreRun(candidate),b=scoreRun(prior);
  if(!a)return false;if(!b)return true;
  // Legacy records have no invented time bonus. Compare exact point values;
  // collection and then elapsed resolve ties without rounding away differences.
  return a.collectionPoints+a.timePoints>b.collectionPoints+b.timePoints||
    a.collectionPoints+a.timePoints===b.collectionPoints+b.timePoints&&
    (a.collection>b.collection||a.collection===b.collection&&
      (a.elapsed??Infinity)<(b.elapsed??Infinity));
}
