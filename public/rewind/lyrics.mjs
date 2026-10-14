// Provisional transcription of the supplied excerpt; bracketed words need review.
export const bundledCues = [
  {
    "start": 0,
    "end": 2.3,
    "text": "Can't be [mad?], it's just the way"
  },
  {
    "start": 2.4,
    "end": 5.05,
    "text": "Just the way it is now"
  },
  {
    "start": 5.35,
    "end": 9.8,
    "text": "I will sink [my teeth?] to the wall"
  },
  {
    "start": 10.99,
    "end": 13.0,
    "text": "Trying to figure out"
  },
  {
    "start": 13.0,
    "end": 16.6,
    "text": "Where we all end up"
  },
  {
    "start": 16.76,
    "end": 20.9,
    "text": "I'm a walking [sign?], [unclear] to see"
  },
  {
    "start": 22.17,
    "end": 25.2,
    "text": "Maybe [a lost soldier?] that"
  },
  {
    "start": 25.2,
    "end": 27.4,
    "text": "Never came home to breathe"
  },
  {
    "start": 27.4,
    "end": 32.1,
    "text": "I will run [my head?] to the wall"
  },
  {
    "start": 32.68,
    "end": 35.25,
    "text": "Trying to figure out"
  },
  {
    "start": 35.25,
    "end": 38.65,
    "text": "Where we all went wrong"
  },
  {
    "start": 38.65,
    "end": 41.5,
    "text": "Are you already on the road?"
  },
  {
    "start": 41.7,
    "end": 47.5,
    "text": "Are you already on the road?"
  }
];

export function validateCues(input, duration = Infinity) {
  const cues = Array.isArray(input) ? input : input?.cues;
  if (!Array.isArray(cues)) throw new Error('Use an array of cues, or an object with a cues array.');
  let previous = -1;
  return cues.map((cue, index) => {
    const { start, end, text } = cue || {};
    if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end <= start) {
      throw new Error(`Cue ${index + 1}: start and end must be increasing seconds.`);
    }
    if (start < previous) throw new Error(`Cue ${index + 1}: cues must be sorted by start time.`);
    if (end > duration + .05) throw new Error(`Cue ${index + 1}: end exceeds the audio duration.`);
    if (typeof text !== 'string' || !text.trim()) throw new Error(`Cue ${index + 1}: add lyric text.`);
    previous = start;
    return { start, end, text: text.trim() };
  });
}

export function activeCue(cues, seconds) {
  return cues.find(cue => seconds >= cue.start && seconds < cue.end) || null;
}
