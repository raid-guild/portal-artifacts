window.installCockpitRadio = function (model, camera, canvas) {
  const center=new THREE.Vector3(-3.29,3.59,.13);
  // Remove only the bezel, dial and needle at this dashboard position from the merged meshes.
  model.updateMatrixWorld(true);
  const inverse=model.matrixWorld.clone().invert(),point=new THREE.Vector3();
  model.traverse(function (object) {
    if(!object.isMesh || !object.geometry.attributes.position)return;
    const geometry=object.geometry,positions=geometry.attributes.position;
    const transform=inverse.clone().multiply(object.matrixWorld);
    const indices=geometry.index?Array.from(geometry.index.array):Array.from({length:positions.count},(_,i)=>i);
    const keep=[];let removed=0;
    for(let i=0;i<indices.length;i+=3){
      const inside=[0,1,2].every(j=>{
        point.fromBufferAttribute(positions,indices[i+j]).applyMatrix4(transform);
        return point.x> -3.312 && point.x< -3.255 && Math.abs(point.y-center.y)<.075 && Math.abs(point.z-center.z)<.075;
      });
      if(inside)removed++;else keep.push(indices[i],indices[i+1],indices[i+2]);
    }
    if(removed){object.geometry=geometry.clone();object.geometry.setIndex(keep);object.geometry.computeBoundingSphere();}
  });
  const radio=new THREE.Group();radio.name="Cockpit_Radio_Receiver";
  radio.position.set(-3.285,3.59,.13);radio.rotation.y=Math.PI/2;model.add(radio);
  const housing=new THREE.Mesh(new THREE.BoxGeometry(.24,.15,.055),new THREE.MeshStandardMaterial({color:0x524b38,roughness:.78,metalness:.3}));radio.add(housing);
  const surface=document.createElement("canvas");surface.width=768;surface.height=480;
  const context=surface.getContext("2d"),texture=new THREE.CanvasTexture(surface);texture.encoding=THREE.sRGBEncoding;
  const face=new THREE.Mesh(new THREE.PlaneGeometry(.224,.137),new THREE.MeshBasicMaterial({map:texture,toneMapped:false}));face.position.z=.029;face.name="Cockpit_Radio_Face";radio.add(face);
  const channel=document.querySelector("#radio-channel"),volume=document.querySelector("#radio-volume");
  function draw(){
    const c=context;c.fillStyle="#292d26";c.fillRect(0,0,768,480);
    c.strokeStyle="#9b8962";c.lineWidth=7;c.strokeRect(9,9,750,462);
    c.fillStyle="#c5b48d";c.font="24px monospace";c.textAlign="center";c.fillText("RAIDGUILD · FIELD RECEIVER",384,49);
    c.fillStyle="#101d18";c.fillRect(38,74,692,218);
    c.fillStyle=Number(volume.value)>0?"#e6bb69":"#897a56";
    c.font="bold 51px monospace";c.fillText("CH " + (Math.abs(Number(channel.value)-Math.round(Number(channel.value)))>.16?"--":String(Math.round(Number(channel.value))).padStart(2,"0")),384,144);
    c.font="34px monospace";c.fillText((Math.abs(Number(channel.value)-Math.round(Number(channel.value)))>.16?"STATIC / SEARCHING":["Walker Radio","Orbital Rad","Docking Lights"][Math.round(Number(channel.value))-1]),384,199);
    c.font="22px monospace";c.fillText("TAP DISPLAY TO TUNE",384,261);
    for(const x of [119,649]){c.fillStyle="#171c18";c.beginPath();c.arc(x,370,54,0,Math.PI*2);c.fill();c.strokeStyle="#b39a6b";c.lineWidth=5;c.stroke();}
    c.fillStyle="#e6c795";c.font="44px monospace";c.fillText("−",119,385);c.fillText("+",649,385);
    c.font="30px monospace";c.fillText(Number(volume.value)>0?"VOL "+volume.value:"OFF",384,370);
    c.font="19px monospace";c.fillText("COCKPIT RADIO",384,426);texture.needsUpdate=true;
  }
  channel.addEventListener("input",draw);volume.addEventListener("input",draw);draw();
  const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();let down=null;
  canvas.addEventListener("pointerdown",event=>{if(document.body.classList.contains("cockpit-view") && event.button===0)down={x:event.clientX,y:event.clientY,id:event.pointerId};});
  canvas.addEventListener("pointercancel",()=>{down=null;});
  canvas.addEventListener("pointerup",event=>{
    const start=down;down=null;
    if(!start || start.id!==event.pointerId || Math.hypot(event.clientX-start.x,event.clientY-start.y)>6 || !document.body.classList.contains("cockpit-view"))return;
    const bounds=canvas.getBoundingClientRect();pointer.set((event.clientX-bounds.left)/bounds.width*2-1,-(event.clientY-bounds.top)/bounds.height*2+1);
    ray.setFromCamera(pointer,camera);const hit=ray.intersectObject(face)[0];if(!hit)return;
    if(hit.uv.y>.39){channel.value=String(Math.round(Number(channel.value))%3+1);channel.dispatchEvent(new Event("input"));}
    else {volume.value=String(THREE.MathUtils.clamp(Number(volume.value)+(hit.uv.x<.5?-5:5),0,100));volume.dispatchEvent(new Event("input"));}
  });
};
