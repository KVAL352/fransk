// Ordene til spill 9 (høstord): se PLAN-host.md, ordliste i docs/time-2026-11/ordliste-host.md, bildevalg i docs/time-2026-11/bildevalg-host.md.
// Seks temaer, ett om gangen. Nummer (1-39) er nøkkelen Fremgang bruker. Ikke endre rekkefølgen etter at noen har spilt, legg nye ord bakerst.
//
// Felt: slug (filnavn i bilder/), ord (uten artikkel, i den formen bildet viser), kjonn (m|f), vokal (true: l'ord i entall),
// flertall (true: vises med «les», bildet viser flere ting), tema (1-6), kilde: { fil, lisens, opphav } for foto fra Wikimedia Commons,
// eller { emoji } for Twemoji (CC BY 4.0). Samme form som src/ord.js, slik at tools/hent-bilder.mjs kan utvides til denne fila.
//
// Kjønn og vokal er fra ordlista (Claude-utkast, ikke kontrollert av noen som kan fransk godt).
// hérisson og hibou har h aspiré (le, ikke l'): min kunnskap, bør verifiseres.
// Bilder: slugen «vent» er tatt av spill 5 (vindpølse), så vinden her heter host-vent. «noix» bruker samme bilde som spill 5.

(function () {
  var Sjekk = typeof module !== "undefined" && module.exports ? require("./sjekk.js") : window.Sjekk;
  function foto(fil, lisens, opphav) { return { fil: fil, lisens: lisens, opphav: opphav }; }
  function emoji(kode) { return { emoji: kode }; }

  var TEMAER = [
    { nr: 1, id: "meteo", navn: "météo" },
    { nr: 2, id: "paysage", navn: "paysage" },
    { nr: 3, id: "vetements", navn: "vêtements" },
    { nr: 4, id: "animaux", navn: "animaux" },
    { nr: 5, id: "fruits", navn: "fruits / légumes" },
    { nr: 6, id: "cuisine", navn: "cuisine" },
  ];

  // [slug, ord, kjonn, vokal, flertall, tema, kilde]
  var RADER = [
    // 1 météo
    ["host-vent", "vent", "m", false, false, 1, emoji("1f4a8")],
    ["pluie", "pluie", "f", false, false, 1, emoji("1f327")],
    ["soleil", "soleil", "m", false, false, 1, emoji("2600")],
    ["nuage", "nuage", "m", false, false, 1, emoji("26c5")],
    ["brouillard", "brouillard", "m", false, false, 1, foto("Mount_Lushan_-_fog.JPG", "CC BY-SA 2.5", "pfctdayelise")],
    ["orage", "orage", "m", true, false, 1, foto("Lightning_Pritzerbe_01_(MK).jpg", "CC BY-SA 3.0", "Mathias Krumbholz")],
    ["froid", "froid", "m", false, false, 1, emoji("1f976")],
    // 2 paysage
    ["arbres", "arbre", "m", true, false, 2, foto("Autumn_leaves_on_trees_with_pathway_--_1_of_33.jpg", "CC0", "Maritess Sulcer")],
    ["feuille", "feuille", "f", false, false, 2, foto("Maple_leaf_held_up_in_autumn,_Vieux-Limoilou.jpg", "CC BY-SA 4.0", "Wilfredor")],
    ["foret", "forêt", "f", false, false, 2, foto("Autumn_Forest_and_wood_trees_31.jpg", "CC BY 4.0", "Scott Wylie")],
    ["montagne", "montagne", "f", false, false, 2, foto("Overcoat_Peak.jpg", "CC BY 2.0", "Martin Bravenboer")],
    ["champ", "champ", "m", false, false, 2, foto("Autumn_field_in_Onitcani_01.jpg", "CC0", "Iurie Nistor")],
    ["chemin", "chemin", "m", false, false, 2, foto("Forest_path_during_autumn.jpg", "CC0", "Paxxen")],
    ["riviere", "rivière", "f", false, false, 2, foto("Rogue_River_Oregon_USA.jpg", "CC BY 2.0", "Hamad Darwish")],
    // 3 vêtements
    ["gants", "gant", "m", false, false, 3, foto("Centre_de_Documentació_Museu_Tèxtil_de_Terrassa-_Reserves-_Teixits-_Guants002.JPG", "CC BY-SA 3.0", "Kippelboy")],
    ["bottes", "botte", "f", false, false, 3, foto("Rain_boots_on_Stairs.jpg", "CC BY-SA 3.0", "Erikamthompson")],
    ["manteau", "manteau", "m", false, false, 3, emoji("1f9e5")],
    ["echarpe", "écharpe", "f", true, false, 3, emoji("1f9e3")],
    ["bonnet", "bonnet", "m", false, false, 3, foto("Beanie_-_Knit_Cap_(51013511676).jpg", "CC BY 2.0", "ajay_suresh")],
    ["pull", "pull", "m", false, false, 3, foto("Grandpa_Sweater_full_pattern_H&M.jpg", "CC BY-SA 4.0", "Kauey")],
    ["parapluie", "parapluie", "m", false, false, 3, foto("A_Classy_Umbrella_To_Protect_My_Cigarette_(127721121).jpeg", "CC BY 3.0", "Sergio Miranda")],
    // 4 animaux
    ["renard", "renard", "m", false, false, 4, foto("Red_fox_catches_a_vole_-_Tolyatti,_Russia.jpg", "CC BY 2.0", "Andrey Gulivanov")],
    ["ecureuil", "écureuil", "m", true, false, 4, foto("Squirrel_posing.jpg", "CC BY 2.0", "Peter Trimming")],
    ["herisson", "hérisson", "m", false, false, 4, foto("West_European_Hedgehog_(Erinaceus_europaeus)1.jpg", "CC BY-SA 3.0", "Hrald")],
    ["cerf", "cerf", "m", false, false, 4, foto("014_Wild_Red_Deer_Switzerland_Photo_by_Giles_Laurent.jpg", "CC BY-SA 4.0", "Giles Laurent")],
    ["hibou", "hibou", "m", false, false, 4, foto("Athene_cunicularia_1_edited.JPG", "CC BY 2.0", "Wagner Machado Carlos Lemes")],
    ["oiseau", "oiseau", "m", true, false, 4, foto("Female_house_sparrow_at_Kodai.jpg", "CC BY-SA 4.0", "Deepak Sundar")],
    ["sanglier", "sanglier", "m", false, false, 4, foto("A_young_wild_boar_in_his_environment.jpg", "CC BY 3.0", "Michael Gäbler")],
    // 5 fruits / légumes
    ["citrouille", "citrouille", "f", false, false, 5, foto("Cucurbita_2011_G1.jpg", "Public domain", "George Chernilevsky")],
    ["pomme", "pomme", "f", false, false, 5, foto("Red_Apple.jpg", "CC BY 2.0", "Abhijit Tembhekar")],
    ["poire", "poire", "f", false, false, 5, foto("Pear_DS.jpg", "CC BY-SA 3.0", "Augustus Binu")],
    ["champignons", "champignon", "m", false, false, 5, foto("Edible_fungi_in_basket_2012_G1.jpg", "Public domain", "George Chernilevsky")],
    ["noix", "noix", "f", false, false, 5, foto("Walnuts_-_whole_and_open_with_halved_kernel.jpg", "CC BY-SA 4.0", "Ivar Leidus")],
    ["raisin", "raisin", "m", false, false, 5, foto("Edle_Weinrebe,_'Vitis_vinifera'_subsp._'vinifera.jpg", "CC BY 2.0", "eflon")],
    // 6 cuisine
    ["poele", "poêle", "f", false, false, 6, foto("Frying_Pan_2_2019-03-21.jpg", "CC BY-SA 4.0", "FASTILY")],
    ["casserole", "casserole", "f", false, false, 6, foto("Hahn_16cm_Saucepan.jpg", "CC BY 2.0", "Cooks & Kitchens")],
    ["cuillere", "cuillère", "f", false, false, 6, foto("Ngaji.jpg", "CC BY-SA 4.0", "Akwugo")],
    ["tarte", "tarte", "f", false, false, 6, foto("Apple_pie_24.jpg", "CC BY 4.0", "Shisma")],
    ["confiture", "confiture", "f", false, false, 6, foto("Jam_jar,_Kazakhstan.jpg", "CC BY-SA 4.0", "Nurken")],
  ];

  var ORD = RADER.map(function (r, i) {
    return { nr: i + 1, slug: r[0], ord: r[1], kjonn: r[2], vokal: r[3], flertall: r[4], tema: r[5], kilde: r[6],
      bilde: "bilder/" + r[0] + (r[6].emoji ? ".svg" : ".jpg") };
  });

  function hent(nr) {
    for (var i = 0; i < ORD.length; i++) if (ORD[i].nr === nr) return ORD[i];
    return null;
  }

  function iTema(tema) {
    return ORD.filter(function (o) { return o.tema === tema; });
  }

  // Godkjent svar med bestemt artikkel: les (flertall), l' (vokal), la eller le.
  function fasit(o) {
    if (o.flertall) return "les " + o.ord;
    if (o.vokal) return "l'" + o.ord;
    return (o.kjonn === "f" ? "la " : "le ") + o.ord;
  }

  // Lengste først: «les» før «le», «une» før «un».
  var ARTIKKEL = /^(?:(?:une|un|les|le|la|des|du|de la)(?:\s+|$)|l['’]\s*)/i;

  // Dømmer et svar: { status, aksentfeil } der status er
  //   "riktig"   : artikkel og ord stemmer (aksentfeil = true hvis bare aksent mangler),
  //   "flertall" : ordet stemmer, men bildet viser flere og svaret mangler «les»,
  //   "vokal"    : ordet stemmer, men hun skrev le eller la i stedet for l',
  //   "artikkel" : ordet stemmer, men artikkelen er feil eller mangler,
  //   "ord"      : ordet er feil.
  function vurder(svar, o) {
    var r = Sjekk.sjekkFlere(svar, [fasit(o)]);
    if (r.riktig) return { status: "riktig", aksentfeil: r.aksentfeil };
    var uten = Sjekk.normaliser(svar).replace(ARTIKKEL, "");
    var rest = Sjekk.sjekk(uten, o.ord);
    if (uten && rest.riktig) {
      var status = o.flertall ? "flertall"
        : o.vokal && /^(?:le|la)\s/i.test(Sjekk.normaliser(svar)) ? "vokal"
        : "artikkel";
      return { status: status, aksentfeil: rest.aksentfeil };
    }
    return { status: "ord", aksentfeil: false };
  }

  var api = { TEMAER: TEMAER, ORD: ORD, ANTALL: ORD.length, hent: hent, iTema: iTema, fasit: fasit, vurder: vurder };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.Host = api;
})();
