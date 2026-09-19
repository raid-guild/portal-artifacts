import type { Action, Result, State } from './game';

export const destinations = ['Quarry', 'Spire', 'Harbor', 'Orchard'] as const;
export const beacons = ['Hammer', 'Leaf', 'Lantern', 'Wave'] as const;
export const GUILD_ROUTE = { destination: 1, beacon: 2 } as const;
export interface Transit { destination: number; beacon: number; notebookRead: boolean; active: boolean; completed: boolean }
export const initialTransit = (): Transit => ({ destination: 0, beacon: 0, notebookRead: false, active: false, completed: false });
export const crossingEntrance = () => ({ x: 22, y: 93 });
export const routeMatches = (t: Transit) => t.destination === GUILD_ROUTE.destination && t.beacon === GUILD_ROUTE.beacon;
export const routeClue = `Spire → Lantern`;

export function crossingHint(s: State) {
  if (s.transit.active) return { speaker: 'An open invitation', text: 'The Guild has answered. Select the transit arch, then step through when you are ready.' };
  return { speaker: 'The notebook margin', text: s.transit.notebookRead ? 'Set the left ring to Spire and the right ring to Lantern, then pull the signal lever. You can keep the route sketch open beside the controls.' : 'Your notebook has more than unfinished inventions. Read its route sketch, then compare the two symbols with the pedestal rings.' };
}

/** Called with an already-cloned state; no browser or graphics dependencies. */
export function actAtCrossing(s: State, action: Action): Result {
  const say = (text: string, speaker = 'You'): Result => ({ state: s, reply: { speaker, text } });
  const t = s.transit;
  if (action.type === 'inspect') {
    switch (action.target) {
      case 'notebook':
        t.notebookRead = true;
        return say('Between sketches of a walking lantern, a route is marked “Raid Guild”: Spire, then Lantern. Underneath: “First the place. Then the light that welcomes you.”', 'Your notebook');
      case 'citadel': return say('Coral towers, hanging gardens, and what appears to be laundry strung between two impossible spires. Someone lives up there.');
      case 'rook': return say('Rook keeps one hand on the docking throttle. “Go on. I’ll keep us connected.”');
      case 'walker': return say('Four feet on the docking contacts. The repaired linkage holds steady. Your work on the road brought you here.');
      case 'inscription': return say('A worn instruction beside the dials: “First the place. Then its beacon. Pull to call.” There is a small sketch of two rings in your notebook, too.');
      case 'pedestal': return say(t.active ? 'Both rings are locked on the Guild’s address. The amber return light is steady.' : `Two brass rings and a signal lever. The left ring reads ${destinations[t.destination]}; the right reads ${beacons[t.beacon]}.`);
      case 'arch': return say(t.active ? 'Light gathers inside the arch. You can see a doorway waiting on the other side.' : 'The arch frames empty air. Its receiver is quiet. The pedestal should tell it where to connect.');
      default: return say('Those tools are packed aboard the walker. The route controls are your next task.');
    }
  }
  if (action.type === 'talk') {
    if (t.active) return say('That’s our stop. Try not to look impressed. Actually, no—go ahead. I still do.', 'Rook');
    if (action.topic === 'help') return say('Spire on the left, Lantern on the right. That’s the common workshop’s beacon. Pull the lever and someone will answer. It’s an address, not an entrance exam.', 'Rook');
    if (action.topic === 'guild') return say('See the plants hanging off the tall one? That’s home. We move. It complicates directions.', 'Rook');
    return say('I’ll hold the walker on the contacts. You set the route. Your notebook should have the address—mine has mostly tea stains.', 'Rook');
  }
  if (action.type === 'use') {
    if (action.item !== 'notebook') return say('The tools are packed. You only need the route sketch here.');
    t.notebookRead = true;
    return say(action.target === 'pedestal' || action.target === 'inscription' ? 'The sketch and the pedestal use the same symbols: Spire for the place, Lantern for the beacon.' : 'The Guild’s route is written here: Spire → Lantern. The two rings on the pedestal should match.', 'Your notebook');
  }
  if (action.type === 'turn-ring') {
    if (t.active) return say('The route is connected. Leave the rings where they are.');
    t[action.ring] = (t[action.ring] + action.direction + 4) % 4;
    return say(`${action.ring === 'destination' ? 'Place' : 'Beacon'} ring: ${action.ring === 'destination' ? destinations[t.destination] : beacons[t.beacon]}.`, 'Route pedestal');
  }
  if (action.type === 'transmit') {
    if (t.active) return say('The Guild’s beacon is already holding the route open.', 'Receiver');
    if (!routeMatches(t)) return say(t.destination === 0 && t.beacon === 0 ? '“Quarry dispatch. Stone deliveries only.” Rook raises an eyebrow. “Lovely people. Wrong stop.” Try the route in your notebook.' : t.destination === GUILD_ROUTE.destination ? 'The spire answers with a low tone, but this beacon stays dark. Check the second symbol in your notebook.' : 'A distant receiver clicks, then falls quiet. This is not the Guild’s route. Check the place and beacon in your notebook.', 'Receiver');
    t.active = true;
    return say('“Rook? We were about to come looking.” Rook leans toward the receiver. “Bring another cup. I’ve got company.” The arch fills with light.', 'The keeper');
  }
  if (action.type === 'cross') {
    if (!t.active) return say('The arch is still quiet. Set the route and send the signal first.');
    if (t.completed) return say('The Guild’s doorway is waiting. Your route is saved.');
    t.completed = true;
    return say('You step into the light beside the walker. Across the gap, someone has put another cup on the table.', 'A little further, together');
  }
  return say('The road brought you this far. The route pedestal will take you the rest of the way.');
}
