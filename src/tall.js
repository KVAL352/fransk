// tallTilOrd: heltall til franske tallord. Tradisjonell skrivemåte:
// bindestrek under 100, mellomrom ellers (se RESEARCH.md, avsnitt 1).
// Bare belgisk variant ("be") er med foreløpig: septante, nonante, quatre-vingts.

(function () {
  const ENERE = [
    "zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf",
    "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize",
    "dix-sept", "dix-huit", "dix-neuf",
  ];

  // Indeks = tierplass (2 = tjue ... 9 = nitti). 8 er quatre-vingt, s legges til etterpå.
  const TIERE_BE = [null, null, "vingt", "trente", "quarante", "cinquante", "soixante", "septante", "quatre-vingt", "nonante"];

  const MAKS = 999999999999;

  // 0-99. `slutt` styrer s på quatre-vingts: bare når ingenting følger.
  function under100(n, slutt) {
    if (n < 20) return ENERE[n];
    const t = Math.floor(n / 10);
    const e = n % 10;
    const tier = TIERE_BE[t];
    if (e === 0) return t === 8 && slutt ? tier + "s" : tier;
    if (e === 1 && t !== 8) return tier + " et un";
    return tier + "-" + ENERE[e];
  }

  // 0-999. `slutt` styrer s på cents og quatre-vingts.
  function under1000(n, slutt) {
    const h = Math.floor(n / 100);
    const r = n % 100;
    if (h === 0) return under100(r, slutt);
    const cent = h === 1 ? "cent" : ENERE[h] + " cent";
    if (r === 0) return h > 1 && slutt ? cent + "s" : cent;
    return cent + " " + under100(r, slutt);
  }

  function tallTilOrd(n, variant) {
    if (variant === undefined) variant = "be";
    if (variant !== "be") throw new RangeError("Ukjent variant: " + variant);
    if (!Number.isInteger(n) || n < 0 || n > MAKS) {
      throw new RangeError("Tallet må være et heltall fra 0 til " + MAKS);
    }
    if (n === 0) return ENERE[0];

    const milliarder = Math.floor(n / 1e9);
    const millioner = Math.floor(n / 1e6) % 1000;
    const tusen = Math.floor(n / 1e3) % 1000;
    const rest = n % 1000;

    const deler = [];
    // Foran million/milliard beholdes s (deux cents millions).
    if (milliarder) deler.push(under1000(milliarder, true) + " milliard" + (milliarder > 1 ? "s" : ""));
    if (millioner) deler.push(under1000(millioner, true) + " million" + (millioner > 1 ? "s" : ""));
    // Foran mille faller s bort, og mille er uforanderlig.
    if (tusen) deler.push(tusen === 1 ? "mille" : under1000(tusen, false) + " mille");
    if (rest) deler.push(under1000(rest, true));
    return deler.join(" ");
  }

  if (typeof module !== "undefined") module.exports = { tallTilOrd };
  else window.tallTilOrd = tallTilOrd;
})();
