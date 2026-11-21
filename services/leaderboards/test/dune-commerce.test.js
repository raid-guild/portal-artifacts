import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createDuneCommerce } from '../src/dune-commerce.js';
import { accessTierForLevel, accessTierForCampaign } from '../src/dune-rules.js';

const identity={issuer:'https://portal.example.test',subject:'user:123'};
const grant={schemaVersion:1,productId:'rg:digital:dune-relay-pass',capability:'dune-relay:campaign-pass',issuer:identity.issuer,portalUserId:'123',environment:'live',active:true,grantedAt:'2026-11-21T00:00:00.000Z',checkedAt:'2026-11-21T00:00:01.000Z'};
const response=value=>({ok:true,json:async()=>value});
const make=(fetchImpl,extras={})=>createDuneCommerce({origin:'http://127.0.0.1:3315',apiKey:'test-service-key',environment:'live',storeUrl:'https://store.example.test/products/dune-relay-pass',fetchImpl,...extras});

test('chapter access boundaries are based on authored level index',()=>{
  assert.equal(accessTierForLevel({index:29}),'demo');
  assert.equal(accessTierForLevel({index:30}),'farmland');
  assert.equal(accessTierForLevel({index:39}),'farmland');
  assert.equal(accessTierForLevel({index:40}),'campaign-pass');
  assert.equal(accessTierForCampaign({completed:Array(40).fill('done'),region:'farmland'}),'farmland','Farmland ending does not require a purchase');
  assert.equal(accessTierForCampaign({completed:Array(40).fill('done'),region:'town'}),'campaign-pass');
});

test('missing configuration and insecure nonlocal origins fail closed',async()=>{
  for(const config of [{origin:undefined,apiKey:undefined},{origin:'http://commerce.example.test',apiKey:'secret'},{origin:'https://user:pass@commerce.example.test',apiKey:'secret'}]) {
    const client=createDuneCommerce({...config,fetchImpl:()=>{throw Error('should not fetch');}});
    assert.equal((await client.check(identity)).state,'unavailable');
  }
});
test('store URL permits HTTPS and loopback HTTP without embedded credentials',async()=>{
  const read=async storeUrl=>make(async()=>response(grant),{storeUrl}).check(identity);
  assert.equal((await read('http://127.0.0.1:3315/products/dune-relay-pass')).storeUrl,'http://127.0.0.1:3315/products/dune-relay-pass');
  assert.equal((await read('javascript://localhost/attack')).storeUrl,null);
  assert.equal((await read('https://user:pass@store.example.test/pass')).storeUrl,null);
  assert.equal((await read('http://store.example.test/pass')).storeUrl,null);
});

test('lookup binds the exact Portal issuer, ID, environment, and dedicated credential',async()=>{
  let calls=0, clock=0;
  const client=make(async(url,init)=>{
    calls++;
    assert.equal(url.searchParams.get('issuer'),identity.issuer);
    assert.equal(url.searchParams.get('portalUserId'),'123');
    assert.equal(init.headers.Authorization,'Bearer test-service-key');
    assert.equal(init.cache,'no-store');
    return response(grant);
  },{now:()=>clock});
  assert.equal((await client.check(identity)).state,'active');
  assert.equal((await client.check(identity)).state,'active');
  assert.equal(calls,1);
  assert.equal((await client.check(identity,{refresh:true})).state,'active');
  assert.equal(calls,2);
  clock=300001;
  assert.equal((await client.check(identity)).state,'active');
  assert.equal(calls,3);
});

test('invalid grants, identity mismatch, bad environment, timeout, and HTTP errors fail closed',async()=>{
  const broken=[
    {...grant,productId:'other'}, {...grant,capability:'other'}, {...grant,issuer:'https://other.example.test'},
    {...grant,portalUserId:'456'}, {...grant,environment:'test'}, {...grant,active:'yes'},
    {...grant,checkedAt:'bad'}, {...grant,grantedAt:null}, {...grant,active:false,grantedAt:grant.grantedAt},
  ];
  for(const value of broken) assert.equal((await make(async()=>response(value)).check(identity)).state,'unavailable');
  assert.equal((await make(async()=>({ok:false,status:503})).check(identity)).state,'unavailable');
  assert.equal((await make(async()=>{throw new DOMException('timed out','TimeoutError');}).check(identity)).state,'unavailable');
  assert.equal((await make(async()=>response({...grant,active:false,grantedAt:null})).check(identity)).state,'locked');
});
test('concurrent outages share one lookup, stay briefly cached, and manual refresh bypasses the outage cache',async()=>{
  let clock=0,calls=0,release;
  const wait=new Promise(resolve=>{release=resolve;});
  const client=make(async()=>{calls++;await wait;return {ok:false,status:503};},{now:()=>clock});
  const first=client.check(identity),second=client.check(identity),third=client.check(identity);
  release();
  assert.deepEqual((await Promise.all([first,second,third])).map(result=>result.state),['unavailable','unavailable','unavailable']);
  assert.equal(calls,1);
  assert.equal((await client.check(identity)).state,'unavailable');
  assert.equal(calls,1,'ordinary reads do not hit the store during a short outage');
  assert.equal((await client.check(identity,{refresh:true})).state,'unavailable');
  assert.equal(calls,2,'manual refresh bypasses the outage cache');
  clock=20_001;
  assert.equal((await client.check(identity)).state,'unavailable');
  assert.equal(calls,3,'ordinary lookup retries after the short outage TTL');
});
test('manual refresh starts a fresh request and an older response cannot replace its grant',async()=>{
  let calls=0,releaseOld,releaseFresh;
  const oldWait=new Promise(resolve=>{releaseOld=resolve;});
  const freshWait=new Promise(resolve=>{releaseFresh=resolve;});
  const client=make(async()=>{
    calls++;
    if(calls===1) { await oldWait;return response({...grant,active:false,grantedAt:null}); }
    if(calls===2) { await freshWait;return response(grant); }
    throw Error('unexpected extra fetch');
  });
  const oldNormal=client.check(identity);
  const manual=client.check(identity,{refresh:true});
  const repeatedManual=client.check(identity,{refresh:true});
  const newNormal=client.check(identity);
  assert.equal(calls,2,'forced refresh does not join an older routine lookup; repeats share the forced lookup');
  releaseFresh();
  assert.deepEqual((await Promise.all([manual,repeatedManual,newNormal])).map(result=>result.state),['active','active','active']);
  assert.equal((await client.check(identity)).state,'active');
  releaseOld();
  assert.equal((await oldNormal).state,'locked','old caller receives its own result');
  assert.equal((await client.check(identity)).state,'active','old result cannot overwrite newer cached access');
  assert.equal(calls,2);
});
