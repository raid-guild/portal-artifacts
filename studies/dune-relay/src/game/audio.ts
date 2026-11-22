import type { Region } from "./save";
import type { SoundtrackId, TrackPreference } from "./soundtracks";

export type SoundCue = "ui" | "select" | "swap" | "invalid" | "clear" | "cascade" | "land" | "jet" | "flywheel" | "prism" | "keeper" | "coin" | "banner" | "win" | "lose" | "awning" | "salt" | "seedpod" | "crate";

const arrangements: Record<SoundtrackId, { bpm: number; roots: number[]; melody: (number | null)[]; wave: OscillatorType }> = {
  // Sixteen bars: each four-bar phrase changes the melody register and harmony.
  oasis: { bpm: 72, roots: [48, 53, 45, 55, 48, 57, 53, 55, 48, 53, 45, 55, 57, 53, 55, 48],
    melody: [72, null, 76, null, 79, null, 76, null, 74, null, 72, null, 69, null, null, null, 72, null, 76, 79, null, 81, 79, null, 76, null, 74, null, 72, null, null, null], wave: "triangle" },
  caravan: { bpm: 84, roots: [43, 46, 41, 43, 43, 48, 46, 41, 43, 46, 41, 43, 48, 46, 41, 43],
    melody: [null, null, 67, null, null, 70, null, null, 72, null, 70, null, null, null, null, null, null, null, 67, null, 70, null, 74, null, null, 72, null, 70, null, null, null, null], wave: "sawtooth" },
  gatehouse: { bpm: 76, roots: [50, 55, 47, 52, 50, 57, 55, 47, 50, 55, 47, 52, 57, 55, 47, 50],
    melody: [74, null, 78, null, 81, null, 78, null, 76, null, 74, null, 71, null, null, null, 74, null, 78, 81, null, 83, null, 81, 78, null, 76, null, 74, null, null, null], wave: "sine" },
  town: { bpm: 78, roots: [50, 55, 53, 57, 50, 58, 55, 53, 50, 55, 53, 57, 58, 55, 53, 50], melody: [74, null, 77, null, 79, 81, 79, null, 77, null, 74, null, 72, null, null, null, 74, null, 77, 79, null, 81, null, 79, 77, null, 74, null, 72, null, null, null], wave: "triangle" },
  castle: { bpm: 74, roots: [48, 55, 53, 50, 48, 57, 55, 53, 50, 55, 53, 48, 46, 53, 50, 48], melody: [72, null, 74, null, 77, null, 74, null, 72, null, 69, null, 67, null, 69, null, 72, null, 74, null, 79, null, 77, null, 74, null, 72, null, 69, null, 67, null], wave: "triangle" },
  farmland: { bpm: 80, roots: [48, 55, 52, 57, 50, 57, 53, 55, 48, 55, 52, 57, 53, 55, 50, 48],
    melody: [72, null, 76, 79, null, 76, 74, null, 69, null, 72, null, 74, 76, null, null, 72, 76, null, 79, 81, null, 79, 76, 74, null, 72, 69, 72, null, null, null], wave: "triangle" },
};
const noteHz = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);
type Voice = { source: OscillatorNode | AudioBufferSourceNode; nodes: AudioNode[] };
type MusicRun = { id: SoundtrackId; gain: GainNode; nextAt: number; step: number };

// One small Web Audio instrument for the whole game. Nothing starts until a gesture unlocks it.
export class GameAudio {
  private context?: AudioContext;
  private sfx?: GainNode;
  private ambience?: GainNode;
  private music?: GainNode;
  private ambientSource?: AudioBufferSourceNode;
  private ambientFilter?: BiquadFilterNode;
  private riverGain?: GainNode;
  private riverLfo?: OscillatorNode;
  private riverLfoGain?: GainNode;
  private machinery?: OscillatorNode;
  private machineryGain?: GainNode;
  private currentRun?: MusicRun;
  private fadingRuns = new Set<MusicRun>();
  private musicVoices = new Set<Voice>();
  private sfxVoices = new Set<Voice>();
  private scheduler?: ReturnType<typeof setInterval>;
  private fadeTimer?: ReturnType<typeof setTimeout>;
  private region: Region = "oasis";
  private track: TrackPreference = "auto";
  private cinematic = false;
  private disposed = false;
  private noiseBuffer?: AudioBuffer;
  private voices = 0;
  private last = new Map<SoundCue, number>();
  private hidden = false;
  muted = false;
  sfxVolume = 0.7;
  ambienceVolume = 0.22;
  musicVolume = 0.25;

