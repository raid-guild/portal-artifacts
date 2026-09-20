import { describe, expect, it } from 'vitest';
import { ARCHIVE_CIPHER, ARCHIVE_PLAINTEXT, archivePreview, decodeCaesar } from './archive';
import { act, hint, initialState, objective, parseSave, type Action, type State } from './game';

function archive(): State {
  const s = initialState();
  return {
    ...s,
    started: true,
    metRook: true,
    repaired: true,
    departed: true,
    plate: 'packed',
    jack: 'packed',
    room: 'archive',
    transit: { destination: 1, beacon: 2, notebookRead: true, active: true, completed: true },
    workshop: { metOrin: true, metMica: true, metSable: true, brief: 'placed', key: 'placed', thread: 'placed', assembled: true, joined: true },
    position: { x: 14, y: 91 },
  };
}

function play(s: State, ...actions: Action[]) { return actions.reduce((state, action) => act(state, action).state, s); }

describe('Cypherpunk Archive ROT room', () => {
  it('decodes the approved plaintext with the shared Caesar behavior', () => {
    expect(decodeCaesar(ARCHIVE_CIPHER, 7)).toBe(ARCHIVE_PLAINTEXT);
    expect(decodeCaesar('ABC XYZ', 3)).toBe('XYZ UVW');
  });

  it('wraps the ring in either direction and does not mutate prior state', () => {
    const start = archive();
    const backward = act(start, { type: 'turn-archive-ring', direction: -1 }).state;
    expect(backward.archive.shift).toBe(25);
    expect(start.archive.shift).toBe(0);
    expect(act(backward, { type: 'turn-archive-ring', direction: 1 }).state.archive.shift).toBe(0);
  });

  it('keeps wrong rotations recoverable and advances the hint path', () => {
    const wrong = act(archive(), { type: 'confirm-archive' }).state;
    expect(wrong.archive).toMatchObject({ shift: 0, attempts: 1, solved: false });
    expect(hint(wrong).text).toContain('four letters');
    const wrongAgain = act(wrong, { type: 'confirm-archive' }).state;
    expect(hint(wrongAgain).text).toContain('ROT 07');
  });

  it('opens the lantern only at ROT 07 and keeps completion idempotent', () => {
    const turns = Array.from({ length: 7 }, (): Action => ({ type: 'turn-archive-ring', direction: 1 }));
    const aligned = play(archive(), ...turns);
    expect(archivePreview(aligned.archive)).toBe(ARCHIVE_PLAINTEXT);
    const solved = act(aligned, { type: 'confirm-archive' }).state;
    expect(solved.archive.solved).toBe(true);
    expect(objective(solved)).toBe('The First Raid awaits');
    expect(act(solved, { type: 'confirm-archive' }).state).toEqual(solved);
    expect(parseSave(JSON.stringify(solved))).toEqual(solved);
  });

  it('can return to the Workshop without losing decoder progress', () => {
    const turned = act(archive(), { type: 'turn-archive-ring', direction: 1 }).state;
    const returned = act(turned, { type: 'leave-archive' }).state;
    expect(returned.room).toBe('workshop');
    expect(returned.archive.shift).toBe(1);
  });

  it('migrates a completed v3 Workshop save without losing prior progress', () => {
    const current = archive();
    const { archive: _archive, ...v3 } = current;
    const migrated = parseSave(JSON.stringify({ ...v3, version: 3, room: 'workshop', position: { x: 30, y: 88 } }));
    expect(migrated).toMatchObject({ version: 4, room: 'workshop', workshop: current.workshop, archive: { shift: 0, attempts: 0, solved: false } });
  });

  it('rejects impossible Archive saves', () => {
    const s = archive();
    const invalid = [
      { ...s, archive: { ...s.archive, shift: 26 } },
      { ...s, archive: { ...s.archive, attempts: -1 } },
      { ...s, archive: { ...s.archive, solved: true, shift: 3 } },
      { ...s, workshop: { ...s.workshop, joined: false } },
    ];
    for (const value of invalid) expect(parseSave(JSON.stringify(value))).toBeNull();
  });
});
