import * as THREE from 'three';
import { localToWorld } from './layout.js';

export function createPourScene(scene, host, stop) {
  const group = new THREE.Group();
  const point = localToWorld(stop, .55, .34);
  group.position.set(point.x, 1.595, point.z);
  group.rotation.y = stop.facing || 0;
  scene.add(group);
  const materials = [];
  const material = options => { const m = new THREE.MeshStandardMaterial(options); materials.push(m); return m; };
  const glass = material({ color: '#eff3db', transparent: true, opacity: .38, roughness: .18, side: THREE.DoubleSide, depthWrite: false });
  const cream = material({ color: '#fff1ce', roughness: .8 });
  const amber = material({ color: stop.beerColor, roughness: .28, emissive: new THREE.Color(stop.beerColor).multiplyScalar(.55), emissiveIntensity: .15 });
  const metal = material({ color: '#47615b', metalness: .35, roughness: .4 });
  function add(geo, mat, x, y, z) {
    const mesh = new THREE.Mesh(geo, mat); mesh.position.set(x, y, z); group.add(mesh); return mesh;
  }
  add(new THREE.CylinderGeometry(.26, .2, .58, 16, 1, true), glass, 0, .29, 0).renderOrder = 2;
  const rim = add(new THREE.TorusGeometry(.26, .024, 6, 24), cream, 0, .58, 0); rim.rotation.x = Math.PI / 2;
  add(new THREE.CylinderGeometry(.21, .21, .035, 16), cream, 0, .015, 0);
  const liquid = add(new THREE.CylinderGeometry(.222, .185, 1, 16), amber, 0, .03, 0);
  const foam = add(new THREE.CylinderGeometry(.23, .222, .055, 16), cream, 0, .03, 0);
  add(new THREE.CylinderGeometry(.075, .095, .84, 8), metal, 0, .42, -.55);
  const spout = add(new THREE.CylinderGeometry(.065, .065, .55, 8), metal, 0, .84, -.275); spout.rotation.x = Math.PI / 2;
  const handle = add(new THREE.BoxGeometry(.1, .24, .1), cream, 0, .96, -.55);
  const stream = add(new THREE.CylinderGeometry(.038, .046, 1, 8), amber, 0, .68, 0);
  let collected = false;
  function paint(fill, pouring, reach) {
    const height = Math.max(.001, fill * .45);
    liquid.scale.y = height; liquid.position.y = .035 + height / 2; liquid.visible = fill > 0;
    foam.position.y = .035 + height; foam.visible = fill > .02;
    const top = .81, bottom = .045 + height;
    stream.visible = pouring; stream.scale.y = top - bottom; stream.position.y = (top + bottom) / 2;
    handle.rotation.x = reach * .55;
    if (host.right) host.right.rotation.x = -1.45 * reach;
    if (host.head) host.head.rotation.x = .12 * reach;
  }
  paint(0, false, 0);
  return {
    update: sample => paint(sample.fill, sample.stream, sample.reach),
    complete() { collected = true; paint(1, false, 0); },
    cancel() { paint(collected ? 1 : 0, false, 0); },
    dispose() { group.traverse(n => n.geometry?.dispose()); materials.forEach(m => m.dispose()); scene.remove(group); }
  };
}
