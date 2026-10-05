import assert from 'node:assert/strict';
import { World, seededRandom, GROWTH } from '../dist/simulation.js';
import { EMPTY, SAND, WATER, STONE, WOOD, FIRE, PLANT, LAVA, STEAM, SEED, ACID } from '../dist/materials.js';

function count(world,type) { return world.cells.reduce((n,t)=>n+(t===type),0); }
function run(name,fn) { fn(); console.log('✓',name); }

run('seeded presets reset to the same world', () => {
  const world=new World();
  world.seed('riverbed'); const first=Array.from(world.cells);
  for(let i=0;i<20;i++) world.step();
  world.seed('riverbed');
  assert.deepEqual(Array.from(world.cells),first);
});
run('sand settles and conserves material without reactions', () => {
  const world=new World(20,20,seededRandom(12));
  for(let x=0;x<20;x++) world.set(x,19,STONE);
  world.set(10,2,SAND);
  for(let i=0;i<30;i++) world.step();
  assert.equal(count(world,SAND),1);
  assert.ok(world.cells.some((t,i)=>t===SAND && Math.floor(i/20)>=17));
});
run('particles remain inside the grid', () => {
  const world=new World(8,8,seededRandom(5));
  world.set(0,0,WATER); world.set(7,0,WATER);
  for(let i=0;i<100;i++) world.step();
  assert.equal(world.cells.length,64);
  assert.equal(count(world,WATER),2);
});
run('isolated fire exhausts', () => {
  const world=new World(8,8,seededRandom(3));
  world.set(3,4,FIRE);
  for(let i=0;i<70;i++) world.step();
  assert.equal(count(world,FIRE),0);
});
run('lava touching water yields stone and steam', () => {
  const world=new World(5,5,()=>0);
  for(let x=0;x<5;x++) world.set(x,3,STONE);
  world.set(2,2,LAVA); world.set(3,2,WATER);
  for(let i=0;i<5;i++) world.step();
  assert.ok(count(world,STEAM)>0);
  assert.equal(count(world,LAVA),0);
});
function garden(wet=true,supported=true) {
  const world=new World(120,100,()=>0);
  if(supported) for(let x=0;x<120;x++) world.set(x,80,STONE);
  world.set(50,79,SEED);
  if(wet) { world.set(51,79,WATER); world.set(52,79,STONE); }
  return world;
}
run('wet supported seed spends one water and keeps growing without it', () => {
  const world=garden();
  world.step();
  assert.equal(world.get(50,79),PLANT);
  assert.equal(count(world,WATER),0);
  assert.equal(world.growthState[world.index(50,79)],GROWTH.GROWING);
  for(let i=0;i<60;i++) world.step();
  assert.ok(count(world,PLANT)>30);
});
run('dry and unsupported seeds do not germinate', () => {
  const dry=garden(false),unsupported=garden(true,false);
  for(let i=0;i<15;i++) { dry.step(); unsupported.step(); }
  assert.equal(count(dry,PLANT),0);
  assert.equal(count(unsupported,PLANT),0);
});
run('one water cell can hydrate only one dormant plant', () => {
  const world=new World(12,12,()=>0);
  for(let x=3;x<=7;x++) world.set(x,5,STONE);
  world.set(4,4,PLANT); world.set(6,4,PLANT); world.set(5,4,WATER);
  world.step();
  assert.equal(count(world,WATER),0);
  const activated=[world.index(4,4),world.index(6,4)].filter(i=>world.growthState[i]!==GROWTH.DORMANT).length;
  assert.equal(activated,1);
});
run('a tree branches, reaches upward, stays bounded, and never recharges', () => {
  const world=garden();
  for(let i=0;i<240;i++) world.step();
  const plantCells=Array.from(world.cells.entries()).filter(([,type])=>type===PLANT);
  const minY=Math.min(...plantCells.map(([i])=>Math.floor(i/world.width)));
  const spread=new Set(plantCells.map(([i])=>i%world.width)).size;
  assert.ok(plantCells.length>100 && plantCells.length<=221);
  assert.ok(minY>=16 && minY<=44);
  assert.ok(spread>=12);
  assert.ok(plantCells.filter(([i])=>Math.floor(i/world.width)<=24).length>=8);
  assert.ok(plantCells.every(([i])=>world.growthState[i]===GROWTH.SPENT));
  const before=plantCells.length;
  world.set(51,79,WATER);
  for(let i=0;i<60;i++) world.step();
  assert.equal(count(world,PLANT),before);
});
run('obstruction stops upward growth without overwriting a roof', () => {
  const world=garden();
  for(let x=0;x<120;x++) world.set(x,75,STONE);
  for(let i=0;i<120;i++) world.step();
  assert.equal(count(world,STONE),241);
  const plantCells=Array.from(world.cells.entries()).filter(([,type])=>type===PLANT);
  assert.ok(plantCells.length<=25);
  assert.ok(plantCells.every(([i])=>Math.floor(i/world.width)>=76));
});
run('plant metadata swaps on movement and clears on destruction/reset', () => {
  const world=new World(8,8,()=>0),a=world.index(3,3),b=world.index(4,3);
  world.set(3,3,PLANT); world.activatePlant(3,3,70,-1,9);
  assert.equal(world.move(3,3,4,3),true);
  assert.equal(world.growthState[a],GROWTH.DORMANT);
  assert.equal(world.growthState[b],GROWTH.GROWING);
  assert.equal(world.growthDirection[b],-1);
  assert.equal(world.growthDepth[b],9);
  world.set(4,3,FIRE);
  assert.equal(world.growthState[b],GROWTH.DORMANT);
  assert.equal(world.growthDepth[b],0);
  world.clear();
  assert.equal(world.growthState.some(Boolean),false);
  assert.equal(world.growthDirection.some(Boolean),false);
  assert.equal(world.growthDepth.some(Boolean),false);
});
run('tiny forest starts with living seeds and grows a canopy', () => {
  const world=new World();
  world.seed('tiny-forest');
  assert.equal(count(world,PLANT),0);
  for(let i=0;i<30;i++) world.step();
  assert.ok(count(world,PLANT)>30);
  const base=Math.floor(world.height*.78);
  for(const x of [28,75,122,169,216]) {
    const y=base+Math.floor(3*Math.sin(x*.048)+2*Math.sin(x*.12))-1;
    assert.equal(world.get(x,y),PLANT);
  }
  const young=count(world,PLANT);
  for(let i=0;i<90;i++) world.step();
  assert.ok(count(world,PLANT)>young*3);
});
run('acid consumes adjacent stone and itself', () => {
  const world=new World(5,5,()=>0);
  for(let x=0;x<5;x++) world.set(x,3,STONE);
  world.set(2,2,ACID);
  for(let i=0;i<5;i++) world.step();
  assert.equal(count(world,ACID),0);
  assert.ok(count(world,STONE)<5);
});
