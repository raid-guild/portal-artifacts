import { obstaclesFor, sweepObstacles, moveWithObstacles, projectOutside, iceLineClear, segmentCircleT, waypointFor, emptyHit, type MoveResult, type Obstacle } from './obstacles';

export type Hero = 'ranger' | 'wizard' | 'dwarf';
export type Weapon = 'thornbow' | 'arcwand' | 'scattergun' | 'chain' | 'orbit' | 'comet';
export type EnemyKind = 'rat' | 'cultist' | 'brute' | 'wisp' | 'boss' | 'rageipede' | 'xorn' | 'efreeti' | 'deathwisp' | 'buraq' | 'chuul' | 'dogmole';
export type LevelId = 'training' | 'forest' | 'desert' | 'ice';
export type Mastery = { vitality: number; agility: number; bombRecharge: number };
export type Vec = { x: number; y: number };
export type SpecialKind = 'juggernaut' | 'hexcaster' | 'pouncer' | 'stalker' | 'devourer' | 'jaunt' | 'groundbreaker' | 'poisonfan' | null;
export type SpecialState = 'idle' | 'windup' | 'charge' | 'recovery';
export type Enemy = Vec & { id: number; hp: number; maxHp: number; speed: number; damage: number; openingScale: number; radius: number; kind: EnemyKind; elite: boolean; special: SpecialKind; specialState: SpecialState; specialTimer: number; specialCd: number; targetX: number; targetY: number; chargeX: number; chargeY: number; chargeHit: boolean; tier: 1 | 2 | 3; bossCastTimer: number; flash: number; phase: number; attackCd: number; windup: number; facing: -1 | 1; knockX: number; knockY: number; attackPhase: number; frozen: number; freezeImmune: number; observed: boolean; navX:number;navY:number;navId:number;navSide:number;navTime:number };
export type Projectile = Vec & { vx: number; vy: number; damage: number; radius: number; life: number; pierce: number; kind: Weapon; chain: number; hit: Set<number> };
export type EnemyShot = Vec & { vx: number; vy: number; life: number; damage: number; radius: number; boss: boolean; poison?: boolean };
export type Strike = Vec & { delay: number; radius: number; damage: number; source: Weapon };
export type Shrine = Vec & { id: number; active: boolean };
export type Pickup = Vec & { kind: 'xp' | 'heart' | 'chest'; value: number; life: number };
export type Effect = Vec & { kind: 'hit' | 'burst' | 'ring' | 'zap' | 'text' | 'comet'; life: number; max: number; color: number; size: number; text?: string; x2?: number; y2?: number };
export type Hazard = Vec & { radius: number; delay: number; duration: number; damage: number; sourceId: number; kind: 'hex' | 'boss' | 'ground' };
export const chargeCapsule = (enemy: Enemy, level: LevelId = 'training') => {
  const length = Math.hypot(enemy.targetX - enemy.x, enemy.targetY - enemy.y) || 1;
  const distance=enemy.special==='juggernaut'?7.7:4.2;
  const dx=(enemy.targetX-enemy.x)/length*distance,dy=(enemy.targetY-enemy.y)/length*distance;
  const hit=emptyHit();sweepObstacles(level,enemy.x,enemy.y,dx,dy,enemy.radius,isFlying(enemy.kind),hit);
  const fraction=hit.hit?Math.max(0,hit.t-.0001):1;
  return { x1: enemy.x, y1: enemy.y, x2: clamp(enemy.x+dx*fraction,1,WORLD-1),
    y2: clamp(enemy.y+dy*fraction,1,WORLD-1), radius: enemy.radius + .55 };
};
export const pointInCapsule = (x: number, y: number, x1: number, y1: number, x2: number, y2: number, radius: number) => {
  const vx = x2 - x1, vy = y2 - y1, distance = vx * vx + vy * vy;
  const projection = distance ? clamp(((x - x1) * vx + (y - y1) * vy) / distance, 0, 1) : 0;
  return (x - x1 - vx * projection) ** 2 + (y - y1 - vy * projection) ** 2 < radius ** 2;
};
export type Stats = { kills: number; elites: number; bosses: number; chests: number; level: number };
export type Reward = { kind: 'weapon' | 'passive' | 'heal' | 'boon' | 'bomb'; id: string; name: string; detail: string; rarity: 'common' | 'rare' | 'epic'; icon: string };

export const HEROES: Record<Hero, { name: string; role: string; weapon: Weapon; health: number; speed: number; color: number; copy: string }> = {
  ranger: { name: 'Ranger', role: 'THE THORNBOW', weapon: 'thornbow', health: 100, speed: 8.2, color: 0x83d69b, copy: 'Rapid piercing arrows. Fast feet and a steady aim.' },
  wizard: { name: 'Wizard', role: 'THE ARC WAND', weapon: 'arcwand', health: 85, speed: 7.7, color: 0xa595ff, copy: 'Volatile bolts bloom into arcane shockwaves.' },
  dwarf: { name: 'Dwarf', role: 'THE RUNIC SCATTERGUN', weapon: 'scattergun', health: 135, speed: 6.8, color: 0xffbb73, copy: 'Close range devastation. Sturdy as the mountain.' },
};
export const WEAPONS: Record<Weapon, { name: string; icon: string; desc: string; color: number; cooldown: number }> = {
  thornbow: { name: 'Thornbow', icon: '➶', desc: 'Piercing arrows split at higher ranks', color: 0x8ff8b0, cooldown: .27 },
  arcwand: { name: 'Arc Wand', icon: '✧', desc: 'Arcane bolts detonate on impact', color: 0xafa0ff, cooldown: .44 },
  scattergun: { name: 'Runic Scattergun', icon: '✷', desc: 'A brutal cone of rune shot', color: 0xffc27d, cooldown: .62 },
  chain: { name: 'Storm Coil', icon: 'ϟ', desc: 'Lightning leaps between nearby foes', color: 0x88d8ff, cooldown: 1.2 },
  orbit: { name: 'Halo Blades', icon: '◈', desc: 'Orbiting steel carves a safe path', color: 0xffd98e, cooldown: .19 },
  comet: { name: 'Falling Star', icon: '☄', desc: 'Call down a blazing meteor', color: 0xff8f72, cooldown: 2.1 },
};
export const WORLD = 180;
export const ENEMY_CAP = 2400;
export const MONSTER_KINDS = ['rageipede','xorn','efreeti','deathwisp','buraq','chuul','dogmole'] as const;
export type MonsterKind = typeof MONSTER_KINDS[number];
export type MonsterTally = Record<MonsterKind, { encountered: number; kills: number; counterKills: number }>;
const MAX_PROJECTILES = 650;
const MAX_PICKUPS = 900;
const MAX_EFFECTS = 360;
export const MAX_HAZARDS = 12;
export const MAX_ENEMY_SHOTS = 280;
const MAX_RENDERED_BOSSES = 16;
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const distanceSq = (a: Vec, b: Vec) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
const isFlying=(kind:EnemyKind)=>kind==='wisp'||kind==='buraq'||kind==='efreeti';

// Forest teaches each threat before layering it into the five-minute milestone.
export const forestPacing = (seconds: number) => ({
  target: Math.min(ENEMY_CAP, 30 + Math.floor(seconds * 1.4)),
  interval: .5 - .34 * clamp(seconds / 300, 0, 1),
  batch: seconds < 120 ? 1 : seconds < 240 ? 2 : 3,
  xornChance: seconds < 120 ? 0 : seconds < 180 ? .02 : seconds < 240 ? .03 : .04,
  xornCap: seconds < 120 ? 0 : seconds < 180 ? 2 : seconds < 240 ? 4 : 6,
  efreetiChance: seconds < 210 ? 0 : .01,
  efreetiCap: seconds < 210 ? 0 : seconds < 270 ? 1 : seconds < 300 ? 2 : 3,
  lunges: seconds < 90 ? 0 : seconds < 180 ? 1 : seconds < 300 ? 2 : 3,
  bossWave: seconds < 240 ? 0 : 1 + Math.floor((seconds - 240) / 120),
});
export const realmPacing = (level: LevelId, seconds: number) => {
  const base=forestPacing(seconds * (level==='desert'?300/420:level==='ice'?300/540:1));
  if(level!=='desert'&&level!=='ice')return base;
  const extraTarget=seconds<60?36+seconds*.4:seconds<180?60:Math.max(0,60*(360-seconds)/180);
  const intervalFactor=.65+.35*clamp((seconds-180)/180,0,1);
  return {...base,target:Math.min(ENEMY_CAP,base.target+Math.round(extraTarget)),interval:base.interval*intervalFactor,batch:seconds>=30?Math.max(2,base.batch):base.batch};
};
const isNewRealm = (level: LevelId) => level==='desert'||level==='ice';
const nativeSeconds = (level: LevelId, seconds: number) => isNewRealm(level)?seconds*(level==='desert'?300/420:300/540):seconds;
const largeKind = (level: LevelId): EnemyKind => level==='desert'?'buraq':'dogmole';
const smallKind = (level: LevelId): EnemyKind => level==='desert'?'deathwisp':'chuul';

