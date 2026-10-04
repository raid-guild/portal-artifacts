export const RAID_VERSION = '3';
export const LEGACY_RAID_VERSION = '2';
export const HERO_IDS = Object.freeze(['ranger','wizard','dwarf','warrior','tavern-keeper']);
export const STARTER_HERO_IDS = Object.freeze(['ranger','wizard','dwarf']);
export const SKILLS = Object.freeze(['vitality','agility','bombRecharge']);
export const LEVELS = Object.freeze({
  training: Object.freeze({id:'training',name:'Guild Training',milestoneMs:180000,unlocks:'forest',scoreMultiplier:1}),
  forest: Object.freeze({id:'forest',name:'Haunted Forest',milestoneMs:300000,unlocks:'desert',scoreMultiplier:1}),
  desert: Object.freeze({id:'desert',name:'Desert Oasis',milestoneMs:420000,unlocks:'ice',scoreMultiplier:1}),
  ice: Object.freeze({id:'ice',name:'Frozen Highlands',milestoneMs:540000,unlocks:'lava',scoreMultiplier:1}),
  lava: Object.freeze({id:'lava',name:'Molten Vault',milestoneMs:720000,unlocks:null,scoreMultiplier:1}),
});
const ladder = (level,seconds) => Object.freeze(seconds.map(second=>Object.freeze({checkpointId:`${level}-${second}`,thresholdMs:second*1000})));
export const CHECKPOINTS = Object.freeze({
  training:ladder('training',[180,300,420,540,720]),
  forest:ladder('forest',[300,420,540,720]),
  desert:ladder('desert',[420,540,720]),
  ice:ladder('ice',[540,720]),
  lava:ladder('lava',[720]),
});
// A wave asks the game to fill to desiredAlive. maxAdmitted bounds possible
// boss kills even if the player clears each wave before the next begins.
export const LAVA_BOSS_SCHEDULE = Object.freeze([
  Object.freeze({atSeconds:300,desiredAlive:1,tier:1,maxAdmitted:1}),
  Object.freeze({atSeconds:480,desiredAlive:2,tier:2,maxAdmitted:3}),
  Object.freeze({atSeconds:600,desiredAlive:2,tier:2,maxAdmitted:5}),
  Object.freeze({atSeconds:660,desiredAlive:3,tier:3,maxAdmitted:8}),
]);
export function lavaBossSchedule(seconds){
  if(!Number.isFinite(seconds)||seconds<300)return {wave:0,desiredAlive:0,tier:0,maxAdmitted:0};
  if(seconds>=780){const endlessWaves=1+Math.floor((seconds-780)/120);return {wave:4+endlessWaves,desiredAlive:3,tier:3,maxAdmitted:8+endlessWaves*3};}
  let wave=0;for(let i=0;i<LAVA_BOSS_SCHEDULE.length;i++)if(seconds>=LAVA_BOSS_SCHEDULE[i].atSeconds)wave=i+1;
  const stage=LAVA_BOSS_SCHEDULE[wave-1];return {wave,desiredAlive:stage.desiredAlive,tier:stage.tier,maxAdmitted:stage.maxAdmitted};
}
const perk=(id,name,description,effect)=>Object.freeze({id,name,description,cost:3,effect:Object.freeze(effect)});
export const PERKS=Object.freeze({
  ranger:Object.freeze([
    perk('ranger-thorn-precision','Thorn Precision','Thornbow deals 15% more beyond 6 units.',{primaryDamageMultiplier:1.15,primaryDamageCondition:'range>6'}),
    perk('ranger-scout-dash','Scout Dash','Dashing pulls loot farther for 2 seconds.',{dashMagnetSeconds:2,pickupMagnetBonus:1.5}),
    perk('ranger-focused-barrage','Focused Barrage','Narrower bomb wave with 45% more damage.',{bombDamageMultiplier:1.45,bombRadiusMultiplier:.7}),
  ]),
  wizard:Object.freeze([
    perk('wizard-arc-focus','Arc Focus','Arc Wand deals 15% more to elites and bosses.',{primaryDamageMultiplier:1.15,primaryDamageCondition:'elite-or-boss'}),
    perk('wizard-flux-core','Flux Core','Bombing grants 15% speed for 2 seconds.',{bombSpeedSeconds:2,bombSpeedMultiplier:1.15}),
    perk('wizard-wide-nova','Wide Nova','Broader nova with 30% less damage.',{bombRadiusMultiplier:1.4,bombDamageMultiplier:.7}),
  ]),
  dwarf:Object.freeze([
    perk('dwarf-scatter-mastery','Rune Mastery','Rune Axes deal 15% more inside 3 units.',{primaryDamageMultiplier:1.15,primaryDamageCondition:'range<3'}),
    perk('dwarf-iron-guard','Iron Guard','Bombing reduces damage taken for 2 seconds.',{bombGuardSeconds:2,damageTakenMultiplier:.65}),
    perk('dwarf-quake-drive','Quake Drive','Stronger bomb knockback with 25% less damage.',{bombKnockbackMultiplier:1.6,bombDamageMultiplier:.75}),
  ]),
  warrior:Object.freeze([
    perk('warrior-blade-mastery','Blade Mastery','Cleaver deals 15% more above 75% health.',{primaryDamageMultiplier:1.15,primaryDamageCondition:'hp>75%'}),
    perk('warrior-dash-guard','Dash Guard','Dashing reduces damage taken for 1.5 seconds.',{dashGuardSeconds:1.5,damageTakenMultiplier:.65}),
    perk('warrior-directional-shockwave','Directional Shockwave','Focused forward bomb wave with greater reach and damage.',{bombArcDegrees:105,bombRadiusMultiplier:1.5,bombDamageMultiplier:1.25}),
  ]),
  'tavern-keeper':Object.freeze([
    perk('tavern-fire-mastery','Fire Mastery','Tankard deals 15% more below half health.',{primaryDamageMultiplier:1.15,primaryDamageCondition:'hp<50%'}),
    perk('tavern-hearty-meal','Hearty Meal','Food restores 50% more health.',{foodHealMultiplier:1.5}),
    perk('tavern-healing-bomb','Healing Bomb','Bomb heals up to 25 health with reduced damage.',{bombHeal:25,bombDamageMultiplier:.65}),
  ]),
});
export const perkFor=(hero,id)=>PERKS[hero]?.find(perk=>perk.id===id)??null;
