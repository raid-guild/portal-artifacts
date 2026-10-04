export type GraphicsMode = 'auto' | 'performance' | 'full';
export function graphicsMode(value: string | null): GraphicsMode {
  return value === 'performance' || value === 'full' ? value : 'auto';
}
export function graphicsProfile(mode: GraphicsMode, coarsePointer: boolean, deviceRatio: number) {
  const lean = mode === 'performance' || (mode === 'auto' && coarsePointer);
  const ratio = Number.isFinite(deviceRatio) && deviceRatio > 0 ? deviceRatio : 1;
  return { lean, webglRatio: Math.min(ratio, lean ? 1 : 1.7), effectsRatio: Math.min(ratio, lean ? 1 : 2) };
}

/** Presentation cadence only: simulation keeps its independent fixed-step clock. */
export class RenderCadence {
  private carry = 0;
  private elapsed = 0;
  reset() { this.carry = this.elapsed = 0; }
  advance(dt: number): number | null {
    this.carry += dt; this.elapsed += dt;
    const period = 1 / 60;
    // Browser RAF timestamps commonly alternate just below/above 16.67 ms.
    // Allow a small early draw and retain its negative remainder so the next
    // callback pays back the borrowed time without falling to 30 FPS.
    if (this.carry < period - .00125) return null;
    this.carry = this.carry >= period * 2 ? this.carry % period : this.carry - period;
    const elapsed = this.elapsed; this.elapsed = 0;
    return elapsed;
  }
}

type UploadAttribute = { clearUpdateRanges(): void; addUpdateRange(start: number, count: number): void; needsUpdate: boolean };
/** Only the visible prefix is drawn or transferred; capacity stays available for the full horde. */
export function uploadVisibleInstances(mesh: { count: number; instanceMatrix: UploadAttribute; instanceColor: UploadAttribute | null }, count: number) {
  mesh.count = count;
  mesh.instanceMatrix.clearUpdateRanges();
  mesh.instanceColor?.clearUpdateRanges();
  if (!count) return;
  mesh.instanceMatrix.addUpdateRange(0, count * 16); mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) { mesh.instanceColor.addUpdateRange(0, count * 3); mesh.instanceColor.needsUpdate = true; }
}