  constructor() {
    if (typeof document !== "undefined") {
      this.hidden = document.hidden;
      document.addEventListener("visibilitychange", this.visibility);
    }
  }

  private visibility = () => {
    if (this.disposed) return;
    this.hidden = document.hidden;
    if (this.hidden) {
      this.stopScheduler();
      this.stopAmbience();
      this.stopMusicVoices();
      const context = this.context;
      void context?.suspend().then(() => {
        // A quick hide/show can resolve suspend after resume; restore the visible tab.
        if (!this.disposed && !this.hidden && this.context === context) {
          void context.resume().then(() => this.refreshBackground(true)).catch(() => undefined);
        }
      }).catch(() => undefined);
    } else if (this.context) {
      const context = this.context;
      void context.resume().then(() => {
        if (this.disposed || this.hidden || this.context !== context) return;
        this.refreshBackground(true);
      }).catch(() => undefined);
    }
  };

  unlock() {
    if (typeof window === "undefined" || this.disposed) return;
    try {
      if (!this.context) {
        const context = new AudioContext();
        const sfx = context.createGain();
        const ambience = context.createGain();
        const music = context.createGain();
        sfx.connect(context.destination);
        ambience.connect(context.destination);
        music.connect(context.destination);
        this.context = context;
        this.sfx = sfx;
        this.ambience = ambience;
        this.music = music;
        this.createNoiseBuffer();
      }
      this.applyVolumes();
      if (!this.hidden) {
        const context = this.context;
        if (context.state === "running") {
          this.refreshBackground();
          return Promise.resolve();
        }
        return context.resume().then(() => {
          if (!this.disposed && !this.hidden && this.context === context) this.refreshBackground(true);
        }).catch(() => undefined);
      }
    } catch { /* Audio is optional when the browser blocks it. */ }
  }

  setLevels(muted: boolean, sfx: number, ambience: number, music = 0.25) {
    this.muted = muted;
    this.sfxVolume = Number.isFinite(sfx) ? Math.max(0, Math.min(1, sfx)) : 0.7;
    this.ambienceVolume = Number.isFinite(ambience) ? Math.max(0, Math.min(1, ambience)) : 0.22;
    this.musicVolume = Number.isFinite(music) ? Math.max(0, Math.min(1, music)) : 0.25;
    this.applyVolumes();
    this.refreshBackground();
  }

  setScene(region: Region, track: TrackPreference, cinematic: boolean) {
    this.region = region;
    this.track = track;
    this.cinematic = cinematic;
    this.applyVolumes();
    this.refreshBackground();
  }

  private applyVolumes() {
    const time = this.context?.currentTime ?? 0;
    this.sfx?.gain.setTargetAtTime(this.muted ? 0 : this.sfxVolume * 0.34, time, 0.025);
    const silent = this.muted || this.cinematic || this.hidden;
    this.ambience?.gain.setTargetAtTime(silent ? 0 : this.ambienceVolume * 0.12, time, 0.12);
    this.music?.gain.setTargetAtTime(silent ? 0 : this.musicVolume * 0.48, time, 0.12);
  }

  private createNoiseBuffer() {
    const context = this.context!;
    const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
    this.noiseBuffer = buffer;
  }

  private startAmbience() {
    if (this.ambientSource || !this.context || !this.ambience || !this.noiseBuffer) return;
    const context = this.context;
    const source = context.createBufferSource();
    source.buffer = this.noiseBuffer;
    source.loop = true;
    const filter = context.createBiquadFilter();
    filter.type = this.region === "gatehouse" ? "bandpass" : "lowpass";
    filter.frequency.value = this.region === "gatehouse" ? 620 : this.region === "caravan" ? 350 : 280;
    if (this.region === "gatehouse") {
      filter.Q.value = 0.45;
      const swell = context.createGain();
      swell.gain.value = 0.65;
      const lfo = context.createOscillator();
      const depth = context.createGain();
      lfo.frequency.value = 0.42;
      depth.gain.value = 0.2;
      lfo.connect(depth).connect(swell.gain);
      source.connect(filter).connect(swell).connect(this.ambience);
      lfo.start();
      this.riverGain = swell;
      this.riverLfo = lfo;
      this.riverLfoGain = depth;
    } else source.connect(filter).connect(this.ambience);
    source.start();
    this.ambientSource = source;
    this.ambientFilter = filter;
    if (this.region === "gatehouse") {
      const machine = context.createOscillator();
      const machineGain = context.createGain();
      machine.type = "sine";
      machine.frequency.value = 58;
      machineGain.gain.value = 0.055;
      machine.connect(machineGain).connect(this.ambience);
      machine.start();
      this.machinery = machine;
      this.machineryGain = machineGain;
    }
  }

