// Spill 9: høstord. Hun ser et bilde og skriver ordet med bestemt artikkel (le, la, l', les). Se PLAN-host.md.
// Seks temaer etter hverandre (Host.TEMAER): hun er på det første som ikke er utlært, de neste er låst.
// Boks 1-2: tre knapper, ett forsøk. Boks 3-5: hun skriver ordet med artikkel. Første feil: ett nytt forsøk,
// andre feil viser riktig svar. Rett første forsøk teller i fremgangen (Leitner-bokser i src/fremgang.js).
// Etter svaret: farge og lyd, og ordet leses opp (lyd/<ord>.mp3 via Stemme). Ingen tekst ved riktig svar.
// Er alle seks temaene lært, blandes alle 39 ordene.

(function () {
  var SPILL = "spill9";
  window.Tekster.init();
  var H = window.Host;
  var O = window.Ord;
  var t = window.Tekster.t;
  var TEMA = null; // temaet hun er på (objekt fra Host.TEMAER), null når alle er lært og alt blandes
  var MIN = 1;
  var MAKS = H.ANTALL;
  var temaKlart = false; // temaet ble nettopp ferdig: neste trykk på Neste åpner det neste
  var SKRIVE_BOKS = 3; // fra og med denne boksen skriver hun svaret selv
  var FERDIG_REKKE = 3; // så mange riktige på rad (første forsøk) på samme ord og ordet er ferdig, uansett boks
  var TEMAIKON = ["🌦️", "🌲", "🧥", "🦊", "🍎", "🍳"];

  // Tekster for dette spillet. Andre språk enn norsk viser engelsk.
  var TEKST = {
    nb: {
      tittel: "Fransk: høstord",
      intro: "Se på bildet og skriv ordet på fransk med le, la, l' eller les.",
      introTema: "Tema: {tema}.",
      introAlle: "Alle seks temaene er lært. Nå blandes alle ordene.",
      bildeAlt: "Bildet av ordet du skal skrive",
      riktigAksent: "Riktig, men sjekk aksenten: {fasit}",
      riktigAndre: "Riktig denne gangen.",
      fasit: "Det var: {fasit}",
      tomt: "Skriv et svar først.",
      ordFeil: "Ikke helt. Prøv en gang til.",
      artikkelFeil: "Ordet er riktig, men artikkelen stemmer ikke. Tenk på kjønnet: {ord} er {kjonn}.",
      vokalFeil: "Ordet er riktig. Foran en vokal skriver vi l', ikke le eller la.",
      flertallFeil: "Ordet er riktig, men bildet viser flere. Skriv les foran.",
      kjonn_m: "hankjønn (le)",
      kjonn_f: "hunkjønn (la)",
      paRad: "{n} på rad!",
      formLinje: "Fremgang for dette ordet",
      hor: "Hør ordet",
      temaTekst: "{tema}: {n} av {total} ord lært",
      temaFlis: "{tema}",
      feiringTittel: "{tema} er lært!",
      feiringTekst: "Neste tema er: {neste}.",
      feiringSist: "Du har lært alle seks temaene. Nå får du alle ordene blandet.",
      feiringNeste: "Til neste tema: {neste}",
      feiringBland: "Bland alle ordene",
      ordFerdig: "{ord} er ferdig",
      lenkeMeny: "Til høstpakken",
      lastTekst: "Høstord åpnes når du er ferdig med verbene i høstpakken.",
      lastLenke: "Til høstpakken",
      viderePakke: "Tilbake til høstpakken",
      kreditt: "Kreditt for bilder og lyd",
      bekreft: "Nullstille fremgangen i dette spillet?"
    },
    en: {
      tittel: "French: autumn words",
      intro: "Look at the picture and write the word in French with le, la, l' or les.",
      introTema: "Theme: {tema}.",
      introAlle: "All six themes are learned. Now all the words are mixed.",
      bildeAlt: "Picture of the word you should write",
      riktigAksent: "Correct, but check the accent: {fasit}",
      riktigAndre: "Correct this time.",
      fasit: "It was: {fasit}",
      tomt: "Write an answer first.",
      ordFeil: "Not quite. Try once more.",
      artikkelFeil: "The word is right, but the article is not. Think about gender: {ord} is {kjonn}.",
      vokalFeil: "The word is right. Before a vowel we write l', not le or la.",
      flertallFeil: "The word is right, but the picture shows more than one. Write les in front.",
      kjonn_m: "masculine (le)",
      kjonn_f: "feminine (la)",
      paRad: "{n} in a row!",
      formLinje: "Progress for this word",
      hor: "Hear the word",
      temaTekst: "{tema}: {n} of {total} words learned",
      temaFlis: "{tema}",
      feiringTittel: "{tema} learned!",
      feiringTekst: "The next theme is: {neste}.",
      feiringSist: "You have learned all six themes. Now you get all the words mixed together.",
      feiringNeste: "On to the next theme: {neste}",
      feiringBland: "Mix all the words",
      ordFerdig: "{ord} is done",
      lenkeMeny: "Back to the autumn pack",
      lastTekst: "Autumn words open when you have finished the verbs in the autumn pack.",
      lastLenke: "Back to the autumn pack",
      viderePakke: "Back to the autumn pack",
      kreditt: "Picture and audio credits",
      bekreft: "Reset progress in this game?"
    }
  };
  var SPRAK = window.Tekster.kode() === "nb" ? "nb" : "en";
  function s9(nokkel, verdier) {
    var tekst = TEKST[SPRAK][nokkel];
    Object.keys(verdier || {}).forEach(function (k) { tekst = tekst.split("{" + k + "}").join(verdier[k]); });
    return tekst;
  }

  function $(id) { return document.getElementById(id); }

  document.title = s9("tittel");
  $("h1").textContent = s9("tittel");
  $("menyLenke").textContent = s9("lenkeMeny");
  $("kredittLenke").textContent = s9("kreditt");

  var kortEl = $("kort");
  var bildeEl = $("bilde");
  var hintEl = $("hint");
  var valgEl = $("valg");
  // Pil opp/ned flytter mellom svarknappene (rundt i ring), som i spill 8. Enter velger den som har fokus.
  valgEl.addEventListener("keydown", function (e) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    var knapper = Array.prototype.slice.call(valgEl.children);
    var i = knapper.indexOf(document.activeElement);
    if (i < 0) return;
    e.preventDefault();
    var steg = e.key === "ArrowDown" ? 1 : -1;
    knapper[(i + steg + knapper.length) % knapper.length].focus();
  });
  var skjemaEl = $("skjema");
  var svarEl = $("svar");
  var sjekkKnapp = $("sjekk");
  var tilbakemelding = $("tilbakemelding");
  var nesteKnapp = $("neste");
  var horKnapp = $("hor");
  horKnapp.textContent = s9("hor");
  svarEl.setAttribute("aria-label", s9("bildeAlt"));
  window.Stemme.init($("stemmeinfo"));

  var nr = null;
  var ord = null;
  var forrige = null;
  var besvart = false;
  var skriver = false;
  var forsokPaaSpm = 0;

  function stokk(liste) {
    for (var i = liste.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var x = liste[i]; liste[i] = liste[j]; liste[j] = x;
    }
    return liste;
  }

  // Ordene i et tema har sammenhengende nummer, så Fremgang kan bruke min og maks.
  function grenser(tema) {
    var o = H.iTema(tema.nr);
    return { min: o[0].nr, maks: o[o.length - 1].nr };
  }
  function temaFerdig(tema) {
    var g = grenser(tema);
    return window.Fremgang.alleUtlaert(SPILL, g.min, g.maks);
  }

  // Første tema som ikke er utlært, eller null når alle er ferdige.
  function finnTema() {
    for (var i = 0; i < H.TEMAER.length; i++) if (!temaFerdig(H.TEMAER[i])) return H.TEMAER[i];
    return null;
  }

  // ?test=1&tema=2 åpner et bestemt tema uten å spille seg dit (bare ved oppstart).
  function testTema() {
    try {
      var p = new URLSearchParams(window.location.search);
      if (p.get("test") === "1" && p.get("tema")) return H.TEMAER[Number(p.get("tema")) - 1] || null;
    } catch (e) { /* ingen test */ }
    return null;
  }

  function temaNavn(tema) { return tema.navn; }

  // Temakartet: ferdig = gull med hake, nåværende = ramme, resten låst.
  function tegnKart(nyttIdx) {
    var kart = $("kart");
    kart.textContent = "";
    H.TEMAER.forEach(function (tm, i) {
      var g = grenser(tm);
      var ferdig = window.Fremgang.alleUtlaert(SPILL, g.min, g.maks);
      var na = TEMA && TEMA.nr === tm.nr;
      var last = !ferdig && !na && TEMA !== null;
      var d = document.createElement("div");
      d.className = "flis" + (ferdig ? " ferdig" : "") + (na ? " na" : "") + (last ? " last" : "") + (nyttIdx === i ? " ny" : "");
      var st = window.Fremgang.steg(SPILL, g.min, g.maks);
      d.style.setProperty("--andel", ferdig ? "1" : String(st.gjort / st.totalt));
      d.setAttribute("role", "listitem");
      d.setAttribute("aria-label", temaNavn(tm) + (ferdig ? " ✓" : last ? " 🔒" : ""));
      var ikon = document.createElement("span");
      ikon.textContent = TEMAIKON[i];
      ikon.setAttribute("aria-hidden", "true");
      d.appendChild(ikon);
      if (ferdig) {
        var h = document.createElement("i");
        h.className = "hake";
        h.textContent = "✓";
        h.setAttribute("aria-hidden", "true");
        d.appendChild(h);
      }
      kart.appendChild(d);
    });
    var linje = $("temalinje");
    if (TEMA) {
      var gr = grenser(TEMA);
      var ts = window.Fremgang.steg(SPILL, gr.min, gr.maks);
      linje.textContent = s9("temaTekst", { tema: temaNavn(TEMA), n: window.Fremgang.antallUtlaert(SPILL, gr.min, gr.maks), total: gr.maks - gr.min + 1 }) +
        " (" + Math.round(100 * ts.gjort / ts.totalt) + " %)";
    } else {
      linje.textContent = "";
    }
  }

  function startTema(tm, nyttIdx) {
    TEMA = tm;
    if (tm) { var g = grenser(tm); MIN = g.min; MAKS = g.maks; } else { MIN = 1; MAKS = H.ANTALL; }
    forrige = null;
    tegnKart(nyttIdx);
    $("intro").textContent = s9("intro") + " " + (tm ? s9("introTema", { tema: temaNavn(tm) }) : s9("introAlle"));
  }

  // Riktig svar, samme ord med feil artikkel (den typiske feilen) og riktig svar for et annet ord i temaet.
  function knappevalg() {
    var feilArtikkel = ord.flertall ? "le " + ord.ord
      : ord.vokal ? (ord.kjonn === "f" ? "la " : "le ") + ord.ord
      : (ord.kjonn === "f" ? "le " : "la ") + ord.ord;
    var andre = H.ORD.filter(function (o) { return o.nr >= MIN && o.nr <= MAKS && o.nr !== ord.nr; });
    var tredje = H.fasit(andre[Math.floor(Math.random() * andre.length)]);
    return stokk([H.fasit(ord), feilArtikkel, tredje]);
  }

  // Hvor langt dette ordet er kommet, av stegene fra boks 1 til utlært.
  function ordAndel() {
    if (window.Fremgang.status(SPILL, nr).utlaert) return 1;
    var st = window.Fremgang.steg(SPILL, nr, nr);
    return Math.max(st.gjort / st.totalt, Math.min(1, window.Fremgang.streakFor(SPILL, nr) / FERDIG_REKKE));
  }

  function tegnOrdlinje() {
    var a = ordAndel();
    var el = $("formlinje");
    var fyll = $("formfyll");
    fyll.style.transform = "scaleX(" + a + ")";
    fyll.style.background = a >= 1 ? "" : a >= 2 / 3 ? "var(--gull)" : "";
    el.setAttribute("aria-valuenow", String(Math.round(a * 100)));
    el.setAttribute("aria-label", s9("formLinje"));
  }

  // Én linje i svarfeltet: klasse "feil", "regel" eller "skjult" (bare for skjermleser).
  function linje(tekst, klasse) {
    var p = document.createElement("p");
    p.className = klasse;
    p.textContent = tekst;
    tilbakemelding.appendChild(p);
  }

  var merkeTimer = null;
  function visPaRad(n) {
    var el = $("paRad");
    window.clearTimeout(merkeTimer);
    el.classList.remove("vis");
    void el.offsetWidth;
    el.textContent = s9("paRad", { n: n });
    el.classList.add("vis");
    merkeTimer = window.setTimeout(function () { el.classList.remove("vis"); }, 1800);
  }

  function nyttSporsmal() {
    besvart = false;
    kortEl.className = "kort";
    void kortEl.offsetWidth;
    kortEl.classList.add("inn");
    $("paRad").classList.remove("vis");
    nr = window.Fremgang.velgTall(SPILL, MIN, MAKS, forrige);
    // Et utlært ord kommer ikke igjen mens temaet pågår. I blandet modus (TEMA er null) trekkes alle.
    for (var forsok = 0; TEMA && window.Fremgang.status(SPILL, nr).utlaert && forsok < 50; forsok++) {
      nr = window.Fremgang.velgTall(SPILL, MIN, MAKS, forrige);
    }
    forrige = nr;
    ord = H.hent(nr);
    var boks = window.Fremgang.status(SPILL, nr).boks;
    skriver = boks >= SKRIVE_BOKS;
    forsokPaaSpm = 0;
    bildeEl.src = ord.bilde;
    bildeEl.alt = s9("bildeAlt");
    bildeEl.classList.toggle("emoji", !ord.kilde.fil);
    var h = skriver ? O.hint(ord, boks) : "";
    hintEl.textContent = h;
    hintEl.hidden = h === "";
    valgEl.textContent = "";
    skjemaEl.hidden = !skriver;
    svarEl.value = "";
    svarEl.disabled = false;
    svarEl.classList.remove("galt", "rett");
    sjekkKnapp.disabled = false;
    if (!skriver) {
      knappevalg().forEach(function (tekst) {
        var b = document.createElement("button");
        b.type = "button";
        b.textContent = tekst;
        b.addEventListener("click", function () { svar(b); });
        valgEl.appendChild(b);
      });
    }
    tilbakemelding.textContent = "";
    tegnOrdlinje();
    nesteKnapp.hidden = true;
    horKnapp.hidden = true;
    if (skriver) svarEl.focus(); else valgEl.firstChild.focus();
  }

  function sigOrdet() { if (ord) window.Stemme.si(ord.ord); }
  horKnapp.addEventListener("click", sigOrdet);

  // Felles avslutning for knappesvar og skrevet svar. riktigForsteGang styrer fremgangen.
  // melding = null ved vanlig riktig svar (ingen tekst, bare farge og lyd).
  function avslutt(riktigForsteGang, melding, klasse) {
    besvart = true;
    var varFerdig = TEMA ? temaFerdig(TEMA) : window.Fremgang.alleUtlaert(SPILL, MIN, MAKS);
    var ordVarUtlaert = window.Fremgang.status(SPILL, nr).utlaert;
    var res = window.Fremgang.registrer(SPILL, nr, riktigForsteGang, 1, true);
    if (riktigForsteGang && !res.utlaert && res.streak >= FERDIG_REKKE) {
      window.Fremgang.fullfor(SPILL, nr);
      res.utlaert = true;
    }
    var ferdigNaa = TEMA ? temaFerdig(TEMA) : window.Fremgang.alleUtlaert(SPILL, MIN, MAKS);
    var ordFerdig = res.utlaert && !ordVarUtlaert;
    tilbakemelding.textContent = "";
    kortEl.classList.remove("inn", "riktig-blink");
    void kortEl.offsetWidth;
    tegnOrdlinje();
    tegnKart();
    if (riktigForsteGang) {
      if (res.streak >= 2 && !ordVarUtlaert) visPaRad(res.streak);
      if (ordFerdig) {
        kortEl.classList.add("ferdig");
        linje(s9("ordFerdig", { ord: H.fasit(ord) }), "skjult");
        window.Feiring.konfettiFra(kortEl, true);
        window.Feiring.utlaertLyd();
      } else {
        kortEl.classList.add("riktig-blink");
        window.Feiring.boksLyd(ordAndel());
        linje(H.fasit(ord), "skjult");
      }
    } else if (klasse === "feil") {
      linje(melding, "feil");
    }
    if (klasse !== "feil" && melding) linje(melding, "regel");
    // Hva ordet betyr, på språket hun har valgt (Kjersti 2026-11-12).
    var betydning = H.betyd(ord, window.Tekster.kode());
    if (betydning) {
      linje(H.fasit(ord) + " = " + betydning, "betyd");
      var bp = tilbakemelding.lastChild;
      bp.lang = window.Tekster.kode();
      bp.dir = "auto";
    }
    horKnapp.hidden = false;
    nesteKnapp.hidden = false;
    nesteKnapp.focus();
    window.setTimeout(sigOrdet, 350);
    if (ferdigNaa && !varFerdig && TEMA) {
      var ferdigTema = TEMA;
      var neste = H.TEMAER[ferdigTema.nr] || null; // TEMAER[n] er temaet etter tema n
      temaKlart = true;
      window.setTimeout(function () {
        window.Feiring.vis({
          tittel: s9("feiringTittel", { tema: temaNavn(ferdigTema) }),
          tekst: neste ? s9("feiringTekst", { neste: temaNavn(neste) }) : s9("feiringSist"),
          videre: neste ? null : { tekst: s9("viderePakke"), href: "hostpakke.html" }, etterpaa: nesteKnapp,
          knapp: neste ? s9("feiringNeste", { neste: temaNavn(neste) }) : s9("feiringBland"),
          vedLukk: function () { if (temaKlart) nesteKnapp.click(); }
        });
      }, 900);
    }
  }

  function svar(knapp) {
    if (besvart) return;
    var fasit = H.fasit(ord);
    var erRiktig = knapp.textContent === fasit;
    Array.prototype.forEach.call(valgEl.children, function (b) {
      b.disabled = true;
      if (b.textContent === fasit) b.classList.add("riktig");
    });
    if (!erRiktig) knapp.classList.add("feil");
    avslutt(erRiktig, erRiktig ? null : s9("fasit", { fasit: fasit }), erRiktig ? "riktig" : "feil");
  }

  // Skrevet svar: første feil gir ett nytt forsøk, andre feil viser fasiten.
  skjemaEl.addEventListener("submit", function (e) {
    e.preventDefault();
    if (besvart || !skriver) return;
    if (svarEl.value.trim() === "") { tilbakemelding.textContent = ""; linje(s9("tomt"), "feil"); return; }
    forsokPaaSpm++;
    var v = H.vurder(svarEl.value, ord);
    var fasit = H.fasit(ord);
    if (v.status === "riktig") {
      svarEl.disabled = true;
      sjekkKnapp.disabled = true;
      svarEl.classList.remove("galt");
      svarEl.classList.add("rett");
      avslutt(forsokPaaSpm === 1, v.aksentfeil ? s9("riktigAksent", { fasit: fasit }) : forsokPaaSpm > 1 ? s9("riktigAndre") : null, "riktig");
      return;
    }
    svarEl.classList.add("galt");
    if (forsokPaaSpm >= 2) {
      svarEl.disabled = true;
      sjekkKnapp.disabled = true;
      avslutt(false, s9("fasit", { fasit: fasit }), "feil");
      return;
    }
    tilbakemelding.textContent = "";
    linje(v.status === "artikkel" ? s9("artikkelFeil", { ord: ord.ord, kjonn: s9("kjonn_" + ord.kjonn) })
      : v.status === "vokal" ? s9("vokalFeil")
      : v.status === "flertall" ? s9("flertallFeil")
      : s9("ordFeil"), "feil");
    svarEl.focus();
    svarEl.select();
  });

  nesteKnapp.addEventListener("click", function () {
    if (temaKlart) {
      temaKlart = false;
      var neste = finnTema();
      startTema(neste, neste ? neste.nr - 1 : undefined);
    }
    nyttSporsmal();
  });

  $("startknapp").addEventListener("click", function () {
    startTema(testTema() || finnTema());
    $("start").hidden = true;
    $("spill").hidden = false;
    nyttSporsmal();
  });

  $("nullstill").addEventListener("click", function () {
    if (!window.confirm(s9("bekreft"))) return;
    window.Fremgang.nullstill(SPILL);
    window.location.reload();
  });

  // Trinn 2 i høstpakken: låst til verbtrinnet er ferdig. ?test=1 hopper over låsen.
  var test = false;
  try { test = new URLSearchParams(window.location.search).get("test") === "1"; } catch (e) { test = false; }
  if (!test && !window.HostPakke.verbFerdig()) {
    $("start").hidden = true;
    $("kart").hidden = true;
    $("temalinje").hidden = true;
    $("last").hidden = false;
    $("lastTekst").textContent = s9("lastTekst");
    $("lastLenke").textContent = s9("lastLenke");
    return;
  }

  startTema(testTema() || finnTema());
})();
