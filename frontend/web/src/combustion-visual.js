import * as THREE from '../vendor/three/three.module.js';

/** Bounded overlay for the engine's existing qualitative fire event.
 * Pressure, acid dilution and precipitates never acquire these effects. */
export function createCombustion(scene,geometry) {
  const sparks=new THREE.InstancedMesh(geometry,new THREE.MeshBasicMaterial({color:0xffe38a,transparent:true,opacity:.95,blending:THREE.AdditiveBlending,depthWrite:false}),16);
  const smoke=new THREE.InstancedMesh(geometry,new THREE.MeshBasicMaterial({color:0x687174,transparent:true,opacity:.23,depthWrite:false}),12);
  const flash=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color:0xffe1a0,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));
  sparks.frustumCulled=smoke.frustumCulled=false;
  scene.add(sparks,smoke,flash);
  return {sparks,smoke,flash,dummy:new THREE.Object3D()};
}
export function updateCombustion(fx,center,ageMs) {
  const d=fx.dummy;
  for(let i=0;i<16;i++) {
    const t=((ageMs/1000+i*.061)%1), a=i*2.39996;
    d.position.set(center.x+Math.sin(a)*t*.9,center.y+.45+t*1.5-t*t*1.4,center.z+Math.cos(a)*t*.7);
    d.scale.set(.3*(1-t)+.08,.65*(1-t)+.12,.3*(1-t)+.08);d.updateMatrix();fx.sparks.setMatrixAt(i,d.matrix);
  }
  for(let i=0;i<12;i++) {
    const t=((ageMs/2200+i*.081)%1),a=i*2.39996;
    d.position.set(center.x+Math.sin(a+t*4)*t*.4,center.y+.7+t*1.5,center.z+Math.cos(a)*t*.35);
    d.scale.setScalar(1+t*3);d.updateMatrix();fx.smoke.setMatrixAt(i,d.matrix);
  }
  fx.sparks.instanceMatrix.needsUpdate=fx.smoke.instanceMatrix.needsUpdate=true;
  fx.flash.position.copy(center);fx.flash.position.y+=.5;
  fx.flash.scale.setScalar(5+Math.min(1,ageMs/250)*5);
  fx.flash.material.opacity=.7*Math.max(0,1-ageMs/350);
}
export function disposeCombustion(scene,fx) {
  if(!fx)return;
  for(const mesh of [fx.sparks,fx.smoke,fx.flash]){scene.remove(mesh);mesh.dispose?.();mesh.material.dispose();}
}
