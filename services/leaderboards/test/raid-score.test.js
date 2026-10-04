import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateRaidFinish } from '../src/raid-score.js';
const base={version:'2',character:'ranger',level:'training',durationMs:15000,stats:{kills:12,elites:1,bosses:0,chests:1,level:3}};
test('Raid score derives from canonical counters and whole survival seconds',()=>{
  assert.deepEqual(validateRaidFinish(base,15000),{score:11*10+75+120+2*40+15*2,wave:null,durationMs:15000,details:{character:'ranger',realm:'training',...base.stats}});
  assert.equal(validateRaidFinish({...base,level:'forest'},15000).score,validateRaidFinish(base,15000).score);
});
test('Raid score rejects impossible or malformed telemetry',()=>{
  for(const body of [
    {...base,character:'unknown'}, {...base,level:'swamp'}, {...base,durationMs:18001}, {...base,durationMs:-1},
    {...base,stats:{...base.stats,kills:1.5}}, {...base,stats:{...base.stats,kills:99999}},
    {...base,stats:{...base.stats,elites:13}}, {...base,stats:{...base.stats,bosses:13}},
    {...base,stats:{...base.stats,level:0}}, {...base,stats:{...base.stats,chests:99}},
  ])assert.throws(()=>validateRaidFinish(body,15000));
});
