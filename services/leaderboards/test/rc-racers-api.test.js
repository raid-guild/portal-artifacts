import { test } from 'node:test';
import assert from 'node:assert/strict';
import pg from 'pg';
import { readFile } from 'node:fs/promises';
import { SignJWT } from 'jose';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { createRcRacersApp, GAME, VERSION } from '../src/rc-racers-app.js';
import { createCombinedApp } from '../src/combined.js';
import { MESSAGES } from '../src/rc-racers-rules.js';

const secret = 'rc-racers-test-secret-with-at-least-32-characters', origin = 'http://localhost:5173', issuer = 'https://portal.rc-racers.example.test';
const json = async name => JSON.parse(await readFile(new URL(`./fixtures/rc-racers/${name}`, import.meta.url), 'utf8'));
const answer = name => json(`responses/${name}.json`);
const UUID_V4 = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;
const CONTRACT_MESSAGES = new Set([...Object.values(MESSAGES), 'Open Mini RC Racers directly to use the leaderboard.',
  'This request is too large.', 'Launch Mini RC Racers from Portal to join the leaderboard.',
  'Your Portal session expired. Launch Mini RC Racers from Portal again.', 'Ranked run limit reached. Local play still works.',
  'Ranked run not found.', 'This run was already submitted.', 'This ranked run expired. Your result is kept in this browser.',
  'Leaderboard temporarily unavailable. Local play still works.', 'Not found.']);

async function listening(app) {
  const server = app.listen(0, '127.0.0.1');
  await new Promise(r => server.once('listening', r));
  const root = `http://127.0.0.1:${server.address().port}`;
  return { server, root, base: `${root}/leaderboard-api/${GAME}` };
}
const close = server => new Promise(r => server.close(r));
const boardQuery = query => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) for (const one of [value].flat()) params.append(key, String(one));
  return `/leaderboard?${params}`;
};
const kindOf = value => value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
// The game reads these answers: the same keys and the same types as its responses/*.json.
function sameShape(actual, expected, where = 'answer') {
  assert.equal(kindOf(actual), kindOf(expected), where);
  if (kindOf(expected) === 'array') for (const [i, item] of actual.entries()) if (expected.length) sameShape(item, expected[0], `${where}[${i}]`);
  if (kindOf(expected) === 'object') {
    assert.deepEqual(Object.keys(actual).sort(), Object.keys(expected).sort(), where);
    for (const key of Object.keys(expected)) sameShape(actual[key], expected[key], `${where}.${key}`);
  }
}
function assertHeaders(res) {
  assert.equal(res.headers.get('cache-control'), 'no-store');
  assert.equal(res.headers.get('referrer-policy'), 'no-referrer');
  assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
}
async function assertError(res, status, message) {
  assert.equal(res.status, status);
  assertHeaders(res);
  const body = await res.json();
  assert.deepEqual(body, status === 409 ? { message, version: VERSION } : { message });
  return body;
}

