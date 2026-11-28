/** Experimental tutor baseline. Deterministic rules, NOT a trained model/LLM.
 * Chemistry remains authoritative in the verified lesson dataset. Never infer a
 * student's knowledge state from tracking quality or a single incorrect action. */
export class ExperimentalTutor {
  constructor(){this.source='rules';}
  advise(event, lesson) {
    if(!lesson)return {source:this.source,code:'choose',text:'Chọn bài thực hành để nhận gợi ý.'};
    if(event.quality==='cv_uncertain'||event.type==='tracking-gap')
      return {source:this.source,code:'tracking',text:'Camera đang mất dấu hoặc mẫu tay đã cũ. Giữ bàn tay trong ảnh; dữ liệu này không dùng để kết luận mức hiểu bài.'};
    if(event.type==='spill')return {source:this.source,code:'spill',text:event.reason==='overflow'?'Bình nhận đã đầy. Kiểm tra dung tích trước khi rót tiếp. Một lần tràn chưa đủ để đánh giá kiến thức.':'Dung dịch chưa vào miệng bình. Đặt miệng nguồn cao hơn và thẳng phía trên miệng bình nhận.'};
    if(event.type==='answer') {
      const q=lesson.questions[event.question];
      return {source:this.source,code:event.correct?'answer-correct':'answer-hint',text:q?(event.correct?q.explanation:q.hint):'Chọn câu hỏi trong bài.'};
    }
    if(event.type==='reaction')return {source:this.source,code:'explain',text:lesson.explanation};
    if(event.type==='blocked')return {source:this.source,code:'safety',text:lesson.safety};
    if(event.type==='pour' && !lesson.setup.some(r=>r.stock===event.target && ['sample','control'].includes(r.role)))
      return {source:this.source,code:'check-target',text:'Kiểm tra lại bình nhận theo hướng dẫn: '+lesson.steps[0]};
    return {source:this.source,code:'guide',text:lesson.steps[0]};
  }
}
