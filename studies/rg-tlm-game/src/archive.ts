import type { Action, Result, State } from './game';

export interface ArchiveState {
  shift: number;
  attempts: number;
  solved: boolean;
}

export const ARCHIVE_CIPHER = 'ZLUK AOL SHUALYU';
export const ARCHIVE_PLAINTEXT = 'SEND THE LANTERN';
export const ARCHIVE_SHIFT = 7;
export const initialArchive = (): ArchiveState => ({ shift: 0, attempts: 0, solved: false });
export const archiveEntrance = () => ({ x: 14, y: 91 });

export function decodeCaesar(text: string, shift: number) {
  return text.replace(/[A-Z]/g, letter => {
    const code = letter.charCodeAt(0) - 65;
    return String.fromCharCode(65 + (code - shift + 26) % 26);
  });
}

export function archivePreview(state: ArchiveState) {
  return decodeCaesar(ARCHIVE_CIPHER, state.shift);
}

export function archiveHint(s: State) {
  if (s.archive.solved) return { speaker: 'The lantern signal', text: 'The archive door is open. Carry the decoded instruction toward The First Raid.' };
  if (s.archive.attempts >= 2) return { speaker: 'A penciled notch', text: 'The archivist marked seven steps on the outer alphabet. Set the ring to ROT 07, then check the signal.' };
  if (s.archive.attempts === 1) return { speaker: 'A margin note', text: 'The first decoded word has four letters. Turn the ring until the message begins to read like an instruction.' };
  return { speaker: 'The archive index', text: 'A Caesar cipher shifts every letter by the same amount. Try the ring; the preview changes immediately and wrong settings cost nothing.' };
}

export function actAtArchive(s: State, action: Action): Result {
  const say = (text: string, speaker = 'The Archive'): Result => ({ state: s, reply: { speaker, text } });
  if (action.type === 'inspect') {
    switch (action.target) {
      case 'notebook': return say('Beside the sketch of the walking lantern, you copy the sealed message and leave room for its plaintext.', 'Your notebook');
      case 'archiveDesk': return say(s.archive.solved ? 'The two alphabets are aligned at ROT 07. Beneath them, the decoded instruction remains: SEND THE LANTERN.' : 'Two brass alphabets turn around one fixed message. The inner ring changes the readable preview as you rotate it.', 'Decoder desk');
      case 'archiveShelves': return say('A card names Eric Hughes’s 1993 “A Cypherpunk’s Manifesto.” Its practical lesson is underlined: cypherpunks write code—privacy becomes real when people build tools others can use.', 'Archive note');
      case 'archiveLantern': return say(s.archive.solved ? 'The lantern answers the decoded instruction with a warm pulse. A route plate slides free: THE FIRST RAID.' : 'An unlit signal lantern waits behind a small brass shutter. The sealed message appears to address it.', 'Signal lantern');
      case 'archiveDoor': return say('The Workshop is just beyond the half-open door. Nothing here can lock you in.', 'Workshop door');
    }
  }
  if (action.type === 'turn-archive-ring') {
    if (s.archive.solved) return say('The solved ring rests at ROT 07.', 'Decoder ring');
    s.archive.shift = (s.archive.shift + action.direction + 26) % 26;
    return say(`ROT ${String(s.archive.shift).padStart(2, '0')} · ${archivePreview(s.archive)}`, 'Decoder ring');
  }
  if (action.type === 'confirm-archive') {
    if (s.archive.solved) return say('The lantern is already lit. The First Raid waits beyond the archive.', 'Archive unlocked');
    if (s.archive.shift === ARCHIVE_SHIFT) {
      s.archive.solved = true;
      return say('SEND THE LANTERN. The brass shutter opens; a lantern answers with amber light, revealing a route plate stamped THE FIRST RAID.', 'Signal received');
    }
    s.archive.attempts = Math.min(25, s.archive.attempts + 1);
    return say('The letters still do not form a clear instruction. The ring stays where you left it; try another rotation.', 'No match yet');
  }
  if (action.type === 'leave-archive') {
    s.room = 'workshop';
    s.position = { x: 30, y: 88 };
    return say('You step back into the shared Workshop. The archive door remains open.', 'The Workshop');
  }
  return say('The sealed message, the turning ring, and the waiting lantern all belong to the same small mystery.');
}
