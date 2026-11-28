import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as T from '../web/vendor/three/three.module.js';
import {LabPhysics, initPhysics} from '../web/src/physics.js';
await initPhysics();
const profiles=JSON.parse(fs.readFileSync(new URL('../web/profiles.json',import.meta.url)));
for(const [kind,profile] of Object.entries(profiles.profiles)) test(`${kind} Rapier full revolution, no table penetration, dynamic release and re-grab`,()=>{
 const table=new T.Mesh(new T.BoxGeometry(30,.14,9));table.position.set(0,-1.7,-1.5);
 const p=new LabPhysics(table),g=new T.Group();g.scale.setScalar(.67);g.add(new T.Mesh(new T.LatheGeometry(profile.map(([y,r])=>new T.Vector2(r,y)),24)));
 const o={id:1,stock:{kind},target:{x:0,y:.4,z:0},group:g,mixture:{volume_ml:10},roll:0,yaw:0,pitch:0,sealed:false};p.add(o);p.beginGrab(o);
 const e=p.entries.get(1);
 for(let i=0;i<=720;i++) {
   p.setTarget(o,{x:0,y:.4,z:0},i/720*Math.PI*2,0,0);p.step(1/120);
   assert.ok(p.bounds(e,e.body.rotation(),p.position(e)).min.y>p.table.top-.004);
 }
 for(let i=0;i<120;i++)p.step(1/120);
 assert.ok(g.quaternion.angleTo(new T.Quaternion())<.001);
 p.release(o);for(let i=0;i<600;i++)p.step(1/120);
 assert.ok(Math.abs(p.bounds(e,e.body.rotation(),p.position(e)).min.y-p.table.top)<.02);
 p.beginGrab(o);assert.ok(e.held);assert.equal(p.recoveryCount,0);p.dispose();
});
