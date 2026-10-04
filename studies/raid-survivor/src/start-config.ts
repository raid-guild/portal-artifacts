import type { Hero, LevelId, Mastery } from './game';
import { RAID_VERSION, CHECKPOINTS, PERKS } from '../../../services/leaderboards/src/raid-rules.js';

export type RunTarget={checkpointId:string;thresholdMs:number}|null;
export type ClientRunConfig={version:string;character:Hero;level:LevelId;skills:Mastery;equippedPerk:string|null;target:RunTarget};
const uuid=/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;

// The ranked run's immutable server snapshot is the only configuration
// applied to that Game. Reject a partial response instead of claiming rank.
export function rankedStartConfig(data: unknown, hero: Hero, level: LevelId): {runId:string;config:ClientRunConfig} {
  const response=data as {runId?:unknown;version?:unknown;config?:Record<string,unknown>};
  const config=response?.config,skills=config?.skills as Partial<Mastery>|undefined;
  const target=config?.target as RunTarget|undefined;
  const checkpoints=CHECKPOINTS[level] as {checkpointId:string;thresholdMs:number}[];
  const matched=target===null||Boolean(target&&checkpoints.some(row=>row.checkpointId===target.checkpointId&&row.thresholdMs===target.thresholdMs));
  const equipped=config?.equippedPerk;
  const perkValid=equipped===null||typeof equipped==='string'&&PERKS[hero].some((perk:{id:string})=>perk.id===equipped);
  if(typeof response?.runId!=='string'||!uuid.test(response.runId)||response.version!==RAID_VERSION||
    config?.version!==RAID_VERSION||config.character!==hero||config.level!==level||!skills||
    ![skills.vitality,skills.agility,skills.bombRecharge].every(value=>value===0||value===1||value===2)||
    !matched||target===undefined||!perkValid||equipped===undefined) throw new Error('Ranked run configuration mismatch.');
  return {runId:response.runId,config:{version:RAID_VERSION,character:hero,level,skills:{vitality:skills.vitality!,agility:skills.agility!,bombRecharge:skills.bombRecharge!},equippedPerk:equipped as string|null,target}};
}
