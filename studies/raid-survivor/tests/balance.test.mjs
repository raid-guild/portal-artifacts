import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
const result = await build({ entryPoints:['src/game.ts'], bundle:true, platform:'node', format:'esm', write:false, absWorkingDir:process.cwd() });
const { Game, ENEMY_CAP, MAX_HAZARDS, MAX_ENEMY_SHOTS, chargeCapsule, pointInCapsule } = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
const tick = (game, count=1) => { for(let i=0;i<count;i++)game.update(1/60); };
const quiet = game => {game.enemies=[];game.slots=[];game.spawnClock=-1000;game.chestClock=-1000;game.nextShooterScan=Infinity;};

test('opening has eighteen enemies, slower spawning and spawn-time damage ramp',()=>{
  const g=new Game('ranger');assert.equal(g.enemies.length,18);
  quiet(g);assert.equal(g.spawnEnemy('rat').damage,8*.85);
  quiet(g);g.spawnClock=.14;tick(g);assert.equal(g.enemies.length,0);
  tick(g);assert.equal(g.enemies.length,1);
  const opening=g.enemies[0], earlyDamage=opening.damage;
  g.elapsed=60;const mature=g.spawnEnemy('rat');assert.equal(mature.damage,8);
  assert.equal(opening.damage,earlyDamage,'old enemies retain spawn-time damage');
});
test('ordinary enemies close for contact and cultists hold useful firing distance',()=>{
  const g=new Game('ranger');quiet(g);g.player.invuln=0;
  const rat=g.spawnEnemy('rat');rat.x=g.player.x+2;rat.y=g.player.y;rat.speed=4;g.spawnClock=-1000;
  tick(g,20);assert.ok(g.player.health<g.player.maxHealth,'rat reaches contact');
  quiet(g);const cultist=g.spawnEnemy('cultist');cultist.x=g.player.x+10;cultist.y=g.player.y;cultist.attackCd=100;
  const start=cultist.x;tick(g,90);assert.ok(cultist.x<start-2);assert.ok(cultist.x>=g.player.x+5);
});
test('Juggernaut locks a dodgeable charge lane, hits once, and recovers',()=>{
  const dodge=new Game('ranger');const jug=dodge.demoEncounter('juggernaut');
  assert.equal(jug.special,'juggernaut');assert.ok(jug.maxHp>600);
  dodge.player.invuln=0;dodge.advanceDemo(.1);assert.equal(jug.specialState,'windup');
  const target={x:jug.targetX,y:jug.targetY};dodge.player.y+=7;dodge.advanceDemo(1.6);
  assert.deepEqual({x:jug.targetX,y:jug.targetY},target);assert.equal(dodge.player.health,dodge.player.maxHealth);
  const hit=new Game('ranger');const attacker=hit.demoEncounter('juggernaut');hit.player.invuln=0;hit.advanceDemo(1.55);
  assert.equal(hit.player.health,hit.player.maxHealth-24);assert.equal(attacker.specialState,'recovery');
});
test('Juggernaut warning matches the full swept capsule and rejects bomb knockback while locked',()=>{
  const g=new Game('dwarf');const jug=g.demoEncounter('juggernaut');g.advanceDemo(.1);
  const start={x:jug.x,y:jug.y},lane=chargeCapsule(jug);
  assert.ok(Math.abs(Math.hypot(lane.x2-lane.x1,lane.y2-lane.y1)-7.7)<1e-9);
  assert.equal(lane.radius,jug.radius+.55);
  const ux=(lane.x2-lane.x1)/7.7,uy=(lane.y2-lane.y1)/7.7;
  const endcapInside={x:lane.x2+ux*lane.radius*.9,y:lane.y2+uy*lane.radius*.9};
  const endcapOutside={x:lane.x2+ux*lane.radius*1.1,y:lane.y2+uy*lane.radius*1.1};
  assert.ok(pointInCapsule(endcapInside.x,endcapInside.y,lane.x1,lane.y1,lane.x2,lane.y2,lane.radius));
  assert.ok(!pointInCapsule(endcapOutside.x,endcapOutside.y,lane.x1,lane.y1,lane.x2,lane.y2,lane.radius));
  g.paused=false;g.bombCharge=g.bombRecharge;assert.equal(g.bomb(),true);g.paused=true;
  g.advanceDemo(.7);assert.equal(jug.specialState,'windup');assert.deepEqual({x:jug.x,y:jug.y},start);
  assert.equal(jug.knockX,0);
  g.advanceDemo(.2);assert.equal(jug.specialState,'charge');
  jug.knockX=20;jug.knockY=9;
  const before={x:jug.x,y:jug.y};g.advanceDemo(1/60);
  assert.ok(Math.abs(jug.x-before.x-jug.chargeX*14/60)<1e-6);
  assert.ok(Math.abs(jug.y-before.y-jug.chargeY*14/60)<1e-6);
  assert.equal(jug.knockX,0);assert.equal(jug.knockY,0);
});
test('Hexcaster and Moloch marks lock position, detonate after warning, and cancel on death',()=>{
  const hex=new Game('ranger');const caster=hex.demoEncounter('hexcaster');hex.player.invuln=0;hex.advanceDemo(.1);
  assert.equal(hex.hazards.length,1);const fixed={x:hex.hazards[0].x,y:hex.hazards[0].y};
  hex.player.y+=5;hex.advanceDemo(1.3);assert.equal(hex.player.health,hex.player.maxHealth);
  assert.deepEqual(fixed,{x:hex.player.x,y:hex.player.y-5});
  const cancel=new Game('ranger');const deadCaster=cancel.demoEncounter('hexcaster');cancel.advanceDemo(.1);
  assert.equal(cancel.hazards.length,1);cancel.damage(deadCaster,1e9,'thornbow');assert.equal(cancel.hazards.length,0);
  for(const [kind,count] of [['ascended',3],['unbound',5]]){
    const g=new Game('ranger');const boss=g.demoEncounter(kind);g.advanceDemo(.1);
    assert.equal(g.hazards.length,count);assert.equal(boss.bossCastTimer>0,true);
    g.damage(boss,1e9,'thornbow');assert.equal(g.hazards.length,0);
  }
});
test('gameplay warnings survive a saturated cosmetic pool and all pools stay bounded',()=>{
  const g=new Game('ranger');g.demoEncounter('hexcaster');g.player.invuln=0;
  g.effects=Array.from({length:360},()=>({x:0,y:0,kind:'hit',life:2,max:2,color:0,size:1}));
  g.advanceDemo(.1);assert.equal(g.hazards.length,1);
  g.advanceDemo(1.2);assert.equal(g.player.health,g.player.maxHealth-18);
  const crowded=new Game('ranger');crowded.stress(ENEMY_CAP);crowded.player.invuln=1e9;
  crowded.enemyShots=Array.from({length:MAX_ENEMY_SHOTS},()=>({x:0,y:0,vx:0,vy:0,life:3,damage:0,radius:.1,boss:false}));
  tick(crowded,60);assert.ok(crowded.enemies.length<=ENEMY_CAP);assert.ok(crowded.enemyShots.length<=MAX_ENEMY_SHOTS);assert.ok(crowded.hazards.length<=MAX_HAZARDS);
});
test('boss tiers, escort budget, full-cap admission, and render cap',()=>{
  const early=new Game('ranger');quiet(early);early.elapsed=359;assert.equal(early.spawnEnemy('boss').tier,1);
  const ascended=new Game('ranger');quiet(ascended);ascended.elapsed=360;const second=ascended.spawnEnemy('boss');assert.equal(second.tier,2);assert.equal(second.speed,1.9);
  const unbound=new Game('ranger');quiet(unbound);unbound.elapsed=540;const third=unbound.spawnEnemy('boss');assert.equal(third.tier,3);assert.equal(third.speed,2.1);assert.ok(third.maxHp>second.maxHp);
  const budget=new Game('ranger');quiet(budget);budget.elapsed=359.99;budget.bossWave=3;budget.spawnClock=2;budget.player.invuln=1e9;
  const random=Math.random;Math.random=()=>.5;
  try{tick(budget);}finally{Math.random=random;}
  assert.equal(budget.enemies.length,9);assert.equal(budget.enemies.filter(e=>e.elite).length,2);assert.equal(budget.escortDebt,0);
  for(const [time,wave,tier,escortCount] of [[359.99,3,2,2],[539.99,5,3,4]]){
    const full=new Game('ranger');full.stress(ENEMY_CAP);full.elapsed=time;full.bossWave=wave;full.player.invuln=1e9;full.nextShooterScan=Infinity;
    const kills=full.stats.kills,loot=full.pickups.length;tick(full);
    assert.equal(full.enemies.length,ENEMY_CAP);assert.equal(full.enemies.filter(e=>e.kind==='boss'&&e.tier===tier).length,1);
    assert.equal(full.enemies.filter(e=>e.elite).length,escortCount);
    assert.equal(full.escortDebt,escortCount);assert.equal(full.stats.kills,kills);assert.equal(full.pickups.length,loot);
  }
  const capped=new Game('ranger');quiet(capped);for(let i=0;i<16;i++)assert.ok(capped.spawnEnemy('boss'));assert.equal(capped.spawnEnemy('boss'),undefined);
});
test('late special durability is variant-only; old guardian stays unchanged',()=>{
  const early=new Game('ranger');quiet(early);early.elapsed=119;const guardian=early.spawnEnemy('brute',true);assert.equal(guardian.special,null);
  const late=new Game('ranger');quiet(late);late.elapsed=120;const jug=late.spawnEnemy('brute',true);assert.equal(jug.special,'juggernaut');assert.ok(jug.maxHp>guardian.maxHp*5.9);
  const mage=new Game('ranger');quiet(mage);mage.elapsed=180;const hex=mage.spawnEnemy('cultist',true);assert.equal(hex.special,'hexcaster');
  const ordinary=mage.spawnEnemy('cultist',false);assert.equal(ordinary.special,null);assert.ok(hex.maxHp>ordinary.maxHp*20);
});

test('representative evolved three-weapon build sees special warnings before kills',()=>{
  for(const [kind,seconds] of [['brute',1.4],['cultist',1]]){
    const g=new Game('ranger');quiet(g);g.elapsed=300;g.bossWave=3;g.player.invuln=1e9;
    g.slots=['thornbow','arcwand','scattergun'];for(const weapon of g.slots)g.weapons[weapon]=5;
    const enemy=g.spawnEnemy(kind,true);enemy.x=g.player.x+8;enemy.y=g.player.y;enemy.specialCd=0;
    tick(g,Math.floor(seconds*60));
    assert.ok(enemy.hp>0,`${enemy.special} should survive through warning and attack`);
    if(enemy.special==='hexcaster')assert.ok(g.hazards.length>0);
    else assert.ok(['charge','recovery'].includes(enemy.specialState));
  }
});
