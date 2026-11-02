import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import { VERSION, validateSnapshot, loadProgress, persistProgress } from '../../public/discord-cleanup/state.mjs';

const data = JSON.parse(readFileSync(new URL('../../public/discord-cleanup/audit.json', import.meta.url)));
const ids = new Set(data.channels.map(channel => channel.id));

test('sanitized inventory has expected coverage and no Discord snowflake IDs', () => {
  assert.equal(data.channels.length, 116);
  assert.equal(new Set(data.channels.map(channel => channel.category)).size, 17);
  assert.equal(data.channels.filter(channel => (channel.originalAction || channel.action) === 'Stage in Valhalla').length, 13);
  assert.equal(data.channels.filter(channel => channel.evidence.toLowerCase().includes('unreadable')).length, 21);
  assert.equal(ids.size, 116);
  assert.ok(data.channels.every(channel => !/^\d{15,}$/.test(channel.id)));
  const allowed = new Set(['action','category','evidence','id','name','note','type','originalAction','plannedCategory','plannedName','reviewGate']);
  assert.ok(data.channels.every(channel => Object.keys(channel).every(key => allowed.has(key))));
  assert.equal(data.planRevisedAt, '2026-11-02');
  const byId = Object.fromEntries(data.channels.map(channel => [channel.id,channel]));
  assert.deepEqual([byId['governance-announcements'].plannedCategory,byId['governance-announcements'].plannedName],['Guild HQ','governance-announcements']);
  assert.deepEqual([byId['guild-hq-summer-brigade-26'].plannedCategory,byId['guild-hq-summer-brigade-26'].plannedName],['Bard','content-workshop']);
  assert.ok(['guild-hq-treasury','guild-hq-legals','guild-hq-ops'].every(id => byId[id].plannedCategory === 'Agency Ops'));
  assert.ok(data.channels.filter(channel => channel.action === 'Hold for owner review').every(channel => channel.reviewGate));
});

test('import validates every record before accepting a snapshot', () => {
  const id = data.channels[0].id;
  const good = { version: VERSION, records: { [id]: { status: 'blocked', owner: 'Team', notes: 'Check bot route' } } };
  assert.deepEqual(validateSnapshot(good, ids).records, good.records);
  for (const bad of [
    { ...good, version: 999 },
    { version: VERSION, records: { ...good.records, unknown: { status: 'done', owner: '', notes: '' } } },
    { version: VERSION, records: { [id]: { status: 'verified', owner: '', notes: '' } } },
    { version: VERSION, records: { [id]: { status: 'done', owner: 'x'.repeat(81), notes: '' } } },
    { version: VERSION, records: { [id]: { status: 'done', owner: '', notes: '<script>', extra: true } } },
  ]) assert.throws(() => validateSnapshot(bad, ids));
});

test('storage failures keep a temporary session and never claim persistence', () => {
  const throwing = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
  assert.equal(loadProgress(throwing, 'key', ids).persistent, false);
  assert.equal(persistProgress(throwing, 'key', {}, ids), false);
  const corrupt = { getItem() { return '{broken'; } };
  assert.equal(loadProgress(corrupt, 'key', ids).persistent, false);
  let stored;
  const working = { getItem() { return stored; }, setItem(_key,value) { stored=value; } };
  const records = { [data.channels[0].id]: { status: 'in-progress', owner: 'RG', notes: 'Awaiting owner' } };
  assert.equal(persistProgress(working, 'key', records, ids), true);
  assert.deepEqual(loadProgress(working, 'key', ids).records, records);
});

test('old task IDs remain valid in a progress backup after checklist expansion', () => {
  const oldTaskCounts = [3,3,4,3,4,3];
  const oldTasks = oldTaskCounts.flatMap((count, phase) => Array.from({length: count}, (_, index) => `task-${phase+1}-${index+1}`));
  const source = readFileSync(new URL('../../public/discord-cleanup/app.mjs', import.meta.url),'utf8');
  const planSource = source.slice(source.indexOf('const phases ='),source.indexOf('const $ ='));
  const currentTasks = runInNewContext(`${planSource}\ntasks.map(task => task.id)`);
  assert.equal(currentTasks.length,29);
  assert.ok(oldTasks.every(id => currentTasks.includes(id)));
  const expandedIds = new Set([...ids,...currentTasks]);
  const records = Object.fromEntries(oldTasks.map(id => [id,{status:'done',owner:'',notes:''}]));
  assert.deepEqual(validateSnapshot({version:VERSION,records},expandedIds).records,records);
});
