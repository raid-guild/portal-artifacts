import * as THREE from 'three';
import { chargeCapsule, ENEMY_CAP, Game, WORLD, WEAPONS, type EnemyKind } from './game';

const hex = (n: number) => `#${n.toString(16).padStart(6, '0')}`;
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const terrainTexture = () => {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 512;
  const c = canvas.getContext('2d')!; c.fillStyle = '#191923'; c.fillRect(0, 0, 512, 512);
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
    const px = x * 64, py = y * 64; c.fillStyle = (x + y) % 2 ? '#20212b' : '#242630'; c.fillRect(px + 2, py + 2, 60, 60);
    c.strokeStyle = '#383744'; c.lineWidth = 1; c.strokeRect(px + 2.5, py + 2.5, 59, 59);
    c.strokeStyle = 'rgba(255,211,143,.05)'; c.beginPath(); c.moveTo(px + rand(8,25), py + rand(5,22)); c.lineTo(px + rand(32,55), py + rand(35,60)); c.stroke();
  }
  for (let i = 0; i < 480; i++) { c.fillStyle = Math.random() < .3 ? '#8f7159' : '#343642'; c.fillRect(rand(0,512), rand(0,512), rand(1,3), rand(1,3)); }
  const t = new THREE.CanvasTexture(canvas); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(15,15); t.colorSpace = THREE.SRGBColorSpace; t.magFilter = THREE.NearestFilter; return t;
};
const guildEnemy: Record<Exclude<EnemyKind, 'boss'>, string> = { rat: 'rogue', cultist: 'necromancer', brute: 'warrior', wisp: 'alchemist' };
const atlasFrame = (path: string, frame: number) => {
  const texture = new THREE.TextureLoader().load(path); texture.repeat.set(.1, 1); texture.offset.set(frame / 10, 0);
  texture.magFilter = THREE.NearestFilter; texture.minFilter = THREE.NearestFilter;
  texture.colorSpace = THREE.SRGBColorSpace; texture.needsUpdate = true; return texture;
};

