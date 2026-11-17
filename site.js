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
  var MAP={"大きな瞳の奥に、浮世絵を思わせる青い波がうねります。ナナハチカは、時代とともに変わるものと、時を経ても変わらないものを思いながら、浮世絵の表現を現代の作品に取り入れました。描かれた瞳を見つめていると、自分が見ているものを、何を根拠に「真実」だと感じるのか。そんな問いが浮かんできます。": ["大きな瞳の奥に、", "浮世絵を思わせる", "青い波がうねります。", "ナナハチカは、", "時代とともに変わるものと、", "時を経ても変わらないものを思いながら、", "浮世絵の表現を", "現代の作品に取り入れました。", "描かれた瞳を見つめていると、", "自分が見ているものを、", "何を根拠に「真実」だと感じるのか。", "そんな問いが浮かんできます。"], "赤や青の花が人物の横顔に重なり、その周りを蝶が舞います。人物と花の境目がほどけていくように見える構図には、人も自然の一部として生きているという作家のまなざしが感じられます。花や蝶に託したのは、私たちを取り巻く自然と、そこに息づく命への祈りです。": ["赤や青の花が", "人物の横顔に重なり、", "その周りを蝶が舞います。", "人物と花の境目が", "ほどけていくように見える構図には、", "人も自然の一部として", "生きているという", "作家のまなざしが感じられます。", "花や蝶に託したのは、", "私たちを取り巻く自然と、", "そこに息づく命への祈りです。"], "株式会社ウイングは、不動産の取得・保有・開発と、自由診療クリニックの開業・成長支援を通じて、新たな価値の創造に取り組みます。": ["株式会社ウイングは、", "不動産の取得・保有・開発と、", "自由診療クリニックの", "開業・成長支援を通じて、", "新たな価値の創造に取り組みます。"], "自由診療クリニックの市場調査・開業準備から、開業後の運営、分院展開・M&A・事業譲渡まで。すべてを一貫して支援します。": ["自由診療クリニックの", "市場調査・開業準備から、", "開業後の運営、", "分院展開・M&A・事業譲渡まで。", "すべてを一貫して支援します。"], "市場調査や物件選び、内装の工事図面から、スタッフの求人・教育、開業届などの手続き、看板やホームページの制作まで。開業後も、スタッフ教育・院内オペレーション、売上管理、広告・SNS対策など、クリニック運営に関わるあらゆる業務を支えます。": ["市場調査や物件選び、", "内装の工事図面から、", "スタッフの求人・教育、", "開業届などの手続き、", "看板やホームページの制作まで。", "開業後も、", "スタッフ教育・院内オペレーション、", "売上管理、", "広告・SNS対策など、", "クリニック運営に関わる", "あらゆる業務を支えます。"], "さらに分院展開やM&A、事業譲渡といった「出口」まで。株式会社ウイングは、クリニックの構想から成長、そしてその先までを一貫してサポートします。": ["さらに", "分院展開やM&A、事業譲渡といった", "「出口」まで。", "株式会社ウイングは、", "クリニックの構想から成長、", "そしてその先までを", "一貫してサポートします。"], "窓口はひとつ。院長先生が診療に集中できる環境を、私たちがつくります。": ["窓口はひとつ。", "院長先生が診療に集中できる環境を、", "私たちがつくります。"], "アモーレクリニック院長として、NHK「おはよう日本」などの報道番組に出演し、成人年齢引き下げにともなう美容医療の契約トラブルについてコメントしました。雑誌にも取り上げられています。": ["アモーレクリニック院長として、", "NHK「おはよう日本」などの", "報道番組に出演し、", "成人年齢引き下げにともなう", "美容医療の契約トラブルについて", "コメントしました。", "雑誌にも取り上げられています。"], "駅の看板やデジタルサイネージ、市バスのラッピング、ビルの屋上・壁面看板まで。デザインから掲出まで一貫して手がけています。": ["駅の看板や", "デジタルサイネージ、", "市バスのラッピング、", "ビルの屋上・壁面看板まで。", "デザインから掲出まで", "一貫して手がけています。"], "取得した不動産は長期保有・運用が基本方針です。開発用地のほか、中古ビルや中古マンション、収益不動産も幅広く検討します。売却物件のご紹介・売却のご相談を歓迎しています。": ["取得した不動産は", "長期保有・運用が基本方針です。", "開発用地のほか、", "中古ビルや中古マンション、", "収益不動産も幅広く検討します。", "売却物件のご紹介・売却のご相談を", "歓迎しています。"], "小規模から中規模の不動産の取得を得意としています。大規模デベロッパーが扱いにくい案件も、規模や条件に応じて柔軟に検討します。": ["小規模から中規模の", "不動産の取得を得意としています。", "大規模デベロッパーが", "扱いにくい案件も、", "規模や条件に応じて", "柔軟に検討します。"], "※保有物件は長期保有を基本としており、現在売却の予定はありません。ご購入のご希望については個別にご相談を承ります。": ["※保有物件は長期保有を基本としており、", "現在売却の予定はありません。", "ご購入のご希望については", "個別にご相談を承ります。"], "土地の取得からマンションの建設・売却まで手掛けた事例と、その他の販売実績をご紹介します。": ["土地の取得から", "マンションの建設・売却まで", "手掛けた事例と、", "その他の販売実績をご紹介します。"], "不動産と医療の領域で、実務を重視した価値の創造を目指します。": ["不動産と医療の領域で、", "実務を重視した価値の創造を目指します。"], "自由診療クリニックの開業・経営に関するご相談を承ります。": ["自由診療クリニックの", "開業・経営に関するご相談を承ります。"], "法令上、資格を要する申請代理等は適切な専門家との連携を前提とします。": ["法令上、", "資格を要する申請代理等は", "適切な専門家との連携を前提とします。"], "現在は試作版です。お問い合わせフォームと送信先は、次の制作工程で設定します。": ["現在は試作版です。", "お問い合わせフォームと送信先は、", "次の制作工程で設定します。"], "開業準備から開院後の集患、分院展開までご相談いただけます。": ["開業準備から開院後の集患、", "分院展開までご相談いただけます。"], "株式会社ウイングが保有する不動産をご紹介します。": ["株式会社ウイングが保有する", "不動産をご紹介します。"], "土地取得から建設・売却まで一貫して手掛けた4つの事例です。": ["土地取得から建設・売却まで", "一貫して手掛けた4つの事例です。"], "看板・広告の制作から集患まで支援しています。": ["看板・広告の制作から集患まで", "支援しています。"], "着工から完成までの工事の様子を、工程順にご紹介します。": ["着工から完成までの工事の様子を、", "工程順にご紹介します。"], "売却物件のご紹介・買取相談、当社保有物件の購入相談を承ります。お問い合わせはメールにて承ります。": ["売却物件のご紹介・買取相談、", "当社保有物件の購入相談を承ります。", "お問い合わせはメールにて承ります。"]};
  var sel="p,dd,td,th,h1,h2,h3,h4,li,figcaption,.gcap,.cap,a.more-link,a.btn,.shop-name";
  document.querySelectorAll(sel).forEach(function(el){
    if(el.closest(".h3-vert,.eyebrow,.num-label,.artist,.work-sub,.h3-eyebrow,.ph-label,.site-footer"))return;
    var key=el.textContent.replace(/\s+/g,"");
    if(MAP[key]&&!el.querySelector("a,img,br")){
      el.textContent="";MAP[key].forEach(function(x){var s=document.createElement("span");s.className="ln";s.textContent=x;el.appendChild(s);});
      el.classList.add("lined");return;}
    if(/^(P|LI)$/.test(el.tagName)&&key.length>40){el.classList.add("flow");return;}
    var w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),ns=[],n;while(n=w.nextNode())ns.push(n);
    ns.forEach(function(t){if(!/[\u3040-\u30FF\u4E00-\u9FFF]/.test(t.data))return;
      var par=t.parentNode;if(par.classList&&par.classList.contains("nb")&&t.data.length<=18)return;
      var f=document.createDocumentFragment();seg(t.data).forEach(function(x){var s=document.createElement("span");s.className="nb";s.textContent=x;f.appendChild(s);});
      par.replaceChild(f,t);});
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
