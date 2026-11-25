import express from 'express';
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { jwtVerify } from 'jose';
import { GAME, levels, content, boosterPrices, toolPrices, boosterFunding, companionAbilities, emptyCampaign, emptyProfile, inventoryKinds, normalizeProfile, validUuid, validLevel, validBoosters, requireCurrentLevel, guestImport, deriveCampaign, rewardFor, applyCheckpoint, farmlandEligible, moveCapForVersion, accessTierForLevel, accessTierForCampaign, fail } from './dune-rules.js';
import { createDuneCommerce } from './dune-commerce.js';
import { REWARD_CATALOG_VERSION, RESOURCE_LIMIT, chapterRewards, dailyReward, projectDailyVisit, reserveDailyVisit, rewardForClaim, addReward, utcDay } from './dune-rewards.js';
import { parseRewardPayload, previousRewardDay } from './dune-reward-shared.js';

const BASE = `/leaderboard-api/${GAME}`;
const COOKIE = 'dune_relay_session';
const INTENT_COOKIE = 'dune_relay_login_intent';
const SESSION_SECONDS = 12 * 60 * 60;
const hash = value => createHash('sha256').update(value).digest('hex');
const boundedName = value => typeof value === 'string' ? value.trim().slice(0, 60) : '';
const resetConflict=()=>Object.assign(fail(409,'Campaign restarted on another device. Reload your save.'),{code:'CAMPAIGN_RESET'});
const requireGeneration=(profile,provided)=>{const captured=provided===undefined?0:provided;if(!Number.isSafeInteger(captured)||captured<0||captured!==profile.campaignGeneration)throw resetConflict();return captured;};
const runPayload=(payload,generation)=>generation===0?payload:{...payload,campaignGeneration:generation};
const requireAttemptGeneration=(profile,attempt)=>{if(Number(attempt?.campaign_generation??0)!==profile.campaignGeneration)throw resetConflict();};

