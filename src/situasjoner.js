// Snakkepakkens situasjoner samlet på ett sted: «på vei» (metro), isbutikken (is), «ute blant folk» (folk).
// Før lå dette som nestede ternærer i snakkepakke.js, spill8.js, spill9.js og spill11.js.
//
// Ny situasjon = én ny oppføring her + modulene den peker på (src/<navn>.js, src/<navn>-ord.js, PAKKER.<navn> i src/verb.js)
// + script-linjene i snakkepakke.html, spill9.html og spill11.html + sjekk i tools/spillsjekk.mjs.
//
// Felt per situasjon:
//   navn       ?pakke=<navn> og ?situasjon=<navn>. Verb-fremgangen heter <navn>verb (PAKKER i src/verb.js).
//   ordMod     navn på window-objektet med ordene (src/<navn>-ord.js)
//   setnMod    navn på window-objektet med setningene (src/<navn>.js)
//   ordSpill   fremgangsnøkkel for ord (spill 9). setnSpill: fremgangsnøkkel for setninger (spill 11).
//              Nøklene er lagret hos henne og må ikke endres. Antall setninger N må heller ikke endres etter at hun har spilt
//              (del 1 bruker 1..N, del 2 N+1..2N, del 3 2N+1..3N).
//   ikon       temaikon i spill 9
//   nb / en    tekster. lenke = «Til …», tilbake = «Tilbake til …». Andre språk viser engelsk.

