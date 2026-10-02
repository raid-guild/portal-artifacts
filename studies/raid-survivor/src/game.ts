export type Hero = 'ranger' | 'wizard' | 'dwarf';
export type Weapon = 'thornbow' | 'arcwand' | 'scattergun' | 'chain' | 'orbit' | 'comet';
export type EnemyKind = 'rat' | 'cultist' | 'brute' | 'wisp' | 'boss';
export type Vec = { x: number; y: number };
export type Enemy = Vec & { id: number; hp: number; maxHp: number; speed: number; damage: number; radius: number; kind: EnemyKind; elite: boolean; flash: number; phase: number; attackCd: number; windup: number; facing: -1 | 1; knockX: number; knockY: number; attackPhase: number };
export type Projectile = Vec & { vx: number; vy: number; damage: number; radius: number; life: number; pierce: number; kind: Weapon; chain: number; hit: Set<number> };
export type EnemyShot = Vec & { vx: number; vy: number; life: number; damage: number; radius: number; boss: boolean };
export type Strike = Vec & { delay: number; radius: number; damage: number; source: Weapon };
export type Shrine = Vec & { id: number; active: boolean };
export type Pickup = Vec & { kind: 'xp' | 'heart' | 'chest'; value: number; life: number };
export type Effect = Vec & { kind: 'hit' | 'burst' | 'ring' | 'zap' | 'text' | 'comet'; life: number; max: number; color: number; size: number; text?: string; x2?: number; y2?: number };
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
const MAX_PROJECTILES = 650;
const MAX_PICKUPS = 900;
const MAX_EFFECTS = 360;
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const distanceSq = (a: Vec, b: Vec) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;

export class Game {
  hero: Hero;
  player: Vec & { health: number; maxHealth: number; invuln: number; dash: number; dashCooldown: number; speed: number };
  enemies: Enemy[] = [];
  projectiles: Projectile[] = [];
  enemyShots: EnemyShot[] = [];
  strikes: Strike[] = [];
  pickups: Pickup[] = [];
  effects: Effect[] = [];
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
  lastChestTime = -45;
  bombCharge = 45;
  bombRanks = { radius: 0, damage: 0, recharge: 0 };
  bombWave: { age: number; radius: number; previousRadius: number; hit: Set<number> } | null = null;
  facing: -1 | 1 = 1;
  bossWave = 0;
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
  private orbitHits = new Map<number, number>();
  private orbitPulse = 0;
  shrines: Shrine[] = [[28,28],[90,28],[152,28],[28,90],[152,90],[28,152],[90,152],[152,152],[54,54],[126,54],[54,126],[126,126]].map(([x,y],id)=>({id,x,y,active:true}));

