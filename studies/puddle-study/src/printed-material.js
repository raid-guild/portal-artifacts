import * as THREE from 'three';

const profiles={
  floor:{pattern:'stone',scale:3.8,grain:.055,pore:.24,crack:.54,art:.84,space:'world'},
  wall:{pattern:'stone',scale:4.1,grain:.07,pore:.30,crack:.82,art:.9,space:'world'},
  violetStone:{pattern:'stone',scale:5.2,grain:.04,pore:.16,crack:.46,art:.43,space:'world'},
  lintel:{pattern:'stone',scale:3.8,grain:.035,pore:.16,crack:.43,art:.38,space:'world'},
  gem:{pattern:'gem',scale:1.15,grain:.02,pore:.07,crack:.48,space:'local'},
  gold:{pattern:'gold',scale:.6,grain:.015,pore:.03,crack:.39,space:'local'},
};

function makePattern(kind){
  // Headless tooling can inspect/materialize scenery without a DOM canvas.
  // Its tiny seeded mask keeps the same shader contract; browsers still use
  // the full canvas print and authored stone image below.
  if(typeof document==='undefined'){
    const side=32,data=new Uint8Array(side*side*4);
    let state=kind==='stone'?385172:kind==='gem'?58271:130217;
    for(let i=0;i<data.length;i+=4){
      state=(Math.imul(state,1664525)+1013904223)>>>0;
      data[i]=170+(state>>>27);data[i+1]=248;data[i+2]=248;data[i+3]=255;
    }
    const texture=new THREE.DataTexture(data,side,side,THREE.RGBAFormat);
    texture.colorSpace=THREE.NoColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
    texture.minFilter=THREE.LinearMipmapLinearFilter;texture.magFilter=THREE.LinearFilter;
    texture.generateMipmaps=true;texture.needsUpdate=true;
    return texture;
  }
  const canvas=document.createElement('canvas');canvas.width=canvas.height=512;
  const ctx=canvas.getContext('2d');
  const detail=document.createElement('canvas');detail.width=detail.height=512;
  const marks=detail.getContext('2d');
  let state=kind==='stone'?385172:kind==='gem'?58271:130217;
  const random=()=>((state=(Math.imul(state,1664525)+1013904223)>>>0)/4294967296);
  const image=ctx.createImageData(512,512);
  // Each channel has a separate duty: quiet grain, clustered pores, and
  // legible sparse fractures/etches. The shader can tune them independently.
  for(let i=0;i<image.data.length;i+=4){
    image.data[i]=kind==='stone'?170+Math.floor(random()*86):210+Math.floor(random()*46);
    image.data[i+1]=image.data[i+2]=image.data[i+3]=255;
  }
  const stamp=(channel,draw)=>{
    marks.clearRect(0,0,512,512);draw();
    const pixels=marks.getImageData(0,0,512,512).data;
    for(let i=0;i<pixels.length;i+=4)image.data[i+channel]=255-pixels[i+3];
  };
  if(kind==='stone'){
    // Small clustered pores and occasional long branching fractures. Most of
    // the tile remains quiet so collectibles stay legible at normal zoom.
    stamp(1,()=>{for(let i=0;i<58;i++){
      const x=random()*512,y=random()*512,count=2+Math.floor(random()*5);
      for(let j=0;j<count;j++){
        marks.beginPath();marks.arc(x+(random()-.5)*22,y+(random()-.5)*18,1.4+random()*3.2,0,Math.PI*2);
        marks.fillStyle=`rgba(0,0,0,${.45+random()*.35})`;marks.fill();
      }
    }});
    stamp(2,()=>{for(let i=0;i<7;i++){
      let x=random()*512,y=random()*512;
      const segments=2+Math.floor(random()*3),angle=random()*Math.PI*2;
      marks.beginPath();marks.moveTo(x,y);
      for(let j=0;j<segments;j++){
        const step=10+random()*17;x+=Math.cos(angle+(random()-.5)*.65)*step;y+=Math.sin(angle+(random()-.5)*.65)*step;
        marks.lineTo(x,y);
      }
      marks.strokeStyle=`rgba(0,0,0,${.70+random()*.24})`;marks.lineWidth=2.2+random()*1.4;marks.stroke();
      if(i%3===0){marks.beginPath();marks.moveTo(x,y);marks.lineTo(x+11,y+14);
        marks.strokeStyle='rgba(0,0,0,.66)';marks.lineWidth=1.8;marks.stroke();}
    }});
  }else{
    stamp(2,()=>{const count=kind==='gem'?11:6;
      for(let i=0;i<count;i++){
        const x=random()*512,y=random()*512,len=(kind==='gem'?32:15)+random()*(kind==='gem'?50:26);
        marks.beginPath();marks.moveTo(x,y);marks.lineTo(x+len,y-len*(.2+random()*.4));
        marks.strokeStyle=`rgba(0,0,0,${kind==='gem'?.72:.65})`;
        marks.lineWidth=kind==='gem'?5.2:4;marks.stroke();
      }
    });
    if(kind==='gem')stamp(1,()=>{for(let i=0;i<22;i++){
      marks.beginPath();marks.arc(random()*512,random()*512,2+random()*2,0,Math.PI*2);
      marks.fillStyle='rgba(0,0,0,.6)';marks.fill();
    }});
  }
  ctx.putImageData(image,0,0);
  const texture=new THREE.CanvasTexture(canvas);
  texture.colorSpace=THREE.NoColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
  texture.minFilter=THREE.LinearMipmapLinearFilter;texture.magFilter=THREE.LinearFilter;
  texture.generateMipmaps=true;texture.anisotropy=4;
  return texture;
}

