import test from 'node:test';
import assert from 'node:assert/strict';
import level from './levels/campaign-1.json' with { type: 'json' };
import { EditorModel, makeBlankLevelDocument } from './editor-model.js';

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
