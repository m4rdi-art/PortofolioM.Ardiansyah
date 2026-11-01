(function(){
 var root=document.documentElement,$=function(s){return document.querySelector(s)},$$=function(s){return [].slice.call(document.querySelectorAll(s))};
 // tema
 var sv=null;try{sv=localStorage.getItem('theme')}catch(e){}
 if(sv)root.dataset.theme=sv;else if(matchMedia('(prefers-color-scheme: dark)').matches)root.dataset.theme='dark';
 $('#theme').onclick=function(){var t=root.dataset.theme==='dark'?'light':'dark';root.dataset.theme=t;try{localStorage.setItem('theme',t)}catch(e){}};
 // preloader persen
 var n=0,pct=$('#pct'),bar=$('#bar'),ld=$('#loader');
 var iv=setInterval(function(){n=Math.min(100,n+Math.ceil(Math.random()*5));pct.textContent=n+'%';bar.style.width=n+'%';if(n>=100){clearInterval(iv);setTimeout(function(){ld.classList.add('off')},250)}},70);
 // teks mengetik
 var roles=['IT Support','Networking','Cyber Security','IoT Developer'],ri=0,ci=0,del=false,el=$('#typed');
 function tick(){var w=roles[ri];ci+=del?-1:1;el.textContent=w.slice(0,ci);var d=del?45:90;
  if(!del&&ci===w.length){del=true;d=1300}else if(del&&ci===0){del=false;ri=(ri+1)%roles.length;d=300}setTimeout(tick,d)}
 if(el)tick();
 // muncul saat scroll + hitung angka
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;e.target.classList.add('in');
  [].slice.call(e.target.querySelectorAll('[data-n]')).forEach(function(b){var t=parseFloat(b.dataset.n.replace(',','.')),f=b.dataset.n.indexOf('.')>-1?2:0,s=0;
   var c=setInterval(function(){s+=t/30;if(s>=t){s=t;clearInterval(c)}b.textContent=s.toFixed(f)},30)});io.unobserve(e.target)})},{threshold:.15});
 $$('.rv').forEach(function(x){io.observe(x)});
 // filter proyek
 $$('.filters button').forEach(function(b){b.onclick=function(){
  $$('.filters button').forEach(function(x){x.classList.remove('on')});b.classList.add('on');
  $$('#plist [data-cat]').forEach(function(c){c.style.display=(b.dataset.f==='all'||c.dataset.cat===b.dataset.f)?'':'none'})}});
 // menu aktif saat scroll (halaman utama)
 var secs=$$('section[id]'),links=$$('.pills a:not([data-page])');
 if(secs.length)addEventListener('scroll',function(){var y=scrollY+140,cur='';secs.forEach(function(s){if(s.offsetTop<=y)cur=s.id});if(cur==='skill')cur='tentang';
  links.forEach(function(x){x.classList.toggle('act',x.dataset.k===cur)})},{passive:true});
 // bahasa ID/EN
 var D={id:{home:'Beranda',about:'Tentang',projects:'Proyek',gallery:'Galeri',experience:'Pengalaman',contact:'Kontak',contactme:'Hubungi Saya',viewprojects:'Lihat Proyek',h_about:'Tentang',h_skill:'Skill',h_proj:'Proyek',h_exp:'Pengalaman',h_train:'Pelatihan & Seminar',h_contact:'Kontak',send:'Kirim Pesan',dlcv:'Unduh CV',resume:'Resume',h_flow:'Alur Sistem'},
  en:{home:'Home',about:'About',projects:'Projects',gallery:'Gallery',experience:'Experience',contact:'Contact',contactme:'Contact Me',viewprojects:'View Projects',h_about:'About',h_skill:'Skills',h_proj:'Projects',h_exp:'Experience',h_train:'Training & Seminars',h_contact:'Contact',send:'Send Message',dlcv:'Download CV',resume:'Resume',h_flow:'System Flow'}};
 function setLang(l){root.lang=l;$$('[data-i18n]').forEach(function(e){var t=D[l][e.dataset.i18n];if(t)e.textContent=t});
  $$('#lang span').forEach(function(s){s.classList.toggle('on',s.dataset.l===l)});try{localStorage.setItem('lang',l)}catch(e){}}
 var lg='id';try{lg=localStorage.getItem('lang')||'id'}catch(e){}
 $('#lang').onclick=function(){setLang(root.lang==='en'?'id':'en')};setLang(lg);
 // lightbox galeri
 var lb=$('#lb');
 if(lb){$$('.col img').forEach(function(i){i.onclick=function(){lb.querySelector('img').src=i.src;lb.hidden=false}});
  lb.onclick=function(){lb.hidden=true};addEventListener('keydown',function(e){if(e.key==='Escape')lb.hidden=true})}

 // suara klik (Web Audio, tanpa file audio)
 var AC=window.AudioContext||window.webkitAudioContext,ac=null,sOn=true,sb=$('#snd');
 try{sOn=localStorage.getItem('snd')!=='off'}catch(e){}
 function paintSnd(){if(sb){sb.textContent=sOn?'🔊':'🔇';sb.classList.toggle('off',!sOn)}}
 function pop(){if(!sOn||!AC)return;try{ac=ac||new AC();var o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime;
  o.type='sine';o.frequency.setValueAtTime(720,t);o.frequency.exponentialRampToValueAtTime(380,t+.09);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.18,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+.12);
  o.connect(g);g.connect(ac.destination);o.start(t);o.stop(t+.13)}catch(e){}}
 paintSnd();
 if(sb)sb.onclick=function(e){e.stopPropagation();sOn=!sOn;try{localStorage.setItem('snd',sOn?'on':'off')}catch(x){}paintSnd();pop()};
 // suara rana kamera (file mp3) + kilatan layar saat foto diklik
 var SH=document.body.dataset.shutter,shA=null,noMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function shutter(){
  if(sOn&&SH){try{shA=shA||new Audio(SH);shA.currentTime=0;shA.volume=.75;var pr=shA.play();if(pr&&pr.catch)pr.catch(function(){})}catch(e){}}
  if(!noMotion){var f=document.createElement('div');f.className='flash';document.body.appendChild(f);setTimeout(function(){f.remove()},550)}
 }
 document.addEventListener('click',function(e){
  if(e.target.closest('.col img,.ab-p,.ring img')){shutter();return}
  if(e.target.closest('a,button:not(#snd),.card,.chip,.soc a'))pop();
 });
 // geser foto beranda mengikuti mouse (parallax). Pengikut mouse sekarang naga: lihat dragon.js
 var rg=$('.ring img');
 if(rg&&matchMedia('(pointer:fine)').matches&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  addEventListener('mousemove',function(e){rg.style.transform='translate('+((e.clientX/innerWidth-.5)*16)+'px,'+((e.clientY/innerHeight-.5)*16)+'px)'});
 }
})();
