import test from 'node:test';
import assert from 'node:assert/strict';
import {HandCapture} from '../web/src/capture.js';
import {Metrics} from '../web/src/metrics.js';

function setup(postMessage) {
  const c=new HandCapture({readyState:2,videoWidth:1280,videoHeight:720,pause(){},removeAttribute(){}},()=>{},()=>{});
  c.running=true;c.delegate='CPU';c.worker={postMessage};return c;
}
test('CPU transfers decoded VideoFrame without UI ImageBitmap resize, one frame in flight',async()=>{
  const old=globalThis.VideoFrame,oldBitmap=globalThis.createImageBitmap;
  const frames=[],messages=[];
  globalThis.VideoFrame=class {constructor(video,opts){this.opts=opts;this.closed=false;frames.push(this);}close(){this.closed=true;}};
  globalThis.createImageBitmap=()=>{throw Error('UI copy should not run');};
  try {
    const c=setup((data,transfer)=>messages.push({data,transfer}));
    await c.frame(100,1);await c.frame(120,2);
    assert.equal(messages.length,1);assert.equal(frames.length,1);
    assert.equal(messages[0].data.width,640);assert.equal(messages[0].data.height,360);
    assert.equal(messages[0].transfer[0],frames[0]);assert.equal(frames[0].closed,false);
    assert.ok(messages[0].data.captureMs>=0);assert.equal(c.frameTransport,'VideoFrame');
    c.finishFrame({sequence:1});await c.frame(150,1);assert.equal(messages.length,1);
  }finally{globalThis.VideoFrame=old;globalThis.createImageBitmap=oldBitmap;}
});
test('benchmark stage timings remain separate; missing observations are not reported as zero latency',()=>{
  const m=new Metrics();m.begin(0,{});
  m.track(100,{hands:[],inferenceMs:25,captureMs:2,queueMs:3,preprocessMs:5,modelMs:20,ageMs:30});
  m.track(200,{hands:[],inferenceMs:27,ageMs:32});
  const report=m.finish(60000);
  assert.equal(report.capture_mean_ms,2);assert.equal(report.worker_queue_mean_ms,3);
  assert.equal(report.preprocess_mean_ms,5);assert.equal(report.model_mean_ms,20);
  assert.equal(report.inference_mean_ms,26);assert.equal(report.end_to_end_latency_ms,null);
  m.begin(60000,{});const empty=m.finish(120000);
  assert.equal(empty.capture_mean_ms,null);assert.equal(empty.model_mean_ms,null);
});
test('unsupported VideoFrame transfer closes its resource then falls back once without duplicate inference',async()=>{
  const old=globalThis.VideoFrame,oldBitmap=globalThis.createImageBitmap;
  let closed=0,attempts=0,copies=0;const sent=[];
  globalThis.VideoFrame=class {close(){closed++;}};
  globalThis.createImageBitmap=async()=>{copies++;return {close(){}};};
  try{
    const c=setup(data=>{attempts++;if(data.bitmap instanceof VideoFrame)throw Error('DataCloneError');sent.push(data);});
    await c.frame(100,1);assert.equal(attempts,2);assert.equal(sent.length,1);
    assert.equal(closed,1);assert.equal(copies,1);assert.equal(c.frameTransport,'ImageBitmap');
    c.finishFrame({sequence:1});await c.frame(140,2);
    assert.equal(attempts,3);assert.equal(sent.length,2);assert.equal(closed,1);
  }finally{globalThis.VideoFrame=old;globalThis.createImageBitmap=oldBitmap;}
});
test('failed fallback closes bitmap and clears in-flight state; stopped async copy is not sent',async()=>{
  const old=globalThis.VideoFrame,oldBitmap=globalThis.createImageBitmap;
  let closed=0,resolve;
  globalThis.VideoFrame=undefined;
  try{
    globalThis.createImageBitmap=async()=>({close(){closed++;}});
    const c=setup(()=>{throw Error('worker failure');});await c.frame(100,1);
    assert.equal(closed,1);assert.equal(c.busy,false);
    globalThis.createImageBitmap=()=>new Promise(r=>resolve=r);
    let sent=0;c.worker.postMessage=()=>sent++;
    const pending=c.frame(150,2);await c.stopVideo();c.running=true;
    resolve({close(){closed++;}});await pending;
    assert.equal(sent,0);assert.equal(closed,2);assert.equal(c.busy,false);
  }finally{globalThis.VideoFrame=old;globalThis.createImageBitmap=oldBitmap;}
});
