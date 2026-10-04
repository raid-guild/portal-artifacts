import { test } from 'node:test';
import assert from 'node:assert/strict';
import {validateRaidFinish,validateV2RaidFinish,validateLegacyRaidFinish} from '../src/raid-score.js';
const base={version:'3',character:'ranger',level:'training',durationMs:15000,stats:{kills:12,elites:1,bosses:0,chests:1,level:3}};
test('v3 score derives only from canonical counters and whole survival seconds',()=>{
  assert.deepEqual(validateRaidFinish(base,15000),{score:11*10+75+120+2*40+15*2,wave:null,durationMs:15000,details:{character:'ranger',realm:'training',...base.stats}});
  assert.equal(validateRaidFinish({...base,level:'lava',character:'tavern-keeper'},15000).score,validateRaidFinish(base,15000).score);
});
test('v3 score rejects impossible or malformed telemetry',()=>{
  for(const body of [
    {...base,character:'unknown'},{...base,level:'swamp'},{...base,durationMs:18001},{...base,durationMs:-1},
    {...base,stats:{...base.stats,kills:1.5}},{...base,stats:{...base.stats,kills:99999}},
    {...base,stats:{...base.stats,elites:13}},{...base,stats:{...base.stats,bosses:13}},
    {...base,stats:{...base.stats,level:0}},{...base,stats:{...base.stats,chests:99}},
  ])assert.throws(()=>validateRaidFinish(body,15000));
});
test('v3 final-minute Moloch raises boss bound; v2 and v1 retain historical bounds',()=>{
  const latest={...base,durationMs:660000,stats:{kills:12,elites:0,bosses:8,chests:0,level:3}};
  assert.doesNotThrow(()=>validateRaidFinish(latest,660000));
  assert.throws(()=>validateRaidFinish({...latest,durationMs:659999},660000));
  assert.throws(()=>validateV2RaidFinish({...latest,version:'2'},660000));
  assert.throws(()=>validateLegacyRaidFinish({...latest,version:'1'},660000));
});
test('historical v2 and v1 validators retain old hero and realm scope',()=>{
  assert.doesNotThrow(()=>validateV2RaidFinish({...base,version:'2'},15000));
  assert.doesNotThrow(()=>validateLegacyRaidFinish({...base,version:'1'},15000));
  assert.throws(()=>validateV2RaidFinish({...base,version:'2',level:'lava'},15000));
  assert.throws(()=>validateV2RaidFinish({...base,version:'2',character:'warrior'},15000));
});
