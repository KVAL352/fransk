// Spill 5 og 6: se bildet, skriv ordet med artikkel. Spill 5 øver le/la (l' foran vokal), spill 6 un/une.
// Samme kode, styrt av window.SPILLOPPSETT = { spill, type } i HTML-fila. Se PLAN-bilder.md og PLAN-artikler.md.
// Ordene er substantivene fra setningene i spill 3 og 4 (src/ord.js). Fremgang lagres per ord i Leitner-bokser
// (src/fremgang.js), og boksen styrer hintet: boks 1-2 viser ordet som streker, uten streker for artikkelen, 3-4 første bokstav, 5 ingenting.
// Første feil: hun prøver en gang til. Andre feil: riktig svar vises. Rett første forsøk teller i fremgangen.
// Feil artikkel med riktig ord får egen tilbakemelding, siden kjønn er det som skal øves.
// Ingen lyd ennå: ingen kilde til belgiske stemmer for ordene (se OVERLEVERING.md).

(function () {
  var OPPSETT = window.SPILLOPPSETT;
  var SPILL = OPPSETT.spill;
  var TYPE = OPPSETT.type;
  var NOKKEL_PROFIL = "fransk.profil";

  window.Tekster.init();
  var O = window.Ord;
  var S = window.Setninger;
  var t = window.Tekster.t;
  var t3 = window.Tekster3.t;
  var MIN = 1;
  var MAKS = O.ANTALL;

  // Tekster for dette spillet. Andre språk enn norsk viser engelsk.
  var FELLES = {
    nb: {
      bildeAlt: "Bildet av ordet du skal skrive",
      riktig: "Riktig!",
      riktigAksent: "Riktig, men sjekk aksenten: {fasit}",
      riktigAndre: "Riktig denne gangen.",
      artikkelFeil: "Ordet er riktig, men artikkelen stemmer ikke. Tenk på kjønnet: {ord} er {kjonn}.",
      ordFeil: "Ikke helt. Prøv en gang til.",
      fasit: "Det var: {fasit}",
      eksempel: "I setningen: {setning}",
      kjonnNote: "{ord} er {kjonn}.",
      tomt: "Skriv et svar først.",
      laast: "Dette spillet åpnes når du har lært alle ordene i spill 5 (le og la).",
      kreditt: "Kreditt for bildene",
      lenkeSpill5: "Spill 5: le og la",
      lenkeSpill6: "Spill 6: un og une",
      lenkeMeny: "Til menyen",
      bekreft: "Nullstille fremgangen i dette spillet?"
    },
    en: {
      bildeAlt: "Picture of the word you should write",
      riktig: "Correct!",
      riktigAksent: "Correct, but check the accent: {fasit}",
      riktigAndre: "Correct this time.",
      artikkelFeil: "The word is right, but the article is not. Think about gender: {ord} is {kjonn}.",
      ordFeil: "Not quite. Try once more.",
      fasit: "It was: {fasit}",
      eksempel: "In the sentence: {setning}",
      kjonnNote: "{ord} is {kjonn}.",
      tomt: "Write an answer first.",
      laast: "This game opens when you have learned all the words in game 5 (le and la).",
      kreditt: "Picture credits",
      lenkeSpill5: "Game 5: le and la",
      lenkeSpill6: "Game 6: un and une",
      lenkeMeny: "Back to the menu",
      bekreft: "Reset progress in this game?"
    }
  };
  var PER_TYPE = {
    bestemt: {
      nb: {
        tittel: "Fransk: le og la",
        intro: "Se på bildet og skriv ordet på fransk med le eller la. Foran vokal skriver vi l'. Ordene kommer fra setningene i spill 3 og 4.",
        typeFeil: "Kjønnet er riktig, men i dette spillet bruker vi le, la eller l'.",
        vokalFeil: "Ordet er riktig. Foran en vokal skriver vi l', ikke le eller la.",
        kjonn_m: "hankjønn (le)",
        kjonn_f: "hunkjønn (la)",
        feiringTittel: "Alle ordene er lært!",
        feiringTekst: "Du kan le og la på alle bildeordene. Fortsett gjerne, så blir de sittende."
      },
      en: {
        tittel: "French: le and la",
        intro: "Look at the picture and write the word in French with le or la. Before a vowel we write l'. The words come from the sentences in games 3 and 4.",
        typeFeil: "The gender is right, but in this game we use le, la or l'.",
        vokalFeil: "The word is right. Before a vowel we write l', not le or la.",
        kjonn_m: "masculine (le)",
        kjonn_f: "feminine (la)",
        feiringTittel: "You know all the words!",
        feiringTekst: "You know le and la for every picture word. Keep going and they will stay."
      }
    },
    ubestemt: {
      nb: {
        tittel: "Fransk: un og une",
        intro: "Se på bildet og skriv ordet på fransk med un eller une. Ordene kommer fra setningene i spill 3 og 4.",
        typeFeil: "Kjønnet er riktig, men i dette spillet bruker vi un eller une.",
        vokalFeil: "",
        kjonn_m: "hankjønn (un)",
        kjonn_f: "hunkjønn (une)",
        feiringTittel: "Alle ordene er lært!",
        feiringTekst: "Du kan un og une på alle bildeordene. Fortsett gjerne, så blir de sittende."
      },
      en: {
        tittel: "French: un and une",
        intro: "Look at the picture and write the word in French with un or une. The words come from the sentences in games 3 and 4.",
        typeFeil: "The gender is right, but in this game we use un or une.",
        vokalFeil: "",
        kjonn_m: "masculine (un)",
        kjonn_f: "feminine (une)",
        feiringTittel: "You know all the words!",
        feiringTekst: "You know un and une for every picture word. Keep going and they will stay."
      }
    }
  };
  var TEKST = {};
  ["nb", "en"].forEach(function (k) {
    TEKST[k] = Object.assign({}, FELLES[k], PER_TYPE[TYPE][k]);
  });
  var SPRAK = window.Tekster.kode() === "nb" ? "nb" : "en";
  function s5(nokkel, verdier) {
    var tekst = TEKST[SPRAK][nokkel];
    Object.keys(verdier || {}).forEach(function (k) { tekst = tekst.split("{" + k + "}").join(verdier[k]); });
    return tekst;
  }

  function $(id) { return document.getElementById(id); }
  function lagret(nokkel) { try { return window.localStorage.getItem(nokkel); } catch (e) { return null; } }

  // Kjønnet hun valgte i spill 3 og 4 styrer bare setningen som vises som eksempel.
  function hentKjonn() {
    try {
      var p = JSON.parse(lagret(NOKKEL_PROFIL));
      return p && p.kjonn === "m" ? "m" : "f";
    } catch (e) {
      return "f";
    }
  }
  var kjonn = hentKjonn();

  document.title = s5("tittel");
  $("h1").textContent = s5("tittel");
  $("intro").textContent = s5("intro");
  $("kredittLenke").textContent = s5("kreditt");
  // Spill 5 og 6 henger sammen som spill 1 og 2: hvert spill lenker til det andre.
  $("annenLenke").textContent = s5(TYPE === "bestemt" ? "lenkeSpill6" : "lenkeSpill5");
  $("annenLenke").href = TYPE === "bestemt" ? "spill6.html" : "spill5.html";
  $("menyLenke").textContent = s5("lenkeMeny");

  var bildeEl = $("bilde");
  var hintEl = $("hint");
  var svarEl = $("svar");
  var sjekkKnapp = $("sjekk");
  var nesteKnapp = $("neste");
  var tilbakemelding = $("tilbakemelding");
  var eksempelEl = $("eksempel");
  var tellingEl = $("telling");
  var streakEl = $("streak");
  var infoEl = $("info");
  var visning = window.Fremgangsvisning.lag({ spill: SPILL, min: MIN, maks: MAKS, beholder: $("fremgang") });

  var nr = null;
  var ord = null;
  var forrige = null;
  var forsokPaaSpm = 0;
  var besvart = false;
  var forsok = 0;
  var riktige = 0;

  function nyttSporsmal() {
    nr = window.Fremgang.velgTall(SPILL, MIN, MAKS, forrige);
    forrige = nr;
    ord = O.hent(nr);
    var boks = window.Fremgang.status(SPILL, nr).boks;
    forsokPaaSpm = 0;
    besvart = false;
    bildeEl.src = ord.bilde;
    bildeEl.alt = s5("bildeAlt");
    bildeEl.classList.toggle("emoji", !ord.kilde.fil);
    var h = O.hint(ord, boks);
    hintEl.textContent = h;
    hintEl.hidden = h === "";
    infoEl.textContent = "";
    svarEl.value = "";
    svarEl.disabled = false;
    svarEl.classList.remove("galt");
    tilbakemelding.textContent = "";
    tilbakemelding.className = "";
    eksempelEl.textContent = "";
    nesteKnapp.hidden = true;
    sjekkKnapp.disabled = false;
    svarEl.focus();
  }

  // Språkuavhengig: antall riktige på rad, og ×2 eller ×3 når bonus gjelder.
  function visStreak(res) {
    var vis = res.streak >= 2 && !res.utlaert;
    streakEl.textContent = vis ? t3("streak", { streak: res.streak }) + (res.vekt > 1 ? " ×" + res.vekt : "") : "";
    streakEl.classList.toggle("bonus", vis && res.vekt > 1);
  }

  function oppdaterTelling() {
    tellingEl.textContent = forsok === 0 ? "" : t("telling", { riktige: riktige, forsok: forsok });
  }

  function avslutt(riktigForsteGang, aksentMerknad, rettAndreGang) {
    besvart = true;
    forsok++;
    var fasit = O.fasitTekst(ord, TYPE);
    var varFerdig = window.Fremgang.alleUtlaert(SPILL, MIN, MAKS);
    var res = window.Fremgang.registrer(SPILL, nr, riktigForsteGang, 1, true);
    visStreak(res);
    var erFerdig = window.Fremgang.alleUtlaert(SPILL, MIN, MAKS);
    if (riktigForsteGang) {
      riktige++;
      tilbakemelding.className = "riktig";
      tilbakemelding.textContent = aksentMerknad ? s5("riktigAksent", { fasit: fasit }) : s5("riktig");
    } else if (rettAndreGang) {
      tilbakemelding.className = "riktig";
      tilbakemelding.textContent = s5("riktigAndre");
    } else {
      tilbakemelding.className = "feil";
      tilbakemelding.textContent = s5("fasit", { fasit: fasit });
    }
    var setning = S.hent(ord.setning);
    var note = TYPE === "bestemt" && ord.vokal ? s5("kjonnNote", { ord: ord.ord, kjonn: s5("kjonn_" + ord.kjonn) }) + " " : "";
    eksempelEl.textContent = note + (setning ? s5("eksempel", { setning: S.tekst(setning, kjonn, null) }) : "");
    svarEl.disabled = true;
    sjekkKnapp.disabled = true;
    nesteKnapp.hidden = false;
    nesteKnapp.focus();
    oppdaterTelling();
    visning.etterSvar(nr, res, erFerdig && !varFerdig);
    if (erFerdig && !varFerdig) {
      window.setTimeout(function () {
        window.Feiring.vis({ tittel: s5("feiringTittel"), tekst: s5("feiringTekst"), videre: null, etterpaa: nesteKnapp });
      }, 900);
    }
  }

  $("skjema").addEventListener("submit", function (e) {
    e.preventDefault();
    if (besvart) return;
    if (svarEl.value.trim() === "") { tilbakemelding.className = "feil"; tilbakemelding.textContent = s5("tomt"); return; }
    forsokPaaSpm++;
    var v = O.vurder(svarEl.value, ord, TYPE);
    svarEl.classList.toggle("galt", v.status !== "riktig");
    if (v.status === "riktig") {
      avslutt(forsokPaaSpm === 1, v.aksentfeil, forsokPaaSpm > 1);
      return;
    }
    if (forsokPaaSpm >= 2) { avslutt(false, false, false); return; }
    tilbakemelding.className = "feil";
    tilbakemelding.textContent = v.status === "artikkel"
      ? s5("artikkelFeil", { ord: ord.ord, kjonn: s5("kjonn_" + ord.kjonn) })
      : v.status === "type" ? s5("typeFeil")
      : v.status === "vokal" ? s5("vokalFeil")
      : s5("ordFeil");
    svarEl.focus();
    svarEl.select();
  });

  nesteKnapp.addEventListener("click", nyttSporsmal);

  // Spill 6 er låst til spill 5 er ferdig. ?test=1 åpner (samme flagg som i src/nivaa.js).
  function testmodus() {
    try {
      var p = new URLSearchParams(window.location.search).get("test");
      if (p === "1") window.sessionStorage.setItem("fransk.test", "1");
      if (p === "0") window.sessionStorage.removeItem("fransk.test");
      return window.sessionStorage.getItem("fransk.test") === "1";
    } catch (e) {
      return false;
    }
  }
  if (TYPE === "ubestemt" && !testmodus() && !window.Fremgang.alleUtlaert("spill5", MIN, MAKS)) {
    $("startknapp").hidden = true;
    var laast = document.createElement("p");
    laast.textContent = s5("laast");
    $("start").appendChild(laast);
  }

  $("startknapp").addEventListener("click", function () {
    $("start").hidden = true;
    $("spill").hidden = false;
    nyttSporsmal();
  });

  $("nullstill").addEventListener("click", function () {
    if (!window.confirm(s5("bekreft"))) return;
    window.Fremgang.nullstill(SPILL);
    window.location.reload();
  });
})();
