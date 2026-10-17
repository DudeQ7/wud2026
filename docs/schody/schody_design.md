# Schody: sekcja „Najbliższe wydarzenia” (mobile first), wersja kompaktowa

Finalna specyfikacja interaktywnej sekcji 3 strony głównej, w której najbliższe wydarzenia są ułożone na jednych, bardzo wysokich schodach, wzorowanych na schodach Filharmonii Szczecińskiej. Dokument uzupełnia `docs/design.md`. Tam, gdzie się z nim różni, obowiązują decyzje z tego dokumentu (patrz §9).

**Obowiązuje wyłącznie wersja z hintem kompaktowym** (strój i dostępność w jednej linii). Wcześniejsze warianty (hint pełny z osobnymi sekcjami stroju i dostępności, wersja bez hintu) zostały odrzucone i nie są tu opisane.

- **Figma:** plik **WUD2026**, strona **Scarlet Page**.
- **Status:** wersja finalna, 18.10.2026.
- **Screeny:** w tym samym folderze (`docs/schody/*.png`), zob. §11.

---

## 1. Idea

- Sekcja zastępuje listę kart „Najbliższe wydarzenia”. Zamiast listy użytkownik widzi **jedną spiralną klatkę schodową** (rzut ortogonalny, widok z przodu). Na każdym piętrze stoją **3 plakaty**, pięter jest 5, więc razem **15 wydarzeń**, od najbliższego (u góry) do najdalszego (na dole).
- Przewijanie w dół ma dawać wrażenie **schodzenia po schodach**. Czytamy od lewej do prawej, a spirala opada w prawo. Po skończeniu piętra wchodzimy na kolejne, niższe.
- Na początku sekcji nad schodami jest pusta przestrzeń, a pod ostatnim piętrem też, żeby schody wchodziły w kadr i z niego wychodziły.
- Plakat w focusie jest o 10% większy, ma czarny obrys i **hint** (dymek) pod sobą.
- **Całą sekcję da się przewijać z każdego miejsca**, hint nigdy nie przechwytuje scrolla.

## 2. Wymiary, dla których projektujemy

Źródło: PDF „Kopia Kopia Prezentacja_brief_hackathon_Filharmonia_A4.pdf” (slajd „Systemy, przeglądarki i ekrany”, dane Google Analytics, marzec 2026, wartości przybliżone) oraz `docs/brief_hackathon_filharmonia.md`.

- Projektujemy **od 360 px w górę**, mobile first (74% wejść z telefonu).
- Widoki referencyjne: 360 px (mobile) i 1440 px (desktop). Desktopu jeszcze nie projektujemy.

| # | Ekran | Liczba wejść | Zapas dla hintu kompaktowego (screen w `docs/schody`) |
|---|---|---|---|
| 1 | 390×844 | 1 340 | duży |
| 2 | 393×852 | 1 170 | duży |
| 3 | 384×832 | 890 | duży |
| 4 | 360×780 | 710 | wystarczający (spód hintu ok. 3 px wyżej niż w wersji pełnej, ale wciąż ponad 28 px nad dolnym paskiem) |
| 5 | 402×874 | 600 | duży |

Hint kompaktowy mieści się też na najmniejszym ekranie z briefu (320×568): zrobione w Figmie, plakat w focusie ma wtedy przycięte ok. 16 px od góry pod nagłówkiem. Dla 360×640 zapas wynika z obliczeń (obszar użytkowy 520 px, grupa plakat + hint 463 px), nie z osobnego screena. Dla szerokości 320 px ilustracja schodów (360 px) jest przycinana po 20 px z każdej strony, a hint (296 px) nadal mieści się w całości.

## 3. Układ sekcji (mobile 360)

| Element | Wartość |
|---|---|
| Nagłówek | wysokość 56 px + linia 1 px `#DEDAD2`, białe tło |
| H2 „Najbliższe wydarzenia” | Titillium Web SemiBold 28 px, `#8A6D2F` |
| Obszar schodów (ilustracja) | 360×1660 px |
| Przycisk „Pełny repertuar →” | drugorzędny, kontur, wysokość 52 px |
| Dolna nawigacja | wysokość 64 px, heksagon AI pośrodku (z `design.md` §6.4) |
| Odstępy | h2 → schody 24 px, schody → przycisk 24 px, padding dolny 64 px |

