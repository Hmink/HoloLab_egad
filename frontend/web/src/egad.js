/** EGAD local rubric baseline. Labels are predictions, never teacher ground truth.
 * No dependency, network request, raw camera data or persistent storage here. */
export const LABELS = Object.freeze({correct:'Hiểu đúng',incomplete:'Hiểu chưa đầy đủ',misconception:'Có quan niệm sai',insufficient:'Chưa đủ bằng chứng'});
export const normalize = value => String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase().replace(/[₀-₉]/g,c=>String('₀₁₂₃₄₅₆₇₈₉'.indexOf(c))).replace(/\s+/g,' ').trim();
const match = (text, patterns=[]) => patterns.some(p=>new RegExp(p,'u').test(text));
export class EGAD {
 constructor(rubrics={}){this.rubrics=rubrics;this.history=[];this.events=[];this.enabled=false;this.clock=()=>new Date().toISOString();}
 setEnabled(value){this.enabled=!!value;if(!this.enabled)this.clear();}
 clear(){this.history=[];this.events=[];}
 observe(event){if(!this.enabled)return;if(event.type==='lesson-start')this.events=[];this.events.push({...event});if(this.events.length>300)this.events.shift();}
 analyze(lesson,answer,stage='explanation'){
  if(!this.enabled)throw Error('Cần đồng ý ghi dữ liệu trong phiên trước khi đánh giá.');
  if(!this.rubrics[lesson])throw Error('Chọn bài có bộ tiêu chí EGAD.');
  if(typeof answer!=='string'||answer.length>1000||!answer.trim())throw Error('Nhập lời giải thích từ 1 đến 1000 ký tự.');
  if(!['prediction','explanation'].includes(stage))throw Error('Thời điểm không hợp lệ.');
  const text=normalize(answer),clauses=text.split(/[.!?;\n]+/).filter(Boolean),rubric=this.rubrics[lesson];
  const concepts=rubric.concepts.map(c=>{
   const evidence=[],missing=[];let wrong=false,uncertain=/[?]|\b(co the|khong chac|co le|tung nghi|truoc day|nguoi khac|ban em noi)\b/.test(text);
   for(const clause of clauses){
    // A question, negated misconception, quotation or hedge is not an asserted misconception.
    const ambiguous=/\b(khong|chua|chang|co phai|co the|khong chac|nguoi khac|ban em|tung nghi|truoc day|nhung|sai khi)\b/.test(clause);
    if(match(clause,c.wrong)){if(ambiguous)uncertain=true;else{wrong=true;evidence.push(clause);}}
   }
   let hits=0;
   for(const criterion of c.criteria){
    const found=clauses.find(clause=>match(clause,criterion.patterns)&&!(criterion.reject&&match(clause,criterion.reject)));
    if(found){hits++;evidence.push(found);}else missing.push(criterion.text);
   }
   const label=wrong?'misconception':uncertain?'insufficient':hits===c.criteria.length?'correct':hits?'incomplete':'insufficient';
   return {id:c.id,title:c.title,label,evidence:[...new Set(evidence)],missing,reason:wrong?'Có phát biểu khớp quan niệm sai đã định nghĩa.':uncertain?'Có phủ định, đối lập hoặc diễn đạt chưa chắc chắn; cần hỏi lại.':hits===c.criteria.length?'Đã tìm thấy các ý yêu cầu của tiêu chí.':hits?'Mới tìm thấy một phần ý cần giải thích.':'Chưa nhận diện được các ý của tiêu chí; không có nghĩa câu trả lời sai.',followup:c.followup};
  });
  const label=concepts.some(c=>c.label==='misconception')?'misconception':concepts.every(c=>c.label==='correct')?'correct':concepts.some(c=>['correct','incomplete'].includes(c.label))?'incomplete':'insufficient';
  const previous=[...this.history].reverse().find(r=>r.lesson===lesson&&r.stage===stage);
  const target=concepts.find(c=>c.label==='misconception')||concepts.find(c=>c.label!=='correct');
  const recent=this.events.filter(e=>e.lesson===lesson&&e.quality!=='cv_uncertain'&&!/tracking/.test(e.type));
  const actionEvidence=recent.filter(e=>['reaction','immersion-reaction','completed','pour'].includes(e.type)).slice(-6).map(e=>({type:e.type,source:e.source,target:e.target,reaction:e.reaction}));
  const result={schema:'egad-assessment-1',id:this.history.length+1,time:this.clock(),lesson,stage,answer,label,concepts,source:'local-rubric',predicted:true,teacher_verified:false,rubric_version:rubric.version||1,actionEvidence,
   feedback:target?target.followup:'Em hãy giải thích kết quả nếu thay đổi lượng chất hoặc dùng mẫu đối chứng.',
   transition:previous?{from:previous.label,to:label,changed:previous.label!==label}:null,
   limits:'Đánh giá theo mẫu ngôn ngữ; có thể bỏ sót cách diễn đạt đúng. Thao tác thành công không chứng minh hiểu đúng.'};
  this.history.push(result);if(this.history.length>200)this.history.shift();return result;
 }
 export(){return {schema:'egad-session-1',predicted_labels:true,teacher_ground_truth:false,raw_video:false,raw_landmarks:false,history:structuredClone(this.history)};}
}
