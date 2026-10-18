# Nocna zmiana — dziennik pracy (Claude)

Cel: zaimplementować brakujące wymagania z briefu (PDF) przed oddaniem projektu o 10:00.
Każdy wpis: godzina (HH:MM:SS) — co robię / co skończyłem. Najnowsze na dole.
Każdy skończony kawałek = osobny commit na `main` (tsc + eslint + build przed pushem).

## Plan (kolejność)

1. Widok miesiąca w kalendarzu (Lista | Miesiąc) — scenariusz F
2. EDU: 8 grup, sposób zapisu (bilet / zapis / grupa szkolna), formularz zgłoszenia grupy — scenariusz F
3. Filtry kalendarza: cena i dostępność
4. Panel klienta: moje bilety (mock iksoris), programy, powiadomienia — scenariusz E
5. „Powiadom o zwrotach” przy wyprzedanych, stopka: ustawienia prywatności
6. Partnerzy (narracja + formy współpracy), Strefa mediów (komunikaty, materiały, kontakt)
7. Wyszukiwarka: intencje EN/DE/UK
8. Rezultaty briefu §10: mapa serwisu, model treści, architektura (docs)
9. Pozostałe z design.md: przełącznik „Ogranicz animacje”, plan sali (lista miejsc), itp.

## Dziennik

- 03:58:21 — start. Czytam kod kalendarza, zaczynam od widoku miesiąca.
- 05:48:43 — gotowe: widok miesiąca (Lista | Miesiąc, `?widok=miesiac&miesiac=2026-11`), strzałki/Home/End, dziś = obrys + „dziś”, lista dnia pod siatką. Filtry ceny (bezpłatne / do 50 / do 100 zł) i dostępności (wózki, PJM, znany czas trwania). Cennik = MOCK iksoris w `src/content/prices.ts` (reguły wg rodzaju; prawdziwe ceny z danych mają pierwszeństwo; schema.org dalej tylko prawdziwe ceny). Cena trafia też do wierszy, karty wydarzenia, paska „od X zł” i kreatora (budżet).
- 05:48:43 — zaczynam EDU: 8 grup, sposób zapisu, formularz zgłoszenia grupy.
