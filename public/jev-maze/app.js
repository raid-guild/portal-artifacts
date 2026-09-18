import {hostedDecision,hostedKeyCheck} from './api.js';
const hosted=document.documentElement?.dataset.hosted==='true';
import {DIRS,SYMBOLS,generate,decorate,connect,neighbor,exits,createRunner,candidates,localState,advance,shortestPath,emptyExperience,configureMaze,decorateSemantic,baselineChoice} from './engine.js';
const $=id=>document.getElementById(id);
const symbolGlyph={zigzag:'⌁',circle:'○',bars:'Ⅱ'};
let maze,jev,dfs,configured=false,running=false,busy=false,epoch=0,round=1,roundLimit=1,batchCalls=0,logs=[],history=[],recorded=false,baseSeed='',selectedCell=0;
let personalKey='',serverConfigured=false,keyChecking=false,currentModel='jev-latest';
const keyHeaders=()=>personalKey?{'X-Jev-Key':personalKey}:{};
function connectionStatus(){configured=Boolean(personalKey)||serverConfigured;$('connection').textContent=configured?`Jev ready · ${personalKey?'personal key':'server key'} · ${currentModel}`:'Enter a Jev API key';$('connection').classList.toggle('connected',configured);controls();}
let onlyDFS=false,activeSettings,loopId=0,randomRunner,keywordRunner,initialMaze;
const baselineRunners=()=>[["dfs",dfs],["random",randomRunner],["keyword",keywordRunner]];
const pendingSettings=()=>JSON.stringify(settings())!==JSON.stringify(activeSettings);
const terminal=r=>['found','exhausted','skipped'].includes(r.status);
function notice(message,error=false){$('notice').textContent=message;$('notice').classList.toggle('error',error);}
function settings(){return {n:Number($('size').value),seed:$('seed').value.trim()||'maze',reliability:Number($('reliability').value),loops:Number($('loops').value),mode:$('mode').value,task:$('task').value};}
function fresh(blank=false){
  if(busy)return;
  running=false;loopId++;epoch++;round=1;roundLimit=1;batchCalls=0;logs=[];history=[];recorded=false;onlyDFS=false;activeSettings=settings();baseSeed=activeSettings.seed;
  maze=configureMaze(activeSettings);
  if(blank){maze.cells.fill(0);decorate(maze,baseSeed,activeSettings.reliability);$('editing').checked=true;}
  if(activeSettings.mode==='semantic')decorateSemantic(maze,activeSettings.task,activeSettings.reliability);
  initialMaze=structuredClone(maze);selectedCell=0;resetRunners();render();renderHistory();renderInspector();
  notice(blank?'Draw passages with Erase wall. Place start and goal, then turn editing off.':'Ready. Jev chooses at forks; both runners automatically traverse corridors and backtrack.');
}
function resetRunners(keep=false){jev=createRunner(maze,'Jev',keep?jev.experience:emptyExperience());dfs=createRunner(maze,'DFS',keep?dfs.experience:emptyExperience());randomRunner=createRunner(maze,'Random');keywordRunner=createRunner(maze,'Keyword');recorded=false;}
function reset(){if(busy)return;running=false;loopId++;epoch++;round=1;batchCalls=0;logs=[];history=[];onlyDFS=false;maze=structuredClone(initialMaze);resetRunners();render();renderHistory();renderInspector();notice('Batch reset to its initial maze. Experience and history cleared.');}
function controls(){
  const locked=running||busy||keyChecking;
  for(const id of ['api-key','use-key','clear-key'])$(id).disabled=locked;
  for(const id of ['generate','blank','reset','seed','size','reliability','loops','editing','rounds','budget','carry','mode','task'])$(id).disabled=locked;
  const pending=pendingSettings();
  $('pending-settings').hidden=!pending;
  $('task').disabled=locked||$('mode').value!=='semantic';
  $('carry').disabled=locked||activeSettings.mode==='semantic';
  $('run').disabled=keyChecking||(!running&&pending)||(!configured&&!running)||$('editing').checked||(!running&&busy)||(!running&&onlyDFS);
  $('run').textContent=running?'Pause':'Run comparison';
  $('step').disabled=pending||locked||!configured||$('editing').checked||onlyDFS;
  $('demo').disabled=pending||locked||$('editing').checked;
  $('tool').disabled=!$('editing').checked;
}
function metricHTML(r){return `<div class="metric"><strong>${r.steps}</strong><span>steps</span></div><div class="metric"><strong>${r.seen.size}</strong><span>cells visited</span></div><div class="metric"><strong>${r.backtracks}</strong><span>backtracks</span></div><div class="metric"><strong>${r.name==='Jev'?r.calls:'—'}</strong><span>API calls</span></div>`;}
function render(){
  const viewed=Object.fromEntries(baselineRunners())[$('baseline-view').value];
  draw($('jev-canvas'),jev,'#70e0b8');draw($('dfs-canvas'),viewed,'#f2bb69');
  for(const [id,r] of [['jev',jev],['dfs',viewed]]){$(`${id}-metrics`).innerHTML=metricHTML(r);$(`${id}-status`).textContent=r.status;}
  $('memory').innerHTML=SYMBOLS.map(s=>`<tr><td>${symbolGlyph[s]} ${s}</td>${['dead_end','junction','loop','goal'].map(k=>`<td>${jev.experience[s][k]}</td>`).join('')}</tr>`).join('');
  const shortest=shortestPath(maze);$('optimal').textContent=shortest===null?'Goal is disconnected':`Full-map shortest: ${shortest} steps`;
  $('rule').textContent=`Predictive symbol: ${symbolGlyph[maze.rule.bad]} ${maze.rule.bad}. Reliability: ${Math.round(maze.rule.reliability*100)}%. This rule and unobserved outcomes are never sent to Jev.`;
  const semantic=maze.mode==='semantic';
  $('active-settings').textContent=`Active: ${semantic?'Semantic rooms':'Symbol learning'} · ${Math.round(maze.rule.reliability*100)}% reliability · round ${round} · ${maze.seed}`;
  $('jev-subtitle').textContent=semantic?'Semantic choices':'Evidence-guided DFS';
  $('semantic-panel').hidden=!semantic;$('symbol-memory').hidden=semantic;$('semantic-memory').hidden=!semantic;
  if(semantic){
    $('objective').textContent=maze.objective;
    $('rule').textContent=`Signs describe areas serving the goal with probability ${Math.round(maze.rule.reliability*100)}% when the passage reduces shortest-path distance, and ${Math.round((1-maze.rule.reliability)*100)}% otherwise.`;
    $('rule-explanation').textContent='Synthetic benchmark: the builder uses full-map distances to place relevant descriptions and distractors. No explorer receives those distances or relevance labels. At 50%, sign relevance is independent of direction quality. Closed passages are actual walls.';
    $('room-signs').replaceChildren();
    for(const e of exits(maze,jev.pos)){
      const p=document.createElement('p');p.textContent=`${e.direction.toUpperCase()} · ${e.description} (${jev.seen.has(e.to)?'visited':'unexplored'})`;$('room-signs').append(p);
    }
  }else $('rule-explanation').textContent='Reliability is P(predictive symbol | dead end) and P(other symbol | not dead end), not P(dead end | symbol). The two other symbols are interchangeable. The rule stays fixed across rounds.';
  $('baseline-live').textContent=baselineRunners().map(([kind,r])=>`${kind}: ${r.steps} steps · ${r.status}`).join(' / ');
  controls();
}
function draw(canvas,r,color){
  const ctx=canvas.getContext('2d'),w=canvas.width,pad=20,size=(w-pad*2)/maze.n;
  const xy=id=>[pad+(id%maze.n+.5)*size,pad+(Math.floor(id/maze.n)+.5)*size];
  const visible=id=>$('editing').checked||!$('fog').checked||r.seen.has(id);
  ctx.fillStyle='#111719';ctx.fillRect(0,0,w,w);
  for(let id=0;id<maze.cells.length;id++)if(visible(id)){
    const x=pad+id%maze.n*size,y=pad+Math.floor(id/maze.n)*size;
    ctx.fillStyle=r.seen.has(id)?'#20302f':'#182124';ctx.fillRect(x,y,size,size);
    ctx.strokeStyle='#8c9d9f';ctx.lineWidth=2;ctx.beginPath();
    for(let d=0;d<4;d++)if(!(maze.cells[id]&(1<<d))){const e=[[x,y,x+size,y],[x+size,y,x+size,y+size],[x,y+size,x+size,y+size],[x,y,x,y+size]][d];ctx.moveTo(e[0],e[1]);ctx.lineTo(e[2],e[3]);}ctx.stroke();
  }
  ctx.strokeStyle=color;ctx.lineWidth=3;ctx.globalAlpha=.4;ctx.beginPath();
  for(let i=0;i<r.trail.length;i++){const [x,y]=xy(r.trail[i]);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();ctx.globalAlpha=1;
  for(const [key,count] of Object.entries(r.marks)){
    const [a,b]=key.split('-').map(Number),[ax,ay]=xy(a),[bx,by]=xy(b),x=(ax+bx)/2,y=(ay+by)/2;
    ctx.strokeStyle=color;ctx.lineWidth=2;ctx.beginPath();
    for(let j=0;j<Math.min(count,2);j++){const off=(j-(Math.min(count,2)-1)/2)*5;if(ax===bx){ctx.moveTo(x-4,y+off);ctx.lineTo(x+4,y+off);}else{ctx.moveTo(x+off,y-4);ctx.lineTo(x+off,y+4);}}ctx.stroke();
  }
  if($('symbols').checked && maze.mode!=='semantic'){
    ctx.font=`${Math.max(11,size*.25)}px monospace`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#b6c5bf';
    for(let id=0;id<maze.cells.length;id++)if(visible(id)&&(exits(maze,id).length!==2||id===maze.start))for(const e of exits(maze,id)){
      const [cx,cy]=xy(id),[dx,dy]=[[0,-1],[1,0],[0,1],[-1,0]][e.d];ctx.fillText(symbolGlyph[e.symbol],cx+dx*size*.31,cy+dy*size*.31);
    }
  }
  for(const [id,label,c] of [[maze.start,'S','#70e0b8'],[maze.goal,'G','#f4b2e4']])if(visible(id)){
    const [x,y]=xy(id);ctx.fillStyle='#111719';ctx.fillRect(x-size*.18,y-size*.18,size*.36,size*.36);ctx.fillStyle=c;ctx.font=`bold ${size*.32}px monospace`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(label,x,y);
  }
  if(!$('editing').checked){const [x,y]=xy(r.pos);ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,Math.max(4,size*.11),0,Math.PI*2);ctx.fill();}
  else{const [x,y]=xy(selectedCell);ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.strokeRect(x-size*.42,y-size*.42,size*.84,size*.84);}
}
function renderInspector(){
  const selected=Number($('decisions').value)||0;
  $('decisions').replaceChildren();
  if(!logs.length){$('decisions').add(new Option('No decisions yet','0'));$('payload').textContent='Run Jev to inspect a request.';$('probabilities').replaceChildren();$('decision-count').textContent='No API calls yet';return;}
  logs.forEach((l,i)=>$('decisions').add(new Option(`#${i+1} · round ${l.round} · step ${l.step} · ${l.response?.answers.move.choice||'error'}`,String(i))));
  $('decisions').value=String(Math.min(selected,logs.length-1));showDecision();
}
function showDecision(){
  const log=logs[Number($('decisions').value)];if(!log)return;
  $('decision-count').textContent=`${batchCalls} / ${$('budget').value} calls this batch`;
  $('payload').textContent=JSON.stringify(log,null,2);
  $('probabilities').replaceChildren();
  for(const [direction,p] of Object.entries(log.response?.answers?.move?.probabilities||{})){
    const row=document.createElement('div');row.className='prob-row';
    const name=document.createElement('span');name.textContent=direction;
    const bar=document.createElement('div');bar.className='bar';const fill=document.createElement('i');fill.style.width=`${Math.max(0,Math.min(1,Number(p)))*100}%`;bar.append(fill);
    const value=document.createElement('span');value.textContent=`${Math.round(Number(p)*100)}%`;row.append(name,bar,value);$('probabilities').append(row);
  }
  const note=document.createElement('p');note.textContent=log.response?`Confidence: ${Number(log.response.answers.move.confidence??0).toFixed(2)} · ${log.latencyMs} ms. Evidence judgments are in the full response.`:log.error;$('probabilities').append(note);
}
async function tick(){
  if(busy)return;busy=true;const token=epoch;controls();
  try{
    if(!terminal(jev)&&!onlyDFS){
      const options=candidates(maze,jev);
      if(options.length>1){
        const limit=Math.min(1000,Math.max(1,Number($('budget').value)||100));
        if(batchCalls>=limit){running=false;notice(`Call budget reached (${limit}). Raise the budget to resume, or reset.`,true);return;}
        const state=localState(maze,jev);jev.status='thinking';batchCalls++;jev.calls++;render();
        const start=performance.now();
        let data;
        try{
          if(hosted){data=await hostedDecision(state,personalKey,currentModel);}else{
          const res=await fetch('/api/decision',{method:'POST',headers:{'Content-Type':'application/json',...keyHeaders()},body:JSON.stringify(state)});
          data=await res.json();if(!res.ok)throw Error(data.error||'Jev request failed.');}
        }catch(err){logs.push({round,step:jev.steps,state,error:err.message,latencyMs:Math.round(performance.now()-start)});jev.status='error';running=false;notice(err.message,true);renderInspector();$('decisions').value=String(logs.length-1);showDecision();return;}
        if(token!==epoch)return;
        jev.latencyMs+=data.latencyMs;jev.tokens+=(data.response.usage?.input_tokens||0)+(data.response.usage?.output_tokens||0);
        logs.push({round,step:jev.steps,...data});renderInspector();$('decisions').value=String(logs.length-1);showDecision();advance(maze,jev,data.response.answers.move.choice);
      }else advance(maze,jev);
    }
    for(const [kind,r] of baselineRunners())if(!terminal(r))advance(maze,r,baselineChoice(maze,r,kind));
    if(terminal(jev)&&baselineRunners().every(([,r])=>terminal(r)))finishRound();
  }finally{busy=false;render();}
}
function finishRound(){
  if(recorded)return;recorded=true;
  history.push({round,seed:maze.seed,maze:structuredClone(maze),shortest:shortestPath(maze),jev:{steps:jev.steps,status:jev.status,calls:jev.calls,latencyMs:jev.latencyMs,tokens:jev.tokens},dfs:{steps:dfs.steps,status:dfs.status},random:{steps:randomRunner.steps,status:randomRunner.status},keyword:{steps:keywordRunner.steps,status:keywordRunner.status},experience:structuredClone(jev.experience)});renderHistory();
  if(round>=roundLimit){running=false;notice(`Finished ${history.length} round${history.length===1?'':'s'}. Export includes the maze, outcomes, and all API decisions.`);}
}
function nextRound(){
  round++;maze=configureMaze(activeSettings,round);resetRunners($('carry').checked);if(onlyDFS)jev.status='skipped';render();notice(`Round ${round} / ${roundLimit} · same hidden rule, new maze.`);
}
async function loop(id){
  while(running && id===loopId){
    if(recorded){if(round<roundLimit)nextRound();else{running=false;break;}}
    await tick();
    if(running)await new Promise(resolve=>setTimeout(resolve,Number($('speed').value)));
  }
  controls();
}
function start(dfsOnly=false){
  if(running){running=false;loopId++;notice(busy?'Pausing after this in-flight decision…':'Paused. Resume to continue.');controls();return;}
  if(busy||pendingSettings())return;
  if(recorded&&round>=roundLimit)reset();
  if(dfsOnly&&!onlyDFS&&(jev.steps||dfs.steps||batchCalls))reset();
  onlyDFS=dfsOnly;if(dfsOnly)jev.status='skipped';
  roundLimit=Math.max(round,Number($('rounds').value));running=true;notice(dfsOnly?'Three baseline explorers running; no API calls. Reset to compare with Jev.':`Running round ${round} / ${roundLimit}. Pause at any time.`);controls();loop(++loopId).catch(err=>{running=false;busy=false;notice(err.message,true);render();});
}
function renderHistory(){
  $('history').replaceChildren();
  for(const h of history){const tr=document.createElement('tr');for(const value of [`${h.round} / ${h.seed}`,h.shortest??'unreachable',h.jev.status==='skipped'?'—':h.jev.steps,h.dfs.steps,h.random.steps,h.keyword.steps,h.jev.calls,`${(h.jev.latencyMs/1000).toFixed(1)}s`,`${h.jev.status} / ${h.dfs.status} / ${h.random.status} / ${h.keyword.status}`]){const td=document.createElement('td');td.textContent=value;tr.append(td);}$('history').append(tr);}
  const paired=history.filter(h=>h.jev.status==='found'&&h.dfs.status==='found');
  $('aggregate').textContent=paired.length?`${paired.length} paired finishes · Jev ${Math.round(paired.reduce((a,h)=>a+h.jev.steps,0)/paired.length)} mean steps · DFS ${Math.round(paired.reduce((a,h)=>a+h.dfs.steps,0)/paired.length)} mean steps · Random ${Math.round(paired.reduce((a,h)=>a+h.random.steps,0)/paired.length)} · Keyword ${Math.round(paired.reduce((a,h)=>a+h.keyword.steps,0)/paired.length)} · ${batchCalls} total API attempts`:history.length?`${history.length} completed rounds · ${batchCalls} API attempts · no paired finishes yet`:'Completed rounds will appear here. A batch generates a new maze each round with the same clue rule.';
}
function edit(id,d){
  if(!$('editing').checked||running||busy)return;
  selectedCell=id;const tool=$('tool').value;
  if(tool==='start')maze.start=id;else if(tool==='goal')maze.goal=id;else if(d!==undefined)connect(maze,id,d,tool==='erase');
  decorate(maze,baseSeed,activeSettings.reliability);if(activeSettings.mode==='semantic')decorateSemantic(maze,activeSettings.task,activeSettings.reliability);initialMaze=structuredClone(maze);epoch++;round=1;batchCalls=0;history=[];logs=[];onlyDFS=false;resetRunners();render();renderHistory();renderInspector();notice('Editing resets progress. Click or drag near a wall to change it; changes apply to both mazes.');
}
for(const canvas of [$('jev-canvas'),$('dfs-canvas')]){
  let dragging=false,last='';
  const paint=e=>{const rect=canvas.getBoundingClientRect(),x=(e.clientX-rect.left)*720/rect.width-20,y=(e.clientY-rect.top)*720/rect.height-20,s=680/maze.n,cx=Math.floor(x/s),cy=Math.floor(y/s);if(cx<0||cy<0||cx>=maze.n||cy>=maze.n)return;const fx=x/s-cx,fy=y/s-cy,dist=[fy,1-fx,1-fy,fx],d=dist.indexOf(Math.min(...dist)),id=cy*maze.n+cx,key=`${id}:${d}`;if(key===last)return;last=key;edit(id,d);};
  canvas.addEventListener('pointerdown',e=>{if(!$('editing').checked)return;dragging=true;last='';canvas.setPointerCapture(e.pointerId);paint(e);});
  canvas.addEventListener('pointermove',e=>{if(dragging)paint(e);});
  for(const ev of ['pointerup','pointercancel'])canvas.addEventListener(ev,()=>{dragging=false;last='';});
  canvas.addEventListener('keydown',e=>{if(!$('editing').checked)return;const move={ArrowUp:0,ArrowRight:1,ArrowDown:2,ArrowLeft:3}[e.key];if(move!==undefined){e.preventDefault();const to=neighbor(maze,selectedCell,move);if(to>=0)selectedCell=to;render();return;}const d={w:0,d:1,s:2,a:3}[e.key.toLowerCase()];if(d!==undefined||e.key==='Enter'){e.preventDefault();edit(selectedCell,d);}});
}
for(const id of ['mode','task','seed','size','reliability','loops'])$(id).addEventListener('input',controls);
$('baseline-view').onchange=render;
$('generate').onclick=()=>fresh();$('blank').onclick=()=>fresh(true);$('reset').onclick=reset;
$('run').onclick=()=>start(false);$('demo').onclick=()=>start(true);
$('step').onclick=async()=>{if(pendingSettings())return;if(recorded)reset();roundLimit=1;await tick();};
for(const id of ['fog','symbols','editing'])$(id).onchange=()=>{render();if(id==='editing'&&$('editing').checked)notice('Edit either canvas. Draw or erase walls; use the tool menu to place start and goal.');};
$('decisions').onchange=showDecision;
$('export').onclick=()=>{
  const data={version:2,settings:activeSettings,maze,round,batchCalls,history,decisions:logs,current:{jev:{...jev,seen:[...jev.seen]},dfs:{...dfs,seen:[...dfs.seen]},random:{...randomRunner,seen:[...randomRunner.seen]},keyword:{...keywordRunner,seen:[...keywordRunner.seen]}}};
  const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='jev-maze-experiment.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
fresh();
if(hosted){connectionStatus();}else fetch('/api/status').then(r=>r.json()).then(s=>{serverConfigured=s.configured;currentModel=s.model;connectionStatus();}).catch(()=>{$('connection').textContent='Local server unavailable';});
$('use-key').onclick=async()=>{
  const candidate=$('api-key').value.trim();
  if(!candidate||/[^\x21-\x7e]/.test(candidate)){$('key-status').textContent='Enter a key without spaces.';return;}
  keyChecking=true;controls();$('key-status').textContent='Checking key with TypeSafe…';
  try{
    let data;
    if(hosted){data=await hostedKeyCheck(candidate,currentModel);}else{
    const res=await fetch('/api/check-key',{method:'POST',headers:{'X-Jev-Key':candidate}});
    data=await res.json();if(!res.ok)throw Error(data.error||'Key check failed.');}
    personalKey=candidate;currentModel=data.model;$('api-key').value='';
    $('key-status').textContent='Personal key connected for this tab. It will be used for subsequent decisions and is not included in exports.';
  }catch(err){$('key-status').textContent=`${err.message} The previously active key, if any, is unchanged.`;}
  finally{keyChecking=false;connectionStatus();}
};
$('clear-key').onclick=()=>{personalKey='';$('api-key').value='';$('key-status').textContent=serverConfigured?'Personal key cleared. Subsequent decisions use the server .env key.':'Personal key cleared. Enter a key to use Jev.';connectionStatus();};

// Optional browser agent interface; it uses the same state and actions as the UI.
if(document.modelContext?.registerTool){
  const lifecycle=new AbortController();window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
  Promise.resolve(document.modelContext.registerTool({name:'inspect_maze_experiment',description:'Read the visible local maze experiment and completed results. Does not run Jev or reveal any credentials.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:(input)=>{if(!input||typeof input!=='object'||Object.keys(input).length)throw Error('Expected an empty object.');return {round,running,batchCalls,activeSettings,history:history.map(({maze,experience,...summary})=>summary),jev:{status:jev.status,steps:jev.steps,experience:jev.experience},dfs:{status:dfs.status,steps:dfs.steps}};}},{signal:lifecycle.signal})).catch(()=>{});
}
