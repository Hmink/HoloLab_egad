import test from 'node:test';
import assert from 'node:assert/strict';
import {HandCapture} from '../web/src/capture.js';
import {distinctObservations} from '../web/src/tracks.js';

test('detector duplicate skeletons produce one observation; real spatially separate hands survive',()=>{
 const a={palm:.12,score:.95,points:Array.from({length:21},(_,i)=>({x:.3+i*.003,y:.4+i*.004}))};
 const b={...a,score:.8,points:a.points.map(p=>({x:p.x+.0001,y:p.y+.0001}))};
 assert.equal(distinctObservations([a,b]).length,1);
 b.points=b.points.map(p=>({...p,x:p.x+.3}));assert.equal(distinctObservations([a,b]).length,2);
});
test('one frame callback chain even with repeated schedule; cancelled callback cannot restart it',()=>{
 const callbacks=new Map();let next=0,calls=0;
 const c=new HandCapture({requestVideoFrameCallback:fn=>{callbacks.set(++next,fn);return next;},cancelVideoFrameCallback(){}},()=>{},()=>{});
 c.running=true;c.frame=()=>calls++;
 c.schedule();c.schedule();assert.equal(next,1);
 const old=callbacks.get(1);c.cancelSchedule();c.schedule();assert.equal(next,2);
 old(10,{mediaTime:1});assert.equal(next,2);assert.equal(calls,0);
 callbacks.get(2)(20,{mediaTime:2});assert.equal(next,3);assert.equal(calls,1);
});
test('concurrent init reuses one worker; stale worker messages cannot alter the new worker',async()=>{
 const old=globalThis.Worker,created=[];
 globalThis.Worker=class{constructor(){created.push(this);}postMessage(){}terminate(){this.terminated=true;}};
 const c=new HandCapture({pause(){},removeAttribute(){}},()=>{},()=>{});
 try {
   const a=c.init(),b=c.init();assert.equal(created.length,1);
   created[0].onmessage({data:{type:'ready',delegate:'CPU'}});await Promise.all([a,b]);
   c.close();const pending=c.init();created[1].onmessage({data:{type:'ready',delegate:'GPU'}});await pending;
   c.busy=true;c.activeFrame={sequence:40};
   created[0].onmessage({data:{type:'result',epoch:c.epoch,sequence:1}});
   assert.equal(c.busy,true);assert.equal(c.delegate,'GPU');
   created[1].onmessage({data:{type:'result',epoch:c.epoch,sequence:39}});assert.equal(c.busy,true);
   created[1].onmessage({data:{type:'result',epoch:c.epoch,sequence:40}});assert.equal(c.busy,false);
 }finally{c.close();globalThis.Worker=old;}
});
test('rapid camera requests apply newest selection after in-progress constraints',async()=>{
 let finish;const requests=[];
 const track={applyConstraints:c=>{requests.push(c.width.exact||c.width.ideal);return new Promise(r=>finish=r);},getCapabilities:()=>({}),getSettings:()=>({width:1280,height:720})};
 const c=new HandCapture({srcObject:{getVideoTracks:()=>[track]}},()=>{},()=>{});
 const first=c.applyCameraQuality('HD');await c.applyCameraQuality('LOW');await c.applyCameraQuality('FHD');
 finish();for(let i=0;i<5;i++)await Promise.resolve();
 assert.deepEqual(requests,[1280,1920]);finish();await first;
 assert.equal(c.activeCameraQuality,'FHD');assert.equal(c.qualityBusy,false);
});
test('input size and Hz edits do not reset stream or duplicate its scheduler',()=>{
 const c=new HandCapture({},()=>{},()=>{});let changed=0;c.onReconfigure=()=>changed++;
 c.running=true;const epoch=c.epoch;c.setInferenceWidth(960);c.setMaxHz(30);
 assert.equal(c.running,true);assert.equal(c.epoch,epoch+1);assert.equal(changed,1);assert.equal(c.maxHz,30);
 c.setInferenceWidth(960);c.setInferenceWidth(Infinity);c.setMaxHz(-1);assert.equal(changed,1);assert.equal(c.maxHz,30);
});
