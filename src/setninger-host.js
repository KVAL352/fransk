// Setningene til spill 10 (høstpakken, trinn 3): se PLAN-host.md, «Spill 10».
// Bare de 8 verbene i pakken og høstordene fra spill 9, pluss småord som ikke er øvd (un, une, des, le, la, les, dans, de).
// Nummer (1-N) er nøkkelen Fremgang bruker: del 1 bruker 1..N, del 2 bruker N+1..2N. Ikke endre rekkefølgen etter at
// noen har spilt, legg nye setninger bakerst.
//
// ord: brikkene i del 1, i riktig rekkefølge og med små bokstaver. j' og l' henger fast i ordet etter (én brikke).
// betyd: [nb, en, ar, ro, ru, sq, pt]. Franske setninger, nb og en: Claude, ikke kontrollert av noen som kan fransk godt.
// ar, ro, ru, sq, pt (pt-PT): Claude-utkast, ikke lest av noen som kan språkene.
// «vous» er oversatt som flertall (dere), ikke høflig form.

(function () {
  var SPRAK = ["nb", "en", "ar", "ro", "ru", "sq", "pt"];
  var RADER = [
    [["je", "porte", "un", "bonnet"],
      ["Jeg har på meg en lue.", "I am wearing a woolly hat.", "أنا أرتدي قبعة صوفية.", "Eu port o căciulă.", "Я ношу шапку.", "Unë mbaj një kapelë leshi.", "Eu uso um gorro."]],
    [["tu", "portes", "une", "écharpe"],
      ["Du har på deg et skjerf.", "You are wearing a scarf.", "أنتَ ترتدي وشاحًا.", "Tu porți un fular.", "Ты носишь шарф.", "Ti mban një shall.", "Tu usas um cachecol."]],
    [["il", "porte", "un", "manteau"],
      ["Han har på seg en frakk.", "He is wearing a coat.", "هو يرتدي معطفًا.", "El poartă un palton.", "Он носит пальто.", "Ai mban një pallto.", "Ele usa um casaco."]],
    [["elle", "porte", "des", "bottes"],
      ["Hun har på seg støvler.", "She is wearing boots.", "هي ترتدي جزمة.", "Ea poartă cizme.", "Она носит сапоги.", "Ajo mban çizme.", "Ela usa botas."]],
    [["nous", "portons", "des", "gants"],
      ["Vi har på oss hansker.", "We are wearing gloves.", "نحن نرتدي قفازات.", "Noi purtăm mănuși.", "Мы носим перчатки.", "Ne mbajmë doreza.", "Nós usamos luvas."]],
    [["vous", "portez", "un", "pull"],
      ["Dere har på dere en genser.", "You (all) are wearing a jumper.", "أنتم ترتدون كنزة.", "Voi purtați un pulover.", "Вы носите свитер.", "Ju mbani një pulovër.", "Vocês usam uma camisola."]],
    [["le", "renard", "habite", "dans", "la", "forêt"],
      ["Reven bor i skogen.", "The fox lives in the forest.", "الثعلب يعيش في الغابة.", "Vulpea locuiește în pădure.", "Лиса живёт в лесу.", "Dhelpra jeton në pyll.", "A raposa vive na floresta."]],
    [["l'oiseau", "habite", "dans", "l'arbre"],
      ["Fuglen bor i treet.", "The bird lives in the tree.", "الطائر يعيش في الشجرة.", "Pasărea locuiește în copac.", "Птица живёт на дереве.", "Zogu jeton në pemë.", "O pássaro vive na árvore."]],
    [["l'écureuil", "mange", "une", "noix"],
      ["Ekornet spiser en valnøtt.", "The squirrel is eating a walnut.", "السنجاب يأكل جوزة.", "Veverița mănâncă o nucă.", "Белка ест орех.", "Ketri ha një arrë.", "O esquilo come uma noz."]],
    [["le", "hérisson", "mange", "une", "pomme"],
      ["Pinnsvinet spiser et eple.", "The hedgehog is eating an apple.", "القنفذ يأكل تفاحة.", "Ariciul mănâncă un măr.", "Ёж ест яблоко.", "Iriqi ha një mollë.", "O ouriço come uma maçã."]],
    [["nous", "mangeons", "une", "tarte"],
      ["Vi spiser en pai.", "We are eating a tart.", "نحن نأكل فطيرة.", "Noi mâncăm o tartă.", "Мы едим пирог.", "Ne hamë një pite.", "Nós comemos uma tarte."]],
    [["ils", "mangent", "des", "champignons"],
      ["De spiser sopp.", "They are eating mushrooms.", "هم يأكلون الفطر.", "Ei mănâncă ciuperci.", "Они едят грибы.", "Ata hanë kërpudha.", "Eles comem cogumelos."]],
    [["j'adore", "le", "soleil"],
      ["Jeg elsker sola.", "I love the sun.", "أنا أعشق الشمس.", "Eu ador soarele.", "Я обожаю солнце.", "Unë e adhuroj diellin.", "Eu adoro o sol."]],
    [["tu", "adores", "la", "confiture"],
      ["Du elsker syltetøy.", "You love jam.", "أنتَ تعشق المربى.", "Tu adori gemul.", "Ты обожаешь варенье.", "Ti e adhuron reçelin.", "Tu adoras compota."]],
    [["j'aime", "la", "pluie"],
      ["Jeg liker regnet.", "I like the rain.", "أنا أحب المطر.", "Îmi place ploaia.", "Я люблю дождь.", "Mua më pëlqen shiu.", "Eu gosto da chuva."]],
    [["elles", "aiment", "les", "poires"],
      ["De liker pærer.", "They like pears.", "هنّ يحببن الكمثرى.", "Lor le plac perele.", "Они любят груши.", "Atyre u pëlqejnë dardhat.", "Elas gostam de peras."]],
    [["la", "feuille", "tombe", "de", "l'arbre"],
      ["Bladet faller fra treet.", "The leaf falls from the tree.", "الورقة تسقط من الشجرة.", "Frunza cade din copac.", "Лист падает с дерева.", "Gjethja bie nga pema.", "A folha cai da árvore."]],
    [["les", "feuilles", "tombent", "dans", "la", "rivière"],
      ["Bladene faller i elva.", "The leaves fall into the river.", "الأوراق تسقط في النهر.", "Frunzele cad în râu.", "Листья падают в реку.", "Gjethet bien në lumë.", "As folhas caem no rio."]],
    [["j'écoute", "le", "vent"],
      ["Jeg hører på vinden.", "I am listening to the wind.", "أنا أستمع إلى الرياح.", "Eu ascult vântul.", "Я слушаю ветер.", "Unë dëgjoj erën.", "Eu ouço o vento."]],
    [["vous", "écoutez", "le", "hibou"],
      ["Dere hører på ugla.", "You (all) are listening to the owl.", "أنتم تستمعون إلى البومة.", "Voi ascultați bufnița.", "Вы слушаете сову.", "Ju dëgjoni bufin.", "Vocês ouvem o mocho."]],
    [["tu", "parles", "de", "la", "pluie"],
      ["Du snakker om regnet.", "You are talking about the rain.", "أنتَ تتحدث عن المطر.", "Tu vorbești despre ploaie.", "Ты говоришь о дожде.", "Ti flet për shiun.", "Tu falas da chuva."]],
  ];

  var LISTE = RADER.map(function (r, i) { return { nr: i + 1, ord: r[0], betyd: r[1] }; });

  function stor(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  // Setningen skrevet ut: stor forbokstav og punktum.
  function fasit(s) { return stor(s.ord.join(" ")) + "."; }
  // Betydningen på språket med koden, engelsk hvis språket mangler.
  function betyd(s, kode) {
    var i = SPRAK.indexOf(kode);
    return s.betyd[i < 0 ? 1 : i];
  }
  function hent(nr) { return LISTE[nr - 1] || null; }

  var api = { LISTE: LISTE, ANTALL: LISTE.length, SPRAK: SPRAK, fasit: fasit, betyd: betyd, hent: hent, stor: stor };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else window.SetningerHost = api;
})();
