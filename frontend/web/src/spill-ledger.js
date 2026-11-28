/** Validate the entire import before changing a live scene. Old sessions have no ledger. */
export function readSpillLedger(raw=[]) {
  if(!Array.isArray(raw)||raw.length>128)throw Error('Nhật ký tràn không hợp lệ.');
  return raw.map(row=>{
    if(!row||!Number.isFinite(row.volume_ml)||row.volume_ml<0)
      throw Error('Thể tích tràn không hợp lệ.');
    const out={source:row.source,target:row.target,reason:row.reason,volume_ml:row.volume_ml,mol:{},origins:{}};
    for(const field of ['mol','origins']){
      const entries=Object.entries(row[field]||{});
      if(entries.length>100)throw Error('Dữ liệu tràn quá lớn.');
      for(const [key,n] of entries){
        if(!Number.isFinite(n)||n<0||['__proto__','constructor','prototype'].includes(key))throw Error('Lượng chất tràn không hợp lệ.');
        out[field][key]=n;
      }
    }
    for(const k of ['protein_g','indicator_g']){const n=row[k]??0;if(!Number.isFinite(n)||n<0)throw Error('Khối lượng tràn không hợp lệ.');out[k]=n;}
    return out;
  });
}

function emptyRow(source,target,reason) {
  return {source,target,reason,volume_ml:0,mol:{},origins:{},protein_g:0,indicator_g:0};
}
function merge(row, packet) {
  row.volume_ml += packet.volume_ml;
  for(const field of ['mol','origins'])for(const [key,n] of Object.entries(packet[field]||{}))row[field][key]=(row[field][key]||0)+n;
  for(const key of ['protein_g','indicator_g'])row[key]+=(packet[key]||0);
}
/** Keep export bounded even after repeatedly creating/deleting stock bottles.
 * Older routes are summarized, never discarded: all spilled matter stays accounted for. */
export function addSpill(ledger,source,target,reason,packet) {
  let row=ledger.find(r=>r.source===source&&r.target===target&&r.reason===reason);
  if(!row) {
    if(ledger.length>=128) {
      let summary=ledger.find(r=>r.reason==='aggregated-history');
      if(!summary) {
        summary=emptyRow(null,null,'aggregated-history');
        merge(summary,ledger.shift());
        ledger.unshift(summary);
      }
      const index=ledger[0]===summary?1:0;
      merge(summary,ledger.splice(index,1)[0]);
    }
    row=emptyRow(source,target,reason);ledger.push(row);
  }
  merge(row,packet);
}
