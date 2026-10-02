import type { Vec } from './game';

const DEADZONE = 6;
const RADIUS = 40;

/** Hold a direction from the initial grab; camera/player motion cannot recenter it. */
export class TouchJoystick {
  id = -1;
  readonly direction: Vec = { x: 0, y: 0 };
  private origin = { x: 0, y: 0 };

  begin(id: number, x: number, y: number) {
    if (this.id >= 0) return false;
    this.id = id;
    this.origin = { x, y };
    this.direction.x = this.direction.y = 0;
    return true;
  }

  move(id: number, x: number, y: number) {
    if (id !== this.id || this.id < 0) return false;
    const dx = x - this.origin.x, dy = this.origin.y - y;
    const distance = Math.hypot(dx, dy);
    if (distance <= DEADZONE) {
      this.direction.x = this.direction.y = 0;
    } else {
      const scale = Math.min(1, (distance - DEADZONE) / (RADIUS - DEADZONE)) / distance;
      this.direction.x = dx * scale;
      this.direction.y = dy * scale;
    }
    return true;
  }

  end(id: number) { if (this.id !== id || this.id < 0) return false; this.reset(); return true; }
  reset() { this.id = -1; this.direction.x = this.direction.y = 0; }
}
