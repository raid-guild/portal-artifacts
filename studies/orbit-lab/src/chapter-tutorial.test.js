import test from 'node:test';
import assert from 'node:assert/strict';
import { CHAPTER_GUIDE_KEY, CHAPTER_ONE_STEPS, chapterGuidePages, chapterGuideStep, chapterGuideNext, readChapterGuides, acknowledgeChapterGuide, shouldShowChapterGuide, chapterGuideGraphic } from './chapter-tutorial.js';

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
    for (const kind of ['wells','light','gates','exit','hazards','stillness','shadows','portals','chasers']) assert.match(chapterGuideGraphic(kind), /role="img"/);
});
test('opening guide advances through five bounded steps; later chapter guides remain one page', () => {
    assert.equal(CHAPTER_ONE_STEPS.length,5);
    assert.deepEqual(CHAPTER_ONE_STEPS.map(step=>step.illustration),['wells','light','gates','exit','hazards']);
    assert.equal(chapterGuideStep(1,-3),CHAPTER_ONE_STEPS[0]);
    assert.equal(chapterGuideStep(1,99),CHAPTER_ONE_STEPS[4]);
    let index=0;
    for(let i=1;i<5;i++){index=chapterGuideNext(1,index);assert.equal(index,i);}
    assert.equal(chapterGuideNext(1,index),null);
    for(const id of [4,7,10,13]){assert.equal(chapterGuidePages(id).length,1);assert.equal(chapterGuideNext(id,0),null);}
    assert.equal(chapterGuidePages(2).length,0);
});
test('opening guide has synchronized one-well, Burn, and straight-coast artwork', () => {
    const art=chapterGuideGraphic('wells');
    for(const name of ['guide-burn-stage-one','guide-burn-stage-two','guide-burn-stage-three','guide-burn-first-well','guide-burn-replacement-well','guide-burn-thrust','guide-burn-coast','guide-wells-static'])assert.match(art,new RegExp(name));
    assert.match(art,/3 SPACE \/ REMOVE/);
    assert.match(art,/M175 51 L305 51/);
});
test('old guide acknowledgements migrate while the changed first guide is shown again', () => {
    const store=storage();store.setItem('orbit-lab-chapter-guides-v3',JSON.stringify([1,4,7,13]));
    const seen=readChapterGuides(store);
    assert.deepEqual([...seen],[4,7,13]);
    assert.equal(shouldShowChapterGuide({levelId:1,campaignMode:true,editorPlaytest:false,seen}),true);
    assert.equal(shouldShowChapterGuide({levelId:4,campaignMode:true,editorPlaytest:false,seen}),false);
    assert.equal(store.getItem(CHAPTER_GUIDE_KEY),JSON.stringify([4,7,13]));
});
