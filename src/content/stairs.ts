// Sekcja „Schody” (docs/schody/schody_design.md). Docelowo pola w modelu wydarzenia / sali; do tego czasu jedna
// wartość dla wszystkich koncertów. Dostępność według danych FS (visit.json): wejście bez progów i windy wszędzie,
// więc ruchowa = dostępne; o audiodeskrypcji i pętli dane milczą, więc „brak informacji – zapytaj obsługę”, a nie
// przykładowe „częściowo / tak / nie” z makiety, które przeczyły karcie wydarzenia i FAQ. Strój: przykład z makiety.

export type AccessKind = "motor" | "visual" | "hearing"
export type AccessLevel = "full" | "partial" | "none" | "unknown"

export const stairsAccess: Record<AccessKind, AccessLevel> = {
  motor: "full",
  visual: "unknown",
  hearing: "unknown",
}

export const stairsOutfit = "shirt" as const

/** Liczba plakatów na schodach: 3 piętra po 3 (decyzja zespołu: maks. 3 poziomy) */
export const STAIRS_EVENT_COUNT = 9
