import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';

const result = await build({ entryPoints:['src/game.ts'], bundle:true, platform:'node', format:'esm', write:false, absWorkingDir:process.cwd() });
const { Game, forestPacing } = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
const tick = (g, count=1) => { for(let i=0;i<count;i++)g.update(1/60); };
const quiet = (seconds=0) => {
  const g=new Game('ranger','forest');g.enemies=[];g.slots=[];
  g.spawnClock=g.chestClock=-1000;g.player.invuln=1e9;
  g.elapsed=seconds;g.bossWave=forestPacing(seconds).bossWave;
  return g;
};
const place = (g,kind,elite=false) => {
  const e=g.spawnEnemy(kind,elite);e.x=g.player.x+8;e.y=g.player.y;
  e.speed=0;e.specialCd=0;return e;
};
const withRoll = (roll, fn) => {const random=Math.random;Math.random=()=>roll;try{return fn();}finally{Math.random=random;}};
const lunging = e => ['pouncer','stalker','juggernaut'].includes(e.special)&&['windup','charge'].includes(e.specialState);

test('Forest starts with twelve basic enemies and gentler captured damage',()=>{
  const g=new Game('ranger','forest');
  assert.equal(g.enemies.length,12);assert.ok(g.enemies.every(e=>e.kind==='rageipede'&&!e.elite));
  const early=g.enemies[0];assert.equal(early.damage,9*.65);
  g.elapsed=180;assert.equal(g.spawnEnemy('rageipede').damage,9);
  assert.equal(early.damage,9*.65,'existing enemies retain their opening damage');
  withRoll(.001,()=>assert.equal(quiet(59).spawnEnemy().kind,'wisp'));
  withRoll(.06,()=>assert.equal(quiet(59).spawnEnemy().kind,'rageipede'));
  withRoll(.12,()=>assert.equal(quiet(60).spawnEnemy().kind,'brute'));
  withRoll(.9,()=>{
    assert.equal(quiet(119).spawnEnemy(undefined,true).elite,false);
    assert.equal(quiet(120).spawnEnemy(undefined,true).elite,true);
  });
});

test('rare monsters arrive in stages, respect live caps, and fall back to Rageipedes',()=>{
  for(const [kind,roll,before,stages] of [
    ['xorn',.015,119.99,[[120,2],[180,4],[240,6]]],
    ['efreeti',.001,209.99,[[210,1],[270,2],[300,3]]],
  ])withRoll(roll,()=>{
    assert.notEqual(quiet(before).spawnEnemy().kind,kind);
    for(const [seconds,cap] of stages){
      const g=quiet(seconds);
      for(let i=0;i<cap;i++){const e=g.spawnEnemy(undefined,true);assert.equal(e.kind,kind);assert.equal(e.elite,false);}
      assert.equal(g.spawnEnemy().kind,'rageipede');
      g.enemies[0].hp=0;assert.equal(g.spawnEnemy().kind,kind,'dead monster frees its slot');
    }
  });
});

test('early survivors learn attacks only at their time gates',()=>{
  for(const [kind,elite,unlock,warning] of [['rageipede',false,90,.9],['xorn',false,150,1.1],['brute',true,240,.9]]){
    const g=quiet(),e=place(g,kind,elite);
    const hp=e.maxHp;
    g.elapsed=unlock-.1;g.bossWave=forestPacing(unlock).bossWave;
    tick(g);assert.equal(e.specialState,'idle',kind);
    g.elapsed=unlock;tick(g);assert.equal(e.specialState,'windup',kind);
    assert.equal(e.specialTimer,warning);assert.equal(e.maxHp,hp,'unlock does not inflate existing HP');
  }
  const early=quiet(60),ordinary=early.spawnEnemy('brute'),guardian=early.spawnEnemy('brute',true);
  assert.equal(guardian.maxHp,ordinary.maxHp*3);
  const late=quiet(240);assert.equal(late.spawnEnemy('brute',true).maxHp,late.spawnEnemy('brute').maxHp*18);
});

