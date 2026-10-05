export function interpolateBuffer(out, previous, current, alpha) {
  for(let i=0;i<out.length;i++)out[i]=previous[i]+(current[i]-previous[i])*alpha;
  return out;
}

// Root motion has a contact phase, giving the jelly time to compress before lift-off.
export class BounceMotion {
  constructor(y) { this.reset(y); }
  reset(y) {
    this.y=y; this.vy=0; this.grounded=false;
    this.impactSpeed=0; this.launchArmed=false;
    this.touchdowns=0; this.launches=0;
  }
  kick(speed=.058) {
    this.grounded=false; this.launchArmed=false; this.impactSpeed=0;
    this.vy=Math.max(this.vy,speed);
  }
  beforeShape(support,gravity,damping) {
    if(this.grounded){this.y=support;return 0;}
    this.vy-=.0028*gravity;
    this.vy*=.994-damping*.016;
    this.y+=this.vy;
    if(this.y<=support&&this.vy<0){
      const speed=-this.vy;
      this.y=support;this.vy=0;this.grounded=true;
      if(speed>.006)this.touchdowns++;
      this.impactSpeed=speed;
      this.launchArmed=speed>.014;
      return speed;
    }
    return 0;
  }
  afterShape(support,squash,squashVelocity,damping) {
    if(this.grounded){
      this.y=support;
      if(this.launchArmed&&squash>.91&&squashVelocity>.16){
        this.vy=this.impactSpeed*(.56-damping*.13);
        this.grounded=false;this.launchArmed=false;this.launches++;
      } else if(Math.abs(squash-1)<.015&&Math.abs(squashVelocity)<.12){
        this.launchArmed=false;
      }
    } else if(this.y<support) {
      this.y=support;
    }
  }
}
