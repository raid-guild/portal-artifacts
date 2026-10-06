export function interpolateBuffer(out, previous, current, alpha) {
  for(let i=0;i<out.length;i++)out[i]=previous[i]+(current[i]-previous[i])*alpha;
  return out;
}

const DT=1/60;
export const worldGravity=setting=>10.08*setting;

// The rendered root is a bottom pivot. The free body's center of mass is
// rootY - effectiveHeight * (1 - squash), so shape recovery moves the center
// without creating a second, canned bounce velocity.
export class BounceMotion {
  constructor(y,effectiveHeight=1){this.effectiveHeight=effectiveHeight;this.reset(y)}
  reset(y){
    this.y=y;this.comY=y;this.comVelocity=0;this.rootVelocity=0;
    this.grounded=false;this.touchdowns=0;this.launches=0;this.contactSequence=0;
    this.previousShapeVelocity=0;
  }
  kick(speed=.058){
    this.grounded=false;
    this.comVelocity=Math.max(this.comVelocity,speed/DT);
  }
  beforeShape(support,gravity,_damping,squash=1,squashVelocity=0){
    const h=this.effectiveHeight;
    this.previousShapeVelocity=squashVelocity;
    if(this.grounded){
      this.rootVelocity=(support-this.y)/DT;
      this.y=support;this.comY=this.y-h*(1-squash);
      this.comVelocity=this.rootVelocity+h*squashVelocity;
      return 0;
    }
    this.comVelocity-=worldGravity(gravity)*DT;
    this.comY+=this.comVelocity*DT;
    this.y=this.comY+h*(1-squash);
    this.rootVelocity=this.comVelocity-h*squashVelocity;
    if(this.y<=support){
      const impact=Math.max(0,-this.rootVelocity*DT);
      this.y=support;this.comY=this.y-h*(1-squash);this.grounded=true;this.contactSequence++;
      if(impact>.001)this.touchdowns++;
      this.rootVelocity=0;
      return impact;
    }
    return 0;
  }
  afterShape(support,squash,squashVelocity,gravity){
    const h=this.effectiveHeight;
    if(this.grounded){
      const supportVelocity=(support-this.y)/DT;
      this.y=support;this.comY=this.y-h*(1-squash);
      this.comVelocity=supportVelocity+h*squashVelocity;
      const reaction=worldGravity(gravity)+h*(squashVelocity-this.previousShapeVelocity)/DT;
      if(reaction<0&&this.comVelocity>.05){this.grounded=false;this.launches++}
      this.rootVelocity=supportVelocity;
      return 0;
    }
    this.y=this.comY+h*(1-squash);
    this.rootVelocity=this.comVelocity-h*squashVelocity;
    if(this.y<=support){
      const impact=Math.max(0,-this.rootVelocity*DT);
      this.y=support;this.comY=this.y-h*(1-squash);this.grounded=true;this.contactSequence++;
      if(impact>.001)this.touchdowns++;
      this.rootVelocity=0;
      return impact;
    }
    return 0;
  }
}
