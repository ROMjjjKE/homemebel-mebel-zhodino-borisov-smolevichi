/* ===== Home Мебель: общие скрипты ===== */



/* ===== бургер ===== */
(function(){
  var b=document.getElementById('burger'), n=document.getElementById('nav');
  if(!b) return;
  b.addEventListener('click',function(){ n.classList.toggle('open'); });
  n.querySelectorAll('a').forEach(function(a){ a.addEventListener('click',function(){ n.classList.remove('open'); }); });
})();

/* ===== reveal (polling) ===== */
document.body.classList.add('js');
var revealedAll=false;
function scanReveal(){
  if(revealedAll) return;
  var els=document.querySelectorAll('.fx:not(.in)');
  var vh=window.innerHeight||800;
  for(var i=0;i<els.length;i++){
    var r=els[i].getBoundingClientRect();
    if(r.top<vh-40&&r.bottom>0) els[i].classList.add('in');
  }
  if(!els.length) revealedAll=true;
}
setInterval(scanReveal,400); scanReveal();

/* ===== заявка: шортлист в localStorage ===== */
var QKEY='hm_quote_v1';
function qGet(){ try{ return JSON.parse(localStorage.getItem(QKEY))||[] }catch(e){ return [] } }
function qAdd(name,cat){
  var q=qGet();
  if(!q.some(function(x){return x.n===name})) q.push({n:name,c:cat});
  localStorage.setItem(QKEY,JSON.stringify(q));
  qRender();
}
function qDel(name){
  var q=qGet().filter(function(x){return x.n!==name});
  localStorage.setItem(QKEY,JSON.stringify(q));
  qRender();
}
function qRender(){
  var q=qGet();
  var list=document.getElementById('qlist'); if(!list) return;
  var cnt=document.getElementById('qcnt'), qn=document.querySelectorAll('.qn'), qb=document.getElementById('qbtn');
  if(q.length){
    list.style.display='block';
    list.innerHTML=q.map(function(x){return '<div class="qi"><span>'+x.n+'</span><button data-d="'+encodeURIComponent(x.n)+'" title="Убрать">×</button></div>'}).join('');
    list.querySelectorAll('button').forEach(function(b){ b.addEventListener('click',function(){ qDel(decodeURIComponent(b.getAttribute('data-d'))); }); });
    if(cnt) cnt.style.display='block', cnt.textContent=q.length;
    qn.forEach(function(el){ el.style.display='inline-block'; el.textContent=q.length; });
    if(qb) qb.style.display='flex';
  } else {
    list.style.display='none';
    if(cnt) cnt.style.display='none';
    qn.forEach(function(el){ el.style.display='none'; });
    if(qb) qb.style.display='none';
  }
}

/* ===== модалка заявки ===== */
(function(){
  var m=document.getElementById('qmodal'); if(!m) return;
  var openBtns=document.querySelectorAll('[data-q]');
  openBtns.forEach(function(b){
    b.addEventListener('click',function(){
      var pre=b.getAttribute('data-q');
      var sel=m.querySelector('select[name=type]');
      if(sel&&pre){
        for(var i=0;i<sel.options.length;i++) if(sel.options[i].value===pre||sel.options[i].text===pre){ sel.selectedIndex=i; break; }
      }
      m.classList.add('on'); qRender();
    });
  });
  m.querySelector('.mx').addEventListener('click',function(){ m.classList.remove('on'); });
  m.addEventListener('click',function(e){ if(e.target===m) m.classList.remove('on'); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') m.classList.remove('on'); });
  qRender();
})();

/* ===== карточки каталога: кнопки ===== */
function bindCatalog(){
  document.querySelectorAll('.qadd').forEach(function(b){
    b.addEventListener('click',function(){
      qAdd(b.getAttribute('data-n'),b.getAttribute('data-c'));
      var t=b.textContent; b.textContent='В заявке ✓';
      setTimeout(function(){ b.textContent=t; },1600);
    });
  });
}

/* ===== все формы заявок ===== */
document.querySelectorAll('form.jform').forEach(function(f){
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var ok=true;
    ['name','tel'].forEach(function(nm){
      var el=f.querySelector('[name='+nm+']');
      if(!el.value.trim()){ ok=false; el.style.borderColor='#B33A1E'; }
      else el.style.borderColor='';
    });
    if(!ok) return;
    var fok=f.querySelector('.ok-msg');
    if(fok) fok.style.display='block';
    localStorage.removeItem(QKEY); qRender();
    f.reset();
  });
});

