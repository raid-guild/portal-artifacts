import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';

const compiled=await build({entryPoints:['src/game.ts'],bundle:true,platform:'node',format:'esm',write:false,absWorkingDir:process.cwd()});
const {Game,MONSTER_KINDS,ENEMY_CAP,MAX_HAZARDS,MAX_ENEMY_SHOTS}=await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString('base64')}`);
const quiet=()=>{const g=new Game('ranger','lava');g.enemies=[];g.slots=[];g.spawnClock=g.chestClock=-1e9;g.player.invuln=1e9;g.lavaBossAdmitted=999;return g;};
const tick=(g,count=1)=>{for(let i=0;i<count;i++)g.update(1/60);};
const place=(g,kind,x=g.player.x+6,y=g.player.y)=>{const e=g.spawnEnemy(kind);assert.ok(e);e.x=x;e.y=y;e.speed=0;e.damage=0;e.hp=e.maxHp=1e8;e.specialCd=0;e.attackCd=1e8;g.buildGrid();return e;};
const withRoll=(roll,fn)=>{const original=Math.random;Math.random=()=>roll;try{return fn();}finally{Math.random=original;}};

test('Lava opening is Tosculi led; native base stats, gates and live caps are exact',()=>{
  const initial=new Game('ranger','lava');assert.equal(initial.enemies.length,32);assert.equal(initial.enemies.filter(e=>e.kind==='tosculi').length,28);
  for(const kind of ['tosculi','seahag','hezrou'])assert.ok(MONSTER_KINDS.includes(kind));
  const base=quiet(),tos=base.spawnEnemy('tosculi'),sea=base.spawnEnemy('seahag'),hez=base.spawnEnemy('hezrou');
  assert.deepEqual([tos.maxHp,tos.speed,tos.damage,tos.radius],[13,4.1,7,.36]);
  assert.deepEqual([sea.maxHp,sea.speed,sea.damage,sea.radius],[100,2.1,11,.7]);
  assert.deepEqual([hez.maxHp,hez.speed,hez.damage,hez.radius],[360,1.55,18,1.2]);
  withRoll(0,()=>{const g=quiet();g.elapsed=44.9;assert.notEqual(g.spawnEnemy().kind,'seahag');g.elapsed=45;assert.equal(g.spawnEnemy().kind,'seahag');assert.equal(g.spawnEnemy().kind,'seahag');assert.notEqual(g.spawnEnemy().kind,'seahag');});
  withRoll(0,()=>{const g=quiet();g.elapsed=179.9;assert.notEqual(g.spawnEnemy().kind,'hezrou');g.elapsed=180;assert.equal(g.spawnEnemy().kind,'hezrou');assert.notEqual(g.spawnEnemy().kind,'hezrou');g.elapsed=360;assert.equal(g.spawnEnemy().kind,'hezrou');g.elapsed=540;assert.equal(g.spawnEnemy().kind,'hezrou');assert.notEqual(g.spawnEnemy().kind,'hezrou');});
});

test('Sea Hag locks a one-second alternating five-shot fan and Frost cancels its warning',()=>{
  const g=quiet(),sea=place(g,'seahag',g.player.x+6,g.player.y);g.elapsed=44.9;tick(g);assert.equal(sea.specialState,'idle');
  g.elapsed=45;tick(g);assert.equal(sea.specialState,'windup');assert.equal(sea.specialTimer,1);assert.equal(sea.targetY,90);
  g.player.y+=3;tick(g,61);assert.equal(sea.specialState,'recovery');assert.equal(g.enemyShots.length,5);assert.ok(g.enemyShots.every(s=>s.seaHag==='green'&&s.life<=2.5&&s.damage===8));
  assert.ok(Math.abs(g.enemyShots[2].vy)<.001,'middle shot retains the original locked target');
  sea.specialState='idle';sea.specialCd=0;g.player.y=90;g.enemyShots=[];tick(g);tick(g,61);
  assert.equal(g.enemyShots.length,5);assert.ok(g.enemyShots.every(s=>s.seaHag==='amber'));
  g.enemyShots=[];sea.specialState='windup';sea.specialTimer=.8;sea.freezeImmune=0;g.runes.freeze=true;g.damage(sea,1,'arcwand');
  assert.equal(sea.specialState,'recovery');assert.equal(sea.frozen,.5);tick(g,30);assert.equal(g.enemyShots.length,0,'interrupted fan emits no shots during freeze');
});

test('Hezrou lane warns independently of cosmetic FX, hits once only on locked capsule, and cancels on death',()=>{
  const hit=quiet(),hez=place(hit,'hezrou',hit.player.x-8,hit.player.y);hit.elapsed=180;hit.player.invuln=0;
  hit.effects=Array.from({length:360},()=>({x:0,y:0,kind:'ring',life:10,max:10,color:0,size:1}));
  tick(hit);assert.equal(hez.specialState,'windup');assert.equal(hit.hazards.length,1);assert.equal(hit.hazards[0].kind,'lane');assert.equal(hit.hazards[0].radius,1);assert.ok(Math.abs(hit.hazards[0].x2-hit.hazards[0].x-9)<1e-9);
  tick(hit,70);assert.equal(hit.hazards.length,0);assert.equal(hit.player.maxHealth-hit.player.health,18);
  const dodge=quiet(),d=place(dodge,'hezrou',dodge.player.x-8,dodge.player.y);dodge.elapsed=180;dodge.player.invuln=0;tick(dodge);dodge.player.y+=3;tick(dodge,70);assert.equal(dodge.player.health,dodge.player.maxHealth);
  const cancel=quiet(),c=place(cancel,'hezrou',cancel.player.x-8,cancel.player.y);cancel.elapsed=180;tick(cancel);assert.equal(cancel.hazards.length,1);cancel.damage(c,1e9,'bomb');assert.equal(cancel.hazards.length,0);tick(cancel,70);assert.equal(cancel.player.health,cancel.player.maxHealth);
  const capped=quiet();capped.elapsed=180;for(let i=0;i<3;i++)place(capped,'hezrou',capped.player.x-8,capped.player.y+i*.8);tick(capped);assert.equal(capped.hazards.filter(h=>h.kind==='lane').length,2);assert.ok(capped.hazards.length<=MAX_HAZARDS);
});

test('Lava Frost and Dawn counters record kills against canonical native IDs',()=>{
  const g=quiet();g.runes.freeze=true;g.runes.light=true;
  for(const kind of ['tosculi','seahag','hezrou']){const e=g.spawnEnemy(kind);e.hp=1;g.damage(e,1,kind==='hezrou'?'thornbow':'arcwand');assert.equal(g.monsters[kind].kills,1);assert.equal(g.monsters[kind].counterKills,1);}
  assert.equal(g.stats.kills,3);
});

test('Lava Moloch admissions follow shared waves, preserve HP ratio at 660, and cap group escorts',()=>{
  const g=quiet();g.lavaBossAdmitted=0;g.player.invuln=1e9;
  g.elapsed=299.9;g.updateLavaBosses();assert.equal(g.enemies.length,0);
  g.elapsed=300;g.updateLavaBosses();let bosses=g.enemies.filter(e=>e.kind==='boss');assert.equal(bosses.length,1);assert.equal(bosses[0].tier,1);assert.equal(g.bossWave,1);
  g.elapsed=480;g.updateLavaBosses();bosses=g.enemies.filter(e=>e.kind==='boss');assert.equal(bosses.length,2);assert.equal(bosses[1].tier,2);assert.ok(bosses[1].attackCd-bosses[0].attackCd>=.8-1e-9);
  g.elapsed=600;g.updateLavaBosses();assert.equal(g.enemies.filter(e=>e.kind==='boss').length,2,'wave three does not invent a third living boss');
  bosses[0].hp=bosses[0].maxHp*.4;g.elapsed=660;g.updateLavaBosses();bosses=g.enemies.filter(e=>e.kind==='boss');assert.equal(bosses.length,3);assert.ok(bosses.every(e=>e.tier===3));assert.ok(Math.abs(bosses[0].hp/bosses[0].maxHp-.4)<1e-9);
  assert.ok(g.enemies.filter(e=>e.elite&&e.kind==='brute').length<=2,'group escort budget is shared');
  g.updateLavaBosses();assert.equal(g.enemies.filter(e=>e.kind==='boss').length,3,'same wave cannot add a fourth');
  g.endless=true;bosses[2].hp=0;g.elapsed=780;g.updateLavaBosses();assert.equal(g.enemies.filter(e=>e.kind==='boss'&&e.hp>0).length,3);
  assert.ok(g.lavaBossAdmitted<=11);
});

test('fresh 11:00 and endless boss replacements share a two-escort budget across classes',()=>{
  const g=quiet();g.lavaBossAdmitted=0;g.elapsed=660;
  for(let i=0;i<3;i++){g.updateLavaBosses();g.elapsed+=.81;}
  assert.equal(g.enemies.filter(e=>e.kind==='boss'&&e.hp>0).length,3);
  const escorts=()=>g.enemies.filter(e=>e.hp>0&&e.bossEscort);
  assert.equal(escorts().length,2);
  assert.deepEqual(escorts().map(e=>e.kind).sort(),['brute','cultist']);
  g.enemies.find(e=>e.kind==='boss').hp=0;
  g.elapsed=780;g.updateLavaBosses();
  assert.equal(g.enemies.filter(e=>e.kind==='boss'&&e.hp>0).length,3);
  assert.equal(escorts().length,2,'replacement boss cannot add a third escort');
});

test('full population admits a boss without fake kills or loot; shot/hazard/boss pools remain bounded',()=>{
  const g=quiet();g.enemies=[];g.stress(ENEMY_CAP);g.lavaBossAdmitted=0;g.elapsed=300;
  const score=g.score,kills=g.stats.kills,pickups=g.pickups.length;g.updateLavaBosses();
  assert.equal(g.enemies.length,ENEMY_CAP);assert.equal(g.enemies.filter(e=>e.kind==='boss').length,1);
  assert.equal(g.score,score);assert.equal(g.stats.kills,kills);assert.equal(g.pickups.length,pickups);
  assert.ok(g.enemyShots.length<=MAX_ENEMY_SHOTS);assert.ok(g.hazards.length<=MAX_HAZARDS);
  const other=new Game('ranger','ice');other.enemies=[];other.slots=[];other.spawnClock=other.chestClock=-1e9;other.player.invuln=1e9;other.elapsed=432-.01;tick(other);assert.equal(other.enemies.filter(e=>e.kind==='boss').length,1,'other realm boss timing remains native');
});
