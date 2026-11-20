"use client";

import { assetUrl } from "./assetUrl";

import { useEffect, useRef } from "react";
import Phaser from "phaser";
import spriteFrames from "../../public/sprites/frames.json";
import wayfinderFrames from "../../public/sprites/wayfinder-frames.json";
import gatewrightFrames from "../../public/sprites/gatewright-frames.json";
import fieldkeeperFrames from "../../public/sprites/fieldkeeper-frames.json";
import { BOARD_SIZE, Board, Cell, createPuzzle, playTurn, Puzzle, resolveFinaleRefill, SymbolKind, TurnStep, Power, isSpecial, CrustGrid, GoalKind } from "./core";
import type { GameAudio } from "./audio";
import { beamTravelDelay } from "./timing";
import { planFinale, type FinalePlan } from "./finale";
import { reserveGame, enqueueGameWork } from "./gameLifecycle";
import { logDiagnostic } from "./diagnostics";
import { LEVELS, MAP_DESTINATIONS, type LevelDefinition, type LevelId } from "./levels";
import type { BoosterPlacement } from "./boosters";

export type GameEvent =
  | { type: "keeper"; position: { x: number; y: number } }
  | { type: "pump"; position: { x: number; y: number } }
  | { type: "wayfinder"; position: { x: number; y: number } }
  | { type: "gatewright"; position: { x: number; y: number } }
  | { type: "fieldkeeper"; position: { x: number; y: number } }
  | { type: "resolvedTurn"; puzzle: Puzzle; turn: import("./core").Turn; from: Cell; to: Cell }
  | { type: "playReady" }
  | { type: "gateOpened" }
  | { type: "turn"; puzzle: Puzzle; cleared: number; keeper: boolean }
  | { type: "revealStarted"; puzzle: Puzzle }
  | { type: "victory"; puzzle: Puzzle }
  | { type: "win"; puzzle: Puzzle }
  | { type: "lose"; puzzle: Puzzle };

type Props = {
  mode: "map" | "puzzle";
  region: "oasis" | "caravan" | "gatehouse" | "farmland";
  mapPosition: { x: number; y: number } | null;
  repaired: boolean;
  caravanComplete: boolean;
  gatehouseComplete: boolean;
  gateOpening: boolean;
  nextLevel: LevelId | null;
  keeperMet: boolean;
  level: LevelDefinition;
  puzzle: Puzzle | null;
  startingBoosters: BoosterPlacement[];
  audio: GameAudio | null;
  reducedMotion: boolean;
  transitioning: boolean;
  onReady: () => boolean | Promise<boolean>;
  onFailure: (reason: string) => void;
  onEvent: (event: GameEvent) => void;
  skipReveal: { current: (() => void) | null };
};

const WIDTH = 960;
const HEIGHT = 540;
const INK = 0x183b46;
const GREEN = 0x8bd39a;
const GRID_X = 330;
const GRID_Y = 45;
const CELL = 50;

type SceneLayout = { mode: "map" | "puzzle"; hud?: Phaser.GameObjects.Container; backdrop?: Phaser.GameObjects.Image; veil?: Phaser.GameObjects.Graphics };
const sceneLayouts = new WeakMap<Phaser.Scene, SceneLayout>();

function layoutScene(scene: Phaser.Scene, width: number, height: number) {
  const layout = sceneLayouts.get(scene);
  if (!layout) return;
  const main = scene.cameras.main.setViewport(0, 0, width, height).setOrigin(0, 0);
  if (layout.mode === "map") {
    const zoom = width / WIDTH;
    const top = HEIGHT - height / zoom;
    main.setZoom(zoom).setScroll(0, top);
    // HUD content stays in the safe, height-fitted view while map landmarks
    // and their hit areas use one shared world transform.
    layout.hud?.setPosition(0, top).setScale(height / zoom / HEIGHT);
    return;
  }
  const zoom = height / HEIGHT;
  const logicalWidth = width / zoom;
  main.setZoom(zoom).setScroll(-(logicalWidth - WIDTH) / 2, 0);
  // Only the decorative art grows; the 9×9 board and HUD retain their authored scale.
  layout.backdrop?.setDisplaySize(Math.max(WIDTH, logicalWidth), Math.max(HEIGHT, HEIGHT * logicalWidth / WIDTH));
  if (layout.veil) {
    layout.veil.clear().fillStyle(0x082c39, 0.54).fillRect(WIDTH / 2 - logicalWidth / 2, 0, logicalWidth, HEIGHT);
  }
}

function mapHud(scene: Phaser.Scene, parts: Phaser.GameObjects.GameObject[]) {
  const hud = scene.add.container(0, 0, parts).setDepth(50);
  sceneLayouts.set(scene, { mode: "map", hud });
  layoutScene(scene, Number(scene.game.config.width), Number(scene.game.config.height));
}

function label(scene: Phaser.Scene, x: number, y: number, text: string, size = 20, color = "#fff0d0") {
  return scene.add.text(x, y, text, { fontFamily: "Arial, sans-serif", fontSize: `${size}px`, color, fontStyle: "bold", stroke: "#173440", strokeThickness: 3 });
}

function panel(scene: Phaser.Scene, x: number, y: number, w: number, h: number, alpha = 1) {
  const g = scene.add.graphics();
  g.fillStyle(INK, alpha).fillRoundedRect(x, y, w, h, 16);
  g.lineStyle(3, 0xe6c891, alpha).strokeRoundedRect(x, y, w, h, 16);
  return g;
}

type SpriteSheet = "mechanic" | "keeper" | "tiles" | "wayfinder" | "gatewright" | "fieldkeeper";

function registerFrames(scene: Phaser.Scene, sheet: SpriteSheet) {
  const texture = scene.textures.get(sheet);
  const frames = sheet === "wayfinder" ? wayfinderFrames : sheet === "gatewright" ? gatewrightFrames : sheet === "fieldkeeper" ? fieldkeeperFrames : spriteFrames[sheet];
  frames.forEach((cell, index) => {
    const [left, top, right, bottom] = cell.bounds;
    const crop = sheet === "tiles";
    const name = String(index);
    if (!texture.has(name)) texture.add(name, 0, cell.x + (crop ? left : 0), cell.y + (crop ? top : 0), crop ? right - left : cell.w, crop ? bottom - top : cell.h);
  });
}

function prepareSmallTexture(scene: Phaser.Scene, sourceKey: string, targetKey: string, maximumSize: number, frameName?: string) {
  if (scene.textures.exists(targetKey)) return targetKey;
  const frame = scene.textures.getFrame(sourceKey, frameName);
  let canvas = document.createElement("canvas");
  canvas.width = frame.cutWidth;
  canvas.height = frame.cutHeight;
  canvas.getContext("2d")!.drawImage(frame.source.image as HTMLImageElement,
    frame.cutX, frame.cutY, frame.cutWidth, frame.cutHeight, 0, 0, canvas.width, canvas.height);
  const ratio = Math.min(1, maximumSize / Math.max(canvas.width, canvas.height));
  const width = Math.max(1, Math.round(canvas.width * ratio));
  const height = Math.max(1, Math.round(canvas.height * ratio));
  while (canvas.width > width || canvas.height > height) {
    const next = document.createElement("canvas");
    next.width = Math.max(width, Math.floor(canvas.width / 2));
    next.height = Math.max(height, Math.floor(canvas.height / 2));
    const context = next.getContext("2d")!;
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(canvas, 0, 0, next.width, next.height);
    canvas = next;
  }
  scene.textures.addCanvas(targetKey, canvas);
  return targetKey;
}

function drawPiece(scene: Phaser.Scene, x: number, y: number, kind: SymbolKind | "seedpod", jet?: "row" | "column", pulseEnabled = true, power?: Power, hp?: number) {
  if (kind === "seedpod") {
    const texture = hp === 1 ? "seedpodCracked" : "seedpod";
    return scene.add.container(x, y, [scene.add.image(0, 0, prepareSmallTexture(scene, texture, `${texture}-small`, 128)).setDisplaySize(43, 43)]);
  }
  if (kind === "key" && !jet && !power) {
    const art = scene.add.image(0, 0, prepareSmallTexture(scene, "key", "key-small", 128)).setDisplaySize(43, 43);
    return scene.add.container(x, y, [art]);
  }
  if (kind === "pennant" && !jet && !power) {
    const art = scene.add.image(0, 0, prepareSmallTexture(scene, "pennant", "pennant-small", 128)).setDisplaySize(43, 43);
    return scene.add.container(x, y, [art]);
  }
  const frame = jet === "row" ? 3 : jet === "column" ? 4 : kind === "water" ? 0 : kind === "gear" ? 1 : 2;
  const cell = spriteFrames.tiles[frame];
  const width = cell.bounds[2] - cell.bounds[0];
  const height = cell.bounds[3] - cell.bounds[1];
  const scale = Math.min(43 / width, 43 / height);
  const art = power
    ? scene.add.image(0, 0, prepareSmallTexture(scene, power, `${power}-small`, 128)).setDisplaySize(43, 43)
    : scene.add.image(0, 0, prepareSmallTexture(scene, "tiles", `tile-small-${frame}`, 128, String(frame))).setDisplaySize(width * scale, height * scale);
  if ((jet || power) && pulseEnabled) {
    const pulse = scene.tweens.add({
      targets: art, scaleX: art.scaleX * 1.09, scaleY: art.scaleY * 1.09,
      duration: 650, ease: "Sine.easeInOut", yoyo: true, repeat: -1,
    });
    art.once("destroy", () => pulse.remove());
  }
  return scene.add.container(x, y, [art]);
}

function drawGoalIcon(scene: Phaser.Scene, x: number, y: number, kind: GoalKind) {
  if (kind === "seedpod") return drawPiece(scene, x, y, "seedpod", undefined, false, undefined, 2);
  if (kind === "crust") return scene.add.image(x, y, prepareSmallTexture(scene, "saltCrust", "saltCrust-small", 128)).setDisplaySize(43, 43);
  return drawPiece(scene, x, y, kind);
}

function goalName(kind: GoalKind): string { return kind === "leaf" ? "REEDS" : kind === "pennant" ? "PENNANTS" : kind === "key" ? "KEYS" : kind === "crust" ? "SALT" : kind === "seedpod" ? "PODS" : kind.toUpperCase(); }

function characterPosition(sprite: Phaser.GameObjects.Sprite, sheet: "mechanic" | "keeper" | "wayfinder" | "gatewright" | "fieldkeeper", x: number, y: number) {
  const index = Number(sprite.frame.name);
  const cell = sheet === "wayfinder" ? wayfinderFrames[Number.isFinite(index) ? index : 0] : sheet === "gatewright" ? gatewrightFrames[Number.isFinite(index) ? index : 0] : sheet === "fieldkeeper" ? fieldkeeperFrames[Number.isFinite(index) ? index : 0] : spriteFrames[sheet][Number.isFinite(index) ? index : 0];
  const [left, , right, bottom] = cell.bounds;
  const scale = sprite.scaleX;
  sprite.setPosition(x - ((left + right) / 2 - cell.w / 2) * scale, y + (cell.h - bottom) * scale);
}

function characterAnimation(scene: Phaser.Scene, sheet: "mechanic" | "keeper" | "wayfinder" | "gatewright" | "fieldkeeper", direction: "left" | "right") {
  const key = `${sheet}-${direction}-walk`;
  if (!scene.anims.exists(key)) scene.anims.create({ key, frames: (direction === "right" ? [1, 2, 3] : [5, 6, 7]).map(frame => ({ key: sheet, frame: String(frame) })), frameRate: 7, repeat: -1 });
  return key;
}

