import test from 'node:test';
import assert from 'node:assert/strict';
import { AUDIO_PREFERENCES_KEY, DEFAULT_AUDIO_PREFERENCES, loadAudioPreferences, saveAudioPreferences } from './audio-preferences.js';

test('audio choices are versioned, bounded, and keep a quiet music default', () => {
  const saved = new Map();
  const storage = { getItem: key => saved.get(key), setItem: (key, value) => saved.set(key, value) };
  assert.deepEqual(loadAudioPreferences(storage), DEFAULT_AUDIO_PREFERENCES);
  saveAudioPreferences(storage, { effectsEnabled: false, effectsVolume: .35, musicEnabled: true, musicVolume: .22, muted: true, showForecast: true });
  assert.deepEqual(loadAudioPreferences(storage), { effectsEnabled: false, effectsVolume: .35, musicEnabled: true, musicVolume: .22, muted: true, showForecast: true });
  saved.set(AUDIO_PREFERENCES_KEY, JSON.stringify({ version: 1, effectsVolume: 99, musicVolume: -4, muted: 'yes' }));
  assert.deepEqual(loadAudioPreferences(storage), DEFAULT_AUDIO_PREFERENCES);
  saved.set(AUDIO_PREFERENCES_KEY, JSON.stringify({ version: 2, effectsEnabled: false }));
  assert.deepEqual(loadAudioPreferences(storage), DEFAULT_AUDIO_PREFERENCES);
});

test('audio preferences tolerate blocked storage', () => {
  const storage = { getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); } };
  assert.deepEqual(loadAudioPreferences(storage), DEFAULT_AUDIO_PREFERENCES);
  assert.doesNotThrow(() => saveAudioPreferences(storage, DEFAULT_AUDIO_PREFERENCES));
});
