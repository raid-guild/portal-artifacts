import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {commitEditorSolid} from '../src/editor-solid.js';
import {runtimeSolid,solidInside,disposeEditorSolid} from '../src/editor-solid-physics.js';
import {pointInsideSolid,segmentBlockedBySolid,supportedGroundAt,resolveParticle,contactingCommittedTop} from '../src/colliders.js';
import {createBlankDraft,addDraftObject,compileDraft,validateDraft,exportDraft,importDraft,
  duplicateDraftObject,deleteDraftObject,DraftHistory} from '../src/editor-workbench.js';
import {gardenColliders} from '../src/garden-level.js';
import {ParticleFluid} from '../src/particle-fluid.js';
import {createEditorStageView,editorStageHitInfo} from '../src/editor-stage-view.js';

const box=(minX=-1,maxX=1)=>({type:'box',minX,maxX,minY:0,maxY:2,minZ:-1,maxZ:1});
const bore=(rotation={x:0,y:0,z:0})=>({shape:'cylinder',x:0,y:1,z:0,radius:.45,height:3,rotation});
test('committed oblique bores cut the same static mesh used by collision and support',()=>{
  const c=commitEditorSolid([box()],[bore({x:17,y:0,z:43})]);
  assert.ok(c.indices.length>0&&c.indices.length%3===0);
  assert.ok(!solidInside(c,0,1,0),'the center of the bore is empty');
  assert.ok(solidInside(c,.8,1,0),'the remaining wall is solid');
  assert.ok(!pointInsideSolid(0,1,0,[c]));
  assert.ok(pointInsideSolid(.8,1,0,[c]));
  assert.ok(segmentBlockedBySolid({x:.8,y:1,z:-1.5},{x:.8,y:1,z:1.5},[c]));
  assert.ok(supportedGroundAt({x:0,y:1.1,z:0},.067,[c])<.5,'the bore has no original top support');
  assert.ok(supportedGroundAt({x:.8,y:2.07,z:0},.067,[c])>1.9,'the surviving ledge supports weight');
  assert.ok(contactingCommittedTop({x:.8,y:2.067,z:0},.067,c)!==null);
  const p={x:.8,y:1,z:0,px:.8,py:1,pz:-1.5,vx:0,vy:0,vz:0};
  resolveParticle(p,.067,[c]);assert.ok(p.z<-.9,'swept contact stops a particle at the wall');
  disposeEditorSolid(c.revision);
});
test('fast inside query agrees with ray parity around a carved solid, including its boundary',()=>{
  const c=commitEditorSolid([box()],[bore({x:17,y:0,z:43})]);
  const bvh=runtimeSolid(c).bvh;
  const direction=new THREE.Vector3(.992,.121,.032).normalize();
  const parity=(x,y,z)=>{
    const intersections=bvh.raycast(new THREE.Ray(new THREE.Vector3(x,y,z),direction),THREE.DoubleSide)
      .sort((a,b)=>a.distance-b.distance);
    let count=0,last=-Infinity;
    for(const hit of intersections)if(hit.distance-last>1e-5){count++;last=hit.distance;}
    return count%2===1;
  };
  for(let ix=0;ix<17;ix++)for(let iy=0;iy<13;iy++)for(let iz=0;iz<17;iz++){
    const x=-1.15+ix*.145,y=-.1+iy*.185,z=-1.15+iz*.145;
    if(x<=-1||x>=1||y<=0||y>=2||z<=-1||z>=1)continue;
    assert.equal(solidInside(c,x,y,z),parity(x,y,z),`classification at ${x},${y},${z}`);
  }
  disposeEditorSolid(c.revision);
});
test('real basal flesh on a surviving carved ledge supports the contracted brain',()=>{
  const c=commitEditorSolid([box(-3,3)],[{shape:'cylinder',x:-1.5,y:1,z:0,radius:.4,height:3,
    rotation:{x:0,y:0,z:0}}]);
  const fluid=new ParticleFluid({x:1,z:0,seedCount:65});
  for(let i=0;i<fluid.particles.length;i++){
    const p=fluid.particles[i];p.y=2+fluid.radius+(i===fluid.brainIndex ? .22 : 0);
    p.py=p.y;p.px=p.x;p.pz=p.z;
  }
  fluid.step(1/60,{puddle:true,contract:true},[c]);
  assert.equal(fluid.brainAirborne,false);
  assert.ok(fluid.brain.y>2,'the brain remains above the carved ledge');
  disposeEditorSolid(c.revision);
});
test('adjacent target solids union before subtraction, including full removal',()=>{
  const joined=commitEditorSolid([box(-2,0),box(0,2)],[bore()]);
  assert.ok(!solidInside(joined,0,1,0));
  assert.ok(solidInside(joined,1.5,1,0));
  const all=commitEditorSolid([box()],[{shape:'box',x:0,y:1,z:0,width:4,height:4,depth:4,rotation:{x:0,y:0,z:0}}]);
  assert.equal(all.indices.length,0);
  disposeEditorSolid(joined.revision);
});
test('a real tunnel admits a particle while a narrower bore blocks its radius',()=>{
  for(const [radius,passes] of [[.45,true],[.035,false]]){
    const c=commitEditorSolid([box()],[{...bore({x:90,y:0,z:0}),radius}]);
    const start={x:0,y:1,z:-1.5},end={x:0,y:1,z:1.5};
    assert.equal(segmentBlockedBySolid(start,end,[c],.067),false,'a center line sees the bore');
    const p={x:0,y:1,z:1.5,px:0,py:1,pz:-1.5,vx:0,vy:0,vz:3};
    resolveParticle(p,.067,[c]);
    if(passes)assert.ok(p.z>1,'wide bore permits travel');
    else assert.ok(p.z<-.9,'narrow bore contacts its near face');
    disposeEditorSolid(c.revision);
  }
});
test('v3 draft stores source cutters; duplicate, delete, undo and import rebuild committed geometry',()=>{
  const draft=createBlankDraft();addDraftObject(draft,'block',{minX:-1,maxX:1,minZ:-1,maxZ:1,minY:0,maxY:2});
  const cutter=addDraftObject(draft,'cutter',bore());
  assert.deepEqual(validateDraft(draft).errors,[]);
  const snapshot=JSON.parse(exportDraft(draft));
  assert.equal(snapshot.version,3);assert.ok(!JSON.stringify(snapshot).includes('vertices'));
  const history=new DraftHistory(draft),copy=duplicateDraftObject(draft,cutter.id);copy.x=.4;
  history.commit(draft);assert.equal(draft.objects.filter(o=>o.kind==='cutter').length,2);
  deleteDraftObject(draft,cutter.id);history.commit(draft);
  assert.equal(history.undo().objects.filter(o=>o.kind==='cutter').length,2);
  const loaded=importDraft(JSON.stringify(snapshot)),level=compileDraft(loaded);
  assert.ok(level.csgSolid.indices.length>0);
  assert.ok(!pointInsideSolid(0,1,0,gardenColliders(level)));
});
test('targeted paint is clipped by the cut in the authoring view',()=>{
  const draft=createBlankDraft(),block=addDraftObject(draft,'block',{minX:-1,maxX:1,minZ:-1,maxZ:1,minY:0,maxY:2});
  addDraftObject(draft,'cutter',bore({x:90,y:0,z:0}));
  addDraftObject(draft,'paint',{surface:'sticky',face:'north',targetId:block.id,minX:-.8,maxX:.8,
    minZ:-1.05,maxZ:-.95,base:.5});
  const level=compileDraft(draft),scene=new THREE.Scene(),view=createEditorStageView(scene,level);
  const paint=view.group.children.find(m=>m.material?.color?.getHex()===0x8cae96);
  assert.ok(paint,'the painted wall remains visible');
  assert.ok(paint.geometry.attributes.position.count>0);
  const positions=paint.geometry.attributes.position;
  for(let i=0;i<positions.count;i+=3){
    const x=(positions.getX(i)+positions.getX(i+1)+positions.getX(i+2))/3;
    const y=(positions.getY(i)+positions.getY(i+1)+positions.getY(i+2))/3;
    assert.ok(Math.hypot(x,y-1)>.3,'paint does not span the cut opening');
  }
  view.dispose();disposeEditorSolid(level.csgSolid.revision);
});
test('ray hits on surviving cut walls retain their editable source ID',()=>{
  const draft=createBlankDraft();
  const left=addDraftObject(draft,'block',{minX:-2,maxX:0,minZ:-1,maxZ:1,minY:0,maxY:2});
  const right=addDraftObject(draft,'block',{minX:0,maxX:2,minZ:-1,maxZ:1,minY:0,maxY:2});
  addDraftObject(draft,'cutter',{...bore({x:90,y:0,z:0}),x:-1});
  const level=compileDraft(draft),scene=new THREE.Scene(),view=createEditorStageView(scene,level),ray=new THREE.Raycaster();
  for(const [x,id] of [[-1.7,left.id],[1.5,right.id]]){
    ray.set(new THREE.Vector3(x,1,-3),new THREE.Vector3(0,0,1));
    const hit=ray.intersectObjects(view.group.children,true).find(h=>h.object.userData.pickableTerrain);
    assert.ok(hit,`a cut wall at x ${x} can be picked`);
    assert.equal(editorStageHitInfo(hit).targetId,id);
  }
  view.dispose();disposeEditorSolid(level.csgSolid.revision);
});
