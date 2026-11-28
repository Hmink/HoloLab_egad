import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {createPortal} from 'react-dom';
import './tokens.css';
import './shell.css';
import {href, isLearnRoute, parseRoute} from './lib/routes.js';
import {pageTurns, subscribeChat} from './lib/egad-chat.js';
import {browserHistory} from './lib/history.js';
import {TopNav, LearnLayout} from './components/Layout.jsx';
import {LabToolbar} from './components/LabToolbar.jsx';
import {EgadChat} from './components/EgadChat.jsx';
import {Intro} from './pages/Intro.jsx';
import {Experiments, History, Overview, Preview} from './pages/Learn.jsx';
import {LoginPage, RegisterPage} from './pages/Auth.jsx';
import {currentUser, logout} from './lib/auth.js';

const SAVED_KEY='hololab-saved-v38', EGAD_KEY='hololab-egad-open';
const PAGE_TITLES={intro:'Giới thiệu',login:'Đăng nhập',register:'Đăng ký',overview:'Tổng quan',experiments:'Thư viện thí nghiệm',history:'Lịch sử học'};
// Below SHARE_MIN the lab column is too narrow for the stock panel AND the EGAD column: they take turns.
// Under 900px EGAD is a drawer over the page, so nothing has to give way.
const SHARE_MIN=1360, DRAWER_MAX=900;
const mustShare=()=>innerWidth<SHARE_MIN&&innerWidth>DRAWER_MAX;
const suppliesOpen=()=>!document.body.classList.contains('supplies-closed');
const readPref=()=>{try{const v=localStorage.getItem(EGAD_KEY);if(v==='1'||v==='0')return v==='1'}catch{}return innerWidth>=SHARE_MIN};
const writePref=v=>{try{localStorage.setItem(EGAD_KEY,v?'1':'0')}catch{}};
function useHash(){
 const [hash,setHash]=useState(location.hash);
 useEffect(()=>{const f=()=>setHash(location.hash);addEventListener('hashchange',f);return()=>removeEventListener('hashchange',f)},[]);
 return [hash,setHash];
}

