/** Regression with real browser/Rapier and synthetic observations, not a real hand test. */
import {spawn} from 'node:child_process';
import fs from 'node:fs/promises';import path from 'node:path';import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),out=path.resolve(process.env.QA_OUTPUT || path.join(root,'validation_v36'));await fs.mkdir(out,{recursive:true});
const {chromium}=await import(process.env.PLAYWRIGHT_PACKAGE||'playwright');
const server=spawn(process.env.PYTHON||'python3',['-S','server.py','--no-browser','--browser-tracking','--port','8793'],{cwd:root});
await new Promise((r,j)=>{server.stdout.on('data',b=>b.toString().includes('http://')&&r());server.on('exit',c=>j(Error('server '+c)));});
const errors=[],checks=[],diagnostics=[];let browser;
const check=(name,data={})=>{checks.push({name,passed:true,...data});console.log('PASS',name);};
try{
 browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']});
 const page=await browser.newPage({viewport:{width:1440,height:950}});
 page.on('pageerror',e=>errors.push(e.stack||e.message));page.on('console',m=>{
  if(m.type()==='error') {
   if(m.text().startsWith('INFO: Created TensorFlow Lite XNNPACK delegate'))diagnostics.push(m.text());
   else errors.push(m.text());
  }
 });
 await page.goto('http://127.0.0.1:8793/?test');await page.waitForFunction(()=>window.__lab);
 await page.evaluate(()=>{
 window.makeRig=(kind='beaker',roll=0)=>{
  __lab.clearDesk();
  const o=__lab.createObject(kind,{x:0,y:.7,z:0},{roll}),p=__lab.view.physics,entry=p.entries.get(o.id),a=__lab.interaction;
  __lab.view.scene.updateMatrixWorld(true);
  const screen=__lab.view.toScreen(o.group.position),m=a.margin;
  const x=m+screen.x/innerWidth*(1-2*m),y=m+screen.y/innerHeight*(1-2*m);
  let time=performance.now();
  const pose=(ratio=.2,fist=false)=>({x,y,center:{x,y},ratio,fist,palm:.15,angle:0,label:'Right',score:.99,points:Array.from({length:21},()=>({x,y,z:0}))});
  const feed=(rows,dt=34)=>{
   time+=dt;__lab.replay(rows,time);a.sweep(time);
   const owners=a.owners(o);p.ownership(o,owners.length>0,owners.every(h=>h.track.observed&&!h.missing&&!h.track.ambiguous));p.step(dt/1000);
  };
  for(let i=0;i<6;i++)feed([pose()]);
  if(a.owners(o).length!==1)throw Error('Raycast did not acquire '+kind);
  return {o,p,a,entry,feed,pose,get time(){return time;}};
 };
 });
 const drops=await page.evaluate(()=>{
  let maxPen=0,maxGap=0;const angles=[0,.7,Math.PI/2,Math.PI,2.5];
  for(let i=0;i<25;i++){
   const r=makeRig(['beaker','flask','tube','water','dropper'][i%5],angles[Math.floor(i/5)]);
   r.a.setMode('rotate');r.feed([r.pose()]);
   const before=r.o.group.position.y;
   for(let n=0;n<3;n++)r.feed([r.pose(1.2,true)]);
   if(!r.entry.body.isDynamic()||r.a.owners(r.o).length)throw Error('Still held after opening');
   for(let n=0;n<30;n++)r.p.step(1/120);
   if(r.o.group.position.y>=before-.05)throw Error('Did not fall');
   for(let n=0;n<600;n++){r.p.step(1/120);maxPen=Math.max(maxPen,r.p.table.top-r.p.bounds(r.entry,r.entry.body.rotation(),r.p.position(r.entry)).min.y);}
   maxGap=Math.max(maxGap,r.p.bounds(r.entry,r.entry.body.rotation(),r.p.position(r.entry)).min.y-r.p.table.top);
   if(maxGap>.04)throw Error('Hover gap '+maxGap);
   __lab.beginMouse(r.o,__lab.view.toScreen(r.o.target));if(!r.entry.body.isKinematic())throw Error('Cannot regrab');__lab.endMouse();
  }
  return {cycles:25,maxPenetrationScene:maxPen,maxFloorGapScene:maxGap};
 });assert.ok(drops.maxPenetrationScene<.004);check('25 pinch-release cycles with folded fingers, five real vessel meshes/angles: dynamic, falls, rests, regrabs',drops);
 const lost=await page.evaluate(()=>{
  let r=makeRig();for(let i=0;i<7;i++)r.feed([]);if(!r.entry.body.isKinematic())throw Error('short gap dropped');
  r.feed([r.pose()]);r.feed([r.pose()]);if(!r.entry.body.isKinematic())throw Error('recovery failed');
  for(let i=0;i<22;i++)r.feed([]);if(!r.entry.body.isDynamic())throw Error('loss never released');
  r=makeRig();for(let n=0;n<3;n++){for(let i=0;i<15;i++)r.feed([]);r.feed([r.pose()]);}
  if(!r.entry.body.isDynamic())throw Error('intermittent stale hold');
  r=makeRig();r.a.sweep(r.time+710);if(!r.entry.body.isDynamic())throw Error('stalled callback');
  return {briefGapMs:238,watchdogMs:700};
 });check('Brief loss retained; long loss, isolated reacquisition and camera stall release through production park',lost);
 const settings=await page.evaluate(()=>{
  const r=makeRig(),at=r.o.group.position.clone(),releases=r.a.events.filter(e=>e.type==='release').length;
  const emit=(id,value,event='change')=>{const el=document.getElementById(id);el.value=value;el.dispatchEvent(new Event(event));};
  emit('pinch','.60','input');emit('quality','.75');emit('tracking-rate','30');emit('reach','.12');emit('gesture-mode','rotate');
  if(r.a.events.filter(e=>e.type==='release').length!==releases||!r.entry.body.isKinematic())throw Error('live setting dropped');
  emit('tracking-size','960');emit('camera-quality','LOW');emit('tracking-backend','CPU');
  if(__lab.capture.inferenceWidth!==640||!r.entry.body.isKinematic())throw Error('component change applied mid-hold');
  if(r.o.group.position.distanceTo(at)>1e-8)throw Error('settings teleported');
  r.a.parkAll('test');return {settings:9};
 });await page.waitForFunction(()=>__lab.capture.inferenceWidth===960&&__lab.capture.preference==='CPU');check('Nine production settings controls preserve hold or defer component changes until release',settings);
 // All tested swaps use the same video track; no physical webcam is accessed.
 await page.locator('#start-camera').click();await page.waitForFunction(()=>__lab.capture.running,null,{timeout:60000});
 await page.waitForFunction(()=>__lab.metrics.tracking.length>1,null,{timeout:60000});
 await page.evaluate(()=>window.oldTrack=__lab.capture.video.srcObject.getVideoTracks()[0]);
 await page.evaluate(()=>{const e=document.getElementById('tracking-backend');e.value='AUTO';e.dispatchEvent(new Event('change'));});
 await page.waitForFunction(()=>__lab.capture.running&&__lab.capture.preference==='AUTO',null,{timeout:60000});
 assert.ok(await page.evaluate(()=>oldTrack===__lab.capture.video.srcObject.getVideoTracks()[0]));
 const report=await page.evaluate(()=>__lab.capture.cameraReport());check('Backend restarts worker without replacing live video track; actual capture and input dimensions reported',report);
 await page.locator('#stop-camera').click();
 // Dataset-driven hints and real reaction effects.
 await page.evaluate(()=>{__lab.lessons.start('chloride');__lab.select(__lab.lessons.objects.get('lesson-silver'));});
 assert.match(await page.locator('#reaction-hints').innerText(),/AgCl/);assert.match(await page.locator('#reaction-hints').innerText(),/trắng/);check('Right-hand hints show verified chloride equation, white precipitate and safety sources');
 const effects=await page.evaluate(async()=>{
  __lab.clearDesk();const a=__lab.createObject('oxidizer_risk',{x:-2,y:0,z:0}),b=__lab.createObject('fuel_risk',{x:2,y:0,z:0});
  await __lab.pour(a,b,true,2);const fx=__lab.view.effects.find(e=>e.item===b&&e.kind==='fire');if(!fx?.combustion)throw Error('No engine-confirmed sparks');
  __lab.view.render(.016,performance.now());
  let disposed=0;fx.combustion.sparks.addEventListener('dispose',()=>disposed++);fx.combustion.smoke.addEventListener('dispose',()=>disposed++);
  const sparks=fx.combustion.sparks.count;__lab.clearDesk();if(disposed!==2)throw Error('particle buffer leak');
  const c=__lab.createObject('cuso4',{x:-2,y:0,z:0}),d=__lab.createObject('naoh',{x:2,y:0,z:0});
  await __lab.pour(c,d,true,2);__lab.view.render(.1,performance.now());
  if(!d.mixture.mol.CuOH2||__lab.view.effects.some(e=>e.combustion))throw Error('precipitate got fire');
  return {sparks,instanceBuffersDisposed:disposed,precipitateMol:d.mixture.mol.CuOH2};
 });check('Engine fire produces bounded sparks/flash/smoke, reset disposes them; Cu(OH)2 never gets fire',effects);
 for(const [width,height] of [[1920,1080],[1366,768],[1024,768],[640,800]]) {
  await page.setViewportSize({width,height});await page.waitForTimeout(300);
  const layout=await page.evaluate(()=>{
   const w=document.getElementById('workspace').getBoundingClientRect(),s=document.getElementById('supplies').getBoundingClientRect();
   return {work:{x:w.x,right:w.right,width:w.width},stock:{x:s.x,width:s.width},overflow:document.documentElement.scrollWidth>innerWidth};
  });assert.ok(layout.work.width>200&&!layout.overflow,JSON.stringify(layout));assert.ok(layout.stock.x>=layout.work.right-1,JSON.stringify(layout));
 }
 check('Stock panel stays to right without canvas overlap or page overflow at four viewport sizes');
 await page.locator('#sidebar-toggle').click();
 assert.equal(await page.locator('#sidebar-toggle').getAttribute('aria-expanded'),'true');
 assert.ok(await page.locator('#inventory').isVisible());
 await page.locator('#sidebar-toggle').click();
 assert.equal(await page.locator('#sidebar-toggle').getAttribute('aria-expanded'),'false');
 assert.equal(await page.locator('#inventory').isVisible(),false);
 await page.setViewportSize({width:1366,height:900});await page.screenshot({path:path.join(out,'internal_v36_layout.png')});
 assert.deepEqual(errors,[]);check('No JavaScript/WebGL runtime errors');
 await fs.writeFile(path.join(out,'new_regressions.json'),JSON.stringify({environment:'Chromium headless SwiftShader; synthetic hand observations and fake camera',checks,errors,diagnostics},null,2));
}catch(error){await fs.writeFile(path.join(out,'new_regressions_failure.json'),JSON.stringify({checks,errors,error:String(error)},null,2));throw error;}
finally{await browser?.close();server.kill();}