Całkowita wysokość sekcji (mobile 360): 2009 px.

## 4. Anatomia schodów

Schody to jedna spirala. W widoku z przodu widać pasy (pierwsza połowa zwoju) i ich spody (druga połowa, widoczna w szczelinach między piętrami).

### 4.1 Geometria

- Szerokość klatki: x od 30 do 330 px (po 30 px marginesu z lewej i prawej).
- **5 pięter**, skok między piętrami (pitch) **300 px**. Pas frontowy ma wysokość **190 px** (±95 px od osi). Oś pierwszego piętra leży na y=185.
- Zwój: promień poziomy 150 px, spłaszczenie elipsy 22 px. Pas **opada w prawo** (lewy koniec wyżej).
- Pod schodami zostaje pusta przestrzeń. Ilustracja ma 1660 px wysokości, a ostatni pas kończy się w okolicy y=1555.

### 4.2 Warstwy (od tyłu)

1. **Tło klatki**: prostokąt `#F7F6F2`, x 30–330, z pionowymi szwami 1 px `#EDEBE5` co 60 px (jak panele ściany atrium).
2. **Spody (pasy z tyłu)**: wielokąty `#EDEBE5` pod pasami pięter 1–4, z liniami stopni 1 px `#DEDAD2`.
3. **Grubość płyty**: pas 12 px `#DEDAD2` pod dolną krawędzią każdego pasa.
4. **Pas frontowy**: wielokąt `#FFFFFF`, obrys 1 px `#DEDAD2`, szwy pionowe 1 px `#EDEBE5` (5 na pas), linia nosingu 2 px `#EDEBE5` tuż nad dolną krawędzią.
5. **Balustrada**: poręcz 1,5 px złota `#8A6D2F` 20 px nad górną krawędzią pasa, słupki 1 px co ok. 7° i grubsze słupki 2,5 px co czwarty.
6. **Cień pasa**: `DROP_SHADOW` `rgba(26,26,26,0.4)`, przesunięcie 0/16 px, rozmycie 26 px.

### 4.3 Plakaty na schodach

- 3 sloty na piętro. Środki slotów w osi x: **80, 180, 280 px**. Wysokości względem osi piętra: lewy slot -18 px, środkowy +22 px, prawy +51 px (plakaty „schodzą” razem ze spiralą).
- Plakat środkowy: **90×126 px** (płaski). Plakat w focusie: **99×139 px** (+10%), obrys 2 px `#1A1A1A` na zewnątrz.
- **Plakaty boczne są obrócone w osi pionowej** (efekt 3D):
  - szerokość 79 px (≈ 0,88 × 90, jak cos 28°),
  - krawędź bliższa środkowi ma pełne 126 px wysokości, a dalsza 106 px (po 10 px mniej u góry i u dołu),
  - lewy plakat ma wyższą krawędź zewnętrzną (lewą), prawy plakat odwrotnie.
- Zdjęcia zawsze w oryginale (`design.md` §5.6): bez filtrów, przyciemnień i nakładek. Kadrowanie tylko przez `object-fit: cover`.
- Na każdym plakacie w lewym górnym rogu stoi **czarny znacznik daty** `#1A1A1A`, biały tekst Open Sans Bold 10 px, np. „SR 28.10”. Na plakatach bocznych znacznik jest płaski (nie pochylony) i leży przy bliższej krawędzi.

### 4.4 Implementacja plakatów 3D (wskazówka dla kodu)

W Figmie nie ma obrotu 3D ani działających masek, więc mockup składa plakat z 6 pionowych pasków o różnej wysokości. W kodzie robimy to jednym zabiegiem:

- `transform: perspective(600px) rotateY(±28deg)` na plakacie bocznym, `transform-origin` po stronie bliższej środkowi, albo
- `transform: scaleX(0.88)` oraz `clip-path: polygon(0 8%, 100% 0, 100% 100%, 0 92%)` (lewy) i lustrzanie (prawy).

Plakat w focusie i środkowy zostają płaskie.

## 5. Dane (15 plakatów, kolejność od góry)

Dane z `src/data/koncerty.json`, zdjęcia z `ScrappedData/Images`. Tylko koncerty, chronologicznie.