test('without its secret only rc-racers answers 503; the module refuses bad POSTs before the database', async () => {
  const pool = { query() { throw new Error('database should not be used'); }, connect() { throw new Error('database should not be used'); } };
  const other = ['/health', '/leaderboard-api/cosmic-carnival/session', '/leaderboard-api/cosmic-carnival/leaderboard',
    '/leaderboard-api/neon-drop/session', '/leaderboard-api/puddle-study/session', '/leaderboard-api/raid-survivor/session', '/leaderboard-api/elsewhere'];
  const without = await listening(createCombinedApp({ pool, origin, issuer, cosmicSecret: secret, neonSecret: secret }));
  const withModule = await listening(createCombinedApp({ pool, origin, issuer, cosmicSecret: secret, neonSecret: secret, rcRacersSecret: secret }));
  try {
    const unavailable = await answer('error-503');
    for (const path of ['/session', '/ready', '/callback?token=x', boardQuery({ kind: 'lap', track: 'cuenca-rc', direction: 'clockwise', class: 'fwd-105', weather: 'all', version: '1' })]) {
      const res = await fetch(without.base + path, { redirect: 'manual' });
      assert.equal(res.status, 503, path); assert.equal(res.headers.get('cache-control'), 'no-store'); assert.deepEqual(await res.json(), unavailable);
    }
    const post = await fetch(without.base + '/runs', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: '{}' });
    assert.equal(post.status, 503); assert.deepEqual(await post.json(), unavailable);
    for (const path of other) {
      const [a, b] = await Promise.all([fetch(without.root + path), fetch(withModule.root + path)]);
      assert.equal(a.status, b.status, path); assert.equal(await a.text(), await b.text(), path);
    }

    const { base } = withModule;
    const send = (path, init) => fetch(base + path, { method: 'POST', ...init });
    await assertError(await send('/runs', { headers: { Origin: 'https://evil.test', 'Content-Type': 'application/json' }, body: '{}' }), 403, 'Open Mini RC Racers directly to use the leaderboard.');
    await assertError(await send('/runs', { headers: { 'Content-Type': 'application/json' }, body: '{}' }), 403, 'Open Mini RC Racers directly to use the leaderboard.');
    await assertError(await send('/runs', { headers: { Origin: origin, 'Content-Type': 'text/plain' }, body: '{}' }), 403, 'Open Mini RC Racers directly to use the leaderboard.');
    await assertError(await send('/logout', { headers: { Origin: 'https://evil.test', 'Content-Type': 'application/json' }, body: '{}' }), 403, 'Open Mini RC Racers directly to use the leaderboard.');
    const json = { Origin: origin, 'Content-Type': 'application/json' };
    await assertError(await send('/runs', { headers: json, body: JSON.stringify({ pad: 'x'.repeat(5000) }) }), 413, 'This request is too large.');
    await assertError(await send('/runs', { headers: json, body: '{"version":' }), 400, MESSAGES.invalid);
    await assertError(await send('/runs/00000000-0000-4000-8000-000000000001/finish', { headers: json, body: 'not json' }), 400, MESSAGES.invalid);
    await assertError(await send('/runs', { headers: json, body: '{}' }), 401, 'Launch Mini RC Racers from Portal to join the leaderboard.');
    sameShape(await (await fetch(base + '/session')).json(), await answer('session-401'));
    await assertError(await fetch(base + '/session', { headers: { Cookie: 'rc_racers_ranked=not-hex' } }), 401, 'Launch Mini RC Racers from Portal to join the leaderboard.');
    await assertError(await fetch(base + boardQuery({ kind: 'lap', track: 'monaco', direction: 'clockwise', class: 'fwd-105', weather: 'all', version: '1' })), 400, MESSAGES.badQuery);
    await assertError(await fetch(base + '/nowhere'), 404, 'Not found.');
    const invalid = await fetch(base + '/callback?token=invalid', { redirect: 'manual' });
    assert.equal(invalid.status, 303);
    assert.equal(invalid.headers.get('location'), `${origin}/rc-racers/play/?ranked=launch-failed`);
    assert.equal(invalid.headers.get('set-cookie'), null);
  } finally { await close(without.server); await close(withModule.server); }

  const failing = await listening(createRcRacersApp({ pool, origin, issuer, launchSecret: secret }));
  try {
    const ready = await fetch(failing.base + '/ready');
    assert.equal(ready.status, 503); assert.deepEqual(await ready.json(), { ready: false, missing: ['database unavailable'] });
    const board = await fetch(failing.base + boardQuery({ kind: 'lap', track: 'cuenca-rc', direction: 'clockwise', class: 'fwd-105', weather: 'all', version: '1' }));
    await assertError(board, 503, 'Leaderboard temporarily unavailable. Local play still works.');
  } finally { await close(failing.server); }
  assert.throws(() => createRcRacersApp({ pool, origin, issuer, launchSecret: 'short' }), /incomplete/);
});

