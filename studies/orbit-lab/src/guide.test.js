import test from 'node:test';
import assert from 'node:assert/strict';
import * as CANNON from 'cannon-es';
import {guideShape,guideProfile,profileContains,profileImpact} from './guide.js';
import {canPlaceWell,firstImpact} from './level.js';
import {getDemo} from './demos.js';
test('continuous guide matches placement and swept collision geometry',()=>{
 const level=getDemo('guide').level,profile=guideProfile();assert.equal(level.guides.length,1);assert.ok(profileContains({x:0,y:-2},profile));assert.ok(!canPlaceWell({x:0,y:-2},level));assert.ok(canPlaceWell({x:0,y:1},level));assert.ok(profileImpact({x:0,y:0},{x:0,y:-4},profile)!==null);assert.equal(firstImpact({x:0,y:0},{x:0,y:-4},level).type,'wall');
});
test('a sphere moves across the arch without catching between bodies',()=>{
 const world=new CANNON.World({gravity:new CANNON.Vec3(0,-3,0)}),mat=new CANNON.Material();world.addContactMaterial(new CANNON.ContactMaterial(mat,mat,{friction:0,restitution:0}));
 const wall=new CANNON.Body({mass:0,material:mat,shape:guideShape(guideProfile())});world.addBody(wall);
 const hero=new CANNON.Body({mass:1,material:mat,shape:new CANNON.Sphere(.31),linearDamping:0,fixedRotation:true});hero.position.set(-4.5,-1.8,0);hero.velocity.set(4,0,0);world.addBody(hero);
 for(let i=0;i<360;i++){hero.applyForce(new CANNON.Vec3(2,0,0));world.step(1/120);hero.position.z=0;hero.velocity.z=0;}
 assert.ok(hero.position.x>4,`progress: ${hero.position.x}`);assert.ok(Number.isFinite(hero.position.y));
});
