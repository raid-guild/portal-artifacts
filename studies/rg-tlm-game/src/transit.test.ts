import { describe, expect, it } from 'vitest';
import { act, initialState, inventory, parseSave, type Action, type State } from './game';
import { GUILD_ROUTE } from './transit';

function repaired(): State { return { ...initialState(), started: true, repaired: true, metRook: true, plate: 'packed', jack: 'packed' }; }
function crossing(): State { return act(repaired(), { type: 'leave' }).state; }
function play(s: State, ...actions: Action[]) { return actions.reduce((s, a) => act(s, a).state, s); }
function correct(s: State) { return play(s, { type: 'turn-ring', ring: 'destination', direction: 1 }, { type: 'turn-ring', ring: 'beacon', direction: -1 }, { type: 'turn-ring', ring: 'beacon', direction: -1 }); }

describe('crossing rules', () => {
  it('carries the repaired walker and notebook into the second room', () => {
    const s = crossing();
    expect(s.room).toBe('crossing'); expect(s.position).toEqual({ x: 22, y: 93 });
    expect(s.repaired).toBe(true); expect(inventory(s)).toEqual(['notebook']);
    expect(act(s, { type: 'leave' }).state).toEqual(s);
  });
  it('keeps incorrect signals and premature crossing harmless', () => {
    const s = crossing();
    expect(act(s, { type: 'transmit' }).reply.text).toContain('Quarry');
    expect(act(s, { type: 'transmit' }).state).toEqual(s);
    expect(act(s, { type: 'cross' }).state).toEqual(s);
    expect(act(s, { type: 'use', item: 'plate', target: 'pedestal' }).state).toEqual(s);
  });
  it('reads the notebook, wraps rings both ways, and requires both correct symbols', () => {
    const s = crossing();
    const read = act(s, { type: 'inspect', target: 'notebook' }).state;
    expect(read.transit.notebookRead).toBe(true); expect(s.transit.notebookRead).toBe(false);
    let turned = play(read, ...Array.from({ length: 4 }, (): Action => ({ type: 'turn-ring', ring: 'destination', direction: 1 })));
    expect(turned.transit.destination).toBe(0);
    turned = act(turned, { type: 'turn-ring', ring: 'destination', direction: 1 }).state;
    expect(act(turned, { type: 'transmit' }).state.transit.active).toBe(false);
    const set = correct(read);
    expect(set.transit).toMatchObject(GUILD_ROUTE);
    expect(act(set, { type: 'transmit' }).state.transit.active).toBe(true);
  });
  it('opens once, locks connected rings, and completes without losing inventory', () => {
    const active = act(correct(crossing()), { type: 'transmit' }).state;
    expect(act(active, { type: 'transmit' }).state).toEqual(active);
    expect(act(active, { type: 'turn-ring', ring: 'destination', direction: 1 }).state).toEqual(active);
    const done = act(active, { type: 'cross' }).state;
    expect(done.transit.completed).toBe(true); expect(inventory(done)).toEqual(['notebook']);
    expect(act(done, { type: 'cross' }).state).toEqual(done);
    expect(parseSave(JSON.stringify(done))).toEqual(done);
  });
  it('does not allow transit actions to change the first room', () => {
    const s = initialState();
    for (const action of [{ type: 'transmit' }, { type: 'cross' }, { type: 'turn-ring', ring: 'destination', direction: 1 }] as Action[]) expect(act(s, action).state).toEqual(s);
  });
});

describe('save migration and crossing validation', () => {
  it('migrates unfinished v1 saves without resetting tools or position', () => {
    const { room, transit, ...s } = { ...initialState(), started: true, plate: 'inventory' };
    const migrated = parseSave(JSON.stringify({ ...s, version: 1 }));
    expect(migrated).toMatchObject({ version: 2, room: 'waystation', plate: 'inventory', position: s.position });
  });
  it('migrates departed v1 saves directly to the crossing entrance', () => {
    const { room, transit, ...s } = repaired();
    expect(parseSave(JSON.stringify({ ...s, version: 1, departed: true }))).toEqual(crossing());
  });
  it('preserves partially set routes and rejects impossible or corrupt transit states', () => {
    const s = correct(crossing());
    expect(parseSave(JSON.stringify(s))).toEqual(s);
    for (const bad of [null, { ...s.transit, destination: 4 }, { ...s.transit, beacon: .5 }, { ...s.transit, notebookRead: 'yes' }, { ...s.transit, completed: true }, { ...s.transit, active: true, destination: 0 }]) expect(parseSave(JSON.stringify({ ...s, transit: bad }))).toBeNull();
    expect(parseSave(JSON.stringify({ ...s, room: 'workshop' }))).toBeNull();
    expect(parseSave(JSON.stringify({ ...s, room: 'waystation' }))).toBeNull();
  });
});