export class GameRenderer {
  host: HTMLElement;
  game: Game;
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-20,20,12,-12,.1,100);
  renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' });
  overlay = document.createElement('canvas');
  ctx = this.overlay.getContext('2d')!;
  minimap: HTMLCanvasElement;
  player: THREE.Sprite;
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

  constructor(host: HTMLElement, game: Game, minimap: HTMLCanvasElement) {
    this.host = host; this.game = game; this.minimap = minimap;
    this.scene.background = new THREE.Color(0x101019);
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7)); this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.domElement.className = 'game-canvas'; host.append(this.renderer.domElement);
    this.overlay.className = 'fx-canvas'; host.append(this.overlay);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(WORLD, WORLD), new THREE.MeshBasicMaterial({ map: terrainTexture() }));
    floor.position.set(WORLD / 2, WORLD / 2, -2); this.scene.add(floor);
    const decoGeometry = new THREE.PlaneGeometry(1.5,1.5);
    const decoTexture = (() => { const c = document.createElement('canvas'); c.width=c.height=64; const g=c.getContext('2d')!; g.strokeStyle='#897759'; g.lineWidth=4; g.beginPath();g.arc(32,32,23,0,6.28);g.moveTo(32,4);g.lineTo(32,60);g.moveTo(4,32);g.lineTo(60,32);g.stroke();g.fillStyle='#ae9c6b';g.fillRect(28,28,8,8); const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t; })();
    this.decorations = new THREE.InstancedMesh(decoGeometry, new THREE.MeshBasicMaterial({map:decoTexture,transparent:true,opacity:.23,depthWrite:false}), 280);
    for(let i=0;i<280;i++){this.dummy.position.set(rand(3,WORLD-3),rand(3,WORLD-3),-1.5);this.dummy.rotation.z=rand(0,6.28);this.dummy.updateMatrix();this.decorations.setMatrixAt(i,this.dummy.matrix);} this.decorations.instanceMatrix.needsUpdate=true;this.scene.add(this.decorations);
    const border = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(1,1,-1),new THREE.Vector3(WORLD-1,1,-1),new THREE.Vector3(WORLD-1,WORLD-1,-1),new THREE.Vector3(1,WORLD-1,-1)]), new THREE.LineBasicMaterial({color:0xb28b63})); this.scene.add(border);
    const stoneCanvas=document.createElement('canvas');stoneCanvas.width=stoneCanvas.height=96;const sc=stoneCanvas.getContext('2d')!;sc.fillStyle='#50505b';sc.fillRect(14,14,68,68);sc.fillStyle='#77717c';sc.fillRect(17,17,59,15);sc.fillStyle='#282832';sc.fillRect(17,69,59,8);sc.strokeStyle='#bca27e';sc.lineWidth=3;sc.strokeRect(14,14,68,68);sc.beginPath();sc.moveTo(27,18);sc.lineTo(43,46);sc.lineTo(32,71);sc.moveTo(63,17);sc.lineTo(54,41);sc.lineTo(70,64);sc.stroke();const stoneTexture=new THREE.CanvasTexture(stoneCanvas);stoneTexture.colorSpace=THREE.SRGBColorSpace;
    const ruins=new THREE.InstancedMesh(new THREE.PlaneGeometry(2.4,2.4),new THREE.MeshBasicMaterial({map:stoneTexture,transparent:true}),45);let ruinCount=0;for(let y=20;y<WORLD-12;y+=30)for(let x=18;x<WORLD-12;x+=30){if(Math.abs(x-90)<20&&Math.abs(y-90)<20)continue;this.dummy.position.set(x+rand(-4,4),y+rand(-4,4),-1);this.dummy.rotation.z=rand(-.5,.5);this.dummy.scale.set(rand(1,1.5),rand(1,1.5),1);this.dummy.updateMatrix();ruins.setMatrixAt(ruinCount++,this.dummy.matrix);}ruins.count=ruinCount;ruins.instanceMatrix.needsUpdate=true;this.scene.add(ruins);
    const shrineCanvas=document.createElement('canvas');shrineCanvas.width=shrineCanvas.height=128;const sh=shrineCanvas.getContext('2d')!;sh.translate(64,64);sh.strokeStyle='#78ffc0';sh.lineWidth=4;sh.shadowColor='#63ffba';sh.shadowBlur=18;sh.beginPath();sh.arc(0,0,47,0,6.28);sh.stroke();sh.beginPath();sh.arc(0,0,32,0,6.28);sh.stroke();sh.fillStyle='#c0ffe0';sh.font='65px Georgia';sh.textAlign='center';sh.textBaseline='middle';sh.fillText('✚',0,3);const shrineTexture=new THREE.CanvasTexture(shrineCanvas);shrineTexture.colorSpace=THREE.SRGBColorSpace;
    for(const shrine of game.shrines){const base=new THREE.Mesh(new THREE.PlaneGeometry(5.6,5.6),new THREE.MeshBasicMaterial({map:shrineTexture,transparent:true,opacity:.78,depthWrite:false}));base.position.set(shrine.x,shrine.y,-.7);this.scene.add(base);this.shrineMeshes.push(base);for(let i=0;i<4;i++){const a=i*Math.PI/2+Math.PI/4;const stone=new THREE.Mesh(new THREE.PlaneGeometry(1.4,1.4),new THREE.MeshBasicMaterial({map:stoneTexture,transparent:true}));stone.position.set(shrine.x+Math.cos(a)*4,shrine.y+Math.sin(a)*4,-.6);stone.rotation.z=a;this.scene.add(stone);}}
    const loader=new THREE.TextureLoader();
    for(const kind of ['rat','cultist','brute','wisp'] as const){for(const [side,frame] of [['left',2],['right',3]] as const){const mat=new THREE.MeshBasicMaterial({map:atlasFrame(`${import.meta.env.BASE_URL}sprites/characters/${guildEnemy[kind]}.png`,frame),transparent:true,depthWrite:false,side:THREE.DoubleSide});const mesh=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1),mat,ENEMY_CAP);mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);mesh.count=0;mesh.frustumCulled=false;this.enemyMeshes.set(`${kind}-${side}`,mesh);this.scene.add(mesh);}}
    const moloch=loader.load(`${import.meta.env.BASE_URL}characters/moloch.png`);moloch.colorSpace=THREE.SRGBColorSpace;moloch.magFilter=THREE.NearestFilter;
    for(const side of ['left','right']){const mat=new THREE.MeshBasicMaterial({map:moloch,transparent:true,depthWrite:false,side:THREE.DoubleSide});const mesh=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1),mat,16);mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);mesh.count=0;mesh.frustumCulled=false;this.enemyMeshes.set(`boss-${side}`,mesh);this.scene.add(mesh);}
    for(const [name,frame] of Object.entries({left:2,right:3,'attack-left':6,'attack-right':7}))this.heroTextures[name]=atlasFrame(`${import.meta.env.BASE_URL}sprites/characters/${game.hero}.png`,frame);
    this.heroAtlas.src=`${import.meta.env.BASE_URL}sprites/characters/${game.hero}.png`;
    this.player = new THREE.Sprite(new THREE.SpriteMaterial({map:this.heroTextures.right,transparent:true,depthTest:false})); this.player.scale.set(2.05,2.58,1);this.player.position.z=3;this.scene.add(this.player);
    this.hamImage.src=`${import.meta.env.BASE_URL}sprites/items.png`;
    this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(host);this.resize();
  }
  resize(){this.width=this.host.clientWidth || 1;this.height=this.host.clientHeight || 1;this.renderer.setSize(this.width,this.height);this.overlay.width=Math.floor(this.width*devicePixelRatio);this.overlay.height=Math.floor(this.height*devicePixelRatio);this.overlay.style.width=`${this.width}px`;this.overlay.style.height=`${this.height}px`;this.ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);this.viewHeight=this.width<700?31:25;this.viewWidth=this.viewHeight*this.width/this.height;this.camera.left=-this.viewWidth/2;this.camera.right=this.viewWidth/2;this.camera.top=this.viewHeight/2;this.camera.bottom=-this.viewHeight/2;this.camera.updateProjectionMatrix();}
  screen(x:number,y:number){return {x:(x-this.cameraX)/this.viewWidth*this.width+this.width/2,y:this.height/2-(y-this.cameraY)/this.viewHeight*this.height};}
  world(x:number,y:number){return {x:this.cameraX+(x-this.width/2)/this.width*this.viewWidth,y:this.cameraY-(y-this.height/2)/this.height*this.viewHeight};}
  render(dt:number, reducedMotion=false){
    const p=this.game.player;const follow=Math.min(1,dt*7);this.cameraX+=(p.x-this.cameraX)*follow;this.cameraY+=(p.y-this.cameraY)*follow;this.cameraX=Math.max(this.viewWidth/2,Math.min(WORLD-this.viewWidth/2,this.cameraX));this.cameraY=Math.max(this.viewHeight/2,Math.min(WORLD-this.viewHeight/2,this.cameraY));this.camera.position.set(this.cameraX,this.cameraY,50);this.camera.lookAt(this.cameraX,this.cameraY,0);
    const groups = new Map<string,number>();
    for(const e of this.game.enemies){if(Math.abs(e.x-this.cameraX)>this.viewWidth/2+3||Math.abs(e.y-this.cameraY)>this.viewHeight/2+3)continue;const key=`${e.kind}-${e.facing<0?'left':'right'}`;const mesh=this.enemyMeshes.get(key)!;const idx=groups.get(key)||0;if(idx>=mesh.instanceMatrix.count)continue;this.dummy.position.set(e.x,e.y,e.y/1000);const scale=(e.kind==='boss'?5.1:e.kind==='brute'?2.2:1.65)*(e.elite?1.35:1);this.dummy.scale.set(e.kind==='boss'&&e.facing<0?-scale:scale,scale,1);this.dummy.rotation.z=e.kind==='wisp'?Math.sin(this.game.elapsed*4+e.phase)*.12:0;this.dummy.updateMatrix();mesh.setMatrixAt(idx,this.dummy.matrix);mesh.setColorAt(idx,new THREE.Color(e.flash>0?0xffffff:e.special==='hexcaster'?0xff82dc:e.special==='juggernaut'?0xffc36d:e.kind==='boss'&&e.tier===3?0xff8e78:e.kind==='boss'&&e.tier===2?0xffba90:e.elite?0xffd69d:0xffffff));groups.set(key,idx+1);}
    for(const [kind,mesh] of this.enemyMeshes){mesh.count=groups.get(kind)||0;mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;}
    for(let i=0;i<this.shrineMeshes.length;i++){const mat=this.shrineMeshes[i].material as THREE.MeshBasicMaterial;mat.opacity=this.game.shrines[i].active?.78:.17;this.shrineMeshes[i].position.x=this.game.shrines[i].x;this.shrineMeshes[i].position.y=this.game.shrines[i].y;this.shrineMeshes[i].rotation.z+=dt*.15;}
    const dying=this.game.dead&&this.game.deathReason==='combat';
    this.player.visible=!dying||reducedMotion;
    this.player.position.set(p.x,dying?p.y:p.y+Math.sin(this.game.elapsed*6)*.08,4);
    this.player.material.map=this.heroTextures[`${(dying?this.game.deathFiring:this.game.firing)?'attack-':''}${(dying?this.game.deathFacing:this.game.facing)<0?'left':'right'}`];
    this.player.material.color.setHex(dying?0xffffff:p.invuln>0&&Math.floor(this.game.elapsed*18)%2?0xff718c:0xffffff);
    this.player.material.opacity=dying&&reducedMotion?Math.max(0,1-this.game.deathProgress):1;
    this.renderer.render(this.scene,this.camera);this.drawFx();this.drawMinimap();
  }
  private drawFx(){
    const c=this.ctx;c.clearRect(0,0,this.width,this.height);const scale=this.width/this.viewWidth;
    for(const b of this.game.projectiles){const s=this.screen(b.x,b.y);if(s.x<-20||s.x>this.width+20||s.y<-20||s.y>this.height+20)continue;c.save();c.translate(s.x,s.y);c.rotate(Math.atan2(-b.vy,b.vx));c.shadowColor=hex(WEAPONS[b.kind].color);c.shadowBlur=16;c.fillStyle=hex(WEAPONS[b.kind].color);c.beginPath();c.ellipse(0,0,Math.max(4,b.radius*scale*1.6),Math.max(2,b.radius*scale*.58),0,0,6.28);c.fill();c.restore();}
    for(const shot of this.game.enemyShots){const s=this.screen(shot.x,shot.y);if(s.x<-20||s.x>this.width+20||s.y<-20||s.y>this.height+20)continue;c.fillStyle=shot.boss?'#ffb079':'#f2a1d8';c.shadowColor=c.fillStyle;c.shadowBlur=17;c.beginPath();c.arc(s.x,s.y,Math.max(3,shot.radius*scale),0,6.28);c.fill();c.shadowBlur=0;}
    for(const item of this.game.pickups){const s=this.screen(item.x,item.y);if(s.x<-20||s.x>this.width+20||s.y<-20||s.y>this.height+20)continue;const color=item.kind==='xp'?'#8df3cb':item.kind==='heart'?'#94ffb3':'#ffd277';const size=item.kind==='chest'?12:5;c.fillStyle=color;c.shadowColor=color;c.shadowBlur=item.kind==='chest'?20:9;c.beginPath();if(item.kind==='heart'&&this.hamImage.complete&&this.hamImage.naturalWidth){c.drawImage(this.hamImage,0,0,48,48,s.x-17,s.y-17,34,34);}else if(item.kind==='chest'){c.fillRect(s.x-size,s.y-size,size*2,size*2);c.fillStyle='#4b2e42';c.fillRect(s.x-4,s.y-8,8,13);}else{c.arc(s.x,s.y,size,0,6.28);c.fill();}c.shadowBlur=0;}
    for(const shrine of this.game.shrines){if(!shrine.active)continue;const s=this.screen(shrine.x,shrine.y);if(s.x<0||s.x>this.width||s.y<0||s.y>this.height)continue;c.fillStyle='#baffd1';c.shadowColor='#63ffba';c.shadowBlur=16;c.font='900 10px Cinzel,Georgia,serif';c.textAlign='center';c.fillText('✚ HEAL + XP',s.x,s.y-45);c.shadowBlur=0;}
    if(this.game.bombWave){const wave=this.game.bombWave;const center=this.screen(this.game.player.x,this.game.player.y);c.save();c.strokeStyle=this.game.hero==='ranger'?'#8ff8b0':this.game.hero==='wizard'?'#a9c9ff':'#ffca8d';c.lineWidth=7;c.shadowColor=c.strokeStyle;c.shadowBlur=28;c.globalAlpha=.9-wave.age*.7;c.beginPath();c.arc(center.x,center.y,wave.radius*scale,0,Math.PI*2);c.stroke();c.restore();}
    const dying=this.game.dead&&this.game.deathReason==='combat';
    const p=this.screen(this.game.player.x,this.game.player.y);
    if(!dying){c.strokeStyle='rgba(159,240,194,.55)';c.lineWidth=2;c.beginPath();c.ellipse(p.x,p.y+19,20,6,0,0,6.28);c.stroke();if(this.game.player.dashCooldown<=0){c.strokeStyle='rgba(171,255,207,.7)';c.beginPath();c.arc(p.x,p.y,26,0,6.28);c.stroke();}}
    if(!dying&&this.game.weapons.orbit&&this.game.slots.includes('orbit')){const rank=this.game.weapons.orbit;const blades=2+rank;for(let i=0;i<blades;i++){const a=this.game.elapsed*(2.7+rank*.15)+i*6.28/blades;const s=this.screen(this.game.player.x+Math.cos(a)*(2.2+rank*.2),this.game.player.y+Math.sin(a)*(2.2+rank*.2));c.save();c.translate(s.x,s.y);c.rotate(a);c.fillStyle='#ffe5a4';c.shadowColor='#ffd071';c.shadowBlur=17;c.beginPath();c.moveTo(0,-12);c.lineTo(5,0);c.lineTo(0,12);c.lineTo(-5,0);c.closePath();c.fill();c.restore();}}
    if(dying&&this.player.visible===false)this.drawDeath(c,p.x,p.y,scale);
    for(const effect of this.game.effects){const s=this.screen(effect.x,effect.y);const progress=1-effect.life/effect.max;c.globalAlpha=Math.max(0,effect.life/effect.max);c.strokeStyle=hex(effect.color);c.fillStyle=hex(effect.color);c.shadowColor=hex(effect.color);c.shadowBlur=20;c.lineWidth=3;
      if(effect.kind==='zap'&&effect.x2!==undefined&&effect.y2!==undefined){const to=this.screen(effect.x2,effect.y2);c.beginPath();c.moveTo(s.x,s.y);const midX=(s.x+to.x)/2,midY=(s.y+to.y)/2;c.lineTo(midX+rand(-8,8),midY+rand(-8,8));c.lineTo(to.x,to.y);c.stroke();}
      else if(effect.kind==='ring'||effect.kind==='comet'){c.beginPath();c.arc(s.x,s.y,Math.max(1,effect.size*scale*(effect.kind==='comet'?1-progress*.25:progress)),0,6.28);c.stroke();if(effect.kind==='comet'){c.fillStyle='rgba(255,145,101,.11)';c.fill();}}
      else if(effect.kind==='text'){c.font='900 22px Cinzel, Georgia, serif';c.textAlign='center';c.fillText(effect.text||'',s.x,s.y-progress*45);}
      else {c.beginPath();c.arc(s.x,s.y,effect.size*scale*(.3+progress),0,6.28);c.fill();}
    }c.globalAlpha=1;c.shadowBlur=0;
    this.drawWarnings(c,scale);
    for(const e of this.game.enemies){if((!e.elite&&e.kind!=='boss')||e.hp<=0)continue;const s=this.screen(e.x,e.y);if(s.x<0||s.x>this.width||s.y<0||s.y>this.height)continue;const w=e.kind==='boss'?125:e.special?75:36;c.fillStyle='#2c1c29';c.fillRect(s.x-w/2,s.y-45,w,7);c.fillStyle=e.kind==='boss'?'#f4bd76':e.special==='hexcaster'?'#ff75d5':'#ffbd68';c.fillRect(s.x-w/2,s.y-45,w*e.hp/e.maxHp,7);if(e.kind==='boss'||e.special){c.font=`900 ${e.kind==='boss'?12:10}px Cinzel,Georgia,serif`;c.textAlign='center';c.fillStyle=e.special==='hexcaster'?'#ffc0ed':'#ffe2b4';const label=e.special==='hexcaster'?'HEXCASTER':e.special==='juggernaut'?'JUGGERNAUT':e.tier===3?'MOLOCH UNBOUND':e.tier===2?'ASCENDED MOLOCH':'MOLOCH';c.fillText(label,s.x,s.y-51);}}
  }
  private drawWarnings(c:CanvasRenderingContext2D,scale:number){
    // Gameplay warnings are drawn after cosmetic effects, with fixed-position
    // geometry and timer-based progress that also works in reduced motion.
    for(const hazard of this.game.hazards){
      const s=this.screen(hazard.x,hazard.y),radius=hazard.radius*scale;
      if(s.x+radius<0||s.x-radius>this.width||s.y+radius<0||s.y-radius>this.height)continue;
      const color=hazard.kind==='hex'?'#ff78d2':'#ffad70';
      c.save();c.fillStyle=hazard.kind==='hex'?'rgba(231,75,187,.26)':'rgba(255,129,72,.29)';
      c.strokeStyle=color;c.lineWidth=2;c.shadowColor=color;c.shadowBlur=12;
      c.beginPath();c.arc(s.x,s.y,radius,0,Math.PI*2);c.fill();c.stroke();
      c.shadowBlur=0;c.lineWidth=5;c.beginPath();c.arc(s.x,s.y,radius+7,-Math.PI/2,-Math.PI/2+2*Math.PI*Math.max(0,hazard.delay/hazard.duration));c.stroke();c.restore();
    }
    for(const e of this.game.enemies){
      if(e.special!=='juggernaut'||e.specialState!=='windup')continue;
      const capsule=chargeCapsule(e),from=this.screen(capsule.x1,capsule.y1),end=this.screen(capsule.x2,capsule.y2);
      const angle=Math.atan2(end.y-from.y,end.x-from.x),radius=capsule.radius*scale;
      c.save();c.fillStyle='rgba(255,165,72,.29)';c.strokeStyle='#ffbf69';c.lineWidth=2;c.shadowColor='#ff9b3f';c.shadowBlur=9;
      c.beginPath();c.moveTo(from.x-Math.sin(angle)*radius,from.y+Math.cos(angle)*radius);
      c.lineTo(end.x-Math.sin(angle)*radius,end.y+Math.cos(angle)*radius);
      c.arc(end.x,end.y,radius,angle+Math.PI/2,angle-Math.PI/2,true);
      c.lineTo(from.x+Math.sin(angle)*radius,from.y-Math.cos(angle)*radius);
      c.arc(from.x,from.y,radius,angle-Math.PI/2,angle+Math.PI/2,true);
      c.closePath();c.fill();c.stroke();
      c.shadowBlur=0;c.strokeStyle='#fff0bf';c.lineWidth=5;c.beginPath();
      c.arc(from.x,from.y,radius+7,-Math.PI/2,-Math.PI/2+2*Math.PI*Math.max(0,e.specialTimer/.9));c.stroke();c.restore();
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
    c.fillStyle=this.game.hero==='ranger'?'#5bba81':this.game.hero==='wizard'?'#806fd1':'#c18a55';
    c.beginPath();c.ellipse(x,y+height*.48,width*(.15+progress*.43),height*.06,0,0,Math.PI*2);c.fill();
    c.restore();
  }
  private drawMinimap(){const c=this.minimap.getContext('2d')!;const w=this.minimap.width,h=this.minimap.height;c.fillStyle='#171722';c.fillRect(0,0,w,h);c.strokeStyle='#8a7360';c.strokeRect(1,1,w-2,h-2);c.fillStyle='#80ffc0';for(const shrine of this.game.shrines)if(shrine.active){const x=shrine.x/WORLD*w,y=(1-shrine.y/WORLD)*h;c.fillRect(x-1,y-4,3,9);c.fillRect(x-4,y-1,9,3);}c.fillStyle='#e47786';for(const e of this.game.enemies){if(e.kind==='boss'||e.elite){c.beginPath();c.arc(e.x/WORLD*w,(1-e.y/WORLD)*h,e.kind==='boss'?3:1.5,0,6.28);c.fill();}}const p=this.game.player;c.fillStyle='#aff3c6';c.beginPath();c.arc(p.x/WORLD*w,(1-p.y/WORLD)*h,3,0,6.28);c.fill();c.strokeStyle='#aaffd0';c.strokeRect((this.cameraX-this.viewWidth/2)/WORLD*w,(1-(this.cameraY+this.viewHeight/2)/WORLD)*h,this.viewWidth/WORLD*w,this.viewHeight/WORLD*h);}
  dispose(){this.resizeObserver.disconnect();this.scene.traverse(node=>{if(node instanceof THREE.Mesh || node instanceof THREE.InstancedMesh || node instanceof THREE.LineLoop || node instanceof THREE.Sprite){node.geometry?.dispose();const materials=Array.isArray(node.material)?node.material:[node.material];for(const material of materials){if('map' in material && material.map instanceof THREE.Texture) material.map.dispose();material.dispose();}}});for(const texture of Object.values(this.heroTextures))texture.dispose();this.renderer.dispose();this.renderer.forceContextLoss();this.host.replaceChildren();}
}
