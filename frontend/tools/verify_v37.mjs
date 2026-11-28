/** Repeat regression cases against current source. Browser drivers are development-only. */
import {spawn} from 'node:child_process';
import {mkdir,writeFile,open} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.resolve(process.env.QA_OUTPUT||path.join(root,'validation_v37'));
await mkdir(out,{recursive:true});
const commands=['qa_core_v36','qa_liquids_v36','qa_regression_v36','qa_v36','qa_transport_v37'];
const results=[];
for(const name of commands){
  console.log('START',name);
  const log=await open(path.join(out,`${name}.log`),'w');
  const start=Date.now();
  const exit=await new Promise((resolve,reject)=>{
    const child=spawn('node',[`tools/${name}.mjs`],{cwd:root,
      env:{...process.env,QA_OUTPUT:out},stdio:['ignore',log.fd,log.fd]});
    child.on('error',reject);child.on('exit',resolve);
  });
  await log.close();results.push({name,exit,seconds:(Date.now()-start)/1000});
  await writeFile(path.join(out,'browser_suite.json'),JSON.stringify({results,complete:results.length===commands.length&&results.every(x=>x.exit===0)},null,2));
  console.log(exit===0?'PASS':'FAIL',name);
  if(exit!==0){process.exitCode=1;break;}
}
