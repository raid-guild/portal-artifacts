import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';

const compiled=await build({entryPoints:['src/game.ts'],bundle:true,platform:'node',format:'esm',write:false,absWorkingDir:process.cwd()});
const {Game,HEROES,WEAPONS}=await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString('base64')}`);
const setup=(rank=1,level='training',config)=>{const g=new Game('dwarf',level,config);g.enemies=[];g.slots=[];g.spawnClock=g.chestClock=-1e9;g.player.invuln=1e9;g.firing=true;g.aim.x=1;g.aim.y=0;g.weapons.runeaxes=rank;return g;};
const tick=(g,n=1)=>{for(let i=0;i<n;i++)g.update(1/60);};
const enemy=(g,x,y,kind='rat')=>{const e=g.spawnEnemy(kind);e.x=x;e.y=y;e.speed=0;e.damage=0;e.hp=e.maxHp=1e6;e.attackCd=1e6;e.special=null;g.buildGrid();return e;};

test('Dwarf starts with distinct Rune Axes; Scattergun remains a separate pickup',()=>{
  const g=new Game('dwarf');assert.equal(HEROES.dwarf.weapon,'runeaxes');assert.deepEqual(g.slots,['runeaxes']);assert.equal(g.weapons.runeaxes,1);assert.equal(g.weapons.scattergun,undefined);
  assert.equal(WEAPONS.runeaxes.cooldown,.84);assert.equal(WEAPONS.scattergun.cooldown,.62);
  const reward={kind:'weapon',id:'scattergun',name:'Runic Scattergun',detail:'',rarity:'common',icon:'✷'};g.awaitingReward=true;g.chooseReward(reward);assert.ok(g.slots.includes('scattergun'));assert.equal(g.weapons.scattergun,1);
  g.awaitingReward=true;g.chooseReward({...reward,id:'runeaxes'});assert.equal(g.weapons.runeaxes,2);
});

test('ranks keep three axes until rank five, with fixed damage, life, pierce, and inward turns',()=>{
  for(let rank=1;rank<=5;rank++){
    const g=setup(rank);g.fireWeapon('runeaxes');const axes=g.projectiles;
    assert.equal(axes.length,rank===5?5:3);
    assert.ok(axes.every(a=>a.kind==='runeaxes'&&a.damage===21+rank*3&&a.life===.64+rank*.04&&a.pierce===(rank>=3?1:0)&&Math.abs(Math.hypot(a.vx,a.vy)-13)<1e-10&&a.runeGold===(rank===5)));
    const offsets=rank===5?[-.32,-.16,0,.16,.32]:[-.24,0,.24];
    for(let i=0;i<axes.length;i++){const axe=axes[i];assert.ok(Math.abs(Math.atan2(axe.vy,axe.vx)-offsets[i])<1e-9);assert.ok(Math.abs(axe.turnRate+2*offsets[i]/axe.life)<1e-9);}
    const outer=axes.at(-1);g.projectiles=[outer];const firstAngle=Math.atan2(outer.vy,outer.vx);tick(g,Math.floor(outer.life*30));assert.ok(Math.abs(Math.atan2(outer.vy,outer.vx))<firstAngle*.2,'outer axe turns toward center by mid-flight');
  }
});

test('swept axis collision hits on high-speed steps, rank-three pierces once, and cover still blocks',()=>{
  const g=setup(3),a=enemy(g,92,90),b=enemy(g,94,90),c=enemy(g,96,90);g.fireWeapon('runeaxes');g.projectiles=[g.projectiles[1]];tick(g,35);
  assert.equal(a.maxHp-a.hp,30);assert.equal(b.maxHp-b.hp,30);assert.equal(c.hp,c.maxHp);
  const base=setup(1),first=enemy(base,92,90),second=enemy(base,94,90);base.fireWeapon('runeaxes');base.projectiles=[base.projectiles[1]];tick(base,35);assert.equal(first.maxHp-first.hp,24);assert.equal(second.hp,second.maxHp);
  const ice=setup(1,'ice');ice.player.x=100;ice.player.y=90;const behind=enemy(ice,108,90,'chuul');ice.fireWeapon('runeaxes');ice.projectiles=[ice.projectiles[1]];tick(ice,40);assert.equal(behind.hp,behind.maxHp);
  const desert=setup(1,'desert');desert.player.x=100;desert.player.y=91;const across=enemy(desert,108,91,'deathwisp');desert.fireWeapon('runeaxes');desert.projectiles=[desert.projectiles[1]];tick(desert,40);assert.ok(across.hp<across.maxHp,'axes pass over water');
});

test('Dogmole physical counter and existing Dwarf perk ID apply to the new primary',()=>{
  const version=new Game('dwarf').config.version;
  const config={version,character:'dwarf',level:'ice',skills:{vitality:0,agility:0,bombRecharge:0},equippedPerk:'dwarf-scatter-mastery',target:null};
  const g=setup(1,'ice',config),dog=enemy(g,92,90,'dogmole');g.damage(dog,24,'runeaxes');assert.equal(dog.maxHp-dog.hp,24*1.15*1.25);
  dog.hp=1;g.damage(dog,2,'runeaxes');assert.equal(g.monsters.dogmole.counterKills,1);
});

test('axes fired before an upgrade retain their old flight while new shots evolve; Scattergun tuning is unchanged',()=>{
  const g=setup(1);g.fireWeapon('runeaxes');const old=g.projectiles.map(p=>({shot:p,damage:p.damage,pierce:p.pierce,life:p.life,turnRate:p.turnRate,runeGold:p.runeGold}));
  g.weapons.runeaxes=5;tick(g,8);
  for(const row of old){assert.equal(row.shot.damage,row.damage);assert.equal(row.shot.pierce,row.pierce);assert.equal(row.shot.turnRate,row.turnRate);assert.equal(row.shot.runeGold,row.runeGold);assert.ok(row.shot.life<row.life);}
  g.projectiles=[];g.fireWeapon('runeaxes');assert.equal(g.projectiles.length,5);assert.ok(g.projectiles.every(p=>p.damage===36&&p.pierce===1&&p.runeGold));
  for(const rank of [1,3,5]){const scatter=setup(rank);scatter.weapons.scattergun=rank;scatter.fireWeapon('scattergun');assert.equal(scatter.projectiles.length,5+rank*2+(rank===5?12:0));assert.ok(scatter.projectiles.slice(0,5+rank*2).every(p=>p.damage===6+rank*2.5&&p.life===.48&&p.turnRate===undefined));
    if(rank===5)scatter.projectiles.slice(15).forEach((p,i)=>{assert.equal(p.damage,9);assert.equal(p.life,.42);assert.equal(p.radius,.2);assert.ok(Math.abs(p.vx-15*Math.cos(i*Math.PI/6))<1e-10);assert.ok(Math.abs(p.vy-15*Math.sin(i*Math.PI/6))<1e-10);});
  }
});

test('outer axes converge back toward the launch centerline while x advances throughout flight',()=>{
  for(const rank of [1,5]){
    const g=setup(rank);g.fireWeapon('runeaxes');const axe=g.projectiles.at(-1);g.projectiles=[axe];
    let previousX=axe.x,peak=0,steps=0;
    while(g.projectiles.includes(axe)&&steps++<60){g.update(1/60);if(g.projectiles.includes(axe))assert.ok(axe.x>previousX,'forward travel stays monotonic');previousX=axe.x;peak=Math.max(peak,Math.abs(axe.y-90));}
    assert.ok(peak>.35,'outer axe visibly arcs away first');
    assert.ok(Math.abs(axe.y-90)<.15,'the curved path returns near the centerline by expiry');
  }
});
