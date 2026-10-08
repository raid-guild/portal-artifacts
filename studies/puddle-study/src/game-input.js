// Pointer controls in a playable garden must begin after the arrival settles.
// Studies retain their existing free-running controls.
export function canStartControl(sim){
  return sim.selectedTest!=='garden'||sim.garden?.phase==='playing';
}
export function startPointerControl(sim,event,onStart){
  if(!canStartControl(sim))return false;
  onStart(event);return true;
}
