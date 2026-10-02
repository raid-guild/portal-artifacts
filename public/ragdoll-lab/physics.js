import * as CANNON from './vendor/cannon-es.js';
import { captureUpright, beginGetUp, sampleGetUp } from './getUp.js?v=getup-20261002b';

const RAD = Math.PI / 180;
const vec = ([x, y, z]) => new CANNON.Vec3(x, y, z);
const clonePose = body => ({ position: body.position.clone(), quaternion: body.quaternion.clone() });
const settingsDefault = Object.freeze({ gravity: 9.82, impactBoost: 1, damping: 0.08, friction: 0.6, slideGrip: 0.03, jointRange: 100, speed: 1, autoGetUp: true });

// Cannon's narrowphase sets each friction tangent's bound in force units, while
// GSSolver clamps an impulse. Scale by the step and split a body's contact budget
// across its contact points. Restore the bounds because equations are pooled.
export class TimeStepFrictionSolver extends CANNON.GSSolver {
  solve(dt, world) {
    const groups = new Map();
    for (const equation of this.equations) {
      if (!(equation instanceof CANNON.FrictionEquation)) continue;
      const a = Math.min(equation.bi.id, equation.bj.id);
      const b = Math.max(equation.bi.id, equation.bj.id);
      const key = `${a}:${b}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(equation);
    }
    const oldBounds = [];
    for (const equations of groups.values()) {
      const contactCount = Math.max(1, equations.length / 2);
      const factor = dt / contactCount;
      for (const equation of equations) {
        oldBounds.push([equation, equation.minForce, equation.maxForce]);
        equation.minForce *= factor;
        equation.maxForce *= factor;
      }
    }
    try { return super.solve(dt, world); }
    finally { for (const [equation, min, max] of oldBounds) { equation.minForce = min; equation.maxForce = max; } }
  }
}
export const BODY_IDS = Object.freeze(['pelvis', 'chest', 'head', 'left-upper-arm', 'left-forearm', 'left-thigh', 'left-shin', 'left-foot', 'right-upper-arm', 'right-forearm', 'right-thigh', 'right-shin', 'right-foot']);

export function validateProfile(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new TypeError('Physics profile must be an object');
  const profile = JSON.parse(JSON.stringify(input));
  const assets = { goatman: './assets/goatman-rigged.glb', vitalik: './assets/vitalik-rigged.glb' };
  if (profile.version !== 1 || !Object.hasOwn(assets, profile.id)) throw new RangeError('Unsupported physics profile');
  if (profile.asset !== assets[profile.id] || profile.coordinateSystem !== 'gltf-y-up' || profile.units !== 'meters') throw new RangeError('Invalid asset or coordinate system');
  const triple = value => Array.isArray(value) && value.length === 3 && value.every(Number.isFinite);
  const quaternion = value => Array.isArray(value) && value.length === 4 && value.every(Number.isFinite) && Math.abs(Math.hypot(...value) - 1) < .01;
  if (!profile.bounds || !triple(profile.bounds.min) || !triple(profile.bounds.max) || profile.bounds.min.some((value, i) => value >= profile.bounds.max[i])) throw new RangeError('Invalid profile bounds');
  if (!Array.isArray(profile.bodies) || profile.bodies.length !== 13 || !Array.isArray(profile.joints) || profile.joints.length !== 12) throw new RangeError('Profile needs 13 bodies and 12 joints');
  const ids = new Set();
  for (const body of profile.bodies) {
    if (!BODY_IDS.includes(body.id) || ids.has(body.id) || body.bone !== body.id || !Number.isFinite(body.mass) || body.mass <= 0 || !triple(body.position) || !quaternion(body.quaternion)) throw new RangeError(`Invalid body ${body.id}`);
    ids.add(body.id);
    const shape = body.shape;
    if (!shape || !['box', 'sphere', 'capsule'].includes(shape.type)) throw new RangeError(`Invalid shape for ${body.id}`);
    if (shape.type === 'box' && (!triple(shape.halfExtents) || shape.halfExtents.some(value => value <= 0))) throw new RangeError(`Invalid box for ${body.id}`);
    if (shape.type === 'sphere' && (!Number.isFinite(shape.radius) || shape.radius <= 0)) throw new RangeError(`Invalid sphere for ${body.id}`);
    if (shape.type === 'capsule' && (!Number.isFinite(shape.radius) || shape.radius <= 0 || !Number.isFinite(shape.totalLength) || shape.totalLength < 2 * shape.radius)) throw new RangeError(`Invalid capsule for ${body.id}`);
  }
  if (ids.size !== BODY_IDS.length) throw new RangeError('Missing canonical body IDs');
  const children = new Set();
  for (const joint of profile.joints) {
    if (!ids.has(joint.parent) || !ids.has(joint.child) || joint.parent === joint.child || children.has(joint.child) || !triple(joint.anchor) || !triple(joint.axis) || !triple(joint.tangent) || !Number.isFinite(joint.swingDegrees) || !Number.isFinite(joint.twistDegrees) || joint.swingDegrees <= 0 || joint.swingDegrees > 180 || joint.twistDegrees <= 0 || joint.twistDegrees > 180) throw new RangeError(`Invalid joint ${joint.parent}–${joint.child}`);
    if (Math.abs(Math.hypot(...joint.axis) - 1) > .01 || Math.abs(Math.hypot(...joint.tangent) - 1) > .01 || Math.abs(joint.axis.reduce((sum, value, i) => sum + value * joint.tangent[i], 0)) > .01) throw new RangeError(`Joint frames must be perpendicular unit vectors: ${joint.parent}–${joint.child}`);
    children.add(joint.child);
  }
  if (children.has('pelvis') || children.size !== 12) throw new RangeError('Joint hierarchy must root at pelvis');
  const reachable = new Set(['pelvis']);
  for (let pass = 0; pass < 12; pass++) {
    for (const joint of profile.joints) if (reachable.has(joint.parent)) reachable.add(joint.child);
  }
  if (reachable.size !== 13) throw new RangeError('Joint hierarchy must connect every body');
  return profile;
}

// Cannon chooses each body's twist tangent independently. Mirrored limbs can then
// start nearly 180 degrees apart and receive torque even while the pose is at rest.
class AlignedConeTwistConstraint extends CANNON.ConeTwistConstraint {
  constructor(bodyA, bodyB, options, worldTangent) {
    super(bodyA, bodyB, options);
    this.twistLocalA = bodyA.vectorToLocalFrame(worldTangent);
    this.twistLocalB = bodyB.vectorToLocalFrame(worldTangent);
  }

  update() {
    super.update();
    this.bodyA.vectorToWorldFrame(this.twistLocalA, this.twistEquation.axisA);
    this.bodyB.vectorToWorldFrame(this.twistLocalB, this.twistEquation.axisB);
  }
}

export function createSimulation(initialProfile = null) {
  let profile = initialProfile === null ? null : validateProfile(initialProfile);
  const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0), solver: new TimeStepFrictionSolver() });
  world.solver.iterations = 20;
  world.allowSleep = true;
  world.defaultContactMaterial.restitution = 0.02;
  const bodyMaterial = new CANNON.Material('body');
  const groundMaterial = new CANNON.Material('ground');
  const slideMaterial = new CANNON.Material('slide');
  const contact = new CANNON.ContactMaterial(bodyMaterial, groundMaterial, { friction: settingsDefault.friction, restitution: 0.015 });
  world.addContactMaterial(contact);
  const slideContact = new CANNON.ContactMaterial(bodyMaterial, slideMaterial, { friction: settingsDefault.slideGrip, restitution: 0.005 });
  world.addContactMaterial(slideContact);
  const settings = { ...settingsDefault };
  const bodies = [];
  const joints = [];
  const staticBodies = [];
  const instances = [];
  let buildingInstance = null;
  let scene = 'drop';
  let paused = true;
  let time = 0;
  let accumulator = 0;
  let drag = null;
  let stairStarted = false;
  let bowlingStarted = false;
  let sapBroadphase = null;
  const pendingBoosts = [];

  function centerOfMass(instance) {
    const center = new CANNON.Vec3();
    let mass = 0;
    for (const body of instance.bodies) { center.x += body.position.x * body.mass; center.y += body.position.y * body.mass; center.z += body.position.z * body.mass; mass += body.mass; }
    return center.scale(1 / mass);
  }
  function queueImpactBoost(instance, source, closingSpeed) {
    if (settings.impactBoost === 0) return;
    const center = centerOfMass(instance);
    const sourceCenter = centerOfMass(source);
    const strength = Math.min(closingSpeed / 6, 1) * settings.impactBoost;
    if (scene === 'plinko') {
      const side = Math.abs(center.x - sourceCenter.x) < 1e-4 ? 0 : Math.sign(center.x - sourceCenter.x);
      pendingBoosts.push({ instance, delta: new CANNON.Vec3(side * .8 * strength, -2 * strength, 0) });
      return;
    }
    let dx = center.x - sourceCenter.x, dz = center.z - sourceCenter.z;
    let length = Math.hypot(dx, dz);
    if (length < 1e-5) {
      const velocity = source.bodies.reduce((total, body) => total.vadd(body.velocity, total), new CANNON.Vec3());
      dx = velocity.x; dz = velocity.z; length = Math.hypot(dx, dz);
    }
    if (length < 1e-5) { dx = 0; dz = 1; length = 1; }
    pendingBoosts.push({ instance, delta: new CANNON.Vec3(dx / length * 2.5 * strength, 4 * strength, dz / length * 2.5 * strength) });
  }
  function applyPendingBoosts() {
    for (const { instance, delta } of pendingBoosts) {
      for (const body of instance.bodies) {
        body.applyImpulse(new CANNON.Vec3(body.mass * delta.x, body.mass * delta.y, body.mass * delta.z), new CANNON.Vec3());
      }
      wakeRagdoll(instance);
    }
    pendingBoosts.length = 0;
  }
  function wakeRagdoll(instance = null) {
    if (!instance) { for (const one of instances) wakeRagdoll(one); return; }
    if (instance.propagatingWake) return;
    instance.propagatingWake = true;
    try { for (const body of instance.bodies) body.wakeUp(); }
    finally { instance.propagatingWake = false; }
  }
  const supportIds = new Set(['floor', 'ground', 'deck', 'board-floor']);
  function supportFor(instance) {
    const pelvis = instance.bodyById.get('pelvis');
    let chosen = null;
    for (const support of staticBodies) {
      if (!supportIds.has(support.idTag)) continue;
      const top = support.position.y + support.halfExtentsTag[1];
      const margin = .65;
      if (Math.abs(pelvis.position.x - support.position.x) > support.halfExtentsTag[0] - margin ||
          Math.abs(pelvis.position.z - support.position.z) > support.halfExtentsTag[2] - margin) continue;
      if (pelvis.position.y < top - .05 || pelvis.position.y > top + instance.upright.pelvisHeight * .82) continue;
      const grounded = instance.bodies.some(body => {
        body.updateAABB();
        return body.aabb.lowerBound.y <= top + .075 && body.aabb.upperBound.y >= top - .075 &&
          body.aabb.lowerBound.x < support.position.x + support.halfExtentsTag[0] && body.aabb.upperBound.x > support.position.x - support.halfExtentsTag[0] &&
          body.aabb.lowerBound.z < support.position.z + support.halfExtentsTag[2] && body.aabb.upperBound.z > support.position.z - support.halfExtentsTag[2];
      });
      if (grounded && (!chosen || top > chosen.top)) chosen = { body: support, top };
    }
    if (!chosen) return null;
    // Kinematic recovery has no static-body solver response. Require an open column.
    for (const obstacle of staticBodies) {
      if (obstacle === chosen.body || supportIds.has(obstacle.idTag)) continue;
      obstacle.updateAABB();
      if (obstacle.aabb.upperBound.y < chosen.top + .15 || obstacle.aabb.lowerBound.y > chosen.top + instance.upright.pelvisHeight * 2.4) continue;
      if (obstacle.aabb.lowerBound.x < pelvis.position.x + .55 && obstacle.aabb.upperBound.x > pelvis.position.x - .55 &&
          obstacle.aabb.lowerBound.z < pelvis.position.z + .55 && obstacle.aabb.upperBound.z > pelvis.position.z - .55) return null;
    }
    for (const other of instances) {
      if (other === instance) continue;
      const p = other.bodyById.get('pelvis')?.position;
      if (p && Math.hypot(p.x - pelvis.position.x, p.z - pelvis.position.z) < .95 && Math.abs(p.y - pelvis.position.y) < 2) return null;
    }
    return chosen;
  }
  function recoverySweepClear(instance, recovery, support) {
    const originals = instance.bodies.map(body => ({ body, position: body.position.clone(), quaternion: body.quaternion.clone() }));
    try {
      for (const progress of [0, .25, .55, .8, 1]) {
        const poses = sampleGetUp(recovery, progress);
        let lowest = Infinity;
        for (const body of instance.bodies) {
          const pose = poses.get(body.idTag);
          body.position.copy(pose.position); body.quaternion.copy(pose.quaternion);
          body.updateAABB(); lowest = Math.min(lowest, body.aabb.lowerBound.y);
        }
        const lift = Math.max(0, recovery.supportTop + .006 - lowest);
        for (const body of instance.bodies) {
          body.position.y += lift; body.updateAABB();
          const a = body.aabb;
          if (a.lowerBound.x < support.position.x - support.halfExtentsTag[0] + .03 ||
              a.upperBound.x > support.position.x + support.halfExtentsTag[0] - .03 ||
              a.lowerBound.z < support.position.z - support.halfExtentsTag[2] + .03 ||
              a.upperBound.z > support.position.z + support.halfExtentsTag[2] - .03) return false;
          for (const obstacle of staticBodies) {
            if (obstacle === support || supportIds.has(obstacle.idTag)) continue;
            obstacle.updateAABB();
            if (a.overlaps(obstacle.aabb)) return false;
          }
          for (const other of instances) {
            if (other === instance) continue;
            for (const otherBody of other.bodies) {
              otherBody.updateAABB();
              if (a.overlaps(otherBody.aabb)) return false;
            }
          }
        }
      }
      return true;
    } finally {
      for (const { body, position, quaternion } of originals) {
        body.position.copy(position); body.quaternion.copy(quaternion); body.updateAABB();
      }
    }
  }
  function releaseGetUp(instance) {
    if (instance.state !== 'recovering' && instance.state !== 'standing') return;
    instance.state = 'ragdoll'; instance.recovery = null; instance.quietSeconds = 0;
    instance.cooldownUntil = time + 2;
    for (const body of instance.bodies) {
      body.type = CANNON.Body.DYNAMIC;
      body.updateMassProperties();
      body.previousPosition.copy(body.position);
      body.previousQuaternion.copy(body.quaternion);
      body.aabbNeedsUpdate = true;
    }
    for (const joint of instance.joints) for (const equation of joint.equations) equation.enabled = true;
    wakeRagdoll(instance);
  }
  function updateGetUp(dt) {
    for (const instance of instances) {
      if (instance.held) continue;
      if (instance.state === 'recovering') {
        const recovery = instance.recovery;
        recovery.elapsed = Math.min(recovery.duration, recovery.elapsed + dt);
        const poses = sampleGetUp(recovery, recovery.elapsed / recovery.duration);
        let lowest = Infinity;
        for (const body of instance.bodies) {
          const pose = poses.get(body.idTag);
          body.position.copy(pose.position); body.quaternion.copy(pose.quaternion);
          body.updateAABB(); lowest = Math.min(lowest, body.aabb.lowerBound.y);
        }
        const lift = Math.max(0, recovery.supportTop + .006 - lowest);
        for (const body of instance.bodies) {
          body.position.y += lift;
          body.velocity.setZero(); body.angularVelocity.setZero();
          body.aabbNeedsUpdate = true;
        }
        if (recovery.elapsed >= recovery.duration) instance.state = 'standing';
      } else if (instance.state === 'standing') {
        if (!settings.autoGetUp || settings.gravity <= 0 || !supportForStanding(instance)) releaseGetUp(instance);
      } else {
        if (!settings.autoGetUp || settings.gravity <= 0 || time < instance.cooldownUntil || drag?.body.ragdollInstance === instance) { instance.quietSeconds = 0; continue; }
        const support = supportFor(instance);
        if (!support) { instance.quietSeconds = 0; instance.state = 'ragdoll'; continue; }
        const quiet = instance.bodies.every(body => body.sleepState === CANNON.Body.SLEEPING ||
          (body.velocity.length() < .10 && body.angularVelocity.length() < .16));
        instance.quietSeconds = quiet ? instance.quietSeconds + dt : 0;
        instance.state = quiet ? 'settling' : 'ragdoll';
        if (instance.quietSeconds < 1) continue;
        const recovery = beginGetUp(instance, support.top, settings.jointRange);
        if (!recoverySweepClear(instance, recovery, support.body)) { instance.quietSeconds = 0; instance.state = 'ragdoll'; instance.cooldownUntil = time + 1; continue; }
        instance.recovery = recovery;
        instance.state = 'recovering'; instance.quietSeconds = 0;
        for (const body of instance.bodies) {
          body.type = CANNON.Body.KINEMATIC;
          body.velocity.setZero(); body.angularVelocity.setZero(); body.force.setZero(); body.torque.setZero();
          body.updateMassProperties();
        }
        for (const joint of instance.joints) for (const equation of joint.equations) equation.enabled = false;
      }
    }
  }
  function supportForStanding(instance) {
    const pelvis = instance.bodyById.get('pelvis').position;
    return staticBodies.some(support => supportIds.has(support.idTag) &&
      Math.abs(pelvis.x - support.position.x) < support.halfExtentsTag[0] - .5 &&
      Math.abs(pelvis.z - support.position.z) < support.halfExtentsTag[2] - .5 &&
      Math.abs(pelvis.y - (support.position.y + support.halfExtentsTag[1] + instance.upright.pelvisHeight)) < .35);
  }

  function newInstance(id, role = 'single') {
    const instance = { id, role, held: false, bodies: [], joints: [], bodyById: new Map(), propagatingWake: false,
      state: 'ragdoll', quietSeconds: 0, cooldownUntil: 0, recovery: null, upright: null, onWake: null, onCollide: null };
    instance.onWake = () => wakeRagdoll(instance);
    instance.onCollide = event => {
      if (instance.state !== 'standing' && instance.state !== 'recovering') return;
      const other = event.body;
      if (!other?.ragdollInstance || other.ragdollInstance === instance || other.ragdollInstance.held) return;
      if (event.contact.getImpactVelocityAlongNormal() > .8) releaseGetUp(instance);
    };
    instances.push(instance);
    return instance;
  }

  function rigid(id, shape, mass, position, quaternion = new CANNON.Quaternion()) {
    const body = new CANNON.Body({ mass, material: bodyMaterial, linearDamping: settings.damping, angularDamping: Math.min(0.95, settings.damping + 0.12), allowSleep: true });
    body.addShape(shape);
    body.position.copy(vec(position));
    body.quaternion.copy(quaternion);
    body.idTag = id;
    body.instanceId = buildingInstance?.id ?? 'single';
    body.bodyKey = `${body.instanceId}:${id}`;
    body.ragdollInstance = buildingInstance;
    body.shapeTag = shape;
    body.previousPosition = body.position.clone();
    body.previousQuaternion = body.quaternion.clone();
    body.addEventListener('wakeup', buildingInstance.onWake);
    body.addEventListener('collide', buildingInstance.onCollide);
    world.addBody(body);
    bodies.push(body);
    buildingInstance.bodies.push(body);
    buildingInstance.bodyById.set(id, body);
    return body;
  }
  function limb(id, from, to, radius, mass) {
    const a = vec(from), b = vec(to);
    const middle = a.vadd(b).scale(0.5);
    const delta = b.vsub(a);
    const length = delta.length();
    const q = new CANNON.Quaternion();
    q.setFromVectors(new CANNON.Vec3(0, 1, 0), delta.unit());
    // The cylinder in cannon-es is Y-aligned. Spheres round its ends while leaving a clean visual capsule.
    const shape = new CANNON.Cylinder(radius, radius, Math.max(0.04, length - 2 * radius), 10);
    const body = rigid(id, shape, mass, [middle.x, middle.y, middle.z], q);
    const capShape = new CANNON.Sphere(radius);
    body.addShape(capShape, new CANNON.Vec3(0, -Math.max(0, length / 2 - radius), 0));
    body.addShape(capShape, new CANNON.Vec3(0, Math.max(0, length / 2 - radius), 0));
    return body;
  }
  function join(a, b, anchor, angle, twist, axis = [0, 1, 0], tangent = [0, 0, 1]) {
    const worldPoint = vec(anchor);
    const pivotA = a.pointToLocalFrame(worldPoint);
    const pivotB = b.pointToLocalFrame(worldPoint);
    const localAxisA = a.vectorToLocalFrame(vec(axis));
    const localAxisB = b.vectorToLocalFrame(vec(axis));
    const constraint = new AlignedConeTwistConstraint(a, b, {
      pivotA, pivotB, axisA: localAxisA, axisB: localAxisB,
      angle: angle * RAD, twistAngle: twist * RAD, maxForce: 1e5,
      collideConnected: false
    }, vec(tangent));
    constraint.baseAngle = angle * RAD;
    constraint.baseTwist = twist * RAD;
    world.addConstraint(constraint);
    joints.push(constraint);
    buildingInstance.joints.push(constraint);
  }
  function staticBox(id, center, halfExtents, material = groundMaterial, quaternion = null) {
    const body = new CANNON.Body({ mass: 0, material });
    body.addShape(new CANNON.Box(vec(halfExtents)));
    body.position.copy(vec(center));
    if (quaternion) body.quaternion.copy(quaternion);
    body.idTag = id;
    body.halfExtentsTag = halfExtents;
    world.addBody(body);
    staticBodies.push(body);
  }
  function makeEnvironment() {
    if (scene === 'plinko') {
      staticBox('board-floor', [0, -.2, 0], [4.6, .2, .7]);
      for (const side of [-1, 1]) staticBox(`board-side-${side}`, [side * 4.6, 10, 0], [.15, 10, .7], slideMaterial);
      staticBox('board-back', [0, 10, -.65], [4.6, 10, .1], slideMaterial);
      staticBox('board-front', [0, 10, .65], [4.6, 10, .1], slideMaterial);
      return;
    }
    if (scene === 'bowling') {
      staticBox('ground', [0, -1.15, -3], [15, .15, 42]);
      const points = [[-26, 12], [-16, 8.5], [0, 2.5], [8, .25]];
      for (let i = 0; i < points.length - 1; i++) {
        const [z0, y0] = points[i], [z1, y1] = points[i + 1];
        const angle = Math.atan2(y0 - y1, z1 - z0);
        const q = new CANNON.Quaternion();
        q.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), angle);
        const length = Math.hypot(z1 - z0, y1 - y0);
        staticBox(`slide-${i}`, [0, (y0 + y1) / 2 - .12, (z0 + z1) / 2], [1.8, .12, length / 2], slideMaterial, q);
        for (const side of [-1, 1]) staticBox(`rail-${i}-${side}`, [side * 1.94, (y0 + y1) / 2 + .28, (z0 + z1) / 2], [.14, .42, length / 2], groundMaterial, q);
      }
      staticBox('deck', [0, -.15, 14], [3.6, .15, 7]);
      for (const side of [-1, 1]) staticBox(`deck-rail-${side}`, [side * 3.74, .22, 14], [.14, .37, 7]);
      return;
    }
    staticBox('floor', [0, -0.15, 0], [40, 0.15, 40]);
    if (scene === 'stairs') {
      // Descending broad treads leave a clear path through the body's fall.
      for (let i = 0; i < 5; i++) {
        staticBox(`step-${i}`, [i * 0.7 - 1.65, 0.15 + (4 - i) * 0.20, 0], [0.35, 0.15 + (4 - i) * 0.20, 1.15]);
      }
    }
  }
  function transformInstance(instance, rotation, from, to) {
    for (const body of instance.bodies) {
      const relative = body.position.vsub(from);
      rotation.vmult(relative, relative);
      body.position.copy(to.vadd(relative));
      body.quaternion.copy(rotation.mult(body.quaternion));
      body.previousPosition.copy(body.position);
      body.previousQuaternion.copy(body.quaternion);
      body.aabbNeedsUpdate = true;
    }
  }
  function holdInstance(instance) {
    instance.held = true;
    for (const body of instance.bodies) {
      body.type = CANNON.Body.KINEMATIC;
      body.velocity.setZero();
      body.angularVelocity.setZero();
      body.updateMassProperties();
      body.onPinCollide = event => {
        const other = event.body;
        const source = other?.ragdollInstance;
        if (!instance.held || !source || source === instance || source.held) return;
        const closingSpeed = event.contact.getImpactVelocityAlongNormal();
        if (!(closingSpeed > .6)) return;
        releaseInstance(instance);
        if (drag?.body.ragdollInstance !== source) queueImpactBoost(instance, source, closingSpeed);
      };
      body.addEventListener('collide', body.onPinCollide);
    }
    for (const joint of instance.joints) for (const equation of joint.equations) equation.enabled = false;
  }
  function releaseInstance(instance) {
    if (!instance?.held) return false;
    instance.held = false;
    for (const body of instance.bodies) {
      body.type = CANNON.Body.DYNAMIC;
      body.updateMassProperties();
      body.wakeUp();
    }
    for (const joint of instance.joints) for (const equation of joint.equations) equation.enabled = true;
    wakeRagdoll(instance);
    return true;
  }
  function makeBowlingRagdolls() {
    const projectile = newInstance('projectile', 'projectile');
    buildingInstance = projectile;
    makeRagdoll();
    const lie = new CANNON.Quaternion();
    lie.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    transformInstance(projectile, lie, new CANNON.Vec3(0, 1.95, 0), new CANNON.Vec3(0, 12.1, -24));
    for (let row = 0, index = 0; row < 4; row++) {
      for (let column = 0; column <= row; column++, index++) {
        const instance = newInstance(`pin-${String(index + 1).padStart(2, '0')}`, 'pin');
        buildingInstance = instance;
        makeRagdoll();
        const x = (column - row / 2) * 1.13;
        const z = 11 + row * 1.55;
        transformInstance(instance, new CANNON.Quaternion(), new CANNON.Vec3(0, .95, 0), new CANNON.Vec3(x, 0, z));
        holdInstance(instance);
      }
    }
    buildingInstance = null;
  }
  function makePlinkoRagdolls() {
    const dropper = newInstance('dropper', 'dropper');
    buildingInstance = dropper;
    makeRagdoll();
    transformInstance(dropper, new CANNON.Quaternion(), new CANNON.Vec3(0, .95, 0), new CANNON.Vec3(.12, 17.2, 0));
    for (let row = 0, index = 0; row < 5; row++) {
      for (let column = 0; column <= row; column++, index++) {
        const instance = newInstance(`target-${String(index + 1).padStart(2, '0')}`, 'target');
        buildingInstance = instance;
        makeRagdoll();
        const x = (column - row / 2) * 1.8;
        const footBase = 14 - 3 * row;
        transformInstance(instance, new CANNON.Quaternion(), new CANNON.Vec3(0, .95, 0), new CANNON.Vec3(x, footBase, 0));
        instance.row = row;
        holdInstance(instance);
      }
    }
    buildingInstance = null;
  }
  function makeRagdoll() {
    if (profile) { makeProfileRagdoll(); return; }
    const ox = scene === 'stairs' ? -1.55 : 0;
    const oy = scene === 'stairs' ? 1.80 : 0.95;
    const p = (x, y, z = 0) => [x + ox, y + oy, z];
    const pelvis = rigid('pelvis', new CANNON.Box(new CANNON.Vec3(0.21, 0.14, 0.12)), 9, p(0, 1.12));
    const chest = rigid('chest', new CANNON.Box(new CANNON.Vec3(0.27, 0.22, 0.15)), 13, p(0, 1.49));
    const head = rigid('head', new CANNON.Sphere(0.15), 4, p(0, 1.92));
    join(pelvis, chest, p(0, 1.29), 20, 14);
    join(chest, head, p(0, 1.76), 30, 22);
    for (const side of [-1, 1]) {
      const name = side < 0 ? 'left' : 'right';
      const upperArm = limb(`${name}-upper-arm`, p(side * .31, 1.65), p(side * .61, 1.43), .085, 2.2);
      const forearm = limb(`${name}-forearm`, p(side * .61, 1.43), p(side * .83, 1.18), .07, 1.6);
      const thigh = limb(`${name}-thigh`, p(side * .14, 1.00), p(side * .17, .62), .115, 6);
      const shin = limb(`${name}-shin`, p(side * .17, .62), p(side * .18, .25), .09, 4);
      const foot = rigid(`${name}-foot`, new CANNON.Box(new CANNON.Vec3(.105, .065, .19)), 1.2, p(side * .18, .12, .07));
      join(chest, upperArm, p(side * .31, 1.65), 85, 45, [side, 0, 0]);
      join(upperArm, forearm, p(side * .61, 1.43), 70, 30, [side, 0, 0]);
      join(pelvis, thigh, p(side * .14, 1.00), 55, 30);
      join(thigh, shin, p(side * .17, .62), 70, 25);
      join(shin, foot, p(side * .18, .25), 20, 15);
    }
    buildingInstance.upright = captureUpright(buildingInstance);
    if (scene === 'stairs') {
      const tilt = new CANNON.Quaternion();
      tilt.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), -0.13);
      const center = vec(p(0, 1.2));
      for (const body of buildingInstance.bodies) {
        const relative = body.position.vsub(center);
        tilt.vmult(relative, relative);
        body.position.copy(center.vadd(relative));
        body.quaternion = tilt.mult(body.quaternion);
      }
    }
    for (const body of buildingInstance.bodies) {
      body.previousPosition.copy(body.position);
      body.previousQuaternion.copy(body.quaternion);
    }
  }
  function makeProfileRagdoll() {
    const ox = scene === 'stairs' ? -1.55 : 0;
    const oy = scene === 'stairs' ? 1.80 : .95;
    const place = value => [value[0] + ox, value[1] + oy, value[2]];
    const byId = new Map();
    for (const spec of profile.bodies) {
      const shape = spec.shape;
      const collider = shape.type === 'box' ? new CANNON.Box(vec(shape.halfExtents)) :
        shape.type === 'sphere' ? new CANNON.Sphere(shape.radius) :
        new CANNON.Cylinder(shape.radius, shape.radius, Math.max(.001, shape.totalLength - 2 * shape.radius), 10);
      const body = rigid(spec.id, collider, spec.mass, place(spec.position), new CANNON.Quaternion(...spec.quaternion));
      // Goatman bodies collide with the ground and nonconnected limbs. Each joint
      // disables collision only for its directly connected pair.
      body.collisionFilterGroup = 2;
      body.collisionFilterMask = 3;
      if (shape.type === 'capsule') {
        const extent = shape.totalLength / 2 - shape.radius;
        body.addShape(new CANNON.Sphere(shape.radius), new CANNON.Vec3(0, -extent, 0));
        body.addShape(new CANNON.Sphere(shape.radius), new CANNON.Vec3(0, extent, 0));
      }
      byId.set(spec.id, body);
    }
    for (const joint of profile.joints) {
      join(byId.get(joint.parent), byId.get(joint.child), place(joint.anchor), joint.swingDegrees, joint.twistDegrees, joint.axis, joint.tangent);
    }
    buildingInstance.upright = captureUpright(buildingInstance);
    if (scene === 'stairs') {
      const tilt = new CANNON.Quaternion();
      tilt.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), -.13);
      const center = vec([ox, oy + 1.2, 0]);
      for (const body of buildingInstance.bodies) {
        const relative = body.position.vsub(center);
        tilt.vmult(relative, relative);
        body.position.copy(center.vadd(relative));
        body.quaternion = tilt.mult(body.quaternion);
      }
    }
    for (const body of buildingInstance.bodies) {
      body.previousPosition.copy(body.position);
      body.previousQuaternion.copy(body.quaternion);
    }
  }
  function clearDrag() {
    if (!drag) return;
    world.removeConstraint(drag.constraint);
    world.removeBody(drag.mouseBody);
    drag = null;
  }
  function reset(nextScene = scene) {
    if (!['drop', 'stairs', 'bowling', 'plinko'].includes(nextScene)) throw new RangeError('Unknown scene');
    clearDrag();
    pendingBoosts.length = 0;
    for (const joint of joints) world.removeConstraint(joint);
    for (const body of bodies) {
      body.removeEventListener('wakeup', body.ragdollInstance.onWake);
      body.removeEventListener('collide', body.ragdollInstance.onCollide);
      if (body.onPinCollide) body.removeEventListener('collide', body.onPinCollide);
    }
    for (const body of [...bodies, ...staticBodies]) world.removeBody(body);
    bodies.length = joints.length = staticBodies.length = 0;
    instances.length = 0;
    buildingInstance = null;
    scene = nextScene;
    world.gravity.y = -settings.gravity;
    // Corrected contact friction exposes small contact-manifold changes in the
    // passive poses. These iteration counts solve those contacts without changing
    // sleep thresholds or pinning bodies in place.
    world.solver.iterations = scene === 'bowling' || scene === 'plinko' ? (profile ? 40 : 20) : profile ? (scene === 'stairs' ? 60 : 90) : (scene === 'drop' ? 30 : 20);
    if (scene === 'bowling' || scene === 'plinko') {
      if (!sapBroadphase) sapBroadphase = new CANNON.SAPBroadphase(world);
      sapBroadphase.setWorld(world);
      sapBroadphase.axisIndex = scene === 'plinko' ? 1 : 2;
      world.broadphase = sapBroadphase;
    } else world.broadphase = new CANNON.NaiveBroadphase();
    time = accumulator = 0;
    paused = true;
    stairStarted = false;
    bowlingStarted = false;
    makeEnvironment();
    if (scene === 'bowling') makeBowlingRagdolls();
    else if (scene === 'plinko') makePlinkoRagdolls();
    else {
      buildingInstance = newInstance('single');
      makeRagdoll();
      buildingInstance = null;
    }
    setJointRange(settings.jointRange);
    return snapshot();
  }
  function setJointRange(value) {
    if (!Number.isFinite(value) || value < 25 || value > 125) throw new RangeError('Joint range must be 25–125');
    settings.jointRange = value;
    const scale = value / 100;
    for (const joint of joints) {
      joint.angle = joint.baseAngle * scale;
      joint.twistAngle = joint.baseTwist * scale;
    }
    wakeRagdoll();
  }
  function configure(values) {
    if (values == null || typeof values !== 'object' || Array.isArray(values)) throw new TypeError('Settings must be an object');
    const allowed = new Set(['gravity', 'impactBoost', 'damping', 'friction', 'slideGrip', 'jointRange', 'speed', 'autoGetUp']);
    for (const [key, value] of Object.entries(values)) {
      if (!allowed.has(key)) throw new RangeError(`Unknown setting: ${key}`);
      const valid = key === 'autoGetUp' ? typeof value === 'boolean' : key === 'speed' ? [0.25, 0.5, 1].includes(value) :
        key === 'jointRange' ? Number.isFinite(value) && value >= 25 && value <= 125 :
        Number.isFinite(value) && value >= 0 && value <= (key === 'gravity' ? 20 : key === 'impactBoost' ? 2 : key === 'damping' ? 0.8 : key === 'slideGrip' ? .5 : 1);
      if (!valid) throw new RangeError(`Invalid ${key}`);
    }
    if ('jointRange' in values) setJointRange(values.jointRange);
    if ('damping' in values) {
      settings.damping = values.damping;
      for (const body of bodies) { body.linearDamping = values.damping; body.angularDamping = Math.min(.95, values.damping + .12); }
    }
    if ('friction' in values) { settings.friction = values.friction; contact.friction = values.friction; }
    if ('slideGrip' in values) { settings.slideGrip = values.slideGrip; slideContact.friction = values.slideGrip; }
    if ('gravity' in values) {
      settings.gravity = values.gravity;
      world.gravity.y = -values.gravity;
      for (const instance of instances) if (!instance.held) wakeRagdoll(instance);
      if (values.gravity <= 0) for (const instance of instances) releaseGetUp(instance);
    }
    if ('autoGetUp' in values) {
      settings.autoGetUp = values.autoGetUp;
      if (!values.autoGetUp) for (const instance of instances) releaseGetUp(instance);
    }
    if ('impactBoost' in values) settings.impactBoost = values.impactBoost;
    if ('speed' in values) settings.speed = values.speed;
    if ('damping' in values || 'friction' in values || 'slideGrip' in values) wakeRagdoll();
    return snapshot();
  }
  function setPaused(value) {
    const startingStairs = paused && !value && scene === 'stairs' && !stairStarted;
    paused = Boolean(value);
    accumulator = 0;
    if (startingStairs) {
      const chest = instances[0].bodyById.get('chest');
      chest.applyImpulse(new CANNON.Vec3(13, 0, 0), new CANNON.Vec3(0, .16, 0));
      wakeRagdoll();
      stairStarted = true;
    }
    if (paused === false && scene === 'bowling' && !bowlingStarted) {
      const projectile = instances[0];
      for (const body of projectile.bodies) body.velocity.z += 2.4;
      wakeRagdoll(projectile);
      bowlingStarted = true;
    }
    return paused;
  }
  function step(deltaSeconds) {
    if (paused || !Number.isFinite(deltaSeconds) || deltaSeconds <= 0) return 0;
    accumulator += Math.min(deltaSeconds, .1) * settings.speed;
    const dt = 1 / 120;
    let count = 0;
    while (accumulator >= dt && count < 12) {
      for (const body of bodies) {
        body.previousPosition.copy(body.position);
        body.previousQuaternion.copy(body.quaternion);
      }
      world.step(dt); applyPendingBoosts(); accumulator -= dt; time += dt; updateGetUp(dt); count++;
    }
    if (count === 12) accumulator = Math.min(accumulator, dt);
    return count;
  }
  function beginDrag(body, worldPoint) {
    if (!bodies.includes(body)) return false;
    clearDrag();
    releaseGetUp(body.ragdollInstance);
    if (body.ragdollInstance.held) releaseInstance(body.ragdollInstance);
    const mouseBody = new CANNON.Body({ mass: 0, type: CANNON.Body.KINEMATIC, collisionFilterGroup: 0, collisionFilterMask: 0 });
    mouseBody.position.copy(vec(worldPoint));
    world.addBody(mouseBody);
    const pivot = body.pointToLocalFrame(vec(worldPoint));
    const constraint = new CANNON.PointToPointConstraint(body, pivot, mouseBody, new CANNON.Vec3(), 150);
    constraint.collideConnected = false;
    world.addConstraint(constraint);
    drag = { body, mouseBody, constraint };
    wakeRagdoll(body.ragdollInstance);
    return true;
  }
  function moveDrag(worldPoint) {
    if (!drag) return;
    drag.mouseBody.position.copy(vec(worldPoint));
    drag.mouseBody.velocity.setZero();
    wakeRagdoll(drag.body.ragdollInstance);
  }
  function endDrag() { if (drag) { const instance = drag.body.ragdollInstance; clearDrag(); instance.cooldownUntil = time + 2; wakeRagdoll(instance); } }
  function setProfile(nextProfile) {
    const validated = nextProfile === null ? null : validateProfile(nextProfile);
    profile = validated;
    return reset();
  }
  function snapshot() {
    const targets = instances.filter(instance => instance.role === 'pin' || instance.role === 'target');
    return { scene, profileId: profile?.id ?? 'mannequin', paused, time, settings: { ...settings }, bodies: bodies.length, joints: joints.length,
      instances: instances.map(instance => ({ id: instance.id, role: instance.role, held: instance.held, state: instance.state })),
      recoveringCount: instances.filter(instance => instance.state === 'recovering').length,
      standingCount: instances.filter(instance => instance.state === 'standing').length,
      releasedPins: instances.filter(instance => instance.role === 'pin' && !instance.held).length,
      releasedTargets: targets.filter(instance => !instance.held).length, totalTargets: targets.length,
      sleepingBodies: bodies.filter(body => body.sleepState === CANNON.Body.SLEEPING).length,
      movingBodies: bodies.filter(body => body.sleepState !== CANNON.Body.SLEEPING && !body.ragdollInstance.held).map(body => ({ id: body.bodyKey, speed: body.velocity.length(), angularSpeed: body.angularVelocity.length(), sleepState: body.sleepState })), dragging: Boolean(drag) };
  }
  function readFrame() { const targets = instances.filter(instance => instance.role === 'pin' || instance.role === 'target'); return { scene, profileId: profile?.id ?? 'mannequin', paused, time, recoveringCount: instances.filter(instance => instance.state === 'recovering').length, standingCount: instances.filter(instance => instance.state === 'standing').length, releasedPins: instances.filter(instance => instance.role === 'pin' && !instance.held).length, releasedTargets: targets.filter(instance => !instance.held).length, totalTargets: targets.length }; }
  reset();
  return { world, bodies, joints, staticBodies, instances, settings, reset, setProfile, configure, setPaused, step, beginDrag, moveDrag, endDrag, snapshot, readFrame, clonePose, interpolationAlpha: () => paused ? 1 : Math.min(1, accumulator / (1 / 120)) };
}
