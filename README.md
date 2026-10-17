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
