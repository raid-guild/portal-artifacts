// Asset loads can finish in either order. A deliberate choice always wins.
export function createCharacterSelection(preferred = 'vitalik', fallback = 'goatman') {
  const ready = new Set();
  const failed = new Set();
  let chosen = 'mannequin';
  let deliberate = false;

  function suggestion() {
    if (deliberate) return null;
    const candidate = ready.has(preferred) ? preferred : failed.has(preferred) && ready.has(fallback) ? fallback : null;
    if (!candidate || candidate === chosen) return null;
    chosen = candidate;
    return candidate;
  }

  return {
    get chosen() { return chosen; },
    get deliberate() { return deliberate; },
    loaded(id) { ready.add(id); failed.delete(id); return suggestion(); },
    loadFailed(id) { failed.add(id); return suggestion(); },
    choose(id) { chosen = id; deliberate = true; },
  };
}
