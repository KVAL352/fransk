// Spill 4: se oversettelsen, skriv setningen på fransk. Tema velges øverst.
// Fremgang lagres per setning i Leitner-bokser (src/fremgang.js), med plassen i Setninger.ALLE som nøkkel.
// Boksen styrer trinnet (src/trinn.js): fra ett ord i boks 1 til hele setningen uten hint i boks 5.
// Første feil: hun prøver en gang til. Andre feil: riktig setning vises.
// Rett etter første forsøk teller i fremgangen. Manglende aksent godtas med en merknad (PLAN-setninger.md, avsnitt 6).
// Ingen svake områder ennå: setningene utenfor spill 3 har ingen regel (se OVERLEVERING.md).

(function () {
  var SPILL = "spill4";
  var NOKKEL_PROFIL = "fransk.profil";
  var NOKKEL_TEMA = "fransk.tema." + SPILL;

  window.Tekster.init();
  var Sx = window.Setninger;
  var S = Sx.ALLE;
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

  document.title = t3("s4.tittel");
  $("h1").textContent = t3("s4.tittel");

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

  // Tema: "alle" eller id fra Setninger.TEMAER som har setninger i settet.
  var temaer = [{ id: "alle", navn: t3("tema.alle"), omrade: { min: 1, maks: S.antallNokler(!!profil) } }];
  Sx.TEMAER.forEach(function (tm) {
    var omr = S.temaOmrade(tm.id);
    if (omr) temaer.push({ id: tm.id, navn: tm[sprak], omrade: omr });
  });
  var valgtTema = temaer[0];
  temaer.forEach(function (tm) { if (tm.id === lagret(NOKKEL_TEMA)) valgtTema = tm; });
  var MIN = valgtTema.omrade.min;
  var MAKS = valgtTema.omrade.maks;

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

  $("intro").textContent = t3("s4.intro");
  $("hor").textContent = t3("hor");
  $("byttForm").textContent = t3("kjonn.bytt");
  $("lenke3").textContent = t3("s4.lenke3");
  $("menyLenke").textContent = t3("lenkeMeny");

  var startDiv = $("start");
  var spillDiv = $("spill");
  var oversettelseEl = $("oversettelse");
  var setningEl = $("setning");
  var hintEl = $("hint");
  var infoEl = $("info");
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

  var nokkel = null;   // plassen i ALLE (profilsetningene bakerst)
  var setning = null;
  var oppgave = null;  // { trinn, fasit, deler, hint } fra Trinn.lag
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
  var forsokPaaSpm = 0;
  var besvart = false;
  var riktige = 0;
  var forsok = 0;

  // Engelsk «you» kan være tu eller vous. Norsk skiller (du/dere), så der trengs ingen hjelp.
  function oversettelseMedHint(s) {
    var tekst = Sx.oversettelse(s, sprak, profil);
    if (sprak !== "en") return tekst;
    if (s.tu) return tekst + " " + t3("s4.hintTu");
    if (/\bvous\b/i.test(s.fr)) return tekst + " " + t3("s4.hintVous");
    return tekst;
  }

  function nyttSporsmal() {
    nokkel = window.Fremgang.velgTall(SPILL, MIN, MAKS, nokkel, null, null);
    setning = S.fraNokkel(nokkel);
    forsokPaaSpm = 0;
    besvart = false;
    oversettelseEl.textContent = oversettelseMedHint(setning);
    oppgave = window.Trinn.lag(Sx.merket(setning, kjonn, profil), window.Fremgang.status(SPILL, nokkel).boks);
    infoEl.textContent = t3("s4.trinn", { n: oppgave.trinn, tekst: t3("s4.trinn." + oppgave.trinn) });
    hintEl.textContent = oppgave.hint || "";
    hintEl.hidden = !oppgave.hint;
    setningEl.textContent = "";
    felter = [];
    var nr = 0;
    oppgave.deler.forEach(function (del) {
      if (del.gitt !== undefined) {
        setningEl.appendChild(document.createTextNode(del.gitt));
        return;
      }
      var inn = document.createElement("input");
      inn.className = "hull" + (oppgave.deler.length === 1 ? " helt" : "");
      inn.setAttribute("lang", "fr");
      inn.setAttribute("dir", "ltr");
      inn.setAttribute("autocapitalize", "off");
      inn.setAttribute("autocomplete", "off");
      inn.setAttribute("spellcheck", "false");
      inn.setAttribute("aria-label", t3("s4.hull", { n: ++nr }));
      if (oppgave.deler.length > 1) inn.style.width = Math.max(del.hull.length + 3, 6) + "ch";
      inn.dataset.svar = del.hull;
      setningEl.appendChild(inn);
      felter.push(inn);
    });
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
    var fasitTekst = Sx.tekst(setning, kjonn, profil);
    var varFerdig = window.Fremgang.alleUtlaert(SPILL, MIN, MAKS);
    var res = window.Fremgang.registrer(SPILL, nokkel, riktigForsteGang, 1, true);
    visStreak(res);
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
    felter.forEach(function (f) {
      var r = window.Sjekk.sjekk(f.value, f.dataset.svar, { aksent: "merknad" });
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

  // Profil: yrke og alder, lagret i nettleseren sammen med kjønnsvalget (samme som spill 3). Eksport gir en fil hun kan ta vare på.
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
  nesteKnapp.addEventListener("click", nyttSporsmal);
  horKnapp.addEventListener("click", function () { window.Stemme.si(Sx.tekst(setning, kjonn, profil)); });

  $("nullstill").addEventListener("click", function () {
    if (!window.confirm(t("bekreft.nullstill"))) return;
    window.Fremgang.nullstill(SPILL);
    window.location.reload();
  });
  $("byttForm").addEventListener("click", function () {
    lagreKjonn(kjonn === "f" ? "m" : "f");
    window.location.reload();
  });
})();
