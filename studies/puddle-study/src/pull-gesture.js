// Keyboard and pointer share one tap/hold gesture; canceled input never taps.
export class PullGesture {
  constructor(onTap,threshold=220){this.onTap=onTap;this.threshold=threshold;this.cancel();}
  down(source,now){if(this.sources.has(source))return;if(!this.sources.size){this.started=now;this.holding=false;}this.sources.add(source);}
  update(now){if(this.sources.size&&now-this.started>=this.threshold)this.holding=true;return this.sources.size>0&&this.holding;}
  up(source,now){if(!this.sources.has(source))return;this.update(now);this.sources.delete(source);if(!this.sources.size){if(!this.holding)this.onTap();this.holding=false;}}
  cancelSource(source){if(!this.sources.delete(source))return;
    if(!this.sources.size){this.started=0;this.holding=false;}}
  cancel(){this.sources=new Set();this.started=0;this.holding=false;}
}
