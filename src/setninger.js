// De 59 setningene som data (se PLAN-setninger.md, avsnitt 1). Nummer 1-59 er id-en Fremgang bruker som "tall";
// temaene er sammenhengende områder, så velgTall(spill, min, maks) virker uendret.
//
// Skrivemåte i fr og fr_m:
// - {ord} markerer verbet som blir hull i spill 3 ("J'{ai} faim." -> "J'___ faim."). Ingen {} = ikke egnet som hull.
// - [alder] og [yrke] er plassholdere fra profilen hennes, fylles inn av tekst().
// - fr er hennes form (hunkjønn). fr_m finnes bare der kjønn endrer setningen; klassen velger form første gang.
// Felt: verb = etre | avoir | cest | ilya | annet. tu = setningen bruker tu (merkes "til venner og barn").
// rolle: "annen" = replikken sier servitøren eller kassereren, passer best i lytteoppgaver.
// tid: satt når setningen ikke er presens. Oversettelser: nb og en. De andre språkene kommer senere.

(function () {
  var TEMAER = [
    { id: "butikk", min: 1, maks: 8, nb: "Butikk", en: "Shop" },
    { id: "kafe", min: 9, maks: 17, nb: "Kafé", en: "Café" },
    { id: "bar", min: 18, maks: 25, nb: "Bar", en: "Bar" },
    { id: "gata", min: 26, maks: 33, nb: "På gata", en: "In the street" },
    { id: "presentere", min: 34, maks: 44, nb: "Presentere seg", en: "Introducing yourself" },
    { id: "vaeret", min: 45, maks: 51, nb: "Været", en: "Weather" },
    { id: "livet", min: 52, maks: 59, nb: "Livet", en: "Daily life" },
  ];

  var FORMER = {
    etre: ["suis", "es", "est", "sommes", "êtes", "sont", "sera"],
    avoir: ["ai", "as", "a", "avons", "avez", "ont"],
  };

  // [id, fr, fr_m, verb, nb, en, ekstra]
  var RADER = [
    [1, "C'est combien ?", null, "cest", "Hvor mye koster det?", "How much is it?"],
    [2, "C'est frais ?", null, "cest", "Er det ferskt?", "Is it fresh?"],
    [3, "{Avez}-vous des éclairs ?", null, "avoir", "Har dere eclairs?", "Do you have any éclairs?"],
    [4, "Vous n'{avez} pas la monnaie ?", null, "avoir", "Har dere ikke vekslepenger?", "Don't you have change?"],
    [5, "Il y a du beurre ?", null, "ilya", "Finnes det smør?", "Is there any butter?"],
    [6, "Tu {as} de la monnaie ?", null, "avoir", "Har du vekslepenger?", "Do you have any change?", { tu: true }],
    [7, "J'{ai} besoin d'une baguette.", null, "avoir", "Jeg trenger en baguette.", "I need a baguette."],
    [8, "Ils {ont} encore du pain ?", null, "avoir", "Har de fortsatt brød?", "Do they still have bread?"],
    [9, "J'{ai} faim.", null, "avoir", "Jeg er sulten.", "I am hungry."],
    [10, "Tu {as} soif ?", null, "avoir", "Er du tørst?", "Are you thirsty?", { tu: true }],
    [11, "Vous {avez} une table pour deux ?", null, "avoir", "Har dere et bord til to?", "Do you have a table for two?"],
    [12, "Nous {sommes} deux.", null, "etre", "Vi er to.", "There are two of us."],
    [13, "Il {a} un café, elle {a} un thé.", null, "avoir", "Han har en kaffe, hun har en te.", "He has a coffee, she has a tea."],
    [14, "Vous {avez} la carte ?", null, "avoir", "Har dere menyen?", "Do you have the menu?"],
    [15, "Je {suis} allergique aux noix.", null, "etre", "Jeg er allergisk mot nøtter.", "I am allergic to nuts."],
    [16, "C'est délicieux !", null, "cest", "Det er deilig!", "It is delicious!"],
    [17, "Nous {avons} réservé.", null, "avoir", "Vi har reservert.", "We have booked.", { tid: "fortid" }],
    [18, "Vous {êtes} combien ?", null, "etre", "Hvor mange er dere?", "How many are you?", { rolle: "annen" }],
    [19, "Nous {sommes} quatre.", null, "etre", "Vi er fire.", "There are four of us."],
    [20, "Je {suis} prête à commander.", "Je {suis} prêt à commander.", "etre", "Jeg er klar til å bestille.", "I am ready to order."],
    [21, "Vous {avez} de la bière sans alcool ?", null, "avoir", "Har dere alkoholfritt øl?", "Do you have alcohol-free beer?"],
    [22, "Elle {est} avec moi.", null, "etre", "Hun er sammen med meg.", "She is with me."],
    [23, "Ils {sont} déjà là.", null, "etre", "De er allerede her.", "They are already here."],
    [24, "C'est tout, merci.", null, "cest", "Det er alt, takk.", "That's all, thank you."],
    [25, "Ce {sera} tout, merci.", null, "etre", "Det blir alt, takk.", "That will be all, thank you.", { rolle: "annen", tid: "futur" }],
    [26, "Ça va ?", null, "annet", "Hvordan går det?", "How are you?"],
    [27, "Tu {es} d'ici ?", null, "etre", "Er du herfra?", "Are you from here?", { tu: true }],
    [28, "Vous {êtes} d'ici ?", null, "etre", "Er dere herfra? (høflig form)", "Are you from here? (polite form)"],
    [29, "Tu {as} le temps ?", null, "avoir", "Har du tid?", "Do you have time?", { tu: true }],
    [30, "Je {suis} pressée.", "Je {suis} pressé.", "etre", "Jeg har det travelt.", "I am in a hurry."],
    [31, "Vous {avez} l'heure ?", null, "avoir", "Vet dere hva klokka er?", "Do you have the time?"],
    [32, "Je {suis} perdue.", "Je {suis} perdu.", "etre", "Jeg har gått meg bort.", "I am lost."],
    [33, "Où {est} l'arrêt de tram ?", null, "etre", "Hvor er trikkestoppet?", "Where is the tram stop?"],
    [34, "Je {suis} norvégienne.", "Je {suis} norvégien.", "etre", "Jeg er norsk.", "I am Norwegian."],
    [35, "Je {suis} [yrke].", null, "etre", "Jeg er [yrke].", "I am a [yrke].", { profil: ["yrke"] }],
    [36, "J'{ai} [alder] ans.", null, "avoir", "Jeg er [alder] år.", "I am [alder] years old.", { profil: ["alder"] }],
    [37, "J'{ai} deux enfants.", null, "avoir", "Jeg har to barn.", "I have two children."],
    [38, "Il {a} dix ans.", null, "avoir", "Han er ti år.", "He is ten years old."],
    [39, "Tu {as} des frères et sœurs ?", null, "avoir", "Har du søsken?", "Do you have brothers and sisters?", { tu: true }],
    [40, "Nous {sommes} nouveaux ici.", null, "etre", "Vi er nye her.", "We are new here."],
    [41, "Je {suis} nouvelle à Bruxelles.", "Je {suis} nouveau à Bruxelles.", "etre", "Jeg er ny i Brussel.", "I am new in Brussels."],
    [42, "Nous {avons} un appartement à Ixelles.", null, "avoir", "Vi har en leilighet i Ixelles.", "We have an apartment in Ixelles."],
    [43, "Vous {êtes} d'où ?", null, "etre", "Hvor kommer dere fra?", "Where are you from?"],
    [44, "Ils {sont} à l'école.", null, "etre", "De er på skolen.", "They are at school."],
    [45, "J'{ai} froid.", null, "avoir", "Jeg fryser.", "I am cold."],
    [46, "Tu {as} froid ?", null, "avoir", "Fryser du?", "Are you cold?", { tu: true }],
    [47, "Vous {avez} chaud ?", null, "avoir", "Er det varmt for dere?", "Are you hot?"],
    [48, "Le ciel {est} clair.", null, "etre", "Himmelen er klar.", "The sky is clear."],
    [49, "Il y a du vent.", null, "ilya", "Det blåser.", "It is windy."],
    [50, "Le temps {est} maussade.", null, "etre", "Været er trist.", "The weather is dreary."],
    [51, "On {a} de la chance.", null, "avoir", "Vi er heldige.", "We are lucky."],
    [52, "Je {suis} fatiguée.", "Je {suis} fatigué.", "etre", "Jeg er sliten.", "I am tired."],
    [53, "Nous {sommes} contents.", null, "etre", "Vi er fornøyde.", "We are happy."],
    [54, "Vous {êtes} ici depuis longtemps ?", null, "etre", "Har dere vært her lenge?", "Have you been here long?"],
    [55, "Ils {sont} en retard.", null, "etre", "De er forsinket.", "They are late."],
    [56, "J'{ai} un rendez-vous.", null, "avoir", "Jeg har en avtale.", "I have an appointment."],
    [57, "Il {a} mal à la tête.", null, "avoir", "Han har vondt i hodet.", "He has a headache."],
    [58, "Tu {es} libre demain ?", null, "etre", "Er du ledig i morgen?", "Are you free tomorrow?", { tu: true }],
    [59, "Je {suis} d'accord.", null, "etre", "Jeg er enig.", "I agree."],
  ];

  function temaFor(id) {
    for (var i = 0; i < TEMAER.length; i++) if (id >= TEMAER[i].min && id <= TEMAER[i].maks) return TEMAER[i].id;
    return null;
  }

  var LISTE = RADER.map(function (r) {
    var s = { id: r[0], tema: temaFor(r[0]), fr: r[1], fr_m: r[2], verb: r[3], nb: r[4], en: r[5] };
    var ekstra = r[6] || {};
    for (var k in ekstra) s[k] = ekstra[k];
    return s;
  });


  // Hvilken kort regel som vises etter svaret i spill 3.
  var REGEL = {};
  [[7, 9, 10, 36, 38, 45, 46, 47, 51, 57], [3, 4, 6, 8, 11, 13, 14, 21, 29, 31, 37, 39, 42, 56], [17],
   [15, 20, 25, 30, 32, 48, 50, 52, 53, 55, 58, 59], [12, 18, 19, 22, 23, 27, 28, 33, 34, 35, 40, 41, 43, 44, 54]]
    .forEach(function (ider, i) {
      ider.forEach(function (id) { REGEL[id] = ["avoir_foelelse", "avoir_eie", "avoir_hjelp", "etre_tilstand", "etre_hvem_hvor"][i]; });
    });
  LISTE.forEach(function (s) { if (REGEL[s.id]) s.regel = REGEL[s.id]; });

  // Et sett setninger med fast rekkefølge: de uten profil-plassholdere først (POOL), så de med (PROFILPOOL, tas bare med når
  // profilen er fylt ut). Fremgang lagres på plassen i settet, ikke på id. Settet er derfor fast: nye setninger legges bakerst.
  function lagSett(egnet) {
    var pool = LISTE.filter(function (s) { return egnet(s) && !s.profil; });
    var profilpool = LISTE.filter(function (s) { return egnet(s) && s.profil; });
    return {
      POOL: pool,
      PROFILPOOL: profilpool,
      fraNokkel: function (k) { return pool[k - 1] || profilpool[k - pool.length - 1] || null; },
      // Antall plasser: POOL, pluss profilsetningene når profilen er ferdig.
      antallNokler: function (medProfil) { return pool.length + (medProfil ? profilpool.length : 0); },
      // Området temaet har i POOL, som { min, maks }, eller null hvis temaet ikke har setninger der.
      temaOmrade: function (temaId) {
        var min = 0, maks = 0;
        pool.forEach(function (s, i) {
          if (s.tema !== temaId) return;
          if (!min) min = i + 1;
          maks = i + 1;
        });
        return min ? { min: min, maks: maks } : null;
      }
    };
  }

  // Spill 3 (fyll inn verbet): setninger med être eller avoir som hull. Plassene 1-50, profilsetningene får 51 og 52.
  var SPILL3 = lagSett(function (s) { return s.verb === "etre" || s.verb === "avoir"; });
  var POOL = SPILL3.POOL;
  var PROFILPOOL = SPILL3.PROFILPOOL;
  var fraNokkel = SPILL3.fraNokkel;
  var antallNokler = SPILL3.antallNokler;
  var temaOmrade = SPILL3.temaOmrade;

  // Spill 4 og senere: alle setningene. Plass 1-57 uten profil, profilsetningene (35 og 36) får 58 og 59.
  var ALLE = lagSett(function () { return true; });

  // Hvilke av être og avoir et område (min-maks i POOL) har setninger for.
  function verbIOmrade(min, maks) {
    return ["etre", "avoir"].filter(function (v) {
      return POOL.slice(min - 1, maks).some(function (s) { return s.verb === v; });
    });
  }

  // Kort runde per verb først, så blanding. nr = spørsmålets plass i økta (0, 1, ...), verber = verbene i rekkefølge.
  // Gir verbet spørsmålet skal ha, eller null når blandingen har begynt (eller det bare er ett verb).
  function verbForSporsmal(nr, perVerb, verber) {
    if (verber.length < 2) return null;
    var i = Math.floor(nr / perVerb);
    return i < verber.length ? verber[i] : null;
  }

  function hent(id) {
    for (var i = 0; i < LISTE.length; i++) if (LISTE[i].id === id) return LISTE[i];
    return null;
  }

  // Malen for riktig kjønn: "m" gir fr_m der den finnes, ellers fr.
  function mal(s, kjonn) {
    return kjonn === "m" && s.fr_m ? s.fr_m : s.fr;
  }

  function fyllProfil(tekst, profil) {
    return tekst.replace(/\[(\w+)\]/g, function (treff, navn) {
      return profil && profil[navn] ? profil[navn] : treff;
    });
  }

  // Setningen slik den skal vises og sjekkes mot, uten {}. Ufylte plassholdere blir stående som [alder].
  function tekst(s, kjonn, profil) {
    return fyllProfil(mal(s, kjonn).replace(/[{}]/g, ""), profil);
  }

  // Setningen med {verb} markert og profilen fylt inn. Brukes av spill 4 til å lage trinn (src/trinn.js).
  function merket(s, kjonn, profil) {
    return fyllProfil(mal(s, kjonn), profil);
  }

  // Hull-versjon til spill 3: { tekst: "J'___ faim.", svar: ["ai"] }, eller null uten {}.
  function luke(s, kjonn, profil) {
    var svar = [];
    var m = mal(s, kjonn);
    var hull = m.replace(/\{([^}]+)\}/g, function (treff, ord) {
      svar.push(ord);
      return "___";
    });
    if (!svar.length) return null;
    return { tekst: fyllProfil(hull, profil), svar: svar };
  }

  // Oversettelse på ønsket språk, engelsk hvis språket ikke finnes ennå.
  function oversettelse(s, sprak, profil) {
    return fyllProfil(s[sprak] || s.en, profil);
  }

  var api = { ALLE: ALLE, POOL: POOL, PROFILPOOL: PROFILPOOL, antallNokler: antallNokler, fraNokkel: fraNokkel, temaOmrade: temaOmrade, verbIOmrade: verbIOmrade, verbForSporsmal: verbForSporsmal, LISTE: LISTE, TEMAER: TEMAER, FORMER: FORMER, hent: hent, merket: merket, tekst: tekst, luke: luke, oversettelse: oversettelse };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.Setninger = api;
})();