/* ===== SVG-арт товара (параметрический) ===== */
var PAL=[
 ['#7C2D3E','#9A4556','#5E2230'], // вино
 ['#5B6269','#7A838B','#3E444A'], // графит
 ['#B49B7A','#CBB694','#94815F'], // беж
 ['#4A5D52','#5F7568','#37453D'], // зелень
 ['#31465C','#42597A','#24344A'], // синий
 ['#7A5638','#946D49','#5E4029']  // орех
];
function art(type,ci){
  var c=PAL[ci%PAL.length], a=c[0], b=c[1], d=c[2], w='#C8C2BC', fr='#B7AE9F';
  function base(t){ return '<rect width="240" height="150" fill="none"/>' }
  if(type==='sofa') return base()+'<g><rect x="30" y="66" width="180" height="34" rx="8" fill="'+a+'"/><rect x="30" y="52" width="180" height="20" rx="8" fill="'+b+'"/><rect x="22" y="62" width="18" height="44" rx="7" fill="'+d+'"/><rect x="200" y="62" width="18" height="44" rx="7" fill="'+d+'"/><rect x="34" y="98" width="12" height="18" rx="4" fill="'+fr+'"/><rect x="194" y="98" width="12" height="18" rx="4" fill="'+fr+'"/><rect x="52" y="72" width="60" height="22" rx="6" fill="'+d+'"/><rect x="128" y="72" width="60" height="22" rx="6" fill="'+d+'"/></g>';
  if(type==='corner') return base()+'<g><rect x="20" y="60" width="200" height="40" rx="8" fill="'+a+'"/><rect x="20" y="46" width="200" height="20" rx="8" fill="'+b+'"/><rect x="150" y="86" width="70" height="34" rx="8" fill="'+d+'"/><rect x="12" y="56" width="16" height="48" rx="7" fill="'+d+'"/><rect x="24" y="98" width="12" height="18" rx="4" fill="'+fr+'"/><rect x="148" y="112" width="12" height="14" rx="4" fill="'+fr+'"/><rect x="40" y="66" width="50" height="22" rx="6" fill="'+d+'"/><rect x="100" y="66" width="40" height="22" rx="6" fill="'+d+'"/></g>';
  if(type==='bed') return base()+'<g><rect x="30" y="58" width="180" height="14" rx="4" fill="'+d+'"/><rect x="24" y="30" width="16" height="46" rx="6" fill="'+d+'"/><rect x="200" y="30" width="16" height="46" rx="6" fill="'+d+'"/><rect x="36" y="70" width="168" height="26" rx="6" fill="'+a+'"/><rect x="36" y="60" width="60" height="12" rx="6" fill="'+w+'"/><rect x="40" y="94" width="10" height="16" rx="4" fill="'+fr+'"/><rect x="190" y="94" width="10" height="16" rx="4" fill="'+fr+'"/><rect x="104" y="60" width="46" height="12" rx="6" fill="'+w+'"/></g>';
  if(type==='kitchen') return base()+'<g><rect x="24" y="34" width="192" height="76" rx="4" fill="'+a+'"/><line x1="40" y1="34" x2="40" y2="110" stroke="'+d+'" stroke-width="2"/><line x1="88" y1="34" x2="88" y2="110" stroke="'+d+'" stroke-width="2"/><line x1="136" y1="34" x2="136" y2="110" stroke="'+d+'" stroke-width="2"/><line x1="184" y1="34" x2="184" y2="110" stroke="'+d+'" stroke-width="2"/><rect x="28" y="70" width="8" height="6" fill="'+fr+'"/><rect x="76" y="70" width="8" height="6" fill="'+fr+'"/><rect x="124" y="70" width="8" height="6" fill="'+fr+'"/><rect x="172" y="70" width="8" height="6" fill="'+fr+'"/><rect x="30" y="110" width="180" height="10" fill="'+d+'"/><rect x="48" y="20" width="48" height="14" rx="3" fill="#3E444A"/><rect x="48" y="16" width="48" height="4" rx="2" fill="'+fr+'"/></g>';
  if(type==='wardrobe') return base()+'<g><rect x="48" y="20" width="144" height="94" rx="4" fill="'+a+'"/><line x1="120" y1="20" x2="120" y2="114" stroke="'+d+'" stroke-width="2"/><rect x="52" y="28" width="60" height="78" fill="'+b+'" opacity=".55"/><rect x="124" y="28" width="60" height="78" fill="'+b+'" opacity=".35"/><rect x="56" y="70" width="4" height="14" fill="'+fr+'"/><rect x="178" y="70" width="4" height="14" fill="'+fr+'"/><rect x="44" y="114" width="152" height="8" fill="'+d+'"/><rect x="70" y="122" width="14" height="8" rx="3" fill="'+fr+'"/><rect x="156" y="122" width="14" height="8" rx="3" fill="'+fr+'"/></g>';
  if(type==='prihozhie') return base()+'<g><rect x="36" y="24" width="70" height="70" rx="4" fill="'+a+'"/><rect x="40" y="30" width="28" height="58" fill="'+b+'" opacity=".5"/><rect x="74" y="30" width="28" height="58" fill="'+b+'" opacity=".3"/><rect x="116" y="24" width="88" height="70" rx="4" fill="'+d+'"/><rect x="120" y="30" width="36" height="58" fill="'+b+'" opacity=".25"/><rect x="160" y="30" width="40" height="58" fill="#B8C4CC" opacity=".35"/><rect x="40" y="94" width="164" height="9" fill="'+d+'"/><rect x="46" y="103" width="10" height="12" rx="3" fill="'+fr+'"/><rect x="184" y="103" width="10" height="12" rx="3" fill="'+fr+'"/><circle cx="80" cy="18" r="10" fill="#B8C4CC" opacity=".5"/><path d="M80 30 L62 54" stroke="'+fr+'" stroke-width="2"/></g>';
  if(type==='kids') return base()+'<g><rect x="30" y="30" width="90" height="60" rx="5" fill="'+a+'"/><rect x="34" y="36" width="36" height="48" fill="'+b+'" opacity=".45"/><rect x="76" y="36" width="40" height="48" fill="'+b+'" opacity=".28"/><rect x="36" y="94" width="8" height="20" rx="3" fill="'+fr+'"/><rect x="106" y="94" width="8" height="20" rx="3" fill="'+fr+'"/><rect x="140" y="52" width="70" height="38" rx="6" fill="'+d+'"/><rect x="146" y="58" width="58" height="14" rx="4" fill="'+a+'"/><circle cx="152" cy="102" r="9" fill="'+fr+'"/><circle cx="198" cy="102" r="9" fill="'+fr+'"/><rect x="132" y="60" width="8" height="4" fill="'+fr+'"/></g>';
  if(type==='table') return base()+'<g><rect x="30" y="66" width="180" height="10" rx="3" fill="'+a+'"/><rect x="38" y="76" width="10" height="42" fill="'+d+'"/><rect x="192" y="76" width="10" height="42" fill="'+d+'"/><rect x="110" y="76" width="10" height="42" fill="'+d+'"/><rect x="70" y="88" width="100" height="7" rx="3" fill="'+b+'"/><rect x="70" y="99" width="100" height="7" rx="3" fill="'+b+'"/></g>';
  if(type==='chair') return base()+'<g><rect x="86" y="30" width="68" height="44" rx="8" fill="'+a+'"/><rect x="90" y="74" width="60" height="10" rx="3" fill="'+b+'"/><rect x="94" y="84" width="8" height="34" rx="3" fill="'+d+'"/><rect x="148" y="84" width="8" height="34" rx="3" fill="'+d+'"/><rect x="90" y="106" width="60" height="10" rx="3" fill="'+b+'"/><rect x="80" y="118" width="34" height="8" rx="3" fill="'+fr+'"/><rect x="126" y="118" width="34" height="8" rx="3" fill="'+fr+'"/></g>';
  if(type==='mattress') return base()+'<g><rect x="26" y="70" width="188" height="34" rx="12" fill="'+a+'"/><rect x="26" y="76" width="188" height="6" fill="'+b+'" opacity=".6"/><rect x="30" y="104" width="180" height="7" fill="'+d+'"/><rect x="38" y="111" width="10" height="14" rx="3" fill="'+fr+'"/><rect x="192" y="111" width="10" height="14" rx="3" fill="'+fr+'"/><path d="M60 62 c10-14 26-14 36 0 M110 62 c10-14 26-14 36 0" stroke="'+b+'" stroke-width="2.4" fill="none"/><text x="120" y="52" fill="'+b+'" font-size="10" font-family="monospace" text-anchor="middle">ECO</text></g>';
  if(type==='dresser') return base()+'<g><rect x="52" y="30" width="136" height="64" rx="4" fill="'+a+'"/><line x1="52" y1="62" x2="188" y2="62" stroke="'+d+'" stroke-width="2"/><line x1="120" y1="30" x2="120" y2="62" stroke="'+d+'" stroke-width="2"/><rect x="62" y="44" width="14" height="4" fill="'+fr+'"/><rect x="86" y="44" width="14" height="4" fill="'+fr+'"/><rect x="130" y="44" width="14" height="4" fill="'+fr+'"/><rect x="154" y="44" width="14" height="4" fill="'+fr+'"/><rect x="80" y="84" width="80" height="10" fill="'+d+'"/><rect x="46" y="94" width="148" height="8" fill="'+d+'"/><rect x="60" y="102" width="10" height="14" rx="3" fill="'+fr+'"/><rect x="170" y="102" width="10" height="14" rx="3" fill="'+fr+'"/></g>';
  return base();
}

