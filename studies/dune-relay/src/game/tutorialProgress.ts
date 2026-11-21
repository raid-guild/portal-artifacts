import { TUTORIALS, type TutorialId } from "./tutorials";
const VERSION = 1;
const PREFIX = "dune-relay-tutorials-v1";
const VALID = new Set<string>(TUTORIALS.map(t => t.id));
const memory = new Map<string, Set<TutorialId>>();
export type TutorialScope = { kind: "guest" | "account" | "sandbox"; accountId?: string };
export function tutorialScopeKey(scope: TutorialScope): string {
  if (scope.kind === "account") return `${PREFIX}:account:${encodeURIComponent(scope.accountId || "unknown")}`;
  return `${PREFIX}:${scope.kind}`;
}
export function readSeen(scope: TutorialScope, storage?: Pick<Storage,"getItem">): Set<TutorialId> {
  const key=tutorialScopeKey(scope);
  try {
    const parsed=JSON.parse((storage ?? localStorage).getItem(key) || "null");
    if (parsed?.version === VERSION && Array.isArray(parsed.seen)) {
      const found = new Set<TutorialId>([...parsed.seen.filter((id: unknown): id is TutorialId => typeof id === "string" && VALID.has(id)),...(memory.get(key) ?? [])]);
      memory.set(key,found); return found;
    }
  } catch { /* Private browsing or blocked storage; use session memory. */ }
  return new Set(memory.get(key) ?? []);
}
export function markSeen(scope: TutorialScope,id: TutorialId,storage?: Pick<Storage,"getItem"|"setItem">): void {
  if (!VALID.has(id)) return;
  const seen=readSeen(scope,storage); seen.add(id);
  const key=tutorialScopeKey(scope); memory.set(key,seen);
  try { (storage ?? localStorage).setItem(key,JSON.stringify({version:VERSION,seen:[...seen]})); } catch { /* Session memory remains authoritative. */ }
}
