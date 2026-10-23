// Nivåvelger for spillene. Nivåene bygger på hverandre: nivå 2 tar med tallene fra nivå 1,
// så ferdige tall blandes inn med de nye. Valget lagres per spill. Fremgangen ligger per tall
// i src/fremgang.js og følger med på tvers av nivå.
// Rekkefølgen er låst: spill 1 nivå 1, spill 2 nivå 1, spill 1 nivå 2, spill 2 nivå 2 og så videre.
// Et steg åpnes når steget før er ferdig (alle tallene i nivået utlært i det spillet).

(function () {
  var NIVAAER = [
    { min: 1, maks: 10 },
    { min: 1, maks: 20 },
    { min: 1, maks: 50 },
    { min: 1, maks: 69 },
    { min: 1, maks: 99 }
  ];

  function nokkel(spill) { return "fransk.nivaa." + spill; }

  // ?test=1 åpner alle nivåer i denne fanen (sessionStorage), for å se fremgangsvisningen uten å spille seg dit.
  // ?test=0 slår det av igjen. Rører ikke den lagrede fremgangen.
  function testmodus() {
    try {
      var p = new URLSearchParams(window.location.search).get("test");
      if (p === "1") window.sessionStorage.setItem("fransk.test", "1");
      if (p === "0") window.sessionStorage.removeItem("fransk.test");
      return window.sessionStorage.getItem("fransk.test") === "1";
    } catch (e) {
      return false;
    }
  }

  function ferdig(spill, i) {
    return window.Fremgang.alleUtlaert(spill, NIVAAER[i].min, NIVAAER[i].maks);
  }

  // Er nivå i (0-indeksert) åpent i dette spillet? Steget før må være ferdig.
  function ledig(spill, i) {
    if (testmodus()) return true;
    if (spill === "spill1") return i === 0 || ferdig("spill2", i - 1);
    return ferdig("spill1", i);
  }

  // Høyeste åpne nivå i spillet.
  function hoyesteLedige(spill) {
    var h = 0;
    for (var i = 1; i < NIVAAER.length; i++) if (ledig(spill, i)) h = i;
    return h;
  }

  // Hva som kommer etter nivået i dette spillet: { href, tekst } eller null etter siste steg.
  function videre(spill, i) {
    if (spill === "spill1") return { href: "spill2.html?nivaa=" + (i + 1), tekst: "Gå videre til spill 2, nivå " + (i + 1) };
    if (i + 1 < NIVAAER.length) return { href: "index.html?nivaa=" + (i + 2), tekst: "Gå videre til spill 1, nivå " + (i + 2) };
    return null;
  }

  // Returnerer nivåets indeks (0 for første nivå). Et lagret nivå som er låst, gir høyeste åpne.
  function hent(spill) {
    try {
      var n = Number(window.localStorage.getItem(nokkel(spill)));
      n = n >= 0 && n < NIVAAER.length ? Math.floor(n) : 0;
      return ledig(spill, n) ? n : hoyesteLedige(spill);
    } catch (e) {
      return 0;
    }
  }

  function lagre(spill, indeks) {
    try { window.localStorage.setItem(nokkel(spill), String(indeks)); } catch (e) { /* uten lagring blir det første nivå */ }
  }

  // Tegner knappene og laster siden på nytt når nivået byttes. Returnerer { min, maks } for valgt nivå.
  function init(spill, beholder) {
    // Lenken fra forrige spill kan peke rett på et nivå: ?nivaa=2. Gjelder bare hvis nivået er åpent.
    try {
      var onsket = Number(new URLSearchParams(window.location.search).get("nivaa")) - 1;
      if (onsket >= 0 && onsket < NIVAAER.length && ledig(spill, onsket)) {
        lagre(spill, onsket);
        // Fjern parameteren, ellers overstyrer den valget når nivået byttes og siden lastes på nytt.
        window.history.replaceState(null, "", window.location.pathname);
      }
    } catch (e) { /* uten URL-parameter brukes lagret nivå */ }
    var valgt = hent(spill);
    var gruppe = document.createElement("div");
    gruppe.setAttribute("role", "group");
    gruppe.setAttribute("aria-label", "Nivå");
    NIVAAER.forEach(function (n, i) {
      var knapp = document.createElement("button");
      knapp.type = "button";
      var apen = ledig(spill, i);
      knapp.textContent = "Nivå " + (i + 1) + ": " + n.min + " til " + n.maks + (apen ? "" : " (låst)");
      knapp.setAttribute("aria-pressed", i === valgt ? "true" : "false");
      if (!apen) {
        knapp.disabled = true;
        knapp.title = i === 0 || spill === "spill2" ? "Åpnes når nivå " + (i + 1) + " er ferdig i spill 1" :
          "Åpnes når nivå " + i + " er ferdig i spill 2";
      }
      if (i === valgt) knapp.style.cssText = "background:#f5c400;border:2px solid #111;font-weight:700";
      knapp.addEventListener("click", function () {
        if (i === valgt) return;
        lagre(spill, i);
        window.location.reload();
      });
      gruppe.appendChild(knapp);
    });
    beholder.appendChild(gruppe);
    return { min: NIVAAER[valgt].min, maks: NIVAAER[valgt].maks, indeks: valgt, videre: videre(spill, valgt) };
  }

  var api = { init: init, NIVAAER: NIVAAER, ledig: ledig, videre: videre };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.Nivaa = api;
})();
