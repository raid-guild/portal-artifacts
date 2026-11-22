import abilities from '../../../../services/leaderboards/src/dune-companions.json';
import type { LevelDefinition } from './levels';
import type { CompanionId } from './save';

export type CompanionAbility = Pick<LevelDefinition, 'chargeSymbol' | 'keeperTarget' | 'grantedPower' | 'grantCount' | 'grantedJetDirection'>;
export type CompanionSnapshot = CompanionAbility & { id: CompanionId };
export const COMPANION_ABILITIES = abilities as Record<CompanionId, CompanionAbility>;
export function companionSnapshot(id: CompanionId): CompanionSnapshot { return { id, ...COMPANION_ABILITIES[id] }; }
export function sameCompanionSnapshot(left: CompanionSnapshot | null | undefined, right: CompanionSnapshot | null | undefined): boolean {
  if (!left || !right) return left == null && right == null;
  return Object.keys(left).length === Object.keys(right).length && Object.entries(left).every(([key,value]) => right[key as keyof CompanionSnapshot] === value);
}
export function castleLevelForCompanion(level: LevelDefinition, snapshot: CompanionSnapshot): LevelDefinition {
  return { ...level, chargeSymbol: snapshot.chargeSymbol, keeperTarget: snapshot.keeperTarget, grantedPower: snapshot.grantedPower, grantCount: snapshot.grantCount, grantedJetDirection: snapshot.grantedJetDirection };
}
