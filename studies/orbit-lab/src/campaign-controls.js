export function resolvePlayControls({ campaignMode, editorPlaytest, settings, strength, lifetime, mode, heroGravity }) {
  if (campaignMode && !editorPlaytest) return {
    strength: settings.wellStrength, lifetime: settings.wellLifetime,
    mode: 'fade', heroGravity: 0,
  };
  return { strength, lifetime, mode, heroGravity };
}
