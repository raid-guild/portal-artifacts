export const VERSION='1';
export const POCKETS=[...Array.from({length:12},(_,i)=>{const values=[10,25,15,40,20,0,15,30,20,50,25,0],a=i*Math.PI*2/12,free=i===5||i===11;return {id:`outer-${i}`,x:Math.cos(a)*2.12,z:Math.sin(a)*2.12,r:.34,value:values[i],kind:free?'free':'score',label:free?'+2':String(values[i]),color:free?0xfe45bc:values[i]>=40?0xffbd50:0x37dafa};}),...Array.from({length:6},(_,i)=>{const values=[25,75,40,100,40,75],a=i*Math.PI*2/6+.27;return {id:`inner-${i}`,x:Math.cos(a)*1.14,z:Math.sin(a)*1.14,r:.29,value:values[i],kind:'score',label:String(values[i]),color:values[i]>=75?0xffbd50:0x37dafa};}),{id:'jackpot',x:0,z:0,r:.38,value:150,kind:'jackpot',label:'JP',color:0xffbd50}];
export function newChallenge(){return {round:0,roundTickets:0,totalTickets:0,drops:12,dropped:0,scores:0,jackpot:150,upgrades:[],ball:'chrome',auto:false,status:'playing',challenge:true,outcomes:[],bonus:0};}
export function resolveChallenge(run,id){
 if(run.status!=='playing'||run.outcomes.length>=run.dropped)throw new Error('No unresolved drop');
 const hole=POCKETS.find(h=>h.id===id);if(!hole&&id!=='miss')throw new Error('Unknown pocket');
 const bonus=hole?.kind==='free'?Math.min(2,6-run.bonus):0,points=hole?.kind==='free'?0:hole?.value||0;
 return {...run,outcomes:[...run.outcomes,id],scores:run.scores+1,drops:run.drops+bonus,bonus:run.bonus+bonus,totalTickets:run.totalTickets+points,roundTickets:run.totalTickets+points};
}
export function validateChallenge(body,wallMs=7200000){
 if(body?.version!==VERSION)throw new Error('Reload for current rules');
 if(!Array.isArray(body.outcomes)||body.outcomes.length>18)throw new Error('Invalid outcomes');
 let run=newChallenge();for(const id of body.outcomes){if(run.drops<=0)throw new Error('Excess outcomes');run={...run,drops:run.drops-1,dropped:run.dropped+1};run=resolveChallenge(run,id);}
 if(run.drops!==0)throw new Error('Incomplete challenge');
 if(!Number.isInteger(body.durationMs)||body.durationMs<run.outcomes.length*500||body.durationMs>7200000||body.durationMs>wallMs+3000)throw new Error('Invalid duration');
 return {score:run.totalTickets,durationMs:body.durationMs,details:{outcomes:[...run.outcomes],bonus:run.bonus,jackpots:run.outcomes.filter(id=>id==='jackpot').length}};
}
