# Design system: Filharmonia Szczecin, „Filharmonia zaczyna się online”

Wiążąca specyfikacja wizualna i interakcyjna konceptu nowej strony FS. Opiera się na briefie (PDF i `brief_hackathon_filharmonia.md`), transkrypcji spotkania (`transkrypt.md`), przeglądzie serwisów z sekcji 9 briefu (`inspiracje_wspolne_cechy.md` oraz pomiary stylów z 17.10.2026) i decyzjach podjętych na tablicach w Figmie.

- **Figma:** plik **WUD2026**, strona **„Design system — decyzje”**. Tablice 1–6 dokumentują historię decyzji, dlatego część pokazanych tam wariantów jest odrzucona (patrz §1).
- **Status:** v1.0, 17.10.2026.
- **Pierwszeństwo:** ten dokument jest nadrzędny wobec makiety `docs/mockups/strona-glowna-v2.*`. Makieta używa innych krojów, jaśniejszego złota i kolorów kategorii, a wszystkie te elementy zostały odrzucone.

---

## 0. Zasady nadrzędne (z briefu)

1. **Przewodnik, nie tablica ogłoszeń.** Strona prowadzi przez sekwencję *Odkryj → Wybierz → Zaplanuj → Kup → Przyjdź → Wróć*.
2. **„Chcę tam być” w kilka sekund.** Każdy ekran odpowiada na jedno z trzech pytań:
   - co dzieje się teraz i wkrótce,
   - co jest dla mnie,
   - jak tam się dostać.
3. **Nie trzeba „znać Filharmonii”.** Debiutant (ścieżka A, obowiązkowa, na telefonie) musi przejść od wejścia do biletu bez wiedzy o muzyce klasycznej i bez lęku, np. przed dress code'em.
4. **Mobile first.** 74% wejść pochodzi z telefonu, a najczęstsze szerokości ekranu to 360–402 px. Desktop pokazuje *więcej kontekstu, nie inne funkcje*.
5. **Dostępność wbudowana, nie doklejona.** Obowiązuje WCAG 2.2 AA w każdym komponencie (§9). FS jest instytucją publiczną, więc to obowiązek prawny (transkrypcja).
6. **Minimalizm, elegancja, cisza.** Inspiracją jest budynek (światło, biel, geometria, rytm, przestrzeń), ale go nie kopiujemy. Na mobile użytkownik skanuje treść, a nie czyta jej w całości: krótkie bloki, brak ścian tekstu.
7. **Czego unikać (brief §10):**
   - przeciążonej strony i wielopoziomowego menu,
   - wielkich bloków tekstu,
   - sliderów z wieloma komunikatami,
   - nadmiaru animacji,
   - technologii dla samej technologii,
   - strony, która dobrze wygląda tylko na komputerze.

## 1. Rejestr decyzji

| # | Obszar | Decyzja | Odrzucone |
|---|---|---|---|
| D1 | Typografia | **Titillium Web** (nagłówki) + **Open Sans** (UI i treść), czyli kroje z materiałów FS | Instrument Serif + Inter; Instrument Serif + Titillium |
| D2 | Kolor tekstu | **#2B2B2B** dla treści i UI (zamiast #3D3D3D z PDF) | #3D3D3D |
| D3 | Kolorystyka | **Strona monochromatyczna.** Złoto wyłącznie w nagłówkach i etykietach (eyebrow) | złote przyciski, złote wypełnienia, złoto jako tło |
| D4 | Złoto nagłówków | **#8A6D2F** na białym (4,87:1). Na czerni **#AD9450** (5,91:1) | #9B804A (3,8:1), #7D6A35, #E2BE68 |
| D5 | Kategorie wydarzeń | **Etykieta tekstowa, bez koloru.** Status zawsze słowem i kształtem | kolorowe paski, kropki, kwadraty, kolorowe statusy |
| D6 | Cykle i festiwale | **Bez kolorów cykli w ogóle.** Podstrona cyklu też jest czarno-biało-złota, a cykl wyróżnia typografia i zdjęcie | skórki kolorystyczne cykli |
| D7 | Kształty | **Promień 0 wszędzie.** Ścięty narożnik (motyw łamanych płaszczyzn znaku) oszczędnie, maks. 1–2 na ekran. **Heksagon** tylko dla asystenta AI | zaokrąglenia 8 px, pigułki |
| D8 | Rytm strony głównej | **„Dla Ciebie” to jedyna czarna sekcja** przed stopką (złoty nagłówek `#AD9450` na czerni, kafle nastrojów z białym konturem). Kafel „Pomóż mi wybrać” jest **odwrócony: biały na czerni**, jedyny jasny blok sekcji. Kafle nastrojów pokazują liczbę wydarzeń za kliknięciem (te same filtry co kalendarz). Długa biała strona bez przerwy rytmu była zbyt jednostajna na telefonie (18.10.2026) | czarny kafel na białej sekcji |
| D9 | Status „Dostępne” | Na listach, kartach i w otwarciu **pomijamy** „Dostępne” (stan domyślny, szum); pokazujemy wyjątki: „Ostatnie miejsca”, „Wyprzedane”. Na karcie wydarzenia status jest zawsze (§6.8) | znacznik „Dostępne” przy każdym wierszu |
| D10 | Karta wydarzenia na desktopie | 2 kolumny od 1024 px: treść 7/12 i **przyklejony panel biletowy** 4/12 (data, godzina, sala, cena, status, Kup bilet, akcje). Pasek zakupu zostaje tylko na telefonie | pasek zakupu na każdej szerokości |
| D11 | Symbole rodzajów w kalendarzu | W widoku miesiąca pod datą z wydarzeniami stoi **po jednym symbolu na rodzaj** (maks. 2, dalej „+”), dni puste się cofają (szary tekst), dni z wydarzeniami mają tło, pogrubioną datę i symbol; legenda nad siatką wymienia tylko rodzaje z danego miesiąca. Ten sam symbol stoi przy rodzaju w wierszach listy. Symbole: nuty (symfoniczny), fortepian (kameralny), mikrofon (jazz), globus (muzyka świata), kształty (edukacja i dzieci), obraz (wystawa), ślady stóp (zwiedzanie), klaps (film, debata). Rodzaj rozróżnia kształt, nie kolor (D5/D6); nazwa jest też w `aria-label` dnia | kreski z liczbą wydarzeń (bez rodzaju), kolory rodzajów |
| D12 | Ceny w prototypie | Ceny wydarzeń oprócz zwiedzania to **dane przykładowe** (`src/content/prices.ts`, mock cennika iksoris wg rodzaju). Prawdziwe ceny z danych mają pierwszeństwo, a dane strukturalne schema.org nigdy nie korzystają z mocka. Do wymiany na API iksoris | „Ceny w kasie online” w każdej karcie |
| D13 | Kalendarz na telefonie: trzy wiersze kontrolek | Wiersz 1: pole szukania + „Filtry (n)”; wiersz 2: szybkie filtry w jednej przewijanej linii; wiersz 3: licznik wyników + przełącznik Lista/Miesiąc. Akapit wstępny i zdanie przy legendzie znikają na telefonie. Etykieta pola szukania jest widoczna od 640 px, na telefonie zostaje w nazwie pola (`sr-only`). Pomiar (390×844): pierwsza data w siatce z 888 px na 564 px, czyli w pierwszym ekranie. **Szybkie filtry zawsze w jednej linii:** nigdy się nie zawijają; do 768 px mają krótkie etykiety (Dziś · Weekend · Dzieci · Jazz · Wystawy) i zwarty rozmiar, więc wszystkie pięć mieści się na ekranie od 360 px (PL) i od 390 px (DE, UK); węższy ekran przewija linię. Zaznaczenie nie zmienia szerokości: ✓ stoi w rogu chipa (zamiast przed etykietą w §6.6), czyli nic się nie przesuwa i nie wypada | pięć pięter kontrolek przed pierwszą datą |

D6 dotyczy interfejsu. **Zdjęcia i grafiki FS pokazujemy w oryginale, z ich kolorami** (§5.6).

D6 jest świadomie ostrzejsza niż brief, który dopuszczał „kolory tematyczne cykli”, i niż `CLAUDE.md`, który dopuszczał skórki. Decyzja zespołu: **zero kolorów poza bielą, czernią, szarościami i złotem**.

---

## 2. Kolor

### 2.1 Tokeny

