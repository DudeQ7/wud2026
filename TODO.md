# Lista rzeczy do zrobienia — WUD 2026

Stan na **18.10.2026**. Lista powstała na podstawie briefu, dokumentacji projektu i aktualnego raportu dostępności. P0 oznacza zadania potrzebne przed prezentacją, P1 — ważne dla kompletności konceptu, P2 — dalszy rozwój.

| Priorytet | Zadanie | Kiedy uznać za zrobione | Status |
|---|---|---|---|
| P0 | Dokończyć i sprawdzić wersje EN, DE i UK | Przetłumaczyć kluczowe trasy i treści; przełącznik języka prowadzi do tej samej podstrony w wybranym języku. | Częściowo: UI „Zacznij tutaj”, kreatora, „Planuj wizytę” i karty wydarzenia (sekcje, akcje, odtwarzacz, dostępność) działa w EN/DE/UK; metadane i etykiety ARIA są zależne od języka. Otwarte: opisy wydarzeń z `koncerty.json` są tylko po polsku (w EN/DE/UK mają `lang="pl"` i notę o języku) – decyzja: tłumaczenie 90 opisów albo treść redakcyjna w CMS. |
| P0 | Przejść ścieżkę debiutanta na telefonie | Od „Zacznij tutaj” przez wybór koncertu i kartę wydarzenia do zakupu, kalendarza i informacji o wizycie; zapisać znalezione problemy. | Przejście 360 px wykonane do karty wydarzenia i „Planuj wizytę”. Karta ma zakup i dodanie do kalendarza, ale brakuje odsłuchu wydarzenia. Zakupu nie finalizowano. |
| P0 | Przygotować prezentację co najmniej trzech scenariuszy | Pokazać obowiązkowy scenariusz debiutanta na telefonie oraz dwa kolejne. | Skrypt gotowy. Scenariusz rodzica daje 1 wydarzenie dla weekendu i wieku 5+. Asystent odpowiada (potwierdzone przez użytkownika); dodano RODO, źródło odpowiedzi i CTA przy braku wiedzy. Zostaje próba całości na żywo. |
| P0 | Dokończyć ręczną kontrolę dostępności | Uzupełnić raport o VoiceOver/TalkBack, powiększenie 200%, wersje EN/DE oraz panel i asystenta AI. | Szerokość 640 px bez poziomego przewijania; dokładnego zoomu 200% nie udało się potwierdzić. EN/DE tras sprawdzone przez drzewo dostępności. Brak testu na żywym VoiceOver/TalkBack. Panel przekierowuje do logowania; nakładka AI w podglądzie się nie otwiera. |
| P1 | Potwierdzić materiały i fakty z Filharmonią | Ustalić dostępność SVG logo, prawdziwe informacje o dostępności sal, licencje do zdjęć oraz źródło fragmentów audio. | Do uzgodnienia z FS |
| P1 | Opisać zakres integracji prototypu | Wskazać, co jest makietą lub danymi lokalnymi, a co wymaga CMS, systemu biletowego, wyszukiwarki, panelu klienta i źródła audio. Dodać punkty integracji do opisu architektury. | Do zrobienia |
| P1 | Sprawdzić zgodę na analitykę i prywatność asystenta | Potwierdzić, że analityka uruchamia się zgodnie ze zgodą użytkownika oraz że asystent nie prosi o dane osobowe; opisać ograniczenia prototypu. | Asystent: nota RODO i link do polityki prywatności dodane. Baner zgód analitycznych nadal do zrobienia; PostHog startuje bez pytania o zgodę. |
| P2 | Zmierzyć wydajność na telefonie | Sprawdzić LCP, CLS i INP na reprezentatywnej stronie mobilnej i porównać z celami z `docs/design.md`. | Do zrobienia |
| P2 | Przygotować paczkę dla zespołu wdrożeniowego | Zebrać mapę serwisu, model treści, punkty integracji, makiety 360/1440 px i raport dostępności w jednym miejscu. | Do zrobienia |

## Zrobione

- Automatyczny audyt axe-core: 0 naruszeń w 16 sprawdzonych widokach.
- Ręczne sprawdzenia klawiatury i reflow przy 320 px w zakresie opisanym w `docs/raport-dostepnosci.md`.
- Tłumaczenia EN/DE/UK dla ścieżki debiutanta: „Zacznij tutaj”, kreator „Pomóż mi wybrać”, „Planuj wizytę” oraz karta wydarzenia (sekcje, akcje, odtwarzacz, dostępność). Metadane i etykiety ARIA zależne od języka; budowa i TypeScript przechodzą.