export class Game {
  hero: Hero;
  level: LevelId;
  obstacles: readonly Obstacle[];
  mastery: Mastery;
  runes = { light:false, freeze:false, flames:false };
  forestBlessingOffered = false;
  monsters: MonsterTally = Object.fromEntries(MONSTER_KINDS.map(kind=>[kind,{encountered:0,kills:0,counterKills:0}])) as MonsterTally;
  player: Vec & { health: number; maxHealth: number; invuln: number; dash: number; dashCooldown: number; speed: number };
  enemies: Enemy[] = [];
  projectiles: Projectile[] = [];
  enemyShots: EnemyShot[] = [];
  strikes: Strike[] = [];
  pickups: Pickup[] = [];
  effects: Effect[] = [];
  hazards: Hazard[] = [];
  weapons: Partial<Record<Weapon, number>> = {};
  slots: Weapon[] = [];
  backpack: Weapon[] = [];
  passives = { damage: 0, speed: 0, magnet: 0, vitality: 0, cooldown: 0 };
  stats: Stats = { kills: 0, elites: 0, bosses: 0, chests: 0, level: 1 };
  score = 0;
  survivalClock = 0;
  elapsed = 0;
  xp = 0;
  xpNeeded = 14;
  gold = 0;
  combo = 0;
  comboTime = 0;
  spawnClock = 0;
  chestClock = 0;
  private nextShooterScan = 20;
  private lastShooterAt = -Infinity;
  private nextForestLungeAt = 0;
  lastChestTime = -45;
  bombCharge = 45;
  bombRanks = { radius: 0, damage: 0, recharge: 0 };
  bombWave: { age: number; radius: number; previousRadius: number; hit: Set<number> } | null = null;
  facing: -1 | 1 = 1;
  bossWave = 0;
  escortDebt = 0;
  nextId = 1;
  dead = false;
  deathReason: 'combat' | 'bank' | 'abandon' | null = null;
  deathProgress = 0;
  deathFacing: -1 | 1 = 1;
  deathFiring = false;
  cleared = false;
  endless = false;
  paused = false;
  awaitingReward = false;
  rankable = true;
  aim = { x: 1, y: 0 };
  move = { x: 0, y: 0 };
  firing = false;
  cooldowns: Partial<Record<Weapon, number>> = {};
  onReward: ((rewards: Reward[], chest: boolean) => void) | null = null;
  onEvent: ((event: 'kill' | 'hurt' | 'shoot' | 'level' | 'chest' | 'boss' | 'bossDead' | 'dash' | 'bomb' | 'heal' | 'death') => void) | null = null;
  private readonly gridWidth = Math.ceil(WORLD / 5);
  private gridHead = new Int32Array(this.gridWidth * this.gridWidth).fill(-1);
  private gridNext = new Int32Array(ENEMY_CAP);
  private collisionHit=emptyHit();
  private moveResult:MoveResult={x:0,y:0,hit:false,id:0};
  private waypointResult:MoveResult={x:0,y:0,hit:false,id:0};
  private navDirection={x:0,y:0};
  private projectileCandidates:{enemy:Enemy;t:number}[]=[];
  private projectileCandidatePool:{enemy:Enemy;t:number}[]=[];
  private orbitHits = new Map<number, number>();
  private orbitPulse = 0;
  shrines: Shrine[] = [[28,28],[90,28],[152,28],[28,90],[152,90],[28,152],[90,152],[152,152],[54,54],[126,54],[54,126],[126,126]].map(([x,y],id)=>({id,x,y,active:true}));

  constructor(hero: Hero, level: LevelId = 'training', mastery: Mastery = { vitality: 0, agility: 0, bombRecharge: 0 }) {
    this.hero = hero; this.level=level; this.obstacles=obstaclesFor(level);this.mastery={...mastery};
    const def = HEROES[hero];
    const health=Math.round(def.health*(1+.05*mastery.vitality));
    this.player = { x: WORLD / 2, y: WORLD / 2, health, maxHealth: health, invuln: 0, dash: 0, dashCooldown: 0, speed: def.speed*(1+.03*mastery.agility) };
    this.weapons[def.weapon] = 1;
    this.slots.push(def.weapon);
    for (let i = 0; i < (level === 'training' ? 18 : isNewRealm(level)?32:12); i++) this.spawnEnemy(level === 'forest' ? 'rageipede' : isNewRealm(level)?smallKind(level):undefined);
    this.buildGrid();
  }

  die(reason: 'combat' | 'bank' | 'abandon' = 'combat') {
    if (this.dead) return false;
    this.dead = true;
    this.deathReason = reason;
    this.deathFacing = this.facing;
    this.deathFiring = this.firing;
    this.player.health = 0;
    this.move.x = this.move.y = 0;
    this.firing = false;
    this.hazards.length = 0;
    if (reason === 'combat') this.onEvent?.('death');
    return true;
  }

