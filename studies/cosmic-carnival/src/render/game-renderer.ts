import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { Enemy, GameSnapshot, Shot } from "../game/simulation";

type ModelName = "crescent" | "prism" | "ribbon" | "jester";
type ViewMode = "title" | "playing" | "paused" | "game-over";

const COLORS = {
  cream: 0xf3e6cf,
  lavender: 0xa48aca,
  butter: 0xffe29a,
  pink: 0xee91bb,
  violet: 0x705595,
  cyan: 0x79e5dc,
  indigo: 0x353053,
};

interface Flash {
  mesh: THREE.Mesh;
  life: number;
  duration: number;
}

function lanePoint(lane: number, depth: number): THREE.Vector3 {
  const angle = (lane / 12) * Math.PI * 2 + Math.PI / 2;
  const radius = THREE.MathUtils.lerp(0.7, 5.1, depth);
  return new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, THREE.MathUtils.lerp(-28, 0.15, depth));
}

function makeGradient(): THREE.DataTexture {
  const data = new Uint8Array([
    52, 48, 83, 255,
    112, 85, 149, 255,
    210, 184, 210, 255,
    255, 244, 210, 255,
  ]);
  const texture = new THREE.DataTexture(data, 4, 1, THREE.RGBAFormat);
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.needsUpdate = true;
  return texture;
}

export class GameRenderer {
  readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(54, 1, 0.1, 80);
  private readonly tunnel = new THREE.Group();
  private readonly modelRoot = new THREE.Group();
  private readonly effectRoot = new THREE.Group();
  private readonly models = new Map<ModelName, THREE.Group>();
  private readonly enemyMeshes = new Map<number, THREE.Group>();
  private readonly shotMeshes = new Map<number, THREE.Mesh>();
  private readonly shotGeometry = new THREE.OctahedronGeometry(0.095, 0);
  private readonly shotMaterial = new THREE.MeshBasicMaterial({ color: COLORS.cyan });
  private readonly laneLines: THREE.Line[] = [];
  private readonly flashes: Flash[] = [];
  private player: THREE.Group | null = null;
  private attractPlayer: THREE.Group | null = null;
  private lowEffects = false;
  private reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  private targetPlayerAngle = Math.PI / 2;
  private playerAngle = Math.PI / 2;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    this.renderer.setClearColor(0x090716, 1);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.camera.position.set(0, 0, 9.7);
    this.camera.lookAt(0, 0, -9);
    this.scene.fog = new THREE.FogExp2(0x090716, 0.018);

