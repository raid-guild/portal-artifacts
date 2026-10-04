import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';

const result=await build({entryPoints:['src/board-tabs.ts'],bundle:true,platform:'node',format:'esm',write:false,absWorkingDir:process.cwd()});
const {boardTabs}=await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);

test('leaderboard renders one filter for each realm plus global and legacy',()=>{
  const ids=[...boardTabs().matchAll(/data-board="([^"]+)"/g)].map(match=>match[1]);
  assert.deepEqual(ids,['all','training','forest','desert','ice','lava','archive-v2','legacy']);
  assert.equal(new Set(ids).size,ids.length);
});
