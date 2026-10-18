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

## 6. Uzupełnienie: testy ręczne (18.10.2026, wbudowana przeglądarka, `next dev`)

| Sprawdzenie | Wynik |
|---|---|
| Reflow przy 320 px, 10 widoków (`/`, `/repertuar`, karta wydarzenia, `/pomoz-mi-wybrac`, `/planuj-wizyte`, `/szukaj`, `/edu`, `/asystent`, `/en`, `/de/repertuar`) | OK, `scrollWidth` = 320 na każdym. Elementy szersze niż ekran to wyłącznie przewijany poziomo pasek szybkich filtrów (celowy, §6.6 design.md) |
| Cele dotykowe < 24 px | Tylko linki „Polityka prywatności” wewnątrz zdania zgody w newsletterze (wyjątek „inline”, 2.5.8) |
| `h1` na stronie | Znalezione: `/asystent` nie miał `h1` (tylko `h2`). **Naprawione**: tytuł jest `h1` na stronie, a w nakładce zostaje `h2` |
| Skip link | Pierwszy Tab → „Przejdź do treści”, obrys 2 px `#1A1A1A` |
| Fokus w wierszu kalendarza | Obrys rysowany na wrapperze wiersza (rozciągnięty link), widoczny; fokus poza paskiem nagłówka |
| `prefers-reduced-motion: reduce` | Reguła globalna skraca przejścia do 1 ms i wyłącza `scroll-behavior` |
| Menu (hamburger) | Otwiera się i zamyka na 375, 768 i 1440 px |

Nadal niesprawdzone: czytniki ekranu (VoiceOver, TalkBack), wtyczka WAVE (wymaga przeglądarki użytkownika) i zoom 200% w prawdziwej przeglądarce.

## 7. Uzupełnienie kontroli P0 (18.10.2026)

- Porównanie struktury słowników: EN, DE i UK mają ten sam zestaw kluczy interfejsu co PL, bez brakujących i dodatkowych kluczy. Osobne mapy rodzajów, sal i cykli są celowo zależne od danych wydarzeń.
- `pomoz-mi-wybrac`, `planuj-wizyte`, `zacznij-tutaj` i karta wydarzenia nie mają już tekstów interfejsu wpisanych po polsku: korzystają ze słowników oraz z `src/i18n/visitor-routes.ts` (EN/DE/UK). Metadane stron i etykiety ARIA są zależne od języka, a akcje karty wydarzenia i odtwarzacz fragmentu też mają tłumaczenia.
- Nadal nieprzetłumaczone są **opisy wydarzeń** pochodzące z polskiego `koncerty.json`. W EN/DE/UK są oznaczone `lang="pl"` i poprzedzone notą o języku; to świadome ograniczenie prototypu, nie pełna lokalizacja treści.
- Pierwszy adres podglądu (`:3000`) odmówił połączenia. Później dostępny był lokalny podgląd na `:3100`; ręczne przejścia opisano w sekcji 8.
- Nie sprawdzono VoiceOver ani TalkBack. Poprzednie wyniki axe z sekcji 1–6 pozostają wcześniejszym audytem, a nie ponownym skanem obecnego stanu.

## 8. Weryfikacja tras P0 (18.10.2026, podgląd `:3100`)

| Sprawdzenie | Wynik |
|---|---|
| „Zacznij tutaj” przy 360 px | EN działa; najbliższe wydarzenia i informacje dla debiutanta są widoczne. |
| Kreator EN | Pytania i odpowiedzi są po angielsku; przejście do kolejnego kroku zachowuje `/en/` i odpowiedzi w URL. |
| „Planuj wizytę” DE | Nagłówki, sekcje, opis dojazdu i FAQ są po niemiecku. Adres pozostaje nazwą własną. |
| Zmiana języka w stopce | Z PL na EN zostaje na tej samej trasie (`/planuj-wizyte` → `/en/planuj-wizyte`). |
| Widok o szerokości 640 px | Na „Planuj wizytę” `clientWidth` i `scrollWidth` wynoszą 640 px; nie ma przewijania poziomego. To nie potwierdza testu zoomu 200% w przeglądarce. |
| Kreator → wydarzenie | Pięć kroków kończy się rekomendacją; karta wydarzenia pokazuje opis i informacje o dostępności. W szczegółach nie znaleziono odsłuchu audio; przycisk zakupu i dodania do kalendarza są obecne. Nie otwierano zewnętrznego zakupu. |
| Filtr rodzinny | `weekend` + `dla-kogo=dzieci` + `wiek=5` zwraca jedno wydarzenie: „Jak w baroku brzmiały pory roku?” (5+). |
| Asystent AI | Działa: nakładka się otwiera, a asystent odpowiada (potwierdzone przez zespół 18.10.2026). Wcześniejszy wynik negatywny pochodził z narzędzia testowego, które nie obsłużyło interakcji. Audytu axe dla otwartej nakładki nadal brak. |
| Panel | `/en/panel` przekierowuje do logowania. Nie wpisywano danych logowania. |

