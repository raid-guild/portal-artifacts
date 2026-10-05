import {Game,HEROES,type Hero} from './game';
import {GameRenderer} from './render';
import {PlayerPresentation,RenderCadence} from './render-policy';

if(!import.meta.env.DEV)document.body.textContent='Local development QA only.';
else{
  const stage=document.querySelector<HTMLElement>('#stage')!,minimap=document.querySelector<HTMLCanvasElement>('#minimap')!,status=document.querySelector<HTMLElement>('#status')!;
  const pause=document.querySelector<HTMLButtonElement>('#pause')!,face=document.querySelector<HTMLButtonElement>('#face')!;
  let game:Game,view:GameRenderer,last=performance.now(),accumulator=0,hero:Hero='healer',rank=1,moveDirection=0,collecting:null|'wisp'|'heart'=null;
  const presentation=new PlayerPresentation(),cadence=new RenderCadence();
  function reset(nextHero:Hero=hero,nextRank=rank){view?.dispose();stage.append(minimap);hero=nextHero;rank=nextRank;moveDirection=0;collecting=null;game=new Game(hero,'training');game.rankable=false;game.enemies=[];game.spawnClock=game.chestClock=-1e9;game.player.health=Math.round(game.player.maxHealth*.55);game.player.invuln=1e9;game.firing=true;game.aim.x=1;game.aim.y=0;game.weapons[HEROES[hero].weapon]=rank;game.onReward=rewards=>game.chooseReward(rewards[0]);view=new GameRenderer(stage,game,minimap,'performance');last=performance.now();accumulator=0;cadence.reset();presentation.reset(game.player.x,game.player.y);pause.textContent='Pause';face.textContent='Face left';crowd();}
  function crowd(){for(let i=0;i<28;i++){const enemy=game.spawnEnemy(i%7===0?'brute':'rat');if(!enemy)continue;enemy.x=game.player.x+4+i%8*1.15;enemy.y=game.player.y+(Math.floor(i/8)-1.5)*1.3;enemy.speed=0;enemy.damage=0;enemy.attackCd=1e9;}}
  document.querySelectorAll<HTMLButtonElement>('[data-hero]').forEach(button=>button.onclick=()=>reset(button.dataset.hero as Hero,Number(button.dataset.rank)));
  document.querySelector<HTMLButtonElement>('#crowd')!.onclick=crowd;
  document.querySelector<HTMLButtonElement>('#wisp')!.onclick=()=>{game.pickups.push({x:game.player.x+3.2,y:game.player.y,kind:'wisp',value:4,life:12});};
  document.querySelector<HTMLButtonElement>('#collect')!.onclick=()=>{collecting='wisp';moveDirection=0;game.paused=false;pause.textContent='Pause';};
  document.querySelector<HTMLButtonElement>('#food')!.onclick=()=>{game.pickups.push({x:game.player.x+3,y:game.player.y,kind:'heart',value:18,life:25});};
  document.querySelector<HTMLButtonElement>('#collectFood')!.onclick=()=>{collecting='heart';moveDirection=0;game.paused=false;pause.textContent='Pause';};
  const magnetButton=document.querySelector<HTMLButtonElement>('#magnet')!;magnetButton.onclick=()=>{game.passives.magnet=game.passives.magnet?0:5;magnetButton.textContent=game.passives.magnet?'Magnet: max':'Magnet: normal';};
  document.querySelector<HTMLButtonElement>('#moveLeft')!.onclick=()=>{collecting=null;moveDirection=moveDirection===-1?0:-1;};
  document.querySelector<HTMLButtonElement>('#moveRight')!.onclick=()=>{collecting=null;moveDirection=moveDirection===1?0:1;};
  document.querySelector<HTMLButtonElement>('#bomb')!.onclick=()=>{game.bombCharge=game.bombRecharge;game.bomb();};
  face.onclick=()=>{game.aim.x*=-1;game.facing=game.aim.x<0?-1:1;face.textContent=game.aim.x<0?'Face right':'Face left';};
  document.querySelector<HTMLButtonElement>('#death')!.onclick=()=>game.die('combat');
  pause.onclick=()=>{if(game.dead)return;game.paused=!game.paused;pause.textContent=game.paused?'Resume':'Pause';presentation.reset(game.player.x,game.player.y);};
  function frame(now:number){const dt=Math.min(.1,Math.max(0,(now-last)/1000));last=now;accumulator+=dt;while(accumulator>=1/60){if(!game.paused&&!game.dead)presentation.beforeStep(game.player.x,game.player.y);const target=collecting?game.pickups.find(p=>p.kind===collecting):null;if(collecting&&!target)collecting=null;if(target){const dx=target.x-game.player.x,dy=target.y-game.player.y,d=Math.hypot(dx,dy);game.move.x=d>.35?dx/d:0;game.move.y=d>.35?dy/d:0;}else{game.move.x=moveDirection;game.move.y=0;}game.update(1/60);accumulator-=1/60;if(game.paused||game.dead)presentation.reset(game.player.x,game.player.y);}const renderDt=cadence.advance(dt);if(renderDt!==null)view.render(renderDt,false,game.paused||game.dead?presentation:presentation.sample(game.player.x,game.player.y,accumulator*60));if(Math.floor(now/200)!==Math.floor((now-dt*1000)/200))status.textContent=`${HEROES[hero].name} · rank ${rank} ${HEROES[hero].weapon} · ${game.dead?'dead':game.paused?'paused':'running'}\nHP ${game.player.health.toFixed(0)}/${game.player.maxHealth} · shots ${game.projectiles.length} · wisps ${game.pickups.filter(p=>p.kind==='wisp').length} · food ${game.pickups.filter(p=>p.kind==='heart').length} · magnet rank ${game.passives.magnet} · enemies ${game.enemies.length} · bomb ${game.bombWave?'active':'ready'}\nControls: choose hero/rank to reset; crowd adds stationary targets; wisp spawns 3.2 units away; collect controls move the real player into their pickup; max magnet changes XP pull but never food pull.`;requestAnimationFrame(frame);}
  reset();requestAnimationFrame(frame);window.addEventListener('pagehide',()=>view.dispose(),{once:true});
}
