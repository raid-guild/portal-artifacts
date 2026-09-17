import { waveSchedule, type EnemyKind, type SpawnSpec } from "./waves";

export const LANE_COUNT = 12;
const SHOT_SPEED = 1.52;
const FIRE_INTERVAL = 0.165;
const HIT_DEPTH_RADIUS = 0.055;

export interface Enemy {
  id: number;
  kind: EnemyKind;
  lane: number;
  depth: number;
  previousDepth: number;
  hp: number;
  age: number;
  shiftIndex: number;
  shiftDirection: number;
  surged: boolean;
  hitFlash: number;
}

export interface Shot {
  id: number;
  lane: number;
  depth: number;
  previousDepth: number;
}

export type GameEvent =
  | { type: "shot" }
  | { type: "spawn"; enemy: Enemy }
  | { type: "hit"; enemy: Enemy; destroyed: boolean }
  | { type: "breach"; lane: number; damaged: boolean }
  | { type: "wave-clear"; wave: number }
  | { type: "game-over" };

export interface GameSnapshot {
  wave: number;
  score: number;
  lives: number;
  lane: number;
  invulnerable: number;
  enemies: readonly Enemy[];
  shots: readonly Shot[];
  pending: number;
}

export function wrapLane(lane: number): number {
  return ((lane % LANE_COUNT) + LANE_COUNT) % LANE_COUNT;
}

export function sweptHit(shot: Pick<Shot, "previousDepth" | "depth">, enemy: Pick<Enemy, "previousDepth" | "depth">): boolean {
  const before = shot.previousDepth - enemy.previousDepth;
  const after = shot.depth - enemy.depth;
  return Math.abs(after) <= HIT_DEPTH_RADIUS || (before >= 0 && after <= 0);
}

function enemySpeed(enemy: Enemy, wave: number): number {
  const pressure = Math.min(0.105, Math.max(0, wave - 1) * 0.0065);
  const base = enemy.kind === "prism" ? 0.125 : enemy.kind === "ribbon" ? 0.108 : 0.082;
  const surge = enemy.kind === "jester" && enemy.depth > 0.66 ? 1.85 : 1;
  return Math.min(0.245, (base + pressure) * surge);
}

function scoreFor(kind: EnemyKind): number {
  return kind === "prism" ? 100 : kind === "ribbon" ? 200 : 300;
}

export class GameSimulation {
  wave = 1;
  score = 0;
  lives = 3;
  lane = 0;
  invulnerable = 0;
  enemies: Enemy[] = [];
  shots: Shot[] = [];
  elapsed = 0;
  fireCooldown = 0;
  schedule: SpawnSpec[] = [];
  scheduleIndex = 0;
  waveComplete = false;
  private nextId = 1;

  constructor() {
    this.reset();
  }

  reset(): void {
    this.wave = 1;
    this.score = 0;
    this.lives = 3;
    this.lane = 0;
    this.invulnerable = 0;
    this.enemies = [];
    this.shots = [];
    this.nextId = 1;
    this.beginWave(1);
  }

  beginWave(wave: number): void {
    this.wave = wave;
    this.elapsed = 0;
    this.fireCooldown = 0;
    this.schedule = waveSchedule(wave);
    this.scheduleIndex = 0;
    this.waveComplete = false;
    this.enemies = [];
    this.shots = [];
  }

  move(direction: number): void {
    this.lane = wrapLane(this.lane + Math.sign(direction));
  }

  fire(): GameEvent[] {
    if (this.fireCooldown > 0 || this.waveComplete || this.lives <= 0) return [];
    this.shots.push({ id: this.nextId++, lane: this.lane, depth: 0.91, previousDepth: 0.91 });
    this.fireCooldown = FIRE_INTERVAL;
    return [{ type: "shot" }];
  }

  snapshot(): GameSnapshot {
    return {
      wave: this.wave,
      score: this.score,
      lives: this.lives,
      lane: this.lane,
      invulnerable: this.invulnerable,
      enemies: this.enemies,
      shots: this.shots,
      pending: this.schedule.length - this.scheduleIndex,
    };
  }

  step(dt: number): GameEvent[] {
    const events: GameEvent[] = [];
    const delta = Math.min(dt, 0.05);
    this.elapsed += delta;
    this.fireCooldown = Math.max(0, this.fireCooldown - delta);
    this.invulnerable = Math.max(0, this.invulnerable - delta);

    while (this.scheduleIndex < this.schedule.length && this.schedule[this.scheduleIndex].at <= this.elapsed) {
      const spec = this.schedule[this.scheduleIndex++];
      const enemy: Enemy = {
        id: this.nextId++,
        kind: spec.kind,
        lane: spec.lane,
        depth: 0,
        previousDepth: 0,
        hp: spec.kind === "jester" ? 2 : 1,
        age: 0,
        shiftIndex: 0,
        shiftDirection: (spec.lane + this.wave) % 2 === 0 ? 1 : -1,
        surged: false,
        hitFlash: 0,
      };
      this.enemies.push(enemy);
      events.push({ type: "spawn", enemy });
    }

    for (const shot of this.shots) {
      shot.previousDepth = shot.depth;
      shot.depth -= SHOT_SPEED * delta;
    }

    for (const enemy of this.enemies) {
      enemy.previousDepth = enemy.depth;
      enemy.age += delta;
      enemy.hitFlash = Math.max(0, enemy.hitFlash - delta);
      enemy.depth += enemySpeed(enemy, this.wave) * delta;

      if (enemy.kind === "ribbon") {
        const thresholds = [0.34, 0.62];
        if (enemy.shiftIndex < thresholds.length && enemy.depth >= thresholds[enemy.shiftIndex]) {
          enemy.lane = wrapLane(enemy.lane + enemy.shiftDirection);
          enemy.shiftDirection *= -1;
          enemy.shiftIndex += 1;
        }
      }
      if (enemy.kind === "jester" && enemy.depth >= 0.66) enemy.surged = true;
    }

    const spentShots = new Set<number>();
    const deadEnemies = new Set<number>();
    for (const shot of this.shots) {
      if (spentShots.has(shot.id)) continue;
      const target = this.enemies.find((enemy) =>
        !deadEnemies.has(enemy.id) && enemy.lane === shot.lane && sweptHit(shot, enemy),
      );
      if (!target) continue;
      spentShots.add(shot.id);
      target.hp -= 1;
      target.hitFlash = 0.14;
      const destroyed = target.hp <= 0;
      if (destroyed) {
        deadEnemies.add(target.id);
        this.score += scoreFor(target.kind);
      }
      events.push({ type: "hit", enemy: target, destroyed });
    }

    for (const enemy of this.enemies) {
      if (deadEnemies.has(enemy.id) || enemy.depth < 1) continue;
      deadEnemies.add(enemy.id);
      const damaged = this.invulnerable <= 0;
      if (damaged) {
        this.lives -= 1;
        this.invulnerable = 1.25;
      }
      events.push({ type: "breach", lane: enemy.lane, damaged });
    }

    this.shots = this.shots.filter((shot) => shot.depth > -0.04 && !spentShots.has(shot.id));
    this.enemies = this.enemies.filter((enemy) => !deadEnemies.has(enemy.id));

    if (this.lives <= 0) {
      this.lives = 0;
      events.push({ type: "game-over" });
      return events;
    }

    if (!this.waveComplete && this.scheduleIndex >= this.schedule.length && this.enemies.length === 0) {
      this.waveComplete = true;
      events.push({ type: "wave-clear", wave: this.wave });
    }
    return events;
  }
}
