/* Données du Coran : noms des sourates, nombre de versets, débuts des 60 hizb. */
const SURAH_AR = ["الفاتحة","البقرة","آل عمران","النساء","المائدة","الأنعام","الأعراف","الأنفال","التوبة","يونس","هود","يوسف","الرعد","إبراهيم","الحجر","النحل","الإسراء","الكهف","مريم","طه","الأنبياء","الحج","المؤمنون","النور","الفرقان","الشعراء","النمل","القصص","العنكبوت","الروم","لقمان","السجدة","الأحزاب","سبأ","فاطر","يس","الصافات","ص","الزمر","غافر","فصلت","الشورى","الزخرف","الدخان","الجاثية","الأحقاف","محمد","الفتح","الحجرات","ق","الذاريات","الطور","النجم","القمر","الرحمن","الواقعة","الحديد","المجادلة","الحشر","الممتحنة","الصف","الجمعة","المنافقون","التغابن","الطلاق","التحريم","الملك","القلم","الحاقة","المعارج","نوح","الجن","المزمل","المدثر","القيامة","الإنسان","المرسلات","النبأ","النازعات","عبس","التكوير","الانفطار","المطففين","الانشقاق","البروج","الطارق","الأعلى","الغاشية","الفجر","البلد","الشمس","الليل","الضحى","الشرح","التين","العلق","القدر","البينة","الزلزلة","العاديات","القارعة","التكاثر","العصر","الهمزة","الفيل","قريش","الماعون","الكوثر","الكافرون","النصر","المسد","الإخلاص","الفلق","الناس"];

const SURAH_FR = ["Al-Fatiha","Al-Baqara","Al-Imran","An-Nisa","Al-Ma'ida","Al-An'am","Al-A'raf","Al-Anfal","At-Tawba","Yunus","Hud","Yusuf","Ar-Ra'd","Ibrahim","Al-Hijr","An-Nahl","Al-Isra","Al-Kahf","Maryam","Ta-Ha","Al-Anbiya","Al-Hajj","Al-Mu'minun","An-Nur","Al-Furqan","Ash-Shu'ara","An-Naml","Al-Qasas","Al-Ankabut","Ar-Rum","Luqman","As-Sajda","Al-Ahzab","Saba","Fatir","Ya-Sin","As-Saffat","Sad","Az-Zumar","Ghafir","Fussilat","Ash-Shura","Az-Zukhruf","Ad-Dukhan","Al-Jathiya","Al-Ahqaf","Muhammad","Al-Fath","Al-Hujurat","Qaf","Adh-Dhariyat","At-Tur","An-Najm","Al-Qamar","Ar-Rahman","Al-Waqi'a","Al-Hadid","Al-Mujadila","Al-Hashr","Al-Mumtahana","As-Saff","Al-Jumu'a","Al-Munafiqun","At-Taghabun","At-Talaq","At-Tahrim","Al-Mulk","Al-Qalam","Al-Haqqa","Al-Ma'arij","Nuh","Al-Jinn","Al-Muzzammil","Al-Muddaththir","Al-Qiyama","Al-Insan","Al-Mursalat","An-Naba","An-Nazi'at","Abasa","At-Takwir","Al-Infitar","Al-Mutaffifin","Al-Inshiqaq","Al-Buruj","At-Tariq","Al-A'la","Al-Ghashiya","Al-Fajr","Al-Balad","Ash-Shams","Al-Layl","Ad-Duha","Ash-Sharh","At-Tin","Al-Alaq","Al-Qadr","Al-Bayyina","Az-Zalzala","Al-Adiyat","Al-Qari'a","At-Takathur","Al-Asr","Al-Humaza","Al-Fil","Quraysh","Al-Ma'un","Al-Kawthar","Al-Kafirun","An-Nasr","Al-Masad","Al-Ikhlas","Al-Falaq","An-Nas"];

const SURAH_AYAHS = [7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6];

/* Début de chaque hizb [sourate, verset] (hizb 1 à 60, ordre du mushaf). */
const HIZB_START = [[1,1],[2,75],[2,142],[2,203],[2,253],[3,15],[3,93],[3,171],[4,24],[4,88],[4,148],[5,27],[5,82],[6,36],[6,111],[7,1],[7,88],[7,171],[8,41],[9,34],[9,93],[10,26],[11,6],[11,84],[12,53],[13,19],[15,1],[16,51],[17,1],[17,99],[18,75],[20,1],[21,1],[22,1],[23,1],[24,21],[25,21],[26,111],[27,56],[28,51],[29,46],[31,22],[33,31],[34,24],[36,28],[37,145],[39,32],[40,41],[41,47],[43,24],[46,1],[48,18],[51,31],[55,1],[58,1],[62,1],[67,1],[72,1],[78,1],[87,1]];

/* Renvoie le numéro de hizb (1-60) qui contient sourate:verset. */
function hizbOf(surah, ayah) {
  let h = 1;
  for (let i = 0; i < HIZB_START.length; i++) {
    const [s, a] = HIZB_START[i];
    if (surah > s || (surah === s && ayah >= a)) h = i + 1; else break;
  }
  return h;
}
