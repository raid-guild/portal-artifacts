import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { DOMParser } from '@xmldom/xmldom';
import { buildLogoGeometry } from '../src/logo-geometry.js';
import { LogoField, restAnchorFromHit } from '../src/logo-physics.js';
import { BounceMotion, worldGravity } from '../src/motion.js';

globalThis.DOMParser = DOMParser;
const svg = readFileSync(fileURLToPath(new URL('../public/assets/raidguild-stamp.svg', import.meta.url)), 'utf8');
const makeField = () => new LogoField(buildLogoGeometry(svg));

test('official SVG builds an upright, beveled, closed mark with substantial triangles', () => {
  const field = makeField(), geometry = field.restGeometry;
  assert.ok(geometry.attributes.position.count > 2000);
  assert.ok(geometry.index.count / 3 > 5000);
  assert.ok(field.guardTriangles.length > 1500);
  assert.ok(Math.abs(geometry.boundingBox.max.x - 1.35) < .01);
  assert.ok(Math.abs(geometry.boundingBox.min.x + 1.35) < .01);
  assert.ok(geometry.boundingBox.max.z - geometry.boundingBox.min.z > .35);
  assert.ok(field.valid());
});

test('real logo accepts extreme pulls with bounded gradient and visible local displacement', () => {
  const field=makeField(), anchor=new THREE.Vector3(.3,.4,.19);
  assert.equal(field.beginGrab(anchor,anchor),true);
  field.updateGrab(new THREE.Vector3(4,3,2));
  for(let frame=0;frame<90;frame++){
    field.step({softness:1,damping:0});
    assert.ok(field.valid(),`invalid frame ${frame}`);
    assert.ok(field.positions.every(Number.isFinite));
    const gradient=field.modes.reduce((sum,mode)=>sum+mode.displacement.length(),0)*Math.exp(-.5)/field.sigma;
    assert.ok(gradient<=.5);
  }
  const largest=Math.max(...field.positions.map((v,i)=>Math.abs(v-field.rest[i])));
  assert.ok(largest>.3,`visible displacement ${largest}`);
  field.endGrab();
  for(let frame=0;frame<240;frame++)field.step();
  assert.ok(field.modes.length===0);
  assert.ok(field.valid());
});

test('repeated grabs preserve residual anchors and do not jump on begin', () => {
  const field=makeField(),first=new THREE.Vector3(-.7,.5,.19),second=new THREE.Vector3(.7,-.45,.19);
  field.beginGrab(first,first);field.updateGrab(first.clone().add(new THREE.Vector3(-.5,.2,.2)));
  for(let frame=0;frame<25;frame++)field.step();
  field.endGrab();
  const before=Float64Array.from(field.positions),oldAnchor=field.modes[0].anchor.clone();
  assert.equal(field.beginGrab(second,second),true);
  assert.deepEqual([...field.positions],[...before]);
  assert.ok(field.modes[0].anchor.equals(oldAnchor));
  field.updateGrab(second.clone().add(new THREE.Vector3(.5,-.25,.15)));
  for(let frame=0;frame<50;frame++){field.step({damping:1});assert.ok(field.valid())}
  const movement=Math.max(...field.positions.map((v,i)=>Math.abs(v-before[i])));
  assert.ok(movement>.06);
  field.endGrab();
  for(let frame=0;frame<240;frame++)field.step();
  assert.equal(field.modes.length,0);
});

test('barycentric hit maps a visible triangle back to its rest anchor', () => {
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0,1,0,0,0,1,0],3));
  geometry.setIndex([0,1,2]);
  const render=geometry.clone();render.attributes.position.array[2]=.2;
  const anchor=restAnchorFromHit(geometry,render,0,new THREE.Vector3(.25,.25,.1));
  assert.ok(anchor.distanceTo(new THREE.Vector3(.25,.25,0))<1e-6);
});

test('default logo drop and repeated bounce keep contact and root motion continuous', () => {
  const field=makeField(),motion=new BounceMotion(1.95,-field.bottomRest);
  let padOffset=0,padVelocity=0;
  const floor=(x,z)=>{
    const t=THREE.MathUtils.clamp((1.35-Math.hypot(x,z))/.35,0,1);
    return .09+(.15+padOffset)*t*t*(3-2*t);
  };
  const support=()=>{let needed=-Infinity;for(let i=0;i<field.positions.length;i+=3)needed=Math.max(needed,floor(field.positions[i],field.positions[i+2])-field.positions[i+1]);return needed};
  const start=Float64Array.from(field.positions);
  field.impact(.04);
  assert.equal(field.squash,1);
  assert.deepEqual([...field.positions],[...start]);
  field.squashVelocity=0;
  const scales=[];let largestRootStep=0,previousY=motion.y,secondBouncePeak=1;
  for(let frame=0;frame<660;frame++){
    if(frame===420)motion.kick(.058);
    padVelocity+=(-65*padOffset-14*padVelocity-(motion.grounded?worldGravity(.55)*.18:0))/60;
    padOffset=THREE.MathUtils.clamp(padOffset+padVelocity/60,-.1,.015);
    const impact=motion.beforeShape(support(),.55,.38,field.squash,field.squashVelocity);
    if(impact>0){
      field.impact(impact);
      if(impact>.003)padVelocity-=impact*60*.12;
    }
    field.step({softness:.65,damping:.38,contactLoad:motion.grounded?worldGravity(.55):0});
    const late=motion.afterShape(support(),field.squash,field.squashVelocity,.55);
    if(late>0)field.impact(late);
    scales.push(field.squash);
    largestRootStep=Math.max(largestRootStep,Math.abs(motion.y-previousY));previousY=motion.y;
    if(frame>420)secondBouncePeak=Math.min(secondBouncePeak,field.squash);
    assert.ok(motion.y>=support()-1e-5,`penetration at frame ${frame}`);
    assert.ok(field.valid());
  }
  const first=scales.findIndex(s=>s<.99),peak=scales.indexOf(Math.min(...scales));
  assert.ok(first>5&&peak>=first+2);
  assert.ok(Math.min(...scales)<.9);
  assert.ok(largestRootStep<.065,`abrupt root step ${largestRootStep}`);
  assert.ok(secondBouncePeak<.95);
  assert.ok(motion.touchdowns>=3);
  assert.ok(motion.launches>=2);
  assert.ok(Math.abs(scales.at(-1)-.9)<.025);
});
