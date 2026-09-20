import spriteData from './sprite-data.json';

export type Facing = 'right' | 'left' | 'up' | 'down';
type AtlasName = 'right' | 'front' | 'back';
interface Frame { bounds: number[]; anchor: number[]; clip: number[][] }
interface Atlas { file: string; width: number; height: number; bodyHeight: number; frames: Frame[] }
const atlases: Record<AtlasName, Atlas> = spriteData;
const sources: Record<Facing, AtlasName> = { right: 'right', left: 'right', up: 'back', down: 'front' };
export const FRAME_MS = 110;

/** Compare actual scene distances, not percentages of differently sized axes. */
export function facingForDelta(dx: number, dy: number, previous: Facing = 'right'): Facing {
  if (Math.hypot(dx, dy) < .05) return previous;
  if (Math.abs(dx * 1672) >= Math.abs(dy * 941)) return dx < 0 ? 'left' : 'right';
  return dy < 0 ? 'up' : 'down';
}

export function walkingFrame(elapsedMs: number): number {
  return 1 + Math.floor(Math.max(0, elapsedMs) / FRAME_MS) % 6;
}

/** Draws measured poses from original atlases; source images are never modified. */
export class TravelerSprite {
  readonly ready: Promise<void>;
  facing: Facing = 'right';
  private walking = false;
  private startedAt = 0;
  private lastPose = '';
  private loaded = false;
  private readonly images = new Map<AtlasName, HTMLImageElement>();
  private readonly paths = new Map<Frame, Path2D>();
  private readonly context: CanvasRenderingContext2D;

  constructor(private readonly canvas: HTMLCanvasElement, assetBase: string) {
    const context = canvas.getContext('2d');
    if (!context) throw new Error('A 2D canvas is required to render the traveler.');
    this.context = context;
    canvas.width = 384; canvas.height = 576;
    for (const atlas of Object.values(atlases)) {
      for (const frame of atlas.frames) {
        const path = new Path2D();
        frame.clip.forEach(([x, y], index) => index ? path.lineTo(x, y) : path.moveTo(x, y));
        path.closePath(); this.paths.set(frame, path);
      }
    }
    this.ready = Promise.all((Object.keys(atlases) as AtlasName[]).map(async name => {
      const img = new Image(); img.src = assetBase + atlases[name].file;
      await img.decode();
      if (img.naturalWidth !== atlases[name].width || img.naturalHeight !== atlases[name].height) throw new Error(`Sprite metadata does not match ${name}`);
      this.images.set(name, img);
    })).then(() => { this.loaded = true; this.draw(performance.now()); });
  }

  walk(facing: Facing, now = performance.now()) {
    if (!this.walking) this.startedAt = now;
    this.walking = true; this.facing = facing; this.draw(now);
  }

  stand(facing: Facing = this.facing) {
    this.walking = false; this.facing = facing; this.draw(performance.now());
  }

  draw(now: number) {
    if (!this.loaded) return;
    const index = this.walking ? walkingFrame(now - this.startedAt) : 0;
    const pose = `${this.facing}:${index}`;
    if (pose === this.lastPose) return;
    this.lastPose = pose;
    const name = sources[this.facing];
    const atlas = atlases[name], frame = atlas.frames[index];
    const ctx = this.context;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.save();
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    ctx.translate(this.canvas.width / 2, this.canvas.height * .98);
    const scale = 530 / atlas.bodyHeight;
    ctx.scale(this.facing === 'left' ? -scale : scale, scale);
    ctx.translate(-frame.anchor[0], -frame.anchor[1]);
    ctx.clip(this.paths.get(frame)!);
    ctx.drawImage(this.images.get(name)!, 0, 0);
    ctx.restore();
    this.canvas.dataset.facing = this.facing;
    this.canvas.dataset.frame = String(index);
    this.canvas.dataset.animation = this.walking ? 'walk' : 'idle';
  }
}
