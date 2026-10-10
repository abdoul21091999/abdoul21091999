/* =====================================================================
   AMÃAN TECH — COORDONNÉES OFFICIELLES
   Renseignez ici votre numéro et votre email : ils s'affichent dans la
   section Contact, et le numéro WhatsApp active le bouton flottant et
   l'envoi direct du formulaire.
   Format international sans espaces, ex. phone:"+221 77 123 45 67",
   whatsapp:"221771234567", email:"contact@amaantech.sn"
   ===================================================================== */
const CONTACT={phone:"",whatsapp:"",email:""};

const AR={bar_cta:"تواصل معنا",def:"اسم عربي: الطمأنينة، الثقة، الحماية.",h1:"نحمي. نبني. <span class=\"hl\">نجهّز.</span>",
lede:"تجمع أمان تك بين الأمن الإلكتروني، وتطوير المواقع والتطبيقات، وبيع الأجهزة الإلكترونية. شريك تقني واحد للعائلات والشركات، من طوبى إلى داكار.",
cta1:"اكتشف أقسامنا",cta2:"حدّثنا عن مشروعك",
n1:"الأمن",n2:"المواقع والتطبيقات",n3:"الإلكترونيات",n4:"الأمن السيبراني",
po_k:"أقسامنا",po_t:"أربعة تخصصات، عنوان واحد",po_l:"يمكنك أن تكلّفنا بحاجة واحدة أو بكل تجهيزاتك التقنية.",
po1:"الأمن الإلكتروني",po1p:"أقفال ذكية، كاميرات، إنذارات مبرمجة ومتتبّعات GPS.",po2:"المواقع والتطبيقات",po2p:"مواقع تعريفية، متاجر إلكترونية وتطبيقات حسب الطلب.",po3:"بيع الإلكترونيات",po3p:"هواتف، حواسيب، معدات الشبكة، أجهزة ذكية وإكسسوارات.",po4:"الأمن السيبراني والشبكات",po4p:"تدقيق، جدار حماية، واي فاي آمن وتدريب الفرق.",go:"← اكتشف",
w_k:"استوديو الويب",w_t:"نشاطك ظاهر وقابل للبيع على الإنترنت",w_l:"نصمّم مواقع وتطبيقات سريعة، متعددة اللغات ومصمّمة للهاتف، حيث يبحث عنك زبائنك.",
wo1:"موقع تعريفي",wo1p:"تقديم، خدمات، تواصل عبر واتساب، وظهور في Google.",wo1e:"عربي · فرنسي · إنجليزي",wo2:"متجر إلكتروني",wo2p:"كتالوج، طلبات، ودفع عبر Wave أو Orange Money.",wo3:"تطبيق ويب وهاتف",wo3p:"أدوات تسيير، حجز، متابعة الزبائن أو التوصيل.",wo3e:"حسب الطلب",wo4:"الاستضافة والصيانة",wo4p:"اسم النطاق، بريد مهني، نسخ احتياطي وتحديثات.",wo4e:"متابعة",
b_k:"بيع الإلكترونيات",b_t:"الجهاز المناسب، بنصيحة وتركيب",b_l:"يتجهّز عندنا الأفراد والشركات. ننصح حسب الاستعمال والميزانية، ويمكننا التركيب والإعداد في المكان.",
b1:"هواتف وأجهزة لوحية",b1p:"هواتف ذكية، أجهزة لوحية، ساعات ذكية.",b2:"حواسيب",b2p:"محمولة، مكتبية، شاشات وطابعات.",b3:"الشبكة والواي فاي",b3p:"راوترات، مقوّيات إشارة، سويتشات، تمديدات.",b4:"الأمن والمراقبة",b4p:"كاميرات، أقفال ذكية، إنذارات، متتبّعات.",b5:"المنزل الذكي",b5p:"مقابس، إنارة، أجهزة اتصال داخلي بالفيديو، حسّاسات.",b6:"إكسسوارات",b6p:"شواحن، بطاريات خارجية، كابلات، وسائط تخزين.",
pk1:"الطلب عبر واتساب",pk2:"نصيحة قبل الشراء",pk3:"تركيب وإعداد",pk4:"عروض أسعار للشركات",watch:"حراسة نشطة · 24/7",
p_k:"خطة الحماية",p_t:"لكل مكان نقاط ضعفه",p_l:"اختر نوع الموقع. يوضّح المخطط أين نضع الأقفال والكاميرات والحسّاسات ومعدات الشبكة.",
tab_home:"فيلا",tab_shop:"متجر",tab_office:"مكتب",lg_L:"الأقفال والدخول",lg_C:"كاميرات IP",lg_A:"حسّاسات الإنذار",lg_R:"شبكة مؤمّنة",p_note:"مخطط توضيحي. يُحدَّد كل تركيب بعد الزيارة.",
g_k:"تتبّع GPS",g_t:"الأشخاص أيضًا يحتاجون إلى حماية",g_l:"خارج الجدران، تبقيك متتبّعاتنا على صلة بمن يهمّك.",
g1:"الأطفال",g1p:"ساعة أو متتبّع بموقع لحظي، ومناطق آمنة حول المدرسة، وزر طوارئ.",g2:"حجاج الحج والعمرة",g2p:"سوار للعثور على قريبك وسط زحام مكة وطمأنة العائلة في السنغال.",g3:"الأغراض الثمينة",g3p:"محفظة ذكية وشارات للحقائب والمفاتيح والسيارات. تنبيه عند الابتعاد.",
c_k:"الأمن السيبراني",c_t:"كاميرا سيئة الإعداد تفتح الباب",c_l:"تمرّ الأجهزة المتصلة عبر شبكتك. نفحصها ونغلقها قبل توصيل أي جهاز.",
ck1:"تغيير كلمات مرور المصنع في كل جهاز",ck2:"واي فاي منفصل للكاميرات والضيوف والعمل",ck3:"جدار حماية وتحديثات ونسخ احتياطي",ck4:"تدريب فرقك ضد الاحتيال",
m_k:"معدات الأمن",m_t:"ما نركّبه",pr1:"قفل ذكي",pr1p:"يتكيّف مع بابك الحالي.",pr1o:"رمز، بصمة، بطاقة، هاتف",pr1u:"منزل، مكتب، مخزن",
pr2:"كاميرا IP",pr2p:"مشاهدة مباشرة من هاتفك.",pr2o:"Full HD، رؤية ليلية",pr2u:"داخلي وخارجي",
pr3:"لوحة إنذار",pr3p:"قواعد حسب الوقت والمنطقة والمستخدم.",pr3o:"فتح، حركة، دخان",pr3u:"صفّارة، اتصال، إشعار",
pr4:"ساعة GPS للأطفال",pr4p:"موقع، مكالمات مسموحة، زر SOS.",pr4o:"لحظي، مناطق آمنة",pr4u:"المدرسة، التنقّل",
pr5:"سوار الحاج",pr5p:"مصمّم للحج والعمرة.",pr5o:"GPS، تنبيه الانفصال",pr5u:"المجموعات والوكالات",
pr6:"جدار حماية للمؤسسات",pr6p:"يعزل كاميراتك ونشاطك.",pr6o:"تصفية، VLAN، VPN",pr6u:"متاجر، مكاتب",
dt_open:"الفتح",dt_use:"الاستعمال",dt_view:"الصورة",dt_sens:"الحسّاسات",dt_alert:"التنبيه",dt_track:"التتبّع",dt_prot:"الحماية",rail:"← اسحب للمزيد",
pt_k:"البروتوكول",pt_t:"من الاتصال إلى الحراسة",ph1:"الزيارة",ph1p:"تحديد المداخل والزوايا العمياء والشبكة القائمة.",ph2:"المخطط والعرض",ph2p:"خطة حماية وسعر مفصّل بندًا بندًا.",ph3:"التركيب",ph3p:"تركيب وإعداد وتشغيل من هاتفك.",ph4:"الحراسة",ph4p:"صيانة وتحديثات وتدخّل عند أي إنذار.",
ct_k:"اتصل بنا",ct_t:"أخبرنا بما تريد حمايته.",ct_ph:"هاتف / واتساب",ct_em:"البريد",ct_zone:"المنطقة",ct_zone_v:"طوبى، داكار، ثم كل السنغال",
f_name:"الاسم",f_tel:"الهاتف",f_site:"الحاجة",o_other:"آخر",f_city:"المدينة",f_msg:"حاجتك",f_go:"جهّز طلبي",f_err:"أدخل اسمك ورقم هاتفك.",f_ok:"الطلب جاهز. انسخه أو أرسله عبر واتساب.",f_cp:"نسخ",
foot:"أمان تك · التكنولوجيا والأمن السيبراني · السنغال",skip:"انتقل إلى المحتوى",partner:"شريكنا في البرمجيات والبيانات:",pend:"قيد الإضافة",copy:"نسخ",copied:"تم"};
const FR={pend:"À compléter",copy:"Copier",copied:"Copié"};
document.querySelectorAll("[data-i18n]").forEach(e=>{if(!(e.dataset.i18n in FR))FR[e.dataset.i18n]=e.textContent});
document.querySelectorAll("[data-i18n-html]").forEach(e=>FR[e.dataset.i18nHtml]=e.innerHTML);
let lang="fr";const t=k=>(lang==="ar"?AR:FR)[k]??FR[k]??k;

