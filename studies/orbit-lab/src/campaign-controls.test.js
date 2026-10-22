import test from 'node:test';
import assert from 'node:assert/strict';
import { resolvePlayControls } from './campaign-controls.js';

test('official campaign uses authored physics even after experimental controls change', () => {
  const edited = { campaignMode: true, editorPlaytest: false, settings: { wellStrength: 64, wellLifetime: 6 }, strength: 180, lifetime: 16, mode: 'snap', heroGravity: 30 };
  assert.deepEqual(resolvePlayControls(edited), { strength: 64, lifetime: 6, mode: 'fade', heroGravity: 0 });
  assert.deepEqual(resolvePlayControls({ ...edited, editorPlaytest: true }), { strength: 180, lifetime: 16, mode: 'snap', heroGravity: 30 });
  assert.deepEqual(resolvePlayControls({ ...edited, campaignMode: false }), { strength: 180, lifetime: 16, mode: 'snap', heroGravity: 30 });
});
