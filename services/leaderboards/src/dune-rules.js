import { readFileSync } from 'node:fs';

export const GAME = 'dune-relay';
export const content = JSON.parse(readFileSync(new URL('./dune-content.json', import.meta.url), 'utf8'));
export const companionAbilities = JSON.parse(readFileSync(new URL('./dune-companions.json', import.meta.url), 'utf8'));
// Frozen authoring snapshots keep older client-reported finishes within the
// budget they saw. A submitted content version selects a cap; it does not
// prove when an offline attempt was played or make this casual save anti-cheat.
const legacyMoves = JSON.parse(readFileSync(new URL('./dune-legacy-moves.json', import.meta.url), 'utf8'));
export const levels = new Map(content.levels.map((level, index) => [level.id, { ...level, index }]));
export function moveCapForVersion(level, version) {
  if (version === content.contentVersion) return level.moves;
  return legacyMoves[version]?.[level.id] ?? null;
}
function maximumKnownMoveCap(level) {
  return Math.max(level.moves, ...Object.values(legacyMoves).map(snapshot => snapshot[level.id] ?? 0));
}
export const boosterPrices = Object.freeze({ jet: 300, flywheel: 300, prism: 500 });
export const emptyCampaign = () => ({ version: 5, completed: [], coins: 0, region: 'oasis', companions: [], oasisTransition: 'locked', transition: null, gatehouseReady: false, farmlandReady: false, townReady: false, castleReady: false, activeCompanion: null, demoEnding: 'locked', farmlandEnding: 'locked', townEnding: 'locked', castleEnding: 'locked' });
export const emptyProfile = () => ({ revision: 0, campaign: emptyCampaign(), imported: false });
export const rewardFor = moves => 20 + 3 * moves;
// This boundary stays at the Gatehouse finale when later chapters add levels.
export const DEMO_LEVEL_COUNT = content.levels.findIndex(level=>level.id==='openTheCrossing') + 1;
export const FARMLAND_LEVEL_COUNT = content.levels.findIndex(level=>level.id==='openTheHarvestRoad') + 1;
export const TOWN_LEVEL_COUNT = content.levels.findIndex(level=>level.id==='openTheMarket') + 1;
export const PASS_LEVEL_START = FARMLAND_LEVEL_COUNT;
// Authoring metadata, not a browser-supplied unlock flag, decides the access tier.
export function accessTierForLevel(level) {
  if (!level || !Number.isInteger(level.index) || level.index < 0) throw fail(400,'Unknown level.');
  if (level.index < DEMO_LEVEL_COUNT) return 'demo';
  if (level.index < PASS_LEVEL_START) return 'farmland';
  return 'campaign-pass';
}
export function accessTierForCampaign(campaign) {
  if (campaign?.region === 'town' || campaign?.region === 'castle' || campaign?.transition?.to === 'town' || campaign?.transition?.to === 'castle' || campaign?.townReady || campaign?.castleReady || campaign?.townEnding && campaign.townEnding !== 'locked' || campaign?.castleEnding && campaign.castleEnding !== 'locked') return 'campaign-pass';
  if (campaign?.region && !['oasis','caravan','gatehouse','farmland'].includes(campaign.region) || campaign?.transition?.to && !['caravan','gatehouse','farmland'].includes(campaign.transition.to)) return 'campaign-pass';
  if (campaign?.region === 'farmland' || campaign?.transition?.to === 'farmland' || campaign?.farmlandReady) return 'farmland';
  return 'demo';
}
export const farmlandEligible = campaign => DEMO_LEVEL_COUNT > 0 && Array.isArray(campaign?.completed) && campaign.completed.length >= DEMO_LEVEL_COUNT && campaign.completed.slice(0,DEMO_LEVEL_COUNT).every((id,index)=>id===content.levels[index].id);
export function fail(status, message) { return Object.assign(new Error(message), { status }); }
export function validUuid(value) { return typeof value === 'string' && /^[a-f0-9]{8}-[a-f0-9]{4}-[1-8][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(value); }
export function validBoosters(value) {
  if (!Array.isArray(value) || value.length > 3 || value.some(item => !Object.hasOwn(boosterPrices, item)) || new Set(value).size !== value.length) throw fail(400, 'Invalid starting boosters.');
  return [...value].sort();
}
export function validLevel(value) {
  const level = levels.get(value);
  if (!level) throw fail(400, 'Unknown level.');
  return level;
}
export function requireCurrentLevel(campaign, level) {
  if (level.index !== campaign.completed.length) throw fail(409, 'This level is not the current campaign level.');
  if (level.index === 10 && campaign.oasisTransition !== 'ready') throw fail(409, 'Finish the Oasis transition before entering Caravan.');
  if (level.index === 20 && !campaign.gatehouseReady) throw fail(409, 'Finish the Caravan transition before entering Gatehouse.');
  if (level.index >= DEMO_LEVEL_COUNT && level.index < PASS_LEVEL_START && !campaign.farmlandReady) throw fail(409, 'Finish the Farmland transition before entering Farmland.');
  if (level.index >= PASS_LEVEL_START && level.index < TOWN_LEVEL_COUNT && !campaign.townReady) throw fail(409, 'Finish the Town arrival before entering the next chapter.');
  if (level.index >= TOWN_LEVEL_COUNT && (!campaign.castleReady || !campaign.activeCompanion)) throw fail(409, 'Arrive at Castle Island and choose an active raid member first.');
}
export function validPrefix(value) {
  if (!Array.isArray(value) || value.length > content.levels.length || value.some((id, index) => id !== content.levels[index].id)) throw fail(400, 'Invalid completed levels.');
  return [...value];
}
export function deriveCampaign(completed, coins, requested = {}) {
  validPrefix(completed);
  if (!Number.isSafeInteger(coins) || coins < 0 || coins > 1000000) throw fail(400, 'Invalid coin balance.');
  const count = completed.length;
  const oasisDone = count >= 10, caravanDone = count >= 20, gatehouseDone = count >= 30, farmlandDone = FARMLAND_LEVEL_COUNT > 0 && count >= FARMLAND_LEVEL_COUNT, townDone = TOWN_LEVEL_COUNT > 0 && count >= TOWN_LEVEL_COUNT, castleDone = count >= content.levels.length && content.levels.at(-1)?.id === 'openTheUpstreamRoute';
  const oasisStages = ['locked','film','keeper','atlas','arrival','ready'];
  const endingStages = ['locked','gate','film','thanks','done'];
  const oasisTransition = oasisDone && oasisStages.includes(requested.oasisTransition) && requested.oasisTransition !== 'locked' ? requested.oasisTransition : oasisDone ? 'film' : 'locked';
  const gatehouseReady = Boolean(caravanDone && (requested.gatehouseReady || count > 20));
  const farmlandReady = Boolean(gatehouseDone && (requested.farmlandReady || count > DEMO_LEVEL_COUNT));
  const townReady = Boolean(farmlandDone && (requested.townReady || count > PASS_LEVEL_START));
  const castleReady = Boolean(townDone && (requested.castleReady || count > TOWN_LEVEL_COUNT));
  let transition = null;
  if (oasisDone && oasisTransition !== 'ready') {
    transition = { from: 'oasis', to: 'caravan', stage: oasisTransition === 'keeper' ? 'handoff' : oasisTransition === 'atlas' ? 'atlas' : oasisTransition === 'arrival' ? 'arrival' : 'film' };
  } else if (caravanDone && !gatehouseReady) {
    const stage = ['film','handoff','atlas','arrival'].includes(requested.transition?.stage) ? requested.transition.stage : 'film';
    transition = { from: 'caravan', to: 'gatehouse', stage };
  } else if (gatehouseDone && !farmlandReady && requested.transition?.from === 'gatehouse' && requested.transition?.to === 'farmland') {
    const stage = ['handoff','atlas','arrival'].includes(requested.transition.stage) ? requested.transition.stage : 'handoff';
    transition = { from: 'gatehouse', to: 'farmland', stage };
  } else if (farmlandDone && !townReady && requested.transition?.from === 'farmland' && requested.transition?.to === 'town' && requested.farmlandEnding === 'done') {
    const stage = ['handoff','atlas','arrival'].includes(requested.transition.stage) ? requested.transition.stage : 'handoff';
    transition = { from: 'farmland', to: 'town', stage };
  } else if (townDone && !castleReady && requested.transition?.from === 'town' && requested.transition?.to === 'castle' && requested.townEnding === 'done') {
    const stage = ['handoff','atlas','arrival'].includes(requested.transition.stage) ? requested.transition.stage : 'handoff';
    transition = { from: 'town', to: 'castle', stage };
  }
  const demoEnding = gatehouseDone && endingStages.includes(requested.demoEnding) && requested.demoEnding !== 'locked' ? requested.demoEnding : gatehouseDone ? 'gate' : 'locked';
  const farmlandStages = ['locked','film','thanks','done'];
  const farmlandEnding = farmlandDone && farmlandStages.includes(requested.farmlandEnding) && requested.farmlandEnding !== 'locked' ? requested.farmlandEnding : farmlandDone ? 'film' : 'locked';
  const townStages = ['locked','film','thanks','done'];
  const townEnding = townDone && townStages.includes(requested.townEnding) && requested.townEnding !== 'locked' ? requested.townEnding : townDone ? 'film' : 'locked';
  const castleEnding = castleDone && townStages.includes(requested.castleEnding) && requested.castleEnding !== 'locked' ? requested.castleEnding : castleDone ? 'film' : 'locked';
  const companions = [ ...(oasisStages.indexOf(oasisTransition) >= 3 ? ['keeper'] : []), ...(oasisTransition === 'ready' ? ['wayfinder'] : []), ...(gatehouseReady ? ['gatewright'] : []), ...(farmlandReady ? ['fieldkeeper'] : []), ...(townReady ? ['towncrier'] : []) ];
  const activeCompanion = castleReady && companions.includes(requested.activeCompanion) ? requested.activeCompanion : null;
  const region = transition?.stage === 'arrival' ? transition.to
    : demoEnding !== 'locked' && demoEnding !== 'done' && transition?.to !== 'farmland' && transition?.to !== 'town' && transition?.to !== 'castle' ? 'gatehouse'
    : farmlandEnding === 'film' || farmlandEnding === 'thanks' && transition?.to !== 'town' ? 'farmland'
    : requested.region === 'castle' && castleReady ? 'castle'
    : requested.region === 'town' && townReady ? 'town'
    : requested.region === 'farmland' && farmlandReady ? 'farmland'
    : requested.region === 'gatehouse' && gatehouseReady ? 'gatehouse'
    : requested.region === 'oasis' ? 'oasis'
    : oasisTransition === 'ready' ? 'caravan' : 'oasis';
  return { version: 5, completed, coins, region,
    companions, oasisTransition, transition, gatehouseReady, farmlandReady, townReady, castleReady, activeCompanion, demoEnding, farmlandEnding, townEnding, castleEnding };
}
export function normalizeProfile(value) {
  if (!value || typeof value !== 'object') return emptyProfile();
  const completed = validPrefix(value.campaign?.completed ?? []);
  return { revision: Number.isSafeInteger(value.revision) && value.revision >= 0 ? value.revision : 0,
    campaign: deriveCampaign(completed, Number.isSafeInteger(value.campaign?.coins) ? value.campaign.coins : 0, value.campaign), imported: value.imported === true };
}
export function guestImport(value) {
  if (!value || value.version !== 5) throw fail(400, 'Invalid guest save.');
  const completed = validPrefix(value.completed);
  if (completed.length > DEMO_LEVEL_COUNT || value.farmlandReady || value.townReady || value.castleReady || value.activeCompanion || value.region === 'farmland' || value.region === 'town' || value.region === 'castle' || value.transition?.to === 'farmland' || value.transition?.to === 'town' || value.transition?.to === 'castle') throw fail(400, 'Paid chapter progress cannot be imported from a guest save.');
  // Guest saves do not record the version of each win. Accept a bounded balance
  // earned under any known authored budget without changing the saved coins.
  const maximum = completed.reduce((sum, id) => sum + rewardFor(maximumKnownMoveCap(levels.get(id))), 0);
  if (!Number.isSafeInteger(value.coins) || value.coins < 0 || value.coins > maximum) throw fail(400, 'Guest coin balance is outside the campaign range.');
  return deriveCampaign(completed, value.coins, value);
}
export function applyCheckpoint(profile, requested) {
  const before = profile.campaign;
  if (!requested || !Array.isArray(requested.completed) || JSON.stringify(requested.completed) !== JSON.stringify(before.completed) || requested.coins !== before.coins) throw fail(409, 'Campaign changed. Reload your save.');
  if (Object.hasOwn(requested,'activeCompanion') && requested.activeCompanion !== before.activeCompanion && (!before.castleReady || !before.companions.includes(requested.activeCompanion))) throw fail(400, 'Choose an unlocked raid member at Castle Island.');
  if (Object.hasOwn(requested,'castleReady') && requested.castleReady && !before.castleReady && before.transition?.from !== 'town') throw fail(400, 'Castle arrival is incomplete.');
  if (requested.transition?.from === 'town' && requested.transition?.to === 'castle' && before.transition?.from !== 'town' && before.townEnding !== 'done') throw fail(400, 'Finish Town before travelling to Castle Island.');
  if (before.farmlandEnding && before.farmlandEnding !== 'locked' && requested.farmlandEnding === 'locked') throw fail(400, 'Invalid Farmland ending checkpoint.');
  if (before.townEnding && before.townEnding !== 'locked' && requested.townEnding === 'locked') throw fail(400, 'Invalid Town ending checkpoint.');
  if (before.castleEnding && before.castleEnding !== 'locked' && requested.castleEnding === 'locked') throw fail(400, 'Invalid Castle ending checkpoint.');
  const after = deriveCampaign(before.completed, before.coins, { ...before, ...requested, farmlandEnding: requested.farmlandEnding ?? before.farmlandEnding, townEnding: requested.townEnding ?? before.townEnding, castleEnding: requested.castleEnding ?? before.castleEnding, townReady: requested.townReady ?? before.townReady, castleReady: requested.castleReady ?? before.castleReady, activeCompanion: requested.activeCompanion === undefined ? before.activeCompanion : requested.activeCompanion, transition: requested.transition === undefined ? before.transition : requested.transition });
  const oasisStages = ['locked','film','keeper','atlas','arrival','ready'];
  const priorOasis = oasisStages.indexOf(before.oasisTransition), nextOasis = oasisStages.indexOf(after.oasisTransition);
  if (nextOasis < priorOasis || nextOasis > priorOasis + 1) throw fail(400, 'Invalid Oasis checkpoint.');
  const order = ['film','handoff','atlas','arrival'];
  if (before.transition?.from === 'caravan') {
    const prior = order.indexOf(before.transition.stage);
    const next = after.transition?.from === 'caravan' ? order.indexOf(after.transition.stage) : after.gatehouseReady ? 4 : -1;
    if (next < prior || next > prior + 1) throw fail(400, 'Invalid Gatehouse checkpoint.');
  }
  if (after.transition?.from === 'gatehouse' && before.transition?.from !== 'gatehouse' && before.demoEnding !== 'done') throw fail(400, 'Finish the demo before entering Farmland.');
  if (before.transition?.from === 'gatehouse') {
    const farmlandOrder = ['handoff','atlas','arrival'];
    const prior = farmlandOrder.indexOf(before.transition.stage);
    const next = after.transition?.from === 'gatehouse' ? farmlandOrder.indexOf(after.transition.stage) : after.farmlandReady ? 3 : -1;
    if (next < prior || next > prior + 1) throw fail(400, 'Invalid Farmland checkpoint.');
  }
  if (after.transition?.from === 'farmland' && before.transition?.from !== 'farmland' && before.farmlandEnding !== 'done') throw fail(400, 'Finish Farmland before entering Town.');
  if (after.transition?.from === 'farmland' && before.transition?.from !== 'farmland' && after.transition.stage !== 'handoff') throw fail(400, 'Begin the Town handoff before travelling.');
  if (before.transition?.from === 'farmland') {
    const townOrder = ['handoff','atlas','arrival'];
    const prior = townOrder.indexOf(before.transition.stage);
    const next = after.transition?.from === 'farmland' ? townOrder.indexOf(after.transition.stage) : after.townReady ? 3 : -1;
    if (next < prior || next > prior + 1) throw fail(400, 'Invalid Town checkpoint.');
  }
  if (after.transition?.from === 'town' && before.transition?.from !== 'town' && before.townEnding !== 'done') throw fail(400, 'Finish Town before travelling to Castle Island.');
  if (after.transition?.from === 'town' && before.transition?.from !== 'town' && after.transition.stage !== 'handoff') throw fail(400, 'Begin the Castle handoff before travelling.');
  if (before.transition?.from === 'town') {
    const castleOrder = ['handoff','atlas','arrival'];
    const prior = castleOrder.indexOf(before.transition.stage);
    const next = after.transition?.from === 'town' ? castleOrder.indexOf(after.transition.stage) : after.castleReady ? 3 : -1;
    if (next < prior || next > prior + 1) throw fail(400, 'Invalid Castle checkpoint.');
  }
  const ending = ['locked','gate','film','thanks','done'];
  const priorEnd = ending.indexOf(before.demoEnding), nextEnd = ending.indexOf(after.demoEnding);
  if (nextEnd < priorEnd || nextEnd > priorEnd + 1) throw fail(400, 'Invalid ending checkpoint.');
  const farmlandEnding = ['locked','film','thanks','done'];
  const priorFarmland = farmlandEnding.indexOf(before.farmlandEnding ?? 'locked'), nextFarmland = farmlandEnding.indexOf(after.farmlandEnding);
  if (nextFarmland < priorFarmland || nextFarmland > priorFarmland + 1) throw fail(400, 'Invalid Farmland ending checkpoint.');
  const townEnding = ['locked','film','thanks','done'];
  const priorTown = townEnding.indexOf(before.townEnding ?? 'locked'), nextTown = townEnding.indexOf(after.townEnding);
  if (nextTown < priorTown || nextTown > priorTown + 1 && !(before.townEnding === 'film' && after.townEnding === 'done')) throw fail(400, 'Invalid Town ending checkpoint.');
  const priorCastle = townEnding.indexOf(before.castleEnding ?? 'locked'), nextCastle = townEnding.indexOf(after.castleEnding);
  if (nextCastle < priorCastle || nextCastle > priorCastle + 1 && !(before.castleEnding === 'film' && after.castleEnding === 'done')) throw fail(400, 'Invalid Castle ending checkpoint.');
  if (after.gatehouseReady && !before.gatehouseReady && before.transition?.stage !== 'arrival') throw fail(400, 'Gatehouse arrival is incomplete.');
  if (after.farmlandReady && !before.farmlandReady && before.transition?.from !== 'gatehouse' || after.farmlandReady && !before.farmlandReady && before.transition?.stage !== 'arrival') throw fail(400, 'Farmland arrival is incomplete.');
  if (after.townReady && !before.townReady && (before.transition?.from !== 'farmland' || before.transition?.stage !== 'arrival')) throw fail(400, 'Town arrival is incomplete.');
  if (after.castleReady && !before.castleReady && (before.transition?.from !== 'town' || before.transition?.stage !== 'arrival')) throw fail(400, 'Castle arrival is incomplete.');
  return { ...profile, revision: profile.revision + 1, campaign: after };
}
