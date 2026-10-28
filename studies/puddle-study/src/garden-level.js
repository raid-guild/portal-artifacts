import {groundAt,segmentBlockedBySolid} from './colliders.js';
import {CAMPAIGN_TARGETS} from './game-score.js';
import {gripAxis,gripKey} from './grip-ramp.js';
import {solidRay} from './editor-solid-physics.js';
import {tabletSeen,tabletCoverage,openTablet} from './memory-tablets.js';

const gatheringTerrain={type:'switchback',upperHeight:1.62,frontZ:-.6,
  startTier:{minX:5.35,maxX:9.4,minZ:-4.5,maxZ:-1,steps:[5.35,5.8].map(x=>({x,rise:.27,width:.32}))},
  stairs:{minX:-8.8,maxX:-6.2,endZ:2.1,
    steps:[-.6,-.15,.3,.75,1.2,1.65].map(z=>({z,drop:.27,width:.32}))}};
const gatheringRoof={type:'roof',minX:.35,maxX:1,minZ:-4.1,maxZ:-1.2,bottom:1.94,top:2.7};
const nurseryBox=(id,minX,maxX,minZ,maxZ,minY,maxY)=>({type:'box',sourceId:id,walkableTop:true,minX,maxX,minZ,maxZ,minY,maxY});
const nurseryRamp=(id,minX,maxX,minZ,maxZ,reverse)=>({type:'editor-stairs',sourceId:id,axis:'x',reverse,
  steps:8,minX,maxX,minZ,maxZ,base:0,rise:.7});
// A loom bank is a pair of solid ribs with one body-width opening between them.
// Staggering the openings makes the flesh follow the core through each turn.
const loomBank=(id,x,slotZ,minZ,maxZ,minY,maxY,slotWidth=1)=>{
  const half=slotWidth/2;
  return [nurseryBox(`${id}-north`,x-.18,x+.18,minZ,slotZ-half,minY,maxY),
    nurseryBox(`${id}-south`,x-.18,x+.18,slotZ+half,maxZ,minY,maxY)];
};
const gatheringFixtures=[
  nurseryBox('arcade-end-north',.3,1.05,-4.3,-4.1,0,2.7),
  nurseryBox('arcade-end-south',.3,1.05,-1.2,-1.0,0,2.7),
  nurseryBox('arcade-garden-divider',1.05,2.25,-1.2,-1.02,1.62,2.15),
  nurseryRamp('nursery-west-rise',-6.5,-4.6,.55,2.05,false),
  nurseryBox('nursery-skywalk',-4.6,-.15,.7,1.9,.32,.7),
  nurseryBox('nursery-gem-landing',-1.1,2.5,-.2,2.7,0,.7),
  nurseryBox('nursery-east-walk',2.15,3.65,.7,1.9,.32,.7),
  nurseryRamp('nursery-east-fall',3.65,5.45,.55,2.05,true),
];

