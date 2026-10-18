# Audyt wymagań: brief vs aplikacja

Data: 18.10.2026. Źródła: PDF briefu, `brief_hackathon_filharmonia.md`, `transkrypt.md`, `design.md`, kod i dane.

Legenda: ✅ zrobione · 🟡 częściowo · ❌ brak

## Tabela zbiorcza

| # | Obszar | Stan | Najważniejszy brak |
|---|---|---|---|
| 1 | „Dziś w Filharmonii” (schody) | ✅ | — (dostępność monochromatycznie, poziom słowem) |
| 2 | Kalendarz | ✅ | — (widok miesiąca jako fasada 3D + lista) |
| 3 | Filtry kalendarza | 🟡 | Brak ceny i dostępności |
| 4 | Statusy biletów | ✅ | Mock; docelowo iksoris |
| 5 | Karta wydarzenia | ✅ | — |
| 6 | Program PDF | 🟡 | Brak plików w danych; jest wersja online i obsługa PDF |
| 7 | Odsłuch | 🟡 | Tylko próbka demo |
| 8 | „Pomóż mi wybrać” | ✅ | — |
| 9 | Podobne wydarzenia | ✅ | — |
| 10 | Asystent AI | ✅ | — |
| 11 | Wyszukiwarka | 🟡 | Tylko PL, brak intencji EN/DE |
| 12 | Panel klienta | 🟡 | Bilety i powiadomienia są (mock iksoris); brak programów PDF i prawdziwych zakupów |
| 13 | EDUfilharmonia | 🟡 | 4 z 8 grup, brak zapisów (PL/EN/DE/UK gotowe) |
| 14 | Zwiedzanie | ✅ | PL/EN/DE/UK, fakty i kontakt dla grup (rezerwacja niepotrzebna wg FS) |
| 15 | Orkiestra i artyści | 🟡 | Brak nagrań i tournée |
| 16 | Wystawy | 🟡 | Brak narracji galerii |
| 17 | Budynek | ✅ | — |
| 18 | Historia | 🟡 | Brak zdjęć i archiwum |
| 19 | Partnerzy | 🟡 | Placeholdery zamiast logotypów |
| 20 | Strefa mediów | 🟡 | Brak materiałów prasowych |
| 21 | Języki PL/EN/DE/UK | 🟡 | Kluczowa ścieżka, EDU, zwiedzanie i opisy 5 wydarzeń demo OK; reszta opisów PL |
| 22 | SEO | ✅ | `schema.org/Event` + pełny sitemap |
| 23 | RODO i analityka | ✅ | Baner zgód + RODO w asystencie |
| 24 | CMS i iksoris | 🟡 | Mock statusów biletów (`content/availability.ts`); brak CMS |
| 25 | API i model treści | 🟡 | Tylko API wydarzeń |
| 26 | Wydajność | 🟡 | Brak pomiarów |
| 27 | Dostępność | 🟡 | Brak testów manualnych |
| 28 | Design system | ✅ | Panel i logowanie w ramie serwisu, bez emoji, zaokrągleń i kolorów |
| 29 | Prezentacja | ✅ | Scenariusze A–D zweryfikowane (`docs/prezentacja-scenariusze.md`) |

## Co jest gotowe

- Mobile-first, dolna nawigacja, menu, przełącznik języków.
- Strona główna: hero, schody z 9 wydarzeniami (sekcja „Dziś w Filharmonii”), polecane, dla Ciebie, odkryj, newsletter, stopka.
- Kalendarz: widok miesiąca (fasada Filharmonii z obrotem 3D) i lista po dniach, szybkie filtry, pełny arkusz filtrów, licznik, linki z filtrami, stan pusty z alternatywami.
- Karta wydarzenia: fakty, wykonawcy z linkami, program, czas, podobne, kalendarz, udostępnianie, nawigacja, telefon, ulubione, status biletów i odsłuch demo.
- Kreator: 5 pytań, pomijanie, wstecz, 3–5 wyników, uzasadnienie, stan braku dopasowania.
- Asystent: odpowiedzi z danych FS, karty wydarzeń, ulubione, mapa, 4 języki, nota RODO, źródło odpowiedzi, CTA „Zadzwoń do kasy / Napisz do nas” przy braku wiedzy i wygląd zgodny z design systemem.
- Panel i logowanie/rejestracja: ulubione, historia czatu, profil; wygląd zgodny z design systemem, w ramie serwisu (nagłówek, stopka, dolna nawigacja, formularze §6.17).
- Tłumaczenia EN/DE/UK: EDUfilharmonia, Zwiedzanie i opisy wydarzeń demo (2608, 2550, 2612, 2597, zwiedzanie) w `src/i18n/events/descriptions.ts`.
- Dostępność bazowa: skip link, fokus, 44 px, axe 0 na 16 widokach (+ nakładka AI, logowanie i EN/DE/UK).
- Treści: plan wizyty, dostępność, budynek, historia, artyści, cykle.
- SEO: `schema.org/Event` na kartach wydarzeń, `Organization` i `WebSite` na stronie głównej oraz sitemap z hreflang dla tras, wydarzeń, artystów i cykli.
- RODO: nota w asystencie oraz baner zgód; PostHog startuje dopiero po „Akceptuj”.
- Nawigacja: okruszki na karcie wydarzenia (desktop) i „wstecz” na mobile.
- Program: link do PDF, gdy dane go mają; inaczej informacja o pełnej wersji online.

## P0 przed prezentacją

1. ~~Schody: dostępność słowem, nie kolorem~~ — zrobione (monochrom).
2. ~~Tłumaczenia pod demo: EDU, zwiedzanie, opisy wydarzeń~~ — zrobione.
3. Pozyskać od FS pliki PDF programów (UI już je obsługuje).
4. ~~Próba całego demo na żywo (A, B, C, D) na telefonie~~ — zrobione (`docs/prezentacja-scenariusze.md`).

## P1 po demo

1. ~~Widok miesiąca~~ — zrobione (`calendar3d.tsx`).
2. Filtry ceny i dostępności.
3. ~~Panel: bilety, powiadomienia~~ — zrobione na mocku; programy PDF czekają na dane FS.
4. ~~Link „Ustawienia prywatności” w stopce~~ — zrobione.
5. Podłączyć prawdziwe statusy z iksoris zamiast mocka.

## P2 później

1. CMS i pełne API treści.
2. Plan sali i wybór miejsc.
3. Archiwum, nagrania FS, tłumaczenia wszystkich opisów.
4. Pomiar LCP/CLS/INP i pakiet wdrożeniowy.

## Scenariusze

| Scenariusz | Stan | Uwaga |
|---|---|---|
| A. Debiutant | ✅ | Odsłuch demo dla wydarzenia z hero; opisy wydarzeń demo przetłumaczone |
| B. Rodzic | ✅ | Działa filtr weekend + dzieci + wiek |
| C. Asystent | ✅ | Nakładka i `/asystent` działają; RODO, źródło i CTA gotowe |
| D. Turysta DE | ✅ | Zwiedzanie po niemiecku: terminy, cena, czas, języki, kontakt dla grup |
| E. Stały bywalec | 🟡 | Panel: ulubione, bilety, powiadomienia (przykładowe dane); nie testowano z zalogowanym kontem |
| F. Nauczyciel | ❌ | Brak miesiąca i zgłoszenia grupy |
