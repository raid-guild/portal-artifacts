import {build} from 'esbuild';
import {performance} from 'node:perf_hooks';
import {readFile} from 'node:fs/promises';

const source=await readFile('src/obstacles.ts','utf8');
const compile=async(enabled)=>{
  const result=await build({entryPoints:['src/game.ts'],bundle:true,platform:'node',format:'esm',write:false,absWorkingDir:process.cwd(),plugins:enabled?[]:[{name:'no-obstacles-benchmark',setup(b){b.onLoad({filter:/obstacles\.ts$/},()=>({contents:source.replace(/export const obstaclesFor = \(level: TerrainLevel\): readonly Obstacle\[\] => [^;]+;/,'export const obstaclesFor = (_level: TerrainLevel): readonly Obstacle[] => [];').replace('const DESERT_CELLS=cellsFor(DESERT),ICE_CELLS=cellsFor(ICE);','const DESERT_CELLS=new Uint16Array(144),ICE_CELLS=new Uint16Array(144);'),loader:'ts'}));}}]});
  return import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
};
const [enabled,disabled]=await Promise.all([compile(true),compile(false)]);
const ticks=Number(process.env.BENCH_TICKS||150);
function run(Game,count,level){
  const originalRandom=Math.random;let seed=0x5eed0000+count;Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  try{
  const game=new Game('ranger',level);game.enemies=[];game.slots=['thornbow','arcwand','scattergun'];for(const weapon of game.slots)game.weapons[weapon]=5;game.passives.cooldown=5;game.passives.damage=5;game.firing=true;game.aim={x:1,y:0};game.spawnClock=game.chestClock=-1e9;game.player.invuln=1e9;game.player.health=1e9;game.elapsed=200;
  for(let i=0;i<count;i++){const e=game.spawnEnemy(level==='ice'?(i%30===0?'dogmole':i%12===0?'wisp':'chuul'):(i%30===0?'buraq':i%12===0?'wisp':'deathwisp'));const ring=Math.floor(i/240),angle=(i*2.399963)%6.283185;e.x=104+Math.cos(angle)*(6+ring*1.4);e.y=(level==='ice'?90:91)+Math.sin(angle)*(6+ring*1.4);e.hp=e.maxHp=1e9;e.specialCd=999;}
  game.projectiles=[{x:94,y:90,vx:10,vy:0,life:20,damage:1,radius:.2,pierce:100,kind:'thornbow',chain:0,hit:new Set()}];
  for(let i=0;i<120;i++)game.update(1/60);
  const samples=[];for(let i=0;i<ticks;i++){const start=performance.now();game.update(1/60);samples.push(performance.now()-start);}
  samples.sort((a,b)=>a-b);return {mean:+(samples.reduce((a,b)=>a+b,0)/ticks).toFixed(2),p95:+samples[Math.floor(ticks*.95)].toFixed(2),alive:game.enemies.length};
  }finally{Math.random=originalRandom;}
}
for(const level of ['desert','ice'])for(const count of [1000,2400]){const off=run(disabled.Game,count,level),on=run(enabled.Game,count,level);console.log(JSON.stringify({level,count,off,on,p95OverheadPct:+((on.p95/off.p95-1)*100).toFixed(1)}));}
