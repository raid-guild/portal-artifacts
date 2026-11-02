export const VERSION = 1;
export const STATUSES = ['not-started', 'in-progress', 'blocked', 'done'];
export const EMPTY = Object.freeze({ status: 'not-started', owner: '', notes: '' });
export const MAX_OWNER = 80;
export const MAX_NOTES = 1200;

export function validateSnapshot(input, ids) {
  if (!input || typeof input !== 'object' || Array.isArray(input) || input.version !== VERSION || !input.records || typeof input.records !== 'object' || Array.isArray(input.records)) throw new Error('Unsupported or malformed progress file.');
  if (Object.keys(input).some(k => !['version', 'savedAt', 'records'].includes(k))) throw new Error('Unexpected fields in progress file.');
  if (input.savedAt !== undefined && (typeof input.savedAt !== 'string' || input.savedAt.length > 40)) throw new Error('Invalid save date.');
  const records = {};
  for (const [id, value] of Object.entries(input.records)) {
    if (!ids.has(id)) throw new Error(`Unknown item: ${id.slice(0, 60)}`);
    if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).some(k => !['status', 'owner', 'notes'].includes(k)) || !STATUSES.includes(value.status) || typeof value.owner !== 'string' || value.owner.length > MAX_OWNER || typeof value.notes !== 'string' || value.notes.length > MAX_NOTES) throw new Error(`Invalid progress entry: ${id.slice(0, 60)}`);
    records[id] = { status: value.status, owner: value.owner, notes: value.notes };
  }
  return { version: VERSION, records };
}

export function makeSnapshot(records, ids, date = new Date().toISOString()) {
  const clean = validateSnapshot({ version: VERSION, records }, ids);
  return { ...clean, savedAt: date };
}

export function loadProgress(storage, key, ids) {
  try {
    const raw = storage.getItem(key);
    if (!raw) return { records: {}, persistent: true, warning: '' };
    return { records: validateSnapshot(JSON.parse(raw), ids).records, persistent: true, warning: '' };
  } catch {
    return { records: {}, persistent: false, warning: 'Saved progress could not be read. This session is temporary; export a copy before closing.' };
  }
}

export function persistProgress(storage, key, records, ids) {
  try {
    storage.setItem(key, JSON.stringify(makeSnapshot(records, ids)));
    return true;
  } catch { return false; }
}
