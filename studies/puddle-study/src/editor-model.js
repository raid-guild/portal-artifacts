import {GARDEN_LEVELS,gardenColliders,gardenFixtureHeight} from './garden-level.js';
import {PuddleSimulation} from './simulation.js';
import {pointInsideSolid,groundAt} from './colliders.js';
import {gripAxis,gripLowHeight,gripHighHeight} from './grip-ramp.js';
export const clone=value=>JSON.parse(JSON.stringify(value));
export function preset(id){if(![2,3,4,5].includes(Number(id)))throw new Error('Choose a supported puzzle preset (2–5).');return clone(GARDEN_LEVELS[Number(id)-1]);}
export function objectRef(level,selection){
  if(!selection)return null;
  const {kind,index}=selection;
  if(kind==='pool')return level.pools[index];
  if(kind==='gem')return level.gems[index];
  if(kind==='gold')return level.gold[index];
  if(kind==='channel')return level.channels?.[index];
  if(kind==='grip')return level.grip?.platform;
  return level[kind];
}
export function position(level,selection){
  const o=objectRef(level,selection);if(!o)return null;
  if(Array.isArray(o))return {x:o[0],z:o[1]};
  if(selection.kind==='gate')return {x:o.x,z:(o.minZ+o.maxZ)/2};
  if('minX' in o)return {x:(o.minX+o.maxX)/2,z:(o.minZ+o.maxZ)/2};
  return {x:o.x,z:o.z};
}
export function moveObject(level,selection,x,z){
  const o=objectRef(level,selection),p=position(level,selection);if(!o||!p)return;
  if(Array.isArray(o)){o[0]=x;o[1]=z;return;}
  if(selection.kind==='gate'){const dz=z-p.z;o.x=x;o.minZ+=dz;o.maxZ+=dz;return;}
  if('minX' in o){const dx=x-p.x,dz=z-p.z;o.minX+=dx;o.maxX+=dx;o.minZ+=dz;o.maxZ+=dz;
    if(selection.kind==='grip'){const r=level.grip.ramp;r.minX+=dx;r.maxX+=dx;r.minZ+=dz;r.maxZ+=dz;}return;}
  o.x=x;o.z=z;
}
export function setTerrain(level,changes){
  Object.assign(level.terrain,changes);const t=level.terrain;
  for(const [stairs,start,drop] of [[t.leftStairs,t.frontZ,t.frontHeight-t.middleHeight],[t.rightStairs,t.rearZ,t.middleHeight]]){
    stairs.startZ=start;stairs.endZ=start+1.4;stairs.steps=Array.from({length:4},(_,i)=>({z:start+i*.35,drop:drop/4,width:.26}));
  }
  if(level.gate)level.gate.base=t.middleHeight;
  if(level.grip){const g=level.grip,rise=gripHighHeight(g.ramp)-gripLowHeight(g.ramp),wall=g.platform.maxY-gripHighHeight(g.ramp);
    if(gripAxis(g.ramp)==='x'){
      const rampWest=g.ramp.maxX<=g.platform.minX+.001;
      g.ramp.minHeight=t.middleHeight+(rampWest?0:rise);
      g.ramp.maxHeight=t.middleHeight+(rampWest?rise:0);
    }else{
      const rampSouth=g.ramp.minZ>=g.platform.maxZ-.001;
      g.ramp.northHeight=t.middleHeight+(rampSouth?rise:0);
      g.ramp.southHeight=t.middleHeight+(rampSouth?0:rise);
    }
    g.platform.minY=t.middleHeight;g.platform.maxY=t.middleHeight+rise+wall;}
}
export function validateLevel(l){
  const errors=[],warnings=[];
  try{
    if(!l||![2,3,4,5].includes(l.id))throw new Error('Unsupported puzzle preset.');
    if(typeof l.name!=='string'||!l.name.trim()||l.name.length>60)throw new Error('Give the garden a name (up to 60 characters).');
    const numeric=new Set(['x','z','minX','maxX','minZ','maxZ','minY','maxY','radius','bottomRadius','depth','width','height','opening','threshold','releaseThreshold','rate','base','bottom','top','frontHeight','middleHeight','frontZ','rearZ','descendZ','startZ','endZ','drop','northHeight','southHeight','minHeight','maxHeight','climbHeight','seedCount','capacity','id']);
    const visit=(o,depth=0)=>{if(depth>12)throw new Error('Level definition is too deeply nested.');if(typeof o==='number'&&(!Number.isFinite(o)||Math.abs(o)>1000))throw new Error('Coordinates and settings must be finite and within 1,000 units.');if(Array.isArray(o)&&o.length>300)throw new Error('Too many objects.');if(o&&typeof o==='object')for(const [key,value] of Object.entries(o)){if(numeric.has(key)&&!Number.isFinite(value))throw new Error('Numeric settings must be numbers.');visit(value,depth+1);}};visit(l);
    const t=l.terrain,b=l.boundary;
    if(t?.type!=='depth-terraces'||t.descendZ!==1||!b||b.minX!==-9||b.maxX!==9||b.minZ!==-6||b.maxZ!==4.8)throw new Error('Use the supported three-terrace board.');
    if(!(t.frontHeight>=1.5&&t.frontHeight<=3.5&&t.middleHeight>=.4&&t.middleHeight<=1.5&&t.frontHeight>t.middleHeight&&t.frontZ>=-2.6&&t.frontZ<=-.4&&t.rearZ>=1&&t.rearZ<=2.8))throw new Error('Terrace heights or dividers are outside the editor limits.');
    for(const [s,start,drop] of [[t.leftStairs,t.frontZ,t.frontHeight-t.middleHeight],[t.rightStairs,t.rearZ,t.middleHeight]]){
      if(!s||!(s.maxX-s.minX>=1.2&&s.maxX-s.minX<=3.5)||s.minX<-9||s.maxX>9||s.startZ!==start||Math.abs(s.endZ-start-1.4)>.001||s.steps?.length!==4)throw new Error('Stairs must stay on the board and have four continuous steps.');
      for(let i=0;i<4;i++){const step=s.steps[i];if(Math.abs(step.z-start-i*.35)>.001||Math.abs(step.drop-drop/4)>.001||step.width!==.26)throw new Error('Stair steps do not match the terrace heights.');}
    }
    if(!Number.isInteger(l.seedCount)||l.seedCount<17||l.seedCount>200||l.capacity!==297)throw new Error('Starting flesh must be 17–200; capacity stays at 297.');
    if(!Array.isArray(l.pools)||l.pools.length>12||!Array.isArray(l.gems)||l.gems.length>20||!Array.isArray(l.gold)||l.gold.length>100)throw new Error('Limit the board to 12 pools, 20 gems, and 100 gold pieces.');
    for(const pair of [...l.pools,...l.gold])if(!Array.isArray(pair)||pair.length!==2||pair.some(n=>!Number.isFinite(n)))throw new Error('Pool and gold coordinates must be pairs of numbers.');
    if(!Array.isArray(l.poolCounts)||l.poolCounts.length!==l.pools.length||l.poolCounts.some(n=>!Number.isInteger(n)||n<1||n>232))throw new Error('Each pool needs a whole-particle count from 1 to 232.');
    const total=l.seedCount+l.poolCounts.reduce((a,c)=>a+c,0);if(total>297)errors.push('Flesh budget exceeds 297. Reduce pool counts or starting flesh.');if(total<110)warnings.push('This little flesh may not surround a gem.');
    const inside=(p,margin=.15)=>p&&Number.isFinite(p.x)&&Number.isFinite(p.z)&&p.x>=b.minX+margin&&p.x<=b.maxX-margin&&p.z>=b.minZ+margin&&p.z<=b.maxZ-margin;
    if(!inside(l.start,.5)||l.start.z>t.frontZ-.35)errors.push('The start must be safely inside the highest rear terrace.');
    const funnels=[l.exit,...(l.channels||[]),...(l.basin?[l.basin]:[])];
    for(const f of funnels){if(!f||f.type!=='funnel'||!(f.radius>=.35&&f.radius<=1.6&&f.bottomRadius>=.15&&f.bottomRadius<f.radius&&f.depth>=.1&&f.depth<=1.2)||!inside(f,f.radius))throw new Error('Funnel sizes or placement are invalid.');const split=f===l.exit?t.rearZ:f===l.basin?null:t.frontZ;if(split!==null&&(f===l.exit?f.z-f.radius<=split:f.z+f.radius>=split))errors.push('A channel or exit crosses a terrace edge.');}
    for(let i=0;i<funnels.length;i++)for(let j=i+1;j<funnels.length;j++)if(Math.hypot(funnels[i].x-funnels[j].x,funnels[i].z-funnels[j].z)<funnels[i].radius+funnels[j].radius+.05)errors.push('Funnels overlap.');
    if(l.id===2||l.id===3){const g=l.gate;if(!g||!l.basin||l.tendrils||l.grip||g.base!==t.middleHeight||!(g.width>=.2&&g.width<=1&&g.height>=.5&&g.height<=2&&g.opening>=.3&&g.opening<=.9&&g.threshold>=1&&g.threshold<=200&&g.releaseThreshold>=0&&g.releaseThreshold<g.threshold&&g.rate>0)||g.x<-7||g.x>7||g.minZ<t.frontZ||g.maxZ>t.rearZ||g.minZ>=g.maxZ)throw new Error('Pressure gate settings are invalid.');if(l.basin.z-l.basin.radius<t.frontZ||l.basin.z+l.basin.radius>t.rearZ)errors.push('Keep the pressure basin inside the middle terrace.');if(g.threshold>total-17)warnings.push('There may not be enough spare flesh to open the gate.');}
    if(l.id===4){if(!l.tendrils||!Array.isArray(l.channels)||l.channels.length>6||!l.castingBank||l.gate||l.grip)throw new Error('Reach preset needs channels and a casting bank.');}
    const rect=(r)=>r&&Number.isFinite(r.minX)&&Number.isFinite(r.minZ)&&r.minX<r.maxX&&r.minZ<r.maxZ&&r.minX>=b.minX&&r.maxX<=b.maxX&&r.minZ>=b.minZ&&r.maxZ<=b.maxZ;
    if(l.id===3){if(!rect(l.passage)||l.passage.type!=='roof'||!(l.passage.bottom>=.18&&l.passage.bottom<=.8&&l.passage.top>l.passage.bottom)||l.passage.minZ<t.rearZ)throw new Error('Keep the low passage on the bottom terrace.');}
    if(l.id===5){const g=l.grip;if(!g||l.gate||l.tendrils||!rect(g.ramp)||!rect(g.platform)||!rect(l.slip)||g.ramp.type!=='grip-ramp'||g.platform.type!=='box'||!g.platform.gripPlatform||l.slip.type!=='slip')throw new Error('Grip preset needs a ramp, platform, and slippery strip.');if(g.ramp.minZ<t.frontZ||g.ramp.maxZ>t.rearZ||g.platform.minZ<t.frontZ||g.platform.maxZ>t.rearZ||l.slip.minZ<t.frontZ||l.slip.maxZ>t.rearZ)errors.push('Keep grip and slippery surfaces on the middle terrace.');
      let adjacent=false,low,high;
      if(gripAxis(g.ramp)==='x'){
        const west=Math.abs(g.ramp.maxX-g.platform.minX)<.001,east=Math.abs(g.ramp.minX-g.platform.maxX)<.001;
        adjacent=(west||east)&&g.ramp.maxZ>g.platform.minZ&&g.ramp.minZ<g.platform.maxZ;
        low=west?g.ramp.minHeight:g.ramp.maxHeight;high=west?g.ramp.maxHeight:g.ramp.minHeight;
      }else{
        const south=Math.abs(g.ramp.minZ-g.platform.maxZ)<.001,north=Math.abs(g.ramp.maxZ-g.platform.minZ)<.001;
        adjacent=(south||north)&&g.ramp.maxX>g.platform.minX&&g.ramp.minX<g.platform.maxX;
        low=south?g.ramp.southHeight:g.ramp.northHeight;high=south?g.ramp.northHeight:g.ramp.southHeight;
      }
      if(!adjacent||low!==t.middleHeight||g.platform.minY!==t.middleHeight||!(high>low&&g.platform.maxY>high&&g.platform.maxY<=t.middleHeight+3))errors.push('The ramp must meet the platform below its top, with the platform no more than 3 units above the middle terrace.');}
    const colliders=gardenColliders(l);
    for(const [kind,points] of [['Pool',l.pools.map(([x,z])=>({x,z}))],['Gem',l.gems],['Gold',l.gold.map(([x,z])=>({x,z}))]])for(const p of points){if(!inside(p,kind==='Pool'?.5:.15))errors.push(kind+' is outside the board.');else if(pointInsideSolid(p.x,(kind==='Pool'?groundAt(p.x,p.z,colliders).height:gardenFixtureHeight(l,p.x,p.z))+.15,p.z,colliders,.01))errors.push(kind+' is inside an obstacle.');}
    if(funnels.some(f=>Math.hypot(l.start.x-f.x,l.start.z-f.z)<f.radius+.4))errors.push('The start is too close to a funnel.');
    if(l.gems.length!==3)warnings.push('This garden has '+l.gems.length+' gems; the campaign convention is three.');
    if(l.gold.length===0)warnings.push('No gold trail is placed.');
    if(l.tendrils&&l.channels.some(c=>Math.hypot(c.x-l.castingBank.x,c.z-l.castingBank.z)>4.5))warnings.push('A channel is far from the casting bank. Play-test its reach.');
    if(groundAt(l.start.x,l.start.z,colliders).height!==t.frontHeight)errors.push('The starting point is not on the high terrace.');
  }catch(e){errors.push(e.message);}
  return {errors:[...new Set(errors)],warnings:[...new Set(warnings)]};
}
export function normalizePreset(id){const l=preset(id);l.poolCounts=l.pools.map((_,i)=>l.poolCounts?.[i]??58);return l;}
export function exportLevel(level){return JSON.stringify({format:'puddle-level',version:1,level},null,2);}
export function importLevel(text){if(text.length>150000)throw new Error('Level file is too large.');const data=JSON.parse(text);if(data.format!=='puddle-level'||data.version!==1)throw new Error('Use a version 1 Puddle level file.');const result=validateLevel(data.level);if(result.errors.length)throw new Error(result.errors.join(' '));return clone(data.level);}
export class EditorSimulation extends PuddleSimulation{
  constructor(level){super();this.editorLevel=clone(level);this.startGarden(level.id,{practice:true});}
  get gardenLevel(){return this.editorLevel||super.gardenLevel;}
  continueGarden(){return false;}
}
export class History{
  constructor(level){this.states=[clone(level)];this.index=0;}
  commit(level){const next=clone(level);if(JSON.stringify(next)===JSON.stringify(this.states[this.index]))return;this.states=this.states.slice(0,this.index+1);this.states.push(next);if(this.states.length>60)this.states.shift();this.index=this.states.length-1;}
  undo(){if(this.index>0)this.index--;return clone(this.states[this.index]);}
  redo(){if(this.index<this.states.length-1)this.index++;return clone(this.states[this.index]);}
}
