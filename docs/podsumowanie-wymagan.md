# Co się udało, a co nie — względem briefu

Stan na 18.10.2026 (gałąź `fix/wave-aria-references`, ostatni commit `03f093c`). Punkt odniesienia: `docs/brief_hackathon_filharmonia.md`. Stan sprawdzony w kodzie (`src/`), nie tylko w dokumentacji. Ten plik zastępuje tabelę z `docs/audyt-wymagan.md`, która powstała przed częścią zmian (filtry ceny, FAQ, mini-CMS) i ma w kilku miejscach sprzeczne wpisy.

Legenda: ✅ zrobione · 🟡 częściowo · ❌ nie zrobione · 🧪 działa na mocku / danych przykładowych

---

## 1. W skrócie

**Udało się:** wszystkie moduły o najwyższym priorytecie mają działający ekran (strona główna, kalendarz, karta wydarzenia, „Pomóż mi wybrać”, podobne wydarzenia, odsłuch, panel klienta, cykle i festiwale, menu górne). Działa też asystent AI na danych FS, wyszukiwarka z intencją i literówkami, „Planuj wizytę” z FAQ, EDUfilharmonia, zwiedzanie, budynek, historia, orkiestra i artyści, wystawy. Serwis jest w PL / EN / DE (plus UK), ma SEO, baner zgód RODO i mini-CMS. Axe nie zgłasza błędów, a pomiary wydajności są w normie.

**Nie udało się (albo tylko makieta):** prawdziwy zakup biletu i plan sali (iksoris to mock), bilet w portfelu, filtr dostępności, prawdziwe nagrania w odsłuchu, zgłoszenie grupy szkolnej i zapisy EDU, pełne treści Partnerów i Strefy mediów, archiwum w historii, tłumaczone adresy URL i opisy wydarzeń, ETR/PJM, testy z czytnikiem ekranu, pełny headless CMS z podglądem i wersjami.

---

## 2. Moduły najwyższego priorytetu (brief §6)

| Moduł | Stan | Co jest | Czego brakuje |
|---|---|---|---|
| Strona główna | ✅ | Otwarcie z jednym zdjęciem i najbliższym wydarzeniem (bez slidera), „Dziś w Filharmonii” (schody), Polecamy, Dla Ciebie, Odkryj Filharmonię, newsletter, stopka | — |
| Kalendarz z filtrami | ✅ | Osobna podstrona, lista + widok miesiąca (`?widok=miesiac`), szybkie filtry, arkusz filtrów z licznikiem, link z filtrami, stan „brak wyników” z alternatywami, status biletów w wierszu | Filtr dostępności (patrz §3) |
| Karta wydarzenia | ✅ | Co / kiedy / gdzie / za ile / dla kogo + „Kup bilet” na pierwszym ekranie, wykonawcy z linkami, program, czas, dostępność, podobne, `.ics`, udostępnij, ulubione, nawiguj, zadzwoń, przyklejony panel biletowy | Informacje sensoryczne (głośność, światło) — brak w danych FS |
| Pomóż mi wybrać | ✅ | 5 pytań, pomijanie, wstecz, zmiana odpowiedzi bez restartu, 3–5 wyników z „Zobacz” i „Kup bilet”, stan braku dopasowania | — |
| Sugestie podobnych | ✅ | Pod wydarzeniem, kategorie nastrojów | — |
| Odsłuch fragmentów | 🟡 🧪 | Własny odtwarzacz ~1 min (klawiatura, suwak), niezależny od dostawcy | Dane FS nie mają nagrań — jest tylko próbka demo; brak linku do pełnego nagrania / płyt FS |
| Panel klienta | 🟡 🧪 | Logowanie (Supabase), ulubione, moje bilety, powiadomienia („prawie się wyprzedał”), historia rozmów z asystentem, profil | Bilety i powiadomienia na danych przykładowych; brak ulubionych **artystów**, pobierania programu z panelu, zarządzania biletem |
| Podstrony festiwali / cykli | ✅ | `/cykl/[key]`: program, artyści, bilety w serwisie | Karnety tylko w danych (`cykle.json`), bez osobnego zakupu |
| Proste menu górne | ✅ | Nagłówek desktop z „Kup bilet”, wyszukiwarką i PL / EN / DE; dolna nawigacja + heksagon asystenta na telefonie | — |

## 3. Filtry kalendarza (brief §6.2)

