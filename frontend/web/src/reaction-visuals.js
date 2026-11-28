import * as THREE from '../vendor/three/three.module.js';
/** Verified species only. Density is pedagogically exaggerated; not an optical measurement. */
export function precipitateOf(m) {
  if (m.mol?.AgCl > 1e-12) return {mol:m.mol.AgCl, mass:143.32, color:[0.99,0.99,0.96]};
  if (m.mol?.CuOH2 > 1e-12) return {mol:m.mol.CuOH2, mass:97.56, color:[0.22,0.63,0.96]};
  if (m.mol?.CaCO3 > 1e-12) return {mol:m.mol.CaCO3, mass:100.09, color:[0.99,0.99,0.97]};
  return null;
}
export function updatePrecipitate(item, dt=0.08) {
  const c=item.pourable,m=item.mixture,solid=precipitateOf(m);
  if(!c) return;
  let e=item.precipitateVisual;
  if(!solid || m.volume_ml<1e-8){if(e)e.group.visible=false;return;}
  if(!e) {
    const group=new THREE.Group();group.name='lesson-precipitate';group.userData.noPhysics=true;item.group.add(group);
    const mesh=new THREE.InstancedMesh(new THREE.SphereGeometry(.035,6,4),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.95,clippingPlanes:[c.plane],depthWrite:false}),32);
    mesh.frustumCulled=false;mesh.renderOrder=3;group.add(mesh);
    e=item.precipitateVisual={group,mesh,age:0,amount:0,dummy:new THREE.Object3D()};
  }
  e.group.visible=true;
  if(solid.mol>e.amount+1e-8)e.age=0;
  e.amount=solid.mol;e.age+=dt;
  const density=solid.mol*solid.mass/Math.max(.001,m.volume_ml/1000);
  const cloud=1-Math.exp(-density*1.8);
  item.liquid.material.color.lerp(new THREE.Color().fromArray(solid.color),cloud);
  item.liquid.material.opacity=.25+.68*cloud;
  c.cap.material.opacity=item.liquid.material.opacity;
  e.mesh.material.color.fromArray(solid.color);
  const samples=c.samples.filter((p,i)=>c.heights[i]<c.level-.025)
    .sort((a,b)=>(a.x-b.x)*c.normal.x+(a.y-b.y)*c.normal.y+(a.z-b.z)*c.normal.z);
  if(!samples.length){e.group.visible=false;return;}
  const count=Math.max(1,Math.min(32,Math.ceil(cloud*32))),settled=Math.min(1,e.age/8);
  e.mesh.count=count;
  for(let i=0;i<count;i++){
    const upper=samples[Math.floor((i+.5)/count*samples.length)%samples.length];
    const lower=samples[i%Math.max(1,Math.floor(samples.length*.12))];
    e.dummy.position.set(upper.x,upper.y,upper.z).lerp(new THREE.Vector3(lower.x,lower.y,lower.z),settled);
    e.dummy.scale.setScalar(.5+cloud*.8);e.dummy.updateMatrix();e.mesh.setMatrixAt(i,e.dummy.matrix);
  }
  e.mesh.instanceMatrix.needsUpdate=true;
}
