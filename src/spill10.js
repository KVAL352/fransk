// Spill 10: setninger i høstpakken (trinn 3). Se PLAN-host.md, «Spill 10».
// Del 1: ordene er blandet, hun drar dem på plass på linja (valg B, 2026-11-12), så «Sjekk». Trykk flytter også.
// Del 2: setningen vises oversatt, hun skriver den selv. src/sjekk.js med aksent som merknad.
// Del 2 åpnes når alle setningene i del 1 er ferdige. Etter begge delene blandes alt.
//
// Ferdig-regel (mitt forslag, ikke avgjort av Kjersti): riktig på første forsøk gjør setningen ferdig i den delen.
// Galt svar: setningen kommer igjen. Ferdige setninger trekkes veldig sjelden (FERDIG_ANDEL, som spill 8).
// Fremgang: «spill10», del 1 bruker nummer 1..N, del 2 bruker N+1..2N.
// ?test=1 hopper over låsen bak spill 9. ?test=1&del=2 åpner del 2 direkte.

(function () {
  window.Tekster.init();
  var S = window.SetningerHost;
  var N = S.ANTALL;
  var SPILL = "spill10";
  var FERDIG_ANDEL = 0.95;

  var TEKST = {
    nb: {
      tittel: "Fransk: høstsetninger",
      intro: "Bygg setninger med verbene og høstordene du har lært. Først setter du ordene i riktig rekkefølge, så skriver du setningene selv.",
      del1: "Del 1: rekkefølge", del2: "Del 2: skriv selv",
      delTekst: "{del}: {n} av {total} setninger ferdige",
      oppgave1: "Sett ordene i riktig rekkefølge.",
      oppgave2: "Skriv setningen på fransk.",
      tips: "Dra ordene opp på linja, og flytt dem rundt der. Du kan også trykke på et ord for å flytte det.",
      brukAlle: "Bruk alle ordene først.",
      riktig: "Riktig!",
      riktigAksent: "Riktig! Se på aksentene: {fasit}",
      riktigAndre: "Riktig på andre forsøk. Setningen kommer igjen.",
      fasit: "Riktig er:",
      proevIgjen: "Ikke helt. Prøv en gang til.",
      tomt: "Skriv setningen først.",
      hor: "Hør setningen",
      feiring1Tittel: "Del 1 er ferdig!",
      feiring1Tekst: "Nå skriver du setningene selv.",
      feiring1Knapp: "Til del 2",
      feiring2Tittel: "Høstpakken er ferdig!",
      feiring2Tekst: "Du har lært verbene, ordene og setningene.",
      feiring2Knapp: "Øv videre",
      viderePakke: "Til høstpakken",
      alleFerdig: "Begge delene er ferdige. Nå blandes alle setningene.",
      lenkeMeny: "Til høstpakken",
      lastTekst: "Setningene åpnes når du er ferdig med høstordene i høstpakken.",
      lastLenke: "Til høstpakken",
      bekreft: "Nullstille fremgangen i dette spillet?"
    },
    en: {
      tittel: "French: autumn sentences",
      intro: "Build sentences with the verbs and autumn words you have learned. First you put the words in the right order, then you write the sentences yourself.",
      del1: "Part 1: word order", del2: "Part 2: write it yourself",
      delTekst: "{del}: {n} of {total} sentences done",
      oppgave1: "Put the words in the right order.",
      oppgave2: "Write the sentence in French.",
      tips: "Drag the words up onto the line, and move them around there. You can also tap a word to move it.",
      brukAlle: "Use all the words first.",
      riktig: "Correct!",
      riktigAksent: "Correct! Check the accents: {fasit}",
      riktigAndre: "Correct on the second try. The sentence will come back.",
      fasit: "The answer is:",
      proevIgjen: "Not quite. Try once more.",
      tomt: "Write the sentence first.",
      hor: "Hear the sentence",
      feiring1Tittel: "Part 1 is done!",
      feiring1Tekst: "Now you write the sentences yourself.",
      feiring1Knapp: "On to part 2",
      feiring2Tittel: "The autumn pack is done!",
      feiring2Tekst: "You have learned the verbs, the words and the sentences.",
      feiring2Knapp: "Keep practising",
      viderePakke: "Back to the autumn pack",
      alleFerdig: "Both parts are done. Now all the sentences are mixed.",
      lenkeMeny: "Back to the autumn pack",
      lastTekst: "Sentences open when you have finished the autumn words in the autumn pack.",
      lastLenke: "Back to the autumn pack",
      bekreft: "Reset progress in this game?"
    }
  };
  var KODE = window.Tekster.kode();
  var SPRAK = KODE === "nb" ? "nb" : "en";
  function s(k, v) {
    var tekst = TEKST[SPRAK][k];
    Object.keys(v || {}).forEach(function (n) { tekst = tekst.split("{" + n + "}").join(v[n]); });
    return tekst;
  }
  function $(id) { return document.getElementById(id); }

  document.title = s("tittel");
  $("h1").textContent = s("tittel");
  $("menyLenke").textContent = s("lenkeMeny");
  $("intro").textContent = s("intro");
  $("tips").textContent = s("tips");
  $("hor").textContent = s("hor");
  $("svar").setAttribute("aria-label", s("oppgave2"));
  window.Stemme.init($("stemmeinfo"));

  var kortEl = $("kort"), linjeEl = $("linjen"), bankEl = $("banken"), tilbake = $("tilbakemelding");
  var del1El = $("del1"), skjemaEl = $("skjema"), svarEl = $("svar"), sjekk1 = $("sjekk1"), sjekk2 = $("sjekk2");
  var nesteKnapp = $("neste"), horKnapp = $("hor");

  var F = window.Fremgang;
  function ferdigDel(d) { return F.alleUtlaert(SPILL, d === 1 ? 1 : N + 1, d === 1 ? N : 2 * N); }
  function antallDel(d) { return F.antallUtlaert(SPILL, d === 1 ? 1 : N + 1, d === 1 ? N : 2 * N); }
  function testDel() {
    try {
      var p = new URLSearchParams(window.location.search);
      if (p.get("test") === "1" && p.get("del")) return Number(p.get("del"));
    } catch (e) { /* ingen test */ }
    return 0;
  }
  // Delen hun er på: 1 til del 1 er ferdig, så 2. 0 når begge er ferdige (alt blandes).
  function finnDel() {
    var t = testDel();
    if (t === 1 || t === 2) return t;
    if (!ferdigDel(1)) return 1;
    if (!ferdigDel(2)) return 2;
    return 0;
  }

  var DEL = finnDel();
  var id = null, forrige = null, setn = null, besvart = false, forsok = 0, delKlar = false;

  function tegnDeler() {
    var boks = $("deler");
    boks.textContent = "";
    [1, 2].forEach(function (d) {
      var f = document.createElement("div");
      var ferdig = ferdigDel(d);
      var last = d === 2 && !ferdig && DEL === 1;
      f.className = "delflis" + (ferdig ? " ferdig" : "") + (last ? " last" : "") + (DEL === d ? " na" : "");
      f.style.setProperty("--andel", antallDel(d) / N);
      f.textContent = s("del" + d) + (ferdig ? " ✓" : "");
      boks.appendChild(f);
    });
    $("dellinje").textContent = DEL ? s("delTekst", { del: s("del" + DEL), n: antallDel(DEL), total: N }) : s("alleFerdig");
  }

  function linje(tekst, klasse, fr) {
    var p = document.createElement("p");
    p.className = klasse || "";
    p.textContent = tekst;
    if (fr) p.lang = "fr";
    tilbake.appendChild(p);
  }

  function bland(liste) {
    var a = liste.slice();
    for (var forsoek = 0; forsoek < 20; forsoek++) {
      for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
      if (a.join(" ") !== liste.join(" ")) break;
    }
    return a;
  }

  // Hvilken del spørsmålet hører til: id 1..N er del 1, N+1..2N del 2.
  function delFor(i) { return i > N ? 2 : 1; }

  function nyttSporsmal() {
    var min = DEL === 2 ? N + 1 : 1, maks = DEL === 1 ? N : 2 * N;
    id = F.velgTall(SPILL, min, maks, forrige, null, null, FERDIG_ANDEL);
    forrige = id;
    setn = S.hent(id > N ? id - N : id);
    besvart = false; forsok = 0;
    tilbake.textContent = "";
    kortEl.classList.remove("ferdig", "inn");
    void kortEl.offsetWidth;
    kortEl.classList.add("inn");
    nesteKnapp.hidden = true; horKnapp.hidden = true;
    var betydEl = $("betyd");
    betydEl.textContent = S.betyd(setn, KODE);
    betydEl.lang = KODE;
    var d = delFor(id);
    $("oppgave").textContent = s(d === 1 ? "oppgave1" : "oppgave2");
    del1El.hidden = d !== 1;
    skjemaEl.hidden = d !== 2;
    if (d === 1) {
      linjeEl.className = "linjen";
      linjeEl.textContent = ""; bankEl.textContent = "";
      sjekk1.disabled = false;
      bland(setn.ord).forEach(function (o) { bankEl.appendChild(lagBrikke(o)); });
      bankEl.firstChild.focus();
    } else {
      svarEl.value = ""; svarEl.disabled = false; sjekk2.disabled = false;
      svarEl.classList.remove("galt", "rett");
      svarEl.focus();
    }
  }

  // ---- Del 1: brikker som dras (eller trykkes) ----
  function oppdaterStor() {
    Array.prototype.forEach.call(bankEl.querySelectorAll(".brikke"), function (b) { b.textContent = b.dataset.o; });
    Array.prototype.forEach.call(linjeEl.querySelectorAll(".brikke"), function (b, i) { b.textContent = i === 0 ? S.stor(b.dataset.o) : b.dataset.o; });
  }
  function lagBrikke(o) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "brikke"; b.dataset.o = o; b.textContent = o;
    b.addEventListener("click", function () {
      if (besvart) return;
      if (b.dataset.dro === "1") { b.dataset.dro = ""; return; }
      (b.parentNode === bankEl ? linjeEl : bankEl).appendChild(b);
      oppdaterStor(); tilbake.textContent = "";
      b.focus();
    });
    b.addEventListener("pointerdown", function (e) { if (!besvart) dra(b, e); });
    return b;
  }
  function dra(b, e) {
    var sx = e.clientX, sy = e.clientY, flyt = null, markor = null, r = b.getBoundingClientRect();
    function flytt(ev) {
      if (!flyt && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 6) return;
      if (!flyt) {
        flyt = b.cloneNode(true); flyt.classList.add("flyter"); flyt.style.width = r.width + "px";
        document.body.appendChild(flyt); b.classList.add("plass");
        markor = document.createElement("span"); markor.className = "markor";
      }
      ev.preventDefault();
      flyt.style.left = (ev.clientX - (sx - r.left)) + "px";
      flyt.style.top = (ev.clientY - (sy - r.top)) + "px";
      var lr = linjeEl.getBoundingClientRect();
      if (ev.clientY > lr.top - 30 && ev.clientY < lr.bottom + 20) {
        var andre = Array.prototype.filter.call(linjeEl.querySelectorAll(".brikke"), function (x) { return x !== b; });
        var foran = null;
        for (var i = 0; i < andre.length; i++) {
          var ar = andre[i].getBoundingClientRect();
          var sammeRad = ev.clientY < ar.bottom && ev.clientY > ar.top - 8;
          if ((sammeRad && ev.clientX < ar.left + ar.width / 2) || ev.clientY < ar.top - 8) { foran = andre[i]; break; }
        }
        linjeEl.insertBefore(markor, foran);
      } else if (markor.parentNode) markor.parentNode.removeChild(markor);
    }
    function slipp() {
      document.removeEventListener("pointermove", flytt);
      document.removeEventListener("pointerup", slipp);
      document.removeEventListener("pointercancel", slipp);
      if (!flyt) return;
      b.dataset.dro = "1";
      flyt.remove(); b.classList.remove("plass");
      if (markor.parentNode) { linjeEl.insertBefore(b, markor); markor.remove(); }
      else bankEl.appendChild(b);
      oppdaterStor(); tilbake.textContent = "";
      window.setTimeout(function () { b.dataset.dro = ""; }, 0);
    }
    document.addEventListener("pointermove", flytt);
    document.addEventListener("pointerup", slipp);
    document.addEventListener("pointercancel", slipp);
  }

  sjekk1.addEventListener("click", function () {
    if (besvart) return;
    var mitt = Array.prototype.map.call(linjeEl.querySelectorAll(".brikke"), function (b) { return b.dataset.o; });
    if (mitt.length < setn.ord.length) { tilbake.textContent = ""; linje(s("brukAlle"), "feil"); return; }
    var rett = mitt.join(" ") === setn.ord.join(" ");
    linjeEl.classList.add(rett ? "riktig" : "galt");
    Array.prototype.forEach.call(document.querySelectorAll("#del1 .brikke"), function (b) { b.disabled = true; });
    sjekk1.disabled = true;
    avslutt(rett, rett ? null : "fasit");
  });

  // ---- Del 2: skriv selv. Første feil gir ett nytt forsøk, andre feil viser fasiten (som spill 9). ----
  skjemaEl.addEventListener("submit", function (e) {
    e.preventDefault();
    if (besvart) return;
    if (svarEl.value.trim() === "") { tilbake.textContent = ""; linje(s("tomt"), "feil"); return; }
    forsok++;
    var r = window.Sjekk.sjekk(svarEl.value, S.fasit(setn), { aksent: "merknad" });
    if (r.riktig) {
      svarEl.disabled = true; sjekk2.disabled = true;
      svarEl.classList.remove("galt"); svarEl.classList.add("rett");
      avslutt(forsok === 1, r.aksentfeil ? "aksent" : forsok > 1 ? "andre" : null);
      return;
    }
    svarEl.classList.add("galt");
    if (forsok >= 2) {
      svarEl.disabled = true; sjekk2.disabled = true;
      avslutt(false, "fasit");
      return;
    }
    tilbake.textContent = "";
    linje(s("proevIgjen"), "feil");
    svarEl.focus();
  });

  function avslutt(riktigForste, merknad) {
    besvart = true;
    var varFerdig = DEL ? ferdigDel(DEL) : true;
    var varUtlaert = F.status(SPILL, id).utlaert;
    F.registrer(SPILL, id, riktigForste, 1, false);
    if (riktigForste && !varUtlaert) F.fullfor(SPILL, id);
    tilbake.textContent = "";
    if (riktigForste) {
      linje(merknad === "aksent" ? s("riktigAksent", { fasit: S.fasit(setn) }) : s("riktig"), "");
      if (!varUtlaert) { kortEl.classList.add("ferdig"); window.Feiring.konfettiFra(kortEl, false); }
      window.Feiring.boksLyd(DEL ? antallDel(DEL) / N : 1);
    } else if (merknad === "andre") {
      linje(s("riktigAndre"), "regel");
    } else {
      linje(s("fasit"), "feil");
      linje(S.fasit(setn), "fasit", true);
    }
    tegnDeler();
    horKnapp.hidden = false;
    nesteKnapp.hidden = false;
    nesteKnapp.focus();
    window.Stemme.si(S.fasit(setn));
    if (DEL && !varFerdig && ferdigDel(DEL)) {
      var ferdigDelNr = DEL;
      delKlar = true;
      window.setTimeout(function () {
        window.Feiring.vis(ferdigDelNr === 1
          ? { tittel: s("feiring1Tittel"), tekst: s("feiring1Tekst"), knapp: s("feiring1Knapp"), etterpaa: nesteKnapp,
              vedLukk: function () { if (delKlar) nesteKnapp.click(); } }
          : { tittel: s("feiring2Tittel"), tekst: s("feiring2Tekst"), knapp: s("feiring2Knapp"), etterpaa: nesteKnapp,
              videre: { tekst: s("viderePakke"), href: "hostpakke.html" },
              vedLukk: function () { if (delKlar) nesteKnapp.click(); } });
      }, 900);
    }
  }

  horKnapp.addEventListener("click", function () { if (setn) window.Stemme.si(S.fasit(setn)); });
  nesteKnapp.addEventListener("click", function () {
    if (delKlar) { delKlar = false; DEL = finnDelEtterFerdig(); tegnDeler(); }
    nyttSporsmal();
  });
  // Etter en feiring går hun videre til neste del, også i test med ?del=.
  function finnDelEtterFerdig() {
    if (!ferdigDel(1)) return 1;
    if (!ferdigDel(2)) return 2;
    return 0;
  }

  $("startknapp").addEventListener("click", function () {
    $("start").hidden = true;
    $("spill").hidden = false;
    nyttSporsmal();
  });
  $("nullstill").addEventListener("click", function () {
    if (!window.confirm(s("bekreft"))) return;
    F.nullstill(SPILL);
    window.location.reload();
  });

  // Trinn 3 i høstpakken: låst til ordene (spill 9) er ferdige. ?test=1 hopper over låsen.
  var test = false;
  try { test = new URLSearchParams(window.location.search).get("test") === "1"; } catch (e) { test = false; }
  if (!test && !window.HostPakke.ordFerdig()) {
    $("start").hidden = true;
    $("deler").hidden = true;
    $("dellinje").hidden = true;
    $("last").hidden = false;
    $("lastTekst").textContent = s("lastTekst");
    $("lastLenke").textContent = s("lastLenke");
    return;
  }
  tegnDeler();
})();
