import { CHANNEL, channelY } from './guide.js';
// Single-rule experiments share the same room and steering controls.
const definitions = [
 ['release','Release the pull','Remove the oldest well','Catch a curve, then tap Remove well to fly along its tangent.','Where does letting go send you?'],
 ['boost','A directed impulse','Slingshot gate','Cross the cyan ring for a fast launch to the right.','Can one impulse replace a long pull?'],
 ['sticky','A moment of stillness','Capture and release','The amber spot catches you. Tap Release to leave in your incoming direction.','What changes when you can wait?'],
 ['eclipse','The disappearing light','Eclipse','The dark body catches you and slowly covers your light. Release when ready.','Can sound carry you through darkness?'],
 ['power','Gathering light','Light pickup','Begin dim. Collect the three pale lights to brighten your glow.','Does a brighter world change your route?'],
 ['dimmer','Losing light','Light drain','Pass through the three violet motes to dim your glow.','How little light can you navigate by?'],
 ['guide','Follow the bend','Guiding walls','Place wells beyond the black walls. Their pull guides the dot through the S-channel.','Can a wall become a track?'],
 ['giant','A heavy neighbor','Large danger body','The orange body pulls gently. Its visible surface is fatal.','How close is a useful pass?'],
 ['chaser','Something follows','Pursuit','A small orange body follows slowly. Draw it away with your wells.','Can a detour become an escape?'],
 ['clock','Wait for an opening','Fixed danger orbit','Orange bodies follow a fixed orbit, unaffected by your wells.','When is the passage safe?'],
 ['sound','Crossing the gates','Sound gates','Cross cyan for bass, violet for offbeat, and gold for chimes. Each adds a repeating part.','Can your route become an instrument?'],
 ['hidden','Light reveals danger','Hidden body','A dark body behind the wall appears near your light. It vanishes completely outside direct light.','What can you discover before you touch it?'],
 ['portals','Elsewhere, still moving','Paired portals','The two teal rings connect. Speed is preserved; the exit turns your flight upward.','Can you steer through a change of space?'],
 ['shadow-posts','A forest of shadows','Moving light and posts','Thread the posts and watch their shadows sweep across one another.','What can a moving shadow reveal?'],
 ['filters','Through colored glass','Color transmission','Move around the colored panes. Light passing through them changes color.','Can a surface paint the space beyond it?'],
 ['lens','Gathering rays','A focusing lens','Move the light around the lens. Follow the beam into its focus and out again.','Where does light become concentrated?'],
 ['prism','A spectrum unfolds','A dispersing prism','Move the light around the prism to turn a pale beam into a rainbow fan.','Can color describe the direction of light?'],
];
export function singleRuleStudies(makeLevel) {
 return definitions.map(([id,name,rule,description,question],i)=>({id,title:`${String(i+7).padStart(2,'0')} / ${name}`,rule,description,question,objective:description,color:['#76e9e3','#ffd98b','#bfa5ff'][i%3],heroGravity:0,moons:[], mechanic:id,
 level:{...makeLevel(id==='guide'?{x:-13,y:channelY(-13),vx:2.5,vy:0}:{x:-11,y:0,vx:2.5,vy:0},id==='guide'?{x:13,y:channelY(13)}:{x:12,y:5},id==='shadow-posts'?Array.from({length:15},(_,j)=>({x:-5+(j%5)*2.5,y:-4+Math.floor(j/5)*4+(j%2)*.6,w:.38,h:1.1})):id==='hidden'?[{x:-3,y:-3,w:.55,h:8}]:[]),channel:id==='guide'?{...CHANNEL}:null,guides:[]}}));
}
export function rotateVelocity(v,angle) {return {x:v.x*Math.cos(angle)-v.y*Math.sin(angle),y:v.x*Math.sin(angle)+v.y*Math.cos(angle)};}
export function segmentDistance(a,b,p) {const dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy||1)));return Math.hypot(a.x+t*dx-p.x,a.y+t*dy-p.y);}
