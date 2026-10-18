# Audyt wymagań: brief vs aplikacja

Data: 18.10.2026. Źródła: PDF briefu, `brief_hackathon_filharmonia.md`, `transkrypt.md`, `design.md`, kod i dane.

Legenda: ✅ zrobione · 🟡 częściowo · ❌ brak

## Tabela zbiorcza

| # | Obszar | Stan | Najważniejszy brak |
|---|---|---|---|
| 1 | „Dziś w Filharmonii” (schody) | ✅ | — |
| 2 | Kalendarz | 🟡 | Brak widoku miesiąca |
| 3 | Filtry kalendarza | 🟡 | Brak ceny i dostępności |
| 4 | Statusy biletów | ❌ | Brak danych i znaczników |
| 5 | Karta wydarzenia | 🟡 | Brak ulubionych i statusu |
| 6 | Program PDF | ❌ | `program_pdf` = null dla 90/90 |
| 7 | Odsłuch | 🟡 | Tylko próbka demo |
| 8 | „Pomóż mi wybrać” | ✅ | — |
| 9 | Podobne wydarzenia | ✅ | — |
| 10 | Asystent AI | ✅ | — |
| 11 | Wyszukiwarka | 🟡 | Tylko PL, brak intencji EN/DE |
| 12 | Panel klienta | 🟡 | Brak biletów i powiadomień |
| 13 | EDUfilharmonia | 🟡 | 4 z 8 grup, brak zapisów |
| 14 | Zwiedzanie | 🟡 | Brak rezerwacji grupy, tylko PL |
| 15 | Orkiestra i artyści | 🟡 | Brak nagrań i tournée |
| 16 | Wystawy | 🟡 | Brak narracji galerii |
| 17 | Budynek | ✅ | — |
| 18 | Historia | 🟡 | Brak zdjęć i archiwum |
| 19 | Partnerzy | 🟡 | Placeholdery zamiast logotypów |
| 20 | Strefa mediów | 🟡 | Brak materiałów prasowych |
| 21 | Języki PL/EN/DE/UK | 🟡 | Kluczowa ścieżka OK, reszta PL |
| 22 | SEO | 🟡 | Brak `schema.org/Event` |
| 23 | RODO i analityka | 🟡 | Brak banera zgód |
| 24 | CMS i iksoris | ❌ | Brak integracji i mocka |
| 25 | API i model treści | 🟡 | Tylko API wydarzeń |
| 26 | Wydajność | 🟡 | Brak pomiarów |
| 27 | Dostępność | 🟡 | Brak testów manualnych |
| 28 | Design system | 🟡 | Panel poza systemem |
| 29 | Prezentacja | 🟡 | Brak próby na żywo |

## Co jest gotowe

- Mobile-first, dolna nawigacja, menu, przełącznik języków.
- Strona główna: hero, schody z 9 wydarzeniami (sekcja „Dziś w Filharmonii”), polecane, dla Ciebie, odkryj, newsletter, stopka.
- Kalendarz: lista po dniach, szybkie filtry, pełny arkusz filtrów, licznik, linki z filtrami, stan pusty z alternatywami.
- Karta wydarzenia: fakty, wykonawcy z linkami, program, czas, podobne, kalendarz, udostępnianie, nawigacja, telefon.
- Kreator: 5 pytań, pomijanie, wstecz, 3–5 wyników, uzasadnienie, stan braku dopasowania.
- Asystent: odpowiedzi z danych FS, karty wydarzeń, ulubione, mapa, 4 języki, nota RODO, źródło odpowiedzi, CTA „Zadzwoń do kasy / Napisz do nas” przy braku wiedzy i wygląd zgodny z design systemem.
- Panel: logowanie, ulubione, historia czatu, profil.
- Dostępność bazowa: skip link, fokus, 44 px, axe 0 na 16 widokach.
- Treści: plan wizyty, dostępność, budynek, historia, artyści, cykle.

## P0 przed prezentacją

1. Panel: doprowadzić wygląd do design systemu (asystent jest gotowy).
2. Karta wydarzenia: ulubione, status biletów, odsłuch dla wydarzenia demo.
3. Schody: dostępność opisana słowem, nie tylko kolorem.
4. Tłumaczenia pod demo: EDU, zwiedzanie i opisy 3–5 wydarzeń.

## P1 po demo

1. Widok miesiąca.
2. Filtry ceny i dostępności.
3. Panel: bilety, programy, powiadomienia.
4. Baner zgód analitycznych.
5. `schema.org/Event` i pełny sitemap.
6. Mock statusów iksoris.

## P2 później

1. CMS i pełne API treści.
2. Plan sali i wybór miejsc.
3. Archiwum, nagrania FS, tłumaczenia wszystkich opisów.
4. Pomiar LCP/CLS/INP i pakiet wdrożeniowy.

## Scenariusze

| Scenariusz | Stan | Uwaga |
|---|---|---|
| A. Debiutant | ✅ | Brak odsłuchu i polskie opisy w EN/DE/UK |
| B. Rodzic | ✅ | Działa filtr weekend + dzieci + wiek |
| C. Asystent | ✅ | RODO, źródło i CTA gotowe; wygląd do dopracowania |
| D. Turysta DE | ❌ | Zwiedzanie po polsku |
| E. Stały bywalec | 🟡 | Brak biletów i powiadomień |
| F. Nauczyciel | ❌ | Brak miesiąca i zgłoszenia grupy |
