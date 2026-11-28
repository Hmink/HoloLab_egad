import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {LessonChemistry,appearance,ph} from '../web/src/lesson-chemistry.js';
const data=JSON.parse(fs.readFileSync(new URL('../web/data/lessons-thpt.json',import.meta.url)));
const action={kind:'pour',aligned:true,sealed:false};const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} vs ${b}`);
for(const [lesson,source,target,product,expected] of [['copper-hydroxide','lesson-base','lesson-copper','CuOH2',.0005],['calcium-carbonate','lesson-carbonate','lesson-calcium','CaCO3',.001],['carbon-dioxide','lesson-acetic','lesson-bicarbonate','CO2',.001]])test(lesson+' only reacts with valid pour; stoichiometry and snapshot',()=>{
 const m=new LessonChemistry(data,lesson);assert.equal(m.transfer(source,target,10,{...action,aligned:false}).ok,false);assert.equal(m.complete,false);
 m.transfer(source,target,10,action);near(m.get(target).mol[product],expected);assert.equal(m.complete,true);
 const copy=new LessonChemistry(data,lesson);copy.restore(m.snapshot());near(copy.get(target).mol[product],expected);
 if(product!=='CO2')assert.equal(appearance(m.get(target)).solid.species,product);
 else {for(let i=0;i<100;i++)m.step(.1);near(m.get(target).mol.CO2+m.get(target).escaped_mol.CO2,expected);copy.restore(m.snapshot());}
});
test('Neutralization equivalence is based on mol, indicator remains colorless at equivalence',()=>{const m=new LessonChemistry(data,'neutralization');m.transfer('lesson-base','lesson-neutral-sample',10,action);assert.equal(m.complete,false);m.transfer('lesson-base','lesson-neutral-sample',10,action);assert.equal(m.complete,true);near(ph(m.get('lesson-neutral-sample')),7);});
test('Dilution conserves solute and reduces concentration, no reaction event',()=>{const m=new LessonChemistry(data,'dilution');m.transfer('lesson-diluent','lesson-copper',50,action);const s=m.get('lesson-copper');near(s.volume_ml,150);near(s.mol.Cu_2plus,.005);assert.equal(m.events.some(e=>e.type==='reaction'),false);assert.equal(m.complete,true)});
test('Weak acid/carbonate pH explicitly unmodeled rather than fabricated',()=>{for(const id of ['calcium-carbonate','carbon-dioxide']){const m=new LessonChemistry(data,id);assert.equal(ph(m.get(id==='carbon-dioxide'?'lesson-acetic':'lesson-carbonate')),null)}});
