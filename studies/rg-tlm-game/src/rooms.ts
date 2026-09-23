import type { Room, Target } from './game';
export interface SceneTarget { label: string; x: number; y: number; stand: number }
export const roomTargets: Record<Room, Partial<Record<Target, SceneTarget>>> = {
  waystation: {
    rook: { label: 'Rook', x: 54, y: 47, stand: 46 },
    walker: { label: 'Cargo walker', x: 75, y: 38, stand: 73 },
    repair: { label: 'Repair point', x: 78, y: 68, stand: 74 },
    plate: { label: 'Cargo plate', x: 66, y: 83, stand: 59 },
    jack: { label: 'Screw jack', x: 70, y: 76, stand: 63 },
    shelter: { label: 'Waystation', x: 10, y: 46, stand: 17 },
    exit: { label: 'Road ahead', x: 94, y: 57, stand: 88 },
  },
  crossing: {
    citadel: { label: 'Floating citadel', x: 27, y: 43, stand: 26 },
    inscription: { label: 'Route inscription', x: 48, y: 73, stand: 38 },
    pedestal: { label: 'Route pedestal', x: 47, y: 61, stand: 38 },
    rook: { label: 'Rook', x: 71.5, y: 35, stand: 68 },
    walker: { label: 'Docked walker', x: 82, y: 59, stand: 75 },
    arch: { label: 'Transit arch', x: 91, y: 42, stand: 87 },
  },
  workshop: {
    window: { label: 'Citadel window', x: 18, y: 29, stand: 19 },
    sable: { label: 'Sable · Strategist', x: 48, y: 36, stand: 39 },
    orin: { label: 'Keeper Orin', x: 65, y: 43, stand: 62 },
    mica: { label: 'Mica · Builder', x: 89, y: 42, stand: 84 },
    ledger: { label: 'Open ledger', x: 58, y: 60, stand: 55 },
    frame: { label: 'Signal frame', x: 72, y: 60, stand: 69 },
    routeboard: { label: 'Route board', x: 83, y: 59, stand: 80 },
    table: { label: 'Shared raid table', x: 70, y: 70, stand: 67 },
    archiveDoor: { label: 'Archive door', x: 28, y: 58, stand: 31 },
  },
  archive: {
    archiveDoor: { label: 'Workshop door', x: 10, y: 63, stand: 14 },
    archiveShelves: { label: 'History shelves', x: 25, y: 43, stand: 30 },
    archiveDesk: { label: 'ROT decoder desk', x: 62, y: 61, stand: 59 },
    archiveLantern: { label: 'Signal lantern', x: 86, y: 43, stand: 81 },
  },
};
