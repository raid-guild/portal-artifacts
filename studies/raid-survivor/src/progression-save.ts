export type CheckpointResult = { profile: unknown; progress: unknown };
export type CheckpointStatus = 'idle' | 'saving' | 'saved' | 'retrying';
export type ProgressSnapshot = { durationMs: number; kills: number; monsters: unknown };

/** One active run's cumulative checkpoints. A newer snapshot supersedes an
 * unsent one; the server's cumulative/idempotent progress makes retries safe. */
export class CheckpointSender {
  private pending: ProgressSnapshot | null = null;
  private flight: Promise<void> | null = null;
  private stopped = false;
  acknowledgedMs = 0;
  status: CheckpointStatus = 'idle';
  constructor(
    private readonly post: (snapshot: ProgressSnapshot) => Promise<Response>,
    private readonly onAck: (result: CheckpointResult) => void,
    private readonly onStatus: (status: CheckpointStatus) => void = () => {},
    private readonly pause: (ms: number) => Promise<void> = ms => new Promise(resolve => setTimeout(resolve, ms)),
  ) {}
  private setStatus(status: CheckpointStatus) { this.status=status; this.onStatus(status); }
  stop() { this.stopped=true; this.pending=null; }
  offer(snapshot: ProgressSnapshot) {
    if (this.stopped) return Promise.resolve();
    if (!this.pending || snapshot.durationMs >= this.pending.durationMs) this.pending=snapshot;
    if (!this.flight) this.flight=this.drain().finally(() => { this.flight=null; });
    return this.flight;
  }
  async settle() { await this.flight; }
  private async drain() {
    while (this.pending && !this.stopped) {
      const snapshot=this.pending; this.pending=null; this.setStatus('saving');
      let acknowledged=false, terminal=false;
      for (let attempt=0;attempt<3&&!this.stopped;attempt++) {
        try {
          const response=await this.post(snapshot);
          if (response.ok) {
            const data=await response.json() as CheckpointResult;
            if (!this.stopped) { this.acknowledgedMs=Math.max(this.acknowledgedMs,snapshot.durationMs);this.onAck(data);this.setStatus('saved'); }
            acknowledged=true;break;
          }
          if (response.status!==429 && response.status!==503) { terminal=true;break; }
        } catch { /* network and timeout failures may be retried */ }
        this.setStatus('retrying');
        if (attempt<2) await this.pause(300*(attempt+1));
      }
      if (!acknowledged) {
        const queued=this.pending as ProgressSnapshot|null;
        if (!terminal && (!queued || queued.durationMs < snapshot.durationMs)) this.pending=snapshot;
        this.setStatus('retrying');
        break; // A later checkpoint or finish starts the next bounded attempt.
      }
    }
  }
}

export function canApplyAccountProfile(responseAccount: string, activeAccount: string | null, portal: boolean) {
  return portal && responseAccount===activeAccount;
}

export function guestProfileState<T>(guestProfile:T) {
  return { profile:guestProfile, profileAccountId:null, profileReady:false } as const;
}

/** Old in-flight reads must not erase a milestone, purchase, or monster tally. */
export function newerProfile<T extends { revision:number; monsters:Record<string,Record<string,number>> }>(known:T|null, incoming:T):T {
  if (!known || incoming.revision>known.revision) return incoming;
  if (incoming.revision<known.revision) return known;
  for (const [kind,row] of Object.entries(incoming.monsters)) for (const field of Object.keys(row))
    row[field]=Math.max(row[field],known.monsters[kind]?.[field]??0);
  return incoming;
}

export function portalProfileResponse<T extends { revision:number; monsters:Record<string,Record<string,number>> }>(
  requestAccount:string, activeAccount:string|null, portal:boolean,
  knownAccount:string|null, knownProfile:T, incoming:T,
) {
  if (!canApplyAccountProfile(requestAccount,activeAccount,portal)) return null;
  return { profile:newerProfile(knownAccount===requestAccount?knownProfile:null,incoming), profileAccountId:requestAccount, profileReady:true } as const;
}
