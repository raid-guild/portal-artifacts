// User-supplied full-song lyrics. Line timings are approximate and editable.
export const bundledCues = [
  {
    "start": 3.72,
    "end": 6.2,
    "text": "You and I"
  },
  {
    "start": 8.6,
    "end": 11.85,
    "text": "Can only kick it as far as we try"
  },
  {
    "start": 14.05,
    "end": 17.4,
    "text": "Everywhere they go"
  },
  {
    "start": 20.02,
    "end": 23.65,
    "text": "Everything that you stand for"
  },
  {
    "start": 25.1,
    "end": 29.55,
    "text": "Falls apart in your throat"
  },
  {
    "start": 30.45,
    "end": 35.5,
    "text": "Falls apart when you just don’t know"
  },
  {
    "start": 35.5,
    "end": 37.7,
    "text": "Where you are going"
  },
  {
    "start": 37.7,
    "end": 40.45,
    "text": "So let’s go far"
  },
  {
    "start": 41,
    "end": 43.28,
    "text": "Where you are going"
  },
  {
    "start": 43.28,
    "end": 46,
    "text": "so let’s go far"
  },
  {
    "start": 47,
    "end": 50.4,
    "text": "Are you already on rewind"
  },
  {
    "start": 51.36,
    "end": 55.7,
    "text": "Are you already on rewind"
  },
  {
    "start": 59.78,
    "end": 63,
    "text": "My hero’s crying in this house"
  },
  {
    "start": 63.36,
    "end": 67.15,
    "text": "Can’t be mad it’s just the way"
  },
  {
    "start": 67.34,
    "end": 69.75,
    "text": "just the way it is now"
  },
  {
    "start": 70.56,
    "end": 74.3,
    "text": "I will sink my teeth into the wall"
  },
  {
    "start": 75.35,
    "end": 77.7,
    "text": "Trying to figure out"
  },
  {
    "start": 77.7,
    "end": 81.2,
    "text": "where we all end up"
  },
  {
    "start": 81.2,
    "end": 85.55,
    "text": "I’m a walking sight to see"
  },
  {
    "start": 86.87,
    "end": 89.9,
    "text": "maybe a lost soldier"
  },
  {
    "start": 89.9,
    "end": 92.22,
    "text": "That never came home to breath"
  },
  {
    "start": 92.22,
    "end": 96.85,
    "text": "I will run my head into the wall"
  },
  {
    "start": 98.05,
    "end": 100.1,
    "text": "Trying to figure out"
  },
  {
    "start": 100.1,
    "end": 103.36,
    "text": "where we all went wrong"
  },
  {
    "start": 103.36,
    "end": 107.7,
    "text": "Are you already on rewind"
  },
  {
    "start": 109.12,
    "end": 113.4,
    "text": "Are you already on rewind"
  },
  {
    "start": 114.8,
    "end": 119,
    "text": "Are you already on rewind"
  },
  {
    "start": 120.4,
    "end": 124.8,
    "text": "Are you already on rewind"
  },
  {
    "start": 126,
    "end": 130.4,
    "text": "Are you already on rewind"
  },
  {
    "start": 131.6,
    "end": 137.3,
    "text": "Are you already on rewind"
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
