import type { Save } from './save';
import type { BoosterKind } from './boosters';
import type { LevelId } from './levels';
import type { CompanionId } from './save';
import type { CompanionSnapshot } from './companionAbilities';

const BASE = '/leaderboard-api/dune-relay';
export const PORTAL_LOGIN_URL = '/leaderboard-api/dune-relay/login';
export type CloudProfile = { revision: number; campaign: Save; imported: boolean };
export type CloudSession = { accountId: string; displayName: string; contentVersion: string };
export type FarmlandEntitlement = { accountId: string; farmland: { unlocked: boolean; eligible: boolean; unlockedAt: string | null } };
export type CampaignPass = { state: 'active' | 'locked' | 'unavailable'; unlocked: boolean; unlockedAt: string | null; checkedAt: string | null; storeUrl: string | null };
export type AccountEntitlements = FarmlandEntitlement & { campaignPass: CampaignPass };
export type CloudOperation =
  | { kind: 'finish'; attemptId: string; levelId: LevelId; remainingMoves: number; contentVersion: string }
  | { kind: 'checkpoint'; requestId: string; campaign: Save };
export type CloudCache = { profile: CloudProfile; localSave: Save; pending: CloudOperation[]; purchase?: { attemptId: string; levelId: LevelId; boosters: BoosterKind[]; companionSnapshot?: CompanionSnapshot | null } };
const safeAccount = (id: string) => /^\d+$/.test(id) ? id : null;
const cacheKey = (id: string) => `dune-relay-cloud-${id}-v1`;
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
  let response: Response;
  try { response = await fetch(`${BASE}${path}`, { credentials:'same-origin', cache:'no-store', ...init, signal:controller.signal, headers:{ ...(init?.body ? { 'Content-Type':'application/json' } : {}), ...(accountId ? { 'X-Dune-Account-ID':accountId } : {}), ...(init?.headers ?? {}) } }); }
  finally { clearTimeout(timer); }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw Object.assign(new Error(typeof body.message === 'string' ? body.message : `Cloud request failed (${response.status})`), { status:response.status });
  return body;
};
const post = (path: string, body: unknown, accountId: string) => json(path, { method:'POST',body:JSON.stringify(body) },accountId);
export const session = (): Promise<CloudSession> => json('/session');
export const campaign = (accountId: string): Promise<{accountId:string;hasCampaign:boolean;profile:CloudProfile|null}> => json('/campaign',undefined,accountId);
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
export const importGuest = (guestSave: Save, requestId: string, accountId: string): Promise<{profile:CloudProfile}> => post('/campaign/import',{requestId,guestSave},accountId);
export const prepareAttempt = (attemptId: string, levelId: LevelId, boosters: BoosterKind[], accountId: string, companionId?: CompanionId | null): Promise<{profile:CloudProfile;companionSnapshot:CompanionSnapshot|null}> => post('/attempts',{attemptId,levelId,boosters,...(companionId ? { companionId } : {})},accountId);
export const activateAttempt = (attemptId: string, expectedRevision: number, accountId: string): Promise<{profile:CloudProfile;status:'active'|'finished'|'prepared';companionSnapshot:CompanionSnapshot|null}> => post(`/attempts/${attemptId}/activate`,{expectedRevision},accountId);
export const finishAttempt = (op: Extract<CloudOperation,{kind:'finish'}>, accountId: string): Promise<{profile:CloudProfile;reward:number}> => post(`/attempts/${op.attemptId}/finish`,{levelId:op.levelId,remainingMoves:op.remainingMoves,contentVersion:op.contentVersion},accountId);
export const advanceCheckpoint = (op: Extract<CloudOperation,{kind:'checkpoint'}>, expectedRevision: number, accountId: string): Promise<{profile:CloudProfile}> => post('/campaign/checkpoint',{requestId:op.requestId,campaign:op.campaign,expectedRevision},accountId);
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
export const contentVersion = 'chapter-6-1';
