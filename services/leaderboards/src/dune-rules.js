import { readFileSync } from 'node:fs';

export const GAME = 'dune-relay';
export const content = JSON.parse(readFileSync(new URL('./dune-content.json', import.meta.url), 'utf8'));
export const levels = new Map(content.levels.map((level, index) => [level.id, { ...level, index }]));
export const boosterPrices = Object.freeze({ jet: 300, flywheel: 300, prism: 500 });
export const emptyCampaign = () => ({ version: 5, completed: [], coins: 0, region: 'oasis', companions: [], oasisTransition: 'locked', transition: null, gatehouseReady: false, farmlandReady: false, demoEnding: 'locked', farmlandEnding: 'locked' });
export const emptyProfile = () => ({ revision: 0, campaign: emptyCampaign(), imported: false });
export const rewardFor = moves => 20 + 3 * moves;
// This boundary stays at the Gatehouse finale when later chapters add levels.
export const DEMO_LEVEL_COUNT = content.levels.findIndex(level=>level.id==='openTheCrossing') + 1;
export const FARMLAND_LEVEL_COUNT = content.levels.findIndex(level=>level.id==='openTheHarvestRoad') + 1;
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
  if (level.index >= DEMO_LEVEL_COUNT && !campaign.farmlandReady) throw fail(409, 'Finish the Farmland transition before entering Farmland.');
}
export function validPrefix(value) {
  if (!Array.isArray(value) || value.length > content.levels.length || value.some((id, index) => id !== content.levels[index].id)) throw fail(400, 'Invalid completed levels.');
  return [...value];
}
export function deriveCampaign(completed, coins, requested = {}) {
  validPrefix(completed);
  if (!Number.isSafeInteger(coins) || coins < 0 || coins > 1000000) throw fail(400, 'Invalid coin balance.');
  const count = completed.length;
  const oasisDone = count >= 10, caravanDone = count >= 20, gatehouseDone = count >= 30, farmlandDone = FARMLAND_LEVEL_COUNT > 0 && count >= FARMLAND_LEVEL_COUNT;
  const oasisStages = ['locked','film','keeper','atlas','arrival','ready'];
  const endingStages = ['locked','gate','film','thanks','done'];
  const oasisTransition = oasisDone && oasisStages.includes(requested.oasisTransition) && requested.oasisTransition !== 'locked' ? requested.oasisTransition : oasisDone ? 'film' : 'locked';
  const gatehouseReady = Boolean(caravanDone && (requested.gatehouseReady || count > 20));
  const farmlandReady = Boolean(gatehouseDone && (requested.farmlandReady || count > DEMO_LEVEL_COUNT));
  let transition = null;
  if (oasisDone && oasisTransition !== 'ready') {
    transition = { from: 'oasis', to: 'caravan', stage: oasisTransition === 'keeper' ? 'handoff' : oasisTransition === 'atlas' ? 'atlas' : oasisTransition === 'arrival' ? 'arrival' : 'film' };
  } else if (caravanDone && !gatehouseReady) {
    const stage = ['film','handoff','atlas','arrival'].includes(requested.transition?.stage) ? requested.transition.stage : 'film';
    transition = { from: 'caravan', to: 'gatehouse', stage };
  } else if (gatehouseDone && !farmlandReady && requested.transition?.from === 'gatehouse' && requested.transition?.to === 'farmland') {
    const stage = ['handoff','atlas','arrival'].includes(requested.transition.stage) ? requested.transition.stage : 'handoff';
    transition = { from: 'gatehouse', to: 'farmland', stage };
  }
  const demoEnding = gatehouseDone && endingStages.includes(requested.demoEnding) && requested.demoEnding !== 'locked' ? requested.demoEnding : gatehouseDone ? 'gate' : 'locked';
  const farmlandStages = ['locked','film','thanks','done'];
  const farmlandEnding = farmlandDone && farmlandStages.includes(requested.farmlandEnding) && requested.farmlandEnding !== 'locked' ? requested.farmlandEnding : farmlandDone ? 'film' : 'locked';
  const region = transition?.stage === 'arrival' ? transition.to
    : demoEnding !== 'locked' && demoEnding !== 'done' && transition?.to !== 'farmland' ? 'gatehouse'
    : farmlandEnding === 'film' || farmlandEnding === 'thanks' ? 'farmland'
    : requested.region === 'farmland' && farmlandReady ? 'farmland'
    : requested.region === 'gatehouse' && gatehouseReady ? 'gatehouse'
    : requested.region === 'oasis' ? 'oasis'
    : oasisTransition === 'ready' ? 'caravan' : 'oasis';
  return { version: 5, completed, coins, region,
    companions: [ ...(oasisStages.indexOf(oasisTransition) >= 3 ? ['keeper'] : []), ...(oasisTransition === 'ready' ? ['wayfinder'] : []), ...(gatehouseReady ? ['gatewright'] : []), ...(farmlandReady ? ['fieldkeeper'] : []) ],
    oasisTransition, transition, gatehouseReady, farmlandReady, demoEnding, farmlandEnding };
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
  if (completed.length > DEMO_LEVEL_COUNT || value.farmlandReady || value.region === 'farmland' || value.transition?.to === 'farmland') throw fail(400, 'Farmland progress cannot be imported from a guest save.');
  const maximum = completed.reduce((sum, id) => sum + rewardFor(levels.get(id).moves), 0);
  if (!Number.isSafeInteger(value.coins) || value.coins < 0 || value.coins > maximum) throw fail(400, 'Guest coin balance is outside the campaign range.');
  return deriveCampaign(completed, value.coins, value);
}
export function applyCheckpoint(profile, requested) {
  const before = profile.campaign;
  if (!requested || !Array.isArray(requested.completed) || JSON.stringify(requested.completed) !== JSON.stringify(before.completed) || requested.coins !== before.coins) throw fail(409, 'Campaign changed. Reload your save.');
  if (before.farmlandEnding && before.farmlandEnding !== 'locked' && requested.farmlandEnding === 'locked') throw fail(400, 'Invalid Farmland ending checkpoint.');
  const after = deriveCampaign(before.completed, before.coins, { ...requested, farmlandEnding: requested.farmlandEnding ?? before.farmlandEnding });
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
  const ending = ['locked','gate','film','thanks','done'];
  const priorEnd = ending.indexOf(before.demoEnding), nextEnd = ending.indexOf(after.demoEnding);
  if (nextEnd < priorEnd || nextEnd > priorEnd + 1) throw fail(400, 'Invalid ending checkpoint.');
  const farmlandEnding = ['locked','film','thanks','done'];
  const priorFarmland = farmlandEnding.indexOf(before.farmlandEnding ?? 'locked'), nextFarmland = farmlandEnding.indexOf(after.farmlandEnding);
  if (nextFarmland < priorFarmland || nextFarmland > priorFarmland + 1) throw fail(400, 'Invalid Farmland ending checkpoint.');
  if (after.gatehouseReady && !before.gatehouseReady && before.transition?.stage !== 'arrival') throw fail(400, 'Gatehouse arrival is incomplete.');
  if (after.farmlandReady && !before.farmlandReady && before.transition?.from !== 'gatehouse' || after.farmlandReady && !before.farmlandReady && before.transition?.stage !== 'arrival') throw fail(400, 'Farmland arrival is incomplete.');
  return { ...profile, revision: profile.revision + 1, campaign: after };
}
