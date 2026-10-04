import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';

async function load(entry){const result=await build({entryPoints:[entry],bundle:true,platform:'node',format:'esm',write:false,absWorkingDir:process.cwd()});return import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);}
const {rankedStartConfig}=await load('src/start-config.ts');
const {Game}=await load('src/game.ts');
const runId='f63581b1-66d2-4428-8cd9-a260b85dc730';
test('ranked Game uses the server mastery snapshot when another tab changed the cached profile',()=>{
  const cached={vitality:0,agility:0,bombRecharge:0};
  const response={runId,version:'2',config:{version:'2',character:'ranger',level:'training',skills:{vitality:1,agility:1,bombRecharge:0}}};
  const prepared=rankedStartConfig(response,'ranger','training');
  const game=new Game('ranger','training',prepared.mastery);
  assert.equal(game.player.maxHealth,105);assert.ok(game.player.speed>8.2);
  assert.deepEqual(game.mastery,response.config.skills);assert.notDeepEqual(game.mastery,cached);
  response.config.skills.vitality=0;assert.equal(game.mastery.vitality,1,'the active run keeps its captured snapshot');
});
test('ranked startup rejects a response for a different class, realm, or invalid skills',()=>{
  const config={version:'2',character:'ranger',level:'forest',skills:{vitality:0,agility:0,bombRecharge:0}};
  assert.throws(()=>rankedStartConfig({runId,version:'2',config},'ranger','training'));
  assert.throws(()=>rankedStartConfig({runId,version:'2',config:{...config,level:'training',skills:{...config.skills,vitality:3}}},'ranger','training'));
  assert.throws(()=>rankedStartConfig({runId:'bad',version:'2',config},'ranger','forest'));
});
test('rank two mastery is accepted for a Desert or Ice server run, while rank three is rejected',()=>{
  const response={runId,version:'2',config:{version:'2',character:'wizard',level:'ice',skills:{vitality:2,agility:0,bombRecharge:2}}};
  const prepared=rankedStartConfig(response,'wizard','ice');
  const game=new Game('wizard','ice',prepared.mastery);
  assert.equal(game.player.maxHealth,94);assert.equal(game.bombRecharge,40.5);
  response.config.skills.vitality=3;assert.throws(()=>rankedStartConfig(response,'wizard','ice'));
});
