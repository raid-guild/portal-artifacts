import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  content, companionAbilities, emptyCampaign, deriveCampaign, normalizeProfile,
  applyCheckpoint, requireCurrentLevel, guestImport, moveCapForVersion,
  RIVER_LEVEL_COUNT, COLLECTION_LEVEL_COUNT, accessTierForLevel,
} from '../src/dune-rules.js';
import { chapterRewards } from '../src/dune-rewards.js';

const prefix = count => content.levels.slice(0, count).map(level => level.id);
const fields = { ...emptyCampaign(), oasisTransition:'ready', gatehouseReady:true,
  farmlandReady:true, townReady:true, castleReady:true, riverReady:true,
  demoEnding:'done', farmlandEnding:'done', townEnding:'done', castleEnding:'done',
  activeCompanion:'keeper', region:'river' };
const step = (profile, changes) => applyCheckpoint(profile, { ...profile.campaign, ...changes });

test('Chapter 8 adds ten paid levels without changing old move caps', () => {
  assert.equal(content.contentVersion, 'chapter-8-1');
  assert.equal(content.rulesVersion, 'condensation-1');
  assert.equal(RIVER_LEVEL_COUNT, 70);
  assert.equal(COLLECTION_LEVEL_COUNT, 80);
  assert.deepEqual(content.levels.slice(70).map(({id,moves,chapter})=>[id,moves,chapter]), [
    ['firstDew',26,'collection'], ['meshWalk',25,'collection'],
    ['pairedCollectors',27,'collection'], ['reservoirGlass',27,'collection'],
    ['saltedFittings',28,'collection'], ['supplyGantry',28,'collection'],
    ['condensingBanks',29,'collection'], ['collectionTwinTanks',29,'collection'],
    ['recirculationDeck',29,'collection'], ['openTheSkyRoute',30,'collection'],
  ]);
  for (const level of content.levels.slice(0,70)) assert.equal(moveCapForVersion(level,'chapter-7-7'),level.moves,level.id);
  assert.equal(moveCapForVersion(content.levels[70],'chapter-7-7'),null);
  assert.equal(accessTierForLevel({...content.levels[70],index:70}),'campaign-pass');
  assert.deepEqual(companionAbilities.artificer,{chargeSymbol:'key',keeperTarget:11,grantedPower:'prism',grantCount:1});
  assert.deepEqual(chapterRewards.at(-1).payload,{coins:200,item:'flywheel',quantity:1});
});

test('a completed River account may travel without replay but must finish arrival', () => {
  let profile={revision:12,campaign:normalizeProfile({campaign:{...fields,completed:prefix(70),riverEnding:'done'}}).campaign};
  assert.equal(profile.campaign.collectionReady,false);
  assert.equal(profile.campaign.region,'river');
  assert.equal(profile.campaign.companions.includes('artificer'),false);
  const first={...content.levels[70],index:70};
  assert.throws(()=>requireCurrentLevel(profile.campaign,first),{status:409});
  assert.throws(()=>step(profile,{collectionReady:true}),{status:400});
  assert.throws(()=>step(profile,{transition:{from:'river',to:'collection',stage:'arrival'}}),{status:400});
  profile=step(profile,{transition:{from:'river',to:'collection',stage:'handoff'}});
  const oldQueued={...profile.campaign,transition:null};
  delete oldQueued.collectionReady;delete oldQueued.collectionEnding;
  assert.deepEqual(applyCheckpoint(profile,oldQueued).campaign.transition,{from:'river',to:'collection',stage:'handoff'},'old client cannot drop an in-progress handoff');
  profile=step(profile,{transition:{from:'river',to:'collection',stage:'atlas'}});
  profile=step(profile,{transition:{from:'river',to:'collection',stage:'arrival'},region:'collection'});
  assert.equal(profile.campaign.companions.includes('artificer'),false);
  profile=step(profile,{collectionReady:true,transition:null,region:'collection'});
  assert.equal(profile.campaign.activeCompanion,'keeper');
  assert.ok(profile.campaign.companions.includes('artificer'));
  assert.doesNotThrow(()=>requireCurrentLevel(profile.campaign,first));
  profile=step(profile,{activeCompanion:'artificer'});
  assert.equal(profile.campaign.activeCompanion,'artificer');
  const oldClient={...profile.campaign,region:'river'};delete oldClient.collectionReady;delete oldClient.collectionEnding;
  const saved=applyCheckpoint(profile,oldClient).campaign;
  assert.equal(saved.collectionReady,true,'old checkpoints cannot clear new arrival');
  assert.equal(saved.region,'collection','old checkpoints cannot move an arrived player back to River');
  assert.equal(saved.activeCompanion,'artificer');
});

test('River thanks can atomically begin collection handoff and old queued finishes stay valid', () => {
  let profile={revision:219,campaign:deriveCampaign(prefix(70),3577,{...fields,riverEnding:'thanks'})};
  profile=step(profile,{riverEnding:'done',transition:{from:'river',to:'collection',stage:'handoff'}});
  profile=step(profile,{transition:{from:'river',to:'collection',stage:'atlas'}});
  profile=step(profile,{transition:{from:'river',to:'collection',stage:'arrival'}});
  profile=step(profile,{collectionReady:true,transition:null,region:'collection'});
  assert.equal(profile.campaign.collectionReady,true);
  assert.equal(profile.campaign.coins,3577);
  assert.equal(profile.revision,223);
  const pending={...content.levels[69],index:69};
  assert.equal(moveCapForVersion(pending,'chapter-7-7'),28);
});

test('Collection in-engine ending is monotonic and starts only after level 80', () => {
  let profile={revision:1,campaign:deriveCampaign(prefix(80),500,{...fields,collectionReady:true,region:'collection'})};
  assert.equal(profile.campaign.collectionEnding,'celebration');
  assert.throws(()=>step(profile,{collectionEnding:'done'}),{status:400});
  profile=step(profile,{collectionEnding:'thanks'});
  profile=step(profile,{collectionEnding:'done'});
  assert.equal(profile.campaign.collectionEnding,'done');
  assert.throws(()=>step(profile,{collectionEnding:'thanks'}),{status:400});
});

test('guest import rejects Collection unlock and Artificer forgery', () => {
  const guest={...emptyCampaign(),completed:prefix(30),coins:0,oasisTransition:'ready',gatehouseReady:true,demoEnding:'done'};
  for(const change of [
    {collectionReady:true},{region:'collection'},{companions:['artificer']},
    {activeCompanion:'artificer'},{collectionEnding:'thanks'},
    {transition:{from:'river',to:'collection',stage:'handoff'}},
  ]) assert.throws(()=>guestImport({...guest,...change}),{status:400});
});
