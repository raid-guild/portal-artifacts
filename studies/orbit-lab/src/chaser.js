import { circleHitsRect, sweptCircleRect } from './level.js';
import { localWallPoint, wallCorners } from './wall-geometry.js';

const EPSILON = 1e-5;

function firstWall(from, to, radius, walls) {
  let first = null;
  for (const wall of walls) {
    const t = sweptCircleRect(from, to, radius, wall);
    if (t !== null && (!first || t < first.t)) first = { wall, t };
  }
  return first;
}

// An ember can see a nearby corner, not the layout of the entire maze. Keep
// the chosen side while it rounds a wall so its steering does not oscillate.
function pursuitTarget(item, hero, radius, walls) {
  const obstruction = firstWall(item, hero, radius + .08, walls);
  if (!obstruction) { item.rounding = null; return hero; }
  const { wall } = obstruction;
  const wallKey = wall.id ?? JSON.stringify([wall.x, wall.y, wall.w, wall.h, wall.angle || 0]);
  if (item.rounding && item.rounding.id === wallKey) {
    if (Math.hypot(item.x - item.rounding.point.x, item.y - item.rounding.point.y) < .75) {
      if (item.rounding.stage === 'approach') {
        item.rounding.stage = 'cross';
        item.rounding.point = item.rounding.exit;
      } else item.rounding = null;
    }
    if (item.rounding) return item.rounding.point;
  }
  const corners = wallCorners(wall);
  const center = { x: wall.x, y: wall.y };
  const candidates = corners.map(corner => {
    const dx = corner.x - center.x, dy = corner.y - center.y;
    const length = Math.hypot(dx, dy) || 1;
    const point = { x: corner.x + dx / length * (radius + .45), y: corner.y + dy / length * (radius + .45) };
    const local = localWallPoint(point, wall), angle = wall.angle || 0, c = Math.cos(angle), s = Math.sin(angle);
    const mirrored = wall.h >= wall.w ? { x: -local.x, y: local.y } : { x: local.x, y: -local.y };
    const exit = { x: wall.x + mirrored.x * c - mirrored.y * s, y: wall.y + mirrored.x * s + mirrored.y * c };
    return { point, exit, cost: Math.hypot(point.x - item.x, point.y - item.y) + Math.hypot(exit.x - hero.x, exit.y - hero.y) };
  }).sort((a, b) => a.cost - b.cost);
  item.rounding = { id: wallKey, point: candidates[0].point, exit: candidates[0].exit, stage: 'approach' };
  return item.rounding.point;
}

function collisionNormal(from, to, radius, wall, t) {
  const p = localWallPoint({ x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t }, wall);
  const edgeX = wall.w / 2 + radius, edgeY = wall.h / 2 + radius;
  const horizontal = Math.abs(Math.abs(p.x) - edgeX) < Math.abs(Math.abs(p.y) - edgeY);
  const a = wall.angle || 0, c = Math.cos(a), s = Math.sin(a);
  const sign = horizontal ? Math.sign(p.x) || 1 : Math.sign(p.y) || 1;
  return horizontal ? { x: c * sign, y: s * sign } : { x: -s * sign, y: c * sign };
}

function moveWithWalls(item, dt, radius, walls) {
  let remaining = dt;
  for (let pass = 0; pass < 3 && remaining > EPSILON; pass++) {
    const from = { x: item.x, y: item.y };
    const to = { x: from.x + item.vx * remaining, y: from.y + item.vy * remaining };
    const hit = firstWall(from, to, radius, walls);
    if (!hit) { item.x = to.x; item.y = to.y; break; }
    const safeT = Math.max(0, hit.t - EPSILON);
    item.x = from.x + (to.x - from.x) * safeT;
    item.y = from.y + (to.y - from.y) * safeT;
    const normal = collisionNormal(from, to, radius, hit.wall, hit.t);
    const incoming = item.vx * normal.x + item.vy * normal.y;
    if (incoming < 0) { item.vx -= incoming * normal.x; item.vy -= incoming * normal.y; }
    remaining *= 1 - hit.t;
    if (hit.t <= EPSILON && Math.hypot(item.vx, item.vy) <= EPSILON) break;
  }
}

export function stepChaser(item, entity, hero, dt, bounds = null, walls = []) {
  const radius = entity.radius;
  const target = pursuitTarget(item, hero, radius, walls);
  const dx = target.x - item.x, dy = target.y - item.y;
  const length = Math.hypot(dx, dy);
  const acceleration = entity.acceleration ?? 1.45;
  const speedLimit = entity.speed;
  if (length > .08) {
    item.vx += dx / length * acceleration * dt;
    item.vy += dy / length * acceleration * dt;
  }
  const damping = Math.exp(-.45 * dt);
  item.vx *= damping; item.vy *= damping;
  const speed = Math.hypot(item.vx, item.vy);
  if (speed > speedLimit && speed > 0) { item.vx *= speedLimit / speed; item.vy *= speedLimit / speed; }
  moveWithWalls(item, dt, radius, walls);
  if (bounds) {
    const x = Math.max(bounds.minX + radius, Math.min(bounds.maxX - radius, item.x));
    const y = Math.max(bounds.minY + radius, Math.min(bounds.maxY - radius, item.y));
    if (x !== item.x) item.vx = 0;
    if (y !== item.y) item.vy = 0;
    item.x = x; item.y = y;
  }
  // Keep imported entities from appearing on the wrong side of a thin wall.
  // Authoring validation normally prevents these placements.
  if (walls.some(wall => circleHitsRect(item, radius * .5, wall))) {
    item.x -= item.vx * dt; item.y -= item.vy * dt;
    item.vx = 0; item.vy = 0;
  }
}
