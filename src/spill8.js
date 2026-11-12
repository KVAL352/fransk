// Spill 8: bøy verbet. Oppgaven viser pronomen + infinitiv ("nous + parler"), hun velger riktig form blant tre knapper.
// Se PLAN-time.md. Fire nivåer etter hverandre (V.NIVAER): hun er på det første som ikke er utlært.
// Boks 1-2: tre knapper, ett forsøk. Boks 3-5: hun skriver hele formen med pronomen. Første feil: ett nytt forsøk,
// andre feil viser riktig svar og regelen. Rett første forsøk teller i fremgangen. Fremgang per oppgave i Leitner-bokser (src/fremgang.js).

(function () {
  // ?pakke=host: verbtrinnet i høstpakken (8 verb, nivå etter person, egen fremgang). Se PLAN-host.md.
  var PAKKE = null;
  try {
    var pakkeParam = new URLSearchParams(window.location.search).get("pakke");
    PAKKE = pakkeParam === "host" || pakkeParam === "metro" || pakkeParam === "is" ? pakkeParam : null;
  } catch (e) { PAKKE = null; }
  var SPILL = PAKKE ? PAKKE + "verb" : "spill8";
  window.Tekster.init();
  var V = PAKKE ? window.Verb.pakke(PAKKE) : window.Verb;
  var t = window.Tekster.t;
  var t3 = window.Tekster3.t;
  // Nivået hun er på: det første som ikke er utlært. Er alle fire ferdige, er NIVAA null og alle 66 formene blandes.
  var NIVAA = null;
  var MIN = 1;
  var MAKS = V.LISTE.length;
  var nivaaKlart = false; // nivået ble nettopp ferdig: neste trykk på Neste åpner det neste
  var FERDIG_REKKE = 3; // så mange riktige på rad (første forsøk) på samme form og formen er ferdig, uansett boks
  var HOR_BOKS = 4; // fra og med denne boksen er hver andre skriveoppgave hør og skriv (formen spilles, pronomenet skjules)
  var SKRIVE_BOKS = 3; // fra og med denne boksen skriver hun svaret selv
  var FERDIG_ANDEL = 0.95; // minst 95 % av trekkene går til former som ikke er ferdige, så ferdige kommer veldig sjelden

  // Tekster for dette spillet. Andre språk enn norsk viser engelsk.
  var TEKST = {
    nb: {
      tittel: "Fransk: bøy verbet",
      intro: "Velg riktig form av verbet.",
      introNivaa: "Nivå {n}: {hva}.",
      introAlle: "Alle fire nivåene er lært. Nå blandes alle formene.",
      riktig: "Riktig!",
      fasit: "Det var: {fasit}",
      lenkeMeny: "Til menyen",
      feiringTittel: "Nivå {n} er lært!",
      feiringTekst: "Neste nivå er: {hva}.",
      feiringSist: "Du har lært alle fire nivåene. Nå får du alle formene blandet.",
      videreHost: "Videre til høstord",
      tilNeste: "Til neste nivå",
      bekreft: "Nullstille fremgangen i dette spillet?",
      betydSporsmal: "Hva betyr verbet?",
      betydRiktig: "Riktig!",
      betydFeil: "{verb} betyr: {betyr}. Det kommer igjen om litt.",
      hor: "Hør formen",
      ferdigForm: "{form}: {n} riktige på rad. Den sitter, og kommer ikke igjen.",
      hopp: "Du kan dette mønsteret. Resten av formene er flyttet opp, så nå skriver du dem.",
      betydFerdig: "Du kan hva verbene betyr. Nå bøyer vi dem.",
      tomt: "Skriv et svar først.",
      proev: "Ikke helt. Prøv en gang til.",
      elisjonFeil: "Nesten. Foran en vokal skriver vi j', ikke je.",
      riktigAksent: "Riktig, men sjekk aksenten: {fasit}",
      riktigAndre: "Riktig denne gangen.",
      horSkriv: "Hør og skriv hele formen.",
      ferdigTall: "{n} av {total} former ferdige",
      nivaaTekst: "Nivå {n}",
      nivaaAlle: "Alle nivå",
      paRad: "{n} på rad!",
      formFerdig: "{form} er ferdig",
      kreditt: "Lyd og kreditt",
      horIgjen: "Hør igjen",
      formLinje: "Fremgang for denne formen",
      regelnavn_endelse: "endelsene på verb på -er",
      regelnavn_elisjon: "j' foran vokal og stum h",
      regelnavn_geons: "nous mangeons (-ger)",
      regelnavn_appeler: "appeler",
      regelnavn_etre: "être",
      regelnavn_avoir: "avoir",
      regelnavn_aller: "aller",
      regelnavn_prendre: "prendre",
      regelnavn_descendre: "descendre",
      regelnavn_partir: "partir"
    },
    en: {
      tittel: "French: conjugate the verb",
      intro: "Choose the right form of the verb.",
      introNivaa: "Level {n}: {hva}.",
      introAlle: "All four levels are learned. Now all the forms are mixed.",
      riktig: "Correct!",
      fasit: "It was: {fasit}",
      lenkeMeny: "Back to the menu",
      feiringTittel: "Level {n} learned!",
      feiringTekst: "The next level is: {hva}.",
      feiringSist: "You have learned all four levels. Now you get all the forms mixed together.",
      videreHost: "On to autumn words",
      tilNeste: "On to the next level",
      bekreft: "Reset progress in this game?",
      betydSporsmal: "What does the verb mean?",
      betydRiktig: "Correct!",
      betydFeil: "{verb} means: {betyr}. It will come back soon.",
      hor: "Hear the form",
      ferdigForm: "{form}: {n} correct in a row. It stays done and will not come back.",
      hopp: "You know this pattern. The remaining forms have moved up, so now you write them.",
      betydFerdig: "You know what the verbs mean. Now let's conjugate them.",
      tomt: "Write an answer first.",
      proev: "Not quite. Try once more.",
      elisjonFeil: "Almost. Before a vowel we write j', not je.",
      riktigAksent: "Correct, but check the accent: {fasit}",
      riktigAndre: "Correct this time.",
      horSkriv: "Hear and write the whole form.",
      ferdigTall: "{n} of {total} forms done",
      nivaaTekst: "Level {n}",
      nivaaAlle: "All levels",
      paRad: "{n} in a row!",
      formFerdig: "{form} is done",
      kreditt: "Audio and credits",
      horIgjen: "Hear again",
      formLinje: "Progress for this form",
      regelnavn_endelse: "the endings of -er verbs",
      regelnavn_elisjon: "j' before a vowel and silent h",
      regelnavn_geons: "nous mangeons (-ger)",
      regelnavn_appeler: "appeler",
      regelnavn_etre: "être",
      regelnavn_avoir: "avoir",
      regelnavn_aller: "aller",
      regelnavn_prendre: "prendre",
      regelnavn_descendre: "descendre",
      regelnavn_partir: "partir"
    }
  };
  // Pakkene: to nivåer og tilbake til stien i stedet for menyen.
  var PAKKE_TEKST = {
    host: {
      href: "hostpakke.html",
      nb: { tittel: "Fransk: høstverb", feiringSist: "Du har lært begge nivåene. Trinn 2, høstord, er åpent.", videreHost: "Tilbake til høstpakken", lenkeMeny: "Til høstpakken" },
      en: { tittel: "French: autumn verbs", feiringSist: "You have learned both levels. Step 2, autumn words, is open.", videreHost: "Back to the autumn pack", lenkeMeny: "Back to the autumn pack" }
    },
    is: {
      href: "snakkepakke.html?situasjon=is",
      nb: { tittel: "Fransk: verb i isbutikken", feiringSist: "Du har lært begge nivåene. Nå kan du øve ordene og setningene i isbutikken.", videreHost: "Tilbake til isbutikken", lenkeMeny: "Til isbutikken" },
      en: { tittel: "French: verbs at the ice cream shop", feiringSist: "You have learned both levels. Now you can practise the words and sentences at the ice cream shop.", videreHost: "Back to the ice cream shop", lenkeMeny: "Back to the ice cream shop" }
    },
    metro: {
      href: "snakkepakke.html",
      nb: { tittel: "Fransk: verb på vei", feiringSist: "Du har lært begge nivåene. Nå kan du øve ordene og setningene på vei.", videreHost: "Tilbake til «på vei»", lenkeMeny: "Til «på vei»" },
      en: { tittel: "French: verbs on the way", feiringSist: "You have learned both levels. Now you can practise the words and sentences on the way.", videreHost: "Back to “on the way”", lenkeMeny: "Back to “on the way”" }
    }
  };
  if (PAKKE) ["nb", "en"].forEach(function (s) {
    var felles = { introAlle: s === "nb" ? "Begge nivåene er lært. Nå blandes alle formene." : "Both levels are learned. Now all the forms are mixed." };
    Object.keys(felles).forEach(function (k) { TEKST[s][k] = felles[k]; });
    Object.keys(PAKKE_TEKST[PAKKE][s]).forEach(function (k) { TEKST[s][k] = PAKKE_TEKST[PAKKE][s][k]; });
  });
  var SPRAK = window.Tekster.kode() === "nb" ? "nb" : "en";
  function s8(nokkel, verdier) {
    var tekst = TEKST[SPRAK][nokkel];
    Object.keys(verdier || {}).forEach(function (k) { tekst = tekst.split("{" + k + "}").join(verdier[k]); });
    return tekst;
  }

  function $(id) { return document.getElementById(id); }

  document.title = s8("tittel");
  $("h1").textContent = s8("tittel");
  $("intro").textContent = s8("intro");
  $("menyLenke").textContent = s8("lenkeMeny");
  if (PAKKE) $("menyLenke").href = PAKKE_TEKST[PAKKE].href;
  var VIDERE_HREF = PAKKE ? PAKKE_TEKST[PAKKE].href : "spill9.html";
  $("kredittLenke").textContent = s8("kreditt");

  var kortEl = $("kort");
  var oppgaveEl = $("oppgave");
  var oversattEl = $("hjelp");
  var valgEl = $("valg");
  var nesteKnapp = $("neste");
  var horKnapp = $("hor");
  horKnapp.textContent = s8("hor");
  window.Stemme.init($("stemmeinfo"));
  var skjemaEl = $("skjema");
  var svarEl = $("svar");
  var sjekkKnapp = $("sjekk");
  var tilbakemelding = $("tilbakemelding");

  // Nivåfarger fra flagget: 1 svart, 2 rød, 3 gul, 4 alle tre.
  var NIVAAFARGE = ["#1c1c1a", "#b3261e", "#e0a800", "linear-gradient(90deg, #1c1c1a 0 33.3%, #e0a800 33.3% 66.6%, #b3261e 66.6% 100%)"];
  var ALLE_FARGE = NIVAAFARGE[3];

  // Én linje i svarfeltet: klasse "feil", "regel" eller "skjult" (bare for skjermleser).
  function linje(tekst, klasse) {
    var p = document.createElement("p");
    p.className = klasse;
    p.textContent = tekst;
    tilbakemelding.appendChild(p);
  }

  // Betydningssteget: før bøyingen spørres hvert verb i nivået om hva det betyr. Ett riktig svar = kjent, lagret,
  // og spørres ikke igjen. Feil: verbet legges bakerst i køen. Kan hun alle, er steget over etter ett klikk per verb.
  var NOKKEL_KJENT = "fransk.verbkjent";
  function lesKjent() {
    try { var k = JSON.parse(window.localStorage.getItem(NOKKEL_KJENT)); return Array.isArray(k) ? k : []; }
    catch (e) { return []; }
  }
  function merkKjent(verb) {
    var k = lesKjent();
    if (k.indexOf(verb) < 0) k.push(verb);
    try { window.localStorage.setItem(NOKKEL_KJENT, JSON.stringify(k)); } catch (e) { /* virker uten lagring */ }
  }
  var ALLE_VERB = Object.keys(V.BETYDNING);
  var ko = [];
  var betydVerb = null; // verbet som spørres nå, null = vanlig bøying
  var visteBetydFerdig = true;

  var nr = null;
  var variant = 0;
  var forrige = null;
  var besvart = false;
  var forsok = 0;
  var riktige = 0;
  var skriver = false; // boks 3-5: hun skriver svaret
  var horOgSkriv = false; // boks 4-5, annenhver gang: hun hører formen og skriver den
  var forsokPaaSpm = 0;

  function stokk(liste) {
    for (var i = liste.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var x = liste[i]; liste[i] = liste[j]; liste[j] = x;
    }
    return liste;
  }

  // Første nivå som ikke er utlært, eller null når alle er ferdige.
  function finnNivaa() {
    for (var i = 0; i < V.NIVAER.length; i++) {
      var n = V.NIVAER[i];
      if (!window.Fremgang.alleUtlaert(SPILL, n.min, n.maks)) return n;
    }
    return null;
  }

  // ?test=1&nivaa=2 åpner et bestemt nivå uten å spille seg dit (bare ved oppstart).
  function testNivaa() {
    try {
      var p = new URLSearchParams(window.location.search);
      if (p.get("test") === "1" && p.get("nivaa")) return V.NIVAER[Number(p.get("nivaa")) - 1] || null;
    } catch (e) { /* ingen test */ }
    return null;
  }

  // Setter opp nivået: grenser, betydningskø, fremgangsvisning og introtekst.
  function startNivaa(n) {
    NIVAA = n;
    MIN = n ? n.min : 1;
    MAKS = n ? n.maks : V.LISTE.length;
    forrige = null;
    ko = n ? stokk(V.verbINivaa(n.nivaa).filter(function (v) { return lesKjent().indexOf(v) < 0; })) : [];
    visteBetydFerdig = ko.length === 0;
    document.body.style.setProperty("--nivaa", n ? NIVAAFARGE[n.nivaa - 1] : ALLE_FARGE);
    bygTopp();
    $("intro").textContent = s8("intro") + " " + (n ? s8("introNivaa", { n: n.nivaa, hva: n[SPRAK] }) : s8("introAlle"));
  }

  // Riktig svar, den typiske feilen (første alternativ) og ett tilfeldig av resten.
  function knappevalg() {
    var alt = V.alternativer(nr, variant);
    var andre = alt.slice(1);
    var tredje = andre[Math.floor(Math.random() * andre.length)];
    return stokk([V.fasit(nr, variant), alt[0], tredje]);
  }

  // Riktig betydning og to andre verbs betydninger.
  function betydValg() {
    var andre = stokk(ALLE_VERB.filter(function (v) { return v !== betydVerb; })).slice(0, 2);
    return stokk([betydVerb].concat(andre).map(function (v) { return V.betydning(v, SPRAK); }));
  }

  // Toppen: ett felt per nivå, bredde etter antall former, og «N av 66 former ferdige».
  function bygTopp() {
    var linjeEl = $("nivaaLinje");
    linjeEl.textContent = "";
    V.NIVAER.forEach(function (n) {
      var d = document.createElement("div");
      d.className = "nivaa" + (NIVAA && NIVAA.nivaa === n.nivaa ? " na" : "");
      d.style.flex = String(n.maks - n.min + 1);
      d.appendChild(document.createElement("i"));
      linjeEl.appendChild(d);
    });
    $("nivaaTekst").textContent = NIVAA ? s8("nivaaTekst", { n: NIVAA.nivaa }) : s8("nivaaAlle");
  }

  function tegnTopp() {
    var sum = 0;
    V.NIVAER.forEach(function (n, i) {
      var ferdig = window.Fremgang.antallUtlaert(SPILL, n.min, n.maks);
      $("nivaaLinje").children[i].firstChild.style.transform = "scaleX(" + ferdig / (n.maks - n.min + 1) + ")";
      sum += ferdig;
    });
    var tekst = s8("ferdigTall", { n: sum, total: V.LISTE.length });
    $("nivaaLinje").setAttribute("aria-label", tekst + ", " + $("nivaaTekst").textContent);
  }

  // Hvor langt denne ene formen er kommet: det største av boksene og riktige på rad mot FERDIG_REKKE.
  function formAndel() {
    if (window.Fremgang.status(SPILL, nr).utlaert) return 1;
    var st = window.Fremgang.steg(SPILL, nr, nr);
    return Math.max(st.gjort / st.totalt, Math.min(1, window.Fremgang.streakFor(SPILL, nr) / FERDIG_REKKE));
  }

  function tegnKortlinje() {
    var el = $("formlinje");
    if (betydVerb) { el.style.visibility = "hidden"; return; }
    el.style.visibility = "";
    var a = formAndel();
    var fyll = $("formfyll");
    fyll.style.transform = "scaleX(" + a + ")";
    // Nivåfargen til du er nær målet (fra 2/3), så gull.
    fyll.style.background = a >= 1 ? "" : a >= 2 / 3 ? "var(--gull)" : "var(--nivaa)";
    el.setAttribute("aria-valuenow", String(Math.round(a * 100)));
    el.setAttribute("aria-label", s8("formLinje"));
  }

  var merkeTimer = null;
  function visPaRad(n) {
    var el = $("paRad");
    window.clearTimeout(merkeTimer);
    el.classList.remove("vis");
    void el.offsetWidth;
    el.textContent = s8("paRad", { n: n });
    el.classList.add("vis");
    merkeTimer = window.setTimeout(function () { el.classList.remove("vis"); }, 1800);
  }

  function nyttSporsmal() {
    besvart = false;
    var tekster;
    kortEl.className = "kort";
    oppgaveEl.lang = "fr";
    void kortEl.offsetWidth;
    kortEl.classList.add("inn");
    oppgaveEl.classList.remove("instruks");
    $("paRad").classList.remove("vis");
    if (ko.length) {
      betydVerb = ko.shift();
      oppgaveEl.textContent = betydVerb;
      oversattEl.textContent = s8("betydSporsmal");
      tekster = betydValg();
    } else {
      betydVerb = null;
      if (runde) { nr = runde.ids[runde.i]; runde.i++; }
      else nr = window.Fremgang.velgTall(SPILL, MIN, MAKS, forrige, null, null, FERDIG_ANDEL);
      forrige = nr;
      variant = Math.random() < 0.5 ? 0 : 1;
      var boks = window.Fremgang.status(SPILL, nr).boks;
      // I en målrettet runde skriver hun alltid: det er skrivingen som viser om regelen sitter.
      skriver = runde ? true : boks >= SKRIVE_BOKS;
      horOgSkriv = !runde && boks >= HOR_BOKS && Math.random() < 0.5;
      oppgaveEl.lang = "fr";
      oppgaveEl.textContent = horOgSkriv ? V.horOppgave(nr, variant) : V.oppgave(nr, variant);
      // Hør og skriv: ingen oversettelse, den ville røpet verbet.
      oversattEl.textContent = horOgSkriv ? s8("horSkriv") : V.oversatt(nr, SPRAK, variant);
      // Uten pronomenstøtte (bare «…») er oppgaven selv tittelen, og undertittelen faller bort.
      if (horOgSkriv && oppgaveEl.textContent === "…") {
        oppgaveEl.lang = SPRAK;
        oppgaveEl.classList.add("instruks"); // mindre skrift, så teksten står på én linje
        oppgaveEl.textContent = s8("horSkriv");
        oversattEl.textContent = "";
      }
      tekster = skriver ? [] : knappevalg();
    }
    if (betydVerb) { skriver = false; horOgSkriv = false; }
    forsokPaaSpm = 0;
    valgEl.lang = betydVerb ? SPRAK : "fr";
    valgEl.textContent = "";
    skjemaEl.hidden = !skriver;
    svarEl.value = "";
    svarEl.disabled = false;
    svarEl.classList.remove("galt", "rett");
    sjekkKnapp.disabled = false;
    tekster.forEach(function (tekst) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = tekst;
      b.addEventListener("click", function () { svar(b); });
      valgEl.appendChild(b);
    });
    tilbakemelding.textContent = "";
    tegnTopp();
    tegnKortlinje();
    nesteKnapp.hidden = true;
    horKnapp.hidden = !horOgSkriv;
    horKnapp.textContent = s8("horIgjen");
    if (horOgSkriv) horForm();
    if (skriver) svarEl.focus(); else valgEl.firstChild.focus();
  }

  function svarBetydning(knapp) {
    var fasit = V.betydning(betydVerb, SPRAK);
    var erRiktig = knapp.textContent === fasit;
    Array.prototype.forEach.call(valgEl.children, function (b) {
      b.disabled = true;
      if (b.textContent === fasit) b.classList.add("riktig");
    });
    if (erRiktig) {
      merkKjent(betydVerb);
      linje(s8("betydRiktig"), "skjult");
      window.Feiring.boksLyd(0.3);
    } else {
      ko.push(betydVerb);
      knapp.classList.add("feil");
      linje(s8("betydFeil", { verb: betydVerb, betyr: fasit }), "feil");
    }
    if (!ko.length && !visteBetydFerdig) {
      visteBetydFerdig = true;
      linje(s8("betydFerdig"), "regel");
    }
    nesteKnapp.hidden = false;
    nesteKnapp.focus();
  }

  // Mønsterhopp: viser hun at hun kan en regel (4 på rad, minst 2 verb), løftes resten av regelen i nivået til boks 3.
  var NOKKEL_REGEL = PAKKE ? "fransk.verbregel." + PAKKE : "fransk.verbregel";
  function regelHopp(riktigForsteGang) {
    var o = V.hent(nr);
    var hist = null;
    try { hist = JSON.parse(window.localStorage.getItem(NOKKEL_REGEL)); } catch (e) { hist = null; }
    // Egen logg per nivå (nivå 1 beholder det gamle navnet), ellers ville "endelse" bare hoppet én gang i hele spillet.
    var nokkel = o.nivaa === 1 ? o.regel : o.nivaa + ":" + o.regel;
    var r = V.regelHopp(hist, nokkel, o.verb, riktigForsteGang);
    try { window.localStorage.setItem(NOKKEL_REGEL, JSON.stringify(r.historikk)); } catch (e) { /* virker uten lagring */ }
    if (!r.hopp) return false;
    var flyttet = 0;
    V.idIRegel(o.nivaa, o.regel).forEach(function (id) { if (window.Fremgang.loftTil(SPILL, id, SKRIVE_BOKS)) flyttet++; });
    return flyttet > 0;
  }

  // Pronomen + form for verb på konsonant ("tu" "portes"), bare formen for vokal og stum h (se V.lydDeler).
  // I hør og skriv spilles pronomenet alltid med (V.horDeler), ellers hører hun ikke at hele formen skal skrives.
  function horForm() { if (nr) window.Stemme.siRekke(horOgSkriv ? V.horDeler(nr, variant) : V.lydDeler(nr, variant)); }
  horKnapp.addEventListener("click", horForm);

  // Felles avslutning for knappesvar og skrevet svar. riktigForsteGang styrer fremgangen.
  // melding = null ved vanlig riktig svar (ingen tekst, bare farge og lyd). Ellers vises den.
  function avslutt(riktigForsteGang, melding, klasse, visRegel) {
    besvart = true;
    forsok++;
    if (horOgSkriv) { oppgaveEl.classList.remove("instruks"); oppgaveEl.lang = "fr"; oppgaveEl.textContent = V.oppgave(nr, variant); oversattEl.textContent = V.oversatt(nr, SPRAK, variant); }
    var varFerdig = window.Fremgang.alleUtlaert(SPILL, MIN, MAKS);
    var formVarUtlaert = window.Fremgang.status(SPILL, nr).utlaert;
    var res = window.Fremgang.registrer(SPILL, nr, riktigForsteGang, 1, true);
    var fullfort = riktigForsteGang && !res.utlaert && res.streak >= FERDIG_REKKE;
    if (fullfort) {
      window.Fremgang.fullfor(SPILL, nr);
      res.til = window.Fremgang.MAKS_BOKS;
      res.utlaert = true;
    }
    var formFerdig = res.utlaert && !formVarUtlaert;
    // Svake områder: utenfor en runde telles første forsøk per regel. I en runde teller bare runden.
    if (runde) { if (riktigForsteGang) runde.riktige++; }
    else ventendeRegel = window.Svakhet.registrer(SPILL, V.hent(nr).regel, riktigForsteGang);
    var hoppet = regelHopp(riktigForsteGang);
    var erFerdig = window.Fremgang.alleUtlaert(SPILL, MIN, MAKS);
    tilbakemelding.textContent = "";
    kortEl.classList.remove("inn", "riktig-blink");
    void kortEl.offsetWidth;
    tegnKortlinje();
    if (riktigForsteGang) {
      if (res.streak >= 2 && !formVarUtlaert) visPaRad(res.streak);
      if (formFerdig) {
        kortEl.classList.add("ferdig");
        linje(s8("formFerdig", { form: V.fasit(nr, variant) }), "skjult");
        window.Feiring.konfettiFra(kortEl, true);
        window.Feiring.utlaertLyd();
      } else {
        kortEl.classList.add("riktig-blink");
        window.Feiring.boksLyd(formAndel());
        linje(s8("riktig"), "skjult");
      }
    } else if (klasse === "feil") {
      linje(melding, "feil");
    }
    if (klasse !== "feil" && melding) linje(melding, "regel");
    if (visRegel) linje(V.REGLER[V.hent(nr).regel][SPRAK], "regel");
    if (hoppet) linje(s8("hopp"), "regel");
    horKnapp.textContent = s8("hor");
    nesteKnapp.hidden = false;
    horKnapp.hidden = false;
    nesteKnapp.focus();
    if (erFerdig && !varFerdig) {
      var ferdigNivaa = NIVAA;
      var neste = V.NIVAER[ferdigNivaa.nivaa] || null; // NIVAER[n] er nivået etter nivå n
      nivaaKlart = true;
      window.setTimeout(function () {
        window.Feiring.vis({
          tittel: s8("feiringTittel", { n: ferdigNivaa.nivaa }),
          tekst: neste ? s8("feiringTekst", { hva: neste[SPRAK] }) : s8("feiringSist"),
          videre: neste ? null : { tekst: s8("videreHost"), href: VIDERE_HREF }, etterpaa: nesteKnapp,
          // Hovedknappen åpner neste nivå med en gang (ønsket av Kjersti 2026-11-10), ikke «fortsett å terpe».
          knapp: neste ? s8("tilNeste") : null,
          vedLukk: function () { if (neste && nivaaKlart) nesteKnapp.click(); }
        });
      }, 900);
    }
  }

  function svar(knapp) {
    if (besvart) return;
    if (betydVerb) { besvart = true; svarBetydning(knapp); return; }
    var fasit = V.fasit(nr, variant);
    var erRiktig = knapp.textContent === fasit;
    Array.prototype.forEach.call(valgEl.children, function (b) {
      b.disabled = true;
      if (b.textContent === fasit) b.classList.add("riktig");
    });
    if (!erRiktig) knapp.classList.add("feil");
    avslutt(erRiktig, erRiktig ? null : s8("fasit", { fasit: fasit }), erRiktig ? "riktig" : "feil", !erRiktig);
  }

  // Skrevet svar: første feil gir ett nytt forsøk, andre feil viser fasiten.
  skjemaEl.addEventListener("submit", function (e) {
    e.preventDefault();
    if (besvart || !skriver) return;
    if (svarEl.value.trim() === "") { tilbakemelding.textContent = ""; linje(s8("tomt"), "feil"); return; }
    forsokPaaSpm++;
    var v = V.vurder(svarEl.value, nr, variant);
    var fasit = V.fasit(nr, variant);
    svarEl.classList.toggle("galt", v.status !== "riktig");
    svarEl.classList.toggle("rett", v.status === "riktig");
    if (v.status === "riktig") {
      svarEl.disabled = true;
      sjekkKnapp.disabled = true;
      var melding = v.aksentfeil ? s8("riktigAksent", { fasit: fasit }) : forsokPaaSpm > 1 ? s8("riktigAndre") : null;
      avslutt(forsokPaaSpm === 1, melding, "riktig", false);
      return;
    }
    if (forsokPaaSpm >= 2) {
      svarEl.disabled = true;
      sjekkKnapp.disabled = true;
      avslutt(false, s8("fasit", { fasit: fasit }), "feil", true);
      return;
    }
    tilbakemelding.textContent = "";
    linje(v.status === "elisjon" ? s8("elisjonFeil") : s8("proev"), "feil");
    linje(V.REGLER[V.hent(nr).regel][SPRAK], "regel");
    svarEl.focus();
    svarEl.select();
  });

  // Pil opp/ned flytter mellom svarknappene (rundt i ring), Enter velger den som har fokus (vanlig knappeoppførsel).
  valgEl.addEventListener("keydown", function (e) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    var knapper = Array.prototype.slice.call(valgEl.children);
    var i = knapper.indexOf(document.activeElement);
    if (i < 0) return;
    e.preventDefault();
    var steg = e.key === "ArrowDown" ? 1 : -1;
    knapper[(i + steg + knapper.length) % knapper.length].focus();
  });

  // Svake områder (som i spill 3, src/svakhet.js): 4 feil av de 10 siste på en regel gir forklaring og en runde.
  var runde = null; // { regel, ids, i, lengde, krav, riktige }
  var ventendeRegel = null; // regelen som trenger en forklaring etter dette svaret
  var svakEl = $("svak");

  function regelNavn(regel) { return s8("regelnavn_" + regel); }

  // Forklaringsskjermen: regelen og noen eksempler, så en knapp som starter runden eller går tilbake til spillet.
  function visSvak(tittel, intro, regel, medEksempler, knappTekst, ved) {
    $("spill").hidden = true;
    svakEl.hidden = false;
    $("svakTittel").textContent = tittel;
    $("svakIntro").textContent = intro;
    $("svakRegel").textContent = regel ? V.REGLER[regel][SPRAK] : "";
    var eks = $("svakEksempler");
    eks.textContent = "";
    if (medEksempler) {
      var rubrikk = document.createElement("p");
      rubrikk.className = "liten";
      rubrikk.textContent = t3("svak.eksempler");
      eks.appendChild(rubrikk);
      idsForRegel(regel).slice(0, 3).forEach(function (id) {
        var p = document.createElement("p");
        var fr = document.createElement("span");
        fr.setAttribute("lang", "fr");
        fr.textContent = V.fasit(id, 0);
        p.appendChild(fr);
        p.appendChild(document.createTextNode(" - " + V.oversatt(id, SPRAK, 0)));
        eks.appendChild(p);
      });
    }
    var kn = $("svakKnapp");
    kn.textContent = knappTekst;
    kn.onclick = function () { svakEl.hidden = true; $("spill").hidden = false; ved(); };
    kn.focus();
  }

  // Formene i regelen som hun har åpnet (nivåene til og med det hun er på).
  function idsForRegel(regel) {
    var maksNivaa = NIVAA ? NIVAA.nivaa : V.NIVAER.length;
    return V.LISTE.filter(function (o) { return o.regel === regel && o.nivaa <= maksNivaa; }).map(function (o) { return o.id; });
  }

  function startRunde(regel) {
    var ids = stokk(idsForRegel(regel));
    // Få former (f.eks. nous mangeons) gjentas, så runden ikke blir for kort til å si noe.
    var lengde = window.Svakhet.rundeLengde(ids.length * 2);
    var valgt = [];
    while (valgt.length < lengde) valgt = valgt.concat(stokk(ids.slice()));
    runde = { regel: regel, ids: valgt.slice(0, lengde), i: 0, lengde: lengde, krav: window.Svakhet.krav(lengde), riktige: 0 };
    nyttSporsmal();
  }

  function visForklaring(regel) {
    var antall = window.Svakhet.antallFeil(window.Svakhet.les(SPILL), regel);
    visSvak(t3("svak.tittel", { regel: regelNavn(regel) }), t3("svak.intro", { antall: antall, av: window.Svakhet.VINDU }), regel, true, t3("svak.start"), function () { startRunde(regel); });
  }

  function avsluttRunde() {
    var r = runde;
    runde = null;
    if (r.riktige >= r.krav) {
      window.Svakhet.nullstillRegel(SPILL, r.regel);
      ventendeRegel = null;
      visSvak(t3("svak.bestatt.tittel", { riktige: r.riktige, lengde: r.lengde }), t3("svak.bestatt.tekst", { regel: regelNavn(r.regel) }), null, false, t3("svak.bestatt.knapp"), nyttSporsmal);
    } else {
      visSvak(t3("svak.ikke.tittel", { riktige: r.riktige, lengde: r.lengde }), t3("svak.ikke.tekst", { krav: r.krav }), r.regel, true, t3("svak.ikke.knapp"), function () { startRunde(r.regel); });
    }
  }

  function videre() {
    if (runde) {
      if (runde.i >= runde.lengde) avsluttRunde(); else nyttSporsmal();
    } else if (ventendeRegel) {
      var regel = ventendeRegel;
      ventendeRegel = null;
      visForklaring(regel);
    } else {
      nyttSporsmal();
    }
  }

  nesteKnapp.addEventListener("click", function () {
    if (nivaaKlart) { nivaaKlart = false; runde = null; ventendeRegel = null; startNivaa(finnNivaa()); nyttSporsmal(); return; }
    videre();
  });

  $("startknapp").addEventListener("click", function () {
    startNivaa(testNivaa() || finnNivaa());
    $("start").hidden = true;
    $("spill").hidden = false;
    nyttSporsmal();
  });

  $("nullstill").addEventListener("click", function () {
    if (!window.confirm(s8("bekreft"))) return;
    window.Fremgang.nullstill(SPILL);
    window.Svakhet.nullstill(SPILL);
    try { window.localStorage.removeItem(NOKKEL_REGEL); } catch (e) { /* ingenting å fjerne */ }
    // Hva verbene betyr deles med spill 8, så pakken nullstiller ikke det.
    if (!PAKKE) { try { window.localStorage.removeItem(NOKKEL_KJENT); } catch (e) { /* ingenting å fjerne */ } }
    window.location.reload();
  });
})();
