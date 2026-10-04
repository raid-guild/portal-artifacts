import { LEVELS } from '../../../services/leaderboards/src/raid-rules.js';

export function boardTabs() {
  return `<button data-board="all" class="active">GLOBAL</button>${Object.values(LEVELS).map(realm=>`<button data-board="${realm.id}">${realm.name.toUpperCase()}</button>`).join('')}<button data-board="archive-v2">EARLIER RUNS</button><button data-board="legacy">ORIGINAL</button>`;
}
