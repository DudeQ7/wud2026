/** Polska odmiana: 1 wydarzenie, 2–4 wydarzenia (poza 12–14), 5+ wydarzeń */
export function plural(n: number, one: string, few: string, many: string) {
  if (n === 1) return one
  const tens = n % 100
  const units = n % 10
  return units >= 2 && units <= 4 && (tens < 12 || tens > 14) ? few : many
}
