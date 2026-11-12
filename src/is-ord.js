// Ordene til «Ord i isbutikken» (snakkepakken, situasjonen isbutikken): spill 9 åpnet med ?pakke=is.
// Samme form som src/metro-ord.js. Bare navneord med artikkel. Kjønn er Claude-utkast, ikke lest av noen som kan fransk godt.
// Bilder: Twemoji (CC BY 4.0). Nummer (1-7) er nøkkelen Fremgang bruker. Legg nye ord bakerst.

(function () {
  var Host = typeof module !== "undefined" && module.exports ? require("./host.js") : window.Host;
  function emoji(kode) { return { emoji: kode }; }

  var TEMAER = [{ nr: 1, id: "is", navn: "isbutikken" }];

  // [slug, ord, kjonn, vokal, flertall, tema, kilde]
  var RADER = [
    ["is-glace", "glace", "f", false, false, 1, emoji("1f368")],
    ["is-cornet", "cornet", "m", false, false, 1, emoji("1f366")],
    ["is-boule", "boule", "f", false, false, 1, emoji("26aa")],
    ["is-pot", "pot", "m", false, false, 1, emoji("1f963")],
    ["is-chocolat", "chocolat", "m", false, false, 1, emoji("1f36b")],
    ["is-vanille", "vanille", "f", false, false, 1, emoji("1f33c")],
    ["is-fraise", "fraise", "f", false, false, 1, emoji("1f353")],
  ];

  var ORD = RADER.map(function (r, i) {
    return { nr: i + 1, slug: r[0], ord: r[1], kjonn: r[2], vokal: r[3], flertall: r[4], tema: r[5], kilde: r[6], bilde: "bilder/" + r[0] + ".svg" };
  });

  function hent(nr) { return ORD[nr - 1] || null; }
  function iTema(tema) { return ORD.filter(function (o) { return o.tema === tema; }); }

  var BETYD = {
    "glace": ["is", "ice cream"],
    "cornet": ["iskjeks", "cone"],
    "boule": ["iskule", "scoop"],
    "pot": ["skål", "cup (tub)"],
    "chocolat": ["sjokolade", "chocolate"],
    "vanille": ["vanilje", "vanilla"],
    "fraise": ["jordbær", "strawberry"],
  };
  function betyd(o, kode) {
    var rad = BETYD[o.ord];
    return rad ? rad[kode === "nb" ? 0 : 1] : null;
  }

  var api = { TEMAER: TEMAER, ORD: ORD, ANTALL: ORD.length, hent: hent, iTema: iTema, fasit: Host.fasit, vurder: Host.vurder, betyd: betyd, BETYD: BETYD };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.IsOrd = api;
})();