  private stopAmbience() {
    try { this.ambientSource?.stop(); } catch {}
    try { this.machinery?.stop(); } catch {}
    try { this.riverLfo?.stop(); } catch {}
    this.ambientSource?.disconnect(); this.ambientFilter?.disconnect();
    this.riverGain?.disconnect(); this.riverLfo?.disconnect(); this.riverLfoGain?.disconnect();
    this.machinery?.disconnect(); this.machineryGain?.disconnect();
    this.ambientSource = undefined; this.ambientFilter = undefined;
    this.riverGain = undefined; this.riverLfo = undefined; this.riverLfoGain = undefined;
    this.machinery = undefined; this.machineryGain = undefined;
  }

  private refreshBackground(resuming = false) {
    const context = this.context;
    if (!context || this.disposed) return;
    const active = !this.hidden && !this.muted && !this.cinematic && context.state === "running";
    if (!active || this.ambienceVolume === 0) this.stopAmbience();
    else if (this.ambientSource && this.ambientFilter) {
      // The region owns ambience even when the player chooses a different soundtrack.
      const target = this.region === "gatehouse" ? 620 : this.region === "caravan" ? 350 : 280;
      this.ambientFilter.frequency.setTargetAtTime(target, context.currentTime, 0.25);
      if (this.region === "gatehouse" && !this.machinery) { this.stopAmbience(); this.startAmbience(); }
      if (this.region !== "gatehouse" && this.machinery) { this.stopAmbience(); this.startAmbience(); }
    } else this.startAmbience();

    if (!active || this.musicVolume === 0) {
      this.stopScheduler();
      this.stopMusicVoices();
      this.currentRun?.gain.gain.setTargetAtTime(0, context.currentTime, 0.08);
      return;
    }
    const id: SoundtrackId = this.track === "auto" ? this.region : this.track;
    if (this.currentRun?.id !== id) this.switchMusic(id);
    else {
      if (!this.scheduler) this.currentRun.gain.gain.setTargetAtTime(1, context.currentTime, 0.15);
      if (resuming) this.currentRun.nextAt = context.currentTime + 0.05;
    }
    this.startScheduler();
  }

  private switchMusic(id: SoundtrackId) {
    const context = this.context;
    if (!context || !this.music) return;
    const previous = this.currentRun;
    const at = context.currentTime;
    if (previous) {
      previous.gain.gain.cancelScheduledValues(at);
      previous.gain.gain.setValueAtTime(previous.gain.gain.value, at);
      previous.gain.gain.linearRampToValueAtTime(0, at + 0.75);
      this.fadingRuns.add(previous);
      if (this.fadeTimer) clearTimeout(this.fadeTimer);
      this.fadeTimer = setTimeout(() => {
        for (const run of this.fadingRuns) run.gain.disconnect();
        this.fadingRuns.clear();
        this.fadeTimer = undefined;
      }, 850);
    }
    const gain = context.createGain();
    gain.gain.setValueAtTime(0, at);
    gain.gain.linearRampToValueAtTime(1, at + 0.75);
    gain.connect(this.music);
    this.currentRun = { id, gain, nextAt: at + 0.06, step: 0 };
  }

  private startScheduler() {
    if (this.scheduler || !this.currentRun) return;
    this.scheduler = setInterval(() => this.scheduleMusic(), 90);
    this.scheduleMusic();
  }

  private stopScheduler() {
    if (this.scheduler) clearInterval(this.scheduler);
    this.scheduler = undefined;
  }

  private stopMusicVoices() {
    for (const voice of this.musicVoices) {
      try { voice.source.stop(); } catch {}
      for (const node of voice.nodes) node.disconnect();
    }
    this.musicVoices.clear();
  }

