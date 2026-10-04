import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';

const compiled=await build({entryPoints:['src/game.ts'],bundle:true,platform:'node',format:'esm',write:false,absWorkingDir:process.cwd()});
const {Game,lavaMolochPressure,MAX_HAZARDS}=await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString('base64')}`);
const setup=(level='lava',tier=2,elapsed=540,hero='dwarf',perk=null)=>{
  const config=perk?{version:'',character:hero,level,skills:{vitality:0,agility:0,bombRecharge:0},equippedPerk:perk,target:null}:null;
  // The ordinary constructor keeps the test independent of leaderboard version strings.
  const g=config?new Game(hero,level,{...config,version:new Game(hero,level).config.version}):new Game(hero,level);
  g.enemies=[];g.slots=[];g.spawnClock=g.chestClock=-1e9;g.lavaBossAdmitted=999;g.endless=true;g.elapsed=elapsed;g.player.health=200;g.player.maxHealth=200;g.player.invuln=0;
  const boss=g.spawnEnemy('boss',false,tier);assert.ok(boss);boss.x=g.player.x+8;boss.y=g.player.y;boss.speed=0;boss.damage=0;boss.hp=boss.maxHp=1e9;boss.attackCd=0;boss.attackPhase=1;g.buildGrid();return {g,boss};
};
const tick=(g,n=1)=>{for(let i=0;i<n;i++)g.update(1/60);};

test('Lava Moloch pressure changes at exact late boundaries only',()=>{
  for(const [time,interval,damage] of [[0,3.2,22],[539.999,3.2,22],[540,2.8,75],[599.999,2.8,75],[600,2.6,75],[659.999,2.6,75],[660,2.4,80]])
    assert.deepEqual(lavaMolochPressure(time),{interval,markDamage:damage});
  for(const level of ['training','forest','desert','ice']){
    const {g,boss}=setup(level,2,660);tick(g);assert.equal(boss.attackCd,3.2);assert.deepEqual(g.hazards.map(h=>h.damage),[22,22,22]);
  }
});

test('cast fixes count, delay, locked positions, damage, and next interval at creation',()=>{
  for(const [time,tier,count,delay,damage,interval] of [[539,2,3,1.25,22,3.2],[540,2,3,1.25,75,2.8],[600,2,3,1.25,75,2.6],[660,3,5,1.4,80,2.4]]){
    const {g,boss}=setup('lava',tier,time);tick(g);assert.equal(boss.attackCd,interval);assert.equal(g.hazards.length,count);
    const marks=g.hazards.map(h=>({x:h.x,y:h.y,damage:h.damage,duration:h.duration,sourceId:h.sourceId}));
    assert.ok(marks.every(h=>h.damage===damage&&h.duration===delay&&h.sourceId===boss.id));
    g.elapsed=720;g.player.x+=2;g.player.y+=3;
    assert.deepEqual(g.hazards.map(h=>({x:h.x,y:h.y,damage:h.damage,duration:h.duration,sourceId:h.sourceId})),marks,'warning stays locked with creation damage');
  }
  const {g,boss}=setup('lava',1,300);tick(g);assert.equal(g.hazards.length,0,'tier one has no ground marks');assert.equal(boss.attackCd,3.2);
});

test('marks remove 75/80 HP, obey guard, dodge and dash, and overlap hits once',()=>{
  for(const [time,damage] of [[540,75],[660,80]]){
    const {g}=setup('lava',3,time);tick(g);g.player.invuln=0;g.updateHazards(1.5);assert.equal(g.player.health,200-damage);
  }
  const guarded=setup('lava',3,660,'dwarf','dwarf-iron-guard');tick(guarded.g);guarded.g.bombCharge=guarded.g.bombRecharge;assert.equal(guarded.g.bomb(),true);guarded.g.player.invuln=0;guarded.g.updateHazards(1.5);assert.equal(guarded.g.player.health,200-80*.65);
  const dodge=setup('lava',3,660);tick(dodge.g);dodge.g.player.x+=8;dodge.g.updateHazards(1.5);assert.equal(dodge.g.player.health,200);
  const dash=setup('lava',3,660);tick(dash.g);dash.g.dash();dash.g.updateHazards(1.5);assert.equal(dash.g.player.health,200);
  const overlap=setup('lava',3,660);tick(overlap.g);overlap.g.hazards.push({...overlap.g.hazards[2]});overlap.g.updateHazards(1.5);assert.equal(overlap.g.player.health,120,'overlap respects contact invulnerability');
});

test('source death cancels warnings; three Molochs share hazard cap and late cadence increases casts',()=>{
  const cancelled=setup('lava',3,660);tick(cancelled.g);cancelled.g.damage(cancelled.boss,1e10,'bomb');assert.equal(cancelled.g.hazards.length,0);cancelled.g.updateHazards(1.5);assert.equal(cancelled.g.player.health,200);
  const crowded=setup('lava',3,660);crowded.g.player.invuln=1e9;
  for(let i=0;i<2;i++){const e=crowded.g.spawnEnemy('boss',false,3);e.x=crowded.g.player.x+8+i;e.y=crowded.g.player.y+i;e.speed=0;e.damage=0;e.hp=e.maxHp=1e9;e.attackCd=.5+i*.8;e.attackPhase=1;}
  let max=0;for(let i=0;i<60*12;i++){tick(crowded.g);max=Math.max(max,crowded.g.hazards.length);}assert.ok(max<=MAX_HAZARDS);assert.equal(crowded.g.enemies.filter(e=>e.kind==='boss').length,3);
  const casts=time=>{const {g,boss}=setup('lava',1,time);g.player.invuln=1e9;tick(g,60*30);return boss.attackPhase;};
  assert.ok(casts(660)>casts(300),'late boss attacks more often over equal fixed simulation time');
});
