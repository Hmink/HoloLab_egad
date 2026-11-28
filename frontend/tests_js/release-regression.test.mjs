import test from 'node:test';
import assert from 'node:assert/strict';
import { Interaction } from '../web/src/interaction.js';
import { HandTracks } from '../web/src/tracks.js';

const pose = (x=.4, ratio=.2, fist=false) => ({x,y:.5,center:{x,y:.5},ratio,palm:.13,angle:0,label:'Right',score:.99,points:[],fist});
function rig() {
  const object={id:1,target:{x:0,y:1,z:0},roll:0,yaw:0,pitch:0}, released=[];
  const interaction=new Interaction({pick:()=>({type:'object',object}),toWorld:p=>({x:p.x/100,y:p.y/100,z:0}),acquire(){},select(){},park:(o,reason)=>released.push(reason),move:(o,target,roll,yaw,pitch)=>Object.assign(o,{target,roll,yaw,pitch})});
  const tracks=new HandTracks();let now=0;
  const feed=(poses,dt=34)=>{now+=dt;interaction.update(tracks.update(poses,now),now,now);interaction.sweep(now);};
  for(let i=0;i<6;i++)feed([pose()]);
  return {object,interaction,tracks,released,feed,get now(){return now;}};
}
test('changing pinch threshold while held does not release or reset the body',()=>{
 const r=rig();r.interaction.setThreshold(.6);r.feed([pose(.4,.5)]);
 assert.equal(r.interaction.owners(r.object).length,1);assert.deepEqual(r.released,[]);
 for(let i=0;i<6;i++)r.feed([pose(.4,.95)]);
 assert.equal(r.interaction.owners(r.object).length,0);
});
test('opening thumb/index releases a pinch-origin hold in rotate mode even with other fingers folded',()=>{
 const r=rig();r.interaction.mode='rotate';
 for(let i=0;i<6;i++)r.feed([pose(.4,1.2,true)]);
 assert.equal(r.interaction.owners(r.object).length,0);
 assert.deepEqual(r.released,['gesture']);
});
test('brief lost tracking preserves ownership, sustained loss releases within 900 ms',()=>{
 const r=rig();for(let i=0;i<7;i++)r.feed([]);
 assert.equal(r.interaction.owners(r.object).length,1);
 for(let i=0;i<20;i++)r.feed([]);
 assert.equal(r.interaction.owners(r.object).length,0);
});
test('a single intermittent reacquired sample cannot keep a stale owner suspended indefinitely',()=>{
 const r=rig();
 for(let cycle=0;cycle<4;cycle++) {for(let i=0;i<15;i++)r.feed([]);r.feed([pose()]);}
 assert.equal(r.interaction.owners(r.object).length,0);
});
test('one very open sample is noise; sustained deliberate opening releases within 70 ms at 30 Hz',()=>{
 const r=rig();r.feed([pose(.4,1.2)]);assert.equal(r.interaction.owners(r.object).length,1);
 r.feed([pose()]);assert.equal(r.interaction.owners(r.object).length,1);
 r.feed([pose(.4,1.2)]);r.feed([pose(.4,1.2)]);r.feed([pose(.4,1.2)]);
 assert.equal(r.interaction.owners(r.object).length,0);
});
test('continuous valid input below 10 Hz still moves a held tool, never rebases every sample',()=>{
 const r=rig(),start=r.object.target.x;
 for(let i=1;i<=20;i++)r.feed([pose(.4+i*.008)],150);
 assert.equal(r.interaction.owners(r.object).length,1);
 assert.ok(r.object.target.x>start+1,'slow valid tracking froze the target');
 assert.equal(r.interaction.events.filter(e=>e.type==='recover').length,0);
});
