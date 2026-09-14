import * as THREE from 'three';
export function createFlashlight(scene){
 const light=new THREE.SpotLight(0xffeed1,24,24,.43,.72,1.4);light.castShadow=true;light.shadow.mapSize.set(512,512);light.shadow.bias=-.001;light.shadow.normalBias=.03;light.visible=false;scene.add(light,light.target);
 const forward=new THREE.Vector3(),right=new THREE.Vector3();
 return{light,update(camera,active){light.visible=active;if(!active)return;camera.getWorldDirection(forward);right.set(1,0,0).applyQuaternion(camera.quaternion);light.position.copy(camera.position).addScaledVector(right,.16);light.position.y-=.12;light.target.position.copy(camera.position).addScaledVector(forward,16);light.target.updateMatrixWorld();}};
}
