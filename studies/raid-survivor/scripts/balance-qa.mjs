import { build } from 'esbuild';
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const args=process.argv.slice(2);
const option=name=>{const index=args.indexOf(name);return index>=0?args[index+1]:null;};
const baselinePath=option('--baseline'),outputPath=option('--out');
const source=await build({entryPoints:['src/game.ts'],bundle:true,platform:'node',format:'esm',write:false,absWorkingDir:process.cwd()});
const currentModule=await import(`data:text/javascript;base64,${Buffer.from(source.outputFiles[0].text).toString('base64')}`);
const baseline=baselinePath?await import(pathToFileURL(resolve(baselinePath)).href):null;
const seeds=[11,23,47],starterHeroes=['ranger','wizard','dwarf'],starterLevels=['training','forest','desert','ice'];
const allHeroes=[...starterHeroes,'warrior','tavern-keeper'],allLevels=[...starterLevels,'lava'];
const weapons=['thornbow','arcwand','scattergun','chain','orbit','comet'],ranks=[1,3,4,5];
function seeded(seed,run){let value=seed>>>0,original=Math.random;Math.random=()=>{value=(Math.imul(value,1664525)+1013904223)>>>0;return value/4294967296;};try{return run();}finally{Math.random=original;}}
function reseed(seed){let value=seed>>>0;Math.random=()=>{value=(Math.imul(value,1664525)+1013904223)>>>0;return value/4294967296;};}
const round=n=>Math.round(n*1000)/1000;
const total=rows=>rows.reduce((sum,e)=>sum+e.maxHp-e.hp,0);
function quiet(Game,hero='ranger',level='training'){
  const game=new Game(hero,level);game.enemies=[];game.slots=[];game.spawnClock=game.chestClock=-1e6;game.bossWave=999;game.player.invuln=1e6;return game;
}
function target(game,kind,x,y){const e=game.spawnEnemy(kind);e.x=x;e.y=y;e.hp=e.maxHp=1e9;e.speed=e.damage=0;e.special=null;e.attackCd=1e9;return e;}
function weaponFixture(Game,weapon,rank,shape,hero='ranger'){return seeded(771,()=>{
  const game=quiet(Game,hero);game.weapons[weapon]=rank;game.slots=[weapon];game.firing=false;
  const x=game.player.x+(weapon==='cleaver'?2.2:6),y=game.player.y;
  const enemies=shape==='boss'?[target(game,'boss',x,y)]:shape==='grid'?
    Array.from({length:49},(_,i)=>target(game,'rat',x+Math.floor(i/7)*.55,y+(i%7-3)*.55)):
    Array.from({length:24},(_,i)=>target(game,'rat',x+Math.cos(i*Math.PI/12)*3.2,y+Math.sin(i*Math.PI/12)*3.2));
  reseed(771); // Weapon RNG starts after construction so changed opening mixes cannot shift it.
  let direct=0,collateral=0;const damage=game.damage.bind(game);
  game.damage=(enemy,amount,source)=>{if(source==='chain'){if(amount===15)collateral++;else direct++;}damage(enemy,amount,source);};
  let warm=0;for(let tick=0;tick<1200;tick++){game.update(1/60);if(tick===119)warm=total(enemies);}
  return {dps:round((total(enemies)-warm)/18),damage20:round(total(enemies)),directJumps:direct,collateralHits:collateral,alive:enemies.filter(e=>e.hp>0).length};
});}
function comboFixture(Game,slots,rank,damagePassive,cooldownPassive){return seeded(771,()=>{
  const game=quiet(Game);game.slots=[...slots];for(const weapon of slots)game.weapons[weapon]=rank;
  game.passives.damage=damagePassive;game.passives.cooldown=cooldownPassive;
  const x=game.player.x+6,y=game.player.y,rows=Array.from({length:49},(_,i)=>target(game,'rat',x+Math.floor(i/7)*.55,y+(i%7-3)*.55));
  reseed(771);
  let warm=0;for(let tick=0;tick<1200;tick++){game.update(1/60);if(tick===119)warm=total(rows);}
  return {dps:round((total(rows)-warm)/18),damage20:round(total(rows)),alive:rows.filter(e=>e.hp>0).length};
});}
function bombFixture(Game,hero){return seeded(771,()=>{
  const game=quiet(Game,hero),rows=Array.from({length:9},(_,i)=>target(game,'brute',92+(i%3)*.5,90+(Math.floor(i/3)-1)*.5));
  for(const e of rows)e.hp=e.maxHp=10000;
  game.buildGrid();game.bombCharge=game.bombRecharge;game.bomb();for(let i=0;i<40;i++)game.update(1/60);
  return {total:round(total(rows)),minimum:round(Math.min(...rows.map(e=>e.maxHp-e.hp))),maximum:round(Math.max(...rows.map(e=>e.maxHp-e.hp)))};
});}
function frostFixture(Game,kind){return seeded(771,()=>{
  const game=quiet(Game,'wizard','forest');game.elapsed=210;game.runes.freeze=true;
  const enemy=game.spawnEnemy(kind);enemy.x=game.player.x+8;enemy.y=game.player.y;enemy.hp=enemy.maxHp=1e9;enemy.speed=enemy.damage=0;enemy.specialCd=0;
  let warnings=0,whileFrozen=0,previous=false;
  for(let i=0;i<1800;i++){game.damage(enemy,1,'arcwand');game.update(1/60);enemy.x=game.player.x+8;enemy.y=game.player.y;
    const warning=enemy.specialState==='windup';if(warning&&!previous)warnings++;if(warning&&enemy.frozen>0)whileFrozen++;previous=warning;
  }
  return {warningStarts:warnings,warningFramesWhileFrozen:whileFrozen,damage:round(enemy.maxHp-enemy.hp)};
});}
function eliteFixture(Game,level,paced){return seeded(771,()=>{const game=quiet(Game,'ranger',level);game.elapsed=paced*(level==='desert'?420/300:level==='ice'?540/300:level==='lava'?720/300:1);const enemy=game.spawnEnemy('brute',true);return {hp:round(enemy.maxHp),special:enemy.special};});}
function survivalFixture(Game,seed,hero,level,mode,horizon=45,startPaced=0){return seeded(seed,()=>{
  const game=new Game(hero,level),primary=game.slots[0];game.player.invuln=0;game.onReward=choices=>game.chooseReward(choices[0]);
  if(level!=='training'){game.awaitingReward=true;game.chooseReward(game.rollRewards(false)[0]);}
  if(mode==='orbit-build'){game.slots=[primary,'orbit'];game.weapons[primary]=3;game.weapons.orbit=3;game.passives.damage=1;}
  if(startPaced){game.elapsed=startPaced*(level==='desert'?420/300:level==='ice'?540/300:level==='lava'?720/300:1);game.endless=true;game.bossWave=Math.floor(startPaced/60);game.slots=[primary,'orbit','chain'];game.weapons[primary]=4;game.weapons.orbit=4;game.weapons.chain=3;game.passives.damage=2;game.passives.cooldown=2;}
  let peakEnemies=game.enemies.length,peakShots=0,ticks=0;
  for(;ticks<horizon*60&&!game.dead;ticks++){
    if(mode==='orbit-move'||mode==='fixed-build-move'){
      const angle=game.elapsed*.085,targetX=90+20*Math.cos(angle),targetY=90+20*Math.sin(angle);
      game.move.x=targetX-game.player.x;game.move.y=targetY-game.player.y;
    }
    game.update(1/60);peakEnemies=Math.max(peakEnemies,game.enemies.length);peakShots=Math.max(peakShots,game.enemyShots.length);
  }
  return {seed,hero,level,mode,startPaced,seconds:round(ticks/60),died:game.dead,health:round(game.player.health),kills:game.stats.kills,score:game.score,peakEnemies,peakShots};
});}
function runModule(module,label,expanded=false){const {Game}=module;const weaponResults={},heroes=expanded?allHeroes:starterHeroes,levels=expanded?allLevels:starterLevels;
  for(const weapon of weapons)for(const rank of ranks)for(const shape of ['boss','grid','ring'])weaponResults[`${weapon}:${rank}:${shape}`]=weaponFixture(Game,weapon,rank,shape);
  const combos={mid:comboFixture(Game,['thornbow','chain','orbit'],4,2,2),late:comboFixture(Game,['chain','arcwand','comet'],5,3,3)};
  const newHeroPrimaries=expanded?Object.fromEntries([['warrior','cleaver'],['tavern-keeper','tankard']].map(([hero,weapon])=>[hero,Object.fromEntries(ranks.map(rank=>[rank,weaponFixture(Game,weapon,rank,'grid',hero)]))])):null;
  const bombs=Object.fromEntries(heroes.map(hero=>[hero,bombFixture(Game,hero)]));
  const frost={xorn:frostFixture(Game,'xorn'),efreeti:frostFixture(Game,'efreeti')};
  const elite=Object.fromEntries(levels.map(level=>[level,Object.fromEntries([180,181,239,240,300].map(paced=>[paced,eliteFixture(Game,level,paced)]))]));
  const opening=[];for(const seed of seeds)for(const hero of heroes)for(const level of levels)for(const mode of ['stationary','orbit-move','orbit-build'])opening.push(survivalFixture(Game,seed,hero,level,mode));
  const later=[];for(const seed of seeds)for(const level of (expanded?['forest','ice','lava']:['forest','ice']))for(const paced of [180,300])for(const mode of ['fixed-build','fixed-build-move'])later.push(survivalFixture(Game,seed,'ranger',level,mode,30,paced));
  return {label,weapons:weaponResults,newHeroPrimaries,combos,bombs,frost,elite,pacing:{opening,later}};
}
const report={
  setup:{
    seedFormula:'LCG: state=(state*1664525+1013904223)>>>0',weaponSeed:771,pacingSeeds:seeds,
    weaponSeconds:20,warmupSeconds:2,
    shapes:{boss:'one immortal stationary boss at (+6,0)',grid:'49 immortal stationary rats in a 7x7 grid beginning at (+6,-1.65)',ring:'24 immortal stationary rats, radius 3.2 around (+6,0)'},
    combos:{mid:'Thornbow/Storm Coil/Orbit at rank 4; damage and cooldown passives rank 2',late:'Storm Coil/Arc Wand/Falling Star at rank 5; damage and cooldown passives rank 3'},
    bomb:'nine stationary 10000 HP brutes, 40 ticks',
    pacing:'finite-health 45-second opening runs for every available hero/realm/seed: stationary and deterministic orbit movement with identical starting loadouts, plus a separate upgraded Orbit weapon build; 30-second fixed-build Ranger Forest/Ice/Lava at paced 180/300 with stationary/moving matched pairs. Movement targets a radius-20 circle about (90,90) at angle elapsed*0.085. Baseline retains only its original three heroes/four realms.',
    limitations:['Immortal-target DPS is deterministic throughput, not a win rate.','Finite-health movement follows a fixed circle; it omits human steering and adaptive reward choices.','Node simulation does not measure phone frame rate or subjective fun.'],
  },
  current:runModule(currentModule,'current',true),
};
if(baseline)report.baseline=runModule(baseline,'pre-pass saved bundle');
const json=JSON.stringify(report,null,2)+'\n';
if(outputPath){
  await mkdir(dirname(resolve(outputPath)),{recursive:true});await writeFile(resolve(outputPath),json);
  const pacingPath=resolve(option('--pacing-out')||resolve(dirname(outputPath),'pacing','comparison.json'));
  await mkdir(dirname(pacingPath),{recursive:true});
  await writeFile(pacingPath,JSON.stringify({setup:report.setup.pacing,seeds,current:report.current.pacing,baseline:report.baseline?.pacing??null},null,2)+'\n');
  console.log(`Wrote ${resolve(outputPath)} and ${pacingPath}`);
}else process.stdout.write(json);
