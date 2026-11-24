// Fremgang på menyen: «12 av 66 ferdig» under hvert valg, og en totallinje øverst.
// Ferdig = utlært (Fremgang.antallUtlaert), samme regel som i spillene. Ingenting lagres her, alt leses fra
// fremgangen spillene allerede har lagret. Brukes av index.html.
//
// Hvert valg i menyen har data-oversikt="<id>". Hva id-en teller står i DELER under: en liste med
// { spill, min, maks }, der spill er lagringsnøkkelen. Valg som mangler en modul hoppes over, så menyen virker uansett.
// Spill 4 (setninger, trinn) har egen lagring og telles ikke her: menyen peker på spill 3.

(function () {
  var F = window.Fremgang;

  var TEKST = {
    nb: { totalt: "Ferdig til nå", av: "{n} av {m} ferdig", alle: "Alt ferdig", ingen: "Ikke startet", ferdigTotal: "{n} av {m} ferdig ({p} %)" },
    en: { totalt: "Done so far", av: "{n} of {m} done", alle: "All done", ingen: "Not started", ferdigTotal: "{n} of {m} done ({p} %)" }
  };
  var SPRAK = window.Tekster && window.Tekster.kode && window.Tekster.kode() === "nb" ? "nb" : "en";
  function s(k, v) {
    var tekst = TEKST[SPRAK][k];
    Object.keys(v || {}).forEach(function (n) { tekst = tekst.split("{" + n + "}").join(v[n]); });
    return tekst;
  }

  function lagret(nokkel) { try { return window.localStorage.getItem(nokkel); } catch (e) { return null; } }

  // Samme regel som spill 3: profilsetningene (35 og 36) teller bare når yrke og alder er fylt ut.
  function harProfil() {
    try {
      var p = JSON.parse(lagret("fransk.profil"));
      var alder = p && parseInt(p.alder, 10);
      var yrke = p && typeof p.yrke === "string" ? p.yrke.trim() : "";
      return !!(yrke && alder >= 1 && alder <= 120);
    } catch (e) { return false; }
  }

  // Nøkler og moduler per situasjon. Live finnes ikke src/situasjoner.js, så tabellen står her også.
  var SIT = {
    metro: { ord: "metroord", setn: "spill11", ordMod: "MetroOrd", setnMod: "Metro" },
    is: { ord: "isord", setn: "spill12", ordMod: "IsOrd", setnMod: "Is" },
    folk: { ord: "folkord", setn: "spill13", ordMod: "FolkOrd", setnMod: "Folk" },
    butikk: { ord: "butikkord", setn: "spill14", ordMod: "ButikkOrd", setnMod: "Butikk" }
  };

  function situasjon(navn) {
    var x = SIT[navn];
    return [
      { spill: navn + "verb", min: 1, maks: window.Verb.pakke(navn).LISTE.length },
      { spill: x.ord, min: 1, maks: window[x.ordMod].ANTALL },
      { spill: x.setn, min: 1, maks: 3 * window[x.setnMod].ANTALL }
    ];
  }

  var DELER = {
    tall: function () { return [{ spill: "spill1", min: 1, maks: 99 }, { spill: "spill2", min: 1, maks: 99 }]; },
    setninger: function () { return [{ spill: "spill3", min: 1, maks: window.Setninger.antallNokler(harProfil()) }]; },
    artikler: function () { return [{ spill: "spill5", min: 1, maks: window.Ord.ANTALL }, { spill: "spill6", min: 1, maks: window.Ord.ANTALL }]; },
    verb: function () { return [{ spill: "spill8", min: 1, maks: window.Verb.LISTE.length }]; },
    nektelse: function () { return [{ spill: "nektelse", min: 1, maks: window.Nektelse.ANTALL }]; },
    // Samme regel som stien på hostpakke.html (src/hostpakke.js): har hun lært alle ordene i spill 9 eller alle
    // verbene i spill 8, regnes verbtrinnet som ferdig, selv om de 48 pakkeformene ikke er øvd hver for seg.
    host: function () {
      var HP = window.HostPakke;
      return [
        { spill: "hostverb", min: 1, maks: window.Verb.pakke("host").LISTE.length, ferdig: HP.verbFerdig() },
        { spill: "spill9", min: 1, maks: window.Host.ANTALL, ferdig: HP.ordFerdig() },
        { spill: "spill10", min: 1, maks: 2 * window.SetningerHost.ANTALL, ferdig: HP.setnFerdig() }
      ];
    },
    metro: function () { return situasjon("metro"); },
    is: function () { return situasjon("is"); },
    folk: function () { return situasjon("folk"); },
    butikk: function () { return situasjon("butikk"); }
  };

  // { ferdig, totalt } for ett valg, eller null hvis noe mangler.
  function tell(id) {
    try {
      var deler = DELER[id]();
      var ferdig = 0, totalt = 0;
      deler.forEach(function (d) {
        ferdig += d.ferdig ? d.maks - d.min + 1 : F.antallUtlaert(d.spill, d.min, d.maks);
        totalt += d.maks - d.min + 1;
      });
      return totalt > 0 ? { ferdig: ferdig, totalt: totalt } : null;
    } catch (e) { return null; }
  }

  function linje(ferdig, totalt, tekst) {
    var p = Math.floor(100 * ferdig / totalt);
    var rot = document.createElement("div");
    rot.className = "ov";
    var bar = document.createElement("div");
    bar.className = "ov-linje";
    bar.setAttribute("role", "progressbar");
    bar.setAttribute("aria-valuemin", "0");
    bar.setAttribute("aria-valuemax", "100");
    bar.setAttribute("aria-valuenow", String(p));
    var fyll = document.createElement("div");
    fyll.className = "ov-fyll";
    fyll.style.width = p + "%";
    bar.appendChild(fyll);
    var t = document.createElement("span");
    t.className = "ov-tekst";
    t.textContent = tekst;
    rot.appendChild(bar);
    rot.appendChild(t);
    return rot;
  }

  function init() {
    var stil = document.createElement("style");
    stil.textContent =
      ".ov{display:flex;align-items:center;gap:.6rem;margin:.25rem .2rem 0}" +
      ".ov-linje{flex:1;height:8px;background:#ebe7dc;border:1px solid #111;border-radius:6px;overflow:hidden}" +
      ".ov-fyll{height:100%;background:#f5c400}" +
      ".ov-tekst{font-size:.85rem;color:#555;white-space:nowrap}" +
      ".ov.ferdig .ov-tekst{color:#111;font-weight:700}" +
      ".ov-total{margin:0 0 1rem}" +
      ".ov-total .ov-linje{height:12px}" +
      ".ov-total-tittel{margin:0;font-size:.9rem;color:#555}";
    document.head.appendChild(stil);

    var sumFerdig = 0, sumTotalt = 0;
    var valg = document.querySelectorAll("[data-oversikt]");
    for (var i = 0; i < valg.length; i++) {
      var r = tell(valg[i].getAttribute("data-oversikt"));
      if (!r) continue;
      sumFerdig += r.ferdig;
      sumTotalt += r.totalt;
      var tekst = r.ferdig === r.totalt ? s("alle") : r.ferdig === 0 ? s("ingen") : s("av", { n: r.ferdig, m: r.totalt });
      var el = linje(r.ferdig, r.totalt, tekst);
      if (r.ferdig === r.totalt) el.classList.add("ferdig");
      valg[i].parentNode.insertBefore(el, valg[i].nextSibling);
    }

    var topp = document.getElementById("oversikt");
    if (topp && sumTotalt > 0) {
      var p = Math.floor(100 * sumFerdig / sumTotalt);
      var tittel = document.createElement("p");
      tittel.className = "ov-total-tittel";
      tittel.textContent = s("totalt");
      var total = linje(sumFerdig, sumTotalt, s("ferdigTotal", { n: sumFerdig, m: sumTotalt, p: p }));
      total.classList.add("ov-total");
      topp.appendChild(tittel);
      topp.appendChild(total);
    }
  }

  init();
})();
