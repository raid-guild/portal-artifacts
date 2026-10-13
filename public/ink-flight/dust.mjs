// Capture only the foreground canvas; the independent ink wash keeps flowing.
const hash=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v)};
const clamp=x=>Math.max(0,Math.min(1,x));
export function captureDust(canvas,width,height){
 const image=document.createElement('canvas');image.width=Math.max(1,Math.ceil(width/2));image.height=Math.max(1,Math.ceil(height/2));
 const c=image.getContext('2d',{willReadFrequently:true});c.drawImage(canvas,0,0,image.width,image.height);
 const pixels=c.getImageData(0,0,image.width,image.height).data;let particles=[];
 for(let y=0;y<image.height;y++)for(let x=0;x<image.width;x++){
  const i=(y*image.width+x)*4;if(pixels[i+3]<35)continue;
  const seed=y*image.width+x;
  particles.push({x:x/image.width*width,y:y/image.height*height,alpha:pixels[i+3]/255,
   color:`rgb(${pixels[i]},${pixels[i+1]},${pixels[i+2]})`,delay:x/image.width*1.6+hash(seed)*.8,
   speed:85+hash(seed+1)*145,lift:15+hash(seed+2)*70,phase:hash(seed+3)*Math.PI*2,life:1.7+hash(seed+4)*1.3});
 }
 const stride=Math.max(1,Math.ceil(particles.length/12000));particles=particles.filter((_,i)=>i%stride===0);
 return {image,particles,width,height};
}
export function drawDust(ctx,state,seconds,width,height){
 if(!state)return;ctx.save();ctx.scale(width/state.width,height/state.height);
 // A soft advancing front loosens the captured ink into moving fragments.
 const columns=96;
 for(let i=0;i<columns;i++){
  const age=seconds-i/columns*1.6;
  ctx.globalAlpha=clamp(1-age/.85);if(ctx.globalAlpha<=0)continue;
  const left=i*state.image.width/columns,right=(i+1)*state.image.width/columns;
  ctx.drawImage(state.image,left,0,right-left,state.image.height,left/state.image.width*state.width,0,(right-left)/state.image.width*state.width,state.height);
 }
 for(const q of state.particles){const age=seconds-q.delay;if(age<=0||age>=q.life)continue;
  ctx.globalAlpha=q.alpha*Math.min(1,age/.18)*(1-age/q.life)*.85;ctx.strokeStyle=q.color;ctx.lineWidth=1.1;ctx.lineCap='round';
  const x=q.x+q.speed*(age*.5+age*age*.42),y=q.y-q.lift*age+Math.sin(age*3+q.phase)*age*14;
  ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(q.phase+age)*2.5,y+Math.sin(q.phase+age)*2.5);ctx.stroke();
 }
 ctx.restore();
}
