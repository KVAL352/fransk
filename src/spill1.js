// Spill 1: lytt og skriv sifrene. Nivå velges med src/nivaa.js.
// Fremgang lagres per tall i Leitner-bokser (src/fremgang.js).

(function () {
  var SPILL = "spill1";
  var t = window.Tekster.t;
  window.Tekster.init();
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

  var streak = 0;
  var streakEl = document.getElementById("streak");
  // Språkuavhengig: antall riktige på rad, og ×2 eller ×3 når bonus gjelder.
  function visStreak(vekt) {
    streakEl.textContent = streak < 2 ? "" : streak + (vekt > 1 ? " ×" + vekt : "");
    streakEl.classList.toggle("bonus", vekt > 1);
  }

  function oppdaterTelling() {
    tellingEl.textContent = forsok === 0 ? "" : t("telling", { riktige: riktige, forsok: forsok });
  }

  document.getElementById("nullstill").addEventListener("click", function () {
    if (!window.confirm(t("bekreft.nullstill"))) return;
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
    streak = erRiktig ? streak + 1 : 0;
    var vekt = erRiktig ? window.Fremgang.bonus(streak) : 1;
    var resultat = window.Fremgang.registrer(SPILL, tall, erRiktig, vekt);
    visStreak(vekt);
    var erFerdig = window.Fremgang.alleUtlaert(SPILL, MIN, MAKS);
    if (erRiktig) {
      riktige++;
      tilbakemelding.className = "riktig";
      tilbakemelding.textContent = t("svar.riktig", { tall: tall, ord: ord });
    } else {
      tilbakemelding.className = "feil";
      tilbakemelding.textContent = t("svar.feil1", { svar: tekst, tall: tall, ord: ord });
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
          tittel: t("feiring.tittel1", { min: MIN, maks: MAKS }),
          tekst: t("feiring.tekst1"),
          videre: nivaa.videre,
          etterpaa: nesteKnapp
        });
      }, 900);
    }
  });
})();
