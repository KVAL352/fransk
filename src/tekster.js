// All synlig tekst i spillene, bortsett fra selve fransken. Ett språk per nøkkel.
// Engelsk er standard og reserve: mangler en nøkkel i et språk, brukes den engelske.
// Valget lagres i nettleseren. Språk med utkast: true viser en melding om at oversettelsen ikke er lest av en som kan språket.
// Plassholdere skrives {navn} og fylles inn av t(nokkel, { navn: ... }).

(function () {
  var NOKKEL = "fransk.sprak";
  var STANDARD = "en";

  var SPRAAK = [
    { kode: "en", navn: "English", retning: "ltr" },
    { kode: "nb", navn: "Norsk", retning: "ltr" },
    { kode: "ar", navn: "العربية", retning: "rtl", utkast: true },
    { kode: "ro", navn: "Română", retning: "ltr", utkast: true },
    { kode: "ru", navn: "Русский", retning: "ltr", utkast: true },
    { kode: "sq", navn: "Shqip", retning: "ltr", utkast: true }
  ];

  var TEKST = {
    en: {
      "side.tittel1": "French: listen and type the digits",
      "side.tittel2": "French: write the number as words",
      "h1.spill1": "Listen and type the digits",
      "h1.spill2": "Write the number as words",
      "intro.spill1": "Listen to the number and type it with digits.",
      "intro.spill2": "Look at the number and write it in French. Capital letters and hyphens versus spaces do not matter.",
      "knapp.start": "Start",
      "knapp.hor": "Hear the number",
      "knapp.horOrd": "Hear the word",
      "knapp.horIgjen": "Hear the word again",
      "knapp.sjekk": "Check",
      "knapp.neste": "Next",
      "knapp.nullstill": "Reset progress",
      "etikett.tall1": "The number you heard:",
      "etikett.tall2": "The number as words:",
      "lenke.spill2": "Game 2: write the number as words",
      "lenke.spill1": "Game 1: listen and type the digits",
      "bekreft.nullstill": "Reset all progress in this game?",
      "svar.riktig": "Correct: {tall} = {ord}",
      "svar.feil1": "You typed {svar}. Correct answer: {tall} = {ord}",
      "svar.feil2": "You typed “{svar}”. Correct answer: {tall} = {ord}",
      "telling": "{riktige} correct out of {forsok} this time",
      "sprak.etikett": "Language",
      "sprak.utkast": "This translation is a draft and has not been checked by a native speaker.",

      "stemme.leter": "Looking for a French voice...",
      "stemme.valgt": "Voice: {navn}",
      "stemme.ingen": "No French voice was found in this browser, so there will be no sound. Try Chrome or Edge, or add French as a language in Windows.",
      "stemme.ingenTale": "This browser has no speech synthesis. Try Chrome or Edge.",

      "nivaa.gruppe": "Level",
      "nivaa.knapp": "Level {n}: {min} to {maks}",
      "nivaa.last": " (locked)",
      "nivaa.opnesSpill1": "Opens when level {n} is finished in game 1",
      "nivaa.opnesSpill2": "Opens when level {n} is finished in game 2",
      "nivaa.videre1": "Go on to game 2, level {n}",
      "nivaa.videre2": "Go on to game 1, level {n}",

      "fv.etikett": "Progress",
      "fv.linje": "Progress in the game",
      "fv.laert": "Learned",
      "fv.laertKort": "learned",
      "fv.alleLaert": "All the numbers are learned",
      "fv.igjen": "at least {n} correct answers to go",
      "fv.rute.laert": "{tall}: learned",
      "fv.rute.boks": "{tall}: box {boks} of 5",
      "fv.rute.rekke": ", {rekke} of {krav} in a row",
      "fv.rekke": "{rekke} of {krav}",
      "fv.m25": "A quarter of the way.",
      "fv.m50": "Halfway.",
      "fv.m75": "Three quarters. Almost there.",
      "fv.milepael": "{melding} {p} % of all the numbers.",
      "fv.erLaert": "{tall} is learned!",

      "feiring.terpe": "Keep practising",
      "feiring.tittel1": "Hooray! You know the numbers from {min} to {maks}",
      "feiring.tittel2": "Hooray! You know the numbers from {min} to {maks} as words",
      "feiring.tekst1": "All the numbers are learned in this game. You can keep practising, or move on to the next exercise.",
      "feiring.tekst2": "All the numbers are learned in this game. You can keep practising, or move on to the next step.",
      "feiring.tekst2Siste": "All the numbers are learned in this game. You can keep practising. That was the last level."
    },

    nb: {
      "side.tittel1": "Fransk: lytt og skriv sifrene",
      "side.tittel2": "Fransk: skriv tallet som ord",
      "h1.spill1": "Lytt og skriv sifrene",
      "h1.spill2": "Skriv tallet som ord",
      "intro.spill1": "Lytt til tallet og skriv det med sifre.",
      "intro.spill2": "Se tallet og skriv det på fransk. Store og små bokstaver og bindestrek mot mellomrom spiller ingen rolle.",
      "knapp.start": "Start",
      "knapp.hor": "Hør tallet",
      "knapp.horOrd": "Hør ordet",
      "knapp.horIgjen": "Hør ordet igjen",
      "knapp.sjekk": "Sjekk",
      "knapp.neste": "Neste",
      "knapp.nullstill": "Nullstill fremgang",
      "etikett.tall1": "Tallet du hørte:",
      "etikett.tall2": "Tallet som ord:",
      "lenke.spill2": "Spill 2: skriv tallet som ord",
      "lenke.spill1": "Spill 1: lytt og skriv sifrene",
      "bekreft.nullstill": "Nullstille all fremgang i dette spillet?",
      "svar.riktig": "Riktig: {tall} = {ord}",
      "svar.feil1": "Du skrev {svar}. Riktig svar: {tall} = {ord}",
      "svar.feil2": "Du skrev «{svar}». Riktig svar: {tall} = {ord}",
      "telling": "{riktige} riktige av {forsok} denne gangen",
      "sprak.etikett": "Språk",
      "sprak.utkast": "Denne oversettelsen er et utkast og er ikke lest av en som kan språket.",

      "stemme.leter": "Leter etter fransk stemme...",
      "stemme.valgt": "Stemme: {navn}",
      "stemme.ingen": "Fant ingen fransk stemme i denne nettleseren, så det blir ingen lyd. Prøv Chrome eller Edge, eller legg til fransk som språk i Windows.",
      "stemme.ingenTale": "Denne nettleseren har ikke taleopplæsing. Prøv Chrome eller Edge.",

      "nivaa.gruppe": "Nivå",
      "nivaa.knapp": "Nivå {n}: {min} til {maks}",
      "nivaa.last": " (låst)",
      "nivaa.opnesSpill1": "Åpnes når nivå {n} er ferdig i spill 1",
      "nivaa.opnesSpill2": "Åpnes når nivå {n} er ferdig i spill 2",
      "nivaa.videre1": "Gå videre til spill 2, nivå {n}",
      "nivaa.videre2": "Gå videre til spill 1, nivå {n}",

      "fv.etikett": "Fremgang",
      "fv.linje": "Fremgang i spillet",
      "fv.laert": "Lært",
      "fv.laertKort": "lært",
      "fv.alleLaert": "Alle tallene er lært",
      "fv.igjen": "minst {n} riktige svar igjen",
      "fv.rute.laert": "{tall}: lært",
      "fv.rute.boks": "{tall}: boks {boks} av 5",
      "fv.rute.rekke": ", {rekke} av {krav} på rad",
      "fv.rekke": "{rekke} av {krav}",
      "fv.m25": "En firedel av veien.",
      "fv.m50": "Halvveis.",
      "fv.m75": "Tre firedeler. Snart i mål.",
      "fv.milepael": "{melding} {p} % av alle tallene.",
      "fv.erLaert": "{tall} er lært!",

      "feiring.terpe": "Fortsett å terpe",
      "feiring.tittel1": "Hurra! Du kan tallene fra {min} til {maks}",
      "feiring.tittel2": "Hurra! Du kan tallene fra {min} til {maks} som ord",
      "feiring.tekst1": "Alle tallene er utlært i dette spillet. Du kan terpe videre, eller gå videre til neste oppgave.",
      "feiring.tekst2": "Alle tallene er utlært i dette spillet. Du kan terpe videre, eller gå videre til neste steg.",
      "feiring.tekst2Siste": "Alle tallene er utlært i dette spillet. Du kan terpe videre. Det var siste nivå."
    },

    ar: {
      "side.tittel1": "الفرنسية: استمع واكتب الأرقام",
      "side.tittel2": "الفرنسية: اكتب العدد بالحروف",
      "h1.spill1": "استمع واكتب الأرقام",
      "h1.spill2": "اكتب العدد بالحروف",
      "intro.spill1": "استمع إلى العدد واكتبه بالأرقام.",
      "intro.spill2": "انظر إلى العدد واكتبه بالفرنسية. لا يهم إن كانت الأحرف كبيرة أو صغيرة، ولا إن كان الفاصل شرطة أو مسافة.",
      "knapp.start": "ابدأ",
      "knapp.hor": "استمع إلى العدد",
      "knapp.horOrd": "استمع إلى الكلمة",
      "knapp.horIgjen": "استمع إلى الكلمة مرة أخرى",
      "knapp.sjekk": "تحقق",
      "knapp.neste": "التالي",
      "knapp.nullstill": "إعادة ضبط التقدّم",
      "etikett.tall1": "العدد الذي سمعته:",
      "etikett.tall2": "العدد بالحروف:",
      "lenke.spill2": "اللعبة 2: اكتب العدد بالحروف",
      "lenke.spill1": "اللعبة 1: استمع واكتب الأرقام",
      "bekreft.nullstill": "هل تريد إعادة ضبط كل التقدّم في هذه اللعبة؟",
      "svar.riktig": "صحيح: {tall} = {ord}",
      "svar.feil1": "كتبتَ {svar}. الجواب الصحيح: {tall} = {ord}",
      "svar.feil2": "كتبتَ «{svar}». الجواب الصحيح: {tall} = {ord}",
      "telling": "الإجابات الصحيحة هذه المرة: {riktige} من {forsok}",
      "sprak.etikett": "اللغة",
      "sprak.utkast": "هذه الترجمة مسودة ولم يراجعها متحدث أصلي.",
      "stemme.leter": "جارٍ البحث عن صوت فرنسي...",
      "stemme.valgt": "الصوت: {navn}",
      "stemme.ingen": "لم يُعثر على صوت فرنسي في هذا المتصفح، لذلك لن يكون هناك صوت. جرّب Chrome أو Edge، أو أضف الفرنسية كلغة في Windows.",
      "stemme.ingenTale": "هذا المتصفح لا يدعم تحويل النص إلى كلام. جرّب Chrome أو Edge.",
      "nivaa.gruppe": "المستوى",
      "nivaa.knapp": "المستوى {n}: من {min} إلى {maks}",
      "nivaa.last": " (مقفل)",
      "nivaa.opnesSpill1": "يُفتح عند إنهاء المستوى {n} في اللعبة 1",
      "nivaa.opnesSpill2": "يُفتح عند إنهاء المستوى {n} في اللعبة 2",
      "nivaa.videre1": "انتقل إلى اللعبة 2، المستوى {n}",
      "nivaa.videre2": "انتقل إلى اللعبة 1، المستوى {n}",
      "fv.etikett": "التقدّم",
      "fv.linje": "التقدّم في اللعبة",
      "fv.laert": "تم تعلّمها",
      "fv.laertKort": "تم تعلّمه",
      "fv.alleLaert": "تم تعلّم كل الأعداد",
      "fv.igjen": "الإجابات الصحيحة المتبقية على الأقل: {n}",
      "fv.rute.laert": "{tall}: تم تعلّمه",
      "fv.rute.boks": "{tall}: الصندوق {boks} من 5",
      "fv.rute.rekke": "، {rekke} من {krav} على التوالي",
      "fv.rekke": "{rekke} من {krav}",
      "fv.m25": "ربع الطريق.",
      "fv.m50": "منتصف الطريق.",
      "fv.m75": "ثلاثة أرباع الطريق. اقتربت من النهاية.",
      "fv.milepael": "{melding} {p} % من كل الأعداد.",
      "fv.erLaert": "تم تعلّم {tall}!",
      "feiring.terpe": "واصل التدرّب",
      "feiring.tittel1": "أحسنت! أنت تعرف الأعداد من {min} إلى {maks}",
      "feiring.tittel2": "أحسنت! أنت تعرف الأعداد من {min} إلى {maks} بالحروف",
      "feiring.tekst1": "تم تعلّم كل الأعداد في هذه اللعبة. يمكنك مواصلة التدرّب أو الانتقال إلى التمرين التالي.",
      "feiring.tekst2": "تم تعلّم كل الأعداد في هذه اللعبة. يمكنك مواصلة التدرّب أو الانتقال إلى الخطوة التالية.",
      "feiring.tekst2Siste": "تم تعلّم كل الأعداد في هذه اللعبة. يمكنك مواصلة التدرّب. كان هذا آخر مستوى."
    },

    ro: {
      "side.tittel1": "Franceză: ascultă și scrie cifrele",
      "side.tittel2": "Franceză: scrie numărul cu litere",
      "h1.spill1": "Ascultă și scrie cifrele",
      "h1.spill2": "Scrie numărul cu litere",
      "intro.spill1": "Ascultă numărul și scrie-l cu cifre.",
      "intro.spill2": "Uită-te la număr și scrie-l în franceză. Nu contează dacă folosești litere mari sau mici, nici dacă pui cratimă sau spațiu.",
      "knapp.start": "Start",
      "knapp.hor": "Ascultă numărul",
      "knapp.horOrd": "Ascultă cuvântul",
      "knapp.horIgjen": "Ascultă cuvântul din nou",
      "knapp.sjekk": "Verifică",
      "knapp.neste": "Următorul",
      "knapp.nullstill": "Resetează progresul",
      "etikett.tall1": "Numărul pe care l-ai auzit:",
      "etikett.tall2": "Numărul cu litere:",
      "lenke.spill2": "Jocul 2: scrie numărul cu litere",
      "lenke.spill1": "Jocul 1: ascultă și scrie cifrele",
      "bekreft.nullstill": "Resetezi tot progresul din acest joc?",
      "svar.riktig": "Corect: {tall} = {ord}",
      "svar.feil1": "Ai scris {svar}. Răspunsul corect: {tall} = {ord}",
      "svar.feil2": "Ai scris „{svar}”. Răspunsul corect: {tall} = {ord}",
      "telling": "Corecte de data aceasta: {riktige} din {forsok}",
      "sprak.etikett": "Limba",
      "sprak.utkast": "Această traducere este o ciornă și nu a fost verificată de un vorbitor nativ.",
      "stemme.leter": "Caut o voce franceză...",
      "stemme.valgt": "Voce: {navn}",
      "stemme.ingen": "Nu am găsit nicio voce franceză în acest browser, așa că nu va fi sunet. Încearcă Chrome sau Edge, sau adaugă franceza ca limbă în Windows.",
      "stemme.ingenTale": "Acest browser nu are sinteză vocală. Încearcă Chrome sau Edge.",
      "nivaa.gruppe": "Nivel",
      "nivaa.knapp": "Nivelul {n}: de la {min} la {maks}",
      "nivaa.last": " (blocat)",
      "nivaa.opnesSpill1": "Se deschide când nivelul {n} este terminat în jocul 1",
      "nivaa.opnesSpill2": "Se deschide când nivelul {n} este terminat în jocul 2",
      "nivaa.videre1": "Treci la jocul 2, nivelul {n}",
      "nivaa.videre2": "Treci la jocul 1, nivelul {n}",
      "fv.etikett": "Progres",
      "fv.linje": "Progresul în joc",
      "fv.laert": "Învățate",
      "fv.laertKort": "învățat",
      "fv.alleLaert": "Toate numerele sunt învățate",
      "fv.igjen": "răspunsuri corecte rămase: cel puțin {n}",
      "fv.rute.laert": "{tall}: învățat",
      "fv.rute.boks": "{tall}: caseta {boks} din 5",
      "fv.rute.rekke": ", {rekke} din {krav} la rând",
      "fv.rekke": "{rekke} din {krav}",
      "fv.m25": "Un sfert din drum.",
      "fv.m50": "La jumătatea drumului.",
      "fv.m75": "Trei sferturi. Aproape la final.",
      "fv.milepael": "{melding} {p} % din toate numerele.",
      "fv.erLaert": "{tall} este învățat!",
      "feiring.terpe": "Continuă să exersezi",
      "feiring.tittel1": "Bravo! Știi numerele de la {min} la {maks}",
      "feiring.tittel2": "Bravo! Știi numerele de la {min} la {maks} cu litere",
      "feiring.tekst1": "Toate numerele sunt învățate în acest joc. Poți continua să exersezi sau poți trece la exercițiul următor.",
      "feiring.tekst2": "Toate numerele sunt învățate în acest joc. Poți continua să exersezi sau poți trece la pasul următor.",
      "feiring.tekst2Siste": "Toate numerele sunt învățate în acest joc. Poți continua să exersezi. Acesta a fost ultimul nivel."
    },

    ru: {
      "side.tittel1": "Французский: послушай и запиши цифры",
      "side.tittel2": "Французский: напиши число словами",
      "h1.spill1": "Послушай и запиши цифры",
      "h1.spill2": "Напиши число словами",
      "intro.spill1": "Послушай число и запиши его цифрами.",
      "intro.spill2": "Посмотри на число и напиши его по-французски. Заглавные и строчные буквы, а также дефис или пробел не имеют значения.",
      "knapp.start": "Начать",
      "knapp.hor": "Послушать число",
      "knapp.horOrd": "Послушать слово",
      "knapp.horIgjen": "Послушать слово ещё раз",
      "knapp.sjekk": "Проверить",
      "knapp.neste": "Дальше",
      "knapp.nullstill": "Сбросить прогресс",
      "etikett.tall1": "Число, которое прозвучало:",
      "etikett.tall2": "Число словами:",
      "lenke.spill2": "Игра 2: напиши число словами",
      "lenke.spill1": "Игра 1: послушай и запиши цифры",
      "bekreft.nullstill": "Сбросить весь прогресс в этой игре?",
      "svar.riktig": "Верно: {tall} = {ord}",
      "svar.feil1": "Твой ответ: {svar}. Правильный ответ: {tall} = {ord}",
      "svar.feil2": "Твой ответ: «{svar}». Правильный ответ: {tall} = {ord}",
      "telling": "Верно: {riktige} из {forsok} в этот раз",
      "sprak.etikett": "Язык",
      "sprak.utkast": "Этот перевод — черновик, его не проверял носитель языка.",
      "stemme.leter": "Ищу французский голос...",
      "stemme.valgt": "Голос: {navn}",
      "stemme.ingen": "В этом браузере нет французского голоса, поэтому звука не будет. Попробуй Chrome или Edge либо добавь французский язык в Windows.",
      "stemme.ingenTale": "В этом браузере нет синтеза речи. Попробуй Chrome или Edge.",
      "nivaa.gruppe": "Уровень",
      "nivaa.knapp": "Уровень {n}: от {min} до {maks}",
      "nivaa.last": " (закрыт)",
      "nivaa.opnesSpill1": "Откроется, когда уровень {n} будет пройден в игре 1",
      "nivaa.opnesSpill2": "Откроется, когда уровень {n} будет пройден в игре 2",
      "nivaa.videre1": "Перейти к игре 2, уровень {n}",
      "nivaa.videre2": "Перейти к игре 1, уровень {n}",
      "fv.etikett": "Прогресс",
      "fv.linje": "Прогресс в игре",
      "fv.laert": "Выучено",
      "fv.laertKort": "выучено",
      "fv.alleLaert": "Все числа выучены",
      "fv.igjen": "осталось минимум правильных ответов: {n}",
      "fv.rute.laert": "{tall}: выучено",
      "fv.rute.boks": "{tall}: коробка {boks} из 5",
      "fv.rute.rekke": ", {rekke} из {krav} подряд",
      "fv.rekke": "{rekke} из {krav}",
      "fv.m25": "Четверть пути.",
      "fv.m50": "Половина пути.",
      "fv.m75": "Три четверти. Скоро финиш.",
      "fv.milepael": "{melding} {p} % всех чисел.",
      "fv.erLaert": "Число {tall} выучено!",
      "feiring.terpe": "Продолжить тренировку",
      "feiring.tittel1": "Ура! Ты знаешь числа от {min} до {maks}",
      "feiring.tittel2": "Ура! Ты знаешь числа от {min} до {maks} словами",
      "feiring.tekst1": "Все числа в этой игре выучены. Можно продолжить тренировку или перейти к следующему заданию.",
      "feiring.tekst2": "Все числа в этой игре выучены. Можно продолжить тренировку или перейти к следующему шагу.",
      "feiring.tekst2Siste": "Все числа в этой игре выучены. Можно продолжить тренировку. Это был последний уровень."
    },

    sq: {
      "side.tittel1": "Frëngjisht: dëgjo dhe shkruaj shifrat",
      "side.tittel2": "Frëngjisht: shkruaj numrin me fjalë",
      "h1.spill1": "Dëgjo dhe shkruaj shifrat",
      "h1.spill2": "Shkruaj numrin me fjalë",
      "intro.spill1": "Dëgjo numrin dhe shkruaje me shifra.",
      "intro.spill2": "Shiko numrin dhe shkruaje në frëngjisht. Nuk ka rëndësi nëse përdor shkronja të mëdha apo të vogla, as nëse vë vizë ose hapësirë.",
      "knapp.start": "Fillo",
      "knapp.hor": "Dëgjo numrin",
      "knapp.horOrd": "Dëgjo fjalën",
      "knapp.horIgjen": "Dëgjo fjalën përsëri",
      "knapp.sjekk": "Kontrollo",
      "knapp.neste": "Tjetri",
      "knapp.nullstill": "Rivendos progresin",
      "etikett.tall1": "Numri që dëgjove:",
      "etikett.tall2": "Numri me fjalë:",
      "lenke.spill2": "Loja 2: shkruaj numrin me fjalë",
      "lenke.spill1": "Loja 1: dëgjo dhe shkruaj shifrat",
      "bekreft.nullstill": "Të rivendosësh gjithë progresin në këtë lojë?",
      "svar.riktig": "Saktë: {tall} = {ord}",
      "svar.feil1": "Ti shkrove {svar}. Përgjigjja e saktë: {tall} = {ord}",
      "svar.feil2": "Ti shkrove “{svar}”. Përgjigjja e saktë: {tall} = {ord}",
      "telling": "{riktige} të sakta nga {forsok} këtë herë",
      "sprak.etikett": "Gjuha",
      "sprak.utkast": "Ky përkthim është draft dhe nuk është kontrolluar nga një folës amtar.",
      "stemme.leter": "Po kërkoj një zë frëngjisht...",
      "stemme.valgt": "Zëri: {navn}",
      "stemme.ingen": "Nuk u gjet asnjë zë frëngjisht në këtë shfletues, ndaj nuk do të ketë zë. Provo Chrome ose Edge, ose shto frëngjishten si gjuhë në Windows.",
      "stemme.ingenTale": "Ky shfletues nuk ka sintezë zanore. Provo Chrome ose Edge.",
      "nivaa.gruppe": "Niveli",
      "nivaa.knapp": "Niveli {n}: nga {min} në {maks}",
      "nivaa.last": " (i kyçur)",
      "nivaa.opnesSpill1": "Hapet kur niveli {n} përfundon në lojën 1",
      "nivaa.opnesSpill2": "Hapet kur niveli {n} përfundon në lojën 2",
      "nivaa.videre1": "Vazhdo te loja 2, niveli {n}",
      "nivaa.videre2": "Vazhdo te loja 1, niveli {n}",
      "fv.etikett": "Progresi",
      "fv.linje": "Progresi në lojë",
      "fv.laert": "Të mësuara",
      "fv.laertKort": "mësuar",
      "fv.alleLaert": "Të gjithë numrat janë mësuar",
      "fv.igjen": "edhe të paktën {n} përgjigje të sakta",
      "fv.rute.laert": "{tall}: mësuar",
      "fv.rute.boks": "{tall}: kutia {boks} nga 5",
      "fv.rute.rekke": ", {rekke} nga {krav} radhazi",
      "fv.rekke": "{rekke} nga {krav}",
      "fv.m25": "Një çerek rruge.",
      "fv.m50": "Gjysma e rrugës.",
      "fv.m75": "Tre çerekë. Pothuajse në fund.",
      "fv.milepael": "{melding} {p} % e të gjithë numrave.",
      "fv.erLaert": "{tall} u mësua!",
      "feiring.terpe": "Vazhdo të ushtrohesh",
      "feiring.tittel1": "Bravo! I di numrat nga {min} në {maks}",
      "feiring.tittel2": "Bravo! I di numrat nga {min} në {maks} me fjalë",
      "feiring.tekst1": "Të gjithë numrat janë mësuar në këtë lojë. Mund të vazhdosh të ushtrohesh ose të kalosh te ushtrimi tjetër.",
      "feiring.tekst2": "Të gjithë numrat janë mësuar në këtë lojë. Mund të vazhdosh të ushtrohesh ose të kalosh te hapi tjetër.",
      "feiring.tekst2Siste": "Të gjithë numrat janë mësuar në këtë lojë. Mund të vazhdosh të ushtrohesh. Ky ishte niveli i fundit."
    }
  };

  function finnSpraak(kode) {
    for (var i = 0; i < SPRAAK.length; i++) if (SPRAAK[i].kode === kode) return SPRAAK[i];
    return null;
  }

  // Valget ligger i nettleseren. Er lagring blokkert, legges det i adressen (?sprak=ar) i stedet,
  // ellers ville menyen komme tilbake hver gang og man kom aldri videre.
  function fraAdresse() {
    try { return new URLSearchParams(window.location.search).get("sprak"); } catch (e) { return null; }
  }

  function fraLager() {
    try { return window.localStorage.getItem(NOKKEL); } catch (e) { return null; }
  }

  function harLagretValg() {
    return !!(finnSpraak(fraLager()) || finnSpraak(fraAdresse()));
  }

  function hentValg() {
    var k = fraAdresse();
    if (finnSpraak(k)) return k;
    k = fraLager();
    return finnSpraak(k) ? k : STANDARD;
  }

  var valgt = hentValg();

  function t(nokkel, verdier) {
    var tekst = (TEKST[valgt] && TEKST[valgt][nokkel]) || TEKST[STANDARD][nokkel];
    if (tekst === undefined) return nokkel;
    if (verdier) {
      tekst = tekst.replace(/\{(\w+)\}/g, function (hele, navn) {
        if (verdier[navn] === undefined) return hele;
        var v = String(verdier[navn]);
        // I et språk som skrives mot venstre isoleres tall og fransk (uten arabisk skrift) som venstre-mot-høyre, så rekkefølgen ikke snur.
        return erRtl() && !/[\u0600-\u06FF]/.test(v) ? "\u2066" + v + "\u2069" : v;
      });
    }
    return tekst;
  }

  function kode() { return valgt; }

  function erRtl() { return finnSpraak(valgt).retning === "rtl"; }

  function velg(ny, selvOmSamme) {
    if (!finnSpraak(ny) || (ny === valgt && !selvOmSamme && harLagretValg())) return;
    try { window.localStorage.setItem(NOKKEL, ny); } catch (e) { /* sjekkes under */ }
    var p = new URLSearchParams(window.location.search);
    if (fraLager() === ny) {
      if (!p.has("sprak")) { window.location.reload(); return; }
      p.delete("sprak");
    } else {
      p.set("sprak", ny);
    }
    var s = p.toString();
    window.location.search = s ? "?" + s : "";
  }

  // Setter språk og retning på siden og fyller elementer med data-t="nokkel" (data-t på <title> setter sidetittelen).
  // Første gang (ingen lagret valg) kommer en meny foran alt, og man må velge før man kan starte.
  // Etterpå ligger et språkikon øverst til høyre som åpner den samme menyen.
  function init() {
    var sp = finnSpraak(valgt);
    document.documentElement.lang = sp.kode;
    document.documentElement.dir = sp.retning;
    var elementer = document.querySelectorAll("[data-t]");
    for (var i = 0; i < elementer.length; i++) elementer[i].textContent = t(elementer[i].getAttribute("data-t"));
    var tittel = document.querySelector("title[data-t]");
    if (tittel) document.title = t(tittel.getAttribute("data-t"));
    leggInnStil();
    var overskrift = document.querySelector("h1");
    if (sp.utkast && overskrift) {
      var merk = document.createElement("p");
      merk.className = "liten";
      merk.textContent = t("sprak.utkast");
      overskrift.parentNode.insertBefore(merk, overskrift.nextSibling);
    }
    var ikon =document.createElement("button");
    ikon.type = "button";
    ikon.className = "sprak-ikon";
    ikon.setAttribute("aria-label", t("sprak.etikett"));
    ikon.title = t("sprak.etikett");
    ikon.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9.5"/><ellipse cx="12" cy="12" rx="4" ry="9.5"/><path d="M2.5 12h19M4 7h16M4 17h16"/></svg><span>' + valgt.toUpperCase() + '</span>';
    ikon.addEventListener("click", function () { visMeny(false); });
    document.body.appendChild(ikon);
    if (!harLagretValg()) visMeny(true);
  }

  function leggInnStil() {
    if (document.getElementById("sprak-stil")) return;
    var st = document.createElement("style");
    st.id = "sprak-stil";
    st.textContent =
      ".sprak-ikon{position:fixed;top:.6rem;right:.6rem;z-index:900;display:flex;align-items:center;gap:.3rem;margin:0;padding:.3rem .55rem;font-size:.8rem;font-weight:700;background:#fff;color:#111;border:2px solid #111;border-radius:20px}" +
      ".sprak-bak{position:fixed;inset:0;z-index:1100;background:#fff;display:flex;align-items:center;justify-content:center;padding:16px;overflow-y:auto}" +
      ".sprak-boks{width:100%;max-width:24rem}" +
      ".sprak-boks h2{margin:0 0 1rem;font-size:1.3rem}" +
      ".sprak-boks ul{list-style:none;margin:0;padding:0;display:grid;gap:.5rem}" +
      ".sprak-boks li button{width:100%;margin:0;text-align:center;font-size:1.3rem;padding:.7rem 1rem;background:#fff;color:#111;border:2px solid #111;border-radius:8px}" +
      ".sprak-boks li button[aria-pressed=true]{background:#f5c400;font-weight:700}" +
      ".sprak-lukk{margin:1rem 0 0;background:none;border:0;text-decoration:underline;font-size:1rem;padding:.3rem 0}" +
      "body{padding-top:2.4rem}" +
      // Fremgangskolonnen på bred skjerm er sticky; den skal stoppe under ikonet, ikke bak det.
      "@media (min-width:62rem){body>#fremgang{top:3.4rem;max-height:calc(100vh - 4.4rem)}}" +
      "[dir=rtl] .fv-fyll{transform-origin:right}" +
      "[dir=rtl] button{margin:.25rem 0 .25rem .25rem}" +
      "[dir=rtl] #nivaa button{margin:0 0 .2rem .2rem}";
    document.head.appendChild(st);
  }

  // obligatorisk = første besøk: ingen lukkeknapp og ingen Escape. Ellers kan menyen lukkes.
  function visMeny(obligatorisk) {
    var bak = document.createElement("div");
    bak.className = "sprak-bak";
    var boks = document.createElement("div");
    boks.className = "sprak-boks";
    boks.setAttribute("role", "dialog");
    boks.setAttribute("aria-modal", "true");
    boks.setAttribute("aria-labelledby", "sprak-tittel");
    var h = document.createElement("h2");
    h.id = "sprak-tittel";
    h.dir = "ltr";
    h.textContent = "Language \u00b7 Spr\u00e5k \u00b7 \u0627\u0644\u0644\u063a\u0629 \u00b7 Limba \u00b7 \u042f\u0437\u044b\u043a \u00b7 Gjuha";
    var liste = document.createElement("ul");
    var forste = null;
    SPRAAK.forEach(function (sp) {
      var li = document.createElement("li");
      var kn = document.createElement("button");
      kn.type = "button";
      kn.lang = sp.kode;
      kn.dir = sp.retning;
      kn.textContent = sp.navn;
      kn.setAttribute("aria-pressed", harLagretValg() && sp.kode === valgt ? "true" : "false");
      kn.addEventListener("click", function () { velg(sp.kode, true); });
      li.appendChild(kn);
      liste.appendChild(li);
      if (!forste) forste = kn;
    });
    boks.appendChild(h);
    boks.appendChild(liste);
    var lukk = null;
    if (!obligatorisk) {
      lukk = document.createElement("button");
      lukk.type = "button";
      lukk.className = "sprak-lukk";
      lukk.textContent = "\u00d7";
      lukk.setAttribute("aria-label", "Close");
      boks.appendChild(lukk);
    }
    bak.appendChild(boks);
    document.body.appendChild(bak);
    function steng() {
      document.removeEventListener("keydown", taste);
      if (bak.parentNode) bak.parentNode.removeChild(bak);
      var ikon = document.querySelector(".sprak-ikon");
      if (ikon) ikon.focus();
    }
    function taste(e) { if (e.key === "Escape" && !obligatorisk) steng(); }
    if (lukk) lukk.addEventListener("click", steng);
    document.addEventListener("keydown", taste);
    forste.focus();
  }

  var api = { t: t, kode: kode, rtl: erRtl, init: init, SPRAAK: SPRAAK, TEKST: TEKST };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.Tekster = api;
})();
