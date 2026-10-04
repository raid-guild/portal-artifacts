import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import pg from 'pg';
import { SignJWT } from 'jose';
import { randomUUID } from 'node:crypto';
import { createRaidApp, GAME, VERSION } from '../src/raid-app.js';
import { MONSTERS } from '../src/raid-rules.js';
const database=process.env.TEST_DATABASE_URL;
if(!database)throw new Error('Set TEST_DATABASE_URL to a disposable local Postgres database.');
const testURL=new URL(database);
if(!['localhost','127.0.0.1'].includes(testURL.hostname)||!testURL.pathname.endsWith('_test'))throw new Error('Tests require a local database named *_test.');
const pool=new pg.Pool({connectionString:database});
const secret='raid-test-secret-with-at-least-32-characters';
const issuer='https://portal.example.test',origin='http://localhost:5173';
let server,base;
before(async()=>{
  const schema=await readFile(new URL('../schema.sql',import.meta.url),'utf8');
  await pool.query(schema);await pool.query(schema);
  await pool.query('TRUNCATE artifact_leaderboards.raid_profiles, artifact_leaderboards.runs, artifact_leaderboards.sessions, artifact_leaderboards.players, artifact_leaderboards.launches RESTART IDENTITY');
  server=createRaidApp({pool,origin,issuer,launchSecret:secret,secure:false}).listen(0,'127.0.0.1');
  await new Promise(resolve=>server.once('listening',resolve));base=`http://127.0.0.1:${server.address().port}/leaderboard-api/${GAME}`;
});
after(async()=>{await new Promise(resolve=>server.close(resolve));await pool.end();});
async function token(overrides={},key=secret,subject='user:'+Math.floor(Math.random()*1e8)){return new SignJWT({typ:'portal_module_launch',moduleSlug:GAME,handle:'Raider',...overrides}).setProtectedHeader({alg:'HS256'}).setIssuer(issuer).setAudience(GAME).setSubject(subject).setJti(randomUUID()).setIssuedAt().setExpirationTime('2m').sign(new TextEncoder().encode(key));}
async function launch(value){const response=await fetch(`${base}/callback?token=${encodeURIComponent(value??await token())}`,{redirect:'manual'});return {response,cookie:response.headers.get('set-cookie')?.split(';')[0]};}
async function post(path,cookie,body,requestOrigin=origin){return fetch(base+path,{method:'POST',headers:{Cookie:cookie||'',Origin:requestOrigin,'Content-Type':'application/json'},body:JSON.stringify(body)});}
const monsters=()=>Object.fromEntries(Object.keys(MONSTERS).map(kind=>[kind,{encountered:0,kills:0,counterKills:0}]));
const config={version:VERSION,character:'ranger',level:'training'};
const finish={...config,durationMs:15000,stats:{kills:12,elites:1,bosses:0,chests:1,level:3},progress:{durationMs:15000,kills:12,monsters:monsters()}};
test('Raid guest leaderboard, session cookie, replay and invalid launch',async()=>{
  assert.equal((await fetch(base+'/leaderboard')).status,200);
  assert.equal((await post('/runs',null,config)).status,401);
  const jwt=await token();const {response,cookie}=await launch(jwt);
  assert.equal(response.status,303);assert.equal(response.headers.get('location'),origin+'/'+GAME+'/');
  assert.match(response.headers.get('set-cookie'),/raid_survivor_ranked=.*Path=\/leaderboard-api\/raid-survivor/);
  assert.match(response.headers.get('set-cookie'),/HttpOnly/);
  assert.equal((await (await fetch(base+'/session',{headers:{Cookie:cookie}})).json()).displayName,'Raider');
  assert.equal((await launch(jwt)).cookie,undefined);
  assert.equal((await launch(await token({},'wrong-test-secret-with-at-least-32-characters'))).cookie,undefined);
  assert.equal((await launch(await token({moduleSlug:'cosmic-carnival'}))).cookie,undefined);
});
test('Raid CSRF, cross-game cookies, ownership and canonical scoring',async()=>{
  const {cookie}=await launch();
  assert.equal((await post('/runs',cookie,config,'https://evil.example')).status,403);
  assert.equal((await post('/runs','cosmic_ranked='+cookie.split('=')[1],config)).status,401);
  const {runId}=await (await post('/runs',cookie,config)).json();
  const other=await launch();assert.equal((await post(`/runs/${runId}/finish`,other.cookie,finish)).status,404);
  await pool.query("UPDATE artifact_leaderboards.runs SET started_at=now()-interval '20 seconds' WHERE id=$1",[runId]);
  assert.equal((await post(`/runs/${runId}/finish`,cookie,{...finish,stats:{...finish.stats,kills:99999}})).status,400);
  const results=await Promise.all([post(`/runs/${runId}/finish`,cookie,finish),post(`/runs/${runId}/finish`,cookie,finish)]);
  assert.deepEqual(results.map(r=>r.status),[200,200],JSON.stringify(await Promise.all(results.map(r=>r.clone().json()))));
  assert.equal((await post(`/runs/${runId}/finish`,cookie,{...finish,character:'dwarf'})).status,409);
  const {rows:[run]}=await pool.query('SELECT score,wave,details FROM artifact_leaderboards.runs WHERE id=$1',[runId]);
  assert.equal(run.score,415);assert.equal(run.wave,null);assert.deepEqual(run.details,{character:'ranger',realm:'training',...finish.stats});
  const board=await (await fetch(base+'/leaderboard')).json();
  assert.deepEqual(Object.keys(board.entries[0]).sort(),['character','displayName','durationMs','kills','level','score']);
  assert.equal(board.entries[0].score,415);
});
test('Raid best score per player, expiry and game-scoped start limit',async()=>{
  const {cookie}=await launch();const first=await (await post('/runs',cookie,config)).json();
  await pool.query("UPDATE artifact_leaderboards.runs SET started_at=now()-interval '3 hours' WHERE id=$1",[first.runId]);
  assert.equal((await post(`/runs/${first.runId}/finish`,cookie,finish)).status,410);
  for(let i=0;i<60;i++)assert.equal((await post('/runs',cookie,config)).status,201);
  assert.equal((await post('/runs',cookie,config)).status,429);
});