| Token | Hex | Rola |
|---|---|---|
| `--color-bg` | `#FFFFFF` | tło strony; jedyne jasne tło, na którym wolno stawiać złote nagłówki |
| `--color-bg-subtle` | `#F7F6F2` | tła pomocnicze (np. blok „Planuj wizytę”, tło stopki formularzy). **Bez złotego tekstu** |
| `--color-surface-muted` | `#EDEBE5` | tło znacznika „Wyprzedane”, nieaktywne pola, szkielety ładowania |
| `--color-ink` | `#1A1A1A` | czerń marki: wypełnienie przycisku głównego, ciemne sekcje, stopka, pasek zakupu, logo |
| `--color-text` | `#2B2B2B` | cały tekst treści i UI na jasnym tle (tytuły wydarzeń, akapity, etykiety formularzy) |
| `--color-text-muted` | `#5A5650` | metadane (sala, cena, czas), podpisy, placeholdery |
| `--color-line` | `#DEDAD2` | **wyłącznie dekoracyjne** separatory list (nie niosą informacji) |
| `--color-line-strong` | `#2B2B2B` | obramowania pól, filtrów i przycisków konturowych; linia pod nagłówkiem dnia |
| `--color-gold` | `#8A6D2F` | złote nagłówki H1–H4 i etykiety eyebrow na `--color-bg` |
| `--color-gold-on-dark` | `#AD9450` | złote nagłówki, etykiety i linie motywu na `--color-ink` |
| `--color-on-dark` | `#FFFFFF` | tekst na czerni |
| `--color-on-dark-muted` | `#CFCBC2` | metadane na czerni |
| `--color-focus` | `#1A1A1A` / `#FFFFFF` na ciemnym | obrys fokusu |
| `--color-scrim` | `rgba(26,26,26,.6)` | tło pod arkuszem dolnym i modalem (**nigdy na zdjęciu**, §5.6) |

### 2.2 Zweryfikowane kontrasty (WCAG 2.2: tekst ≥ 4,5:1, duży tekst ≥ 3:1, elementy UI ≥ 3:1)

| Para | Kontrast | Zastosowanie | Wynik |
|---|---|---|---|
| `#2B2B2B` na `#FFFFFF` | 14,16:1 | tekst | AA/AAA |
| `#2B2B2B` na `#F7F6F2` | 13,09:1 | tekst | AA/AAA |
| `#2B2B2B` na `#EDEBE5` | 11,88:1 | tekst | AA/AAA |
| `#5A5650` na `#FFFFFF` | 7,29:1 | metadane | AA/AAA |
| `#5A5650` na `#EDEBE5` | 6,11:1 | „Wyprzedane” | AA |
| `#8A6D2F` na `#FFFFFF` | 4,87:1 | złoty nagłówek i eyebrow | AA (każdy rozmiar) |
| `#8A6D2F` na `#F7F6F2` | 4,51:1 | — | na granicy, **nie używać** |
| `#8A6D2F` na `#EDEBE5` | 4,09:1 | — | **niezgodne** |
| `#8A6D2F` na `#1A1A1A` | 3,57:1 | — | **niezgodne**, na czerni użyj `#AD9450` |
| `#AD9450` na `#1A1A1A` | 5,91:1 | złoty nagłówek na czerni | AA |
| `#AD9450` na `#2B2B2B` | 4,81:1 | złoty nagłówek na `#2B2B2B` | AA |
| `#AD9450` na `#FFFFFF` | 2,95:1 | — | **niezgodne** (nawet dla linii i ikon) |
| `#FFFFFF` na `#1A1A1A` | 17,40:1 | tekst na czerni, przycisk główny | AA/AAA |
| `#CFCBC2` na `#1A1A1A` | 10,75:1 | metadane na czerni | AA/AAA |
| `#1A1A1A` na `#EDEBE5` | 14,60:1 | — | AA/AAA |
| `#DEDAD2` na `#FFFFFF` | 1,39:1 | separator dekoracyjny | dozwolone tylko bez znaczenia informacyjnego |

### 2.3 Reguły koloru

- **Złoto = nagłówki i etykiety. Nic więcej.** Złota nie stosujemy na przyciskach, w wypełnieniach, na tłach, w ikonach statusu ani w linkach w treści.
  - Jedyny wyjątek to cienka linia lub kontur motywu geometrycznego na czerni (`#AD9450`).
  - Na białym linia motywu jest w `#8A6D2F`.
- **Złoty nagłówek tylko na `#FFFFFF` (używamy `#8A6D2F`) albo na `#1A1A1A` (używamy `#AD9450`).** Sekcja na `#F7F6F2` lub `#EDEBE5` ma nagłówki w `#2B2B2B`.
- **Nigdy biały tekst na złocie.** Taki układ jest na slajdzie 3 PDF-a i daje 2,95:1, więc jest niezgodny.
- **Tytuły wydarzeń na listach i kartach są w `#2B2B2B`, nie w złocie.** Złoto rezerwujemy dla nagłówków sekcji i H1 strony, inaczej traci rangę.
  - Wyjątek: H1 na karcie wydarzenia jest złoty, bo to nagłówek strony.
- **Kolor nigdy nie jest jedynym nośnikiem informacji** (WCAG 1.4.1). Statusy, kategorie, aktywne filtry i aktywna pozycja menu zawsze mają słowo, kształt lub ikonę.
- **Brak kolorów funkcjonalnych** (zieleń „dostępne”, bursztyn „ostatnie miejsca”, czerwień błędów). Ich rolę przejmują kształt, waga, ikona i tekst (§6.8, §6.17).
- Obecna strona używa żółtego złota `#FFD45A` (1,42:1 na białym). **Nie przenosimy go.**

---

## 3. Typografia

### 3.1 Kroje

| Rola | Krój | Odmiany | Źródło |
|---|---|---|---|
| Nagłówki (H1–H4), liczby w kalendarzu, ceny w pasku zakupu | **Titillium Web** | 600 SemiBold (podstawowa), 700 Bold (tylko wyróżnienia) | Google Fonts, podzbiór `latin-ext` |
| Treść, UI, przyciski, formularze, etykiety | **Open Sans** | 400 Regular, 600 SemiBold, 700 Bold (tylko eyebrow w wersalikach) | Google Fonts, `latin-ext` |

- Oba kroje są w materiałach FS (PDF briefu), więc są spójne z obecną identyfikacją. Oba mają pełne polskie i niemieckie znaki (ą ę ś ż ź ć ń ó ł, ä ö ü ß) oraz cudzysłowy „”.
- Ładowanie: self-hosting przez `next/font`. Przed implementacją sprawdź API w `node_modules/next/dist/docs/`, bo to Next 16. Ustaw `font-display: swap` i preload tylko Titillium 600 oraz Open Sans 400.
- Fallback: `Titillium Web, "Segoe UI", system-ui, sans-serif` oraz `Open Sans, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
- Cyfry w godzinach, cenach i datach: `font-variant-numeric: tabular-nums`, żeby kolumny w kalendarzu się wyrównywały.

### 3.2 Skala (mobile → desktop od 1024 px; płynnie przez `clamp()`)

| Token | Krój | Mobile | Desktop | Interlinia | Uwagi |
|---|---|---|---|---|---|
| `display` | Titillium 600 | 40 px | 64 px | 1,05 | H1 otwarcia strony głównej, nazwy festiwali |
| `h1` | Titillium 600 | 32 px | 48 px | 1,1 | H1 podstron i karty wydarzenia; złoty |
| `h2` | Titillium 600 | 28 px | 40 px | 1,15 | nagłówki sekcji („Dziś w Filharmonii”); złoty |
| `h3` | Titillium 600 | 22 px | 28 px | 1,2 | podsekcje, nagłówek dnia w kalendarzu; złoty |
| `h4` | Titillium 600 | 18 px | 20 px | 1,3 | nagłówki bloków; złoty |
| `title-card` | Titillium 600 | 17 px | 20 px | 1,3 | tytuł wydarzenia na liście lub karcie; `#2B2B2B` |
| `body-lg` | Open Sans 400 | 18 px | 20 px | 1,55 | lead, „Dlaczego warto przyjść” |
| `body` | Open Sans 400 | 16 px | 18 px | 1,6 | treść; 65+ zostają najdłużej, więc czytelność jest priorytetem |
| `ui` | Open Sans 600 | 16 px | 16 px | 1,25 | przyciski, filtry, nawigacja |
| `meta` | Open Sans 400 | 14 px | 15 px | 1,45 | sala · cena · czas; `#5A5650` |
| `eyebrow` | Open Sans 700, WERSALIKI, `letter-spacing: .12em` | 12 px | 13 px | 1,3 | kategoria nad tytułem; złoty na białym |
| `label` | Open Sans 700, WERSALIKI, `letter-spacing: .08em` | 12 px | 12 px | 1,3 | etykieta rodzaju w wierszu kalendarza; `#5A5650` |
| `badge` | Open Sans 600 | 13 px | 13 px | 1 | statusy biletów |

**Zasady:**

- Minimalny rozmiar tekstu to **14 px**. Rozmiar **12 px** dopuszczamy tylko dla wersalikowych `eyebrow` i `label`.
- Wszystkie rozmiary podajemy w `rem`. Strona musi działać przy powiększeniu 200% i przy szerokości 320 CSS px bez przewijania w poziomie (WCAG 1.4.4, 1.4.10).
- Nagłówki układamy z `text-wrap: balance`, a akapity z `text-wrap: pretty`. Szerokość akapitu to maks. **68 znaków** (`max-width: 68ch`).
- **Bez wersalików w zdaniach.** Wersaliki są wyłącznie w `eyebrow`, `label` i dacie na znaczniku zdjęcia.
- Tekst musi znosić zmianę odstępów zgodnie z WCAG 1.4.12: interlinia 1,5, odstęp liter 0,12 em, odstęp słów 0,16 em. Dlatego kontenery tekstu nie mają stałych wysokości.

