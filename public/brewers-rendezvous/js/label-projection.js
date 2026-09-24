import * as THREE from '../vendor/three.module.js';

export function projectLabels(stops, camera, width, height, serviceId = null) {
  // Vector3.project reads matrixWorldInverse. Three updates that matrix during
  // render, so doing this before render requires an explicit camera update.
  camera.updateMatrixWorld();
  const positions = new Map();
  const point = new THREE.Vector3();
  for (const stop of stops) {
    point.set(stop.x,stop.labelHeight ?? (stop.type === 'beer' ? 4.1 : 2.55),stop.z).project(camera);
    positions.set(stop.id,{
      x:(point.x*.5+.5)*width,
      y:(-point.y*.5+.5)*height,
      visible:(!serviceId || stop.id === serviceId) && point.z >= -1 && point.z <= 1 && point.x > -1.2 && point.x < 1.2 && point.y > -1.2 && point.y < 1.2
    });
  }
  return positions;
}
