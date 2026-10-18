# Kalendarz

Kalendarz wydarzeń na stronie `/repertuar` (§6.6, §7.2 w `docs/design.md`).

- `calendar.tsx` – lista wydarzeń z filtrami, wyszukiwarką, licznikiem wyników i stanem „brak wyników” z alternatywami. Filtry żyją w adresie URL, więc link można udostępnić, a „wstecz” z karty wydarzenia wraca do tych samych wyników. Wyniki liczone w przeglądarce, doczytywane po 30.
- `filter-sheet.tsx` – dolny arkusz filtrów na mobile.
- `calendar3d.tsx` – widok miesiąca jako fasada Filharmonii (przełącznik Lista / Miesiąc, fasada Filharmonii z obrotem 90° przy zmianie miesiąca).

Dane: `src/data/koncerty.json`.
