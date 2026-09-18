import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {hostedDecision,hostedKeyCheck} from '../public/api.js';
const state={mode:'semantic',objective:'Repair a radio',exits:[{direction:'north',description:'Component workshop'},{direction:'east',description:'Archive'}]};
test('hosted decisions send a visitor key only in the header and preserve inspectable requests',async()=>{
  let body;
  const result=await hostedDecision(state,'visitor-secret','jev-latest',async(url,options)=>{
    assert.equal(url,'/jev-api/systemone');assert.equal(options.headers.Authorization,'Bearer visitor-secret');assert.equal(options.credentials,'omit');
    body=JSON.parse(options.body);assert.equal(body.model,'jev-latest');assert.equal(body.questions.move.type,'choice');
    return Response.json({answers:{move:{choice:'north'}}});
  });
  assert.equal(result.response.answers.move.choice,'north');assert.equal(JSON.stringify(result).includes('visitor-secret'),false);
  assert.deepEqual(result.request,body);
});
test('hosted mode requires a personal key and rejects invalid or failed provider responses',async()=>{
  await assert.rejects(hostedDecision(state,''),/Enter your/);
  await assert.rejects(hostedDecision(state,'key','jev-latest',async()=>new Response('private details',{status:401})),/HTTP 401/);
  await assert.rejects(hostedDecision(state,'key','jev-latest',async()=>Response.json({answers:{move:{choice:'west'}}})),/invalid move/);
  assert.equal((await hostedKeyCheck('key','jev-latest',async()=>Response.json({answers:{connected:{noul:1}}}))).ok,true);
});
test('built artifact uses hosted mode and matches canonical JavaScript',async()=>{
  const out=new URL('../../../public/jev-maze/',import.meta.url);
  const html=await readFile(new URL('index.html',out),'utf8');
  assert.match(html,/data-hosted="true"/);assert.match(html,/src="\.\/app.js"/);assert.doesNotMatch(html,/returns to the server/);
  for(const name of ['app.js','api.js','engine.js','style.css','favicon.svg'])assert.equal(await readFile(new URL(name,out),'utf8'),await readFile(new URL(`../public/${name}`,import.meta.url),'utf8'));
});
