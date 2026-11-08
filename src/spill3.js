// Spill 3: fyll inn verbet (être eller avoir) i setningen. Tema velges øverst.
// Fremgang lagres per setning i Leitner-bokser (src/fremgang.js), med plassen i Setninger.POOL som nøkkel.
// Hver økt starter med en kort runde per verb (PER_VERB spørsmål), så blandes de.
// Første feil: hullet markeres og hun prøver en gang til. Andre feil: riktig setning vises.
// Rett etter første forsøk teller i fremgangen; riktig setning og regel vises alltid til slutt.

(function () {
  var SPILL = "spill3";
  var PER_VERB = 5;
  var NOKKEL_PROFIL = "fransk.profil";
  var NOKKEL_TEMA = "fransk.tema." + SPILL;
  var VERBNAVN = { etre: "être", avoir: "avoir" };

  window.Tekster.init();
  var S = window.Setninger;
  var t3 = window.Tekster3.t;
  var t = window.Tekster.t;

  function $(id) { return document.getElementById(id); }
  function lagret(nokkel) { try { return window.localStorage.getItem(nokkel); } catch (e) { return null; } }
  function lagre(nokkel, verdi) { try { window.localStorage.setItem(nokkel, verdi); } catch (e) { /* uten lagring virker spillet, men husker ikke */ } }

  function hentKjonn() {
    try {
      var p = JSON.parse(lagret(NOKKEL_PROFIL));
      return p && (p.kjonn === "f" || p.kjonn === "m") ? p.kjonn : null;
    } catch (e) {
      return null;
    }
  }

  function lagreKjonn(k) {
    var p = {};
    try { p = JSON.parse(lagret(NOKKEL_PROFIL)) || {}; } catch (e) { p = {}; }
    p.kjonn = k;
    lagre(NOKKEL_PROFIL, JSON.stringify(p));
  }

  // Yrke og alder fra profilen, eller null hvis ikke begge er fylt ut. Setning 35 og 36 tas bare med når den finnes.
  function hentProfilData() {
    try {
      var p = JSON.parse(lagret(NOKKEL_PROFIL));
      var alder = p && parseInt(p.alder, 10);
      var yrke = p && typeof p.yrke === "string" ? p.yrke.trim() : "";
      return yrke && alder >= 1 && alder <= 120 ? { yrke: yrke, alder: String(alder) } : null;
    } catch (e) {
      return null;
    }
  }

  document.title = t3("tittel");
  $("h1").textContent = t3("tittel");

  var kjonn = hentKjonn();
  if (!kjonn) {
    $("kjonnTittel").textContent = t3("kjonn.tittel");
    $("kjonnTekst").textContent = t3("kjonn.tekst");
    $("kjonnF").textContent = t3("kjonn.f");
    $("kjonnM").textContent = t3("kjonn.m");
    $("kjonn").hidden = false;
    [["kjonnF", "f"], ["kjonnM", "m"]].forEach(function (par) {
      $(par[0]).addEventListener("click", function () {
        lagreKjonn(par[1]);
        window.location.reload();
      });
    });
    return;
  }
  $("hoved").hidden = false;

  var sprak = window.Tekster.kode() === "nb" ? "nb" : "en";
  var profil = hentProfilData();

  // Tema: "alle" eller id fra Setninger.TEMAER som har setninger i POOL.
  var temaer = [{ id: "alle", navn: t3("tema.alle"), omrade: { min: 1, maks: S.antallNokler(!!profil) } }];
  S.TEMAER.forEach(function (tm) {
    var omr = S.temaOmrade(tm.id);
    if (omr) temaer.push({ id: tm.id, navn: tm[sprak], omrade: omr });
  });
  var valgtTema = temaer[0];
  temaer.forEach(function (tm) { if (tm.id === lagret(NOKKEL_TEMA)) valgtTema = tm; });
  var MIN = valgtTema.omrade.min;
  var MAKS = valgtTema.omrade.maks;
  var verber = S.verbIOmrade(MIN, MAKS);

  var temaEl = $("tema");
  var etikett = document.createElement("span");
  etikett.className = "liten";
  etikett.textContent = t3("tema.etikett") + " ";
  temaEl.appendChild(etikett);
  temaer.forEach(function (tm) {
    var kn = document.createElement("button");
    kn.type = "button";
    kn.textContent = tm.navn;
    kn.setAttribute("aria-pressed", tm === valgtTema ? "true" : "false");
    if (tm === valgtTema) kn.style.cssText = "background:#f5c400;border:2px solid #111;font-weight:700";
    kn.addEventListener("click", function () {
      if (tm === valgtTema) return;
      lagre(NOKKEL_TEMA, tm.id);
      window.location.reload();
    });
    temaEl.appendChild(kn);
  });

  $("intro").textContent = t3("intro");
  $("hor").textContent = t3("hor");
  $("byttForm").textContent = t3("kjonn.bytt");
  $("lenke4").textContent = t3("s3.lenke4");
  $("menyLenke").textContent = t3("lenkeMeny");

  var startDiv = $("start");
  var spillDiv = $("spill");
  var infoEl = $("info");
  var setningEl = $("setning");
  var oversettelseEl = $("oversettelse");
  var skjema = $("skjema");
  var sjekkKnapp = $("sjekk");
  var tilbakemelding = $("tilbakemelding");
  var regelEl = $("regel");
  var horKnapp = $("hor");
  var nesteKnapp = $("neste");
  var tellingEl = $("telling");
  var streakEl = $("streak");
  var visning = window.Fremgangsvisning.lag({ spill: SPILL, min: MIN, maks: MAKS, beholder: $("fremgang") });

  window.Stemme.init($("stemmeinfo"));

  var nr = 0;          // spørsmålets plass i økta
  var nokkel = null;   // plassen i POOL
  var sporsmal = null; // { setning, luke }
  var forsokPaaSpm = 0;
  var besvart = false;
  var riktige = 0;
  var forsok = 0;
  var felter = [];

  // Knapp som setter inn œ i feltet som sist hadde fokus (sœur, cœur), for tastatur uten œ.
  var oeKnapp = document.getElementById("oe");
  var sistFelt = null;
  document.getElementById("setning").addEventListener("focusin", function (e) { if (e.target.tagName === "INPUT") sistFelt = e.target; });
  oeKnapp.addEventListener("mousedown", function (e) { e.preventDefault(); });
  oeKnapp.addEventListener("click", function () {
    var f = sistFelt && sistFelt.isConnected && !sistFelt.disabled ? sistFelt : felter[0];
    if (!f || f.disabled) return;
    var a = f.selectionStart, b = f.selectionEnd;
    f.value = f.value.slice(0, a) + "œ" + f.value.slice(b);
    f.setSelectionRange(a + 1, a + 1);
    f.focus();
  });
  var runde = null;    // målrettet runde på en svak regel: { regel, keys, i, lengde, krav, riktige }
  var ventendeRegel = null; // regel som har nådd terskelen og får forklaring etter dette spørsmålet

  function shuffle(liste) {
    var a = liste.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var x = a[i]; a[i] = a[j]; a[j] = x;
    }
    return a;
  }

  function nokklerForRegel(regel) {
    var k = [];
    for (var i = 1; i <= S.antallNokler(!!profil); i++) if (S.fraNokkel(i).regel === regel) k.push(i);
    return k;
  }

  // Forklaringsskjermen: regelen og noen eksempler, så en knapp som starter runden (eller går tilbake til spillet).
  function visSvak(tittel, intro, regel, medEksempler, knappTekst, ved) {
    spillDiv.hidden = true;
    $("svak").hidden = false;
    $("svakTittel").textContent = tittel;
    $("svakIntro").textContent = intro;
    $("svakRegel").textContent = regel ? t3("regel." + regel) : "";
    var eks = $("svakEksempler");
    eks.textContent = "";
    if (medEksempler) {
      var rubrikk = document.createElement("p");
      rubrikk.className = "liten";
      rubrikk.textContent = t3("svak.eksempler");
      eks.appendChild(rubrikk);
      nokklerForRegel(regel).slice(0, 3).forEach(function (k) {
        var s = S.fraNokkel(k);
        var p = document.createElement("p");
        var fr = document.createElement("span");
        fr.className = "fr";
        fr.setAttribute("lang", "fr");
        fr.textContent = S.tekst(s, kjonn, profil);
        p.appendChild(fr);
        p.appendChild(document.createTextNode(" — " + S.oversettelse(s, sprak, profil)));
        eks.appendChild(p);
      });
    }
    var kn = $("svakKnapp");
    kn.textContent = knappTekst;
    kn.onclick = function () {
      $("svak").hidden = true;
      spillDiv.hidden = false;
      ved();
    };
    kn.focus();
  }

  function startRunde(regel) {
    var keys = shuffle(nokklerForRegel(regel));
    var lengde = window.Svakhet.rundeLengde(keys.length);
    runde = { regel: regel, keys: keys.slice(0, lengde), i: 0, lengde: lengde, krav: window.Svakhet.krav(lengde), riktige: 0 };
    nyttSporsmal();
  }

  function visForklaring(regel) {
    var navn = t3("regelnavn." + regel);
    var antall = window.Svakhet.antallFeil(window.Svakhet.les(SPILL), regel);
    visSvak(t3("svak.tittel", { regel: navn }), t3("svak.intro", { antall: antall, av: window.Svakhet.VINDU }), regel, true, t3("svak.start"), function () { startRunde(regel); });
  }

  function avsluttRunde() {
    var r = runde;
    var navn = t3("regelnavn." + r.regel);
    runde = null;
    if (r.riktige >= r.krav) {
      window.Svakhet.nullstillRegel(SPILL, r.regel);
      ventendeRegel = null;
      visSvak(t3("svak.bestatt.tittel", { riktige: r.riktige, lengde: r.lengde }), t3("svak.bestatt.tekst", { regel: navn }), null, false, t3("svak.bestatt.knapp"), nyttSporsmal);
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

  // Trekker en plass i POOL. Med verb: trekk om igjen til verbet stemmer (vektene i Fremgang styrer fortsatt).
  function velg(verb) {
    var k;
    for (var i = 0; i < 300; i++) {
      k = window.Fremgang.velgTall(SPILL, MIN, MAKS, nokkel, null, null);
      if (!verb || S.fraNokkel(k).verb === verb) return k;
    }
    return k;
  }

  function visInfo(verb) {
    if (verb) {
      infoEl.textContent = t3("runde", { verb: VERBNAVN[verb] });
    } else if (verber.length === 2 && nr === PER_VERB * 2) {
      infoEl.textContent = t3("blanding");
    } else if (nr > PER_VERB * 2 + 1 || verber.length < 2) {
      infoEl.textContent = "";
    }
  }

  function nyttSporsmal() {
    var verb = null;
    if (runde) {
      nokkel = runde.keys[runde.i++];
      infoEl.textContent = t3("svak.runde", { regel: t3("regelnavn." + runde.regel), n: runde.i, lengde: runde.lengde });
    } else {
      verb = S.verbForSporsmal(nr, PER_VERB, verber);
      nokkel = velg(verb);
      visInfo(verb);
      nr++;
    }
    var setning = S.fraNokkel(nokkel);
    sporsmal = { setning: setning, luke: S.luke(setning, kjonn, profil) };
    forsokPaaSpm = 0;
    besvart = false;

    setningEl.textContent = "";
    felter = [];
    var deler = sporsmal.luke.tekst.split("___");
    deler.forEach(function (del, i) {
      setningEl.appendChild(document.createTextNode(del));
      if (i < deler.length - 1) {
        var inn = document.createElement("input");
        inn.className = "hull";
        inn.setAttribute("lang", "fr");
        inn.setAttribute("dir", "ltr");
        inn.setAttribute("autocapitalize", "off");
        inn.setAttribute("autocomplete", "off");
        inn.setAttribute("spellcheck", "false");
        inn.setAttribute("aria-label", t3("hull", { n: i + 1 }));
        inn.style.width = Math.max(sporsmal.luke.svar[i].length + 3, 6) + "ch";
        setningEl.appendChild(inn);
        felter.push(inn);
      }
    });
    oversettelseEl.textContent = S.oversettelse(setning, sprak, profil);
    tilbakemelding.textContent = "";
    tilbakemelding.className = "";
    regelEl.textContent = "";
    horKnapp.hidden = true;
    nesteKnapp.hidden = true;
    sjekkKnapp.disabled = false;
    felter[0].focus();
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
    var setning = sporsmal.setning;
    var fasitTekst = S.tekst(setning, kjonn, profil);
    var varFerdig = window.Fremgang.alleUtlaert(SPILL, MIN, MAKS);
    var res = window.Fremgang.registrer(SPILL, nokkel, riktigForsteGang, 1, true);
    visStreak(res);
    if (runde) {
      if (riktigForsteGang) runde.riktige++;
    } else {
      ventendeRegel = window.Svakhet.registrer(SPILL, setning.regel, riktigForsteGang);
    }
    var erFerdig = window.Fremgang.alleUtlaert(SPILL, MIN, MAKS);
    if (riktigForsteGang) {
      riktige++;
      tilbakemelding.className = "riktig";
      tilbakemelding.textContent = aksentMerknad ? t3("riktigAksent", { fasit: fasitTekst }) : t3("riktig");
    } else if (rettAndreGang) {
      tilbakemelding.className = "riktig";
      tilbakemelding.textContent = t3("riktigAndre");
    } else {
      tilbakemelding.className = "feil";
      tilbakemelding.textContent = t3("fasit", { setning: fasitTekst });
    }
    regelEl.textContent = setning.regel ? t3("regel." + setning.regel) : "";
    felter.forEach(function (f) { f.disabled = true; });
    sjekkKnapp.disabled = true;
    horKnapp.hidden = false;
    nesteKnapp.hidden = false;
    nesteKnapp.focus();
    oppdaterTelling();
    // Belønningslyden først, så setningen, så de ikke snakker i munnen på hverandre.
    var spilteLyd = visning.etterSvar(nokkel, res, erFerdig && !varFerdig);
    window.setTimeout(function () { window.Stemme.si(fasitTekst); }, spilteLyd ? 450 : 0);
    if (erFerdig && !varFerdig) {
      window.setTimeout(function () {
        window.Feiring.vis({
          tittel: t3("feiring.tittel", { tema: valgtTema.navn }),
          tekst: t3("feiring.tekst"),
          videre: null,
          etterpaa: nesteKnapp
        });
      }, 900);
    }
  }

  skjema.addEventListener("submit", function (e) {
    e.preventDefault();
    if (besvart) return;
    if (felter.some(function (f) { return f.value.trim() === ""; })) return;
    forsokPaaSpm++;
    var alleRiktige = true;
    var aksentfeil = false;
    felter.forEach(function (f, i) {
      var r = window.Sjekk.sjekk(f.value, sporsmal.luke.svar[i], { aksent: "merknad" });
      f.classList.toggle("galt", !r.riktig);
      if (!r.riktig) alleRiktige = false;
      if (r.riktig && r.aksentfeil) aksentfeil = true;
    });
    if (alleRiktige) {
      avslutt(forsokPaaSpm === 1, aksentfeil, forsokPaaSpm > 1);
    } else if (forsokPaaSpm === 1) {
      tilbakemelding.className = "feil";
      tilbakemelding.textContent = t3("proveIgjen");
      var forste = felter.filter(function (f) { return f.classList.contains("galt"); })[0];
      if (forste) forste.focus();
    } else {
      avslutt(false, false);
    }
  });

  // Profil: yrke og alder, lagret i nettleseren sammen med kjønnsvalget. Eksport gir en fil hun kan ta vare på.
  var profilDiv = $("profil");
  $("profilKnapp").textContent = t3("profil.knapp");
  $("profilTittel").textContent = t3("profil.tittel");
  $("profilTekst").textContent = t3("profil.tekst");
  $("yrkeEtikett").textContent = t3("profil.yrke");
  $("alderEtikett").textContent = t3("profil.alder");
  $("profilLagre").textContent = t3("profil.lagre");
  $("profilEksport").textContent = t3("profil.eksport");
  $("profilHint").textContent = profil ? "" : t3("profil.hint");
  if (profil) { $("yrke").value = profil.yrke; $("alder").value = profil.alder; }
  $("profilKnapp").addEventListener("click", function () { profilDiv.hidden = !profilDiv.hidden; });
  $("profilSkjema").addEventListener("submit", function (e) {
    e.preventDefault();
    var yrke = $("yrke").value.replace(/[{}\[\]]/g, "").trim().slice(0, 40);
    var alder = parseInt($("alder").value, 10);
    if (!yrke || !(alder >= 1 && alder <= 120)) { $("profilMelding").textContent = t3("profil.feil"); return; }
    var p = {};
    try { p = JSON.parse(lagret(NOKKEL_PROFIL)) || {}; } catch (er) { p = {}; }
    p.yrke = yrke;
    p.alder = alder;
    lagre(NOKKEL_PROFIL, JSON.stringify(p));
    window.location.reload();
  });
  $("profilEksport").addEventListener("click", function () {
    var blob = new Blob([lagret(NOKKEL_PROFIL) || "{}"], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "fransk-profil.json";
    a.click();
    URL.revokeObjectURL(a.href);
  });

  $("startknapp").addEventListener("click", function () {
    startDiv.hidden = true;
    spillDiv.hidden = false;
    nyttSporsmal();
  });
  nesteKnapp.addEventListener("click", videre);
  horKnapp.addEventListener("click", function () { window.Stemme.si(S.tekst(sporsmal.setning, kjonn, profil)); });

  $("nullstill").addEventListener("click", function () {
    if (!window.confirm(t("bekreft.nullstill"))) return;
    window.Fremgang.nullstill(SPILL);
    window.Svakhet.nullstill(SPILL);
    window.location.reload();
  });
  $("byttForm").addEventListener("click", function () {
    lagreKjonn(kjonn === "f" ? "m" : "f");
    window.location.reload();
  });
})();
