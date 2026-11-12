// Setningene til spill 11: «På vei» (metro, buss og trikk), første situasjon i snakkepakken.
// Hun forteller en venn at hun er på vei, hvor hun er og hvor hun skal. Ikke billettkjøp.
//
// KILDE: Setning 11 («Tu arrives quand ?») står som eksempel i Europarådets doc. 33 (docs/kilder/doc33-FR.pdf).
// ALLE de andre er Claude-utkast uten kilde, ikke lest av noen som kan fransk godt. Brussel bruker STIB for metro, buss og trikk.
// Nummer (1-N) er nøkkelen Fremgang bruker: del 1 bruker 1..N, del 2 N+1..2N, del 3 2N+1..3N.
// Ikke endre rekkefølgen etter at noen har spilt, legg nye setninger bakerst.
//
// ord: brikkene i del 1, i riktig rekkefølge og med små bokstaver. j' henger fast i ordet etter (én brikke).
// slutt: tegnet etter setningen, «.» hvis det mangler.
// betyd: [nb, en]. Andre språk faller tilbake til engelsk, som i spill 3-5 (ar, ro, ru, sq, pt kommer senere).

(function () {
  var SPRAK = ["nb", "en"];
  var RADER = [
    [["je", "suis", "dans", "le", "métro"], ".", ["Jeg er på metroen.", "I am on the metro."]],
    [["je", "suis", "dans", "le", "bus"], ".", ["Jeg er på bussen.", "I am on the bus."]],
    [["je", "suis", "en", "route"], ".", ["Jeg er på vei.", "I am on my way."]],
    [["j'arrive", "dans", "dix", "minutes"], ".", ["Jeg kommer om ti minutter.", "I will be there in ten minutes."]],
    [["je", "prends", "le", "tram"], ".", ["Jeg tar trikken.", "I am taking the tram."]],
    [["je", "prends", "le", "bus", "pour", "aller", "au", "travail"], ".", ["Jeg tar bussen til jobben.", "I am taking the bus to work."]],
    [["je", "descends", "à", "la", "prochaine", "station"], ".", ["Jeg går av på neste stasjon.", "I get off at the next station."]],
    [["je", "suis", "en", "retard"], ".", ["Jeg er forsinket.", "I am late."]],
    [["le", "bus", "est", "en", "retard"], ".", ["Bussen er forsinket.", "The bus is late."]],
    [["je", "pars", "maintenant"], ".", ["Jeg drar nå.", "I am leaving now."]],
    [["tu", "arrives", "quand"], "?", ["Når kommer du?", "When are you arriving?"]],
    [["j'arrive", "bientôt"], ".", ["Jeg kommer snart.", "I will be there soon."]]
  ];

  var LISTE = RADER.map(function (r, i) { return { nr: i + 1, ord: r[0], slutt: r[1], betyd: r[2] }; });

  function stor(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  // Setningen skrevet ut: stor forbokstav og punktum (eller spørsmålstegn).
  function fasit(s) { return stor(s.ord.join(" ")) + s.slutt; }
  // Betydningen på språket med koden, engelsk hvis språket mangler.
  function betyd(s, kode) {
    var i = SPRAK.indexOf(kode);
    return s.betyd[i < 0 ? 1 : i];
  }
  function hent(nr) { return LISTE[nr - 1] || null; }

  var api = { LISTE: LISTE, ANTALL: LISTE.length, SPRAK: SPRAK, fasit: fasit, betyd: betyd, hent: hent, stor: stor };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else window.Metro = api;
})();
