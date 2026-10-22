// Only the latest finished campaign flight for each level is kept. The image
// comes from the same result canvas the player just saw, including moon trails.
export const TRAIL_GALLERY_KEY = 'orbit-lab-last-trails-v1';
export const TRAIL_IMAGE_LIMIT = 150_000;
const prefix = /^data:image\/(?:webp|png);base64,[A-Za-z0-9+/=]+$/;
const validCount = value => Number.isInteger(value) && value >= 0 && value <= 100_000;
const validTime = value => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 100_000;

export function safeBrowserStorage(scope, key) {
  try { return scope[key]; } catch { return undefined; }
}

export function validateTrailRecord(value, levelIds) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || !levelIds.includes(value.levelId)) return null;
  if (!['complete', 'lost'].includes(value.outcome) || !validTime(value.seconds) || !validCount(value.attempts) || !validCount(value.wells) || !Number.isInteger(value.gates) || value.gates < 0 || value.gates > 7) return null;
  if (typeof value.image !== 'string' || value.image.length > TRAIL_IMAGE_LIMIT || !prefix.test(value.image)) return null;
  if (!Number.isSafeInteger(value.savedAt) || value.savedAt < 0) return null;
  return { levelId: value.levelId, outcome: value.outcome, seconds: value.seconds, attempts: value.attempts, wells: value.wells, gates: value.gates, image: value.image, savedAt: value.savedAt };
}
function parseRecords(raw, ids) {
  if (!raw) return {};
  try {
    const data = JSON.parse(raw);
    if (data?.version !== 1 || !data.records || typeof data.records !== 'object' || Array.isArray(data.records)) return {};
    return Object.fromEntries(ids.flatMap(id => {
      const record = validateTrailRecord(data.records[id], ids);
      return record?.levelId === id ? [[id, record]] : [];
    }));
  } catch { return {}; }
}
export function createTrailGalleryStore({ persistent, session, levelIds }) {
  const read = storage => { try { return storage?.getItem(TRAIL_GALLERY_KEY); } catch { return null; } };
  const sessionRecords = parseRecords(read(session), levelIds);
  let records = sessionRecords;
  const saved = parseRecords(read(persistent), levelIds);
  for (const id of levelIds) if (saved[id] && (!records[id] || saved[id].savedAt > records[id].savedAt)) records[id] = saved[id];
  let storage = levelIds.some(id => sessionRecords[id] && sessionRecords[id].savedAt > (saved[id]?.savedAt ?? -1)) ? 'session' : 'local';
  return {
    get(id) { return records[id] || null; },
    all() { return { ...records }; },
    get storage() { return storage; },
    save(record) {
      const valid = validateTrailRecord(record, levelIds);
      if (!valid) return { ok: false, storage };
      records = { ...records, [valid.levelId]: valid };
      const raw = JSON.stringify({ version: 1, records });
      try {
        persistent.setItem(TRAIL_GALLERY_KEY, raw);
        storage = 'local';
        try { session?.removeItem(TRAIL_GALLERY_KEY); } catch {}
      } catch {
        try { session.setItem(TRAIL_GALLERY_KEY, raw); storage = 'session'; }
        catch { storage = 'memory'; }
      }
      return { ok: true, storage };
    },
  };
}
export function captureTrailImage(source) {
  try {
    const output = document.createElement('canvas');
    for (const [width, height, quality] of [[768, 432, .66], [640, 360, .49], [512, 288, .35], [384, 216, .3]]) {
      output.width = width; output.height = height;
      output.getContext('2d').drawImage(source, 0, 0, width, height);
      let image = output.toDataURL('image/webp', quality);
      if (!image.startsWith('data:image/webp;')) image = output.toDataURL('image/png');
      if (image.length <= TRAIL_IMAGE_LIMIT && prefix.test(image)) return image;
    }
  } catch { /* Storage or canvas access should never prevent the result screen. */ }
  return null;
}
