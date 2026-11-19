/** Small local trail for reproducing device-specific scene and media failures. */
export const DIAGNOSTICS_KEY = 'dune-relay-diagnostics-v1';
export type Diagnostic = { at: string; event: string; details?: Record<string, string | number | boolean> };
const LIMIT = 80;
let memory: Diagnostic[] = [];
function storage(): Storage | null { try { return localStorage; } catch { return null; } }
export function diagnostics(): Diagnostic[] {
  const local = storage();
  try {
    const stored = JSON.parse(local?.getItem(DIAGNOSTICS_KEY) ?? 'null');
    if (Array.isArray(stored)) return stored.slice(-LIMIT);
  } catch { /* diagnostics stay in memory */ }
  return [...memory];
}
export function logDiagnostic(event: string, details?: Diagnostic['details']) {
  const entry: Diagnostic = { at: new Date().toISOString(), event, ...(details ? { details } : {}) };
  memory = [...diagnostics(), entry].slice(-LIMIT);
  try { storage()?.setItem(DIAGNOSTICS_KEY, JSON.stringify(memory)); } catch { /* guest storage can be unavailable */ }
}
export function diagnosticsJson(): string { return JSON.stringify({ schemaVersion: 1, entries: diagnostics() }, null, 2); }
