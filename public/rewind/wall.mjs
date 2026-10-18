export const WALL_CONFIG = Object.freeze({
  columns: 10,
  depth: 2,
  rowsVisible: 18,
  blockGap: 0.075,
  seed: 4127,
  phases: [0, 16, 32, 44, 59.54],
  heights: [2, 52, 103, 139],
  attackEaseSeconds: .12,
  collapseFloorRatio: .72,
  collapseBursts: 64,
  breakDurationSeconds: 11,
  debrisTimeScale: .5,
  maxActiveDebris: 100,
  maxActiveParticles: 600,
});

const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const smooth = n => { n = clamp(n, 0, 1); return n * n * (3 - 2 * n); };
const hash = n => {
  let x = (n ^ WALL_CONFIG.seed) | 0;
  x = Math.imul(x ^ x >>> 16, 0x7feb352d);
  x = Math.imul(x ^ x >>> 15, 0x846ca68b);
  return ((x ^ x >>> 16) >>> 0) / 4294967296;
};

// The wall is derived from time alone, so seeking and pausing never depend on old frames.
function upperBound(onsets, t) {
  let low = 0, high = onsets.length;
  while (low < high) {
    const mid = (low + high) >>> 1;
    if (onsets[mid].time <= t) low = mid + 1;
    else high = mid;
  }
  return low;
}

function attackRise(onsets, t) {
  if (!onsets.length) return 0;
  const completed = upperBound(onsets, t - WALL_CONFIG.attackEaseSeconds);
  const started = upperBound(onsets, t);
  let rows = completed;
  for (let i = completed; i < started; i++) {
    rows += smooth((t - onsets[i].time) / WALL_CONFIG.attackEaseSeconds);
  }
  return rows;
}

export function buildHeightAt(t, onsets = []) {
  const { phases, heights } = WALL_CONFIG;
  let base;
  if (t < phases[1]) base = heights[0] + (heights[1] - heights[0]) * clamp(t / phases[1], 0, 1);
  else if (t < phases[2]) base = heights[1] + (heights[2] - heights[1]) * (t - phases[1]) / (phases[2] - phases[1]);
  else base = heights[2] + (heights[3] - heights[2]) * (t - phases[2]) / (phases[3] - phases[2]);
  return base + attackRise(onsets, t);
}

export function structureAt(seconds, duration = WALL_CONFIG.phases.at(-1), onsets = [], history = []) {
  const t = clamp(seconds / Math.max(duration || 1, 1), 0, 1) * WALL_CONFIG.phases.at(-1);
  let active = null;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].start <= t) { active = history[i]; break; }
  }
  let height = buildHeightAt(t, onsets), segment = t < WALL_CONFIG.phases[1] ? 0 : t < WALL_CONFIG.phases[2] ? 1 : 2;
  let progress = 0, breaking = false;
  if (active) {
    if (t < active.end) {
      progress = clamp((t - active.start) / (active.end - active.start), 0, 1);
      height = active.peak + (active.floor - active.peak) * smooth(progress);
      segment = 3; breaking = true;
    } else {
      height = active.floor + buildHeightAt(t, onsets) - buildHeightAt(active.end, onsets);
      segment = 4;
    }
  }
  const latest = upperBound(onsets, t) - 1;
  const flash = latest >= 0 ? clamp(1 - (t - onsets[latest].time) / .28, 0, 1) * onsets[latest].strength : 0;
  return { t, segment, progress, height, peak: active?.peak ?? height, floor: active?.floor ?? height,
    flash, breaking, activeBreak: active };
}

const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const subtract = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const normalize = a => { const length = Math.hypot(...a) || 1; return a.map(v => v / length); };
const radians = degrees => degrees * Math.PI / 180;