---

## 4. Siatka, odstępy, punkty przełamania

### 4.1 Punkty przełamania (z briefu)

| Zakres | Kolumny | Margines boczny | Odstęp kolumn | Układ |
|---|---|---|---|---|
| 360–599 px | 4 | 16 px | 16 px | 1 kolumna kart, dolna nawigacja, arkusze dolne |
| 600–1023 px | 8 | 24 px | 16 px | 2 kolumny kart, dolna nawigacja |
| 1024–1439 px | 12 | 32 px | 24 px | menu górne, 3 kolumny kart, boczny panel filtrów |
| ≥ 1440 px | 12 | auto | 24 px | treść maks. **1320 px**: więcej „powietrza”, nie więcej elementów |

- Projektujemy od **360 px**. Testujemy na 360, 390, 768, 1024, 1440 i 1920 px oraz przy 320 px dla zgodności z WCAG reflow.
- Widoki referencyjne do prezentacji to **360 px (mobile)** i **1440 px (desktop)** (brief §10).

### 4.2 Skala odstępów (bazowa jednostka 4 px)

`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128`

| Zastosowanie | Mobile | Desktop |
|---|---|---|
| Odstęp między sekcjami strony | 64 px | 96–128 px |
| Nagłówek sekcji → treść | 24 px | 32 px |
| Padding karty / panelu | 16–20 px | 24–32 px |
| Odstęp między celami dotykowymi | min. 8 px | min. 8 px |
| Wiersz listy kalendarza (pion) | 16 px | 20 px |

„Powietrze” i rytm podziałów to środki elegancji, więc w razie wątpliwości dajemy więcej przestrzeni zamiast kolejnego elementu.

---

## 5. Kształt, motyw graficzny, ikony, zdjęcia

### 5.1 Narożniki i krawędzie

- **`border-radius: 0` wszędzie**: przyciski, karty, pola, filtry, znaczniki, arkusze dolne, modale.
- **Brak cieni.** Hierarchię budują biel, czerń, linie 1 px i odstępy. Jedyny dozwolony cień to subtelny cień nad przyklejonym paskiem zakupu i arkuszem dolnym: `0 -4px 16px rgba(26,26,26,.08)`.
- Grubość linii:
  - 1 px dla separatorów,
  - 1,5 px dla konturów filtrów, pól i znaczników,
  - 2 px dla konturu przycisku drugorzędnego i obrysu fokusu.

### 5.2 Motyw: łamane płaszczyzny znaku

- **Ścięty narożnik (chamfer):** 28 px na mobile, 40 px na desktopie, zawsze pod kątem 45°. Domyślnie w prawym górnym rogu, alternatywnie w prawym dolnym.
- **Gdzie:** zdjęcie lub wideo otwarcia strony głównej, zdjęcie na karcie wydarzenia, wyróżniony kafel („Polecamy”), ewentualnie duże zdjęcie na podstronie cyklu lub festiwalu.
- **Limit:** maks. **1–2 ścięcia na ekran**. Nigdy na przyciskach, polach i filtrach.
- **Rytm pasów** ze znaku służy wyłącznie jako zasada siatki i kadrowania zdjęć, a nie jako ozdobnik.
- Implementacja: `clip-path: polygon(...)`.
  - `clip-path` obcina też `outline`, dlatego obrys fokusu rysujemy na elemencie nadrzędnym (wrapperze), a nie na elemencie przyciętym.

### 5.3 Heksagon

- **Wyłącznie** jako kształt przycisku asystenta AI: 56 × 56 px, czarny, ze złotym `#AD9450` napisem „AI” lub ikoną (5,91:1).
- Ewentualnie jako bardzo mały glif w ikonografii (wzorzec: Nowy Teatr).
- Nie jako wzór tła, dekoracja sekcji ani maska zdjęć.

### 5.4 Zakazane ozdobniki

Lista zakazów jest wiążąca, bo zespół wprost odrzucił „AI slop”.

- Kolorowe paski przy wierszach (np. 4 × 64 px), kropki kategorii, kolorowe kwadraciki przy etykietach.
- Gradienty, poświaty, glassmorphism, cienie kart, zaokrąglone „pigułki”.
- Jakakolwiek edycja zdjęć i grafik FS (§5.6).
- Emoji w UI, ilustracje stockowe „muzyczne” (nuty, skrzypce). Logo FS celowo nie jest muzyczne (transkrypcja).
- Slidery i karuzele z wieloma komunikatami, automatycznie przewijane treści.
- Animacje dekoracyjne, parallax, liczniki „odliczające”.

### 5.5 Ikony

- Ikony liniowe, siatka 24 px, kreska 1,5 px, zakończenia `square`, łączenia `miter`, zgodnie z ostrą geometrią. Biblioteka: np. Lucide z ustawieniami `strokeLinecap="square" strokeLinejoin="miter"`.
- Kolor ikon to `#2B2B2B`, a na czerni `#FFFFFF`. Ikony nie są złote.
- Ikona interaktywna ma pole dotyku min. **44 × 44 px**.
- Ikona bez widocznego tekstu dostaje `aria-label`. Ikona obok tekstu ma `aria-hidden="true"`.
- Zestaw ikon dostępności (§6.9) jest stały i zawsze opisany słowem.

### 5.6 Zdjęcia i wideo

- **Proporcje:**
  - 3:2 dla kart wydarzeń,
  - 16:9 lub 4:5 (mobile) dla otwarcia,
  - 1:1 dla miniatur artystów,
  - 3:4 dla portretów w profilu artysty.
- **Charakter:** światło, biel budynku, ludzie na sali i na scenie, prawdziwe emocje publiczności. Bez kolażu i ramek.
- **Zdjęcia i grafiki FS zawsze w oryginale (zakaz bezwzględny).** Zdjęcie pokazujemy dokładnie takie, jakie przyszło z danych FS (`koncerty.json` / CMS).
  - Bez przemalowywania, desaturacji, wycinania tła, filtrów, duotone, przyciemnień i nakładek gradientowych.
  - Kolory obecne na zdjęciu (np. pomarańczowe pasy cyklu jazzowego) **nie podlegają D6**. D6 dotyczy interfejsu, a nie treści wizualnych.
  - Dozwolone jest wyłącznie skalowanie i kadrowanie przez `object-fit` / `object-position`, bez edycji pliku.
- **Tekst na zdjęciu** kładziemy tylko tam, gdzie samo zdjęcie daje kontrast AA, np. na jego jednolitym tle.
  - Kontrast liczymy względem najmniej korzystnego miejsca pod tekstem.
  - Jeśli takiego miejsca nie ma, tekst idzie pod zdjęcie, a nie na nie.
- **Wideo** jest bez dźwięku, ma `playsinline`, przycisk **Pauza** widoczny w ≤ 3 s (WCAG 2.2.2) i nie startuje przy `prefers-reduced-motion: reduce`. Wyświetlamy wtedy kadr statyczny.
- **Wydajność:**
  - AVIF/WebP z `srcset` i `sizes`,
  - `loading="lazy"` poza pierwszym ekranem,
  - zdjęcie LCP z `fetchpriority="high"`,
  - placeholder w `#EDEBE5`.
- **Alt:** opisowy (kto, co, gdzie) w 3 językach. Zdjęcia czysto dekoracyjne mają `alt=""`.

### 5.7 Logo

- Znak i logotyp „FILHARMONIA SZCZECIN”: **czarne na jasnym, białe na ciemnym**. Bez deformacji, zmiany proporcji, obrysów i cieni.
- Pole ochronne to min. wysokość litery „F” logotypu z każdej strony. Wysokość minimalna to 32 px w nagłówku mobile i 40 px na desktopie.
- **Pliki w repozytorium:** `src/images/Filharmonia Szczecin_LOGO_ciemny znak, jasne tło.png` i `…_LOGO_jasny znak, ciemne tło.png` (PNG). Wersję SVG warto pozyskać od FS; obecna strona używa `logo_mono_dark.svg`.

---

## 6. Komponenty

Każdy komponent ma stany: domyślny, hover (tylko jako dodatek), **focus-visible**, aktywny/wciśnięty, wyłączony, błąd lub pusty (tam, gdzie dotyczy). **Żadna funkcja nie działa tylko po najechaniu kursorem.**

### 6.1 Przyciski

| Wariant | Wygląd | Użycie |
|---|---|---|
| **Główny** | tło `#1A1A1A`, tekst `#FFFFFF` Open Sans 600 16 px | „Kup bilet”, „Pokaż 24 wyniki”, „Wyślij zgłoszenie” |
| **Drugorzędny** | kontur 2 px `#2B2B2B`, tło przezroczyste, tekst `#2B2B2B` | „Zobacz wydarzenie”, „Dodaj do kalendarza” |
| **Odwrócony** (na czerni) | tło `#FFFFFF`, tekst `#1A1A1A`, albo kontur 2 px `#FFFFFF` | pasek zakupu, sekcje ciemne |
| **Tekstowy / link** | Open Sans 600, podkreślenie 1,5 px z `text-underline-offset: 3px` | „Pełny repertuar →” |
| **Ikonowy** | 44 × 44 px, bez tła, ikona 24 px | ulubione, udostępnij, zamknij |

