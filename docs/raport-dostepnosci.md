# Raport dostępności (WCAG 2.2 AA)

Data audytu: 18.10.2026. Środowisko: lokalny serwer deweloperski (`next dev`), dane z `koncerty.json`.
Zakres: 16 widoków (strona główna, kalendarz, karta wydarzenia, „Pomóż mi wybrać” w krokach i wyniku, Planuj wizytę, Szukaj, EDUfilharmonia, Wystawy, Zwiedzanie, Budynek, Historia, Orkiestra, Artyści i profil artysty, cykl, Zacznij tutaj).

## 1. Test automatyczny (axe-core 4.14.0)

Reguły: tagi `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`, `best-practice`. Szerokość 360 px (wszystkie widoki) oraz 1440 px (strona główna, kalendarz, karta wydarzenia, kreator).

**Wynik końcowy: 0 naruszeń we wszystkich 16 widokach.**

Znalezione i naprawione w trakcie audytu:

| Problem (reguła axe) | Gdzie | Naprawa |
|---|---|---|
| `aria-prohibited-attr`: `aria-label` na `div` bez roli (serious) | szkielety ładowania w 8 miejscach | `role="status"` |
| `heading-order`: h1 → h3 bez h2 (moderate) | `/edu`, `/wystawy`, `/zwiedzanie`, wynik kreatora | ukryty nagłówek h2 („Nadchodzące wydarzenia”, „Propozycje”) |

Pozycje „do ręcznej weryfikacji” (axe nie potrafi policzyć kontrastu na obrazie):

- Glif „AI” na heksagonie w dolnej nawigacji: `#AD9450` na `#1A1A1A` = 5,91:1 (zgodnie z design.md §2.2).
- Znacznik daty i tekst na zdjęciach: tekst leży na jednolitym czarnym znaczniku, nie bezpośrednio na zdjęciu.

Uwaga metodyczna: strony z Suspense podmieniają treść dopiero, gdy karta przeglądarki jest na pierwszym planie. Skan przed podmianą widzi szkielet i zgłasza fałszywe „brak h1”.

## 2. Klawiatura (prawdziwe naciśnięcia klawiszy)

| Sprawdzenie | Wynik |
|---|---|
| Pierwszy Tab → link „Przejdź do treści”, widoczny, obrys 2 px | OK |
| Enter na linku przenosi do treści (`#tresc`), kolejny Tab trafia w pierwszy element treści | OK |
| Kolejność fokusu zgodna z układem (filtry w kalendarzu) | OK |
| Fokus nie jest zasłonięty przez dolną nawigację (WCAG 2.4.11) | OK, `scroll-padding-bottom` |
| Arkusz filtrów: fokus wchodzi do okna, nie ucieka po 30 × Tab, Escape zamyka, fokus wraca na „Wszystkie filtry” | OK |
| Odtwarzacz fragmentu: spacja odtwarza i zatrzymuje, Tab na suwak, ← → przewijają o 5 s, `aria-valuetext` „0:15 z 1:00” | OK |
| Akordeony `<details>` (Planuj wizytę): natywna obsługa Enter i spacji | OK (bez testu na żywo) |

## 3. Pozostałe wymagania z briefu

| Wymaganie | Wynik |
|---|---|
| Reflow 320 px bez przewijania w poziomie (WCAG 1.4.10) | OK na 4 sprawdzonych widokach; przy 1440 px brak przewijania |
| Cele dotykowe ≥ 44 px | Naprawione: przełącznik PL/EN/DE w stopce (szerokość 19–21 px → 44 px), link „Ceny w kasie online” (23 → 44 px). Pole zgody w newsletterze ma kwadrat 24 px, ale pole dotyku 44 px (`after:`). Tytuły kart mają 26 px, ale klikalna jest cała karta (rozciągnięty link). Linki w środku zdań są wyłączone z wymogu (2.5.8, wyjątek „inline”) |
| Widoczny fokus | Globalne `:focus-visible` 2 px (`globals.css`) |
| Możliwość wyłączenia animacji | Reguła `prefers-reduced-motion: reduce` w `globals.css`; strzałka akordeonu ma `motion-reduce:transition-none` |
| Język dokumentu, tytuły stron, jeden h1 na stronę | OK (axe) |
| Znaczniki dostępności przy wydarzeniach | „Dostęp dla wózków · winda” na kartach i wierszach; szczegóły na karcie wydarzenia |

## 4. Czego ten audyt nie obejmuje

- Czytnik ekranu (NVDA, VoiceOver): nie testowano na żywo, tylko semantyka przez axe.
- Zoom 200% w przeglądarce: zastąpiony testem reflow przy 320 px (równoważny wg WCAG 1.4.10).
- Widoki desktop poza czterema skanami przy 1440 px.
- Wersje językowe EN/DE (w trakcie prac innego członka zespołu).
- Strony panelu klienta i asystent AI.
- Komponenty ładowane po interakcji (np. nakładka asystenta).

## 5. Jak powtórzyć

1. `pnpm add -D axe-core` (jest w `devDependencies`), skopiować `node_modules/axe-core/axe.min.js` do `public/`.
2. Na stronie wstrzyknąć skrypt i uruchomić `axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice'] } })`.
3. Plik z `public/` nie jest częścią repozytorium, trzeba go usunąć po audycie.
