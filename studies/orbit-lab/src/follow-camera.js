export function followFrame(aspect) {
  const width = Math.max(35, 21 * aspect);
  return { width, height: width / aspect };
}

export function followPosition(current, hero, velocity, bounds, frame, dt, snap = false) {
  const lead = Math.hypot(velocity.x, velocity.y);
  const targetX = hero.x + (lead ? velocity.x / lead * 2 : 0);
  const targetY = hero.y + (lead ? velocity.y / lead * 2 : 0);
  const clamp = (value, min, max) => min > max ? (min + max) / 2 : Math.max(min, Math.min(max, value));
  const halfX = frame.width / 2, halfY = frame.height / 2;
  const x = clamp(targetX, bounds.minX + halfX - .75, bounds.maxX - halfX + .75);
  const y = clamp(targetY, bounds.minY + halfY - .75, bounds.maxY - halfY + .75);
  const blend = snap ? 1 : 1 - Math.exp(-4 * Math.max(0, dt));
  return { x: current.x + (x - current.x) * blend, y: current.y + (y - current.y) * blend };
}
