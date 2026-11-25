import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  content, emptyCampaign, deriveCampaign, normalizeProfile, applyCheckpoint,
  requireCurrentLevel, guestImport, accessTierForLevel, accessTierForCampaign,
  CASTLE_LEVEL_COUNT, RIVER_LEVEL_COUNT,
  moveCapForVersion,
} from '../src/dune-rules.js';

const prefix = count => content.levels.slice(0, count).map(level => level.id);
const castleFields = {
  ...emptyCampaign(), oasisTransition: 'ready', gatehouseReady: true,
  farmlandReady: true, townReady: true, castleReady: true,
  demoEnding: 'done', farmlandEnding: 'done', townEnding: 'done',
  activeCompanion: 'wayfinder', region: 'castle',
};
const step = (profile, fields) => applyCheckpoint(profile, { ...profile.campaign, ...fields });

test('River catalog extends the campaign without moving Castle completion', () => {
  assert.equal(content.contentVersion, 'chapter-7-7');
  assert.equal(CASTLE_LEVEL_COUNT, 60);
  assert.equal(RIVER_LEVEL_COUNT, content.levels.length);
  assert.equal(RIVER_LEVEL_COUNT, 70);
  assert.equal(content.levels[59].id, 'openTheUpstreamRoute');
  assert.equal(content.levels[69].id, 'openTheCollectionRoute');
  assert.equal(accessTierForLevel({ ...content.levels[60], index: 60 }), 'campaign-pass');
  const justFinished = deriveCampaign(prefix(60), 100, castleFields);
  assert.equal(justFinished.castleEnding, 'film');
  assert.equal(justFinished.riverReady, false);
  assert.equal(justFinished.riverEnding, 'locked');
  assert.equal(accessTierForCampaign(justFinished), 'campaign-pass');
});

test('River tuning keeps old prepared attempts valid at their original move caps', () => {
  for (const level of content.levels) {
    assert.equal(moveCapForVersion(level, 'chapter-7-2'), ['neighborhoodRounds','townLedger','openTheMarket'].includes(level.id) ? {neighborhoodRounds:30,townLedger:30,openTheMarket:32}[level.id] : level.moves, level.id);
    assert.equal(moveCapForVersion(level, 'chapter-7-6'), level.moves, `${level.id} keeps its complete prior cap`);
  }
  assert.equal(moveCapForVersion(content.levels[69], 'unknown'), null);
});

test('legacy completed Castle account may board River without replaying Castle', () => {
  const oldSave = { ...castleFields, completed: prefix(60), castleEnding: 'done' };
  delete oldSave.riverReady;
  delete oldSave.riverEnding;
  const campaign = normalizeProfile({ revision: 13, campaign: oldSave }).campaign;
  assert.equal(campaign.completed.length, 60);
  assert.equal(campaign.castleEnding, 'done');
  assert.equal(campaign.riverReady, true);
  assert.equal(campaign.riverEnding, 'locked');
  assert.doesNotThrow(() => requireCurrentLevel(campaign, { ...content.levels[60], index: 60 }));
});

test('new Castle-to-River handoff is staged; an early River attempt is rejected', () => {
  let profile = { revision: 1, campaign: deriveCampaign(prefix(60), 100, { ...castleFields, castleEnding: 'film' }) };
  const riverLevel = { ...content.levels[60], index: 60 };
  assert.throws(() => requireCurrentLevel(profile.campaign, riverLevel), { status: 409 });
  assert.throws(() => step(profile, { riverReady: true }), { status: 400 });
  assert.throws(() => step(profile, { transition: { from: 'castle', to: 'river', stage: 'handoff' } }), { status: 400 });
  profile = step(profile, { castleEnding: 'thanks' });
  profile = step(profile, { castleEnding: 'done' });
  assert.equal(profile.campaign.riverReady, false, 'new explicit false must survive Castle completion');
  assert.throws(() => step(profile, { transition: { from: 'castle', to: 'river', stage: 'arrival' } }), { status: 400 });
  profile = step(profile, { transition: { from: 'castle', to: 'river', stage: 'handoff' } });
  assert.throws(() => step(profile, { riverReady: true, transition: null }), { status: 400 });
  profile = step(profile, { transition: { from: 'castle', to: 'river', stage: 'atlas' } });
  profile = step(profile, { transition: { from: 'castle', to: 'river', stage: 'arrival' } });
  profile = step(profile, { riverReady: true, transition: null, region: 'river' });
  assert.equal(profile.campaign.region, 'river');
  assert.equal(profile.campaign.activeCompanion, 'wayfinder');
  assert.doesNotThrow(() => requireCurrentLevel(profile.campaign, riverLevel));
  assert.throws(() => requireCurrentLevel(profile.campaign, { ...content.levels[61], index: 61 }), { status: 409 });
});

