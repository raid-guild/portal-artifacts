// Controller unit test with a tiny DOM adapter; no browser or external API calls.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('controller applies mode settings, runs all baselines, and restores initial seed on reset',async()=>{
  const context=new Proxy({}, {get:()=>()=>{}});
  class Element {
    constructor(){this.value='';this.checked=false;this.children=[];this.listeners={};this.classList={toggle(){}};this.width=720;}
    addEventListener(k,f){this.listeners[k]=f;}
    replaceChildren(...c){this.children=c;}
    append(...c){this.children.push(...c);}
    add(c){this.children.push(c);}
    getContext(){return context;}
  }
  const html=await readFile(new URL('../public/index.html',import.meta.url),'utf8');
  const elements=new Map([...html.matchAll(/id="([^"]+)"/g)].map(m=>[m[1],new Element()]));
  for(const [id,value] of Object.entries({seed:'controller-test',size:'7',reliability:'0.8',loops:'0.04',mode:'semantic',task:'radio',speed:'0',rounds:'5',budget:'100','baseline-view':'dfs',tool:'wall',decisions:'0'}))elements.get(id).value=value;
  elements.get('carry').checked=true;elements.get('symbols').checked=true;
  let inspection;
  globalThis.document={getElementById(id){assert.ok(elements.has(id),`missing element ${id}`);return elements.get(id);},createElement(){return new Element();},modelContext:{registerTool(tool){inspection=tool.execute;}}};
  globalThis.window={addEventListener(){}};
  globalThis.Option=class {constructor(text,value){this.text=text;this.value=value;}};
  globalThis.fetch=async()=>({json:async()=>({configured:true,model:'mock'})});
  await import('../public/app.js');
  assert.equal(inspection({}).activeSettings.mode,'semantic');
  elements.get('reliability').value='0.5';elements.get('reliability').listeners.input();
  assert.equal(elements.get('run').disabled,true);assert.equal(elements.get('pending-settings').hidden,false);
  elements.get('generate').onclick();assert.equal(inspection({}).activeSettings.reliability,.5);
  elements.get('demo').onclick();
  const deadline=Date.now()+8000;
  while(inspection({}).running&&Date.now()<deadline)await new Promise(r=>setTimeout(r,20));
  const done=inspection({});assert.equal(done.history.length,5,elements.get('notice').textContent);
  assert.deepEqual(done.history.map(h=>h.seed),['controller-test','controller-test:2','controller-test:3','controller-test:4','controller-test:5']);
  assert.ok(done.history.every(h=>h.dfs.status==='found'&&h.random.status==='found'&&h.keyword.status==='found'));
  elements.get('reset').onclick();assert.match(elements.get('active-settings').textContent,/round 1 · controller-test$/);
  elements.get('mode').value='symbols';elements.get('mode').listeners.input();elements.get('generate').onclick();
  assert.equal(elements.get('semantic-panel').hidden,true);assert.equal(elements.get('symbol-memory').hidden,false);
});
