function auth(mode){const up=mode==='up',m=modal(`<h2>${up?'Tạo tài khoản cho bé':'Đăng nhập'}</h2>
 ${up?`<label>Tên của bé<input id="n"></label><label>Tuổi<select id="a">${[3,4,5,6,7,8,9,10].map(x=>`<option>${x}</option>`).join('')}</select></label>
 <label>Bé là<select id="gd"><option value="boy">Bé trai (Hero Bin)</option><option value="girl">Bé gái (Hero Mia)</option></select></label>
 <label>Số điện thoại phụ huynh<input id="ph" type="tel" inputmode="tel" placeholder="0901234567"></label>
 <label>Tỉnh/thành<select id="rg">${REGIONS.map(x=>`<option>${x}</option>`).join('')}</select></label>`:''}
 <label>Email phụ huynh<input id="e" type="email"></label><label>Mật khẩu<input id="p" type="password"></label>
 <p class="note">Bản demo: dữ liệu chỉ lưu trên máy này, mật khẩu chưa được xử lý. Bản thật cần máy chủ để đăng nhập an toàn.</p>
 <p id="er" style="color:var(--coral);font-weight:700"></p><button class="btn" id="ok">${up?'Đăng ký':'Đăng nhập'}</button> <button class="btn ghost" id="sw">${up?'Đã có tài khoản':'Tạo tài khoản mới'}</button>`);
 const q=s=>m.querySelector(s);q('#sw').onclick=()=>{m.remove();auth(up?'in':'up')};
 q('#ok').onclick=()=>{const e=q('#e').value.trim().toLowerCase(),er=q('#er');
  if(!/.+@.+\..+/.test(e)||q('#p').value.length<6){er.textContent='Nhập email hợp lệ và mật khẩu từ 6 ký tự.';return}
  if(up){const n=q('#n').value.trim(),ph=q('#ph').value.replace(/[\s.]/g,'');
   if(!n){er.textContent='Hãy nhập tên của bé.';return}if(!/^(0|\+84)\d{9,10}$/.test(ph)){er.textContent='Số điện thoại chưa đúng (ví dụ 0901234567).';return}
   S.users[e]={name:n,email:e,phone:ph,age:+q('#a').value,g:q('#gd').value,rg:q('#rg').value};S.user=S.users[e];S.hero=S.user.g;S.region=S.user.rg}
  else{if(!S.users[e]){er.textContent='Chưa có tài khoản với email này. Hãy đăng ký.';return}S.user=S.users[e];S.hero=S.user.g||S.hero;S.region=S.user.rg||S.region}
  save();m.remove();toast('Xin chào '+S.user.name+'!');go(view==='play'||view==='checkout'?'home':view)}}
