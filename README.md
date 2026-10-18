<div align="center">

# FILHARMONIA ZACZYNA SIĘ ONLINE

**Koncept nowej strony internetowej Filharmonii im. Mieczysława Karłowicza w Szczecinie**

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-000000?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-000000?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-000000?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-000000?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![WCAG 2.2 AA](https://img.shields.io/badge/WCAG-2.2%20AA-8A6D2F?style=for-the-badge)](docs/raport-dostepnosci.md)
[![PL · EN · DE](https://img.shields.io/badge/PL%20%C2%B7%20EN%20%C2%B7%20DE-000000?style=for-the-badge)](#języki)

</div>

---

## O projekcie

Prototyp powstały na hackathonie **WUD 2026**. Odpowiada na jedno zadanie: użytkownik ma w kilka sekund zdecydować — **„chcę tam być"**.

Strona nie jest tablicą ogłoszeń, tylko przewodnikiem po Filharmonii. Prowadzi przez sześć kroków: **odkryj → wybierz → zaplanuj → kup → przyjdź → wróć**. Użytkownik nie musi „znać Filharmonii", żeby z niej korzystać.

Podejście **mobile first** (74% wejść na obecną stronę pochodzi z telefonu), z pełnym wsparciem desktopu.

## Co potrafi

| | |
|---|---|
| **Repertuar** | kalendarz z filtrami (kiedy, rodzaj, dla kogo, nastrój, miejsce, czas trwania, cykl), link do wybranych filtrów, widok listy |
| **Karta wydarzenia** | co, kiedy, gdzie, za ile, dla kogo i „Kup bilet" na pierwszym ekranie; program, odsłuch fragmentu, dostępność, podobne koncerty, dodanie do kalendarza (`.ics`) |
| **Zacznij tutaj** | ścieżka dla debiutanta, który nie zna muzyki klasycznej |
| **Pomóż mi wybrać** | pięć pytań i 3–5 propozycji |
| **Asystent AI** | odpowiada wyłącznie na podstawie danych Filharmonii, zwraca karty wydarzeń z przyciskami, a gdy czegoś nie wie, kieruje do kasy |
| **Wyszukiwarka** | rozumie intencję, toleruje literówki i polskie znaki („karlowicz" = „Karłowicz") |
| **Planuj wizytę** | dojazd, parking, szatnia, dostępność, FAQ |
| **EDUfilharmonia** | oferta według grup: dzieci, rodziny, szkoły, młodzież, nauczyciele |
| **Odkryj Filharmonię** | orkiestra i artyści, budynek, historia, wystawy, zwiedzanie |
| **Moje konto** | ulubione, powiadomienia, historia rozmów z asystentem |
| **Mini-CMS** | panel `/admin`: status biletów, ceny i program koncertu w PDF |

## Projekt wizualny

Strona jest monochromatyczna: **biel, czerń, szarości i złoto**. Złoto pojawia się wyłącznie w nagłówkach i etykietach. Charakter wyznacza budynek — światło, geometria, rytm, cisza i przestrzeń — bez kopiowania go.

- Typografia: **Titillium Web** (nagłówki) i **Open Sans** (interfejs i treść)
- Kształty: `border-radius: 0`, co najwyżej jedno–dwa ścięte narożniki na ekran
- Zdjęcia Filharmonii zawsze w oryginale — bez filtrów, nakładek i przekolorowania
- Motyw: geometria logo i heksagon (tylko na przycisku asystenta)

Pełny system projektowy: [`docs/design.md`](docs/design.md).

## Dostępność

Standard **WCAG 2.2 AA** wbudowany w komponenty, a nie doklejony na końcu: kontrast min. 4,5:1, cele dotykowe min. 44 px, pełna obsługa klawiaturą, widoczny focus, czytniki ekranu, wyłączalne animacje. Wyniki testów automatycznych (axe-core) i klawiaturowych: [`docs/raport-dostepnosci.md`](docs/raport-dostepnosci.md).

## Języki

Interfejs w **polskim, angielskim i niemieckim** (z czytelnymi adresami podstron w każdym języku). Asystent i wyszukiwarka działają w wybranym języku.

## Architektura

Zasada: **jedno API, wiele kanałów**. Żaden kanał — strona, asystent, wyszukiwarka, przyszła aplikacja — nie czyta bezpośrednio z CMS ani z systemu biletowego.

| Warstwa | Technologia |
|---|---|
| Aplikacja | Next.js (App Router), React, TypeScript |
| Style | Tailwind CSS, shadcn/ui, Radix |
| Dane i konta | Supabase (Auth, Postgres z RLS, Storage) |
| Asystent AI | LLM z odpowiedzią strukturalną (tekst + karty + źródło) |
| Dane wydarzeń | `koncerty.json` zbudowany ze scrapera strony Filharmonii |
| Analityka | PostHog i Vercel Analytics, po zgodzie użytkownika |
| SEO | schema.org (Event, Organization, WebSite), sitemap z hreflang |

Co jest prawdziwe, a co makietą (np. system biletowy iksoris, odsłuch fragmentów), opisuje [`docs/architektura.md`](docs/architektura.md).

## Dokumentacja

| Dokument | Zawartość |
|---|---|
| [`docs/brief_hackathon_filharmonia.md`](docs/brief_hackathon_filharmonia.md) | brief hackathonowy: cele, marka, funkcje, kryteria oceny |
| [`docs/design.md`](docs/design.md) | obowiązujący system projektowy: kolory, typografia, komponenty |
| [`docs/architektura.md`](docs/architektura.md) | architektura, mapa serwisu, model treści |
| [`docs/raport-dostepnosci.md`](docs/raport-dostepnosci.md) | raport dostępności WCAG 2.2 AA |
| [`docs/prezentacja-scenariusze.md`](docs/prezentacja-scenariusze.md) | scenariusze prezentacji |
| [`docs/inspiracje_wspolne_cechy.md`](docs/inspiracje_wspolne_cechy.md) | wnioski z serwisów referencyjnych |

## Zespół

- Piotr Wittig
- Karol Wroński
- Scarlet Dorożalska
- Paweł Dutkiewicz
- Adrian Banaś
- Aleksy Chojnowski

---

<div align="center">

Projekt koncepcyjny na potrzeby hackathonu, nie wdrożenie produkcyjne.
Dane wydarzeń pochodzą ze strony [filharmonia.szczecin.pl](https://filharmonia.szczecin.pl).

</div>
