import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import pg from 'pg';
import { SignJWT } from 'jose';
import { createHash, randomUUID } from 'node:crypto';
import { createDuneApp } from '../src/dune-app.js';
import { emptyCampaign, content } from '../src/dune-rules.js';
const database=process.env.TEST_DATABASE_URL;
if (!database || !['localhost','127.0.0.1'].includes(new URL(database).hostname) || !new URL(database).pathname.endsWith('_test')) throw new Error('Use local disposable *_test Postgres');
const pool=new pg.Pool({connectionString:database});
const secret='dune-test-secret-with-at-least-32-characters', origin='http://localhost:5173', issuer='https://portal.example.test';
let server,base;
before(async()=>{
  const schema=await readFile(new URL('../schema.sql',import.meta.url),'utf8'); await pool.query(schema);await pool.query(schema);
  await pool.query('TRUNCATE artifact_leaderboards.dune_launch_intents,artifact_leaderboards.dune_operations,artifact_leaderboards.dune_completions,artifact_leaderboards.dune_attempts,artifact_leaderboards.dune_profiles,artifact_leaderboards.puddle_community_versions,artifact_leaderboards.puddle_community_levels,artifact_leaderboards.raid_profiles,artifact_leaderboards.runs,artifact_leaderboards.sessions,artifact_leaderboards.players,artifact_leaderboards.launches RESTART IDENTITY');
  server=createDuneApp({pool,origin,issuer,launchSecret:secret,secure:false}).listen(0,'127.0.0.1');await new Promise(resolve=>server.once('listening',resolve));base=`http://127.0.0.1:${server.address().port}/leaderboard-api/dune-relay`;
});
after(async()=>{await new Promise(resolve=>server.close(resolve));await pool.end();});
async function token(overrides={}){return new SignJWT({typ:'portal_module_launch',moduleSlug:'dune-relay',handle:'Tester',...overrides}).setProtectedHeader({alg:'HS256'}).setIssuer(issuer).setAudience('dune-relay').setSubject(`user:${Math.floor(Math.random()*1e8)}`).setJti(randomUUID()).setIssuedAt().setExpirationTime('120s').sign(new TextEncoder().encode(secret));}
const accountByCookie=new Map();
async function intent(){const r=await fetch(base+'/login',{redirect:'manual'});assert.equal(r.status,302);const cookie=r.headers.get('set-cookie')?.split(';')[0];const next=new URL(r.headers.get('location')).searchParams.get('next');const state=new URL(next,'https://portal.example.test').searchParams.get('state');assert.match(state,/^[a-f0-9]{64}$/);return {cookie,state};}
async function launch(overrides={}){const login=await intent();const r=await fetch(`${base}/callback?token=${await token({launchState:login.state,...overrides})}`,{redirect:'manual',headers:{Cookie:login.cookie}});const cookie=r.headers.getSetCookie().map(x=>x.split(';')[0]).find(x=>x.startsWith('dune_relay_session='));if(cookie){const session=await fetch(base+'/session',{headers:{Cookie:cookie}});if(session.ok)accountByCookie.set(cookie,(await session.json()).accountId);}return {r,cookie};}
async function call(route,cookie,body,accountId=accountByCookie.get(cookie)){return fetch(base+route,{method:body?'POST':'GET',headers:{Cookie:cookie,...(route!=='/session'&&accountId?{'X-Dune-Account-ID':accountId}:{}),...(body?{Origin:origin,'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});}
async function ok(r){const b=await r.json();assert.equal(r.status,200,JSON.stringify(b));return b;}
test('launch rejects bad claims and sessions are isolated',async()=>{assert.equal((await call('/session','')).status,401);assert.equal((await launch({moduleSlug:'wrong'})).r.headers.get('location'),`${origin}/dune-relay/?login=failed`);const {cookie}=await launch();assert.equal((await call('/session',cookie)).status,200);assert.equal((await call('/ready',cookie)).status,200);assert.equal((await fetch(base+'/attempts',{method:'POST',headers:{Cookie:cookie,'Content-Type':'application/json'},body:'{}'})).status,403);});
test('unsolicited, mismatched, missing-state, and replayed launch intents cannot switch accounts',async()=>{
  const existing=await launch();const first=await intent(),second=await intent();
  const signed=await token({launchState:first.state});
  const withoutCookie=await fetch(`${base}/callback?token=${signed}`,{redirect:'manual',headers:{Cookie:existing.cookie}});
  assert.equal(withoutCookie.headers.get('location'),`${origin}/dune-relay/?login=failed`);
  assert.equal((await call('/session',existing.cookie)).status,200,'old session survives rejected launch');
  const mismatch=await fetch(`${base}/callback?token=${signed}`,{redirect:'manual',headers:{Cookie:second.cookie}});
  assert.equal(mismatch.headers.get('location'),`${origin}/dune-relay/?login=failed`);
  const missing=await fetch(`${base}/callback?token=${await token()}`,{redirect:'manual',headers:{Cookie:first.cookie}});
  assert.equal(missing.headers.get('location'),'/leaderboard-api/dune-relay/login');
  const accepted=await fetch(`${base}/callback?token=${signed}`,{redirect:'manual',headers:{Cookie:first.cookie}});
  assert.equal(accepted.headers.get('location'),`${origin}/dune-relay/`);
  const replay=await fetch(`${base}/callback?token=${await token({launchState:first.state})}`,{redirect:'manual',headers:{Cookie:first.cookie}});
  assert.equal(replay.headers.get('location'),`${origin}/dune-relay/?login=failed`,'nonce cannot launch twice with another JWT');
});
test('invalid callbacks do not write accounts or sessions, and one nonce admits one concurrent launch',async()=>{
  const first=await intent(),second=await intent();
  const before=(await pool.query('SELECT (SELECT count(*) FROM artifact_leaderboards.players)::int AS players,(SELECT count(*) FROM artifact_leaderboards.sessions)::int AS sessions,(SELECT count(*) FROM artifact_leaderboards.launches)::int AS launches')).rows[0];
  const signed=await token({launchState:first.state});
  const invalid=[
    await fetch(`${base}/callback?token=${signed}`,{redirect:'manual',headers:{Cookie:second.cookie}}),
    await fetch(`${base}/callback?token=${signed}`,{redirect:'manual'}),
    await fetch(`${base}/callback?token=${await token({launchState:'f'.repeat(64)})}`,{redirect:'manual',headers:{Cookie:first.cookie}}),
  ];
  for(const response of invalid) assert.equal(response.headers.get('location'),`${origin}/dune-relay/?login=failed`);
  const direct=await fetch(`${base}/callback?token=${await token()}`,{redirect:'manual',headers:{Cookie:first.cookie}});
  assert.equal(direct.headers.get('location'),'/leaderboard-api/dune-relay/login');
  const after=(await pool.query('SELECT (SELECT count(*) FROM artifact_leaderboards.players)::int AS players,(SELECT count(*) FROM artifact_leaderboards.sessions)::int AS sessions,(SELECT count(*) FROM artifact_leaderboards.launches)::int AS launches')).rows[0];
  assert.deepEqual(after,before);
  const concurrent=await Promise.all([signed,await token({launchState:first.state})].map(value=>fetch(`${base}/callback?token=${value}`,{redirect:'manual',headers:{Cookie:first.cookie}})));
  assert.deepEqual(concurrent.map(response=>response.headers.get('location')).sort(),[`${origin}/dune-relay/`,`${origin}/dune-relay/?login=failed`].sort());
  const expired=await intent();
  await pool.query('UPDATE artifact_leaderboards.dune_launch_intents SET expires_at=now()-interval \'1 second\' WHERE nonce_hash=$1',[createHash('sha256').update(expired.state).digest('hex')]);
  const stale=await fetch(`${base}/callback?token=${await token({launchState:expired.state})}`,{redirect:'manual',headers:{Cookie:expired.cookie}});
  assert.equal(stale.headers.get('location'),`${origin}/dune-relay/?login=failed`);
});
test('chapter gates block direct attempts until each transition finishes',async()=>{
  const {cookie}=await launch();
  const oasis={...emptyCampaign(),completed:content.levels.slice(0,10).map(level=>level.id),coins:0};
  let profile=(await ok(await call('/campaign/import',cookie,{requestId:randomUUID(),guestSave:oasis}))).profile;
  const caravan='caravanPennants', gatehouse='gatehouseApproach';
  const prepare=levelId=>call('/attempts',cookie,{attemptId:randomUUID(),levelId,boosters:[]});
  const finish=levelId=>call(`/attempts/${randomUUID()}/finish`,cookie,{levelId,remainingMoves:0,contentVersion:content.contentVersion});
  assert.equal((await prepare(caravan)).status,409);
  assert.equal((await finish(caravan)).status,409);
  for(const stage of ['keeper','atlas','arrival','ready']) {
    const campaign={...profile.campaign,oasisTransition:stage};
    profile=(await ok(await call('/campaign/checkpoint',cookie,{requestId:randomUUID(),campaign,expectedRevision:profile.revision}))).profile;
    if(stage!=='ready') assert.equal((await prepare(caravan)).status,409);
  }
  assert.equal((await prepare(caravan)).status,200);
  const {cookie:other}=await launch();
  const caravanSave={...emptyCampaign(),completed:content.levels.slice(0,20).map(level=>level.id),oasisTransition:'ready',coins:0};
  profile=(await ok(await call('/campaign/import',other,{requestId:randomUUID(),guestSave:caravanSave}))).profile;
  assert.equal((await call('/attempts',other,{attemptId:randomUUID(),levelId:gatehouse,boosters:[]})).status,409);
  assert.equal((await call(`/attempts/${randomUUID()}/finish`,other,{levelId:gatehouse,remainingMoves:0,contentVersion:content.contentVersion})).status,409);
  for(const stage of ['handoff','atlas','arrival','ready']) {
    const campaign={...profile.campaign,transition:stage==='ready'?null:{from:'caravan',to:'gatehouse',stage},gatehouseReady:stage==='ready'};
    profile=(await ok(await call('/campaign/checkpoint',other,{requestId:randomUUID(),campaign,expectedRevision:profile.revision}))).profile;
  }
  assert.equal((await call('/attempts',other,{attemptId:randomUUID(),levelId:gatehouse,boosters:[]})).status,200);
});
test('one-time guest import, bounded coins, separate account',async()=>{const {cookie}=await launch();const guest={...emptyCampaign(),completed:['pumpHouse'],coins:80},requestId=randomUUID();const a=await ok(await call('/campaign/import',cookie,{requestId,guestSave:guest}));assert.equal(a.profile.campaign.coins,80);assert.deepEqual(await ok(await call('/campaign/import',cookie,{requestId,guestSave:guest})),a);assert.equal((await call('/campaign/import',cookie,{requestId:randomUUID(),guestSave:guest})).status,409);assert.equal((await call('/campaign/import',cookie,{requestId:randomUUID(),guestSave:{...guest,coins:999999}})).status,400);const other=await launch();assert.equal((await ok(await call('/campaign',other.cookie))).hasCampaign,false);});
test('purchase and win are idempotent',async()=>{const {cookie}=await launch();const guest={...emptyCampaign(),completed:['pumpHouse','primePump','prismTower','oasisRelay'],coins:350};await ok(await call('/campaign/import',cookie,{requestId:randomUUID(),guestSave:guest}));const attemptId=randomUUID();const prepared=await ok(await call('/attempts',cookie,{attemptId,levelId:'palmIntake',boosters:['jet']}));assert.equal(prepared.profile.campaign.coins,350);const active=await ok(await call(`/attempts/${attemptId}/activate`,cookie,{expectedRevision:prepared.profile.revision}));assert.equal(active.profile.campaign.coins,50);assert.equal((await ok(await call(`/attempts/${attemptId}/activate`,cookie,{expectedRevision:prepared.profile.revision}))).profile.campaign.coins,50);const win={levelId:'palmIntake',remainingMoves:3,contentVersion:content.contentVersion};const done=await ok(await call(`/attempts/${attemptId}/finish`,cookie,win));assert.equal(done.reward,29);assert.equal(done.profile.campaign.coins,79);assert.equal((await ok(await call(`/attempts/${attemptId}/finish`,cookie,win))).profile.campaign.coins,79);assert.equal((await call(`/attempts/${attemptId}/finish`,cookie,{...win,remainingMoves:2})).status,409);assert.equal((await call('/attempts',cookie,{attemptId:randomUUID(),levelId:'palmIntake',boosters:[]})).status,409);});
test('free offline finish can sync and cannot skip levels',async()=>{const {cookie}=await launch(),id=randomUUID(),win={levelId:'pumpHouse',remainingMoves:5,contentVersion:content.contentVersion};const first=await ok(await call(`/attempts/${id}/finish`,cookie,win));assert.equal(first.reward,35);assert.equal((await ok(await call(`/attempts/${id}/finish`,cookie,win))).profile.campaign.coins,35);assert.equal((await call('/campaign/checkpoint',cookie,{requestId:randomUUID(),campaign:{...first.profile.campaign,completed:['pumpHouse','primePump']},expectedRevision:first.profile.revision})).status,409);assert.equal((await call(`/attempts/${randomUUID()}/finish`,cookie,{...win,levelId:'palmIntake'})).status,409);});
test('a switched browser cookie cannot write the previous account',async()=>{
  const a=await launch(),b=await launch(),previousAccount=accountByCookie.get(a.cookie);
  const win={levelId:'pumpHouse',remainingMoves:1,contentVersion:content.contentVersion};
  assert.equal((await call('/campaign',b.cookie,undefined,previousAccount)).status,409);
  assert.equal((await call(`/attempts/${randomUUID()}/finish`,b.cookie,win,previousAccount)).status,409);
  assert.equal((await call('/campaign/import',b.cookie,{requestId:randomUUID(),guestSave:{...emptyCampaign(),completed:['pumpHouse'],coins:20}},previousAccount)).status,409);
  assert.equal((await call('/logout',b.cookie,{},previousAccount)).status,409);
  assert.equal((await ok(await call('/campaign',b.cookie))).hasCampaign,false);
});
test('fresh account choice creates a campaign without importing guest coins',async()=>{
  const {cookie}=await launch(),initial=await ok(await call('/campaign',cookie));
  assert.equal(initial.hasCampaign,false);
  const fresh=emptyCampaign(),requestId=randomUUID();
  const started=await ok(await call('/campaign/checkpoint',cookie,{requestId,campaign:fresh,expectedRevision:0}));
  assert.equal(started.profile.revision,1);assert.equal(started.profile.campaign.coins,0);
  assert.deepEqual(await ok(await call('/campaign/checkpoint',cookie,{requestId,campaign:fresh,expectedRevision:0})),started);
  assert.equal((await ok(await call('/campaign',cookie))).hasCampaign,true);
  assert.equal((await call('/campaign/import',cookie,{requestId:randomUUID(),guestSave:{...fresh,completed:['pumpHouse'],coins:20}})).status,409);
});
test('login issuance cleans expired intents and bounds requests per client',async()=>{
  const stale=createHash('sha256').update(randomUUID()).digest('hex');
  await pool.query("INSERT INTO artifact_leaderboards.dune_launch_intents(nonce_hash,expires_at) VALUES($1,now()-interval '1 second')",[stale]);
  const limitedServer=createDuneApp({pool,origin,issuer,launchSecret:secret,secure:false}).listen(0,'127.0.0.1');
  await new Promise(resolve=>limitedServer.once('listening',resolve));
  const loginUrl=`http://127.0.0.1:${limitedServer.address().port}/leaderboard-api/dune-relay/login`;
  try {
    for(let i=0;i<60;i++) assert.equal((await fetch(loginUrl,{redirect:'manual'})).status,302);
    assert.equal((await fetch(loginUrl,{redirect:'manual'})).status,429);
    assert.equal((await pool.query('SELECT 1 FROM artifact_leaderboards.dune_launch_intents WHERE nonce_hash=$1',[stale])).rowCount,0);
  } finally { await new Promise(resolve=>limitedServer.close(resolve)); }
});
