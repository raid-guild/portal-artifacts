import { createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { GARDEN_LEVELS } from '../src/garden-level.js';

const levels=Object.fromEntries(GARDEN_LEVELS.map(level=>[level.id,{
  name:level.name,gold:level.gold.length,gems:level.gems.length,targetMs:level.targetTime*1000,
  contentId:createHash('sha256').update(JSON.stringify(level)).digest('hex').slice(0,16),
}]));
const header='// Generated from the campaign levels. Run npm run build:ranked in studies/puddle-study.\n';
const source=header+`export const PUDDLE_LEVELS = Object.freeze(${JSON.stringify(levels,null,2)});\n`;
await Promise.all([
  writeFile(new URL('../src/ranked-content.js',import.meta.url),source),
  writeFile(new URL('../../../services/leaderboards/src/puddle-content.js',import.meta.url),source),
]);
