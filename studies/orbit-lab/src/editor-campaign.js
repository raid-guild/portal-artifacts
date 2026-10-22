import { validateLevelDocument } from './level-document.js';

// A best gate mask is recorded only after a successful portal finish.
export function campaignTemplateOptions(levels, bestGates) {
  return levels.filter(level => bestGates[level.id] === 7)
    .map(level => ({ id: level.id, title: level.title }));
}

export function createCampaignTemplate(levels, bestGates, levelId, newId = () => crypto.randomUUID()) {
  const level = levels.find(item => item.id === Number(levelId));
  if (!level || bestGates[level.id] !== 7) return null;
  const document = structuredClone(level.document);
  document.id = `custom-${newId()}`;
  document.title = `${level.title} — remix`.slice(0, 80);
  const checked = validateLevelDocument(document);
  return checked.ok ? checked.document : null;
}
