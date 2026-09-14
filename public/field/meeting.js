export function meetingFurniture(room){
 if(room.kind!=='meeting')return[];
 const seats=[];for(const x of [-1.5,1.5])for(const z of [-1.45,0,1.45])seats.push({asset:'Chair',x,z,rotation:x<0?Math.PI/2:-Math.PI/2,w:.65,d:.65});
 seats.push({asset:'Chair',x:0,z:-2.95,rotation:0,w:.65,d:.65},{asset:'Chair',x:0,z:2.95,rotation:Math.PI,w:.65,d:.65});
 return[{asset:'MeetingTable',x:0,z:0,rotation:0,w:2.10,d:4.55},...seats];
}
export function galleryPosters(room){return room.kind==='gallery'?[
 {asset:'ExcellencePoster',x:room.w/2-.09,z:-room.d/2+1.25,y:1.6,rotation:-Math.PI/2},
 {asset:'BoardroomPoster',x:room.w/2-.09,z:0,y:1.65,rotation:-Math.PI/2},
 {asset:'ObservationPoster',x:room.w/2-.09,z:room.d/2-1.0,y:1.55,rotation:-Math.PI/2},
 {asset:'AttendancePoster',x:-room.w/2+1.3,z:-room.d/2+.09,y:1.55,rotation:0},
 {asset:'LegacyPoster',x:room.w/2-1.3,z:-room.d/2+.09,y:1.55,rotation:0}
]:[];}

// The supplied portrait is already graded very dark. Recover print detail before
// room lighting is applied; retain ordinary shadows and fog, with no emission.
export function preparePortrait(props){
 for(const [name,gamma] of [['ExcellencePoster',.45],['BoardroomPoster',.7]])props.getObjectByName(name)?.traverse(o=>{
  if(!o.isMesh)return;
  for(const material of (Array.isArray(o.material)?o.material:[o.material])){
   if(!material.map||material.userData.portraitPrint)continue;
   material.userData.portraitPrint=true;material.emissiveIntensity=0;
   material.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',
    `#include <map_fragment>\n diffuseColor.rgb = pow(max(diffuseColor.rgb, vec3(0.0)), vec3(${gamma}));`);};
   material.customProgramCacheKey=()=> `field-print-${gamma}`;material.needsUpdate=true;
  }
 });
}
