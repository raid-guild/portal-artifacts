// A small input state machine. It knows nothing about Three.js or the DOM's
// pointer capture so the tap/hold/drag boundary can be tested independently.
export function createPointerGesture({
  onTap, onOrbit, onDragStart, onDragEnd,
  now = () => performance.now(),
  schedule = (callback, delay) => setTimeout(callback, delay),
  unschedule = (handle) => clearTimeout(handle),
  holdMs = 300
}) {
  let active = null;

  function beginDrag() {
    if (!active || active.dragging) return;
    active.dragging = true;
    if (active.timer !== null) unschedule(active.timer);
    active.timer = null;
    onDragStart?.();
  }
  function clear() {
    if (!active) return;
    if (active.timer !== null) unschedule(active.timer);
    const wasDragging = active.dragging;
    active = null;
    if (wasDragging) onDragEnd?.();
  }
  function matches(event) { return !!active && event.pointerId === active.id; }
  return {
    down(event) {
      if (active || event.isPrimary === false || event.button !== 0) return false;
      active = {
        id: event.pointerId, type: event.pointerType,
        x: event.clientX, y: event.clientY,
        lastX: event.clientX, lastY: event.clientY,
        began: now(), dragging: false, timer: null
      };
      active.timer = schedule(() => beginDrag(), holdMs);
      return true;
    },
    move(event) {
      if (!matches(event)) return false;
      const dx = event.clientX - active.lastX, dy = event.clientY - active.lastY;
      const distance = Math.hypot(event.clientX - active.x, event.clientY - active.y);
      const threshold = active.type === 'touch' ? 12 : 8;
      if (!active.dragging && (distance >= threshold || now() - active.began >= holdMs)) beginDrag();
      if (active.dragging && (dx || dy)) onOrbit?.(dx, dy);
      active.lastX = event.clientX; active.lastY = event.clientY;
      return true;
    },
    up(event) {
      if (!matches(event)) return false;
      this.move(event);
      const tap = !active.dragging && now() - active.began < holdMs;
      clear();
      if (tap) onTap?.(event);
      return true;
    },
    cancel(pointerId) {
      if (!active || (pointerId !== undefined && pointerId !== active.id)) return false;
      clear();return true;
    },
    get dragging() { return !!active?.dragging; },
    get pointerId() { return active?.id ?? null; }
  };
}
