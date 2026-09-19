import { actAtCrossing, crossingEntrance, crossingHint, initialTransit, routeMatches, type Transit } from './transit';
export type Item = 'notebook' | 'plate' | 'jack';
export type Target = 'rook' | 'walker' | 'plate' | 'jack' | 'repair' | 'shelter' | 'exit' | 'citadel' | 'inscription' | 'pedestal' | 'arch';
export type Room = 'waystation' | 'crossing';
export type Location = 'ground' | 'inventory' | 'placed' | 'packed';
export interface State {
  version: 2;
  room: Room;
  transit: Transit;
  started: boolean;
  metRook: boolean;
  plate: Location;
  jack: Location;
  repaired: boolean;
  departed: boolean;
  position: { x: number; y: number };
}
export interface Reply { speaker: string; text: string }
export interface Result { state: State; reply: Reply }
export type Action =
  | { type: 'inspect'; target: Target | 'notebook' }
  | { type: 'talk'; topic?: 'guild' | 'help' }
  | { type: 'take'; item: 'plate' | 'jack' }
  | { type: 'use'; item: Item; target: Target }
  | { type: 'operate' }
  | { type: 'leave' }
  | { type: 'turn-ring'; ring: 'destination' | 'beacon'; direction: 1 | -1 }
  | { type: 'transmit' }
  | { type: 'cross' };

export const SAVE_KEY = 'raidguild:last-mile:room-one';
export const labels: Record<Item, string> = { notebook: 'Notebook', plate: 'Cargo plate', jack: 'Screw jack' };
export const initialState = (): State => ({
  version: 2, room: 'waystation', transit: initialTransit(), started: false, metRook: false, plate: 'ground', jack: 'ground',
  repaired: false, departed: false, position: { x: 20, y: 91 },
});
export const inventory = (s: State): Item[] => ['notebook' as Item, ...(['plate', 'jack'] as const).filter(i => s[i] === 'inventory')];
export const clampPosition = (x: number, y: number, room: Room = 'waystation') => ({ x: Math.max(room === 'crossing' ? 12 : 9, Math.min(91, x)), y: Math.max(room === 'crossing' ? 91 : 85, Math.min(room === 'crossing' ? 96 : 94, y)) });
export const objective = (s: State) => s.room === 'crossing' ? s.transit.completed ? 'The Guild is waiting' : s.transit.active ? 'Step through the arch' : 'Find the Guild’s transit address' : s.repaired ? 'A ride to the Guild' : s.jack === 'placed' ? 'Lend Rook a hand' : s.plate === 'placed' ? 'Set the jack on solid ground' : s.metRook ? 'Help Rook repair the walker' : 'Find someone who knows the way';

export function hint(s: State): Reply {
  if (s.room === 'crossing') return crossingHint(s);
  if (s.repaired) return { speaker: 'A way forward', text: 'Rook promised you a ride. Talk to her, or choose the road ahead when you are ready.' };
  if (s.jack === 'placed') return { speaker: 'One more turn', text: 'Everything is in position. Select the repair point and turn the crank while Rook reseats the linkage.' };
  if (s.plate === 'placed') return { speaker: 'A steady foundation', text: 'The plate will spread the weight. Pick up the screw jack, select it in your satchel, and use it at the repair point.' };
  return { speaker: 'A closer look', text: 'The jack is too narrow for the loose sand. A broad, flat piece of metal would give it something solid to stand on. Take the cargo plate, then use it at the repair point.' };
}

