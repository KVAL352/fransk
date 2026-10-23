// Synlig fremgang for et spill: linje i prosent, én rute per tall med fem prikker,
// og belønning når et tall bytter boks, blir utlært eller linja passerer 25/50/75 %.
// Farger fra det belgiske flagget: svart, gult, rødt.
// Stille-versjonen er linja og rutene. Hopp og konfetti legges på som lag og hoppes
// over ved redusert bevegelse; da blinker ruta i farge i stedet. Lyd spilles uansett.

(function () {
  var STIL_ID = "fv-stil";
  function T(nokkel, verdier) { return window.Tekster.t(nokkel, verdier); }
  var MILEPAELER = [[25, "fv.m25"], [50, "fv.m50"], [75, "fv.m75"]];

  function leggInnStil() {
    if (document.getElementById(STIL_ID)) return;
    var s = document.createElement("style");
    s.id = STIL_ID;
    s.textContent =
      ".fv{margin:1.5rem 0}" +
      ".fv-topp{display:flex;justify-content:space-between;align-items:baseline;gap:1rem;margin-bottom:.35rem}" +
      ".fv-prosent{font-size:1.4rem;font-weight:700}" +
      ".fv-igjen{color:#555;font-size:.9rem}" +
      ".fv-linje{position:relative;height:14px;background:#ebe7dc;border:1px solid #111;border-radius:8px;overflow:hidden}" +
      ".fv-fyll{position:absolute;inset:0;background:#f5c400;transform-origin:left;transform:scaleX(0);transition:transform .4s cubic-bezier(0,0,.38,.9)}" +
      ".fv-merke{position:absolute;top:0;bottom:0;width:1px;background:#111}" +
      ".fv-melding{min-height:1.6rem;margin:.4rem 0 0;font-weight:600;color:#111;transition:opacity .3s}" +
      ".fv-rad{list-style:none;padding:0;margin:.75rem 0 0;display:grid;grid-template-columns:repeat(5,1fr);gap:1px}" +
      "@media (min-width:30rem){.fv-rad{grid-template-columns:repeat(10,1fr)}}" +
      ".fv-rute{border:2px solid #ddd;border-radius:6px;padding:.1rem .1rem;text-align:center;background:#fff}" +
      ".fv-tall{display:block;font-size:1.1rem;font-weight:700;line-height:1.2}" +
      ".fv-prikker{display:flex;justify-content:center;gap:2px;margin-top:.15rem}" +
      ".fv-prikk{width:6px;height:6px;border-radius:50%;background:#dcd8cc}" +
      ".fv-prikk.paa{background:#111}" +
      ".fv-teller{display:block;font-size:.7rem;color:#555;min-height:1em;margin-top:.1rem}" +
      ".fv-rute.boks5{border-color:#e0b000}" +
      ".fv-rute.utlaert{background:#111;border-color:#111;color:#f5c400}" +
      ".fv-rute.utlaert .fv-prikk{background:#f5c400}" +
      ".fv-rute.utlaert .fv-teller{color:#f5c400}" +
      ".fv [hidden]{display:none}" +
      ".fv-ferdig{margin:.9rem 0 0}" +
      ".fv-ferdig-tittel{margin:0 0 .3rem;font-size:.85rem;color:#555}" +
      ".fv-ferdig-rad{list-style:none;padding:0;margin:0;display:flex;flex-wrap:wrap;gap:4px}" +
      ".fv-rute.liten{padding:.1rem .5rem;border-radius:12px}" +
      ".fv-rute.liten .fv-tall{font-size:.85rem;font-weight:600}" +
      ".fv-rute.liten .fv-prikker,.fv-rute.liten .fv-teller{display:none}" +
      ".fv-rute.hopp{animation:fv-hopp .45s cubic-bezier(.2,0,.38,.9)}" +
      ".fv-rute.blink{animation:fv-blink .8s ease-out}" +
      "@keyframes fv-hopp{0%{transform:none}35%{transform:translateY(-10px) scale(1.12)}100%{transform:none}}" +
      "@keyframes fv-blink{0%{box-shadow:0 0 0 4px #f5c400}100%{box-shadow:0 0 0 4px transparent}}";
    document.head.appendChild(s);
  }

  // valg: { spill, min, maks, beholder }
  function lag(valg) {
    leggInnStil();
    var F = window.Fremgang;
    var spill = valg.spill, min = valg.min, maks = valg.maks;

    var rot = document.createElement("section");
    rot.className = "fv";
    rot.setAttribute("aria-label", T("fv.etikett"));

    var topp = document.createElement("div");
    topp.className = "fv-topp";
    var prosentEl = document.createElement("span");
    prosentEl.className = "fv-prosent";
    var igjenEl = document.createElement("span");
    igjenEl.className = "fv-igjen";
    topp.appendChild(prosentEl);
    topp.appendChild(igjenEl);

    var linje = document.createElement("div");
    linje.className = "fv-linje";
    linje.setAttribute("role", "progressbar");
    linje.setAttribute("aria-valuemin", "0");
    linje.setAttribute("aria-valuemax", "100");
    linje.setAttribute("aria-label", T("fv.linje"));
    var fyll = document.createElement("div");
    fyll.className = "fv-fyll";
    linje.appendChild(fyll);
    MILEPAELER.forEach(function (m) {
      var merke = document.createElement("span");
      merke.className = "fv-merke";
      merke.style[window.Tekster.rtl() ? "right" : "left"] = m[0] + "%";
      linje.appendChild(merke);
    });

    var melding = document.createElement("p");
    melding.className = "fv-melding";
    melding.setAttribute("aria-live", "polite");

    var rad = document.createElement("ol");
    rad.className = "fv-rad";
    // Tall som er lært flyttes ned i en egen liten rad, så de ikke tar plassen fra det som skal læres.
    var ferdig = document.createElement("div");
    ferdig.className = "fv-ferdig";
    var ferdigTittel = document.createElement("p");
    ferdigTittel.className = "fv-ferdig-tittel";
    ferdigTittel.textContent = T("fv.laert");
    var ferdigRad = document.createElement("ol");
    ferdigRad.className = "fv-ferdig-rad";
    ferdig.appendChild(ferdigTittel);
    ferdig.appendChild(ferdigRad);
    var ruter = {};
    var varUtlaert = {};
    var holdOppe = {}; // nylig lært: blir på plass et par sekunder så belønningen vises der
    var holdTimer = {};
    for (var t = min; t <= maks; t++) {
      var li = document.createElement("li");
      li.className = "fv-rute";
      li.setAttribute("data-tall", t);
      li.innerHTML = '<span class="fv-tall">' + t + '</span><span class="fv-prikker" aria-hidden="true">' +
        '<i class="fv-prikk"></i><i class="fv-prikk"></i><i class="fv-prikk"></i><i class="fv-prikk"></i><i class="fv-prikk"></i>' +
        '</span><span class="fv-teller" aria-hidden="true"></span>';
      li.addEventListener("animationend", function () { this.classList.remove("hopp", "blink"); });
      rad.appendChild(li);
      ruter[t] = li;
      varUtlaert[t] = F.status(spill, t).utlaert;
    }

    rot.appendChild(topp);
    rot.appendChild(linje);
    rot.appendChild(melding);
    rot.appendChild(rad);
    rot.appendChild(ferdig);
    valg.beholder.appendChild(rot);

    // Setter ruta inn i listen i tallrekkefølge.
    function settInn(liste, t) {
      var li = ruter[t];
      var neste = null;
      for (var k = liste.firstChild; k; k = k.nextSibling) {
        if (Number(k.getAttribute("data-tall")) > t) { neste = k; break; }
      }
      liste.insertBefore(li, neste);
    }

    var meldingTimer = null;

    function tegnRute(t) {
      var st = F.status(spill, t);
      var li = ruter[t];
      var prikker = li.querySelectorAll(".fv-prikk");
      for (var i = 0; i < prikker.length; i++) prikker[i].classList.toggle("paa", i < st.boks);
      li.classList.toggle("boks5", st.boks === F.MAKS_BOKS && !st.utlaert);
      li.classList.toggle("utlaert", st.utlaert);
      var nede = st.utlaert && !holdOppe[t];
      li.classList.toggle("liten", nede);
      var mal = nede ? ferdigRad : rad;
      if (li.parentNode !== mal) settInn(mal, t);
      var teller = li.querySelector(".fv-teller");
      teller.textContent = st.utlaert ? T("fv.laertKort") : st.boks === F.MAKS_BOKS ? T("fv.rekke", { rekke: st.rekke, krav: st.krav }) : "";
      li.setAttribute("aria-label", st.utlaert ? T("fv.rute.laert", { tall: t }) :
        T("fv.rute.boks", { tall: t, boks: st.boks }) + (st.boks === F.MAKS_BOKS ? T("fv.rute.rekke", { rekke: st.rekke, krav: st.krav }) : ""));
    }

    // Tegner alt på nytt fra lagringen og returnerer prosenten.
    function tegn() {
      var s = F.steg(spill, min, maks);
      var p = Math.floor(100 * s.gjort / s.totalt);
      prosentEl.textContent = p + " %";
      igjenEl.textContent = s.igjen === 0 ? T("fv.alleLaert") : T("fv.igjen", { n: s.igjen });
      fyll.style.transform = "scaleX(" + p / 100 + ")";
      linje.setAttribute("aria-valuenow", String(p));
      for (var t = min; t <= maks; t++) tegnRute(t);
      ferdig.hidden = !ferdigRad.firstChild;
      rad.hidden = !rad.firstChild;
      return p;
    }

    function visMelding(tekst) {
      window.clearTimeout(meldingTimer);
      melding.style.opacity = "1";
      melding.textContent = tekst;
      meldingTimer = window.setTimeout(function () { melding.style.opacity = "0"; }, 3500);
    }

    function marker(li, stor) {
      li.classList.remove("hopp", "blink");
      void li.offsetWidth; // start animasjonen på nytt
      if (window.Feiring.redusertBevegelse()) {
        li.classList.add("blink");
      } else {
        li.classList.add("hopp");
        window.Feiring.konfettiFra(li, stor);
      }
    }

    var forrigeProsent = tegn();

    // Kall etter Fremgang.registrer med resultatet derfra. Returnerer true hvis det ble spilt lyd.
    // ferdig = alle tallene er nå utlært; da viser spillet den store feiringen, og her blir det stille.
    function etterSvar(tall, res, ferdig) {
      var nyUtlaert = res.utlaert && !varUtlaert[tall];
      varUtlaert[tall] = res.utlaert;
      if (nyUtlaert) {
        holdOppe[tall] = true;
        window.clearTimeout(holdTimer[tall]);
        holdTimer[tall] = window.setTimeout(function () {
          holdOppe[tall] = false;
          tegn();
        }, 2500);
      }
      var p = tegn();
      var li = ruter[tall];
      var milepael = null;
      MILEPAELER.forEach(function (m) { if (forrigeProsent < m[0] && p >= m[0]) milepael = m; });
      forrigeProsent = p;

      var opp = res.til > res.fra;

      if (ferdig) return false;
      if (li && (opp || nyUtlaert)) marker(li, nyUtlaert);
      if (milepael) {
        visMelding(T("fv.milepael", { melding: T(milepael[1]), p: p }));
        window.Feiring.milepaelLyd();
      } else if (nyUtlaert) {
        visMelding(T("fv.erLaert", { tall: tall }));
        window.Feiring.utlaertLyd();
      } else if (opp) {
        // Andel av veien fra forrige milepæl til neste (25, 50, 75, 100).
        window.Feiring.boksLyd((p % 25) / 25);
      } else {
        return false;
      }
      return true;
    }

    return { tegn: tegn, etterSvar: etterSvar };
  }

  window.Fremgangsvisning = { lag: lag };
})();
