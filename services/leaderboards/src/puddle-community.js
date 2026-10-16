import express from 'express';
import {createHash,randomUUID} from 'node:crypto';
import {validatePublishedLevel} from './puddle-level-schema.js';

const UUID=/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
const bad=(status,message)=>Object.assign(new Error(message),{status});
const hash=value=>createHash('sha256').update(value).digest('hex');
const relation='artifact_leaderboards';
const columns=`l.id,to_char(l.updated_at AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.US"Z"') AS "cursorStamp",
  l.current_version AS "currentVersion",l.published,l.created_at AS "createdAt",
  l.updated_at AS "updatedAt",l.unpublished_at AS "unpublishedAt",
  v.version,v.document,v.description,v.content_hash AS "contentHash",v.title,
  v.gold_count AS "goldCount",v.gem_count AS "gemCount",v.target_seconds AS "targetSeconds",
  v.validation_version AS "validationVersion",v.created_at AS "versionCreatedAt",
  p.display_name AS author`;
const joins=`FROM ${relation}.puddle_community_levels l
  JOIN ${relation}.puddle_community_versions v ON v.level_id=l.id
  JOIN ${relation}.players p ON p.id=l.owner_id`;
const info=(r,{withDocument=false,owner=false}={})=>({id:r.id,version:r.version,title:r.title,
  description:r.description,author:r.author,goldCount:r.goldCount,gemCount:r.gemCount,
  targetTime:Number(r.targetSeconds),contentHash:r.contentHash,validationVersion:r.validationVersion,
  createdAt:r.createdAt,updatedAt:r.updatedAt,versionCreatedAt:r.versionCreatedAt,
  ...(owner?{published:r.published,currentVersion:r.currentVersion,unpublishedAt:r.unpublishedAt}:{}),
  ...(withDocument?{document:r.document}:{})});
const id=value=>{if(typeof value!=='string'||!UUID.test(value))throw bad(400,'Invalid community level ID.');return value.toLowerCase();};
const version=value=>{const n=Number(value);if(!Number.isSafeInteger(n)||n<1||n>1000000)throw bad(400,'Invalid community version.');return n;};
const cursor=value=>{
  if(value===undefined)return null;
  if(typeof value!=='string'||value.length>160)throw bad(400,'Invalid page cursor.');
  let decoded;try{decoded=Buffer.from(value,'base64url').toString('utf8');}catch{throw bad(400,'Invalid page cursor.');}
  const [stamp,uuid,...extra]=decoded.split('|');
  if(extra.length||!UUID.test(uuid)||!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{6}Z$/.test(stamp)||
    !Number.isFinite(Date.parse(stamp)))throw bad(400,'Invalid page cursor.');
  return {stamp,uuid};
};
const key=r=>Buffer.from(`${r.cursorStamp}|${r.id}`).toString('base64url');
const payload=(body,{update=false}={})=>{
  const allowed=update?['requestId','document','description','baseVersion']:['requestId','document','description'];
  if(!body||Array.isArray(body)||typeof body!=='object'||Object.keys(body).some(k=>!allowed.includes(k)))
    throw bad(400,'Invalid publication request.');
  const requestId=id(body.requestId);
  if(typeof body.description!=='string'||body.description.length>500||/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(body.description))
    throw bad(400,'Keep the description under 500 plain-text characters.');
  let checked;try{checked=validatePublishedLevel(body.document);}catch(error){throw bad(400,error.message);}
  return {requestId,description:body.description.trim(),checked,
    contentHash:hash(checked.canonical),baseVersion:update?version(body.baseVersion):null};
};
async function transaction(pool,work){const client=await pool.connect();try{
  await client.query('BEGIN');const value=await work(client);await client.query('COMMIT');return value;
}catch(error){await client.query('ROLLBACK').catch(()=>{});if(error.code==='23505')throw bad(409,'Publication request already exists.');throw error;
}finally{client.release();}}
async function previousRequest(client,requestId,ownerId){const {rows:[r]}=await client.query(`SELECT v.level_id,v.version,v.description,v.content_hash,l.owner_id,
  l.published FROM ${relation}.puddle_community_versions v JOIN ${relation}.puddle_community_levels l ON l.id=v.level_id
  WHERE v.request_id=$1`,[requestId]);
  if(!r)return null;if(r.owner_id!==ownerId)throw bad(409,'Publication request ID already used.');return r;}
