import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';

const result=await build({entryPoints:['src/checkpoint-policy.ts'],bundle:true,platform:'node',format:'esm',write:false,absWorkingDir:process.cwd()});
const {checkpointDue}=await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);

test('checkpoint snapshots wait 15 seconds, except for milestones, retries, and forced finishes',()=>{
  assert.equal(checkpointDue(false,0,0,0,false),false);
  assert.equal(checkpointDue(false,14.999,0,0,false),false);
  assert.equal(checkpointDue(false,15,0,0,false),true);
  assert.equal(checkpointDue(false,5,0,0,true),true,'threshold is immediate');
  assert.equal(checkpointDue(false,5.5,5,7,true),false,'milestone retry waits');
  assert.equal(checkpointDue(false,7,5,7,true),true);
  assert.equal(checkpointDue(true,5.5,5,7,false),true);
});
