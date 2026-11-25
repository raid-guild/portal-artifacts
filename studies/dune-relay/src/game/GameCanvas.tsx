"use client";

import { assetUrl } from "./assetUrl";
import { CompanionPace } from "./companionPace";
import { isPlaytestMode } from "./playtestMode";

import { useEffect, useRef } from "react";
import Phaser from "phaser";
import spriteFrames from "../../public/sprites/frames.json";
import wayfinderFrames from "../../public/sprites/wayfinder-frames.json";
import gatewrightFrames from "../../public/sprites/gatewright-frames.json";
import fieldkeeperFrames from "../../public/sprites/fieldkeeper-frames.json";
import towncrierFrames from "../../public/sprites/towncrier-frames.json";
import quartermasterFrames from "../../public/sprites/quartermaster-frames.json";
import skiffFrames from "../../public/sprites/skiff-frames.json";
import artificerFrames from "../../public/sprites/artificer-frames.json";
import { CascadeFlair, cascadeVisualStrength, showCascadeWord } from "./cascadeFlair";
import { crateExitCells } from "./crateExits";
import type { CompanionId, Region } from "./save";
import { BOARD_SIZE, Board, Cell, legalMove, createPuzzle, playTurn, resolveAction, Puzzle, resolveFinaleRefill, SymbolKind, TurnStep, Power, isSpecial, CrustGrid, GoalKind, Goals, type BoardMask, type CurrentEdge, type CurrentRoute, type CurrentMotion, type PuzzleAction, type Turn } from "./core";
import type {ToolKind} from './inventory';
import type { GameAudio } from "./audio";
import { beamTravelDelay } from "./timing";
import { planFinale, type FinalePlan } from "./finale";
import { reserveGame, enqueueGameWork } from "./gameLifecycle";
import { logDiagnostic } from "./diagnostics";
import { LEVELS, LEVEL_ORDER, MAP_DESTINATIONS, type PlayableLevelDefinition, type LevelId } from "./levels";
import type { BoosterPlacement } from "./boosters";
import type { ReplayDestination } from "./chapterReplay";

const CHAIN_CALLOUTS = ["NICE", "BADICAL", "TUBULAR", "FOR REAL", "GOORANGA", "MOST EPIC"];
let nextChainCallout = 0;

type CurrentVisual = { route: CurrentRoute; water: Phaser.GameObjects.Graphics; frost: Phaser.GameObjects.Graphics; glints: Phaser.GameObjects.Graphics[]; frozen: boolean; flow: number; surgeMs: number };
const currentColors = [
  { water: 0x167b98, rim: 0x82f5e8, arrow: 0xb4fff1 },
  { water: 0x486a9a, rim: 0xbcd6ff, arrow: 0xe3edff },
  { water: 0x247b72, rim: 0xb4f5b5, arrow: 0xd7ffcc },
  { water: 0x775a99, rim: 0xe1bdff, arrow: 0xf3ddff },
];
function edgeVector(edge: CurrentEdge) { return edge === "left" ? { x: -1, y: 0 } : edge === "right" ? { x: 1, y: 0 } : edge === "top" ? { x: 0, y: -1 } : { x: 0, y: 1 }; }

export type GameEvent =
  | { type: "position"; position: { x: number; y: number } }
  | { type: "keeper"; position: { x: number; y: number } }
  | { type: "pump"; position: { x: number; y: number } }
  | { type: "replayDestination"; destination: ReplayDestination["destination"]; position: { x: number; y: number } }
  | { type: "wayfinder"; position: { x: number; y: number } }
  | { type: "gatewright"; position: { x: number; y: number } }
  | { type: "towncrier"; position: { x: number; y: number } }
  | { type: "fieldkeeper"; position: { x: number; y: number } }
  | { type: "artificer"; position: { x: number; y: number } }
  | { type: "skiff"; position: { x: number; y: number } }
  | { type: "quartermaster"; position: { x: number; y: number } }
  | { type: "resolvedTurn"; puzzle: Puzzle; turn: import("./core").Turn; from: Cell; to: Cell; action?:PuzzleAction }
  | { type: "playReady" }
  | { type: "gateOpened" }
  | { type: "turn"; puzzle: Puzzle; cleared: number; keeper: boolean }
  | { type: "revealStarted"; puzzle: Puzzle }
  | { type: "victory"; puzzle: Puzzle }
  | { type: "win"; puzzle: Puzzle }
  | { type: "lose"; puzzle: Puzzle };

