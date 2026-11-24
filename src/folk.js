// Setningene til spill 11 med ?pakke=folk: «Ute blant folk», tredje situasjon i snakkepakken.
// Hun hilser, småprater og presenterer seg selv: hvor hun kommer fra, bor og at hun lærer fransk.
//
// KILDE: ingen. ALLE setningene er Claude-utkast, ikke lest av noen som kan fransk godt, og ikke sjekket mot belgisk bruk.
// Usikkert: «Ça va ?» og «Et vous ?» (høflig form til fremmede), «Vous êtes d'ici ?», «Enchantée» (kvinnelig form).
// Nummer (1-N) er nøkkelen Fremgang bruker: del 1 bruker 1..N, del 2 N+1..2N, del 3 2N+1..3N.
// Ikke endre rekkefølgen etter at noen har spilt, legg nye setninger bakerst.
// Samme form som src/is.js (ord, slutt, betyd [nb, en]).

(function () {
  var SPRAK = ["nb", "en"];
  var RADER = [
    [["bonjour"], ".", ["Hei, god dag.", "Hello."]],
    [["ça", "va"], "?", ["Hvordan går det?", "How are you?"]],
    [["ça", "va", "très", "bien"], ".", ["Det går veldig bra.", "I am doing very well."]],
    [["et", "vous"], "?", ["Og du?", "And you?"]],
    [["je", "suis", "norvégienne"], ".", ["Jeg er norsk.", "I am Norwegian."]],
    [["je", "suis", "de", "Norvège"], ".", ["Jeg er fra Norge.", "I am from Norway."]],
    [["j'habite", "à", "Bruxelles"], ".", ["Jeg bor i Brussel.", "I live in Brussels."]],
    [["je", "parle", "un", "peu", "français"], ".", ["Jeg snakker litt fransk.", "I speak a little French."]],
    [["j'apprends", "le", "français"], ".", ["Jeg lærer fransk.", "I am learning French."]],
    [["je", "ne", "comprends", "pas"], ".", ["Jeg forstår ikke.", "I do not understand."]],
    [["vous", "parlez", "anglais"], "?", ["Snakker du engelsk?", "Do you speak English?"]],
    [["plus", "lentement", "s'il", "vous", "plaît"], ".", ["Saktere, takk.", "More slowly, please."]],
    [["vous", "êtes", "d'ici"], "?", ["Er du herfra?", "Are you from here?"]],
    [["j'aime", "beaucoup", "la", "ville"], ".", ["Jeg liker byen veldig godt.", "I like the city a lot."]],
    [["enchantée"], ".", ["Hyggelig å møte deg.", "Pleased to meet you."]],
    [["bonne", "journée"], ".", ["Ha en fin dag.", "Have a nice day."]],
    [["à", "bientôt"], ".", ["Vi ses snart.", "See you soon."]]
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
  else window.Folk = api;
})();