/* ---- site plan ---- */
const DEV={ // id: [x,y,kind]
 door:[300,350,"L"],gate:[570,270,"L"],off:[400,165,"L"],
 c1:[45,45,"C"],c2:[555,45,"C"],c3:[300,300,"C"],c4:[555,335,"C"],c5:[150,180,"C"],
 a1:[130,30,"A"],a2:[30,250,"A"],a3:[480,30,"A"],a4:[250,110,"A"],a5:[400,330,"A"],
 r1:[330,110,"R"],r2:[470,100,"R"]};
const SC={
 home:{fr:["Villa familiale","Porte d'entrée et portail sous serrure intelligente, cour et garage filmés, fenêtres sous alarme armée la nuit."],
       ar:["فيلا عائلية","الباب الرئيسي والبوابة بأقفال ذكية، الفناء والمرآب تحت الكاميرات، والنوافذ تحت إنذار يُفعَّل ليلًا."],
       on:["door","gate","c1","c3","c4","a1","a2","a3","a4","r1"],rooms:{fr:["SALON","CHAMBRE","BUREAU","COUR","GARAGE"],ar:["الصالون","غرفة النوم","المكتب","الفناء","المرآب"]}},
 shop:{fr:["Commerce","Caméra sur la caisse et l'entrée, réserve fermée par code, alarme hors horaires et Wi-Fi clients isolé."],
       ar:["متجر","كاميرا على الصندوق والمدخل، مخزن مغلق برمز، إنذار خارج أوقات العمل، وواي فاي الزبائن معزول."],
       on:["door","off","c1","c2","c3","c5","a2","a5","r1","r2"],rooms:{fr:["BOUTIQUE","CAISSE","RÉSERVE","ENTRÉE","STOCK"],ar:["المتجر","الصندوق","المخزن","المدخل","البضائع"]}},
 office:{fr:["Bureau / PME","Accès par badge et historique des entrées, salle serveur verrouillée, caméras aux accès, réseau segmenté et pare-feu."],
       ar:["مكتب / مؤسسة","دخول بالبطاقة مع سجلّ، غرفة الخادم مقفلة، كاميرات عند المداخل، شبكة مقسّمة وجدار حماية."],
       on:["door","gate","off","c1","c2","c3","c4","a4","a5","r1","r2"],rooms:{fr:["OPEN SPACE","DIRECTION","SERVEUR","ACCUEIL","ARCHIVES"],ar:["المكاتب","الإدارة","الخادم","الاستقبال","الأرشيف"]}}};
