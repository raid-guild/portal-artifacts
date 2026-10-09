import {GARDEN_LEVELS,gardenColliders} from './garden-level.js';
import {PuddleSimulation} from './simulation.js';
import {commitEditorSolid} from './editor-solid.js';
import {solidInside,solidRay,disposeEditorSolid} from './editor-solid-physics.js';
import {groundAt} from './colliders.js';
import {DEFAULT_TARGET_TIME,CAMPAIGN_TARGETS} from './game-score.js';

const copy=value=>JSON.parse(JSON.stringify(value));
const finite=n=>typeof n==='number'&&Number.isFinite(n)&&Math.abs(n)<=1000;
const point=o=>o&&finite(o.x)&&finite(o.z);
const nextId=draft=>{
  const used=new Set((Array.isArray(draft.objects)?draft.objects:[]).map(o=>o.id));
  let n=Number.isSafeInteger(draft.nextObjectId)&&draft.nextObjectId>0?draft.nextObjectId:1;
  while(used.has(`object-${n}`))n++;
  draft.nextObjectId=n+1;
  return `object-${n}`;
};

// Imported and locally saved drafts may be unfinished, but their board must
// always be safe to compile and sample before the inspector can repair them.
function boardErrors(draft){
  const errors=[],b=draft?.boundary,t=draft?.terrain;
  if(!b||b.type!=='boundary'||!['minX','maxX','minZ','maxZ'].every(k=>finite(b[k]))||
    b.minX>=b.maxX||b.minZ>=b.maxZ)errors.push('The board needs finite, positive boundaries.');
  if(!t||!['flat','switchback','depth-terraces'].includes(t.type))return [...errors,'Choose a valid floor.'];
  const bounds=o=>o&&['minX','maxX'].every(k=>finite(o[k]))&&o.minX<o.maxX;
  const steps=(list,axis,amount)=>Array.isArray(list)&&list.length>0&&list.length<=16&&
    list.every(s=>s&&finite(s[axis])&&finite(s[amount])&&s[amount]>0&&finite(s.width)&&s.width>0);
  if(t.type==='flat'&&!finite(t.height))errors.push('Flat floor height must be finite.');
  if(t.type==='switchback'){
    if(!finite(t.upperHeight)||!finite(t.frontZ)||!bounds(t.stairs)||
      !finite(t.stairs?.endZ)||!steps(t.stairs?.steps,'z','drop'))
      errors.push('The switchback needs finite terrace and stair dimensions.');
    if(t.startTier&&(!bounds(t.startTier)||!finite(t.startTier.minZ)||!finite(t.startTier.maxZ)||
      t.startTier.minZ>=t.startTier.maxZ||!steps(t.startTier.steps,'x','rise')))
      errors.push('The starting tier needs finite bounds and steps.');
  }
  if(t.type==='depth-terraces'){
    if(!finite(t.frontHeight)||!finite(t.middleHeight)||!finite(t.frontZ)||!finite(t.rearZ)||
      ![-1,1].includes(t.descendZ??-1)||
      !['leftStairs','rightStairs'].every(key=>{const s=t[key];return bounds(s)&&
        finite(s.startZ)&&finite(s.endZ)&&steps(s.steps,'z','drop');}))
      errors.push('The terraces need finite heights and both complete stair runs.');
  }
  return errors;
}
function circleTouchesBox(o,box){
  const x=Math.max(box.minX,Math.min(o.x,box.maxX)),z=Math.max(box.minZ,Math.min(o.z,box.maxZ));
  return Math.hypot(o.x-x,o.z-z)<o.radius;
}
function solidFootprint(o){
  if(['block','lowgap','legacy-roof','legacy-passage'].includes(o.kind))return o;
  if(o.kind==='grip')return o.platform;
  if(o.kind==='stairs'&&finite(o.x)&&finite(o.z)&&finite(o.run)&&finite(o.width)){
    const hx=(o.axis==='x'?o.run:o.width)/2,hz=(o.axis==='z'?o.run:o.width)/2;
    return {minX:o.x-hx,maxX:o.x+hx,minZ:o.z-hz,maxZ:o.z+hz};
  }
  return null;
}
export function unsupportedFunnelAt(draft,x,z,radius){
  const circle={x,z,radius};
  return draft.objects.some(o=>{
    const rect=solidFootprint(o);
    return rect&&['minX','maxX','minZ','maxZ'].every(k=>finite(rect[k]))&&circleTouchesBox(circle,rect);
  });
}
function raisedFixtureError(objects){
  const draft={objects};
  return objects.some(o=>(['exit','pressure-basin'].includes(o.kind)||o.kind==='basin'&&!o.targetId)&&
    point(o)&&finite(o.radius)&&unsupportedFunnelAt(draft,o.x,o.z,o.radius))?
    'Place exits and basins on open terrain, away from raised structures.':null;
}
function raisedBasinError(level,objects){
  for(const o of objects.filter(item=>item.kind==='basin'&&item.targetId)){
    const host=objects.find(item=>item.id===o.targetId);
    const horizontal=host?.kind==='block'?{inside:contains(host,o.x,o.z),top:host.maxY}:
      host?.kind==='pillar'?{inside:Math.hypot(o.x-host.x,o.z-host.z)<=host.radius,
        top:(host.base??0)+host.height}:
      host?.kind==='legacy-roof'||host?.kind==='legacy-passage'?
        {inside:contains(host,o.x,o.z),top:host.top}:
      host?.kind==='grip'?{inside:contains(host.platform,o.x,o.z),top:host.platform.maxY}:null;
    if(!horizontal?.inside||!finite(o.base)||o.base<=0||
      Math.abs(horizontal.top-o.base)>.08||!level.csgSolid)
      return 'A raised basin needs the horizontal top of its attached block or pillar.';
    const solid=level.csgSolid,below=o.base-o.depth-.07;
    if(!solidInside(solid,o.x,below,o.z))
      return 'The raised basin needs enough solid thickness below its clay floor.';
    for(let i=0;i<16;i++){
      const a=i*Math.PI/8,x=o.x+Math.cos(a)*(o.radius+.075),z=o.z+Math.sin(a)*(o.radius+.075);
      if(!solidInside(solid,x,o.base-.075,z))
        return 'The raised basin needs a full solid rim away from edges and other cuts.';
    }
  }
  return null;
}

export function createBlankDraft(){
  return {name:'New garden',presetId:0,boundary:{type:'boundary',minX:-9,maxX:9,minZ:-6,maxZ:4.8},
    terrain:{type:'flat',height:0},totalFlesh:297,startingFlesh:65,targetTime:DEFAULT_TARGET_TIME,tendrils:true,
    nextObjectId:3,objects:[
      {id:'object-1',kind:'start',x:7,z:-2.6},
      {id:'object-2',kind:'exit',type:'funnel',x:-7,z:2.6,radius:.95,bottomRadius:.36,depth:.9},
    ]};
}

