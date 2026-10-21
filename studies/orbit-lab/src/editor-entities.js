export function defaultCompanionEntity(id, x, y) {
  return { id, type: 'companion', x, y, radius: .16, captureRadius: 2.8 };
}

// Keep this in the same editor transaction as a motion or lethal edit.
export function clearIneligibleCompanionBurn(ember) {
  if (ember.type === 'ember' && (!ember.lethal || ember.motion !== 'fixed')) ember.burnsCompanions = false;
}
