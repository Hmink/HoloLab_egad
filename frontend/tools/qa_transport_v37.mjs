/** Actual browser + Worker/MediaPipe; generated pixels and synthetic webcam, no human input. */
import {spawn} from 'node:child_process';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.resolve(process.env.QA_OUTPUT||path.join(root,'validation_v37'));
await mkdir(out,{recursive:true});
const {chromium}=await import(process.env.PLAYWRIGHT_PACKAGE||'playwright');
const server=spawn(process.env.PYTHON||(process.platform==='win32'?'python':'python3'),
  ['-S','server.py','--no-browser','--browser-tracking','--port','8798'],{cwd:root});
server.stderr.on('data',()=>{});
await new Promise((resolve,reject)=>{
  server.stdout.on('data',b=>b.toString().includes('http://')&&resolve());
  server.on('exit',c=>reject(Error('server '+c)));
});
let browser;const checks=[],errors=[];
const check=(name,data={})=>{checks.push({name,passed:true,...data});console.log('PASS',name);};
try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader',
    '--use-gl=angle','--use-angle=swiftshader','--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']});
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8798/?test');await page.waitForFunction(()=>window.__lab);
  const pendingWorker=page.waitForEvent('worker');
  await page.evaluate(async()=>{
    const {HandCapture}=await import('/src/capture.js');
    window.pixelSource=document.createElement('canvas');
    pixelSource.width=1280;pixelSource.height=720;
    pixelSource.videoWidth=1280;pixelSource.videoHeight=720;pixelSource.readyState=2;
    pixelSource.pause=()=>{};
    const ctx=pixelSource.getContext('2d');
    for(const [color,x,y] of [['#ff0000',0,0],['#00ff00',640,0],['#0000ff',0,360],['#ffff00',640,360]]){
      ctx.fillStyle=color;ctx.fillRect(x,y,640,360);
    }
    window.pixelResults=[];
    window.pixelCapture=new HandCapture(pixelSource,data=>pixelResults.push(data),()=>{});
    pixelCapture.preference='CPU';await pixelCapture.init();pixelCapture.running=true;
  });
  const worker=await pendingWorker;
  const pixels=[];
  for(const fallback of [false,true]){
    await page.evaluate(async fallback=>{
      pixelResults.length=0;pixelCapture.videoFrameDisabled=fallback;
      const now=performance.now();await pixelCapture.frame(now,now);
      // A second request while busy must not enqueue another inference.
      await pixelCapture.frame(now+50,now+50);
    },fallback);
    await page.waitForFunction(()=>pixelResults.length===1,null,{timeout:60000});
    const input=await worker.evaluate(()=>({
      width:input.width,height:input.height,cpuReadbackHint:cpuInput,
      pixels:[[.25,.25],[.75,.25],[.25,.75],[.75,.75]].map(([x,y])=>
        [...context.getImageData(Math.round(input.width*x),Math.round(input.height*y),1,1).data]),
    }));
    const result=await page.evaluate(()=>({transport:pixelCapture.frameTransport,
      sequence:pixelCapture.sequence,busy:pixelCapture.busy,
      timing:{capture:pixelResults[0].captureMs,queue:pixelResults[0].queueMs,
        preprocess:pixelResults[0].preprocessMs,model:pixelResults[0].modelMs},
      hands:pixelResults[0].hands.length}));
    assert.equal(input.width,640);assert.equal(input.height,360);assert.equal(input.cpuReadbackHint,true);
    assert.deepEqual(input.pixels,[[0,255,0,255],[255,0,0,255],[255,255,0,255],[0,0,255,255]]);
    assert.equal(result.transport,fallback?'ImageBitmap':'VideoFrame');assert.equal(result.busy,false);
    assert.ok(Object.values(result.timing).every(v=>Number.isFinite(v)&&v>=0));
    pixels.push(input.pixels);check(`Real CPU Worker: ${result.transport}, correct mirror and 640×360 input, single result`,result);
  }
  assert.deepEqual(pixels[0],pixels[1]);
  await page.evaluate(()=>pixelCapture.close());
  await page.evaluate(()=>{__lab.capture.autoCameraQuality=false;__lab.capture.preference='CPU';});
  await page.locator('#start-camera').click();
  await page.waitForFunction(()=>__lab.metrics.tracking.length>=3,null,{timeout:60000});
  const camera=await page.evaluate(()=>__lab.capture.cameraReport());
  assert.equal(camera.transport,'VideoFrame');assert.equal(camera.video_width,1280);assert.equal(camera.video_height,720);
  assert.equal(camera.input_width,640);assert.equal(camera.input_height,360);
  check('Live synthetic HD video -> real MediaPipe CPU using VideoFrame',camera);
  await page.evaluate(async()=>{
    __lab.capture.videoFrameDisabled=true;
    await __lab.capture.applyCameraQuality('LOW');
  });
  await page.waitForFunction(()=>__lab.capture.frameTransport==='ImageBitmap'&&__lab.capture.lastInputSize?.height===480,null,{timeout:60000});
  const low=await page.evaluate(()=>__lab.capture.cameraReport());
  assert.equal(low.video_width,640);assert.equal(low.video_height,480);
  check('Real ImageBitmap fallback and 4:3 Low preserve capture/input aspect',low);
  await page.locator('#stop-camera').click();
  assert.equal(await page.evaluate(()=>__lab.capture.running),false);
  await page.evaluate(()=>{__lab.capture.videoFrameDisabled=false;__lab.capture.cameraQuality='HD';});
  await page.locator('#start-camera').click();
  await page.waitForFunction(()=>__lab.capture.running&&__lab.capture.lastInputSize?.height===360&&__lab.capture.frameTransport==='VideoFrame',null,{timeout:60000});
  await page.waitForFunction(()=>document.getElementById('pipeline-metrics').textContent.includes('Chờ Worker:'));
  check('Stop/restart restores HD VideoFrame capture and displays separate stage metrics');
  const gpuWorkerPromise=page.waitForEvent('worker');
  await page.evaluate(async()=>{window.gpuSwapStart=performance.now();await __lab.capture.switchBackend('GPU');});
  const gpuWorker=await gpuWorkerPromise;
  await page.waitForFunction(()=>__lab.capture.running&&__lab.metrics.tracking.at(-1)?.t>gpuSwapStart,null,{timeout:60000});
  const gpu=await page.evaluate(()=>({requested:__lab.capture.preference,actual:__lab.capture.delegate,
    transport:__lab.capture.frameTransport,lastModelMs:__lab.metrics.tracking.at(-1)?.modelMs}));
  const hint=await gpuWorker.evaluate(()=>cpuInput);
  assert.ok(['GPU','CPU'].includes(gpu.actual));assert.equal(gpu.transport,'VideoFrame');
  assert.equal(hint,gpu.actual==='CPU');assert.ok(Number.isFinite(gpu.lastModelMs));
  check('Request GPU backend on live stream: actual delegate produces result, canvas hint matches delegate',gpu);
  await page.locator('#stop-camera').click();
  assert.deepEqual(errors,[]);check('No page runtime errors');
}catch(error){checks.push({name:'failure',passed:false,error:String(error),stack:error.stack});process.exitCode=1;}
finally{
  await writeFile(path.join(out,'frame_transport.json'),JSON.stringify({
    physicalCameraTested:false,humanHandsTested:false,
    environment:'Chromium 133 / SwiftShader; actual CPU MediaPipe model, generated color quadrants and fake webcam',checks,errors,
  },null,2));
  await browser?.close();server.kill();
}