  private musicTone(run: MusicRun, midi: number, at: number, duration: number, loudness: number, type: OscillatorType) {
    const context = this.context;
    if (!context || this.musicVoices.size >= 32) return;
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(noteHz(midi), at);
    const attack = type === "sawtooth" ? 0.08 : 0.018;
    envelope.gain.setValueAtTime(0.0001, at);
    envelope.gain.linearRampToValueAtTime(loudness, at + attack);
    envelope.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    oscillator.connect(envelope).connect(run.gain);
    const voice: Voice = { source: oscillator, nodes: [oscillator, envelope] };
    this.musicVoices.add(voice);
    oscillator.onended = () => {
      this.musicVoices.delete(voice);
      oscillator.disconnect(); envelope.disconnect();
    };
    oscillator.start(at);
    oscillator.stop(at + duration + 0.02);
  }

  private scheduleMusic() {
    const context = this.context;
    const run = this.currentRun;
    if (!context || !run || context.state !== "running" || this.hidden || this.muted || this.cinematic || this.musicVolume === 0) return;
    const arrangement = arrangements[run.id];
    const eighth = 30 / arrangement.bpm;
    // Scheduling at most one eighth ahead prevents background catch-up bursts.
    if (run.nextAt < context.currentTime - eighth) run.nextAt = context.currentTime + 0.04;
    let scheduled = 0;
    while (run.nextAt < context.currentTime + 0.2 && scheduled++ < 3) {
      const step = run.step % 128;
      const bar = Math.floor(step / 8);
      const beat = step % 8;
      const at = Math.max(run.nextAt, context.currentTime + 0.005);
      const root = arrangement.roots[bar];
      if (beat === 0) {
        const chord = run.id === "caravan" ? [0, 7, 10] : [0, 7, 12];
        for (const offset of chord) this.musicTone(run, root + 12 + offset, at, eighth * 6.7, 0.05, "sine");
      }
      if (beat === 0 || beat === 4 && (bar % 4 !== 3)) {
        this.musicTone(run, root - 12, at, eighth * (beat === 0 ? 2.7 : 1.6), run.id === "caravan" ? 0.14 : 0.105, "triangle");
      }
      const melody = arrangement.melody[step % arrangement.melody.length];
      if (melody !== null && (bar % 4 !== 3 || beat < 4)) {
        const lift = bar >= 8 && bar < 12 ? 2 : bar >= 12 ? -2 : 0;
        this.musicTone(run, melody + lift, at, eighth * (run.id === "gatehouse" ? 1.8 : 1.45), run.id === "caravan" ? 0.045 : 0.085, arrangement.wave);
      }
      if (beat === 4 && (bar % 2 === 0 || run.id === "gatehouse")) {
        // Low, short rhythmic movement; the melody and harmony carry the piece.
        this.musicTone(run, run.id === "gatehouse" ? 62 : 55, at, 0.09, 0.035, "triangle");
      }
      run.step++;
      run.nextAt += eighth;
    }
  }

  stopTransientSounds() {
    for (const voice of this.sfxVoices) {
      try { voice.source.stop(); } catch {}
      for (const node of voice.nodes) node.disconnect();
    }
    this.sfxVoices.clear();
    this.voices = 0;
  }

