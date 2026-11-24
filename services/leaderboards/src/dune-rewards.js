import { content, fail } from './dune-rules.js';
import { randomInt } from 'node:crypto';
import { parseRewardPayload, previousRewardDay, REWARD_CAP } from './dune-reward-shared.js';

export const REWARD_CATALOG_VERSION = 2;
export const RESOURCE_LIMIT = REWARD_CAP;

const chapters = [
  ['oasis','openWaterway','Waterway Restored','jet'],
  ['caravan','lightTheRoute','Route Beacon Lit','flywheel'],
  ['gatehouse','openTheCrossing','Bridge Open','prism'],
  ['farmland','openTheHarvestRoad','Harvest Road Open','tileBomb'],
  ['town','openTheMarket','Market Open','freeSwap'],
  ['castle','openTheUpstreamRoute','Upstream Route Open','flywheel'],
  ['river','openTheCollectionRoute','Collection Route Open','prism'],
];

export const chapterRewards = Object.freeze(chapters.map(([chapter,finalLevel,title,item])=>{
  const index=content.levels.findIndex(level=>level.id===finalLevel);
  if(index<0)throw new Error(`Missing chapter finale ${finalLevel}`);
  return Object.freeze({key:`chapter:${chapter}`,chapter,finalLevel,completedCount:index+1,title,payload:Object.freeze({coins:200,item,quantity:1})});
}));

export function utcDay(date=new Date()) {
  if(!(date instanceof Date)||!Number.isFinite(date.getTime()))throw new Error('Invalid reward clock');
  return date.toISOString().slice(0,10);
}

export const DAILY_POOL=Object.freeze(['jet','flywheel','prism']);
export const FARMLAND_DAILY_POOL=Object.freeze([...DAILY_POOL,'tileBomb','freeSwap']);
export function dailyPayload(cycleDay,farmlandReady=false,selectRandom=(pool)=>pool[randomInt(pool.length)]){
  if(cycleDay===1)return {coins:100,item:null,quantity:0};
  if(cycleDay===2)return {coins:200,item:null,quantity:0};
  if(cycleDay===4)return {coins:500,item:null,quantity:0};
  if(cycleDay===5)return {coins:1000,item:null,quantity:0};
  if(cycleDay!==3)throw new Error('Invalid streak day');
  const pool=farmlandReady?FARMLAND_DAILY_POOL:DAILY_POOL;
  const first=selectRandom(pool),second=selectRandom(pool);
  if(!pool.includes(first)||!pool.includes(second))throw new Error('Invalid random reward item');
  const items=first===second?[{item:first,quantity:2}]:[{item:first,quantity:1},{item:second,quantity:1}];
  return {coins:0,item:null,quantity:0,items};
}
export function projectDailyVisit(profile,day,todayClaim=null,yesterdayClaim=null){
  const existing=profile.dailyVisit;
  if(existing?.day===day)return existing;
  const previous=previousRewardDay(day);
  const cycleDay=existing?.day===previous?existing.cycleDay%5+1:yesterdayClaim?.reward_key===`daily:${previous}`?2:1;
  if(todayClaim)return {day,cycleDay:1,version:todayClaim.reward_version,payload:todayClaim.reward_payload};
  return {day,cycleDay,version:REWARD_CATALOG_VERSION,payload:cycleDay===3?{coins:0,item:null,quantity:0,items:[]}:dailyPayload(cycleDay)};
}
export function reserveDailyVisit(profile,day,todayClaim=null,yesterdayClaim=null,selectRandom){
  if(profile.dailyVisit?.day===day)return profile.dailyVisit;
  const projected=projectDailyVisit(profile,day,todayClaim,yesterdayClaim);
  if(todayClaim)return projected;
  return {...projected,payload:dailyPayload(projected.cycleDay,profile.campaign.farmlandReady,selectRandom)};
}
export function dailyReward(visit) {
  return {key:`daily:${visit.day}`,title:'Daily Visit',cycleDay:visit.cycleDay,payload:visit.payload};
}

export function rewardForClaim(key,campaign,date=new Date(),dailyVisit=null) {
  if(typeof key!=='string'||key.length>50)throw fail(400,'Unknown reward.');
  if(key.startsWith('daily:')){
    if(key!==`daily:${utcDay(date)}`)throw fail(409,'This daily gift is no longer available.');
    if(dailyVisit?.day!==utcDay(date))throw fail(409,'Visit the game today before opening this gift.');
    return dailyReward(dailyVisit);
  }
  const reward=chapterRewards.find(item=>item.key===key);
  if(!reward)throw fail(400,'Unknown reward.');
  if(!Array.isArray(campaign?.completed)||campaign.completed.length<reward.completedCount||campaign.completed[reward.completedCount-1]!==reward.finalLevel)throw fail(409,'Finish this chapter before claiming its gift.');
  return reward;
}

export function addReward(profile,reward) {
  const parsed=parseRewardPayload(reward.payload);
  if(!parsed)throw fail(500,'Reward payload is invalid.');
  const {coins,items}=parsed;
  if(!Number.isSafeInteger(profile.campaign.coins)||profile.campaign.coins+coins>RESOURCE_LIMIT)throw fail(409,'Coin storage is full. Spend some coins before claiming.');
  for(const {item,quantity} of items)if(!Number.isSafeInteger(profile.inventory[item])||profile.inventory[item]+quantity>RESOURCE_LIMIT)throw fail(409,'Tool storage is full. Use an item before claiming.');
  const inventory={...profile.inventory};for(const {item,quantity} of items)inventory[item]+=quantity;
  return {...profile,revision:profile.revision+1,campaign:{...profile.campaign,coins:profile.campaign.coins+coins},inventory};
}
