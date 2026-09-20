import type { Action, Item, Result, State, Target, WorkshopNpc } from './game';
import { archiveEntrance } from './archive';

export type WorkshopItemLocation = 'locked' | 'inventory' | 'placed';
export interface WorkshopState {
  metOrin: boolean;
  metMica: boolean;
  metSable: boolean;
  brief: WorkshopItemLocation;
  key: WorkshopItemLocation;
  thread: WorkshopItemLocation;
  assembled: boolean;
  joined: boolean;
}

export const initialWorkshop = (): WorkshopState => ({
  metOrin: false, metMica: false, metSable: false,
  brief: 'locked', key: 'locked', thread: 'locked', assembled: false, joined: false,
});
export const workshopEntrance = () => ({ x: 12, y: 91 });

const roles: Record<WorkshopNpc, { name: string; met: 'metOrin' | 'metMica' | 'metSable'; item: 'brief' | 'key' | 'thread'; intro: string; repeat: string }> = {
  orin: {
    name: 'Keeper Orin', met: 'metOrin', item: 'brief',
    intro: '“Welcome. A raid begins with the promise, not the tools.” Orin gives you a blank brief with one clear need: carry a signal across the wind gap without losing it.',
    repeat: '“Keep the need visible. Clever work that forgets its promise is only decoration.”',
  },
  mica: {
    name: 'Mica · Builder', met: 'metMica', item: 'key',
    intro: '“I can make the signal frame hold—but only if we know what it must carry.” Mica places a brass continuity key in your hand.',
    repeat: '“The key belongs in the signal frame. It proves the handoff can survive the crossing.”',
  },
  sable: {
    name: 'Sable · Strategist', met: 'metSable', item: 'thread',
    intro: '“A working thing still needs a way through the world.” Sable unspools a teal route thread, measured from the workshop to the far beacon.',
    repeat: '“Set the route thread into the board. Context, build, route—that is a raid, not three errands.”',
  },
};
const correctTarget: Record<'brief' | 'key' | 'thread', Target> = { brief: 'ledger', key: 'frame', thread: 'routeboard' };
const itemNames: Record<'brief' | 'key' | 'thread', string> = { brief: 'raid brief', key: 'continuity key', thread: 'route thread' };

export function workshopHint(s: State) {
  const w = s.workshop;
  if (w.joined) return { speaker: 'The next page', text: 'A lantern mark now glows above the archive door. Follow it before The First Raid begins.' };
  if (w.assembled) return { speaker: 'A place at the table', text: 'The raid is assembled. Return to the shared table and take the open chair.' };
  if (!w.metOrin || !w.metMica || !w.metSable) {
    const missing = !w.metOrin ? 'Keeper Orin' : !w.metMica ? 'Mica at the workbench' : 'Sable by the map shelves';
    return { speaker: 'Start with people', text: `Talk with ${missing}. Each role holds one part of the raid.` };
  }
  const unplaced = w.brief !== 'placed' ? 'The raid brief defines the need; place it in the open ledger.' : w.key !== 'placed' ? 'The continuity key belongs in the brass signal frame.' : 'The route thread belongs on the route board.';
  return { speaker: 'Connect the roles', text: unplaced };
}

