export type SoundCue = "ui" | "select" | "swap" | "invalid" | "clear" | "land" | "jet" | "flywheel" | "prism" | "keeper" | "coin" | "banner" | "win" | "lose" | "awning" | "salt";

// One small Web Audio instrument for the whole game. Nothing starts until a gesture unlocks it.
export class GameAudio {
  private context?: AudioContext;
  private sfx?: GainNode;
  private ambience?: GainNode;
  private wind?: AudioBufferSourceNode;
  private windFilter?: BiquadFilterNode;
  private noiseBuffer?: AudioBuffer;
  private voices = 0;
  private last = new Map<SoundCue, number>();
  private hidden = false;
  muted = false;
  sfxVolume = 0.7;
  ambienceVolume = 0.22;

  constructor() {
    if (typeof document !== "undefined") {
      this.hidden = document.hidden;
      document.addEventListener("visibilitychange", this.visibility);
    }
  }

  private visibility = () => {
    this.hidden = document.hidden;
    if (this.hidden) void this.context?.suspend();
    else if (this.context) void this.context.resume().catch(() => undefined);
  };

  unlock() {
    if (typeof window === "undefined") return;
    try {
      if (!this.context) {
        const context = new AudioContext();
        const sfx = context.createGain();
        const ambience = context.createGain();
        sfx.connect(context.destination);
        ambience.connect(context.destination);
        this.context = context;
        this.sfx = sfx;
        this.ambience = ambience;
        this.startWind();
      }
      this.applyVolumes();
      if (!this.hidden) return this.context.resume().catch(() => undefined);
    } catch { /* Audio is optional when the browser blocks it. */ }
  }

  setLevels(muted: boolean, sfx: number, ambience: number) {
    this.muted = muted;
    this.sfxVolume = Math.max(0, Math.min(1, sfx));
    this.ambienceVolume = Math.max(0, Math.min(1, ambience));
    this.applyVolumes();
  }

  private applyVolumes() {
    const time = this.context?.currentTime ?? 0;
    this.sfx?.gain.setTargetAtTime(this.muted ? 0 : this.sfxVolume * 0.34, time, 0.025);
    this.ambience?.gain.setTargetAtTime(this.muted ? 0 : this.ambienceVolume * 0.12, time, 0.12);
  }

  private startWind() {
    const context = this.context!;
    const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
    this.noiseBuffer = buffer;
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 280;
    source.connect(filter).connect(this.ambience!);
    source.start();
    this.wind = source;
    this.windFilter = filter;
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
    oscillator.onended = () => { this.voices--; oscillator.disconnect(); envelope.disconnect(); };
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
    source.onended = () => { this.voices--; source.disconnect(); filter.disconnect(); envelope.disconnect(); };
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
      case "land": this.tone(150, 82, 0.11, 0.1, "triangle"); this.burst(650, 0.07, 0.06); break;
      case "salt": this.burst(2100, 0.22, 0.13); this.tone(360, 115, 0.17, 0.09, "triangle"); break;
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
    if (typeof document !== "undefined") document.removeEventListener("visibilitychange", this.visibility);
    try { this.wind?.stop(); } catch { /* Already stopped. */ }
    this.wind?.disconnect();
    this.windFilter?.disconnect();
    void this.context?.close().catch(() => undefined);
    this.context = undefined;
  }
}
