// Measured pen strokes reveal by distance, preserving order on seek and resize.
const paths = [];
const P = (x,y) => ({x,y});
const line = (points,weight=1,tone=1) => paths.push({points,weight,tone});
function bezier(a,b,c,d,t) {
  const q=1-t;
  return P(q*q*q*a.x+3*q*q*t*b.x+3*q*t*t*c.x+t*t*t*d.x,
    q*q*q*a.y+3*q*q*t*b.y+3*q*t*t*c.y+t*t*t*d.y);
}
function cubic(a,b,c,d,weight=1,tone=1) {
  const points=[];
  for(let i=0;i<=36;i++) points.push(bezier(a,b,c,d,i/36));
  line(points,weight,tone);
}

// The road sweeps into an off-centre vanishing point on the right.
const horizon=P(.88,.42);
cubic(horizon,P(.74,.50),P(.37,.81),P(.12,.94),1.32);
cubic(horizon,P(.86,.55),P(.78,.83),P(.73,.94),1.25);
cubic(P(.895,.43),P(.78,.54),P(.55,.81),P(.48,.94),.50,.43);
cubic(P(.03,.48),P(.32,.47),P(.61,.45),horizon,.70,.54);
cubic(horizon,P(.93,.42),P(.97,.43),P(1.02,.43),.62,.48);
cubic(P(.035,.91),P(.12,.84),P(.25,.68),P(.46,.56),.56,.44);

// One pole row diminishes toward the road's vanishing point.
const poles=[
  {x:.13,y:.79,h:.65},{x:.49,y:.61,h:.30},{x:.68,y:.52,h:.16},
  {x:.79,y:.46,h:.086},{x:.845,y:.437,h:.044}
];
const crossWidth=pole=>Math.min(.076,pole.h*.12);
for(let i=0;i<poles.length;i++) {
  const pole=poles[i],top=pole.y-pole.h;
  cubic(P(pole.x,pole.y),P(pole.x+.003,pole.y-pole.h*.31),
    P(pole.x-.003,top+pole.h*.27),P(pole.x,top),i<2?1.02:.86);
  const levels=i<2?[.13,.22,.31]:i<4?[.22,.31]:[.22];
  for(const level of levels) {
    const y=top+pole.h*level,w=crossWidth(pole);
    cubic(P(pole.x-w,y+.002),P(pole.x-w*.25,y-.002),
      P(pole.x+w*.25,y+.002),P(pole.x+w,y),.74);
    if(i<3) {
      line([P(pole.x-w*.73,y-.006),P(pole.x-w*.73,y+.006)],.45,.68);
      line([P(pole.x+w*.73,y-.006),P(pole.x+w*.73,y+.006)],.45,.68);
    }
  }
}

// Both wire strokes and bird anchors use these exact cubic curves.
function wireCurve(a,b,level) {
  const start=P(a.x+crossWidth(a)*.86,a.y-a.h*(1-level));
  const end=P(b.x+crossWidth(b)*.86,b.y-b.h*(1-level));
  const sag=.027*(a.h/.65);
  return [start,P(start.x+(end.x-start.x)*.34,start.y+sag),
    P(start.x+(end.x-start.x)*.68,end.y+sag),end];
}
for(let i=0;i<poles.length-1;i++) {
  for(const level of [.22,.31]) {
    const [a,b,c,d]=wireCurve(poles[i],poles[i+1],level);
    cubic(a,b,c,d,.48,.76);
  }
}
for(const [x,y,s] of [[.045,.88,.022],[.20,.74,.018],[.31,.67,.013],
  [.42,.58,.010],[.60,.50,.008]]) {
  line([P(x-s*.45,y-s*.65),P(x,y),P(x+s*.5,y-s)],.48,.49);
  line([P(x-s*.7,y-s*.25),P(x,y),P(x+s*.8,y-s*.45)],.43,.43);
}

let total=0;
for(const path of paths) {
  path.lengths=[0];
  for(let i=1;i<path.points.length;i++) {
    const a=path.points[i-1],b=path.points[i];
    path.lengths.push(path.lengths[i-1]+Math.hypot((b.x-a.x)*1.35,b.y-a.y));
  }
  path.start=total;
  total+=path.lengths.at(-1);
}

