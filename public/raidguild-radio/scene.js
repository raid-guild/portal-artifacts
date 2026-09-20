/* Ambient layers use the illustration's 1672 × 941 coordinate space. */
(function(root){
  'use strict';
  const W=1672,H=941,TAU=Math.PI*2;
  const mod=(x,n)=>((x%n)+n)%n;
  function camera(t){return {x:Math.sin(t*TAU/9.2)*3.2,y:Math.cos(t*TAU/4.6)*4.8+Math.sin(t*TAU/9.2)*1.1,roll:Math.sin(t*TAU/9.2)*.0018}}
  function meteorAt(t){
    // One brief event per long cycle, with a different origin each time.
    const cycle=Math.floor(t/43),age=mod(t,43)-9;
    return age>=0&&age<1.25?{age,x:620+mod(cycle*193,450),y:155+mod(cycle*31,60)}:null;
  }
  function create(random=Math.random){
    const particles=Array.from({length:170},()=>({x:random(),y:random(),speed:.06+random()*.16,r:.5+random()*1.5,phase:random()*TAU}));
    const stars=Array.from({length:55},()=>({x:180+random()*1330,y:130+random()*200,r:.45+random()*.55,phase:random()*TAU}));
    function windowPath(g){g.beginPath();g.moveTo(198,184);g.quadraticCurveTo(835,4,1464,153);g.quadraticCurveTo(1552,214,1564,598);g.quadraticCurveTo(1230,555,846,556);g.quadraticCurveTo(410,556,103,620);g.quadraticCurveTo(118,296,198,184);g.closePath()}
    function cloud(g,x,y,s,opacity){
      g.save();g.translate(x,y);g.scale(s,s);g.globalAlpha=opacity;
      g.fillStyle='#f4e5c4';g.strokeStyle='#687f8044';g.lineWidth=.65;
      g.beginPath();g.moveTo(-130,12);g.bezierCurveTo(-103,9,-100,4,-77,5);g.bezierCurveTo(-80,-7,-56,-13,-44,-4);g.bezierCurveTo(-42,-28,-12,-31,2,-11);g.bezierCurveTo(12,-14,27,-8,31,1);g.bezierCurveTo(57,-5,66,5,73,6);g.bezierCurveTo(97,5,117,11,139,12);g.bezierCurveTo(46,15,-49,17,-130,12);g.fill();g.stroke();g.restore();
    }
    function creature(g,x,y,size,t,phase,night){
      const wing=Math.sin(t*2.1+phase)*.25+.12;
      g.save();g.translate(x,y);g.scale(size,size);g.globalAlpha=.72-night*.24;
      g.fillStyle=night>.5?'#a1a9aa':'#465b61';g.strokeStyle=night>.5?'#77878c':'#293e46';g.lineWidth=.55;
      g.beginPath();g.moveTo(-19,-4-wing*10);g.quadraticCurveTo(-10,-2,0,1);g.quadraticCurveTo(11,-3,21,-5-wing*10);g.lineTo(11,2);g.quadraticCurveTo(4,0,2,4);g.lineTo(-2,4);g.quadraticCurveTo(-7,0,-13,1);g.closePath();g.fill();g.stroke();
      g.beginPath();g.moveTo(0,-1);g.lineTo(3,5);g.lineTo(-1,8);g.lineTo(-2,2);g.closePath();g.fill();g.restore();
    }
    function render(g,art,{width,height,time,night,weather,motion}){
      const view=camera(time),scale=Math.max(width/W,height/H)*1.045;
      const dx=view.x*scale,dy=view.y*scale;
      art.style.transform=`translate(${dx}px,${dy}px) rotate(${view.roll}rad) scale(1.045)`;
      g.clearRect(0,0,width,height);g.save();g.translate(width/2+dx,height/2+dy);g.rotate(view.roll);g.scale(scale,scale);g.translate(-W/2,-H/2);
      g.save();windowPath(g);g.clip();
      // Keep sky-only effects above the mesas; the canopy clip excludes the cabin.
      g.save();g.beginPath();g.moveTo(90,80);g.lineTo(1570,80);g.lineTo(1570,345);g.lineTo(1480,330);g.lineTo(1425,260);g.lineTo(1390,260);g.lineTo(1340,325);g.lineTo(1100,340);g.lineTo(1050,348);g.lineTo(520,346);g.lineTo(320,320);g.lineTo(275,266);g.lineTo(226,266);g.lineTo(180,324);g.lineTo(90,330);g.closePath();g.clip();
      if(night>.15&&weather==='clear'){
        for(const star of stars){g.globalAlpha=night*(.22+.18*Math.sin(time*.35+star.phase));g.fillStyle='#f0e8d6';g.beginPath();g.arc(star.x,star.y,star.r,0,TAU);g.fill()}g.globalAlpha=1;
      }
      for(let i=0;i<4;i++){
        const x=mod(time*(3.1+i*.7)+i*480,2250)-280;
        cloud(g,x,202+i*28,.65+i*.15,(.3-night*.18)*(weather==='dust'?.45:1));
      }
      for(let i=0;i<3;i++){
        const x=mod(time*(13+i*2.7)+720+i*132,2020)-170;
        creature(g,x,251+i*22+Math.sin(time*.21+i)*7,.55+i*.16,time,i*2,night);
      }
      const meteor=meteorAt(time);
      if(meteor&&motion&&night>.55&&weather==='clear'){
        const p=meteor.age/1.25,x=meteor.x+p*265,y=meteor.y+p*113;
        const trail=g.createLinearGradient(x-88,y-38,x,y);trail.addColorStop(0,'rgba(222,239,245,0)');trail.addColorStop(1,`rgba(238,249,250,${Math.sin(p*Math.PI)*night*.85})`);
        g.strokeStyle=trail;g.lineWidth=1.5;g.beginPath();g.moveTo(x-88,y-38);g.lineTo(x,y);g.stroke();
      }
      g.restore();
      if(weather==='dust'){g.fillStyle='rgba(216,171,108,.24)';g.fillRect(0,0,W,H)}
      if(weather==='rain'){g.fillStyle='rgba(43,72,92,.18)';g.fillRect(0,0,W,H)}
      for(let i=0;i<particles.length;i++){
        if(weather==='clear'&&i>28)break;const p=particles[i],speed=weather==='rain'?p.speed:weather==='dust'?p.speed*.25:p.speed*.025;
        const x=mod(p.x+time*speed*(weather==='rain'?.09:1),1)*W,y=mod(p.y+time*speed*(weather==='rain'?1:.02),1)*620;
        if(weather==='rain'){g.strokeStyle='rgba(225,241,242,.38)';g.lineWidth=.8;g.beginPath();g.moveTo(x,y);g.lineTo(x-4,y+12+p.r*5);g.stroke()}
        else{g.fillStyle=`rgba(255,230,166,${weather==='dust'?.45:.16})`;g.beginPath();g.arc(x,y+Math.sin(time*.3+p.phase)*4,p.r,0,TAU);g.fill()}
      }
      g.restore();
      // A slow pulsing status lamp, aligned to an existing dashboard fitting.
      const pulse=motion?Math.pow(Math.max(0,Math.sin(time*TAU/5.8)),8):.15;
      const lamp=g.createRadialGradient(1095,747,0,1095,747,19);
      lamp.addColorStop(0,`rgba(194,229,130,${.2+pulse*.7})`);lamp.addColorStop(.3,`rgba(167,214,113,${.1+pulse*.35})`);lamp.addColorStop(1,'rgba(148,198,99,0)');g.fillStyle=lamp;g.fillRect(1076,728,38,38);
      g.fillStyle=`rgba(218,236,161,${.25+pulse*.7})`;g.beginPath();g.arc(1095,747,2.4,0,TAU);g.fill();
      g.restore();
    }
    return {render};
  }
  const api={create,camera,meteorAt};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.WalkerScene=api;
})(typeof window==='undefined'?globalThis:window);