export function draftFromPreset(id){
  if(id==='hazards'){
    const draft=createBlankDraft();draft.name='Hazards garden';draft.presetId=0;draft.targetTime=45;
    draft.objects.push({id:'object-3',kind:'pit',x:0,z:-2.3,radius:.85},
      {id:'object-4',kind:'paint',surface:'lava',face:'floor',minX:-4.5,maxX:-3,minZ:-1.8,maxZ:0,base:0},
      {id:'object-5',kind:'flesh',x:4,z:1.6,weight:1},
      {id:'object-6',kind:'gold',x:2,z:2.4},
      {id:'object-7',kind:'gem',x:-5.8,z:2.4});
    draft.nextObjectId=8;return draft;
  }
  const source=GARDEN_LEVELS[id-1];if(!source)throw new Error('Choose a garden preset (1–7).');
  const l=copy(source),draft={name:l.name,presetId:id,boundary:l.boundary,terrain:l.terrain,
    totalFlesh:l.capacity,startingFlesh:l.seedCount,targetTime:CAMPAIGN_TARGETS[id-1],tendrils:true,nextObjectId:1,objects:[]};
  const add=(kind,props,id)=>draft.objects.push({id:id||nextId(draft),kind,...copy(props)});
  add('start',{x:l.start.x,z:l.start.z,...(l.start.y!==undefined?{base:l.start.y}:{})});add('exit',l.exit);
  l.pools.forEach(([x,z,base],i)=>add('flesh',{x,z,...(base!==undefined?{base}:{}),weight:l.poolCounts?.[i]??58}));
  l.gems.forEach(g=>add('gem',g));l.gold.forEach(([x,z,base])=>add('gold',{x,z,...(base!==undefined?{base}:{})}));
  if(id===6||id===7){
    for(const p of l.posts||[])add('pillar',{x:p.x,z:p.z,radius:p.radius,height:p.height},p.sourceId);
    for(const c of l.editorFixtures){
      if(c.type==='box')add('block',{minX:c.minX,maxX:c.maxX,minZ:c.minZ,maxZ:c.maxZ,
        minY:c.minY,maxY:c.maxY},c.sourceId);
      else if(c.type==='roof')add('block',{role:'crown-roof',minX:c.minX,maxX:c.maxX,
        minZ:c.minZ,maxZ:c.maxZ,minY:c.bottom,maxY:c.top,
        ...(c.approachBothSides?{approachBothSides:true}:{})},c.sourceId);
      else if(c.type==='editor-stairs')add('stairs',{x:(c.minX+c.maxX)/2,z:(c.minZ+c.maxZ)/2,
        axis:c.axis,reverse:c.reverse,run:c.maxZ-c.minZ,width:c.maxX-c.minX,
        rise:c.rise,steps:c.steps,base:c.base},c.sourceId);
      else if(c.type==='sticky-wall')add('paint',{surface:'sticky',face:c.face,
        minX:c.minX,maxX:c.maxX,minZ:c.minZ,maxZ:c.maxZ,minY:c.minY,maxY:c.maxY,
        base:c.minY,targetId:c.targetId|| (c.sourceId==='spire-grip'?'spire':
          c.sourceId==='west-recovery'?'west-middle':'recover-west-middle')},c.sourceId);
      else if(c.type==='slip'||c.type==='lava')add('paint',{surface:c.type==='lava'?'lava':'slippery',face:'floor',minX:c.minX,
        maxX:c.maxX,minZ:c.minZ,maxZ:c.maxZ,base:c.base,
        ...(c.targetId?{targetId:c.targetId}:{})},c.sourceId);
    }
    if(id===7)for(const pit of l.pits||[])add('pit',{x:pit.x,z:pit.z,radius:pit.radius},pit.sourceId);
    if(l.basin)add('pressure-basin',l.basin);
    if(l.gate)add('pressure-gate',l.gate);
    return draft;
  }
  for(const post of l.posts||[])add('pillar',post);
  if(l.roof)add('legacy-roof',l.roof);
  if(id===1&&l.roof)for(const z of [l.roof.minZ-.14,l.roof.maxZ+.14])
    add('block',{role:'roof-support',type:'box',minX:l.roof.minX-.1,maxX:l.roof.maxX+.1,
      minY:0,maxY:l.roof.top,minZ:z-.14,maxZ:z+.14});
  if(l.passage)add('legacy-passage',l.passage);
  if(l.basin)add('pressure-basin',l.basin);
  if(l.gate)add('pressure-gate',l.gate);
  for(const channel of l.channels||[])add('basin',channel);
  if(l.castingBank)add('casting-bank',l.castingBank);
  if(l.grip)add('grip',l.grip);
  if(l.slip)add('slippery',l.slip);
  return draft;
}

export function allocateFlesh(total,starting,pools){
  if(!pools.length)return [];
  const spare=Math.max(0,Math.round(total-starting)),weights=pools.map(p=>Math.max(.001,p.weight??1));
  const sum=weights.reduce((a,b)=>a+b,0),floats=weights.map(w=>spare*w/sum),counts=floats.map(Math.floor);
  let left=spare-counts.reduce((a,b)=>a+b,0);
  const order=floats.map((v,i)=>({i,rest:v-counts[i]})).sort((a,b)=>b.rest-a.rest||a.i-b.i);
  for(let i=0;i<left;i++)counts[order[i].i]++;
  return counts;
}

function gapColliders(o){
  const axis=o.axis==='x'?'x':'z',width=Math.max(.12,o.supportWidth??.16);
  const roof={type:'roof',minX:o.minX,maxX:o.maxX,minZ:o.minZ,maxZ:o.maxZ,bottom:o.bottom,top:o.top};
  const make=(lo,hi)=>axis==='z'?{type:'box',minX:o.minX,maxX:o.maxX,minY:o.base??0,maxY:o.top,minZ:lo,maxZ:hi}:
    {type:'box',minX:lo,maxX:hi,minY:o.base??0,maxY:o.top,minZ:o.minZ,maxZ:o.maxZ};
  return [roof,...(axis==='z'?[make(o.minZ,o.minZ+width),make(o.maxZ-width,o.maxZ)]:
    [make(o.minX,o.minX+width),make(o.maxX-width,o.maxX)])].map(c=>({...c,sourceId:o.id}));
}

function stairColliders(o){
  const axis=o.axis==='z'?'z':'x',half=o.width/2;
  return [{type:'editor-stairs',axis,reverse:!!o.reverse,steps:Math.max(1,Math.min(12,Math.round(o.steps||4))),
    minX:axis==='x'?o.x-o.run/2:o.x-half,maxX:axis==='x'?o.x+o.run/2:o.x+half,
    minZ:axis==='z'?o.z-o.run/2:o.z-half,maxZ:axis==='z'?o.z+o.run/2:o.z+half,
    base:o.base??0,rise:o.rise,sourceId:o.id}];
}