/* ===== рендер каталога ===== */
var STEP=12;
function renderCatalog(){
  var grid=document.getElementById('pgrid'); if(!grid) return;
  var data=window.PRODUCTS||[];
  var shown=grid.getAttribute('data-shown')? +grid.getAttribute('data-shown'): STEP;
  /* фильтр */
  var act=document.querySelector('.chip.on');
  var sup=act?act.getAttribute('data-f'):'all';
  var items=data.filter(function(p){ return sup==='all'||p.s===sup; });
  var html='';
  items.slice(0,shown).forEach(function(p){
    var supp=window.SUPPLIERS&&window.SUPPLIERS[p.s]?window.SUPPLIERS[p.s]:{n:p.s,u:'#'};
    html+='<article class="pcard fx in'+(p.hit?' hit-flag':'')+'">'
      +(p.hit?'<span class="hit">ХИТ</span>':'')
      +'<div class="art"><svg viewBox="0 0 240 150">'+art(p.t,p.ci||0)+'</svg></div>'
      +'<div class="sup">'+supp.n+'</div>'
      +'<h3>'+p.n+'</h3>'
      +'<div class="spec">'+p.d+'</div>'
      +'<div class="prow"><div class="price">от '+p.pr+' <small>руб</small></div></div>'
      +'<div class="acts">'
      +'<button class="btn btn-acc btn-sm qadd" data-n="'+p.n+'" data-c="'+window.CATNAME+'">В заявку</button>'
      +'<a class="out" href="'+supp.u+'" target="_blank" rel="noopener" title="Сайт поставщика: '+supp.n+'">↗</a>'
      +'</div></article>';
  });
  grid.innerHTML=html;
  bindCatalog();
  var more=document.getElementById('morebtn');
  if(more) more.style.display= shown>=items.length?'none':'inline-flex';
  var cnt=document.getElementById('pcnt');
  if(cnt) cnt.textContent=items.length;
}
document.addEventListener('click',function(e){
  var c=e.target.closest('.chip'); if(!c) return;
  document.querySelectorAll('.chip').forEach(function(x){x.classList.remove('on')});
  c.classList.add('on');
  var grid=document.getElementById('pgrid');
  if(grid) grid.setAttribute('data-shown',STEP);
  renderCatalog();
});
var mb=document.getElementById('morebtn');
if(mb) mb.addEventListener('click',function(){
  var grid=document.getElementById('pgrid');
  grid.setAttribute('data-shown',+grid.getAttribute('data-shown')+STEP);
  renderCatalog();
});

