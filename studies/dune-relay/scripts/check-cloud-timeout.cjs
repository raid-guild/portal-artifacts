const assert=require('node:assert/strict');
const {resetReady}=require('../src/game/cloud.ts');

async function main(){
  const originalFetch=global.fetch,originalSetTimeout=global.setTimeout;
  let deadline,bodyStarted=false;
  try{
    global.setTimeout=(callback,delay,...args)=>{
      if(delay===8000){deadline=()=>callback(...args);return 0;}
      return originalSetTimeout(callback,delay,...args);
    };
    global.fetch=async(_url,{signal})=>({ok:true,json:()=>{
      bodyStarted=true;
      return new Promise((_resolve,reject)=>signal.addEventListener('abort',()=>reject(new DOMException('Body stalled','AbortError')),{once:true}));
    }});
    const pending=resetReady();
    await Promise.resolve();
    assert(bodyStarted,'response headers arrived before body stalls');
    assert.equal(typeof deadline,'function');
    deadline();
    await assert.rejects(pending,error=>error?.name==='AbortError');
    console.log('Cloud request deadline remains active until response body finishes.');
  } finally {global.fetch=originalFetch;global.setTimeout=originalSetTimeout;}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
