// Feiring: dialogen når alle tallene er utlært, og små belønninger underveis (konfetti fra et tall, toner).
// Dialogen er stille-versjonen og virker alene. Konfetti og lyd legges på som lag.
// Konfettien hoppes over ved redusert bevegelse.

(function () {
  var FARGER = ["#111111", "#f5c400", "#d6202a"]; // det belgiske flagget
  var ANTALL = 70;
  var STIL_ID = "feiring-stil";

  function leggInnStil() {
    if (document.getElementById(STIL_ID)) return;
    var s = document.createElement("style");
    s.id = STIL_ID;
    s.textContent =
      ".feiring-bak{position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;z-index:1000;padding:16px}" +
      ".feiring-boks{background:#fff;color:#111;max-width:28rem;width:100%;padding:24px;border-radius:8px;box-shadow:0 8px 32px rgba(0,0,0,.3)}" +
      ".feiring-boks h2{margin:0 0 .5rem}" +
      ".feiring-boks p{margin:0 0 1rem}" +
      ".feiring-knapper{display:flex;flex-wrap:wrap;gap:8px}" +
      ".feiring-bit{position:fixed;top:-20px;width:10px;height:16px;z-index:1001;pointer-events:none;opacity:0;animation-name:feiring-fall;animation-timing-function:cubic-bezier(.4,.14,.3,1);animation-fill-mode:forwards}" +
      ".feiring-sprut{position:fixed;width:7px;height:10px;margin:-5px 0 0 -3px;z-index:1001;pointer-events:none;animation-name:feiring-sprut;animation-timing-function:cubic-bezier(0,0,.3,1);animation-fill-mode:forwards}" +
      "@keyframes feiring-sprut{0%{opacity:1;transform:translate3d(0,0,0) rotate(0)}40%{opacity:1;transform:translate3d(var(--dx),var(--dy),0) rotate(calc(var(--snurr)/2))}100%{opacity:0;transform:translate3d(var(--dx),var(--fall),0) rotate(var(--snurr))}}" +
      "@keyframes feiring-fall{0%{opacity:1;transform:translate3d(0,0,0) rotate(0)}85%{opacity:1}100%{opacity:0;transform:translate3d(var(--drift),110vh,0) rotate(var(--snurr))}}";
    document.head.appendChild(s);
  }

  function redusertBevegelse() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function konfetti() {
    if (redusertBevegelse()) return;
    var bitene = [];
    for (var i = 0; i < ANTALL; i++) {
      var d = document.createElement("div");
      d.className = "feiring-bit";
      d.style.left = Math.random() * 100 + "vw";
      d.style.background = FARGER[i % FARGER.length];
      d.style.animationDuration = (2.2 + Math.random() * 1.4) + "s";
      d.style.animationDelay = (Math.random() * 0.6) + "s";
      d.style.setProperty("--drift", (Math.random() * 160 - 80) + "px");
      d.style.setProperty("--snurr", (360 + Math.random() * 540) + "deg");
      document.body.appendChild(d);
      bitene.push(d);
    }
    window.setTimeout(function () {
      bitene.forEach(function (b) { if (b.parentNode) b.parentNode.removeChild(b); });
    }, 4500);
  }

  // Ett lydsystem for all feiring. Feiler stille hvis lyd ikke er tilgjengelig.
  var lydCtx = null;
  function lyd() {
    if (lydCtx) return lydCtx;
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    lydCtx = new Ctx();
    return lydCtx;
  }

  // noter: [[frekvens, starttid, lengde], ...] i sekunder.
  function spillNoter(noter, volum, bolge) {
    try {
      var ctx = lyd();
      if (!ctx) return;
      if (ctx.state === "suspended") ctx.resume();
      var start = ctx.currentTime + 0.03;
      noter.forEach(function (n) {
        var o = ctx.createOscillator();
        var g = ctx.createGain();
        o.type = bolge || "triangle";
        o.frequency.value = n[0];
        g.gain.setValueAtTime(0.0001, start + n[1]);
        g.gain.exponentialRampToValueAtTime(volum || 0.25, start + n[1] + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, start + n[1] + n[2]);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(start + n[1]);
        o.stop(start + n[1] + n[2] + 0.05);
      });
    } catch (e) { /* lyd er et ekstralag */ }
  }

  // Kort opptrekk C-E-G-C.
  function fanfare() {
    spillNoter([[523.25, 0, 0.2], [659.25, 0.14, 0.2], [783.99, 0.28, 0.2], [1046.5, 0.42, 0.9]]);
  }

  // Den lille lyden mellom belønningene. Dempet og myk (sinus), men stiger trinn for trinn
  // mot neste milepæl, så det høres ut som det bygger seg opp. Stigen ender på E5, og
  // milepælslyden (G5, C6) løser den ut over. andel = 0..1 av veien til neste milepæl.
  // Hver lyd er alltid et steg opp (to ulike toner), og stigen starter ikke lavere enn G4,
  // ellers høres den flat og feil ut.
  var STIGE = [392, 440, 523.25, 587.33, 659.25, 783.99]; // C-dur pentaton, G4 til G5
  function boksLyd(andel) {
    var a = Math.max(0, Math.min(1, andel || 0));
    var i = Math.min(STIGE.length - 2, Math.floor(a * (STIGE.length - 1)));
    var volum = 0.09 + 0.06 * a; // litt sterkere jo nærmere målet
    spillNoter([[STIGE[i], 0, 0.1], [STIGE[i + 1], 0.08, 0.24]], volum, "sine");
  }

  // Utlært: tre toner over boks 5.
  function utlaertLyd() {
    spillNoter([[1046.5, 0, 0.15], [1318.5, 0.1, 0.15], [1568, 0.2, 0.5]], 0.2);
  }

  // 25, 50, 75 %: to rolige toner.
  function milepaelLyd() {
    spillNoter([[783.99, 0, 0.25], [1046.5, 0.18, 0.6]], 0.2);
  }

  // Konfetti som spruter ut fra et element. stor = utlært.
  function konfettiFra(el, stor) {
    if (redusertBevegelse() || !el) return;
    leggInnStil();
    var r = el.getBoundingClientRect();
    var x = r.left + r.width / 2;
    var y = r.top + r.height / 2;
    var antall = stor ? 40 : 14;
    var rekkevidde = stor ? 140 : 70;
    var bitene = [];
    for (var i = 0; i < antall; i++) {
      var d = document.createElement("div");
      d.className = "feiring-sprut";
      var vinkel = Math.random() * Math.PI * 2;
      var lengde = rekkevidde * (0.5 + Math.random() * 0.5);
      d.style.left = x + "px";
      d.style.top = y + "px";
      d.style.background = FARGER[i % FARGER.length];
      d.style.animationDuration = (stor ? 1.4 : 0.9) + Math.random() * 0.4 + "s";
      d.style.setProperty("--dx", Math.cos(vinkel) * lengde + "px");
      d.style.setProperty("--dy", Math.sin(vinkel) * lengde - 20 + "px");
      d.style.setProperty("--fall", Math.sin(vinkel) * lengde + 60 + "px");
      d.style.setProperty("--snurr", (180 + Math.random() * 360) + "deg");
      document.body.appendChild(d);
      bitene.push(d);
    }
    window.setTimeout(function () {
      bitene.forEach(function (b) { if (b.parentNode) b.parentNode.removeChild(b); });
    }, 2200);
  }

  // valg: { tittel, tekst, videre: { tekst, href } | null, etterpaa: element å sette fokus på ved lukking }
  function vis(valg) {
    leggInnStil();
    var bak = document.createElement("div");
    bak.className = "feiring-bak";
    var boks = document.createElement("div");
    boks.className = "feiring-boks";
    boks.setAttribute("role", "dialog");
    boks.setAttribute("aria-modal", "true");
    boks.setAttribute("aria-labelledby", "feiring-tittel");

    var h = document.createElement("h2");
    h.id = "feiring-tittel";
    h.textContent = valg.tittel;
    var p = document.createElement("p");
    p.textContent = valg.tekst;
    var knapper = document.createElement("div");
    knapper.className = "feiring-knapper";

    var terpe = document.createElement("button");
    terpe.type = "button";
    terpe.textContent = "Fortsett å terpe";
    knapper.appendChild(terpe);

    if (valg.videre) {
      var videre = document.createElement("a");
      videre.href = valg.videre.href;
      videre.textContent = valg.videre.tekst;
      knapper.appendChild(videre);
    }

    boks.appendChild(h);
    boks.appendChild(p);
    boks.appendChild(knapper);
    bak.appendChild(boks);
    document.body.appendChild(bak);

    function lukk() {
      document.removeEventListener("keydown", taste);
      if (bak.parentNode) bak.parentNode.removeChild(bak);
      if (valg.etterpaa) valg.etterpaa.focus();
    }
    function taste(e) {
      if (e.key === "Escape") lukk();
    }
    terpe.addEventListener("click", lukk);
    document.addEventListener("keydown", taste);
    terpe.focus();

    konfetti();
    fanfare();
  }

  window.Feiring = {
    vis: vis, konfettiFra: konfettiFra, redusertBevegelse: redusertBevegelse,
    boksLyd: boksLyd, utlaertLyd: utlaertLyd, milepaelLyd: milepaelLyd
  };
})();
