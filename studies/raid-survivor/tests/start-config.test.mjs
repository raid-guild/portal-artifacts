import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';

async function load(entry){const result=await build({entryPoints:[entry],bundle:true,platform:'node',format:'esm',write:false,absWorkingDir:process.cwd()});return import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);}
const {rankedStartConfig}=await load('src/start-config.ts');
const {Game}=await load('src/game.ts');
const runId='f63581b1-66d2-4428-8cd9-a260b85dc730';
test('ranked Game uses the full server snapshot when another tab changed the cached profile',()=>{
  const cached={vitality:0,agility:0,bombRecharge:0};
  const response={runId,version:'3',config:{version:'3',character:'ranger',level:'training',skills:{vitality:1,agility:1,bombRecharge:0},equippedPerk:'ranger-thorn-precision',target:{checkpointId:'training-300',thresholdMs:300000}}};
  const prepared=rankedStartConfig(response,'ranger','training');
  const game=new Game('ranger','training',prepared.config);
  assert.equal(game.player.maxHealth,105);assert.ok(game.player.speed>8.2);
  assert.deepEqual(game.mastery,response.config.skills);assert.notDeepEqual(game.mastery,cached);
  assert.equal(game.config.equippedPerk,'ranger-thorn-precision');assert.equal(game.target.checkpointId,'training-300');
  response.config.skills.vitality=0;response.config.target.thresholdMs=180000;
  assert.equal(game.mastery.vitality,1,'the active run keeps its captured skill snapshot');
  assert.equal(game.target.thresholdMs,300000,'the active run keeps its captured checkpoint target');
});
test('ranked startup rejects different classes, realms, and corrupted loadouts',()=>{
  const config={version:'3',character:'ranger',level:'forest',skills:{vitality:0,agility:0,bombRecharge:0},equippedPerk:null,target:{checkpointId:'forest-300',thresholdMs:300000}};
  assert.throws(()=>rankedStartConfig({runId,version:'3',config},'ranger','training'));
  assert.throws(()=>rankedStartConfig({runId,version:'3',config:{...config,level:'training',skills:{...config.skills,vitality:3}}},'ranger','training'));
  assert.throws(()=>rankedStartConfig({runId,version:'3',config:{...config,target:{checkpointId:'forest-300',thresholdMs:420000}}},'ranger','forest'));
  assert.throws(()=>rankedStartConfig({runId,version:'3',config:{...config,equippedPerk:'wizard-arc-focus'}},'ranger','forest'));
  assert.throws(()=>rankedStartConfig({runId:'bad',version:'3',config},'ranger','forest'));
});
test('rank two mastery is accepted for a Desert or Ice server run, while rank three is rejected',()=>{
  const response={runId,version:'3',config:{version:'3',character:'wizard',level:'ice',skills:{vitality:2,agility:0,bombRecharge:2},equippedPerk:null,target:{checkpointId:'ice-540',thresholdMs:540000}}};
  const prepared=rankedStartConfig(response,'wizard','ice');
  const game=new Game('wizard','ice',prepared.config);
  assert.equal(game.player.maxHealth,94);assert.equal(game.bombRecharge,40.5);
  response.config.skills.vitality=3;assert.throws(()=>rankedStartConfig(response,'wizard','ice'));
});
