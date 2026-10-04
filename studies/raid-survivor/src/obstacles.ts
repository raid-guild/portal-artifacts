export type TerrainLevel = 'training' | 'forest' | 'desert' | 'ice';
export type Obstacle = Readonly<{ id: number; shape: 'circle' | 'rect'; x: number; y: number; radius: number; halfWidth: number; halfHeight: number }>;
export type SweepHit = { hit: boolean; t: number; nx: number; ny: number; id: number };
export type MoveResult = { x: number; y: number; hit: boolean; id: number };

const water = (id: number, x: number, y: number, radius: number): Obstacle => Object.freeze({ id, shape:'circle', x, y, radius, halfWidth:0, halfHeight:0 });
const wall = (id: number, x: number, y: number, width: number, height: number): Obstacle => Object.freeze({ id, shape:'rect', x, y, radius:0, halfWidth:width/2, halfHeight:height/2 });
const DESERT = Object.freeze([
  water(1,104,91,2.8),water(2,65,80,3.2),water(3,58,43,2.9),water(4,123,68,3.4),
  water(5,147,115,3.1),water(6,126,145,3.2),water(7,49,138,2.7),water(8,32,117,3.0),
  water(9,88,18,2.8),water(10,157,61,2.6),
]);
const ICE = Object.freeze([
  wall(1,104,90,6,1.8),wall(2,67,68,7,2),wall(3,118,63,2,7),wall(4,145,111,7,2),
  wall(5,114,138,2,7),wall(6,53,116,7,2),wall(7,81,159,2,7),wall(8,158,43,6,1.8),
  wall(9,35,51,2,7),wall(10,138,158,7,2),
]);
export const obstaclesFor = (level: TerrainLevel): readonly Obstacle[] => level==='desert'?DESERT:level==='ice'?ICE:[];
const CELL=15,CELLS=12;
function cellsFor(obstacles:readonly Obstacle[]){const cells=new Uint16Array(CELLS*CELLS);for(let i=0;i<obstacles.length;i++){const o=obstacles[i],rx=o.shape==='circle'?o.radius:o.halfWidth,ry=o.shape==='circle'?o.radius:o.halfHeight;for(let cy=Math.max(0,Math.floor((o.y-ry)/CELL));cy<=Math.min(CELLS-1,Math.floor((o.y+ry)/CELL));cy++)for(let cx=Math.max(0,Math.floor((o.x-rx)/CELL));cx<=Math.min(CELLS-1,Math.floor((o.x+rx)/CELL));cx++)cells[cy*CELLS+cx]|=1<<i;}return cells;}
const DESERT_CELLS=cellsFor(DESERT),ICE_CELLS=cellsFor(ICE);
export const emptyHit = (): SweepHit => ({hit:false,t:1,nx:0,ny:0,id:0});
const clamp = (n:number,a:number,b:number) => Math.max(a,Math.min(b,n));

export function sweepObstacles(level: TerrainLevel, x: number, y: number, dx: number, dy: number, bodyRadius: number, flying: boolean, out: SweepHit): SweepHit {
  out.hit=false;out.t=1;out.nx=out.ny=0;out.id=0;
  if(level==='training'||level==='forest'||(!dx&&!dy))return out;
  const obstacles=obstaclesFor(level),cells=level==='desert'?DESERT_CELLS:ICE_CELLS;
  let mask=0;const minX=Math.max(0,Math.floor((Math.min(x,x+dx)-bodyRadius)/CELL)),maxX=Math.min(CELLS-1,Math.floor((Math.max(x,x+dx)+bodyRadius)/CELL));
  const minY=Math.max(0,Math.floor((Math.min(y,y+dy)-bodyRadius)/CELL)),maxY=Math.min(CELLS-1,Math.floor((Math.max(y,y+dy)+bodyRadius)/CELL));
  for(let cy=minY;cy<=maxY;cy++)for(let cx=minX;cx<=maxX;cx++)mask|=cells[cy*CELLS+cx];
  while(mask){const bit=mask&-mask,index=31-Math.clz32(bit),obstacle=obstacles[index];mask^=bit;
    if(obstacle.shape==='circle'&&flying)continue;
    const extentX=(obstacle.shape==='circle'?obstacle.radius:obstacle.halfWidth)+bodyRadius;
    const extentY=(obstacle.shape==='circle'?obstacle.radius:obstacle.halfHeight)+bodyRadius;
    if(Math.max(x,x+dx)<obstacle.x-extentX||Math.min(x,x+dx)>obstacle.x+extentX||Math.max(y,y+dy)<obstacle.y-extentY||Math.min(y,y+dy)>obstacle.y+extentY)continue;
    let t=Infinity,nx=0,ny=0;
    if(obstacle.shape==='circle'){
      const rx=x-obstacle.x,ry=y-obstacle.y,R=obstacle.radius+bodyRadius;
      const a=dx*dx+dy*dy,b=2*(rx*dx+ry*dy),c=rx*rx+ry*ry-R*R;
      if(c<=0&&rx*dx+ry*dy<0){t=0;const len=Math.hypot(rx,ry)||1;nx=rx/len;ny=ry/len;}
      else{const discriminant=b*b-4*a*c;if(discriminant>=0){const candidate=(-b-Math.sqrt(discriminant))/(2*a);if(candidate>=0&&candidate<=1){t=candidate;const hx=rx+dx*t,hy=ry+dy*t,len=Math.hypot(hx,hy)||1;nx=hx/len;ny=hy/len;}}}
    }else{
      const minX=obstacle.x-obstacle.halfWidth-bodyRadius,maxX=obstacle.x+obstacle.halfWidth+bodyRadius;
      const minY=obstacle.y-obstacle.halfHeight-bodyRadius,maxY=obstacle.y+obstacle.halfHeight+bodyRadius;
      if(x>minX&&x<maxX&&y>minY&&y<maxY){t=0;const left=x-minX,right=maxX-x,bottom=y-minY,top=maxY-y,best=Math.min(left,right,bottom,top);nx=best===left?-1:best===right?1:0;ny=best===bottom?-1:best===top?1:0;}
      else{
        let enter=0,exit=1,enterNx=0,enterNy=0;
        if(dx===0){if(x<minX||x>maxX)continue;}
        else{const near=dx>0?(minX-x)/dx:(maxX-x)/dx,far=dx>0?(maxX-x)/dx:(minX-x)/dx;if(near>enter){enter=near;enterNx=dx>0?-1:1;enterNy=0;}exit=Math.min(exit,far);}
        if(dy===0){if(y<minY||y>maxY)continue;}
        else{const near=dy>0?(minY-y)/dy:(maxY-y)/dy,far=dy>0?(maxY-y)/dy:(minY-y)/dy;if(near>enter){enter=near;enterNx=0;enterNy=dy>0?-1:1;}exit=Math.min(exit,far);}
        if(enter<=exit&&enter>=0&&enter<=1&&(enterNx||enterNy)){t=enter;nx=enterNx;ny=enterNy;}
      }
    }
    if(t<out.t||t===1&&!out.hit){out.hit=true;out.t=t;out.nx=nx;out.ny=ny;out.id=obstacle.id;}
  }
  return out;
}

