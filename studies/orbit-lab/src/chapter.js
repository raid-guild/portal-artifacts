import { CAMPAIGN_LEVELS } from './campaign.js';

export const CHAPTER_ONE_IDS = CAMPAIGN_LEVELS.filter(level => level.chapter === 1).map(level => level.id);
export const CHAPTER_TWO_IDS = CAMPAIGN_LEVELS.filter(level => level.chapter === 2).map(level => level.id);
export const CHAPTER_THREE_IDS = CAMPAIGN_LEVELS.filter(level => level.chapter === 3).map(level => level.id);
export const CHAPTER_FOUR_IDS = CAMPAIGN_LEVELS.filter(level => level.chapter === 4).map(level => level.id);
export const ALL_CAMPAIGN_IDS = CAMPAIGN_LEVELS.map(level => level.id);
export const CHAPTERS = [
  { id: 1, label: 'CHAPTER ONE', name: 'THE FIRST SIGNAL', levelIds: CHAPTER_ONE_IDS, duration: 18, heading: 'CHAPTER ONE / TRANSMISSION', caption: 'A CALL INTO THE DARK', description: 'A small light sends a five-note call into the dark. After a silence, a sound answers from beyond the screen. Press Escape or Skip to return to the levels.' },
  { id: 2, label: 'CHAPTER TWO', name: 'FINDING THE FREQUENCY', levelIds: CHAPTER_TWO_IDS, duration: 22, heading: 'CHAPTER TWO / TRANSMISSION', caption: 'FINDING THE FREQUENCY', description: 'The light sends a new call. An answer arrives in three pulses, and the light replies in the same rhythm. Press Escape or Skip to return to the levels.' },
  { id: 3, label: 'CHAPTER THREE', name: 'THROUGH THE SILENCE', levelIds: CHAPTER_THREE_IDS, duration: 24, heading: 'CHAPTER THREE / TRANSMISSION', caption: 'A SIGNAL THROUGH THE DARK', description: 'The light sends its gathered notes, waits through a long quiet passage, and hears an answer moving toward it. Press Escape or Skip to return to the levels.' },
  { id: 4, label: 'CHAPTER FOUR', name: 'ACROSS THE DIVIDE', levelIds: CHAPTER_FOUR_IDS, duration: 20, heading: 'CHAPTER FOUR / TRANSMISSION', caption: 'ACROSS THE DIVIDE', description: 'The two lights send their calls across the divide, answer each other, and find a shared note. Press Escape or Skip to return to the levels.' },
];
export const getChapter = id => CHAPTERS.find(chapter => chapter.id === Number(id)) || CHAPTERS[0];
export const qualifiedGateFinish = mask => Number.isInteger(mask) && mask >= 1 && mask <= 7;
export function qualifiedCampaignPrefix(bestGates = {}) {
  let count = 0;
  while (count < ALL_CAMPAIGN_IDS.length && qualifiedGateFinish(bestGates?.[ALL_CAMPAIGN_IDS[count]])) count++;
  return count;
}
export function availableCampaignIds(bestGates = {}) {
  return ALL_CAMPAIGN_IDS.slice(0, Math.min(ALL_CAMPAIGN_IDS.length, qualifiedCampaignPrefix(bestGates) + 1));
}
export const campaignLevelAvailable = (id, bestGates = {}) => availableCampaignIds(bestGates).includes(Number(id));
export function chapterUnlocked(bestGates, chapterId = 1) {
  const chapter = CHAPTERS.find(item => item.id === Number(chapterId));
  return !!chapter && qualifiedCampaignPrefix(bestGates) >= ALL_CAMPAIGN_IDS.indexOf(chapter.levelIds.at(-1)) + 1;
}
// Best gates are saved only after a successful finish. Partial runs never combine.
export const earnedNotes = (bestGates, chapterId = 1) => getChapter(chapterId).levelIds.map(id => bestGates[id] === 7);
export function campaignContinuation(id, bestGates = {}) {
  if (!campaignLevelAvailable(id, bestGates)) return { type: 'levels' };
  if (!qualifiedGateFinish(bestGates?.[Number(id)])) return { type: 'retry', id: Number(id) };
  for (const chapter of CHAPTERS) {
    const index = chapter.levelIds.indexOf(Number(id));
    if (index < 0) continue;
    const nextId = chapter.levelIds[index + 1];
    return nextId === undefined ? { type: 'transmission', chapterId: chapter.id } : { type: 'level', id: nextId };
  }
  return { type: 'levels' };
}

