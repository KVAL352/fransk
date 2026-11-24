// Setningene til spill 11 med ?pakke=butikk: «Butikken», fjerde situasjon i snakkepakken.
// Hun handler mat og drikke: spør etter ting, spør om pris og betaler. Selgerens spørsmål står med (Et avec ça, Ce sera tout).
//
// KILDE: ingen. ALLE setningene er Claude-utkast, ikke lest av noen som kan fransk godt, og ikke sjekket mot belgisk bruk.
// Usikkert: «Et avec ça ?» og «Ce sera tout ?» (selgerens spørsmål), «Je voudrais» (høflig), «Je peux payer par carte ?»,
// «Voilà dix euros» ved betaling, «Je cherche de l'eau».
// Nummer (1-N) er nøkkelen Fremgang bruker: del 1 bruker 1..N, del 2 N+1..2N, del 3 2N+1..3N.
// Ikke endre rekkefølgen etter at noen har spilt, legg nye setninger bakerst.
// Samme form som src/folk.js (ord, slutt, betyd [nb, en]). Ingen komma i setningene, siden brikkene er ett ord hver.

(function () {
  var SPRAK = ["nb", "en"];
  var RADER = [
    [["bonjour", "madame"], ".", ["Hei, god dag.", "Hello."]],
    [["où", "est", "le", "pain"], "?", ["Hvor er brødet?", "Where is the bread?"]],
    [["vous", "avez", "du", "lait"], "?", ["Har dere melk?", "Do you have milk?"]],
    [["je", "cherche", "de", "l'eau"], ".", ["Jeg leter etter vann.", "I am looking for water."]],
    [["je", "voudrais", "une", "pomme"], ".", ["Jeg vil gjerne ha et eple.", "I would like an apple."]],
    [["je", "prends", "ça"], ".", ["Jeg tar denne.", "I will take this."]],
    [["je", "prends", "du", "fromage"], ".", ["Jeg tar ost.", "I will take some cheese."]],
    [["c'est", "combien"], "?", ["Hvor mye koster det?", "How much is it?"]],
    [["combien", "coûte", "le", "pain"], "?", ["Hvor mye koster brødet?", "How much is the bread?"]],
    [["c'est", "trois", "euros"], ".", ["Det er tre euro.", "It is three euros."]],
    [["et", "avec", "ça"], "?", ["Noe mer?", "Anything else?"]],
    [["ce", "sera", "tout"], "?", ["Er det alt?", "Will that be all?"]],
    [["c'est", "tout", "merci"], ".", ["Det er alt, takk.", "That is all, thank you."]],
    [["un", "sac", "s'il", "vous", "plaît"], ".", ["En pose, takk.", "A bag, please."]],
    [["je", "peux", "payer", "par", "carte"], "?", ["Kan jeg betale med kort?", "Can I pay by card?"]],
    [["voilà", "dix", "euros"], ".", ["Vær så god, ti euro.", "Here you are, ten euros."]],
    [["merci", "beaucoup"], ".", ["Tusen takk.", "Thank you very much."]],
    [["au", "revoir"], ".", ["Ha det.", "Goodbye."]]
  ];

  var LISTE = RADER.map(function (r, i) { return { nr: i + 1, ord: r[0], slutt: r[1], betyd: r[2] }; });

  function stor(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function fasit(s) { return stor(s.ord.join(" ")) + s.slutt; }
  function betyd(s, kode) {
    var i = SPRAK.indexOf(kode);
    return s.betyd[i < 0 ? 1 : i];
  }
  function hent(nr) { return LISTE[nr - 1] || null; }

  var api = { LISTE: LISTE, ANTALL: LISTE.length, SPRAK: SPRAK, fasit: fasit, betyd: betyd, hent: hent, stor: stor };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else window.Butikk = api;
})();
