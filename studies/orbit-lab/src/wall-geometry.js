const EPS = 1e-7;
const round = n => Math.round(n * 1e6) / 1e6;

export function pathWallSegments(path) {
  const segments = [];
  for (let i = 1; i < path.points.length; i++) {
    const a = path.points[i - 1], b = path.points[i];
    const length = Math.hypot(b.x - a.x, b.y - a.y);
    if (length < EPS) continue;
    segments.push({ id: `${path.id}-${i}`, sourceId: path.id, x: (a.x + b.x) / 2, y: (a.y + b.y) / 2,
      w: length + path.thickness, h: path.thickness, angle: Math.atan2(b.y - a.y, b.x - a.x) });
  }
  return segments;
}
export function wallCorners(rect) {
  const a = rect.angle || 0, c = Math.cos(a), s = Math.sin(a);
  return [[-1,-1],[1,-1],[1,1],[-1,1]].map(([dx,dy]) => ({ x: rect.x + dx * rect.w / 2 * c - dy * rect.h / 2 * s,
    y: rect.y + dx * rect.w / 2 * s + dy * rect.h / 2 * c }));
}
export function localWallPoint(point, rect) {
  const a = rect.angle || 0, c = Math.cos(a), s = Math.sin(a), dx = point.x - rect.x, dy = point.y - rect.y;
  return { x: dx * c + dy * s, y: -dx * s + dy * c };
}
export function pointSegmentDistance(point, a, b) {
  const dx = b.x - a.x, dy = b.y - a.y, len2 = dx * dx + dy * dy;
  const t = len2 ? Math.max(0, Math.min(1, ((point.x - a.x) * dx + (point.y - a.y) * dy) / len2)) : 0;
  return Math.hypot(point.x - (a.x + dx * t), point.y - (a.y + dy * t));
}
const box = wall => ({ x1: round(wall.x - wall.width / 2), x2: round(wall.x + wall.width / 2), y1: round(wall.y - wall.height / 2), y2: round(wall.y + wall.height / 2), id: wall.id });

// Sweep vertical bands; union y intervals in each band, then merge matching
// bands horizontally. Unlike a bounding box, this preserves L shapes and holes.
export function unionAxisWalls(walls, cuts = [], reservedIds = new Set()) {
  const sources = walls.map(box), erasers = cuts.map(box);
  if (!sources.length) return [];
  const xs = [...new Set([...sources, ...erasers].flatMap(r => [r.x1, r.x2]))].sort((a,b) => a - b);
  const strips = [];
  for (let i = 1; i < xs.length; i++) {
    const x1 = xs[i - 1], x2 = xs[i]; if (x2 - x1 < EPS) continue;
    const covered = sources.filter(r => r.x1 < x2 - EPS && r.x2 > x1 + EPS).map(r => [r.y1,r.y2]).sort((a,b)=>a[0]-b[0]);
    const merged = [];
    for (const span of covered) { const last = merged.at(-1); if (last && span[0] <= last[1] + EPS) last[1] = Math.max(last[1], span[1]); else merged.push([...span]); }
    const cutsHere = erasers.filter(r => r.x1 < x2 - EPS && r.x2 > x1 + EPS);
    for (const [lo, hi] of merged) {
      let pieces = [[lo, hi]];
      for (const cut of cutsHere) pieces = pieces.flatMap(([a,b]) => cut.y2 <= a + EPS || cut.y1 >= b - EPS ? [[a,b]] : [[a, Math.min(b,cut.y1)], [Math.max(a,cut.y2),b]].filter(([u,v])=>v-u>EPS));
      for (const [y1,y2] of pieces) strips.push({ x1,x2,y1,y2 });
    }
  }
  const active = new Map(), output = [];
  for (const strip of strips) {
    const key = `${strip.y1}/${strip.y2}`;
    const previous = active.get(key);
    if (previous && Math.abs(previous.x2 - strip.x1) < EPS) previous.x2 = strip.x2;
    else { const piece = { ...strip }; output.push(piece); active.set(key,piece); }
  }
  const used = new Set(reservedIds); let serial = 1;
  return output.map(piece => {
    const original = sources.find(r => !used.has(r.id) && Math.abs(r.x1-piece.x1)<EPS && Math.abs(r.x2-piece.x2)<EPS && Math.abs(r.y1-piece.y1)<EPS && Math.abs(r.y2-piece.y2)<EPS)
      || sources.find(r => !used.has(r.id) && r.x1>=piece.x1-EPS && r.x2<=piece.x2+EPS && r.y1>=piece.y1-EPS && r.y2<=piece.y2+EPS)
      || sources.find(r => !used.has(r.id) && piece.x1>=r.x1-EPS && piece.x2<=r.x2+EPS && piece.y1>=r.y1-EPS && piece.y2<=r.y2+EPS);
    let id = original?.id;
    if (!id) { do { id = `wall-${serial++}`; } while (used.has(id) || sources.some(r=>r.id===id)); }
    used.add(id);
    return { id, x: round((piece.x1+piece.x2)/2), y: round((piece.y1+piece.y2)/2), width: round(piece.x2-piece.x1), height: round(piece.y2-piece.y1) };
  });
}

export function compiledWallGeometry(walls, wallPaths = []) {
  const reserved = new Set(wallPaths.map(path => path.id));
  const merged = unionAxisWalls(walls, [], reserved).map(wall => ({ id: wall.id, x: wall.x, y: wall.y, w: wall.width, h: wall.height, angle: 0 }));
  return [...merged, ...wallPaths.flatMap(pathWallSegments)];
}
