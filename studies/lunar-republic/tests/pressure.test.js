import {test} from 'node:test';
import assert from 'node:assert/strict';
import {freshGame,advance,launch,previewLaunch,prediction,parseSave,missions} from '../dist/game.js';
import {SYSTEM,bodies,flightShifts} from '../dist/orbital.js';
import {syncRadio} from '../dist/radio.js';
import {timelineHTML} from '../dist/timeline.js';

function aim(s,city,id){
 const bearing=-50,speed=3.2,p=prediction(s,city,id,bearing,speed,0);
 const phase=((p.impactAngle-p.targetArrival)%(2*Math.PI)+2*Math.PI)%(2*Math.PI);
 return {bearing,speed,departure:phase/(SYSTEM.spin-bodies(0).omega)/3600};
}
function fire(s,city,id){const a=aim(s,city,id);return launch(s,city,id,a.bearing,a.speed,a.departure)}
const count=(s,key)=>s.radio.messages.filter(m=>m.key===key).length;

test('first Azure delivery opens one deadline; on-time arrival pays the bonus once',()=>{
 const s=freshGame();s.nextThreat=99;
 assert.equal(fire(s,'azure','freight').hit,true);
 assert.deepEqual(s.priorityFreight,{status:'active',openedTurn:s.turn,deadline:s.turn+4});
 assert.equal(s.shipments.at(-1).amount,28);
 assert.equal(count(s,'priorityOffer'),1);
 const a=aim(s,'azure','freight'),p=prediction(s,'azure','freight',a.bearing,a.speed,a.departure),arrival=s.turn+flightShifts(p,a.departure);
 s.priorityFreight.deadline=arrival; // The deadline shift itself counts.
 assert.equal(fire(s,'azure','freight').hit,true);
 assert.equal(s.turn,arrival);
 assert.equal(s.priorityFreight.status,'completed');
 assert.equal(s.shipments.at(-1).amount,40);
 assert.equal(s.shipments.at(-1).arrives,arrival+2);
 assert.equal(count(s,'priorityComplete'),1);
 fire(s,'azure','freight');
 assert.equal(s.shipments.at(-1).amount,28);
 assert.equal(count(s,'priorityOffer'),1);
 assert.equal(count(s,'priorityComplete'),1);
});

test('late and missed freight keep ordinary trade and cannot reopen the bonus',()=>{
 const s=freshGame();s.nextThreat=99;fire(s,'azure','freight');
 const a=aim(s,'azure','freight'),p=prediction(s,'azure','freight',a.bearing,a.speed,a.departure);
 s.priorityFreight.deadline=s.turn+flightShifts(p,a.departure)-1;
 assert.equal(fire(s,'azure','freight').hit,true);
 assert.equal(s.priorityFreight.status,'expired');
 assert.equal(s.shipments.at(-1).amount,28);
 assert.equal(count(s,'priorityExpired'),1);
 const t=freshGame();t.nextThreat=99;fire(t,'azure','freight');t.priorityFreight.deadline=t.turn+20;
 const before=t.priorityFreight.deadline;
 const miss=launch(t,'azure','freight',0,1.6);
 assert.equal(miss.hit,false);
 assert.equal(t.priorityFreight.status,'active');
 assert.equal(t.priorityFreight.deadline,before);
});

test('timely shipyard hit delays one pending blockade; deployed blockade remains',()=>{
 const s=freshGame();s.material=500;s.power=160;s.supplies=500;s.nextThreat=99;s.blockade=true;
 const before=s.nextThreat,first=fire(s,'vesper','strike-shipyards');
 assert.equal(first.hit,true);
 assert.equal(s.nextThreat,before+2);
 assert.equal(s.fleetDisrupted,true);
 assert.equal(s.fleetDisruptions,1);
 assert.equal(s.blockade,true);
 assert.equal(count(s,'disrupted'),1);
 s.power=160;
 fire(s,'vesper','strike-shipyards');
 assert.equal(s.nextThreat,before+2);
 assert.equal(s.fleetDisruptions,1);
 assert.equal(count(s,'disrupted'),1);
});

test('arrival after mobilization is too late, while destruction stops later fleets',()=>{
 const due=freshGame();due.power=160;due.material=500;due.nextThreat=due.turn+1;
 assert.equal(fire(due,'vesper','strike-shipyards').hit,true);
 assert.equal(due.blockade,true);
 assert.equal(due.fleetDisruptions,0);
 assert.equal(due.threatType,'raid');
 const destroyed=freshGame();destroyed.power=160;destroyed.material=500;destroyed.nextThreat=99;destroyed.districts.shipyards=45;
 fire(destroyed,'vesper','strike-shipyards');
 assert.equal(destroyed.districts.shipyards,0);
 assert.equal(destroyed.nextThreat,99);
 assert.equal(destroyed.fleetDisruptions,0);
 for(let i=0;i<100;i++)advance(destroyed);
 assert.equal(destroyed.blockade,false);
});