  constructor(hero: Hero) {
    this.hero = hero;
    const def = HEROES[hero];
    this.player = { x: WORLD / 2, y: WORLD / 2, health: def.health, maxHealth: def.health, invuln: 0, dash: 0, dashCooldown: 0, speed: def.speed };
    this.weapons[def.weapon] = 1;
    this.slots.push(def.weapon);
    for (let i = 0; i < 22; i++) this.spawnEnemy();
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
  forNearby(x: number, y: number, radius: number, visit: (enemy: Enemy) => boolean | void) {
    const minX = Math.max(0, Math.floor((x - radius) / 5)), maxX = Math.min(this.gridWidth - 1, Math.floor((x + radius) / 5));
    const minY = Math.max(0, Math.floor((y - radius) / 5)), maxY = Math.min(this.gridWidth - 1, Math.floor((y + radius) / 5));
    for (let cy = minY; cy <= maxY; cy++) for (let cx = minX; cx <= maxX; cx++) {
      for (let index = this.gridHead[cy * this.gridWidth + cx]; index !== -1; index = this.gridNext[index]) if (visit(this.enemies[index])) return;
    }
  }
  nearest(x: number, y: number, radius: number, exclude?: Set<number>) {
    let best: Enemy | undefined, d = radius * radius;
    this.forNearby(x, y, radius, enemy => { const q = (enemy.x - x) ** 2 + (enemy.y - y) ** 2; if (enemy.hp > 0 && q < d && !exclude?.has(enemy.id)) { best = enemy; d = q; } });
    return best;
  }
  spawnEnemy(forcedKind?: EnemyKind, elite = false) {
    if (this.enemies.length >= ENEMY_CAP) return;
    const t = this.elapsed / 60;
    const kind: EnemyKind = forcedKind || (Math.random() < Math.min(.08 + t * .04, .25) ? 'brute' : Math.random() < .18 ? 'wisp' : Math.random() < .28 ? 'cultist' : 'rat');
    const angle = rand(0, Math.PI * 2), range = rand(21, 30);
    const x = clamp(this.player.x + Math.cos(angle) * range, 2, WORLD - 2), y = clamp(this.player.y + Math.sin(angle) * range, 2, WORLD - 2);
    const base = { rat: [15, 3.2, 8, .44], cultist: [25, 2.5, 10, .55], brute: [60, 1.65, 17, .85], wisp: [17, 4, 7, .4], boss: [1050, 1.6, 27, 2.2] }[kind];
    const scale = 1 + Math.min(4, t * .27);
    const hp = base[0] * scale * (elite ? 3 : 1);
    this.enemies.push({ id: this.nextId++, x, y, hp, maxHp: hp, speed: base[1], damage: base[2], radius: base[3] * (elite ? 1.35 : 1), kind, elite, flash: 0, phase: rand(0, 6.28), attackCd: kind === 'boss' ? 1.5 : rand(1.4,3), windup: 0, facing: this.player.x < x ? -1 : 1, knockX: 0, knockY: 0, attackPhase: 0 });
  }
  dash() {
    if (this.player.dashCooldown > 0 || this.dead || this.paused || this.awaitingReward) return;
    this.player.dash = .2; this.player.invuln = .36; this.player.dashCooldown = 3.5;
    this.effect({ x: this.player.x, y: this.player.y, kind: 'ring', life: .35, max: .35, color: 0x99ffd2, size: 2 });
    this.onEvent?.('dash');
  }
  get bombRecharge() { return 45 * Math.pow(.88, this.bombRanks.recharge); }
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
    const source: Weapon = this.hero === 'ranger' ? 'thornbow' : this.hero === 'wizard' ? 'arcwand' : 'scattergun';
    const base = { ranger: 48, wizard: 54, dwarf: 66 }[this.hero] * (1 + this.bombRanks.damage * .25);
    this.forNearby(p.x, p.y, wave.radius + 3, enemy => {
      if (enemy.hp <= 0 || wave.hit.has(enemy.id)) return;
      const distance = Math.sqrt(distanceSq(enemy, p));
      if (distance > wave.radius + enemy.radius || distance < wave.previousRadius - enemy.radius) return;
      wave.hit.add(enemy.id);
      this.damage(enemy, base, source);
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
          this.damage(other, base * .45, source);
          this.effect({ x: enemy.x, y: enemy.y, x2: other.x, y2: other.y, kind: 'zap', life: .22, max: .22, color: 0x9fe7ff, size: .3 });
        });
      }
    });
    if (this.hero === 'ranger' && wave.previousRadius < 2 && wave.radius >= 2) {
      for (let i = 0; i < 24; i++) this.projectile(p.x, p.y, i * Math.PI / 12, 25, base * .35, 'thornbow', .21, 3, .65);
    }
    if (wave.age >= .6) this.bombWave = null;
  }
  private damage(enemy: Enemy, amount: number, source: Weapon) {
    if (enemy.hp <= 0) return;
    enemy.hp -= amount * (1 + this.passives.damage * .18);
    enemy.flash = .12;
    if (enemy.hp > 0) { if (Math.random() < .28) this.effect({ x: enemy.x, y: enemy.y, kind: 'hit', life: .16, max: .16, color: WEAPONS[source].color, size: .7 }); return; }
    this.stats.kills++;
    if (enemy.elite) this.stats.elites++;
    if (enemy.kind === 'boss') { this.stats.bosses++; this.onEvent?.('bossDead'); }
    this.combo++; this.comboTime = 3;
    this.score += enemy.kind === 'boss' ? 600 : enemy.elite ? 75 : 10;
    const count = enemy.kind === 'boss' ? 22 : enemy.elite ? 5 : 1;
    for (let i = 0; i < count && this.pickups.length < MAX_PICKUPS; i++) this.pickups.push({ x: enemy.x + rand(-1, 1), y: enemy.y + rand(-1, 1), kind: 'xp', value: enemy.kind === 'boss' ? 4 : enemy.elite ? 3 : 1, life: 25 });
    const chestChance = enemy.elite ? (enemy.kind === 'brute' ? .45 : .30) : enemy.kind === 'brute' ? .08 : 0;
    if (enemy.kind === 'boss' || chestChance > 0 && this.elapsed - this.lastChestTime >= 45 && !this.pickups.some(item => item.kind === 'chest') && Math.random() < chestChance) {
      const chest: Pickup = { x: enemy.x, y: enemy.y, kind: 'chest', value: 1, life: 45 };
      if (this.pickups.length < MAX_PICKUPS) this.pickups.push(chest);
      else { const xp = this.pickups.findIndex(item => item.kind === 'xp'); if (xp >= 0) this.pickups[xp] = chest; }
      this.lastChestTime = this.elapsed;
    }
    else if (this.pickups.length < MAX_PICKUPS && Math.random() < .018) this.pickups.push({ x: enemy.x, y: enemy.y, kind: 'heart', value: 18, life: 25 });
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
    if (!this.firing && weapon !== 'orbit') { const target = this.nearest(p.x, p.y, 17); if (!target) return; angle = Math.atan2(target.y - p.y, target.x - p.x); }
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
        for (let i = 0; i < 2 + rank; i++) { if (!current) break; used.add(current.id); this.effect({ x: prev.x, y: prev.y, x2: current.x, y2: current.y, kind: 'zap', life: .22, max: .22, color: 0x8ddfff, size: .2 }); this.damage(current, 15 + rank * 7, weapon); if(rank>=5){this.forNearby(current.x,current.y,2.4,other=>{if(other.hp>0&&other.id!==current!.id&&distanceSq(other,current!)<2.4**2)this.damage(other,15,weapon);});this.effect({x:current.x,y:current.y,kind:'ring',life:.24,max:.24,color:0xb5f3ff,size:2.4});} prev = current; current = this.nearest(prev.x, prev.y, 6 + rank, used); }
      }
    } else if (weapon === 'comet') {
      const target = this.nearest(p.x, p.y, 18);
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
          this.forNearby(x,y,1.1,enemy=>{const last=this.orbitHits.get(enemy.id)||0;const dx=enemy.x-x,dy=enemy.y-y;if(enemy.hp>0&&dx*dx+dy*dy<(enemy.radius+.6)**2&&this.elapsed-last>.24){this.damage(enemy,8+rank*5,weapon);this.orbitHits.set(enemy.id,this.elapsed);}});
        }
        if (rank >= 5 && this.elapsed >= this.orbitPulse) { this.orbitPulse = this.elapsed + 2.8; this.forNearby(this.player.x,this.player.y,5.5,enemy=>{if(enemy.hp>0&&distanceSq(enemy,this.player)<5.5**2)this.damage(enemy,34,weapon);});this.effect({x:this.player.x,y:this.player.y,kind:'ring',life:.55,max:.55,color:0xffe9aa,size:5.5}); }
        continue;
      }
      const rate = WEAPONS[weapon].cooldown * Math.pow(.88, rank - 1) * Math.pow(.92, this.passives.cooldown);
      this.cooldowns[weapon] = (this.cooldowns[weapon] || 0) - dt;
      if ((this.cooldowns[weapon] || 0) <= 0) { this.fireWeapon(weapon); this.cooldowns[weapon] = rate; }
    }
  }
  update(dt: number) {
    if (this.dead || this.paused || this.awaitingReward) return;
    dt = Math.min(dt, .05); this.elapsed += dt;
    this.survivalClock += dt; if(this.survivalClock>=1){this.score+=2;this.survivalClock-=1;}
    if (this.elapsed >= 720 && !this.endless && !this.cleared) { this.cleared=true; this.paused=true; return; }
    const p = this.player;
    p.invuln = Math.max(0, p.invuln - dt); p.dash = Math.max(0, p.dash - dt); p.dashCooldown = Math.max(0, p.dashCooldown - dt);
    this.bombCharge = Math.min(this.bombRecharge, this.bombCharge + dt);
    const ml = Math.hypot(this.move.x, this.move.y) || 1;
    const speed = p.speed * (1 + this.passives.speed * .1) * (p.dash > 0 ? 3.3 : 1);
    p.x = clamp(p.x + this.move.x / ml * speed * dt, 1, WORLD - 1); p.y = clamp(p.y + this.move.y / ml * speed * dt, 1, WORLD - 1);
    const facingDirection = this.firing ? this.aim.x : this.move.x;
    if (Math.abs(facingDirection) > .15) this.facing = facingDirection < 0 ? -1 : 1;
    for(const shrine of this.shrines) if(shrine.active&&distanceSq(shrine,p)<1.9**2){shrine.active=false;const healed=Math.min(25,p.maxHealth-p.health);p.health+=healed;this.xp+=18;this.effect({x:shrine.x,y:shrine.y,kind:'ring',life:.8,max:.8,color:0x74ffb4,size:7});this.effect({x:shrine.x,y:shrine.y,kind:'text',life:1.2,max:1.2,color:0xbaffd1,size:2,text:`HEAL +${Math.ceil(healed)}  ·  XP +18`});this.onEvent?.('heal');}
    this.spawnClock += dt;
    const target = Math.min(ENEMY_CAP, 70 + Math.floor(this.elapsed * 4.8));
    if (this.enemies.length < target && this.spawnClock >= Math.max(.012, .14 - this.elapsed * .00045)) { this.spawnClock = 0; const batch = Math.min(8, 1 + Math.floor(this.elapsed / 35)); for (let i = 0; i < batch; i++) this.spawnEnemy(undefined, this.elapsed > 40 && Math.random() < .025); }
    const wave = Math.floor(this.elapsed / 90);
    if (wave > this.bossWave) { this.bossWave = wave; this.spawnEnemy('boss'); this.onEvent?.('boss'); this.effect({ x: p.x, y: p.y, kind: 'text', life: 1.5, max: 1.5, color: 0xffcf85, size: 3, text: 'MOLOCH RISES' }); }
    this.chestClock += dt;
    if (this.chestClock > 36) { this.chestClock = 0; this.spawnEnemy('brute', true); }
    const alive: Enemy[] = [];
    const crowd=Math.min(1,Math.max(0,(this.enemies.length-100)/900));
    for (const e of this.enemies) {
      if (e.hp <= 0) continue;
      e.flash = Math.max(0, e.flash - dt);
      const dx = p.x - e.x, dy = p.y - e.y, d = Math.hypot(dx, dy) || 1;
      if (Math.abs(dx) > .2) e.facing = dx < 0 ? -1 : 1;
      if (Math.abs(e.knockX) + Math.abs(e.knockY) > .02) { e.x = clamp(e.x + e.knockX * dt, 1, WORLD - 1); e.y = clamp(e.y + e.knockY * dt, 1, WORLD - 1); const decay = Math.max(0, 1 - dt * 9); e.knockX *= decay; e.knockY *= decay; }
      const swirl = e.kind === 'wisp' ? Math.sin(this.elapsed * 4 + e.phase) * .48 : 0;
      const band=((e.id*2654435761)>>>0)/4294967296;
      const standOff=e.radius+.3+crowd*Math.sqrt(band)*17;
      if (d > standOff) { e.x += (dx / d - dy / d * swirl) * e.speed * dt; e.y += (dy / d + dx / d * swirl) * e.speed * dt; }
      else if(crowd>.25){const direction=e.id%2?1:-1;e.x+=-dy/d*e.speed*dt*.23*direction;e.y+=dx/d*e.speed*dt*.23*direction;}
      if(e.kind==='cultist'||e.kind==='boss'){
        e.attackCd-=dt;
        if(e.attackCd<=0&&e.windup<=0&&d<17){e.windup=e.kind==='boss'?.9:.55;e.attackCd=e.kind==='boss'?3.2:2.4+Math.random();this.effect({x:e.x,y:e.y,kind:'ring',life:e.windup,max:e.windup,color:e.kind==='boss'?0xffb97b:0xf1a0d1,size:e.radius*1.6});if(e.kind==='boss'){e.attackPhase++;if(e.attackPhase%3===0)this.effect({x:e.x,y:e.y,kind:'ring',life:.9,max:.9,color:0xff5c51,size:8});}}
        if(e.windup>0){e.windup-=dt;if(e.windup<=0&&this.enemyShots.length<280){const angle=Math.atan2(p.y-e.y,p.x-e.x);const boss=e.kind==='boss';const count=boss?12:1;for(let j=0;j<count;j++){const a=boss?j*Math.PI*2/count+this.elapsed*.12:angle;this.enemyShots.push({x:e.x,y:e.y,vx:Math.cos(a)*(boss?7:9),vy:Math.sin(a)*(boss?7:9),life:boss?3.1:2.1,damage:boss?16:8,radius:boss?.32:.23,boss});}if(boss)for(let j=-1;j<=1;j++){const a=angle+j*.22;this.enemyShots.push({x:e.x,y:e.y,vx:Math.cos(a)*11,vy:Math.sin(a)*11,life:2.3,damage:14,radius:.28,boss:true});}if(boss&&e.attackPhase%3===0)for(let j=0;j<8;j++){const a=j*Math.PI/4+this.elapsed*.25;this.enemyShots.push({x:e.x,y:e.y,vx:Math.cos(a)*4.8,vy:Math.sin(a)*4.8,life:5,damage:22,radius:.55,boss:true});}}}
      }
      if (d < e.radius + .55 && p.invuln <= 0) { p.health -= e.damage; p.invuln = .62; this.effect({ x: p.x, y: p.y, kind: 'ring', life: .3, max: .3, color: 0xff6c82, size: 1.7 }); if (p.health <= 0) { this.die(); return; } this.onEvent?.('hurt'); }
      alive.push(e);
    }
    this.enemies = alive;
    this.buildGrid();
    this.updateBomb(dt);
    this.updateWeapons(dt);
    const shots:EnemyShot[]=[];for(const shot of this.enemyShots){shot.x+=shot.vx*dt;shot.y+=shot.vy*dt;shot.life-=dt;if(shot.life<=0)continue;if(distanceSq(shot,p)<(shot.radius+.55)**2){if(p.invuln<=0){p.health=Math.max(0,p.health-shot.damage);p.invuln=.42;if(p.health<=0){this.die();return;}this.onEvent?.('hurt');}continue;}shots.push(shot);}this.enemyShots=shots;
    const pending:Strike[]=[];for(const strike of this.strikes){strike.delay-=dt;if(strike.delay>0){pending.push(strike);continue;}this.forNearby(strike.x,strike.y,strike.radius,e=>{if(e.hp>0&&distanceSq(e,strike)<strike.radius**2)this.damage(e,strike.damage,strike.source);});this.effect({x:strike.x,y:strike.y,kind:'ring',life:.45,max:.45,color:strike.source==='comet'?0xffb378:0xb89aff,size:strike.radius});this.effect({x:strike.x,y:strike.y,kind:'burst',life:.32,max:.32,color:strike.source==='comet'?0xff8b5e:0xab9dff,size:strike.radius});}this.strikes=pending;
    const projectiles: Projectile[] = [];
    for (const b of this.projectiles) {
      b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt;
      if (b.life <= 0 || b.x < 0 || b.x > WORLD || b.y < 0 || b.y > WORLD) continue;
      let spent = false;
      this.forNearby(b.x,b.y,b.radius+2.5,e=>{
        if (e.hp <= 0 || b.hit.has(e.id) || distanceSq(b, e) > (b.radius + e.radius) ** 2) return;
        b.hit.add(e.id); this.damage(e, b.damage, b.kind);
        if (b.kind === 'arcwand') { const radius = 1.4 + (this.weapons.arcwand || 1) * .36; this.forNearby(b.x,b.y,radius,other=>{if(other.hp>0&&distanceSq(b,other)<radius*radius)this.damage(other,b.damage*.45,b.kind);}); this.effect({ x: b.x, y: b.y, kind: 'ring', life: .26, max: .26, color: 0xb09aff, size: radius }); if((this.weapons.arcwand||1)>=5&&this.strikes.length<100){this.strikes.push({x:b.x,y:b.y,delay:.55,radius:3.3,damage:30,source:'arcwand'});this.effect({x:b.x,y:b.y,kind:'comet',life:.55,max:.55,color:0xc3a5ff,size:3.3});} }
        if(b.kind==='thornbow'&&(this.weapons.thornbow||1)>=5&&b.chain===0){this.forNearby(e.x,e.y,3.6,other=>{if(other.hp>0&&other.id!==e.id&&distanceSq(other,e)<3.6**2){this.damage(other,b.damage*.45,'thornbow');this.effect({x:e.x,y:e.y,x2:other.x,y2:other.y,kind:'zap',life:.24,max:.24,color:0x8ff8b0,size:.2});}});}
        if (b.pierce-- <= 0) { spent = true; return true; }
      });
      if (!spent) projectiles.push(b);
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
    else if(reward.kind==='boon'){if(reward.id==='resolve'){this.player.maxHealth+=10;this.player.health=Math.min(this.player.maxHealth,this.player.health+35);}else if(reward.id==='fury')this.passives.damage+=1/3;else this.passives.speed+=.5;}
    else this.player.health = Math.min(this.player.maxHealth, this.player.health + 35);
    this.awaitingReward = false;
  }
  swapBackpack(index: number, slot: number) {
    if (index < 0 || index >= this.backpack.length || slot < 0 || slot >= this.slots.length) return;
    [this.slots[slot], this.backpack[index]] = [this.backpack[index], this.slots[slot]];
  }
  stress(count: number) { this.rankable = false; const additions = Math.min(Math.max(0, Math.floor(count)), ENEMY_CAP - this.enemies.length); for (let i = 0; i < additions; i++) this.spawnEnemy('rat'); }
  defeatBossDebug() { this.rankable = false; const boss = this.enemies.find(enemy => enemy.kind === 'boss' && enemy.hp > 0); if (boss) this.damage(boss, 1e9, 'thornbow'); }
}
