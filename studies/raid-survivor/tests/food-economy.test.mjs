import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';

const compiled=await build({entryPoints:['src/game.ts'],bundle:true,platform:'node',format:'esm',write:false,absWorkingDir:process.cwd()});
const {Game}=await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString('base64')}`);
const fresh=(hero='ranger',level='training',perk=null)=>{const g=new Game(hero,level,{version:'3',character:hero,level,skills:{vitality:0,agility:0,bombRecharge:0},equippedPerk:perk,target:null});g.enemies=[];g.slots=[];g.spawnClock=g.chestClock=-1e9;g.player.invuln=1e9;return g;};
const hearts=g=>g.pickups.filter(p=>p.kind==='heart');
const kill=(g,x=95,y=90,kind='rat')=>{const e=g.spawnEnemy(kind);assert.ok(e);e.x=x;e.y=y;e.hp=1;e.speed=0;g.buildGrid();g.damage(e,10,'thornbow');return e;};

test('food first appears at 12 seconds, then needs 22 or 30 seconds since the last successful drop',()=>{
  const g=fresh();g.elapsed=11.999;kill(g);assert.equal(hearts(g).length,0);g.elapsed=12;kill(g);assert.equal(hearts(g).length,1);g.pickups=[];
  g.elapsed=33.999;kill(g);assert.equal(hearts(g).length,0);g.elapsed=34;kill(g);assert.equal(hearts(g).length,1);g.pickups=[];
  g.elapsed=56;kill(g);assert.equal(hearts(g).length,1);
  const late=fresh();late.elapsed=179;kill(late);assert.equal(hearts(late).length,1);late.pickups=[];late.elapsed=208.999;kill(late);assert.equal(hearts(late).length,0);late.elapsed=209;kill(late);assert.equal(hearts(late).length,1);
  const gap=fresh();gap.elapsed=400;for(let i=0;i<80;i++)kill(gap,100+i*.01);assert.equal(hearts(gap).length,1,'a quiet interval never banks extra food credits');
});

test('ground cap, total pickup cap, and chest priority do not consume an unsuccessful food timer',()=>{
  const g=fresh();g.elapsed=12;for(let i=0;i<40;i++)kill(g);assert.equal(hearts(g).length,1,'same timestamp allows only one food drop');g.elapsed=34;kill(g);assert.equal(hearts(g).length,2);g.elapsed=56;kill(g);assert.equal(hearts(g).length,2);
  g.pickups=g.pickups.filter(p=>p.kind!=='heart').concat(hearts(g).slice(0,1));kill(g);assert.equal(hearts(g).length,2,'failed ground-cap attempt does not reset timer');
  const full=fresh();full.elapsed=12;full.pickups=Array.from({length:899},(_,i)=>({x:110+i/1000,y:110,kind:'xp',value:1,life:25}));kill(full);assert.equal(full.pickups.length,900);assert.equal(hearts(full).length,0);full.pickups=[];kill(full);assert.equal(hearts(full).length,1);
  const chest=fresh();chest.elapsed=12;kill(chest,96,90,'boss');assert.equal(hearts(chest).length,0);assert.ok(chest.pickups.some(p=>p.kind==='chest'));kill(chest);assert.equal(hearts(chest).length,1);
});

test('food is projected outside terrain, has 18 value and 25-second life, and can drop at full HP',()=>{
  const g=fresh('ranger','ice');g.elapsed=12;assert.equal(g.player.health,g.player.maxHealth);kill(g,104,90);const food=hearts(g)[0];assert.ok(food);assert.equal(food.value,18);assert.equal(food.life,25);assert.ok(Math.abs(food.x-104)>=3+.65||Math.abs(food.y-90)>=.9+.65,'food is outside the ice wall');g.pickups=[food];food.life=.01;g.update(1/60);assert.equal(hearts(g).length,0);
});

test('food uses fixed 1.25-unit pull despite magnet upgrades, while XP retains wide pull',()=>{
  const g=fresh('ranger','training','ranger-scout-dash');g.passives.magnet=5;g.dash();g.move.x=g.move.y=0;g.pickups=[{x:g.player.x+2,y:g.player.y,kind:'heart',value:18,life:25},{x:g.player.x+2,y:g.player.y+1,kind:'xp',value:1,life:25}];const [food,xp]=g.pickups,foodX=food.x,xpX=xp.x;g.update(1/60);assert.equal(food.x,foodX);assert.ok(xp.x<xpX);
  food.x=g.player.x+1.2;g.update(1/60);assert.ok(food.x<g.player.x+1.2);
});

test('food restores 18, Hearty Meal restores 27, and excess healing is capped',()=>{
  for(const [perk,heal] of [[null,18],['tavern-hearty-meal',27]]){const g=fresh('tavern-keeper','training',perk);g.player.health=40;g.pickups=[{x:g.player.x,y:g.player.y,kind:'heart',value:18,life:25}];g.update(1/60);assert.equal(g.player.health,40+heal);g.player.health=g.player.maxHealth-2;g.pickups=[{x:g.player.x,y:g.player.y,kind:'heart',value:18,life:25}];g.update(1/60);assert.equal(g.player.health,g.player.maxHealth);}
});

test('pause, reward, and death freeze food; new run and demo reset the food clock',()=>{
  const g=fresh();g.elapsed=12;kill(g);const food=hearts(g)[0];g.pickups=[food];for(const state of ['paused','awaitingReward','dead']){g[state]=true;g.update(1/60);assert.equal(food.life,25);g[state]=false;}g.elapsed=13;g.demoEncounter('juggernaut');g.enemies=[];g.paused=false;kill(g);assert.equal(hearts(g).length,1);const freshRun=fresh();freshRun.elapsed=12;kill(freshRun);assert.equal(hearts(freshRun).length,1);
});
