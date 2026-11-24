// Nektelse (ne ... pas): setningene og reglene til nektelse.html. Valgt av Kjersti 2026-11-24 som første A1-hull.
// Tre nivåer, 8 setninger hver. Nummer 1-8 er nivå 1, 9-16 nivå 2, 17-24 nivå 3 (lagres i fremgangen, så rekkefølgen
// og antallet må ikke endres etter at hun har spilt).
//   Nivå 1: ne foran verbet, pas etter (verb som begynner på konsonant).
//   Nivå 2: n' foran vokal og stum h. Le, la og les blir stående.
//   Nivå 3: pas de / pas d' i stedet for un, une, du, de l', des.
// Hver setning: s = subjekt, v = verbet (med y i «il y a»), r = resten, rNeg = resten i nektelsen hvis den endres.
// Alle setningene og oversettelsene er Claude-utkast, ikke lest av noen som kan fransk bedre.

(function () {
  var SETNINGER = [
    // Nivå 1
    { s: "Je", v: "parle", r: "anglais", nb: "Jeg snakker engelsk.", en: "I speak English." },
    { s: "Je", v: "comprends", r: "", nb: "Jeg forstår.", en: "I understand." },
    { s: "Tu", v: "parles", r: "français", nb: "Du snakker fransk.", en: "You speak French." },
    { s: "Je", v: "suis", r: "fatiguée", nb: "Jeg er sliten.", en: "I am tired." },
    { s: "Nous", v: "prenons", r: "le métro", nb: "Vi tar metroen.", en: "We take the metro." },
    { s: "Vous", v: "parlez", r: "vite", nb: "Dere snakker fort.", en: "You speak fast." },
    { s: "Elle", v: "prend", r: "le bus", nb: "Hun tar bussen.", en: "She takes the bus." },
    { s: "Je", v: "suis", r: "d'ici", nb: "Jeg er herfra.", en: "I am from here." },
    // Nivå 2
    { s: "Je", v: "aime", r: "le fromage", nb: "Jeg liker ost.", en: "I like cheese." },
    { s: "Je", v: "habite", r: "à Bruxelles", nb: "Jeg bor i Brussel.", en: "I live in Brussels." },
    { s: "Ce", v: "est", r: "cher", nb: "Det er dyrt.", en: "It is expensive." },
    { s: "Il", v: "est", r: "là", nb: "Han er her.", en: "He is here." },
    { s: "Tu", v: "aimes", r: "le chocolat", nb: "Du liker sjokolade.", en: "You like chocolate." },
    { s: "Nous", v: "allons", r: "à l'école", nb: "Vi går på skolen.", en: "We go to school." },
    { s: "Elle", v: "arrive", r: "", nb: "Hun kommer.", en: "She is arriving." },
    { s: "On", v: "habite", r: "ici", nb: "Vi bor her.", en: "We live here." },
    // Nivå 3
    { s: "Je", v: "ai", r: "un sac", rNeg: "de sac", nb: "Jeg har en pose.", en: "I have a bag." },
    { s: "Je", v: "prends", r: "du pain", rNeg: "de pain", nb: "Jeg tar brød.", en: "I take some bread." },
    { s: "Il", v: "y a", r: "du lait", rNeg: "de lait", nb: "Det er melk.", en: "There is milk." },
    { s: "Je", v: "mange", r: "une pomme", rNeg: "de pomme", nb: "Jeg spiser et eple.", en: "I eat an apple." },
    { s: "Je", v: "ai", r: "des amis ici", rNeg: "d'amis ici", nb: "Jeg har venner her.", en: "I have friends here." },
    { s: "Tu", v: "as", r: "une voiture", rNeg: "de voiture", nb: "Du har en bil.", en: "You have a car." },
    { s: "Nous", v: "avons", r: "des enfants", rNeg: "d'enfants", nb: "Vi har barn.", en: "We have children." },
    { s: "Il", v: "y a", r: "de l'eau", rNeg: "d'eau", nb: "Det er vann.", en: "There is water." }
  ];

  var PER_NIVAA = 8;
  var NIVAER = [1, 2, 3].map(function (n) { return { nr: n, min: (n - 1) * PER_NIVAA + 1, maks: n * PER_NIVAA }; });

  var REGEL = {
    nb: {
      1: "Ne står foran verbet og pas etter: je ne parle pas.",
      2: "Foran vokal og stum h blir ne til n': je n'aime pas. Le, la og les blir stående.",
      3: "Etter pas blir un, une, du, de l' og des til de, og til d' foran vokal: je n'ai pas de sac, pas d'amis."
    },
    en: {
      1: "Ne goes before the verb and pas after it: je ne parle pas.",
      2: "Before a vowel and silent h, ne becomes n': je n'aime pas. Le, la and les stay.",
      3: "After pas, un, une, du, de l' and des become de, or d' before a vowel: je n'ai pas de sac, pas d'amis."
    }
  };
  var NIVAANAVN = {
    nb: { 1: "ne ... pas", 2: "n' foran vokal", 3: "pas de" },
    en: { 1: "ne ... pas", 2: "n' before a vowel", 3: "pas de" }
  };

  function vokal(ord) { return /^[aeiouyhàâéèêëîïôûœ]/i.test(ord); }
  function stor(t) { return t.charAt(0).toUpperCase() + t.slice(1); }
  function setning(deler) {
    return stor(deler.filter(function (d) { return d; }).join(" ").replace(/' /g, "'")) + ".";
  }
  // je og ce blir j' og c' foran vokal (j'aime, c'est). Andre subjekter endres ikke.
  function subjekt(s, v) {
    if (vokal(v) && /^(je|ce)$/i.test(s)) return s.slice(0, -1) + "'";
    return s;
  }
  function ne(v) { return vokal(v) ? "n'" : "ne"; }

  function nivaaFor(nr) { return Math.ceil(nr / PER_NIVAA); }

  // Oppgave nr (1..24): { nr, nivaa, pos, neg, feil: [to gale nektelser], nb, en }
  function oppgave(nr) {
    var x = SETNINGER[nr - 1];
    if (!x) return null;
    var niv = nivaaFor(nr);
    var rNeg = x.rNeg !== undefined ? x.rNeg : x.r;
    var pos = setning([subjekt(x.s, x.v), x.v, x.r]);
    var neg = setning([x.s, ne(x.v), x.v, "pas", rNeg]);
    var feil;
    if (niv === 1) {
      feil = [setning([x.s, x.v, "ne pas", x.r]), setning([x.s, "ne pas", x.v, x.r])];
    } else if (niv === 2) {
      feil = [setning([x.s, "ne", x.v, "pas", x.r]), setning([subjekt(x.s, x.v), x.v, "ne pas", x.r])];
    } else {
      feil = [setning([x.s, ne(x.v), x.v, "pas", x.r]), setning([x.s, ne(x.v), x.v, rNeg, "pas"])];
    }
    return { nr: nr, nivaa: niv, pos: pos, neg: neg, feil: feil, nb: x.nb, en: x.en };
  }

  function regel(nivaa, sprak) { return REGEL[sprak === "nb" ? "nb" : "en"][nivaa]; }
  function nivaanavn(nivaa, sprak) { return NIVAANAVN[sprak === "nb" ? "nb" : "en"][nivaa]; }

  var api = { ANTALL: SETNINGER.length, PER_NIVAA: PER_NIVAA, NIVAER: NIVAER, oppgave: oppgave, regel: regel, nivaanavn: nivaanavn, nivaaFor: nivaaFor };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.Nektelse = api;
})();
