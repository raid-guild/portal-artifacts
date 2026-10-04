import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';

const result=await build({entryPoints:['src/game.ts'],bundle:true,platform:'node',format:'esm',write:false,absWorkingDir:process.cwd()});
const {Game,realmPacing,forestPacing,ENEMY_CAP}=await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
const tick=(g,count=1)=>{for(let i=0;i<count;i++)g.update(1/60);};
const realmTime=(realm,paced)=>paced*(realm==='desert'?420/300:540/300);
const quiet=(realm,paced=0)=>{const g=new Game('ranger',realm);g.enemies=[];g.slots=[];g.spawnClock=g.chestClock=-1000;g.player.invuln=1e9;g.elapsed=realmTime(realm,paced);g.bossWave=realmPacing(realm,g.elapsed).bossWave;return g;};
const place=(g,kind,distance=8)=>{const e=g.spawnEnemy(kind);e.x=g.player.x+distance;e.y=g.player.y;e.speed=0;e.specialCd=0;return e;};
const withRoll=(roll,fn)=>{const original=Math.random;Math.random=()=>roll;try{return fn();}finally{Math.random=original;}};

test('Desert and Ice get larger early hordes and return to native pacing by six minutes',()=>{
  for(const realm of ['desert','ice'])for(const seconds of [0,30,60,120,180,240,360]){
    const base=forestPacing(seconds*(realm==='desert'?300/420:300/540)),actual=realmPacing(realm,seconds);
    const extra=seconds<60?36+seconds*.4:seconds<180?60:Math.max(0,60*(360-seconds)/180);
    assert.equal(actual.target,base.target+Math.round(extra),`${realm} ${seconds}s target`);
    assert.ok(Math.abs(actual.interval-base.interval*(.65+.35*Math.max(0,Math.min(1,(seconds-180)/180))))<1e-12,`${realm} ${seconds}s interval`);
    assert.equal(actual.batch,seconds>=30?Math.max(2,base.batch):base.batch);
    for(const key of ['xornChance','xornCap','efreetiChance','efreetiCap','lunges','bossWave'])assert.equal(actual[key],base[key],`${realm} ${seconds}s ${key}`);
  }
  for(const realm of ['desert','ice'])for(const boundary of [60,180,360]){
    const before=realmPacing(realm,boundary-.001),after=realmPacing(realm,boundary+.001);
    assert.ok(Math.abs(before.interval-after.interval)<.001);
    assert.ok(Math.abs(before.target-after.target)<=1);
  }
  assert.deepEqual(realmPacing('forest',180),forestPacing(180));
  assert.equal(realmPacing('desert',126).lunges,1);
  assert.equal(realmPacing('ice',162).lunges,1);
  assert.equal(realmPacing('desert',252).xornChance,.03);
  assert.equal(realmPacing('ice',324).xornChance,.03);
  assert.equal(realmPacing('desert',294).efreetiChance,.01);
  assert.equal(realmPacing('ice',378).efreetiChance,.01);
  assert.equal(realmPacing('desert',336).bossWave,1);
  assert.equal(realmPacing('ice',432).bossWave,1);
});

test('new realms use normalized Forest population pacing and introduce large monsters slowly',()=>{
  for(const [realm,small,large] of [['desert','deathwisp','buraq'],['ice','chuul','dogmole']]){
    const initial=new Game('ranger',realm);assert.equal(initial.enemies.length,32);assert.ok(initial.enemies.every(e=>e.kind===small));
    const late=realmPacing(realm,realmTime(realm,300));assert.equal(late.target,450);assert.equal(late.batch,3);
    withRoll(.01,()=>assert.equal(quiet(realm,179.99).spawnEnemy().kind,'wisp'));
    withRoll(.01,()=>{
      const g=quiet(realm,180.01);assert.equal(g.spawnEnemy().kind,large);
      assert.notEqual(g.spawnEnemy().kind,large,'only one large foe before paced 240');
      g.enemies[0].hp=0;assert.equal(g.spawnEnemy().kind,large);
    });
    withRoll(.12,()=>assert.equal(quiet(realm,60).spawnEnemy().kind,'brute'));
    assert.equal(quiet(realm,0).spawnEnemy(small).damage,(realm==='desert'?9:8)*.65);
  }
});

