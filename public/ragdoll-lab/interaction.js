export function createTouchPolicy() {
  const pointers = new Set();
  let blocked = false;
  return {
    down(id) { pointers.add(id); if (pointers.size > 1) blocked = true; return !blocked && pointers.size === 1; },
    up(id) { pointers.delete(id); if (pointers.size === 0) blocked = false; },
    canGrab(id) { return !blocked && pointers.size === 1 && pointers.has(id); },
    get blocked() { return blocked; },
    reset() { pointers.clear(); blocked = false; }
  };
}

export function createFpsCounter(intervalMs = 500) {
  let enabled = false;
  let started = 0;
  let frames = 0;
  return {
    setEnabled(value, now) { enabled = Boolean(value); started = now; frames = 0; },
    reset(now) { started = now; frames = 0; },
    frame(now) {
      if (!enabled) return null;
      frames++;
      const elapsed = now - started;
      if (elapsed < intervalMs) return null;
      const fps = Math.round(frames * 1000 / elapsed);
      started = now;
      frames = 0;
      return fps;
    }
  };
}

export function clearOrbitInertia(controls) {
  const position = controls.object.position.clone();
  const target = controls.target.clone();
  const damping = controls.enableDamping;
  controls.enableDamping = false;
  controls.update();
  controls.enableDamping = damping;
  controls.object.position.copy(position);
  controls.target.copy(target);
  controls.update();
}
