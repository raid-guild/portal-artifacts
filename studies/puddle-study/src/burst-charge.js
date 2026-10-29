// Three seconds of warning flashes, accelerating from 2.5 to 4 pulses/second.
export function burstFlashColor(gesture,base){
  if(!gesture.charging)return base;
  const elapsed=gesture.chargeProgress*3,phase=2.5*elapsed+.25*elapsed*elapsed;
  return Math.cos(phase*Math.PI*2)>0?0xfff0cb:0xe24d3e;
}
