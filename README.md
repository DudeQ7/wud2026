# WUD 2026

Repozytorium zespołu hackathonowego, który tworzy koncept dla Filharmonii w Szczecinie (Harmonia). Zawiera materiały wyjściowe: brief hackathonowy w formie prezentacji PDF oraz transkrypt wystąpienia przedstawicielki filharmonii. Służy jako baza do pracy nad projektem i przechowywania jego kolejnych elementów.

## Zespół

- Piotr Wittig
- Karol Wroński
- Scarlet Dorożalska
- Paweł Dutkiewicz
- Adrian Banaś
- Aleksy Chojnowski

## Asystent AI (prototyp)

Czat dla odwiedzających Filharmonię w Next.js + OpenAI (`gpt-6-luna`), ze streamingiem odpowiedzi i propozycjami kolejnych pytań.

```bash
pnpm install
cp .env.example .env   # wpisz swój OPENAI_API_KEY
pnpm dev
```

- `src/data/koncerty.json` – baza wiedzy asystenta (wydarzenia ze strony Filharmonii, odświeżanie: `node ScrappedData/scraper/build-json.mjs`)
- `src/data/visit.json` – informacje praktyczne: dojazd, parking, dostępność, kawiarnie, kasa (ręcznie, ze strony „Zaplanuj swoją wizytę”)
- `src/data/locales.json` – teksty UI i pytania startowe (pl/en/de); język przekazuje front przez prop `lang` w `<Chat>` (na razie `pl`)
- `src/lib/assistant.ts` – prompt, schemat odpowiedzi, wywołanie OpenAI
- `src/app/api/chat/route.ts` – endpoint streamujący
- `src/app/Chat.tsx` – interfejs czatu

## API wydarzeń (kontrakt front ↔ baza)

Front i baza umawiają się na kształt odpowiedzi tych endpointów. Dziś dane pochodzą z `src/data/koncerty.json`; po przeniesieniu do Supabase zmienia się tylko źródło, odpowiedzi zostają takie same.

| Endpoint | Co zwraca |
|---|---|
| `GET /api/events?kiedy=weekend&rodzaj=jazz` | `{ count, filters, days: [{ day, label, rows: [{ event, times }] }] }` – repertuar po filtrach; parametry jak w adresie `/repertuar`: `kiedy` (dzis, jutro, weekend, tydzien, miesiac), `od`/`do` (YYYY-MM-DD), `rodzaj`, `dla-kogo`, `wiek`, `miejsce`, `czas`, `nastroj`, `cykl`, `q` (listy po przecinku) |
| `GET /api/events/{id}` | jedno wydarzenie (`FsEvent` z `src/lib/event-format.ts`) + `links` (ics, bilety, strona FS); 404 gdy brak |
| `GET /api/events/{id}/ics?date=2026-10-23T19:00` | plik `.ics` „Dodaj do kalendarza” (bez `date` – najbliższy termin) |

**Podpięcie tabel:** jedyne miejsce, które czyta dane, to `src/lib/events.ts` (`export const events = koncerty.events.map(toEvent)`). Wystarczy, że tabele zwrócą rekordy w kształcie wydarzenia z `koncerty.json`, a `toEvent` zostaje bez zmian:

- `events`: `id` (int, id z FS, PK), `title`, `type`, `kind_label`, `series`, `venue`, `duration_min` (int, null), `artists` (text[]), `program` (text[]), `prices_pln` (text[]), `tickets_url`, `url`, `program_pdf`, `images` (text[]), `description`
- `event_dates`: `event_id` → `events.id`, `starts_at` (czas lokalny Szczecina, w aplikacji jako `"2026-10-23T19:00"`)
- `favorites.event_id` i `event_notifications.event_id` mogą wtedy dostać klucz obcy do `events.id`; minionych wydarzeń nie kasujemy, żeby ulubione i historia w panelu ich nie gubiły

Po zmianie `events` stanie się asynchroniczne (`await getEvents()`), więc trzeba dodać `await` u odbiorców: `src/app/page.tsx`, `src/app/repertuar/page.tsx`, `src/components/home/sections.tsx` i trzy pliki w `src/app/api/events/`. `src/lib/assistant.ts` i panel (`src/app/panel/`) czytają `koncerty.json` bezpośrednio – też do przepięcia.