test('ordinary ranged enemies follow actual-time thresholds and eight-second refill spacing',()=>{
  for(const realm of ['desert','ice']){
    const game=new Game('ranger',realm);game.enemies=[];
    const count=()=>game.enemies.filter(e=>e.hp>0&&e.kind==='cultist'&&!e.elite).length;
    for(const [time,want] of [[19.9,0],[20,1],[27,1],[28,1],[44,1],[45,2],[90,3],[150,4],[240,5],[247,5],[248,6]]){
      game.elapsed=time;game.scheduleShooters(ENEMY_CAP);assert.equal(count(),want,`${realm} ${time}s`);
    }
    assert.ok(game.enemies.every(e=>!e.elite&&e.special===null));
    game.enemies.find(e=>e.hp>0).hp=0;game.elapsed=256;game.scheduleShooters(ENEMY_CAP);assert.equal(count(),6,'dead shooters do not count');
  }
});

test('shooter admission at target safely replaces a distant idle basic without rewards',()=>{
  for(const realm of ['desert','ice']){
    const game=new Game('ranger',realm),small=realm==='desert'?'deathwisp':'chuul';game.elapsed=20;const original=game.enemies.length,score=game.score,kills=game.stats.kills;let events=0;game.onEvent=()=>events++;
    game.scheduleShooters(original);
    assert.equal(game.enemies.length,original);assert.equal(game.enemies.filter(e=>e.kind===small).length,original-1);assert.equal(game.enemies.filter(e=>e.kind==='cultist').length,1);
    assert.equal(game.score,score);assert.equal(game.stats.kills,kills);assert.equal(game.pickups.length,0);assert.equal(events,0);
    const protectedGame=new Game('ranger',realm);protectedGame.elapsed=20;for(const e of protectedGame.enemies)e.specialState='windup';protectedGame.scheduleShooters(protectedGame.enemies.length);
    assert.equal(protectedGame.enemies.length,original);assert.equal(protectedGame.enemies.filter(e=>e.kind==='cultist').length,0);
  }
  const full=new Game('ranger','ice');full.stress(ENEMY_CAP);full.elapsed=20;for(const enemy of full.enemies)enemy.specialState='windup';full.scheduleShooters(ENEMY_CAP);
  assert.equal(full.enemies.length,ENEMY_CAP);assert.equal(full.enemies.filter(e=>e.kind==='cultist').length,0);
});

test('ranged enemies fire before thirty actual seconds through clear approaches in both realms',()=>{
  for(const realm of ['desert','ice']){
    const game=new Game('ranger',realm);game.enemies=[];game.slots=[];game.spawnClock=game.chestClock=-1e6;game.player.invuln=1e6;game.elapsed=19.99;
    let emittedAt=Infinity;const emit=game.pushEnemyShot.bind(game);game.pushEnemyShot=shot=>{emittedAt=Math.min(emittedAt,game.elapsed);emit(shot);};
    withRoll(.25,()=>{for(let i=0;i<600&&emittedAt===Infinity;i++)game.update(1/60);});
    assert.ok(emittedAt<30,`${realm} first shot at ${emittedAt}`);
    assert.ok(game.enemies.some(e=>e.kind==='cultist'&&!e.elite&&e.special===null));
  }
});

test('first Moloch remains tier one in both longer realms and tiers follow waves',()=>{
  for(const realm of ['desert','ice']){
    for(const [paced,wave,tier] of [[240,1,1],[360,2,2],[600,4,3]]){
      const g=quiet(realm,paced-.05);g.bossWave=wave-1;g.endless=true;tick(g,6);
      const boss=g.enemies.find(e=>e.kind==='boss');assert.ok(boss,`${realm} wave ${wave}`);assert.equal(boss.tier,tier);
    }
  }
});

