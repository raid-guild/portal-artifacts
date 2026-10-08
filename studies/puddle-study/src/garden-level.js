import {groundAt,segmentBlockedBySolid} from './colliders.js';
import {gripAxis,gripKey} from './grip-ramp.js';
import {solidRay} from './editor-solid-physics.js';

const gatheringTerrain={type:'switchback',upperHeight:1.62,frontZ:-.6,
  startTier:{minX:5.35,maxX:9.4,minZ:-4.5,maxZ:-1,steps:[5.35,5.8].map(x=>({x,rise:.27,width:.32}))},
  stairs:{minX:-8.8,maxX:-6.2,endZ:2.1,
    steps:[-.6,-.15,.3,.75,1.2,1.65].map(z=>({z,drop:.27,width:.32}))}};
const gatheringRoof={type:'roof',minX:.1,maxX:.65,minZ:.7,maxZ:3.7,bottom:.32,top:1.06};
const gatheringPosts=()=>[3,4.035].flatMap(x=>Array.from({length:5},(_,i)=>
  ({type:'cylinder',x,z:.03+i*1.035,radius:.42,height:.65})));

// Shared by simulation, view and tests; decoration must follow these dimensions.
export const GARDEN={
  id:1,
  name:'Gathering Garden',start:{x:7,z:-2.6},seedCount:65,capacity:297,
  boundary:{type:'boundary',minX:-9,maxX:9,minZ:-4.8,maxZ:4.8},
  terrain:gatheringTerrain,
  roof:gatheringRoof,
  posts:gatheringPosts(),
  exit:{type:'funnel',x:7.6,z:2.8,radius:.95,bottomRadius:.36,depth:.9},
  pools:[[4.8,-2.6],[2.5,-2.6],[-5.5,2.2],[5.15,2.2]],
  gems:[{x:0,z:-2.6},{x:-3,z:2.2},{x:6,z:2.2}],
  gold:[[6,-2.6],[4.8,-2.6],[3.4,-2.6],[2,-2.6],[.5,-2.6],[-1.2,-2.6],[-3.5,-2.6],[-6,-2.6],
    [-7.5,.3],[-7.5,1.4],[-5.5,2.2],[-3.6,2.2],[-1.5,2.2],[1.1,2.2],[3.5,2.6175],[5.5,2.2],[7.1,2.2]],
};
export const WEIGHT_GARDEN={
  id:2,name:'Weight Garden',start:{x:7.6,z:-2.8},seedCount:65,capacity:297,
  boundary:{type:'boundary',minX:-9,maxX:9,minZ:-6,maxZ:4.8},
  terrain:{type:'depth-terraces',descendZ:1,frontHeight:2.16,middleHeight:1.08,frontZ:-1.3,rearZ:2,
    leftStairs:{minX:-8.8,maxX:-6.2,startZ:-1.3,endZ:.1,
      steps:[-1.3,-.95,-.6,-.25].map(z=>({z,drop:.27,width:.26}))},
    rightStairs:{minX:6.2,maxX:8.8,startZ:2,endZ:3.4,
      steps:[2,2.35,2.7,3.05].map(z=>({z,drop:.27,width:.26}))}},
  basin:{type:'funnel',x:-2.5,z:.35,radius:1.15,bottomRadius:.52,depth:.75,holdsFeedstock:true},
  gate:{x:1.5,width:.42,height:1.3,opening:.58,minZ:-.8,maxZ:1.5,threshold:48,releaseThreshold:36,rate:42,base:1.08},
  exit:{type:'funnel',x:-7.6,z:3.65,radius:.95,bottomRadius:.36,depth:.9},
  pools:[[5.3,-2.8],[2.6,-2.8],[-5.4,.35],[5.1,3.6]],
  gems:[{x:-1.5,z:-2.8},{x:4,z:.35},{x:-3.5,z:3.6}],
  gold:[[7.1,-2.8],[5.3,-2.8],[3.8,-2.8],[2.6,-2.8],[.5,-2.8],[-1.5,-2.8],[-3.7,-2.8],[-6,-2.8],
    [-7.5,-.95],[-7.5,-.25],[-5.4,.35],[-4.2,1.45],[.4,.35],[4,.35],
    [7.5,2.7],[5.1,3.6],[-3.5,3.6]],
};
export const PASSAGE_GARDEN={
  id:3,name:'Passage Garden',start:{x:7.6,z:-3.2},seedCount:65,capacity:297,
  boundary:{type:'boundary',minX:-9,maxX:9,minZ:-6,maxZ:4.8},
  terrain:{...WEIGHT_GARDEN.terrain},
  basin:{type:'funnel',x:-2.3,z:.45,radius:1.15,bottomRadius:.72,depth:.75,holdsFeedstock:true},
  gate:{x:1.7,width:.42,height:1.3,opening:.58,minZ:-.8,maxZ:1.5,threshold:64,releaseThreshold:48,rate:42,base:1.08},
  passage:{type:'roof',minX:-1.15,maxX:1.15,minZ:2.05,maxZ:4.8,bottom:.3,top:1.2,approachBothSides:true},
  exit:{type:'funnel',x:-7.6,z:3.65,radius:.95,bottomRadius:.36,depth:.9},
  pools:[[5.1,-3.2],[2.2,-3.2],[3.1,.45],[5.2,3.55]],
  poolCounts:[58,58,88,28],
  gems:[{x:-2,z:-3.2},{x:4.3,z:.45},{x:-4.3,z:3.55}],
  gold:[[6.7,-3.2],[5.1,-3.2],[3.6,-3.2],[2.2,-3.2],[.1,-3.2],[-2,-3.2],[-5.5,-3.2],
    [-7.5,-.95],[-7.5,-.25],[-5.2,.45],[-3.7,1.55],[.5,.45],[4.3,.45],
    [7.5,2.7],[5.2,3.55],[0,3.55],[-4.3,3.55]],
};
export const REACH_GARDEN={
  id:4,name:'Reach Garden',start:{x:7.6,z:-3.2},seedCount:65,capacity:297,tendrils:true,
  boundary:{...PASSAGE_GARDEN.boundary},terrain:{...PASSAGE_GARDEN.terrain},
  channels:[[-1.8,-4.8],[-2,-2.35],[2.7,-4.9]].map(([x,z])=>({type:'funnel',x,z,radius:.85,bottomRadius:.45,depth:.32})),
  castingBank:{x:.7,z:-3.65},
  exit:{type:'funnel',x:-7.6,z:3.65,radius:.95,bottomRadius:.36,depth:.9},
  pools:[[5.3,-3.2],[-1.8,-4.8],[-2,-2.35],[2.7,-4.9]],
  gems:[{x:-4.8,z:-3.5},{x:4.2,z:.45},{x:-3.8,z:3.55}],
  gold:[[6.7,-3.2],[5.3,-3.2],[3.6,-3.2],[.7,-3.65],[-1.8,-4.8],[-2,-2.35],[2.7,-4.9],
    [-4.8,-3.5],[-6,-3.5],[-7.5,-.95],[-7.5,-.25],[-5,.45],[0,.45],[4.2,.45],
    [7.5,2.7],[3.5,3.55],[-3.8,3.55]],
};
export const GRIP_GARDEN={
  id:5,name:'Grip Garden',start:{x:7.6,z:-3.2},seedCount:65,capacity:297,
  boundary:{...PASSAGE_GARDEN.boundary},terrain:{...PASSAGE_GARDEN.terrain,frontZ:-2.1,
    leftStairs:{...PASSAGE_GARDEN.terrain.leftStairs,
      startZ:PASSAGE_GARDEN.terrain.leftStairs.startZ-.8,endZ:PASSAGE_GARDEN.terrain.leftStairs.endZ-.8,
      steps:PASSAGE_GARDEN.terrain.leftStairs.steps.map(step=>({...step,z:step.z-.8}))}},
  grip:{
    ramp:{type:'grip-ramp',axis:'x',minX:-1.65,maxX:-.55,minZ:-1.35,maxZ:1.25,minHeight:1.08,maxHeight:1.44},
    platform:{type:'box',gripPlatform:true,minX:-.55,maxX:1.65,minZ:-1.95,maxZ:1.85,minY:1.08,maxY:3.78},
    climbHeight:2.34,
  },
  slip:{type:'slip',minX:3,maxX:5.4,minZ:-2.1,maxZ:2},
  exit:{type:'funnel',x:-7.6,z:3.65,radius:.95,bottomRadius:.36,depth:.9},
  pools:[[5.3,-3.2],[2.7,-3.2],[-4.8,.55],[5.2,3.55]],
  gems:[{x:-3.8,z:-3.2},{x:.55,z:-.05},{x:-3.8,z:3.55}],
  gold:[[6.7,-3.2],[5.3,-3.2],[3.8,-3.2],[2.7,-3.2],[-.5,-3.2],[-3.8,-3.2],[-6,-3.2],
    [-7.5,-.95],[-7.5,-.25],[-4.8,.55],[-1.4,-.05],[-.75,-.05],[.55,-.05],[4.2,1.15],
    [7.5,2.7],[5.2,3.55],[-3.8,3.55]],
};
export const GARDEN_LEVELS=[GARDEN,WEIGHT_GARDEN,PASSAGE_GARDEN,REACH_GARDEN,GRIP_GARDEN];
// Tendril casting is a basic garden action on every campaign floor and in
// custom editor gardens. A level's authored tendrils flag remains a layout
// feature (Reach channels), so enabling controls does not replace fixtures.
export const gardenCanCast=level=>!!level&&(!!level.editorCustom||GARDEN_LEVELS.some(g=>g.id===level.id)||!!level.tendrils);
export const looseGardenParticles=particles=>particles.filter(p=>p.feedstock&&p.patchId===undefined);
export function gardenFixtureHeight(level,x,z){
  if(level.csgSolid){const terrain=groundAt(x,z,gardenColliders(level)).height,
    hit=solidRay(level.csgSolid,{x,y:20,z},{x:0,y:-1,z:0},40);
    return Math.max(terrain,hit&&hit.normal?.y>.2?hit.y:terrain);}
  const grip=level.grip?.platform;
  let height=groundAt(x,z,gardenColliders(level)).height;
  if(grip&&x>grip.minX&&x<grip.maxX&&z>grip.minZ&&z<grip.maxZ)height=Math.max(height,grip.maxY);
  for(const box of level.editorFixtures||[])if(box.type==='box'&&box.walkableTop&&
    x>box.minX&&x<box.maxX&&z>box.minZ&&z<box.maxZ)height=Math.max(height,box.maxY);
  return height;
}
export function gardenColliders(level=GARDEN,opening=0){
  const extra=level.editorFixtures||[];
  const finish=items=>level.csgSolid?[...items.filter(c=>!c.csgManaged),level.csgSolid,
    ...(level.grip?[{...level.grip.ramp,type:'grip-ramp-control'},
      {...level.grip.platform,type:'grip-platform-control',csgControl:true}]:[])]:items;
  // The Gathering Garden's roof has two authored end supports. Editor play
  // enables tendrils without replacing that fixture set or its ordering.
  if(level.id===1)return finish([level.boundary,level.terrain,...(level.exit?[level.exit]:[]),
    ...(level.roof?[level.roof]:[]),
    ...(level.roofSupports??(level.roof?[level.roof.minZ-.14,level.roof.maxZ+.14].map(z=>
      ({type:'box',minX:0,maxX:.75,minY:0,maxY:1.06,minZ:z-.14,maxZ:z+.14})):[])),
    ...(level.posts||[]),...(level.channels||[]),...extra]);
  if(level.grip&&!level.gate)return finish([level.boundary,level.terrain,level.grip.ramp,level.grip.platform,
    ...(level.slip?[level.slip]:[]),...(level.channels||[]),...(level.exit?[level.exit]:[]),
    ...(level.roof?[level.roof]:[]),...(level.posts||[]),...extra]);
  if(level.tendrils&&!level.gate)return finish([level.boundary,level.terrain,...(level.channels||[]),...(level.exit?[level.exit]:[]),
    ...(level.basin?[level.basin]:[]),...(level.roof?[level.roof]:[]),...(level.posts||[]),...extra]);
  if(level.gate){const g=level.gate,half=g.width/2;
    return finish([level.boundary,level.terrain,...(level.basin?[level.basin]:[]),...(level.exit?[level.exit]:[]),
      {type:'roof',minX:g.x-half,maxX:g.x+half,minZ:g.minZ,maxZ:g.maxZ,bottom:g.base+opening,top:g.base+opening+g.height},
      {type:'box',minX:g.x-half,maxX:g.x+half,minY:g.base,maxY:g.base+g.height+g.opening,minZ:level.terrain.frontZ,maxZ:g.minZ},
      {type:'box',minX:g.x-half,maxX:g.x+half,minY:g.base,maxY:g.base+g.height+g.opening,minZ:g.maxZ,maxZ:level.terrain.rearZ},
      ...(level.passage&&!level.csgSolid?[level.passage,
        {type:'box',minX:level.passage.minX,maxX:level.passage.maxX,minY:0,maxY:level.passage.top,minZ:level.passage.minZ,maxZ:level.passage.minZ+.16},
        {type:'box',minX:level.passage.minX,maxX:level.passage.maxX,minY:0,maxY:level.passage.top,minZ:level.passage.maxZ-.16,maxZ:level.passage.maxZ}]:[]),
      ...(level.channels||[]),...(level.posts||[]),...extra]);
  }
  return finish([level.boundary,level.terrain,...(level.exit?[level.exit]:[]),
    ...(level.roof?[level.roof,...[level.roof.minZ-.14,level.roof.maxZ+.14].map(z=>({type:'box',minX:0,maxX:.75,minY:0,maxY:1.06,minZ:z-.14,maxZ:z+.14}))]:[]),
    ...(level.posts||[]),...(level.channels||[]),...extra]);
}
export function createGarden(level=GARDEN){
  const colliders=gardenColliders(level);
  return {phase:'title',elapsed:0,drainTime:0,moved:0,grew:false,contracted:false,enteredGap:false,under:false,
    levelId:level.id,arrivalTime:0,settleTime:0,
    gems:(level.gems||[]).map((g,id)=>({...g,id,y:gardenFixtureHeight(level,g.x,g.z)+.34,radius:.31,coverage:0,progress:0,collected:false})),
    gold:(level.gold||[]).map(([x,z],id)=>({x,z,id,y:gardenFixtureHeight(level,x,z)+.13,collected:false})),
    goldCount:0,gemCount:0,notice:'',noticeUntil:0};
}
export function seedGarden(fluid,level=GARDEN){
  const colliders=gardenColliders(level);
  for(const p of fluid.particles){p.y+=Math.max(groundAt(p.x,p.z,colliders).height,level.start.y??0);p.py=p.y;}
  (level.pools||[]).forEach(([x,z],patchId)=>{
    for(let i=0;i<(level.poolCounts?.[patchId]??58);i++){
      const a=i*2.39996323,r=.45*Math.sqrt((i%29)/28);
      const p=fluid.addParticle({x:x+Math.cos(a)*r,z:z+Math.sin(a)*r,
        y:gardenFixtureHeight(level,x,z)+fluid.radius+.015+Math.floor(i/29)*.12},{feedstock:true});
      p.patchId=patchId;
    }
  });
  fluid.samplePairs();fluid.updateComponents(colliders);
}
// A gem is an inclusion in the material. Test a shell around its faceted volume,
// not brain distance or a key press. Top coverage makes a flat pass insufficient.
export function gemSamples(g){
  const points=[];
  for(let i=0;i<8;i++){const a=i*Math.PI/4;points.push({x:g.x+Math.cos(a)*.3,y:g.y-.08,z:g.z+Math.sin(a)*.3});}
  for(let i=0;i<4;i++){const a=i*Math.PI/2+Math.PI/4;points.push({x:g.x+Math.cos(a)*.16,y:g.y+.19,z:g.z+Math.sin(a)*.16});}
  points.push({x:g.x,y:g.y+.31,z:g.z});return points;
}
export function gemCoverage(g,owned,colliders,radius){
  const near=owned.filter(p=>Math.hypot(p.x-g.x,p.z-g.z)<.8&&Math.abs(p.y-g.y)<.85);
  if(near.length<32)return 0;
  const reach=radius+.15,covered=gemSamples(g).map(q=>near.some(p=>
    Math.hypot(p.x-q.x,p.y-q.y,p.z-q.z)<reach&&!segmentBlockedBySolid(p,q,colliders)));
  // Require material around every side and above the tip, allowing one sparse sample.
  const count=covered.filter(Boolean).length;
  return covered.at(-1)?count/covered.length:Math.min(.8,count/covered.length);
}
export function updateGarden(sim,dt){
  const state=sim.garden,f=sim.fluid,b=f.brain,colliders=sim.activeColliders(),level=sim.gardenLevel||GARDEN;
  state.elapsed+=dt;
  if(state.phase==='arriving'){
    state.arrivalTime+=dt;
    if(state.arrivalTime>=1.1){state.phase='settling';state.settleTime=0;}
    return;
  }
  if(state.phase==='settling'){
    state.settleTime+=dt;
    if(state.settleTime>=.42)state.phase='playing';
    return;
  }
  if(state.phase==='draining'){
    state.drainTime+=dt;if(state.drainTime>=2.8)state.phase='complete';return;
  }
  if(state.phase!=='playing')return;
  state.moved=Math.max(state.moved,Math.hypot(b.x-level.start.x,b.z-level.start.z));
  state.grew ||= f.attachedCount>=110;
  state.contracted ||= !!f.contractAnchor;
  if(level.roof){
    state.enteredGap ||= b.x>level.roof.minX-.2&&b.x<level.roof.maxX+.2&&b.z>level.roof.minZ&&b.z<level.roof.maxZ&&b.y<level.roof.bottom;
    state.under ||= state.enteredGap&&b.x>level.roof.maxX+.3;
  }
  const owned=f.particles.filter((p,i)=>i!==f.brainIndex&&!p.feedstock&&p.component===b.component);
  for(const gold of state.gold){
    if(gold.collected)continue;
    if(owned.some(p=>Math.hypot(p.x-gold.x,p.y-gold.y,p.z-gold.z)<f.radius+.19&&
      !segmentBlockedBySolid(p,gold,colliders))){gold.collected=true;gold.collectedAt=state.elapsed;state.goldCount++;}
  }
  for(const gem of state.gems){
    if(gem.collected)continue;
    gem.coverage=gemCoverage(gem,owned,colliders,f.radius);
    gem.progress=Math.max(0,Math.min(1,gem.progress+dt*(gem.coverage>=12/13?1/.65:-1.3)));
    if(gem.progress>=1){gem.collected=true;gem.collectedAt=state.elapsed;state.gemCount++;state.notice='Gem absorbed';state.noticeUntil=state.elapsed+2;}
  }
  // Entering the inner bowl commits the exit; do not require an exact center
  // or a sunken brain, whose protective coating can otherwise bridge the throat.
  if(Math.hypot(b.x-level.exit.x,b.z-level.exit.z)<level.exit.radius*.7){
    state.phase='draining';state.drainTime=0;f.contractAnchor=null;sim.tendril.release();
  }
}
export function gardenHint(sim){
  const s=sim.garden,b=sim.brain,level=sim.gardenLevel||GARDEN;
  if(s.phase==='arriving'||s.phase==='settling')return ['FLOW DOWN','The living body pours through the opening above.'];
  if(s.phase==='draining')return ['DOWN THE DRAIN','Taking the soft way down.'];
  if(level.editorCustom)return ['EXPLORE YOUR GARDEN','Move through your authored fixtures, gather flesh, and flow into the exit.'];
  if(level.grip){
    const face=level.grip.platform,ramp=level.grip.ramp,slip=level.slip;
    if(s.moved<.8)return ['01 / GATHER YOURSELF','Flow left along the high rear lane, collecting flesh and gold before the stair turn.'];
    if(b.z<level.terrain.frontZ)return ['02 / LEFT STAIR TURN','Descend the left stairs and gather the middle green pool.'];
    if(b.x>Math.min(face.minX,ramp.minX)-.3&&b.x<Math.max(face.maxX,ramp.maxX)+.75&&
      b.z>Math.min(face.minZ,ramp.minZ)-.3&&
      b.z<Math.min(level.terrain.rearZ,Math.max(face.maxZ,ramp.maxZ)+.3)){
      if(sim.fluid.gripClimbing)return ['GRIPPING THE WALL',`Keep pressing ${gripKey(ramp,face,b)} toward the platform. Your connected flesh follows the ribbed face.`];
      if(gripAxis(ramp)==='x'){
        if(b.x<face.minX)return ['03 / FIND THE GRIP','Flow up the sage ramp and press D against the west ribbed face.'];
        if(b.x>face.maxX)return ['03 / FIND THE GRIP','Press A against the east ribbed face. Release to slide back down.'];
      }else{
        if(b.z>face.maxZ)return ['03 / FIND THE GRIP','Flow up the sage ramp and press W against the south ribbed face.'];
        if(b.z<face.minZ)return ['03 / FIND THE GRIP','Press S against the north ribbed face. Release to slide back down.'];
      }
      return ['SURROUND THE HIGH GEM','On the platform, gather your living flesh around the violet gem.'];
    }
    if(b.x>=slip.minX-.5&&b.x<=slip.maxX+.5&&b.z>=slip.minZ-.4&&b.z<=slip.maxZ+.4)
      return ['04 / SMOOTH STONE','This pale turquoise strip has little grip. Slow down early or let momentum carry you over the edge.'];
    if(b.z<level.terrain.rearZ)return ['05 / RIGHT STAIR TURN','Cross the middle terrace toward the right stairs, then descend to the low front lane.'];
    return ['THE WAY DOWN','Follow the low return left, gather the last flesh and gem, and enter the dark funnel.'];
  }
  if(level.id===4){
    const t=sim.tendril;
    if(t.feedback&&sim.fluid.time<t.feedbackUntil)return ['CAST STATUS',t.feedback];
    if(s.moved<.8)return ['01 / REACH THE BANK','Move left across the high rear lane. The green flesh in the shallow channels can be reached with tendrils.'];
    if(b.z<level.terrain.frontZ){
      if(t.recalling)return ['RECALLING FLESH',`${t.count} / 3 strands drawing loose flesh back. Tap Space to pause; hold to contract.`];
      if(t.count)return ['STRANDS EXTENDED',`${t.count} / 3 strands. Click a channel or press E to cast another; tap Space to recall all.`];
      return ['02 / REACH THE CHANNELS','Stand near the casting bank and click the loose flesh in a channel, or press E for the nearest. Tap Space to recall; hold to gather.'];
    }
    if(b.z<level.terrain.rearZ)return ['03 / MIDDLE TURN','Descend the left stairs, flow right across the middle terrace, and surround the second gem.'];
    return ['04 / FRONT RETURN','Descend the right stairs, follow the low front lane left, and enter the exit funnel.'];
  }
  if(level.gate){
    if(s.moved<.8)return ['01 / HIGH REAR LANE','Flow left across the high terrace. The garden descends toward you twice before the exit.'];
    if(!s.grew)return ['02 / GATHER FLESH','Gather the green pools along the high rear lane before the left stair turn.'];
    const gem=s.gems.filter(g=>!g.collected).sort((a,c)=>Math.hypot(a.x-b.x,a.z-b.z)-Math.hypot(c.x-b.x,c.z-b.z))[0];
    if(gem&&Math.hypot(gem.x-b.x,gem.z-b.z)<1.6)return ['SURROUND THE GEM',`Hold Space to rise around the gem. Covered ${Math.round(gem.coverage*100)}%.`];
    if(b.z<level.terrain.frontZ)return ['03 / LEFT STAIR TURN','Continue left, then descend the four shallow steps toward the middle terrace.'];
    if(!sim.pressure.active&&sim.pressure.weight<level.gate.threshold)return ['04 / LEAVE SOME WEIGHT',`Hold F at the middle basin rim. ${sim.pressure.weight} / ${level.gate.threshold} shed particles on the plate.`];
    if(b.x<level.gate.x)return ['05 / CROSS RIGHT','The deposit lifts the gate. Go around the basin, then flow right beneath the opening.'];
    if(level.passage&&b.x<4.2&&b.z<level.terrain.rearZ)return ['06 / GROW AGAIN','Gather the green pool beyond the gate, then surround the middle gem before the right stair turn.'];
    if(b.z<level.terrain.rearZ)return ['06 / FRONT STAIR TURN','Continue right to the second stair corridor and descend toward the front lane.'];
    if(level.passage&&b.x>level.passage.minX-.5&&b.z>level.passage.minZ-.4)
      return ['07 / THE LOW PASSAGE','Release Space and flow left through the low stone passage. Even a full body can flatten to pass.'];
    return ['THE WAY DOWN','Follow the low front lane left for the last flesh and gem, then enter the dark funnel.'];
  }
  if(s.moved<.8)return ['01 / FIND YOUR FEET','Move left down two short steps from the start platform, then follow the upper gold trail.'];
  if(s.goldCount<2)return ['02 / A LITTLE GOLD','Flow left over the gold. Your living flesh collects it by touch.'];
  if(!s.grew)return ['03 / GATHER YOURSELF','Touch the green pools on the upper lane. Their flesh becomes yours.'];
  const gem=s.gems.filter(g=>!g.collected).sort((a,c)=>Math.hypot(a.x-b.x,a.z-b.z)-Math.hypot(c.x-b.x,c.z-b.z))[0];
  if(gem&&Math.hypot(gem.x-b.x,gem.z-b.z)<1.6)return ['SURROUND THE GEM',
    `Move over the gem, then hold Space to gather into a mound. Surround it on every side. Covered ${Math.round(gem.coverage*100)}%.`];
  if(!s.gemCount)return ['04 / BECOME A MOUND','The first violet gem is ahead on the high lane. Move onto it and hold Space to rise around it.'];
  if(b.z<GARDEN.terrain.frontZ)return ['05 / REACH THE LEFT TURN','Continue left to the broad stair corridor. The open ledge offers a shortcut down, but leaves gold and flesh behind.'];
  if(b.x<GARDEN.terrain.stairs.maxX+.5&&b.z<GARDEN.terrain.stairs.endZ)return ['06 / DOWN THE STEPS','Turn toward the front and spill down six shallow ramps to the lower lane.'];
  if(!s.under&&b.x<GARDEN.roof.maxX+.3)return ['07 / TAKE A SOFTER SHAPE','Follow the lower gold trail right. Release Space to flatten beneath the low lintel.'];
  if(b.x<4)return ['08 / FOLLOW THE RETURN','Keep moving right along the lower lane. Gather flesh and surround the remaining gems.'];
  return ['THE WAY DOWN',s.gemCount===3&&s.goldCount===s.gold.length?
    'Everything gathered. Flow into the dark funnel to finish.':
    'Explore the lower terrace, then flow into the dark funnel. All three gems and every gold piece earn 100%.'];
}

