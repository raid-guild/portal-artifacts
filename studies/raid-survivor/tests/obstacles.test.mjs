import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';

const outputs=await Promise.all(['src/game.ts','src/obstacles.ts'].map(entry=>build({entryPoints:[entry],bundle:true,platform:'node',format:'esm',write:false,absWorkingDir:process.cwd()})));
const [gameModule,obstacleModule]=await Promise.all(outputs.map(result=>import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`)));
const {Game,chargeCapsule}=gameModule;
const {obstaclesFor,emptyHit,sweepObstacles,moveWithObstacles,projectOutside,iceLineClear}=obstacleModule;
const move=(level,x,y,dx,dy,r=.5,flying=false,slide=true)=>moveWithObstacles(level,x,y,dx,dy,r,flying,slide,{x,y,hit:false,id:0},emptyHit());
const sweep=(level,x,y,dx,dy,r=.5,flying=false)=>sweepObstacles(level,x,y,dx,dy,r,flying,emptyHit());

test('fixed obstacle layouts are sparse, separated, and clear of spawn and shrines',()=>{
  assert.equal(obstaclesFor('training').length,0);assert.equal(obstaclesFor('forest').length,0);
  const shrines=[[28,28],[90,28],[152,28],[28,90],[152,90],[28,152],[90,152],[152,152],[54,54],[126,54],[54,126],[126,126]];
  for(const realm of ['desert','ice']){
    const obstacles=obstaclesFor(realm);assert.ok(obstacles.length<=12);
    for(const o of obstacles){const extent=o.shape==='circle'?o.radius:Math.hypot(o.halfWidth,o.halfHeight);assert.ok(Math.hypot(o.x-90,o.y-90)-extent>=10);for(const [x,y] of shrines)assert.ok(Math.hypot(o.x-x,o.y-y)-extent>=6,`${realm} shrine near ${o.id}`);}
    for(let i=0;i<obstacles.length;i++)for(let j=i+1;j<obstacles.length;j++){const a=obstacles[i],b=obstacles[j],ra=a.shape==='circle'?a.radius:Math.hypot(a.halfWidth,a.halfHeight),rb=b.shape==='circle'?b.radius:Math.hypot(b.halfWidth,b.halfHeight);assert.ok(Math.hypot(a.x-b.x,a.y-b.y)-ra-rb>=8,`${realm} gap ${a.id}/${b.id}`);}
    assert.ok(obstacles.some(o=>Math.hypot(o.x-90,o.y-90)>=12&&Math.hypot(o.x-90,o.y-90)<=16));
  }
});

test('desert blocks grounded walking and dash but allows flyers and all shots',()=>{
  const ground=move('desert',100,91,10,0);assert.ok(ground.hit);assert.ok(ground.x<101);
  assert.ok(move('desert',100,91,10,0,.5,true).x>109);
  assert.equal(sweep('desert',100,91,10,0,.2,true).hit,false);
  const slide=move('desert',100,89,10,5);assert.ok(slide.hit);assert.ok(slide.y>89);
  const projected=projectOutside('desert',104,91,.7,false,{x:0,y:0,hit:false,id:0});assert.ok(Math.hypot(projected.x-104,projected.y-91)>3.49);
});

test('ice walls block actors, flyers, charges, and shots with swept contact',()=>{
  const hit=sweep('ice',98,90,12,0,.5,true);assert.ok(hit.hit);assert.equal(hit.id,1);
  const dash=move('ice',98,90,12,0,.5,false,false);assert.ok(dash.hit);assert.ok(dash.x<100.5);
  assert.ok(move('ice',98,90,12,0,.5,false,true).x<101);
  assert.equal(iceLineClear('ice',98,90,110,90),false);
  assert.equal(iceLineClear('ice',98,95,110,95),true);
  assert.equal(iceLineClear('desert',100,91,110,91),true);
});

test('charge warning ends exactly where ice wall stops the enemy',()=>{
  const game=new Game('ranger','ice');game.enemies=[];const enemy=game.spawnEnemy('brute',true);enemy.x=98;enemy.y=90;enemy.targetX=110;enemy.targetY=90;enemy.special='juggernaut';const capsule=chargeCapsule(enemy,'ice');assert.ok(capsule.x2<101);assert.equal(capsule.y2,90);
});

test('loot from enemies over water remains collectible and guaranteed boss chest is projected',()=>{
  const game=new Game('ranger','desert');game.enemies=[];game.pickups=[];const boss=game.spawnEnemy('boss');boss.x=104;boss.y=91;boss.hp=1;game.damage(boss,100,'bomb');assert.ok(game.pickups.some(p=>p.kind==='chest'));for(const item of game.pickups)assert.ok(Math.hypot(item.x-104,item.y-91)>=2.8+.64);
});

test('projectiles strike actors in front of ice and never strike actors behind it',()=>{
  const game=new Game('ranger','ice');game.enemies=[];game.slots=[];game.player.invuln=1e6;game.spawnClock=game.chestClock=-1e6;const near=game.spawnEnemy('chuul'),far=game.spawnEnemy('chuul');near.x=99;near.y=90;far.x=108;far.y=90;near.speed=far.speed=0;near.specialCd=far.specialCd=999;
  game.projectiles=[{x:97,y:90,vx:720,vy:0,life:2,damage:5,radius:.2,pierce:3,kind:'thornbow',chain:0,hit:new Set()}];game.update(1/60);
  assert.ok(near.hp<near.maxHp);assert.equal(far.hp,far.maxHp);assert.equal(game.projectiles.length,0);
});

test('enemy uses a local corner waypoint to get around an ice wall',()=>{
  const game=new Game('ranger','ice');game.enemies=[];game.slots=[];game.spawnClock=game.chestClock=-1e6;game.player.x=112;game.player.y=90;game.player.invuln=1e6;const enemy=game.spawnEnemy('chuul');enemy.x=97;enemy.y=90;enemy.special=null;enemy.speed=3;enemy.hp=enemy.maxHp=1e6;
  for(let i=0;i<600;i++)game.update(1/60);
  assert.ok(enemy.x>108,`enemy stopped at ${enemy.x},${enemy.y}`);
});

test('ground enemy routes around an oasis instead of oscillating at the edge',()=>{
  const game=new Game('ranger','desert');game.enemies=[];game.slots=[];game.spawnClock=game.chestClock=-1e6;game.player.x=112;game.player.y=91;game.player.invuln=1e6;const enemy=game.spawnEnemy('deathwisp');enemy.x=98;enemy.y=91;enemy.special=null;enemy.speed=3;enemy.hp=enemy.maxHp=1e6;
  for(let i=0;i<600;i++)game.update(1/60);
  assert.ok(enemy.x>108,`enemy stopped at ${enemy.x},${enemy.y}`);
});

test('ice walls stop hostile shots before player, while water lets them pass',()=>{
  for(const [realm,expected] of [['ice',100],['desert',92]]){
    const game=new Game('ranger',realm);game.enemies=[];game.slots=[];game.spawnClock=game.chestClock=-1e6;game.player.x=108;game.player.y=realm==='ice'?90:91;game.player.health=100;game.player.invuln=0;
    game.enemyShots=[{x:98,y:game.player.y,vx:600,vy:0,life:1,damage:8,radius:.2,boss:false}];game.update(1/60);assert.equal(game.player.health,expected);
  }
});

test('targeting and arcing effects respect ice, but bombs and falling stars ignore it',()=>{
  const game=new Game('ranger','ice');game.enemies=[];game.slots=[];game.spawnClock=game.chestClock=-1e6;game.player.x=100.5;game.player.y=90;game.player.invuln=1e6;const enemy=game.spawnEnemy('chuul');enemy.x=107.5;enemy.y=90;enemy.speed=0;enemy.special=null;enemy.hp=enemy.maxHp=200;
  game.buildGrid();assert.equal(game.nearest(100,90,16),undefined);
  game.strikes=[{x:100,y:90,delay:0,radius:10,damage:20,source:'arcwand'}];game.update(1/60);assert.equal(enemy.hp,200);
  game.strikes=[{x:100,y:90,delay:0,radius:10,damage:20,source:'comet'}];game.update(1/60);assert.equal(enemy.hp,180);
  game.bomb();for(let i=0;i<45;i++)game.update(1/60);assert.ok(enemy.hp<180);
});

test('auto-fired Falling Star selects and hits a sole enemy behind ice',()=>{
  const game=new Game('ranger','ice');game.enemies=[];game.slots=['comet'];game.weapons.comet=1;game.firing=false;game.spawnClock=game.chestClock=-1e6;game.player.x=100.5;game.player.y=90;game.player.invuln=1e6;
  const enemy=game.spawnEnemy('chuul');enemy.x=107.5;enemy.y=90;enemy.speed=0;enemy.special=null;enemy.hp=enemy.maxHp=200;
  game.update(1/60);assert.equal(game.strikes.length,1);assert.equal(game.strikes[0].x,enemy.x);assert.equal(game.strikes[0].y,enemy.y);
  for(let i=0;i<40;i++)game.update(1/60);assert.ok(enemy.hp<200);
  const chain=new Game('ranger','ice');chain.enemies=[];chain.slots=['chain'];chain.weapons.chain=1;chain.firing=false;chain.spawnClock=chain.chestClock=-1e6;chain.player.x=100.5;chain.player.y=90;chain.player.invuln=1e6;
  const hidden=chain.spawnEnemy('chuul');hidden.x=107.5;hidden.y=90;hidden.speed=0;hidden.special=null;hidden.hp=hidden.maxHp=200;chain.update(1/60);assert.equal(hidden.hp,200);
});

test('actual charge and jaunt stop at ice without damaging through cover',()=>{
  const game=new Game('ranger','ice');game.enemies=[];game.slots=[];game.spawnClock=game.chestClock=-1e6;game.player.x=110;game.player.y=90;game.player.health=100;
  const brute=game.spawnEnemy('brute',true);brute.x=98;brute.y=90;brute.special='juggernaut';brute.specialState='charge';brute.specialTimer=.55;brute.chargeX=1;brute.chargeY=0;brute.chargeHit=false;
  const chuul=game.spawnEnemy('chuul');chuul.x=98;chuul.y=90;chuul.special='jaunt';chuul.specialState='windup';chuul.specialTimer=.01;chuul.targetX=110;chuul.targetY=90;
  for(let i=0;i<45;i++)game.update(1/60);
  assert.ok(brute.x<101);assert.equal(brute.specialState,'recovery');assert.ok(chuul.x<101);assert.equal(game.player.health,100);
});

test('knockback cannot push a ground enemy into a pool',()=>{
  const game=new Game('dwarf','desert');game.enemies=[];game.slots=[];game.spawnClock=game.chestClock=-1e6;game.player.invuln=1e6;const enemy=game.spawnEnemy('deathwisp');enemy.x=100;enemy.y=91;enemy.special=null;enemy.speed=0;enemy.knockX=120;game.update(1/60);assert.ok(enemy.x<101);
});