function paintOwner(paint,objects){
  if(!paint.targetId)return null;
  const o=objects.find(item=>item.id===paint.targetId);if(!o)return null;
  if(o.kind==='block')return {type:'box',minX:o.minX,maxX:o.maxX,minZ:o.minZ,maxZ:o.maxZ,
    minY:o.minY??0,maxY:o.maxY};
  if(o.kind==='pillar')return {type:'cylinder',x:o.x,z:o.z,radius:o.radius,
    base:o.base??0,height:(o.base??0)+o.height};
  if(o.kind==='stairs')return stairColliders(o)[0];
  if(o.kind==='lowgap')return {type:'roof',minX:o.minX,maxX:o.maxX,minZ:o.minZ,maxZ:o.maxZ,
    bottom:o.bottom,top:o.top};
  if(o.kind==='legacy-roof'||o.kind==='legacy-passage')return {type:'roof',minX:o.minX,maxX:o.maxX,
    minZ:o.minZ,maxZ:o.maxZ,bottom:o.bottom,top:o.top};
  if(o.kind==='grip')return paint.part==='platform'||!paint.part&&Math.abs((o.platform.maxY??0)-paint.base)<.2?
    {...o.platform,type:'box'}:{...o.ramp,type:'grip-ramp'};
  return null;
}

export function compileDraft(draft){
  const d=copy(draft),objects=d.objects||[],pools=objects.filter(o=>o.kind==='flesh');
  const raisedBasins=objects.filter(o=>o.kind==='basin'&&o.targetId);
  const wallPaint=[];
  const start=objects.find(o=>o.kind==='start'),exit=objects.find(o=>o.kind==='exit');
  const counts=allocateFlesh(d.totalFlesh,d.startingFlesh,pools);
  const level={id:d.presetId||0,name:d.name,boundary:d.boundary,terrain:d.terrain,
    targetTime:d.targetTime??DEFAULT_TARGET_TIME,pits:objects.filter(o=>o.kind==='pit').map(o=>
      ({type:'pit',x:o.x,z:o.z,radius:o.radius,sourceId:o.id,
        rimHeight:groundAt(o.x+o.radius+.02,o.z,[d.terrain]).height})),
    editorCustom:!d.presetId,editorCanShed:true,capacity:d.totalFlesh,seedCount:d.startingFlesh,
    tendrils:true,start:start?{x:start.x,z:start.z,...(start.base!==undefined?{y:start.base}:{})}:null,
    exit:exit?{type:'funnel',x:exit.x,z:exit.z,radius:exit.radius,bottomRadius:exit.bottomRadius,depth:exit.depth}:null,
    pools:pools.map(o=>o.base===undefined?[o.x,o.z]:[o.x,o.z,o.base]),poolCounts:counts,
    gems:objects.filter(o=>o.kind==='gem').map(o=>({x:o.x,z:o.z,...(o.base!==undefined?{base:o.base}:{})})),
    gold:objects.filter(o=>o.kind==='gold').map(o=>o.base===undefined?[o.x,o.z]:[o.x,o.z,o.base]),
    labels:objects.filter(o=>o.kind==='label').map(o=>({id:o.id,text:o.text,x:o.x,z:o.z,
      base:o.base,offset:o.offset})),editorFixtures:[]};
  for(const o of objects){
    switch(o.kind){
      case 'pillar':{const post={type:'cylinder',x:o.x,z:o.z,radius:o.radius,
        height:(o.base??0)+o.height,...(o.base?{base:o.base}:{}),...(o.sourceId?{sourceId:o.sourceId}:{})};
        Object.defineProperty(post,'editorId',{value:o.id});(level.posts??=[]).push(post);break;}
      case 'legacy-roof':level.roof={type:'roof',minX:o.minX,maxX:o.maxX,minZ:o.minZ,maxZ:o.maxZ,bottom:o.bottom,top:o.top};
        Object.defineProperty(level.roof,'sourceId',{value:o.id});
        Object.defineProperty(level.roof,'editorId',{value:o.id});break;
      case 'legacy-passage':level.passage={type:'roof',minX:o.minX,maxX:o.maxX,minZ:o.minZ,maxZ:o.maxZ,bottom:o.bottom,top:o.top,
          ...(o.approachBothSides?{approachBothSides:true}:{})};
        Object.defineProperty(level.passage,'sourceId',{value:o.id});
        Object.defineProperty(level.passage,'editorId',{value:o.id});break;
      case 'pressure-basin':level.basin={type:'funnel',x:o.x,z:o.z,radius:o.radius,bottomRadius:o.bottomRadius,depth:o.depth,holdsFeedstock:true};break;
      case 'pressure-gate':level.gate={x:o.x,width:o.width,height:o.height,opening:o.opening,minZ:o.minZ,maxZ:o.maxZ,
        threshold:o.threshold,releaseThreshold:o.releaseThreshold,rate:o.rate,base:o.base,...(o.latch?{latch:true}:{})};break;
      case 'basin':(level.channels??=[]).push({type:'funnel',x:o.x,z:o.z,radius:o.radius,
        bottomRadius:o.bottomRadius,depth:o.depth,...(o.targetId?{raised:true,base:o.base,targetId:o.targetId}:{})});break;
      case 'casting-bank':level.castingBank={x:o.x,z:o.z};break;
      case 'grip':level.grip={ramp:o.ramp,platform:o.platform,climbHeight:o.climbHeight};
        Object.defineProperty(level.grip.platform,'sourceId',{value:o.id});
        Object.defineProperty(level.grip.ramp,'editorId',{value:o.id});
        Object.defineProperty(level.grip.platform,'editorId',{value:o.id});break;
      case 'slippery':level.slip={type:'slip',minX:o.minX,maxX:o.maxX,minZ:o.minZ,maxZ:o.maxZ};break;
      case 'block':(o.role==='roof-support'?(level.roofSupports??=[]):level.editorFixtures).push(
        o.role==='crown-roof'?{type:'roof',minX:o.minX,maxX:o.maxX,minZ:o.minZ,maxZ:o.maxZ,
          bottom:o.minY,top:o.maxY,...(o.approachBothSides?{approachBothSides:true}:{}),sourceId:o.id}:
          {type:'box',minX:o.minX,maxX:o.maxX,minZ:o.minZ,maxZ:o.maxZ,minY:o.minY??0,maxY:o.maxY,
            ...(o.role==='roof-support'?{}:{walkableTop:true,sourceId:o.id})});break;
      case 'lowgap':level.editorFixtures.push(...gapColliders(o));break;
      case 'stairs':level.editorFixtures.push(...stairColliders(o));break;
      case 'paint':if(o.surface==='sticky'&&o.face&&o.face!=='floor')wallPaint.push(o);
        else level.editorFixtures.push({type:o.surface==='slippery'?'slip':o.surface==='lava'?'lava':'sticky-paint',
          minX:o.minX,maxX:o.maxX,minZ:o.minZ,maxZ:o.maxZ,face:'floor',base:o.base??0,
          sourceId:o.id,targetId:o.targetId||null,owner:paintOwner(o,objects)});break;
    }
  }
  for(const paint of wallPaint){
    const boxes=[...level.editorFixtures.filter(c=>c.type==='box'||c.type==='roof'),
      ...[level.roof,level.passage,level.grip?.platform].filter(Boolean)];
    for(const box of boxes){
      if(paint.targetId&&box.sourceId!==paint.targetId)continue;
      const minX=Math.max(box.minX,paint.minX),maxX=Math.min(box.maxX,paint.maxX),
        minZ=Math.max(box.minZ,paint.minZ),maxZ=Math.min(box.maxZ,paint.maxZ);
      if(minX>=maxX||minZ>=maxZ)continue;
      const minY=Math.max(box.minY??box.bottom??0,paint.minY??paint.base??0),
        maxY=Math.min(box.maxY??box.top,paint.maxY??box.maxY??box.top);
      if(maxY-minY<.02)continue;
      level.editorFixtures.push({type:'sticky-wall',sourceId:paint.id,targetId:paint.targetId||null,face:paint.face,axis:['east','west'].includes(paint.face)?'x':'z',
        minX,maxX,minZ,maxZ,minY,maxY});
    }
  }
  const cutters=objects.filter(o=>o.kind==='cutter');
  if(cutters.length||raisedBasins.length){
    level.editorCutters=cutters;
    const solids=[];
    const include=c=>{if(c){c.csgManaged=true;solids.push(c);}};
    include(level.roof);include(level.passage);
    for(const c of level.roofSupports||[])include(c);
    for(const c of level.posts||[])include(c);
    for(const c of level.editorFixtures)if(['box','roof','editor-stairs'].includes(c.type))include(c);
    if(level.grip){include(level.grip.platform);include(level.grip.ramp);}
    // Passage end supports are physical even though the authored descriptor
    // stores only the long lintel. Include them before Boolean subtraction.
    if(level.passage&&level.gate)for(const [z0,z1] of [[level.passage.minZ,level.passage.minZ+.16],
      [level.passage.maxZ-.16,level.passage.maxZ]])solids.push({type:'box',minX:level.passage.minX,
      maxX:level.passage.maxX,minY:0,maxY:level.passage.top,minZ:z0,maxZ:z1});
    const bowls=raisedBasins.map(o=>({shape:'frustum',x:o.x,z:o.z,
      y:o.base-o.depth/2+.025,height:o.depth+.05,radius:o.radius+.008,
      bottomRadius:o.bottomRadius,rotation:{x:0,y:0,z:0}}));
    level.csgSolid=commitEditorSolid(solids,[...cutters,...bowls]);
    // Keep editable ownership separate from the fused triangles. A ray hit on
    // a surviving wall or a newly cut cavity still belongs to its source.
    level.csgSources=objects.flatMap(o=>{
      const owned=c=>({...c,sourceId:o.id});
      if(o.kind==='block')return [owned({type:'box',minX:o.minX,maxX:o.maxX,minY:o.minY??0,maxY:o.maxY,minZ:o.minZ,maxZ:o.maxZ})];
      if(o.kind==='pillar')return [owned({type:'cylinder',x:o.x,z:o.z,radius:o.radius,base:o.base??0,height:(o.base??0)+o.height})];
      if(o.kind==='lowgap')return gapColliders(o).map(owned);
      if(o.kind==='stairs')return stairColliders(o).map(owned);
      if(o.kind==='legacy-roof'||o.kind==='legacy-passage')return [owned({type:'roof',minX:o.minX,maxX:o.maxX,
        minZ:o.minZ,maxZ:o.maxZ,bottom:o.bottom,top:o.top})];
      if(o.kind==='grip')return [owned(o.ramp),owned(o.platform)];
      return [];
    });
  }
  return level;
}