| Filtr | Stan | Uwagi |
|---|---|---|
| Kiedy (dziś, jutro, weekend, tydzień, miesiąc, zakres dat) | ✅ | Zakres `od` / `do` |
| Rodzaj | ✅ | Symfoniczny, kameralny, jazz, edukacja, wystawa, zwiedzanie, festiwal itd. |
| Dla kogo (z wiekiem dziecka) | ✅ | Dzieci + wiek, rodziny, szkoły, dorośli, debiutanci, seniorzy |
| Nastrój | ✅ | Hity, emocje, energia, relaks, filmowa, coś niezwykłego |
| Miejsce | ✅ | Sala Symfoniczna, Kameralna, galerie, hol |
| Cena | ✅ 🧪 | Bezpłatne / do 20 zł / do 40 zł; ceny z mocka do czasu iksoris |
| Czas trwania | ✅ | |
| Wykonawca, kompozytor, cykl | ✅ | Wyszukiwanie w filtrze + filtr cyklu |
| **Dostępność** (ruchowa, wzrokowa, słuchowa, sensoryczna) | ❌ | Jest tylko sekcja informacyjna o salach w arkuszu filtrów — nie filtruje wyników. Dane FS nie rozróżniają tych potrzeb |

## 4. Moduły wysokiego i średniego priorytetu

| Moduł | Stan | Co jest | Czego brakuje |
|---|---|---|---|
| Asystent AI (wysoki) | ✅ | Odpowiedzi tylko z danych FS, karty wydarzeń z CTA, mapa, źródło odpowiedzi, „nie wiem → kasa / formularz”, nota RODO, bez logowania, PL / EN / DE / UK, z dolnej nawigacji i nagłówka | RAG z wyszukiwarką wektorową — kontekst to gotowy briefing z `koncerty.json` (wystarcza przy 90 wydarzeniach) |
| Wyszukiwarka języka naturalnego (wysoki) | ✅ | Intencje („jazz w październiku”, „dla dzieci”), literówki i polskie znaki, wyniki w grupach: wydarzenia, artyści, utwory, teksty; intencje EN / DE | Skrót klawiaturowy do wyszukiwarki na desktopie (wymóg briefu §4) — nie znaleziono w kodzie |
| Planuj wizytę (wysoki) | ✅ | Bilety i kasa, dojazd, parking, szatnia, sale, dostępność, link do mapy; osobne `/faq` (19 pytań, `FAQPage`) | Plan budynku (grafika) |
| EDUfilharmonia (wysoki) | 🟡 | Wejścia: dzieci, rodziny, szkoły, „wszystko dla dzieci”; przy wydarzeniu wiek, czas, cena, miejsce | Brak wejść dla przedszkoli, młodzieży, nauczycieli, młodych muzyków, dorosłych (3–4 z 8). Brak zapisów i rozróżnienia bilet / zapis / grupa szkolna |
| Orkiestra i artyści (wysoki) | 🟡 | Strona orkiestry, lista artystów, profil: zdjęcie, biogram, najbliższe koncerty | Muzycy wg sekcji, nagrania, tournée, wcześniejsze wydarzenia artysty |
| Wystawy (średni) | 🟡 | Aktualne i nadchodzące, wernisaże, galerie Poziom 4. i Art.Room | Kuratorzy, galeria zdjęć prac, opis galerii |
| Zwiedzanie (średni) | ✅ | Terminy, cena, czas, języki, grupy, kontakt — PL / EN / DE / UK | Rezerwacja online (wg danych FS niepotrzebna — grupy bez rezerwacji) |
| Budynek (średni) | ✅ | Architektura, sale, nagrody | — |
| Historia i archiwum (średni) | 🟡 | Oś czasu od 1948 roku | Zdjęcia, plakaty, nagrania, połączenie z cyfrowym archiwum FS |
| Partnerzy i biznes (średni) | ❌ | Strona z dwoma linkami do obecnego serwisu FS | Narracja partnerstwa, formy współpracy, projekty, logotypy |
| Strefa mediów (średni) | ❌ | Strona z linkami (do pobrania, kontakt, artyści, orkiestra) | Komunikaty prasowe, zdjęcia, logo, biogramy, kontakt prasowy na miejscu |

## 5. Zasady projektowe (brief §4)

