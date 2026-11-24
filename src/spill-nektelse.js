// Nektelse (nektelse.html): gjør setningen nektende. Samme oppbygging som spill 8 (valgt av Kjersti 2026-11-24):
// boks 1-2 velger hun riktig nektelse blant tre, fra boks 3 skriver hun den selv. Ved skriving gir første feil ett
// nytt forsøk, andre feil viser fasiten og regelen. Bare riktig på første forsøk teller i fremgangen.
// 3 riktige på rad (første forsøk) på samme setning gjør den ferdig, som i spill 8 (FERDIG_REKKE).
// Tre nivåer etter hverandre (src/nektelse.js): hun er på det første som ikke er ferdig. Er alle ferdige, blandes alle.
// ?test=1&nivaa=2 åpner et bestemt nivå.

(function () {
  var SPILL = "nektelse";
  var N = window.Nektelse;
  var F = window.Fremgang;
  window.Tekster.init();
  var SPRAK = window.Tekster.kode() === "nb" ? "nb" : "en";
  var FERDIG_REKKE = 3;
  var SKRIVE_BOKS = 3;
  var FERDIG_ANDEL = 0.95;

  var TEKST = {
    nb: {
      tittel: "Fransk: si nei (ne ... pas)",
      intro: "Gjør setningen nektende. Først velger du riktig setning, etter hvert skriver du den selv.",
      oppgave: "{betyr} Gjør setningen nektende.",
      riktig: "Riktig!",
      riktigAksent: "Riktig, men sjekk aksenten: {fasit}",
      proev: "Ikke helt. Prøv en gang til.",
      tomt: "Skriv et svar først.",
      fasit: "Det var: {fasit}",
      hintNe: "Foran vokal og stum h blir ne til n'.",
      hintPasDe: "Etter pas blir un, une, du og des til de.",
      hintPas: "Husk både ne og pas, rundt verbet.",
      nivaaTekst: "Nivå {n}: {hva}",
      nivaaAlle: "Alle nivåene",
      ferdigTall: "{n} av {total} ferdige",
      paRad: "{n} på rad!",
      ferdigSetning: "Den sitter, og kommer ikke igjen.",
      feiringTittel: "Nivå {n} er lært!",
      feiringTekst: "Neste nivå er: {hva}.",
      feiringSist: "Du har lært alle tre nivåene. Nå blandes alle setningene.",
      tilNeste: "Til neste nivå",
      fortsett: "Fortsett",
      bekreft: "Nullstille fremgangen i dette spillet?",
      linje: "Fremgang for denne setningen"
    },
    en: {
      tittel: "French: saying no (ne ... pas)",
      intro: "Make the sentence negative. First you choose the right sentence, later you write it yourself.",
      oppgave: "{betyr} Make the sentence negative.",
      riktig: "Correct!",
      riktigAksent: "Correct, but check the accent: {fasit}",
      proev: "Not quite. Try once more.",
      tomt: "Write an answer first.",
      fasit: "It was: {fasit}",
      hintNe: "Before a vowel and silent h, ne becomes n'.",
      hintPasDe: "After pas, un, une, du and des become de.",
      hintPas: "Remember both ne and pas, around the verb.",
      nivaaTekst: "Level {n}: {hva}",
      nivaaAlle: "All levels",
      ferdigTall: "{n} of {total} done",
      paRad: "{n} in a row!",
      ferdigSetning: "It stays done and will not come back.",
      feiringTittel: "Level {n} learned!",
      feiringTekst: "The next level is: {hva}.",
      feiringSist: "You have learned all three levels. Now all the sentences are mixed.",
      tilNeste: "On to the next level",
      fortsett: "Continue",
      bekreft: "Reset progress in this game?",
      linje: "Progress for this sentence"
    }
  };
  function s(k, v) {
    var tekst = TEKST[SPRAK][k];
    Object.keys(v || {}).forEach(function (n) { tekst = tekst.split("{" + n + "}").join(v[n]); });
    return tekst;
  }
  function $(id) { return document.getElementById(id); }

  document.title = s("tittel");
  $("h1").textContent = s("tittel");
  $("intro").textContent = s("intro");

  var kortEl = $("kort"), oppgaveEl = $("oppgave"), hjelpEl = $("hjelp"), valgEl = $("valg");
  var skjemaEl = $("skjema"), svarEl = $("svar"), tilbakeEl = $("tilbakemelding"), nesteKnapp = $("neste");

  var NIVAA = null; // { nr, min, maks } eller null når alle er ferdige
  var nr = null, forrige = null, oppg = null, forsok = 0, besvart = false, nivaaKlart = false;

  function ferdigNivaa(n) { return F.alleUtlaert(SPILL, n.min, n.maks); }
  function finnNivaa() {
    for (var i = 0; i < N.NIVAER.length; i++) if (!ferdigNivaa(N.NIVAER[i])) return N.NIVAER[i];
    return null;
  }
  try {
    var p = new URLSearchParams(window.location.search);
    var tvang = parseInt(p.get("nivaa"), 10);
    NIVAA = p.get("test") === "1" && N.NIVAER[tvang - 1] ? N.NIVAER[tvang - 1] : finnNivaa();
  } catch (e) { NIVAA = finnNivaa(); }

  function bygTopp() {
    var linjeEl = $("nivaaLinje");
    linjeEl.textContent = "";
    N.NIVAER.forEach(function (n) {
      var d = document.createElement("div");
      d.className = "nivaa" + (NIVAA && NIVAA.nr === n.nr ? " na" : "");
      d.style.flex = "1";
      d.appendChild(document.createElement("i"));
      linjeEl.appendChild(d);
    });
    $("nivaaTekst").textContent = NIVAA ? s("nivaaTekst", { n: NIVAA.nr, hva: N.nivaanavn(NIVAA.nr, SPRAK) }) : s("nivaaAlle");
  }
  function tegnTopp() {
    var sum = 0;
    N.NIVAER.forEach(function (n, i) {
      var ferdig = F.antallUtlaert(SPILL, n.min, n.maks);
      $("nivaaLinje").children[i].firstChild.style.transform = "scaleX(" + ferdig / (n.maks - n.min + 1) + ")";
      sum += ferdig;
    });
    var tekst = s("ferdigTall", { n: sum, total: N.ANTALL });
    $("ferdigTekst").textContent = tekst;
    $("nivaaLinje").setAttribute("aria-label", tekst);
  }

  function andel() {
    if (F.status(SPILL, nr).utlaert) return 1;
    var st = F.steg(SPILL, nr, nr);
    return Math.max(st.gjort / st.totalt, Math.min(1, F.streakFor(SPILL, nr) / FERDIG_REKKE));
  }
  function tegnKortlinje() {
    var a = andel();
    $("formfyll").style.transform = "scaleX(" + a + ")";
    $("formfyll").style.background = a >= 1 ? "" : a >= 2 / 3 ? "var(--gull)" : "var(--nivaa)";
    $("formlinje").setAttribute("aria-valuenow", String(Math.round(a * 100)));
    $("formlinje").setAttribute("aria-label", s("linje"));
  }

  var merkeTimer = null;
  function visPaRad(n) {
    var el = $("paRad");
    window.clearTimeout(merkeTimer);
    el.classList.remove("vis");
    void el.offsetWidth;
    el.textContent = s("paRad", { n: n });
    el.classList.add("vis");
    merkeTimer = window.setTimeout(function () { el.classList.remove("vis"); }, 1800);
  }

  function bland(liste) {
    for (var i = liste.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var x = liste[i]; liste[i] = liste[j]; liste[j] = x;
    }
    return liste;
  }

  function nyttSporsmal() {
    besvart = false;
    forsok = 0;
    var min = NIVAA ? NIVAA.min : 1, maks = NIVAA ? NIVAA.maks : N.ANTALL;
    nr = F.velgTall(SPILL, min, maks, forrige, null, null, FERDIG_ANDEL);
    forrige = nr;
    oppg = N.oppgave(nr);
    kortEl.className = "kort";
    void kortEl.offsetWidth;
    kortEl.classList.add("inn");
    $("paRad").classList.remove("vis");
    oppgaveEl.className = "oppgave instruks";
    oppgaveEl.textContent = oppg.pos;
    hjelpEl.textContent = s("oppgave", { betyr: SPRAK === "nb" ? oppg.nb : oppg.en });
    tilbakeEl.textContent = "";
    nesteKnapp.hidden = true;
    valgEl.textContent = "";
    var skriv = F.status(SPILL, nr).boks >= SKRIVE_BOKS;
    skjemaEl.hidden = !skriv;
    valgEl.hidden = skriv;
    if (skriv) {
      svarEl.value = "";
      svarEl.className = "";
      svarEl.disabled = false;
      $("sjekk").disabled = false;
      svarEl.focus();
    } else {
      bland([oppg.neg].concat(oppg.feil)).forEach(function (t) {
        var b = document.createElement("button");
        b.type = "button";
        b.textContent = t;
        b.addEventListener("click", function () { velg(b, t); });
        valgEl.appendChild(b);
      });
      valgEl.firstChild.focus();
    }
    tegnKortlinje();
  }

  function linje(tekst, klasse) {
    var p = document.createElement("p");
    if (klasse) p.className = klasse;
    p.textContent = tekst;
    tilbakeEl.appendChild(p);
    return p;
  }
  function visFasit() {
    linje(s("fasit", { fasit: oppg.neg }), "feil").lang = "fr";
    linje(N.regel(oppg.nivaa, SPRAK), "regel");
  }

  function velg(knapp, tekst) {
    if (besvart) return;
    var riktig = tekst === oppg.neg;
    Array.prototype.forEach.call(valgEl.children, function (b) {
      b.disabled = true;
      if (b.textContent === oppg.neg) b.classList.add("riktig");
    });
    if (!riktig) knapp.classList.add("feil");
    tilbakeEl.textContent = "";
    if (riktig) linje(s("riktig")); else visFasit();
    ferdigSvar(riktig);
  }

  // Treffsikre hint ved første feil i skriving.
  function hint(svar) {
    var t = svar.toLowerCase();
    if (/\bne [aeiouyhàâéèêëîïôûœ]/.test(t)) return s("hintNe");
    if (oppg.nivaa === 3 && /\bpas (un|une|du|des|de l')\b/.test(t)) return s("hintPasDe");
    if (!/\bpas\b/.test(t) || !/\bne\b|\bn'/.test(t)) return s("hintPas");
    return null;
  }

  skjemaEl.addEventListener("submit", function (e) {
    e.preventDefault();
    if (besvart) { neste(); return; }
    var svar = svarEl.value.trim();
    tilbakeEl.textContent = "";
    if (!svar) { linje(s("tomt")); return; }
    var r = window.Sjekk.sjekk(svar, oppg.neg);
    forsok++;
    if (r.riktig) {
      svarEl.className = "rett";
      linje(r.aksentfeil ? s("riktigAksent", { fasit: oppg.neg }) : s("riktig"));
      svarEl.disabled = true;
      $("sjekk").disabled = true;
      ferdigSvar(forsok === 1);
      return;
    }
    if (forsok === 1) {
      svarEl.className = "galt";
      linje(s("proev"), "feil");
      var h = hint(svar);
      if (h) linje(h, "regel");
      svarEl.select();
      return;
    }
    svarEl.className = "galt";
    svarEl.disabled = true;
    $("sjekk").disabled = true;
    visFasit();
    ferdigSvar(false);
  });

  function ferdigSvar(riktigForsteGang) {
    besvart = true;
    var varFerdig = F.status(SPILL, nr).utlaert;
    var res = F.registrer(SPILL, nr, riktigForsteGang, 1, true);
    if (riktigForsteGang && res.streak >= 2) visPaRad(res.streak);
    if (riktigForsteGang && res.streak >= FERDIG_REKKE && !res.utlaert) F.fullfor(SPILL, nr);
    if (!varFerdig && F.status(SPILL, nr).utlaert) {
      kortEl.classList.add("ferdig");
      linje(s("ferdigSetning"));
      if (window.Feiring.utlaertLyd) window.Feiring.utlaertLyd();
    } else if (riktigForsteGang) {
      kortEl.classList.add("riktig-blink");
    }
    tegnKortlinje();
    tegnTopp();
    if (NIVAA && ferdigNivaa(NIVAA)) nivaaKlart = true;
    nesteKnapp.hidden = false;
    nesteKnapp.focus();
  }

  function neste() {
    if (nivaaKlart) {
      nivaaKlart = false;
      var gammel = NIVAA;
      NIVAA = finnNivaa();
      bygTopp();
      tegnTopp();
      window.Feiring.vis({
        tittel: s("feiringTittel", { n: gammel.nr }),
        tekst: NIVAA ? s("feiringTekst", { hva: N.nivaanavn(NIVAA.nr, SPRAK) }) : s("feiringSist"),
        knapp: NIVAA ? s("tilNeste") : s("fortsett"),
        vedLukk: nyttSporsmal
      });
      return;
    }
    nyttSporsmal();
  }

  nesteKnapp.addEventListener("click", neste);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && besvart && !nesteKnapp.hidden && document.activeElement !== nesteKnapp && !document.querySelector(".feiring-bak")) {
      e.preventDefault();
      neste();
    }
  });

  $("startknapp").addEventListener("click", function () {
    $("start").hidden = true;
    $("spill").hidden = false;
    bygTopp();
    tegnTopp();
    nyttSporsmal();
  });

  $("nullstill").addEventListener("click", function () {
    if (!window.confirm(s("bekreft"))) return;
    F.nullstill(SPILL);
    NIVAA = finnNivaa();
    bygTopp();
    tegnTopp();
    if (!$("spill").hidden) nyttSporsmal();
  });
})();