export function validateDraft(draft){
  const errors=[],warnings=[];
  if(!draft||typeof draft!=='object')return {errors:['Not a garden draft.'],warnings};
  if(typeof draft.name!=='string'||!draft.name.trim()||draft.name.length>60)errors.push('Give this garden a name of up to 60 characters.');
  if(!Array.isArray(draft.objects)||draft.objects.length>300)errors.push('Keep no more than 300 objects.');
  if(!Number.isInteger(draft.totalFlesh)||draft.totalFlesh<17||draft.totalFlesh>297||
    !Number.isInteger(draft.startingFlesh)||draft.startingFlesh<17||draft.startingFlesh>draft.totalFlesh)
    errors.push('Use 17–297 total flesh, with 17 or more starting particles within that total.');
  if(!finite(draft.targetTime??DEFAULT_TARGET_TIME)||(draft.targetTime??DEFAULT_TARGET_TIME)<=0||
    (draft.targetTime??DEFAULT_TARGET_TIME)>600)errors.push('Target time must be from 1 to 600 seconds.');
  errors.push(...boardErrors(draft));
  const objects=Array.isArray(draft.objects)?draft.objects:[],ids=new Set();
  const known=new Set(['start','exit','flesh','gem','gold','pillar','legacy-roof','legacy-passage',
    'pressure-basin','pressure-gate','basin','casting-bank','grip','slippery','block','lowgap','stairs','paint','pit','cutter','label']);
  for(const o of objects){
    if(!known.has(o.kind))errors.push('Unknown object type cannot be play-tested.');
    if(typeof o.id!=='string'||!o.id||ids.has(o.id))errors.push('Every object needs a unique stable ID.');
    ids.add(o.id);
    for(const [key,value] of Object.entries(o))if(typeof value==='number'&&!finite(value))errors.push(`${o.kind} has an unsafe ${key}.`);
    if('x'in o&&'z'in o&&!point(o))errors.push(`${o.kind} needs finite coordinates.`);
    if(['block','lowgap','paint'].includes(o.kind)&&!(finite(o.minX)&&finite(o.maxX)&&finite(o.minZ)&&finite(o.maxZ)&&o.minX<o.maxX&&o.minZ<o.maxZ))errors.push(`${o.kind} needs a positive footprint.`);
    if(o.kind==='block'&&!(finite(o.maxY)&&o.maxY>(o.minY??0)))errors.push('Block top must be above its base.');
    if(o.kind==='lowgap'&&!(finite(o.bottom)&&finite(o.top)&&o.bottom>0&&o.top>o.bottom))errors.push('The low gap needs positive clearance and height.');
    if(o.kind==='stairs'&&!(finite(o.run)&&o.run>.2&&finite(o.width)&&o.width>.2&&
      finite(o.rise)&&o.rise>.1&&Number.isInteger(o.steps)&&o.steps>=1&&o.steps<=12))
      errors.push('Ramps need a positive run, width, rise, and 1–12 visual divisions.');
    if(o.kind==='paint'&&!['sticky','slippery','lava'].includes(o.surface))errors.push('Choose sticky, slippery, or lava paint.');
    if(o.kind==='pit'&&!(finite(o.radius)&&o.radius>=.35&&o.radius<=2))errors.push('Pit radius must be from 0.35 to 2.');
    if(['exit','basin','pressure-basin'].includes(o.kind)&&!(finite(o.radius)&&finite(o.bottomRadius)&&finite(o.depth)&&
      o.radius>.25&&o.bottomRadius>.1&&o.bottomRadius<o.radius&&o.depth>.05))
      errors.push(`${o.kind} needs a positive rim, bottom, and depth.`);
    if(o.kind==='pillar'&&!(finite(o.radius)&&o.radius>.08&&finite(o.height)&&o.height>.08))
      errors.push('Pillar radius and height must be positive.');
    if(['legacy-roof','legacy-passage'].includes(o.kind)&&!(finite(o.bottom)&&finite(o.top)&&o.bottom>.08&&o.top>o.bottom))
      errors.push('Roof clearance and top height must be positive.');
    if(o.kind==='paint'&&(!(finite(o.base)&&o.base>=0)||!['floor','north','south','east','west'].includes(o.face)))
      errors.push('Paint needs a valid support height and face.');
    if(o.kind==='paint'&&o.surface==='slippery'&&o.face!=='floor')
      errors.push('Slippery paint belongs on walkable floors and tops.');
    if(o.kind==='paint'&&o.surface==='lava'&&o.face!=='floor')
      errors.push('Lava paint belongs on walkable floors and tops.');
    if(o.kind==='stairs'&&!['x','z'].includes(o.axis))errors.push('Ramp direction must be on a board axis.');
    if(o.kind==='grip'&&(!o.ramp||!o.platform||!finite(o.platform.maxY)||!finite(o.platform.minY)||
      o.platform.maxY<=o.platform.minY))errors.push('Grip needs a real ramp and raised platform.');
    if(o.kind==='cutter'&&(!['box','cylinder'].includes(o.shape)||!finite(o.y)||
      !finite(o.height)||o.height<=.08||o.height>20||
      !['x','y','z'].every(k=>finite(o.rotation?.[k]))||
      (o.shape==='box'&&(!finite(o.width)||o.width<=.08||!finite(o.depth)||o.depth<=.08))||
      (o.shape==='cylinder'&&(!finite(o.radius)||o.radius<=.04))))
      errors.push('A cutter needs finite XYZ position, rotation, and positive dimensions.');
    if(o.kind==='label'&&(typeof o.text!=='string'||o.text.length>120||!o.text.trim()||
      !point(o)||!finite(o.base)||!finite(o.offset)||o.offset<0||o.offset>8))
      errors.push('Labels need text up to 120 characters, a valid position, and a safe height.');
  }
  if(objects.filter(o=>o.kind==='start').length!==1)errors.push('Place one start point before play-testing.');
  if(objects.filter(o=>o.kind==='exit').length!==1)errors.push('Place one exit before play-testing.');
  if(!errors.length){
    let level;
    try{level=compileDraft(draft);}catch(error){errors.push(`Cut could not be committed: ${error.message}`);return {errors,warnings};}
    const b=level.boundary;
    if(objects.some(o=>o.kind==='cutter')&&!level.csgSolid)
      errors.push('Add a solid block, pillar, stair, ramp, or low gap for the cutter.');
    for(const o of objects)if(point(o)&&(o.x<b.minX+.15||o.x>b.maxX-.15||o.z<b.minZ+.15||o.z>b.maxZ-.15))
      errors.push(`${o.kind} is outside the playable board.`);
    for(const o of objects)if(['block','lowgap','legacy-roof','legacy-passage'].includes(o.kind)&&
      [o.minX,o.maxX,o.minZ,o.maxZ].every(finite)&&
      (o.minX<b.minX-.001||o.maxX>b.maxX+.001||o.minZ<b.minZ-.001||o.maxZ>b.maxZ+.001))
      errors.push(`${o.kind} must fit inside the playable board.`);
    if(level.start&&level.exit&&Math.hypot(level.start.x-level.exit.x,level.start.z-level.exit.z)<level.exit.radius+.3)
      errors.push('Move the start away from the exit.');
    if(draft.totalFlesh-draft.startingFlesh<(draft.objects||[]).filter(o=>o.kind==='flesh').length)
      errors.push('Add enough loose flesh to give each pool a particle.');
    const raisedError=raisedFixtureError(objects);if(raisedError)errors.push(raisedError);
    const basinError=raisedBasinError(level,objects);if(basinError)errors.push(basinError);
    const terrainOnly=objects.filter(o=>o.kind==='pit');
    for(const pit of terrainOnly){
      const margin=pit.radius+.12;
      if(pit.x-margin<b.minX||pit.x+margin>b.maxX||pit.z-margin<b.minZ||pit.z+margin>b.maxZ)
        errors.push('Keep each pit fully inside the board.');
      const center=groundAt(pit.x,pit.z,[level.terrain]).height;
      for(let i=0;i<16;i++){const angle=i*Math.PI/8,x=pit.x+Math.cos(angle)*margin,z=pit.z+Math.sin(angle)*margin;
        if(Math.abs(groundAt(x,z,[level.terrain]).height-center)>.06)
          errors.push('Keep each pit entirely on one flat terrace.');}
      for(const item of objects){if(item===pit||item.kind==='paint'||item.kind==='label')continue;
        if(point(item)&&Math.hypot(item.x-pit.x,item.z-pit.z)<pit.radius+(item.radius??(item.kind==='start'?.45:.2))+.08)
          errors.push('Keep pits clear of starts, exits, basins, and other placed objects.');
        const footprint=solidFootprint(item);
        if(footprint&&circleTouchesBox({x:pit.x,z:pit.z,radius:pit.radius+.08},footprint))
          errors.push('Keep pits away from raised fixtures.');
        if(item.kind==='pillar'&&Math.hypot(item.x-pit.x,item.z-pit.z)<pit.radius+item.radius+.08)
          errors.push('Keep pits away from raised fixtures.');
      }
    }
    for(const o of objects.filter(o=>o.kind==='paint'&&o.surface==='sticky'&&o.face!=='floor'))
      if(!level.editorFixtures.some(c=>c.type==='sticky-wall'&&c.sourceId===o.id))
        errors.push('Place wall paint across a real block face before play-testing.');
  }
  return {errors:[...new Set(errors)],warnings};
}