    this.scene.add(this.tunnel, this.modelRoot, this.effectRoot);
    this.scene.add(new THREE.HemisphereLight(COLORS.cream, COLORS.indigo, 2.1));
    const key = new THREE.DirectionalLight(COLORS.butter, 4.8);
    key.position.set(-4, 7, 8);
    this.scene.add(key);
    const rim = new THREE.PointLight(COLORS.pink, 13, 30, 1.5);
    rim.position.set(4, -3, -2);
    this.scene.add(rim);
    this.buildTunnel();
    this.resize();
    window.addEventListener("resize", () => this.resize());
    matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", (event) => {
      this.reducedMotion = event.matches;
    });
  }

  setLowEffects(value: boolean): void {
    this.lowEffects = value;
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, value ? 1 : 1.75));
    this.resize();
  }

  async load(onProgress: (progress: number, label: string) => void): Promise<void> {
    const loader = new GLTFLoader();
    const names: ModelName[] = ["crescent", "prism", "ribbon", "jester"];
    let loaded = 0;
    await Promise.all(names.map(async (name) => {
      const gltf = await loader.loadAsync(`${import.meta.env.BASE_URL}models/${name}.glb`);
      const root = gltf.scene;
      this.prepareModel(root, name);
      this.models.set(name, root);
      loaded += 1;
      onProgress(loaded / names.length, `${name.toUpperCase()} sculpture ready`);
    }));
    this.createPlayer();
    this.createAttractPlayer();
  }

  reset(): void {
    for (const mesh of this.enemyMeshes.values()) this.modelRoot.remove(mesh);
    for (const mesh of this.shotMeshes.values()) this.modelRoot.remove(mesh);
    this.enemyMeshes.clear();
    this.shotMeshes.clear();
    for (const flash of this.flashes) this.effectRoot.remove(flash.mesh);
    this.flashes.length = 0;
    this.playerAngle = Math.PI / 2;
    this.targetPlayerAngle = Math.PI / 2;
  }

  flashAt(enemy: Enemy, color = COLORS.cream): void {
    if (this.lowEffects) return;
    const geometry = new THREE.TorusGeometry(0.28, 0.025, 5, 16);
    const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, depthWrite: false });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(lanePoint(enemy.lane, enemy.depth));
    this.effectRoot.add(mesh);
    this.flashes.push({ mesh, life: 0.28, duration: 0.28 });
  }

  flashBreach(lane: number): void {
    const point = lanePoint(lane, 1);
    const geometry = new THREE.RingGeometry(0.18, 0.42, 6);
    const material = new THREE.MeshBasicMaterial({ color: COLORS.pink, transparent: true, opacity: 1, side: THREE.DoubleSide, depthWrite: false });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(point);
    this.effectRoot.add(mesh);
    this.flashes.push({ mesh, life: 0.52, duration: 0.52 });
  }

  render(snapshot: GameSnapshot, dt: number, time: number, mode: ViewMode): void {
    const title = mode === "title";
    this.tunnel.rotation.z = title && !this.reducedMotion ? Math.sin(time * 0.16) * 0.08 : 0;
    this.tunnel.position.z = title && !this.reducedMotion ? Math.sin(time * 0.35) * 0.3 : 0;
    this.syncPlayer(snapshot, dt, mode);
    this.syncEnemies(snapshot.enemies, time);
    this.syncShots(snapshot.shots);
    this.updateFlashes(dt);
    this.highlightLane(snapshot.lane, mode === "playing");
    this.renderer.render(this.scene, this.camera);
  }

  private buildTunnel(): void {
    const palette = [COLORS.violet, COLORS.lavender, COLORS.pink, COLORS.butter];
    for (let lane = 0; lane < 12; lane += 1) {
      const geometry = new THREE.BufferGeometry().setFromPoints([lanePoint(lane, 0), lanePoint(lane, 1)]);
      const material = new THREE.LineBasicMaterial({ color: palette[lane % palette.length], transparent: true, opacity: lane % 3 === 0 ? 0.62 : 0.28 });
      const line = new THREE.Line(geometry, material);
      this.laneLines.push(line);
      this.tunnel.add(line);
    }

    for (let ring = 0; ring <= 8; ring += 1) {
      const depth = ring / 8;
      const points = Array.from({ length: 13 }, (_, lane) => lanePoint(lane % 12, depth));
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: ring === 8 ? COLORS.butter : ring % 2 === 0 ? COLORS.pink : COLORS.violet,
        transparent: true,
        opacity: ring === 8 ? 0.76 : 0.2,
      });
      this.tunnel.add(new THREE.Line(geometry, material));
    }

    const stars = new THREE.BufferGeometry();
    const positions = new Float32Array(270 * 3);
    for (let index = 0; index < 270; index += 1) {
      const angle = (index * 2.399963) % (Math.PI * 2);
      const radius = 7 + ((index * 37) % 100) / 8;
      positions[index * 3] = Math.cos(angle) * radius;
      positions[index * 3 + 1] = Math.sin(angle) * radius;
      positions[index * 3 + 2] = -38 + (index % 53) * 0.9;
    }
    stars.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    this.scene.add(new THREE.Points(stars, new THREE.PointsMaterial({ color: COLORS.cream, size: 0.055, transparent: true, opacity: 0.48 })));
  }

  private prepareModel(root: THREE.Group, name: ModelName): void {
    const gradient = makeGradient();
    root.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const source = Array.isArray(child.material) ? child.material[0] : child.material;
      const color = source instanceof THREE.MeshStandardMaterial ? source.color : new THREE.Color(COLORS.lavender);
      child.material = new THREE.MeshToonMaterial({ color, gradientMap: gradient });
      child.castShadow = false;
      child.frustumCulled = true;
    });
    const bounds = new THREE.Box3().setFromObject(root);
    const size = bounds.getSize(new THREE.Vector3());
    const target = name === "crescent" ? 1.35 : name === "jester" ? 1.05 : 0.9;
    const scale = target / Math.max(size.x, size.y, size.z, 0.001);
    root.scale.setScalar(scale);
    root.position.sub(bounds.getCenter(new THREE.Vector3()).multiplyScalar(scale));
  }

  private createPlayer(): void {
    this.player = this.cloneModel("crescent");
    if (!this.player) return;
    this.modelRoot.add(this.player);
  }

  private createAttractPlayer(): void {
    this.attractPlayer = this.cloneModel("crescent");
    if (!this.attractPlayer) return;
    this.attractPlayer.scale.multiplyScalar(0.82);
    this.modelRoot.add(this.attractPlayer);
  }

  private cloneModel(name: ModelName): THREE.Group | null {
    const source = this.models.get(name);
    if (!source) return null;
    const clone = source.clone(true);
    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.material = Array.isArray(child.material)
        ? child.material.map((material) => material.clone())
        : child.material.clone();
    });
    return clone;
  }

  private syncPlayer(snapshot: GameSnapshot, dt: number, mode: ViewMode): void {
    if (!this.player || !this.attractPlayer) return;
    const gameplayVisible = mode !== "title";
    this.player.visible = gameplayVisible;
    this.attractPlayer.visible = mode === "title";
    if (mode === "title") {
      const angle = performance.now() * (this.reducedMotion ? 0.00005 : 0.00018);
      const lane = ((angle / (Math.PI * 2)) * 12) % 12;
      this.attractPlayer.position.copy(lanePoint(lane, 0.86));
      this.attractPlayer.rotation.set(0.15, 0, angle - Math.PI / 2);
      return;
    }
    this.targetPlayerAngle = (snapshot.lane / 12) * Math.PI * 2 + Math.PI / 2;
    let difference = Math.atan2(Math.sin(this.targetPlayerAngle - this.playerAngle), Math.cos(this.targetPlayerAngle - this.playerAngle));
    this.playerAngle += difference * Math.min(1, dt * 17);
    difference = Math.atan2(Math.sin(this.targetPlayerAngle - this.playerAngle), Math.cos(this.targetPlayerAngle - this.playerAngle));
    const position = lanePoint((this.playerAngle - Math.PI / 2) / (Math.PI * 2) * 12, 0.94);
    this.player.position.copy(position);
    this.player.rotation.set(0, 0, this.playerAngle - Math.PI / 2 + difference * 0.45);
    this.player.visible = snapshot.invulnerable <= 0 || Math.floor(snapshot.invulnerable * 12) % 2 === 0;
  }

  private syncEnemies(enemies: readonly Enemy[], time: number): void {
    const active = new Set(enemies.map(({ id }) => id));
    for (const [id, mesh] of this.enemyMeshes) {
      if (!active.has(id)) {
        this.modelRoot.remove(mesh);
        this.enemyMeshes.delete(id);
      }
    }
    for (const enemy of enemies) {
      let mesh = this.enemyMeshes.get(enemy.id);
      if (!mesh) {
        mesh = this.cloneModel(enemy.kind) ?? undefined;
        if (!mesh) continue;
        mesh.userData.normalizedScale = mesh.scale.clone();
        this.enemyMeshes.set(enemy.id, mesh);
        this.modelRoot.add(mesh);
      }
      mesh.position.copy(lanePoint(enemy.lane, enemy.depth));
      const pulse = enemy.kind === "jester" && enemy.depth > 0.58 ? 1 + Math.sin(time * 13) * 0.08 : 1;
      mesh.scale.copy(mesh.userData.normalizedScale as THREE.Vector3).multiplyScalar(pulse);
      mesh.rotation.z = (enemy.kind === "ribbon" ? time * 2.8 : enemy.kind === "prism" ? time * 1.4 : Math.sin(time * 4) * 0.2);
      mesh.rotation.y = time * (enemy.kind === "jester" ? 1.1 : 2.1);
      mesh.traverse((child) => {
        const part = child.name.toLowerCase();
        if (enemy.kind === "prism" && part.includes("crown")) child.rotation.y = time * 3.8;
        if (enemy.kind === "prism" && part.includes("counter")) child.rotation.y = -time * 2.9;
        if (enemy.kind === "ribbon" && part.includes("helix")) child.rotation.y = time * 5.2;
        if (enemy.kind === "ribbon" && part.includes("core")) child.position.y = Math.sin(time * 5) * 0.045;
        if (enemy.kind === "jester" && part.includes("fin")) {
          const direction = part.includes("l") ? 1 : -1;
          child.rotation.z = direction * THREE.MathUtils.lerp(0.08, 0.62, THREE.MathUtils.smoothstep(enemy.depth, 0.5, 0.68));
        }
        if (!(child instanceof THREE.Mesh) || !(child.material instanceof THREE.MeshToonMaterial)) return;
        const eyeBright = enemy.kind === "jester" && part.includes("eye") && enemy.depth > 0.5;
        child.material.emissive.setHex(enemy.hitFlash > 0 ? COLORS.cream : eyeBright ? COLORS.pink : enemy.kind === "jester" && enemy.hp === 1 ? 0x491835 : 0x000000);
        child.material.emissiveIntensity = enemy.hitFlash > 0 ? 1.2 : eyeBright ? 0.9 : enemy.kind === "jester" && enemy.hp === 1 ? 0.48 : 0;
      });
    }
  }

  private syncShots(shots: readonly Shot[]): void {
    const active = new Set(shots.map(({ id }) => id));
    for (const [id, mesh] of this.shotMeshes) {
      if (!active.has(id)) {
        this.modelRoot.remove(mesh);
        this.shotMeshes.delete(id);
      }
    }
    for (const shot of shots) {
      let mesh = this.shotMeshes.get(shot.id);
      if (!mesh) {
        mesh = new THREE.Mesh(this.shotGeometry, this.shotMaterial);
        this.shotMeshes.set(shot.id, mesh);
        this.modelRoot.add(mesh);
      }
      mesh.position.copy(lanePoint(shot.lane, shot.depth));
    }
  }

  private updateFlashes(dt: number): void {
    for (let index = this.flashes.length - 1; index >= 0; index -= 1) {
      const flash = this.flashes[index];
      flash.life -= dt;
      const progress = 1 - flash.life / flash.duration;
      flash.mesh.scale.setScalar(1 + progress * 2.8);
      const material = flash.mesh.material;
      if (material instanceof THREE.MeshBasicMaterial) material.opacity = Math.max(0, 1 - progress);
      if (flash.life <= 0) {
        this.effectRoot.remove(flash.mesh);
        flash.mesh.geometry.dispose();
        if (material instanceof THREE.Material) material.dispose();
        this.flashes.splice(index, 1);
      }
    }
  }

  private highlightLane(lane: number, active: boolean): void {
    this.laneLines.forEach((line, index) => {
      const material = line.material;
      if (!(material instanceof THREE.LineBasicMaterial)) return;
      material.opacity = active && index === lane ? 0.98 : index % 3 === 0 ? 0.55 : 0.23;
      material.color.setHex(active && index === lane ? COLORS.cyan : [COLORS.violet, COLORS.lavender, COLORS.pink, COLORS.butter][index % 4]);
    });
  }

  private resize(): void {
    const width = this.renderer.domElement.clientWidth || innerWidth;
    const height = this.renderer.domElement.clientHeight || innerHeight;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / Math.max(1, height);
    this.camera.fov = width < 700 ? 68 : 54;
    this.camera.updateProjectionMatrix();
  }
}
