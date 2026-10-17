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

- `src/data/filharmonia.json` – baza wiedzy asystenta (obecnie **dane przykładowe**) oraz teksty UI i pytania startowe w językach pl/en/de/uk
- `src/lib/assistant.ts` – prompt, schemat odpowiedzi, wywołanie OpenAI
- `src/app/api/chat/route.ts` – endpoint streamujący
- `src/app/Chat.tsx` – interfejs czatu