export function exportDraft(draft){return JSON.stringify({format:'puddle-level',version:3,draft},null,2);}
export function importDraft(text){
  if(text.length>250000)throw new Error('Level file is too large.');
  const data=JSON.parse(text);
  if(data.format!=='puddle-level')throw new Error('This is not a Puddle level.');
  let draft;
  if(data.version===1){const old=data.level;if(!old||!GARDEN_LEVELS.some(l=>l.id===old.id))throw new Error('Unsupported version 1 level.');
    const unsafe=boardErrors(old);if(unsafe.length)throw new Error(unsafe.join(' '));
    // Migration retains the imported author's values, rather than silently
    // replacing them with today's campaign preset.
    draft=draftFromLegacy(copy(old));
  }else if(data.version===2||data.version===3)draft=copy(data.draft);
  else throw new Error('Use a version 1, 2, or 3 Puddle level file.');
  if(!draft||!Array.isArray(draft.objects))throw new Error('The level draft is missing its objects.');
  const unsafe=boardErrors(draft);if(unsafe.length)throw new Error(unsafe.join(' '));
  const raisedError=raisedFixtureError(draft.objects);if(raisedError)throw new Error(raisedError);
  if(!Number.isSafeInteger(draft.nextObjectId)||draft.nextObjectId<1)
    draft.nextObjectId=1;
  while(draft.objects.some(o=>o.id===`object-${draft.nextObjectId}`))draft.nextObjectId++;
  return draft;
}

