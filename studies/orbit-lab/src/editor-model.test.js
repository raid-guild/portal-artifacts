import test from 'node:test';
import assert from 'node:assert/strict';
import level from './levels/campaign-1.json' with { type: 'json' };
import { EditorModel, makeBlankLevelDocument } from './editor-model.js';
import { validateLevelDocument } from './level-document.js';

test('placing successive portal pairs reserves connection IDs independently of endpoint IDs', () => {
  const model = new EditorModel(makeBlankLevelDocument());
  for (const x of [8, 24]) {
    const pairId = model.nextId('pair');
    for (const y of [-6, 6]) {
      const id = model.nextId('portal');
      model.transact(doc => doc.entities.push({id, type:'portal', x, y, radius:.9, pairId, exitDirection:0}));
    }
  }
  assert.deepEqual(model.document.entities.map(e => e.pairId), ['pair-1', 'pair-1', 'pair-2', 'pair-2']);
  assert.equal(validateLevelDocument(model.document).ok, true);
  model.undo(); model.redo();
  assert.equal(model.nextId('pair'), 'pair-3');
});

test('transactions, one undo per painted stroke, redo, and stable IDs', () => {
  const model = new EditorModel(level);
  assert.equal(model.nextId('wall'), 'wall-1');
  model.paint(doc => doc.walls.push({id:'wall-1',x:2,y:2,width:1,height:1}));
  model.paint(doc => doc.walls.push({id:'wall-2',x:3,y:2,width:1,height:1}));
  model.endStroke();
  assert.equal(model.undoStack.length, 1);
  assert.equal(model.document.walls.length, 2);
  model.undo(); assert.equal(model.document.walls.length, 0);
  model.redo(); assert.equal(model.document.walls.length, 2);
  assert.equal(model.nextId('wall'),'wall-3');
  model.transact(doc => { doc.title = 'New title'; });
  assert.equal(model.document.title, 'New title');
  model.undo(); assert.equal(model.document.title, level.title);
});

test('clear all and start new are each one undoable document transaction', () => {
  const model = new EditorModel(level);
  model.transact(doc => { doc.walls.push({ id: 'wall-1', x: 10, y: 10, width: 1, height: 1 }); });
  const withWall = structuredClone(model.document);
  model.clearAll();
  assert.deepEqual(model.document.walls, []);
  assert.deepEqual(model.document.entities, []);
  assert.deepEqual(model.document.wallPaths, []);
  for (const key of ['id','title','bounds','settings','start','exit']) assert.deepEqual(model.document[key], withWall[key]);
  model.undo(); assert.deepEqual(model.document, withWall);
  model.startNew(); assert.deepEqual(model.document, makeBlankLevelDocument());
  assert.equal(model.validation.ok, true);
  model.undo(); assert.deepEqual(model.document, withWall);
});

test('paint merges exact geometry and erase cuts a gap with one undo per stroke', () => {
  const model = new EditorModel(level);
  for (const x of [10, 11, 12, 13]) model.paintWall({id:model.nextId('wall'),x,y:10,width:1,height:1});
  model.endStroke();
  assert.equal(model.document.walls.length,1);
  const merged = structuredClone(model.document);
  model.eraseWall({id:'cut',x:11,y:10,width:1,height:1});
  model.endStroke();
  assert.equal(model.document.walls.length,2);
  model.undo(); assert.deepEqual(model.document,merged);
  model.redo(); assert.equal(model.document.walls.length,2);
});

test('property edits close as one stroke before changing inspector context', () => {
  const model = new EditorModel(level);
  model.selected = 'bass';
  model.paint(doc => { doc.entities[0].radius = 1.4; });
  model.paint(doc => { doc.entities[0].radius = 1.8; });
  model.endStroke();
  assert.equal(model.undoStack.length, 1);
  assert.equal(model.document.entities[0].radius, 1.8);
  model.undo();
  assert.equal(model.document.entities[0].radius, .9);
});

test('three-body orbit preset is one valid undoable transaction and rejects edges',()=>{
  const model=new EditorModel(level);
  const result=model.addOrbitRing({x:20,y:12});
  assert.equal(result.ok,true);
  assert.equal(model.document.entities.length,level.entities.length+3);
  assert.equal(new Set(result.ids).size,3);
  assert.equal(model.validation.ok,true,model.validation.errors.join('\n'));
  assert.equal(model.undoStack.length,1);
  model.undo();assert.deepEqual(model.document,level);
  model.redo();assert.equal(model.document.entities.length,level.entities.length+3);
  const before=structuredClone(model.document);
  assert.equal(model.addOrbitRing({x:75,y:0}).ok,false);
  assert.deepEqual(model.document,before);
});

