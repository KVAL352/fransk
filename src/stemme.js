// Felles stemmekode for spillene: velger fransk stemme og leser opp tekst.
// Foretrekker fr-BE (Charline), så fr-FR, så hvilken som helst fransk stemme.

(function () {
  var stemme = null;

  function norm(lang) { return lang.replace("_", "-").toLowerCase(); }

  function velgStemme(infoEl) {
    var fr = window.speechSynthesis.getVoices().filter(function (s) {
      return norm(s.lang).indexOf("fr") === 0;
    });
    function finn(kode) {
      return fr.filter(function (s) { return norm(s.lang) === kode; })[0];
    }
    stemme = finn("fr-be") || finn("fr-fr") || fr[0] || null;
    infoEl.textContent = stemme
      ? window.Tekster.t("stemme.valgt", { navn: stemme.name + " (" + stemme.lang + ")" })
      : window.Tekster.t("stemme.ingen");
    infoEl.classList.toggle("feil", !stemme);
  }

  function init(infoEl) {
    infoEl.textContent = window.Tekster.t("stemme.leter");
    if ("speechSynthesis" in window) {
      window.speechSynthesis.addEventListener("voiceschanged", function () { velgStemme(infoEl); });
      velgStemme(infoEl);
    } else {
      infoEl.textContent = window.Tekster.t("stemme.ingenTale");
      infoEl.classList.add("feil");
    }
  }

  function si(tekst) {
    // Uten fransk stemme leser nettleseren opp på standardspråket (engelsk), og da blir uttalen feil. Bedre med stillhet.
    if (!("speechSynthesis" in window) || !stemme) return;
    var u = new SpeechSynthesisUtterance(tekst);
    u.voice = stemme;
    u.lang = stemme.lang;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }

  window.Stemme = { init: init, si: si };
})();
