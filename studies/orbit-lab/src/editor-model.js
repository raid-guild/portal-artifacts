import { validateLevelDocument } from './level-document.js';
import { compiledWallGeometry, unionAxisWalls } from './wall-geometry.js';
import { orbitRingPreset, validateOrbitPresetPlacement } from './orbit.js';
const copy = value => structuredClone(value);
const duplicateOffsets = [[2,2],[-2,2],[2,-2],[-2,-2],[4,0],[-4,0],[0,4],[0,-4]];
const inside = (point, bounds, margin = 0) => point.x - margin >= bounds.minX && point.x + margin <= bounds.maxX && point.y - margin >= bounds.minY && point.y + margin <= bounds.maxY;
function nextUniqueId(prefix, used) {
  let n = 1;
  while (used.has(`${prefix}-${n}`)) n++;
  const id = `${prefix}-${n}`;
  used.add(id);
  return id;
}
export const EDITOR_DRAFT_KEY = 'orbit-lab-editor-draft-v1';
export function makeBlankLevelDocument() {
  return {
    version: 1, id: 'untitled-level', title: 'Untitled crossing',
    bounds: { minX: -20, maxX: 76, minY: -27, maxY: 27 },
    settings: { startLight: .6, burnRate: .018, graceSeconds: 8, wellStrength: 70, wellLifetime: 8, maxActiveWells: 2, maxTotalWells: null, randomRecharge: true },
    start: { x: 0, y: 0, direction: 0, speed: 1.8 },
    exit: { x: 50, y: 0, radius: 1.5, gravity: 5 },
    walls: [], wallPaths: [], entities: [],
  };
}
export class EditorModel {
  constructor(document) { this.document = copy(document); this.undoStack = []; this.redoStack = []; this.strokeStart = null; this.selected = null; }
  transact(change) {
    const before = copy(this.document);
    change(this.document);
    if (JSON.stringify(before) === JSON.stringify(this.document)) return false;
    this.undoStack.push(before); if (this.undoStack.length > 60) this.undoStack.shift();
    this.redoStack.length = 0; return true;
  }
  beginStroke() { if (!this.strokeStart) this.strokeStart = copy(this.document); }
  paint(change) { this.beginStroke(); change(this.document); }
  endStroke() {
    if (!this.strokeStart) return false;
    const changed = JSON.stringify(this.strokeStart) !== JSON.stringify(this.document);
    if (changed) { this.undoStack.push(this.strokeStart); if (this.undoStack.length > 60) this.undoStack.shift(); this.redoStack.length = 0; }
    this.strokeStart = null; return changed;
  }
  undo() { this.endStroke(); if (!this.undoStack.length) return false; this.redoStack.push(copy(this.document)); this.document = this.undoStack.pop(); return true; }
  redo() { if (!this.redoStack.length) return false; this.undoStack.push(copy(this.document)); this.document = this.redoStack.pop(); return true; }
  nextId(prefix = 'item') { let n = 1; const ids = new Set([...this.document.walls, ...(this.document.wallPaths || []), ...this.document.entities].map(e => e.id)); while (ids.has(`${prefix}-${n}`)) n++; return `${prefix}-${n}`; }
  get selectedObject() { return this.selected === 'start' || this.selected === 'exit' ? this.document[this.selected] : [...this.document.walls, ...(this.document.wallPaths || []), ...this.document.entities].find(item => item.id === this.selected); }
  duplicatePreview() {
    const source = this.selectedObject;
    if (!source || this.selected === 'start' || this.selected === 'exit') return { ok:false, error:'Select a wall or element to duplicate.' };
    const doc = this.document;
    const wall = doc.walls.find(item => item.id === this.selected);
    const path = (doc.wallPaths || []).find(item => item.id === this.selected);
    const entity = doc.entities.find(item => item.id === this.selected);
    const originals = entity?.type === 'portal' ? doc.entities.filter(item => item.type === 'portal' && item.pairId === entity.pairId) : [source];
    if (entity?.type === 'portal' && (originals.length !== 2 || originals.some(item => item.id === entity.id) === false)) return { ok:false, error:'Complete the portal pair before duplicating it.' };
    const slot = entity?.type === 'soundGate' ? [0,1,2].find(value => !doc.entities.some(item => item.type === 'soundGate' && item.slot === value)) : null;
    if (entity?.type === 'soundGate' && slot === undefined) return { ok:false, error:'All three gate slots are in use.' };
    if (wall && doc.walls.length >= 3000) return { ok:false, error:'Wall limit reached.' };
    if (path && (doc.wallPaths || []).length >= 150) return { ok:false, error:'Wall path limit reached.' };
    if (entity && doc.entities.length + originals.length > 200) return { ok:false, error:'Element limit reached.' };
    if (path && (doc.wallPaths || []).reduce((sum,item) => sum + item.points.length, 0) + path.points.length > 450) return { ok:false, error:'Wall path point limit reached.' };
    const used = new Set([...doc.walls, ...(doc.wallPaths || []), ...doc.entities].map(item => item.id));
    const pairIds = new Set(doc.entities.filter(item => item.type === 'portal').map(item => item.pairId));
    const pairId = entity?.type === 'portal' ? nextUniqueId('pair', new Set([...used, ...pairIds])) : null;
    const existingValid = validateLevelDocument(doc).ok;
    for (const [dx,dy] of duplicateOffsets) {
      const clones = originals.map(item => {
        const clone = copy(item);
        clone.id = nextUniqueId(path ? 'path' : wall ? 'wall' : item.type, used);
        if (path) for (const point of clone.points) { point.x += dx; point.y += dy; }
        else { clone.x += dx; clone.y += dy; }
        if (entity?.type === 'portal') clone.pairId = pairId;
        if (entity?.type === 'soundGate') clone.slot = slot;
        return clone;
      });
      const fits = clones.every(item => path
        ? item.points.every(point => inside(point, doc.bounds, item.thickness / 2))
        : wall ? item.x - item.width/2 >= doc.bounds.minX && item.x + item.width/2 <= doc.bounds.maxX && item.y - item.height/2 >= doc.bounds.minY && item.y + item.height/2 <= doc.bounds.maxY
          : inside(item, doc.bounds, item.type === 'companion' ? item.captureRadius : item.radius + (item.type === 'ember' && item.motion === 'orbit' ? item.orbitRadius : 0)));
      if (!fits) continue;
      const candidate = copy(doc);
      if (wall) candidate.walls.push(...clones);
      else if (path) { candidate.wallPaths ||= []; candidate.wallPaths.push(...clones); }
      else candidate.entities.push(...clones);
      if ((wall || path) && compiledWallGeometry(candidate.walls, candidate.wallPaths || []).length > 300) continue;
      if (existingValid && !validateLevelDocument(candidate).ok) continue;
      const selectedId = clones[originals.findIndex(item => item.id === this.selected)].id;
      return { ok:true, candidate, selectedId, ids:clones.map(item => item.id) };
    }
    return { ok:false, error:'No room nearby for a valid copy. Move the original or make space.' };
  }
  duplicateSelected() {
    this.endStroke();
    const preview = this.duplicatePreview();
    if (!preview.ok) return preview;
    this.transact(doc => { for (const key of Object.keys(doc)) delete doc[key]; Object.assign(doc, preview.candidate); });
    this.selected = preview.selectedId;
    return { ok:true, id:preview.selectedId, ids:preview.ids };
  }
  paintWall(stamp) {
    this.paint(doc => { doc.walls = unionAxisWalls([...doc.walls, stamp], [], new Set([...(doc.wallPaths || []), ...doc.entities].map(e=>e.id))); });
  }
  eraseWall(stamp) {
    this.paint(doc => { doc.walls = unionAxisWalls(doc.walls, [stamp], new Set([...(doc.wallPaths || []), ...doc.entities].map(e=>e.id))); });
  }
  addOrbitRing(center) {
    this.endStroke();
    const used = new Set([...this.document.walls, ...(this.document.wallPaths || []), ...this.document.entities].map(item=>item.id));
    const ids = [];let n=1;
    while(ids.length<3){const id=`ember-${n++}`;if(!used.has(id)){used.add(id);ids.push(id);}}
    const ring=orbitRingPreset(center,ids);
    const issue=validateOrbitPresetPlacement(ring,this.document.bounds,this.document.start,this.document.exit);
    if(issue)return {ok:false,error:issue};
    this.transact(doc=>doc.entities.push(...ring));
    this.selected=ids[0];
    return {ok:true,ids};
  }
  get validation() { return validateLevelDocument(this.document); }
  clearAll() {
    this.endStroke();
    const changed = this.transact(doc => { doc.walls = []; doc.wallPaths = []; doc.entities = []; });
    this.selected = null;
    return changed;
  }
  startNew() {
    this.endStroke();
    const fresh = makeBlankLevelDocument();
    const changed = this.transact(doc => { for (const key of Object.keys(doc)) delete doc[key]; Object.assign(doc, fresh); });
    this.selected = null;
    return changed;
  }
  loadDocument(document) {
    this.endStroke();
    const checked = validateLevelDocument(document);
    if (!checked.ok) return false;
    const next = copy(checked.document);
    this.transact(draft => { for (const key of Object.keys(draft)) delete draft[key]; Object.assign(draft, next); });
    this.selected = null;
    return true;
  }
  replace(document) { this.document = copy(document); this.undoStack = []; this.redoStack = []; this.strokeStart = null; this.selected = null; }
}