const database = process.env.TEST_DATABASE_URL;
test('Mini RC Racers through HTTP with a local database', { skip: !database }, async t => {
  const url = new URL(database);
  assert.ok(['localhost', '127.0.0.1'].includes(url.hostname) && url.pathname.endsWith('_test'), 'disposable local *_test database required');
  const pool = new pg.Pool({ connectionString: database });
  await pool.query(await readFile(new URL('../schema.sql', import.meta.url), 'utf8'));
  const resetRuns = async () => {
    await pool.query('DELETE FROM artifact_leaderboards.runs WHERE game=$1', [GAME]);
    await pool.query('DELETE FROM artifact_leaderboards.sessions WHERE game=$1', [GAME]);
  };
  await resetRuns();
  await pool.query('DELETE FROM artifact_leaderboards.players WHERE issuer=$1', [issuer]);
  // The default `secure` cookie: Node's fetch keeps no cookie jar, so each request sends it by hand.
  const { server, base } = await listening(createRcRacersApp({ pool, origin, issuer, launchSecret: secret }));
  const key = new TextEncoder().encode(secret);
  let subject = 7100000;
  const sign = (claims, sub) => new SignJWT({ typ: 'portal_module_launch', moduleSlug: GAME, ...claims }).setProtectedHeader({ alg: 'HS256' })
    .setIssuer(issuer).setAudience(GAME).setSubject(sub).setJti(randomUUID()).setIssuedAt().setExpirationTime('2m').sign(key);
  const launch = async (claims = { handle: 'Racer' }, sub = `user:${++subject}`) => {
    const jwt = await sign(claims, sub);
    const res = await fetch(base + '/callback?token=' + encodeURIComponent(jwt), { redirect: 'manual' });
    return { res, jwt, sub, cookie: res.headers.get('set-cookie')?.split(';')[0] };
  };
  const get = (path, cookie) => fetch(base + path, { headers: cookie ? { Cookie: cookie } : {} });
  const post = (path, cookie, body) => fetch(base + path, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) }, body: JSON.stringify(body) });
  const start = async (cookie, runConfig) => {
    const res = await post('/runs', cookie, { version: VERSION, ...runConfig });
    assert.equal(res.status, 201);
    return (await res.json()).runId;
  };
  const startedAgo = (runId, ms) => pool.query(`UPDATE artifact_leaderboards.runs SET started_at=now()-$2::int*interval '1 millisecond' WHERE id=$1`, [runId, ms]);
  // Posts a finish whose server-side `wallMs` is exactly `wallMs`: the run's row is held locked until the finish's
  // transaction waits on it, then `started_at` is set from that transaction's own start, which is its now(). The
  // activity view is read outside the lock's transaction (a transaction keeps one snapshot of it), as text to keep
  // its microseconds.
  async function finishAfter(runId, wallMs, cookie, body) {
    const lock = await pool.connect();
    try {
      await lock.query('BEGIN');
      const { rows: [{ pid }] } = await lock.query('SELECT pg_backend_pid() AS pid');
      await lock.query('SELECT id FROM artifact_leaderboards.runs WHERE id=$1 FOR UPDATE', [runId]);
      const pending = post(`/runs/${runId}/finish`, cookie, body);
      let waiting;
      for (let i = 0; i < 500 && !waiting; i++) {
        ({ rows: [waiting] } = await pool.query('SELECT xact_start::text AS started FROM pg_stat_activity WHERE $1=ANY(pg_blocking_pids(pid))', [pid]));
        if (!waiting) await new Promise(r => setTimeout(r, 10));
      }
      assert.ok(waiting, 'the finish never reached the run');
      await lock.query(`UPDATE artifact_leaderboards.runs SET started_at=$2::timestamptz-$3::int*interval '1 millisecond' WHERE id=$1`,
        [runId, waiting.started, wallMs]);
      await lock.query('COMMIT');
      return await pending;
    } catch (error) { await lock.query('ROLLBACK').catch(() => {}); throw error; } finally { lock.release(); }
  }
  const sessionFor = async playerId => {
    const token = randomBytes(32).toString('hex');
    await pool.query(`INSERT INTO artifact_leaderboards.sessions VALUES ($1,$2,$3,now()+interval '1 hour')`, [createHash('sha256').update(token).digest('hex'), playerId, GAME]);
    return `rc_racers_ranked=${token}`;
  };
  const dryFinal = { track: 'cuenca-rc', direction: 'counter-clockwise', class: 'tc-stock-175', kind: 'final', minutes: 5, weather: 'dry', cars: 7, difficulty: 'club', assisted: false };
  const goodFinish = { version: VERSION, bestLapMs: 24656, laps: 12, timeMs: 301456 };

  try {
    await t.test('the signed launch, its replay, the session and the display name', async () => {
      const first = await launch({ handle: 'Ana Racer', name: 'Ana Full Name' });
      assert.equal(first.res.status, 303);
      assert.equal(first.res.headers.get('location'), `${origin}/rc-racers/play/`);
      const setCookie = first.res.headers.get('set-cookie');
      assert.match(setCookie, /^rc_racers_ranked=[a-f0-9]{64};/);
      for (const part of ['HttpOnly', 'Secure', 'SameSite=Lax', 'Path=/leaderboard-api/rc-racers', 'Max-Age=43200']) assert.ok(setCookie.split('; ').includes(part), part);
      const replay = await fetch(base + '/callback?token=' + encodeURIComponent(first.jwt), { redirect: 'manual' });
      assert.equal(replay.status, 303);
      assert.equal(replay.headers.get('location'), `${origin}/rc-racers/play/?ranked=launch-failed`);
      assert.equal(replay.headers.get('set-cookie'), null);
      const session = await get('/session', first.cookie);
      assert.equal(session.status, 200); assertHeaders(session);
      const body = await session.json();
      assert.deepEqual(body, { displayName: 'Ana Racer', version: VERSION });
      sameShape(body, await answer('session-200'));
      assert.deepEqual(await (await get('/session', (await launch({ name: '  Bruno  ' })).cookie)).json(), { displayName: 'Bruno', version: VERSION });
      assert.deepEqual(await (await get('/session', (await launch({})).cookie)).json(), { displayName: 'Portal player', version: VERSION });
      assert.equal((await (await get('/session', (await launch({ handle: 'x'.repeat(70) })).cookie)).json()).displayName, 'x'.repeat(60));
      // A later launch updates the name.
      const renamed = await launch({ handle: 'Ana R.' }, first.sub);
      assert.equal((await (await get('/session', renamed.cookie)).json()).displayName, 'Ana R.');
      await assertError(await get('/session', 'rc_racers_ranked=' + 'a'.repeat(64)), 401, 'Your Portal session expired. Launch Mini RC Racers from Portal again.');
      const wrongAudience = await new SignJWT({ typ: 'portal_module_launch', moduleSlug: 'neon-drop' }).setProtectedHeader({ alg: 'HS256' })
        .setIssuer(issuer).setAudience('neon-drop').setSubject('user:1').setJti(randomUUID()).setIssuedAt().setExpirationTime('2m').sign(key);
      assert.match((await fetch(base + '/callback?token=' + wrongAudience, { redirect: 'manual' })).headers.get('location'), /\?ranked=launch-failed$/);
    });

    await t.test('every start case through POST /runs', async () => {
      const { cookie } = await launch();
      for (const c of await json('start-cases.json')) {
        const res = await post('/runs', cookie, c.body);
        assert.equal(res.status, c.expect.status, c.name);
        assertHeaders(res);
        const body = await res.json();
        if (res.status === 201) {
          assert.deepEqual(Object.keys(body).sort(), ['runId', 'version'], c.name);
          assert.match(body.runId, UUID_V4); assert.equal(body.version, VERSION);
          const { rows: [run] } = await pool.query('SELECT game,version,run_config,submitted_at FROM artifact_leaderboards.runs WHERE id=$1', [body.runId]);
          const { version: _, ...config } = c.body;
          assert.deepEqual(run, { game: GAME, version: VERSION, run_config: config, submitted_at: null }, c.name);
        } else if (res.status === 409) assert.deepEqual(body, { message: MESSAGES.reload, version: VERSION }, c.name);
        else assert.ok(Object.keys(body).length === 1 && CONTRACT_MESSAGES.has(body.message), c.name);
      }
    });

    await t.test('every finish case through POST /runs/:id/finish', async () => {
      const { cookie } = await launch();
      for (const c of await json('finish-cases.json')) {
        const runId = await start(cookie, c.runConfig);
        const res = await finishAfter(runId, c.wallMs, cookie, c.body);
        assert.equal(res.status, c.expect.status, c.name);
        assertHeaders(res);
        const body = await res.json();
        const { rows: [run] } = await pool.query('SELECT details,score,duration_ms,wave,submitted_at FROM artifact_leaderboards.runs WHERE id=$1', [runId]);
        if (res.status === 200) {
          assert.deepEqual(Object.keys(body).sort(), ['lap', 'race', 'saved'], c.name);
          assert.equal(body.saved, true);
          const { version: _, ...details } = c.body;
          assert.deepEqual({ ...run, submitted_at: run.submitted_at instanceof Date },
            { details, score: details.laps, duration_ms: details.timeMs, wave: null, submitted_at: true }, c.name);
        } else {
          assert.equal(run.submitted_at, null, c.name);
          if (res.status === 409) assert.deepEqual(body, { message: MESSAGES.reload, version: VERSION }, c.name);
          else assert.ok(Object.keys(body).length === 1 && CONTRACT_MESSAGES.has(body.message), c.name);
        }
      }
    });

    await t.test('every leaderboard query case through GET /leaderboard', async () => {
      for (const c of await json('leaderboard-query-cases.json')) {
        const res = await get(boardQuery(c.query));
        assert.equal(res.status, c.expect.status, c.name);
        assertHeaders(res);
        const body = await res.json();
        if (res.status === 200) {
          assert.deepEqual(Object.keys(body).sort(), ['entries', 'mine', 'version'], c.name);
          assert.equal(body.version, c.query.version); assert.equal(body.mine, null);
          if (c.query.version !== VERSION) assert.deepEqual(body.entries, [], c.name);
        } else assert.deepEqual(body, { message: MESSAGES.badQuery }, c.name);
      }
    });

    await t.test('every board case through GET /leaderboard, and its finish through POST', async () => {
      const cases = await json('board-cases.json');
      for (const [index, c] of cases.entries()) {
        const players = new Map();
        for (const one of [...c.runs.map(run => [run.playerId, run.displayName]), ...(c.viewer ? [[c.viewer, `Viewer ${c.viewer}`]] : [])]) {
          if (players.has(one[0])) continue;
          const { rows: [player] } = await pool.query(`INSERT INTO artifact_leaderboards.players (issuer,subject,display_name) VALUES ($1,$2,$3)
            ON CONFLICT (issuer,subject) DO UPDATE SET display_name=excluded.display_name RETURNING id`, [issuer, `board:${index}:${one[0]}`, one[1]]);
          players.set(one[0], player.id);
        }
        const insert = runs => Promise.all(runs.map(run => pool.query(`INSERT INTO artifact_leaderboards.runs
          (id,player_id,session_hash,game,version,run_config,details,score,duration_ms,submitted_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
          [run.id, players.get(run.playerId), run.sessionHash ?? 'board-case', GAME, VERSION, run.runConfig, run.finish, run.finish.laps, run.finish.timeMs, run.submittedAt])));
        await resetRuns();
        await insert(c.runs);
        const cookie = c.viewer ? await sessionFor(players.get(c.viewer)) : undefined;
        const res = await get(boardQuery({ ...c.query, version: VERSION }), cookie);
        assert.equal(res.status, 200, c.name);
        assert.deepEqual(await res.json(), { version: VERSION, entries: c.expect.entries, mine: c.expect.mine }, c.name);
        if (!c.finished) continue;
        const finished = c.runs.find(run => run.id === c.finished);
        assert.equal(finished.playerId, c.viewer, c.name);
        await resetRuns();
        await insert(c.runs.filter(run => run !== finished));
        const viewer = await sessionFor(players.get(c.viewer));
        const runId = await start(viewer, finished.runConfig);
        await startedAgo(runId, finished.finish.timeMs + 60000);
        const done = await post(`/runs/${runId}/finish`, viewer, { version: VERSION, ...finished.finish });
        assert.equal(done.status, 200, c.name);
        assert.deepEqual(await done.json(), { saved: true, ...c.expect.ranks }, c.name);
      }
      await resetRuns();
    });

    await t.test('repeats, expiry, ownership, versions, limits, logout and readiness', async () => {
      const ana = await launch({ handle: 'Ana Racer' });
      const runId = await start(ana.cookie, dryFinal);
      const first = await finishAfter(runId, 330000, ana.cookie, goodFinish);
      assert.equal(first.status, 200);
      const saved = await first.json();
      sameShape(saved, await answer('finish-200'));
      assert.deepEqual(saved, { saved: true, lap: { rank: 1, best: true }, race: { rank: 1, best: true } });
      const repeat = await post(`/runs/${runId}/finish`, ana.cookie, goodFinish);
      assert.equal(repeat.status, 200); assert.deepEqual(await repeat.json(), saved);
      assert.deepEqual(await assertError(await post(`/runs/${runId}/finish`, ana.cookie, { ...goodFinish, timeMs: goodFinish.timeMs + 1 }), 409, 'This run was already submitted.'), await answer('finish-409'));
      await assertError(await post(`/runs/${runId}/finish`, ana.cookie, { ...goodFinish, extra: 1 }), 409, 'This run was already submitted.');
      await assertError(await post(`/runs/${runId}/finish`, ana.cookie, { ...goodFinish, version: '2' }), 409, MESSAGES.reload);

      // The repeat's ranks are worked out again, as of now: a better run by another player moves this one down.
      const bruno = await launch({ handle: 'Bruno' });
      const faster = await start(bruno.cookie, dryFinal);
      assert.equal((await finishAfter(faster, 330000, bruno.cookie, { ...goodFinish, bestLapMs: 23987, timeMs: 300000 })).status, 200);
      assert.deepEqual(await (await post(`/runs/${runId}/finish`, ana.cookie, goodFinish)).json(), { saved: true, lap: { rank: 2, best: true }, race: { rank: 2, best: true } });

      const lap = await get(boardQuery({ kind: 'lap', track: 'cuenca-rc', direction: 'counter-clockwise', class: 'tc-stock-175', weather: 'all', version: VERSION }), ana.cookie);
      const lapBoard = await lap.json();
      assert.equal(lapBoard.mine, 1); sameShape(lapBoard, await answer('leaderboard-lap-200'));
      const race = await get(boardQuery({ kind: 'race', track: 'cuenca-rc', direction: 'counter-clockwise', class: 'tc-stock-175', weather: 'dry', minutes: 5, version: VERSION }), ana.cookie);
      const raceBoard = await race.json();
      assert.equal(raceBoard.mine, 1); sameShape(raceBoard, await answer('leaderboard-race-200'));
      assert.equal((await (await get(boardQuery({ kind: 'lap', track: 'cuenca-rc', direction: 'counter-clockwise', class: 'tc-stock-175', weather: 'all', version: VERSION }), 'rc_racers_ranked=' + 'b'.repeat(64))).json()).mine, null);

      const expired = await start(ana.cookie, dryFinal);
      assert.deepEqual(await assertError(await finishAfter(expired, 7201000, ana.cookie, goodFinish), 410, 'This ranked run expired. Your result is kept in this browser.'), await answer('finish-410'));
      const atLimit = await start(ana.cookie, dryFinal);
      assert.equal((await finishAfter(atLimit, 7200000, ana.cookie, goodFinish)).status, 200);

      const owned = await start(ana.cookie, dryFinal);
      await startedAgo(owned, 330000);
      await assertError(await post(`/runs/${owned}/finish`, bruno.cookie, goodFinish), 404, 'Ranked run not found.');
      const anaAgain = await launch({ handle: 'Ana Racer' }, ana.sub);
      await assertError(await post(`/runs/${owned}/finish`, anaAgain.cookie, goodFinish), 404, 'Ranked run not found.');
      for (const id of ['not-a-run', owned.toUpperCase(), '6ba7b810-9dad-11d1-80b4-00c04fd430c8', randomUUID()]) {
        await assertError(await post(`/runs/${id}/finish`, ana.cookie, goodFinish), 404, 'Ranked run not found.');
      }
      await assertError(await post(`/runs/${owned}/finish`, undefined, goodFinish), 401, 'Launch Mini RC Racers from Portal to join the leaderboard.');
      await pool.query(`UPDATE artifact_leaderboards.runs SET version='0' WHERE id=$1`, [owned]);
      await assertError(await post(`/runs/${owned}/finish`, ana.cookie, goodFinish), 409, MESSAGES.reload);

      assert.deepEqual(await assertError(await post('/runs', ana.cookie, { ...dryFinal, version: '2' }), 409, MESSAGES.reload), await answer('runs-409'));

      const carla = await launch({ handle: 'Carla' });
      for (let i = 0; i < 60; i++) {
        const res = await post('/runs', carla.cookie, { version: VERSION, ...dryFinal });
        assert.equal(res.status, 201, `start ${i + 1}`);
        if (i === 0) sameShape(await res.json(), await answer('runs-201'));
      }
      assert.deepEqual(await assertError(await post('/runs', carla.cookie, { version: VERSION, ...dryFinal }), 429, 'Ranked run limit reached. Local play still works.'), await answer('runs-429'));

      const out = await post('/logout', carla.cookie, {});
      assert.equal(out.status, 200); assert.deepEqual(await out.json(), { ok: true });
      assert.match(out.headers.get('set-cookie'), /^rc_racers_ranked=;.*Path=\/leaderboard-api\/rc-racers/);
      await assertError(await get('/session', carla.cookie), 401, 'Your Portal session expired. Launch Mini RC Racers from Portal again.');
      await assertError(await post('/logout', carla.cookie, {}), 401, 'Your Portal session expired. Launch Mini RC Racers from Portal again.');

      const ready = await get('/ready');
      assert.equal(ready.status, 200); assertHeaders(ready);
      assert.deepEqual(await ready.json(), { ready: true, missing: [] });
    });
  } finally { await close(server); await resetRuns(); await pool.end(); }
});
