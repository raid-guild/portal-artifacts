const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const signed=n=>(n>0?'+':'')+n;
export function timelineHTML(f,past=false){
 if(!f||f.error)return `<p class="subtle">${esc(f?.error??'Choose an operation to forecast time.')}</p>`;
 const hours=f.shifts*6,at=h=>Math.max(0,Math.min(100,h/hours*100));
 const threat=f.events.filter(e=>e.lane==='Vesper');
 const summary=threat.length?'Before resolution: '+threat.map(e=>e.title+' (+'+e.offset+' shifts)').join('; ')+'.':'No new enemy action before this operation resolves.';
 const point=(pos,label,kind='')=>`<span class="time-stop ${kind}" style="left:${pos}%" title="${esc(label)}" role="img" aria-label="${esc(label)}"></span>`;
 const eventList=[{lane:'Payload',offset:0,title:'Commit: launch resources spent now'},...(f.outcome==='agreement'?[]:[{lane:'Payload',offset:f.delay/6,title:`Launch after ${f.delay.toFixed(1)} h of preparation`},{lane:'Payload',offset:(f.delay+f.flightHours)/6,title:(f.outcome==='planet'?'Planet arrival':f.outcome==='moon'?'Lunar fallback':f.outcome==='escape'?'System escape':'48-hour tracking ends')}]),...f.events,{lane:'Outcome',offset:f.shifts,title:f.resultTitle}].sort((a,b)=>a.offset-b.offset);
 return `<section class="launch-timeline" aria-label="Campaign time forecast"><span class="overline">${past?'DURING THIS OPERATION':'IF YOU COMMIT NOW'}</span><h3>${past?'Advanced':'Advance'} ${f.shifts} shift${f.shifts===1?'':'s'} · ${hours} hours</h3><p class="timeline-summary">${summary}</p>
 <div class="time-map"><div class="time-scale"><span>Now · ${f.start}</span><span>Shift ${f.end}</span></div>
 <div class="time-lane"><b>Payload</b><div class="time-track"><span class="time-wait" style="width:${at(f.delay)}%"></span><span class="time-flight" style="left:${at(f.delay)}%;width:${at(f.delay+f.flightHours)-at(f.delay)}%"></span>${point(at(f.delay),'Launch +'+f.delay.toFixed(1)+' h')}${point(at(f.delay+f.flightHours),'Flight ends +'+(f.delay+f.flightHours).toFixed(1)+' h','arrival')}${point(100,'Operation resolves after '+f.shifts+' shifts','resolve')}</div></div>
 ${['Vesper','Shuttles'].map(lane=>`<div class="time-lane"><b>${lane}</b><div class="time-track ${lane==='Vesper'?'enemy-track':''}">${f.events.filter(e=>e.lane===lane).map(e=>point(e.offset/f.shifts*100,e.title+' · +'+e.offset+' shifts')).join('')}</div></div>`).join('')}</div>
 <p class="time-key">Dashed: departure wait · Teal: flight · ◆ resolution</p>
 <details class="time-events"><summary>Timeline events (${eventList.length})</summary><ol>${eventList.map(e=>`<li><b>+${(e.offset*6).toFixed(1)} h</b><span>${esc(e.title)}</span></li>`).join('')}</ol></details>
 <div class="forecast-resources">${f.resources.map(r=>`<div><span>${r.key==='power'?'Power · MWh':r.key==='material'?'Material · t':'Supplies'}</span><b>${r.before} → ${r.after}</b><small>net ${signed(r.delta)}</small></div>`).join('')}</div>
 <p class="turn-note">Net change includes the launch cost, production, upkeep, storage limits and received shipments. Resources are spent on commit, including when departure is delayed.</p>
 ${f.blockade?'<p class="timeline-warning">Azure remains blockaded at resolution. Its return shuttles are held.</p>':''}
 ${f.raidDamage?'<p class="timeline-warning">Solar field damaged at resolution: daylight output is 55% until repaired.</p>':''}
 ${f.returnShipment?`<p class="timeline-return">This delivery schedules ${f.returnShipment.amount} supplies for shift ${f.returnShipment.arrives} (+2 shifts after resolution). ${f.returnShipment.city==='azure'?'Arrival requires an open Azure route.':''} Future shifts are not included above.</p>`:''}
 <p class="turn-note">Each shift is 6 hours. Partial shifts round up; shift events happen before the operation’s arrival effects. Planning and construction take no time.</p></section>`;
}
