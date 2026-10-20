import { EditorModel, EDITOR_DRAFT_KEY } from './editor-model.js';
import { ENTITY_TYPES, parseLevelDocument, validateLevelDocument } from './level-document.js';
import { compiledWallGeometry, pointSegmentDistance } from './wall-geometry.js';
import { orbitPeriod, orbitPosition, orbitRadiusKeepingPeriod, orbitRingPreset, orbitSpeed, pickOrbitEntity, startOrbitMotion, validateOrbitPresetPlacement } from './orbit.js';
import './editor.css';

const clone = value => structuredClone(value);
const entityColors = { ember:'#ff873c', soundGate:'#80e8e2', impulse:'#7be4f0', stillness:'#ffd58e', eclipse:'#756b9c', lightPickup:'#ffe3a3', dimmer:'#bfa5ff', portal:'#79e1d6' };
const title = value => value.replace(/([A-Z])/g,' $1').replace(/^./,letter=>letter.toUpperCase());
const fieldSpecs = {
  start: ['x','y','direction','speed'], exit: ['x','y','radius','gravity'], wall: ['x','y','width','height'], wallPath: ['thickness'],
  ember: ['x','y','radius','gravity','lethal','motion'],
  soundGate: ['x','y','radius','slot'], impulse: ['x','y','radius','direction','speed'],
  stillness: ['x','y','radius','captureTime'], eclipse: ['x','y','radius','captureTime','fadeTime'],
  lightPickup: ['x','y','radius','amount','reusable','cooldown'], dimmer: ['x','y','radius','amount','reusable','cooldown'],
  portal: ['x','y','radius','pairId','exitDirection'],
};
function defaultEntity(type, x, y, model) {
  const base = { id:model.nextId(type), type, x, y, radius:.9 };
  if (type === 'ember') return {...base, radius:1.6, gravity:22, lethal:true, motion:'fixed', speed:0, orbitRadius:0, phase:0, orbitDirection:'counterclockwise'};
  if (type === 'soundGate') return {...base, slot:[0,1,2].find(slot=>!model.document.entities.some(e=>e.type==='soundGate'&&e.slot===slot)) ?? 0};
  if (type === 'impulse') return {...base, direction:0, speed:12};
  if (type === 'stillness') return {...base, captureTime:1};
  if (type === 'eclipse') return {...base, captureTime:2, fadeTime:2};
  if (type === 'lightPickup' || type === 'dimmer') return {...base, radius:.65, amount:.3, reusable:false, cooldown:4};
  if (type === 'portal') {
    const unpaired = model.document.entities.find(e=>e.type==='portal'&&model.document.entities.filter(o=>o.type==='portal'&&o.pairId===e.pairId).length===1);
    return {...base, pairId:unpaired?.pairId || model.nextId('pair'), exitDirection:0};
  }
  return base;
}

