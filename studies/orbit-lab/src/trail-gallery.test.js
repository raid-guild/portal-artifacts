import test from 'node:test';
import assert from 'node:assert/strict';
import { createTrailGalleryStore, safeBrowserStorage, TRAIL_GALLERY_KEY, TRAIL_IMAGE_LIMIT, validateTrailRecord } from './trail-gallery.js';
const ids = [1, 2, 3];
const image = 'data:image/webp;base64,AAAA';
const record = (levelId, savedAt, outcome = 'complete') => ({ levelId, savedAt, outcome, seconds: 13.4, attempts: 2, wells: 5, gates: 7, image });
function memoryStore(fail = false) {
  const entries = new Map();
  return { getItem: key => entries.get(key) || null, setItem(key, value) { if (fail) throw new Error('quota'); entries.set(key, value); }, removeItem: key => entries.delete(key) };
}
test('blocked browser storage getters cannot prevent startup or in-memory saves', () => {
  const blocked = Object.defineProperties({}, {
    localStorage: { get() { throw new DOMException('Blocked', 'SecurityError'); } },
    sessionStorage: { get() { throw new DOMException('Blocked', 'SecurityError'); } },
  });
  const store = createTrailGalleryStore({ persistent: safeBrowserStorage(blocked, 'localStorage'), session: safeBrowserStorage(blocked, 'sessionStorage'), levelIds: ids });
  assert.deepEqual(store.all(), {});
  assert.equal(store.save(record(1, 1)).storage, 'memory');
  assert.deepEqual(store.get(1), record(1, 1));
  assert.equal(safeBrowserStorage({ sessionStorage: memoryStore() }, 'sessionStorage')?.getItem(TRAIL_GALLERY_KEY), null);
});
test('latest outcome replaces only its own level and preserves successful best score elsewhere', () => {
  const persistent = memoryStore(), session = memoryStore();
  const store = createTrailGalleryStore({ persistent, session, levelIds: ids });
  assert.deepEqual(store.all(), {});
  assert.equal(store.save(record(1, 1)).storage, 'local');
  store.save(record(2, 2));
  store.save(record(1, 3, 'lost'));
  const reopened = createTrailGalleryStore({ persistent, session, levelIds: ids });
  assert.equal(reopened.get(1).outcome, 'lost');
  assert.equal(reopened.get(2).outcome, 'complete');
  assert.equal(reopened.get(3), null);
  assert.equal(JSON.parse(persistent.getItem(TRAIL_GALLERY_KEY)).version, 1);
});
test('quota falls back to session and explains the state after reload', () => {
  const persistent = memoryStore(true), session = memoryStore();
  const store = createTrailGalleryStore({ persistent, session, levelIds: ids });
  assert.equal(store.save(record(1, 1)).storage, 'session');
  const reopened = createTrailGalleryStore({ persistent, session, levelIds: ids });
  assert.equal(reopened.storage, 'session');
  assert.deepEqual(reopened.get(1), record(1, 1));
  assert.equal(createTrailGalleryStore({ persistent, session: memoryStore(true), levelIds: ids }).save(record(2, 2)).storage, 'memory');
});
test('corrupt records, wrong ids and oversized or hostile images never reach the gallery', () => {
  assert.equal(validateTrailRecord({ ...record(1, 1), image: 'javascript:alert(1)' }, ids), null);
  assert.equal(validateTrailRecord({ ...record(1, 1), image: image.padEnd(TRAIL_IMAGE_LIMIT + 1, 'A') }, ids), null);
  assert.equal(validateTrailRecord(record(4, 1), ids), null);
  const persistent = memoryStore();
  persistent.setItem(TRAIL_GALLERY_KEY, JSON.stringify({ version: 1, records: { 1: record(2, 1), 2: record(2, 2), 3: { ...record(3, 3), wells: -1 } } }));
  const store = createTrailGalleryStore({ persistent, session: memoryStore(), levelIds: ids });
  assert.equal(store.get(1), null);
  assert.deepEqual(store.get(2), record(2, 2));
  assert.equal(store.get(3), null);
});
