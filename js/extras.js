/* Fitur tambahan portofolio: efek decrypt nama, kartu proyek 3D, konfeti badge CTF, Matrix rain, terminal interaktif. */
(function(){
 var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
 var root=document.documentElement,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,fine=matchMedia('(pointer:fine)').matches;
 function lsGet(k){try{return localStorage.getItem(k)}catch(e){return null}}
 function lsSet(k,v){try{localStorage.setItem(k,v)}catch(e){}}

 /* ===== 1. Teks "decrypt" pada nama: huruf acak berubah satu per satu ===== */
 var GL='!<>-_/[]{}=+*^?#ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
 function decrypt(el,to,ms){
  if(reduce){el.textContent=to;return}
  if(el._dc)cancelAnimationFrame(el._dc);
  var t0=performance.now(),len=to.length;
  (function f(now){
   var p=Math.min(1,((now||t0)-t0)/ms),fix=Math.floor(p*len*1.15),out='';
   for(var i=0;i<len;i++){var c=to.charAt(i);out+=(c===' '||c==='.'||i<fix)?c:GL.charAt(Math.random()*GL.length|0)}
   el.textContent=p<1?out:to;
   if(p<1)el._dc=requestAnimationFrame(f);
  })(t0);
 }
 var nm=$('.hx h1 .nm');
 if(nm&&!reduce){
  var to=nm.textContent,ld=$('#loader'),go=function(){decrypt(nm,to,1200)};
  nm.setAttribute('aria-label',to);
  nm.addEventListener('mouseenter',go);
  if(ld&&!ld.classList.contains('off')){
   nm.textContent=to.replace(/[^ .]/g,'#');
   new MutationObserver(function(m,o){if(ld.classList.contains('off')){o.disconnect();setTimeout(go,150)}}).observe(ld,{attributes:true,attributeFilter:['class']});
  }
 }

 /* ===== 2. Kartu proyek miring 3D mengikuti mouse ===== */
 if(fine&&!reduce)$$('#plist .card').forEach(function(c){
  c.classList.add('tilt');
  c.addEventListener('mousemove',function(e){
   var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
   c.style.setProperty('--ry',(x*12)+'deg');c.style.setProperty('--rx',(-y*12)+'deg');
   c.style.setProperty('--gx',((x+.5)*100)+'%');c.style.setProperty('--gy',((y+.5)*100)+'%');
  });
  c.addEventListener('mouseleave',function(){c.style.setProperty('--rx','0deg');c.style.setProperty('--ry','0deg')});
 });

 // kartu skill: cahaya lembut mengikuti mouse
 if(fine)$$('.sk-c').forEach(function(c){
  c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px')});
 });

 /* ===== 3. Konfeti (badge Juara 1 CTF + easter egg terminal) ===== */
 var CP=[],cfRun=false,cfc=null,cfx=null;
 function confetti(ox,oy,n){
  if(reduce)return;
  if(!cfc){cfc=document.createElement('canvas');cfc.id='confetti';cfc.setAttribute('aria-hidden','true');document.body.appendChild(cfc);cfx=cfc.getContext('2d')}
  cfc.width=innerWidth;cfc.height=innerHeight;
  var C=['#B3202E','#E8606E','#F3C6CB','#FFD166','#ffffff'];
  for(var i=0;i<(n||130);i++){var a=-Math.PI/2+(Math.random()-.5)*2.4,v=6+Math.random()*10;
   CP.push({x:ox,y:oy,vx:Math.cos(a)*v,vy:Math.sin(a)*v,w:5+Math.random()*6,h:3+Math.random()*5,r:Math.random()*6,vr:(Math.random()-.5)*.4,c:C[i%5],l:1})}
  if(!cfRun){cfRun=true;requestAnimationFrame(cfLoop)}
 }
 function cfLoop(){
  cfx.clearRect(0,0,cfc.width,cfc.height);var alive=[];
  CP.forEach(function(p){
   p.vy+=.28;p.vx*=.992;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;p.l-=.006;
   if(p.l>0&&p.y<cfc.height+20){alive.push(p);cfx.save();cfx.globalAlpha=Math.min(1,p.l*2);cfx.translate(p.x,p.y);cfx.rotate(p.r);cfx.fillStyle=p.c;cfx.fillRect(-p.w/2,-p.h/2,p.w,p.h);cfx.restore()}
  });
  CP=alive;
  if(CP.length)requestAnimationFrame(cfLoop);else{cfRun=false;cfc.remove();cfc=null}
 }
 var ctf=$('.pz');
 if(ctf){
  var burst=function(){var b=$('.ctf-b',ctf).getBoundingClientRect();confetti(b.left+b.width/2,b.top+b.height/2)};
  if('IntersectionObserver' in window)new IntersectionObserver(function(es,o){if(es[0].isIntersecting){setTimeout(burst,350);o.disconnect()}},{threshold:.7}).observe(ctf);
  ctf.addEventListener('click',burst);
  ctf.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();burst()}});
 }

 /* ===== 4. Matrix rain (tombol "01" di menu, default mati) ===== */
 var mxOk=!reduce,mxOn=false,mxc=null,mxx,mxRaf=0,mxLast=0,mxCols=0,mxDrops=[],MXC='アイウエオカキクケコサシスセソタチツテトナニヌネノ01<>{}/$#=+*',MXF=16;
 function mxSize(){mxc.width=innerWidth;mxc.height=innerHeight;mxCols=Math.ceil(mxc.width/MXF);mxDrops=[];for(var i=0;i<mxCols;i++)mxDrops.push(Math.random()*-50)}
 function mxFrame(now){
  mxRaf=requestAnimationFrame(mxFrame);
  if(now-mxLast<55)return;mxLast=now;
  var dk=root.dataset.theme==='dark';
  mxx.fillStyle=dk?'rgba(20,10,13,.12)':'rgba(250,250,250,.14)';mxx.fillRect(0,0,mxc.width,mxc.height);
  mxx.fillStyle=dk?'#E8606E':'#B3202E';mxx.font=MXF+'px monospace';
  for(var i=0;i<mxCols;i++){
   mxx.fillText(MXC.charAt(Math.random()*MXC.length|0),i*MXF,mxDrops[i]*MXF);
   if(mxDrops[i]*MXF>mxc.height&&Math.random()>.975)mxDrops[i]=0;
   mxDrops[i]++;
  }
 }
 var mxBtn=document.createElement('button');mxBtn.id='mx-btn';mxBtn.type='button';mxBtn.textContent='01';
 mxBtn.title='Matrix rain on/off';mxBtn.setAttribute('aria-label','Matrix rain on/off');
 function setMx(v){
  if(!mxOk)return false;
  mxOn=v;
  if(v&&!mxc){mxc=document.createElement('canvas');mxc.id='matrix';mxc.setAttribute('aria-hidden','true');document.body.insertBefore(mxc,document.body.firstChild);mxx=mxc.getContext('2d');mxSize();addEventListener('resize',function(){if(mxOn)mxSize()})}
  root.classList.toggle('mx',v);mxBtn.classList.toggle('on',v);mxBtn.setAttribute('aria-pressed',v);
  cancelAnimationFrame(mxRaf);if(v)mxRaf=requestAnimationFrame(mxFrame);
  lsSet('mx',v?'1':'0');return true;
 }
 var ref=$('#dragon-btn')||$('#snd'),ctl=$('#pill .ctl');
 if(ctl&&mxOk){ref?ctl.insertBefore(mxBtn,ref.nextSibling):ctl.insertBefore(mxBtn,ctl.firstChild);mxBtn.onclick=function(){setMx(!mxOn)};if(lsGet('mx')==='1'&&fine)setMx(true)}

 /* ===== 5. Terminal interaktif di bagian kontak ===== */
 var tw=$('#term'),dEl=$('#term-data');
 if(tw&&dEl){
  var D={};try{D=JSON.parse(dEl.textContent)}catch(e){}
  var out=$('#term-out'),inp=$('#term-cmd'),hist=[],hi=0,busy=false;
  function line(t,cls,href){
   var s=document.createElement(href?'a':'span');s.className='l'+(cls?' '+cls:'');s.textContent=t;
   if(href){s.href=href;s.target='_blank';s.rel='noopener'}
   out.appendChild(s);out.scrollTop=out.scrollHeight;return s;
  }
  function print(arr){
   var i=0;
   (function nx(){
    if(i>=arr.length){busy=false;return}
    var a=arr[i++];if(typeof a==='string')line(a);else line(a[0],a[1],a[2]);
    if(reduce)nx();else setTimeout(nx,35);
   })();
  }
  function grab(url){var a=document.createElement('a');a.href=url;a.download='';document.body.appendChild(a);a.click();a.remove()}
  var C={
   help:function(){return ['Perintah yang tersedia:','  whoami       tentang saya','  skills       daftar skill','  projects     proyek dan hasilnya','  experience   pengalaman','  education    pendidikan','  contact      cara menghubungi saya','  cv, resume   unduh dokumen PDF','  matrix       Matrix rain on/off','  theme        ganti tema terang/gelap','  dragon       naga on/off','  clear        bersihkan layar',['Coba juga: ls, cat secret.txt, hack, sudo hire ardiansyah 😉','m']]},
   whoami:function(){return [[D.name+', S.Kom.','a'],(D.roles||[]).join(' · '),'',D.tagline||'','','📍 '+(D.city||''),['Ketik "help" untuk melihat perintah lain.','m']]},
   skills:function(){var r=[];Object.keys(D.skills||{}).forEach(function(g){r.push([g,'a']);r.push('  '+D.skills[g].join(', '))});return r},
   projects:function(){var r=[];(D.projects||[]).forEach(function(p){r.push(['▸ '+p.title,'a']);r.push(['  '+p.tag,'m']);if(p.result)r.push('  Hasil: '+p.result)});return r},
   experience:function(){var r=[];(D.experience||[]).forEach(function(e){r.push([e[0]+' · '+e[1],'a']);r.push('  '+e[2])});return r},
   education:function(){var e=D.edu||[];return [[e[0]||'','a'],e[1]||'',e[2]||'']},
   contact:function(){return [['Email     '+D.email,'a','mailto:'+D.email],['WhatsApp  '+D.wa,'a',D.wa],['LinkedIn  '+D.linkedin,'a',D.linkedin],['GitHub    '+D.github,'a',D.github],'📍 '+D.city]},
   cv:function(){if(D.cv)grab(D.cv);return [['Mengunduh CV_M_Ardiansyah.pdf …','g']]},
   resume:function(){if(D.resume)grab(D.resume);return [['Mengunduh Resume_M_Ardiansyah.pdf …','g']]},
   ls:function(){return ['about.txt  skills.txt  projects/  experience/  cv.pdf  resume.pdf  secret.txt']},
   cat:function(a){var f=(a[0]||'').toLowerCase();
    if(f==='secret.txt')return [['🐉 Naga di layar ini bisa menyemburkan api. Tahan klik kiri mouse!','a']];
    if(f==='about.txt')return C.whoami();
    if(f==='skills.txt')return C.skills();
    return [['cat: '+(a[0]||'')+': No such file or directory','m']]},
   hack:function(){return [['[!] Akses ditolak 🔒','a'],'Saya di sisi pembela: ethical hacking only. Mau lihat writeup CTF-nya? Hubungi saya.']},
   sudo:function(a){
    var s=a.join(' ').toLowerCase();
    if(/^hire( me| ardiansyah| m\.? ardiansyah)?$/.test(s)){
     var r=tw.getBoundingClientRect();confetti(r.left+r.width/2,r.top+70,170);
     return [['[sudo] password for guest: ********','m'],['✔ Akses diberikan.','g'],'Kandidat M. Ardiansyah ditambahkan ke shortlist kamu 🎉',['Kirim email: '+D.email,'a','mailto:'+D.email],['WhatsApp: '+D.wa,'a',D.wa]];
    }
    return [['guest is not in the sudoers file. This incident will be reported. 🚨','a']];
   },
   exit:function(){return ['Tidak bisa keluar dari portofolio ini 😄']},
   matrix:function(){return setMx(!mxOn)?[['Matrix rain '+(mxOn?'ON':'OFF'),'g']]:[['Matrix rain dimatikan karena "reduced motion" aktif.','m']]},
   theme:function(){var b=$('#theme');if(b)b.click();return [['Tema diganti.','g']]},
   dragon:function(){var b=$('#dragon-btn');if(b){b.click();return [['Naga '+(b.classList.contains('off')?'OFF':'ON')+' 🐉','g']]}return [['Naga hanya aktif di perangkat dengan mouse.','m']]}
  };
  function run(raw,auto){
   var cmd=raw.trim();if(!cmd)return;
   line('guest@ardi:~$ '+cmd,'g');
   if(!auto){hist.push(cmd);hi=hist.length}
   var p=cmd.split(/\s+/),name=p[0].toLowerCase();
   if(name==='clear'){out.textContent='';return}
   var f=C[name],res=f?f(p.slice(1)):[['perintah tidak dikenal: '+name+'. Ketik "help".','a']];
   if(res&&res.length){busy=true;print(res)}
  }
  inp.addEventListener('keydown',function(e){
   if(e.key==='Enter'){if(busy)return;var v=inp.value;inp.value='';run(v)}
   else if(e.key==='ArrowUp'){e.preventDefault();if(hi>0)inp.value=hist[--hi]}
   else if(e.key==='ArrowDown'){e.preventDefault();if(hi<hist.length-1)inp.value=hist[++hi];else{hi=hist.length;inp.value=''}}
   else if(e.key==='Tab'){e.preventDefault();var v=inp.value.toLowerCase();if(v){var m=Object.keys(C).filter(function(k){return k.indexOf(v)===0});if(m.length===1)inp.value=m[0]}}
  });
  out.addEventListener('click',function(e){if(!e.target.closest('a'))inp.focus({preventScroll:true})});
  $$('.term-quick button',tw).forEach(function(b){b.onclick=function(){if(!busy)run(b.dataset.c)}});
  line('Selamat datang di terminal portofolio 👋  Ketik "help" lalu Enter.','m');
  // pertama kali terlihat: ketik "whoami" otomatis
  if('IntersectionObserver' in window)new IntersectionObserver(function(es,o){
   if(!es[0].isIntersecting)return;o.disconnect();
   var w='whoami',i=0;
   setTimeout(function t(){if(reduce||i>=w.length){inp.value='';run(w,true);return}inp.value+=w.charAt(i++);setTimeout(t,90)},500);
  },{threshold:.5}).observe(tw);
 }
})();