function makeMapScene(props: Props): typeof Phaser.Scene {
  return class MapScene extends Phaser.Scene {
    player = props.mapPosition ?? (props.nextLevel === "pumpHouse" && props.keeperMet ? { x: 409, y: 418 } : { x: 178, y: 414 });
    target = { ...this.player };
    marker?: Phaser.GameObjects.Arc;
    playerGraphic?: Phaser.GameObjects.Sprite;
    keeperGraphic?: Phaser.GameObjects.Sprite;
    keeperGlow: Phaser.GameObjects.Sprite[] = [];
    facing: "left" | "right" = "right";
    previousPlayer = { ...this.player };
    pumpPrompt?: Phaser.GameObjects.Text;
    keys?: Record<string, Phaser.Input.Keyboard.Key>;
    locked = false;

    constructor() { super("Map"); }
    preload() {
      this.load.on("loaderror", () => props.onFailure("asset-load"));
      this.load.image("oasis", assetUrl("/oasis.webp"));
      this.load.image("mechanic", assetUrl("/sprites/mechanic.png"));
      this.load.image("keeper", assetUrl("/sprites/keeper.png"));
    }
    create() {
      registerFrames(this, "mechanic");
      registerFrames(this, "keeper");
      characterAnimation(this, "mechanic", "left");
      characterAnimation(this, "mechanic", "right");
      characterAnimation(this, "keeper", "left");
      characterAnimation(this, "keeper", "right");
      this.add.image(480, 270, "oasis").setDisplaySize(WIDTH, HEIGHT);
      const hudParts: Phaser.GameObjects.GameObject[] = [
        panel(this, 22, 83, 303, 66, 0.92),
        label(this, 40, 94, "DUNE RELAY", 28),
        label(this, 40, 124, props.nextLevel && props.nextLevel !== "pumpHouse" ? "THE NEXT STATION AWAITS" : props.repaired ? "THE WATER RUNS AGAIN" : "THE OASIS NEEDS WATER", 13, "#9de4d4"),
      ];
      this.add.ellipse(447, 409, 42, 11, 0x132c31, 0.3);
      const keeper = this.add.sprite(447, 408, "keeper", "4").setOrigin(0.5, 1).setScale(82 / 420);
      characterPosition(keeper, "keeper", 447, 408);
      for (const [dx, dy] of [[-1.5, 0], [1.5, 0], [0, -1.5], [0, 1.5]]) {
        const glow = this.add.sprite(447, 408, "keeper", "4").setOrigin(0.5, 1).setScale(82 / 420).setTintFill(0xffedc5).setAlpha(0.9);
        characterPosition(glow, "keeper", 447 + dx, 408 + dy);
        keeper.setDepth(1);
        glow.setDepth(0);
        this.keeperGlow.push(glow);
      }
      if (!props.reducedMotion) this.tweens.add({ targets: this.keeperGlow, alpha: 0.15, yoyo: true, repeat: -1, duration: 750 });
      const keeperHit = this.add.zone(447, 367, 66, 104);
      if (props.nextLevel === "pumpHouse" && !props.keeperMet) keeperHit.setInteractive({ useHandCursor: true });
      this.keeperGraphic = keeper;
      this.add.text(447, 316, "KEEPER", { fontFamily: "Arial", fontSize: "14px", color: "#fff0ce", fontStyle: "bold", stroke: "#173440", strokeThickness: 3 }).setOrigin(0.5);
      this.playerGraphic = this.add.sprite(this.player.x, this.player.y, "mechanic", "0").setOrigin(0.5, 1).setScale(70 / 420);
      characterPosition(this.playerGraphic, "mechanic", this.player.x, this.player.y);
      const destination = MAP_DESTINATIONS[props.nextLevel ? LEVELS[props.nextLevel].destination : "openWaterway"];
      const pump = this.add.zone(destination.hit.x, destination.hit.y, destination.hit.width, destination.hit.height);
      const pumpReady = (props.nextLevel !== null && props.nextLevel !== "pumpHouse") || (props.nextLevel === "pumpHouse" && props.keeperMet);
      if (pumpReady) pump.setInteractive({ useHandCursor: true });
      this.pumpPrompt = label(this, destination.label.x, destination.label.y,
        props.nextLevel ? LEVELS[props.nextLevel].title : "WATERWAY OPEN ✓", 16);
      this.pumpPrompt.setOrigin(0.5);
      this.pumpPrompt.setVisible(pumpReady || props.nextLevel === null);
      if (pumpReady) this.pumpPrompt.setInteractive({ useHandCursor: true });
      this.marker = this.add.circle(pumpReady ? destination.marker.x : 447, pumpReady ? destination.marker.y : 246, 17, 0xffdf92, 0.28).setStrokeStyle(3, 0xfff4b8).setVisible(pumpReady);
      if (pumpReady) this.marker.setInteractive({ useHandCursor: true });
      this.tweens.add({ targets: this.marker, scale: 1.25, alpha: 0.5, yoyo: true, repeat: -1, duration: 750 });
      this.input.on("pointerdown", (pointer: Phaser.Input.Pointer, hit: Phaser.GameObjects.GameObject[]) => {
        if (props.transitioning) return;
        props.audio?.unlock();
        if (this.locked) return;
        const { x, y } = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
        if (props.nextLevel === "pumpHouse" && !props.keeperMet && (hit.includes(keeperHit) || (Math.abs(x - 447) < 30 && y >= 310 && y <= 425))) { this.target = { x: 409, y: 418 }; this.locked = true; this.walkThen(() => props.onEvent({ type: "keeper", position: { ...this.player } })); return; }
        if (pumpReady && (hit.includes(pump) || hit.includes(this.marker!) || hit.includes(this.pumpPrompt!) ||
          (Math.abs(x - destination.marker.x) < 40 && Math.abs(y - destination.marker.y) < 44))) {
          this.target = { ...destination.walk }; this.locked = true;
          this.walkThen(() => props.onEvent({ type: "pump", position: { ...this.player } })); return;
        }
        this.target = { x: Phaser.Math.Clamp(x, 85, 855), y: Phaser.Math.Clamp(y, 379, 486) };
      });
      this.keys = this.input.keyboard?.addKeys("W,A,S,D,UP,DOWN,LEFT,RIGHT") as Record<string, Phaser.Input.Keyboard.Key>;
      hudParts.push(panel(this, 26, 469, 326, 46, 0.84));
      hudParts.push(label(this, 44, 480, props.nextLevel && props.nextLevel !== "pumpHouse" ? "Walk to the glowing marker →" : props.nextLevel === null ? "Oasis chapter complete" : props.keeperMet ? "Walk to the Pump House →" : "Talk to the Keeper →", 14));
      mapHud(this, hudParts);
      props.onReady();
    }
    walkThen(done: () => void) {
      const travel = Math.hypot(this.target.x - this.player.x, this.target.y - this.player.y);
      this.tweens.add({ targets: this.player, x: this.target.x, y: this.target.y, duration: props.reducedMotion ? 1 : travel * 4.5, onComplete: done });
    }
    update(_: number, delta: number) {
      if (!this.playerGraphic) return;
      if (!this.locked && !props.transitioning) {
        const speed = delta * 0.19;
        const dx = Number(this.keys?.D?.isDown || this.keys?.RIGHT?.isDown) - Number(this.keys?.A?.isDown || this.keys?.LEFT?.isDown);
        const dy = Number(this.keys?.S?.isDown || this.keys?.DOWN?.isDown) - Number(this.keys?.W?.isDown || this.keys?.UP?.isDown);
        if (dx || dy) { this.target = { x: Phaser.Math.Clamp(this.player.x + dx * speed, 80, 850), y: Phaser.Math.Clamp(this.player.y + dy * speed, 379, 486) }; }
        const distance = Math.hypot(this.target.x - this.player.x, this.target.y - this.player.y);
        if (distance > 1) {
          this.player.x += (this.target.x - this.player.x) / distance * Math.min(speed, distance);
          this.player.y += (this.target.y - this.player.y) / distance * Math.min(speed, distance);
        }
      }
      const movedX = this.player.x - this.previousPlayer.x;
      const movedY = this.player.y - this.previousPlayer.y;
      const moving = Math.abs(movedX) + Math.abs(movedY) > 0.08;
      if (Math.abs(movedX) > 0.08) this.facing = movedX > 0 ? "right" : "left";
      const animation = characterAnimation(this, "mechanic", this.facing);
      if (moving) {
        if (this.playerGraphic.anims.currentAnim?.key !== animation || !this.playerGraphic.anims.isPlaying) this.playerGraphic.play(animation);
      } else {
        this.playerGraphic.stop();
        this.playerGraphic.setFrame(this.facing === "right" ? "0" : "4");
      }
      characterPosition(this.playerGraphic, "mechanic", this.player.x, this.player.y);
      if (this.keeperGraphic) {
        const keeperFacing = this.player.x < 447 ? "left" : "right";
        const idleLift = props.reducedMotion ? 0 : Math.sin(this.time.now / 460) * 1;
        this.keeperGraphic.setFrame(keeperFacing === "left" ? "4" : "0");
        characterPosition(this.keeperGraphic, "keeper", 447, 408 + idleLift);
        for (const [index, glow] of this.keeperGlow.entries()) {
          glow.setFrame(keeperFacing === "left" ? "4" : "0");
          const [dx, dy] = [[-1.5, 0], [1.5, 0], [0, -1.5], [0, 1.5]][index];
          characterPosition(glow, "keeper", 447 + dx, 408 + dy + idleLift);
        }
      }
      this.previousPlayer = { ...this.player };
    }
  };
}

function makeCaravanScene(props: Props): typeof Phaser.Scene {
  return class CaravanScene extends Phaser.Scene {
    player = props.mapPosition ?? { x: 154, y: 439 };
    target = { ...this.player };
    previous = { ...this.player };
    playerGraphic?: Phaser.GameObjects.Sprite;
    wayfinderGraphic?: Phaser.GameObjects.Sprite;
    wayfinderGlow: Phaser.GameObjects.Sprite[] = [];
    keys?: Record<string, Phaser.Input.Keyboard.Key>;
    facing: "left" | "right" = "right";
    locked = false;
    constructor() { super("Caravan"); }
    preload() {
      this.load.on("loaderror", () => props.onFailure("asset-load"));
      this.load.image("caravan", assetUrl("/caravan.webp"));
      this.load.image("mechanic", assetUrl("/sprites/mechanic.png"));
      this.load.image("wayfinder", assetUrl("/sprites/wayfinder.png"));
      this.load.image("routeBeacon", assetUrl("/sprites/route-beacon.png"));
    }
    create() {
      registerFrames(this, "mechanic");
      registerFrames(this, "wayfinder");
      for (const direction of ["left", "right"] as const) {
        characterAnimation(this, "mechanic", direction);
        characterAnimation(this, "wayfinder", direction);
      }
      this.add.image(480, 270, "caravan").setDisplaySize(WIDTH, HEIGHT);
      const beacon = this.add.image(875, 410, "routeBeacon").setOrigin(0.5, 1).setDisplaySize(60, 130).setDepth(1);
      if (props.caravanComplete) {
        const light = this.add.circle(875, 297, 17, 0xffe5a0, 0.6).setDepth(1);
        if (!props.reducedMotion) this.tweens.add({ targets: light, alpha: 0.15, scale: 2.3, duration: 1100, yoyo: true, repeat: -1 });
        beacon.setTint(0xfff5cf);
      }
      const hudParts: Phaser.GameObjects.GameObject[] = [
        panel(this, 22, 91, 302, 66, 0.92),
        label(this, 40, 100, "OPEN DESERT", 26),
        label(this, 40, 132, "THE WALKER TRAIN", 13, "#9de4d4"),
      ];
      const person = this.add.sprite(677, 433, "wayfinder", "4").setOrigin(0.5, 1).setScale(91 / 430);
      characterPosition(person, "wayfinder", 677, 433);
      person.setDepth(2);
      this.wayfinderGraphic = person;
      for (const [dx, dy] of [[-1.4, 0], [1.4, 0], [0, -1.4], [0, 1.4]]) {
        const glow = this.add.sprite(677, 433, "wayfinder", "4").setOrigin(0.5, 1).setScale(91 / 430).setTintFill(0xffe6ae).setAlpha(0.7);
        characterPosition(glow, "wayfinder", 677 + dx, 433 + dy);
        glow.setDepth(1);
        this.wayfinderGlow.push(glow);
      }
      if (!props.reducedMotion) this.tweens.add({ targets: this.wayfinderGlow, alpha: 0.12, duration: 800, yoyo: true, repeat: -1 });
      const actionAvailable = props.nextLevel === "caravanPennants";
      const routeLevel = props.nextLevel && LEVELS[props.nextLevel].chapter === "caravan" && !actionAvailable ? LEVELS[props.nextLevel] : null;
      const destination = routeLevel ? MAP_DESTINATIONS[routeLevel.destination] : null;
      const hit = this.add.zone(677, 388, 82, 125);
      if (actionAvailable) hit.setInteractive({ useHandCursor: true });
      const caption = label(this, 677, 337, actionAvailable ? "WAYFINDER" : "ROUTE MARKED ✓", 15).setOrigin(0.5);
      if (actionAvailable) caption.setInteractive({ useHandCursor: true });
      let routeHit: Phaser.GameObjects.Zone | undefined;
      let routeCaption: Phaser.GameObjects.Text | undefined;
      if (destination && routeLevel) {
        const halo = this.add.circle(destination.marker.x, destination.marker.y, 15, 0xffdd8d, 0.48).setStrokeStyle(3, 0xfff0b8).setDepth(3);
        if (!props.reducedMotion) this.tweens.add({ targets: halo, alpha: 0.13, scale: 1.6, duration: 750, yoyo: true, repeat: -1 });
        routeHit = this.add.zone(destination.hit.x, destination.hit.y, destination.hit.width, destination.hit.height).setInteractive({ useHandCursor: true });
        routeCaption = label(this, destination.label.x, destination.label.y, routeLevel.title, 14).setOrigin(0.5).setDepth(4).setInteractive({ useHandCursor: true });
      }
      this.playerGraphic = this.add.sprite(this.player.x, this.player.y, "mechanic", "0").setOrigin(0.5, 1).setScale(70 / 420);
      characterPosition(this.playerGraphic, "mechanic", this.player.x, this.player.y);
      this.input.on("pointerdown", (pointer: Phaser.Input.Pointer, targets: Phaser.GameObjects.GameObject[]) => {
        if (props.transitioning || this.locked) return;
        props.audio?.unlock();
        const { x, y } = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
        if (actionAvailable && (targets.includes(hit) || targets.includes(caption) || (Math.abs(x - 677) < 41 && y >= 330 && y <= 447))) {
          this.locked = true;
          this.target = { x: 607, y: 439 };
          this.tweens.add({ targets: this.player, x: this.target.x, y: this.target.y,
            duration: props.reducedMotion ? 1 : Math.hypot(this.player.x - this.target.x, this.player.y - this.target.y) * 4.4,
            onComplete: () => props.onEvent({ type: "wayfinder", position: { ...this.player } }) });
          return;
        }
        if (destination && (targets.includes(routeHit!) || targets.includes(routeCaption!))) {
          this.locked = true;
          this.target = { ...destination.walk };
          this.tweens.add({ targets: this.player, x: this.target.x, y: this.target.y,
            duration: props.reducedMotion ? 1 : Math.hypot(this.player.x - this.target.x, this.player.y - this.target.y) * 4.4,
            onComplete: () => props.onEvent({ type: "pump", position: { ...this.player } }) });
          return;
        }
        this.target = { x: Phaser.Math.Clamp(x, 72, 869), y: Phaser.Math.Clamp(y, 389, 482) };
      });
      this.keys = this.input.keyboard?.addKeys("W,A,S,D,UP,DOWN,LEFT,RIGHT") as Record<string, Phaser.Input.Keyboard.Key>;
      hudParts.push(panel(this, 26, 469, 328, 46, 0.84));
      hudParts.push(label(this, 44, 480, actionAvailable ? "Walk to the Wayfinder →" : routeLevel ? `Walk to ${routeLevel.title} →` : props.caravanComplete ? "The route beacon is lit ✓" : "The route beacon waits ahead", 14));
      mapHud(this, hudParts);
      props.onReady();
    }
    update(_: number, delta: number) {
      if (!this.playerGraphic) return;
      if (!this.locked && !props.transitioning) {
        const speed = delta * 0.19;
        const dx = Number(this.keys?.D?.isDown || this.keys?.RIGHT?.isDown) - Number(this.keys?.A?.isDown || this.keys?.LEFT?.isDown);
        const dy = Number(this.keys?.S?.isDown || this.keys?.DOWN?.isDown) - Number(this.keys?.W?.isDown || this.keys?.UP?.isDown);
        if (dx || dy) this.target = { x: Phaser.Math.Clamp(this.player.x + dx * speed, 72, 869), y: Phaser.Math.Clamp(this.player.y + dy * speed, 389, 482) };
        const distance = Math.hypot(this.target.x - this.player.x, this.target.y - this.player.y);
        if (distance > 1) {
          this.player.x += (this.target.x - this.player.x) / distance * Math.min(speed, distance);
          this.player.y += (this.target.y - this.player.y) / distance * Math.min(speed, distance);
        }
      }
      const moved = this.player.x - this.previous.x;
      const moving = Math.abs(moved) + Math.abs(this.player.y - this.previous.y) > 0.08;
      if (Math.abs(moved) > 0.08) this.facing = moved > 0 ? "right" : "left";
      const animation = characterAnimation(this, "mechanic", this.facing);
      if (moving) {
        if (this.playerGraphic.anims.currentAnim?.key !== animation || !this.playerGraphic.anims.isPlaying) this.playerGraphic.play(animation);
      } else { this.playerGraphic.stop(); this.playerGraphic.setFrame(this.facing === "right" ? "0" : "4"); }
      characterPosition(this.playerGraphic, "mechanic", this.player.x, this.player.y);
      if (this.wayfinderGraphic) {
        const direction = this.player.x < 677 ? "left" : "right";
        const frame = direction === "left" ? "4" : "0";
        const lift = props.reducedMotion ? 0 : Math.sin(this.time.now / 470) * 1;
        this.wayfinderGraphic.setFrame(frame);
        characterPosition(this.wayfinderGraphic, "wayfinder", 677, 433 + lift);
        for (const [index, glow] of this.wayfinderGlow.entries()) {
          const [dx, dy] = [[-1.4, 0], [1.4, 0], [0, -1.4], [0, 1.4]][index];
          glow.setFrame(frame); characterPosition(glow, "wayfinder", 677 + dx, 433 + dy + lift);
        }
      }
      this.previous = { ...this.player };
    }
  };
}

