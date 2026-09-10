/* Bounded meteor pool: distant streaks, impact flashes and dissipating dust. */
window.createWalkerMeteors = function (scene, camera, terrainHeight, dustTexture, rumble) {
  const slider=document.querySelector("#meteor-intensity");
  const output=document.querySelector("#meteor-value");
  const group=new THREE.Group();group.name="Atmosphere_Meteors";scene.add(group);
  const rockGeometry=new THREE.SphereGeometry(0.22,8,6);
  const trailGeometry=new THREE.CylinderGeometry(0.18,0.025,1,6);
  const shockGeometry=new THREE.RingGeometry(.92,1,64);
  const up=new THREE.Vector3(0,1,0);
  const glowCanvas=document.createElement("canvas");glowCanvas.width=64;glowCanvas.height=64;
  const ctx=glowCanvas.getContext("2d"),gradient=ctx.createRadialGradient(32,32,0,32,32,32);
  gradient.addColorStop(0,"rgba(255,245,200,1)");gradient.addColorStop(.2,"rgba(255,177,90,.65)");gradient.addColorStop(1,"rgba(255,100,30,0)");ctx.fillStyle=gradient;ctx.fillRect(0,0,64,64);
  const glowTexture=new THREE.CanvasTexture(glowCanvas);
  const pool=Array.from({length:10},()=>{
    const root=new THREE.Group();root.visible=false;group.add(root);
    const head=new THREE.Mesh(rockGeometry,new THREE.MeshBasicMaterial({color:0xffecd1,toneMapped:false}));
    const tail=new THREE.Mesh(trailGeometry,new THREE.MeshBasicMaterial({color:0xffb65c,transparent:true,opacity:.85,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}));
    const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}));
    const shock=new THREE.Mesh(shockGeometry,new THREE.MeshBasicMaterial({color:0xd9ac7c,transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false}));
    shock.rotation.x=-Math.PI/2;shock.visible=false;
    root.add(head,tail,glow);
    const dust=Array.from({length:4},()=>{const puff=new THREE.Sprite(new THREE.SpriteMaterial({map:dustTexture,color:0xc69a73,transparent:true,depthWrite:false,opacity:0}));root.add(puff);return puff;});
    root.add(shock);
    return {root,head,tail,glow,dust,shock,active:false,age:0,start:new THREE.Vector3(),end:new THREE.Vector3(),impact:false,sounded:false};
  });
  let intensity=0,next=2,giantIn=0;
  function change(){
    const previous=intensity;
    intensity=Number(slider.value)/100;
    if(previous<.75 && intensity>=.75)giantIn=0;
    output.textContent=intensity===0?"Off":`${slider.value}% · ${intensity<.35?"Shooting stars":intensity<.7?"Shower":intensity<.75?"Impacts":"Giant fireballs"}`;
    slider.setAttribute("aria-valuetext",output.textContent);
    next=Math.min(next,.5);
    if(!intensity)pool.forEach(m=>{m.active=false;m.root.visible=false;});
  }
  slider.addEventListener("input",change);change();
  function spawn(){
    const m=pool.find(m=>!m.active);if(!m)return;
    m.giant=intensity>=.75 && giantIn<=0;
    if(m.giant)giantIn=14+Math.random()*10;
    m.root.userData.giant=m.giant;
    const forward=camera.getWorldDirection(new THREE.Vector3());forward.y=0;forward.normalize();
    forward.applyAxisAngle(up,(Math.random()-.5)*(m.giant?.35:1.1));
    const center=new THREE.Vector3(camera.position.x,0,camera.position.z).addScaledVector(forward,m.giant?125+Math.random()*15:85+Math.random()*25);
    center.x=THREE.MathUtils.clamp(center.x,-135,135);center.z=THREE.MathUtils.clamp(center.z,-135,135);
    m.impact=m.giant || (intensity>=.65 && Math.random()<(.35+intensity*.4));
    m.end.copy(center);m.end.y=m.impact?terrainHeight(center.x,center.z)+.2:12+Math.random()*10;
    const sideways=new THREE.Vector3(forward.z,0,-forward.x);
    m.start.copy(m.end).addScaledVector(sideways,m.giant?-22-Math.random()*10:-35-Math.random()*25);m.start.y+=22+Math.random()*14;
    m.duration=m.giant?4.5+Math.random():1.5+Math.random()*1.4;m.age=0;m.active=true;m.sounded=false;m.root.visible=true;
    m.head.scale.setScalar(m.giant?7:1);m.shock.visible=false;
    m.head.visible=true;m.tail.visible=true;m.glow.visible=true;m.dust.forEach(p=>p.visible=false);
  }
  return {update(delta,motion){
    if(!motion || !intensity)return;
    const dt=Math.min(delta,.05);next-=dt;giantIn-=dt;
    if(next<=0){spawn();next=(1.1+Math.random()*2)/(0.15+intensity*2.5);}
    pool.forEach(m=>{
      if(!m.active)return;m.age+=dt;
      if(m.age<m.duration){
        const t=m.age/m.duration;m.head.position.lerpVectors(m.start,m.end,t);
        const direction=m.end.clone().sub(m.start).normalize();
        const length=Math.min(m.giant?34:13,3+m.age*16);
        m.tail.position.copy(m.head.position).addScaledVector(direction,-length*.5);
        m.tail.quaternion.setFromUnitVectors(up,direction);m.tail.scale.set(m.giant?6:1,length,m.giant?6:1);
        m.tail.material.opacity=Math.min(1,m.age*3)*.85;
        m.glow.position.copy(m.head.position);m.glow.scale.setScalar(m.giant?13:2.5);m.glow.material.opacity=.9;
      }else if(m.impact){
        const age=m.age-m.duration;m.head.visible=false;m.tail.visible=false;
        const size=m.giant?3.5:1,life=m.giant?16:9;
        m.glow.position.copy(m.end);m.glow.scale.setScalar((4+age*12)*size);m.glow.material.opacity=Math.max(0,1-age/(m.giant?1.2:.55));
        m.shock.visible=m.giant && age<5;m.shock.position.copy(m.end);m.shock.position.y+=.35;
        m.shock.scale.setScalar(1+age*9);m.shock.material.opacity=Math.max(0,1-age/5)*.4;
        m.dust.forEach((p,i)=>{p.visible=true;p.position.copy(m.end);p.position.x+=Math.sin(i*2.4)*age*1.7*size;p.position.z+=Math.cos(i*2.4)*age*1.7*size;p.position.y+=1+age*(.9+i*.18)*Math.sqrt(size);p.scale.setScalar((2+age*(2.2+i*.35))*Math.sqrt(size));p.material.opacity=Math.min(1,age*2)*Math.max(0,1-age/life)*(m.giant?.7:.48);});
        if(age>(m.giant?1.8:.8) && !m.sounded){m.sounded=true;rumble(m.giant);}
        if(age>life){m.active=false;m.root.visible=false;}
      }else{m.active=false;m.root.visible=false;}
    });
  }};
};
