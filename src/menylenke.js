// «Til menyen» øverst på spillsidene, så hun alltid kommer tilbake til hovedsiden (index.html).
// Legges inn sist på siden. Har siden allerede en lenke til index.html (spill 3 til 6), gjør dette ingenting.
// Spill 8, 9, 10 og 11 har bare lenke til pakken sin, og tall.html og spill2.html har ingen.

(function () {
  if (document.querySelector('a[href="index.html"]')) return;
  var nb = window.Tekster && window.Tekster.kode && window.Tekster.kode() === "nb";
  var p = document.createElement("p");
  p.className = "meny-topp";
  p.style.cssText = "margin:0 0 .5rem;font-size:.9rem";
  var a = document.createElement("a");
  a.href = "index.html";
  a.textContent = nb ? "← Til menyen" : "← Back to the menu";
  p.appendChild(a);
  document.body.insertBefore(p, document.body.firstChild);
})();
