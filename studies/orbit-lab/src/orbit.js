export const DEFAULT_ORBIT_DIRECTION = 'counterclockwise';
export const ORBIT_DIRECTIONS = ['counterclockwise', 'clockwise'];
export const ORBIT_PRESET_RADIUS = 3.5;
export const ORBIT_PRESET_PERIOD = 9.6;

export const orbitDirectionSign = direction => direction === 'clockwise' ? -1 : 1;
export function orbitPeriod(entity) {
  return entity.orbitRadius > 0 && entity.speed > 0 ? 2 * Math.PI * entity.orbitRadius / entity.speed : Infinity;
}
export function orbitSpeed(radius, seconds) {
  return radius > 0 && seconds > 0 && Number.isFinite(radius) && Number.isFinite(seconds) ? 2 * Math.PI * radius / seconds : NaN;
}
export function orbitPosition(entity, time = 0) {
  const radius = Number.isFinite(entity.orbitRadius) ? entity.orbitRadius : 0;
  const speed = Number.isFinite(entity.speed) ? entity.speed : 0;
  const phase = Number.isFinite(entity.phase) ? entity.phase : 0;
  const angle = phase * Math.PI / 180 + orbitDirectionSign(entity.orbitDirection) * time * speed / Math.max(radius, .01);
  return { x: entity.x + Math.cos(angle) * radius, y: entity.y + Math.sin(angle) * radius };
}
export function orbitRadiusKeepingPeriod(entity, radius) {
  const period = orbitPeriod(entity);
  const speed = !Number.isFinite(radius) || radius < 0 ? NaN : radius === 0 ? 0
    : Number.isFinite(period) ? orbitSpeed(radius, period)
    : Number.isFinite(entity.speed) && entity.speed >= 0 ? entity.speed : 0;
  return { ...entity, orbitRadius: radius, speed };
}
export function startOrbitMotion(entity) {
  const radius = entity.orbitRadius > 0 ? entity.orbitRadius : ORBIT_PRESET_RADIUS;
  return { ...entity, motion: 'orbit', orbitRadius: radius,
    speed: entity.speed > 0 ? entity.speed : orbitSpeed(radius, ORBIT_PRESET_PERIOD),
    orbitDirection: entity.orbitDirection || DEFAULT_ORBIT_DIRECTION };
}
export function orbitRingPreset(center, ids) {
  const speed = orbitSpeed(ORBIT_PRESET_RADIUS, ORBIT_PRESET_PERIOD);
  return [0, 120, 240].map((phase, index) => ({ id: ids[index], type: 'ember', x: center.x, y: center.y,
    radius: .35, gravity: 0, lethal: true, motion: 'orbit', speed, orbitRadius: ORBIT_PRESET_RADIUS,
    phase, orbitDirection: DEFAULT_ORBIT_DIRECTION }));
}
export function validateOrbitPresetPlacement(entities, bounds, start, exit, blobRadius = .31) {
  for (const entity of entities) {
    if (entity.x - entity.orbitRadius - entity.radius < bounds.minX || entity.x + entity.orbitRadius + entity.radius > bounds.maxX ||
        entity.y - entity.orbitRadius - entity.radius < bounds.minY || entity.y + entity.orbitRadius + entity.radius > bounds.maxY) return 'Orbit ring needs more room inside the bounds.';
    const initial = orbitPosition(entity, 0);
    if (Math.hypot(initial.x - start.x, initial.y - start.y) <= entity.radius + blobRadius) return 'An orbiting ember would hit the start.';
    if (Math.hypot(initial.x - exit.x, initial.y - exit.y) <= entity.radius + exit.radius + blobRadius) return 'An orbiting ember would cover the exit.';
  }
  return null;
}
export function pickOrbitEntity(entities, point, selectedId = null) {
  const orbits = entities.filter(entity => entity.type === 'ember' && entity.motion === 'orbit');
  const bodyHits = orbits.map(entity => ({ entity, distance: Math.hypot(point.x-orbitPosition(entity).x, point.y-orbitPosition(entity).y) }))
    .filter(hit => hit.distance <= hit.entity.radius + .4).sort((a,b) => a.distance - b.distance);
  if (bodyHits.length) return { id: bodyHits[0].entity.id, part: 'body' };
  const centers = orbits.filter(entity => Math.hypot(point.x-entity.x, point.y-entity.y) <= .7);
  if (!centers.length) return null;
  const prior = centers.findIndex(entity => entity.id === selectedId);
  return { id: centers[(prior + 1) % centers.length].id, part: 'center' };
}