| Wymaganie | Stan | Uwagi |
|---|---|---|
| Mobile first od 360 px, pełny desktop | ✅ | |
| Dolny pasek nawigacji (4–5 pozycji) | ✅ | Asystent jako pływający heksagon |
| Przyklejony „Kup bilet” z ceną „od…” i statusem | ✅ 🧪 | Status z mocka |
| Filtry jako dolny arkusz z licznikiem | ✅ | |
| Cele ≥ 44 px, brak interakcji tylko na hover | ✅ | |
| Akcje natywne: kalendarz, nawiguj, zadzwoń, udostępnij | ✅ | |
| **Bilet w portfelu (Apple / Google Wallet)** | ❌ | Tylko zapowiedź na ekranie zakupu (brief: „docelowo”) |
| Desktop: menu 5–7 pozycji, wyszukiwarka i języki zawsze widoczne | ✅ | |
| Desktop: okruszki; mobile: wstecz z zachowaniem filtrów | ✅ | |
| Desktop: pełna klawiatura, widoczny focus | ✅ | |
| **Wybór miejsc na planie sali** | ❌ | Ekran `/kup-bilet` opisuje docelowe 3 kroki i prowadzi do obecnej kasy online FS |

## 6. Dostępność (brief §4, WCAG 2.2 AA)

| Wymaganie | Stan | Uwagi |
|---|---|---|
| Kontrast, focus, skip link, reflow 320 px | ✅ | `docs/raport-dostepnosci.md` |
| Test automatyczny | ✅ | axe-core: 0 naruszeń (16 widoków + nakładka AI, logowanie, EN / DE / UK); poprawki WAVE |
| Test klawiaturą | ✅ | |
| Wyłączanie animacji | ✅ | `prefers-reduced-motion` |
| Znaczniki dostępności przy wydarzeniu | 🟡 | Ruchowa (wózek, winda) — tak. Wzrokowa, słuchowa, sensoryczna — „brak informacji, zapytaj obsługę”, bo nie ma ich w danych FS |
| Czytnik ekranu (VoiceOver, TalkBack, NVDA) | ❌ | Nie testowano na żywo |
| Zoom 200% w prawdziwej przeglądarce | 🟡 | Zastąpiony testem reflow |
| ETR i PJM | ❌ | Brief: moduł docelowy |
| Napisy do wideo, transkrypcje audio | — | W serwisie nie ma wideo; próbka audio bez transkrypcji |

## 7. Architektura informacji i języki (brief §5)

| Wymaganie | Stan | Uwagi |
|---|---|---|
| Płaska struktura, wszystko w ≤ 2 krokach | ✅ | |
| Zawsze widoczne: Szukaj, Asystent, Kup bilet, PL / EN / DE | ✅ | |
| Stopka: Partnerzy, Media, Kontakt, O instytucji, Deklaracja dostępności | ✅ | Strony istnieją (Partnerzy i Media są szczątkowe, patrz §4) |
| Tagi zamiast kopii (EDU w kalendarzu i EDUfilharmonii z jednego rekordu) | ✅ | |
| Interfejs PL / EN / DE (+ UK) | ✅ | Wszystkie trasy |
| **Opisy wydarzeń w EN / DE** | 🟡 | Przetłumaczone tylko wydarzenia demo; reszta po polsku z notą o języku i `lang="pl"` |
| **Czytelne adresy w 3 językach** | 🟡 | Prefiks `/en`, `/de`, ale ścieżki zostają polskie (`/en/repertuar`, `/de/planuj-wizyte`) |

## 8. Scenariusze (brief §7)

| Scenariusz | Stan | Uwagi |
|---|---|---|
| A. Debiutant (obowiązkowy, telefon) | ✅ | Zacznij tutaj / kreator → 3–5 propozycji → odsłuch demo i „Dlaczego warto” → Kup bilet + `.ics` → Planuj wizytę. Zakup kończy się w obecnej kasie FS |
| B. Rodzic | ✅ | Weekend + dzieci + wiek 5 → porównanie wieku, czasu, ceny. Brak zapisu / biletu rodzinnego w serwisie |
| C. Rozmowa z AI | ✅ | Karta z godziną, wykonawcami i dostępnością, źródło, „Kup bilet” |
| D. Turysta z Niemiec | ✅ | Zwiedzanie po niemiecku: terminy, cena, czas, kontakt dla grup. Rezerwacja niepotrzebna wg FS |
| E. Stały bywalec | 🟡 🧪 | Panel z biletami i powiadomieniem na danych przykładowych; brak zakupu w 2 krokach i pobrania programu z panelu; nie testowano z zalogowanym kontem |
| F. Nauczyciel (desktop) | 🟡 | Filtr szkoły + wiek + widok miesiąca działa; brak zasad rezerwacji grupowej i **formularza zgłoszenia grupy** |

Brief wymaga co najmniej trzech scenariuszy, w tym A — spełnione (A–D).

