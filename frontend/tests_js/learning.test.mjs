import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {StudentInteractionLogger} from '../web/src/student-logger.js';
import {ExperimentalTutor} from '../web/src/ai-tutor.js';
import {precipitateOf} from '../web/src/reaction-visuals.js';
const lesson=JSON.parse(fs.readFileSync(new URL('../web/data/lessons-thpt.json',import.meta.url))).lessons[0];
test('Research logging is opt-in, minimal, capped and erasable',()=>{
 let t=0;const l=new StudentInteractionLogger(()=>t);l.record('grab');assert.equal(l.events.length,0);l.setEnabled(true);t=25;
 l.record('grab',{source:1,quality:'valid',video:'secret',landmarks:[1],name:'student'});
 assert.deepEqual(l.events[0],{seq:1,t_ms:25,type:'grab',source:1,quality:'valid'});
 for(let i=0;i<3100;i++)l.record('move');assert.equal(l.events.length,3000);assert.equal(l.dropped,101);
 l.setEnabled(false);assert.equal(l.events.length,0);
});
test('CV gaps cannot produce knowledge judgments; tutor labels deterministic provenance',()=>{
 const tutor=new ExperimentalTutor();const r=tutor.advise({type:'spill',quality:'cv_uncertain'},lesson);
 assert.equal(r.source,'rules');assert.equal(r.code,'tracking');assert.match(r.text,/không dùng để kết luận/);
 assert.equal(tutor.advise({type:'reaction'},lesson).text,lesson.explanation);
 assert.equal(tutor.advise({type:'answer',question:0,correct:false},lesson).text,lesson.questions[0].hint);
});
test('Only verified precipitate species produce cloud, exact amounts retained',()=>{
 assert.equal(precipitateOf({mol:{Ag_plus:.001,Na_plus:.001}}),null);
 assert.equal(precipitateOf({mol:{AgCl:.0001}}).mol,.0001);
 assert.equal(precipitateOf({mol:{CuOH2:.001}}).mass,97.56);
});
