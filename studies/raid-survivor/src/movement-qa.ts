import {Game} from './game';
import {GameRenderer} from './render';
import {PlayerPresentation,RenderCadence,type GraphicsMode} from './render-policy';

if(!import.meta.env.DEV)document.body.textContent='Local development QA only.';
else{
  const stage=document.querySelector<HTMLElement>('#stage')!,minimap=document.querySelector<HTMLCanvasElement>('#minimap')!,status=document.querySelector<HTMLElement>('#status')!;
  const motion=document.querySelector<HTMLSelectElement>('#motion')!,route=document.querySelector<HTMLSelectElement>('#route')!,scene=document.querySelector<HTMLSelectElement>('#scene')!,graphics=document.querySelector<HTMLSelectElement>('#graphics')!,pause=document.querySelector<HTMLButtonElement>('#pause')!;
  const originalRandom=Math.random;
  let seed=1847;
  Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  let game:Game,view:GameRenderer,last=0,accumulator=0,paused=false,pausedAt=0,frames=0,draws=0,steps=0,rafTotal=0,updateTotal=0,renderTotal=0,rafMax=0,updateMax=0,renderMax=0,stalls=0,lastShownX=0,lastShownY=0,windowStart=0,measured=false;
  const shown=new PlayerPresentation();
  const cadence=new RenderCadence();
  function reset(){view?.dispose();stage.append(minimap);seed=1847;game=new Game('tavern-keeper','lava');game.rankable=false;game.endless=true;game.player.invuln=1e9;game.spawnClock=game.chestClock=-1e9;game.onReward=rewards=>game.chooseReward(rewards[0]);
    for(let i=0;i<14;i++){const enemy=game.spawnEnemy(i%6===0?'seahag':'tosculi');if(enemy){const angle=i*2.3999632297,dist=4+(i%5)*1.4;enemy.x=game.player.x+Math.cos(angle)*dist;enemy.y=game.player.y+Math.sin(angle)*dist;}}
    if(scene.value==='crowded')for(let i=0;i<100;i++){const enemy=game.spawnEnemy(i%13===0?'hezrou':i%9===0?'seahag':'tosculi');if(enemy){const angle=i*2.3999632297,dist=6+(i%11)*1.3;enemy.x=game.player.x+Math.cos(angle)*dist;enemy.y=game.player.y+Math.sin(angle)*dist;}}
    view=new GameRenderer(stage,game,minimap,graphics.value as GraphicsMode);shown.reset(game.player.x,game.player.y);last=performance.now();windowStart=last;accumulator=0;cadence.reset();frames=draws=steps=rafTotal=updateTotal=renderTotal=rafMax=updateMax=renderMax=stalls=0;measured=false;paused=false;pause.textContent='Pause';lastShownX=shown.x;lastShownY=shown.y;
  }
  function metrics(){const mean=(sum:number,n:number)=>n?(sum/n).toFixed(2):'0.00';status.textContent=`${scene.value.toUpperCase()} · ${motion.value.toUpperCase()} · ${route.value.toUpperCase()} · ${paused?'PAUSED':measured?'8s CAPTURE COMPLETE':'WARMING / MEASURING'} · ${game.enemies.length} enemies · ${game.projectiles.length} projectiles\nActual RAF: ${mean(rafTotal,frames)} ms mean / ${rafMax.toFixed(2)} max · ${frames} callbacks\nGame update: ${mean(updateTotal,steps)} ms per fixed step / ${updateMax.toFixed(2)} max · ${steps} steps\nRenderer: ${mean(renderTotal,draws)} ms per draw / ${renderMax.toFixed(2)} max · ${draws} draws\nRepeated displayed positions: ${stalls} · elapsed ${game.elapsed.toFixed(1)}s · ${graphics.value} graphics\nThe capture warms for 1s, measures 8s, then freezes counters. Restart or change a control for a same-seed comparison. Timing uses performance.now around update/render; no canvas readback.`;}
  document.querySelector<HTMLButtonElement>('#restart')!.onclick=reset;scene.onchange=reset;graphics.onchange=reset;motion.onchange=reset;route.onchange=reset;
  pause.onclick=()=>{if(measured)return;paused=!paused;pause.textContent=paused?'Resume':'Pause';if(paused)pausedAt=performance.now();else{const now=performance.now();windowStart+=now-pausedAt;last=now;cadence.reset();}shown.reset(game.player.x,game.player.y);};
  function frame(now:number){const rawDt=Math.max(0,(now-last)/1000),dt=Math.min(.1,rawDt);last=now;const activeTime=(paused?pausedAt:now)-windowStart;const capture=activeTime>=1000&&activeTime<9000&&!paused&&!measured;if(activeTime>=9000)measured=true;if(capture){frames++;rafTotal+=rawDt*1000;rafMax=Math.max(rafMax,rawDt*1000);}
    if(!paused&&!measured){accumulator+=dt;game.move.x=route.value==='moving'?1:0;game.move.y=0;while(accumulator>=1/60){shown.beforeStep(game.player.x,game.player.y);const start=performance.now();game.update(1/60);const cost=performance.now()-start;if(capture){updateTotal+=cost;updateMax=Math.max(updateMax,cost);steps++;}accumulator-=1/60;if(game.dead||game.paused||game.awaitingReward){shown.reset(game.player.x,game.player.y);break;}}}
    else shown.reset(game.player.x,game.player.y);
    const renderDt=cadence.advance(dt);if(renderDt!==null){const position=motion.value==='raw'?game.player:paused||measured?shown:shown.sample(game.player.x,game.player.y,accumulator*60);
      if(capture&&draws>0&&position.x===lastShownX&&position.y===lastShownY&&route.value==='moving')stalls++;
      lastShownX=position.x;lastShownY=position.y;
      const start=performance.now();view.render(renderDt,false,position);const cost=performance.now()-start;if(capture){renderTotal+=cost;renderMax=Math.max(renderMax,cost);draws++;}}
    if(Math.floor(now/250)!==Math.floor((now-rawDt*1000)/250))metrics();requestAnimationFrame(frame);
  }
  reset();requestAnimationFrame(frame);
  window.addEventListener('pagehide',()=>{Math.random=originalRandom;view.dispose();},{once:true});
}