(function () {
  var SITUASJONER = {
    metro: {
      navn: "metro", ordMod: "MetroOrd", setnMod: "Metro", ordSpill: "metroord", setnSpill: "spill11", ikon: "🚇",
      nb: {
        pakkeTittel: "Fransk: på vei", verbDel: "être, aller, prendre, arriver, descendre, partir", ordDel: "métro, bus, tram, station, arrêt",
        verbTittel: "Fransk: verb på vei", verbSist: "Du har lært begge nivåene. Nå kan du øve ordene og setningene på vei.",
        ordTittel: "Fransk: ord på vei", ordSist: "Du har lært alle ordene på vei. Nå får du dem blandet.",
        setnTittel: "Fransk: på vei (metro, buss, trikk)", setnIntro: "Du forteller en venn at du er på vei.", setnFerdig: "På vei er ferdig!",
        lenke: "Til «på vei»", tilbake: "Tilbake til «på vei»"
      },
      en: {
        pakkeTittel: "French: on the way", verbDel: "être, aller, prendre, arriver, descendre, partir", ordDel: "métro, bus, tram, station, arrêt",
        verbTittel: "French: verbs on the way", verbSist: "You have learned both levels. Now you can practise the words and sentences on the way.",
        ordTittel: "French: words on the way", ordSist: "You have learned all the words on the way. Now you get them mixed together.",
        setnTittel: "French: on the way (metro, bus, tram)", setnIntro: "You tell a friend you are on your way.", setnFerdig: "On the way is done!",
        lenke: "Back to “on the way”", tilbake: "Back to “on the way”"
      }
    },
    is: {
      navn: "is", ordMod: "IsOrd", setnMod: "Is", ordSpill: "isord", setnSpill: "spill12", ikon: "🍨",
      nb: {
        pakkeTittel: "Fransk: i isbutikken", verbDel: "prendre, aimer, manger, avoir", ordDel: "glace, cornet, boule, pot, chocolat, vanille, fraise",
        verbTittel: "Fransk: verb i isbutikken", verbSist: "Du har lært begge nivåene. Nå kan du øve ordene og setningene i isbutikken.",
        ordTittel: "Fransk: ord i isbutikken", ordSist: "Du har lært alle ordene i isbutikken. Nå får du dem blandet.",
        setnTittel: "Fransk: i isbutikken", setnIntro: "Du kjøper is til deg selv og de du er sammen med.", setnFerdig: "Isbutikken er ferdig!",
        lenke: "Til isbutikken", tilbake: "Tilbake til isbutikken"
      },
      en: {
        pakkeTittel: "French: at the ice cream shop", verbDel: "prendre, aimer, manger, avoir", ordDel: "glace, cornet, boule, pot, chocolat, vanille, fraise",
        verbTittel: "French: verbs at the ice cream shop", verbSist: "You have learned both levels. Now you can practise the words and sentences at the ice cream shop.",
        ordTittel: "French: words at the ice cream shop", ordSist: "You have learned all the words at the ice cream shop. Now you get them mixed together.",
        setnTittel: "French: at the ice cream shop", setnIntro: "You buy ice cream for yourself and the people you are with.", setnFerdig: "The ice cream shop is done!",
        lenke: "Back to the ice cream shop", tilbake: "Back to the ice cream shop"
      }
    },
    butikk: {
      navn: "butikk", ordMod: "ButikkOrd", setnMod: "Butikk", ordSpill: "butikkord", setnSpill: "spill14", ikon: "🛒",
      nb: {
        pakkeTittel: "Fransk: i butikken", verbDel: "prendre, avoir, aller, aimer", ordDel: "pain, lait, fromage, pomme, eau, sac, euro",
        verbTittel: "Fransk: verb i butikken", verbSist: "Du har lært begge nivåene. Nå kan du øve ordene og setningene i butikken.",
        ordTittel: "Fransk: ord i butikken", ordSist: "Du har lært alle ordene i butikken. Nå får du dem blandet.",
        setnTittel: "Fransk: i butikken", setnIntro: "Du handler mat og drikke: du spør etter ting, spør om pris og betaler.", setnFerdig: "Butikken er ferdig!",
        lenke: "Til butikken", tilbake: "Tilbake til butikken"
      },
      en: {
        pakkeTittel: "French: at the shop", verbDel: "prendre, avoir, aller, aimer", ordDel: "pain, lait, fromage, pomme, eau, sac, euro",
        verbTittel: "French: verbs at the shop", verbSist: "You have learned both levels. Now you can practise the words and sentences at the shop.",
        ordTittel: "French: words at the shop", ordSist: "You have learned all the words at the shop. Now you get them mixed together.",
        setnTittel: "French: at the shop", setnIntro: "You buy food and drinks: you ask for things, ask the price and pay.", setnFerdig: "The shop is done!",
        lenke: "Back to the shop", tilbake: "Back to the shop"
      }
    },
    folk: {
      navn: "folk", ordMod: "FolkOrd", setnMod: "Folk", ordSpill: "folkord", setnSpill: "spill13", ikon: "👋",
      nb: {
        pakkeTittel: "Fransk: ute blant folk", verbDel: "être, habiter, parler, aller, aimer", ordDel: "maison, ville, pays, langue, ami, école, famille",
        verbTittel: "Fransk: verb ute blant folk", verbSist: "Du har lært begge nivåene. Nå kan du øve ordene og setningene ute blant folk.",
        ordTittel: "Fransk: ord ute blant folk", ordSist: "Du har lært alle ordene ute blant folk. Nå får du dem blandet.",
        setnTittel: "Fransk: ute blant folk", setnIntro: "Du hilser, småprater og forteller hvem du er.", setnFerdig: "Ute blant folk er ferdig!",
        lenke: "Til «ute blant folk»", tilbake: "Tilbake til «ute blant folk»"
      },
      en: {
        pakkeTittel: "French: out and about", verbDel: "être, habiter, parler, aller, aimer", ordDel: "maison, ville, pays, langue, ami, école, famille",
        verbTittel: "French: verbs out and about", verbSist: "You have learned both levels. Now you can practise the words and sentences out and about.",
        ordTittel: "French: words out and about", ordSist: "You have learned all the words out and about. Now you get them mixed together.",
        setnTittel: "French: out and about", setnIntro: "You say hello, make small talk and tell people who you are.", setnFerdig: "Out and about is done!",
        lenke: "Back to “out and about”", tilbake: "Back to “out and about”"
      }
    }
  };

  // Alle situasjoner i den rekkefølgen de ble bygget.
  var NAVN = Object.keys(SITUASJONER);

  // Situasjonen for en ?pakke= eller ?situasjon=-verdi, eller null (ukjent verdi, for eksempel «host» eller ingenting).
  function hent(param) {
    return param && Object.prototype.hasOwnProperty.call(SITUASJONER, param) ? SITUASJONER[param] : null;
  }
  // Side-spesifikke oppslag, så filene slipper å sette sammen adresser og modulnavn selv.
  function hrefPakke(sit) { return sit.navn === "metro" ? "snakkepakke.html" : "snakkepakke.html?situasjon=" + sit.navn; }
  function hrefSetn(sit) { return sit.navn === "metro" ? "spill11.html" : "spill11.html?pakke=" + sit.navn; }
  function verbSpill(sit) { return sit.navn + "verb"; }
  function ordMod(sit) { return typeof window !== "undefined" ? window[sit.ordMod] : undefined; }
  function setnMod(sit) { return typeof window !== "undefined" ? window[sit.setnMod] : undefined; }

  var api = { SITUASJONER: SITUASJONER, NAVN: NAVN, hent: hent, hrefPakke: hrefPakke, hrefSetn: hrefSetn, verbSpill: verbSpill, ordMod: ordMod, setnMod: setnMod };
  if (typeof window !== "undefined") window.Situasjoner = api;
  if (typeof module !== "undefined") module.exports = api;
})();
