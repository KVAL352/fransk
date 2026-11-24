// Ordene til «Ord blant folk» (snakkepakken, situasjonen ute blant folk): spill 9 åpnet med ?pakke=folk.
// Samme form som src/is-ord.js. Bare navneord med artikkel. Kjønn er Claude-utkast, ikke lest av noen som kan fransk godt.
// Bilder: Twemoji (CC BY 4.0). Nummer (1-7) er nøkkelen Fremgang bruker. Legg nye ord bakerst.

(function () {
  var Host = typeof module !== "undefined" && module.exports ? require("./host.js") : window.Host;
  function emoji(kode) { return { emoji: kode }; }

  var TEMAER = [{ nr: 1, id: "folk", navn: "ute blant folk" }];

  // [slug, ord, kjonn, vokal, flertall, tema, kilde]
  var RADER = [
    ["folk-maison", "maison", "f", false, false, 1, emoji("1f3e0")],
    ["folk-ville", "ville", "f", false, false, 1, emoji("1f3d9")],
    ["folk-pays", "pays", "m", false, false, 1, emoji("1f30d")],
    ["folk-langue", "langue", "f", false, false, 1, emoji("1f5e3")],
    ["folk-ami", "ami", "m", true, false, 1, emoji("1f91d")],
    ["folk-ecole", "école", "f", true, false, 1, emoji("1f3eb")],
    ["folk-famille", "famille", "f", false, false, 1, emoji("1f46a")],
  ];

  var ORD = RADER.map(function (r, i) {
    return { nr: i + 1, slug: r[0], ord: r[1], kjonn: r[2], vokal: r[3], flertall: r[4], tema: r[5], kilde: r[6], bilde: "bilder/" + r[0] + ".svg" };
  });

  function hent(nr) { return ORD[nr - 1] || null; }
  function iTema(tema) { return ORD.filter(function (o) { return o.tema === tema; }); }

  var BETYD = {
    "maison": ["hus", "house"],
    "ville": ["by", "city"],
    "pays": ["land", "country"],
    "langue": ["språk", "language"],
    "ami": ["venn", "friend"],
    "école": ["skole", "school"],
    "famille": ["familie", "family"],
  };
  function betyd(o, kode) {
    var rad = BETYD[o.ord];
    return rad ? rad[kode === "nb" ? 0 : 1] : null;
  }

  var api = { TEMAER: TEMAER, ORD: ORD, ANTALL: ORD.length, hent: hent, iTema: iTema, fasit: Host.fasit, vurder: Host.vurder, betyd: betyd, BETYD: BETYD };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.FolkOrd = api;
})();
