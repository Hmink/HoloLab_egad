/** Diagnostic phases, same scene; synthetic camera, no human hands. */
import {spawn} from 'node:child_process';
import {writeFile} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(process.env.BENCH_PROJECT||'.'),out=process.env.BENCH_OUTPUT;
if(!out)throw Error('Set BENCH_OUTPUT to the diagnostic JSON path');
const {chromium}=await import(process.env.PLAYWRIGHT_PACKAGE||'playwright');
const server=spawn(process.env.PYTHON||(process.platform==='win32'?'python':'python3'),['-S','server.py','--no-browser','--browser-tracking','--port','8797'],{cwd:root});
server.stderr.on('data',()=>{});
await new Promise((resolve,reject)=>{server.stdout.on('data',b=>b.toString().includes('http://')&&resolve());server.on('exit',c=>reject(Error('server '+c)));});
let browser;const errors=[],rows=[];
try{
 browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']});
 const page=await browser.newPage({viewport:{width:1660,height:900}});
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8797/?test');await page.waitForFunction(()=>window.__lab);
 await page.addStyleTag({content:'#workspace{width:1024px!important;height:420px!important;min-height:420px!important;flex:0 0 420px!important}'});
 await page.evaluate(()=>{
  const q=document.getElementById('quality');q.value='1';q.dispatchEvent(new Event('change'));
  __lab.capture.autoCameraQuality=false;
  for(const [i,id] of ['beaker','flask','cuso4','naoh','tube'].entries())__lab.createObject(id,{x:(i-2)*1.1,y:-1,z:0});
  const resize=__lab.view.resize.bind(__lab.view);window.resizes=0;__lab.view.resize=(...args)=>{resizes++;return resize(...args);};
  const bitmap=window.createImageBitmap.bind(window);window.copyMs=[];
  window.createImageBitmap=async(...args)=>{const t=performance.now();const result=await bitmap(...args);copyMs.push(performance.now()-t);return result;};
  window.phase={};const render=__lab.metrics.render.bind(__lab.metrics),track=__lab.metrics.track.bind(__lab.metrics);
  __lab.metrics.render=(t,c,p)=>{phase.frames?.push({t,c,p});return render(t,c,p);};
  __lab.metrics.track=(t,data)=>{phase.tracks?.push({t,age:data.ageMs,inference:data.inferenceMs});return track(t,data);};
 });
 const cdp=await page.context().newCDPSession(page);await cdp.send('Performance.enable');
 for(const mode of ['render-only','full-pipeline','camera-without-inference']){
  if(mode==='full-pipeline'){await page.locator('#start-camera').click();await page.waitForFunction(()=>__lab.metrics.tracking.length>2,null,{timeout:60000});}
  if(mode==='camera-without-inference')await page.evaluate(()=>__lab.capture.frame=()=>{});
  await page.waitForTimeout(1500);
  const perf0=await cdp.send('Performance.getMetrics');
  await cdp.send('Profiler.enable');await cdp.send('Profiler.start');
  await page.evaluate(()=>{window.phase={start:performance.now(),frames:[],tracks:[]};copyMs=[];resizes=0;});
  await page.waitForTimeout(12000);
  const prof=await cdp.send('Profiler.stop'),perf1=await cdp.send('Performance.getMetrics');
  const row=await page.evaluate(()=>{
   const duration=(performance.now()-phase.start)/1000;
   const mean=a=>a.length?a.reduce((s,n)=>s+n,0)/a.length:null;
   return {duration,renderFPS:phase.frames.length/duration,trackingHz:phase.tracks.length/duration,
    renderCpuMs:mean(phase.frames.map(f=>f.c)),physicsCpuMs:mean(phase.frames.map(f=>f.p)),
    bitmapCopyMs:mean(copyMs),inferenceMs:mean(phase.tracks.map(f=>f.inference)),sampleAgeMs:mean(phase.tracks.map(f=>f.age)),
    resizes,drawCalls:__lab.view.renderer.info.render.calls,triangles:__lab.view.renderer.info.render.triangles,
    frameTransport:__lab.capture.frameTransport,camera:__lab.capture.cameraReport()};
  });
  const before=Object.fromEntries(perf0.metrics.map(m=>[m.name,m.value]));
  row.cpuCounters=Object.fromEntries(perf1.metrics.filter(m=>/Duration$/.test(m.name)).map(m=>[m.name,m.value-before[m.name]]));
  const samples=new Map();prof.profile.samples?.forEach((id,i)=>samples.set(id,(samples.get(id)||0)+(prof.profile.timeDeltas[i]||0)));
  row.top=prof.profile.nodes.map(n=>({function:n.callFrame.functionName,url:n.callFrame.url,line:n.callFrame.lineNumber,ms:(samples.get(n.id)||0)/1000})).sort((a,b)=>b.ms-a.ms).slice(0,12);
  rows.push({mode,...row});console.log(JSON.stringify({mode,...row,top:row.top.slice(0,5)}));
 }
 await writeFile(out,JSON.stringify({rows,errors,physicalWebcam:false},null,2));
}finally{await browser?.close();server.kill();}
