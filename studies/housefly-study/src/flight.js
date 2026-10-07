export const DEFAULTS = Object.freeze({
  speed: 25,
  burstMultiplier: 1.8,
  randomTurns: true,
  turnFrequency: 0.8,
  turnSharpness: 60,
  depthTravel: 40,
  attractionStrength: 50,
  attractionRadius: 25,
  cursorResponse: 'flee',
  cursorSensitivity: 50,
});

export const PRESETS = Object.freeze({
  default: { ...DEFAULTS },
  calm: { ...DEFAULTS, speed: 16, burstMultiplier: 1.3, turnFrequency: 0.3, turnSharpness: 30, attractionStrength: 35 },
  restless: { ...DEFAULTS, speed: 38, burstMultiplier: 2.3, turnFrequency: 1.8, turnSharpness: 84, attractionStrength: 24, cursorSensitivity: 75 },
  curious: { ...DEFAULTS, speed: 22, turnFrequency: 0.5, turnSharpness: 50, attractionStrength: 85, attractionRadius: 42, cursorResponse: 'investigate' },
});

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const length = (v) => Math.hypot(v.x, v.y, v.z);
const normalize = (v) => {
  const n = length(v) || 1;
  return { x: v.x / n, y: v.y / n, z: v.z / n };
};
const sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
const distance = (a, b) => length(sub(a, b));
const moveToward = (current, target, maxDelta) => {
  const delta = sub(target, current);
  const n = length(delta);
  if (n <= maxDelta || n === 0) return { ...target };
  return {
    x: current.x + (delta.x / n) * maxDelta,
    y: current.y + (delta.y / n) * maxDelta,
    z: current.z + (delta.z / n) * maxDelta,
  };
};
const rotateToward = (current, target, maxAngle) => {
  const a = normalize(current), b = normalize(target);
  const dot = clamp(a.x * b.x + a.y * b.y + a.z * b.z, -1, 1);
  const angle = Math.acos(dot);
  if (angle < 0.0001) return b;
  const t = Math.min(1, maxAngle / angle);
  return normalize({
    x: a.x * (1 - t) + b.x * t,
    y: a.y * (1 - t) + b.y * t,
    z: a.z * (1 - t) + b.z * t,
  });
};

export function depthRange(depthTravel) {
  if (depthTravel <= 0) return { min: 35, max: 35 };
  return {
    min: clamp(35 - depthTravel * 0.65, 4, 35),
    max: clamp(35 + depthTravel * 1.65, 35, 110),
  };
}

export function spotWorld(spot, bounds) {
  // A screen-space marker stays fixed while its 3D target changes with depth.
  const z = 12 + (spot.depth / 100) * 72;
  const scale = (160 - z) / 160;
  return {
    x: (spot.x - 0.5) * bounds.halfWidth * 2 * scale,
    y: (0.5 - spot.y) * 100 * scale,
    z,
  };
}

export class FlightSimulation {
  constructor(seed = 1001) {
    this.seed = seed;
    this.reset();
  }

  random() {
    this.rng = (Math.imul(1664525, this.rng) + 1013904223) >>> 0;
    return this.rng / 4294967296;
  }

  reset() {
    this.rng = this.seed >>> 0;
    this.time = 0;
    this.position = { x: -22, y: 10, z: 35 };
    this.velocity = { x: 21, y: -5, z: 2 };
    this.heading = normalize(this.velocity);
    this.state = 'cruise';
    this.stateTime = 0;
    this.stateDuration = 0;
    this.cooldown = 0;
    this.targetId = null;
    this.dartDirection = null;
    this.escapeDirection = null;
    this.wanderPhase = 1.75;
    this.lastLateral = 0;
    this.depthTarget = null;
    this.depthHold = 0;
    this.depthDirection = 'approaching';
  }

  setState(state, duration = 0) {
    this.state = state;
    this.stateTime = 0;
    this.stateDuration = duration;
    if (state !== 'investigate') this.targetId = null;
  }

