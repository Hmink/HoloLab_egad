export function normalize(s){return s.toLowerCase().replaceAll('đ','d').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();}
export function classify(model,answer){
 if(typeof answer!=='string'||answer.length>10000)throw new Error('Câu trả lời phải là văn bản tối đa 10.000 ký tự.');
 const text=normalize(answer), counts=new Map();
 for(let n=2;n<=4;n++)for(let i=0;i<=text.length-n;i++){const k=model.vocabulary[text.slice(i,i+n)];if(k!==undefined)counts.set(k,(counts.get(k)||0)+1);}
 let norm=0;for(const [k,c]of counts){const v=c*model.idf[k];counts.set(k,v);norm+=v*v;}norm=Math.sqrt(norm);
 const scores=model.bias.map((b,j)=>{let s=b;if(norm)for(const[k,v]of counts)s+=model.weights[j][k]*v/norm;return s;});
 const best=scores.indexOf(Math.max(...scores));
 return {label:norm?model.classes[best]:'INSUFFICIENT_EVIDENCE',scores,needsTeacherReview:true,modelVersion:model.version,source:'SYNTHETIC_PILOT',reason:norm?'Dự đoán thống kê từ dữ liệu mô phỏng; chưa xác minh bằng rubric.':'Không có đặc trưng văn bản phù hợp.',isCalibrated:false};
}
