import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import './tokens.css';
import './shell.css';
import {href, isLearnRoute, parseRoute} from './lib/routes.js';
import {TopNav, LearnLayout} from './components/Layout.jsx';
import {Intro} from './pages/Intro.jsx';
import {AuthSoon, Experiments, History, Overview, Preview} from './pages/Learn.jsx';

const SAVED_KEY='hololab-saved-v38';
const PAGE_TITLES={intro:'Giới thiệu',login:'Đăng nhập',register:'Đăng ký',overview:'Tổng quan',experiments:'Thư viện thí nghiệm',history:'Lịch sử học'};
const go=h=>{if(location.hash!==h)location.hash=h;};
function useHash(){
 const [hash,setHash]=useState(location.hash);
 useEffect(()=>{const f=()=>setHash(location.hash);addEventListener('hashchange',f);return()=>removeEventListener('hashchange',f)},[]);
 return hash;
}

function Shell({api}) {
 // ?test (automated tests) without a hash starts on the 3D bench, as before.
 const testMode=new URLSearchParams(location.search).has('test');
 const hash=useHash(), route=parseRoute(hash);
 const showBench=route.name==='practice'||(testMode&&!hash);
 const [preview,setPreview]=useState(null),[mode,setMode]=useState('move');
 const [notice,setNotice]=useState(''),[libraryNotice,setLibraryNotice]=useState('');
 const [saved,setSaved]=useState(()=>{try{return JSON.parse(localStorage.getItem(SAVED_KEY)||'[]')}catch{return []}});
 const started=useRef(null), overlay=useRef(null), labTitle=useRef(document.title);
 const ready=api.lessons.filter(l=>l.status==='ready');

 const toLibrary=()=>{api.release();go(href.experiments)};
 useEffect(()=>{const b=document.getElementById('sidebar-toggle');const old=b.onclick;b.onclick=toLibrary;return()=>{b.onclick=old}},[]);

 // Entering a practice route (deep link, reload, back/forward). Explicit starts set `started` first,
 // so returning to the lesson that is already on the bench never restarts it.
 useEffect(()=>{
  if(route.name!=='practice'){api.release();return;}
  const id=route.id;
  if(started.current===id)return;
  if(id==='session'){go(href.history);return;}
  if(id==='free'){api.free();started.current=id;return;}
  if(ready.some(l=>l.id===id)){api.start(id);started.current=id;return;}
  setLibraryNotice(`Không tìm thấy bài thực hành “${id}”. Hãy chọn một bài trong thư viện.`);
  go(href.experiments);
 },[route.name,route.id]);

 useEffect(()=>{
  if(overlay.current)overlay.current.scrollTop=0;
  document.title=showBench?labTitle.current:`${PAGE_TITLES[route.name]||'HoloLab'} · HoloLab`;
  if(route.name!=='experiments')setLibraryNotice('');
 },[route.name,showBench]);

 const choose=m=>{api.setMode(m);setMode(m)};
 const start=id=>{api.start(id);started.current=id;setPreview(null);go(href.practice(id))};
 const free=()=>{api.free();started.current='free';go(href.practice('free'))};
 const save=()=>{try{const next=[{name:api.title(),date:new Date().toLocaleString('vi-VN'),data:api.snapshot()},...saved].slice(0,12);localStorage.setItem(SAVED_KEY,JSON.stringify(next));setSaved(next);setNotice('Đã lưu trên trình duyệt này.')}catch(e){setNotice('Không lưu được: '+e.message)}};
 const run=async fn=>{try{await fn()}catch(e){setNotice(e.message)}};
 const openSaved=s=>run(async()=>{await api.restore(s.data);started.current='session';go(href.practice('session'))});
 const help=()=>document.getElementById('mouse-help').showModal();

 let page=null;
 if(route.name==='overview')page=<Overview lessons={api.lessons} saved={saved} onOpenSaved={openSaved}/>;
 if(route.name==='experiments')page=<Experiments lessons={api.lessons} stocks={api.stocks||[]} saved={saved} onPreview={setPreview} onOpenSaved={openSaved} onFree={free} notice={libraryNotice}/>;
 if(route.name==='history')page=<History saved={saved} onOpenSaved={openSaved}/>;

 return <><nav className="lab-mouse-toolbar" aria-label="Điều khiển bằng chuột"><button onClick={toLibrary}>‹ Thư viện</button><div className="mode-switch">{[['move','Di chuyển'],['rotate','Nghiêng / rót'],['depth','Gần / xa']].map(([v,t])=><button key={v} aria-pressed={mode===v} onClick={()=>choose(v)}>{t}</button>)}</div><button onClick={()=>api.upright()}>Dựng thẳng</button><button onClick={()=>{const panel=document.getElementById("learning-panel");panel.open=true;panel.scrollIntoView({behavior:"smooth",block:"start"})}}>EGAD · Giải thích</button><button onClick={save}>Lưu</button><button onClick={()=>run(api.undo)}>Hoàn tác</button><button onClick={()=>run(api.redo)}>Làm lại</button><button onClick={()=>api.reset()}>Bắt đầu lại</button><button onClick={()=>api.remove()}>Xóa vật</button><button onClick={()=>document.getElementById('mouse-help').showModal()}>?</button></nav><div className="mouse-hint">{mode==='move'?'Giữ chuột trái trên bình để kéo · Thả chuột: bình rơi':mode==='rotate'?'Giữ chuột và kéo ngang để nghiêng bình · Kéo dọc để xoay trước/sau':'Giữ chuột và kéo lên/xuống để đổi chiều sâu'} · Chuột phải + kéo: nghiêng nhanh</div>{notice&&<div className="mouse-notice" role="status" onClick={()=>setNotice('')}>{notice} ×</div>}
 <dialog id="mouse-help"><h2>Thực hành bằng chuột</h2><p>Chọn bài → chọn chế độ → giữ chuột trên dụng cụ.</p><ul><li>Di chuyển: kéo bình đến vị trí mong muốn.</li><li>Nghiêng / rót: kéo ngang khoảng 350 px để dốc ngược. Giữ chuột để tiếp tục rót.</li><li>Gần / xa: kéo dọc để căn miệng bình theo chiều sâu.</li><li>Chỉ rót vào bình nhận khi dòng chảy đi qua miệng bình; lệch miệng sẽ đổ ra bàn.</li><li>Thả chuột trả vật về hệ vật lý. Camera không cần bật.</li><li>Lưu giữ phiên trong trình duyệt; xuất JSON trong bảng công cụ để chuyển máy.</li></ul><button onClick={()=>document.getElementById('mouse-help').close()}>Đã hiểu</button></dialog>
 {!showBench&&<div className="hl-app" ref={overlay}>
  <TopNav route={route}/>
  {route.name==='intro'&&<Intro lessonCount={ready.length} onHelp={help}/>}
  {(route.name==='login'||route.name==='register')&&<AuthSoon mode={route.name}/>}
  {isLearnRoute(route)&&<LearnLayout route={route}>{page}</LearnLayout>}
 </div>}
 {preview&&<Preview lesson={preview} index={ready.indexOf(preview)} onClose={()=>setPreview(null)} onStart={()=>start(preview.id)}/>}</>;
}
export function initMouseShell(api){const host=document.createElement('div');host.id='mouse-shell';document.querySelector('main').prepend(host);createRoot(host).render(<Shell api={api}/>);document.body.classList.add('mouse-first','sidebar-closed');}