**Wymiary:**

- Wysokość 52 px na mobile, 48 px na desktopie (minimum 44 px).
- Padding poziomy 20–24 px.
- Na mobile główne CTA w karcie ma pełną szerokość.

**Etykiety:**

- Zdania („Kup bilet”), bez wersalików.
- Strzałka „→” tylko przy linkach nawigacyjnych.
- **Cena przy CTA:** „Kup bilet · od 40 zł”.

**Stany:**

- **Hover głównego:** tło `#000000` i podkreślenie etykiety.
- **Hover drugorzędnego:** tło `#F7F6F2`.
- **Wyłączony:**
  - tło `#EDEBE5`, tekst `#5A5650`, `aria-disabled="true"`,
  - obok obowiązkowo powód słowem (np. „Wyprzedane · Powiadom mnie o zwrotach”).
- **Ładowanie:** etykieta zostaje, dochodzi wskaźnik i `aria-busy="true"`. Przycisk nie zmienia szerokości.

Na ekranie jest jeden przycisk główny na sekcję, a reszta to drugorzędne lub linki.

### 6.2 Fokus (obowiązkowy, widoczny)

- `:focus-visible { outline: 2px solid #1A1A1A; outline-offset: 2px; }`. Na ciemnym tle obrys jest `#FFFFFF`.
- Nie wolno używać `outline: none` bez zamiennika. Taki błąd ma np. Concertgebouworkest i tego nie powtarzamy.
- **WCAG 2.4.11 (Focus Not Obscured):** przyklejony nagłówek, dolna nawigacja i pasek zakupu nie mogą zasłaniać elementu z fokusem.
  - Stosujemy `scroll-padding-top` i `scroll-padding-bottom` równe wysokości tych pasków.

### 6.3 Nagłówek: desktop (≥ 1024 px)

- Wysokość 72 px, tło `#FFFFFF`, linia dolna 1 px `#DEDAD2`, przyklejony.
- Zawartość od lewej do prawej:
  - logo (link do strony głównej),
  - **menu 5 pozycji**: Repertuar · Dla Ciebie · EDUfilharmonia · Odkryj Filharmonię · Planuj wizytę,
  - pole **Szukaj** ze skrótem `/`,
  - przycisk **Asystent AI** (heksagon 40 px + słowo „Asystent”),
  - **PL | EN | DE**,
  - ikona **Moje konto**,
  - przycisk główny **Kup bilet** (prowadzi do kalendarza z filtrem „Dostępne”).
- **Wariant ciemny** (nad ciemnymi zdjęciami w hero i ciemnymi otwarciami podstron):
  - tło `#1A1A1A`, logo i menu białe, linia dolna 1 px `#3D3D3D`,
  - pole wyszukiwania z konturem `#8C8880` (≥ 3:1),
  - przycisk AI jako biały heksagon z czarnym „AI”,
  - „Kup bilet” jako przycisk odwrócony (biały).
  - Na mobile górny pasek też jest ciemny, a dolna nawigacja zostaje biała.
- Menu ma maks. 2 poziomy: rozwijany panel z listą podstron, otwierany kliknięciem, Enter lub spacją, a nie najechaniem. Każda treść jest osiągalna w ≤ 2 krokach.
- **Okruszki** pod nagłówkiem na podstronach głębszych niż 1 poziom.
- Pierwszym elementem w DOM jest **skip link**: „Przejdź do treści”. Ma być to `<a>`, nie `<button>` jak na obecnej stronie, i ma być widoczny przy fokusie.

### 6.4 Nawigacja: mobile (< 1024 px)

- **Górny pasek** (56 px): logo, przełącznik **PL | EN | DE** (kompaktowy, 44 px) i przycisk **Menu** (44 × 44, pełna lista sekcji z tej samej struktury co desktop).
- **Dolna nawigacja** (64 px + `env(safe-area-inset-bottom)`), tło `#FFFFFF`, linia górna 1 px, 5 pozycji z ikoną i **zawsze widocznym** podpisem:
  1. **Kalendarz**
  2. **Szukaj**
  3. **Asystent**: heksagon 56 px wystający 16 px ponad pasek, czarny, ze złotym „AI”
  4. **Planuj wizytę**
  5. **Konto** (ulubione, bilety, powiadomienia)
- **Aktywna pozycja:** ikona wypełniona, podpis Open Sans 700 i linia 2 px `#1A1A1A` u góry, plus `aria-current="page"`. Nie oznaczamy jej samym kolorem.
- Na karcie wydarzenia **dolną nawigację zastępuje przyklejony pasek zakupu** (§6.11). Nawigacja wraca po przewinięciu w górę albo jest dostępna przez przycisk wstecz.
- **Wstecz zachowuje filtry** (stan w URL).

### 6.5 Otwarcie strony głównej (hero)

Wzorzec: Figma, „Hero · mobile 360 — v4 (zdjęcie oryginalne od użytkownika)” (17.10.2026, wydarzenie: Paulina Przybysz | Insides). Wersje v1–v3 i desktop są odrzucone.

- **Jedno** zdjęcie lub krótkie wideo (bez dźwięku) i **najbliższe wydarzenie** z CTA. **Bez slidera.** Mało tekstu: odbiorca ma w 3 sekundy wiedzieć *kto, kiedy, kup*. Wzorzec układu: Philharmonie Luxembourg.
- **Zdjęcie jest tłem całego hero:** od górnej krawędzi ekranu do dolnej nawigacji, czyli 360 × 716 px na mobile.
  - **Zawsze w oryginale** (§5.6), skalowane przez `object-fit: cover` i kadrowane na twarz przez `object-position`.
  - Nagłówek leży na zdjęciu (przezroczysty). Logo, PL i menu dostają kolor zapewniający AA względem tła zdjęcia:
    - czarne na jasnym tle (na tym zdjęciu 8,5:1),
    - na ciemnym tle wariant ciemny (§6.3).
- **Tekst nie leży bezpośrednio na zdjęciu**, chyba że pomiar pokaże AA w całym obszarze tekstu.
  - Na zdjęciu z v4 czarny tekst miałby miejscami tylko 1,9–2,8:1 (cienie kurtki, zamek, warkocz).
  - Dlatego treść stoi na **białym panelu** (`#FFFFFF`, jednolity, bez przezroczystości). Panel przykrywa dolną część zdjęcia i ma ścięty prawy górny narożnik 28 px (motyw znaku, §5.2).
  - Panel to element UI na zdjęciu, a nie modyfikacja zdjęcia.
- **Zawartość panelu (mobile, od y ≈ 500 do 716):**
  1. Eyebrow: `RODZAJ · DZIEŃ DATA · GODZINA`, Open Sans 700 12 px, `#8A6D2F`.
  2. **H1:** nazwa artysty lub tytuł, Titillium 600, 38 px, `#8A6D2F`, w jednej linii, a jeśli jest dłuższa, maks. 2 linie.
  3. Podtytuł (nazwa projektu lub programu): Titillium 600, 20 px, `#2B2B2B`.
  4. Dwa przyciski równej szerokości: **„Kup bilet”** (główny, czarny) + **„Zobacz”** (drugorzędny, czarny kontur).
- **Dolna nawigacja** (§6.4) zostaje na dole ekranu.
- **Po przewinięciu** (Figma: „Hero · mobile 360 — v4 · ekran 2”):
  - Nagłówek jest przyklejony i dostaje białe tło z linią 1 px `#DEDAD2`.
  - Zdjęcie przewija się normalnie, bez parallaxu, a panel jedzie razem z treścią.
  - Pod przyciskami, w tej kolejności:
    1. **„Posłuchaj fragmentu · 1 min · bez reklam”**: przycisk ▶ 44 px z czarnym konturem.
    2. **Jedno zdanie „dlaczego warto”**: Open Sans 16 px, `#2B2B2B`, maks. 3 linie, z pola `briefing`/opisu.
    3. **Lista faktów** (`<dl>`, etykiety Open Sans 600 14 px `#5A5650`, wartości 15 px `#2B2B2B`, linie 1 px nad i pod), z pozycjami:
       - Kiedy,
       - Gdzie,
       - Skład (np. „Paulina Przybysz i 5 muzyków”, link do składu),
       - Cykl (link).
       - Cenę dodajemy, gdy jest w danych. W `koncerty.json` dla tego wydarzenia `prices_pln` jest puste.
    4. Następna sekcja strony głównej: **„Dziś w Filharmonii”** (h2 złoty) z wierszami jak w kalendarzu (§6.7).
  - Każdy link w liście faktów ma pole dotyku min. 44 px wysokości.