test('Raid milestones, capped class skills, monster mastery and level boards are durable and idempotent',async()=>{
  const {cookie}=await launch();
  assert.equal((await post('/runs',cookie,{...config,level:'forest'})).status,400);
  const {runId:trainingId}=await (await post('/runs',cookie,config)).json();
  await pool.query("UPDATE artifact_leaderboards.runs SET started_at=now()-interval '181 seconds' WHERE id=$1",[trainingId]);
  const training={durationMs:180000,kills:0,monsters:monsters()};
  assert.equal((await post(`/runs/${trainingId}/progress`,cookie,{...training,monsters:{...monsters(),rageipede:{encountered:1,kills:0,counterKills:0}}})).status,400);
  const checkpoints=await Promise.all([post(`/runs/${trainingId}/progress`,cookie,training),post(`/runs/${trainingId}/progress`,cookie,training)]);
  assert.deepEqual(checkpoints.map(r=>r.status),[200,200]);
  const profile=(await (await fetch(base+'/profile',{headers:{Cookie:cookie}})).json()).profile;
  assert.deepEqual(profile.unlocked,['training','forest']);assert.equal(profile.milestones.training.ranger,true);assert.equal(profile.revision,1);
  const bought=await post('/profile/mastery',cookie,{character:'ranger',skill:'vitality',expectedRevision:1});
  assert.equal(bought.status,200);assert.equal((await bought.json()).profile.skills.ranger.vitality,1);
  const retry=await post('/profile/mastery',cookie,{character:'ranger',skill:'vitality',expectedRevision:1});
  assert.equal(retry.status,200);assert.equal((await retry.json()).profile.revision,2);
  assert.equal((await post('/profile/mastery',cookie,{character:'ranger',skill:'agility',expectedRevision:2})).status,400);
  const forestStart=await post('/runs',cookie,{...config,level:'forest'});assert.equal(forestStart.status,201);
  const forestRun=await forestStart.json();assert.equal(forestRun.config.skills.vitality,1);assert.equal(forestRun.profile.skills.ranger.vitality,1);
  await pool.query("UPDATE artifact_leaderboards.runs SET started_at=now()-interval '301 seconds' WHERE id=$1",[forestRun.runId]);
  const forestMonsters={...monsters(),rageipede:{encountered:25,kills:25,counterKills:1}};
  const forestProgress={durationMs:300000,kills:25,monsters:forestMonsters};
  assert.equal((await post(`/runs/${forestRun.runId}/progress`,cookie,forestProgress)).status,200);
  assert.equal((await post(`/runs/${forestRun.runId}/progress`,cookie,forestProgress)).status,200);
  const after=(await (await fetch(base+'/profile',{headers:{Cookie:cookie}})).json()).profile;
  assert.equal(after.milestones.forest.ranger,true);assert.equal(after.monsters.rageipede.kills,25);assert.equal(after.monsters.rageipede.counterKills,1);assert.equal(after.revision,3);
  assert.equal((await post('/profile/mastery',cookie,{character:'ranger',skill:'agility',expectedRevision:3})).status,200);
  assert.equal((await post('/profile/mastery',cookie,{character:'ranger',skill:'bombRecharge',expectedRevision:4})).status,400);
  const forestFinish={...config,level:'forest',durationMs:300000,stats:{kills:25,elites:0,bosses:0,chests:0,level:3},progress:forestProgress};
  assert.equal((await post(`/runs/${forestRun.runId}/finish`,cookie,forestFinish)).status,200);
  assert.equal((await post(`/runs/${forestRun.runId}/finish`,cookie,forestFinish)).status,200);
  const all=(await (await fetch(base+'/leaderboard?level=all')).json()).entries;
  const forest=(await (await fetch(base+'/leaderboard?level=forest')).json()).entries;
  assert.ok(all.some(row=>row.level==='forest'));assert.ok(forest.some(row=>row.level==='forest'));
  assert.equal((await (await fetch(base+'/leaderboard?level=training')).json()).entries.some(row=>row.level==='forest'),false);
  const {rows:[run]}=await pool.query('SELECT player_id,session_hash FROM artifact_leaderboards.runs WHERE id=$1',[forestRun.runId]);
  await pool.query(`INSERT INTO artifact_leaderboards.runs(id,player_id,session_hash,game,version,score,duration_ms,details,submitted_at)
    VALUES($1,$2,$3,$4,'1',9999,1000,$5,now())`,[randomUUID(),run.player_id,run.session_hash,GAME,{character:'ranger',kills:100,level:3}]);
  assert.equal((await (await fetch(base+'/leaderboard?level=legacy')).json()).entries.some(row=>row.score===9999),true);
  assert.equal((await (await fetch(base+'/leaderboard?level=all')).json()).entries.some(row=>row.score===9999),false);
});

