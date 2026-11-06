import test from 'node:test';
import assert from 'node:assert/strict';
import { CHAPTER_GUIDE_KEY, readChapterGuides, acknowledgeChapterGuide, shouldShowChapterGuide, chapterGuideGraphic } from './chapter-tutorial.js';

const storage = () => { const entries = new Map(); return { getItem: key => entries.get(key) ?? null, setItem: (key, value) => entries.set(key, value) }; };
test('chapter guides open only on the first level of each official campaign chapter', () => {
    const seen = new Set();
    for (const levelId of [1,4,7,10,13]) assert.equal(shouldShowChapterGuide({levelId,campaignMode:true,editorPlaytest:false,seen}), true);
    for (const levelId of [2,3,5,6,8,9,11,12,14,15]) assert.equal(shouldShowChapterGuide({levelId,campaignMode:true,editorPlaytest:false,seen}), false);
    assert.equal(shouldShowChapterGuide({levelId:1,campaignMode:false,editorPlaytest:false,seen}), false);
    assert.equal(shouldShowChapterGuide({levelId:1,campaignMode:true,editorPlaytest:true,seen}), false);
    assert.equal(shouldShowChapterGuide({levelId:1,campaignMode:true,editorPlaytest:false,seen,locked:true}), false);
});
test('acknowledgement persists and corrupt preferences do not count as seen', () => {
    const store = storage();
    assert.equal(readChapterGuides(store).size, 0);
    const seen = acknowledgeChapterGuide(store, new Set(), 1);
    assert.equal(readChapterGuides(store).has(1), true);
    assert.equal(shouldShowChapterGuide({levelId:1,campaignMode:true,editorPlaytest:false,seen}), false);
    store.setItem(CHAPTER_GUIDE_KEY, '{bad');
    assert.equal(readChapterGuides(store).size, 0);
    assert.equal(acknowledgeChapterGuide({setItem(){throw Error('blocked')}},new Set(),4).has(4), true);
    assert.equal(readChapterGuides(undefined).size, 0);
    assert.equal(acknowledgeChapterGuide(undefined, new Set(), 7).has(7), true);
});
test('each illustration has an accessible static description', () => {
    for (const kind of ['wells','stillness','shadows','portals','chasers']) assert.match(chapterGuideGraphic(kind), /role="img"/);
});
