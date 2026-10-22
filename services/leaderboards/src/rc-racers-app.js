import express from 'express';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { jwtVerify } from 'jose';
import { VERSION as RC_RACERS_VERSION, MESSAGES, MAX_STARTS_PER_HOUR, RUN_LIFETIME_MS,
  validateStart, validateFinish, validateBoardQuery, boardAnswer, finishRanks } from './rc-racers-rules.js';

export const GAME = 'rc-racers';
export const VERSION = RC_RACERS_VERSION;
const BASE = `/leaderboard-api/${GAME}`;
const COOKIE = 'rc_racers_ranked';
const UNAVAILABLE = 'Leaderboard temporarily unavailable. Local play still works.';
const floors = JSON.parse(readFileSync(new URL('./rc-racers-floors.json', import.meta.url), 'utf8'));
const hash = value => createHash('sha256').update(value).digest('hex');
const fail = (status, message) => Object.assign(new Error(message), { status });
const refusal = ({ status, message }) => fail(status, message);
const isId = value => /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(value);
const isObject = value => typeof value === 'object' && value !== null && !Array.isArray(value);
const FINISH_KEYS = ['version', 'bestLapMs', 'laps', 'timeMs'];
const sameFinish = (body, details) => isObject(body) && Object.keys(body).length === FINISH_KEYS.length &&
  FINISH_KEYS.every(key => Object.hasOwn(body, key)) && body.version === VERSION &&
  body.bestLapMs === details.bestLapMs && body.laps === details.laps && body.timeMs === details.timeMs;

// The submitted runs of one board (track, direction, class) of a version, in the rules' run shape; the rules then pick
// the kind, the weather, one best per player and the order, so the answers are the fixtures' own.
async function boardRuns(db, version, { track, direction, class: carClass }) {
  const { rows } = await db.query(`SELECT r.id,r.player_id,p.display_name,r.submitted_at,r.run_config,r.details
    FROM artifact_leaderboards.runs r JOIN artifact_leaderboards.players p ON p.id=r.player_id
    WHERE r.game=$1 AND r.version=$2 AND r.submitted_at IS NOT NULL AND r.run_config->>'track'=$3
      AND r.run_config->>'direction'=$4 AND r.run_config->>'class'=$5`, [GAME, version, track, direction, carClass]);
  return rows.map(row => ({ id: row.id, playerId: String(row.player_id), displayName: row.display_name,
    submittedAt: row.submitted_at.toISOString(), runConfig: row.run_config,
    finish: { bestLapMs: row.details.bestLapMs, laps: row.details.laps, timeMs: row.details.timeMs } }));
}

