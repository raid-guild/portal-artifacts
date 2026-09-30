import * as THREE from './vendor/three.module.js';
import { interpolateBodyQuaternion } from './renderMath.js';

const unitScale = new THREE.Vector3(1, 1, 1);

export function createSkinnedRagdoll(gltf, profile) {
  const root = gltf.scene;
  if (!root) throw new Error('Rigged asset has no scene');
  if (root.position.lengthSq() > 1e-10 || root.quaternion.angleTo(new THREE.Quaternion()) > 1e-5 || root.scale.distanceTo(unitScale) > 1e-5) {
    throw new Error('Rigged asset root must remain untransformed');
  }
  root.updateMatrixWorld(true);
  const bonesByName = new Map();
  const meshes = [];
  root.traverse(object => {
    if (object.isBone) bonesByName.set(object.name, object);
    if (object.isSkinnedMesh) {
      object.frustumCulled = false;
      object.castShadow = true;
      object.receiveShadow = true;
      meshes.push(object);
    }
  });
  if (!meshes.length) throw new Error('Rigged asset has no skinned mesh');
  const entries = profile.bodies.map(spec => {
    const bone = bonesByName.get(spec.bone);
    if (!bone) throw new Error(`Missing rig bone: ${spec.bone}`);
    const bodyRest = new THREE.Matrix4().compose(
      new THREE.Vector3(...spec.position),
      new THREE.Quaternion(...spec.quaternion),
      unitScale
    );
    return { id: spec.id, bone, bodyToBone: bodyRest.clone().invert().multiply(bone.matrixWorld) };
  });
  const bodyIdByBone = new Map(profile.bodies.map(spec => [spec.bone, spec.id]));
  const depth = bone => { let n = 0; for (let p = bone.parent; p; p = p.parent) n++; return n; };
  entries.sort((a, b) => depth(a.bone) - depth(b.bone));
  const currentPosition = new THREE.Vector3();
  const targetPosition = new THREE.Vector3();
  const currentQuaternion = new THREE.Quaternion();
  const previousQuaternion = new THREE.Quaternion();
  const nextQuaternion = new THREE.Quaternion();
  const bodyWorld = new THREE.Matrix4();
  const desiredBoneWorld = new THREE.Matrix4();
  const local = new THREE.Matrix4();
  const parentInverse = new THREE.Matrix4();

  function pose(bodies, alpha) {
    const byId = new Map(bodies.map(body => [body.idTag, body]));
    root.updateWorldMatrix(false, false);
    for (const entry of entries) {
      const body = byId.get(entry.id);
      if (!body) throw new Error(`Missing physics body: ${entry.id}`);
      currentPosition.set(body.previousPosition.x, body.previousPosition.y, body.previousPosition.z)
        .lerp(targetPosition.set(body.position.x, body.position.y, body.position.z), alpha);
      interpolateBodyQuaternion(body.previousQuaternion, body.quaternion, alpha, currentQuaternion, previousQuaternion, nextQuaternion);
      bodyWorld.compose(currentPosition, currentQuaternion, unitScale);
      desiredBoneWorld.multiplyMatrices(bodyWorld, entry.bodyToBone);
      parentInverse.copy(entry.bone.parent.matrixWorld).invert();
      local.multiplyMatrices(parentInverse, desiredBoneWorld);
      local.decompose(entry.bone.position, entry.bone.quaternion, entry.bone.scale);
      entry.bone.updateWorldMatrix(false, false);
    }
  }

  function pickBody(intersection, bodyById) {
    const mesh = intersection.object;
    const face = intersection.face;
    const indices = mesh.geometry?.getAttribute('skinIndex');
    const weights = mesh.geometry?.getAttribute('skinWeight');
    if (!mesh.isSkinnedMesh || !face || !indices || !weights) return null;
    const votes = new Map();
    for (const vertex of [face.a, face.b, face.c]) {
      for (let slot = 0; slot < 4; slot++) {
        const boneIndex = indices.getComponent(vertex, slot);
        const weight = weights.getComponent(vertex, slot);
        const body = bodyById.get(bodyIdByBone.get(mesh.skeleton.bones[boneIndex]?.name));
        if (body && weight > 0) votes.set(body, (votes.get(body) || 0) + weight);
      }
    }
    let best = null, score = -1;
    for (const [body, weight] of votes) if (weight > score) { best = body; score = weight; }
    return best;
  }

  function refreshBounds() { for (const mesh of meshes) mesh.computeBoundingSphere(); }
  return { root, meshes, entries, pose, pickBody, refreshBounds };
}