type Props = {
  prototype?: "condensation";
  mode: "map" | "puzzle";
  region: Region;
  activeCompanion: CompanionId | null;
  boardCompanion: CompanionId | null;
  mapPosition: { x: number; y: number } | null;
  repaired: boolean;
  caravanComplete: boolean;
  gatehouseComplete: boolean;
  gateOpening: boolean;
  nextLevel: LevelId | null;
  replayDestinations: ReplayDestination[];
  replayMode: boolean;
  keeperMet: boolean;
  companionIntroduced: boolean;
  level: PlayableLevelDefinition;
  puzzle: Puzzle | null;
  startingBoosters: BoosterPlacement[];
  audio: GameAudio | null;
  reducedMotion: boolean;
  transitioning: boolean;
  interactionBlocked: boolean;
  toolMode:ToolKind|null;
  authorizeTool:(action:PuzzleAction,turn:Turn,before:Puzzle)=>Promise<boolean>;
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

function replayMarkers(scene: Phaser.Scene, props: Props) {
  return props.replayDestinations.map(group => {
    const destination = MAP_DESTINATIONS[group.destination];
    const number = LEVEL_ORDER.indexOf(group.levels[0]) % 10 + 1;
    const caption = (props.region === "river" || props.region === "collection") ? `${props.region === "river" ? 7 : 8}.${number}` : group.levels.length > 1 ? `${number}–${number + group.levels.length - 1}` : String(number);
    const marker = scene.add.circle(destination.marker.x,destination.marker.y,19,0x173c46,.96).setStrokeStyle(2,0xffdf9e).setDepth(12).setInteractive({useHandCursor:true});
    const text = label(scene,destination.marker.x,destination.marker.y,caption,15).setOrigin(.5).setDepth(13).setInteractive({useHandCursor:true});
    return {group,destination,marker,text};
  });
}

type SpriteSheet = "artificer" | "mechanic" | "keeper" | "tiles" | "wayfinder" | "gatewright" | "fieldkeeper" | "towncrier" | "quartermaster" | "skiff";
function playerSheet(props: Props): SpriteSheet { return props.activeCompanion ?? "mechanic"; }
function playerScale(props: Props): number {
  const sheet = playerSheet(props);
  const height = sheet === "artificer" ? artificerFrames[0].h : sheet === "wayfinder" ? wayfinderFrames[0].h : sheet === "gatewright" ? gatewrightFrames[0].h : sheet === "fieldkeeper" ? fieldkeeperFrames[0].h : sheet === "towncrier" ? towncrierFrames[0].h : sheet === "keeper" ? spriteFrames.keeper[0].h : spriteFrames.mechanic[0].h;
  return 70 / height;
}
function loadPlayerSheet(scene: Phaser.Scene, props: Props) {
  const sheet=playerSheet(props);
  const localNpc={collection:"artificer",oasis:"keeper",caravan:"wayfinder",gatehouse:"gatewright",farmland:"fieldkeeper",town:"towncrier",castle:"quartermaster",river:"skiff"}[props.region];
  if (sheet===localNpc) return;
  scene.load.image(sheet,assetUrl(`/sprites/${sheet}.png`));
}
const lastPublishedPosition=new WeakMap<Phaser.Scene,{x:number;y:number}>();
function publishPlayerPosition(scene: Phaser.Scene, props: Props, position: {x:number;y:number}) {
  const previous=lastPublishedPosition.get(scene);
  if (previous && Math.abs(previous.x-position.x)<1 && Math.abs(previous.y-position.y)<1) return;
  lastPublishedPosition.set(scene,{...position});
  props.onEvent({type:"position",position:{...position}});
  if (isPlaytestMode(window.location.search)) {
    scene.game.canvas.dataset.playerCompanion=props.activeCompanion??"mechanic";
    scene.game.canvas.dataset.playerX=String(Math.round(position.x));
    scene.game.canvas.dataset.playerY=String(Math.round(position.y));
  }
}

function registerFrames(scene: Phaser.Scene, sheet: SpriteSheet) {
  const texture = scene.textures.get(sheet);
  const frames = sheet === "artificer" ? artificerFrames : sheet === "wayfinder" ? wayfinderFrames : sheet === "gatewright" ? gatewrightFrames : sheet === "fieldkeeper" ? fieldkeeperFrames : sheet === "towncrier" ? towncrierFrames : sheet === "quartermaster" ? quartermasterFrames : sheet === "skiff" ? skiffFrames : spriteFrames[sheet];
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

function drawPiece(scene: Phaser.Scene, x: number, y: number, kind: SymbolKind | "seedpod" | "crate", jet?: "row" | "column", pulseEnabled = true, power?: Power, hp?: number) {
  if (kind === "crate") return scene.add.container(x, y, [scene.add.image(0, 0, prepareSmallTexture(scene, "deliveryCrate", "deliveryCrate-small", 128)).setDisplaySize(44, 44)]);
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

function paintCollectorTank(tank: Phaser.GameObjects.Graphics, covered: number, total = 25) {
  tank.clear();
  tank.fillStyle(0x2e606d).fillRoundedRect(-18, -17, 36, 34, 7);
  tank.fillStyle(0x8edbe4, 0.92).fillRoundedRect(-14, 13 - 26 * covered / total, 28, 26 * covered / total, 4);
  tank.lineStyle(3, 0xd7e8dd).strokeRoundedRect(-18, -17, 36, 34, 7);
  tank.lineStyle(2, 0xffffff, 0.8).lineBetween(-10, -8, 10, -8);
}

function drawGoalIcon(scene: Phaser.Scene, x: number, y: number, kind: GoalKind, collectorCoverage?: { covered: number; total: number }) {
  if (kind === "condensation") {
    const tank = scene.add.graphics().setPosition(x, y);
    paintCollectorTank(tank, collectorCoverage?.covered ?? 3, collectorCoverage?.total ?? 25);
    return tank;
  }
  if (kind === "crate") return drawPiece(scene, x, y, "crate", undefined, false);
  if (kind === "seedpod") return drawPiece(scene, x, y, "seedpod", undefined, false, undefined, 2);
  if (kind === "crust") return scene.add.image(x, y, prepareSmallTexture(scene, "saltCrust", "saltCrust-small", 128)).setDisplaySize(43, 43);
  return drawPiece(scene, x, y, kind);
}

function goalName(kind: GoalKind, amount = 2): string { return kind === "condensation" ? "NETS" : kind === "leaf" ? "REEDS" : kind === "pennant" ? "PENNANTS" : kind === "key" ? "KEYS" : kind === "crust" ? "SALT" : kind === "seedpod" ? "PODS" : kind === "crate" ? amount === 1 ? "DELIVERY" : "DELIVERIES" : kind.toUpperCase(); }
function remainingGoalLabel(kind: GoalKind, goals: Goals, total = 25): string {
  const remaining=Math.max(0,goals[kind] ?? 0);
  if (kind === "condensation") return `${total - remaining} / ${total} WET`;
  return remaining === 0 ? `✓  ${goalName(kind)}` : `${remaining}  ${goalName(kind)}`;
}

function characterPosition(sprite: Phaser.GameObjects.Sprite, sheet: SpriteSheet, x: number, y: number) {
  const index = Number(sprite.frame.name);
  const cell = sheet === "artificer" ? artificerFrames[Number.isFinite(index) ? index : 0] : sheet === "wayfinder" ? wayfinderFrames[Number.isFinite(index) ? index : 0] : sheet === "gatewright" ? gatewrightFrames[Number.isFinite(index) ? index : 0] : sheet === "fieldkeeper" ? fieldkeeperFrames[Number.isFinite(index) ? index : 0] : sheet === "towncrier" ? towncrierFrames[Number.isFinite(index) ? index : 0] : sheet === "quartermaster" ? quartermasterFrames[Number.isFinite(index) ? index : 0] : sheet === "skiff" ? skiffFrames[Number.isFinite(index) ? index : 0] : spriteFrames[sheet as keyof typeof spriteFrames][Number.isFinite(index) ? index : 0];
  const [left, , right, bottom] = cell.bounds;
  const scale = sprite.scaleX;
  sprite.setPosition(x - ((left + right) / 2 - cell.w / 2) * scale, y + (cell.h - bottom) * scale);
}

function characterAnimation(scene: Phaser.Scene, sheet: SpriteSheet, direction: "left" | "right") {
  const key = `${sheet}-${direction}-walk`;
  if (!scene.anims.exists(key)) scene.anims.create({ key, frames: (direction === "right" ? [1, 2, 3] : [5, 6, 7]).map(frame => ({ key: sheet, frame: String(frame) })), frameRate: 7, repeat: -1 });
  return key;
}

type CompanionSheet = "artificer" | "keeper" | "wayfinder" | "gatewright" | "fieldkeeper" | "towncrier" | "quartermaster" | "skiff";
const GLOW_OFFSETS: [number, number][] = [[-1.5, 0], [1.5, 0], [0, -1.5], [0, 1.5]];

function poseCompanion(scene: Phaser.Scene, sheet: CompanionSheet, sprite: Phaser.GameObjects.Sprite, glows: Phaser.GameObjects.Sprite[], pace: CompanionPace, y: number, delta: number, playerX: number, playerMoving: boolean, blocked: boolean, reducedMotion: boolean) {
  const state = pace.update(delta, playerX, playerMoving, blocked, reducedMotion);
  const frame = state.direction === "left" ? "4" : "0";
  if (state.walking) {
    const animation = characterAnimation(scene, sheet, state.direction);
    if (sprite.anims.currentAnim?.key !== animation || !sprite.anims.isPlaying) sprite.play(animation);
  } else { sprite.stop(); sprite.setFrame(frame); }
  const lift = reducedMotion || state.walking ? 0 : Math.sin(scene.time.now / 470);
  characterPosition(sprite, sheet, state.x, y + lift);
  for (const [index, glow] of glows.entries()) {
    glow.setFrame(sprite.frame.name);
    const [dx, dy] = GLOW_OFFSETS[index];
    characterPosition(glow, sheet, state.x + dx, y + dy + lift);
  }
  if (isPlaytestMode(window.location.search)) {
    const value = String(Math.round(state.x));
    if (scene.game.canvas.dataset.companionX !== value) scene.game.canvas.dataset.companionX = value;
  }
  return state.x;
}

function makeMapScene(props: Props): typeof Phaser.Scene {
  return class MapScene extends Phaser.Scene {
    player = props.mapPosition ?? (props.nextLevel === "pumpHouse" && props.keeperMet ? { x: 409, y: 418 } : { x: 178, y: 414 });
    target = { ...this.player };
    marker?: Phaser.GameObjects.Arc;
    playerGraphic?: Phaser.GameObjects.Sprite;
    keeperGraphic?: Phaser.GameObjects.Sprite;
    keeperShadow?: Phaser.GameObjects.Ellipse;
    companionPace = new CompanionPace(447);
    companionHit?: Phaser.GameObjects.Zone;
    companionCaption?: Phaser.GameObjects.Text;
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
      loadPlayerSheet(this, props);
      this.load.image("keeper", assetUrl("/sprites/keeper.png"));
    }
    create() {
      registerFrames(this, playerSheet(props));
      registerFrames(this, "keeper");
      characterAnimation(this, playerSheet(props), "left");
      characterAnimation(this, playerSheet(props), "right");
      characterAnimation(this, "keeper", "left");
      characterAnimation(this, "keeper", "right");
      this.add.image(480, 270, "oasis").setDisplaySize(WIDTH, HEIGHT);
      const hudParts: Phaser.GameObjects.GameObject[] = [
        panel(this, 22, 83, 303, 66, 0.92),
        label(this, 40, 94, "DUNE RELAY", 28),
        label(this, 40, 124, props.nextLevel && props.nextLevel !== "pumpHouse" ? "THE NEXT STATION AWAITS" : props.repaired ? "THE WATER RUNS AGAIN" : "THE OASIS NEEDS WATER", 13, "#9de4d4"),
      ];
      this.keeperShadow = this.add.ellipse(447, 409, 42, 11, 0x132c31, 0.3);
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
      this.companionHit = keeperHit;
      keeperHit.setInteractive({ useHandCursor: true });
      this.keeperGraphic = keeper;
      this.companionCaption = this.add.text(447, 316, props.companionIntroduced ? "TALK TO KEEPER" : "KEEPER", { fontFamily: "Arial", fontSize: "14px", color: "#fff0ce", fontStyle: "bold", stroke: "#173440", strokeThickness: 3 }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      if (props.activeCompanion === "keeper") { keeper.setVisible(false); this.keeperGlow.forEach(glow=>glow.setVisible(false)); keeperHit.disableInteractive(); this.companionCaption?.setVisible(false).disableInteractive(); }
      this.playerGraphic = this.add.sprite(this.player.x, this.player.y, playerSheet(props), "0").setOrigin(0.5, 1).setScale(playerScale(props));
      characterPosition(this.playerGraphic, playerSheet(props), this.player.x, this.player.y);
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
      const replayPoints = replayMarkers(this,props);
      this.input.on("pointerdown", (pointer: Phaser.Input.Pointer, hit: Phaser.GameObjects.GameObject[]) => {
        if (props.transitioning || props.interactionBlocked) return;
        if (this.locked) return;
        props.audio?.unlock();
        const replay = replayPoints.find(point => hit.includes(point.marker) || hit.includes(point.text));
        if (replay) {
          this.locked=true; this.target={...replay.destination.walk};
          this.tweens.add({targets:this.player,x:this.target.x,y:this.target.y,duration:props.reducedMotion?1:Math.hypot(this.player.x-this.target.x,this.player.y-this.target.y)*4.4,onComplete:()=>props.onEvent({type:"replayDestination",destination:replay.group.destination,position:{...this.player}})});
          return;
        }
        const { x, y } = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
        if (pumpReady && (hit.includes(this.marker!) || hit.includes(this.pumpPrompt!))) {
          this.target = { ...destination.walk }; this.locked = true;
          this.walkThen(() => props.onEvent({ type: "pump", position: { ...this.player } })); return;
        }
        if (hit.includes(keeperHit) || hit.includes(this.companionCaption!) || (Math.abs(x - this.companionPace.x) < 30 && y >= 310 && y <= 425)) { this.target = { x: 409, y: 418 }; this.locked = true; this.walkThen(() => props.onEvent({ type: "keeper", position: { ...this.player } })); return; }
        if (pumpReady && (hit.includes(pump) || (Math.abs(x - destination.marker.x) < 40 && Math.abs(y - destination.marker.y) < 44))) {
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
      if (!this.locked && !props.transitioning && !props.interactionBlocked) {
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
      const animation = characterAnimation(this, playerSheet(props), this.facing);
      if (moving) {
        if (this.playerGraphic.anims.currentAnim?.key !== animation || !this.playerGraphic.anims.isPlaying) this.playerGraphic.play(animation);
      } else {
        this.playerGraphic.stop();
        this.playerGraphic.setFrame(this.facing === "right" ? "0" : "4");
      }
      characterPosition(this.playerGraphic, playerSheet(props), this.player.x, this.player.y);
      if (this.keeperGraphic) {
        const x = poseCompanion(this, "keeper", this.keeperGraphic, this.keeperGlow, this.companionPace, 408, delta, this.player.x, moving, this.locked || props.transitioning || props.interactionBlocked || document.hidden, props.reducedMotion);
        this.companionHit?.setX(x);
        this.companionCaption?.setX(x);
        this.keeperShadow?.setX(x);
      }
      publishPlayerPosition(this,props,this.player);
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
    companionPace = new CompanionPace(677);
    companionHit?: Phaser.GameObjects.Zone;
    companionCaption?: Phaser.GameObjects.Text;
    wayfinderGlow: Phaser.GameObjects.Sprite[] = [];
    keys?: Record<string, Phaser.Input.Keyboard.Key>;
    facing: "left" | "right" = "right";
    locked = false;
    constructor() { super("Caravan"); }
    preload() {
      this.load.on("loaderror", () => props.onFailure("asset-load"));
      this.load.image("caravan", assetUrl("/caravan.webp"));
      loadPlayerSheet(this, props);
      this.load.image("wayfinder", assetUrl("/sprites/wayfinder.png"));
      this.load.image("routeBeacon", assetUrl("/sprites/route-beacon.png"));
    }
    create() {
      registerFrames(this, playerSheet(props));
      registerFrames(this, "wayfinder");
      for (const direction of ["left", "right"] as const) {
        characterAnimation(this, playerSheet(props), direction);
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
      const actionAvailable = props.nextLevel === "caravanPennants" && !props.companionIntroduced;
      const routeLevel = props.nextLevel && LEVELS[props.nextLevel].chapter === "caravan" && !actionAvailable ? LEVELS[props.nextLevel] : null;
      const destination = routeLevel ? MAP_DESTINATIONS[routeLevel.destination] : null;
      const hit = this.add.zone(677, 388, 82, 125);
      this.companionHit = hit;
      hit.setInteractive({ useHandCursor: true });
      const caption = label(this, 677, 337, props.companionIntroduced ? "TALK TO WAYFINDER" : "WAYFINDER", 15).setOrigin(0.5);
      this.companionCaption = caption;
      caption.setInteractive({ useHandCursor: true });
      let routeHit: Phaser.GameObjects.Zone | undefined;
      let routeCaption: Phaser.GameObjects.Text | undefined;
      if (destination && routeLevel) {
        const halo = this.add.circle(destination.marker.x, destination.marker.y, 15, 0xffdd8d, 0.48).setStrokeStyle(3, 0xfff0b8).setDepth(3);
        if (!props.reducedMotion) this.tweens.add({ targets: halo, alpha: 0.13, scale: 1.6, duration: 750, yoyo: true, repeat: -1 });
        routeHit = this.add.zone(destination.hit.x, destination.hit.y, destination.hit.width, destination.hit.height).setInteractive({ useHandCursor: true });
        routeCaption = label(this, destination.label.x, destination.label.y, routeLevel.title, 14).setOrigin(0.5).setDepth(4).setInteractive({ useHandCursor: true });
      }
      if (props.activeCompanion === "wayfinder") { person.setVisible(false); this.wayfinderGlow.forEach(glow=>glow.setVisible(false)); hit.disableInteractive(); caption?.setVisible(false).disableInteractive(); }
      this.playerGraphic = this.add.sprite(this.player.x, this.player.y, playerSheet(props), "0").setOrigin(0.5, 1).setScale(playerScale(props));
      characterPosition(this.playerGraphic, playerSheet(props), this.player.x, this.player.y);
      const replayPoints = replayMarkers(this,props);
      this.input.on("pointerdown", (pointer: Phaser.Input.Pointer, targets: Phaser.GameObjects.GameObject[]) => {
        if (props.transitioning || props.interactionBlocked || this.locked) return;
        props.audio?.unlock();
        const replay = replayPoints.find(point => targets.includes(point.marker) || targets.includes(point.text));
        if (replay) {
          this.locked=true; this.target={...replay.destination.walk};
          this.tweens.add({targets:this.player,x:this.target.x,y:this.target.y,duration:props.reducedMotion?1:Math.hypot(this.player.x-this.target.x,this.player.y-this.target.y)*4.4,onComplete:()=>props.onEvent({type:"replayDestination",destination:replay.group.destination,position:{...this.player}})});
          return;
        }
        const { x, y } = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
        if (destination && (targets.includes(routeCaption!) || targets.includes(routeHit!) && !targets.includes(caption))) {
          this.locked = true; this.target = { ...destination.walk }; this.tweens.add({ targets: this.player, x: this.target.x, y: this.target.y, duration: props.reducedMotion ? 1 : Math.hypot(this.player.x - this.target.x, this.player.y - this.target.y) * 4.4, onComplete: () => props.onEvent({ type: "pump", position: { ...this.player } }) }); return;
        }
        if (targets.includes(hit) || targets.includes(caption) || (Math.abs(x - this.companionPace.x) < 41 && y >= 330 && y <= 447)) {
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
      if (!this.locked && !props.transitioning && !props.interactionBlocked) {
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
      const animation = characterAnimation(this, playerSheet(props), this.facing);
      if (moving) {
        if (this.playerGraphic.anims.currentAnim?.key !== animation || !this.playerGraphic.anims.isPlaying) this.playerGraphic.play(animation);
      } else { this.playerGraphic.stop(); this.playerGraphic.setFrame(this.facing === "right" ? "0" : "4"); }
      characterPosition(this.playerGraphic, playerSheet(props), this.player.x, this.player.y);
      if (this.wayfinderGraphic) {
        const x = poseCompanion(this, "wayfinder", this.wayfinderGraphic, this.wayfinderGlow, this.companionPace, 433, delta, this.player.x, moving, this.locked || props.transitioning || props.interactionBlocked || document.hidden, props.reducedMotion);
        this.companionHit?.setX(x);
        this.companionCaption?.setX(x);
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
    companionPace = new CompanionPace(520);
    companionHit?: Phaser.GameObjects.Zone;
    companionCaption?: Phaser.GameObjects.Text;
    glows: Phaser.GameObjects.Sprite[] = [];
    keys?: Record<string, Phaser.Input.Keyboard.Key>;
    facing: "left" | "right" = "right";
    locked = false;
    constructor() { super("Gatehouse"); }
    preload() {
      this.load.on("loaderror", () => props.onFailure("asset-load"));
      this.load.image("gatehouse", assetUrl("/gatehouse.webp"));
      loadPlayerSheet(this, props);
      this.load.image("gatewright", assetUrl("/sprites/gatewright.png"));
      this.load.image("bridgeGate", assetUrl("/sprites/bridge-gate.png"));
    }
    create() {
      registerFrames(this, playerSheet(props)); registerFrames(this, "gatewright");
      for (const direction of ["left", "right"] as const) { characterAnimation(this, playerSheet(props), direction); characterAnimation(this, "gatewright", direction); }
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
      const arriving = props.nextLevel === "gatehouseApproach" && !props.companionIntroduced;
      const route = props.nextLevel && LEVELS[props.nextLevel].chapter === "gatehouse" && !arriving ? LEVELS[props.nextLevel] : null;
      const destination = route ? MAP_DESTINATIONS[route.destination] : null;
      const talkHit = this.add.zone(520, 407, 84, 104);
      this.companionHit = talkHit;
      talkHit.setInteractive({ useHandCursor: true });
      const talkCaption = label(this, 520, 355, props.companionIntroduced ? "TALK TO GATEWRIGHT" : "GATEWRIGHT", 15).setOrigin(.5);
      this.companionCaption = talkCaption;
      talkCaption.setInteractive({ useHandCursor: true });
      let routeHit: Phaser.GameObjects.Zone | undefined; let routeCaption: Phaser.GameObjects.Text | undefined;
      if (destination && route) {
        const halo = this.add.circle(destination.marker.x, destination.marker.y, 15, 0xffdd8d, .48).setStrokeStyle(3, 0xfff0b8).setDepth(3);
        if (!props.reducedMotion) this.tweens.add({ targets: halo, alpha: .13, scale: 1.6, duration: 750, yoyo: true, repeat: -1 });
        routeHit = this.add.zone(destination.hit.x, destination.hit.y, destination.hit.width, destination.hit.height).setInteractive({ useHandCursor: true });
        routeCaption = label(this, destination.label.x, destination.label.y, route.title, 14).setOrigin(.5).setDepth(4).setInteractive({ useHandCursor: true });
      }
      if (props.activeCompanion === "gatewright") { person.setVisible(false); this.glows.forEach(glow=>glow.setVisible(false)); talkHit.disableInteractive(); talkCaption?.setVisible(false).disableInteractive(); }
      this.playerGraphic = this.add.sprite(this.player.x, this.player.y, playerSheet(props), "0").setOrigin(.5, 1).setScale(playerScale(props));
      characterPosition(this.playerGraphic, playerSheet(props), this.player.x, this.player.y);
      const replayPoints = replayMarkers(this,props);
      this.input.on("pointerdown", (pointer: Phaser.Input.Pointer, targets: Phaser.GameObjects.GameObject[]) => {
        if (props.transitioning || props.interactionBlocked || this.locked) return;
        props.audio?.unlock();
        const replay = replayPoints.find(point => targets.includes(point.marker) || targets.includes(point.text));
        if (replay) {
          this.locked=true; this.target={...replay.destination.walk};
          this.tweens.add({targets:this.player,x:this.target.x,y:this.target.y,duration:props.reducedMotion?1:Math.hypot(this.player.x-this.target.x,this.player.y-this.target.y)*4.4,onComplete:()=>props.onEvent({type:"replayDestination",destination:replay.group.destination,position:{...this.player}})});
          return;
        }
        const {x,y} = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
        if (destination && (targets.includes(routeCaption!) || targets.includes(routeHit!) && !targets.includes(talkCaption))) {
          this.locked = true; this.target = {...destination.walk}; this.tweens.add({targets:this.player,x:this.target.x,y:this.target.y,duration:props.reducedMotion?1:Math.hypot(this.player.x-this.target.x,this.player.y-this.target.y)*4.4,onComplete:()=>props.onEvent({type:"pump",position:{...this.player}})}); return;
        }
        if (targets.includes(talkHit) || targets.includes(talkCaption) || Math.abs(x-this.companionPace.x)<42 && y>=350 && y<=458) {
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
      if (!this.locked && !props.transitioning && !props.interactionBlocked) {
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
      const animation=characterAnimation(this,playerSheet(props),this.facing);
      if(moving){if(this.playerGraphic.anims.currentAnim?.key!==animation||!this.playerGraphic.anims.isPlaying)this.playerGraphic.play(animation);}else{this.playerGraphic.stop();this.playerGraphic.setFrame(this.facing==="right"?"0":"4");}
      characterPosition(this.playerGraphic,playerSheet(props),this.player.x,this.player.y);
      if (this.gatewrightGraphic) {
        const x = poseCompanion(this, "gatewright", this.gatewrightGraphic, this.glows, this.companionPace, 452, delta, this.player.x, moving, this.locked || props.transitioning || props.interactionBlocked || document.hidden, props.reducedMotion);
        this.companionHit?.setX(x);
        this.companionCaption?.setX(x);
      }
      publishPlayerPosition(this,props,this.player);
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
    companionPace = new CompanionPace(540);
    companionHit?: Phaser.GameObjects.Zone;
    companionCaption?: Phaser.GameObjects.Text;
    glows: Phaser.GameObjects.Sprite[] = [];
    keys?: Record<string, Phaser.Input.Keyboard.Key>;
    facing: "left" | "right" = "right";
    locked = false;
    constructor() { super("Farmland"); }
    preload() {
      this.load.on("loaderror", () => props.onFailure("asset-load"));
      this.load.image("farmland", assetUrl("/farmland.webp"));
      loadPlayerSheet(this, props);
      this.load.image("fieldkeeper", assetUrl("/sprites/fieldkeeper.png"));
    }
    create() {
      registerFrames(this, playerSheet(props)); registerFrames(this, "fieldkeeper");
      for (const direction of ["left", "right"] as const) { characterAnimation(this, playerSheet(props), direction); characterAnimation(this, "fieldkeeper", direction); }
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
      const arriving = props.nextLevel === "seedStore" && !props.companionIntroduced;
      const route = props.nextLevel && LEVELS[props.nextLevel].chapter === "farmland" && !arriving ? LEVELS[props.nextLevel] : null;
      const destination = route ? MAP_DESTINATIONS[route.destination] : null;
      const talkHit = this.add.zone(540, 389, 100, 115);
      this.companionHit = talkHit;
      talkHit.setInteractive({ useHandCursor: true });
      const talkCaption = label(this, 540, 329, props.companionIntroduced ? "TALK TO FIELDKEEPER" : "FIELDKEEPER", 15).setOrigin(.5);
      this.companionCaption = talkCaption;
      talkCaption.setInteractive({ useHandCursor: true });
      let routeHit: Phaser.GameObjects.Zone | undefined; let routeCaption: Phaser.GameObjects.Text | undefined;
      if (destination && route) {
        const halo = this.add.circle(destination.marker.x, destination.marker.y, 15, 0xffdd8d, .48).setStrokeStyle(3, 0xfff0b8).setDepth(3);
        if (!props.reducedMotion) this.tweens.add({ targets: halo, alpha: .13, scale: 1.6, duration: 750, yoyo: true, repeat: -1 });
        routeHit = this.add.zone(destination.hit.x, destination.hit.y, destination.hit.width, destination.hit.height).setInteractive({ useHandCursor: true });
        routeCaption = label(this, destination.label.x, destination.label.y, route.title, 14).setOrigin(.5).setDepth(4).setInteractive({ useHandCursor: true });
      }
      if (props.activeCompanion === "fieldkeeper") { person.setVisible(false); this.glows.forEach(glow=>glow.setVisible(false)); talkHit.disableInteractive(); talkCaption?.setVisible(false).disableInteractive(); }
      this.playerGraphic = this.add.sprite(this.player.x, this.player.y, playerSheet(props), "0").setOrigin(.5, 1).setScale(playerScale(props));
      characterPosition(this.playerGraphic, playerSheet(props), this.player.x, this.player.y);
      const replayPoints = replayMarkers(this,props);
      this.input.on("pointerdown", (pointer: Phaser.Input.Pointer, targets: Phaser.GameObjects.GameObject[]) => {
        if (props.transitioning || props.interactionBlocked || this.locked) return;
        props.audio?.unlock();
        const replay = replayPoints.find(point => targets.includes(point.marker) || targets.includes(point.text));
        if (replay) {
          this.locked=true; this.target={...replay.destination.walk};
          this.tweens.add({targets:this.player,x:this.target.x,y:this.target.y,duration:props.reducedMotion?1:Math.hypot(this.player.x-this.target.x,this.player.y-this.target.y)*4.4,onComplete:()=>props.onEvent({type:"replayDestination",destination:replay.group.destination,position:{...this.player}})});
          return;
        }
        const {x,y} = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
        if (destination && (targets.includes(routeCaption!) || targets.includes(routeHit!) && !targets.includes(talkCaption))) {
          this.locked = true; this.target = {...destination.walk}; this.tweens.add({targets:this.player,x:this.target.x,y:this.target.y,duration:props.reducedMotion?1:Math.hypot(this.player.x-this.target.x,this.player.y-this.target.y)*4.4,onComplete:()=>props.onEvent({type:"pump",position:{...this.player}})}); return;
        }
        if (targets.includes(talkHit) || targets.includes(talkCaption) || Math.abs(x-this.companionPace.x)<42 && y>=329 && y<=445) {
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
      if (!this.locked && !props.transitioning && !props.interactionBlocked) {
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
      const animation=characterAnimation(this,playerSheet(props),this.facing);
      if(moving){if(this.playerGraphic.anims.currentAnim?.key!==animation||!this.playerGraphic.anims.isPlaying)this.playerGraphic.play(animation);}else{this.playerGraphic.stop();this.playerGraphic.setFrame(this.facing==="right"?"0":"4");}
      characterPosition(this.playerGraphic,playerSheet(props),this.player.x,this.player.y);
      if (this.fieldkeeperGraphic) {
        const x = poseCompanion(this, "fieldkeeper", this.fieldkeeperGraphic, this.glows, this.companionPace, 430, delta, this.player.x, moving, this.locked || props.transitioning || props.interactionBlocked || document.hidden, props.reducedMotion);
        this.companionHit?.setX(x);
        this.companionCaption?.setX(x);
      }
      publishPlayerPosition(this,props,this.player);
      this.previous={...this.player};
    }
  };
}

function makeTownScene(props: Props): typeof Phaser.Scene {
  return class TownScene extends Phaser.Scene {
    player = props.mapPosition ?? { x: 190, y: 464 };
    target = { ...this.player };
    previous = { ...this.player };
    playerGraphic?: Phaser.GameObjects.Sprite;
    towncrierGraphic?: Phaser.GameObjects.Sprite;
    companionPace = new CompanionPace(540);
    companionHit?: Phaser.GameObjects.Zone;
    companionCaption?: Phaser.GameObjects.Text;
    glows: Phaser.GameObjects.Sprite[] = [];
    keys?: Record<string, Phaser.Input.Keyboard.Key>;
    facing: "left" | "right" = "right";
    locked = false;
    constructor() { super("Town"); }
    preload() {
      this.load.on("loaderror", () => props.onFailure("asset-load"));
      this.load.image("town", assetUrl("/town.webp"));
      loadPlayerSheet(this, props);
      this.load.image("towncrier", assetUrl("/sprites/towncrier.png"));
    }
    create() {
      registerFrames(this, playerSheet(props)); registerFrames(this, "towncrier");
      for (const direction of ["left", "right"] as const) { characterAnimation(this, playerSheet(props), direction); characterAnimation(this, "towncrier", direction); }
      this.add.image(480, 270, "town").setDisplaySize(WIDTH, HEIGHT);
      const hudParts: Phaser.GameObjects.GameObject[] = [
        panel(this, 22, 91, 302, 66, .92),
        label(this, 40, 100, "TOWN ON THE HILL", 26),
        label(this, 40, 132, "THE EVENING MARKET", 13, "#9de4d4"),
      ];
      const person = this.add.sprite(540, 430, "towncrier", "4").setOrigin(.5, 1).setScale(86 / 256).setDepth(2);
      characterPosition(person, "towncrier", 540, 430); this.towncrierGraphic = person;
      for (const [dx,dy] of [[-1.5,0],[1.5,0],[0,-1.5],[0,1.5]]) {
        const glow = this.add.sprite(540, 430, "towncrier", "4").setOrigin(.5, 1).setScale(86 / 256).setTintFill(0xffe4af).setAlpha(.68).setDepth(1);
        characterPosition(glow, "towncrier", 540+dx, 430+dy); this.glows.push(glow);
      }
      if (!props.reducedMotion) this.tweens.add({ targets: this.glows, alpha: .12, duration: 850, yoyo: true, repeat: -1 });
      const arriving = props.nextLevel === "marketArrival" && !props.companionIntroduced;
      const route = props.nextLevel && LEVELS[props.nextLevel].chapter === "town" && !arriving ? LEVELS[props.nextLevel] : null;
      const destination = route ? MAP_DESTINATIONS[route.destination] : null;
      const talkHit = this.add.zone(540, 389, 100, 115);
      this.companionHit = talkHit;
      talkHit.setInteractive({ useHandCursor: true });
      const talkCaption = label(this, 540, 329, props.companionIntroduced ? "TALK TO TOWN CRIER" : "TOWN CRIER", 15).setOrigin(.5);
      this.companionCaption = talkCaption;
      talkCaption.setInteractive({ useHandCursor: true });
      let routeHit: Phaser.GameObjects.Zone | undefined; let routeCaption: Phaser.GameObjects.Text | undefined;
      if (destination && route) {
        const halo = this.add.circle(destination.marker.x, destination.marker.y, 15, 0xffdd8d, .48).setStrokeStyle(3, 0xfff0b8).setDepth(3);
        if (!props.reducedMotion) this.tweens.add({ targets: halo, alpha: .13, scale: 1.6, duration: 750, yoyo: true, repeat: -1 });
        routeHit = this.add.zone(destination.hit.x, destination.hit.y, destination.hit.width, destination.hit.height).setInteractive({ useHandCursor: true });
        routeCaption = label(this, destination.label.x, destination.label.y, route.title, 14).setOrigin(.5).setDepth(4).setInteractive({ useHandCursor: true });
      }
      if (props.activeCompanion === "towncrier") { person.setVisible(false); this.glows.forEach(glow=>glow.setVisible(false)); talkHit.disableInteractive(); talkCaption?.setVisible(false).disableInteractive(); }
      this.playerGraphic = this.add.sprite(this.player.x, this.player.y, playerSheet(props), "0").setOrigin(.5, 1).setScale(playerScale(props));
      characterPosition(this.playerGraphic, playerSheet(props), this.player.x, this.player.y);
      const replayPoints = replayMarkers(this,props);
      this.input.on("pointerdown", (pointer: Phaser.Input.Pointer, targets: Phaser.GameObjects.GameObject[]) => {
        if (props.transitioning || props.interactionBlocked || this.locked) return;
        props.audio?.unlock();
        const replay = replayPoints.find(point => targets.includes(point.marker) || targets.includes(point.text));
        if (replay) {
          this.locked=true; this.target={...replay.destination.walk};
          this.tweens.add({targets:this.player,x:this.target.x,y:this.target.y,duration:props.reducedMotion?1:Math.hypot(this.player.x-this.target.x,this.player.y-this.target.y)*4.4,onComplete:()=>props.onEvent({type:"replayDestination",destination:replay.group.destination,position:{...this.player}})});
          return;
        }
        const {x,y} = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
        if (destination && (targets.includes(routeCaption!) || targets.includes(routeHit!) && !targets.includes(talkCaption))) {
          this.locked = true; this.target = {...destination.walk}; this.tweens.add({targets:this.player,x:this.target.x,y:this.target.y,duration:props.reducedMotion?1:Math.hypot(this.player.x-this.target.x,this.player.y-this.target.y)*4.4,onComplete:()=>props.onEvent({type:"pump",position:{...this.player}})}); return;
        }
        if (targets.includes(talkHit) || targets.includes(talkCaption) || Math.abs(x-this.companionPace.x)<42 && y>=329 && y<=445) {
          this.locked = true; this.target = {x:488,y:447}; this.tweens.add({targets:this.player,x:this.target.x,y:this.target.y,duration:props.reducedMotion?1:Math.hypot(this.player.x-this.target.x,this.player.y-this.target.y)*4.4,onComplete:()=>props.onEvent({type:"towncrier",position:{...this.player}})}); return;
        }
        if (destination && (targets.includes(routeHit!) || targets.includes(routeCaption!))) {
          this.locked = true; this.target = {...destination.walk}; this.tweens.add({targets:this.player,x:this.target.x,y:this.target.y,duration:props.reducedMotion?1:Math.hypot(this.player.x-this.target.x,this.player.y-this.target.y)*4.4,onComplete:()=>props.onEvent({type:"pump",position:{...this.player}})}); return;
        }
        this.target = {x:Phaser.Math.Clamp(x,68,882),y:Phaser.Math.Clamp(y,420,491)};
      });
      this.keys = this.input.keyboard?.addKeys("W,A,S,D,UP,DOWN,LEFT,RIGHT") as Record<string, Phaser.Input.Keyboard.Key>;
      hudParts.push(panel(this,26,469,328,46,.84));
      hudParts.push(label(this,44,480,arriving?"Walk to the Town Crier →":route?`Walk to ${route.title} →`:"The market is open ✓",14));
      mapHud(this, hudParts);
      props.onReady();
    }
    update(_:number,delta:number) {
      if (!this.playerGraphic) return;
      if (!this.locked && !props.transitioning && !props.interactionBlocked) {
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
      const animation=characterAnimation(this,playerSheet(props),this.facing);
      if(moving){if(this.playerGraphic.anims.currentAnim?.key!==animation||!this.playerGraphic.anims.isPlaying)this.playerGraphic.play(animation);}else{this.playerGraphic.stop();this.playerGraphic.setFrame(this.facing==="right"?"0":"4");}
      characterPosition(this.playerGraphic,playerSheet(props),this.player.x,this.player.y);
      if (this.towncrierGraphic) {
        const x = poseCompanion(this, "towncrier", this.towncrierGraphic, this.glows, this.companionPace, 430, delta, this.player.x, moving, this.locked || props.transitioning || props.interactionBlocked || document.hidden, props.reducedMotion);
        this.companionHit?.setX(x);
        this.companionCaption?.setX(x);
      }
      publishPlayerPosition(this,props,this.player);
      this.previous={...this.player};
    }
  };
}

function makeCastleScene(props: Props): typeof Phaser.Scene {
  return class CastleScene extends Phaser.Scene {
    player = props.mapPosition ?? { x: 190, y: 464 };
    target = { ...this.player };
    previous = { ...this.player };
    playerGraphic?: Phaser.GameObjects.Sprite;
    quartermasterGraphic?: Phaser.GameObjects.Sprite;
    companionPace = new CompanionPace(540);
    companionHit?: Phaser.GameObjects.Zone;
    companionCaption?: Phaser.GameObjects.Text;
    glows: Phaser.GameObjects.Sprite[] = [];
    keys?: Record<string, Phaser.Input.Keyboard.Key>;
    facing: "left" | "right" = "right";
    locked = false;
    constructor() { super("Castle"); }
    preload() {
      this.load.on("loaderror", () => props.onFailure("asset-load"));
      this.load.image("castle", assetUrl("/castle.webp"));
      loadPlayerSheet(this, props);
      this.load.image("quartermaster", assetUrl("/sprites/quartermaster.png"));
    }
    create() {
      registerFrames(this, playerSheet(props)); registerFrames(this, "quartermaster");
      for (const direction of ["left", "right"] as const) { characterAnimation(this, playerSheet(props), direction); characterAnimation(this, "quartermaster", direction); }
      this.add.image(480, 270, "castle").setDisplaySize(WIDTH, HEIGHT);
      const hudParts: Phaser.GameObjects.GameObject[] = [
        panel(this, 22, 91, 302, 66, .92),
        label(this, 40, 100, "CASTLE ISLAND", 26),
        label(this, 40, 132, "THE DOCK MANIFEST", 13, "#9de4d4"),
      ];
      const person = this.add.sprite(540, 430, "quartermaster", "4").setOrigin(.5, 1).setScale(86 / 256).setDepth(2);
      characterPosition(person, "quartermaster", 540, 430); this.quartermasterGraphic = person;
      for (const [dx,dy] of [[-1.5,0],[1.5,0],[0,-1.5],[0,1.5]]) {
        const glow = this.add.sprite(540, 430, "quartermaster", "4").setOrigin(.5, 1).setScale(86 / 256).setTintFill(0xffe4af).setAlpha(.68).setDepth(1);
        characterPosition(glow, "quartermaster", 540+dx, 430+dy); this.glows.push(glow);
      }
      if (!props.reducedMotion) this.tweens.add({ targets: this.glows, alpha: .12, duration: 850, yoyo: true, repeat: -1 });
      const arriving = props.nextLevel === "castleReceivingDock" && !props.companionIntroduced;
      const route = props.nextLevel && LEVELS[props.nextLevel].chapter === "castle" && !arriving ? LEVELS[props.nextLevel] : null;
      const destination = route ? MAP_DESTINATIONS[route.destination] : null;
      const talkHit = this.add.zone(540, 389, 100, 115);
      this.companionHit = talkHit;
      talkHit.setInteractive({ useHandCursor: true });
      const talkCaption = label(this, 540, 329, props.companionIntroduced ? "TALK TO QUARTERMASTER" : "QUARTERMASTER", 15).setOrigin(.5);
      this.companionCaption = talkCaption;
      talkCaption.setInteractive({ useHandCursor: true });
      let routeHit: Phaser.GameObjects.Zone | undefined; let routeCaption: Phaser.GameObjects.Text | undefined;
      if (destination && route) {
        const halo = this.add.circle(destination.marker.x, destination.marker.y, 15, 0xffdd8d, .48).setStrokeStyle(3, 0xfff0b8).setDepth(3);
        if (!props.reducedMotion) this.tweens.add({ targets: halo, alpha: .13, scale: 1.6, duration: 750, yoyo: true, repeat: -1 });
        routeHit = this.add.zone(destination.hit.x, destination.hit.y, destination.hit.width, destination.hit.height).setInteractive({ useHandCursor: true });
        routeCaption = label(this, destination.label.x, destination.label.y, route.title, 14).setOrigin(.5).setDepth(4).setInteractive({ useHandCursor: true });
      }
      this.playerGraphic = this.add.sprite(this.player.x, this.player.y, playerSheet(props), "0").setOrigin(.5, 1).setScale(playerScale(props));
      characterPosition(this.playerGraphic, playerSheet(props), this.player.x, this.player.y);
      const replayPoints = replayMarkers(this,props);
      this.input.on("pointerdown", (pointer: Phaser.Input.Pointer, targets: Phaser.GameObjects.GameObject[]) => {
        if (props.transitioning || props.interactionBlocked || this.locked) return;
        props.audio?.unlock();
        const replay = replayPoints.find(point => targets.includes(point.marker) || targets.includes(point.text));
        if (replay) {
          this.locked=true; this.target={...replay.destination.walk};
          this.tweens.add({targets:this.player,x:this.target.x,y:this.target.y,duration:props.reducedMotion?1:Math.hypot(this.player.x-this.target.x,this.player.y-this.target.y)*4.4,onComplete:()=>props.onEvent({type:"replayDestination",destination:replay.group.destination,position:{...this.player}})});
          return;
        }
        const {x,y} = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
        if (destination && (targets.includes(routeCaption!) || targets.includes(routeHit!) && !targets.includes(talkCaption))) {
          this.locked = true; this.target = {...destination.walk}; this.tweens.add({targets:this.player,x:this.target.x,y:this.target.y,duration:props.reducedMotion?1:Math.hypot(this.player.x-this.target.x,this.player.y-this.target.y)*4.4,onComplete:()=>props.onEvent({type:"pump",position:{...this.player}})}); return;
        }
        if (targets.includes(talkHit) || targets.includes(talkCaption) || Math.abs(x-this.companionPace.x)<42 && y>=329 && y<=445) {
          this.locked = true; this.target = {x:488,y:447}; this.tweens.add({targets:this.player,x:this.target.x,y:this.target.y,duration:props.reducedMotion?1:Math.hypot(this.player.x-this.target.x,this.player.y-this.target.y)*4.4,onComplete:()=>props.onEvent({type:"quartermaster",position:{...this.player}})}); return;
        }
        if (destination && (targets.includes(routeHit!) || targets.includes(routeCaption!))) {
          this.locked = true; this.target = {...destination.walk}; this.tweens.add({targets:this.player,x:this.target.x,y:this.target.y,duration:props.reducedMotion?1:Math.hypot(this.player.x-this.target.x,this.player.y-this.target.y)*4.4,onComplete:()=>props.onEvent({type:"pump",position:{...this.player}})}); return;
        }
        this.target = {x:Phaser.Math.Clamp(x,68,882),y:Phaser.Math.Clamp(y,420,491)};
      });
      this.keys = this.input.keyboard?.addKeys("W,A,S,D,UP,DOWN,LEFT,RIGHT") as Record<string, Phaser.Input.Keyboard.Key>;
      hudParts.push(panel(this,26,469,328,46,.84));
      hudParts.push(label(this,44,480,arriving?"Walk to the Quartermaster →":route?`Walk to ${route.title} →`:"The upstream route is open ✓",14));
      mapHud(this, hudParts);
      props.onReady();
    }
    update(_:number,delta:number) {
      if (!this.playerGraphic) return;
      if (!this.locked && !props.transitioning && !props.interactionBlocked) {
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
      const animation=characterAnimation(this,playerSheet(props),this.facing);
      if(moving){if(this.playerGraphic.anims.currentAnim?.key!==animation||!this.playerGraphic.anims.isPlaying)this.playerGraphic.play(animation);}else{this.playerGraphic.stop();this.playerGraphic.setFrame(this.facing==="right"?"0":"4");}
      characterPosition(this.playerGraphic,playerSheet(props),this.player.x,this.player.y);
      if (this.quartermasterGraphic) {
        const x = poseCompanion(this, "quartermaster", this.quartermasterGraphic, this.glows, this.companionPace, 430, delta, this.player.x, moving, this.locked || props.transitioning || props.interactionBlocked || document.hidden, props.reducedMotion);
        this.companionHit?.setX(x);
        this.companionCaption?.setX(x);
      }
      publishPlayerPosition(this,props,this.player);
      this.previous={...this.player};
    }
  };
}
function makeRiverScene(props: Props): typeof Phaser.Scene {
  const deckPoint = (x:number,y:number) => {
    const clampedX=Phaser.Math.Clamp(x,175,830);
    const upper=Phaser.Math.Linear(345,275,(clampedX-175)/655);
    const lower=Phaser.Math.Linear(495,355,(clampedX-175)/655);
    return {x:clampedX,y:Phaser.Math.Clamp(y,upper,lower)};
  };
  return class RiverScene extends Phaser.Scene {
    player = props.mapPosition ?? { x: 260, y: 466 };
    target = { ...this.player };
    previous = { ...this.player };
    playerGraphic?: Phaser.GameObjects.Sprite;
    skiffGraphic?: Phaser.GameObjects.Sprite;
    companionPace = new CompanionPace(555);
    companionHit?: Phaser.GameObjects.Zone;
    companionCaption?: Phaser.GameObjects.Text;
    glows: Phaser.GameObjects.Sprite[] = [];
    keys?: Record<string, Phaser.Input.Keyboard.Key>;
    facing: "left" | "right" = "right";
    locked = false;
    constructor() { super("River"); }
    preload() {
      this.load.on("loaderror", () => props.onFailure("asset-load"));
      this.load.image("river", assetUrl("/river-boat.webp"));
      loadPlayerSheet(this, props);
      this.load.image("skiff", assetUrl("/sprites/skiff.png"));
    }
    create() {
      registerFrames(this, playerSheet(props)); registerFrames(this, "skiff");
      for (const direction of ["left", "right"] as const) { characterAnimation(this, playerSheet(props), direction); characterAnimation(this, "skiff", direction); }
      this.add.image(480, 270, "river").setDisplaySize(WIDTH, HEIGHT);
      const glints = [ [142,350,24], [862,339,31], [930,396,22] ];
      for (const [x,y,length] of glints) {
        const line=this.add.graphics().lineStyle(2,0xc8f6eb,.48).lineBetween(x,y,x+length,y-2).setDepth(0);
        if (!props.reducedMotion) this.tweens.add({targets:line,alpha:.18,duration:1400+x,yoyo:true,repeat:-1});
      }
      const hudParts: Phaser.GameObjects.GameObject[] = [
        panel(this, 22, 91, 302, 66, .92),
        label(this, 40, 100, "RIVER JOURNEY", 26),
        label(this, 40, 132, "MORNING ON THE CURRENT", 13, "#9de4d4"),
      ];
      const person = this.add.sprite(555, 400, "skiff", "4").setOrigin(.5, 1).setScale(90 / 256).setDepth(2);
      characterPosition(person, "skiff", 555, 400); this.skiffGraphic = person;
      for (const [dx,dy] of [[-1.5,0],[1.5,0],[0,-1.5],[0,1.5]]) {
        const glow = this.add.sprite(555, 400, "skiff", "4").setOrigin(.5, 1).setScale(90 / 256).setTintFill(0xffe4af).setAlpha(.68).setDepth(1);
        characterPosition(glow, "skiff", 555+dx, 400+dy); this.glows.push(glow);
      }
      if (!props.reducedMotion) this.tweens.add({ targets: this.glows, alpha: .12, duration: 850, yoyo: true, repeat: -1 });
      const arriving = props.nextLevel === "riverBend" && !props.companionIntroduced;
      const route = props.nextLevel && LEVELS[props.nextLevel].chapter === "river" && !arriving ? LEVELS[props.nextLevel] : null;
      const destination = route ? MAP_DESTINATIONS[route.destination] : null;
      const talkHit = this.add.zone(555, 359, 100, 115);
      this.companionHit = talkHit;
      talkHit.setInteractive({ useHandCursor: true });
      const talkCaption = label(this, 555, 299, props.companionIntroduced ? "TALK TO SKIFF" : "SKIFF", 15).setOrigin(.5);
      this.companionCaption = talkCaption;
      talkCaption.setInteractive({ useHandCursor: true });
      let routeHit: Phaser.GameObjects.Zone | undefined; let routeCaption: Phaser.GameObjects.Text | undefined;
      if (destination && route) {
        const halo = this.add.circle(destination.marker.x, destination.marker.y, 15, 0xffdd8d, .48).setStrokeStyle(3, 0xfff0b8).setDepth(3);
        if (!props.reducedMotion) this.tweens.add({ targets: halo, alpha: .13, scale: 1.6, duration: 750, yoyo: true, repeat: -1 });
        routeHit = this.add.zone(destination.hit.x, destination.hit.y, destination.hit.width, destination.hit.height).setInteractive({ useHandCursor: true });
        routeCaption = label(this, destination.label.x, destination.label.y, route.title, 14).setOrigin(.5).setDepth(4).setInteractive({ useHandCursor: true });
      }
      this.playerGraphic = this.add.sprite(this.player.x, this.player.y, playerSheet(props), "0").setOrigin(.5, 1).setScale(playerScale(props));
      characterPosition(this.playerGraphic, playerSheet(props), this.player.x, this.player.y);
      const replayPoints = replayMarkers(this,props);
      this.input.on("pointerdown", (pointer: Phaser.Input.Pointer, targets: Phaser.GameObjects.GameObject[]) => {
        if (props.transitioning || props.interactionBlocked || this.locked) return;
        props.audio?.unlock();
        const replay = replayPoints.find(point => targets.includes(point.marker) || targets.includes(point.text));
        if (replay) {
          this.locked=true; this.target={...replay.destination.walk};
          this.tweens.add({targets:this.player,x:this.target.x,y:this.target.y,duration:props.reducedMotion?1:Math.hypot(this.player.x-this.target.x,this.player.y-this.target.y)*4.4,onComplete:()=>props.onEvent({type:"replayDestination",destination:replay.group.destination,position:{...this.player}})});
          return;
        }
        const {x,y} = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
        if (destination && (targets.includes(routeCaption!) || targets.includes(routeHit!) && !targets.includes(talkCaption))) {
          this.locked = true; this.target = {...destination.walk}; this.tweens.add({targets:this.player,x:this.target.x,y:this.target.y,duration:props.reducedMotion?1:Math.hypot(this.player.x-this.target.x,this.player.y-this.target.y)*4.4,onComplete:()=>props.onEvent({type:"pump",position:{...this.player}})}); return;
        }
        if (targets.includes(talkHit) || targets.includes(talkCaption) || Math.abs(x-this.companionPace.x)<42 && y>=299 && y<=415) {
          this.locked = true; this.target = {x:505,y:402}; this.tweens.add({targets:this.player,x:this.target.x,y:this.target.y,duration:props.reducedMotion?1:Math.hypot(this.player.x-this.target.x,this.player.y-this.target.y)*4.4,onComplete:()=>props.onEvent({type:"skiff",position:{...this.player}})}); return;
        }
        if (destination && (targets.includes(routeHit!) || targets.includes(routeCaption!))) {
          this.locked = true; this.target = {...destination.walk}; this.tweens.add({targets:this.player,x:this.target.x,y:this.target.y,duration:props.reducedMotion?1:Math.hypot(this.player.x-this.target.x,this.player.y-this.target.y)*4.4,onComplete:()=>props.onEvent({type:"pump",position:{...this.player}})}); return;
        }
        this.target = deckPoint(x,y);
      });
      this.keys = this.input.keyboard?.addKeys("W,A,S,D,UP,DOWN,LEFT,RIGHT") as Record<string, Phaser.Input.Keyboard.Key>;
      hudParts.push(panel(this,26,469,328,46,.84));
      hudParts.push(label(this,44,480,arriving?"Walk to the Skiff →":route?`Walk to ${route.title} →`:"The collection route is open ✓",14));
      mapHud(this, hudParts);
      props.onReady();
    }
    update(_:number,delta:number) {
      if (!this.playerGraphic) return;
      if (!this.locked && !props.transitioning && !props.interactionBlocked) {
        const speed=delta*.19;
        const dx=Number(this.keys?.D?.isDown||this.keys?.RIGHT?.isDown)-Number(this.keys?.A?.isDown||this.keys?.LEFT?.isDown);
        const dy=Number(this.keys?.S?.isDown||this.keys?.DOWN?.isDown)-Number(this.keys?.W?.isDown||this.keys?.UP?.isDown);
        if(dx||dy) this.target=deckPoint(this.player.x+dx*speed,this.player.y+dy*speed);
        const distance=Math.hypot(this.target.x-this.player.x,this.target.y-this.player.y);
        if(distance>1){this.player.x+=(this.target.x-this.player.x)/distance*Math.min(speed,distance);this.player.y+=(this.target.y-this.player.y)/distance*Math.min(speed,distance);}
      }
      const moved=this.player.x-this.previous.x;
      const moving=Math.abs(moved)+Math.abs(this.player.y-this.previous.y)>.08;
      if(Math.abs(moved)>.08)this.facing=moved>0?"right":"left";
      const animation=characterAnimation(this,playerSheet(props),this.facing);
      if(moving){if(this.playerGraphic.anims.currentAnim?.key!==animation||!this.playerGraphic.anims.isPlaying)this.playerGraphic.play(animation);}else{this.playerGraphic.stop();this.playerGraphic.setFrame(this.facing==="right"?"0":"4");}
      characterPosition(this.playerGraphic,playerSheet(props),this.player.x,this.player.y);
      if (this.skiffGraphic) {
        const x = poseCompanion(this, "skiff", this.skiffGraphic, this.glows, this.companionPace, 400, delta, this.player.x, moving, this.locked || props.transitioning || props.interactionBlocked || document.hidden, props.reducedMotion);
        this.companionHit?.setX(x);
        this.companionCaption?.setX(x);
      }
      publishPlayerPosition(this,props,this.player);
      this.previous={...this.player};
    }
  };
}

function makeCollectionScene(props: Props): typeof Phaser.Scene {
  const deckPoint = (x:number,y:number) => ({x:Phaser.Math.Clamp(x,90,890),y:Phaser.Math.Clamp(y,310,490)});
  return class CollectionScene extends Phaser.Scene {
    player = props.mapPosition ?? { x: 140, y: 440 };
    target = { ...this.player };
    previous = { ...this.player };
    playerGraphic?: Phaser.GameObjects.Sprite;
    artificerGraphic?: Phaser.GameObjects.Sprite;
    companionPace = new CompanionPace(555);
    companionHit?: Phaser.GameObjects.Zone;
    companionCaption?: Phaser.GameObjects.Text;
    glows: Phaser.GameObjects.Sprite[] = [];
    keys?: Record<string, Phaser.Input.Keyboard.Key>;
    facing: "left" | "right" = "right";
    locked = false;
    constructor() { super("Collection"); }
    preload() {
      this.load.on("loaderror", () => props.onFailure("asset-load"));
      this.load.image("collection", assetUrl("/collection-station.webp"));
      loadPlayerSheet(this, props);
      this.load.image("artificer", assetUrl("/sprites/artificer.png"));
    }
    create() {
      registerFrames(this, playerSheet(props)); registerFrames(this, "artificer");
      for (const direction of ["left", "right"] as const) { characterAnimation(this, playerSheet(props), direction); characterAnimation(this, "artificer", direction); }
      this.add.image(480, 270, "collection").setDisplaySize(WIDTH, HEIGHT);
      const glints = [ [142,350,24], [862,339,31], [930,396,22] ];
      for (const [x,y,length] of glints) {
        const line=this.add.graphics().lineStyle(2,0xc8f6eb,.48).lineBetween(x,y,x+length,y-2).setDepth(0);
        if (!props.reducedMotion) this.tweens.add({targets:line,alpha:.18,duration:1400+x,yoyo:true,repeat:-1});
      }
      const hudParts: Phaser.GameObjects.GameObject[] = [
        panel(this, 22, 91, 302, 66, .92),
        label(this, 40, 100, "COLLECTION STATION", 26),
        label(this, 40, 132, "DEW ABOVE THE DUNES", 13, "#9de4d4"),
      ];
      const person = this.add.sprite(555, 400, "artificer", "4").setOrigin(.5, 1).setScale(90 / artificerFrames[4].h).setDepth(2);
      characterPosition(person, "artificer", 555, 400); this.artificerGraphic = person;
      for (const [dx,dy] of [[-1.5,0],[1.5,0],[0,-1.5],[0,1.5]]) {
        const glow = this.add.sprite(555, 400, "artificer", "4").setOrigin(.5, 1).setScale(90 / artificerFrames[4].h).setTintFill(0xffe4af).setAlpha(.68).setDepth(1);
        characterPosition(glow, "artificer", 555+dx, 400+dy); this.glows.push(glow);
      }
      if (!props.reducedMotion) this.tweens.add({ targets: this.glows, alpha: .12, duration: 850, yoyo: true, repeat: -1 });
      const arriving = props.nextLevel === "firstDew" && !props.companionIntroduced;
      const route = props.nextLevel && LEVELS[props.nextLevel].chapter === "collection" && !arriving ? LEVELS[props.nextLevel] : null;
      const destination = route ? MAP_DESTINATIONS[route.destination] : null;
      const talkHit = this.add.zone(555, 359, 100, 115);
      this.companionHit = talkHit;
      talkHit.setInteractive({ useHandCursor: true });
      const talkCaption = label(this, 555, 299, props.companionIntroduced ? "TALK TO ARTIFICER" : "ARTIFICER", 15).setOrigin(.5);
      this.companionCaption = talkCaption;
      talkCaption.setInteractive({ useHandCursor: true });
      let routeHit: Phaser.GameObjects.Zone | undefined; let routeCaption: Phaser.GameObjects.Text | undefined;
      if (destination && route) {
        const halo = this.add.circle(destination.marker.x, destination.marker.y, 15, 0xffdd8d, .48).setStrokeStyle(3, 0xfff0b8).setDepth(3);
        if (!props.reducedMotion) this.tweens.add({ targets: halo, alpha: .13, scale: 1.6, duration: 750, yoyo: true, repeat: -1 });
        routeHit = this.add.zone(destination.hit.x, destination.hit.y, destination.hit.width, destination.hit.height).setInteractive({ useHandCursor: true });
        routeCaption = label(this, destination.label.x, destination.label.y, route.title, 14).setOrigin(.5).setDepth(4).setInteractive({ useHandCursor: true });
      }
      this.playerGraphic = this.add.sprite(this.player.x, this.player.y, playerSheet(props), "0").setOrigin(.5, 1).setScale(playerScale(props));
      characterPosition(this.playerGraphic, playerSheet(props), this.player.x, this.player.y);
      const replayPoints = replayMarkers(this,props);
      this.input.on("pointerdown", (pointer: Phaser.Input.Pointer, targets: Phaser.GameObjects.GameObject[]) => {
        if (props.transitioning || props.interactionBlocked || this.locked) return;
        props.audio?.unlock();
        const replay = replayPoints.find(point => targets.includes(point.marker) || targets.includes(point.text));
        if (replay) {
          this.locked=true; this.target={...replay.destination.walk};
          this.tweens.add({targets:this.player,x:this.target.x,y:this.target.y,duration:props.reducedMotion?1:Math.hypot(this.player.x-this.target.x,this.player.y-this.target.y)*4.4,onComplete:()=>props.onEvent({type:"replayDestination",destination:replay.group.destination,position:{...this.player}})});
          return;
        }
        const {x,y} = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
        if (destination && (targets.includes(routeCaption!) || targets.includes(routeHit!) && !targets.includes(talkCaption))) {
          this.locked = true; this.target = {...destination.walk}; this.tweens.add({targets:this.player,x:this.target.x,y:this.target.y,duration:props.reducedMotion?1:Math.hypot(this.player.x-this.target.x,this.player.y-this.target.y)*4.4,onComplete:()=>props.onEvent({type:"pump",position:{...this.player}})}); return;
        }
        if (targets.includes(talkHit) || targets.includes(talkCaption) || Math.abs(x-this.companionPace.x)<42 && y>=299 && y<=415) {
          this.locked = true; this.target = {x:505,y:402}; this.tweens.add({targets:this.player,x:this.target.x,y:this.target.y,duration:props.reducedMotion?1:Math.hypot(this.player.x-this.target.x,this.player.y-this.target.y)*4.4,onComplete:()=>props.onEvent({type:"artificer",position:{...this.player}})}); return;
        }
        if (destination && (targets.includes(routeHit!) || targets.includes(routeCaption!))) {
          this.locked = true; this.target = {...destination.walk}; this.tweens.add({targets:this.player,x:this.target.x,y:this.target.y,duration:props.reducedMotion?1:Math.hypot(this.player.x-this.target.x,this.player.y-this.target.y)*4.4,onComplete:()=>props.onEvent({type:"pump",position:{...this.player}})}); return;
        }
        this.target = deckPoint(x,y);
      });
      this.keys = this.input.keyboard?.addKeys("W,A,S,D,UP,DOWN,LEFT,RIGHT") as Record<string, Phaser.Input.Keyboard.Key>;
      hudParts.push(panel(this,26,469,328,46,.84));
      hudParts.push(label(this,44,480,arriving?"Walk to the Artificer →":route?`Walk to ${route.title} →`:"The sky route is open ✓",14));
      mapHud(this, hudParts);
      props.onReady();
    }
    update(_:number,delta:number) {
      if (!this.playerGraphic) return;
      if (!this.locked && !props.transitioning && !props.interactionBlocked) {
        const speed=delta*.19;
        const dx=Number(this.keys?.D?.isDown||this.keys?.RIGHT?.isDown)-Number(this.keys?.A?.isDown||this.keys?.LEFT?.isDown);
        const dy=Number(this.keys?.S?.isDown||this.keys?.DOWN?.isDown)-Number(this.keys?.W?.isDown||this.keys?.UP?.isDown);
        if(dx||dy) this.target=deckPoint(this.player.x+dx*speed,this.player.y+dy*speed);
        const distance=Math.hypot(this.target.x-this.player.x,this.target.y-this.player.y);
        if(distance>1){this.player.x+=(this.target.x-this.player.x)/distance*Math.min(speed,distance);this.player.y+=(this.target.y-this.player.y)/distance*Math.min(speed,distance);}
      }
      const moved=this.player.x-this.previous.x;
      const moving=Math.abs(moved)+Math.abs(this.player.y-this.previous.y)>.08;
      if(Math.abs(moved)>.08)this.facing=moved>0?"right":"left";
      const animation=characterAnimation(this,playerSheet(props),this.facing);
      if(moving){if(this.playerGraphic.anims.currentAnim?.key!==animation||!this.playerGraphic.anims.isPlaying)this.playerGraphic.play(animation);}else{this.playerGraphic.stop();this.playerGraphic.setFrame(this.facing==="right"?"0":"4");}
      characterPosition(this.playerGraphic,playerSheet(props),this.player.x,this.player.y);
      if (this.artificerGraphic) {
        const x = poseCompanion(this, "artificer", this.artificerGraphic, this.glows, this.companionPace, 400, delta, this.player.x, moving, this.locked || props.transitioning || props.interactionBlocked || document.hidden, props.reducedMotion);
        this.companionHit?.setX(x);
        this.companionCaption?.setX(x);
      }
      publishPlayerPosition(this,props,this.player);
      this.previous={...this.player};
    }
  };
}

function makePuzzleScene(props: Props): typeof Phaser.Scene {
  const goalCount = Object.values(props.level.goals).filter(count => count > 0).length;
  const crowded = goalCount >= 4;
  const hudLayout = {
    movesHeight: crowded ? 54 : 66,
    headingY: crowded ? 212 : goalCount > 2 ? 216 : 227,
    goalY: (index: number) => crowded ? 253 + index * 34 : goalCount > 2 ? 257 + index * 38 : 279 + index * 55,
    portraitY: crowded ? 421 : 392,
    powerTitleY: crowded ? 388 : 365,
    meterY: crowded ? 415 : 391,
    chargeY: crowded ? 438 : 415,
    rewardY: crowded ? 452 : 429,
    messageY: crowded ? 472 : 457,
  };
  return class PuzzleScene extends Phaser.Scene {
    puzzle: Puzzle = props.puzzle ?? createPuzzle(props.level);
    get collectorTotal(): number { return this.puzzle.condensation?.collectors.flat().filter(Boolean).length ?? 25; }
    displayBoard: Board = this.puzzle.board;
    displayCrust: CrustGrid = this.puzzle.crust.map(row => [...row]);
    crustPieces = new Map<string, Phaser.GameObjects.Container>();
    selected: Cell | null = null;
    busy = false;
    clearStreak = 0;
    comboTurn = false;
    celebratedTier = 0;
    chainCallout?: HTMLDivElement;
    boardRoot?: Phaser.GameObjects.Container;
    flair?: CascadeFlair;
    exitMarkers?: Phaser.GameObjects.Graphics;
    exitPulse?: Phaser.Tweens.Tween;
    exitPulsePaused = false;
    currentVisuals: CurrentVisual[] = [];
    condensationVisual?: Phaser.GameObjects.Graphics;
    displayWet?: BoardMask;
    lastTap: { cell: Cell; time: number } | null = null;
    pieces = new Map<number, { graphic: Phaser.GameObjects.Container; kind: SymbolKind | "seedpod" | "crate"; hp?: number; jet?: "row" | "column"; power?: Power }>();
    lessonHint?: Phaser.GameObjects.Graphics;
    lessonPowerId?: number;
    lessonPowerHint?: Phaser.GameObjects.Graphics;
    hud: Phaser.GameObjects.GameObject[] = [];
    displayedGoals: Goals = { ...this.puzzle.goals };
    goalLabels = new Map<GoalKind, Phaser.GameObjects.Text>();
    goalIcons = new Map<GoalKind, Phaser.GameObjects.GameObject>();
    goalIconScales = new Map<GoalKind, { x: number; y: number }>();
    selection?: Phaser.GameObjects.Graphics;
    message?: Phaser.GameObjects.Text;
    keeperPortrait?: Phaser.GameObjects.Image;
    portraitY = hudLayout.portraitY;
    revealPlan?: FinalePlan;
    revealActive = false;
    revealSkipped = false;
    sceneAlive = true;
    finaleDone = false;
    pendingReveal = new Set<() => void>();
    pendingAnimations = new Set<() => void>();
    introActive = true;
    introPending = new Set<() => void>();
    idleHintMs = 0;
    hintActive = false;
    hintOutline?: Phaser.GameObjects.Graphics;
    toolHints?: Phaser.GameObjects.Graphics;
    lastToolMode:ToolKind|null=null;
    hintTweens: Phaser.Tweens.Tween[] = [];
    hintGraphics: { graphic: Phaser.GameObjects.Container; x: number; y: number }[] = [];
    cancelGesture?: () => void;
    constructor() { super("Puzzle"); }
    preload() {
      this.load.on("loaderror", () => props.onFailure("asset-load"));
      this.load.image("backdrop", props.level.chapter === "collection" ? assetUrl("/collection-station.webp") : props.level.chapter === "river" ? assetUrl("/river-boat.webp") : props.level.chapter === "castle" ? assetUrl("/castle.webp") : props.level.chapter === "town" ? assetUrl("/town.webp") : props.level.chapter === "farmland" ? assetUrl("/farmland.webp") : props.level.chapter === "gatehouse" ? assetUrl("/gatehouse.webp") : props.level.chapter === "caravan" ? assetUrl("/caravan.webp") : assetUrl("/oasis.webp"));
      this.load.image("tiles", assetUrl("/sprites/tiles.png"));
      this.load.image("companionAvatar", assetUrl(`/sprites/${props.boardCompanion ?? "keeper"}-avatar.png`));
      this.load.image("pennant", assetUrl("/sprites/pennant.png"));
      this.load.image("key", assetUrl("/sprites/key.png"));
      this.load.image("coin", assetUrl("/sprites/coin.png"));
      this.load.image("flywheel", assetUrl("/sprites/flywheel.png"));
      this.load.image("prism", assetUrl("/sprites/prism.png"));
      this.load.image("saltCrust", assetUrl("/sprites/salt-crust.png"));
      this.load.image("saltCrust2", assetUrl("/sprites/salt-crust-2.png"));
      this.load.image("seedpod", assetUrl("/sprites/seedpod.png"));
      this.load.image("seedpodCracked", assetUrl("/sprites/seedpod-cracked.png"));
      this.load.image("deliveryCrate", assetUrl("/sprites/delivery-crate.png"));
    }
    create() {
      // Warm the italic callout font while the board opens; it never delays play.
      void document.fonts?.load("italic 900 40px Archivo").catch(() => {});
      registerFrames(this, "tiles");
      const backdrop = this.add.image(480, 270, "backdrop").setDisplaySize(WIDTH, HEIGHT).setTint(0x85949a);
      const veil = this.add.graphics();
      sceneLayouts.set(this, { mode: "puzzle", backdrop, veil });
      layoutScene(this, Number(this.game.config.width), Number(this.game.config.height));
      panel(this, 24, 92, 271, 424, 0.96);
      panel(this, 318, 20, 474, 500, 0.98);
      const title=label(this, 50, 106, props.level.title, props.level.title.length > 15 ? 19 : props.level.title.length > 13 ? 21 : 24);
      title.setScale(Math.min(1, 225 / title.width));
      this.boardRoot=this.add.container(0,0);
      this.flair=new CascadeFlair(this,this.boardRoot,props.reducedMotion);
      for (let row = 0; row < BOARD_SIZE; row++) for (let col = 0; col < BOARD_SIZE; col++) {
        if (!this.puzzle.mask[row][col]) continue;
        const x = GRID_X + col * CELL, y = GRID_Y + row * CELL;
        const cell = this.add.graphics();
        cell.fillStyle((row + col) % 2 ? 0x28515d : 0x2c5a64).fillRoundedRect(x + 2, y + 2, CELL - 4, CELL - 4, 6);
        this.boardRoot.add(cell);
      }
      if (this.puzzle.condensation) {
        this.condensationVisual = this.add.graphics();
        this.boardRoot.add(this.condensationVisual);
        this.paintCondensation(this.puzzle.condensation.wet);
        if (isPlaytestMode(window.location.search)) this.game.canvas.dataset.condensationWet = String(this.collectorTotal - (this.puzzle.goals.condensation ?? 0));
      }
      const routes=this.puzzle.currents ?? (this.puzzle.current ? [{id:"main",cells:this.puzzle.current,closure:"loop" as const}] : []);
      for (const [routeIndex, path] of routes.entries()) {
        const colors=currentColors[routeIndex % currentColors.length];
        const route=this.add.graphics().setDepth(2);
        const glints: Phaser.GameObjects.Graphics[]=[];
        this.boardRoot.add(route);
        for (const [index, cell] of path.cells.entries()) {
          const { x, y } = this.center(cell);
          const next = path.cells[(index + 1) % path.cells.length];
          const direction=path.closure==="edgeWrap" && index===path.cells.length-1 ? edgeVector(path.exit) : {x:next.col-cell.col,y:next.row-cell.row};
          const dx=direction.x,dy=direction.y;
          // Water is a distinct surface, while symbols above it keep their full opacity.
          route.fillStyle(colors.water, 0.86).fillRoundedRect(x - 24, y - 24, 48, 48, 7);
          route.lineStyle(3, colors.rim, 0.92).strokeRoundedRect(x - 22, y - 22, 44, 44, 6);
          route.lineStyle(1, 0xb7fff4, 0.48).lineBetween(x - 16, y - 18, x - 7, y - 18);
          route.lineStyle(1, 0xb7fff4, 0.4).lineBetween(x + 7, y + 18, x + 16, y + 18);
          // The glyph sits in the gutter, outside the opaque symbol art.
          const ax = x + dx * 25, ay = y + dy * 25;
          route.fillStyle(0x103e48, 0.95).fillCircle(ax, ay, 7);
          route.fillStyle(colors.arrow, 1).fillTriangle(ax + dx * 5, ay + dy * 5, ax - dx * 3 - dy * 4, ay - dy * 3 + dx * 4, ax - dx * 3 + dy * 4, ay - dy * 3 - dx * 4);
          // A small glint follows each route's own arrow order outside tile art.
          const glint = this.add.graphics().setPosition(ax, ay).setAlpha(0);
          glint.fillStyle(0xe5fff9, 0.9).fillCircle(0, 0, 4);
          glint.lineStyle(2, 0x92fff0, 0.9).lineBetween(-dx * 10, -dy * 10, dx * 3, dy * 3);
          this.boardRoot.add(glint);
          glints.push(glint);
        }
        if(path.closure==="edgeWrap") this.addCurrentPort(path,colors);
        const frost=this.add.graphics().setDepth(3); this.boardRoot.add(frost);
        this.currentVisuals.push({route:path,water:route,frost,glints,frozen:false,flow:0,surgeMs:0});
      }
      this.paintCurrentFreeze();
      if(isPlaytestMode(window.location.search)) {this.game.canvas.dataset.currentRouteCount=String(routes.length);this.game.canvas.dataset.currentCells=String(routes.reduce((sum,route)=>sum+route.cells.length,0));}
      this.selection = this.add.graphics();
      this.boardRoot.add(this.selection);
      for (let row = 0; row < BOARD_SIZE; row++) for (let col = 0; col < BOARD_SIZE; col++) if (this.displayCrust[row][col]) this.makeCrust({ row, col }, this.displayCrust[row][col]);
      if ((props.level.goals.crate ?? 0) > 0) {
        const exits = crateExitCells(this.puzzle.mask);
        this.exitMarkers = this.add.graphics().setDepth(7);
        for (const { row, col } of exits) {
          const x = GRID_X + col * CELL, y = GRID_Y + row * CELL + CELL - 5;
          this.exitMarkers.lineStyle(9, 0x74f4df, 0.22).lineBetween(x + 7, y, x + CELL - 7, y);
          this.exitMarkers.lineStyle(4, 0x84fbe3, 0.78).lineBetween(x + 8, y, x + CELL - 8, y);
          this.exitMarkers.lineStyle(2, 0xffe8a4, 0.95).lineBetween(x + 10, y, x + CELL - 10, y);
        }
        this.boardRoot.add(this.exitMarkers);
        if (!props.reducedMotion) this.exitPulse = this.tweens.add({ targets: this.exitMarkers, alpha: 0.58, duration: 1450, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
        if (isPlaytestMode(window.location.search)) this.game.canvas.dataset.crateExitCount = String(exits.length);
      }
      this.message = label(this, 51, hudLayout.messageY, "Drag or tap adjacent symbols to swap", crowded ? 11 : 12, "#d2c5a5").setWordWrapWidth(220).setMaxLines(crowded ? 3 : 4);
      this.add.circle(75, this.portraitY, 30, 0x264d59).setStrokeStyle(2, 0xe0bd82);
      this.keeperPortrait = this.add.image(75, this.portraitY, prepareSmallTexture(this, "companionAvatar", "companionAvatar-small", 162)).setDisplaySize(54, 54);
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
          && (props.toolMode==='tileBomb' || !this.displayCrust[row][col] && !(["seedpod","crate"].includes(this.displayBoard[row][col]?.kind ?? ""))) ? { row, col } : null;
      };
      const resetGesture = () => {
        const active = gesture; gesture = null;
        if (active && canvas.hasPointerCapture(active.id)) canvas.releasePointerCapture(active.id);
      };
      this.cancelGesture = resetGesture;
      const commitSwipe = (event: PointerEvent) => {
        if (!gesture || gesture.id !== event.pointerId || gesture.committed || this.busy || props.transitioning || props.interactionBlocked || document.hidden) return;
        const point = logical(event), dx = point.x - gesture.x, dy = point.y - gesture.y;
        if (props.toolMode==='tileBomb' || Math.max(Math.abs(dx), Math.abs(dy)) < 12) return;
        const to = Math.abs(dx) >= Math.abs(dy)
          ? { row: gesture.from.row, col: gesture.from.col + Math.sign(dx) }
          : { row: gesture.from.row + Math.sign(dy), col: gesture.from.col };
        gesture.committed = true;
        if (!this.puzzle.mask[to.row]?.[to.col] || this.displayCrust[to.row][to.col] || !this.displayBoard[to.row][to.col]) return;
        this.selected = gesture.from;
        void this.choose(to);
      };
      const down = (event: PointerEvent) => {
        if (this.busy || props.transitioning || props.interactionBlocked || document.hidden || gesture || event.button !== 0) return;
        this.cancelIdleHint();
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
        if (props.transitioning || props.interactionBlocked || document.hidden) { resetGesture(); return; }
        commitSwipe(event);
        const tapped = !current.committed;
        resetGesture();
        if (tapped && !this.busy && !props.transitioning && !props.interactionBlocked && !document.hidden) void this.choose(current.from);
      };
      const cancel = (event: PointerEvent) => {
        if (gesture?.id === event.pointerId) resetGesture();
      };
      canvas.addEventListener("pointerdown", down);
      canvas.addEventListener("pointermove", move);
      canvas.addEventListener("pointerup", up);
      canvas.addEventListener("pointercancel", cancel);
      canvas.addEventListener("lostpointercapture", cancel);
      this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
        this.sceneAlive = false;
        this.clearChainCallout();
        this.flair?.dispose();
        this.toolHints?.destroy();
        this.exitPulse?.remove();
        this.exitMarkers?.destroy();
        this.currentVisuals.length = 0;
        delete canvas.dataset.currentCells;
        delete canvas.dataset.currentRouteCount;
        delete canvas.dataset.currentFrozen;
        delete canvas.dataset.currentFrozenRoutes;
        delete canvas.dataset.currentActiveRoutes;
        delete canvas.dataset.currentWraps;
        delete canvas.dataset.currentSteps;
        delete canvas.dataset.flairTier;
        delete canvas.dataset.flairParticles;
        delete canvas.dataset.flairWaves;
        delete canvas.dataset.flairStrength;
        delete canvas.dataset.flairGlows;
        delete canvas.dataset.crateExitCount;
        resetGesture(); this.cancelGesture = undefined;
        this.cancelIdleHint();
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
        delete canvas.dataset.collectionPhase;
        delete canvas.dataset.condensationWet;
        props.skipReveal.current = null;
      });
      props.skipReveal.current = () => this.skipWinningReveal();
      this.syncTiles(this.puzzle.board, 0, "refill");
      for (const placement of props.startingBoosters) this.pieces.get(placement.tileId)?.graphic.setAlpha(0);
      this.renderHud();
      if (props.replayMode) this.add.text(960, 24, "REPLAY · NO REWARDS", { fontFamily: "Arial, sans-serif", fontSize: "13px", color: "#ffe1a2", fontStyle: "bold", stroke: "#173440", strokeThickness: 3 }).setOrigin(1,0).setDepth(30);
      this.busy = true;
      void Promise.resolve(props.onReady()).then(authorized => {
        if (authorized && this.sceneAlive && this.introActive) void this.revealGoals();
      }).catch(() => props.onFailure('authorization-failed'));
    }
    addCurrentPort(path: Extract<CurrentRoute,{closure:"edgeWrap"}>, colors:(typeof currentColors)[number]) {
      const ports=[{cell:path.cells[0],edge:path.entry,inlet:true},{cell:path.cells[path.cells.length-1],edge:path.exit,inlet:false}];
      for(const port of ports) {
        const center=this.center(port.cell),edgeDirection=edgeVector(port.edge);
        const direction=port.inlet ? {x:-edgeDirection.x,y:-edgeDirection.y} : edgeDirection;
        const x=center.x+edgeDirection.x*39,y=center.y+edgeDirection.y*39;
        const mark=this.add.graphics().setDepth(8);
        mark.fillStyle(0x123947,0.98).fillCircle(x,y,12);
        mark.lineStyle(3,colors.rim,1).strokeCircle(x,y,11);
        mark.fillStyle(colors.arrow,1).fillTriangle(x+direction.x*5,y+direction.y*5,x-direction.x*3-direction.y*4,y-direction.y*3+direction.x*4,x-direction.x*3+direction.y*4,y-direction.y*3-direction.x*4);
        this.boardRoot?.add(mark);
      }
    }
    paintCurrentFreeze() {
      const frozenIds:string[]=[];
      for(const visual of this.currentVisuals) {
        const frozen=visual.route.cells.some(cell=>this.displayCrust[cell.row][cell.col]>0);
        visual.frost.clear();
        if(visual.frozen && !frozen) visual.surgeMs=Math.max(visual.surgeMs,950);
        visual.frozen=frozen;
        if(!frozen) continue;
        frozenIds.push(visual.route.id);
        for(const cell of visual.route.cells) {
          const {x,y}=this.center(cell);
          visual.frost.fillStyle(0xd8f7f1,.3).fillRoundedRect(x-22,y-22,44,44,6);
          visual.frost.lineStyle(2,0xe4f9f5,.86).strokeRoundedRect(x-21,y-21,42,42,6);
        }
      }
      if(isPlaytestMode(window.location.search)) {
        this.game.canvas.dataset.currentFrozen=String(frozenIds.length>0);
        this.game.canvas.dataset.currentFrozenRoutes=frozenIds.join(",");
        this.game.canvas.dataset.currentActiveRoutes=this.currentVisuals.filter(visual=>!visual.frozen).map(visual=>visual.route.id).join(",");
      }
    }
    update(_: number, delta: number) {
      if(this.lastToolMode!==props.toolMode){
        this.lastToolMode=props.toolMode;this.toolHints?.destroy();this.toolHints=undefined;
        this.selected=null;this.highlight(null);this.lastTap=null;
        if(props.toolMode && this.puzzle.status==='playing' && this.puzzle.moves>0){
          const marks=this.add.graphics().setDepth(10);
          for(let row=0;row<BOARD_SIZE;row++)for(let col=0;col<BOARD_SIZE;col++){
            if(!this.puzzle.mask[row][col])continue;
            const tile=this.puzzle.board[row][col],salt=this.puzzle.crust[row][col]>0;
            const valid=props.toolMode==='tileBomb' ? salt || Boolean(tile && tile.kind!=='crate' && !isSpecial(tile)) : Boolean(tile && tile.kind!=='crate' && tile.kind!=='seedpod' && !salt);
            if(valid){const point=this.center({row,col});marks.lineStyle(1.6,0xffe5a0,.68).strokeRoundedRect(point.x-22,point.y-22,44,44,6);}
          }
          this.toolHints=marks;
        }
      }
      this.flair?.setPaused(props.transitioning || props.interactionBlocked);
      const flowBlocked = props.reducedMotion || props.transitioning || props.interactionBlocked || document.hidden ||
        (this.introActive && this.game.canvas.dataset.introPhase !== "ready") ||
        this.revealActive || this.puzzle.status !== "playing";
      for(const visual of this.currentVisuals) {
        if(visual.frozen || flowBlocked || this.busy && visual.surgeMs<=0) {
          for(const glint of visual.glints) glint.setAlpha(0);
        } else if(visual.glints.length) {
          const surge=visual.surgeMs>0;
          visual.surgeMs=Math.max(0,visual.surgeMs-delta);
          visual.flow=(visual.flow+delta/(surge?840:2500))%1;
          for(let index=0;index<visual.glints.length;index++) {
            const wave=Math.max(0,Math.cos((visual.flow-index/visual.glints.length)*Math.PI*2));
            visual.glints[index].setAlpha((surge?0.18:0.08)+wave*wave*wave*(surge?0.82:0.64));
          }
        }
      }
      const pauseExitPulse = props.transitioning || props.interactionBlocked || document.hidden;
      if (this.exitPulse && pauseExitPulse !== this.exitPulsePaused) {
        this.exitPulsePaused = pauseExitPulse;
        pauseExitPulse ? this.exitPulse.pause() : this.exitPulse.resume();
      }
      if (props.transitioning || props.interactionBlocked || document.hidden) { this.cancelGesture?.(); this.selected = null; this.highlight(null); }
      const blocked = this.busy || this.introActive && this.game.canvas.dataset.introPhase !== "ready" ||
        this.revealActive || this.puzzle.status !== "playing" || props.transitioning || props.interactionBlocked || document.hidden || Boolean(this.selected);
      if (blocked) { this.cancelIdleHint(); return; }
      if (this.hintActive) return;
      this.idleHintMs += delta;
      if (this.idleHintMs >= 5000) this.showIdleHint();
    }
    cancelIdleHint() {
      for (const tween of this.hintTweens) tween.remove();
      this.hintTweens = [];
      for (const { graphic, x, y } of this.hintGraphics) if (graphic.active) graphic.setPosition(x, y);
      this.hintGraphics = [];
      this.hintOutline?.destroy();
      this.hintOutline = undefined;
      delete this.game.canvas.dataset.idleHint;
      this.hintActive = false;
      this.idleHintMs = 0;
    }
    showIdleHint() {
      // Use a separate board copy because legalMove swaps candidate cells while searching.
      const board = this.puzzle.board.map(row => row.map(tile => tile ? { ...tile } : null));
      const opening = this.lessonHint && this.puzzle.opening && playTurn(this.puzzle, ...this.puzzle.opening).valid ? this.puzzle.opening : null;
      const pair = opening || legalMove(board);
      if (!pair) { this.idleHintMs = 0; return; }
      const graphics = pair.map(cell => this.pieces.get(this.puzzle.board[cell.row][cell.col]!.id)?.graphic);
      if (!graphics[0] || !graphics[1]) { this.idleHintMs = 0; return; }
      this.hintActive = true;
      this.hintGraphics = graphics.map(graphic => ({ graphic: graphic!, x: graphic!.x, y: graphic!.y }));
      const outline = this.add.graphics().setDepth(7);
      for (const cell of pair) {
        const center = this.center(cell);
        outline.lineStyle(2, 0xffe5a1, .95).strokeRoundedRect(center.x - 23, center.y - 23, 46, 46, 8);
      }
      this.hintOutline = outline;
      this.game.canvas.dataset.idleHint = `${pair[0].row},${pair[0].col}:${pair[1].row},${pair[1].col}`;
      const finish = () => { if (!this.hintActive) return; this.cancelIdleHint(); delete this.game.canvas.dataset.idleHint; this.idleHintMs = -1000; };
      if (props.reducedMotion) {
        this.hintTweens.push(this.tweens.add({ targets: outline, alpha: .55, duration: 650, onComplete: finish }));
        return;
      }
      const dx = (pair[1].col - pair[0].col) * 9, dy = (pair[1].row - pair[0].row) * 9;
      this.hintTweens.push(this.tweens.add({ targets: graphics[0], x: graphics[0].x + dx, y: graphics[0].y + dy, duration: 230, ease: "Sine.easeInOut", yoyo: true, repeat: 1 }));
      this.hintTweens.push(this.tweens.add({ targets: graphics[1], x: graphics[1].x - dx, y: graphics[1].y - dy, duration: 230, ease: "Sine.easeInOut", yoyo: true, repeat: 1, onComplete: finish }));
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
      if (!this.puzzle.opening) this.setMessage(this.puzzle.condensation ? "Match through a wet net to spread the silver film." : "Drag or tap adjacent symbols to swap");
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
        void this.introTween(avatar, { angle: 9, y: this.portraitY - 6, yoyo: true, repeat: 2, duration: 85 }).then(() => {
          if (this.introActive) avatar.setPosition(75, this.portraitY).setAngle(0);
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
          const flight = drawPiece(this, 75, this.portraitY, tile.kind, tile.jet, false, tile.power).setDepth(42);
          const motion = { t: 0 };
          await this.introTween(motion, { t: 1, duration: 480, ease: "Cubic.easeInOut", onUpdate: () => {
            const t = motion.t;
            flight.setPosition(75 + (p.x - 75) * t, this.portraitY + (p.y - this.portraitY) * t - Math.sin(Math.PI * t) * 80);
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
      const goals = Object.entries(props.level.goals).filter(([, count]) => count > 0) as [GoalKind, number][];
      const height = !completed && goals.length >= 4 ? 194 : 144;
      const background = this.add.graphics();
      background.fillStyle(0xffedc8).fillRoundedRect(-270, 0, 540, height, 16);
      background.lineStyle(3, 0xc49551).strokeRoundedRect(-270, 0, 540, height, 16);
      const title = this.add.text(0, completed ? 48 : 20, completed ? "ALL GOALS CLEARED!" : `${props.level.title} · COLLECT`, {
        fontFamily: "Arial, sans-serif", fontSize: completed ? "32px" : "22px", fontStyle: "bold", color: "#21444a",
      }).setOrigin(0.5, 0);
      const contents: Phaser.GameObjects.GameObject[] = [background, title];
      if (!completed) {
        goals.forEach(([kind, count], index) => {
          const four = goals.length >= 4;
          // Four goals get two fixed-width columns: icon, then at most 170px
          // of text. Even long labels cannot run into the next goal icon.
          const x = four ? -230 + (index % 2) * 260 : goals.length === 1 ? -35 : goals.length === 2 ? index === 0 ? -170 : 65 : -205 + index * 170;
          const y = four ? 91 + Math.floor(index / 2) * 64 : 91;
          contents.push(drawGoalIcon(this, x, y, kind, kind === "condensation" ? { covered: this.collectorTotal - count, total: this.collectorTotal } : undefined));
          const caption = this.add.text(x + 36, y - 15, kind === "condensation" ? `${count} dry nets` : `${count} ${goalName(kind, count).toLowerCase()}`, { fontFamily: "Arial, sans-serif", fontSize: four ? "18px" : goals.length > 2 ? "18px" : "23px", fontStyle: "bold", color: "#21444a" });
          if (four) caption.setScale(Math.min(1, 170 / caption.width));
          contents.push(caption);
        });
      }
      const hiddenY = -height - 20;
      const banner = this.add.container(WIDTH / 2, hiddenY, contents).setDepth(40);
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
      await animate(banner, props.reducedMotion ? { alpha: 0, duration: 120 } : { y: hiddenY, duration: 280, ease: "Cubic.easeIn" });
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
      this.setMessage(this.puzzle.condensation ? "Try the glowing swap: the wet square coats matching nets." : props.level.lesson === "current" ? "The current follows its arrows one space after each move. Swap and match tiles in the water normally." : props.level.lesson === "wrapCurrent" ? "The marked outlet carries tiles off one bank and back through its matching inlet." : props.level.lesson === "frozenCurrent" ? "Clear salt from the frozen route. Other currents keep flowing." : props.level.lesson === "crate" ? "Clear below each crate to deliver it at any bottom edge." : props.level.lesson === "seedpod" ? "Match beside each pod twice. Pods fall and cannot be swapped." : props.level.lesson === "crust" ? "Matches and Prism-cleared tiles crack nearby salt; Jets and Flywheels need a direct hit." : props.level.lesson === "combo" ? "Try combining the highlighted powers" : props.level.lesson === "pennant" ? "Try the glowing move to match three pennants" : props.level.lesson === "key" ? "Try the glowing move to match three keys" : `Try the glowing move to discover the ${props.level.lesson === "jet" ? "Pressure Jet" : props.level.lesson === "flywheel" ? "Flywheel" : "Prism"}`);
    }
    cellAt(pointer: Phaser.Input.Pointer): Cell | null {
      const position = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
      const col = Math.floor((position.x - GRID_X) / CELL);
      const row = Math.floor((position.y - GRID_Y) / CELL);
      return row >= 0 && col >= 0 && row < BOARD_SIZE && col < BOARD_SIZE && this.puzzle.mask[row][col] && !this.displayCrust[row][col] && !(["seedpod","crate"].includes(this.displayBoard[row][col]?.kind ?? "")) ? { row, col } : null;
    }
    center(cell: Cell) { return { x: GRID_X + cell.col * CELL + CELL / 2, y: GRID_Y + cell.row * CELL + CELL / 2 }; }
    setMessage(message: string) { this.message?.setText(message); }
    clearChainCallout() {
      this.chainCallout?.remove();
      this.chainCallout = undefined;
    }
    showChainCallout() {
      const frame = this.game.canvas.closest(".frame");
      if (!frame || !this.sceneAlive) return;
      this.clearChainCallout();
      const callout = document.createElement("div");
      callout.className = "chain-callout";
      // Puzzle layout scales by height and centers the authored canvas horizontally.
      callout.style.left = `calc(50% + ${(GRID_X + BOARD_SIZE * CELL / 2 - WIDTH / 2) / HEIGHT * 100}cqh)`;
      callout.style.top = `${(GRID_Y + BOARD_SIZE * CELL / 2) / HEIGHT * 100}%`;
      callout.dataset.reducedMotion = String(props.reducedMotion);
      callout.textContent = CHAIN_CALLOUTS[nextChainCallout++ % CHAIN_CALLOUTS.length];
      callout.setAttribute("aria-live", "polite");
      callout.addEventListener("animationend", () => {
        if (this.chainCallout === callout) this.clearChainCallout();
      }, { once: true });
      frame.appendChild(callout);
      this.chainCallout = callout;
    }
    renderHud(goals = this.puzzle.goals, moves = this.puzzle.moves, charge = this.puzzle.keeperCharge, fired = this.puzzle.keeperFired) {
      this.displayedGoals = { ...goals };
      for (const object of this.hud) object.destroy();
      this.hud = [];
      this.goalLabels.clear();
      this.goalIcons.clear();
      this.goalIconScales.clear();
      this.hud.push(panel(this, 49, 145, 220, hudLayout.movesHeight, 0.7));
      this.hud.push(label(this, 66, 150, String(moves), 38, "#ffe49e"));
      this.hud.push(label(this, 129, 164, "MOVES LEFT", 14));
      const goalRows = Object.entries(props.level.goals).filter(([, count]) => count > 0) as [GoalKind, number][];
      this.hud.push(label(this, 51, hudLayout.headingY, this.puzzle.condensation ? "NETS" : "LEFT TO COLLECT", 17, "#a2e7da"));
      goalRows.forEach(([kind, count], index) => {
        const y = hudLayout.goalY(index);
        const icon = drawGoalIcon(this, 74, y, kind, kind === "condensation" ? { covered: this.collectorTotal - (goals.condensation ?? 0), total: this.collectorTotal } : undefined);
        if (crowded && "setScale" in icon) {
          const scalable=icon as Phaser.GameObjects.Image | Phaser.GameObjects.Container;
          scalable.setScale(scalable.scaleX * 0.82, scalable.scaleY * 0.82);
        }
        const text = label(this, 106, y - 15, remainingGoalLabel(kind,goals,this.collectorTotal), crowded ? 18 : 20);
        this.goalIcons.set(kind, icon);
        this.goalIconScales.set(kind, { x: icon.scaleX, y: icon.scaleY });
        this.goalLabels.set(kind, text);
        this.hud.push(icon, text);
      });
      this.hud.push(label(this, 110, hudLayout.powerTitleY, `${({keeper:"KEEPER",wayfinder:"WAYFINDER",gatewright:"GATEWRIGHT",fieldkeeper:"FIELDKEEPER",towncrier:"TOWN CRIER",artificer:"ARTIFICER"} as const)[props.boardCompanion??"keeper"]}'S POWER`, 14, "#a2e7da"));
      const meter = this.add.graphics();
      meter.fillStyle(0x315568).fillRoundedRect(110, hudLayout.meterY, 153, 17, 7);
      meter.fillStyle(GREEN).fillRoundedRect(110, hudLayout.meterY, 153 * Math.min(1, charge / this.puzzle.keeperTarget), 17, 7);
      this.hud.push(meter);
      this.hud.push(label(this, 110, hudLayout.chargeY, `CHARGE ${Math.min(charge, this.puzzle.keeperTarget)} / ${this.puzzle.keeperTarget} ${this.puzzle.chargeSymbol === "key" ? "KEYS" : this.puzzle.chargeSymbol === "pennant" ? "PENNANTS" : "REEDS"}`, 11));
      this.hud.push(label(this, 110, hudLayout.rewardY, this.puzzle.grantedPower === "prism" ? "→ ONE PRISM" : this.puzzle.grantedPower === "flywheels" ? "→ TWO FLYWHEELS" : "→ TWO JETS", 11));
    }
    paintCondensation(wet: BoardMask) {
      const terrain = this.puzzle.condensation;
      const art = this.condensationVisual;
      if (!terrain || !art) return;
      art.clear();
      this.displayWet = wet.map(row => [...row]);
      for (let row = 0; row < BOARD_SIZE; row++) for (let col = 0; col < BOARD_SIZE; col++) {
        if (!terrain.collectors[row][col]) continue;
        const x = GRID_X + col * CELL, y = GRID_Y + row * CELL;
        if (wet[row][col]) {
          art.fillStyle(0xa1dce3, 0.35).fillRoundedRect(x + 4, y + 4, CELL - 8, CELL - 8, 10);
          // Broken wavelets and bubble clusters distinguish wet ground from
          // the River current's solid rectangular rim and directional arrows.
          art.lineStyle(2, 0xc9f4ee, 0.9);
          for (let offset = 7; offset < 43; offset += 4) {
            const ripple = Math.sin(offset * 0.46) * 2;
            art.lineBetween(x + offset, y + 6 + ripple, x + offset + 2, y + 6 + Math.sin((offset + 2) * 0.46) * 2);
            art.lineBetween(x + offset, y + 44 - ripple, x + offset + 2, y + 44 - Math.sin((offset + 2) * 0.46) * 2);
          }
          for (const [bx, by, radius] of [[10, 14, 3], [16, 19, 2], [38, 33, 4], [33, 38, 2]] as const) {
            art.lineStyle(1.5, 0xe6ffff, 0.9).strokeCircle(x + bx, y + by, radius);
          }
          art.fillStyle(0xf3ffff, 0.9).fillCircle(x + 38, y + 11, 2);
        } else {
          art.lineStyle(1, 0xc2d9c9, 0.8);
          for (let offset = 8; offset < CELL - 6; offset += 8) {
            art.fillStyle(0xc2d9c9, 0.75).fillCircle(x + offset, y + 4, 1.5);
            art.fillCircle(x + offset, y + CELL - 4, 1.5);
            art.fillCircle(x + 4, y + offset, 1.5);
            art.fillCircle(x + CELL - 4, y + offset, 1.5);
          }
        }
      }
    }
    async showCondensationSpread(step: TurnStep) {
      if (!step.wet || !this.condensationVisual) return;
      const spread = step.spread ?? [];
      const sources = this.displayWet?.flatMap((row, r) => row.flatMap((value, c) => value ? [{ row: r, col: c }] : [])) ?? [];
      if (!spread.length) { this.paintCondensation(step.wet); return; }
      this.setMessage(`${this.collectorTotal - (step.goals.condensation ?? 0)} / ${this.collectorTotal} nets wet`);
      if (isPlaytestMode(window.location.search)) this.game.canvas.dataset.condensationWet = String(this.collectorTotal - (step.goals.condensation ?? 0));
      if (!props.reducedMotion) await Promise.all(spread.slice(0, 12).map(async cell => {
        const source = sources.reduce((best, candidate) =>
          !best || Math.abs(candidate.row - cell.row) + Math.abs(candidate.col - cell.col) < Math.abs(best.row - cell.row) + Math.abs(best.col - cell.col) ? candidate : best, sources[0]);
        const start = this.center(source ?? cell), end = this.center(cell);
        const drop = this.add.circle(start.x, start.y, 4, 0xe7ffff, 0.95).setDepth(22);
        const flight = { t: 0 };
        await this.tween(flight, { t: 1, duration: 260, ease: "Sine.easeInOut", onUpdate: () => {
          drop.setPosition(start.x + (end.x - start.x) * flight.t, start.y + (end.y - start.y) * flight.t - Math.sin(Math.PI * flight.t) * 13);
        } });
        drop.destroy();
      }));
      if (!this.sceneAlive) return;
      this.paintCondensation(step.wet);
      await Promise.all(spread.slice(0, 12).map(async cell => {
        const { x, y } = this.center(cell);
        const ring = this.add.circle(x, y, 6, 0xffffff, 0).setStrokeStyle(2, 0xd9fbff, 0.9).setDepth(20);
        await this.tween(ring, { scale: props.reducedMotion ? 1.2 : 2.3, alpha: 0, duration: props.reducedMotion ? 80 : 180 });
        ring.destroy();
      }));
    }
    creditGoal(kind: GoalKind, amount: number) {
      this.displayedGoals[kind] = Math.max(0, (this.displayedGoals[kind] ?? 0) - amount);
      this.goalLabels.get(kind)?.setText(remainingGoalLabel(kind,this.displayedGoals,this.collectorTotal));
      const icon = this.goalIcons.get(kind) as Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Transform | undefined;
      if (kind === "condensation" && icon) paintCollectorTank(icon as Phaser.GameObjects.Graphics, this.collectorTotal - (this.displayedGoals.condensation ?? 0), this.collectorTotal);
      if (icon && !props.reducedMotion && this.sceneAlive) {
        this.tweens.killTweensOf(icon);
        const baseline = this.goalIconScales.get(kind) ?? { x: icon.scaleX, y: icon.scaleY };
        icon.setScale(baseline.x, baseline.y);
        this.tweens.add({ targets: icon, scaleX: baseline.x * 1.16, scaleY: baseline.y * 1.16, duration: 85, yoyo: true, ease: "Sine.easeOut" });
      }
    }
    async showCollections(step: TurnStep) {
      const credits = step.collections ?? [];
      if (!credits.length || !this.sceneAlive) return;
      this.game.canvas.dataset.collectionPhase = "flight";
      const byKind = new Map<GoalKind, Cell[]>();
      for (const credit of credits) {
        const cells = byKind.get(credit.kind) ?? [];
        cells.push(credit.cell);
        byKind.set(credit.kind, cells);
      }
      // Large Prism clears still show every credited kind without filling the screen
      // with sprites. Each representative carries its share of that kind's credits.
      const flights: { kind: GoalKind; cell: Cell; amount: number }[] = [];
      let slots = 12;
      const kinds = [...byKind.keys()];
      for (let index = 0; index < kinds.length; index++) {
        const kind = kinds[index];
        const cells = byKind.get(kind)!;
        const take = Math.min(cells.length, Math.max(1, Math.floor(slots / (kinds.length - index))));
        for (let flight = 0; flight < take; flight++) {
          const from = Math.floor(flight * cells.length / take);
          const until = Math.floor((flight + 1) * cells.length / take);
          flights.push({ kind, cell: cells[from], amount: until - from });
        }
        slots -= take;
      }
      await Promise.all(flights.map(async ({ kind, cell, amount }, index) => {
        const from = this.center(cell);
        const icon = this.goalIcons.get(kind) as Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Transform | undefined;
        if (!icon) { this.creditGoal(kind, amount); return; }
        const to = { x: icon.x, y: icon.y };
        const flight = drawGoalIcon(this, from.x, from.y, kind, kind === "condensation" ? { covered: this.collectorTotal - (this.displayedGoals.condensation ?? 0) + amount, total: this.collectorTotal } : undefined).setDepth(35);
        flight.setScale(props.reducedMotion ? 0.7 : 0.9);
        const progress = { value: 0 };
        try {
          await this.tween(progress, { value: 1, delay: props.reducedMotion ? 0 : Math.min(index * 23, 180), duration: props.reducedMotion ? 90 : 410,
            ease: "Sine.easeInOut", onUpdate: () => {
              const t = progress.value;
              flight.setPosition(from.x + (to.x - from.x) * t, from.y + (to.y - from.y) * t - (props.reducedMotion ? 0 : 68 * 4 * t * (1 - t)));
              flight.setScale((props.reducedMotion ? 0.7 : 0.9) * (1 - 0.48 * t));
              flight.setAlpha(1 - 0.18 * t);
            } });
          if (this.sceneAlive) this.creditGoal(kind, amount);
        } finally { flight.destroy(); }
      }));
      if (this.sceneAlive) {
        this.displayedGoals = { ...step.goals };
        for (const [kind, text] of this.goalLabels) text.setText(remainingGoalLabel(kind,this.displayedGoals,this.collectorTotal));
        delete this.game.canvas.dataset.collectionPhase;
      }
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
      this.boardRoot?.add(piece);
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
      this.paintCurrentFreeze();
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
          this.boardRoot?.add(graphic);
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
      if (this.exitMarkers) this.boardRoot?.bringToTop(this.exitMarkers);
      this.flair?.bringToFront();
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
    outsideCurrentPoint(cell:Cell,edge:CurrentEdge) {
      const center=this.center(cell);
      if(edge==="left") return {x:GRID_X-29,y:center.y};
      if(edge==="right") return {x:GRID_X+BOARD_SIZE*CELL+29,y:center.y};
      if(edge==="top") return {x:center.x,y:GRID_Y-29};
      return {x:center.x,y:GRID_Y+BOARD_SIZE*CELL+29};
    }
    async animateCurrentMotions(motions:CurrentMotion[],board:Board,short:boolean) {
      if(!motions.length) {await this.syncTiles(board,short?80:420,"current");return;}
      if(short || this.revealSkipped) {await this.syncTiles(board,0,"current");await this.wait(80);return;}
      await Promise.all(motions.map(async motion=>{
        const graphic=this.pieces.get(motion.tileId)?.graphic;
        if(!graphic || !graphic.active) return;
        const destination=this.center(motion.to);
        if(!motion.wrap) {await this.tween(graphic,{x:destination.x,y:destination.y,duration:400,ease:"Cubic.easeInOut"});return;}
        const outside=this.outsideCurrentPoint(motion.from,motion.wrap.exit);
        await this.tween(graphic,{x:outside.x,y:outside.y,alpha:0,duration:200,ease:"Cubic.easeIn"});
        if(!this.sceneAlive || this.revealSkipped || !graphic.active) return;
        const incoming=this.outsideCurrentPoint(motion.to,motion.wrap.entry);
        graphic.setPosition(incoming.x,incoming.y);
        await this.tween(graphic,{x:destination.x,y:destination.y,alpha:1,duration:200,ease:"Cubic.easeOut"});
      }));
      if(!this.sceneAlive) return;
      await this.syncTiles(board,0,"current");
    }
    async animateStep(step: TurnStep) {
      if (!this.sceneAlive) return;
      const short = props.reducedMotion;
      if (step.kind === "current") {
        this.paintCurrentFreeze();
        this.setMessage((step.currentRouteIds?.length ?? 0) > 1 ? "The currents carry tiles along their arrows…" : "The current carries tiles along its arrows…");
        props.audio?.play("current");
        const active=new Set(step.currentRouteIds ?? this.currentVisuals.filter(visual=>!visual.frozen).map(visual=>visual.route.id));
        const flashes=this.currentVisuals.filter(visual=>active.has(visual.route.id)).map(visual=>{
          visual.surgeMs=650;
          if(short) return Promise.resolve();
          visual.water.setAlpha(1);
          return this.tween(visual.water,{alpha:.52,duration:110,yoyo:true});
        });
        await Promise.all([this.animateCurrentMotions(step.currentMotions ?? [],step.board,short),...flashes]);
        if (!this.sceneAlive) return;
        this.displayBoard = step.board;
        if (isPlaytestMode(window.location.search)) {
          this.game.canvas.dataset.currentSteps=String(Number(this.game.canvas.dataset.currentSteps??0)+1);
          this.game.canvas.dataset.currentWraps=String(Number(this.game.canvas.dataset.currentWraps??0)+(step.currentMotions?.filter(motion=>motion.wrap).length??0));
        }
        return;
      }
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
      if (step.kind === "deliver") {
        props.audio?.play("crate");
        await this.syncTiles(step.board, short ? 70 : 180, "clear");
        if (!this.sceneAlive) return;
        await this.showCollections(step);
        this.displayBoard = step.board;
        this.renderHud(this.displayedGoals, this.puzzle.moves, step.keeperCharge);
        return;
      }
      if (step.kind === "keeper") {
        props.audio?.play("keeper");
        const who=({keeper:"Keeper",wayfinder:"Wayfinder",gatewright:"Gatewright",fieldkeeper:"Fieldkeeper",towncrier:"Town Crier",artificer:"Artificer"} as const)[props.boardCompanion??"keeper"];
        const grant=props.level.grantedPower==="prism"?"a Prism":props.level.grantedPower==="flywheels"?"two Flywheels":"two Pressure Jets";
        this.setMessage(`${who}'s power! ${grant} ready. Charge resets.`);
        if (this.keeperPortrait && !short) {
          this.tweens.killTweensOf(this.keeperPortrait);
          this.keeperPortrait.setY(this.portraitY).setAngle(-8);
          this.tweens.add({ targets: this.keeperPortrait, angle: 8, yoyo: true, repeat: 2, duration: 90,
            onComplete: () => this.keeperPortrait?.setAngle(0) });
        }
        const shots: Promise<void>[] = [];
        for (const cell of step.cells) {
          const orb = this.add.circle(76, this.portraitY, 10, 0xa8f5ce).setStrokeStyle(3, 0xffffff);
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
        const cross = step.jets.some((jet, index) => step.jets.slice(index + 1).some(other =>
          jet.cell.row === other.cell.row && jet.cell.col === other.cell.col && jet.direction !== other.direction));
        if (cross) this.setMessage("Jet combo! Row + column blast");
        await this.showSequence(step);
        if (!this.sceneAlive) return;
        await this.showCondensationSpread(step);
        if (!this.sceneAlive) return;
        props.audio?.play("clear", this.clearStreak);
        this.clearStreak++;
        const tier=this.flair?.play(this.clearStreak,step.cells.map(cell=>this.center(cell)),this.comboTurn && this.clearStreak===1) ?? 0;
        if (tier > this.celebratedTier) { this.celebratedTier=tier; props.audio?.play("cascade",tier); }
        if (isPlaytestMode(window.location.search)) { this.game.canvas.dataset.flairTier=String(tier); this.game.canvas.dataset.flairParticles=String(this.flair?.liveCount??0); this.game.canvas.dataset.flairWaves=String(this.clearStreak); this.game.canvas.dataset.flairStrength=String(cascadeVisualStrength(this.clearStreak,this.comboTurn && this.clearStreak===1)); this.game.canvas.dataset.flairGlows=String(this.flair?.glowCount??0); }
        if (showCascadeWord(this.clearStreak)) this.showChainCallout();
        await Promise.all([this.syncTiles(step.board, short ? 70 : 180, step.kind), this.showCollections(step)]);
        if (!this.sceneAlive) return;
        const chargeCells = step.cells.filter(cell => this.displayBoard[cell.row][cell.col]?.kind === this.puzzle.chargeSymbol && !isSpecial(this.displayBoard[cell.row][cell.col])).slice(0, 8);
        await Promise.all(chargeCells.map(async cell => {
          const position = this.center(cell);
          const mote = this.add.circle(position.x, position.y, 5, 0xa9f5cf);
          await this.tween(mote, { x: 225, y: hudLayout.meterY + 8, alpha: 0.15, duration: short ? 80 : 320, ease: "Cubic.easeIn" });
          mote.destroy();
        }));
        if (!this.sceneAlive) return;
        this.renderHud(this.displayedGoals, this.puzzle.moves, step.keeperCharge);
        this.displayBoard = step.board;
        return;
      }
      if(step.kind==='bomb') {
        const point=this.center(step.cells[0]);
        const flash=this.add.circle(point.x,point.y,6,0xffe7a4,0.95).setDepth(40).setStrokeStyle(3,0xffffff);
        props.audio?.play('clear',1);
        await this.tween(flash,{alpha:0,scale:7,duration:props.reducedMotion?50:260,ease:'Cubic.easeOut'});
        flash.destroy();
        return;
      }
      if (step.kind === "shuffle") {
        this.setMessage("Refreshing the board…");
        const survivingPowers = new Set(this.displayBoard.flat().filter(tile => isSpecial(tile) || (tile?.kind === "seedpod" || tile?.kind === "crate")).map(tile => tile!.id));
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
      this.cancelIdleHint();
      let action:PuzzleAction|undefined;
      if(props.toolMode==='tileBomb') action={kind:'tileBomb',target:cell};
      else if(props.toolMode==='freeSwap') {
        if(!this.selected){this.selected=cell;this.highlight(cell);props.audio?.play('select');return;}
        const from=this.selected;this.selected=null;this.highlight(null);
        action={kind:'freeSwap',from,to:cell};
      }
      if(action){
        const from=action.kind==='tileBomb'?action.target:action.from;
        const turn=resolveAction(this.puzzle,action);
        if(!turn.valid){props.audio?.play('invalid');this.setMessage('Choose a valid tile or adjacent pair.');return;}
        this.busy=true;
        const authorized=await props.authorizeTool(action,turn,this.puzzle);
        if(!authorized || !this.sceneAlive){this.busy=false;return;}
        await this.runTurn(turn,from,cell,action);
        return;
      }
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
      await this.runTurn(turn,from,cell);
    }
    async runTurn(turn:Turn,from:Cell,cell:Cell,action?:PuzzleAction){
      this.busy = true;
      props.onEvent({ type: "resolvedTurn", puzzle: turn.state, turn, from, to: cell,action });
      if (this.lessonHint) { this.tweens.killTweensOf(this.lessonHint); this.lessonHint.destroy(); this.lessonHint = undefined; }
      this.clearChainCallout();
      this.clearStreak = 0;
      this.celebratedTier = 0;
      this.comboTurn = Object.values(turn.stats.combinations).some(count => count > 0);
      props.audio?.play("swap");
      if (this.keeperPortrait && !props.reducedMotion) {
        this.tweens.killTweensOf(this.keeperPortrait);
        this.keeperPortrait.setY(this.portraitY).setAngle(0);
        this.tweens.add({ targets: this.keeperPortrait, y: this.portraitY - 6, yoyo: true, duration: 110,
          onComplete: () => this.keeperPortrait?.setY(this.portraitY) });
      }
      this.setMessage("Watch the swap, clear, and refill…");
      for (const step of turn.steps) await this.animateStep(step);
      if (!this.sceneAlive) return;
      this.puzzle = turn.state;
      if (isPlaytestMode(window.location.search)) this.game.canvas.dataset.waterRemaining = String(turn.state.goals.water);
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
        this.clearChainCallout();
        if (props.prototype === "condensation") {
          props.onEvent({ type: "victory", puzzle: turn.state });
          await this.showGoalBanner(true);
          if (this.sceneAlive) props.onEvent({ type: "win", puzzle: turn.state });
          return;
        }
        this.revealPlan = planFinale(turn.state);
        this.revealActive = true;
        this.game.canvas.dataset.revealPhase = "banner";
        props.onEvent({ type: "victory", puzzle: turn.state });
        props.onEvent({ type: "revealStarted", puzzle: turn.state });
        await this.showGoalBanner(true);
        if (!this.sceneAlive) return;
        if (!this.revealSkipped) await this.finale();
      }
      else if (turn.state.status === "lost") { this.clearChainCallout(); props.onEvent({ type: "lose", puzzle: turn.state }); }
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
        if (props.replayMode) return;
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
  const interactionBlocked = useRef(props.interactionBlocked);
  interactionBlocked.current = props.interactionBlocked;
  const toolMode=useRef(props.toolMode);toolMode.current=props.toolMode;
  const authorizeTool=useRef(props.authorizeTool);authorizeTool.current=props.authorizeTool;
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
      get interactionBlocked() { return interactionBlocked.current; },
      get toolMode(){return toolMode.current;},
      authorizeTool:(action,turn,before)=>authorizeTool.current(action,turn,before),
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
        scene: [props.mode === "map" ? props.region === "collection" ? makeCollectionScene(current) : props.region === "river" ? makeRiverScene(current) : props.region === "castle" ? makeCastleScene(current) : props.region === "town" ? makeTownScene(current) : props.region === "farmland" ? makeFarmlandScene(current) : props.region === "gatehouse" ? makeGatehouseScene(current) : props.region === "caravan" ? makeCaravanScene(current) : makeMapScene(current) : makePuzzleScene(current)],
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
  return <div className="game-canvas" ref={host} data-replay-destinations={props.mode === "map" ? props.replayDestinations.map(group => group.destination).join(",") : undefined} aria-label={props.mode === "map" ? props.region === "collection" ? "Walkable water collection station" : props.region === "river" ? "Walkable river boat" : props.region === "castle" ? "Walkable Castle Island" : props.region === "town" ? "Walkable town" : props.region === "farmland" ? "Walkable farmland" : props.region === "gatehouse" ? "Walkable river gatehouse" : props.region === "caravan" ? "Walkable desert caravan" : "Walkable oasis" : `${props.level.title} puzzle`} />;
}
