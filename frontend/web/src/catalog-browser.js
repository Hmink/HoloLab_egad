/** Categorize existing usable stock; no invented apparatus or duplicate IDs. */
export const categories=[['all','Tất cả'],['vessels','Bình & ống'],['support','Dụng cụ hỗ trợ'],['liquids','Dung dịch'],['solids','Chất rắn'],['risk','Minh họa nguy cơ']];
export function categoryOf(stock){if(stock.group==='risk')return 'risk';if(['solid','iron-strip'].includes(stock.kind))return 'solids';if(stock.group==='chemical')return 'liquids';if(['beaker','flask','tube','dropper','bottle'].includes(stock.kind))return 'vessels';return 'support';}
export function filterCatalog(stocks,{allowed=null,category='all',query=''}={}){
 const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').toLowerCase();const q=norm(query.trim());
 return stocks.filter(s=>(allowed?allowed.includes(s.id):!s.id.startsWith('lesson-'))&&(category==='all'||categoryOf(s)===category)&&norm(s.name+' '+s.formula).includes(q));
}