function sameRetry(previous,request,{levelId=null,baseVersion=null}={}){
  if(previous.content_hash!==request.contentHash||previous.description!==request.description||
    (levelId&&previous.level_id!==levelId)||(baseVersion!==null&&previous.version!==baseVersion+1))
    throw bad(409,'This publication request ID was used for different content.');
  return {id:previous.level_id,version:previous.version,published:previous.published};
}
async function quota(client,ownerId,{creating=false}={}){
  if(creating){const {rows:[totals]}=await client.query(`SELECT count(*)::int AS identities,
    count(*) FILTER (WHERE created_at>now()-interval '1 day')::int AS recent
    FROM ${relation}.puddle_community_levels WHERE owner_id=$1`,[ownerId]);
    if(totals.identities>=50)throw bad(429,'You have reached 50 community levels.');
    if(totals.recent>=20)throw bad(429,'You have reached 20 new levels today.');}
  const {rows:[pubs]}=await client.query(`SELECT count(*)::int AS n FROM ${relation}.puddle_community_versions v
    JOIN ${relation}.puddle_community_levels l ON l.id=v.level_id
    WHERE l.owner_id=$1 AND v.created_at>now()-interval '1 day'`,[ownerId]);
  if(pubs.n>=100)throw bad(429,'You have reached 100 publications today.');
}
export function mountPuddleCommunity(app,{pool,session,base}){
  app.get(`${base}/community/levels`,async(req,res)=>{
    const limit=req.query.limit===undefined?20:Number(req.query.limit),after=cursor(req.query.cursor);
    if(!Number.isInteger(limit)||limit<1||limit>20)throw bad(400,'Choose 1–20 levels per page.');
    const args=after?[after.stamp,after.uuid,limit+1]:[limit+1],start=after?3:1;
    const {rows}=await pool.query(`SELECT ${columns} ${joins}
      WHERE l.published AND v.version=l.current_version
      ${after?'AND (l.updated_at,l.id)<($1::timestamptz,$2::uuid)':''}
      ORDER BY l.updated_at DESC,l.id DESC LIMIT $${start}`,args);
    const entries=rows.slice(0,limit).map(r=>info(r));
    res.json({entries,nextCursor:rows.length>limit?key(rows[limit-1]):null});
  });
  app.get(`${base}/community/levels/:id`,async(req,res)=>{
    const levelId=id(req.params.id),{rows:[row]}=await pool.query(`SELECT ${columns} ${joins}
      WHERE l.id=$1 AND l.published AND v.version=l.current_version`,[levelId]);
    if(!row)throw bad(404,'This community level is unavailable.');res.json(info(row,{withDocument:true}));
  });
  app.get(`${base}/community/levels/:id/versions/:version`,async(req,res)=>{
    const levelId=id(req.params.id),number=version(req.params.version),{rows:[row]}=await pool.query(`SELECT ${columns} ${joins}
      WHERE l.id=$1 AND l.published AND v.version=$2`,[levelId,number]);
    if(!row)throw bad(404,'This community version is unavailable.');res.json(info(row,{withDocument:true}));
  });
  app.get(`${base}/community/mine`,session,async(req,res)=>{
    const {rows}=await pool.query(`SELECT ${columns} ${joins}
      WHERE l.owner_id=$1 AND v.version=l.current_version ORDER BY l.updated_at DESC,l.id DESC LIMIT 50`,
      [req.playerSession.player_id]);res.json({entries:rows.map(r=>info(r,{owner:true}))});
  });
  app.get(`${base}/community/mine/:id`,session,async(req,res)=>{
    const levelId=id(req.params.id),{rows:[row]}=await pool.query(`SELECT ${columns} ${joins}
      WHERE l.id=$1 AND l.owner_id=$2 AND v.version=l.current_version`,[levelId,req.playerSession.player_id]);
    if(!row)throw bad(404,'Community level not found.');res.json(info(row,{withDocument:true,owner:true}));
  });
  app.post(`${base}/community/levels`,session,async(req,res)=>{
    const request=payload(req.body),owner=req.playerSession.player_id;
    const result=await transaction(pool,async client=>{
      await client.query(`SELECT id FROM ${relation}.players WHERE id=$1 FOR UPDATE`,[owner]);
      const prior=await previousRequest(client,request.requestId,owner);
      if(prior)return sameRetry(prior,request);
      await quota(client,owner,{creating:true});
      const levelId=randomUUID(),m=request.checked;
      await client.query(`INSERT INTO ${relation}.puddle_community_levels(id,owner_id,current_version,published)
        VALUES($1,$2,1,true)`,[levelId,owner]);
      await client.query(`INSERT INTO ${relation}.puddle_community_versions
        (level_id,version,request_id,document,description,content_hash,title,gold_count,gem_count,target_seconds,validation_version)
        VALUES($1,1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [levelId,request.requestId,m.document,request.description,request.contentHash,m.title,m.goldCount,m.gemCount,
          m.targetSeconds,m.validationVersion]);
      return {id:levelId,version:1,published:true};
    });res.status(201).json(result);
  });
  app.post(`${base}/community/levels/:id/versions`,session,async(req,res)=>{
    const levelId=id(req.params.id),request=payload(req.body,{update:true}),owner=req.playerSession.player_id;
    const result=await transaction(pool,async client=>{
      // Serialize all publications by this author, including different levels,
      // before checking the rolling daily quota.
      await client.query(`SELECT id FROM ${relation}.players WHERE id=$1 FOR UPDATE`,[owner]);
      const {rows:[level]}=await client.query(`SELECT id,current_version,published FROM ${relation}.puddle_community_levels
        WHERE id=$1 AND owner_id=$2 FOR UPDATE`,[levelId,owner]);
      if(!level)throw bad(404,'Community level not found.');
      const prior=await previousRequest(client,request.requestId,owner);
      if(prior)return sameRetry(prior,request,{levelId,baseVersion:request.baseVersion});
      if(level.current_version!==request.baseVersion)throw bad(409,'This level changed. Refresh your owned copy before publishing again.');
      await quota(client,owner);
      const next=level.current_version+1,m=request.checked;
      await client.query(`INSERT INTO ${relation}.puddle_community_versions
        (level_id,version,request_id,document,description,content_hash,title,gold_count,gem_count,target_seconds,validation_version)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [levelId,next,request.requestId,m.document,request.description,request.contentHash,m.title,m.goldCount,m.gemCount,
          m.targetSeconds,m.validationVersion]);
      await client.query(`UPDATE ${relation}.puddle_community_levels SET current_version=$2,published=true,
        updated_at=now(),unpublished_at=NULL WHERE id=$1`,[levelId,next]);
      return {id:levelId,version:next,published:true};
    });res.status(201).json(result);
  });
  app.post(`${base}/community/levels/:id/unpublish`,session,async(req,res)=>{
    const levelId=id(req.params.id);
    if(!req.body||Object.keys(req.body).some(k=>k!=='expectedVersion'))throw bad(400,'Invalid unpublish request.');
    const expected=version(req.body.expectedVersion),owner=req.playerSession.player_id;
    const result=await transaction(pool,async client=>{
      const {rows:[level]}=await client.query(`SELECT id,current_version,published FROM ${relation}.puddle_community_levels
        WHERE id=$1 AND owner_id=$2 FOR UPDATE`,[levelId,owner]);
      if(!level)throw bad(404,'Community level not found.');
      if(level.current_version!==expected)throw bad(409,'This level changed. Refresh before unpublishing.');
      if(level.published)await client.query(`UPDATE ${relation}.puddle_community_levels
        SET published=false,updated_at=now(),unpublished_at=now() WHERE id=$1`,[levelId]);
      return {id:levelId,version:expected,published:false};
    });res.json(result);
  });
}
