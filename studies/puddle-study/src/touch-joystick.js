// A touch may steer or tap, never both. Only the first finger owns movement.
export class TouchJoystick {
  constructor({onDoubleTap=()=>{},onChange=()=>{},deadzone=10,radius=48,tapMs=220,doubleMs=300,tapDistance=28}={}){
    Object.assign(this,{onDoubleTap,onChange,deadzone,radius,tapMs,doubleMs,tapDistance});this.cancel();
  }
  down(id,x,y,now){
    if(this.touches.has(id))return false;
    this.touches.set(id,{x,y,startX:x,startY:y,started:now,dragged:false});
    if(this.owner===null){this.owner=id;this.origin={x,y};this.vector={x:0,y:0};this.onChange(this);}
    return true;
  }
  move(id,x,y){
    const touch=this.touches.get(id);if(!touch)return;
    touch.x=x;touch.y=y;
    if(Math.hypot(x-touch.startX,y-touch.startY)>this.deadzone)touch.dragged=true;
    if(id!==this.owner)return;
    const dx=x-this.origin.x,dy=y-this.origin.y,length=Math.hypot(dx,dy);
    this.vector=length<=this.deadzone?{x:0,y:0}:{x:dx/length,y:dy/length};
    this.onChange(this);
  }
  up(id,x,y,now){
    const touch=this.touches.get(id);if(!touch)return;
    this.move(id,x,y);
    this.touches.delete(id);
    if(id===this.owner){this.owner=null;this.vector={x:0,y:0};this.onChange(this);}
    if(touch.dragged||now-touch.started>this.tapMs){this.lastTap=null;return;}
    if(this.lastTap&&now-this.lastTap.time<=this.doubleMs&&
      Math.hypot(x-this.lastTap.x,y-this.lastTap.y)<=this.tapDistance){
      this.lastTap=null;this.onDoubleTap(x,y);
    }else this.lastTap={x,y,time:now};
  }
  cancel(id){
    if(id===undefined){this.touches=new Map();this.owner=null;this.origin=null;this.vector={x:0,y:0};this.lastTap=null;}
    else{if(!this.touches.has(id))return;
      this.touches.delete(id);if(this.owner===id){this.owner=null;this.origin=null;this.vector={x:0,y:0};}this.lastTap=null;}
    this.onChange(this);
  }
}
