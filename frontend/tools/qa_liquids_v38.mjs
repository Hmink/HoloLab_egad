import {spawn} from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.resolve(process.env.QA_OUTPUT || path.join(root,'validation_v38'));await fs.mkdir(out,{recursive:true});
const {chromium}=await import(process.env.PLAYWRIGHT_PACKAGE || 'playwright');
const server=spawn(process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3'),['-S','server.py','--no-browser','--browser-tracking','--port','8791'],{cwd:root});
await new Promise((resolve,reject)=>{server.stdout.on('data',d=>d.toString().includes('http://')&&resolve());server.on('exit',c=>reject(Error('server '+c)));});
const errors=[],checks=[];
let browser;
const check=(name,data={})=>{checks.push({name,passed:true,...data});console.log('PASS',name);};
try {
 browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.goto('http://127.0.0.1:8791/?test');await page.waitForFunction(()=>window.__lab);
 await page.evaluate(()=>{
 window.stepBodies=(n=240)=>{for(let i=0;i<n;i++)__lab.view.physics.step(1/120);__lab.view.scene.updateMatrixWorld(true);};
 window.alignPour=(sourceKey,targetKey,angle=135)=>{
 const a=__lab.lessons.objects.get(sourceKey),b=__lab.lessons.objects.get(targetKey),p=__lab.view.physics;
 __lab.beginMouse(a,__lab.view.toScreen(a.target));
 __lab.move(a,{x:a.target.x,y:1.15,z:0},0,0,0);stepBodies();
 __lab.move(a,{x:a.target.x,y:1.15,z:0},angle*Math.PI/180,0,0);stepBodies();
 a.pourable.updatePose();b.pourable.updatePose();
 const offset=a.pourable.mouth.clone().sub(a.group.position),mouth=b.pourable.center;
 __lab.move(a,{x:mouth.x-offset.x,y:mouth.y+.55-offset.y,z:mouth.z-offset.z},angle*Math.PI/180,0,0);stepBodies(480);
 return {aligned:__lab.view.pourTarget(a)===b,from:a.group.position.toArray(),mouth:a.pourable.mouth.toArray(),to:b.pourable.center.toArray()};
 };
 });
 const all=await page.evaluate(()=>{
 __lab.clearDesk();const results=[];
 for(const kind of ['beaker','flask','tube','water','dropper']) {
 __lab.clearDesk();const o=__lab.createObject(kind,{x:0,y:.5,z:0});
 __lab.beginMouse(o,__lab.view.toScreen(o.target));
 for(const angle of [45,90,135,180,270,360]){__lab.move(o,{x:0,y:.5,z:0},angle*Math.PI/180,0,0);stepBodies(180);const axis=o.pourable.updatePose().axis;if(Math.abs(axis.y-Math.cos(angle*Math.PI/180))>.03)throw Error(kind+' rotation '+angle);}
 o.mixture.volume_ml=kind==='dropper'?3:10;__lab.view.updateMixture(o);
 __lab.move(o,{x:0,y:.5,z:0},Math.PI,0,0);stepBodies();
 results.push({kind,rate:o.pourable.updatePose().rate(),colliders:__lab.view.physics.entries.get(o.id).colliders.length});
 __lab.endMouse();stepBodies(600);
 const e=__lab.view.physics.entries.get(o.id);if(__lab.view.physics.bounds(e,e.body.rotation(),__lab.view.physics.position(e)).min.y<__lab.view.physics.table.top-.01)throw Error('penetrated');
 }
 return results;
 });
 assert.ok(all.every(x=>x.rate>0));check('Five actual rendered vessels rotate 45/90/135/180/270/360; release falls on table',{vessels:all});
 await page.evaluate(()=>__lab.lessons.start('chloride'));
 await page.waitForTimeout(600);
 const aligned=await page.evaluate(()=>alignPour('lesson-silver','lesson-chloride'));
 assert.ok(aligned.aligned,JSON.stringify(aligned));
 await page.waitForFunction(()=>__lab.lessons.model.get('lesson-chloride').mol.AgCl>0.00005,null,{timeout:8000});
 check('Production rAF pouring creates AgCl after geometric alignment',aligned);
 await page.evaluate(()=>{const o=__lab.lessons.objects.get('lesson-silver');__lab.move(o,{x:-2,y:1,z:0},0,0,0);stepBodies(240);__lab.endMouse();stepBodies(480);});
 await page.waitForTimeout(300);
 const amount=await page.evaluate(()=>({mol:__lab.lessons.model.get('lesson-chloride').mol.AgCl,volumes:[...__lab.lessons.model.vessels.values()].reduce((s,m)=>s+m.volume_ml,0),spilled:__lab.spillLedger.reduce((s,m)=>s+m.volume_ml,0)}));
 assert.ok(Math.abs(amount.volumes+amount.spilled-46)<1e-6,JSON.stringify(amount));check('Lesson source + target + spill volumes conserved',amount);
 await page.screenshot({path:path.join(out,'internal_chloride_after.png')});
 const negative=await page.evaluate(()=>{const m=__lab.lessons.model;return m.get('lesson-control').mol.AgCl||0;});assert.equal(negative,0);check('Water control has no invented precipitate');
 await page.click('#lesson-quiz');await page.locator('#lesson-answers button').nth(1).click();assert.match(await page.locator('#lesson-answer-feedback').innerText(),/Gợi ý/);await page.click('#lesson-quiz-close');check('Quiz feedback works');
 const disposed=await page.evaluate(()=>{
   const o=__lab.lessons.objects.get('lesson-chloride');let grains=0,bubbles=0;
   o.precipitateVisual.mesh.addEventListener('dispose',()=>grains++);
   __lab.view.effect(o,'bubbles',performance.now());
   __lab.view.effects.find(e=>e.item===o).mesh.addEventListener('dispose',()=>bubbles++);
   __lab.lessons.start('chloride');
   return {grains,bubbles,remaining:__lab.view.effects.length};
 });assert.deepEqual(disposed,{grains:1,bubbles:1,remaining:0});check('Reset releases precipitate and effect instance buffers',disposed);
 // Full inversion must drain in the real animation loop, including a spill without receiver.
 await page.evaluate(()=>{__lab.lessons.start('chloride');const o=__lab.lessons.objects.get('lesson-silver');__lab.beginMouse(o,__lab.view.toScreen(o.target));__lab.move(o,{x:-2,y:1,z:0},Math.PI,0,0);stepBodies(480);});
 await page.waitForFunction(()=>__lab.lessons.model.get('lesson-silver').volume_ml<1e-8,null,{timeout:15000});
 const drain=await page.evaluate(()=>({spilled:__lab.spillLedger.reduce((s,m)=>s+m.volume_ml,0),liquid:__lab.lessons.objects.get('lesson-silver').liquid.visible,puddles:__lab.view.spills.length}));
 await page.waitForTimeout(200);
 assert.ok(drain.spilled>29.9&&drain.puddles>0,JSON.stringify(drain));check('Full inversion drains 30 mL to visible puddle via production loop',drain);
 const restored=await page.evaluate(async()=>{
   const before=__lab.session();await __lab.loadSession(before);const after=__lab.session();
   return JSON.stringify(before.spills)===JSON.stringify(after.spills)&&JSON.stringify(before.model.vessels)===JSON.stringify(after.model.vessels);
 });assert.ok(restored);check('Save/load preserves vessel quantities and spill ledger together');
 // Each remaining guided lesson uses the actual mouth alignment and transfer path.
 await page.evaluate(()=>{
   window.parkSource=()=>{const o=__lab.view.objects.find(o=>o.mouseOwned);if(!o)return;__lab.move(o,{x:-3.7,y:1,z:0},0,0,0);stepBodies(300);__lab.endMouse();stepBodies(400);};
 });
 for (const [id,from,to,condition] of [
   ['indicator','lesson-base','lesson-indicator','pink'],
   ['biuret','lesson-biuret','lesson-protein','complete'],
   ['ammonium','lesson-base','lesson-ammonium','gas'],
 ]) {
   await page.evaluate(id=>__lab.lessons.start(id),id);await page.waitForTimeout(250);
   assert.ok((await page.evaluate(([a,b])=>alignPour(a,b),[from,to])).aligned);
   await page.waitForFunction(kind=>kind==='pink'?__lab.lessons.model.seenPink:kind==='gas'?__lab.lessons.model.get('lesson-ammonium').escaped_mol.NH3>0:__lab.lessons.model.complete,condition,{timeout:8000});
   await page.evaluate(()=>parkSource());
   if(id==='indicator') {
     await page.evaluate(()=>alignPour('lesson-acid','lesson-indicator'));
     await page.waitForFunction(()=>__lab.lessons.model.complete,null,{timeout:8000});await page.evaluate(()=>parkSource());
   }
   if(id==='ammonium') {
     const gas=await page.evaluate(()=>{
       const a=__lab.lessons.objects.get('lesson-litmus'),b=__lab.lessons.objects.get('lesson-ammonium');
       __lab.beginMouse(a,__lab.view.toScreen(a.target));__lab.move(a,{x:b.target.x,y:1.2,z:b.target.z},0,0,0);stepBodies(300);
       const m=__lab.view.mouth(b);__lab.move(a,{x:m.x,y:m.y+.25-.28*.67,z:m.z},0,0,0);stepBodies(300);
       for(let i=0;i<120;i++)__lab.lessons.tick(1/60,performance.now()+i*1000/60);
       return __lab.lessons.model.complete;
     });assert.ok(gas);
   }
   check('Guided chemistry through rendered vessels: '+id);
 }
 await page.evaluate(()=>__lab.lessons.start('iron-copper'));await page.waitForTimeout(250);
 const iron=await page.evaluate(()=>{
   const a=__lab.lessons.objects.get('lesson-iron'),b=__lab.lessons.objects.get('lesson-copper');
   __lab.beginMouse(a,__lab.view.toScreen(a.target));__lab.move(a,{x:b.target.x,y:1.2,z:b.target.z},0,0,0);stepBodies(400);
   __lab.move(a,{x:b.target.x,y:b.target.y+.28,z:b.target.z},0,0,0);stepBodies(400);
   const contacts=__lab.lessons.visuals.contacts(__lab.lessons.objects,__lab.lessons.model);
   for(let i=0;i<120;i++)__lab.lessons.tick(1/60,performance.now()+i*1000/60);
   const n=__lab.lessons.model.get('lesson-iron').mol.Cu||0;
   __lab.move(a,{x:b.target.x,y:1.5,z:b.target.z},0,0,0);stepBodies(400);
   for(let i=0;i<120;i++)__lab.lessons.tick(1/60,performance.now()+i*1000/60);
   return {n,after:__lab.lessons.model.get('lesson-iron').mol.Cu||0,immersed:contacts.immersed};
 });assert.ok(iron.immersed&&iron.n>0);assert.equal(iron.n,iron.after);check('Iron immersion reacts and lifting out stops reaction',iron);
 await page.evaluate(()=>__lab.lessons.start('chloride'));
 const layout=[];
 for(const [w,h] of [[1920,1080],[1366,768],[1024,768],[640,800]]){
   await page.setViewportSize({width:w,height:h});await page.waitForTimeout(250);
   const info=await page.evaluate(()=>{
     const r=__lab.view.rect,labels=__lab.view.objects.map(o=>{const r=o.label.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height};});
     const overlaps=labels.some((a,i)=>labels.some((b,j)=>j>i&&a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y));
     return {width:innerWidth,canvas:r.width,height:r.height,finite:Number.isFinite(__lab.view.camera.position.z),overlaps,overflow:document.documentElement.scrollWidth>innerWidth};
   });assert.ok(info.canvas>300&&info.finite&&!info.overlaps&&!info.overflow,JSON.stringify(info));layout.push(info);
 }
 check('Responsive collapsed selector, labels do not overlap or overflow', {layout});
 await page.setViewportSize({width:1440,height:1000});
 await page.locator('#learning-panel > summary').click();
 await page.check('#learning-consent');await page.fill('#learning-response','Ag+ kết hợp Cl- tạo AgCl trắng.');await page.click('#learning-save-answer');
 const log=await page.evaluate(()=>__lab.learningLogger.export());assert.ok(log.events.some(e=>e.type==='explanation'));assert.equal(log.raw_video,false);assert.equal(log.raw_landmarks,false);
 await page.click('#learning-clear');assert.equal(await page.evaluate(()=>__lab.learningLogger.events.length),0);check('Opt-in event log, explanation, export payload and erase via UI');
 await page.evaluate(()=>document.querySelector('#learning-panel').open=false);
 await page.screenshot({path:path.join(out,'internal_final_layout.png')});
 assert.deepEqual(errors,[]);check('No JS or WebGL errors');
} catch(e) {checks.push({name:'failure',passed:false,error:String(e),stack:e.stack});console.error(e);process.exitCode=1;}
finally {await fs.writeFile(path.join(out,'browser.json'),JSON.stringify({physicalWebcam:false,checks,errors},null,2));await browser?.close();server.kill();}