// Time, crest, and viewport are the only camera inputs. Seeking derives the same view.
export function cameraAt(t, crest, viewport, reducedMotion = false, verticalOrbit = null) {
  const compact = viewport.width < 650;
  const turn = t * Math.PI * 2 / 24 - Math.PI / 3;
  const yaw = radians((reducedMotion ? -32 : 45 * Math.sin(turn)) + (verticalOrbit?.yaw || 0));
  const elevation = radians((reducedMotion ? 17 : 17 + 5 * Math.sin(turn + .7)) + (verticalOrbit?.pitch || 0));
  const bank = radians((reducedMotion ? 0 : 3 * Math.cos(turn)) + (verticalOrbit?.roll || 0));
  const distance = reducedMotion ? 22.5 : 22.5 * (1 + .04 * Math.sin(turn * .8 + .2));
  const target = [WALL_CONFIG.columns / 2, crest - 1, WALL_CONFIG.depth / 2];
  const position = [
    target[0] + Math.sin(yaw) * Math.cos(elevation) * distance,
    target[1] + Math.sin(elevation) * distance,
    target[2] + Math.cos(yaw) * Math.cos(elevation) * distance,
  ];
  const forward = normalize(subtract(target, position));
  const levelRight = normalize(cross(forward, [0, 1, 0]));
  const levelUp = normalize(cross(levelRight, forward));
  const right = levelRight.map((v, i) => v * Math.cos(bank) + levelUp[i] * Math.sin(bank));
  const up = levelUp.map((v, i) => v * Math.cos(bank) - levelRight[i] * Math.sin(bank));
  const unit = clamp(Math.min(viewport.width / (compact ? 11.5 : 16), viewport.height / (compact ? 11 : 12.8)), 19, compact ? 44 : 68);
  return { position, target, forward, right, up, yaw, elevation, bank, distance,
    focal: unit * 22.5, unit, centerX: viewport.width * .5,
    centerY: viewport.height * (compact ? .55 : .60) };
}

function projectPoint(camera, point) {
  const offset = subtract(point, camera.position);
  const depth = dot(offset, camera.forward);
  if (depth <= .25) return null;
  return { x: camera.centerX + camera.focal * dot(offset, camera.right) / depth,
    y: camera.centerY - camera.focal * dot(offset, camera.up) / depth, depth };
}

const FACES = [
  { corners: [4, 5, 6, 7], normal: [0, 0, 1], kind: 'front' },
  { corners: [0, 3, 2, 1], normal: [0, 0, -1], kind: 'front' },
  { corners: [1, 2, 6, 5], normal: [1, 0, 0], kind: 'side' },
  { corners: [0, 4, 7, 3], normal: [-1, 0, 0], kind: 'side' },
  { corners: [3, 7, 6, 2], normal: [0, 1, 0], kind: 'top' },
  { corners: [0, 1, 5, 4], normal: [0, -1, 0], kind: 'top' },
];
const CUBE_SIGNS = [-1,-1,-1, 1,-1,-1, 1,1,-1, -1,1,-1,
  -1,-1,1, 1,-1,1, 1,1,1, -1,1,1];

const collapseCache = new WeakMap();
export function collapseEvents(breakEvent) {
  if (collapseCache.has(breakEvent)) return collapseCache.get(breakEvent);
  const events = [];
  const { start, end, peak, floor } = breakEvent;
  for (let i = 0; i < WALL_CONFIG.collapseBursts; i++) {
    const index = breakEvent.id * 1000 + i;
    const time = start + (i + .2 + hash(index + 501) * .6) / WALL_CONFIG.collapseBursts * (end - start);
    const crest = peak + (floor - peak) * smooth((time - start) / (end - start));
    const basis = cameraAt(time, crest, { width: 1000, height: 800 });
    events.push(Object.freeze({ index, time, crest, x: .5 + Math.floor(hash(index + 384) * WALL_CONFIG.columns),
      z: .5 + Math.floor(hash(index + 397) * WALL_CONFIG.depth), right: basis.right, up: basis.up, forward: basis.forward }));
  }
  const frozen = Object.freeze(events);
  collapseCache.set(breakEvent, frozen);
  return frozen;
}

