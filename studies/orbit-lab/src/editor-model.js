import { validateLevelDocument } from './level-document.js';
import { unionAxisWalls } from './wall-geometry.js';
import { orbitRingPreset, validateOrbitPresetPlacement } from './orbit.js';
const copy = value => structuredClone(value);
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
  replace(document) { this.document = copy(document); this.undoStack = []; this.redoStack = []; this.strokeStart = null; this.selected = null; }
}
