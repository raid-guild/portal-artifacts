export const RANKED_VERSION='1';
export const RANKED_BASE='/leaderboard-api/puddle-study';
import {PUDDLE_LEVELS} from './ranked-content.js';

// The API owns authentication and scoring. No token enters browser storage.
export function createRankedClient({fetcher=globalThis.fetch?.bind(globalThis),onChange=()=>{},retryDelayMs=1000,requestTimeoutMs=8000}={}){
  let session=null,sessionChecked=false,active=null,lastResult=null;
  const request=async(path,options={})=>{
    const controller=new AbortController();let timer;
    try{
      // Bound both the network response and JSON body. The race also protects
      // callers when a custom fetcher ignores AbortSignal.
      return await Promise.race([
        (async()=>{
          const response=await fetcher(RANKED_BASE+path,{credentials:'same-origin',cache:'no-store',...options,signal:controller.signal});
          const body=await response.json().catch(()=>({}));
          if(!response.ok)throw Object.assign(new Error(body.message||'Leaderboard unavailable.'),{status:response.status});
          return body;
        })(),
        new Promise((_,reject)=>{timer=setTimeout(()=>{controller.abort();reject(new Error('Leaderboard request timed out.'));},requestTimeoutMs);}),
      ]);
    }finally{clearTimeout(timer);}
  };
  const sessionPromise=request('/session').then(value=>{session=value;onChange();return value;})
    .catch(()=>null).finally(()=>{sessionChecked=true;onChange();});
  async function submit(run){
    if(active!==run||!run?.finish||!run.runId||run.inFlight||run.saved||run.attempts>=2)return;
    run.inFlight=true;run.attempts++;
    try{
      const result=await request(`/runs/${run.runId}/finish`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(run.finish)});
      run.saved=true;if(active===run){lastResult=result;onChange();}
    }catch(error){
      if(active!==run)return;
      const retryable=!error.status||error.status>=500;
      lastResult={saved:false,message:retryable&&run.attempts<2?'Retrying high score…':error.message};onChange();
      if(retryable&&run.attempts<2)setTimeout(()=>submit(run),retryDelayMs);
    }finally{run.inFlight=false;}
  }
  function begin(sim,{eligible=true}={}){
    active=null;lastResult=null;onChange();
    if(!eligible||sim.isLocalGarden||sim.practiceLevel)return false;
    if(!session){
      if(!sessionChecked){const serial=sim.runSerial;
        sessionPromise.then(()=>{if(session&&sim.runSerial===serial&&sim.garden.phase==='arriving')begin(sim,{eligible});});}
      return false;
    }
    const serial=sim.runSerial,level=sim.gardenLevelId;
    const run={serial,level,beginAt:globalThis.performance?.now?.()??Date.now(),runId:null,finish:null,
      inFlight:false,saved:false,attempts:0};active=run;
    request('/runs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({version:RANKED_VERSION,level,contentId:PUDDLE_LEVELS[level]?.contentId})})
      .then(value=>{if(active!==run||sim.runSerial!==serial)return;run.runId=value.runId;submit(run);})
      .catch(error=>{if(active!==run)return;active=null;lastResult={saved:false,message:error.message};onChange();});
    return true;
  }
  function finish(sim){
    const run=active;
    if(!run||run.serial!==sim.runSerial||run.finish||sim.isLocalGarden)return;
    const g=sim.garden;
    if(!Number.isFinite(g.finishElapsed))return;
    run.finish=Object.freeze({version:RANKED_VERSION,level:run.level,gold:g.goldCount,gems:g.gemCount,
      durationMs:Math.round(g.finishElapsed*1000),
      excludedMs:(g.excludedMs??0)+Math.round(Math.max(0,(sim.gardenClock?.start??run.beginAt)-run.beginAt))});
    submit(run);onChange();
  }
  return {
    get session(){return session;},get sessionChecked(){return sessionChecked;},
    get lastResult(){return lastResult;},get active(){return active;},
    sessionPromise,begin,finish,
    board:level=>request(`/leaderboard?level=${encodeURIComponent(level)}`),
  };
}