function draftFromLegacy(level){
  const draft=draftFromPreset(level.id);
  draft.name=level.name;draft.boundary=copy(level.boundary);draft.terrain=copy(level.terrain);
  draft.totalFlesh=level.capacity;draft.startingFlesh=level.seedCount;draft.tendrils=true;
  const from=(kind)=>draft.objects.filter(o=>o.kind===kind);
  Object.assign(from('start')[0],level.start);Object.assign(from('exit')[0],level.exit);
  for(const [kind,values] of [['flesh',level.pools],['gem',level.gems],['gold',level.gold]]){
    const list=from(kind);if(list.length!==values.length){draft.objects=draft.objects.filter(o=>o.kind!==kind);
      values.forEach((value,i)=>draft.objects.push({id:nextId(draft),kind,
        ...(Array.isArray(value)?{x:value[0],z:value[1]}:copy(value)),...(kind==='flesh'?{weight:level.poolCounts?.[i]??58}:{})}));}
    else values.forEach((value,i)=>Object.assign(list[i],Array.isArray(value)?{x:value[0],z:value[1]}:value,
      kind==='flesh'?{weight:level.poolCounts?.[i]??58}:{}));
  }
  for(const [kind,values] of [['pillar',level.posts||[]],['basin',level.channels||[]]]){
    draft.objects=draft.objects.filter(o=>o.kind!==kind);
    values.forEach(value=>draft.objects.push({id:nextId(draft),kind,...copy(value)}));
  }
  for(const [kind,value] of [['legacy-roof',level.roof],['legacy-passage',level.passage],['pressure-basin',level.basin],
    ['pressure-gate',level.gate],['casting-bank',level.castingBank],['grip',level.grip],['slippery',level.slip]]){
    draft.objects=draft.objects.filter(o=>o.kind!==kind);
    if(value)draft.objects.push({id:nextId(draft),kind,...copy(value)});
  }
  if(level.id===1){
    draft.objects=draft.objects.filter(o=>o.role!=='roof-support');
    if(level.roof)for(const z of [level.roof.minZ-.14,level.roof.maxZ+.14])
      draft.objects.push({id:nextId(draft),kind:'block',role:'roof-support',type:'box',
        minX:level.roof.minX-.1,maxX:level.roof.maxX+.1,minY:0,maxY:level.roof.top,minZ:z-.14,maxZ:z+.14});
  }
  return draft;
}

export class DraftHistory{
  constructor(draft){this.states=[copy(draft)];this.index=0;}
  commit(draft){const next=copy(draft);if(JSON.stringify(next)===JSON.stringify(this.states[this.index]))return;
    this.states=this.states.slice(0,this.index+1);this.states.push(next);if(this.states.length>80)this.states.shift();this.index=this.states.length-1;}
  undo(){this.index=Math.max(0,this.index-1);return copy(this.states[this.index]);}
  redo(){this.index=Math.min(this.states.length-1,this.index+1);return copy(this.states[this.index]);}
}

