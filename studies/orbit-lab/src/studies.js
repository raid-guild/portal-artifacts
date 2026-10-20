import { guideProfile } from './guide.js';
// Single-rule experiments share the same room and steering controls.
const definitions = [
 ['release','Release the pull','Remove the oldest well','Catch a curve, then tap Remove well to fly along its tangent.','Where does letting go send you?'],
 ['boost','A directed impulse','Slingshot gate','Cross the cyan ring for a fast launch to the right.','Can one impulse replace a long pull?'],
 ['sticky','A moment of stillness','Capture and release','The amber spot catches you. Tap Release to leave in your incoming direction.','What changes when you can wait?'],
 ['eclipse','The disappearing light','Eclipse','The dark body catches you and slowly covers your light. Release when ready.','Can sound carry you through darkness?'],
 ['power','Gathering light','Light pickup','Begin dim. Collect the three pale lights to brighten your glow.','Does a brighter world change your route?'],
 ['dimmer','Losing light','Light drain','Pass through the three violet motes to dim your glow.','How little light can you navigate by?'],
 ['guide','Follow the bend','Guiding walls','A continuous curved wall guides your slide. Place gravity on its far side.','Can a wall become a track?'],
 ['giant','A heavy neighbor','Large danger body','The orange body pulls gently. Its visible surface is fatal.','How close is a useful pass?'],
 ['chaser','Something follows','Pursuit','A small orange body follows slowly. Draw it away with your wells.','Can a detour become an escape?'],
 ['clock','Wait for an opening','Fixed danger orbit','Orange bodies follow a fixed orbit, unaffected by your wells.','When is the passage safe?'],
 ['sound','Crossing a phrase','Sound gates','Cross cyan for bass, violet for offbeat, and gold for chimes. Each adds a repeating part.','Can your route become an instrument?'],
 ['hidden','Light reveals danger','Hidden body','A dark body behind the wall appears near your light. It vanishes completely outside direct light.','What can you discover before you touch it?'],
 ['portals','Elsewhere, still moving','Paired portals','The two teal rings connect. Speed is preserved; the exit turns your flight upward.','Can you steer through a change of space?'],
];
export function singleRuleStudies(makeLevel) {
 return definitions.map(([id,name,rule,description,question],i)=>({id,title:`${String(i+7).padStart(2,'0')} / ${name}`,rule,description,question,objective:description,color:['#76e9e3','#ffd98b','#bfa5ff'][i%3],heroGravity:0,moons:[], mechanic:id,
 level:{...makeLevel(id==='guide'?{x:-6,y:-2,vx:2.5,vy:-.5}:{x:-11,y:0,vx:2.5,vy:0},{x:12,y:5},id==='hidden'?[{x:-3,y:-3,w:.55,h:8}]:[]),guides:id==='guide'?[guideProfile()]:[]}}));
}
export function rotateVelocity(v,angle) {return {x:v.x*Math.cos(angle)-v.y*Math.sin(angle),y:v.x*Math.sin(angle)+v.y*Math.cos(angle)};}
export function segmentDistance(a,b,p) {const dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy||1)));return Math.hypot(a.x+t*dx-p.x,a.y+t*dy-p.y);}
