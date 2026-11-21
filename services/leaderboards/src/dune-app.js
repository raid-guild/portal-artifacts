import express from 'express';
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { jwtVerify } from 'jose';
import { GAME, levels, content, boosterPrices, emptyProfile, normalizeProfile, validUuid, validLevel, validBoosters, requireCurrentLevel, guestImport, deriveCampaign, rewardFor, applyCheckpoint, farmlandEligible, moveCapForVersion, accessTierForLevel, accessTierForCampaign, fail } from './dune-rules.js';
import { createDuneCommerce } from './dune-commerce.js';

const BASE = `/leaderboard-api/${GAME}`;
const COOKIE = 'dune_relay_session';
const INTENT_COOKIE = 'dune_relay_login_intent';
const SESSION_SECONDS = 12 * 60 * 60;
const hash = value => createHash('sha256').update(value).digest('hex');
const boundedName = value => typeof value === 'string' ? value.trim().slice(0, 60) : '';

export function createDuneApp({ pool, origin, issuer, launchSecret, secure = true, commerce = createDuneCommerce() }) {
  if (!origin || !issuer || !launchSecret || launchSecret.length < 32) throw new Error('Dune auth configuration is incomplete.');
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy',1);
  app.use((_req,res,next) => { res.set({ 'Cache-Control':'no-store', 'Referrer-Policy':'no-referrer', 'X-Content-Type-Options':'nosniff' }); next(); });
  app.use(BASE, (req,res,next) => req.method === 'POST' && (req.get('origin') !== origin || !req.is('application/json')) ? next(fail(403,'Open the game directly to save progress.')) : next());
  app.use(express.json({limit:'8kb'}));
  const cookieOptions = { httpOnly:true, secure, sameSite:'lax', path:BASE, maxAge:SESSION_SECONDS*1000 };
  const intentOptions = { httpOnly:true, secure, sameSite:'lax', path:`${BASE}/callback`, maxAge:5*60*1000 };
  const loginWindows = new Map();
  const entitlementRefresh = new Map();
  const LOGIN_WINDOW_MS = 5*60*1000, LOGIN_LIMIT = 60, LOGIN_CLIENT_LIMIT = 10000;
  const rejectLaunch = res => { res.clearCookie(INTENT_COOKIE,{httpOnly:true,secure,sameSite:'lax',path:intentOptions.path}); return res.redirect(303,`${origin}/dune-relay/?login=failed`); };
  const limited = fn => async (req,res,next) => { try { await fn(req,res); } catch (error) { next(error); } };
  const session = async (req,res,next) => {
    try {
    const token = req.headers.cookie?.split(';').map(x=>x.trim()).find(x=>x.startsWith(`${COOKIE}=`))?.slice(COOKIE.length+1);
    if (!token || !/^[a-f0-9]{64}$/.test(token)) throw fail(401,'Sign in through Portal to sync.');
    const { rows:[row] } = await pool.query(`SELECT s.*,p.display_name,p.issuer,p.subject FROM artifact_leaderboards.sessions s JOIN artifact_leaderboards.players p ON p.id=s.player_id WHERE token_hash=$1 AND game=$2 AND expires_at>now()`,[hash(token),GAME]);
    if (!row) throw fail(401,'Portal session expired. Sign in again.');
    if (req.path !== `${BASE}/session` && req.get('x-dune-account-id') !== String(row.player_id)) throw fail(409,'Portal account changed. Reload before saving.');
    req.playerSession=row;
    next();
    } catch (error) { next(error); }
  };
  const authenticated = session;
  async function lockedProfile(client,playerId) {
    await client.query('SELECT id FROM artifact_leaderboards.players WHERE id=$1 FOR UPDATE',[playerId]);
    await client.query('INSERT INTO artifact_leaderboards.dune_profiles(player_id,profile) VALUES($1,$2) ON CONFLICT DO NOTHING',[playerId,emptyProfile()]);
    const {rows:[row]}=await client.query('SELECT profile FROM artifact_leaderboards.dune_profiles WHERE player_id=$1 FOR UPDATE',[playerId]);
    return normalizeProfile(row.profile);
  }
  async function saveProfile(client,playerId,profile) {
    await client.query('UPDATE artifact_leaderboards.dune_profiles SET profile=$2,updated_at=now() WHERE player_id=$1',[playerId,profile]);
  }
  async function transaction(playerId,handler) {
    const client=await pool.connect();
    try { await client.query('BEGIN'); const profile=await lockedProfile(client,playerId); const result=await handler(client,profile); await client.query('COMMIT'); return result; }
    catch(error) { await client.query('ROLLBACK').catch(()=>{}); throw error; }
    finally { client.release(); }
  }
  async function receipt(client,playerId,requestId,kind,payload,perform) {
    if (!validUuid(requestId)) throw fail(400,'A valid request ID is required.');
    const payloadHash=hash(JSON.stringify(payload));
    const {rows:[existing]}=await client.query('SELECT kind,payload_hash,response FROM artifact_leaderboards.dune_operations WHERE player_id=$1 AND request_id=$2',[playerId,requestId]);
    if (existing) {
      if (existing.kind!==kind || existing.payload_hash!==payloadHash) throw fail(409,'This request ID was used for a different action.');
      return existing.response;
    }
    const response=await perform();
    await client.query('INSERT INTO artifact_leaderboards.dune_operations(player_id,request_id,kind,payload_hash,response) VALUES($1,$2,$3,$4,$5)',[playerId,requestId,kind,payloadHash,response]);
    return response;
  }
  app.get(`${BASE}/ready`,limited(async (_req,res) => {
    const missing=[];
    const tables={ players:['id','issuer','subject'], sessions:['token_hash','player_id','game'], launches:['issuer','jti'], dune_profiles:['player_id','profile'], dune_attempts:['id','player_id','level_id','boosters','status'], dune_completions:['player_id','level_id','attempt_id','reward'], dune_operations:['player_id','request_id','response'], dune_launch_intents:['nonce_hash','expires_at'], dune_entitlements:['player_id','entitlement_key','source','granted_at'] };
    const {rows:[schema]}=await pool.query("SELECT has_schema_privilege(current_user,to_regnamespace('artifact_leaderboards'),'USAGE') AS can_use");
    if (!schema?.can_use) missing.push('schema:usage');
    for (const [name,columns] of Object.entries(tables)) {
      const relation=`artifact_leaderboards.${name}`;
      const {rows:[state]}=await pool.query(`SELECT to_regclass($1) AS relation,has_table_privilege(current_user,to_regclass($1),'SELECT') AS can_select,has_table_privilege(current_user,to_regclass($1),'INSERT') AS can_insert,has_table_privilege(current_user,to_regclass($1),'UPDATE') AS can_update`,[relation]);
      if (!state?.relation) { missing.push(relation); continue; }
      for (const op of name === 'dune_launch_intents' || name === 'dune_entitlements' ? ['select','insert'] : ['select','insert','update']) if (!state[`can_${op}`]) missing.push(`${relation}:${op}`);
      if (name === 'sessions' || name === 'launches' || name === 'dune_launch_intents') {
        const {rows:[deletion]}=await pool.query("SELECT has_table_privilege(current_user,to_regclass($1),'DELETE') AS allowed",[relation]);
        if (!deletion?.allowed) missing.push(`${relation}:delete`);
      }
      const {rows}=await pool.query("SELECT column_name FROM information_schema.columns WHERE table_schema='artifact_leaderboards' AND table_name=$1",[name]);
      const names=new Set(rows.map(row=>row.column_name));
      for (const column of columns) if (!names.has(column)) missing.push(`${relation}.${column}`);
    }
    if (!missing.includes('artifact_leaderboards.players')) {
      const {rows:[sequence]}=await pool.query("SELECT pg_get_serial_sequence('artifact_leaderboards.players','id') AS name");
      if (!sequence?.name) missing.push('artifact_leaderboards.players:id-sequence');
      else {
        const {rows:[grant]}=await pool.query("SELECT has_sequence_privilege(current_user,$1,'USAGE') AS allowed",[sequence.name]);
        if (!grant?.allowed) missing.push(`${sequence.name}:usage`);
      }
    }
    res.status(missing.length?503:200).json({ready:missing.length===0,missing});
  }));
  app.get(`${BASE}/login`,limited(async (req,res)=>{
    const now=Date.now(), address=req.ip ?? 'unknown';
    if (loginWindows.size>=LOGIN_CLIENT_LIMIT) for (const [key,window] of loginWindows) if (window.until<=now) loginWindows.delete(key);
    const window=loginWindows.get(address);
    if (window?.until>now && window.count>=LOGIN_LIMIT) throw fail(429,'Too many login attempts. Try again shortly.');
    if (!window && loginWindows.size>=LOGIN_CLIENT_LIMIT) throw fail(429,'Login is busy. Try again shortly.');
    loginWindows.set(address,window?.until>now ? {until:window.until,count:window.count+1} : {until:now+LOGIN_WINDOW_MS,count:1});
    const state=randomBytes(32).toString('hex');
    await pool.query('DELETE FROM artifact_leaderboards.dune_launch_intents WHERE expires_at<now()');
    const {rows:[pending]}=await pool.query('SELECT count(*)::int AS count FROM artifact_leaderboards.dune_launch_intents');
    if (pending.count>=100000) throw fail(429,'Login is busy. Try again shortly.');
    await pool.query('INSERT INTO artifact_leaderboards.dune_launch_intents(nonce_hash,expires_at) VALUES($1,now()+interval \'5 minutes\')',[hash(state)]);
    const next=`/api/modules/${GAME}/launch?state=${state}`;
    const portal=new URL('/login',issuer); portal.searchParams.set('next',next);
    res.cookie(INTENT_COOKIE,state,intentOptions);
    res.redirect(302,portal.href);
  }));
  app.get(`${BASE}/callback`,limited(async (req,res) => {
    const token=req.query.token;
    if (typeof token!=='string' || token.length>8192) return rejectLaunch(res);
    let client;
    try {
      const {payload:p}=await jwtVerify(token,new TextEncoder().encode(launchSecret),{algorithms:['HS256'],issuer,audience:GAME,maxTokenAge:'10m',requiredClaims:['exp','iat','jti','sub']});
      if (p.typ!=='portal_module_launch' || p.moduleSlug!==GAME || typeof p.sub!=='string' || !/^user:[0-9]+$/.test(p.sub) || typeof p.jti!=='string' || p.jti.length>200 || p.exp-p.iat>600) throw fail(401,'Invalid launch.');
      const state=p.launchState;
      if (state === undefined) return res.redirect(303,`${BASE}/login`);
      const cookie=req.headers.cookie?.split(';').map(x=>x.trim()).find(x=>x.startsWith(`${INTENT_COOKIE}=`))?.slice(INTENT_COOKIE.length+1);
      if (typeof state!=='string' || !/^[a-f0-9]{64}$/i.test(state) || typeof cookie!=='string' || !/^[a-f0-9]{64}$/i.test(cookie) || !timingSafeEqual(Buffer.from(state,'hex'),Buffer.from(cookie,'hex'))) throw fail(401,'Invalid launch intent.');
      const displayName=boundedName(p.handle)||boundedName(p.name)||'Portal player';
      const sessionToken=randomBytes(32).toString('hex');
      client=await pool.connect(); await client.query('BEGIN');
      await client.query('DELETE FROM artifact_leaderboards.launches WHERE expires_at < now()');
      await client.query('DELETE FROM artifact_leaderboards.sessions WHERE expires_at < now()');
      await client.query('DELETE FROM artifact_leaderboards.dune_launch_intents WHERE expires_at < now()');
      await client.query('INSERT INTO artifact_leaderboards.launches VALUES($1,$2,to_timestamp($3))',[issuer,p.jti,p.exp]);
      const {rowCount:consumed}=await client.query('DELETE FROM artifact_leaderboards.dune_launch_intents WHERE nonce_hash=$1 AND expires_at>now()',[hash(state.toLowerCase())]);
      if (consumed!==1) throw fail(401,'Launch intent expired or already used.');
      const {rows:[player]}=await client.query(`INSERT INTO artifact_leaderboards.players(issuer,subject,display_name) VALUES($1,$2,$3) ON CONFLICT(issuer,subject) DO UPDATE SET display_name=excluded.display_name RETURNING id`,[issuer,p.sub,displayName]);
      await client.query("INSERT INTO artifact_leaderboards.sessions VALUES($1,$2,$3,now()+interval '12 hours')",[hash(sessionToken),player.id,GAME]);
      await client.query('COMMIT');
      res.clearCookie(INTENT_COOKIE,{httpOnly:true,secure,sameSite:'lax',path:intentOptions.path});
      res.cookie(COOKIE,sessionToken,cookieOptions);
      res.redirect(303,`${origin}/dune-relay/`);
    } catch { if (client) await client.query('ROLLBACK').catch(()=>{}); rejectLaunch(res); }
    finally { client?.release(); }
  }));
  app.get(`${BASE}/session`,authenticated,limited(async(req,res)=>res.json({accountId:String(req.playerSession.player_id),displayName:req.playerSession.display_name,contentVersion:content.contentVersion})));
  app.get(`${BASE}/campaign`,authenticated,limited(async(req,res)=>{
    const {rows:[row]}=await pool.query('SELECT profile FROM artifact_leaderboards.dune_profiles WHERE player_id=$1',[req.playerSession.player_id]);
    res.json({accountId:String(req.playerSession.player_id),hasCampaign:Boolean(row),profile:row?normalizeProfile(row.profile):null});
  }));
  const farmlandStatus = (accountId,profile,grant) => ({ accountId:String(accountId),farmland:{ unlocked:Boolean(grant),eligible:farmlandEligible(profile.campaign),unlockedAt:grant?.granted_at?.toISOString?.()??null } });
  const requireChapterAccess = async (client,session,campaign,level,{ finishActive = false } = {}) => {
    const playerId=session.player_id;
    const tier = level ? accessTierForLevel(level) : accessTierForCampaign(campaign);
    if (tier === 'demo') return;
    const {rows:[grant]}=await client.query("SELECT 1 FROM artifact_leaderboards.dune_entitlements WHERE player_id=$1 AND entitlement_key='farmland'",[playerId]);
    if (!grant) throw fail(403,'Unlock Farmland with your Portal account before entering this chapter.');
    if (tier === 'campaign-pass' && !finishActive) {
      const pass=await commerce.check({issuer:session.issuer,subject:session.subject});
      if (!pass.unlocked) throw fail(pass.state === 'unavailable' ? 503 : 403,pass.state === 'unavailable' ? 'Dune Pass access could not be checked. Retry when the store is available.' : 'Claim the Dune Pass through RaidGuild Commerce to enter this chapter.');
    }
  };
  app.get(`${BASE}/entitlements`,authenticated,limited(async(req,res)=>{
    const playerId=req.playerSession.player_id;
    const refresh=req.query.refresh === '1';
    if (refresh) {
      const now=Date.now(), previous=entitlementRefresh.get(playerId) ?? 0;
      if (now-previous<5_000) throw fail(429,'Wait a few seconds before checking access again.');
      if (entitlementRefresh.size>=10000) for (const [key,time] of entitlementRefresh) if (now-time>60_000) entitlementRefresh.delete(key);
      if (entitlementRefresh.size>=10000 && !entitlementRefresh.has(playerId)) throw fail(429,'Access checks are busy. Try again shortly.');
      entitlementRefresh.set(playerId,now);
    }
    const [{rows:[profileRow]},{rows:[grant]}]=await Promise.all([
      pool.query('SELECT profile FROM artifact_leaderboards.dune_profiles WHERE player_id=$1',[playerId]),
      pool.query("SELECT granted_at FROM artifact_leaderboards.dune_entitlements WHERE player_id=$1 AND entitlement_key='farmland'",[playerId]),
    ]);
    const campaignPass=await commerce.check({issuer:req.playerSession.issuer,subject:req.playerSession.subject},{refresh});
    res.json({...farmlandStatus(playerId,profileRow?normalizeProfile(profileRow.profile):emptyProfile(),grant),campaignPass});
  }));
  app.post(`${BASE}/entitlements/farmland/claim`,authenticated,limited(async(req,res)=>{
    const playerId=req.playerSession.player_id;
    const requestId=req.body?.requestId;
    const response=await transaction(playerId,async(client,profile)=>receipt(client,playerId,requestId,'farmland-claim',{entitlementKey:'farmland'},async()=>{
      const {rows:[rate]}=await client.query("SELECT count(*)::int AS count FROM artifact_leaderboards.dune_operations WHERE player_id=$1 AND created_at>now()-interval '1 hour'",[playerId]);
      if (rate.count>=240) throw fail(429,'Too many campaign changes. Try later.');
      const {rows:[existing]}=await client.query("SELECT granted_at FROM artifact_leaderboards.dune_entitlements WHERE player_id=$1 AND entitlement_key='farmland'",[playerId]);
      if (!existing && !farmlandEligible(profile.campaign)) throw fail(409,'Complete all 30 demo levels on this Portal account before unlocking Farmland.');
      if (!existing) await client.query("INSERT INTO artifact_leaderboards.dune_entitlements(player_id,entitlement_key,source) VALUES($1,'farmland','demo_completion_bonus') ON CONFLICT(player_id,entitlement_key) DO NOTHING",[playerId]);
      const {rows:[grant]}=existing?{rows:[existing]}:await client.query("SELECT granted_at FROM artifact_leaderboards.dune_entitlements WHERE player_id=$1 AND entitlement_key='farmland'",[playerId]);
      return farmlandStatus(playerId,profile,grant);
    }));
    res.json(response);
  }));
  app.post(`${BASE}/campaign/import`,authenticated,limited(async(req,res)=>{
    const {requestId,guestSave}=req.body??{};
    const imported=guestImport(guestSave);
    const response=await transaction(req.playerSession.player_id,async(client,profile)=>receipt(client,req.playerSession.player_id,requestId,'import',{guestSave:imported},async()=>{
      const {rows:[rate]}=await client.query("SELECT count(*)::int AS count FROM artifact_leaderboards.dune_operations WHERE player_id=$1 AND created_at>now()-interval '1 hour'",[req.playerSession.player_id]);
      if (rate.count>=240) throw fail(429,'Too many campaign changes. Try later.');
      if (profile.imported || profile.revision>0 || profile.campaign.completed.length || profile.campaign.coins) throw fail(409,'This account already has campaign progress.');
      const next={revision:profile.revision+1,campaign:imported,imported:true};
      await saveProfile(client,req.playerSession.player_id,next);
      return {profile:next};
    }));
    res.json(response);
  }));
  app.post(`${BASE}/attempts`,authenticated,limited(async(req,res)=>{
    const {attemptId,levelId,boosters}=req.body??{};
    if (!validUuid(attemptId)) throw fail(400,'Invalid attempt ID.');
    const level=validLevel(levelId),selected=validBoosters(boosters);
    const result=await transaction(req.playerSession.player_id,async(client,profile)=>{
      await requireChapterAccess(client,req.playerSession,profile.campaign,level);
      const {rows:[existing]}=await client.query('SELECT * FROM artifact_leaderboards.dune_attempts WHERE id=$1',[attemptId]);
      if (existing) {
        if (String(existing.player_id)!==String(req.playerSession.player_id) || existing.level_id!==levelId || JSON.stringify(existing.boosters)!==JSON.stringify(selected)) throw fail(409,'Attempt ID already belongs to another attempt.');
        return {attemptId,status:existing.status,profile};
      }
      requireCurrentLevel(profile.campaign,level);
      const {rows:[rate]}=await client.query("SELECT count(*)::int AS count FROM artifact_leaderboards.dune_attempts WHERE player_id=$1 AND created_at>now()-interval '1 hour'",[req.playerSession.player_id]);
      if (rate.count>=120) throw fail(429,'Too many attempts. Try later.');
      await client.query('INSERT INTO artifact_leaderboards.dune_attempts(id,player_id,level_id,boosters,status) VALUES($1,$2,$3,$4,$5)',[attemptId,req.playerSession.player_id,levelId,JSON.stringify(selected),'prepared']);
      return {attemptId,status:'prepared',profile};
    });
    res.json(result);
  }));
  app.post(`${BASE}/attempts/:id/activate`,authenticated,limited(async(req,res)=>{
    const id=req.params.id;
    if (!validUuid(id)) throw fail(400,'Invalid attempt ID.');
    const result=await transaction(req.playerSession.player_id,async(client,profile)=>{
      const {rows:[row]}=await client.query('SELECT * FROM artifact_leaderboards.dune_attempts WHERE id=$1 AND player_id=$2 FOR UPDATE',[id,req.playerSession.player_id]);
      if (!row) throw fail(404,'Attempt not found.');
      await requireChapterAccess(client,req.playerSession,profile.campaign,levels.get(row.level_id));
      if (row.status!=='prepared') return {attemptId:id,status:row.status,profile};
      const cost=validBoosters(row.boosters).reduce((sum,kind)=>sum+boosterPrices[kind],0);
      if (req.body?.expectedRevision!==profile.revision) throw fail(409,'Campaign changed. Reload your save.');
      requireCurrentLevel(profile.campaign,levels.get(row.level_id));
      if (cost>profile.campaign.coins) throw fail(409,'Not enough coins.');
      const next=cost?{...profile,revision:profile.revision+1,campaign:{...profile.campaign,coins:profile.campaign.coins-cost}}:profile;
      if (cost) await saveProfile(client,req.playerSession.player_id,next);
      await client.query("UPDATE artifact_leaderboards.dune_attempts SET status='active',updated_at=now() WHERE id=$1",[id]);
      return {attemptId:id,status:'active',profile:next};
    });
    res.json(result);
  }));
  app.post(`${BASE}/attempts/:id/finish`,authenticated,limited(async(req,res)=>{
    const id=req.params.id;
    if (!validUuid(id)) throw fail(400,'Invalid attempt ID.');
    const {levelId,remainingMoves,contentVersion}=req.body??{};
    const level=validLevel(levelId);
    const moveCap=moveCapForVersion(level,contentVersion);
    if (moveCap===null || !Number.isSafeInteger(remainingMoves) || remainingMoves<0 || remainingMoves>moveCap) throw fail(400,'Invalid finish snapshot.');
    const result=await transaction(req.playerSession.player_id,async(client,profile)=>{
      let {rows:[row]}=await client.query('SELECT * FROM artifact_leaderboards.dune_attempts WHERE id=$1 AND player_id=$2 FOR UPDATE',[id,req.playerSession.player_id]);
      if (accessTierForLevel(level)==='campaign-pass' && (!row || !['active','finished'].includes(row.status))) throw fail(403,'Start this chapter online with an active Dune Pass before completing a level.');
      await requireChapterAccess(client,req.playerSession,profile.campaign,level,{finishActive:accessTierForLevel(level)==='campaign-pass' && Boolean(row)});
      // A free level may be completed after the connection drops before start.
      // The account and campaign order are checked under the same profile lock.
      if (!row) {
        const {rows:[rate]}=await client.query("SELECT count(*)::int AS count FROM artifact_leaderboards.dune_attempts WHERE player_id=$1 AND created_at>now()-interval '1 hour'",[req.playerSession.player_id]);
        if (rate.count>=120) throw fail(429,'Too many attempts. Try later.');
        if (level.index!==profile.campaign.completed.length) {
          const {rows:[done]}=await client.query('SELECT 1 FROM artifact_leaderboards.dune_completions WHERE player_id=$1 AND level_id=$2',[req.playerSession.player_id,levelId]);
          if (!done) throw fail(409,'Campaign changed. Reload your save.');
        } else {
          requireCurrentLevel(profile.campaign,level);
        }
        const {rows:[inserted]}=await client.query("INSERT INTO artifact_leaderboards.dune_attempts(id,player_id,level_id,boosters,status) VALUES($1,$2,$3,'[]'::jsonb,'active') ON CONFLICT(id) DO NOTHING RETURNING *",[id,req.playerSession.player_id,levelId]);
        if (!inserted) throw fail(409,'Attempt ID belongs to another player.');
        row=inserted;
      }
      if (!row || row.level_id!==levelId || row.status==='prepared') throw fail(409,'Attempt is not active.');
      if (row.status==='finished') {
        if (row.remaining_moves!==remainingMoves) throw fail(409,'Attempt already finished with different moves.');
        return {profile,reward:row.reward??0,alreadyFinished:true};
      }
      const {rows:[existing]}=await client.query('SELECT * FROM artifact_leaderboards.dune_completions WHERE player_id=$1 AND level_id=$2',[req.playerSession.player_id,levelId]);
      const first=!existing && level.index===profile.campaign.completed.length;
      if (!existing && !first) throw fail(409,'Campaign changed. Reload your save.');
      if (first) requireCurrentLevel(profile.campaign,level);
      const reward=first?rewardFor(remainingMoves):0;
      const completed=first?[...profile.campaign.completed,levelId]:profile.campaign.completed;
      const next=first?{...profile,revision:profile.revision+1,campaign:deriveCampaign(completed,profile.campaign.coins+reward,profile.campaign)}:profile;
      if (first) {
        await saveProfile(client,req.playerSession.player_id,next);
        await client.query('INSERT INTO artifact_leaderboards.dune_completions(player_id,level_id,attempt_id,reward) VALUES($1,$2,$3,$4)',[req.playerSession.player_id,levelId,id,reward]);
      }
      await client.query("UPDATE artifact_leaderboards.dune_attempts SET status='finished',remaining_moves=$2,reward=$3,updated_at=now() WHERE id=$1",[id,remainingMoves,reward]);
      return {profile:next,reward,alreadyFinished:false};
    });
    res.json(result);
  }));
  app.post(`${BASE}/campaign/checkpoint`,authenticated,limited(async(req,res)=>{
    const {requestId,campaign,expectedRevision}=req.body??{};
    const result=await transaction(req.playerSession.player_id,async(client,profile)=>receipt(client,req.playerSession.player_id,requestId,'checkpoint',{campaign},async()=>{
      const {rows:[rate]}=await client.query("SELECT count(*)::int AS count FROM artifact_leaderboards.dune_operations WHERE player_id=$1 AND created_at>now()-interval '1 hour'",[req.playerSession.player_id]);
      if (rate.count>=240) throw fail(429,'Too many campaign changes. Try later.');
      if (expectedRevision!==profile.revision) throw fail(409,'Campaign changed. Reload your save.');
      const next=applyCheckpoint(profile,campaign);
      await requireChapterAccess(client,req.playerSession,next.campaign);
      await saveProfile(client,req.playerSession.player_id,next);
      return {profile:next};
    }));
    res.json(result);
  }));
  app.post(`${BASE}/logout`,authenticated,limited(async(req,res)=>{
    await pool.query('DELETE FROM artifact_leaderboards.sessions WHERE token_hash=$1',[req.playerSession.token_hash]);
    res.clearCookie(COOKIE,{httpOnly:true,secure,sameSite:'lax',path:BASE}); res.json({ok:true});
  }));
  app.use(BASE,(_req,res)=>res.status(404).json({message:'Dune route not found.'}));
  app.use((err,_req,res,_next)=>res.status(Number.isInteger(err.status)?err.status:500).json({message:err.status?err.message:'Dune cloud save is temporarily unavailable.'}));
  return app;
}