/* ===== чертёж шкафа (scroll) ===== */
(function(){
  var sec=document.getElementById('bp');
  if(!sec) return;
  var ls=[].slice.call(sec.querySelectorAll('.bp-l'));
  var chalk=document.getElementById('bp-chalk');
  var N=ls.length-1;
  function upd(){
    var r=sec.getBoundingClientRect();
    var total=sec.offsetHeight-innerHeight;
    var p=Math.min(1,Math.max(0,(-r.top)/total));
    var pos=p*N, idx=Math.min(N,Math.floor(pos)), fr=pos-idx;
    for(var k=0;k<ls.length;k++){
      var el=ls[k];
      if(k===0){ el.style.opacity=1; continue; }
      var t=Math.min(1,Math.max(0,pos-(k-1)));
      if(k<ls.length-1){ el.style.clipPath='inset(0 0 '+((1-t)*100).toFixed(2)+'% 0)'; el.style.opacity=1; }
      else { el.style.clipPath='circle('+(t*65).toFixed(2)+'% at 50% 45%)'; el.style.opacity=1; }
    }
    var ck=(idx>=0&&idx<N-1&&fr>0.04&&fr<0.96);
    chalk.style.opacity=ck?'1':'0';
    if(ck) chalk.style.top=(fr*100).toFixed(1)+'%';
  }
  /* поллинг: надёжно и в headless-тестах, и при программном скролле */
  var lastTop=1e9;
  addEventListener('scroll',upd,{passive:true});
  setInterval(function(){
    var t=sec.getBoundingClientRect().top;
    if(Math.abs(t-lastTop)>1){ lastTop=t; upd(); }
  },120);
  window.__bpUpd=upd;
  upd();
})();
