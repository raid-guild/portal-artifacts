export function primaryControl({state,held=false,wellCount=0}) {
 if(state==='ready')return {label:'Start',action:'start',disabled:false};
 if(state==='paused')return {label:'Resume',action:'resume',disabled:false};
 if(state!=='running')return {label:'Start',action:null,disabled:true};
 if(held)return {label:'Release',action:'release',disabled:false};
 return {label:'Remove well',action:wellCount?'remove':null,disabled:!wellCount};
}
