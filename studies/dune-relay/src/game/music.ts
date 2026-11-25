import type { SoundtrackId } from "./soundtracks";

export const MUSIC_STEPS_PER_CYCLE = 128;

export type MusicNote = { midi: number; duration: number; gain: number; wave: OscillatorType };

// Sixteen bars of eight eighth-note steps. The same score drives game playback and exports.
export const arrangements: Record<SoundtrackId, { bpm: number; roots: number[]; melody: (number | null)[]; wave: OscillatorType }> = {
  oasis: { bpm: 83, roots: [48, 53, 45, 55, 48, 57, 53, 55, 48, 53, 45, 55, 57, 53, 55, 48],
    melody: [72, null, 76, null, 79, null, 76, null, 74, null, 72, null, 69, null, null, null, 72, null, 76, 79, null, 81, 79, null, 76, null, 74, null, 72, null, null, null], wave: "triangle" },
  caravan: { bpm: 97, roots: [43, 46, 41, 43, 43, 48, 46, 41, 43, 46, 41, 43, 48, 46, 41, 43],
    melody: [null, null, 67, null, null, 70, null, null, 72, null, 70, null, null, null, null, null, null, null, 67, null, 70, null, 74, null, null, 72, null, 70, null, null, null, null], wave: "sawtooth" },
  gatehouse: { bpm: 87, roots: [50, 55, 47, 52, 50, 57, 55, 47, 50, 55, 47, 52, 57, 55, 47, 50],
    melody: [74, null, 78, null, 81, null, 78, null, 76, null, 74, null, 71, null, null, null, 74, null, 78, 81, null, 83, null, 81, 78, null, 76, null, 74, null, null, null], wave: "sine" },
  town: { bpm: 90, roots: [50, 55, 53, 57, 50, 58, 55, 53, 50, 55, 53, 57, 58, 55, 53, 50], melody: [74, null, 77, null, 79, 81, 79, null, 77, null, 74, null, 72, null, null, null, 74, null, 77, 79, null, 81, null, 79, 77, null, 74, null, 72, null, null, null], wave: "triangle" },
  castle: { bpm: 85, roots: [48, 55, 53, 50, 48, 57, 55, 53, 50, 55, 53, 48, 46, 53, 50, 48], melody: [72, null, 74, null, 77, null, 74, null, 72, null, 69, null, 67, null, 69, null, 72, null, 74, null, 79, null, 77, null, 74, null, 72, null, 69, null, 67, null], wave: "triangle" },
  river: { bpm: 94, roots: [50, 57, 53, 55, 50, 58, 55, 53, 50, 57, 53, 55, 58, 55, 53, 50], melody: [74, null, 77, null, 81, null, 79, null, 77, null, 74, null, 72, null, null, null, 74, null, 77, 79, null, 81, null, 79, 77, null, 74, null, 72, null, null, null], wave: "sine" },
  collection: { bpm: 98, roots: [50, 57, 53, 55, 50, 57, 58, 55, 53, 57, 55, 50, 53, 58, 55, 50], melody: [74, null, 79, null, 81, null, 79, 76, 77, null, 81, null, 84, null, 81, null, 79, null, 76, 74, null, 77, 79, null, 81, null, 79, 76, null, 74, null, null], wave: "sine" },
  farmland: { bpm: 92, roots: [48, 55, 52, 57, 50, 57, 53, 55, 48, 55, 52, 57, 53, 55, 50, 48],
    melody: [72, null, 76, 79, null, 76, 74, null, 69, null, 72, null, 74, 76, null, null, 72, 76, null, 79, 81, null, 79, 76, 74, null, 72, 69, 72, null, null, null], wave: "triangle" },
};

export function notesForMusicStep(id: SoundtrackId, index: number): MusicNote[] {
  const arrangement = arrangements[id];
  const step = ((index % MUSIC_STEPS_PER_CYCLE) + MUSIC_STEPS_PER_CYCLE) % MUSIC_STEPS_PER_CYCLE;
  const eighth = 30 / arrangement.bpm;
  const bar = Math.floor(step / 8);
  const beat = step % 8;
  const root = arrangement.roots[bar];
  const notes: MusicNote[] = [];
  if (beat === 0) {
    const chord = id === "caravan" ? [0, 7, 10] : [0, 7, 12];
    for (const offset of chord) notes.push({ midi: root + 12 + offset, duration: eighth * 6.7, gain: 0.05, wave: "sine" });
  }
  if (beat === 0 || beat === 4 && bar % 4 !== 3) {
    notes.push({ midi: root - 12, duration: eighth * (beat === 0 ? 2.7 : 1.6), gain: id === "caravan" ? 0.14 : 0.105, wave: "triangle" });
  }
  const melody = arrangement.melody[step % arrangement.melody.length];
  if (melody !== null && (bar % 4 !== 3 || beat < 4)) {
    const lift = bar >= 8 && bar < 12 ? 2 : bar >= 12 ? -2 : 0;
    notes.push({ midi: melody + lift, duration: eighth * (id === "gatehouse" ? 1.8 : 1.45), gain: id === "caravan" ? 0.045 : 0.085, wave: arrangement.wave });
  }
  if (beat === 4 && (bar % 2 === 0 || id === "gatehouse" || id === "collection")) {
    notes.push({ midi: id === "gatehouse" ? 62 : id === "collection" ? 67 : 55, duration: 0.09, gain: 0.035, wave: "triangle" });
  }
  return notes;
}

export function scheduleMusicVoice(context: BaseAudioContext, destination: AudioNode, note: MusicNote, at: number) {
  const oscillator = context.createOscillator();
  const envelope = context.createGain();
  oscillator.type = note.wave;
  oscillator.frequency.setValueAtTime(440 * Math.pow(2, (note.midi - 69) / 12), at);
  const attack = note.wave === "sawtooth" ? 0.08 : 0.018;
  envelope.gain.setValueAtTime(0.0001, at);
  envelope.gain.linearRampToValueAtTime(note.gain, at + attack);
  envelope.gain.exponentialRampToValueAtTime(0.0001, at + note.duration);
  oscillator.connect(envelope).connect(destination);
  oscillator.start(at);
  oscillator.stop(at + note.duration + 0.02);
  return { oscillator, envelope };
}