export function createPrintedMaterialLibrary(){
  const textures=new Map();let disposed=false;
  const stoneUniform={value:null},artReady={value:0};
  const textureFor=kind=>{
    if(disposed)throw new Error('Printed material library was disposed');
    if(!textures.has(kind))textures.set(kind,makePattern(kind));
    return textures.get(kind);
  };
  // The authored swatch replaces only the stone pattern. A shared uniform
  // switches every compiled stone material together after asynchronous load.
  // Mirroring conceals imperfect source edges without hard tile seams.
  if(typeof Image!=='undefined'){
    const base=(import.meta.env?.BASE_URL||'/').replace(/\/?$/,'/');
    new THREE.TextureLoader().load(`${base}art/textures/stone-ink-v1.png`,texture=>{
      if(disposed){texture.dispose();return;}
      texture.colorSpace=THREE.SRGBColorSpace;
      texture.wrapS=texture.wrapT=THREE.MirroredRepeatWrapping;
      texture.minFilter=THREE.LinearMipmapLinearFilter;texture.magFilter=THREE.LinearFilter;
      texture.generateMipmaps=true;texture.anisotropy=4;texture.needsUpdate=true;
      textures.set('artStone',texture);stoneUniform.value=texture;artReady.value=1;
    },undefined,()=>{});
  }
  return {
    decorate(material,role){
      const profile=profiles[role];if(!profile)return material;
      const texture=textureFor(profile.pattern),previous=material.onBeforeCompile;
      if(profile.pattern==='stone'&&!stoneUniform.value)stoneUniform.value=texture;
      const previousKey=material.customProgramCacheKey.bind(material);
      material.onBeforeCompile=(shader,renderer)=>{
        previous.call(material,shader,renderer);
        shader.uniforms.printMask=profile.pattern==='stone'?stoneUniform:{value:texture};
        shader.uniforms.printArtReady=profile.pattern==='stone'?artReady:{value:0};
        const position=profile.space==='local'?'position':'(modelMatrix*vec4(position,1.0)).xyz';
        const normal=profile.space==='local'?'normal':'mat3(modelMatrix)*normal';
        shader.vertexShader=shader.vertexShader.replace('void main() {',
          `varying vec3 vPrintPosition; varying vec3 vPrintNormal;\nvoid main() {\n vPrintPosition=${position}; vPrintNormal=${normal};`);
        shader.fragmentShader=shader.fragmentShader.replace('void main() {',
          'uniform sampler2D printMask; uniform float printArtReady; varying vec3 vPrintPosition; varying vec3 vPrintNormal;\nvoid main() {');
        shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',
          `#include <color_fragment>
           vec3 printNormal=length(vPrintNormal)>0.0001?normalize(vPrintNormal):vec3(0.0,1.0,0.0);
           vec3 printWeight=pow(abs(printNormal),vec3(4.0));
           printWeight/=max(dot(printWeight,vec3(1.0)),0.0001);
           vec3 printP=vPrintPosition/${profile.scale.toFixed(3)};
           vec3 printTone=texture2D(printMask,printP.yz).rgb*printWeight.x
             +texture2D(printMask,printP.xz).rgb*printWeight.y
             +texture2D(printMask,printP.xy).rgb*printWeight.z;
           float printInk=${profile.grain.toFixed(3)}*(1.0-printTone.r)
             +${profile.pore.toFixed(3)}*(1.0-printTone.g)
             +${profile.crack.toFixed(3)}*(1.0-printTone.b);
           float artLuma=dot(printTone,vec3(0.30,0.59,0.11));
           float artInk=clamp((0.94-artLuma)*${(profile.art??0).toFixed(3)},0.0,0.38);
           printInk=mix(printInk,artInk,printArtReady);
           diffuseColor.rgb*=1.0-clamp(printInk,0.0,0.6);`);
      };
      material.customProgramCacheKey=()=>`${previousKey()}|print-v4:${role}:${profile.space}`;
      material.userData.printRole=role;material.needsUpdate=true;
      return material;
    },
    dispose(){if(disposed)return;disposed=true;for(const texture of textures.values())texture.dispose();textures.clear();}
  };
}
