// Svake områder i setningsspillene. Hver setning har en regel (Setninger.POOL[k].regel). Her telles første forsøk per regel,
// lagret i localStorage. Er VINDU de siste svarene på en regel har TERSKEL eller flere vært feil, trenger regelen en
// forklaring og en målrettet runde (RUNDE spørsmål, KRAV riktige) før vanlig spill fortsetter. Etter bestått runde
// nullstilles regelens logg. Logg: 1 = feil, 0 = riktig første gang, eldste først.

(function () {
  var VINDU = 10;
  var TERSKEL = 4;
  var RUNDE = 8;
  var KRAV = 5;

  function nokkel(spill) { return "fransk.svakhet." + spill; }

  function les(spill) {
    try {
      var data = JSON.parse(window.localStorage.getItem(nokkel(spill)));
      return data && typeof data === "object" && !Array.isArray(data) ? data : {};
    } catch (e) {
      return {};
    }
  }

  function skriv(spill, data) {
    try { window.localStorage.setItem(nokkel(spill), JSON.stringify(data)); } catch (e) { /* uten lagring virker spillet, men husker ikke */ }
  }

  function logg(data, regel) { return Array.isArray(data[regel]) ? data[regel] : []; }

  // Antall feil blant de siste VINDU svarene på regelen.
  function antallFeil(data, regel) {
    return logg(data, regel).slice(-VINDU).reduce(function (sum, x) { return sum + (x ? 1 : 0); }, 0);
  }

  // Regelen med flest feil, hvis noen har nådd terskelen. Ellers null.
  function verste(data) {
    var best = null;
    var flest = TERSKEL - 1;
    Object.keys(data).forEach(function (regel) {
      var n = antallFeil(data, regel);
      if (n > flest) { flest = n; best = regel; }
    });
    return best;
  }

  function leggTil(data, regel, riktigForsteGang) {
    var ny = logg(data, regel).concat(riktigForsteGang ? 0 : 1).slice(-VINDU);
    data[regel] = ny;
    return data;
  }

  function rundeLengde(antallSetninger) { return Math.min(RUNDE, antallSetninger); }

  // Riktige som trengs i en runde med den lengden: samme andel som KRAV av RUNDE, rundet opp.
  function krav(lengde) { return Math.ceil(lengde * KRAV / RUNDE); }

  // Med lagring.
  function registrer(spill, regel, riktigForsteGang) {
    if (!regel) return null;
    var data = leggTil(les(spill), regel, riktigForsteGang);
    skriv(spill, data);
    return verste(data);
  }

  function trengerRunde(spill) { return verste(les(spill)); }

  function nullstillRegel(spill, regel) {
    var data = les(spill);
    delete data[regel];
    skriv(spill, data);
  }

  function nullstill(spill) {
    try { window.localStorage.removeItem(nokkel(spill)); } catch (e) { /* ingenting å fjerne */ }
  }

  var api = {
    VINDU: VINDU, TERSKEL: TERSKEL, RUNDE: RUNDE, KRAV: KRAV,
    antallFeil: antallFeil, verste: verste, leggTil: leggTil, rundeLengde: rundeLengde, krav: krav,
    les: les, registrer: registrer, trengerRunde: trengerRunde, nullstillRegel: nullstillRegel, nullstill: nullstill
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.Svakhet = api;
})();
