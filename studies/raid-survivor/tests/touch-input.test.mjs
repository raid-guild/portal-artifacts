import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';

const result = await build({ entryPoints:['src/touch-input.ts','src/game.ts'], bundle:true, platform:'node', format:'esm', write:false, outdir:'out', absWorkingDir:process.cwd() });
const load = async name => import(`data:text/javascript;base64,${Buffer.from(result.outputFiles.find(file=>file.path.endsWith(name)).text).toString('base64')}`);
const { TouchJoystick } = await load('touch-input.js');
const { Game } = await load('game.js');
const quiet = game => { game.enemies=[];game.slots=[];game.spawnClock=-1000;game.chestClock=-1000; };
const apply = (stick,game) => { game.move.x=stick.direction.x;game.move.y=stick.direction.y; };

test('held joystick keeps walking without further pointer events',()=>{
  const game=new Game('ranger');quiet(game);const stick=new TouchJoystick();
  stick.begin(1,100,100);stick.move(1,140,100);apply(stick,game);
  const start=game.player.x;
  for(let i=0;i<180;i++)game.update(1/60);
  assert.ok(game.player.x-start>3,'movement continues past the former three-unit target');
  assert.ok(Math.abs(game.player.x-start-game.player.speed*3)<1e-8,'normal movement speed is preserved');
  assert.equal(stick.direction.x,1,'player and camera movement do not recenter input');
  const before=game.player.x;
  for(let i=0;i<60;i++)game.update(1/60);
  assert.ok(game.player.x>before);
  stick.end(1);apply(stick,game);const stopped=game.player.x;
  game.update(1/60);assert.equal(game.player.x,stopped);
});

test('grab and deadzone stay still; reversing and returning to center work',()=>{
  const stick=new TouchJoystick();stick.begin(1,100,100);
  assert.deepEqual(stick.direction,{x:0,y:0});
  stick.move(1,103,102);assert.deepEqual(stick.direction,{x:0,y:0});
  stick.move(1,140,60);assert.ok(stick.direction.x>0&&stick.direction.y>0);
  assert.ok(Math.abs(Math.hypot(stick.direction.x,stick.direction.y)-1)<1e-9);
  stick.move(1,60,140);assert.ok(stick.direction.x<0&&stick.direction.y<0);
  stick.move(1,100,100);assert.deepEqual(stick.direction,{x:0,y:0});
});

test('secondary pointers cannot steal or release movement; reset requires a new grab',()=>{
  const stick=new TouchJoystick();stick.begin(1,100,100);stick.move(1,140,100);
  assert.equal(stick.begin(2,200,200),false);
  assert.equal(stick.move(2,50,50),false);assert.equal(stick.end(2),false);
  assert.equal(stick.direction.x,1);
  stick.reset();assert.equal(stick.id,-1);assert.deepEqual(stick.direction,{x:0,y:0});
  assert.equal(stick.move(1,140,100),false);
  assert.equal(stick.begin(3,300,500),true);
  stick.move(3,260,500);assert.equal(stick.direction.x,-1);
  stick.end(3);assert.deepEqual(stick.direction,{x:0,y:0});
});

test('held movement respects world bounds and preserves dash and keyboard behavior',()=>{
  const game=new Game('ranger');quiet(game);const stick=new TouchJoystick();
  stick.begin(1,0,0);stick.move(1,40,0);apply(stick,game);
  game.player.x=178.99;game.update(1/60);assert.equal(game.player.x,179);
  stick.move(1,-40,0);apply(stick,game);game.update(1/60);assert.ok(game.player.x<179);
  game.dash();const before=game.player.x;game.update(1/60);
  assert.ok(before-game.player.x>game.player.speed/60);
  stick.end(1);game.player.dash=0;game.move.x=1;const x=game.player.x;
  game.update(1/60);assert.ok(game.player.x>x);
});
