import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';

const result = await build({ entryPoints:['src/game.ts'],bundle:true,platform:'node',format:'esm',write:false,absWorkingDir:process.cwd() });
const { Game, ENEMY_CAP } = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);

test('three heroes start with distinct primary weapons',()=>{
  assert.deepEqual(['ranger','wizard','dwarf'].map(h=>new Game(h).slots[0]),['thornbow','arcwand','scattergun']);
});
test('forest begins with a real elemental choice and class mastery applies only at construction',()=>{
  const g=new Game('ranger','forest',{vitality:1,agility:1,bombRecharge:1});
  assert.equal(g.level,'forest');assert.equal(g.player.maxHealth,105);assert.ok(g.player.speed>8.2);assert.ok(g.bombRecharge<45);
  const first=g.rollRewards(false);assert.deepEqual(first.map(r=>r.id),['light','freeze','resolve']);
  g.awaitingReward=true;g.chooseReward(first[1]);assert.equal(g.runes.freeze,true);assert.equal(g.awaitingReward,false);
  g.awaitingReward=true;g.chooseReward(first[0]);assert.equal(g.runes.light,true);assert.equal(g.runes.freeze,true);
  assert.equal(g.rollRewards(false).length,3);
});
test('forest monsters keep on-chain identities with visible attacks and elemental counters',()=>{
  const g=new Game('wizard','forest');g.enemies=[];g.slots=[];g.spawnClock=-1000;g.chestClock=-1000;g.player.invuln=1e9;
  g.elapsed=90;const rage=g.spawnEnemy('rageipede');rage.x=g.player.x+8;rage.y=g.player.y;rage.specialCd=0;
  g.update(1/60);assert.equal(rage.specialState,'windup');assert.equal(g.monsters.rageipede.encountered,1);
  g.runes.light=true;g.damage(rage,1e9,'thornbow');assert.equal(g.monsters.rageipede.counterKills,1);
  g.elapsed=150;const xorn=g.spawnEnemy('xorn');xorn.x=g.player.x+8;xorn.y=g.player.y;xorn.specialCd=0;
  g.update(1/60);assert.equal(xorn.specialState,'windup');g.runes.freeze=true;g.damage(xorn,1,'arcwand');assert.ok(xorn.frozen>0);assert.equal(xorn.specialState,'recovery');
  xorn.frozen=0;g.damage(xorn,1,'arcwand');assert.equal(xorn.frozen,0,'freeze immunity blocks immediate repeat');
  const efreeti=g.spawnEnemy('efreeti');efreeti.x=g.player.x+8;efreeti.y=g.player.y;efreeti.specialState='charge';efreeti.specialTimer=1;
  g.runes.freeze=false;const before=efreeti.hp;g.damage(efreeti,40,'arcwand');assert.equal(efreeti.hp,before);
  g.runes.freeze=true;g.damage(efreeti,1e9,'arcwand');assert.equal(g.monsters.efreeti.counterKills,1);assert.ok(g.enemies.length<=ENEMY_CAP);
});
test('paused and blessing screens do not advance active survival time',()=>{
  const g=new Game('ranger');g.elapsed=179.99;g.paused=true;g.update(1/60);assert.equal(g.elapsed,179.99);
  g.paused=false;g.awaitingReward=true;g.update(1/60);assert.equal(g.elapsed,179.99);
  g.awaitingReward=false;g.update(1/60);assert.ok(g.elapsed>=180);
});
test('spatial queries are initialized before the first tick',()=>{
  const g=new Game('ranger'), first=g.enemies[0];
  assert.equal(g.nearest(first.x,first.y,.1)?.id,first.id);
  let count=0;
  g.forNearby(90,90,180,()=>{count++;});
  assert.equal(count,g.enemies.length);
});
test('horde cap and bounded pools survive stress',()=>{
  const g=new Game('ranger');g.stress(3000);assert.equal(g.enemies.length,ENEMY_CAP);assert.equal(g.rankable,false);
  g.move.x=1;for(let i=0;i<180;i++)g.update(1/60);
  assert.ok(g.enemies.length<=ENEMY_CAP);assert.ok(g.projectiles.length<=650);assert.ok(g.pickups.length<=900);assert.ok(g.effects.length<=360);
});
test('three evolved weapons keep a full horde within entity pools',()=>{
  const g=new Game('ranger');
  g.stress(ENEMY_CAP);
  g.slots=['thornbow','arcwand','scattergun'];
  for(const weapon of g.slots)g.weapons[weapon]=5;
  g.passives.cooldown=5;
  g.player.invuln=1e9;
  for(const enemy of g.enemies)enemy.hp=enemy.maxHp=1e9;
  for(let i=0;i<240;i++)g.update(1/60);
  assert.equal(g.enemies.length,ENEMY_CAP);
  assert.ok(g.projectiles.length<=650);
  assert.ok(g.pickups.length<=900);
  assert.ok(g.effects.length<=360);
  assert.ok(g.enemies.some(enemy=>enemy.hp<enemy.maxHp),'weapons hit the horde');
});
test('overlapping chests each open their own reward',()=>{
  const g=new Game('ranger');
  g.enemies=[];
  g.pickups=[0,1].map(()=>({x:g.player.x,y:g.player.y,kind:'chest',value:1,life:45}));
  g.update(1/60);
  assert.equal(g.stats.chests,1);
  assert.equal(g.pickups.length,1);
  assert.equal(g.awaitingReward,true);
  g.chooseReward(g.rollRewards(true)[0]);
  g.update(1/60);
  assert.equal(g.stats.chests,2);
  assert.equal(g.pickups.length,0);
  assert.equal(g.awaitingReward,true);
});
test('projectile query includes a boss across a cell boundary',()=>{
  const g=new Game('ranger');
  g.enemies=[];g.slots=[];
  g.spawnEnemy('boss');
  const boss=g.enemies[0];boss.x=95;boss.y=90;boss.speed=0;boss.attackCd=100;
  g.projectiles.push({x:92.61,y:90,vx:0,vy:0,damage:100,radius:.2,life:1,pierce:0,kind:'thornbow',chain:0,hit:new Set()});
  g.update(1/60);
  assert.ok(boss.hp<boss.maxHp);
});
test('boss chest stays available when the pickup pool is full',()=>{
  const g=new Game('wizard');
  g.pickups=Array.from({length:900},()=>({x:1,y:1,kind:'xp',value:1,life:25}));
  g.spawnEnemy('boss');
  g.damage(g.enemies.at(-1),1e9,'arcwand');
  assert.equal(g.pickups.length,900);
  assert.ok(g.pickups.some(item=>item.kind==='chest'));
});
test('reward ranks weapons, fills active slots then backpack, and swaps',()=>{
  const g=new Game('ranger');const reward=id=>({kind:'weapon',id,name:id,detail:'',rarity:'common',icon:'✦'});
  for(const id of ['arcwand','scattergun','chain']){g.awaitingReward=true;g.chooseReward(reward(id));}
  assert.deepEqual(g.slots,['thornbow','arcwand','scattergun']);assert.deepEqual(g.backpack,['chain']);
  g.swapBackpack(0,1);assert.deepEqual(g.slots,['thornbow','chain','scattergun']);assert.deepEqual(g.backpack,['arcwand']);
  g.awaitingReward=true;g.chooseReward(reward('thornbow'));assert.equal(g.weapons.thornbow,2);
});
test('maxed loadout still offers three repeatable boons',()=>{
  const g=new Game('wizard');for(const key of ['thornbow','arcwand','scattergun','chain','orbit','comet'])g.weapons[key]=5;
  for(const key of Object.keys(g.passives))g.passives[key]=5;
  for(const key of Object.keys(g.bombRanks))g.bombRanks[key]=5;
  const rewards=g.rollRewards(false);assert.equal(rewards.length,3);assert.ok(rewards.every(r=>r.kind==='boon'));
  g.awaitingReward=true;g.chooseReward(rewards[0]);assert.equal(g.awaitingReward,false);
});
test('elite chest rolls use the shorter cooldown and boss chests remain guaranteed',()=>{
  const g=new Game('ranger');g.enemies=[];g.elapsed=100;g.lastChestTime=56;
  const original=Math.random;Math.random=()=>.2;
  try{
    g.spawnEnemy('brute',true);g.damage(g.enemies.at(-1),1e9,'thornbow');
    assert.equal(g.pickups.filter(item=>item.kind==='chest').length,0);
    g.pickups=[];g.lastChestTime=55;g.spawnEnemy('brute',true);g.damage(g.enemies.at(-1),1e9,'thornbow');
    assert.equal(g.pickups.filter(item=>item.kind==='chest').length,1);
    g.pickups=[];g.lastChestTime=100;g.spawnEnemy('boss');g.damage(g.enemies.at(-1),1e9,'thornbow');
    assert.equal(g.pickups.filter(item=>item.kind==='chest').length,1);
  }finally{Math.random=original;}
});
test('all three hero bombs expand, hit once, and recharge while active',()=>{
  for(const hero of ['ranger','wizard','dwarf']){
    const g=new Game(hero);g.enemies=[];g.slots=[];g.spawnEnemy('brute');const enemy=g.enemies[0];enemy.x=g.player.x+3;enemy.y=g.player.y;enemy.speed=0;enemy.hp=enemy.maxHp=2000;enemy.attackCd=100;
    assert.equal(g.bomb(),true);assert.equal(g.bomb(),false);
    for(let i=0;i<40;i++)g.update(1/60);
    const damage=enemy.maxHp-enemy.hp;assert.ok(damage>0,`${hero} bomb should hit`);
    assert.equal(g.bombWave,null);assert.ok(g.bombCharge>0);
    assert.ok(damage<500,`${hero} wave should hit one time per enemy`);
  }
});
test('bomb upgrades change radius, damage, and recharge',()=>{
  const g=new Game('dwarf');const originalRecharge=g.bombRecharge,originalRadius=g.bombRadius;
  for(const id of ['radius','damage','recharge']){g.awaitingReward=true;g.chooseReward({kind:'bomb',id,name:id,detail:'',rarity:'rare',icon:'✷'});}
  assert.ok(g.bombRadius>originalRadius);assert.ok(g.bombRecharge<originalRecharge);assert.equal(g.bombRanks.damage,1);
});
test('healing shrine grants health and XP without summoning attackers',()=>{
  const g=new Game('ranger');g.enemies=[];g.player.health=40;const shrine=g.shrines[0];shrine.x=g.player.x;shrine.y=g.player.y;
  g.update(1/60);
  assert.equal(shrine.active,false);assert.equal(g.player.health,65);assert.equal(g.stats.level,2);assert.equal(g.xp,4);assert.equal(g.enemies.length,0);
});
test('comet strike deals damage even when cosmetic effect pool is saturated',()=>{
  const g=new Game('ranger');g.enemies=[];g.weapons.comet=5;g.slots.push('comet');
  g.spawnEnemy('boss');const enemy=g.enemies[0];enemy.x=g.player.x+6;enemy.y=g.player.y;enemy.speed=0;enemy.attackCd=100;enemy.hp=enemy.maxHp=3000;
  for(let i=0;i<360;i++)g.effects.push({x:0,y:0,kind:'hit',life:2,max:2,color:0,size:1});
  g.update(1/60);assert.equal(g.strikes.length,3);
  for(let i=0;i<60;i++)g.update(1/60);
  assert.ok(enemy.hp<enemy.maxHp);
});
test('twelve minute milestone pauses for a clear or endless choice',()=>{
  const g=new Game('dwarf');g.elapsed=719.99;g.update(1/60);assert.equal(g.cleared,true);assert.equal(g.paused,true);
  g.endless=true;g.cleared=false;g.paused=false;g.update(1/60);assert.equal(g.cleared,false);
});
test('fatal contact stops the tick before pickups or weapon fire',()=>{
  const g=new Game('ranger');g.enemies=[];g.slots=['thornbow'];g.player.health=1;g.firing=true;g.facing=-1;g.aim.x=-1;
  g.spawnEnemy('brute');const enemy=g.enemies[0];enemy.x=g.player.x;enemy.y=g.player.y;enemy.speed=0;
  g.pickups.push({x:g.player.x,y:g.player.y,kind:'heart',value:50,life:20});
  const events=[];g.onEvent=event=>events.push(event);
  g.update(1/60);
  assert.equal(g.dead,true);assert.equal(g.deathReason,'combat');assert.equal(g.player.health,0);
  assert.equal(g.deathFacing,-1);assert.equal(g.deathFiring,true);
  assert.equal(g.pickups.length,1);assert.equal(g.projectiles.length,0);
  assert.deepEqual(events,['death']);
  g.update(1/60);assert.deepEqual(events,['death']);
});
test('fatal enemy shot stops the tick before food, rewards, or later shots',()=>{
  const g=new Game('wizard');g.enemies=[];g.slots=[];g.player.health=1;
  g.enemyShots=[{x:g.player.x,y:g.player.y,vx:0,vy:0,life:1,damage:3,radius:.2,boss:false},{x:g.player.x+5,y:g.player.y,vx:0,vy:0,life:1,damage:3,radius:.2,boss:false}];
  g.pickups.push({x:g.player.x,y:g.player.y,kind:'xp',value:100,life:20});
  const events=[];g.onEvent=event=>events.push(event);
  g.update(1/60);
  assert.equal(g.dead,true);assert.deepEqual(events,['death']);
  assert.equal(g.xp,0);assert.equal(g.stats.level,1);assert.equal(g.pickups.length,1);
  assert.equal(g.enemyShots.length,2);
});
test('bank and abandon finish immediately without a combat death cue',()=>{
  for(const reason of ['bank','abandon']){
    const g=new Game('dwarf'),events=[];g.onEvent=event=>events.push(event);
    assert.equal(g.die(reason),true);assert.equal(g.die(reason),false);
    assert.equal(g.deathReason,reason);assert.deepEqual(events,[]);
  }
});
