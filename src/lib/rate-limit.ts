// Prosty limit zapytań w oknie przesuwnym, trzymany w pamięci procesu.
// Ogranicza koszt asystenta (LLM) w prototypie. Na hostingu bezserwerowym każda instancja liczy osobno,
// więc na produkcji limit powinien siedzieć we wspólnym magazynie (Redis, Upstash, KV).

const hits = new Map<string, number[]>();
const MAX_KEYS = 5000;

export type RateLimit = { ok: true } | { ok: false; retryAfter: number };

export function rateLimit(key: string, max: number, windowMs: number, now = Date.now()): RateLimit {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    hits.set(key, recent);
    return { ok: false, retryAfter: Math.max(1, Math.ceil((recent[0] + windowMs - now) / 1000)) };
  }
  recent.push(now);
  hits.set(key, recent);

  // Pamięć nie rośnie bez końca: przy dużej liczbie kluczy usuwamy te, których okno już minęło
  if (hits.size > MAX_KEYS) {
    for (const [k, times] of hits) if (times.every((t) => now - t >= windowMs)) hits.delete(k);
  }
  return { ok: true };
}

/** Adres klienta zza proxy (Vercel ustawia `x-forwarded-for`); bez niego wszyscy dzielą jeden limit */
export function clientKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}
