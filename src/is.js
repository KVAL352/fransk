// Setningene til spill 11 med ?pakke=is: «Isbutikken», andre situasjon i snakkepakken.
// Hun kjøper is til seg selv og vennene sine, eller til barnet og mannen. Selgeren spør «pot eller cornet?» og «sur place eller à emporter?».
//
// KILDE: ingen. ALLE setningene er Claude-utkast, ikke lest av noen som kan fransk godt, og ikke sjekket mot hva de sier i en belgisk isbutikk.
// Usikkert: «pot» for skål, «à emporter» og «sur place», «c'est combien». Må leses av noen som kan fransk før klassen får det.
// Nummer (1-N) er nøkkelen Fremgang bruker: del 1 bruker 1..N, del 2 N+1..2N, del 3 2N+1..3N.
// Ikke endre rekkefølgen etter at noen har spilt, legg nye setninger bakerst.
// Samme form som src/metro.js (ord, slutt, betyd [nb, en]). Hun lærer belgisk fransk.

(function () {
  var SPRAK = ["nb", "en"];
  var RADER = [
    [["bonjour"], ".", ["Hei, god dag.", "Hello."]],
    [["je", "voudrais", "une", "glace"], ".", ["Jeg vil gjerne ha en is.", "I would like an ice cream."]],
    [["je", "voudrais", "un", "cornet"], ".", ["Jeg vil gjerne ha en iskjeks.", "I would like a cone."]],
    [["je", "voudrais", "deux", "boules"], ".", ["Jeg vil gjerne ha to kuler.", "I would like two scoops."]],
    [["une", "boule", "de", "chocolat", "et", "une", "boule", "de", "vanille"], ".", ["En kule sjokolade og en kule vanilje.", "One scoop of chocolate and one scoop of vanilla."]],
    [["je", "prends", "la", "fraise"], ".", ["Jeg tar jordbær.", "I will take the strawberry."]],
    [["un", "pot", "ou", "un", "cornet"], "?", ["Skål eller iskjeks?", "A cup or a cone?"]],
    [["dans", "un", "cornet"], ".", ["I en iskjeks.", "In a cone."]],
    [["dans", "un", "pot"], ".", ["I en skål.", "In a cup."]],
    [["sur", "place", "ou", "à", "emporter"], "?", ["Her eller ta med?", "Eat here or take away?"]],
    [["à", "emporter"], ".", ["Ta med.", "To take away."]],
    [["sur", "place"], ".", ["Her.", "Eat here."]],
    [["c'est", "pour", "mon", "mari"], ".", ["Det er til mannen min.", "It is for my husband."]],
    [["c'est", "pour", "mon", "enfant"], ".", ["Det er til barnet mitt.", "It is for my child."]],
    [["nous", "sommes", "quatre"], ".", ["Vi er fire.", "There are four of us."]],
    [["c'est", "combien"], "?", ["Hvor mye koster det?", "How much is it?"]],
    [["merci", "beaucoup"], ".", ["Tusen takk.", "Thank you very much."]],
    [["un", "pot", "pour", "moi", "et", "un", "cornet", "pour", "mon", "mari"], ".", ["En skål til meg og en iskjeks til mannen min.", "A cup for me and a cone for my husband."]],
    [["un", "cornet", "pour", "moi", "et", "un", "pot", "pour", "mon", "enfant"], ".", ["En iskjeks til meg og en skål til barnet mitt.", "A cone for me and a cup for my child."]]
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
  else window.Is = api;
})();