  private tone(start: number, end: number, duration: number, gain: number, type: OscillatorType = "sine", delay = 0) {
    const context = this.context;
    if (!context || !this.sfx || this.voices >= 24) return;
    const at = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(Math.max(30, start), at);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(30, end), at + duration);
    envelope.gain.setValueAtTime(0.0001, at);
    envelope.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), at + Math.min(0.018, duration / 4));
    envelope.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    oscillator.connect(envelope).connect(this.sfx);
    this.voices++;
    const voice: Voice = { source: oscillator, nodes: [oscillator, envelope] };
    this.sfxVoices.add(voice);
    oscillator.onended = () => {
      this.sfxVoices.delete(voice);
      this.voices = Math.max(0, this.voices - 1);
      oscillator.disconnect(); envelope.disconnect();
    };
    oscillator.start(at);
    oscillator.stop(at + duration + 0.01);
  }

  private burst(frequency: number, duration: number, gain: number) {
    const context = this.context;
    if (!context || !this.sfx || !this.noiseBuffer || this.voices >= 24) return;
    const at = context.currentTime;
    const source = context.createBufferSource();
    source.buffer = this.noiseBuffer;
    const filter = context.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(frequency, at);
    filter.frequency.exponentialRampToValueAtTime(Math.max(80, frequency * 0.38), at + duration);
    filter.Q.value = 0.55;
    const envelope = context.createGain();
    envelope.gain.setValueAtTime(0.0001, at);
    envelope.gain.exponentialRampToValueAtTime(gain, at + 0.018);
    envelope.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    source.connect(filter).connect(envelope).connect(this.sfx);
    this.voices++;
    const voice: Voice = { source, nodes: [source, filter, envelope] };
    this.sfxVoices.add(voice);
    source.onended = () => {
      this.sfxVoices.delete(voice);
      this.voices = Math.max(0, this.voices - 1);
      source.disconnect(); filter.disconnect(); envelope.disconnect();
    };
    source.start(at);
    source.stop(at + duration + 0.01);
  }

  play(cue: SoundCue, variation = 0) {
    const context = this.context;
    if (!context || context.state !== "running" || this.hidden || this.muted) return;
    const now = context.currentTime;
    const interval = cue === "coin" ? 0.07 : cue === "land" ? 0.09 : cue === "clear" ? 0.055 : 0;
    if (now - (this.last.get(cue) ?? -1) < interval) return;
    this.last.set(cue, now);
    const lift = Math.min(variation, 8) * 35;
    switch (cue) {
      case "ui": this.tone(520, 750, 0.11, 0.11); break;
      case "select": this.tone(540, 670, 0.075, 0.08, "triangle"); break;
      case "swap": this.tone(360, 480, 0.13, 0.13, "triangle"); this.tone(730, 600, 0.11, 0.035, "sine", 0.035); break;
      case "invalid": this.tone(220, 130, 0.17, 0.16, "sawtooth"); break;
      case "clear": this.tone(390 + lift, 700 + lift, 0.17, 0.13, "triangle"); this.tone(900 + lift, 510 + lift, 0.1, 0.035); break;
      case "cascade": this.tone(620 + variation * 95, 880 + variation * 110, 0.16, 0.07, "sine"); break;
      case "land": this.tone(150, 82, 0.11, 0.1, "triangle"); this.burst(650, 0.07, 0.06); break;
      case "salt": this.burst(2100, 0.22, 0.13); this.tone(360, 115, 0.17, 0.09, "triangle"); break;
      case "crate": this.burst(700, 0.09, 0.05); this.tone(210, 115, 0.13, 0.1, "triangle"); this.tone(700, 940, 0.15, 0.04, "sine", 0.09); break;
      case "seedpod": this.burst(1300, 0.16, 0.09); this.tone(270, 520, 0.2, 0.07, "triangle"); break;
      case "jet": this.burst(2800, 0.36, 0.2); this.tone(190, 780, 0.25, 0.1, "sawtooth"); this.tone(330, 110, 0.32, 0.07, "triangle", 0.08); break;
      case "flywheel": this.tone(130, 480, 0.38, 0.1, "sawtooth"); this.burst(950, 0.27, 0.13); this.tone(270, 90, 0.3, 0.08, "triangle", 0.18); break;
      case "prism": [660, 830, 990, 1320].forEach((note, index) => this.tone(note, note * 1.4, 0.25, 0.055, "sine", index * 0.055)); break;
      case "keeper": [440, 554, 659, 880].forEach((note, index) => this.tone(note, note * 1.05, 0.24, 0.09, "sine", index * 0.075)); break;
      case "coin": this.tone(950 + lift, 1350 + lift, 0.12, 0.08, "sine"); break;
      case "banner": this.tone(300, 520, 0.18, 0.11, "triangle"); this.tone(630, 720, 0.13, 0.06, "sine", 0.09); break;
      case "win": [523, 659, 784, 1046].forEach((note, index) => this.tone(note, note * 1.02, 0.45, 0.1, "sine", index * 0.09)); break;
      case "lose": this.tone(320, 150, 0.35, 0.13, "triangle"); break;
      case "awning": this.burst(1800, 0.31, 0.14); this.tone(170, 115, 0.27, 0.055, "triangle"); this.tone(620, 780, 0.12, 0.035, "sine", 0.24); break;
    }
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    if (typeof document !== "undefined") document.removeEventListener("visibilitychange", this.visibility);
    this.stopScheduler();
    if (this.fadeTimer) clearTimeout(this.fadeTimer);
    this.fadeTimer = undefined;
    this.stopTransientSounds();
    this.stopMusicVoices();
    this.stopAmbience();
    this.currentRun?.gain.disconnect();
    this.currentRun = undefined;
    for (const run of this.fadingRuns) run.gain.disconnect();
    this.fadingRuns.clear();
    this.sfx?.disconnect(); this.ambience?.disconnect(); this.music?.disconnect();
    void this.context?.close().catch(() => undefined);
    this.context = undefined;
  }
}