// Shared by simulation, view and tests; decoration must follow these dimensions.
export const GARDEN={
  id:1,
  name:'Hanging Nursery',contentRevision:'hanging-nursery-1',start:{x:7,z:-2.6},seedCount:65,capacity:297,
  boundary:{type:'boundary',minX:-9,maxX:9,minZ:-4.8,maxZ:4.8},
  terrain:gatheringTerrain,
  roof:gatheringRoof,
  roofSupports:[],editorFixtures:gatheringFixtures,
  channels:[{type:'funnel',x:7,z:-2.6,radius:.85,bottomRadius:.6,depth:.1},
    {type:'funnel',x:-1.7,z:-2.7,radius:1,bottomRadius:.65,depth:.1}],
  exit:{type:'funnel',x:7.6,z:2.8,radius:.95,bottomRadius:.36,depth:.9},
  pools:[[4.8,-2.6],[2.5,-3.2],[-5.8,2.5],[4.8,3.5]],
  gems:[{x:-1.7,z:-2.7},{x:.8,z:1.25,base:.7},{x:5.6,z:2.6}],
  gold:[[6,-2.6],[4.8,-2.6],[3.4,-3.15],[2,-2.7],[.3,-2.7],[-1.7,-2.7],[-4.1,-2.7],[-6.1,-2.7],
    [-7.5,.25],[-7.5,1.55],[-5.8,2.5],[-4.3,1.3,.7],[-2.4,1.3,.7],[.8,1.3,.7],[2.6,1.3,.7],
    [4.8,3.5],[6.8,3.2]],
  tablets:[
    {id:'nursery-gather',x:6.15,z:-2.6,base:2.16,category:'tutorial',title:'Gather the living pools',
      text:'Small pools become part of you. Follow the planting pockets and let them join your body.',hint:'move'},
    {id:'nursery-squeeze',x:2.15,z:-2.7,base:1.62,category:'tutorial',title:'The nursery arcade',
      text:'A loose body can spread beneath the old nursery arch. Release Contract as you pass through.',hint:'move'},
    {id:'nursery-gem',x:-.55,z:-2.7,base:1.62,category:'tutorial',title:'Surround a gem',
      text:'Flow a little past the violet stone, then gather your body around it until it is enclosed.',hint:'contract'},
    {id:'nursery-branch',x:-6.7,z:2.35,base:0,category:'tutorial',title:'A path above the court',
      text:'The narrow crossing holds another violet stone. If you fall, the lower garden will catch you.',hint:'move'},
    {id:'nursery-drain',x:6.6,z:3.85,base:0,category:'story',title:'The way down',
      text:'Water once fed these hanging gardens. Its old drain leads to the chambers below.',hint:'none'},
  ],
};
export const WEIGHT_GARDEN={
  id:2,name:'Counterweight Cistern',contentRevision:'counterweight-cistern-1',start:{x:7.6,z:-2.8},seedCount:65,capacity:297,
  boundary:{type:'boundary',minX:-9,maxX:9,minZ:-6,maxZ:4.8},
  terrain:{type:'depth-terraces',descendZ:1,frontHeight:2.16,middleHeight:1.08,frontZ:-1.3,rearZ:2,
    leftStairs:{minX:-8.8,maxX:-6.2,startZ:-1.3,endZ:.1,
      steps:[-1.3,-.95,-.6,-.25].map(z=>({z,drop:.27,width:.26}))},
    rightStairs:{minX:6.2,maxX:8.8,startZ:2,endZ:3.4,
      steps:[2,2.35,2.7,3.05].map(z=>({z,drop:.27,width:.26}))}},
  basin:{type:'funnel',x:-2.5,z:.35,radius:1.15,bottomRadius:.52,depth:.75,holdsFeedstock:true},
  gate:{x:1.5,width:.42,height:1.3,opening:.58,minZ:-.8,maxZ:1.5,threshold:48,releaseThreshold:36,rate:42,base:1.08},
  channels:[{type:'funnel',x:5.3,z:-3.3,radius:.9,bottomRadius:.6,depth:.12},
    {type:'funnel',x:2.6,z:-2.4,radius:.9,bottomRadius:.6,depth:.12}],
  editorFixtures:[
    nurseryBox('cistern-filter-east',2.7,3.1,2,3.15,0,.7),
    nurseryBox('cistern-filter-west',.1,.5,3.65,4.8,0,.7),
    nurseryBox('cistern-gallery-edge',-5.2,-3.2,-5.78,-5.63,2.16,2.46),
    nurseryBox('cistern-drain-court',-8.82,-8.68,2.95,4.65,0,.27),
  ],
  exit:{type:'funnel',x:-7.6,z:3.65,radius:.95,bottomRadius:.36,depth:.9},
  pools:[[5.3,-3.3],[2.6,-2.4],[-5.4,.35],[5.1,3.6]],
  gems:[{x:-1.5,z:-2.8},{x:4,z:.35},{x:-3.5,z:3.6}],
  gold:[[7.1,-2.8],[5.3,-3.3],[3.8,-2.8],[2.6,-2.4],[-1.5,-2.8],[-3.7,-2.8],[-6,-2.8],
    [-7.5,-.95],[-7.5,-.25],[-5.4,.35],[-4.2,1.45],[.4,.35],[4,.35],
    [7.5,2.7],[5.1,3.6],[1.8,3.45],[-3.5,3.6]],
  tablets:[
    {id:'cistern-arrival',x:6.6,z:-2.8,base:2.16,category:'story',title:'Water has weight',
      text:'The nursery water reaches this old cistern. Its shutter answers to the weight left in the basin below.',hint:'none'},
    {id:'cistern-basin',x:-4.5,z:.4,base:1.08,category:'tutorial',title:'Leave a counterweight',
      text:'Gather the green pool, then hold Shed at the basin rim. Forty-eight loose pieces raise the shutter.',hint:'shed'},
    {id:'cistern-shutter',x:.15,z:.35,base:1.08,category:'tutorial',title:'Keep the shutter raised',
      text:'Leave the deposit behind as you pass. Taking its weight back will close the shutter.',hint:'move'},
    {id:'cistern-filters',x:5.5,z:3.6,base:0,category:'story',title:'The winding filters',
      text:'The lower court once strained silt from the water. Gather what remains and wind between its stone ribs to the drain.',hint:'none'},
  ],
};
export const PASSAGE_GARDEN={
  id:3,name:'The Silt Loom',contentRevision:'silt-loom-2',start:{x:7.6,z:-3.2},seedCount:65,capacity:297,
  boundary:{type:'boundary',minX:-9,maxX:9,minZ:-6,maxZ:4.8},
  terrain:{...WEIGHT_GARDEN.terrain},
  basin:{type:'funnel',x:-2.3,z:.45,radius:1.15,bottomRadius:.72,depth:.75,holdsFeedstock:true},
  gate:{x:1.7,width:.42,height:1.3,opening:.58,minZ:-.8,maxZ:1.5,threshold:64,releaseThreshold:48,rate:42,base:1.08},
  passage:{type:'roof',minX:-1.15,maxX:1.15,minZ:2.05,maxZ:4.8,bottom:.3,top:1.2,approachBothSides:true},
  editorFixtures:[
    ...loomBank('loom-upper-east-1',4.2,-2.6,-6,-1.3,2.16,3.2,1.1),
    ...loomBank('loom-upper-east-2',3,-3.1,-6,-1.3,2.16,3.2,1.1),
    ...loomBank('loom-upper-east-3',1.8,-2.6,-6,-1.3,2.16,3.2,1.1),
    ...loomBank('loom-upper-west-1',-4.3,-3.35,-6,-1.3,2.16,3.2),
    ...loomBank('loom-upper-west-2',-5.5,-2.85,-6,-1.3,2.16,3.2),
    ...loomBank('loom-middle-west-1',-5.5,.4,-1.3,2,1.08,2.2),
    ...loomBank('loom-middle-west-2',-4.3,.9,-1.3,2,1.08,2.2),
    ...loomBank('loom-middle-east',5.7,1.1,-1.3,2,1.08,2.2),
    ...loomBank('loom-lower-east-1',4.2,3.7,2,4.8,0,1.15),
    ...loomBank('loom-lower-east-2',3,3.2,2,4.8,0,1.15),
    ...loomBank('loom-lower-east-3',1.8,3.7,2,4.8,0,1.15),
    ...loomBank('loom-lower-west-1',-2.2,3.05,2,4.8,0,1.15),
    ...loomBank('loom-lower-west-2',-3.4,3.55,2,4.8,0,1.15),
  ],
  exit:{type:'funnel',x:-7.6,z:3.65,radius:.95,bottomRadius:.36,depth:.9},
  pools:[[5.1,-2.35],[.7,-2.65],[3.1,.45],[5.2,3.85]],
  poolCounts:[58,58,88,28],
  gems:[{x:-1.6,z:-3.2},{x:4.3,z:.45},{x:-4.3,z:3.55}],
  gold:[[6.7,-3.2],[5.1,-2.35],[3.6,-2.6],[2.4,-3.1],[-1.6,-3.2],[-4.9,-3.35],
    [-7.5,-.95],[-7.5,-.25],[-5,.4],[-3.7,.9],[.5,.45],[4.3,.45],
    [7.5,1.2],[5.2,3.85],[3.1,3.2],[0,3.4],[-4.3,3.55]],
  tablets:[
    {id:'silt-arrival',x:6.7,z:-3.2,base:2.16,category:'story',title:'The silt loom',
      text:'Water from the cistern once ran through these stone ribs. They caught the silt before it reached the lower gardens.',hint:'none'},
    {id:'silt-turn',x:5.25,z:-2.6,base:2.16,category:'tutorial',title:'Flow through the ribs',
      text:'Release Contract and steer through the narrow openings. Keep moving until your flesh follows, then gather again in the open court.',hint:'move'},
    {id:'silt-weight',x:-6.4,z:.55,base:1.08,category:'tutorial',title:'Leave weight in the bowl',
      text:'Hold Shed at the basin rim. Sixty-four loose pieces keep the shutter raised while you move on.',hint:'shed'},
    {id:'silt-regather',x:2.7,z:.45,base:1.08,category:'tutorial',title:'Bring the rest with you',
      text:'Once you are clear of the shutter, you can cast back toward the bowl and recall the flesh you left behind. Gather any remaining green flesh before enclosing the violet stone.',hint:'cast'},
    {id:'silt-filter',x:5.5,z:3.7,base:0,category:'tutorial',title:'The covered filter',
      text:'Follow the narrow openings through the lower ribs. Release Contract to spread beneath the covered filter; the drain lies beyond.',hint:'move'},
  ],
};
export const REACH_GARDEN={
  id:4,name:'The Threadworks',contentRevision:'threadworks-1',start:{x:7.6,z:-3.2},seedCount:65,capacity:297,tendrils:true,
  boundary:{...PASSAGE_GARDEN.boundary},terrain:{...PASSAGE_GARDEN.terrain},
  channels:[[-1.8,-4.8],[-2,-2.35],[2.7,-4.9]].map(([x,z])=>({type:'funnel',x,z,radius:.85,bottomRadius:.45,depth:.32})),
  castingBank:{x:.7,z:-3.65},
  editorFixtures:[
    nurseryBox('thread-entrance-north',3.82,4.18,-6,-3.75,2.16,3.25),
    nurseryBox('thread-entrance-south',3.82,4.18,-2.65,-1.3,2.16,3.25),
    nurseryBox('thread-exit-north',-4.28,-3.92,-6,-4.10,2.16,3.25),
    nurseryBox('thread-exit-south',-4.28,-3.92,-3,-1.3,2.16,3.25),
    {type:'editor-stairs',sourceId:'thread-west-rise',axis:'x',reverse:false,steps:8,
      minX:-6,maxX:-4,minZ:-.45,maxZ:1.25,base:1.08,rise:.68},
    nurseryBox('thread-shuttle',-4,2.5,-.45,1.25,1.40,1.76),
    nurseryBox('thread-pinch-west-north',-2.9,-2.55,-.45,-.225,1.76,2.35),
    nurseryBox('thread-pinch-west-south',-2.9,-2.55,1.025,1.25,1.76,2.35),
    nurseryBox('thread-pinch-east-north',-.9,-.55,-.45,-.225,1.76,2.35),
    nurseryBox('thread-pinch-east-south',-.9,-.55,1.025,1.25,1.76,2.35),
    nurseryBox('thread-landing',2.5,5.6,-1.2,1.9,1.08,1.76),
    {type:'editor-stairs',sourceId:'thread-east-fall',axis:'x',reverse:true,steps:8,
      minX:5.6,maxX:7.5,minZ:-.45,maxZ:1.25,base:1.08,rise:.68},
    {type:'roof',sourceId:'thread-ground-squeeze',minX:-1.8,maxX:-.7,
      minZ:1.05,maxZ:2,bottom:1.40,top:2.10,approachBothSides:true},
    nurseryBox('thread-lower-east-north',5.22,5.58,2,3.45,0,1.15),
    nurseryBox('thread-lower-mid-north',1.42,1.78,2,3.05,0,1.15),
    nurseryBox('thread-lower-east-south',3.32,3.68,3.35,4.8,0,1.15),
    nurseryBox('thread-lower-west-south',-.48,-.12,3.65,4.8,0,1.15),
    {type:'roof',sourceId:'thread-lower-lintel',minX:1.78,maxX:2.78,
      minZ:3.0,maxZ:4.65,bottom:.32,top:1.15,approachBothSides:true},
    nurseryBox('thread-lintel-support',1.78,2.78,4.65,4.8,0,1.15),
  ],
  exit:{type:'funnel',x:-7.6,z:3.65,radius:.95,bottomRadius:.36,depth:.9},
  pools:[[5.3,-3.2],[-1.8,-4.8],[-2,-2.35],[2.7,-4.9]],
  gems:[{x:-5.4,z:-3.55},{x:4.05,z:.35,base:1.76},{x:-3.8,z:3.55}],
  gold:[[6.7,-3.2],[5.3,-3.2],[3.6,-3.2],[2.7,-4.9],[.7,-3.65],[-1.8,-4.8],[-2,-2.35],
    [-5.4,-3.55],[-7.5,-.95],[-5,.45],[-2.25,.4,1.76],[.25,.4,1.76],[4.05,.35,1.76],
    [7.5,2.7],[4.5,2.6],[.55,2.6],[-3.8,3.55]],
  tablets:[
    {id:'thread-arrival',x:6.7,z:-3.2,base:2.16,category:'story',title:'The threadworks',
      text:'These wells gathered what the filters left behind. Flow through the narrow entrance, then bring scattered flesh together.',hint:'move'},
    {id:'thread-wells',x:3.15,z:-3.2,base:2.16,category:'tutorial',title:'Reach into the wells',
      text:'From the open bank, cast toward green flesh and recall your strands. You can also flow into the wells.',hint:'cast'},
    {id:'thread-whole',x:-3.25,z:-3.55,base:2.16,category:'tutorial',title:'Bring the whole body',
      text:'Recall strands before leaving the bank. Let flesh follow through the opening, then gather around the violet stone.',hint:'move'},
    {id:'thread-above',x:-6.6,z:.45,base:1.08,category:'tutorial',title:'Above the return',
      text:'The rising path carries a violet stone above the court. Release Contract through narrow slots. Falls land below.',hint:'move'},
    {id:'thread-lower',x:6.5,z:3.55,base:0,category:'tutorial',title:'Fold through the stone',
      text:'Wind around long baffles, spread beneath the low lintel, and gather in the open court beyond.',hint:'move'},
  ],
};
const crownBox=(id,minX,maxX,minZ,maxZ,minY,maxY)=>({type:'box',sourceId:id,walkableTop:true,
  minX,maxX,minZ,maxZ,minY,maxY});
