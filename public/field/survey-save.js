export const SAVE_KEY='field.survey.v1';
export function validCheckpoint(value){
 if(!value||value.version!==1||![1,-1].includes(value.floor))return null;
 const integer=(n,min,max)=>Number.isInteger(n)&&n>=min&&n<=max;
 if(!integer(value.seed,0,4294967295)||!integer(value.index,-9999,9999)||!integer(value.minVisited,-9999,value.index)||!integer(value.maxVisited,value.index,9999))return null;
 return{version:1,seed:value.seed,floor:value.floor,index:value.index,minVisited:value.minVisited,maxVisited:value.maxVisited,flashlight:value.flashlight!==false,complete:value.complete===true};
}
export function readCheckpoint(storage){try{storage??=globalThis.localStorage;const raw=storage?.getItem(SAVE_KEY);return raw?validCheckpoint(JSON.parse(raw)):null;}catch{return null;}}
export function writeCheckpoint(value,storage){try{const clean=validCheckpoint(value);if(!clean)return false;storage??=globalThis.localStorage;if(!storage)return false;storage.setItem(SAVE_KEY,JSON.stringify(clean));return true;}catch{return false;}}
