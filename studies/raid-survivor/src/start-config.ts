import type { Hero, LevelId, Mastery } from './game';

// The ranked run's immutable server snapshot is the only mastery applied to
// that Game. Another tab may purchase a skill while this tab opens its run.
export function rankedStartConfig(data: unknown, hero: Hero, level: LevelId): { runId: string; mastery: Mastery } {
  const response=data as {runId?:unknown;version?:unknown;config?:{version?:unknown;character?:unknown;level?:unknown;skills?:Partial<Mastery>}};
  const skills=response?.config?.skills;
  if(typeof response?.runId!=='string'||!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(response.runId)||
    response.version!=='2'||response.config?.version!=='2'||response.config.character!==hero||response.config.level!==level||!skills||
    ![skills.vitality,skills.agility,skills.bombRecharge].every(value=>value===0||value===1||value===2)) throw new Error('Ranked run configuration mismatch.');
  return {runId:response.runId,mastery:{vitality:skills.vitality!,agility:skills.agility!,bombRecharge:skills.bombRecharge!}};
}
