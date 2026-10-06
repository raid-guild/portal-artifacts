import * as THREE from 'three';

export function jellyMaterial(hex,{logo=false}={}){
  const tint=new THREE.Color(hex);
  return new THREE.MeshPhysicalMaterial({
    color:tint.clone().lerp(new THREE.Color(0xffffff),logo ? .2 : .23),
    roughness:logo ? .14 : .11,
    metalness:0,
    transmission:logo ? .74 : .84,
    opacity:1,
    ior:1.35,
    thickness:logo ? .55 : 1.3,
    attenuationColor:tint,
    attenuationDistance:logo ? .45 : 1.05,
    clearcoat:.85,
    clearcoatRoughness:.08,
    envMapIntensity:1.05,
    side:logo?THREE.DoubleSide:THREE.FrontSide,
  });
}