function makeGatehouseScene(props: Props): typeof Phaser.Scene {
  return class GatehouseScene extends Phaser.Scene {
    player = props.mapPosition ?? { x: 190, y: 464 };
    target = { ...this.player };
    previous = { ...this.player };
    playerGraphic?: Phaser.GameObjects.Sprite;
    gatewrightGraphic?: Phaser.GameObjects.Sprite;
    glows: Phaser.GameObjects.Sprite[] = [];
    keys?: Record<string, Phaser.Input.Keyboard.Key>;
    facing: "left" | "right" = "right";
    locked = false;
    constructor() { super("Gatehouse"); }
    preload() {
      this.load.on("loaderror", () => props.onFailure("asset-load"));
      this.load.image("gatehouse", assetUrl("/gatehouse.webp"));
      this.load.image("mechanic", assetUrl("/sprites/mechanic.png"));
      this.load.image("gatewright", assetUrl("/sprites/gatewright.png"));
      this.load.image("bridgeGate", assetUrl("/sprites/bridge-gate.png"));
    }
    create() {
      registerFrames(this, "mechanic"); registerFrames(this, "gatewright");
      for (const direction of ["left", "right"] as const) { characterAnimation(this, "mechanic", direction); characterAnimation(this, "gatewright", direction); }
      this.add.image(480, 270, "gatehouse").setDisplaySize(WIDTH, HEIGHT);
      if (!props.gatehouseComplete) {
        const gate = this.add.image(704, 296, "bridgeGate").setDisplaySize(153, 145).setDepth(1);
        gate.setTint(0xc9b38c);
      } else {
        const gate = this.add.image(704, 296, "bridgeGate").setDisplaySize(153, 145).setDepth(1).setTint(0xc9b38c);
        const aperture = this.make.graphics({ x: 0, y: 0 });
        aperture.fillStyle(0xffffff).fillRoundedRect(640, 236, 128, 141, 52);
        gate.setMask(aperture.createGeometryMask());
        if (props.gateOpening && !props.reducedMotion) this.tweens.add({ targets: gate, y: 158, duration: 1250, ease: "Cubic.easeInOut", onComplete: () => { gate.destroy(); aperture.destroy(); props.onEvent({ type: "gateOpened" }); } });
        else { gate.destroy(); aperture.destroy(); if (props.gateOpening) queueMicrotask(() => props.onEvent({ type: "gateOpened" })); }
        const light = this.add.ellipse(704, 330, 104, 137, 0xffe1a1, .13).setDepth(1);
        if (!props.reducedMotion) this.tweens.add({ targets: light, alpha: .32, duration: 1100, yoyo: true, repeat: -1 });
      }
      const hudParts: Phaser.GameObjects.GameObject[] = [
        panel(this, 22, 91, 302, 66, .92),
        label(this, 40, 100, "RIVER GATEHOUSE", 26),
        label(this, 40, 132, "THE BRIDGE INTO FARMLAND", 13, "#9de4d4"),
      ];
      const person = this.add.sprite(520, 452, "gatewright", "4").setOrigin(.5, 1).setScale(93 / 430).setDepth(2);
      characterPosition(person, "gatewright", 520, 452); this.gatewrightGraphic = person;
      for (const [dx,dy] of [[-1.5,0],[1.5,0],[0,-1.5],[0,1.5]]) {
        const glow = this.add.sprite(520, 452, "gatewright", "4").setOrigin(.5, 1).setScale(93 / 430).setTintFill(0xffe4af).setAlpha(.68).setDepth(1);
        characterPosition(glow, "gatewright", 520+dx, 452+dy); this.glows.push(glow);
      }
      if (!props.reducedMotion) this.tweens.add({ targets: this.glows, alpha: .12, duration: 850, yoyo: true, repeat: -1 });
      const arriving = props.nextLevel === "gatehouseApproach";
      const route = props.nextLevel && LEVELS[props.nextLevel].chapter === "gatehouse" && !arriving ? LEVELS[props.nextLevel] : null;
      const destination = route ? MAP_DESTINATIONS[route.destination] : null;
      const talkHit = this.add.zone(520, 407, 84, 104);
      if (arriving) talkHit.setInteractive({ useHandCursor: true });
      const talkCaption = label(this, 520, 355, arriving ? "GATEWRIGHT" : "BRIDGE ENGINEER ✓", 15).setOrigin(.5);
      if (arriving) talkCaption.setInteractive({ useHandCursor: true });
      let routeHit: Phaser.GameObjects.Zone | undefined; let routeCaption: Phaser.GameObjects.Text | undefined;
      if (destination && route) {
        const halo = this.add.circle(destination.marker.x, destination.marker.y, 15, 0xffdd8d, .48).setStrokeStyle(3, 0xfff0b8).setDepth(3);
        if (!props.reducedMotion) this.tweens.add({ targets: halo, alpha: .13, scale: 1.6, duration: 750, yoyo: true, repeat: -1 });
        routeHit = this.add.zone(destination.hit.x, destination.hit.y, destination.hit.width, destination.hit.height).setInteractive({ useHandCursor: true });
        routeCaption = label(this, destination.label.x, destination.label.y, route.title, 14).setOrigin(.5).setDepth(4).setInteractive({ useHandCursor: true });
      }
      this.playerGraphic = this.add.sprite(this.player.x, this.player.y, "mechanic", "0").setOrigin(.5, 1).setScale(70 / 420);
      characterPosition(this.playerGraphic, "mechanic", this.player.x, this.player.y);
      this.input.on("pointerdown", (pointer: Phaser.Input.Pointer, targets: Phaser.GameObjects.GameObject[]) => {
        if (props.transitioning || this.locked) return;
        props.audio?.unlock();
        const {x,y} = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
        if (arriving && (targets.includes(talkHit) || targets.includes(talkCaption) || Math.abs(x-520)<42 && y>=350 && y<=458)) {
          this.locked = true; this.target = {x:465,y:455}; this.tweens.add({targets:this.player,x:this.target.x,y:this.target.y,duration:props.reducedMotion?1:Math.hypot(this.player.x-this.target.x,this.player.y-this.target.y)*4.4,onComplete:()=>props.onEvent({type:"gatewright",position:{...this.player}})}); return;
        }
        if (destination && (targets.includes(routeHit!) || targets.includes(routeCaption!))) {
          this.locked = true; this.target = {...destination.walk}; this.tweens.add({targets:this.player,x:this.target.x,y:this.target.y,duration:props.reducedMotion?1:Math.hypot(this.player.x-this.target.x,this.player.y-this.target.y)*4.4,onComplete:()=>props.onEvent({type:"pump",position:{...this.player}})}); return;
        }
        this.target = {x:Phaser.Math.Clamp(x,68,882),y:Phaser.Math.Clamp(y,420,491)};
      });
      this.keys = this.input.keyboard?.addKeys("W,A,S,D,UP,DOWN,LEFT,RIGHT") as Record<string, Phaser.Input.Keyboard.Key>;
      hudParts.push(panel(this,26,469,328,46,.84));
      hudParts.push(label(this,44,480,arriving?"Walk to the Gatewright →":route?`Walk to ${route.title} →`:"The crossing is open ✓",14));
      mapHud(this, hudParts);
      props.onReady();
    }
    update(_:number,delta:number) {
      if (!this.playerGraphic) return;
      if (!this.locked && !props.transitioning) {
        const speed=delta*.19;
        const dx=Number(this.keys?.D?.isDown||this.keys?.RIGHT?.isDown)-Number(this.keys?.A?.isDown||this.keys?.LEFT?.isDown);
        const dy=Number(this.keys?.S?.isDown||this.keys?.DOWN?.isDown)-Number(this.keys?.W?.isDown||this.keys?.UP?.isDown);
        if(dx||dy) this.target={x:Phaser.Math.Clamp(this.player.x+dx*speed,68,882),y:Phaser.Math.Clamp(this.player.y+dy*speed,420,491)};
        const distance=Math.hypot(this.target.x-this.player.x,this.target.y-this.player.y);
        if(distance>1){this.player.x+=(this.target.x-this.player.x)/distance*Math.min(speed,distance);this.player.y+=(this.target.y-this.player.y)/distance*Math.min(speed,distance);}
      }
      const moved=this.player.x-this.previous.x;
      const moving=Math.abs(moved)+Math.abs(this.player.y-this.previous.y)>.08;
      if(Math.abs(moved)>.08)this.facing=moved>0?"right":"left";
      const animation=characterAnimation(this,"mechanic",this.facing);
      if(moving){if(this.playerGraphic.anims.currentAnim?.key!==animation||!this.playerGraphic.anims.isPlaying)this.playerGraphic.play(animation);}else{this.playerGraphic.stop();this.playerGraphic.setFrame(this.facing==="right"?"0":"4");}
      characterPosition(this.playerGraphic,"mechanic",this.player.x,this.player.y);
      if(this.gatewrightGraphic){
        const direction=this.player.x<520?"left":"right";const frame=direction==="left"?"4":"0";const lift=props.reducedMotion?0:Math.sin(this.time.now/480);
        this.gatewrightGraphic.setFrame(frame);characterPosition(this.gatewrightGraphic,"gatewright",520,452+lift);
        for(const [i,glow] of this.glows.entries()){const [dx,dy]=[[-1.5,0],[1.5,0],[0,-1.5],[0,1.5]][i];glow.setFrame(frame);characterPosition(glow,"gatewright",520+dx,452+dy+lift);}
      }
      this.previous={...this.player};
    }
  };
}

