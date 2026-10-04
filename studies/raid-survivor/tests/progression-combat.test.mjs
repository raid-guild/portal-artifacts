import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';

const compile=async entry=>{const result=await build({entryPoints:[entry],bundle:true,platform:'node',format:'esm',write:false,absWorkingDir:process.cwd()});return import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);};
const {Game,HEROES,WEAPONS,realmPacing,ENEMY_CAP}=await compile('src/game.ts');
const {projectChestIndicators}=await compile('src/chest-indicators.ts');
const quiet=(hero,level='training',config)=>{const g=new Game(hero,level,config);g.enemies=[];g.slots=[];g.spawnClock=g.chestClock=-1e6;g.player.invuln=1e6;g.bossWave=999;return g;};
const enemy=(g,x=g.player.x+2,y=g.player.y)=>{const e=g.spawnEnemy('brute');e.x=x;e.y=y;e.hp=e.maxHp=10000;e.speed=e.damage=0;e.attackCd=1e6;e.special=null;return e;};
const tick=(g,n=1)=>{for(let i=0;i<n;i++)g.update(1/60);};
const config=(hero,level,perk=null,target=null)=>({version:'3',character:hero,level,skills:{vitality:1,agility:0,bombRecharge:0},equippedPerk:perk,target});

test('five heroes own distinct primaries and immutable v3 target/perk snapshots',()=>{
  for(const [hero,weapon,health] of [['warrior','cleaver',120],['tavern-keeper','tankard',110]]){
    const g=new Game(hero,'training');assert.equal(HEROES[hero].weapon,weapon);assert.equal(g.player.maxHealth,health);assert.deepEqual(g.slots,[weapon]);assert.ok(WEAPONS[weapon]);
  }
  const supplied=config('warrior','lava','warrior-blade-mastery',{checkpointId:'lava-720',thresholdMs:720000});
  const g=new Game('warrior','lava',supplied);supplied.skills.vitality=0;supplied.target.thresholdMs=1;
  assert.equal(g.player.maxHealth,126);assert.equal(g.config.skills.vitality,1);assert.equal(g.target.thresholdMs,720000);assert.equal(g.checkpointReached,false);
  g.elapsed=720;assert.equal(g.checkpointReached,true);
  assert.throws(()=>new Game('ranger','lava',supplied),/snapshot/);
  assert.throws(()=>new Game('warrior','lava',config('warrior','lava','ranger-thorn-precision')),/perk/);
});

test('new primaries remain owner-only reward choices and cleaver cone respects cover',()=>{
  for(const hero of ['ranger','wizard','dwarf','warrior','tavern-keeper']){
    const g=new Game(hero);const ids=g.rollRewards(false).filter(r=>r.kind==='weapon').map(r=>r.id);
    if(hero!=='warrior')assert.ok(!ids.includes('cleaver'));
    if(hero!=='tavern-keeper')assert.ok(!ids.includes('tankard'));
  }
  const g=quiet('warrior');g.weapons.cleaver=5;g.firing=true;g.aim={x:1,y:0};
  const front=enemy(g,g.player.x+2,g.player.y),back=enemy(g,g.player.x-2,g.player.y);g.buildGrid();g.fireWeapon('cleaver');
  assert.ok(front.hp<front.maxHp);assert.equal(back.hp,back.maxHp);
  assert.ok(front.maxHp-front.hp<100,'rank-five bounded followup');
  const wall=quiet('warrior','ice');wall.player.x=wall.player.y=90;const behind=enemy(wall,104,90);wall.buildGrid();wall.fireWeapon('cleaver');assert.equal(behind.hp,behind.maxHp);
  const boundary=quiet('warrior');boundary.weapons.cleaver=1;boundary.firing=true;boundary.aim={x:1,y:0};const boss=boundary.spawnEnemy('boss');boss.x=95;boss.y=90;boss.hp=boss.maxHp=10000;boss.speed=0;boundary.buildGrid();boundary.fireWeapon('cleaver');assert.equal(boss.maxHp-boss.hp,28,'large boss at spatial cell boundary is within exact blade reach');
  const counter=quiet('warrior','ice');const dog=counter.spawnEnemy('dogmole');dog.hp=dog.maxHp=10000;counter.damage(dog,20,'cleaver');assert.equal(dog.maxHp-dog.hp,25,'Cleaver is physical damage against Dogmole');
});

test('tankard impact splashes a bounded nearby group and rank five slows without changing warnings',()=>{
  const g=quiet('tavern-keeper');g.weapons.tankard=5;const target=enemy(g,g.player.x+2,g.player.y),neighbor=enemy(g,g.player.x+2.6,g.player.y+.4),far=enemy(g,g.player.x+8,g.player.y);neighbor.specialState='windup';neighbor.specialTimer=.8;
  g.buildGrid();g.projectile(g.player.x,g.player.y,0,16,55,'tankard',.34,0,1);
  tick(g,12);assert.ok(target.hp<target.maxHp);assert.ok(neighbor.hp<neighbor.maxHp);assert.equal(far.hp,far.maxHp);
  assert.ok(neighbor.slowed>0);assert.equal(neighbor.specialState,'windup');assert.equal(neighbor.specialTimer,.8);
});

