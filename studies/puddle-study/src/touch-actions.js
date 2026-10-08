// A button may have several fingers on it. Releasing one does not release the others.
export function bindHoldButton(element,canStart){
  const ids=new Set();
  element.addEventListener('pointerdown',event=>{
    if(!canStart())return;
    event.preventDefault();ids.add(event.pointerId);element.setPointerCapture(event.pointerId);
  });
  for(const type of ['pointerup','pointercancel','lostpointercapture'])
    element.addEventListener(type,event=>ids.delete(event.pointerId));
  return {get active(){return ids.size>0;},clear(){ids.clear();}};
}

// Each pointer has its own PullGesture source. Cancellation never counts as a tap.
export function bindPullButton(element,pull,canStart,now=()=>performance.now()){
  const ids=new Set(),source=id=>`pointer-${id}`;
  element.addEventListener('pointerdown',event=>{
    if(!canStart())return;
    event.preventDefault();ids.add(event.pointerId);pull.down(source(event.pointerId),now());
    element.setPointerCapture(event.pointerId);
  });
  element.addEventListener('pointerup',event=>{
    if(!ids.delete(event.pointerId))return;
    if(canStart())pull.up(source(event.pointerId),now());else pull.cancelSource(source(event.pointerId));
  });
  for(const type of ['pointercancel','lostpointercapture'])
    element.addEventListener(type,event=>{if(ids.delete(event.pointerId))pull.cancelSource(source(event.pointerId));});
  return {clear(){for(const id of ids)pull.cancelSource(source(id));ids.clear();}};
}
