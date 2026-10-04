/** Decide from scalar state before copying the potentially large monster book. */
export function checkpointDue(force: boolean, elapsed: number, last: number, retryAt: number, crossed: boolean) {
  return force || elapsed >= last + 15 || (crossed && elapsed >= retryAt);
}
