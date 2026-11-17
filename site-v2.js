/* WING v2：スクロールで要素をふわっと表示 */
(function(){
  if(!("IntersectionObserver" in window))return;
  var sel=".sec-title,.lead,.hero-lead,.cards>*,.entries>*,.phases>*,.cases>*,.gallery>*,.works>*,.buys>*,.shops>*,.contact-box,.cat,.sub-title,.spec,.showcase2,.med-doc,.sale-banner";
  var els=[].slice.call(document.querySelectorAll(sel)).filter(function(e){return !e.closest(".page-hero,.hero3,.site-header,.site-footer");});
  var io=new IntersectionObserver(function(ents){ents.forEach(function(en){
    if(en.isIntersecting){en.target.classList.add("in");io.unobserve(en.target);}
  });},{rootMargin:"0px 0px -8% 0px",threshold:0.06});
  els.forEach(function(e){
    var p=e.parentElement,i=p?[].indexOf.call(p.children,e):0;
    e.style.transitionDelay=Math.min(i%2,1)*0.08+"s";
    e.classList.add("rv");io.observe(e);
  });
})();
/* 見出しの英字を透かし用に複製 */
(function(){document.querySelectorAll(".sec-title").forEach(function(h){
  var s=h.querySelector("span:not(.nb)");if(!s)return;var t=s.textContent.trim().split(/\s+/)[0];
  if(t&&/^[A-Za-z&-]+$/.test(t))h.setAttribute("data-bg",t.charAt(0)+t.slice(1).toLowerCase());});})();