test('cached Castle finale queue accepts atomic thanks acknowledgment and drains to River', () => {
  const completed=prefix(60);
  const inventory={jet:1,flywheel:2,prism:1,tileBomb:1,freeSwap:1};
  let profile={revision:219,campaignGeneration:2,inventory,campaign:deriveCampaign(completed,3577,{...castleFields,castleEnding:'thanks',riverReady:false,transition:null})};
  const queued=[
    {castleEnding:'done',transition:{from:'castle',to:'river',stage:'handoff'}},
    {transition:{from:'castle',to:'river',stage:'atlas'}},
    {region:'river',transition:{from:'castle',to:'river',stage:'arrival'}},
    {riverReady:true,transition:null},
  ];
  assert.throws(()=>step(profile,{castleEnding:'done',transition:{from:'castle',to:'river',stage:'arrival'}}),{status:400});
  for(const checkpoint of queued)profile=step(profile,checkpoint);
  assert.equal(profile.revision,223);
  assert.equal(profile.campaignGeneration,2);
  assert.deepEqual(profile.inventory,inventory);
  assert.deepEqual(profile.campaign.completed,completed);
  assert.equal(profile.campaign.coins,3577);
  assert.equal(profile.campaign.region,'river');
  assert.equal(profile.campaign.riverReady,true);
  assert.equal(profile.campaign.transition,null);
  assert.doesNotThrow(()=>requireCurrentLevel(profile.campaign,{...content.levels[60],index:60}));
});

test('atomic handoff requires a finished Castle and the first handoff stage', () => {
  const complete=deriveCampaign(prefix(60),100,{...castleFields,castleEnding:'film'});
  assert.throws(()=>step({revision:1,campaign:complete},{castleEnding:'film',transition:{from:'castle',to:'river',stage:'handoff'}}),{status:400});
  assert.throws(()=>step({revision:1,campaign:{...complete,castleEnding:'thanks'}},{castleEnding:'done',transition:{from:'castle',to:'river',stage:'atlas'}}),{status:400});
  const incomplete=deriveCampaign(prefix(59),100,{...castleFields,castleEnding:'thanks'});
  assert.throws(()=>step({revision:1,campaign:incomplete},{castleEnding:'done',transition:{from:'castle',to:'river',stage:'handoff'}}),{status:400});
});

test('River partial and finale saves resume at the same level with protected ending order', () => {
  const partial = deriveCampaign(prefix(64), 500, { ...castleFields, riverReady: true, castleEnding: 'done', region: 'river' });
  assert.equal(partial.completed.length, 64);
  assert.equal(partial.riverReady, true);
  assert.equal(partial.region, 'river');
  assert.doesNotThrow(() => requireCurrentLevel(partial, { ...content.levels[64], index: 64 }));
  let profile = { revision: 4, campaign: deriveCampaign(prefix(70), 700, { ...partial, completed: prefix(70) }) };
  assert.equal(profile.campaign.castleEnding, 'done');
  assert.equal(profile.campaign.riverEnding, 'film');
  assert.throws(() => step(profile, { riverEnding: 'done' }), { status: 400 });
  profile = step(profile, { riverEnding: 'thanks' });
  assert.equal(profile.campaign.riverEnding, 'thanks');
  assert.throws(() => step(profile, { riverEnding: 'film' }), { status: 400 });
  profile = step(profile, { riverEnding: 'done' });
  assert.equal(normalizeProfile(profile).campaign.riverEnding, 'done');
  assert.throws(() => step(profile, { riverEnding: 'thanks' }), { status: 400 });
});

test('legacy completed River checkpoints remain acknowledged and incomplete saves stay locked', () => {
  const completed = prefix(70);
  const base = { ...castleFields, riverReady: true, castleEnding: 'done', region: 'river' };
  assert.equal(deriveCampaign(completed, 700, { ...base, riverEnding: 'thanks' }).riverEnding, 'thanks');
  assert.equal(deriveCampaign(completed, 700, { ...base, riverEnding: 'done' }).riverEnding, 'done');
  assert.equal(deriveCampaign(prefix(69), 700, { ...base, riverEnding: 'film' }).riverEnding, 'locked');
});

test('guest saves cannot smuggle River state into a Portal account', () => {
  const guest = { ...emptyCampaign(), completed: prefix(30), coins: 0, oasisTransition: 'ready', gatehouseReady: true, demoEnding: 'done' };
  for (const change of [
    { riverReady: true }, { region: 'river' },
    { transition: { from: 'castle', to: 'river', stage: 'handoff' } },
    { riverEnding: 'thanks' }, { completed: prefix(60) },
  ]) assert.throws(() => guestImport({ ...guest, ...change }), { status: 400 });
});
