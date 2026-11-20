export class CompanionPace {
  x: number;
  direction: "left" | "right" = "right";
  private idleMs = 0;
  private endMs = 0;
  private wasPlayerMoving = false;
  constructor(readonly home: number) { this.x = home; }
  update(delta: number, playerX: number, playerMoving: boolean, blocked: boolean, reducedMotion: boolean) {
    if (blocked || reducedMotion) {
      this.idleMs = 0;
      return { x: this.x, direction: playerX < this.x ? "left" as const : "right" as const, walking: false };
    }
    if (playerMoving) {
      this.wasPlayerMoving = true;
      this.idleMs = 0;
      return { x: this.x, direction: playerX < this.x ? "left" as const : "right" as const, walking: false };
    }
    if (this.wasPlayerMoving) { this.wasPlayerMoving = false; this.idleMs = 0; }
    this.idleMs += delta;
    if (this.idleMs < 1000) return { x: this.x, direction: playerX < this.x ? "left" as const : "right" as const, walking: false };
    if (this.endMs > 0) {
      this.endMs = Math.max(0, this.endMs - delta);
      return { x: this.x, direction: this.direction, walking: false };
    }
    this.x = Math.min(this.home + 18, Math.max(this.home - 18, this.x + (this.direction === "right" ? 1 : -1) * 0.008 * delta));
    if (this.x === this.home - 18 || this.x === this.home + 18) {
      this.direction = this.direction === "right" ? "left" : "right";
      this.endMs = 450;
    }
    return { x: this.x, direction: this.direction, walking: true };
  }
}

