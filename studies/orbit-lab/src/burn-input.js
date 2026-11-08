// Tracks physical presses independently so a Start, Resume, or Release press
// cannot turn into Burn until the user lets go and presses again.
export function createBurnInput() {
  const pressed = new Set();
  const burning = new Set();
  return {
    press(source, action) {
      if (pressed.has(source)) return null;
      pressed.add(source);
      if (action === 'burn') burning.add(source);
      return action;
    },
    release(source) { pressed.delete(source); burning.delete(source); },
    clear() { pressed.clear(); burning.clear(); },
    get active() { return burning.size > 0; },
    get sources() { return [...burning]; },
  };
}
