import {test} from 'node:test';
import assert from 'node:assert/strict';
import {freshGame,launch,advance,parseSave,previewLaunch,prediction,capacity} from '../dist/game.js';
import {SYSTEM,bodies} from '../dist/orbital.js';

// Solve a launch window inside tests only; players still aim the rail themselves.
function fire(s,city,id){
 if(id==='ultimatum')return launch(s,city,id,-50,3.2,0);
 const bearing=-50,speed=3.2,p=prediction(s,city,id,bearing,speed,0);
 const phase=((p.impactAngle-p.targetArrival)%(2*Math.PI)+2*Math.PI)%(2*Math.PI);
 return launch(s,city,id,bearing,speed,phase/(SYSTEM.spin-bodies(0).omega)/3600);
}
function funded(s){s.power=capacity(s);s.material=500;s.supplies=500;return s}
function openTrade(s){s.nextThreat=999;fire(funded(s),'azure','freight')}
function endDiplomatically(){const s=freshGame();openTrade(s);s.trust=2;s.pressure=3;fire(s,'vesper','ultimatum');return s}

test('diplomatic completion records a stable once-only prologue report',()=>{
 const s=endDiplomatically();assert.equal(s.won,true);assert.deepEqual(s.prologue,{seen:false,summary:{turn:s.turn,launches:s.launches,hits:s.hits,deliveries:s.deliveries,legacy:false}});
 const first=structuredClone(s.prologue.summary);advance(s);fire(funded(s),'azure','freight');assert.deepEqual(s.prologue.summary,first);
 assert.deepEqual(parseSave(JSON.stringify(s)).prologue,s.prologue);
});
test('military completion records counters after clearing the final blockade',()=>{
 const s=freshGame();openTrade(s);s.levels.rail=1;s.nextThreat=999;s.blockade=true;
 for(const d of ['shipyards','command'])for(let i=0;i<2;i++)fire(funded(s),'vesper','heavy-'+d);
 assert.equal(s.won,false);fire(funded(s),'azure','break-blockade');assert.equal(s.won,true);
 assert.equal(s.prologue.summary.turn,s.turn);assert.equal(s.prologue.summary.launches,s.launches);assert.equal(s.prologue.summary.hits,s.hits);
});
test('preview shows victory but does not attach a report to source state',()=>{
 const s=freshGame();openTrade(s);s.trust=2;s.pressure=3;const before=structuredClone(s);
 const forecast=previewLaunch(s,'vesper','ultimatum',-50,3.2,0);
 assert.equal(forecast.resultTitle,'Vesper stands down.');assert.deepEqual(s,before);assert.equal(s.prologue,null);
});
test('won legacy saves gain current-record label; bad optional data is repaired',()=>{
 const s=endDiplomatically();delete s.prologue;let restored=parseSave(JSON.stringify(s));
 assert.equal(restored.won,true);assert.equal(restored.prologue.seen,false);assert.equal(restored.prologue.summary.legacy,true);
 restored.prologue.seen=true;assert.equal(parseSave(JSON.stringify(restored)).prologue.seen,true);
 restored.prologue={seen:'no',summary:{turn:-1}};assert.equal(parseSave(JSON.stringify(restored)).prologue.summary.legacy,true);
 const uncompleted=freshGame();uncompleted.prologue={seen:true,summary:{turn:100}};assert.equal(parseSave(JSON.stringify(uncompleted)).prologue,null);
});
