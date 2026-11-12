// Ordene til «Ord på vei» (snakkepakken, situasjonen på vei): spill 9 åpnet med ?pakke=metro.
// Samme form som src/host.js, så spill 9 bruker den uten å vite forskjellen. fasit og vurdering gjenbrukes fra Host.
// Bare navneord med artikkel. «en retard», «bientôt» og «dans dix minutes» passer ikke i et bildespill med artikkel
// (bildet kan ikke vise dem), og er bare med i setningene i spill 11 (metro.js), unntatt «bientôt».
// Kjønn og vokal er Claude-utkast, ikke lest av noen som kan fransk godt. Bilder: Twemoji (CC BY 4.0).
// Nummer (1-5) er nøkkelen Fremgang bruker. Ikke endre rekkefølgen etter at noen har spilt, legg nye ord bakerst.

(function () {
  var Host = typeof module !== "undefined" && module.exports ? require("./host.js") : window.Host;
  function emoji(kode) { return { emoji: kode }; }

  var TEMAER = [{ nr: 1, id: "paavei", navn: "på vei" }];

  // [slug, ord, kjonn, vokal, flertall, tema, kilde]
  var RADER = [
    ["metro-metro", "métro", "m", false, false, 1, emoji("1f687")],
    ["metro-bus", "bus", "m", false, false, 1, emoji("1f68c")],
    ["metro-tram", "tram", "m", false, false, 1, emoji("1f68b")],
    ["metro-station", "station", "f", false, false, 1, emoji("1f689")],
    ["metro-arret", "arrêt", "m", true, false, 1, emoji("1f68f")],
  ];

  var ORD = RADER.map(function (r, i) {
    return { nr: i + 1, slug: r[0], ord: r[1], kjonn: r[2], vokal: r[3], flertall: r[4], tema: r[5], kilde: r[6], bilde: "bilder/" + r[0] + ".svg" };
  });

  function hent(nr) { return ORD[nr - 1] || null; }
  function iTema(tema) { return ORD.filter(function (o) { return o.tema === tema; }); }

  // nb, en. Andre språk viser engelsk (hennes krav i denne runden).
  var BETYD = {
    "métro": ["metro", "metro, underground"],
    "bus": ["buss", "bus"],
    "tram": ["trikk", "tram"],
    "station": ["stasjon", "station"],
    "arrêt": ["holdeplass", "stop (bus or tram stop)"],
  };
  function betyd(o, kode) {
    var rad = BETYD[o.ord];
    return rad ? rad[kode === "nb" ? 0 : 1] : null;
  }

  var api = { TEMAER: TEMAER, ORD: ORD, ANTALL: ORD.length, hent: hent, iTema: iTema, fasit: Host.fasit, vurder: Host.vurder, betyd: betyd, BETYD: BETYD };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.MetroOrd = api;
})();
