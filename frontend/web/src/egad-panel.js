import {LABELS} from './egad.js';
/** All student/model content is textContent, never HTML. */
export function renderAssessment(host,result,history=[]){
 host.replaceChildren();if(!result)return;
 const add=(tag,text,parent=host)=>{const el=document.createElement(tag);el.textContent=text;parent.append(el);return el;};
 add('h3',`EGAD · ${LABELS[result.label]}`);
 add('p','Nhãn dự đoán theo rubric · chưa được giáo viên xác nhận.');
 for(const c of result.concepts){const section=add('section','');section.className='egad-concept';add('strong',`${c.title} — ${LABELS[c.label]}`,section);add('p',c.reason,section);if(c.evidence.length)add('p','Bằng chứng: “'+c.evidence.join('”; “')+'”',section);if(c.missing.length)add('p','Ý cần làm rõ: '+c.missing.join('; '),section);}
 add('p','Câu hỏi tiếp theo: '+result.feedback).className='egad-followup';
 if(result.transition)add('p',`So với câu trả lời trước: ${LABELS[result.transition.from]} → ${LABELS[result.transition.to]}. Đây là thay đổi nhãn, chưa phải bằng chứng tiến bộ bền vững.`);
 add('p',`Ghi nhận ${result.actionEvidence.length} sự kiện thực hành liên quan; không dùng lỗi camera để kết luận kiến thức.`);
 const details=add('details','');add('summary','Lịch sử đánh giá bài này',details);
 for(const r of history.filter(r=>r.lesson===result.lesson).slice(-8))add('p',`${r.stage==='prediction'?'Dự đoán':'Giải thích'} · ${LABELS[r.label]} · ${r.answer}`,details);
}
