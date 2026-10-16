import {validatePublishedLevel} from './published-level-schema.js';

export const progressForLocalRun=(sim,localProgress,communityProgress)=>
  sim.localRun?.community?communityProgress:localProgress;

// The request guard is checked after each asynchronous boundary and after the
// synchronous Boolean build. A queued click gets a frame before play starts.
export async function prepareCommunityLevel(entry,{client,signal,isCurrent=()=>true,
  loadWorkbench=()=>import('./editor-workbench.js'),onReady=async()=>{},yieldFrame=()=>new Promise(resolve=>requestAnimationFrame(resolve))}={}){
  const current=()=>!signal?.aborted&&isCurrent();
  const data=await client.version(entry.id,entry.version,signal);
  if(!current())return null;
  validatePublishedLevel(data.document);
  const {importDraft,validateDraft,compileDraft}=await loadWorkbench();
  if(!current())return null;
  const draft=importDraft(JSON.stringify(data.document)),checks=validateDraft(draft);
  if(checks.errors.length)throw new Error(checks.errors[0]);
  const level=compileDraft(draft);level.editorCustom=true;level.editorCanShed=true;
  await yieldFrame();if(!current())return null;
  await onReady(level,current);
  if(!current())return null;
  return {level,data};
}
