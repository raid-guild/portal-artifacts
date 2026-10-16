const BASE='/leaderboard-api/puddle-study/community';
export const communityLink=(id,version)=>`${location.origin}/puddle-study/?community=${encodeURIComponent(id)}&version=${version}`;
export function pinnedCommunityFromSearch(search){
  const params=new URLSearchParams(search),id=params.get('community');
  if(!id)return null;
  if(!params.has('version'))return {id,version:null};
  const raw=params.get('version');
  if(!/^(?:[1-9]\d{0,5}|1000000)$/.test(raw||''))return {id,version:null,invalidVersion:true};
  return {id,version:Number(raw)};
}
export function fetchPinnedCommunity(detail,client,signal){
  if(detail.invalidVersion)throw new Error('Invalid community version in the link.');
  return detail.version===null?client.latest(detail.id,signal):client.version(detail.id,detail.version,signal);
}
export function createCommunityClient({fetchImpl=fetch,timeout=12000}={}){
  async function request(path,{method='GET',body,signal}={}){
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeout);
    const abort=()=>controller.abort();signal?.addEventListener('abort',abort,{once:true});
    try{
      const response=await fetchImpl(`${BASE}${path}`,{method,credentials:'include',
        headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined,signal:controller.signal});
      const data=await response.json().catch(()=>({}));
      if(!response.ok){const error=new Error(data.error||data.message||`Community service returned ${response.status}.`);
        error.status=response.status;throw error;}
      return data;
    }catch(error){if(error.name==='AbortError'&&!signal?.aborted)throw new Error('Community service timed out. Try again.');throw error;}
    finally{clearTimeout(timer);signal?.removeEventListener('abort',abort);}
  }
  return {
    list:(cursor,signal)=>request(`/levels${cursor?`?cursor=${encodeURIComponent(cursor)}`:''}`,{signal}),
    latest:(id,signal)=>request(`/levels/${encodeURIComponent(id)}`,{signal}),
    version:(id,version,signal)=>request(`/levels/${encodeURIComponent(id)}/versions/${version}`,{signal}),
    mine:signal=>request('/mine',{signal}),
    owned:(id,signal)=>request(`/mine/${encodeURIComponent(id)}`,{signal}),
    create:(body,signal)=>request('/levels',{method:'POST',body,signal}),
    update:(id,body,signal)=>request(`/levels/${encodeURIComponent(id)}/versions`,{method:'POST',body,signal}),
    unpublish:(id,expectedVersion,signal)=>request(`/levels/${encodeURIComponent(id)}/unpublish`,{method:'POST',body:{expectedVersion},signal}),
    session:async signal=>{
      const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeout);
      const abort=()=>controller.abort();signal?.addEventListener('abort',abort,{once:true});
      try{const response=await fetchImpl('/leaderboard-api/puddle-study/session',
        {credentials:'include',signal:controller.signal});
        if(response.status===401)return null;
        if(!response.ok)throw new Error('Could not check your Portal login.');
        return response.json();
      }catch(error){if(error.name==='AbortError'&&!signal?.aborted)throw new Error('Login check timed out. Try again.');throw error;}
      finally{clearTimeout(timer);signal?.removeEventListener('abort',abort);}
    },
  };
}
