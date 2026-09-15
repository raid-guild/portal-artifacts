// Run with @napi-rs/canvas installed, or NODE_PATH pointing to its node_modules.
const {createCanvas,GlobalFonts}=require('@napi-rs/canvas');
const fs=require('node:fs'),path=require('node:path');
GlobalFonts.registerFromPath('/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf','FieldSans');
GlobalFonts.registerFromPath('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf','FieldMono');
const canvas=createCanvas(1200,630),c=canvas.getContext('2d');
c.fillStyle='#141c19';c.fillRect(0,0,1200,630);
function line(points,color='#34443b',width=1){c.strokeStyle=color;c.lineWidth=width;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();}
for(let x=0;x<1200;x+=30)line([[x,0],[x,630]],'#1c2822');
for(let y=0;y<630;y+=30)line([[0,y],[1200,y]],'#1c2822');
const wash=c.createLinearGradient(0,0,760,0);wash.addColorStop(0,'#141c19');wash.addColorStop(.7,'#141c19');wash.addColorStop(1,'#141c1900');c.fillStyle=wash;c.fillRect(0,0,800,630);
function text(t,x,y,size,color='#c9cbb3',font='FieldMono'){c.font=`${size}px ${font}`;c.fillStyle=color;c.fillText(t,x,y);}
line([[54,89],[54,57],[88,57],[88,89],[69,89],[69,72],[103,72]],'#c9cbb3',2);
text('INTERIOR SYSTEMS',120,80,18,'#95a28d');
text('FIELD',52,265,126,'#e4e0c6','FieldSans');
text('Draw a room.',59,333,27);text('Verify its dimensions.',59,374,27);text('Find your way back.',59,415,27);
text('AN ARCHITECTURAL HORROR EXPERIMENT',59,506,15,'#99a78f');
// Nested survey frames converge toward an opening that does not fit the plan.
const frames=[[670,105,1137,513],[727,164,1094,487],[777,216,1053,466],[819,257,1024,451],[853,291,1002,438],[881,318,984,428]];
for(let i=0;i<frames.length;i++){
 const [x,y,r,b]=frames[i];line([[x,y],[r,y],[r,b],[x,b],[x,y]],i<2?'#87917a':'#566753',i<2?2:1);
 if(i){const a=frames[i-1];for(const k of [0,1,2,3]){const prev=[[a[0],a[1]],[a[2],a[1]],[a[2],a[3]],[a[0],a[3]]][k],next=[[x,y],[r,y],[r,b],[x,b]][k];line([prev,next],'#425440');}}
}
c.fillStyle='#0b100d';c.fillRect(899,336,67,83);
line([[656,540],[1152,540]],'#b39b6d');for(const x of [670,1137])line([[x,531],[x,549]],'#b39b6d');text('EXTERIOR  6.000 m',786,568,16,'#a9aa89');
line([[850,281],[1005,281]],'#ae7967');text('6.013 m',872,271,16,'#cb9d87');
line([[52,590],[1148,590]],'#39473c');text('A—001 / PROPOSED',59,613,13,'#7e8e78');text('SURVEY BOUNDARY UNAVAILABLE',850,613,13,'#a58c74');
const output=path.resolve(__dirname,'../../..','public/field/assets/field-social.png');fs.writeFileSync(output,canvas.toBuffer('image/png'));console.log(output);
