// Trinn i spill 4: hvor mye av setningen hun skriver selv. Trinnet følger boksen setningen står i (1-5).
//   1: ett ord (det siste innholdsordet som ikke er verbet)
//   2: verbet og det ordet
//   3: verbet og siste halvdel av setningen
//   4: hele setningen, med første bokstav i hvert ord som hint
//   5: hele setningen, uten hint
// Inn: setningen med {verb} markert (Setninger.merket), ut: deler som enten er gitt tekst eller et hull med fasit.
// Hull som står inntil hverandre (bare mellomrom, apostrof eller bindestrek imellom) slås sammen til ett.

(function () {
  var ANTALL = 5;

  function tokens(merket) {
    var ut = [];
    merket.split(/(\{[^}]*\})/).forEach(function (del) {
      if (del.charAt(0) === "{") {
        ut.push({ t: del.slice(1, -1), ord: true, verb: true });
        return;
      }
      var re = /([\p{L}]+(?:-[\p{L}]+)*)|(\s+)|([^\p{L}\s]+)/gu;
      var m;
      while ((m = re.exec(del))) ut.push({ t: m[0], ord: !!m[1], verb: false });
    });
    ut.forEach(function (k) { k.kort = k.ord && k.t.length < 2; });
    return ut;
  }

  function ordIndekser(tk, filter) {
    var r = [];
    tk.forEach(function (k, i) { if (k.ord && filter(k)) r.push(i); });
    return r;
  }

  // Hvilke ord (indekser i tokens) som blir hull på trinnet.
  function skjulte(tk, trinn) {
    var alle = ordIndekser(tk, function (k) { return !k.kort; });
    var verb = ordIndekser(tk, function (k) { return k.verb; });
    if (!verb.length && alle.length) verb = [alle[0]];
    var ekstraKand = alle.filter(function (i) { return verb.indexOf(i) < 0; });
    var ekstra = ekstraKand.length ? ekstraKand[ekstraKand.length - 1] : null;
    var t1 = ekstra !== null ? [ekstra] : verb.slice(0, 1);
    var t2 = ekstra !== null ? verb.concat([ekstra]) : verb.slice();
    if (trinn === 1) return t1;
    if (trinn === 2) return t2;
    // Trinn 3: siste halvdel pluss verbet, og alltid minst ett ord mer enn trinn 2 (så langt det er ord igjen).
    var sett = {};
    alle.slice(Math.floor(alle.length / 2)).forEach(function (i) { sett[i] = true; });
    verb.forEach(function (i) { sett[i] = true; });
    function hent() { return Object.keys(sett).map(Number).sort(function (a, b) { return a - b; }); }
    var liste = hent();
    for (var j = alle.length - 1; j >= 0 && liste.length <= t2.length && liste.length < alle.length; j--) {
      if (!sett[alle[j]]) { sett[alle[j]] = true; liste = hent(); }
    }
    return liste;
  }

  function hintFor(tk) {
    return tk.map(function (k) {
      if (!k.ord) return k.t;
      return k.t.charAt(0) + k.t.slice(1).replace(/[^-]/g, "_");
    }).join("");
  }

  function lag(merket, trinn) {
    trinn = Math.min(Math.max(Math.floor(Number(trinn)) || 1, 1), ANTALL);
    var tk = tokens(merket);
    var fasit = tk.map(function (k) { return k.t; }).join("");
    if (trinn >= 4) {
      return { trinn: trinn, fasit: fasit, deler: [{ hull: fasit }], hint: trinn === 4 ? hintFor(tk) : null };
    }
    var skjult = {};
    skjulte(tk, trinn).forEach(function (i) { skjult[i] = true; });
    var deler = [];
    var gitt = "";
    function tomGitt() { if (gitt) { deler.push({ gitt: gitt }); gitt = ""; } }
    var i = 0;
    while (i < tk.length) {
      if (!skjult[i]) { gitt += tk[i].t; i++; continue; }
      // Utvid over mellomrom, apostrof og bindestrek hvis neste ord også er skjult.
      var slutt = i;
      var j = i + 1;
      while (j < tk.length && !tk[j].ord && /^[\s'’-]*$/.test(tk[j].t)) j++;
      while (j < tk.length && skjult[j]) {
        slutt = j;
        j++;
        while (j < tk.length && !tk[j].ord && /^[\s'’-]*$/.test(tk[j].t)) j++;
      }
      tomGitt();
      deler.push({ hull: tk.slice(i, slutt + 1).map(function (k) { return k.t; }).join("") });
      i = slutt + 1;
    }
    tomGitt();
    return { trinn: trinn, fasit: fasit, deler: deler, hint: null };
  }

  var api = { ANTALL: ANTALL, lag: lag };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.Trinn = api;
})();
