import {segmentBlockedBySolid} from './colliders.js';

export const TABLET_HINTS=['none','move','contract','cast','shed','run'];
const prefix='puddle.tablet.v1.';
const defaultStorage=()=>{try{return globalThis.localStorage;}catch{return null;}};
export function tabletScope(level){return level.tabletScope||`campaign:${level.id}:${level.contentRevision||'original'}`;}
export function tabletSeen(level,id,storage=defaultStorage(),memorySeen){
  const key=`${prefix}${tabletScope(level)}:${id}`;
  if(memorySeen?.has(key))return true;
  try{return storage?.getItem(key)==='1';}catch{return false;}
}
export function markTabletSeen(level,id,storage=defaultStorage(),memorySeen){
  const key=`${prefix}${tabletScope(level)}:${id}`;memorySeen?.add(key);
  try{storage?.setItem(key,'1');}catch{/* Reading still works without storage. */}
}
export function tabletCoverage(tablet,owned,colliders,radius){
  const target={x:tablet.x,y:tablet.y+.15,z:tablet.z};let touching=0;
  for(const p of owned){if(Math.hypot(p.x-target.x,p.z-target.z)>.55+radius||
      Math.abs(p.y-target.y)>.55+radius||segmentBlockedBySolid(p,target,colliders))continue;
    if(++touching>=5)return true;}
  return false;
}
export function openTablet(sim,tablet){
  const state=sim.garden,found=state.tablets.find(t=>t.id===tablet?.id);
  if(!found||state.phase!=='playing')return false;
  sim.syncGardenClock?.();state.phase='reading';state.activeTabletId=found.id;
  found.read=true;found.progress=0;markTabletSeen(sim.gardenLevel,found.id,sim.tabletStorage,sim.tabletMemorySeen);return true;
}
export function closeTablet(sim){
  const state=sim.garden;if(state.phase!=='reading')return false;
  sim.syncGardenClock?.();state.phase='playing';state.activeTabletId=null;
  // The input must be released before the player moves or contracts again.
  sim.gardenInputArmed=false;return true;
}
export function nearbyTablet(sim,maxDistance=1.15){
  if(sim.garden?.phase!=='playing')return null;
  const b=sim.brain,colliders=sim.activeColliders();
  return sim.garden.tablets.find(t=>Math.hypot(t.x-b.x,t.z-b.z)<maxDistance&&
    Math.abs((t.y-.15)-b.y)<.45&&
    !segmentBlockedBySolid(b,{x:t.x,y:t.y+.15,z:t.z},colliders))||null;
}
