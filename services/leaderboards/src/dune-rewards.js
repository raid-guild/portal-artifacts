import { content, fail } from './dune-rules.js';

export const REWARD_CATALOG_VERSION = 1;
export const RESOURCE_LIMIT = 1_000_000;

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

export function dailyReward(day=utcDay()) {
  return {key:`daily:${day}`,title:'Daily Visit',payload:{coins:100,item:null,quantity:0}};
}

export function rewardForClaim(key,campaign,date=new Date()) {
  if(typeof key!=='string'||key.length>50)throw fail(400,'Unknown reward.');
  if(key.startsWith('daily:')){
    if(key!==`daily:${utcDay(date)}`)throw fail(409,'This daily gift is no longer available.');
    return dailyReward(utcDay(date));
  }
  const reward=chapterRewards.find(item=>item.key===key);
  if(!reward)throw fail(400,'Unknown reward.');
  if(!Array.isArray(campaign?.completed)||campaign.completed.length<reward.completedCount||campaign.completed[reward.completedCount-1]!==reward.finalLevel)throw fail(409,'Finish this chapter before claiming its gift.');
  return reward;
}

export function addReward(profile,reward) {
  const {coins,item,quantity}=reward.payload;
  if(!Number.isSafeInteger(profile.campaign.coins)||profile.campaign.coins+coins>RESOURCE_LIMIT)throw fail(409,'Coin storage is full. Spend some coins before claiming.');
  if(item && (!Number.isSafeInteger(profile.inventory[item])||profile.inventory[item]+quantity>RESOURCE_LIMIT))throw fail(409,'Tool storage is full. Use an item before claiming.');
  return {...profile,revision:profile.revision+1,campaign:{...profile.campaign,coins:profile.campaign.coins+coins},inventory:item?{...profile.inventory,[item]:profile.inventory[item]+quantity}:profile.inventory};
}