test('a renewed Portal session can finish its own run and never another account run',async()=>{
  const subject='user:81818181';const first=await launch(await token({},secret,subject));
  const {runId}=await (await post('/runs',first.cookie,config)).json();
  await pool.query("UPDATE artifact_leaderboards.runs SET started_at=now()-interval '20 seconds' WHERE id=$1",[runId]);
  const stranger=await launch();assert.equal((await post(`/runs/${runId}/finish`,stranger.cookie,finish)).status,404);
  const renewed=await launch(await token({},secret,subject));
  const account1=(await (await fetch(base+'/session',{headers:{Cookie:first.cookie}})).json()).accountId;
  const account2=(await (await fetch(base+'/session',{headers:{Cookie:renewed.cookie}})).json()).accountId;
  assert.equal(account1,account2);
  assert.equal((await post(`/runs/${runId}/finish`,renewed.cookie,finish)).status,200);
});

test('Desert and Ice progression, exact mastery retries, realm checkpoints, and boards survive API transactions',async()=>{
  const {cookie}=await launch();
  assert.equal((await post('/runs',cookie,{...config,level:'desert'})).status,400);
  const milestones=[['training',180000],['forest',300000],['desert',420000],['ice',540000]];
  for(const [level,durationMs] of milestones){
    const start=await post('/runs',cookie,{...config,level});assert.equal(start.status,201,level);
    const {runId}=await start.json();
    await pool.query('UPDATE artifact_leaderboards.runs SET started_at=now()-($2::int * interval \'1 millisecond\') WHERE id=$1',[runId,durationMs+2000]);
    const rows=monsters();
    if(level==='desert'){rows.deathwisp={encountered:2,kills:1,counterKills:1};rows.buraq={encountered:1,kills:0,counterKills:0};}
    if(level==='ice'){rows.chuul={encountered:1,kills:1,counterKills:1};rows.dogmole={encountered:1,kills:0,counterKills:0};}
    const kills=level==='desert'||level==='ice'?1:0;
    const progress={durationMs,kills,monsters:rows};
    if(level==='desert'){
      const badRows=monsters();badRows.chuul={encountered:1,kills:0,counterKills:0};
      assert.equal((await post(`/runs/${runId}/progress`,cookie,{...progress,monsters:badRows})).status,400);
    }
    const checkpoints=await Promise.all([post(`/runs/${runId}/progress`,cookie,progress),post(`/runs/${runId}/progress`,cookie,progress)]);
    assert.deepEqual(checkpoints.map(row=>row.status),[200,200]);
    const body={version:VERSION,character:'ranger',level,durationMs,stats:{kills,elites:0,bosses:0,chests:0,level:1},progress};
    assert.equal((await post(`/runs/${runId}/finish`,cookie,body)).status,200);
    assert.equal((await post(`/runs/${runId}/finish`,cookie,body)).status,200);
    const board=(await (await fetch(base+`/leaderboard?level=${level}`)).json()).entries;
    assert.ok(board.some(row=>row.level===level),level);
    if(level==='desert')assert.equal((await post('/runs',cookie,{...config,level:'ice'})).status,201);
  }
  const current=(await (await fetch(base+'/profile',{headers:{Cookie:cookie}})).json()).profile;
  assert.deepEqual(current.unlocked,['training','forest','desert','ice']);assert.equal(current.revision,4);
  assert.equal(current.monsters.deathwisp.counterKills,1);assert.equal(current.monsters.chuul.counterKills,1);
  const first=await post('/profile/mastery',cookie,{character:'ranger',skill:'vitality',rank:1,expectedRevision:4});assert.equal(first.status,200);
  const second=await post('/profile/mastery',cookie,{character:'ranger',skill:'vitality',rank:2,expectedRevision:5});assert.equal(second.status,200);
  assert.equal((await post('/profile/mastery',cookie,{character:'ranger',skill:'vitality',rank:2,expectedRevision:5})).status,200);
  assert.equal((await post('/profile/mastery',cookie,{character:'ranger',skill:'agility',rank:1,expectedRevision:5})).status,409);
  const after=(await (await fetch(base+'/profile',{headers:{Cookie:cookie}})).json()).profile;
  assert.equal(after.skills.ranger.vitality,2);assert.equal(after.revision,6);
  assert.ok((await (await fetch(base+'/leaderboard?level=all')).json()).entries.length>0);
});

