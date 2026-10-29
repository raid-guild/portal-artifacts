import {TouchJoystick} from './touch-joystick.js';

const directions={KeyA:[-1,0],ArrowLeft:[-1,0],KeyD:[1,0],ArrowRight:[1,0],
  KeyW:[0,1],ArrowUp:[0,1],KeyS:[0,-1],ArrowDown:[0,-1]};

// Space shares the pointer hold clock. Direction taps require a real release,
// so auto-repeat, long walking holds, and overlapping directions never fling.
export class KeyboardGestures {
  constructor({onRecall=()=>{},onHoldStart=()=>{},onBurst=()=>{},onFling=()=>{},tapMs=220,doubleMs=280}={}){
    Object.assign(this,{onRecall,onFling,tapMs,doubleMs});
    this.space=new TouchJoystick({onHoldStart,onBurst,tapMs:300});this.cancel();
  }
  get holding(){return this.space.holding;}
  get charging(){return this.space.charging;}
  get chargeProgress(){return this.space.chargeProgress;}
  down(code,now,{repeat=false,modified=false}={}){
    if(modified){this.lastTap=null;return false;}
    if(repeat||!Number.isFinite(now))return false;
    if(code==='Space')return this.space.down('keyboard',0,0,now);
    const axes=directions[code];if(!axes||this.pressed.has(code))return false;
    const overlapping=this.pressed.size>0;
    if(overlapping){for(const press of this.pressed.values())press.overlapping=true;this.lastTap=null;}
    const press={started:now,axes,overlapping,used:false};this.pressed.set(code,press);
    if(!overlapping&&this.lastTap&&now-this.lastTap.time<=this.doubleMs&&
      axes[0]===this.lastTap.axes[0]&&axes[1]===this.lastTap.axes[1]){
      this.lastTap=null;press.used=true;this.onFling({horizontal:axes[0],vertical:axes[1]});return true;
    }
    this.lastTap=null;return false;
  }
  up(code,now){
    if(code==='Space'){
      const action=this.space.up('keyboard',0,0,now);
      this.space.cancel();if(action==='tap')this.onRecall();return action;
    }
    const press=this.pressed.get(code);if(!press)return null;
    this.pressed.delete(code);
    this.lastTap=!press.used&&!press.overlapping&&Number.isFinite(now)&&now-press.started<=this.tapMs?
      {axes:press.axes,time:now}:null;
    return 'direction';
  }
  update(now){return this.space.update(now);}
  cancel(){this.space.cancel();this.pressed=new Map();this.lastTap=null;}
}
