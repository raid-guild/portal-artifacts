import {WeaponVfx} from './weapon-vfx';
import * as THREE from 'three';
import { graphicsProfile, uploadVisibleInstances, type GraphicsMode } from './render-policy';
import { chargeCapsule, ENEMY_CAP, Game, WORLD, WEAPONS, type EnemyKind, type LevelId } from './game';
import { emptyHit, sweepObstacles } from './obstacles';

const hex = (n: number) => `#${n.toString(16).padStart(6, '0')}`;
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pixelTexture = (path: string, mipmapped = false) => {
  const texture=new THREE.TextureLoader().load(path);
  texture.colorSpace=THREE.SRGBColorSpace;texture.magFilter=THREE.NearestFilter;texture.minFilter=mipmapped?THREE.LinearMipmapLinearFilter:THREE.NearestFilter;
  return texture;
};
const terrainTexture = (level: LevelId) => {
  if(level!=='training'){
    const t=pixelTexture(`${import.meta.env.BASE_URL}terrain/${level==='forest'?'forest-floor':level==='desert'?'desert-floor':level==='lava'?'lava-floor':'ice-floor'}.png`);
    t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(15,15);t.colorSpace=THREE.SRGBColorSpace;t.magFilter=THREE.NearestFilter;return t;
  }
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 512;
  const c = canvas.getContext('2d')!;
  c.fillStyle='#191923'; c.fillRect(0, 0, 512, 512);
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
    const px = x * 64, py = y * 64; c.fillStyle = (x+y)%2?'#20212b':'#242630'; c.fillRect(px + 2, py + 2, 60, 60);
    c.strokeStyle = '#383744'; c.lineWidth = 1; c.strokeRect(px + 2.5, py + 2.5, 59, 59);
    c.strokeStyle = 'rgba(255,211,143,.05)'; c.beginPath(); c.moveTo(px + rand(8,25), py + rand(5,22)); c.lineTo(px + rand(32,55), py + rand(35,60)); c.stroke();
  }
  for (let i = 0; i < 480; i++) { c.fillStyle = Math.random() < .3 ? '#8f7159' : '#343642'; c.fillRect(rand(0,512), rand(0,512), rand(1,3), rand(1,3)); }
  const t = new THREE.CanvasTexture(canvas); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(15,15); t.colorSpace = THREE.SRGBColorSpace; t.magFilter = THREE.NearestFilter; return t;
};
const guildEnemy: Record<'rat'|'cultist'|'brute'|'wisp', string> = { rat: 'rogue', cultist: 'necromancer', brute: 'warrior', wisp: 'alchemist' };
const atlasFrame = (path: string, frame: number) => {
  const texture = new THREE.TextureLoader().load(path); texture.repeat.set(.1, 1); texture.offset.set(frame / 10, 0);
  texture.magFilter = THREE.NearestFilter; texture.minFilter = THREE.NearestFilter;
  texture.colorSpace = THREE.SRGBColorSpace; return texture;
};
const nightmanTexture=()=>{
  const canvas=document.createElement('canvas');canvas.width=canvas.height=96;const c=canvas.getContext('2d')!;
  c.shadowColor='#d8bcff';c.shadowBlur=8;c.strokeStyle='#f1e3ff';c.lineWidth=3;
  c.fillStyle='#201027';c.beginPath();c.moveTo(48,5);c.bezierCurveTo(14,10,9,39,16,70);c.lineTo(8,91);c.lineTo(25,82);c.lineTo(37,91);c.lineTo(49,82);c.lineTo(61,91);c.lineTo(75,82);c.lineTo(88,91);c.lineTo(80,65);c.bezierCurveTo(87,35,72,9,48,5);c.closePath();c.fill();c.stroke();
  c.shadowBlur=0;c.fillStyle='#07050c';c.beginPath();c.ellipse(48,39,25,27,0,0,Math.PI*2);c.fill();
  c.shadowColor='#f6e7ff';c.shadowBlur=10;c.fillStyle='#f8edff';for(const x of [37,59]){c.beginPath();c.ellipse(x,39,6,3,0,0,Math.PI*2);c.fill();}
  c.strokeStyle='#b884db';c.lineWidth=2;c.beginPath();c.moveTo(36,58);c.quadraticCurveTo(48,65,61,57);c.stroke();
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.magFilter=THREE.NearestFilter;texture.minFilter=THREE.NearestFilter;return texture;
};

