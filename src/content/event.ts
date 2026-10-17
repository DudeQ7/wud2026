// Stałe bloki karty wydarzenia – skróty faktów z src/data/visit.json (strona „Zaplanuj swoją wizytę” FS).
// Docelowo z CMS (FAQ / informacje praktyczne). Nic tu nie jest wymyślone ponad źródło.

/** Dostępność budynku (§6.9) – dotyczy każdego wydarzenia w Filharmonii */
export const buildingAccess = [
  "Wejście główne bez progów, z poziomu chodnika",
  "Windy na wszystkie piętra: obie sale, Galeria Poziom 4. i parking",
  "Toaleta dla osób na wózku",
  "Po 2 miejsca parkingowe dla osób z niepełnosprawnościami na każdym poziomie parkingu",
]

/** Dla osób z niepełnosprawnością ruchową: kasa dobiera miejsce i zapewnia asystenta */
export const accessAssistance =
  "Przed zakupem biletu zadzwoń do kasy – dobierzemy dostosowane miejsce i zapewnimy asystenta podczas wydarzenia."

export const accessTickets = "Osoba towarzysząca kupuje bilet ulgowy."

/** „Pierwszy raz w Filharmonii?” (§6.11 pkt 7) – odpowiedzi na obawy debiutantów */
export const firstVisit = [
  { title: "Co na siebie włożyć?", text: "Przyjdź tak, jak lubisz. Liczy się muzyka, nie strój." },
  { title: "Kiedy przyjść?", text: "Budynek i parking otwierają się godzinę przed wydarzeniem." },
  { title: "Gdzie zaparkować?", text: "Parking podziemny jest bezpłatny z biletem. Z parkingu winda prowadzi prosto do holu." },
  {
    title: "Kawa przed koncertem?",
    text: "Symfonia Cafe w holu i kawiarnia na 3. piętrze. Na salę nie wnosi się napojów ani przekąsek.",
  },
]
