// Centerline paths from the generated cowboy drawing; deterministic seekable ink/dust.
let strokes=[],particles=[],total=0,riderTotal=0;
const clamp=x=>Math.max(0,Math.min(1,x));
const hash=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v)};
function inside(x,y){
 const polygon=[[522,338],[598,338],[607,377],[586,390],[604,430],[625,470],[621,491],[641,531],[633,563],[621,606],[633,645],[610,665],[578,661],[569,631],[579,590],[571,565],[540,536],[517,509],[515,489],[501,466],[505,414],[520,393]];
 let yes=false;for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
  const[a,b]=polygon[i],[c,d]=polygon[j];if((b>y)!=(d>y)&&x<(c-a)*(y-b)/(d-b)+a)yes=!yes;
 }return yes;
}
function at(s,d){
 for(let i=1;i<s.points.length;i++)if(d<=s.lengths[i]){
  const t=clamp((d-s.lengths[i-1])/(s.lengths[i]-s.lengths[i-1]));
  return s.points[i-1].map((v,k)=>v+(s.points[i][k]-v)*t);
 }return s.points.at(-1);
}
export async function loadSunset(){
 const response=await fetch(new URL('./assets/sunset/paths.json',import.meta.url));
 if(!response.ok)throw new Error('Sunset drawing could not load.');
 const data=await response.json();total=0;riderTotal=0;particles=[];
 strokes=data.map(points=>{
  const lengths=[0];for(let i=1;i<points.length;i++)lengths.push(lengths.at(-1)+Math.hypot(points[i][0]-points[i-1][0],points[i][1]-points[i-1][1]));
  const length=lengths.at(-1),s={points,lengths,length,start:total};total+=length;
  let hit=0;const n=Math.max(5,Math.min(100,Math.ceil(length/3)));
  for(let i=0;i<n;i++){const[x,y]=at(s,length*i/(n-1));if(inside(x,y))hit++}s.rider=hit/n>.7;return s;
 });
 for(const s of [...strokes].reverse())if(s.rider){s.eraseStart=riderTotal;riderTotal+=s.length;}
 let id=0;
 for(const s of strokes){s.delay=at(s,s.length*.5)[0]/1536*1.6+hash(id++)*.8;if(s.rider)continue;
  for(let d=0;d<s.length;d+=5){const a=at(s,d),b=at(s,Math.min(s.length,d+3)),seed=id++;
   particles.push({x:a[0],y:a[1],dx:b[0]-a[0],dy:b[1]-a[1],delay:s.delay+hash(seed)*.3,speed:85+hash(seed+1)*145,lift:15+hash(seed+2)*70,phase:hash(seed+3)*Math.PI*2,life:1.7+hash(seed+4)*1.3});
  }
 }
}
function strokePart(ctx,s,start,end){
 if(end<=start)return;const a=at(s,start);ctx.beginPath();ctx.moveTo(...a);
 for(let i=1;i<s.points.length;i++)if(s.lengths[i]>start&&s.lengths[i]<end)ctx.lineTo(...s.points[i]);
 ctx.lineTo(...at(s,end));ctx.stroke();
}
export function drawSunset(ctx,box,seconds,opacity,reduced=false){
 if(!strokes.length||opacity<=0)return;
 ctx.save();ctx.translate(box.x,box.y);ctx.scale(box.width/1536,box.height/1024);
 ctx.strokeStyle='#292827';ctx.lineWidth=1.2;ctx.lineCap='round';ctx.lineJoin='round';
 const drawingDuration = 24 / 1.3;
 const eraseStart = drawingDuration + 1.2;
 const budget=(reduced?1:clamp(seconds/drawingDuration))*total,wind=seconds-(drawingDuration+5.2);
 for(const s of strokes){
  let start=0,end=Math.min(s.length,Math.max(0,budget-s.start));
  if(s.rider&&!reduced&&seconds>eraseStart)start=Math.max(0,Math.min(s.length,clamp((seconds-eraseStart)/3)*riderTotal-s.eraseStart));
  const alpha=reduced?1:wind>0?clamp(1-(wind-s.delay)/.65):1;
  ctx.globalAlpha=opacity*alpha;if(alpha>0)strokePart(ctx,s,start,end);
 }
 if(wind>0&&!reduced){ctx.lineWidth=1.05;
  for(const q of particles){const age=wind-q.delay;if(age<=0||age>=q.life)continue;
   const x=q.x+q.speed*(age*.5+age*age*.42),y=q.y-q.lift*age+Math.sin(age*3+q.phase)*age*14;
   const angle=age*(.5+Math.sin(q.phase)),c=Math.cos(angle),sn=Math.sin(angle);
   ctx.globalAlpha=opacity*Math.min(1,age/.18)*(1-age/q.life)*.8;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+q.dx*c-q.dy*sn,y+q.dx*sn+q.dy*c);ctx.stroke();
  }
 }
 ctx.restore();
}
