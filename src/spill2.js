// Spill 2: skriv tallet som ord. Nivå velges med src/nivaa.js.
// Fremgang lagres per tall i Leitner-bokser (src/fremgang.js).

(function () {
  var SPILL = "spill2";
  var nivaa = window.Nivaa.init(SPILL, document.getElementById("nivaa"));
  var MIN = nivaa.min;
  var MAKS = nivaa.maks;

  var stemmeinfo = document.getElementById("stemmeinfo");
  var startDiv = document.getElementById("start");
  var spillDiv = document.getElementById("spill");
  var tallEl = document.getElementById("tall");
  var skjema = document.getElementById("skjema");
  var svarFelt = document.getElementById("svar");
  var sjekkKnapp = document.getElementById("sjekk");
  var tilbakemelding = document.getElementById("tilbakemelding");
  var horKnapp = document.getElementById("hor");
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

  // Store/små bokstaver, bindestrek og ekstra mellomrom teller ikke. Aksenter teller.
  function normaliser(tekst) {
    return tekst.toLowerCase().replace(/-/g, " ").replace(/\s+/g, " ").trim();
  }

  function nyttTall() {
    tall = window.Fremgang.velgTall(SPILL, MIN, MAKS, tall, null, window.Nivaa.NIVAAER.map(function (n) { return n.maks; }));
    besvart = false;
    tallEl.textContent = tall;
    svarFelt.value = "";
    svarFelt.disabled = false;
    sjekkKnapp.disabled = false;
    tilbakemelding.textContent = "";
    tilbakemelding.className = "";
    horKnapp.hidden = true;
    nesteKnapp.hidden = true;
    svarFelt.focus();
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

  horKnapp.addEventListener("click", function () { si(window.tallTilOrd(tall)); });
  nesteKnapp.addEventListener("click", nyttTall);

  skjema.addEventListener("submit", function (e) {
    e.preventDefault();
    if (besvart) return;
    var tekst = svarFelt.value.trim();
    if (tekst === "") return;
    besvart = true;
    forsok++;
    var ord = window.tallTilOrd(tall);
    var erRiktig = normaliser(tekst) === normaliser(ord);
    var varFerdig = window.Fremgang.alleUtlaert(SPILL, MIN, MAKS);
    var resultat = window.Fremgang.registrer(SPILL, tall, erRiktig);
    var erFerdig = window.Fremgang.alleUtlaert(SPILL, MIN, MAKS);
    if (erRiktig) {
      riktige++;
      tilbakemelding.className = "riktig";
      tilbakemelding.textContent = "Riktig: " + tall + " = " + ord;
    } else {
      tilbakemelding.className = "feil";
      tilbakemelding.textContent = "Du skrev «" + tekst + "». Riktig svar: " + tall + " = " + ord;
    }
    svarFelt.disabled = true;
    sjekkKnapp.disabled = true;
    horKnapp.hidden = false;
    nesteKnapp.hidden = false;
    nesteKnapp.focus();
    oppdaterTelling();
    // Belønningslyden først, så ordet, så de ikke snakker i munnen på hverandre.
    var spilteLyd = visning.etterSvar(tall, resultat, erFerdig && !varFerdig);
    window.setTimeout(function () { si(ord); }, spilteLyd ? 450 : 0);
    if (erFerdig && !varFerdig) {
      window.setTimeout(function () {
        window.Feiring.vis({
          tittel: "Hurra! Du kan tallene fra " + MIN + " til " + MAKS + " som ord",
          tekst: "Alle tallene er utlært i dette spillet. Du kan terpe videre" + (nivaa.videre ? ", eller gå videre til neste steg." : ". Det var siste nivå."),
          videre: nivaa.videre,
          etterpaa: nesteKnapp
        });
      }, 900);
    }
  });
})();
