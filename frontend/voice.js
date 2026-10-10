/* ============ GIỌNG NÓI ============ */
const Voice={on:true,chatMode:false,tok:0,cb:null,
 speak(t,done){const k=++this.tok,fin=()=>{if(k===this.tok&&done)done()};
  if(!this.on||!('speechSynthesis' in window)){setTimeout(fin,800);return}
  speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='vi-VN';u.rate=S.set.rate;u.pitch=S.set.pitch;
  const v=speechSynthesis.getVoices().find(x=>x.lang.toLowerCase().startsWith('vi'));if(v)u.voice=v;
  u.onstart=()=>this.cb&&this.cb(1);u.onend=u.onerror=()=>{this.cb&&this.cb(0);fin()};speechSynthesis.speak(u)},
 listen(onText,btn){const R=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!R){toast('Hãy dùng Chrome hoặc Edge để nói chuyện bằng giọng nói');return}
  const r=new R();r.lang='vi-VN';btn&&btn.classList.add('live');
  r.onresult=e=>onText(e.results[0][0].transcript);r.onend=()=>btn&&btn.classList.remove('live');r.onerror=()=>{this.chatMode=false};r.start()},
 stop(){this.tok++;this.chatMode=false;this.cb=null;'speechSynthesis' in window&&speechSynthesis.cancel()}};

