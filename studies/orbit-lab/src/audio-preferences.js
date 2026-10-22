export const AUDIO_PREFERENCES_KEY = 'orbit-lab-audio-v1';
export const DEFAULT_AUDIO_PREFERENCES = Object.freeze({
  effectsEnabled: true, effectsVolume: 1,
  musicEnabled: true, musicVolume: .15,
  muted: false, showForecast: false,
});

const bounded = (value, fallback) => Number.isFinite(value) && value >= 0 && value <= 1 ? value : fallback;
export function validateAudioPreferences(value) {
  const defaults = DEFAULT_AUDIO_PREFERENCES;
  if (!value || typeof value !== 'object' || Array.isArray(value) || value.version !== 1) return { ...defaults };
  return {
    effectsEnabled: typeof value.effectsEnabled === 'boolean' ? value.effectsEnabled : defaults.effectsEnabled,
    effectsVolume: bounded(value.effectsVolume, defaults.effectsVolume),
    musicEnabled: typeof value.musicEnabled === 'boolean' ? value.musicEnabled : defaults.musicEnabled,
    musicVolume: bounded(value.musicVolume, defaults.musicVolume),
    muted: typeof value.muted === 'boolean' ? value.muted : defaults.muted,
    showForecast: typeof value.showForecast === 'boolean' ? value.showForecast : defaults.showForecast,
  };
}
export function loadAudioPreferences(storage) {
  try { return validateAudioPreferences(JSON.parse(storage?.getItem(AUDIO_PREFERENCES_KEY) || 'null')); }
  catch { return { ...DEFAULT_AUDIO_PREFERENCES }; }
}
export function saveAudioPreferences(storage, preferences) {
  try { storage?.setItem(AUDIO_PREFERENCES_KEY, JSON.stringify({ version: 1, ...validateAudioPreferences({ version: 1, ...preferences }) })); }
  catch { /* Private or full browser storage is optional. */ }
}
