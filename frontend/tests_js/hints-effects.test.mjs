import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {hintsFor} from '../web/src/reaction-hints.js';
import * as T from '../web/vendor/three/three.module.js';
import {createCombustion,updateCombustion,disposeCombustion} from '../web/src/combustion-visual.js';
const read=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url)));
const hints=read('../web/data/reaction-hints.json'),lessons=read('../web/data/lessons-thpt.json'),db=read('../../backend/data/chemistry.json');
test('hints use actual reaction IDs/equations and stated concentrations, sources and safety',()=>{
 const ids=[...new Set(hints.free.flatMap(r=>r.stocks))];
 const catalog={...db,stocks:ids.map(id=>({id,name:id}))};
 for(const id of ids){const list=hintsFor({id},catalog,lessons,hints);assert.ok(list.length);for(const r of list){assert.equal(r.equation,db.reactions.find(x=>x.id===r.reaction).equation_display);assert.ok(r.conditions&&r.basis&&r.safety&&r.sources.length);}}
 const cu=hintsFor({id:'cuso4'},catalog,lessons,hints)[0];assert.match(cu.phenomenon,/xanh lam/);
});
test('AgNO3 lesson hint matches lesson chemistry; water is a distinct negative control',()=>{
 const catalog={stocks:lessons.stocks};
 const silver=hintsFor({id:'lesson-silver'},catalog,lessons,hints,'chloride')[0];
 assert.match(silver.equation,/AgCl/);assert.match(silver.phenomenon,/trắng/);
 assert.equal(hintsFor({id:'lesson-control'},catalog,lessons,hints,'chloride')[0].level,'relative');
 assert.equal(hintsFor({id:'copper'},catalog,lessons,hints).length,0);
});
test('combustion overlay has bounded buffers and releases all private materials/instances',()=>{
 const scene=new T.Scene(),geometry=new T.SphereGeometry(.045,6,4),fx=createCombustion(scene,geometry);
 let disposed=0;for(const x of [fx.sparks,fx.smoke,fx.flash])x.material.addEventListener('dispose',()=>disposed++);
 for(let t=0;t<3000;t+=16)updateCombustion(fx,new T.Vector3(1,2,3),t);
 assert.equal(fx.sparks.count,16);assert.equal(fx.smoke.count,12);assert.equal(scene.children.length,3);
 assert.ok([...fx.sparks.instanceMatrix.array].every(Number.isFinite));
 disposeCombustion(scene,fx);assert.equal(disposed,3);assert.equal(scene.children.length,0);geometry.dispose();
});
