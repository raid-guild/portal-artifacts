type SoundName = "shot" | "hit" | "destroy" | "breach" | "wave" | "game-over";

const STORAGE_KEY = "cosmic-carnival-muted";

export class Synth {
  private context: AudioContext | null = null;
  private muted = false;

  constructor() {
    try {
      this.muted = localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      this.muted = false;
    }
  }

  get isMuted(): boolean {
    return this.muted;
  }

  async unlock(): Promise<void> {
    if (!this.context) this.context = new AudioContext();
    if (this.context.state === "suspended") await this.context.resume();
  }

  toggle(): boolean {
    this.muted = !this.muted;
    try {
      localStorage.setItem(STORAGE_KEY, String(this.muted));
    } catch {
      // Private browsing may reject storage; mute still works for this session.
    }
    return this.muted;
  }

  play(name: SoundName): void {
    if (this.muted || !this.context) return;
    const ctx = this.context;
    const now = ctx.currentTime;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.connect(gain).connect(ctx.destination);

    const settings: Record<SoundName, [OscillatorType, number, number, number]> = {
      shot: ["square", 620, 280, 0.07],
      hit: ["sawtooth", 180, 90, 0.09],
      destroy: ["triangle", 360, 95, 0.18],
      breach: ["sawtooth", 105, 42, 0.38],
      wave: ["triangle", 260, 760, 0.42],
      "game-over": ["square", 190, 38, 0.7],
    };
    const [type, from, to, duration] = settings[name];
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(from, now);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, to), now + duration);
    gain.gain.setValueAtTime(0.055, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.start(now);
    oscillator.stop(now + duration);
  }
}
