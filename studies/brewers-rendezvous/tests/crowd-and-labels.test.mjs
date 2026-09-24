import test from 'node:test';
import assert from 'node:assert/strict';
import {OrthographicCamera, Vector3} from '../dist/vendor/three.module.js';
import {breweryStops} from '../dist/js/content.js';
import {visitorRoutes} from '../dist/js/crowd-routes.js';
import {routeIsClear} from '../dist/js/layout.js';
import {projectLabels} from '../dist/js/label-projection.js';

test('twelve roaming animals stay in walkable park space; half carry tasters',()=>{
  assert.equal(visitorRoutes.length,12);
  assert.equal(visitorRoutes.filter(route=>route.glass).length,6);
  for(const route of visitorRoutes){
    assert.ok(route.points.length>=3);
    assert.ok(routeIsClear(route.points,breweryStops),`${route.animal} route crosses a booth or park edge`);
  }
});

test('labels project from the current orbit before render',()=>{
  const camera=new OrthographicCamera(-20,20,12,-12,.1,150);
  const stop={id:'sample',type:'beer',x:7,z:0};
  camera.position.set(30,24,32);camera.lookAt(0,0,0);
  const first=projectLabels([stop],camera,1000,600).get('sample');
  camera.position.set(-30,24,32);camera.lookAt(0,0,0);
  const second=projectLabels([stop],camera,1000,600).get('sample');
  const expected=new Vector3(7,4.1,0).project(camera);
  assert.ok(Math.hypot(second.x-first.x,second.y-first.y)>100,'orbit must move the projected label');
  assert.ok(Math.abs(second.x-(expected.x*.5+.5)*1000)<1e-8);
  assert.equal(projectLabels([stop],camera,1000,600,'another').get('sample').visible,false);
});
