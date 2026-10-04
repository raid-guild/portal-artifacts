import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';

const compiled=await build({entryPoints:['src/game.ts'],bundle:true,platform:'node',format:'esm',write:false,absWorkingDir:process.cwd()});
const {Game,nightmanSpeedMultiplier}=await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString('base64')}`);
const fresh=(level='training')=>{const g=new Game('ranger',level);g.enemies=[];g.slots=[];g.spawnClock=g.chestClock=-1e9;g.lavaBossAdmitted=999;g.player.invuln=1e9;return g;};
const clear=g=>{g.elapsed=720;g.cleared=true;g.paused=true;};
const tick=(g,n=1)=>{for(let i=0;i<n;i++)g.update(1/60);};

test('Nightman is optional after a real clear, appears once outside the viewport, and banking stays safe',()=>{
  for(const level of ['training','forest','desert','ice','lava']){
    const g=fresh(level);assert.equal(g.continueEndless(),false);g.elapsed=719.99;tick(g);assert.equal(g.cleared,true);assert.equal(g.nightman,null);
    const bank=fresh(level);clear(bank);bank.die('bank');assert.equal(bank.continueEndless(),false);assert.equal(bank.nightman,null);
    const before={...g.stats,score:g.score,pickups:g.pickups.length,monsters:structuredClone(g.monsters)};
    assert.equal(g.continueEndless({left:70,right:110,bottom:70,top:110}),true);
    assert.equal(g.endless,true);assert.equal(g.paused,false);assert.equal(g.cleared,false);assert.equal(g.nightman.warningRemaining,2.5);
    assert.ok(Math.hypot(g.nightman.x-g.player.x,g.nightman.y-g.player.y)>=30);
    assert.ok(g.nightman.x<70||g.nightman.x>110||g.nightman.y<70||g.nightman.y>110);
    assert.equal(g.continueEndless(),false);assert.deepEqual({...g.stats,score:g.score,pickups:g.pickups.length,monsters:g.monsters},before);
  }
});

test('wide viewport and world-edge clears still spawn outside view and chase across bounds',()=>{
  for(const [playerX,view] of [[90,{left:-10,right:190,bottom:-10,top:190}],[177,{left:150,right:180,bottom:75,top:105}]]){
    const g=fresh();g.player.x=playerX;clear(g);assert.equal(g.continueEndless(view),true);
    assert.ok(g.nightman.x>view.right+g.nightman.radius);
    assert.ok(g.nightman.x-g.player.x>=30);
    const first=g.nightman.x;g.nightman.warningRemaining=0;tick(g);
    assert.ok(g.nightman.x<first,'pursuer enters toward the player');
    assert.ok(g.nightman.x>180,'chase is not clamped to the world edge');
  }
});

test('warning lasts 2.5 active seconds and freezes under pause or reward',()=>{
  const g=fresh();clear(g);g.continueEndless();const {x,y}=g.nightman;
  tick(g,149);assert.ok(g.nightman.warningRemaining>0);assert.deepEqual([g.nightman.x,g.nightman.y],[x,y]);
  g.paused=true;tick(g,120);assert.ok(g.nightman.warningRemaining>0);g.paused=false;
  g.awaitingReward=true;tick(g,120);assert.ok(g.nightman.warningRemaining>0);g.awaitingReward=false;
  tick(g);assert.equal(g.nightman.warningRemaining,0);assert.deepEqual([g.nightman.x,g.nightman.y],[x,y]);
  tick(g);assert.ok(g.nightman.x!==x||g.nightman.y!==y);
});

test('speed ramps beyond dash and reads current walk upgrades and applicable perk',()=>{
  for(const [time,value] of [[720,.55],[780,.95],[840,1.6],[900,3.8],[950,3.8]])assert.equal(nightmanSpeedMultiplier(time),value);
  assert.ok(nightmanSpeedMultiplier(900)>3.3);
  const g=fresh();clear(g);g.continueEndless();g.nightman.warningRemaining=0;g.nightman.x=50;g.nightman.y=90;g.elapsed=840;g.passives.speed=2;
  const old=g.nightman.x;tick(g);assert.ok(Math.abs(g.nightman.x-old-g.player.speed*1.2*nightmanSpeedMultiplier(g.elapsed)/60)<1e-8);
  const perkGame=new Game('wizard','training',{version:g.config.version,character:'wizard',level:'training',skills:{vitality:0,agility:0,bombRecharge:0},equippedPerk:'wizard-flux-core',target:null});
  perkGame.enemies=[];perkGame.slots=[];perkGame.spawnClock=perkGame.chestClock=-1e9;perkGame.lavaBossAdmitted=999;clear(perkGame);perkGame.continueEndless();perkGame.nightman.warningRemaining=0;perkGame.nightman.x=50;perkGame.nightman.y=90;const start=perkGame.nightman.x;tick(perkGame);
  assert.ok(Math.abs(perkGame.nightman.x-start-perkGame.player.speed*1.15*nightmanSpeedMultiplier(perkGame.elapsed)/60)<1e-8);
});

test('one touch kills through health, invulnerability, dash and guard with one death event',()=>{
  const g=fresh();clear(g);g.continueEndless();g.nightman.warningRemaining=0;g.nightman.x=g.player.x+1.2;g.nightman.y=g.player.y;g.player.health=999;g.player.maxHealth=999;g.player.invuln=1e9;g.dash();g.perkGuard=10;
  let deaths=0;g.onEvent=event=>{if(event==='death')deaths++;};tick(g);assert.equal(g.dead,true);assert.equal(g.deathReason,'combat');assert.equal(g.killedByNightman,true);assert.equal(g.player.health,0);assert.equal(deaths,1);tick(g,20);assert.equal(deaths,1);
});

test('relative sweep catches dash crossing even when endpoints are apart',()=>{
  const g=fresh();clear(g);g.continueEndless();g.elapsed=900;g.nightman.warningRemaining=0;g.player.x=90;g.player.y=90;g.player.speed=12;g.nightman.x=92;g.nightman.y=90;g.move.x=1;g.dash();g.player.invuln=1e9;
  g.update(.05);assert.equal(g.dead,true);assert.ok(Math.abs(g.nightman.x-g.player.x)>g.nightman.radius+.55,'endpoints alone miss this crossing');
});

test('Nightman ignores attacks, walls, crowd and world edge without loot or monster stats',()=>{
  const g=fresh('ice');clear(g);g.continueEndless();g.nightman.warningRemaining=0;g.nightman.x=1;g.nightman.y=1;g.player.x=170;g.player.y=170;g.elapsed=840;g.player.invuln=1e9;
  const before={stats:{...g.stats},pickups:g.pickups.length,monsters:structuredClone(g.monsters)};
  g.projectiles.push({x:1,y:1,vx:0,vy:0,damage:1e9,radius:2,life:1,pierce:0,kind:'thornbow',chain:0,hit:new Set()});
  g.bombCharge=g.bombRecharge;g.bomb();tick(g,30);assert.ok(g.nightman.x>1&&g.nightman.y>1);assert.equal(g.nightman.radius,1);
  assert.deepEqual(g.stats,before.stats);assert.equal(g.pickups.length,before.pickups);assert.deepEqual(g.monsters,before.monsters);
});