test('duplicate keeps element settings, selects a fresh ID, and separates pending edits from undo', () => {
  const doc = makeBlankLevelDocument();
  doc.entities.push({id:'hold-1',type:'stillness',x:12,y:3,radius:1.2,captureTime:2,manualRelease:true,releaseDirection:270});
  const model = new EditorModel(doc);
  model.selected = 'hold-1';
  model.paint(draft => { draft.entities[0].captureTime = 3; });
  const result = model.duplicateSelected();
  assert.equal(result.ok, true);
  assert.equal(model.selected, result.id);
  const original = model.document.entities[0], duplicate = model.document.entities[1];
  assert.notEqual(duplicate.id, original.id);
  assert.equal(duplicate.captureTime, 3);
  assert.equal(duplicate.releaseDirection, 270);
  assert.deepEqual([duplicate.x - original.x, duplicate.y - original.y], [2,2]);
  duplicate.captureTime = 8;
  assert.equal(original.captureTime, 3);
  model.undo();
  assert.equal(model.document.entities.length, 1);
  assert.equal(model.document.entities[0].captureTime, 3);
  model.undo();
  assert.equal(model.document.entities[0].captureTime, 2);
  model.redo(); model.redo();
  assert.equal(model.document.entities.length, 2);
});

test('duplicate translates a complete path inside bounds without sharing points', () => {
  const doc = makeBlankLevelDocument();
  doc.wallPaths.push({id:'path-1',thickness:1,points:[{x:70,y:0},{x:73,y:4},{x:75,y:4}]});
  const model = new EditorModel(doc); model.selected = 'path-1';
  const result = model.duplicateSelected();
  assert.equal(result.ok, true, result.error);
  const [original, duplicate] = model.document.wallPaths;
  assert.deepEqual(duplicate.points.map((p,i) => [p.x-original.points[i].x,p.y-original.points[i].y]),[[-2,2],[-2,2],[-2,2]]);
  duplicate.points[0].x = 0;
  assert.equal(original.points[0].x, 70);
});

test('duplicate gates use a free slot and refuse a fourth without changing the draft', () => {
  const doc = makeBlankLevelDocument();
  doc.entities.push({id:'gate-1',type:'soundGate',x:10,y:0,radius:.9,slot:0});
  const model = new EditorModel(doc); model.selected = 'gate-1';
  assert.equal(model.duplicateSelected().ok, true);
  assert.equal(model.document.entities[1].slot, 1);
  model.selected = 'gate-1';
  assert.equal(model.duplicateSelected().ok, true);
  assert.equal(model.document.entities[2].slot, 2);
  const before = structuredClone(model.document), undoCount = model.undoStack.length;
  assert.match(model.duplicateSelected().error, /three gate slots/);
  assert.deepEqual(model.document, before);
  assert.equal(model.undoStack.length, undoCount);
});

test('duplicate portal creates a new pair with both ends and preserves endpoint settings', () => {
  const doc = makeBlankLevelDocument();
  doc.entities.push(
    {id:'portal-1',type:'portal',x:9,y:6,radius:1.1,pairId:'pair-1',exitDirection:90},
    {id:'portal-2',type:'portal',x:24,y:-4,radius:1.3,pairId:'pair-1',exitDirection:270},
  );
  const model = new EditorModel(doc); model.selected = 'portal-2';
  const result = model.duplicateSelected();
  assert.equal(result.ok, true, result.error);
  assert.equal(model.document.entities.length, 4);
  assert.equal(model.selected, model.document.entities[3].id);
  assert.equal(model.document.entities[2].pairId, model.document.entities[3].pairId);
  assert.notEqual(model.document.entities[2].pairId, 'pair-1');
  assert.equal(model.document.entities[3].exitDirection, 270);
  assert.equal(model.validation.ok, true, model.validation.errors.join(' · '));
  model.undo(); assert.equal(model.document.entities.length, 2);
  const incomplete = new EditorModel({...doc,entities:[doc.entities[0]]}); incomplete.selected='portal-1';
  const before = structuredClone(incomplete.document);
  assert.match(incomplete.duplicateSelected().error, /Complete the portal pair/);
  assert.deepEqual(incomplete.document, before);
});

test('duplicate is unavailable for start and exit but works for a selected wall', () => {
  const doc = makeBlankLevelDocument();
  const model = new EditorModel(doc);
  for (const key of ['start','exit']) { model.selected=key; assert.equal(model.duplicateSelected().ok,false); }
  doc.walls.push({id:'wall-1',x:10,y:0,width:1,height:1});
  const edited = new EditorModel(doc); edited.selected='wall-1';
  assert.equal(edited.duplicateSelected().ok,true);
  assert.equal(edited.document.walls.length,2);
});

test('duplicate refuses to exceed the compiled wall piece cap', () => {
  const doc = makeBlankLevelDocument();
  for(let index=0;index<300;index++) doc.walls.push({id:`wall-${index+1}`,x:-18+(index%30)*3,y:-24+Math.floor(index/30)*5,width:.5,height:.5});
  const model = new EditorModel(doc); model.selected='wall-1';
  const before=structuredClone(model.document);
  const result=model.duplicateSelected();
  assert.equal(result.ok,false);
  assert.deepEqual(model.document,before);
  assert.equal(model.undoStack.length,0);
});

test('an unrelated draft error does not block duplicating a valid element', () => {
  const doc = makeBlankLevelDocument();
  doc.title = '';
  doc.entities.push({id:'impulse-1',type:'impulse',x:10,y:0,radius:1,direction:270,speed:16});
  const model = new EditorModel(doc); model.selected='impulse-1';
  assert.equal(model.validation.ok,false);
  const result=model.duplicateSelected();
  assert.equal(result.ok,true,result.error);
  assert.equal(model.document.entities[1].direction,270);
  assert.equal(model.document.title,'');
});
