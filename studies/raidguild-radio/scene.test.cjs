const assert=require('node:assert/strict');
const {create,camera,meteorAt}=require('../../public/raidguild-radio/scene.js');
// Long-running scene: bounded camera movement with no drift or end-of-cycle snap.
for(let t=0;t<3600;t+=.17){const c=camera(t);assert(Math.abs(c.x)<=3.2);assert(Math.abs(c.y)<=5.9);assert(Math.abs(c.roll)<=.0018)}
for(const k of ['x','y','roll'])assert(Math.abs(camera(0)[k]-camera(9.2)[k])<1e-10);
assert.equal(meteorAt(8),null);assert(meteorAt(9.5));assert.equal(meteorAt(11),null);assert(meteorAt(52.5));
// Exercise the real renderer at portrait/landscape sizes and every weather/night combination.
let depth=0,paths=0;
const gradient={addColorStop(){}};
const ctx=new Proxy({}, {get(_,key){if(key==='save')return()=>depth++;if(key==='restore')return()=>{assert(--depth>=0)};if(key.startsWith('create'))return()=>gradient;return(...args)=>{args.filter(a=>typeof a==='number').forEach(a=>assert(Number.isFinite(a)));if(key==='beginPath')paths++}},set(){return true}});
const scene=create(()=>.4),art={style:{}};
for(const width of [390,1440,2560])for(const weather of ['clear','rain','dust'])for(const night of [0,.5,1])for(const time of [0,9.5,100,3600]){scene.render(ctx,art,{width,height:900,time,night,weather,motion:true});assert.equal(depth,0);assert(!art.style.transform.includes('NaN'))}
const state={width:1440,height:900,time:50,night:1,weather:'clear',motion:false};scene.render(ctx,art,state);const paused=art.style.transform;scene.render(ctx,art,state);assert.equal(art.style.transform,paused);assert(paths>0);
console.log('PASS: camera bounds/continuity, meteor timing, renderer at 3 sizes × 3 weather × 3 light states, paused transform');
