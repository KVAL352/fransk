// Høstpakken: tre trinn i en sti, låst i rekkefølge (se PLAN-host.md, «Høstpakken»).
// Trinn 1 verb (spill8.html?pakke=host), trinn 2 ord (spill9.html), trinn 3 setninger (spill10.html).
// Status leses fra fremgangen i hvert spill, ingenting lagres her. Brukes av hostpakke.html og spill9.js (låsen).
// ?test=1&trinn=N later som trinnene før N er ferdige (bare visningen, rører ikke fremgangen).

(function () {
  function testTrinn() {
    try {
      var p = new URLSearchParams(window.location.search);
      if (p.get("test") === "1" && p.get("trinn")) return Number(p.get("trinn"));
    } catch (e) { /* ingen test */ }
    return 0;
  }

  // Verbtrinnet er ferdig når alle 48 formene i pakken er lært. Hele spill 8 (66 former, også alle personer
  // i de 8 verbene) teller også, så den som har spilt spill 8 ferdig ikke må gjøre verbene en gang til.
  function verbFerdig() {
    if (testTrinn() >= 2) return true;
    var F = window.Fremgang;
    var P = window.Verb.pakke("host");
    return F.alleUtlaert("hostverb", 1, P.LISTE.length) || F.alleUtlaert("spill8", 1, window.Verb.LISTE.length) || ordFerdig();
  }

  // Ferdig er ferdig (Kjersti 2026-11-10): har hun lært alle ordene i spill 9, låses ikke spill 9 bak verbene.
  function ordFerdig() {
    if (testTrinn() >= 3) return true;
    return window.Fremgang.alleUtlaert("spill9", 1, window.Host.ANTALL);
  }

  // Setningstrinnet (spill 10) er ferdig når begge delene er ferdige: nummer 1..2N i «spill10».
  function setnFerdig() {
    if (testTrinn() >= 4) return true;
    var S = window.SetningerHost;
    return !!S && window.Fremgang.alleUtlaert("spill10", 1, 2 * S.ANTALL);
  }

  var api = { verbFerdig: verbFerdig, ordFerdig: ordFerdig, setnFerdig: setnFerdig };
  window.HostPakke = api;

  // Sti-siden. Finnes ikke #sti, er fila lastet bare for statusen (spill 9).
  var sti = document.getElementById("sti");
  if (!sti) return;

  window.Tekster.init();
  var TEKST = {
    nb: {
      tittel: "Fransk: høstpakken",
      trinn: "Trinn {n}",
      verb: "Verb", verbDel: "je, tu, il, elle, så nous, vous, ils, elles",
      ord: "Ord", ordDel: "seks temaer",
      setn: "Setninger", setnDel: "rekkefølge, så skriv selv",
      ferdig: "ferdig", last: "låst", lenkeMeny: "Til menyen", start: "Start", igjen: "Øv igjen"
    },
    en: {
      tittel: "French: the autumn pack",
      trinn: "Step {n}",
      verb: "Verbs", verbDel: "je, tu, il, elle, then nous, vous, ils, elles",
      ord: "Words", ordDel: "six themes",
      setn: "Sentences", setnDel: "word order, then write it yourself",
      ferdig: "done", last: "locked", lenkeMeny: "Back to the menu", start: "Start", igjen: "Practise again"
    }
  };
  var SPRAK = window.Tekster.kode() === "nb" ? "nb" : "en";
  function s(k, v) {
    var tekst = TEKST[SPRAK][k];
    Object.keys(v || {}).forEach(function (n) { tekst = tekst.split("{" + n + "}").join(v[n]); });
    return tekst;
  }
  document.title = s("tittel");
  document.getElementById("h1").textContent = s("tittel");
  document.getElementById("menyLenke").textContent = s("lenkeMeny");

  var TRINN = [
    { navn: s("verb"), del: s("verbDel"), href: "spill8.html?pakke=host" },
    { navn: s("ord"), del: s("ordDel"), href: "spill9.html" },
    { navn: s("setn"), del: s("setnDel"), href: "spill10.html" },
  ];
  var ferdig = verbFerdig() ? (ordFerdig() ? (setnFerdig() ? 3 : 2) : 1) : 0;

  TRINN.forEach(function (t, i) {
    if (i > 0) {
      var bind = document.createElement("div");
      bind.className = "bind" + (ferdig >= i ? " gull" : "");
      bind.setAttribute("aria-hidden", "true");
      sti.appendChild(bind);
    }
    var tilstand = t.ikkeBygget ? "snart" : i < ferdig ? "ferdig" : i === ferdig ? "apen" : "last";
    var kanAapnes = tilstand === "ferdig" || tilstand === "apen";
    var d = document.createElement("div");
    d.className = "trinn " + tilstand;
    d.setAttribute("role", "listitem");
    var nr = document.createElement("span");
    nr.className = "nr";
    nr.textContent = s("trinn", { n: i + 1 });
    var navn = document.createElement("span");
    navn.className = "navn";
    navn.textContent = t.navn;
    var del = document.createElement("span");
    del.className = "del";
    del.textContent = t.del;
    d.appendChild(nr); d.appendChild(navn); d.appendChild(del);
    // Tilstanden for skjermleser (haken og den stiplede rammen er bare visuelle).
    if (tilstand === "ferdig" || tilstand === "last") {
      var sr = document.createElement("span");
      sr.className = "skjult";
      sr.textContent = ", " + s(tilstand);
      d.appendChild(sr);
    }
    // Tydelig knapp: «Start» på trinnet hun er på, «Øv igjen» på ferdige trinn.
    if (kanAapnes) {
      var knapp = document.createElement("a");
      knapp.href = t.href;
      knapp.className = "knapp" + (tilstand === "apen" ? " hoved" : "");
      knapp.textContent = s(tilstand === "apen" ? "start" : "igjen");
      d.appendChild(knapp);
    }
    sti.appendChild(d);
  });
  var aapen = sti.querySelector("a.hoved");
  if (aapen) aapen.focus();
})();
