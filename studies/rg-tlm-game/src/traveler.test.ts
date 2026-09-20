import { describe, expect, it } from 'vitest';
import { facingForDelta, walkingFrame, FRAME_MS } from './traveler';

describe('traveler movement direction', () => {
  it('faces all four directions and retains facing for a zero-length move', () => {
    expect(facingForDelta(10, 0)).toBe('right');
    expect(facingForDelta(-10, 0)).toBe('left');
    expect(facingForDelta(0, -3)).toBe('up');
    expect(facingForDelta(0, 3)).toBe('down');
    expect(facingForDelta(0, 0, 'up')).toBe('up');
  });
  it('compares scene pixels when choosing a diagonal direction', () => {
    expect(facingForDelta(5, -7)).toBe('right');
    expect(facingForDelta(2, -7)).toBe('up');
  });
  it('loops the six walk poses without entering idle or the spare frame', () => {
    expect(Array.from({ length: 8 }, (_, i) => walkingFrame(i * FRAME_MS))).toEqual([1, 2, 3, 4, 5, 6, 1, 2]);
    expect(walkingFrame(-1)).toBe(1);
  });
});
