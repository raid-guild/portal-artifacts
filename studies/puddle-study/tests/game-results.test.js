import test from 'node:test';
import assert from 'node:assert/strict';
import {GARDEN_LEVELS} from '../src/garden-level.js';
import {campaignResultLines} from '../src/game-results.js';

test('campaign results use each floor’s collectible totals, including older three-gem scores',()=>{
  const scores={1:{gems:3,gold:17,totalGold:17},
    6:{gems:6,gold:36,totalGold:36,totalGems:6}};
  const lines=campaignResultLines(GARDEN_LEVELS,scores,6).split('\n');
  assert.equal(lines.length,2);
  assert.equal(lines[0],'Gathering Garden: 3/3 gems · 17/17 gold · 100% collected · 100.0 collection + 0 time = 100% · Legacy time unknown');
  assert.equal(lines[1],'Hollow Crown: 6/6 gems · 36/36 gold · 100% collected · 100.0 collection + 0 time = 100% · Legacy time unknown');
});
