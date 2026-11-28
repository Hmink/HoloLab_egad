/** Three paired 60-second runs. Do not run other browser benchmarks concurrently. */
import {spawn} from 'node:child_process';
import {mkdir,readFile,writeFile,open} from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
if(!process.env.BENCH_BASELINE)throw Error('Set BENCH_BASELINE to the unchanged V3.6 directory');
const baseline=path.resolve(process.env.BENCH_BASELINE),out=path.join(root,'validation_v37');
await mkdir(out,{recursive:true});
const runs=[];
for(let pair=1;pair<=3;pair++){
  for(const variant of pair===2?['after','before']:['before','after']){
    console.log('START',pair,variant);
    const file=path.join(out,`benchmark-${variant}-${pair}.json`);
    const log=await open(path.join(out,`benchmark-${variant}-${pair}.log`),'w');
    const status=await new Promise((resolve,reject)=>{
      const child=spawn('node',['tools/benchmark_v37.mjs'],{cwd:root,env:{...process.env,
        BENCH_PROJECT:variant==='before'?baseline:root,BENCH_OUTPUT:file},stdio:['ignore',log.fd,log.fd]});
      child.on('error',reject);child.on('exit',resolve);
    });
    await log.close();if(status!==0)throw Error(`benchmark ${pair} ${variant} failed`);
    const report=JSON.parse(await readFile(file,'utf8'));
    runs.push({pair,variant,file:path.basename(file),render_fps:report.render_fps,
      tracking_hz:report.tracking_hz,render_interval_p95_ms:report.render_interval_p95_ms,
      sample_age_p95_ms:report.sample_age_p95_ms,physics_cpu_mean_ms:report.physics_cpu_mean_ms,
      capture_mean_ms:report.capture_mean_ms??null,preprocess_mean_ms:report.preprocess_mean_ms??null,
      model_mean_ms:report.model_mean_ms??null,duration_s:report.duration_s});
    console.log('DONE',JSON.stringify(runs.at(-1)));
  }
}
const median=a=>[...a].sort((a,b)=>a-b)[Math.floor(a.length/2)];
const aggregate=variant=>Object.fromEntries(['render_fps','tracking_hz','render_interval_p95_ms','sample_age_p95_ms','physics_cpu_mean_ms'].map(key=>
  [key,median(runs.filter(r=>r.variant===variant).map(r=>r[key]))]));
await writeFile(path.join(out,'benchmark-comparison.json'),JSON.stringify({
  complete:true,physical_camera_tested:false,human_hands_tested:false,
  cpu:os.cpus()[0]?.model,logical_cores:os.cpus().length,total_memory_gb:os.totalmem()/1024**3,
  environment:'Same shared host; Chromium 133, SwiftShader software GL; synthetic 20 FPS webcam, CPU MediaPipe; alternating paired order',
  conditions:'HD 1280x720; CV 640x360; DPR 1; render surface 1022x418; five objects with one moving programmatically; 60 seconds each',
  runs,before_median:aggregate('before'),after_median:aggregate('after'),
  limitation:'Shared-host load varies. These measurements do not establish hardware webcam accuracy or end-to-end hand latency.',
},null,2));
