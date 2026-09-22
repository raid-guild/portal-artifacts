// Authored reactions to campaign state. Reading never changes operation availability.
export const CONTACTS={azure:{name:'Captain Sera Venn',call:'AZURE PORT CONTROL',city:'azure'},meridian:{name:'Coordinator Tavi Or',call:'MERIDIAN CIVIC BAND',city:'meridian'},station:{name:'Engineer Iona Vale',call:'TRANQUILITY / INTERNAL',city:null}};
export const TRANSMISSIONS={
 briefing:['station','Communications restored','The radio archive is online. These briefings reflect current conditions; earlier flights remain in the station log. New traffic will follow events from here.','station'],
 welcome:['azure','An open channel','We hear you, Tranquility. Our receiving crews are ready for lunar ore. Put it inside the corridor and we’ll send supplies back. The Authority doesn’t speak for everyone down here.','freight'],
 relief:['meridian','A request from the plateau','We picked up your carrier signal. We need shelter components, and we can offer supplies in exchange. We haven’t chosen a side. Give us a reason to trust yours.','relief'],
 freight:['azure','The first cargo is down','Your ore is on the ground. We’ve allocated supplies to a return shuttle; allow two shifts for departure and transit. Keep an eye on the route.','freight'],
 preparing:['station','Fleet assembly detected','Vesper’s shipyards are preparing a blockade fleet. A precise strike on the yards before mobilization delays this fleet by two shifts. Destroying the yards stops future mobilization.','strike-shipyards'],
 disrupted:['station','The fleet is delayed','Your strike halted work on the blockade fleet. Its launch is delayed two shifts. An existing blockade would still need a strike on the anchorage.','strike-shipyards'],
 priorityOffer:['azure','Priority ore request','We need a second ore delivery by the stated shift, inclusive. Make the window and we can load 40 supply crates instead of 28. A late drop still earns the ordinary exchange.','freight'],
 priorityComplete:['azure','Priority cargo received','The ore arrived in time. We’re loading 40 supply crates onto the return shuttle; allow two shifts for transit, and watch the blockade.','freight'],
 priorityExpired:['azure','Priority window closed','Our priority crews have stood down. We can still receive lunar ore and return the ordinary 28 supply crates.','freight'],
 blockade:['azure','Ships at the outer anchorage','Authority ships have closed our departure lanes. We can hold your cargo, Commander. We can’t hold forever. Their remote anchorage is now marked for a blockade-breaking shot.','break-blockade'],
 reopened:['azure','Departure lanes clear','The fleet has withdrawn from our lanes. Held shuttles can complete their approach next shift. Our crews are still here. So is the agreement.','freight'],
 raid:['station','Panels gone dark','The raid damaged the solar field. We’re getting barely half our daylight output. I can restore the array with fifteen tonnes of material and six supply crates.','station'],
 repaired:['station','Back on the bus','Full daylight output is restored. Those panels aren’t armor. Ending Vesper’s mobilization would save us another repair job.','station'],
 alliance:['meridian','The council has voted','Two relief deliveries, both honored. The council has joined the lunar alliance. From now on we’ll exchange supplies for construction material without asking for supply crates up front.','relief'],
 demo:['station','They saw it','Vesper has delayed its next operation after the offshore impact. You’ve bought two shifts. Another demonstration won’t buy another delay; use this opening.','demo'],
 yards:['station','No more hulls','The shipyards are gone. Vesper can no longer mobilize new operations. Any fleet already blockading Azure still needs to be dealt with.','destination'],
 command:['station','Command is silent','Vesper’s military command is destroyed. Future mobilization has stopped. Check Azure’s route before you call it over.','destination'],
 terms:['meridian','Terms are on the table','Our coalition has enough leverage. Vesper is ready to recognize lunar independence and reopen trade. You can accept their surrender through Vesper’s operations channel.','ultimatum'],
 surrender:['azure','A different kind of silence','The stand-down order came through. Azure’s lanes are open, and Vesper’s surviving districts are accepting reconstruction freight. We should get used to peaceful traffic.','rebuild'],
 fabrication:['station','Made on Selene','Local fabrication is online. We now produce supplies every shift. Trade can fund expansion, but we have the beginnings of a station that can sustain itself.','station'],
 victory:['station','Keep this frequency','The route is open. The republic can survive here. There’s still a station to build and a world to trade with. I’ll keep the channel open.','station']
};
const snapshot=s=>({blockade:!!s.blockade,raid:!!s.raidDamage,freight:s.deliveries>0,preparing:!s.surrendered&&s.threatType==='blockade'&&s.districts.shipyards>0&&s.districts.command>0,disruptions:s.fleetDisruptions??0,priorityOffer:s.priorityFreight?.status==='active',priorityComplete:s.priorityFreight?.status==='completed',priorityExpired:s.priorityFreight?.status==='expired',alliance:s.trust>=2,demo:!!s.demonstrated,yards:s.districts.shipyards===0,command:s.districts.command===0,terms:!s.surrendered&&s.pressure>=3&&s.trust>=2&&!Object.values(s.districts).every(v=>v===0),surrender:!!s.surrendered,fabrication:s.levels.production>0,victory:!!s.won,relief:true});
function emit(s,key){s.radio.serial++;s.radio.messages.unshift({id:s.radio.serial,key,turn:s.turn,read:false,announced:false});s.radio.messages=s.radio.messages.slice(0,100)}
export function syncRadio(s){
 const now=snapshot(s);
 if(!s.radio){s.radio={serial:0,messages:[],previous:s.turn>1?{freight:now.freight,demo:now.demo,relief:now.alliance}: {}};emit(s,s.turn>1?'briefing':'welcome')}
 const before=s.radio.previous;
 for(const key of ['relief','freight','preparing','priorityOffer','priorityComplete','priorityExpired','blockade','raid','alliance','demo','yards','command','terms','surrender','fabrication','victory'])if(now[key]&&!before[key])emit(s,key);
 if(now.disruptions>(before.disruptions??0))emit(s,'disrupted');
 if(before.blockade&&!now.blockade&&!now.surrender)emit(s,'reopened');
 if(before.raid&&!now.raid)emit(s,'repaired');
 s.radio.previous=now;
}
export function restoreRadio(s){
 const r=s.radio;
 if(!r||!Number.isSafeInteger(r.serial)||r.serial<0||!Array.isArray(r.messages)||r.messages.length>100||!r.previous||typeof r.previous!=='object'||r.messages.some(m=>!Number.isSafeInteger(m.id)||m.id<1||m.id>r.serial||!Object.hasOwn(TRANSMISSIONS,m.key)||!Number.isInteger(m.turn)||m.turn<1||typeof m.read!=='boolean'||typeof m.announced!=='boolean')||new Set(r.messages.map(m=>m.id)).size!==r.messages.length)delete s.radio;
 syncRadio(s);
}
export function readTransmission(s,id){const m=s.radio.messages.find(m=>m.id===id);if(m){m.read=true;m.announced=true}return m}
export function transmission(m){const [sender,title,body,action]=TRANSMISSIONS[m.key];return {...m,sender,title,body,action,contact:CONTACTS[sender]}}
