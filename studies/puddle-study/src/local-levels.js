export const LOCAL_LEVELS_KEY='puddle.local-levels.v1';
import {scoreRun,betterRun,DEFAULT_TARGET_TIME} from './game-score.js';
export const LOCAL_PROGRESS_KEY='puddle.local-progress.v1';
const LEGACY_DRAFT_KEYS=['puddle-level-workshop-v3','puddle-level-workshop-v2','puddle-level-workshop-v1'];
const clone=value=>JSON.parse(JSON.stringify(value));
const defaultStorage=()=>{try{return globalThis.localStorage;}catch{return null;}};
export function localStorageForPage(search=globalThis.location?.search||''){
  const query=new URLSearchParams(search),mode=query.get('storage');
  if(mode==='memory')return null;
  const base=defaultStorage();if(mode!=='test')return base;
  const session=(query.get('session')||'local-level-qa').replace(/[^a-zA-Z0-9_-]/g,'').slice(0,60);
  return base?{getItem:key=>base.getItem(`puddle.test.${session}.${key}`),
    setItem:(key,value)=>base.setItem(`puddle.test.${session}.${key}`,value),
    removeItem:key=>base.removeItem(`puddle.test.${session}.${key}`)}:null;
}
export function localPageQuery(search=globalThis.location?.search||''){
  const query=new URLSearchParams(search);return query.get('storage')==='test'?
    `?storage=test&session=${encodeURIComponent(query.get('session')||'local-level-qa')}`:
    query.get('storage')==='memory'?'?storage=memory':'';
}
const uuid=()=>globalThis.crypto?.randomUUID?.()||`local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
const validEntry=e=>e&&typeof e.id==='string'&&e.id.length>0&&typeof e.document==='string'&&
  Number.isInteger(e.revision)&&e.revision>0&&typeof e.name==='string';
const documentInfo=document=>{
  const data=JSON.parse(document);
  if(data?.format!=='puddle-level'||![1,2,3].includes(data.version))throw new Error('Save a Puddle workshop level.');
  const source=data.draft||data.level;
  if(!source||typeof source!=='object')throw new Error('The level has no source draft.');
  const name=String(source.name||'Untitled garden').trim().slice(0,60)||'Untitled garden';
  const gameplay=clone(source);delete gameplay.name;
  if(gameplay.targetTime===undefined)gameplay.targetTime=DEFAULT_TARGET_TIME;
  // Moving a sign, revising its text, or consuming another editor ID changes
  // presentation only. Preserve earned scores for the same playable layout.
  if(Array.isArray(gameplay.objects))gameplay.objects=gameplay.objects.filter(o=>o.kind!=='label');
  delete gameplay.nextObjectId;
  return {name,fingerprint:JSON.stringify(gameplay)};
};

export function createLocalLevelLibrary({storage=defaultStorage(),key=LOCAL_LEVELS_KEY,
  legacyKeys=LEGACY_DRAFT_KEYS,idFactory=uuid,now=()=>Date.now()}={}){
  let state={version:1,migratedDraft:false,entries:[]},lastRaw='';
  const read=()=>{try{const raw=storage?.getItem(key);if(!raw||raw===lastRaw)return;
    const data=JSON.parse(raw);if(data?.version===1&&Array.isArray(data.entries)){
      const seen=new Set();state={version:1,migratedDraft:!!data.migratedDraft,entries:data.entries.filter(e=>{
        if(!validEntry(e)||seen.has(e.id))return false;seen.add(e.id);return true;})};lastRaw=raw;}
  }catch{/* An unavailable or corrupt store leaves the current in-memory library intact. */}};
  const write=()=>{const raw=JSON.stringify(state);if(raw===lastRaw)return true;
    try{storage?.setItem(key,raw);if(storage)lastRaw=raw;return !!storage;}catch{return false;}};
  read();
  if(!state.migratedDraft){
    let old=null;try{for(const oldKey of legacyKeys){old=storage?.getItem(oldKey);if(old)break;}}catch{}
    if(old){try{const info=documentInfo(old),stamp=now();state.entries.push({id:idFactory(),name:info.name,
      createdAt:stamp,updatedAt:stamp,revision:1,document:old});state.migratedDraft=true;write();}
    catch{/* Keep the migration open for a later valid saved draft. */}}
    else{state.migratedDraft=true;write();}
  }
  return {
    list(){read();return state.entries.map(e=>clone(e)).sort((a,b)=>b.updatedAt-a.updatedAt||a.name.localeCompare(b.name));},
    get(id){read();const found=state.entries.find(e=>e.id===id);return found?clone(found):null;},
    save(document,{id=null,asNew=false}={}){
      const info=documentInfo(document);read();const stamp=now(),existing=!asNew&&id?state.entries.find(e=>e.id===id):null;
      if(id&&!asNew&&!existing)throw new Error('That local level no longer exists. Save as new instead.');
      if(existing){const prior=documentInfo(existing.document);
        existing.revision+=Number(prior.fingerprint!==info.fingerprint);
        existing.name=info.name;existing.updatedAt=stamp;existing.document=document;
        if(!write())throw new Error('Local storage is unavailable; export JSON instead.');return clone(existing);}
      const entry={id:idFactory(),name:info.name,createdAt:stamp,updatedAt:stamp,revision:1,document};
      while(state.entries.some(e=>e.id===entry.id))entry.id=idFactory();
      state.entries.push(entry);if(!write())throw new Error('Local storage is unavailable; export JSON instead.');return clone(entry);
    },
    refresh(){read();return this.list();}
  };
}

export function createLocalLevelProgress({storage=defaultStorage(),key=LOCAL_PROGRESS_KEY}={}){
  let best={};try{const data=JSON.parse(storage?.getItem(key)||'null');if([1,2].includes(data?.version)&&data.best&&typeof data.best==='object')best=data.best;}catch{}
  let saveFailed=false;
  const normalize=result=>({...result,...(result?.elapsed!==undefined?
    {target:result.target===undefined?DEFAULT_TARGET_TIME:result.target}:{})});
  const score=result=>scoreRun(normalize(result))?.percent??null;
  const slot=(id,revision)=>`${id}:${revision}`;
  return {
    get saveFailed(){return saveFailed;},
    getBest(id,revision){const value=best[slot(id,revision)];return score(value)===null?null:{...value,...scoreRun(normalize(value))};},
    recordCompletion(id,revision,result){if(!id||!Number.isInteger(revision)||revision<1||score(result)===null)return false;
      const resultKey=slot(id,revision),prior=best[resultKey];if(!betterRun(normalize(result),prior&&normalize(prior)))return false;
      best[resultKey]={gold:result.gold,gems:result.gems,totalGold:result.totalGold,totalGems:result.totalGems,
        ...(Number.isFinite(result.elapsed)?{elapsed:result.elapsed,target:result.target??DEFAULT_TARGET_TIME}:{})};
      try{if(!storage?.setItem)throw new Error('storage unavailable');
        storage.setItem(key,JSON.stringify({version:2,best}));saveFailed=false;return true;}
      catch{saveFailed=true;return false;}
    }
  };
}
