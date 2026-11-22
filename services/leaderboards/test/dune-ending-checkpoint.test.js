import { test } from 'node:test';
import assert from 'node:assert/strict';
import { content, deriveCampaign, applyCheckpoint } from '../src/dune-rules.js';

for (const [count, key] of [[50, 'townEnding'], [60, 'castleEnding']]) {
  test(`${key}: new film checkpoint resumes, advances, and protects progress`, () => {
    const completed = content.levels.slice(0, count).map(level => level.id);
    const initial = deriveCampaign(completed, 321, {
      oasisTransition: 'ready', gatehouseReady: true, farmlandReady: true,
      townReady: true, castleReady: count === 60, demoEnding: 'done', farmlandEnding: 'done',
      townEnding: count === 60 ? 'done' : undefined, region: count === 60 ? 'castle' : 'town',
    });
    assert.equal(initial[key], 'film');
    assert.equal(deriveCampaign(completed, 321, initial)[key], 'film', 'reload preserves the film');
    let profile = { revision: 1, campaign: initial };
    const step = stage => { profile = applyCheckpoint(profile, { ...profile.campaign, [key]: stage }); return profile.campaign; };
    assert.throws(() => step('locked'), { status: 400 });
    assert.equal(step('thanks')[key], 'thanks');
    assert.equal(step('thanks')[key], 'thanks', 'duplicate completion is harmless');
    assert.equal(step('done')[key], 'done');
    assert.throws(() => step('film'), { status: 400 });
    assert.equal(profile.campaign.coins, 321);
    assert.deepEqual(profile.campaign.completed, completed);
    const old = deriveCampaign(completed, 321, { ...initial, [key]: 'thanks' });
    assert.equal(old[key], 'thanks', 'previously completed film stays completed');
    const compatibility = applyCheckpoint({ revision: 1, campaign: initial }, { ...initial, [key]: 'done' });
    assert.equal(compatibility.campaign[key], 'done', 'cached old clients may skip the new film checkpoint');
    assert.equal(compatibility.campaign.coins, 321);
  });
}
