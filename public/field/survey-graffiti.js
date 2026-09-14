// An unauthorized mark on the drawing sheet, separate from surveyed geometry.
export function drawSurveyGraffiti(ctx,width,height,time){
 ctx.save();ctx.translate(width*.52,height*.43);const scale=Math.min(1,width/620);ctx.scale(scale,scale);ctx.rotate(-.12);ctx.globalAlpha=.48+Math.sin(time*.19)*.06;ctx.strokeStyle='#ab8669';ctx.fillStyle='#ab8669';ctx.lineWidth=2.8;ctx.lineCap='round';ctx.lineJoin='round';
 const stroke=points=>{ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();};
 // Angular head and swept horns, like a sketch scratched over a blueprint.
 stroke([[-31,-48],[-21,-11],[0,23],[20,-12],[30,-48],[0,-63],[-31,-48]]);
 stroke([[-24,-51],[-53,-88],[-77,-104],[-83,-93],[-67,-94],[-43,-57]]);
 stroke([[24,-51],[53,-88],[77,-104],[83,-93],[67,-94],[43,-57]]);
 stroke([[-27,-39],[-50,-47],[-38,-24],[-24,-26]]);stroke([[27,-39],[50,-47],[38,-24],[24,-26]]);
 stroke([[-17,-23],[-6,-20]]);stroke([[17,-23],[6,-20]]);stroke([[-6,6],[0,12],[6,6]]);
 ctx.font='bold 25px monospace';ctx.textAlign='center';ctx.fillText('GOATMAN WAS HERE',0,69);stroke([[-133,79],[-51,76],[37,84],[131,75]]);
 ctx.font='12px monospace';ctx.fillText('NO EXTERIOR / NO EXIT',0,105);ctx.restore();
}