- **Bez:** opisu wydarzenia, ceny w CTA hero (cena jest na karcie wydarzenia), wielu wydarzeń i kropek paginacji.
- Przycisk „Posłuchaj fragmentu” i pasek „Dziś” są poza hero, w następnych sekcjach strony głównej.
- Kolejność w DOM jest taka sama jak wizualna. Alt zdjęcia nazywa artystę.
- **Desktop:** jeszcze nie projektujemy. Wersja desktop powstaje dopiero po akceptacji zespołu.
- Wideo ma przycisk „Pauza” (WCAG 2.2.2).

### 6.6 Filtry kalendarza

**Szybkie filtry** (poziomy pasek, przewijany na mobile, z widocznym ucięciem ostatniego elementu jako wskazówką):

- Lista: **Dziś · Ten weekend · Dla dzieci · Jazz · Wystawy** (z briefu) oraz „Wszystkie filtry (n)”.
- **Kształt:** wysokość 44 px, kontur 1,5 px `#2B2B2B`, Open Sans 600 15 px.
- **Wybrany filtr:** tło `#1A1A1A`, tekst biały, ikona ✓ przed etykietą i `aria-pressed="true"`.

**Pełne filtry** (wartości z briefu §6.2):

- Kiedy, Rodzaj, Dla kogo (z wiekiem), Nastrój, Miejsce, Cena, Czas trwania, Dostępność, Wykonawca/kompozytor/cykl (pole wyszukiwania).
- **Mobile:** **arkusz dolny** na ~90% wysokości:
  - nagłówek „Filtry” z przyciskiem Zamknij,
  - sekcje rozwijane,
  - przyklejona stopka z **„Wyczyść”** (link) i **„Pokaż 24 wyniki”** (przycisk główny, licznik na żywo).
- **Desktop:** boczna kolumna 280 px po lewej albo pasek nad listą.
- **Licznik wyników:** komunikat `aria-live="polite"` („24 wydarzenia”), aktualizowany z opóźnieniem ok. 300 ms.
- **Stan w URL:** każdy zestaw filtrów można udostępnić linkiem.
- **Cena i zakres dat:** zamiast suwaka pola liczbowe lub predefiniowane progi (bezpłatne, do 50 zł, do 100 zł). Jeśli jest suwak, musi mieć alternatywę bez przeciągania (WCAG 2.5.7).
- **Zakres dat:** natywny `<input type="date">` lub kalendarz obsługiwany klawiaturą.

### 6.7 Wiersz wydarzenia (lista kalendarza)

Wzorzec: Figma, tablica 6, kolumna „Kalendarz”.

```
[19:00]  Mahler. Symfonia nr 5                      ← Titillium 600 17/20 px, #2B2B2B
         Sala Symfoniczna · od 40 zł · 1 h 45 min   ← meta, #5A5650
         SYMFONICZNY            [Ostatnie miejsca]  ← label + znacznik statusu
         ♿ Wózek  AD  Pętla                         ← znaczniki dostępności (gdy są)
──────────────────────────────────────────────────── 1 px #DEDAD2
```

- **Lista dzieli się po dniach.** Nagłówek dnia (h3, złoty, np. „Sobota, 24 października”) ma linię 1 px `#2B2B2B` pod spodem i jest przyklejony podczas przewijania.
- **Kolumna godziny** ma 56 px, Titillium 600 18 px, `tabular-nums`. W widokach z różnymi dniami (np. podstrona cyklu) pokazujemy datę „24.10” i dzień tygodnia pod nią.
- **Na desktopie** po prawej jest miniatura 3:2 (160 × 107 px) albo wiersz bez zdjęcia, gdy na liście jest dużo pozycji (wzorzec: Nowy Teatr).
- **Cały wiersz jest linkiem.** Tekstem linku jest tytuł; techniką „rozciągniętego linku” tytuł ma `::after` z `inset: 0`. Przycisk Ulubione (44 × 44) leży poza linkiem.
- **Brak kolorowych pasków i kropek** (D5).
- **Stan „brak wyników”:**
  - nagłówek „Nic nie pasuje do tych filtrów”,
  - lista aktywnych filtrów z „×” do usunięcia pojedynczego,
  - 3 propozycje alternatyw (np. „Ten sam rodzaj w przyszły weekend”),
  - link „Wyczyść filtry”.

### 6.8 Znacznik statusu biletów

| Status | Wygląd | Tekst |
|---|---|---|
| Dostępne | kontur 1,5 px `#2B2B2B`, tekst `#2B2B2B` | „Dostępne” |
| Ostatnie miejsca | tło `#1A1A1A`, tekst `#FFFFFF` | „Ostatnie miejsca” (opcjonalnie „Zostały 3”, wzorzec: Berlin) |
| Wyprzedane | tło `#EDEBE5`, tekst `#5A5650` | „Wyprzedane” + link „Powiadom o zwrotach” na karcie |
| Wstęp wolny | kontur 1,5 px | „Wstęp wolny” |
| Zapisy (EDU) | kontur 1,5 px | „Zapisy” / „Dla grup szkolnych” |
| Sprzedaż wkrótce | kontur przerywany 1,5 px | „Sprzedaż od 1.12” |

- Wysokość 24 px, padding 0 8 px, Open Sans 600 13 px, promień 0.
- **Status zawsze słowem.** W komponencie stosujemy `role="status"` tylko wtedy, gdy status zmienia się na żywo.

### 6.9 Znaczniki dostępności przy wydarzeniu

To wyróżnik konceptu: prawie żaden serwis z inspiracji tego nie ma (wyjątki to Philharmonie de Paris i Nowy Teatr).

| Grupa | Znaczniki (ikona + słowo) |
|---|---|
| Ruchowa | „Dostęp dla wózków”, „Miejsca dla wózków”, „Winda” |
| Wzrokowa | „Audiodeskrypcja (AD)”, „Program w druku powiększonym / online” |
| Słuchowa | „Pętla indukcyjna”, „Tłumaczenie PJM”, „Napisy” |
| Sensoryczne | „Głośno” / „Umiarkowanie” / „Cicho”, „Zmienne światło”, „Czas: 1 h 45 min”, „Przerwa: 20 min”, „Koncert relaks” |

- **Lista:** maks. 3 najważniejsze znaczniki w skrócie (ikona 20 px + krótkie słowo). Gdy jest ich więcej: „+2”.
- **Karta wydarzenia:** pełna sekcja **„Dostępność i informacje sensoryczne”** z opisem słowami, np. „Sala Symfoniczna: wejście bez progów, miejsca dla wózków w rzędzie 1”.
- Te same znaczniki są **filtrem** w kalendarzu.
- Ikony są monochromatyczne i zawsze mają tekst. Nigdy nie stosujemy tooltipa jako jedynego opisu.

### 6.10 Karta wydarzenia (kafel: strona główna, rekomendacje, wyniki „Pomóż mi wybrać”)

- **Zdjęcie 3:2.** W lewym górnym rogu czarny znacznik daty („SOB 24.10”, Open Sans 700 13 px, biały). Ścięty narożnik tylko na kaflu wyróżnionym.
- **Pod zdjęciem:**
  - eyebrow (rodzaj, złoty),
  - tytuł (`title-card`, `#2B2B2B`),
  - meta (godzina · sala · czas),
  - cena „od X zł” + status,
  - opcjonalnie 1 zdanie „dlaczego warto”.
- **CTA:** w wynikach „Pomóż mi wybrać” i odpowiedziach AI dwa przyciski: **„Zobacz”** (drugorzędny) i **„Kup bilet”** (główny).
- Rozmieszczenie: 1 kolumna (mobile), 2 kolumny (600+), 3 kolumny (1024+).
- Na mobile poziome przewijanie dopuszczamy tylko dla „Polecamy” i „Podobne wydarzenia”. Wtedy widać fragment następnej karty, a na desktopie są przyciski ← →. **Bez autoprzewijania.**

### 6.11 Karta wydarzenia: strona (`/wydarzenia/[slug]`)

**Pierwszy ekran bez przewijania (360 × ~640 px): CO? KIEDY? GDZIE? ZA ILE? DLA KOGO? KUP BILET**

1. Zdjęcie 3:2 (może mieć ścięty narożnik).
2. Eyebrow: rodzaj · wykonawca główny, złoty.
3. **H1** tytuł (złoty, Titillium).
4. Lista faktów (`<dl>`), etykieta Open Sans 600 `#5A5650`, wartość `#2B2B2B`:
   - **Kiedy:** pt 24.10 · 19:00–20:45, z przerwą
   - **Gdzie:** Sala Symfoniczna (link do planu i dojazdu)
   - **Za ile:** 40–120 zł
   - **Dla kogo:** dorośli i młodzież od 12 lat
5. Link do cyklu lub festiwalu: „Cykl: Filharmonia Light →” (zwykły link, **bez koloru cyklu**).

**Przyklejony pasek zakupu (mobile)**, tło `#1A1A1A`, wysokość 76 px + safe area:

- po lewej „od 40 zł” (Titillium 600 22 px, biały) i status („ostatnie miejsca”, `#CFCBC2`),
- po prawej przycisk odwrócony **„Kup bilet”**.

**Desktop:** układ 2 kolumn. Treść zajmuje 7/12 po lewej, a **przyklejony panel biletowy** 4/12 po prawej (data, godzina, sala, cena, status, Kup bilet, Dodaj do kalendarza, Udostępnij, Ulubione).

