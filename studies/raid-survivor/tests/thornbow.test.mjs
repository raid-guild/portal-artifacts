import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';

const result=await build({entryPoints:['src/game.ts'],bundle:true,platform:'node',format:'esm',write:false,absWorkingDir:process.cwd()});
const {Game,WEAPONS}=await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
function setup(level='training',rank=5){
  const g=new Game('ranger',level);g.enemies=[];g.effects=[];g.slots=[];g.spawnClock=g.chestClock=-1e6;
  g.player.invuln=1e6;g.firing=true;g.aim={x:1,y:0};g.weapons.thornbow=rank;return g;
}
function enemy(g,x,y,kind='rat'){
  const e=g.spawnEnemy(kind);e.x=x;e.y=y;e.hp=e.maxHp=1e6;e.speed=0;e.attackCd=1e6;e.special=null;return e;
}
function oneArrow(g){g.fireWeapon('thornbow');const all=g.projectiles;g.projectiles=[all[Math.floor(all.length/2)]];return g.projectiles[0];}
const dealt=rows=>rows.reduce((n,e)=>n+e.maxHp-e.hp,0);
const zaps=g=>g.effects.filter(effect=>effect.kind==='zap').length;

test('Thornbow preserves volley, pierce, and cadence while reducing only rank four and five damage',()=>{
  const damage=[17,22,27,30,32],count=[1,2,2,3,5],pierce=[0,1,1,2,2];
  for(let rank=1;rank<=5;rank++){
    const g=setup('training',rank);g.fireWeapon('thornbow');
    assert.equal(g.projectiles.length,count[rank-1]);
    assert.ok(g.projectiles.every(p=>p.damage===damage[rank-1]&&p.pierce===pierce[rank-1]&&p.thornBurstPending===(rank===5)));
  }
  assert.equal(WEAPONS.thornbow.cooldown,.27);
});

test('one rank-five arrow has a single three-target burst even inside large overlapping packs',()=>{
  for(const size of [8,32]){
    const g=setup(),p=g.player,rows=Array.from({length:size},()=>enemy(g,p.x+1.5,p.y));
    oneArrow(g);g.update(.05);
    assert.ok(Math.abs(dealt(rows)-124.8)<1e-5,`${size} foes took ${dealt(rows)} damage`);
    assert.equal(zaps(g),3);assert.equal(g.projectiles[0]?.thornBurstPending,undefined,'piercing arrow is spent after three direct hits');
  }
});

test('piercing later ticks do not repeat the burst',()=>{
  const g=setup(),p=g.player;
  let burstCount=0;const effect=g.effect.bind(g);g.effect=item=>{if(item.kind==='zap')burstCount++;effect(item);};
  enemy(g,p.x+1.5,p.y);for(let i=0;i<4;i++)enemy(g,p.x+1.5,p.y+.7+i*.1);
  const later=enemy(g,p.x+4.5,p.y);oneArrow(g);
  for(let i=0;i<6;i++)g.update(.05);
  assert.equal(burstCount,3);assert.ok(later.hp<later.maxHp,'the same arrow can still pierce a later target');
});

test('bomb fragments and arrows fired before an upgrade never acquire the rank-five burst',()=>{
  const g=setup('training',4),p=g.player;for(let i=0;i<8;i++)enemy(g,p.x+1.5,p.y);
  const arrow=oneArrow(g);assert.equal(arrow.damage,30);assert.equal(arrow.thornBurstPending,false);
  g.weapons.thornbow=5;g.update(.05);assert.equal(zaps(g),0);
  const bomb=setup();bomb.bombCharge=bomb.bombRecharge;assert.equal(bomb.bomb(),true);bomb.updateBomb(.2);
  assert.equal(bomb.projectiles.length,24);assert.ok(bomb.projectiles.every(p=>p.kind==='thornbow'&&p.thornBurstPending===false));
});

test('burst respects ice cover but reaches nearby targets across desert water',()=>{
  const ice=setup('ice');ice.player.x=104;ice.player.y=87;ice.aim={x:0,y:1};
  const front=enemy(ice,104,88.8,'chuul'),behind=enemy(ice,104,91.2,'chuul');oneArrow(ice);ice.update(.05);
  assert.ok(front.hp<front.maxHp);assert.equal(behind.hp,behind.maxHp);
  const desert=setup('desert');desert.player.x=102;desert.player.y=91;
  const target=enemy(desert,103,91,'deathwisp'),near=enemy(desert,105,91,'deathwisp');oneArrow(desert);desert.update(.05);
  assert.ok(target.hp<target.maxHp);assert.ok(near.hp<near.maxHp);
});

test('elemental counter and passive damage apply once to each direct or burst hit',()=>{
  const g=setup('forest');g.runes.light=true;g.passives.damage=1;const p=g.player;
  const target=enemy(g,p.x+1.5,p.y,'rageipede'),near=enemy(g,p.x+1.5,p.y+.8,'rageipede');oneArrow(g);g.update(.05);
  assert.ok(Math.abs((target.maxHp-target.hp)-32*1.18*1.25)<1e-6);
  assert.ok(Math.abs((near.maxHp-near.hp)-32*.30*1.18*1.25)<1e-6);
});
