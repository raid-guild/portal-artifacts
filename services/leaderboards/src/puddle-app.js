import express from 'express';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { jwtVerify } from 'jose';
import { PUDDLE_LEVELS, PUDDLE_VERSION, scorePuddleRun } from './puddle-rules.js';
import {mountPuddleCommunity} from './puddle-community.js';

export const GAME = 'puddle-study';
export const VERSION = PUDDLE_VERSION;
const BASE = `/leaderboard-api/${GAME}`;
const COOKIE = 'puddle_ranked';
const hash = value => createHash('sha256').update(value).digest('hex');
const fail = (status, message) => Object.assign(new Error(message), { status });
const isId = value => /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(value);
const MAX_PUDDLE_STARTS_PER_HOUR = 240;

export function createPuddleApp({ pool, origin, issuer, launchSecret, secure = true }) {
  if (!origin || !issuer || !launchSecret || launchSecret.length < 32) throw new Error('Puddle auth configuration is incomplete.');
  const app = express();
  app.disable('x-powered-by');
  app.use((_req, res, next) => {
    res.set({ 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer', 'X-Content-Type-Options': 'nosniff' });
    next();
  });
  app.use(BASE, (req, _res, next) => {
    if (req.method === 'POST' && (req.get('origin') !== origin || !req.is('application/json'))) {
      return next(fail(403, 'Open Puddle directly to use ranked play.'));
    }
    next();
  });
  // Published documents are larger than ranked run bodies. Scope the larger
  // parser to community routes before the existing 4 KB ranked parser.
  app.use(`${BASE}/community`,express.json({limit:'256kb'}));
  app.use(express.json({ limit: '4kb' }));
  app.get(`${BASE}/ready`, async (_req, res) => {
    const required = {
      launches: { columns: ['issuer','jti','expires_at'], privileges: ['SELECT','INSERT','DELETE'] },
      players: { columns: ['id','issuer','subject','display_name'], privileges: ['SELECT','INSERT','UPDATE'] },
      sessions: { columns: ['token_hash','player_id','game','expires_at'], privileges: ['SELECT','INSERT','DELETE'] },
      runs: { columns: ['id','player_id','session_hash','game','version','run_config','details','started_at','submitted_at','score','duration_ms'], privileges: ['SELECT','INSERT','UPDATE'] },
      puddle_community_levels: { columns: ['id','owner_id','current_version','published','created_at','updated_at','unpublished_at'], privileges: ['SELECT','INSERT','UPDATE'] },
      puddle_community_versions: { columns: ['level_id','version','request_id','document','description','content_hash','title','gold_count','gem_count','target_seconds','validation_version','created_at'], privileges: ['SELECT','INSERT'] },
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
  async function session(req, _res, next) {
    try {
      const token = req.headers.cookie?.split(';').map(x => x.trim()).find(x => x.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
      if (!token || !/^[a-f0-9]{64}$/.test(token)) throw fail(401, 'Launch from Portal to submit scores.');
      const { rows: [row] } = await pool.query(`SELECT s.*, p.display_name FROM artifact_leaderboards.sessions s
        JOIN artifact_leaderboards.players p ON p.id=s.player_id
        WHERE token_hash=$1 AND game=$2 AND expires_at>now()`, [hash(token), GAME]);
      if (!row) throw fail(401, 'Your ranked session expired. Launch from Portal again.');
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
      res.redirect(303, `${origin}/${GAME}/`);
    } catch {
      if (client) await client.query('ROLLBACK').catch(() => {});
      // Launch tokens never enter logs, URLs after redirect, or client storage.
      res.redirect(303, `${origin}/${GAME}/?ranked=launch-failed`);
    } finally { client?.release(); }
  });
  app.get(`${BASE}/session`, session, (req, res) => res.json({ displayName: req.playerSession.display_name, version: VERSION }));
  app.post(`${BASE}/logout`, session, async (req, res) => {
    await pool.query('DELETE FROM artifact_leaderboards.sessions WHERE token_hash=$1', [req.playerSession.token_hash]);
    res.clearCookie(COOKIE, { httpOnly: true, secure, sameSite: 'lax', path: BASE }); res.json({ ok: true });
  });
  app.get(`${BASE}/leaderboard`, async (req, res) => {
    const level = Number(req.query.level);
    if (!Number.isInteger(level) || !PUDDLE_LEVELS[level]) throw fail(400, 'Unknown level.');
    const { rows } = await pool.query(`SELECT p.display_name AS "displayName", b.score,
      b.duration_ms AS "durationMs", (b.details->>'collectionPercent')::int AS "collectionPercent",
      (b.details->>'gold')::int AS gold, (b.details->>'gems')::int AS gems,
      (b.details->>'collectionPoints')::int AS "collectionPoints",
      (b.details->>'timePoints')::int AS "timePoints"
      FROM (SELECT DISTINCT ON (player_id) player_id,score,duration_ms,details,submitted_at,id
        FROM artifact_leaderboards.runs
        WHERE game=$1 AND version=$2 AND run_config->>'level'=$3
          AND run_config->>'contentId'=$4 AND submitted_at IS NOT NULL
        ORDER BY player_id,score DESC,duration_ms,submitted_at,id) b
      JOIN artifact_leaderboards.players p ON p.id=b.player_id
      ORDER BY b.score DESC,b.duration_ms,b.submitted_at,b.id LIMIT 20`,
      [GAME,VERSION,String(level),PUDDLE_LEVELS[level].contentId]);
    res.json({ version: VERSION, level, name: PUDDLE_LEVELS[level].name, entries: rows });
  });
  app.post(`${BASE}/runs`, session, async (req, res) => {
    const level = req.body?.level;
    if (req.body?.version !== VERSION || !Number.isInteger(level) || !PUDDLE_LEVELS[level] ||
        req.body?.contentId !== PUDDLE_LEVELS[level].contentId) throw fail(409, 'Reload Puddle to start a ranked run.');
    const config = { level, ...PUDDLE_LEVELS[level] };
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('SELECT id FROM artifact_leaderboards.players WHERE id=$1 FOR UPDATE', [req.playerSession.player_id]);
      const { rows: [count] } = await client.query(`SELECT count(*)::int AS n FROM artifact_leaderboards.runs
        WHERE player_id=$1 AND game=$2 AND started_at>now()-interval '1 hour'`, [req.playerSession.player_id,GAME]);
      if (count.n >= MAX_PUDDLE_STARTS_PER_HOUR) throw fail(429, 'Ranked run limit reached. Local play still works.');
      const id = randomUUID();
      await client.query(`INSERT INTO artifact_leaderboards.runs (id,player_id,session_hash,game,version,run_config)
        VALUES ($1,$2,$3,$4,$5,$6)`, [id,req.playerSession.player_id,req.playerSession.token_hash,GAME,VERSION,config]);
      await client.query('COMMIT'); res.status(201).json({ runId: id, version: VERSION });
    } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
  });
  app.post(`${BASE}/runs/:id/finish`, session, async (req, res) => {
    if (!isId(req.params.id)) throw fail(400, 'Invalid run ID.');
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const { rows: [run] } = await client.query(`SELECT *,extract(epoch from (now()-started_at))*1000 AS wall_ms
        FROM artifact_leaderboards.runs WHERE id=$1 AND player_id=$2 AND game=$3 FOR UPDATE`,
        [req.params.id,req.playerSession.player_id,GAME]);
      if (!run || run.version !== VERSION) throw fail(404, 'Ranked run not found.');
      if (!run.submitted_at && run.run_config?.contentId !== PUDDLE_LEVELS[run.run_config?.level]?.contentId)
        throw fail(409, 'This level changed. Reload Puddle to start a fresh ranked run. Your local result remains saved.');
      let finalScore = run.score;
      let finalDetails = run.details;
      if (run.submitted_at) {
        const details = run.details;
        if (req.body?.version !== VERSION || req.body?.level !== details.level ||
            req.body?.gold !== details.gold || req.body?.gems !== details.gems ||
            req.body?.durationMs !== run.duration_ms || (req.body?.excludedMs ?? 0) !== details.excludedMs)
          throw fail(409, 'This run was already submitted.');
      } else {
        if (Number(run.wall_ms) > 2 * 60 * 60 * 1000) throw fail(410, 'This ranked run expired. Your local result remains saved.');
        const { score, durationMs, details } = scorePuddleRun(run.run_config, req.body, Number(run.wall_ms));
        finalScore = score; finalDetails = details;
        await client.query(`UPDATE artifact_leaderboards.runs SET score=$2,wave=NULL,duration_ms=$3,details=$4,submitted_at=now() WHERE id=$1`,
          [run.id,score,durationMs,details]);
      }
      await client.query('COMMIT'); res.json({ saved: true, score: finalScore, details: finalDetails });
    } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
  });
  mountPuddleCommunity(app,{pool,session,base:BASE});
  app.use((_req, res) => res.status(404).json({ message: 'Not found.' }));
  app.use((err, _req, res, _next) => {
    const status = err.status >= 400 && err.status < 500 ? err.status : 503;
    if (status === 503) console.error('Puddle leaderboard request failed', { code: err.code || 'internal' });
    res.status(status).json({ message: status === 503 ? 'Leaderboard temporarily unavailable. Local play still works.' : err.message });
  });
  return app;
}
