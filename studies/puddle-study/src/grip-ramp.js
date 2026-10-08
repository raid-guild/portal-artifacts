// Older exported levels omit axis and keep the original north/south ramp.
export const gripAxis=ramp=>ramp?.axis==='x'?'x':'z';
export const gripLowHeight=ramp=>gripAxis(ramp)==='x'?Math.min(ramp.minHeight,ramp.maxHeight):Math.min(ramp.northHeight,ramp.southHeight);
export const gripHighHeight=ramp=>gripAxis(ramp)==='x'?Math.max(ramp.minHeight,ramp.maxHeight):Math.max(ramp.northHeight,ramp.southHeight);
export function gripKey(ramp,platform,position){
  if(gripAxis(ramp)==='x')return position.x<platform.minX?'D':'A';
  return position.z<platform.minZ?'S':'W';
}
