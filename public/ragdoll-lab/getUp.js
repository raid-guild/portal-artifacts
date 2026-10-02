import * as CANNON from './vendor/cannon-es.js';

const axisX = new CANNON.Vec3(1, 0, 0);
const smooth = t => { const u = Math.max(0, Math.min(1, t)); return u * u * (3 - 2 * u); };
const tilt = degrees => { const q = new CANNON.Quaternion(); q.setFromAxisAngle(axisX, degrees * Math.PI / 180); return q; };

export function captureUpright(instance) {
  const pelvis = instance.bodyById.get('pelvis');
  const quaternions = new Map(instance.bodies.map(body => [body.idTag, body.quaternion.clone()]));
  let floor = Infinity;
  for (const body of instance.bodies) {
    body.updateAABB();
    floor = Math.min(floor, body.aabb.lowerBound.y);
  }
  const links = instance.joints.map(joint => ({
    parent: joint.bodyA.idTag, child: joint.bodyB.idTag,
    pivotA: joint.pivotA.clone(), pivotB: joint.pivotB.clone()
  }));
  const ordered = [];
  const reached = new Set(['pelvis']);
  while (ordered.length < links.length) {
    const next = links.find(link => reached.has(link.parent) && !reached.has(link.child));
    if (!next) throw new Error('Recovery requires a connected pelvis-rooted rig');
    ordered.push(next);
    reached.add(next.child);
  }
  return { quaternions, links: ordered, pelvisHeight: pelvis.position.y - floor };
}

function stagedQuaternion(rest, id, phase, prone, rangeScale) {
  const side = prone ? -1 : 1;
  let degrees = 0;
  const rootDegrees = phase === 'turn' ? side * 65 : phase === 'plant' ? side * 32 : 0;
  if (phase === 'turn') {
    degrees = id === 'pelvis' ? side * 65 : id === 'chest' || id === 'head' ? side * 48 : side * 60;
  } else if (phase === 'plant') {
    degrees = id === 'pelvis' ? side * 32 : id === 'chest' || id === 'head' ? side * 18 :
      id.includes('thigh') ? side * 65 : id.includes('shin') ? side * -38 :
      id.includes('upper-arm') ? side * -48 : id.includes('forearm') ? side * 25 : side * 12;
  } else if (phase === 'crouch') {
    degrees = id === 'chest' ? side * 17 : id.includes('thigh') ? side * 42 :
      id.includes('shin') ? side * -42 : id.includes('upper-arm') ? side * -28 :
      id.includes('forearm') ? side * 18 : 0;
  }
  // Scale the deviation from the root's turn, not absolute world angles: at a
  // narrow range the chest must follow the pelvis instead of folding backward.
  if (id !== 'pelvis') degrees = rootDegrees + (degrees - rootDegrees) * rangeScale;
  return tilt(degrees).mult(rest);
}

export function beginGetUp(instance, supportTop, jointRange = 100, destination = null) {
  const pelvis = instance.bodyById.get('pelvis');
  const upright = instance.upright;
  if (!upright) throw new Error('No upright rest pose for recovery');
  const chest = instance.bodyById.get('chest');
  const forward = chest.quaternion.vmult(new CANNON.Vec3(0, 0, 1));
  const prone = forward.y < 0;
  const start = new Map(instance.bodies.map(body => [body.idTag, body.quaternion.clone()]));
  const startPoses = new Map(instance.bodies.map(body => [body.idTag, { position: body.position.clone(), quaternion: body.quaternion.clone() }]));
  const x = pelvis.position.x, z = pelvis.position.z;
  const targetX = destination?.x ?? x, targetZ = destination?.z ?? z;
  const scootDuration = destination ? .7 : 0;
  const finalY = supportTop + upright.pelvisHeight + .015;
  const rangeScale = Math.min(1, Math.max(.25, jointRange / 100));
  const keys = [
    { at: 0, y: pelvis.position.y, quats: start },
    { at: .25, y: Math.max(pelvis.position.y, supportTop + Math.min(.38, upright.pelvisHeight * .4)), quats: new Map(instance.bodies.map(body => [body.idTag, stagedQuaternion(upright.quaternions.get(body.idTag), body.idTag, 'turn', prone, rangeScale)])) },
    { at: .55, y: supportTop + upright.pelvisHeight * .58, quats: new Map(instance.bodies.map(body => [body.idTag, stagedQuaternion(upright.quaternions.get(body.idTag), body.idTag, 'plant', prone, rangeScale)])) },
    { at: .80, y: supportTop + upright.pelvisHeight * .78, quats: new Map(instance.bodies.map(body => [body.idTag, stagedQuaternion(upright.quaternions.get(body.idTag), body.idTag, 'crouch', prone, rangeScale)])) },
    { at: 1, y: finalY, quats: upright.quaternions }
  ];
  return { elapsed: 0, duration: 3 + scootDuration, scootDuration, supportTop, x, z, targetX, targetZ, startPoses, keys, upright };
}

export function sampleGetUp(recovery, progress) {
  const elapsed = Math.max(0, Math.min(recovery.duration, progress * recovery.duration));
  if (recovery.scootDuration && elapsed <= recovery.scootDuration) {
    const blend = smooth(elapsed / recovery.scootDuration);
    const dx = (recovery.targetX - recovery.x) * blend;
    const dz = (recovery.targetZ - recovery.z) * blend;
    return new Map([...recovery.startPoses].map(([id, pose]) => [id, {
      position: pose.position.vadd(new CANNON.Vec3(dx, 0, dz)), quaternion: pose.quaternion.clone()
    }]));
  }
  const t = Math.max(0, Math.min(1, (elapsed - recovery.scootDuration) / 3));
  const keys = recovery.keys;
  let index = keys.length - 2;
  for (let i = 0; i < keys.length - 1; i++) if (t <= keys[i + 1].at) { index = i; break; }
  const a = keys[index], b = keys[index + 1];
  const blend = smooth((t - a.at) / (b.at - a.at));
  const poses = new Map();
  const pelvisQ = a.quats.get('pelvis').slerp(b.quats.get('pelvis'), blend);
  poses.set('pelvis', { position: new CANNON.Vec3(recovery.targetX, a.y * (1 - blend) + b.y * blend, recovery.targetZ), quaternion: pelvisQ });
  for (const link of recovery.upright.links) {
    const parent = poses.get(link.parent);
    const childQ = a.quats.get(link.child).slerp(b.quats.get(link.child), blend);
    const anchor = parent.quaternion.vmult(link.pivotA).vadd(parent.position);
    const childPosition = anchor.vsub(childQ.vmult(link.pivotB));
    poses.set(link.child, { position: childPosition, quaternion: childQ });
  }
  return poses;
}
