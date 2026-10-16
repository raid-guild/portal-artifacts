import {test} from 'node:test';
import assert from 'node:assert/strict';
import {setupEditorCommunity} from '../src/editor-community.js';
import {createBlankDraft,exportDraft} from '../src/editor-workbench.js';

class Element{constructor(){this.textContent='';this.value='';this.hidden=false;this.disabled=false;this.children=[];}
  replaceChildren(...children){this.children=children;}append(...children){this.children.push(...children);}}
test('editor retains retry ID after uncertain result, then clears owned association for a new draft',async()=>{
  const elements=new Map(),root={getElementById(id){if(!elements.has(id))elements.set(id,new Element());return elements.get(id);},
    createElement:()=>new Element()};
  const $=id=>root.getElementById(id),draft=createBlankDraft(),requests=[];
  const savedLocation=globalThis.location;globalThis.location={origin:'http://localhost:5180'};
  let fail=true;
  const client={session:async()=>({displayName:'Builder'}),mine:async()=>({entries:[]}),
    create:async body=>{requests.push(body);if(fail){fail=false;throw new Error('network dropped');}
      return {id:'c4ebaa2d-1d51-439b-8137-8f5007504d1e',version:1,published:true};}};
  try{const community=setupEditorCommunity({root,client,getDraft:()=>draft,exportDraft,
    validateDraft:()=>({errors:[]}),importDraft:()=>draft,loadDraft:()=>{},clearLocalLink:()=>{}});
    await new Promise(resolve=>setTimeout(resolve,0));
    await $('community-publish-button').onclick();assert.match($('community-status').textContent,/Retry will use/);
    await $('community-publish-button').onclick();assert.equal(requests.length,2);
    assert.equal(requests[0].requestId,requests[1].requestId);
    assert.equal(community.association.version,1);
    community.clearAssociation();assert.equal(community.association,null);
    assert.match($('community-linkage').textContent,/New community level/);
    community.dispose();
  }finally{globalThis.location=savedLocation;}
});
