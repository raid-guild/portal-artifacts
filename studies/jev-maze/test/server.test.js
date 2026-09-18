import test from 'node:test';
import assert from 'node:assert/strict';
import {createApp} from '../server.mjs';
async function serve(t,options){const server=createApp(options);await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));t.after(()=>new Promise(resolve=>{server.close(resolve);server.closeAllConnections();}));return `http://127.0.0.1:${server.address().port}`;}
const state={exits:[{direction:'north',symbol:'zigzag'},{direction:'east',symbol:'circle'}],experience:{}};
const post=(url,s=state)=>fetch(`${url}/api/decision`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(s)});
test('key stays on server; .env and foreign origins are inaccessible',async t=>{const url=await serve(t,{apiKey:'test-secret'});const res=await fetch(url+'/api/status');assert.deepEqual(await res.json(),{configured:true,model:'jev-latest'});assert.equal((await fetch(url+'/.env')).status,404);assert.equal((await fetch(url+'/api/status',{headers:{Origin:'https://foreign.example'}})).status,403);});
test('no key fails clearly without an upstream request',async t=>{const url=await serve(t,{apiKey:'',fetchImpl:()=>assert.fail('must not call API')});const res=await post(url);assert.equal(res.status,503);assert.match((await res.json()).error,/TYPESAFE_API_KEY/);});
test('API proxy sends local observations and batched typed questions, returns inspector data',async t=>{let request;const url=await serve(t,{apiKey:'test-secret',fetchImpl:async(endpoint,options)=>{assert.equal(endpoint,'https://api.typesafe.ai/v1/systemone');assert.equal(options.headers.Authorization,'Bearer test-secret');request=JSON.parse(options.body);return Response.json({answers:{move:{type:'choice',choice:'east',probabilities:{north:.2,east:.8},confidence:.6}},usage:{input_tokens:20,output_tokens:5}});}});const res=await post(url);assert.equal(res.status,200);const data=await res.json();assert.deepEqual(request.state,state);assert.equal(Object.keys(request.questions).length,4);assert.equal(data.response.answers.move.choice,'east');assert.equal(JSON.stringify(data).includes('test-secret'),false);});
test('invalid choices and failed upstream requests do not advance or leak response content',async t=>{let attempt=0;const url=await serve(t,{apiKey:'test-secret',fetchImpl:async()=>++attempt===1?Response.json({answers:{move:{choice:'south'}}}):new Response('sensitive provider error',{status:401})});let res=await post(url);assert.equal(res.status,502);assert.match((await res.json()).error,/invalid move/);res=await post(url);assert.equal(res.status,502);assert.match((await res.json()).error,/HTTP 401/);});
test('invalid or duplicate exits are rejected before an API call',async t=>{const url=await serve(t,{apiKey:'test-secret',fetchImpl:()=>assert.fail('must not call API')});assert.equal((await post(url,{exits:[{direction:'north'},{direction:'north'}]})).status,400);assert.equal((await post(url,{exits:[{direction:'diagonal'},{direction:'east'}]})).status,400);});
test('personal keys are isolated per request and never returned in decision data',async t=>{
  const auth=[];
  const url=await serve(t,{apiKey:'server-secret',fetchImpl:async(_,options)=>{auth.push(options.headers.Authorization);return Response.json({answers:{move:{choice:'east'}}});}});
  const send=key=>fetch(url+'/api/decision',{method:'POST',headers:{'Content-Type':'application/json',...(key?{'X-Jev-Key':key}:{})},body:JSON.stringify(state)});
  for(const key of ['personal-a','personal-b',null]){const res=await send(key);assert.equal(res.status,200);const body=await res.text();for(const secret of ['personal-a','personal-b','server-secret'])assert.equal(body.includes(secret),false);}
  assert.deepEqual(auth,['Bearer personal-a','Bearer personal-b','Bearer server-secret']);
});
test('key check does not persist personal keys or disclose provider errors',async t=>{
  const url=await serve(t,{apiKey:'',fetchImpl:async()=>new Response('secret upstream detail',{status:401})});
  const res=await fetch(url+'/api/check-key',{method:'POST',headers:{'X-Jev-Key':'invalid-key'}});
  assert.equal(res.status,502);assert.equal((await res.text()).includes('secret upstream detail'),false);
  assert.equal((await (await fetch(url+'/api/status')).json()).configured,false);
  assert.equal((await post(url)).status,503);
});
