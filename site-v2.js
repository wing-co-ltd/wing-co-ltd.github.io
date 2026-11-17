/* 見出しの英字を透かし用に複製 */
(function(){document.querySelectorAll(".sec-title").forEach(function(h){
  var s=h.querySelector("span:not(.nb)");if(!s)return;var t=s.textContent.trim().split(/\s+/)[0];
  if(t&&/^[A-Za-z&-]+$/.test(t))h.setAttribute("data-bg",t.charAt(0)+t.slice(1).toLowerCase());});})();
