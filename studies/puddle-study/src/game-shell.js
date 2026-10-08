import './game.css';
import {GARDEN,GARDEN_LEVELS,gardenHint,gardenCanCast} from './garden-level.js';
import {groundAt} from './colliders.js';
import {cameraShortcutAction} from './game-camera.js';
import {createGameProgress,meetsUnlockThreshold} from './game-progress.js';
import {gripKey} from './grip-ramp.js';
import {createLocalLevelLibrary,createLocalLevelProgress,localStorageForPage,localPageQuery} from './local-levels.js';

export function setupGameShell(sim,{clearInputs,onChange,onStart=()=>{},onCameraToggle=()=>{},cameraMode=()=> 'follow',
  onLocalReady=async()=>{},
  progress=createGameProgress({storage:localStorageForPage()}),devAccess=import.meta.env.DEV,
  localLibrary=createLocalLevelLibrary({storage:localStorageForPage()}),
  localProgress=createLocalLevelProgress({storage:localStorageForPage()})}={}){
  const root=document.createElement('div');root.id='game-shell';
  root.innerHTML=`<div class="game-top"><div><span class="eyebrow">PUDDLE / 01</span><h2>Gathering Garden</h2></div><div class="game-score" aria-label="Collection progress"><span id="gem-score">◇ 0 / 3</span><span id="gold-score">● 0 / 17</span><button id="game-camera" type="button" aria-label="Camera: Follow. Press C to switch view">Camera: Follow <kbd>C</kbd></button><button id="game-menu">Menu <kbd>ESC</kbd></button></div></div>
    <div class="game-hint"><b id="lesson-title" role="status"></b><p id="lesson-text"></p><small id="game-tendril-status" hidden></small></div>
    <div id="game-overlay" class="game-overlay"><section id="game-card-section" class="game-card" aria-labelledby="game-title"><div id="game-main-card"><div class="eyebrow" id="game-eyebrow">A LIVING MATERIAL</div><h1 id="game-title">Puddle</h1><p id="game-copy">A small body. A strange garden.<br>Gather, take shape, and find the way down.</p><div id="game-results"></div><div class="game-buttons"><button id="game-primary">Begin</button><button id="game-secondary" hidden>Keep exploring</button><button id="game-levels">Levels</button><button id="game-studies">Material studies</button><button id="game-exit" type="button" hidden>Exit to title</button></div><p class="game-footnote" id="game-footnote">Gathering Garden · the first playable level</p></div><div id="game-level-screen" hidden><div class="eyebrow">YOUR TOWER</div><h1 id="game-level-title">Levels</h1><div class="game-level-tabs" role="tablist" aria-label="Level source"><button id="game-campaign-tab" type="button" role="tab">Campaign</button><button id="game-local-tab" type="button" role="tab">Local Levels</button></div><p id="game-level-instructions">Finish at least half the gold and gems in a garden to unlock the next.</p><label id="game-dev-access" hidden><input type="checkbox" checked> Development: play any level</label><div id="game-level-list"></div><div class="game-buttons"><button id="game-level-back">Back</button></div></div></section></div>`;
  document.querySelector('#app').append(root);
  if(new URLSearchParams(globalThis.location?.search||'').get('storage')==='test'){
    const badge=document.createElement('small');badge.className='game-test-badge';
    badge.textContent='ISOLATED TEST SESSION';root.querySelector('.game-top > div').append(badge);}
  const $=id=>root.querySelector(id);
  const studyLinks=document.createElement('div');studyLinks.className='game-buttons game-study-links';
  studyLinks.innerHTML='<a href="./music-source/index.html" target="_blank" rel="noopener">Music studies ↗</a><a href="./editor.html" target="_blank" rel="noopener">Level editor ↗</a>';
  studyLinks.querySelector('a[href^="./editor"]').href=`./editor.html${localPageQuery()}`;
  root.querySelector('#game-main-card .game-buttons').after(studyLinks);
  let overlayState='',levelScreen=false,levelTab='campaign',devPlayAny=!!devAccess,localRequest=0;
  const devToggle=$('#game-dev-access');devToggle.hidden=!devAccess;
  devToggle.querySelector('input').checked=devPlayAny;
  const canPlayLevel=id=>progress.isUnlocked(id)||devPlayAny;
  async function playLocal(id){
    const request=++localRequest,entry=localLibrary.get(id);if(!entry)return;
    const button=[...$('#game-level-list').querySelectorAll('button')].find(b=>b.dataset.localPlay===id);
    if(button){button.disabled=true;button.textContent='Loading…';}
    try{
      // Loading the workshop (and its Manifold WASM) is deliberately deferred
      // until a local card is played; campaign startup stays lightweight.
      const {importDraft,validateDraft,compileDraft}=await import('./editor-workbench.js');
      if(request!==localRequest||!levelScreen)return;
      const draft=importDraft(entry.document),checks=validateDraft(draft);
      if(checks.errors.length)throw new Error(checks.errors[0]);
      const level=compileDraft(draft);
      level.editorCustom=true;level.editorCanShed=true;
      await onLocalReady(level,()=>request===localRequest&&levelScreen);
      if(request!==localRequest||!levelScreen)return;
      levelScreen=false;onStart();sim.startLocalGarden(level,{id:entry.id,revision:entry.revision});change();
    }catch(error){if(request!==localRequest)return;
      const card=button?.closest('.game-level-row');let note=card?.querySelector('.game-local-error');
      if(card&&!note){note=document.createElement('small');note.className='game-local-error';card.firstChild.append(note);}
      if(note)note.textContent=`Cannot play: ${error.message}. Open Edit to repair it.`;
      if(button){button.disabled=false;button.textContent='Play';}}
  }
  function renderLevels(){
    const list=$('#game-level-list');list.replaceChildren();
    $('#game-campaign-tab').setAttribute('aria-selected',String(levelTab==='campaign'));
    $('#game-local-tab').setAttribute('aria-selected',String(levelTab==='local'));
    $('#game-level-instructions').textContent=levelTab==='campaign'?
      'Finish at least half the gold and gems in a garden to unlock the next.':
      'Your saved Workshop gardens. They play separately from campaign progress.';
    devToggle.hidden=levelTab!=='campaign'||!devAccess;
    if(levelTab==='local'){
      const entries=localLibrary.list();
      if(!entries.length){const empty=document.createElement('p');empty.textContent='No local levels yet. Save a garden from the Level Workshop.';
        const link=document.createElement('a');link.href=`./editor.html${localPageQuery()}`;link.textContent='Open Level Workshop ↗';
        empty.append(' ',link);list.append(empty);return;}
      for(const entry of entries){const card=document.createElement('div');card.className='game-level-row';
        const details=document.createElement('div'),title=document.createElement('b'),note=document.createElement('small');
        title.textContent=entry.name;const best=localProgress.getBest(entry.id,entry.revision);
        note.textContent=best?`Best ${best.percent}% · ${best.gems}/${best.totalGems} gems · ${best.gold}/${best.totalGold} gold`:
          `Not played · revision ${entry.revision}`;details.append(title,note);
        const play=document.createElement('button');play.type='button';play.textContent=best?'Replay':'Play';
        play.dataset.localPlay=entry.id;play.addEventListener('click',()=>playLocal(entry.id));
        const edit=document.createElement('a');edit.href=`./editor.html${localPageQuery()}${localPageQuery()?'&':'?'}level=${encodeURIComponent(entry.id)}`;
        edit.textContent='Edit';edit.setAttribute('aria-label',`Edit ${entry.name}`);
        card.append(details,play,edit);list.append(card);}
      return;
    }
    for(const level of GARDEN_LEVELS){
      const card=document.createElement('div');card.className='game-level-row';
      const details=document.createElement('div'),title=document.createElement('b'),note=document.createElement('small');
      title.textContent=`${String(level.id).padStart(2,'0')} / ${level.name}`;
      const best=progress.getBest(level.id),unlocked=progress.isUnlocked(level.id);
      const score=`Best ${best?.percent??0}%`+(best?` · ${best.gems}/${level.gems.length} gems · ${best.gold}/${level.gold.length} gold`:'');
      note.textContent=`${score} · ${unlocked?'Ready to explore':
        `${devPlayAny?'Development access':'Locked'} · finish Level ${level.id-1} with at least 50%`}`;
      details.append(title,note);
      const button=document.createElement('button');button.type='button';button.textContent=best?'Replay':'Play';
      button.disabled=!canPlayLevel(level.id);button.setAttribute('aria-label',`${button.textContent} ${level.name}`);
      button.addEventListener('click',()=>{if(!canPlayLevel(level.id))return;levelScreen=false;onStart();sim.startGarden(level.id,{newGame:true});change();});
      card.append(details,button);list.append(card);
    }
  }
  function openLevels(){if(sim.selectedTest!=='garden'||!['title','paused'].includes(sim.garden.phase))return;
    levelScreen=true;renderLevels();update();$('#game-level-back').focus({preventScroll:true});}
  function closeLevels(){if(!levelScreen)return;levelScreen=false;localRequest++;update();$('#game-levels').focus({preventScroll:true});}
  function change(){clearInputs();onChange();update();}
  function start(){onStart();sim.startGarden(1,{newGame:true});change();}
  function menu(){if(sim.selectedTest==='garden'&&sim.garden.phase==='playing'){sim.garden.phase='paused';change();}}
  $('#game-menu').addEventListener('click',menu);
  $('#game-camera').addEventListener('click',()=>{onCameraToggle();update();});
  $('#game-levels').addEventListener('click',openLevels);
  $('#game-level-back').addEventListener('click',closeLevels);
  $('#game-campaign-tab').addEventListener('click',()=>{levelTab='campaign';localRequest++;renderLevels();});
  $('#game-local-tab').addEventListener('click',()=>{levelTab='local';renderLevels();});
  globalThis.addEventListener?.('storage',event=>{if(levelScreen&&levelTab==='local'&&event.key?.includes('puddle.local-levels.v1'))renderLevels();});
  devToggle.querySelector('input').addEventListener('change',event=>{devPlayAny=!!devAccess&&event.target.checked;renderLevels();update();});
  $('#game-primary').addEventListener('click',()=>{
    if(sim.garden.phase==='paused'){sim.garden.phase='playing';change();}
    else if(sim.isLocalGarden&&sim.garden.phase==='complete'){sim.restartGarden();change();}
    else if(sim.garden.phase==='complete'&&sim.gardenLevelId<GARDEN_LEVELS.length){
      if(canPlayLevel(sim.gardenLevelId+1))sim.continueGarden();else sim.restartGarden();change();}
    else start();
  });
  $('#game-secondary').addEventListener('click',()=>{
    if(sim.garden.phase==='complete'){
      const level=sim.gardenLevel,f=sim.fluid,b=f.brain;
      const rimX=level.id>1?level.exit.x+1.5:level.exit.x-1.5;
      const dx=rimX-b.x,dz=level.exit.z-b.z;
      // Return the same living body to the rim; collected items and score stay put.
      const colliders=sim.activeColliders();
      for(const p of f.particles)if(!p.feedstock){
        const lift=Math.max(0,p.y-groundAt(p.x,p.z,colliders).height-f.radius-.008);
        p.x+=dx;p.z+=dz;
        p.y=groundAt(p.x,p.z,colliders).height+f.radius+.008+lift;
        p.px=p.x;p.py=p.y;p.pz=p.z;p.vx=p.vy=p.vz=0;
      }
      f.contractAnchor=null;sim.garden.phase='playing';sim.garden.drainTime=0;change();
    }else{sim.restartGarden();change();}
  });
  $('#game-exit').addEventListener('click',()=>{
    if(sim.garden.phase!=='paused')return;
    localRequest++;levelScreen=false;
    sim.startGarden(1,{newGame:true});sim.garden.phase='title';
    change();$('#game-primary').focus({preventScroll:true});
  });
  $('#game-studies').addEventListener('click',()=>{sim.setupRetrieval();change();});
  const returnButton=document.createElement('button');returnButton.id='return-to-game';returnButton.textContent='PLAY GARDEN';returnButton.addEventListener('click',start);document.querySelector('.test-controls').prepend(returnButton);
  function update(){
    const gripPractice=document.querySelector('[data-test="grip"]');
    if(gripPractice){gripPractice.disabled=!canPlayLevel(5);gripPractice.title=gripPractice.disabled?'Unlock Grip Garden by finishing Level 4 with at least 50%':'';}
    const game=sim.selectedTest==='garden';document.body.classList.toggle('playing-game',game);root.hidden=!game;
    if(!game){root.classList.remove('in-menu');return;}
    const s=sim.garden,level=sim.gardenLevel,overlay=['title','paused','complete'].includes(s.phase);
    if(s.phase==='complete'){
      if(sim.isLocalGarden)localProgress.recordCompletion(sim.localRun.id,sim.localRun.revision,
        {gold:s.goldCount,gems:s.gemCount,totalGold:s.gold.length,totalGems:s.gems.length});
      else progress.recordCompletion(level.id,{gold:s.goldCount,gems:s.gemCount});
    }
    root.querySelector('.game-top .eyebrow').textContent=sim.isLocalGarden?'PUDDLE / LOCAL':`PUDDLE / 0${level.id}`;
    root.querySelector('.game-top h2').textContent=level.name;
    $('#game-overlay').hidden=!overlay;root.classList.toggle('in-menu',overlay);
    $('#game-main-card').hidden=levelScreen;$('#game-level-screen').hidden=!levelScreen;
    $('#game-card-section').setAttribute('aria-labelledby',levelScreen?'game-level-title':'game-title');
    $('#gem-score').textContent=`◇ ${s.gemCount} / ${s.gems.length} gems`;$('#gold-score').textContent=`● ${s.goldCount} / ${s.gold.length} gold`;
    const view=cameraMode()==='follow'?'Follow':'Tower';
    $('#game-camera').innerHTML=`Camera: ${view} <kbd>C</kbd>`;
    $('#game-camera').setAttribute('aria-label',`Camera: ${view}. Press C to switch view`);
    $('#game-camera').setAttribute('aria-pressed',String(view==='Follow'));
    const [title,text]=gardenHint(sim);if($('#lesson-title').textContent!==title)$('#lesson-title').textContent=title;if($('#lesson-text').textContent!==text)$('#lesson-text').textContent=text;
    const status=$('#game-tendril-status');status.hidden=!gardenCanCast(level)&&!level.grip;
    if(gardenCanCast(level))status.textContent=(sim.tendril.feedback&&sim.fluid.time<sim.tendril.feedbackUntil?
      sim.tendril.feedback:`${sim.tendril.count} / 3 STRANDS · ${sim.tendril.recalling?'RECALLING · TAP SPACE TO PAUSE':'CLICK OR E TO CAST · TAP SPACE TO RECALL'}`)+
      (level.grip?(sim.fluid.gripClimbing?' · GRIPPING':' · SAGE GRIPS / AQUA SLIPS'):'');
    else if(level.grip)status.textContent=sim.fluid.gripClimbing?
      `GRIPPING · KEEP PRESSING ${gripKey(level.grip.ramp,level.grip.platform,sim.brain)}`:
      sim.brain.x>=level.slip.minX&&sim.brain.x<=level.slip.maxX&&sim.brain.z>=level.slip.minZ&&sim.brain.z<=level.slip.maxZ?
        'SLIPPING · BRAKE EARLY':'RIBBED SAGE HOLDS · SMOOTH AQUA SLIPS';
    if(`${sim.isLocalGarden?'local:'+sim.localRun.id+':'+sim.localRun.revision:level.id}:${s.phase}:${levelScreen}:${levelTab}`!==overlayState){
      overlayState=`${sim.isLocalGarden?'local:'+sim.localRun.id+':'+sim.localRun.revision:level.id}:${s.phase}:${levelScreen}:${levelTab}`;
      $('#game-title').textContent=s.phase==='paused'?'A quiet moment':s.phase==='complete'?'Garden explored':'Puddle';
      $('#game-eyebrow').textContent=s.phase==='complete'?`${level.name.toUpperCase()} / COMPLETE`:s.phase==='paused'?'PAUSED':'A LIVING MATERIAL';
      const nextLocked=!sim.isLocalGarden&&s.phase==='complete'&&level.id<GARDEN_LEVELS.length&&!canPlayLevel(level.id+1);
      $('#game-copy').innerHTML=s.phase==='complete'?(nextLocked?'You found the way down. Collect at least 50% of this garden to unlock the next.':'You found the way down.'):
        s.phase==='paused'?'Take your time. The garden will wait.':'A small body. A strange garden.<br>Gather, take shape, and find the way down.';
      if(sim.isLocalGarden&&s.phase==='complete'&&localProgress.saveFailed)
        $('#game-copy').textContent+=' Your score is kept for this session, but could not be saved on this device.';
      $('#game-primary').textContent=s.phase==='paused'?'Resume':s.phase==='complete'?(sim.isLocalGarden?'Replay':
        level.id<GARDEN_LEVELS.length?(nextLocked?'Retry level':`Continue to Level ${level.id+1}`):'New game'):'Begin';
      $('#game-secondary').hidden=s.phase==='title';$('#game-secondary').textContent=s.phase==='complete'?'Keep exploring':'Restart level';
      $('#game-levels').hidden=!['title','paused'].includes(s.phase);
      $('#game-exit').hidden=s.phase!=='paused';
      studyLinks.hidden=levelScreen||s.phase!=='title';
      const scores={...sim.completedLevels,[level.id]:{gems:s.gemCount,gold:s.goldCount,totalGold:s.gold.length}};
      $('#game-results').textContent=s.phase==='complete'&&sim.isLocalGarden?
        `${level.name}: ${s.gemCount} / ${s.gems.length} gems · ${s.goldCount} / ${s.gold.length} gold · ${s.gold.length+s.gems.length?Math.round((s.goldCount+s.gemCount)/(s.gold.length+s.gems.length)*100):100}%`:
        s.phase==='complete'?GARDEN_LEVELS.slice(0,level.id).filter(l=>scores[l.id]).map(l=>{
        const result=scores[l.id];return `${l.name}: ${result.gems} / 3 gems · ${result.gold} / ${result.totalGold} gold · ${Math.round((result.gold+result.gems)/(result.totalGold+3)*100)}%`;
      }).join('\n'):'';
      $('#game-footnote').textContent=sim.isLocalGarden?'Local Level · separate from campaign progress':
        s.phase==='complete'?(sim.practiceLevel?'Grip & Slide practice complete':nextLocked?'Explore again to find more gold and gems':level.id<GARDEN_LEVELS.length?'The next garden waits below':`All ${GARDEN_LEVELS.length} gardens explored`):
        sim.practiceLevel?'Grip & Slide practice':`${level.name} · Level ${level.id} of ${GARDEN_LEVELS.length}`;
      if(overlay&&!levelScreen)$('#game-primary').focus({preventScroll:true});
    }
  }
  return {update,start,progress,canPlayLevel,restartCurrent(){sim.restartGarden();change();},handleKey(e){
    if(sim.selectedTest!=='garden')return false;
    if(e.target?.closest?.('input,select,textarea,[contenteditable="true"]'))return false;
    const cameraAction=cameraShortcutAction(e,sim.selectedTest);
    if(cameraAction){e.preventDefault();if(cameraAction==='toggle'){onCameraToggle();update();}return true;}
    if(e.code==='Escape'){e.preventDefault();if(!e.repeat){if(levelScreen)closeLevels();else if(sim.garden.phase==='paused'){sim.garden.phase='playing';change();}else menu();}return true;}
    return sim.garden.phase!=='playing';
  }};
}