export const GRIP_GARDEN={
  id:5,name:'Rootwell Gallery',contentRevision:'rootwell-gallery-1',start:{x:7.6,z:-3.2},seedCount:65,capacity:297,
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
  pools:[[5.3,-3.2],[2.7,-3.2],[-4.8,.55],[6.3,3.55]],
  gems:[{x:-4.7,z:-3.2},{x:.55,z:-.05},{x:-3.8,z:3.55}],
  gold:[[6.7,-3.2],[5.3,-3.2],[2.7,-3.2],[2,-5.1],[.7,-5.1],[-2.05,-4.8],[-4.7,-3.2],
    [-7.5,-1.75],[-7.5,-.65],[-4.8,.55],[-1.4,-.05],[.55,-.05],[6.4,.6],[7.5,2.7],
    [4.2,4.2],[1.2,2.65],[-3.8,3.55]],
  pits:[{type:'pit',sourceId:'broken-upper-well',x:.7,z:-3.8,radius:.72,rimHeight:2.16},
    {type:'pit',sourceId:'broken-spillway-well',x:4.2,z:2.85,radius:.6,rimHeight:0},
    {type:'pit',sourceId:'broken-return-well',x:.1,z:4,radius:.55,rimHeight:0}],
  editorFixtures:[
    crownBox('first-jamb-north',-1.58,-1.22,-6,-5.35,2.16,3.25),
    crownBox('first-jamb-south',-1.58,-1.22,-4.25,-2.1,2.16,3.25),
    crownBox('second-jamb-north',-2.98,-2.62,-6,-4.35,2.16,3.25),
    crownBox('second-jamb-south',-2.98,-2.62,-3.25,-2.1,2.16,3.25),
    crownBox('middle-rib-one',-6.28,-5.92,-2.1,-.45,1.08,2.15),
    crownBox('middle-rib-two',-4.18,-3.82,.65,2,1.08,2.15),
    crownBox('middle-rib-three',-2.58,-2.22,-2.1,-.5,1.08,2.15),
    {type:'roof',sourceId:'low-last-arch',minX:-2.1,maxX:-1.5,minZ:2,maxZ:4.8,bottom:.34,top:1.1},
    crownBox('last-arch-north-foot',-2.1,-1.5,2,2.12,0,1.1),
    crownBox('last-arch-south-foot',-2.1,-1.5,4.68,4.8,0,1.1),
  ],
  tablets:[
    {id:'rootwell-broken-wells',x:6.6,z:-3.2,base:2.16,category:'story',title:'The broken wells',
      text:'Some collection wells have lost their floors. If your brain falls into one, you return to the arrival point. Collected treasures stay with you.',hint:'move'},
    {id:'rootwell-narrow-turn',x:-.2,z:-5.1,base:2.16,category:'tutorial',title:'Follow the narrow turn',
      text:'Stay on the stone around the well. Release Contract through the narrow openings and let your flesh follow before gathering again.',hint:'contract'},
    {id:'rootwell-roots',x:-2.05,z:.15,base:1.08,category:'tutorial',title:'Roots hold the wall',
      text:'Gather at the sage ramp, then press toward a ribbed green face to climb. Both sides of the high pier hold your flesh. Keep moving over the lip before enclosing the gem.',hint:'contract'},
    {id:'rootwell-polished',x:2.35,z:.3,base:1.08,category:'tutorial',title:'Polished by water',
      text:'The turquoise stone carries your momentum. Ease off Run before crossing and steer toward the right stairs. A broken well waits below the spillway.',hint:'run'},
    {id:'rootwell-between',x:6.3,z:3.9,base:0,category:'tutorial',title:'Between the wells',
      text:'Pass the first well on the front side, then turn behind the next. Follow the gold to the low arch and the last violet stone.',hint:'move'},
  ],
};
// The Hollow Crown is built from independent walkable volumes. Their open
// undersides are intentional: falling is a route, and the ribbed recovery
// faces let a careful player climb back to the missed upper paths.
const crownStairs=(id,minX,maxX,minZ,maxZ,base,rise)=>({type:'editor-stairs',sourceId:id,
  axis:'z',reverse:true,steps:10,minX,maxX,minZ,maxZ,base,rise});
