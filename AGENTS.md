<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:scrapeddata-rules -->

## ScrappedData/ — NIE indeksuj, NIE przeszukuj

Folder `ScrappedData/` zawiera surowe dane zescrapowane z filharmonia.szczecin.pl (ok. 7000 plików `.md` w `ScrappedData/pages/`, ~67 MB). Czytanie go hurtowo zużywa ogromną ilość tokenów i nie jest potrzebne do pracy nad aplikacją.

**Zasady dla agentów:**

- NIE uruchamiaj `Glob`, `Grep`, `Explore`, `ls -R`, `find`, `tree` ani żadnego przeszukiwania/indeksowania w `ScrappedData/` (zwłaszcza `ScrappedData/pages/`). Wyłącz go z szerokich wyszukiwań repo (np. `--glob '!ScrappedData/**'`).
- NIE czytaj plików z `ScrappedData/pages/` ani `ScrappedData/scraper/node_modules/`, chyba że użytkownik wprost wskaże konkretny plik.
- Dane dla aplikacji/chatbota to **tylko** `src/data/koncerty.json` (generowany przez `ScrappedData/scraper/build-json.mjs`) (~390 KB, 90 nadchodzących wydarzeń + `meta.venue_info`). Używaj go zamiast surowych stron. Jeśli potrzebujesz jednego wydarzenia, wyszukaj je w tym JSON-ie po `title`/`id`, nie czytaj całego pliku bez potrzeby.
- Nie generuj ponownie danych (`ScrappedData/scraper/scrape.mjs` – wielominutowy crawl całej strony), dopóki użytkownik o to nie poprosi. Odświeżenie samego JSON-a: `node ScrappedData/scraper/build-json.mjs` (zapisuje do `src/data/koncerty.json`).
- Wyjątek: gdy użytkownik wprost prosi o pracę nad scraperem lub surowymi danymi.

<!-- END:scrapeddata-rules -->
