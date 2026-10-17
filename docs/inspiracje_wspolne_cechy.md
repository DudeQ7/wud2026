# Inspiracje z briefu – co mają wspólnego

Przegląd 12 serwisów z sekcji 9 briefu (stan na 17.10.2026) i porównanie z obecną stroną filharmonia.szczecin.pl.

**Przejrzane serwisy:** Philharmonie Luxembourg, Concertgebouworkest (COA), Het Concertgebouw (CG), Dresdner Philharmonie, Philharmonie de Paris, Berliner Philharmoniker, Oslo-Filharmonien, Wiener Philharmoniker, Orchestre philharmonique de Strasbourg, Gewandhaus Leipzig, Nowy Teatr, omn.art.pl.

> **Zastrzeżenie:** strony czytaliśmy głównie jako tekst/HTML. Zachowania typu *sticky*, układu mobilnego i części filtrów działających tylko w JS w większości nie dało się potwierdzić.

---

## 1. Wspólny mianownik: robi to większość serwisów

| Wzorzec | Kto | Wniosek dla FS |
|---|---|---|
| **Jeden statyczny hero** (jedno wydarzenie lub kampania + CTA), bez slidera | Lux, COA, CG, Drezno, Paryż, Berlin (wideo), Oslo, Nowy Teatr | Zgodne z briefem. Slider mają tylko Strasburg, Gewandhaus i OMN. |
| **Krótkie menu: 4–6 pozycji** | Lux 6, CG 4, Wiedeń 4, Strasburg 6, Nowy Teatr 5 | Obecna FS ma 23 pozycje. Wyjątki: Paryż 8, Gewandhaus 9. |
| **Wyszukiwarka i przełącznik języka w nagłówku** | prawie wszystkie (wyszukiwarki brak w Wiedniu i Dreźnie) | Standard. |
| **Kalendarz = lista** pogrupowana po dniach lub miesiącach, doczytywanie „więcej” lub paginacja | wszystkie | Widoku siatki miesiąca praktycznie nikt nie ma (wyjątek: mini-siatka w Gewandhaus). |
| **Filtry: typ/gatunek + data + sala** | Lux, CG, Paryż, Gewandhaus, Wiedeń, Strasburg, Nowy Teatr | To trzon, który ma każdy kalendarz. |
| **Licznik wyników na przycisku filtra** („Show results (326)”) | Lux, CG, COA, Strasburg | Dobry wzorzec dla dolnego arkusza filtrów na mobile. |
| **Status biletów już na liście** (ostatnie miejsca / wyprzedane / wstęp wolny) | COA, CG, Berlin („Noch 2 Tickets”), Oslo, Paryż, Nowy Teatr, Lux | Standard. Berlin pokazuje dokładną liczbę pozostałych biletów. |
| **Czas trwania z przerwą** na karcie wydarzenia | Lux, COA, CG, Drezno, Paryż, Berlin, Oslo, Strasburg, Nowy Teatr | Standard. COA, CG i Strasburg podają też **godzinę zakończenia**. |
| **Cena „od” lub „od–do”** przy CTA | CG („from 29”), COA („Starting € 20”), Strasburg („de 6 € à 62 €”) | Wymóg briefu potwierdzony. |
| **Program + wykonawcy (z linkami) + program PDF** | prawie wszystkie | Standard. |
| **„Dlaczego warto”: krótki lead redakcyjny** | Lux, COA, Drezno („Zum Konzert”), Oslo | |
| **Podobne wydarzenia pod kartą (2–4 karty)** | Lux, CG, Drezno, Oslo, Nowy Teatr (+ „Other dates” w Wiedniu) | Częsty wzorzec. Jak dobierane są propozycje, nigdzie nie widać. |
| **Osobna strona Dostępność / Visit** | Lux, CG, Paryż, Strasburg, Gewandhaus, Nowy Teatr | Jest wszędzie, ale prawie nigdzie nie schodzi na poziom pojedynczego wydarzenia (patrz sekcja 3). |
| **Wizualnie: dużo bieli, czerń + jeden akcent, para grotesk + szeryf** | COA, Oslo, Wiedeń, Nowy Teatr, Gewandhaus, Berlin | Złoto jako akcent mają COA (#ad976c) i Wiedeń (#a38037), co wpisuje się w kierunek marki FS. |

## 2. Wzorce częściowe: robi to kilka serwisów, warto wziąć

- **„Pomóż mi wybrać” / quiz:** CG (Concert Matchmaker), Drezno (Konzertfinder, ok. 4 min, z próbkami audio), Oslo (smaksguide).
  - **Oslo w szczegółach:** 10 klipów po 45 s, odtwarzanych „w ciemno”. Każdy klip oceniasz w skali 1–6. Przy ocenie od 4 w górę wybierasz cechy: Melodia, Rytm, Brzmienie, Harmonia, Energia, Spokój, Siła, Nastrój. Na końcu dostajesz raport z linkami do koncertów.
  - Drezno zamienia wynik quizu w **archetypy słuchacza** (Abenteurer, Genießer, Neugierige, „The Brain”), które są potem **tagami w kalendarzu**.
- **Kategorie nastrojów i tagi tematyczne:** Lux (kafle Mood-booster, Piano, Jazz, Epic, Kids), Berlin (17 tagów: Klavier, Lunchkonzerte, Kinder und Familie…), Drezno (archetypy).
- **Pakiet dla nowicjusza:** COA „What to expect” (5 kart: powitanie, napoje, dress code, program, przerwa), Lux „Your first visit”, przewodnik Oslo, Berlin w wersji Leichte Sprache (tekst łatwy do czytania).
- **Mobilny dolny pasek nawigacji:**
  - CG: Search, Calendar, Menu, Saved, Account.
  - Gewandhaus: Orchester, Spielplan, Kalender, Genres, Kasse.
- **Zapisane / ulubione:** CG (Saved), Lux (Profil), Drezno (Merkliste w głównej nawigacji).
- **Dodaj do kalendarza (.ics/Google):** Lux, Drezno, Wiedeń, Gewandhaus. **Udostępnij:** Oslo, Gewandhaus, Lux („Send to a friend”).
- **Filtr ceny:** Lux, Paryż. **Filtr wieku i publiczności:** Lux, Paryż, Nowy Teatr. **Filtr kompozytora/dyrygenta:** CG, Wiedeń, Berlin (pole tekstowe). **Filtr języka:** Lux.
- **Szybkie filtry czasu:** Nowy Teatr (dzisiaj / jutro / pojutrze na stronie głównej), Paryż (blok „Aujourd’hui”), Wiedeń („Go to Today”).
- **Filtry zapisane w URL:** Berlin (`#/?tag=Klavier`), Paryż, częściowo Lux.
- **Odsłuch:** na liście w CG („Luisteren”), w sekcji Audio na karcie w Strasburgu, MP3 „Kurz reinhören” na stronie festiwalu Gewandhaus, linki do Spotify/Apple w COA.
- **Festiwal w serwisie:**
  - Gewandhaus: ten sam nagłówek i koszyk, a w treści intro, lista dni, zasady biletów, audio i partnerzy.
  - Lux: mikrostrona z **własną skórką** kolorystyczną.
- **Wprowadzenie przed koncertem:** Drezno, Oslo, Strasburg, Berlin.
- **Karta z zakładkami / kotwicami:** Berlin (Konzertinformationen, Tickets, Besucherinfos), Strasburg (puste sekcje są ukrywane).

## 3. Luki: tego (prawie) nikt nie ma, czyli nasza szansa

1. **Znaczniki dostępności przy wydarzeniu.**
   - Mają je tylko Paryż (piktogramy + filtr dostępności w agendzie) i Nowy Teatr (AD i napisy przy każdym terminie, widoczne już na liście).
   - Brief tego wymaga, a reszta nie ma. To wyraźny wyróżnik.
2. **Przyklejony „Kup bilet” z ceną „od” i statusem.** Nie potwierdziliśmy go w żadnym serwisie.
3. **Odsłuch osadzony bezpośrednio na karcie wydarzenia.** Wszędzie jest to link zewnętrzny, osobna sekcja albo w ogóle go nie ma.
4. **Asystent AI, który prowadzi do działania.**
   - omn.art.pl to po prostu gotowy widżet Chatbase („OMN-AI”).
   - Jego słabości:
     - sam otwiera się po 12 s (antywzorzec);
     - nie podsuwa sugerowanych pytań;
     - odpowiada tekstem, a nie kartami z CTA;
     - w konfiguracji nie widać klauzuli RODO (do sprawdzenia ręcznie).
   - Poprzeczka jest nisko.
5. **Udostępnialne URL-e filtrów + licznik + czytelny stan „brak wyników” z alternatywami.** Pustego stanu nie widzieliśmy nigdzie.
6. **Widok miesiąca w kalendarzu.** Prawie nikt go nie ma. Może zostać na desktopie jako opcja (scenariusz F – nauczyciel), ale domyślnie lista.
7. **Informacje sensoryczne** (głośność, światło). Nikt ich nie ma. Najbliżej jest Strasburg z typem „Concert Relax”.

## 4. Do ukradzenia: top 10

1. „What to expect” w formie kart dla debiutanta (COA). Pasuje do ścieżki A.
2. Kafle nastrojów na stronie głównej (Lux).
3. Quiz audio z oceną + cechami (Oslo) i wynik jako tagi w kalendarzu (Drezno).
4. Dolny pasek mobile z „Zapisane” (CG, Gewandhaus).
5. Licznik wyników na przycisku filtrów (Lux, CG).
6. Status „Zostały 2 bilety” na liście (Berlin).
7. Godzina zakończenia + przerwa nad zgięciem (COA, CG, Berlin).
8. Piktogramy dostępności przy wydarzeniu + filtr dostępności (Paryż), tagi per termin (Nowy Teatr).
9. Szybkie „dziś / jutro / weekend” (Nowy Teatr, Paryż).
10. Festiwal jako landing w serwisie ze wspólnym koszykiem, z opcjonalną własną skórką kolorystyczną cyklu (Gewandhaus + Lux).

## 5. Obecna strona FS na tym tle

- **Menu:** 23 pozycje, brak wyszukiwarki i konta.
- **Strona główna:** lista wydarzeń dopiero na końcu.
- **Filtry kalendarza:** tylko 4 zakładki i rok. Wpisy się dublują (zwiedzanie w 3 językach co tydzień).
- **Karta wydarzenia:**
  - brak cen i wyraźnego „Kup bilet”;
  - newsletter wstawiony w środek treści;
  - brak audio, dostępności i podobnych wydarzeń.
  - Plusy: czas trwania z przerwą, program PDF, linki do artystów.
- **Wersja EN:** mieszanka języków i literówki, banery bez alt.
