import { build } from 'esbuild';
import { performance } from 'node:perf_hooks';

const result = await build({ entryPoints: ['src/game.ts'], bundle: true, platform: 'node', format: 'esm', write: false, absWorkingDir: process.cwd() });
const { Game } = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
const ticks = Number(process.env.BENCH_TICKS || 300);
const counts = [1000, 2000, 2400];

for (const count of counts) {
  const game = new Game('ranger');
  game.stress(count - game.enemies.length);
  for (const enemy of game.enemies) enemy.hp = enemy.maxHp = 1e9;
  game.slots = ['thornbow', 'arcwand', 'scattergun'];
  for (const weapon of game.slots) game.weapons[weapon] = 5;
  game.passives.cooldown = 5;
  game.passives.damage = 5;
  game.player.invuln = 1e9;
  game.player.health = 1e9;
  game.firing = true;
  game.aim = { x: 1, y: 0 };
  game.onReward = rewards => { game.chooseReward(rewards[0]); };
  for (let i = 0; i < 600; i++) game.update(1 / 60);
  const samples = [];
  const memoryBefore = process.memoryUsage().heapUsed;
  for (let i = 0; i < ticks; i++) {
    const start = performance.now();
    game.update(1 / 60);
    samples.push(performance.now() - start);
  }
  const sorted = [...samples].sort((a, b) => a - b);
  const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
  console.log(JSON.stringify({ enemiesRequested: count, enemiesAlive: game.enemies.length, ticks, meanMs: +mean.toFixed(2), p95Ms: +sorted[Math.floor(sorted.length * .95)].toFixed(2), maxMs: +sorted.at(-1).toFixed(2), projectiles: game.projectiles.length, heapDeltaMB: +((process.memoryUsage().heapUsed - memoryBefore) / 1024 / 1024).toFixed(1) }));
}

// A bounded late encounter mixes ordinary enemies with both special variants,
// a tier-three boss, and warning resolution without constructing a huge harness.
{
  const game = new Game('ranger');
  game.stress(980 - game.enemies.length);
  game.elapsed = 550; game.bossWave = 6; game.spawnClock = game.chestClock = -1000;
  game.player.invuln = 1e9; game.player.health = 1e9;
  game.slots = ['thornbow','arcwand','scattergun'];
  for (const weapon of game.slots) game.weapons[weapon] = 5;
  for (let i = 0; i < 4; i++) {
    const jug = game.spawnEnemy('brute', true); const hex = game.spawnEnemy('cultist', true);
    jug.x = game.player.x + 8 + i; jug.y = game.player.y + i;
    hex.x = game.player.x - 8 - i; hex.y = game.player.y - i;
    jug.specialCd = hex.specialCd = 0;
  }
  const boss = game.spawnEnemy('boss'); boss.x = game.player.x; boss.y = game.player.y + 10; boss.attackCd = 0; boss.attackPhase = 1;
  for (const enemy of game.enemies) enemy.hp = enemy.maxHp = 1e9;
  for (let i = 0; i < 30; i++) game.update(1 / 60);
  const samples = [];
  for (let i = 0; i < ticks; i++) {
    const start = performance.now(); game.update(1 / 60); samples.push(performance.now() - start);
  }
  const sorted = [...samples].sort((a,b)=>a-b);
  console.log(JSON.stringify({ scenario:'mixed-late', enemiesAlive:game.enemies.length, ticks,
    meanMs:+(samples.reduce((a,b)=>a+b,0)/samples.length).toFixed(2),
    p95Ms:+sorted[Math.floor(sorted.length*.95)].toFixed(2),
    maxMs:+sorted.at(-1).toFixed(2), hazards:game.hazards.length, enemyShots:game.enemyShots.length }));
}
