import * as THREE from 'three';
import { GLTFLoader } from './vendor/three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from './vendor/three/examples/jsm/controls/OrbitControls.js';

// This module is imported only after someone asks to explore the can.
export async function createCanViewer(host, modelUrl) {
  const container = host.querySelector('.brood-canvas');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  const home = new THREE.Vector3(0.8, 6.5, 11.5);
  const target = new THREE.Vector3(0, 2.55, 0);
  camera.position.copy(home);
  const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true, powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.7;
  container.append(renderer.domElement);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(target);
  controls.enablePan = false;
  controls.enableDamping = false;
  controls.minDistance = 7;
  controls.maxDistance = 19;
  controls.minPolarAngle = 0.55;
  controls.maxPolarAngle = Math.PI - 0.55;
  controls.update();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x5a3a64, 3));
  const keyLight = new THREE.DirectionalLight(0xffd7f2, 4.2);
  keyLight.position.set(3, 9, 8);
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight(0xb091ff, 3);
  rimLight.position.set(-4, 5, -5);
  scene.add(rimLight);
  let disposed = false;
  function render() {
    if (disposed) return;
    const width = Math.max(1, container.clientWidth);
    const height = Math.max(1, container.clientHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  }
  controls.addEventListener('change', render);
  const resize = new ResizeObserver(render);
  resize.observe(container);
  try {
    const model = await new GLTFLoader().loadAsync(modelUrl);
    if (disposed) return null;
    scene.add(model.scene);
    render();
    return {
      rotate(direction) {
        camera.position.sub(target).applyAxisAngle(new THREE.Vector3(0, 1, 0), direction * Math.PI / 8).add(target);
        controls.update();
      },
      reset() { camera.position.copy(home); controls.target.copy(target); controls.update(); },
      render,
      dispose() {
        disposed = true;
        resize.disconnect();
        controls.dispose();
        model.scene.traverse((node) => {
          if (!node.isMesh) return;
          node.geometry?.dispose();
          const materials = Array.isArray(node.material) ? node.material : [node.material];
          for (const material of materials) {
            material?.map?.dispose();
            material?.normalMap?.dispose();
            material?.roughnessMap?.dispose();
            material?.metalnessMap?.dispose();
            material?.dispose();
          }
        });
        renderer.dispose();
        renderer.forceContextLoss();
        renderer.domElement.remove();
      }
    };
  } catch (error) {
    resize.disconnect();
    controls.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
    throw error;
  }
}
