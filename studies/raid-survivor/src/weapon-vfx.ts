import {WEAPONS, type Effect, type Projectile} from './game';

export type ProjectileVisual = 'arrow'|'arc-bolt'|'rune-pellet'|'tankard'|'briar-fragment'|'rune-axe'|'generic';
export function projectileVisual(p:Pick<Projectile,'kind'|'bombFragment'>):ProjectileVisual {
  if(p.bombFragment)return 'briar-fragment';
  return p.kind==='thornbow'?'arrow':p.kind==='arcwand'?'arc-bolt':p.kind==='scattergun'?'rune-pellet':p.kind==='runeaxes'?'rune-axe':p.kind==='tankard'?'tankard':'generic';
}
const CELL=64, SLOTS=16, DIRECTIONS=32;
const slots:Record<ProjectileVisual,number>={arrow:0,'arc-bolt':1,'rune-pellet':2,tankard:3,'briar-fragment':4,'rune-axe':5,generic:6};
const clamp=(n:number,a:number,b:number)=>Math.max(a,Math.min(b,n));

/** One tiny atlas, prepared once. Draws are deterministic and never touch combat state. */
export class WeaponVfx {
  readonly atlas=document.createElement('canvas');
  private readonly directions=document.createElement('canvas');
  readonly ready:Promise<void>;
  cacheBuilds=1;
  mugLoaded=false;
  private dead=false;
  private image:HTMLImageElement|null=null;
  private finishLoad:(()=>void)|null=null;
  constructor(url:string){
    this.atlas.width=CELL*SLOTS;this.atlas.height=CELL;
    const c=this.atlas.getContext('2d')!;
    const polygon=(points:number[][],color:string)=>{c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();};
    const cell=(slot:number,paint:()=>void)=>{c.save();c.translate(slot*CELL,0);paint();c.restore();};
    cell(0,()=>{c.fillStyle='#252119';c.fillRect(7,27,43,10);c.fillStyle='#c09052';c.fillRect(10,30,37,4);polygon([[58,32],[42,22],[45,32],[42,42]],'#efffdc');polygon([[9,30],[5,20],[20,29],[20,35],[5,44],[9,34]],'#87e9aa');});
    cell(1,()=>{polygon([[2,32],[30,15],[53,32],[30,49]],'#6852be');polygon([[9,32],[33,22],[49,32],[33,42]],'#b1a5ff');polygon([[23,32],[34,25],[43,32],[34,39]],'#f2ebff');});
    cell(2,()=>{polygon([[12,23],[39,13],[54,31],[39,51],[12,41]],'#4b3230');polygon([[17,25],[37,18],[47,31],[36,44],[17,38]],'#ffc378');c.fillStyle='#fff4cb';c.fillRect(28,23,6,18);c.fillRect(28,29,12,5);});
    // A readable cached fallback is available even before the image finishes loading.
    cell(3,()=>{c.fillStyle='#f4e6b8';c.fillRect(39,22,17,27);c.clearRect(43,27,8,16);c.fillStyle='#352416';c.fillRect(11,17,31,39);c.fillStyle='#b77a36';c.fillRect(15,21,23,31);c.fillStyle='#cfcec3';c.fillRect(12,25,29,5);c.fillRect(12,44,29,5);c.fillStyle='#fff0ca';c.fillRect(10,13,31,9);c.fillRect(17,9,12,8);});
    cell(4,()=>polygon([[9,32],[27,22],[54,32],[27,42],[33,32]],'#aaffb9'));
    cell(5,()=>{c.fillStyle='#fff1bd';c.beginPath();c.ellipse(32,32,23,10,0,0,Math.PI*2);c.fill();});
    for(let i=0;i<5;i++)cell(6+i,()=>{const arc=(100+i*5)*Math.PI/180;c.strokeStyle='#bb773d';c.lineWidth=9;c.beginPath();c.arc(32,32,25,-arc/2,arc/2);c.stroke();c.strokeStyle='#e5f5f3';c.lineWidth=5;c.beginPath();c.arc(32,32,28,-arc/2,arc/2);c.stroke();c.strokeStyle='#fff8d0';c.lineWidth=2;c.beginPath();c.arc(32,32,30,-arc/2,arc/2);c.stroke();});
    for(let i=0;i<4;i++)cell(11+i,()=>{const r=8+i*5;for(let k=0;k<8;k++){const a=k*Math.PI/4;const x=32+Math.cos(a)*r,y=32+Math.sin(a)*r;c.fillStyle=k%2?'#ffecc2':'#d89a43';const size=7-i;c.fillRect(Math.round(x-size/2),Math.round(y-size/2),size,size);}if(i<2){c.fillStyle='#fff6d9';c.fillRect(26,27,12,10);}});
    cell(15,()=>{c.fillStyle='#50302b';c.fillRect(8,28,42,9);c.fillStyle='#db9a52';c.fillRect(10,30,39,5);polygon([[40,18],[53,12],[60,26],[55,32],[60,38],[53,52],[40,46],[45,32]],'#e5edf1');polygon([[44,20],[52,17],[56,27],[50,32],[56,37],[52,47],[44,44],[48,32]],'#8a91ad');c.fillStyle='#f9d778';c.fillRect(46,28,7,8);c.fillStyle='#f8edcc';c.fillRect(11,27,5,11);});
    this.directions.width=CELL*DIRECTIONS;this.directions.height=CELL*6;this.cacheDirections();
    this.ready=new Promise(resolve=>{this.finishLoad=resolve;});
    const image=this.image=new Image();
    image.onload=()=>{
      if(this.dead)return;
      try{
        // Scan a bounded thumbnail once, rather than retaining the source's large GPU bitmap.
        const scratch=document.createElement('canvas');scratch.width=scratch.height=128;const s=scratch.getContext('2d',{willReadFrequently:true})!;
        s.drawImage(image,0,0,128,128);const pixels=s.getImageData(0,0,128,128).data;
        let left=128,top=128,right=0,bottom=0;
        for(let y=0;y<128;y++)for(let x=0;x<128;x++)if(pixels[(y*128+x)*4+3]>=64){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
        if(right>=left&&bottom>=top){const width=right-left+1,height=bottom-top+1,factor=48/Math.max(width,height);c.clearRect(3*CELL,0,CELL,CELL);c.imageSmoothingEnabled=false;c.drawImage(scratch,left,top,width,height,3*CELL+(CELL-width*factor)/2,(CELL-height*factor)/2,width*factor,height*factor);this.mugLoaded=true;this.cacheDirections(3);this.cacheBuilds++;}
        scratch.width=scratch.height=0;
      }catch{/* Retain the cached fallback if an image cannot be decoded. */}
      this.releaseImage();
    };
    image.onerror=()=>this.releaseImage();image.src=url;
  }
  private cacheDirections(onlySlot?:number){
    const c=this.directions.getContext('2d')!;
    for(let slot=onlySlot??0;slot<=(onlySlot??5);slot++)for(let i=0;i<DIRECTIONS;i++){
      const aspect=slot===0?.62:slot===1?.65:slot===4?8/13:slot===5?.8:1;
      c.clearRect(i*CELL,slot*CELL,CELL,CELL);c.save();c.translate(i*CELL+CELL/2,slot*CELL+CELL/2);c.rotate(i*Math.PI*2/DIRECTIONS);c.imageSmoothingEnabled=false;
      c.drawImage(this.atlas,(slot===5?15:slot)*CELL,0,CELL,CELL,-CELL/2,-CELL*aspect/2,CELL,CELL*aspect);c.restore();
    }
  }
  private releaseImage(){if(this.image){this.image.onload=this.image.onerror=null;this.image=null;}this.finishLoad?.();this.finishLoad=null;}
  drawProjectile(c:CanvasRenderingContext2D,p:Projectile,x:number,y:number,scale:number,elapsed:number,reducedMotion:boolean,_lean:boolean){
    if(this.dead)return;
    const visual=projectileVisual(p),slot=slots[visual];let width:number,height:number;
    if(visual==='arrow'){width=clamp(scale*1.05,20,34);height=width*.62;}
    else if(visual==='rune-axe'){width=height=clamp(scale*1.4,22,38);}
    else if(visual==='tankard'){width=height=clamp(scale*1.3,22,32);}
    else if(visual==='arc-bolt'){width=clamp(p.radius*scale*6,24,40);height=width*.65;}
    else if(visual==='rune-pellet'){width=height=clamp(p.radius*scale*3.3,9,14);}
    else if(visual==='briar-fragment'){width=13;height=8;}
    else {width=Math.max(8,p.radius*scale*3.2);height=Math.max(4,p.radius*scale*1.16);}
    const angle=Math.atan2(-p.vy,p.vx)+((visual==='tankard'||visual==='rune-axe')&&!reducedMotion?elapsed*10:0);
    // Performance mode keeps the same silhouettes using small fills for the high-volume shots.
    // Tankards keep their artwork; their slow fire rate makes image drawing inexpensive.
    if(_lean&&visual!=='tankard'&&visual!=='rune-axe'&&visual!=='generic'){
      c.save();c.translate(x,y);c.rotate(angle);c.shadowBlur=0;
      if(visual==='arrow'){
        c.fillStyle='#c09052';c.fillRect(-width*.75,-1,width*.55,2);
        c.fillStyle='#efffdc';c.beginPath();c.moveTo(0,0);c.lineTo(-width*.25,-3);c.lineTo(-width*.18,0);c.lineTo(-width*.25,3);c.fill();
        c.fillStyle='#87e9aa';c.fillRect(-width*.78,-3,4,6);
      }else{
        const w=visual==='briar-fragment'?9:width*.72,h=visual==='arc-bolt'?height*.65:visual==='briar-fragment'?4:height*.7;
        c.fillStyle=visual==='arc-bolt'?'#b1a5ff':visual==='rune-pellet'?'#ffc378':'#aaffb9';
        c.beginPath();c.moveTo(w/2,0);c.lineTo(0,-h/2);c.lineTo(-w/2,0);c.lineTo(0,h/2);c.closePath();c.fill();
        if(visual!=='briar-fragment'){c.fillStyle='#fff4dc';c.fillRect(-1,-1,3,2);}
      }
      c.restore();return;
    }
    if(visual!=='generic'){
      const index=((Math.round(angle*DIRECTIONS/(Math.PI*2))%DIRECTIONS)+DIRECTIONS)%DIRECTIONS;
      const cachedAngle=index*Math.PI*2/DIRECTIONS,anchor=visual==='arrow'?width*26/64:0;
      const smoothing=c.imageSmoothingEnabled,shadow=c.shadowBlur;c.imageSmoothingEnabled=false;c.shadowBlur=0;
      if(visual==='rune-axe'&&p.runeGold){c.save();c.translate(x,y);c.rotate(Math.atan2(-p.vy,p.vx));c.fillStyle='rgba(255,216,119,.65)';c.fillRect(-width*1.1,-2,width*.75,4);c.fillStyle='rgba(255,240,177,.85)';c.fillRect(-width*.65,-1,width*.3,2);c.restore();}
      c.drawImage(this.directions,index*CELL,slot*CELL,CELL,CELL,x-width/2-Math.cos(cachedAngle)*anchor,y-width/2-Math.sin(cachedAngle)*anchor,width,width);
      c.imageSmoothingEnabled=smoothing;c.shadowBlur=shadow;return;
    }
    c.save();c.shadowBlur=0;c.imageSmoothingEnabled=false;c.translate(x,y);c.rotate(angle);
    if(visual==='generic'){c.fillStyle=c.shadowColor=`#${WEAPONS[p.kind].color.toString(16).padStart(6,'0')}`;c.shadowBlur=_lean?0:16;c.beginPath();c.ellipse(0,0,width/2,height/2,0,0,Math.PI*2);c.fill();c.restore();return;}

  }
  drawEffect(c:CanvasRenderingContext2D,e:Effect,x:number,y:number,scale:number,reducedMotion:boolean):boolean{
    if(this.dead||e.kind!=='slash'&&e.kind!=='splash')return false;
    const progress=clamp(1-e.life/e.max,0,1);c.save();c.shadowBlur=0;c.imageSmoothingEnabled=false;c.globalAlpha=1-progress;c.translate(x,y);
    if(e.kind==='slash'){
      c.rotate(-(e.angle??0));const slot=6+clamp(Math.round(((e.arc??100*Math.PI/180)*180/Math.PI-100)/5),0,4);
      const size=e.size*scale*2*(reducedMotion?1:.9+.1*progress);c.drawImage(this.atlas,slot*CELL,0,CELL,CELL,-size/2,-size/2,size,size);
    }else{const slot=11+(reducedMotion?2:Math.min(3,Math.floor(progress*4)));const size=Math.max(16,e.size*scale*2);c.drawImage(this.atlas,slot*CELL,0,CELL,CELL,-size/2,-size/2,size,size);}
    c.restore();return true;
  }
  dispose(){this.dead=true;this.releaseImage();this.atlas.width=this.atlas.height=0;this.directions.width=this.directions.height=0;}
}