function makeFarmlandScene(props: Props): typeof Phaser.Scene {
  return class FarmlandScene extends Phaser.Scene {
    player = props.mapPosition ?? { x: 190, y: 464 };
    target = { ...this.player };
    previous = { ...this.player };
    playerGraphic?: Phaser.GameObjects.Sprite;
    fieldkeeperGraphic?: Phaser.GameObjects.Sprite;
    glows: Phaser.GameObjects.Sprite[] = [];
    keys?: Record<string, Phaser.Input.Keyboard.Key>;
    facing: "left" | "right" = "right";
    locked = false;
    constructor() { super("Farmland"); }
    preload() {
      this.load.on("loaderror", () => props.onFailure("asset-load"));
      this.load.image("farmland", assetUrl("/farmland.webp"));
      this.load.image("mechanic", assetUrl("/sprites/mechanic.png"));
      this.load.image("fieldkeeper", assetUrl("/sprites/fieldkeeper.png"));
    }
    create() {
      registerFrames(this, "mechanic"); registerFrames(this, "fieldkeeper");
      for (const direction of ["left", "right"] as const) { characterAnimation(this, "mechanic", direction); characterAnimation(this, "fieldkeeper", direction); }
      this.add.image(480, 270, "farmland").setDisplaySize(WIDTH, HEIGHT);
      const hudParts: Phaser.GameObjects.GameObject[] = [
        panel(this, 22, 91, 302, 66, .92),
        label(this, 40, 100, "FARMLAND", 26),
        label(this, 40, 132, "THE SEED LEDGER", 13, "#9de4d4"),
      ];
      const person = this.add.sprite(540, 430, "fieldkeeper", "4").setOrigin(.5, 1).setScale(86 / 256).setDepth(2);
      characterPosition(person, "fieldkeeper", 540, 430); this.fieldkeeperGraphic = person;
      for (const [dx,dy] of [[-1.5,0],[1.5,0],[0,-1.5],[0,1.5]]) {
        const glow = this.add.sprite(540, 430, "fieldkeeper", "4").setOrigin(.5, 1).setScale(86 / 256).setTintFill(0xffe4af).setAlpha(.68).setDepth(1);
        characterPosition(glow, "fieldkeeper", 540+dx, 430+dy); this.glows.push(glow);
      }
      if (!props.reducedMotion) this.tweens.add({ targets: this.glows, alpha: .12, duration: 850, yoyo: true, repeat: -1 });
      const arriving = props.nextLevel === "seedStore";
      const route = props.nextLevel && LEVELS[props.nextLevel].chapter === "farmland" && !arriving ? LEVELS[props.nextLevel] : null;
      const destination = route ? MAP_DESTINATIONS[route.destination] : null;
      const talkHit = this.add.zone(540, 389, 100, 115);
      if (arriving) talkHit.setInteractive({ useHandCursor: true });
      const talkCaption = label(this, 540, 329, arriving ? "FIELDKEEPER" : "FIELDKEEPER ✓", 15).setOrigin(.5);
      if (arriving) talkCaption.setInteractive({ useHandCursor: true });
      let routeHit: Phaser.GameObjects.Zone | undefined; let routeCaption: Phaser.GameObjects.Text | undefined;
      if (destination && route) {
        const halo = this.add.circle(destination.marker.x, destination.marker.y, 15, 0xffdd8d, .48).setStrokeStyle(3, 0xfff0b8).setDepth(3);
        if (!props.reducedMotion) this.tweens.add({ targets: halo, alpha: .13, scale: 1.6, duration: 750, yoyo: true, repeat: -1 });
        routeHit = this.add.zone(destination.hit.x, destination.hit.y, destination.hit.width, destination.hit.height).setInteractive({ useHandCursor: true });
        routeCaption = label(this, destination.label.x, destination.label.y, route.title, 14).setOrigin(.5).setDepth(4).setInteractive({ useHandCursor: true });
      }
      this.playerGraphic = this.add.sprite(this.player.x, this.player.y, "mechanic", "0").setOrigin(.5, 1).setScale(70 / 420);
      characterPosition(this.playerGraphic, "mechanic", this.player.x, this.player.y);
      this.input.on("pointerdown", (pointer: Phaser.Input.Pointer, targets: Phaser.GameObjects.GameObject[]) => {
        if (props.transitioning || this.locked) return;
        props.audio?.unlock();
        const {x,y} = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
        if (arriving && (targets.includes(talkHit) || targets.includes(talkCaption) || Math.abs(x-540)<42 && y>=329 && y<=445)) {
          this.locked = true; this.target = {x:488,y:447}; this.tweens.add({targets:this.player,x:this.target.x,y:this.target.y,duration:props.reducedMotion?1:Math.hypot(this.player.x-this.target.x,this.player.y-this.target.y)*4.4,onComplete:()=>props.onEvent({type:"fieldkeeper",position:{...this.player}})}); return;
        }
        if (destination && (targets.includes(routeHit!) || targets.includes(routeCaption!))) {
          this.locked = true; this.target = {...destination.walk}; this.tweens.add({targets:this.player,x:this.target.x,y:this.target.y,duration:props.reducedMotion?1:Math.hypot(this.player.x-this.target.x,this.player.y-this.target.y)*4.4,onComplete:()=>props.onEvent({type:"pump",position:{...this.player}})}); return;
        }
        this.target = {x:Phaser.Math.Clamp(x,68,882),y:Phaser.Math.Clamp(y,420,491)};
      });
      this.keys = this.input.keyboard?.addKeys("W,A,S,D,UP,DOWN,LEFT,RIGHT") as Record<string, Phaser.Input.Keyboard.Key>;
      hudParts.push(panel(this,26,469,328,46,.84));
      hudParts.push(label(this,44,480,arriving?"Walk to the Fieldkeeper →":route?`Walk to ${route.title} →`:"The harvest road is open ✓",14));
      mapHud(this, hudParts);
      props.onReady();
    }
    update(_:number,delta:number) {
      if (!this.playerGraphic) return;
      if (!this.locked && !props.transitioning) {
        const speed=delta*.19;
        const dx=Number(this.keys?.D?.isDown||this.keys?.RIGHT?.isDown)-Number(this.keys?.A?.isDown||this.keys?.LEFT?.isDown);
        const dy=Number(this.keys?.S?.isDown||this.keys?.DOWN?.isDown)-Number(this.keys?.W?.isDown||this.keys?.UP?.isDown);
        if(dx||dy) this.target={x:Phaser.Math.Clamp(this.player.x+dx*speed,68,882),y:Phaser.Math.Clamp(this.player.y+dy*speed,420,491)};
        const distance=Math.hypot(this.target.x-this.player.x,this.target.y-this.player.y);
        if(distance>1){this.player.x+=(this.target.x-this.player.x)/distance*Math.min(speed,distance);this.player.y+=(this.target.y-this.player.y)/distance*Math.min(speed,distance);}
      }
      const moved=this.player.x-this.previous.x;
      const moving=Math.abs(moved)+Math.abs(this.player.y-this.previous.y)>.08;
      if(Math.abs(moved)>.08)this.facing=moved>0?"right":"left";
      const animation=characterAnimation(this,"mechanic",this.facing);
      if(moving){if(this.playerGraphic.anims.currentAnim?.key!==animation||!this.playerGraphic.anims.isPlaying)this.playerGraphic.play(animation);}else{this.playerGraphic.stop();this.playerGraphic.setFrame(this.facing==="right"?"0":"4");}
      characterPosition(this.playerGraphic,"mechanic",this.player.x,this.player.y);
      if(this.fieldkeeperGraphic){
        const direction=this.player.x<540?"left":"right";const frame=direction==="left"?"4":"0";const lift=props.reducedMotion?0:Math.sin(this.time.now/480);
        this.fieldkeeperGraphic.setFrame(frame);characterPosition(this.fieldkeeperGraphic,"fieldkeeper",540,430+lift);
        for(const [i,glow] of this.glows.entries()){const [dx,dy]=[[-1.5,0],[1.5,0],[0,-1.5],[0,1.5]][i];glow.setFrame(frame);characterPosition(glow,"fieldkeeper",540+dx,430+dy+lift);}
      }
      this.previous={...this.player};
    }
  };
}

