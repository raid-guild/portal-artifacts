import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import pg from 'pg';
import { SignJWT } from 'jose';
import { randomUUID } from 'node:crypto';
import { createRaidApp, GAME, VERSION } from '../src/raid-app.js';
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
  await pool.query('TRUNCATE artifact_leaderboards.runs, artifact_leaderboards.sessions, artifact_leaderboards.players, artifact_leaderboards.launches RESTART IDENTITY');
  server=createRaidApp({pool,origin,issuer,launchSecret:secret,secure:false}).listen(0,'127.0.0.1');
  await new Promise(resolve=>server.once('listening',resolve));base=`http://127.0.0.1:${server.address().port}/leaderboard-api/${GAME}`;
});
after(async()=>{await new Promise(resolve=>server.close(resolve));await pool.end();});
async function token(overrides={},key=secret){return new SignJWT({typ:'portal_module_launch',moduleSlug:GAME,handle:'Raider',...overrides}).setProtectedHeader({alg:'HS256'}).setIssuer(issuer).setAudience(GAME).setSubject('user:'+Math.floor(Math.random()*1e8)).setJti(randomUUID()).setIssuedAt().setExpirationTime('2m').sign(new TextEncoder().encode(key));}
async function launch(value){const response=await fetch(`${base}/callback?token=${encodeURIComponent(value??await token())}`,{redirect:'manual'});return {response,cookie:response.headers.get('set-cookie')?.split(';')[0]};}
async function post(path,cookie,body,requestOrigin=origin){return fetch(base+path,{method:'POST',headers:{Cookie:cookie||'',Origin:requestOrigin,'Content-Type':'application/json'},body:JSON.stringify(body)});}
const finish={version:VERSION,character:'ranger',durationMs:15000,stats:{kills:12,elites:1,bosses:0,chests:1,level:3}};
test('Raid guest leaderboard, session cookie, replay and invalid launch',async()=>{
  assert.equal((await fetch(base+'/leaderboard')).status,200);
  assert.equal((await post('/runs',null,{version:VERSION})).status,401);
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
  assert.equal((await post('/runs',cookie,{version:VERSION},'https://evil.example')).status,403);
  assert.equal((await post('/runs','cosmic_ranked='+cookie.split('=')[1],{version:VERSION})).status,401);
  const {runId}=await (await post('/runs',cookie,{version:VERSION})).json();
  const other=await launch();assert.equal((await post(`/runs/${runId}/finish`,other.cookie,finish)).status,404);
  await pool.query("UPDATE artifact_leaderboards.runs SET started_at=now()-interval '20 seconds' WHERE id=$1",[runId]);
  assert.equal((await post(`/runs/${runId}/finish`,cookie,{...finish,stats:{...finish.stats,kills:99999}})).status,400);
  const results=await Promise.all([post(`/runs/${runId}/finish`,cookie,finish),post(`/runs/${runId}/finish`,cookie,finish)]);
  assert.deepEqual(results.map(r=>r.status),[200,200]);
  assert.equal((await post(`/runs/${runId}/finish`,cookie,{...finish,character:'dwarf'})).status,409);
  const {rows:[run]}=await pool.query('SELECT score,wave,details FROM artifact_leaderboards.runs WHERE id=$1',[runId]);
  assert.equal(run.score,415);assert.equal(run.wave,null);assert.deepEqual(run.details,{character:'ranger',...finish.stats});
  const board=await (await fetch(base+'/leaderboard')).json();
  assert.deepEqual(Object.keys(board.entries[0]).sort(),['character','displayName','durationMs','kills','score']);
  assert.equal(board.entries[0].score,415);
});
test('Raid best score per player, expiry and game-scoped start limit',async()=>{
  const {cookie}=await launch();const first=await (await post('/runs',cookie,{version:VERSION})).json();
  await pool.query("UPDATE artifact_leaderboards.runs SET started_at=now()-interval '3 hours' WHERE id=$1",[first.runId]);
  assert.equal((await post(`/runs/${first.runId}/finish`,cookie,finish)).status,410);
  for(let i=0;i<60;i++)assert.equal((await post('/runs',cookie,{version:VERSION})).status,201);
  assert.equal((await post('/runs',cookie,{version:VERSION})).status,429);
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
