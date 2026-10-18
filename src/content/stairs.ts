// Sekcja „Schody” (docs/schody/schody_design.md). Poziomy dostępności i strój to na razie
// PRZYKŁADOWE wartości z makiety (§6.4, §6.5, §10): realne dane musi potwierdzić FS.
// Docelowo pola w modelu wydarzenia / sali; do tego czasu jedna wartość dla wszystkich koncertów.

export type AccessKind = "motor" | "visual" | "hearing"
export type AccessLevel = "full" | "partial" | "none" | "unknown"

export const stairsAccess: Record<AccessKind, AccessLevel> = {
  motor: "partial",
  visual: "full",
  hearing: "none",
}

export const stairsOutfit = "shirt" as const

/** Liczba plakatów na schodach: 3 piętra po 3 (decyzja zespołu: maks. 3 poziomy) */
export const STAIRS_EVENT_COUNT = 9
