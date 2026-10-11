import {test} from 'node:test';import assert from 'node:assert/strict';import {createNeonApp,GAME,VERSION} from '../src/neon-app.js';import {createCombinedApp} from '../src/combined.js';
import pg from 'pg';import {readFile} from 'node:fs/promises';import {SignJWT} from 'jose';import {randomUUID} from 'node:crypto';
const secret='neon-test-secret-with-at-least-32-characters',origin='http://localhost:5173',issuer='https://portal.example.test';
async function listening(app){const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));return {server,base:`http://127.0.0.1:${server.address().port}/leaderboard-api/neon-drop`};}
test('disabled Neon is isolated; writes require exact origin; invalid launch rejected',async()=>{
 const pool={query(){throw new Error('database should not be used');}};
 const {server,base}=await listening(createCombinedApp({pool,origin,issuer,cosmicSecret:secret}));try{assert.equal((await fetch(base+'/session')).status,503);}finally{await new Promise(r=>server.close(r));}
 const running=await listening(createNeonApp({pool,origin,issuer,launchSecret:secret,secure:false}));try{assert.equal((await fetch(running.base+'/session')).status,401);assert.equal((await fetch(running.base+'/runs',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://evil.test'},body:'{}'})).status,403);const invalid=await fetch(running.base+'/callback?token=invalid',{redirect:'manual'});assert.equal(invalid.status,303);assert.equal(invalid.headers.get('location'),origin+'/neon-drop/?ranked=launch-failed');}finally{await new Promise(r=>running.server.close(r));}
});
const database=process.env.TEST_DATABASE_URL;
test('signed launch, replay, ownership, scoring and exact retries with local database',{skip:!database},async()=>{
 const url=new URL(database);assert.ok(['localhost','127.0.0.1'].includes(url.hostname)&&url.pathname.endsWith('_test'),'disposable local *_test database required');
 const pool=new pg.Pool({connectionString:database});await pool.query(await readFile(new URL('../schema.sql',import.meta.url),'utf8'));
 const {server,base}=await listening(createNeonApp({pool,origin,issuer,launchSecret:secret,secure:false}));
 const jwt=await new SignJWT({typ:'portal_module_launch',moduleSlug:GAME,handle:'Neon Test'}).setProtectedHeader({alg:'HS256'}).setIssuer(issuer).setAudience(GAME).setSubject('user:99999991').setJti(randomUUID()).setIssuedAt().setExpirationTime('2m').sign(new TextEncoder().encode(secret));
 const post=(path,cookie,body)=>fetch(base+path,{method:'POST',headers:{Origin:origin,Cookie:cookie,'Content-Type':'application/json'},body:JSON.stringify(body)});
 try{const launch=await fetch(base+'/callback?token='+encodeURIComponent(jwt),{redirect:'manual'});const cookie=launch.headers.get('set-cookie').split(';')[0];assert.equal(launch.headers.get('location'),origin+'/neon-drop/');assert.match(launch.headers.get('set-cookie'),/HttpOnly/);
 const replay=await fetch(base+'/callback?token='+encodeURIComponent(jwt),{redirect:'manual'});assert.match(replay.headers.get('location'),/launch-failed/);
 assert.equal((await fetch(base+'/session',{headers:{Cookie:cookie}})).status,200);const start=await post('/runs',cookie,{version:VERSION});assert.equal(start.status,201);const {runId}=await start.json();await pool.query("UPDATE artifact_leaderboards.runs SET started_at=now()-interval '60 seconds' WHERE id=$1",[runId]);
 const body={version:VERSION,outcomes:Array(12).fill('outer-0'),durationMs:30000};assert.equal((await post('/runs/'+runId+'/finish',cookie,{...body,outcomes:['outer-0']})).status,400);const finish=await post('/runs/'+runId+'/finish',cookie,body);assert.equal(finish.status,200);assert.equal((await finish.json()).score,120);assert.equal((await post('/runs/'+runId+'/finish',cookie,body)).status,200);assert.equal((await post('/runs/'+runId+'/finish',cookie,{...body,durationMs:30001})).status,409);
 const board=await (await fetch(base+'/leaderboard')).json();assert.ok(board.entries.some(e=>e.displayName==='Neon Test'&&e.score===120));
 }finally{await new Promise(r=>server.close(r));await pool.end();}
});