export function moveWithObstacles(level: TerrainLevel, x: number, y: number, dx: number, dy: number, radius: number, flying: boolean, slide: boolean, out: MoveResult, hit: SweepHit): MoveResult {
  out.x=x;out.y=y;out.hit=false;out.id=0;
  for(let iteration=0;iteration<(slide?3:1);iteration++){
    sweepObstacles(level,out.x,out.y,dx,dy,radius,flying,hit);
    if(!hit.hit){out.x+=dx;out.y+=dy;break;}
    const safeT=Math.max(0,hit.t-0.0001);out.x+=dx*safeT;out.y+=dy*safeT;out.hit=true;out.id=hit.id;
    if(!slide)break;
    dx*=1-safeT;dy*=1-safeT;const inward=dx*hit.nx+dy*hit.ny;
    if(inward<0){dx-=inward*hit.nx;dy-=inward*hit.ny;}
    if(Math.abs(dx)+Math.abs(dy)<1e-6)break;
  }
  out.x=clamp(out.x,1,179);out.y=clamp(out.y,1,179);return out;
}

export function projectOutside(level: TerrainLevel, x: number, y: number, radius: number, flying: boolean, out: MoveResult): MoveResult {
  out.x=clamp(x,1,179);out.y=clamp(y,1,179);out.hit=false;out.id=0;
  for(const obstacle of obstaclesFor(level)){
    if(obstacle.shape==='circle'&&flying)continue;
    if(obstacle.shape==='circle'){
      const dx=out.x-obstacle.x,dy=out.y-obstacle.y,R=obstacle.radius+radius+.02,d=Math.hypot(dx,dy);
      if(d<R){out.x=obstacle.x+(d?dx/d:1)*R;out.y=obstacle.y+(d?dy/d:0)*R;out.hit=true;out.id=obstacle.id;}
    }else{
      const hx=obstacle.halfWidth+radius+.02,hy=obstacle.halfHeight+radius+.02,dx=out.x-obstacle.x,dy=out.y-obstacle.y;
      if(Math.abs(dx)<hx&&Math.abs(dy)<hy){const gapX=hx-Math.abs(dx),gapY=hy-Math.abs(dy);if(gapX<gapY)out.x=obstacle.x+(dx<0?-hx:hx);else out.y=obstacle.y+(dy<0?-hy:hy);out.hit=true;out.id=obstacle.id;}
    }
  }
  out.x=clamp(out.x,1,179);out.y=clamp(out.y,1,179);return out;
}

export function iceLineClear(level: TerrainLevel,x1:number,y1:number,x2:number,y2:number,radius=0): boolean {
  if(level!=='ice')return true;
  return !sweepObstacles(level,x1,y1,x2-x1,y2-y1,radius,true,lineHit).hit;
}
const lineHit=emptyHit();

export function segmentCircleT(x:number,y:number,dx:number,dy:number,cx:number,cy:number,radius:number):number {
  const rx=x-cx,ry=y-cy,a=dx*dx+dy*dy,c=rx*rx+ry*ry-radius*radius;
  if(c<=0)return 0;if(a===0)return Infinity;
  const b=2*(rx*dx+ry*dy),disc=b*b-4*a*c;if(disc<0)return Infinity;
  const t=(-b-Math.sqrt(disc))/(2*a);return t>=0&&t<=1?t:Infinity;
}

export function waypointFor(obstacle:Obstacle,side:number,radius:number,out:MoveResult):MoveResult {
  const margin=radius+1.2;
  if(obstacle.shape==='circle'){
    const angle=side*Math.PI/2;out.x=obstacle.x+Math.cos(angle)*(obstacle.radius+margin);out.y=obstacle.y+Math.sin(angle)*(obstacle.radius+margin);
  }else{out.x=obstacle.x+(side===0||side===3?-1:1)*(obstacle.halfWidth+margin);out.y=obstacle.y+(side<2?-1:1)*(obstacle.halfHeight+margin);}
  out.hit=false;out.id=obstacle.id;return out;
}