## 9. Technika i integracje (brief §8)

| Wymaganie | Stan | Uwagi |
|---|---|---|
| Jedno API dla kanałów | 🟡 | `/api/events`, `/api/events/[id]`, `/availability`, `/ics`, `/api/chat`, `/api/newsletter`. Brak API dla artystów, wystaw, EDU, FAQ |
| System biletowy iksoris | 🟡 🧪 | Mock statusów (`content/availability.ts`) i punkt integracji — zgodnie z briefem („użyć mocka API”) |
| CMS headless | 🟡 | Mini-CMS `/admin` (Supabase): status biletów, ceny, PDF programu. Brak pełnego CMS, ról redakcyjnych, podglądu przed publikacją i wersjonowania |
| Model treści | 🟡 | Opisany w `docs/architektura.md`; w kodzie wydarzenia, artyści, cykle, FAQ. Wystawa, oferta EDU, miejsce i utwór nie są osobnymi typami |
| Wyszukiwarka pełnotekstowa i semantyczna | 🟡 | Własna, w przeglądarce (intencje, literówki); bez Meilisearch / Typesense / wektorów |
| Asystent AI z cytowaniem źródła | ✅ | |
| Audio niezależne od dostawcy | ✅ 🧪 | Odtwarzacz zna tylko adres pliku; brak prawdziwych nagrań |
| Cyfrowe archiwum FS | ❌ | |
| Newsletter z zgodą RODO | ✅ | Bez segmentacji (CRM) |
| Analityka zgodna z RODO, baner zgód | ✅ | PostHog startuje po „Akceptuj”; link „Ustawienia prywatności” w stopce |
| Mapy → natywna nawigacja | ✅ | |
| SEO | ✅ | `schema.org/Event`, `Organization`, `WebSite`, `FAQPage`, sitemap z hreflang (bez tłumaczonych ścieżek) |
| Wydajność | ✅ | LCP 280–540 ms, CLS 0, INP 16–136 ms przy 360 px (`docs/architektura.md` §6) |
| Skalowalność w dniu startu sprzedaży | 🟡 | Opisana w dokumentacji (statyczne strony, cache); bez testu obciążeniowego |
| Aplikacja FS na tym samym API | — | Brief: docelowo |

## 10. Rezultaty do oddania (brief §10)

| Rezultat | Stan | Gdzie |
|---|---|---|
| Koncepcja: strona główna, kalendarz, karta wydarzenia, kreator / AI | ✅ | Działający prototyp |
| Widoki 360 px i 1440 px | ✅ | Prototyp + makiety w `docs/architektura.md` |
| Mapa serwisu i model treści | ✅ | `docs/architektura.md` |
| Szkic architektury z punktami integracji | ✅ | `docs/architektura.md` |
| Mini design system | ✅ | `docs/design.md` |
| Raport dostępności (automat + klawiatura) | ✅ | `docs/raport-dostepnosci.md` |
| Prezentacja ze ścieżką A na telefonie | ✅ | `docs/prezentacja-scenariusze.md` |

## 11. Czego nie zrobiliśmy — lista do „co dalej”

1. Prawdziwa integracja z iksoris: zakup w serwisie, plan sali z listą rzędów, statusy na żywo, bilety klienta.
2. Bilet w Apple / Google Wallet.
3. Filtr dostępności w kalendarzu i pełne znaczniki (wzrok, słuch, sensoryka) — wymaga danych od FS.
4. Prawdziwe nagrania FS w odsłuchu i link do pełnego nagrania / płyt.
5. EDUfilharmonia: pozostałe grupy (przedszkola, młodzież, nauczyciele, młodzi muzycy, dorośli), zapisy i formularz zgłoszenia grupy (scenariusz F).
6. Partnerzy i Strefa mediów jako pełne podstrony (narracja, materiały prasowe, logo, zdjęcia).
7. Historia z archiwum (zdjęcia, plakaty, programy, nagrania); orkiestra wg sekcji, nagrania, tournée; galerie zdjęć wystaw.
8. Tłumaczenie wszystkich opisów wydarzeń i ścieżek URL na EN / DE.
9. Pełny headless CMS z rolami, podglądem i wersjonowaniem; API dla wszystkich typów treści.
10. Testy z czytnikami ekranu, zoom 200%, moduły ETR i PJM.
11. Ulubieni artyści i pobieranie programu w panelu; skrót klawiaturowy do wyszukiwarki.
12. Pliki PDF programów od FS (interfejs i mini-CMS już je obsługują).