export function createRcRacersApp({ pool, origin, issuer, launchSecret, secure = true }) {
  if (!origin || !issuer || !launchSecret || launchSecret.length < 32) throw new Error('Mini RC Racers auth configuration is incomplete.');
  if (floors.scoringVersion !== VERSION) throw new Error('Mini RC Racers floor table does not match the rules version.');
  const app = express();
  app.disable('x-powered-by');
  app.use((_req, res, next) => {
    res.set({ 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer', 'X-Content-Type-Options': 'nosniff' });
    next();
  });
  app.use(BASE, (req, _res, next) => {
    if (req.method === 'POST' && (req.get('origin') !== origin || !req.is('application/json'))) {
      return next(fail(403, 'Open Mini RC Racers directly to use the leaderboard.'));
    }
    next();
  });
  app.use(express.json({ limit: '4kb' }));
  app.get(`${BASE}/ready`, async (_req, res) => {
    const required = {
      launches: { columns: ['issuer','jti','expires_at'], privileges: ['SELECT','INSERT','DELETE'] },
      players: { columns: ['id','issuer','subject','display_name'], privileges: ['SELECT','INSERT','UPDATE'] },
      sessions: { columns: ['token_hash','player_id','game','expires_at'], privileges: ['SELECT','INSERT','DELETE'] },
      runs: { columns: ['id','player_id','session_hash','game','version','run_config','details','started_at','submitted_at','score','duration_ms'], privileges: ['SELECT','INSERT','UPDATE'] },
    };
    try {
      const missing=[];
      const {rows:[schema]}=await pool.query("SELECT has_schema_privilege(current_user,to_regnamespace('artifact_leaderboards'),'USAGE') AS can_use");
      if(!schema.can_use)missing.push('artifact_leaderboards:usage');
      for(const [table,{columns,privileges}] of Object.entries(required)){
        const relation=`artifact_leaderboards.${table}`;
        const {rows:[state]}=await pool.query('SELECT to_regclass($1) AS relation',[relation]);
        if(!state.relation){missing.push(relation);continue;}
        for(const privilege of privileges){
          const {rows:[grant]}=await pool.query('SELECT has_table_privilege(current_user,to_regclass($1),$2) AS allowed',[relation,privilege]);
          if(!grant.allowed)missing.push(`${relation}:${privilege.toLowerCase()}`);
        }
        const {rows}=await pool.query(`SELECT column_name FROM information_schema.columns
          WHERE table_schema='artifact_leaderboards' AND table_name=$1`,[table]);
        const available=new Set(rows.map(row=>row.column_name));
        for(const column of columns)if(!available.has(column))missing.push(`${relation}.${column}`);
      }
      if(!missing.includes('artifact_leaderboards.players')){
        const {rows:[sequence]}=await pool.query(`SELECT pg_get_serial_sequence('artifact_leaderboards.players','id') AS name`);
        if(!sequence.name)missing.push('artifact_leaderboards.players:id-sequence');
        else {
          const {rows:[grant]}=await pool.query('SELECT has_sequence_privilege(current_user,$1,\'USAGE\') AS allowed',[sequence.name]);
          if(!grant.allowed)missing.push(`${sequence.name}:usage`);
        }
      }
      res.status(missing.length?503:200).json({ready:missing.length===0,missing});
    } catch { res.status(503).json({ready:false,missing:['database unavailable']}); }
  });
  const cookieOptions = { httpOnly: true, secure, sameSite: 'lax', path: BASE, maxAge: 12 * 60 * 60 * 1000 };
  const cookieToken = req => req.headers.cookie?.split(';').map(x => x.trim()).find(x => x.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
  const findSession = async token => (await pool.query(`SELECT s.*, p.display_name FROM artifact_leaderboards.sessions s
    JOIN artifact_leaderboards.players p ON p.id=s.player_id
    WHERE token_hash=$1 AND game=$2 AND expires_at>now()`, [hash(token), GAME])).rows[0];
  async function session(req, _res, next) {
    try {
      const token = cookieToken(req);
      if (!token || !/^[a-f0-9]{64}$/.test(token)) throw fail(401, 'Launch Mini RC Racers from Portal to join the leaderboard.');
      const row = await findSession(token);
      if (!row) throw fail(401, 'Your Portal session expired. Launch Mini RC Racers from Portal again.');
      req.playerSession = row;
      next();
    } catch (error) { next(error); }
  }
  app.get(`${BASE}/callback`, async (req, res) => {
    let client;
    try {
      const token = req.query.token;
      if (typeof token !== 'string' || token.length > 8192) throw fail(401, 'Invalid launch.');
      const { payload: p } = await jwtVerify(token, new TextEncoder().encode(launchSecret), {
        algorithms: ['HS256'], issuer, audience: GAME, maxTokenAge: '10m',
        requiredClaims: ['exp', 'iat', 'jti', 'sub'],
      });
      if (p.typ !== 'portal_module_launch' || p.moduleSlug !== GAME ||
          typeof p.sub !== 'string' || !/^user:[0-9]+$/.test(p.sub) ||
          typeof p.jti !== 'string' || p.jti.length > 200 || p.exp - p.iat > 600) throw fail(401, 'Invalid launch.');
      const displayName = (typeof p.handle === 'string' ? p.handle : typeof p.name === 'string' ? p.name : 'Portal player').trim().slice(0, 60) || 'Portal player';
      const sessionToken = randomBytes(32).toString('hex');
      client = await pool.connect(); await client.query('BEGIN');
      await client.query('DELETE FROM artifact_leaderboards.launches WHERE expires_at < now()');
      await client.query('DELETE FROM artifact_leaderboards.sessions WHERE expires_at < now()');
      await client.query('INSERT INTO artifact_leaderboards.launches VALUES ($1,$2,to_timestamp($3))', [issuer, p.jti, p.exp]);
      const { rows: [player] } = await client.query(`INSERT INTO artifact_leaderboards.players (issuer,subject,display_name)
        VALUES ($1,$2,$3) ON CONFLICT (issuer,subject) DO UPDATE SET display_name=excluded.display_name RETURNING id`, [issuer,p.sub,displayName]);
      await client.query('INSERT INTO artifact_leaderboards.sessions VALUES ($1,$2,$3,now()+interval \'12 hours\')', [hash(sessionToken),player.id,GAME]);
      await client.query('COMMIT');
      res.cookie(COOKIE, sessionToken, cookieOptions);
      // Since the game's 1.1, /rc-racers/ is its home page and the game itself is /rc-racers/play/.
      res.redirect(303, `${origin}/rc-racers/play/`);
    } catch {
      if (client) await client.query('ROLLBACK').catch(() => {});
      // Launch tokens never enter logs, URLs after redirect, or client storage.
      res.redirect(303, `${origin}/rc-racers/play/?ranked=launch-failed`);
    } finally { client?.release(); }
  });
  app.get(`${BASE}/session`, session, (req, res) => res.json({ displayName: req.playerSession.display_name, version: VERSION }));
  app.post(`${BASE}/logout`, session, async (req, res) => {
    await pool.query('DELETE FROM artifact_leaderboards.sessions WHERE token_hash=$1', [req.playerSession.token_hash]);
    res.clearCookie(COOKIE, { httpOnly: true, secure, sameSite: 'lax', path: BASE }); res.json({ ok: true });
  });
  app.get(`${BASE}/leaderboard`, async (req, res) => {
    const checked = validateBoardQuery(req.query, floors);
    if (!checked.ok) throw fail(400, MESSAGES.badQuery);
    const query = checked.value;
    // Public: a session only sets `mine`, and a missing or expired one is not an error here.
    const token = cookieToken(req);
    const viewer = token && /^[a-f0-9]{64}$/.test(token) ? await findSession(token) : undefined;
    const runs = await boardRuns(pool, query.version, query);
    res.json({ version: query.version, ...boardAnswer(runs, query, viewer ? String(viewer.player_id) : null) });
  });
  app.post(`${BASE}/runs`, session, async (req, res) => {
    const start = validateStart(req.body, floors);
    if (!start.ok) throw refusal(start);
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('SELECT id FROM artifact_leaderboards.players WHERE id=$1 FOR UPDATE', [req.playerSession.player_id]);
      const { rows: [count] } = await client.query(`SELECT count(*)::int AS n FROM artifact_leaderboards.runs
        WHERE player_id=$1 AND game=$2 AND started_at>now()-interval '1 hour'`, [req.playerSession.player_id,GAME]);
      if (count.n >= MAX_STARTS_PER_HOUR) throw fail(429, 'Ranked run limit reached. Local play still works.');
      const id = randomUUID();
      await client.query(`INSERT INTO artifact_leaderboards.runs (id,player_id,session_hash,game,version,run_config)
        VALUES ($1,$2,$3,$4,$5,$6)`, [id,req.playerSession.player_id,req.playerSession.token_hash,GAME,VERSION,start.value]);
      await client.query('COMMIT'); res.status(201).json({ runId: id, version: VERSION });
    } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
  });
  app.post(`${BASE}/runs/:id/finish`, session, async (req, res) => {
    if (!isId(req.params.id)) throw fail(404, 'Ranked run not found.');
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const { rows: [run] } = await client.query(`SELECT *,extract(epoch from (now()-started_at))*1000 AS wall_ms
        FROM artifact_leaderboards.runs WHERE id=$1 AND player_id=$2 AND game=$3 FOR UPDATE`,
        [req.params.id,req.playerSession.player_id,GAME]);
      if (!run || run.session_hash !== req.playerSession.token_hash) throw fail(404, 'Ranked run not found.');
      // A body that is not an object is the rules' 400 (validateFinish), not a version mismatch.
      if (run.version !== VERSION || (isObject(req.body) && req.body.version !== VERSION)) throw fail(409, MESSAGES.reload);
      if (run.submitted_at) {
        if (!sameFinish(req.body, run.details)) throw fail(409, 'This run was already submitted.');
      } else {
        if (Number(run.wall_ms) > RUN_LIFETIME_MS) throw fail(410, 'This ranked run expired. Your result is kept in this browser.');
        const finish = validateFinish(req.body, run.run_config, Number(run.wall_ms), floors);
        if (!finish.ok) throw refusal(finish);
        const { bestLapMs, laps, timeMs } = finish.value;
        await client.query(`UPDATE artifact_leaderboards.runs SET score=$2,wave=NULL,duration_ms=$3,details=$4,submitted_at=now() WHERE id=$1`,
          [run.id,laps,timeMs,{ bestLapMs, laps, timeMs }]);
      }
      const runs = await boardRuns(client, VERSION, run.run_config);
      await client.query('COMMIT'); res.json({ saved: true, ...finishRanks(runs, run.id) });
    } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
  });
  app.use((_req, res) => res.status(404).json({ message: 'Not found.' }));
  app.use((err, _req, res, _next) => {
    // Body-parser errors carry a `type`; their own text never reaches a player.
    if (err.type === 'entity.too.large') return res.status(413).json({ message: 'This request is too large.' });
    if (typeof err.type === 'string' && err.status >= 400 && err.status < 500) return res.status(400).json({ message: MESSAGES.invalid });
    const status = err.status >= 400 && err.status < 500 ? err.status : 503;
    if (status === 503) console.error('Mini RC Racers leaderboard request failed', { code: err.code || 'internal' });
    const body = { message: status === 503 ? UNAVAILABLE : err.message };
    if (status === 409) body.version = VERSION;
    res.status(status).json(body);
  });
  return app;
}
