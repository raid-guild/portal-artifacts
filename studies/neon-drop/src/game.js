import * as THREE from 'three';
import * as RAPIER from '@dimforge/rapier3d-compat/rapier.es.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { BALLS } from './state.js';
import { POCKETS } from './challenge.js';
import { UPPER_DECK_Y, TRANSFER_GATES } from './double-deck.js';

const C = { cyan:0x37dafa, magenta:0xfe45bc, gold:0xffbd50, mint:0x55ffc0, ink:0x090b16 };
const T = Math.PI*2;
export const DECK_Y = -2.2;
export const DROP_Y = 3.45;
export const RIM_POST = {x:2.65,z:0,radius:.11,height:.22};
export function rimWedgeVertices(side=1){
  return new Float32Array([.11*side,0,-.18,.11*side,0,.18,-.16*side,0,0,.11*side,.22,-.18,.11*side,.22,.18,-.16*side,.22,0]);
}
export function createRimPost(world,y=DECK_Y,side=1){
  const body=world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(RIM_POST.x*side,y,RIM_POST.z));
  world.createCollider(RAPIER.ColliderDesc.convexHull(rimWedgeVertices(side)).setRestitution(.65).setFriction(.12),body);
  return body;
}
const TUBE_RADIUS = 2.88;
const TUBE_BOTTOM = DECK_Y-.65;
const TUBE_TOP = 4.55;
const RIPPLE_LIMIT = 28;
const RIPPLE_SEGMENTS = 48;
const BURST_LIMIT = 30;
const SPARK_LIMIT = 190;
const mat = (color, metalness=.55, roughness=.3, emissive=0x000000, emissiveIntensity=0) => new THREE.MeshStandardMaterial({color,metalness,roughness,emissive,emissiveIntensity});
const dark = mat(0x111929,.8,.27), edge = mat(0x234253,.85,.25), black = mat(0x080e1a,.55,.33);
const glow = (c,i=2) => new THREE.MeshBasicMaterial({color:c,toneMapped:false});

function box(parent, size, pos, material, rotation=0) { const o=new THREE.Mesh(new THREE.BoxGeometry(...size),material); o.position.set(...pos); o.rotation.y=rotation; o.castShadow=true; o.receiveShadow=true; parent.add(o); return o; }
function cyl(parent, r1,r2,h,pos,material,segments=64) { const o=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,segments),material); o.position.set(...pos); o.castShadow=true; o.receiveShadow=true; parent.add(o); return o; }
function torus(parent,r,t,pos,material,rotX=Math.PI/2) { const o=new THREE.Mesh(new THREE.TorusGeometry(r,t,10,64),material); o.position.set(...pos); o.rotation.x=rotX; parent.add(o); return o; }
function textSprite(text,color='#e5f9ff',size=72,width=512,height=128) {
  const canvas=document.createElement('canvas'); canvas.width=width;canvas.height=height;
  const ctx=canvas.getContext('2d'); ctx.clearRect(0,0,width,height);ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`900 ${size}px Arial, sans-serif`;
  while(ctx.measureText(text).width>width*.9&&size>12){size-=2;ctx.font=`900 ${size}px Arial, sans-serif`;}
  ctx.shadowColor=color;ctx.shadowBlur=2;ctx.fillText(text,width/2,height/2);
  const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;
  const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthWrite:false}));sprite.scale.set(width/height*.58,.58,1);return sprite;
}
function line(points,color,opacity=.4) { const g=new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(...p))); return new THREE.Line(g,new THREE.LineBasicMaterial({color,transparent:true,opacity})); }

export function deckGeometry(holes) {
  const shape=new THREE.Shape();shape.absarc(0,0,2.88,0,T,false);
  for(const h of holes){const path=new THREE.Path();path.absarc(h.x,h.z,h.r,0,T,true);shape.holes.push(path);}
  const geom=new THREE.ExtrudeGeometry(shape,{depth:.20,bevelEnabled:false,curveSegments:32});geom.rotateX(Math.PI/2);geom.computeVertexNormals();
  return geom;
}

export function ballColliderDesc(type='chrome') {
  const cfg=BALLS[type]||BALLS.chrome;
  return RAPIER.ColliderDesc.ball(.16).setRestitution(cfg.restitution).setRestitutionCombineRule(RAPIER.CoefficientCombineRule.Max).setFriction(.38).setDensity(cfg.density);
}

export function createTubeColliders(world) {
  const colliders=[];
  const segments=48, wallHeight=TUBE_TOP-TUBE_BOTTOM;
  for(let i=0;i<segments;i++) {
    const a=(i+.5)*T/segments;
    const x=Math.cos(a)*TUBE_RADIUS,z=Math.sin(a)*TUBE_RADIUS;
    const halfTangential=Math.tan(Math.PI/segments)*TUBE_RADIUS+.015;
    colliders.push(world.createCollider(RAPIER.ColliderDesc.cuboid(.09,wallHeight/2,halfTangential)
      .setTranslation(x,(TUBE_TOP+TUBE_BOTTOM)/2,z)
      .setRotation({x:0,y:-Math.sin(a/2),z:0,w:Math.cos(a/2)})
      .setRestitution(.88).setFriction(.15)));
  }
  colliders.push(world.createCollider(RAPIER.ColliderDesc.cuboid(TUBE_RADIUS,.08,TUBE_RADIUS)
    .setTranslation(0,TUBE_TOP+.08,0).setRestitution(.88)));
  return colliders;
}

