// Verbene fra timen 6. november (se PLAN-time.md). Elleve verb i presens, seks personer hver = 66 oppgaver.
// Id 1-66 er det Fremgang bruker som "tall": id = verbets plass * 6 + personens plass + 1, verbene i nivårekkefølge,
// så velgTall(spill, min, maks) virker per nivå.
//
// Formene er skrevet ut for hånd, ikke generert, så uregelmessige former (mangeons, appelle) står synlig.
// Person 2 (il/elle) og 5 (ils/elles) har samme form; pronomenet velges når oppgaven vises.
// Elisjon: verb med elisjon: true får j' i stedet for je (j'habite, j'ai).

(function () {
  var NIVAER = [
    { nivaa: 1, min: 1, maks: 18, nb: "Mønsteret -e, -es, -e, -ons, -ez, -ent", en: "The pattern -e, -es, -e, -ons, -ez, -ent" },
    { nivaa: 2, min: 19, maks: 42, nb: "j' foran vokal og h", en: "j' before a vowel and h" },
    { nivaa: 3, min: 43, maks: 54, nb: "manger og appeler", en: "manger and appeler" },
    { nivaa: 4, min: 55, maks: 66, nb: "être og avoir", en: "être and avoir" },
  ];

  // Personer: fransk pronomen (il/elle har to), norsk og engelsk.
  var PERSONER = [
    { fr: ["je"], nb: "jeg", en: "I" },
    { fr: ["tu"], nb: "du", en: "you" },
    { fr: ["il", "elle"], nb: ["han", "hun"], en: ["he", "she"] },
    { fr: ["nous"], nb: "vi", en: "we" },
    { fr: ["vous"], nb: "dere", en: "you (plural or polite)" },
    { fr: ["ils", "elles"], nb: "de", en: "they" },
  ];

  // [infinitiv, former je-ils, elisjon, nb (presens), en (infinitiv), regel per person (null = "endelse")]
  var VERB = [
    ["parler", ["parle", "parles", "parle", "parlons", "parlez", "parlent"], false, "snakker", "to speak"],
    ["porter", ["porte", "portes", "porte", "portons", "portez", "portent"], false, "har på (seg), bærer", "to wear, to carry"],
    ["tomber", ["tombe", "tombes", "tombe", "tombons", "tombez", "tombent"], false, "faller", "to fall"],
    ["habiter", ["habite", "habites", "habite", "habitons", "habitez", "habitent"], true, "bor", "to live"],
    ["aimer", ["aime", "aimes", "aime", "aimons", "aimez", "aiment"], true, "liker, elsker", "to like, to love"],
    ["adorer", ["adore", "adores", "adore", "adorons", "adorez", "adorent"], true, "elsker, er glad i", "to adore"],
    ["écouter", ["écoute", "écoutes", "écoute", "écoutons", "écoutez", "écoutent"], true, "hører på", "to listen to"],
    ["manger", ["mange", "manges", "mange", "mangeons", "mangez", "mangent"], false, "spiser", "to eat",
      [null, null, null, "geons", null, null]],
    ["appeler", ["appelle", "appelles", "appelle", "appelons", "appelez", "appellent"], true, "ringer, kaller", "to call",
      ["appeler", "appeler", "appeler", "appeler", "appeler", "appeler"]],
    ["être", ["suis", "es", "est", "sommes", "êtes", "sont"], false, "er", "to be",
      ["etre", "etre", "etre", "etre", "etre", "etre"]],
    ["avoir", ["ai", "as", "a", "avons", "avez", "ont"], true, "har", "to have",
      ["avoir", "avoir", "avoir", "avoir", "avoir", "avoir"]],
  ];

  // Hva verbet betyr, til betydningssteget før bøyingen.
  var BETYDNING = {
    parler: { nb: "å snakke", en: "to speak" },
    porter: { nb: "å bære, å ha på seg", en: "to carry, to wear" },
    tomber: { nb: "å falle", en: "to fall" },
    habiter: { nb: "å bo", en: "to live (somewhere)" },
    aimer: { nb: "å like, å elske", en: "to like, to love" },
    adorer: { nb: "å elske, å være veldig glad i", en: "to adore" },
    "écouter": { nb: "å høre på, å lytte", en: "to listen to" },
    manger: { nb: "å spise", en: "to eat" },
    appeler: { nb: "å ringe, å kalle", en: "to call" },
    "être": { nb: "å være", en: "to be" },
    avoir: { nb: "å ha", en: "to have" },
  };

  // Kort forklaring per regel (brukes av svake områder).
  var REGLER = {
    endelse: { nb: "Verb på -er: je -e, tu -es, il/elle -e, nous -ons, vous -ez, ils/elles -ent. -e, -es og -ent uttales likt.",
      en: "-er verbs: je -e, tu -es, il/elle -e, nous -ons, vous -ez, ils/elles -ent. -e, -es and -ent sound the same." },
    elisjon: { nb: "je blir j' foran vokal og stum h: j'habite, j'aime, j'écoute.",
      en: "je becomes j' before a vowel and silent h: j'habite, j'aime, j'écoute." },
    geons: { nb: "Verb på -ger beholder e foran -ons, så g-en blir myk: nous mangeons.",
      en: "Verbs in -ger keep the e before -ons so the g stays soft: nous mangeons." },
    appeler: { nb: "appeler får dobbel l når endelsen er stum: j'appelle, ils appellent. Men nous appelons, vous appelez.",
      en: "appeler doubles the l when the ending is silent: j'appelle, ils appellent. But nous appelons, vous appelez." },
    etre: { nb: "être: je suis, tu es, il/elle est, nous sommes, vous êtes, ils/elles sont.",
      en: "être: je suis, tu es, il/elle est, nous sommes, vous êtes, ils/elles sont." },
    avoir: { nb: "avoir: j'ai, tu as, il/elle a, nous avons, vous avez, ils/elles ont.",
      en: "avoir: j'ai, tu as, il/elle a, nous avons, vous avez, ils/elles ont." },
  };

  var LISTE = [];
  VERB.forEach(function (v, vi) {
    v[1].forEach(function (form, pi) {
      var id = vi * 6 + pi + 1;
      var regel = (v[5] && v[5][pi]) || (pi === 0 && v[2] ? "elisjon" : "endelse");
      LISTE.push({
        id: id, verb: v[0], person: pi, form: form, elisjon: v[2], regel: regel,
        nivaa: NIVAER.filter(function (n) { return id >= n.min && id <= n.maks; })[0].nivaa,
        nb: v[3], en: v[4],
      });
    });
  });

  function hent(id) { return LISTE[id - 1] || null; }

  // Pronomen + form. variant velger il/elle og ils/elles (0 eller 1).
  function medPronomen(pronomen, form, elisjon) {
    if (pronomen === "je" && elisjon) return "j'" + form;
    return pronomen + " " + form;
  }

  function fasit(id, variant) {
    var o = hent(id);
    var p = PERSONER[o.person].fr;
    return medPronomen(p[(variant || 0) % p.length], o.form, o.elisjon);
  }

  // Oppgaveteksten: pronomen + infinitiv, f.eks. "nous + manger".
  function oppgave(id, variant) {
    var o = hent(id);
    var p = PERSONER[o.person].fr;
    return p[(variant || 0) % p.length] + " + " + o.verb;
  }

  // Norsk eller engelsk hjelpetekst: "vi spiser", "she: to eat".
  function oversatt(id, sprak, variant) {
    var o = hent(id);
    var p = PERSONER[o.person][sprak === "en" ? "en" : "nb"];
    var pron = Array.isArray(p) ? p[(variant || 0) % p.length] : p;
    return sprak === "en" ? pron + ": " + o.en : pron + " " + o.nb;
  }

  // Gale svaralternativer for knappevalg, typiske feil først. Alle har samme pronomen som fasiten og er ulike den.
  function alternativer(id, variant) {
    var o = hent(id);
    var p = PERSONER[o.person].fr;
    var pron = p[(variant || 0) % p.length];
    var riktig = fasit(id, variant);
    var feller = [];
    if (o.person === 0 && o.elisjon) feller.push("je " + o.form);
    if (o.regel === "geons") feller.push(pron + " mangons");
    if (o.verb === "appeler") feller.push(medPronomen(pron, o.form.indexOf("ll") >= 0 ? o.form.replace("ll", "l") : o.form.replace("l", "ll"), o.elisjon));
    var andre = VERB[Math.floor((id - 1) / 6)][1].map(function (f) { return medPronomen(pron, f, o.elisjon); });
    var ut = [];
    feller.concat(andre).forEach(function (f) { if (f !== riktig && ut.indexOf(f) < 0) ut.push(f); });
    return ut;
  }

  // Infinitivene i et nivå, i rekkefølge.
  function verbINivaa(nivaa) {
    var ut = [];
    LISTE.forEach(function (o) { if (o.nivaa === nivaa && ut.indexOf(o.verb) < 0) ut.push(o.verb); });
    return ut;
  }

  function betydning(verb, sprak) { return BETYDNING[verb][sprak === "en" ? "en" : "nb"]; }

  // Vurderer en skrevet form (pronomen + verb) mot fasiten. Status:
  //   "riktig"  (med aksentfeil: true hvis bare aksenten er galt, svaret godtas med merknad)
  //   "elisjon" je i stedet for j' foran vokal (j'habite)
  //   "feil"    alt annet
  function vurder(svar, id, variant) {
    var Sjekk = typeof window !== "undefined" ? window.Sjekk : require("./sjekk.js");
    var o = hent(id);
    var fas = fasit(id, variant);
    // "j' habite" og "j'habite" regnes som likt.
    var rent = String(svar == null ? "" : svar).replace(/(['’ʼ`´])\s+/g, "$1");
    var r = Sjekk.sjekk(rent, fas);
    if (r.riktig) return { status: "riktig", aksentfeil: r.aksentfeil };
    if (o.person === 0 && o.elisjon && Sjekk.normaliser(rent) === "je " + o.form) return { status: "elisjon", aksentfeil: false };
    return { status: "feil", aksentfeil: false };
  }

  // Hopp ved mønsterbeherskelse: HOPP_REKKE riktige på rad (første forsøk) på samme regel, fordelt på minst
  // HOPP_VERB ulike verb, løfter resten av regelen til boks 3. Én gang per regel. Feil nullstiller rekka.
  // historikk: { regel: { rekke, verb: [], hoppet } }. Muterer ikke, returnerer { historikk, hopp }.
  var HOPP_REKKE = 4;
  var HOPP_VERB = 2;
  function regelHopp(historikk, regel, verb, riktigForsteGang) {
    var ny = JSON.parse(JSON.stringify(historikk || {}));
    var r = ny[regel] || { rekke: 0, verb: [], hoppet: false };
    var hopp = false;
    if (riktigForsteGang) {
      r.rekke++;
      if (r.verb.indexOf(verb) < 0) r.verb.push(verb);
      if (!r.hoppet && r.rekke >= HOPP_REKKE && r.verb.length >= HOPP_VERB) { r.hoppet = true; hopp = true; }
    } else {
      r.rekke = 0;
      r.verb = [];
    }
    ny[regel] = r;
    return { historikk: ny, hopp: hopp };
  }

  // Id-ene i et nivå som hører til en regel.
  function idIRegel(nivaa, regel) {
    return LISTE.filter(function (o) { return o.nivaa === nivaa && o.regel === regel; }).map(function (o) { return o.id; });
  }

  // Hva som spilles av for en form: pronomen + form når verbet starter på konsonant (to klipp etter hverandre),
  // bare formen når det starter på vokal eller stum h, fordi to separate klipp da mangler bindelyden
  // (nous aimons /nuzɛmɔ̃/, j'habite). Se OVERLEVERING.md.
  function lydDeler(id, variant) {
    var o = hent(id);
    if (o.person === 0 && o.elisjon) return [o.form];
    if (/^[aeiouyàâéèêëîïôûh]/i.test(o.form)) return [o.form];
    var p = PERSONER[o.person].fr;
    return [p[(variant || 0) % p.length], o.form];
  }

  // Hør og skriv: pronomenet spilles med, så hun hører at hele formen skal skrives. På vokal mangler bindelyden
  // (nous habitons uten z), det er prisen for å høre pronomenet. Unntak j' (j'aime): to klipp gir "je aime", som er
  // feil lyd, så da spilles bare formen og oppgaveteksten viser "j' …" (se horOppgave).
  function horDeler(id, variant) {
    var o = hent(id);
    if (o.person === 0 && o.elisjon) return [o.form];
    var p = PERSONER[o.person].fr;
    return [p[(variant || 0) % p.length], o.form];
  }

  // il parle og ils parlent (elle/elles) låter likt. Gjelder ikke il est / ils sont og il a / ils ont.
  function likeLyd(id) {
    var o = hent(id);
    if (o.person !== 2 && o.person !== 5) return false;
    var s = LISTE.filter(function (x) { return x.verb === o.verb && x.person === (o.person === 2 ? 5 : 2); })[0];
    if (!s) return false;
    return o.person === 2 ? s.form === o.form + "nt" : o.form === s.form + "nt";
  }

  // Oppgaveteksten i hør og skriv: bare "…", hun skal høre hvilken form det er. Verbet står ikke.
  // Pronomenet står bare når det er umulig å høre forskjellen: "elle …" eller "elles …", og "j' …" (j'aime låter som il aime).
  function horOppgave(id, variant) {
    var o = hent(id);
    if (o.person === 0 && o.elisjon) return "j' …";
    if (!likeLyd(id)) return "…";
    var p = PERSONER[hent(id).person].fr;
    return p[(variant || 0) % p.length] + " …";
  }

  var api = { horOppgave: horOppgave, horDeler: horDeler, lydDeler: lydDeler, regelHopp: regelHopp, idIRegel: idIRegel, NIVAER: NIVAER, PERSONER: PERSONER, REGLER: REGLER, LISTE: LISTE, BETYDNING: BETYDNING, hent: hent,
    fasit: fasit, oppgave: oppgave, oversatt: oversatt, alternativer: alternativer, verbINivaa: verbINivaa,
    betydning: betydning, vurder: vurder };
  if (typeof window !== "undefined") window.Verb = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
