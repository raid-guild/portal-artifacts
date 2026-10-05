import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';

const compiled=await build({entryPoints:['src/game.ts'],bundle:true,platform:'node',format:'esm',write:false,absWorkingDir:process.cwd()});
const {Game,HEROES,WEAPONS}=await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString('base64')}`);
const tick=(g,n=1)=>{for(let i=0;i<n;i++)g.update(1/60);};
const setup=(hero,rank=1,perk=null)=>{const config={version:'3',character:hero,level:'training',skills:{vitality:0,agility:0,bombRecharge:0},equippedPerk:perk,target:null};const g=new Game(hero,'training',config);g.enemies=[];g.spawnClock=g.chestClock=-1e9;g.player.invuln=1e9;g.firing=true;g.aim.x=1;g.aim.y=0;g.weapons[HEROES[hero].weapon]=rank;return g;};
const enemy=(g,x=94,y=90,kind='rat')=>{const e=g.spawnEnemy(kind);e.x=x;e.y=y;e.speed=0;e.damage=0;e.hp=e.maxHp=1000;e.attackCd=1e9;e.special=null;g.buildGrid();return e;};

test('new heroes start with class-only primaries and preserve pickup pool',()=>{
  assert.equal(HEROES.healer.health,95);assert.equal(HEROES.healer.speed,7.8);
  assert.equal(HEROES.rogue.health,90);assert.equal(HEROES.rogue.speed,8.4);
  assert.equal(WEAPONS.spiritlantern.cooldown,.52);assert.equal(WEAPONS.twindaggers.cooldown,.32);
  for(const [hero,weapon] of [['healer','spiritlantern'],['rogue','twindaggers']]){const g=new Game(hero);assert.deepEqual(g.slots,[weapon]);assert.equal(g.weapons[weapon],1);assert.equal(g.rollRewards(false).some(r=>r.kind==='weapon'&&r.id===(hero==='healer'?'twindaggers':'spiritlantern')),false);}
});

test('Spirit Lantern ranks set count, damage, pierce, and symmetric rank-four spread',()=>{
  for(let rank=1;rank<=5;rank++){const g=setup('healer',rank);g.fireWeapon('spiritlantern');const shots=g.projectiles;assert.equal(shots.length,rank>=4?2:1);assert.ok(shots.every(p=>p.damage===[24,29,34,37,40][rank-1]&&p.pierce===(rank>=3?1:0)&&p.radius===.27&&p.life===.9&&Math.abs(Math.hypot(p.vx,p.vy)-17)<1e-9));if(rank>=4)assert.deepEqual(shots.map(p=>Number(Math.atan2(p.vy,p.vx).toFixed(2))),[-.07,.07]);}
});

test('Twin Daggers alternate perpendicular origins and pierce by rank',()=>{
  for(let rank=1;rank<=5;rank++){const g=setup('rogue',rank);g.fireWeapon('twindaggers');g.fireWeapon('twindaggers');const [a,b]=g.projectiles;assert.equal(a.x,90);assert.equal(b.x,90);assert.equal(a.y,89.84);assert.equal(b.y,90.16);for(const p of [a,b]){assert.equal(p.damage,[18,22,26,30,34][rank-1]);assert.equal(p.pierce,rank>=5?2:rank>=3?1:0);assert.equal(p.life,.65);assert.equal(p.radius,.18);assert.equal(Math.hypot(p.vx,p.vy),25);}}
});

test('Lantern kill wisps are capped, cooldown gated, stationary, healing-only, and pause frozen',()=>{
  const g=setup('healer');g.slots=[];g.player.health=70;let e=enemy(g,91,90);e.hp=1;g.damage(e,24,'spiritlantern');assert.equal(g.pickups.filter(p=>p.kind==='wisp').length,0,'close kill leaves no unreachable wisp');e=enemy(g,94,90);e.hp=1;g.damage(e,24,'spiritlantern');let wisps=g.pickups.filter(p=>p.kind==='wisp');assert.equal(wisps.length,1);assert.ok(Math.hypot(wisps[0].x-g.player.x,wisps[0].y-g.player.y)>=2.75-1e-9);const start={...wisps[0]};g.paused=true;tick(g,120);assert.deepEqual(wisps[0],start);g.paused=false;g.enemies=[];g.buildGrid();tick(g,60);assert.equal(wisps[0].x,start.x);assert.equal(wisps[0].y,start.y);
  e=enemy(g,92,90);e.hp=1;g.damage(e,24,'spiritlantern');assert.equal(g.pickups.filter(p=>p.kind==='wisp').length,1);
  g.elapsed=7;for(let i=0;i<4;i++){e=enemy(g,100+i,90);e.hp=1;g.damage(e,24,'spiritlantern');g.elapsed+=6;}assert.equal(g.pickups.filter(p=>p.kind==='wisp').length,3);
  const score=g.score,xp=g.xp,chests=g.stats.chests;g.pickups=[{x:g.player.x,y:g.player.y,kind:'wisp',value:4,life:12}];g.player.health=94;tick(g);assert.equal(g.player.health,95);assert.equal(g.score,score);assert.equal(g.xp,xp);assert.equal(g.stats.chests,chests);assert.equal(g.pickups.length,0);
});

test('healing wisp spawn uses the projected enemy position and respects world edges',()=>{
  const g=setup('healer');g.slots=[];g.player.health=40;const nearEdge=enemy(g,179.8,90);nearEdge.hp=1;g.damage(nearEdge,24,'spiritlantern');const wisp=g.pickups.find(p=>p.kind==='wisp');assert.ok(wisp);assert.ok(wisp.x<=179.35);assert.ok(wisp.x>=.65);assert.ok(Math.hypot(wisp.x-g.player.x,wisp.y-g.player.y)>=2.75);
});

test('Sanctuary heals once and clears nearby shots without removing hazards; Scarlet Veil grants one second',()=>{
  const healer=setup('healer');healer.slots=[];healer.player.health=60;healer.enemyShots=[{x:91,y:90},{x:94,y:90}];healer.hazards=[{x:90,y:90,sourceId:1}];assert.equal(healer.bomb(),true);assert.equal(healer.player.health,72);assert.equal(healer.enemyShots.length,1);assert.equal(healer.hazards.length,1);healer.updateBomb(1/60);assert.equal(healer.player.health,72);
  const gentle=setup('healer',1,'healer-gentle-sanctuary');gentle.player.health=60;gentle.bomb();assert.equal(gentle.player.health,80);
  const rogue=setup('rogue');rogue.player.invuln=0;rogue.bomb();assert.equal(rogue.player.invuln,1);tick(rogue);assert.ok(rogue.player.invuln<1);
});

test('class bombs use their own damage and perk multipliers',()=>{
  for(const [hero,perk,base,multiplier] of [['healer',null,42,1],['healer','healer-gentle-sanctuary',42,.75],['rogue',null,48,1],['rogue','rogue-crimson-burst',48,1.35]]){
    const g=setup(hero,1,perk);g.slots=[];const e=enemy(g,93,90);g.bomb();g.updateBomb(.6);assert.ok(Math.abs(e.maxHp-e.hp-base*multiplier)<1e-9,`${hero} bomb damage`);if(perk==='rogue-crimson-burst')assert.equal(g.bombRadius,7*.8);
  }
});

test('primary perks and monster counters distinguish lantern magic from dagger steel',()=>{
  const healer=setup('healer',1,'healer-guiding-light');healer.player.health=40;const h=enemy(healer);healer.damage(h,24,'spiritlantern');assert.ok(Math.abs(h.maxHp-h.hp-24*1.15)<1e-9);
  const rogue=setup('rogue',1,'rogue-hunters-edge');const dog=enemy(rogue,94,90,'dogmole');dog.elite=true;rogue.damage(dog,18,'twindaggers');assert.ok(Math.abs(dog.maxHp-dog.hp-18*1.15*1.25)<1e-9);
  const charge=enemy(healer,94,90,'efreeti');charge.special='devourer';charge.specialState='charge';const hp=charge.hp;healer.damage(charge,24,'spiritlantern');assert.equal(charge.hp,hp);
});

test('new projectiles use swept collision, pierce ranks, and world cover',()=>{
  for(const [hero,weapon] of [['healer','spiritlantern'],['rogue','twindaggers']]){
    const g=setup(hero,3);g.slots=[];const first=enemy(g,92,90),second=enemy(g,94,90),third=enemy(g,96,90);g.fireWeapon(weapon);tick(g,35);
    assert.ok(first.hp<first.maxHp,`${weapon} hits first target`);assert.ok(second.hp<second.maxHp,`${weapon} pierces second target`);assert.equal(third.hp,third.maxHp);
    const ice=setup(hero,1);ice.level='ice';ice.slots=[];ice.player.x=100;ice.player.y=90;const blocked=enemy(ice,108,90,'chuul');ice.fireWeapon(weapon);tick(ice,40);assert.equal(blocked.hp,blocked.maxHp,`${weapon} respects ice cover`);
  }
});

test('Scarlet Veil does not prevent Nightman contact',()=>{
  const g=setup('rogue');g.slots=[];g.elapsed=720;g.cleared=true;g.paused=true;assert.equal(g.continueEndless(),true);g.nightman.warningRemaining=0;g.nightman.x=g.player.x+1.2;g.nightman.y=g.player.y;g.player.invuln=0;g.bombCharge=g.bombRecharge;g.bomb();assert.equal(g.player.invuln,1);tick(g);assert.equal(g.dead,true);assert.equal(g.killedByNightman,true);
});

test('wisp never exceeds the shared pickup cap and does not reset cooldown on rejected spawn',()=>{
  const g=setup('healer');g.slots=[];g.player.health=20;g.pickups=Array.from({length:900},(_,i)=>({x:100+i/1000,y:100,kind:'xp',value:1,life:25}));let e=enemy(g,94);e.hp=1;g.damage(e,24,'spiritlantern');assert.equal(g.pickups.length,900);assert.equal(g.pickups.some(p=>p.kind==='wisp'),false);g.pickups=[];e=enemy(g,95);e.hp=1;g.damage(e,24,'spiritlantern');assert.equal(g.pickups.filter(p=>p.kind==='wisp').length,1);
});
