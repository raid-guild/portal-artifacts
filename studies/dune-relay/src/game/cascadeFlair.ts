import type Phaser from "phaser";

export type CascadeFlairTier = 0 | 1 | 2 | 3;
export type FlairPoint = { x: number; y: number };

const MAX_LIVE_PARTICLES = 48;
const PARTICLES_PER_WAVE = [0, 12, 20, 28] as const;
const SHAKE_PIXELS = [0, 1.5, 2.5, 3.5] as const;
const COLORS = [0xffd77d, 0x8ce2d3, 0xf3ad78, 0xffecb3] as const;

/** A wave is one actual clear step in a turn, including the first match. */
export function cascadeFlairTier(waves: number): CascadeFlairTier {
  if (waves < 2) return 0;
  if (waves < 4) return 1;
  if (waves < 6) return 2;
  return 3;
}

/** One word per move, on the third actual clear. Combo impacts alone do not count as waves. */
export function showCascadeWord(waves: number): boolean { return waves === 3; }

/** Board-local celebration. Its container should contain the board, but not the HUD. */
export class CascadeFlair {
  private readonly particles = new Map<Phaser.GameObjects.Arc, Phaser.Tweens.Tween>();
  private shake: Phaser.Tweens.Tween | null = null;
  private disposed = false;
  private paused = false;
  private readonly origin: FlairPoint;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly boardRoot: Phaser.GameObjects.Container,
    private readonly reducedMotion: boolean,
  ) {
    this.origin = { x: boardRoot.x, y: boardRoot.y };
    scene.events.once("shutdown", this.dispose, this);
    if (typeof document !== "undefined") document.addEventListener("visibilitychange", this.onVisibilityChange);
  }

  get liveCount(): number { return this.particles.size; }

  /** Starts an impact immediately; no turn-resolution wait is added. */
  play(waves: number, centers: readonly FlairPoint[], combo = false): CascadeFlairTier {
    const tier = Math.max(cascadeFlairTier(waves), combo ? 1 : 0) as CascadeFlairTier;
    if (!tier || this.disposed || !centers.length) return tier;

    if (!this.reducedMotion) this.startShake(tier);
    const room = MAX_LIVE_PARTICLES - this.particles.size;
    const count = Math.min(room, this.reducedMotion ? 4 : PARTICLES_PER_WAVE[tier]);
    for (let index = 0; index < count; index++) {
      // Sample across the cleared cells, even when a Prism makes a very large clear.
      const point = centers[Math.floor(index * centers.length / count)];
      const angle = (index * 2.39996 + waves * 0.72) % (Math.PI * 2);
      const distance = this.reducedMotion ? 0 : 11 + (index % 4) * 3 + tier * 2;
      const mote = this.scene.add.circle(point.x, point.y, this.reducedMotion ? 5 : 3 + (index % 3), COLORS[index % COLORS.length], 0.95);
      this.boardRoot.add(mote);
      const tween = this.scene.tweens.add({
        targets: mote,
        x: point.x + Math.cos(angle) * distance,
        y: point.y + Math.sin(angle) * distance,
        scale: this.reducedMotion ? 1.12 : 0.45,
        alpha: 0,
        duration: this.reducedMotion ? 140 : 250 + (index % 4) * 45,
        ease: "Cubic.easeOut",
        onComplete: () => { this.particles.delete(mote); mote.destroy(); },
      });
      this.particles.set(mote, tween);
      if (this.paused) tween.pause();
    }
    return tier;
  }

  private startShake(tier: Exclude<CascadeFlairTier, 0>): void {
    // One decaying shake at a time; the next impact replaces the previous one.
    this.shake?.remove();
    this.boardRoot.setPosition(this.origin.x, this.origin.y);
    const amplitude = SHAKE_PIXELS[tier];
    this.shake = this.scene.tweens.addCounter({
      from: 0,
      to: 1,
      duration: 150 + tier * 15,
      onUpdate: tween => {
        const progress = tween.getValue() ?? 1;
        const decay = (1 - progress) * amplitude;
        this.boardRoot.setPosition(
          this.origin.x + Math.sin(progress * Math.PI * 9) * decay,
          this.origin.y + Math.cos(progress * Math.PI * 7) * decay * 0.7,
        );
      },
      onComplete: () => { this.shake = null; this.boardRoot.setPosition(this.origin.x, this.origin.y); },
    });
    if (this.paused) this.shake.pause();
  }

  /** Allows the owner to pause the effect with its gameplay scene. */
  setPaused(paused: boolean): void {
    this.paused = paused;
    for (const tween of this.particles.values()) paused ? tween.pause() : tween.resume();
    if (this.shake) paused ? this.shake.pause() : this.shake.resume();
  }

  private readonly onVisibilityChange = (): void => {
    if (typeof document !== "undefined") this.setPaused(document.hidden);
  };

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.scene.events.off("shutdown", this.dispose, this);
    if (typeof document !== "undefined") document.removeEventListener("visibilitychange", this.onVisibilityChange);
    this.shake?.remove();
    this.shake = null;
    for (const [mote, tween] of this.particles) { tween.remove(); mote.destroy(); }
    this.particles.clear();
    this.boardRoot.setPosition(this.origin.x, this.origin.y);
  }
}
