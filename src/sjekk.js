// Sjekk av skrevne svar (spill 3-6): normaliserer og sammenligner ord for ord.
//
// Godtas uten å telle feil: store og små bokstaver, ekstra mellomrom (også hardt mellomrom før ?), rett og
// krøllete apostrof, og tegnsetting (. , ? ! ; : « » "). Bindestrek og apostrof må stå riktig.
// Aksentfeil (tres for très, soeurs for sœurs): aksent = "merknad" godtar svaret med en merknad,
// aksent = "feil" teller det som feil. Standard er "merknad".
//
// sjekk(svar, fasit, valg)  ->  { riktig, aksentfeil, ord, feilOrd, aksentOrd, mangler }
//   ord: svaret delt i ord (normalisert), feilOrd/aksentOrd: indekser i ord, mangler: antall ord i fasiten
//   som ikke finnes i svaret.
// sjekkFlere(svar, fasiter, valg) tar flere godkjente svar og gir resultatet for den som passer best.

(function () {
  function normaliser(tekst) {
    return String(tekst == null ? "" : tekst)
      .normalize("NFC")
      .toLowerCase()
      .replace(/[‘’ʼ`´]/g, "'")
      .replace(/[‐-―]/g, "-")
      .replace(/[.,?!;:«»"“”]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  // Uten aksenter og ligaturer, for å se om to ord bare skiller seg på aksent.
  function bretteUt(ord) {
    return ord.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/œ/g, "oe").replace(/æ/g, "ae");
  }

  function ordListe(tekst) {
    var n = normaliser(tekst);
    return n ? n.split(" ") : [];
  }

  // Lengste felles delfølge (på brettede ord): par av indekser (svar, fasit) som hører sammen.
  function par(a, b) {
    var n = a.length, m = b.length, t = [], i, j;
    for (i = 0; i <= n; i++) { t.push([]); for (j = 0; j <= m; j++) t[i].push(0); }
    for (i = n - 1; i >= 0; i--) {
      for (j = m - 1; j >= 0; j--) {
        t[i][j] = a[i] === b[j] ? t[i + 1][j + 1] + 1 : Math.max(t[i + 1][j], t[i][j + 1]);
      }
    }
    var ut = [];
    i = 0; j = 0;
    while (i < n && j < m) {
      if (a[i] === b[j]) { ut.push([i, j]); i++; j++; }
      else if (t[i + 1][j] >= t[i][j + 1]) i++;
      else j++;
    }
    return ut;
  }

  function sjekk(svar, fasit, valg) {
    var aksentSomFeil = valg && valg.aksent === "feil";
    var ord = ordListe(svar);
    var fas = ordListe(fasit);
    var hoer = par(ord.map(bretteUt), fas.map(bretteUt));
    var i, tilhoerer = {}, feilOrd = [], aksentOrd = [];
    hoer.forEach(function (p) {
      tilhoerer[p[0]] = true;
      if (ord[p[0]] !== fas[p[1]]) aksentOrd.push(p[0]);
    });
    for (i = 0; i < ord.length; i++) if (!tilhoerer[i]) feilOrd.push(i);
    var mangler = fas.length - hoer.length;
    var aksentfeil = aksentOrd.length > 0;
    var riktig = ord.length > 0 && feilOrd.length === 0 && mangler === 0 && !(aksentfeil && aksentSomFeil);
    return { riktig: riktig, aksentfeil: aksentfeil, ord: ord, feilOrd: feilOrd, aksentOrd: aksentOrd, mangler: mangler };
  }

  function feilTall(r) { return r.feilOrd.length + r.mangler + r.aksentOrd.length; }

  // Beste treff blant flere godkjente svar: et riktig svar vinner, ellers det med færrest feil.
  function sjekkFlere(svar, fasiter, valg) {
    var beste = null, bestIndeks = -1;
    fasiter.forEach(function (f, i) {
      var r = sjekk(svar, f, valg);
      if (!beste || (r.riktig && !beste.riktig) || (r.riktig === beste.riktig && feilTall(r) < feilTall(beste))) {
        beste = r;
        bestIndeks = i;
      }
    });
    if (beste) beste.fasitIndeks = bestIndeks;
    return beste;
  }

  var api = { normaliser: normaliser, sjekk: sjekk, sjekkFlere: sjekkFlere };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.Sjekk = api;
})();
