import {Game,lavaMolochPressure,type EnemyKind} from './game';
import {GameRenderer} from './render';

if(!import.meta.env.DEV){document.body.textContent='Local development QA only.';}
else{
  const stage=document.querySelector<HTMLElement>('#stage')!,minimap=document.querySelector<HTMLCanvasElement>('#minimap')!,status=document.querySelector<HTMLElement>('#status')!;
  let game:Game,view:GameRenderer,last=0,paused=false,scenario='natives';
  function place(kind:EnemyKind,x:number,y:number){const enemy=game.spawnEnemy(kind);if(!enemy)return;enemy.x=x;enemy.y=y;enemy.specialCd=0;enemy.attackCd=1;enemy.hp=enemy.maxHp;return enemy;}
  function reset(choice:'natives'|'bosses'){
    view?.dispose();stage.append(minimap);scenario=choice;game=new Game('ranger','lava');game.rankable=false;game.enemies=[];game.slots=[];
    game.spawnClock=game.chestClock=-1e9;game.player.invuln=1e9;game.endless=true;
    game.elapsed=choice==='bosses'?660:180;
    const internal=game as unknown as {lavaBossEvent:number;lavaBossAdmitted:number;nextLavaBossAt:number;buildGrid:()=>void};
    internal.lavaBossEvent=choice==='bosses'?4:0;internal.lavaBossAdmitted=999;internal.nextLavaBossAt=Infinity;
    game.bossWave=choice==='bosses'?4:0;game.finalBossSpawned=true;
    if(choice==='natives'){
      place('tosculi',game.player.x+4,game.player.y+3);
      place('seahag',game.player.x+6,game.player.y-2);
      place('hezrou',game.player.x-8,game.player.y+2);
    }else{
      for(const [i,[x,y]] of [[9,0],[-9,2],[0,9]].entries()){
        const boss=game.spawnEnemy('boss',false,3);if(!boss)continue;boss.x=game.player.x+x;boss.y=game.player.y+y;boss.attackCd=1+i*.8;
      }
    }
    internal.buildGrid();view=new GameRenderer(stage,game,minimap,'performance');paused=false;document.querySelector<HTMLButtonElement>('#pause')!.textContent='PAUSE';
    document.querySelector<HTMLInputElement>('#time')!.value=String(Math.floor(game.elapsed));
  }
  document.querySelector<HTMLButtonElement>('#natives')!.onclick=()=>reset('natives');
  document.querySelector<HTMLButtonElement>('#bosses')!.onclick=()=>reset('bosses');
  document.querySelector<HTMLButtonElement>('#pause')!.onclick=event=>{paused=!paused;(event.target as HTMLButtonElement).textContent=paused?'RESUME':'PAUSE';};
  document.querySelector<HTMLButtonElement>('#setTime')!.onclick=()=>{game.elapsed=Math.max(0,Math.min(1500,Number(document.querySelector<HTMLInputElement>('#time')!.value)||0));};
  function frame(now:number){const dt=Math.min(.05,Math.max(0,(now-last)/1000));last=now;if(!paused)game.update(dt);view.render(dt);
    if(Math.floor(now/100)!==Math.floor((now-dt*1000)/100)){const pressure=lavaMolochPressure(game.elapsed),marks=game.hazards.filter(h=>h.kind==='boss');status.textContent=`${scenario.toUpperCase()} · ${game.elapsed.toFixed(1)}s · ${game.enemies.length} enemies · ${game.enemyShots.length} shots · ${game.hazards.length} warnings (${marks.length} Moloch marks) · ${game.stats.bosses} Molochs defeated · current Moloch interval ${pressure.interval}s / next mark ${pressure.markDamage} HP · active marks ${marks.map(h=>`${h.damage} HP in ${h.delay.toFixed(1)}s`).join(', ')||'none'}`;}
    requestAnimationFrame(frame);
  }
  reset('natives');requestAnimationFrame(frame);
}
