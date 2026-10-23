// Felles fremgang for spillene: Leitner-bokser per tall, lagret i localStorage.
// Boks 1 = nytt eller bommet, boks 5 = sitter. Lave bokser trekkes oftere.
// Hvert spill har sin egen lagring (spill1, spill2).
//
// Regler (jo høyere boks, jo strengere):
// - Opp fra boks 1: 1 riktig. Fra boks 2 og 3: 2 på rad. Fra boks 4: 3 på rad.
// - Feil i boks 1 og 2: blir i boksen. Feil i boks 3 og 4: én boks ned.
// - Boks 5: UTLAERT_REKKE riktige på rad = utlært. Feil nullstiller rekka, tallet blir i boks 5.
// - Utlært er permanent (flagget laert). En feil på et utlært tall, f.eks. på et høyere nivå, teller bare som feil
//   i statistikken og endrer ikke boks eller rekke.

(function () {
  var MAKS_BOKS = 5;
  var VEKT = { 1: 16, 2: 8, 3: 4, 4: 2, 5: 1 };
  var RIKTIGE_FOR_OPP = { 1: 1, 2: 2, 3: 2, 4: 3 };
  var NED_VED_FEIL = { 1: false, 2: false, 3: true, 4: true, 5: false };
  var UTLAERT_REKKE = 10;
  var MIN_ANDEL_LAERE = 0.7;
  // Utlærte tall fra tidligere nivåer trekkes sjeldnere jo flere nivåer som er gått: 0 nivåer bak = full vekt,
  // ett nivå bak = 0,25, to eller flere bak = 0,03.
  var NEDSKALERING = [1, 0.25, 0.03];

  function nokkel(spill) { return "fransk.fremgang." + spill; }

  function les(spill) {
    try {
      var data = JSON.parse(window.localStorage.getItem(nokkel(spill)));
      return data && typeof data === "object" && !Array.isArray(data) ? data : {};
    } catch (e) {
      return {};
    }
  }

  function skriv(spill, data) {
    try {
      window.localStorage.setItem(nokkel(spill), JSON.stringify(data));
    } catch (e) { /* lagring blokkert: spillet virker, men uten å huske */ }
  }

  function boksFor(data, tall) {
    var rad = data[tall];
    var b = rad && Number(rad.boks);
    return b >= 1 && b <= MAKS_BOKS ? Math.floor(b) : 1;
  }

  // Hvilket nivå (indeks) et tall hører til: første grense som er minst like stor som tallet.
  function nivaaFor(tall, grenser) {
    for (var i = 0; i < grenser.length; i++) if (tall <= grenser[i]) return i;
    return grenser.length - 1;
  }

  // tilfeldig er valgfri (for testing): funksjon som gir et tall i [0, 1).
  // grenser er valgfri: øvre grense for hvert nivå, f.eks. [10, 20, 50, 69, 99]. Uten den skaleres ingenting ned.
  function velgTall(spill, min, maks, forrige, tilfeldig, grenser) {
    var rnd = tilfeldig || Math.random;
    var data = les(spill);
    var kandidater = [];
    var sum = 0;
    var naa = grenser ? nivaaFor(maks, grenser) : 0;
    for (var t = min; t <= maks; t++) {
      if (t === forrige && maks > min) continue;
      var b = boksFor(data, t);
      var v = VEKT[b];
      if (grenser && erUtlaert(data, t)) {
        v *= NEDSKALERING[Math.min(naa - nivaaFor(t, grenser), NEDSKALERING.length - 1)];
      }
      kandidater.push({ tall: t, vekt: v, boks: b, utlaert: erUtlaert(data, t) });
      sum += v;
    }
    // Tall som ikke er utlært (også boks 5 før rekka er full) får minst sju tidelers av trekkene, ellers kommer det siste
    // tallet nesten aldri. De ferdige tallene blandes fortsatt inn.
    var laereSum = 0;
    kandidater.forEach(function (k) { if (!k.utlaert) laereSum += k.vekt; });
    var ferdigSum = sum - laereSum;
    if (laereSum > 0 && ferdigSum > 0 && laereSum < ferdigSum * MIN_ANDEL_LAERE / (1 - MIN_ANDEL_LAERE)) {
      var faktor = ferdigSum * MIN_ANDEL_LAERE / (1 - MIN_ANDEL_LAERE) / laereSum;
      kandidater.forEach(function (k) { if (!k.utlaert) k.vekt *= faktor; });
      sum = ferdigSum + laereSum * faktor;
    }
    var terning = rnd() * sum;
    for (var i = 0; i < kandidater.length; i++) {
      terning -= kandidater[i].vekt;
      if (terning < 0) return kandidater[i].tall;
    }
    return kandidater[kandidater.length - 1].tall;
  }

  // Returnerer { fra, til, utlaert, mistet }: boksen før og etter, om tallet nå er utlært,
  // og om det nettopp mistet utlært-status.
  function registrer(spill, tall, riktig) {
    var data = les(spill);
    var rad = data[tall] || { boks: 1, riktig: 0, feil: 0 };
    var fra = boksFor(data, tall);
    var b = fra;
    var rekke = Number(rad.rekke) || 0;
    var varUtlaert = erUtlaert(data, tall);
    if (varUtlaert) {
      // Utlært blir utlært: boks og rekke røres ikke, uansett svar.
      rad.laert = true;
    } else if (riktig) {
      rekke++;
      if (b < MAKS_BOKS && rekke >= RIKTIGE_FOR_OPP[b]) { b++; rekke = 0; }
      else if (b === MAKS_BOKS && rekke > UTLAERT_REKKE) rekke = UTLAERT_REKKE;
    } else {
      if (NED_VED_FEIL[b]) b--;
      rekke = 0;
    }
    rad.boks = b;
    rad.rekke = rekke;
    rad.riktig = (Number(rad.riktig) || 0) + (riktig ? 1 : 0);
    rad.feil = (Number(rad.feil) || 0) + (riktig ? 0 : 1);
    data[tall] = rad;
    skriv(spill, data);
    var utlaert = erUtlaert(data, tall);
    if (utlaert) rad.laert = true;
    skriv(spill, data);
    return { fra: fra, til: b, utlaert: utlaert };
  }

  function erUtlaert(data, tall) {
    var rad = data[tall];
    return !!rad && (rad.laert === true ||
      (boksFor(data, tall) === MAKS_BOKS && (Number(rad.rekke) || 0) >= UTLAERT_REKKE));
  }

  // Antall tall i hver boks, indeks 1-5.
  function oversikt(spill, min, maks) {
    var data = les(spill);
    var antall = [0, 0, 0, 0, 0, 0];
    for (var t = min; t <= maks; t++) antall[boksFor(data, t)]++;
    return antall;
  }

  function antallUtlaert(spill, min, maks) {
    var data = les(spill);
    var n = 0;
    for (var t = min; t <= maks; t++) if (erUtlaert(data, t)) n++;
    return n;
  }

  function alleUtlaert(spill, min, maks) {
    return antallUtlaert(spill, min, maks) === maks - min + 1;
  }

  function oversiktTekst(spill, min, maks) {
    var a = oversikt(spill, min, maks);
    return "Boks 1: " + a[1] + " · boks 2: " + a[2] + " · boks 3: " + a[3] +
      " · boks 4: " + a[4] + " · boks 5: " + a[5] + " tall. Utlært: " +
      antallUtlaert(spill, min, maks) + " av " + (maks - min + 1);
  }

  // Minste antall riktige svar fra boks 1 til utlært (1 + 2 + 2 + 3 + 10 = 18 med dagens regler).
  var STEG_PER_TALL = (function () {
    var n = UTLAERT_REKKE;
    for (var b = 1; b < MAKS_BOKS; b++) n += RIKTIGE_FOR_OPP[b];
    return n;
  })();

  // Hvor langt et tall har kommet, målt i riktige svar av STEG_PER_TALL.
  function stegFor(data, tall) {
    var b = boksFor(data, tall);
    var rekke = Number((data[tall] || {}).rekke) || 0;
    var n = 0;
    for (var i = 1; i < b; i++) n += RIKTIGE_FOR_OPP[i];
    var krav = b === MAKS_BOKS ? UTLAERT_REKKE : RIKTIGE_FOR_OPP[b];
    return n + Math.min(rekke, krav);
  }

  // Til visningen: { boks, rekke, krav, utlaert } for ett tall. krav = riktige på rad som trengs i boksen.
  function status(spill, tall) {
    var data = les(spill);
    var b = boksFor(data, tall);
    return {
      boks: b,
      rekke: Number((data[tall] || {}).rekke) || 0,
      krav: b === MAKS_BOKS ? UTLAERT_REKKE : RIKTIGE_FOR_OPP[b],
      utlaert: erUtlaert(data, tall)
    };
  }

  // Fremgang for hele spillet: { gjort, totalt, igjen } i riktige svar.
  function steg(spill, min, maks) {
    var data = les(spill);
    var gjort = 0;
    for (var t = min; t <= maks; t++) gjort += stegFor(data, t);
    var totalt = STEG_PER_TALL * (maks - min + 1);
    return { gjort: gjort, totalt: totalt, igjen: totalt - gjort };
  }

  function nullstill(spill) {
    try { window.localStorage.removeItem(nokkel(spill)); } catch (e) { /* ingenting å fjerne */ }
  }

  var api = {
    velgTall: velgTall, registrer: registrer, oversikt: oversikt, antallUtlaert: antallUtlaert,
    alleUtlaert: alleUtlaert, status: status, steg: steg, MAKS_BOKS: MAKS_BOKS,
    oversiktTekst: oversiktTekst, nullstill: nullstill
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.Fremgang = api;
})();
