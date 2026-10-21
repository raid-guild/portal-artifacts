import test from 'node:test';
import assert from 'node:assert/strict';
import level from './levels/campaign-2.json' with { type: 'json' };
import { EditorModel } from './editor-model.js';
import { clearIneligibleCompanionBurn, defaultCompanionEntity } from './editor-entities.js';
import { compileLevelDocument, parseLevelDocument, validateLevelDocument } from './level-document.js';

test('editor companion defaults, undo, export, and playtest compilation preserve collection radius', () => {
  const model = new EditorModel(level);
  const companion = defaultCompanionEntity(model.nextId('companion'), -10, 8);
  assert.deepEqual(companion, { id: 'companion-1', type: 'companion', x: -10, y: 8, radius: .16, captureRadius: 2.8 });
  model.transact(doc => doc.entities.push(companion));
  assert.equal(model.validation.ok, true, model.validation.errors.join('\n'));
  assert.equal(model.undoStack.length, 1);
  model.undo();
  assert.equal(model.document.entities.some(entity => entity.id === companion.id), false);
  model.redo();
  const exported = parseLevelDocument(JSON.stringify(model.validation.document));
  assert.equal(exported.ok, true);
  assert.deepEqual(compileLevelDocument(exported.document).entities.find(entity => entity.id === companion.id), companion);
});

test('ember burn restriction clears with motion or lethal edit in one undoable change', () => {
  for (const change of [ember => { ember.motion = 'chaser'; }, ember => { ember.lethal = false; }]) {
    const model = new EditorModel(level);
    model.transact(doc => {
      const ember = doc.entities.find(entity => entity.id === 'giant');
      change(ember);
      clearIneligibleCompanionBurn(ember);
    });
    assert.equal(model.document.entities.find(entity => entity.id === 'giant').burnsCompanions, false);
    assert.equal(model.validation.ok, true, model.validation.errors.join('\n'));
    assert.equal(model.undoStack.length, 1);
    model.undo();
    assert.equal(model.document.entities.find(entity => entity.id === 'giant').burnsCompanions, true);
  }
});

test('invalid imported ember combination remains a validation error; old missing field defaults false', () => {
  const invalid = structuredClone(level);
  const ember = invalid.entities.find(entity => entity.id === 'giant');
  ember.motion = 'chaser';
  assert.equal(validateLevelDocument(invalid).ok, false);
  assert.ok(validateLevelDocument(invalid).errors.some(error => error.includes('burnsCompanions requires')));
  delete ember.burnsCompanions;
  const old = validateLevelDocument(invalid);
  assert.equal(old.ok, true, old.errors.join('\n'));
  assert.equal(old.document.entities.find(entity => entity.id === 'giant').burnsCompanions, false);
});
