/** Opt-in local research events, not video or landmark recordings. Export requires a click.
 * No names, persistent identifiers, network calls, localStorage or automatic download. */
export class StudentInteractionLogger {
  constructor(clock=()=>performance.now()) { this.clock=clock;this.enabled=false;this.clear(); }
  clear() { this.events=[];this.sequence=0;this.dropped=0;this.start=this.clock(); }
  setEnabled(enabled) { this.enabled=!!enabled; if(!enabled)this.clear(); }
  record(type, details={}) {
    if(!this.enabled)return;
    const row={seq:++this.sequence,t_ms:Math.round(this.clock()-this.start),type};
    const allowed=['lesson','source','target','stock','hand','reason','quality','amount_ml','extent_mol','reaction','question','choice','correct','stage','response','complete'];
    for(const key of allowed) if(details[key]!==undefined) {
      const value=details[key];
      if(typeof value==='string')row[key]=value.slice(0,key==='response'?1000:120);
      else if(typeof value==='boolean'||(typeof value==='number'&&Number.isFinite(value))||value===null)row[key]=value;
    }
    this.events.push(row);
    if(this.events.length>3000){this.events.shift();this.dropped++;}
  }
  export() { return {schema:'hololab-learning-events-1',consent:this.enabled,local_only:true,raw_video:false,raw_landmarks:false,dropped_events:this.dropped,events:structuredClone(this.events)}; }
}
