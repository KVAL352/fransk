// Snakkepakken, en side per situasjon (src/situasjoner.js): tre trinn i en sti (verb, ord, setninger), uten lås.
// Trinn 1 verb (spill8.html?pakke=<navn>), trinn 2 ord (spill9.html?pakke=<navn>), trinn 3 setninger (spill11.html[?pakke=<navn>]).
// Status leses fra fremgangen i hvert spill, ingenting lagres her. Stilen er den samme som hostpakke.html.

(function () {
  var F = window.Fremgang;

  // ?situasjon=<navn> (src/situasjoner.js). Uten gyldig verdi vises «på vei».
  var Sx = window.Situasjoner;
  var SIT = Sx.SITUASJONER.metro;
  try { SIT = Sx.hent(new URLSearchParams(window.location.search).get("situasjon")) || SIT; } catch (e) { /* standard */ }
  var NAVN = SIT.navn;
  var ORDMOD = Sx.ordMod(SIT);
  var SETNMOD = Sx.setnMod(SIT);
  function verbFerdig() { return F.alleUtlaert(Sx.verbSpill(SIT), 1, window.Verb.pakke(NAVN).LISTE.length); }
  function ordFerdig() { return F.alleUtlaert(SIT.ordSpill, 1, ORDMOD.ANTALL); }
  function setnFerdig() { return F.alleUtlaert(SIT.setnSpill, 1, 3 * SETNMOD.ANTALL); }

  window.Tekster.init();
  var TEKST = {
    nb: {
      trinn: "Trinn {n}",
      verb: "Verb",
      ord: "Ord",
      setn: "Setninger", setnDel: "sett sammen, skriv, si høyt",
      ferdig: "ferdig", lenkeMeny: "Til menyen", start: "Start", igjen: "Øv igjen"
    },
    en: {
      trinn: "Step {n}",
      verb: "Verbs",
      ord: "Words",
      setn: "Sentences", setnDel: "build, write, say aloud",
      ferdig: "done", lenkeMeny: "Back to the menu", start: "Start", igjen: "Practise again"
    }
  };
  ["nb", "en"].forEach(function (k) {
    TEKST[k].tittel = SIT[k].pakkeTittel;
    TEKST[k].verbDel = SIT[k].verbDel;
    TEKST[k].ordDel = SIT[k].ordDel;
  });
  var SPRAK = window.Tekster.kode() === "nb" ? "nb" : "en";
  function s(k, v) {
    var tekst = TEKST[SPRAK][k];
    Object.keys(v || {}).forEach(function (n) { tekst = tekst.split("{" + n + "}").join(v[n]); });
    return tekst;
  }
  document.title = s("tittel");
  document.getElementById("h1").textContent = s("tittel");
  document.getElementById("menyLenke").textContent = s("lenkeMeny");

  var sti = document.getElementById("sti");
  var TRINN = [
    { navn: s("verb"), del: s("verbDel"), href: "spill8.html?pakke=" + NAVN, ferdig: verbFerdig() },
    { navn: s("ord"), del: s("ordDel"), href: "spill9.html?pakke=" + NAVN, ferdig: ordFerdig() },
    { navn: s("setn"), del: s("setnDel"), href: Sx.hrefSetn(SIT), ferdig: setnFerdig() },
  ];
  // Ingen lås: første trinn som ikke er ferdig er «åpent» (Start), de andre kan alltid åpnes.
  var forste = TRINN.findIndex(function (t) { return !t.ferdig; });

  TRINN.forEach(function (t, i) {
    if (i > 0) {
      var bind = document.createElement("div");
      bind.className = "bind" + (TRINN[i - 1].ferdig ? " gull" : "");
      bind.setAttribute("aria-hidden", "true");
      sti.appendChild(bind);
    }
    var hoved = i === forste;
    var d = document.createElement("div");
    d.className = "trinn" + (t.ferdig ? " ferdig" : "") + (hoved ? " apen" : "");
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
    if (t.ferdig) {
      var sr = document.createElement("span");
      sr.className = "skjult";
      sr.textContent = ", " + s("ferdig");
      d.appendChild(sr);
    }
    var knapp = document.createElement("a");
    knapp.href = t.href;
    knapp.className = "knapp" + (hoved ? " hoved" : "");
    knapp.textContent = s(t.ferdig ? "igjen" : "start");
    d.appendChild(knapp);
    sti.appendChild(d);
  });
  var aapen = sti.querySelector("a.hoved");
  if (aapen) aapen.focus();
})();