export function addDraftObject(draft,kind,props){const object={id:nextId(draft),kind,...copy(props)};draft.objects.push(object);return object;}
export function placedObjectDefaults(kind,p){
  const {x,z}=p,base=Math.max(0,p.y||0);
  switch(kind){
    case 'pillar':return {x,z,radius:.42,height:.75,base};
    case 'block':return {minX:x-.55,maxX:x+.55,minZ:z-.55,maxZ:z+.55,minY:base,maxY:base+1};
    case 'lowgap':return {minX:x-.9,maxX:x+.9,minZ:z-.75,maxZ:z+.75,bottom:base+.35,top:base+1.25,base,axis:'z',supportWidth:.16};
    case 'stairs':return {x,z,axis:'x',reverse:false,run:1.4,width:1.5,rise:1.08,steps:4,base};
    case 'flesh':return {x,z,weight:1};
    case 'gem':case 'gold':return {x,z};
    case 'start':return {x,z,base};
    case 'label':return {x,z,base,text:'New label',offset:.45};
    case 'exit':return {type:'funnel',x,z,radius:.95,bottomRadius:.36,depth:.9};
    case 'basin':return {type:'funnel',x,z,radius:.85,bottomRadius:.45,depth:.32,
      ...(p.targetId?{base:p.y,targetId:p.targetId}:{})};
    case 'pit':return {x,z,radius:.75};
    case 'cutter-box':return {shape:'box',x,y:base+.5,z,width:1.4,height:1,depth:1.4,
      rotation:{x:0,y:0,z:0}};
    case 'cutter-cylinder':return {shape:'cylinder',x,y:base+.5,z,radius:.45,height:1,
      rotation:{x:0,y:0,z:0}};
  }
  return null;
}
export function draftPosition(object){
  if(!object)return null;
  if(finite(object.x)&&finite(object.z))return {x:object.x,z:object.z};
  if(object.kind==='pressure-gate')return {x:object.x,z:(object.minZ+object.maxZ)/2};
  const rect=object.kind==='grip'?object.platform:object;
  if(finite(rect?.minX)&&finite(rect?.minZ))return {x:(rect.minX+rect.maxX)/2,z:(rect.minZ+rect.maxZ)/2};
  return null;
}
const contains=(c,x,z)=>x>=c.minX&&x<=c.maxX&&z>=c.minZ&&z<=c.maxZ;
function sourceAt(level,hit){
  const candidates=(level.csgSources||[]).filter(c=>{
    const low=c.minY??c.base??c.bottom??c.minHeight??c.northHeight??0,
      high=c.maxY??c.height??c.top??Math.max(c.maxHeight??0,c.southHeight??0,(c.base??0)+(c.rise??0));
    return hit.y>=low-.07&&hit.y<=high+.07&&
      (c.type==='cylinder'?Math.hypot(hit.x-c.x,hit.z-c.z)<=c.radius+.05:contains(c,hit.x,hit.z));
  });
  candidates.sort((a,b)=>{
    const area=c=>(c.maxX-c.minX)*(c.maxZ-c.minZ)||Math.PI*c.radius*c.radius;
    return area(a)-area(b);
  });
  return candidates[0]?.sourceId||null;
}
export function highestDraftSupport(draft,x,z,excludedId=null){
  const without={...draft,objects:draft.objects.filter(o=>o.id!==excludedId&&o.targetId!==excludedId)};
  const level=compileDraft(without),colliders=gardenColliders(level);
  let best={height:groundAt(x,z,[level.terrain]).height,targetId:null};
  const accept=(height,targetId)=>{if(Number.isFinite(height)&&height>best.height+.02)best={height,targetId:targetId||null};};
  for(const c of colliders){
    if(c.csgControl)continue;
    if(c.type==='editor-solid-mesh'){
      const hit=solidRay(c,{x,y:20,z},{x:0,y:-1,z:0},40);
      if(hit?.normal?.y>.35)accept(hit.y,sourceAt(level,hit));
    }else if(c.type==='cylinder'&&Math.hypot(x-c.x,z-c.z)<=c.radius)
      accept(c.height,c.editorId||c.sourceId);
    else if((c.type==='box'||c.type==='roof')&&contains(c,x,z))
      accept(c.type==='roof'?c.top:c.maxY,c.sourceId||c.editorId);
    else if(c.type==='editor-stairs'&&contains(c,x,z))
      accept(groundAt(x,z,[c]).height,c.sourceId);
    else if(c.type==='grip-ramp'&&contains(c,x,z))
      accept(c.axis==='x'?c.minHeight+(c.maxHeight-c.minHeight)*(x-c.minX)/(c.maxX-c.minX):
        c.northHeight+(c.southHeight-c.northHeight)*(z-c.minZ)/(c.maxZ-c.minZ),c.editorId);
  }
  if(level.csgSolid)disposeEditorSolid(level.csgSolid.revision);
  return best;
}
export function snapDraftObjectToHighest(draft,id){
  const o=draft.objects.find(item=>item.id===id),position=draftPosition(o);
  if(!o||!position)return {ok:false,reason:'Select a positioned object first.'};
  if(o.kind==='cutter')return {ok:false,reason:'Cutters use Center Y; place them freely in 3D.'};
  if(['exit','pressure-basin','paint','pressure-gate'].includes(o.kind))
    return {ok:false,reason:'This object does not support height snapping.'};
  const support=highestDraftSupport(draft,position.x,position.z,id),next=support.height;
  if(o.kind==='block'){const delta=next-(o.minY??0);o.minY=(o.minY??0)+delta;o.maxY+=delta;}
  else if(o.kind==='pillar'||o.kind==='stairs'||o.kind==='start'||o.kind==='label')o.base=next;
  else if(o.kind==='lowgap'){const delta=next-(o.base??0);o.base=next;o.bottom+=delta;o.top+=delta;}
  else if(o.kind==='basin'){if(support.targetId){o.base=next;o.targetId=support.targetId;}
    else{delete o.base;delete o.targetId;}}
  else return {ok:false,reason:'This object does not support height snapping.'};
  if(o.kind==='block')alignAttachedBasinHeight(draft,id,o.maxY);
  if(o.kind==='pillar')alignAttachedBasinHeight(draft,id,o.base+o.height);
  return {ok:true,height:next,targetId:support.targetId};
}
const shiftRect=(o,dx,dz)=>{o.minX+=dx;o.maxX+=dx;o.minZ+=dz;o.maxZ+=dz;};
const attachedPaint=(draft,id)=>draft.objects.filter(o=>o.kind==='paint'&&o.targetId===id);
const attachedBasins=(draft,id)=>draft.objects.filter(o=>o.kind==='basin'&&o.targetId===id);
export function alignAttachedBasinHeight(draft,id,height){
  for(const basin of attachedBasins(draft,id))basin.base=height;
}
export function resizeDraftFootprint(draft,id,dimension,size){
  const o=draft.objects.find(item=>item.id===id);if(!o||!finite(size)||size<=0)return false;
  const before=solidFootprint(o);if(!before)return false;
  const old={minX:before.minX,maxX:before.maxX,minZ:before.minZ,maxZ:before.maxZ};
  if(o.kind==='stairs'){
    if(!['run','width'].includes(dimension))return false;o[dimension]=size;
  }else{
    const part=o.kind==='grip'?o.platform:o;
    const low=dimension==='width'?'minX':dimension==='depth'?'minZ':null,
      high=dimension==='width'?'maxX':dimension==='depth'?'maxZ':null;
    if(!low||!finite(part[low])||!finite(part[high]))return false;
    const center=(part[low]+part[high])/2;part[low]=center-size/2;part[high]=center+size/2;
  }
  const after=solidFootprint(o),scaleX=(after.maxX-after.minX)/(old.maxX-old.minX),
    scaleZ=(after.maxZ-after.minZ)/(old.maxZ-old.minZ);
  for(const coat of attachedPaint(draft,id)){
    if(o.kind==='grip'&&(coat.part==='ramp'||!coat.part&&Math.abs((coat.base??0)-o.platform.maxY)>.2))continue;
    const minX=after.minX+(coat.minX-old.minX)*scaleX,
      maxX=after.minX+(coat.maxX-old.minX)*scaleX,
      minZ=after.minZ+(coat.minZ-old.minZ)*scaleZ,
      maxZ=after.minZ+(coat.maxZ-old.minZ)*scaleZ;
    Object.assign(coat,{minX,maxX,minZ,maxZ});
  }
  for(const basin of attachedBasins(draft,id)){
    basin.x=after.minX+(basin.x-old.minX)*scaleX;
    basin.z=after.minZ+(basin.z-old.minZ)*scaleZ;
  }
  return true;
}
const rotateRect=(o,cx,cz)=>{const minX=cx-(o.maxZ-cz),maxX=cx-(o.minZ-cz),
  minZ=cz+(o.minX-cx),maxZ=cz+(o.maxX-cx);
  Object.assign(o,{minX,maxX,minZ,maxZ});};
export function moveDraftObject(draft,id,x,z){const object=draft.objects.find(o=>o.id===id);if(!object)return false;
  if(object.kind==='grip'){
    const center=draftPosition(object),dx=x-center.x,dz=z-center.z;
    for(const part of [object.ramp,object.platform])for(const key of ['minX','maxX'])part[key]+=dx;
    for(const part of [object.ramp,object.platform])for(const key of ['minZ','maxZ'])part[key]+=dz;
    for(const coat of attachedPaint(draft,id))shiftRect(coat,dx,dz);
    for(const basin of attachedBasins(draft,id)){basin.x+=dx;basin.z+=dz;}
    return true;
  }
  if(object.kind==='pressure-gate'){const dz=z-(object.minZ+object.maxZ)/2;
    object.x=x;object.minZ+=dz;object.maxZ+=dz;return true;}
  if(finite(object.x)&&finite(object.z)){const dx=x-object.x,dz=z-object.z;
    object.x=x;object.z=z;for(const coat of attachedPaint(draft,id))shiftRect(coat,dx,dz);
    for(const basin of attachedBasins(draft,id)){basin.x+=dx;basin.z+=dz;}return true;}
  if(finite(object.minX)&&finite(object.minZ)){const cx=(object.minX+object.maxX)/2,cz=(object.minZ+object.maxZ)/2;
    const dx=x-cx,dz=z-cz;shiftRect(object,dx,dz);
    for(const coat of attachedPaint(draft,id))shiftRect(coat,dx,dz);
    for(const basin of attachedBasins(draft,id)){basin.x+=dx;basin.z+=dz;}
    return true;}return false;}
