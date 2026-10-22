import test from 'node:test';
import assert from 'node:assert/strict';
import one from './levels/campaign-1.json' with { type: 'json' };
import two from './levels/campaign-2.json' with { type: 'json' };
import four from './levels/campaign-4.json' with { type: 'json' };
import { compileLevelDocument, parseLevelDocument, validateLevelDocument } from './level-document.js';
const copy = value => structuredClone(value);

test('both campaign documents normalize and round-trip through the shared compiler', () => {
  for (const doc of [one, two]) {
    const checked = validateLevelDocument(doc);
    assert.equal(checked.ok, true, checked.errors.join('\n'));
    assert.deepEqual(parseLevelDocument(JSON.stringify(checked.document)).document, checked.document);
    const compiled = compileLevelDocument(doc);
    assert.equal(compiled.level.walls.length, 4);
    assert.equal(compiled.level.goal.gravity, 5);
  }
});

test('invalid version, types, numbers, IDs, slots, and missing exit fail validation', () => {
  const changes = [
    d => { d.version = 2; }, d => { d.exit = null; }, d => { d.exit.gravity = null; },
    d => { d.start.speed = Infinity; }, d => { d.entities[0].type = 'prism'; },
    d => { d.entities[1].id = d.entities[0].id; }, d => { d.entities[1].slot = 0; },
  ];
  for (const change of changes) { const d = copy(one); change(d); assert.equal(validateLevelDocument(d).ok, false); }
});

test('paired transport cannot replace required exit and unsafe endpoints fail', () => {
  const d = copy(one);
  d.entities.push({ id: 'p1', type: 'portal', pairId: 'a', x: 15, y: 12, radius: 1, exitDirection: 0 });
  assert.equal(validateLevelDocument(d).ok, false);
  d.entities.push({ id: 'p2', type: 'portal', pairId: 'a', x: 20, y: 12, radius: 1, exitDirection: 0 });
  assert.equal(validateLevelDocument(d).ok, true);
  d.exit = null;
  assert.equal(validateLevelDocument(d).ok, false);
  d.exit = copy(one.exit); d.entities.at(-1).x = 75;
  assert.equal(validateLevelDocument(d).ok, false);
});

test('walls and orbit sweeps fit bounds; lethal start is evaluated at orbital phase', () => {
  const d = copy(one);
  d.walls.push({ id: 'w', x: 0, y: 0, width: 100, height: 1 });
  assert.equal(validateLevelDocument(d).ok, false);
  d.walls = [];
  d.entities.push({ id: 'orb', type: 'ember', x: 0, y: 0, radius: 1, gravity: 0, lethal: true, motion: 'orbit', speed: 1, orbitRadius: 8, phase: 0 });
  assert.equal(validateLevelDocument(d).ok, true);
  d.entities.at(-1).orbitRadius = 30;
  assert.equal(validateLevelDocument(d).ok, false);
});

test('document settings compile without losing budget, resource, or exit gravity', () => {
  const d = copy(one);
  Object.assign(d.settings, { startLight:.2, burnRate:.05, graceSeconds:3, wellStrength:245, wellLifetime:25, maxActiveWells:4, maxTotalWells:6, randomRecharge:false });
  d.exit.gravity=11;
  const compiled=compileLevelDocument(d);
  assert.deepEqual(compiled.settings,d.settings);
  assert.equal(compiled.level.goal.gravity,11);
});

test('optional wallPaths round-trip and compile into rotated collision pieces', () => {
  const d=copy(one);
  assert.deepEqual(validateLevelDocument(d).document.wallPaths,[]);
  d.wallPaths=[{id:'bend',thickness:.6,points:[{x:3,y:-8},{x:5,y:-6},{x:7,y:-7}]}];
  const checked=validateLevelDocument(d);
  assert.equal(checked.ok,true,checked.errors.join('\n'));
  assert.deepEqual(parseLevelDocument(JSON.stringify(checked.document)).document,checked.document);
  const compiled=compileLevelDocument(d);
  assert.equal(compiled.level.walls.length,6);
  assert.ok(compiled.level.walls[4].angle!==0);
});

