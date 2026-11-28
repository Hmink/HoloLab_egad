/** Read-only guidance. Equations and lesson phenomena come from the SAME
 * datasets as the production chemistry; this module never triggers a reaction. */
const LEVELS = {relative:'An toàn tương đối',attention:'Cần chú ý',danger:'Nguy hiểm',severe:'Rất nguy hiểm'};
export function hintsFor(stock, catalog, lessonData, hints, activeLesson=null) {
  if (!stock) return [];
  if (activeLesson) {
    const lesson=lessonData.lessons.find(l=>l.id===activeLesson);
    if (!lesson || !lesson.setup.some(s=>s.stock===stock.id)) return [];
    if (stock.id==='lesson-control'&&activeLesson==='chloride') return [{title:'Mẫu đối chứng',equation:'Không tạo AgCl khi mẫu nước không chứa chloride.',phenomenon:'Giữ trong, dùng so sánh với mẫu NaCl.',conditions:'Nước đối chứng riêng, chưa nhiễm chloride.',level:'relative',safety:lesson.safety,basis:'Chỉ áp dụng nước sạch ban đầu; thêm thuốc thử làm thay đổi nguy cơ.',sources:lesson.sources.map(k=>lessonData.sources[k]?.url).filter(Boolean)}];
    return [{title:lesson.title,partners:lesson.setup.filter(s=>s.stock!==stock.id&&s.role!=='control').map(s=>catalog.stocks.find(c=>c.id===s.stock)?.name||s.stock),equation:lesson.equations.join('\n'),phenomenon:lesson.phenomenon,conditions:lesson.conditions,level:lesson.id==='ammonium'?'danger':'attention',safety:lesson.safety,basis:'Mức lưu ý của bài thực hành và lượng/nồng độ ban đầu; không áp dụng cho hỗn hợp tùy ý.',sources:lesson.sources.map(k=>lessonData.sources[k]?.url).filter(Boolean)}];
  }
  if (stock.group === 'risk') return hints.qualitative.filter(row=>row.stocks.includes(stock.id));
  return hints.free.filter(row=>row.stocks.includes(stock.id)).map(row=>{
    const reaction=catalog.reactions.find(r=>r.id===row.reaction);
    if (!reaction) throw Error('Missing hint reaction '+row.reaction);
    const p=reaction.phenomena;
    const phenomenon = p.precipitate ? `Kết tủa ${catalog.species[p.precipitate.species].formula} màu ${p.precipitate.color_vi}.`
      : p.gas ? `Sinh khí ${catalog.species[p.gas.species].formula}, có bọt khí.`
      : 'Trung hòa, tỏa nhiệt; không tự đổi màu nếu thiếu chỉ thị.';
    return {...row,title:reaction.name,partners:row.stocks.filter(id=>id!==stock.id).map(id=>catalog.stocks.find(s=>s.id===id)?.name||id),equation:reaction.equation_display,phenomenon};
  });
}
export class ReactionHints {
  constructor(element,catalog,lessonData,data) { Object.assign(this,{element,catalog,lessonData,data}); }
  show(stock,activeLesson=null) {
    const el=this.element;
    el.replaceChildren();
    const text=(tag,value,parent=el)=>{const n=document.createElement(tag);n.textContent=value;parent.append(n);return n;};
    text('h3',stock?stock.name+' · '+stock.formula:'Gợi ý phản ứng');
    if (!stock) {text('p','Chọn một hóa chất để xem.');return;}
    const rows=hintsFor(stock,this.catalog,this.lessonData,this.data,activeLesson);
    if (!rows.length) text('p',stock.group==='risk'
      ? 'Mẫu định tính nguy hiểm. Xem cảnh báo khi thao tác; không có nồng độ hay phương trình định lượng cho vật liệu OX/FUEL ảo.'
      : stock.id==='water' ? 'Nước dùng làm dung môi/đối chứng. Việc thêm vào hóa chất khác cần được đánh giá theo chất đó.'
      : 'Chưa có gợi ý đã kiểm chứng cho mẫu này trong chế độ hiện tại.');
    for (const r of rows) {
      const article=text('article','');
      text('strong',r.title,article);
      if(r.partners?.length)text('p','Kết hợp trong bài: '+r.partners.join(', '),article);
      text('p',r.equation,article);
      text('p','Quan sát: '+r.phenomenon,article);
      text('p','Điều kiện: '+r.conditions,article);
      const badge=text('span',LEVELS[r.level],article);badge.className='risk-badge';badge.dataset.level=r.level;
      text('p',r.safety,article);
      const detail=text('details','',article);text('summary','Cơ sở & nguồn',detail);text('p',r.basis,detail);
      r.sources.forEach((url,i)=>{const a=text('a','Nguồn '+(i+1)+' ',detail);a.href=url;a.target='_blank';a.rel='noopener noreferrer';});
    }
    text('p',this.data.notice).className='small';
  }
}
