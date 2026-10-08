import ManifoldModule from 'manifold-3d/manifold';

// Vite serves the WASM from a different URL in development and production.
// Node's native ESM tests load the package's own adjacent WASM file.
const wasmUrl=typeof window==='undefined'?undefined:(await import('manifold-3d/manifold.wasm?url')).default;
const module=await ManifoldModule(wasmUrl?{locateFile:()=>wasmUrl}:undefined);module.setup();
const {Manifold,Mesh}=module;
let revision=0,lastKey='',lastSolid=null;

const box=({minX,maxX,minY,maxY,minZ,maxZ})=>
  Manifold.cube([maxX-minX,maxY-minY,maxZ-minZ],true)
    .translate((minX+maxX)/2,(minY+maxY)/2,(minZ+maxZ)/2);

function ramp(o){
  const {minX,maxX,minZ,maxZ}=o,low=o.base??o.minY??0;
  const h=(x,z)=>o.type==='editor-stairs'?
    o.base+o.rise*(o.reverse?(o.axis==='x'?(maxX-x)/(maxX-minX):(maxZ-z)/(maxZ-minZ)):
      (o.axis==='x'?(x-minX)/(maxX-minX):(z-minZ)/(maxZ-minZ))):
    o.axis==='x'?o.minHeight+(o.maxHeight-o.minHeight)*(x-minX)/(maxX-minX):
      o.northHeight+(o.southHeight-o.northHeight)*(z-minZ)/(maxZ-minZ);
  const bottom=Math.min(low,h(minX,minZ),h(maxX,maxZ))-.06,
    coords=[minX,bottom,minZ,maxX,bottom,minZ,maxX,bottom,maxZ,minX,bottom,maxZ,
      minX,h(minX,minZ),minZ,maxX,h(maxX,minZ),minZ,maxX,h(maxX,maxZ),maxZ,minX,h(minX,maxZ),maxZ],
    triangles=[0,1,2,0,2,3,4,6,5,4,7,6,0,5,1,0,4,5,
      3,2,7,2,6,7,0,3,7,0,7,4,1,5,6,1,6,2];
  const mesh=new Mesh({numProp:3,vertProperties:new Float32Array(coords),triVerts:new Uint32Array(triangles)});
  return new Manifold(mesh);
}

function primitive(c){
  if(c.type==='box'||c.type==='roof')return box({...c,minY:c.type==='roof'?c.bottom:c.minY,maxY:c.type==='roof'?c.top:c.maxY});
  if(c.type==='cylinder')return Manifold.cylinder(c.height-(c.base??0),c.radius,c.radius,48,true)
    .rotate(90,0,0).translate(c.x,((c.base??0)+c.height)/2,c.z);
  if(c.type==='grip-ramp'||c.type==='editor-stairs')return ramp(c);
  throw new Error(`Unsupported cutter target ${c.type}.`);
}
function cutter(o){
  let solid;
  if(o.shape==='frustum')solid=Manifold.cylinder(o.height,o.radius,o.bottomRadius,64,true).rotate(90,0,0);
  else if(o.shape==='cylinder')solid=Manifold.cylinder(o.height,o.radius,o.radius,48,true).rotate(90,0,0);
  else solid=Manifold.cube([o.width,o.height,o.depth],true);
  const r=o.rotation||{x:0,y:0,z:0};
  return solid.rotate(r.x||0,r.y||0,r.z||0).translate(o.x,o.y,o.z);
}
export function commitEditorSolid(solids,cutters){
  if(!cutters.length||!solids.length)return null;
  const key=JSON.stringify([solids,cutters]);if(key===lastKey)return lastSolid;
  const parts=[],tools=[];let united=null,removed=null,result=null;
  try{
    for(const c of solids)parts.push(primitive(c));
    for(const o of cutters)tools.push(cutter(o));
    united=parts.length===1?parts[0]:Manifold.union(parts);
    removed=tools.length===1?tools[0]:Manifold.union(tools);
    result=Manifold.difference(united,removed);
    const mesh=result.getMesh(),vertices=new Float32Array(mesh.vertProperties),indices=new Uint32Array(mesh.triVerts);
    if(indices.length>180000)throw new Error('Cut geometry is too complex; use fewer overlapping cutters.');
    const solid={type:'editor-solid-mesh',revision:++revision,vertices,indices};
    lastKey=key;lastSolid=solid;return solid;
  }finally{
    const owned=new Set([...parts,...tools,united,removed,result]);
    for(const item of owned)item?.delete?.();
  }
}
