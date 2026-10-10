/* ============ TRUYỆN TRANH ============ */
function panel(p){const cs=p[1].split(',').map(s=>{const[k,x,po,m]=s.split(':');return{k,x:+x,po,m:m||'happy'}});
 return `<div class="stage pn" style="background:${p[0]}"><span class="cl">☁️</span><div class="ground"></div>${[...p[3]].filter(e=>e!=='\uFE0F').map((e,i)=>`<span class="prop" style="left:${38+i*14}%;top:${12+(i%2)*18}%;animation-delay:${i*.4}s">${e}</span>`).join('')}
 ${cs.map(c=>`<div class="actor" style="left:${c.x}%;--h:${c.k==='me'?1:CAST[c.k].h};z-index:${c.k==='me'?6:3}">${char(c.k,c.po,c.m)}</div>`).join('')}</div>`}
function comic(){app.innerHTML=`<h2>Truyện tranh của Hero</h2><div class="grid">${COMICS.map(c=>{const lk=c.p&&S.plan!=='premium';
 return `<button class="card ${lk?'lock':''}" data-c="${c.id}"><div class="thumb" style="background:${c.pn[0][0]}">${c.p?`<i class="pm">${lk?'🔒':'👑'}</i>`:''}<span>${c.e}</span></div><div class="t"><h3>${c.t}</h3><p>${lk?'Cần gói Premium':'4 khung tranh'}</p></div></button>`}).join('')}</div>`;
 $$('.card[data-c]').forEach(b=>b.onclick=()=>{const c=COMICS.find(x=>x.id===b.dataset.c);c.p&&S.plan!=='premium'?plans():readC(c,0)})}
function readC(c,i){view='comic';Voice.stop();shell();const p=c.pn[i],last=i===c.pn.length-1,l=LESSONS.find(x=>x.id===c.link);if(last)track('comics');
 app.innerHTML=`<button class="back" id="bk">← Truyện tranh</button><div class="cnt">${c.t} · Khung ${i+1}/${c.pn.length}</div>${panel(p)}
 <div class="say"><span>${p[2]}</span><span class="tools"><button id="rd" aria-label="Đọc">🔊</button></span></div>
 <div class="pg"><button class="btn ghost" id="pv" ${i?'':'disabled'}>◀ Trước</button>${last?`<button class="btn sun" id="ls">🎮 Chơi bài: ${l.t}</button>`:'<button class="btn" id="nx">Tiếp ▶</button>'}</div>`;
 $('#bk').onclick=()=>go('comic');$('#rd').onclick=()=>Voice.speak(p[2]);setTimeout(()=>Voice.speak(p[2]),300);
 if(i)$('#pv').onclick=()=>readC(c,i-1);if(last)$('#ls').onclick=()=>locked(l)?plans():play(l);else $('#nx').onclick=()=>readC(c,i+1)}

/* ============ BỘ THẺ ============ */
const code=l=>'HERO-'+l.id.toUpperCase(),good=l=>l.sc[0][3][0],bad=l=>l.sc[0][4][0];
function fc(l){const c=cat(l.c);if(locked(l))return `<div class="fc" data-lock="1"><div class="fi"><div class="ff fr" style="background:#B8C0D6"><div class="e">🔒</div><h3>${l.t}</h3><small>Thẻ Premium</small></div></div></div>`;
 return `<div class="fc"><div class="fi"><div class="ff fr" style="background:${c.c}"><div class="e">${l.e}</div><h3>${l.t}</h3><small>${c.n}</small></div>
 <div class="ff bk"><b>✅ NÊN LÀM</b>${good(l)}<b>❌ KHÔNG NÊN</b>${bad(l)}<b>MÃ THẺ: ${code(l)}</b></div></div></div>`}
function cardsV(){app.innerHTML=`<h2>Bộ thẻ kỹ năng sống</h2><p class="note">Chạm vào thẻ để lật. In bộ thẻ ra giấy để bé học cùng bố mẹ, rồi nhập mã trên thẻ để vào đúng bài học trong app.</p>
 <div class="panel"><div class="inp"><input id="cd" placeholder="Nhập mã trên thẻ, ví dụ HERO-TAY"><button class="btn" id="cg">Mở bài</button><button class="btn sun" id="pr">🖨️ In bộ thẻ</button></div><p id="ce" class="note"></p></div>
 <div class="grid fcs">${LESSONS.map(fc).join('')}</div>`;
 $$('.fc').forEach(f=>f.onclick=()=>f.dataset.lock?plans():f.classList.toggle('on'));
 $('#cg').onclick=()=>{const v=$('#cd').value.trim().toUpperCase(),l=LESSONS.find(x=>code(x)===v);if(!l)$('#ce').textContent='Không tìm thấy mã này. Hãy kiểm tra lại mã trên thẻ.';else locked(l)?plans():play(l)};
 $('#pr').onclick=()=>{$('#sheet').innerHTML=LESSONS.filter(l=>!locked(l)).map(l=>`<div class="pc"><div class="pe">${l.e}</div><h3>${l.t}</h3><small>${cat(l.c).n}</small><p>✅ ${good(l)}</p><p>❌ ${bad(l)}</p><b>${code(l)}</b></div>`).join('');window.print()}}

