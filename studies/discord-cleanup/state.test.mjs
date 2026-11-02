import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { VERSION, validateSnapshot, loadProgress, persistProgress } from '../../public/discord-cleanup/state.mjs';

const data = JSON.parse(readFileSync(new URL('../../public/discord-cleanup/audit.json', import.meta.url)));
const ids = new Set(data.channels.map(channel => channel.id));

test('sanitized inventory has expected coverage and no Discord snowflake IDs', () => {
  assert.equal(data.channels.length, 116);
  assert.equal(new Set(data.channels.map(channel => channel.category)).size, 17);
  assert.equal(data.channels.filter(channel => channel.action === 'Stage in Valhalla').length, 13);
  assert.equal(data.channels.filter(channel => channel.evidence.toLowerCase().includes('unreadable')).length, 21);
  assert.equal(ids.size, 116);
  assert.ok(data.channels.every(channel => !/^\d{15,}$/.test(channel.id)));
  assert.ok(data.channels.every(channel => Object.keys(channel).sort().join(',') === 'action,category,evidence,id,name,note,type'));
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
