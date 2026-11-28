import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as T from '../web/vendor/three/three.module.js';
import { PourableContainer, withdraw } from '../web/src/pourable.js';
import { LiquidSimulation } from '../web/src/liquid-simulation.js';
import { Interaction } from '../web/src/interaction.js';
const profiles = JSON.parse(fs.readFileSync(new URL('../web/profiles.json', import.meta.url)));
function container(kind, volume = 10) {
 const group = new T.Group();group.scale.setScalar(.67);group.updateMatrixWorld(true);
 const item = {stock:{kind, capacity_ml:kind==='dropper'?5:100}, group, mouthY:Math.max(...profiles.profiles[kind].map(p=>p[0])), mixture:{volume_ml:volume,mol:{Na_plus:volume*.001},origins:{}}, sealed:false};
 item.pourable = new PourableContainer(item,profiles.interiors[kind]);
 return item;
}
for (const kind of Object.keys(profiles.interiors)) {
 test(`${kind}: full inversion drains finite liquid; upright stops; seal blocks`,()=>{
 const o=container(kind,kind==='dropper'?3:10), c=o.pourable;
 c.updatePose();assert.equal(c.rate(),0);
 for(const angle of [45,90,135,180,270,360]) {
 o.group.rotation.z=angle*Math.PI/180;o.group.updateMatrixWorld(true);c.updatePose();
 assert.ok(Math.abs(c.axis.y-Math.cos(angle*Math.PI/180))<1e-8);
 }
 o.group.rotation.z=Math.PI;o.group.updateMatrixWorld(true);c.updatePose();assert.ok(c.rate()>0);
 o.sealed=true;assert.equal(c.rate(),0);o.sealed=false;
 let spilled=0,solute=0;
 for(let i=0;i<1000&&c.volume>1e-8;i++) {c.updatePose();const p=withdraw(o.mixture,c.rate()*.08);spilled+=p.volume_ml;solute+=p.mol.Na_plus;}
 assert.ok(c.volume<1e-8);assert.ok(Math.abs(spilled-(kind==='dropper'?3:10))<1e-8);
 assert.ok(Math.abs(solute-(kind==='dropper'?.003:.01))<1e-8);
 });
}
test('Gravity ray hits opening only, rejects capped/inverted/sideways/misaligned destination',()=>{
 const o=container('tube');o.pourable.updatePose();const start=o.pourable.center.clone();start.y+=1;
 assert.ok(o.pourable.receivePoint(start));start.x+=.4;assert.equal(o.pourable.receivePoint(start),null);
 o.sealed=true;start.x-=.4;assert.equal(o.pourable.receivePoint(start),null);
 o.sealed=false;o.group.rotation.z=Math.PI;o.group.updateMatrixWorld(true);o.pourable.updatePose();assert.equal(o.pourable.receivePoint(start),null);
});
test('Continuous one-hand roll crosses +/-pi twice without snap or 86 degree clamp',()=>{
 const object={id:1,target:{x:0,y:0,z:0},roll:0,yaw:0,pitch:0};
 const i=new Interaction({pick:()=>({type:'object',object}),toWorld:()=>({x:0,y:0,z:0}),move:(o,p,r)=>{o.roll=r}, select:()=>{} });
 const tr={id:1,observed:true,ambiguous:false,pose:{x:.5,y:.5,palm:.1,ratio:.1,angle:0}};
 for(let t=0;t<=160;t+=20)i.update([tr],t);
 assert.equal(i.owners(object).length,1);
 let last=0;
 for(let n=1;n<=300;n++){const a=n/300*Math.PI*4;tr.pose.angle=Math.atan2(Math.sin(a),Math.cos(a));i.update([tr],160+n*20);assert.ok(Math.abs(object.roll-last)<.12);last=object.roll;}
 assert.ok(Math.abs(object.roll)>12);
 tr.pose.ratio=1;for(let t=6200;t<6600;t+=20)i.update([tr],t);assert.equal(i.owners(object).length,0);
});
test('Overflow removes source exactly once, preserves matter, never overfills target', async()=>{
 const source=container('bottle'),target=container('beaker',99);source.id=1;target.id=2;
 let spills=0;
 const sim=new LiquidSimulation({objects:[source,target],stream:()=>{},stopStream:()=>{}},{eligible:()=>true,transfer:async(a,b,n)=>{a.mixture.volume_ml-=n;b.mixture.volume_ml+=n;return{ok:true,amount_ml:n}},spill:(a,n)=>{spills+=withdraw(a.mixture,n).volume_ml}});
 await sim.apply(source,target,5,0);
 assert.equal(source.mixture.volume_ml,5);assert.equal(target.mixture.volume_ml,100);assert.equal(spills,4);assert.equal(5+100+spills,109);
});
test('A rejected reaction does not spill or mutate the reserved aliquot',async()=>{
 const a=container('bottle'), b=container('tube');let spilled=false;
 const sim=new LiquidSimulation({objects:[a,b],stream:()=>{},stopStream:()=>{}},{transfer:async()=>({ok:false}),spill:()=>{spilled=true}});
 await sim.apply(a,b,3,0);assert.equal(spilled,false);assert.equal(a.mixture.volume_ml,10);
});

// Persisting spilled matter is essential to avoid apparent creation/loss after restoring a session.
import {readSpillLedger,addSpill} from '../web/src/spill-ledger.js';
test('Spill ledger roundtrips all matter; invalid import rejected before reset',()=>{
 const rows=[{source:1,target:null,reason:'missed-opening',volume_ml:3,mol:{Na_plus:.0003},origins:{},protein_g:0,indicator_g:0}];
 assert.deepEqual(readSpillLedger(rows),rows);
 assert.throws(()=>readSpillLedger([{...rows[0],volume_ml:-1}]));
 assert.throws(()=>readSpillLedger([{...rows[0],mol:{Na_plus:NaN}}]));
 assert.throws(()=>readSpillLedger([{...rows[0],protein_g:NaN}]));
});
test('Long sessions compact spill routes without losing volume, solute or proteins',()=>{
 const ledger=[];
 for(let i=0;i<300;i++)addSpill(ledger,i,null,'missed-opening',{volume_ml:2,mol:{Na_plus:.001},origins:{water:2},protein_g:.1,indicator_g:0});
 assert.equal(ledger.length,128);
 assert.equal(ledger.reduce((s,r)=>s+r.volume_ml,0),600);
 assert.ok(Math.abs(ledger.reduce((s,r)=>s+r.mol.Na_plus,0)-.3)<1e-10);
 assert.ok(Math.abs(ledger.reduce((s,r)=>s+r.protein_g,0)-30)<1e-10);
 assert.deepEqual(readSpillLedger(ledger),ledger);
});
