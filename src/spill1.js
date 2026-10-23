// Spill 1: lytt og skriv sifrene. Nivå velges med src/nivaa.js.
// Fremgang lagres per tall i Leitner-bokser (src/fremgang.js).

(function () {
  var SPILL = "spill1";
  var nivaa = window.Nivaa.init(SPILL, document.getElementById("nivaa"));
  var MIN = nivaa.min;
  var MAKS = nivaa.maks;

  var stemmeinfo = document.getElementById("stemmeinfo");
  var startDiv = document.getElementById("start");
  var spillDiv = document.getElementById("spill");
  var skjema = document.getElementById("skjema");
  var svarFelt = document.getElementById("svar");
  var tilbakemelding = document.getElementById("tilbakemelding");
  var horIgjen = document.getElementById("horIgjen");
  var nesteKnapp = document.getElementById("neste");
  var tellingEl = document.getElementById("telling");
  var visning = window.Fremgangsvisning.lag({
    spill: SPILL, min: MIN, maks: MAKS, beholder: document.getElementById("fremgang")
  });

  var tall = null;
  var besvart = false;
  var riktige = 0;
  var forsok = 0;

  window.Stemme.init(stemmeinfo);
  var si = window.Stemme.si;

  function nyttTall() {
    tall = window.Fremgang.velgTall(SPILL, MIN, MAKS, tall, null, window.Nivaa.NIVAAER.map(function (n) { return n.maks; }));
    besvart = false;
    svarFelt.value = "";
    svarFelt.disabled = false;
    tilbakemelding.textContent = "";
    tilbakemelding.className = "";
    horIgjen.hidden = true;
    nesteKnapp.hidden = true;
    document.getElementById("sjekk").disabled = false;
    svarFelt.focus();
    si(window.tallTilOrd(tall));
  }

  function oppdaterTelling() {
    tellingEl.textContent = forsok === 0 ? "" : riktige + " riktige av " + forsok + " denne gangen";
  }

  document.getElementById("nullstill").addEventListener("click", function () {
    if (!window.confirm("Nullstille all fremgang i dette spillet?")) return;
    window.Fremgang.nullstill(SPILL);
    window.location.reload();
  });

  document.getElementById("startknapp").addEventListener("click", function () {
    startDiv.hidden = true;
    spillDiv.hidden = false;
    nyttTall();
  });

  document.getElementById("hor").addEventListener("click", function () {
    si(window.tallTilOrd(tall));
    svarFelt.focus();
  });

  horIgjen.addEventListener("click", function () { si(window.tallTilOrd(tall)); });
  nesteKnapp.addEventListener("click", nyttTall);

  skjema.addEventListener("submit", function (e) {
    e.preventDefault();
    if (besvart) return;
    var tekst = svarFelt.value.trim();
    if (tekst === "") return;
    besvart = true;
    forsok++;
    var ord = window.tallTilOrd(tall);
    var erRiktig = Number(tekst) === tall;
    var varFerdig = window.Fremgang.alleUtlaert(SPILL, MIN, MAKS);
    var resultat = window.Fremgang.registrer(SPILL, tall, erRiktig);
    var erFerdig = window.Fremgang.alleUtlaert(SPILL, MIN, MAKS);
    if (erRiktig) {
      riktige++;
      tilbakemelding.className = "riktig";
      tilbakemelding.textContent = "Riktig: " + tall + " = " + ord;
    } else {
      tilbakemelding.className = "feil";
      tilbakemelding.textContent = "Du skrev " + tekst + ". Riktig svar: " + tall + " = " + ord;
    }
    svarFelt.disabled = true;
    document.getElementById("sjekk").disabled = true;
    horIgjen.hidden = false;
    nesteKnapp.hidden = false;
    nesteKnapp.focus();
    oppdaterTelling();
    visning.etterSvar(tall, resultat, erFerdig && !varFerdig);
    if (erFerdig && !varFerdig) {
      window.setTimeout(function () {
        window.Feiring.vis({
          tittel: "Hurra! Du kan tallene fra " + MIN + " til " + MAKS,
          tekst: "Alle tallene er utlært i dette spillet. Du kan terpe videre, eller gå videre til neste oppgave.",
          videre: nivaa.videre,
          etterpaa: nesteKnapp
        });
      }, 900);
    }
  });
})();
