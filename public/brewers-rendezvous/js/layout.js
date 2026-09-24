// Booth offsets are measured from the brewery's map point toward its counter.
export function localToWorld(stop, x = 0, z = 0) {
  const angle = stop.facing || 0;
  return {
    x: stop.x + Math.cos(angle) * x + Math.sin(angle) * z,
    z: stop.z - Math.sin(angle) * x + Math.cos(angle) * z
  };
}

export function worldToLocal(stop, x, z) {
  const angle = stop.facing || 0;
  const dx = x - stop.x, dz = z - stop.z;
  return { x: Math.cos(angle) * dx - Math.sin(angle) * dz,
    z: Math.sin(angle) * dx + Math.cos(angle) * dz };
}

export function insideBooth(stop, x, z) {
  const local = worldToLocal(stop, x, z);
  return Math.abs(local.x) < 3.05 && local.z > -3.75 && local.z < 1.05;
}

export const parkTrunks = [[-23,-6.6],[-16,-7.8],[-8,-8.1],[1,-7.9],[10,-8.1],[23,-7.2],[-24,6.3],[23,4.6]];

// Used by the player route finder and by the roaming crowd. Keep both on
// the same physical map so a decorative visitor never walks through a tent.
export function parkBlocked(x, z, breweryStops) {
  if (x < -24.8 || x > 24.8 || z < -8.9 || z > 14.4) return true;
  if (breweryStops.some(stop => insideBooth(stop, x, z))) return true;
  if (x > 13.3 && x < 21.1 && z > -7.4 && z < -3.05) return true;
  return parkTrunks.some(([tx,tz]) => Math.hypot(x-tx,z-tz) < .93);
}

export function routeIsClear(points, breweryStops, step = .25) {
  for (let index = 0; index < points.length; index++) {
    const a = points[index], b = points[(index + 1) % points.length];
    const count = Math.max(1, Math.ceil(Math.hypot(b[0]-a[0], b[1]-a[1]) / step));
    for (let n = 0; n <= count; n++) {
      const t = n/count;
      if (parkBlocked(a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, breweryStops)) return false;
    }
  }
  return true;
}
