@AGENTS.md

## Claude Code

Reguły z `AGENTS.md` (zaimportowane powyżej) obowiązują w całości — w szczególności sekcja **„ScrappedData/ — NIE indeksuj, NIE przeszukuj”**.

- Zanim uruchomisz `Glob`/`Grep`/`Explore` lub subagenta do eksploracji repo, wyklucz `ScrappedData/**` (np. `glob: "!ScrappedData/**"`). Nie startuj subagentów, żeby „zbadać” ten folder.
- Dane do aplikacji/chatbota: tylko `ScrappedData/Data/koncerty.json` (kopia robocza aplikacji: `src/data/koncerty.json`). Nie czytaj `ScrappedData/pages/`, chyba że użytkownik wskaże konkretny plik.
- Twarde blokady odczytu są w `.claude/settings.json` (`permissions.deny`). Jeśli odmowa blokuje zadanie, które użytkownik wprost zlecił, poproś go o zgodę zamiast obchodzić blokadę (np. przez `cat`/`find` w Bashu).
