import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DOMParser} from '@xmldom/xmldom';
import {SoftShell} from '../src/physics.js';
import {LogoField} from '../src/logo-physics.js';
import {buildLogoGeometry} from '../src/logo-geometry.js';
import {BounceMotion,worldGravity} from '../src/motion.js';
import {eventVariant} from '../src/jelly-response.js';

globalThis.DOMParser=DOMParser;
const artwork=buildLogoGeometry(readFileSync(new URL('../public/assets/raidguild-stamp.svg',import.meta.url),'utf8'));
const bodies=[['garden',()=>new SoftShell(1,1)],['logo',()=>new LogoField(artwork)]];

function settle(make,{softness=.65,gravity=.55,damping=.38,impulse=0,frames=480}={}){
  const body=make(),height=body.radius??-body.bottomRest;
  const floor=()=>.2;
  const support=()=>.2-body.minimumY();
  const motion=new BounceMotion(support(),height);
  motion.grounded=true;
  if(impulse)body.impact(impulse);
  let minimum=1,largestRootStep=0,previousY=motion.y,lateChange=0;
  for(let frame=0;frame<frames;frame++){
    const hit=motion.beforeShape(support(),gravity,damping,body.squash,body.squashVelocity);
    if(hit>0)body.impact(hit);
    body.step({softness,damping,contactLoad:motion.grounded?worldGravity(gravity):0,centerY:motion.y,floorAt:floor,gravity});
    const lateHit=motion.afterShape(support(),body.squash,body.squashVelocity,gravity);
    if(lateHit>0)body.impact(lateHit);
    assert.ok(motion.y>=support()-1e-5,`floor penetration at ${frame}`);
    assert.ok(body.valid(),`invalid ${frame}`);
    assert.ok(Number.isFinite(motion.comY)&&Number.isFinite(body.squash));
    minimum=Math.min(minimum,body.squash);
    largestRootStep=Math.max(largestRootStep,Math.abs(motion.y-previousY));
    if(frame>frames-60)lateChange=Math.max(lateChange,Math.abs(body.squashVelocity));
    previousY=motion.y;
  }
  return {body,motion,minimum,rest:body.squash,largestRootStep,lateChange};
}

for(const [name,make] of bodies){
  test(`${name} loaded height decreases with gravity and softness`,()=>{
    const low=settle(make,{softness:1,gravity:.2});
    const middle=settle(make,{softness:1,gravity:.55});
    const heavy=settle(make,{softness:1,gravity:1});
    const firm=settle(make,{softness:0,gravity:1});
    assert.ok(low.rest>middle.rest+.05&&middle.rest>heavy.rest+.05);
    assert.ok(firm.rest>heavy.rest+.18);
    assert.ok(heavy.rest<.75&&heavy.rest>.58,`heavy idle height ${heavy.rest}`);
    assert.ok(heavy.lateChange<.003,`idle never settled ${heavy.lateChange}`);
  });

  test(`${name} a live gravity change moves to the new loaded equilibrium smoothly`,()=>{
    const body=make(),height=body.radius??-body.bottomRest;
    const support=()=>.2-body.minimumY();
    const motion=new BounceMotion(support(),height);motion.grounded=true;
    let before=1,firstAfter=1,maxStep=0,last=1;
    for(let frame=0;frame<850;frame++){
      const gravity=frame<360?.2:1;
      const hit=motion.beforeShape(support(),gravity,.38,body.squash,body.squashVelocity);
      if(hit>0)body.impact(hit);
      body.step({softness:1,damping:.38,gravity,contactLoad:motion.grounded?worldGravity(gravity):0,centerY:motion.y,floorAt:()=>.2});
      const late=motion.afterShape(support(),body.squash,body.squashVelocity,gravity);
      if(late>0)body.impact(late);
      if(frame===359)before=body.squash;
      if(frame===360)firstAfter=body.squash;
      maxStep=Math.max(maxStep,Math.abs(body.squash-last));last=body.squash;
      assert.ok(motion.y>=support()-1e-5&&body.valid());
    }
    assert.ok(before-firstAfter<.02&&maxStep<.04,`jump ${before-firstAfter}, ${maxStep}`);
    assert.ok(before-body.squash>.1,`no weight response ${before}, ${body.squash}`);
  });

  test(`${name} stronger contact impulse compresses deeper without a root jump`,()=>{
    const weak=settle(make,{softness:1,impulse:.015});
    const strong=settle(make,{softness:1,impulse:.07});
    assert.ok(strong.minimum<weak.minimum-.1,`${strong.minimum} vs ${weak.minimum}`);
    assert.ok(strong.minimum>.16);
    assert.ok(strong.largestRootStep<.1,`root jump ${strong.largestRootStep}`);
    assert.ok(strong.motion.launches>0);
    assert.ok(Math.abs(strong.rest-weak.rest)<.015,`different final loads ${strong.rest}, ${weak.rest}`);
  });
}

test('event seeds repeat deterministically but consecutive contacts differ',()=>{
  const first=eventVariant(3.41,1),again=eventVariant(3.41,1),next=eventVariant(3.41,2);
  assert.deepEqual(first,again);
  assert.notDeepEqual(first,next);
});
