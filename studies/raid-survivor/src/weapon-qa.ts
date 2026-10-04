import {WeaponVfx} from './weapon-vfx';
import {Game,WEAPONS,type Projectile,type Weapon} from './game';

if(!import.meta.env.DEV)document.body.textContent='Development QA only.';
else{
  const canvas=document.querySelector<HTMLCanvasElement>('#canvas')!,c=canvas.getContext('2d')!,flight=document.querySelector<HTMLCanvasElement>('#axeFlight')!,fc=flight.getContext('2d')!,status=document.querySelector<HTMLElement>('#status')!,result=document.querySelector<HTMLElement>('#result')!;
  const vfx=new WeaponVfx(`${import.meta.env.BASE_URL}sprites/weapons/tankard.png`);
  const reduced=document.querySelector<HTMLInputElement>('#reduced')!,lean=document.querySelector<HTMLInputElement>('#lean')!;
  let elapsed=0,last=0,paused=false,crowded=false,benchmarking=false;
  const kinds:Weapon[]=['tankard','thornbow','arcwand','runeaxes','scattergun','thornbow'];
  const names=['TAVERN KEEPER','RANGER','WIZARD','DWARF · RUNE AXES','SCATTERGUN PICKUP','BRIAR FRAGMENTS'];
  const shot=(kind:Weapon,i:number):Projectile=>({x:0,y:0,vx:Math.cos(i)*20,vy:Math.sin(i)*20,radius:kind==='tankard'?.34:kind==='arcwand'?.28:.18,damage:1,life:1,pierce:0,kind,chain:0,hit:new Set(),bombFragment:i%5===4});
  const shots=Array.from({length:650},(_,i)=>shot(i<12?'tankard':kinds[1+i%4],i));
  const demo=kinds.map((kind,i)=>Array.from({length:3},(_,j)=>({...shot(kind,j*Math.PI/2),bombFragment:i===5})));
  function resize(){canvas.width=flight.width=Math.min(1080,innerWidth-24);canvas.height=750;}resize();window.addEventListener('resize',resize);
  const axeGames=[1,5].map(rank=>{const game=new Game('dwarf');game.enemies=[];game.slots=['runeaxes'];game.spawnClock=game.chestClock=-1e9;game.player.invuln=1e9;game.firing=true;game.aim.x=1;game.aim.y=0;game.weapons.runeaxes=rank;return game;});
  let flightCarry=0,flightElapsed=0;
  function drawAxeFlight(dt:number){
    if(!paused){flightCarry+=dt;flightElapsed+=dt;while(flightCarry>=1/60){for(const game of axeGames)game.update(1/60);flightCarry-=1/60;}}
    fc.clearRect(0,0,flight.width,flight.height);fc.fillStyle='#171923';fc.fillRect(0,0,flight.width,flight.height);
    const scale=Math.min(29,Math.max(14,(flight.width-120)/12));
    for(const [i,game] of axeGames.entries()){
      const y=60+i*105;fc.fillStyle='#f4dfae';fc.font='900 13px system-ui';fc.fillText(`RUNE AXES · RANK ${i?5:1} · ${game.projectiles.length} live axes`,12,y-34);
      fc.strokeStyle='#78607a';fc.beginPath();fc.moveTo(75,y);fc.lineTo(flight.width-20,y);fc.stroke();
      fc.fillStyle='#e1ad6e';fc.fillRect(69,y-8,12,16);
      for(const axe of game.projectiles)vfx.drawProjectile(fc,axe,75+(axe.x-90)*scale,y-(axe.y-90)*scale,scale,flightElapsed,reduced.checked,lean.checked);
    }
  }
  const point=(i:number)=>({x:30+(i*73)%(canvas.width-60),y:30+(i*47)%(canvas.height-60)});
  const positions=shots.map((_,i)=>point(i));window.addEventListener('resize',()=>positions.forEach((p,i)=>Object.assign(p,point(i))));
  function oldDraw(p:Projectile,x:number,y:number,performanceMode:boolean){c.save();c.translate(x,y);c.rotate(Math.atan2(-p.vy,p.vx));c.shadowColor=c.fillStyle=`#${WEAPONS[p.kind].color.toString(16)}`;c.shadowBlur=performanceMode?0:16;c.beginPath();c.ellipse(0,0,Math.max(4,p.radius*26*1.6),Math.max(2,p.radius*26*.58),0,0,6.28);c.fill();c.restore();}
  function batch(old:boolean){const performanceMode=lean.checked,reducedMotion=reduced.checked;c.clearRect(0,0,canvas.width,canvas.height);for(let i=0;i<shots.length;i++){const p=positions[i];if(old)oldDraw(shots[i],p.x,p.y,performanceMode);else vfx.drawProjectile(c,shots[i],p.x,p.y,26,elapsed,reducedMotion,performanceMode);}}
  document.querySelector<HTMLButtonElement>('#pause')!.onclick=e=>{paused=!paused;(e.target as HTMLButtonElement).textContent=paused?'Resume':'Pause';};
  document.querySelector<HTMLButtonElement>('#crowd')!.onclick=e=>{crowded=!crowded;(e.target as HTMLButtonElement).textContent=`Crowded: ${crowded?'650':'off'}`;};
  document.querySelector<HTMLSelectElement>('#scene')!.onchange=e=>{canvas.style.background=(e.target as HTMLSelectElement).value==='lava'?'#281513':'#161923';};
  document.querySelector<HTMLButtonElement>('#benchmark')!.onclick=async()=>{
    benchmarking=true;result.textContent='Comparing warmed drawing passes…';await vfx.ready;
    const old:number[]=[],fresh:number[]=[];
    const measure=(legacy:boolean)=>{const begin=performance.now();batch(legacy);c.getImageData(0,0,1,1);return performance.now()-begin;};
    for(let i=0;i<5;i++){measure(true);measure(false);}
    for(let i=0;i<30;i++){if(i%2){fresh.push(measure(false));old.push(measure(true));}else{old.push(measure(true));fresh.push(measure(false));}if(i%5===0)await new Promise(requestAnimationFrame);}
    const stats=(values:number[])=>{values.sort((a,b)=>a-b);return `median ${values[15].toFixed(2)}ms · p95 ${values[28].toFixed(2)}ms`;};
    result.textContent=`650 projectiles (12 mugs) · ${lean.checked?'Performance':'Full'} · ${canvas.width}×${canvas.height}\nOld ellipse pass: ${stats(old)}\nNew sprite pass: ${stats(fresh)}\nCache builds: ${vfx.cacheBuilds}; no per-projectile images or GPU objects.\nDesktop-browser canvas draw/readback timing, not physical-phone FPS.`;benchmarking=false;
  };
  function frame(now:number){const dt=Math.min(.05,(now-last)/1000);last=now;if(!paused)elapsed+=dt;if(!benchmarking){
    c.clearRect(0,0,canvas.width,canvas.height);c.fillStyle='#ddd0b3';c.font='11px system-ui';
    if(crowded){batch(false);c.fillText('650 PROJECTILES · SAME SINGLE ATLAS',12,18);}else{
      for(let i=0;i<6;i++){const y=55+i*100;c.fillText(names[i],12,y-20);for(let j=0;j<3;j++){const x=canvas.width<500?170+j*70:canvas.width*(.38+j*.2);vfx.drawProjectile(c,demo[i][j],x,y+8,26,elapsed,reduced.checked,lean.checked);}if(i===0)vfx.drawEffect(c,{kind:'splash',x:0,y:0,size:1.1,color:0,life:.3*(1-(elapsed%1)),max:.3},canvas.width<500?70:canvas.width*.18,y+20,20,reduced.checked);}
      c.fillStyle='#ddd0b3';c.fillText('WARRIOR · DIRECTIONAL SLASH',12,640);for(let i=0;i<3;i++)vfx.drawEffect(c,{kind:'slash',x:0,y:0,angle:i*Math.PI/2,arc:110*Math.PI/180,size:2.8,color:0,life:.19*(1-(elapsed%1)),max:.19},canvas.width*(.25+i*.28),695,16,reduced.checked);
    }
    drawAxeFlight(dt);
    status.textContent=`${vfx.mugLoaded?'Generated mug ready':'Cached fallback mug'} · cache builds ${vfx.cacheBuilds} · ${paused?'paused':'animating'} · ${reduced.checked?'reduced motion':'normal motion'}`;
  }requestAnimationFrame(frame);}requestAnimationFrame(frame);
  window.addEventListener('pagehide',()=>vfx.dispose(),{once:true});
}
