// Spill 11: «På vei» (metro, buss, trikk), første situasjon i snakkepakken. Setningene ligger i src/metro.js.
// Del 1: ordene er blandet, hun trykker dem på plass, så «Sjekk».
// Del 2: setningen vises oversatt, hun skriver den selv (src/sjekk.js, aksent som merknad).
// Del 3: setningen vises oversatt, hun SIER den høyt, trykker «Vis og hør», hører modellen og vurderer selv.
// Ingen mikrofon: valgt av henne 2026-11-12 («si høyt, vurder selv»).
// Delene åpnes i rekkefølge: del 2 når del 1 er ferdig, del 3 når del 2 er ferdig. Etter alle tre blandes alt.
//
// Ferdig-regel (mitt forslag, ikke avgjort av Kjersti): riktig på første forsøk gjør setningen ferdig i delen.
// I del 3 er «riktig» hennes egen vurdering. Galt svar eller «Jeg må øve mer»: setningen kommer igjen.
// Fremgang: «spill11», del 1 bruker 1..N, del 2 N+1..2N, del 3 2N+1..3N.
// ?test=1&del=2 (eller 3) åpner delen direkte.

(function () {
  window.Tekster.init();
  var IS = false; // ?pakke=is: isbutikken (src/is.js, egen fremgang spill12)
  try { IS = new URLSearchParams(window.location.search).get("pakke") === "is"; } catch (e) { IS = false; }
  var S = IS ? window.Is : window.Metro;
  var N = S.ANTALL;
  var SPILL = IS ? "spill12" : "spill11";
  var FERDIG_ANDEL = 0.95;

  var TEKST = {
    nb: {
      tittel: "Fransk: på vei (metro, buss, trikk)",
      intro: "Du forteller en venn at du er på vei. Først setter du ordene i riktig rekkefølge, så skriver du setningene, og til slutt sier du dem høyt. Setningene er utkast og er ikke lest av noen som kan fransk godt.",
      del1: "Del 1: rekkefølge", del2: "Del 2: skriv", del3: "Del 3: si høyt",
      delTekst: "{del}: {n} av {total} setninger ferdige",
      oppgave1: "Sett ordene i riktig rekkefølge.",
      oppgave2: "Skriv setningen på fransk.",
      oppgave3: "Si setningen høyt på fransk.",
      tips: "Trykk på ordene i riktig rekkefølge. Trykk på et ord på linja for å ta det bort igjen.",
      brukAlle: "Bruk alle ordene først.",
      riktig: "Riktig!",
      riktigAksent: "Riktig! Se på aksentene: {fasit}",
      riktigAndre: "Riktig på andre forsøk. Setningen kommer igjen.",
      fasit: "Riktig er:",
      proevIgjen: "Ikke helt. Prøv en gang til.",
      tomt: "Skriv setningen først.",
      hor: "Hør setningen",
      vis: "Vis og hør svaret",
      rett3: "Jeg sa det riktig",
      igjen3: "Jeg må øve mer",
      ovMer: "Greit. Setningen kommer igjen.",
      bra3: "Bra!",
      feiring1Tittel: "Del 1 er ferdig!", feiring1Tekst: "Nå skriver du setningene selv.", feiring1Knapp: "Til del 2",
      feiring2Tittel: "Del 2 er ferdig!", feiring2Tekst: "Nå sier du setningene høyt.", feiring2Knapp: "Til del 3",
      feiring3Tittel: "På vei er ferdig!", feiring3Tekst: "Du har bygget, skrevet og sagt alle setningene.", feiring3Knapp: "Øv videre",
      alleFerdig: "Alle delene er ferdige. Nå blandes alle setningene.",
      lenkeMeny: "Til «på vei»",
      bekreft: "Nullstille fremgangen i dette spillet?"
    },
    en: {
      tittel: "French: on the way (metro, bus, tram)",
      intro: "You tell a friend you are on your way. First you put the words in the right order, then you write the sentences, and last you say them out loud. The sentences are drafts and have not been checked by anyone who knows French well.",
      del1: "Part 1: word order", del2: "Part 2: write", del3: "Part 3: say it",
      delTekst: "{del}: {n} of {total} sentences done",
      oppgave1: "Put the words in the right order.",
      oppgave2: "Write the sentence in French.",
      oppgave3: "Say the sentence out loud in French.",
      tips: "Tap the words in the right order. Tap a word on the line to take it off again.",
      brukAlle: "Use all the words first.",
      riktig: "Correct!",
      riktigAksent: "Correct! Check the accents: {fasit}",
      riktigAndre: "Correct on the second try. The sentence will come back.",
      fasit: "The answer is:",
      proevIgjen: "Not quite. Try once more.",
      tomt: "Write the sentence first.",
      hor: "Hear the sentence",
      vis: "Show and hear the answer",
      rett3: "I said it right",
      igjen3: "I need more practice",
      ovMer: "OK. The sentence will come back.",
      bra3: "Good!",
      feiring1Tittel: "Part 1 is done!", feiring1Tekst: "Now you write the sentences yourself.", feiring1Knapp: "On to part 2",
      feiring2Tittel: "Part 2 is done!", feiring2Tekst: "Now you say the sentences out loud.", feiring2Knapp: "On to part 3",
      feiring3Tittel: "On the way is done!", feiring3Tekst: "You have built, written and said all the sentences.", feiring3Knapp: "Keep practising",
      alleFerdig: "All parts are done. Now all the sentences are mixed.",
      lenkeMeny: "Back to “on the way”",
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

  if (IS) {
    var IS_TEKST = {
      nb: { tittel: "Fransk: i isbutikken", intro: "Du kjøper is til deg selv og de du er sammen med. Først setter du ordene i riktig rekkefølge, så skriver du setningene, og til slutt sier du dem høyt. Setningene er utkast og er ikke lest av noen som kan fransk godt.", feiring3Tittel: "Isbutikken er ferdig!", lenkeMeny: "Til isbutikken" },
      en: { tittel: "French: at the ice cream shop", intro: "You buy ice cream for yourself and the people you are with. First you put the words in the right order, then you write the sentences, and last you say them out loud. The sentences are drafts and have not been checked by anyone who knows French well.", feiring3Tittel: "The ice cream shop is done!", lenkeMeny: "Back to the ice cream shop" }
    };
    ["nb", "en"].forEach(function (k) { Object.keys(IS_TEKST[k]).forEach(function (n) { TEKST[k][n] = IS_TEKST[k][n]; }); });
  }
  document.title = s("tittel");
  $("h1").textContent = s("tittel");
  $("menyLenke").textContent = s("lenkeMeny");
  $("menyLenke").href = IS ? "snakkepakke.html?situasjon=is" : "snakkepakke.html";
  $("intro").textContent = s("intro");
  $("tips").textContent = s("tips");
  $("hor").textContent = s("hor");
  $("vis").textContent = s("vis");
  $("rett3").textContent = s("rett3");
  $("igjen3").textContent = s("igjen3");
  $("svar").setAttribute("aria-label", s("oppgave2"));
  window.Stemme.init($("stemmeinfo"));

  var kortEl = $("kort"), linjeEl = $("linjen"), bankEl = $("banken"), tilbake = $("tilbakemelding");
  var del1El = $("del1"), skjemaEl = $("skjema"), del3El = $("del3"), svarEl = $("svar"), sjekk1 = $("sjekk1"), sjekk2 = $("sjekk2");
  var nesteKnapp = $("neste"), horKnapp = $("hor"), visKnapp = $("vis"), fr3 = $("fr3"), vurder = $("vurder");

  var F = window.Fremgang;
  function min(d) { return (d - 1) * N + 1; }
  function maks(d) { return d * N; }
  function ferdigDel(d) { return F.alleUtlaert(SPILL, min(d), maks(d)); }
  function antallDel(d) { return F.antallUtlaert(SPILL, min(d), maks(d)); }
  function testDel() {
    try {
      var p = new URLSearchParams(window.location.search);
      if (p.get("test") === "1" && p.get("del")) return Number(p.get("del"));
    } catch (e) { /* ingen test */ }
    return 0;
  }
  // Delen hun er på: første som ikke er ferdig. 0 når alle tre er ferdige (alt blandes).
  function finnDelEtterFerdig() {
    for (var d = 1; d <= 3; d++) if (!ferdigDel(d)) return d;
    return 0;
  }
  function finnDel() {
    var t = testDel();
    if (t >= 1 && t <= 3) return t;
    return finnDelEtterFerdig();
  }

  var DEL = finnDel();
  var id = null, forrige = null, setn = null, besvart = false, forsok = 0, delKlar = false;

  function tegnDeler() {
    var boks = $("deler");
    boks.textContent = "";
    [1, 2, 3].forEach(function (d) {
      var f = document.createElement("div");
      var ferdig = ferdigDel(d);
      var last = d > 1 && !ferdigDel(d - 1) && !ferdig && DEL !== 0 && DEL < d;
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

  // Hvilken del spørsmålet hører til: id 1..N del 1, N+1..2N del 2, 2N+1..3N del 3.
  function delFor(i) { return i > 2 * N ? 3 : i > N ? 2 : 1; }
  function setningFor(i) { return S.hent(((i - 1) % N) + 1); }

  // Ingen av metrosetningene har Lingua Libre-klipp ennå: nettleserstemmen leser opp (stille hvis enheten ikke har fransk stemme).
  function lesOpp() { window.Stemme.si(S.fasit(setn)); }

  function nyttSporsmal() {
    var lo = DEL ? min(DEL) : 1, hi = DEL ? maks(DEL) : 3 * N;
    id = F.velgTall(SPILL, lo, hi, forrige, null, null, FERDIG_ANDEL);
    forrige = id;
    setn = setningFor(id);
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
    $("oppgave").textContent = s("oppgave" + d);
    del1El.hidden = d !== 1;
    skjemaEl.hidden = d !== 2;
    del3El.hidden = d !== 3;
    if (d === 1) {
      linjeEl.className = "linjen";
      linjeEl.textContent = ""; bankEl.textContent = "";
      sjekk1.disabled = false;
      bland(setn.ord).forEach(function (o) { bankEl.appendChild(lagBrikke(o)); });
      bankEl.firstChild.focus();
    } else if (d === 2) {
      svarEl.value = ""; svarEl.disabled = false; sjekk2.disabled = false;
      svarEl.classList.remove("galt", "rett");
      svarEl.focus();
    } else {
      fr3.hidden = true; vurder.hidden = true; visKnapp.hidden = false; visKnapp.disabled = false;
      visKnapp.focus();
    }
  }

  // ---- Del 1: brikker som trykkes ----
  function oppdaterStor() {
    Array.prototype.forEach.call(bankEl.querySelectorAll(".brikke"), function (b) { b.textContent = b.dataset.o; });
    Array.prototype.forEach.call(linjeEl.querySelectorAll(".brikke"), function (b, i) { b.textContent = i === 0 ? S.stor(b.dataset.o) : b.dataset.o; });
  }
  function lagBrikke(o) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "brikke"; b.dataset.o = o; b.textContent = o;
    b.addEventListener("click", function () {
      if (besvart) return;
      (b.parentNode === bankEl ? linjeEl : bankEl).appendChild(b);
      oppdaterStor(); tilbake.textContent = "";
      b.focus();
    });
    return b;
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

  // ---- Del 2: skriv selv. Første feil gir ett nytt forsøk, andre feil viser fasiten. ----
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

  // ---- Del 3: si høyt, vis og hør modellen, vurder selv ----
  visKnapp.addEventListener("click", function () {
    if (besvart) return;
    fr3.textContent = S.fasit(setn);
    fr3.hidden = false; vurder.hidden = false; visKnapp.hidden = true;
    lesOpp();
    $("rett3").focus();
  });
  function vurdert(rett) {
    if (besvart) return;
    vurder.hidden = true;
    avslutt(rett, rett ? null : "mer");
  }
  $("rett3").addEventListener("click", function () { vurdert(true); });
  $("igjen3").addEventListener("click", function () { vurdert(false); });

  function avslutt(riktigForste, merknad) {
    besvart = true;
    var d = delFor(id);
    var varFerdig = DEL ? ferdigDel(DEL) : true;
    var varUtlaert = F.status(SPILL, id).utlaert;
    F.registrer(SPILL, id, riktigForste, 1, false);
    if (riktigForste && !varUtlaert) F.fullfor(SPILL, id);
    tilbake.textContent = "";
    if (riktigForste) {
      linje(d === 3 ? s("bra3") : merknad === "aksent" ? s("riktigAksent", { fasit: S.fasit(setn) }) : s("riktig"), "");
      if (!varUtlaert) { kortEl.classList.add("ferdig"); window.Feiring.konfettiFra(kortEl, false); }
      window.Feiring.boksLyd(DEL ? antallDel(DEL) / N : 1);
    } else if (merknad === "andre") {
      linje(s("riktigAndre"), "regel");
    } else if (merknad === "mer") {
      linje(s("ovMer"), "regel");
    } else {
      linje(s("fasit"), "feil");
      linje(S.fasit(setn), "fasit", true);
    }
    tegnDeler();
    horKnapp.hidden = false;
    nesteKnapp.hidden = false;
    nesteKnapp.focus();
    if (d !== 3) lesOpp();
    if (DEL && !varFerdig && ferdigDel(DEL)) {
      var nr = DEL;
      delKlar = true;
      window.setTimeout(function () {
        window.Feiring.vis({ tittel: s("feiring" + nr + "Tittel"), tekst: s("feiring" + nr + "Tekst"), knapp: s("feiring" + nr + "Knapp"), etterpaa: nesteKnapp,
          vedLukk: function () { if (delKlar) nesteKnapp.click(); } });
      }, 900);
    }
  }

  horKnapp.addEventListener("click", function () { if (setn) lesOpp(); });
  nesteKnapp.addEventListener("click", function () {
    if (delKlar) { delKlar = false; DEL = finnDelEtterFerdig(); tegnDeler(); }
    nyttSporsmal();
  });

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

  tegnDeler();
})();
