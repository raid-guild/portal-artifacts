// Paint is authored on one real, planar face. The saved rectangles retain the
// v3 footprint fields; vertical faces additionally use minY/maxY.
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const rectOf=o=>{
  if(['block','legacy-roof','legacy-passage','lowgap'].includes(o.kind))return o;
  if(o.kind==='grip')return o.platform;
  if(o.kind==='stairs'){
    const hx=(o.axis==='x'?o.run:o.width)/2,hz=(o.axis==='z'?o.run:o.width)/2;
    return {minX:o.x-hx,maxX:o.x+hx,minZ:o.z-hz,maxZ:o.z+hz};
  }
  if(o.kind==='pillar')return {minX:o.x-o.radius,maxX:o.x+o.radius,minZ:o.z-o.radius,maxZ:o.z+o.radius};
  return null;
};
const topOf=o=>o.kind==='block'?o.maxY:o.kind==='pillar'?(o.base??0)+o.height:
  ['legacy-roof','legacy-passage','lowgap'].includes(o.kind)?o.top:o.kind==='grip'?o.platform.maxY:null;
const bottomOf=o=>o.kind==='block'?o.minY??0:o.kind==='pillar'?o.base??0:
  ['legacy-roof','legacy-passage','lowgap'].includes(o.kind)?o.bottom:o.kind==='grip'?o.platform.minY??0:0;
const wallFaces=new Set(['north','south','east','west']);

export function paintFaceForHit(draft,hit){
  if(!hit)return {error:'Choose a visible floor or flat exterior wall.'};
  const owner=hit.targetId?draft.objects.find(o=>o.id===hit.targetId):null;
  if(hit.targetId&&!owner)return {error:'This face cannot be painted.'};
  if(hit.face==='floor'){
    if(owner&&!['block','pillar','stairs','legacy-roof','legacy-passage','lowgap','grip'].includes(owner.kind))
      return {error:'This top cannot be painted yet.'};
    const ramp=owner?.kind==='grip'?owner.ramp:null,
      onRamp=ramp&&hit.x>=ramp.minX-.02&&hit.x<=ramp.maxX+.02&&hit.z>=ramp.minZ-.02&&hit.z<=ramp.maxZ+.02,
      rampHeight=onRamp?(ramp.axis==='x'?ramp.minHeight+(ramp.maxHeight-ramp.minHeight)*
        (hit.x-ramp.minX)/(ramp.maxX-ramp.minX):ramp.northHeight+(ramp.southHeight-ramp.northHeight)*
        (hit.z-ramp.minZ)/(ramp.maxZ-ramp.minZ)):null,
      rampPart=owner?.kind==='grip'&&(hit.part==='ramp'||onRamp&&Math.abs(hit.y-rampHeight)<.12&&
        (hit.part!=='platform'&&Math.abs(hit.y-owner.platform.maxY)>.08));
    const top=owner&&topOf(owner);
    if(top!==null&&Math.abs(hit.y-top)>.09&&owner?.kind!=='stairs'&&!rampPart)
      return {error:'Choose the outside top; basin interiors and cut faces cannot be painted.'};
    const r=rampPart?ramp:owner?rectOf(owner):draft.boundary;
    if(!r)return {error:'This face cannot be painted.'};
    return {face:'floor',targetId:owner?.id||null,base:hit.y,...(rampPart?{part:'ramp'}:owner?.kind==='grip'?{part:'platform'}:{}),
      minX:r.minX,maxX:r.maxX,minZ:r.minZ,maxZ:r.maxZ};
  }
  if(!wallFaces.has(hit.face)||!owner||!['block','legacy-roof','legacy-passage','lowgap','grip'].includes(owner.kind))
    return {error:'Paint supports flat exterior walls; curved sides and cut interiors are not paintable.'};
  const r=rectOf(owner),axis=['east','west'].includes(hit.face)?'x':'z',
    edge=r[hit.face==='east'?'maxX':hit.face==='west'?'minX':hit.face==='south'?'maxZ':'minZ'];
  if(Math.abs(hit[axis]-edge)>.075)
    return {error:'Choose the outside wall face; cut interiors cannot be painted.'};
  const minY=bottomOf(owner),maxY=topOf(owner);
  if(maxY===null||maxY-minY<.12)return {error:'This wall has no paintable height.'};
  return {face:hit.face,targetId:owner.id,base:minY,minY,maxY,edge,
    minX:r.minX,maxX:r.maxX,minZ:r.minZ,maxZ:r.maxZ};
}

export function paintArea(face,start,end,mode='fill'){
  if(face.error)return null;
  if(mode==='fill'){
    if(face.face==='floor')return {...face};
    const {edge,...rest}=face;
    return ['east','west'].includes(face.face)?{...rest,minX:edge-.015,maxX:edge+.015}:
      {...rest,minZ:edge-.015,maxZ:edge+.015};
  }
  if(!start||!end)return null;
  if(face.face==='floor'){
    const minX=clamp(Math.min(start.x,end.x),face.minX,face.maxX),maxX=clamp(Math.max(start.x,end.x),face.minX,face.maxX),
      minZ=clamp(Math.min(start.z,end.z),face.minZ,face.maxZ),maxZ=clamp(Math.max(start.z,end.z),face.minZ,face.maxZ);
    return maxX-minX>=.12&&maxZ-minZ>=.12?{...face,minX,maxX,minZ,maxZ}:null;
  }
  const eastWest=['east','west'].includes(face.face),axis=eastWest?'z':'x',
    lo=eastWest?face.minZ:face.minX,hi=eastWest?face.maxZ:face.maxX,
    min=clamp(Math.min(start[axis],end[axis]),lo,hi),max=clamp(Math.max(start[axis],end[axis]),lo,hi),
    minY=clamp(Math.min(start.y,end.y),face.minY,face.maxY),maxY=clamp(Math.max(start.y,end.y),face.minY,face.maxY);
  if(max-min<.12||maxY-minY<.12)return null;
  const {edge,...rest}=face;
  return eastWest?{...rest,minX:edge-.015,maxX:edge+.015,minZ:min,maxZ:max,minY,maxY}:
    {...rest,minZ:edge-.015,maxZ:edge+.015,minX:min,maxX:max,minY,maxY};
}

export function movePaintWithinFace(draft,paint,dx,dy,dz){
  const owner=draft.objects.find(item=>item.id===paint.targetId);
  if(paint.face!=='floor'){paint.minY??=paint.base??0;
    paint.maxY??=(owner?topOf(owner):null)||paint.minY+.2;}
  const center={targetId:paint.targetId||null,face:paint.face,
    x:(paint.minX+paint.maxX)/2,y:paint.face==='floor'?paint.base:(paint.minY+paint.maxY)/2,
    z:(paint.minZ+paint.maxZ)/2,part:paint.part};
  const face=paintFaceForHit(draft,center);if(face.error)return false;
  const shift=(lo,hi,delta,minimum,maximum)=>{
    const length=paint[hi]-paint[lo],low=clamp(paint[lo]+delta,minimum,maximum-length);
    paint[lo]=low;paint[hi]=low+length;
  };
  if(face.face==='floor'){shift('minX','maxX',dx,face.minX,face.maxX);
    shift('minZ','maxZ',dz,face.minZ,face.maxZ);}
  else{
    if(['east','west'].includes(face.face))shift('minZ','maxZ',dz,face.minZ,face.maxZ);
    else shift('minX','maxX',dx,face.minX,face.maxX);
    shift('minY','maxY',dy,face.minY,face.maxY);
  }
  return true;
}