function makePuzzleScene(props: Props): typeof Phaser.Scene {
  return class PuzzleScene extends Phaser.Scene {
    puzzle: Puzzle = props.puzzle ?? createPuzzle(props.level);
    displayBoard: Board = this.puzzle.board;
    displayCrust: CrustGrid = this.puzzle.crust.map(row => [...row]);
    crustPieces = new Map<string, Phaser.GameObjects.Container>();
    selected: Cell | null = null;
    busy = false;
    clearStreak = 0;
    lastTap: { cell: Cell; time: number } | null = null;
    pieces = new Map<number, { graphic: Phaser.GameObjects.Container; kind: SymbolKind | "seedpod"; hp?: number; jet?: "row" | "column"; power?: Power }>();
    lessonHint?: Phaser.GameObjects.Graphics;
    lessonPowerId?: number;
    lessonPowerHint?: Phaser.GameObjects.Graphics;
    hud: Phaser.GameObjects.GameObject[] = [];
    selection?: Phaser.GameObjects.Graphics;
    message?: Phaser.GameObjects.Text;
    keeperPortrait?: Phaser.GameObjects.Image;
    revealPlan?: FinalePlan;
    revealActive = false;
    revealSkipped = false;
    sceneAlive = true;
    finaleDone = false;
    pendingReveal = new Set<() => void>();
    pendingAnimations = new Set<() => void>();
    introActive = true;
    introPending = new Set<() => void>();
    constructor() { super("Puzzle"); }
    preload() {
      this.load.on("loaderror", () => props.onFailure("asset-load"));
      this.load.image("backdrop", props.level.chapter === "farmland" ? assetUrl("/farmland.webp") : props.level.chapter === "gatehouse" ? assetUrl("/gatehouse.webp") : props.level.chapter === "caravan" ? assetUrl("/caravan.webp") : assetUrl("/oasis.webp"));
      this.load.image("tiles", assetUrl("/sprites/tiles.png"));
      this.load.image("companionAvatar", props.level.chapter === "farmland" ? assetUrl("/sprites/fieldkeeper-avatar.png") : props.level.chapter === "gatehouse" ? assetUrl("/sprites/gatewright-avatar.png") : props.level.chapter === "caravan" ? assetUrl("/sprites/wayfinder-avatar.png") : assetUrl("/sprites/keeper-avatar.png"));
      this.load.image("pennant", assetUrl("/sprites/pennant.png"));
      this.load.image("key", assetUrl("/sprites/key.png"));
      this.load.image("coin", assetUrl("/sprites/coin.png"));
      this.load.image("flywheel", assetUrl("/sprites/flywheel.png"));
      this.load.image("prism", assetUrl("/sprites/prism.png"));
      this.load.image("saltCrust", assetUrl("/sprites/salt-crust.png"));
      this.load.image("saltCrust2", assetUrl("/sprites/salt-crust-2.png"));
      this.load.image("seedpod", assetUrl("/sprites/seedpod.png"));
      this.load.image("seedpodCracked", assetUrl("/sprites/seedpod-cracked.png"));
    }
    create() {
      registerFrames(this, "tiles");
      const backdrop = this.add.image(480, 270, "backdrop").setDisplaySize(WIDTH, HEIGHT).setTint(0x85949a);
      const veil = this.add.graphics();
      sceneLayouts.set(this, { mode: "puzzle", backdrop, veil });
      layoutScene(this, Number(this.game.config.width), Number(this.game.config.height));
      panel(this, 24, 92, 271, 424, 0.96);
      panel(this, 318, 20, 474, 500, 0.98);
      label(this, 50, 106, props.level.title, props.level.title.length > 15 ? 19 : props.level.title.length > 13 ? 21 : 24);
      for (let row = 0; row < BOARD_SIZE; row++) for (let col = 0; col < BOARD_SIZE; col++) {
        if (!this.puzzle.mask[row][col]) continue;
        const x = GRID_X + col * CELL, y = GRID_Y + row * CELL;
        const cell = this.add.graphics();
        cell.fillStyle((row + col) % 2 ? 0x28515d : 0x2c5a64).fillRoundedRect(x + 2, y + 2, CELL - 4, CELL - 4, 6);
      }
      this.selection = this.add.graphics();
      for (let row = 0; row < BOARD_SIZE; row++) for (let col = 0; col < BOARD_SIZE; col++) if (this.displayCrust[row][col]) this.makeCrust({ row, col }, this.displayCrust[row][col]);
      this.message = label(this, 51, 457, "Drag or tap adjacent symbols to swap", 12, "#d2c5a5").setWordWrapWidth(220);
      this.add.circle(75, 392, 30, 0x264d59).setStrokeStyle(2, 0xe0bd82);
      this.keeperPortrait = this.add.image(75, 392, prepareSmallTexture(this, "companionAvatar", "companionAvatar-small", 162)).setDisplaySize(54, 54);
      // Native pointer capture keeps fast touch swipes intact even when the finger
      // leaves the board or canvas. Move across one dominant axis, one cell only.
      const canvas = this.game.canvas;
      let gesture: { id: number; from: Cell; x: number; y: number; committed: boolean } | null = null;
      const logical = (event: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        return this.cameras.main.getWorldPoint(
          (event.clientX - rect.left) * canvas.width / rect.width,
          (event.clientY - rect.top) * canvas.height / rect.height,
        );
      };
      const cellAtPoint = (x: number, y: number): Cell | null => {
        const col = Math.floor((x - GRID_X) / CELL), row = Math.floor((y - GRID_Y) / CELL);
        return row >= 0 && col >= 0 && row < BOARD_SIZE && col < BOARD_SIZE && this.puzzle.mask[row][col]
          && !this.displayCrust[row][col] && this.displayBoard[row][col]?.kind !== "seedpod" ? { row, col } : null;
      };
      const commitSwipe = (event: PointerEvent) => {
        if (!gesture || gesture.id !== event.pointerId || gesture.committed || this.busy || props.transitioning) return;
        const point = logical(event), dx = point.x - gesture.x, dy = point.y - gesture.y;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 12) return;
        const to = Math.abs(dx) >= Math.abs(dy)
          ? { row: gesture.from.row, col: gesture.from.col + Math.sign(dx) }
          : { row: gesture.from.row + Math.sign(dy), col: gesture.from.col };
        gesture.committed = true;
        if (!this.puzzle.mask[to.row]?.[to.col] || this.displayCrust[to.row][to.col] || !this.displayBoard[to.row][to.col]) return;
        this.selected = gesture.from;
        void this.choose(to);
      };
      const down = (event: PointerEvent) => {
        if (this.busy || props.transitioning || gesture || event.button !== 0) return;
        const point = logical(event), from = cellAtPoint(point.x, point.y);
        if (!from) return;
        props.audio?.unlock();
        gesture = { id: event.pointerId, from, x: point.x, y: point.y, committed: false };
        canvas.setPointerCapture(event.pointerId);
      };
      const move = (event: PointerEvent) => commitSwipe(event);
      const up = (event: PointerEvent) => {
        if (!gesture || gesture.id !== event.pointerId) return;
        const current = gesture;
        commitSwipe(event);
        const tapped = !gesture.committed;
        gesture = null;
        if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
        if (tapped && !this.busy && !props.transitioning) void this.choose(current.from);
      };
      const cancel = (event: PointerEvent) => {
        if (gesture?.id === event.pointerId) gesture = null;
      };
      canvas.addEventListener("pointerdown", down);
      canvas.addEventListener("pointermove", move);
      canvas.addEventListener("pointerup", up);
      canvas.addEventListener("pointercancel", cancel);
      canvas.addEventListener("lostpointercapture", cancel);
      this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
        this.sceneAlive = false;
        this.revealSkipped = true;
        this.introActive = false;
        for (const cancelIntro of this.introPending) cancelIntro();
        this.introPending.clear();
        for (const cancelAnimation of [...this.pendingAnimations]) cancelAnimation();
        this.pendingAnimations.clear();
        this.pendingReveal.clear();
        canvas.removeEventListener("pointerdown", down);
        canvas.removeEventListener("pointermove", move);
        canvas.removeEventListener("pointerup", up);
        canvas.removeEventListener("pointercancel", cancel);
        canvas.removeEventListener("lostpointercapture", cancel);
        delete canvas.dataset.revealPhase;
        delete canvas.dataset.playReady;
        delete canvas.dataset.introPhase;
        props.skipReveal.current = null;
      });
      props.skipReveal.current = () => this.skipWinningReveal();
      this.syncTiles(this.puzzle.board, 0, "refill");
      for (const placement of props.startingBoosters) this.pieces.get(placement.tileId)?.graphic.setAlpha(0);
      this.renderHud();
      this.busy = true;
      void Promise.resolve(props.onReady()).then(authorized => {
        if (authorized && this.sceneAlive && this.introActive) void this.revealGoals();
      }).catch(() => props.onFailure('authorization-failed'));
    }
    async revealGoals() {
      this.busy = true;
      this.game.canvas.dataset.introPhase = "curtain";
      while (this.introActive && props.transitioning) await this.introWait(40);
      if (!this.introActive) return;
      this.game.canvas.dataset.introPhase = "goals";
      await this.showGoalBanner(false);
      if (!this.introActive) return;
      if (props.startingBoosters.length) {
        this.game.canvas.dataset.introPhase = "boosters";
        this.setMessage("Starting boosters incoming…");
        await this.deliverStartingBoosters();
      }
      if (!this.introActive) return;
      this.showLessonHint();
      if (!this.puzzle.opening) this.setMessage("Drag or tap adjacent symbols to swap");
      this.busy = false;
      this.game.canvas.dataset.introPhase = "ready";
      this.game.canvas.dataset.playReady = "true";
      props.onEvent({ type: "playReady" });
    }
    introWait(ms: number): Promise<void> {
      if (!this.introActive) return Promise.resolve();
      return new Promise(resolve => {
        const done = () => { this.introPending.delete(cancel); resolve(); };
        const timer = this.time.delayedCall(ms, done);
        const cancel = () => { timer.remove(false); done(); };
        this.introPending.add(cancel);
      });
    }
    introTween(target: object, config: Omit<Phaser.Types.Tweens.TweenBuilderConfig, "targets" | "onComplete">): Promise<void> {
      if (!this.introActive) return Promise.resolve();
      return new Promise(resolve => {
        const done = () => { this.introPending.delete(cancel); resolve(); };
        const tween = this.tweens.add({ targets: target, ...config, onComplete: done });
        const cancel = () => { tween.stop(); done(); };
        this.introPending.add(cancel);
      });
    }
    async deliverStartingBoosters() {
      const avatar = this.keeperPortrait;
      if (avatar && !props.reducedMotion) {
        props.audio?.play("keeper");
        void this.introTween(avatar, { angle: 9, y: 386, yoyo: true, repeat: 2, duration: 85 }).then(() => {
          if (this.introActive) avatar.setPosition(75, 392).setAngle(0);
        });
      }
      await Promise.all(props.startingBoosters.map(async (placement, index) => {
        if (index) await this.introWait(props.reducedMotion ? index * 20 : index * 90);
        if (!this.introActive) return;
        const tile = this.puzzle.board[placement.cell.row]?.[placement.cell.col];
        const destination = this.pieces.get(placement.tileId)?.graphic;
        if (!tile || !destination) return;
        const p = this.center(placement.cell);
        const ring = this.add.circle(p.x, p.y, 19, 0xffdf92, 0).setStrokeStyle(3, 0xffd77d, 0.95).setDepth(35);
        if (props.reducedMotion) {
          destination.setAlpha(1);
          ring.setAlpha(0.7);
          await this.introTween(ring, { alpha: 0, scale: 1.25, duration: 90 });
        } else {
          const flight = drawPiece(this, 75, 392, tile.kind, tile.jet, false, tile.power).setDepth(42);
          const motion = { t: 0 };
          await this.introTween(motion, { t: 1, duration: 480, ease: "Cubic.easeInOut", onUpdate: () => {
            const t = motion.t;
            flight.setPosition(75 + (p.x - 75) * t, 392 + (p.y - 392) * t - Math.sin(Math.PI * t) * 80);
            flight.setScale(0.7 + 0.3 * t);
          } });
          flight.destroy();
          if (!this.introActive) { ring.destroy(); return; }
          destination.setAlpha(1);
          props.audio?.play("land");
          await Promise.all([
            this.introTween(destination, { scaleX: 1.13, scaleY: 1.13, yoyo: true, duration: 75 }),
            this.introTween(ring, { scale: 1.6, alpha: 0, duration: 150 }),
          ]);
        }
        ring.destroy();
      }));
    }
    async showGoalBanner(completed: boolean) {
      if (!this.sceneAlive) return;
      const background = this.add.graphics();
      background.fillStyle(0xffedc8).fillRoundedRect(-270, 0, 540, 144, 16);
      background.lineStyle(3, 0xc49551).strokeRoundedRect(-270, 0, 540, 144, 16);
      const title = this.add.text(0, completed ? 48 : 20, completed ? "ALL GOALS CLEARED!" : `${props.level.title} · COLLECT`, {
        fontFamily: "Arial, sans-serif", fontSize: completed ? "32px" : "22px", fontStyle: "bold", color: "#21444a",
      }).setOrigin(0.5, 0);
      const contents: Phaser.GameObjects.GameObject[] = [background, title];
      if (!completed) {
        const goals = Object.entries(props.level.goals).filter(([, count]) => count > 0) as [GoalKind, number][];
        goals.forEach(([kind, count], index) => {
          const x = goals.length === 1 ? -35 : goals.length === 2 ? index === 0 ? -170 : 65 : -205 + index * 170;
          contents.push(drawGoalIcon(this, x, 91, kind));
          contents.push(this.add.text(x + 33, 76, `${count} ${goalName(kind).toLowerCase()}`, { fontFamily: "Arial, sans-serif", fontSize: goals.length > 2 ? "18px" : "23px", fontStyle: "bold", color: "#21444a" }));
        });
      }
      const banner = this.add.container(WIDTH / 2, -160, contents).setDepth(40);
      const animate = (target: object, config: Omit<Phaser.Types.Tweens.TweenBuilderConfig, "targets" | "onComplete">) => completed ? this.tween(target, config) : this.introTween(target, config);
      if (props.reducedMotion) {
        banner.setY(115).setAlpha(0);
        await animate(banner, { alpha: 1, duration: 120 });
      } else {
        await animate(banner, { y: 115, duration: 480, ease: "Back.easeOut" });
      }
      if (!completed && !this.introActive) return;
      if (completed && this.revealSkipped) { banner.destroy(); return; }
      props.audio?.play("banner");
      await (completed ? this.wait(1000) : this.introWait(1300));
      if (!completed && !this.introActive) return;
      if (completed && this.revealSkipped) { banner.destroy(); return; }
      await animate(banner, props.reducedMotion ? { alpha: 0, duration: 120 } : { y: -160, duration: 280, ease: "Cubic.easeIn" });
      banner.destroy();
    }
    showLessonHint() {
      const opening = this.puzzle.opening;
      if (!opening) return;
      const guide = this.add.graphics().setDepth(12);
      for (const cell of opening) { const p = this.center(cell); guide.lineStyle(3, 0xffe9a5, 0.95).strokeRoundedRect(p.x - 22, p.y - 22, 44, 44, 8); }
      if (props.level.lesson === "crust") {
        const target = playTurn(this.puzzle, ...opening).steps.find(step => step.kind === "clear")?.crustHits?.[0];
        if (target) { const p = this.center(target); guide.lineStyle(4, 0xffc773, 0.95).strokeCircle(p.x, p.y, 24); }
      }
      this.lessonHint = guide;
      if (!props.reducedMotion) this.tweens.add({ targets: guide, alpha: 0.35, yoyo: true, repeat: -1, duration: 650 });
      this.setMessage(props.level.lesson === "seedpod" ? "Match beside each pod twice. Pods fall and cannot be swapped." : props.level.lesson === "crust" ? "Matches and Prism-cleared tiles crack nearby salt; Jets and Flywheels need a direct hit." : props.level.lesson === "combo" ? "Try combining the highlighted powers" : props.level.lesson === "pennant" ? "Try the glowing move to match three pennants" : props.level.lesson === "key" ? "Try the glowing move to match three keys" : `Try the glowing move to discover the ${props.level.lesson === "jet" ? "Pressure Jet" : props.level.lesson === "flywheel" ? "Flywheel" : "Prism"}`);
    }
    cellAt(pointer: Phaser.Input.Pointer): Cell | null {
      const position = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
      const col = Math.floor((position.x - GRID_X) / CELL);
      const row = Math.floor((position.y - GRID_Y) / CELL);
      return row >= 0 && col >= 0 && row < BOARD_SIZE && col < BOARD_SIZE && this.puzzle.mask[row][col] && !this.displayCrust[row][col] && this.displayBoard[row][col]?.kind !== "seedpod" ? { row, col } : null;
    }
    center(cell: Cell) { return { x: GRID_X + cell.col * CELL + CELL / 2, y: GRID_Y + cell.row * CELL + CELL / 2 }; }
    setMessage(message: string) { this.message?.setText(message); }
    renderHud(goals = this.puzzle.goals, moves = this.puzzle.moves, charge = this.puzzle.keeperCharge, fired = this.puzzle.keeperFired) {
      for (const object of this.hud) object.destroy();
      this.hud = [];
      this.hud.push(panel(this, 49, 145, 220, 66, 0.7));
      this.hud.push(label(this, 66, 150, String(moves), 38, "#ffe49e"));
      this.hud.push(label(this, 129, 164, "MOVES LEFT", 14));
      const goalRows = Object.entries(props.level.goals).filter(([, count]) => count > 0) as [GoalKind, number][];
      this.hud.push(label(this, 51, goalRows.length > 2 ? 216 : 227, "COLLECT", 17, "#a2e7da"));
      goalRows.forEach(([kind, count], index) => {
        const y = goalRows.length > 2 ? 257 + index * 38 : 279 + index * 55;
        this.hud.push(drawGoalIcon(this, 74, y, kind));
        this.hud.push(label(this, 106, y - 15, `${goals[kind] ?? 0}  ${goalName(kind)}`, 20));
      });
      this.hud.push(label(this, 110, 365, props.level.chapter === "farmland" ? "FIELDKEEPER'S POWER" : props.level.chapter === "gatehouse" ? "GATEWRIGHT'S POWER" : props.level.chapter === "caravan" ? "WAYFINDER'S POWER" : "KEEPER'S POWER", 14, "#a2e7da"));
      const meter = this.add.graphics();
      meter.fillStyle(0x315568).fillRoundedRect(110, 391, 153, 17, 7);
      meter.fillStyle(GREEN).fillRoundedRect(110, 391, 153 * Math.min(1, charge / this.puzzle.keeperTarget), 17, 7);
      this.hud.push(meter);
      this.hud.push(label(this, 110, 415, `${Math.min(charge, this.puzzle.keeperTarget)} / ${this.puzzle.keeperTarget} ${this.puzzle.chargeSymbol === "key" ? "KEYS" : this.puzzle.chargeSymbol === "pennant" ? "PENNANTS" : "REEDS"}`, 11));
      this.hud.push(label(this, 110, 429, this.puzzle.grantedPower === "prism" ? "→ ONE PRISM" : this.puzzle.grantedPower === "flywheels" ? "→ TWO FLYWHEELS" : "→ TWO JETS", 11));
    }
    highlight(cell: Cell | null) {
      this.selection?.clear();
      if (!cell) return;
      const x = GRID_X + cell.col * CELL, y = GRID_Y + cell.row * CELL;
      this.selection?.lineStyle(3, 0xffe396).strokeRoundedRect(x + 2, y + 2, CELL - 4, CELL - 4, 6);
    }
    wait(ms: number) {
      if (this.revealSkipped || !this.sceneAlive) return Promise.resolve();
      return new Promise<void>(resolve => {
        let timer: Phaser.Time.TimerEvent;
        const done = () => { this.pendingReveal.delete(cancel); this.pendingAnimations.delete(cancel); resolve(); };
        const cancel = () => { timer.remove(false); done(); };
        timer = this.time.delayedCall(ms, done);
        this.pendingAnimations.add(cancel);
        if (this.revealActive) this.pendingReveal.add(cancel);
      });
    }
    makeCrust(cell: Cell, hp: number) {
      const p = this.center(cell);
      const image = this.add.image(0, 0, prepareSmallTexture(this, hp > 1 ? "saltCrust2" : "saltCrust", hp > 1 ? "saltCrust2-small" : "saltCrust-small", 128)).setDisplaySize(47, 47);
      const contents: Phaser.GameObjects.GameObject[] = [image];
      if (hp > 1) contents.push(this.add.text(13, 10, String(hp), { fontFamily: "Arial, sans-serif", fontSize: "16px", fontStyle: "bold", color: "#493f33", stroke: "#fff2d5", strokeThickness: 3 }).setOrigin(0.5));
      const piece = this.add.container(p.x, p.y, contents).setDepth(6);
      this.crustPieces.set(`${cell.row},${cell.col}`, piece);
      return piece;
    }
    async showCrustHit(hit: { cell: Cell; hp: number }) {
      if (!this.sceneAlive) return;
      const k = `${hit.cell.row},${hit.cell.col}`;
      const old = this.crustPieces.get(k);
      if (!old) return;
      const p = this.center(hit.cell);
      props.audio?.play("salt");
      const dust = this.add.circle(p.x, p.y, 13, 0xffe8bb, 0.7).setDepth(8);
      void this.tween(dust, { scale: 2.7, alpha: 0, duration: props.reducedMotion ? 50 : 270 }).then(() => dust.destroy());
      if (hit.hp === 0) {
        this.crustPieces.delete(k);
        for (const [dx, dy] of [[-1,-1],[1,-1],[-1,1],[1,1]]) {
          const shard = this.add.triangle(p.x + dx * 7, p.y + dy * 7, 0, -5, 5, 4, -4, 4, 0xffeac0).setDepth(8);
          void this.tween(shard, { x: p.x + dx * 24, y: p.y + dy * 24, angle: dx * 70, alpha: 0, duration: props.reducedMotion ? 50 : 310 }).then(() => shard.destroy());
        }
        await this.tween(old, { scale: 0.5, alpha: 0, duration: props.reducedMotion ? 40 : 150 });
        if (!this.sceneAlive) return;
        old.destroy();
      } else {
        await this.tween(old, { scale: 1.12, duration: props.reducedMotion ? 25 : 70 });
        if (!this.sceneAlive) return;
        old.destroy(); this.crustPieces.delete(k); this.makeCrust(hit.cell, hit.hp);
      }
      this.displayCrust[hit.cell.row][hit.cell.col] = hit.hp;
    }
    tween(target: object, config: Omit<Phaser.Types.Tweens.TweenBuilderConfig, "targets" | "onComplete">) {
      if (this.revealSkipped || !this.sceneAlive) return Promise.resolve();
      return new Promise<void>(resolve => {
        const done = () => { this.pendingReveal.delete(cancel); this.pendingAnimations.delete(cancel); resolve(); };
        const tween = this.tweens.add({ targets: target, ...config, onComplete: done });
        const cancel = () => { tween.stop(); done(); };
        this.pendingAnimations.add(cancel);
        if (this.revealActive) this.pendingReveal.add(cancel);
      });
    }
    async syncTiles(board: Board, duration: number, kind: TurnStep["kind"]) {
      if (!this.sceneAlive) return;
      if (this.revealSkipped && duration > 0) return;
      const visible = new Set<number>();
      const animations: Promise<void>[] = [];
      const stagger = new Map<string, number>();
      if (duration > 0 && !props.reducedMotion && (kind === "fall" || kind === "refill")) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          let rank = 0;
          for (let row = BOARD_SIZE - 1; row >= 0; row--) {
            if (!this.puzzle.mask[row][col] || this.displayCrust[row][col]) { rank = 0; continue; }
            const tile = board[row][col];
            if (!tile) continue;
            const old = this.pieces.get(tile.id)?.graphic;
            if (!old || old.y < this.center({ row, col }).y - 1) stagger.set(`${row},${col}`, Math.min(rank++ * 22, 120));
          }
        }
      }
      for (let row = 0; row < BOARD_SIZE; row++) for (let col = 0; col < BOARD_SIZE; col++) {
        const tile = board[row][col];
        if (!tile) continue;
        visible.add(tile.id);
        const position = this.center({ row, col });
        let item = this.pieces.get(tile.id);
        if (item && (item.kind !== tile.kind || item.jet !== tile.jet || item.power !== tile.power || item.hp !== tile.hp)) {
          item.graphic.destroy(); this.pieces.delete(tile.id); item = undefined;
        }
        if (!item) {
          const graphic = drawPiece(this, 0, 0, tile.kind, tile.jet, !props.reducedMotion, tile.power, tile.hp);
          graphic.setDepth(5);
          let segmentTop = row;
          while (segmentTop > 0 && this.puzzle.mask[segmentTop - 1][col] && !this.displayCrust[segmentTop - 1][col]) segmentTop--;
          graphic.setPosition(position.x, kind === "refill" && duration > 0 && !props.reducedMotion ? GRID_Y + segmentTop * CELL - CELL - (stagger.get(`${row},${col}`) ?? 0) * 0.35 : position.y);
          if (kind === "refill" && duration > 0) graphic.setAlpha(0.2);
          item = { graphic, kind: tile.kind, hp: tile.hp, jet: tile.jet, power: tile.power };
          this.pieces.set(tile.id, item);
        }
        if (duration > 0) {
          const graphic = item.graphic;
          const lands = (kind === "fall" || kind === "refill") && graphic.y < position.y - 1;
          const movement = this.tween(graphic, { x: position.x, y: position.y, alpha: 1, duration, delay: stagger.get(`${row},${col}`) ?? 0, ease: "Cubic.easeOut" });
          animations.push(movement.then(async () => {
            if (!this.sceneAlive || !lands || props.reducedMotion || this.revealSkipped) return;
            await this.tween(graphic, { scaleX: 1.045, scaleY: 0.94, y: position.y + 1.5, duration: 45, ease: "Sine.easeOut" });
            if (!this.sceneAlive || this.revealSkipped) return;
            await this.tween(graphic, { scaleX: 1, scaleY: 1, y: position.y, duration: 115, ease: "Back.easeOut" });
          }));
        } else item.graphic.setPosition(position.x, position.y).setAlpha(1);
      }
      for (const [id, item] of this.pieces) if (!visible.has(id)) {
        this.pieces.delete(id);
        if (duration > 0 && kind === "clear") animations.push(this.tween(item.graphic, { alpha: 0, scale: 0.2, duration }).then(() => item.graphic.destroy()));
        else item.graphic.destroy();
      }
      await Promise.all(animations);
      if (this.sceneAlive && !this.revealSkipped && duration > 0 && (kind === "fall" || kind === "refill")) props.audio?.play("land");
    }
    async showJets(jets: TurnStep["jets"], speed = 1, onBeamLaunch?: (index: number, jet: TurnStep["jets"][number]) => Promise<void>) {
      if (!this.sceneAlive || !jets.length) return;
      const starts = jets.map(() => Number.POSITIVE_INFINITY);
      const visited = new Set<number>();
      starts[0] = 0;
      while (visited.size < jets.length) {
        let next = -1;
        for (let i = 0; i < jets.length; i++) {
          if (!visited.has(i) && (next < 0 || starts[i] < starts[next])) next = i;
        }
        if (!Number.isFinite(starts[next])) starts[next] = 0;
        visited.add(next);
        const source = jets[next];
        for (let i = 0; i < jets.length; i++) {
          if (visited.has(i)) continue;
          const target = jets[i];
          const aligned = source.direction === "row" ? source.cell.row === target.cell.row : source.cell.col === target.cell.col;
          if (!aligned) continue;
          const travel = props.reducedMotion
            ? Math.abs(source.direction === "row" ? target.cell.col - source.cell.col : target.cell.row - source.cell.row) * 12
            : beamTravelDelay(source.cell, source.direction, target.cell, speed);
          starts[i] = Math.min(starts[i], starts[next] + travel);
        }
      }
      const effects = jets.map(async ({ cell, direction }, index) => {
        if (starts[index] > 0) await this.wait(starts[index]);
        if (this.revealSkipped) return;
        const salt = onBeamLaunch?.(index, { cell, direction }) ?? Promise.resolve();
        props.audio?.play("jet");
        const p = this.center(cell);
        const beam = this.add.graphics().setDepth(20);
        const short = props.reducedMotion;
        const progress = { value: short ? 1 : 0 };
        const draw = () => {
          const low = direction === "row" ? GRID_X : GRID_Y;
          const origin = direction === "row" ? p.x : p.y;
          const start = Phaser.Math.Linear(origin, low, progress.value);
          const end = Phaser.Math.Linear(origin, low + CELL * BOARD_SIZE, progress.value);
          beam.clear().lineStyle(14, 0x20caca, 0.95);
          if (direction === "row") beam.lineBetween(start, p.y, end, p.y);
          else beam.lineBetween(p.x, start, p.x, end);
          beam.lineStyle(4, 0xfff5c9, 1);
          if (direction === "row") beam.lineBetween(start, p.y, end, p.y);
          else beam.lineBetween(p.x, start, p.x, end);
        };
        draw();
        if (!short) await this.tween(progress, { value: 1, duration: 240 / speed, onUpdate: draw });
        if (this.revealSkipped) { beam.destroy(); return; }
        await salt;
        if (this.revealSkipped) { beam.destroy(); return; }
        await this.wait(short ? 60 : 150 / speed);
        if (this.revealSkipped) { beam.destroy(); return; }
        await this.tween(beam, { alpha: 0, duration: short ? 50 : 150 / speed });
        beam.destroy();
      });
      await Promise.all(effects);
    }
    async showPowers(effects: NonNullable<TurnStep["effects"]>, speed = 1) {
      for (const effect of effects) {
        if (!this.sceneAlive || this.revealSkipped) return;
        const center = this.center(effect.cell);
        if (effect.power === "flywheel") {
          props.audio?.play("flywheel");
          const gear = this.add.image(center.x, center.y, prepareSmallTexture(this, "flywheel", "flywheel-small", 128)).setDisplaySize(50, 50).setDepth(24);
          const ring = this.add.graphics().setDepth(22);
          const cells = effect.targets;
          for (const cell of cells) { const p = this.center(cell); ring.lineStyle(2, 0xffd38b, 0.8).strokeRoundedRect(p.x - 24, p.y - 24, 48, 48, 7); }
          if (!props.reducedMotion) await this.tween(gear, { angle: 360, scaleX: gear.scaleX * 1.4, scaleY: gear.scaleY * 1.4, duration: 340 / speed, ease: "Cubic.easeIn" });
          if (this.revealSkipped) { ring.destroy(); gear.destroy(); return; }
          for (const cell of cells.filter((_, index) => index % 2 === 0)) {
            const p = this.center(cell); const dust = this.add.circle(p.x, p.y, 4, 0xffd49a).setDepth(23);
            void this.tween(dust, { x: p.x + (cell.col - effect.cell.col) * 9, y: p.y + (cell.row - effect.cell.row) * 9, alpha: 0, scale: 2, duration: props.reducedMotion ? 50 : 260 / speed }).then(() => dust.destroy());
          }
          await this.tween(ring, { alpha: 0, duration: props.reducedMotion ? 40 : 170 / speed });
          ring.destroy(); gear.destroy();
        } else {
          props.audio?.play("prism");
          const prism = this.add.image(center.x, center.y, prepareSmallTexture(this, "prism", "prism-small", 128)).setDisplaySize(48, 48).setDepth(26);
          const halo = this.add.circle(center.x, center.y, 28, 0xe9f9ff, 0.2).setStrokeStyle(3, 0xffffff).setDepth(25);
          if (!props.reducedMotion) await this.tween(halo, { scale: 1.7, alpha: 0.75, duration: 190, ease: "Sine.easeOut" });
          if (this.revealSkipped) { halo.destroy(); prism.destroy(); return; }
          const hues = [0xff6b6b, 0xffc35f, 0xf9e681, 0x93ecae, 0x71d7ff, 0xb7a3ff];
          for (let i = 0; i < effect.targets.length; i += 9) {
            const rays = this.add.graphics().setDepth(24);
            for (const [index, cell] of effect.targets.slice(i, i + 9).entries()) {
              const end = this.center(cell);
              rays.lineStyle(3, hues[(i + index) % hues.length], 0.9).lineBetween(center.x, center.y, end.x, end.y);
              const spark = this.add.circle(end.x, end.y, 4, hues[(i + index) % hues.length]).setDepth(25);
              void this.tween(spark, { scale: 2.4, alpha: 0, duration: props.reducedMotion ? 30 : 180 }).then(() => spark.destroy());
            }
            await this.tween(rays, { alpha: 0, duration: props.reducedMotion ? 20 : 75 });
            rays.destroy();
            if (this.revealSkipped) { halo.destroy(); prism.destroy(); return; }
          }
          halo.destroy(); prism.destroy();
        }
      }
    }
    async showSequence(step: TurnStep, speed = 1) {
      if (!this.sceneAlive) return;
      const revealedSalt = new Set<number>();
      const revealedPods = new Set<number>();
      const revealPodAt = async (after: number, jet?: TurnStep["jets"][number]) => {
        for (const [index, event] of (step.podEvents ?? []).entries()) if (event.after === after && !revealedPods.has(index)) {
          revealedPods.add(index);
          await Promise.all(event.hits.map(async hit => {
            if (jet && !props.reducedMotion) await this.wait(beamTravelDelay(jet.cell, jet.direction, hit.cell, speed));
            const p = this.center(hit.cell);
            props.audio?.play("seedpod");
            const piece = this.pieces.get(hit.id);
            if (hit.hp === 1 && piece?.kind === "seedpod") {
              const image = piece.graphic.list[0] as Phaser.GameObjects.Image;
              image.setTexture(prepareSmallTexture(this, "seedpodCracked", "seedpodCracked-small", 128)).setDisplaySize(43, 43);
              piece.hp = 1;
            }
            const spark = this.add.circle(p.x, p.y, 18, hit.hp ? 0xffc983 : 0xa9eec4, 0.4).setDepth(18).setStrokeStyle(3, 0xffedb3);
            await this.tween(spark, { scale: 1.6, alpha: 0, duration: props.reducedMotion ? 30 : 170 });
            spark.destroy();
          }));
        }
      };
      const revealSaltAt = async (after: number, jet?: TurnStep["jets"][number]) => {
        for (const [index, event] of (step.crustEvents ?? []).entries()) if (event.after === after && !revealedSalt.has(index)) {
          revealedSalt.add(index);
          await Promise.all(event.hits.map(async hit => {
            if (jet && !props.reducedMotion) {
              await this.wait(beamTravelDelay(jet.cell, jet.direction, hit.cell, speed));
            }
            await this.showCrustHit(hit);
          }));
        }
      };
      const revealHitsAt = async (after: number, jet?: TurnStep["jets"][number]) => { await Promise.all([revealSaltAt(after, jet), revealPodAt(after, jet)]); };
      await revealHitsAt(-1);
      if (!step.sequence?.length) { await this.showJets(step.jets, speed); await this.showPowers(step.effects ?? []); return; }
      for (let index = 0; index < step.sequence.length;) {
        const item = step.sequence[index];
        if (item.kind === "effect") {
          const effect = step.effects![item.index];
          if (effect.converted) {
            const wave: { effect: NonNullable<TurnStep["effects"]>[number]; sequenceIndex: number }[] = [];
            while (index < step.sequence.length && step.sequence[index].kind === "effect" &&
              step.effects![step.sequence[index].index].converted && wave.length < 6) {
              wave.push({ effect: step.effects![step.sequence[index].index], sequenceIndex: index }); index++;
            }
            await Promise.all(wave.map(({ effect, sequenceIndex }, order) => this.wait(order * (props.reducedMotion ? 8 : 24))
              .then(() => this.showPowers([effect], 2.5)).then(() => revealHitsAt(sequenceIndex))));
          } else { await this.showPowers([effect]); await revealHitsAt(index); index++; }
          continue;
        }
        const first = index;
        const wave: TurnStep["jets"] = [];
        while (index < step.sequence.length && step.sequence[index].kind === "jet") {
          wave.push(step.jets[step.sequence[index].index]); index++;
        }
        await this.showJets(wave, speed, (local, jet) => revealHitsAt(first + local, jet));
      }
      for (const [index, event] of (step.crustEvents ?? []).entries()) if (!revealedSalt.has(index)) await revealSaltAt(event.after);
      for (const [index, event] of (step.podEvents ?? []).entries()) if (!revealedPods.has(index)) await revealPodAt(event.after);
    }
    followPowerHint() {
      if (!this.lessonPowerId) return false;
      let found: Cell | undefined;
      for (let row = 0; row < BOARD_SIZE; row++) for (let col = 0; col < BOARD_SIZE; col++) {
        if (this.puzzle.board[row][col]?.id === this.lessonPowerId) found = { row, col };
      }
      if (!found) { if (this.lessonPowerHint) { this.tweens.killTweensOf(this.lessonPowerHint); this.lessonPowerHint.destroy(); } this.lessonPowerHint = undefined; this.lessonPowerId = undefined; return false; }
      const p = this.center(found);
      if (!this.lessonPowerHint) {
        this.lessonPowerHint = this.add.graphics().setDepth(12);
        if (!props.reducedMotion) this.tweens.add({ targets: this.lessonPowerHint, alpha: 0.28, yoyo: true, repeat: -1, duration: 600 });
      }
      this.lessonPowerHint.clear().lineStyle(3, 0xffefb5, 0.95).strokeRoundedRect(p.x - 23, p.y - 23, 46, 46, 8);
      this.setMessage("Power ready! Double-tap the glowing tile, or swap it to fire.");
      return true;
    }
    async animateStep(step: TurnStep) {
      if (!this.sceneAlive) return;
      const short = props.reducedMotion;
      if (step.kind === "convert") {
        const target = step.effects?.[0]?.selected;
        this.setMessage(`${target === "leaf" ? "Reeds" : target === "water" ? "Water" : target === "pennant" ? "Pennants" : "Gears"} become ${step.effects?.[0]?.convertedTo === "jet" ? "Pressure Jets" : "Flywheels"}!`);
        await this.showPowers(step.effects ?? []);
        if (!this.sceneAlive) return;
        await this.syncTiles(step.board, 0, step.kind);
        await this.wait(short ? 60 : 240);
        if (!this.sceneAlive) return;
        this.displayBoard = step.board;
        return;
      }
      if (step.kind === "keeper") {
        props.audio?.play("keeper");
        this.setMessage(props.level.chapter === "farmland" ? "Fieldkeeper's Harvest Rhythm! Two Flywheels are ready." : props.level.chapter === "caravan" ? "Wayfinder's power! Two Flywheels are ready." : props.level.chapter === "gatehouse" ? "Gatewright's power! A Prism is ready." : "Keeper's power! Two Pressure Jets are ready.");
        if (this.keeperPortrait && !short) {
          this.tweens.killTweensOf(this.keeperPortrait);
          this.keeperPortrait.setY(392).setAngle(-8);
          this.tweens.add({ targets: this.keeperPortrait, angle: 8, yoyo: true, repeat: 2, duration: 90,
            onComplete: () => this.keeperPortrait?.setAngle(0) });
        }
        const shots: Promise<void>[] = [];
        for (const cell of step.cells) {
          const orb = this.add.circle(76, 392, 10, 0xa8f5ce).setStrokeStyle(3, 0xffffff);
          const p = this.center(cell);
          shots.push(this.tween(orb, { x: p.x, y: p.y, duration: short ? 90 : 550, ease: "Cubic.easeInOut" }).then(() => orb.destroy()));
        }
        await Promise.all(shots);
        if (!this.sceneAlive) return;
        await this.syncTiles(step.board, 0, step.kind);
        if (!this.sceneAlive) return;
        for (const cell of step.cells) {
          const p = this.center(cell); const halo = this.add.circle(p.x, p.y, 25).setStrokeStyle(4, 0xffef9b);
          void this.tween(halo, { alpha: 0, scale: 1.7, duration: short ? 100 : 420 }).then(() => halo.destroy());
        }
        this.renderHud(step.goals, this.puzzle.moves, step.keeperCharge, true);
        await this.wait(short ? 100 : 620);
        if (!this.sceneAlive) return;
        this.displayBoard = step.board;
        return;
      }
      if (step.kind === "clear") {
        props.audio?.play("clear", this.clearStreak++);
        const cross = step.jets.some((jet, index) => step.jets.slice(index + 1).some(other =>
          jet.cell.row === other.cell.row && jet.cell.col === other.cell.col && jet.direction !== other.direction));
        if (cross) this.setMessage("Jet combo! Row + column blast");
        await this.showSequence(step);
        if (!this.sceneAlive) return;
        await this.syncTiles(step.board, short ? 70 : 180, step.kind);
        if (!this.sceneAlive) return;
        const chargeCells = step.cells.filter(cell => this.displayBoard[cell.row][cell.col]?.kind === this.puzzle.chargeSymbol && !isSpecial(this.displayBoard[cell.row][cell.col])).slice(0, 8);
        await Promise.all(chargeCells.map(async cell => {
          const position = this.center(cell);
          const mote = this.add.circle(position.x, position.y, 5, 0xa9f5cf);
          await this.tween(mote, { x: 225, y: 399, alpha: 0.15, duration: short ? 80 : 320, ease: "Cubic.easeIn" });
          mote.destroy();
        }));
        if (!this.sceneAlive) return;
        this.renderHud(step.goals, this.puzzle.moves, step.keeperCharge);
        this.displayBoard = step.board;
        return;
      }
      if (step.kind === "shuffle") {
        this.setMessage("Refreshing the board…");
        const survivingPowers = new Set(this.displayBoard.flat().filter(tile => isSpecial(tile) || tile?.kind === "seedpod").map(tile => tile!.id));
        const emptyBoard: Board = step.board.map(row => row.map(tile => tile && survivingPowers.has(tile.id) ? tile : null));
        await this.syncTiles(emptyBoard, short ? 70 : 220, "clear");
        if (!this.sceneAlive) return;
        this.displayBoard = emptyBoard;
        await this.wait(short ? 40 : 100);
        if (!this.sceneAlive) return;
        await this.syncTiles(step.board, short ? 80 : 400, "refill");
        if (!this.sceneAlive) return;
        this.displayBoard = step.board;
        return;
      }
      await this.syncTiles(step.board, short ? 80 : step.kind === "swap" ? 180 : 270, step.kind);
      if (!this.sceneAlive) return;
      this.displayBoard = step.board;
    }
    async choose(cell: Cell) {
      if (!this.sceneAlive) return;
      const now = this.time.now;
      const doubleTap = this.lastTap && now - this.lastTap.time <= 400
        && this.lastTap.cell.row === cell.row && this.lastTap.cell.col === cell.col;
      this.lastTap = { cell, time: now };
      const fireHere = Boolean(doubleTap && isSpecial(this.puzzle.board[cell.row][cell.col]));
      if (fireHere) this.selected = cell;
      if (!this.selected) { this.selected = cell; this.highlight(cell); props.audio?.play("select"); return; }
      const from = this.selected; this.selected = null; this.highlight(null);
      if (from.row === cell.row && from.col === cell.col && !fireHere) return;
      this.lastTap = null;
      const turn = playTurn(this.puzzle, from, cell);
      if (!turn.valid) {
        props.audio?.play("invalid");
        const first = this.puzzle.board[from.row][from.col];
        const graphic = first && this.pieces.get(first.id)?.graphic;
        if (graphic) { const x = graphic.x; await this.tween(graphic, { x: x + (cell.col - from.col) * 9, duration: 65, yoyo: true }); }
        if (!this.sceneAlive) return;
        this.setMessage("That swap makes no match. Try another pair.");
        return;
      }
      this.busy = true;
      props.onEvent({ type: "resolvedTurn", puzzle: turn.state, turn, from, to: cell });
      if (this.lessonHint) { this.tweens.killTweensOf(this.lessonHint); this.lessonHint.destroy(); this.lessonHint = undefined; }
      this.clearStreak = 0;
      props.audio?.play("swap");
      if (this.keeperPortrait && !props.reducedMotion) {
        this.tweens.killTweensOf(this.keeperPortrait);
        this.keeperPortrait.setY(392).setAngle(0);
        this.tweens.add({ targets: this.keeperPortrait, y: 386, yoyo: true, duration: 110,
          onComplete: () => this.keeperPortrait?.setY(392) });
      }
      this.setMessage("Watch the swap, clear, and refill…");
      for (const step of turn.steps) await this.animateStep(step);
      if (!this.sceneAlive) return;
      this.puzzle = turn.state;
      const lessonPower = turn.powersCreated.find(created => created.power === props.level.lesson);
      if (lessonPower && !this.lessonPowerId) {
        const creation = turn.steps.find(step => {
          if (step.kind !== "clear") return false;
          const tile = step.board[lessonPower.cell.row][lessonPower.cell.col];
          return lessonPower.power === "jet" ? Boolean(tile?.jet) : tile?.power === lessonPower.power;
        });
        this.lessonPowerId = creation?.board[lessonPower.cell.row][lessonPower.cell.col]?.id;
      }
      this.renderHud();
      props.onEvent({ type: "turn", puzzle: turn.state, cleared: turn.cleared.length, keeper: turn.keeperJets.length > 0 });
      if (turn.state.status === "won") {
        this.revealPlan = planFinale(turn.state);
        this.revealActive = true;
        this.game.canvas.dataset.revealPhase = "banner";
        props.onEvent({ type: "victory", puzzle: turn.state });
        props.onEvent({ type: "revealStarted", puzzle: turn.state });
        await this.showGoalBanner(true);
        if (!this.sceneAlive) return;
        if (!this.revealSkipped) await this.finale();
      }
      else if (turn.state.status === "lost") props.onEvent({ type: "lose", puzzle: turn.state });
      else {
        if (!this.followPowerHint()) this.setMessage(turn.keeperJets.length
          ? this.puzzle.grantedPower === "prism" ? "Swap the Prism with a symbol, or double-tap it." : this.puzzle.grantedPower === "flywheels" ? "Double-tap a Flywheel to spin it, or swap it." : "Double-tap a Jet to fire here, or swap it."
          : turn.state.goals.crust ? "Matches and Prism-cleared tiles crack nearby salt; Jets and Flywheels need a direct hit."
          : "Swap adjacent symbols to collect your goals.");
        this.busy = false;
      }
    }
    skipWinningReveal() {
      if (!this.revealActive || !this.revealPlan || this.finaleDone) return;
      this.revealSkipped = true;
      for (const cancel of [...this.pendingReveal]) cancel();
      this.pendingReveal.clear();
      this.finishFinale();
    }
    finishFinale() {
      if (!this.sceneAlive || this.finaleDone || !this.revealPlan) return;
      this.finaleDone = true;
      this.revealActive = false;
      this.game.canvas.dataset.revealPhase = "complete";
      // A skipped animation and a fully watched one have the same final board.
      void this.syncTiles(this.revealPlan.board, 0, "refill");
      this.displayBoard = this.revealPlan.board;
      this.renderHud(this.puzzle.goals, 0, this.puzzle.keeperCharge, this.puzzle.keeperFired);
      this.setMessage(props.level.victoryTitle);
      props.onEvent({ type: "win", puzzle: this.puzzle });
    }
    async finale() {
      const plan = this.revealPlan;
      if (!plan || this.revealSkipped) return;
      this.game.canvas.dataset.revealPhase = "conversion";
      this.setMessage(this.puzzle.grantedPower === "flywheels" ? "Goals complete! Turning spare moves into Flywheels…" : "Goals complete! Turning spare moves into Pressure Jets…");
      const coinFlights: Promise<void>[] = [];
      const revealed = new Set<number>();
      const revealCoins = (cells: Cell[], before: Board) => {
        for (const cell of cells) {
          const tile = before[cell.row][cell.col];
          if (!tile || revealed.has(tile.id) || this.revealSkipped) continue;
          revealed.add(tile.id);
          const position = this.center(cell);
          const coin = this.add.image(position.x, position.y, prepareSmallTexture(this, "coin", "coin-small", 64)).setDisplaySize(20, 20).setDepth(4);
          coinFlights.push((async () => {
            await this.wait(props.reducedMotion ? 5 : 45);
            if (this.revealSkipped) { coin.destroy(); return; }
            await this.tween(coin, { x: 54, y: 57, alpha: 0.25, duration: props.reducedMotion ? 70 : 230, ease: "Cubic.easeIn" });
            if (!this.revealSkipped) props.audio?.play("coin", cell.col);
            coin.destroy();
          })());
        }
      };
      for (const conversion of plan.conversions) {
        if (this.revealSkipped) return;
        await this.syncTiles(conversion.board, 0, "keeper");
        this.renderHud(this.puzzle.goals, conversion.moves, this.puzzle.keeperCharge, this.puzzle.keeperFired);
        await this.wait(props.reducedMotion ? 10 : Math.max(18, 55 - (this.puzzle.moves - conversion.moves - 1) * 4));
      }
      if (this.revealSkipped) return;
      if (plan.waves.length) this.setMessage("Powers firing! Watch the chain reaction.");
      this.game.canvas.dataset.revealPhase = "chain";
      for (const [index, wave] of plan.waves.entries()) {
        if (this.revealSkipped) return;
        const speed = Math.min(5, 2 + index * 0.6);
        await this.showJets(wave.jets, speed);
        if (this.revealSkipped) return;
        await this.showPowers(wave.effects, speed);
        if (this.revealSkipped) return;
        revealCoins(wave.removed, wave.before);
        await this.syncTiles(wave.after, props.reducedMotion ? 25 : 100 / speed, "clear");
        if (this.revealSkipped) return;
        this.displayBoard = wave.after;
        if (index < plan.waves.length - 1) this.setMessage("Chain reaction! Another power fires.");
      }
      this.setMessage("The canal surges! Watch the final refill…");
      this.game.canvas.dataset.revealPhase = "refill";
      let before: Board = plan.waves.at(-1)?.after ?? plan.conversions.at(-1)?.board ?? this.puzzle.board;
      for (const step of plan.refill.steps) {
        if (this.revealSkipped) return;
        if (step.kind === "clear") {
          props.audio?.play("clear", this.clearStreak++);
          await this.showJets(step.jets, 3.5);
          if (this.revealSkipped) return;
          revealCoins(step.cells, before);
        }
        const duration = props.reducedMotion ? 30 : step.kind === "clear" ? 75 : step.kind === "fall" ? 130 : 155;
        await this.syncTiles(step.board, duration, step.kind);
        if (this.revealSkipped) return;
        before = step.board;
      }
      await Promise.all(coinFlights);
      if (!this.revealSkipped) this.finishFinale();
    }
  };
}