export function drawWall(ctx, width, height, seconds, duration, energy = {}, pointer = null, reducedMotion = false, onsets = [], history = [], verticalOrbit = null, fallback = false, fractal = false) {
  const state = structureAt(seconds, duration, onsets, history);
  const camera = cameraAt(state.t, state.height, { width, height }, reducedMotion, verticalOrbit);
  const bass = reducedMotion ? 0 : clamp(energy.bass || 0, 0, 1);
  const mid = reducedMotion ? 0 : clamp(energy.mid || 0, 0, 1);
  const treble = reducedMotion ? 0 : clamp(energy.treble || 0, 0, 1);

  ctx.clearRect(0, 0, width, height);
  if (fallback) {
    ctx.fillStyle = '#eee9dc'; ctx.fillRect(0, 0, width, height);
    for (const [x,y,size,color] of [[.23,.48,.48,'rgba(93,135,133,.21)'],[.77,.31,.47,'rgba(102,130,145,.18)'],[.59,.76,.42,'rgba(176,119,82,.16)']]) {
      const wash = ctx.createRadialGradient(width*x,height*y,0,width*x,height*y,Math.max(width,height)*size);
      wash.addColorStop(0,color); wash.addColorStop(1,'rgba(255,255,255,0)');
      ctx.fillStyle=wash; ctx.fillRect(0,0,width,height);
    }
  }

  const renderedFaces = [];
  const projected = new Float64Array(24);
  let faceOrder = 0;
  function addCuboid(center, scale, alpha, id, row, angles = [0, 0, 0], debris = false) {
    const h = scale / 2;
    const projectedCenter = projectPoint(camera, center);
    if (!projectedCenter || projectedCenter.x < -width * .35 || projectedCenter.x > width * 1.35 ||
        projectedCenter.y < -height * .35 || projectedCenter.y > height * 1.35) return;
    let r00=1,r01=0,r02=0,r10=0,r11=1,r12=0,r20=0,r21=0,r22=1;
    if (angles[0] || angles[1] || angles[2]) {
      const [rx,ry,rz]=angles;
      const cx=Math.cos(rx),sx=Math.sin(rx),cy=Math.cos(ry),sy=Math.sin(ry),cz=Math.cos(rz),sz=Math.sin(rz);
      r00=cz*cy; r01=cz*sy*sx-sz*cx; r02=cz*sy*cx+sz*sx;
      r10=sz*cy; r11=sz*sy*sx+cz*cx; r12=sz*sy*cx-cz*sx;
      r20=-sy; r21=cy*sx; r22=cy*cx;
    }
    for (let i=0;i<8;i++) {
      const offset=i*3,sx=CUBE_SIGNS[offset]*h,sy=CUBE_SIGNS[offset+1]*h,sz=CUBE_SIGNS[offset+2]*h;
      const x=center[0]+r00*sx+r01*sy+r02*sz;
      const y=center[1]+r10*sx+r11*sy+r12*sz;
      const z=center[2]+r20*sx+r21*sy+r22*sz;
      const dx=x-camera.position[0],dy=y-camera.position[1],dz=z-camera.position[2];
      const depth=dx*camera.forward[0]+dy*camera.forward[1]+dz*camera.forward[2];
      if (depth<=.25 || (debris&&depth<3)) return;
      projected[offset]=camera.centerX+camera.focal*(dx*camera.right[0]+dy*camera.right[1]+dz*camera.right[2])/depth;
      projected[offset+1]=camera.centerY-camera.focal*(dx*camera.up[0]+dy*camera.up[1]+dz*camera.up[2])/depth;
      projected[offset+2]=depth;
    }
    const active = pointer?.active && projectedCenter && Math.hypot(projectedCenter.x - pointer.x, projectedCenter.y - pointer.y) < camera.unit * 2.1;
    const crownFlash = row >= Math.floor(state.height) - 1 && state.flash > .12;
    const copper = hash(id + 97) > .9 || (treble > .18 && hash(id + 17) > .82) || active || crownFlash || (debris && id % 6 === 0);
    for (const face of FACES) {
      const [nx,ny,nz]=face.normal;
      const fx=r00*nx+r01*ny+r02*nz,fy=r10*nx+r11*ny+r12*nz,fz=r20*nx+r21*ny+r22*nz;
      if (fx*(camera.position[0]-center[0]-fx*h)+fy*(camera.position[1]-center[1]-fy*h)+
          fz*(camera.position[2]-center[2]-fz*h)<=0) continue;
      const [a,b,c,d]=face.corners,ai=a*3,bi=b*3,ci=c*3,di=d*3;
      const depth=(projected[ai+2]+projected[bi+2]+projected[ci+2]+projected[di+2])/4;
      renderedFaces.push({ coords:[projected[ai],projected[ai+1],projected[bi],projected[bi+1],
        projected[ci],projected[ci+1],projected[di],projected[di+1]], depth, alpha, copper,
        crownFlash, kind:face.kind, debris, order:faceOrder++ });
    }
  }

  const bottom = Math.max(0, Math.floor(state.height - WALL_CONFIG.rowsVisible - 5));
  const top = Math.ceil(state.height + 1);
  for (let row = bottom; row <= top; row++) {
    for (let z = 0; z < WALL_CONFIG.depth; z++) {
      for (let col = 0; col < WALL_CONFIG.columns; col++) {
        const id = row * 100 + z * 19 + col;
        const threshold = row + (hash(id) - .5) * .62;
        const appear = clamp((state.height - threshold) * 2.5, 0, 1);
        if (appear <= 0) continue;
        const pulse = 1 + bass * .085 + mid * .025 * Math.sin(state.t * 4 + id * .7);
        const scale = (1 - WALL_CONFIG.blockGap) * pulse;
        const lift = (1 - smooth(appear)) * (2.1 + hash(id + 8) * 1.4);
        const wobble = reducedMotion ? 0 : Math.sin(state.t * 2.1 + id * 1.3) * bass * .035;
        addCuboid([col + .5 + (row % 2 ? .26 : 0) + wobble, row + .5 - lift, z + .5], scale, smooth(appear), id, row);
      }
    }
  }

  if (history.length && !reducedMotion) {
    let activeCuboids = 0, activeParticles = 0;
    const compact = width < 650;
    const positionAt = (event, age, descent, sideways, vertical, depthSpeed) => {
      const travel = age / (1 + .22 * age);
      const velocity = event.right.map((value, axis) => value * sideways + event.up[axis] * vertical + event.forward[axis] * depthSpeed);
      return [event.x + velocity[0] * travel, event.crest + .5 - .85 * descent + velocity[1] * travel - 1.8 * age * age,
        event.z + velocity[2] * travel];
    };
    const visibleEvents = [];
    for (let i = 0; i < history.length; i++) {
      const breakEvent = history[i];
      if (breakEvent.start > state.t) break;
      const supersededAt = history[i + 1]?.start ?? Infinity;
      for (const event of collapseEvents(breakEvent)) {
        if (event.time >= supersededAt) break;
        if (event.time <= state.t && state.t - event.time <= 2.7 / WALL_CONFIG.debrisTimeScale) visibleEvents.push(event);
      }
    }
    visibleEvents.sort((a, b) => b.time - a.time);
    for (const event of visibleEvents) {
      const age = (state.t - event.time) * WALL_CONFIG.debrisTimeScale;
      if (age < 0 || age > 2.7) continue;
      const descent = Math.max(0, event.crest - state.height);
      const side = event.x < WALL_CONFIG.columns / 2 ? -1 : 1;
      const depthClass = event.index % 4;
      const depthSpeed = depthClass === 0 ? -8.2 : depthClass === 1 ? 7.4 : depthClass === 2 ? -2.2 : 2.2;
      const hold = .4 + hash(event.index + 611) * .15;
      const count = 2 + (hash(event.index + 619) > .57 ? 1 : 0);
      if (age < hold + .64) {
        for (let j = 0; j < count && activeCuboids < WALL_CONFIG.maxActiveDebris; j++) {
          const seed = event.index * 31 + j;
          const sideways = side * (2.2 + hash(seed + 701) * 3.5) + (j - 1) * 1.2;
          const vertical = (hash(seed + 719) > .5 ? 1 : -1) * (1.5 + hash(seed + 727) * 3.4);
          const center = positionAt(event, age, descent, sideways, vertical, depthSpeed + (j - 1) * .9);
          const fracture = smooth((age - hold) / .64);
          const scale = .78 * (1 - .84 * fracture);
          const alpha = .8 * (1 - fracture);
          const turn = age * (2.1 + hash(seed + 739) * 2.3);
          addCuboid(center, scale, alpha, 100000 + seed, Math.floor(event.crest),
            [turn * .65, turn * .8, side * turn], true);
          activeCuboids++;
        }
      }

      const chipAge = age - hold;
      if (chipAge < 0 || chipAge > 2.2) continue;
      const chips = compact ? 4 + Math.floor(hash(event.index + 751) * 3) : 8 + Math.floor(hash(event.index + 751) * 5);
      for (let j = 0; j < chips && activeParticles < WALL_CONFIG.maxActiveParticles / (compact ? 2 : 1); j++) {
        const seed = event.index * 37 + j;
        const life = 1.5 + hash(seed + 809) * .7;
        if (chipAge > life) continue;
        const sideways = side * (2.4 + hash(seed + 811) * 2.4);
        const vertical = (hash(seed + 821) > .5 ? 1 : -1) * (1.3 + hash(seed + 823) * 2.5);
        const scatterR = (hash(seed + 827) - .5) * 5;
        const scatterU = (hash(seed + 829) - .5) * 4;
        const scatterF = (hash(seed + 839) - .5) * 4;
        const chipPosition = at => {
          const parent = positionAt(event, hold + at, descent, sideways, vertical, depthSpeed);
          const drift = at / (1 + .55 * at);
          const curl = Math.sin(at * 5.5 + seed) * at * .48;
          return parent.map((value, axis) => value + event.right[axis] * (scatterR * drift + curl)
            + event.up[axis] * (scatterU * drift + Math.cos(at * 4.6 + seed) * at * .24)
            + event.forward[axis] * scatterF * drift - (axis === 1 ? .85 * at * at : 0));
        };
        const point = projectPoint(camera, chipPosition(chipAge));
        if (!point || point.depth < 3 || point.x < -width * .2 || point.x > width * 1.2 ||
            point.y < -height * .2 || point.y > height * 1.2) continue;
        const previous = projectPoint(camera, chipPosition(Math.max(0, chipAge - .07))) || point;
        const radius = clamp(camera.focal / point.depth * (.025 + hash(seed + 853) * .035), .6, 2.4);
        renderedFaces.push({ type: 'particle', depth: point.depth, point, previous, radius,
          alpha: .65 * (1 - smooth(chipAge / life)), copper: hash(seed + 857) > .7, order:faceOrder++ });
        activeParticles++;
      }
    }
  }

  renderedFaces.sort((a, b) => b.depth - a.depth || a.order - b.order);
  for (const face of renderedFaces) {
    if (face.type === 'particle') {
      const { point, previous, radius, alpha, copper } = face;
      const tailX = previous.x - point.x, tailY = previous.y - point.y;
      const length = Math.hypot(tailX, tailY);
      const tailScale = Math.min(1, 12 / (length || 1));
      ctx.beginPath(); ctx.moveTo(point.x, point.y);
      ctx.lineTo(point.x + tailX * tailScale, point.y + tailY * tailScale);
      ctx.strokeStyle = copper ? `rgba(244,184,104,${alpha})` : fractal ? `rgba(211,240,251,${alpha * .78})` : `rgba(45,49,45,${alpha * .78})`;
      ctx.lineWidth = radius * .75; ctx.stroke();
      ctx.beginPath(); ctx.arc(point.x, point.y, radius * .48, 0, Math.PI * 2);
      ctx.fillStyle = copper ? `rgba(244,184,104,${alpha})` : fractal ? `rgba(211,240,251,${alpha})` : `rgba(45,49,45,${alpha})`;
      ctx.fill();
      continue;
    }
    const { coords, alpha, copper, crownFlash, kind, debris } = face;
    const shade = kind === 'front' ? .55 : kind === 'side' ? .42 : .40;
    const edgeOpacity = Math.min(.96, shade + mid * .15 + (crownFlash ? state.flash * .30 : 0)) * alpha;
    const color = copper ? (fractal ? '248,188,113' : '147,94,57') : (fractal ? '207,238,247' : '40,45,43');
    const fillOpacity = (kind === 'top' ? (fractal ? .075 : .20) : kind === 'side' ? (fractal ? .12 : .035) : (fractal ? .15 : .055)) * alpha;
    ctx.beginPath(); ctx.moveTo(coords[0], coords[1]);
    for (let i = 2; i < coords.length; i += 2) ctx.lineTo(coords[i], coords[i+1]);
    ctx.closePath();
    ctx.fillStyle = fractal ? `rgba(5,23,38,${fillOpacity})` : kind === 'top' ? `rgba(255,252,243,${fillOpacity})` : `rgba(251,248,237,${fillOpacity})`;
    ctx.fill();
    ctx.strokeStyle = `rgba(${color},${edgeOpacity})`;
    ctx.lineWidth = debris ? 1 : copper ? 1.15 : .8;
    ctx.stroke();
  }
  return state;
}