test('wall path IDs, points, bounds, start, exit, and portal ejection are validated', () => {
  const base=copy(one);base.wallPaths=[{id:'line',thickness:.5,points:[{x:1,y:2},{x:4,y:2}]}];
  assert.equal(validateLevelDocument(base).ok,true);
  const bad=[
    d=>{d.wallPaths[0].points[1]={x:1,y:2};},
    d=>{d.wallPaths[0].id=d.entities[0].id;},
    d=>{d.wallPaths[0].thickness=-1;},
    d=>{d.wallPaths[0].points[1]={x:77,y:2};},
    d=>{d.wallPaths[0].points=[{x:d.start.x,y:d.start.y},{x:d.start.x+2,y:d.start.y}];},
    d=>{d.wallPaths[0].points=[{x:d.exit.x,y:d.exit.y},{x:d.exit.x+2,y:d.exit.y}];},
  ];
  for(const mutate of bad){const d=copy(base);mutate(d);assert.equal(validateLevelDocument(d).ok,false);}
  const portal=copy(base);portal.entities.push({id:'a',type:'portal',pairId:'pair',x:-4,y:10,radius:1,exitDirection:0},{id:'b',type:'portal',pairId:'pair',x:0,y:10,radius:1,exitDirection:0});
  portal.wallPaths[0].points=[{x:1.5,y:9},{x:1.5,y:11}];
  assert.equal(validateLevelDocument(portal).ok,false);
});

test('orbit direction is optional for older JSON and round-trips when clockwise',()=>{
  const d=copy(one);d.entities.push({id:'orbital',type:'ember',x:20,y:10,radius:.35,gravity:0,lethal:true,motion:'orbit',speed:2.3,orbitRadius:3.5,phase:120});
  const legacy=validateLevelDocument(d);assert.equal(legacy.ok,true,legacy.errors.join('\n'));
  assert.equal(legacy.document.entities.at(-1).orbitDirection,'counterclockwise');
  d.entities.at(-1).orbitDirection='clockwise';
  const checked=validateLevelDocument(d);assert.equal(checked.ok,true,checked.errors.join('\n'));
  assert.equal(parseLevelDocument(JSON.stringify(checked.document)).document.entities.at(-1).orbitDirection,'clockwise');
  d.entities.at(-1).orbitDirection='sideways';assert.equal(validateLevelDocument(d).ok,false);
});

test('campaign companion pickups survive schema round-trip and require a valid influence radius', () => {
  const checked=validateLevelDocument(two);
  assert.equal(checked.ok,true,checked.errors.join('\n'));
  assert.equal(checked.document.entities.filter(e=>e.type==='companion').length,2);
  assert.deepEqual(compileLevelDocument(checked.document).entities.filter(e=>e.type==='companion'),two.entities.filter(e=>e.type==='companion'));
  const invalid=copy(two);invalid.entities.find(e=>e.type==='companion').captureRadius=NaN;
  assert.equal(validateLevelDocument(invalid).ok,false);
});

test('manualRelease defaults off in older stillness and eclipse documents and round-trips when enabled', () => {
  const legacy = copy(one);
  legacy.entities.push({ id:'old-wait', type:'stillness', x:10, y:9, radius:1, captureTime:2 });
  legacy.entities.push({ id:'old-eclipse', type:'eclipse', x:20, y:9, radius:1, captureTime:2, fadeTime:2 });
  const checked = validateLevelDocument(legacy);
  assert.equal(checked.ok, true, checked.errors.join('\n'));
  assert.deepEqual(checked.document.entities.slice(-2).map(entity => entity.manualRelease), [false, false]);
  const fourth = validateLevelDocument(four);
  assert.equal(fourth.ok, true, fourth.errors.join('\n'));
  assert.equal(parseLevelDocument(JSON.stringify(fourth.document)).document.entities.find(entity => entity.id === 'waiting-place').manualRelease, true);
  const invalid = copy(four); invalid.entities.find(entity => entity.id === 'waiting-place').manualRelease = 'yes';
  assert.equal(validateLevelDocument(invalid).ok, false);
});

test('stillness and eclipse optionally direct release without changing document version', () => {
  const document = copy(one);
  document.entities.push(
    { id:'wait', type:'stillness', x:10, y:9, radius:1, captureTime:2, manualRelease:true },
    { id:'shade', type:'eclipse', x:20, y:9, radius:1, captureTime:2, fadeTime:2, releaseDirection:0 },
  );
  const checked = validateLevelDocument(document);
  assert.equal(checked.ok, true, checked.errors.join('\n'));
  assert.equal(checked.document.version, 1);
  assert.equal(checked.document.entities.find(entity => entity.id === 'wait').releaseDirection, null);
  assert.equal(checked.document.entities.find(entity => entity.id === 'shade').releaseDirection, 0);
  for (const direction of [90, 180, 270, -360, 360, null]) {
    document.entities.at(-1).releaseDirection = direction;
    const result = validateLevelDocument(document);
    assert.equal(result.ok, true, result.errors.join('\n'));
    assert.equal(parseLevelDocument(JSON.stringify(result.document)).document.entities.at(-1).releaseDirection, direction);
  }
  for (const direction of ['90', NaN, Infinity, -361, 361]) {
    document.entities.at(-1).releaseDirection = direction;
    assert.equal(validateLevelDocument(document).ok, false);
  }
});
