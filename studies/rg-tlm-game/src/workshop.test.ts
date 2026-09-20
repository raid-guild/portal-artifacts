import { describe, expect, it } from 'vitest';
import { act, hint, initialState, inventory, objective, parseSave, type Action, type State } from './game';

function workshop(): State {
  const s = initialState();
  return {
    ...s,
    started: true,
    metRook: true,
    repaired: true,
    departed: true,
    plate: 'packed',
    jack: 'packed',
    room: 'workshop',
    transit: { destination: 1, beacon: 2, notebookRead: true, active: true, completed: true },
    position: { x: 12, y: 91 },
  };
}
function play(s: State, ...actions: Action[]) { return actions.reduce((state, action) => act(state, action).state, s); }
const meetEveryone: Action[] = [
  { type: 'talk', target: 'orin' }, { type: 'talk', target: 'mica' }, { type: 'talk', target: 'sable' },
];

describe('Workshop raid assembly', () => {
  it('unlocks one durable contribution from each original role', () => {
    const s = play(workshop(), ...meetEveryone);
    expect(s.workshop).toMatchObject({ metOrin: true, metMica: true, metSable: true, brief: 'inventory', key: 'inventory', thread: 'inventory' });
    expect(inventory(s)).toEqual(['notebook', 'brief', 'key', 'thread']);
    expect(play(s, ...meetEveryone)).toEqual(s);
  });

  it('keeps wrong choices recoverable and accepts the three role dependencies in any order', () => {
    const ready = play(workshop(), ...meetEveryone);
    const mismatch = act(ready, { type: 'use', item: 'key', target: 'routeboard' });
    expect(mismatch.state).toEqual(ready);
    expect(mismatch.reply.speaker).toBe('A recoverable mismatch');
    const solved = play(ready,
      { type: 'use', item: 'thread', target: 'routeboard' },
      { type: 'use', item: 'brief', target: 'ledger' },
      { type: 'use', item: 'key', target: 'frame' },
    );
    expect(solved.workshop).toMatchObject({ brief: 'placed', key: 'placed', thread: 'placed', assembled: true, joined: false });
    expect(inventory(solved)).toEqual(['notebook']);
  });

  it('requires a complete raid before granting a place at the table', () => {
    const early = act(workshop(), { type: 'complete-raid' });
    expect(early.state.workshop.joined).toBe(false);
    const assembled = play(workshop(), ...meetEveryone,
      { type: 'use', item: 'brief', target: 'ledger' },
      { type: 'use', item: 'key', target: 'frame' },
      { type: 'use', item: 'thread', target: 'routeboard' },
    );
    const joined = act(assembled, { type: 'complete-raid' }).state;
    expect(joined.workshop.joined).toBe(true);
    expect(parseSave(JSON.stringify(joined))).toEqual(joined);
    expect(act(joined, { type: 'complete-raid' }).state).toEqual(joined);
  });

  it('advances hints and objectives from people through placement to the next raid', () => {
    const arrival = workshop();
    expect(hint(arrival).text).toContain('Keeper Orin');
    expect(objective(arrival)).toBe('Meet the crew and assemble a raid');
    const met = play(arrival, ...meetEveryone);
    expect(hint(met).text).toContain('open ledger');
    const onePlaced = act(met, { type: 'use', item: 'brief', target: 'ledger' }).state;
    expect(objective(onePlaced)).toBe('Assemble the raid · 1/3 roles connected');
    expect(hint(onePlaced).text).toContain('continuity key');
    const assembled = play(onePlaced,
      { type: 'use', item: 'key', target: 'frame' },
      { type: 'use', item: 'thread', target: 'routeboard' },
    );
    expect(objective(assembled)).toBe('Take your place at the table');
    expect(hint(assembled).text).toContain('open chair');
    const joined = act(assembled, { type: 'complete-raid' }).state;
    expect(objective(joined)).toBe('Follow the lantern signal into the Archive');
  });

  it('migrates completed v2 saves into the Workshop without losing prior progress', () => {
    const current = workshop();
    const { workshop: _workshop, ...v2 } = current;
    const migrated = parseSave(JSON.stringify({ ...v2, version: 2, room: 'crossing', position: { x: 88, y: 93 } }));
    expect(migrated).toMatchObject({ version: 4, room: 'workshop', repaired: true, departed: true, transit: current.transit });
    expect(migrated?.position).toEqual({ x: 12, y: 91 });
    expect(migrated?.workshop).toMatchObject({ assembled: false, joined: false });
    expect(migrated?.archive).toMatchObject({ shift: 0, attempts: 0, solved: false });
  });

  it('rejects impossible Workshop saves', () => {
    const s = workshop();
    const invalid = [
      { ...s, workshop: { ...s.workshop, metOrin: true, brief: 'locked' } },
      { ...s, workshop: { ...s.workshop, assembled: true } },
      { ...s, workshop: { ...s.workshop, joined: true } },
      { ...s, room: 'workshop', transit: { ...s.transit, completed: false } },
    ];
    for (const value of invalid) expect(parseSave(JSON.stringify(value))).toBeNull();
  });
});
