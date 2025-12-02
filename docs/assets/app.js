const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
function fmtDateTime(iso){
  try{const d=new Date(iso);if(Number.isNaN(d.getTime())) return iso;
    return new Intl.DateTimeFormat('pl-PL',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',timeZone:'Europe/Warsaw'}).format(d);
  }catch{return iso}
}
function setCurrentNav(){
  const path=location.pathname.replace(/\/+$/,'');
  $$('.nav-links a').forEach(a=>{
    const href=a.getAttribute('href')||'';
    if(!href||href.startsWith('http')) return;
    const norm=href.replace(/\/+$/,'');
    if(path.endsWith('/'+norm) || (norm==='index.html' && path.endsWith('/'))){
      a.setAttribute('aria-current','page');
    }
  });
}
function loadMode(){
  const mode=localStorage.getItem('mode')||'visual';
  document.documentElement.classList.toggle('minimal', mode==='minimal');
  const label=$('#modeLabel'); if(label) label.textContent=(mode==='minimal')?'Minimal':'Wizualny';
}
function toggleMode(){ localStorage.setItem('mode',(localStorage.getItem('mode')||'visual')==='minimal'?'visual':'minimal'); loadMode(); }
async function fetchJSON(path){
  const res=await fetch(path,{headers:{'Accept':'application/json'},cache:'no-store'});
  if(!res.ok) throw new Error(`HTTP ${res.status} for ${path}`);
  return await res.json();
}
window.App={$, $$, fmtDateTime, setCurrentNav, loadMode, toggleMode, fetchJSON};