export function act(state: State, action: Action): Result {
  const s = structuredClone(state);
  if (s.room === 'crossing') return actAtCrossing(s, action);
  const say = (text: string, speaker = 'You'): Result => ({ state: s, reply: { speaker, text } });
  if (action.type === 'inspect') {
    switch (action.target) {
      case 'notebook': return say('Unfinished inventions, a walking lantern that keeps falling over, and a route sketch marked with crossed swords. In the margin: “Ask for the Guild.”');
      case 'rook': return say('Rolled sleeves. A belt full of tools. The expression of someone who has already tried the obvious things.');
      case 'walker': return say(s.repaired ? 'Four steady feet and a warm light in the cabin. It looks ready to go somewhere.' : 'A cargo walker with a patched canopy and one foot buried in the sand. A small repair could take you a long way.');
      case 'shelter': return say('A little shade, an empty cup, and a bench polished by people passing through. Somebody keeps this road alive.');
      case 'exit': return say(s.repaired ? 'The road climbs toward a transit crossing. This time, you have company.' : 'The map ends here. Walking farther without directions would mostly get you more lost.');
      case 'plate': return say('Broad, flat, and much sturdier than it looks. The grip holes make it easy to carry. It could spread a heavy load over the sand.');
      case 'jack': return say(s.jack === 'placed' ? 'The jack rests securely on the plate. Its saddle sits beneath the damaged linkage. Time to turn the crank.' : 'A screw jack with a good crank and a narrow base. Sand is packed into its underside.');
      case 'repair': return say(s.repaired ? 'Rook has reseated the linkage. The walker holds its own weight now.' : s.jack === 'placed' ? 'Plate, jack, linkage. Everything is lined up. Rook is ready when you are.' : s.plate === 'placed' ? 'The plate makes a firm base. There is room for the jack between it and the linkage.' : 'A narrow hollow beneath the linkage shows where the jack sank. It needs a broader footing.');
    }
  }
  if (action.type === 'talk') {
    const first = !s.metRook;
    s.metRook = true;
    if (s.repaired) return say('That will hold. You were looking for the Guild? I’m heading home. There’s room beside the window. Ready when you are.', 'Rook');
    if (action.topic === 'guild') return say('That’s home. Makers, questionable inventions, good people. I can take you to the crossing once this stubborn thing stands up.', 'Rook');
    if (action.topic === 'help' || !first) return say(s.jack === 'placed' ? 'You turn the crank; I’ll reseat the linkage. Slowly. I’d like to keep these fingers.' : 'The linkage slipped. I need to lift the chassis, but the jack keeps sinking. Find something broad to put underneath it, then we can work together.', 'Rook');
    return say('The road to Raid Guild? Usually. Today it’s where I live. I’m Rook. If you’ve got a moment, I could use another pair of hands.', 'Rook');
  }
  if (action.type === 'take') {
    if (s[action.item] !== 'ground') return say(s[action.item] === 'inventory' ? 'Already in your satchel.' : 'It is right where it needs to be.');
    s[action.item] = 'inventory';
    return say(action.item === 'plate' ? 'You pick up the cargo plate. Broad, flat, reassuringly solid.' : 'You take the screw jack. The crank turns freely; the base is still full of sand.');
  }
  if (action.type === 'use') {
    if (!inventory(s).includes(action.item)) return say('You aren’t carrying that.');
    if (action.item === 'notebook') return say(action.target === 'rook' ? 'Crossed swords? You have the right map. Mine has more tea stains. Let’s get this walker moving and I’ll show you the way.' : 'You check the sketch. It offers directions, but no solution to heavy machinery sinking in sand.', action.target === 'rook' ? 'Rook' : 'You');
    if (s.repaired) return say('The repair is finished. Rook has packed the tools.');
    if (action.target !== 'repair' && action.target !== 'walker' && !(action.item === 'plate' && action.target === 'jack')) return say(action.target === 'rook' ? 'Keep hold of it. You can position the tools under the damaged linkage while I guide you.' : 'That won’t help here. The damaged linkage is over by the sunken foot.', action.target === 'rook' ? 'Rook' : 'You');
    if (action.item === 'plate') {
      s.plate = 'placed';
      return say('You slide the plate beneath the repair point. It spreads the weight across the sand. “That’s the idea,” says Rook.');
    }
    if (s.plate !== 'placed') return say('The jack starts to sink into the loose sand. You pull it back out. Something broad and flat needs to go underneath first.');
    s.jack = 'placed';
    return say('The jack sits firmly on the plate, its saddle beneath the linkage. Rook crouches into position. “You turn. I’ll fix.”');
  }
  if (action.type === 'operate') {
    if (s.repaired) return say('The walker is already standing. No need to lift it again.');
    if (s.plate !== 'placed' || s.jack !== 'placed') return say('You need a stable base and the jack beneath the linkage before you can lift anything.');
    s.repaired = true; s.metRook = true; s.jack = 'packed'; s.plate = 'packed';
    return say('You turn the crank. Rook reseats the linkage with a satisfying click. The walker rises, steady on all four feet. Together, you pack the tools. “Bring that notebook,” she says. “Let’s get you to the Guild.”', 'A little shared work');
  }
  if (action.type === 'leave') {
    if (!s.repaired) return say('First, help Rook get the walker standing. She knows the way from here.');
    s.departed = true;
    s.room = 'crossing'; s.position = crossingEntrance();
    return say('The walker carries you up the last ridge. Across the gap, coral towers hang in the evening light. Rook steadies the docking throttle. “There. Now we just need to knock.”', 'The crossing');
  }
  return say('There’s more to discover here.');
}

export function parseSave(raw: string | null): State | null {
  if (!raw) return null;
  try {
    const s = JSON.parse(raw);
    if (!s || ![1, 2].includes(s.version) || !['started', 'metRook', 'repaired', 'departed'].every(k => typeof s[k] === 'boolean')) return null;
    if (!['ground', 'inventory', 'placed', 'packed'].includes(s.plate) || !['ground', 'inventory', 'placed', 'packed'].includes(s.jack)) return null;
    if (!s.position || !Number.isFinite(s.position.x) || !Number.isFinite(s.position.y)) return null;
    if (s.jack === 'placed' && s.plate !== 'placed') return null;
    if (s.repaired !== (s.plate === 'packed' && s.jack === 'packed')) return null;
    if (!s.repaired && (s.plate === 'packed' || s.jack === 'packed')) return null;
    if (s.departed && !s.repaired) return null;
    if (!s.started && (s.metRook || s.repaired || s.plate !== 'ground' || s.jack !== 'ground')) return null;
    const room: Room = s.version === 1 ? s.departed ? 'crossing' : 'waystation' : s.room;
    if (!['waystation', 'crossing'].includes(room) || (room === 'crossing') !== s.departed) return null;
    const t = s.version === 1 ? initialTransit() : s.transit;
    if (!t || !['destination', 'beacon'].every(k => Number.isInteger(t[k]) && t[k] >= 0 && t[k] < 4) || !['notebookRead', 'active', 'completed'].every(k => typeof t[k] === 'boolean')) return null;
    if (t.completed && !t.active || t.active && !routeMatches(t)) return null;
    if (room === 'waystation' && (t.destination !== 0 || t.beacon !== 0 || t.notebookRead || t.active || t.completed)) return null;
    return { version: 2, room, transit: { destination: t.destination, beacon: t.beacon, notebookRead: t.notebookRead, active: t.active, completed: t.completed }, started: s.started, metRook: s.metRook, plate: s.plate, jack: s.jack, repaired: s.repaired, departed: s.departed, position: s.version === 1 && s.departed ? crossingEntrance() : clampPosition(s.position.x, s.position.y, room) };
  } catch { return null; }
}
