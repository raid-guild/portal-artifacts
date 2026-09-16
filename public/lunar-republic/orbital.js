// Fictional Pelagos–Selene system. Units: km, seconds, radians.
// Circular restricted three-body model in an inertial barycentric frame.
export const SYSTEM = Object.freeze({muP:398600,muM:4902.8,rP:6371,rM:1737,distance:60000,spin:2*Math.PI/43200,entryAltitude:100});
export const TAU=2*Math.PI;
export const wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
export const epoch=s=>s.clock??(s.turn-1)*21600;
export function bodies(t,sys=SYSTEM){
 const omega=Math.sqrt((sys.muP+sys.muM)/sys.distance**3),a=t*omega;
 const rp=sys.distance*sys.muM/(sys.muP+sys.muM),rm=sys.distance-rp,c=Math.cos(a),s=Math.sin(a);
 return {planet:{x:-rp*c,y:-rp*s,vx:rp*omega*s,vy:-rp*omega*c},moon:{x:rm*c,y:rm*s,vx:-rm*omega*s,vy:rm*omega*c},angle:a,omega};
}
export function acceleration(x,y,t,sys=SYSTEM){const b=bodies(t,sys);const dx=x-b.planet.x,dy=y-b.planet.y,mx=x-b.moon.x,my=y-b.moon.y;const p=Math.max(1,Math.hypot(dx,dy))**3,m=Math.max(1,Math.hypot(mx,my))**3;return [-sys.muP*dx/p-sys.muM*mx/m,-sys.muP*dy/p-sys.muM*my/m]}
export function rk4(r,t,h,sys=SYSTEM){
 const f=(v,time)=>{const a=acceleration(v[0],v[1],time,sys);return [v[2],v[3],a[0],a[1]]};
 const add=(a,b,h)=>a.map((v,i)=>v+b[i]*h),k1=f(r,t),k2=f(add(r,k1,h/2),t+h/2),k3=f(add(r,k2,h/2),t+h/2),k4=f(add(r,k3,h),t+h);
 return r.map((v,i)=>v+h/6*(k1[i]+2*k2[i]+2*k3[i]+k4[i]));
}
export function initialState(departure,bearing,speed,sys=SYSTEM){const b=bodies(departure,sys),a=b.angle+Math.PI,h=bearing*Math.PI/180,rad=sys.rM+2;
 // Fixed near-side launcher, synchronous surface velocity, heading measured from inward radial.
 return [b.moon.x+Math.cos(a)*rad,b.moon.y+Math.sin(a)*rad,b.moon.vx-Math.sin(a)*rad*b.omega+Math.cos(a-h)*speed,b.moon.vy+Math.cos(a)*rad*b.omega+Math.sin(a-h)*speed];}
