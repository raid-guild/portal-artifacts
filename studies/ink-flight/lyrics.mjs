export function validateCues(data) {
  if (!data || !Array.isArray(data.cues)) throw new Error('Expected an object with a cues array.');
  let previousEnd = 0;
  return data.cues.map((cue, index) => {
    if (!cue || typeof cue !== 'object' ||
        typeof cue.start !== 'number' || !Number.isFinite(cue.start) || cue.start < 0 ||
        typeof cue.end !== 'number' || !Number.isFinite(cue.end) || cue.end <= cue.start ||
        typeof cue.text !== 'string' || !cue.text.trim()) {
      throw new Error(`Cue ${index + 1} needs finite start/end seconds and nonempty text.`);
    }
    if (cue.start < previousEnd) throw new Error(`Cue ${index + 1} overlaps or is out of order.`);
    previousEnd = cue.end;
    return {start: cue.start, end: cue.end, text: cue.text.trim()};
  });
}

export function activeCue(cues, seconds) {
  if (!Number.isFinite(seconds)) return null;
  let low = 0, high = cues.length;
  while (low < high) {
    const mid = (low + high) >>> 1;
    if (cues[mid].start <= seconds) low = mid + 1;
    else high = mid;
  }
  const cue = cues[low - 1];
  return cue && seconds < cue.end && seconds >= cue.start ? cue : null;
}

export function canInstallBundledLyrics(sourceGeneration, customApplied, editorOpen, editorDirty) {
  return sourceGeneration === 0 && !customApplied && !editorOpen && !editorDirty;
}
