import { describe, expect, it } from "vitest";
import { GameSimulation, sweptHit, wrapLane } from "./simulation";
import { waveSchedule } from "./waves";

describe("lane wrapping", () => {
  it("wraps in both directions", () => {
    expect(wrapLane(-1)).toBe(11);
    expect(wrapLane(12)).toBe(0);
    expect(wrapLane(25)).toBe(1);
  });
});

describe("swept projectile collision", () => {
  it("detects a crossing that occurs between frames", () => {
    expect(sweptHit(
      { previousDepth: 0.52, depth: 0.37 },
      { previousDepth: 0.45, depth: 0.47 },
    )).toBe(true);
  });

  it("rejects separated paths", () => {
    expect(sweptHit(
      { previousDepth: 0.8, depth: 0.7 },
      { previousDepth: 0.2, depth: 0.23 },
    )).toBe(false);
  });
});

describe("damage and invulnerability", () => {
  it("only removes one life from simultaneous breaches", () => {
    const game = new GameSimulation();
    game.schedule = [];
    game.enemies = [0, 1].map((id) => ({
      id,
      kind: "prism" as const,
      lane: id,
      depth: 0.999,
      previousDepth: 0.999,
      hp: 1,
      age: 0,
      shiftIndex: 0,
      shiftDirection: 1,
      surged: false,
      hitFlash: 0,
    }));
    game.step(0.05);
    expect(game.lives).toBe(2);
    expect(game.invulnerable).toBeGreaterThan(1);
  });
});

describe("wave schedules", () => {
  it("introduces enemy roles in the approved order", () => {
    expect(new Set(waveSchedule(1).map(({ kind }) => kind))).toEqual(new Set(["prism"]));
    expect(new Set(waveSchedule(2).map(({ kind }) => kind))).toEqual(new Set(["prism", "ribbon"]));
    expect(new Set(waveSchedule(3).map(({ kind }) => kind))).toEqual(new Set(["prism", "ribbon", "jester"]));
  });

  it("is deterministic and caps endless pressure", () => {
    expect(waveSchedule(6)).toHaveLength(12);
    expect(new Set(waveSchedule(6).map(({ kind }) => kind))).toEqual(new Set(["prism", "ribbon", "jester"]));
    expect(waveSchedule(12)).toEqual(waveSchedule(12));
    expect(waveSchedule(99)).toHaveLength(22);
    const times = waveSchedule(99).map(({ at }) => at);
    expect(times.every((time, index) => index === 0 || time - times[index - 1] >= 0.52)).toBe(true);
  });
});