**Dalej, w tej kolejności:**

1. **Dlaczego warto przyjść.** 2–3 zdania, `body-lg`.
2. **Kto występuje.** Lista z miniaturami 1:1 i linkami do profili.
3. **Co zagramy.** Program: kompozytor, utwór, czas. Przy utworze **odsłuch ok. 1 min** (§6.12).
4. **Ile to potrwa.** Godzina zakończenia, przerwa.
5. **Dostępność i informacje sensoryczne** (§6.9).
6. **Program koncertu do pobrania** (PDF dostępny, z tagami) **i wersja online.** Programy papierowe zniknęły od tego sezonu, a publiczność 50+ z nich korzystała (transkrypcja).
7. **Pierwszy raz w Filharmonii?** Karty „Czego się spodziewać”:
   - strój (np. „Przyjdź tak, jak lubisz”),
   - kiedy przyjść,
   - szatnia,
   - przerwa,
   - oklaski.
   Odpowiadają na największą obawę debiutantów z badań FS: niewłaściwy ubiór. Wzorzec: COA „What to expect”.
8. **Akcje natywne:**
   - Dodaj do kalendarza (.ics / Google),
   - Udostępnij (Web Share API),
   - Nawiguj (link do natywnej aplikacji map),
   - Zadzwoń do kasy (`tel:`),
   - docelowo bilet w portfelu.
9. **Podobne wydarzenia.** 3–4 karty, z pierwszeństwem dla wydarzeń promowanych przez FS.

**Wydarzenie zewnętrzne** (organizowane przez kogoś innego): wyraźny znacznik „Organizator zewnętrzny”. CTA prowadzi do sprzedawcy i ma etykietę „Kup bilet u organizatora ↗”. Transkrypcja podkreśla, że dla użytkownika nie ma znaczenia, kto organizuje, ale musi wiedzieć, gdzie kupić bilet.

### 6.12 Odtwarzacz fragmentu (ok. 1 min)

- Wiersz utworu:
  - przycisk ▶/❚❚ 44 × 44 (kontur 1,5 px),
  - kompozytor i tytuł,
  - pasek postępu (1,5 px `#2B2B2B` na `#DEDAD2`, uchwyt 16 px),
  - czas „0:24 / 1:00”,
  - link „Pełne nagranie ↗”.
- **Bez autoodtwarzania.** Jednocześnie gra tylko jeden fragment. Odtwarzanie można przerwać klawiszem spacji, gdy przycisk ma fokus.
- Przycisk ma opis „Odtwórz fragment: Mahler, Adagietto (1 min)”. Pasek postępu to `role="slider"` z obsługą strzałek.
- Odtwarzacz nie zależy od dostawcy (pliki FS lub platforma streamingowa). Wewnątrz strony nie ma reklam ani osadzonego YouTube.
- Dźwięk jest kluczowy, bo „dzisiejszy świat to kultura audialna” (transkrypcja).

### 6.13 „Pomóż mi wybrać” (5 pytań → 3–5 propozycji)

- Ekran pytania:
  - nagłówek „Krok 2 z 5” (tekst + 5 segmentów postępu: aktywne `#1A1A1A`, pozostałe `#DEDAD2`),
  - pytanie jako H2,
  - odpowiedzi jako **duże karty-przyciski** (min. 56 px wysokości, kontur 1,5 px, wybrana: tło `#1A1A1A` + ✓).
- Pytania:
  1. Dla kogo?
  2. Kiedy?
  3. Jaki rodzaj muzyki?
  4. Jaki klimat?
  5. Jaki budżet?
- Odpowiedzi do pytania o klimat są **opisowe i obrazowe**, np. „Coś energetycznego”, „Na wyciszenie”, „Wielkie emocje”, „Coś niezwykłego”. Mogą mieć opcjonalny fragment audio 10 s (wzorzec: Oslo, smaksguide).
- Nawigacja:
  - **„Pomiń”** przy każdym pytaniu,
  - **„Wstecz”** zachowuje odpowiedzi,
  - zmiana odpowiedzi nie resetuje kreatora,
  - stan zapisany w URL.
- **Wynik:** 3–5 kart (§6.10) z „Zobacz” i „Kup bilet” oraz zdaniem, dlaczego pasuje („Bo wybrałeś: wieczór, do 60 zł, energetycznie”). Do tego link „Pokaż wszystkie w kalendarzu” z ustawionymi filtrami.
- Gdy brak dopasowań: najbliższe alternatywy i informacja, który warunek je wyklucza.

### 6.14 Asystent AI

- **Wejście:** heksagon w dolnej nawigacji (mobile) albo przycisk „Asystent” w nagłówku (desktop). **Nigdy nie otwiera się sam.** To antywzorzec z omn.art.pl, gdzie okno otwiera się po 12 s.
- **Panel:** pełnoekranowy arkusz (mobile) albo szuflada 420 px z prawej (desktop).
  - `role="dialog"`, `aria-modal="true"`, pułapka fokusu, Esc zamyka.
  - Po zamknięciu fokus wraca na przycisk otwierający.
- **Na starcie:**
  - nota RODO w 1 zdaniu („Nie podawaj danych osobowych. Odpowiadam tylko na podstawie informacji Filharmonii.”) z linkiem do polityki,
  - 3–4 **sugerowane pytania** jako przyciski konturowe („Co gramy w sobotę?”, „Czy sala jest dostępna dla wózków?”).
- **Odpowiedź:**
  - krótki tekst + **karta wydarzenia z przyciskami „Zobacz wydarzenie” i „Kup bilet”**,
  - pod odpowiedzią **źródło**: „Źródło: strona wydarzenia · Planuj wizytę”, z linkami.
- **Gdy asystent nie wie:** „Nie mam tej informacji.” + przyciski „Zadzwoń do kasy” (`tel:`) i „Napisz do nas”. Asystent nigdy nie zgaduje.
- **Wiadomości:** dymki użytkownika `#1A1A1A`/biały tekst, odpowiedzi bez tła z linią 1 px po lewej. Nowe odpowiedzi ogłaszamy w `aria-live="polite"`.
- Działa w PL / EN / DE zgodnie z wersją językową strony.

### 6.15 Wyszukiwarka

- **Pole** z widoczną etykietą („Szukaj wydarzeń, artystów, utworów”) i przykładem w placeholderze („np. jazz w październiku”).
  - Wysokość 52 px, kontur 1,5 px, ikona lupy, przycisk wyczyść 44 px.
  - Na desktopie skrót `/`.
- **Wyniki pogrupowane:** Wydarzenia · Artyści · Utwory · Teksty i materiały. Każda grupa ma nagłówek h3 i licznik.
- **Tolerancja literówek i braku polskich znaków** („karlowicz” = „Karłowicz”). Podpowiedzi to `role="listbox"` z obsługą strzałek (wzorzec ARIA combobox).

### 6.16 Widok miesiąca (desktop, opcja obok listy)

- **Przełącznik:** „Lista | Miesiąc”, pierwszy wybór domyślny na każdej szerokości. Pozycje są przyciskami z `aria-pressed`.
- **Widok w URL**, jak filtry: `?widok=miesiac` (lista nie dodaje parametru). „Wstecz” z karty wydarzenia wraca do tego samego widoku, a link z parametrem otwiera od razu siatkę (np. scenariusz F na pokazie).
- **Siatka 7 kolumn:**
  - komórka dnia pokazuje numer (Titillium 600) i do 2 tytułów wydarzeń, resztę jako „+3 więcej”,
  - dzień bieżący oznaczony obrysem 2 px `#1A1A1A` i słowem „dziś”.
- **Obsługa klawiaturą:** strzałki między dniami, Enter otwiera listę dnia.
- Służy scenariuszowi F (nauczyciel porównuje terminy).

### 6.17 Formularze (zapisy EDU, zgłoszenie grupy, newsletter, konto)

- **Etykieta nad polem** (Open Sans 600 15 px). Nie stosujemy placeholdera jako jedynej etykiety. Pole jest wymagane, gdy etykieta ma słowo „(wymagane)”; sama gwiazdka nie wystarczy.
- **Pole:** wysokość 52 px, kontur 1,5 px `#2B2B2B` (14:1, a WCAG 1.4.11 wymaga min. 3:1), promień 0. Fokus: obrys 2 px.
- **Błąd** (bez czerwieni, D3):
  - kontur pola 3 px `#1A1A1A`,
  - ikona ostrzeżenia,
  - komunikat pod polem zaczynający się od **„Błąd:”** (Open Sans 600) z instrukcją naprawy,
  - powiązanie przez `aria-describedby`, `aria-invalid="true"`,
  - po wysłaniu podsumowanie błędów na górze z linkami do pól i fokus na podsumowaniu.
- **Bez limitów czasu** w formularzach i koszyku (WCAG 2.2.1). Rezerwację miejsc na planie sali można przedłużyć jednym przyciskiem, a ostrzegamy co najmniej 20 s przed końcem.
- **WCAG 2.2:**
  - 3.3.7 *Redundant Entry*: nie każemy wpisywać ponownie tych samych danych w procesie zakupu,
  - 3.3.8 *Accessible Authentication*: logowanie bez testów poznawczych, z obsługą menedżerów haseł i wklejania kodu oraz z logowaniem linkiem e-mail.
