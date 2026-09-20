/** Ambient activity is presentation only. It never changes puzzle/save state. */
export interface NpcContext { active: boolean; attentive: boolean; settled: boolean; reducedMotion: boolean }
export type NpcMode = 'work' | 'attentive' | 'settled';
export function npcMode(context: NpcContext): NpcMode {
  return context.attentive ? 'attentive' : context.settled ? 'settled' : 'work';
}
export interface PoseBeat { frame: number; hold: number }
export const rookRoutine: PoseBeat[] = [
  { frame: 3, hold: 1500 },
  { frame: 1, hold: 750 }, { frame: 2, hold: 850 },
  { frame: 1, hold: 750 }, { frame: 2, hold: 850 },
  { frame: 3, hold: 2000 }, { frame: 0, hold: 2600 },
];

/** A small reusable pose routine, interrupted by conversation and room state. */
export class AmbientNpc {
  private timer?: ReturnType<typeof setTimeout>;
  private key = '';
  private beat = 0;
  constructor(private element: HTMLElement, private draw: (frame: number) => void, private routine: PoseBeat[]) {}
  update(context: NpcContext) {
    const mode = npcMode(context);
    const key = `${mode}:${context.active}:${context.reducedMotion}`;
    if (key === this.key) return;
    this.key = key;
    clearTimeout(this.timer);
    this.element.dataset.mode = mode;
    this.element.dataset.paused = String(!context.active || context.reducedMotion);
    if (mode !== 'work' || context.reducedMotion) { this.draw(0); return; }
    if (!context.active) return;
    this.beat = 0;
    const next = () => {
      const beat = this.routine[this.beat];
      this.draw(beat.frame);
      this.beat = (this.beat + 1) % this.routine.length;
      this.timer = setTimeout(next, beat.hold);
    };
    next();
  }
}
