// A small simulation-time queue: input may be fast, but each ball gets room to leave the chute.
export class ReleaseQueue {
  constructor(spacing=.22) { this.spacing=spacing;this.pending=[];this.nextAt=0; }
  enqueue(type,free=false,readyAt=0,encore=false) { this.pending.push({type,free,readyAt,encore}); }
  get length() { return this.pending.length; }
  flush(now,canRelease,release) {
    const next=this.pending[0];
    if(!next||now<Math.max(this.nextAt,next.readyAt)||!canRelease())return null;
    if(!release(next))return null;
    this.pending.shift();this.nextAt=now+this.spacing;
    return next;
  }
  clear() { const pending=this.pending;this.pending=[];this.nextAt=0;return pending; }
}

export function cancelForRoundChoice(queue,previousStatus,nextStatus) {
  if(previousStatus!=='playing'||nextStatus!=='choose')return 0;
  return queue.clear().filter(item=>!item.free).length;
}
