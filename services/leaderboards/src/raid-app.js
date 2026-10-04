import express from 'express';
import { RAID_VERSION, validateRaidFinish, validateLegacyRaidFinish } from './raid-score.js';
import { LEVELS, emptyProfile, normalizeProfile, purchase, validateRunConfig, applyProgress } from './raid-rules.js';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { jwtVerify } from 'jose';

export const GAME = 'raid-survivor';
export const VERSION = RAID_VERSION;
const BASE = `/leaderboard-api/${GAME}`;
const COOKIE = 'raid_survivor_ranked';
const SESSION_SECONDS = 12 * 60 * 60;
const RUN_SECONDS = 2 * 60 * 60;
const hash = value => createHash('sha256').update(value).digest('hex');
const fail = (status, message) => Object.assign(new Error(message), { status });

// Conservative plausibility bounds, not replay verification or proof of human play.
export function validateScore(body, wallMs) { return validateRaidFinish(body, wallMs, RUN_SECONDS * 1000); }

export function createRaidApp({ pool, origin, issuer, launchSecret, secure = true }) {
  if (!origin || !issuer || !launchSecret || launchSecret.length < 32) throw new Error('Leaderboard auth configuration is incomplete.');
  const app = express();
  app.disable('x-powered-by');
  app.use((_req, res, next) => {
    res.set({ 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer', 'X-Content-Type-Options': 'nosniff' });
    next();
  });
  app.get('/health', async (_req, res) => {
    try { await pool.query('SELECT 1 FROM artifact_leaderboards.players LIMIT 1'); res.json({ ok: true }); }
    catch { res.status(503).json({ ok: false }); }
  });
  app.use(BASE, (req, _res, next) => {
    if (req.method === 'POST' && (req.get('origin') !== origin || !req.is('application/json'))) {
      return next(fail(403, 'Open the game directly to use ranked play.'));
    }
    next();
  });
  app.use(express.json({ limit: '4kb' }));
  const cookieOptions = { httpOnly: true, secure, sameSite: 'lax', path: BASE, maxAge: SESSION_SECONDS * 1000 };
  async function session(req, res, next) {
    const token = req.headers.cookie?.split(';').map(x => x.trim()).find(x => x.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
    if (!token || !/^[a-f0-9]{64}$/.test(token)) return next(fail(401, 'Launch from Portal to submit scores.'));
    const { rows } = await pool.query(`SELECT s.*, p.display_name FROM artifact_leaderboards.sessions s
      JOIN artifact_leaderboards.players p ON p.id=s.player_id
      WHERE token_hash=$1 AND game=$2 AND expires_at>now()`, [hash(token), GAME]);
    if (!rows[0]) return next(fail(401, 'Your ranked session expired. Launch from Portal again.'));
    req.playerSession = rows[0]; next();
  }
  async function lockedProfile(client, playerId) {
    await client.query('SELECT id FROM artifact_leaderboards.players WHERE id=$1 FOR UPDATE', [playerId]);
    await client.query('INSERT INTO artifact_leaderboards.raid_profiles(player_id,profile) VALUES($1,$2) ON CONFLICT DO NOTHING', [playerId,emptyProfile()]);
    const {rows:[row]}=await client.query('SELECT profile FROM artifact_leaderboards.raid_profiles WHERE player_id=$1 FOR UPDATE', [playerId]);
    return normalizeProfile(row.profile);
  }
  async function saveProfile(client, playerId, profile) {
    await client.query('UPDATE artifact_leaderboards.raid_profiles SET profile=$2,updated_at=now() WHERE player_id=$1', [playerId,profile]);
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
      await client.query('INSERT INTO artifact_leaderboards.launches VALUES ($1,$2,to_timestamp($3))', [issuer,p.jti,p.exp]);
      const { rows: [player] } = await client.query(`INSERT INTO artifact_leaderboards.players (issuer,subject,display_name)
        VALUES ($1,$2,$3) ON CONFLICT (issuer,subject) DO UPDATE SET display_name=excluded.display_name RETURNING id`, [issuer,p.sub,displayName]);
      await client.query(`INSERT INTO artifact_leaderboards.sessions VALUES ($1,$2,$3,now()+interval '12 hours')`, [hash(sessionToken),player.id,GAME]);
      await client.query('COMMIT');
      res.cookie(COOKIE, sessionToken, cookieOptions);
      res.redirect(303, `${origin}/${GAME}/`);
    } catch {
      if (client) await client.query('ROLLBACK').catch(() => {});
      // Never log the request URL or JWT. Failure still leads to playable guest mode.
      res.redirect(303, `${origin}/${GAME}/?ranked=launch-failed`);
    } finally { client?.release(); }
  });
  app.get(`${BASE}/session`, session, (req,res) => res.json({ displayName: req.playerSession.display_name, accountId: String(req.playerSession.player_id), version: VERSION }));
  app.get(`${BASE}/profile`, session, async (req,res) => {
    const {rows:[row]}=await pool.query('SELECT profile FROM artifact_leaderboards.raid_profiles WHERE player_id=$1', [req.playerSession.player_id]);
    res.json({profile:normalizeProfile(row?.profile)});
  });
  app.post(`${BASE}/profile/mastery`, session, async (req,res) => {
    const client=await pool.connect();
    try { await client.query('BEGIN');const profile=await lockedProfile(client,req.playerSession.player_id);
      const next=purchase(profile,req.body?.character,req.body?.skill,req.body?.expectedRevision,req.body?.rank);
      await saveProfile(client,req.playerSession.player_id,next);await client.query('COMMIT');res.json({profile:next});
    }catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();}
  });
  app.post(`${BASE}/logout`, session, async (req,res) => {
    await pool.query('DELETE FROM artifact_leaderboards.sessions WHERE token_hash=$1', [req.playerSession.token_hash]);
    res.clearCookie(COOKIE, { httpOnly:true, secure, sameSite:'lax', path:BASE }); res.json({ ok:true });
  });
  app.get(`${BASE}/leaderboard`, async (req,res) => {
    const level=req.query.level ?? 'all', legacy=level==='legacy';
    if (!legacy && level!=='all' && !LEVELS[level]) throw fail(400,'Unknown leaderboard.');
    const { rows } = await pool.query(`SELECT p.display_name AS "displayName", b.score,
      b.details->>'character' AS character, (b.details->>'kills')::int AS kills,
      b.duration_ms AS "durationMs", COALESCE(b.run_config->>'level', 'training') AS level
      FROM (SELECT DISTINCT ON (player_id) player_id,score,details,duration_ms,submitted_at,id
        ,run_config FROM artifact_leaderboards.runs WHERE game=$1 AND version=$2 AND submitted_at IS NOT NULL
        AND ($3='all' OR $3='legacy' OR run_config->>'level'=$3)
        ORDER BY player_id,score DESC,submitted_at,id) b
      JOIN artifact_leaderboards.players p ON p.id=b.player_id
      ORDER BY b.score DESC,b.submitted_at,b.id LIMIT 20`, [GAME, legacy?'1':VERSION,level]);
    res.json({ version: legacy?'1':VERSION, level, entries: rows });
  });
  app.post(`${BASE}/runs`, session, async (req,res) => {
    if (req.body?.version !== VERSION) throw fail(409,'Reload the game to start a ranked run.');
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const profile=await lockedProfile(client,req.playerSession.player_id);
      const config=validateRunConfig(req.body,profile);
      const { rows: [count] } = await client.query(`SELECT count(*)::int AS n FROM artifact_leaderboards.runs
        WHERE player_id=$1 AND game=$2 AND started_at>now()-interval '1 hour'`, [req.playerSession.player_id,GAME]);
      if (count.n >= 60) throw fail(429,'Ranked run limit reached. You can still play locally.');
      const id = randomUUID();
      await client.query(`INSERT INTO artifact_leaderboards.runs (id,player_id,session_hash,game,version,run_config)
        VALUES ($1,$2,$3,$4,$5,$6)`, [id,req.playerSession.player_id,req.playerSession.token_hash,GAME,VERSION,config]);
      await client.query('COMMIT'); res.status(201).json({ runId:id, version:VERSION, config, profile });
    } catch (e) { await client.query('ROLLBACK'); throw e; } finally { client.release(); }
  });
  app.post(`${BASE}/runs/:id/progress`, session, async (req,res) => {
    if (!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(req.params.id)) throw fail(400,'Invalid run ID.');
    const client=await pool.connect();
    try {await client.query('BEGIN');const profile=await lockedProfile(client,req.playerSession.player_id);
      const {rows:[run]}=await client.query(`SELECT *,extract(epoch from (now()-started_at))*1000 AS wall_ms FROM artifact_leaderboards.runs WHERE id=$1 AND player_id=$2 AND game=$3 AND version=$4 FOR UPDATE`,[req.params.id,req.playerSession.player_id,GAME,VERSION]);
      if(!run)throw fail(404,'Ranked run not found.');
      if(run.submitted_at)throw fail(409,'This run is finished.');
      if(Number(run.wall_ms)>RUN_SECONDS*1000)throw fail(410,'This ranked run expired.');
      const progress=req.body;
      if(progress?.durationMs>Number(run.wall_ms)+2000||progress?.durationMs>RUN_SECONDS*1000)throw fail(400,'Invalid checkpoint time.');
      const applied=applyProgress(profile,run.run_config,progress,run.progress||{});
      await client.query('UPDATE artifact_leaderboards.runs SET progress=$2 WHERE id=$1',[run.id,applied.progress]);
      await saveProfile(client,req.playerSession.player_id,applied.profile);
      await client.query('COMMIT');res.json({profile:applied.profile,progress:applied.progress});
    }catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();}
  });
  app.post(`${BASE}/runs/:id/finish`, session, async (req,res) => {
    if (!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(req.params.id)) throw fail(400,'Invalid run ID.');
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const profile=await lockedProfile(client,req.playerSession.player_id);
      const { rows: [run] } = await client.query(`SELECT *,extract(epoch from (now()-started_at))*1000 AS wall_ms
        FROM artifact_leaderboards.runs WHERE id=$1 AND player_id=$2 AND game=$3 FOR UPDATE`,
        [req.params.id,req.playerSession.player_id,GAME]);
      if (!run) throw fail(404,'Ranked run not found.');
      if(run.version!==VERSION&&run.version!=='1')throw fail(404,'Ranked run not found.');
      if (run.submitted_at) {
        const body=req.body ?? {}, stats=body.stats ?? {};
        const same=body.version===run.version && body.character===run.details?.character &&
          body.durationMs===run.duration_ms &&
          (run.version==='1'||body.level===run.details?.realm) && ['kills','elites','bosses','chests','level'].every(key=>stats[key]===run.details?.[key]);
        if (!same) throw fail(409,'This run was already submitted.');
      } else {
        if (Number(run.wall_ms) > RUN_SECONDS * 1000) throw fail(410,'This ranked run expired. Your local score is saved.');
        const { score,durationMs,details } = run.version==='1' ? validateLegacyRaidFinish(req.body??{},Number(run.wall_ms),RUN_SECONDS*1000) : validateScore(req.body ?? {},Number(run.wall_ms));
        if(run.version===VERSION){
          if(details.character!==run.run_config?.character || details.realm!==run.run_config?.level)throw fail(400,'Run configuration changed.');
          const progress=req.body?.progress;
          if(!progress||progress.durationMs!==durationMs||progress.kills!==details.kills)throw fail(400,'Final checkpoint is required.');
          const applied=applyProgress(profile,run.run_config,progress,run.progress||{});
          await saveProfile(client,req.playerSession.player_id,applied.profile);
          await client.query('UPDATE artifact_leaderboards.runs SET progress=$2 WHERE id=$1',[run.id,applied.progress]);
        }
        await client.query(`UPDATE artifact_leaderboards.runs SET score=$2,wave=NULL,duration_ms=$3,details=$4,submitted_at=now() WHERE id=$1`, [run.id,score,durationMs,details]);
      }
      await client.query('COMMIT'); res.json({ saved:true });
    } catch(e) { await client.query('ROLLBACK'); throw e; } finally { client.release(); }
  });
  app.use((_req,res) => res.status(404).json({ message:'Not found.' }));
  app.use((err,_req,res,_next) => {
    const status = err.status >= 400 && err.status < 500 ? err.status : 503;
    if (status === 503) console.error('Leaderboard request failed', { code:err.code || 'internal' });
    res.status(status).json({ message:status === 503 ? 'Leaderboard temporarily unavailable. Local play still works.' : err.message });
  });
  return app;
}
