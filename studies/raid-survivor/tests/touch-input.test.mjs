import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';

const result = await build({ entryPoints:['src/touch-input.ts','src/game.ts'], bundle:true, platform:'node', format:'esm', write:false, outdir:'out', absWorkingDir:process.cwd() });
const load = async name => import(`data:text/javascript;base64,${Buffer.from(result.outputFiles.find(file=>file.path.endsWith(name)).text).toString('base64')}`);
const { TouchDrag } = await load('touch-input.js');
const { Game } = await load('game.js');
const quiet = game => { game.enemies=[];game.slots=[];game.spawnClock=-1000;game.chestClock=-1000; };

test('relative drag starts still, ignores finger slop, and follows only finger deltas',()=>{
  const game=new Game('ranger');quiet(game);
  const drag=new TouchDrag();const start={...game.player};
  assert.equal(drag.begin(7,280,500,game.player),true);
  assert.equal(drag.activeTarget,null);
  assert.equal(drag.move(7,282,500,game.player,.05),true);
  assert.equal(drag.activeTarget,null);
  drag.move(7,304,500,game.player,.05);
  assert.ok(drag.activeTarget.x>start.x);
  assert.equal(drag.activeTarget.y,start.y);
  game.moveTarget=drag.activeTarget;
  game.update(1/60);
  assert.ok(game.player.x>start.x);
  assert.ok(game.player.x<drag.activeTarget.x);
  const before={...drag.activeTarget};
  // A camera change without a pointer delta cannot move the target.
  drag.move(7,304,500,game.player,.05);
  assert.deepEqual(drag.activeTarget,before);
});

test('one finger owns movement; release, cancel, and reset stop it',()=>{
  const game=new Game('ranger');quiet(game);const drag=new TouchDrag();
  drag.begin(1,100,100,game.player);
  assert.equal(drag.begin(2,100,100,game.player),false);
  assert.equal(drag.move(2,300,100,game.player,.05),false);
  assert.equal(drag.activeTarget,null);
  drag.move(1,140,100,game.player,.05);
  assert.ok(drag.activeTarget);
  assert.equal(drag.end(2),false);
  assert.equal(drag.id,1);
  assert.equal(drag.end(1),true);
  game.moveTarget=drag.activeTarget;
  const x=game.player.x;game.update(1/60);assert.equal(game.player.x,x);
  drag.begin(3,100,100,game.player);drag.move(3,160,100,game.player,.05);
  drag.reset();assert.equal(drag.id,-1);assert.equal(drag.activeTarget,null);
});

test('lead is bounded, screen orientation maps to world, and target does not overshoot',()=>{
  const game=new Game('ranger');quiet(game);const drag=new TouchDrag();
  drag.begin(1,100,100,game.player);drag.move(1,1000,0,game.player,.1);
  assert.ok(Math.hypot(drag.activeTarget.x-game.player.x,drag.activeTarget.y-game.player.y)<=3.000001);
  assert.ok(drag.activeTarget.y>game.player.y);
  game.moveTarget=drag.activeTarget;
  for(let i=0;i<60;i++)game.update(1/60);
  assert.ok(Math.hypot(game.player.x-drag.activeTarget.x,game.player.y-drag.activeTarget.y)<1e-9);
  const at={x:game.player.x,y:game.player.y};game.update(1/60);assert.deepEqual({x:game.player.x,y:game.player.y},at);
  drag.reset();game.moveTarget=null;game.move.x=-1;game.update(1/60);
  assert.ok(game.player.x<at.x,'keyboard movement remains available');
});

test('drag targets remain inside world bounds',()=>{
  const drag=new TouchDrag();const player={x:178.5,y:1.5};
  drag.begin(9,100,100,player);drag.move(9,1000,1000,player,.1);
  assert.ok(drag.activeTarget.x<=179);
  assert.ok(drag.activeTarget.y>=1);
  assert.ok(Math.hypot(drag.activeTarget.x-player.x,drag.activeTarget.y-player.y)<=3.000001);
});
