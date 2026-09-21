// Advice describes the actual trajectory; it never changes a shot or solves a window.
export function aimAdvice(p){
 if(!p)return '';
 if(p.outcome==='moon')return 'Clear the Moon first: increase muzzle speed or adjust direction. Departure time cannot fix a lunar fallback.';
 if(p.outcome==='escape')return 'Bring the path inward: reduce muzzle speed or change direction. Find a planet intercept before adjusting departure time.';
 if(p.outcome==='orbit')return 'The path misses the planet. Adjust direction and speed first; departure timing alone will not lower this orbit.';
 if(p.cargo&&!p.entrySafe)return p.arrivalSpeed>p.maxSpeed?'Entry is too fast. Reduce muzzle speed, then recheck the path and arrival window.':p.entryAngle<p.minAngle?'Entry is too shallow. Change direction to aim deeper into the atmosphere, then recheck timing.':'Entry is too steep. Change direction for a more glancing approach, then recheck timing.';
 if(!p.locationOK)return 'The flight path works. Hold direction and speed; adjust Depart in to shrink the miss distance. Use Arrival close-up and small timing steps near the gold arc.';
 return 'The target and entry checks pass. Check the timeline for threats and resource changes, then commit when ready.';
}
export function lessonSteps(p){return [{label:'Reach planet',done:p?.outcome==='planet'},{label:'Safe entry',done:p?.outcome==='planet'&&p.entrySafe},{label:'Meet target',done:!!p?.hit}]}
