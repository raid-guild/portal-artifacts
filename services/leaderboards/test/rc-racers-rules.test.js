import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { VERSION, validateStart, validateFinish, validateBoardQuery, boardAnswer, finishRanks } from '../src/rc-racers-rules.js';

const fixture = name => new URL(`./fixtures/rc-racers/${name}`, import.meta.url);
const json = async name => JSON.parse(await readFile(fixture(name), 'utf8'));
const floors = await json('floors.json');
const statusOf = (result, ok) => result.ok ? ok : result.status;

test('the rules and the floor table are the game fixtures, unchanged', async () => {
  const rules = await readFile(new URL('../src/rc-racers-rules.js', import.meta.url), 'utf8');
  const [header, ...rest] = rules.split('\n');
  assert.match(header, /^\/\/ .*apps\/mini-rc-racers-game\/tests\/fixtures\/portal-api\/rules\.mjs/);
  assert.equal(rest.join('\n'), await readFile(fixture('rules.mjs'), 'utf8'));
  assert.equal(await readFile(new URL('../src/rc-racers-floors.json', import.meta.url), 'utf8'), await readFile(fixture('floors.json'), 'utf8'));
  assert.equal(floors.scoringVersion, VERSION);
});

test('every start case', async () => {
  for (const c of await json('start-cases.json')) assert.equal(statusOf(validateStart(c.body, floors), 201), c.expect.status, c.name);
});

test('every finish case', async () => {
  for (const c of await json('finish-cases.json')) {
    assert.equal(statusOf(validateFinish(c.body, c.runConfig, c.wallMs, floors), 200), c.expect.status, c.name);
  }
});

test('every leaderboard query case', async () => {
  for (const c of await json('leaderboard-query-cases.json')) assert.equal(statusOf(validateBoardQuery(c.query, floors), 200), c.expect.status, c.name);
});

test('every board case', async () => {
  for (const c of await json('board-cases.json')) {
    assert.deepEqual(boardAnswer(c.runs, c.query, c.viewer), { entries: c.expect.entries, mine: c.expect.mine }, c.name);
    if (c.finished) assert.deepEqual(finishRanks(c.runs, c.finished), c.expect.ranks, c.name);
  }
});