export function drainPosition(p,time,level=GARDEN){
  const gather=Math.min(1,Math.max(0,time/1.45));
  const ease=gather*gather*(3-2*gather);
  // The presentation gathers above the opening before descending through it.
  const drop=Math.min(1,Math.max(0,(time-1.45)/1.35));
  return {...p,x:p.x+(level.exit.x-p.x)*ease,z:p.z+(level.exit.z-p.z)*ease,y:p.y-drop*2.8};
}

// Render-only arrival. The owned particles follow the same opening at
// staggered times; supplied flesh is deliberately never passed here.
export function arrivalPosition(p,index,time,level=GARDEN,coatIndices=[]){
  const duration=1.1,t=Math.min(1,Math.max(0,time/duration));
  const coat=index===0||coatIndices.includes(index);
  const delay=index===0?0:coat?.025+(index%13)*.004:.1+((index*37)%47)/47*.43;
  const u=Math.min(1,Math.max(0,(t-delay)/(1-delay))),ease=u*u*(3-2*u);
  const angle=index*2.39996323,neck=coat?.035:.075;
  const sourceZ=level.start.z;
  return {...p,x:level.start.x+Math.cos(angle)*neck+(p.x-level.start.x)*ease,
    z:sourceZ+Math.sin(angle)*neck+(p.z-sourceZ)*ease,
    y:p.y+(level.id>1?2.3:4.4)*(1-u)*(1-u)};
}
