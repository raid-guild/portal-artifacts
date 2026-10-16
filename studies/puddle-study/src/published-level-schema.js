// Portable publication boundary. This file is copied verbatim into the leaderboard
// service; keep it dependency-free so the service never loads Three or Manifold.
export const PUBLISHED_LEVEL_VALIDATION_VERSION=1;
export const PUBLISHED_LEVEL_MAX_BYTES=240000;
const fail=message=>{throw new Error(message);};
const plain=value=>value!==null&&typeof value==='object'&&!Array.isArray(value)&&
  (Object.getPrototypeOf(value)===Object.prototype||Object.getPrototypeOf(value)===null);
const finite=(value,min=-100,max=100)=>typeof value==='number'&&Number.isFinite(value)&&value>=min&&value<=max;
const integer=(value,min,max)=>Number.isSafeInteger(value)&&value>=min&&value<=max;
const keys=(value,allowed,context)=>{
  if(!plain(value))fail(`${context} must be an object.`);
  for(const key of Object.keys(value))if(key==='__proto__'||key==='prototype'||key==='constructor'||!allowed.includes(key))
    fail(`${context} has an unsupported field: ${key}.`);
};
const num=(value,context,min=-100,max=100)=>{if(!finite(value,min,max))fail(`${context} must be a finite number from ${min} to ${max}.`);};
const text=(value,context,max,{required=true}={})=>{
  if(typeof value!=='string'||value.length>max||(required&&!value.trim())||/[\u0000-\u001f\u007f]/u.test(value))
    fail(`${context} must be short plain text.`);
};
const choice=(value,options,context)=>{if(!options.includes(value))fail(`${context} is unsupported.`);};
const fields=(obj,names,context,min=-100,max=100)=>{for(const name of names)num(obj[name],`${context}.${name}`,min,max);};
const rect=(o,context,minSize=.08)=>{
  fields(o,['minX','maxX','minZ','maxZ'],context,-40,40);
  if(o.maxX-o.minX<minSize||o.maxZ-o.minZ<minSize)fail(`${context} has a too-small footprint.`);
};
const point=(o,context)=>fields(o,['x','z'],context,-40,40);
const optional=(o,name,check)=>{if(o[name]!==undefined)check(o[name]);};
const LIMITS={objects:300,solids:96,tools:16,paint:32,combinations:1536,paintTiles:24000};
const objectFields={
  start:'x z base',exit:'type x z radius bottomRadius depth',
  flesh:'x z base weight',gem:'x z base',gold:'x z base',
  pillar:'x z radius height base',
  'legacy-roof':'type minX maxX minZ maxZ bottom top approachBothSides',
  'legacy-passage':'type minX maxX minZ maxZ bottom top approachBothSides',
  'pressure-basin':'type x z radius bottomRadius depth holdsFeedstock',
  'pressure-gate':'x width height opening minZ maxZ threshold releaseThreshold rate base latch',
  basin:'type x z radius bottomRadius depth base targetId raised',
  'casting-bank':'x z',grip:'ramp platform climbHeight',
  slippery:'type minX maxX minZ maxZ',
  block:'minX maxX minY maxY minZ maxZ role approachBothSides',
  lowgap:'minX maxX minZ maxZ bottom top base axis supportWidth',
  stairs:'x z axis reverse run width rise steps base',
  paint:'surface face base minX maxX minZ maxZ minY maxY targetId part',
  pit:'x z radius',cutter:'shape x y z width height depth radius rotation',
  label:'x z base offset text',tablet:'x z base category title text hint',
};
const terrainKeys={
  flat:['type','height'],
  switchback:['type','upperHeight','frontZ','startTier','stairs'],
  'depth-terraces':['type','descendZ','frontHeight','middleHeight','frontZ','rearZ','leftStairs','rightStairs'],
};
function stairsTerrain(value,context,axis){
  const runKeys=axis==='x'?['minX','maxX','minZ','maxZ','steps']:
    axis==='switchback'?['minX','maxX','endZ','steps']:['minX','maxX','startZ','endZ','steps'];
  keys(value,runKeys,context);fields(value,['minX','maxX'],context,-40,40);
  if(value.maxX-value.minX<.1)fail(`${context} needs a positive width.`);
  if(axis==='x')fields(value,['minZ','maxZ'],context,-40,40);
  else fields(value,axis==='switchback'?['endZ']:['startZ','endZ'],context,-40,40);
  if(!Array.isArray(value.steps)||value.steps.length<1||value.steps.length>16)fail(`${context} needs 1–16 steps.`);
  for(const step of value.steps){keys(step,axis==='x'?['x','rise','width']:['z','drop','width'],`${context} step`);
    fields(step,axis==='x'?['x','rise','width']:['z','drop','width'],`${context} step`,-40,40);
    if(step.width<.08||(axis==='x'?step.rise:step.drop)<.01)fail(`${context} has an unsafe step.`);}
}
function terrain(value){
  if(!plain(value)||!terrainKeys[value.type])fail('Choose a supported terrain type.');
  keys(value,terrainKeys[value.type],'Terrain');
  if(value.type==='flat')num(value.height,'Terrain height',0,20);
  if(value.type==='switchback'){
    fields(value,['upperHeight','frontZ'],'Terrain',-40,40);
    if(value.upperHeight<0||value.upperHeight>20)fail('Terrain height is out of range.');
    stairsTerrain(value.stairs,'Terrain stairs','switchback');
    if(value.startTier!==undefined)stairsTerrain(value.startTier,'Starting tier','x');
  }
  if(value.type==='depth-terraces'){
    fields(value,['frontHeight','middleHeight','frontZ','rearZ'],'Terrain',-40,40);
    if(value.frontHeight<0||value.middleHeight<0||value.frontHeight>20||value.middleHeight>20)fail('Terrain height is out of range.');
    optional(value,'descendZ',v=>choice(v,[-1,1],'Descent direction'));
    stairsTerrain(value.leftStairs,'Left stairs','z');stairsTerrain(value.rightStairs,'Right stairs','z');
  }
}
function funnel(o,context){point(o,context);choice(o.type,['funnel'],`${context} type`);
  fields(o,['radius','bottomRadius','depth'],context,0,20);
  if(o.radius<.3||o.radius>3||o.bottomRadius<.1||o.bottomRadius>=o.radius||o.depth<.05||o.depth>4)
    fail(`${context} has unsafe funnel dimensions.`);
}
function ramp(o,context){
  keys(o,['type','axis','minX','maxX','minZ','maxZ','minHeight','maxHeight','northHeight','southHeight'],context);
  choice(o.type,['grip-ramp'],`${context} type`);optional(o,'axis',v=>choice(v,['x'],`${context} axis`));
  rect(o,context);
  const names=o.axis==='x'?['minHeight','maxHeight']:['northHeight','southHeight'];
  fields(o,names,context,0,20);
  if(Math.abs(o[names[1]]-o[names[0]])<.05)fail(`${context} needs a slope.`);
}
function validateObject(o,ids){
  if(!plain(o)||typeof o.kind!=='string'||!objectFields[o.kind])fail('Unknown level object.');
  const context=`${o.kind} object`;
  keys(o,['id','kind',...objectFields[o.kind].split(' ')],context);
  text(o.id,`${context} ID`,80);if(!/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(o.id)||ids.has(o.id))fail('Every object needs a unique stable ID.');ids.add(o.id);
  for(const [name,value] of Object.entries(o))if(typeof value==='number')num(value,`${context}.${name}`,-360,1000);
  if(['start','flesh','gem','gold','pillar','casting-bank','stairs','pit','cutter','label','tablet'].includes(o.kind))point(o,context);
  if(['block','lowgap','legacy-roof','legacy-passage','slippery','paint'].includes(o.kind))rect(o,context,o.kind==='paint'?.02:.08);
  if(['exit','basin','pressure-basin'].includes(o.kind))funnel(o,context);
  if(['start','flesh','gem','gold','pillar','stairs','paint','label','tablet'].includes(o.kind))
    optional(o,'base',v=>num(v,`${context} base`,0,20));
  switch(o.kind){
    case 'flesh':num(o.weight,'Flesh weight',.01,297);break;
    case 'pillar':fields(o,['radius','height'],context,.08,20);break;
    case 'legacy-roof':case 'legacy-passage':
      choice(o.type,['roof'],`${context} type`);fields(o,['bottom','top'],context,0,20);
      if(o.top-o.bottom<.08)fail(`${context} has unsafe height.`);
      optional(o,'approachBothSides',v=>choice(v,[true,false],`${context} approach`));break;
    case 'pressure-basin':optional(o,'holdsFeedstock',v=>choice(v,[true,false],`${context} feedstock`));break;
    case 'pressure-gate':fields(o,['x','width','height','opening','minZ','maxZ','threshold','releaseThreshold','rate','base'],context,-40,297);
      if(o.width<.08||o.height<.08||o.maxZ-o.minZ<.1||o.threshold<1||o.rate<0||o.opening<0)fail('Pressure gate dimensions are unsafe.');
      optional(o,'latch',v=>choice(v,[true,false],'Gate latch'));break;
    case 'basin':optional(o,'targetId',v=>text(v,'Basin target',80));
      optional(o,'raised',v=>choice(v,[true,false],'Raised basin'));break;
    case 'grip':keys(o.platform,['type','gripPlatform','minX','maxX','minY','maxY','minZ','maxZ'],'Grip platform');
      choice(o.platform.type,['box'],'Grip platform type');rect(o.platform,'Grip platform');
      fields(o.platform,['minY','maxY'],'Grip platform',0,20);
      if(o.platform.maxY-o.platform.minY<.08)fail('Grip platform has unsafe height.');
      optional(o.platform,'gripPlatform',v=>choice(v,[true,false],'Grip marking'));
      ramp(o.ramp,'Grip ramp');num(o.climbHeight,'Grip climb height',0,20);break;
    case 'slippery':choice(o.type,['slip'],'Slippery surface type');break;
    case 'block':fields(o,['maxY'],context,0,20);optional(o,'minY',v=>num(v,'Block base',0,20));
      if(o.maxY-(o.minY??0)<.08)fail('Block has unsafe height.');
      optional(o,'role',v=>choice(v,['crown-roof','roof-support'],'Block role'));
      optional(o,'approachBothSides',v=>choice(v,[true,false],'Block approach'));break;
    case 'lowgap':fields(o,['bottom','top'],context,0,20);
      if(o.bottom<.08||o.top-o.bottom<.08)fail('Low gap has unsafe clearance.');
      optional(o,'axis',v=>choice(v,['x','z'],'Low gap axis'));
      optional(o,'supportWidth',v=>num(v,'Low gap support width',.08,3));break;
    case 'stairs':choice(o.axis,['x','z'],'Ramp axis');choice(o.reverse,[true,false],'Ramp direction');
      fields(o,['run','width','rise','steps'],context,0,20);
      if(o.run<.2||o.width<.2||o.rise<.1||!integer(o.steps,1,12))fail('Ramp dimensions are unsafe.');break;
    case 'paint':choice(o.surface,['sticky','slippery','lava'],'Paint surface');
      choice(o.face,['floor','north','south','east','west'],'Paint face');
      if(o.surface!=='sticky'&&o.face!=='floor')fail('Heat and slip paint need a horizontal face.');
      optional(o,'targetId',v=>text(v,'Paint target',80));
      optional(o,'part',v=>choice(v,['ramp','platform'],'Grip paint part'));
      if(o.face!=='floor')fields(o,['minY','maxY'],context,0,20);break;
    case 'pit':num(o.radius,'Pit radius',.35,2);break;
    case 'cutter':choice(o.shape,['box','cylinder'],'Cutter shape');num(o.y,'Cutter height',-20,20);
      num(o.height,'Cutter thickness',.08,20);
      if(o.shape==='box'){num(o.width,'Cutter width',.08,20);num(o.depth,'Cutter depth',.08,20);}
      else num(o.radius,'Cutter radius',.05,10);
      keys(o.rotation,['x','y','z'],'Cutter rotation');fields(o.rotation,['x','y','z'],'Cutter rotation',-360,360);break;
    case 'label':text(o.text,'Label text',120);num(o.offset,'Label offset',0,8);break;
    case 'tablet':choice(o.category,['tutorial','story'],'Tablet category');text(o.title,'Tablet title',60);
      text(o.text,'Tablet text',320);choice(o.hint,['none','move','contract','cast','shed','run'],'Tablet hint');break;
  }
}
function canonical(value){if(Array.isArray(value))return `[${value.map(canonical).join(',')}]`;
  if(plain(value))return `{${Object.keys(value).sort().map(k=>`${JSON.stringify(k)}:${canonical(value[k])}`).join(',')}}`;
  return JSON.stringify(value);}