  step(dt, config, bounds, spots = [], pointer = null) {
    dt = clamp(dt, 0, 0.05);
    if (!dt) return;
    this.time += dt;
    this.stateTime += dt;
    this.cooldown = Math.max(0, this.cooldown - dt);
    const p = this.position;
    const { min: minZ, max: maxZ } = depthRange(config.depthTravel);
    if (config.depthTravel === 0) {
      this.depthTarget = 35;
      this.depthHold = 0;
      this.depthDirection = 'level';
    } else {
      if (this.depthTarget === null || this.depthDirection === 'level') {
        this.depthTarget = maxZ - 5;
        this.depthDirection = 'approaching';
      }
      this.depthTarget = clamp(this.depthTarget, minZ + 3, maxZ - 3);
      if (Math.abs(p.z - this.depthTarget) < 6) {
        if (this.depthHold === 0) this.depthHold = 0.55 + this.random() * 0.35;
        this.depthHold = Math.max(0, this.depthHold - dt);
        if (this.depthHold === 0) {
          this.depthDirection = this.depthDirection === 'approaching' ? 'receding' : 'approaching';
          this.depthTarget = this.depthDirection === 'approaching' ? maxZ - 5 : minZ + 5;
        }
      }
    }
    const xLimit = bounds.halfWidth * ((160 - p.z) / 160) - 5;
    const yLimit = 50 * ((160 - p.z) / 160) - 5;

    // The pointer lives at the fly's depth, with reduced influence farther away.
    if (pointer?.active && config.cursorResponse !== 'ignore' && this.cooldown === 0) {
      const scale = (160 - p.z) / 160;
      const cursor = {
        x: (pointer.x - 0.5) * bounds.halfWidth * 2 * scale,
        y: (0.5 - pointer.y) * 100 * scale,
        z: p.z,
      };
      const gap = distance(p, cursor);
      const radius = (9 + config.cursorSensitivity * 0.19) * (0.75 + p.z / 160);
      if (gap < radius && (config.cursorResponse === 'flee' || this.state === 'cruise')) {
        if (config.cursorResponse === 'flee' && this.state !== 'escape') {
          this.escapeDirection = normalize({
            x: p.x - cursor.x || this.heading.x,
            y: p.y - cursor.y || this.heading.y,
            z: (this.random() - 0.35) * 8,
          });
          this.setState('escape', 0.65 + this.random() * 0.4);
        } else if (config.cursorResponse === 'investigate' && this.state === 'cruise') {
          this.pointerTarget = cursor;
          this.targetId = 'cursor';
          this.setState('investigate', 1.2 + this.random() * 1.1);
          this.targetId = 'cursor';
        }
      }
    }

    if (this.state === 'escape' && this.stateTime >= this.stateDuration) {
      this.setState('cruise');
      this.cooldown = 1.1;
    }
    if (this.state === 'dart' && this.stateTime >= this.stateDuration) this.setState('cruise');
    if (this.state === 'investigate' && this.stateTime >= this.stateDuration) {
      this.setState('cruise');
      this.cooldown = 0.9;
    }

    const available = config.attractionStrength > 0 ? spots : [];
    if (this.state === 'investigate' && this.targetId !== 'cursor' && !available.some(s => s.id === this.targetId)) {
      this.setState('cruise');
    }
    if (this.state === 'cruise' && this.cooldown === 0) {
      const candidates = available
        .map(s => ({ spot: s, world: spotWorld(s, bounds) }))
        .filter(({ spot, world }) => distance(p, world) < config.attractionRadius * (1 + config.attractionStrength / 100) * Math.max(0.15, spot.strength / 100))
        .sort((a, b) => distance(p, a.world) - distance(p, b.world));
      if (candidates.length && this.random() < dt * (0.3 + config.attractionStrength / 80)) {
        this.setState('investigate', 1.5 + this.random() * 2.2);
        this.targetId = candidates[0].spot.id;
      } else if (config.randomTurns && this.random() < config.turnFrequency * dt) {
        const angle = (this.random() < 0.5 ? -1 : 1) * (0.65 + this.random() * 1.5) * (0.35 + config.turnSharpness / 100);
        const h = Math.atan2(this.heading.y, this.heading.x) + angle;
        this.dartDirection = normalize({ x: Math.cos(h), y: Math.sin(h), z: (this.random() - 0.5) * 0.5 });
        this.setState('dart', 0.25 + this.random() * 0.35);
      }
    }

    let desired = { ...this.heading };
    let speed = config.speed;
    if (this.state === 'cruise') {
      // Smooth phase drift produces wandering without independent frame-to-frame noise.
      this.wanderPhase += dt * 1.3;
      const angle = Math.atan2(this.heading.y, this.heading.x) + Math.sin(this.wanderPhase) * 0.45;
      const depthPull = config.depthTravel === 0 ? 0 : clamp((this.depthTarget - p.z) / 19, -0.95, 0.95);
      desired = normalize({ x: Math.cos(angle) * 0.82, y: Math.sin(angle) * 0.82, z: depthPull });
      speed *= 0.89 + 0.1 * Math.sin(this.time * 2.1);
    } else if (this.state === 'dart') {
      desired = this.dartDirection;
      speed *= config.burstMultiplier;
    } else if (this.state === 'escape') {
      desired = this.escapeDirection;
      speed *= config.burstMultiplier * 1.13;
    } else if (this.state === 'investigate') {
      const spot = available.find(s => s.id === this.targetId);
      const center = spot ? spotWorld(spot, bounds) : this.pointerTarget;
      if (center) {
        const orbit = this.time * 5 + this.seed;
        const destination = {
          x: center.x + Math.cos(orbit) * 5.5,
          y: center.y + Math.sin(orbit) * 4,
          z: center.z + Math.sin(orbit * 0.6) * 3,
        };
        desired = normalize(sub(destination, p));
        speed *= clamp(distance(p, destination) / 11, 0.34, 0.92);
      }
    }

    // Soft boundary force always wins over attraction or wandering.
    const margin = 11;
    const avoidance = { x: 0, y: 0, z: 0 };
    if (p.x > xLimit - margin) avoidance.x -= (p.x - (xLimit - margin)) / margin;
    if (p.x < -xLimit + margin) avoidance.x += (-xLimit + margin - p.x) / margin;
    if (p.y > yLimit - margin) avoidance.y -= (p.y - (yLimit - margin)) / margin;
    if (p.y < -yLimit + margin) avoidance.y += (-yLimit + margin - p.y) / margin;
    if (p.z > maxZ - 8) avoidance.z -= (p.z - (maxZ - 8)) / 8;
    if (p.z < minZ + 8) avoidance.z += ((minZ + 8) - p.z) / 8;
    if (config.depthTravel === 0) avoidance.z = 0;
    desired = normalize({
      x: desired.x + avoidance.x * 3.5,
      y: desired.y + avoidance.y * 3.5,
      z: desired.z + avoidance.z * 2.6,
    });
    if (config.depthTravel === 0) desired = normalize({ ...desired, z: 0 });

    const radiansPerSecond = 1.3 + config.turnSharpness * 0.047;
    const oldHeading = this.heading;
    this.heading = rotateToward(this.heading, desired, radiansPerSecond * dt * (this.state === 'dart' || this.state === 'escape' ? 1.65 : 1));
    const targetVelocity = { x: this.heading.x * speed, y: this.heading.y * speed, z: this.heading.z * speed };
    this.velocity = moveToward(this.velocity, targetVelocity, (48 + config.turnSharpness * 1.5) * dt);
    this.lastLateral = clamp(oldHeading.x * this.heading.y - oldHeading.y * this.heading.x, -0.1, 0.1);
    p.x += this.velocity.x * dt;
    p.y += this.velocity.y * dt;
    p.z += this.velocity.z * dt;

    const newScale = (160 - p.z) / 160;
    // Leave room for the fly's full silhouette as perspective magnifies it.
    const maxX = Math.max(2.5, bounds.halfWidth * newScale - 5.5);
    const maxY = Math.max(5, 50 * newScale - 5.5);
    if (Math.abs(p.x) > maxX) { p.x = clamp(p.x, -maxX, maxX); this.velocity.x *= -0.3; }
    if (Math.abs(p.y) > maxY) { p.y = clamp(p.y, -maxY, maxY); this.velocity.y *= -0.3; }
    p.z = clamp(p.z, minZ, maxZ);
    if (config.depthTravel === 0) this.velocity.z = 0;
  }
}
