// A small, playback-time-driven wireframe satellite. Indexed geometry is built
// once; each frame transforms its vertices once and batches its visible lines.
const TAU = Math.PI * 2;
const vertices = [];
const segments = [];
const SHELL = 0, FRAME = 1, COPPER = 2;

function vertex(x, y, z) {
  vertices.push([x, y, z]);
  return vertices.length - 1;
}
function line(a, b, style = SHELL) { segments.push([a, b, style]); }
function loop(points, style = SHELL) {
  for (let i = 0; i < points.length; i++) line(points[i], points[(i + 1) % points.length], style);
}
function ring(center, u, v, radius, count, style = SHELL) {
  const points = [];
  for (let i = 0; i < count; i++) {
    const angle = i * TAU / count;
    points.push(vertex(center[0] + radius * (u[0] * Math.cos(angle) + v[0] * Math.sin(angle)),
      center[1] + radius * (u[1] * Math.cos(angle) + v[1] * Math.sin(angle)),
      center[2] + radius * (u[2] * Math.cos(angle) + v[2] * Math.sin(angle))));
  }
  loop(points, style);
  return points;
}
const sphereRing = (y, count = 48) => ring([0, y, 0], [1, 0, 0], [0, 0, 1], Math.sqrt(1 - y * y), count);

// Six pole-to-pole seams and the paired rolled rim of the two hemispheres.
for (let seam = 0; seam < 6; seam++) {
  const longitude = seam * TAU / 6;
  let previous;
  for (let sample = 0; sample <= 24; sample++) {
    const theta = sample * Math.PI / 24;
    const point = vertex(Math.sin(theta) * Math.cos(longitude), Math.cos(theta),
      Math.sin(theta) * Math.sin(longitude));
    if (previous !== undefined) line(previous, point);
    previous = point;
  }
}
const upperRim = sphereRing(.035);
const lowerRim = sphereRing(-.035);
for (let tick = 0; tick < 8; tick++) line(upperRim[tick * 6], lowerRim[tick * 6], FRAME);
sphereRing(.96, 24);
sphereRing(-.96, 24);

// The inspection hatch is oriented toward the initial camera pose. Its two
// perimeters and six fasteners sit just above the sphere's surface.
const hatchNormal = [.55, .25, .8];
const hatchLength = Math.hypot(...hatchNormal);
const normal = hatchNormal.map(value => value / hatchLength);
const hatchU = [normal[2], 0, -normal[0]];
const hatchULength = Math.hypot(...hatchU);
for (let i = 0; i < 3; i++) hatchU[i] /= hatchULength;
const hatchV = [normal[1] * hatchU[2] - normal[2] * hatchU[1],
  normal[2] * hatchU[0] - normal[0] * hatchU[2],
  normal[0] * hatchU[1] - normal[1] * hatchU[0]];
const hatchCenter = normal.map(value => value * 1.012);
ring(hatchCenter, hatchU, hatchV, .25, 32, FRAME);
ring(hatchCenter, hatchU, hatchV, .205, 32, FRAME);
for (let bolt = 0; bolt < 6; bolt++) {
  const angle = bolt * TAU / 6;
  const center = hatchCenter.map((value, axis) => value + .228 *
    (hatchU[axis] * Math.cos(angle) + hatchV[axis] * Math.sin(angle)));
  ring(center, hatchU, hatchV, .018, 6, COPPER);
}

const antennaDirections = [
  [.94, .14, .55], [.66, -.66, .68], [.17, -.94, .64], [-.53, -.78, .72],
];
for (const rawDirection of antennaDirections) {
  const length = Math.hypot(...rawDirection);
  const direction = rawDirection.map(value => value / length);
  const reference = Math.abs(direction[1]) > .9 ? [1, 0, 0] : [0, 1, 0];
  const u = [direction[1] * reference[2] - direction[2] * reference[1],
    direction[2] * reference[0] - direction[0] * reference[2],
    direction[0] * reference[1] - direction[1] * reference[0]];
  const uLength = Math.hypot(...u);
  for (let i = 0; i < 3; i++) u[i] /= uLength;
  const v = [direction[1] * u[2] - direction[2] * u[1],
    direction[2] * u[0] - direction[0] * u[2],
    direction[0] * u[1] - direction[1] * u[0]];
  const at = distance => direction.map(value => value * distance);
  ring(at(.99), u, v, .12, 8, FRAME);
  ring(at(1.01), u, v, .075, 12, COPPER);
  ring(at(1.16), u, v, .065, 12, COPPER);
  const stations = [[1.01, .075], [1.16, .065], [1.16, .035], [1.9, .026], [2.65, .016], [3.5, .005]];
  const rails = [[], [], [], []];
  for (const [distance, radius] of stations) {
    const center = at(distance);
    for (let side = 0; side < 4; side++) {
      const angle = side * TAU / 4;
      rails[side].push(vertex(...center.map((value, axis) => value + radius *
        (u[axis] * Math.cos(angle) + v[axis] * Math.sin(angle)))));
    }
    if (distance === 1.9 || distance === 2.65) ring(center, u, v, radius * 1.35, 8, COPPER);
  }
  for (const rail of rails) for (let i = 1; i < rail.length; i++) line(rail[i - 1], rail[i], FRAME);
}

export function drawSputnik(ctx, width, height, seconds = 0, reducedMotion = false, dark = false) {
  if (!width || !height) return;
  const radius = Math.max(24, Math.min(42, .06 * Math.min(width, height)));
  const centerX = width * .5, centerY = height * .46;
  const time = reducedMotion ? 0 : Math.max(0, seconds || 0);
  const yaw = -.72 + time * TAU / 40;
  const tilt = -.36 + (reducedMotion ? 0 : .10 * Math.sin(time * TAU / 55));
  const roll = -.26;
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  const ct = Math.cos(tilt), st = Math.sin(tilt);
  const cr = Math.cos(roll), sr = Math.sin(roll);
  const projected = vertices.map(([x, y, z]) => {
    const rx = x * cy + z * sy, rz = z * cy - x * sy;
    const ry = y * ct - rz * st, depth = y * st + rz * ct;
    const px = rx * cr - ry * sr, py = rx * sr + ry * cr;
    const perspective = 1 / (1 - depth * .105);
    return [centerX + px * radius * perspective, centerY + py * radius * perspective, depth];
  });
  const colors = dark ? ['215,237,240', '220,238,240', '241,177,113']
    : ['40,63,65', '47,68,69', '144,93,57'];
  const buckets = Array.from({ length: 6 }, () => []);
  for (const [from, to, style] of segments) {
    const a = projected[from], b = projected[to];
    buckets[style + ((a[2] + b[2] >= 0) ? 3 : 0)].push([a, b]);
  }
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (let bucket = 0; bucket < buckets.length; bucket++) {
    if (bucket === 3) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.006, 0, TAU);
      ctx.strokeStyle = `rgba(${colors[SHELL]},.62)`;
      ctx.lineWidth = .9;
      ctx.stroke();
    }
    if (!buckets[bucket].length) continue;
    const front = bucket >= 3, style = bucket % 3;
    ctx.beginPath();
    for (const [a, b] of buckets[bucket]) {
      ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
    }
    ctx.strokeStyle = `rgba(${colors[style]},${front ? (style === SHELL ? .78 : .9) : .2})`;
    ctx.lineWidth = style === SHELL ? .6 : .9;
    ctx.stroke();
  }
  ctx.restore();
}
