/* 日本語を文節ごとに改行させる（単語の途中で改行しない） */
(function(){
  var HIRA=/[ぁ-ゟ]/, KANJI=/[一-鿿々]/, KATA=/[゠-ヿ]/,
      OPEN=/[「『（《【]/, CLOSE=/[」』）》】]/,
      PUNC=/[、。，．！？]/, SMALL=/[ゃゅょっぁぃぅぇぉー]/,
      OKURI=/[きりしちいみびけげえっ]/; // き り し ち い み び け げ え っ
  function seg(t){
    var out=[],cur="",depth=0,inner=0;
    for(var i=0;i<t.length;i++){
      var c=t[i],n=t[i+1]||"",p=t[i-1]||"";
      if(OPEN.test(c)){depth++;inner=0;}
      cur+=c; if(depth>0)inner++;
      if(CLOSE.test(c)){depth=Math.max(0,depth-1);
        if(depth===0&&n&&!HIRA.test(n)&&!KANJI.test(n)&&!PUNC.test(n)){out.push(cur);cur="";}
        continue;}
      if(depth>0&&inner<14)continue;                 // かっこ内は区切らない
      if(PUNC.test(c)&&!PUNC.test(n)&&!CLOSE.test(n)){out.push(cur);cur="";continue;}
      if(!n)continue;
      if(OPEN.test(n)&&cur.length>1&&!PUNC.test(c)){out.push(cur);cur="";continue;}
      if(HIRA.test(c)&&(KANJI.test(n)||(KATA.test(n)&&n!=="\u30FC"))&&!SMALL.test(n)){
        if(OKURI.test(c)&&KANJI.test(p))continue;     // 引き下げ・取り上げ などの複合語
        if(/[ごお]/.test(c)&&(!HIRA.test(p)||/[にをはがもとでへの]/.test(p)))continue; // ご・お＋漢字
        out.push(cur);cur="";
      }
    }
    if(cur)out.push(cur);return out;
  }
  var sel="p,dd,td,th,h1,h2,h3,h4,li,figcaption,.gcap,.cap,a.more-link,a.btn,.shop-name";
  document.querySelectorAll(sel).forEach(function(el){
    if(el.closest(".h3-vert,.eyebrow,.num-label,.artist,.work-sub,.h3-eyebrow,.ph-label"))return;
    var w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),ns=[],n;while(n=w.nextNode())ns.push(n);
    ns.forEach(function(t){if(!/[぀-ヿ一-鿿]/.test(t.data))return;
      var par=t.parentNode;if(par.classList&&par.classList.contains("nb")&&t.data.length<=18)return;
      var f=document.createDocumentFragment();seg(t.data).forEach(function(x){var s=document.createElement("span");s.className="nb";s.textContent=x;f.appendChild(s);});
      par.replaceChild(f,t);});
  });
})();