export function createEditor({ mount, defaultDocument, onHome, onPlay }) {
  let stored = null;
  try { const value = localStorage.getItem(EDITOR_DRAFT_KEY); if (value && value.length < 262144) stored = JSON.parse(value); } catch {}
  const safeShape = value => value && typeof value === 'object' && !Array.isArray(value);
  const storedShape = safeShape(stored) && stored.version === 1 && Array.isArray(stored.walls) && Array.isArray(stored.entities)
    && (stored.wallPaths === undefined || Array.isArray(stored.wallPaths) && stored.wallPaths.every(path=>safeShape(path)&&Array.isArray(path.points)))
    && stored.walls.every(safeShape) && stored.entities.every(safeShape)
    && safeShape(stored.bounds) && safeShape(stored.settings) && safeShape(stored.start) && safeShape(stored.exit);
  const model = new EditorModel(storedShape ? stored : defaultDocument);
  const root = document.createElement('div'); root.className='editor-overlay hidden';
  root.innerHTML = `<header class="editor-header"><div><span class="eyebrow">ORBIT LAB / LEVEL EDITOR</span><h1>Draw a world.</h1></div><div class="editor-header-actions"><span id="editorSaveState" role="status">Saved locally</span><button type="button" data-action="home">Home</button><button type="button" data-action="save">Save draft</button><button type="button" data-action="import">Import JSON</button><button type="button" data-action="export">Export JSON</button><button type="button" data-action="play" class="editor-play">Playtest ↗</button></div></header><div class="editor-main"><div class="editor-stage"><div class="editor-tools" role="toolbar" aria-label="Level tools"><button data-tool="select" aria-pressed="true">Select</button><button data-tool="wall">Wall</button><button data-tool="line">Line</button><button data-tool="erase">Erase</button><button data-tool="start">Start</button><button data-tool="exit">Exit</button><select id="editorEntityTool" aria-label="Place element"><option value="">Add element…</option></select><label>Brush <select id="editorBrush"><option>1</option><option>2</option><option>3</option></select></label><button data-action="finishLine" class="editor-line-action hidden">Finish line</button><button data-action="cancelLine" class="editor-line-action hidden">Cancel line</button><button data-tool="pan">Pan</button><button data-action="undo" title="Undo">↶</button><button data-action="redo" title="Redo">↷</button><button data-action="fit">Fit</button><button data-action="zoomout" aria-label="Zoom out">−</button><button data-action="zoomin" aria-label="Zoom in">+</button><button data-action="drawer" class="editor-drawer-toggle">Properties</button></div><canvas id="editorCanvas" aria-label="Level editing canvas"></canvas><div class="editor-canvas-note">Tap to place · drag to move or paint · wheel or ± to zoom</div></div><aside class="editor-inspector"><div class="editor-inspector-head"><h2>Properties</h2><button data-action="closeDrawer" class="editor-drawer-toggle" aria-label="Close properties">×</button></div><div id="editorValidation" role="status"></div><div class="editor-inspector-tabs" role="tablist" aria-label="Editor properties"><button type="button" role="tab" data-inspector-tab="level" aria-selected="true">Level</button><button type="button" role="tab" data-inspector-tab="selected" aria-selected="false">Selected</button></div><div id="editorFields" role="tabpanel"></div></aside></div><input id="editorFile" type="file" accept="application/json,.json" hidden>`;
  mount.append(root);
  const $ = selector => root.querySelector(selector), canvas = $('#editorCanvas'), ctx = canvas.getContext('2d');
  const fileInput = $('#editorFile'), fields = $('#editorFields');
  for (const type of ENTITY_TYPES) { const option=document.createElement('option'); option.value=type; option.textContent=title(type); $('#editorEntityTool').append(option); }
  {const option=document.createElement('option');option.value='orbitRing';option.textContent='Orbit ring · 3 embers';$('#editorEntityTool').append(option);}
  let tool='select', scale=12, offset={x:0,y:0}, pointer=null, grid=1, open=false, hasFit=false, inspectorTab='level', lineDraft=null, lineCursor=null, editorNotice='', presetCursor=null;
  let fittedSize={width:0,height:0};
  const save=()=>{ try { localStorage.setItem(EDITOR_DRAFT_KEY, JSON.stringify(model.document)); $('#editorSaveState').textContent='Saved locally'; } catch { $('#editorSaveState').textContent='Local save unavailable'; } };
  const fit=()=>{const b=model.document.bounds,rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;scale=Math.min((rect.width-48)/(b.maxX-b.minX),(rect.height-48)/(b.maxY-b.minY));offset={x:rect.width/2-(b.minX+b.maxX)/2*scale,y:rect.height/2+(b.minY+b.maxY)/2*scale};hasFit=true;fittedSize={width:rect.width,height:rect.height};draw();};
  const drawOrRefit=()=>{if(!open)return;const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;if(Math.abs(rect.width-fittedSize.width)>1||Math.abs(rect.height-fittedSize.height)>1)fit();else draw();};
  const screen=point=>({x:point.x*scale+offset.x,y:-point.y*scale+offset.y});
  const world=event=>{const rect=canvas.getBoundingClientRect();return{x:(event.clientX-rect.left-offset.x)/scale,y:-(event.clientY-rect.top-offset.y)/scale};};
  const snap=value=>Math.round(value/grid)*grid;
  const snapPoint=point=>({x:snap(point.x),y:snap(point.y)});
  function draw() {
    if (!open) return;
    const ratio=Math.min(devicePixelRatio||1,2),rect=canvas.getBoundingClientRect();
    if (canvas.width!==Math.round(rect.width*ratio)||canvas.height!==Math.round(rect.height*ratio)) {canvas.width=Math.round(rect.width*ratio);canvas.height=Math.round(rect.height*ratio);}
    ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,rect.width,rect.height);ctx.fillStyle='#071521';ctx.fillRect(0,0,rect.width,rect.height);
    const b=model.document.bounds,left=screen({x:b.minX,y:0}).x,right=screen({x:b.maxX,y:0}).x,top=screen({x:0,y:b.maxY}).y,bottom=screen({x:0,y:b.minY}).y;
    ctx.save();ctx.beginPath();ctx.rect(left,top,right-left,bottom-top);ctx.clip();
    ctx.strokeStyle='#264753';ctx.lineWidth=1;
    const increment=scale<10?5:scale<20?2:1;
    for(let x=Math.ceil(b.minX/increment)*increment;x<=b.maxX;x+=increment){const p=screen({x,y:0});ctx.beginPath();ctx.moveTo(p.x,top);ctx.lineTo(p.x,bottom);ctx.stroke();}
    for(let y=Math.ceil(b.minY/increment)*increment;y<=b.maxY;y+=increment){const p=screen({x:0,y});ctx.beginPath();ctx.moveTo(left,p.y);ctx.lineTo(right,p.y);ctx.stroke();}
    for(const wall of model.document.walls){const p=screen(wall);ctx.fillStyle=wall.id===model.selected?'#2e6772':'#02080d';ctx.fillRect(p.x-wall.width*scale/2,p.y-wall.height*scale/2,wall.width*scale,wall.height*scale);}
    for(const path of model.document.wallPaths || []) {
      if(path.points.length<2)continue;
      ctx.beginPath(); path.points.forEach((point,i)=>{const p=screen(point);i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y);});
      ctx.strokeStyle=path.id===model.selected?'#2e6772':'#02080d';ctx.lineWidth=path.thickness*scale;ctx.lineCap='square';ctx.lineJoin='bevel';ctx.stroke();
      if(path.id===model.selected)for(const point of path.points){const p=screen(point);ctx.beginPath();ctx.arc(p.x,p.y,5,0,Math.PI*2);ctx.fillStyle='#a9fff0';ctx.fill();}
    }
    if(lineDraft?.length){ctx.beginPath();lineDraft.forEach((point,i)=>{const p=screen(point);i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y);});if(lineCursor){const p=screen(lineCursor);ctx.lineTo(p.x,p.y);}ctx.strokeStyle='#8ee9dc';ctx.lineWidth=Math.max(2,Number($('#editorBrush').value)*scale);ctx.lineCap='square';ctx.lineJoin='bevel';ctx.globalAlpha=.65;ctx.stroke();ctx.globalAlpha=1;}
    if(tool==='entity:orbitRing'&&presetCursor){
      const ghost=orbitRingPreset(presetCursor,['ghost-a','ghost-b','ghost-c']);
      const issue=validateOrbitPresetPlacement(ghost,model.document.bounds,model.document.start,model.document.exit);
      const center=screen(presetCursor);ctx.beginPath();ctx.arc(center.x,center.y,3.5*scale,0,Math.PI*2);ctx.setLineDash([5,5]);ctx.strokeStyle=issue?'#ff7474':'#ffc083';ctx.lineWidth=1.5;ctx.stroke();ctx.setLineDash([]);
      for(const item of ghost){const p=screen(orbitPosition(item));ctx.beginPath();ctx.arc(p.x,p.y,Math.max(3,item.radius*scale),0,Math.PI*2);ctx.fillStyle=issue?'#ec6666aa':'#ff9a57aa';ctx.fill();}
    }
    for(const entity of model.document.entities){
      const orbiting=entity.type==='ember'&&entity.motion==='orbit',body=orbiting?orbitPosition(entity,0):entity;
      const p=screen(body),radius=Math.max(4,(Number.isFinite(entity.radius)?Math.max(0,entity.radius):.35)*scale),selected=entity.id===model.selected;
      if(orbiting){
        const center=screen(entity);ctx.beginPath();ctx.arc(center.x,center.y,Math.max(0,Number.isFinite(entity.orbitRadius)?entity.orbitRadius:0)*scale,0,Math.PI*2);ctx.setLineDash([4,5]);ctx.strokeStyle=selected?'#ffbe81':'#d48b5c77';ctx.lineWidth=selected?1.6:1;ctx.stroke();ctx.setLineDash([]);
        ctx.beginPath();ctx.moveTo(center.x-5,center.y);ctx.lineTo(center.x+5,center.y);ctx.moveTo(center.x,center.y-5);ctx.lineTo(center.x,center.y+5);ctx.strokeStyle=selected?'#ffc995':'#aa6c4a';ctx.stroke();
        const phase=(entity.phase||0)*Math.PI/180,sign=entity.orbitDirection==='clockwise'?-1:1;
        const arrow=screen({x:body.x-Math.sin(phase)*sign*.8,y:body.y+Math.cos(phase)*sign*.8});
        ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(arrow.x,arrow.y);ctx.strokeStyle='#ffb574';ctx.lineWidth=1.5;ctx.stroke();
      }
      if(entity.type==='eclipse'){
        ctx.beginPath();ctx.arc(p.x,p.y,radius,0,Math.PI*2);ctx.strokeStyle=selected?'#b9a1e1':'#756b9c';ctx.lineWidth=selected?3:1.5;ctx.stroke();
        ctx.beginPath();ctx.arc(p.x,p.y,radius*.83,0,Math.PI*2);ctx.strokeStyle='#655780';ctx.lineWidth=1;ctx.stroke();
        ctx.beginPath();ctx.arc(p.x,p.y,radius*.72,0,Math.PI*2);ctx.fillStyle='#020309';ctx.fill();
      }else if(entity.type==='dimmer'){
        ctx.beginPath();ctx.arc(p.x,p.y,radius,0,Math.PI*2);ctx.strokeStyle=selected?'#bd98db':'#8f72a65c';ctx.lineWidth=selected?2:1;ctx.setLineDash([3,4]);ctx.stroke();ctx.setLineDash([]);
        ctx.beginPath();for(let i=0;i<=24;i++){const angle=i/24*Math.PI*2,irregular=1+.07*Math.sin(angle*7),r=.38*scale*irregular;i?ctx.lineTo(p.x+Math.cos(angle)*r,p.y+Math.sin(angle)*r):ctx.moveTo(p.x+Math.cos(angle)*r,p.y+Math.sin(angle)*r);}ctx.strokeStyle='#9a71bd';ctx.stroke();
        ctx.beginPath();ctx.arc(p.x,p.y,Math.max(3,.22*scale),0,Math.PI*2);ctx.fillStyle='#5a3a79';ctx.fill();
        for(let i=0;i<5;i++){const a=i*2.39996,r=.5*scale;ctx.beginPath();ctx.arc(p.x+Math.cos(a)*r,p.y+Math.sin(a)*r,1.4,0,Math.PI*2);ctx.fillStyle='#af83cc';ctx.fill();}
      }else{
        ctx.beginPath();ctx.arc(p.x,p.y,radius,0,Math.PI*2);ctx.fillStyle=entityColors[entity.type]+'55';ctx.fill();ctx.strokeStyle=entityColors[entity.type];ctx.lineWidth=selected?3:1.5;ctx.stroke();
      }
      ctx.fillStyle=entityColors[entity.type];ctx.font='11px sans-serif';ctx.fillText(entity.type==='soundGate'?`♪${entity.slot+1}`:entity.type==='portal'?`⇄${entity.pairId}`:title(entity.type),p.x+radius+4,p.y+3);
    }
    for(const [key,color,glyph] of [['start','#eafff5','●'],['exit','#aa9aff','◎']]){const point=model.document[key];if(!point)continue;const p=screen(point);ctx.fillStyle=color;ctx.font='bold 24px sans-serif';ctx.fillText(glyph,p.x-9,p.y+8);if(model.selected===key){ctx.strokeStyle=color;ctx.strokeRect(p.x-15,p.y-15,30,30);}}
    ctx.restore();ctx.strokeStyle='#719ba5';ctx.lineWidth=2;ctx.strokeRect(left,top,right-left,bottom-top);
  }
  function selectAt(point) {
    const orbitHit=pickOrbitEntity(model.document.entities,point,model.selected);
    if(orbitHit){if(pointer)pointer.orbitPart=orbitHit.part;return orbitHit.id;}
    for(const key of ['start','exit'])if(model.document[key]&&Math.hypot(model.document[key].x-point.x,model.document[key].y-point.y)<1.2)return key;
    for(const entity of [...model.document.entities].reverse())if(!(entity.type==='ember'&&entity.motion==='orbit')&&Math.hypot(entity.x-point.x,entity.y-point.y)<entity.radius+.35)return entity.id;
    for(const path of [...(model.document.wallPaths || [])].reverse())for(let i=1;i<path.points.length;i++)if(pointSegmentDistance(point,path.points[i-1],path.points[i])<path.thickness/2+.5)return path.id;
    for(const wall of [...model.document.walls].reverse())if(Math.abs(wall.x-point.x)<wall.width/2+.25&&Math.abs(wall.y-point.y)<wall.height/2+.25)return wall.id;
    return null;
  }
  function paintAt(point, erase=false) {
    const p=snapPoint(point),b=model.document.bounds;
    if(p.x<b.minX+.5||p.x>b.maxX-.5||p.y<b.minY+.5||p.y>b.maxY-.5)return;
    const brush=Number($('#editorBrush').value),stamp={id:model.nextId('wall'),x:p.x,y:p.y,width:brush,height:brush};
    if(erase){model.eraseWall(stamp);return;}
    model.paintWall(stamp);
  }
  function refresh(renderInspector = true) {
    if(model.selected && !model.selectedObject)model.selected=null;
    const result=validateLevelDocument(model.document),status=$('#editorValidation');
    let usage='';try{usage=` · ${compiledWallGeometry(model.document.walls,model.document.wallPaths||[]).length}/300 wall pieces`;}catch{}
    status.textContent=(editorNotice?`${editorNotice} · `:'')+(result.ok?'Level ready to playtest.':`${result.errors.length} issue${result.errors.length===1?'':'s'}: ${result.errors.slice(0,4).join(' · ')}`)+usage;
    status.classList.toggle('invalid',!result.ok);
    $('[data-action="play"]').disabled=!result.ok; $('[data-action="export"]').disabled=!result.ok;
    $('[data-action="undo"]').disabled=!model.undoStack.length; $('[data-action="redo"]').disabled=!model.redoStack.length;
    if(renderInspector)renderFields();draw();save();
  }
  function setInspectorTab(next) {
    model.endStroke();
    inspectorTab = next;
    for (const tab of root.querySelectorAll('[data-inspector-tab]')) tab.setAttribute('aria-selected', String(tab.dataset.inspectorTab === next));
    renderFields(); refresh(false);
  }
  function addField(parent,object,key,labelPrefix='') {
    const value=object?.[key],label=document.createElement('label');label.textContent=key==='orbitDirection'?'Direction':key==='phase'&&labelPrefix==='Starting '?'Starting angle':`${labelPrefix}${title(key)}`;
    let input;
    if(typeof value==='boolean'){input=document.createElement('input');input.type='checkbox';input.checked=value;}
    else if(key==='motion'||key==='orbitDirection'){input=document.createElement('select');for(const mode of key==='motion'?['fixed','chaser','orbit']:['counterclockwise','clockwise']){const option=document.createElement('option');option.value=mode;option.textContent=title(mode);input.append(option);}input.value=value||'counterclockwise';}
    else{input=document.createElement('input');input.type=typeof value==='number'?'number':'text';if(input.type==='number'){input.step='any';input.inputMode='decimal';}input.value=value===null?'':value;}
    const commitInput=()=>{const newValue=input.type==='checkbox'?input.checked:input.type==='number'?(input.value===''?NaN:Number(input.value)):key==='maxTotalWells'&&input.value===''?null:input.value;const findTarget=doc=>key==='title'?doc:labelPrefix==='Settings / '?doc.settings:labelPrefix==='Bounds / '?doc.bounds:model.selected==='start'||model.selected==='exit'?doc[model.selected]:[...doc.walls,...(doc.wallPaths||[]),...doc.entities].find(item=>item.id===model.selected);const current=findTarget(model.document);if(!current||Object.is(current[key],newValue))return;model.paint(doc=>{const target=findTarget(doc);if(key==='motion'&&newValue==='orbit')Object.assign(target,startOrbitMotion(target));else if(key==='orbitRadius'&&target.type==='ember'&&target.motion==='orbit')Object.assign(target,orbitRadiusKeepingPeriod(target,newValue));else target[key]=newValue;});editorNotice='';if(key==='motion'){model.endStroke();refresh();}else refresh(false);};
    input.addEventListener('input',commitInput);
    input.addEventListener('change',commitInput);
    input.addEventListener('blur',()=>{commitInput();model.endStroke();refresh(false);});
    label.append(input);parent.append(label);
  }
  function addOrbitPeriodField(ember){
    const label=document.createElement('label');label.textContent='Seconds per revolution';
    const input=document.createElement('input');input.type='number';input.step='any';input.inputMode='decimal';
    const period=orbitPeriod(ember);input.value=Number.isFinite(period)?String(Number(period.toFixed(3))):'';input.placeholder='Stopped';
    const commit=()=>{const seconds=input.value===''?NaN:Number(input.value);const speed=orbitSpeed(model.selectedObject.orbitRadius,seconds);if(Object.is(model.selectedObject.speed,speed))return;model.paint(doc=>{doc.entities.find(item=>item.id===model.selected).speed=speed;});refresh(false);};
    input.addEventListener('input',commit);input.addEventListener('change',commit);input.addEventListener('blur',()=>{commit();model.endStroke();refresh(false);});label.append(input);fields.append(label);
    if(!Number.isFinite(period)){const hint=document.createElement('p');hint.className='editor-tab-help';hint.textContent='Stopped orbit (speed 0). Enter a positive period to start moving.';fields.append(hint);}
  }
  function renderFields(){
    fields.replaceChildren();
    const heading=(text)=>{const h=document.createElement('h3');h.textContent=text;fields.append(h);};
    if(inspectorTab==='level') {
      const intro=document.createElement('p');intro.className='editor-tab-help';intro.textContent='Set the room and its rules here. Select an element on the canvas to edit its properties.';fields.append(intro);
      heading('Level');addField(fields,model.document,'title');
      heading('Bounds');for(const key of ['minX','maxX','minY','maxY'])addField(fields,model.document.bounds,key,'Bounds / ');
      heading('World rules');for(const key of Object.keys(model.document.settings))addField(fields,model.document.settings,key,'Settings / ');
      const actions=document.createElement('div');actions.className='editor-level-actions';
      for(const [action,label] of [['clearAll','Clear all elements'],['startNew','Start new level']]){const button=document.createElement('button');button.type='button';button.dataset.action=action;button.textContent=label;actions.append(button);}
      fields.append(actions);
      return;
    }
    heading(model.selected?`Selected: ${model.selected}`:'Select an element');
    const selected=model.selectedObject;
    if(!selected){const hint=document.createElement('p');hint.className='editor-tab-help';hint.textContent='Tap a wall, the start, the exit, or any element to edit it. Place a new element from the toolbar.';fields.append(hint);return;}
    const type=model.selected==='start'||model.selected==='exit'?model.selected:model.document.walls.includes(selected)?'wall':(model.document.wallPaths||[]).includes(selected)?'wallPath':selected.type;
    if(type==='ember'){
      for(const key of fieldSpecs.ember)addField(fields,selected,key,(key==='x'||key==='y')&&selected.motion==='orbit'?'Center ':key==='radius'?'Body ':'');
      if(selected.motion==='orbit'){
        addField(fields,selected,'orbitRadius');addOrbitPeriodField(selected);
        addField(fields,selected,'orbitDirection','');addField(fields,selected,'phase','Starting ');
      }else if(selected.motion==='chaser')addField(fields,selected,'speed','Movement ');
    }else for(const key of fieldSpecs[type]||[])addField(fields,selected,key);
    if(type==='wallPath') selected.points.forEach((point,index)=>{
      const row=document.createElement('div');row.className='editor-path-point';const heading=document.createElement('span');heading.textContent=`Point ${index+1}`;row.append(heading);
      for(const axis of ['x','y']){const label=document.createElement('label');label.textContent=axis.toUpperCase();const input=document.createElement('input');input.type='number';input.step='any';input.value=point[axis];input.addEventListener('input',()=>{const value=input.value===''?NaN:Number(input.value);const current=model.selectedObject?.points?.[index]?.[axis];if(Object.is(current,value))return;model.paint(doc=>{doc.wallPaths.find(path=>path.id===model.selected).points[index][axis]=value;});refresh(false);});input.addEventListener('blur',()=>{model.endStroke();refresh(false);});label.append(input);row.append(label);}
      const remove=document.createElement('button');remove.type='button';remove.textContent='−';remove.title=`Remove point ${index+1}`;remove.setAttribute('aria-label',`Remove point ${index+1}`);remove.disabled=selected.points.length<=2;remove.addEventListener('click',()=>{model.endStroke();model.transact(doc=>doc.wallPaths.find(path=>path.id===model.selected).points.splice(index,1));refresh();});row.append(remove);fields.append(row);
    });
    if(type!=='start'&&type!=='exit'){const button=document.createElement('button');button.textContent='Delete selected';button.type='button';button.addEventListener('click',()=>{model.endStroke();model.transact(doc=>{doc.walls=doc.walls.filter(w=>w.id!==model.selected);doc.wallPaths=(doc.wallPaths||[]).filter(path=>path.id!==model.selected);doc.entities=doc.entities.filter(e=>e.id!==model.selected);});model.selected=null;refresh();});fields.append(button);}
  }
  function lineButtons(){for(const button of root.querySelectorAll('.editor-line-action'))button.classList.toggle('hidden',!lineDraft?.length);}
  function cancelLine(){lineDraft=null;lineCursor=null;lineButtons();draw();}
  function finishLine(){
    if(!lineDraft||lineDraft.length<2){cancelLine();return;}
    const points=lineDraft;const id=model.nextId('path');const thickness=Number($('#editorBrush').value);
    model.endStroke();model.transact(doc=>{doc.wallPaths ||= [];doc.wallPaths.push({id,thickness,points});});
    model.selected=id;cancelLine();setInspectorTab('selected');
  }
  root.addEventListener('click',event=>{const button=event.target.closest('button[data-action],button[data-tool],button[data-inspector-tab]');if(!button)return;
    if(button.dataset.inspectorTab){setInspectorTab(button.dataset.inspectorTab);return;}
    const action=button.dataset.action;
    if(button.dataset.tool){if(tool==='line'&&button.dataset.tool!=='line')cancelLine();tool=button.dataset.tool;presetCursor=null;editorNotice='';$('#editorEntityTool').value='';for(const tab of root.querySelectorAll('[data-tool]'))tab.setAttribute('aria-pressed',String(tab===button));draw();return;}
    if(action==='home'){hide();onHome();}
    if(action==='save')save();
    if(action==='import')fileInput.click();
    if(action==='export'){const checked=validateLevelDocument(model.document);if(!checked.ok)return;const blob=new Blob([JSON.stringify(checked.document,null,2)+'\n'],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`${checked.document.id}.json`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);}
    if(action==='play'){const checked=validateLevelDocument(model.document);if(checked.ok){hide();onPlay(clone(checked.document));}}
    if(action==='undo'){model.undo();refresh();}if(action==='redo'){model.redo();refresh();}
    if(action==='clearAll'){cancelLine();model.clearAll();setInspectorTab('level');refresh();}
    if(action==='startNew'){cancelLine();model.startNew();setInspectorTab('level');fit();refresh();}
    if(action==='finishLine')finishLine();if(action==='cancelLine')cancelLine();
    if(action==='fit')fit();if(action==='zoomin'){scale=Math.min(100,scale*1.25);draw();}if(action==='zoomout'){scale=Math.max(2,scale/1.25);draw();}
    if(action==='drawer')root.classList.add('inspector-open');if(action==='closeDrawer')root.classList.remove('inspector-open');
  });
  $('#editorEntityTool').addEventListener('change',event=>{cancelLine();tool=event.target.value?`entity:${event.target.value}`:'select';presetCursor=null;editorNotice='';for(const tab of root.querySelectorAll('[data-tool]'))tab.setAttribute('aria-pressed','false');draw();});
  fileInput.addEventListener('change',async()=>{const file=fileInput.files?.[0];fileInput.value='';if(!file)return;const checked=parseLevelDocument(await file.text());if(!checked.ok){$('#editorValidation').textContent=`Import rejected: ${checked.errors.join(' · ')}`;$('#editorValidation').classList.add('invalid');return;}cancelLine();model.replace(checked.document);setInspectorTab('level');fit();refresh();});
  canvas.addEventListener('pointerdown',event=>{if(event.button!==0)return;canvas.setPointerCapture(event.pointerId);const p=world(event);pointer={id:event.pointerId,last:{x:event.clientX,y:event.clientY},world:p,lastWorld:p,moved:false,vertex:null};
    if(tool==='wall'||tool==='erase')paintAt(p,tool==='erase');
    else if(tool==='select'){
      model.selected=selectAt(p);
      const path=(model.document.wallPaths||[]).find(item=>item.id===model.selected);
      if(path)pointer.vertex=path.points.findIndex(point=>Math.hypot(point.x-p.x,point.y-p.y)<Math.max(.55,8/scale));
    }
    draw();});
  canvas.addEventListener('pointermove',event=>{if(!pointer||pointer.id!==event.pointerId)return;const p=world(event),dx=event.clientX-pointer.last.x,dy=event.clientY-pointer.last.y;if(Math.abs(dx)+Math.abs(dy)>1)pointer.moved=true;
    if(tool==='pan'){offset.x+=dx;offset.y+=dy;}
    else if(tool==='wall'||tool==='erase'){
      const distance=Math.hypot(p.x-pointer.lastWorld.x,p.y-pointer.lastWorld.y),steps=Math.ceil(distance/.45);
      for(let i=1;i<=steps;i++)paintAt({x:pointer.lastWorld.x+(p.x-pointer.lastWorld.x)*i/steps,y:pointer.lastWorld.y+(p.y-pointer.lastWorld.y)*i/steps},tool==='erase');
    }
    else if(tool==='line'){lineCursor=snapPoint(p);}
    else if(tool==='select'&&model.selected&&pointer.moved){const target=model.selected,at=snapPoint(p),path=(model.document.wallPaths||[]).find(item=>item.id===target);
      if(path){
        if(pointer.vertex>=0)model.paint(doc=>{doc.wallPaths.find(item=>item.id===target).points[pointer.vertex]=at;});
        else {const previous=snapPoint(pointer.lastWorld),delta={x:at.x-previous.x,y:at.y-previous.y};if(delta.x||delta.y)model.paint(doc=>{for(const point of doc.wallPaths.find(item=>item.id===target).points){point.x+=delta.x;point.y+=delta.y;}});}
      }else if(pointer.orbitPart==='body'){
        const previous=snapPoint(pointer.lastWorld),delta={x:at.x-previous.x,y:at.y-previous.y};
        if(delta.x||delta.y)model.paint(doc=>{const item=doc.entities.find(e=>e.id===target);item.x+=delta.x;item.y+=delta.y;});
      }else model.paint(doc=>{const object=target==='start'||target==='exit'?doc[target]:[...doc.walls,...doc.entities].find(e=>e.id===target);if(object){object.x=at.x;object.y=at.y;}});
    }
    pointer.last={x:event.clientX,y:event.clientY};pointer.lastWorld=p;draw();
  });
  const pointerEnd=event=>{if(!pointer||pointer.id!==event.pointerId)return;const p=world(event);
    if(!pointer.moved){if(tool==='line'){
        const at=snapPoint(p),bounds=model.document.bounds;
        if(at.x>=bounds.minX&&at.x<=bounds.maxX&&at.y>=bounds.minY&&at.y<=bounds.maxY&&(!lineDraft?.length||Math.hypot(at.x-lineDraft.at(-1).x,at.y-lineDraft.at(-1).y)>1e-5)){lineDraft ||= [];lineDraft.push(at);lineButtons();}
      }else if(tool==='start'||tool==='exit'){const at=snapPoint(p);model.transact(doc=>Object.assign(doc[tool],at));model.selected=tool;}
      else if(tool==='entity:orbitRing'){
        const result=model.addOrbitRing(snapPoint(p));editorNotice=result.ok?'':result.error;
      }else if(tool.startsWith('entity:')){const entity=defaultEntity(tool.slice(7),snap(p.x),snap(p.y),model);model.transact(doc=>doc.entities.push(entity));model.selected=entity.id;editorNotice='';}}
    model.endStroke();pointer=null;
    if(model.selected && (tool==='select'||tool==='start'||tool==='exit'||tool.startsWith('entity:')))setInspectorTab('selected');
    else refresh();};
  canvas.addEventListener('pointerup',pointerEnd);canvas.addEventListener('pointercancel',pointerEnd);
  canvas.addEventListener('pointermove',event=>{if(tool==='line'&&!pointer&&lineDraft?.length){lineCursor=snapPoint(world(event));draw();}else if(tool==='entity:orbitRing'&&!pointer){presetCursor=snapPoint(world(event));draw();}});
  canvas.addEventListener('dblclick',()=>{if(tool==='line')finishLine();});
  canvas.addEventListener('wheel',event=>{event.preventDefault();const rect=canvas.getBoundingClientRect(),before=world({clientX:event.clientX,clientY:event.clientY});scale=Math.max(2,Math.min(100,scale*(event.deltaY<0?1.1:.9)));offset.x=event.clientX-rect.left-before.x*scale;offset.y=event.clientY-rect.top+before.y*scale;draw();},{passive:false});
  root.addEventListener('keydown',event=>{if(event.target instanceof HTMLInputElement||event.target instanceof HTMLSelectElement)return;if(tool==='line'&&event.key==='Enter'){event.preventDefault();finishLine();return;}if(tool==='line'&&event.key==='Escape'){event.preventDefault();cancelLine();return;}if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='z'){event.preventDefault();if(event.shiftKey)model.redo();else model.undo();refresh();}else if((event.key==='Delete'||event.key==='Backspace')&&model.selected&&!['start','exit'].includes(model.selected)){event.preventDefault();model.transact(doc=>{doc.walls=doc.walls.filter(e=>e.id!==model.selected);doc.wallPaths=(doc.wallPaths||[]).filter(e=>e.id!==model.selected);doc.entities=doc.entities.filter(e=>e.id!==model.selected);});model.selected=null;refresh();}});
  const observer=new ResizeObserver(drawOrRefit);observer.observe(canvas);
  function show(){open=true;root.classList.remove('hidden');refresh();requestAnimationFrame(hasFit?drawOrRefit:fit);}
  function hide(){cancelLine();open=false;root.classList.add('hidden');root.classList.remove('inspector-open');}
  function loadDocument(document) {
    const checked = validateLevelDocument(document);
    if (!checked.ok) return false;
    cancelLine();
    model.endStroke();
    model.transact(draft => { for (const key of Object.keys(draft)) delete draft[key]; Object.assign(draft, clone(checked.document)); });
    model.selected = null; setInspectorTab('level');
    hasFit = false;
    if (open) fit();
    return true;
  }
  return { show, hide, loadDocument, get open(){return open;}, get document(){return clone(model.document);}, model };
}