let scene="home";
const NS="http://www.w3.org/2000/svg",g=document.getElementById("devs");
for(const[id,[x,y,k]] of Object.entries(DEV)){const e=document.createElementNS(NS,"g");e.setAttribute("class",`dev k-${k}`);e.id="d-"+id;
 e.innerHTML=`<circle class="halo" cx="${x}" cy="${y}" r="14"/><circle class="core" cx="${x}" cy="${y}" r="10"/><text x="${x}" y="${y}">${k}</text>`;g.append(e)}
function drawScene(){const s=SC[scene];const on=new Set(s.on);const n={L:0,C:0,A:0,R:0};
 for(const[id,[,,k]] of Object.entries(DEV)){const e=document.getElementById("d-"+id);const a=on.has(id);e.classList.toggle("off",!a);e.classList.toggle("on",a);if(a)n[k]++}
 for(const k in n)document.getElementById("n-"+k).textContent=n[k];
 const L=lang==="ar"?"ar":"fr";document.getElementById("sc-t").textContent=s[L][0];document.getElementById("sc-p").textContent=s[L][1];
 s.rooms[L].forEach((r,i)=>document.getElementById("rl"+(i+1)).textContent=r);
 document.querySelectorAll(".tab").forEach(b=>b.setAttribute("aria-selected",b.dataset.s===scene))}
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{scene=b.dataset.s;drawScene()});