const contained=(outer,inner,margin=.03)=>inner.minX>=outer.minX-margin&&inner.maxX<=outer.maxX+margin&&
  inner.minZ>=outer.minZ-margin&&inner.maxZ<=outer.maxZ+margin;
function attachedGeometry(o,host){
  if(o.kind==='basin'){
    if(!['block','pillar','legacy-roof','legacy-passage','grip'].includes(host.kind))fail('Raised basin needs a solid horizontal support.');
    const top=host.kind==='block'?host.maxY:host.kind==='pillar'?(host.base??0)+host.height:
      host.kind==='grip'?host.platform.maxY:host.top;
    const bottom=host.kind==='block'?host.minY??0:host.kind==='pillar'?host.base??0:
      host.kind==='grip'?host.platform.minY:host.bottom;
    const rim=o.radius+.075;
    const inside=host.kind==='pillar'?Math.hypot(o.x-host.x,o.z-host.z)+rim<=host.radius+.001:
      contained(host.kind==='grip'?host.platform:host,
        {minX:o.x-rim,maxX:o.x+rim,minZ:o.z-rim,maxZ:o.z+rim},.001);
    if(!inside||!finite(o.base,0,20)||o.base<=0||Math.abs(o.base-top)>.08||
      top-bottom<o.depth+.07)fail('Raised basin must fit entirely on a thick horizontal top.');
    return;
  }
  if(o.kind!=='paint')return;
  const allowed=o.face==='floor'?['block','pillar','stairs','legacy-roof','legacy-passage','lowgap','grip']:
    ['block','legacy-roof','legacy-passage','lowgap','grip'];
  if(!allowed.includes(host.kind))fail('Paint needs a paintable support face.');
  if(o.part&&(host.kind!=='grip'||o.face!=='floor'))fail('Grip paint part needs a horizontal grip face.');
  const support=host.kind==='grip'?o.part==='ramp'?host.ramp:host.platform:host.kind==='stairs'?
    {minX:host.x-(host.axis==='x'?host.run:host.width)/2,
      maxX:host.x+(host.axis==='x'?host.run:host.width)/2,
      minZ:host.z-(host.axis==='z'?host.run:host.width)/2,
      maxZ:host.z+(host.axis==='z'?host.run:host.width)/2}:host.kind==='pillar'?
    {minX:host.x-host.radius,maxX:host.x+host.radius,minZ:host.z-host.radius,maxZ:host.z+host.radius}:host;
  if(!contained(support,o,.035))fail('Paint must stay on its attached surface.');
  if(o.face!=='floor'){
    const bottom=host.kind==='block'?host.minY??0:host.kind==='grip'?host.platform.minY:
      host.bottom,top=host.kind==='block'?host.maxY:host.kind==='grip'?host.platform.maxY:host.top;
    if(o.minY<bottom-.03||o.maxY>top+.03||o.maxY-o.minY<.02)
      fail('Wall paint must fit its attached face.');
  }
}
export function validatePublishedLevel(input){
  let data=typeof input==='string'?JSON.parse(input):input;
  const raw=JSON.stringify(data);if(!raw||new TextEncoder().encode(raw).length>PUBLISHED_LEVEL_MAX_BYTES)fail('Published document exceeds 240 KB.');
  let nodes=0;const inspect=(value,depth=0)=>{
    if(++nodes>10000||depth>8)fail('Level document is too complex.');
    if(Array.isArray(value)){if(value.length>300)fail('Level array is too large.');for(const item of value)inspect(item,depth+1);}
    else if(plain(value)){for(const [key,item] of Object.entries(value)){
      if(['__proto__','prototype','constructor'].includes(key))fail('Prototype fields are unsupported.');inspect(item,depth+1);}}
    else if(typeof value==='string'){if(value.length>1000)fail('Level text is too long.');}
    else if(typeof value==='number'){if(!Number.isFinite(value))fail('Level contains a nonfinite number.');}
    else if(value===null||typeof value==='boolean'){}else fail('Unsupported level value.');
  };inspect(data);data=JSON.parse(raw);
  keys(data,['format','version','draft'],'Published document');
  if(data.format!=='puddle-level'||data.version!==3)fail('Publish a version 3 Puddle level.');
  const d=data.draft;keys(d,['name','presetId','boundary','terrain','totalFlesh','startingFlesh','targetTime','tendrils','nextObjectId','objects'],'Level draft');
  text(d.name,'Level title',60);if(!integer(d.presetId,0,7))fail('Invalid source preset.');
  if(!integer(d.totalFlesh,1,297)||!integer(d.startingFlesh,1,d.totalFlesh))fail('Keep the total flesh at or below 297.');
  if(!finite(d.targetTime,1,3600))fail('Target time must be 1–3600 seconds.');
  choice(d.tendrils,[true,false],'Tendrils');if(!integer(d.nextObjectId,1,1000000))fail('Invalid next object ID.');
  keys(d.boundary,['type','minX','maxX','minZ','maxZ'],'Board');choice(d.boundary.type,['boundary'],'Board type');rect(d.boundary,'Board',1);
  const width=d.boundary.maxX-d.boundary.minX,depth=d.boundary.maxZ-d.boundary.minZ;
  if(width>40||depth>40||width*depth>1200)fail('Published board exceeds 40 units per side or 1200 square units.');
  terrain(d.terrain);
  if(!Array.isArray(d.objects)||d.objects.length>LIMITS.objects)fail('Keep no more than 300 objects.');
  // The editor emits null for an unowned terrain face; store one canonical
  // representation so the same draft hashes identically on retries.
  for(const o of d.objects)if(plain(o)&&o.kind==='paint'&&o.targetId===null)delete o.targetId;
  const ids=new Set();for(const o of d.objects)validateObject(o,ids);
  if(d.objects.filter(o=>o.kind==='start').length!==1||d.objects.filter(o=>o.kind==='exit').length!==1)
    fail('A published level needs exactly one start and one exit.');
  const solids=d.objects.filter(o=>['block','pillar','lowgap','stairs','legacy-roof','legacy-passage','grip'].includes(o.kind));
  const tools=d.objects.filter(o=>o.kind==='cutter'||o.kind==='basin'&&o.targetId);
  const paints=d.objects.filter(o=>o.kind==='paint');
  if(solids.length>LIMITS.solids||tools.length>LIMITS.tools||solids.length*tools.length>LIMITS.combinations||paints.length>LIMITS.paint)
    fail('Publication geometry is too complex. Simplify solids, cuts, or paint.');
  let tiles=0;for(const p of paints)tiles+=Math.ceil((p.maxX-p.minX)/.16)*Math.ceil((p.face==='floor'?p.maxZ-p.minZ:p.maxY-p.minY)/.16);
  if(tiles>LIMITS.paintTiles)fail('Publication paint covers too many tiles.');
  const byId=new Map(d.objects.map(o=>[o.id,o]));
  for(const o of d.objects)if(o.targetId){if(!ids.has(o.targetId)||o.targetId===o.id)fail(`${o.kind} refers to a missing support.`);
    attachedGeometry(o,byId.get(o.targetId));}
  for(const o of paints)if(!o.targetId&&(o.face!=='floor'||o.part))fail('Unattached paint belongs on a terrain floor.');
  const inside=o=>o.x>d.boundary.minX+.1&&o.x<d.boundary.maxX-.1&&o.z>d.boundary.minZ+.1&&o.z<d.boundary.maxZ-.1;
  for(const o of d.objects)if(finite(o.x,-40,40)&&finite(o.z,-40,40)&&!inside(o))fail(`${o.kind} lies outside the playable board.`);
  for(const o of solids)if(finite(o.minX,-40,40)&&finite(o.maxX,-40,40)&&
    (o.minX<d.boundary.minX||o.maxX>d.boundary.maxX||o.minZ<d.boundary.minZ||o.maxZ>d.boundary.maxZ))
    fail(`${o.kind} extends outside the board.`);
  const serialized=canonical({format:'puddle-level',version:3,draft:d});
  const document=JSON.parse(serialized);
  return {document,canonical:serialized,title:d.name.trim(),goldCount:d.objects.filter(o=>o.kind==='gold').length,
    gemCount:d.objects.filter(o=>o.kind==='gem').length,targetSeconds:d.targetTime,
    validationVersion:PUBLISHED_LEVEL_VALIDATION_VERSION};
}
