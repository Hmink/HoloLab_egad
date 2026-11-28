import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import{classify}from '../web/src/egad-trained.js';
const m=JSON.parse(fs.readFileSync(new URL('../web/data/egad-model.json',import.meta.url)));const parity=JSON.parse(fs.readFileSync(new URL('../../backend/training/parity.json',import.meta.url)));
test('JS inference matches Python trained model for all 45 samples',()=>{for(const r of parity){const p=classify(m,r.answer);p.scores.forEach((v,i)=>assert.ok(Math.abs(v-r.scores[i])<1e-9));}});
test('blank, unknown and oversized inputs',()=>{assert.equal(classify(m,'').label,'INSUFFICIENT_EVIDENCE');assert.equal(classify(m,'💡').label,'INSUFFICIENT_EVIDENCE');assert.throws(()=>classify(m,'a'.repeat(10001)));});