| Piętro | Lewy | Środek | Prawy |
|---|---|---|---|
| 1 | Donuta powraca (PN 19.10) | Paulina Przybysz, Insides (PN 19.10) | FilHERmonia (PT 23.10) |
| 2 | Mitch&Mitch (ND 25.10) | **Slavic Sessions (SR 28.10), focus** | Symfoniczny fundament (PT 30.10) |
| 3 | Pomniki symfoniki (SOB 31.10) | Potęga i blask (PT 06.11) | Potęga brzmienia (ND 08.11) |
| 4 | Konsonanse (WT 10.11) | Wieniawski. Kontinuum (PT 13.11) | Laureat II nagrody (PT 20.11) |
| 5 | Zwycięzca konkursu (ND 22.11) | Z czterech stron świata (SR 25.11) | Maciej Rychły (CZ 26.11) |

(Tytuły pełne, patrz JSON. W mockupie skrócone.)

Treść hintu dla Slavic Sessions pochodzi z istniejącej karty sekcji 3 („Dwie gitary i album nominowany do nagrody Grammy 2026.”, 19:00, Sala Kameralna, 1 h 5 min).

## 6. Hint kompaktowy (dymek)

### 6.1 Pozycja i kształt

- Hint wisi **pod plakatem w focusie**: jego górna krawędź jest 12 px pod dolną krawędzią plakatu. Trójkątny ogonek (16×12 px) wskazuje środek plakatu.
- Szerokość 296 px, x od 32 do 328 px. Tło `#1A1A1A`, promień 0. Wysokość **312 px**.
- Hint **zasłania piętro niżej** (to celowe), ale nie blokuje scrolla.
- Ma zawsze **ten sam układ względem plakatu w focusie**. Gdy focus przechodzi na kolejny plakat, hint przeskakuje za nim.

### 6.2 Układ wewnątrz (współrzędne względem lewego górnego rogu hintu, padding 16 px)

| Element | Pozycja (x, y) | Styl |
|---|---|---|
| Eyebrow (rodzaj · dzień data · godzina), np. „KAMERALNY · SR 28.10 · 19:00” | 16, 16 | Open Sans Bold 12 px, WERSALIKI, tracking 12%, złoto `#AD9450` |
| Tytuł | 16, 36 | Titillium Web SemiBold 17 px, `#FFFFFF`, 1 linia, ucięcie `…` |
| Meta (sala · czas) | 16, 62 | Open Sans Regular 14 px, `#FFFFFF` |
| Zdanie „dlaczego warto” | 16, 86 | Open Sans Regular 14 px, `#FFFFFF`, interlinia 140%, maks. 2 linie, szerokość 264 px |
| Linia podziału | 16, 138 | 1 px `#BBBBBB`, szerokość 264 px |
| Etykieta „STRÓJ” | 16, 150 | Open Sans Bold 12 px, WERSALIKI, tracking 12%, `#AD9450` |
| Etykieta „DOSTĘPNOŚĆ” | 88, 150 | j.w. |
| Kafelek stroju | 16, 172 (44×44) | ramka 1,5 px `#FFFFFF`, bez wypełnienia |
| Podpis stroju („Koszula”) | 17, 222 | Open Sans Regular 12 px, `#FFFFFF` |
| Ikony dostępności (36×36) | 88, 156, 224 na y=176 | kreska 1,8 px, zakończenia `square` |
| Podpisy ikon (Ruchowa, Wzrokowa, Słuchowa) | pod ikonami, y=222 | Open Sans Regular 12 px, `#FFFFFF` |
| Przycisk „Kup bilet” (odwrócony) | 16, 252 (264×44) | tło `#FFFFFF`, tekst `#1A1A1A`, Open Sans SemiBold 16 px, promień 0 |

### 6.3 Zasada kontrastu (decyzja zespołu)

- **Cały tekst na ciemnym tle jest biały `#FFFFFF`.** Nie używamy szarości o jasności niższej niż `#BBBBBB` (usunięto m.in. `#CFCBC2`).
- Jedyny wyjątek to złoto `#AD9450` w eyebrow, etykietach „STRÓJ” i „DOSTĘPNOŚĆ” oraz ikonie stroju (decyzja zespołu, kontrast 5,91:1 na `#1A1A1A`).

### 6.4 Strój (jedna rekomendacja)

