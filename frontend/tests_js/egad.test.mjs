import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {EGAD,normalize} from '../web/src/egad.js';
const rubrics=JSON.parse(fs.readFileSync(new URL('../web/data/egad-rubrics.json',import.meta.url)));
const make=()=>{const e=new EGAD(rubrics);e.setEnabled(true);return e};
test('EGAD explicit misconception, correction and memory',()=>{const e=make();assert.equal(e.analyze('chloride','Tạo khí trắng.').label,'misconception');const r=e.analyze('chloride','AgCl là kết tủa trắng. Ag và Cl tạo chất ít tan.');assert.equal(r.label,'correct');assert.equal(r.transition.from,'misconception');assert.equal(r.teacher_verified,false)});
test('EGAD insufficient evidence is not incorrect',()=>{const e=make();assert.equal(e.analyze('chloride','Em thấy có thay đổi.').label,'insufficient');assert.equal(e.analyze('chloride','AgCl là kết tủa trắng.').label,'incomplete')});
test('EGAD negation and uncertainty abstain',()=>{for(const t of ['Không có khí trắng.','Có phải khí trắng không?','Trước đây em nghĩ khí trắng.','Có thể là khí trắng.'])assert.notEqual(make().analyze('chloride',t).label,'misconception')});
test('EGAD CV errors do not label knowledge',()=>{const e=make();e.observe({lesson:'chloride',type:'tracking-gap',quality:'cv_uncertain'});e.observe({lesson:'chloride',type:'pour',quality:'cv_uncertain'});const r=e.analyze('chloride','Em chưa biết.');assert.equal(r.label,'insufficient');assert.deepEqual(r.actionEvidence,[])});
test('EGAD stages and lessons keep separate transitions',()=>{const e=make();e.analyze('chloride','khí trắng','prediction');assert.equal(e.analyze('chloride','Em thấy thay đổi.').transition,null);assert.equal(e.analyze('biuret','Em thấy thay đổi.').transition,null)});
test('EGAD requires consent and clears data on revoke',()=>{const e=new EGAD(rubrics);assert.throws(()=>e.analyze('chloride','x'));e.setEnabled(true);e.analyze('chloride','x');e.setEnabled(false);assert.equal(e.history.length,0);assert.equal(e.events.length,0)});
test('EGAD invalid input and unknown lesson rejected',()=>{const e=make();for(const a of ['',null,'a'.repeat(1001)])assert.throws(()=>e.analyze('chloride',a));assert.throws(()=>e.analyze('unknown','a'))});
test('EGAD chemistry subscripts and Vietnamese accents normalize',()=>{assert.equal(normalize('Cu(OH)₂ — ĐỒNG'),'cu(oh)2 — dong')});

test('EGAD complete-looking but hedged answer abstains',()=>{assert.equal(make().analyze('chloride','Có thể AgCl là kết tủa trắng. Ag và Cl tạo chất ít tan.').label,'insufficient')});
