import type Phaser from "phaser";

export type CascadeFlairTier = 0 | 1 | 2 | 3;
export type FlairPoint = { x: number; y: number };

const MAX_LIVE_SPARKS = 48;
const MAX_LIVE_GLOWS = 2;
const SPARKS_BY_STRENGTH = [0, 20, 28, 36, 42, 48] as const;
const SHAKE_PIXELS = [0, 1.5, 2.5, 3.5] as const;
const COLORS = [0xffe6a3, 0xffffff, 0x87f2df, 0xffc878] as const;

/** A wave is one actual clear step in a turn, including the first match. */
export function cascadeFlairTier(waves: number): CascadeFlairTier {
  if (waves < 2) return 0;
  if (waves < 4) return 1;
  if (waves < 6) return 2;
  return 3;
}

/** Visual energy rises each wave, including waves within the same audio tier. */
export function cascadeVisualStrength(waves: number, combo = false): number {
  if (waves < 2) return combo ? 1 : 0;
  return Math.min(5, waves - 1);
}

/** One word per move, on the third actual clear. Combo impacts alone do not count as waves. */
export function showCascadeWord(waves: number): boolean { return waves === 3; }

/** Board-local celebration. Its container should contain the board, but not the HUD. */
export class CascadeFlair {
  private readonly sparks = new Map<Phaser.GameObjects.Graphics, Phaser.Tweens.Tween>();
  private readonly glows = new Map<Phaser.GameObjects.Container, Phaser.Tweens.Tween>();
  private readonly layer: Phaser.GameObjects.Container;
  private shake: Phaser.Tweens.Tween | null = null;
  private disposed = false;
  private externallyPaused = false;
  private paused = false;
  private readonly origin: FlairPoint;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly boardRoot: Phaser.GameObjects.Container,
    private readonly reducedMotion: boolean,
  ) {
    this.origin = { x: boardRoot.x, y: boardRoot.y };
    this.layer = scene.add.container(0, 0).setDepth(8);
    boardRoot.add(this.layer);
    scene.events.once("shutdown", this.dispose, this);
    if (typeof document !== "undefined") document.addEventListener("visibilitychange", this.onVisibilityChange);
  }

  get liveCount(): number { return this.sparks.size; }
  get glowCount(): number { return this.glows.size; }
  bringToFront(): void { if (!this.disposed) this.boardRoot.bringToTop(this.layer); }

  /** Starts an impact immediately; no turn-resolution wait is added. */
  play(waves: number, centers: readonly FlairPoint[], combo = false): CascadeFlairTier {
    const tier = Math.max(cascadeFlairTier(waves), combo ? 1 : 0) as CascadeFlairTier;
    const strength = cascadeVisualStrength(waves, combo);
    if (!strength || this.disposed || !centers.length) return tier;
    this.bringToFront();
    if (!this.reducedMotion) this.startShake(tier as Exclude<CascadeFlairTier, 0>);
    if (!this.reducedMotion) this.startGlow(centers, strength);
    const count = this.reducedMotion ? 4 : SPARKS_BY_STRENGTH[strength];
    // A later cascade must still be visible when earlier sparks have not finished.
    while (this.sparks.size + count > MAX_LIVE_SPARKS) {
      const oldest = this.sparks.keys().next().value;
      if (!oldest) break;
      this.retireSpark(oldest);
    }
    for (let index = 0; index < count; index++) {
      const point = centers[Math.floor(index * centers.length / count)];
      const angle = (index * 2.39996 + waves * 0.72) % (Math.PI * 2);
      const distance = this.reducedMotion ? 0 : 28 + strength * 5 + (index % 5) * 3;
      const color = COLORS[index % COLORS.length];
      const spark = this.scene.add.graphics({ x: point.x, y: point.y });
      const length = 5 + strength + index % 3;
      spark.fillStyle(color, 0.22).fillCircle(0, 0, length + 2);
      spark.lineStyle(index % 4 === 0 ? 3 : 2.1, color, 1);
      spark.lineBetween(-length, 0, length, 0);
      spark.lineBetween(0, -length, 0, length);
      spark.fillStyle(0xffffff, 1).fillCircle(0, 0, index % 3 === 0 ? 2.5 : 1.5);
      spark.setRotation(angle);
      this.layer.add(spark);
      const tween = this.scene.tweens.add({
        targets: spark,
        x: point.x + Math.cos(angle) * distance,
        y: point.y + Math.sin(angle) * distance,
        scale: this.reducedMotion ? 0.85 : 0.4,
        alpha: 0,
        duration: this.reducedMotion ? 180 : 400 + strength * 36 + (index % 4) * 15,
        ease: "Sine.easeIn",
        onComplete: () => { this.sparks.delete(spark); spark.destroy(); },
      });
      this.sparks.set(spark, tween);
      if (this.paused) tween.pause();
    }
    return tier;
  }

  private startGlow(centers: readonly FlairPoint[], strength: number): void {
    while (this.glows.size >= MAX_LIVE_GLOWS) {
      const oldest = this.glows.keys().next().value;
      if (!oldest) break;
      this.retireGlow(oldest);
    }
    const layer = this.scene.add.container(0, 0);
    const samples = Math.min(8, centers.length);
    for (let i = 0; i < samples; i++) {
      const p = centers[Math.floor(i * centers.length / samples)];
      const halo = this.scene.add.graphics({ x: p.x, y: p.y });
      halo.fillStyle(i % 2 ? 0x83e9dd : 0xffdc8e, 0.22 + strength * 0.038).fillCircle(0, 0, 13 + strength * 2);
      halo.lineStyle(2.5, i % 2 ? 0xa9fff1 : 0xffedbe, 0.94).strokeCircle(0, 0, 12 + strength);
      layer.add(halo);
    }
    this.layer.add(layer);
    const tween = this.scene.tweens.add({
      targets: layer.list, alpha: 0, scale: 1.35, duration: 410 + strength * 40, ease: "Sine.easeIn",
      onComplete: () => { this.glows.delete(layer); layer.destroy(); },
    });
    this.glows.set(layer, tween);
    if (this.paused) tween.pause();
  }

  private retireSpark(spark: Phaser.GameObjects.Graphics): void {
    this.sparks.get(spark)?.remove();
    this.sparks.delete(spark);
    spark.destroy();
  }
  private retireGlow(glow: Phaser.GameObjects.Container): void {
    this.glows.get(glow)?.remove();
    this.glows.delete(glow);
    glow.destroy();
  }

  private startShake(tier: Exclude<CascadeFlairTier, 0>): void {
    this.shake?.remove();
    this.boardRoot.setPosition(this.origin.x, this.origin.y);
    const amplitude = SHAKE_PIXELS[tier];
    this.shake = this.scene.tweens.addCounter({
      from: 0, to: 1, duration: 150 + tier * 15,
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

  /** External pause and tab visibility are independent so one cannot unpause the other. */
  setPaused(paused: boolean): void { this.externallyPaused = paused; this.syncPause(); }
  private syncPause(): void {
    const paused = this.externallyPaused || (typeof document !== "undefined" && document.hidden);
    if (this.paused === paused) return;
    this.paused = paused;
    for (const tween of this.sparks.values()) paused ? tween.pause() : tween.resume();
    for (const tween of this.glows.values()) paused ? tween.pause() : tween.resume();
    if (this.shake) paused ? this.shake.pause() : this.shake.resume();
  }
  private readonly onVisibilityChange = (): void => this.syncPause();

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.scene.events.off("shutdown", this.dispose, this);
    if (typeof document !== "undefined") document.removeEventListener("visibilitychange", this.onVisibilityChange);
    this.shake?.remove(); this.shake = null;
    for (const spark of [...this.sparks.keys()]) this.retireSpark(spark);
    for (const glow of [...this.glows.keys()]) this.retireGlow(glow);
    this.layer.destroy();
    this.boardRoot.setPosition(this.origin.x, this.origin.y);
  }
}