- Atrybuty `autocomplete` (name, email, tel), właściwy `inputmode`. Grupy pól jako `<fieldset>` + `<legend>`.

### 6.18 Pozostałe

- **Okruszki** (desktop): Open Sans 14 px, separator „/”, ostatni element bez linku z `aria-current="page"`.
- **Przełącznik języka:** „PL | EN | DE”, aktywny język pogrubiony i z `aria-current`. Każdy link ma `lang` i `hreflang`. Po zmianie języka użytkownik zostaje na tej samej podstronie.
- **Kafle „Odkryj Filharmonię”:** Orkiestra, Budynek, Historia, Wystawy, EDUfilharmonia, Zwiedzanie.
  - Zdjęcie 3:2 + nazwa (h3, `#2B2B2B`) + 1 linia opisu.
  - Na mobile siatka 2 × 3, na desktopie 3 × 2.
- **Kategorie nastrojów / „Dla Ciebie”:**
  - kafle tekstowe na `#FFFFFF` z konturem 1,5 px: „Zacznij tutaj”, „Dla rodzin”, „Jeśli lubisz jazz”, „Jeśli lubisz muzykę filmową”, „Jeśli masz 30 minut”, „Coś niezwykłego”,
  - kafel „Pomóż mi wybrać” biały na czarnej sekcji (D8).
- **Oś czasu historii:**
  - pionowa na mobile, pozioma przewijana na desktopie, z przyciskami ← → i obsługą klawiaturą,
  - dekady 1948 → dziś, a lata zapisane Titillium 600 w złocie jako nagłówki.
- **Powiadomienia** (panel klienta):
  - lista z ikoną, tekstem („Koncert, który obserwujesz, prawie się wyprzedał”) i CTA,
  - komunikaty systemowe (toast) mają `role="status"`, nie znikają przed upływem 6 s i można je zamknąć.
- **Baner zgód (RODO):**
  - na dole ekranu, bez blokowania treści,
  - przyciski **„Odrzuć”** i **„Akceptuj”** o równej wadze (oba drugorzędne) oraz „Ustawienia”,
  - analityka startuje dopiero po zgodzie.
- **Stopka:** tło `#1A1A1A`, logo białe.
  - Kolumny: Partnerzy i biznes · Strefa mediów · Kontakt · O instytucji · **Deklaracja dostępności**.
  - Newsletter nad stopką.
  - Linki białe, podkreślone przy hover i fokusie.
- **Stała pomoc** (WCAG 3.2.6 *Consistent Help*): „Kontakt z kasą” (telefon, godziny) jest zawsze w tym samym miejscu, czyli w stopce i w Planuj wizytę.

---

## 7. Układ kluczowych ekranów

### 7.1 Strona główna (kolejność bloków, mobile; desktop: te same bloki szerzej)

1. **Otwarcie:** jedno zdjęcie lub wideo + najbliższe wydarzenie z CTA (§6.5).
2. **Dziś w Filharmonii** (h2 złoty): koncert, wystawa otwarta do…, zwiedzanie o godz. Lista 2–4 wierszy. Gdy dziś nic się nie dzieje: „Jutro w Filharmonii”.
3. **Najbliższe wydarzenia:** 3–6 kart + przycisk drugorzędny „Pełny repertuar →”.
4. **Polecamy:** wybór redakcji, 1 kafel wyróżniony (ścięty narożnik) + 2 mniejsze.
5. **Dla Ciebie:** kafle nastrojów + „Pomóż mi wybrać”.
6. **Odkryj Filharmonię:** 6 kafli (§6.18).
7. **Newsletter** (1 pole + zgoda RODO), **partnerzy** (logotypy w szarości z linkiem do narracji partnerstwa), **stopka**.

Strona główna i repertuar to razem ~25% wyświetleń, dlatego **droga do kalendarza musi być krótka z każdego miejsca**. Kalendarz jest pierwszą pozycją dolnej nawigacji i menu.

### 7.2 Kalendarz (`/repertuar`)

- **Mobile:**
  - H1 „Repertuar”,
  - pole wyszukiwania w filtrze,
  - szybkie filtry,
  - licznik wyników,
  - lista dni (§6.7).
- **Desktop:** filtry w lewej kolumnie (3/12), lista w 9/12, a przełącznik Lista/Miesiąc nad listą.
- Podpowiedzi w polu wyszukiwania pokazują przykłady pytań z briefu: „Co jest w ten weekend?”, „Co mogę zrobić z 5-letnim dzieckiem?”, „Jakie wystawy są teraz otwarte?”.

### 7.3 Planuj wizytę

- Krótkie odpowiedzi w formie **akordeonów** (`<details>`/`<summary>` lub przyciski z `aria-expanded`), w kolejności:
  1. jak kupić bilet,
  2. jak dojechać (mapa + „Nawiguj”),
  3. parking,
  4. kasa (godziny, `tel:`),
  5. kiedy przyjść,
  6. szatnia,
  7. toalety,
  8. wejście,
  9. sale,
  10. dostępność.
- Plan budynku z opisem tekstowym, nie tylko jako obraz.
- **Najczęstsze pytania (`/faq`):** te same fakty w formie pytań, w grupach według przebiegu wizyty (bilety i kasa → dojazd i parking → przed koncertem → na sali → dostępność → budynek), ze spisem grup na górze, akordeonami jak wyżej i stałą pomocą na końcu (asystent, kasa). Dane strukturalne `FAQPage`. Wejścia: stopka (pierwsza pozycja), menu (grupa Planuj wizytę), link na „Planuj wizytę” i w bloku „Pierwszy raz w Filharmonii?” na karcie wydarzenia.
- Ponad 70% użytkowników jest spoza Szczecina, dlatego dojazd i parking są pierwsze po zakupie biletu.

### 7.4 EDUfilharmonia

- Wejścia według grup (kafle tekstowe): dzieci · rodziny · przedszkola · szkoły · młodzież · nauczyciele · młodzi muzycy · dorośli.
- Karta oferty od razu pokazuje: **wiek, czas trwania, cenę, dla kogo, miejsce, jak się zapisać, co uczestnik zyska**.
- **Sposób rezerwacji** (bilet / zapis / grupa szkolna) to wyraźna etykieta i różny przycisk: „Kup bilet” / „Zapisz się” / „Zgłoś grupę”.
- Poranki dla najmłodszych (od 1. roku życia) wyprzedają się w minuty, więc mają widoczny termin startu sprzedaży i opcję „Powiadom mnie”.

### 7.5 Podstrona cyklu lub festiwalu

- **Bez koloru cyklu (D6).** Nagłówek:
  - eyebrow „CYKL · SEZON 2026/27”,
  - H1 złoty, opis,
  - duże zdjęcie (dozwolony ścięty narożnik),
  - przycisk główny „Kup karnet · od X zł”.
- Dalej: program (lista jak w kalendarzu), artyści, zasady biletów i karnetów, partnerzy.
- Festiwale są podstronami serwisu (wyjątek: ILYO). Wspólny nagłówek i koszyk, wzorzec: Gewandhaus.

---

## 8. Ruch i animacje

- **Dozwolone:**
  - przejścia `opacity` i `transform` 150–250 ms z `ease-out`: wjazd arkusza dolnego, rozwinięcie akordeonu, zmiana stanu przycisku,
  - wskaźnik ładowania.
- **Niedozwolone:** parallax, animacje przy przewijaniu, autoprzewijane karuzele, „sprężynujące” efekty, animowane tła.
- **`prefers-reduced-motion: reduce`:** wszystkie przejścia skracamy do 0–1 ms, a wideo w otwarciu zastępujemy kadrem.
- Dodatkowo w ustawieniach strony jest przełącznik „Ogranicz animacje”, zgodnie z wymaganiem briefu o możliwości wyłączenia animacji.

---

## 9. Dostępność: WCAG 2.2 AA (pełna checklista projektowa)

### 9.1 Postrzegalność

- [ ] Kontrast tekstu ≥ 4,5:1, dużego (≥ 24 px lub ≥ 18,66 px bold) ≥ 3:1. Komponenty UI i grafiki informacyjne ≥ 3:1 (§2.2).
- [ ] Informacja nie jest przekazywana samym kolorem (statusy, filtry, nawigacja, błędy).
- [ ] Skalowanie do 200% i reflow przy 320 px bez utraty funkcji i bez przewijania w poziomie.
- [ ] Odstępy tekstu (1.4.12) nie łamią układu.
- [ ] Opisy alternatywne zdjęć w PL / EN / DE. Napisy do wideo, transkrypcje audio, opis tekstowy planu sali i budynku.
- [ ] Wideo i animacje można zatrzymać. Brak dźwięku automatycznego.

### 9.2 Funkcjonalność

