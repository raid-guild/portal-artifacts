import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';

const result=await build({entryPoints:['src/game.ts'],bundle:true,platform:'node',format:'esm',write:false,absWorkingDir:process.cwd()});
const {Game}=await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
const quiet=(hero='wizard',level='training')=>{const g=new Game(hero,level);g.enemies=[];g.slots=[];g.spawnClock=g.chestClock=-1e6;g.player.invuln=1e6;g.bossWave=999;return g;};
const placed=(g,kind,x,y)=>{const e=g.spawnEnemy(kind);e.x=x;e.y=y;e.hp=e.maxHp=1e6;e.speed=e.damage=0;e.special=null;e.attackCd=1e6;return e;};

test('rank five Storm Coil gives each foe at most one collateral hit per discharge, preserving direct jumps',()=>{
  const g=quiet();g.weapons.chain=5;g.firing=false;
  const rows=Array.from({length:24},(_,i)=>placed(g,'rat',g.player.x+4+(i%6)*.45,g.player.y+(Math.floor(i/6)-1.5)*.45));
  g.buildGrid();const hits=new Map(),direct=[];const damage=g.damage.bind(g);
  g.damage=(enemy,amount,source)=>{if(source==='chain'){if(amount===15)hits.set(enemy.id,(hits.get(enemy.id)||0)+1);else direct.push(enemy.id);}damage(enemy,amount,source);};
  g.fireWeapon('chain');
  assert.ok(direct.length>0&&direct.length<=7);assert.ok([...hits.values()].every(n=>n===1));
  assert.ok(rows.some(enemy=>direct.includes(enemy.id)&&hits.has(enemy.id)),'direct plus one collateral remains possible');
  const solo=quiet();solo.weapons.chain=5;const boss=placed(solo,'boss',solo.player.x+6,solo.player.y);solo.buildGrid();solo.fireWeapon('chain');assert.equal(boss.maxHp-boss.hp,50);
});

test('Frost preserves idle and recovery timers, interrupts active casts, and allows later Xorn warnings',()=>{
  const g=quiet('wizard','forest');g.elapsed=150;g.runes.freeze=true;
  const x=g.spawnEnemy('xorn');x.x=g.player.x+8;x.y=g.player.y;x.hp=x.maxHp=1e9;x.speed=x.damage=0;x.specialCd=0;
  x.specialState='idle';x.specialTimer=9;x.specialCd=2.4;g.damage(x,1,'arcwand');assert.equal(x.specialState,'idle');assert.equal(x.specialTimer,9);assert.equal(x.specialCd,2.4);assert.equal(x.frozen,.5);assert.equal(x.freezeImmune,3);
  x.specialState='recovery';x.specialTimer=1.7;x.specialCd=1.9;x.freezeImmune=0;g.damage(x,1,'arcwand');assert.equal(x.specialState,'recovery');assert.equal(x.specialTimer,1.7);assert.equal(x.specialCd,1.9);
  x.specialState='windup';x.specialTimer=.9;x.freezeImmune=0;g.damage(x,1,'arcwand');assert.equal(x.specialState,'recovery');assert.ok(x.specialTimer>=.9);
  x.specialState='idle';x.specialCd=0;x.frozen=.5;x.freezeImmune=3;
  let warnings=0,wasWindup=false;
  for(let tick=0;tick<1800;tick++){
    g.damage(x,1,'arcwand');g.update(1/60);
    x.x=g.player.x+8;x.y=g.player.y;
    if(x.frozen>0)assert.notEqual(x.specialState,'windup','frozen foes cannot start a warning');
    const windup=x.specialState==='windup';if(windup&&!wasWindup)warnings++;wasWindup=windup;
  }
  assert.ok(warnings>=2,`expected recurring warnings, saw ${warnings}`);
  const ef=quiet('wizard','forest');ef.elapsed=210;ef.runes.freeze=true;const e=ef.spawnEnemy('efreeti');e.x=ef.player.x+8;e.y=ef.player.y;e.hp=e.maxHp=1e9;e.speed=e.damage=0;e.specialCd=0;e.frozen=.4;ef.update(1/60);assert.equal(e.specialState,'idle');
});

test('Wizard bomb chains leave 55 percent for the later full wave; other heroes retain their bomb damage',()=>{
  const totals=[];
  for(const hero of ['ranger','wizard','dwarf']){
    const g=quiet(hero);const rows=Array.from({length:9},(_,i)=>placed(g,'brute',92+(i%3)*.5,90+(Math.floor(i/3)-1)*.5));
    for(const e of rows)e.hp=e.maxHp=10000;
    g.buildGrid();g.bombCharge=g.bombRecharge;assert.equal(g.bomb(),true);
    for(let i=0;i<40;i++)g.update(1/60);
    totals.push(rows.reduce((sum,e)=>sum+e.maxHp-e.hp,0));
  }
  assert.ok(Math.abs(totals[0]-734.4)<1e-5,`ranger ${totals[0]}`);
  assert.ok(Math.abs(totals[1]-486)<1e-5,`wizard ${totals[1]}`);
  assert.ok(Math.abs(totals[2]-594)<1e-5,`dwarf ${totals[2]}`);
  const g=quiet();const outside=placed(g,'brute',g.player.x+3,g.player.y),inside=placed(g,'brute',g.player.x+2,g.player.y);
  g.buildGrid();g.bombCharge=g.bombRecharge;g.bomb();g.updateBomb(.2);
  assert.ok(outside.hp<outside.maxHp&&inside.hp<inside.maxHp);
  assert.ok(g.bombWave.chained.size>0);
});

test('non-Training elite brute HP rises continuously by paced time and keeps its spawn snapshot',()=>{
  const hp=(level,paced)=>{const g=quiet('ranger',level);g.elapsed=paced*(level==='desert'?420/300:level==='ice'?540/300:1);const e=g.spawnEnemy('brute',true);return {g,e};};
  for(const level of ['forest','desert','ice']){
    const points=[180,181,239,240,300,360].map(p=>hp(level,p));
    const values=points.map(({e})=>e.maxHp);
    assert.ok(values[0]<values[1]&&values[1]<values[2]&&values[2]<values[3]&&values[3]<values[4],`${level}: ${values}`);
    assert.equal(points[0].e.special,'juggernaut');assert.equal(points[3].e.special,'juggernaut');
    const existing=points[0].e.maxHp;points[0].g.elapsed+=120;assert.equal(points[0].e.maxHp,existing);
    assert.ok(Math.abs(values[2]-1292)<2,`${level} 239: ${values[2]}`);
    assert.ok(Math.abs(values[3]-1310)<2,`${level} 240: ${values[3]}`);
    for(const point of points.slice(4)){
      const ordinary=point.g.spawnEnemy('brute');
      assert.ok(Math.abs(point.e.maxHp/ordinary.maxHp-18)<1e-9,`${level} elite HP is 3x elite × 6x capped special`);
    }
    assert.ok(values[5]>values[4],`${level} ordinary base HP still grows after the special multiplier caps`);
  }
  const training=hp('training',240).e;assert.equal(training.special,'juggernaut');assert.ok(training.maxHp>2000);
});

test('Resolve and Spring describe the existing 35-health restore',()=>{
  for(const [realm,name] of [['forest','Endless Resolve'],['ice','Renewing Spring']]){
    const g=quiet('ranger',realm),resolve=g.rollRewards(false).find(row=>row.id==='resolve');
    assert.equal(resolve.name,name);assert.match(resolve.detail,/restore 35/);
    g.player.health=20;g.awaitingReward=true;g.chooseReward(resolve);assert.equal(g.player.health,55);
  }
});
