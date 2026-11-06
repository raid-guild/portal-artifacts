import { SOUND_GATE_COLORS } from './sound-gates.js';

const GATE_LABELS = ['GATE 1', 'GATE 2', 'GATE 3'];
const validPoint = point => point && Number.isFinite(point.x) && Number.isFinite(point.y);

// The guide follows collected bits, never changes the pickup order or scoring.
export function campaignGuideTarget(gates, mask, goal) {
  const unclaimed = (gates || [])
    .filter(gate => Number.isInteger(gate.id) && gate.id >= 0 && gate.id < 3 && validPoint(gate) && !(mask & (1 << gate.id)))
    .sort((a, b) => a.id - b.id)[0];
  if (unclaimed) return { kind: 'gate', id: unclaimed.id, x: unclaimed.x, y: unclaimed.y,
    radius: Math.max(0, unclaimed.radius || 0), label: GATE_LABELS[unclaimed.id], color: SOUND_GATE_COLORS[unclaimed.id] };
  if (!validPoint(goal)) return null;
  return { kind: 'exit', x: goal.x, y: goal.y, radius: Math.max(0, goal.radius || 0), label: 'EXIT', color: '#bfa5ff' };
}

// Project onto the visible scene, then keep the marker clear of HUD/control rectangles.
export function projectCampaignGuide(target, camera, viewport, inset = {}, blocked = []) {
  if (!target || !viewport?.width || !viewport?.height) return null;
  const { width, height } = viewport;
  const spanX = camera.right - camera.left, spanY = camera.top - camera.bottom;
  if (!(spanX > 0 && spanY > 0)) return null;
  const x = (target.x - camera.x - camera.left) / spanX * width;
  const y = (camera.y + camera.top - target.y) / spanY * height;
  const rx = target.radius / spanX * width, ry = target.radius / spanY * height;
  if (x + rx >= 0 && x - rx <= width && y + ry >= 0 && y - ry <= height) return null;
  const left = Math.min(width / 2 - 1, inset.left ?? 32);
  const right = Math.max(width / 2 + 1, width - (inset.right ?? 32));
  const top = Math.min(height / 2 - 1, inset.top ?? 32);
  const bottom = Math.max(height / 2 + 1, height - (inset.bottom ?? 32));
  const cx = width / 2, cy = height / 2, dx = x - cx, dy = y - cy;
  const t = Math.min(dx > 0 ? (right - cx) / dx : dx < 0 ? (left - cx) / dx : Infinity,
    dy > 0 ? (bottom - cy) / dy : dy < 0 ? (top - cy) / dy : Infinity);
  let px = Math.max(left, Math.min(right, cx + dx * t));
  let py = Math.max(top, Math.min(bottom, cy + dy * t));
  for (const rect of blocked) {
    if (px < rect.left || px > rect.right || py < rect.top || py > rect.bottom) continue;
    const candidates = [
      [Math.max(left, rect.left - 12), py], [Math.min(right, rect.right + 12), py],
      [px, Math.max(top, rect.top - 12)], [px, Math.min(bottom, rect.bottom + 12)],
    ].filter(([xx, yy]) => xx < rect.left || xx > rect.right || yy < rect.top || yy > rect.bottom);
    if (candidates.length) [px, py] = candidates.sort((a, b) => (a[0] - px) ** 2 + (a[1] - py) ** 2 - ((b[0] - px) ** 2 + (b[1] - py) ** 2))[0];
  }
  return { x: px, y: py, angle: Math.atan2(dy, dx) };
}
