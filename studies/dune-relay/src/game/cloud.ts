import type { Save } from './save';
import type { BoosterKind } from './boosters';
import type { LevelId } from './levels';
import type { CompanionId } from './save';
import type { CompanionSnapshot } from './companionAbilities';
import type { Puzzle, PuzzleAction } from './core';
import type { Inventory } from './inventory';

const BASE = '/leaderboard-api/dune-relay';
export const PORTAL_LOGIN_URL = '/leaderboard-api/dune-relay/login';
export type CloudProfile = { revision: number; campaignGeneration?:number; campaign: Save; imported: boolean; inventory: Inventory; rewardClaims: {fieldToolkitV1?:string}; dailyVisit?:DailyVisit|null };
export type CloudSession = { accountId: string; displayName: string; contentVersion: string };
export type FarmlandEntitlement = { accountId: string; farmland: { unlocked: boolean; eligible: boolean; unlockedAt: string | null } };
export type CampaignPass = { state: 'active' | 'locked' | 'unavailable'; unlocked: boolean; unlockedAt: string | null; checkedAt: string | null; storeUrl: string | null };
export type AccountEntitlements = FarmlandEntitlement & { campaignPass: CampaignPass };
export type CloudOperation =
  | { kind: 'finish'; attemptId: string; levelId: LevelId; remainingMoves: number; contentVersion: string; campaignGeneration?:number }
  | { kind: 'checkpoint'; requestId: string; campaign: Save; campaignGeneration?:number };