- [ ] Pełna obsługa klawiaturą. Logiczna kolejność fokusu. Brak pułapek klawiatury poza modalami (Esc zamyka modal).
- [ ] Widoczny fokus 2 px (§6.2), niezasłonięty przez przyklejone paski (2.4.11).
- [ ] Skip link „Przejdź do treści” (`<a>`). Landmarki: `header`, `nav` (z etykietami: „Główne”, „Dolne”), `main`, `footer`.
- [ ] Cele dotykowe **min. 44 × 44 px** (brief; WCAG 2.5.8 wymaga 24 px). Odstęp ≥ 8 px.
- [ ] Brak interakcji tylko na hover. Brak gestów wielopalcowych. Przeciąganie (suwaki, plan sali) ma alternatywę przyciskami lub polami (2.5.7).
- [ ] **Wybór miejsc na planie sali** działa na telefonie i klawiaturą: lista sektorów i rzędów jako alternatywa dla mapy, miejsca jako przyciski z opisem („Rząd 5, miejsce 12, 80 zł, dostępne”).
- [ ] Brak limitów czasu w formularzach i koszyku albo możliwość ich wydłużenia.

### 9.3 Zrozumiałość

- [ ] `lang` na `<html>` (pl / en / de) i `lang` przy fragmentach w innym języku (tytuły utworów).
- [ ] Spójna nawigacja i pomoc w tym samym miejscu (3.2.3, 3.2.6).
- [ ] Etykiety pól, instrukcje, komunikaty błędów z podpowiedzią naprawy (3.3.1–3.3.3), bez powtórnego wpisywania (3.3.7), dostępne logowanie (3.3.8).
- [ ] Język prosty. Docelowo moduł **ETR** (tekst łatwy do czytania) i treści w **PJM** dla kluczowych informacji (kup bilet, dojazd, dostępność).

### 9.4 Solidność

- [ ] Semantyczny HTML. Własne komponenty zgodne z wzorcami ARIA APG (dialog, combobox, tabs, disclosure, slider).
- [ ] Komunikaty dynamiczne przez `aria-live`: licznik wyników, odpowiedzi AI, statusy koszyka.

### 9.5 Test (rezultat 6 briefu: raport dostępności)

- Automat: axe DevTools lub Lighthouse na stronie głównej, w kalendarzu, na karcie wydarzenia, w „Pomóż mi wybrać” i w asystencie.
- Ręcznie:
  - przejście ścieżki A samą klawiaturą,
  - VoiceOver (iOS Safari) i TalkBack (Android Chrome), bo to dominujące platformy (Android 5,4 tys., iOS 4,6 tys.),
  - zoom 200%,
  - 320 px,
  - `prefers-reduced-motion`.

---

## 10. Treść i ton

- **Profesjonalnie, ale po ludzku.** Wzór: „Usłyszymy jedną z najważniejszych symfonii Mahlera w wykonaniu Orkiestry Filharmonii.” Bez żargonu („opus”, „tutti”) bez objaśnienia. Mówimy do czytelnika, nie o instytucji.
- **Krótko:** akapit do 3 zdań, „Dlaczego warto przyjść” w 2–3 zdaniach. Na mobile czytelnik skanuje tekst.
- **Formaty:**
  - data: „pt 24.10” na listach, „piątek, 24 października 2026” w nagłówkach,
  - godzina: „19:00”, zakres „19:00–20:45”,
  - czas: „1 h 45 min, z przerwą”,
  - cena: „od 40 zł”, zakres „40–120 zł”, „Wstęp wolny”.
  - Twarde spacje: `40 zł`, `1 h`, `nr 5`, `z przerwą`.
  - Cudzysłowy „…”, półpauza „–” w zakresach.
- **Spójne etykiety akcji** (tłumaczenia obowiązkowe, menu i treści):

| PL | EN | DE |
|---|---|---|
| Kup bilet | Buy tickets | Tickets kaufen |
| Zobacz wydarzenie | View event | Zur Veranstaltung |
| Repertuar | What's on | Spielplan |
| Planuj wizytę | Plan your visit | Besuch planen |
| Pomóż mi wybrać | Help me choose | Hilf mir bei der Wahl |
| Asystent | Assistant | Assistent |
| Dostępne / Ostatnie miejsca / Wyprzedane | Available / Last tickets / Sold out | Verfügbar / Letzte Karten / Ausverkauft |
| Dodaj do kalendarza | Add to calendar | Zum Kalender hinzufügen |

- Etykiety w niemieckiej i angielskiej wersji bywają o ~30% dłuższe, więc przyciski i nawigacja muszą to znieść (brak stałych szerokości, zawijanie w kartach).

---

## 11. Wydajność

- **Cel:** LCP < 2,5 s, CLS < 0,1, INP < 200 ms na telefonie średniej klasy w sieci 4G, także przy słabym zasięgu.
- **Fonty:** 2 kroje × maks. 3 odmiany, podzbiór `latin-ext`, `font-display: swap`, preload tylko 2 plików.
- **Zdjęcia:** responsywne (§5.6), budżet otwarcia ≤ 200 KB na mobile. Wideo w otwarciu ≤ 2 MB, z kadrem zastępczym.
- Bez ciężkich bibliotek animacji i karuzel. JavaScript tylko tam, gdzie daje funkcję (filtry, odtwarzacz, asystent).
- Szczyt ruchu w dniu startu sprzedaży sezonu, 8.09, to ~3,3 tys. wyświetleń dziennie. Statyczne generowanie list i kart wydarzeń z rewalidacją, a status biletów doczytywany osobno.

---

## 12. Tokeny do implementacji (Tailwind v4 `@theme`, szkic)

```css
@theme {
  --color-bg: #FFFFFF;
  --color-bg-subtle: #F7F6F2;
  --color-surface-muted: #EDEBE5;
  --color-ink: #1A1A1A;
  --color-text: #2B2B2B;
  --color-text-muted: #5A5650;
  --color-line: #DEDAD2;
  --color-line-strong: #2B2B2B;
  --color-gold: #8A6D2F;          /* nagłówki i eyebrow na #FFFFFF */
  --color-gold-on-dark: #AD9450;  /* nagłówki i eyebrow na #1A1A1A */
  --color-on-dark: #FFFFFF;
  --color-on-dark-muted: #CFCBC2;

  --font-heading: "Titillium Web", "Segoe UI", system-ui, sans-serif;
  --font-body: "Open Sans", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;

  --radius-none: 0;
  --chamfer-sm: 28px;
  --chamfer-lg: 40px;

  --breakpoint-sm: 600px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1440px;
  --container-max: 1320px;

  --tap-min: 44px;
  --btn-h-mobile: 52px;
  --btn-h-desktop: 48px;
}
```

Nazwy klas i dokładną składnię sprawdź w dokumentacji Tailwind v4 i Next 16 w `node_modules/` przed implementacją (AGENTS.md).

---

## 13. Otwarte kwestie (do ustalenia z FS lub zespołem)

1. **Plik SVG logo** (wersja czarna i biała) i wytyczne marki od FS (brief: „materiały dla zespołów”).
2. **Komunikaty błędów bez czerwieni** (D3). Jeśli testy z użytkownikami pokażą, że błąd jest za mało widoczny, rozważyć jeden wyjątek funkcjonalny (ciemna czerwień ≥ 4,5:1), wyłącznie dla walidacji formularzy.
3. **Źródło audio** (pliki FS kontra platforma streamingowa). Komponent §6.12 jest od tego niezależny.
4. **Zestaw piktogramów dostępności.** Do potwierdzenia z FS, jakie udogodnienia faktycznie oferuje każda sala.
5. **Zdjęcia:** licencje i materiały z obecnej strony lub archiwum FS.

---

## 14. Źródła

- `docs/Kopia Kopia Prezentacja_brief_hackathon_Filharmonia_A4.pdf` i `docs/brief_hackathon_filharmonia.md`: cele, persony, dane GA, zasady projektowe, moduły, ścieżki A–F, kryteria oceny.
- `docs/transkrypt.md`, czyli wnioski spoza briefu:
  - WCAG jako obowiązek instytucji publicznej,
  - minimalizm budynku (biel i czerń),
  - lęk debiutantów przed niewłaściwym ubiorem,
  - programy koncertów tylko online od tego sezonu,
  - wydarzenia zewnętrzne pod dachem FS,
  - kultura audialna,
  - widoczność dla asystentów LLM (dane strukturalne `schema.org/Event`),
  - prezentacja otwierana przez jury z kodu QR na telefonie.
- `docs/inspiracje_wspolne_cechy.md` i pomiary stylów 13 serwisów (17.10.2026):
  - żadne złoto z serwisów inspiracji nie osiąga 4,5:1 na białym (Wiedeń #A38037 3,68; COA #9B804A 3,76),
  - promień 0 dominuje u Lux, COA, Drezna, Gewandhaus i Nowego Teatru,
  - linie 1 px zamiast cieni,
  - przyciski 44–52 px,
  - braki dostępności: COA usuwa fokus, Wiedeń nie ma skip linku, hamburgery Wiednia i COA są mniejsze niż 44 px.
- Figma, plik WUD2026, strona „Design system — decyzje”, tablice 1–6.
