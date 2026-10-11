import {test} from 'node:test';import assert from 'node:assert/strict';
import {VERSION,newChallenge,resolveChallenge,validateChallenge} from '../src/challenge.js';
test('fixed challenge scoring and drop ledger',()=>{
 const body={version:VERSION,outcomes:Array(12).fill('outer-0'),durationMs:30000};assert.equal(validateChallenge(body).score,120);
 assert.equal(validateChallenge({...body,outcomes:Array(12).fill('jackpot')}).score,1800);
 assert.equal(validateChallenge({...body,outcomes:Array(12).fill('miss')}).score,0);
 const free=['outer-5','outer-11','outer-5',...Array(15).fill('outer-5')];const result=validateChallenge({...body,outcomes:free});assert.equal(result.details.bonus,6);assert.equal(result.score,0);
 for(const outcomes of [[],Array(11).fill('outer-0'),Array(13).fill('outer-0'),Array(12).fill('bad')])assert.throws(()=>validateChallenge({...body,outcomes}));
 assert.throws(()=>validateChallenge({...body,version:'0'}));assert.throws(()=>validateChallenge({...body,durationMs:10}));assert.throws(()=>validateChallenge(body,1000));
 const start=newChallenge();assert.equal(start.ball,'chrome');assert.deepEqual(start.upgrades,[]);assert.equal(start.auto,false);assert.throws(()=>resolveChallenge(start,'outer-0'));
 const next=resolveChallenge({...start,drops:11,dropped:1},'outer-5');assert.equal(next.drops,13);assert.equal(start.drops,12);
});
