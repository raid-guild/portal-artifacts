import test from 'node:test';
import assert from 'node:assert/strict';
import * as CANNON from 'cannon-es';
import { getChapterEncounter } from './chapter-encounters.js';
import { createEncounterState, stepEncounter, ENCOUNTER } from './encounter.js';
import { createEncounterVitality, stepEncounterVitality } from './encounter-vitality.js';
import { BLOB_RADIUS, mazeAcceleration, capVelocity, SPEED_CAP, canPlaceWell } from './level.js';
import { STEP } from './physics.js';
function run(chapter,policy,mode='flee') {
 const demo=getChapterEncounter(chapter),level=demo.level,conf={...ENCOUNTER,speed:demo.duel.bossSpeed,bossMines:demo.duel.bossMines,bossSeeksLight:demo.duel.bossSeeksLight,rechargeThreshold:demo.duel.rechargeThreshold};
 const world=new CANNON.World({gravity:new CANNON.Vec3(0,0,0),allowSleep:false});
 const bm=new CANNON.Material('blob'),wm=new CANNON.Material('wall');world.addContactMaterial(new CANNON.ContactMaterial(bm,wm,{friction:0,restitution:.1}));
 const body=new CANNON.Body({mass:1,shape:new CANNON.Sphere(BLOB_RADIUS),material:bm,linearDamping:0,angularDamping:0,fixedRotation:true});body.position.set(level.spawn.x,level.spawn.y,0);body.velocity.set(level.spawn.vx,level.spawn.vy,0);world.addBody(body);
 for(const rect of level.walls){const wall=new CANNON.Body({mass:0,shape:new CANNON.Box(new CANNON.Vec3(rect.w/2,rect.h/2,.7)),material:wm});wall.position.set(rect.x,rect.y,0);world.addBody(wall)}
 let encounter=createEncounterState(demo.duel.boss),vitality=createEncounterVitality(2819,demo.duel),wells=[],hits=0,collections={hero:0,boss:0},result='time',placements=0;
 for(let tick=0;tick<100/STEP;tick++){
  const time=tick*STEP;
  if(tick%120===0){const point=policy(encounter,body.position,time,level);if(point&&canPlaceWell(point,level)){wells=[...wells,{...point,strength:70,lifetime:16,createdAt:time}].slice(-1);placements++}}
  const before={x:body.position.x,y:body.position.y};const a=mazeAcceleration(body.position,wells,time,'fade',level);body.applyForce(new CANNON.Vec3(a.x,a.y,0));world.step(STEP);capVelocity(body.velocity,SPEED_CAP);
  const bb={x:encounter.boss.x,y:encounter.boss.y};const resultStep=stepEncounter(encounter,{before,hero:body.position,heroVelocity:body.velocity,dt:STEP,time,bounds:level.bounds,walls:level.walls,heroEnergy:vitality.hero.energy,bossEnergy:vitality.boss.energy,pickups:vitality.pickups,behavior:mode,config:conf});encounter=resultStep.state;if(resultStep.events.includes('hit'))hits++;
  const resultLight=stepEncounterVitality(vitality,{heroBefore:before,hero:body.position,bossBefore:bb,boss:encounter.boss,dt:STEP,time,level,hazards:encounter.hazards,heroExposureSeconds:resultStep.heroExposureSeconds,bossExposureSeconds:resultStep.bossExposureSeconds,costs:resultStep.costs,duel:demo.duel});vitality=resultLight.state;collections.hero+=resultLight.collected.hero;collections.boss+=resultLight.collected.boss;
  if(resultStep.knockback){body.velocity.x+=resultStep.knockback.x;body.velocity.y+=resultStep.knockback.y;capVelocity(body.velocity,SPEED_CAP)}
  if(resultLight.result){result=resultLight.result;break}
 }
 return {result,hits,collections,placements,heroEnergy:vitality.hero.energy,bossEnergy:vitality.boss.energy,x:body.position.x,bossX:encounter.boss.x};
}
const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
const policies={
 none:()=>null,
 toward:(state,hero,time,level)=>{const d=Math.hypot(state.boss.x-hero.x,state.boss.y-hero.y)||1;return {x:clamp(hero.x+(state.boss.x-hero.x)/d*2,level.bounds.minX+2,level.bounds.maxX-2),y:clamp(hero.y+(state.boss.y-hero.y)/d*2,level.bounds.minY+2,level.bounds.maxY-2)}},
 boss:(state,hero,time,level)=>({x:clamp(state.boss.x+1,level.bounds.minX+2,level.bounds.maxX-2),y:clamp(state.boss.y,level.bounds.minY+2,level.bounds.maxY-2)}),
 offset:(state,hero,time,level)=>({x:clamp(state.boss.x-2,level.bounds.minX+2,level.bounds.maxX-2),y:clamp(state.boss.y+2,level.bounds.minY+2,level.bounds.maxY-2)}),
 center:()=>({x:0,y:0}),
};

test('a legal series of gravity wells can intercept and outlast the easier first ember', () => {
 const route=run(1,policies.toward,'flee');
 assert.equal(route.result,'boss');
 assert.ok(route.hits>=1,`expected a physical ram: ${JSON.stringify(route)}`);
 assert.ok(route.placements>=1);
 assert.ok(route.collections.hero>=1);
});

test('larger chapter courses still allow real Cannon intercepts around their walls', () => {
 for (const [chapter,policy] of [[2,policies.boss],[3,policies.none],[4,policies.toward],[5,policies.boss]]) {
  const route=run(chapter,policy,'adaptive');
  assert.ok(route.hits>=1,`chapter ${chapter} should allow an interception: ${JSON.stringify(route)}`);
  assert.ok(Number.isFinite(route.x)&&Number.isFinite(route.bossX));
 }
});