export class GameRenderer {
  host: HTMLElement;
  game: Game;
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-20,20,12,-12,.1,100);
  renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' });
  overlay = document.createElement('canvas');
  weaponVfx = new WeaponVfx(`${import.meta.env.BASE_URL}sprites/weapons/tankard.png`);
  ctx = this.overlay.getContext('2d')!;
  minimap: HTMLCanvasElement;
  player: THREE.Sprite;
  nightman: THREE.Sprite;
  enemyMeshes = new Map<string, THREE.InstancedMesh>();
  heroTextures: Record<string, THREE.Texture> = {};
  hamImage = new Image();
  heroAtlas = new Image();
  dummy = new THREE.Object3D();
  viewWidth = 40; viewHeight = 24;
  width = 1; height = 1;
  cameraX = WORLD / 2; cameraY = WORLD / 2;
  decorations: THREE.InstancedMesh;
  shrineMeshes: THREE.Mesh[] = [];
  resizeObserver: ResizeObserver;
  private profile = graphicsProfile('full', false, 1);
  private groups = new Map<string,number>();
  private enemyColor = new THREE.Color();
  private minimapElapsed = .1;
  setGraphics(mode: GraphicsMode) {
    this.profile = graphicsProfile(mode, matchMedia('(pointer:coarse)').matches, devicePixelRatio);
    this.resize();
  }
  private glow(amount:number){return this.profile.lean ? 0 : amount;}


  constructor(host: HTMLElement, game: Game, minimap: HTMLCanvasElement, mode: GraphicsMode = 'auto') {
    this.host = host; this.game = game; this.minimap = minimap;this.profile=graphicsProfile(mode,matchMedia('(pointer:coarse)').matches,devicePixelRatio);
    this.scene.background = new THREE.Color(game.level==='forest'?0x0b1713:game.level==='desert'?0x34251d:game.level==='ice'?0x172631:game.level==='lava'?0x210f13:0x101019);
    this.renderer.setPixelRatio(this.profile.webglRatio); this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.domElement.className = 'game-canvas'; host.append(this.renderer.domElement);
    this.overlay.className = 'fx-canvas'; host.append(this.overlay);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(WORLD, WORLD), new THREE.MeshBasicMaterial({ map: terrainTexture(game.level),color:game.level==='desert'?0xc6aa82:game.level==='ice'?0xb8c8d0:game.level==='lava'?0x9a6861:0xffffff }));
    floor.position.set(WORLD / 2, WORLD / 2, -2); this.scene.add(floor);
    const decoGeometry = new THREE.PlaneGeometry(game.level==='forest'?2.7:1.5,game.level==='forest'?2.7:1.5);
    const decoTexture = (() => { const c = document.createElement('canvas'); c.width=c.height=64; const g=c.getContext('2d')!;if(game.level==='forest'){g.fillStyle='#193322';g.beginPath();g.arc(32,32,23,0,6.28);g.fill();g.strokeStyle='#557f4d';g.lineWidth=4;g.beginPath();g.arc(32,32,20,0,6.28);g.stroke();g.fillStyle='#a0b56d';for(let i=0;i<6;i++){const a=i*Math.PI/3;g.fillRect(28+Math.cos(a)*19,28+Math.sin(a)*19,7,7);}}else{g.strokeStyle='#897759';g.lineWidth=4;g.beginPath();g.arc(32,32,23,0,6.28);g.moveTo(32,4);g.lineTo(32,60);g.moveTo(4,32);g.lineTo(60,32);g.stroke();g.fillStyle='#ae9c6b';g.fillRect(28,28,8,8);}const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t; })();
    const oldDecoCount=game.level==='desert'||game.level==='ice'||game.level==='lava'?0:280;
    this.decorations = new THREE.InstancedMesh(decoGeometry, new THREE.MeshBasicMaterial({map:decoTexture,transparent:true,opacity:.23,depthWrite:false}), oldDecoCount);
    for(let i=0;i<oldDecoCount;i++){this.dummy.position.set(rand(3,WORLD-3),rand(3,WORLD-3),-1.5);this.dummy.rotation.z=rand(0,6.28);this.dummy.updateMatrix();this.decorations.setMatrixAt(i,this.dummy.matrix);} this.decorations.instanceMatrix.needsUpdate=true;this.scene.add(this.decorations);
    if(game.obstacles.length){
      const desert=game.level==='desert';const count=game.obstacles.length;
      const texture=pixelTexture(`${import.meta.env.BASE_URL}terrain/${desert?'oasis-pool':'ice-wall'}.png`);
      const mesh=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:texture,color:desert?0xc6aa82:0xb8c8d0,transparent:true,alphaTest:.03,depthWrite:false}),count);
      for(let i=0;i<count;i++){
        const obstacle=game.obstacles[i],vertical=!desert&&obstacle.halfHeight>obstacle.halfWidth;
        // Water fills about 64% of the square decal; the sandy apron remains walkable.
        // The ice ridge fills about 83% × 41% of its transparent canvas.
        const long=desert?obstacle.radius*2/.64:Math.max(obstacle.halfWidth,obstacle.halfHeight)*2/.83;
        const short=desert?long:Math.min(obstacle.halfWidth,obstacle.halfHeight)*2/.41;
        this.dummy.position.set(obstacle.x,obstacle.y,-1.3);this.dummy.rotation.z=vertical?Math.PI/2:0;
        this.dummy.scale.set(long,short,1);this.dummy.updateMatrix();mesh.setMatrixAt(i,this.dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate=true;this.scene.add(mesh);
    }
    const border = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(1,1,-1),new THREE.Vector3(WORLD-1,1,-1),new THREE.Vector3(WORLD-1,WORLD-1,-1),new THREE.Vector3(1,WORLD-1,-1)]), new THREE.LineBasicMaterial({color:0xb28b63})); this.scene.add(border);
    const stoneCanvas=document.createElement('canvas');stoneCanvas.width=stoneCanvas.height=96;const sc=stoneCanvas.getContext('2d')!;if(game.level==='forest'){sc.fillStyle='#173023';sc.fillRect(14,14,68,68);sc.fillStyle='#467442';for(let i=0;i<7;i++){sc.beginPath();sc.ellipse(48+Math.cos(i*2.4)*20,48+Math.sin(i*2.4)*18,23,15,i,0,6.28);sc.fill();}sc.fillStyle='#83a561';sc.fillRect(41,41,14,14);}else{sc.fillStyle='#50505b';sc.fillRect(14,14,68,68);sc.fillStyle='#77717c';sc.fillRect(17,17,59,15);sc.fillStyle='#282832';sc.fillRect(17,69,59,8);sc.strokeStyle='#bca27e';sc.lineWidth=3;sc.strokeRect(14,14,68,68);sc.beginPath();sc.moveTo(27,18);sc.lineTo(43,46);sc.lineTo(32,71);sc.moveTo(63,17);sc.lineTo(54,41);sc.lineTo(70,64);sc.stroke();}const stoneTexture=new THREE.CanvasTexture(stoneCanvas);stoneTexture.colorSpace=THREE.SRGBColorSpace;
    if(game.level==='training'||game.level==='forest'){const ruins=new THREE.InstancedMesh(new THREE.PlaneGeometry(2.4,2.4),new THREE.MeshBasicMaterial({map:stoneTexture,transparent:true}),45);let ruinCount=0;for(let y=20;y<WORLD-12;y+=30)for(let x=18;x<WORLD-12;x+=30){if(Math.abs(x-90)<20&&Math.abs(y-90)<20)continue;this.dummy.position.set(x+rand(-4,4),y+rand(-4,4),-1);this.dummy.rotation.z=rand(-.5,.5);this.dummy.scale.set(rand(1,1.5),rand(1,1.5),1);this.dummy.updateMatrix();ruins.setMatrixAt(ruinCount++,this.dummy.matrix);}ruins.count=ruinCount;ruins.instanceMatrix.needsUpdate=true;this.scene.add(ruins);}
    const shrineCanvas=document.createElement('canvas');shrineCanvas.width=shrineCanvas.height=128;const sh=shrineCanvas.getContext('2d')!;sh.translate(64,64);sh.strokeStyle='#78ffc0';sh.lineWidth=4;sh.shadowColor='#63ffba';sh.shadowBlur=18;sh.beginPath();sh.arc(0,0,47,0,6.28);sh.stroke();sh.beginPath();sh.arc(0,0,32,0,6.28);sh.stroke();sh.fillStyle='#c0ffe0';sh.font='65px Georgia';sh.textAlign='center';sh.textBaseline='middle';sh.fillText('✚',0,3);const shrineTexture=new THREE.CanvasTexture(shrineCanvas);shrineTexture.colorSpace=THREE.SRGBColorSpace;
    for(const shrine of game.shrines){const base=new THREE.Mesh(new THREE.PlaneGeometry(5.6,5.6),new THREE.MeshBasicMaterial({map:shrineTexture,transparent:true,opacity:.78,depthWrite:false}));base.position.set(shrine.x,shrine.y,-.7);this.scene.add(base);this.shrineMeshes.push(base);for(let i=0;i<4;i++){const a=i*Math.PI/2+Math.PI/4;const stone=new THREE.Mesh(new THREE.PlaneGeometry(1.4,1.4),new THREE.MeshBasicMaterial({map:stoneTexture,transparent:true}));stone.position.set(shrine.x+Math.cos(a)*4,shrine.y+Math.sin(a)*4,-.6);stone.rotation.z=a;this.scene.add(stone);}}
    const loader=new THREE.TextureLoader();
    const guildKinds = game.level==='training' ? ['rat','cultist','brute','wisp'] as const : ['cultist','brute','wisp'] as const;
    for(const kind of guildKinds){for(const [side,frame] of [['left',2],['right',3]] as const){const mat=new THREE.MeshBasicMaterial({map:atlasFrame(`${import.meta.env.BASE_URL}sprites/characters/${guildEnemy[kind]}.png`,frame),transparent:true,depthWrite:false,side:THREE.DoubleSide});const mesh=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1),mat,ENEMY_CAP);mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);mesh.count=0;mesh.frustumCulled=false;this.enemyMeshes.set(`${kind}-${side}`,mesh);this.scene.add(mesh);}}
    const realmSprites=game.level==='forest'?[['rageipede',315],['xorn',3421],['efreeti',8883]]:game.level==='desert'?[['deathwisp',1201],['buraq',83]]:game.level==='ice'?[['chuul',9189],['dogmole',8965]]:game.level==='lava'?[['tosculi',3015],['seahag',5413],['hezrou',3112]]:[];
    for(const [kind,token] of realmSprites){const texture=pixelTexture(`${import.meta.env.BASE_URL}sprites/monsters/${kind}-${token}.png`,game.level==='lava');const mat=new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,side:THREE.DoubleSide});const mesh=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1),mat,ENEMY_CAP);mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);mesh.count=0;mesh.frustumCulled=false;this.enemyMeshes.set(String(kind),mesh);this.scene.add(mesh);}
    const moloch=loader.load(`${import.meta.env.BASE_URL}characters/moloch.png`);moloch.colorSpace=THREE.SRGBColorSpace;moloch.magFilter=THREE.NearestFilter;
    for(const side of ['left','right']){const mat=new THREE.MeshBasicMaterial({map:moloch,transparent:true,depthWrite:false,side:THREE.DoubleSide});const mesh=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1),mat,16);mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);mesh.count=0;mesh.frustumCulled=false;this.enemyMeshes.set(`boss-${side}`,mesh);this.scene.add(mesh);}
    for(const [name,frame] of Object.entries({left:2,right:3,'attack-left':6,'attack-right':7}))this.heroTextures[name]=atlasFrame(`${import.meta.env.BASE_URL}sprites/characters/${game.hero}.png`,frame);
    this.heroAtlas.src=`${import.meta.env.BASE_URL}sprites/characters/${game.hero}.png`;
    this.player = new THREE.Sprite(new THREE.SpriteMaterial({map:this.heroTextures.right,transparent:true,depthTest:false})); this.player.scale.set(2.05,2.58,1);this.player.position.z=3;this.scene.add(this.player);
    this.nightman=new THREE.Sprite(new THREE.SpriteMaterial({map:nightmanTexture(),transparent:true,depthTest:false,depthWrite:false}));this.nightman.scale.set(2.9,3.2,1);this.nightman.visible=false;this.scene.add(this.nightman);
    this.hamImage.src=`${import.meta.env.BASE_URL}sprites/items.png`;
    this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(host);this.resize();
  }
  resize(){this.width=this.host.clientWidth || 1;this.height=this.host.clientHeight || 1;this.renderer.setPixelRatio(this.profile.webglRatio);this.renderer.setSize(this.width,this.height);this.overlay.width=Math.max(1,Math.floor(this.width*this.profile.effectsRatio));this.overlay.height=Math.max(1,Math.floor(this.height*this.profile.effectsRatio));this.overlay.style.width=`${this.width}px`;this.overlay.style.height=`${this.height}px`;this.ctx.setTransform(this.profile.effectsRatio,0,0,this.profile.effectsRatio,0,0);this.viewHeight=this.width<700?31:25;this.viewWidth=this.viewHeight*this.width/this.height;this.camera.left=-this.viewWidth/2;this.camera.right=this.viewWidth/2;this.camera.top=this.viewHeight/2;this.camera.bottom=-this.viewHeight/2;this.camera.updateProjectionMatrix();}
  screen(x:number,y:number){return {x:(x-this.cameraX)/this.viewWidth*this.width+this.width/2,y:this.height/2-(y-this.cameraY)/this.viewHeight*this.height};}
  world(x:number,y:number){return {x:this.cameraX+(x-this.width/2)/this.width*this.viewWidth,y:this.cameraY-(y-this.height/2)/this.height*this.viewHeight};}
  render(dt:number, reducedMotion=false, presentedPlayer?:{x:number;y:number}){
    const p=this.game.player,shown=presentedPlayer??p;const follow=1-Math.exp(-7*dt);this.cameraX+=(shown.x-this.cameraX)*follow;this.cameraY+=(shown.y-this.cameraY)*follow;this.cameraX=Math.max(this.viewWidth/2,Math.min(WORLD-this.viewWidth/2,this.cameraX));this.cameraY=Math.max(this.viewHeight/2,Math.min(WORLD-this.viewHeight/2,this.cameraY));this.camera.position.set(this.cameraX,this.cameraY,50);this.camera.lookAt(this.cameraX,this.cameraY,0);
    const groups = this.groups;for(const key of this.enemyMeshes.keys())groups.set(key,0);
    for(const e of this.game.enemies){if(Math.abs(e.x-this.cameraX)>this.viewWidth/2+3||Math.abs(e.y-this.cameraY)>this.viewHeight/2+3)continue;const monster=['rageipede','xorn','efreeti','deathwisp','buraq','chuul','dogmole','tosculi','seahag','hezrou'].includes(e.kind);const key=monster?e.kind:`${e.kind}-${e.facing<0?'left':'right'}`;const mesh=this.enemyMeshes.get(key);if(!mesh)continue;const idx=groups.get(key)||0;if(idx>=mesh.instanceMatrix.count)continue;this.dummy.position.set(e.x,e.y,e.y/1000);const scale=(e.kind==='boss'?5.1:e.kind==='efreeti'?3.4:e.kind==='hezrou'?3.3:e.kind==='xorn'?2.8:e.kind==='buraq'||e.kind==='dogmole'?3.1:e.kind==='seahag'?2.2:e.kind==='brute'?2.2:e.kind==='rageipede'||e.kind==='deathwisp'||e.kind==='chuul'||e.kind==='tosculi'?1.45:1.65)*(e.elite?1.35:1)*(e.kind==='buraq'?1+.14*Math.sin(this.game.elapsed*3+e.phase):1);const aspect=e.kind==='tosculi'||e.kind==='seahag'?1374/1145:1;this.dummy.scale.set(((monster||e.kind==='boss')&&e.facing<0?-scale:scale)*aspect,scale,1);this.dummy.rotation.z=e.kind==='wisp'||e.kind==='efreeti'||e.kind==='buraq'?Math.sin(this.game.elapsed*4+e.phase)*.12:0;this.dummy.updateMatrix();mesh.setMatrixAt(idx,this.dummy.matrix);mesh.setColorAt(idx,this.enemyColor.setHex(e.frozen>0?0xb7eaff:e.special==='stalker'&&e.specialState==='idle'&&e.specialCd<1?0x566a6c:e.special==='devourer'&&e.specialState==='charge'?0x91bcff:e.flash>0?0xffffff:e.special==='hexcaster'?0xff82dc:e.special==='juggernaut'?0xffc36d:e.kind==='boss'&&e.tier===3?0xff8e78:e.kind==='boss'&&e.tier===2?0xffba90:e.elite?0xffd69d:0xffffff));groups.set(key,idx+1);}
    for(const [kind,mesh] of this.enemyMeshes){uploadVisibleInstances(mesh,groups.get(kind)||0);}
    for(let i=0;i<this.shrineMeshes.length;i++){const mat=this.shrineMeshes[i].material as THREE.MeshBasicMaterial;mat.opacity=this.game.shrines[i].active?.78:.17;this.shrineMeshes[i].position.x=this.game.shrines[i].x;this.shrineMeshes[i].position.y=this.game.shrines[i].y;this.shrineMeshes[i].rotation.z+=dt*.15;}
    const dying=this.game.dead&&this.game.deathReason==='combat';
    this.player.visible=!dying||reducedMotion;
    this.player.position.set(shown.x,dying?shown.y:shown.y+Math.sin(this.game.elapsed*6)*.08,4);
    this.player.material.map=this.heroTextures[`${(dying?this.game.deathFiring:this.game.firing)?'attack-':''}${(dying?this.game.deathFacing:this.game.facing)<0?'left':'right'}`];
    this.player.material.color.setHex(dying?0xffffff:p.invuln>0&&Math.floor(this.game.elapsed*18)%2?0xff718c:0xffffff);
    this.player.material.opacity=dying&&reducedMotion?Math.max(0,1-this.game.deathProgress):1;
    const hunter=this.game.nightman;this.nightman.visible=!!hunter;if(hunter){this.nightman.position.set(hunter.x,hunter.y,5);this.nightman.material.opacity=hunter.warningRemaining>0?(reducedMotion?.6:.45+.2*Math.sin(this.game.elapsed*15)):1;}
    this.renderer.render(this.scene,this.camera);this.drawFx(reducedMotion,shown.x,shown.y);this.minimapElapsed+=dt;if(this.minimapElapsed>=.1){this.minimapElapsed%=.1;this.drawMinimap();}
  }
  private drawFx(reducedMotion:boolean,playerX:number,playerY:number){
    const c=this.ctx;c.clearRect(0,0,this.width,this.height);const scale=this.width/this.viewWidth;
    for(const b of this.game.projectiles){const s=this.screen(b.x,b.y);if(s.x<-40||s.x>this.width+40||s.y<-40||s.y>this.height+40)continue;this.weaponVfx.drawProjectile(c,b,s.x,s.y,scale,this.game.elapsed,reducedMotion,this.profile.lean);}
    for(const shot of this.game.enemyShots){const s=this.screen(shot.x,shot.y);if(s.x<-20||s.x>this.width+20||s.y<-20||s.y>this.height+20)continue;c.fillStyle=shot.boss?'#ffb079':shot.seaHag==='green'?'#99ebaa':shot.seaHag==='amber'?'#ffbd78':shot.poison?'#84e9a2':'#f2a1d8';c.shadowColor=c.fillStyle;c.shadowBlur=this.glow(17);c.beginPath();c.arc(s.x,s.y,Math.max(3,shot.radius*scale),0,6.28);c.fill();c.shadowBlur=0;}
    for(const item of this.game.pickups){const s=this.screen(item.x,item.y);if(s.x<-20||s.x>this.width+20||s.y<-20||s.y>this.height+20)continue;const color=item.kind==='xp'?'#8df3cb':item.kind==='heart'?'#94ffb3':'#ffd277';const size=item.kind==='chest'?12:5;c.fillStyle=color;c.shadowColor=color;c.shadowBlur=this.glow(item.kind==='chest'?20:9);c.beginPath();if(item.kind==='heart'&&this.hamImage.complete&&this.hamImage.naturalWidth){c.drawImage(this.hamImage,0,0,48,48,s.x-17,s.y-17,34,34);}else if(item.kind==='chest'){c.fillRect(s.x-size,s.y-size,size*2,size*2);c.fillStyle='#4b2e42';c.fillRect(s.x-4,s.y-8,8,13);}else{c.arc(s.x,s.y,size,0,6.28);c.fill();}c.shadowBlur=0;}
    for(const shrine of this.game.shrines){if(!shrine.active)continue;const s=this.screen(shrine.x,shrine.y);if(s.x<0||s.x>this.width||s.y<0||s.y>this.height)continue;c.fillStyle='#baffd1';c.shadowColor='#63ffba';c.shadowBlur=this.glow(16);c.font='900 10px Cinzel,Georgia,serif';c.textAlign='center';c.fillText('✚ HEAL + XP',s.x,s.y-45);c.shadowBlur=0;}
    if(this.game.bombWave){const wave=this.game.bombWave;const center=this.screen(playerX,playerY);c.save();c.strokeStyle=({ranger:'#8ff8b0',wizard:'#a9c9ff',dwarf:'#ffca8d',warrior:'#ff987d','tavern-keeper':'#ffe194'} as const)[this.game.hero];c.lineWidth=7;c.shadowColor=c.strokeStyle;c.shadowBlur=this.glow(28);c.globalAlpha=.9-wave.age*.7;c.beginPath();const arc=this.game.perk?.bombArcDegrees;if(arc){const direction=-Math.atan2(wave.aimY,wave.aimX),half=arc*Math.PI/360;c.arc(center.x,center.y,wave.radius*scale,direction-half,direction+half);}else c.arc(center.x,center.y,wave.radius*scale,0,Math.PI*2);c.stroke();c.restore();}
    const dying=this.game.dead&&this.game.deathReason==='combat';
    const p=this.screen(playerX,playerY);
    if(!dying){c.strokeStyle='rgba(159,240,194,.55)';c.lineWidth=2;c.beginPath();c.ellipse(p.x,p.y+19,20,6,0,0,6.28);c.stroke();if(this.game.player.dashCooldown<=0){c.strokeStyle='rgba(171,255,207,.7)';c.beginPath();c.arc(p.x,p.y,26,0,6.28);c.stroke();}}
    if(!dying&&this.game.weapons.orbit&&this.game.slots.includes('orbit')){const rank=this.game.weapons.orbit;const blades=2+rank;for(let i=0;i<blades;i++){const a=this.game.elapsed*(2.7+rank*.15)+i*6.28/blades;const s=this.screen(playerX+Math.cos(a)*(2.2+rank*.2),playerY+Math.sin(a)*(2.2+rank*.2));c.save();c.translate(s.x,s.y);c.rotate(a);c.fillStyle='#ffe5a4';c.shadowColor='#ffd071';c.shadowBlur=this.glow(17);c.beginPath();c.moveTo(0,-12);c.lineTo(5,0);c.lineTo(0,12);c.closePath();c.fill();c.restore();}}
    if(dying&&this.player.visible===false)this.drawDeath(c,p.x,p.y,scale);
    for(const effect of this.game.effects){const s=this.screen(effect.x,effect.y);const progress=1-effect.life/effect.max;
      const to=effect.kind==='zap'&&effect.x2!==undefined&&effect.y2!==undefined?this.screen(effect.x2,effect.y2):s;
      const margin=Math.max(60,effect.size*scale*1.4+24);
      if(Math.max(s.x,to.x)+margin<0||Math.min(s.x,to.x)-margin>this.width||Math.max(s.y,to.y)+margin<0||Math.min(s.y,to.y)-margin>this.height)continue;
      if(this.weaponVfx.drawEffect(c,effect,s.x,s.y,scale,reducedMotion))continue;
      c.globalAlpha=Math.max(0,effect.life/effect.max);c.strokeStyle=hex(effect.color);c.fillStyle=hex(effect.color);c.shadowColor=hex(effect.color);c.shadowBlur=this.glow(20);c.lineWidth=3;
      if(effect.kind==='zap'&&effect.x2!==undefined&&effect.y2!==undefined){const to=this.screen(effect.x2,effect.y2);c.beginPath();c.moveTo(s.x,s.y);const midX=(s.x+to.x)/2,midY=(s.y+to.y)/2;c.lineTo(midX+rand(-8,8),midY+rand(-8,8));c.lineTo(to.x,to.y);c.stroke();}
      else if(effect.kind==='ring'||effect.kind==='comet'){c.beginPath();c.arc(s.x,s.y,Math.max(1,effect.size*scale*(effect.kind==='comet'?1-progress*.25:progress)),0,6.28);c.stroke();if(effect.kind==='comet'){c.fillStyle='rgba(255,145,101,.11)';c.fill();}}
      else if(effect.kind==='text'){c.font='900 22px Cinzel, Georgia, serif';c.textAlign='center';c.fillText(effect.text||'',s.x,s.y-progress*45);}
      else {c.beginPath();c.arc(s.x,s.y,effect.size*scale*(.3+progress),0,6.28);c.fill();}
    }c.globalAlpha=1;c.shadowBlur=0;
    this.drawWarnings(c,scale);
    for(const e of this.game.enemies){if((!e.elite&&e.kind!=='boss'&&e.kind!=='seahag'&&e.kind!=='hezrou')||e.hp<=0)continue;const s=this.screen(e.x,e.y);if(s.x<0||s.x>this.width||s.y<0||s.y>this.height)continue;const w=e.kind==='boss'?125:e.special?75:36;c.fillStyle='#2c1c29';c.fillRect(s.x-w/2,s.y-45,w,7);c.fillStyle=e.kind==='boss'?'#f4bd76':e.special==='hexcaster'?'#ff75d5':'#ffbd68';c.fillRect(s.x-w/2,s.y-45,w*e.hp/e.maxHp,7);if(e.kind==='boss'||e.special){c.font=`900 ${e.kind==='boss'?12:10}px Cinzel,Georgia,serif`;c.textAlign='center';c.fillStyle=e.special==='hexcaster'?'#ffc0ed':'#ffe2b4';const label=e.kind==='seahag'?'SEA HAG':['rageipede','xorn','efreeti','deathwisp','buraq','chuul','dogmole','hezrou'].includes(e.kind)?e.kind.toUpperCase():e.special==='hexcaster'?'HEXCASTER':e.special==='juggernaut'?'JUGGERNAUT':e.tier===3?'MOLOCH UNBOUND':e.tier===2?'ASCENDED MOLOCH':'MOLOCH';c.fillText(label,s.x,s.y-51);}}
    this.drawNightmanArrow(c);
  }
  private drawNightmanArrow(c:CanvasRenderingContext2D){
    const hunter=this.game.nightman;if(!hunter)return;
    const target=this.screen(hunter.x,hunter.y),margin=42;
    if(target.x>=margin&&target.x<=this.width-margin&&target.y>=margin&&target.y<=this.height-margin)return;
    const dx=target.x-this.width/2,dy=target.y-this.height/2;
    const fraction=Math.min((this.width/2-margin)/Math.max(1,Math.abs(dx)),(this.height/2-margin)/Math.max(1,Math.abs(dy)));
    const x=this.width/2+dx*fraction,y=this.height/2+dy*fraction,angle=Math.atan2(dy,dx);
    c.save();c.translate(x,y);c.rotate(angle);c.fillStyle='#f2d6ff';c.strokeStyle='#2b073a';c.lineWidth=3;c.beginPath();c.moveTo(17,0);c.lineTo(-8,-10);c.lineTo(-8,10);c.closePath();c.fill();c.stroke();c.restore();
    c.save();c.fillStyle='#f2d6ff';c.strokeStyle='#16071d';c.lineWidth=3;c.font='900 10px Cinzel,Georgia,serif';c.textAlign='center';const labelX=Math.max(45,Math.min(this.width-45,x-Math.cos(angle)*38)),labelY=Math.max(14,Math.min(this.height-10,y-Math.sin(angle)*38));c.strokeText('NIGHTMAN',labelX,labelY);c.fillText('NIGHTMAN',labelX,labelY);c.restore();
  }
  private drawWarnings(c:CanvasRenderingContext2D,scale:number){
    // Gameplay warnings are drawn after cosmetic effects, with fixed-position
    // geometry and timer-based progress that also works in reduced motion.
    for(const hazard of this.game.hazards){
      const s=this.screen(hazard.x,hazard.y),radius=hazard.radius*scale;
      if(hazard.kind==='lane'){
        const end=this.screen(hazard.x2??hazard.x,hazard.y2??hazard.y);
        if(Math.max(s.x,end.x)<-radius||Math.min(s.x,end.x)>this.width+radius||Math.max(s.y,end.y)<-radius||Math.min(s.y,end.y)>this.height+radius)continue;
        c.save();c.lineCap='round';c.strokeStyle='rgba(255,118,75,.28)';c.lineWidth=radius*2;c.beginPath();c.moveTo(s.x,s.y);c.lineTo(end.x,end.y);c.stroke();
        c.strokeStyle='#ffba84';c.lineWidth=3;c.beginPath();c.moveTo(s.x,s.y);c.lineTo(end.x,end.y);c.stroke();
        c.fillStyle='#fff1cc';c.font='900 10px Cinzel,Georgia,serif';c.textAlign='center';c.fillText('FIERY LANE',end.x,end.y-14);
        c.strokeStyle='#fff1cc';c.lineWidth=4;c.beginPath();c.arc(s.x,s.y,radius+8,-Math.PI/2,-Math.PI/2+2*Math.PI*Math.max(0,hazard.delay/hazard.duration));c.stroke();c.restore();continue;
      }
      if(s.x+radius<0||s.x-radius>this.width||s.y+radius<0||s.y-radius>this.height)continue;
      const color=hazard.kind==='hex'?'#ff78d2':hazard.kind==='ground'?'#a2def3':'#ffad70';
      c.save();c.fillStyle=hazard.kind==='hex'?'rgba(231,75,187,.26)':hazard.kind==='ground'?'rgba(123,208,233,.28)':'rgba(255,129,72,.29)';
      c.strokeStyle=color;c.lineWidth=2;c.shadowColor=color;c.shadowBlur=this.glow(12);
      c.beginPath();c.arc(s.x,s.y,radius,0,Math.PI*2);c.fill();c.stroke();
      c.shadowBlur=0;c.lineWidth=5;c.beginPath();c.arc(s.x,s.y,radius+7,-Math.PI/2,-Math.PI/2+2*Math.PI*Math.max(0,hazard.delay/hazard.duration));c.stroke();c.restore();
    }
    for(const e of this.game.enemies){if(e.kind!=='efreeti'||(e.specialState!=='windup'&&e.specialState!=='charge'))continue;const s=this.screen(e.x,e.y);if(s.x<-70||s.x>this.width+70||s.y<-70||s.y>this.height+70)continue;c.save();c.strokeStyle=e.specialState==='charge'?'#9ad6ff':'#ffe2a4';c.fillStyle='rgba(123,182,222,.16)';c.lineWidth=3;c.beginPath();c.arc(s.x,s.y,Math.max(17,e.radius*scale*1.5),0,6.28);c.fill();c.stroke();c.fillStyle='#eff7ff';c.font='900 10px Cinzel,Georgia,serif';c.textAlign='center';c.fillText(e.specialState==='charge'?'INGESTING MAGIC':'WARD CHARGING',s.x,s.y-58);c.restore();}
    for(const e of this.game.enemies){if(e.special!=='seahagfan'||e.specialState!=='windup')continue;const s=this.screen(e.x,e.y);if(s.x<-7*scale||s.x>this.width+7*scale||s.y<-7*scale||s.y>this.height+7*scale)continue;const target=this.screen(e.targetX,e.targetY),angle=Math.atan2(target.y-s.y,target.x-s.x),green=e.attackPhase%2===0;c.save();c.fillStyle=green?'rgba(128,238,163,.18)':'rgba(255,182,97,.2)';c.strokeStyle=green?'#9cf2b2':'#ffca8c';c.lineWidth=2;c.beginPath();c.moveTo(s.x,s.y);c.arc(s.x,s.y,7*scale,angle-.48,angle+.48);c.closePath();c.fill();c.stroke();c.fillStyle='#fff1d2';c.font='900 10px Cinzel,Georgia,serif';c.textAlign='center';c.fillText('BREATH FAN',s.x,s.y-30);c.restore();}
    for(const e of this.game.enemies){if(e.specialState!=='windup'||(e.special!=='jaunt'&&e.special!=='poisonfan'))continue;const from=this.screen(e.x,e.y);let tx=e.targetX,ty=e.targetY;if(e.special==='jaunt'){const dx=tx-e.x,dy=ty-e.y,len=Math.hypot(dx,dy)||1,travel=Math.min(3,Math.max(0,len-1.5));tx=e.x+dx/len*travel;ty=e.y+dy/len*travel;const hit=emptyHit();sweepObstacles(this.game.level,e.x,e.y,tx-e.x,ty-e.y,e.radius,false,hit);if(hit.hit){tx=e.x+(tx-e.x)*Math.max(0,hit.t-.0001);ty=e.y+(ty-e.y)*Math.max(0,hit.t-.0001);}}const to=this.screen(tx,ty);if(from.x<-100||from.x>this.width+100||from.y<-100||from.y>this.height+100)continue;c.save();c.strokeStyle=e.special==='jaunt'?'#b7edff':'#91f4b6';c.fillStyle=e.special==='jaunt'?'rgba(128,204,245,.2)':'rgba(92,216,130,.23)';c.lineWidth=3;c.shadowColor=c.strokeStyle;c.shadowBlur=this.glow(10);c.beginPath();c.moveTo(from.x,from.y);c.lineTo(to.x,to.y);c.stroke();c.beginPath();c.arc(to.x,to.y,(e.special==='jaunt'?1.4:2)*scale,0,6.28);c.fill();c.stroke();c.restore();}
    for(const e of this.game.enemies){
      if(!['juggernaut','pouncer','stalker'].includes(e.special||'')||e.specialState!=='windup')continue;
      const capsule=chargeCapsule(e,this.game.level),from=this.screen(capsule.x1,capsule.y1),end=this.screen(capsule.x2,capsule.y2);
      const angle=Math.atan2(end.y-from.y,end.x-from.x),radius=capsule.radius*scale;
      c.save();c.fillStyle=e.special==='stalker'?'rgba(137,166,194,.29)':e.special==='pouncer'?'rgba(150,217,115,.28)':'rgba(255,165,72,.29)';c.strokeStyle=e.special==='stalker'?'#b9d5ef':e.special==='pouncer'?'#c5f595':'#ffbf69';c.lineWidth=2;c.shadowColor=c.strokeStyle;c.shadowBlur=this.glow(9);
      c.beginPath();c.moveTo(from.x-Math.sin(angle)*radius,from.y+Math.cos(angle)*radius);
      c.lineTo(end.x-Math.sin(angle)*radius,end.y+Math.cos(angle)*radius);
      c.arc(end.x,end.y,radius,angle+Math.PI/2,angle-Math.PI/2,true);
      c.lineTo(from.x+Math.sin(angle)*radius,from.y-Math.cos(angle)*radius);
      c.arc(from.x,from.y,radius,angle-Math.PI/2,angle+Math.PI/2,true);
      c.closePath();c.fill();c.stroke();
      c.shadowBlur=0;c.strokeStyle='#fff0bf';c.lineWidth=5;c.beginPath();
      c.arc(from.x,from.y,radius+7,-Math.PI/2,-Math.PI/2+2*Math.PI*Math.max(0,e.specialTimer/(e.special==='pouncer'?.5:e.special==='stalker'?.75:.9)));c.stroke();c.restore();
    }
  }
  private drawDeath(c:CanvasRenderingContext2D,x:number,y:number,scale:number){
    const image=this.heroAtlas,progress=Math.max(0,Math.min(1,this.game.deathProgress));
    if(progress>=1||!image.complete||!image.naturalWidth)return;
    const frame=this.game.deathFiring?(this.game.deathFacing<0?6:7):(this.game.deathFacing<0?2:3);
    const width=2.05*scale,height=2.58*scale,left=x-width/2,top=y-height/2;
    const stripCount=18,stripSource=68/stripCount;
    c.save();
    c.imageSmoothingEnabled=false;
    // The source atlas is sliced into horizontal pixel rows. Lower rows sag and pool at the feet.
    for(let i=0;i<stripCount;i++){
      const row=i/stripCount,fall=Math.min(1,Math.max(0,(progress-row*.33)/.67));
      const srcY=i*stripSource,destY=top+row*height+fall*fall*height*(.28+.32*row);
      const alpha=Math.max(0,1-Math.max(0,(progress-.42-row*.16)*1.8))*Math.min(1,(1-progress)/.22);
      if(alpha<=0)continue;
      c.globalAlpha=alpha;
      const shear=Math.sin(i*13.7)*progress*width*.13;
      c.drawImage(image,frame*54,srcY,54,stripSource,left+shear,destY,width,height/stripCount+1);
    }
    const fragments=28;
    for(let i=0;i<fragments;i++){
      const trigger=(i%11)/17;
      if(progress<trigger||progress>.94)continue;
      const drift=(progress-trigger)/(.94-trigger),sx=(i*17)%50,sy=(i*29)%62;
      const px=left+(sx/54)*width+(Math.sin(i*47.1)*.5)*drift*width;
      const py=top+(sy/68)*height+drift*drift*height*.72;
      c.globalAlpha=Math.max(0,1-drift*.95);
      c.drawImage(image,frame*54+sx,sy,4,4,px,py,Math.max(2,width*4/54),Math.max(2,height*4/68));
    }
    c.globalAlpha=Math.max(0,Math.sin(progress*Math.PI))*.7;
    c.fillStyle=({ranger:'#5bba81',wizard:'#806fd1',dwarf:'#c18a55',warrior:'#c85c50','tavern-keeper':'#c9a15b'} as const)[this.game.hero];
    c.beginPath();c.ellipse(x,y+height*.48,width*(.15+progress*.43),height*.06,0,0,Math.PI*2);c.fill();
    c.restore();
  }
  private drawMinimap(){const c=this.minimap.getContext('2d')!;const w=this.minimap.width,h=this.minimap.height;c.fillStyle='#171722';c.fillRect(0,0,w,h);c.strokeStyle='#8a7360';c.strokeRect(1,1,w-2,h-2);c.fillStyle=this.game.level==='desert'?'#347b78':'#658d9f';for(const obstacle of this.game.obstacles){const x=obstacle.x/WORLD*w,y=(1-obstacle.y/WORLD)*h;if(obstacle.shape==='circle'){c.beginPath();c.arc(x,y,Math.max(2,obstacle.radius/WORLD*w),0,6.28);c.fill();}else c.fillRect(x-obstacle.halfWidth/WORLD*w,y-obstacle.halfHeight/WORLD*h,obstacle.halfWidth*2/WORLD*w,obstacle.halfHeight*2/WORLD*h);}c.fillStyle='#80ffc0';for(const shrine of this.game.shrines)if(shrine.active){const x=shrine.x/WORLD*w,y=(1-shrine.y/WORLD)*h;c.fillRect(x-1,y-4,3,9);c.fillRect(x-4,y-1,9,3);}c.fillStyle='#e47786';for(const e of this.game.enemies){if(e.kind==='boss'||e.elite){c.beginPath();c.arc(e.x/WORLD*w,(1-e.y/WORLD)*h,e.kind==='boss'?3:1.5,0,6.28);c.fill();}}const p=this.game.player;c.fillStyle='#aff3c6';c.beginPath();c.arc(p.x/WORLD*w,(1-p.y/WORLD)*h,3,0,6.28);c.fill();c.strokeStyle='#aaffd0';c.strokeRect((this.cameraX-this.viewWidth/2)/WORLD*w,(1-(this.cameraY+this.viewHeight/2)/WORLD)*h,this.viewWidth/WORLD*w,this.viewHeight/WORLD*h);}
  dispose(){this.weaponVfx.dispose();this.resizeObserver.disconnect();this.scene.traverse(node=>{if(node instanceof THREE.Mesh || node instanceof THREE.InstancedMesh || node instanceof THREE.LineLoop || node instanceof THREE.Sprite){node.geometry?.dispose();const materials=Array.isArray(node.material)?node.material:[node.material];for(const material of materials){if('map' in material && material.map instanceof THREE.Texture) material.map.dispose();material.dispose();}}});for(const texture of Object.values(this.heroTextures))texture.dispose();this.renderer.dispose();this.renderer.forceContextLoss();this.host.replaceChildren();}
}
