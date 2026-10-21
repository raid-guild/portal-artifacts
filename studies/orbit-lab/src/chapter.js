import { CAMPAIGN_LEVELS } from './campaign.js';

export const CHAPTER_IDS = CAMPAIGN_LEVELS.map(level => level.id);
export const chapterUnlocked = completed => completed.has(CHAPTER_IDS.at(-1));
// Best gates are saved only after a successful finish. Partial runs never combine.
export const earnedNotes = bestGates => CHAPTER_IDS.map(id => bestGates[id] === 7);

export const TRANSMISSION_DURATION = 18;
export function transmissionEvents(notes = []) {
  const events = [
    { at: 1, type: 'call', note: 0 },
    { at: 6.4, type: 'call', note: 4 },
    { at: 10.2, type: 'answerSound' },
    { at: 10.95, type: 'answerPulse' },
    { at: TRANSMISSION_DURATION, type: 'end' },
  ];
  [1, 2, 3].forEach((slot, index) => { if (notes[index]) events.push({ at: 1 + slot * 1.35, type: 'call', note: slot }); });
  return events.sort((a, b) => a.at - b.at);
}

export function crossedEvents(events, previous, current) {
  return events.filter(event => previous < event.at && event.at <= current);
}
