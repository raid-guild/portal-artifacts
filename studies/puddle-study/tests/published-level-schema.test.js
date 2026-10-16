import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createBlankDraft,draftFromPreset,exportDraft} from '../src/editor-workbench.js';
import {validatePublishedLevel} from '../src/published-level-schema.js';
import {paintFaceForHit,paintArea} from '../src/editor-paint.js';
import {validateDraft,addDraftObject} from '../src/editor-workbench.js';

const valid=()=>JSON.parse(exportDraft(createBlankDraft()));
const add=(data,object)=>{data.draft.objects.push(object);return data;};
test('portable publication validator accepts blank and every campaign preset',()=>{
  for(const source of [createBlankDraft(),...Array.from({length:7},(_,i)=>draftFromPreset(i+1))]){
    const checked=validatePublishedLevel(JSON.parse(exportDraft(source)));
    assert.equal(checked.title,source.name);
    assert.equal(checked.goldCount,source.objects.filter(o=>o.kind==='gold').length);
    assert.equal(checked.gemCount,source.objects.filter(o=>o.kind==='gem').length);
  }
});
test('publication validator rejects unknown fields, dangerous keys, invalid references and complexity',()=>{
  assert.throws(()=>validatePublishedLevel({...valid(),remoteAsset:'https://example.test/mesh.glb'}),/unsupported field/);
  assert.throws(()=>validatePublishedLevel(JSON.parse(JSON.stringify(valid()).replace('"name":','"__proto__":{},"name":'))),/Prototype/);
  assert.throws(()=>validatePublishedLevel(add(valid(),{id:'object-3',kind:'paint',surface:'slippery',face:'floor',base:0,
    minX:0,maxX:1,minZ:0,maxZ:1,targetId:'missing'})),/missing support/);
  const duplicate=valid();duplicate.draft.objects.push({...duplicate.draft.objects[0]});
  assert.throws(()=>validatePublishedLevel(duplicate),/unique stable ID/);
  const tooMany=valid();for(let i=0;i<301;i++)tooMany.draft.objects.push({id:`gold-${i}`,kind:'gold',x:0,z:0,base:0});
  assert.throws(()=>validatePublishedLevel(tooMany),/300 objects|array is too large/);
  const huge=valid();huge.draft.name='é'.repeat(120000);
  assert.throws(()=>validatePublishedLevel(huge),/240 KB/);
  const nonfinite=valid();nonfinite.draft.objects[0].x=Infinity;
  assert.throws(()=>validatePublishedLevel(nonfinite),/nonfinite|finite/);
});
test('editor-created floor and grip paints publish with canonical attachments',()=>{
  const floor=createBlankDraft(),face=paintFaceForHit(floor,{face:'floor',x:0,y:0,z:0});
  addDraftObject(floor,'paint',{...paintArea(face,{x:0,z:0},{x:0,z:0}),'surface':'slippery'});
  assert.equal(validateDraft(floor).errors.length,0);
  assert.equal(validatePublishedLevel(JSON.parse(exportDraft(floor))).document.draft.objects.at(-1).targetId,undefined);
  const legacy=JSON.parse(exportDraft(floor));legacy.draft.objects.at(-1).targetId=null;
  assert.equal(validatePublishedLevel(legacy).document.draft.objects.at(-1).targetId,undefined);
  const grip=draftFromPreset(5),host=grip.objects.find(o=>o.kind==='grip');
  const r=host.ramp,x=(r.minX+r.maxX)/2,z=(r.minZ+r.maxZ)/2;
  const y=r.axis==='x'?(r.minHeight+r.maxHeight)/2:(r.northHeight+r.southHeight)/2;
  const ramp=paintFaceForHit(grip,{face:'floor',targetId:host.id,part:'ramp',x,y,z});
  assert.equal(ramp.part,'ramp');addDraftObject(grip,'paint',{...paintArea(ramp),'surface':'sticky'});
  validatePublishedLevel(JSON.parse(exportDraft(grip)));
  const p=host.platform,platform=paintFaceForHit(grip,{face:'floor',targetId:host.id,part:'platform',
    x:(p.minX+p.maxX)/2,y:p.maxY,z:(p.minZ+p.maxZ)/2});
  assert.equal(platform.part,'platform');addDraftObject(grip,'paint',{...paintArea(platform),'surface':'sticky'});
  validatePublishedLevel(JSON.parse(exportDraft(grip)));
});
test('attached basin and paint require compatible real support geometry',()=>{
  const data=valid();data.draft.objects.push({id:'block-1',kind:'block',minX:-1,maxX:1,minY:0,maxY:1.5,minZ:-1,maxZ:1});
  data.draft.objects.push({id:'basin-1',kind:'basin',type:'funnel',x:0,z:0,radius:.45,bottomRadius:.2,
    depth:.2,base:1.5,targetId:'block-1'});
  validatePublishedLevel(data);
  const startTarget=structuredClone(data);startTarget.draft.objects.at(-1).targetId='object-1';
  assert.throws(()=>validatePublishedLevel(startTarget),/solid horizontal support/);
  const edge=structuredClone(data);edge.draft.objects.at(-1).x=.8;
  assert.throws(()=>validatePublishedLevel(edge),/fit entirely/);
  const paint=structuredClone(data);paint.draft.objects.push({id:'paint-1',kind:'paint',surface:'sticky',face:'floor',
    minX:-.5,maxX:.5,minZ:-.5,maxZ:.5,base:1.5,targetId:'object-1'});
  assert.throws(()=>validatePublishedLevel(paint),/paintable support/);
});
test('backend and browser publication validators are byte identical',async()=>{
  const source=await readFile(new URL('../src/published-level-schema.js',import.meta.url),'utf8');
  const backend=await readFile(new URL('../../../services/leaderboards/src/puddle-level-schema.js',import.meta.url),'utf8');
  assert.equal(backend,source);
});
