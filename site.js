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
  var MAP={"大きな瞳の奥に、浮世絵を思わせる青い波がうねります。ナナハチカは、時代とともに変わるものと、時を経ても変わらないものを思いながら、浮世絵の表現を現代の作品に取り入れました。描かれた瞳を見つめていると、自分が見ているものを、何を根拠に「真実」だと感じるのか。そんな問いが浮かんできます。": ["大きな瞳の奥に、", "浮世絵を思わせる", "青い波がうねります。", "ナナハチカは、", "時代とともに変わるものと、", "時を経ても変わらないものを思いながら、", "浮世絵の表現を", "現代の作品に取り入れました。", "描かれた瞳を見つめていると、", "自分が見ているものを、", "何を根拠に「真実」だと感じるのか。", "そんな問いが浮かんできます。"], "赤や青の花が人物の横顔に重なり、その周りを蝶が舞います。人物と花の境目がほどけていくように見える構図には、人も自然の一部として生きているという作家のまなざしが感じられます。花や蝶に託したのは、私たちを取り巻く自然と、そこに息づく命への祈りです。": ["赤や青の花が", "人物の横顔に重なり、", "その周りを蝶が舞います。", "人物と花の境目が", "ほどけていくように見える構図には、", "人も自然の一部として", "生きているという", "作家のまなざしが感じられます。", "花や蝶に託したのは、", "私たちを取り巻く自然と、", "そこに息づく命への祈りです。"], "株式会社ウイングは、不動産の取得・保有・開発と、自由診療クリニックの開業・成長支援を通じて、新たな価値の創造に取り組みます。": ["株式会社ウイングは、", "不動産の取得・保有・開発と、", "自由診療クリニックの", "開業・成長支援を通じて、", "新たな価値の創造に取り組みます。"], "自由診療クリニックの市場調査・開業準備から、開業後の運営、分院展開・M&A・事業譲渡まで。すべてを一貫して支援します。": ["自由診療クリニックの", "市場調査・開業準備から、", "開業後の運営、", "分院展開・M&A・事業譲渡まで。", "すべてを一貫して支援します。"], "市場調査や物件選び、内装の工事図面から、スタッフの求人・教育、開業届などの手続き、看板やホームページの制作まで。開業後も、スタッフ教育・院内オペレーション、売上管理、広告・SNS対策など、クリニック運営に関わるあらゆる業務を支えます。": ["市場調査や物件選び、", "内装の工事図面から、", "スタッフの求人・教育、", "開業届などの手続き、", "看板やホームページの制作まで。", "開業後も、", "スタッフ教育・院内オペレーション、", "売上管理、", "広告・SNS対策など、", "クリニック運営に関わる", "あらゆる業務を支えます。"], "さらに分院展開やM&A、事業譲渡といった「出口」まで。株式会社ウイングは、クリニックの構想から成長、そしてその先までを一貫してサポートします。": ["さらに", "分院展開やM&A、事業譲渡といった", "「出口」まで。", "株式会社ウイングは、", "クリニックの構想から成長、", "そしてその先までを", "一貫してサポートします。"], "窓口はひとつ。院長先生が診療に集中できる環境を、私たちがつくります。": ["窓口はひとつ。", "院長先生が診療に集中できる環境を、", "私たちがつくります。"], "駅の看板やデジタルサイネージ、市バスのラッピング、ビルの屋上・壁面看板まで。デザインから掲出まで一貫して手がけています。": ["駅の看板や", "デジタルサイネージ、", "市バスのラッピング、", "ビルの屋上・壁面看板まで。", "デザインから掲出まで", "一貫して手がけています。"], "取得した不動産は長期保有・運用が基本方針です。開発用地のほか、中古ビルや中古マンション、収益不動産も幅広く検討します。売却物件のご紹介・売却のご相談を歓迎しています。": ["取得した不動産は", "長期保有・運用が基本方針です。", "開発用地のほか、", "中古ビルや中古マンション、", "収益不動産も幅広く検討します。", "売却物件のご紹介・売却のご相談を", "歓迎しています。"], "小規模から中規模の不動産の取得を得意としています。大規模デベロッパーが扱いにくい案件も、規模や条件に応じて柔軟に検討します。": ["小規模から中規模の", "不動産の取得を得意としています。", "大規模デベロッパーが", "扱いにくい案件も、", "規模や条件に応じて", "柔軟に検討します。"], "※保有物件は長期保有を基本としており、現在売却の予定はありません。ご購入のご希望については個別にご相談を承ります。": ["※保有物件は長期保有を基本としており、", "現在売却の予定はありません。", "ご購入のご希望については", "個別にご相談を承ります。"], "土地の取得からマンションの建設・売却まで手掛けた事例と、その他の販売実績をご紹介します。": ["土地の取得から", "マンションの建設・売却まで", "手掛けた事例と、", "その他の販売実績をご紹介します。"], "不動産と医療の領域で、実務を重視した価値の創造を目指します。": ["不動産と医療の領域で、", "実務を重視した価値の創造を目指します。"], "自由診療クリニックの開業・経営に関するご相談を承ります。": ["自由診療クリニックの", "開業・経営に関するご相談を承ります。"], "法令上、資格を要する申請代理等は適切な専門家との連携を前提とします。": ["法令上、", "資格を要する申請代理等は", "適切な専門家との連携を前提とします。"], "現在は試作版です。お問い合わせフォームと送信先は、次の制作工程で設定します。": ["現在は試作版です。", "お問い合わせフォームと送信先は、", "次の制作工程で設定します。"], "開業準備から開院後の集患、分院展開までご相談いただけます。": ["開業準備から開院後の集患、", "分院展開までご相談いただけます。"], "株式会社ウイングが保有する不動産をご紹介します。": ["株式会社ウイングが保有する", "不動産をご紹介します。"], "土地取得から建設・売却まで一貫して手掛けた4つの事例です。": ["土地取得から建設・売却まで", "一貫して手掛けた4つの事例です。"], "看板・広告の制作から集患まで支援しています。": ["看板・広告の制作から集患まで", "支援しています。"], "着工から完成までの工事の様子を、工程順にご紹介します。": ["着工から完成までの工事の様子を、", "工程順にご紹介します。"], "売却物件のご紹介・買取相談、当社保有物件の購入相談を承ります。お問い合わせはメールにて承ります。": ["売却物件のご紹介・買取相談、", "当社保有物件の購入相談を承ります。", "お問い合わせはメールにて承ります。"], "クリニック院長として、NHK「おはよう日本」などの報道番組に出演し、成人年齢引き下げにともなう美容医療の契約トラブルについてコメントしました。偽造医薬品の危険性や女性の薄毛治療を取り上げたテレビ番組にも出演し、雑誌の「イケメンアワード」にも掲載されました。": ["クリニック院長として、", "NHK「おはよう日本」などの", "報道番組に出演し、", "成人年齢引き下げにともなう", "美容医療の契約トラブルについて", "コメントしました。", "偽造医薬品の危険性や", "女性の薄毛治療を取り上げた", "テレビ番組にも出演し、", "雑誌の「イケメンアワード」にも", "掲載されました。"]};
  var sel="p,dd,td,th,h1,h2,h3,h4,li,figcaption,.gcap,.cap,a.more-link,a.btn,.shop-name";
  document.querySelectorAll(sel).forEach(function(el){
    if(el.closest(".h3-vert,.eyebrow,.num-label,.artist,.work-sub,.h3-eyebrow,.ph-label,.site-footer"))return;
    var key=el.textContent.replace(/\s+/g,"");
    var LEFT=document.body.classList.contains("pg-left");
    if(LEFT&&/^(P|LI)$/.test(el.tagName)&&!el.closest(".gcap,.cap,figcaption,.btn,.sale-banner")){el.classList.add("lft");}
    else if(MAP[key]&&!el.querySelector("a,img,br")){
      el.textContent="";MAP[key].forEach(function(x){var s=document.createElement("span");s.className="ln";s.textContent=x;el.appendChild(s);});
      el.classList.add("lined");return;}
    if(!LEFT&&/^(P|LI)$/.test(el.tagName)&&key.length>40){el.classList.add("flow");return;}
    var w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),ns=[],n;while(n=w.nextNode())ns.push(n);
    ns.forEach(function(t){if(!/[\u3040-\u30FF\u4E00-\u9FFF]/.test(t.data))return;
      var par=t.parentNode;if(par.classList&&par.classList.contains("nb")&&t.data.length<=18)return;
      var f=document.createDocumentFragment();seg(t.data).forEach(function(x){var s=document.createElement("span");s.className="nb";s.textContent=x;f.appendChild(s);});
      par.replaceChild(f,t);});
  });
})();
/* 「・」で終わる文節は次の文節とつなげる（列挙の途中で改行しない・全ページ共通） */
(function(){
  document.querySelectorAll(".nb").forEach(function(el){
    while(/・$/.test(el.textContent)){var nx=el.nextElementSibling;
      if(!nx||!nx.classList.contains("nb"))break;
      el.textContent=el.textContent+nx.textContent;nx.remove();}
  });
})();
/* ページ上部へ戻るボタン（全ページ共通） */
(function(){
  function init(){
    var b=document.createElement("button");b.className="to-top";b.type="button";b.setAttribute("aria-label","ページの一番上へ");
    b.innerHTML='<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 6l-7 7m7-7l7 7M12 6v13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    b.addEventListener("click",function(){window.scrollTo({top:0,behavior:"smooth"});});
    document.body.appendChild(b);
    function upd(){b.classList.toggle("show",window.scrollY>300);}
    window.addEventListener("scroll",upd,{passive:true});upd();
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
/* ライトボックス：data-lb の写真を順に表示（全ページ共通） */
(function(){
  document.addEventListener("click",function(e){
    var a=e.target.closest&&e.target.closest("a.lb-open");if(!a)return;e.preventDefault();
    var items=JSON.parse(a.getAttribute("data-lb")),i=0,v=(document.querySelector('link[href*="style.css?v="]')||{}).href||"";
    var q=(v.split("?v=")[1]||"");
    var box=document.createElement("div");box.className="lb";
    box.innerHTML='<button class="lb-x" aria-label="閉じる">✕</button><button class="lb-p" aria-label="前へ">‹</button><img alt=""><p class="lb-cap"></p><p class="lb-n"></p><button class="lb-q" aria-label="次へ">›</button>';
    var im=box.querySelector("img"),cap=box.querySelector(".lb-cap"),n=box.querySelector(".lb-n");
    function show(k){i=(k+items.length)%items.length;im.src=items[i][0]+(q?"?v="+q:"");im.alt=items[i][1];cap.textContent=items[i][1];n.textContent=(i+1)+" / "+items.length;}
    function close(){box.remove();document.body.style.overflow="";document.removeEventListener("keydown",key);}
    function key(ev){if(ev.key==="Escape")close();if(ev.key==="ArrowRight")show(i+1);if(ev.key==="ArrowLeft")show(i-1);}
    box.querySelector(".lb-x").onclick=close;box.querySelector(".lb-p").onclick=function(){show(i-1)};box.querySelector(".lb-q").onclick=function(){show(i+1)};
    box.addEventListener("click",function(ev){if(ev.target===box)close();});
    var x0=null;box.addEventListener("touchstart",function(ev){x0=ev.touches[0].clientX},{passive:true});
    box.addEventListener("touchend",function(ev){if(x0===null)return;var d=ev.changedTouches[0].clientX-x0;if(Math.abs(d)>40)show(i+(d<0?1:-1));x0=null;});
    document.addEventListener("keydown",key);document.body.style.overflow="hidden";document.body.appendChild(box);show(0);
  });
})();