- Pokazujemy **jeden** polecany strój: kafelek 44×44 px, ramka 1,5 px `#FFFFFF`, bez wypełnienia, w środku **złota ikona liniowa** `#AD9450` (kreska 1,5 px, zakończenia `square`), pod spodem podpis „Koszula”.
- Strój wynika z rodzaju wydarzenia (mockup pokazuje koszulę dla koncertu kameralnego). Do ustalenia z FS jako pole w modelu wydarzenia (patrz §10).
- W wersji kompaktowej **nie ma** zdania „Polecany strój: koszula. Przyjdź tak, jak lubisz.” (zostało usunięte, żeby zmieścić strój i dostępność w jednej linii).

### 6.5 Dostępność (trzy ikony)

- Trzy ikony 36×36 px, rozmieszczone co 68 px: **wózek** (dostęp ruchowy), **okulary** (wzrokowy), **ucho** (słuchowy).
- Kolor ikony oznacza poziom dostępności dla danego wydarzenia: zielony `#5BD16A`, żółty `#FFC400`, czerwony `#FF6B6B`.
- Pod ikoną podpis rodzaju: „Ruchowa”, „Wzrokowa”, „Słuchowa”. **Nie ma opisu słownego poziomu ani legendy kolorów.**
- Wartości w mockupie (żółty wózek, zielone okulary, czerwone ucho) są **przykładowe**. Realne poziomy musi potwierdzić FS (`design.md` §13).

## 7. Zachowanie przy przewijaniu

- Całą sekcję przewija się **normalnie**. Focus jest przypisany do plakatu najbliższego linii odczytu (środek widocznego obszaru).
- **Wyśrodkowanie na ekranie:** środek odcinka od **górnej krawędzi plakatu w focusie** do **dolnej krawędzi hintu** ma wypadać na środku obszaru między nagłówkiem a dolnym paskiem, z lekkim przesunięciem w dół (ok. 6 px). Przewinięcie ilustracji dla ekranu o wysokości `H`:

  `S = 814,25 − (H − 7) / 2 − 6`

  gdzie 814,25 px to środek grupy plakat + hint w układzie sekcji (górna krawędź plakatu w focusie y=582,5, spód hintu y=1046). Wyniki dla ekranów z PDF-a: 390×844 → 389,75 px, 393×852 → 385,75 px, 384×832 → 395,75 px, 360×780 → 421,75 px, 402×874 → 374,75 px.
- Hint nie może nachodzić na dolny pasek i musi zostawiać zapas (najciaśniej na 360×780).
- **Obrót schodów** przy scrollu (plakaty przesuwają się po spirali, jakby schody się obracały) to propozycja ruchu, patrz §9 punkt 3. Wariant bez ruchu (`prefers-reduced-motion`): stan statyczny, focus na pierwszym wydarzeniu, schody nieruchome.

## 8. Dostępność i kontrast

- Znaczniki dat: biały tekst na `#1A1A1A` (17,4:1).
- Hint: biały na `#1A1A1A` (17,4:1). Złoto `#AD9450` na `#1A1A1A` ma 5,91:1 (AA), ale według reguły zespołu jest ciemniejsze niż `#BBBBBB`. To świadomy wyjątek (§6.3).
- Cele dotykowe: przycisk „Kup bilet” ma 44 px wysokości (minimum dotyku). Ikony dostępności są informacyjne, nie interaktywne.
- Poziomy dostępności są oznaczone **tylko kolorem** (patrz §9 punkt 4 i §10).
- Treść hintu da się odczytać czytnikiem ekranu: tytuł, data, sala, zdanie, strój, trzy poziomy dostępności z nazwami rodzaju. Kolejność w DOM jest taka sama jak wizualna.

## 9. Konflikty z `docs/design.md` i jak zostały rozwiązane

Zasada przyjęta w projekcie: decyzje zespołu są ważniejsze od docs, a każdy konflikt jest tu spisany.

