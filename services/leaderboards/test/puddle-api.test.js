import { test, before, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import pg from 'pg';
import { SignJWT } from 'jose';
import { createPuddleApp, GAME, VERSION } from '../src/puddle-app.js';
import { createCombinedApp } from '../src/combined.js';
import { PUDDLE_LEVELS, scorePuddleRun } from '../src/puddle-rules.js';

const database=process.env.TEST_DATABASE_URL;
if(!database)throw new Error('Set TEST_DATABASE_URL to a disposable local Postgres database.');
const url=new URL(database);
if(!['localhost','127.0.0.1'].includes(url.hostname)||!url.pathname.endsWith('_test'))throw new Error('Tests require a local database named *_test.');
const pool=new pg.Pool({connectionString:database});
const secret='puddle-test-secret-with-at-least-32-characters';
const cosmicSecret='cosmic-test-secret-with-at-least-32-characters';
const issuer='https://portal.example.test',origin='http://localhost:5173';
let server,base;
before(async()=>{
  const schema=await readFile(new URL('../schema.sql',import.meta.url),'utf8');await pool.query(schema);
  await pool.query('TRUNCATE artifact_leaderboards.puddle_community_versions, artifact_leaderboards.puddle_community_levels, artifact_leaderboards.raid_profiles, artifact_leaderboards.runs, artifact_leaderboards.sessions, artifact_leaderboards.players, artifact_leaderboards.launches RESTART IDENTITY');
  server=createPuddleApp({pool,origin,issuer,launchSecret:secret,secure:false}).listen(0,'127.0.0.1');
  await new Promise(resolve=>server.once('listening',resolve));base=`http://127.0.0.1:${server.address().port}/leaderboard-api/${GAME}`;
});
after(async()=>{await new Promise(resolve=>server.close(resolve));await pool.end();});
beforeEach(async()=>{await pool.query('TRUNCATE artifact_leaderboards.puddle_community_versions, artifact_leaderboards.puddle_community_levels, artifact_leaderboards.raid_profiles, artifact_leaderboards.runs, artifact_leaderboards.sessions, artifact_leaderboards.players, artifact_leaderboards.launches RESTART IDENTITY');});
async function token(overrides={},key=secret){return new SignJWT({typ:'portal_module_launch',moduleSlug:GAME,handle:'Puddle Maker',...overrides})
  .setProtectedHeader({alg:'HS256'}).setIssuer(issuer).setAudience(GAME).setSubject(overrides.sub||'user:'+Math.floor(Math.random()*1e8))
  .setJti(randomUUID()).setIssuedAt().setExpirationTime('2m').sign(new TextEncoder().encode(key));}
async function launch(value){const response=await fetch(`${base}/callback?token=${encodeURIComponent(value??await token())}`,{redirect:'manual'});
  return {response,cookie:response.headers.get('set-cookie')?.split(';')[0]};}
async function post(path,cookie,body,requestOrigin=origin){return fetch(base+path,{method:'POST',headers:{Cookie:cookie||'',Origin:requestOrigin,'Content-Type':'application/json'},body:JSON.stringify(body)});}
const startBody=level=>({version:VERSION,level,contentId:PUDDLE_LEVELS[level].contentId});
const finishBody=(level,durationMs,gold,gems)=>({version:VERSION,level,durationMs,gold,gems,excludedMs:0});
async function start(cookie,level=1){const response=await post('/runs',cookie,startBody(level));assert.equal(response.status,201,JSON.stringify(await response.clone().json()));return (await response.json()).runId;}
async function elapsed(id,seconds){await pool.query("UPDATE artifact_leaderboards.runs SET started_at=now()-($2::int * interval '1 second') WHERE id=$1",[id,seconds]);}
const communityDocument=()=>({format:'puddle-level',version:3,draft:{name:'Shared garden',presetId:0,
  boundary:{type:'boundary',minX:-9,maxX:9,minZ:-6,maxZ:4.8},terrain:{type:'flat',height:0},
  totalFlesh:297,startingFlesh:65,targetTime:45,tendrils:true,nextObjectId:3,
  objects:[{id:'object-1',kind:'start',x:7,z:-2.6},
    {id:'object-2',kind:'exit',type:'funnel',x:-7,z:2.6,radius:.95,bottomRadius:.36,depth:.9}]}});

test('community levels publish immutable versions, hide all public links, and isolate owners',async()=>{
  const first=await launch(await token({sub:'user:921001'})),other=await launch(await token({sub:'user:921002'}));
  const payload={requestId:randomUUID(),description:'A garden to explore',document:communityDocument()};
  assert.equal((await fetch(base+'/community/levels')).status,200);
  assert.equal((await post('/community/levels',null,payload)).status,401);
  assert.equal((await post('/community/levels',first.cookie,payload,'https://evil.example')).status,403);
  let response=await post('/community/levels',first.cookie,payload);assert.equal(response.status,201);
  const created=await response.json();assert.equal(created.version,1);
  response=await post('/community/levels',first.cookie,payload);assert.equal(response.status,201);
  assert.deepEqual(await response.json(),created);
  assert.equal((await post('/community/levels',first.cookie,{...payload,description:'Different'})).status,409);
  assert.equal((await fetch(`${base}/community/levels/${created.id}`)).status,200);
  assert.equal((await fetch(`${base}/community/levels/${created.id}/versions/1`)).status,200);
  const mine=await (await fetch(base+'/community/mine',{headers:{Cookie:first.cookie}})).json();
  assert.equal(mine.entries[0].id,created.id);
  assert.equal((await fetch(`${base}/community/mine/${created.id}`,{headers:{Cookie:other.cookie}})).status,404);
  const revised=communityDocument();revised.draft.name='Revised shared garden';
  const update={requestId:randomUUID(),baseVersion:1,description:'Second chapter',document:revised};
  assert.equal((await post(`/community/levels/${created.id}/versions`,other.cookie,update)).status,404);
  response=await post(`/community/levels/${created.id}/versions`,first.cookie,update);assert.equal(response.status,201);
  assert.equal((await response.json()).version,2);
  assert.equal((await post(`/community/levels/${created.id}/versions`,first.cookie,{...update,requestId:randomUUID()})).status,409);
  assert.equal((await (await fetch(`${base}/community/levels/${created.id}/versions/1`)).json()).title,'Shared garden');
  assert.equal((await (await fetch(`${base}/community/levels/${created.id}`)).json()).title,'Revised shared garden');
  response=await post(`/community/levels/${created.id}/unpublish`,first.cookie,{expectedVersion:2});
  assert.equal(response.status,200);assert.equal((await response.json()).published,false);
  assert.equal((await fetch(`${base}/community/levels/${created.id}`)).status,404);
  assert.equal((await fetch(`${base}/community/levels/${created.id}/versions/1`)).status,404);
  response=await post(`/community/levels/${created.id}/versions`,first.cookie,{...update,requestId:randomUUID(),baseVersion:2});
  assert.equal(response.status,201);assert.equal((await response.json()).version,3);
  assert.equal((await fetch(`${base}/community/levels/${created.id}`)).status,200);
});

test('community publication applies bounded validation and distinct body limit',async()=>{
  const {cookie}=await launch(await token({sub:'user:921003'}));
  const valid={requestId:randomUUID(),description:'Valid',document:communityDocument()};
  assert.equal((await post('/community/levels',cookie,{...valid,document:{...valid.document,evil:true}})).status,400);
  const invalidAttachment=communityDocument();
  invalidAttachment.draft.objects.push({id:'basin-1',kind:'basin',type:'funnel',x:0,z:0,
    radius:.45,bottomRadius:.2,depth:.2,base:1.5,targetId:'object-1'});
  assert.equal((await post('/community/levels',cookie,{...valid,document:invalidAttachment})).status,400);
  const oversized={...valid,requestId:randomUUID(),description:'x'.repeat(5000)};
  assert.equal((await post('/community/levels',cookie,oversized)).status,400);
  const huge=JSON.stringify({...valid,document:{...valid.document,draft:{...valid.document.draft,
    objects:[...valid.document.draft.objects,{id:'oversized',kind:'label',x:0,z:0,base:0,offset:0,text:'x'.repeat(270000)}]}}});
  assert.equal((await fetch(base+'/community/levels',{method:'POST',headers:{Cookie:cookie,Origin:origin,'Content-Type':'application/json'},body:huge})).status,413);
  assert.equal((await post('/runs',cookie,{padding:'x'.repeat(5000)})).status,413);
});

test('daily publication quota serializes updates to different levels by one author',async()=>{
  const {cookie}=await launch(await token({sub:'user:921006'}));
  const document=communityDocument(),description='Quota race';
  const publish=async()=>{const response=await post('/community/levels',cookie,
    {requestId:randomUUID(),description,document});
    assert.equal(response.status,201);return (await response.json()).id;};
  const [first,second]=[await publish(),await publish()];
  const ownerId=(await pool.query("SELECT id FROM artifact_leaderboards.players WHERE subject='user:921006'" )).rows[0].id;
  const fillerId=randomUUID();
  await pool.query(`INSERT INTO artifact_leaderboards.puddle_community_levels(id,owner_id,current_version,published)
    VALUES($1,$2,97,false)`,[fillerId,ownerId]);
  await pool.query(`INSERT INTO artifact_leaderboards.puddle_community_versions
    (level_id,version,request_id,document,description,content_hash,title,gold_count,gem_count,target_seconds,validation_version)
    SELECT $1,i,gen_random_uuid(),$2,'filler','test','Filler',0,0,30,1
    FROM generate_series(1,97) AS i`,[fillerId,document]);
  const update=levelId=>post(`/community/levels/${levelId}/versions`,cookie,
    {requestId:randomUUID(),baseVersion:1,description,document});
  const results=await Promise.all([update(first),update(second)]);
  assert.deepEqual(results.map(response=>response.status).sort(),[201,429]);
});

test('community updates enforce concurrent version, request ownership, pagination and quotas',async()=>{
  const author=await launch(await token({sub:'user:921004'})),outsider=await launch(await token({sub:'user:921005'}));
  const doc=communityDocument(),description='A room';
  const first=await (await post('/community/levels',author.cookie,{requestId:randomUUID(),description,document:doc})).json();
  const common={baseVersion:1,description,document:doc};
  const a={...common,requestId:randomUUID()},b={...common,requestId:randomUUID()};
  const raced=await Promise.all([post(`/community/levels/${first.id}/versions`,author.cookie,a),
    post(`/community/levels/${first.id}/versions`,author.cookie,b)]);
  assert.deepEqual(raced.map(r=>r.status).sort(),[201,409]);
  const winner=raced[0].status===201?a:b;
  assert.equal((await post(`/community/levels/${first.id}/versions`,author.cookie,winner)).status,201);
  assert.equal((await post(`/community/levels/${first.id}/versions`,outsider.cookie,winner)).status,404);
  assert.equal((await post('/community/levels',outsider.cookie,{requestId:winner.requestId,description,document:doc})).status,409);
  for(let i=0;i<21;i++){
    const levelId=randomUUID();await pool.query(`INSERT INTO artifact_leaderboards.puddle_community_levels(id,owner_id,current_version,published,updated_at)
      SELECT $1,p.id,1,true,now()-($2::int * interval '1 second') FROM artifact_leaderboards.players p WHERE p.subject='user:921004'`,
      [levelId,i+1]);
    await pool.query(`INSERT INTO artifact_leaderboards.puddle_community_versions
      (level_id,version,request_id,document,description,content_hash,title,gold_count,gem_count,target_seconds,validation_version)
      VALUES($1,1,$2,$3,$4,'test','Seeded garden',0,0,30,1)`,[levelId,randomUUID(),doc,description]);
  }
  const page=await (await fetch(base+'/community/levels?limit=10')).json();
  assert.equal(page.entries.length,10);assert.ok(page.nextCursor);
  const second=await (await fetch(`${base}/community/levels?limit=10&cursor=${encodeURIComponent(page.nextCursor)}`)).json();
  assert.equal(second.entries.length,10);
  assert.equal(new Set([...page.entries,...second.entries].map(x=>x.id)).size,20);
  const ownerId=(await pool.query("SELECT id FROM artifact_leaderboards.players WHERE subject='user:921004'")).rows[0].id;
  await pool.query(`INSERT INTO artifact_leaderboards.puddle_community_levels(id,owner_id,current_version,published)
    SELECT gen_random_uuid(),$1,1,false FROM generate_series(1,29)`,[ownerId]);
  assert.equal((await post('/community/levels',author.cookie,{requestId:randomUUID(),description,document:doc})).status,429);
});

test('public boards, signed handoff and one-use launch',async()=>{
  assert.deepEqual(await (await fetch(base+'/ready')).json(),{ready:true,missing:[]});
  assert.equal((await fetch(base+'/leaderboard?level=1')).status,200);
  assert.equal((await fetch(base+'/leaderboard?level=8')).status,400);
  assert.equal((await post('/runs',null,startBody(1))).status,401);
  const jwt=await token();const {response,cookie}=await launch(jwt);
  assert.equal(response.status,303);assert.equal(response.headers.get('location'),origin+'/puddle-study/');
  assert.match(response.headers.get('set-cookie'),/puddle_ranked=.*Path=\/leaderboard-api\/puddle-study/);
  assert.match(response.headers.get('set-cookie'),/HttpOnly/);
  assert.equal((await (await fetch(base+'/session',{headers:{Cookie:cookie}})).json()).displayName,'Puddle Maker');
  assert.equal((await launch(jwt)).cookie,undefined);
  assert.equal((await launch(await token({},'wrong-test-secret-with-at-least-32-characters'))).cookie,undefined);
  assert.equal((await launch(await token({moduleSlug:'raid-survivor'}))).cookie,undefined);
});

test('score boundaries, CSRF, ownership and idempotent finish',async()=>{
  const {cookie}=await launch();
  assert.equal((await post('/runs',cookie,startBody(1),'https://evil.example')).status,403);
  assert.equal((await post('/runs',cookie,{...startBody(1),contentId:'stale'})).status,409);
  assert.equal((await post('/runs','raid_survivor_ranked='+cookie.split('=')[1],startBody(1))).status,401);
  const runId=await start(cookie);
  const other=await launch();assert.equal((await post(`/runs/${runId}/finish`,other.cookie,finishBody(1,20000,17,3))).status,404);
  await elapsed(runId,20);
  assert.equal((await post(`/runs/${runId}/finish`,cookie,finishBody(1,20000,18,3))).status,400);
  const body=finishBody(1,20000,17,3);
  const responses=await Promise.all([post(`/runs/${runId}/finish`,cookie,body),post(`/runs/${runId}/finish`,cookie,body)]);
  assert.deepEqual(responses.map(r=>r.status),[200,200]);
  assert.deepEqual(await Promise.all(responses.map(r=>r.json())),[
    {saved:true,score:1100,details:{level:1,gold:17,gems:3,totalGold:17,totalGems:3,targetMs:30000,collectionPercent:100,collectionPoints:1000,timePoints:100,excludedMs:0}},
    {saved:true,score:1100,details:{level:1,gold:17,gems:3,totalGold:17,totalGems:3,targetMs:30000,collectionPercent:100,collectionPoints:1000,timePoints:100,excludedMs:0}},
  ]);
  assert.equal((await post(`/runs/${runId}/finish`,cookie,{...body,gold:16})).status,409);
});

test('a renewed session for the same Portal account can finish an existing run',async()=>{
  const subject='user:612345';
  const first=await launch(await token({sub:subject}));
  const runId=await start(first.cookie);
  const other=await launch(await token({sub:'user:612346'}));
  assert.equal((await post(`/runs/${runId}/finish`,other.cookie,finishBody(1,20000,17,3))).status,404);
  const renewed=await launch(await token({sub:subject}));
  await elapsed(runId,20);
  const response=await post(`/runs/${runId}/finish`,renewed.cookie,finishBody(1,20000,17,3));
  assert.equal(response.status,200);
  assert.equal((await response.json()).score,1100);
});

test('Puddle allows 240 starts per hour and rejects the next start',async()=>{
  const {cookie}=await launch();
  await start(cookie);
  const {rows:[player]}=await pool.query('SELECT player_id FROM artifact_leaderboards.sessions LIMIT 1');
  await pool.query(`INSERT INTO artifact_leaderboards.runs (id,player_id,session_hash,game,version,run_config)
    SELECT unnest($1::uuid[]),$2,'test', $3,$4,'{}'::jsonb`,
    [Array.from({length:239},()=>randomUUID()),player.player_id,GAME,VERSION]);
  assert.equal((await post('/runs',cookie,startBody(1))).status,429);
});

test('readiness reports missing grants for a restricted service role',async()=>{
  const role=`puddle_ready_${randomUUID().replaceAll('-','').slice(0,12)}`;
  const password=randomUUID();
  const roleUrl=new URL(database);roleUrl.username=role;roleUrl.password=password;
  let restrictedPool,restrictedServer;
  try{
    await pool.query(`CREATE ROLE ${role} LOGIN PASSWORD '${password}'`);
    await pool.query(`GRANT USAGE ON SCHEMA artifact_leaderboards TO ${role}`);
    for(const table of ['launches','players','sessions','runs','puddle_community_levels','puddle_community_versions'])
      await pool.query(`GRANT SELECT ON artifact_leaderboards.${table} TO ${role}`);
    restrictedPool=new pg.Pool({connectionString:roleUrl.toString()});
    restrictedServer=createPuddleApp({pool:restrictedPool,origin,issuer,launchSecret:secret,secure:false}).listen(0,'127.0.0.1');
    await new Promise(resolve=>restrictedServer.once('listening',resolve));
    const ready=`http://127.0.0.1:${restrictedServer.address().port}/leaderboard-api/${GAME}/ready`;
    const denied=await fetch(ready);assert.equal(denied.status,503);
    const missing=(await denied.json()).missing;
    assert.ok(missing.includes('artifact_leaderboards.players:insert'));
    assert.ok(missing.some(value=>value.includes('players_id_seq')));
    await pool.query(`GRANT INSERT, DELETE ON artifact_leaderboards.launches,artifact_leaderboards.sessions TO ${role}`);
    await pool.query(`GRANT INSERT, UPDATE ON artifact_leaderboards.players,artifact_leaderboards.runs TO ${role}`);
    await pool.query(`GRANT INSERT, UPDATE ON artifact_leaderboards.puddle_community_levels TO ${role}`);
    await pool.query(`GRANT INSERT ON artifact_leaderboards.puddle_community_versions TO ${role}`);
    await pool.query(`GRANT USAGE ON SEQUENCE artifact_leaderboards.players_id_seq TO ${role}`);
    assert.deepEqual(await (await fetch(ready)).json(),{ready:true,missing:[]});
  }finally{
    if(restrictedServer)await new Promise(resolve=>restrictedServer.close(resolve));
    await restrictedPool?.end();
    await pool.query(`DROP OWNED BY ${role}; DROP ROLE ${role}`).catch(()=>{});
  }
});

test('per-level best run, ties, timeout and no cross-level mixing',async()=>{
  const {cookie}=await launch();
  const first=await start(cookie,1);await elapsed(first,30);
  assert.equal((await post(`/runs/${first}/finish`,cookie,finishBody(1,30000,10,0))).status,200);
  const second=await start(cookie,1);await elapsed(second,20);
  assert.equal((await post(`/runs/${second}/finish`,cookie,finishBody(1,20000,17,3))).status,200);
  const third=await start(cookie,2);await elapsed(third,45);
  assert.equal((await post(`/runs/${third}/finish`,cookie,finishBody(2,45000,9,1))).status,200);
  const firstBoard=(await (await fetch(base+'/leaderboard?level=1')).json()).entries;
  const secondBoard=(await (await fetch(base+'/leaderboard?level=2')).json()).entries;
  assert.equal(firstBoard.filter(row=>row.displayName==='Puddle Maker').length,1);
  assert.equal(firstBoard[0].score,1100);assert.equal(secondBoard.length,1);assert.equal(secondBoard[0].score,500);
  const expired=await start(cookie,7);await elapsed(expired,7201);
  assert.equal((await post(`/runs/${expired}/finish`,cookie,finishBody(7,100000,55,7))).status,410);
});

test('revised nursery board excludes retired scores and rejects an unfinished stale run',async()=>{
  const {cookie}=await launch();
  const old=await start(cookie,1);await elapsed(old,20);
  assert.equal((await post(`/runs/${old}/finish`,cookie,finishBody(1,20000,17,3))).status,200);
  await pool.query(`UPDATE artifact_leaderboards.runs SET run_config=jsonb_set(run_config,'{contentId}','"retired-nursery"'::jsonb) WHERE id=$1`,[old]);
  assert.equal((await (await fetch(base+'/leaderboard?level=1')).json()).entries.length,0);
  const stale=await start(cookie,1);
  await pool.query(`UPDATE artifact_leaderboards.runs SET run_config=jsonb_set(run_config,'{contentId}','"retired-nursery"'::jsonb) WHERE id=$1`,[stale]);
  await elapsed(stale,20);
  const rejected=await post(`/runs/${stale}/finish`,cookie,finishBody(1,20000,17,3));
  assert.equal(rejected.status,409);assert.match(JSON.stringify(await rejected.json()),/Reload Puddle/);
  const fresh=await start(cookie,1);await elapsed(fresh,20);
  assert.equal((await post(`/runs/${fresh}/finish`,cookie,finishBody(1,20000,17,3))).status,200);
  assert.equal((await (await fetch(base+'/leaderboard?level=1')).json()).entries.length,1);
  const other=await start(cookie,2);await elapsed(other,45);
  assert.equal((await post(`/runs/${other}/finish`,cookie,finishBody(2,45000,9,1))).status,200);
  assert.equal((await (await fetch(base+'/leaderboard?level=2')).json()).entries.length,1);
});

test('revised cistern board retires old Level 2 scores without changing other boards',async()=>{
  const {cookie}=await launch();
  const nursery=await start(cookie,1);await elapsed(nursery,30);
  assert.equal((await post(`/runs/${nursery}/finish`,cookie,finishBody(1,30000,17,3))).status,200);
  const old=await start(cookie,2);await elapsed(old,45);
  const oldFinish=finishBody(2,45000,17,3);
  assert.equal((await post(`/runs/${old}/finish`,cookie,oldFinish)).status,200);
  await pool.query(`UPDATE artifact_leaderboards.runs SET run_config=jsonb_set(run_config,'{contentId}','"62c72bfba949027f"'::jsonb) WHERE id=$1`,[old]);
  assert.equal((await (await fetch(base+'/leaderboard?level=2')).json()).entries.length,0);
  assert.equal((await post(`/runs/${old}/finish`,cookie,oldFinish)).status,200,'an exact completed retry stays idempotent');
  const stale=await start(cookie,2);
  await pool.query(`UPDATE artifact_leaderboards.runs SET run_config=jsonb_set(run_config,'{contentId}','"62c72bfba949027f"'::jsonb) WHERE id=$1`,[stale]);
  await elapsed(stale,45);
  assert.equal((await post(`/runs/${stale}/finish`,cookie,finishBody(2,45000,17,3))).status,409);
  const fresh=await start(cookie,2);await elapsed(fresh,45);
  assert.equal((await post(`/runs/${fresh}/finish`,cookie,finishBody(2,45000,17,3))).status,200);
  assert.equal((await (await fetch(base+'/leaderboard?level=2')).json()).entries.length,1);
  assert.equal((await (await fetch(base+'/leaderboard?level=1')).json()).entries.length,1);
});

test('Silt Loom board retires old Level 3 scores while other floors keep theirs',async()=>{
  const {cookie}=await launch();
  const cistern=await start(cookie,2);await elapsed(cistern,45);
  assert.equal((await post(`/runs/${cistern}/finish`,cookie,finishBody(2,45000,17,3))).status,200);
  const old=await start(cookie,3);await elapsed(old,50);
  const finish=finishBody(3,50000,17,3);
  assert.equal((await post(`/runs/${old}/finish`,cookie,finish)).status,200);
  await pool.query(`UPDATE artifact_leaderboards.runs SET run_config=jsonb_set(run_config,'{contentId}','"2fc182ca57392100"'::jsonb) WHERE id=$1`,[old]);
  assert.equal((await (await fetch(base+'/leaderboard?level=3')).json()).entries.length,0);
  assert.equal((await post(`/runs/${old}/finish`,cookie,finish)).status,200);
  const stale=await start(cookie,3);
  await pool.query(`UPDATE artifact_leaderboards.runs SET run_config=jsonb_set(run_config,'{contentId}','"2fc182ca57392100"'::jsonb) WHERE id=$1`,[stale]);
  await elapsed(stale,50);
  assert.equal((await post(`/runs/${stale}/finish`,cookie,finish)).status,409);
  const fresh=await start(cookie,3);await elapsed(fresh,50);
  assert.equal((await post(`/runs/${fresh}/finish`,cookie,finish)).status,200);
  assert.equal((await (await fetch(base+'/leaderboard?level=3')).json()).entries.length,1);
  assert.equal((await (await fetch(base+'/leaderboard?level=2')).json()).entries.length,1);
});

test('Threadworks board retires old Level 4 scores and rejects unfinished stale attempts',async()=>{
  const {cookie}=await launch();
  const other=await start(cookie,5);await elapsed(other,60);
  assert.equal((await post(`/runs/${other}/finish`,cookie,finishBody(5,60000,12,2))).status,200);
  const old=await start(cookie,4);await elapsed(old,55);
  const finish=finishBody(4,55000,17,3);
  assert.equal((await post(`/runs/${old}/finish`,cookie,finish)).status,200);
  await pool.query(`UPDATE artifact_leaderboards.runs SET run_config=jsonb_set(run_config,'{contentId}','"retired-reach-garden"'::jsonb) WHERE id=$1`,[old]);
  assert.equal((await (await fetch(base+'/leaderboard?level=4')).json()).entries.length,0);
  assert.equal((await post(`/runs/${old}/finish`,cookie,finish)).status,200,'completed retries stay idempotent');
  const stale=await start(cookie,4);
  await pool.query(`UPDATE artifact_leaderboards.runs SET run_config=jsonb_set(run_config,'{contentId}','"retired-reach-garden"'::jsonb) WHERE id=$1`,[stale]);
  await elapsed(stale,55);
  assert.equal((await post(`/runs/${stale}/finish`,cookie,finish)).status,409);
  const fresh=await start(cookie,4);await elapsed(fresh,55);
  assert.equal((await post(`/runs/${fresh}/finish`,cookie,finish)).status,200);
  assert.equal((await (await fetch(base+'/leaderboard?level=4')).json()).entries.length,1);
  assert.equal((await (await fetch(base+'/leaderboard?level=5')).json()).entries.length,1);
});

test('Rootwell Gallery retires old Level 5 scores without changing Level 6',async()=>{
  const {cookie}=await launch();
  const sixth=await start(cookie,6);await elapsed(sixth,80);
  assert.equal((await post(`/runs/${sixth}/finish`,cookie,finishBody(6,80000,18,3))).status,200);
  const old=await start(cookie,5);await elapsed(old,60);
  const finish=finishBody(5,60000,17,3);
  assert.equal((await post(`/runs/${old}/finish`,cookie,finish)).status,200);
  await pool.query(`UPDATE artifact_leaderboards.runs SET run_config=jsonb_set(run_config,'{contentId}','"retired-grip-garden"'::jsonb) WHERE id=$1`,[old]);
  assert.equal((await (await fetch(base+'/leaderboard?level=5')).json()).entries.length,0);
  const stale=await start(cookie,5);
  await pool.query(`UPDATE artifact_leaderboards.runs SET run_config=jsonb_set(run_config,'{contentId}','"retired-grip-garden"'::jsonb) WHERE id=$1`,[stale]);
  await elapsed(stale,60);
  assert.equal((await post(`/runs/${stale}/finish`,cookie,finish)).status,409);
  const fresh=await start(cookie,5);await elapsed(fresh,60);
  assert.equal((await post(`/runs/${fresh}/finish`,cookie,finish)).status,200);
  assert.equal((await (await fetch(base+'/leaderboard?level=5')).json()).entries.length,1);
  assert.equal((await (await fetch(base+'/leaderboard?level=6')).json()).entries.length,1);
});

test('revised Crown and Cascade boards retire their former layouts without changing Level 5',async()=>{
  const {cookie}=await launch();
  const fifth=await start(cookie,5);await elapsed(fifth,60);
  assert.equal((await post(`/runs/${fifth}/finish`,cookie,finishBody(5,60000,17,3))).status,200);
  for(const [level,formerId,seconds,gold,gems] of [
    [6,'86cfe9443f906f77',90,36,6],[7,'75312851bc01c136',135,55,7],
  ]){
    const finish=finishBody(level,seconds*1000,gold,gems),old=await start(cookie,level);
    await elapsed(old,seconds);
    assert.equal((await post(`/runs/${old}/finish`,cookie,finish)).status,200);
    await pool.query("UPDATE artifact_leaderboards.runs SET run_config=jsonb_set(run_config,'{contentId}',to_jsonb($2::text)) WHERE id=$1",[old,formerId]);
    assert.equal((await (await fetch(`${base}/leaderboard?level=${level}`)).json()).entries.length,0);
    const stale=await start(cookie,level);
    await pool.query("UPDATE artifact_leaderboards.runs SET run_config=jsonb_set(run_config,'{contentId}',to_jsonb($2::text)) WHERE id=$1",[stale,formerId]);
    await elapsed(stale,seconds);
    assert.equal((await post(`/runs/${stale}/finish`,cookie,finish)).status,409);
    const fresh=await start(cookie,level);await elapsed(fresh,seconds);
    assert.equal((await post(`/runs/${fresh}/finish`,cookie,finish)).status,200);
    assert.equal((await (await fetch(`${base}/leaderboard?level=${level}`)).json()).entries.length,1);
  }
  assert.equal((await (await fetch(base+'/leaderboard?level=5')).json()).entries.length,1);
});

test('pure scoring uses whole seconds and exact collection bounds',()=>{
  const config={level:1,...PUDDLE_LEVELS[1]};
  assert.equal(scorePuddleRun(config,finishBody(1,20001,17,3),20001).score,1090);
  assert.equal(scorePuddleRun(config,finishBody(1,30000,10,0),30000).score,500);
  assert.throws(()=>scorePuddleRun(config,finishBody(1,0,17,3),0));
  assert.throws(()=>scorePuddleRun(config,finishBody(1,20000,17.5,3),20000));
});

test('missing Puddle secret isolates the route from other games',async()=>{
  const app=createCombinedApp({pool,origin,issuer,cosmicSecret,raidSecret:null,puddleSecret:null,secure:false});
  const local=app.listen(0,'127.0.0.1');await new Promise(resolve=>local.once('listening',resolve));
  try{const root=`http://127.0.0.1:${local.address().port}`;
    assert.equal((await fetch(root+'/leaderboard-api/puddle-study/leaderboard?level=1')).status,503);
    assert.equal((await fetch(root+'/leaderboard-api/cosmic-carnival/leaderboard')).status,200);}
  finally{await new Promise(resolve=>local.close(resolve));}
});
