import { PUDDLE_LEVELS } from './puddle-content.js';
export { PUDDLE_LEVELS };
export const PUDDLE_VERSION = '1';

const fail = (status, message) => Object.assign(new Error(message), { status });
export function scorePuddleRun(config, body, wallMs) {
  const { level, gold, gems, durationMs, excludedMs = 0, version } = body || {};
  if (version !== PUDDLE_VERSION || level !== config.level ||
      !Number.isInteger(gold) || gold < 0 || gold > config.gold ||
      !Number.isInteger(gems) || gems < 0 || gems > config.gems ||
      !Number.isInteger(durationMs) || durationMs < 1000 || durationMs > 2 * 60 * 60 * 1000 ||
      !Number.isInteger(excludedMs) || excludedMs < 0 || excludedMs > 2 * 60 * 60 * 1000 ||
      durationMs + excludedMs > wallMs + 3000) throw fail(400, 'This run does not match the scoring rules.');
  const total = config.gold + config.gems;
  const collected = gold + gems;
  const collectionPoints = Math.round(1000 * collected / total);
  const timePoints = 10 * Math.floor(Math.max(0, config.targetMs - durationMs) / 1000);
  return { score: collectionPoints + timePoints, durationMs, details: {
    level, gold, gems, totalGold: config.gold, totalGems: config.gems,
    targetMs: config.targetMs, collectionPercent: Math.round(100 * collected / total),
    collectionPoints, timePoints, excludedMs,
  } };
}
