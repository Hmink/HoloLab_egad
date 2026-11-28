"""Replay identical synthetic landmarks through preserved v2.1 and V3 controllers.
No detector accuracy, camera accuracy or human-study claims are made here.
"""

import json
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from chemlab.selection import Candidate, HandSelector
from lab3d.hand_input import StableHandInput
from chemlab.config import Config

frames = []
for i in range(120):
    x = 0.3 + i * 0.001
    points = [[x, 0.5, 0] for _ in range(21)]
    points[0] = [x, 0.65, 0]
    points[5] = [x - 0.06, 0.5, 0]
    points[17] = [x + 0.06, 0.5, 0]
    points[9] = [x, 0.49, 0]
    points[13] = [x + 0.02, 0.5, 0]
    distance = 0.10 if i < 8 else 0.024
    points[4] = [x - distance / 2, 0.4, 0]
    points[8] = [x + distance / 2, 0.4, 0]
    frames.append(
        dict(
            t=100 + i * 34,
            points=points,
            label="Left" if i % 2 == 0 else "Right",
            score=0.99,
        )
    )
selector = HandSelector("left")
controller = StableHandInput(Config(width=1280, height=800), "full")
old = dict(
    frames=len(frames), selected=0, control_valid=0, grab_events=0, recovery_frames=0
)
for frame in frames:
    candidate = Candidate(frame["points"], None, frame["label"], frame["score"])
    chosen = selector.choose([candidate], frame["t"] / 1000, controller.gate.closed)
    _, event = controller.update(
        chosen.points if chosen else None, 1280, 720, frame["t"] / 1000
    )
    old["selected"] += chosen is not None
    old["control_valid"] += controller.valid
    old["grab_events"] += event == "grab"
    old["recovery_frames"] += "đang bắt lại" in controller.status
out = ROOT / "validation"
out.mkdir(exist_ok=True)
(out / "controller_trace.json").write_text(json.dumps(frames), encoding="utf-8")
script = r"""
import fs from 'node:fs';
import {HandTracks,observation} from './web/src/tracks.js';
import {Interaction} from './web/src/interaction.js';
import {OneEuro} from './web/src/filters.js';
const frames=JSON.parse(fs.readFileSync('validation/controller_trace.json'));
const tracker=new HandTracks(),objects=[];
const adapter={pick:()=>({type:'inventory',stock:'beaker'}),spawn:()=>{const o={id:1,target:{x:0,y:0,z:0}};objects.push(o);return o;},
 action:()=>{},select:()=>{},toWorld:(p,z)=>({x:p.x/100,y:p.y/100,z}),move:(o,p)=>o.target=p};
const engine=new Interaction(adapter,{width:1280,height:800});let valid=0;
for(const f of frames){const p=f.points.map(([x,y,z])=>({x,y,z}));engine.update(tracker.update([observation(p,f.label,f.score,1280/720,false)],f.t),f.t);valid+=tracker.tracks[0].observed;}
const f=new OneEuro(),raw=[],smooth=[];
for(let i=0;i<90;i++){const x=.5+(i%2?.004:-.004),y=f.update(x,i*33.33);if(i>20){raw.push(x-.5);smooth.push(y-.5);}}
const rms=a=>Math.sqrt(a.reduce((s,x)=>s+x*x,0)/a.length);
let lag;for(let i=0;i<45;i++){const x=.5+i*.01;lag=x-f.update(x,3000+i*33.33);}
console.log(JSON.stringify({frames:frames.length,control_valid:valid,grab_events:engine.events.filter(e=>e.type==='grab').length,
 release_events:engine.events.filter(e=>e.type==='release').length,held_objects:[...engine.hands.values()].filter(h=>h.object).length,
 raw_jitter_rms_px_1280:rms(raw)*1280,filtered_jitter_rms_px_1280:rms(smooth)*1280,
 synthetic_ramp_filter_lag_ms:lag/.01*33.33}));
"""
new = json.loads(
    subprocess.check_output(
        ["node", "--input-type=module", "-e", script], cwd=ROOT, text=True
    )
)
report = dict(
    input="SYNTHETIC 120 frames: alternating confident handedness, same continuous landmarks",
    physical_camera_test=False,
    v21=old,
    v3=new,
)
(out / "controller_comparison.json").write_text(
    json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8"
)
print(json.dumps(report, ensure_ascii=False, indent=2))