export function actAtWorkshop(s: State, action: Action): Result {
  const w = s.workshop;
  const say = (text: string, speaker = 'You'): Result => ({ state: s, reply: { speaker, text } });
  if (action.type === 'inspect') {
    switch (action.target) {
      case 'notebook': return say('The little walking lantern is still unfinished. Here, that feels less like a failure and more like an invitation.', 'Your notebook');
      case 'orin': return say('Silver hair, round spectacles, and an apron built for a lifetime of useful questions. Orin keeps the shared promise in view.');
      case 'mica': return say('Copper curls, a compact tool belt, and careful hands. Mica turns ideas into things that survive contact with reality.');
      case 'sable': return say('An ochre scarf and a weathered map case. Sable studies routes, risks, and the people a plan must reach.');
      case 'ledger': return say(w.brief === 'placed' ? 'The need is written plainly: carry a stable signal across the wind gap.' : 'An open ledger waits for the raid’s purpose—the context every other role will share.');
      case 'frame': return say(w.key === 'placed' ? 'The brass key closes the circuit. The signal frame gives a clear, steady pulse.' : 'A brass signal frame with one empty continuity socket. Mica’s station is ready to build.');
      case 'routeboard': return say(w.thread === 'placed' ? 'The teal thread marks a safe handoff from this workshop to the far beacon.' : 'Three inset channels cross the route board. One measured thread would turn possibility into a path.');
      case 'table': return say(w.assembled ? 'Purpose, build, and route now meet at one table. The empty chair is still empty—but not for long.' : 'A shared surface worn smooth by maps, cups, mistakes, and second attempts. Three stations wait to be connected.');
      case 'window': return say('Far below, the salt road catches the last light. The distance you crossed looks smaller from a room where people expect you.');
    }
  }
  if (action.type === 'talk' && action.target) {
    const role = roles[action.target];
    const alreadyMet = w[role.met];
    if (!alreadyMet) {
      w[role.met] = true;
      w[role.item] = 'inventory';
    }
    return say(alreadyMet ? role.repeat : role.intro, role.name);
  }
  if (action.type === 'use') {
    if (action.item === 'notebook') {
      if (action.target === 'orin') return say('Orin studies the sketch of the falling lantern. “Good. It is honest about what it cannot do yet. That gives a raid somewhere to begin.”', 'Keeper Orin');
      if (action.target === 'mica') return say('Mica grins at the lantern’s crooked legs. “I know three ways to fix that and two entertaining ways to make it worse.”', 'Mica · Builder');
      if (action.target === 'sable') return say('Sable traces the lantern’s route sketch. “Who needs its light, and what stands between them? Answer that and the path appears.”', 'Sable · Strategist');
      return say('The unfinished lantern belongs to another raid. First, assemble the signal crossing on the table.', 'Your notebook');
    }
    if (!(['brief', 'key', 'thread'] as Item[]).includes(action.item)) return say('Those road tools have done their part. The Workshop needs context, a build, and a route.');
    const item = action.item as 'brief' | 'key' | 'thread';
    if (w[item] !== 'inventory') return say(w[item] === 'placed' ? `The ${itemNames[item]} is already doing its part.` : `Talk with the role who carries the ${itemNames[item]} first.`);
    if (action.target !== correctTarget[item]) {
      const correction = item === 'brief' ? 'The build needs this context, but the open ledger is where everyone can share it.' : item === 'key' ? 'The key does not describe the route. Its shape matches the signal frame’s socket.' : 'The thread measures a path. Try the route board rather than the machinery.';
      return say(correction, 'A recoverable mismatch');
    }
    w[item] = 'placed';
    w.assembled = w.brief === 'placed' && w.key === 'placed' && w.thread === 'placed';
    if (w.assembled) return say('The brief names the need. The key steadies the signal. The thread carries it safely across the gap. Three roles become one small raid—and the far beacon answers.', 'The assembled raid');
    const remaining = [w.brief, w.key, w.thread].filter(value => value !== 'placed').length;
    return say(`You set the ${itemNames[item]} into place. The station holds. ${remaining} role${remaining === 1 ? '' : 's'} still need to connect.`, 'The shared table');
  }
  if (action.type === 'complete-raid') {
    if (!w.assembled) return say('The chair can wait. Connect the context, build, and route first—no one joins by pretending the work is done.', 'Keeper Orin');
    if (w.joined) return say('Your cup, notebook, and chair are still here. A lantern mark glows over the archive door.', 'The Workshop');
    w.joined = true;
    return say('Orin turns the open chair toward you. Mica makes room for your notebook; Sable adds your route to the map. A lantern mark wakes above the archive door. “One message before your first raid,” Orin says.', 'A place at the table');
  }
  if (action.type === 'enter-archive') {
    if (!w.joined) return say('The archive opens to Guild members. Finish assembling the raid and take your place first.', 'Archive door');
    s.room = 'archive';
    s.position = archiveEntrance();
    return say('The archive is cool and quiet. One brass decoder waits beneath a sealed message; beyond it, an unlit lantern.', 'The Cypherpunk Archive');
  }
  return say('Listen to the crew, gather what each role knows, and connect their work at the shared table.', 'The Workshop');
}
