import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
const result=await build({entryPoints:['src/weapon-vfx.ts'],bundle:true,platform:'node',format:'esm',write:false});
const {WeaponVfx,projectileVisual}=await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
function fixture(){
  const canvases=[],images=[],draws=[],rotations=[];
  const context=()=>new Proxy({drawImage(...args){draws.push(args)},rotate(n){rotations.push(n)},getImageData(){const data=new Uint8ClampedArray(128*128*4);data[(64*128+64)*4+3]=255;return {data}}},{get:(o,k)=>k in o?o[k]:()=>{}});
  globalThis.document={createElement(){const canvas={width:0,height:0,getContext:()=>context()};canvases.push(canvas);return canvas}};
  globalThis.Image=class{constructor(){images.push(this)}};
  return {canvases,images,draws,rotations,context};
}
const shot=(kind='tankard')=>Object.freeze({kind,vx:3,vy:4,radius:.3});
test('visuals follow weapon identity and bomb fragments keep their own appearance',()=>{
  assert.deepEqual(['thornbow','arcwand','scattergun','runeaxes','tankard','comet'].map(kind=>projectileVisual({kind})),['arrow','arc-bolt','rune-pellet','rune-axe','tankard','generic']);
  assert.equal(projectileVisual({kind:'thornbow',bombFragment:true}),'briar-fragment');
});
test('fallback and loaded artwork share a bounded cache; drawing never allocates images or consumes randomness',async()=>{
  const f=fixture(),v=new WeaponVfx('mug.png'),c=f.context();
  const initial=f.draws.length;v.drawProjectile(c,shot(),0,0,26,1,false,true);assert.equal(f.draws.length-initial,1);
  f.images[0].onload();await v.ready;assert.equal(v.mugLoaded,true);assert.equal(v.cacheBuilds,2);
  const canvases=f.canvases.length,images=f.images.length,draws=f.draws.length,random=Math.random;
  Math.random=()=>{throw new Error('Cosmetic drawing must not change RNG')};
  try{for(let i=0;i<650;i++)v.drawProjectile(c,shot(),0,0,26,i,false,true);}finally{Math.random=random;}
  assert.equal(f.canvases.length,canvases);assert.equal(f.images.length,images);assert.equal(f.draws.length-draws,650);
  v.dispose();v.drawProjectile(c,shot(),0,0,26,1,false,true);assert.equal(f.draws.length-draws,650);assert.equal(v.atlas.width,0);
});
test('mug spin follows game time, freezes while paused, and respects reduced motion',()=>{
  const f=fixture(),v=new WeaponVfx('mug.png'),c=f.context();
  f.draws.length=0;for(const [time,reduced] of [[1,false],[1,false],[2,false],[1,true],[2,true]])v.drawProjectile(c,shot(),0,0,26,time,reduced,true);
  assert.deepEqual(f.draws[0],f.draws[1]);assert.notEqual(f.draws[2][1],f.draws[1][1]);assert.deepEqual(f.draws[3],f.draws[4]);v.dispose();
});
test('slash and splash are single cached draws; disposal ignores pending image completion',async()=>{
  const f=fixture(),v=new WeaponVfx('mug.png'),c=f.context(),lateLoad=f.images[0].onload;
  f.draws.length=0;for(const kind of ['slash','splash'])assert.equal(v.drawEffect(c,Object.freeze({kind,life:.1,max:.3,size:2,angle:1,arc:2}),0,0,26,false),true);
  assert.equal(f.draws.length,2);assert.equal(v.drawEffect(c,{kind:'ring'},0,0,26,false),false);
  v.dispose();lateLoad();await v.ready;assert.equal(v.cacheBuilds,1);assert.equal(f.canvases.length,2);
});

test('performance mode uses readable cheap shapes for dense shots while retaining mug artwork',()=>{
  const f=fixture(),v=new WeaponVfx('mug.png'),c=f.context();f.draws.length=0;
  for(const kind of ['thornbow','arcwand','scattergun'])v.drawProjectile(c,shot(kind),0,0,26,1,false,true);
  assert.equal(f.draws.length,0);v.drawProjectile(c,shot(),0,0,26,1,false,true);assert.equal(f.draws.length,1);v.dispose();
});

test('Rune Axes use one cached atlas draw in either graphics mode, including rank-five gold',()=>{
  const f=fixture(),v=new WeaponVfx('mug.png'),c=f.context(),axe={...shot('runeaxes'),runeGold:true};
  const canvases=f.canvases.length,images=f.images.length;f.draws.length=0;
  for(const lean of [true,false])v.drawProjectile(c,axe,50,60,26,1,false,lean);
  assert.equal(f.draws.length,2);assert.equal(f.canvases.length,canvases);assert.equal(f.images.length,images);
  assert.ok(f.draws.every(args=>args[0]===v.directions),'both modes draw the cached directional axe');
  v.dispose();
});