| # | Konflikt z docs | Rozwiązanie |
|---|---|---|
| 1 | §5.1, §5.4: brak cieni | Cienie są pod pasami schodów (decyzja zespołu: schody mają odróżniać się od białego tła). |
| 2 | §2.3, §5.4: brak gradientów i poświat | Wszystkie gradienty i poświaty zostały usunięte z ostatecznych ekranów. |
| 3 | §8: zakaz animacji przy przewijaniu | Obrót schodów przy scrollu zostaje jako decyzja zespołu. Brakuje wariantu `prefers-reduced-motion` (opisany w §7), do dopracowania w kodzie. |
| 4 | §2.3, D5: brak kolorów funkcjonalnych | Wózek, okulary i ucho mają kolor zielony, żółty lub czerwony (decyzja zespołu). Kolory są tylko na ikonach i rozjaśnione, żeby były czytelne na ciemnym tle. Brak opisu słownego poziomu łamie WCAG 1.4.1 (kolor jako jedyny nośnik informacji). Słowne są tylko podpisy rodzaju (Ruchowa/Wzrokowa/Słuchowa). |
| 5 | §2.1: złoto na czerni `#AD9450` a reguła kontrastu ≥ `#BBBBBB` | Złoto `#AD9450` jest używane tylko w etykietach i ikonie stroju (decyzja zespołu). Cały pozostały tekst na czerni to czysta biel. |
| 6 | §5.6: zdjęcia w oryginale | Plakaty boczne mają zniekształcony kadr (zwężenie i skos perspektywy). Samego pliku zdjęcia nie edytujemy, zmienia się tylko kształt kadru. |
| 7 | §5.4: ozdobniki | Balustrada, szwy i linie stopni należą do ilustracji schodów (motyw architektury Filharmonii). Złoto jest w cienkich liniach (`#8A6D2F` na białym), co jest dozwolonym wyjątkiem z §2.3. |
| 8 | §3.2: minimum 14 px (12 px tylko eyebrow i label) | Znaczniki dat (10 px) oraz podpisy „Koszula” i ikon dostępności (12 px) są mniejsze niż 14 px. To miniatury i etykiety ikon. |
| 9 | §6.1: przycisk 52 px | Przycisk w hincie ma 44 px (minimum dotyku), bo 52 px nie mieści się w dymku. |
| 10 | §3: tytuł karty (`title-card`, bez ucinania) | Tytuł w hincie jest ucinany do jednej linii. Pełny tytuł jest na karcie wydarzenia. |
| 11 | §6.3, §6.4: nagłówek przyklejony | W makiecie sekcji nagłówek zjeżdża razem z treścią, a na ekranach telefonów jest widoczny na górze. W kodzie ma być przyklejony. |

## 10. Otwarte kwestie

1. **Realne dane o dostępności** per wydarzenie i sala (wózek, wzrok, słuch). Kolory w mockupie są przykładowe.
2. **Wybór polecanego stroju** per wydarzenie (obecnie koszula jako przykład). Do ustalenia z FS.
3. **Poziom dostępności tylko kolorem** (§9, punkt 4). Do rozstrzygnięcia z zespołem: dodać ukryty tekst dla czytników ekranu (`aria-label`) i/lub opis po dotknięciu.
4. **Obrót schodów** (§9, punkt 3): do potwierdzenia przez zespół w kontekście wydajności i `prefers-reduced-motion`.
5. **Desktop**: nie projektowany.

## 11. Pliki

Wszystkie screeny w `docs/schody/` (skala 2× dla telefonów, 1,5× dla całej sekcji). Każdy telefon jest pokazany w widoku wyśrodkowanym (§7).

| Plik | Co pokazuje |
|---|---|
| `telefon-390x844_hint-kompaktowy.png` | iPhone 390×844 (1 340 wejść) |
| `telefon-393x852_hint-kompaktowy.png` | 393×852 (1 170 wejść) |
| `telefon-384x832_hint-kompaktowy.png` | 384×832 (890 wejść) |
| `telefon-360x780_hint-kompaktowy.png` | 360×780 (710 wejść, najciaśniej) |
| `telefon-402x874_hint-kompaktowy.png` | 402×874 (600 wejść) |
| `sekcja-3_cala-sekcja_hint-kompaktowy.png` | cała sekcja 360×2009 (hint kompaktowy pod plakatem w focusie) |

**Figma (Scarlet Page):**

- Cała sekcja: „Sekcja 3 · SCHODY · FINAL · hint kompaktowy (cała sekcja)”, x=9000, y=8000.
- Telefony, hint kompaktowy wyśrodkowany: rząd y≈11500 (`v2 · … · hint kompaktowy · wyśrodkowany`).
- Komponenty plakatów E0–E11 i N1–N8: wiersz y≈7000.