export default function GameCanvas(props: Props) {
  const host = useRef<HTMLDivElement>(null);
  const callback = useRef(props.onEvent);
  callback.current = props.onEvent;
  const reducedMotion = useRef(props.reducedMotion);
  reducedMotion.current = props.reducedMotion;
  const transitioning = useRef(props.transitioning);
  transitioning.current = props.transitioning;
  const onReady = useRef(props.onReady);
  onReady.current = props.onReady;
  const onFailure = useRef(props.onFailure);
  onFailure.current = props.onFailure;
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const release = reserveGame();
    let disposed = false;
    let game: Phaser.Game | null = null;
    let observer: ResizeObserver | null = null;
    let resizeFrame = 0;
    let canvas: HTMLCanvasElement | null = null;
    const contextLost = (event: Event) => {
      event.preventDefault();
      logDiagnostic("webgl-context-lost");
      if (!disposed) onFailure.current("context-lost");
    };
    const contextRestored = () => logDiagnostic("webgl-context-restored");
    const current: Props = { ...props,
      get reducedMotion() { return reducedMotion.current; },
      get transitioning() { return transitioning.current; },
      onReady: () => !disposed && onReady.current(),
      onFailure: reason => { if (!disposed) onFailure.current(reason); },
      onEvent: event => { if (!disposed) callback.current(event); },
    };
    const mobile = window.matchMedia("(pointer: coarse)").matches;
    const dimensions = () => {
      const cssWidth = element.clientWidth || WIDTH;
      const cssHeight = element.clientHeight || HEIGHT;
      const logicalWidth = mobile && cssWidth / cssHeight >= WIDTH / HEIGHT ? HEIGHT * cssWidth / cssHeight : WIDTH;
      const density = Math.min(
        Math.max(1, cssHeight / HEIGHT * window.devicePixelRatio),
        mobile ? 2 : 3,
        mobile ? Math.sqrt(2_000_000 / (logicalWidth * HEIGHT)) : Infinity,
      );
      return { width: Math.floor(logicalWidth * density), height: Math.floor(HEIGHT * density) };
    };
    let size = dimensions();
    const resize = () => {
      resizeFrame = 0;
      if (disposed || !game?.isBooted || !element.clientWidth || !element.clientHeight) return;
      const next = dimensions();
      if (Math.abs(next.width - size.width) < 2 && Math.abs(next.height - size.height) < 2) return;
      size = next;
      const { width, height } = size;
      // FIT keeps its own display aspect ratio. setGameSize updates that ratio
      // along with the backing canvas during a live viewport change.
      game.scale.setGameSize(width, height);
      for (const scene of game.scene.getScenes(true)) layoutScene(scene, width, height);
      logDiagnostic("canvas-resize", { width, height });
    };
    void enqueueGameWork(() => {
      if (disposed) return;
      const { width, height } = size;
      game = new Phaser.Game({
        type: Phaser.AUTO, width, height, parent: element, backgroundColor: "#153c48",
        scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.NO_CENTER, width, height },
        render: { pixelArt: false, antialias: true },
        scene: [props.mode === "map" ? props.region === "farmland" ? makeFarmlandScene(current) : props.region === "gatehouse" ? makeGatehouseScene(current) : props.region === "caravan" ? makeCaravanScene(current) : makeMapScene(current) : makePuzzleScene(current)],
        audio: { disableWebAudio: true },
      });
      logDiagnostic("game-create", { mode: props.mode, width, height, mobile });
      const attachCanvas = () => {
        if (disposed || !game) return;
        canvas = game.canvas;
        canvas?.addEventListener("webglcontextlost", contextLost);
        canvas?.addEventListener("webglcontextrestored", contextRestored);
        if (!resizeFrame) resizeFrame = requestAnimationFrame(resize);
      };
      // Game.boot can run synchronously when the DOM is already ready.
      if (game.isBooted) attachCanvas();
      else game.events.once(Phaser.Core.Events.READY, attachCanvas);
      observer = new ResizeObserver(() => { if (!resizeFrame && !disposed) resizeFrame = requestAnimationFrame(resize); });
      observer.observe(element);
    }).catch(error => {
      logDiagnostic("game-create-error", { message: String(error).slice(0, 160) });
      if (!disposed) onFailure.current("scene-create");
    });
    return () => {
      disposed = true;
      observer?.disconnect();
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      canvas?.removeEventListener("webglcontextlost", contextLost);
      canvas?.removeEventListener("webglcontextrestored", contextRestored);
      void enqueueGameWork(async () => {
        if (!game) return;
        const old = game;
        const oldCanvas = old.canvas;
        const gl = old.renderer.type === Phaser.WEBGL ? (old.renderer as Phaser.Renderer.WebGL.WebGLRenderer).gl : null;
        await new Promise<void>(resolve => {
          old.events.once(Phaser.Core.Events.DESTROY, resolve);
          old.destroy(true, false);
        });
        // Phaser removes its renderer objects but does not explicitly return
        // the old WebGL drawing buffer. Release it before another game boots.
        try {
          if (gl && !gl.isContextLost()) {
            const extension = gl.getExtension("WEBGL_lose_context");
            extension?.loseContext();
            logDiagnostic("webgl-context-released", { extension: Boolean(extension) });
          }
        } catch (error) {
          logDiagnostic("webgl-release-failed", { message: String(error).slice(0, 160) });
        }
        try { oldCanvas.width = 1; oldCanvas.height = 1; }
        catch (error) { logDiagnostic("canvas-release-failed", { message: String(error).slice(0, 160) }); }
        canvas = null;
        game = null;
        logDiagnostic("game-destroy", { mode: props.mode });
      }).finally(release);
    };
    // A scene is recreated by its React key, not by ordinary HUD prop changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.mode]);
  return <div className="game-canvas" ref={host} aria-label={props.mode === "map" ? props.region === "farmland" ? "Walkable farmland" : props.region === "gatehouse" ? "Walkable river gatehouse" : props.region === "caravan" ? "Walkable desert caravan" : "Walkable oasis" : `${props.level.title} puzzle`} />;
}