export function createDuneApp({ pool, origin, issuer, launchSecret, secure = true, commerce = createDuneCommerce(), clock = () => new Date(), selectRandomReward }) {
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
  const rewardRow=row=>({key:row.reward_key,version:row.reward_version,payload:row.reward_payload,claimedAt:row.claimed_at instanceof Date?row.claimed_at.toISOString():row.claimed_at,presentedAt:row.presented_at instanceof Date?row.presented_at.toISOString():row.presented_at});
  async function currentLockedProfile(client,playerId) {
    const {rows:[row]}=await client.query('SELECT profile FROM artifact_leaderboards.dune_profiles WHERE player_id=$1',[playerId]);
    return normalizeProfile(row.profile);
  }
  async function rewardDays(client,playerId,day){
    const {rows}=await client.query('SELECT reward_key,reward_version,reward_payload FROM artifact_leaderboards.dune_reward_claims WHERE player_id=$1 AND reward_key IN ($2,$3)',[playerId,`daily:${day}`,`daily:${previousRewardDay(day)}`]);
    return {today:rows.find(row=>row.reward_key===`daily:${day}`)??null,yesterday:rows.find(row=>row.reward_key===`daily:${previousRewardDay(day)}`)??null};
  }
  async function ensureDailyVisit(client,playerId,profile,day){
    if(profile.dailyVisit?.day===day)return profile.dailyVisit;
    const {today,yesterday}=await rewardDays(client,playerId,day);
    const dailyVisit=reserveDailyVisit(profile,day,today,yesterday,selectRandomReward);
    await saveProfile(client,playerId,{...profile,dailyVisit});
    return dailyVisit;
  }
  async function canImportGuest(client,playerId,profile,hasProfile=true) {
    if(!hasProfile)return true;
    if(profile.imported||profile.rewardClaims.fieldToolkitV1)return false;
    const blank=emptyCampaign();
    if(Object.keys(blank).some(key=>key!=='coins'&&JSON.stringify(profile.campaign[key])!==JSON.stringify(blank[key])))return false;
    const {rows:[attempts]}=await client.query('SELECT count(*)::int AS count FROM artifact_leaderboards.dune_attempts WHERE player_id=$1',[playerId]);
    const {rows:operations}=await client.query('SELECT kind FROM artifact_leaderboards.dune_operations WHERE player_id=$1',[playerId]);
    const {rows:claims}=await client.query('SELECT reward_key,reward_payload FROM artifact_leaderboards.dune_reward_claims WHERE player_id=$1',[playerId]);
    if(attempts.count||operations.some(row=>row.kind!=='reward-claim')||claims.some(row=>!/^daily:\d{4}-\d{2}-\d{2}$/.test(row.reward_key)))return false;
    const parsed=claims.map(row=>parseRewardPayload(row.reward_payload));
    if(parsed.some(value=>!value))return false;
    const coins=parsed.reduce((sum,value)=>sum+value.coins,0);
    if(!Number.isSafeInteger(coins)||profile.campaign.coins!==coins)return false;
    const stock=Object.fromEntries(inventoryKinds.map(kind=>[kind,0]));
    for(const claim of parsed)for(const {item,quantity} of claim.items)stock[item]+=quantity;
    return inventoryKinds.every(kind=>profile.inventory[kind]===stock[kind]);
  }
  app.get(`${BASE}/ready`,limited(async (_req,res) => {
    const missing=[];
    const tables={ players:['id','issuer','subject'], sessions:['token_hash','player_id','game'], launches:['issuer','jti'], dune_profiles:['player_id','profile'], dune_attempts:['id','player_id','level_id','boosters','booster_funding','tool_sequence','companion_snapshot','status','campaign_generation'], dune_completions:['player_id','level_id','attempt_id','reward'], dune_operations:['player_id','request_id','response'], dune_reward_claims:['player_id','reward_key','reward_version','reward_payload','claimed_at','presented_at'], dune_launch_intents:['nonce_hash','expires_at'], dune_entitlements:['player_id','entitlement_key','source','granted_at'] };
    const {rows:[schema]}=await pool.query("SELECT has_schema_privilege(current_user,to_regnamespace('artifact_leaderboards'),'USAGE') AS can_use");
    if (!schema?.can_use) missing.push('schema:usage');
    for (const [name,columns] of Object.entries(tables)) {
      const relation=`artifact_leaderboards.${name}`;
      const {rows:[state]}=await pool.query(`SELECT to_regclass($1) AS relation,has_table_privilege(current_user,to_regclass($1),'SELECT') AS can_select,has_table_privilege(current_user,to_regclass($1),'INSERT') AS can_insert,has_table_privilege(current_user,to_regclass($1),'UPDATE') AS can_update`,[relation]);
      if (!state?.relation) { missing.push(relation); continue; }
      for (const op of name === 'dune_launch_intents' || name === 'dune_entitlements' ? ['select','insert'] : ['select','insert','update']) if (!state[`can_${op}`]) missing.push(`${relation}:${op}`);
      if (name === 'sessions' || name === 'launches' || name === 'dune_launch_intents' || name === 'dune_completions') {
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
    const playerId=req.playerSession.player_id;
    const {rows:[row]}=await pool.query('SELECT profile FROM artifact_leaderboards.dune_profiles WHERE player_id=$1',[playerId]);
    const profile=row?normalizeProfile(row.profile):null;
    res.json({accountId:String(playerId),hasCampaign:Boolean(row),canImportGuest:await canImportGuest(pool,playerId,profile,Boolean(row)),profile});
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
    const {requestId,guestSave,campaignGeneration}=req.body??{};
    const imported=guestImport(guestSave);
    const response=await transaction(req.playerSession.player_id,async(client,profile)=>{
      const generation=requireGeneration(profile,campaignGeneration);
      const saved=await receipt(client,req.playerSession.player_id,requestId,'import',runPayload({guestSave:imported},generation),async()=>{
      const {rows:[rate]}=await client.query("SELECT count(*)::int AS count FROM artifact_leaderboards.dune_operations WHERE player_id=$1 AND created_at>now()-interval '1 hour'",[req.playerSession.player_id]);
      if (rate.count>=240) throw fail(429,'Too many campaign changes. Try later.');
      if (!(await canImportGuest(client,req.playerSession.player_id,profile))) throw fail(409,'This account already has campaign progress.');
      if(profile.campaign.coins+imported.coins>RESOURCE_LIMIT)throw fail(409,'Coin storage is full. Spend some coins before importing.');
      const next={...profile,revision:profile.revision+1,campaign:deriveCampaign(imported.completed,profile.campaign.coins+imported.coins,imported),imported:true};
      await saveProfile(client,req.playerSession.player_id,next);
      return {profile:next};
      });
      return {...saved,profile:await currentLockedProfile(client,req.playerSession.player_id)};
    });
    res.json(response);
  }));
  app.post(`${BASE}/campaign/reset`,authenticated,limited(async(req,res)=>{
    const {requestId,expectedRevision,campaignGeneration}=req.body??{};
    if(!validUuid(requestId))throw fail(400,'A valid request ID is required.');
    const playerId=req.playerSession.player_id;
    const result=await transaction(playerId,async(client,profile)=>{
      // A retry must return the first reset's identity, even after later play or reset.
      const {rows:[existing]}=await client.query('SELECT kind,payload_hash,response FROM artifact_leaderboards.dune_operations WHERE player_id=$1 AND request_id=$2',[playerId,requestId]);
      const payloadHash=hash(JSON.stringify({expectedRevision,campaignGeneration}));
      if(existing){
        if(existing.kind==='campaign-reset-cancelled' && existing.payload_hash===payloadHash)throw Object.assign(fail(409,'This reset was cancelled.'),{code:'RESET_CANCELLED'});
        if(existing.kind!=='campaign-reset'||existing.payload_hash!==payloadHash)throw fail(409,'This request ID was used for a different action.');
        return {...existing.response,profile};
      }
      requireGeneration(profile,campaignGeneration);
      if(expectedRevision!==profile.revision)throw fail(409,'Campaign changed. Reload your save.');
      if(profile.campaignGeneration>=Number.MAX_SAFE_INTEGER||profile.revision>=Number.MAX_SAFE_INTEGER)throw fail(409,'Campaign cannot be restarted right now.');
      const next={...profile,revision:profile.revision+1,campaignGeneration:profile.campaignGeneration+1,campaign:emptyCampaign(),inventory:Object.fromEntries(inventoryKinds.map(kind=>[kind,0])),imported:true};
      await saveProfile(client,playerId,next);
      await client.query('DELETE FROM artifact_leaderboards.dune_completions WHERE player_id=$1',[playerId]);
      await client.query('UPDATE artifact_leaderboards.dune_reward_claims SET presented_at=COALESCE(presented_at,now()) WHERE player_id=$1 AND presented_at IS NULL',[playerId]);
      const response={campaignGeneration:next.campaignGeneration};
      await client.query('INSERT INTO artifact_leaderboards.dune_operations(player_id,request_id,kind,payload_hash,response) VALUES($1,$2,$3,$4,$5)',[playerId,requestId,'campaign-reset',payloadHash,response]);
      return {...response,profile:next};
    });
    res.json(result);
  }));
  app.post(`${BASE}/campaign/reset/cancel`,authenticated,limited(async(req,res)=>{
    const {requestId,expectedRevision,campaignGeneration}=req.body??{};
    if(!validUuid(requestId)||!Number.isSafeInteger(expectedRevision)||expectedRevision<0||!Number.isSafeInteger(campaignGeneration)||campaignGeneration<0)throw fail(400,'Invalid reset request.');
    const playerId=req.playerSession.player_id;
    const result=await transaction(playerId,async(client,profile)=>{
      const payloadHash=hash(JSON.stringify({expectedRevision,campaignGeneration}));
      const {rows:[existing]}=await client.query('SELECT kind,payload_hash,response FROM artifact_leaderboards.dune_operations WHERE player_id=$1 AND request_id=$2',[playerId,requestId]);
      if(existing){
        if(existing.payload_hash!==payloadHash||!['campaign-reset','campaign-reset-cancelled'].includes(existing.kind))throw fail(409,'This request ID was used for a different action.');
        return {status:existing.kind==='campaign-reset'?'applied':'cancelled',profile,campaignGeneration:existing.response.campaignGeneration??profile.campaignGeneration};
      }
      await client.query('INSERT INTO artifact_leaderboards.dune_operations(player_id,request_id,kind,payload_hash,response) VALUES($1,$2,$3,$4,$5)',[playerId,requestId,'campaign-reset-cancelled',payloadHash,{campaignGeneration:profile.campaignGeneration}]);
      return {status:'cancelled',profile,campaignGeneration:profile.campaignGeneration};
    });
    res.json(result);
  }));
  app.post(`${BASE}/rewards/visit`,authenticated,limited(async(req,res)=>{
    const playerId=req.playerSession.player_id,day=utcDay(clock());
    const dailyVisit=await transaction(playerId,async(client,profile)=>ensureDailyVisit(client,playerId,profile,day));
    res.json({catalogVersion:REWARD_CATALOG_VERSION,serverDay:day,nextResetAt:new Date(new Date(`${day}T00:00:00.000Z`).getTime()+86_400_000).toISOString(),dailyVisit});
  }));
  app.get(`${BASE}/rewards`,authenticated,limited(async(req,res)=>{
    const playerId=req.playerSession.player_id,day=utcDay(clock());
    const [{rows:[saved]},{rows:claims}]=await Promise.all([
      pool.query('SELECT profile FROM artifact_leaderboards.dune_profiles WHERE player_id=$1',[playerId]),
      pool.query('SELECT reward_key,reward_version,reward_payload,claimed_at,presented_at FROM artifact_leaderboards.dune_reward_claims WHERE player_id=$1 AND (reward_key=$2 OR reward_key=$3 OR reward_key LIKE $4 OR presented_at IS NULL) ORDER BY claimed_at,reward_key',[playerId,`daily:${day}`,`daily:${previousRewardDay(day)}`,'chapter:%']),
    ]);
    const profile=saved?normalizeProfile(saved.profile):emptyProfile(),byKey=new Map(claims.map(row=>[row.reward_key,row]));
    const projected=projectDailyVisit(profile,day,byKey.get(`daily:${day}`),byKey.get(`daily:${previousRewardDay(day)}`));
    const today=dailyReward(projected);
    const rewards=[today,...chapterRewards].map(reward=>{
      const claimed=byKey.get(reward.key),eligible=reward.key===today.key||profile.campaign.completed.length>=reward.completedCount;
      return {key:reward.key,title:reward.title,payload:claimed?.reward_payload??reward.payload,...(reward.cycleDay?{cycleDay:reward.cycleDay}:{}),status:claimed?(claimed.presented_at?'claimed-presented':'claimed-unpresented'):eligible?'available':'locked',...(claimed?{award:rewardRow(claimed)}:{})};
    });
    const unpresented=claims.filter(row=>!row.presented_at).map(rewardRow);
    res.json({catalogVersion:REWARD_CATALOG_VERSION,serverDay:day,nextResetAt:new Date(new Date(`${day}T00:00:00.000Z`).getTime()+86_400_000).toISOString(),dailyVisit:projected,visitReserved:profile.dailyVisit?.day===day,rewards,unpresented});
  }));
  app.post(`${BASE}/rewards/claim`,authenticated,limited(async(req,res)=>{
    const {requestId,rewardKey}=req.body??{};
    if(typeof rewardKey!=='string'||rewardKey.length>50||!rewardKey.length)throw fail(400,'Unknown reward.');
    if(!validUuid(requestId))throw fail(400,'A valid request ID is required.');
    const playerId=req.playerSession.player_id;
    const day=utcDay(clock());
    if(rewardKey===`daily:${day}`)await transaction(playerId,async(client,profile)=>ensureDailyVisit(client,playerId,profile,day));
    const result=await transaction(playerId,async(client,profile)=>{
      const saved=await receipt(client,playerId,requestId,'reward-claim',{rewardKey},async()=>{
        const {rows:[rate]}=await client.query("SELECT count(*)::int AS count FROM artifact_leaderboards.dune_operations WHERE player_id=$1 AND created_at>now()-interval '1 hour'",[playerId]);
        if(rate.count>=240)throw fail(429,'Too many campaign changes. Try later.');
        const {rows:[existing]}=await client.query('SELECT * FROM artifact_leaderboards.dune_reward_claims WHERE player_id=$1 AND reward_key=$2',[playerId,rewardKey]);
        if(existing)return {award:rewardRow(existing)};
        const reward=rewardForClaim(rewardKey,profile.campaign,clock(),profile.dailyVisit);
        const next=addReward(profile,reward);
        await saveProfile(client,playerId,next);
        const {rows:[claim]}=await client.query('INSERT INTO artifact_leaderboards.dune_reward_claims(player_id,reward_key,reward_version,reward_payload) VALUES($1,$2,$3,$4) RETURNING *',[playerId,reward.key,REWARD_CATALOG_VERSION,reward.payload]);
        return {award:rewardRow(claim)};
      });
      return {...saved,profile:await currentLockedProfile(client,playerId)};
    });
    res.json(result);
  }));
  app.post(`${BASE}/rewards/presented`,authenticated,limited(async(req,res)=>{
    const rewardKey=req.body?.rewardKey;
    if(typeof rewardKey!=='string'||rewardKey.length>50||!rewardKey.length)throw fail(400,'Unknown reward.');
    const result=await transaction(req.playerSession.player_id,async(client)=>{
      const {rows:[row]}=await client.query('UPDATE artifact_leaderboards.dune_reward_claims SET presented_at=COALESCE(presented_at,now()) WHERE player_id=$1 AND reward_key=$2 RETURNING *',[req.playerSession.player_id,rewardKey]);
      if(!row)throw fail(404,'Reward not claimed.');
      return {award:rewardRow(row)};
    });
    res.json(result);
  }));
  app.post(`${BASE}/inventory/field-toolkit`,authenticated,limited(async(req,res)=>{
    const {requestId,campaignGeneration}=req.body??{};
    const playerId=req.playerSession.player_id;
    const result=await transaction(playerId,async(client,profile)=>{
      const generation=requireGeneration(profile,campaignGeneration);
      const saved=await receipt(client,playerId,requestId,'field-toolkit',runPayload({},generation),async()=>{
      if (!profile.campaign.farmlandReady || !farmlandEligible(profile.campaign)) throw fail(403,'Arrive at Farmland to receive the toolkit.');
      await requireChapterAccess(client,req.playerSession,profile.campaign,levels.get('seedStore'));
      if (profile.rewardClaims.fieldToolkitV1) return {profile,granted:false};
      if(profile.inventory.tileBomb>=RESOURCE_LIMIT||profile.inventory.freeSwap>=RESOURCE_LIMIT)throw fail(409,'Tool storage is full. Use an item before claiming.');
      const next={...profile,revision:profile.revision+1,inventory:{...profile.inventory,tileBomb:profile.inventory.tileBomb+1,freeSwap:profile.inventory.freeSwap+1},rewardClaims:{...profile.rewardClaims,fieldToolkitV1:new Date().toISOString()}};
      await saveProfile(client,playerId,next);
      return {profile:next,granted:true};
      });return {...saved,profile:await currentLockedProfile(client,playerId)};
    });
    res.json(result);
  }));
  app.post(`${BASE}/inventory/purchase`,authenticated,limited(async(req,res)=>{
    const {requestId,kind,expectedRevision,attemptId,campaignGeneration}=req.body??{};
    if (!Object.hasOwn(toolPrices,kind) || !validUuid(attemptId)) throw fail(400,'Invalid tool purchase.');
    const playerId=req.playerSession.player_id;
    const result=await transaction(playerId,async(client,profile)=>{
      const generation=requireGeneration(profile,campaignGeneration);
      const saved=await receipt(client,playerId,requestId,'tool-purchase',runPayload({kind,expectedRevision,attemptId},generation),async()=>{
      const {rows:[attempt]}=await client.query('SELECT * FROM artifact_leaderboards.dune_attempts WHERE id=$1 AND player_id=$2 FOR UPDATE',[attemptId,playerId]);
      if (!attempt || attempt.status!=='active') throw fail(409,'The level is not active.');
      requireAttemptGeneration(profile,attempt);
      const level=levels.get(attempt.level_id);
      if (level.index<30) throw fail(403,'Tools unlock in Farmland.');
      requireCurrentLevel(profile.campaign,level);
      await requireChapterAccess(client,req.playerSession,profile.campaign,level);
      if (expectedRevision!==profile.revision) throw fail(409,'Campaign changed. Reload your save.');
      if (profile.campaign.coins<toolPrices[kind]) throw fail(409,'Not enough coins.');
      if(profile.inventory[kind]>=RESOURCE_LIMIT)throw fail(409,'Tool storage is full. Use an item before buying.');
      const next={...profile,revision:profile.revision+1,campaign:{...profile.campaign,coins:profile.campaign.coins-toolPrices[kind]},inventory:{...profile.inventory,[kind]:profile.inventory[kind]+1}};
      await saveProfile(client,playerId,next);
      return {profile:next,kind};
      });return {...saved,profile:await currentLockedProfile(client,playerId)};
    });
    res.json(result);
  }));
  app.post(`${BASE}/attempts/:id/tools`,authenticated,limited(async(req,res)=>{
    const id=req.params.id,{requestId,kind,expectedRevision,toolSequence,stateFingerprint,movesRemaining,campaignGeneration}=req.body??{};
    if (!validUuid(id) || !Object.hasOwn(toolPrices,kind) || typeof stateFingerprint!=='string' || !/^[a-f0-9]{64}$/i.test(stateFingerprint) || !Number.isSafeInteger(toolSequence) || toolSequence<1 || !Number.isSafeInteger(movesRemaining) || movesRemaining<1) throw fail(400,'Invalid tool use.');
    const playerId=req.playerSession.player_id;
    const result=await transaction(playerId,async(client,profile)=>{
      const generation=requireGeneration(profile,campaignGeneration);
      const saved=await receipt(client,playerId,requestId,'tool-use',runPayload({attemptId:id,kind,expectedRevision,toolSequence,stateFingerprint,movesRemaining},generation),async()=>{
      const {rows:[attempt]}=await client.query('SELECT * FROM artifact_leaderboards.dune_attempts WHERE id=$1 AND player_id=$2 FOR UPDATE',[id,playerId]);
      if (!attempt || attempt.status!=='active') throw fail(409,'The level is not active.');
      requireAttemptGeneration(profile,attempt);
      const level=levels.get(attempt.level_id);
      if (level.index<30) throw fail(403,'Tools unlock in Farmland.');
      requireCurrentLevel(profile.campaign,level);
      await requireChapterAccess(client,req.playerSession,profile.campaign,level);
      if (expectedRevision!==profile.revision || toolSequence!==attempt.tool_sequence+1) throw fail(409,'Tool use changed. Reload your save.');
      if (movesRemaining>level.moves || profile.inventory[kind]<1) throw fail(409,'Tool unavailable.');
      const next={...profile,revision:profile.revision+1,inventory:{...profile.inventory,[kind]:profile.inventory[kind]-1}};
      await saveProfile(client,playerId,next);
      await client.query('UPDATE artifact_leaderboards.dune_attempts SET tool_sequence=$2,updated_at=now() WHERE id=$1',[id,toolSequence]);
      return {profile:next,toolSequence};
      });return {...saved,profile:await currentLockedProfile(client,playerId)};
    });
    res.json(result);
  }));
  app.post(`${BASE}/attempts`,authenticated,limited(async(req,res)=>{
    const {attemptId,levelId,boosters,companionId,campaignGeneration}=req.body??{};
    if (!validUuid(attemptId)) throw fail(400,'Invalid attempt ID.');
    const level=validLevel(levelId),selected=validBoosters(boosters);
    const result=await transaction(req.playerSession.player_id,async(client,profile)=>{
      requireGeneration(profile,campaignGeneration);
      await requireChapterAccess(client,req.playerSession,profile.campaign,level);
      const usesCompanion = level.chapter === 'castle' || level.chapter === 'river';
      if (!usesCompanion && companionId != null) throw fail(400,'Active companion only applies at Castle Island and the River.');
      if (usesCompanion && !Object.hasOwn(companionAbilities, companionId)) throw fail(400,'Choose an unlocked raid member.');
      const companionSnapshot = usesCompanion ? { id: companionId, ...companionAbilities[companionId] } : null;
      const {rows:[existing]}=await client.query('SELECT * FROM artifact_leaderboards.dune_attempts WHERE id=$1',[attemptId]);
      if (existing) {
        requireAttemptGeneration(profile,existing);
        // An attempt keeps the companion ability it started with. A later
        // balance update must not invalidate a prepared/active retry.
        const sameCompanion = existing.companion_snapshot === null && companionSnapshot === null || existing.companion_snapshot?.id === companionSnapshot?.id;
        if (String(existing.player_id)!==String(req.playerSession.player_id) || existing.level_id!==levelId || JSON.stringify(existing.boosters)!==JSON.stringify(selected) || !sameCompanion) throw fail(409,'Attempt ID already belongs to another attempt.');
        return {attemptId,status:existing.status,profile,companionSnapshot:existing.companion_snapshot,boosterFunding:existing.booster_funding};
      }
      if (usesCompanion && companionId !== profile.campaign.activeCompanion) throw fail(409,'Select the active raid member before starting this chapter.');
      requireCurrentLevel(profile.campaign,level);
      const {rows:[rate]}=await client.query("SELECT count(*)::int AS count FROM artifact_leaderboards.dune_attempts WHERE player_id=$1 AND created_at>now()-interval '1 hour'",[req.playerSession.player_id]);
      if (rate.count>=120) throw fail(429,'Too many attempts. Try later.');
      const funding=boosterFunding(selected,profile.inventory);
      await client.query('INSERT INTO artifact_leaderboards.dune_attempts(id,player_id,level_id,boosters,booster_funding,companion_snapshot,status,campaign_generation) VALUES($1,$2,$3,$4,$5,$6,$7,$8)',[attemptId,req.playerSession.player_id,levelId,JSON.stringify(selected),JSON.stringify(funding),companionSnapshot && JSON.stringify(companionSnapshot),'prepared',profile.campaignGeneration]);
      return {attemptId,status:'prepared',profile,companionSnapshot,boosterFunding:funding};
    });
    res.json(result);
  }));
  app.post(`${BASE}/attempts/:id/activate`,authenticated,limited(async(req,res)=>{
    const id=req.params.id,campaignGeneration=req.body?.campaignGeneration;
    if (!validUuid(id)) throw fail(400,'Invalid attempt ID.');
    const result=await transaction(req.playerSession.player_id,async(client,profile)=>{
      requireGeneration(profile,campaignGeneration);
      const {rows:[row]}=await client.query('SELECT * FROM artifact_leaderboards.dune_attempts WHERE id=$1 AND player_id=$2 FOR UPDATE',[id,req.playerSession.player_id]);
      if (!row) throw fail(404,'Attempt not found.');
      requireAttemptGeneration(profile,row);
      await requireChapterAccess(client,req.playerSession,profile.campaign,levels.get(row.level_id));
      if (row.status!=='prepared') return {attemptId:id,status:row.status,profile,companionSnapshot:row.companion_snapshot};
      const funding=row.booster_funding;
      const cost=funding ? funding.coinCost : validBoosters(row.boosters).reduce((sum,kind)=>sum+boosterPrices[kind],0);
      if (req.body?.expectedRevision!==profile.revision) throw fail(409,'Campaign changed. Reload your save.');
      requireCurrentLevel(profile.campaign,levels.get(row.level_id));
      if (cost>profile.campaign.coins) throw fail(409,'Not enough coins.');
      if (funding && (JSON.stringify([...funding.owned].sort())!==JSON.stringify([...funding.owned]) || [...funding.owned,...funding.purchased].sort().join(',')!==validBoosters(row.boosters).join(',') || funding.coinCost!==funding.purchased.reduce((sum,kind)=>sum+boosterPrices[kind],0) || funding.owned.some(kind=>profile.inventory[kind]<1))) throw fail(409,'Starting booster stock changed. Reload your save.');
      const next=cost || funding?.owned.length ? {...profile,revision:profile.revision+1,campaign:{...profile.campaign,coins:profile.campaign.coins-cost},inventory:{...profile.inventory}}:profile;
      for (const kind of funding?.owned??[]) next.inventory[kind]--;
      if (next!==profile) await saveProfile(client,req.playerSession.player_id,next);
      await client.query("UPDATE artifact_leaderboards.dune_attempts SET status='active',updated_at=now() WHERE id=$1",[id]);
      return {attemptId:id,status:'active',profile:next,companionSnapshot:row.companion_snapshot};
    });
    res.json(result);
  }));
  app.post(`${BASE}/attempts/:id/finish`,authenticated,limited(async(req,res)=>{
    const id=req.params.id;
    if (!validUuid(id)) throw fail(400,'Invalid attempt ID.');
    const {levelId,remainingMoves,contentVersion,campaignGeneration}=req.body??{};
    const level=validLevel(levelId);
    const moveCap=moveCapForVersion(level,contentVersion);
    if (moveCap===null || !Number.isSafeInteger(remainingMoves) || remainingMoves<0 || remainingMoves>moveCap) throw fail(400,'Invalid finish snapshot.');
    const result=await transaction(req.playerSession.player_id,async(client,profile)=>{
      requireGeneration(profile,campaignGeneration);
      let {rows:[row]}=await client.query('SELECT * FROM artifact_leaderboards.dune_attempts WHERE id=$1 AND player_id=$2 FOR UPDATE',[id,req.playerSession.player_id]);
      if(row)requireAttemptGeneration(profile,row);
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
        const {rows:[inserted]}=await client.query("INSERT INTO artifact_leaderboards.dune_attempts(id,player_id,level_id,boosters,status,campaign_generation) VALUES($1,$2,$3,'[]'::jsonb,'active',$4) ON CONFLICT(id) DO NOTHING RETURNING *",[id,req.playerSession.player_id,levelId,profile.campaignGeneration]);
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
    const {requestId,campaign,expectedRevision,campaignGeneration}=req.body??{};
    const result=await transaction(req.playerSession.player_id,async(client,profile)=>{
      const generation=requireGeneration(profile,campaignGeneration);
      const saved=await receipt(client,req.playerSession.player_id,requestId,'checkpoint',runPayload({campaign},generation),async()=>{
      const {rows:[rate]}=await client.query("SELECT count(*)::int AS count FROM artifact_leaderboards.dune_operations WHERE player_id=$1 AND created_at>now()-interval '1 hour'",[req.playerSession.player_id]);
      if (rate.count>=240) throw fail(429,'Too many campaign changes. Try later.');
      if (expectedRevision!==profile.revision) throw fail(409,'Campaign changed. Reload your save.');
      const next=applyCheckpoint(profile,campaign);
      await requireChapterAccess(client,req.playerSession,next.campaign);
      await saveProfile(client,req.playerSession.player_id,next);
      return {profile:next};
      });return {...saved,profile:await currentLockedProfile(client,req.playerSession.player_id)};
    });
    res.json(result);
  }));
  app.post(`${BASE}/logout`,authenticated,limited(async(req,res)=>{
    await pool.query('DELETE FROM artifact_leaderboards.sessions WHERE token_hash=$1',[req.playerSession.token_hash]);
    res.clearCookie(COOKIE,{httpOnly:true,secure,sameSite:'lax',path:BASE}); res.json({ok:true});
  }));
  app.use(BASE,(_req,res)=>res.status(404).json({message:'Dune route not found.'}));
  app.use((err,_req,res,_next)=>res.status(Number.isInteger(err.status)?err.status:500).json({message:err.status?err.message:'Dune cloud save is temporarily unavailable.',...(err.code?{code:err.code}:{})}));
  return app;
}
