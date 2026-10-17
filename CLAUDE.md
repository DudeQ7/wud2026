@AGENTS.md

## Claude Code

Reguły z `AGENTS.md` (zaimportowane powyżej) obowiązują w całości — w szczególności sekcja **„ScrappedData/ — NIE indeksuj, NIE przeszukuj”**.

- Zanim uruchomisz `Glob`/`Grep`/`Explore` lub subagenta do eksploracji repo, wyklucz `ScrappedData/**` (np. `glob: "!ScrappedData/**"`). Nie startuj subagentów, żeby „zbadać” ten folder.
- Dane do aplikacji/chatbota: tylko `ScrappedData/Data/koncerty.json` (kopia robocza aplikacji: `src/data/koncerty.json`). Nie czytaj `ScrappedData/pages/`, chyba że użytkownik wskaże konkretny plik.
- Twarde blokady odczytu są w `.claude/settings.json` (`permissions.deny`). Jeśli odmowa blokuje zadanie, które użytkownik wprost zlecił, poproś go o zgodę zamiast obchodzić blokadę (np. przez `cat`/`find` w Bashu).

## Read `docs/` before doing anything

Before any task in this repo — code, mockups, Figma designs, colour or copy decisions, plans — read every file in `docs/` first:

- `docs/design.md` — **the binding design system** (colour tokens, typography, shapes, components, WCAG checklist, decision log D1–D7). Follow it for every UI, mockup and code change; it overrides `docs/mockups/strona-glowna-v2.*`
- `docs/brief_hackathon_filharmonia.md` — the hackathon brief (goals, brand, colours, typography, accessibility, required features)
- `docs/inspiracje_wspolne_cechy.md` — common patterns from the reference sites
- `docs/transkrypt.md` — transcript of the client briefing
- `docs/*.pdf` — the original brief presentation

Do not start work, propose options or make design decisions until you have read them. If your work contradicts the docs, the docs win.

### Brand rules from the docs (do not break)

- **Colours:** white, black, greys and gold only — no other colours anywhere, including concert cycles and festivals (no cycle skins, no category colours, no coloured status badges; decision D6 in `docs/design.md`). The site is monochrome; gold is used only for headings and eyebrow labels: `#8A6D2F` on white (4.87:1), `#AD9450` on black (5.91:1). Never gold on off-white, never white text on gold, no gold buttons or fills.
- **Character:** minimalism, elegance; inspired by the building (light, white, geometry, rhythm, silence, space) without copying it. No decorative coloured bars, dots, gradients or shadows.
- **Typography:** Titillium Web (headings) + Open Sans (UI and body); body text `#2B2B2B`.
- **Shapes:** border-radius 0 everywhere; chamfered corner at most 1–2 per screen.
- **Photos:** FS photos and event graphics are always used in their original form — never recolour, desaturate, cut out, filter or overlay them (`docs/design.md` §5.6). Only scale/crop via `object-fit`/`object-position`.
- **Logo:** black on light backgrounds, white on dark; never deformed.
- **Motif:** the logo's geometry (broken planes, stripe rhythm) and the hexagon — used sparingly (hexagon only for the AI assistant button).
- **Accessibility:** WCAG 2.2 AA (contrast ≥ 4.5:1, targets ≥ 44px).
- **Languages:** PL / EN / DE. Mobile first, full desktop support.
