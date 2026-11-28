import * as THREE from 'three';
import RAPIER from '../vendor/rapier/rapier.mjs';
import {METRES_PER_UNIT as M} from './physics.js';
/** Fixed bench rack, with a removable mechanical joint per occupied slot. */
export class TubeRack {
 constructor(view){
  this.view=view;this.physics=view.physics;this.joints=new Map();this.group=new THREE.Group();this.group.name='functional-tube-rack';
  const y=this.physics.table.top,z=-1.25;this.slots=[-3.3,-2.65,-2].map(x=>({x,y:y+.74,z}));
  const metal=new THREE.MeshStandardMaterial({color:0xa7b8bf,metalness:.6,roughness:.3});
  this.body=this.physics.world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
  const box=(x,yy,zz,w,h,d)=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),metal);mesh.position.set(x,yy,zz);this.group.add(mesh);this.physics.world.createCollider(RAPIER.ColliderDesc.cuboid(w*M/2,h*M/2,d*M/2).setTranslation(x*M,yy*M,zz*M).setFriction(.75).setRestitution(0),this.body)};
  box(-2.65,y+.045,z,2,.09,.72);
  for(const x of [-3.58,-1.72])box(x,y+.5,z,.07,.94,.62);
  // Two rails and short separators leave actual openings, not a solid top plate.
  for(const zz of [z-.3,z+.3])box(-2.65,y+.92,zz,2,.07,.1);
  for(const x of [-3.62,-2.975,-2.325,-1.68])box(x,y+.92,z,.09,.07,.6);
  for(const s of this.slots){const ring=new THREE.Mesh(new THREE.TorusGeometry(.25,.016,6,32),metal);ring.rotation.x=Math.PI/2;ring.position.set(s.x,y+.92,z);this.group.add(ring)}
  view.scene.add(this.group);
 }
 unsnap(item){const saved=this.joints.get(item.id);if(!saved)return;this.physics.world.removeImpulseJoint(saved.joint,true);this.joints.delete(item.id);item.rackSlot=null;}
 snap(item){
  if(item.stock.kind!=='tube'||item.mouseOwned)return false;
  const e=this.physics.entries.get(item.id);if(!e||e.held)return false;
  const up=new THREE.Vector3(0,1,0).applyQuaternion(item.group.quaternion);if(up.y<.94)return false;
  const p=item.group.position;
  const index=this.slots.findIndex((s,i)=>!Array.from(this.joints.values()).some(j=>j.slot===i)&&Math.hypot(p.x-s.x,p.z-s.z)<.28&&Math.abs(p.y-s.y)<.4);
  if(index<0)return false;const s=this.slots[index];
  e.body.setTranslation({x:s.x*M,y:s.y*M,z:s.z*M},true);e.body.setRotation({x:0,y:0,z:0,w:1},true);e.body.setLinvel({x:0,y:0,z:0},true);e.body.setAngvel({x:0,y:0,z:0},true);
  const identity={x:0,y:0,z:0,w:1},joint=this.physics.world.createImpulseJoint(RAPIER.JointData.fixed({x:s.x*M,y:s.y*M,z:s.z*M},identity,{x:0,y:0,z:0},identity),this.body,e.body,true);
  this.joints.set(item.id,{joint,slot:index});item.rackSlot=index;this.physics.sync(e,true);return true;
 }
}