export const TRANSMISSION_DURATION = 18;
export function transmissionEvents(notes = [], chapterId = 1) {
  if (Number(chapterId) === 4) {
    const events = [
      { at: 2, type: 'call', note: 0 },
      { at: 6, type: 'call', note: 4 },
      { at: 8, type: 'answerNote', frequency: 392 },
      { at: 8.35, type: 'answerPulse' },
      { at: 9.1, type: 'answerNote', frequency: 440 },
      { at: 9.45, type: 'answerPulse' },
      { at: 10.2, type: 'answerNote', frequency: 493.883 },
      { at: 10.55, type: 'answerPulse' },
      { at: 11.3, type: 'replyNote', frequency: 392 },
      { at: 12.1, type: 'answerNote', frequency: 440 },
      { at: 12.7, type: 'replyNote', frequency: 493.883 },
      { at: 13.2, type: 'answerPulse' },
      { at: 15.7, type: 'answerNote', frequency: 523.251 },
      { at: 15.8, type: 'replyNote', frequency: 523.251 },
      { at: 16.1, type: 'answerPulse' },
      { at: 20, type: 'end' },
    ];
    [1, 2, 3].forEach((slot, index) => { if (notes[index]) events.push({ at: 2 + slot, type: 'call', note: slot }); });
    return events.sort((a, b) => a.at - b.at);
  }
  if (Number(chapterId) === 3) {
    const events = [
      { at: 3, type: 'call', note: 0 },
      { at: 7.8, type: 'call', note: 4 },
      { at: 10.5, type: 'answerNote', frequency: 349.228 },
      { at: 10.95, type: 'answerPulse' },
      { at: 11.35, type: 'answerNote', frequency: 391.995 },
      { at: 11.8, type: 'answerPulse' },
      { at: 12.15, type: 'answerNote', frequency: 440 },
      { at: 12.55, type: 'answerPulse' },
      { at: 16, type: 'replyNote', frequency: 349.228 },
      { at: 17.1, type: 'replyNote', frequency: 391.995 },
      { at: 18.5, type: 'replyNote', frequency: 440 },
      { at: 21, type: 'answerNote', frequency: 523.251 },
      { at: 21.1, type: 'replyNote', frequency: 523.251 },
      { at: 21.25, type: 'answerPulse' },
      { at: 24, type: 'end' },
    ];
    [1, 2, 3].forEach((slot, index) => { if (notes[index]) events.push({ at: 3 + slot * 1.2, type: 'call', note: slot }); });
    return events.sort((a, b) => a.at - b.at);
  }
  if (Number(chapterId) === 2) {
    const events = [
      { at: 3, type: 'call', note: 0 },
      { at: 7.8, type: 'call', note: 4 },
      { at: 9.5, type: 'answerNote', frequency: 440 },
      { at: 9.95, type: 'answerPulse' },
      { at: 10.3, type: 'answerNote', frequency: 391.995 },
      { at: 10.75, type: 'answerPulse' },
      { at: 11.5, type: 'answerNote', frequency: 329.628 },
      { at: 11.95, type: 'answerPulse' },
      { at: 16, type: 'replyNote', frequency: 440 },
      { at: 17, type: 'replyNote', frequency: 391.995 },
      { at: 18.5, type: 'replyNote', frequency: 293.665 },
      { at: 22, type: 'end' },
    ];
    [1, 2, 3].forEach((slot, index) => { if (notes[index]) events.push({ at: 3 + slot * 1.2, type: 'call', note: slot }); });
    return events.sort((a, b) => a.at - b.at);
  }
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
