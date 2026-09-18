import {buildQuestions} from './engine.js';

// Hosted requests use only the visitor's tab-scoped key, never a server credential.
export async function hostedRequest(request,key,fetchImpl=fetch) {
  if(!key)throw Error('Enter your Jev API key above.');
  const res=await fetchImpl('/jev-api/systemone',{
    method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${key}`},
    body:JSON.stringify(request),signal:AbortSignal.timeout(30_000),credentials:'omit'
  });
  if(!res.ok)throw Error(`TypeSafe request failed (HTTP ${res.status}). Check your key and account access. No automatic retry was made.`);
  return res.json();
}
export async function hostedDecision(state,key,model='jev-latest',fetchImpl=fetch) {
  const request={model,state,questions:buildQuestions(state)},started=performance.now();
  const response=await hostedRequest(request,key,fetchImpl);
  if(!state.exits.some(e=>e.direction===response.answers?.move?.choice))throw Error('Jev returned an invalid move; the run has stopped.');
  return {request,response,latencyMs:Math.round(performance.now()-started)};
}
export async function hostedKeyCheck(key,model='jev-latest',fetchImpl=fetch) {
  const response=await hostedRequest({model,state:'Connection test.',questions:{connected:{type:'noul',instructions:'Does the state contain the words Connection test?'}}},key,fetchImpl);
  if(typeof response.answers?.connected?.noul!=='number')throw Error('Unexpected response to key check.');
  return {ok:true,model};
}