/* ---- terminal ---- */
const TERM=[["cm","$ amaan-audit --site villa-touba"],["","Scan du réseau local…"],["","12 appareils détectés"],["bad","✗ caméra-cour : mot de passe d'usine"],["wr","! routeur : firmware non à jour"],["wr","! Wi-Fi invités sur le même réseau"],["cm","$ amaan-secure --apply"],["ok","✓ mots de passe uniques générés"],["ok","✓ caméras isolées sur VLAN 20"],["ok","✓ firmware mis à jour"],["ok","✓ score de sécurité : 34 → 92 / 100"]];
const pre=document.getElementById("term");
function termAll(){pre.innerHTML=TERM.map(([c,s])=>`<span class="${c}">${s}</span>`).join("\n")}
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
termAll();
if(!reduce){let i=0;const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){io.disconnect();pre.innerHTML="";(function step(){if(i>=TERM.length){setTimeout(()=>{i=0;pre.innerHTML="";step()},6000);return}const[c,s]=TERM[i++];pre.insertAdjacentHTML("beforeend",(i>1?"\n":"")+`<span class="${c}">${s}</span>`);setTimeout(step,c==="cm"?900:420)})()}},{threshold:.4});io.observe(pre)}

/* ---- browser mockup ---- */
const VIEWS={
 vit:{url:"votre-entreprise.sn",html:`<div class="wf hero-b"></div><div class="wf line"></div><div class="wf line s"></div><div class="wf-row"><div class="wf"></div><div class="wf"></div><div class="wf"></div></div><div class="wf-btn"></div>`},
 shop:{url:"boutique.votre-entreprise.sn",html:`<div class="wf line s"></div><div class="wf-row"><div class="wf"></div><div class="wf"></div><div class="wf"></div></div><div class="wf-row"><div class="wf"></div><div class="wf"></div><div class="wf"></div></div><div style="display:flex;gap:10px"><div class="wf-btn"></div><div class="wf-btn" style="background:var(--safe)"></div></div>`},
 app:{url:"app.votre-entreprise.sn/tableau",html:`<div style="display:grid;grid-template-columns:70px 1fr;gap:12px"><div class="wf" style="height:220px"></div><div style="display:grid;gap:10px;align-content:start"><div class="wf-row"><div class="wf" style="height:46px"></div><div class="wf" style="height:46px"></div><div class="wf" style="height:46px"></div></div><div class="wf hero-b" style="height:110px"></div><div class="wf line"></div><div class="wf line s"></div></div></div>`}};
function showView(k){document.getElementById("b-url").textContent=VIEWS[k].url;document.getElementById("b-body").innerHTML=VIEWS[k].html;document.querySelectorAll(".b-tabs button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.v===k))}
document.querySelectorAll(".b-tabs button").forEach(b=>b.onclick=()=>showView(b.dataset.v));showView("vit");

/* ---- circuit canvas ---- */
const cv=document.getElementById("circuit"),cx=cv.getContext("2d");let W,H,traces=[],pulses=[];
function build(){const r=cv.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);W=r.width;H=r.height;cv.width=W*d;cv.height=H*d;cx.setTransform(d,0,0,d,0,0);
 const rtl=document.documentElement.dir==="rtl",sx=W>880?(rtl?W*.26:W*.74):W*.5,sy=W>880?H*.5:H*.2;traces=[];
 for(let i=0;i<22;i++){const a=i/22*Math.PI*2+.1;let x=sx+Math.cos(a)*90,y=sy+Math.sin(a)*90;const pts=[[sx+Math.cos(a)*40,sy+Math.sin(a)*40],[x,y]];
  for(let s=0;s<3;s++){const len=60+Math.random()*120;if(s%2===0){x+=Math.cos(a)*len;y+=Math.sin(a)*len}else{Math.abs(Math.cos(a))>Math.abs(Math.sin(a))?x+=Math.sign(Math.cos(a))*len:y+=Math.sign(Math.sin(a))*len}pts.push([x,y])}
  traces.push(pts)}
 pulses=traces.map((_,i)=>({i,p:Math.random()}))}
function plen(pts){let l=0;for(let i=1;i<pts.length;i++)l+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);return l}
function at(pts,f){let L=plen(pts)*f;for(let i=1;i<pts.length;i++){const s=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);if(L<=s){const k=L/s;return[pts[i-1][0]+(pts[i][0]-pts[i-1][0])*k,pts[i-1][1]+(pts[i][1]-pts[i-1][1])*k]}L-=s}return pts[pts.length-1]}
function frame(){cx.clearRect(0,0,W,H);cx.lineWidth=1;
 for(const pts of traces){cx.strokeStyle="rgba(111,156,199,.16)";cx.beginPath();cx.moveTo(...pts[0]);for(const p of pts.slice(1))cx.lineTo(...p);cx.stroke();
  const e=pts[pts.length-1];cx.fillStyle="rgba(62,230,255,.35)";cx.beginPath();cx.arc(e[0],e[1],2.5,0,7);cx.fill()}
 for(const u of pulses){u.p-=.004;if(u.p<0)u.p=1;const[x,y]=at(traces[u.i],u.p);const gr=cx.createRadialGradient(x,y,0,x,y,10);gr.addColorStop(0,"rgba(62,230,255,.9)");gr.addColorStop(1,"rgba(62,230,255,0)");cx.fillStyle=gr;cx.beginPath();cx.arc(x,y,10,0,7);cx.fill()}
 if(!reduce)requestAnimationFrame(frame)}
