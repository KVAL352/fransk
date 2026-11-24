// Ordene til «Ord i butikken» (snakkepakken, situasjonen butikken): spill 9 åpnet med ?pakke=butikk.
// Samme form som src/folk-ord.js. Bare navneord med artikkel. Kjønn er Claude-utkast, ikke lest av noen som kan fransk godt.
// Bilder: Twemoji (CC BY 4.0). Nummer (1-7) er nøkkelen Fremgang bruker. Legg nye ord bakerst.

(function () {
  var Host = typeof module !== "undefined" && module.exports ? require("./host.js") : window.Host;
  function emoji(kode) { return { emoji: kode }; }

  var TEMAER = [{ nr: 1, id: "butikk", navn: "butikken" }];

  // [slug, ord, kjonn, vokal, flertall, tema, kilde]
  var RADER = [
    ["butikk-pain", "pain", "m", false, false, 1, emoji("1f35e")],
    ["butikk-lait", "lait", "m", false, false, 1, emoji("1f95b")],
    ["butikk-fromage", "fromage", "m", false, false, 1, emoji("1f9c0")],
    ["butikk-pomme", "pomme", "f", false, false, 1, emoji("1f34e")],
    ["butikk-eau", "eau", "f", true, false, 1, emoji("1f4a7")],
    ["butikk-sac", "sac", "m", false, false, 1, emoji("1f45c")],
    ["butikk-euro", "euro", "m", true, false, 1, emoji("1f4b6")],
  ];

  var ORD = RADER.map(function (r, i) {
    return { nr: i + 1, slug: r[0], ord: r[1], kjonn: r[2], vokal: r[3], flertall: r[4], tema: r[5], kilde: r[6], bilde: "bilder/" + r[0] + ".svg" };
  });

  function hent(nr) { return ORD[nr - 1] || null; }
  function iTema(tema) { return ORD.filter(function (o) { return o.tema === tema; }); }

  var BETYD = {
    "pain": ["brød", "bread"],
    "lait": ["melk", "milk"],
    "fromage": ["ost", "cheese"],
    "pomme": ["eple", "apple"],
    "eau": ["vann", "water"],
    "sac": ["pose", "bag"],
    "euro": ["euro", "euro"],
  };
  function betyd(o, kode) {
    var rad = BETYD[o.ord];
    return rad ? rad[kode === "nb" ? 0 : 1] : null;
  }

  var api = { TEMAER: TEMAER, ORD: ORD, ANTALL: ORD.length, hent: hent, iTema: iTema, fasit: Host.fasit, vurder: Host.vurder, betyd: betyd, BETYD: BETYD };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.ButikkOrd = api;
})();
