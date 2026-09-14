import assert from 'node:assert/strict';
import {readCheckpoint,writeCheckpoint,SAVE_KEY} from '../dist/survey-save.js';
import {MazeTopology} from '../dist/maze-core.js';
let raw=null;const storage={getItem:k=>(assert.equal(k,SAVE_KEY),raw),setItem:(k,v)=>{assert.equal(k,SAVE_KEY);raw=v;}};
assert.equal(readCheckpoint(storage),null);
for(const floor of [1,-1])for(let index=-4;index<=14;index++){
 const checkpoint={version:1,seed:88212,floor,index,minVisited:Math.min(0,index),maxVisited:Math.max(13,index),flashlight:false,complete:index===13&&floor===-1};
 assert.ok(writeCheckpoint(checkpoint,storage));assert.deepEqual(readCheckpoint(storage),checkpoint);
 const m=new MazeTopology(checkpoint.seed,{x:0,z:0},floor);m.ensure(index);assert.ok(m.canWalk(0,m.worldZ(index)+5.2),'Safe entrance on all checkpoint room types');
}
for(const value of ['{broken','null','{}',JSON.stringify({version:99}),JSON.stringify({...readCheckpoint(storage),floor:-2}),JSON.stringify({...readCheckpoint(storage),index:Infinity})]){raw=value;assert.equal(readCheckpoint(storage),null);}
const blocked={getItem(){throw Error('blocked')},setItem(){throw Error('quota')}};assert.equal(readCheckpoint(blocked),null);assert.equal(writeCheckpoint({version:1,seed:5,floor:-1,index:4,minVisited:0,maxVisited:8},blocked),false);
console.log('PASS: both floors, checkpoint round trip, safe resume entrances, malformed/versioned data and unavailable storage.');
