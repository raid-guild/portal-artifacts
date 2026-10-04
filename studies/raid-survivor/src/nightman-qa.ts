import {Game,nightmanSpeedMultiplier} from './game';
import {GameRenderer} from './render';
import {PlayerPresentation,RenderCadence} from './render-policy';

if(!import.meta.env.DEV)document.body.textContent='Local development QA only.';
else{
  const stage=document.querySelector<HTMLElement>('#stage')!,minimap=document.querySelector<HTMLCanvasElement>('#minimap')!,status=document.querySelector<HTMLElement>('#status')!;
  const time=document.querySelector<HTMLSelectElement>('#time')!,pause=document.querySelector<HTMLButtonElement>('#pause')!,move=document.querySelector<HTMLButtonElement>('#move')!;
  let game:Game,view:GameRenderer,last=0,accumulator=0,moving=false,events:string[]=[];
  const presentation=new PlayerPresentation(),cadence=new RenderCadence();
  function reset(){view?.dispose();stage.append(minimap);game=new Game('tavern-keeper','lava');game.rankable=false;game.enemies=[];game.slots=[];game.spawnClock=game.chestClock=-1e9;(game as unknown as {lavaBossAdmitted:number}).lavaBossAdmitted=999;game.elapsed=720;game.cleared=true;game.paused=true;game.player.invuln=1e9;game.onReward=rewards=>game.chooseReward(rewards[0]);events=[];game.onEvent=e=>events.push(e);
    view=new GameRenderer(stage,game,minimap,'performance');last=performance.now();accumulator=0;cadence.reset();presentation.reset(game.player.x,game.player.y);moving=false;move.textContent='Move: off';pause.textContent='Pause';status.textContent='12:00 clear decision: bank safely or continue into the 2.5-second Nightman warning.';}
  document.querySelector<HTMLButtonElement>('#reset')!.onclick=reset;time.onchange=reset;
  document.querySelector<HTMLButtonElement>('#bank')!.onclick=()=>{if(game.cleared)game.die('bank');};
  document.querySelector<HTMLButtonElement>('#continue')!.onclick=()=>{if(game.continueEndless({left:view.cameraX-view.viewWidth/2,right:view.cameraX+view.viewWidth/2,bottom:view.cameraY-view.viewHeight/2,top:view.cameraY+view.viewHeight/2}))game.elapsed=Number(time.value);};
  pause.onclick=()=>{if(!game.endless||game.dead)return;game.paused=!game.paused;pause.textContent=game.paused?'Resume':'Pause';presentation.reset(game.player.x,game.player.y);};
  move.onclick=()=>{moving=!moving;move.textContent=`Move: ${moving?'on':'off'}`;};
  document.querySelector<HTMLButtonElement>('#dash')!.onclick=()=>game.dash();
  document.querySelector<HTMLButtonElement>('#contact')!.onclick=()=>{if(game.nightman){game.nightman.warningRemaining=0;game.nightman.x=game.player.x+1;game.nightman.y=game.player.y;}};
  function frame(now:number){const dt=Math.min(.1,Math.max(0,(now-last)/1000));last=now;accumulator+=dt;game.move.x=moving&&!game.paused?1:0;game.move.y=0;
    while(accumulator>=1/60){if(!game.paused&&!game.dead)presentation.beforeStep(game.player.x,game.player.y);game.update(1/60);accumulator-=1/60;if(game.paused||game.dead)presentation.reset(game.player.x,game.player.y);}
    const renderDt=cadence.advance(dt);if(renderDt!==null){const p=game.paused||game.dead?presentation:presentation.sample(game.player.x,game.player.y,accumulator*60);view.render(renderDt,false,p);}
    if(Math.floor(now/150)!==Math.floor((now-dt*1000)/150)){const hunter=game.nightman;status.textContent=`${game.dead?game.killedByNightman?'NIGHTMAN KILL':game.deathReason?.toUpperCase():game.cleared?'CLEAR DECISION':'ENDLESS CHASE'} · ${game.elapsed.toFixed(1)}s · player ${game.player.health}/${game.player.maxHealth} HP · invulnerability ${game.player.invuln.toFixed(1)}s\nNightman ${hunter?`${hunter.warningRemaining.toFixed(2)}s warning · (${hunter.x.toFixed(1)}, ${hunter.y.toFixed(1)}) · ${nightmanSpeedMultiplier(game.elapsed).toFixed(2)}× walk speed`:'absent'} · ${game.paused?'paused':'running'}\nKills ${game.stats.kills} · loot ${game.pickups.length} · events ${events.slice(-5).join(', ')}`;}
    requestAnimationFrame(frame);
  }
  reset();requestAnimationFrame(frame);window.addEventListener('pagehide',()=>view.dispose(),{once:true});
}
