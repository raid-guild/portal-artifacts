export const MINE_HOLD_MS = 500;
export const GESTURE_MOVE_PX = 15;

export function createMineGesture() {
  let pointer = null;
  return {
    begin(id, x, y, at, eligible) {
      if (pointer) return false;
      pointer = { id, x, y, at, eligible, moved: false, held: false };
      return true;
    },
    move(id, x, y) {
      if (!pointer || pointer.id !== id) return false;
      if (Math.hypot(x - pointer.x, y - pointer.y) > GESTURE_MOVE_PX) pointer.moved = true;
      return pointer.moved;
    },
    hold(id, at) {
      if (!pointer || pointer.id !== id || pointer.moved || !pointer.eligible || pointer.held || at - pointer.at < MINE_HOLD_MS) return false;
      pointer.held = true;
      return true;
    },
    end(id, x, y, at) {
      if (!pointer || pointer.id !== id) return 'none';
      this.move(id, x, y);
      const finished = pointer; pointer = null;
      if (finished.moved) return 'none';
      if (finished.held || at - finished.at >= MINE_HOLD_MS) return 'hold';
      return 'tap';
    },
    cancel() { pointer = null; },
    get active() { return !!pointer; },
  };
}
