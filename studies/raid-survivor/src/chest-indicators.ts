import type { Pickup, Vec } from './game';

export type ScreenPoint={x:number;y:number};
export type ScreenRect={x:number;y:number;width:number;height:number};
export type ChestIndicator=ScreenPoint&{angle:number;life:number};

/** Stage-local CSS-pixel positions for at most two offscreen vault chests. */
export function projectChestIndicators(
  pickups:readonly Pickup[], origin:Vec, project:(x:number,y:number)=>ScreenPoint,
  width:number,height:number,exclusions:readonly ScreenRect[]=[]
):ChestIndicator[]{
  if(width<100||height<180)return [];
  const center=project(origin.x,origin.y),left=42,right=width-42,top=95,bottom=height-145;
  const edgeWidth=right-left,edgeHeight=bottom-top,perimeter=2*(edgeWidth+edgeHeight);
  const perimeterPoint=(distance:number):ScreenPoint=>{
    let s=((distance%perimeter)+perimeter)%perimeter;
    if(s<=edgeWidth)return{x:left+s,y:top};s-=edgeWidth;
    if(s<=edgeHeight)return{x:right,y:top+s};s-=edgeHeight;
    if(s<=edgeWidth)return{x:right-s,y:bottom};s-=edgeWidth;
    return{x:left,y:bottom-s};
  };
  const candidates=pickups.filter(item=>item.kind==='chest'&&item.life>0).sort((a,b)=>
    (a.x-origin.x)**2+(a.y-origin.y)**2-((b.x-origin.x)**2+(b.y-origin.y)**2));
  const result:ChestIndicator[]=[];
  for(const item of candidates){
    if(result.length===2)break;
    const point=project(item.x,item.y);
    if(point.x>=0&&point.x<=width&&point.y>=0&&point.y<=height)continue;
    const dx=point.x-center.x,dy=point.y-center.y;
    if(!dx&&!dy)continue;
    const t=Math.min(dx<0?(left-center.x)/dx:dx>0?(right-center.x)/dx:Infinity,
      dy<0?(top-center.y)/dy:dy>0?(bottom-center.y)/dy:Infinity);
    const edgeX=Math.max(left,Math.min(right,center.x+dx*t)),edgeY=Math.max(top,Math.min(bottom,center.y+dy*t));
    const start=Math.abs(edgeY-top)<1?edgeX-left:Math.abs(edgeX-right)<1?edgeWidth+edgeY-top:
      Math.abs(edgeY-bottom)<1?edgeWidth+edgeHeight+right-edgeX:2*edgeWidth+edgeHeight+bottom-edgeY;
    let chosen:ScreenPoint|null=null;
    // Search around the full safe perimeter so HUD panels can block an entire edge.
    for(let step=0;step<=Math.ceil(perimeter/50)&&!chosen;step++)for(const sign of step===0?[0]:[-1,1]){
      const {x,y}=perimeterPoint(start+step*25*sign);
      if(exclusions.some(rect=>x>=rect.x-22&&x<=rect.x+rect.width+22&&y>=rect.y-22&&y<=rect.y+rect.height+22))continue;
      if(result.some(other=>Math.hypot(other.x-x,other.y-y)<44))continue;
      chosen={x,y};break;
    }
    if(chosen)result.push({...chosen,angle:Math.atan2(dy,dx),life:item.life});
  }
  return result;
}
