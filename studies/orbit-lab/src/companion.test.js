import test from 'node:test';
import assert from 'node:assert/strict';
import { COMPANION_OWNED_COUNT, createCompanionState, stepCompanion } from './companion.js';

const dt=1/120;
const length=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function tick(state,hero,moon,{ heroA={x:0,y:0}, heroWell={x:0,y:0}, moonWell={x:0,y:0}, wells=[], time=0 }={}) {
  const result=stepCompanion(state,{hero,moon,heroAcceleration:heroA,heroWellAcceleration:heroWell,moonWellAcceleration:moonWell,wells,time,dt});
  hero.vx+=heroA.x*dt;hero.vy+=heroA.y*dt;hero.x+=hero.vx*dt;hero.y+=hero.vy*dt;
  moon.vx+=result.acceleration.x*dt;moon.vy+=result.acceleration.y*dt;
  const speed=Math.hypot(moon.vx,moon.vy);if(speed>result.speedCap){moon.vx*=result.speedCap/speed;moon.vy*=result.speedCap/speed;}
  moon.x+=moon.vx*dt;moon.y+=moon.vy*dt;
  return result;
}
test('one owned companion retains a bounded orbit during fast travel and a turn',()=>{
  const hero={x:0,y:0,vx:8,vy:0},moon={x:2,y:0,vx:8,vy:1.4};let state=createCompanionState();
  let maxDistance=0;
  for(let i=0;i<2400;i++){
    const heroA=i<300?{x:0,y:0}:i<520?{x:-2,y:2}:{x:0,y:0};
    const result=tick(state,hero,moon,{heroA,time:i*dt});state=result.state;maxDistance=Math.max(maxDistance,length(hero,moon));
    assert.ok(Number.isFinite(moon.x)&&Number.isFinite(moon.vx));
  }
  assert.equal(COMPANION_OWNED_COUNT,1);assert.equal(state.owned,true);
  assert.ok(maxDistance<8,`max distance ${maxDistance}`);
  assert.ok(length(hero,moon)<4);
});
test('nearby well borrows the moon; fading it causes a smooth, bounded return',()=>{
  const hero={x:0,y:0,vx:0,vy:0},moon={x:2,y:0,vx:0,vy:1.35};let state=createCompanionState();
  const well={x:2.6,y:0,strength:70,lifetime:2,createdAt:0};let sawBorrow=false,sawReturn=false,returned=false,maxAcceleration=0;
  for(let i=0;i<3600;i++){
    const time=i*dt,active=time<2;
    const result=tick(state,hero,moon,{heroWell:{x:0,y:0},moonWell:active?{x:8,y:0}:{x:0,y:0},wells:active?[well]:[],time});
    state=result.state;sawBorrow ||=state.phase==='borrowed';sawReturn ||=state.phase==='returning';returned ||=result.returned;
    maxAcceleration=Math.max(maxAcceleration,Math.hypot(result.acceleration.x,result.acceleration.y));
    assert.ok(Number.isFinite(moon.x)&&Number.isFinite(moon.vx));
  }
  assert.equal(sawBorrow,true);assert.equal(sawReturn,true);assert.equal(returned,true);
  assert.ok(maxAcceleration<=24+1e-9);assert.equal(state.owned,true);
  assert.ok(length(hero,moon)<3.5);
});
test('zero separation and a large gap stay finite and catch up without teleporting',()=>{
  const hero={x:40,y:0,vx:8,vy:0},moon={x:0,y:0,vx:0,vy:0};let state=createCompanionState();
  const first=stepCompanion(state,{hero,moon,heroAcceleration:{x:0,y:0},heroWellAcceleration:{x:0,y:0},moonWellAcceleration:{x:0,y:0},dt,time:0});
  assert.equal(first.state.phase,'returning');assert.ok(first.speedCap>10);
  const initial=length(hero,moon);
  for(let i=0;i<1800;i++){const result=tick(state,hero,moon,{time:i*dt});state=result.state;}
  assert.ok(length(hero,moon)<initial);
  const overlap=stepCompanion(state,{hero:{x:0,y:0,vx:0,vy:0},moon:{x:0,y:0,vx:0,vy:0},heroAcceleration:{x:0,y:0},heroWellAcceleration:{x:0,y:0},moonWellAcceleration:{x:0,y:0},dt,time:0});
  assert.ok(Number.isFinite(overlap.acceleration.x)&&Number.isFinite(overlap.acceleration.y));
});

test('shared hero well acceleration still carries the moon when its own well pull is weaker',()=>{
  const hero={x:0,y:0,vx:0,vy:0},moon={x:2.15,y:0,vx:0,vy:1.35};
  const result=stepCompanion(createCompanionState(),{hero,moon,heroAcceleration:{x:20,y:0},heroWellAcceleration:{x:20,y:0},moonWellAcceleration:{x:0,y:0},dt,time:0});
  assert.ok(result.acceleration.x>10,`moon lost inherited acceleration: ${result.acceleration.x}`);
});

test('two owned companions keep independent orbit phases and both return after a well fades',()=>{
  const hero={x:0,y:0,vx:5,vy:0};
  const moons=[{x:2.15,y:0,vx:5,vy:1.35},{x:-2.15,y:0,vx:5,vy:-1.35}];
  const states=[createCompanionState(),createCompanionState()];
  const well={x:2.8,y:0,strength:70,lifetime:2,createdAt:0};
  let borrowedFirst=false,followedSecond=false,returnedFirst=false;
  for(let i=0;i<2400;i++){
    const time=i*dt,active=time<2;
    for(let m=0;m<2;m++){
      const result=stepCompanion(states[m],{
        hero,moon:moons[m],heroAcceleration:{x:0,y:0},heroWellAcceleration:{x:0,y:0},
        moonWellAcceleration:active&&m===0?{x:8,y:0}:{x:0,y:0},wells:active?[well]:[],time,dt,
      });
      states[m]=result.state;
      borrowedFirst ||= m===0&&states[m].phase==='borrowed';
      followedSecond ||= m===1&&states[m].phase==='following';
      returnedFirst ||= m===0&&result.returned;
      moons[m].vx+=result.acceleration.x*dt;moons[m].vy+=result.acceleration.y*dt;
      moons[m].x+=moons[m].vx*dt;moons[m].y+=moons[m].vy*dt;
    }
    hero.x+=hero.vx*dt;
  }
  assert.equal(borrowedFirst,true);assert.equal(followedSecond,true);assert.equal(returnedFirst,true);
  assert.equal(states.filter(state=>state.owned).length,2);
  assert.ok(moons.every(moon=>length(hero,moon)<5));
});