const perches=[
  ...[.16,.31,.47,.64,.81].map((t,i)=>({span:0,t,dir:i%2?-1:1,scale:1})),
  ...[.38,.73].map((t,i)=>({span:1,t,dir:i?1:-1,scale:.72}))
];
const birdOutline=[
  [-.92,-.42],[-.61,-.42],[-.36,-.69],[.02,-.79],[.29,-.73],
  [.46,-.82],[.64,-.75],[.78,-.69],[.61,-.64],[.48,-.51],
  [.35,-.28],[-.07,-.24],[-.42,-.35],[-.92,-.42]
];
const birdWing=[[-.39,-.62],[-.13,-.57],[.19,-.41]];
const birdFeet=[[[-.11,-.24],[-.10,0]],[[.14,-.27],[.16,0]]];
function trace(ctx,points,fraction) {
  if(fraction<=0) return;
  const lengths=[0];
  for(let i=1;i<points.length;i++)
    lengths.push(lengths.at(-1)+Math.hypot(points[i][0]-points[i-1][0],
      points[i][1]-points[i-1][1]));
  const limit=lengths.at(-1)*Math.min(1,fraction);
  ctx.beginPath();ctx.moveTo(...points[0]);
  for(let i=1;i<points.length;i++) {
    if(limit>=lengths[i]) ctx.lineTo(...points[i]);
    else if(limit>lengths[i-1]) {
      const t=(limit-lengths[i-1])/(lengths[i]-lengths[i-1]);
      ctx.lineTo(points[i-1][0]+(points[i][0]-points[i-1][0])*t,
        points[i-1][1]+(points[i][1]-points[i-1][1])*t);
      break;
    } else break;
  }
  ctx.stroke();
}
function drawBird(ctx,box,perch,fraction,opacity) {
  if(fraction<=0) return;
  const anchor=bezier(...wireCurve(poles[perch.span],poles[perch.span+1],.31),perch.t);
  const unit=Math.min(box.width,box.height);
  const size=Math.max(perch.span?7:9,Math.min(perch.span?12:17,
    unit*.021*perch.scale));
  ctx.save();
  ctx.translate(box.x+anchor.x*box.width,box.y+anchor.y*box.height);
  ctx.scale(size*perch.dir,size);
  ctx.strokeStyle=`rgba(34,40,40,${opacity*.88})`;
  ctx.lineWidth=Math.max(.07,1.1/size);
  trace(ctx,birdOutline,Math.min(1,fraction/.72));
  trace(ctx,birdWing,Math.max(0,Math.min(1,(fraction-.64)/.20)));
  for(const foot of birdFeet)
    trace(ctx,foot,Math.max(0,Math.min(1,(fraction-.81)/.19)));
  ctx.restore();
}

export function drawRoad(ctx,box,reveal,opacity=1) {
  if(reveal<=0||opacity<=0) return;
  const distance=Math.min(1,reveal/.86)*total;
  const unit=Math.min(box.width,box.height);
  ctx.save();
  ctx.lineCap='round';ctx.lineJoin='round';
  for(const path of paths) {
    const remaining=distance-path.start;
    if(remaining<=0) break;
    ctx.beginPath();
    const first=path.points[0];
    ctx.moveTo(box.x+first.x*box.width,box.y+first.y*box.height);
    for(let i=1;i<path.points.length;i++) {
      const a=path.points[i-1],b=path.points[i];
      const start=path.lengths[i-1],end=path.lengths[i];
      if(remaining>=end) ctx.lineTo(box.x+b.x*box.width,box.y+b.y*box.height);
      else if(remaining>start) {
        const t=(remaining-start)/(end-start);
        ctx.lineTo(box.x+(a.x+(b.x-a.x)*t)*box.width,
          box.y+(a.y+(b.y-a.y)*t)*box.height);
        break;
      } else break;
    }
    ctx.strokeStyle=`rgba(34,40,40,${opacity*path.tone*.88})`;
    ctx.lineWidth=Math.max(.55,unit*.0025*path.weight);
    ctx.stroke();
  }
  const birdProgress=Math.max(0,Math.min(1,(reveal-.86)/.14));
  for(let i=0;i<perches.length;i++) {
    const local=Math.max(0,Math.min(1,(birdProgress-i*.09)/.45));
    drawBird(ctx,box,perches[i],local,opacity);
  }
  ctx.restore();
}
