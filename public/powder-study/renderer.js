import * as THREE from './vendor/three.module.min.js';
import { MATERIAL_BY_ID } from './materials.js';

export class WorldView {
  constructor(canvas, world) {
    this.world = world;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.setClearColor(0x111512, 1);
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
    this.camera.position.z = 2;
    this.pixels = new Uint8Array(world.width * world.height * 4);
    this.texture = new THREE.DataTexture(this.pixels, world.width, world.height, THREE.RGBAFormat);
    this.texture.magFilter = THREE.NearestFilter;
    this.texture.minFilter = THREE.NearestFilter;
    this.texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.MeshBasicMaterial({ map: this.texture });
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    this.scene.add(this.mesh);
    this.palette = Object.fromEntries(Object.entries(MATERIAL_BY_ID).map(([id,m]) => {
      const value = Number.parseInt(m.color.slice(1), 16);
      return [id, [(value >> 16) & 255, (value >> 8) & 255, value & 255]];
    }));
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    this.resize();
  }
  resize() {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.renderer.setSize(Math.max(1,rect.width), Math.max(1,rect.height), false);
    this.render();
  }
  render() {
    const cells = this.world.cells, pixels = this.pixels, width = this.world.width, height = this.world.height;
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      const i = x + y * width, p = (x + (height-1-y)*width)*4, type = cells[i], color = this.palette[type];
      const variation = type ? ((x*17 + y*31) % 7 - 3)*2 : 0;
      pixels[p] = Math.max(0,color[0]+variation);
      pixels[p+1] = Math.max(0,color[1]+variation);
      pixels[p+2] = Math.max(0,color[2]+variation);
      pixels[p+3] = 255;
    }
    this.texture.needsUpdate = true;
    this.renderer.render(this.scene,this.camera);
  }
}