test('perk effects modify only the equipped hero and honor health, range, utility and bomb limits',()=>{
  const normal=quiet('warrior'),focused=quiet('warrior','training',config('warrior','training','warrior-blade-mastery'));
  const n=enemy(normal),f=enemy(focused);normal.buildGrid();focused.buildGrid();normal.damage(n,20,'cleaver');focused.damage(f,20,'cleaver');assert.ok(Math.abs((f.maxHp-f.hp)/(n.maxHp-n.hp)-1.15)<1e-9);
  focused.player.health=focused.player.maxHealth*.5;const f2=enemy(focused);focused.damage(f2,20,'cleaver');assert.equal(f2.maxHp-f2.hp,n.maxHp-n.hp);
  const guard=quiet('dwarf','training',config('dwarf','training','dwarf-iron-guard'));guard.player.invuln=0;guard.bombCharge=guard.bombRecharge;guard.bomb();guard.hurtPlayer(20,.1);assert.equal(guard.player.maxHealth-guard.player.health,13);
  const tavern=quiet('tavern-keeper','training',config('tavern-keeper','training','tavern-healing-bomb'));tavern.player.health-=30;tavern.bombCharge=tavern.bombRecharge;tavern.bomb();assert.equal(tavern.player.maxHealth-tavern.player.health,5);
  const plainTavern=quiet('tavern-keeper');plainTavern.player.health-=30;plainTavern.bombCharge=plainTavern.bombRecharge;plainTavern.bomb();assert.equal(plainTavern.player.maxHealth-plainTavern.player.health,22);
  const warrior=quiet('warrior','training',config('warrior','training','warrior-directional-shockwave'));const ahead=enemy(warrior,warrior.player.x+3),behind=enemy(warrior,warrior.player.x-3);warrior.buildGrid();warrior.aim={x:1,y:0};warrior.bombCharge=warrior.bombRecharge;warrior.bomb();warrior.updateBomb(.6);assert.ok(ahead.hp<ahead.maxHp);assert.equal(behind.hp,behind.maxHp);
});

test('Ranger primary perk does not multiply Ranger bomb fragments',()=>{
  const g=quiet('ranger','training',config('ranger','training','ranger-thorn-precision'));
  const target=enemy(g,g.player.x+7,g.player.y);g.buildGrid();
  g.projectile(g.player.x,g.player.y,0,25,20,'thornbow',.2,0,1,false,true);
  tick(g,20);assert.equal(target.maxHp-target.hp,20);
});

test('Training and Forest delay ordinary cultists; Lava has bounded opening ranged pressure and final Moloch once',()=>{
  for(const level of ['training','forest']){
    const g=new Game('ranger',level);assert.equal(g.enemies.filter(e=>e.kind==='cultist').length,0);
    g.elapsed=29.9;g.scheduleShooters(ENEMY_CAP);assert.equal(g.enemies.filter(e=>e.kind==='cultist').length,0);
    g.elapsed=30;g.scheduleShooters(ENEMY_CAP);assert.equal(g.enemies.filter(e=>e.kind==='cultist').length,1);
    g.elapsed=60;g.scheduleShooters(ENEMY_CAP);assert.equal(g.enemies.filter(e=>e.kind==='cultist').length,2);
  }
  const lava=new Game('ranger','lava');assert.equal(lava.enemies.length,32);assert.equal(lava.enemies.filter(e=>e.kind==='cultist').length,4);
  assert.ok(lava.enemies.every(e=>['cultist','tosculi'].includes(e.kind)));
  assert.equal(lava.rollRewards(false)[0].id,'freeze','Lava opening offers a weakness relevant to its monsters');
  assert.ok(realmPacing('lava',0).target>realmPacing('ice',0).target);
  lava.enemies=[];lava.slots=[];lava.spawnClock=lava.chestClock=-1e6;lava.player.invuln=1e9;lava.elapsed=659.99;tick(lava,2);
  assert.equal(lava.finalBossSpawned,true);assert.equal(lava.enemies.filter(e=>e.kind==='boss').length,1);assert.equal(lava.enemies.find(e=>e.kind==='boss').tier,3);
  tick(lava,30);assert.equal(lava.enemies.filter(e=>e.kind==='boss').length,1,'group admissions are staggered');
});

test('offscreen chest arrows stay on safe edge and avoid excluded mobile controls',()=>{
  const pickups=[{x:40,y:90,kind:'chest',value:1,life:20},{x:140,y:90,kind:'chest',value:1,life:12},{x:90,y:90,kind:'chest',value:1,life:20},{x:150,y:90,kind:'chest',value:1,life:-1}];
  const project=(x,y)=>({x:206+(x-90)*10,y:457+(90-y)*10});
  const arrows=projectChestIndicators(pickups,{x:90,y:90},project,412,915,[{x:330,y:650,width:82,height:265}]);
  assert.equal(arrows.length,2);assert.ok(arrows.every(a=>a.x>=42&&a.x<=370&&a.y>=95&&a.y<=770));
  assert.ok(arrows.every(a=>!(a.x>=308&&a.y>=628)));
  assert.deepEqual(projectChestIndicators(pickups,{x:90,y:90},project,80,160),[]);
  const above=[{x:90,y:140,kind:'chest',value:1,life:20}];
  const mobileTopBlocked=[{x:0,y:0,width:210,height:125},{x:210,y:0,width:202,height:125}];
  const moved=projectChestIndicators(above,{x:90,y:90},project,412,915,mobileTopBlocked);
  assert.equal(moved.length,1,'straight-above chest remains indicated with a fully blocked top edge');
  assert.ok(moved[0].y>147,'arrow follows perimeter onto a side edge');
  const desktopProject=(x,y)=>({x:640+(x-90)*12,y:360+(90-y)*12});
  const desktop=projectChestIndicators(above,{x:90,y:90},desktopProject,1280,720,[{x:500,y:0,width:280,height:160}]);
  assert.equal(desktop.length,1);
  assert.ok(desktop[0].x<478||desktop[0].x>802,'desktop arrow avoids center timer exclusion');
});
