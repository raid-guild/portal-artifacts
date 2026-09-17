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
text('A CAD workspace',59,333,29);text('for AI agents.',59,376,29);
text('DRAW · MEASURE · EXPLORE',59,506,16,'#99a78f');
// Ordinary measured floor plan: keep the preview consistent with the CAD onboarding.
c.fillStyle='#26352b';c.fillRect(708,152,384,336);
line([[708,152],[1092,152],[1092,488],[708,488],[708,152]],'#b8c4a4',3);
line([[900,152],[900,288],[942,288]],'#b8c4a4',3);
line([[987,288],[1092,288]],'#b8c4a4',3);
line([[708,350],[787,350]],'#b8c4a4',3);line([[832,350],[900,350],[900,488]],'#b8c4a4',3);
line([[900,288],[900,350]],'#b8c4a4',3);
for(const [x,y] of [[787,350],[942,288]]){line([[x,y],[x,y-42]],'#8a9b7c');c.beginPath();c.arc(x,y,42,-Math.PI/2,0);c.stroke();}
text('WORKSPACE',740,235,17);text('01',786,265,14,'#82967a');text('MEETING',924,214,16);text('02',973,240,14,'#82967a');text('STUDIO',762,414,17);text('03',786,443,14,'#82967a');text('LOUNGE',942,375,17);text('04',978,404,14,'#82967a');
line([[708,120],[1092,120]],'#87977b');for(const x of [708,1092])line([[x,112],[x,129]],'#87977b');text('8.000 m',855,105,16,'#b5c3a4');
line([[708,525],[1092,525]],'#87977b');text('PLAN VIEW / 1 : 100',800,553,15,'#99a78f');
line([[52,590],[1148,590]],'#39473c');text('A—001 / WORKSPACE DESIGN',59,613,13,'#7e8e78');text('2D PLANS / 3D WALKTHROUGH',850,613,13,'#7e8e78');
const output=path.resolve(__dirname,'../../..','public/field/assets/field-workspace-social.png');fs.writeFileSync(output,canvas.toBuffer('image/png'));console.log(output);

// Update the original URL too for clients that retained the previous image address.
fs.writeFileSync(path.join(path.dirname(output),'field-social.png'),canvas.toBuffer('image/png'));