test('preview is side effect free and agrees on deadline, disruption, and exact return cargo',()=>{
 const s=freshGame();s.nextThreat=99;fire(s,'azure','freight');
 const a=aim(s,'azure','freight'),p=prediction(s,'azure','freight',a.bearing,a.speed,a.departure),before=JSON.stringify(s);
 const f=previewLaunch(s,'azure','freight',a.bearing,a.speed,a.departure,p);
 assert.equal(JSON.stringify(s),before);
 assert.equal(f.priorityFreight.status,'completed');
 assert.equal(f.returnShipment.amount,40);
 launch(s,'azure','freight',a.bearing,a.speed,a.departure);
 assert.deepEqual(f.priorityFreight,s.priorityFreight);
 const t=freshGame();t.material=500;t.power=160;t.nextThreat=99;
 const b=aim(t,'vesper','strike-shipyards'),q=prediction(t,'vesper','strike-shipyards',b.bearing,b.speed,b.departure);
 const g=previewLaunch(t,'vesper','strike-shipyards',b.bearing,b.speed,b.departure,q);
 assert.equal(g.fleetDisruptions,1);
 assert.equal(g.nextThreat,101);
 assert.ok(g.events.some(e=>e.title.includes('Fleet construction disrupted')&&e.phase==='resolution'));
 launch(t,'vesper','strike-shipyards',b.bearing,b.speed,b.departure);
 assert.equal(t.nextThreat,g.nextThreat);
});

test('timeline renders priority, disruption, and untouched future fleets accurately',()=>{
 const s=freshGame();s.nextThreat=99;fire(s,'azure','freight');
 const a=aim(s,'azure','freight');
 const freight=previewLaunch(s,'azure','freight',a.bearing,a.speed,a.departure);
 const freightHTML=timelineHTML(freight);
 assert.match(freightHTML,/40 supply crates scheduled for the return shuttle/);
 assert.doesNotMatch(freightHTML,/Last shift for priority freight/);
 assert.match(freightHTML,/This delivery schedules 40 supplies/);
 s.priorityFreight.deadline=freight.end;
 const deadlineHTML=timelineHTML(previewLaunch(s,'azure','freight',a.bearing,a.speed,a.departure));
 assert.match(deadlineHTML,/Last shift for priority freight/);

 const t=freshGame();t.power=160;t.material=500;t.nextThreat=99;
 const b=aim(t,'vesper','strike-shipyards');
 const disruption=previewLaunch(t,'vesper','strike-shipyards',b.bearing,b.speed,b.departure);
 const disruptionHTML=timelineHTML(disruption);
 assert.match(disruptionHTML,/Fleet construction disrupted/);
 assert.match(disruptionHTML,/No new enemy action before this operation resolves/);
 assert.match(disruptionHTML,/Next blockade fleet due at shift 101 · shipyard disruption included/);

 const u=freshGame();u.fleetDisruptions=3;u.fleetDisrupted=false;u.nextThreat=99;
 const untouched=timelineHTML(previewLaunch(u,'azure','freight',0,1.6));
 assert.match(untouched,/Next blockade fleet due at shift 99/);
 assert.doesNotMatch(untouched,/shipyard disruption included/);
});

test('legacy saves get a fresh request without losing progress; malformed fields are rejected',()=>{
 const s=freshGame();s.turn=12;s.deliveries=3;s.shipments=[{city:'azure',amount:28,arrives:14}];
 delete s.priorityFreight;delete s.fleetDisrupted;delete s.fleetDisruptions;
 const restored=parseSave(JSON.stringify(s));
 assert.equal(restored.deliveries,3);
 assert.deepEqual(restored.shipments,s.shipments);
 assert.deepEqual(restored.priorityFreight,{status:'active',openedTurn:12,deadline:16});
 assert.equal(count(restored,'priorityOffer'),1);
 assert.deepEqual(parseSave(JSON.stringify(restored)),restored);
 assert.ok(missions(restored,'azure')[0].reward.includes('40'));
 const won=structuredClone(s);won.won=true;
 assert.equal(parseSave(JSON.stringify(won)).priorityFreight.status,'expired');
 const bad=structuredClone(restored);bad.priorityFreight.deadline='soon';assert.equal(parseSave(JSON.stringify(bad)),null);
 bad.priorityFreight=restored.priorityFreight;bad.fleetDisruptions=-1;assert.equal(parseSave(JSON.stringify(bad)),null);
 syncRadio(restored);assert.equal(count(restored,'priorityOffer'),1);
});
