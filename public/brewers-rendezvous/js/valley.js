import * as THREE from 'three';

// A panoramic stage set is drawn before the 3D park. Its silhouettes stay
// on the horizon in both camera modes; orbiting reveals the compass scenery.
export function createValley() {
  const scene=new THREE.Scene();
  scene.background=new THREE.Color('#d4e4e8');
  const camera=new THREE.OrthographicCamera(-1,1,1,-1,.1,20);
  camera.position.z=10;
  const owned=[];
  const groups=[];
  const basic=color=>{const material=new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide,depthTest:false});owned.push(material);return material;};

  function silhouette(group,profile,color,z=.1){
    const verts=[];
    for(let i=0;i<profile.length-1;i++){
      const a=profile[i],b=profile[i+1];
      verts.push(a[0],-1.2,z,b[0],-1.2,z,b[0],b[1],z,a[0],-1.2,z,b[0],b[1],z,a[0],a[1],z);
    }
    const geometry=new THREE.BufferGeometry();
    geometry.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));
    owned.push(geometry);
    const mesh=new THREE.Mesh(geometry,basic(color));
    mesh.frustumCulled=false;
    group.add(mesh);
  }

  function patch(group,points,color,z){
    const verts=[];
    for(let i=1;i<points.length-1;i++){
      for(const index of [0,i,i+1])verts.push(points[index][0],points[index][1],z);
    }
    const geometry=new THREE.BufferGeometry();
    geometry.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));owned.push(geometry);
    group.add(new THREE.Mesh(geometry,basic(color)));
  }

  function landmark(baseX){
    const group=new THREE.Group();scene.add(group);
    groups.push({group,baseX});
    return group;
  }
  // A continuous low ridge joins the directional landmarks and fills beneath
  // them. This avoids vertical seams as the panorama shifts with the orbit.
  const floor=landmark(0);
  silhouette(floor,[[-7,.19],[-5,.23],[-3,.2],[-1,.27],[1,.22],[3,.29],[5,.2],[7,.24]],'#acc2b5',.02);
  // West: layered fourteen-thousand-foot peaks with a few pale snow faces.
  const west=landmark(-.99);
  silhouette(west,[[-.9,.23],[-.7,.37],[-.5,.43],[-.31,.88],[-.12,.56],[.03,.93],[.23,.66],[.39,.79],[.67,.24]],'#a5bfc1',.1);
  silhouette(west,[[-.9,.22],[-.65,.31],[-.47,.35],[-.24,.67],[-.06,.49],[.11,.71],[.35,.44],[.67,.22]],'#7f9fa7',.2);
  patch(west,[[-.38,.76],[-.31,.88],[-.24,.76]],'#edf0e6',.3);
  patch(west,[[-.03,.82],[.03,.93],[.11,.81]],'#edf0e6',.3);

  // S Mountain sits directly beyond the Arkansas River.
  const sMountain=landmark(.42);
  silhouette(sMountain,[[-.58,.21],[-.4,.37],[-.22,.56],[-.04,.8],[.13,.91],[.3,.78],[.49,.48],[.74,.22]],'#72978b',.42);
  silhouette(sMountain,[[-.51,.18],[-.28,.3],[-.07,.44],[.17,.46],[.43,.31],[.66,.18]],'#628a7b',.46);
  const white=basic('#f8f3e7');
  const tileGeometry=new THREE.PlaneGeometry(.047,.047);owned.push(tileGeometry);
  const glyph=['01111','10000','10000','01110','00001','00001','11110'];
  glyph.forEach((row,r)=>[...row].forEach((bit,c)=>{
    if(bit==='0')return;
    const tile=new THREE.Mesh(tileGeometry,white);
    tile.position.set(.085+(c-2)*.047,.82-r*.047,.55);
    sMountain.add(tile);
  }));

  // The canyon turns to warm rock to the east; south stays low and rolling.
  const east=landmark(1.5);
  silhouette(east,[[-.67,.19],[-.55,.36],[-.39,.38],[-.22,.63],[-.02,.62],[.13,.45],[.31,.56],[.5,.36],[.71,.2]],'#c4a58b',.2);
  silhouette(east,[[-.64,.17],[-.45,.27],[-.27,.45],[-.1,.46],[.06,.32],[.27,.41],[.53,.21],[.71,.17]],'#ae9782',.3);
  const south=landmark(3.94);
  silhouette(south,[[-.91,.18],[-.7,.31],[-.49,.29],[-.26,.42],[-.02,.32],[.23,.47],[.44,.34],[.7,.39],[.92,.18]],'#a0b6a3',.2);
  silhouette(south,[[-.91,.17],[-.68,.23],[-.42,.22],[-.19,.3],[.08,.23],[.34,.32],[.61,.23],[.92,.17]],'#86a797',.3);

  // Valley haze dissolves the lower silhouettes into the sky. Without it,
  // the flat scenic panels show as vertical color bands below the park.
  const hazeGeometry=new THREE.PlaneGeometry(16,2.4);
  const hazeMaterial=new THREE.ShaderMaterial({
    transparent:true,depthTest:false,depthWrite:false,
    vertexShader:'varying float vHeight; void main(){vHeight=position.y;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader:'varying float vHeight; void main(){float fade=1.0-smoothstep(-0.4,0.37,vHeight);gl_FragColor=vec4(0.831,0.894,0.910,fade);}'
  });
  owned.push(hazeGeometry,hazeMaterial);
  const haze=new THREE.Mesh(hazeGeometry,hazeMaterial);
  haze.position.z=1;haze.renderOrder=100;haze.frustumCulled=false;
  scene.add(haze);

  const homeYaw=Math.atan2(31,35),cycle=Math.PI*2*1.25;
  function render(renderer,yaw,width,height){
    const aspect=width/height;
    camera.left=-aspect;camera.right=aspect;camera.updateProjectionMatrix();
    const shift=(homeYaw-yaw)*1.25;
    for(const {group,baseX} of groups){
      let x=baseX+shift;
      x-=Math.round(x/cycle)*cycle;
      group.position.x=x;
    }
    renderer.render(scene,camera);
  }
  return {render,dispose:()=>owned.forEach(resource=>resource.dispose())};
}