export class NeonMachine {
  constructor(container, callbacks) { this.container=container;this.callbacks=callbacks;this.active=[];this.returns=[];this.sparks=[];this.ripples=[];this.bursts=[];this.nextRipple=0;this.nextSpark=0;this.nextBurst=0;this.prismGeometry=new THREE.OctahedronGeometry(.08,0);this.accretionGeometry=new THREE.TorusGeometry(.22,.014,5,32);this.cosmetics={trail:'default',impact:'default',jackpot:'default'};this.view='cabinet';this.rotation=0;this.spin=.38;this.clock=new THREE.Clock();this.accumulator=0;this.running=true;this.holes=[];this.playTime=0;this.follow=null;this.shake=0;this.bloomOn=true;this.reducedEffects=false;this.muted=false;this.audio=null;this.ballCollisionTimes=new Map(); }
  async init() {
    await RAPIER.init();
    this.world=new RAPIER.World({x:0,y:-10.5,z:0});this.world.timestep=1/120;
    this.impactEvents=new RAPIER.EventQueue(true);
    this.scene=new THREE.Scene();this.scene.background=new THREE.Color(0x050813);this.scene.fog=new THREE.FogExp2(0x050813,.018);
    this.camera=new THREE.PerspectiveCamera(42,1,.1,100);this.camera.position.set(-.4,8.2,14);this.camera.lookAt(0,.5,-.3);
    this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.42;this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;this.container.appendChild(this.renderer.domElement);
    this.composer=new EffectComposer(this.renderer);this.composer.addPass(new RenderPass(this.scene,this.camera));this.composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),.22,.23,.91));this.composer.addPass(new OutputPass());
    this.scene.add(new THREE.HemisphereLight(0x9edaff,0x080819,1.35));
    this.makeRipples();this.makeCosmeticPools();
    const key=new THREE.DirectionalLight(0xffffff,1.45);key.position.set(-3,9,7);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.camera.left=-9;key.shadow.camera.right=9;key.shadow.camera.top=9;key.shadow.camera.bottom=-9;this.scene.add(key);
    for(const [x,y,z,c,intensity] of [[-4,4,1,C.cyan,12],[4,5,1,C.magenta,10],[0,5,-4,C.gold,6]]) { const l=new THREE.PointLight(c,intensity,14,2);l.position.set(x,y,z);this.scene.add(l); }
    this.makeMachine();this.makeBoard();this.makeUpperDeck();this.makeRimPosts();this.makeElevator();this.makeBackdrop();this.loadDecor();
    this.resize();this.ro=new ResizeObserver(()=>this.resize());this.ro.observe(this.container);
    this.animate=()=>{if(!this.running)return;requestAnimationFrame(this.animate);const dt=Math.min(this.clock.getDelta(),.05);if(document.hidden){this.accumulator=0;return;}this.step(dt);};this.animate();
  }
  makeMachine() {
    this.machine=new THREE.Group();this.scene.add(this.machine);
    box(this.machine,[7.9,.42,8.15],[0,-3.75,0],dark);
    box(this.machine,[7.35,1.5,7.65],[0,-4.67,0],black);
    for(const x of [-3.83,3.83]) {box(this.machine,[.16,8.55,.18],[x,.35,-3.75],edge);box(this.machine,[.16,8.55,.18],[x,.35,3.75],edge);}
    for(const z of [-3.75,3.75]) {box(this.machine,[7.8,.16,.18],[0,4.62,z],edge);box(this.machine,[7.8,.16,.18],[0,-3.65,z],edge);}
    for(const z of [-3.72,3.72]) box(this.machine,[7.85,.14,.16],[0,4.66,z],edge);
    for(const x of [-3.78,3.78]) box(this.machine,[.16,.14,7.6],[x,4.66,0],edge);
    box(this.machine,[7.2,7.5,.14],[0,.65,-3.82],mat(0x0d1625,.35,.48));
    box(this.machine,[7.9,.17,8.05],[0,-2.95,0],edge);
    cyl(this.machine,3.25,3.4,.35,[0,DECK_Y-.52,0],dark,96);
    this.deckTrim=torus(this.machine,3.14,.083,[0,DECK_Y-.12,0],glow(C.cyan));
    torus(this.machine,3.45,.055,[0,-2.9,0],glow(C.magenta));
    for(let i=0;i<28;i++) {const a=i*T/28;const x=Math.cos(a)*3.38,z=Math.sin(a)*3.38;const led=new THREE.Mesh(new THREE.SphereGeometry(.045,8,8),glow(i%7===0?C.gold:C.cyan));led.position.set(x,DECK_Y+.08,z);this.machine.add(led);}
    this.hopper=cyl(this.machine,.46,.46,.18,[.7,3.65,-1.2],dark);torus(this.machine,.47,.045,[.7,3.76,-1.2],glow(C.gold));
    const chute=box(this.machine,[.24,1.2,.24],[.7,3.05,-1.2],mat(0x2b4b66,.75,.2));chute.material.transparent=true;chute.material.opacity=.35;
    // A continuous, invisible circular wall keeps even high rebounds in the glass-tube playfield.
    this.rimColliders=createTubeColliders(this.world);
    this.tubeHandles=new Set(this.rimColliders.map(c=>c.handle));
    this.floor=this.world.createCollider(RAPIER.ColliderDesc.cuboid(5,.2,5).setTranslation(0,-3.18,0));
    const plinthText=textSprite('TICKETS  •  CIRCUITS  •  GLORY','#6be9ff',43);plinthText.scale.set(4.25,.55,1);plinthText.position.set(0,-4.32,3.87);this.machine.add(plinthText);
  }
  makeBoard() {
    const holes=POCKETS.map(h=>({...h}));this.holes=holes;
    const geom=deckGeometry(holes);
    this.boardGroup=new THREE.Group();this.boardGroup.position.y=DECK_Y;this.scene.add(this.boardGroup);
    const deck=new THREE.Mesh(geom,mat(0x14283b,.8,.32,0x05243c,.35));deck.receiveShadow=true;deck.castShadow=true;this.boardGroup.add(deck);
    const g=geom.index?geom:geom.toNonIndexed();const pos=g.getAttribute('position');const verts=new Float32Array(pos.array);const indices=geom.index?new Uint32Array(geom.index.array):Uint32Array.from({length:pos.count},(_,i)=>i);
    this.boardBody=this.world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(0,DECK_Y,0));this.boardCollider=this.world.createCollider(RAPIER.ColliderDesc.trimesh(verts,indices).setFriction(.38).setRestitution(.55),this.boardBody);
    torus(this.boardGroup,2.87,.07,[0,.01,0],glow(C.cyan));torus(this.boardGroup,.66,.018,[0,.015,0],glow(C.magenta));
    for(const h of holes) {
      const pit=cyl(this.boardGroup,h.r*.87,h.r*.87,.05,[h.x,-.24,h.z],mat(h.color,.2,.8,h.color,.55),32);pit.material.transparent=true;pit.material.opacity=.85;
      torus(this.boardGroup,h.r+.023,.034,[h.x,.028,h.z],glow(h.color));
      const label=textSprite(h.label,h.kind==='jackpot'?'#ffe6a1':h.kind==='free'?'#ff9be1':'#d9fbff',98);label.scale.set(h.r*1.82,h.r*.88,1);label.position.set(h.x,.08,h.z);label.material.depthTest=false;this.boardGroup.add(label);
      const sensor=this.world.createCollider(RAPIER.ColliderDesc.ball(h.r*.86).setTranslation(h.x,-.26,h.z).setSensor(true),this.boardBody);h.sensor=sensor;
    }
    for(let i=0;i<12;i++){const a=i*T/12+.2;const x=Math.cos(a)*1.64,z=Math.sin(a)*1.64;cyl(this.boardGroup,.075,.085,.22,[x,.13,z],mat(0x8fdafa,.85,.12,0x2d9bce,.7),12);this.world.createCollider(RAPIER.ColliderDesc.ball(.09).setTranslation(x,.13,z).setRestitution(.9),this.boardBody);}
  }
  makeUpperDeck(){
    this.upperGroup=new THREE.Group();this.upperGroup.position.y=UPPER_DECK_Y;this.scene.add(this.upperGroup);
    const geometry=deckGeometry(TRANSFER_GATES),positions=geometry.getAttribute('position');
    const indices=geometry.index?new Uint32Array(geometry.index.array):Uint32Array.from({length:positions.count},(_,i)=>i);
    this.upperBody=this.world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(0,UPPER_DECK_Y,0));
    this.upperCollider=this.world.createCollider(RAPIER.ColliderDesc.trimesh(new Float32Array(positions.array),indices).setFriction(.3).setRestitution(.55),this.upperBody);
    const material=mat(0x542970,.65,.25,0x3c135d,.5);material.transparent=true;material.opacity=.32;material.depthWrite=false;material.side=THREE.DoubleSide;
    this.upperGroup.add(new THREE.Mesh(geometry,material));
    torus(this.upperGroup,2.87,.045,[0,.02,0],glow(C.magenta));
    this.transferSensors=TRANSFER_GATES.map(g=>{
      torus(this.upperGroup,g.r+.02,.028,[g.x,.025,g.z],glow(g.x===0&&g.z===0?C.gold:C.mint));
      return this.world.createCollider(RAPIER.ColliderDesc.ball(g.r*.76).setTranslation(g.x,-.28,g.z).setSensor(true),this.upperBody);
    });
    const label=textSprite('+25%','#ffe6a1',64);label.scale.set(.72,.28,1);label.position.set(0,.12,0);this.upperGroup.add(label);
    this.upperBody.setEnabled(false);this.upperGroup.visible=false;
  }
  makeRimPosts(){
    // Stationary wall-side pins interrupt co-rotation without steering or invented scores.
    this.rimPosts=[DECK_Y,UPPER_DECK_Y].flatMap((y,deck)=>[-1,1].map(side=>{
      const group=new THREE.Group();this.scene.add(group);const x=RIM_POST.x*side;
      const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(rimWedgeVertices(side),3));
      const indices=[0,1,2,3,5,4,0,3,4,0,4,1,1,4,5,1,5,2,2,5,3,2,3,0];if(side===-1)for(let i=0;i<indices.length;i+=3)[indices[i+1],indices[i+2]]=[indices[i+2],indices[i+1]];
      geometry.setIndex(indices);geometry.computeVertexNormals();
      const wedge=new THREE.Mesh(geometry,mat(0xc58c35,.8,.22,0xc58c35,.5));wedge.position.set(x,y,RIM_POST.z);group.add(wedge);
      return {group,deck,body:createRimPost(this.world,y,side)};
    }));
  }

  makeElevator() {
    this.elevator=new THREE.Group();this.scene.add(this.elevator);
    const x=3.35,z=-2.82;
    const liftBottom=DECK_Y-.4,liftTop=3.65;
    for(const dx of [-.21,.21]) box(this.elevator,[.09,liftTop-liftBottom,.1],[x+dx,(liftTop+liftBottom)/2,z],edge);
    for(let i=0;i<13;i++) {const y=liftBottom+i*(liftTop-liftBottom)/12;box(this.elevator,[.57,.04,.18],[x,y,z-.11],dark);box(this.elevator,[.51,.015,.05],[x,y+.024,z+.015],glow(C.cyan));}
    box(this.elevator,[.82,.28,.75],[x,liftTop,z],dark);
    torus(this.elevator,.32,.04,[x,liftTop-.1,z],glow(C.gold),0);
    const label=textSprite('RETURN LIFT','#7defff',37);label.scale.set(1.7,.32,1);label.position.set(x,liftTop+.32,z+.35);this.elevator.add(label);
    const rail=line([[0,DECK_Y-.35,-2.2],[2.2,DECK_Y-.4,-2.2],[3.35,liftBottom,-2.82]],C.cyan,.55);this.elevator.add(rail);
  }
  makeBackdrop() {
    const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),mat(0x070b13,.22,.83));floor.rotation.x=-Math.PI/2;floor.position.y=-5.65;floor.receiveShadow=true;this.scene.add(floor);
    const grid=new THREE.GridHelper(50,45,0x184053,0x102535);grid.position.y=-5.64;this.scene.add(grid);
    for(let i=0;i<36;i++) {const a=i*T/36,r=8+i%3;const p=new THREE.Mesh(new THREE.SphereGeometry(.025,6,6),glow(i%5?C.cyan:C.magenta));p.position.set(Math.cos(a)*r,Math.sin(i*3)*3,Math.sin(a)*r);this.scene.add(p);}
  }
  loadDecor() {new GLTFLoader().load(`${import.meta.env.BASE_URL}assets/arcade-crest.glb`,g=>{g.scene.scale.setScalar(.45);g.scene.position.set(0,4.55,-3.63);this.scene.add(g.scene);},undefined,()=>{});}
  resetSimulation(){
    for(const item of this.active){this.world.removeRigidBody(item.body);this.scene.remove(item.mesh);item.mesh.geometry.dispose();item.mesh.material.dispose();for(const t of item.trail){this.scene.remove(t);t.userData.sphereGeometry.dispose();t.material.dispose();}}
    for(const item of this.returns){this.scene.remove(item.mesh);item.mesh.geometry.dispose();item.mesh.material.dispose();}
    this.active=[];this.returns=[];this.follow=null;this.accumulator=0;this.rotation=0;this.brakeTime=0;this.shake=0;this.ballCollisionTimes.clear();this.clearPreview();
    this.boardBody.setRotation({x:0,y:0,z:0,w:1},true);this.boardBody.setNextKinematicRotation({x:0,y:0,z:0,w:1});this.boardGroup.rotation.y=0;if(this.upperBody){this.upperBody.setRotation({x:0,y:0,z:0,w:1},true);this.upperBody.setNextKinematicRotation({x:0,y:0,z:0,w:1});this.upperGroup.rotation.y=0;}this.impactEvents.drainContactForceEvents(()=>{});
  }
  setRun(run){this.run=run;this.spin=.58;const double=run.cabinet==='double'&&!run.challenge;this.upperBody?.setEnabled(double);if(this.upperGroup)this.upperGroup.visible=double;this.rimPosts?.forEach(post=>{const enabled=!run.challenge&&(post.deck===0||double);post.body.setEnabled(enabled);post.group.visible=enabled;});}
  setAudioEngine(engine){this.audioEngine=engine;}
  setCosmetics(equipped){this.cosmetics={trail:equipped?.trail||'default',impact:equipped?.impact||'default',jackpot:equipped?.jackpot||'default'};}
  setCabinetStyle(style){const colors={cyan:0x37dafa,magenta:0xfe65c9,gold:0xffd078};const color=colors[style]||colors.cyan;edge.color.setHex(color).multiplyScalar(.34);this.deckTrim?.material.color.setHex(color);}
  setView(view){this.view=view;}
  setEffects(on){this.bloomOn=on;}
  setReducedEffects(on){this.reducedEffects=on;if(on){this.ascension.visible=false;this.haloGroup.visible=false;this.shake=0;this.sparks.forEach(s=>{s.life=0;s.mesh.visible=false;});this.bursts.forEach(b=>b.mesh.visible=false);for(const item of this.active)item.trail.forEach(t=>t.visible=false);this.previewTrails.forEach(t=>t.visible=false);document.body.classList.remove('jackpot-flash');}}

  sound(kind) {if(!this.muted)this.audioEngine?.sfx(kind);}
  canDrop(){
    if(this.active.length>=(this.run?.challenge?1:9))return false;
    return !this.active.some(item=>{const p=item.body.translation();return Math.hypot(p.x-.7,p.y-DROP_Y,p.z+1.2)<.38;});
  }
  drop(ballType='chrome',free=false) {
    if(!this.canDrop())return false;
    const cfg=BALLS[ballType]||BALLS.chrome;
    const body=this.world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(.7,DROP_Y,-1.2).setLinvel(this.run?.challenge?0:(Math.random()-.5)*1.4,-.55,this.run?.challenge?.7:.45+Math.random()*.5).setCcdEnabled(true));
    const collider=this.world.createCollider(ballColliderDesc(ballType).setActiveEvents(RAPIER.ActiveEvents.CONTACT_FORCE_EVENTS),body);
    const material=mat(new THREE.Color(cfg.color),.92,.11,new THREE.Color(cfg.glow),.55);
    const mesh=new THREE.Mesh(new THREE.SphereGeometry(.16,28,20),material);mesh.castShadow=true;this.scene.add(mesh);
    const trail=[];for(let i=0;i<12;i++){const sphere=new THREE.SphereGeometry(.058-i*.003,8,8);const p=new THREE.Mesh(sphere,new THREE.MeshBasicMaterial({color:cfg.glow,transparent:true,opacity:.3*(1-i/12),depthWrite:false,blending:THREE.AdditiveBlending}));p.userData.sphereGeometry=sphere;this.scene.add(p);trail.push(p);}
    this.active.push({body,collider,mesh,trail,type:ballType,free,age:0,rimHits:0,lastImpact:-1,history:[]});this.follow=this.active.at(-1);this.sound('drop');this.callbacks.onDrop?.(free);if(this.run?.upgrades.includes('brake'))this.brakeTime=2;this.shake=this.reducedEffects?0:.045;return true;
  }
  makeRipples() {
    for(let i=0;i<RIPPLE_LIMIT;i++) {
      const geometry=new THREE.BufferGeometry();
      const positions=new Float32Array(RIPPLE_SEGMENTS*6*3);
      geometry.setAttribute('position',new THREE.BufferAttribute(positions,3).setUsage(THREE.DynamicDrawUsage));
      const material=new THREE.MeshBasicMaterial({color:C.cyan,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,toneMapped:false});
      const mesh=new THREE.Mesh(geometry,material);mesh.visible=false;mesh.frustumCulled=false;this.scene.add(mesh);
      this.ripples.push({mesh,age:0,duration:0,kind:'deck',center:new THREE.Vector3(),normal:new THREE.Vector3(0,1,0),strength:0});
    }
  }
  makeCosmeticPools(){
    const sparkGeometry=new THREE.SphereGeometry(.025,6,6);
    for(let i=0;i<SPARK_LIMIT;i++){
      const mesh=new THREE.Mesh(sparkGeometry,new THREE.MeshBasicMaterial({color:C.gold,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending}));mesh.visible=false;this.scene.add(mesh);
      this.sparks.push({mesh,vel:new THREE.Vector3(),life:0,max:1});
    }
    for(let i=0;i<BURST_LIMIT;i++){
      const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(new Float32Array(48*3),3).setUsage(THREE.DynamicDrawUsage));
      const mesh=new THREE.LineSegments(geometry,new THREE.LineBasicMaterial({color:C.cyan,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}));mesh.visible=false;mesh.frustumCulled=false;this.scene.add(mesh);
      this.bursts.push({mesh,age:0,duration:1,kind:'voltage',center:new THREE.Vector3(),normal:new THREE.Vector3(0,1,0),strength:1});
    }
    this.haloGroup=new THREE.Group();this.scene.add(this.haloGroup);this.haloGroup.visible=false;
    for(let i=0;i<3;i++){const mesh=new THREE.Mesh(new THREE.TorusGeometry(1.3+i*.48,.024,6,80),new THREE.MeshBasicMaterial({color:i===1?C.magenta:C.gold,transparent:true,opacity:.7,depthWrite:false,blending:THREE.AdditiveBlending}));mesh.rotation.x=.5+i*.32;this.haloGroup.add(mesh);}
    this.haloAge=0;this.haloDuration=0;
    this.ascension=new THREE.Group();this.scene.add(this.ascension);this.ascension.visible=false;this.ascensionAge=0;this.fireworkStage=0;
    this.energyBeam=new THREE.Mesh(new THREE.CylinderGeometry(.12,.75,6.6,32,1,true),new THREE.MeshBasicMaterial({color:0x92eaff,transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,toneMapped:false}));this.energyBeam.position.y=DECK_Y+3.3;this.ascension.add(this.energyBeam);
    for(let i=0;i<7;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(1,.025,6,80),new THREE.MeshBasicMaterial({color:i%2?C.magenta:C.gold,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}));ring.rotation.x=Math.PI/2;this.ascension.add(ring);}

    this.previewBall=new THREE.Mesh(new THREE.SphereGeometry(.16,24,16),mat(0xd9edff,.9,.1,C.cyan,.7));this.scene.add(this.previewBall);this.previewBall.visible=false;
    this.previewTrails=Array.from({length:12},(_,i)=>{const sphere=new THREE.SphereGeometry(.058-i*.003,8,8);const mesh=new THREE.Mesh(sphere,new THREE.MeshBasicMaterial({color:C.cyan,transparent:true,opacity:.35*(1-i/12),depthWrite:false,blending:THREE.AdditiveBlending}));mesh.userData.sphereGeometry=sphere;mesh.visible=false;this.scene.add(mesh);return mesh;});
  }
  renderTrailMarkers(markers,history,kind,time,color,visible=true){
    for(let i=0;i<markers.length;i++){
      const marker=markers[i],sample=kind==='helix'?Math.floor(i/2)+1:i+1;
      marker.position.copy(history[Math.min(sample,history.length-1)]||history[0]);
      marker.geometry=kind==='singularity'?(i%3===0?this.accretionGeometry:this.prismGeometry):kind==='prism'?this.prismGeometry:marker.userData.sphereGeometry;
      marker.scale.setScalar(kind==='ion'?1.65-i*.06:kind==='prism'?1.55:kind==='helix'?1.05:1);
      if(kind==='singularity'){const angle=time*8+i*.7;marker.position.x+=Math.cos(angle)*.18;marker.position.z+=Math.sin(angle)*.18;marker.scale.set(1.8-i*.08,1.8-i*.08,.6);marker.rotation.set(time*3+i,time*4+i*.7,time*2);}
      if(kind==='helix'){const angle=time*13-Math.floor(i/2)*.78+(i%2)*Math.PI;marker.position.x+=Math.cos(angle)*.18;marker.position.z+=Math.sin(angle)*.18;}
      if(kind==='prism'||kind==='singularity'){marker.material.color.setHSL((time*.3+i*.085)%1,1,.66);marker.rotation.set(time*4+i,time*3+i*.7,time*2);}
      else marker.material.color.set(kind==='ion'?0x72eaff:color);
      marker.material.opacity=(kind==='default'?.28:.68)*(1-i/markers.length);
      marker.visible=visible&&!this.reducedEffects;
    }
  }
  drawTrail(item){
    const kind=this.cosmetics.trail;
    this.renderTrailMarkers(item.trail,item.history,kind,this.playTime,(BALLS[item.type]||BALLS.chrome).glow,item.age>.1);
    if(kind==='ion'&&!this.reducedEffects&&Math.random()<.16)this.particles(item.mesh.position,C.cyan,1);
  }
  emitCosmeticImpact(point,normal,kind,strength,color){
    if(this.reducedEffects)return;
    const style=this.preview?.category==='impact'?this.preview.id:this.cosmetics.impact;
    if(style==='default')return;
    if(style==='resonance'){for(let i=0;i<4;i++){this.emitRipple(point,normal,kind,1-i*.17,i%2?C.magenta:C.cyan);const r=this.ripples[(this.nextRipple-1)%this.ripples.length];r.duration=.6+i*.2;r.age=-i*.07;}this.emitBurst('voltage',point,normal,1.8,C.cyan,kind);this.emitBurst('blossom',point,normal,1.35,C.magenta,kind);return;}
    if(style==='echo'){
      const offset=normal.clone().normalize().multiplyScalar(.025);
      this.emitRipple(point.clone().add(offset),normal,kind,Math.max(.25,strength*.7),color);
      this.emitRipple(point.clone().addScaledVector(offset,2),normal,kind,Math.max(.2,strength*.45),C.magenta);
      return;
    }
    this.emitBurst(style==='voltage'?'voltage':'blossom',point,normal,Math.max(.3,strength),style==='voltage'?0x8cedff:0xa7eaff,kind);
  }
  emitBurst(kind,point,normal,strength,color,surface='other'){
    const b=this.bursts[this.nextBurst++%this.bursts.length];b.kind=kind;b.surface=surface;b.center.copy(point);b.normal.copy(normal).normalize();b.age=0;b.duration=kind==='supernova'?1.5:kind==='blossom'?.85:.42;b.strength=strength;b.mesh.material.color.setHex(color);b.mesh.visible=true;this.drawBurst(b);
  }
  drawBurst(b){
    const t=Math.min(1,b.age/b.duration),p=b.mesh.geometry.attributes.position;
    const n=b.normal,u=new THREE.Vector3(0,1,0).cross(n).normalize();if(u.lengthSq()<.01)u.set(1,0,0);
    const v=new THREE.Vector3().crossVectors(n,u).normalize();const count=b.kind==='voltage'?8:12;
    for(let i=0;i<24;i++){
      if(i>=count){p.setXYZ(i*2,0,0,0);p.setXYZ(i*2+1,0,0,0);continue;}
      const a=i*T/count,dir=u.clone().multiplyScalar(Math.cos(a)).addScaledVector(v,Math.sin(a));
      const start=b.center.clone().addScaledVector(dir,.08+t*.14),end=b.center.clone().addScaledVector(dir,(b.kind==='supernova'?2.5:.7)*(.25+t)*b.strength);
      if(b.kind==='voltage'){const jag=(i%2?1:-1)*.17;end.addScaledVector(v,jag);}
      if(b.kind==='blossom')end.addScaledVector(n,(i%2?1:-1)*.22*t);
      if(b.surface==='wall'){
        const base=Math.atan2(b.center.z,b.center.x);
        const tangent=new THREE.Vector3(-Math.sin(base),0,Math.cos(base));
        const project=(point,index)=>{const delta=point.clone().sub(b.center),horizontal=delta.dot(tangent),angle=base+horizontal/TUBE_RADIUS;p.setXYZ(index,(TUBE_RADIUS-.065)*Math.cos(angle),THREE.MathUtils.clamp(point.y,TUBE_BOTTOM+.03,TUBE_TOP-.03),(TUBE_RADIUS-.065)*Math.sin(angle));};
        project(start,i*2);project(end,i*2+1);
      }else{p.setXYZ(i*2,start.x,start.y,start.z);p.setXYZ(i*2+1,end.x,end.y,end.z);}
    }
    p.needsUpdate=true;b.mesh.material.opacity=(b.kind==='supernova'?.95:.76)*(1-t);
  }
  emitJackpot(point){
    if(this.reducedEffects)return;
    const style=this.preview?.category==='jackpot'?this.preview.id:this.cosmetics.jackpot;
    if(style==='ascension'){this.ascension.visible=true;this.ascensionAge=0;this.fireworkStage=0;this.particles(point,C.gold,60,true);}
    if(style==='fountain'){this.particles(point,C.gold,120,true);this.particles(point,0xfff2b4,45,true);}
    if(style==='halo'||style==='supernova'){this.haloGroup.position.set(0,DECK_Y+.8,0);this.haloGroup.visible=true;this.haloAge=0;this.haloDuration=style==='supernova'?2.5:2;}
    if(style==='supernova'){this.emitBurst('supernova',new THREE.Vector3(0,DECK_Y+.9,0),new THREE.Vector3(0,1,0),1.5,0xffe6a2);this.particles(point,C.gold,100,true);}
  }
  previewCosmetic(category,id){
    this.preview={category,id,age:0};
    if(category==='trail'){this.previewBall.visible=true;this.previewTrails.forEach(t=>t.visible=true);}
    if(category==='impact'){this.emitRipple(new THREE.Vector3(0,.9,2.78),new THREE.Vector3(0,0,-1),'wall',.8,C.cyan);this.emitCosmeticImpact(new THREE.Vector3(0,.9,2.78),new THREE.Vector3(0,0,-1),'wall',.8,C.cyan);}
    if(category==='jackpot'){this.particles(new THREE.Vector3(0,DECK_Y+.3,0),C.gold,65,true);this.emitJackpot(new THREE.Vector3(0,DECK_Y+.3,0));}
  }
  clearPreview(){this.preview=null;this.ascension.visible=false;this.previewBall.visible=false;this.previewTrails.forEach(t=>t.visible=false);this.haloGroup.visible=false;this.bursts.forEach(b=>b.mesh.visible=false);this.ripples.forEach(r=>r.mesh.visible=false);this.sparks.forEach(s=>{s.life=0;s.mesh.visible=false;});}
  updateCosmeticBursts(dt){
    if(this.reducedEffects){this.ascension.visible=false;this.haloGroup.visible=false;this.bursts.forEach(b=>b.mesh.visible=false);this.shake=0;document.body.classList.remove('jackpot-flash');}
    if(this.ascension.visible){
      const t=this.ascensionAge+=dt;if(t>4.2){this.ascension.visible=false;}else{
        const charge=Math.min(1,t/.8),fade=Math.min(1,(4.2-t)/.8);
        this.energyBeam.scale.set(1+Math.sin(t*19)*.12,charge,1+Math.sin(t*19)*.12);this.energyBeam.position.y=DECK_Y+3.3*charge;this.energyBeam.material.opacity=.36*charge*fade;
        this.ascension.children.slice(1).forEach((ring,i)=>{const phase=(t*.45+i/7)%1;ring.position.y=DECK_Y+phase*6.7;ring.scale.setScalar(.4+Math.sin(phase*Math.PI)*2.5);ring.rotation.z=t*(i%2?1:-1);ring.material.opacity=Math.sin(phase*Math.PI)*.8*fade;});
        const stage=Math.floor(Math.max(0,t-1.3)*5);if(t>1.3&&stage>this.fireworkStage){this.fireworkStage=stage;const angle=stage*2.4;this.particles(new THREE.Vector3(Math.cos(angle)*1.7,1+Math.sin(stage)*1.8,Math.sin(angle)*1.7),stage%2?C.magenta:C.gold,36,true);this.emitBurst('supernova',new THREE.Vector3(0,1.4,0),new THREE.Vector3(0,1,0),1.1,stage%2?C.cyan:C.gold);}
      }
    }

    for(const b of this.bursts){if(!b.mesh.visible)continue;b.age+=dt;if(b.age>=b.duration){b.mesh.visible=false;continue;}this.drawBurst(b);}
    if(this.haloGroup.visible){this.haloAge+=dt;const t=this.haloAge/this.haloDuration;if(t>=1)this.haloGroup.visible=false;else{this.haloGroup.scale.setScalar(.55+t*1.6);this.haloGroup.rotation.y+=dt*2;for(const m of this.haloGroup.children)m.material.opacity=.7*(1-t);}}
    if(!this.preview)return;
    this.preview.age+=dt;const t=this.preview.age;
    if(this.preview.category==='trail'){
      const pos=this.previewBall.position;pos.set(Math.sin(t*2)*.6,2.9-(t%2.7)*1.7,-.4);this.previewBall.material.emissive.set(this.preview.id==='prism'?0xff79cf:C.cyan);
      const history=Array.from({length:14},(_,i)=>new THREE.Vector3(Math.sin(Math.max(0,t-i*.055)*2)*.6,2.9-((t-i*.055+2.7)%2.7)*1.7,-.4));
      this.renderTrailMarkers(this.previewTrails,history,this.preview.id,t,C.cyan);
      if(this.preview.id==='ion'&&Math.random()<.16)this.particles(pos,C.cyan,1);
    }else if(t>1.1&&this.preview.category==='impact'){this.preview.age=0;this.emitRipple(new THREE.Vector3(0,.9,2.78),new THREE.Vector3(0,0,-1),'wall',.8,C.cyan);this.emitCosmeticImpact(new THREE.Vector3(0,.9,2.78),new THREE.Vector3(0,0,-1),'wall',.8,C.cyan);}
    else if(t>(this.preview.id==='ascension'?4.6:3)&&this.preview.category==='jackpot'){this.preview.age=0;this.particles(new THREE.Vector3(0,DECK_Y+.3,0),C.gold,65,true);this.emitJackpot(new THREE.Vector3(0,DECK_Y+.3,0));}
  }
  emitRipple(point,normal,kind,strength,color) {
    const ripple=this.ripples[this.nextRipple++%this.ripples.length];
    ripple.age=0;ripple.duration=this.reducedEffects?.24:.42+strength*.14;
    ripple.kind=kind;ripple.center.copy(point);ripple.normal.copy(normal);ripple.strength=strength;
    ripple.mesh.material.color.set(color);ripple.mesh.visible=true;
    this.drawRipple(ripple);
  }
  drawRipple(ripple) {
    const progress=Math.max(0,Math.min(1,ripple.age/ripple.duration));
    const maxRadius=(ripple.kind==='wall'?.72:.53)*(this.reducedEffects?.55:1)*(1+.36*ripple.strength);
    const radius=.055+maxRadius*progress;
    const width=(this.reducedEffects?.018:.035)+.018*ripple.strength;
    const positions=ripple.mesh.geometry.attributes.position;
    const point=ripple.center;
    const wallAngle=Math.atan2(point.z,point.x);
    const normal=ripple.normal.clone().normalize();
    const tangent=new THREE.Vector3(0,1,0).cross(normal);
    if(tangent.lengthSq()<.01)tangent.set(1,0,0);
    tangent.normalize();
    const bitangent=new THREE.Vector3().crossVectors(normal,tangent).normalize();
    const vertex=(index,angle,ringRadius)=>{
      const u=Math.cos(angle)*ringRadius,v=Math.sin(angle)*ringRadius;
      if(ripple.kind==='wall') {
        const a=wallAngle+u/TUBE_RADIUS;
        positions.setXYZ(index,(TUBE_RADIUS-.065)*Math.cos(a),THREE.MathUtils.clamp(point.y+v,TUBE_BOTTOM+.03,TUBE_TOP-.03),(TUBE_RADIUS-.065)*Math.sin(a));
      } else if(ripple.kind==='deck') {
        positions.setXYZ(index,point.x+u,point.y+.025,point.z+v);
      } else {
        positions.setXYZ(index,point.x+tangent.x*u+bitangent.x*v,point.y+tangent.y*u+bitangent.y*v,point.z+tangent.z*u+bitangent.z*v);
      }
    };
    for(let i=0;i<RIPPLE_SEGMENTS;i++) {
      const a=i*T/RIPPLE_SEGMENTS,b=(i+1)*T/RIPPLE_SEGMENTS,k=i*6;
      vertex(k,a,radius);vertex(k+1,a,radius+width);vertex(k+2,b,radius);
      vertex(k+3,b,radius);vertex(k+4,a,radius+width);vertex(k+5,b,radius+width);
    }
    positions.needsUpdate=true;
    ripple.mesh.material.opacity=(this.reducedEffects?.22:.62+.3*ripple.strength)*Math.pow(1-progress,1.3);
  }
  captureImpacts(fixed) {
    this.impactEvents.drainContactForceEvents(event=>{
      const handle1=event.collider1(),handle2=event.collider2();
      const first=this.active.find(ball=>ball.collider.handle===handle1);
      const second=this.active.find(ball=>ball.collider.handle===handle2);
      const item=first||second;
      if(!item)return;
      const impulse=event.maxForceMagnitude()*fixed;
      if(impulse<.045)return;
      if(first&&second){
        const key=[handle1,handle2].sort((a,b)=>a-b).join(':');
        if(this.playTime-(this.ballCollisionTimes.get(key)??-1)<.09)return;
        this.ballCollisionTimes.set(key,this.playTime);
        if(this.ballCollisionTimes.size>160){for(const [pair,at] of this.ballCollisionTimes)if(this.playTime-at>1)this.ballCollisionTimes.delete(pair);}
        const p1=first.body.translation(),p2=second.body.translation();
        const point=new THREE.Vector3((p1.x+p2.x)/2,(p1.y+p2.y)/2,(p1.z+p2.z)/2);
        const normal=new THREE.Vector3(p2.x-p1.x,p2.y-p1.y,p2.z-p1.z).normalize();
        if(normal.lengthSq()<.01)normal.set(0,1,0);
        const strength=THREE.MathUtils.clamp((impulse-.045)/.3,.28,1);
        this.emitRipple(point,normal,'other',strength,C.magenta);
        if(!this.reducedEffects){this.emitBurst('voltage',point,normal,.35+strength*.55,C.cyan);this.particles(point,C.magenta,5);}
        for(const ball of [first,second]){
          ball.lastImpact=this.playTime;
          ball.impactCount=(ball.impactCount||0)+1;
          if(ball.impactCount>1){const retention=ball.type==='rubber'?.94:ball.type==='heavy'?.88:.90;const v=ball.body.linvel();ball.body.setLinvel({x:v.x*retention,y:v.y*retention,z:v.z*retention},true);}
        }
        if(this.playTime-(this.lastClackSound||-1)>.075){this.sound('clack');this.lastClackSound=this.playTime;}
        return;
      }
      if(this.playTime-item.lastImpact<.065)return;
      const otherHandle=item.collider.handle===handle1?handle2:handle1;
      const tube=this.tubeHandles.has(otherHandle);
      const deck=otherHandle===this.boardCollider.handle||otherHandle===this.upperCollider?.handle;
      const strength=THREE.MathUtils.clamp((impulse-.045)/.38,0,1);
      let point=null,normal=null;
      this.world.contactPair(this.world.getCollider(handle1),this.world.getCollider(handle2),manifold=>{
        if(point||manifold.numSolverContacts()===0)return;
        const p=manifold.solverContactPoint(0),n=manifold.normal();
        point=new THREE.Vector3(p.x,p.y,p.z);normal=new THREE.Vector3(n.x,n.y,n.z);
      });
      if(!point){const p=item.body.translation();point=new THREE.Vector3(p.x,p.y,p.z);}
      if(!normal){const n=event.maxForceDirection();normal=new THREE.Vector3(n.x,n.y,n.z);}
      const kind=tube&&Math.hypot(point.x,point.z)>2.5?'wall':deck?'deck':'other';
      const cfg=BALLS[item.type]||BALLS.chrome;
      this.emitRipple(point,normal,kind,tube?Math.min(1,strength+.25):strength,cfg.glow);
      this.emitCosmeticImpact(point,normal,kind,strength,cfg.glow);
      item.lastImpact=this.playTime;
      // Preserve the opening rebound, then dissipate more energy on later hits.
      item.impactCount=(item.impactCount||0)+1;
      if(item.impactCount>1){
        const retention=item.type==='rubber'?.94:item.type==='heavy'?.88:.90;
        const v=item.body.linvel();
        item.body.setLinvel({x:v.x*retention,y:v.y*retention,z:v.z*retention},true);
      }
      if(deck||this.world.getCollider(otherHandle).parent()?.handle===this.boardBody.handle)item.rimHits++;
      if(this.playTime-(this.lastBounceSound||0)>.09){this.sound('bounce');this.lastBounceSound=this.playTime;}
    });
  }
  particles(pos,color,count=12,big=false){if(this.reducedEffects)count=Math.min(count,5);for(let i=0;i<count;i++){const s=this.sparks[this.nextSpark++%this.sparks.length];s.mesh.position.copy(pos);s.mesh.material.color.set(color);s.mesh.material.opacity=1;s.mesh.visible=true;s.vel.set((Math.random()-.5)*(big?5:3),Math.random()*(big?6:3),(Math.random()-.5)*(big?5:3));s.max=s.life=big?1.2:.6;s.mesh.scale.setScalar(big?1.7:1);}}
  recycle(item,hole=null) {
    const p=item.mesh.position.clone();if(hole){this.particles(p,hole.color,hole.kind==='jackpot'?65:hole.kind==='free'?28:14,hole.kind==='jackpot');if(hole.kind==='jackpot'){this.audioEngine?.duckForJackpot();this.emitJackpot(p);}this.sound(hole.kind==='jackpot'?'jackpot':hole.kind==='free'?'free':'score');this.callbacks.onScore?.({...hole,charged:!!item.charged},item.type,item.rimHits);}else{this.callbacks.onRefund?.(item.free);}
    const handle=item.collider.handle;
    for(const key of this.ballCollisionTimes.keys())if(key.split(':').some(part=>Number(part)===handle))this.ballCollisionTimes.delete(key);
    this.world.removeRigidBody(item.body);this.scene.remove(item.mesh);item.mesh.geometry.dispose();item.mesh.material.dispose();for(const t of item.trail){this.scene.remove(t);t.userData.sphereGeometry.dispose();t.material.dispose();}this.active.splice(this.active.indexOf(item),1);
    const cfg=BALLS[item.type]||BALLS.chrome;const m=new THREE.Mesh(new THREE.SphereGeometry(.15,16,12),mat(new THREE.Color(cfg.color),.8,.2,new THREE.Color(cfg.glow),.5));this.scene.add(m);this.returns.push({mesh:m,age:0,duration:this.run?.upgrades.includes('speed')?2.5:3.4});
    if(this.follow===item)this.follow=this.active.at(-1)||null;
  }
  resize(){const w=Math.max(1,this.container.clientWidth),h=Math.max(1,this.container.clientHeight);this.camera.aspect=w/h;this.camera.fov=w<700?52:42;this.camera.updateProjectionMatrix();this.renderer.setSize(w,h,false);this.composer.setSize(w,h);}
  step(dt){
    if(this.preview){
      for(const s of this.sparks){if(s.life<=0)continue;s.life-=dt;s.mesh.position.addScaledVector(s.vel,dt);s.vel.y-=5*dt;s.mesh.material.opacity=Math.max(0,s.life/s.max);if(s.life<=0)s.mesh.visible=false;}
      for(const ripple of this.ripples){if(!ripple.mesh.visible)continue;ripple.age+=dt;if(ripple.age>=ripple.duration)ripple.mesh.visible=false;else this.drawRipple(ripple);}
      this.updateCosmeticBursts(dt);if(this.bloomOn)this.composer.render();else this.renderer.render(this.scene,this.camera);return;
    }
    this.accumulator+=dt;
    const fixed=1/120;let steps=0;
    while(this.accumulator>=fixed&&steps<8){this.playTime+=fixed;this.rotation+=(this.brakeTime>0?.22:this.spin)*fixed;this.brakeTime=Math.max(0,(this.brakeTime||0)-fixed);this.boardBody.setNextKinematicRotation({x:0,y:Math.sin(this.rotation/2),z:0,w:Math.cos(this.rotation/2)});if(this.upperGroup.visible){const angle=-this.rotation*.7;this.upperBody.setNextKinematicRotation({x:0,y:Math.sin(angle/2),z:0,w:Math.cos(angle/2)});}this.world.step(this.impactEvents);this.captureImpacts(fixed);this.accumulator-=fixed;steps++;}
    if(steps===8)this.accumulator=0;
    this.boardGroup.rotation.y=this.rotation;if(this.upperGroup.visible)this.upperGroup.rotation.y=-this.rotation*.7;
    for(const item of [...this.active]){
      item.age+=dt;const p=item.body.translation();item.mesh.position.set(p.x,p.y,p.z);const q=item.body.rotation();item.mesh.quaternion.set(q.x,q.y,q.z,q.w);
      item.history.unshift(item.mesh.position.clone());if(item.history.length>16)item.history.pop();this.drawTrail(item);
      if(this.upperGroup.visible&&!item.charged&&p.y<UPPER_DECK_Y-.1&&this.world.intersectionPair(item.collider,this.transferSensors[0])){item.charged=true;item.mesh.material.emissive.setHex(C.mint);this.particles(item.mesh.position,C.mint,12);this.emitRipple(item.mesh.position,new THREE.Vector3(0,1,0),'deck',.8,C.mint);this.callbacks.onCharge?.();}
      if(p.y<DECK_Y-.08){const hole=this.holes.find(h=>this.world.intersectionPair(item.collider,h.sensor));if(hole){this.recycle(item,hole);continue;}}
      if(item.age>(this.upperGroup.visible?30:18)||p.y<DECK_Y-.68){this.recycle(item);continue;}
    }
    this.audioEngine?.setActivity(this.active.length);
    for(const r of [...this.returns]){r.age+=dt;const t=r.age/r.duration;let x,y,z;if(t<.28){const k=t/.28;x=.1+3.25*k;y=DECK_Y-.4;z=-1.9-.92*k;}else if(t<.88){const k=(t-.28)/.6;x=3.35;y=DECK_Y-.4+(3.38-(DECK_Y-.4))*k;z=-2.82;}else{const k=(t-.88)/.12;x=3.35-2.65*k;y=3.38+.07*k;z=-2.82+1.62*k;}r.mesh.position.set(x,y,z);r.mesh.rotation.z+=dt*5;if(t>=1){this.scene.remove(r.mesh);r.mesh.geometry.dispose();r.mesh.material.dispose();this.returns.splice(this.returns.indexOf(r),1);}}
    for(const s of this.sparks){if(s.life<=0)continue;s.life-=dt;s.mesh.position.addScaledVector(s.vel,dt);s.vel.y-=5*dt;s.mesh.material.opacity=Math.max(0,s.life/s.max);if(s.life<=0)s.mesh.visible=false;}
    this.updateCosmeticBursts(dt);
    for(const ripple of this.ripples){if(!ripple.mesh.visible)continue;ripple.age+=dt;if(ripple.age>=ripple.duration){ripple.mesh.visible=false;continue;}this.drawRipple(ripple);}
    const target=this.view==='follow'&&this.follow?new THREE.Vector3(this.follow.mesh.position.x+2,this.follow.mesh.position.y+1.8,this.follow.mesh.position.z+3.5):new THREE.Vector3(-.4,8.2,14);
    this.camera.position.lerp(target,Math.min(1,dt*2.4));const look=this.view==='follow'&&this.follow?this.follow.mesh.position:new THREE.Vector3(0,.35,0);this.camera.lookAt(look);
    if(this.shake>.001){this.camera.position.x+=(Math.random()-.5)*this.shake;this.camera.position.y+=(Math.random()-.5)*this.shake;this.shake*=.86;}
    if(this.bloomOn)this.composer.render();else this.renderer.render(this.scene,this.camera);
  }
  destroy(){this.running=false;this.ro?.disconnect();this.impactEvents?.free();for(const ripple of this.ripples){ripple.mesh.geometry.dispose();ripple.mesh.material.dispose();}for(const burst of this.bursts){burst.mesh.geometry.dispose();burst.mesh.material.dispose();}for(const spark of this.sparks)spark.mesh.material.dispose();this.sparks[0]?.mesh.geometry.dispose();this.prismGeometry.dispose();this.accretionGeometry.dispose();for(const mesh of this.ascension.children){mesh.geometry.dispose();mesh.material.dispose();}for(const mesh of [this.previewBall,...this.previewTrails,...this.haloGroup.children]){if(mesh.userData.sphereGeometry)mesh.userData.sphereGeometry.dispose();else mesh.geometry.dispose();mesh.material.dispose();}this.renderer?.dispose();this.container?.replaceChildren();}
}
