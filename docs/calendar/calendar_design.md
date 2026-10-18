# Kalendarz miesięczny — fasada Filharmonii Szczecińskiej

## Zasada projektu

- W spoczynku kalendarz jest frontowym, ortogonalnym widokiem elewacji: pionowe żebra pozostają równoległe, bez zbiegania linii.
- Linia dachu ma siedem szczytów o różnych wysokościach i szerokościach. Nie są rozmieszczone równomiernie — rytm nawiązuje do rzeczywistej fasady.
- Jasne płaszczyzny, szare fasety i wąskie cienie żeber sugerują głębokość, nie tworząc cienia wokół całej karty.
- Siatka miesiąca mieści się wewnątrz elewacji. Pod nią widoczna jest lista wydarzeń wybranego dnia.
- Złota linia motywu: `#8A6D2F`; żebra i cienie używają bieli i szarości z palety systemowej.
- Linia dachu mieści się w osobnym obszarze nad nazwami dni tygodnia; żaden szczyt nie opada poniżej wiersza dni.
- Wybrany dzień ma ciemne tło i jasny numer. Dziś ma dodatkowo etykietę „dziś”. Liczbę wydarzeń pokazuje do trzech krótkich kresek.

## Zmiana miesiąca

- Obraca się cała fasada razem z dniami tygodnia i datami (jak w makiecie Figmy): dwie ściany bryły na wspólnej krawędzi, obrót o 90° w perspektywie.
- Nagłówek miesiąca i strzałki stoją w miejscu. Nazwa miesiąca zmienia się w połowie obrotu (45°). Lista wydarzeń dnia jest ukryta na czas ruchu i wraca z nowym dniem.
- Następny miesiąc wjeżdża z prawej, poprzedni z lewej, w prawdziwej perspektywie 3D. Na środku ruchu fasada lekko się zmniejsza (przekątna bryły jest szersza niż ściana). Bez przyciemniania, cieni i gradientów.
- Ruch trwa 1000 ms, krzywa `cubic-bezier(0, 0.2, 1, 0.8)`. Podczas niego strzałki i wybór daty nie działają, a ściany są `inert`.
- Przy `prefers-reduced-motion: reduce` miesiąc zmienia się natychmiast.

## Dostępność widoku

Widok miesiąca jest dostępny obok listy także na telefonie. To świadoma decyzja projektowa ponad pierwotnym zakresem desktopowym z §6.16 `docs/design.md`. Czteroboczny obrót to zatwierdzony wyjątek ruchu od §8.
