/* WING 仕様お試し版（ロールス・ロイス風）の動き */
(function(){
  var body=document.body, hero=document.querySelector(".rr-hero");
  /* メニューボタンの表記 MENU ⇄ CLOSE */
  var mb=document.querySelector(".menu-btn");
  if(mb){mb.addEventListener("click",function(){setTimeout(function(){mb.textContent=body.classList.contains("nav-open")?"CLOSE ✕":"MENU ☰";},0);});}
  document.querySelectorAll(".site-nav a").forEach(function(a){a.addEventListener("click",function(){body.classList.remove("nav-open");if(mb)mb.textContent="MENU ☰";});});

  if(hero){
    body.classList.add("has-hero");
    var onScroll=function(){body.classList.toggle("scrolled",window.scrollY>hero.offsetHeight-90);};
    window.addEventListener("scroll",onScroll,{passive:true});onScroll();
    /* スライダー */
    var slides=hero.querySelectorAll(".rr-slide"),dots=hero.querySelectorAll(".rr-dots button"),cur=0,timer;
    function go(n){
      slides[cur].classList.remove("on");dots[cur].classList.remove("on");
      cur=(n+slides.length)%slides.length;
      var bg=slides[cur].querySelector(".rr-bg");bg.style.animation="none";void bg.offsetWidth;bg.style.animation="";
      slides[cur].classList.add("on");dots[cur].classList.add("on");
      clearTimeout(timer);timer=setTimeout(function(){go(cur+1);},6500);
    }
    dots.forEach(function(d,i){d.addEventListener("click",function(){go(i);});});
    var x0=null;
    hero.addEventListener("touchstart",function(e){x0=e.touches[0].clientX;},{passive:true});
    hero.addEventListener("touchend",function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>40)go(cur+(dx<0?1:-1));x0=null;});
    timer=setTimeout(function(){go(1);},6500);
  }
  /* 全幅写真の視差 */
  var band=document.querySelector(".rr-band-bg");
  if(band && !window.matchMedia("(prefers-reduced-motion: reduce)").matches){
    var tick=false;
    var par=function(){var r=band.parentElement.getBoundingClientRect(),vh=window.innerHeight;
      if(r.bottom>0&&r.top<vh){var p=(r.top+r.height/2-vh/2)/vh;band.style.transform="translate3d(0,"+(p*-9)+"%,0)";}tick=false;};
    window.addEventListener("scroll",function(){if(!tick){tick=true;requestAnimationFrame(par);}},{passive:true});par();
  }
  /* 横スクロール一覧の矢印 */
  document.querySelectorAll(".rr-lineup").forEach(function(s){
    var rail=s.querySelector(".rr-rail");if(!rail)return;
    var step=function(d){var c=rail.querySelector(".rr-model");rail.scrollBy({left:d*(c?c.offsetWidth+18:300),behavior:"smooth"});};
    s.querySelector(".prev").addEventListener("click",function(){step(-1);});
    s.querySelector(".next").addEventListener("click",function(){step(1);});
  });
  /* 「お問い合わせ」へのリンクで開閉欄を開く */
  function openHash(){var h=location.hash&&document.getElementById(location.hash.slice(1));if(h&&h.tagName==="DETAILS")h.open=true;}
  window.addEventListener("hashchange",openHash);openHash();
})();