build();frame();addEventListener("resize",()=>{build();if(reduce)frame()});

/* ---- i18n ---- */
function renderContact(){[["v-phone",CONTACT.phone],["v-email",CONTACT.email]].forEach(([id,v])=>{const el=document.getElementById(id);el.innerHTML="";
 if(!v){el.textContent=t("pend");el.classList.add("pend");return}el.classList.remove("pend");const s=document.createElement("span");s.dir="ltr";s.textContent=v;el.append(s);
 const b=document.createElement("button");b.type="button";b.className="cp";b.textContent=t("copy");b.onclick=()=>{try{navigator.clipboard.writeText(v).then(()=>b.textContent=t("copied"),()=>{})}catch(e){}};el.append(b)})}
function applyLang(l){lang=l;const d=l==="ar"?AR:FR;document.documentElement.lang=l;document.documentElement.dir=l==="ar"?"rtl":"ltr";
 document.querySelectorAll("[data-i18n]").forEach(e=>{const v=d[e.dataset.i18n];if(v!=null)e.textContent=v});
 document.querySelectorAll("[data-i18n-html]").forEach(e=>{const v=d[e.dataset.i18nHtml];if(v!=null)e.innerHTML=v});
 document.getElementById("lang-fr").setAttribute("aria-pressed",l==="fr");document.getElementById("lang-ar").setAttribute("aria-pressed",l==="ar");
 renderContact();drawScene();if(typeof build==="function"){build();if(reduce)frame()}try{localStorage.setItem("amaan-lang",l)}catch(e){}}
document.getElementById("lang-fr").onclick=()=>applyLang("fr");document.getElementById("lang-ar").onclick=()=>applyLang("ar");
let sv=null;try{sv=localStorage.getItem("amaan-lang")}catch(e){}applyLang(sv==="ar"?"ar":"fr");

/* ---- form ---- */
document.getElementById("qform").addEventListener("submit",e=>{e.preventDefault();const v=id=>document.getElementById(id).value.trim();const er=document.getElementById("f-err");
 if(!v("f-name")||!v("f-tel")){er.hidden=false;return}er.hidden=true;
 const m=`${lang==="ar"?"طلب زيارة - أمان تك":"Demande de visite - Amãan Tech"}\n${t("f_name")} : ${v("f-name")}\n${t("f_tel")} : ${v("f-tel")}\n${t("f_site")} : ${document.getElementById("f-site").selectedOptions[0].textContent}\n${t("f_city")} : ${v("f-city")||"-"}\n${t("f_msg")} : ${v("f-msg")||"-"}`;
 document.getElementById("out-t").textContent=m;const wa=document.getElementById("wa");wa.href=waLink(m);document.getElementById("out").hidden=false});
document.getElementById("cpy").onclick=function(){const b=this,tx=document.getElementById("out-t");const fb=()=>{const r=document.createRange();r.selectNodeContents(tx);const s=getSelection();s.removeAllRanges();s.addRange(r)};try{navigator.clipboard.writeText(tx.textContent).then(()=>b.textContent=t("copied"),fb)}catch(e){fb()}};

/* ---- WhatsApp ---- */
function waNum(){return (CONTACT.whatsapp||CONTACT.phone).replace(/\D/g,"")}
function waLink(m){return "https://wa.me/"+waNum()+(m?"?text="+encodeURIComponent(m):"")}
if(waNum()){const f=document.getElementById("wa-float");f.href=waLink("");f.target="_blank";f.rel="noopener";f.hidden=false}

/* ---- mobile menu ---- */
const burger=document.getElementById("burger"),navl=document.getElementById("navl");
function setMenu(o){navl.classList.toggle("open",o);burger.setAttribute("aria-expanded",o);document.body.classList.toggle("menu-open",o)}
burger.onclick=()=>setMenu(!navl.classList.contains("open"));
navl.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>setMenu(false)));
addEventListener("keydown",e=>{if(e.key==="Escape")setMenu(false)});

document.getElementById("yr").textContent=new Date().getFullYear();