  private effect(effect: Effect) { if (this.effects.length < MAX_EFFECTS) this.effects.push(effect); }
  private buildGrid() {
    this.gridHead.fill(-1);
    for (let i = 0; i < this.enemies.length; i++) {
      const enemy = this.enemies[i];
      const cx = Math.max(0, Math.min(this.gridWidth - 1, Math.floor(enemy.x / 5)));
      const cy = Math.max(0, Math.min(this.gridWidth - 1, Math.floor(enemy.y / 5)));
      const cell = cy * this.gridWidth + cx;
      this.gridNext[i] = this.gridHead[cell];
      this.gridHead[cell] = i;
    }
  }
  private moveTerrain(x:number,y:number,dx:number,dy:number,radius:number,flying:boolean,slide=true){
    return moveWithObstacles(this.level,x,y,dx,dy,radius,flying,slide,this.moveResult,this.collisionHit);
  }
  private safeTerrain(x:number,y:number,radius:number){
    return projectOutside(this.level,x,y,radius,false,this.moveResult);
  }
  private scheduleShooters(target:number){
    if(!isNewRealm(this.level)||this.elapsed<this.nextShooterScan)return;
    this.nextShooterScan=Math.floor(this.elapsed)+1;
    const desired=this.elapsed<20?0:this.elapsed<45?1:this.elapsed<90?2:this.elapsed<150?3:this.elapsed<240?4:6;
    if(this.elapsed-this.lastShooterAt<8)return;
    let live=0;for(const enemy of this.enemies)if(enemy.hp>0&&enemy.kind==='cultist'&&!enemy.elite)live++;
    if(live>=desired)return;
    if(this.enemies.length>=target||this.enemies.length>=ENEMY_CAP){
      const small=smallKind(this.level);let candidate=-1,farthest=18*18;
      for(let i=0;i<this.enemies.length;i++){const enemy=this.enemies[i];if(enemy.hp<=0||enemy.elite||enemy.specialState!=='idle'||enemy.kind!==small&&enemy.kind!=='wisp')continue;const distance=distanceSq(enemy,this.player);if(distance>farthest){farthest=distance;candidate=i;}}
      if(candidate<0)return;
      this.enemies.splice(candidate,1);
    }
    if(this.spawnEnemy('cultist',false))this.lastShooterAt=this.elapsed;
  }
  private navigate(e:Enemy,dx:number,dy:number,dt:number){
    const direction=this.navDirection;direction.x=dx;direction.y=dy;
    if(!this.obstacles.length)return direction;
    e.navTime=Math.max(0,e.navTime-dt);
    const flying=isFlying(e.kind),target=this.player;
    if(e.navId&&e.navTime>0){const vx=e.navX-e.x,vy=e.navY-e.y,len=Math.hypot(vx,vy);if(len>.7){direction.x=vx/len;direction.y=vy/len;return direction;}}
    let nearObstacle=false;
    for(const obstacle of this.obstacles){if(flying&&obstacle.shape==='circle')continue;const reach=obstacle.shape==='circle'?obstacle.radius:Math.max(obstacle.halfWidth,obstacle.halfHeight);if(Math.abs(e.x-obstacle.x)<reach+7&&Math.abs(e.y-obstacle.y)<reach+7){nearObstacle=true;break;}}
    if(!nearObstacle){e.navId=0;return direction;}
    sweepObstacles(this.level,e.x,e.y,target.x-e.x,target.y-e.y,e.radius,flying,this.collisionHit);
    if(!this.collisionHit.hit){e.navId=0;return direction;}
    const blocker=this.obstacles[this.collisionHit.id-1];
    if(!blocker)return direction;
    const reachedWaypoint=Math.hypot(e.navX-e.x,e.navY-e.y)<.7;
    if(e.navId!==blocker.id||e.navTime===0||reachedWaypoint){
      let best=Infinity,bestSide=-1,bestX=e.x,bestY=e.y;
      for(let side=0;side<4;side++){
        const point=waypointFor(blocker,side,e.radius,this.waypointResult);
        sweepObstacles(this.level,e.x,e.y,point.x-e.x,point.y-e.y,e.radius,flying,this.collisionHit);
        if(this.collisionHit.hit&&this.collisionHit.t<.98)continue;
        const cost=Math.hypot(point.x-e.x,point.y-e.y)+Math.hypot(target.x-point.x,target.y-point.y)+(e.navId===blocker.id&&e.navSide!==side?2:0)+(e.navId===blocker.id&&reachedWaypoint&&e.navSide===side?12:0);
        if(cost<best){best=cost;bestSide=side;bestX=point.x;bestY=point.y;}
      }
      if(bestSide>=0){e.navId=blocker.id;e.navSide=bestSide;e.navX=bestX;e.navY=bestY;e.navTime=.25;}
    }
    if(!e.navId)return direction;
    const vx=e.navX-e.x,vy=e.navY-e.y,len=Math.hypot(vx,vy)||1;
    direction.x=vx/len;direction.y=vy/len;return direction;
  }
  forNearby(x: number, y: number, radius: number, visit: (enemy: Enemy) => boolean | void) {
    const minX = Math.max(0, Math.floor((x - radius) / 5)), maxX = Math.min(this.gridWidth - 1, Math.floor((x + radius) / 5));
    const minY = Math.max(0, Math.floor((y - radius) / 5)), maxY = Math.min(this.gridWidth - 1, Math.floor((y + radius) / 5));
    for (let cy = minY; cy <= maxY; cy++) for (let cx = minX; cx <= maxX; cx++) {
      for (let index = this.gridHead[cy * this.gridWidth + cx]; index !== -1; index = this.gridNext[index]) if (visit(this.enemies[index])) return;
    }
  }
  nearest(x: number, y: number, radius: number, exclude?: Set<number>, ignoreIceCover=false) {
    let best: Enemy | undefined, d = radius * radius;
    this.forNearby(x, y, radius, enemy => { const q = (enemy.x - x) ** 2 + (enemy.y - y) ** 2; if (enemy.hp > 0 && q < d && !exclude?.has(enemy.id) && (ignoreIceCover||iceLineClear(this.level,x,y,enemy.x,enemy.y))) { best = enemy; d = q; } });
    return best;
  }
  spawnEnemy(forcedKind?: EnemyKind, elite = false): Enemy | undefined {
    if (this.enemies.length >= ENEMY_CAP) return;
    const paced=nativeSeconds(this.level,this.elapsed), t = paced / 60;
    let kind: EnemyKind;
    if(forcedKind)kind=forcedKind;
    else if(this.level==='forest'){
      const pacing = forestPacing(this.elapsed), roll = Math.random();
      const wispChance = this.elapsed < 60 ? .05 : .1, bruteChance = this.elapsed < 60 ? 0 : .05;
      kind = roll < pacing.efreetiChance ? 'efreeti' : roll < pacing.efreetiChance + pacing.xornChance ? 'xorn' :
        roll < pacing.efreetiChance + pacing.xornChance + wispChance ? 'wisp' :
        roll < pacing.efreetiChance + pacing.xornChance + wispChance + bruteChance ? 'brute' : 'rageipede';
      if ((kind === 'xorn' || kind === 'efreeti') && this.enemies.reduce((count, e) => count + Number(e.hp > 0 && e.kind === kind), 0) >= (kind === 'xorn' ? pacing.xornCap : pacing.efreetiCap)) kind = 'rageipede';
      elite = elite && this.elapsed >= 120 && (kind === 'rageipede' || kind === 'brute');
    }
    else if(isNewRealm(this.level)){
      const roll=Math.random(), big=largeKind(this.level), small=smallKind(this.level);
      const largeCap=paced<240?1:paced<300?2:3;
      const largeChance=paced>=180&&this.enemies.reduce((n,e)=>n+Number(e.hp>0&&e.kind===big),0)<largeCap?.02:0;
      kind=roll<largeChance?big:roll<largeChance+(paced<60?.05:.10)?'wisp':roll<largeChance+(paced<60?.05:.15)?'brute':small;
      elite=elite&&paced>=120&&(kind===small||kind==='brute');
    }
    else kind=Math.random() < Math.min(.08 + t * .04, .25) ? 'brute' : Math.random() < .18 ? 'wisp' : Math.random() < .28 ? 'cultist' : 'rat';
    if (kind === 'boss' && this.enemies.filter(enemy => enemy.kind === 'boss' && enemy.hp > 0).length >= MAX_RENDERED_BOSSES) return;
    const angle = rand(0, Math.PI * 2), range = rand(21, 30);
    let x = clamp(this.player.x + Math.cos(angle) * range, 2, WORLD - 2), y = clamp(this.player.y + Math.sin(angle) * range, 2, WORLD - 2);
    const base = { rat: [15, 3.2, 8, .44], cultist: [25, 2.5, 10, .55], brute: [60, 1.65, 17, .85], wisp: [17, 4, 7, .4], boss: [1050, 1.6, 27, 2.2], rageipede:[18,3.4,9,.48], xorn:[210,2.3,21,1.25], efreeti:[520,2.1,18,1.55],deathwisp:[18,3.4,9,.48],buraq:[360,1.8,16,1.4],chuul:[20,3.1,8,.5],dogmole:[380,1.8,17,1.4] }[kind];
    const scale = 1 + Math.min(4, t * .27);
    const tier: 1 | 2 | 3 = isNewRealm(this.level)&&kind==='boss'?(this.bossWave<2?1:this.bossWave<4?2:3):kind !== 'boss' || this.elapsed < 360 ? 1 : this.elapsed < 540 ? 2 : 3;
    const special: SpecialKind = kind==='rageipede'||kind==='deathwisp'?'pouncer':kind==='xorn'?'stalker':kind==='efreeti'?'devourer':kind==='chuul'?'jaunt':kind==='dogmole'?'groundbreaker':kind==='buraq'?'poisonfan':elite && kind === 'brute' && (this.level !== 'training' || this.elapsed >= 120) ? 'juggernaut' : elite && kind === 'cultist' && this.elapsed >= 180 ? 'hexcaster' : null;
    const specialHp = special === 'juggernaut' ? (this.level !== 'training' && paced < 240 ? 1 : 6) : special === 'hexcaster' ? 7 : 1;
    const hp = base[0] * scale * (elite ? 3 : 1) * specialHp * (kind === 'boss' ? tier === 2 ? 1.35 : tier === 3 ? 1.65 : 1 : 1);
    const openingScale = kind === 'boss' ? 1 : this.level !== 'training' ? .65 + .35 * clamp(paced / 180, 0, 1) : .85 + .15 * clamp(this.elapsed / 60, 0, 1);
    const radius=base[3]*(elite?1.35:1),position=projectOutside(this.level,x,y,radius,isFlying(kind),this.moveResult);x=position.x;y=position.y;
    const enemy: Enemy = { id: this.nextId++, x, y, hp, maxHp: hp, speed: kind === 'boss' && tier > 1 ? tier === 2 ? 1.9 : 2.1 : base[1], damage: base[2] * openingScale, openingScale, radius, kind, elite, special, specialState: 'idle', specialTimer: 0, specialCd: special ? 1 : 0, targetX: x, targetY: y, chargeX: 0, chargeY: 0, chargeHit: false, tier, bossCastTimer: 0, flash: 0, phase: rand(0, 6.28), attackCd: kind === 'boss' ? 1.5 : rand(1.4,3), windup: 0, facing: this.player.x < x ? -1 : 1, knockX: 0, knockY: 0, attackPhase: 0, frozen:0,freezeImmune:0,observed:false,navX:x,navY:y,navId:0,navSide:0,navTime:0 };
    this.enemies.push(enemy);
    return enemy;
  }
  dash() {
    if (this.player.dashCooldown > 0 || this.dead || this.paused || this.awaitingReward) return;
    this.player.dash = .2; this.player.invuln = .36; this.player.dashCooldown = 3.5;
    this.effect({ x: this.player.x, y: this.player.y, kind: 'ring', life: .35, max: .35, color: 0x99ffd2, size: 2 });
    this.onEvent?.('dash');
  }
  get bombRecharge() { return 45 * Math.pow(.88, this.bombRanks.recharge) * (1-.05*this.mastery.bombRecharge); }
  get bombRadius() { return 7 * (1 + this.bombRanks.radius * .12); }
  bomb() {
    if (this.bombCharge < this.bombRecharge || this.dead || this.paused || this.awaitingReward) return false;
    this.bombCharge = 0;
    this.bombWave = { age: 0, radius: 0, previousRadius: 0, hit: new Set() };
    this.onEvent?.('bomb');
    return true;
  }
  private updateBomb(dt: number) {
    if (!this.bombWave) return;
    const wave = this.bombWave;
    wave.age += dt;
    wave.previousRadius = wave.radius;
    wave.radius = this.bombRadius * Math.min(1, wave.age / .6);
    const p = this.player;
    const base = { ranger: 48, wizard: 54, dwarf: 66 }[this.hero] * (1 + this.bombRanks.damage * .25);
    this.forNearby(p.x, p.y, wave.radius + 3, enemy => {
      if (enemy.hp <= 0 || wave.hit.has(enemy.id)) return;
      const distance = Math.sqrt(distanceSq(enemy, p));
      if (distance > wave.radius + enemy.radius || distance < wave.previousRadius - enemy.radius) return;
      wave.hit.add(enemy.id);
      this.damage(enemy, base, 'bomb');
      if (this.hero === 'dwarf' && enemy.kind !== 'boss') {
        const magnitude = 6 / (distance || 1);
        enemy.knockX = (enemy.x - p.x) * magnitude;
        enemy.knockY = (enemy.y - p.y) * magnitude;
      }
      if (this.hero === 'wizard') {
        let chained = 0;
        this.forNearby(enemy.x, enemy.y, 3.5, other => {
          if (chained >= 2) return true;
          if (other.hp <= 0 || wave.hit.has(other.id) || distanceSq(enemy, other) > 3.5 ** 2) return;
          wave.hit.add(other.id); chained++;
          this.damage(other, base * .45, 'bomb');
          this.effect({ x: enemy.x, y: enemy.y, x2: other.x, y2: other.y, kind: 'zap', life: .22, max: .22, color: 0x9fe7ff, size: .3 });
        });
      }
    });
    if (this.hero === 'ranger' && wave.previousRadius < 2 && wave.radius >= 2) {
      for (let i = 0; i < 24; i++) this.projectile(p.x, p.y, i * Math.PI / 12, 25, base * .35, 'thornbow', .21, 3, .65);
    }
    if (wave.age >= .6) this.bombWave = null;
  }
  private damage(enemy: Enemy, amount: number, source: Weapon | 'bomb') {
    if (enemy.hp <= 0) return;
    const counter=(enemy.kind==='rageipede'||enemy.kind==='deathwisp')&&this.runes.light||(enemy.kind==='xorn'||enemy.kind==='efreeti')&&this.runes.freeze||enemy.kind==='chuul'&&this.runes.flames||enemy.kind==='buraq'&&source==='bomb'||enemy.kind==='dogmole'&&['thornbow','scattergun','orbit','bomb'].includes(source);
    if(enemy.special==='devourer'&&enemy.specialState==='charge'&&!this.runes.freeze&&['arcwand','chain','comet'].includes(source)){this.effect({x:enemy.x,y:enemy.y,kind:'ring',life:.2,max:.2,color:0x8cd9ff,size:enemy.radius*1.5});return;}
    if(counter&&(enemy.kind==='xorn'||enemy.kind==='efreeti')&&enemy.freezeImmune<=0){enemy.frozen=.5;enemy.freezeImmune=3;enemy.specialState='recovery';enemy.specialTimer=Math.max(enemy.specialTimer,.5);}
    if(counter&&enemy.special==='stalker')enemy.specialState='recovery';
    enemy.hp -= amount * (1 + this.passives.damage * .18)*(counter?1.25:1);
    enemy.flash = .12;
    if (enemy.hp > 0) { if (Math.random() < .28) this.effect({ x: enemy.x, y: enemy.y, kind: 'hit', life: .16, max: .16, color: source==='bomb'?0xffd79e:WEAPONS[source].color, size: .7 }); return; }
    this.hazards = this.hazards.filter(hazard => hazard.sourceId !== enemy.id);
    this.stats.kills++;
    if((MONSTER_KINDS as readonly string[]).includes(enemy.kind)){const kind=enemy.kind as MonsterKind;if(!enemy.observed){enemy.observed=true;this.monsters[kind].encountered++;}this.monsters[kind].kills++;if(counter)this.monsters[kind].counterKills++;}
    if (enemy.elite) this.stats.elites++;
    if (enemy.kind === 'boss') { this.stats.bosses++; this.onEvent?.('bossDead'); }
    this.combo++; this.comboTime = 3;
    this.score += enemy.kind === 'boss' ? 600 : enemy.elite ? 75 : 10;
    const count = enemy.kind === 'boss' ? 22 : enemy.elite ? 5 : 1;
    for (let i = 0; i < count && this.pickups.length < MAX_PICKUPS; i++) {const pos=projectOutside(this.level,enemy.x+rand(-1,1),enemy.y+rand(-1,1),.65,false,this.moveResult);this.pickups.push({ x: pos.x, y: pos.y, kind: 'xp', value: enemy.kind === 'boss' ? 4 : enemy.elite ? 3 : 1, life: 25 });}
    const chestChance = enemy.elite ? (enemy.kind === 'brute' ? .45 : .30) : enemy.kind === 'brute' ? .08 : 0;
    if (enemy.kind === 'boss' || chestChance > 0 && this.elapsed - this.lastChestTime >= 45 && !this.pickups.some(item => item.kind === 'chest') && Math.random() < chestChance) {
      const pos=projectOutside(this.level,enemy.x,enemy.y,.8,false,this.moveResult);const chest: Pickup = { x: pos.x, y: pos.y, kind: 'chest', value: 1, life: 45 };
      if (this.pickups.length < MAX_PICKUPS) this.pickups.push(chest);
      else { const xp = this.pickups.findIndex(item => item.kind === 'xp'); if (xp >= 0) this.pickups[xp] = chest; }
      this.lastChestTime = this.elapsed;
    }
    else if (this.pickups.length < MAX_PICKUPS && Math.random() < .018) {const pos=projectOutside(this.level,enemy.x,enemy.y,.65,false,this.moveResult);this.pickups.push({ x: pos.x, y: pos.y, kind: 'heart', value: 18, life: 25 });}
    this.effect({ x: enemy.x, y: enemy.y, kind: 'burst', life: .45, max: .45, color: enemy.kind === 'boss' ? 0xffc76a : 0xff7a9a, size: enemy.radius * 2.5 });
    this.onEvent?.('kill');
  }
  private projectile(x: number, y: number, angle: number, speed: number, damage: number, kind: Weapon, radius = .26, pierce = 0, life = 1.6) {
    if (this.projectiles.length >= MAX_PROJECTILES) return;
    this.projectiles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, damage, kind, radius, pierce, life, chain: 0, hit: new Set() });
  }
  private fireWeapon(weapon: Weapon) {
    const rank = this.weapons[weapon] || 1, p = this.player;
    let angle = Math.atan2(this.aim.y, this.aim.x);
    if (!this.firing && weapon !== 'orbit') { const target = this.nearest(p.x, p.y, 17,undefined,weapon==='comet'); if (!target) return; angle = Math.atan2(target.y - p.y, target.x - p.x); }
    if (weapon === 'thornbow') {
      const count = rank >= 5 ? 5 : rank >= 4 ? 3 : rank >= 2 ? 2 : 1;
      for (let i = 0; i < count; i++) this.projectile(p.x, p.y, angle + (i - (count - 1) / 2) * .13, 24, 12 + rank * 5, weapon, .18, Math.floor(rank / 2), 1.4);
    } else if (weapon === 'arcwand') {
      this.projectile(p.x, p.y, angle, 15, 16 + rank * 8, weapon, .38 + rank * .04, 0, 1.5);
    } else if (weapon === 'scattergun') {
      const count = 5 + rank * 2;
      for (let i = 0; i < count; i++) this.projectile(p.x, p.y, angle + (i - (count - 1) / 2) * .12 + rand(-.025, .025), rand(15, 19), 6 + rank * 2.5, weapon, .17, 0, .48);
      if (rank >= 5) { for (let i = 0; i < 12; i++) this.projectile(p.x,p.y,i*Math.PI/6,15,9,weapon,.2,0,.42); this.effect({x:p.x,y:p.y,kind:'ring',life:.36,max:.36,color:0xffc27d,size:4}); }
    } else if (weapon === 'chain') {
      const target = this.nearest(p.x, p.y, 16);
      if (target) { let prev: Vec = p; const used = new Set<number>(); let current: Enemy | undefined = target;
        for (let i = 0; i < 2 + rank; i++) { if (!current) break; used.add(current.id); this.effect({ x: prev.x, y: prev.y, x2: current.x, y2: current.y, kind: 'zap', life: .22, max: .22, color: 0x8ddfff, size: .2 }); this.damage(current, 15 + rank * 7, weapon); if(rank>=5){this.forNearby(current.x,current.y,2.4,other=>{if(other.hp>0&&other.id!==current!.id&&distanceSq(other,current!)<2.4**2&&iceLineClear(this.level,current!.x,current!.y,other.x,other.y))this.damage(other,15,weapon);});this.effect({x:current.x,y:current.y,kind:'ring',life:.24,max:.24,color:0xb5f3ff,size:2.4});} prev = current; current = this.nearest(prev.x, prev.y, 6 + rank, used); }
      }
    } else if (weapon === 'comet') {
      const target = this.nearest(p.x, p.y, 18,undefined,true);
      const x = target?.x ?? p.x + Math.cos(angle) * 7, y = target?.y ?? p.y + Math.sin(angle) * 7;
      const points = rank>=5 ? [[x,y],[x+rand(-3,3),y+rand(-3,3)],[x+rand(-3,3),y+rand(-3,3)]] : [[x,y]];
      points.forEach(([sx,sy],i)=>{const radius=2.5+rank*.5;this.strikes.push({x:sx,y:sy,delay:.5+i*.18,radius,damage:38+rank*22,source:'comet'});this.effect({x:sx,y:sy,kind:'comet',life:.5+i*.18,max:.5+i*.18,color:0xff956e,size:radius});});
    }
    if (weapon !== 'orbit') this.onEvent?.('shoot');
  }
  private updateWeapons(dt: number) {
    for (const weapon of this.slots) {
      const rank = this.weapons[weapon] || 1;
      if (weapon === 'orbit') {
        const blades = 2 + rank;
        for (let i = 0; i < blades; i++) {
          const a = this.elapsed * (2.7 + rank * .15) + i * Math.PI * 2 / blades;
          const x = this.player.x + Math.cos(a) * (2.2 + rank * .2), y = this.player.y + Math.sin(a) * (2.2 + rank * .2);
          if(!iceLineClear(this.level,this.player.x,this.player.y,x,y))continue;
          this.forNearby(x,y,1.1,enemy=>{const last=this.orbitHits.get(enemy.id)||0;const dx=enemy.x-x,dy=enemy.y-y;if(enemy.hp>0&&dx*dx+dy*dy<(enemy.radius+.6)**2&&this.elapsed-last>.24&&iceLineClear(this.level,x,y,enemy.x,enemy.y)){this.damage(enemy,8+rank*5,weapon);this.orbitHits.set(enemy.id,this.elapsed);}});
        }
        if (rank >= 5 && this.elapsed >= this.orbitPulse) { this.orbitPulse = this.elapsed + 2.8; this.forNearby(this.player.x,this.player.y,5.5,enemy=>{if(enemy.hp>0&&distanceSq(enemy,this.player)<5.5**2&&iceLineClear(this.level,this.player.x,this.player.y,enemy.x,enemy.y))this.damage(enemy,34,weapon);});this.effect({x:this.player.x,y:this.player.y,kind:'ring',life:.55,max:.55,color:0xffe9aa,size:5.5}); }
        continue;
      }
      const rate = WEAPONS[weapon].cooldown * Math.pow(.88, rank - 1) * Math.pow(.92, this.passives.cooldown);
      this.cooldowns[weapon] = (this.cooldowns[weapon] || 0) - dt;
      if ((this.cooldowns[weapon] || 0) <= 0) { this.fireWeapon(weapon); this.cooldowns[weapon] = rate; }
    }
  }
  private pushEnemyShot(shot: EnemyShot) {
    if (this.enemyShots.length < MAX_ENEMY_SHOTS) this.enemyShots.push(shot);
  }
  private hurtPlayer(amount: number, invulnerability: number) {
    const p = this.player;
    if (p.invuln > 0) return false;
    p.health = Math.max(0, p.health - amount);
    p.invuln = invulnerability;
    this.effect({ x: p.x, y: p.y, kind: 'ring', life: .3, max: .3, color: 0xff6c82, size: 1.7 });
    if (p.health <= 0) { this.die(); return true; }
    this.onEvent?.('hurt');
    return false;
  }
  private spawnBossWave() {
    const aliveBosses = this.enemies.reduce((count, e) => count + Number(e.hp > 0 && e.kind === 'boss'), 0);
    if (aliveBosses >= MAX_RENDERED_BOSSES) return;
    const tier = isNewRealm(this.level) ? this.bossWave<2?1:this.bossWave<4?2:3 : this.elapsed < 360 ? 1 : this.elapsed < 540 ? 2 : 3;
    const escorts = tier === 1 ? 0 : tier === 2 ? 2 : 4;
    while (this.enemies.length > ENEMY_CAP - 1 - escorts) {
      let victim = -1, farthest = -1;
      for (let i = 0; i < this.enemies.length; i++) {
        const e = this.enemies[i];
        if (e.hp <= 0 || e.kind === 'boss' || e.elite) continue;
        const distance = distanceSq(e, this.player);
        if (distance > farthest) { farthest = distance; victim = i; }
      }
      if (victim < 0) break;
      this.enemies.splice(victim, 1); // Admission does not award a kill, XP, or loot.
    }
    if (this.enemies.length >= ENEMY_CAP) return;
    const boss = this.spawnEnemy('boss');
    if (!boss) return;
    for (let i = 0; i < escorts && this.enemies.length < ENEMY_CAP; i++) {
      const escort = this.spawnEnemy(i % 2 ? 'cultist' : 'brute', true);
      if (!escort) break;
      const angle = i * Math.PI * 2 / escorts;
      escort.x = clamp(boss.x + Math.cos(angle) * 3.5, 2, WORLD - 2);
      escort.y = clamp(boss.y + Math.sin(angle) * 3.5, 2, WORLD - 2);
      const safe=projectOutside(this.level,escort.x,escort.y,escort.radius,false,this.moveResult);escort.x=safe.x;escort.y=safe.y;
      this.escortDebt++;
    }
    this.onEvent?.('boss');
    this.effect({ x: this.player.x, y: this.player.y, kind: 'text', life: 1.5, max: 1.5, color: 0xffcf85, size: 3,
      text: boss.tier === 1 ? 'MOLOCH RISES' : boss.tier === 2 ? 'ASCENDED MOLOCH' : 'MOLOCH UNBOUND' });
  }
  private addMarks(e: Enemy, count: number, delay: number, damage: number, kind: Hazard['kind']) {
    if (this.hazards.length + count > MAX_HAZARDS) return false;
    const dx = this.player.x - e.x, dy = this.player.y - e.y, length = Math.hypot(dx, dy) || 1;
    const normalX = -dy / length, normalY = dx / length;
    for (let i = 0; i < count; i++) {
      const offset = (i - (count - 1) / 2) * 3.6;
      this.hazards.push({ x: clamp(this.player.x + normalX * offset, 2, WORLD - 2),
        y: clamp(this.player.y + normalY * offset, 2, WORLD - 2),
        radius: kind === 'hex'||kind==='ground' ? 2.2 : 2.4, delay, duration: delay, damage, sourceId: e.id, kind });
    }
    return true;
  }
  private updateHazards(dt: number) {
    const pending: Hazard[] = [];
    for (const hazard of this.hazards) {
      if (!this.enemies.some(e => e.id === hazard.sourceId && e.hp > 0)) continue;
      hazard.delay -= dt;
      if (hazard.delay > 0) { pending.push(hazard); continue; }
      if (distanceSq(hazard, this.player) < (hazard.radius + .45) ** 2 && this.hurtPlayer(hazard.damage, .42)) {
        this.hazards = pending;
        return;
      }
      this.effect({ x: hazard.x, y: hazard.y, kind: 'burst', life: .3, max: .3,
        color: hazard.kind === 'hex' ? 0xff79d8 : hazard.kind==='ground'?0x9ee0ff:0xffa264, size: hazard.radius });
    }
    this.hazards = pending;
  }
  update(dt: number) {
    if (this.dead || this.paused || this.awaitingReward) return;
    dt = Math.min(dt, .05); this.elapsed += dt;
    this.survivalClock += dt; if(this.survivalClock>=1){this.score+=2;this.survivalClock-=1;}
    if (this.elapsed >= 720 && !this.endless && !this.cleared) { this.cleared=true; this.paused=true; return; }
    const p = this.player;
    p.invuln = Math.max(0, p.invuln - dt); p.dash = Math.max(0, p.dash - dt); p.dashCooldown = Math.max(0, p.dashCooldown - dt);
    this.bombCharge = Math.min(this.bombRecharge, this.bombCharge + dt);
    const speed = p.speed * (1 + this.passives.speed * .1) * (p.dash > 0 ? 3.3 : 1);
    const moveX = this.move.x, moveY = this.move.y;
    const ml = Math.hypot(moveX, moveY);
    const step = speed * dt;
    if (ml > 0) { const moved=this.moveTerrain(p.x,p.y,moveX/ml*step,moveY/ml*step,.55,false);p.x=moved.x;p.y=moved.y; }
    const facingDirection = this.firing ? this.aim.x : moveX;
    if (Math.abs(facingDirection) > .15) this.facing = facingDirection < 0 ? -1 : 1;
    for(const shrine of this.shrines) if(shrine.active&&distanceSq(shrine,p)<1.9**2){shrine.active=false;const healed=Math.min(25,p.maxHealth-p.health);p.health+=healed;this.xp+=18;this.effect({x:shrine.x,y:shrine.y,kind:'ring',life:.8,max:.8,color:0x74ffb4,size:7});this.effect({x:shrine.x,y:shrine.y,kind:'text',life:1.2,max:1.2,color:0xbaffd1,size:2,text:`HEAL +${Math.ceil(healed)}  ·  XP +18`});this.onEvent?.('heal');}
    const forest = this.level === 'forest' ? forestPacing(this.elapsed) : null;
    const newRealm=isNewRealm(this.level), paced=nativeSeconds(this.level,this.elapsed);
    const realm=newRealm?realmPacing(this.level,this.elapsed):forest;
    const wave = realm ? realm.bossWave : Math.floor(this.elapsed / 90);
    if (wave > this.bossWave) { this.bossWave = wave; this.spawnBossWave(); }
    this.spawnClock += dt;
    const target = realm ? realm.target : Math.min(ENEMY_CAP, 70 + Math.floor(this.elapsed * 4.8));
    if(newRealm)this.scheduleShooters(target);
    const openingInterval = 1.2 - .2 * clamp(this.elapsed / 45, 0, 1);
    if (this.enemies.length < target && this.spawnClock >= (realm ? realm.interval : Math.max(.012, .14 - this.elapsed * .00045) * openingInterval)) {
      this.spawnClock = 0;
      const batch = realm ? realm.batch : Math.min(8, 1 + Math.floor(this.elapsed / 35));
      for (let i = 0; i < batch; i++) {
        if (realm && this.enemies.length >= target) break;
        if (this.escortDebt > 0) this.escortDebt--;
        else this.spawnEnemy(undefined, realm ? paced >= 120 && Math.random() < .01 : this.elapsed > 40 && Math.random() < .025);
      }
    }
    this.chestClock += dt;
    if (realm ? this.chestClock >= 60*(newRealm?this.level==='desert'?420/300:540/300:1) : this.chestClock > 36) {
      this.chestClock = 0;
      if (!realm || this.enemies.reduce((count, e) => count + Number(e.hp > 0 && e.kind === 'brute' && e.elite), 0) < 2) this.spawnEnemy('brute', true);
    }
    const alive: Enemy[] = [];
    let activeCharges=0,activePounces=0,activeStalkers=0,activeDevourers=0,newActive=0;
    for(const e of this.enemies)if(e.hp>0&&(e.specialState==='windup'||e.specialState==='charge')){
      if(newRealm&&e.special)newActive++;
      if(e.special==='juggernaut')activeCharges++;else if(e.special==='pouncer')activePounces++;else if(e.special==='stalker')activeStalkers++;else if(e.special==='devourer')activeDevourers++;
    }
    for (const e of this.enemies) {
      if (e.hp <= 0) continue;
      e.flash = Math.max(0, e.flash - dt);
      const dx = p.x - e.x, dy = p.y - e.y, d = Math.hypot(dx, dy) || 1;
      if(!e.observed&&d<14&&(MONSTER_KINDS as readonly string[]).includes(e.kind)){e.observed=true;this.monsters[e.kind as MonsterKind].encountered++;}
      if (Math.abs(dx) > .2) e.facing = dx < 0 ? -1 : 1;
      e.frozen=Math.max(0,e.frozen-dt);e.freezeImmune=Math.max(0,e.freezeImmune-dt);
      if (e.special === 'juggernaut' && e.specialState !== 'idle') {
        e.knockX = 0; e.knockY = 0;
      } else if (Math.abs(e.knockX) + Math.abs(e.knockY) > .02) {
        const pushed=this.moveTerrain(e.x,e.y,e.knockX*dt,e.knockY*dt,e.radius,isFlying(e.kind));e.x=pushed.x;e.y=pushed.y;
        const decay = Math.max(0, 1 - dt * 9); e.knockX *= decay; e.knockY *= decay;
      }
      let canMove = true;
      if (e.special === 'juggernaut' || e.special === 'pouncer' || e.special === 'stalker') {
        e.specialCd -= dt;
        if (e.specialState === 'windup') {
          canMove = false;
          e.specialTimer -= dt;
          if (e.specialTimer <= 0) {
            e.specialState = 'charge'; e.specialTimer = e.special==='juggernaut'?.55:e.special==='pouncer'?.35:.42;
            const length = Math.hypot(e.targetX - e.x, e.targetY - e.y) || 1;
            e.chargeX = (e.targetX - e.x) / length; e.chargeY = (e.targetY - e.y) / length;
            e.chargeHit = false;
          }
        } else if (e.specialState === 'charge') {
          canMove = false;
          const oldX = e.x, oldY = e.y;
          const step = Math.min(dt, e.specialTimer) * (e.special==='juggernaut'?14:e.special==='pouncer'?12:10);
          const charged=this.moveTerrain(e.x,e.y,e.chargeX*step,e.chargeY*step,e.radius,isFlying(e.kind),false);
          e.x=charged.x;e.y=charged.y;
          if (!e.chargeHit && pointInCapsule(p.x, p.y, oldX, oldY, e.x, e.y, e.radius + .55)) {
            e.chargeHit = true;
            if (this.hurtPlayer((e.special==='juggernaut'?24:e.special==='stalker'?21:12) * (realm ? e.openingScale : 1), .62)) return;
          }
          e.specialTimer -= dt;
          if (e.specialTimer <= 0 || charged.hit || (oldX === e.x && oldY === e.y)) {
            e.specialState = 'recovery'; e.specialTimer = e.special==='juggernaut'?.65:realm?(e.special==='pouncer'?.7:.9):.48; if(e.special==='juggernaut')activeCharges--;else if(e.special==='pouncer')activePounces--;else activeStalkers--;if(newRealm)newActive--;
          }
        } else if (e.specialState === 'recovery') {
          canMove = false;
          e.specialTimer -= dt;
          if (e.specialTimer <= 0) { e.specialState = 'idle'; e.specialCd = e.special==='juggernaut'?5.5:realm?(e.special==='stalker'?7:5):e.special==='stalker'?5:2.7; }
        } else if (e.specialCd <= 0 && d >= 4 && d <= (e.special==='pouncer'?9:12) && (newRealm ?
          paced >= (e.special==='juggernaut'?240:90) && this.elapsed>=this.nextForestLungeAt && newActive < (paced<180?1:paced<300?2:3) : forest ?
          this.elapsed >= (e.special==='pouncer'?90:e.special==='stalker'?150:240) &&
          this.elapsed >= this.nextForestLungeAt && activeCharges+activePounces+activeStalkers < forest.lunges :
          (e.special==='juggernaut'?activeCharges<4:e.special==='pouncer'?activePounces<12:activeStalkers<4))) {
          e.specialState = 'windup'; e.specialTimer = e.special==='juggernaut'?.9:realm?(e.special==='pouncer'?.9:1.1):e.special==='pouncer'?.5:.75;
          if (realm) this.nextForestLungeAt = this.elapsed + .4;
          e.targetX = p.x; e.targetY = p.y; e.knockX = 0; e.knockY = 0; if(e.special==='juggernaut')activeCharges++;else if(e.special==='pouncer')activePounces++;else activeStalkers++; canMove = false;
          if(newRealm)newActive++;
        }
      }
      if(e.special==='devourer'){
        e.specialCd-=dt;
        if(e.specialState==='windup'){e.specialTimer-=dt;canMove=false;if(e.specialTimer<=0){e.specialState='charge';e.specialTimer=1.6;}}
        else if(e.specialState==='charge'){e.specialTimer-=dt;canMove=false;if(e.specialTimer<=0){e.specialState='recovery';e.specialTimer=.65;activeDevourers--;for(let j=0;j<8;j++){const a=j*Math.PI/4;this.pushEnemyShot({x:e.x,y:e.y,vx:Math.cos(a)*6,vy:Math.sin(a)*6,life:2.4,damage:13*(forest?e.openingScale:1),radius:.28,boss:false});}}}
        else if(e.specialState==='recovery'){e.specialTimer-=dt;canMove=false;if(e.specialTimer<=0){e.specialState='idle';e.specialCd=6;}}
        else if(e.specialCd<=0&&d<13&&(!forest||this.elapsed>=210)&&activeDevourers<(forest?Math.min(forest.efreetiCap,this.elapsed<300?1:3):3)){e.specialState='windup';e.specialTimer=.8;activeDevourers++;canMove=false;}
      }
      if(e.special==='jaunt'||e.special==='groundbreaker'||e.special==='poisonfan'){
        e.specialCd-=dt;
        if(e.specialState==='windup'){
          canMove=false;e.specialTimer-=dt;
          if(e.specialTimer<=0){
            if(e.special==='jaunt'){
              const travelX=e.targetX-e.x,travelY=e.targetY-e.y,len=Math.hypot(travelX,travelY)||1;
              const travel=Math.min(3,Math.max(0,len-1.5));const moved=this.moveTerrain(e.x,e.y,travelX/len*travel,travelY/len*travel,e.radius,false,false);e.x=moved.x;e.y=moved.y;
            }else if(e.special==='poisonfan'){
              const angle=Math.atan2(e.targetY-e.y,e.targetX-e.x);
              for(let j=-2;j<=2;j++){const a=angle+j*.22;this.pushEnemyShot({x:e.x,y:e.y,vx:Math.cos(a)*6,vy:Math.sin(a)*6,life:2.6,damage:8*e.openingScale,radius:.25,boss:false,poison:true});}
            }
            e.specialState='recovery';e.specialTimer=e.special==='jaunt'?.8:1;newActive--;
          }
        }else if(e.specialState==='recovery'){
          canMove=false;e.specialTimer-=dt;if(e.specialTimer<=0){e.specialState='idle';e.specialCd=e.special==='jaunt'?7:e.special==='poisonfan'?6:7;}
        }else if(e.specialCd<=0&&this.elapsed>=this.nextForestLungeAt&&newActive<(paced<180?1:paced<300?2:3)&&
          paced>=(e.special==='jaunt'?90:210)&&d<(e.special==='jaunt'?12:13)&&
          (e.special!=='groundbreaker'||d<=7)&&
          (e.special!=='groundbreaker'||this.addMarks(e,1,1.2,16,'ground'))){
          e.specialState='windup';e.specialTimer=e.special==='jaunt'?1:e.special==='poisonfan'?1.1:1.2;
          e.targetX=p.x;e.targetY=p.y;this.nextForestLungeAt=this.elapsed+.4;newActive++;canMove=false;
        }
      }
      if(e.frozen>0)canMove=false;
      if (e.kind === 'boss' && e.bossCastTimer > 0) { e.bossCastTimer = Math.max(0, e.bossCastTimer - dt); canMove = false; }
      if (canMove) {
        const swirl = e.kind === 'wisp' || e.kind==='efreeti'||e.kind==='buraq' ? Math.sin(this.elapsed * 4 + e.phase) * .48 : 0;
        const standOff = e.kind === 'cultist'||e.kind==='efreeti'||e.kind==='buraq' ? 6 : e.kind==='dogmole'?5:e.kind === 'boss' ? 4.5 : e.radius + .3;
        if (d > standOff) {
          const direction=this.navigate(e,dx/d,dy/d,dt);
          const moved=this.moveTerrain(e.x,e.y,(direction.x-direction.y*swirl)*e.speed*dt,(direction.y+direction.x*swirl)*e.speed*dt,e.radius,isFlying(e.kind));
          e.x=moved.x;e.y=moved.y;
        }
      }
      if (e.special === 'hexcaster') {
        e.specialCd -= dt;
        if (e.specialCd <= 0 && d < 14 && this.addMarks(e, 1, 1.2, 18, 'hex')) e.specialCd = 4.5;
      } else if (e.kind === 'cultist' || e.kind === 'boss' || e.kind==='efreeti') {
        e.attackCd -= dt;
        if (e.attackCd <= 0 && e.windup <= 0 && e.bossCastTimer <= 0 && d < 17) {
          e.attackCd = e.kind === 'boss' ? 3.2 : e.kind==='efreeti'?3.4:2.4 + Math.random();
          e.attackPhase++;
          if (e.kind === 'boss' && e.tier > 1 && e.attackPhase % 2 === 0 &&
              this.addMarks(e, e.tier === 2 ? 3 : 5, e.tier === 2 ? 1.25 : 1.4, 22, 'boss')) {
            e.bossCastTimer = e.tier === 2 ? 1.25 : 1.4;
          } else e.windup = e.kind === 'boss' ? .9 : .55;
        }
        if (e.windup > 0) {
          e.windup -= dt;
          if (e.windup <= 0) {
            const angle = Math.atan2(p.y - e.y, p.x - e.x), boss = e.kind === 'boss';
            const count = boss ? 12 : e.kind==='efreeti'?5:1;
            for (let j = 0; j < count; j++) {
              const a = boss ? j * Math.PI * 2 / count + this.elapsed * .12 : angle+(j-(count-1)/2)*.19;
              this.pushEnemyShot({ x: e.x, y: e.y, vx: Math.cos(a) * (boss ? 7 : 9),
                vy: Math.sin(a) * (boss ? 7 : 9), life: boss ? 3.1 : 2.1,
                damage: boss ? 16 : 8 * e.openingScale, radius: boss ? .32 : .23, boss });
            }
            if (boss) for (let j = -1; j <= 1; j++) {
              const a = angle + j * .22;
              this.pushEnemyShot({ x: e.x, y: e.y, vx: Math.cos(a) * 11, vy: Math.sin(a) * 11,
                life: 2.3, damage: 14, radius: .28, boss: true });
            }
            if (boss && e.attackPhase % 3 === 0) for (let j = 0; j < 8; j++) {
              const a = j * Math.PI / 4 + this.elapsed * .25;
              this.pushEnemyShot({ x: e.x, y: e.y, vx: Math.cos(a) * 4.8, vy: Math.sin(a) * 4.8,
                life: 5, damage: 22, radius: .55, boss: true });
            }
          }
        }
      }
      const contact = (p.x - e.x) ** 2 + (p.y - e.y) ** 2 < (e.radius + .55) ** 2;
      if (contact && e.frozen<=0 && (!['juggernaut','pouncer','stalker','jaunt','groundbreaker'].includes(e.special||'') || e.specialState === 'idle') && this.hurtPlayer(e.damage, .62)) return;
      alive.push(e);
    }
    this.enemies = alive;
    this.updateHazards(dt);
    if (this.dead) return;
    this.buildGrid();
    this.updateBomb(dt);
    this.updateWeapons(dt);
    const shots:EnemyShot[]=[];for(const shot of this.enemyShots){const oldX=shot.x,oldY=shot.y,dx=shot.vx*dt,dy=shot.vy*dt;shot.life-=dt;if(shot.life<=0)continue;sweepObstacles(this.level,oldX,oldY,dx,dy,shot.radius,true,this.collisionHit);const wallT=this.collisionHit.hit?this.collisionHit.t:1;const actorT=segmentCircleT(oldX,oldY,dx,dy,p.x,p.y,shot.radius+.55);if(actorT<=wallT){if(p.invuln<=0){p.health=Math.max(0,p.health-shot.damage);p.invuln=.42;if(p.health<=0){this.die();return;}this.onEvent?.('hurt');}continue;}if(this.collisionHit.hit){this.effect({x:oldX+dx*wallT,y:oldY+dy*wallT,kind:'hit',life:.13,max:.13,color:shot.poison?0x84e9a2:0xffb079,size:.22});continue;}shot.x=oldX+dx;shot.y=oldY+dy;shots.push(shot);}this.enemyShots=shots;
    const pending:Strike[]=[];for(const strike of this.strikes){strike.delay-=dt;if(strike.delay>0){pending.push(strike);continue;}this.forNearby(strike.x,strike.y,strike.radius,e=>{if(e.hp>0&&distanceSq(e,strike)<strike.radius**2&&(strike.source==='comet'||iceLineClear(this.level,strike.x,strike.y,e.x,e.y)))this.damage(e,strike.damage,strike.source);});this.effect({x:strike.x,y:strike.y,kind:'ring',life:.45,max:.45,color:strike.source==='comet'?0xffb378:0xb89aff,size:strike.radius});this.effect({x:strike.x,y:strike.y,kind:'burst',life:.32,max:.32,color:strike.source==='comet'?0xff8b5e:0xab9dff,size:strike.radius});}this.strikes=pending;
    const projectiles: Projectile[] = [];
    for (const b of this.projectiles) {
      const oldX=b.x,oldY=b.y,dx=b.vx*dt,dy=b.vy*dt;b.life-=dt;
      if(b.life<=0)continue;
      sweepObstacles(this.level,oldX,oldY,dx,dy,b.radius,true,this.collisionHit);
      const wallHit=this.collisionHit.hit,wallT=wallHit?this.collisionHit.t:1;
      const candidates=this.projectileCandidates,pool=this.projectileCandidatePool;candidates.length=0;let poolCount=0;
      const midX=oldX+dx*wallT*.5,midY=oldY+dy*wallT*.5,search=Math.hypot(dx,dy)*wallT*.5+b.radius+3;
      this.forNearby(midX,midY,search,e=>{
        if(e.hp<=0||b.hit.has(e.id))return;
        const t=segmentCircleT(oldX,oldY,dx,dy,e.x,e.y,b.radius+e.radius);
        if(t>wallT||!Number.isFinite(t))return;
        let index=candidates.length;while(index>0&&candidates[index-1].t>t)index--;
        let slot=pool[poolCount++];if(!slot){slot={enemy:e,t};pool.push(slot);}else{slot.enemy=e;slot.t=t;}
        candidates.splice(index,0,slot);
      });
      let spent=false;
      for(const candidate of candidates){const e=candidate.enemy;if(e.hp<=0)continue;b.x=oldX+dx*candidate.t;b.y=oldY+dy*candidate.t;b.hit.add(e.id);this.damage(e,b.damage,b.kind);
        if (b.kind === 'arcwand') { const radius = 1.4 + (this.weapons.arcwand || 1) * .36; this.forNearby(b.x,b.y,radius,other=>{if(other.hp>0&&distanceSq(b,other)<radius*radius&&iceLineClear(this.level,b.x,b.y,other.x,other.y))this.damage(other,b.damage*.45,b.kind);}); this.effect({ x: b.x, y: b.y, kind: 'ring', life: .26, max: .26, color: 0xb09aff, size: radius }); if((this.weapons.arcwand||1)>=5&&this.strikes.length<100){this.strikes.push({x:b.x,y:b.y,delay:.55,radius:3.3,damage:30,source:'arcwand'});this.effect({x:b.x,y:b.y,kind:'comet',life:.55,max:.55,color:0xc3a5ff,size:3.3});} }
        if(b.kind==='thornbow'&&(this.weapons.thornbow||1)>=5&&b.chain===0){this.forNearby(e.x,e.y,3.6,other=>{if(other.hp>0&&other.id!==e.id&&distanceSq(other,e)<3.6**2&&iceLineClear(this.level,e.x,e.y,other.x,other.y)){this.damage(other,b.damage*.45,'thornbow');this.effect({x:e.x,y:e.y,x2:other.x,y2:other.y,kind:'zap',life:.24,max:.24,color:0x8ff8b0,size:.2});}});}
        if(b.pierce--<=0){spent=true;break;}
      }
      if(spent)continue;
      if(wallHit){this.effect({x:oldX+dx*wallT,y:oldY+dy*wallT,kind:'hit',life:.13,max:.13,color:WEAPONS[b.kind].color,size:.2});continue;}
      b.x=oldX+dx;b.y=oldY+dy;
      if(b.x>=0&&b.x<=WORLD&&b.y>=0&&b.y<=WORLD)projectiles.push(b);
    }
    this.projectiles = projectiles;
    const pickups: Pickup[] = [];
    const magnet = 2.4 + this.passives.magnet * 1.2;
    for (const item of this.pickups) {
      item.life -= dt; if (item.life <= 0) continue;
      const dx = p.x - item.x, dy = p.y - item.y, d = Math.hypot(dx, dy);
      if (d < magnet) { const pull = Math.min(d, (7 + 20 / Math.max(.2, d)) * dt); item.x += dx / (d || 1) * pull; item.y += dy / (d || 1) * pull; }
      if (d < .8) {
        if (item.kind === 'xp') this.xp += item.value;
        else if (item.kind === 'heart') { const healed=Math.min(item.value,p.maxHealth-p.health);p.health+=healed;this.effect({x:p.x,y:p.y,kind:'text',life:1,max:1,color:0xbaffd1,size:1,text:`FOOD +${Math.ceil(healed)} HP`});this.onEvent?.('heal'); }
        else if(this.awaitingReward) { pickups.push(item); continue; }
        else { this.stats.chests++; this.score += 120; this.openReward(true); this.onEvent?.('chest'); }
      } else pickups.push(item);
    }
    this.pickups = pickups;
    for (const effect of this.effects) effect.life -= dt;
    this.effects = this.effects.filter(e => e.life > 0);
    if (this.xp >= this.xpNeeded && !this.awaitingReward) { this.xp -= this.xpNeeded; this.stats.level++; this.score+=40; this.xpNeeded = Math.floor(this.xpNeeded * 1.28 + 5); this.openReward(false); this.onEvent?.('level'); }
    this.comboTime = Math.max(0, this.comboTime - dt); if (!this.comboTime) this.combo = 0;
    if (this.orbitHits.size > 5000) this.orbitHits.clear();
  }
  private openReward(chest: boolean) { this.awaitingReward = true; this.onReward?.(this.rollRewards(chest), chest); }
  rollRewards(chest: boolean): Reward[] {
    if(this.level==='forest'&&!this.forestBlessingOffered){this.forestBlessingOffered=true;return [
      {kind:'boon',id:'light',name:'Dawn Rune',detail:'Light strikes deal +25% damage to Rageipedes',rarity:'rare',icon:'☀'},
      {kind:'boon',id:'freeze',name:'Frost Rune',detail:'Freeze Xorn and Efreeti briefly · +25% to their weakness',rarity:'rare',icon:'❄'},
      {kind:'boon',id:'resolve',name:'Endless Resolve',detail:'+10 maximum health and restore 25',rarity:'rare',icon:'♥'}];}
    if(isNewRealm(this.level)&&!this.forestBlessingOffered){this.forestBlessingOffered=true;return [
      this.level==='desert'?{kind:'boon',id:'light',name:'Dawn Rune',detail:'Light strikes deal +25% damage to Deathwisps',rarity:'rare',icon:'☀'}:{kind:'boon',id:'flames',name:'Ember Rune',detail:'Flame strikes deal +25% damage to Chuul',rarity:'rare',icon:'♨'},
      {kind:'bomb',id:'recharge',name:'Bomb Dynamo',detail:'Bomb recharges 12% faster',rarity:'rare',icon:'✷'},
      {kind:'boon',id:'resolve',name:'Renewing Spring',detail:'+10 maximum health and restore 25',rarity:'rare',icon:'♥'}];}
    const list: Reward[] = [];
    const available = Object.keys(WEAPONS) as Weapon[];
    for (const w of available) {
      const rank = this.weapons[w] || 0;
      if (rank < 5 && (rank || this.slots.length < 3 || this.backpack.length < 3)) list.push({ kind: 'weapon', id: w, name: rank ? `${WEAPONS[w].name} +${rank + 1}` : WEAPONS[w].name, detail: rank ? `Rank ${rank + 1} · ${rank >= 3 ? 'evolved strike' : 'power and cadence'}` : WEAPONS[w].desc, rarity: rank >= 3 || chest && rank >= 2 ? 'epic' : rank >= 1 ? 'rare' : 'common', icon: WEAPONS[w].icon });
    }
    for (const [id, name, icon, detail] of [['damage','Sharpened Steel','✦','All weapons deal +18% damage'],['speed','Fleetfoot Boots','➤','Move speed +10%'],['magnet','Vault Magnet','◎','Pull loot from farther away'],['vitality','Iron Heart','♥','Maximum health +20'],['cooldown','Quick Hands','⌁','Fire rate +8%']] as const) if (this.passives[id] < 5) list.push({ kind: 'passive', id, name, detail, rarity: this.passives[id] >= 2 ? 'rare' : 'common', icon });
    for (const [id,name,detail] of [['radius','Bomb Radius','Blast wave grows by 12%'],['damage','Bomb Fury','Blast damage grows by 25%'],['recharge','Bomb Dynamo','Bomb recharges 12% faster']] as const) if (this.bombRanks[id] < 5) list.push({kind:'bomb',id,name,detail,rarity:this.bombRanks[id]>=2?'rare':'common',icon:'✷'});
    if (this.player.health < this.player.maxHealth * .7) list.push({ kind: 'heal', id: 'heal', name: 'Second Wind', detail: 'Restore 35 health now', rarity: 'common', icon: '✚' });
    const boons: Reward[]=[{kind:'boon',id:'resolve',name:'Endless Resolve',detail:'+10 maximum health and restore 25',rarity:'rare',icon:'♥'},{kind:'boon',id:'fury',name:'Everlasting Fury',detail:'All damage grows by another 6%',rarity:'rare',icon:'✦'},{kind:'boon',id:'haste',name:'Wild Momentum',detail:'Move speed grows by another 5%',rarity:'rare',icon:'➤'}];
    if(this.level==='forest'){if(!this.runes.light)list.push({kind:'boon',id:'light',name:'Dawn Rune',detail:'Light strikes deal +25% damage to Rageipedes',rarity:'rare',icon:'☀'});if(!this.runes.freeze)list.push({kind:'boon',id:'freeze',name:'Frost Rune',detail:'Freeze Xorn and Efreeti briefly',rarity:'rare',icon:'❄'});}
    if(this.level==='desert'&&!this.runes.light)list.push({kind:'boon',id:'light',name:'Dawn Rune',detail:'Light strikes deal +25% damage to Deathwisps',rarity:'rare',icon:'☀'});
    if(this.level==='ice'&&!this.runes.flames)list.push({kind:'boon',id:'flames',name:'Ember Rune',detail:'Flame strikes deal +25% damage to Chuul',rarity:'rare',icon:'♨'});
    while(list.length<3)list.push(boons.shift()!);
    const result: Reward[] = []; while (result.length < 3 && list.length) { const idx = Math.floor(Math.random() * list.length); result.push(list.splice(idx, 1)[0]); }
    if (chest && result.length) {
      const prize = result[Math.floor(Math.random() * result.length)];
      if (prize.rarity === 'common') prize.rarity = 'rare';
      if (Math.random() < .28) prize.rarity = 'epic';
    }
    return result;
  }
  chooseReward(reward: Reward) {
    if (!this.awaitingReward) return;
    if (reward.kind === 'weapon') { const w = reward.id as Weapon; if (!this.weapons[w]) { if (this.slots.length < 3) this.slots.push(w); else if (this.backpack.length < 3) this.backpack.push(w); } this.weapons[w] = Math.min(5, (this.weapons[w] || 0) + 1); }
    else if (reward.kind === 'passive') { const id = reward.id as keyof typeof this.passives; this.passives[id]++; if (id === 'vitality') { this.player.maxHealth += 20; this.player.health += 20; } }
    else if(reward.kind==='bomb'){const id=reward.id as keyof typeof this.bombRanks;this.bombRanks[id]=Math.min(5,this.bombRanks[id]+1);}
    else if(reward.kind==='boon'){if(reward.id==='light'||reward.id==='freeze'||reward.id==='flames')this.runes[reward.id]=true;else if(reward.id==='resolve'){this.player.maxHealth+=10;this.player.health=Math.min(this.player.maxHealth,this.player.health+35);}else if(reward.id==='fury')this.passives.damage+=1/3;else this.passives.speed+=.5;}
    else this.player.health = Math.min(this.player.maxHealth, this.player.health + 35);
    this.awaitingReward = false;
  }
  swapBackpack(index: number, slot: number) {
    if (index < 0 || index >= this.backpack.length || slot < 0 || slot >= this.slots.length) return;
    [this.slots[slot], this.backpack[index]] = [this.backpack[index], this.slots[slot]];
  }
  stress(count: number) { this.rankable = false; const additions = Math.min(Math.max(0, Math.floor(count)), ENEMY_CAP - this.enemies.length); for (let i = 0; i < additions; i++) this.spawnEnemy(this.level==='forest'?'rageipede':isNewRealm(this.level)?smallKind(this.level):'rat'); }
  defeatBossDebug() { this.rankable = false; const boss = this.enemies.find(enemy => enemy.kind === 'boss' && enemy.hp > 0); if (boss) this.damage(boss, 1e9, 'thornbow'); }
  demoEncounter(kind: 'juggernaut' | 'hexcaster' | 'ascended' | 'unbound') {
    this.rankable = false;
    this.elapsed = kind === 'juggernaut' ? 130 : kind === 'hexcaster' ? 190 : kind === 'ascended' ? 370 : 550;
    this.endless = kind === 'unbound';
    this.bossWave = Math.floor(this.elapsed / 90);
    this.spawnClock = this.chestClock = -1000;
    this.escortDebt = 0;
    this.enemies = []; this.enemyShots = []; this.hazards = []; this.effects = [];
    this.projectiles = []; this.strikes = []; this.pickups = []; this.slots = [];
    this.awaitingReward = false; this.cleared = false; this.dead = false; this.paused = true;
    this.player.health = this.player.maxHealth; this.player.invuln = 1e9;
    const enemy = kind === 'juggernaut' ? this.spawnEnemy('brute', true) :
      kind === 'hexcaster' ? this.spawnEnemy('cultist', true) : this.spawnEnemy('boss');
    if (enemy) {
      enemy.x = clamp(this.player.x + (enemy.kind === 'boss' ? 10 : 8), 2, WORLD - 2);
      enemy.y = this.player.y;
      enemy.specialCd = 0; enemy.attackCd = 0;
      if (enemy.kind === 'boss') enemy.attackPhase = 1; // First demo cast places marks.
    }
    this.buildGrid();
    return enemy;
  }
  advanceDemo(seconds: number) {
    if (this.rankable || !Number.isFinite(seconds)) return;
    this.paused = false;
    for (let i = 0, count = Math.min(300, Math.max(0, Math.ceil(seconds * 60))); i < count && !this.dead; i++) this.update(1 / 60);
    this.paused = true;
  }
}