export function validateAim(bearing,speed,departure){return Number.isFinite(bearing)&&bearing>=-85&&bearing<=85&&Number.isFinite(speed)&&speed>=1.6&&speed<=6&&Number.isFinite(departure)&&departure>=0&&departure<=24}
export function trajectory({departure=0,bearing=-50,speed=3.2,maxTime=172800,stepScale=1},sys=SYSTEM){
 let r=initialState(departure,bearing,speed,sys),t=0,nextSample=0,closest=Infinity,closestPoint=null,outcome='orbit';const trail=[{x:r[0],y:r[1],t:0}];
 const entry=sys.rP+sys.entryAltitude;
 for(let i=0;i<60000&&t<maxTime;i++){
  const b=bodies(departure+t,sys),dp=Math.hypot(r[0]-b.planet.x,r[1]-b.planet.y),dm=Math.hypot(r[0]-b.moon.x,r[1]-b.moon.y);
  if(dp-entry<closest){closest=Math.max(0,dp-entry);closestPoint={x:r[0],y:r[1],t}}
  if(dp<=entry+.0001){outcome='planet';break}if(t>1&&dm<=sys.rM+.0001){outcome='moon';break}
  if(Math.hypot(r[0],r[1])>sys.distance*4){outcome='escape';break}
  const vp=Math.max(.1,Math.hypot(r[2]-b.planet.vx,r[3]-b.planet.vy)),vm=Math.max(.1,Math.hypot(r[2]-b.moon.vx,r[3]-b.moon.vy));
  const h=Math.min(maxTime-t,Math.max(.02,Math.min(80,Math.max(.01,dp-entry)*.3/vp,Math.max(.01,dm-sys.rM)*.3/vm)*stepScale));
  const next=rk4(r,departure+t,h,sys),bn=bodies(departure+t+h,sys);
  const hitP=Math.hypot(next[0]-bn.planet.x,next[1]-bn.planet.y)<=entry,hitM=Math.hypot(next[0]-bn.moon.x,next[1]-bn.moon.y)<=sys.rM;
  if(hitP||hitM){let lo=0,hi=h;for(let j=0;j<25;j++){const mid=(lo+hi)/2,rr=rk4(r,departure+t,mid,sys),bb=bodies(departure+t+mid,sys),body=hitP?bb.planet:bb.moon;if(Math.hypot(rr[0]-body.x,rr[1]-body.y)<=(hitP?entry:sys.rM))hi=mid;else lo=mid}r=rk4(r,departure+t,hi,sys);t+=hi;outcome=hitP?'planet':'moon';break}
  r=next;t+=h;if(t>=nextSample){trail.push({x:r[0],y:r[1],t});nextSample=t+maxTime/700;}
 }
 trail.push({x:r[0],y:r[1],t});const b=bodies(departure+t,sys),dx=r[0]-b.planet.x,dy=r[1]-b.planet.y;
 const vx=r[2]-b.planet.vx,vy=r[3]-b.planet.vy,v=Math.hypot(vx,vy),rad=Math.hypot(dx,dy);
 const entryAngle=outcome==='planet'?Math.asin(Math.max(0,Math.min(1,-(dx*vx+dy*vy)/(rad*v))))*180/Math.PI:null;
 return {outcome,trail,duration:t,departure,arrival:departure+t,final:{x:r[0],y:r[1],vx:r[2],vy:r[3]},arrivalSpeed:outcome==='planet'?v:null,entryAngle,impactAngle:Math.atan2(dy,dx),closest:outcome==='planet'?0:closest,closestPoint};
}
export function targetSpec(city,mission){const cargo=['freight','relief','rebuild'].includes(mission);const offsets={azure:-2.1,meridian:2.2,vesper:4.2};const district=mission.split('-')[1];const extra=mission==='demo'?.5:mission==='break-blockade'?-.4:district==='shipyards'?-.25:district==='harbor'?.25:0;return {longitude:offsets[city]+extra,tolerance:cargo?850:mission==='demo'?500:250,cargo,maxSpeed:11.5,minAngle:8,maxAngle:78};}
export function assessFlight(f,city,mission,sys=SYSTEM){const spec=targetSpec(city,mission),targetNow=spec.longitude+sys.spin*f.departure,targetArrival=spec.longitude+sys.spin*f.arrival,angleError=wrap(f.impactAngle-targetArrival),missDistance=Math.abs(angleError)*sys.rP;
 const locationOK=f.outcome==='planet'&&missDistance<=spec.tolerance;
 const safe=!spec.cargo||(f.arrivalSpeed<=spec.maxSpeed&&f.entryAngle>=spec.minAngle&&f.entryAngle<=spec.maxAngle);
 let reason;
 if(f.outcome==='moon')reason='Falls back onto Selene. Increase speed or change direction to clear lunar gravity.';
 else if(f.outcome==='escape')reason='Escapes the system. Reduce speed or turn toward Pelagos.';
 else if(f.outcome==='orbit')reason='No arrival within 48 hours. The payload remains in flight; adjust direction and speed to lower its closest approach.';
 else if(!locationOK)reason=`Arrives ${Math.round(missDistance).toLocaleString()} km ${angleError>0?'ahead of':'behind'} the target. Adjust departure time to meet the rotating destination.`;
 else if(!safe)reason=f.arrivalSpeed>spec.maxSpeed?'Cargo entry is too fast for its heat shield. Reduce launch speed.':f.entryAngle<spec.minAngle?'Cargo entry is too shallow; it skips the receiving corridor.':'Cargo entry is too steep for safe recovery. Adjust direction and speed.';
 else reason=spec.cargo?'Cargo reaches the receiving corridor inside its entry limits.':'The impact intersects the selected target zone.';
 return {...f,...spec,targetNow,targetArrival,missDistance,angleError,locationOK,entrySafe:safe,hit:locationOK&&safe,reason};
}
export function predict(s,city,mission,bearing,speed,delay=0){if(!validateAim(bearing,speed,delay))throw Error('Invalid orbital settings.');return assessFlight(trajectory({departure:epoch(s)+delay*3600,bearing,speed}),city,mission)}
export function flightShifts(f,delay){return Math.max(1,Math.ceil((delay*3600+f.duration)/21600));}
