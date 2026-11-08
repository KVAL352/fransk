// Ordene til spill 5 og 6 (bildespillene): se bilde, skriv ordet med artikkel. Se PLAN-bilder.md og PLAN-artikler.md.
// Hvert ord kommer fra setningene i spill 3 og 4: setning er id-en i Setninger.LISTE.
// Nummer (1-19) er nøkkelen Fremgang bruker. Ikke endre rekkefølgen etter at noen har spilt, legg nye ord bakerst.
//
// Felt: slug (filnavn i bilder/), ord (uten artikkel), kjonn (m|f), vokal (true: l'ord i bestemt form),
// kilde: { fil, lisens, opphav } for foto fra Wikimedia Commons, eller { emoji } for Twemoji (CC BY 4.0).
//
// Spill 5 godtar bare bestemt artikkel (le/la, l' foran vokal), spill 6 bare ubestemt (un/une). Begge har alle 19 ord. Se PLAN-artikler.md.

(function () {
  var Sjekk = typeof module !== "undefined" && module.exports ? require("./sjekk.js") : window.Sjekk;

  function foto(fil, lisens, opphav) { return { fil: fil, lisens: lisens, opphav: opphav }; }
  function emoji(kode) { return { emoji: kode }; }

  // [slug, ord, kjonn, vokal, setning, kilde]
  var RADER = [
    ["eclair", "éclair", "m", true, 3, foto("Pistachio_eclair_-_Milfey_Patisserie_2026-03-02.jpg", "CC0", "Andy Li")],
    ["beurre", "beurre", "m", false, 5, foto("Butter_block.JPG", "Public domain", "Meanos")],
    ["baguette", "baguette", "f", false, 7, foto("Baguettes_-_stonesoup.jpg", "CC BY 2.0", "jules / stonesoup")],
    ["pain", "pain", "m", false, 8, foto("Fresh_made_bread_05.jpg", "CC BY-SA 4.0", "FranHogan")],
    ["cafe", "café", "m", false, 13, foto("Espresso_Coffee_01.jpg", "CC0", "Jubair1985")],
    ["the", "thé", "m", false, 13, foto("Cup_of_tea_isolated_on_white_background_-_Petr_Kratochvil.jpg", "CC0", "Petr Kratochvil")],
    ["biere", "bière", "f", false, 21, foto("Glass_beer_mug_full.jpg", "CC BY 4.0", "AxtImHause")],
    ["noix", "noix", "f", false, 15, foto("Walnuts_-_whole_and_open_with_halved_kernel.jpg", "CC BY-SA 4.0", "Ivar Leidus")],
    ["monnaie", "monnaie", "f", false, 6, foto("Various_euro_coins.jpg", "CC BY-SA 3.0", "Lewis Ronald")],
    ["table", "table", "f", false, 11, foto("Table_et_bancs02.jpg", "CC BY-SA 3.0", "Lionel Allorge")],
    ["appartement", "appartement", "m", true, 42, foto("Pink_apartment_building_facade,_Rio_de_Janeiro.jpg", "CC0", "Wilfredor")],
    ["ecole", "école", "f", true, 44, foto("High_school_building_exterior_is_pictured_in_a_town_or_city_landscape.jpg", "CC0", "Johny Rebel, the Explorer Panda")],
    ["heure", "heure", "f", true, 31, foto("Roman_numerals_on_alarm_clock_(Unsplash).jpg", "CC0", "Ales Krivec")],
    ["vent", "vent", "m", false, 49, foto("United_States_Airport_Windsock_at_66G_Airport,_Frankenmuth,_MI.jpg", "CC0", "Mrmanssss")],
    ["tram", "arrêt de tram", "m", true, 33, emoji("1f68b")],
    ["enfant", "enfant", "m", true, 37, emoji("1f9d2")],
    ["ciel", "ciel", "m", false, 48, emoji("2601")],
    ["chance", "chance", "f", false, 51, emoji("1f340")],
    ["rdv", "rendez-vous", "m", false, 56, emoji("1f4c5")],
  ];

  var ORD = RADER.map(function (r, i) {
    return { nr: i + 1, slug: r[0], ord: r[1], kjonn: r[2], vokal: r[3], setning: r[4], kilde: r[5],
      bilde: "bilder/" + r[0] + (r[5].emoji ? ".svg" : ".jpg") };
  });

  function hent(nr) {
    for (var i = 0; i < ORD.length; i++) if (ORD[i].nr === nr) return ORD[i];
    return null;
  }

  // Godkjente svar. type: "ubestemt" (un/une), "bestemt" (le/la/l') eller utelatt for begge.
  function fasiter(o, type) {
    var ubestemt = (o.kjonn === "f" ? "une " : "un ") + o.ord;
    var bestemt = o.vokal ? "l'" + o.ord : (o.kjonn === "f" ? "la " : "le ") + o.ord;
    if (type === "ubestemt") return [ubestemt];
    if (type === "bestemt") return [bestemt];
    return [ubestemt, bestemt];
  }

  // Visningsform av fasiten: "la table" med type, "une table (la table)" uten.
  function fasitTekst(o, type) {
    var f = fasiter(o, type);
    return f.length === 1 ? f[0] : f[0] + " (" + f[1] + ")";
  }

  // Lengste først: "une" før "un", "les" før "le".
  var ARTIKKEL = /^(?:(?:une|un|les|le|la|des|du|de la)(?:\s+|$)|l['’]\s*)/i;

  // Dømmer et svar: { status, aksentfeil } der status er
  //   "riktig"   : artikkel og ord stemmer (aksentfeil = true hvis bare aksent mangler),
  //   "type"     : feil type artikkel for spillet (f.eks. une table i le/la-spillet), men kjønnet stemmer,
  //   "vokal"    : le/la-spillet, ord med vokal i begynnelsen, ordet stemmer men hun skrev le/la i stedet for l',
  //   "artikkel" : ordet stemmer, men artikkelen er feil eller mangler,
  //   "ord"      : ordet er feil.
  function vurder(svar, o, type) {
    var r = Sjekk.sjekkFlere(svar, fasiter(o, type));
    if (r.riktig) return { status: "riktig", aksentfeil: r.aksentfeil };
    if (type) {
      var annen = Sjekk.sjekkFlere(svar, fasiter(o, type === "bestemt" ? "ubestemt" : "bestemt"));
      if (annen.riktig) return { status: "type", aksentfeil: annen.aksentfeil };
    }
    var uten = Sjekk.normaliser(svar).replace(ARTIKKEL, "");
    var rest = Sjekk.sjekk(uten, o.ord);
    if (uten && rest.riktig) {
      var elisjon = type === "bestemt" && o.vokal && /^(?:le|la)\s/i.test(Sjekk.normaliser(svar));
      return { status: elisjon ? "vokal" : "artikkel", aksentfeil: rest.aksentfeil };
    }
    return { status: "ord", aksentfeil: false };
  }

  // Hint etter boksen: 1-2 bokstaver som streker med første bokstav, 3-4 bare første bokstav, 5 ingen.
  // Ingen streker for artikkelen: hun skal selv finne den.
  function hint(o, boks) {
    if (boks >= 5) return "";
    var tegn = Array.from(o.ord);
    if (boks >= 3) return tegn[0] + "…";
    return tegn.map(function (c, i) { return i === 0 || c === " " || c === "-" || tegn[i - 1] === " " || tegn[i - 1] === "-" ? c : "_"; }).join(" ");
  }

  var api = { ORD: ORD, ANTALL: ORD.length, hent: hent, fasiter: fasiter, fasitTekst: fasitTekst, vurder: vurder, hint: hint };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.Ord = api;
})();