test('all lunge kinds share a small concurrency budget and stagger attack starts',()=>{
  for(const [seconds,cap] of [[30,0],[90,1],[150,1],[180,2],[240,2],[300,3]]){
    const g=quiet(seconds);
    for(let i=0;i<12;i++)for(const kind of ['rageipede','xorn','brute'])place(g,kind,kind==='brute');
    let peak=0,lastStart=-Infinity;
    for(let i=0;i<240;i++){
      const previous=new Set(g.enemies.filter(lunging).map(e=>e.id));
      tick(g);
      const active=g.enemies.filter(lunging),starts=active.filter(e=>!previous.has(e.id));
      assert.ok(active.length<=cap,`${seconds}s cap`);assert.ok(starts.length<=1);
      if(starts.length){assert.ok(g.elapsed-lastStart>=.4-1e-9);lastStart=g.elapsed;}
      peak=Math.max(peak,active.length);
    }
    assert.equal(peak,cap);
    const sample=g.enemies.find(lunging);
    if(sample){const timer=sample.specialTimer;g.die();tick(g);assert.equal(sample.specialTimer,timer);}
  }
});

test('Forest lunges lock targets, allow dodging, and apply captured damage once',()=>{
  for(const [kind,unlock,warning,duration,baseDamage] of [['rageipede',90,.9,.35,12],['xorn',150,1.1,.42,21]]){
    for(const dodge of [true,false]){
      const g=quiet(),e=place(g,kind);e.x=g.player.x+4;
      g.elapsed=unlock;g.player.invuln=0;tick(g);
      const target=[e.targetX,e.targetY];if(dodge)g.player.y+=7;
      tick(g,Math.ceil((warning+duration+.1)*60));
      assert.deepEqual([e.targetX,e.targetY],target);
      assert.equal(g.player.health,g.player.maxHealth-(dodge?0:baseDamage*.65));
      assert.equal(e.specialState,'recovery');
    }
  }
});

test('regular arrivals stay within the slower target and batch limits',()=>{
  for(const [seconds,target,batch] of [[60,114,1],[180,282,2],[300,450,3]]){
    const g=quiet(seconds);g.spawnClock=1;tick(g);
    assert.equal(g.enemies.length,batch);
    g.enemies=[];
    for(let i=0;i<target-1;i++)g.spawnEnemy('rageipede');
    g.spawnClock=1;tick(g);assert.equal(g.enemies.length,target);
    g.spawnClock=1;tick(g);assert.equal(g.enemies.length,target);
  }
  const g=quiet();g.spawnClock=.45;tick(g);assert.equal(g.enemies.length,0);
  tick(g,3);assert.equal(g.enemies.length,1);
});

test('guardians arrive once per minute with a two-guardian cap',()=>{
  const g=quiet();g.elapsed=59.9;g.chestClock=59.9;tick(g,5);assert.equal(g.enemies.length,0);
  tick(g,2);assert.equal(g.enemies.length,1);
  g.chestClock=60;tick(g);assert.equal(g.enemies.length,2);
  g.chestClock=60;tick(g);assert.equal(g.enemies.length,2);
  assert.ok(g.enemies.every(e=>e.kind==='brute'&&e.elite));
  g.enemies[0].hp=0;g.chestClock=60;tick(g);assert.equal(g.enemies.length,2);
});

test('Forest Moloch arrives at four minutes then six; Training remains at ninety seconds',()=>{
  for(const [level,seconds,previousWave,tier] of [['forest',240,0,1],['forest',360,1,2],['training',90,0,1]]){
    const g=quiet();g.level=level;g.elapsed=seconds-.05;g.bossWave=previousWave;
    tick(g);assert.equal(g.enemies.filter(e=>e.kind==='boss').length,0);
    tick(g,3);const bosses=g.enemies.filter(e=>e.kind==='boss');
    assert.equal(bosses.length,1);assert.equal(bosses[0].tier,tier);
  }
});