test('an in-flight version 1 run finishes after the version 2 API rollout',async()=>{
  const {cookie}=await launch();const {runId}=await (await post('/runs',cookie,config)).json();
  const {rows:[run]}=await pool.query('SELECT player_id,session_hash FROM artifact_leaderboards.runs WHERE id=$1',[runId]);
  const legacyId=randomUUID();await pool.query(`INSERT INTO artifact_leaderboards.runs(id,player_id,session_hash,game,version,started_at)
    VALUES($1,$2,$3,$4,'1',now()-interval '20 seconds')`,[legacyId,run.player_id,run.session_hash,GAME]);
  const body={version:'1',character:'ranger',durationMs:15000,stats:{...finish.stats}};
  assert.equal((await post(`/runs/${legacyId}/finish`,cookie,body)).status,200);
  assert.equal((await post(`/runs/${legacyId}/finish`,cookie,body)).status,200);
  const board=(await (await fetch(base+'/leaderboard?level=legacy')).json()).entries;
  assert.ok(board.some(row=>row.score===415));
});

test('composed service keeps Cosmic API live with and without Raid secret',async()=>{
  const {createCombinedApp}=await import('../src/combined.js');
  const cosmicSecret='cosmic-test-secret-with-at-least-32-characters';
  for(const raidSecret of [secret,undefined]){
    const app=createCombinedApp({pool,origin,issuer,cosmicSecret,raidSecret,secure:false});
    const combined=app.listen(0,'127.0.0.1');await new Promise(resolve=>combined.once('listening',resolve));
    try{
      const url=`http://127.0.0.1:${combined.address().port}`;
      const cosmicBase=url+'/leaderboard-api/cosmic-carnival';
      assert.equal((await fetch(cosmicBase+'/leaderboard')).status,200);
      const jwt=await new SignJWT({typ:'portal_module_launch',moduleSlug:'cosmic-carnival',handle:'Cosmic'}).setProtectedHeader({alg:'HS256'}).setIssuer(issuer).setAudience('cosmic-carnival').setSubject('user:'+Math.floor(Math.random()*1e8)).setJti(randomUUID()).setIssuedAt().setExpirationTime('2m').sign(new TextEncoder().encode(cosmicSecret));
      const callback=await fetch(cosmicBase+'/callback?token='+encodeURIComponent(jwt),{redirect:'manual'});
      const cookie=callback.headers.get('set-cookie')?.split(';')[0];
      assert.equal(callback.status,303);
      assert.equal((await fetch(cosmicBase+'/session',{headers:{Cookie:cookie}})).status,200);
      assert.equal((await fetch(cosmicBase+'/runs',{method:'POST',headers:{Cookie:cookie,Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({version:'1'})})).status,201);
      const raidBoard=await fetch(url+'/leaderboard-api/raid-survivor/leaderboard');
      assert.equal(raidBoard.status,raidSecret?200:503);
    }finally{await new Promise(resolve=>combined.close(resolve));}
  }
});
