// A touch may steer or tap, never both. Only the first finger owns movement.
export class TouchJoystick {
  constructor({onDoubleTap=()=>{},onFlick=()=>{},onHoldStart=()=>{},onBurst=()=>{},onChange=()=>{},deadzone=10,radius=48,tapMs=220,doubleMs=300,tapDistance=28,flickDistance=42,flickMs=260,flickIdleMs=90,holdMs=300,chargeMs=3000,burstMs=6000}={}){
    Object.assign(this,{onDoubleTap,onFlick,onHoldStart,onBurst,onChange,deadzone,radius,tapMs,doubleMs,tapDistance,flickDistance,flickMs,flickIdleMs,holdMs,chargeMs,burstMs});this.cancel();
  }
  down(id,x,y,now){
    if(this.touches.has(id))return false;
    this.touches.set(id,{x,y,startX:x,startY:y,started:now,lastMotionAt:now,
      samples:[{x,y,time:now}],dragged:false});
    if(this.owner===null){this.owner=id;this.origin={x,y};this.vector={x:0,y:0};this.holding=false;this.burstConsumed=false;this.charging=false;this.chargeProgress=0;this.onChange(this);}
    return true;
  }
  move(id,x,y,now){
    const touch=this.touches.get(id);if(!touch)return;
    if(Number.isFinite(now)&&Math.hypot(x-touch.x,y-touch.y)>=2){
      touch.lastMotionAt=now;touch.samples.push({x,y,time:now});
      if(touch.samples.length>64)touch.samples.splice(1,touch.samples.length-64);
    }
    touch.x=x;touch.y=y;
    if(Math.hypot(x-touch.startX,y-touch.startY)>this.deadzone)touch.dragged=true;
    if(id!==this.owner)return;
    if(this.holding||this.burstConsumed)return;
    const dx=x-this.origin.x,dy=y-this.origin.y,length=Math.hypot(dx,dy);
    this.vector=length<=this.deadzone?{x:0,y:0}:{x:dx/length,y:dy/length};
    this.onChange(this);
  }
  update(now){
    const touch=this.touches.get(this.owner);
    if(!touch||this.burstConsumed||!Number.isFinite(now))return false;
    if(!this.holding){
      if(touch.dragged||now-touch.started<this.holdMs)return false;
      this.holding=true;this.lastTap=null;this.vector={x:0,y:0};this.onHoldStart();this.onChange(this);
    }
    this.charging=now-touch.started>=this.chargeMs;
    this.chargeProgress=this.charging?Math.min(1,(now-touch.started-this.chargeMs)/(this.burstMs-this.chargeMs)):0;
    if(now-touch.started>=this.burstMs){
      this.holding=false;this.burstConsumed=true;this.charging=false;this.chargeProgress=0;this.lastTap=null;
      this.vector={x:0,y:0};this.onBurst();this.onChange(this);
    }
    return this.holding;
  }
  up(id,x,y,now){
    const touch=this.touches.get(id);if(!touch)return null;
    const wasOwner=id===this.owner;
    this.move(id,x,y,now);
    // A release can arrive before the next animation frame. Check the final
    // position first so a late swipe cannot be mistaken for a stationary hold.
    if(wasOwner)this.update(now);
    this.touches.delete(id);
    const wasHolding=wasOwner&&this.holding,wasBurst=wasOwner&&this.burstConsumed;
    if(wasOwner){this.owner=null;this.holding=false;this.burstConsumed=false;this.charging=false;this.chargeProgress=0;this.vector={x:0,y:0};this.onChange(this);}
    if(!wasOwner)return 'secondary';
    if(wasHolding||wasBurst){this.lastTap=null;return wasBurst?'burst':'hold';}
    const duration=Math.max(1,now-touch.started),dx=x-touch.startX,dy=y-touch.startY;
    const distance=Math.hypot(dx,dy);
    const recent=touch.samples.filter(sample=>sample.time<=now-this.flickIdleMs).at(-1)||touch.samples[0];
    const recentDistance=Math.hypot(x-recent.x,y-recent.y);
    if(wasOwner&&duration<=this.flickMs&&distance>=this.flickDistance&&distance/duration>=.24&&
      now-touch.lastMotionAt<=this.flickIdleMs&&recentDistance>=14){
      this.lastTap=null;this.onFlick({dx,dy,distance,duration});return 'flick';
    }
    if(touch.dragged||duration>this.tapMs){this.lastTap=null;return 'drag';}
    if(this.lastTap&&now-this.lastTap.time<=this.doubleMs&&
      Math.hypot(x-this.lastTap.x,y-this.lastTap.y)<=this.tapDistance){
      this.lastTap=null;this.onDoubleTap(x,y);return 'double-tap';
    }else this.lastTap={x,y,time:now};
    return 'tap';
  }
  cancel(id){
    if(id===undefined){this.touches=new Map();this.owner=null;this.holding=false;this.burstConsumed=false;this.charging=false;this.chargeProgress=0;this.origin=null;this.vector={x:0,y:0};this.lastTap=null;}
    else{if(!this.touches.has(id))return;
      this.touches.delete(id);if(this.owner===id){this.owner=null;this.holding=false;this.burstConsumed=false;this.charging=false;this.chargeProgress=0;this.origin=null;this.vector={x:0,y:0};}this.lastTap=null;}
    this.onChange(this);
  }
}
