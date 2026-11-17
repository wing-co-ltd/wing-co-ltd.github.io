/* 日本語を文節ごとに改行させる（単語の途中で改行しない） */
(function(){
  var H=/[ぁ-ゟ]/, K=/[一-鿿゠-ヿｦ-ﾟ々〆ヶA-Za-z0-9０-９Ａ-Ｚ「『（《【]/, P=/[、。，．！？」』）》】]/, S=/[ゃゅょっぁぃぅぇぉー]/;
  function seg(t){var out=[],cur="";for(var i=0;i<t.length;i++){var c=t[i],n=t[i+1]||"";cur+=c;
    if(P.test(c)&&!P.test(n)){out.push(cur);cur="";continue;}
    if(n==="\u300C"&&cur.length>1&&!P.test(c)){out.push(cur);cur="";continue;}
    if(H.test(c)&&n&&K.test(n)&&!S.test(n)&&!(/[\u3054\u304A]/.test(c)&&(i===0||!H.test(t[i-1])||/[\u306B\u3092\u306F\u304C\u3082\u3068\u3067\u3078\u306E]/.test(t[i-1])))){out.push(cur);cur="";}}
    if(cur)out.push(cur);return out;}
  var sel="p,dd,td,th,h1,h2,h3,h4,li,figcaption,.gcap,.cap,a.more-link,a.btn,.shop-name";
  document.querySelectorAll(sel).forEach(function(el){
    if(el.closest(".h3-vert,.eyebrow,.num-label,.artist,.work-sub,.h3-eyebrow"))return;
    var w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),ns=[],n;while(n=w.nextNode())ns.push(n);
    ns.forEach(function(t){if(!/[぀-ヿ一-鿿]/.test(t.data))return;
      var par=t.parentNode;if(par.classList&&par.classList.contains("nb")&&t.data.length<=16)return;
      var f=document.createDocumentFragment();seg(t.data).forEach(function(x){var s=document.createElement("span");s.className="nb";s.textContent=x;f.appendChild(s);});
      par.replaceChild(f,t);});
  });
})();
