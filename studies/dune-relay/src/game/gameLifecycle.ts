/** Serialize Phaser construction and asynchronous destruction across React mounts. */
let tail: Promise<unknown> = Promise.resolve();
let leases = 0;
let idle: Promise<void> = Promise.resolve();
let releaseIdle: (() => void) | null = null;
export function reserveGame() {
  if (++leases === 1) idle = new Promise<void>(resolve => { releaseIdle = resolve; });
  let released = false;
  return () => {
    if (released) return;
    released = true;
    if (--leases === 0) { releaseIdle?.(); releaseIdle = null; }
  };
}
export function enqueueGameWork<T>(work: () => T | Promise<T>): Promise<T> {
  const next = tail.then(work, work);
  tail = next.then(() => {}, () => {});
  return next;
}
export function waitForGameIdle(): Promise<void> { return idle; }
