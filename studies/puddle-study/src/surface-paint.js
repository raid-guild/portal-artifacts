import {groundAt,supportedGroundAt} from './colliders.js';

const inside=(c,x,z)=>x>=c.minX&&x<=c.maxX&&z>=c.minZ&&z<=c.maxZ;

// Paint belongs to the support that was hit when the stroke began. The owner
// describes the same surface after that piece moves, grows, or becomes CSG.
export function paintSurfaceHeight(paint,x,z,colliders=[]){
  const c=paint.owner;
  if(!c)return groundAt(x,z,colliders).height;
  if(c.type==='cylinder')return Math.hypot(x-c.x,z-c.z)<=c.radius?c.height:null;
  if(!inside(c,x,z))return null;
  if(c.type==='box')return c.maxY;
  if(c.type==='roof')return c.top;
  if(c.type==='editor-stairs'){
    const span=c.axis==='x'?c.maxX-c.minX:c.maxZ-c.minZ;
    let fraction=c.axis==='x'?(x-c.minX)/span:(z-c.minZ)/span;
    if(c.reverse)fraction=1-fraction;
    return c.base+c.rise*fraction;
  }
  if(c.type==='grip-ramp')return c.axis==='x'?c.minHeight+(c.maxHeight-c.minHeight)*(x-c.minX)/(c.maxX-c.minX):
    c.northHeight+(c.southHeight-c.northHeight)*(z-c.minZ)/(c.maxZ-c.minZ);
  return c.maxY??null;
}

export function floorPaintApplies(paint,particle,r,colliders,size=1,supportHeight){
  if(paint.face&&paint.face!=='floor'||particle.x<paint.minX||particle.x>paint.maxX||
    particle.z<paint.minZ||particle.z>paint.maxZ)return false;
  const height=paintSurfaceHeight(paint,particle.x,particle.z,colliders);
  if(height===null||!Number.isFinite(height))return false;
  // Untargeted strokes are terrain paint. A terrace step must not carry the
  // color across to a different height, even if the rectangle spans it.
  if(!paint.targetId&&paint.base!==undefined&&Math.abs(height-paint.base)>.2)return false;
  const support=supportHeight??supportedGroundAt(particle,r,colliders);
  return Math.abs(support-height)<.16&&particle.y<support+r+.34*size;
}