export function rotateDraftObject(draft,id){const o=draft.objects.find(item=>item.id===id);if(!o)return false;
  if(o.kind==='cutter'){o.rotation.y=((o.rotation.y||0)+90)%360;return true;}
  if(o.kind==='stairs'){
    const current=o.axis==='x'?(o.reverse?2:0):(o.reverse?3:1),next=(current+1)%4;
    for(const coat of attachedPaint(draft,id))rotateRect(coat,o.x,o.z);
    o.axis=next%2?'z':'x';o.reverse=next>=2;return true;
  }
  if(o.axis){o.axis=o.axis==='x'?'z':'x';return true;}
  if(!finite(o.minX)||!finite(o.minZ))return false;
  const cx=(o.minX+o.maxX)/2,cz=(o.minZ+o.maxZ)/2;rotateRect(o,cx,cz);
  for(const coat of attachedPaint(draft,id)){
    rotateRect(coat,cx,cz);
    const faces=['east','south','west','north'],index=faces.indexOf(coat.face);
    if(index>=0)coat.face=faces[(index+1)%4];
  }
  for(const basin of attachedBasins(draft,id)){
    const x=basin.x,z=basin.z;basin.x=cx-(z-cz);basin.z=cz+(x-cx);
  }
  return true;
}
export function deleteDraftObject(draft,id){const before=draft.objects.length;
  draft.objects=draft.objects.filter(o=>o.id!==id&&o.targetId!==id);
  return draft.objects.length!==before;
}
export function clearDraftObjects(draft){const count=draft.objects.length;draft.objects=[];return count;}
function duplicateOffset(draft,source){
  const bowls=attachedBasins(draft,source.id);if(!bowls.length)return {dx:.5,dz:.5};
  const footprint=solidFootprint(source)||
    (source.kind==='pillar'?{minX:source.x-source.radius,maxX:source.x+source.radius,
      minZ:source.z-source.radius,maxZ:source.z+source.radius}:null);
  if(!footprint)return null;
  const width=footprint.maxX-footprint.minX,depth=footprint.maxZ-footprint.minZ,
    basinSpan=Math.max(...bowls.map(b=>2*b.radius+.2)),boundary=draft.boundary;
  const choices=[{dx:Math.max(width+.25,basinSpan),dz:0},{dx:-Math.max(width+.25,basinSpan),dz:0},
    {dx:0,dz:Math.max(depth+.25,basinSpan)},{dx:0,dz:-Math.max(depth+.25,basinSpan)}];
  return choices.find(({dx,dz})=>footprint.minX+dx>=boundary.minX+.01&&
    footprint.maxX+dx<=boundary.maxX-.01&&footprint.minZ+dz>=boundary.minZ+.01&&
    footprint.maxZ+dz<=boundary.maxZ-.01&&bowls.every(b=>
      b.x+dx-b.radius>boundary.minX&&b.x+dx+b.radius<boundary.maxX&&
      b.z+dz-b.radius>boundary.minZ&&b.z+dz+b.radius<boundary.maxZ))||null;
}
export function duplicateDraftObject(draft,id){const source=draft.objects.find(o=>o.id===id);if(!source)return null;
  const offset=duplicateOffset(draft,source);if(!offset)return null;
  const {dx,dz}=offset;
  const object={...copy(source),id:nextId(draft)};
  if(object.kind==='grip')for(const part of [object.ramp,object.platform]){
    part.minX+=dx;part.maxX+=dx;part.minZ+=dz;part.maxZ+=dz;}
  else if(finite(object.x)){object.x+=dx;if(finite(object.z))object.z+=dz;
    else if(object.kind==='pressure-gate'){object.minZ+=dz;object.maxZ+=dz;}}
  else if(finite(object.minX)){object.minX+=dx;object.maxX+=dx;object.minZ+=dz;object.maxZ+=dz;}
  draft.objects.push(object);
  for(const coat of attachedPaint(draft,id)){
    draft.objects.push({...copy(coat),id:nextId(draft),targetId:object.id,
      minX:coat.minX+dx,maxX:coat.maxX+dx,minZ:coat.minZ+dz,maxZ:coat.maxZ+dz});
  }
  for(const basin of attachedBasins(draft,id))draft.objects.push({...copy(basin),id:nextId(draft),
    targetId:object.id,x:basin.x+dx,z:basin.z+dz});
  return object;}

export function resetDraftPaint(draft,area){
  const kept=[];
  for(const object of draft.objects){
    if(object.kind!=='paint'||object.maxX<=area.minX||object.minX>=area.maxX||
      object.maxZ<=area.minZ||object.minZ>=area.maxZ||
      (area.targetId?object.targetId!==area.targetId:!!object.targetId)||
      object.face!==(area.face??'floor')||!area.targetId&&Math.abs((object.base??0)-(area.base??0))>.18){kept.push(object);continue;}
    const o=object;
    const vertical=o.face!=='floor';
    const owner=draft.objects.find(item=>item.id===o.targetId);
    const lowY=o.minY??o.base??0,highY=o.maxY??(owner?.maxY??owner?.top??owner?.platform?.maxY??lowY);
    if(vertical&&(highY<=area.minY||lowY>=area.maxY)){kept.push(o);continue;}
    const along=vertical&&['east','west'].includes(o.face)?'Z':'X',cross=vertical?'Y':'Z',
      old={...o,minY:lowY,maxY:highY};
    const lo=`min${along}`,hi=`max${along}`,clo=`min${cross}`,chi=`max${cross}`;
    const pieces=[{[lo]:old[lo],[hi]:Math.min(old[hi],area[lo]),[clo]:old[clo],[chi]:old[chi]},
      {[lo]:Math.max(old[lo],area[hi]),[hi]:old[hi],[clo]:old[clo],[chi]:old[chi]},
      {[lo]:Math.max(old[lo],area[lo]),[hi]:Math.min(old[hi],area[hi]),[clo]:old[clo],[chi]:Math.min(old[chi],area[clo])},
      {[lo]:Math.max(old[lo],area[lo]),[hi]:Math.min(old[hi],area[hi]),[clo]:Math.max(old[clo],area[chi]),[chi]:old[chi]}]
      .filter(p=>p[hi]-p[lo]>.02&&p[chi]-p[clo]>.02);
    pieces.forEach((rect,i)=>kept.push({...o,...rect,id:i?nextId(draft):o.id}));
  }
  draft.objects=kept;
}

export class WorkbenchSimulation extends PuddleSimulation{
  constructor(draft){
    super();
    const unsafe=boardErrors(draft);if(unsafe.length)throw new Error(unsafe.join(' '));
    this.editorLevel=compileDraft(draft);
    this.selectedTest='garden';this.gardenLevelId=this.editorLevel.id;
    this.reset(1);
  }
  get gardenLevel(){return this.editorLevel||super.gardenLevel;}
  continueGarden(){return false;}
}