export const HOLLOW_CROWN={
  id:6,name:'Hollow Crown',contentRevision:'hollow-crown-1',start:{x:6.8,z:-4.5,y:5.8},seedCount:65,capacity:297,
  boundary:{type:'boundary',minX:-9,maxX:9,minZ:-6,maxZ:5.85},terrain:{type:'flat',height:0},
  editorCanShed:true,tendrils:true,
  exit:{type:'funnel',x:-7.45,z:3.55,radius:.85,bottomRadius:.34,depth:.9},
  basin:{type:'funnel',x:.1,z:3.4,radius:.8,bottomRadius:.42,depth:.65,holdsFeedstock:true},
  pits:[{type:'pit',sourceId:'vault-reset-pit',x:2.5,z:2.55,radius:.5,rimHeight:0}],
  gate:{x:1.5,width:.42,height:1.35,opening:.72,minZ:2.35,maxZ:4.0,
    threshold:32,releaseThreshold:24,rate:44,base:0,latch:true},
  posts:[[-2.45,2.55],[-1.55,2.55],[-2.85,3.52],[-1.95,3.52],[-1.05,3.52]]
    .map(([x,z],i)=>({type:'cylinder',sourceId:`court-flute-${i+1}`,x,z,radius:.24,height:1.12})),
  editorFixtures:[
    crownBox('arrival',5.4,8.4,-5.6,-2.9,0,5.8),
    crownBox('skybridge',-5.4,5.4,-5.15,-3.85,5.38,5.8),
    crownBox('west-crown',-8.3,-5.4,-5.6,-2.9,0,5.8),
    crownStairs('west-descent',-8.25,-5.75,-2.9,-.3,3.3,2.5),
    crownBox('west-middle',-8.3,-5.4,-.3,1.8,0,3.3),
    crownBox('return-bridge',-5.4,5.6,.12,1.23,2.92,3.3),
    {type:'roof',sourceId:'middle-tunnel',minX:-4.7,maxX:-2.4,
      minZ:.12,maxZ:1.23,bottom:3.66,top:4.4,approachBothSides:true},
    crownBox('east-middle',5.6,8.4,-.2,1.6,0,3.3),
    crownStairs('east-descent',6.1,8.35,1.6,4.45,0,3.3),
    crownBox('spire',.6,3.5,-2.7,-.2,3.3,5),
    crownBox('tendril-shelf',-.55,.55,-3,-2.15,4.66,5.1),
    crownBox('underbridge-step-one',-2.4,-.9,-4.85,-3.35,0,.46),
    crownBox('underbridge-step-two',-.9,.45,-4.85,-3.35,.46,.84),
    crownBox('recover-west-middle',-6.3,-5.45,-2.9,-.3,3.3,5.8),
    // The vault is entered from the west only after its suspended shutter rises.
    crownBox('vault-north',1.3,5.7,1.7,1.85,0,1.6),
    crownBox('vault-south',1.3,5.7,4.5,4.65,0,1.6),
    crownBox('vault-east',5.55,5.7,1.85,4.5,0,1.6),
    crownBox('vault-entry-north',1.3,1.72,1.85,2.35,0,1.6),
    crownBox('vault-entry-south',1.3,1.72,4.0,4.5,0,1.6),
    // The low grotto ends at an open pocket where the gem can be surrounded.
    {type:'roof',sourceId:'grotto-long',minX:-5.6,maxX:-4.1,minZ:2.2,maxZ:3.9,bottom:.42,top:1.12},
    {type:'roof',sourceId:'grotto-turn',minX:-4.1,maxX:-3.1,minZ:2.2,maxZ:2.82,bottom:.42,top:1.12},
    {type:'sticky-wall',sourceId:'spire-grip',face:'south',axis:'z',minX:1,maxX:3.1,
      minZ:-2.7,maxZ:-.2,minY:3.3,maxY:5},
    {type:'sticky-wall',sourceId:'west-recovery',face:'east',axis:'x',minX:-8.3,maxX:-5.4,
      minZ:1.25,maxZ:1.8,minY:0,maxY:3.3},
    {type:'sticky-wall',sourceId:'crown-recovery',face:'south',axis:'z',minX:-6.3,maxX:-5.45,
      minZ:-2.9,maxZ:-.3,minY:3.3,maxY:5.8},
    {type:'slip',sourceId:'bridge-slip',targetId:'skybridge',face:'floor',
      minX:1.1,maxX:2.5,minZ:-5.15,maxZ:-3.85,base:5.8,
      owner:{type:'box',minX:-5.4,maxX:5.4,minZ:-5.15,maxZ:-3.85,minY:5.38,maxY:5.8}},
    {type:'slip',sourceId:'descent-slip',targetId:'east-descent',face:'floor',
      minX:6.1,maxX:8.35,minZ:3.4,maxZ:4.2,base:.8,
      owner:{type:'editor-stairs',axis:'z',reverse:true,minX:6.1,maxX:8.35,minZ:1.6,maxZ:4.45,base:0,rise:3.3}},
  ],
  pools:[[6.1,-4.5,5.8],[-6.7,-4.5,5.8],[-6.7,.7,3.3],[7,.45,3.3],[-4.7,4.05,0],[4,3.45,0],[0,-2.6,5.1],[2.05,-1.3,5]],
  poolCounts:[28,16,40,36,42,22,28,20],
  gems:[{x:-6.8,z:-4.5,base:5.8},{x:-6.6,z:.75,base:3.3},{x:2.05,z:-1.5,base:5},
    {x:7,z:.55,base:3.3},{x:-3.6,z:3.3,base:0},{x:3.7,z:3.4,base:0}],
  gold:[
    [7.7,-4.5,5.8],[6.6,-4.5,5.8],[5.1,-4.5,5.8],[3.8,-4.5,5.8],[2.5,-4.5,5.8],[.5,-4.5,5.8],
    [-1.6,-4.5,5.8],[-3.3,-4.5,5.8],[-5.9,-4.5,5.8],[-7.5,-4.5,5.8],
    [-7,-2.35,5.25],[-7,-1.8,4.75],[-7,-1.25,4.25],[-7,-.7,3.7],
    [-6.8,.7,3.3],[-4.9,.7,3.3],[-3.8,.7,3.3],[-2.2,.7,3.3],[-.7,.7,3.3],
    [.7,.7,3.3],[2.1,.7,3.3],[4.2,.7,3.3],[6.1,.7,3.3],[7.2,.7,3.3],
    [7.25,2.05,2.8],[7.25,2.8,1.9],[7.25,3.6,1],
    [5,3.4,0],[4.3,3.4,0],[3.45,3.4,0],[.05,-4.05,.84],[.15,2.1,0],
    [-1.65,-4.05,.46],[-3.3,3.4,0],[-4.75,3.4,0],[-7.35,3.6,0],
  ],
};
// Three broad, reversible switchbacks descend around an open central court.
// The bridge slabs have open undersides; ground hazards live only in that court.
const emberBox=(id,x0,x1,z0,z1,bottom,top)=>crownBox(id,x0,x1,z0,z1,bottom,top);
const emberStairs=(id,x0,x1,z0,z1,base,rise)=>crownStairs(id,x0,x1,z0,z1,base,rise);
const emberStairHeight=(z,minZ,maxZ,base,rise)=>base+rise*(1-(z-minZ)/(maxZ-minZ));
export const EMBER_CASCADE={
  id:7,name:'Ember Cascade',contentRevision:'ember-cascade-1',start:{x:6.9,z:-5.5,y:6.6},seedCount:65,capacity:297,
  boundary:{type:'boundary',minX:-9,maxX:9,minZ:-7.2,maxZ:6.8},terrain:{type:'flat',height:0},
  editorCanShed:true,tendrils:true,
  exit:{type:'funnel',x:7.2,z:5.5,radius:.85,bottomRadius:.34,depth:.9},
  pits:[{type:'pit',sourceId:'west-pit',x:-2.8,z:4.45,radius:.95,rimHeight:0},
    {type:'pit',sourceId:'east-pit',x:2.5,z:4.55,radius:1,rimHeight:0},
    {type:'pit',sourceId:'ember-inner-pit',x:-3.2,z:.1,radius:.6,rimHeight:0},
    {type:'pit',sourceId:'ember-front-pit',x:0,z:3.65,radius:.5,rimHeight:0}],
  editorFixtures:[
    emberBox('ember-arrival',5.6,8.4,-6.5,-4.8,0,6.6),
    emberBox('ember-first-bridge',-5.6,5.6,-6.2,-4.8,6.2,6.6),
    emberBox('ember-first-shoulder',-2.5,2.5,-6.6,-4.2,6.2,6.6),
    emberBox('ember-upper-west',-8.4,-5.6,-6.5,-4.8,0,6.6),
    emberStairs('ember-west-descent',-8.3,-5.8,-4.8,-2.5,4.4,2.2),
    emberBox('ember-middle-west',-8.4,-5.6,-2.5,-.1,0,4.4),
    emberBox('ember-second-bridge',-5.6,5.6,-2.5,-1.1,4,4.4),
    emberBox('ember-lookout',-1.6,1.6,-4.8,-2.5,4.4,5.6),
    emberBox('ember-middle-east',5.6,8.4,-2.5,-1.1,0,4.4),
    emberStairs('ember-east-descent',5.8,8.3,-1.1,1.3,2.2,2.2),
    emberBox('ember-lower-east',5.6,8.4,1.3,3.7,0,2.2),
    emberBox('ember-third-bridge',-5.6,5.6,1.3,2.7,1.8,2.2),
    emberBox('ember-lower-west',-8.4,-5.6,1.3,2.7,0,2.2),
    emberStairs('ember-final-descent',-8.3,-5.8,2.7,5.2,0,2.2),
    {type:'sticky-wall',sourceId:'ember-lookout-grip',targetId:'ember-lookout',face:'south',axis:'z',
      minX:-1.6,maxX:1.6,minZ:-4.8,maxZ:-2.5,minY:4.4,maxY:5.6},
    {type:'sticky-wall',sourceId:'ember-west-recovery',targetId:'ember-middle-west',face:'east',axis:'x',
      minX:-8.4,maxX:-5.6,minZ:-1.05,maxZ:-.12,minY:0,maxY:4.4},
    {type:'sticky-wall',sourceId:'ember-east-recovery',targetId:'ember-lower-east',face:'west',axis:'x',
      minX:5.6,maxX:8.4,minZ:1.3,maxZ:3.7,minY:0,maxY:2.2},
    {type:'lava',sourceId:'ember-raised-lava',targetId:'ember-first-shoulder',face:'floor',
      minX:-.7,maxX:.7,minZ:-5.45,maxZ:-4.2,base:6.6,
      owner:{type:'box',minX:-2.5,maxX:2.5,minZ:-6.6,maxZ:-4.2,minY:6.2,maxY:6.6}},
    // The central underpasses glow below all three suspended crossings. The
    // side approaches stay cool and the front court remains a safe traverse.
    {type:'lava',sourceId:'ember-underbridge-lava',face:'floor',
      minX:-5.4,maxX:5.4,minZ:-6.7,maxZ:3.05,base:0},
    {type:'lava',sourceId:'ember-ground-lava',face:'floor',minX:-.9,maxX:1,minZ:4.4,maxZ:5.35,base:0},
  ],
  pools:[[6.65,-5.5,6.6],[-7,-5.5,6.6],[-7,-1.35,4.4],[0,-3.65,5.6],
    [7,-1.85,4.4],[-7,1.95,2.2],[-5,5.55,0],[4.8,5.5,0]],
  poolCounts:[26,18,32,28,30,28,36,34],
  gems:[{x:-7,z:-5.55,base:6.6},{x:-7,z:-1.35,base:4.4},{x:0,z:-3.65,base:5.6},
    {x:7,z:-1.85,base:4.4},{x:-7,z:1.95,base:2.2},
    {x:-4.7,z:5.45,base:0},{x:4.8,z:5.45,base:0}],
  gold:[
    [7.9,-5.5,6.6],[6.65,-5.5,6.6],[5.2,-5.5,6.6],[3.8,-5.5,6.6],[2.4,-5.5,6.6],
    [1,-5.7,6.6],[-.4,-5.75,6.6],[-1.8,-5.7,6.6],[-3.2,-5.5,6.6],[-4.6,-5.5,6.6],
    [-6,-5.5,6.6],[-7.2,-5.5,6.6],[-7.2,-4.95,6.6],
    ...[-4.45,-4.05,-3.65,-3.25,-2.85].map(z=>[-7.05,z,emberStairHeight(z,-4.8,-2.5,4.4,2.2)]),
    [-7,-1.35,4.4],[-5.1,-1.8,4.4],[-3.7,-1.8,4.4],[-2.3,-1.8,4.4],[-.9,-1.8,4.4],
    [0,-3.65,5.6],[.9,-1.8,4.4],[2.3,-1.8,4.4],[3.7,-1.8,4.4],[5.1,-1.8,4.4],[7,-1.85,4.4],
    ...[-1,-.65,-.2,.25,.7,1.1].map(z=>[7,z,emberStairHeight(z,-1.1,1.3,2.2,2.2)]),
    [7,1.95,2.2],[5.1,2,2.2],[3.7,2,2.2],[2.3,2,2.2],[.9,2,2.2],[-.5,2,2.2],
    [-1.9,2,2.2],[-3.3,2,2.2],[-4.7,2,2.2],[-7,1.95,2.2],
    ...[3.15,3.65,4.15,4.65,5.1].map(z=>[-7,z,emberStairHeight(z,2.7,5.2,0,2.2)]),
    [-5.1,5.45,0],[-4.7,5.45,0],[-5.4,6.15,0],[4.8,5.45,0],[6.1,6.15,0],
  ],
};
export const GARDEN_LEVELS=[GARDEN,WEIGHT_GARDEN,PASSAGE_GARDEN,REACH_GARDEN,GRIP_GARDEN,HOLLOW_CROWN,EMBER_CASCADE];
export const GARDEN_TARGETS=CAMPAIGN_TARGETS;
export const gardenWorldOffset=levelId=>levelId===7?-45:-(levelId-1)*7.2;
GARDEN_LEVELS.forEach((level,i)=>{level.targetTime=GARDEN_TARGETS[i];});
// Tendril casting is a basic garden action on every campaign floor and in
// custom editor gardens. A level's authored tendrils flag remains a layout
// feature (Reach channels), so enabling controls does not replace fixtures.
export const gardenCanCast=level=>!!level&&(!!level.editorCustom||GARDEN_LEVELS.some(g=>g.id===level.id)||!!level.tendrils);
export const looseGardenParticles=particles=>particles.filter(p=>p.feedstock&&p.patchId===undefined);
export function gardenFixtureHeight(level,x,z,authoredBase){
  if(Number.isFinite(authoredBase))return authoredBase;
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
  const withPits=items=>finish([...items,...(level.pits||[])]);
  if(level.id===6&&level.gate){const g=level.gate;
    return withPits([level.boundary,level.terrain,...(level.basin?[level.basin]:[]),...(level.exit?[level.exit]:[]),
      {type:'roof',sourceId:'vault-shutter',minX:g.x-g.width/2,maxX:g.x+g.width/2,
        minZ:g.minZ,maxZ:g.maxZ,bottom:g.base+opening,top:g.base+opening+g.height},
      ...(level.posts||[]),...extra]);}
  // The nursery's stone arcade and raised branch are authored as physical
  // pieces. A shortcut off the rear terrace remains possible.
  if(level.id===1)return withPits([level.boundary,level.terrain,...(level.exit?[level.exit]:[]),
    ...(level.roof?[level.roof]:[]),
    ...(level.roofSupports||[]),
    ...(level.posts||[]),...(level.channels||[]),...extra]);
  if(level.grip&&!level.gate)return withPits([level.boundary,level.terrain,level.grip.ramp,level.grip.platform,
    ...(level.slip?[level.slip]:[]),...(level.channels||[]),...(level.exit?[level.exit]:[]),
    ...(level.roof?[level.roof]:[]),...(level.posts||[]),...extra]);
  if(level.tendrils&&!level.gate)return withPits([level.boundary,level.terrain,...(level.channels||[]),...(level.exit?[level.exit]:[]),
    ...(level.basin?[level.basin]:[]),...(level.roof?[level.roof]:[]),...(level.posts||[]),...extra]);
  if(level.gate){const g=level.gate,half=g.width/2;
    return withPits([level.boundary,level.terrain,...(level.basin?[level.basin]:[]),...(level.exit?[level.exit]:[]),
      {type:'roof',minX:g.x-half,maxX:g.x+half,minZ:g.minZ,maxZ:g.maxZ,bottom:g.base+opening,top:g.base+opening+g.height},
      {type:'box',minX:g.x-half,maxX:g.x+half,minY:g.base,maxY:g.base+g.height+g.opening,minZ:level.terrain.frontZ,maxZ:g.minZ},
      {type:'box',minX:g.x-half,maxX:g.x+half,minY:g.base,maxY:g.base+g.height+g.opening,minZ:g.maxZ,maxZ:level.terrain.rearZ},
      ...(level.passage&&!level.csgSolid?[level.passage,
        {type:'box',minX:level.passage.minX,maxX:level.passage.maxX,minY:0,maxY:level.passage.top,minZ:level.passage.minZ,maxZ:level.passage.minZ+.16},
        {type:'box',minX:level.passage.minX,maxX:level.passage.maxX,minY:0,maxY:level.passage.top,minZ:level.passage.maxZ-.16,maxZ:level.passage.maxZ}]:[]),
      ...(level.channels||[]),...(level.posts||[]),...extra]);
  }
  return withPits([level.boundary,level.terrain,...(level.exit?[level.exit]:[]),
    ...(level.roof?[level.roof,...[level.roof.minZ-.14,level.roof.maxZ+.14].map(z=>({type:'box',minX:0,maxX:.75,minY:0,maxY:1.06,minZ:z-.14,maxZ:z+.14}))]:[]),
    ...(level.posts||[]),...(level.channels||[]),...extra]);
}
export function createGarden(level=GARDEN,{tabletStorage,tabletMemorySeen}={}){
  const colliders=gardenColliders(level);
  return {phase:'title',elapsed:0,playElapsed:0,finishElapsed:null,deaths:0,drainTime:0,moved:0,grew:false,contracted:false,enteredGap:false,under:false,gapApproachSide:null,gapEntrySide:null,
    levelId:level.id,arrivalTime:0,settleTime:0,
    gems:(level.gems||[]).map((g,id)=>({...g,id,y:gardenFixtureHeight(level,g.x,g.z,g.base)+.34,radius:.31,coverage:0,progress:0,collected:false})),
    tablets:(level.tablets||[]).map(t=>({...t,y:gardenFixtureHeight(level,t.x,t.z,t.base)+.15,
      read:tabletSeen(level,t.id,tabletStorage,tabletMemorySeen),progress:0})),activeTabletId:null,
    gold:(level.gold||[]).map(([x,z,base],id)=>({x,z,id,y:gardenFixtureHeight(level,x,z,base)+.13,collected:false})),
    goldCount:0,gemCount:0,notice:'',noticeUntil:0};
}
export function seedGarden(fluid,level=GARDEN){
  const colliders=gardenColliders(level);
  for(const p of fluid.particles){p.y+=Math.max(groundAt(p.x,p.z,colliders).height,level.start.y??0);p.py=p.y;}
  (level.pools||[]).forEach(([x,z,base],patchId)=>{
    for(let i=0;i<(level.poolCounts?.[patchId]??58);i++){
      const a=i*2.39996323,r=.45*Math.sqrt((i%29)/28);
      const p=fluid.addParticle({x:x+Math.cos(a)*r,z:z+Math.sin(a)*r,
        y:gardenFixtureHeight(level,x,z,base)+fluid.radius+.015+Math.floor(i/29)*.12},{feedstock:true});
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
  state.playElapsed+=dt;
  state.moved=Math.max(state.moved,Math.hypot(b.x-level.start.x,b.z-level.start.z));
  state.grew ||= f.attachedCount>=110;
  state.contracted ||= !!f.contractAnchor;
  if(level.roof){
    const roof=level.roof,inLane=b.z>roof.minZ&&b.z<roof.maxZ;
    if(!state.enteredGap&&inLane&&b.y<roof.bottom){
      if(b.x>roof.maxX+.12)state.gapApproachSide='east';
      else if(b.x<roof.minX-.12)state.gapApproachSide='west';
      else if(b.x>roof.minX-.2&&b.x<roof.maxX+.2){
        state.enteredGap=true;
        state.gapEntrySide=state.gapApproachSide||
          (b.x>(roof.minX+roof.maxX)/2?'east':'west');
      }
    }
    if(state.enteredGap&&inLane&&b.y<roof.bottom){
      const opposite=state.gapEntrySide==='east'?b.x<roof.minX-.3:b.x>roof.maxX+.3;
      const retreated=state.gapEntrySide==='east'?b.x>roof.maxX+.3:b.x<roof.minX-.3;
      if(opposite)state.under=true;
      else if(retreated){state.enteredGap=false;state.gapEntrySide=null;}
    }
  }
  const owned=f.particles.filter((p,i)=>i!==f.brainIndex&&!p.feedstock&&p.component===b.component);
  for(const tablet of sim.tabletAutoRead===false?[]:state.tablets){
    if(tablet.read)continue;
    tablet.progress=tabletCoverage(tablet,owned,colliders,f.radius)?tablet.progress+dt:Math.max(0,tablet.progress-dt);
    if(tablet.progress>=.3&&openTablet(sim,tablet))return;
  }
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
  const exitHeight=Math.max(level.exit.base??0,gardenFixtureHeight(level,level.exit.x,level.exit.z,level.exit.base));
  if(Math.hypot(b.x-level.exit.x,b.z-level.exit.z)<level.exit.radius*.7&&b.y<exitHeight+1){
    sim.finishGardenClock?.();
    state.phase='draining';state.finishElapsed=state.playElapsed;state.drainTime=0;f.contractAnchor=null;sim.tendril.release();
  }
}
export function gardenHint(sim){
  const s=sim.garden,b=sim.brain,level=sim.gardenLevel||GARDEN;
  if(s.phase==='arriving'||s.phase==='settling')return ['FLOW DOWN','The living body pours through the opening above.'];
  if(s.phase==='draining')return ['DOWN THE DRAIN','Taking the soft way down.'];
  if(level.editorCustom)return ['EXPLORE YOUR GARDEN','Move through your authored fixtures, gather flesh, and flow into the exit.'];
  if(level.id===7){
    if(b.y>5.8)return ['UPPER CROSSING','Cross to the west landing. The ember patch cuts across the raised shoulder; the rear lip stays clear.'];
    if(b.x<-5.5&&b.y>3)return ['WEST DESCENT','Follow the broad stair to the middle bridge. Green ribs offer a climb back after a fall.'];
    if(b.y>3&&b.x<5.6)return ['LOOKOUT ABOVE','The south face of the lookout grips. Climb for its gem and flesh, then return to the bridge.'];
    if(b.x>5.5&&b.y>1)return ['EAST DESCENT','Turn down the east stairs and cross the lower bridge.'];
    if(b.y>1)return ['LOWER CROSSING','Cross west to the final stair. A fall leaves a route through the court.'];
    return ['EMBER COURT','The underpasses glow with lava. Follow the cool side corridors, skirt the pits, and cross the clear front lane to the drain.'];
  }
  if(level.id===6){
    if(b.y>4.8&&b.z<-3)return ['THE SKY BRIDGE','Cross the narrow crown. The turquoise stretch keeps your momentum; the court below costs points.'];
    if(b.x<-5.2&&b.y>2.7)return ['THE WESTERN RETURN','Follow the descent, then cross the middle bridge through its low tunnel.'];
    if(b.x<3.7&&b.x>.2&&b.y>2.7)return ['THE RIBBED SPIRE','Press toward the green wall to climb to the high violet inclusion.'];
    if(b.x>5.7&&b.y>1)return ['THE EASTERN DESCENT','Follow the long ramp down. Losing the edge is survivable, but leaves gold above.'];
    if(b.x>-.8&&b.x<5.6&&b.z>2)return sim.pressure.active?
      ['THE SHUTTER RISES','The shutter stays open. Flow beneath it and gather the vault gem.']:
      ['WEIGHT FOR THE VAULT',`Hold Shed near the basin. ${sim.pressure.weight} / ${level.gate.threshold} loose flesh opens the shutter.`];
    if(b.x<-3&&b.z>2)return ['THE LOW GROTTO','Flatten beneath the stone ceiling, then contract in the open pocket around the gem.'];
    return ['FIND THE WAY DOWN','Recover on the green ribs, explore the side routes, and enter the lower funnel.'];
  }
  if(level.grip){
    const face=level.grip.platform,ramp=level.grip.ramp,slip=level.slip;
    if(s.moved<.8)return ['ROOTWELL GALLERY','Gather the nearby flesh, then follow the gold around the first broken well.'];
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
    if(s.moved<.8)return ['THE THREADWORKS','Flow through the narrow entrance to the open bank. Green flesh waits in three shallow wells.'];
    if(b.z<level.terrain.frontZ){
      if(t.recalling)return ['RECALLING FLESH',`${t.count} / 3 strands drawing loose flesh back. Tap Space to pause; hold to contract.`];
      if(t.count)return ['STRANDS EXTENDED',`${t.count} / 3 strands. Double click a well or press E to cast another; hold still to gather and recall.`];
      if(b.x<-4)return ['FIRST VIOLET STONE','Regather your flesh around the gem, then descend the west stairs.'];
      return ['REACH INTO THE WELLS','From the open bank, click a well or press E to cast toward green flesh. Tap Space to recall it.'];
    }
    if(b.z<level.terrain.rearZ)return ['THE RAISED RETURN','Climb the west ramp and release Contract through the narrow bridge slots. The lower court catches falls.'];
    return ['THE STONE FOLDS','Wind between the lower baffles and spread under the lintel to reach the last gem and drain.'];
  }
  if(level.id===2){
    if(s.moved<.8)return ['THE SETTLING GALLERY','Flow left through the shallow water pockets. The old cistern carries their weight below.'];
    if(!s.grew)return ['GATHER THE POCKETS','Gather the green flesh resting in the upper bowls, then follow the gold west.'];
    const gem=s.gems.filter(g=>!g.collected).sort((a,c)=>Math.hypot(a.x-b.x,a.z-b.z)-Math.hypot(c.x-b.x,c.z-b.z))[0];
    if(gem&&Math.hypot(gem.x-b.x,gem.z-b.z)<1.6)return ['SURROUND THE GEM',`Hold Space to enclose the violet stone. Covered ${Math.round(gem.coverage*100)}%.`];
    if(b.z<level.terrain.frontZ)return ['THE WESTERN STAIR','Descend to the basin chamber. A direct ledge drop trades the upper rewards for a shorter route.'];
    if(!sim.pressure.active&&sim.pressure.weight<level.gate.threshold)return ['THE COUNTERWEIGHT',
      `Hold F beside the basin rim. ${sim.pressure.weight} / ${level.gate.threshold} loose pieces raise the shutter.`];
    if(b.x<level.gate.x)return ['THE SHUTTER','Leave the deposit in its bowl and flow east through the raised opening.'];
    if(b.z<level.terrain.rearZ)return ['THE EASTERN STAIR','The middle gem waits beyond the shutter. Descend the right stair afterward.'];
    return ['THE FILTER COURT','Wind around the two stone ribs, gather the last gem, and enter the drain to the west.'];
  }
  if(level.id===3){
    if(s.moved<.8)return ['THE SILT LOOM','Release Contract and thread the narrow openings in the stone ribs. The upper pockets hold flesh and gold.'];
    const gem=s.gems.filter(g=>!g.collected).sort((a,c)=>Math.hypot(a.x-b.x,a.z-b.z)-Math.hypot(c.x-b.x,c.z-b.z))[0];
    if(gem&&Math.hypot(gem.x-b.x,gem.z-b.z)<1.6)return ['SURROUND THE GEM',
      `Hold Space to enclose the violet stone. Covered ${Math.round(gem.coverage*100)}%.`];
    if(b.z<level.terrain.frontZ){
      if(b.x>-.5)return ['WEAVE THROUGH THE RIBS','Steer between the staggered openings, then gather the green flesh in the open court.'];
      if(b.x>-6.5)return ['THE WESTERN RIBS','Flow through the staggered slots toward the stair. Let the rest of your body follow.'];
      return ['THE WESTERN STAIR','Descend to the basin chamber. A ledge drop cuts the route short but leaves rewards above.'];
    }
    if(b.z<level.terrain.rearZ){
      if(!sim.pressure.active&&sim.pressure.weight<level.gate.threshold)return ['WEIGHT FOR THE SHUTTER',
        `Hold F at the basin rim. ${sim.pressure.weight} / ${level.gate.threshold} loose pieces lift the shutter.`];
      if(b.x<level.gate.x)return ['THE RAISED SHUTTER','Leave the deposit in its bowl. Flow east through the raised opening.'];
      if(b.x<5.1)return ['BRING THE REST','Cast back toward the bowl once clear of the shutter; recall your flesh and enclose the second gem.'];
      return ['THE EASTERN TURN','Thread the opening in the eastern rib, then descend the right stair.'];
    }
    if(b.x>level.passage.maxX+.3)return ['THE LOWER FILTER','Thread the narrow openings between the lower ribs. Release Contract before the low covered passage.'];
    if(b.x>level.passage.minX-.5)return ['THE COVERED FILTER','Spread beneath the stone roof. The final gem waits beyond its western opening.'];
    return ['THE WAY DOWN','Gather the final gem, then enter the western drain.'];
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
  if(s.moved<.8)return ['THE ARRIVAL BOWL','Flow west through the hanging nursery. The inscribed stones remember how to move.'];
  if(!s.grew)return ['GATHER THE POOLS','Follow the green flesh through the planting pockets.'];
  const gem=s.gems.filter(g=>!g.collected).sort((a,c)=>Math.hypot(a.x-b.x,a.z-b.z)-Math.hypot(c.x-b.x,c.z-b.z))[0];
  if(gem&&Math.hypot(gem.x-b.x,gem.z-b.z)<1.6)return ['SURROUND THE GEM',
    `Move over the gem, then hold Space to gather into a mound. Surround it on every side. Covered ${Math.round(gem.coverage*100)}%.`];
  if(!s.gemCount)return ['THE STONE CUP','The first gem waits beyond the low arcade. Gather your body around it.'];
  if(b.z<GARDEN.terrain.frontZ)return ['THE WESTERN STAIR','Continue west to the stair. A drop gives a quick route down but misses the nursery trail.'];
  if(b.x<GARDEN.terrain.stairs.maxX+.5&&b.z<GARDEN.terrain.stairs.endZ)return ['SPILL DOWN','Follow the shallow western stair to the lower court.'];
  if(b.x<4)return ['THE LOWER COURT','The bridge has another gem. The broad floor below lets you recover after a fall.'];
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
