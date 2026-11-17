/* 見出しの英字を透かし用に複製 */
(function(){document.querySelectorAll(".sec-title").forEach(function(h){
  var s=h.querySelector("span:not(.nb)");if(!s)return;var t=s.textContent.trim().split(/\s+/)[0];
  if(t&&/^[A-Za-z&-]+$/.test(t))h.setAttribute("data-bg",t.charAt(0)+t.slice(1).toLowerCase());});})();
/* 全幅写真帯の視差（スクロールに合わせて写真がゆっくり動く） */
(function(){
  var bgs=[].slice.call(document.querySelectorAll(".pband-bg"));
  if(!bgs.length||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  var tick=false;
  function run(){var vh=window.innerHeight;bgs.forEach(function(bg){var r=bg.parentElement.getBoundingClientRect();
    if(r.bottom>0&&r.top<vh){var p=(r.top+r.height/2-vh/2)/vh;bg.style.transform="translate3d(0,"+(p*-9)+"%,0)";}});tick=false;}
  window.addEventListener("scroll",function(){if(!tick){tick=true;requestAnimationFrame(run);}},{passive:true});
  window.addEventListener("resize",run);run();
})();
