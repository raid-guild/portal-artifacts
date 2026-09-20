import data from './room-sprite-data.json';

const base = `${import.meta.env.BASE_URL}art/sprites/`;
export const toolsReady = new Image();
toolsReady.src = `${base}${data.tools.file}`;
let clipId = 0;

export function paintedItem(item: 'jack' | 'plate'): string {
  const frame = data.tools.frames[item === 'jack' ? 0 : 1];
  const [x, y, w, h] = frame.bounds;
  const id = `prop-clip-${++clipId}`;
  return `<svg class="painted-item" data-painted="${item}" viewBox="${x - 2} ${y - 2} ${w + 4} ${h + 4}" aria-hidden="true"><defs><clipPath id="${id}"><polygon points="${frame.clip.map(point => point.join(',')).join(' ')}"/></clipPath></defs><image clip-path="url(#${id})" href="${base}${data.tools.file}" width="${data.tools.width}" height="${data.tools.height}"/></svg>`;
}

export class RookSprite {
  readonly ready: Promise<void>;
  private image = new Image();
  private context: CanvasRenderingContext2D;
  private loaded = false;
  private frame = -1;
  constructor(private canvas: HTMLCanvasElement) {
    canvas.width = 480; canvas.height = 960;
    this.context = canvas.getContext('2d')!;
    this.image.src = `${base}${data.rook.file}`;
    this.ready = this.image.decode().then(() => { this.loaded = true; this.draw(0); });
  }
  draw(index: number) {
    if (!this.loaded || index === this.frame) return;
    this.frame = index;
    const frame = data.rook.frames[index];
    const [x, , width] = frame.bounds;
    const path = new Path2D();
    frame.clip.forEach(([px, py], i) => i ? path.lineTo(px, py) : path.moveTo(px, py));
    path.closePath();
    const ctx = this.context;
    ctx.clearRect(0, 0, 480, 960); ctx.save();
    ctx.translate(240, 945);
    const scale = 900 / data.rook.bodyHeight;
    ctx.scale(scale, scale);
    // Use a consistent boot anchor; working arms extend to the right of the body.
    ctx.translate(-(x + (index === 0 ? width * .5 : width * .43)), -frame.anchor[1]);
    ctx.clip(path); ctx.drawImage(this.image, 0, 0); ctx.restore();
    this.canvas.dataset.frame = String(index);
  }
}
