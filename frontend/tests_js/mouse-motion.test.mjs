import test from 'node:test';
import assert from 'node:assert/strict';
import {mousePose} from '../web/src/mouse-motion.js';
const start={x:100,y:100,position:{x:1,y:2,z:.4},offset:{x:.2,y:-.1},roll:0,yaw:.1,pitch:0};
test('mouse drag preserves grab offset and depth',()=>{assert.deepEqual(mousePose('move',start,{x:130,y:110},{x:2,y:3}),{position:{x:2.2,y:2.9,z:.4},roll:0,yaw:.1,pitch:0});});
test('rotation is continuous across 180 and 360 degrees without moving pivot',()=>{const p=mousePose('rotate',start,{x:900,y:100},{});assert.equal(p.roll,-7.199999999999999);assert.deepEqual(p.position,start.position);assert.equal(start.roll,0);});
test('depth dragging preserves x/y and orientation',()=>{const p=mousePose('depth',start,{x:120,y:150},{});assert.ok(Math.abs(p.position.z+.2)<1e-10);assert.equal(p.position.x,1);assert.equal(p.position.y,2);});
