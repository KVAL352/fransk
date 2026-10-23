// Felles stemmekode for spillene: spiller opp ferdig innspilt lyd (lyd/, Lingua Libre-opptak av Lepticed7, CC BY-SA 4.0),
// og faller tilbake på nettleserens franske stemme hvis lydfilene mangler.
// Nettleserstemmen: foretrekker fr-BE (Charline), så fr-FR, så hvilken som helst fransk stemme.

(function () {
  var stemme = null;
  var lydKlar = false;
  var info = null;
  var spiller = null;

  function norm(lang) { return lang.replace("_", "-").toLowerCase(); }

  // Filnavn for et tallord: uten aksenter, bokstaver og tall skilt med bindestrek ("zéro" -> "zero", "septante et un" -> "septante-et-un").
  function lydNavn(tekst) {
    return tekst.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function velgStemme() {
    var fr = window.speechSynthesis.getVoices().filter(function (s) {
      return norm(s.lang).indexOf("fr") === 0;
    });
    function finn(kode) {
      return fr.filter(function (s) { return norm(s.lang) === kode; })[0];
    }
    stemme = finn("fr-be") || finn("fr-fr") || fr[0] || null;
  }

  function oppdaterInfo() {
    if (!info) return;
    var harTale = "speechSynthesis" in window;
    var tekst;
    if (lydKlar) tekst = window.Tekster.t("stemme.valgt", { navn: "Lingua Libre (Lepticed7 m.fl.; CC BY-SA 4.0, CC BY, CC0)" });
    else if (!harTale) tekst = window.Tekster.t("stemme.ingenTale");
    else if (stemme) tekst = window.Tekster.t("stemme.valgt", { navn: stemme.name + " (" + stemme.lang + ")" });
    else tekst = window.Tekster.t("stemme.ingen");
    info.textContent = tekst;
    if (lydKlar) {
      var lenke = document.createElement("a");
      lenke.href = "kreditt.html";
      lenke.textContent = "Credits";
      info.appendChild(document.createTextNode(" · "));
      info.appendChild(lenke);
    }
    info.classList.toggle("feil", !lydKlar && (!harTale || !stemme));
  }

  // Sjekker at lydfilene finnes (ett klipp), så vi vet om vi kan bruke dem.
  function proveLyd() {
    var a = new Audio("lyd/" + lydNavn("trois") + ".mp3");
    a.addEventListener("loadedmetadata", function () { lydKlar = true; oppdaterInfo(); });
    a.load();
  }

  function init(infoEl) {
    info = infoEl;
    info.textContent = window.Tekster.t("stemme.leter");
    if ("speechSynthesis" in window) {
      window.speechSynthesis.addEventListener("voiceschanged", function () { velgStemme(); oppdaterInfo(); });
      velgStemme();
    }
    oppdaterInfo();
    proveLyd();
  }

  function tale(tekst) {
    // Uten fransk stemme leser nettleseren opp på standardspråket (engelsk), og da blir uttalen feil. Bedre med stillhet.
    if (!("speechSynthesis" in window) || !stemme) return;
    var u = new SpeechSynthesisUtterance(tekst);
    u.voice = stemme;
    u.lang = stemme.lang;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }

  function si(tekst) {
    if (!lydKlar) { tale(tekst); return; }
    // Ett felles lydelement, så en ny avspilling avbryter den forrige.
    if (!spiller) spiller = new Audio();
    spiller.onerror = function () { tale(tekst); };
    spiller.src = "lyd/" + lydNavn(tekst) + ".mp3";
    var p = spiller.play();
    if (p && p.catch) p.catch(function () { /* feil meldes via onerror; blokkert autoplay gir stillhet */ });
  }

  if (typeof window !== "undefined") window.Stemme = { init: init, si: si };
  if (typeof module !== "undefined") module.exports = { lydNavn: lydNavn };
})();
