import { EMPTY, SAND, WATER, STONE, WOOD, FIRE, PLANT, OIL, LAVA, STEAM, ASH, GLASS, SEED, ACID } from './materials.js';

export function seededRandom(seed = 1) {
  let state = seed >>> 0;
  return () => {
    state += 0x6D2B79F5;
    let v = state;
    v = Math.imul(v ^ v >>> 15, v | 1);
    v ^= v + Math.imul(v ^ v >>> 7, v | 61);
    return ((v ^ v >>> 14) >>> 0) / 4294967296;
  };
}
const PRESET_SEEDS = { riverbed: 1307, 'pocket-volcano': 2791, 'tiny-forest': 4567, 'acid-rain': 6803, empty: 1 };
const ADJACENT = [[-1,0],[1,0],[0,-1],[0,1]];
export const GROWTH = Object.freeze({ DORMANT: 0, GROWING: 1, SPENT: 2 });

export class World {
  constructor(width = 256, height = 160, random = seededRandom(7)) {
    this.width = width; this.height = height;
    this.cells = new Uint8Array(width * height);
    this.life = new Uint8Array(width * height);
    this.updated = new Uint32Array(width * height);
    this.reacted = new Uint32Array(width * height);
    this.growthState = new Uint8Array(width * height);
    this.growthDirection = new Int8Array(width * height);
    this.growthDepth = new Uint8Array(width * height);
    this.tickCount = 0; this.random = random;
  }
  index(x,y) { return x + y * this.width; }
  inBounds(x,y) { return x >= 0 && y >= 0 && x < this.width && y < this.height; }
  get(x,y) { return this.inBounds(x,y) ? this.cells[this.index(x,y)] : STONE; }
  set(x,y,type,age = 0) {
    if (!this.inBounds(x,y)) return false;
    const i = this.index(x,y);
    this.cells[i] = type; this.life[i] = age;
    this.growthState[i] = GROWTH.DORMANT;
    this.growthDirection[i] = 0;
    this.growthDepth[i] = 0;
    this.updated[i] = this.tickCount; this.reacted[i] = this.tickCount;
    return true;
  }
  activatePlant(x,y,fuel,direction=0,depth=0) {
    if (!this.inBounds(x,y) || this.get(x,y)!==PLANT) return false;
    const i=this.index(x,y);
    if (this.growthState[i]!==GROWTH.DORMANT) return false;
    this.growthState[i]=GROWTH.GROWING;
    this.life[i]=Math.max(1,Math.min(220,Math.floor(fuel)));
    this.growthDirection[i]=direction;
    this.growthDepth[i]=depth;
    return true;
  }
  clear() { this.cells.fill(0); this.life.fill(0); this.updated.fill(0); this.reacted.fill(0); this.growthState.fill(0); this.growthDirection.fill(0); this.growthDepth.fill(0); this.tickCount = 0; }
  move(x,y,nx,ny,displaced = EMPTY) {
    if (!this.inBounds(nx,ny)) return false;
    const a = this.index(x,y), b = this.index(nx,ny);
    if (this.cells[b] !== displaced) return false;
    const type = this.cells[a], age = this.life[a], otherAge = this.life[b];
    const state=this.growthState[a],otherState=this.growthState[b],direction=this.growthDirection[a],otherDirection=this.growthDirection[b],depth=this.growthDepth[a],otherDepth=this.growthDepth[b];
    this.cells[b] = type; this.life[b] = age;
    this.cells[a] = displaced; this.life[a] = otherAge;
    this.growthState[b]=state; this.growthState[a]=otherState;
    this.growthDirection[b]=direction; this.growthDirection[a]=otherDirection;
    this.growthDepth[b]=depth; this.growthDepth[a]=otherDepth;
    this.updated[a] = this.tickCount; this.updated[b] = this.tickCount;
    return true;
  }
  paint(cx,cy,type,radius = 3) {
    const r = Math.max(1,Math.min(20,Math.round(radius)));
    for (let dy=-r;dy<=r;dy++) for (let dx=-r;dx<=r;dx++) {
      if (dx*dx+dy*dy>r*r || this.random()>.95) continue;
      const x=cx+dx,y=cy+dy;
      if (!this.inBounds(x,y)) continue;
      if (type===EMPTY || this.get(x,y)===EMPTY || [WATER,OIL,STEAM,ACID].includes(this.get(x,y))) this.set(x,y,type);
    }
  }
  seed(kind='riverbed') {
    if (!(kind in PRESET_SEEDS)) return false;
    this.clear(); this.random=seededRandom(PRESET_SEEDS[kind]);
    if (kind==='empty') return true;
    const w=this.width,h=this.height,base=Math.floor(h*.78);
    const put=(x,y,type,age)=>this.set(Math.round(x),Math.round(y),type,age);
    const disc=(cx,cy,r,type)=>{ for(let y=Math.floor(cy-r);y<=cy+r;y++) for(let x=Math.floor(cx-r);x<=cx+r;x++) if((x-cx)**2+(y-cy)**2<r*r && this.random()>.1) put(x,y,type); };
    const surfaceAt=x=>base+Math.floor(3*Math.sin(x*.048)+2*Math.sin(x*.12));
    for(let x=0;x<w;x++) { const surface=surfaceAt(x); for(let y=surface;y<h;y++) put(x,y,y>surface+8?STONE:SAND); }
    if(kind==='riverbed') {
      for(let x=Math.floor(w*.07);x<w*.44;x++) for(let y=Math.floor(h*.63);y<base+4;y++) put(x,y,WATER);
      for(let x=Math.floor(w*.57);x<w*.88;x+=11) { for(let y=base-12;y<base-2;y++) put(x,y,WOOD); put(x-1,base-13,PLANT); put(x,base-14,PLANT); put(x+1,base-13,PLANT); }
      disc(w*.75,h*.26,10,SAND);
    } else if(kind==='pocket-volcano') {
      disc(w*.52,base-17,22,STONE); disc(w*.52,base-20,12,LAVA);
      for(let x=14;x<w*.29;x++) for(let y=base-10;y<base;y++) put(x,y,WATER);
      for(let x=w*.73;x<w*.88;x+=4) put(x,base-12,WOOD);
    } else if(kind==='tiny-forest') {
      for(const x of [28,75,122,169,216]) {
        const y=surfaceAt(x)-1;
        put(x,y,SEED);
        put(x+1,y,WATER);
        put(x+2,y,STONE);
        put(x-1,y+1,STONE); put(x,y+1,STONE); put(x+1,y+1,STONE); put(x+2,y+1,STONE);
      }
      for(let x=8;x<w-8;x+=17) put(x,base-8,SEED);
    } else if(kind==='acid-rain') {
      for(let x=12;x<w-12;x+=15) { for(let y=base-14;y<base-2;y++) put(x,y,STONE); put(x+1,base-15,WOOD); }
      for(let x=20;x<w-20;x+=7) for(let y=12+x%5;y<20+x%5;y++) put(x,y,ACID);
      disc(w*.5,base-8,9,PLANT);
    }
    return true;
  }
  step() {
    this.tickCount++;
    const w=this.width,h=this.height,odd=this.tickCount&1;
    for(let y=h-1;y>=0;y--) for(let n=0;n<w;n++) {
      const x=odd?n:w-1-n,i=this.index(x,y),type=this.cells[i];
      if(!type || this.updated[i]===this.tickCount) continue;
      const d=this.random()<.5?-1:1;
      if(type===SAND || type===ASH || type===SEED) {
        if(this.move(x,y,x,y+1)||this.move(x,y,x+d,y+1)||this.move(x,y,x-d,y+1)) continue;
        if(type===SAND || type===SEED) this.move(x,y,x,y+1,WATER)||this.move(x,y,x+d,y+1,WATER)||this.move(x,y,x-d,y+1,WATER);
      } else if(type===WATER || type===OIL || type===ACID || type===LAVA) {
        if(type===LAVA && this.random()>.32) continue;
        if(this.move(x,y,x,y+1)||this.move(x,y,x+d,y+1)||this.move(x,y,x-d,y+1)||this.move(x,y,x+d,y)||this.move(x,y,x-d,y)) continue;
        if(type===WATER) this.move(x,y,x,y+1,OIL);
      }
    }
    for(let y=0;y<h;y++) for(let n=0;n<w;n++) {
      const x=odd?w-1-n:n,i=this.index(x,y),type=this.cells[i];
      if((type!==STEAM && type!==FIRE)||this.updated[i]===this.tickCount) continue;
      const d=this.random()<.5?-1:1;
      this.move(x,y,x,y-1)||this.move(x,y,x+d,y-1)||this.move(x,y,x-d,y-1)||this.move(x,y,x+d,y);
    }
    for(let y=0;y<h;y++) for(let n=0;n<w;n++) {
      const x=odd?n:w-1-n,i=this.index(x,y),type=this.cells[i];
      if(!type || this.reacted[i]===this.tickCount) continue;
      this.reacted[i]=this.tickCount;
      const near=ADJACENT.map(([dx,dy])=>[x+dx,y+dy]);
      if(type===FIRE) {
        if(this.life[i]++>10+this.random()*15) { this.set(x,y,this.random()<.2?ASH:EMPTY); continue; }
        for(const [nx,ny] of near) {
          const other=this.get(nx,ny);
          if(other===WATER && this.random()<.38) { this.set(nx,ny,STEAM); this.set(x,y,STEAM); break; }
          if([WOOD,PLANT,OIL,SEED].includes(other)&&this.random()<(other===OIL?.65:.12)) this.set(nx,ny,FIRE);
        }
      } else if(type===STEAM) {
        if(this.life[i]++>80+this.random()*60) this.set(x,y,this.random()<.6?WATER:EMPTY);
      } else if(type===SEED) {
        const supported=[SAND,STONE,WOOD,PLANT].includes(this.get(x,y+1));
        const water=near.find(([nx,ny])=>this.get(nx,ny)===WATER);
        if(supported && water && this.random()<.5) {
          this.set(water[0],water[1],EMPTY);
          this.set(x,y,PLANT);
          this.activatePlant(x,y,220);
        }
      } else if(type===PLANT) {
        if(near.some(([nx,ny])=>this.get(nx,ny)===LAVA)) { this.set(x,y,FIRE); continue; }
        if(this.growthState[i]===GROWTH.DORMANT) {
          const water=near.find(([nx,ny])=>this.get(nx,ny)===WATER);
          if(water) { this.set(water[0],water[1],EMPTY); this.activatePlant(x,y,70); }
        }
        if(this.growthState[i]===GROWTH.GROWING) this.growPlant(x,y);
      } else if(type===LAVA) {
        for(const [nx,ny] of near) {
          const other=this.get(nx,ny);
          if(other===WATER && this.random()<.48) { this.set(nx,ny,STEAM); this.set(x,y,STONE); break; }
          if([WOOD,PLANT,OIL,SEED].includes(other)&&this.random()<.24) this.set(nx,ny,FIRE);
          if(other===SAND && this.random()<.025) this.set(nx,ny,GLASS);
        }
      } else if(type===ACID) {
        for(const [nx,ny] of near) {
          if(![SAND,STONE,WOOD,PLANT,SEED].includes(this.get(nx,ny))) continue;
          if(this.random()<.16) { this.set(nx,ny,EMPTY); if(this.random()<.28) this.set(x,y,EMPTY); break; }
        }
      } else if(type===WATER) {
        for(const [nx,ny] of near) if(this.get(nx,ny)===FIRE && this.random()<.36) { this.set(nx,ny,STEAM); break; }
      }
    }
  }
  growPlant(x,y) {
    const i=this.index(x,y),fuel=this.life[i],depth=this.growthDepth[i],direction=this.growthDirection[i];
    if (fuel<=1 || depth>=58 || (depth>=14 && fuel<=16)) { this.bloomPlant(x,y); return; }
    if (this.random()>.45) return;
    const ny=y-1;
    const drift=direction && this.random()<.55 ? direction : 0;
    const candidates=[[x+drift,ny],[x,ny],[x+direction,ny],[x-1,ny],[x+1,ny]];
    const target=candidates.find(([nx,ty])=>this.inBounds(nx,ty)&&this.get(nx,ty)===EMPTY);
    if (!target) { this.bloomPlant(x,y); return; }
    let branchTarget=null,branchFuel=0;
    if (depth>=10 && depth%8===2 && fuel>24 && this.random()<.82) {
      const side=direction===0 ? (this.random()<.5?-1:1) : -direction;
      const bx=x+side;
      if ((bx!==target[0] || ny!==target[1]) && this.inBounds(bx,ny) && this.get(bx,ny)===EMPTY) {
        branchTarget=[bx,ny,side];
        branchFuel=Math.floor((fuel-2)*.23);
      }
    }
    const mainFuel=fuel-1-(branchTarget ? branchFuel+1 : 0);
    this.growthState[i]=GROWTH.SPENT; this.life[i]=0;
    this.set(target[0],target[1],PLANT);
    this.activatePlant(target[0],target[1],mainFuel,direction,depth+1);
    if (branchTarget) {
      this.set(branchTarget[0],branchTarget[1],PLANT);
      this.activatePlant(branchTarget[0],branchTarget[1],branchFuel,branchTarget[2],depth+1);
    }
  }
  bloomPlant(x,y) {
    const i=this.index(x,y),budget=Math.max(0,this.life[i]-1);
    this.growthState[i]=GROWTH.SPENT; this.life[i]=0;
    if (!budget) return;
    const candidates=[];
    for(let dy=-3;dy<=2;dy++) for(let dx=-3;dx<=3;dx++) {
      const distance=dx*dx+dy*dy;
      if(distance>9 || (dx===0 && dy===0)) continue;
      const nx=x+dx,ny=y+dy;
      if(this.inBounds(nx,ny) && this.get(nx,ny)===EMPTY) candidates.push({nx,ny,distance,bias:this.random()});
    }
    candidates.sort((a,b)=>a.distance-b.distance || a.bias-b.bias);
    let remaining=budget,grew=true;
    while(remaining>0 && grew) {
      grew=false;
      for(let n=0;n<candidates.length && remaining>0;n++) {
        const {nx,ny}=candidates[n];
        if(this.get(nx,ny)!==EMPTY || !ADJACENT.some(([dx,dy])=>this.get(nx+dx,ny+dy)===PLANT)) continue;
        this.set(nx,ny,PLANT);
        this.growthState[this.index(nx,ny)]=GROWTH.SPENT;
        candidates.splice(n--,1);
        remaining--; grew=true;
      }
    }
  }
  counts() { let active=0; const kinds=new Set(); for(const type of this.cells) if(type) { active++; kinds.add(type); } return {active,kinds:kinds.size}; }
}
