export const REWARD_ITEMS=Object.freeze(['jet','flywheel','prism','tileBomb','freeSwap']);
export const REWARD_CAP=1_000_000;

// The items array, when present, is the complete grant. The legacy pair is
// retained for old ledger rows and clients, never added on top of items.
export function parseRewardPayload(value){
  if(!value||!Number.isSafeInteger(value.coins)||value.coins<0||value.coins>REWARD_CAP)return null;
  const entries=Object.hasOwn(value,'items')?value.items:value.item===null&&value.quantity===0?[]:[{item:value.item,quantity:value.quantity}];
  if(!Array.isArray(entries)||entries.length>5)return null;
  const amounts=new Map();
  for(const entry of entries){
    if(!REWARD_ITEMS.includes(entry?.item)||!Number.isSafeInteger(entry.quantity)||entry.quantity<1||entry.quantity>REWARD_CAP)return null;
    const total=(amounts.get(entry.item)??0)+entry.quantity;
    if(total>REWARD_CAP)return null;
    amounts.set(entry.item,total);
  }
  return {coins:value.coins,items:[...amounts].map(([item,quantity])=>({item,quantity}))};
}

export function validRewardDay(day){
  if(typeof day!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(day))return false;
  const date=new Date(`${day}T00:00:00.000Z`);
  return Number.isFinite(date.getTime())&&date.toISOString().slice(0,10)===day;
}
export function previousRewardDay(day){
  if(!validRewardDay(day))throw new Error('Invalid reward day');
  return new Date(new Date(`${day}T00:00:00.000Z`).getTime()-86_400_000).toISOString().slice(0,10);
}
export function normalizeDailyVisit(value){
  if(!value||!validRewardDay(value.day)||!Number.isInteger(value.cycleDay)||value.cycleDay<1||value.cycleDay>5||![1,2].includes(value.version)||!parseRewardPayload(value.payload))return null;
  return {day:value.day,cycleDay:value.cycleDay,version:value.version,payload:value.payload};
}
