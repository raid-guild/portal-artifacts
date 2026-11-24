import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import pg from 'pg';
import { SignJWT } from 'jose';
import { createHash, randomUUID } from 'node:crypto';
import { createDuneApp } from '../src/dune-app.js';
import { emptyCampaign, content, farmlandEligible, DEMO_LEVEL_COUNT, deriveCampaign, moveCapForVersion, applyCheckpoint, accessTierForCampaign, accessTierForLevel } from '../src/dune-rules.js';
import { chapterRewards } from '../src/dune-rewards.js';
const database=process.env.TEST_DATABASE_URL;
if (!database || !['localhost','127.0.0.1'].includes(new URL(database).hostname) || !new URL(database).pathname.endsWith('_test')) throw new Error('Use local disposable *_test Postgres');
const pool=new pg.Pool({connectionString:database});
const secret='dune-test-secret-with-at-least-32-characters', origin='http://localhost:5173', issuer='https://portal.example.test';
let server,base;
before(async()=>{
  const schema=await readFile(new URL('../schema.sql',import.meta.url),'utf8'); await pool.query(schema);await pool.query(schema);
  await pool.query('TRUNCATE artifact_leaderboards.dune_reward_claims,artifact_leaderboards.dune_entitlements, artifact_leaderboards.dune_launch_intents,artifact_leaderboards.dune_operations,artifact_leaderboards.dune_completions,artifact_leaderboards.dune_attempts,artifact_leaderboards.dune_profiles,artifact_leaderboards.puddle_community_versions,artifact_leaderboards.puddle_community_levels,artifact_leaderboards.raid_profiles,artifact_leaderboards.runs,artifact_leaderboards.sessions,artifact_leaderboards.players,artifact_leaderboards.launches RESTART IDENTITY');
  server=createDuneApp({pool,origin,issuer,launchSecret:secret,secure:false}).listen(0,'127.0.0.1');await new Promise(resolve=>server.once('listening',resolve));base=`http://127.0.0.1:${server.address().port}/leaderboard-api/dune-relay`;
});
after(async()=>{await new Promise(resolve=>server.close(resolve));await pool.end();});
async function token(overrides={}){return new SignJWT({typ:'portal_module_launch',moduleSlug:'dune-relay',handle:'Tester',...overrides}).setProtectedHeader({alg:'HS256'}).setIssuer(issuer).setAudience('dune-relay').setSubject(overrides.sub??`user:${Math.floor(Math.random()*1e8)}`).setJti(randomUUID()).setIssuedAt().setExpirationTime('120s').sign(new TextEncoder().encode(secret));}
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
test('Farmland is an explicit, account-bound entitlement after all 30 canonical levels',async()=>{
  const a=await launch({sub:'user:42424242'}),b=await launch(),accountId=accountByCookie.get(a.cookie),all=content.levels.map(level=>level.id);
  assert.equal(DEMO_LEVEL_COUNT,30);assert.equal(all[DEMO_LEVEL_COUNT-1],'openTheCrossing');
  assert.equal(farmlandEligible({completed:[...all,'future-farmland-level']}),true,'future chapters do not move the demo unlock boundary');
  assert.equal((await call('/entitlements','')).status,401);
  assert.equal((await call('/entitlements',a.cookie,undefined,'999999')).status,409);
  assert.equal((await call('/entitlements/farmland/claim',a.cookie,{requestId:randomUUID()},'999999')).status,409);
  assert.equal((await fetch(base+'/entitlements/farmland/claim',{method:'POST',headers:{Cookie:a.cookie,'X-Dune-Account-ID':accountId,'Content-Type':'application/json'},body:JSON.stringify({requestId:randomUUID()})})).status,403);
  assert.equal((await ok(await call('/entitlements',a.cookie))).farmland.eligible,false);
  assert.equal((await call('/entitlements/farmland/claim',a.cookie,{requestId:randomUUID(),eligible:true,unlocked:true})).status,409);
  const full={...emptyCampaign(),completed:all.slice(0,DEMO_LEVEL_COUNT),coins:0,gatehouseReady:true,oasisTransition:'ready',demoEnding:'done'};
  const imported=await ok(await call('/campaign/import',a.cookie,{requestId:randomUUID(),guestSave:full}));
  assert.deepEqual((await ok(await call('/entitlements',a.cookie))).farmland,{unlocked:false,eligible:true,unlockedAt:null});
  const id=randomUUID();
  const [first,second]=await Promise.all([call('/entitlements/farmland/claim',a.cookie,{requestId:id}),call('/entitlements/farmland/claim',a.cookie,{requestId:randomUUID()})]);
  const grant=await ok(first);assert.deepEqual(await ok(second),grant);
  assert.equal(grant.accountId,accountId);assert.equal(grant.farmland.unlocked,true);assert.ok(grant.farmland.unlockedAt);
  assert.deepEqual(await ok(await call('/entitlements/farmland/claim',a.cookie,{requestId:id})),grant);
  assert.deepEqual(await ok(await call('/entitlements/farmland/claim',a.cookie,{requestId:randomUUID()})),grant);
  assert.equal((await pool.query("SELECT count(*)::int AS n, min(source) AS source FROM artifact_leaderboards.dune_entitlements WHERE player_id=$1",[accountId])).rows[0].n,1);
  assert.deepEqual((await ok(await call('/campaign',a.cookie))).profile,imported.profile,'claim never changes coins, revision or story');
  const entitlementRead=await ok(await call('/entitlements',a.cookie));
  assert.deepEqual({accountId:entitlementRead.accountId,farmland:entitlementRead.farmland},grant,'a fresh read sees the grant');
  assert.equal(entitlementRead.campaignPass.state,'unavailable','an unconfigured store does not affect Farmland');
  const secondSession=await launch({sub:'user:42424242'});
  assert.equal(accountByCookie.get(secondSession.cookie),accountId);
  const secondRead=await ok(await call('/entitlements',secondSession.cookie));
  assert.deepEqual({accountId:secondRead.accountId,farmland:secondRead.farmland},grant,'a second session sees the account grant');
  assert.equal((await ok(await call('/entitlements',b.cookie))).farmland.unlocked,false,'another account cannot see it');
  assert.equal((await call('/entitlements/farmland/claim',b.cookie,{requestId:id})).status,409,'request ID is account scoped but progress is required');
  assert.equal((await call('/campaign/checkpoint',a.cookie,{requestId:id,campaign:imported.profile.campaign,expectedRevision:imported.profile.revision})).status,409,'request IDs cannot cross operation types');
  const checkpoint=await ok(await call('/campaign/checkpoint',a.cookie,{requestId:randomUUID(),campaign:imported.profile.campaign,expectedRevision:imported.profile.revision}));
  assert.equal(checkpoint.profile.revision,imported.profile.revision+1);
  const afterCheckpoint=await ok(await call('/entitlements',a.cookie));
  assert.deepEqual({accountId:afterCheckpoint.accountId,farmland:afterCheckpoint.farmland},grant,'checkpoint leaves entitlement intact');
});
test('native final completion enables a later explicit Farmland claim',async()=>{
  const {cookie}=await launch();
  const before={...emptyCampaign(),completed:content.levels.slice(0,29).map(level=>level.id),coins:0,oasisTransition:'ready',gatehouseReady:true};
  await ok(await call('/campaign/import',cookie,{requestId:randomUUID(),guestSave:before}));
  assert.equal((await ok(await call('/entitlements',cookie))).farmland.eligible,false);
  await ok(await call(`/attempts/${randomUUID()}/finish`,cookie,{levelId:'openTheCrossing',remainingMoves:0,contentVersion:content.contentVersion}));
  assert.deepEqual((await ok(await call('/entitlements',cookie))).farmland,{unlocked:false,eligible:true,unlockedAt:null});
  assert.equal((await ok(await call('/entitlements/farmland/claim',cookie,{requestId:randomUUID()}))).farmland.unlocked,true);
});
test('Farmland requires an account grant and arrival checkpoint for every write path',async()=>{
  const {cookie}=await launch();
  const demo={...emptyCampaign(),completed:content.levels.slice(0,30).map(level=>level.id),coins:100,oasisTransition:'ready',gatehouseReady:true,demoEnding:'thanks'};
  assert.equal((await call('/campaign/import',cookie,{requestId:randomUUID(),guestSave:{...demo,completed:[...demo.completed,'seedStore']}})).status,400,'guest import cannot grant Farmland progress');
  let profile=(await ok(await call('/campaign/import',cookie,{requestId:randomUUID(),guestSave:demo}))).profile;
  const prepare=()=>call('/attempts',cookie,{attemptId:randomUUID(),levelId:'seedStore',boosters:[]});
  const finish=()=>call(`/attempts/${randomUUID()}/finish`,cookie,{levelId:'seedStore',remainingMoves:4,contentVersion:content.contentVersion});
  assert.equal((await prepare()).status,403);
  assert.equal((await finish()).status,403);
  assert.equal((await call('/campaign/checkpoint',cookie,{requestId:randomUUID(),campaign:{...profile.campaign,transition:{from:'gatehouse',to:'farmland',stage:'handoff'}},expectedRevision:profile.revision})).status,400,'demo acknowledgment is required first');
  await ok(await call('/entitlements/farmland/claim',cookie,{requestId:randomUUID()}));
  assert.equal((await call('/campaign/checkpoint',cookie,{requestId:randomUUID(),campaign:{...profile.campaign,demoEnding:'done',transition:{from:'gatehouse',to:'farmland',stage:'handoff'}},expectedRevision:profile.revision})).status,400,'demo acknowledgment must be a separate checkpoint');
  profile=(await ok(await call('/campaign/checkpoint',cookie,{requestId:randomUUID(),campaign:{...profile.campaign,demoEnding:'done'},expectedRevision:profile.revision}))).profile;
  for(const stage of ['handoff','atlas','arrival','ready']) {
    const campaign={...profile.campaign,transition:stage==='ready'?null:{from:'gatehouse',to:'farmland',stage},farmlandReady:stage==='ready',region:stage==='ready'?'farmland':profile.campaign.region};
    profile=(await ok(await call('/campaign/checkpoint',cookie,{requestId:randomUUID(),campaign,expectedRevision:profile.revision}))).profile;
    if(stage!=='ready') assert.equal((await prepare()).status,409,'grant alone does not skip the chapter transition');
  }
  const attemptId=randomUUID();const ready=await ok(await call('/attempts',cookie,{attemptId,levelId:'seedStore',boosters:[]}));
  await ok(await call(`/attempts/${attemptId}/activate`,cookie,{expectedRevision:ready.profile.revision}));
  const route=`/attempts/${attemptId}/finish`;
  assert.equal((await call(route,cookie,{levelId:'seedStore',remainingMoves:28,contentVersion:content.contentVersion})).status,400,'new Farmland cap rejects an old-size finish');
  assert.equal((await call(route,cookie,{levelId:'seedStore',remainingMoves:29,contentVersion:'chapter-4-1'})).status,400,'historical Farmland cap remains bounded');
  assert.equal((await call(route,cookie,{levelId:'seedStore',remainingMoves:28,contentVersion:'chapter-3-3'})).status,400,'Gatehouse content cannot claim Farmland');
  const legacyWin={levelId:'seedStore',remainingMoves:28,contentVersion:'chapter-4-1'};
  const done=await ok(await call(route,cookie,legacyWin));
  assert.equal(done.reward,104,'historical spare moves retain their full reward');
  assert.equal((await ok(await call(route,cookie,legacyWin))).profile.campaign.coins,done.profile.campaign.coins,'legacy finish is idempotent');
  assert.equal(done.profile.campaign.completed.length,31);
  assert.equal(done.profile.campaign.region,'farmland');
});
test('Farmland finale awards once and advances only through film, dialogue, then map',async()=>{
  const {cookie}=await launch();
  const playerId=accountByCookie.get(cookie);
  const completed=content.levels.slice(0,39).map(level=>level.id);
  const campaign=deriveCampaign(completed,120,{...emptyCampaign(),oasisTransition:'ready',gatehouseReady:true,farmlandReady:true,demoEnding:'done',region:'farmland'});
  await pool.query('INSERT INTO artifact_leaderboards.dune_profiles(player_id,profile) VALUES($1,$2)',[playerId,{revision:1,campaign,imported:false}]);
  await pool.query("INSERT INTO artifact_leaderboards.dune_entitlements(player_id,entitlement_key,source) VALUES($1,'farmland','test')",[playerId]);
  const attemptId=randomUUID(), win={levelId:'openTheHarvestRoad',remainingMoves:4,contentVersion:content.contentVersion};
  const first=await ok(await call(`/attempts/${attemptId}/finish`,cookie,win));
  assert.equal(first.reward,32);assert.equal(first.profile.campaign.coins,152);
  assert.equal(first.profile.campaign.farmlandEnding,'film');
  assert.equal((await ok(await call(`/attempts/${attemptId}/finish`,cookie,win))).profile.campaign.coins,152,'repeated finish does not award twice');
  let profile=first.profile;
  const checkpoint=async campaign => call('/campaign/checkpoint',cookie,{requestId:randomUUID(),campaign,expectedRevision:profile.revision});
  assert.equal((await checkpoint({...profile.campaign,farmlandEnding:'done'})).status,400,'cannot skip the film and dialogue checkpoints');
  assert.equal((await checkpoint({...profile.campaign,farmlandEnding:'locked'})).status,400,'cannot regress the ending');
  const oldClient={...profile.campaign};delete oldClient.farmlandEnding;
  profile=(await ok(await checkpoint(oldClient))).profile;
  assert.equal(profile.campaign.farmlandEnding,'film','old client omission keeps the current stage');
  profile=(await ok(await checkpoint({...profile.campaign,farmlandEnding:'thanks'}))).profile;
  assert.equal(profile.campaign.farmlandEnding,'thanks');
  profile=(await ok(await checkpoint({...profile.campaign,farmlandEnding:'done'}))).profile;
  assert.equal(profile.campaign.farmlandEnding,'done');
  assert.equal((await checkpoint({...profile.campaign,farmlandEnding:'film'})).status,400);
});
test('purchase and win are idempotent',async()=>{const {cookie}=await launch();const guest={...emptyCampaign(),completed:['pumpHouse','primePump','prismTower','oasisRelay'],coins:350};await ok(await call('/campaign/import',cookie,{requestId:randomUUID(),guestSave:guest}));const attemptId=randomUUID();const prepared=await ok(await call('/attempts',cookie,{attemptId,levelId:'palmIntake',boosters:['jet']}));assert.equal(prepared.profile.campaign.coins,350);const active=await ok(await call(`/attempts/${attemptId}/activate`,cookie,{expectedRevision:prepared.profile.revision}));assert.equal(active.profile.campaign.coins,50);assert.equal((await ok(await call(`/attempts/${attemptId}/activate`,cookie,{expectedRevision:prepared.profile.revision}))).profile.campaign.coins,50);const win={levelId:'palmIntake',remainingMoves:3,contentVersion:content.contentVersion};const done=await ok(await call(`/attempts/${attemptId}/finish`,cookie,win));assert.equal(done.reward,29);assert.equal(done.profile.campaign.coins,79);assert.equal((await ok(await call(`/attempts/${attemptId}/finish`,cookie,win))).profile.campaign.coins,79);assert.equal((await call(`/attempts/${attemptId}/finish`,cookie,{...win,remainingMoves:2})).status,409);assert.equal((await call('/attempts',cookie,{attemptId:randomUUID(),levelId:'palmIntake',boosters:[]})).status,409);});
test('a prepared Chapter 3 attempt can finish after the Chapter 4 content deploy',async()=>{
  const {cookie}=await launch();
  await ok(await call('/campaign/import',cookie,{requestId:randomUUID(),guestSave:{...emptyCampaign(),completed:content.levels.slice(0,29).map(level=>level.id),oasisTransition:'ready',gatehouseReady:true,coins:0}}));
  const attemptId=randomUUID();
  const prepared=await ok(await call('/attempts',cookie,{attemptId,levelId:'openTheCrossing',boosters:[]}));
  await ok(await call(`/attempts/${attemptId}/activate`,cookie,{expectedRevision:prepared.profile.revision}));
  const finished=await ok(await call(`/attempts/${attemptId}/finish`,cookie,{levelId:'openTheCrossing',remainingMoves:2,contentVersion:'chapter-3-3'}));
  assert.equal(finished.profile.campaign.completed.length,30);
  assert.equal((await call(`/attempts/${randomUUID()}/finish`,cookie,{levelId:'seedStore',remainingMoves:2,contentVersion:'chapter-3-3'})).status,400);
});
test('free offline finish can sync and cannot skip levels',async()=>{const {cookie}=await launch(),id=randomUUID(),win={levelId:'pumpHouse',remainingMoves:5,contentVersion:content.contentVersion};const first=await ok(await call(`/attempts/${id}/finish`,cookie,win));assert.equal(first.reward,35);assert.equal((await ok(await call(`/attempts/${id}/finish`,cookie,win))).profile.campaign.coins,35);assert.equal((await call('/campaign/checkpoint',cookie,{requestId:randomUUID(),campaign:{...first.profile.campaign,completed:['pumpHouse','primePump']},expectedRevision:first.profile.revision})).status,409);assert.equal((await call(`/attempts/${randomUUID()}/finish`,cookie,{...win,levelId:'palmIntake'})).status,409);});
test('legacy Gatehouse finishes and guest balances survive the move-cap reduction',async()=>{
  const {cookie}=await launch();
  const oldCaps=JSON.parse(await readFile(new URL('../src/dune-legacy-moves.json',import.meta.url),'utf8'))['chapter-4-1'];
  const completed=content.levels.slice(0,20).map(level=>level.id);
  const maximum=completed.reduce((sum,id)=>sum+20+3*oldCaps[id],0);
  const guest={...emptyCampaign(),completed,coins:maximum,oasisTransition:'ready',gatehouseReady:true};
  await ok(await call('/campaign/import',cookie,{requestId:randomUUID(),guestSave:guest}));
  const levelId='gatehouseApproach',route=`/attempts/${randomUUID()}/finish`;
  assert.equal(moveCapForVersion(content.levels[20],'chapter-4-1'),30);
  assert.equal((await call(route,cookie,{levelId,remainingMoves:30,contentVersion:content.contentVersion})).status,400);
  assert.equal((await call(route,cookie,{levelId,remainingMoves:31,contentVersion:'chapter-4-1'})).status,400);
  assert.equal((await call(route,cookie,{levelId,remainingMoves:1,contentVersion:'unknown'})).status,400);
  const win={levelId,remainingMoves:30,contentVersion:'chapter-3-3'};
  const first=await ok(await call(route,cookie,win));
  assert.equal(first.reward,110);
  assert.equal(first.profile.campaign.coins,maximum+110);
  assert.equal((await ok(await call(route,cookie,win))).profile.campaign.coins,maximum+110,'legacy finish pays once');
  const secondAccount=await launch();
  const completed21=content.levels.slice(0,21).map(level=>level.id);
  const oldMaximum=completed21.reduce((sum,id)=>sum+20+3*oldCaps[id],0);
  const imported=await ok(await call('/campaign/import',secondAccount.cookie,{requestId:randomUUID(),guestSave:{...guest,completed:completed21,coins:oldMaximum}}));
  assert.equal(imported.profile.campaign.coins,oldMaximum,'historical guest coins are not clamped');
  assert.equal((await call('/campaign/import',(await launch()).cookie,{requestId:randomUUID(),guestSave:{...guest,completed:completed21,coins:oldMaximum+1}})).status,400,'import remains bounded');
});
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
test('Town starts require a Portal-bound pass; an active attempt can finish through a store outage',async()=>{
  const fixture=content.levels[40];
  const {cookie}=await launch({sub:'user:90818091'});
  const accountId=accountByCookie.get(cookie);
  const complete=content.levels.slice(0,40).map(level=>level.id);
  const campaign=deriveCampaign(complete,0,{oasisTransition:'ready',gatehouseReady:true,farmlandReady:true,townReady:true,demoEnding:'done',farmlandEnding:'done',region:'town'});
  await pool.query('INSERT INTO artifact_leaderboards.dune_profiles(player_id,profile) VALUES($1,$2)',[accountId,{revision:1,campaign,imported:false}]);
  await pool.query("INSERT INTO artifact_leaderboards.dune_entitlements(player_id,entitlement_key,source) VALUES($1,'farmland','demo_completion_bonus')",[accountId]);
  let allowed=false;
  const service=createDuneApp({pool,origin,issuer,launchSecret:secret,secure:false,commerce:{check:async identity=>{
    assert.equal(identity.issuer,issuer);assert.equal(identity.subject,'user:90818091');
    return {state:allowed?'active':'unavailable',unlocked:allowed,unlockedAt:null,checkedAt:null,storeUrl:null};
  }}}).listen(0,'127.0.0.1');
  await new Promise(resolve=>service.once('listening',resolve));
  const futureBase=`http://127.0.0.1:${service.address().port}/leaderboard-api/dune-relay`;
  const futureCall=(route,body)=>fetch(futureBase+route,{method:'POST',headers:{Cookie:cookie,'X-Dune-Account-ID':accountId,Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(body)});
  try {
    const attemptId=randomUUID();
    assert.equal((await futureCall('/attempts',{attemptId,levelId:fixture.id,boosters:[]})).status,503);
    assert.equal((await futureCall(`/attempts/${attemptId}/finish`,{levelId:fixture.id,remainingMoves:10,contentVersion:content.contentVersion})).status,403,'no offline synthesis for paid chapters');
    allowed=true;
    assert.equal((await futureCall('/attempts',{attemptId,levelId:fixture.id,boosters:[]})).status,200);
    allowed=false;
    assert.equal((await futureCall(`/attempts/${attemptId}/activate`,{expectedRevision:1})).status,503,'prepared attempt must recheck access');
    allowed=true;
    assert.equal((await futureCall(`/attempts/${attemptId}/activate`,{expectedRevision:1})).status,200);
    allowed=false;
    const finish=await ok(await futureCall(`/attempts/${attemptId}/finish`,{levelId:fixture.id,remainingMoves:10,contentVersion:content.contentVersion}));
    assert.equal(finish.profile.campaign.completed.at(-1),fixture.id);
    assert.equal((await futureCall(`/attempts/${randomUUID()}/finish`,{levelId:fixture.id,remainingMoves:10,contentVersion:content.contentVersion})).status,403);
  } finally { await new Promise(resolve=>service.close(resolve)); }
});
test('Town checkpoints require the finished Farmland ending and a stepwise arrival; old clients preserve Town fields',()=>{
  const completed=content.levels.slice(0,40).map(level=>level.id);
  let profile={revision:1,campaign:deriveCampaign(completed,200,{oasisTransition:'ready',gatehouseReady:true,farmlandReady:true,demoEnding:'done',farmlandEnding:'done',region:'farmland'})};
  assert.equal(accessTierForLevel({ ...content.levels[40],index:40 }),'campaign-pass');
  assert.equal(accessTierForCampaign(profile.campaign),'farmland');
  const step=campaign=>{ profile=applyCheckpoint(profile,campaign); return profile.campaign; };
  assert.throws(()=>step({...profile.campaign,townReady:true}),{status:400});
  assert.throws(()=>step({...profile.campaign,transition:{from:'farmland',to:'town',stage:'arrival'}}),{status:400});
  let next=step({...profile.campaign,transition:{from:'farmland',to:'town',stage:'handoff'}});
  assert.equal(accessTierForCampaign(next),'campaign-pass');
  next=step({...next,transition:{...next.transition,stage:'atlas'}});
  next=step({...next,transition:{...next.transition,stage:'arrival'}});
  next=step({...next,townReady:true,region:'town',transition:null});
  assert.equal(next.region,'town');assert.ok(next.companions.includes('towncrier'));
  const oldClient={...next};delete oldClient.townReady;delete oldClient.townEnding;
  next=step(oldClient);
  assert.equal(next.townReady,true,'old client omission retains arrived Town');
  assert.equal(next.townEnding,'locked');
});

test('Castle attempts freeze the selected ability, including a zero-booster retry',async()=>{
  const {cookie}=await launch({sub:'user:90818163'});
  const accountId=accountByCookie.get(cookie);
  const completed=content.levels.slice(0,50).map(level=>level.id);
  const campaign=deriveCampaign(completed,800,{oasisTransition:'ready',gatehouseReady:true,farmlandReady:true,townReady:true,castleReady:true,demoEnding:'done',farmlandEnding:'done',townEnding:'done',region:'castle',activeCompanion:'fieldkeeper'});
  assert.equal(campaign.activeCompanion,'fieldkeeper');
  await pool.query('INSERT INTO artifact_leaderboards.dune_profiles(player_id,profile) VALUES($1,$2)',[accountId,{revision:1,campaign,imported:false}]);
  await pool.query("INSERT INTO artifact_leaderboards.dune_entitlements(player_id,entitlement_key,source) VALUES($1,'farmland','demo_completion_bonus')",[accountId]);
  let allowed=false;
  const service=createDuneApp({pool,origin,issuer,launchSecret:secret,secure:false,commerce:{check:async()=>({state:allowed?'active':'unavailable',unlocked:allowed,unlockedAt:null,checkedAt:null,storeUrl:null})}}).listen(0,'127.0.0.1');
  await new Promise(resolve=>service.once('listening',resolve));
  const localBase=`http://127.0.0.1:${service.address().port}/leaderboard-api/dune-relay`;
  const post=(path,body)=>fetch(localBase+path,{method:'POST',headers:{Cookie:cookie,'X-Dune-Account-ID':accountId,Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(body)});
  const levelId=content.levels[50].id,attemptId=randomUUID();
  try {
    assert.equal((await post('/attempts',{attemptId,levelId,boosters:[],companionId:'fieldkeeper'})).status,503,'a paid chapter has no free fallback');
    allowed=true;
    assert.equal((await post('/attempts',{attemptId,levelId,boosters:[],companionId:'keeper'})).status,409,'selection must match the saved profile');
    const prepared=await ok(await post('/attempts',{attemptId,levelId,boosters:[],companionId:'fieldkeeper'}));
    assert.deepEqual(prepared.companionSnapshot,{id:'fieldkeeper',chargeSymbol:'leaf',keeperTarget:12,grantedPower:'flywheels',grantCount:2});
    const retry=await ok(await post('/attempts',{attemptId,levelId,boosters:[],companionId:'fieldkeeper'}));
    assert.deepEqual(retry.companionSnapshot,prepared.companionSnapshot,'zero-booster prepare survives a retry');
    assert.equal((await post('/attempts',{attemptId,levelId,boosters:[],companionId:'towncrier'})).status,409,'idempotency cannot switch the ability');
    const activated=await ok(await post(`/attempts/${attemptId}/activate`,{expectedRevision:1}));
    assert.deepEqual(activated.companionSnapshot,prepared.companionSnapshot);
    allowed=false;
    const finished=await ok(await post(`/attempts/${attemptId}/finish`,{levelId,remainingMoves:10,contentVersion:content.contentVersion}));
    assert.equal(finished.profile.campaign.completed.at(-1),levelId,'an active Castle attempt finishes through a store outage');
    assert.equal((await post(`/attempts/${randomUUID()}/finish`,{levelId:content.levels[51].id,remainingMoves:10,contentVersion:content.contentVersion})).status,403);
  } finally { await new Promise(resolve=>service.close(resolve)); }
});
test('River requires the Dune Pass and preserves the selected companion on a zero-cost attempt',async()=>{
  const {cookie}=await launch({sub:'user:90818164'});
  const accountId=accountByCookie.get(cookie);
  const completed=content.levels.slice(0,60).map(level=>level.id);
  const campaign=deriveCampaign(completed,800,{oasisTransition:'ready',gatehouseReady:true,farmlandReady:true,townReady:true,castleReady:true,riverReady:true,demoEnding:'done',farmlandEnding:'done',townEnding:'done',castleEnding:'done',region:'river',activeCompanion:'fieldkeeper'});
  await pool.query('INSERT INTO artifact_leaderboards.dune_profiles(player_id,profile) VALUES($1,$2)',[accountId,{revision:1,campaign,imported:false}]);
  await pool.query("INSERT INTO artifact_leaderboards.dune_entitlements(player_id,entitlement_key,source) VALUES($1,'farmland','demo_completion_bonus')",[accountId]);
  let allowed=false;
  const service=createDuneApp({pool,origin,issuer,launchSecret:secret,secure:false,commerce:{check:async()=>({state:allowed?'active':'unavailable',unlocked:allowed,unlockedAt:null,checkedAt:null,storeUrl:null})}}).listen(0,'127.0.0.1');
  await new Promise(resolve=>service.once('listening',resolve));
  const localBase=`http://127.0.0.1:${service.address().port}/leaderboard-api/dune-relay`;
  const post=(path,body)=>fetch(localBase+path,{method:'POST',headers:{Cookie:cookie,'X-Dune-Account-ID':accountId,Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(body)});
  const levelId=content.levels[60].id,attemptId=randomUUID();
  try {
    assert.equal((await post('/attempts',{attemptId,levelId,boosters:[],companionId:'fieldkeeper'})).status,503);
    assert.equal((await post(`/attempts/${attemptId}/finish`,{levelId,remainingMoves:3,contentVersion:content.contentVersion})).status,403);
    allowed=true;
    assert.equal((await post('/attempts',{attemptId,levelId,boosters:[],companionId:'keeper'})).status,409);
    const prepared=await ok(await post('/attempts',{attemptId,levelId,boosters:[],companionId:'fieldkeeper'}));
    assert.equal(prepared.companionSnapshot.id,'fieldkeeper');
    assert.deepEqual((await ok(await post('/attempts',{attemptId,levelId,boosters:[],companionId:'fieldkeeper'}))).companionSnapshot,prepared.companionSnapshot);
    assert.equal((await post('/attempts',{attemptId,levelId,boosters:[],companionId:'towncrier'})).status,409);
    allowed=false;
    assert.equal((await post(`/attempts/${attemptId}/activate`,{expectedRevision:1})).status,503);
    allowed=true;
    const activated=await ok(await post(`/attempts/${attemptId}/activate`,{expectedRevision:1}));
    assert.deepEqual(activated.companionSnapshot,prepared.companionSnapshot);
    allowed=false;
    const finished=await ok(await post(`/attempts/${attemptId}/finish`,{levelId,remainingMoves:3,contentVersion:content.contentVersion}));
    assert.equal(finished.profile.campaign.completed.length,61);
    assert.equal(finished.profile.campaign.region,'river');
    assert.equal((await post(`/attempts/${randomUUID()}/finish`,{levelId:content.levels[61].id,remainingMoves:3,contentVersion:content.contentVersion})).status,403);
  } finally { await new Promise(resolve=>service.close(resolve)); }
});
test('Castle arrival and leader selection are stepwise; older checkpoints retain Castle state',()=>{
  const completed=content.levels.slice(0,50).map(level=>level.id);
  let profile={revision:1,campaign:deriveCampaign(completed,230,{oasisTransition:'ready',gatehouseReady:true,farmlandReady:true,townReady:true,demoEnding:'done',farmlandEnding:'done',townEnding:'thanks',region:'town'})};
  const step=campaign=>{profile=applyCheckpoint(profile,campaign);return profile.campaign;};
  assert.equal(accessTierForLevel({...content.levels[50],index:50}),'campaign-pass');
  assert.throws(()=>step({...profile.campaign,castleReady:true}),{status:400});
  assert.throws(()=>step({...profile.campaign,transition:{from:'town',to:'castle',stage:'handoff'}}),{status:400});
  let next=step({...profile.campaign,townEnding:'done'});
  next=step({...next,transition:{from:'town',to:'castle',stage:'handoff'}});
  next=step({...next,transition:{...next.transition,stage:'atlas'}});
  next=step({...next,transition:{...next.transition,stage:'arrival'}});
  next=step({...next,castleReady:true,region:'castle',transition:null});
  assert.equal(next.activeCompanion,null);
  assert.throws(()=>step({...next,activeCompanion:'quartermaster'}),{status:400});
  next=step({...next,activeCompanion:'wayfinder'});
  assert.equal(next.activeCompanion,'wayfinder');
  const oldClient={...next};delete oldClient.castleReady;delete oldClient.activeCompanion;delete oldClient.castleEnding;
  next=step(oldClient);
  assert.equal(next.castleReady,true);
  assert.equal(next.activeCompanion,'wayfinder');
  assert.equal(next.castleEnding,'locked');
});

test('Field Toolkit catches up, and tool stock spends once through account-scoped receipts',async()=>{
  const {cookie}=await launch();const playerId=accountByCookie.get(cookie);
  const completed=content.levels.slice(0,30).map(level=>level.id);
  const campaign=deriveCampaign(completed,1800,{...emptyCampaign(),oasisTransition:'ready',gatehouseReady:true,farmlandReady:true,demoEnding:'done',region:'farmland'});
  await pool.query('INSERT INTO artifact_leaderboards.dune_profiles(player_id,profile) VALUES($1,$2)',[playerId,{revision:5,campaign,imported:true}]);
  await pool.query("INSERT INTO artifact_leaderboards.dune_entitlements(player_id,entitlement_key,source) VALUES($1,'farmland','test')",[playerId]);
  const claimId=randomUUID();
  const [a,b]=await Promise.all([call('/inventory/field-toolkit',cookie,{requestId:claimId}),call('/inventory/field-toolkit',cookie,{requestId:randomUUID()})]);
  const gift=await ok(a),duplicate=await ok(b);
  assert.equal(gift.granted,true);assert.equal(duplicate.granted,false);
  assert.equal((await ok(await call('/inventory/field-toolkit',cookie,{requestId:claimId}))).granted,true,'same receipt returns first outcome');
  assert.equal(gift.profile.inventory.tileBomb,1);assert.equal(duplicate.profile.inventory.tileBomb,1);
  const attemptId=randomUUID();
  const prepared=await ok(await call('/attempts',cookie,{attemptId,levelId:'seedStore',boosters:['jet']}));
  const quote=(await pool.query('SELECT booster_funding FROM artifact_leaderboards.dune_attempts WHERE id=$1',[attemptId])).rows[0].booster_funding;
  assert.deepEqual(quote,{owned:[],purchased:['jet'],coinCost:300});
  let profile=(await ok(await call(`/attempts/${attemptId}/activate`,cookie,{expectedRevision:prepared.profile.revision}))).profile;
  assert.equal(profile.campaign.coins,1500);
  const buyId=randomUUID();const buyBody={requestId:buyId,kind:'tileBomb',expectedRevision:profile.revision,attemptId};
  const bought=await ok(await call('/inventory/purchase',cookie,buyBody));
  profile=bought.profile;assert.equal(profile.campaign.coins,900);assert.equal(profile.inventory.tileBomb,2);
  assert.deepEqual(await ok(await call('/inventory/purchase',cookie,buyBody)),bought);
  assert.equal((await call('/inventory/purchase',cookie,{...buyBody,kind:'freeSwap'})).status,409);
  assert.equal((await call('/inventory/purchase',cookie,{...buyBody,requestId:randomUUID()})).status,409,'stale revision cannot buy');
  const toolId=randomUUID(),body={requestId:toolId,kind:'tileBomb',expectedRevision:profile.revision,toolSequence:1,stateFingerprint:'a'.repeat(64),movesRemaining:20};
  assert.equal((await call(`/attempts/${attemptId}/tools`,cookie,{...body,movesRemaining:0})).status,400);
  const used=await ok(await call(`/attempts/${attemptId}/tools`,cookie,body));
  assert.equal(used.profile.inventory.tileBomb,1);
  assert.deepEqual(await ok(await call(`/attempts/${attemptId}/tools`,cookie,body)),used);
  assert.equal((await call(`/attempts/${attemptId}/tools`,cookie,{...body,stateFingerprint:'b'.repeat(64)})).status,409);
  assert.equal((await call(`/attempts/${attemptId}/tools`,cookie,{...body,requestId:randomUUID()})).status,409,'sequence must advance');
  const concurrent=await Promise.all([randomUUID(),randomUUID()].map(requestId=>call(`/attempts/${attemptId}/tools`,cookie,{requestId,kind:'freeSwap',expectedRevision:used.profile.revision,toolSequence:2,stateFingerprint:'c'.repeat(64),movesRemaining:19})));
  assert.deepEqual(concurrent.map(result=>result.status).sort(),[200,409],'concurrent tabs cannot both spend one copy');
  const after=(await ok(await call('/campaign',cookie))).profile;
  assert.equal(after.inventory.tileBomb,1);assert.ok(after.rewardClaims.fieldToolkitV1);
  const checkpoint=await ok(await call('/campaign/checkpoint',cookie,{requestId:randomUUID(),campaign:after.campaign,expectedRevision:after.revision}));
  assert.equal(checkpoint.profile.inventory.tileBomb,1,'story checkpoint retains inventory');
  assert.equal(checkpoint.profile.inventory.freeSwap,0,'concurrent use spent exactly one free swap');
  const stocked={...checkpoint.profile,inventory:{...checkpoint.profile.inventory,jet:1}};
  await pool.query('UPDATE artifact_leaderboards.dune_profiles SET profile=$2 WHERE player_id=$1',[playerId,stocked]);
  const ownedAttempt=randomUUID();
  const ownedPrepared=await ok(await call('/attempts',cookie,{attemptId:ownedAttempt,levelId:'seedStore',boosters:['jet']}));
  assert.deepEqual((await pool.query('SELECT booster_funding FROM artifact_leaderboards.dune_attempts WHERE id=$1',[ownedAttempt])).rows[0].booster_funding,{owned:['jet'],purchased:[],coinCost:0});
  const ownedActivated=await ok(await call(`/attempts/${ownedAttempt}/activate`,cookie,{expectedRevision:ownedPrepared.profile.revision}));
  assert.equal(ownedActivated.profile.inventory.jet,0);
  assert.equal(ownedActivated.profile.campaign.coins,checkpoint.profile.campaign.coins,'owned-only loadout costs no coins');
  assert.deepEqual(await ok(await call(`/attempts/${ownedAttempt}/activate`,cookie,{expectedRevision:ownedPrepared.profile.revision})),ownedActivated,'activation retry does not consume twice');
  const staleStock={...ownedActivated.profile,inventory:{...ownedActivated.profile.inventory,jet:1}};
  await pool.query('UPDATE artifact_leaderboards.dune_profiles SET profile=$2 WHERE player_id=$1',[playerId,staleStock]);
  const reservedId=randomUUID();await ok(await call('/attempts',cookie,{attemptId:reservedId,levelId:'seedStore',boosters:['jet']}));
  await pool.query("UPDATE artifact_leaderboards.dune_profiles SET profile=jsonb_set(profile,'{inventory,jet}','0'::jsonb) WHERE player_id=$1",[playerId]);
  assert.equal((await call(`/attempts/${reservedId}/activate`,cookie,{expectedRevision:staleStock.revision})).status,409,'lost reservation never becomes a coin purchase');
  const legacyId=randomUUID();
  await pool.query("INSERT INTO artifact_leaderboards.dune_attempts(id,player_id,level_id,boosters,status) VALUES($1,$2,'seedStore',$3,'prepared')",[legacyId,playerId,JSON.stringify(['prism'])]);
  const legacyActivated=await ok(await call(`/attempts/${legacyId}/activate`,cookie,{expectedRevision:ownedActivated.profile.revision}));
  assert.equal(legacyActivated.profile.campaign.coins,ownedActivated.profile.campaign.coins-500,'legacy attempt without funding retains coin price');
  const {cookie:other}=await launch();
  assert.equal((await call(`/attempts/${attemptId}/tools`,other,{...body,requestId:randomUUID(),expectedRevision:0,toolSequence:2})).status,409);
  const old=await launch();const oldId=accountByCookie.get(old.cookie);
  const oldCampaign=deriveCampaign(content.levels.slice(0,40).map(level=>level.id),400,{...emptyCampaign(),oasisTransition:'ready',gatehouseReady:true,farmlandReady:true,demoEnding:'done',farmlandEnding:'done',townReady:true,region:'town'});
  await pool.query('INSERT INTO artifact_leaderboards.dune_profiles(player_id,profile) VALUES($1,$2)',[oldId,{revision:9,campaign:oldCampaign,imported:true}]);
  await pool.query("INSERT INTO artifact_leaderboards.dune_entitlements(player_id,entitlement_key,source) VALUES($1,'farmland','test')",[oldId]);
  assert.equal((await ok(await call('/inventory/field-toolkit',old.cookie,{requestId:randomUUID()}))).profile.inventory.freeSwap,1,'finished Farmland campaign catches up');
});

test('guest import cannot inject inventory or toolkit claims',async()=>{
  const {cookie}=await launch();
  const guest={...emptyCampaign(),completed:['pumpHouse'],coins:20,inventory:{tileBomb:999,freeSwap:999,jet:999},rewardClaims:{fieldToolkitV1:new Date().toISOString()}};
  const profile=(await ok(await call('/campaign/import',cookie,{requestId:randomUUID(),guestSave:guest}))).profile;
  assert.deepEqual(profile.inventory,{tileBomb:0,freeSwap:0,jet:0,flywheel:0,prism:0});
  assert.deepEqual(profile.rewardClaims,{});
});

test('daily rewards are UTC-bound, account-bound, durable, and presented once',async()=>{
  let time='2026-11-24T23:59:58.000Z';
  const service=createDuneApp({pool,origin,issuer,launchSecret:secret,secure:false,clock:()=>new Date(time)}).listen(0,'127.0.0.1');
  await new Promise(resolve=>service.once('listening',resolve));
  const url=`http://127.0.0.1:${service.address().port}/leaderboard-api/dune-relay`;
  const at=(route,cookie,body,accountId=accountByCookie.get(cookie))=>fetch(url+route,{method:body?'POST':'GET',headers:{Cookie:cookie,'X-Dune-Account-ID':accountId,...(body?{Origin:origin,'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
  try{
    const {cookie}=await launch(),other=await launch(),accountId=accountByCookie.get(cookie);
    assert.equal((await at('/rewards','')).status,401);
    assert.equal((await at('/rewards',cookie,undefined,'999999')).status,409);
    const offered=await ok(await at('/rewards',cookie));
    assert.equal(offered.serverDay,'2026-11-24');assert.equal(offered.nextResetAt,'2026-11-25T00:00:00.000Z');
    assert.equal(offered.rewards.find(reward=>reward.key==='daily:2026-11-24').status,'available');
    assert.equal(offered.rewards.find(reward=>reward.key==='chapter:oasis').status,'locked');
    const requestId=randomUUID(),body={requestId,rewardKey:'daily:2026-11-24',coins:999999,item:'prism'};
    const [first,parallel]=await Promise.all([at('/rewards/claim',cookie,body),at('/rewards/claim',cookie,{requestId:randomUUID(),rewardKey:body.rewardKey})]);
    const a=await ok(first),b=await ok(parallel);
    assert.equal(a.award.payload.coins,100);assert.equal(a.award.version,2);
    assert.equal(a.award.key,b.award.key);assert.equal(a.profile.campaign.coins,100);assert.equal(b.profile.campaign.coins,100);
    assert.equal((await ok(await at('/rewards/claim',cookie,body))).profile.campaign.coins,100);
    assert.equal((await at('/rewards/claim',cookie,{...body,rewardKey:'chapter:oasis'})).status,409);
    assert.equal((await at('/rewards/claim',other.cookie,{requestId:randomUUID(),rewardKey:body.rewardKey},accountId)).status,409);
    const unpresented=await ok(await at('/rewards',cookie));
    assert.equal(unpresented.unpresented.length,1);
    const revision=a.profile.revision;
    const shown=await ok(await at('/rewards/presented',cookie,{rewardKey:body.rewardKey}));
    assert.ok(shown.award.presentedAt);
    assert.equal((await ok(await at('/rewards/presented',cookie,{rewardKey:body.rewardKey}))).award.presentedAt,shown.award.presentedAt);
    assert.equal((await ok(await call('/campaign',cookie))).profile.revision,revision,'presentation changes no balance or revision');
    assert.equal((await at('/rewards/presented',other.cookie,{rewardKey:body.rewardKey})).status,404);
    time='2026-11-25T00:00:00.000Z';
    const next=await ok(await at('/rewards',cookie));assert.equal(next.serverDay,'2026-11-25');assert.equal(next.rewards.find(reward=>reward.key==='daily:2026-11-25').status,'available');
    assert.equal((await ok(await at('/rewards/claim',cookie,{requestId, rewardKey:body.rewardKey}))).profile.campaign.coins,100,'old receipt returns current profile');
    assert.equal((await ok(await at('/rewards/claim',cookie,{requestId:randomUUID(),rewardKey:body.rewardKey}))).profile.campaign.coins,100,'different request recovers claimed old day');
    assert.equal((await at('/rewards/claim',other.cookie,{requestId:randomUUID(),rewardKey:body.rewardKey})).status,409,'unclaimed prior day expires');
    assert.equal((await ok(await at('/rewards/claim',cookie,{requestId:randomUUID(),rewardKey:'daily:2026-11-25'}))).profile.campaign.coins,300);
    const capped=await launch();
    await pool.query('INSERT INTO artifact_leaderboards.dune_profiles(player_id,profile) VALUES($1,$2)',[accountByCookie.get(capped.cookie),{revision:0,campaign:{...emptyCampaign(),coins:999950},imported:false}]);
    assert.equal((await at('/rewards/claim',capped.cookie,{requestId:randomUUID(),rewardKey:'daily:2026-11-25'})).status,409);
    assert.equal((await pool.query('SELECT count(*)::int AS n FROM artifact_leaderboards.dune_reward_claims WHERE player_id=$1',[accountByCookie.get(capped.cookie)])).rows[0].n,0,'capacity rejection writes no claim');
  }finally{await new Promise(resolve=>service.close(resolve));}
});

test('five-day visits advance without claiming, freeze day-three draws, and wrap after day five',async()=>{
  let time='2026-12-01T08:00:00.000Z',draws=0;
  const service=createDuneApp({pool,origin,issuer,launchSecret:secret,secure:false,clock:()=>new Date(time),selectRandomReward:pool=>pool[draws++%2]}).listen(0,'127.0.0.1');
  await new Promise(resolve=>service.once('listening',resolve));
  const url=`http://127.0.0.1:${service.address().port}/leaderboard-api/dune-relay`;
  const at=(route,cookie,body)=>fetch(url+route,{method:body?'POST':'GET',headers:{Cookie:cookie,'X-Dune-Account-ID':accountByCookie.get(cookie),...(body?{Origin:origin,'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
  try{
    const {cookie}=await launch();
    const expected=[100,200,0,500,1000,100];
    for(let index=0;index<6;index++){
      const day=`2026-12-0${index+1}`;time=`${day}T08:00:00.000Z`;
      const before=(await ok(await at('/campaign',cookie))).profile?.revision??0;
      const visit=index===2
        ?(await Promise.all([at('/rewards/visit',cookie,{}),at('/rewards/visit',cookie,{})].map(async request=>ok(await request))))[0]
        :await ok(await at('/rewards/visit',cookie,{}));
      assert.equal(visit.dailyVisit.cycleDay,index%5+1);
      assert.equal(visit.dailyVisit.payload.coins,expected[index]);
      assert.equal((await ok(await at('/campaign',cookie))).profile.revision,before,'visit never changes economic revision');
      assert.deepEqual((await ok(await at('/rewards/visit',cookie,{}))).dailyVisit,visit.dailyVisit,'same-day visit retains payload');
      assert.equal((await ok(await at('/rewards',cookie))).rewards[0].payload.coins,expected[index]);
      if(index===2){
        assert.deepEqual(visit.dailyVisit.payload.items,[{item:'jet',quantity:1},{item:'flywheel',quantity:1}]);
        assert.equal(draws,2,'GET and repeat visits do not reroll');
      }
      if(index!==1){
        const claimed=await ok(await at('/rewards/claim',cookie,{requestId:randomUUID(),rewardKey:`daily:${day}`}));
        assert.deepEqual(claimed.award.payload,visit.dailyVisit.payload);
      }
    }
    const profile=(await ok(await at('/campaign',cookie))).profile;
    assert.equal(profile.campaign.coins,1700,'day 2 visit advanced the streak without granting an unclaimed gift');
    assert.equal(profile.inventory.jet,1);assert.equal(profile.inventory.flywheel,1);
    assert.equal(draws,2);
  }finally{await new Promise(resolve=>service.close(resolve));}
});

test('missed visits reset, legacy rows seed streaks, and item draws stay frozen across capacity failure',async()=>{
  let time='2026-12-10T12:00:00.000Z',draws=0;
  const service=createDuneApp({pool,origin,issuer,launchSecret:secret,secure:false,clock:()=>new Date(time),selectRandomReward:pool=>{draws++;return pool[0];}}).listen(0,'127.0.0.1');
  await new Promise(resolve=>service.once('listening',resolve));
  const url=`http://127.0.0.1:${service.address().port}/leaderboard-api/dune-relay`;
  const at=(route,cookie,body)=>fetch(url+route,{method:body?'POST':'GET',headers:{Cookie:cookie,'X-Dune-Account-ID':accountByCookie.get(cookie),...(body?{Origin:origin,'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
  try{
    const missed=await launch();
    await ok(await at('/rewards/visit',missed.cookie,{}));
    time='2026-12-12T12:00:00.000Z';
    assert.equal((await ok(await at('/rewards/visit',missed.cookie,{}))).dailyVisit.cycleDay,1,'missing the 11th resets');
    const oldYesterday=await launch(),yesterdayId=accountByCookie.get(oldYesterday.cookie);
    await pool.query('INSERT INTO artifact_leaderboards.dune_profiles(player_id,profile) VALUES($1,$2)',[yesterdayId,{revision:1,campaign:{...emptyCampaign(),coins:100}}]);
    await pool.query("INSERT INTO artifact_leaderboards.dune_reward_claims(player_id,reward_key,reward_version,reward_payload) VALUES($1,'daily:2026-12-11',1,$2)",[yesterdayId,{coins:100,item:null,quantity:0}]);
    assert.equal((await ok(await at('/rewards/visit',oldYesterday.cookie,{}))).dailyVisit.cycleDay,2);
    const oldToday=await launch(),todayId=accountByCookie.get(oldToday.cookie);
    await pool.query('INSERT INTO artifact_leaderboards.dune_profiles(player_id,profile) VALUES($1,$2)',[todayId,{revision:1,campaign:{...emptyCampaign(),coins:100}}]);
    await pool.query("INSERT INTO artifact_leaderboards.dune_reward_claims(player_id,reward_key,reward_version,reward_payload) VALUES($1,'daily:2026-12-12',1,$2)",[todayId,{coins:100,item:null,quantity:0}]);
    const legacy=await ok(await at('/rewards/visit',oldToday.cookie,{}));
    assert.equal(legacy.dailyVisit.cycleDay,1);assert.equal(legacy.dailyVisit.version,1);assert.equal(legacy.dailyVisit.payload.coins,100);
    const capped=await launch(),cappedId=accountByCookie.get(capped.cookie);
    await pool.query('INSERT INTO artifact_leaderboards.dune_profiles(player_id,profile) VALUES($1,$2)',[cappedId,{revision:0,campaign:emptyCampaign(),inventory:{jet:999999}}]);
    await ok(await at('/rewards/visit',capped.cookie,{}));
    time='2026-12-13T12:00:00.000Z';await ok(await at('/rewards/visit',capped.cookie,{}));
    time='2026-12-14T12:00:00.000Z';
    const reserved=await ok(await at('/rewards/visit',capped.cookie,{}));
    assert.deepEqual(reserved.dailyVisit.payload.items,[{item:'jet',quantity:2}]);
    const drawsBefore=draws;
    assert.equal((await at('/rewards/claim',capped.cookie,{requestId:randomUUID(),rewardKey:'daily:2026-12-14'})).status,409);
    assert.equal((await at('/rewards/claim',capped.cookie,{requestId:randomUUID(),rewardKey:'daily:2026-12-14'})).status,409);
    assert.equal(draws,drawsBefore,'failed capacity checks keep the first draw');
    assert.deepEqual((await ok(await at('/rewards/visit',capped.cookie,{}))).dailyVisit.payload,reserved.dailyVisit.payload);
    assert.equal((await pool.query('SELECT count(*)::int AS n FROM artifact_leaderboards.dune_reward_claims WHERE player_id=$1',[cappedId])).rows[0].n,0);
  }finally{await new Promise(resolve=>service.close(resolve));}
});

test('Farmland expands the reserved item pool and mixed daily ledger grants remain importable',async()=>{
  let time='2026-12-20T10:00:00.000Z',draw=0;
  const service=createDuneApp({pool,origin,issuer,launchSecret:secret,secure:false,clock:()=>new Date(time),selectRandomReward:pool=>pool[3+(draw++%2)]}).listen(0,'127.0.0.1');
  await new Promise(resolve=>service.once('listening',resolve));
  const url=`http://127.0.0.1:${service.address().port}/leaderboard-api/dune-relay`;
  const at=(route,cookie,body)=>fetch(url+route,{method:body?'POST':'GET',headers:{Cookie:cookie,'X-Dune-Account-ID':accountByCookie.get(cookie),...(body?{Origin:origin,'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
  try{
    const farmer=await launch(),farmerId=accountByCookie.get(farmer.cookie);
    const farm=deriveCampaign(content.levels.slice(0,40).map(level=>level.id),0,{...emptyCampaign(),oasisTransition:'ready',gatehouseReady:true,farmlandReady:true});
    await pool.query('INSERT INTO artifact_leaderboards.dune_profiles(player_id,profile) VALUES($1,$2)',[farmerId,{revision:8,campaign:farm,imported:true}]);
    await ok(await at('/rewards/visit',farmer.cookie,{}));
    time='2026-12-21T10:00:00.000Z';await ok(await at('/rewards/visit',farmer.cookie,{}));
    time='2026-12-22T10:00:00.000Z';
    const visit=await ok(await at('/rewards/visit',farmer.cookie,{}));
    assert.deepEqual(visit.dailyVisit.payload.items,[{item:'tileBomb',quantity:1},{item:'freeSwap',quantity:1}]);
    assert.equal(draw,2);
    const claim=await ok(await at('/rewards/claim',farmer.cookie,{requestId:randomUUID(),rewardKey:'daily:2026-12-22'}));
    assert.equal(claim.profile.inventory.tileBomb,1);assert.equal(claim.profile.inventory.freeSwap,1);
    assert.equal(claim.profile.campaign.coins,0);
    const newcomer=await launch(),id=accountByCookie.get(newcomer.cookie);
    const payload={coins:0,item:null,quantity:0,items:[{item:'jet',quantity:1},{item:'prism',quantity:1}]};
    await pool.query('INSERT INTO artifact_leaderboards.dune_profiles(player_id,profile) VALUES($1,$2)',[id,{revision:1,campaign:emptyCampaign(),inventory:{jet:1,prism:1},dailyVisit:{day:'2026-12-22',cycleDay:3,version:2,payload}}]);
    await pool.query("INSERT INTO artifact_leaderboards.dune_reward_claims(player_id,reward_key,reward_version,reward_payload) VALUES($1,'daily:2026-12-22',2,$2)",[id,payload]);
    assert.equal((await ok(await at('/campaign',newcomer.cookie))).canImportGuest,true);
    const guest={...emptyCampaign(),completed:['pumpHouse'],coins:20,dailyVisit:{day:'2099-01-01',cycleDay:5,version:2,payload:{coins:1000,item:null,quantity:0}}};
    const imported=await ok(await at('/campaign/import',newcomer.cookie,{requestId:randomUUID(),guestSave:guest}));
    assert.equal(imported.profile.campaign.coins,20);assert.equal(imported.profile.inventory.jet,1);assert.equal(imported.profile.inventory.prism,1);
    assert.equal(imported.profile.dailyVisit.day,'2026-12-22','guest metadata cannot replace the server visit');
  }finally{await new Promise(resolve=>service.close(resolve));}
});

test('chapter reward catalog honors canonical completion and catches up imported chapters',async()=>{
  assert.deepEqual(chapterRewards.map(item=>item.completedCount),[10,20,30,40,50,60,70]);
  const {cookie}=await launch(),playerId=accountByCookie.get(cookie);
  const demo={...emptyCampaign(),completed:content.levels.slice(0,30).map(level=>level.id),coins:0,oasisTransition:'ready',gatehouseReady:true,demoEnding:'done'};
  await ok(await call('/campaign/import',cookie,{requestId:randomUUID(),guestSave:demo}));
  const listed=await ok(await call('/rewards',cookie));
  assert.equal(listed.rewards.find(reward=>reward.key==='chapter:gatehouse').status,'available');
  assert.equal(listed.rewards.find(reward=>reward.key==='chapter:farmland').status,'locked');
  assert.equal((await call('/rewards/claim',cookie,{requestId:randomUUID(),rewardKey:'chapter:farmland'})).status,409);
  const firstThree=chapterRewards.slice(0,3);
  const claimed=await Promise.all(firstThree.map(reward=>call('/rewards/claim',cookie,{requestId:randomUUID(),rewardKey:reward.key})));
  for(const response of claimed)assert.equal(response.status,200);
  const after=(await ok(await call('/campaign',cookie))).profile;
  assert.equal(after.campaign.coins,600);assert.equal(after.inventory.jet,1);assert.equal(after.inventory.flywheel,1);assert.equal(after.inventory.prism,1);
  assert.equal((await pool.query('SELECT count(*)::int AS n FROM artifact_leaderboards.dune_reward_claims WHERE player_id=$1',[playerId])).rows[0].n,3);
  const full=await launch(),fullId=accountByCookie.get(full.cookie);
  const all=deriveCampaign(content.levels.map(level=>level.id),0,{...emptyCampaign(),oasisTransition:'ready',gatehouseReady:true,farmlandReady:true,townReady:true,castleReady:true,riverReady:true,demoEnding:'done',farmlandEnding:'done',townEnding:'done',castleEnding:'done',riverEnding:'done',activeCompanion:'keeper'});
  await pool.query('INSERT INTO artifact_leaderboards.dune_profiles(player_id,profile) VALUES($1,$2)',[fullId,{revision:5,campaign:all,imported:true}]);
  const finished=await Promise.all(chapterRewards.map(reward=>call('/rewards/claim',full.cookie,{requestId:randomUUID(),rewardKey:reward.key})));
  for(const response of finished)assert.equal(response.status,200);
  const current=(await ok(await call('/campaign',full.cookie))).profile;
  assert.equal(current.campaign.coins,1400);
  assert.deepEqual(current.inventory,{tileBomb:1,freeSwap:1,jet:1,flywheel:2,prism:2});
  const duplicate=await ok(await call('/rewards/claim',full.cookie,{requestId:randomUUID(),rewardKey:'chapter:oasis'}));
  assert.equal(duplicate.profile.revision,current.revision);assert.equal(duplicate.award.payload.coins,200);
  const cap=await launch(),capId=accountByCookie.get(cap.cookie);
  await pool.query('INSERT INTO artifact_leaderboards.dune_profiles(player_id,profile) VALUES($1,$2)',[capId,{revision:1,campaign:deriveCampaign(content.levels.slice(0,10).map(level=>level.id),0,{oasisTransition:'ready'}),inventory:{tileBomb:0,freeSwap:0,jet:1_000_000,flywheel:0,prism:0}}]);
  assert.equal((await call('/rewards/claim',cap.cookie,{requestId:randomUUID(),rewardKey:'chapter:oasis'})).status,409);
  assert.equal((await pool.query('SELECT count(*)::int AS n FROM artifact_leaderboards.dune_reward_claims WHERE player_id=$1',[capId])).rows[0].n,0);
});

test('a daily-only Portal profile can import guest progress without losing its gift',async()=>{
  const account=await launch(),id=accountByCookie.get(account.cookie);
  assert.equal((await ok(await call('/campaign',account.cookie))).canImportGuest,true);
  const daily=(await ok(await call('/rewards',account.cookie))).rewards.find(reward=>reward.key.startsWith('daily:'));
  await ok(await call('/rewards/claim',account.cookie,{requestId:randomUUID(),rewardKey:daily.key}));
  const rewardOnly=await ok(await call('/campaign',account.cookie));
  assert.equal(rewardOnly.canImportGuest,true);assert.equal(rewardOnly.profile.campaign.coins,100);assert.equal(rewardOnly.profile.revision,1);
  const guest={...emptyCampaign(),completed:['pumpHouse'],coins:20};
  const requestId=randomUUID();
  const merged=await ok(await call('/campaign/import',account.cookie,{requestId,guestSave:guest}));
  assert.equal(merged.profile.campaign.coins,120);assert.equal(merged.profile.campaign.completed.length,1);assert.equal(merged.profile.revision,2);
  assert.equal((await ok(await call('/campaign',account.cookie))).canImportGuest,false);
  assert.equal((await ok(await call('/campaign/import',account.cookie,{requestId,guestSave:guest}))).profile.campaign.coins,120);
  const oasisComplete={...emptyCampaign(),completed:content.levels.slice(0,10).map(level=>level.id),coins:0,oasisTransition:'ready'};
  const afterImportGift=await launch();
  const importId=randomUUID();
  await ok(await call('/campaign/import',afterImportGift.cookie,{requestId:importId,guestSave:oasisComplete}));
  await ok(await call('/rewards/claim',afterImportGift.cookie,{requestId:randomUUID(),rewardKey:'chapter:oasis'}));
  const replayedImport=await ok(await call('/campaign/import',afterImportGift.cookie,{requestId:importId,guestSave:oasisComplete}));
  assert.equal(replayedImport.profile.campaign.coins,200,'import receipt replay returns current gift balance');
  assert.equal(replayedImport.profile.inventory.jet,1);
  assert.equal((await pool.query('SELECT count(*)::int AS n FROM artifact_leaderboards.dune_reward_claims WHERE player_id=$1',[id])).rows[0].n,1);
  const racing=await launch();
  const key=(await ok(await call('/rewards',racing.cookie))).rewards[0].key;
  const [gift,imported]=await Promise.all([
    call('/rewards/claim',racing.cookie,{requestId:randomUUID(),rewardKey:key}),
    call('/campaign/import',racing.cookie,{requestId:randomUUID(),guestSave:guest}),
  ]);
  assert.equal(gift.status,200);assert.equal(imported.status,200);
  assert.equal((await ok(await call('/campaign',racing.cookie))).profile.campaign.coins,120,'profile lock serializes claim and import');
  const fresh=await launch();
  await ok(await call('/campaign/checkpoint',fresh.cookie,{requestId:randomUUID(),campaign:emptyCampaign(),expectedRevision:0}));
  assert.equal((await ok(await call('/campaign',fresh.cookie))).canImportGuest,false,'explicit fresh start closes later import');
  const freshAfterGift=await launch();
  const dailyKey=(await ok(await call('/rewards',freshAfterGift.cookie))).rewards[0].key;
  const dailyProfile=(await ok(await call('/rewards/claim',freshAfterGift.cookie,{requestId:randomUUID(),rewardKey:dailyKey}))).profile;
  const freshGiftCheckpoint={...emptyCampaign(),coins:100};
  await ok(await call('/campaign/checkpoint',freshAfterGift.cookie,{requestId:randomUUID(),campaign:freshGiftCheckpoint,expectedRevision:dailyProfile.revision}));
  assert.equal((await ok(await call('/campaign',freshAfterGift.cookie))).canImportGuest,false,'fresh start after a daily gift keeps coins and opts out of import');
  const prepared=await launch();
  await ok(await call('/attempts',prepared.cookie,{attemptId:randomUUID(),levelId:'pumpHouse',boosters:[]}));
  assert.equal((await ok(await call('/campaign',prepared.cookie))).canImportGuest,false,'prepared attempt closes import');
  const unexplained=await launch(),unexplainedId=accountByCookie.get(unexplained.cookie);
  await pool.query('INSERT INTO artifact_leaderboards.dune_profiles(player_id,profile) VALUES($1,$2)',[unexplainedId,{revision:1,campaign:{...emptyCampaign(),coins:50}}]);
  assert.equal((await ok(await call('/campaign',unexplained.cookie))).canImportGuest,false);
  const capped=await launch(),cappedId=accountByCookie.get(capped.cookie);
  await pool.query('INSERT INTO artifact_leaderboards.dune_profiles(player_id,profile) VALUES($1,$2)',[cappedId,{revision:1,campaign:{...emptyCampaign(),coins:999950}}]);
  await pool.query("INSERT INTO artifact_leaderboards.dune_reward_claims(player_id,reward_key,reward_version,reward_payload) VALUES($1,'daily:2026-11-23',1,$2)",[cappedId,{coins:999950,item:null,quantity:0}]);
  assert.equal((await ok(await call('/campaign',capped.cookie))).canImportGuest,true);
  assert.equal((await call('/campaign/import',capped.cookie,{requestId:randomUUID(),guestSave:{...guest,coins:80}})).status,409,'combined balance must stay bounded');
  assert.equal((await ok(await call('/campaign',capped.cookie))).profile.campaign.coins,999950);
});
