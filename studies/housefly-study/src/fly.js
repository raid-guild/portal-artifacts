import * as THREE from 'three';

const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x292b27, roughness: 0.82, metalness: 0.04 });
const abdomenMaterial = new THREE.MeshStandardMaterial({ color: 0x38372f, roughness: 0.92 });
const stripeMaterial = new THREE.MeshStandardMaterial({ color: 0x666757, roughness: 0.85 });
const eyeMaterial = new THREE.MeshPhysicalMaterial({ color: 0x994a32, roughness: 0.3, metalness: 0.05, clearcoat: 0.55 });
const wingMaterial = new THREE.MeshBasicMaterial({ color: 0xe6eee7, transparent: true, opacity: 0.64, side: THREE.DoubleSide, depthWrite: false });
const veinMaterial = new THREE.LineBasicMaterial({ color: 0x8fa497, transparent: true, opacity: 0.55 });
const legMaterial = new THREE.LineBasicMaterial({ color: 0x242a25, linewidth: 1 });

function ellipsoid(parent, material, x, y, z, sx, sy, sz) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), material);
  mesh.position.set(x, y, z);
  mesh.scale.set(sx, sy, sz);
  parent.add(mesh);
  return mesh;
}

function line(parent, points, material) {
  const geo = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(...p)));
  const mesh = new THREE.Line(geo, material);
  parent.add(mesh);
  return mesh;
}

function makeWing(side) {
  const hinge = new THREE.Group();
  hinge.position.set(-0.2, side * 0.45, 0.32);
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(-0.1, side * 1.0, -1.1, side * 3.5, -3.8, side * 4.4);
  shape.bezierCurveTo(-5.1, side * 3.75, -4.1, side * 2.0, -1.5, side * 0.2);
  shape.quadraticCurveTo(-0.6, side * -0.1, 0, 0);
  const wing = new THREE.Mesh(new THREE.ShapeGeometry(shape, 12), wingMaterial);
  hinge.add(wing);
  line(hinge, [[0, 0, 0.02], [-1.1, side * 1.6, 0.02], [-3.9, side * 3.8, 0.02]], veinMaterial);
  line(hinge, [[-1.1, side * 1.6, 0.02], [-3.4, side * 2.8, 0.02]], veinMaterial);
  return hinge;
}

export function createFly() {
  const root = new THREE.Group();
  const rig = new THREE.Group();
  root.add(rig);

  ellipsoid(rig, bodyMaterial, 0.25, 0, 0, 1.35, 0.92, 0.75);
  const abdomen = ellipsoid(rig, abdomenMaterial, -2.0, 0, -0.05, 2.1, 0.78, 0.62);
  abdomen.rotation.z = -0.06;
  for (let i = 0; i < 3; i++) {
    const x = -1.35 - i * 0.7;
    ellipsoid(rig, stripeMaterial, x, 0, 0.46, 0.12, 0.61 - i * 0.06, 0.08);
  }
  ellipsoid(rig, bodyMaterial, 1.65, 0, 0.03, 0.79, 0.73, 0.68);
  ellipsoid(rig, eyeMaterial, 1.9, 0.46, 0.25, 0.47, 0.38, 0.42);
  ellipsoid(rig, eyeMaterial, 1.9, -0.46, 0.25, 0.47, 0.38, 0.42);
  ellipsoid(rig, bodyMaterial, 2.28, 0, -0.28, 0.23, 0.15, 0.43);

  for (const side of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
      const x = 0.75 - i * 0.82;
      const knee = [x - 0.45 - i * 0.18, side * (1.45 + i * 0.14), -0.65];
      const foot = [x - 0.8 - i * 0.38, side * (2.1 + i * 0.26), -1.55];
      line(rig, [[x, side * 0.56, -0.3], knee, foot], legMaterial);
    }
    line(rig, [[2.17, side * 0.34, 0.28], [2.55, side * 0.8, 0.8]], legMaterial);
  }

  const leftWing = makeWing(1);
  const rightWing = makeWing(-1);
  rig.add(leftWing, rightWing);

  // The pose adapter is intentionally small so an approved GLB can replace this mesh.
  function update({ time, velocity, lateral }) {
    const flutter = Math.sin(time * 72);
    leftWing.rotation.x = 0.22 + flutter * 0.42;
    rightWing.rotation.x = -0.22 - flutter * 0.42;
    leftWing.rotation.z = -0.05 + flutter * 0.035;
    rightWing.rotation.z = 0.05 - flutter * 0.035;
    const angle = Math.atan2(velocity.y, velocity.x);
    root.rotation.z += Math.atan2(Math.sin(angle - root.rotation.z), Math.cos(angle - root.rotation.z)) * 0.16;
    rig.rotation.x += (THREE.MathUtils.clamp(-lateral * 6, -0.33, 0.33) - rig.rotation.x) * 0.12;
    rig.rotation.y += (THREE.MathUtils.clamp(-velocity.z * 0.014, -0.25, 0.25) - rig.rotation.y) * 0.08;
  }
  return { object: root, update };
}
