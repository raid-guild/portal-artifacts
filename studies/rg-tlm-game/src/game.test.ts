import { describe, expect, it } from 'vitest';
import { act, initialState, inventory, parseSave, type Action, type State } from './game';

const fresh = (): State => ({ ...initialState(), started: true });
function play(s: State, ...actions: Action[]) { return actions.reduce((state, action) => act(state, action).state, s); }
const plateFirst: Action[] = [
  { type: 'take', item: 'plate' }, { type: 'use', item: 'plate', target: 'repair' },
  { type: 'take', item: 'jack' }, { type: 'use', item: 'jack', target: 'repair' },
];

describe('the walker repair', () => {
  it('can be completed and leaves the notebook in inventory', () => {
    const s = play(fresh(), ...plateFirst, { type: 'operate' }, { type: 'leave' });
    expect(s.repaired).toBe(true); expect(s.departed).toBe(true);
    expect(inventory(s)).toEqual(['notebook']);
    expect(parseSave(JSON.stringify(s))).toEqual(s);
  });
  it('can collect the jack first; a failed use preserves the tool', () => {
    const s = play(fresh(), { type: 'take', item: 'jack' }, { type: 'use', item: 'jack', target: 'repair' });
    expect(s.jack).toBe('inventory'); expect(s.plate).toBe('ground');
    const done = play(s, { type: 'take', item: 'plate' }, { type: 'use', item: 'plate', target: 'walker' }, { type: 'use', item: 'jack', target: 'repair' }, { type: 'operate' });
    expect(done.repaired).toBe(true);
  });
  it('requires both tools before lifting and repair before leaving', () => {
    const s = fresh();
    expect(act(s, { type: 'operate' }).state).toEqual(s);
    expect(act(s, { type: 'leave' }).state.departed).toBe(false);
  });
  it('wrong targets and absent items cannot advance or consume anything', () => {
    const s = play(fresh(), { type: 'take', item: 'plate' });
    expect(act(s, { type: 'use', item: 'plate', target: 'shelter' }).state).toEqual(s);
    expect(act(s, { type: 'use', item: 'jack', target: 'repair' }).state).toEqual(s);
  });
  it('repeated collection and operation cannot duplicate items or undo repair', () => {
    const s = play(fresh(), { type: 'take', item: 'plate' }, { type: 'take', item: 'plate' });
    expect(inventory(s).filter(i => i === 'plate')).toHaveLength(1);
    const done = play(fresh(), ...plateFirst, { type: 'operate' });
    expect(act(done, { type: 'operate' }).state).toEqual(done);
    expect(act(done, { type: 'take', item: 'jack' }).state).toEqual(done);
  });
  it('does not mutate the previous state', () => {
    const s = fresh(); act(s, { type: 'talk' });
    expect(s.metRook).toBe(false);
  });
});

describe('local save recovery', () => {
  it('round-trips each legal step of the puzzle', () => {
    let s = fresh();
    for (const action of [...plateFirst, { type: 'operate' } as Action, { type: 'leave' } as Action]) {
      s = act(s, action).state;
      expect(parseSave(JSON.stringify(s))).toEqual(s);
    }
  });
  it('rejects corrupt, outdated and contradictory saves', () => {
    for (const raw of [null, '', 'oops', 'null', '{}', JSON.stringify({ ...fresh(), version: 99 }), JSON.stringify({ ...fresh(), jack: 'placed' }), JSON.stringify({ ...fresh(), departed: true }), JSON.stringify({ ...fresh(), plate: 'packed' }), JSON.stringify({ ...fresh(), position: null })]) expect(parseSave(raw)).toBeNull();
  });
  it('clamps out-of-bounds positions and discards unknown fields', () => {
    const save = parseSave(JSON.stringify({ ...fresh(), position: { x: -100, y: 300 }, extra: '<script>' }));
    expect(save?.position).toEqual({ x: 9, y: 94 });
    expect(save).not.toHaveProperty('extra');
  });
});
