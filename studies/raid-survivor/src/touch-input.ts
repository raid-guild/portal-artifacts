import { WORLD, type Vec } from './game';

const SLOP = 3;
const MAX_LEAD = 3;
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

/** A finger drags the hero relative to its starting point, independent of camera motion. */
export class TouchDrag {
  id = -1;
  target: Vec | null = null;
  private origin = { x: 0, y: 0 };
  private previous = { x: 0, y: 0 };
  private moving = false;

  begin(id: number, x: number, y: number, player: Vec) {
    if (this.id >= 0) return false;
    this.id = id;
    this.origin = { x, y };
    this.previous = { x, y };
    this.target = { x: player.x, y: player.y };
    this.moving = false;
    return true;
  }

  move(id: number, x: number, y: number, player: Vec, worldPerPixel: number) {
    if (id !== this.id || !this.target) return false;
    const fromOriginX = x - this.origin.x, fromOriginY = y - this.origin.y;
    const distance = Math.hypot(fromOriginX, fromOriginY);
    if (!this.moving) {
      if (distance <= SLOP) return true;
      this.moving = true;
      this.previous = { x: this.origin.x + fromOriginX / distance * SLOP, y: this.origin.y + fromOriginY / distance * SLOP };
    }
    const dx = (x - this.previous.x) * worldPerPixel;
    const dy = (this.previous.y - y) * worldPerPixel;
    this.previous = { x, y };
    const nextX = this.target.x + dx, nextY = this.target.y + dy;
    const leadX = nextX - player.x, leadY = nextY - player.y;
    const lead = Math.hypot(leadX, leadY);
    const factor = lead > MAX_LEAD ? MAX_LEAD / lead : 1;
    this.target.x = clamp(player.x + leadX * factor, 1, WORLD - 1);
    this.target.y = clamp(player.y + leadY * factor, 1, WORLD - 1);
    return true;
  }

  end(id: number) { if (this.id !== id) return false; this.reset(); return true; }
  reset() { this.id = -1; this.target = null; this.moving = false; }
  get activeTarget() { return this.moving ? this.target : null; }
}