export type ToolJournal = { accountId:string; attemptId:string; levelId:LevelId; requestId:string; expectedRevision:number; campaignGeneration?:number; toolSequence:number; kind:'tileBomb'|'freeSwap'; action:PuzzleAction; stateFingerprint:string; movesRemaining:number; contentVersion:string; before:Puzzle; after:Puzzle; phase:'pending'|'confirmed'|'applied' };
export type PendingToolPurchase = {requestId:string;kind:'tileBomb'|'freeSwap';accountId:string;attemptId:string;expectedRevision:number;campaignGeneration?:number};
export type RewardPayload = {coins:number;item:keyof Inventory|null;quantity:number;items?:{item:keyof Inventory;quantity:number}[]};
export type DailyVisit = {day:string;cycleDay:number;version:number;payload:RewardPayload};
export type RewardAward = {key:string;version:number;payload:RewardPayload;claimedAt:string;presentedAt:string|null};
export type RewardOffer = {key:string;title:string;payload:RewardPayload;cycleDay?:number;status:'available'|'locked'|'claimed-unpresented'|'claimed-presented';award?:RewardAward};
export type Rewards = {catalogVersion:number;serverDay:string;nextResetAt:string;dailyVisit?:DailyVisit;visitReserved?:boolean;rewards:RewardOffer[];unpresented:RewardAward[]};
export type ResetJournal = {accountId:string;requestId:string;expectedRevision:number;campaignGeneration:number;intent?:'reset'|'cancel'|'deferred'};
export type RewardJournal = {accountId:string;requestId:string;rewardKey:string;phase:'pending'|'confirmed'};
export type CloudCache = { profile: CloudProfile; localSave: Save; pending: CloudOperation[]; purchase?: { attemptId: string; levelId: LevelId; boosters: BoosterKind[]; cost?:number; companionSnapshot?: CompanionSnapshot | null }; toolJournal?:ToolJournal; purchaseTool?:PendingToolPurchase; rewardJournal?:RewardJournal; resetJournal?:ResetJournal };
const safeAccount = (id: string) => /^\d+$/.test(id) ? id : null;
const cacheKey = (id: string) => `dune-relay-cloud-${id}-v1`;
const resetKey = (id:string)=>`dune-relay-reset-${id}-v1`;
export function readResetJournal(id:string):ResetJournal|null {
  if(!safeAccount(id))return null;
  try{const value=JSON.parse(localStorage.getItem(resetKey(id))??'null');return value?.accountId===id && /^[0-9a-f-]{36}$/i.test(value.requestId) && Number.isSafeInteger(value.expectedRevision) && Number.isSafeInteger(value.campaignGeneration) && (value.intent===undefined||['reset','cancel','deferred'].includes(value.intent)) ? value : null;}catch{return null;}
}
export function writeResetJournal(journal:ResetJournal):boolean {
  if(!safeAccount(journal.accountId))return false;
  try{localStorage.setItem(resetKey(journal.accountId),JSON.stringify(journal));return true;}catch{return false;}
}
export function clearResetJournal(id:string):void {if(!safeAccount(id))return;try{localStorage.removeItem(resetKey(id));}catch{}}
const lastAccountKey = 'dune-relay-last-portal-account-v1';
export function rememberedAccount(): string | null {
  try { return safeAccount(localStorage.getItem(lastAccountKey) ?? ''); } catch { return null; }
}
export function rememberAccount(id: string | null): void {
  try { if (id && safeAccount(id)) localStorage.setItem(lastAccountKey,id); else localStorage.removeItem(lastAccountKey); } catch { /* Storage may be unavailable. */ }
}
const json = async (path: string, init?: RequestInit, accountId?: string) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8_000);
  try {
    const response = await fetch(`${BASE}${path}`, { credentials:'same-origin', cache:'no-store', ...init, signal:controller.signal, headers:{ ...(init?.body ? { 'Content-Type':'application/json' } : {}), ...(accountId ? { 'X-Dune-Account-ID':accountId } : {}), ...(init?.headers ?? {}) } });
    const body = await response.json().catch(error => { if(controller.signal.aborted)throw error; return {}; });
    if (!response.ok) throw Object.assign(new Error(typeof body.message === 'string' ? body.message : `Cloud request failed (${response.status})`), { status:response.status,code:body.code });
    return body;
  } finally { clearTimeout(timer); }
};
const post = (path: string, body: unknown, accountId: string) => {
  if(!['/campaign/reset','/campaign/reset/cancel','/logout','/rewards/visit'].includes(path) && readResetJournal(accountId))return Promise.reject(new Error('Finish or cancel the pending Start over request before playing.'));
  return json(path, { method:'POST',body:JSON.stringify(body) },accountId);
};
export const session = (): Promise<CloudSession> => json('/session');
export const resetReady = async ():Promise<boolean> => {const value=await json('/ready');return value?.ready===true && Array.isArray(value?.missing) && value.missing.length===0;};
export const campaign = (accountId: string): Promise<{accountId:string;hasCampaign:boolean;canImportGuest?:boolean;profile:CloudProfile|null}> => json('/campaign',undefined,accountId);
const rewardKinds=['jet','flywheel','prism','tileBomb','freeSwap'];
export function rewardPayloadItems(payload:RewardPayload):{item:keyof Inventory;quantity:number}[]{
  const source=Array.isArray(payload.items)?payload.items:payload.item&&payload.quantity>0?[{item:payload.item,quantity:payload.quantity}]:[];
  const counts=new Map<keyof Inventory,number>();
  for(const entry of source)counts.set(entry.item,(counts.get(entry.item)??0)+entry.quantity);
  return [...counts].map(([item,quantity])=>({item,quantity}));
}
const validRewardPayload=(payload:RewardPayload|undefined)=>Boolean(payload && Number.isSafeInteger(payload.coins) && payload.coins>=0 && Number.isSafeInteger(payload.quantity) && payload.quantity>=0 && (payload.item===null || rewardKinds.includes(String(payload.item))) && (payload.items===undefined || Array.isArray(payload.items) && payload.items.length<=5 && payload.items.every(entry=>rewardKinds.includes(String(entry?.item)) && Number.isSafeInteger(entry.quantity) && entry.quantity>=1 && entry.quantity<=1_000_000)));
const validDailyVisit=(visit:DailyVisit|undefined)=>Boolean(visit && /^\d{4}-\d{2}-\d{2}$/.test(visit.day) && Number.isInteger(visit.cycleDay) && visit.cycleDay>=1 && visit.cycleDay<=5 && Number.isSafeInteger(visit.version) && validRewardPayload(visit.payload));
export const visitRewards=async(accountId:string):Promise<{catalogVersion:number;serverDay:string;nextResetAt:string;dailyVisit:DailyVisit}|null>=>{
  try{
    const value=await post('/rewards/visit',{},accountId);
    if(!Number.isSafeInteger(value?.catalogVersion)||typeof value.serverDay!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value.serverDay)||typeof value.nextResetAt!=='string'||!Number.isFinite(Date.parse(value.nextResetAt))||!validDailyVisit(value.dailyVisit))return null;
    return value;
  }catch(error){if(Number((error as {status?:number}).status)===404)return null;throw error;}
};
export const rewards = async (accountId:string):Promise<Rewards> => {
  const value=await json('/rewards',undefined,accountId) as Partial<Rewards>;
  const validAward=(award:RewardAward|undefined)=>Boolean(award && typeof award.key==='string' && Number.isSafeInteger(award.version) && validRewardPayload(award.payload) && typeof award.claimedAt==='string' && (award.presentedAt===null || typeof award.presentedAt==='string'));
  if(!Number.isSafeInteger(value.catalogVersion)||typeof value.serverDay!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value.serverDay)||typeof value.nextResetAt!=='string'||!Number.isFinite(Date.parse(value.nextResetAt))||value.dailyVisit!==undefined&&!validDailyVisit(value.dailyVisit)||!Array.isArray(value.rewards)||!Array.isArray(value.unpresented)||!value.rewards.every(item=>item && typeof item.key==='string' && typeof item.title==='string' && validRewardPayload(item.payload) && (item.cycleDay===undefined||Number.isInteger(item.cycleDay)&&item.cycleDay>=1&&item.cycleDay<=5) && ['available','locked','claimed-unpresented','claimed-presented'].includes(item.status) && (!item.award||validAward(item.award)))||!value.unpresented.every(validAward))throw new Error('Portal gifts are temporarily unavailable.');
  return value as Rewards;
};
export const claimReward = (requestId:string,rewardKey:string,accountId:string):Promise<{award:RewardAward;profile:CloudProfile}> => post('/rewards/claim',{requestId,rewardKey},accountId);
export const presentReward = (rewardKey:string,accountId:string):Promise<{award:RewardAward}> => post('/rewards/presented',{rewardKey},accountId);
function checkedEntitlement(value: unknown, accountId: string): FarmlandEntitlement {
  const result=value as Partial<FarmlandEntitlement>;
  const grant=result.farmland;
  if (result?.accountId!==accountId || typeof grant?.unlocked!=='boolean' || typeof grant?.eligible!=='boolean' || (grant.unlocked ? typeof grant.unlockedAt!=='string' || !Number.isFinite(Date.parse(grant.unlockedAt)) : grant.unlockedAt!==null)) throw new Error('Farmland status could not be verified. Try again.');
  return result as FarmlandEntitlement;
}
export const entitlements = async (accountId: string, refresh = false): Promise<AccountEntitlements> => {
  const result=checkedEntitlement(await json(`/entitlements${refresh ? '?refresh=1' : ''}`,undefined,accountId),accountId) as AccountEntitlements;
  const pass=result.campaignPass;
  if (!pass || !['active','locked','unavailable'].includes(pass.state) || typeof pass.unlocked!=='boolean' || pass.unlocked !== (pass.state==='active') || pass.unlockedAt!==null && (typeof pass.unlockedAt!=='string' || !Number.isFinite(Date.parse(pass.unlockedAt))) || pass.checkedAt!==null && (typeof pass.checkedAt!=='string' || !Number.isFinite(Date.parse(pass.checkedAt))) || pass.storeUrl!==null && (typeof pass.storeUrl!=='string' || !/^https:\/\//.test(pass.storeUrl) && !/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//.test(pass.storeUrl))) throw new Error('Dune Pass access could not be verified. Try again.');
  return result;
};
export const claimFarmland = async (requestId: string, accountId: string): Promise<FarmlandEntitlement> => checkedEntitlement(await post('/entitlements/farmland/claim',{requestId},accountId),accountId);
export const importGuest = (guestSave: Save, requestId: string, accountId: string,campaignGeneration=0): Promise<{profile:CloudProfile}> => post('/campaign/import',{requestId,guestSave,campaignGeneration},accountId);
export const prepareAttempt = (attemptId: string, levelId: LevelId, boosters: BoosterKind[], accountId: string, companionId?: CompanionId | null,campaignGeneration=0): Promise<{profile:CloudProfile;companionSnapshot:CompanionSnapshot|null;boosterFunding:{owned:BoosterKind[];purchased:BoosterKind[];coinCost:number}|null}> => post('/attempts',{attemptId,levelId,boosters,campaignGeneration,...(companionId ? { companionId } : {})},accountId);
export const activateAttempt = (attemptId: string, expectedRevision: number, accountId: string,campaignGeneration=0): Promise<{profile:CloudProfile;status:'active'|'finished'|'prepared';companionSnapshot:CompanionSnapshot|null}> => post(`/attempts/${attemptId}/activate`,{expectedRevision,campaignGeneration},accountId);
export const claimFieldToolkit = (requestId:string,accountId:string,campaignGeneration=0):Promise<{profile:CloudProfile;granted:boolean}> => post('/inventory/field-toolkit',{requestId,campaignGeneration},accountId);
export const purchaseTool = (requestId:string,kind:'tileBomb'|'freeSwap',expectedRevision:number,attemptId:string,accountId:string,campaignGeneration=0):Promise<{profile:CloudProfile;kind:string}> => post('/inventory/purchase',{requestId,kind,expectedRevision,attemptId,campaignGeneration},accountId);
export const consumeTool = (journal:ToolJournal):Promise<{profile:CloudProfile;toolSequence:number}> => post(`/attempts/${journal.attemptId}/tools`,{requestId:journal.requestId,kind:journal.kind,expectedRevision:journal.expectedRevision,toolSequence:journal.toolSequence,stateFingerprint:journal.stateFingerprint,movesRemaining:journal.movesRemaining,campaignGeneration:journal.campaignGeneration??0},journal.accountId);
export const isDefiniteToolRejection = (error:unknown):boolean => [400,403,409].includes(Number((error as {status?:unknown})?.status));
export const finishAttempt = (op: Extract<CloudOperation,{kind:'finish'}>, accountId: string): Promise<{profile:CloudProfile;reward:number}> => post(`/attempts/${op.attemptId}/finish`,{levelId:op.levelId,remainingMoves:op.remainingMoves,contentVersion:op.contentVersion,campaignGeneration:op.campaignGeneration??0},accountId);
export const advanceCheckpoint = (op: Extract<CloudOperation,{kind:'checkpoint'}>, expectedRevision: number, accountId: string): Promise<{profile:CloudProfile}> => post('/campaign/checkpoint',{requestId:op.requestId,campaign:op.campaign,expectedRevision,campaignGeneration:op.campaignGeneration??0},accountId);
export const resetCampaign=(journal:ResetJournal):Promise<{profile:CloudProfile;campaignGeneration:number}>=>post('/campaign/reset',{requestId:journal.requestId,expectedRevision:journal.expectedRevision,campaignGeneration:journal.campaignGeneration},journal.accountId);
export const cancelReset=(journal:ResetJournal):Promise<{status:'cancelled'|'applied';profile:CloudProfile;campaignGeneration:number}>=>post('/campaign/reset/cancel',{requestId:journal.requestId,expectedRevision:journal.expectedRevision,campaignGeneration:journal.campaignGeneration},journal.accountId);
export const isResetConflict=(error:unknown)=>((error as {code?:string})?.code==='CAMPAIGN_RESET');
export const logout = (accountId: string): Promise<void> => post('/logout',{},accountId).then(()=>undefined);
export function readAccountCache(id: string): CloudCache | null {
  const key=safeAccount(id); if (!key) return null;
  try { const value=JSON.parse(localStorage.getItem(cacheKey(key))??'null'); return value?.profile?.campaign?.version===5 && Array.isArray(value.pending) ? value : null; } catch { return null; }
}
export function writeAccountCache(id: string,value:CloudCache): boolean {
  const key=safeAccount(id); if (!key) return false;
  try { localStorage.setItem(cacheKey(key),JSON.stringify(value)); return true; } catch { return false; }
}
export function newOperationId() { return crypto.randomUUID(); }
export function guestImportId(accountId: string): string {
  const key=`dune-relay-import-${accountId}-v1`;
  try {
    const existing=localStorage.getItem(key);
    if (existing && /^[0-9a-f-]{36}$/i.test(existing)) return existing;
    const created=newOperationId(); localStorage.setItem(key,created); return created;
  } catch { return newOperationId(); }
}
export function clearGuestImportId(accountId: string): void {
  try { localStorage.removeItem(`dune-relay-import-${accountId}-v1`); } catch { /* Storage may be unavailable. */ }
}
export const contentVersion = 'chapter-7-4';
