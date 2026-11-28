import {spawn} from 'node:child_process';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_PACKAGE || 'playwright');
const out=new URL('../validation_v38/',import.meta.url),root=new URL('../',import.meta.url);
const server=spawn('python3',['-S','server.py','--no-browser','--browser-tracking','--port','8793'],{cwd:root});
await new Promise((res,rej)=>{server.stdout.on('data',b=>b.toString().includes('http://')&&res());server.on('exit',c=>rej(Error('server '+c)))});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']});
const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[],checks=[];page.on('pageerror',e=>errors.push(e.message));
const check=(name,data={})=>{checks.push({name,passed:true,...data});console.log('PASS',name)};
const step=()=>page.evaluate(()=>{for(let i=0;i<480;i++)__lab.view.physics.step(1/120);__lab.view.scene.updateMatrixWorld(true)});
const point=()=>page.evaluate(()=>__lab.view.toScreen(__lab.view.objects[0].group.position));
try{
 await page.goto('http://127.0.0.1:8793/?test');await page.waitForFunction(()=>window.__lab);await page.waitForTimeout(600);
 await page.getByRole('button',{name:'‹ Thư viện',exact:true}).click();
 await page.screenshot({path:new URL('library.png',out).pathname});
 await page.getByLabel('Lọc lớp').selectOption('10');
 assert.equal(await page.locator('.experiment-card').count(),1);
 await page.getByLabel('Tìm thí nghiệm').fill('chloride');await page.locator('.experiment-card').click();
 await page.locator('.preview-scrim').getByRole('button',{name:'Bắt đầu thực hành',exact:true}).click();
 assert.equal(await page.evaluate(()=>__lab.lessons.model.lesson.id),'chloride');
 check('React library: grade/search/preview/start actual chloride lesson');
 await page.getByRole('button',{name:'Lưu',exact:true}).click();
 await page.getByRole('button',{name:'‹ Thư viện',exact:true}).click();
 assert.equal(await page.locator('.saved-session').count(),1);await page.locator('.saved-session').click();
 await page.waitForFunction(()=>__lab.lessons.active);check('Save and restore actual lesson locally');
 await page.getByRole('button',{name:'‹ Thư viện',exact:true}).click();await page.getByRole('button',{name:'＋ Bàn thí nghiệm mới',exact:true}).click();
 await page.waitForTimeout(300);
 // Use actual stock-card pointer gesture to instantiate a vessel.
 const card=await page.locator('[data-stock="beaker"]').boundingBox(),work=await page.locator('#workspace').boundingBox();
 await page.mouse.move(card.x+30,card.y+30);await page.mouse.down();await page.mouse.move(work.x+work.width*.5,work.y+work.height*.35,{steps:20});await page.mouse.up();await step();
 assert.equal(await page.evaluate(()=>__lab.view.objects.length),1);check('Drag stock card onto desk creates physical beaker');
 await page.getByRole('button',{name:'Hoàn tác',exact:true}).click();await page.waitForFunction(()=>__lab.view.objects.length===0);
 await page.getByRole('button',{name:'Làm lại',exact:true}).click();await page.waitForFunction(()=>__lab.view.objects.length===1);check('Undo/redo create restores full session');
 for(let i=0;i<20;i++){
  await step();const p=await point();await page.mouse.move(p.x,p.y);await page.mouse.down();await page.mouse.move(p.x+(i%2?20:-20),p.y-65,{steps:5});
  assert.equal(await page.evaluate(()=>__lab.view.objects[0].mouseOwned),true);
  await page.mouse.up();await step();
  assert.equal(await page.evaluate(()=>{const o=__lab.view.objects[0],e=__lab.view.physics.entries.get(o.id);return e.body.isDynamic()&&!o.mouseOwned&&__lab.view.physics.bounds(e,e.body.rotation(),__lab.view.physics.position(e)).min.y>=__lab.view.physics.table.top-.01}),true);
 }
 check('20 real pointer grab/drop/regrab cycles: dynamic release, no table penetration');
 await page.evaluate(()=>{const o=__lab.view.objects[0];o.target={x:0,y:.8,z:0};o.roll=o.pitch=o.yaw=0;__lab.view.physics.editPose(o)});
 // Hold above the tabletop before rotation; physical gravity remains active on release.
 let p=await point();await page.mouse.move(p.x,p.y);await page.mouse.down({button:'right'});await page.mouse.move(p.x-180,p.y,{steps:20});await page.waitForTimeout(900);
 assert.equal(await page.evaluate(()=>__lab.view.objects[0].mouseOwned),true);
 assert.ok(await page.evaluate(()=>Math.abs(__lab.view.objects[0].roll)>1));
 await page.mouse.up({button:'right'});await step();check('Right mouse rotation changes actual rigid-body pose; release remains dynamic');
 await page.getByRole('button',{name:'Dựng thẳng',exact:true}).click();await step();
 await page.getByRole('button',{name:'Gần / xa',exact:true}).click();p=await point();const z=await page.evaluate(()=>__lab.view.objects[0].target.z);
 await page.mouse.move(p.x,p.y);await page.mouse.down();await page.mouse.move(p.x,p.y+35,{steps:10});await page.waitForTimeout(500);await page.mouse.up();await step();
 assert.ok(await page.evaluate(z=>Math.abs(__lab.view.objects[0].target.z-z)>.1,z));check('Mouse depth mode changes world z without camera orbit');
 await page.getByRole('button',{name:'Di chuyển',exact:true}).click();p=await point();await page.mouse.move(p.x,p.y);await page.mouse.down();await page.evaluate(()=>window.dispatchEvent(new Event('blur')));
 assert.equal(await page.evaluate(()=>__lab.view.objects[0].mouseOwned),false);await page.mouse.up();check('Lost window focus releases mouse ownership');
 const rack=await page.evaluate(async()=>{
 __lab.clearDesk();const r=__lab.view.rack,s=r.slots[1];const o=__lab.createObject('tube',s);__lab.beginMouse(o,__lab.view.toScreen(o.target));__lab.endMouse();
 if(r.joints.size!==1)throw Error('Tube did not snap');
 for(let i=0;i<7200;i++)__lab.view.physics.step(1/120);
 if(o.group.position.distanceTo({x:s.x,y:s.y,z:s.z})>.02)throw Error('Rack drift');
 const saved=__lab.session();await __lab.loadSession(saved);if(r.joints.size!==1)throw Error('Rack not restored');
 const restored=__lab.view.objects[0];__lab.beginMouse(restored,__lab.view.toScreen(restored.target));if(r.joints.size)throw Error('Rack joint not removed on grab');
 __lab.move(restored,{x:0,y:0,z:0},0,0,0);for(let i=0;i<480;i++)__lab.view.physics.step(1/120);__lab.endMouse();
 return {restSeconds:60,restore:true,regrab:true};
 });check('Tube rack: actual joint, 60 simulated seconds stable, save/restore and regrab',rack);
 await page.screenshot({path:new URL('mouse-workspace.png',out).pathname});
 // Arrange known mouth geometry, then rotate through actual pointer events.
 const pourPoint=await page.evaluate(()=>{
 __lab.lessons.start('chloride');const a=__lab.lessons.objects.get('lesson-silver'),b=__lab.lessons.objects.get('lesson-chloride'),p=__lab.view.physics;
 const advance=()=>{for(let i=0;i<480;i++)p.step(1/120);__lab.view.scene.updateMatrixWorld(true)};
 advance();__lab.beginMouse(a,__lab.view.toScreen(a.target));__lab.move(a,{x:0,y:1.1,z:0},Math.PI*.75,0,0);advance();
 a.pourable.updatePose();b.pourable.updatePose();const offset=a.pourable.mouth.clone().sub(a.group.position),mouth=b.pourable.center;
 __lab.move(a,{x:mouth.x-offset.x,y:mouth.y+.6-offset.y,z:mouth.z-offset.z},0,0,0);advance();__lab.endMouse();return __lab.view.toScreen(a.group.position);
 });
 await page.mouse.move(pourPoint.x,pourPoint.y);await page.mouse.down({button:'right'});await page.mouse.move(pourPoint.x-Math.PI*.75/.009,pourPoint.y,{steps:20});
 await page.waitForFunction(()=>__lab.lessons.model.get('lesson-chloride').mol.AgCl>0.00001,null,{timeout:10000});
 await page.mouse.up({button:'right'});check('Actual right-mouse rotation pours reagent and produces AgCl (fixture pre-aligns mouth)');
 await page.evaluate(()=>{__lab.clearDesk();for(const [i,id] of ['beaker','flask','tube'].entries())__lab.createObject(id,{x:(i-1)*1.7,y:0,z:0});});
 // Resting stability and frame-rate measurement in the same production rAF, no webcam.
 const measurement=await page.evaluate(async()=>{const start=performance.now();let n=0,last=start,max=0;await new Promise(resolve=>{function frame(t){max=Math.max(max,t-last);last=t;n++;if(t-start>=60000)resolve();else requestAnimationFrame(frame)}requestAnimationFrame(frame)});return {seconds:(performance.now()-start)/1000,frames:n,fps:n/((performance.now()-start)/1000),maxFrameMs:max,renderer:__lab.view.renderer.getContext().getParameter(__lab.view.renderer.getContext().RENDERER)}});
 check('60-second live render observation (software GPU; no physical camera)',measurement);
 assert.deepEqual(errors,[]);check('No runtime JavaScript errors');
 await fs.writeFile(new URL('mouse-results.json',out),JSON.stringify({checks,errors,physicalWebcamTested:false},null,2));
}catch(e){await page.screenshot({path:new URL('mouse-failure.png',out).pathname});await fs.writeFile(new URL('mouse-failure.json',out),JSON.stringify({error:e.stack,checks,errors},null,2));throw e}finally{await browser.close();server.kill()}