To ręczna próba tras, nie pełny audyt axe. Drzewo dostępności potwierdza etykiety i strukturę, ale nie zastępuje testu na VoiceOver/TalkBack. EN/DE nadal zawierają polskie opisy części wydarzeń i niektóre teksty z danych źródłowych.

## 9. Skan axe: nakładka asystenta, logowanie, EN/DE/UK (18.10.2026)

Środowisko: `next dev` na `:3100`, Chrome headless (puppeteer-core) z wstrzykniętym `axe-core` 4.14.0, te same tagi co w sekcji 1. Szerokości 360 px i 1440 px. Nakładkę otwierano przyciskiem z dolnej nawigacji (360 px) i heksagonem (1440 px), a skan powtarzano po odpowiedzi asystenta na „Co jest w ten weekend?” i „Gdzie zaparkować?” (z kartami wydarzeń, mapą i źródłem).

**Wynik końcowy: 0 naruszeń** w 22 skanach: `/`, `/asystent`, `/auth/login`, `/auth/register`, `/en`, `/uk`, `/repertuar`, `/en/repertuar`, `/de/repertuar`, `/de/zwiedzanie`, `/en/planuj-wizyte`, `/uk/zacznij-tutaj` oraz nakładka asystenta (pusta i po odpowiedzi), każdy przy 360 i 1440 px.

Znalezione i naprawione:

| Problem (reguła axe) | Gdzie | Naprawa |
|---|---|---|
| `aria-valid-attr-value` (critical): szybkie filtry wskazują `aria-controls="repertuar-lista"`, którego nie ma w widoku miesiąca | `/repertuar` we wszystkich językach (widok miesiąca jest domyślny) | widok miesiąca w kontenerze `#repertuar-lista` (`calendar.tsx`) |
| `label-content-name-mismatch` (serious, WCAG 2.5.3): `aria-label` dnia „Niedziela, 18 października, dziś, …” nie zawiera widocznego „18 dziś” | fasada miesiąca, komórka dzisiejszego dnia | nazwa z ukrytego tekstu (`sr-only`), cyfra i znaczniki `aria-hidden` (`calendar3d.tsx`) |
| `label-content-name-mismatch` (serious): heksagon pokazuje „AI”, a etykieta UK brzmiała „ШІ-асистент” | `/uk/*` przy 1440 px | „AI-асистент” (`uk.ts`) |
| Ten sam `id` nagłówka w dwóch instancjach nakładki (dolna nawigacja i heksagon) | `assistant-dialog.tsx` | `useId()` zamiast stałego `asystent-tytul` |

Panel (`/panel/*`) przekierowuje do logowania, więc skan obejmuje stronę logowania i rejestracji, nie widoki po zalogowaniu.

Uwaga: lokalny `next dev` bez `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` i `NEXT_PUBLIC_POSTHOG_HOST` kończy się błędem w `instrumentation.ts`. Do skanu ustawiono atrapy tych zmiennych (host `http://127.0.0.1:9`), bez zmian w `.env`.

## 5. Jak powtórzyć

1. `pnpm add -D axe-core` (jest w `devDependencies`), skopiować `node_modules/axe-core/axe.min.js` do `public/`.
2. Na stronie wstrzyknąć skrypt i uruchomić `axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice'] } })`.
3. Plik z `public/` nie jest częścią repozytorium, trzeba go usunąć po audycie.
