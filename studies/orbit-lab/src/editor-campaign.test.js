import assert from 'node:assert/strict';
import test from 'node:test';
import { CAMPAIGN_LEVELS } from './campaign.js';
import { campaignTemplateOptions, createCampaignTemplate } from './editor-campaign.js';
import { EditorModel, makeBlankLevelDocument } from './editor-model.js';
import { validateLevelDocument } from './level-document.js';

test('only successful three-gate finishes offer campaign templates', () => {
  const best = { 1: 7, 2: 3, 3: 1, 4: 1, 5: 7, 99: 7 };
  assert.deepEqual(campaignTemplateOptions(CAMPAIGN_LEVELS, best).map(level => level.id), [1, 5]);
  assert.equal(createCampaignTemplate(CAMPAIGN_LEVELS, best, 2), null);
  assert.equal(createCampaignTemplate(CAMPAIGN_LEVELS, best, 99), null);
  best[5] = 3;
  assert.equal(createCampaignTemplate(CAMPAIGN_LEVELS, best, 5), null);
});

test('a campaign template is an independent, valid document and one undoable editor step', () => {
  const best = { 1: 1, 2: 1, 3: 1, 4: 1, 5: 7 };
  const source = CAMPAIGN_LEVELS.find(level => level.id === 5).document;
  const first = createCampaignTemplate(CAMPAIGN_LEVELS, best, 5, () => 'first');
  const second = createCampaignTemplate(CAMPAIGN_LEVELS, best, 5, () => 'second');
  assert.equal(first.id, 'custom-first');
  assert.notEqual(first.id, source.id);
  assert.notEqual(first.id, second.id);
  assert.equal(first.title, `${source.title} — remix`);
  assert.equal(validateLevelDocument(first).ok, true);
  assert.deepEqual(first.entities, source.entities);
  assert.deepEqual(first.walls, source.walls);
  assert.deepEqual(first.wallPaths, source.wallPaths);
  assert.deepEqual(first.settings, source.settings);
  first.entities[0].x += 1;
  assert.notEqual(first.entities[0].x, source.entities[0].x);

  const original = makeBlankLevelDocument();
  const model = new EditorModel(original);
  assert.equal(model.loadDocument(first), true);
  assert.equal(model.undoStack.length, 1);
  assert.deepEqual(model.document, first);
  model.undo();
  assert.deepEqual(model.document, original);
  model.redo();
  assert.deepEqual(model.document, first);
});

test('old out-of-order perfect records cannot expose locked templates', () => {
  const best = { 1: 0, 2: 7, 5: 7 };
  assert.deepEqual(campaignTemplateOptions(CAMPAIGN_LEVELS, best), []);
  assert.equal(createCampaignTemplate(CAMPAIGN_LEVELS, best, 2), null);
  assert.equal(createCampaignTemplate(CAMPAIGN_LEVELS, best, 5), null);
});