test('Deathwisp pounce and Chuul jaunt have time gates, locked targets, and recovery',()=>{
  const desert=quiet('desert',89.9),wisp=place(desert,'deathwisp',6);tick(desert);assert.equal(wisp.specialState,'idle');
  desert.elapsed=realmTime('desert',90);tick(desert);assert.equal(wisp.specialState,'windup');assert.equal(wisp.specialTimer,.9);
  const ice=quiet('ice',89.9),chuul=place(ice,'chuul',8);tick(ice);assert.equal(chuul.specialState,'idle');
  ice.elapsed=realmTime('ice',90);tick(ice);assert.equal(chuul.specialState,'windup');
  const target=[chuul.targetX,chuul.targetY],startX=chuul.x,health=ice.player.health;
  ice.player.y+=5;tick(ice,61);
  assert.deepEqual([chuul.targetX,chuul.targetY],target);assert.ok(chuul.x-startX<=3.001);assert.equal(ice.player.health,health);assert.equal(chuul.specialState,'recovery');
});

test('Buraq poison fan and Dogmole groundbreaker are warned, bounded, and cancel on death',()=>{
  const desert=quiet('desert',210),buraq=place(desert,'buraq');tick(desert);assert.equal(buraq.specialState,'windup');assert.equal(buraq.specialTimer,1.1);
  tick(desert,67);assert.equal(desert.enemyShots.length,5);assert.equal(buraq.specialState,'recovery');
  const ice=quiet('ice',210),dog=place(ice,'dogmole',6);tick(ice);assert.equal(dog.specialState,'windup');assert.equal(ice.hazards.length,1);assert.equal(ice.hazards[0].radius,2.2);
  ice.damage(dog,1e9,'thornbow');assert.equal(ice.hazards.length,0);
  const late=quiet('ice',300);for(let i=0;i<20;i++){const e=place(late,'dogmole',6);e.specialCd=0;}
  tick(late);assert.ok(late.hazards.length<=3);assert.ok(late.hazards.length<=12);
});

test('Noise bomb counter works for every hero, while Flames and Physical counters use explicit sources',()=>{
  for(const hero of ['ranger','wizard','dwarf']){
    const g=new Game(hero,'desert');g.enemies=[];g.slots=[];const enemy=g.spawnEnemy('buraq');enemy.x=g.player.x+2;enemy.y=g.player.y;enemy.hp=1;g.buildGrid();g.bombCharge=g.bombRecharge;assert.equal(g.bomb(),true);g.updateBomb(.4);
    assert.equal(g.monsters.buraq.kills,1,hero);assert.equal(g.monsters.buraq.counterKills,1,hero);
  }
  const ice=quiet('ice');ice.runes.flames=true;const chuul=place(ice,'chuul');ice.damage(chuul,1e9,'comet');assert.equal(ice.monsters.chuul.counterKills,1);
  const dog=place(ice,'dogmole');ice.damage(dog,1e9,'arcwand');assert.equal(ice.monsters.dogmole.counterKills,0);
  const physical=place(ice,'dogmole');ice.damage(physical,1e9,'orbit');assert.equal(ice.monsters.dogmole.counterKills,1);
  const desert=quiet('desert');desert.runes.light=true;const wisp=place(desert,'deathwisp');desert.damage(wisp,1e9,'chain');assert.equal(desert.monsters.deathwisp.counterKills,1);
});

test('new realm stress capacity remains bounded',()=>{
  const game=quiet('ice');game.stress(ENEMY_CAP+100);assert.equal(game.enemies.length,ENEMY_CAP);assert.ok(game.enemies.every(e=>e.kind==='chuul'));
});