function Shell({api,dock}) {
 // ?test (automated tests) without a hash starts on the 3D bench, as before.
 const testMode=new URLSearchParams(location.search).has('test');
 const [hash,setHash]=useHash(), route=parseRoute(hash);
 // Navigate and render in the same click (hashchange alone arrives a task later, behind a 3D frame).
 const go=h=>{if(location.hash!==h)location.hash=h;setHash(h)};
 const showBench=route.name==='practice'||(testMode&&!hash);
 const [preview,setPreview]=useState(null),[mode,setMode]=useState('move');
 const [notice,setNotice]=useState(''),[libraryNotice,setLibraryNotice]=useState('');
 // Signed-in user from GET /api/v1/auth/me (session cookie). Page memory only, never written to storage.
 const [account,setAccount]=useState({enabled:null,user:null});
 useEffect(()=>{currentUser().then(setAccount)},[]);
 const [saved,setSaved]=useState(()=>{try{return JSON.parse(localStorage.getItem(SAVED_KEY)||'[]')}catch{return []}});
 const [egadOpen,setEgadOpen]=useState(readPref);
 const [bench,setBench]=useState(()=>({title:api.title(),lesson:api.lesson()}));
 const [,setTurnsVersion]=useState(0);
 const started=useRef(null), overlay=useRef(null), labTitle=useRef(document.title);
 const ready=api.lessons.filter(l=>l.status==='ready');
 const syncBench=()=>setBench({title:api.title(),lesson:api.lesson()});

 const toLibrary=()=>{api.release();go(href.experiments)};
 useEffect(()=>{const b=document.getElementById('sidebar-toggle');const old=b.onclick;b.onclick=toLibrary;return()=>{b.onclick=old}},[]);
 // The lab writes the lesson title into #lab-title whenever the bench changes (lesson, restore, free bench).
 useEffect(()=>{const t=document.getElementById('lab-title');const o=new MutationObserver(syncBench);o.observe(t,{childList:true,characterData:true,subtree:true});return()=>o.disconnect()},[]);
 useEffect(()=>subscribeChat(()=>setTurnsVersion(v=>v+1)),[]);
 // The EGAD column stays as it is while the library overlay covers the bench: going back and forth
 // must not resize the WebGL canvas each time. The canvas follows it through the lab's ResizeObserver.
 useEffect(()=>{document.body.classList.toggle('egad-open',egadOpen)},[egadOpen]);
 const egadRef=useRef(egadOpen);egadRef.current=egadOpen;
 useEffect(()=>{
  // Phones: the stock column would leave the 3D bench ~150px wide, so it starts folded ("Kho bên phải" reopens it).
  if(suppliesOpen()&&(innerWidth<=600||(egadOpen&&mustShare())))document.getElementById('supplies-toggle')?.click();
 },[]);
 // Opening the stock panel on a mid-size screen folds EGAD away (and the reverse in toggleEgad).
 useEffect(()=>{let was=suppliesOpen();const o=new MutationObserver(()=>{const now=suppliesOpen();if(now&&!was&&egadRef.current&&mustShare())setEgadOpen(false);was=now});o.observe(document.body,{attributes:true,attributeFilter:['class']});return()=>o.disconnect()},[]);

 // Entering a practice route (deep link, reload, back/forward). Explicit starts set `started` first,
 // so returning to the lesson that is already on the bench never restarts it.
 useEffect(()=>{
  if(route.name!=='practice'){api.release();return;}
  const id=route.id;
  if(started.current===id)return;
  if(id==='session'){go(href.history);return;}
  if(id==='free'){api.free();started.current=id;syncBench();return;}
  if(ready.some(l=>l.id===id)){api.start(id);started.current=id;syncBench();return;}
  setLibraryNotice(`Không tìm thấy bài thực hành “${id}”. Hãy chọn một bài trong thư viện.`);
  go(href.experiments);
 },[route.name,route.id]);

 useEffect(()=>{
  if(overlay.current)overlay.current.scrollTop=0;
  document.title=showBench?(bench.lesson?`${bench.title} · HoloLab`:labTitle.current):`${PAGE_TITLES[route.name]||'HoloLab'} · HoloLab`;
  if(route.name!=='experiments')setLibraryNotice('');
 },[route.name,showBench,bench.title]);

 const choose=m=>{api.setMode(m);setMode(m)};
 const start=id=>{api.start(id);started.current=id;syncBench();setPreview(null);go(href.practice(id))};
 const free=()=>{api.free();started.current='free';syncBench();go(href.practice('free'))};
 const save=()=>{try{const next=[{name:api.title(),date:new Date().toLocaleString('vi-VN'),data:api.snapshot()},...saved].slice(0,12);localStorage.setItem(SAVED_KEY,JSON.stringify(next));setSaved(next);setNotice('Đã lưu trên trình duyệt này.')}catch(e){setNotice('Không lưu được: '+e.message)}};
 const run=async fn=>{try{await fn()}catch(e){setNotice(e.message)}};
 const openSaved=s=>run(async()=>{await api.restore(s.data);started.current='session';syncBench();go(href.practice('session'))});
 const help=()=>document.getElementById('mouse-help').showModal();
 const toggleEgad=()=>{const next=!egadRef.current;writePref(next);if(next&&mustShare()&&suppliesOpen())document.getElementById('supplies-toggle')?.click();setEgadOpen(next)};
 const openRubric=()=>{const panel=document.getElementById('learning-panel');panel.open=true;panel.scrollIntoView({behavior:'smooth',block:'start'})};
 const lesson=ready.find(l=>l.id===bench.lesson)||null;

 let page=null;
 const signedIn=user=>{setAccount({enabled:true,user});go(href.overview)};
 const signOut=async()=>{try{await logout();setAccount(a=>({...a,user:null}));go(href.intro)}catch(e){setNotice('Chưa đăng xuất được: '+e.message)}};
 if(route.name==='overview')page=<Overview lessons={api.lessons} saved={saved} onOpenSaved={openSaved} user={account.user}/>;
 if(route.name==='experiments')page=<Experiments lessons={api.lessons} stocks={api.stocks||[]} saved={saved} onPreview={setPreview} onOpenSaved={openSaved} onFree={free} notice={libraryNotice}/>;
 if(route.name==='history')page=<History data={browserHistory({saved,lessons:api.lessons,turns:pageTurns()})} onOpenSaved={openSaved}/>;

 return <>
 <LabToolbar title={bench.title} mode={mode} onMode={choose} onLibrary={toLibrary} onUpright={()=>api.upright()} onSave={save}
  onUndo={()=>run(api.undo)} onRedo={()=>run(api.redo)} onReset={()=>api.reset()} onRemove={()=>api.remove()} onHelp={help}
  egadOpen={egadOpen} onEgad={toggleEgad}/>
 {notice&&<div className="mouse-notice" role="status" onClick={()=>setNotice('')}>{notice} ×</div>}
 <dialog id="mouse-help"><h2>Thực hành bằng chuột</h2><p>Chọn bài → chọn chế độ → giữ chuột trên dụng cụ.</p><ul><li>Di chuyển: kéo bình đến vị trí mong muốn.</li><li>Nghiêng / rót: kéo ngang khoảng 350 px để dốc ngược. Giữ chuột để tiếp tục rót.</li><li>Gần / xa: kéo dọc để căn miệng bình theo chiều sâu.</li><li>Chỉ rót vào bình nhận khi dòng chảy đi qua miệng bình; lệch miệng sẽ đổ ra bàn.</li><li>Thả chuột trả vật về hệ vật lý. Camera không cần bật.</li><li>Lưu giữ phiên trong trình duyệt; xuất JSON trong bảng công cụ để chuyển máy.</li><li>EGAD ở khung bên phải: trả lời câu hỏi của bài bằng lời của bạn. Bấm “EGAD” trên thanh công cụ để mở hoặc thu gọn.</li></ul><button onClick={()=>document.getElementById('mouse-help').close()}>Đã hiểu</button></dialog>
 {egadOpen&&createPortal(<EgadChat lesson={lesson} onClose={toggleEgad} onOpenRubric={openRubric} onLibrary={toLibrary}/>,dock)}
 {!showBench&&<div className="hl-app" ref={overlay}>
  <TopNav route={route} user={account.user} onSignOut={signOut}/>
  {notice&&!showBench&&<div className="hl-app-notice" role="status" onClick={()=>setNotice('')}>{notice} ×</div>}
  {route.name==='intro'&&<Intro lessonCount={ready.length} onHelp={help}/>}
  {route.name==='login'&&<LoginPage onSignedIn={signedIn}/>}
  {route.name==='register'&&<RegisterPage onSignedIn={signedIn}/>}
  {isLearnRoute(route)&&<LearnLayout route={route}>{page}</LearnLayout>}
 </div>}
 {preview&&<Preview lesson={preview} index={ready.indexOf(preview)} onClose={()=>setPreview(null)} onStart={()=>start(preview.id)}/>}</>;
}
export function initMouseShell(api){
 const host=document.createElement('div');host.id='mouse-shell';document.querySelector('main').prepend(host);
 // Right-hand EGAD column of the practice screen: its own grid column, never on top of the 3D canvas.
 const dock=document.createElement('aside');dock.id='egad-dock';dock.setAttribute('aria-label','Trợ lý EGAD');document.body.append(dock);
 createRoot(host).render(<Shell api={api} dock={dock}/>);
 document.body.classList.add('mouse-first','sidebar-closed');
}
